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
  phone: text("phone"),
  referralCode: text("referral_code").notNull().unique(),
  referredByCode: text("referred_by_code"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  signupFeePaid: boolean("signup_fee_paid").default(false),
  subscriptionStatus: text("subscription_status").default("inactive"),
  firstMonthCompleted: boolean("first_month_completed").default(false),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  onboardingStep: integer("onboarding_step").default(0),
  agreedToTerms: boolean("agreed_to_terms").default(false),
  agreedToTermsAt: timestamp("agreed_to_terms_at"),
  bftBalance: decimal("bft_balance", { precision: 18, scale: 4 }).notNull().default("0"),
  bftLastUpdated: timestamp("bft_last_updated"),
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

// BFT Token Transactions - tracks all BFT earning events
export const bftTransactions = pgTable("bft_transactions", {
  id: serial("id").primaryKey(),
  ambassadorId: integer("ambassador_id").notNull(),
  transactionType: text("transaction_type").notNull(), // daily_login, ambassador_signup, customer_contact, interest_shown, sale_closed, streak_7day, streak_30day, service_logged, admin_adjustment
  amount: decimal("amount", { precision: 18, scale: 4 }).notNull(),
  balanceAfter: decimal("balance_after", { precision: 18, scale: 4 }).notNull(),
  referenceId: text("reference_id"), // Optional reference to the activity that triggered this (e.g., lead ID, referral ID)
  referenceType: text("reference_type"), // Type of reference: lead, referral, streak, etc.
  description: text("description"),
  metadata: text("metadata"), // JSON string for additional data
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBftTransactionSchema = createInsertSchema(bftTransactions).omit({ 
  id: true, 
  createdAt: true 
});

export type BftTransaction = typeof bftTransactions.$inferSelect;
export type InsertBftTransaction = z.infer<typeof insertBftTransactionSchema>;

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

// Support Messages - "Charlie" style communication between ambassadors and management
export const supportMessages = pgTable("support_messages", {
  id: serial("id").primaryKey(),
  ambassadorUserId: text("ambassador_user_id").notNull(),
  ambassadorName: text("ambassador_name").notNull(),
  content: text("content").notNull(),
  sender: text("sender").notNull(), // "ambassador" or "support"
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSupportMessageSchema = createInsertSchema(supportMessages).omit({ 
  id: true, 
  createdAt: true 
});

export type SupportMessage = typeof supportMessages.$inferSelect;
export type InsertSupportMessage = z.infer<typeof insertSupportMessageSchema>;

// Ambassador Invitations - track referral invites sent by ambassadors
export const ambassadorInvitations = pgTable("ambassador_invitations", {
  id: serial("id").primaryKey(),
  inviterUserId: text("inviter_user_id").notNull(),
  inviterName: text("inviter_name").notNull(),
  inviteeEmail: text("invitee_email").notNull(),
  inviteeName: text("invitee_name").notNull(),
  referralCode: text("referral_code").notNull(),
  status: text("status").notNull().default("pending"), // pending, accepted, expired
  sentAt: timestamp("sent_at").defaultNow(),
  acceptedAt: timestamp("accepted_at"),
});

export const insertAmbassadorInvitationSchema = createInsertSchema(ambassadorInvitations).omit({ 
  id: true, 
  sentAt: true,
  acceptedAt: true
});

export type AmbassadorInvitation = typeof ambassadorInvitations.$inferSelect;
export type InsertAmbassadorInvitation = z.infer<typeof insertAmbassadorInvitationSchema>;

// Ambassador Contacts - personal network contacts uploaded by ambassadors
export const ambassadorContacts = pgTable("ambassador_contacts", {
  id: serial("id").primaryKey(),
  ambassadorUserId: text("ambassador_user_id").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  notes: text("notes"),
  emailSentType: text("email_sent_type"), // "ambassador_invite" | "customer_invite" | null
  emailSentAt: timestamp("email_sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAmbassadorContactSchema = createInsertSchema(ambassadorContacts).omit({ 
  id: true, 
  createdAt: true,
  emailSentAt: true
});

export type AmbassadorContact = typeof ambassadorContacts.$inferSelect;
export type InsertAmbassadorContact = z.infer<typeof insertAmbassadorContactSchema>;

// Withings OAuth tokens for customer health device connections
export const withingsTokens = pgTable("withings_tokens", {
  id: serial("id").primaryKey(),
  ambassadorUserId: text("ambassador_user_id").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name"),
  withingsUserId: text("withings_user_id").notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  scope: text("scope"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWithingsTokenSchema = createInsertSchema(withingsTokens).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type WithingsToken = typeof withingsTokens.$inferSelect;
export type InsertWithingsToken = z.infer<typeof insertWithingsTokenSchema>;

// Coupon App API tokens for OAuth-style authentication
export const couponAppTokens = pgTable("coupon_app_tokens", {
  id: serial("id").primaryKey(),
  ambassadorUserId: text("ambassador_user_id").notNull(),
  accessToken: text("access_token").notNull().unique(),
  refreshToken: text("refresh_token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  scope: text("scope").default("read:customers read:leads write:coupon-books"),
  createdAt: timestamp("created_at").defaultNow(),
  lastUsedAt: timestamp("last_used_at"),
});

export const insertCouponAppTokenSchema = createInsertSchema(couponAppTokens).omit({ 
  id: true, 
  createdAt: true, 
  lastUsedAt: true 
});

export type CouponAppToken = typeof couponAppTokens.$inferSelect;
export type InsertCouponAppToken = z.infer<typeof insertCouponAppTokenSchema>;

// Shared coupon books record for tracking
export const sharedCouponBooks = pgTable("shared_coupon_books", {
  id: serial("id").primaryKey(),
  ambassadorUserId: text("ambassador_user_id").notNull(),
  customerId: integer("customer_id"),
  leadId: integer("lead_id"),
  title: text("title").notNull(),
  couponsData: text("coupons_data").notNull(), // JSON string of coupons array
  totalSavings: text("total_savings"),
  shareVia: text("share_via").notNull(), // "email" | "sms"
  status: text("status").default("pending"), // "pending" | "sent" | "failed"
  sharedAt: timestamp("shared_at").defaultNow(),
});

export const insertSharedCouponBookSchema = createInsertSchema(sharedCouponBooks).omit({ 
  id: true, 
  sharedAt: true 
});

export type SharedCouponBook = typeof sharedCouponBooks.$inferSelect;
export type InsertSharedCouponBook = z.infer<typeof insertSharedCouponBookSchema>;

// Saved Leads from Lead Finder tool - businesses found via Google Places API
export const savedLeads = pgTable("saved_leads", {
  id: serial("id").primaryKey(),
  ambassadorUserId: text("ambassador_user_id").notNull(),
  placeId: text("place_id").notNull(), // Google Places ID for deduplication
  businessName: text("business_name").notNull(),
  address: text("address").notNull(),
  phone: text("phone"),
  website: text("website"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
  businessType: text("business_type"), // e.g., "restaurant", "retail", "service"
  rating: decimal("rating", { precision: 2, scale: 1 }),
  reviewCount: integer("review_count"),
  priceLevel: integer("price_level"),
  score: integer("score").notNull().default(50), // Lead score 0-100
  status: text("status").notNull().default("new"), // new, contacted, interested, client, declined
  notes: text("notes"),
  foundVia: text("found_via").default("google_places"),
  searchLocation: text("search_location"), // Original search query
  searchRadius: integer("search_radius"), // Miles
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSavedLeadSchema = createInsertSchema(savedLeads).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type SavedLead = typeof savedLeads.$inferSelect;
export type InsertSavedLead = z.infer<typeof insertSavedLeadSchema>;

// Lead status options for Lead Finder
export const SAVED_LEAD_STATUSES = [
  "new",
  "contacted", 
  "interested",
  "client",
  "declined"
] as const;

export type SavedLeadStatus = typeof SAVED_LEAD_STATUSES[number];
