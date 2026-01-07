import { 
  leads, 
  eventRegistrations, 
  ambassadorSubscriptions,
  referralBonuses,
  recurringOverrides,
  serviceProviders,
  providerListings,
  type Lead, 
  type InsertLead, 
  type EventRegistration, 
  type InsertEventRegistration,
  type AmbassadorSubscription,
  type InsertAmbassadorSubscription,
  type ReferralBonus,
  type InsertReferralBonus,
  type RecurringOverride,
  type InsertRecurringOverride,
  type ServiceProvider,
  type InsertServiceProvider,
  type ProviderListing,
  type InsertProviderListing
} from "@shared/schema";
import { db } from "./db";
import { eq, and, ilike, or, sql } from "drizzle-orm";

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
  
  // Service Providers
  createServiceProvider(provider: InsertServiceProvider): Promise<ServiceProvider>;
  getServiceProviders(): Promise<ServiceProvider[]>;
  getServiceProviderById(id: number): Promise<ServiceProvider | null>;
  updateServiceProvider(id: number, updates: Partial<ServiceProvider>): Promise<ServiceProvider>;
  
  // Provider Listings
  createProviderListing(listing: InsertProviderListing): Promise<ProviderListing>;
  getProviderListings(providerId?: number): Promise<ProviderListing[]>;
  getListingsByCategory(category: string): Promise<ProviderListing[]>;
  searchListings(keywords: string[]): Promise<(ProviderListing & { provider: ServiceProvider })[]>;
  upsertProviderListing(listing: InsertProviderListing, sourceUrl: string): Promise<ProviderListing>;
  deleteExpiredListings(): Promise<number>;
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

  // Service Providers
  async createServiceProvider(insertProvider: InsertServiceProvider): Promise<ServiceProvider> {
    const [provider] = await db.insert(serviceProviders)
      .values(insertProvider)
      .returning();
    return provider;
  }

  async getServiceProviders(): Promise<ServiceProvider[]> {
    return db.select()
      .from(serviceProviders)
      .where(eq(serviceProviders.isActive, true));
  }

  async getServiceProviderById(id: number): Promise<ServiceProvider | null> {
    const [provider] = await db.select()
      .from(serviceProviders)
      .where(eq(serviceProviders.id, id));
    return provider || null;
  }

  async updateServiceProvider(id: number, updates: Partial<ServiceProvider>): Promise<ServiceProvider> {
    const [provider] = await db.update(serviceProviders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(serviceProviders.id, id))
      .returning();
    return provider;
  }

  // Provider Listings
  async createProviderListing(insertListing: InsertProviderListing): Promise<ProviderListing> {
    const [listing] = await db.insert(providerListings)
      .values(insertListing)
      .returning();
    return listing;
  }

  async getProviderListings(providerId?: number): Promise<ProviderListing[]> {
    if (providerId) {
      return db.select()
        .from(providerListings)
        .where(and(
          eq(providerListings.providerId, providerId),
          eq(providerListings.isActive, true)
        ));
    }
    return db.select()
      .from(providerListings)
      .where(eq(providerListings.isActive, true));
  }

  async getListingsByCategory(category: string): Promise<ProviderListing[]> {
    return db.select()
      .from(providerListings)
      .where(and(
        ilike(providerListings.category, `%${category}%`),
        eq(providerListings.isActive, true)
      ));
  }

  async searchListings(keywords: string[]): Promise<(ProviderListing & { provider: ServiceProvider })[]> {
    const results = await db.select({
      listing: providerListings,
      provider: serviceProviders
    })
      .from(providerListings)
      .innerJoin(serviceProviders, eq(providerListings.providerId, serviceProviders.id))
      .where(and(
        eq(providerListings.isActive, true),
        eq(serviceProviders.isActive, true),
        or(
          ...keywords.map(keyword => 
            or(
              ilike(providerListings.title, `%${keyword}%`),
              ilike(providerListings.description, `%${keyword}%`),
              ilike(providerListings.category, `%${keyword}%`)
            )
          )
        )
      ));
    
    return results.map(r => ({ ...r.listing, provider: r.provider }));
  }

  async upsertProviderListing(listing: InsertProviderListing, sourceUrl: string): Promise<ProviderListing> {
    const existing = await db.select()
      .from(providerListings)
      .where(eq(providerListings.sourceUrl, sourceUrl));
    
    if (existing.length > 0) {
      const [updated] = await db.update(providerListings)
        .set({ ...listing, scrapedAt: new Date() })
        .where(eq(providerListings.sourceUrl, sourceUrl))
        .returning();
      return updated;
    }
    
    const [created] = await db.insert(providerListings)
      .values({ ...listing, sourceUrl })
      .returning();
    return created;
  }

  async deleteExpiredListings(): Promise<number> {
    const result = await db.delete(providerListings)
      .where(and(
        sql`${providerListings.expiresAt} IS NOT NULL`,
        sql`${providerListings.expiresAt} < NOW()`
      ));
    return 0;
  }
}

export const storage = new DatabaseStorage();
