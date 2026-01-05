import { 
  Camera, 
  Bot, 
  Wifi, 
  Home, 
  Hammer, 
  Wrench, 
  PaintBucket, 
  BadgeDollarSign, 
  Settings2 
} from "lucide-react";
import type { ServiceData } from "@/components/ServiceCard";

export const services: ServiceData[] = [
  {
    id: "digitizing",
    name: "Digitizing Photos & Videos",
    icon: Camera,
    keywords: ["photo", "video", "memory", "vhs", "tape", "film", "album", "picture", "dvd"],
    questions: [
      "Do you have boxes of old photos or VHS tapes stored away?",
      "Are you worried about your physical memories fading or getting damaged?",
      "Would you like to easily share these memories with family online?",
      "When was the last time you watched your old home movies?"
    ],
    talkingPoints: "Our digitization service preserves your precious family memories forever. We convert VHS, film, and physical photos into high-quality digital formats. \n\nThis not only protects them from physical degradation but makes them shareable with a single click. It's the perfect gift for anniversaries or holidays."
  },
  {
    id: "ai-assistance",
    name: "Home AI Assistance",
    icon: Bot,
    keywords: ["ai", "smart", "automation", "tech", "bot", "assistant", "alexa", "google", "voice"],
    questions: [
      "Are you interested in controlling your home with voice commands?",
      "Do you want to automate routine tasks like lighting or grocery lists?",
      "Have you heard about how AI can help with daily scheduling?",
      "Would you like a demonstration of how a smart assistant works?"
    ],
    talkingPoints: "Transform your living space with intelligent home automation. We set up comprehensive AI assistants that can manage your calendar, control your smart devices, and even help with meal planning. \n\nImagine walking into a room and having the lights and temperature adjust perfectly to your preference automatically."
  },
  {
    id: "digital-services",
    name: "Home Digital Services",
    icon: Wifi,
    keywords: ["alarm", "camera", "internet", "wifi", "web", "site", "network", "security", "connection"],
    questions: [
      "Are there dead zones in your house where WiFi doesn't reach?",
      "Are you concerned about your home security while you're away?",
      "Do you need a personal website or digital portfolio?",
      "Is your current internet speed sufficient for your family's needs?"
    ],
    talkingPoints: "We provide enterprise-grade digital infrastructure for your home. From mesh WiFi systems that eliminate dead zones to integrated security cameras you can check from your phone. \n\nWe ensure your digital life is secure, fast, and reliable, giving you peace of mind and seamless connectivity."
  },
  {
    id: "roofing",
    name: "Roof Installation & Repair",
    icon: Home,
    keywords: ["roof", "leak", "shingle", "rain", "storm", "damage", "gutter", "water"],
    questions: [
      "How old is your current roof?",
      "Have you noticed any water stains on your ceiling?",
      "Did the recent storm cause any visible damage?",
      "Are you looking to improve your home's energy efficiency?"
    ],
    talkingPoints: "Your roof is your home's first line of defense. Our expert team provides comprehensive inspections and durable repairs. \n\nWe use premium materials that not only protect your home for decades but also improve insulation, potentially lowering your heating and cooling bills."
  },
  {
    id: "driveway",
    name: "Driveway Services",
    icon: Hammer,
    keywords: ["drive", "pave", "concrete", "crack", "asphalt", "parking", "walkway"],
    questions: [
      "Are there cracks or potholes in your driveway?",
      "Does water pool in certain areas when it rains?",
      "Are you looking to boost your home's curb appeal?",
      "Is your current driveway material showing signs of wear?"
    ],
    talkingPoints: "A pristine driveway significantly enhances your property's value and curb appeal. We offer professional paving, sealing, and repair services. \n\nWhether it's stamped concrete for a luxury look or durable asphalt for longevity, we ensure a smooth welcome home every day."
  },
  {
    id: "plumbing",
    name: "Plumbing Services",
    icon: Wrench,
    keywords: ["water", "pipe", "leak", "drain", "bath", "shower", "toilet", "clog", "faucet"],
    questions: [
      "Do you have any leaky faucets or running toilets?",
      "Is your water pressure lower than you'd like?",
      "Are you planning any bathroom renovations?",
      "When was the last time your water heater was serviced?"
    ],
    talkingPoints: "Reliable plumbing is essential for a comfortable home. Our certified plumbers handle everything from emergency leak repairs to luxury bathroom installations. \n\nWe also offer preventative maintenance to catch small issues before they become expensive disasters."
  },
  {
    id: "general-reno",
    name: "General Home Improvement",
    icon: PaintBucket,
    keywords: ["fix", "paint", "repair", "reno", "remodel", "kitchen", "deck", "floor", "improvement"],
    questions: [
      "Is there a room in your house that feels outdated?",
      "Do you have a list of small repairs that never gets done?",
      "Are you looking to refresh your walls with new paint?",
      "Would you like to expand your outdoor living space?"
    ],
    talkingPoints: "From a fresh coat of paint to a complete room remodel, our skilled craftsmen bring your vision to life. \n\nWe handle the entire project management process, ensuring high-quality work that stays on budget and on schedule. Let's turn your house into your dream home."
  },
  {
    id: "financing",
    name: "Mortgage & Financing",
    icon: BadgeDollarSign,
    keywords: ["loan", "bank", "money", "finance", "mortgage", "rate", "refinance", "credit"],
    questions: [
      "Are you looking to lower your monthly mortgage payments?",
      "Do you need funding for a major renovation project?",
      "Are you interested in tapping into your home's equity?",
      "Have you checked current interest rates recently?"
    ],
    talkingPoints: "Unlock the financial potential of your property. Our financial experts can guide you through refinancing options, renovation loans, or equity lines of credit. \n\nWe help you find the most competitive rates so you can fund your improvements or consolidate debt smartly."
  },
  {
    id: "custom",
    name: "Custom / Other Services",
    icon: Settings2,
    keywords: [],
    questions: [
      "What is the biggest challenge with your home right now?",
      "Is there a unique project you've been dreaming of?",
      "How can we make your life easier?",
      "What is your budget and timeline for this project?"
    ],
    talkingPoints: "Every home is unique, and so are your needs. We pride ourselves on our versatility and problem-solving abilities. \n\nTell us what you need, and we'll create a tailored solution that fits your specific requirements and budget perfectly."
  }
];
