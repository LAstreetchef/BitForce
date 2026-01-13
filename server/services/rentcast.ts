import axios from "axios";

const BASE_URL = "https://api.rentcast.io/v1";

function getApiKey(): string {
  const key = process.env.RENTCAST_API_KEY;
  if (!key) {
    throw new Error("RENTCAST_API_KEY not configured");
  }
  return key;
}

interface PropertyRecord {
  id: string;
  formattedAddress: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  county: string;
  latitude: number;
  longitude: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  lotSize: number;
  yearBuilt: number;
  lastSaleDate: string;
  lastSalePrice: number;
  ownerOccupied: boolean;
  features: {
    architectureType?: string;
    cooling?: boolean;
    coolingType?: string;
    exteriorType?: string;
    fireplace?: boolean;
    floorCount?: number;
    foundationType?: string;
    garage?: boolean;
    garageSpaces?: number;
    garageType?: string;
    heating?: boolean;
    heatingType?: string;
    pool?: boolean;
    roofType?: string;
    roomCount?: number;
    unitCount?: number;
  };
  taxAssessments: Array<{
    year: number;
    value: number;
    land: number;
    improvements: number;
  }>;
  owner?: {
    names: string[];
    mailingAddress?: {
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
}

interface ValueEstimate {
  price: number;
  priceRangeLow: number;
  priceRangeHigh: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  comparables: Array<{
    formattedAddress: string;
    price: number;
    squareFootage: number;
    bedrooms: number;
    bathrooms: number;
    distance: number;
    daysOld: number;
  }>;
}

interface RentEstimate {
  rent: number;
  rentRangeLow: number;
  rentRangeHigh: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  comparables: Array<{
    formattedAddress: string;
    rent: number;
    squareFootage: number;
    bedrooms: number;
    bathrooms: number;
    distance: number;
    daysOld: number;
  }>;
}

interface PropertyIntelligence {
  property: PropertyRecord | null;
  valueEstimate: ValueEstimate | null;
  rentEstimate: RentEstimate | null;
  error?: string;
}

function createApiClient() {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      "Accept": "application/json",
      "X-Api-Key": getApiKey(),
    },
  });
}

export async function getPropertyRecord(address: string): Promise<PropertyRecord | null> {
  try {
    const client = createApiClient();
    const response = await client.get("/properties", {
      params: { address },
    });
    
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0] as PropertyRecord;
    }
    return null;
  } catch (error: any) {
    console.error("RentCast property lookup error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to lookup property");
  }
}

export async function getValueEstimate(address: string): Promise<ValueEstimate | null> {
  try {
    const client = createApiClient();
    const response = await client.get("/avm/value", {
      params: { 
        address,
        compCount: 5,
      },
    });
    
    return response.data as ValueEstimate;
  } catch (error: any) {
    console.error("RentCast value estimate error:", error.response?.data || error.message);
    return null;
  }
}

export async function getRentEstimate(address: string): Promise<RentEstimate | null> {
  try {
    const client = createApiClient();
    const response = await client.get("/avm/rent/long-term", {
      params: { 
        address,
        compCount: 5,
      },
    });
    
    return response.data as RentEstimate;
  } catch (error: any) {
    console.error("RentCast rent estimate error:", error.response?.data || error.message);
    return null;
  }
}

export async function getPropertyIntelligence(address: string): Promise<PropertyIntelligence> {
  try {
    const [property, valueEstimate, rentEstimate] = await Promise.all([
      getPropertyRecord(address),
      getValueEstimate(address),
      getRentEstimate(address),
    ]);

    return {
      property,
      valueEstimate,
      rentEstimate,
    };
  } catch (error: any) {
    return {
      property: null,
      valueEstimate: null,
      rentEstimate: null,
      error: error.message || "Failed to get property intelligence",
    };
  }
}

export async function searchPropertiesInArea(
  city: string,
  state: string,
  options?: {
    propertyType?: string;
    bedrooms?: number;
    limit?: number;
  }
): Promise<PropertyRecord[]> {
  try {
    const client = createApiClient();
    const response = await client.get("/properties", {
      params: {
        city,
        state,
        propertyType: options?.propertyType,
        bedrooms: options?.bedrooms,
        limit: options?.limit || 25,
      },
    });
    
    if (response.data && Array.isArray(response.data)) {
      return response.data as PropertyRecord[];
    }
    return [];
  } catch (error: any) {
    console.error("RentCast area search error:", error.response?.data || error.message);
    return [];
  }
}
