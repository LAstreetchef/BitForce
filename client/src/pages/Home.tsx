import { useState } from "react";
import bitforceLogo from "@assets/Bitforce_1767872339442.jpg";
import { services } from "@/data/services";
import { ServiceCard } from "@/components/ServiceCard";
import { HowItWorksModal } from "@/components/HowItWorksModal";
import { TestimonialBanner } from "@/components/TestimonialBanner";
import { useAuth } from "@/hooks/use-auth";
import { 
  Loader2, 
  Sparkles, 
  CheckCircle,
  Shield, 
  Globe,
  Clock, 
  Star,
  ClipboardList,
  DollarSign,
  Brain,
  LogOut,
  LogIn,
  Zap,
  Timer,
  Gift,
  Wallet,
  TrendingUp,
  Award,
  Crown,
  Rocket,
  RefreshCcw,
  Calculator,
  Infinity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";

import successImage1 from "@assets/stock_images/person_celebrating_w_0451e351.jpg";
import lifestyleImage from "@assets/stock_images/luxury_lifestyle_fre_2fd5a4a6.jpg";
import teamImage from "@assets/stock_images/successful_business__b630fb27.jpg";

const serviceCommissions = [
  { service: "Roofing Projects", avgSale: "$3,000", commission: "$450", rate: "15%" },
  { service: "Driveway Paving", avgSale: "$2,500", commission: "$375", rate: "15%" },
  { service: "Plumbing Services", avgSale: "$800", commission: "$120", rate: "15%" },
  { service: "AI Assistant Setup", avgSale: "$500", commission: "$100", rate: "20%" },
  { service: "Document Digitizing", avgSale: "$300", commission: "$60", rate: "20%" },
  { service: "Home Financing", avgSale: "$5,000", commission: "$1,250", rate: "25%" },
  { service: "Premium Bundle", avgSale: "$8,000", commission: "$2,400", rate: "30%" },
];

const passiveIncomeStacks = [
  { referrals: 5, monthly: "$20", yearly: "$240", icon: Star },
  { referrals: 10, monthly: "$40", yearly: "$480", icon: Award },
  { referrals: 25, monthly: "$100", yearly: "$1,200", icon: Crown },
  { referrals: 50, monthly: "$200", yearly: "$2,400", icon: Rocket },
  { referrals: 100, monthly: "$400", yearly: "$4,800", icon: Infinity },
];

const successStories = [
  { 
    name: "Marcus T.", 
    location: "Atlanta, GA",
    earnings: "$8,400",
    period: "Last Month",
    quote: "I started part-time and now I'm earning more than my old 9-5!",
    sales: 24,
    recruits: 12
  },
  { 
    name: "Sarah M.", 
    location: "Houston, TX",
    earnings: "$47,000",
    period: "Last Quarter",
    quote: "The passive income from my team is incredible - I earn while I sleep!",
    sales: 89,
    recruits: 35
  },
  { 
    name: "David K.", 
    location: "Phoenix, AZ",
    earnings: "$112,000",
    period: "This Year",
    quote: "From side hustle to six figures. The referral bonuses changed everything.",
    sales: 245,
    recruits: 78
  },
];

export default function Home() {
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [calculatorReferrals, setCalculatorReferrals] = useState([10]);
  const { isAuthenticated, isLoading: authLoading, logout, isLoggingOut } = useAuth();

  const instantBonus = calculatorReferrals[0] * 50;
  const monthlyPassive = calculatorReferrals[0] * 4;
  const yearlyPassive = monthlyPassive * 12;

  const handleMembershipClick = () => {
    alert("Premium Membership signup coming soon! We're putting the finishing touches on our exclusive portal.");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={bitforceLogo} 
              alt="Bitforce AI Buddies" 
              className="w-8 h-8 rounded-lg object-cover"
              data-testid="img-logo"
            />
            <span className="font-display font-bold text-xl text-slate-900 tracking-tight">
              Bit Force
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="/portal" className="hover:text-blue-600 transition-colors" data-testid="link-portal">Ambassador Portal</a>
            <a href="/events" className="hover:text-blue-600 transition-colors" data-testid="link-events">Events</a>
            <a href="/explainer" className="hover:text-blue-600 transition-colors" data-testid="link-how-it-works">How It Works</a>
            <a href="/why-bitforce" className="hover:text-blue-600 transition-colors" data-testid="link-why-bitforce">Why BitForce</a>
            <a href="/calculator" className="hover:text-blue-600 transition-colors" data-testid="link-calculator">Calculator</a>
          </nav>
          <div className="flex items-center gap-2">
            {authLoading ? (
              <Button variant="ghost" size="sm" disabled>
                <Loader2 className="w-4 h-4 animate-spin" />
              </Button>
            ) : isAuthenticated ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => logout()}
                disabled={isLoggingOut}
                data-testid="button-logout"
              >
                {isLoggingOut ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4 mr-2" />
                )}
                <span className="hidden sm:inline">Log Out</span>
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-login"
              >
                <LogIn className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Log In</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <TestimonialBanner />

      <HowItWorksModal
        open={showHowItWorksModal}
        onOpenChange={setShowHowItWorksModal}
      />

      <main>
        {/* Hero Section */}
        <section className="relative py-12 lg:py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/hero-bg.jpg"
              alt="Community event"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-slate-900/60"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              
              {/* Left Column: Content */}
              <div className="text-white space-y-6 pt-6">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 font-medium text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>AI-Powered Lead Analysis</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHowItWorksModal(true)}
                    className="text-blue-300 border border-blue-400/30 bg-blue-500/10"
                    data-testid="button-how-it-works"
                  >
                    <Brain className="w-4 h-4 mr-1" />
                    How It Works
                  </Button>
                </div>
                <h1 className="text-4xl lg:text-6xl font-display font-bold leading-tight text-white">
                  BitForce Ambassador <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                    Portal
                  </span>
                </h1>
                <p className="text-2xl text-slate-300 max-w-lg leading-relaxed font-semibold">
                  Learn AI. Get Paid. Empower Your Community.
                </p>
                
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold">Fast Intake</h4>
                      <p className="text-sm text-slate-400">Sub-minute processing</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                      <Shield className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold">Secure Data</h4>
                      <p className="text-sm text-slate-400">Enterprise encryption</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Ambassador CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 lg:p-8 shadow-2xl shadow-blue-900/20"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ClipboardList className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">BitForce Ambassador Portal</h2>
                  <p className="text-slate-500">
                    Access our AI-powered lead intake tools, track customers, and grow your business.
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
                    <span className="text-slate-700">AI-powered service recommendations</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600 shrink-0" />
                    <span className="text-slate-700">Earn commissions on every sale</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Brain className="w-5 h-5 text-purple-600 shrink-0" />
                    <span className="text-slate-700">Free AI training & resources</span>
                  </div>
                </div>

                {isAuthenticated ? (
                  <Button 
                    onClick={() => window.location.href = "/portal"}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-semibold shadow-lg shadow-blue-600/20"
                    data-testid="button-go-to-portal"
                  >
                    Go to Portal
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Button 
                      onClick={() => window.location.href = "/api/login"}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-semibold shadow-lg shadow-blue-600/20"
                      data-testid="button-login-portal"
                    >
                      <LogIn className="w-5 h-5 mr-2" />
                      Log In to Portal
                    </Button>
                    <p className="text-center text-sm text-slate-500">
                      New here? Login to start your ambassador journey
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Ambassador Earnings Section */}
        <section id="earnings" className="py-16 bg-white" data-testid="section-earnings">
          <div className="container mx-auto px-4">
            {/* Hero Banner */}
            <div 
              className="relative h-56 bg-cover bg-center rounded-2xl overflow-hidden mb-8"
              style={{ backgroundImage: `url(${successImage1})` }}
              data-testid="section-hero-banner"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-900/95 via-emerald-800/90 to-transparent" />
              <div className="absolute inset-0 flex items-center p-8">
                <div className="text-white max-w-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <span className="text-emerald-300 font-medium">New Hybrid Program</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-3" data-testid="text-hero-title">
                    Turn Your Network Into Passive Income
                  </h2>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                      <div className="text-sm text-emerald-200">One-time Entry</div>
                      <div className="text-2xl font-bold text-white">$29</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                      <div className="text-sm text-emerald-200">Monthly Access</div>
                      <div className="text-2xl font-bold text-white">$19.99</div>
                    </div>
                    <div className="bg-yellow-400/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-yellow-400/40">
                      <div className="text-sm text-yellow-200">Per Referral</div>
                      <div className="text-2xl font-bold text-yellow-300">$50+</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Content */}
            <Tabs defaultValue="program" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="program" data-testid="tab-program">
                  <Rocket className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Program</span>
                </TabsTrigger>
                <TabsTrigger value="passive" data-testid="tab-passive">
                  <RefreshCcw className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Passive</span>
                </TabsTrigger>
                <TabsTrigger value="commissions" data-testid="tab-commissions">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Sales</span>
                </TabsTrigger>
                <TabsTrigger value="success" data-testid="tab-success">
                  <Star className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Success</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="program" className="space-y-6" data-testid="content-program">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">The Bit Force Ambassador Program</h3>
                  <p className="text-muted-foreground">Low barrier. High reward. Sustainable passive income.</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <DollarSign className="w-8 h-8" />
                      </div>
                      <div className="text-3xl font-bold mb-1">$29</div>
                      <div className="text-emerald-100">One-Time Sign Up</div>
                      <div className="text-sm text-emerald-200 mt-2">Training, dashboard, tools</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Timer className="w-8 h-8" />
                      </div>
                      <div className="text-3xl font-bold mb-1">$19.99</div>
                      <div className="text-emerald-100">Monthly Subscription</div>
                      <div className="text-sm text-emerald-200 mt-2">Leads, community, support</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-yellow-400/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Gift className="w-8 h-8 text-yellow-300" />
                      </div>
                      <div className="text-3xl font-bold mb-1 text-yellow-300">$50</div>
                      <div className="text-emerald-100">Per Qualified Referral</div>
                      <div className="text-sm text-emerald-200 mt-2">+ $4/mo passive forever</div>
                    </div>
                  </div>
                </div>

                <Card className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-4">
                    <Zap className="w-10 h-10 text-amber-500 shrink-0" />
                    <div>
                      <h4 className="font-bold text-lg text-amber-900 dark:text-amber-200 mb-2">
                        Break Even With Just ONE Referral!
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div className="bg-white dark:bg-amber-900/30 rounded-lg p-3">
                          <div className="text-amber-700 dark:text-amber-300 font-medium mb-1">Your Investment</div>
                          <div className="text-lg font-bold text-amber-900 dark:text-amber-100">$29 + $19.99 = $49</div>
                        </div>
                        <div className="bg-white dark:bg-amber-900/30 rounded-lg p-3">
                          <div className="text-amber-700 dark:text-amber-300 font-medium mb-1">Your First Referral</div>
                          <div className="text-lg font-bold text-green-600">+$50 instant bonus</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3 text-amber-800 dark:text-amber-300">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">You're already profitable from day one!</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Card className="p-5">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      What's Included
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        Complete training and onboarding
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        Personal ambassador dashboard
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        Exclusive leads and prospects
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        Marketing materials and templates
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        Private community access
                      </li>
                    </ul>
                  </Card>
                  <Card className="p-5">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-blue-500" />
                      How You Earn
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        <strong>$50 instant</strong> per qualified referral
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        <strong>20% override</strong> (~$4/mo per referral)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        15-30% commission on all sales
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        No cap on earnings - ever
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        Weekly payouts via PayPal/Stripe
                      </li>
                    </ul>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="passive" className="space-y-6" data-testid="content-passive">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Build Your Passive Income Empire</h3>
                  <p className="text-muted-foreground">Every referral adds $4/month to your recurring income - forever</p>
                </div>

                <Card className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3 mb-4">
                    <Calculator className="w-6 h-6 text-purple-600" />
                    <h4 className="font-bold text-lg">Interactive Earnings Calculator</h4>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Number of Active Referrals</span>
                      <span className="font-bold text-xl text-purple-600">{calculatorReferrals[0]}</span>
                    </div>
                    <Slider
                      value={calculatorReferrals}
                      onValueChange={setCalculatorReferrals}
                      min={1}
                      max={100}
                      step={1}
                      className="w-full"
                      data-testid="slider-referrals"
                    />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-purple-900/30 rounded-xl p-4 text-center">
                      <Gift className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground mb-1">Instant Bonuses</div>
                      <div className="text-3xl font-bold text-green-600" data-testid="text-instant-bonus">${instantBonus.toLocaleString()}</div>
                    </div>
                    <div className="bg-white dark:bg-purple-900/30 rounded-xl p-4 text-center">
                      <RefreshCcw className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground mb-1">Monthly Passive</div>
                      <div className="text-3xl font-bold text-blue-600" data-testid="text-monthly-passive">${monthlyPassive}/mo</div>
                    </div>
                    <div className="bg-white dark:bg-purple-900/30 rounded-xl p-4 text-center">
                      <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground mb-1">Yearly Passive</div>
                      <div className="text-3xl font-bold text-purple-600" data-testid="text-yearly-passive">${yearlyPassive.toLocaleString()}/yr</div>
                    </div>
                  </div>
                </Card>

                <div className="text-center">
                  <h4 className="font-bold mb-4">Passive Income Milestones</h4>
                </div>
                <div className="grid gap-3">
                  {passiveIncomeStacks.map((tier) => {
                    const IconComponent = tier.icon;
                    return (
                      <Card 
                        key={tier.referrals} 
                        className="p-4 hover-elevate"
                        data-testid={`passive-tier-${tier.referrals}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shrink-0">
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold">{tier.referrals} Active Referrals</div>
                            <div className="text-sm text-muted-foreground">20% override on each</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-600">{tier.monthly}</div>
                            <div className="text-sm text-muted-foreground">{tier.yearly}/year</div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                <div className="relative rounded-xl overflow-hidden">
                  <img 
                    src={lifestyleImage} 
                    alt="Lifestyle freedom" 
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-transparent flex items-center p-6">
                    <div className="text-white">
                      <div className="font-bold text-lg">Money While You Sleep</div>
                      <p className="text-purple-200 text-sm">Your referrals keep paying - month after month</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="commissions" className="space-y-6" data-testid="content-commissions">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Commission Per Sale</h3>
                  <p className="text-muted-foreground">Plus your referral bonuses and passive income!</p>
                </div>

                <div className="space-y-3">
                  {serviceCommissions.map((item) => (
                    <Card 
                      key={item.service} 
                      className="p-4 hover-elevate"
                      data-testid={`commission-${item.service.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-[150px]">
                          <div className="font-medium">{item.service}</div>
                          <div className="text-sm text-muted-foreground">Avg. Sale: {item.avgSale}</div>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          {item.rate}
                        </Badge>
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-600">{item.commission}</div>
                          <div className="text-xs text-muted-foreground">per sale</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="relative rounded-xl overflow-hidden">
                  <img 
                    src={teamImage} 
                    alt="Successful team" 
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-transparent flex items-center p-6">
                    <div className="text-white">
                      <div className="font-bold text-lg">Higher Volume = Higher Rates</div>
                      <p className="text-blue-200 text-sm">Top performers unlock premium commission tiers up to 35%</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="success" className="space-y-6" data-testid="content-success">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Real Ambassadors, Real Results</h3>
                  <p className="text-muted-foreground">Join the success stories</p>
                </div>

                <div className="grid gap-4">
                  {successStories.map((story, index) => (
                    <Card 
                      key={story.name} 
                      className="p-5 hover-elevate"
                      data-testid={`success-story-${index}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
                          {story.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                            <div>
                              <span className="font-bold">{story.name}</span>
                              <span className="text-muted-foreground text-sm ml-2">{story.location}</span>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                {story.sales} sales
                              </Badge>
                              <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                                {story.recruits} recruits
                              </Badge>
                            </div>
                          </div>
                          <p className="text-muted-foreground text-sm italic mb-3">"{story.quote}"</p>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-green-600">{story.earnings}</span>
                            <span className="text-muted-foreground text-sm">{story.period}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Services Grid */}
        <section id="services" className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 mb-4">
                Available Services
              </h2>
              <p className="text-lg text-slate-600">
                Browse our comprehensive catalog of home and digital services.
              </p>
            </div>

            <motion.div 
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              <AnimatePresence>
                {services.map((service) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={service.id}
                  >
                    <ServiceCard 
                      service={service} 
                      isSuggested={false} 
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Premium Membership Section */}
        <section id="membership" className="py-20 bg-white border-t border-slate-200">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-sm mb-6">
                    COMING SOON
                  </div>
                  <h2 className="text-3xl lg:text-5xl font-display font-bold mb-6">
                    Premium Membership
                  </h2>
                  <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                    Join our exclusive program designed for top-tier clients. Get priority access to all services, personal consultations, and dedicated support.
                  </p>
                  <Button 
                    onClick={handleMembershipClick}
                    size="lg"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 h-14 rounded-xl text-lg shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
                  >
                    Sign Up for Membership
                  </Button>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    { icon: Star, title: "Priority Access", desc: "Skip the line for all service bookings" },
                    { icon: Globe, title: "AI Webpage", desc: "Personalized digital dashboard" },
                    { icon: CheckCircle, title: "Home Visits", desc: "Quarterly professional inspections" },
                    { icon: Shield, title: "Exclusive Offers", desc: "Member-only discounts and deals" }
                  ].map((benefit, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
                      <benefit.icon className="w-8 h-8 text-emerald-400 mb-4" />
                      <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                      <p className="text-slate-400 text-sm">{benefit.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Bit Force. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
