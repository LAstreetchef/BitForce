import { 
  leads, 
  eventRegistrations, 
  ambassadorSubscriptions,
  referralBonuses,
  recurringOverrides,
  type Lead, 
  type InsertLead, 
  type EventRegistration, 
  type InsertEventRegistration,
  type AmbassadorSubscription,
  type InsertAmbassadorSubscription,
  type ReferralBonus,
  type InsertReferralBonus,
  type RecurringOverride,
  type InsertRecurringOverride
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  createLead(lead: InsertLead): Promise<Lead>;
  createEventRegistration(registration: InsertEventRegistration): Promise<EventRegistration>;
  
  createAmbassadorSubscription(subscription: InsertAmbassadorSubscription): Promise<AmbassadorSubscription>;
  getAmbassadorByUserId(userId: string): Promise<AmbassadorSubscription | null>;
  getAmbassadorByReferralCode(code: string): Promise<AmbassadorSubscription | null>;
  getAmbassadorByStripeCustomerId(customerId: string): Promise<AmbassadorSubscription | null>;
  updateAmbassadorSubscription(id: number, updates: Partial<AmbassadorSubscription>): Promise<AmbassadorSubscription>;
  
  createReferralBonus(bonus: InsertReferralBonus): Promise<ReferralBonus>;
  getReferralBonusesByAmbassador(ambassadorId: number): Promise<ReferralBonus[]>;
  updateReferralBonusStatus(id: number, status: string, paidAt?: Date): Promise<ReferralBonus>;
  
  createRecurringOverride(override: InsertRecurringOverride): Promise<RecurringOverride>;
  getRecurringOverridesByAmbassador(ambassadorId: number): Promise<RecurringOverride[]>;
}

function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'BF';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export class DatabaseStorage implements IStorage {
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(insertLead).returning();
    return lead;
  }

  async createEventRegistration(insertRegistration: InsertEventRegistration): Promise<EventRegistration> {
    const [registration] = await db.insert(eventRegistrations).values(insertRegistration).returning();
    return registration;
  }

  async createAmbassadorSubscription(insertSubscription: InsertAmbassadorSubscription): Promise<AmbassadorSubscription> {
    const referralCode = insertSubscription.referralCode || generateReferralCode();
    const [subscription] = await db.insert(ambassadorSubscriptions)
      .values({ ...insertSubscription, referralCode })
      .returning();
    return subscription;
  }

  async getAmbassadorByUserId(userId: string): Promise<AmbassadorSubscription | null> {
    const [subscription] = await db.select()
      .from(ambassadorSubscriptions)
      .where(eq(ambassadorSubscriptions.userId, userId));
    return subscription || null;
  }

  async getAmbassadorByReferralCode(code: string): Promise<AmbassadorSubscription | null> {
    const [subscription] = await db.select()
      .from(ambassadorSubscriptions)
      .where(eq(ambassadorSubscriptions.referralCode, code));
    return subscription || null;
  }

  async getAmbassadorByStripeCustomerId(customerId: string): Promise<AmbassadorSubscription | null> {
    const [subscription] = await db.select()
      .from(ambassadorSubscriptions)
      .where(eq(ambassadorSubscriptions.stripeCustomerId, customerId));
    return subscription || null;
  }

  async updateAmbassadorSubscription(id: number, updates: Partial<AmbassadorSubscription>): Promise<AmbassadorSubscription> {
    const [subscription] = await db.update(ambassadorSubscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(ambassadorSubscriptions.id, id))
      .returning();
    return subscription;
  }

  async createReferralBonus(insertBonus: InsertReferralBonus): Promise<ReferralBonus> {
    const [bonus] = await db.insert(referralBonuses)
      .values(insertBonus)
      .returning();
    return bonus;
  }

  async getReferralBonusesByAmbassador(ambassadorId: number): Promise<ReferralBonus[]> {
    return db.select()
      .from(referralBonuses)
      .where(eq(referralBonuses.ambassadorId, ambassadorId));
  }

  async updateReferralBonusStatus(id: number, status: string, paidAt?: Date): Promise<ReferralBonus> {
    const [bonus] = await db.update(referralBonuses)
      .set({ status, paidAt })
      .where(eq(referralBonuses.id, id))
      .returning();
    return bonus;
  }

  async createRecurringOverride(insertOverride: InsertRecurringOverride): Promise<RecurringOverride> {
    const [override] = await db.insert(recurringOverrides)
      .values(insertOverride)
      .returning();
    return override;
  }

  async getRecurringOverridesByAmbassador(ambassadorId: number): Promise<RecurringOverride[]> {
    return db.select()
      .from(recurringOverrides)
      .where(eq(recurringOverrides.ambassadorId, ambassadorId));
  }
}

export const storage = new DatabaseStorage();
