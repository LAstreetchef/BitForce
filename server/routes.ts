import type { Express, Request, Response } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import Stripe from "stripe";
import { runScraper, getRecommendationsForLead, initializeProviders } from "./services/scraper";
import { enqueueScrapeJob, getScraperJobStatus } from "./services/scraperJob";
import { ACTION_POINTS, BADGE_DEFINITIONS, type BadgeType } from "@shared/schema";
import { registerImageRoutes } from "./replit_integrations/image";
import { sendLeadConfirmationEmail, sendLeadStatusUpdateEmail, sendAdminNotificationEmail } from "./services/email";

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
  // Register image generation routes (Gemini AI)
  registerImageRoutes(app);

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

  app.get("/api/leads", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (err) {
      console.error("Error fetching leads:", err);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  app.post(api.leads.create.path, async (req, res) => {
    try {
      const input = api.leads.create.input.parse(req.body);
      const lead = await storage.createLead(input);
      
      // Send confirmation email to lead and notification to admin (don't block response)
      sendLeadConfirmationEmail(lead).catch(err => console.error("Failed to send lead confirmation:", err));
      sendAdminNotificationEmail(lead).catch(err => console.error("Failed to send admin notification:", err));
      
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

  // Verify checkout session after Stripe redirect
  app.post("/api/ambassador/verify-checkout", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const userClaims = user?.claims;
      if (!userClaims?.sub) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { sessionId } = req.body;
      if (!sessionId) {
        return res.status(400).json({ message: "Missing session ID" });
      }

      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["subscription"],
      });

      if (session.payment_status !== "paid") {
        return res.status(400).json({ message: "Payment not completed" });
      }

      const sessionUserId = session.metadata?.userId;
      if (sessionUserId !== userClaims.sub) {
        return res.status(403).json({ message: "Session does not belong to this user" });
      }

      const userId = userClaims.sub;
      const email = userClaims.email || session.customer_email || "";
      const fullName = session.metadata?.fullName || [userClaims.first_name, userClaims.last_name].filter(Boolean).join(" ") || "Ambassador";

      let ambassador = await storage.getAmbassadorByUserId(userId);

      const subscription = session.subscription as any;
      const stripeSubscriptionId = typeof subscription === "string" ? subscription : subscription?.id;
      const stripeCustomerId = typeof session.customer === "string" ? session.customer : session.customer?.id || "";

      if (!ambassador) {
        const referralCode = `AMB${userId.slice(-6).toUpperCase()}${Date.now().toString(36).slice(-4).toUpperCase()}`;
        
        ambassador = await storage.createAmbassadorSubscription({
          userId,
          email,
          fullName,
          referralCode,
          subscriptionStatus: "active",
          stripeCustomerId,
          stripeSubscriptionId,
          signupFeePaid: true,
          firstMonthCompleted: false,
        });
      } else {
        await storage.updateAmbassadorSubscription(ambassador.id, {
          subscriptionStatus: "active",
          stripeCustomerId,
          stripeSubscriptionId,
          signupFeePaid: true,
        });
        ambassador = await storage.getAmbassadorByUserId(userId);
      }

      res.json({ 
        success: true, 
        isAmbassador: true,
        subscriptionStatus: "active",
        referralCode: ambassador?.referralCode,
      });
    } catch (err) {
      console.error("Verify checkout error:", err);
      res.status(500).json({ message: "Failed to verify checkout session" });
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

  // Track design generation for gamification
  app.post("/api/design-generated", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const userId = user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { leadId, roomType, style } = req.body;

      // Award points for generating design
      await storage.updateAmbassadorPoints(userId, ACTION_POINTS.GENERATE_DESIGN);
      await storage.logAmbassadorAction({
        userId,
        actionType: "GENERATE_DESIGN",
        pointsAwarded: ACTION_POINTS.GENERATE_DESIGN,
        leadId: leadId || null,
        leadServiceId: null,
        description: `Generated ${roomType} design with ${style} style`,
      });

      res.json({ 
        success: true, 
        pointsAwarded: ACTION_POINTS.GENERATE_DESIGN,
      });
    } catch (err) {
      console.error("Track design generation error:", err);
      res.status(500).json({ message: "Failed to track design generation" });
    }
  });

  app.get("/api/scraper/status/:leadId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const leadId = parseInt(req.params.leadId);
      const status = getScraperJobStatus(leadId);
      res.json(status);
    } catch (err) {
      console.error("Get scraper status error:", err);
      res.status(500).json({ message: "Failed to get scraper status" });
    }
  });

  // Lead Services API - Add/manage services for leads
  app.post("/api/leads/:leadId/services", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const userId = user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const leadId = parseInt(req.params.leadId);
      const { serviceName, listingId, notes } = req.body;
      
      if (!serviceName) {
        return res.status(400).json({ message: "serviceName is required" });
      }

      const leadService = await storage.createLeadService({
        leadId,
        listingId: listingId || null,
        serviceName,
        status: "suggested",
        notes: notes || null,
        ambassadorId: userId,
      });

      // Award points for suggesting service
      await storage.updateAmbassadorPoints(userId, ACTION_POINTS.SUGGEST_SERVICE);
      await storage.logAmbassadorAction({
        userId,
        actionType: "SUGGEST_SERVICE",
        pointsAwarded: ACTION_POINTS.SUGGEST_SERVICE,
        leadId,
        leadServiceId: leadService.id,
        description: `Suggested ${serviceName}`,
      });

      // Check for first lead badge
      const hasBadge = await storage.hasBadge(userId, "FIRST_LEAD");
      if (!hasBadge) {
        await storage.awardBadge(userId, "FIRST_LEAD");
      }

      // Trigger background scrape to refresh recommendations
      const scraperTriggered = enqueueScrapeJob(leadId);

      res.status(201).json({ 
        ...leadService, 
        scraperTriggered,
        scraperStatus: getScraperJobStatus(leadId).status 
      });
    } catch (err) {
      console.error("Create lead service error:", err);
      res.status(500).json({ message: "Failed to create lead service" });
    }
  });

  app.get("/api/leads/:leadId/services", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const leadId = parseInt(req.params.leadId);
      const services = await storage.getLeadServices(leadId);
      res.json(services);
    } catch (err) {
      console.error("Get lead services error:", err);
      res.status(500).json({ message: "Failed to get lead services" });
    }
  });

  app.patch("/api/lead-services/:id/status", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const userId = user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const id = parseInt(req.params.id);
      const { status, notes } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "status is required" });
      }

      const updatedService = await storage.updateLeadServiceStatus(id, status, notes);

      // Send status update email to lead (don't block response)
      const lead = await storage.getLead(updatedService.leadId);
      if (lead && ["contacted", "interested", "sold"].includes(status)) {
        sendLeadStatusUpdateEmail(lead, updatedService.serviceName, status)
          .catch(err => console.error("Failed to send status update email:", err));
      }

      // Award points based on status change
      let pointsToAward = 0;
      let actionType = "";
      
      if (status === "contacted") {
        pointsToAward = ACTION_POINTS.CONTACT_LEAD;
        actionType = "CONTACT_LEAD";
      } else if (status === "interested") {
        pointsToAward = ACTION_POINTS.LEAD_INTERESTED;
        actionType = "LEAD_INTERESTED";
      } else if (status === "sold") {
        pointsToAward = ACTION_POINTS.MAKE_SALE;
        actionType = "MAKE_SALE";
        
        // Check for first sale badge
        const hasBadge = await storage.hasBadge(userId, "FIRST_SALE");
        if (!hasBadge) {
          await storage.awardBadge(userId, "FIRST_SALE");
        }
      }

      if (pointsToAward > 0) {
        await storage.updateAmbassadorPoints(userId, pointsToAward);
        await storage.logAmbassadorAction({
          userId,
          actionType,
          pointsAwarded: pointsToAward,
          leadId: updatedService.leadId,
          leadServiceId: id,
          description: `Status changed to ${status}`,
        });
      }

      res.json(updatedService);
    } catch (err) {
      console.error("Update lead service status error:", err);
      res.status(500).json({ message: "Failed to update status" });
    }
  });

  // Gamification API
  app.get("/api/gamification/stats", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const userId = user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const points = await storage.getOrCreateAmbassadorPoints(userId);
      const badges = await storage.getAmbassadorBadges(userId);
      const recentActions = await storage.getAmbassadorActions(userId, 10);

      res.json({
        points,
        badges: badges.map(b => ({
          ...b,
          definition: BADGE_DEFINITIONS[b.badgeType as BadgeType] || null,
        })),
        recentActions,
      });
    } catch (err) {
      console.error("Get gamification stats error:", err);
      res.status(500).json({ message: "Failed to get stats" });
    }
  });

  app.get("/api/gamification/leaderboard", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (err) {
      console.error("Get leaderboard error:", err);
      res.status(500).json({ message: "Failed to get leaderboard" });
    }
  });

  // Support Messages ("Charlie" system) - Ambassador endpoints
  app.get("/api/support/messages", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const userId = user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // Mark support messages as read BEFORE fetching so badge clears immediately
      await storage.markMessagesAsRead(userId, "support");
      
      const messages = await storage.getSupportMessages(userId);
      res.json(messages);
    } catch (err) {
      console.error("Get support messages error:", err);
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  app.post("/api/support/messages", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const userId = user?.claims?.sub;
      const userClaims = user?.claims;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { content } = req.body;
      if (!content || typeof content !== "string" || content.trim().length === 0) {
        return res.status(400).json({ message: "Message content is required" });
      }

      const ambassadorName = [userClaims?.first_name, userClaims?.last_name].filter(Boolean).join(" ") || userClaims?.email || "Ambassador";

      const message = await storage.createSupportMessage({
        ambassadorUserId: userId,
        ambassadorName,
        content: content.trim(),
        sender: "ambassador",
        isRead: false,
      });

      res.status(201).json(message);
    } catch (err) {
      console.error("Create support message error:", err);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Admin check middleware - uses ADMIN_USER_IDS env var (comma-separated Replit user IDs)
  const isAdmin = async (req: Request, res: Response, next: Function) => {
    const user = req.user as any;
    const userId = user?.claims?.sub;
    
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const adminUserIds = (process.env.ADMIN_USER_IDS || "").split(",").map(id => id.trim()).filter(Boolean);
    
    if (adminUserIds.length === 0 || adminUserIds.includes(userId)) {
      next();
    } else {
      return res.status(403).json({ message: "Admin access required" });
    }
  };

  // Admin endpoints for support inbox
  app.get("/api/admin/support/conversations", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const conversations = await storage.getAllSupportConversations();
      res.json(conversations);
    } catch (err) {
      console.error("Get support conversations error:", err);
      res.status(500).json({ message: "Failed to get conversations" });
    }
  });

  app.get("/api/admin/support/messages/:ambassadorUserId", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const { ambassadorUserId } = req.params;
      
      // Mark ambassador messages as read BEFORE fetching
      await storage.markMessagesAsRead(ambassadorUserId, "ambassador");
      
      const messages = await storage.getSupportMessages(ambassadorUserId);
      res.json(messages);
    } catch (err) {
      console.error("Get admin support messages error:", err);
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  app.post("/api/admin/support/messages/:ambassadorUserId", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const { ambassadorUserId } = req.params;
      const { content, ambassadorName } = req.body;
      
      if (!content || typeof content !== "string" || content.trim().length === 0) {
        return res.status(400).json({ message: "Message content is required" });
      }

      const message = await storage.createSupportMessage({
        ambassadorUserId,
        ambassadorName: ambassadorName || "Ambassador",
        content: content.trim(),
        sender: "support",
        isRead: false,
      });

      res.status(201).json(message);
    } catch (err) {
      console.error("Create admin support message error:", err);
      res.status(500).json({ message: "Failed to send message" });
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
