import { 
  Rocket, 
  MessageSquare, 
  Home, 
  Smartphone, 
  Target, 
  Users, 
  Shield, 
  TrendingUp, 
  Wrench, 
  Award, 
  Zap,
  Heart
} from "lucide-react";

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  content: string;
  keyPoints: string[];
  proTip?: string;
}

export interface TrainingModule {
  id: number;
  title: string;
  tagline: string;
  description: string;
  duration: string;
  category: "Onboarding" | "Products" | "Skills" | "Tools" | "Leadership" | "Compliance";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  icon: any;
  color: string;
  objectives: string[];
  lessons: Lesson[];
  quiz: {
    questions: number;
    passingScore: number;
  };
  certificate: boolean;
  funFact?: string;
}

export const trainingModules: TrainingModule[] = [
  {
    id: 1,
    title: "Welcome to the Team! 🎉",
    tagline: "Your journey to ambassador success starts here",
    description: "Everything you need to know to hit the ground running. We'll cover the basics, set you up for success, and have you feeling like a pro in no time!",
    duration: "25 min",
    category: "Onboarding",
    difficulty: "Beginner",
    icon: Rocket,
    color: "bg-gradient-to-br from-blue-500 to-indigo-600",
    objectives: [
      "Understand what Bit Force is all about and our mission",
      "Navigate the ambassador portal like a pro",
      "Know exactly how you get paid (the fun part!)",
      "Set up your profile and make it shine"
    ],
    lessons: [
      {
        id: "1-1",
        title: "Meet Bit Force: Who We Are",
        duration: "5 min",
        content: "Welcome to the family! Bit Force (formerly Digital Intelligence Marketing) is on a mission to help homeowners discover amazing services that make their lives easier. We're not just selling – we're solving problems and building relationships. Our ambassadors are the heart of what we do, connecting real people with real solutions.",
        keyPoints: [
          "We partner with 50+ trusted service providers",
          "Our focus: home services, digital solutions, and security",
          "We believe in honest, helpful recommendations",
          "You're not just an ambassador – you're a trusted advisor"
        ],
        proTip: "People can tell when you genuinely care. Focus on solving their problems, and the sales will follow naturally!"
      },
      {
        id: "1-2",
        title: "Your Portal: Home Base",
        duration: "7 min",
        content: "Your ambassador portal is where all the magic happens! Think of it as mission control for your ambassador journey. Let's take a tour and make sure you know where everything is.",
        keyPoints: [
          "Dashboard: Your daily snapshot of leads, earnings, and activity",
          "Leads: Where you track and manage all your customer conversations",
          "Tools: AI assistance, property lookup, and security scanners",
          "Team: See your referrals and build your network",
          "Resources: Training, scripts, and materials (you are here! 📍)"
        ],
        proTip: "Bookmark your portal! Make it your browser's homepage so you start every day ready to crush it."
      },
      {
        id: "1-3",
        title: "Show Me the Money: How You Earn",
        duration: "8 min",
        content: "Let's talk about everyone's favorite topic – getting paid! Our compensation structure is designed to reward your hustle AND your relationship-building skills.",
        keyPoints: [
          "Direct commissions: 10-25% on every service you help sell",
          "Referral bonuses: $50 instant cash per qualified ambassador referral",
          "Recurring income: 20% override on your team's subscriptions (~$4/month per active referral)",
          "Bonuses: Hit milestones, unlock extra rewards",
          "Payments: Direct deposit every Friday – no waiting around!"
        ],
        proTip: "The real money is in recurring income. Help one person, get paid once. Build a team, get paid forever! 💰"
      },
      {
        id: "1-4",
        title: "Setting Up Your Profile",
        duration: "5 min",
        content: "First impressions matter! Let's make your ambassador profile look professional and trustworthy. Customers and team members will see this, so let's make it count.",
        keyPoints: [
          "Add a friendly, professional photo (smile!)",
          "Write a bio that shows your personality",
          "Connect your payment method for those sweet commissions",
          "Set your notification preferences so you never miss a lead"
        ],
        proTip: "Pro ambassadors update their bio monthly with recent wins and testimonials. Social proof is powerful!"
      }
    ],
    quiz: { questions: 10, passingScore: 80 },
    certificate: true,
    funFact: "The average ambassador earns their first commission within 3 days of completing this training!"
  },
  {
    id: 2,
    title: "The Art of Conversation 💬",
    tagline: "Turn chats into connections (and connections into customers)",
    description: "Master the art of natural, helpful conversations that make customers feel heard and understood. No sleazy sales tactics here – just genuine human connection!",
    duration: "35 min",
    category: "Skills",
    difficulty: "Beginner",
    icon: MessageSquare,
    color: "bg-gradient-to-br from-green-500 to-emerald-600",
    objectives: [
      "Start conversations that feel natural, not salesy",
      "Ask the right questions to understand real needs",
      "Handle objections with grace and confidence",
      "Know when to close and when to nurture"
    ],
    lessons: [
      {
        id: "2-1",
        title: "The 3-Second First Impression",
        duration: "6 min",
        content: "You have about 3 seconds to make someone feel comfortable talking to you. No pressure, right? Don't worry – we've got a formula that works every time. It's all about warmth, curiosity, and genuine interest.",
        keyPoints: [
          "Smile first – even on the phone, people can hear it",
          "Use their name early and often (but not too often!)",
          "Mirror their energy level – match their vibe",
          "Lead with curiosity, not a pitch"
        ],
        proTip: "Start with 'Hey [Name], I'm curious...' – curiosity is magnetic and non-threatening!"
      },
      {
        id: "2-2",
        title: "The Discovery Dance",
        duration: "10 min",
        content: "Great salespeople don't sell – they discover. Your job is to be a detective, uncovering what your customer really needs (sometimes before they even know it themselves!).",
        keyPoints: [
          "Open-ended questions are your best friend ('Tell me about...')",
          "Listen more than you talk (aim for 70/30 ratio)",
          "Take notes – remembering details shows you care",
          "Look for pain points: frustration, worry, wasted time/money"
        ],
        proTip: "The magic question: 'What would make your life easier?' Then just listen. Gold will follow."
      },
      {
        id: "2-3",
        title: "Objection Judo: Flip the Script",
        duration: "8 min",
        content: "Objections aren't rejection – they're just questions in disguise! When someone pushes back, they're actually telling you they're interested but need more information. Let's learn to love objections.",
        keyPoints: [
          "'Too expensive' = 'Help me understand the value'",
          "'I need to think about it' = 'I have unanswered questions'",
          "'Not right now' = 'I'm not convinced it's urgent'",
          "Always agree first: 'I totally understand...' then address"
        ],
        proTip: "Never argue. Say 'That's a great point, and here's what other customers found...' – let social proof do the heavy lifting!"
      },
      {
        id: "2-4",
        title: "The Assumptive Close",
        duration: "6 min",
        content: "Closing doesn't have to be awkward! The best closes feel like a natural next step, not a pushy finale. We'll practice closes that feel good for everyone.",
        keyPoints: [
          "Summarize their needs back to them first",
          "Use 'when' not 'if' language",
          "Offer two positive options (not yes/no)",
          "Be quiet after you ask – silence is powerful"
        ],
        proTip: "Try: 'Based on what you've told me, [Service] sounds perfect. Should we get you set up for this week or next?' Simple and effective!"
      },
      {
        id: "2-5",
        title: "The Follow-Up Formula",
        duration: "5 min",
        content: "Most sales happen between the 5th and 12th contact. Yes, really! Let's build a follow-up system that keeps you top-of-mind without being annoying.",
        keyPoints: [
          "Follow up within 24 hours – always",
          "Add value each time (share a tip, article, or insight)",
          "Use multiple channels: text, email, call",
          "Set reminders – don't trust your memory"
        ],
        proTip: "The 'Just saw this and thought of you...' text is GOLD. Save interesting articles and tips to share!"
      }
    ],
    quiz: { questions: 15, passingScore: 80 },
    certificate: true,
    funFact: "Ambassadors who complete this module close 40% more deals on average!"
  },
  {
    id: 3,
    title: "Home Services Mastery 🏠",
    tagline: "Become the go-to expert for everything home",
    description: "Deep dive into our most popular category! Learn everything about roofing, HVAC, plumbing, electrical, and more. You'll sound like you've been in the industry for years.",
    duration: "45 min",
    category: "Products",
    difficulty: "Intermediate",
    icon: Home,
    color: "bg-gradient-to-br from-orange-500 to-amber-600",
    objectives: [
      "Explain each home service confidently and accurately",
      "Identify warning signs that homeowners should act on",
      "Match the right service to the right customer",
      "Understand pricing ranges and what affects cost"
    ],
    lessons: [
      {
        id: "3-1",
        title: "Roofing: The Hat Your House Wears",
        duration: "10 min",
        content: "A roof is the most important part of any home – it literally keeps everything else safe! Let's learn how to spot problems and talk about solutions.",
        keyPoints: [
          "Average roof lifespan: 20-30 years (asphalt shingles)",
          "Warning signs: missing shingles, water stains, granules in gutters",
          "Emergency leaks need immediate attention – we have 24/7 partners",
          "Insurance can cover storm damage – help them navigate claims"
        ],
        proTip: "Ask about the age of their roof. If it's 15+ years, suggest a free inspection. It's not pushy – it's helpful!"
      },
      {
        id: "3-2",
        title: "HVAC: Keeping Cool (and Warm)",
        duration: "10 min",
        content: "Nobody appreciates their HVAC until it breaks – usually on the hottest or coldest day of the year! Position yourself as the hero who prevents those disasters.",
        keyPoints: [
          "Systems should be serviced twice yearly (spring and fall)",
          "Average system life: 15-20 years",
          "Warning signs: strange noises, uneven temps, rising bills",
          "Filters should be changed every 1-3 months"
        ],
        proTip: "In Texas, HVAC is HUGE. Summer temps mean AC is critical. 'When's the last time you had your AC serviced?' is always relevant!"
      },
      {
        id: "3-3",
        title: "Plumbing: The Hidden Hero",
        duration: "8 min",
        content: "Plumbing problems are stressful because they can cause so much damage so quickly. Water damage is expensive! Help homeowners stay ahead of issues.",
        keyPoints: [
          "Small leaks waste 10,000+ gallons per year",
          "Water heaters last 10-15 years on average",
          "Signs of trouble: slow drains, low pressure, discolored water",
          "Sewer line issues: gurgling sounds, sewage smell, wet spots in yard"
        ],
        proTip: "Water damage is the #1 home insurance claim. Frame plumbing maintenance as protection for their biggest investment!"
      },
      {
        id: "3-4",
        title: "Electrical: Safety First",
        duration: "8 min",
        content: "Electrical issues aren't just inconvenient – they can be dangerous. Older homes especially need attention. Let's learn to identify risks.",
        keyPoints: [
          "Homes 30+ years old often need panel upgrades",
          "Warning signs: flickering lights, burning smell, warm outlets",
          "GFCI outlets required in bathrooms/kitchens (safety code)",
          "Surge protectors save electronics – whole-home options available"
        ],
        proTip: "Ask if they've added major appliances or EV charging. Modern demands often exceed old wiring capacity!"
      },
      {
        id: "3-5",
        title: "Bundling: More Value, More Earnings",
        duration: "9 min",
        content: "Here's a secret: customers who buy bundles are happier AND you earn more. Win-win! Let's learn natural ways to suggest complementary services.",
        keyPoints: [
          "HVAC + Duct Cleaning = natural pair",
          "Roofing + Gutters + Insulation = complete protection",
          "Plumbing + Water Heater + Water Softener = water wellness",
          "Bundle discounts make it easier for customers to say yes"
        ],
        proTip: "Frame bundles as 'While the crew is there anyway...' – it's about convenience, not upselling!"
      }
    ],
    quiz: { questions: 20, passingScore: 75 },
    certificate: true,
    funFact: "Home services have the highest average commission at 15-25%!"
  },
  {
    id: 4,
    title: "Digital Services Deep Dive 📱",
    tagline: "Tech solutions for the modern homeowner",
    description: "Today's homeowners need more than just physical services. Learn about AI assistants, smart home setup, tech support, and document digitization – the future is here!",
    duration: "40 min",
    category: "Products",
    difficulty: "Intermediate",
    icon: Smartphone,
    color: "bg-gradient-to-br from-purple-500 to-violet-600",
    objectives: [
      "Explain AI Buddy tech support with confidence",
      "Understand smart home integration options",
      "Present document digitization as a solution",
      "Identify the perfect digital service customer"
    ],
    lessons: [
      {
        id: "4-1",
        title: "AI Buddy: Tech Support Reimagined",
        duration: "12 min",
        content: "AI Buddy is our flagship tech support service. It's like having a brilliant, patient friend who knows everything about technology – available 24/7! This is a game-changer for seniors and busy families.",
        keyPoints: [
          "24/7 AI-powered tech support for any device",
          "Covers phones, tablets, computers, smart TVs, and more",
          "Patient, step-by-step guidance (no jargon!)",
          "Escalation to human experts for complex issues",
          "Monthly subscription = recurring commission for you!"
        ],
        proTip: "Best customers: Parents helping their kids with devices, seniors wanting to video chat with grandkids, and busy professionals who don't have time to troubleshoot."
      },
      {
        id: "4-2",
        title: "Smart Home Setup",
        duration: "10 min",
        content: "Smart homes aren't just for tech geeks anymore! Thermostats, doorbells, lights, and locks – we help homeowners bring their house into the future without the frustration.",
        keyPoints: [
          "Most popular: smart thermostats (save 10-15% on energy)",
          "Video doorbells: security + convenience",
          "Smart locks: never get locked out again",
          "Voice assistants: the hub of the smart home"
        ],
        proTip: "Ask 'What would you automate if you could?' People often don't realize how affordable smart home tech has become!"
      },
      {
        id: "4-3",
        title: "Document Digitization",
        duration: "8 min",
        content: "Boxes of photos, stacks of important papers, VHS tapes gathering dust – we turn physical memories and documents into secure, shareable digital files.",
        keyPoints: [
          "Photo scanning: preserve family memories forever",
          "VHS/DVD conversion: save home movies before they decay",
          "Document scanning: medical records, legal papers, warranties",
          "Cloud backup included: accessible anywhere, safe forever"
        ],
        proTip: "Perfect for: estate planning, downsizing, empty nesters, and anyone who's said 'I really should organize those photos someday...'"
      },
      {
        id: "4-4",
        title: "Security & Privacy Services",
        duration: "10 min",
        content: "With data breaches constantly in the news, people are worried about their digital safety. Our security services help them sleep better at night.",
        keyPoints: [
          "Password management setup: one master password, secure everything",
          "Dark web monitoring: alerts if their info is found",
          "VPN setup: protect their browsing (especially on public WiFi)",
          "Device security audits: find and fix vulnerabilities"
        ],
        proTip: "Use our Security Risk Check tool during conversations! It shows real results and creates natural urgency."
      }
    ],
    quiz: { questions: 15, passingScore: 80 },
    certificate: true,
    funFact: "Digital services have the highest customer satisfaction rating at 4.8/5 stars!"
  },
  {
    id: 5,
    title: "Security Services Specialist 🔒",
    tagline: "Help families feel safe and protected",
    description: "From home security systems to personal safety solutions, learn to be the trusted advisor who helps families protect what matters most.",
    duration: "35 min",
    category: "Products",
    difficulty: "Intermediate",
    icon: Shield,
    color: "bg-gradient-to-br from-red-500 to-rose-600",
    objectives: [
      "Understand home security system options and pricing",
      "Explain monitoring services and response times",
      "Identify security-conscious customer profiles",
      "Present security as peace of mind, not fear"
    ],
    lessons: [
      {
        id: "5-1",
        title: "Home Security 101",
        duration: "10 min",
        content: "Home security isn't about scaring people – it's about giving them peace of mind. Whether they're home or away, everyone deserves to feel safe.",
        keyPoints: [
          "Basic package: door/window sensors, motion detectors, control panel",
          "Professional monitoring: 24/7 response, dispatch to authorities",
          "DIY options: more affordable, app-controlled",
          "Insurance discounts: often 5-20% with monitored systems"
        ],
        proTip: "Don't lead with fear! Ask 'What would give you more peace of mind when you're away?' Much more positive approach."
      },
      {
        id: "5-2",
        title: "Video Surveillance Options",
        duration: "8 min",
        content: "Cameras have gotten incredibly good and affordable. From doorbell cams to full property coverage, there's a solution for every need and budget.",
        keyPoints: [
          "Doorbell cameras: see who's there from anywhere",
          "Indoor cameras: check on pets, kids, elderly parents",
          "Outdoor cameras: deter crime before it happens",
          "Cloud storage: keep recordings safe and accessible"
        ],
        proTip: "Package deliveries are a hot topic! 'Ever had a package stolen?' opens the door to doorbell camera conversations."
      },
      {
        id: "5-3",
        title: "Smart Locks & Access Control",
        duration: "7 min",
        content: "Keys are becoming a thing of the past! Smart locks offer security AND convenience – no more hiding spare keys or worrying about lost ones.",
        keyPoints: [
          "Keypad entry: unique codes for family, cleaners, dog walkers",
          "Phone unlock: your phone becomes your key",
          "Activity logs: see exactly who comes and goes when",
          "Remote lock/unlock: let someone in from anywhere"
        ],
        proTip: "Families with teenagers LOVE the activity log feature. 'What time did they get home?' problem solved!"
      },
      {
        id: "5-4",
        title: "Selling Peace of Mind",
        duration: "10 min",
        content: "Security is emotional. It's about protecting family, memories, and peace of mind. Let's learn to connect on that level.",
        keyPoints: [
          "Ask about concerns: travel, neighborhood changes, recent events",
          "Focus on 'sleep better at night' – literally",
          "Share statistics without being scary (1 in 36 homes burglarized yearly)",
          "Emphasize prevention, not reaction"
        ],
        proTip: "New parents and new homeowners are PRIME security customers. Major life changes trigger protective instincts!"
      }
    ],
    quiz: { questions: 12, passingScore: 80 },
    certificate: true,
    funFact: "Home security is our fastest-growing category with 35% growth year-over-year!"
  },
  {
    id: 6,
    title: "Power Tools Training 🛠️",
    tagline: "Master the tools that make you unstoppable",
    description: "Your ambassador portal has powerful tools that most people never fully explore. Let's change that! From AI assistance to property intelligence, become a power user.",
    duration: "30 min",
    category: "Tools",
    difficulty: "Beginner",
    icon: Wrench,
    color: "bg-gradient-to-br from-cyan-500 to-teal-600",
    objectives: [
      "Use Ask AI for instant answers and suggestions",
      "Generate property reports to impress customers",
      "Run Security Risk Checks during conversations",
      "Search for lost contacts with the Friend Finder"
    ],
    lessons: [
      {
        id: "6-1",
        title: "Ask AI: Your 24/7 Assistant",
        duration: "8 min",
        content: "Ask AI is like having a brilliant coworker who's always available. Whether you need help with a customer question or want to draft a follow-up message, AI's got your back!",
        keyPoints: [
          "Ask product questions: 'What's our best option for senior tech support?'",
          "Draft messages: 'Write a follow-up text for a roofing lead'",
          "Get objection responses: 'How do I respond to too expensive?'",
          "Learn scripts: 'Give me a cold call opener for home security'"
        ],
        proTip: "Be specific with your questions! 'Help me close a lead' is okay, but 'Help me close a lead who's worried about installation time' is MUCH better!"
      },
      {
        id: "6-2",
        title: "Property Intelligence Reports",
        duration: "8 min",
        content: "Want to blow a customer's mind? Show them a detailed report about their property – weather alerts, neighborhood data, and personalized recommendations!",
        keyPoints: [
          "Enter any address to generate a report",
          "Weather tab: current conditions, forecasts, alerts",
          "Neighborhood tab: demographics, home values, age of homes",
          "Services tab: AI-suggested services based on the data"
        ],
        proTip: "Pull up their property report BEFORE a call. 'I noticed homes in your area were built in the 80s – have you updated your electrical panel?' = instant credibility!"
      },
      {
        id: "6-3",
        title: "Security Risk Check",
        duration: "7 min",
        content: "This tool is a conversation starter gold mine! Show customers if their email or passwords have been exposed in data breaches. It creates urgency and positions you as a helper.",
        keyPoints: [
          "Email Exposure Scan: check against known breaches",
          "Password Safety Check: see if passwords are compromised",
          "Security Score: overall risk assessment",
          "Perfect segue into our security and tech support services"
        ],
        proTip: "Use this at community events! 'Want me to check if your email is safe? It takes 30 seconds.' People line up for this!"
      },
      {
        id: "6-4",
        title: "Friend & Family Finder",
        duration: "7 min",
        content: "Help customers reconnect with lost contacts! This feel-good tool searches public records to find people. It builds trust and opens doors to other conversations.",
        keyPoints: [
          "Search by name, city, state, and approximate age",
          "Confidence scoring helps identify correct matches",
          "Shows current and historical addresses",
          "Phone numbers when available"
        ],
        proTip: "This is a TRUST builder, not a sales tool. Help them find Aunt Betty, and they'll remember you forever. Referrals will follow!"
      }
    ],
    quiz: { questions: 10, passingScore: 80 },
    certificate: true,
    funFact: "Ambassadors who use all portal tools daily earn 3x more than those who don't!"
  },
  {
    id: 7,
    title: "Closing Like a Champion 🏆",
    tagline: "From 'maybe' to 'absolutely!' every time",
    description: "Advanced closing techniques that feel natural and get results. No high-pressure tactics – just confident, helpful closes that customers actually appreciate.",
    duration: "40 min",
    category: "Skills",
    difficulty: "Advanced",
    icon: Target,
    color: "bg-gradient-to-br from-yellow-500 to-orange-500",
    objectives: [
      "Recognize buying signals and act on them",
      "Master 5 different closing techniques",
      "Overcome last-minute objections smoothly",
      "Create urgency without being pushy"
    ],
    lessons: [
      {
        id: "7-1",
        title: "Reading Buying Signals",
        duration: "8 min",
        content: "Customers tell you they're ready to buy before they say 'yes.' Learn to spot the signs so you don't miss your moment – or worse, keep selling when they're already sold!",
        keyPoints: [
          "Questions about specifics: 'How long does installation take?'",
          "Future language: 'When you set it up...'",
          "Repeated positive statements: 'That does sound helpful'",
          "Body language: leaning in, nodding, checking calendar"
        ],
        proTip: "When you hear a buying signal, STOP SELLING and start closing. Over-explaining kills more deals than objections!"
      },
      {
        id: "7-2",
        title: "The Alternative Close",
        duration: "8 min",
        content: "Never ask 'Do you want to buy?' Ask 'Which option works better for you?' Give two positive choices and let them pick their favorite.",
        keyPoints: [
          "Example: 'Would mornings or afternoons work better for installation?'",
          "Example: 'The basic or premium package – which fits your needs?'",
          "Both options lead to yes – no escape hatch",
          "Feels collaborative, not pushy"
        ],
        proTip: "Make the second option slightly better. People tend to choose the last thing they hear!"
      },
      {
        id: "7-3",
        title: "The Summary Close",
        duration: "8 min",
        content: "Remind them of everything they're getting. When you stack up all the value, the price seems small. This close works especially well for bundles.",
        keyPoints: [
          "List every benefit they mentioned liking",
          "Include any special offers or bonuses",
          "Compare to the cost of NOT solving the problem",
          "End with: 'Ready to get started?'"
        ],
        proTip: "Use their exact words: 'You said you wanted peace of mind when traveling – this gives you exactly that, plus...' Mirror their language!"
      },
      {
        id: "7-4",
        title: "The Urgency Close (Done Right)",
        duration: "8 min",
        content: "Creating urgency isn't about fake deadlines – it's about helping them understand why acting now is in their best interest. Real urgency, real value.",
        keyPoints: [
          "Limited availability: 'Our best installer has openings this week'",
          "Seasonal relevance: 'Before summer hits...' 'Before winter...'",
          "Price protection: 'Locking in current rates before the increase'",
          "Problem escalation: 'Small leaks become big problems'"
        ],
        proTip: "Never use fake urgency. Instead, find the REAL urgency in their situation. 'You mentioned your in-laws visit next month...'"
      },
      {
        id: "7-5",
        title: "Handling Last-Minute Hesitation",
        duration: "8 min",
        content: "Right at the finish line, doubt creeps in. It's natural! Learn to reassure without retreating and help them feel confident in their decision.",
        keyPoints: [
          "Acknowledge: 'It's a big decision, I get it'",
          "Reassure: 'That's exactly why other customers chose this'",
          "Reduce risk: 'Remember, there's a satisfaction guarantee'",
          "Gentle push: 'What would help you feel 100% confident?'"
        ],
        proTip: "Sometimes people just need permission to say yes. 'I think this is a great choice for you – let's do it!'"
      }
    ],
    quiz: { questions: 15, passingScore: 85 },
    certificate: true,
    funFact: "Top closers ask for the sale 5x more often than average salespeople!"
  },
  {
    id: 8,
    title: "Building Your Empire 👥",
    tagline: "Recruit, mentor, and grow your team",
    description: "Ready to level up? Learn how to recruit new ambassadors, train them for success, and build a team that generates passive income while you sleep!",
    duration: "50 min",
    category: "Leadership",
    difficulty: "Advanced",
    icon: Users,
    color: "bg-gradient-to-br from-pink-500 to-fuchsia-600",
    objectives: [
      "Identify and recruit potential ambassadors",
      "Onboard new team members effectively",
      "Coach and motivate your growing team",
      "Maximize your recurring override income"
    ],
    lessons: [
      {
        id: "8-1",
        title: "Who Makes a Great Ambassador?",
        duration: "10 min",
        content: "Not everyone is cut out for this – but more people are than you'd think! Learn to spot potential ambassadors in your everyday life.",
        keyPoints: [
          "People-people: naturally social and helpful",
          "Side hustle seekers: already looking for extra income",
          "Career changers: ready for something new",
          "Your happy customers: they already believe in the product!"
        ],
        proTip: "Your best recruits are often your best customers. 'You'd actually be great at this – ever thought about extra income?' is powerful!"
      },
      {
        id: "8-2",
        title: "The Recruitment Conversation",
        duration: "10 min",
        content: "Recruiting isn't convincing – it's sharing an opportunity. Let's practice conversations that plant seeds and open doors.",
        keyPoints: [
          "Share your story: why you joined, what you love",
          "Focus on flexibility and income potential",
          "Address concerns honestly: 'It does take effort'",
          "Invite, don't pressure: 'Want to learn more?'"
        ],
        proTip: "Lead with the lifestyle, not the money. 'I work from anywhere, set my own schedule, and help people' resonates more than income claims."
      },
      {
        id: "8-3",
        title: "Onboarding Your First Recruit",
        duration: "12 min",
        content: "Their first 30 days determine their success. Be the mentor you wish you had! Set them up with structure, support, and quick wins.",
        keyPoints: [
          "Day 1: Portal tour and profile setup (do it together!)",
          "Week 1: Complete training modules together",
          "Week 2: Shadow calls and practice pitches",
          "Week 3-4: Their first solo leads with your backup"
        ],
        proTip: "Schedule daily 15-minute check-ins for their first two weeks. Consistency beats intensity!"
      },
      {
        id: "8-4",
        title: "Coaching for Performance",
        duration: "10 min",
        content: "Great leaders ask great questions. Instead of telling your team what to do, help them discover the answers themselves.",
        keyPoints: [
          "Weekly team calls: celebrate wins, share learnings",
          "One-on-ones: listen first, advise second",
          "Role play: practice makes perfect",
          "Recognition: public praise, private feedback"
        ],
        proTip: "When they bring you a problem, ask 'What have you tried?' and 'What do you think you should do?' Build their problem-solving muscles!"
      },
      {
        id: "8-5",
        title: "Scaling Your Income",
        duration: "8 min",
        content: "Let's talk math! With team building, your income isn't limited to your personal sales. Here's how the numbers can really add up.",
        keyPoints: [
          "$50 bonus per qualified recruit",
          "~$4/month recurring per active team member",
          "10 active recruits = $40/month passive",
          "Help them build teams = commissions on 3 levels"
        ],
        proTip: "Focus on helping 5 people succeed, not recruiting 50 who quit. Quality over quantity always wins long-term!"
      }
    ],
    quiz: { questions: 20, passingScore: 80 },
    certificate: true,
    funFact: "Ambassadors with 5+ active team members earn an average of $2,000/month more!"
  },
  {
    id: 9,
    title: "Compliance & Ethics 101 ✅",
    tagline: "Do the right thing – it's also the smart thing",
    description: "Protect yourself and our customers by understanding the rules. Compliance isn't boring – it's how we build a sustainable, trustworthy business!",
    duration: "25 min",
    category: "Compliance",
    difficulty: "Beginner",
    icon: Award,
    color: "bg-gradient-to-br from-slate-500 to-gray-600",
    objectives: [
      "Understand what you can and cannot promise",
      "Handle customer data with care",
      "Know the disclosure requirements",
      "Avoid common compliance mistakes"
    ],
    lessons: [
      {
        id: "9-1",
        title: "What You Can (and Can't) Say",
        duration: "8 min",
        content: "Words matter! Some phrases can get us all in trouble. Let's learn what to say – and what to avoid – to stay safe and credible.",
        keyPoints: [
          "Never guarantee specific income: 'typical' not 'you will'",
          "Never claim to be licensed contractors (we connect, not perform)",
          "Always disclose that you earn commissions",
          "Never pressure or mislead – ever"
        ],
        proTip: "When in doubt, underpromise. 'Most people see results like...' is safe. 'You'll definitely get...' is not!"
      },
      {
        id: "9-2",
        title: "Protecting Customer Data",
        duration: "7 min",
        content: "Our customers trust us with their personal information. That's a big deal! Let's treat it with the care it deserves.",
        keyPoints: [
          "Never share customer info with unauthorized parties",
          "Don't store sensitive data on personal devices",
          "Use the portal – it's secure and encrypted",
          "Report any data concerns immediately"
        ],
        proTip: "Imagine if it were YOUR information. Handle customer data the way you'd want yours handled!"
      },
      {
        id: "9-3",
        title: "Required Disclosures",
        duration: "5 min",
        content: "Transparency builds trust! There are certain things you must tell customers. Let's make disclosures feel natural, not awkward.",
        keyPoints: [
          "Disclose your ambassador relationship",
          "Be clear that you earn commissions",
          "Explain the referral process honestly",
          "Provide accurate service and pricing info"
        ],
        proTip: "Frame it positively: 'I partner with Bit Force because I believe in their services, and yes, I do earn a commission – which means I'm motivated to make sure you're happy!'"
      },
      {
        id: "9-4",
        title: "Red Flags & How to Handle Them",
        duration: "5 min",
        content: "Sometimes things don't feel right. Trust your gut, and know how to escalate when needed.",
        keyPoints: [
          "Customer seems confused or not understanding",
          "Pressure to skip normal procedures",
          "Requests for cash payments or unusual arrangements",
          "When in doubt, ask your team leader or support"
        ],
        proTip: "Protecting customers protects YOU. Cutting corners isn't worth the risk to your reputation and income!"
      }
    ],
    quiz: { questions: 10, passingScore: 90 },
    certificate: true,
    funFact: "100% compliance = long-term success. No exceptions!"
  },
  {
    id: 10,
    title: "Mindset of Champions 🧠",
    tagline: "Think like a winner, act like a winner, become a winner",
    description: "Success starts between your ears! Develop the mental habits and attitudes that separate top performers from the rest. Let's upgrade your mindset!",
    duration: "30 min",
    category: "Skills",
    difficulty: "Intermediate",
    icon: Zap,
    color: "bg-gradient-to-br from-emerald-500 to-green-600",
    objectives: [
      "Overcome fear of rejection once and for all",
      "Build unstoppable daily habits",
      "Stay motivated when things get tough",
      "Set and crush your biggest goals"
    ],
    lessons: [
      {
        id: "10-1",
        title: "Rejection is Redirection",
        duration: "8 min",
        content: "Every 'no' brings you closer to 'yes.' Let's reframe rejection from failure to fuel. The best salespeople hear 'no' more than anyone – because they ask more!",
        keyPoints: [
          "Average: 8 touches before a sale. Each 'no' is progress!",
          "Rejection isn't personal – it's situational",
          "Learn from each 'no': timing? fit? approach?",
          "'No' often means 'not yet' – follow up matters"
        ],
        proTip: "Set a 'rejection goal' – aim for 10 'no's per day. You'll get so many 'yes's along the way that you'll never hit it!"
      },
      {
        id: "10-2",
        title: "The Power Hour Routine",
        duration: "7 min",
        content: "How you start your day determines how your day goes. Let's design a power hour that sets you up for success every single morning.",
        keyPoints: [
          "15 min: Review goals and visualize success",
          "15 min: Skill sharpening (training, scripts, role play)",
          "15 min: Hot leads – contact your warmest prospects",
          "15 min: New outreach – plant seeds for tomorrow"
        ],
        proTip: "Protect your power hour like a meeting with a VIP. Because it is – the VIP is your future self!"
      },
      {
        id: "10-3",
        title: "When Motivation Fades",
        duration: "8 min",
        content: "Motivation is great, but it comes and goes. Discipline is showing up even when you don't feel like it. Let's build systems that don't depend on feeling motivated.",
        keyPoints: [
          "Connect tasks to your 'why' – the real reason you do this",
          "Use accountability partners (check in daily)",
          "Celebrate small wins – momentum matters",
          "Rest when needed – burnout is real"
        ],
        proTip: "On your lowest days, commit to just ONE task. 'I'll just make one call.' Usually, momentum takes over!"
      },
      {
        id: "10-4",
        title: "Goal Setting That Works",
        duration: "7 min",
        content: "Dreams without deadlines are just wishes. Let's set goals that excite you AND have clear paths to achievement.",
        keyPoints: [
          "Annual: Big picture vision (income, lifestyle, team size)",
          "Monthly: Milestones that build toward annual",
          "Weekly: Actions required to hit monthly",
          "Daily: Non-negotiables that move the needle"
        ],
        proTip: "Write goals in present tense: 'I earn $5,000/month' not 'I want to earn.' Your brain believes what you tell it!"
      }
    ],
    quiz: { questions: 12, passingScore: 80 },
    certificate: true,
    funFact: "Ambassadors who complete mindset training have 50% higher retention rates!"
  },
  {
    id: 11,
    title: "Event Marketing Mastery 🎪",
    tagline: "Turn local events into lead goldmines",
    description: "Community events, trade shows, farmers markets – they're all opportunities! Learn to work events like a pro and walk away with a stack of quality leads.",
    duration: "35 min",
    category: "Skills",
    difficulty: "Intermediate",
    icon: TrendingUp,
    color: "bg-gradient-to-br from-indigo-500 to-blue-600",
    objectives: [
      "Choose the right events for maximum ROI",
      "Set up an engaging booth or table",
      "Start conversations naturally with strangers",
      "Capture and follow up on event leads"
    ],
    lessons: [
      {
        id: "11-1",
        title: "Picking Your Events",
        duration: "8 min",
        content: "Not all events are created equal! Some are goldmines, others are time sinks. Let's learn to identify the winners.",
        keyPoints: [
          "Home & garden shows: perfect for home services",
          "Senior centers: great for tech support, security",
          "Community festivals: high volume, diverse crowd",
          "HOA meetings: captive audience of homeowners"
        ],
        proTip: "Ask: 'Will my ideal customers be there?' If the answer isn't a clear yes, skip it!"
      },
      {
        id: "11-2",
        title: "Your Setup: First Impressions",
        duration: "8 min",
        content: "Your booth has 3 seconds to catch attention. Let's make them count! A great setup doesn't need to be expensive – just intentional.",
        keyPoints: [
          "Eye-catching banner with clear benefit (not just logo)",
          "Interactive element: tablet demo, giveaway wheel",
          "Professional appearance: tablecloth, neat display",
          "YOU: standing in front, not hiding behind the table"
        ],
        proTip: "Stand beside your table, not behind it. Barriers = fewer conversations!"
      },
      {
        id: "11-3",
        title: "The 10-Second Hook",
        duration: "10 min",
        content: "People walking by are thinking 'What's in it for me?' Answer that question in 10 seconds and you've got a conversation.",
        keyPoints: [
          "Hook example: 'Want a free security check? Takes 30 seconds!'",
          "Hook example: 'Homeowner? Let me show you something cool about your neighborhood'",
          "Avoid: 'Can I help you?' (easy to say no)",
          "Make it about THEM, not you"
        ],
        proTip: "Practice your hook 100 times before the event. It should feel as natural as saying your name!"
      },
      {
        id: "11-4",
        title: "Lead Capture That Works",
        duration: "9 min",
        content: "A stack of business cards does you no good. Let's build a system that captures leads in a follow-up-friendly way.",
        keyPoints: [
          "Use a tablet or phone – enter leads directly to portal",
          "Minimal info needed: name, phone, interest area",
          "Ask permission: 'Mind if I follow up with more info?'",
          "Make notes: 'Roof 10 years old, considering solar'"
        ],
        proTip: "Text them DURING the event: 'Great meeting you at the fair! – [Your name]' Now they have your number too!"
      }
    ],
    quiz: { questions: 12, passingScore: 80 },
    certificate: true,
    funFact: "Top event ambassadors average 40+ leads per event!"
  },
  {
    id: 12,
    title: "The Heart of Service ❤️",
    tagline: "Why we do what we do",
    description: "At the end of the day, we're here to help people. This module is about remembering the 'why' – the difference we make in real people's lives.",
    duration: "20 min",
    category: "Leadership",
    difficulty: "Beginner",
    icon: Heart,
    color: "bg-gradient-to-br from-rose-500 to-pink-600",
    objectives: [
      "Reconnect with your purpose and passion",
      "Understand the real impact we have on customers",
      "Build authentic relationships that last",
      "Find joy in the journey"
    ],
    lessons: [
      {
        id: "12-1",
        title: "More Than a Transaction",
        duration: "7 min",
        content: "Every lead is a person with hopes, worries, and a story. When we remember that, everything changes. This isn't about sales – it's about service.",
        keyPoints: [
          "Behind every home service need is a family",
          "Behind every security concern is peace of mind",
          "Behind every tech struggle is someone wanting to connect",
          "We're solving real problems, not just selling products"
        ],
        proTip: "Before every call, take 3 seconds to think: 'How can I genuinely help this person today?'"
      },
      {
        id: "12-2",
        title: "Stories That Inspire",
        duration: "7 min",
        content: "Real stories from real ambassadors and customers. These are the moments that remind us why this work matters.",
        keyPoints: [
          "The grandmother who now video chats with grandkids daily",
          "The family who felt safe again after a break-in scare",
          "The couple who saved $4,000 on roof repair by acting early",
          "The veteran who found his long-lost military buddy"
        ],
        proTip: "Start collecting YOUR stories. They're the most powerful sales tools you'll ever have!"
      },
      {
        id: "12-3",
        title: "Playing the Long Game",
        duration: "6 min",
        content: "Careers are built on relationships, not transactions. The ambassadors who last are the ones who genuinely care – and it shows.",
        keyPoints: [
          "Happy customers become repeat customers",
          "Repeat customers become referral sources",
          "Referral sources become your biggest advocates",
          "Advocacy builds businesses that last decades"
        ],
        proTip: "Send birthday messages, anniversary notes, holiday cards. The little things become the big things!"
      }
    ],
    quiz: { questions: 8, passingScore: 100 },
    certificate: true,
    funFact: "Ambassadors who score highest in 'service mindset' have the highest customer satisfaction AND income!"
  }
];

export const getModulesByCategory = (category: string) => 
  trainingModules.filter(m => m.category === category);

export const getTotalDuration = () => {
  let minutes = 0;
  trainingModules.forEach(m => {
    const match = m.duration.match(/(\d+)/);
    if (match) minutes += parseInt(match[1]);
  });
  return `${Math.floor(minutes / 60)}h ${minutes % 60}min`;
};

export const categories = [
  { name: "Onboarding", description: "Get started on the right foot" },
  { name: "Products", description: "Know what you're selling" },
  { name: "Skills", description: "Level up your abilities" },
  { name: "Tools", description: "Master your portal" },
  { name: "Leadership", description: "Build your team" },
  { name: "Compliance", description: "Stay safe and ethical" },
];
