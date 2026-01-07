import { pgTable, text, serial, timestamp, integer, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";
export * from "./models/chat";

// Ambassador subscription and payout system
export const ambassadorSubscriptions = pgTable("ambassador_subscriptions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  referralCode: text("referral_code").notNull().unique(),
  referredByCode: text("referred_by_code"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  signupFeePaid: boolean("signup_fee_paid").default(false),
  subscriptionStatus: text("subscription_status").default("inactive"),
  firstMonthCompleted: boolean("first_month_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAmbassadorSubscriptionSchema = createInsertSchema(ambassadorSubscriptions).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type AmbassadorSubscription = typeof ambassadorSubscriptions.$inferSelect;
export type InsertAmbassadorSubscription = z.infer<typeof insertAmbassadorSubscriptionSchema>;

// Track referral bonuses ($50 per qualified referral)
export const referralBonuses = pgTable("referral_bonuses", {
  id: serial("id").primaryKey(),
  ambassadorId: integer("ambassador_id").notNull(),
  referredAmbassadorId: integer("referred_ambassador_id").notNull(),
  bonusAmount: decimal("bonus_amount", { precision: 10, scale: 2 }).notNull().default("50.00"),
  status: text("status").default("pending"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertReferralBonusSchema = createInsertSchema(referralBonuses).omit({ 
  id: true, 
  createdAt: true, 
  paidAt: true 
});

export type ReferralBonus = typeof referralBonuses.$inferSelect;
export type InsertReferralBonus = z.infer<typeof insertReferralBonusSchema>;

// Track recurring overrides (20% of referrals' monthly fees)
export const recurringOverrides = pgTable("recurring_overrides", {
  id: serial("id").primaryKey(),
  ambassadorId: integer("ambassador_id").notNull(),
  referredAmbassadorId: integer("referred_ambassador_id").notNull(),
  monthlyAmount: decimal("monthly_amount", { precision: 10, scale: 2 }).notNull().default("4.00"),
  month: text("month").notNull(),
  status: text("status").default("pending"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRecurringOverrideSchema = createInsertSchema(recurringOverrides).omit({ 
  id: true, 
  createdAt: true, 
  paidAt: true 
});

export type RecurringOverride = typeof recurringOverrides.$inferSelect;
export type InsertRecurringOverride = z.infer<typeof insertRecurringOverrideSchema>;

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  interests: text("interests").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({ id: true, createdAt: true });

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

export const eventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  experience: text("experience"),
  eventId: text("event_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEventRegistrationSchema = createInsertSchema(eventRegistrations).omit({ id: true, createdAt: true });

export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type InsertEventRegistration = z.infer<typeof insertEventRegistrationSchema>;

// Service Providers (Goodsmith, Mr. Handyman, United Home Services, Kingwood.com)
export const serviceProviders = pgTable("service_providers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  website: text("website").notNull(),
  description: text("description"),
  serviceArea: text("service_area").default("Houston"),
  categories: text("categories").array(),
  logoUrl: text("logo_url"),
  isActive: boolean("is_active").default(true),
  lastScrapedAt: timestamp("last_scraped_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertServiceProviderSchema = createInsertSchema(serviceProviders).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  lastScrapedAt: true
});

export type ServiceProvider = typeof serviceProviders.$inferSelect;
export type InsertServiceProvider = z.infer<typeof insertServiceProviderSchema>;

// Provider Listings (scraped services/classifieds)
export const providerListings = pgTable("provider_listings", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  price: text("price"),
  priceNote: text("price_note"),
  bookingUrl: text("booking_url"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  serviceArea: text("service_area"),
  keywords: text("keywords").array(),
  sourceUrl: text("source_url"),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  scrapedAt: timestamp("scraped_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProviderListingSchema = createInsertSchema(providerListings).omit({ 
  id: true, 
  createdAt: true, 
  scrapedAt: true 
});

export type ProviderListing = typeof providerListings.$inferSelect;
export type InsertProviderListing = z.infer<typeof insertProviderListingSchema>;

// Lead Services - tracks services assigned/offered to leads by ambassadors
export const leadServices = pgTable("lead_services", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull(),
  listingId: integer("listing_id"),
  serviceName: text("service_name").notNull(),
  status: text("status").notNull().default("suggested"),
  notes: text("notes"),
  ambassadorId: text("ambassador_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertLeadServiceSchema = createInsertSchema(leadServices).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type LeadService = typeof leadServices.$inferSelect;
export type InsertLeadService = z.infer<typeof insertLeadServiceSchema>;

// Lead service status options
export const LEAD_SERVICE_STATUSES = [
  "suggested",
  "contacted", 
  "interested",
  "sold",
  "declined"
] as const;

export type LeadServiceStatus = typeof LEAD_SERVICE_STATUSES[number];

// Ambassador Points - gamification tracking
export const ambassadorPoints = pgTable("ambassador_points", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  totalPoints: integer("total_points").notNull().default(0),
  level: integer("level").notNull().default(1),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActivityDate: timestamp("last_activity_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAmbassadorPointsSchema = createInsertSchema(ambassadorPoints).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type AmbassadorPoints = typeof ambassadorPoints.$inferSelect;
export type InsertAmbassadorPoints = z.infer<typeof insertAmbassadorPointsSchema>;

// Ambassador Actions - log of point-earning activities
export const ambassadorActions = pgTable("ambassador_actions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  actionType: text("action_type").notNull(),
  pointsAwarded: integer("points_awarded").notNull(),
  leadId: integer("lead_id"),
  leadServiceId: integer("lead_service_id"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAmbassadorActionSchema = createInsertSchema(ambassadorActions).omit({ 
  id: true, 
  createdAt: true 
});

export type AmbassadorAction = typeof ambassadorActions.$inferSelect;
export type InsertAmbassadorAction = z.infer<typeof insertAmbassadorActionSchema>;

// Point values for different actions
export const ACTION_POINTS = {
  SUGGEST_SERVICE: 5,
  CONTACT_LEAD: 10,
  LEAD_INTERESTED: 15,
  MAKE_SALE: 50,
  DAILY_LOGIN: 2,
  STREAK_BONUS_7: 25,
  STREAK_BONUS_30: 100,
  GENERATE_DESIGN: 15,
} as const;

// Level thresholds
export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  300,    // Level 3
  600,    // Level 4
  1000,   // Level 5
  1500,   // Level 6
  2500,   // Level 7
  4000,   // Level 8
  6000,   // Level 9
  10000,  // Level 10
] as const;

// Ambassador Badges
export const ambassadorBadges = pgTable("ambassador_badges", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  badgeType: text("badge_type").notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const insertAmbassadorBadgeSchema = createInsertSchema(ambassadorBadges).omit({ 
  id: true, 
  earnedAt: true 
});

export type AmbassadorBadge = typeof ambassadorBadges.$inferSelect;
export type InsertAmbassadorBadge = z.infer<typeof insertAmbassadorBadgeSchema>;

// Badge definitions
export const BADGE_DEFINITIONS = {
  FIRST_LEAD: { name: "First Lead", description: "Suggested your first service", icon: "star" },
  FIRST_SALE: { name: "Closer", description: "Made your first sale", icon: "trophy" },
  STREAK_7: { name: "Week Warrior", description: "7-day activity streak", icon: "flame" },
  STREAK_30: { name: "Monthly Master", description: "30-day activity streak", icon: "zap" },
  SALES_10: { name: "Sales Pro", description: "Made 10 sales", icon: "trending-up" },
  SALES_50: { name: "Sales Legend", description: "Made 50 sales", icon: "crown" },
  LEVEL_5: { name: "Rising Star", description: "Reached level 5", icon: "sparkles" },
  LEVEL_10: { name: "Elite Ambassador", description: "Reached level 10", icon: "award" },
} as const;

export type BadgeType = keyof typeof BADGE_DEFINITIONS;
