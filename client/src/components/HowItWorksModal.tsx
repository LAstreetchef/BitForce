import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  MessageSquare,
  Search,
  Sparkles,
  CheckCircle,
  ArrowDown,
  Home,
  Wallet,
  Heart,
  Lightbulb,
  Target
} from "lucide-react";

interface HowItWorksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const aiSteps = [
  {
    step: 1,
    icon: MessageSquare,
    title: "Smart Questionnaire",
    description: "Our AI-powered questionnaire asks the right questions to understand each customer's unique situation - their property needs, financial goals, and what matters most to their family.",
    detail: "No more guesswork. The system learns from thousands of successful matches to ask precisely what's needed."
  },
  {
    step: 2,
    icon: Brain,
    title: "Intelligent Analysis",
    description: "Advanced AI analyzes responses in real-time, identifying patterns and needs that might not be immediately obvious - even to the customer themselves.",
    detail: "The AI considers factors like property age, family size, budget flexibility, and long-term goals."
  },
  {
    step: 3,
    icon: Search,
    title: "Perfect Service Matching",
    description: "Our system cross-references customer needs against our complete service catalog to find the ideal combination of services for their situation.",
    detail: "It prioritizes services that deliver the most value and identifies bundles that save money."
  },
  {
    step: 4,
    icon: Sparkles,
    title: "Personalized Recommendations",
    description: "Customers receive tailored recommendations with clear explanations of why each service benefits them specifically - not generic sales pitches.",
    detail: "Every suggestion is backed by data showing how it addresses their stated needs."
  }
];

const customerOutcomes = [
  {
    icon: Home,
    title: "Property Protection",
    description: "AI identifies maintenance needs before they become expensive emergencies, helping customers protect their biggest investment."
  },
  {
    icon: Wallet,
    title: "Smarter Spending",
    description: "Customers only pay for services they actually need, with bundle recommendations that maximize value for their budget."
  },
  {
    icon: Heart,
    title: "Family Well-being",
    description: "From home safety improvements to digital tools that simplify life, AI ensures nothing important gets overlooked."
  }
];

export function HowItWorksModal({ open, onOpenChange }: HowItWorksModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="modal-how-it-works">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-6 h-6 text-blue-500" />
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              AI-Powered Platform
            </Badge>
          </div>
          <DialogTitle className="text-2xl" data-testid="text-modal-title">
            How Our AI Delivers Superior Service
          </DialogTitle>
          <DialogDescription data-testid="text-modal-description">
            A step-by-step look at how our platform uses artificial intelligence to provide customers with exactly what they need
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-lg" data-testid="text-process-section-title">The AI Process</h3>
            </div>

            <div className="space-y-4">
              {aiSteps.map((step, index) => {
                const IconComponent = step.icon;
                const isLast = index === aiSteps.length - 1;
                return (
                  <div key={step.step} data-testid={`step-${step.step}`}>
                    <Card className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <IconComponent className="w-5 h-5 text-blue-600" />
                            <h4 className="font-semibold text-lg">{step.title}</h4>
                          </div>
                          <p className="text-muted-foreground mb-2">{step.description}</p>
                          <div className="flex items-start gap-2 text-sm bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                            <Lightbulb className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                            <span className="text-blue-800 dark:text-blue-300">{step.detail}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                    {!isLast && (
                      <div className="flex justify-center py-2">
                        <ArrowDown className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <div className="border-t pt-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-lg" data-testid="text-outcomes-section-title">The Result: Superior Customer Outcomes</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {customerOutcomes.map((outcome, index) => {
                const IconComponent = outcome.icon;
                return (
                  <Card 
                    key={outcome.title} 
                    className="p-4 text-center"
                    data-testid={`outcome-${index}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                      <IconComponent className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h4 className="font-semibold mb-1">{outcome.title}</h4>
                    <p className="text-sm text-muted-foreground">{outcome.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-5" data-testid="section-summary">
            <div className="flex items-start gap-4">
              <Sparkles className="w-8 h-8 text-blue-500 shrink-0" />
              <div>
                <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-1">
                  Why AI Makes the Difference
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  Traditional sales approaches rely on guesswork and generic recommendations. Our AI platform ensures every customer receives personalized service recommendations based on their actual needs - not assumptions. This means happier customers, better outcomes, and services that truly improve their lives, property, and family well-being.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
