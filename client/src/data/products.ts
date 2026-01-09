import sessionImage from "@assets/generated_images/one-on-one_tech_help_session.png";
import bundleImage from "@assets/generated_images/security_camera_bundle_setup.png";
import subscriptionImage from "@assets/generated_images/monthly_subscription_community.png";

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
  features: ProductFeature[];
  image: string;
  badge?: string;
  commissionInfo: string;
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
    features: [
      { text: "Unlimited email/phone check-ins" },
      { text: "One 30-minute session each month" },
      { text: "Ongoing support as tech evolves" },
      { text: "Never feel stuck or overwhelmed" },
      { text: "Cancel anytime" }
    ],
    image: subscriptionImage,
    badge: "Popular",
    commissionInfo: "Earn $8/month recurring commission"
  },
  {
    id: "one-time-session",
    name: "One-Time AI Buddy Session",
    tagline: "Quick wins, lasting confidence",
    price: "$79",
    priceDetail: "60 minutes",
    description: "Get hands-on help with one specific tech need - like backing up family photos, setting up a simple home security camera, or navigating a smartphone/app.",
    valueProposition: "Your buddy explains everything patiently in plain language and leaves you with a custom, easy-to-follow AI-generated guide. Perfect for quick wins and building confidence without overwhelm.",
    features: [
      { text: "60 minutes of dedicated one-on-one support" },
      { text: "Plain language explanations (no tech jargon)" },
      { text: "Custom AI-generated guide included" },
      { text: "Help with photos, devices, apps, or security" },
      { text: "Patient, friendly buddy approach" }
    ],
    image: sessionImage,
    commissionInfo: "Earn $20 commission per session sold"
  },
  {
    id: "bundle-package",
    name: "AI Buddy Bundle Package",
    tagline: "Steady progress, lasting peace of mind",
    price: "$199",
    priceDetail: "3 sessions",
    description: "Tackle multiple everyday tech challenges over time (e.g., photo organization + backup + basic security setup) with the same trusted buddy.",
    valueProposition: "Save money compared to individual sessions, get ongoing support, and receive a personalized digital folder with all your custom guides. Ideal for steady progress and long-term peace of mind.",
    features: [
      { text: "3 full 60-minute sessions" },
      { text: "Same trusted buddy throughout" },
      { text: "Save $38 vs. individual sessions" },
      { text: "Personalized digital folder with all guides" },
      { text: "Tackle multiple tech challenges over time" }
    ],
    image: bundleImage,
    badge: "Best Value",
    commissionInfo: "Earn $50 commission per bundle sold"
  }
];
