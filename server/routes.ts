import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { createHash } from "crypto";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import Stripe from "stripe";
import { runScraper, getRecommendationsForLead, initializeProviders } from "./services/scraper";
import { enqueueScrapeJob, getScraperJobStatus } from "./services/scraperJob";
import { getPropertyReport } from "./services/propertyData";
import { askDeepSeek } from "./services/deepseek";
import { ACTION_POINTS, BADGE_DEFINITIONS, type BadgeType } from "@shared/schema";
import { awardBftTokens } from "./lib/bft-rewards";
import { registerImageRoutes } from "./replit_integrations/image";
import { sendLeadConfirmationEmail, sendLeadStatusUpdateEmail, sendAdminNotificationEmail, sendSupportChatInitiatedEmail, sendAmbassadorInviteEmail, sendAIBuddyCustomerInviteEmail } from "./services/email";
import { registerCouponAppRoutes, configureCouponAppCors } from "./services/couponAppApi";
import { Router } from "express";

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
  registerImageRoutes(app);

  const couponAppRouter = Router();
  couponAppRouter.use(configureCouponAppCors());
  registerCouponAppRoutes(couponAppRouter);
  app.use(couponAppRouter);

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
          if (!ambassador) break;

          // STEP 1: If this ambassador just completed their first month as a referral,
          // mark the referrer's bonus as "qualified" (not paid yet - referrer must pay first)
          if (!ambassador.firstMonthCompleted) {
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
                  // Mark as qualified - will be paid when referrer makes their next payment
                  await storage.markBonusQualified(pendingBonus.id);
                  console.log(`[Payout Safeguard] Bonus ${pendingBonus.id} marked as qualified. Waiting for referrer ${referrer.id} to pay.`);
                }
              }
            }
          }

          // STEP 2: This ambassador just paid their subscription.
          // Pay out any qualified bonuses they have pending (from their referrals).
          // This ensures the referrer is still actively paying before receiving payouts.
          if (ambassador.subscriptionStatus === "active") {
            const qualifiedBonuses = await storage.getQualifiedBonusesByAmbassador(ambassador.id);
            
            for (const bonus of qualifiedBonuses) {
              // Pay the $50 bonus now that the referrer has proven continued commitment
              await storage.updateReferralBonusStatus(bonus.id, "paid", new Date());
              console.log(`[Payout] Paid $50 bonus ${bonus.id} to ambassador ${ambassador.id} for referral ${bonus.referredAmbassadorId}`);
              
              // Also create the first recurring override for this referral
              const currentMonth = new Date().toISOString().slice(0, 7);
              await storage.createRecurringOverride({
                ambassadorId: ambassador.id,
                referredAmbassadorId: bonus.referredAmbassadorId,
                monthlyAmount: "4.00",
                month: currentMonth,
                status: "paid",
              });
              console.log(`[Payout] Created $4 recurring override for ambassador ${ambassador.id}`);
            }

            // STEP 3: For existing paid referrals, create monthly overrides
            // (only for referrals whose bonus was already paid in previous months)
            const allBonuses = await storage.getReferralBonusesByAmbassador(ambassador.id);
            const paidBonuses = allBonuses.filter(b => b.status === "paid");
            const currentMonth = new Date().toISOString().slice(0, 7);
            const existingOverrides = await storage.getRecurringOverridesByAmbassador(ambassador.id);
            
            for (const bonus of paidBonuses) {
              // Check if we already created an override for this referral this month
              const alreadyPaidThisMonth = existingOverrides.some(
                o => o.referredAmbassadorId === bonus.referredAmbassadorId && o.month === currentMonth
              );
              
              if (!alreadyPaidThisMonth) {
                // Verify the referred ambassador is still active
                const referredAmbassador = await storage.getAmbassadorById(bonus.referredAmbassadorId);
                if (referredAmbassador && referredAmbassador.subscriptionStatus === "active") {
                  await storage.createRecurringOverride({
                    ambassadorId: ambassador.id,
                    referredAmbassadorId: bonus.referredAmbassadorId,
                    monthlyAmount: "4.00",
                    month: currentMonth,
                    status: "paid",
                  });
                  console.log(`[Payout] Monthly $4 override for ambassador ${ambassador.id} from referral ${bonus.referredAmbassadorId}`);
                }
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
            // Mark subscription as canceled
            await storage.updateAmbassadorSubscription(ambassador.id, {
              subscriptionStatus: "canceled",
            });

            // SAFEGUARD: Forfeit all pending and qualified bonuses
            // Prevents gaming the system by signing up, referring, then canceling
            const forfeitedCount = await storage.forfeitPendingBonuses(
              ambassador.id, 
              "referrer_canceled_subscription"
            );
            
            if (forfeitedCount > 0) {
              console.log(`[Payout Safeguard] Forfeited ${forfeitedCount} pending/qualified bonuses for canceled ambassador ${ambassador.id}`);
            }
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

  // BFT TOKEN PLATFORM METRICS ENDPOINT (called by BFT platform)
  app.get("/api/metrics", async (req: Request, res: Response) => {
    try {
      // Verify API key from BFT Token Platform
      const apiKey = req.headers["x-api-key"] as string;
      const expectedKey = process.env.SYNC_API_KEY;

      if (!expectedKey) {
        console.error("[/api/metrics] SYNC_API_KEY not configured");
        return res.status(500).json({ message: "SYNC_API_KEY not configured" });
      }

      if (!apiKey || apiKey !== expectedKey) {
        return res.status(401).json({ message: "Invalid or missing API key" });
      }

      const ambassadorCount = await storage.getAmbassadorCount();
      const customerCount = await storage.getCustomerCount();
      const monthlyPurchaseVolume = await storage.getMonthlyPurchaseVolume();

      const confidenceRate = ambassadorCount > 0 ? 85 : 0;

      console.log("[/api/metrics] Returning:", { ambassadorCount, customerCount, monthlyPurchaseVolume });

      res.json({
        ambassadorCount,
        customerCount,
        monthlyPurchaseVolume,
        confidenceRate,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("[/api/metrics] Error:", err);
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  // BFT TOKEN PLATFORM ACTIVITIES ENDPOINT (called by BFT platform)
  app.get("/api/activities", async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers["x-api-key"] as string;
      const expectedKey = process.env.SYNC_API_KEY;

      if (!expectedKey) {
        console.error("[/api/activities] SYNC_API_KEY not configured");
        return res.status(500).json({ message: "SYNC_API_KEY not configured" });
      }

      if (!apiKey || apiKey !== expectedKey) {
        return res.status(401).json({ message: "Invalid or missing API key" });
      }

      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const source = req.query.source as string;
      
      const activityTypeMap: Record<string, string> = {
        'SUGGEST_SERVICE': 'customer_onboarded',
        'CONTACT_LEAD': 'customer_onboarded',
        'LEAD_INTERESTED': 'customer_onboarded',
        'MAKE_SALE': 'purchase_made',
        'DAILY_LOGIN': 'tokens_earned',
        'STREAK_BONUS_7': 'bonus_earned',
        'STREAK_BONUS_30': 'bonus_earned',
        'GENERATE_DESIGN': 'tokens_earned',
        'AMBASSADOR_JOINED': 'ambassador_joined',
        'COMPLETE_LESSON': 'training_completed',
        'COMPLETE_MODULE': 'training_completed',
      };

      // If source=ledger, pull from bftTransactions table (authoritative BFT ledger)
      if (source === 'ledger') {
        const transactions = await storage.getAllRecentBftTransactions(limit);
        const ledgerActivities = transactions.map(tx => ({
          id: `txn-${tx.id}`,
          type: activityTypeMap[tx.transactionType] || 'tokens_earned',
          actorName: tx.ambassadorName,
          description: tx.description || `Earned ${tx.amount} BFT for ${tx.transactionType.toLowerCase().replace(/_/g, ' ')}`,
          value: parseFloat(tx.amount),
          timestamp: tx.createdAt?.toISOString() || new Date().toISOString(),
          transactionType: tx.transactionType,
          referenceId: tx.referenceId,
          referenceType: tx.referenceType,
          metadata: tx.metadata ? JSON.parse(tx.metadata) : null,
        }));
        return res.json(ledgerActivities);
      }

      // Default: pull from ambassador actions (legacy)
      const recentActions = await storage.getAllRecentActions(limit);
      const activities = recentActions.map(action => {
        const bftTokens = Math.floor(action.pointsAwarded / 10);
        return {
          id: `action-${action.id}`,
          type: activityTypeMap[action.actionType] || 'tokens_earned',
          actorName: action.actorName,
          description: action.description || `Earned ${bftTokens} BFT for ${action.actionType.toLowerCase().replace(/_/g, ' ')}`,
          value: bftTokens,
          timestamp: action.createdAt?.toISOString() || new Date().toISOString(),
        };
      });

      res.json(activities);
    } catch (err) {
      console.error("[/api/activities] Error:", err);
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  // AMBASSADOR BFT LEADERBOARD SYNC ENDPOINT (for BitForceToken app to pull data)
  app.get("/api/sync/ambassadors/bft-leaderboard", async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers["x-api-key"] as string;
      const expectedKey = process.env.SYNC_API_KEY;

      if (!expectedKey) {
        console.error("[/api/sync/ambassadors/bft-leaderboard] SYNC_API_KEY not configured");
        return res.status(500).json({ message: "SYNC_API_KEY not configured" });
      }

      if (!apiKey || apiKey !== expectedKey) {
        return res.status(401).json({ message: "Invalid or missing API key" });
      }

      const { pointsToBft } = await import("./lib/bft-rewards");
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

      // Get all ambassadors with their BFT balances
      const ambassadors = await storage.getAmbassadorsWithBftBalances(limit);

      const leaderboard = ambassadors.map((amb: any, index: number) => {
        // Combine ledger BFT + legacy points-derived BFT
        const ledgerBft = parseFloat(amb.bftBalance || "0");
        const legacyBft = pointsToBft(amb.totalPoints || 0);
        const totalBft = ledgerBft + legacyBft;

        return {
          rank: index + 1,
          ambassadorId: amb.id,
          name: amb.name || amb.username || `Ambassador ${amb.id}`,
          email: amb.email,
          bftBalance: totalBft.toFixed(2),
          ledgerBft: ledgerBft.toFixed(2),
          legacyBft: legacyBft.toFixed(2),
          totalPoints: amb.totalPoints || 0,
          referralCount: amb.referralCount || 0,
          joinedAt: amb.createdAt,
        };
      }).sort((a: any, b: any) => parseFloat(b.bftBalance) - parseFloat(a.bftBalance));

      res.json({
        success: true,
        count: leaderboard.length,
        leaderboard,
        lastUpdated: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error("[/api/sync/ambassadors/bft-leaderboard] Error:", err.message);
      res.status(500).json({ message: "Failed to fetch ambassador leaderboard" });
    }
  });

  // BFT TOKEN ENDPOINTS (for ambassador dashboard to fetch from BFT platform)
  app.get("/api/bft/token-price", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { bftApiClient } = await import("./lib/bft-api-client");
      
      if (!bftApiClient.isAvailable()) {
        return res.status(503).json({ 
          message: "BFT integration not configured",
          tokenPrice: null 
        });
      }

      const metrics = await bftApiClient.getTokenMetrics();
      // Transform BFT platform response to frontend-facing format
      const priceChangeStr = metrics.priceChange || "0.00%";
      const priceChange24h = parseFloat(priceChangeStr.replace('%', '')) || 0;
      
      res.json({
        tokenPrice: metrics.currentPrice,
        priceChange24h,
        lastUpdated: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error("[/api/bft/token-price] Error:", err.message);
      res.status(500).json({ message: "Failed to fetch token price" });
    }
  });

  // WALLET STATUS ENDPOINT - Get current ambassador's wallet linking status from Token Platform
  app.get("/api/ambassador/wallet-status", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { bftApiClient } = await import("./lib/bft-api-client");
      const user = req.user as any;
      
      if (!user?.id) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      if (!bftApiClient.isAvailable()) {
        return res.status(503).json({ 
          message: "BFT integration not configured",
          walletStatus: null 
        });
      }

      const ambassador = await storage.getAmbassadorByUserId(user.id);
      if (!ambassador) {
        return res.json({
          walletStatus: null,
          hasVerifiedWallet: false,
          hasPendingWallet: false,
          eligibleForDistribution: false,
          tokensEarned: 0,
          message: "Ambassador not found"
        });
      }

      const externalId = `portal-${ambassador.id}`;
      const walletStatus = await bftApiClient.getAmbassadorWalletStatus(externalId);
      res.json(walletStatus);
    } catch (err: any) {
      console.error("[/api/ambassador/wallet-status] Error:", err.message);
      // Return graceful fallback for network errors
      res.json({
        walletStatus: null,
        hasVerifiedWallet: false,
        hasPendingWallet: false,
        eligibleForDistribution: false,
        tokensEarned: 0,
        error: err.message
      });
    }
  });

  // DISTRIBUTION ELIGIBILITY ENDPOINT - Get all ambassadors' distribution eligibility
  app.get("/api/bft/distribution-eligibility", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { bftApiClient } = await import("./lib/bft-api-client");
      
      if (!bftApiClient.isAvailable()) {
        return res.status(503).json({ message: "BFT integration not configured" });
      }

      const network = (req.query.network as 'devnet' | 'mainnet') || 'mainnet';
      const eligibility = await bftApiClient.getDistributionEligibility(network);
      res.json(eligibility);
    } catch (err: any) {
      console.error("[/api/bft/distribution-eligibility] Error:", err.message);
      res.status(500).json({ message: "Failed to fetch distribution eligibility" });
    }
  });

  app.post("/api/bft/convert-points", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { bftApiClient } = await import("./lib/bft-api-client");
      const user = req.user as any;
      
      if (!user?.id) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      if (!bftApiClient.isAvailable()) {
        return res.status(503).json({ message: "BFT integration not configured" });
      }

      const { pointsToConvert, walletAddress } = req.body;
      
      if (!pointsToConvert || typeof pointsToConvert !== 'number' || pointsToConvert < 10) {
        return res.status(400).json({ message: "Minimum 10 points required for conversion" });
      }

      // Get ambassador's current points
      const ambassador = await storage.getAmbassadorByUserId(user.id);
      if (!ambassador) {
        return res.status(404).json({ message: "Ambassador not found" });
      }

      const pointsRecord = await storage.getOrCreateAmbassadorPoints(user.id);
      const currentPoints = pointsRecord?.totalPoints || 0;

      if (currentPoints < pointsToConvert) {
        return res.status(400).json({ 
          message: `Insufficient points. You have ${currentPoints} points.` 
        });
      }

      // Call BFT platform to convert points
      const result = await bftApiClient.convertPoints({
        ambassadorId: ambassador.id.toString(),
        pointsToConvert,
        walletAddress,
      });

      // Deduct points locally after successful conversion
      if (result.success) {
        await storage.updateAmbassadorPoints(user.id, -pointsToConvert);
      }

      res.json({
        success: result.success,
        pointsConverted: result.pointsConverted,
        bftTokensReceived: result.bftTokensReceived,
        conversionRate: result.conversionRate,
        newPointsBalance: currentPoints - pointsToConvert,
      });
    } catch (err: any) {
      console.error("[/api/bft/convert-points] Error:", err.message);
      res.status(500).json({ message: "Failed to convert points" });
    }
  });

  app.get("/api/bft/leaderboard", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { bftApiClient } = await import("./lib/bft-api-client");
      
      if (!bftApiClient.isAvailable()) {
        return res.status(503).json({ message: "BFT integration not configured" });
      }

      const limit = parseInt(req.query.limit as string) || 10;
      const result = await bftApiClient.getLeaderboard(limit);
      
      res.json(result);
    } catch (err: any) {
      console.error("[/api/bft/leaderboard] Error:", err.message);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // One-time migration: Convert all legacy points to BFT tokens
  app.post("/api/bft/migrate-points", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { bftApiClient } = await import("./lib/bft-api-client");
      const { pointsToBft } = await import("./lib/bft-rewards");
      const user = req.user as any;
      const userId = user?.claims?.sub;

      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      if (!bftApiClient.isAvailable()) {
        return res.status(503).json({ message: "BFT platform not configured" });
      }

      const ambassador = await storage.getAmbassadorByUserId(userId);
      if (!ambassador) {
        return res.status(404).json({ message: "Ambassador not found" });
      }

      const pointsRecord = await storage.getOrCreateAmbassadorPoints(userId);
      const currentPoints = pointsRecord?.totalPoints || 0;

      if (currentPoints < 10) {
        return res.status(400).json({ 
          message: "Minimum 10 points required for migration",
          currentPoints 
        });
      }

      // Convert all legacy points to BFT
      const result = await bftApiClient.convertPoints({
        ambassadorId: ambassador.id.toString(),
        pointsToConvert: currentPoints,
      });

      if (result.success) {
        // Reset local points to 0 after successful migration
        await storage.updateAmbassadorPoints(userId, -currentPoints);
      }

      res.json({
        success: result.success,
        pointsMigrated: currentPoints,
        bftTokensReceived: result.bftTokensReceived || pointsToBft(currentPoints),
        message: result.success 
          ? "Successfully migrated all points to BFT tokens!" 
          : "Migration failed, please try again",
      });
    } catch (err: any) {
      console.error("[/api/bft/migrate-points] Error:", err.message);
      res.status(500).json({ message: "Failed to migrate points" });
    }
  });

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
        onboardingCompleted: ambassador.onboardingCompleted,
        onboardingStep: ambassador.onboardingStep,
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

  app.post("/api/ambassador/onboarding", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const authenticatedUserId = user?.claims?.sub;
      const { userId, step, data } = req.body;
      
      if (!authenticatedUserId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      if (!userId) {
        return res.status(400).json({ message: "Missing userId" });
      }

      if (authenticatedUserId !== userId) {
        return res.status(403).json({ message: "Unauthorized: cannot update another user's onboarding" });
      }

      if (typeof step !== "number" || step < 0 || step > 3) {
        return res.status(400).json({ message: "Invalid step value" });
      }

      const ambassador = await storage.getAmbassadorByUserId(userId);
      if (!ambassador) {
        return res.status(404).json({ message: "Ambassador not found" });
      }

      const updates: Partial<typeof ambassador> = {
        onboardingStep: step,
      };

      if (data?.fullName && typeof data.fullName === "string") {
        updates.fullName = data.fullName.trim();
      }
      if (data?.phone && typeof data.phone === "string") {
        updates.phone = data.phone.trim();
      }
      if (data?.email && typeof data.email === "string") {
        updates.email = data.email.trim();
      }
      if (data?.referredByCode !== undefined) {
        updates.referredByCode = data.referredByCode ? String(data.referredByCode).trim() : null;
      }
      
      if (data?.agreedToTerms === true) {
        updates.agreedToTerms = true;
        updates.agreedToTermsAt = new Date();
      }

      if (step >= 3 && data?.agreedToTerms === true) {
        updates.onboardingCompleted = true;
      }

      const updated = await storage.updateAmbassadorSubscription(ambassador.id, updates);

      res.json({
        success: true,
        onboardingStep: updated.onboardingStep,
        onboardingCompleted: updated.onboardingCompleted,
      });
    } catch (err) {
      console.error("Onboarding update error:", err);
      res.status(500).json({ message: "Failed to update onboarding" });
    }
  });

  app.get("/api/ambassador/onboarding-status", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const authenticatedUserId = user?.claims?.sub;
      const userId = req.query.userId as string;
      
      if (!authenticatedUserId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      if (!userId) {
        return res.status(400).json({ message: "Missing userId" });
      }

      if (authenticatedUserId !== userId) {
        return res.status(403).json({ message: "Unauthorized: cannot access another user's onboarding status" });
      }

      const ambassador = await storage.getAmbassadorByUserId(userId);
      if (!ambassador) {
        return res.json({ 
          exists: false,
          onboardingCompleted: false,
          onboardingStep: 0,
        });
      }

      res.json({
        exists: true,
        onboardingCompleted: ambassador.onboardingCompleted,
        onboardingStep: ambassador.onboardingStep,
        fullName: ambassador.fullName,
        email: ambassador.email,
        phone: ambassador.phone,
        referredByCode: ambassador.referredByCode,
        agreedToTerms: ambassador.agreedToTerms,
      });
    } catch (err) {
      console.error("Onboarding status error:", err);
      res.status(500).json({ message: "Failed to get onboarding status" });
    }
  });

  // SSO Token Generation for BitForceToken Platform
  app.get("/api/ambassador/sso-token", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = user.claims?.sub || user.id;
      const ambassador = await storage.getAmbassadorByUserId(userId);
      
      if (!ambassador) {
        return res.status(404).json({ message: "Ambassador not found" });
      }

      const ssoSecret = process.env.SSO_SECRET;
      if (!ssoSecret) {
        console.error("[/api/ambassador/sso-token] SSO_SECRET not configured");
        return res.status(500).json({ message: "SSO not configured" });
      }

      // Fetch ambassador's BFT balance for syncing with Token Platform
      const ledgerBalanceRaw = await storage.getAmbassadorBftBalance(ambassador.id);
      const ledgerBalance = parseFloat(ledgerBalanceRaw || "0") || 0;
      const { pointsToBft } = await import("./lib/bft-rewards");
      const localPoints = await storage.getOrCreateAmbassadorPoints(userId);
      const totalPoints = localPoints?.totalPoints ?? 0;
      const legacyBft = pointsToBft(totalPoints);
      const totalEarnedBft = ledgerBalance + legacyBft;

      const crypto = await import("crypto");
      const payload = {
        email: ambassador.email,
        name: ambassador.fullName,
        ambassadorId: ambassador.id.toString(),
        tokenBalance: totalEarnedBft,  // BFT earned in Ambassador Portal to sync with Token Platform
        exp: Date.now() + 5 * 60 * 1000  // 5 minute expiry
      };

      const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64');
      const signature = crypto.createHmac('sha256', ssoSecret).update(payloadB64).digest('hex');
      const ssoToken = `${payloadB64}.${signature}`;

      res.json({ 
        redirectUrl: `https://bitforcetoken.replit.app/wallet?sso_token=${encodeURIComponent(ssoToken)}`
      });
    } catch (err: any) {
      console.error("[/api/ambassador/sso-token] Error:", err.message);
      res.status(500).json({ message: "Failed to generate SSO token" });
    }
  });

  // Combined Wallet Balance (Earned + Purchased from BitForceToken)
  app.get("/api/ambassador/wallet-balance", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = user.claims?.sub || user.id;
      
      const ambassador = await storage.getAmbassadorByUserId(userId);
      if (!ambassador) {
        return res.json({ 
          earnedBft: 0, 
          purchasedBft: 0, 
          totalBft: 0,
          totalInvested: 0,
          purchaseCount: 0
        });
      }

      // Get earned BFT from both sources:
      // 1. New BFT ledger (ambassadorSubscriptions.bftBalance)
      // 2. Legacy gamification points converted to BFT
      const ledgerBalanceRaw = await storage.getAmbassadorBftBalance(ambassador.id);
      const ledgerBalance = parseFloat(ledgerBalanceRaw || "0") || 0;
      const { pointsToBft } = await import("./lib/bft-rewards");
      const localPoints = await storage.getOrCreateAmbassadorPoints(userId);
      const legacyBft = pointsToBft(localPoints.totalPoints);
      const earnedBft = ledgerBalance + legacyBft;

      // Fetch purchased BFT from BitForceToken platform
      const { fetchPurchasedBftBalance } = await import("./services/bitforceToken");
      const purchasedData = await fetchPurchasedBftBalance(ambassador.email);

      const purchasedBft = purchasedData?.purchasedBft || 0;
      const totalBft = earnedBft + purchasedBft;

      res.json({ 
        earnedBft: parseFloat(earnedBft.toFixed(2)),
        purchasedBft,
        totalBft: parseFloat(totalBft.toFixed(2)),
        totalInvested: purchasedData?.totalInvested || 0,
        purchaseCount: purchasedData?.purchaseCount || 0,
        lastPurchaseDate: purchasedData?.lastPurchaseDate || null,
      });
    } catch (err: any) {
      console.error("Get wallet balance error:", err);
      res.status(500).json({ message: "Failed to get wallet balance" });
    }
  });

  // BFT Token Tracking Routes
  app.get("/api/ambassador/bft/balance", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = user.claims?.sub || user.id;
      
      const ambassador = await storage.getAmbassadorByUserId(userId);
      if (!ambassador) {
        return res.json({ balance: "0", legacyBft: "0", transactions: [] });
      }

      // Get BFT from both sources and combine them:
      // 1. New BFT ledger (ambassadorSubscriptions.bftBalance) - for direct awards
      // 2. Legacy gamification points converted to BFT - for existing activity
      const ledgerBalance = await storage.getAmbassadorBftBalance(ambassador.id);
      
      const { pointsToBft } = await import("./lib/bft-rewards");
      const localPoints = await storage.getOrCreateAmbassadorPoints(userId);
      const legacyBft = pointsToBft(localPoints.totalPoints);
      
      // Total balance = ledger BFT + legacy points-derived BFT
      const totalBft = parseFloat(ledgerBalance) + legacyBft;
      
      const transactions = await storage.getBftTransactions(ambassador.id, 20);

      res.json({ 
        balance: totalBft.toFixed(2),
        ledgerBft: ledgerBalance,
        legacyBft: legacyBft.toFixed(2),
        lastUpdated: ambassador.bftLastUpdated,
        transactions 
      });
    } catch (err: any) {
      console.error("Get BFT balance error:", err);
      res.status(500).json({ message: "Failed to get BFT balance" });
    }
  });

  app.get("/api/ambassador/bft/transactions", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const ambassador = await storage.getAmbassadorByUserId(user.id);
      if (!ambassador) {
        return res.json([]);
      }

      const limit = parseInt(req.query.limit as string) || 50;
      const transactions = await storage.getBftTransactions(ambassador.id, limit);

      res.json(transactions);
    } catch (err: any) {
      console.error("Get BFT transactions error:", err);
      res.status(500).json({ message: "Failed to get BFT transactions" });
    }
  });

  // Internal function to award BFT - called by other parts of the system
  const awardBftToAmbassador = async (
    ambassadorId: number,
    transactionType: string,
    amount: number,
    description?: string,
    referenceId?: string,
    referenceType?: string,
    metadata?: Record<string, unknown>
  ) => {
    // Validate amount
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Invalid amount: must be a positive number");
    }

    const allowedTypes = [
      'daily_login', 'ambassador_signup', 'customer_contact', 
      'interest_shown', 'sale_closed', 'streak_7day', 'streak_30day', 
      'service_logged', 'admin_adjustment', 'referral_bonus'
    ];
    if (!allowedTypes.includes(transactionType)) {
      throw new Error(`Invalid transaction type: ${transactionType}`);
    }

    return storage.recordBftTransaction(
      ambassadorId,
      transactionType,
      amount,
      description,
      referenceId,
      referenceType,
      metadata
    );
  };

  // Expose the awardBftToAmbassador function for internal use
  (app as any).awardBftToAmbassador = awardBftToAmbassador;

  // Admin-only endpoint for manual BFT awards
  app.post("/api/admin/bft/award", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Check if user is admin
      const adminUserIds = (process.env.ADMIN_USER_IDS || "").split(",").map((id: string) => id.trim()).filter(Boolean);
      const isUserAdmin = adminUserIds.length === 0 || adminUserIds.includes(user.id);
      if (!isUserAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { ambassadorId, transactionType, amount, description, referenceId, referenceType, metadata } = req.body;

      if (!ambassadorId || !transactionType || amount === undefined) {
        return res.status(400).json({ message: "Missing ambassadorId, transactionType, or amount" });
      }

      const parsedAmount = parseFloat(amount);
      if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ message: "Amount must be a positive number" });
      }

      const transaction = await awardBftToAmbassador(
        parseInt(ambassadorId),
        transactionType,
        parsedAmount,
        description,
        referenceId,
        referenceType,
        metadata
      );

      const newBalance = await storage.getAmbassadorBftBalance(parseInt(ambassadorId));

      res.json({ 
        success: true,
        transaction,
        newBalance
      });
    } catch (err: any) {
      console.error("Award BFT error:", err);
      res.status(500).json({ message: "Failed to award BFT" });
    }
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

      // Award BFT tokens for generating design
      const bftResult = await awardBftTokens(
        userId,
        "GENERATE_DESIGN",
        ACTION_POINTS.GENERATE_DESIGN,
        `Generated ${roomType} design with ${style} style`,
        { leadId, roomType, style }
      );

      // Also log locally for history
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
        bftAwarded: bftResult.bftAwarded,
        pointsEquivalent: ACTION_POINTS.GENERATE_DESIGN,
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

      // Award BFT tokens for suggesting service
      const bftResult = await awardBftTokens(
        userId,
        "SUGGEST_SERVICE",
        ACTION_POINTS.SUGGEST_SERVICE,
        `Suggested ${serviceName}`,
        { leadId, serviceName, listingId }
      );

      // Also log locally for history
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
      let bftTransactionType = ""; // Use snake_case for BFT ledger
      
      if (status === "contacted") {
        pointsToAward = ACTION_POINTS.CONTACT_LEAD;
        actionType = "CONTACT_LEAD";
        bftTransactionType = "customer_contact";
      } else if (status === "interested") {
        pointsToAward = ACTION_POINTS.LEAD_INTERESTED;
        actionType = "LEAD_INTERESTED";
        bftTransactionType = "interest_shown";
      } else if (status === "sold") {
        pointsToAward = ACTION_POINTS.MAKE_SALE;
        actionType = "MAKE_SALE";
        bftTransactionType = "sale_closed";
        
        // Check for first sale badge
        const hasBadge = await storage.hasBadge(userId, "FIRST_SALE");
        if (!hasBadge) {
          await storage.awardBadge(userId, "FIRST_SALE");
        }
      }

      if (pointsToAward > 0) {
        // Award BFT tokens for status change (use snake_case type for ledger)
        await awardBftTokens(
          userId,
          bftTransactionType,
          pointsToAward,
          `Status changed to ${status}`,
          { leadId: updatedService.leadId, leadServiceId: id, status }
        );

        // Also log locally for history
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

  // Gamification API - returns both BFT balance (when available) and local points
  app.get("/api/gamification/stats", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const userId = user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // Always get local points (used for levels, streaks, leaderboard)
      const localPoints = await storage.getOrCreateAmbassadorPoints(userId);
      const badges = await storage.getAmbassadorBadges(userId);
      const recentActions = await storage.getAmbassadorActions(userId, 10);

      // Try to get BFT balance from token price endpoint (lightweight check)
      let bftBalance = 0;
      let bftPlatformAvailable = false;
      
      try {
        const { pointsToBft } = await import("./lib/bft-rewards");
        const { bftApiClient } = await import("./lib/bft-api-client");
        
        if (bftApiClient.isAvailable()) {
          // Estimate BFT balance from local points (conversion rate: 10 pts = 1 BFT)
          bftBalance = pointsToBft(localPoints.totalPoints);
          bftPlatformAvailable = true;
        }
      } catch (err) {
        console.log("[gamification/stats] BFT calculation error, using local points only");
      }

      res.json({
        bftBalance,
        bftPlatformAvailable,
        legacyPoints: localPoints,
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

  // Daily check-in endpoint - awards BFT for daily login
  app.post("/api/ambassador/daily-checkin", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const userId = user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const ambassador = await storage.getAmbassadorByUserId(userId);
      if (!ambassador) {
        return res.status(404).json({ message: "Ambassador not found" });
      }

      // Check if already claimed daily login today
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const dailyLoginKey = `${userId}_daily_${today}`;
      
      const alreadyClaimed = await storage.hasBftTransaction(
        ambassador.id,
        'daily_login',
        dailyLoginKey
      );

      if (alreadyClaimed) {
        return res.json({
          success: true,
          alreadyClaimed: true,
          message: "Daily login already claimed today",
          bftAwarded: 0,
        });
      }

      // Calculate streak
      const localPoints = await storage.getOrCreateAmbassadorPoints(userId);
      const lastActivityDate = localPoints.lastActivityDate;
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayStr = yesterdayDate.toISOString().split('T')[0];
      
      let newStreak = 1;
      if (lastActivityDate) {
        const lastDateStr = lastActivityDate.toISOString().split('T')[0];
        if (lastDateStr === yesterdayStr) {
          // Consecutive day - increment streak
          newStreak = (localPoints.currentStreak || 0) + 1;
        } else if (lastDateStr === today) {
          // Same day - keep streak
          newStreak = localPoints.currentStreak || 1;
        }
        // Otherwise reset to 1
      }

      // Award daily login BFT (0.2 BFT = 2 points)
      const DAILY_LOGIN_BFT = 0.2;
      await storage.recordBftTransaction(
        ambassador.id,
        'daily_login',
        DAILY_LOGIN_BFT,
        'Daily login reward',
        dailyLoginKey,
        'daily',
        { date: today, streak: newStreak }
      );
      console.log(`[Daily Checkin] Awarded ${DAILY_LOGIN_BFT} BFT to ambassador ${ambassador.id} for daily login (streak: ${newStreak})`);

      // Update streak and last activity
      const longestStreak = Math.max(localPoints.longestStreak || 0, newStreak);
      await storage.updateStreakAndActivity(userId, newStreak, longestStreak, new Date());

      // Check for streak bonuses
      let streakBonusAwarded = 0;
      
      // 7-day streak bonus
      if (newStreak === 7) {
        const streakKey = `${userId}_streak7_${today}`;
        const alreadyHas7Streak = await storage.hasBftTransaction(ambassador.id, 'streak_7day', streakKey);
        if (!alreadyHas7Streak) {
          const STREAK_7_BFT = 2.5;
          await storage.recordBftTransaction(
            ambassador.id,
            'streak_7day',
            STREAK_7_BFT,
            '7-day login streak bonus',
            streakKey,
            'streak',
            { streakDays: 7 }
          );
          streakBonusAwarded += STREAK_7_BFT;
          console.log(`[Daily Checkin] Awarded ${STREAK_7_BFT} BFT for 7-day streak to ambassador ${ambassador.id}`);
        }
      }

      // 30-day streak bonus
      if (newStreak === 30) {
        const streakKey = `${userId}_streak30_${today}`;
        const alreadyHas30Streak = await storage.hasBftTransaction(ambassador.id, 'streak_30day', streakKey);
        if (!alreadyHas30Streak) {
          const STREAK_30_BFT = 10;
          await storage.recordBftTransaction(
            ambassador.id,
            'streak_30day',
            STREAK_30_BFT,
            '30-day login streak bonus',
            streakKey,
            'streak',
            { streakDays: 30 }
          );
          streakBonusAwarded += STREAK_30_BFT;
          console.log(`[Daily Checkin] Awarded ${STREAK_30_BFT} BFT for 30-day streak to ambassador ${ambassador.id}`);
        }
      }

      res.json({
        success: true,
        alreadyClaimed: false,
        bftAwarded: DAILY_LOGIN_BFT + streakBonusAwarded,
        dailyBft: DAILY_LOGIN_BFT,
        streakBonus: streakBonusAwarded,
        currentStreak: newStreak,
        longestStreak,
      });
    } catch (err) {
      console.error("Daily checkin error:", err);
      res.status(500).json({ message: "Failed to process daily checkin" });
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

      // Check if this is a new chat (first message from this ambassador)
      const existingMessages = await storage.getSupportMessages(userId);
      const isNewChat = existingMessages.length === 0;

      const message = await storage.createSupportMessage({
        ambassadorUserId: userId,
        ambassadorName,
        content: content.trim(),
        sender: "ambassador",
        isRead: false,
      });

      // Send email notification to admin if this is a new chat initiation
      if (isNewChat) {
        sendSupportChatInitiatedEmail(ambassadorName, userId, content.trim())
          .catch(err => console.error("Failed to send support chat notification:", err));
      }

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

  // Ambassador Invitations
  app.post("/api/ambassador/invite", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const inviteSchema = z.object({
        inviteeName: z.string().min(2, "Name must be at least 2 characters"),
        inviteeEmail: z.string().email("Please enter a valid email"),
      });

      const parseResult = inviteSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: parseResult.error.errors[0].message });
      }

      const { inviteeName, inviteeEmail } = parseResult.data;

      const ambassador = await storage.getAmbassadorByUserId(user.id);
      let referralCode = ambassador?.referralCode;
      
      if (!referralCode) {
        const idStr = String(user.id || "");
        referralCode = "BFTEAM" + idStr.substring(0, 6).toUpperCase();
      }

      const inviterName = user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}`.trim()
        : user.email || "Ambassador";

      const invitation = await storage.createAmbassadorInvitation({
        inviterUserId: String(user.id),
        inviterName,
        inviteeEmail,
        inviteeName,
        referralCode,
        status: "pending",
      });

      const emailSent = await sendAmbassadorInviteEmail(
        inviteeName,
        inviteeEmail,
        inviterName,
        referralCode
      );

      res.status(201).json({ 
        invitation, 
        emailSent,
        message: emailSent ? "Invitation sent successfully!" : "Invitation saved (email not configured)"
      });
    } catch (err: any) {
      console.error("Ambassador invite error:", err);
      if (err.message?.includes("ambassador_invitations") || err.code === "42P01") {
        return res.status(503).json({ 
          message: "Invitations feature is being set up. Please try again in a few minutes.",
          error: "table_not_ready"
        });
      }
      res.status(500).json({ message: "Failed to send invitation. Please try again." });
    }
  });

  app.get("/api/ambassador/invitations", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const invitations = await storage.getInvitationsByInviter(user.id);
      res.json(invitations);
    } catch (err: any) {
      console.error("Get invitations error:", err);
      if (err.message?.includes("ambassador_invitations") || err.code === "42P01") {
        return res.json([]);
      }
      res.status(500).json({ message: "Failed to get invitations" });
    }
  });

  // Ambassador Contacts - upload and manage personal network
  const contactSchema = z.object({
    fullName: z.string().min(1, "Name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().optional(),
    notes: z.string().optional(),
  });

  const sendEmailSchema = z.object({
    contactIds: z.array(z.number()).min(1, "At least one contact required"),
    emailType: z.enum(["ambassador_invite", "customer_invite"], {
      errorMap: () => ({ message: "Email type must be 'ambassador_invite' or 'customer_invite'" })
    }),
  });

  app.get("/api/ambassador/contacts", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const contacts = await storage.getAmbassadorContacts(user.id);
      res.json(contacts);
    } catch (err: any) {
      console.error("Get contacts error:", err);
      if (err.message?.includes("ambassador_contacts") || err.code === "42P01") {
        return res.json([]);
      }
      res.status(500).json({ message: "Failed to get contacts" });
    }
  });

  app.post("/api/ambassador/contacts", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const parsed = contactSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid contact data", errors: parsed.error.errors });
      }

      const contact = await storage.createAmbassadorContact({
        ...parsed.data,
        ambassadorUserId: user.id,
      });
      res.status(201).json(contact);
    } catch (err: any) {
      console.error("Create contact error:", err);
      res.status(500).json({ message: "Failed to create contact" });
    }
  });

  app.post("/api/ambassador/contacts/bulk", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user || !user.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = String(user.id);
      const { contacts } = req.body;
      if (!Array.isArray(contacts)) {
        return res.status(400).json({ message: "Contacts must be an array" });
      }

      const validContacts: any[] = [];
      const errors: any[] = [];

      for (let i = 0; i < contacts.length; i++) {
        const parsed = contactSchema.safeParse(contacts[i]);
        if (parsed.success) {
          validContacts.push({
            fullName: parsed.data.fullName,
            email: parsed.data.email,
            phone: parsed.data.phone || null,
            notes: parsed.data.notes || null,
            ambassadorUserId: userId,
          });
        } else {
          errors.push({ index: i, errors: parsed.error.errors });
        }
      }

      if (validContacts.length === 0) {
        return res.status(400).json({ message: "No valid contacts found", errors });
      }

      const created = await storage.createAmbassadorContacts(validContacts);
      res.status(201).json({ 
        contacts: created, 
        imported: created.length,
        errors: errors.length > 0 ? errors : undefined 
      });
    } catch (err: any) {
      console.error("Bulk create contacts error:", err);
      res.status(500).json({ message: "Failed to import contacts" });
    }
  });

  app.delete("/api/ambassador/contacts/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid contact ID" });
      }

      const deleted = await storage.deleteAmbassadorContact(id, user.id);
      if (!deleted) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json({ success: true });
    } catch (err: any) {
      console.error("Delete contact error:", err);
      res.status(500).json({ message: "Failed to delete contact" });
    }
  });

  // Send emails to contacts
  app.post("/api/ambassador/contacts/send-email", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const parsed = sendEmailSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          message: "Invalid request",
          errors: parsed.error.errors.map(e => e.message)
        });
      }

      const { contactIds, emailType } = parsed.data;

      // Get ambassador info for the referral code
      const ambassador = await storage.getAmbassadorByUserId(user.id);
      const referralCode = ambassador?.referralCode || "BITFORCE";
      const inviterName = user.username || user.firstName || "Your Friend";

      // Get contacts - only contacts owned by this ambassador
      const allContacts = await storage.getAmbassadorContacts(user.id);
      const contactsToEmail = allContacts.filter(c => contactIds.includes(c.id));

      if (contactsToEmail.length === 0) {
        return res.status(404).json({ message: "No matching contacts found" });
      }

      const results: { contactId: number; success: boolean; error?: string }[] = [];

      for (const contact of contactsToEmail) {
        try {
          let emailSent = false;
          
          if (emailType === "ambassador_invite") {
            emailSent = await sendAmbassadorInviteEmail(
              contact.fullName,
              contact.email,
              inviterName,
              referralCode
            );
          } else {
            emailSent = await sendAIBuddyCustomerInviteEmail(
              contact.fullName,
              contact.email,
              inviterName
            );
          }

          if (emailSent) {
            await storage.updateContactEmailSent(contact.id, user.id, emailType);
            results.push({ contactId: contact.id, success: true });
          } else {
            results.push({ contactId: contact.id, success: false, error: "Email not configured" });
          }
        } catch (err: any) {
          results.push({ contactId: contact.id, success: false, error: err.message });
        }
      }

      const successCount = results.filter(r => r.success).length;
      res.json({ 
        results, 
        sent: successCount,
        message: `Sent ${successCount} of ${contactsToEmail.length} emails`
      });
    } catch (err: any) {
      console.error("Send contact emails error:", err);
      res.status(500).json({ message: "Failed to send emails" });
    }
  });

  // Ask AI - DeepSeek integration for ambassador Q&A
  const askAiInputSchema = z.object({
    message: z.string().min(1).max(10000),
    conversationHistory: z.array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(10000),
      })
    ).max(20).optional().default([]),
  });

  app.post("/api/ask-ai", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const parsed = askAiInputSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ 
          message: "Invalid request",
          errors: parsed.error.errors.map(e => e.message),
        });
      }

      const { message, conversationHistory } = parsed.data;
      const response = await askDeepSeek(message.trim(), conversationHistory);
      res.json({ response });
    } catch (err: any) {
      console.error("Ask AI error:", err);
      res.status(500).json({ message: err.message || "Failed to get AI response" });
    }
  });

  // Property Intelligence Tools - Property Report endpoint
  app.post("/api/property-report", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { address } = req.body;
      
      if (!address || typeof address !== "string" || address.trim().length === 0) {
        return res.status(400).json({ message: "Address is required" });
      }

      const report = await getPropertyReport(address.trim());
      res.json(report);
    } catch (err) {
      console.error("Property report error:", err);
      res.status(500).json({ message: "Failed to generate property report" });
    }
  });

  // Digital Footprint Scanner - Breach Check API
  const HIBP_API_KEY = process.env.HIBP_API_KEY || "00000000000000000000000000000000"; // Test key for development

  app.post("/api/check-breaches", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email || typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ message: "Valid email is required" });
      }

      const encodedEmail = encodeURIComponent(email.toLowerCase().trim());
      
      try {
        const response = await fetch(
          `https://haveibeenpwned.com/api/v3/breachedaccount/${encodedEmail}?truncateResponse=false`,
          {
            headers: {
              "hibp-api-key": HIBP_API_KEY,
              "user-agent": "BitForce-SecurityScanner",
            },
          }
        );

        if (response.status === 404) {
          // No breaches found
          return res.json({
            status: "not_found",
            breachCount: 0,
            breaches: [],
            riskLevel: "low",
            recommendations: [
              "Continue using strong, unique passwords for each account",
              "Enable two-factor authentication where available",
              "Keep your software and apps updated",
            ],
          });
        }

        if (response.status === 401) {
          console.error("HIBP API key invalid");
          return res.status(500).json({ 
            status: "error",
            message: "Security scan temporarily unavailable",
          });
        }

        if (response.status === 429) {
          return res.status(429).json({
            status: "error", 
            message: "Too many requests. Please try again in a moment.",
          });
        }

        if (!response.ok) {
          throw new Error(`HIBP API returned ${response.status}`);
        }

        const breaches = await response.json();
        const breachCount = breaches.length;
        
        // Determine risk level
        let riskLevel: "low" | "medium" | "high" = "low";
        const hasPasswordBreach = breaches.some((b: any) => 
          b.DataClasses?.some((dc: string) => dc.toLowerCase().includes("password"))
        );
        
        if (breachCount >= 5 || hasPasswordBreach) {
          riskLevel = "high";
        } else if (breachCount >= 2) {
          riskLevel = "medium";
        }

        // Format breaches for response
        const formattedBreaches = breaches.map((b: any) => ({
          name: b.Name,
          title: b.Title,
          domain: b.Domain,
          breachDate: b.BreachDate,
          dataClasses: b.DataClasses || [],
          description: b.Description,
          pwnCount: b.PwnCount,
          isVerified: b.IsVerified,
        }));

        // Generate recommendations based on breaches
        const recommendations: string[] = [];
        if (hasPasswordBreach) {
          recommendations.push("Change passwords immediately on affected sites");
          recommendations.push("Use a password manager to generate strong, unique passwords");
        }
        recommendations.push("Enable two-factor authentication on all important accounts");
        if (breachCount > 0) {
          recommendations.push("Monitor your accounts for suspicious activity");
          recommendations.push("Consider signing up for breach monitoring alerts");
        }
        recommendations.push("Never reuse passwords across multiple sites");

        res.json({
          status: "found",
          breachCount,
          breaches: formattedBreaches,
          riskLevel,
          recommendations: recommendations.slice(0, 5),
        });

      } catch (fetchError: any) {
        console.error("HIBP fetch error:", fetchError);
        return res.status(500).json({
          status: "error",
          message: "Unable to complete security scan. Please try again later.",
        });
      }

    } catch (err) {
      console.error("Check breaches error:", err);
      res.status(500).json({ message: "Failed to check breaches" });
    }
  });

  // Password strength and breach check using Pwned Passwords API (free, no API key required)
  app.post("/api/check-password", async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      
      if (!password || typeof password !== "string") {
        return res.status(400).json({ message: "Password is required" });
      }

      // Calculate password strength locally
      let score = 0;
      const suggestions: string[] = [];
      
      if (password.length >= 8) score += 20;
      else suggestions.push("Use at least 8 characters");
      
      if (password.length >= 12) score += 10;
      if (password.length >= 16) score += 10;
      
      if (/[a-z]/.test(password)) score += 10;
      else suggestions.push("Add lowercase letters");
      
      if (/[A-Z]/.test(password)) score += 15;
      else suggestions.push("Add uppercase letters");
      
      if (/[0-9]/.test(password)) score += 15;
      else suggestions.push("Add numbers");
      
      if (/[^a-zA-Z0-9]/.test(password)) score += 20;
      else suggestions.push("Add special characters (!@#$%^&*)");

      // Check for common patterns
      if (/(.)\1{2,}/.test(password)) {
        score -= 10;
        suggestions.push("Avoid repeating characters");
      }
      if (/^[a-zA-Z]+$/.test(password)) {
        score -= 5;
        suggestions.push("Mix different character types");
      }
      if (/^[0-9]+$/.test(password)) {
        score -= 15;
        suggestions.push("Don't use only numbers");
      }

      score = Math.max(0, Math.min(100, score));

      let strength: "weak" | "moderate" | "strong" | "very_strong" = "weak";
      if (score >= 80) strength = "very_strong";
      else if (score >= 60) strength = "strong";
      else if (score >= 40) strength = "moderate";

      // Check if password has been compromised using k-anonymity
      // We only send first 5 chars of SHA-1 hash to HIBP
      const sha1Hash = createHash("sha1").update(password).digest("hex").toUpperCase();
      const prefix = sha1Hash.substring(0, 5);
      const suffix = sha1Hash.substring(5);

      let compromised = false;
      let occurrences = 0;

      try {
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
          headers: { "user-agent": "BitForce-SecurityScanner" },
        });

        if (response.ok) {
          const text = await response.text();
          const lines = text.split("\n");
          
          for (const line of lines) {
            const [hashSuffix, count] = line.split(":");
            if (hashSuffix.trim() === suffix) {
              compromised = true;
              occurrences = parseInt(count.trim(), 10);
              break;
            }
          }
        }
      } catch (err) {
        console.error("Pwned Passwords API error:", err);
        // Continue without breach check
      }

      if (compromised) {
        suggestions.unshift("This password has been found in data breaches - choose a different one");
        if (strength !== "weak") strength = "weak";
        score = Math.min(score, 25);
      }

      res.json({
        strength,
        score,
        compromised,
        occurrences: compromised ? occurrences : undefined,
        suggestions: suggestions.slice(0, 4),
      });

    } catch (err) {
      console.error("Check password error:", err);
      res.status(500).json({ message: "Failed to check password" });
    }
  });

  // Old Friend & Family Finder - Person Search API using Whitepages Pro
  const WHITEPAGES_API_KEY = process.env.WHITEPAGES_API_KEY || "";

  const personSearchSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(100),
    lastName: z.string().min(1, "Last name is required").max(100),
    city: z.string().max(100).optional(),
    state: z.string().max(2).optional(),
    age: z.number().min(18).max(120).optional(),
  });

  app.post("/api/person-search", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const parsed = personSearchSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          message: "Invalid request",
          errors: parsed.error.errors.map(e => e.message),
        });
      }

      const { firstName, lastName, city, state, age } = parsed.data;

      if (!WHITEPAGES_API_KEY) {
        return res.status(500).json({ 
          status: "error",
          message: "Person search service is not configured" 
        });
      }

      // Build Whitepages Pro API request
      const params = new URLSearchParams({
        api_key: WHITEPAGES_API_KEY,
        "name.first": firstName.trim(),
        "name.last": lastName.trim(),
      });

      if (city && typeof city === "string") {
        params.append("address.city", city.trim());
      }
      if (state && typeof state === "string") {
        params.append("address.state_code", state.trim().toUpperCase());
      }

      try {
        const response = await fetch(
          `https://proapi.whitepages.com/3.0/person?${params.toString()}`,
          {
            headers: {
              "Accept": "application/json",
            },
          }
        );

        if (response.status === 401 || response.status === 403) {
          console.error("Whitepages API authentication failed");
          return res.status(500).json({
            status: "error",
            message: "Person search service authentication failed",
          });
        }

        if (response.status === 429) {
          return res.status(429).json({
            status: "error",
            message: "Too many requests. Please try again in a moment.",
          });
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Whitepages API error:", response.status, errorText);
          throw new Error(`Whitepages API returned ${response.status}`);
        }

        const data = await response.json();

        // Handle no results
        if (!data.person || data.person.length === 0) {
          return res.json({
            status: "not_found",
            matchCount: 0,
            results: [],
            message: "No matches found for your search criteria",
          });
        }

        // Calculate confidence score based on matching criteria
        const calculateConfidence = (person: any): { confidence: number; label: string } => {
          let score = 40; // Base score for name match

          // Location match
          const currentAddress = person.current_addresses?.[0];
          if (currentAddress) {
            if (city && currentAddress.city?.toLowerCase() === city.toLowerCase()) {
              score += 25;
            }
            if (state && currentAddress.state_code?.toUpperCase() === state.toUpperCase()) {
              score += 10;
            }
          }

          // Age match (within 3 years)
          if (age && person.age_range && typeof person.age_range === "string") {
            const ageRangeParts = person.age_range.split("-");
            if (ageRangeParts.length >= 2) {
              const minAge = parseInt(ageRangeParts[0], 10);
              const maxAge = parseInt(ageRangeParts[1], 10);
              if (!isNaN(minAge) && !isNaN(maxAge) && age >= minAge && age <= maxAge) {
                score += 20;
              }
            }
          }

          // Has relatives (additional data point)
          if (person.associated_people && person.associated_people.length > 0) {
            score += 5;
          }

          score = Math.min(100, score);

          let label = "Possible Match";
          if (score >= 90) label = "Very High Confidence";
          else if (score >= 70) label = "High Confidence";
          else if (score >= 50) label = "Moderate Confidence";
          else if (score >= 30) label = "Low Confidence";

          return { confidence: score, label };
        };

        // Format results
        const results = (Array.isArray(data.person) ? data.person : [data.person])
          .slice(0, 10)
          .map((person: any, index: number) => {
            const { confidence, label } = calculateConfidence(person);
            
            // Parse name
            const nameParts = person.name?.split(" ") || [firstName, lastName];
            const parsedName = {
              first: person.firstname || nameParts[0] || firstName,
              middle: person.middlename || (nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : undefined),
              last: person.lastname || nameParts[nameParts.length - 1] || lastName,
            };

            // Format locations
            const locations = [
              ...(person.current_addresses || []).map((addr: any) => ({
                city: addr.city || "",
                state: addr.state_code || "",
                zip: addr.postal_code || "",
                address: addr.street_line_1 || "",
                isCurrent: true,
              })),
              ...(person.historical_addresses || []).slice(0, 2).map((addr: any) => ({
                city: addr.city || "",
                state: addr.state_code || "",
                zip: addr.postal_code || "",
                address: addr.street_line_1 || "",
                isCurrent: false,
              })),
            ].filter((loc: any) => loc.city || loc.state);

            // Format phones
            const phones = (person.phones || []).slice(0, 3).map((phone: any) => ({
              number: phone.phone_number || phone.display || "",
              type: phone.line_type || "Unknown",
              isCurrent: phone.is_valid !== false,
            }));

            // Format relatives/associates
            const relatives = (person.associated_people || []).slice(0, 5).map((rel: any) => ({
              name: rel.name || "",
              relation: rel.relation || undefined,
            }));

            return {
              id: person.id || `result-${index}`,
              name: parsedName,
              age: person.age || undefined,
              ageRange: person.age_range || undefined,
              locations,
              phones,
              relatives,
              confidence,
              confidenceLabel: label,
              sources: ["Public Records"],
            };
          });

        // Sort by confidence
        results.sort((a: any, b: any) => b.confidence - a.confidence);

        res.json({
          status: "found",
          matchCount: results.length,
          results,
        });

      } catch (fetchError: any) {
        console.error("Whitepages fetch error:", fetchError);
        return res.status(500).json({
          status: "error",
          message: "Unable to complete person search. Please try again later.",
        });
      }

    } catch (err) {
      console.error("Person search error:", err);
      res.status(500).json({ message: "Failed to search for person" });
    }
  });

  // ============= WITHINGS HEALTH API ROUTES =============
  
  // Get Withings OAuth authorization URL
  app.get("/api/withings/auth-url", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { getWithingsAuthUrl, createSignedState, generateNonce } = await import("./services/withings");
      const user = req.user as any;
      const customerEmail = req.query.customerEmail as string;
      const customerName = req.query.customerName as string;
      
      if (!customerEmail) {
        return res.status(400).json({ message: "Customer email is required" });
      }
      
      // Create a signed state with HMAC to prevent forgery
      const nonce = generateNonce();
      const state = createSignedState({
        ambassadorUserId: user.id,
        customerEmail,
        customerName: customerName || "",
        nonce,
      });
      
      const redirectUri = `${req.protocol}://${req.get("host")}/api/withings/callback`;
      const authUrl = getWithingsAuthUrl(redirectUri, state);
      
      res.json({ authUrl });
    } catch (err) {
      console.error("Withings auth URL error:", err);
      res.status(500).json({ message: "Failed to generate Withings auth URL" });
    }
  });
  
  // Withings OAuth callback
  app.get("/api/withings/callback", async (req: Request, res: Response) => {
    try {
      const { exchangeWithingsCode, verifyAndDecodeState } = await import("./services/withings");
      const { code, state } = req.query as { code: string; state: string };
      
      if (!code || !state) {
        return res.redirect("/portal/tools?error=missing_params");
      }
      
      // Verify and decode the signed state
      const stateData = verifyAndDecodeState(state);
      if (!stateData) {
        console.error("OAuth state verification failed - potential CSRF attack");
        return res.redirect("/portal/tools?error=invalid_state");
      }
      
      const redirectUri = `${req.protocol}://${req.get("host")}/api/withings/callback`;
      
      // Exchange code for tokens
      const tokens = await exchangeWithingsCode(code, redirectUri);
      
      // Check if we already have a token for this customer
      const existingToken = await storage.getWithingsTokenByCustomer(
        stateData.ambassadorUserId,
        stateData.customerEmail
      );
      
      if (existingToken) {
        // Update existing token
        await storage.updateWithingsToken(existingToken.id, {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: tokens.expiresAt,
          withingsUserId: tokens.userId,
          scope: tokens.scope,
        });
      } else {
        // Create new token
        await storage.createWithingsToken({
          ambassadorUserId: stateData.ambassadorUserId,
          customerEmail: stateData.customerEmail,
          customerName: stateData.customerName || null,
          withingsUserId: tokens.userId,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: tokens.expiresAt,
          scope: tokens.scope,
        });
      }
      
      res.redirect("/portal/tools?success=withings_connected");
    } catch (err) {
      console.error("Withings callback error:", err);
      res.redirect("/portal/tools?error=auth_failed");
    }
  });
  
  // Get connected Withings customers for ambassador
  app.get("/api/withings/customers", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const tokens = await storage.getWithingsTokensByAmbassador(user.id);
      
      res.json(tokens.map((t) => ({
        id: t.id,
        customerEmail: t.customerEmail,
        customerName: t.customerName,
        connectedAt: t.createdAt,
        lastUpdated: t.updatedAt,
      })));
    } catch (err) {
      console.error("Get Withings customers error:", err);
      res.status(500).json({ message: "Failed to get connected customers" });
    }
  });
  
  // Get health data for a connected customer
  app.get("/api/withings/customer/:id/health", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { getWithingsHealthSummary, refreshWithingsToken } = await import("./services/withings");
      const user = req.user as any;
      const tokenId = parseInt(req.params.id);
      
      const token = await storage.getWithingsTokenById(tokenId);
      
      if (!token || token.ambassadorUserId !== user.id) {
        return res.status(404).json({ message: "Customer not found" });
      }
      
      // Check if token is expired and refresh if needed
      let accessToken = token.accessToken;
      if (new Date() >= token.expiresAt) {
        try {
          const newTokens = await refreshWithingsToken(token.refreshToken);
          await storage.updateWithingsToken(token.id, {
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
            expiresAt: newTokens.expiresAt,
          });
          accessToken = newTokens.accessToken;
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          return res.status(401).json({ message: "Customer needs to reconnect their device" });
        }
      }
      
      const healthData = await getWithingsHealthSummary(accessToken);
      
      res.json({
        customer: {
          email: token.customerEmail,
          name: token.customerName,
        },
        health: healthData,
      });
    } catch (err) {
      console.error("Get Withings health data error:", err);
      res.status(500).json({ message: "Failed to get health data" });
    }
  });
  
  // Disconnect a customer's Withings account
  app.delete("/api/withings/customer/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const tokenId = parseInt(req.params.id);
      
      const deleted = await storage.deleteWithingsToken(tokenId, user.id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Customer not found" });
      }
      
      res.json({ success: true });
    } catch (err) {
      console.error("Delete Withings customer error:", err);
      res.status(500).json({ message: "Failed to disconnect customer" });
    }
  });

  // ================== LEAD FINDER ROUTES ==================
  
  const leadFinderSearchSchema = z.object({
    location: z.string().min(1, "Location is required"),
    radiusMiles: z.number().min(1).max(50).optional().default(5),
    businessTypes: z.array(z.string()).optional(),
  });
  
  // Search for leads in a location
  app.post("/api/lead-finder/search", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const parsed = leadFinderSearchSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }
      
      const { location, radiusMiles, businessTypes } = parsed.data;
      
      const { searchLeads } = await import("./services/leadFinder");
      const results = await searchLeads(location, radiusMiles, businessTypes);
      
      res.json(results);
    } catch (err: any) {
      console.error("Lead finder search error:", err);
      res.status(500).json({ message: err.message || "Failed to search for leads" });
    }
  });

  const brokerSearchSchema = z.object({
    location: z.string().min(1, "Location is required"),
    radiusMiles: z.number().min(1).max(50).optional().default(10),
  });

  // Search for real estate brokers in a location
  app.post("/api/lead-finder/brokers", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const parsed = brokerSearchSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }
      
      const { location, radiusMiles } = parsed.data;
      
      const { searchRealEstateBrokers } = await import("./services/leadFinder");
      const results = await searchRealEstateBrokers(location, radiusMiles);
      
      res.json(results);
    } catch (err: any) {
      console.error("Broker search error:", err);
      res.status(500).json({ message: err.message || "Failed to search for brokers" });
    }
  });
  
  // Get saved leads for ambassador
  app.get("/api/lead-finder/saved", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const leads = await storage.getSavedLeadsByAmbassador(user.id);
      res.json(leads);
    } catch (err) {
      console.error("Get saved leads error:", err);
      res.status(500).json({ message: "Failed to get saved leads" });
    }
  });
  
  const saveLeadSchema = z.object({
    placeId: z.string().min(1),
    businessName: z.string().min(1),
    address: z.string().min(1),
    phone: z.string().optional().nullable(),
    website: z.string().optional().nullable(),
    latitude: z.number(),
    longitude: z.number(),
    businessType: z.string().optional().nullable(),
    rating: z.number().optional().nullable(),
    reviewCount: z.number().optional().nullable(),
    priceLevel: z.number().optional().nullable(),
    score: z.number().min(0).max(100).optional().default(50),
    notes: z.string().optional().nullable(),
    searchLocation: z.string().optional().nullable(),
    searchRadius: z.number().optional().nullable(),
  });
  
  // Save a lead
  app.post("/api/lead-finder/save", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const parsed = saveLeadSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }
      
      const leadData = parsed.data;
      
      // Check if already saved
      const existing = await storage.getSavedLeadByPlaceId(leadData.placeId, user.id);
      if (existing) {
        return res.status(400).json({ message: "Lead already saved" });
      }
      
      const saved = await storage.createSavedLead({
        ambassadorUserId: user.id,
        placeId: leadData.placeId,
        businessName: leadData.businessName,
        address: leadData.address,
        phone: leadData.phone || null,
        website: leadData.website || null,
        latitude: leadData.latitude.toString(),
        longitude: leadData.longitude.toString(),
        businessType: leadData.businessType || null,
        rating: leadData.rating?.toString() || null,
        reviewCount: leadData.reviewCount || null,
        priceLevel: leadData.priceLevel || null,
        score: leadData.score,
        status: "new",
        notes: leadData.notes || null,
        foundVia: "google_places",
        searchLocation: leadData.searchLocation || null,
        searchRadius: leadData.searchRadius || null,
      });
      
      res.json(saved);
    } catch (err) {
      console.error("Save lead error:", err);
      res.status(500).json({ message: "Failed to save lead" });
    }
  });
  
  const updateLeadSchema = z.object({
    status: z.enum(["new", "contacted", "interested", "client", "declined"]).optional(),
    notes: z.string().optional().nullable(),
  });
  
  // Update a saved lead (only status and notes can be updated)
  app.patch("/api/lead-finder/saved/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const leadId = parseInt(req.params.id);
      
      const parsed = updateLeadSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }
      
      const updated = await storage.updateSavedLead(leadId, user.id, parsed.data);
      
      if (!updated) {
        return res.status(404).json({ message: "Lead not found" });
      }
      
      res.json(updated);
    } catch (err) {
      console.error("Update lead error:", err);
      res.status(500).json({ message: "Failed to update lead" });
    }
  });
  
  // Delete a saved lead
  app.delete("/api/lead-finder/saved/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const leadId = parseInt(req.params.id);
      
      const deleted = await storage.deleteSavedLead(leadId, user.id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Lead not found" });
      }
      
      res.json({ success: true });
    } catch (err) {
      console.error("Delete lead error:", err);
      res.status(500).json({ message: "Failed to delete lead" });
    }
  });
  
  // Export saved leads as CSV
  app.get("/api/lead-finder/export", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const leads = await storage.getSavedLeadsByAmbassador(user.id);
      
      const { exportToCsv } = await import("./services/leadFinder");
      const csv = exportToCsv(leads);
      
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=leads-export.csv");
      res.send(csv);
    } catch (err) {
      console.error("Export leads error:", err);
      res.status(500).json({ message: "Failed to export leads" });
    }
  });
  
  // ================== PROPERTY INTELLIGENCE (RENTCAST) ROUTES ==================
  
  const propertyLookupSchema = z.object({
    address: z.string().min(5, "Address is required"),
  });
  
  // Get comprehensive property intelligence
  app.post("/api/property-intel/lookup", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const parsed = propertyLookupSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }
      
      const { getPropertyIntelligence } = await import("./services/rentcast");
      const result = await getPropertyIntelligence(parsed.data.address);
      
      if (result.error) {
        return res.status(500).json({ message: result.error });
      }
      
      res.json(result);
    } catch (err: any) {
      console.error("Property intelligence error:", err);
      res.status(500).json({ message: err.message || "Failed to get property intelligence" });
    }
  });
  
  // Get just property record
  app.post("/api/property-intel/property", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const parsed = propertyLookupSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }
      
      const { getPropertyRecord } = await import("./services/rentcast");
      const property = await getPropertyRecord(parsed.data.address);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.json(property);
    } catch (err: any) {
      console.error("Property lookup error:", err);
      res.status(500).json({ message: err.message || "Failed to lookup property" });
    }
  });
  
  // Get value estimate
  app.post("/api/property-intel/value", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const parsed = propertyLookupSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }
      
      const { getValueEstimate } = await import("./services/rentcast");
      const estimate = await getValueEstimate(parsed.data.address);
      
      if (!estimate) {
        return res.status(404).json({ message: "Could not estimate value" });
      }
      
      res.json(estimate);
    } catch (err: any) {
      console.error("Value estimate error:", err);
      res.status(500).json({ message: err.message || "Failed to estimate value" });
    }
  });
  
  // Get rent estimate
  app.post("/api/property-intel/rent", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const parsed = propertyLookupSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }
      
      const { getRentEstimate } = await import("./services/rentcast");
      const estimate = await getRentEstimate(parsed.data.address);
      
      if (!estimate) {
        return res.status(404).json({ message: "Could not estimate rent" });
      }
      
      res.json(estimate);
    } catch (err: any) {
      console.error("Rent estimate error:", err);
      res.status(500).json({ message: err.message || "Failed to estimate rent" });
    }
  });

  // Video processing endpoint for explainer video
  app.post("/api/video/combine-explainer", async (req: Request, res: Response) => {
    try {
      const { combineExplainerVideos } = await import("./services/videoProcessor");
      const outputPath = await combineExplainerVideos();
      res.json({ success: true, message: "Video combined successfully", path: outputPath });
    } catch (err: any) {
      console.error("[Video Combine] Error:", err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.get("/api/video/explainer-status", async (req: Request, res: Response) => {
    try {
      const { getCombinedVideoPath } = await import("./services/videoProcessor");
      const videoPath = getCombinedVideoPath();
      res.json({ exists: !!videoPath, path: videoPath });
    } catch (err: any) {
      res.status(500).json({ exists: false, message: err.message });
    }
  });

  // Stream the combined explainer video
  app.get("/api/video/explainer-complete", async (req: Request, res: Response) => {
    try {
      const { getCombinedVideoPath } = await import("./services/videoProcessor");
      const videoPath = getCombinedVideoPath();
      
      if (!videoPath) {
        return res.status(404).json({ message: "Combined video not found" });
      }
      
      const fs = await import("fs");
      const path = await import("path");
      const stat = fs.statSync(videoPath);
      const fileSize = stat.size;
      const range = req.headers.range;
      
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = (end - start) + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        
        res.writeHead(206, {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize,
          "Content-Type": "video/mp4",
        });
        file.pipe(res);
      } else {
        res.writeHead(200, {
          "Content-Length": fileSize,
          "Content-Type": "video/mp4",
        });
        fs.createReadStream(videoPath).pipe(res);
      }
    } catch (err: any) {
      console.error("[Video Stream] Error:", err.message);
      res.status(500).json({ message: err.message });
    }
  });

  // Training Progress - Get completed lessons for the current user
  app.get("/api/training/progress", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const userId = user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const completedLessons = await storage.getCompletedLessons(userId);
      res.json(completedLessons.map(p => p.lessonId));
    } catch (err) {
      console.error("Get training progress error:", err);
      res.status(500).json({ message: "Failed to get training progress" });
    }
  });

  // Training Progress - Mark a lesson as complete and award BFT
  app.post("/api/training/complete-lesson", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const userId = user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { lessonId, moduleId } = req.body;
      
      if (!lessonId || !moduleId) {
        return res.status(400).json({ message: "lessonId and moduleId are required" });
      }

      const numericModuleId = parseInt(moduleId, 10);
      if (isNaN(numericModuleId)) {
        return res.status(400).json({ message: "Invalid moduleId" });
      }

      // Server-side validation of lesson/module against trusted configuration
      const { getModuleConfig, isValidLesson, getTotalLessonsCount } = await import("@shared/data/trainingModulesConfig");
      
      const moduleConfig = getModuleConfig(numericModuleId);
      if (!moduleConfig) {
        return res.status(400).json({ message: "Invalid module" });
      }
      
      if (!isValidLesson(numericModuleId, lessonId)) {
        return res.status(400).json({ message: "Invalid lesson for this module" });
      }

      // Check if already completed
      const alreadyCompleted = await storage.isLessonCompleted(userId, lessonId);
      if (alreadyCompleted) {
        return res.json({ 
          success: true, 
          alreadyCompleted: true,
          message: "Lesson already completed" 
        });
      }

      // STEP 1: Award BFT for lesson completion FIRST (before marking complete)
      // This ensures retries can still award tokens if this fails
      const lessonBftResult = await awardBftTokens(
        userId,
        "COMPLETE_LESSON",
        ACTION_POINTS.COMPLETE_LESSON,
        `Completed lesson in ${moduleConfig.title}`,
        { lessonId, moduleId: numericModuleId }
      );

      // If BFT ledger recording failed, return error (lesson NOT marked complete - can retry)
      if (!lessonBftResult.success) {
        console.error(`[Training] BFT award failed for lesson ${lessonId}:`, lessonBftResult.error);
        return res.status(500).json({ 
          success: false, 
          message: "Failed to record BFT reward. Please try again.",
          error: lessonBftResult.error 
        });
      }

      // STEP 2: Check if this lesson completes the module
      // We need to pre-check to award module bonus BEFORE marking lesson complete
      const completedInModule = await storage.getModuleCompletedLessons(userId, numericModuleId.toString());
      const willCompleteModule = completedInModule.length + 1 >= moduleConfig.lessonIds.length;
      
      let moduleCompleted = false;
      let moduleBftResult = null;
      
      if (willCompleteModule) {
        // Award bonus BFT for completing entire module BEFORE marking lesson
        moduleBftResult = await awardBftTokens(
          userId,
          "COMPLETE_MODULE",
          ACTION_POINTS.COMPLETE_MODULE,
          `Completed training module: ${moduleConfig.title}`,
          { moduleId: numericModuleId, moduleTitle: moduleConfig.title }
        );

        // If module BFT ledger recording failed, return error (can retry entire flow)
        if (!moduleBftResult.success) {
          console.error(`[Training] Module BFT award failed for module ${numericModuleId}:`, moduleBftResult.error);
          return res.status(500).json({ 
            success: false, 
            message: "Failed to record module bonus BFT. Please try again.",
            error: moduleBftResult.error 
          });
        }
        moduleCompleted = true;
      }

      // STEP 3: NOW mark lesson as complete (after all BFT is recorded)
      await storage.completeLesson(userId, lessonId, numericModuleId.toString());

      // Log the lesson action
      await storage.logAmbassadorAction({
        userId,
        actionType: "COMPLETE_LESSON",
        pointsAwarded: ACTION_POINTS.COMPLETE_LESSON,
        leadId: null,
        leadServiceId: null,
        description: `Completed lesson ${lessonId}`,
      });

      // Log module completion if applicable
      if (moduleCompleted) {
        await storage.logAmbassadorAction({
          userId,
          actionType: "COMPLETE_MODULE",
          pointsAwarded: ACTION_POINTS.COMPLETE_MODULE,
          leadId: null,
          leadServiceId: null,
          description: `Completed module: ${moduleConfig.title}`,
        });
      }

      // Check if all training is complete - award badge
      const allCompletedLessons = await storage.getCompletedLessons(userId);
      const totalLessons = getTotalLessonsCount();
      
      if (allCompletedLessons.length >= totalLessons) {
        const hasBadge = await storage.hasBadge(userId, "TRAINING_COMPLETE");
        if (!hasBadge) {
          await storage.awardBadge(userId, "TRAINING_COMPLETE");
        }
      }

      // Check if BFT was properly recorded - warn if not
      const lessonRecorded = lessonBftResult.transactionRecorded;
      const moduleRecorded = !moduleCompleted || (moduleBftResult?.transactionRecorded ?? false);
      const allRecorded = lessonRecorded && moduleRecorded;

      res.json({ 
        success: true, 
        lessonBftAwarded: lessonBftResult.bftAwarded,
        lessonPointsEquivalent: ACTION_POINTS.COMPLETE_LESSON,
        lessonTransactionRecorded: lessonRecorded,
        moduleCompleted,
        moduleBftAwarded: moduleBftResult?.bftAwarded || 0,
        modulePointsEquivalent: moduleCompleted ? ACTION_POINTS.COMPLETE_MODULE : 0,
        moduleTransactionRecorded: moduleBftResult?.transactionRecorded || false,
        totalLessonsCompleted: allCompletedLessons.length,
        bftSyncComplete: allRecorded,
        warning: allRecorded ? undefined : "BFT rewards recorded locally but may need sync to token portal",
      });
    } catch (err) {
      console.error("Complete lesson error:", err);
      res.status(500).json({ message: "Failed to complete lesson" });
    }
  });

  // Initialize providers and run scraper asynchronously after startup
  // In production (Cloud Run), skip auto-run entirely to avoid startup timeout
  // Check for PORT env var as indicator of Cloud Run (it's always set there)
  const isCloudRun = process.env.K_SERVICE || process.env.PORT === "8080";
  const isProduction = process.env.NODE_ENV === "production" || isCloudRun;
  const scraperDelay = isProduction ? 60000 : 1000;
  
  if (!isProduction) {
    setTimeout(async () => {
      try {
        await initializeProviders();
        const result = await runScraper();
        console.log(`Scraper completed: ${result.listingsCount} listings scraped`);
      } catch (err) {
        console.error("Scraper initialization failed (will retry on manual trigger):", err);
      }
    }, scraperDelay);
  } else {
    console.log("[server] Production mode detected - scraper auto-run disabled for faster startup");
    console.log("[server] Scraper will run on first manual trigger via /api/scraper/run");
  }

  return httpServer;
}
