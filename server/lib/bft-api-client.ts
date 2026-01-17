import axios, { AxiosInstance, AxiosError } from 'axios';

// Read env vars dynamically via getters to pick up changes after module load
const getBftPlatformUrl = () => process.env.BFT_PLATFORM_URL;
const getSyncApiKey = () => process.env.SYNC_API_KEY;

// Response from BFT Platform's /api/sync/token-metrics endpoint
export interface TokenMetrics {
  currentPrice: number;
  basePrice: number;
  priceChange: string;
  totalSupply: number;
  circulatingSupply: number;
  marketCap: number;
}

// Frontend-facing token price response (transformed from TokenMetrics)
export interface TokenPriceResponse {
  tokenPrice: number;
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

// Wallet status interfaces (from Token Platform)
export interface WalletInfo {
  address: string;
  status: string;
  verified: boolean;
  linkedAt?: string;
  verifiedAt?: string;
}

export interface WalletStatus {
  devnet: WalletInfo | null;
  mainnet: WalletInfo | null;
}

export interface AmbassadorWithWallet {
  id: string;
  externalId: string;
  name: string;
  tokensEarned: number;
  usdValue: number;
  currentPrice: number;
  walletStatus: WalletStatus;
  hasVerifiedWallet: boolean;
}

export interface WalletStatusResponse {
  ambassadorId: string;
  externalId: string;
  name: string;
  wallets: WalletStatus;
  hasVerifiedWallet: boolean;
  hasPendingWallet: boolean;
  eligibleForDistribution: boolean;
  tokensEarned: number;
}

export interface EligibleAmbassador {
  ambassadorId: string;
  externalId: string;
  name: string;
  tokensEarned: number;
  usdValue: number;
  wallet: {
    address: string;
    verified: boolean;
    verifiedAt: string;
  } | null;
  eligible: boolean;
  ineligibleReason: string | null;
}

export interface DistributionEligibilityResponse {
  network: string;
  summary: {
    totalAmbassadors: number;
    eligibleCount: number;
    ineligibleCount: number;
    totalTokensToDistribute: number;
    totalUsdValue: number;
  };
  eligible: EligibleAmbassador[];
  ineligible: EligibleAmbassador[];
}

class BFTApiClient {
  private cachedClient: AxiosInstance | null = null;
  private cachedBaseUrl: string = '';
  private cachedApiKey: string = '';

  private getClient(): AxiosInstance {
    const baseURL = getBftPlatformUrl() || '';
    const apiKey = getSyncApiKey() || '';
    
    // Rebuild client only if env vars changed
    if (this.cachedClient && this.cachedBaseUrl === baseURL && this.cachedApiKey === apiKey) {
      return this.cachedClient;
    }
    
    this.cachedBaseUrl = baseURL;
    this.cachedApiKey = apiKey;
    
    const client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
    });

    client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const message = error.response?.data 
          ? JSON.stringify(error.response.data)
          : error.message;
        console.error(`[BFT API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}: ${message}`);
        throw error;
      }
    );
    
    this.cachedClient = client;
    return client;
  }

  private ensureConfigured(): void {
    if (!this.isAvailable()) {
      throw new Error('BFT API client is not configured. Please set BFT_PLATFORM_URL and SYNC_API_KEY environment variables.');
    }
  }

  async getTokenMetrics(): Promise<TokenMetrics> {
    this.ensureConfigured();
    const client = this.getClient();
    const response = await client.get<TokenMetrics>('/api/sync/token-metrics');
    return response.data;
  }

  async syncAmbassador(data: AmbassadorSyncData): Promise<AmbassadorSyncResponse> {
    this.ensureConfigured();
    const client = this.getClient();
    const response = await client.post<AmbassadorSyncResponse>('/api/sync/ambassador', data);
    return response.data;
  }

  async convertPoints(data: ConvertPointsRequest): Promise<ConvertPointsResponse> {
    this.ensureConfigured();
    const client = this.getClient();
    const response = await client.post<ConvertPointsResponse>('/api/sync/convert-points', data);
    return response.data;
  }

  async recordActivity(data: ActivityRecord): Promise<ActivityResponse> {
    this.ensureConfigured();
    const client = this.getClient();
    const response = await client.post<ActivityResponse>('/api/sync/activity', data);
    return response.data;
  }

  async getLeaderboard(limit?: number): Promise<LeaderboardResponse> {
    this.ensureConfigured();
    const client = this.getClient();
    const params = limit ? { limit } : {};
    const response = await client.get<LeaderboardResponse>('/api/sync/leaderboard', { params });
    return response.data;
  }

  async getAmbassadorWalletStatus(externalId: string): Promise<WalletStatusResponse> {
    this.ensureConfigured();
    const client = this.getClient();
    const response = await client.get<WalletStatusResponse>(`/api/sync/ambassador/${externalId}/wallet-status`);
    return response.data;
  }

  async getAmbassadorWithWallet(externalId: string): Promise<AmbassadorWithWallet> {
    this.ensureConfigured();
    const client = this.getClient();
    const response = await client.get<AmbassadorWithWallet>(`/api/sync/ambassador/${externalId}`);
    return response.data;
  }

  async getDistributionEligibility(network: 'devnet' | 'mainnet' = 'mainnet'): Promise<DistributionEligibilityResponse> {
    this.ensureConfigured();
    const client = this.getClient();
    const response = await client.get<DistributionEligibilityResponse>('/api/sync/distribution-eligibility', {
      params: { network }
    });
    return response.data;
  }

  isAvailable(): boolean {
    return !!(getBftPlatformUrl() && getSyncApiKey());
  }
}

export const bftApiClient = new BFTApiClient();
