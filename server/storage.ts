import { 
  users,
  leads, 
  eventRegistrations, 
  ambassadorSubscriptions,
  referralBonuses,
  recurringOverrides,
  serviceProviders,
  providerListings,
  leadServices,
  ambassadorPoints,
  ambassadorActions,
  ambassadorBadges,
  supportMessages,
  ambassadorInvitations,
  ambassadorContacts,
  withingsTokens,
  couponAppTokens,
  sharedCouponBooks,
  savedLeads,
  bftTransactions,
  trainingProgress,
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
  type InsertProviderListing,
  type LeadService,
  type InsertLeadService,
  type AmbassadorPoints,
  type InsertAmbassadorPoints,
  type AmbassadorAction,
  type InsertAmbassadorAction,
  type AmbassadorBadge,
  type InsertAmbassadorBadge,
  type SupportMessage,
  type InsertSupportMessage,
  type AmbassadorInvitation,
  type InsertAmbassadorInvitation,
  type AmbassadorContact,
  type InsertAmbassadorContact,
  type WithingsToken,
  type InsertWithingsToken,
  type CouponAppToken,
  type InsertCouponAppToken,
  type SharedCouponBook,
  type InsertSharedCouponBook,
  type SavedLead,
  type BftTransaction,
  type InsertBftTransaction,
  type InsertSavedLead,
  type TrainingProgress,
  type InsertTrainingProgress,
  LEVEL_THRESHOLDS
} from "@shared/schema";
import { getDb, isDatabaseAvailable } from "./db";
import { eq, and, ilike, or, sql, desc, gte, inArray } from "drizzle-orm";

export interface IStorage {
  createLead(lead: InsertLead): Promise<Lead>;
  getLead(id: number): Promise<Lead | null>;
  getLeads(): Promise<Lead[]>;
  createEventRegistration(registration: InsertEventRegistration): Promise<EventRegistration>;
  
  createAmbassadorSubscription(subscription: InsertAmbassadorSubscription): Promise<AmbassadorSubscription>;
  getAmbassadorById(id: number): Promise<AmbassadorSubscription | null>;
  getAmbassadorByUserId(userId: string): Promise<AmbassadorSubscription | null>;
  getAmbassadorByEmail(email: string): Promise<AmbassadorSubscription | null>;
  getAmbassadorByReferralCode(code: string): Promise<AmbassadorSubscription | null>;
  getAmbassadorByStripeCustomerId(customerId: string): Promise<AmbassadorSubscription | null>;
  updateAmbassadorSubscription(id: number, updates: Partial<AmbassadorSubscription>): Promise<AmbassadorSubscription>;
  
  createReferralBonus(bonus: InsertReferralBonus): Promise<ReferralBonus>;
  getReferralBonusesByAmbassador(ambassadorId: number): Promise<ReferralBonus[]>;
  updateReferralBonusStatus(id: number, status: string, paidAt?: Date): Promise<ReferralBonus>;
  markBonusQualified(id: number): Promise<ReferralBonus>;
  getQualifiedBonusesByAmbassador(ambassadorId: number): Promise<ReferralBonus[]>;
  forfeitPendingBonuses(ambassadorId: number, reason: string): Promise<number>;
  
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
  
  // Lead Services
  createLeadService(service: InsertLeadService): Promise<LeadService>;
  getLeadServices(leadId: number): Promise<LeadService[]>;
  getLeadServicesByAmbassador(ambassadorId: string): Promise<LeadService[]>;
  updateLeadServiceStatus(id: number, status: string, notes?: string): Promise<LeadService>;
  
  // Ambassador Gamification
  getOrCreateAmbassadorPoints(userId: string): Promise<AmbassadorPoints>;
  updateAmbassadorPoints(userId: string, pointsToAdd: number): Promise<AmbassadorPoints>;
  updateStreakAndActivity(userId: string, currentStreak: number, longestStreak: number, lastActivityDate: Date): Promise<AmbassadorPoints>;
  logAmbassadorAction(action: InsertAmbassadorAction): Promise<AmbassadorAction>;
  getAmbassadorActions(userId: string, limit?: number): Promise<AmbassadorAction[]>;
  getAllRecentActions(limit?: number): Promise<(AmbassadorAction & { actorName: string })[]>;
  getLeaderboard(limit?: number): Promise<AmbassadorPoints[]>;
  
  // Ambassador Badges
  awardBadge(userId: string, badgeType: string): Promise<AmbassadorBadge>;
  getAmbassadorBadges(userId: string): Promise<AmbassadorBadge[]>;
  hasBadge(userId: string, badgeType: string): Promise<boolean>;
  
  // Support Messages ("Charlie" system)
  createSupportMessage(message: InsertSupportMessage): Promise<SupportMessage>;
  getSupportMessages(ambassadorUserId: string): Promise<SupportMessage[]>;
  getAllSupportConversations(): Promise<{ ambassadorUserId: string; ambassadorName: string; lastMessage: SupportMessage; unreadCount: number }[]>;
  markMessagesAsRead(ambassadorUserId: string, sender: string): Promise<void>;
  
  // Ambassador Invitations
  createAmbassadorInvitation(invitation: InsertAmbassadorInvitation): Promise<AmbassadorInvitation>;
  getInvitationsByInviter(inviterUserId: string): Promise<AmbassadorInvitation[]>;
  
  // Ambassador Contacts
  createAmbassadorContact(contact: InsertAmbassadorContact): Promise<AmbassadorContact>;
  createAmbassadorContacts(contacts: InsertAmbassadorContact[]): Promise<AmbassadorContact[]>;
  getAmbassadorContacts(ambassadorUserId: string): Promise<AmbassadorContact[]>;
  deleteAmbassadorContact(id: number, ambassadorUserId: string): Promise<boolean>;
  updateContactEmailSent(id: number, ambassadorUserId: string, emailType: string): Promise<AmbassadorContact | undefined>;
  
  // Withings Tokens
  createWithingsToken(token: InsertWithingsToken): Promise<WithingsToken>;
  getWithingsTokensByAmbassador(ambassadorUserId: string): Promise<WithingsToken[]>;
  getWithingsTokenByCustomer(ambassadorUserId: string, customerEmail: string): Promise<WithingsToken | null>;
  getWithingsTokenById(id: number): Promise<WithingsToken | null>;
  updateWithingsToken(id: number, updates: Partial<WithingsToken>): Promise<WithingsToken>;
  deleteWithingsToken(id: number, ambassadorUserId: string): Promise<boolean>;
  
  // Coupon App Tokens
  createCouponAppToken(token: InsertCouponAppToken): Promise<CouponAppToken>;
  getCouponAppTokenByAccessToken(accessToken: string): Promise<CouponAppToken | null>;
  getCouponAppTokenByRefreshToken(refreshToken: string): Promise<CouponAppToken | null>;
  updateCouponAppTokenLastUsed(id: number): Promise<void>;
  deleteCouponAppToken(id: number): Promise<void>;
  deleteExpiredCouponAppTokens(): Promise<number>;
  
  // Shared Coupon Books
  createSharedCouponBook(book: InsertSharedCouponBook): Promise<SharedCouponBook>;
  getSharedCouponBooksByAmbassador(ambassadorUserId: string): Promise<SharedCouponBook[]>;
  updateSharedCouponBookStatus(id: number, status: string): Promise<SharedCouponBook>;
  
  // Coupon App Sync Methods
  getLeadsPaginated(limit: number, offset: number, updatedSince?: Date): Promise<{ data: Lead[]; total: number }>;
  getAmbassadorContactsPaginated(ambassadorUserId: string, limit: number, offset: number, updatedSince?: Date): Promise<{ data: AmbassadorContact[]; total: number }>;
  
  // Saved Leads (Lead Finder)
  createSavedLead(lead: InsertSavedLead): Promise<SavedLead>;
  getSavedLeadsByAmbassador(ambassadorUserId: string): Promise<SavedLead[]>;
  getSavedLeadById(id: number, ambassadorUserId: string): Promise<SavedLead | null>;
  getSavedLeadByPlaceId(placeId: string, ambassadorUserId: string): Promise<SavedLead | null>;
  updateSavedLead(id: number, ambassadorUserId: string, updates: Partial<SavedLead>): Promise<SavedLead | null>;
  deleteSavedLead(id: number, ambassadorUserId: string): Promise<boolean>;
  
  // BFT Platform Integration Metrics
  getAmbassadorCount(): Promise<number>;
  getCustomerCount(): Promise<number>;
  getMonthlyPurchaseVolume(): Promise<number>;
  
  // BFT Token Tracking
  getAmbassadorBftBalance(ambassadorId: number): Promise<string>;
  getAmbassadorsWithBftBalances(limit?: number): Promise<any[]>;
  recordBftTransaction(ambassadorId: number, transactionType: string, amount: number, description?: string, referenceId?: string, referenceType?: string, metadata?: Record<string, unknown>): Promise<BftTransaction>;
  getBftTransactions(ambassadorId: number, limit?: number): Promise<BftTransaction[]>;
  getAllRecentBftTransactions(limit?: number): Promise<(BftTransaction & { ambassadorName: string })[]>;
  hasBftTransaction(ambassadorId: number, transactionType: string, referenceId: string): Promise<boolean>;
  
  // Training Progress
  completeLesson(userId: string, lessonId: string, moduleId: string): Promise<TrainingProgress>;
  getCompletedLessons(userId: string): Promise<TrainingProgress[]>;
  isLessonCompleted(userId: string, lessonId: string): Promise<boolean>;
  getModuleCompletedLessons(userId: string, moduleId: string): Promise<TrainingProgress[]>;
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
    const [lead] = await getDb().insert(leads).values(insertLead).returning();
    return lead;
  }

  async getLead(id: number): Promise<Lead | null> {
    const [lead] = await getDb().select().from(leads).where(eq(leads.id, id));
    return lead || null;
  }

  async getLeads(): Promise<Lead[]> {
    return getDb().select().from(leads).orderBy(sql`${leads.createdAt} DESC`);
  }

  async createEventRegistration(insertRegistration: InsertEventRegistration): Promise<EventRegistration> {
    const [registration] = await getDb().insert(eventRegistrations).values(insertRegistration).returning();
    return registration;
  }

  async createAmbassadorSubscription(insertSubscription: InsertAmbassadorSubscription): Promise<AmbassadorSubscription> {
    const referralCode = insertSubscription.referralCode || generateReferralCode();
    const [subscription] = await getDb().insert(ambassadorSubscriptions)
      .values({ ...insertSubscription, referralCode })
      .returning();
    return subscription;
  }

  async getAmbassadorById(id: number): Promise<AmbassadorSubscription | null> {
    const [subscription] = await getDb().select()
      .from(ambassadorSubscriptions)
      .where(eq(ambassadorSubscriptions.id, id));
    return subscription || null;
  }

  async getAmbassadorByUserId(userId: string): Promise<AmbassadorSubscription | null> {
    const [subscription] = await getDb().select()
      .from(ambassadorSubscriptions)
      .where(eq(ambassadorSubscriptions.userId, userId));
    return subscription || null;
  }

  async getAmbassadorByEmail(email: string): Promise<AmbassadorSubscription | null> {
    const [subscription] = await getDb().select()
      .from(ambassadorSubscriptions)
      .where(eq(ambassadorSubscriptions.email, email));
    return subscription || null;
  }

  async getAmbassadorByReferralCode(code: string): Promise<AmbassadorSubscription | null> {
    const [subscription] = await getDb().select()
      .from(ambassadorSubscriptions)
      .where(eq(ambassadorSubscriptions.referralCode, code));
    return subscription || null;
  }

  async getAmbassadorByStripeCustomerId(customerId: string): Promise<AmbassadorSubscription | null> {
    const [subscription] = await getDb().select()
      .from(ambassadorSubscriptions)
      .where(eq(ambassadorSubscriptions.stripeCustomerId, customerId));
    return subscription || null;
  }

  async updateAmbassadorSubscription(id: number, updates: Partial<AmbassadorSubscription>): Promise<AmbassadorSubscription> {
    const [subscription] = await getDb().update(ambassadorSubscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(ambassadorSubscriptions.id, id))
      .returning();
    return subscription;
  }

  async createReferralBonus(insertBonus: InsertReferralBonus): Promise<ReferralBonus> {
    const [bonus] = await getDb().insert(referralBonuses)
      .values(insertBonus)
      .returning();
    return bonus;
  }

  async getReferralBonusesByAmbassador(ambassadorId: number): Promise<ReferralBonus[]> {
    return getDb().select()
      .from(referralBonuses)
      .where(eq(referralBonuses.ambassadorId, ambassadorId));
  }

  async updateReferralBonusStatus(id: number, status: string, paidAt?: Date): Promise<ReferralBonus> {
    const [bonus] = await getDb().update(referralBonuses)
      .set({ status, paidAt })
      .where(eq(referralBonuses.id, id))
      .returning();
    return bonus;
  }

  async markBonusQualified(id: number): Promise<ReferralBonus> {
    const [bonus] = await getDb().update(referralBonuses)
      .set({ status: "qualified", qualifiedAt: new Date() })
      .where(eq(referralBonuses.id, id))
      .returning();
    return bonus;
  }

  async getQualifiedBonusesByAmbassador(ambassadorId: number): Promise<ReferralBonus[]> {
    return getDb().select()
      .from(referralBonuses)
      .where(and(
        eq(referralBonuses.ambassadorId, ambassadorId),
        eq(referralBonuses.status, "qualified")
      ));
  }

  async forfeitPendingBonuses(ambassadorId: number, reason: string): Promise<number> {
    const result = await getDb().update(referralBonuses)
      .set({ 
        status: "forfeited", 
        forfeitedAt: new Date(),
        forfeitReason: reason 
      })
      .where(and(
        eq(referralBonuses.ambassadorId, ambassadorId),
        or(
          eq(referralBonuses.status, "pending"),
          eq(referralBonuses.status, "qualified")
        )
      ))
      .returning();
    return result.length;
  }

  async createRecurringOverride(insertOverride: InsertRecurringOverride): Promise<RecurringOverride> {
    const [override] = await getDb().insert(recurringOverrides)
      .values(insertOverride)
      .returning();
    return override;
  }

  async getRecurringOverridesByAmbassador(ambassadorId: number): Promise<RecurringOverride[]> {
    return getDb().select()
      .from(recurringOverrides)
      .where(eq(recurringOverrides.ambassadorId, ambassadorId));
  }

  // Service Providers
  async createServiceProvider(insertProvider: InsertServiceProvider): Promise<ServiceProvider> {
    const [provider] = await getDb().insert(serviceProviders)
      .values(insertProvider)
      .returning();
    return provider;
  }

  async getServiceProviders(): Promise<ServiceProvider[]> {
    return getDb().select()
      .from(serviceProviders)
      .where(eq(serviceProviders.isActive, true));
  }

  async getServiceProviderById(id: number): Promise<ServiceProvider | null> {
    const [provider] = await getDb().select()
      .from(serviceProviders)
      .where(eq(serviceProviders.id, id));
    return provider || null;
  }

  async updateServiceProvider(id: number, updates: Partial<ServiceProvider>): Promise<ServiceProvider> {
    const [provider] = await getDb().update(serviceProviders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(serviceProviders.id, id))
      .returning();
    return provider;
  }

  // Provider Listings
  async createProviderListing(insertListing: InsertProviderListing): Promise<ProviderListing> {
    const [listing] = await getDb().insert(providerListings)
      .values(insertListing)
      .returning();
    return listing;
  }

  async getProviderListings(providerId?: number): Promise<ProviderListing[]> {
    if (providerId) {
      return getDb().select()
        .from(providerListings)
        .where(and(
          eq(providerListings.providerId, providerId),
          eq(providerListings.isActive, true)
        ));
    }
    return getDb().select()
      .from(providerListings)
      .where(eq(providerListings.isActive, true));
  }

  async getListingsByCategory(category: string): Promise<ProviderListing[]> {
    return getDb().select()
      .from(providerListings)
      .where(and(
        ilike(providerListings.category, `%${category}%`),
        eq(providerListings.isActive, true)
      ));
  }

  async searchListings(keywords: string[]): Promise<(ProviderListing & { provider: ServiceProvider })[]> {
    const results = await getDb().select({
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
    const existing = await getDb().select()
      .from(providerListings)
      .where(eq(providerListings.sourceUrl, sourceUrl));
    
    if (existing.length > 0) {
      const [updated] = await getDb().update(providerListings)
        .set({ ...listing, scrapedAt: new Date() })
        .where(eq(providerListings.sourceUrl, sourceUrl))
        .returning();
      return updated;
    }
    
    const [created] = await getDb().insert(providerListings)
      .values({ ...listing, sourceUrl })
      .returning();
    return created;
  }

  async deleteExpiredListings(): Promise<number> {
    const result = await getDb().delete(providerListings)
      .where(and(
        sql`${providerListings.expiresAt} IS NOT NULL`,
        sql`${providerListings.expiresAt} < NOW()`
      ));
    return 0;
  }

  // Lead Services
  async createLeadService(insertService: InsertLeadService): Promise<LeadService> {
    const [service] = await getDb().insert(leadServices)
      .values(insertService)
      .returning();
    return service;
  }

  async getLeadServices(leadId: number): Promise<LeadService[]> {
    return getDb().select()
      .from(leadServices)
      .where(eq(leadServices.leadId, leadId))
      .orderBy(desc(leadServices.createdAt));
  }

  async getLeadServicesByAmbassador(ambassadorId: string): Promise<LeadService[]> {
    return getDb().select()
      .from(leadServices)
      .where(eq(leadServices.ambassadorId, ambassadorId))
      .orderBy(desc(leadServices.createdAt));
  }

  async updateLeadServiceStatus(id: number, status: string, notes?: string): Promise<LeadService> {
    const updates: Partial<LeadService> = { status, updatedAt: new Date() };
    if (notes !== undefined) {
      updates.notes = notes;
    }
    const [service] = await getDb().update(leadServices)
      .set(updates)
      .where(eq(leadServices.id, id))
      .returning();
    return service;
  }

  // Ambassador Gamification
  async getOrCreateAmbassadorPoints(userId: string): Promise<AmbassadorPoints> {
    const [existing] = await getDb().select()
      .from(ambassadorPoints)
      .where(eq(ambassadorPoints.userId, userId));
    
    if (existing) return existing;
    
    const [created] = await getDb().insert(ambassadorPoints)
      .values({ userId, totalPoints: 0, level: 1, currentStreak: 0, longestStreak: 0 })
      .returning();
    return created;
  }

  async updateAmbassadorPoints(userId: string, pointsToAdd: number): Promise<AmbassadorPoints> {
    const current = await this.getOrCreateAmbassadorPoints(userId);
    const newTotal = current.totalPoints + pointsToAdd;
    
    // Calculate new level based on thresholds
    let newLevel = 1;
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (newTotal >= LEVEL_THRESHOLDS[i]) {
        newLevel = i + 1;
        break;
      }
    }
    
    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActivity = current.lastActivityDate ? new Date(current.lastActivityDate) : null;
    lastActivity?.setHours(0, 0, 0, 0);
    
    let newStreak = current.currentStreak;
    if (lastActivity) {
      const dayDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff === 1) {
        newStreak = current.currentStreak + 1;
      } else if (dayDiff > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }
    
    const [updated] = await getDb().update(ambassadorPoints)
      .set({
        totalPoints: newTotal,
        level: newLevel,
        currentStreak: newStreak,
        longestStreak: Math.max(current.longestStreak, newStreak),
        lastActivityDate: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(ambassadorPoints.userId, userId))
      .returning();
    
    return updated;
  }

  async updateStreakAndActivity(userId: string, currentStreak: number, longestStreak: number, lastActivityDate: Date): Promise<AmbassadorPoints> {
    // Ensure the record exists
    await this.getOrCreateAmbassadorPoints(userId);
    
    const [updated] = await getDb().update(ambassadorPoints)
      .set({
        currentStreak,
        longestStreak,
        lastActivityDate,
        updatedAt: new Date(),
      })
      .where(eq(ambassadorPoints.userId, userId))
      .returning();
    
    return updated;
  }

  async logAmbassadorAction(action: InsertAmbassadorAction): Promise<AmbassadorAction> {
    const [logged] = await getDb().insert(ambassadorActions)
      .values(action)
      .returning();
    return logged;
  }

  async getAmbassadorActions(userId: string, limit: number = 20): Promise<AmbassadorAction[]> {
    return getDb().select()
      .from(ambassadorActions)
      .where(eq(ambassadorActions.userId, userId))
      .orderBy(desc(ambassadorActions.createdAt))
      .limit(limit);
  }

  async getAllRecentActions(limit: number = 50): Promise<(AmbassadorAction & { actorName: string })[]> {
    const results = await getDb()
      .select({
        id: ambassadorActions.id,
        userId: ambassadorActions.userId,
        actionType: ambassadorActions.actionType,
        pointsAwarded: ambassadorActions.pointsAwarded,
        leadId: ambassadorActions.leadId,
        leadServiceId: ambassadorActions.leadServiceId,
        description: ambassadorActions.description,
        createdAt: ambassadorActions.createdAt,
        actorName: ambassadorSubscriptions.fullName,
      })
      .from(ambassadorActions)
      .leftJoin(ambassadorSubscriptions, eq(ambassadorActions.userId, ambassadorSubscriptions.userId))
      .orderBy(desc(ambassadorActions.createdAt))
      .limit(limit);
    
    return results.map(r => ({
      ...r,
      actorName: r.actorName || 'Unknown Ambassador',
    }));
  }

  async getLeaderboard(limit: number = 10): Promise<AmbassadorPoints[]> {
    return getDb().select()
      .from(ambassadorPoints)
      .orderBy(desc(ambassadorPoints.totalPoints))
      .limit(limit);
  }

  // Ambassador Badges
  async awardBadge(userId: string, badgeType: string): Promise<AmbassadorBadge> {
    const [badge] = await getDb().insert(ambassadorBadges)
      .values({ userId, badgeType })
      .returning();
    return badge;
  }

  async getAmbassadorBadges(userId: string): Promise<AmbassadorBadge[]> {
    return getDb().select()
      .from(ambassadorBadges)
      .where(eq(ambassadorBadges.userId, userId))
      .orderBy(desc(ambassadorBadges.earnedAt));
  }

  async hasBadge(userId: string, badgeType: string): Promise<boolean> {
    const [existing] = await getDb().select()
      .from(ambassadorBadges)
      .where(and(
        eq(ambassadorBadges.userId, userId),
        eq(ambassadorBadges.badgeType, badgeType)
      ));
    return !!existing;
  }

  // Support Messages ("Charlie" system)
  async createSupportMessage(message: InsertSupportMessage): Promise<SupportMessage> {
    const [created] = await getDb().insert(supportMessages)
      .values(message)
      .returning();
    return created;
  }

  async getSupportMessages(ambassadorUserId: string): Promise<SupportMessage[]> {
    return getDb().select()
      .from(supportMessages)
      .where(eq(supportMessages.ambassadorUserId, ambassadorUserId))
      .orderBy(supportMessages.createdAt);
  }

  async getAllSupportConversations(): Promise<{ ambassadorUserId: string; ambassadorName: string; lastMessage: SupportMessage; unreadCount: number }[]> {
    const allMessages = await getDb().select()
      .from(supportMessages)
      .orderBy(desc(supportMessages.createdAt));

    const conversationMap = new Map<string, { ambassadorUserId: string; ambassadorName: string; lastMessage: SupportMessage; unreadCount: number }>();
    
    for (const msg of allMessages) {
      if (!conversationMap.has(msg.ambassadorUserId)) {
        const unreadMessages = allMessages.filter(
          m => m.ambassadorUserId === msg.ambassadorUserId && m.sender === "ambassador" && !m.isRead
        );
        conversationMap.set(msg.ambassadorUserId, {
          ambassadorUserId: msg.ambassadorUserId,
          ambassadorName: msg.ambassadorName,
          lastMessage: msg,
          unreadCount: unreadMessages.length,
        });
      }
    }
    
    return Array.from(conversationMap.values());
  }

  async markMessagesAsRead(ambassadorUserId: string, sender: string): Promise<void> {
    await getDb().update(supportMessages)
      .set({ isRead: true })
      .where(and(
        eq(supportMessages.ambassadorUserId, ambassadorUserId),
        eq(supportMessages.sender, sender)
      ));
  }

  // Ambassador Invitations
  async createAmbassadorInvitation(invitation: InsertAmbassadorInvitation): Promise<AmbassadorInvitation> {
    const [created] = await getDb().insert(ambassadorInvitations)
      .values(invitation)
      .returning();
    return created;
  }

  async getInvitationsByInviter(inviterUserId: string): Promise<AmbassadorInvitation[]> {
    return getDb().select()
      .from(ambassadorInvitations)
      .where(eq(ambassadorInvitations.inviterUserId, inviterUserId))
      .orderBy(desc(ambassadorInvitations.sentAt));
  }

  // Ambassador Contacts
  async createAmbassadorContact(contact: InsertAmbassadorContact): Promise<AmbassadorContact> {
    const [created] = await getDb().insert(ambassadorContacts)
      .values(contact)
      .returning();
    return created;
  }

  async createAmbassadorContacts(contacts: InsertAmbassadorContact[]): Promise<AmbassadorContact[]> {
    if (contacts.length === 0) return [];
    const created = await getDb().insert(ambassadorContacts)
      .values(contacts)
      .returning();
    return created;
  }

  async getAmbassadorContacts(ambassadorUserId: string): Promise<AmbassadorContact[]> {
    return getDb().select()
      .from(ambassadorContacts)
      .where(eq(ambassadorContacts.ambassadorUserId, ambassadorUserId))
      .orderBy(desc(ambassadorContacts.createdAt));
  }

  async deleteAmbassadorContact(id: number, ambassadorUserId: string): Promise<boolean> {
    const result = await getDb().delete(ambassadorContacts)
      .where(and(
        eq(ambassadorContacts.id, id),
        eq(ambassadorContacts.ambassadorUserId, ambassadorUserId)
      ))
      .returning();
    return result.length > 0;
  }

  async updateContactEmailSent(id: number, ambassadorUserId: string, emailType: string): Promise<AmbassadorContact | undefined> {
    const [updated] = await getDb().update(ambassadorContacts)
      .set({ 
        emailSentType: emailType,
        emailSentAt: new Date()
      })
      .where(and(
        eq(ambassadorContacts.id, id),
        eq(ambassadorContacts.ambassadorUserId, ambassadorUserId)
      ))
      .returning();
    return updated;
  }

  // Withings Token Methods
  async createWithingsToken(token: InsertWithingsToken): Promise<WithingsToken> {
    const [created] = await getDb().insert(withingsTokens)
      .values(token)
      .returning();
    return created;
  }

  async getWithingsTokensByAmbassador(ambassadorUserId: string): Promise<WithingsToken[]> {
    return getDb().select()
      .from(withingsTokens)
      .where(eq(withingsTokens.ambassadorUserId, ambassadorUserId))
      .orderBy(desc(withingsTokens.createdAt));
  }

  async getWithingsTokenByCustomer(ambassadorUserId: string, customerEmail: string): Promise<WithingsToken | null> {
    const [token] = await getDb().select()
      .from(withingsTokens)
      .where(and(
        eq(withingsTokens.ambassadorUserId, ambassadorUserId),
        eq(withingsTokens.customerEmail, customerEmail)
      ))
      .limit(1);
    return token || null;
  }

  async getWithingsTokenById(id: number): Promise<WithingsToken | null> {
    const [token] = await getDb().select()
      .from(withingsTokens)
      .where(eq(withingsTokens.id, id))
      .limit(1);
    return token || null;
  }

  async updateWithingsToken(id: number, updates: Partial<WithingsToken>): Promise<WithingsToken> {
    const [updated] = await getDb().update(withingsTokens)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(withingsTokens.id, id))
      .returning();
    return updated;
  }

  async deleteWithingsToken(id: number, ambassadorUserId: string): Promise<boolean> {
    const result = await getDb().delete(withingsTokens)
      .where(and(
        eq(withingsTokens.id, id),
        eq(withingsTokens.ambassadorUserId, ambassadorUserId)
      ))
      .returning();
    return result.length > 0;
  }

  // Coupon App Token Methods
  async createCouponAppToken(token: InsertCouponAppToken): Promise<CouponAppToken> {
    const [created] = await getDb().insert(couponAppTokens)
      .values(token)
      .returning();
    return created;
  }

  async getCouponAppTokenByAccessToken(accessToken: string): Promise<CouponAppToken | null> {
    const [token] = await getDb().select()
      .from(couponAppTokens)
      .where(eq(couponAppTokens.accessToken, accessToken))
      .limit(1);
    return token || null;
  }

  async getCouponAppTokenByRefreshToken(refreshToken: string): Promise<CouponAppToken | null> {
    const [token] = await getDb().select()
      .from(couponAppTokens)
      .where(eq(couponAppTokens.refreshToken, refreshToken))
      .limit(1);
    return token || null;
  }

  async updateCouponAppTokenLastUsed(id: number): Promise<void> {
    await getDb().update(couponAppTokens)
      .set({ lastUsedAt: new Date() })
      .where(eq(couponAppTokens.id, id));
  }

  async deleteCouponAppToken(id: number): Promise<void> {
    await getDb().delete(couponAppTokens)
      .where(eq(couponAppTokens.id, id));
  }

  async deleteExpiredCouponAppTokens(): Promise<number> {
    const result = await getDb().delete(couponAppTokens)
      .where(sql`${couponAppTokens.expiresAt} < NOW()`)
      .returning();
    return result.length;
  }

  // Shared Coupon Book Methods
  async createSharedCouponBook(book: InsertSharedCouponBook): Promise<SharedCouponBook> {
    const [created] = await getDb().insert(sharedCouponBooks)
      .values(book)
      .returning();
    return created;
  }

  async getSharedCouponBooksByAmbassador(ambassadorUserId: string): Promise<SharedCouponBook[]> {
    return getDb().select()
      .from(sharedCouponBooks)
      .where(eq(sharedCouponBooks.ambassadorUserId, ambassadorUserId))
      .orderBy(desc(sharedCouponBooks.sharedAt));
  }

  async updateSharedCouponBookStatus(id: number, status: string): Promise<SharedCouponBook> {
    const [updated] = await getDb().update(sharedCouponBooks)
      .set({ status })
      .where(eq(sharedCouponBooks.id, id))
      .returning();
    return updated;
  }

  // Coupon App Sync Methods
  async getLeadsPaginated(limit: number, offset: number, updatedSince?: Date): Promise<{ data: Lead[]; total: number }> {
    const whereCondition = updatedSince ? gte(leads.createdAt, updatedSince) : undefined;
    
    const data = await (whereCondition 
      ? getDb().select().from(leads).where(whereCondition)
      : getDb().select().from(leads))
      .orderBy(desc(leads.createdAt))
      .limit(limit)
      .offset(offset);
    
    const countQuery = whereCondition
      ? getDb().select({ count: sql<number>`count(*)::int` }).from(leads).where(whereCondition)
      : getDb().select({ count: sql<number>`count(*)::int` }).from(leads);
    
    const [countResult] = await countQuery;
    
    return { data, total: countResult?.count || 0 };
  }

  async getAmbassadorContactsPaginated(
    ambassadorUserId: string, 
    limit: number, 
    offset: number, 
    updatedSince?: Date
  ): Promise<{ data: AmbassadorContact[]; total: number }> {
    const baseCondition = eq(ambassadorContacts.ambassadorUserId, ambassadorUserId);
    const whereCondition = updatedSince 
      ? and(baseCondition, gte(ambassadorContacts.createdAt, updatedSince))
      : baseCondition;
    
    const data = await getDb().select()
      .from(ambassadorContacts)
      .where(whereCondition)
      .orderBy(desc(ambassadorContacts.createdAt))
      .limit(limit)
      .offset(offset);
    
    const [countResult] = await getDb()
      .select({ count: sql<number>`count(*)::int` })
      .from(ambassadorContacts)
      .where(whereCondition);
    
    return { data, total: countResult?.count || 0 };
  }

  // Saved Leads (Lead Finder)
  async createSavedLead(lead: InsertSavedLead): Promise<SavedLead> {
    const [saved] = await getDb().insert(savedLeads).values(lead).returning();
    return saved;
  }

  async getSavedLeadsByAmbassador(ambassadorUserId: string): Promise<SavedLead[]> {
    return getDb().select()
      .from(savedLeads)
      .where(eq(savedLeads.ambassadorUserId, ambassadorUserId))
      .orderBy(desc(savedLeads.createdAt));
  }

  async getSavedLeadById(id: number, ambassadorUserId: string): Promise<SavedLead | null> {
    const [lead] = await getDb().select()
      .from(savedLeads)
      .where(and(
        eq(savedLeads.id, id),
        eq(savedLeads.ambassadorUserId, ambassadorUserId)
      ));
    return lead || null;
  }

  async getSavedLeadByPlaceId(placeId: string, ambassadorUserId: string): Promise<SavedLead | null> {
    const [lead] = await getDb().select()
      .from(savedLeads)
      .where(and(
        eq(savedLeads.placeId, placeId),
        eq(savedLeads.ambassadorUserId, ambassadorUserId)
      ));
    return lead || null;
  }

  async updateSavedLead(id: number, ambassadorUserId: string, updates: Partial<SavedLead>): Promise<SavedLead | null> {
    const [updated] = await getDb().update(savedLeads)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(
        eq(savedLeads.id, id),
        eq(savedLeads.ambassadorUserId, ambassadorUserId)
      ))
      .returning();
    return updated || null;
  }

  async deleteSavedLead(id: number, ambassadorUserId: string): Promise<boolean> {
    const result = await getDb().delete(savedLeads)
      .where(and(
        eq(savedLeads.id, id),
        eq(savedLeads.ambassadorUserId, ambassadorUserId)
      ))
      .returning();
    return result.length > 0;
  }

  // BFT Platform Integration Metrics
  async getAmbassadorCount(): Promise<number> {
    const result = await getDb().select({ count: sql<number>`count(*)::int` })
      .from(ambassadorSubscriptions)
      .where(eq(ambassadorSubscriptions.subscriptionStatus, 'active'));
    return result[0]?.count ?? 0;
  }

  async getCustomerCount(): Promise<number> {
    const result = await getDb().select({ count: sql<number>`count(*)::int` })
      .from(leads);
    return result[0]?.count ?? 0;
  }

  async getMonthlyPurchaseVolume(): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const soldServices = await getDb().select({
      listingId: leadServices.listingId
    })
      .from(leadServices)
      .where(and(
        eq(leadServices.status, 'sold'),
        gte(leadServices.updatedAt, startOfMonth)
      ));
    
    if (soldServices.length === 0) return 0;
    
    const listingIds = soldServices
      .map(s => s.listingId)
      .filter((id): id is number => id !== null);
    
    if (listingIds.length === 0) return 0;
    
    const listings = await getDb().select({ price: providerListings.price })
      .from(providerListings)
      .where(inArray(providerListings.id, listingIds));
    
    let total = 0;
    for (const listing of listings) {
      if (listing.price) {
        const numericPrice = parseFloat(listing.price.replace(/[^0-9.]/g, ''));
        if (!isNaN(numericPrice)) {
          total += numericPrice;
        }
      }
    }
    
    return total;
  }

  // BFT Token Tracking
  async getAmbassadorBftBalance(ambassadorId: number): Promise<string> {
    const [ambassador] = await getDb()
      .select({ bftBalance: ambassadorSubscriptions.bftBalance })
      .from(ambassadorSubscriptions)
      .where(eq(ambassadorSubscriptions.id, ambassadorId));
    return ambassador?.bftBalance ?? "0";
  }

  async getAmbassadorsWithBftBalances(limit: number = 100): Promise<any[]> {
    const ambassadors = await getDb()
      .select({
        id: ambassadorSubscriptions.id,
        userId: ambassadorSubscriptions.userId,
        email: ambassadorSubscriptions.email,
        fullName: ambassadorSubscriptions.fullName,
        bftBalance: ambassadorSubscriptions.bftBalance,
        referralCode: ambassadorSubscriptions.referralCode,
        createdAt: ambassadorSubscriptions.createdAt,
      })
      .from(ambassadorSubscriptions)
      .where(eq(ambassadorSubscriptions.subscriptionStatus, 'active'))
      .limit(limit);

    // Join with points data
    const results = [];
    for (const amb of ambassadors) {
      const [points] = await getDb()
        .select({ totalPoints: ambassadorPoints.totalPoints })
        .from(ambassadorPoints)
        .where(eq(ambassadorPoints.userId, amb.userId));
      
      // Count referrals
      const [referralCount] = await getDb()
        .select({ count: sql<number>`count(*)::int` })
        .from(ambassadorSubscriptions)
        .where(eq(ambassadorSubscriptions.referredByCode, amb.referralCode));
      
      results.push({
        ...amb,
        name: amb.fullName,
        totalPoints: points?.totalPoints || 0,
        referralCount: referralCount?.count || 0,
      });
    }
    
    return results;
  }

  async recordBftTransaction(
    ambassadorId: number, 
    transactionType: string, 
    amount: number, 
    description?: string, 
    referenceId?: string, 
    referenceType?: string, 
    metadata?: Record<string, unknown>
  ): Promise<BftTransaction> {
    // Get current balance
    const currentBalance = parseFloat(await this.getAmbassadorBftBalance(ambassadorId));
    const newBalance = currentBalance + amount;
    
    // Update ambassador's BFT balance
    await getDb()
      .update(ambassadorSubscriptions)
      .set({ 
        bftBalance: newBalance.toFixed(4),
        bftLastUpdated: new Date()
      })
      .where(eq(ambassadorSubscriptions.id, ambassadorId));
    
    // Record the transaction
    const [transaction] = await getDb()
      .insert(bftTransactions)
      .values({
        ambassadorId,
        transactionType,
        amount: amount.toFixed(4),
        balanceAfter: newBalance.toFixed(4),
        referenceId,
        referenceType,
        description,
        metadata: metadata ? JSON.stringify(metadata) : null
      })
      .returning();
    
    return transaction;
  }

  async getBftTransactions(ambassadorId: number, limit: number = 50): Promise<BftTransaction[]> {
    return getDb()
      .select()
      .from(bftTransactions)
      .where(eq(bftTransactions.ambassadorId, ambassadorId))
      .orderBy(desc(bftTransactions.createdAt))
      .limit(limit);
  }

  async getAllRecentBftTransactions(limit: number = 50): Promise<(BftTransaction & { ambassadorName: string })[]> {
    const results = await getDb()
      .select({
        id: bftTransactions.id,
        ambassadorId: bftTransactions.ambassadorId,
        transactionType: bftTransactions.transactionType,
        amount: bftTransactions.amount,
        balanceAfter: bftTransactions.balanceAfter,
        referenceId: bftTransactions.referenceId,
        referenceType: bftTransactions.referenceType,
        description: bftTransactions.description,
        metadata: bftTransactions.metadata,
        createdAt: bftTransactions.createdAt,
        ambassadorName: ambassadorSubscriptions.fullName,
      })
      .from(bftTransactions)
      .leftJoin(ambassadorSubscriptions, eq(bftTransactions.ambassadorId, ambassadorSubscriptions.id))
      .orderBy(desc(bftTransactions.createdAt))
      .limit(limit);

    return results.map(r => ({
      ...r,
      ambassadorName: r.ambassadorName || 'Unknown Ambassador',
    }));
  }

  async hasBftTransaction(ambassadorId: number, transactionType: string, referenceId: string): Promise<boolean> {
    const [result] = await getDb()
      .select({ id: bftTransactions.id })
      .from(bftTransactions)
      .where(and(
        eq(bftTransactions.ambassadorId, ambassadorId),
        eq(bftTransactions.transactionType, transactionType),
        eq(bftTransactions.referenceId, referenceId)
      ))
      .limit(1);
    return !!result;
  }

  // Training Progress
  async completeLesson(userId: string, lessonId: string, moduleId: string): Promise<TrainingProgress> {
    const existing = await this.isLessonCompleted(userId, lessonId);
    if (existing) {
      const [progress] = await getDb()
        .select()
        .from(trainingProgress)
        .where(and(
          eq(trainingProgress.userId, userId),
          eq(trainingProgress.lessonId, lessonId)
        ));
      return progress;
    }
    
    const [progress] = await getDb()
      .insert(trainingProgress)
      .values({ userId, lessonId, moduleId })
      .returning();
    return progress;
  }

  async getCompletedLessons(userId: string): Promise<TrainingProgress[]> {
    return getDb()
      .select()
      .from(trainingProgress)
      .where(eq(trainingProgress.userId, userId))
      .orderBy(desc(trainingProgress.completedAt));
  }

  async isLessonCompleted(userId: string, lessonId: string): Promise<boolean> {
    const [result] = await getDb()
      .select()
      .from(trainingProgress)
      .where(and(
        eq(trainingProgress.userId, userId),
        eq(trainingProgress.lessonId, lessonId)
      ));
    return !!result;
  }

  async getModuleCompletedLessons(userId: string, moduleId: string): Promise<TrainingProgress[]> {
    return getDb()
      .select()
      .from(trainingProgress)
      .where(and(
        eq(trainingProgress.userId, userId),
        eq(trainingProgress.moduleId, moduleId)
      ));
  }
}

export const storage = new DatabaseStorage();
