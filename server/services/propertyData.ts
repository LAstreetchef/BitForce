import pRetry from "p-retry";
import pLimit from "p-limit";

const nominatimLimiter = pLimit(1);
let lastNominatimCall = 0;
const NOMINATIM_DELAY_MS = 1100;

const geocodeCache = new Map<string, { lat: number; lon: number; display_name: string; timestamp: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export interface WeatherData {
  location: {
    city: string;
    state: string;
    coordinates: { lat: number; lon: number };
  };
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    conditions: string;
    icon: string;
  };
  forecast: Array<{
    date: string;
    high: number;
    low: number;
    conditions: string;
    precipChance: number;
  }>;
  alerts: Array<{
    event: string;
    headline: string;
    severity: string;
    urgency: string;
    description: string;
    instruction: string;
  }>;
  homeMaintenanceTips: string[];
}

export interface CensusData {
  neighborhood: {
    totalPopulation: number;
    medianAge: number;
    medianHouseholdIncome: number;
    homeownershipRate: number;
    medianHomeValue: number;
    medianYearBuilt: number;
    averageHouseholdSize: number;
  };
  housing: {
    totalHousingUnits: number;
    occupiedUnits: number;
    vacantUnits: number;
    ownerOccupied: number;
    renterOccupied: number;
  };
  demographics: {
    educationBachelorsOrHigher: number;
    employmentRate: number;
  };
}

export interface LocationData {
  address: {
    formatted: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  coordinates: {
    lat: number;
    lon: number;
  };
  nearbyAmenities: Array<{
    name: string;
    type: string;
    distance: string;
  }>;
  mapUrl: string;
}

export interface PropertyReport {
  address: string;
  generatedAt: string;
  weather: WeatherData | null;
  census: CensusData | null;
  location: LocationData | null;
  serviceRecommendations: string[];
}

function normalizeAddress(address: string): string {
  return address
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s,.-]/g, '')
    .trim();
}

async function rateLimitedNominatimCall<T>(fn: () => Promise<T>): Promise<T> {
  return nominatimLimiter(async () => {
    const now = Date.now();
    const elapsed = now - lastNominatimCall;
    if (elapsed < NOMINATIM_DELAY_MS) {
      await new Promise(resolve => setTimeout(resolve, NOMINATIM_DELAY_MS - elapsed));
    }
    lastNominatimCall = Date.now();
    return fn();
  });
}

async function geocodeWithNominatim(address: string): Promise<{ lat: number; lon: number; display_name: string } | null> {
  try {
    const normalized = normalizeAddress(address);
    const encoded = encodeURIComponent(normalized);
    
    const response = await rateLimitedNominatimCall(() => 
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&countrycodes=us&addressdetails=1&limit=1`, {
        headers: {
          "User-Agent": "BitForce-Ambassador-Tools/1.0 (contact@bitforce.com)"
        }
      })
    );
    
    if (!response.ok) {
      console.log(`[Geocode] Nominatim returned ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    if (data.length === 0) {
      console.log(`[Geocode] Nominatim returned no results for: ${normalized}`);
      return null;
    }
    
    console.log(`[Geocode] Nominatim found: ${data[0].display_name}`);
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      display_name: data[0].display_name
    };
  } catch (error) {
    console.error("[Geocode] Nominatim error:", error);
    return null;
  }
}

async function geocodeWithCensusBureau(address: string): Promise<{ lat: number; lon: number; display_name: string } | null> {
  try {
    const normalized = normalizeAddress(address);
    const encoded = encodeURIComponent(normalized);
    
    const response = await pRetry(
      () => fetch(`https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=${encoded}&benchmark=Public_AR_Current&format=json`),
      { retries: 2 }
    );
    
    if (!response.ok) {
      console.log(`[Geocode] Census Bureau returned ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    const matches = data.result?.addressMatches || [];
    
    if (matches.length === 0) {
      console.log(`[Geocode] Census Bureau returned no matches for: ${normalized}`);
      return null;
    }
    
    const match = matches[0];
    const coords = match.coordinates;
    const matchedAddress = match.matchedAddress || normalized;
    
    console.log(`[Geocode] Census Bureau found: ${matchedAddress}`);
    return {
      lat: coords.y,
      lon: coords.x,
      display_name: matchedAddress
    };
  } catch (error) {
    console.error("[Geocode] Census Bureau error:", error);
    return null;
  }
}

async function geocodeAddress(address: string): Promise<{ lat: number; lon: number; display_name: string } | null> {
  const cacheKey = normalizeAddress(address).toLowerCase();
  
  const cached = geocodeCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL_MS) {
    console.log(`[Geocode] Cache hit for: ${cacheKey}`);
    return { lat: cached.lat, lon: cached.lon, display_name: cached.display_name };
  }
  
  console.log(`[Geocode] Looking up address: ${address}`);
  
  let result = await geocodeWithNominatim(address);
  
  if (!result) {
    console.log(`[Geocode] Nominatim failed, trying Census Bureau...`);
    result = await geocodeWithCensusBureau(address);
  }
  
  if (result) {
    geocodeCache.set(cacheKey, { ...result, timestamp: Date.now() });
    console.log(`[Geocode] Success: ${result.lat}, ${result.lon}`);
  } else {
    console.log(`[Geocode] All geocoding methods failed for: ${address}`);
  }
  
  return result;
}

async function fetchNOAAWeather(lat: number, lon: number): Promise<Partial<WeatherData> | null> {
  try {
    console.log(`[Weather] Fetching NOAA data for ${lat.toFixed(4)}, ${lon.toFixed(4)}`);
    
    const pointsResponse = await pRetry(
      () => fetch(`https://api.weather.gov/points/${lat.toFixed(4)},${lon.toFixed(4)}`, {
        headers: {
          "User-Agent": "BitForce-Ambassador-Tools/1.0",
          "Accept": "application/geo+json"
        }
      }),
      { retries: 2 }
    );
    
    if (!pointsResponse.ok) {
      console.log(`[Weather] NOAA points endpoint returned ${pointsResponse.status} - falling back to Open-Meteo`);
      return null;
    }
    
    const pointsData = await pointsResponse.json();
    const forecastUrl = pointsData.properties?.forecast;
    const forecastHourlyUrl = pointsData.properties?.forecastHourly;
    const alertsUrl = `https://api.weather.gov/alerts/active?point=${lat.toFixed(4)},${lon.toFixed(4)}`;
    
    const [forecastResponse, alertsResponse] = await Promise.all([
      forecastUrl ? pRetry(() => fetch(forecastUrl, {
        headers: { "User-Agent": "BitForce-Ambassador-Tools/1.0" }
      }), { retries: 2 }) : null,
      pRetry(() => fetch(alertsUrl, {
        headers: { "User-Agent": "BitForce-Ambassador-Tools/1.0" }
      }), { retries: 2 })
    ]);
    
    const forecastData = forecastResponse?.ok ? await forecastResponse.json() : null;
    const alertsData = alertsResponse?.ok ? await alertsResponse.json() : { features: [] };
    
    const periods = forecastData?.properties?.periods || [];
    const currentPeriod = periods[0];
    
    const dailyForecasts: Map<string, { high: number | null; low: number | null; conditions: string; precipChance: number }> = new Map();
    
    for (const period of periods) {
      const date = period.startTime?.split("T")[0] || "";
      if (!date) continue;
      
      const existing = dailyForecasts.get(date) || { high: null, low: null, conditions: "", precipChance: 0 };
      
      if (period.isDaytime) {
        existing.high = period.temperature;
        existing.conditions = period.shortForecast || existing.conditions;
        existing.precipChance = Math.max(existing.precipChance, period.probabilityOfPrecipitation?.value || 0);
      } else {
        existing.low = period.temperature;
        if (!existing.conditions) {
          existing.conditions = period.shortForecast || "";
        }
      }
      
      dailyForecasts.set(date, existing);
    }
    
    const forecast = Array.from(dailyForecasts.entries()).slice(0, 7).map(([date, data]) => ({
      date,
      high: data.high,
      low: data.low,
      conditions: data.conditions,
      precipChance: data.precipChance
    }));

    const alerts = (alertsData.features || []).map((feature: any) => ({
      event: feature.properties?.event || "",
      headline: feature.properties?.headline || "",
      severity: feature.properties?.severity || "",
      urgency: feature.properties?.urgency || "",
      description: feature.properties?.description || "",
      instruction: feature.properties?.instruction || ""
    }));

    const homeMaintenanceTips = generateMaintenanceTips(currentPeriod, alerts);

    return {
      current: currentPeriod ? {
        temperature: currentPeriod.temperature || 0,
        feelsLike: currentPeriod.temperature || 0,
        humidity: 50,
        windSpeed: parseInt(currentPeriod.windSpeed) || 0,
        conditions: currentPeriod.shortForecast || "",
        icon: currentPeriod.icon || ""
      } : undefined,
      forecast,
      alerts,
      homeMaintenanceTips
    };
  } catch (error) {
    console.error("NOAA weather error:", error);
    return null;
  }
}

async function fetchOpenMeteoWeather(lat: number, lon: number): Promise<Partial<WeatherData> | null> {
  try {
    console.log(`[Weather] Fetching Open-Meteo data for ${lat.toFixed(4)}, ${lon.toFixed(4)}`);
    
    const response = await pRetry(
      () => fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`
      ),
      { retries: 3 }
    );
    
    if (!response.ok) {
      console.log(`[Weather] Open-Meteo returned ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    const weatherCodes: Record<number, string> = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail"
    };
    
    const currentConditions = weatherCodes[data.current?.weather_code] || "Unknown";
    
    const forecast = (data.daily?.time || []).slice(0, 7).map((date: string, i: number) => ({
      date,
      high: data.daily?.temperature_2m_max?.[i] || 0,
      low: data.daily?.temperature_2m_min?.[i] || 0,
      conditions: weatherCodes[data.daily?.weather_code?.[i]] || "Unknown",
      precipChance: data.daily?.precipitation_probability_max?.[i] || 0
    }));

    const homeMaintenanceTips = generateMaintenanceTipsFromOpenMeteo(data);

    console.log(`[Weather] Open-Meteo returned ${forecast.length} forecast days, temp: ${data.current?.temperature_2m}°F`);
    
    return {
      current: {
        temperature: data.current?.temperature_2m || 0,
        feelsLike: data.current?.apparent_temperature || 0,
        humidity: data.current?.relative_humidity_2m || 0,
        windSpeed: data.current?.wind_speed_10m || 0,
        conditions: currentConditions,
        icon: ""
      },
      forecast,
      alerts: [],
      homeMaintenanceTips
    };
  } catch (error) {
    console.error("[Weather] Open-Meteo error:", error);
    return null;
  }
}

function generateMaintenanceTips(currentPeriod: any, alerts: any[]): string[] {
  const tips: string[] = [];
  
  if (!currentPeriod) return tips;
  
  const temp = currentPeriod.temperature || 70;
  const conditions = (currentPeriod.shortForecast || "").toLowerCase();
  
  if (temp < 32) {
    tips.push("Freezing temperatures: Check pipe insulation and consider leaving faucets dripping");
    tips.push("Ensure heating system is working properly");
    tips.push("Check for ice dams on roof");
  } else if (temp > 95) {
    tips.push("Extreme heat: Ensure HVAC filters are clean for optimal cooling");
    tips.push("Check attic ventilation to reduce heat buildup");
    tips.push("Consider installing solar screens or window film");
  }
  
  if (conditions.includes("rain") || conditions.includes("storm")) {
    tips.push("Check gutters and downspouts for debris");
    tips.push("Inspect roof for damaged shingles");
    tips.push("Ensure sump pump is operational");
  }
  
  if (conditions.includes("wind") || conditions.includes("windy")) {
    tips.push("Secure outdoor furniture and decorations");
    tips.push("Check for loose siding or shutters");
    tips.push("Trim overhanging tree branches near the house");
  }
  
  for (const alert of alerts) {
    if (alert.event?.toLowerCase().includes("flood")) {
      tips.push("Flood alert: Check basement waterproofing and sump pump");
    }
    if (alert.event?.toLowerCase().includes("tornado") || alert.event?.toLowerCase().includes("severe")) {
      tips.push("Severe weather: Secure loose items and know your safe shelter location");
    }
    if (alert.event?.toLowerCase().includes("heat")) {
      tips.push("Heat advisory: Service AC system and check refrigerant levels");
    }
  }
  
  if (tips.length === 0) {
    tips.push("Good weather for exterior painting or staining");
    tips.push("Ideal conditions for lawn care and landscaping");
    tips.push("Consider seasonal HVAC maintenance");
  }
  
  return tips.slice(0, 5);
}

function generateMaintenanceTipsFromOpenMeteo(data: any): string[] {
  const tips: string[] = [];
  const temp = data.current?.temperature_2m || 70;
  const humidity = data.current?.relative_humidity_2m || 50;
  const weatherCode = data.current?.weather_code || 0;
  
  if (temp < 32) {
    tips.push("Freezing temperatures: Check pipe insulation and heating system");
    tips.push("Prevent ice dams by ensuring proper attic insulation");
  } else if (temp > 95) {
    tips.push("Extreme heat: Service HVAC system and replace air filters");
    tips.push("Check weatherstripping on doors and windows");
  }
  
  if (humidity > 70) {
    tips.push("High humidity: Check for mold in bathrooms and basements");
    tips.push("Consider running a dehumidifier");
  }
  
  if (weatherCode >= 61 && weatherCode <= 82) {
    tips.push("Rainy conditions: Inspect roof and gutters");
    tips.push("Check basement for water intrusion");
  }
  
  if (weatherCode >= 71 && weatherCode <= 86) {
    tips.push("Snow expected: Stock up on ice melt and check snow removal equipment");
  }
  
  if (tips.length === 0) {
    tips.push("Good conditions for outdoor home maintenance projects");
    tips.push("Consider scheduling routine HVAC inspection");
  }
  
  return tips.slice(0, 5);
}

async function fetchCensusData(lat: number, lon: number): Promise<CensusData | null> {
  try {
    console.log(`[Census] Fetching FIPS codes for ${lat.toFixed(4)}, ${lon.toFixed(4)}`);
    
    const fipsResponse = await pRetry(
      () => fetch(`https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${lon}&y=${lat}&benchmark=Public_AR_Current&vintage=Current_Current&layers=10&format=json`),
      { retries: 3 }
    );
    
    if (!fipsResponse.ok) {
      console.log(`[Census] FIPS lookup returned ${fipsResponse.status}`);
      return getDefaultCensusData();
    }
    
    const fipsData = await fipsResponse.json();
    const geographies = fipsData.result?.geographies?.["Census Tracts"]?.[0];
    
    if (!geographies) {
      console.log(`[Census] No census tract found for coordinates`);
      return getDefaultCensusData();
    }
    
    console.log(`[Census] Found tract: State=${geographies.STATE}, County=${geographies.COUNTY}, Tract=${geographies.TRACT}`);
    
    const state = geographies.STATE;
    const county = geographies.COUNTY;
    const tract = geographies.TRACT;
    
    const variables = [
      "B01003_001E", // Total population [0]
      "B01002_001E", // Median age [1]
      "B19013_001E", // Median household income [2]
      "B25077_001E", // Median home value [3]
      "B25035_001E", // Median year built [4]
      "B25002_001E", // Total housing units [5]
      "B25002_002E", // Occupied housing units [6]
      "B25002_003E", // Vacant housing units [7]
      "B25003_002E", // Owner occupied [8]
      "B25003_003E", // Renter occupied [9]
      "B25010_001E", // Average household size [10]
      "B15003_022E", // Bachelor's degree [11]
      "B15003_023E", // Master's degree [12]
      "B15003_024E", // Professional degree [13]
      "B15003_025E", // Doctorate [14]
      "B15003_001E", // Total education population 25+ [15]
      "B23025_002E", // Labor force [16]
      "B23025_005E", // Unemployed [17]
    ].join(",");
    
    const censusResponse = await pRetry(
      () => fetch(`https://api.census.gov/data/2022/acs/acs5?get=${variables}&for=tract:${tract}&in=state:${state}%20county:${county}`),
      { retries: 3 }
    );
    
    if (!censusResponse.ok) {
      console.log(`[PropertyData] Census API returned ${censusResponse.status}`);
      return getDefaultCensusData();
    }
    
    const censusData = await censusResponse.json();
    if (censusData.length < 2) {
      console.log("[PropertyData] Census data empty or invalid");
      return getDefaultCensusData();
    }
    
    const values = censusData[1];
    
    const population = parseInt(values[0]) || 0;
    const totalHousing = parseInt(values[5]) || 1;
    const ownerOccupied = parseInt(values[8]) || 0;
    
    const bachelors = parseInt(values[11]) || 0;
    const masters = parseInt(values[12]) || 0;
    const professional = parseInt(values[13]) || 0;
    const doctorate = parseInt(values[14]) || 0;
    const totalEducationPop = parseInt(values[15]) || 0;
    const educationRate = totalEducationPop > 0 
      ? Math.min(100, Math.max(0, Math.round(((bachelors + masters + professional + doctorate) / totalEducationPop) * 100)))
      : 0;
    
    const laborForce = parseInt(values[16]) || 0;
    const unemployed = parseInt(values[17]) || 0;
    const employmentRate = laborForce > 0
      ? Math.min(100, Math.max(0, Math.round(((laborForce - unemployed) / laborForce) * 100)))
      : 0;
    
    console.log(`[Census] Data retrieved: pop=${population}, income=$${parseInt(values[2]) || 0}, homeValue=$${parseInt(values[3]) || 0}`);
    
    return {
      neighborhood: {
        totalPopulation: population,
        medianAge: parseFloat(values[1]) || 0,
        medianHouseholdIncome: parseInt(values[2]) || 0,
        homeownershipRate: Math.round((ownerOccupied / totalHousing) * 100),
        medianHomeValue: parseInt(values[3]) || 0,
        medianYearBuilt: parseInt(values[4]) || 0,
        averageHouseholdSize: parseFloat(values[10]) || 0,
      },
      housing: {
        totalHousingUnits: totalHousing,
        occupiedUnits: parseInt(values[6]) || 0,
        vacantUnits: parseInt(values[7]) || 0,
        ownerOccupied: ownerOccupied,
        renterOccupied: parseInt(values[9]) || 0,
      },
      demographics: {
        educationBachelorsOrHigher: educationRate,
        employmentRate: employmentRate,
      }
    };
  } catch (error) {
    console.error("Census data error:", error);
    return getDefaultCensusData();
  }
}

function getDefaultCensusData(): CensusData {
  return {
    neighborhood: {
      totalPopulation: 0,
      medianAge: 0,
      medianHouseholdIncome: 0,
      homeownershipRate: 0,
      medianHomeValue: 0,
      medianYearBuilt: 0,
      averageHouseholdSize: 0,
    },
    housing: {
      totalHousingUnits: 0,
      occupiedUnits: 0,
      vacantUnits: 0,
      ownerOccupied: 0,
      renterOccupied: 0,
    },
    demographics: {
      educationBachelorsOrHigher: 0,
      employmentRate: 0,
    }
  };
}

async function fetchLocationData(lat: number, lon: number, displayName: string): Promise<LocationData | null> {
  try {
    const parts = displayName.split(",").map(p => p.trim());
    const street = parts[0] || "";
    const city = parts[1] || parts[0] || "";
    const stateZip = parts[2] || "";
    const state = stateZip.split(" ")[0] || "";
    const zip = stateZip.split(" ")[1] || "";
    const country = parts[parts.length - 1] || "USA";

    const amenities: Array<{ name: string; type: string; distance: string }> = [];
    
    try {
      const overpassQuery = `
        [out:json][timeout:10];
        (
          node["amenity"~"school|hospital|supermarket|bank|pharmacy|restaurant"](around:2000,${lat},${lon});
          node["shop"~"supermarket|convenience|hardware"](around:2000,${lat},${lon});
        );
        out center 10;
      `;
      
      const overpassResponse = await pRetry(
        () => fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `data=${encodeURIComponent(overpassQuery)}`
        }),
        { retries: 2 }
      );
      
      if (overpassResponse.ok) {
        const overpassData = await overpassResponse.json();
        const elements = overpassData.elements || [];
        
        for (const el of elements.slice(0, 10)) {
          const tags = el.tags || {};
          const name = tags.name || tags.amenity || tags.shop || "Local business";
          const type = tags.amenity || tags.shop || "business";
          
          const elLat = el.lat || el.center?.lat;
          const elLon = el.lon || el.center?.lon;
          let distance = "Nearby";
          
          if (elLat && elLon) {
            const d = Math.sqrt(Math.pow(elLat - lat, 2) + Math.pow(elLon - lon, 2)) * 111;
            if (d < 0.5) distance = "< 0.5 mi";
            else if (d < 1) distance = "< 1 mi";
            else if (d < 2) distance = "< 2 mi";
            else distance = "In area";
          }
          
          amenities.push({ name, type, distance });
        }
      }
    } catch (err) {
      console.error("Overpass API error:", err);
    }
    
    if (amenities.length === 0) {
      console.log("[PropertyData] No amenities from Overpass API, using fallback data");
      amenities.push(
        { name: "Local services (placeholder)", type: "general", distance: "Nearby" },
        { name: "Shopping centers (placeholder)", type: "shopping", distance: "Nearby" },
        { name: "Schools (placeholder)", type: "education", distance: "In area" }
      );
    }

    return {
      address: {
        formatted: displayName,
        street,
        city,
        state,
        zip,
        country,
      },
      coordinates: { lat, lon },
      nearbyAmenities: amenities,
      mapUrl: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`
    };
  } catch (error) {
    console.error("Location data error:", error);
    return null;
  }
}

function generateServiceRecommendations(weather: WeatherData | null, census: CensusData | null): string[] {
  const recommendations: string[] = [];
  
  if (weather) {
    const temp = weather.current?.temperature || 70;
    
    if (temp < 40 || temp > 90) {
      recommendations.push("HVAC inspection and maintenance");
    }
    
    if (weather.alerts.length > 0) {
      recommendations.push("Emergency preparedness services");
      recommendations.push("Storm damage prevention assessment");
    }
    
    if (weather.current?.conditions?.toLowerCase().includes("rain")) {
      recommendations.push("Gutter cleaning and repair");
      recommendations.push("Roof inspection");
    }
  }
  
  if (census) {
    if (census.neighborhood.medianYearBuilt && census.neighborhood.medianYearBuilt < 1980) {
      recommendations.push("Home energy audit (older home area)");
      recommendations.push("Electrical system inspection");
      recommendations.push("Plumbing assessment");
    }
    
    if (census.neighborhood.medianHomeValue > 300000) {
      recommendations.push("Smart home automation");
      recommendations.push("Security system installation");
    }
    
    if (census.neighborhood.homeownershipRate > 70) {
      recommendations.push("Lawn care and landscaping services");
      recommendations.push("Home renovation consultation");
    }
  }
  
  if (recommendations.length === 0) {
    recommendations.push("General home maintenance checkup");
    recommendations.push("Energy efficiency assessment");
    recommendations.push("Interior design consultation");
  }
  
  return [...new Set(recommendations)].slice(0, 8);
}

export async function getPropertyReport(address: string): Promise<PropertyReport> {
  console.log(`[PropertyData] Generating report for: ${address}`);
  
  const geocode = await geocodeAddress(address);
  
  if (!geocode) {
    console.log(`[PropertyData] Failed to geocode address: ${address}`);
    return {
      address,
      generatedAt: new Date().toISOString(),
      weather: null,
      census: null,
      location: null,
      serviceRecommendations: ["Unable to locate address. Please verify and try again."]
    };
  }
  
  const { lat, lon, display_name } = geocode;
  console.log(`[PropertyData] Geocoded to: ${lat}, ${lon}`);
  
  const [noaaWeather, openMeteoWeather, censusData, locationData] = await Promise.all([
    fetchNOAAWeather(lat, lon).catch(err => { console.error("[PropertyData] NOAA error:", err); return null; }),
    fetchOpenMeteoWeather(lat, lon).catch(err => { console.error("[PropertyData] Open-Meteo error:", err); return null; }),
    fetchCensusData(lat, lon).catch(err => { console.error("[PropertyData] Census error:", err); return getDefaultCensusData(); }),
    fetchLocationData(lat, lon, display_name).catch(err => { console.error("[PropertyData] Location error:", err); return null; })
  ]);
  
  console.log(`[PropertyData] NOAA data: ${noaaWeather ? 'received' : 'none'}`);
  console.log(`[PropertyData] Open-Meteo data: ${openMeteoWeather ? 'received' : 'none'}`);
  console.log(`[PropertyData] Census data: ${censusData?.neighborhood?.totalPopulation || 0} population`);
  console.log(`[PropertyData] Location data: ${locationData ? 'received' : 'none'}`);
  
  const hasWeatherData = noaaWeather?.current || openMeteoWeather?.current;
  
  let mergedForecast: Array<{ date: string; high: number | null; low: number | null; conditions: string; precipChance: number }> = [];
  
  if (noaaWeather?.forecast?.length && openMeteoWeather?.forecast?.length) {
    const openMeteoByDate = new Map(openMeteoWeather.forecast.map((f: any) => [f.date, f]));
    
    mergedForecast = noaaWeather.forecast.map((noaaDay: any) => {
      const openMeteoDay = openMeteoByDate.get(noaaDay.date);
      return {
        date: noaaDay.date,
        high: noaaDay.high ?? openMeteoDay?.high ?? null,
        low: noaaDay.low ?? openMeteoDay?.low ?? null,
        conditions: noaaDay.conditions || openMeteoDay?.conditions || "Unknown",
        precipChance: noaaDay.precipChance || openMeteoDay?.precipChance || 0
      };
    });
  } else if (noaaWeather?.forecast?.length) {
    mergedForecast = noaaWeather.forecast;
  } else if (openMeteoWeather?.forecast?.length) {
    mergedForecast = openMeteoWeather.forecast;
  }

  const weather: WeatherData | null = hasWeatherData ? {
    location: {
      city: locationData?.address.city || "",
      state: locationData?.address.state || "",
      coordinates: { lat, lon }
    },
    current: {
      temperature: noaaWeather?.current?.temperature ?? openMeteoWeather?.current?.temperature ?? 0,
      feelsLike: noaaWeather?.current?.feelsLike ?? openMeteoWeather?.current?.feelsLike ?? 0,
      humidity: openMeteoWeather?.current?.humidity ?? noaaWeather?.current?.humidity ?? 50,
      windSpeed: noaaWeather?.current?.windSpeed ?? openMeteoWeather?.current?.windSpeed ?? 0,
      conditions: noaaWeather?.current?.conditions || openMeteoWeather?.current?.conditions || "Unknown",
      icon: noaaWeather?.current?.icon || ""
    },
    forecast: mergedForecast,
    alerts: noaaWeather?.alerts || [],
    homeMaintenanceTips: (noaaWeather?.homeMaintenanceTips?.length ? noaaWeather.homeMaintenanceTips : openMeteoWeather?.homeMaintenanceTips) || []
  } : null;
  
  const serviceRecommendations = generateServiceRecommendations(weather, censusData);
  
  console.log(`[PropertyData] Report generated with ${serviceRecommendations.length} recommendations`);
  
  return {
    address: display_name,
    generatedAt: new Date().toISOString(),
    weather,
    census: censusData,
    location: locationData,
    serviceRecommendations
  };
}
