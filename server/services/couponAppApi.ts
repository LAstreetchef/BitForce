import { Request, Response, NextFunction, Router } from "express";
import crypto from "crypto";
import { storage } from "../storage";
import { z } from "zod";

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 100;

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function validateApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers["x-api-key"] as string;
  const expectedApiKey = process.env.COUPON_APP_API_KEY;

  if (!expectedApiKey) {
    console.error("COUPON_APP_API_KEY not configured");
    return res.status(500).json({ error: "API not configured" });
  }

  if (!apiKey || apiKey !== expectedApiKey) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  next();
}

async function validateBearerToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid authorization header" });
  }

  const accessToken = authHeader.substring(7);
  
  try {
    const token = await storage.getCouponAppTokenByAccessToken(accessToken);
    
    if (!token) {
      return res.status(401).json({ error: "Invalid access token" });
    }

    if (new Date() >= token.expiresAt) {
      return res.status(401).json({ error: "Access token expired" });
    }

    await storage.updateCouponAppTokenLastUsed(token.id);
    
    (req as any).couponAppToken = token;
    (req as any).ambassadorUserId = token.ambassadorUserId;
    
    next();
  } catch (error) {
    console.error("Token validation error:", error);
    res.status(500).json({ error: "Token validation failed" });
  }
}

function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ambassadorUserId = (req as any).ambassadorUserId || req.ip;
  const now = Date.now();
  
  let record = rateLimitStore.get(ambassadorUserId);
  
  if (!record || now > record.resetTime) {
    record = { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };
    rateLimitStore.set(ambassadorUserId, record);
  }
  
  record.count++;
  
  if (record.count > RATE_LIMIT_MAX_REQUESTS) {
    res.setHeader("X-RateLimit-Limit", RATE_LIMIT_MAX_REQUESTS.toString());
    res.setHeader("X-RateLimit-Remaining", "0");
    res.setHeader("X-RateLimit-Reset", Math.ceil(record.resetTime / 1000).toString());
    return res.status(429).json({ 
      error: "Rate limit exceeded", 
      retryAfter: Math.ceil((record.resetTime - now) / 1000) 
    });
  }
  
  res.setHeader("X-RateLimit-Limit", RATE_LIMIT_MAX_REQUESTS.toString());
  res.setHeader("X-RateLimit-Remaining", (RATE_LIMIT_MAX_REQUESTS - record.count).toString());
  res.setHeader("X-RateLimit-Reset", Math.ceil(record.resetTime / 1000).toString());
  
  next();
}

const tokenRequestSchema = z.object({
  grant_type: z.enum(["client_credentials", "refresh_token"]),
  ambassador_id: z.string().optional(),
  email: z.string().email().optional(),
  refresh_token: z.string().optional(),
});

const couponShareSchema = z.object({
  customerId: z.number().optional(),
  leadId: z.number().optional(),
  title: z.string().min(1),
  coupons: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    discount: z.string(),
    expiresAt: z.string().optional(),
  })),
  totalSavings: z.string().optional(),
  shareVia: z.enum(["email", "sms"]),
});

export function registerCouponAppRoutes(router: Router) {
  router.post("/api/auth/token", validateApiKey, async (req: Request, res: Response) => {
    try {
      const body = tokenRequestSchema.parse(req.body);
      
      if (body.grant_type === "client_credentials") {
        if (!body.ambassador_id && !body.email) {
          return res.status(400).json({ error: "ambassador_id or email required for client_credentials grant" });
        }
        
        let ambassador;
        if (body.email) {
          ambassador = await storage.getAmbassadorByEmail(body.email);
        } else {
          ambassador = await storage.getAmbassadorByUserId(body.ambassador_id!);
        }
        
        if (!ambassador) {
          return res.status(404).json({ error: "Ambassador not found" });
        }

        if (!ambassador.onboardingCompleted) {
          return res.status(403).json({ 
            error: "Onboarding not completed",
            message: "Please complete your ambassador onboarding in the BitForce portal before using the API"
          });
        }
        
        const accessToken = generateToken();
        const refreshToken = generateToken();
        const expiresAt = new Date(Date.now() + 3600 * 1000);
        
        await storage.createCouponAppToken({
          ambassadorUserId: ambassador.userId,
          accessToken,
          refreshToken,
          expiresAt,
          scope: "read:customers read:leads write:coupon-books",
        });
        
        res.json({
          access_token: accessToken,
          refresh_token: refreshToken,
          token_type: "Bearer",
          expires_in: 3600,
          scope: "read:customers read:leads write:coupon-books",
          ambassador_id: ambassador.userId,
        });
      } else if (body.grant_type === "refresh_token") {
        if (!body.refresh_token) {
          return res.status(400).json({ error: "refresh_token required" });
        }
        
        const existingToken = await storage.getCouponAppTokenByRefreshToken(body.refresh_token);
        if (!existingToken) {
          return res.status(401).json({ error: "Invalid refresh token" });
        }
        
        await storage.deleteCouponAppToken(existingToken.id);
        
        const accessToken = generateToken();
        const refreshToken = generateToken();
        const expiresAt = new Date(Date.now() + 3600 * 1000);
        
        await storage.createCouponAppToken({
          ambassadorUserId: existingToken.ambassadorUserId,
          accessToken,
          refreshToken,
          expiresAt,
          scope: existingToken.scope || "read:customers read:leads write:coupon-books",
        });
        
        res.json({
          access_token: accessToken,
          refresh_token: refreshToken,
          token_type: "Bearer",
          expires_in: 3600,
          scope: existingToken.scope || "read:customers read:leads write:coupon-books",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request body", details: error.errors });
      }
      console.error("Token endpoint error:", error);
      res.status(500).json({ error: "Token generation failed" });
    }
  });

  router.get("/api/auth/user-info", validateApiKey, validateBearerToken, rateLimiter, async (req: Request, res: Response) => {
    try {
      const ambassadorUserId = (req as any).ambassadorUserId;
      const ambassador = await storage.getAmbassadorByUserId(ambassadorUserId);
      
      if (!ambassador) {
        return res.status(404).json({ error: "Ambassador not found" });
      }
      
      res.json({
        id: ambassador.userId,
        name: ambassador.fullName,
        email: ambassador.email,
        subscription_status: ambassador.subscriptionStatus,
        referral_code: ambassador.referralCode,
      });
    } catch (error) {
      console.error("User info error:", error);
      res.status(500).json({ error: "Failed to get user info" });
    }
  });

  router.post("/api/auth/verify-token", validateApiKey, async (req: Request, res: Response) => {
    try {
      const { access_token } = req.body;
      
      if (!access_token) {
        return res.status(400).json({ error: "access_token required" });
      }
      
      const token = await storage.getCouponAppTokenByAccessToken(access_token);
      
      if (!token) {
        return res.json({ valid: false, reason: "Token not found" });
      }
      
      if (new Date() >= token.expiresAt) {
        return res.json({ valid: false, reason: "Token expired" });
      }
      
      res.json({
        valid: true,
        ambassador_id: token.ambassadorUserId,
        scope: token.scope,
        expires_at: token.expiresAt.toISOString(),
      });
    } catch (error) {
      console.error("Verify token error:", error);
      res.status(500).json({ error: "Token verification failed" });
    }
  });

  router.get("/api/v1/customers", validateApiKey, validateBearerToken, rateLimiter, async (req: Request, res: Response) => {
    try {
      const ambassadorUserId = (req as any).ambassadorUserId;
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const offset = parseInt(req.query.offset as string) || 0;
      
      let updatedSince: Date | undefined;
      if (req.query.updated_since) {
        const parsed = new Date(req.query.updated_since as string);
        if (isNaN(parsed.getTime())) {
          return res.status(400).json({ error: "Invalid updated_since format. Use ISO 8601 date format." });
        }
        updatedSince = parsed;
      }
      
      const { data, total } = await storage.getAmbassadorContactsPaginated(
        ambassadorUserId, 
        limit, 
        offset, 
        updatedSince
      );
      
      const customers = data.map((contact) => ({
        id: contact.id,
        name: contact.fullName,
        email: contact.email,
        phone: contact.phone || null,
        zipCode: null,
        demographics: {
          age: null,
          income: null,
          interests: [],
        },
        createdAt: contact.createdAt?.toISOString(),
        updatedAt: contact.createdAt?.toISOString(),
      }));
      
      res.json({
        data: customers,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      });
    } catch (error) {
      console.error("Get customers error:", error);
      res.status(500).json({ error: "Failed to get customers" });
    }
  });

  router.get("/api/v1/leads", validateApiKey, validateBearerToken, rateLimiter, async (req: Request, res: Response) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const offset = parseInt(req.query.offset as string) || 0;
      
      let updatedSince: Date | undefined;
      if (req.query.updated_since) {
        const parsed = new Date(req.query.updated_since as string);
        if (isNaN(parsed.getTime())) {
          return res.status(400).json({ error: "Invalid updated_since format. Use ISO 8601 date format." });
        }
        updatedSince = parsed;
      }
      
      const { data, total } = await storage.getLeadsPaginated(limit, offset, updatedSince);
      
      const leadsData = data.map((lead) => {
        const interests = lead.interests?.split(",").map((i) => i.trim()) || [];
        return {
          id: lead.id,
          name: lead.fullName,
          email: lead.email,
          phone: lead.phone,
          zipCode: lead.address?.match(/\d{5}(?:-\d{4})?$/)?.[0] || null,
          demographics: {
            age: null,
            income: null,
            interests,
          },
          createdAt: lead.createdAt?.toISOString(),
          updatedAt: lead.createdAt?.toISOString(),
        };
      });
      
      res.json({
        data: leadsData,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      });
    } catch (error) {
      console.error("Get leads error:", error);
      res.status(500).json({ error: "Failed to get leads" });
    }
  });

  router.post("/api/v1/coupon-books/share", validateApiKey, validateBearerToken, rateLimiter, async (req: Request, res: Response) => {
    try {
      const ambassadorUserId = (req as any).ambassadorUserId;
      const body = couponShareSchema.parse(req.body);
      
      if (!body.customerId && !body.leadId) {
        return res.status(400).json({ error: "Either customerId or leadId is required" });
      }
      
      const sharedBook = await storage.createSharedCouponBook({
        ambassadorUserId,
        customerId: body.customerId || null,
        leadId: body.leadId || null,
        title: body.title,
        couponsData: JSON.stringify(body.coupons),
        totalSavings: body.totalSavings || null,
        shareVia: body.shareVia,
        status: "pending",
      });
      
      res.status(201).json({
        id: sharedBook.id,
        status: sharedBook.status,
        sharedAt: sharedBook.sharedAt?.toISOString(),
        message: `Coupon book queued for delivery via ${body.shareVia}`,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request body", details: error.errors });
      }
      console.error("Share coupon book error:", error);
      res.status(500).json({ error: "Failed to share coupon book" });
    }
  });

  return router;
}

export function configureCouponAppCors(allowedOrigin?: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const origin = allowedOrigin || process.env.COUPON_APP_ORIGIN || "*";
    
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-API-Key");
    res.setHeader("Access-Control-Max-Age", "86400");
    
    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }
    
    next();
  };
}
