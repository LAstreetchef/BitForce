import axios, { AxiosInstance, AxiosError } from 'axios';

const BFT_PLATFORM_URL = process.env.BFT_PLATFORM_URL;
const SYNC_API_KEY = process.env.SYNC_API_KEY;

export interface TokenMetrics {
  tokenPrice: number;
  totalSupply: number;
  circulatingSupply: number;
  marketCap: number;
  priceChange24h: number;
  lastUpdated: string;
}

export interface AmbassadorSyncData {
  ambassadorId: string;
  userId: string;
  email: string;
  displayName: string;
  totalPoints: number;
  tier: string;
  referralCode: string;
  isActive: boolean;
}

export interface AmbassadorSyncResponse {
  success: boolean;
  ambassadorId: string;
  bftBalance: number;
  syncedAt: string;
}

export interface ConvertPointsRequest {
  ambassadorId: string;
  pointsToConvert: number;
  walletAddress?: string;
}

export interface ConvertPointsResponse {
  success: boolean;
  pointsConverted: number;
  bftTokensReceived: number;
  conversionRate: number;
  transactionId: string;
  newPointsBalance: number;
  newBftBalance: number;
}

export interface ActivityRecord {
  ambassadorId: string;
  activityType: string;
  description: string;
  pointsEarned: number;
  metadata?: Record<string, unknown>;
}

export interface ActivityResponse {
  success: boolean;
  activityId: string;
  pointsAwarded: number;
  totalPoints: number;
  recordedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  ambassadorId: string;
  displayName: string;
  totalPoints: number;
  bftBalance: number;
  tier: string;
  activitiesCompleted: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  totalAmbassadors: number;
  lastUpdated: string;
}

class BFTApiClient {
  private client: AxiosInstance;
  private isConfigured: boolean;

  constructor() {
    this.isConfigured = !!(BFT_PLATFORM_URL && SYNC_API_KEY);
    
    this.client = axios.create({
      baseURL: BFT_PLATFORM_URL || '',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': SYNC_API_KEY || '',
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const message = error.response?.data 
          ? JSON.stringify(error.response.data)
          : error.message;
        console.error(`[BFT API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}: ${message}`);
        throw error;
      }
    );
  }

  private ensureConfigured(): void {
    if (!this.isConfigured) {
      throw new Error('BFT API client is not configured. Please set BFT_PLATFORM_URL and SYNC_API_KEY environment variables.');
    }
  }

  async getTokenMetrics(): Promise<TokenMetrics> {
    this.ensureConfigured();
    const response = await this.client.get<TokenMetrics>('/api/sync/token-metrics');
    return response.data;
  }

  async syncAmbassador(data: AmbassadorSyncData): Promise<AmbassadorSyncResponse> {
    this.ensureConfigured();
    const response = await this.client.post<AmbassadorSyncResponse>('/api/sync/ambassador', data);
    return response.data;
  }

  async convertPoints(data: ConvertPointsRequest): Promise<ConvertPointsResponse> {
    this.ensureConfigured();
    const response = await this.client.post<ConvertPointsResponse>('/api/sync/convert-points', data);
    return response.data;
  }

  async recordActivity(data: ActivityRecord): Promise<ActivityResponse> {
    this.ensureConfigured();
    const response = await this.client.post<ActivityResponse>('/api/sync/activity', data);
    return response.data;
  }

  async getLeaderboard(limit?: number): Promise<LeaderboardResponse> {
    this.ensureConfigured();
    const params = limit ? { limit } : {};
    const response = await this.client.get<LeaderboardResponse>('/api/sync/leaderboard', { params });
    return response.data;
  }

  isAvailable(): boolean {
    return this.isConfigured;
  }
}

export const bftApiClient = new BFTApiClient();
