import { storage } from "../storage";

const defaultProducts = [
  {
    slug: "monthly-subscription",
    name: "Monthly AI Buddy Subscription",
    tagline: "Your go-to tech support, always there",
    price: "$29",
    priceDetail: "per month",
    priceAmount: "29.00",
    description: "Unlimited quick check-ins (via email or phone) plus one 30-minute session each month for any ongoing tech questions.",
    valueProposition: "Affordable ongoing support so you never feel stuck - perfect for seniors or busy families who want a reliable \"go-to\" person as technology evolves.",
    backstory: "Think of your AI Buddy as that patient, tech-savvy family member who never gets frustrated when you ask the same question twice.",
    bestFor: ["Seniors", "Busy Families", "Tech Beginners"],
    useCases: ["Get help when apps update unexpectedly", "Learn to video call grandchildren", "Navigate smartphone settings"],
    features: ["Unlimited email/phone check-ins", "One 30-minute session each month", "Ongoing support as tech evolves", "Cancel anytime"],
    badge: "Most Popular",
    badgeType: "popular",
    commissionAmount: "8.00",
    commissionType: "recurring",
    commissionInfo: "Earn $8/month recurring commission",
    category: "subscription",
    isActive: true,
    isFeatured: false,
    sortOrder: 1,
  },
  {
    slug: "one-time-session",
    name: "One-Time AI Buddy Session",
    tagline: "Quick wins, lasting confidence",
    price: "$79",
    priceDetail: "60 minutes",
    priceAmount: "79.00",
    description: "Get hands-on help with one specific tech need - like backing up family photos, setting up a simple home security camera, or navigating a smartphone/app.",
    valueProposition: "Your buddy explains everything patiently in plain language and leaves you with a custom, easy-to-follow AI-generated guide.",
    backstory: "Perfect for when you have a specific tech challenge that's been nagging at you.",
    bestFor: ["First-Timers", "Specific Problems", "Gift Givers"],
    useCases: ["Back up and organize family photos", "Set up home security cameras", "Transfer data to a new phone"],
    features: ["60 minutes of dedicated one-on-one support", "Plain language explanations", "Custom AI-generated guide included", "Patient, friendly approach"],
    commissionAmount: "20.00",
    commissionType: "one_time",
    commissionInfo: "Earn $20 commission per session sold",
    category: "session",
    isActive: true,
    isFeatured: false,
    sortOrder: 2,
  },
  {
    slug: "bundle-package",
    name: "AI Buddy Bundle Package",
    tagline: "Steady progress, lasting peace of mind",
    price: "$199",
    priceDetail: "3 sessions",
    priceAmount: "199.00",
    description: "Tackle multiple everyday tech challenges over time with the same trusted buddy.",
    valueProposition: "Save money compared to individual sessions, get ongoing support, and receive a personalized digital folder with all your custom guides.",
    backstory: "For those who want to become truly comfortable with technology.",
    bestFor: ["Complete Beginners", "Multiple Challenges", "Ongoing Learners"],
    useCases: ["Master your smartphone", "Set up a complete digital photo system", "Create a secure home network"],
    features: ["3 full 60-minute sessions", "Same trusted buddy throughout", "Save $38 vs. individual sessions", "Personalized digital folder"],
    badge: "Best Value",
    badgeType: "bestValue",
    commissionAmount: "50.00",
    commissionType: "one_time",
    commissionInfo: "Earn $50 commission per bundle sold",
    category: "bundle",
    isActive: true,
    isFeatured: false,
    sortOrder: 3,
  },
  {
    slug: "bitforce-saver",
    name: "BitForce Saver",
    tagline: "Smart savings powered by AI",
    price: "$9.99",
    priceDetail: "per month",
    priceAmount: "9.99",
    description: "Our AI-powered coupon and savings finder automatically discovers deals, discounts, and cashback opportunities for everyday purchases.",
    valueProposition: "Save money effortlessly with AI that works 24/7 to find the best deals on groceries, gas, dining, and more.",
    backstory: "BitForce Saver was born from a simple idea: what if AI could do the coupon clipping for you?",
    bestFor: ["Budget Conscious", "Busy Families", "Smart Shoppers"],
    useCases: ["Find grocery coupons automatically", "Get gas station discounts", "Discover restaurant deals"],
    features: ["AI-powered deal discovery", "Automatic coupon application", "Cashback tracking", "Weekly savings reports"],
    badge: "New",
    badgeType: "new",
    commissionAmount: "3.00",
    commissionType: "recurring",
    commissionInfo: "Earn $3/month recurring commission",
    category: "subscription",
    isActive: true,
    isFeatured: true,
    sortOrder: 0,
  },
];

const defaultSettings = [
  { key: "monthly_subscription_fee", value: "19.99", label: "Monthly Subscription Fee", description: "Ambassador monthly subscription cost", category: "subscription", valueType: "number" },
  { key: "activation_fee", value: "29.00", label: "Activation Fee", description: "One-time ambassador signup fee", category: "subscription", valueType: "number" },
  { key: "referral_bonus_amount", value: "50.00", label: "Referral Bonus", description: "Cash bonus for each qualified referral", category: "referral", valueType: "number" },
  { key: "recurring_override_percent", value: "20", label: "Recurring Override %", description: "Percentage of referral's subscription paid as override", category: "referral", valueType: "number" },
  { key: "bft_daily_login", value: "0.2", label: "Daily Login BFT", description: "BFT tokens for daily portal login", category: "bft_rewards", valueType: "number" },
  { key: "bft_streak_7day", value: "2.5", label: "7-Day Streak Bonus", description: "BFT bonus for 7 consecutive login days", category: "bft_rewards", valueType: "number" },
  { key: "bft_streak_30day", value: "10", label: "30-Day Streak Bonus", description: "BFT bonus for 30 consecutive login days", category: "bft_rewards", valueType: "number" },
  { key: "bft_customer_contact", value: "1", label: "Customer Contact BFT", description: "BFT for contacting a lead", category: "bft_rewards", valueType: "number" },
  { key: "bft_interest_shown", value: "1.5", label: "Interest Shown BFT", description: "BFT when lead shows interest", category: "bft_rewards", valueType: "number" },
  { key: "bft_sale_closed", value: "5", label: "Sale Closed BFT", description: "BFT for closing a sale", category: "bft_rewards", valueType: "number" },
  { key: "bft_lesson_complete", value: "5", label: "Lesson Complete BFT", description: "BFT for completing a training lesson", category: "bft_rewards", valueType: "number" },
  { key: "bft_module_complete", value: "25", label: "Module Complete BFT", description: "BFT bonus for completing an entire module", category: "bft_rewards", valueType: "number" },
  { key: "bft_service_suggest", value: "0.5", label: "Service Suggest BFT", description: "BFT for suggesting a service to a lead", category: "bft_rewards", valueType: "number" },
];

export async function seedProducts() {
  console.log("[Seed] Starting product seeding...");
  
  for (const product of defaultProducts) {
    const existing = await storage.getProductBySlug(product.slug);
    if (!existing) {
      await storage.createProduct(product);
      console.log(`[Seed] Created product: ${product.name}`);
    } else {
      console.log(`[Seed] Product already exists: ${product.name}`);
    }
  }
  
  console.log("[Seed] Product seeding complete.");
}

export async function seedSettings() {
  console.log("[Seed] Starting platform settings seeding...");
  
  for (const setting of defaultSettings) {
    await storage.upsertSetting(setting);
    console.log(`[Seed] Upserted setting: ${setting.key}`);
  }
  
  console.log("[Seed] Platform settings seeding complete.");
}

export async function seedAll() {
  await seedProducts();
  await seedSettings();
}
