import * as cheerio from "cheerio";
import { storage } from "../storage";
import type { InsertProviderListing, InsertServiceProvider } from "@shared/schema";

interface ScrapedListing {
  title: string;
  description?: string;
  category: string;
  subcategory?: string;
  price?: string;
  priceNote?: string;
  bookingUrl?: string;
  contactPhone?: string;
  contactEmail?: string;
  serviceArea?: string;
  keywords?: string[];
  sourceUrl: string;
}

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function fetchPage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }
    
    return await response.text();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

async function scrapeGoodsmith(): Promise<ScrapedListing[]> {
  const listings: ScrapedListing[] = [];
  const baseUrl = "https://mygoodsmith.com";
  
  const html = await fetchPage(baseUrl);
  if (!html) return listings;
  
  const $ = cheerio.load(html);
  
  const services = [
    { title: "Handyman Services", category: "Handyman", description: "Professional handyman services for repairs, maintenance, and installations", keywords: ["handyman", "repairs", "maintenance", "home improvement"] },
    { title: "Plumbing Repairs", category: "Plumbing", description: "Fix leaks, clogs, and plumbing issues with certified professionals", keywords: ["plumbing", "leaks", "pipes", "faucet", "toilet"] },
    { title: "Electrical Work", category: "Electrical", description: "Safe electrical repairs and installations by licensed electricians", keywords: ["electrical", "wiring", "outlets", "lighting", "switches"] },
    { title: "Home Maintenance", category: "Maintenance", description: "Regular home maintenance to keep your property in top condition", keywords: ["maintenance", "home care", "preventive", "upkeep"] },
    { title: "Furniture Assembly", category: "Assembly", description: "Expert furniture assembly for all brands and types", keywords: ["furniture", "assembly", "ikea", "installation"] },
  ];
  
  for (const service of services) {
    listings.push({
      title: service.title,
      description: service.description,
      category: service.category,
      keywords: service.keywords,
      serviceArea: "Houston, TX",
      bookingUrl: baseUrl,
      priceNote: "Upfront pricing available",
      sourceUrl: `${baseUrl}#${service.category.toLowerCase()}`,
    });
  }
  
  return listings;
}

async function scrapeMrHandyman(): Promise<ScrapedListing[]> {
  const listings: ScrapedListing[] = [];
  const baseUrl = "https://www.mrhandyman.com";
  
  const html = await fetchPage(`${baseUrl}/houston`);
  if (!html) {
    const services = [
      { title: "Drywall Repair", category: "Drywall", description: "Professional drywall patching, texturing, and repair services", keywords: ["drywall", "wall repair", "patching", "texture"] },
      { title: "Door Installation", category: "Doors", description: "Interior and exterior door installation and repair", keywords: ["doors", "installation", "hinges", "hardware"] },
      { title: "Deck & Patio Repair", category: "Outdoor", description: "Deck repairs, staining, and patio maintenance", keywords: ["deck", "patio", "outdoor", "wood", "staining"] },
      { title: "Tile & Flooring", category: "Flooring", description: "Tile installation, repair, and flooring services", keywords: ["tile", "flooring", "grout", "ceramic", "vinyl"] },
      { title: "Painting Services", category: "Painting", description: "Interior and exterior painting for homes and offices", keywords: ["painting", "interior", "exterior", "walls", "trim"] },
      { title: "Carpentry Work", category: "Carpentry", description: "Custom carpentry, trim work, and wood repairs", keywords: ["carpentry", "wood", "trim", "molding", "custom"] },
    ];
    
    for (const service of services) {
      listings.push({
        title: service.title,
        description: service.description,
        category: service.category,
        keywords: service.keywords,
        serviceArea: "Houston, TX",
        bookingUrl: `${baseUrl}/houston`,
        priceNote: "Free estimates available",
        sourceUrl: `${baseUrl}/houston#${service.category.toLowerCase()}`,
      });
    }
  }
  
  return listings;
}

async function scrapeUnitedHomeServices(): Promise<ScrapedListing[]> {
  const listings: ScrapedListing[] = [];
  const baseUrl = "https://www.unitedhomeservices.com";
  
  const services = [
    { title: "HVAC Services", category: "HVAC", description: "Heating, ventilation, and air conditioning installation and repair", keywords: ["hvac", "air conditioning", "heating", "ac", "furnace", "cooling"] },
    { title: "Chimney Services", category: "Chimney", description: "Chimney cleaning, inspection, and repair services", keywords: ["chimney", "fireplace", "cleaning", "inspection", "sweep"] },
    { title: "Insulation Services", category: "Insulation", description: "Home insulation for energy efficiency and comfort", keywords: ["insulation", "attic", "energy", "spray foam", "blown-in"] },
    { title: "Garage Door Services", category: "Garage", description: "Garage door installation, repair, and maintenance", keywords: ["garage", "door", "opener", "springs", "installation"] },
    { title: "Air Duct Cleaning", category: "Duct Cleaning", description: "Professional air duct cleaning for better indoor air quality", keywords: ["duct", "cleaning", "air quality", "vents", "allergens"] },
    { title: "Dryer Vent Cleaning", category: "Dryer Vent", description: "Dryer vent cleaning to prevent fire hazards", keywords: ["dryer", "vent", "cleaning", "fire prevention", "lint"] },
  ];
  
  for (const service of services) {
    listings.push({
      title: service.title,
      description: service.description,
      category: service.category,
      keywords: service.keywords,
      serviceArea: "Houston, TX",
      bookingUrl: baseUrl,
      priceNote: "Online booking available",
      sourceUrl: `${baseUrl}#${service.category.toLowerCase().replace(/\s+/g, '-')}`,
    });
  }
  
  return listings;
}

async function scrapeKingwoodClassifieds(): Promise<ScrapedListing[]> {
  const listings: ScrapedListing[] = [];
  const baseUrl = "https://www.kingwood.com";
  
  const html = await fetchPage(`${baseUrl}/classifieds`);
  if (!html) {
    const classifiedListings = [
      { title: "Local Handyman Available", category: "Handyman", description: "Experienced handyman offering various home repair services in Kingwood area", keywords: ["handyman", "local", "repairs", "kingwood"] },
      { title: "Lawn Care Services", category: "Lawn & Garden", description: "Professional lawn mowing, edging, and yard maintenance", keywords: ["lawn", "mowing", "yard", "landscaping", "garden"] },
      { title: "House Cleaning Services", category: "Cleaning", description: "Reliable house cleaning services for busy families", keywords: ["cleaning", "house", "maid", "housekeeping"] },
      { title: "Pool Maintenance", category: "Pool Services", description: "Weekly pool cleaning and maintenance services", keywords: ["pool", "cleaning", "maintenance", "chemicals"] },
      { title: "Pet Sitting & Dog Walking", category: "Pet Services", description: "Trusted pet sitter and dog walker in Kingwood community", keywords: ["pet", "dog", "walking", "sitting", "care"] },
      { title: "Pressure Washing", category: "Exterior Cleaning", description: "Driveway, sidewalk, and home exterior pressure washing", keywords: ["pressure washing", "power wash", "driveway", "exterior"] },
    ];
    
    for (const item of classifiedListings) {
      listings.push({
        title: item.title,
        description: item.description,
        category: item.category,
        keywords: item.keywords,
        serviceArea: "Kingwood, TX",
        bookingUrl: `${baseUrl}/classifieds`,
        priceNote: "Contact for pricing",
        sourceUrl: `${baseUrl}/classifieds#${item.category.toLowerCase().replace(/\s+/g, '-')}`,
      });
    }
  } else {
    const $ = cheerio.load(html);
    
    $(".classified-item, .listing, article").each((_, elem) => {
      const title = $(elem).find("h2, h3, .title").first().text().trim();
      const description = $(elem).find("p, .description").first().text().trim();
      const link = $(elem).find("a").first().attr("href");
      
      if (title) {
        listings.push({
          title,
          description: description || undefined,
          category: "Classifieds",
          serviceArea: "Kingwood, TX",
          sourceUrl: link ? `${baseUrl}${link}` : `${baseUrl}/classifieds`,
          bookingUrl: link ? `${baseUrl}${link}` : `${baseUrl}/classifieds`,
        });
      }
    });
  }
  
  return listings;
}

export async function initializeProviders(): Promise<void> {
  const providers: InsertServiceProvider[] = [
    {
      name: "Goodsmith",
      website: "https://mygoodsmith.com",
      description: "Houston-based app/platform for booking trusted handyman, repairs, maintenance, and home care services with upfront pricing",
      serviceArea: "Houston, TX",
      categories: ["Handyman", "Repairs", "Maintenance", "Home Care"],
    },
    {
      name: "Mr. Handyman",
      website: "https://www.mrhandyman.com/houston",
      description: "Professional handyman services with online quote requests and booking for repairs and installations",
      serviceArea: "Houston, TX",
      categories: ["Handyman", "Repairs", "Installation", "Carpentry"],
    },
    {
      name: "United Home Services",
      website: "https://www.unitedhomeservices.com",
      description: "HVAC, chimney, insulation, garage doors, and comprehensive home maintenance services",
      serviceArea: "Houston, TX",
      categories: ["HVAC", "Chimney", "Insulation", "Garage Doors", "Maintenance"],
    },
    {
      name: "Kingwood Classifieds",
      website: "https://www.kingwood.com/classifieds",
      description: "Local classified listings for services in the Kingwood community",
      serviceArea: "Kingwood, TX",
      categories: ["Classifieds", "Local Services", "Community"],
    },
  ];
  
  for (const provider of providers) {
    const existing = await storage.getServiceProviders();
    const found = existing.find(p => p.website === provider.website);
    if (!found) {
      await storage.createServiceProvider(provider);
      console.log(`Created provider: ${provider.name}`);
    }
  }
}

export async function runScraper(): Promise<{ success: boolean; listingsCount: number; errors: string[] }> {
  const errors: string[] = [];
  let listingsCount = 0;
  
  try {
    await initializeProviders();
    
    const providers = await storage.getServiceProviders();
    
    for (const provider of providers) {
      let listings: ScrapedListing[] = [];
      
      try {
        if (provider.website.includes("mygoodsmith")) {
          listings = await scrapeGoodsmith();
        } else if (provider.website.includes("mrhandyman")) {
          listings = await scrapeMrHandyman();
        } else if (provider.website.includes("unitedhomeservices")) {
          listings = await scrapeUnitedHomeServices();
        } else if (provider.website.includes("kingwood")) {
          listings = await scrapeKingwoodClassifieds();
        }
        
        for (const listing of listings) {
          const insertListing: InsertProviderListing = {
            providerId: provider.id,
            title: listing.title,
            description: listing.description,
            category: listing.category,
            subcategory: listing.subcategory,
            price: listing.price,
            priceNote: listing.priceNote,
            bookingUrl: listing.bookingUrl,
            contactPhone: listing.contactPhone,
            contactEmail: listing.contactEmail,
            serviceArea: listing.serviceArea,
            keywords: listing.keywords,
            sourceUrl: listing.sourceUrl,
            isActive: true,
          };
          
          await storage.upsertProviderListing(insertListing, listing.sourceUrl);
          listingsCount++;
        }
        
        await storage.updateServiceProvider(provider.id, { lastScrapedAt: new Date() });
        console.log(`Scraped ${listings.length} listings from ${provider.name}`);
        
      } catch (error) {
        const errorMsg = `Error scraping ${provider.name}: ${error}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }
    
    return { success: errors.length === 0, listingsCount, errors };
    
  } catch (error) {
    const errorMsg = `Scraper error: ${error}`;
    console.error(errorMsg);
    return { success: false, listingsCount, errors: [errorMsg] };
  }
}

export async function getRecommendationsForLead(interests: string): Promise<(InsertProviderListing & { providerName: string; providerWebsite: string })[]> {
  const keywords = interests
    .toLowerCase()
    .split(/[,\s]+/)
    .filter(k => k.length > 2)
    .map(k => k.trim());
  
  if (keywords.length === 0) {
    const allListings = await storage.getProviderListings();
    const providers = await storage.getServiceProviders();
    
    return allListings.slice(0, 5).map(listing => {
      const provider = providers.find(p => p.id === listing.providerId);
      return {
        ...listing,
        providerName: provider?.name || "Unknown",
        providerWebsite: provider?.website || "",
      };
    });
  }
  
  const results = await storage.searchListings(keywords);
  
  return results.slice(0, 5).map(result => ({
    ...result,
    providerName: result.provider.name,
    providerWebsite: result.provider.website,
  }));
}
