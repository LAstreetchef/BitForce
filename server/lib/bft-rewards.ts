import { bftApiClient, ActivityRecord } from './bft-api-client';
import { storage } from '../storage';

export interface BftRewardResult {
  success: boolean;
  bftAwarded: number;
  pointsEquivalent: number;
  localPointsUpdated: boolean;
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

  // Always update local points first as a fallback/cache
  let localPointsUpdated = false;
  try {
    await storage.updateAmbassadorPoints(userId, pointsEquivalent);
    localPointsUpdated = true;
  } catch (err: any) {
    console.error(`[BFT Rewards] Failed to update local points:`, err.message);
  }

  // If BFT platform not available, just use local points
  if (!bftApiClient.isAvailable()) {
    console.log(`[BFT Rewards] Platform not configured, using local points for ${activityType}`);
    return {
      success: false,
      bftAwarded: 0,
      pointsEquivalent,
      localPointsUpdated,
      error: 'BFT platform not configured',
    };
  }

  try {
    // Get the ambassador's numeric ID for the BFT platform
    const ambassador = await storage.getAmbassadorByUserId(userId);
    if (!ambassador) {
      console.log(`[BFT Rewards] No ambassador found for userId ${userId}, using local points only`);
      return {
        success: false,
        bftAwarded: 0,
        pointsEquivalent,
        localPointsUpdated,
        error: 'Ambassador not found',
      };
    }

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

    console.log(`[BFT Rewards] Awarded ${bftAmount} BFT (${pointsEquivalent} pts) to ambassador ${ambassador.id} for ${activityType}`);

    return {
      success: result.success,
      bftAwarded: bftAmount,
      pointsEquivalent: result.pointsAwarded,
      localPointsUpdated,
    };
  } catch (err: any) {
    console.error(`[BFT Rewards] Failed to record activity on BFT platform:`, err.message);
    return {
      success: false,
      bftAwarded: 0,
      pointsEquivalent,
      localPointsUpdated,
      error: err.message,
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
