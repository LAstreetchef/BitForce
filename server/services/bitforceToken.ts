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

  const url = `${BFT_TOKEN_API_BASE}/api/sync/wallet-balance`;
  console.log(`[BitForceToken] Fetching purchased BFT for email: ${email}`);
  console.log(`[BitForceToken] Request URL: ${url}?email=${email}`);
  console.log(`[BitForceToken] API Key present: ${apiKey ? 'YES (length: ' + apiKey.length + ')' : 'NO'}`);

  try {
    const response = await axios.get(url, {
      params: { email },
      headers: {
        "x-api-key": apiKey,
      },
      timeout: 10000,
    });

    console.log(`[BitForceToken] Response status: ${response.status}`);
    console.log(`[BitForceToken] Response data:`, JSON.stringify(response.data, null, 2));

    if (response.data && typeof response.data.purchasedBft === "number") {
      const result = {
        email: response.data.email || email,
        purchasedBft: response.data.purchasedBft || 0,
        totalInvested: response.data.totalInvested || 0,
        purchaseCount: response.data.purchaseCount || 0,
        lastPurchaseDate: response.data.lastPurchaseDate || null,
      };
      console.log(`[BitForceToken] Parsed result:`, JSON.stringify(result, null, 2));
      return result;
    }

    console.log(`[BitForceToken] Response missing purchasedBft number, returning zeros`);
    return {
      email,
      purchasedBft: 0,
      totalInvested: 0,
      purchaseCount: 0,
      lastPurchaseDate: null,
    };
  } catch (error: any) {
    console.error(`[BitForceToken] Error occurred:`, error.message);
    console.error(`[BitForceToken] Error status:`, error.response?.status);
    console.error(`[BitForceToken] Error data:`, JSON.stringify(error.response?.data, null, 2));
    
    if (error.response?.status === 404) {
      console.log(`[BitForceToken] 404 response, returning zeros`);
      return {
        email,
        purchasedBft: 0,
        totalInvested: 0,
        purchaseCount: 0,
        lastPurchaseDate: null,
      };
    }
    
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
