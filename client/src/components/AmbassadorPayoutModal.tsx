import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { 
  DollarSign, 
  TrendingUp, 
  Award, 
  Star, 
  Zap, 
  Target, 
  Wallet, 
  Gift,
  Users,
  Rocket,
  Crown,
  CheckCircle,
  ArrowRight,
  Sparkles,
  RefreshCcw,
  Calculator,
  Timer,
  Infinity
} from "lucide-react";

import successImage1 from "@assets/stock_images/person_celebrating_w_0451e351.jpg";
import successImage2 from "@assets/stock_images/person_celebrating_w_0cd3a5d5.jpg";
import teamImage from "@assets/stock_images/successful_business__b630fb27.jpg";
import lifestyleImage from "@assets/stock_images/luxury_lifestyle_fre_2fd5a4a6.jpg";

interface AmbassadorPayoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

export function AmbassadorPayoutModal({ open, onOpenChange }: AmbassadorPayoutModalProps) {
  const [calculatorReferrals, setCalculatorReferrals] = useState([10]);

  const instantBonus = calculatorReferrals[0] * 50;
  const monthlyPassive = calculatorReferrals[0] * 4;
  const yearlyPassive = monthlyPassive * 12;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0" data-testid="modal-ambassador-payout">
        <VisuallyHidden>
          <DialogTitle>Ambassador Earnings and Payout Information</DialogTitle>
          <DialogDescription>Details about the ambassador program, pricing, and earning potential</DialogDescription>
        </VisuallyHidden>
        <div className="relative">
          <div 
            className="relative h-56 bg-cover bg-center"
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

          <div className="p-6">
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
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        Monthly training webinars
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
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        Lifetime passive from your team
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

                <div className="relative rounded-xl overflow-hidden">
                  <img 
                    src={successImage2} 
                    alt="Celebrate success" 
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-transparent flex items-center p-6">
                    <div className="text-white">
                      <div className="font-bold text-lg">Your Success Story is Next</div>
                      <p className="text-emerald-200 text-sm">$29 to start. Unlimited potential.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <div className="text-sm text-muted-foreground">Start for just $29 + $19.99/mo</div>
                  <div className="font-bold">Break even with your first referral!</div>
                </div>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                  data-testid="button-start-earning"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Join Now - $29
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
