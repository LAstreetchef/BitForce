import type { Express, Request, Response } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import Stripe from "stripe";
import { runScraper, getRecommendationsForLead, initializeProviders } from "./services/scraper";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

const AMBASSADOR_PRICES = {
  signupFee: 2900,
  monthlySubscription: 1999,
  referralBonus: 5000,
  recurringOverridePercent: 20,
};

let cachedPriceId: string | null = null;

async function getOrCreateSubscriptionPrice(): Promise<string> {
  if (cachedPriceId) return cachedPriceId;

  const prices = await stripe.prices.list({
    lookup_keys: ["ambassador_monthly"],
    limit: 1,
  });

  if (prices.data.length > 0) {
    cachedPriceId = prices.data[0].id;
    return cachedPriceId;
  }

  const product = await stripe.products.create({
    name: "Bit Force Ambassador Subscription",
    description: "Monthly ambassador subscription with exclusive leads, training, and community access",
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: AMBASSADOR_PRICES.monthlySubscription,
    currency: "usd",
    recurring: { interval: "month" },
    lookup_key: "ambassador_monthly",
  });

  cachedPriceId = price.id;
  return cachedPriceId;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/stripe/webhook", async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;

    try {
      const rawBody = (req as any).rawBody;
      
      if (process.env.STRIPE_WEBHOOK_SECRET && rawBody) {
        event = stripe.webhooks.constructEvent(
          rawBody,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } else {
        event = req.body as Stripe.Event;
      }
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          
          if (session.metadata?.type === "ambassador_signup") {
            const { userId, email, fullName, referralCode } = session.metadata;

            let ambassador = await storage.getAmbassadorByUserId(userId);
            
            if (!ambassador) {
              ambassador = await storage.createAmbassadorSubscription({
                userId,
                email,
                fullName,
                referralCode: "",
                referredByCode: referralCode || null,
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: session.subscription as string,
                signupFeePaid: true,
                subscriptionStatus: "active",
              });

              if (referralCode) {
                const referrer = await storage.getAmbassadorByReferralCode(referralCode);
                if (referrer) {
                  await storage.createReferralBonus({
                    ambassadorId: referrer.id,
                    referredAmbassadorId: ambassador.id,
                    bonusAmount: "50.00",
                    status: "pending",
                  });
                }
              }
            } else {
              await storage.updateAmbassadorSubscription(ambassador.id, {
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: session.subscription as string,
                signupFeePaid: true,
                subscriptionStatus: "active",
              });
            }
          }
          break;
        }

        case "invoice.paid": {
          const invoice = event.data.object as Stripe.Invoice;
          const customerId = invoice.customer as string;
          
          const ambassador = await storage.getAmbassadorByStripeCustomerId(customerId);
          if (ambassador && !ambassador.firstMonthCompleted) {
            await storage.updateAmbassadorSubscription(ambassador.id, {
              firstMonthCompleted: true,
            });

            if (ambassador.referredByCode) {
              const referrer = await storage.getAmbassadorByReferralCode(ambassador.referredByCode);
              if (referrer) {
                const existingBonuses = await storage.getReferralBonusesByAmbassador(referrer.id);
                const pendingBonus = existingBonuses.find(
                  b => b.referredAmbassadorId === ambassador.id && b.status === "pending"
                );
                if (pendingBonus) {
                  await storage.updateReferralBonusStatus(pendingBonus.id, "paid", new Date());
                }

                const currentMonth = new Date().toISOString().slice(0, 7);
                await storage.createRecurringOverride({
                  ambassadorId: referrer.id,
                  referredAmbassadorId: ambassador.id,
                  monthlyAmount: "4.00",
                  month: currentMonth,
                  status: "paid",
                });
              }
            }
          }
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;
          
          const ambassador = await storage.getAmbassadorByStripeCustomerId(customerId);
          if (ambassador) {
            await storage.updateAmbassadorSubscription(ambassador.id, {
              subscriptionStatus: "canceled",
            });
          }
          break;
        }
      }

      res.json({ received: true });
    } catch (err) {
      console.error("Webhook processing error:", err);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });

  await setupAuth(app);
  registerAuthRoutes(app);

  app.post(api.leads.create.path, async (req, res) => {
    try {
      const input = api.leads.create.input.parse(req.body);
      const lead = await storage.createLead(input);
      res.status(201).json(lead);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.post(api.eventRegistrations.create.path, async (req, res) => {
    try {
      const input = api.eventRegistrations.create.input.parse(req.body);
      const registration = await storage.createEventRegistration(input);
      res.status(201).json(registration);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.post("/api/ambassador/create-checkout-session", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const userClaims = user?.claims;
      if (!userClaims?.sub) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const userId = userClaims.sub;
      const email = userClaims.email || "";
      const fullName = [userClaims.first_name, userClaims.last_name].filter(Boolean).join(" ") || "Ambassador";

      const existingAmbassador = await storage.getAmbassadorByUserId(userId);
      if (existingAmbassador && existingAmbassador.subscriptionStatus === "active") {
        return res.status(400).json({ message: "Already an active ambassador" });
      }

      const customer = await stripe.customers.create({
        email,
        name: fullName,
        metadata: {
          userId,
        },
      });

      const subscriptionPriceId = await getOrCreateSubscriptionPrice();

      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Bit Force Ambassador Sign-Up Fee",
                description: "One-time activation fee for ambassador program access",
              },
              unit_amount: AMBASSADOR_PRICES.signupFee,
            },
            quantity: 1,
          },
          {
            price: subscriptionPriceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        subscription_data: {
          metadata: {
            userId,
            type: "ambassador_subscription",
          },
        },
        success_url: `${req.headers.origin || process.env.REPLIT_DEV_DOMAIN}/portal?session_id={CHECKOUT_SESSION_ID}&success=true`,
        cancel_url: `${req.headers.origin || process.env.REPLIT_DEV_DOMAIN}/events?canceled=true`,
        metadata: {
          userId,
          email,
          fullName,
          type: "ambassador_signup",
        },
      });

      res.json({ sessionId: session.id, url: session.url });
    } catch (err) {
      console.error("Checkout session error:", err);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });

  app.get("/api/ambassador/subscription-status", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "Missing userId" });
      }

      const ambassador = await storage.getAmbassadorByUserId(userId);
      if (!ambassador) {
        return res.json({ 
          isAmbassador: false, 
          subscriptionStatus: "none",
          referralCode: null 
        });
      }

      const bonuses = await storage.getReferralBonusesByAmbassador(ambassador.id);
      const overrides = await storage.getRecurringOverridesByAmbassador(ambassador.id);

      const totalBonuses = bonuses
        .filter(b => b.status === "paid")
        .reduce((sum, b) => sum + parseFloat(b.bonusAmount || "0"), 0);
      
      const totalOverrides = overrides
        .filter(o => o.status === "paid")
        .reduce((sum, o) => sum + parseFloat(o.monthlyAmount || "0"), 0);

      res.json({
        isAmbassador: true,
        subscriptionStatus: ambassador.subscriptionStatus,
        referralCode: ambassador.referralCode,
        signupFeePaid: ambassador.signupFeePaid,
        firstMonthCompleted: ambassador.firstMonthCompleted,
        totalBonusesEarned: totalBonuses,
        totalOverridesEarned: totalOverrides,
        pendingBonuses: bonuses.filter(b => b.status === "pending").length,
        activeReferrals: bonuses.length,
      });
    } catch (err) {
      console.error("Subscription status error:", err);
      res.status(500).json({ message: "Failed to get subscription status" });
    }
  });

  app.get("/api/ambassador/program-info", async (_req: Request, res: Response) => {
    res.json({
      signupFee: AMBASSADOR_PRICES.signupFee / 100,
      monthlySubscription: AMBASSADOR_PRICES.monthlySubscription / 100,
      referralBonus: AMBASSADOR_PRICES.referralBonus / 100,
      recurringOverridePercent: AMBASSADOR_PRICES.recurringOverridePercent,
      monthlyPassivePerReferral: (AMBASSADOR_PRICES.monthlySubscription * AMBASSADOR_PRICES.recurringOverridePercent / 100) / 100,
    });
  });

  // Service Provider & Recommendations Routes
  app.get("/api/providers", async (_req: Request, res: Response) => {
    try {
      const providers = await storage.getServiceProviders();
      res.json(providers);
    } catch (err) {
      console.error("Get providers error:", err);
      res.status(500).json({ message: "Failed to get providers" });
    }
  });

  app.get("/api/providers/:id/listings", async (req: Request, res: Response) => {
    try {
      const providerId = parseInt(req.params.id);
      const listings = await storage.getProviderListings(providerId);
      res.json(listings);
    } catch (err) {
      console.error("Get listings error:", err);
      res.status(500).json({ message: "Failed to get listings" });
    }
  });

  app.get("/api/listings", async (_req: Request, res: Response) => {
    try {
      const listings = await storage.getProviderListings();
      res.json(listings);
    } catch (err) {
      console.error("Get all listings error:", err);
      res.status(500).json({ message: "Failed to get listings" });
    }
  });

  app.post("/api/recommendations", async (req: Request, res: Response) => {
    try {
      const { interests } = req.body;
      if (!interests || typeof interests !== "string") {
        return res.status(400).json({ message: "interests field is required" });
      }
      
      const recommendations = await getRecommendationsForLead(interests);
      res.json(recommendations);
    } catch (err) {
      console.error("Get recommendations error:", err);
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });

  app.get("/api/recommendations", async (req: Request, res: Response) => {
    try {
      const interests = (req.query.interests as string) || "";
      const recommendations = await getRecommendationsForLead(interests);
      res.json(recommendations);
    } catch (err) {
      console.error("Get recommendations error:", err);
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });

  app.post("/api/scraper/run", isAuthenticated, async (_req: Request, res: Response) => {
    try {
      const result = await runScraper();
      res.json(result);
    } catch (err) {
      console.error("Scraper error:", err);
      res.status(500).json({ message: "Failed to run scraper" });
    }
  });

  // Initialize providers and run scraper asynchronously after startup
  setTimeout(async () => {
    try {
      await initializeProviders();
      const result = await runScraper();
      console.log(`Scraper completed: ${result.listingsCount} listings scraped`);
    } catch (err) {
      console.error("Scraper initialization failed (will retry on manual trigger):", err);
    }
  }, 1000);

  return httpServer;
}
