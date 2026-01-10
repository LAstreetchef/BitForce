import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Mail,
  Brain,
  Wrench,
  DollarSign,
  Users,
  UserPlus,
  MessageSquare,
  Rocket,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Target,
  Shield,
  Search,
  MapPin,
  Cloud,
  Home,
  ArrowRight,
} from "lucide-react";
import { Link } from "wouter";

import ambassadorBuddy from "@assets/bitforcebuddy_1768035690553.png";
import toolAiAssistant from "@assets/Screenshot_2026-01-09_153919_1768035729424.png";
import toolSecurityCheck from "@assets/Screenshot_2026-01-09_153928_1768035729423.png";
import toolFriendFinder from "@assets/Screenshot_2026-01-09_153937_1768035729423.png";
import toolPropertyLookup from "@assets/Screenshot_2026-01-09_153951_1768035729423.png";
import toolIntelligence from "@assets/Screenshot_2026-01-09_154003_1768035729422.png";
import trainingModal from "@assets/Screenshot_2026-01-09_152341_1768035729424.png";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: any;
  color: string;
  buddyMessage: string;
  payout?: string;
  payoutDesc?: string;
  tools?: { image: string; name: string }[];
}

const steps: Step[] = [
  {
    id: 1,
    title: "Upload Your Contacts",
    description: "Import your phone contacts, email lists, or social connections. The more contacts you add, the more opportunities you'll have to earn.",
    icon: Upload,
    color: "from-blue-500 to-cyan-500",
    buddyMessage: "Start with people you know - they already trust you!",
    payout: "$0",
    payoutDesc: "Foundation step",
  },
  {
    id: 2,
    title: "Send Product Questionnaire",
    description: "Send your contacts our AI-powered product questionnaire. It identifies their needs for home security, digital services, and AI tools automatically.",
    icon: Mail,
    color: "from-purple-500 to-violet-500",
    buddyMessage: "Our smart questionnaire does the selling for you!",
    payout: "$25-50",
    payoutDesc: "Per qualified lead",
  },
  {
    id: 3,
    title: "Review AI Product Suggestions",
    description: "BitForce AI analyzes responses and suggests the perfect products for each contact. No guesswork - just smart, personalized recommendations.",
    icon: Brain,
    color: "from-emerald-500 to-teal-500",
    buddyMessage: "AI makes you look like a genius!",
    tools: [
      { image: toolAiAssistant, name: "AI Assistant" },
    ],
    payout: "$50-150",
    payoutDesc: "Per sale closed",
  },
  {
    id: 4,
    title: "Use Powerful AI Tools",
    description: "Leverage our suite of AI tools - Security Risk Check, Property Lookup, Friend Finder, and Intelligence tools - to offer more value and close more sales.",
    icon: Wrench,
    color: "from-orange-500 to-amber-500",
    buddyMessage: "These tools give you superpowers!",
    tools: [
      { image: toolSecurityCheck, name: "Security Check" },
      { image: toolFriendFinder, name: "Friend Finder" },
      { image: toolPropertyLookup, name: "Property Lookup" },
      { image: toolIntelligence, name: "Intelligence Suite" },
    ],
    payout: "$100-300",
    payoutDesc: "With upsells",
  },
  {
    id: 5,
    title: "Get Paid!",
    description: "Earn commissions on every sale. Get paid weekly via direct deposit. Track your earnings in real-time through your dashboard.",
    icon: DollarSign,
    color: "from-green-500 to-emerald-500",
    buddyMessage: "Cha-ching! This is the fun part!",
    payout: "$500-2,000",
    payoutDesc: "First month potential",
  },
  {
    id: 6,
    title: "Identify Future Ambassadors",
    description: "Look for customers who love the products and have great people skills. They could be your next team members earning you passive income.",
    icon: Users,
    color: "from-pink-500 to-rose-500",
    buddyMessage: "Your customers can become your team!",
    payout: "$50",
    payoutDesc: "Referral bonus each",
  },
  {
    id: 7,
    title: "Send Ambassador Onboarding",
    description: "Invite promising contacts to join BitForce. Send them the ambassador onboarding email and share your success story.",
    icon: UserPlus,
    color: "from-indigo-500 to-purple-500",
    buddyMessage: "Build your empire one ambassador at a time!",
    tools: [
      { image: trainingModal, name: "Training Program" },
    ],
    payout: "20%",
    payoutDesc: "Override on their sales",
  },
  {
    id: 8,
    title: "Follow Up & Scale",
    description: "Use BitForce AI communication tools to nurture leads, onboard ambassadors, and scale your business. Automation does the heavy lifting.",
    icon: MessageSquare,
    color: "from-cyan-500 to-blue-500",
    buddyMessage: "Now you're building real passive income!",
    payout: "$5,000+",
    payoutDesc: "Monthly with team",
  },
];

function AmbassadorBuddy({ message, visible }: { message: string; visible: boolean }) {
  if (!visible) return null;
  
  return (
    <motion.div
      className="fixed bottom-24 right-4 md:right-8 z-50 pointer-events-none"
      initial={{ opacity: 0, x: 150, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 150, scale: 0.8 }}
      transition={{ type: "spring", damping: 15, stiffness: 200 }}
    >
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -left-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl px-4 py-3 shadow-xl border-2 border-white/30 max-w-[200px]"
        >
          <span className="text-white text-sm font-bold drop-shadow-sm whitespace-normal">{message}</span>
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-purple-600" />
        </motion.div>
        
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full blur-lg opacity-60 animate-pulse" />
          <div className="relative w-24 h-28 md:w-28 md:h-32 overflow-hidden rounded-t-full rounded-b-3xl border-4 border-white/50 shadow-2xl bg-gradient-to-b from-slate-800 to-slate-900">
            <img src={ambassadorBuddy} alt="Ambassador Buddy" className="w-full h-full object-cover object-top" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function PayoutCard({ payout, description }: { payout: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-4 text-center"
    >
      <div className="flex items-center justify-center gap-2 mb-1">
        <DollarSign className="w-5 h-5 text-green-400" />
        <span className="text-2xl md:text-3xl font-bold text-green-400">{payout}</span>
      </div>
      <p className="text-sm text-green-300/80">{description}</p>
    </motion.div>
  );
}

function ToolShowcase({ tools }: { tools: { image: string; name: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {tools.map((tool, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}
          className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover-elevate"
        >
          <img 
            src={tool.image} 
            alt={tool.name} 
            className="w-full h-auto object-cover"
          />
          <div className="p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <p className="text-white font-medium text-center">{tool.name}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function EarningsMilestones() {
  const milestones = [
    { month: "Month 1", amount: "$500-2,000", desc: "First sales", icon: Rocket },
    { month: "Month 3", amount: "$2,000-5,000", desc: "Building momentum", icon: TrendingUp },
    { month: "Month 6", amount: "$5,000-10,000", desc: "Team growing", icon: Users },
    { month: "Year 1", amount: "$10,000+", desc: "Passive income", icon: Sparkles },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-green-400" />
        Earning Milestones
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {milestones.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="text-center p-4 bg-white/5 rounded-xl border border-white/10"
          >
            <m.icon className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-xs text-white/60">{m.month}</p>
            <p className="text-lg font-bold text-green-400">{m.amount}</p>
            <p className="text-xs text-white/50">{m.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StepContent({ step }: { step: Step }) {
  const Icon = step.icon;
  
  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-start gap-4">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shrink-0`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div>
          <Badge className="mb-2 bg-white/10 text-white/80">Step {step.id} of {steps.length}</Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-white">{step.title}</h2>
        </div>
      </div>
      
      <p className="text-lg text-white/80 leading-relaxed">{step.description}</p>
      
      {step.payout && (
        <PayoutCard payout={step.payout} description={step.payoutDesc || ""} />
      )}
      
      {step.tools && <ToolShowcase tools={step.tools} />}
      
      {step.id === 5 && <EarningsMilestones />}
    </motion.div>
  );
}

function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
            i < currentStep
              ? "bg-green-500"
              : i === currentStep
              ? "bg-blue-500"
              : "bg-white/20"
          }`}
        />
      ))}
    </div>
  );
}

function StepNavigation({ steps, currentStep, onStepClick }: { steps: Step[]; currentStep: number; onStepClick: (i: number) => void }) {
  return (
    <div className="hidden lg:block">
      <div className="space-y-2">
        {steps.map((step, i) => (
          <button
            key={step.id}
            onClick={() => onStepClick(i)}
            className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${
              i === currentStep
                ? "bg-white/10 border border-white/20"
                : i < currentStep
                ? "bg-green-500/10 border border-green-500/20"
                : "bg-white/5 border border-transparent hover:bg-white/10"
            }`}
            data-testid={`button-step-${step.id}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              i < currentStep
                ? "bg-green-500"
                : i === currentStep
                ? `bg-gradient-to-br ${step.color}`
                : "bg-white/10"
            }`}>
              {i < currentStep ? (
                <CheckCircle2 className="w-4 h-4 text-white" />
              ) : (
                <step.icon className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${
                i === currentStep ? "text-white" : "text-white/70"
              }`}>
                {step.title}
              </p>
              {step.payout && (
                <p className="text-xs text-green-400">{step.payout}</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function NextStep() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" data-testid="page-nextstep">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="text-white/70 hover:text-white" data-testid="button-back-home">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            <Rocket className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold text-white">Your First Steps</span>
          </div>
          
          <Link href="/portal">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600" data-testid="button-portal">
              Go to Portal
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Badge className="bg-green-500/20 text-green-400 mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Your Earning Journey
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Start Earning as a BitForce Ambassador
          </h1>
          <p className="text-white/60">Follow these steps to unlock your income potential</p>
        </div>

        <div className="mb-6">
          <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <StepNavigation steps={steps} currentStep={currentStep} onStepClick={setCurrentStep} />
          </div>

          <div className="lg:col-span-3">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  <StepContent step={step} />
                </AnimatePresence>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                  <Button
                    variant="outline"
                    onClick={goPrev}
                    disabled={currentStep === 0}
                    className="text-white border-white/30 hover:bg-white/10 disabled:opacity-30"
                    data-testid="button-prev"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep < steps.length - 1 ? (
                    <Button
                      onClick={goNext}
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                      data-testid="button-next"
                    >
                      Next Step
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Link href="/portal">
                      <Button
                        className="bg-gradient-to-r from-green-600 to-emerald-600"
                        data-testid="button-start-earning"
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        Start Earning Now!
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <Target className="w-6 h-6 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Pro Tip</h4>
                  <p className="text-white/70 text-sm">
                    {currentStep === 0 && "Start with at least 50 contacts. More contacts = more opportunities!"}
                    {currentStep === 1 && "Personalize your outreach message. A personal touch increases responses by 3x!"}
                    {currentStep === 2 && "Trust the AI suggestions - they're based on proven buying patterns."}
                    {currentStep === 3 && "The Security Check tool is a conversation starter. Everyone wants to know if their data is safe."}
                    {currentStep === 4 && "Set up direct deposit for fastest payouts. Commissions hit your account every Friday!"}
                    {currentStep === 5 && "Look for customers who ask great questions - they often make the best ambassadors."}
                    {currentStep === 6 && "Share your first commission story. Success stories inspire action!"}
                    {currentStep === 7 && "Schedule 15-minute check-ins with your team. Small investments, big returns."}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        <AmbassadorBuddy message={step.buddyMessage} visible={true} />
      </AnimatePresence>
    </div>
  );
}
