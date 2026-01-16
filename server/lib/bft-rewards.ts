import { bftApiClient, ActivityRecord } from './bft-api-client';
import { storage } from '../storage';

export interface BftRewardResult {
  success: boolean;
  bftAwarded: number;
  pointsEquivalent: number;
  localPointsUpdated: boolean;
  transactionRecorded: boolean;
  error?: string;
}

const POINTS_TO_BFT_RATE = 10;

export async function awardBftTokens(
  userId: string,
  activityType: string,
  pointsEquivalent: number,
  description: string,
  metadata?: Record<string, unknown>
): Promise<BftRewardResult> {
  const bftAmount = pointsEquivalent / POINTS_TO_BFT_RATE;

  // Get the ambassador for transaction recording
  const ambassador = await storage.getAmbassadorByUserId(userId);
  
  if (!ambassador) {
    console.log(`[BFT Rewards] No ambassador found for userId ${userId}`);
    return {
      success: false,
      bftAwarded: 0,
      pointsEquivalent,
      localPointsUpdated: false,
      transactionRecorded: false,
      error: 'Ambassador not found',
    };
  }

  // Build unique idempotency key for this specific action
  // For training: userId + lessonId or moduleId
  const refId = metadata && typeof metadata === 'object' 
    ? (metadata['lessonId'] as string | undefined) || (metadata['moduleId'] as string | undefined)
    : undefined;
  const idempotencyKey = `${userId}_${refId || Date.now()}`;
  
  const refType = activityType === 'COMPLETE_LESSON' ? 'lesson' 
    : activityType === 'COMPLETE_MODULE' ? 'module' 
    : 'activity';

  // IDEMPOTENCY CHECK: Skip if transaction already exists
  try {
    const alreadyRecorded = await storage.hasBftTransaction(
      ambassador.id,
      activityType,
      idempotencyKey
    );
    
    if (alreadyRecorded) {
      console.log(`[BFT Rewards] Transaction already recorded for ${activityType} with key ${idempotencyKey} - skipping (idempotent)`);
      return {
        success: true,
        bftAwarded: bftAmount,
        pointsEquivalent,
        localPointsUpdated: false, // Points were updated on the original call
        transactionRecorded: true,
        error: undefined,
      };
    }
  } catch (err: any) {
    console.error(`[BFT Rewards] Failed to check idempotency:`, err.message);
    // Continue - better to risk duplicate than fail silently
  }

  // Update local points
  let localPointsUpdated = false;
  let transactionRecorded = false;
  
  try {
    await storage.updateAmbassadorPoints(userId, pointsEquivalent);
    localPointsUpdated = true;
  } catch (err: any) {
    console.error(`[BFT Rewards] Failed to update local points:`, err.message);
  }

  // Record transaction in bftTransactions ledger for durability
  try {
    await storage.recordBftTransaction(
      ambassador.id,
      activityType,
      bftAmount,
      description,
      idempotencyKey,  // Use idempotency key as referenceId
      refType,
      metadata
    );
    transactionRecorded = true;
    console.log(`[BFT Rewards] Recorded ${bftAmount} BFT transaction for ambassador ${ambassador.id} (${activityType}, key: ${idempotencyKey})`);
  } catch (err: any) {
    console.error(`[BFT Rewards] Failed to record BFT transaction:`, err.message);
  }

  // If BFT platform not available, use local ledger only
  if (!bftApiClient.isAvailable()) {
    console.log(`[BFT Rewards] Platform not configured, using local ledger for ${activityType}`);
    return {
      success: transactionRecorded,
      bftAwarded: transactionRecorded ? bftAmount : 0,
      pointsEquivalent,
      localPointsUpdated,
      transactionRecorded,
      error: transactionRecorded ? undefined : 'BFT platform not configured',
    };
  }

  // CRITICAL: Ledger recording is required for success
  if (!transactionRecorded) {
    console.error(`[BFT Rewards] Ledger write failed for ${activityType} - cannot proceed with external sync`);
    return {
      success: false,
      bftAwarded: 0,
      pointsEquivalent,
      localPointsUpdated,
      transactionRecorded: false,
      error: 'Failed to record transaction in ledger',
    };
  }

  try {
    const activity: ActivityRecord = {
      ambassadorId: ambassador.id.toString(),
      activityType,
      description,
      pointsEarned: pointsEquivalent,
      metadata: {
        ...metadata,
        userId,
        bftEquivalent: bftAmount,
        conversionRate: POINTS_TO_BFT_RATE,
      },
    };

    const result = await bftApiClient.recordActivity(activity);

    console.log(`[BFT Rewards] Synced ${bftAmount} BFT (${pointsEquivalent} pts) to BFT platform for ambassador ${ambassador.id} (${activityType})`);

    return {
      success: true,
      bftAwarded: bftAmount,
      pointsEquivalent: result.pointsAwarded,
      localPointsUpdated,
      transactionRecorded: true,
    };
  } catch (err: any) {
    console.error(`[BFT Rewards] Failed to sync to BFT platform:`, err.message);
    // Transaction is recorded locally - still success since ledger has the data
    // Token Portal can fetch from /api/activities?source=ledger
    return {
      success: true,
      bftAwarded: bftAmount,
      pointsEquivalent,
      localPointsUpdated,
      transactionRecorded: true,
      error: `Platform sync pending: ${err.message}`,
    };
  }
}

export function pointsToBft(points: number): number {
  return points / POINTS_TO_BFT_RATE;
}

export function bftToPoints(bft: number): number {
  return bft * POINTS_TO_BFT_RATE;
}

export const CONVERSION_RATE = POINTS_TO_BFT_RATE;
