import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, Award, Star, Zap, Target, Home, Monitor, Wallet, Gift } from "lucide-react";

interface AmbassadorPayoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const commissionRates = [
  { category: "Home Services", rate: "15%", examples: "Roofing, Plumbing, Driveways", icon: Home },
  { category: "Digital Services", rate: "20%", examples: "AI Assistance, Document Digitizing", icon: Monitor },
  { category: "Financial Products", rate: "25%", examples: "Home Financing, Insurance", icon: Wallet },
  { category: "Premium Packages", rate: "30%", examples: "Bundled Services, VIP Memberships", icon: Gift },
];

const earningTiers = [
  { name: "Starter", sales: "1-5", bonus: "$0", color: "bg-slate-500" },
  { name: "Rising Star", sales: "6-15", bonus: "$100", color: "bg-blue-500" },
  { name: "Power Seller", sales: "16-30", bonus: "$350", color: "bg-purple-500" },
  { name: "Elite Ambassador", sales: "31+", bonus: "$750+", color: "bg-amber-500" },
];

export function AmbassadorPayoutModal({ open, onOpenChange }: AmbassadorPayoutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-ambassador-payout">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <DollarSign className="w-6 h-6 text-green-600" />
            Your Earning Potential
          </DialogTitle>
          <DialogDescription>
            See how much you can earn as a Bit Force Ambassador
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div 
            className="text-center p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl text-white"
            data-testid="section-top-earnings"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-medium text-blue-200">Top Ambassadors Earn</span>
            </div>
            <div className="text-4xl font-bold mb-1" data-testid="text-top-earnings-amount">$3,000+</div>
            <div className="text-blue-200 text-sm">per month in commissions</div>
          </div>

          <div data-testid="section-commission-rates">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Commission Rates by Category
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {commissionRates.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Card 
                    key={item.category} 
                    className="p-4 hover-elevate"
                    data-testid={`card-commission-${item.category.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                      <Badge variant="secondary" className="text-green-700 bg-green-100">
                        {item.rate}
                      </Badge>
                    </div>
                    <div className="font-medium text-sm">{item.category}</div>
                    <div className="text-xs text-muted-foreground mt-1">{item.examples}</div>
                  </Card>
                );
              })}
            </div>
          </div>

          <div data-testid="section-earning-tiers">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Monthly Bonus Tiers
            </h3>
            <div className="space-y-3">
              {earningTiers.map((tier, index) => (
                <div 
                  key={tier.name} 
                  className="flex items-center gap-4"
                  data-testid={`tier-${tier.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className={`w-10 h-10 rounded-full ${tier.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-medium">{tier.name}</span>
                      <span className="text-sm text-muted-foreground">{tier.sales} sales</span>
                    </div>
                    <Progress value={(index + 1) * 25} className="h-2" />
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    +{tier.bonus}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div 
            className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-5"
            data-testid="section-pro-tip"
          >
            <div className="flex gap-4">
              <div className="shrink-0">
                <Star className="w-8 h-8 text-amber-500" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
                  Pro Tip: Bundle for Better Earnings
                </h4>
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  Customers who purchase multiple services give you higher commissions. 
                  Use the questionnaire to identify all their needs and recommend complete solutions!
                </p>
              </div>
            </div>
          </div>

          <div className="text-center pt-2" data-testid="section-monthly-goal">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">Your Goal This Month</span>
            </div>
            <div className="text-3xl font-bold text-foreground" data-testid="text-goal-amount">Close 10 Sales</div>
            <p className="text-sm text-muted-foreground mt-1">
              That's just 2-3 sales per week to hit Rising Star status!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
