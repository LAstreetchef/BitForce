import subscriptionImage from "@assets/generated_images/friendly_tech_buddy_subscription_portrait.png";
import sessionImage from "@assets/generated_images/tech_mentor_one-time_session_portrait.png";
import bundleImage from "@assets/generated_images/tech_companion_bundle_package_portrait.png";
import securityScannerImage from "@assets/generated_images/digital_security_shield_scanner_illustration.png";

export interface ProductFeature {
  text: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: string;
  priceDetail: string;
  description: string;
  valueProposition: string;
  backstory: string;
  bestFor: string[];
  useCases: string[];
  features: ProductFeature[];
  image: string;
  badge?: string;
  badgeType?: "popular" | "bestValue" | "new";
  commissionInfo: string;
  category: "subscription" | "session" | "bundle" | "security";
  hasInteractiveFeature?: boolean;
}

export const products: Product[] = [
  {
    id: "monthly-subscription",
    name: "Monthly AI Buddy Subscription",
    tagline: "Your go-to tech support, always there",
    price: "$29",
    priceDetail: "per month",
    description: "Unlimited quick check-ins (via email or phone) plus one 30-minute session each month for any ongoing tech questions.",
    valueProposition: "Affordable ongoing support so you never feel stuck - perfect for seniors or busy families who want a reliable \"go-to\" person as technology evolves.",
    backstory: "Think of your AI Buddy as that patient, tech-savvy family member who never gets frustrated when you ask the same question twice. Available whenever technology throws you a curveball.",
    bestFor: ["Seniors", "Busy Families", "Tech Beginners"],
    useCases: [
      "Get help when apps update unexpectedly",
      "Learn to video call grandchildren",
      "Navigate smartphone settings with confidence",
      "Troubleshoot smart home devices"
    ],
    features: [
      { text: "Unlimited email/phone check-ins" },
      { text: "One 30-minute session each month" },
      { text: "Ongoing support as tech evolves" },
      { text: "Never feel stuck or overwhelmed" },
      { text: "Cancel anytime" }
    ],
    image: subscriptionImage,
    badge: "Most Popular",
    badgeType: "popular",
    commissionInfo: "Earn $8/month recurring commission",
    category: "subscription"
  },
  {
    id: "one-time-session",
    name: "One-Time AI Buddy Session",
    tagline: "Quick wins, lasting confidence",
    price: "$79",
    priceDetail: "60 minutes",
    description: "Get hands-on help with one specific tech need - like backing up family photos, setting up a simple home security camera, or navigating a smartphone/app.",
    valueProposition: "Your buddy explains everything patiently in plain language and leaves you with a custom, easy-to-follow AI-generated guide. Perfect for quick wins and building confidence without overwhelm.",
    backstory: "Perfect for when you have a specific tech challenge that's been nagging at you. Your AI Buddy will walk you through it step-by-step and make sure you feel confident before the session ends.",
    bestFor: ["First-Timers", "Specific Problems", "Gift Givers"],
    useCases: [
      "Back up and organize family photos",
      "Set up home security cameras",
      "Transfer data to a new phone",
      "Learn a new app or device"
    ],
    features: [
      { text: "60 minutes of dedicated one-on-one support" },
      { text: "Plain language explanations (no tech jargon)" },
      { text: "Custom AI-generated guide included" },
      { text: "Help with photos, devices, apps, or security" },
      { text: "Patient, friendly buddy approach" }
    ],
    image: sessionImage,
    commissionInfo: "Earn $20 commission per session sold",
    category: "session"
  },
  {
    id: "bundle-package",
    name: "AI Buddy Bundle Package",
    tagline: "Steady progress, lasting peace of mind",
    price: "$199",
    priceDetail: "3 sessions",
    description: "Tackle multiple everyday tech challenges over time (e.g., photo organization + backup + basic security setup) with the same trusted buddy.",
    valueProposition: "Save money compared to individual sessions, get ongoing support, and receive a personalized digital folder with all your custom guides. Ideal for steady progress and long-term peace of mind.",
    backstory: "For those who want to become truly comfortable with technology. Your dedicated AI Buddy learns your preferences and style, making each session more personalized than the last.",
    bestFor: ["Complete Beginners", "Multiple Challenges", "Ongoing Learners"],
    useCases: [
      "Master your smartphone from basics to advanced",
      "Set up a complete digital photo system",
      "Create a secure home network",
      "Learn video calling, messaging, and social media"
    ],
    features: [
      { text: "3 full 60-minute sessions" },
      { text: "Same trusted buddy throughout" },
      { text: "Save $38 vs. individual sessions" },
      { text: "Personalized digital folder with all guides" },
      { text: "Tackle multiple tech challenges over time" }
    ],
    image: bundleImage,
    badge: "Best Value",
    badgeType: "bestValue",
    commissionInfo: "Earn $50 commission per bundle sold",
    category: "bundle"
  },
  {
    id: "security-scanner",
    name: "Digital Footprint Scanner",
    tagline: "Security check for your email",
    price: "Included",
    priceDetail: "with plan",
    description: "See if your email has been exposed in data breaches. Our AI Security Buddy scans known breach databases and gives you a clear, easy-to-understand security report.",
    valueProposition: "Knowledge is power! Find out if your personal information has been compromised so you can take action to protect yourself and your family.",
    backstory: "Your AI Security Buddy watches your digital back. In today's world, data breaches happen constantly - our scanner helps you stay one step ahead of the bad guys.",
    bestFor: ["Privacy Conscious", "Everyone", "Security Beginners"],
    useCases: [
      "Check if your email was in a data breach",
      "See what personal data may have been exposed",
      "Get actionable security recommendations",
      "Sign up for ongoing breach monitoring"
    ],
    features: [
      { text: "Instant email breach scan" },
      { text: "Clear risk assessment (Low/Medium/High)" },
      { text: "List of breaches your email appeared in" },
      { text: "Personalized security recommendations" },
      { text: "Optional password strength checker" }
    ],
    image: securityScannerImage,
    badge: "Included",
    badgeType: "new",
    commissionInfo: "Earn $2 per monthly monitoring signup",
    category: "security",
    hasInteractiveFeature: true
  }
];

export const testimonials = [
  {
    id: "1",
    name: "Margaret S.",
    age: 72,
    location: "Phoenix, AZ",
    rating: 5,
    text: "I finally learned how to video call my grandkids! My AI Buddy was so patient and didn't make me feel silly for asking questions. The custom guide they gave me is taped to my fridge!",
    product: "Monthly Subscription"
  },
  {
    id: "2",
    name: "Robert & Linda K.",
    age: 68,
    location: "Tampa, FL",
    rating: 5,
    text: "We needed help setting up our new smart TV and streaming services. Our buddy walked us through everything step by step. Now we're binge-watching our favorite shows!",
    product: "One-Time Session"
  },
  {
    id: "3",
    name: "Thomas B.",
    age: 75,
    location: "Seattle, WA",
    rating: 5,
    text: "The bundle was perfect for me. I had years of photos scattered everywhere and didn't know where to start. Now everything is organized and backed up. Worth every penny!",
    product: "Bundle Package"
  },
  {
    id: "4",
    name: "Carol M.",
    age: 69,
    location: "Denver, CO",
    rating: 5,
    text: "After my husband passed, I had to learn all the tech stuff he used to handle. My AI Buddy has been a lifesaver - patient, kind, and always there when I need help.",
    product: "Monthly Subscription"
  }
];

export const faqs = [
  {
    question: "How do AI Buddy sessions work?",
    answer: "Your AI Buddy connects with you via video call, phone, or screen share - whatever you're most comfortable with. They guide you step-by-step through any tech challenge, explaining everything in plain language. After each session, you receive a custom guide you can refer to anytime."
  },
  {
    question: "Is my personal information safe and private?",
    answer: "Absolutely. We take your privacy seriously. Your AI Buddy never stores your passwords or sensitive information. All sessions are confidential, and we use bank-level encryption to protect any data shared during our calls."
  },
  {
    question: "What if I need help with something not listed?",
    answer: "Our AI Buddies are trained to help with virtually any everyday tech challenge - from smartphones and tablets to smart TVs, computers, and more. If you have a unique need, just ask! We're here to help."
  },
  {
    question: "Can I customize my AI Buddy experience?",
    answer: "Yes! We match you with a buddy based on your preferences and learning style. Monthly subscribers get the same buddy each time, building a relationship where your buddy understands exactly how you like to learn."
  },
  {
    question: "What if I'm not satisfied with my session?",
    answer: "We offer a 100% satisfaction guarantee. If you're not completely happy with your session, we'll either provide additional support at no charge or offer a full refund. Your comfort and confidence are our top priority."
  },
  {
    question: "Do I need to be tech-savvy to use this service?",
    answer: "Not at all! Our service is specifically designed for people who feel overwhelmed by technology. We meet you exactly where you are, no matter your skill level. Many of our happiest customers started with zero tech experience."
  }
];

export const comparisonFeatures = [
  { feature: "Session Duration", subscription: "30 min/month", session: "60 minutes", bundle: "180 min total" },
  { feature: "Email/Phone Check-ins", subscription: "Unlimited", session: "Session only", bundle: "Between sessions" },
  { feature: "Custom AI Guide", subscription: "Monthly", session: "1 included", bundle: "3 included" },
  { feature: "Same Buddy", subscription: "Yes", session: "N/A", bundle: "Yes" },
  { feature: "Savings", subscription: "Ongoing value", session: "Pay per need", bundle: "Save $38" },
  { feature: "Best For", subscription: "Ongoing support", session: "One-time help", bundle: "Multiple projects" }
];

export const categories = [
  { id: "all", name: "All Services" },
  { id: "subscription", name: "Subscriptions" },
  { id: "session", name: "Single Sessions" },
  { id: "bundle", name: "Bundles" },
  { id: "security", name: "Security Tools" }
];
