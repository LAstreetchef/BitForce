import axios from "axios";

function getGooglePlacesApiKey(): string {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    throw new Error("Google Places API key is not configured. Please add GOOGLE_PLACES_API_KEY in secrets.");
  }
  return apiKey;
}

export interface PlaceResult {
  placeId: string;
  businessName: string;
  address: string;
  phone?: string;
  website?: string;
  latitude: number;
  longitude: number;
  businessType: string;
  rating?: number;
  reviewCount?: number;
  priceLevel?: number;
  types: string[];
  openNow?: boolean;
}

export interface GeocodedLocation {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

export interface SearchResult {
  places: PlaceResult[];
  center: GeocodedLocation;
  searchRadius: number;
}

const BUSINESS_TYPE_KEYWORDS = {
  tech: ["technology", "software", "computer", "it_services", "electronics_store"],
  consulting: ["consultant", "accounting", "lawyer", "financial", "insurance"],
  retail: ["store", "shop", "retail", "clothing", "jewelry", "furniture"],
  service: ["repair", "cleaning", "plumber", "electrician", "contractor", "salon", "spa"],
  food: ["restaurant", "cafe", "bakery", "bar", "food"],
  health: ["doctor", "dentist", "pharmacy", "gym", "health", "medical"],
  education: ["school", "university", "tutor", "training"],
  realestate: ["real_estate", "property", "realtor"],
};

function categorizeBusinessType(types: string[]): string {
  const typeString = types.join(" ").toLowerCase();
  
  for (const [category, keywords] of Object.entries(BUSINESS_TYPE_KEYWORDS)) {
    if (keywords.some(kw => typeString.includes(kw))) {
      return category;
    }
  }
  return "other";
}

export function calculateLeadScore(place: PlaceResult): number {
  let score = 30; // Base score
  
  // Business type scoring
  const highValueTypes = ["tech", "consulting", "service", "realestate"];
  const mediumValueTypes = ["retail", "health", "education"];
  
  if (highValueTypes.includes(place.businessType)) {
    score += 25;
  } else if (mediumValueTypes.includes(place.businessType)) {
    score += 15;
  } else {
    score += 5;
  }
  
  // Online presence scoring
  if (place.website) score += 15;
  if (place.phone) score += 5;
  
  // Rating and reviews scoring
  if (place.rating && place.rating >= 4.0) score += 10;
  if (place.reviewCount && place.reviewCount > 50) score += 10;
  if (place.reviewCount && place.reviewCount > 100) score += 5;
  
  // Price level (higher = potentially more established business)
  if (place.priceLevel && place.priceLevel >= 2) score += 5;
  
  // Active business
  if (place.openNow) score += 5;
  
  return Math.min(100, Math.max(0, score));
}

export async function geocodeAddress(address: string): Promise<GeocodedLocation | null> {
  const apiKey = getGooglePlacesApiKey();

  try {
    const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address: address,
        key: apiKey,
      },
    });

    if (response.data.status === "OK" && response.data.results.length > 0) {
      const result = response.data.results[0];
      return {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
      };
    }

    console.error("Geocoding failed:", response.data.status);
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    throw error;
  }
}

export async function searchNearbyPlaces(
  latitude: number,
  longitude: number,
  radiusMiles: number,
  businessTypes?: string[]
): Promise<PlaceResult[]> {
  const apiKey = getGooglePlacesApiKey();

  const radiusMeters = radiusMiles * 1609.34; // Convert miles to meters
  const allPlaces: PlaceResult[] = [];

  // Default to searching for businesses if no types specified
  const searchTypes = businessTypes && businessTypes.length > 0 
    ? businessTypes 
    : ["establishment"];

  try {
    for (const type of searchTypes) {
      const response = await axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
        params: {
          location: `${latitude},${longitude}`,
          radius: Math.min(radiusMeters, 50000), // Max 50km
          type: type,
          key: apiKey,
        },
      });

      if (response.data.status === "OK") {
        for (const place of response.data.results) {
          // Get place details for phone and website
          const details = await getPlaceDetails(place.place_id);
          
          const placeResult: PlaceResult = {
            placeId: place.place_id,
            businessName: place.name,
            address: place.vicinity || place.formatted_address || "",
            phone: details?.phone,
            website: details?.website,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            businessType: categorizeBusinessType(place.types || []),
            rating: place.rating,
            reviewCount: place.user_ratings_total,
            priceLevel: place.price_level,
            types: place.types || [],
            openNow: place.opening_hours?.open_now,
          };
          
          // Avoid duplicates
          if (!allPlaces.some(p => p.placeId === placeResult.placeId)) {
            allPlaces.push(placeResult);
          }
        }
      }
      
      // Rate limiting - wait 200ms between requests
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    return allPlaces;
  } catch (error) {
    console.error("Places search error:", error);
    throw error;
  }
}

async function getPlaceDetails(placeId: string): Promise<{ phone?: string; website?: string } | null> {
  try {
    const apiKey = getGooglePlacesApiKey();
    const response = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
      params: {
        place_id: placeId,
        fields: "formatted_phone_number,website",
        key: apiKey,
      },
    });

    if (response.data.status === "OK") {
      return {
        phone: response.data.result.formatted_phone_number,
        website: response.data.result.website,
      };
    }
    return null;
  } catch (error) {
    console.error("Place details error:", error);
    return null;
  }
}

export async function searchLeads(
  location: string,
  radiusMiles: number,
  businessTypes?: string[]
): Promise<SearchResult> {
  // Geocode the location
  const geocoded = await geocodeAddress(location);
  if (!geocoded) {
    throw new Error("Could not find location. Please try a different address or ZIP code.");
  }

  // Search for nearby places
  const places = await searchNearbyPlaces(
    geocoded.latitude,
    geocoded.longitude,
    radiusMiles,
    businessTypes
  );

  // Calculate scores and sort by score
  const scoredPlaces = places.map(place => ({
    ...place,
    score: calculateLeadScore(place),
  }));

  scoredPlaces.sort((a, b) => b.score - a.score);

  return {
    places: scoredPlaces,
    center: geocoded,
    searchRadius: radiusMiles,
  };
}

export async function searchRealEstateBrokers(
  location: string,
  radiusMiles: number = 10
): Promise<SearchResult> {
  const geocoded = await geocodeAddress(location);
  if (!geocoded) {
    throw new Error("Could not find location. Please try a different address or ZIP code.");
  }

  const apiKey = getGooglePlacesApiKey();
  const radiusMeters = radiusMiles * 1609.34;
  const allPlaces: PlaceResult[] = [];

  const brokerSearchTypes = ["real_estate_agency"];
  const textSearchQueries = [
    "real estate broker",
    "real estate agent",
    "realtor",
    "real estate office",
  ];

  try {
    for (const type of brokerSearchTypes) {
      const response = await axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
        params: {
          location: `${geocoded.latitude},${geocoded.longitude}`,
          radius: Math.min(radiusMeters, 50000),
          type: type,
          key: apiKey,
        },
      });

      if (response.data.status === "OK") {
        for (const place of response.data.results) {
          const details = await getPlaceDetails(place.place_id);
          
          const placeResult: PlaceResult = {
            placeId: place.place_id,
            businessName: place.name,
            address: place.vicinity || place.formatted_address || "",
            phone: details?.phone,
            website: details?.website,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            businessType: "realestate",
            rating: place.rating,
            reviewCount: place.user_ratings_total,
            priceLevel: place.price_level,
            types: place.types || [],
            openNow: place.opening_hours?.open_now,
          };
          
          if (!allPlaces.some(p => p.placeId === placeResult.placeId)) {
            allPlaces.push(placeResult);
          }
        }
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    for (const query of textSearchQueries) {
      const response = await axios.get("https://maps.googleapis.com/maps/api/place/textsearch/json", {
        params: {
          query: query,
          location: `${geocoded.latitude},${geocoded.longitude}`,
          radius: Math.min(radiusMeters, 50000),
          key: apiKey,
        },
      });

      if (response.data.status === "OK") {
        for (const place of response.data.results.slice(0, 10)) {
          if (allPlaces.some(p => p.placeId === place.place_id)) continue;
          
          const details = await getPlaceDetails(place.place_id);
          
          const placeResult: PlaceResult = {
            placeId: place.place_id,
            businessName: place.name,
            address: place.formatted_address || place.vicinity || "",
            phone: details?.phone,
            website: details?.website,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            businessType: "realestate",
            rating: place.rating,
            reviewCount: place.user_ratings_total,
            priceLevel: place.price_level,
            types: place.types || [],
            openNow: place.opening_hours?.open_now,
          };
          
          allPlaces.push(placeResult);
        }
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    const scoredPlaces = allPlaces.map(place => ({
      ...place,
      score: calculateBrokerScore(place),
    }));

    scoredPlaces.sort((a, b) => b.score - a.score);

    return {
      places: scoredPlaces,
      center: geocoded,
      searchRadius: radiusMiles,
    };
  } catch (error) {
    console.error("Broker search error:", error);
    throw error;
  }
}

function calculateBrokerScore(place: PlaceResult): number {
  let score = 30;
  
  if (place.rating) {
    if (place.rating >= 4.5) score += 30;
    else if (place.rating >= 4.0) score += 20;
    else if (place.rating >= 3.5) score += 10;
  }
  
  if (place.reviewCount) {
    if (place.reviewCount >= 100) score += 25;
    else if (place.reviewCount >= 50) score += 20;
    else if (place.reviewCount >= 20) score += 15;
    else if (place.reviewCount >= 10) score += 10;
  }
  
  if (place.website) score += 10;
  if (place.phone) score += 5;
  
  return Math.min(100, Math.max(0, score));
}

export function exportToCsv(leads: any[]): string {
  const headers = [
    "Business Name",
    "Address",
    "Phone",
    "Website",
    "Type",
    "Rating",
    "Reviews",
    "Score",
    "Status",
    "Notes",
  ];

  const rows = leads.map(lead => [
    lead.businessName || "",
    lead.address || "",
    lead.phone || "",
    lead.website || "",
    lead.businessType || "",
    lead.rating || "",
    lead.reviewCount || "",
    lead.score || "",
    lead.status || "",
    (lead.notes || "").replace(/"/g, '""'),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
  ].join("\n");

  return csvContent;
}
