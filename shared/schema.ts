import { pgTable, text, serial, timestamp, integer, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";

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
