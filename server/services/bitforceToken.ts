import axios from "axios";

const BFT_TOKEN_API_BASE = "https://bitforcetoken.replit.app";

export interface PurchasedBftData {
  email: string;
  purchasedBft: number;
  totalInvested: number;
  purchaseCount: number;
  lastPurchaseDate: string | null;
}

export async function fetchPurchasedBftBalance(email: string): Promise<PurchasedBftData | null> {
  const apiKey = process.env.SYNC_API_KEY;
  
  if (!apiKey) {
    console.warn("[BitForceToken] SYNC_API_KEY not configured, cannot fetch purchased BFT");
    return null;
  }

  try {
    const response = await axios.get(`${BFT_TOKEN_API_BASE}/api/sync/wallet-balance`, {
      params: { email },
      headers: {
        "x-api-key": apiKey,
      },
      timeout: 10000,
    });

    if (response.data && typeof response.data.purchasedBft === "number") {
      return {
        email: response.data.email || email,
        purchasedBft: response.data.purchasedBft || 0,
        totalInvested: response.data.totalInvested || 0,
        purchaseCount: response.data.purchaseCount || 0,
        lastPurchaseDate: response.data.lastPurchaseDate || null,
      };
    }

    return {
      email,
      purchasedBft: 0,
      totalInvested: 0,
      purchaseCount: 0,
      lastPurchaseDate: null,
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      return {
        email,
        purchasedBft: 0,
        totalInvested: 0,
        purchaseCount: 0,
        lastPurchaseDate: null,
      };
    }
    
    console.error("[BitForceToken] Error fetching purchased BFT:", error.message);
    return null;
  }
}

export async function fetchBftTokenPrice(): Promise<number> {
  try {
    const response = await axios.get(`${BFT_TOKEN_API_BASE}/api/token-price`, {
      timeout: 5000,
    });
    
    if (response.data && typeof response.data.price === "number") {
      return response.data.price;
    }
    
    return 0.0051;
  } catch (error: any) {
    console.warn("[BitForceToken] Could not fetch token price, using fallback:", error.message);
    return 0.0051;
  }
}
