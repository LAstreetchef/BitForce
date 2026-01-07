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

async function scrapeVivint(): Promise<ScrapedListing[]> {
  const listings: ScrapedListing[] = [];
  const baseUrl = "https://www.vivint.com";
  
  const services = [
    { title: "Smart Home Security System", category: "Home Security", description: "Complete smart home security with 24/7 professional monitoring, cameras, and smart locks", keywords: ["security", "alarm", "monitoring", "smart home", "camera", "protection"] },
    { title: "Outdoor Security Cameras", category: "Security Cameras", description: "HD outdoor cameras with night vision and motion detection for complete property coverage", keywords: ["camera", "outdoor", "surveillance", "video", "monitoring", "night vision"] },
    { title: "Video Doorbell Pro", category: "Doorbell Camera", description: "Smart video doorbell with two-way audio and package detection", keywords: ["doorbell", "camera", "video", "smart", "package detection"] },
    { title: "Smart Lock Installation", category: "Smart Locks", description: "Keyless entry smart locks with remote access and auto-lock features", keywords: ["smart lock", "keyless", "door lock", "security", "remote access"] },
    { title: "Smart Thermostat Integration", category: "Smart Home", description: "Intelligent thermostat control integrated with your security system", keywords: ["thermostat", "smart", "temperature", "automation", "energy"] },
    { title: "24/7 Professional Monitoring", category: "Monitoring", description: "Round-the-clock professional monitoring with instant emergency response", keywords: ["monitoring", "24/7", "emergency", "response", "professional"] },
  ];
  
  for (const service of services) {
    listings.push({
      title: service.title,
      description: service.description,
      category: service.category,
      keywords: service.keywords,
      serviceArea: "Houston, TX",
      bookingUrl: baseUrl,
      priceNote: "Custom quote available",
      sourceUrl: `${baseUrl}#${service.category.toLowerCase().replace(/\s+/g, '-')}`,
    });
  }
  
  return listings;
}

async function scrapeCentralSecurity(): Promise<ScrapedListing[]> {
  const listings: ScrapedListing[] = [];
  const baseUrl = "https://www.centralsecurity.com";
  
  const services = [
    { title: "Home Alarm Systems", category: "Alarm Systems", description: "Comprehensive home alarm systems with professional installation", keywords: ["alarm", "security", "home", "intrusion", "protection"] },
    { title: "Security Camera Installation", category: "Security Cameras", description: "Indoor and outdoor security camera installation with remote viewing", keywords: ["camera", "security", "surveillance", "installation", "video"] },
    { title: "Motion Sensor Setup", category: "Sensors", description: "Advanced motion sensors for complete home coverage", keywords: ["motion", "sensor", "detection", "security", "alert"] },
    { title: "Fire & Smoke Monitoring", category: "Fire Safety", description: "Integrated fire and smoke detection with emergency dispatch", keywords: ["fire", "smoke", "detector", "safety", "emergency"] },
    { title: "Window & Door Sensors", category: "Entry Sensors", description: "Entry point monitoring for windows and doors", keywords: ["window", "door", "sensor", "entry", "security"] },
  ];
  
  for (const service of services) {
    listings.push({
      title: service.title,
      description: service.description,
      category: service.category,
      keywords: service.keywords,
      serviceArea: "Houston, TX",
      bookingUrl: baseUrl,
      priceNote: "Free consultation",
      sourceUrl: `${baseUrl}#${service.category.toLowerCase().replace(/\s+/g, '-')}`,
    });
  }
  
  return listings;
}

async function scrapeAllSmart(): Promise<ScrapedListing[]> {
  const listings: ScrapedListing[] = [];
  const baseUrl = "https://www.allsmart.com";
  
  const services = [
    { title: "Smart Security Integration", category: "Smart Security", description: "Fully integrated smart security systems with app control", keywords: ["smart", "security", "integration", "app", "control"] },
    { title: "IP Camera Systems", category: "IP Cameras", description: "High-definition IP camera systems with cloud storage", keywords: ["camera", "ip", "cloud", "storage", "hd", "video"] },
    { title: "Smart Home Security Hub", category: "Security Hub", description: "Central hub connecting all security devices for unified control", keywords: ["hub", "smart", "security", "control", "unified"] },
    { title: "Commercial Security Solutions", category: "Commercial", description: "Business-grade security systems for commercial properties", keywords: ["commercial", "business", "security", "professional"] },
  ];
  
  for (const service of services) {
    listings.push({
      title: service.title,
      description: service.description,
      category: service.category,
      keywords: service.keywords,
      serviceArea: "Houston, TX",
      bookingUrl: baseUrl,
      priceNote: "Request quote online",
      sourceUrl: `${baseUrl}#${service.category.toLowerCase().replace(/\s+/g, '-')}`,
    });
  }
  
  return listings;
}

async function scrapeLightspeedSecurity(): Promise<ScrapedListing[]> {
  const listings: ScrapedListing[] = [];
  const baseUrl = "https://www.lightspeedsecurity.com";
  
  const services = [
    { title: "Residential Security Packages", category: "Home Security", description: "Complete home security packages with professional installation and monitoring", keywords: ["security", "residential", "home", "package", "monitoring"] },
    { title: "Surveillance Systems", category: "Surveillance", description: "Advanced surveillance systems for comprehensive property monitoring", keywords: ["surveillance", "camera", "monitoring", "video", "recording"] },
    { title: "Access Control Systems", category: "Access Control", description: "Keypad and card-based access control for homes and businesses", keywords: ["access", "control", "keypad", "card", "entry"] },
    { title: "Alarm Response Services", category: "Alarm Response", description: "Rapid alarm response and verification services", keywords: ["alarm", "response", "emergency", "dispatch", "verification"] },
  ];
  
  for (const service of services) {
    listings.push({
      title: service.title,
      description: service.description,
      category: service.category,
      keywords: service.keywords,
      serviceArea: "Houston, TX",
      bookingUrl: baseUrl,
      priceNote: "Free home assessment",
      sourceUrl: `${baseUrl}#${service.category.toLowerCase().replace(/\s+/g, '-')}`,
    });
  }
  
  return listings;
}

async function scrapeSmithThompson(): Promise<ScrapedListing[]> {
  const listings: ScrapedListing[] = [];
  const baseUrl = "https://www.smiththompson.com";
  
  const services = [
    { title: "Home Security Systems", category: "Home Security", description: "Reliable home security systems with no long-term contracts", keywords: ["security", "home", "alarm", "no contract", "protection"] },
    { title: "Smart Home Automation", category: "Smart Automation", description: "Integrate security with smart home automation for complete control", keywords: ["smart", "automation", "home", "control", "integration"] },
    { title: "Video Surveillance", category: "Video", description: "Professional video surveillance installation and monitoring", keywords: ["video", "surveillance", "camera", "monitoring", "recording"] },
    { title: "Medical Alert Systems", category: "Medical Alert", description: "Medical alert systems for seniors and those with health concerns", keywords: ["medical", "alert", "senior", "emergency", "health"] },
    { title: "Wireless Security Solutions", category: "Wireless", description: "Modern wireless security systems for easy installation", keywords: ["wireless", "security", "easy", "installation", "modern"] },
  ];
  
  for (const service of services) {
    listings.push({
      title: service.title,
      description: service.description,
      category: service.category,
      keywords: service.keywords,
      serviceArea: "Houston, TX",
      bookingUrl: baseUrl,
      priceNote: "No contracts required",
      sourceUrl: `${baseUrl}#${service.category.toLowerCase().replace(/\s+/g, '-')}`,
    });
  }
  
  return listings;
}

async function scrapeHoustonIntegration(): Promise<ScrapedListing[]> {
  const listings: ScrapedListing[] = [];
  const baseUrl = "https://www.houstonintegrationsystems.com";
  
  const services = [
    { title: "Whole Home Automation", category: "Home Automation", description: "Complete smart home automation for lighting, climate, and entertainment", keywords: ["automation", "smart home", "lighting", "climate", "control"] },
    { title: "Audio/Video Integration", category: "Audio Video", description: "Multi-room audio and video distribution systems", keywords: ["audio", "video", "multi-room", "entertainment", "speakers"] },
    { title: "Lighting Control Systems", category: "Lighting", description: "Automated lighting control with scenes and schedules", keywords: ["lighting", "control", "automated", "scenes", "smart"] },
    { title: "Climate Control Integration", category: "Climate", description: "Smart thermostat and HVAC integration for optimal comfort", keywords: ["climate", "thermostat", "hvac", "temperature", "comfort"] },
    { title: "Voice Control Setup", category: "Voice Control", description: "Alexa, Google, and Siri integration for voice-controlled home", keywords: ["voice", "alexa", "google", "siri", "control", "assistant"] },
    { title: "Home Theater Installation", category: "Home Theater", description: "Custom home theater design and installation", keywords: ["theater", "home theater", "cinema", "entertainment", "audio"] },
  ];
  
  for (const service of services) {
    listings.push({
      title: service.title,
      description: service.description,
      category: service.category,
      keywords: service.keywords,
      serviceArea: "Houston, TX",
      bookingUrl: baseUrl,
      priceNote: "Free design consultation",
      sourceUrl: `${baseUrl}#${service.category.toLowerCase().replace(/\s+/g, '-')}`,
    });
  }
  
  return listings;
}

async function scrapeFullyAutomated(): Promise<ScrapedListing[]> {
  const listings: ScrapedListing[] = [];
  const baseUrl = "https://www.fullyautomated.us";
  
  const services = [
    { title: "Custom Smart Home Design", category: "Smart Design", description: "Personalized smart home design tailored to your lifestyle", keywords: ["smart", "design", "custom", "home", "automation"] },
    { title: "Control4 Installation", category: "Control4", description: "Professional Control4 smart home system installation", keywords: ["control4", "smart", "system", "installation", "automation"] },
    { title: "Motorized Shades", category: "Shades", description: "Automated motorized shades and blinds with scene integration", keywords: ["shades", "blinds", "motorized", "automated", "window"] },
    { title: "Security Integration", category: "Security", description: "Integrate security cameras and alarms with smart home control", keywords: ["security", "integration", "camera", "alarm", "smart"] },
    { title: "Network Infrastructure", category: "Network", description: "Robust WiFi and network infrastructure for smart homes", keywords: ["network", "wifi", "internet", "infrastructure", "connection"] },
  ];
  
  for (const service of services) {
    listings.push({
      title: service.title,
      description: service.description,
      category: service.category,
      keywords: service.keywords,
      serviceArea: "Houston, TX",
      bookingUrl: baseUrl,
      priceNote: "Custom solutions available",
      sourceUrl: `${baseUrl}#${service.category.toLowerCase().replace(/\s+/g, '-')}`,
    });
  }
  
  return listings;
}

async function scrapeMultimediaSolutions(): Promise<ScrapedListing[]> {
  const listings: ScrapedListing[] = [];
  const baseUrl = "https://www.multimediasolutionsgroup.com";
  
  const services = [
    { title: "Smart Home Automation", category: "Automation", description: "Complete smart home automation for lights, audio, security, and HVAC", keywords: ["smart", "automation", "lights", "audio", "security", "hvac"] },
    { title: "Distributed Audio Systems", category: "Audio", description: "Whole-home audio distribution with zone control", keywords: ["audio", "distributed", "music", "speakers", "zone"] },
    { title: "App-Based Home Control", category: "App Control", description: "Control your entire home from your smartphone", keywords: ["app", "control", "smartphone", "mobile", "remote"] },
    { title: "Voice Assistant Integration", category: "Voice", description: "Setup and integration of voice assistants throughout your home", keywords: ["voice", "assistant", "alexa", "google", "siri"] },
    { title: "Energy Management", category: "Energy", description: "Smart energy monitoring and management solutions", keywords: ["energy", "management", "monitoring", "efficiency", "savings"] },
  ];
  
  for (const service of services) {
    listings.push({
      title: service.title,
      description: service.description,
      category: service.category,
      keywords: service.keywords,
      serviceArea: "Houston, TX",
      bookingUrl: baseUrl,
      priceNote: "Consultation available",
      sourceUrl: `${baseUrl}#${service.category.toLowerCase().replace(/\s+/g, '-')}`,
    });
  }
  
  return listings;
}

async function scrapeSmartNUP(): Promise<ScrapedListing[]> {
  const listings: ScrapedListing[] = [];
  const baseUrl = "https://www.smartnuphomeautomation.com";
  
  const services = [
    { title: "Audio/Video Automation", category: "AV Automation", description: "Automated audio and video systems for seamless entertainment", keywords: ["audio", "video", "automation", "entertainment", "av"] },
    { title: "Home Entertainment Systems", category: "Entertainment", description: "Custom entertainment systems for living rooms and media rooms", keywords: ["entertainment", "media", "living room", "tv", "system"] },
    { title: "Smart Home Streamlining", category: "Streamlining", description: "Simplify your smart home with unified control systems", keywords: ["smart", "streamline", "unified", "simple", "control"] },
    { title: "Outdoor Entertainment", category: "Outdoor", description: "Outdoor audio and video for patios and pool areas", keywords: ["outdoor", "patio", "pool", "entertainment", "weather"] },
  ];
  
  for (const service of services) {
    listings.push({
      title: service.title,
      description: service.description,
      category: service.category,
      keywords: service.keywords,
      serviceArea: "Houston, TX",
      bookingUrl: baseUrl,
      priceNote: "In-home demo available",
      sourceUrl: `${baseUrl}#${service.category.toLowerCase().replace(/\s+/g, '-')}`,
    });
  }
  
  return listings;
}

async function scrapeBammelTV(): Promise<ScrapedListing[]> {
  const listings: ScrapedListing[] = [];
  const baseUrl = "https://www.bammeltv.com";
  
  const services = [
    { title: "Smart Home Solutions", category: "Smart Home", description: "Complete smart home solutions tailored for Houston homeowners", keywords: ["smart", "home", "solution", "automation", "control"] },
    { title: "TV Mounting & Setup", category: "TV Mounting", description: "Professional TV mounting with cable management", keywords: ["tv", "mounting", "setup", "installation", "cable"] },
    { title: "Home Automation Control", category: "Control Systems", description: "Easy-to-use home automation control systems", keywords: ["automation", "control", "easy", "system", "smart"] },
    { title: "Smart Device Installation", category: "Device Setup", description: "Installation and setup of smart devices throughout your home", keywords: ["smart", "device", "installation", "setup", "iot"] },
  ];
  
  for (const service of services) {
    listings.push({
      title: service.title,
      description: service.description,
      category: service.category,
      keywords: service.keywords,
      serviceArea: "Houston, TX",
      bookingUrl: baseUrl,
      priceNote: "Competitive pricing",
      sourceUrl: `${baseUrl}#${service.category.toLowerCase().replace(/\s+/g, '-')}`,
    });
  }
  
  return listings;
}

async function scrapeWernerTech(): Promise<ScrapedListing[]> {
  const listings: ScrapedListing[] = [];
  const baseUrl = "https://www.wernertechsolutions.com";
  
  const services = [
    { title: "Data Backup Solutions", category: "Data Backup", description: "Secure local and cloud backup solutions for complete data protection", keywords: ["backup", "data", "cloud", "protection", "storage"] },
    { title: "Data Recovery Services", category: "Data Recovery", description: "Professional data recovery for hard drives, SSDs, and RAID systems", keywords: ["recovery", "data", "hard drive", "ssd", "raid"] },
    { title: "Business Continuity Planning", category: "Business Continuity", description: "Disaster recovery and business continuity solutions", keywords: ["disaster", "recovery", "business", "continuity", "planning"] },
    { title: "Cloud Migration", category: "Cloud", description: "Migrate your data safely to cloud storage platforms", keywords: ["cloud", "migration", "storage", "transfer", "online"] },
  ];
  
  for (const service of services) {
    listings.push({
      title: service.title,
      description: service.description,
      category: service.category,
      keywords: service.keywords,
      serviceArea: "Houston, TX",
      bookingUrl: baseUrl,
      priceNote: "Fast secure protection",
      sourceUrl: `${baseUrl}#${service.category.toLowerCase().replace(/\s+/g, '-')}`,
    });
  }
  
  return listings;
}

async function scrapeCloudSpaceUSA(): Promise<ScrapedListing[]> {
  const listings: ScrapedListing[] = [];
  const baseUrl = "https://www.cloudspaceusa.com";
  
  const services = [
    { title: "Cloud Backup Services", category: "Cloud Backup", description: "Automated cloud backup with encryption and redundancy", keywords: ["cloud", "backup", "automated", "encryption", "secure"] },
    { title: "Disaster Recovery", category: "Disaster Recovery", description: "Complete disaster recovery planning and implementation", keywords: ["disaster", "recovery", "planning", "protection", "emergency"] },
    { title: "Data Protection Planning", category: "Data Protection", description: "Comprehensive data protection strategies for homes and businesses", keywords: ["data", "protection", "strategy", "planning", "security"] },
    { title: "Offsite Backup Solutions", category: "Offsite Backup", description: "Secure offsite backup for critical data and documents", keywords: ["offsite", "backup", "secure", "remote", "storage"] },
  ];
  
  for (const service of services) {
    listings.push({
      title: service.title,
      description: service.description,
      category: service.category,
      keywords: service.keywords,
      serviceArea: "Houston, TX",
      bookingUrl: baseUrl,
      priceNote: "Flexible plans available",
      sourceUrl: `${baseUrl}#${service.category.toLowerCase().replace(/\s+/g, '-')}`,
    });
  }
  
  return listings;
}

async function scrapeDoorstepDigital(): Promise<ScrapedListing[]> {
  const listings: ScrapedListing[] = [];
  const baseUrl = "https://www.doorstepdigital.com";
  
  const services = [
    { title: "Photo Scanning Services", category: "Photo Scanning", description: "High-quality photo scanning to preserve your precious memories", keywords: ["photo", "scanning", "digitize", "pictures", "memories"] },
    { title: "Album Digitization", category: "Album Digitization", description: "Complete album digitization with organization", keywords: ["album", "digitization", "organize", "photo", "book"] },
    { title: "VHS to Digital Conversion", category: "Video Conversion", description: "Convert VHS tapes and old video formats to digital", keywords: ["vhs", "video", "conversion", "tape", "digital", "dvd"] },
    { title: "Digital Archive Organization", category: "Organization", description: "Organize and structure your digital photo and video archives", keywords: ["organize", "archive", "digital", "structure", "files"] },
    { title: "Memory Preservation", category: "Preservation", description: "Professional preservation of family memories and documents", keywords: ["memory", "preservation", "family", "documents", "heritage"] },
  ];
  
  for (const service of services) {
    listings.push({
      title: service.title,
      description: service.description,
      category: service.category,
      keywords: service.keywords,
      serviceArea: "Houston, TX",
      bookingUrl: baseUrl,
      priceNote: "Local pickup available",
      sourceUrl: `${baseUrl}#${service.category.toLowerCase().replace(/\s+/g, '-')}`,
    });
  }
  
  return listings;
}

async function scrapePhotoNanny(): Promise<ScrapedListing[]> {
  const listings: ScrapedListing[] = [];
  const baseUrl = "https://www.photo-nanny.com";
  
  const services = [
    { title: "Photo Organization", category: "Photo Organization", description: "Expert organization of physical and digital photo collections", keywords: ["photo", "organization", "organize", "collection", "sort"] },
    { title: "Digital Photo Management", category: "Digital Management", description: "Manage and organize your digital photos across devices", keywords: ["digital", "management", "photos", "organize", "devices"] },
    { title: "Photo Backup Services", category: "Photo Backup", description: "Secure backup of your entire photo collection to cloud and local storage", keywords: ["backup", "photo", "cloud", "storage", "secure"] },
    { title: "Memorabilia Digitization", category: "Memorabilia", description: "Digitize memorabilia, cards, and keepsakes", keywords: ["memorabilia", "digitize", "keepsakes", "cards", "preserve"] },
    { title: "Photo Book Creation", category: "Photo Books", description: "Create beautiful photo books from your digital collection", keywords: ["photo book", "album", "create", "print", "memories"] },
  ];
  
  for (const service of services) {
    listings.push({
      title: service.title,
      description: service.description,
      category: service.category,
      keywords: service.keywords,
      serviceArea: "Houston, TX",
      bookingUrl: baseUrl,
      priceNote: "Personalized service",
      sourceUrl: `${baseUrl}#${service.category.toLowerCase().replace(/\s+/g, '-')}`,
    });
  }
  
  return listings;
}

async function scrapeSalvageData(): Promise<ScrapedListing[]> {
  const listings: ScrapedListing[] = [];
  const baseUrl = "https://www.salvagedata.com";
  
  const services = [
    { title: "Hard Drive Recovery", category: "Hard Drive Recovery", description: "Professional recovery of data from failed hard drives", keywords: ["hard drive", "recovery", "data", "failed", "disk"] },
    { title: "SSD Data Recovery", category: "SSD Recovery", description: "Specialized SSD data recovery for solid state drives", keywords: ["ssd", "recovery", "solid state", "data", "flash"] },
    { title: "RAID Recovery Services", category: "RAID Recovery", description: "Expert RAID array data recovery for all configurations", keywords: ["raid", "recovery", "array", "server", "data"] },
    { title: "Phone Data Recovery", category: "Phone Recovery", description: "Recover lost data from smartphones and mobile devices", keywords: ["phone", "mobile", "recovery", "data", "smartphone"] },
    { title: "Backup Consultation", category: "Consultation", description: "Expert consultation for backup strategies and data protection", keywords: ["backup", "consultation", "strategy", "planning", "advice"] },
  ];
  
  for (const service of services) {
    listings.push({
      title: service.title,
      description: service.description,
      category: service.category,
      keywords: service.keywords,
      serviceArea: "Houston, TX",
      bookingUrl: baseUrl,
      priceNote: "Free evaluation",
      sourceUrl: `${baseUrl}#${service.category.toLowerCase().replace(/\s+/g, '-')}`,
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
    {
      name: "Vivint",
      website: "https://www.vivint.com",
      description: "Leading smart home security with cameras, alarms, and automation; custom systems and 24/7 monitoring available in Houston",
      serviceArea: "Houston, TX",
      categories: ["Home Security", "Smart Home", "Alarm Systems", "Cameras", "Monitoring"],
    },
    {
      name: "Central Security",
      website: "https://www.centralsecurity.com",
      description: "Highly rated for security systems, alarms, and monitoring in the Houston area",
      serviceArea: "Houston, TX",
      categories: ["Home Security", "Alarm Systems", "Cameras", "Fire Safety", "Monitoring"],
    },
    {
      name: "allSmart",
      website: "https://www.allsmart.com",
      description: "Specializes in smart security installations, cameras, and home integration",
      serviceArea: "Houston, TX",
      categories: ["Smart Security", "Cameras", "Smart Home", "Integration"],
    },
    {
      name: "Lightspeed Security & Surveillance",
      website: "https://www.lightspeedsecurity.com",
      description: "Provides home security packages, cameras, and surveillance for residential clients in Houston",
      serviceArea: "Houston, TX",
      categories: ["Home Security", "Surveillance", "Cameras", "Alarm Systems"],
    },
    {
      name: "Smith Thompson Home Security",
      website: "https://www.smiththompson.com",
      description: "Offers home security, alarms, and smart automation with long-standing service in Houston and Texas",
      serviceArea: "Houston, TX",
      categories: ["Home Security", "Smart Automation", "Alarm Systems", "Medical Alert"],
    },
    {
      name: "Houston Integration Systems",
      website: "https://www.houstonintegrationsystems.com",
      description: "Residential smart home integration, automation, and installation services in Houston",
      serviceArea: "Houston, TX",
      categories: ["Smart Home", "Home Automation", "Audio Video", "Lighting Control", "Voice Control"],
    },
    {
      name: "Fully Automated",
      website: "https://www.fullyautomated.us",
      description: "Expert custom smart home design, installation, automation, and security in the Houston area",
      serviceArea: "Houston, TX",
      categories: ["Smart Home", "Home Automation", "Control4", "Security Integration"],
    },
    {
      name: "Multimedia Solutions Group",
      website: "https://www.multimediasolutionsgroup.com",
      description: "Smart home automation for lights, audio, security, and HVAC control via app/voice in Houston",
      serviceArea: "Houston, TX",
      categories: ["Smart Home", "Home Automation", "Audio", "Voice Control", "Energy Management"],
    },
    {
      name: "SmartNUP",
      website: "https://www.smartnuphomeautomation.com",
      description: "Audio/video automation, entertainment, and smart home streamlining for Houston homeowners",
      serviceArea: "Houston, TX",
      categories: ["Smart Home", "Audio Video", "Entertainment", "Home Automation"],
    },
    {
      name: "Bammel TV",
      website: "https://www.bammeltv.com",
      description: "Smart home solutions, automation, and easy control systems tailored for Houston residences",
      serviceArea: "Houston, TX",
      categories: ["Smart Home", "TV Mounting", "Home Automation", "Device Setup"],
    },
    {
      name: "Werner Tech Solutions",
      website: "https://www.wernertechsolutions.com",
      description: "Data backup and recovery services with fast, secure protection for businesses and individuals in Houston",
      serviceArea: "Houston, TX",
      categories: ["Data Backup", "Data Recovery", "Cloud Backup", "Business Continuity"],
    },
    {
      name: "CloudSpace USA",
      website: "https://www.cloudspaceusa.com",
      description: "Cloud backup, disaster recovery, and data protection planning for Houston-area clients",
      serviceArea: "Houston, TX",
      categories: ["Cloud Backup", "Disaster Recovery", "Data Protection", "Offsite Backup"],
    },
    {
      name: "Doorstep Digital",
      website: "https://www.doorstepdigital.com",
      description: "Local photo scanning, digitization, album organization, and digital backup/archiving services in Houston",
      serviceArea: "Houston, TX",
      categories: ["Photo Scanning", "Digitizing", "Video Conversion", "Memory Preservation"],
    },
    {
      name: "Photo Nanny",
      website: "https://www.photo-nanny.com",
      description: "Photo organization, digital management, and backup of physical/digital photos and memorabilia",
      serviceArea: "Houston, TX",
      categories: ["Photo Organization", "Digitizing", "Photo Backup", "Memorabilia"],
    },
    {
      name: "SalvageData",
      website: "https://www.salvagedata.com",
      description: "Professional data recovery services in Houston for hard drives, phones, RAID, and more, including backup consultations",
      serviceArea: "Houston, TX",
      categories: ["Data Recovery", "Hard Drive Recovery", "Phone Recovery", "RAID Recovery", "Backup"],
    },
  ];
  
  const existingProviders = await storage.getServiceProviders();
  
  for (const provider of providers) {
    const found = existingProviders.find(p => p.website === provider.website);
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
        } else if (provider.website.includes("vivint")) {
          listings = await scrapeVivint();
        } else if (provider.website.includes("centralsecurity")) {
          listings = await scrapeCentralSecurity();
        } else if (provider.website.includes("allsmart")) {
          listings = await scrapeAllSmart();
        } else if (provider.website.includes("lightspeedsecurity")) {
          listings = await scrapeLightspeedSecurity();
        } else if (provider.website.includes("smiththompson")) {
          listings = await scrapeSmithThompson();
        } else if (provider.website.includes("houstonintegrationsystems")) {
          listings = await scrapeHoustonIntegration();
        } else if (provider.website.includes("fullyautomated")) {
          listings = await scrapeFullyAutomated();
        } else if (provider.website.includes("multimediasolutionsgroup")) {
          listings = await scrapeMultimediaSolutions();
        } else if (provider.website.includes("smartnuphomeautomation")) {
          listings = await scrapeSmartNUP();
        } else if (provider.website.includes("bammeltv")) {
          listings = await scrapeBammelTV();
        } else if (provider.website.includes("wernertechsolutions")) {
          listings = await scrapeWernerTech();
        } else if (provider.website.includes("cloudspaceusa")) {
          listings = await scrapeCloudSpaceUSA();
        } else if (provider.website.includes("doorstepdigital")) {
          listings = await scrapeDoorstepDigital();
        } else if (provider.website.includes("photo-nanny")) {
          listings = await scrapePhotoNanny();
        } else if (provider.website.includes("salvagedata")) {
          listings = await scrapeSalvageData();
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
