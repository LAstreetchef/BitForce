import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Clock, 
  TrendingUp, 
  Brain, 
  Home, 
  Heart, 
  Shield, 
  Sparkles,
  Target,
  Users,
  CheckCircle,
  ArrowRight
} from "lucide-react";

interface HowItWorksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ambassadorBenefits = [
  {
    icon: Clock,
    title: "Save Hours Every Day",
    description: "AI analyzes customer needs in seconds, not hours. Spend less time qualifying and more time closing deals."
  },
  {
    icon: Target,
    title: "Perfect Service Matching",
    description: "Our AI identifies exactly which services each customer needs based on their unique situation."
  },
  {
    icon: TrendingUp,
    title: "Maximize Your Income",
    description: "AI suggests high-value service bundles you might miss, increasing your average sale by 40%."
  },
  {
    icon: Users,
    title: "Build Stronger Relationships",
    description: "Provide genuinely helpful recommendations that customers appreciate, leading to more referrals."
  }
];

const customerBenefits = [
  {
    icon: Home,
    title: "Better Property Care",
    description: "AI identifies maintenance needs before they become costly problems, protecting their biggest investment."
  },
  {
    icon: Shield,
    title: "Smart Financial Decisions",
    description: "Get matched with financing options and services that truly fit their budget and goals."
  },
  {
    icon: Heart,
    title: "Care for Loved Ones",
    description: "Discover services that improve quality of life for their family, from home safety to digital assistance."
  },
  {
    icon: Sparkles,
    title: "Access to Innovation",
    description: "Bring cutting-edge AI tools and digital services to customers who might not know they exist."
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
              AI-Powered
            </Badge>
          </div>
          <DialogTitle className="text-2xl" data-testid="text-modal-title">
            How Our AI Works For You
          </DialogTitle>
          <DialogDescription data-testid="text-modal-description">
            Advanced technology that benefits everyone in the process
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 mt-4">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg" data-testid="text-ambassador-section-title">For You, The Ambassador</h3>
                <p className="text-sm text-muted-foreground">Work smarter, earn more</p>
              </div>
            </div>

            <div className="grid gap-3">
              {ambassadorBenefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <Card 
                    key={benefit.title} 
                    className="p-4"
                    data-testid={`card-ambassador-benefit-${index}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                        <IconComponent className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{benefit.title}</h4>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <div className="flex-1 h-px bg-border" />
            <ArrowRight className="w-5 h-5" />
            <span className="text-sm font-medium">While Helping Customers</span>
            <ArrowRight className="w-5 h-5" />
            <div className="flex-1 h-px bg-border" />
          </div>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg" data-testid="text-customer-section-title">For Your Customers</h3>
                <p className="text-sm text-muted-foreground">Better their life, property, and loved ones</p>
              </div>
            </div>

            <div className="grid gap-3">
              {customerBenefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <Card 
                    key={benefit.title} 
                    className="p-4"
                    data-testid={`card-customer-benefit-${index}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                        <IconComponent className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{benefit.title}</h4>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-5" data-testid="section-summary">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-8 h-8 text-blue-500 shrink-0" />
              <div>
                <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-1">
                  Everyone Wins With AI
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  You save time and earn more. Your customers get personalized recommendations that truly improve their lives. 
                  It's not just technology - it's a better way to connect people with solutions they actually need.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
