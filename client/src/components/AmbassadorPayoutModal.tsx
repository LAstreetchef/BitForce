import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  Award, 
  Star, 
  Zap, 
  Target, 
  Home, 
  Monitor, 
  Wallet, 
  Gift,
  Users,
  Rocket,
  Crown,
  CheckCircle,
  ArrowRight,
  Sparkles
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

const recruitmentBonuses = [
  { milestone: "1st Recruit", bonus: "$100", total: "$100", icon: Users },
  { milestone: "5 Recruits", bonus: "$100 each + $100 bonus", total: "$600", icon: Star },
  { milestone: "10 Recruits", bonus: "$150 each + $300 bonus", total: "$1,800", icon: Award },
  { milestone: "25 Recruits", bonus: "$200 each + $1,000 bonus", total: "$6,000", icon: Crown },
];

const successStories = [
  { 
    name: "Marcus T.", 
    location: "Atlanta, GA",
    earnings: "$8,400",
    period: "Last Month",
    quote: "I started part-time and now I'm earning more than my old 9-5!",
    sales: 24
  },
  { 
    name: "Sarah M.", 
    location: "Houston, TX",
    earnings: "$47,000",
    period: "Last Quarter",
    quote: "The recruitment bonuses alone paid for my vacation!",
    sales: 89
  },
  { 
    name: "David K.", 
    location: "Phoenix, AZ",
    earnings: "$112,000",
    period: "This Year",
    quote: "From side hustle to six figures. This changed my life.",
    sales: 245
  },
];

const earningsProjections = [
  { level: "Part-Time Hustle", salesPerWeek: "3-5", monthly: "$1,500 - $2,500", yearly: "$18,000 - $30,000", color: "from-blue-500 to-blue-600" },
  { level: "Full-Time Grind", salesPerWeek: "8-12", monthly: "$4,000 - $6,000", yearly: "$48,000 - $72,000", color: "from-purple-500 to-purple-600" },
  { level: "Top Performer", salesPerWeek: "15-20", monthly: "$8,000 - $12,000", yearly: "$96,000 - $144,000", color: "from-amber-500 to-orange-500" },
  { level: "Elite Ambassador", salesPerWeek: "25+", monthly: "$15,000+", yearly: "$180,000+", color: "from-emerald-500 to-teal-500" },
];

export function AmbassadorPayoutModal({ open, onOpenChange }: AmbassadorPayoutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0" data-testid="modal-ambassador-payout">
        <div className="relative">
          <div 
            className="relative h-48 bg-cover bg-center"
            style={{ backgroundImage: `url(${successImage1})` }}
            data-testid="section-hero-banner"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-emerald-800/80 to-transparent" />
            <div className="absolute inset-0 flex items-center p-8">
              <div className="text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span className="text-emerald-300 font-medium">Unlimited Earning Potential</span>
                </div>
                <h2 className="text-3xl font-bold mb-2" data-testid="text-hero-title">Turn Your Network Into Income</h2>
                <p className="text-emerald-100 max-w-md" data-testid="text-hero-subtitle">Join thousands of ambassadors earning $5,000+ monthly. Your success starts here.</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <Tabs defaultValue="earnings" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="earnings" data-testid="tab-earnings">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Earnings</span>
                </TabsTrigger>
                <TabsTrigger value="commissions" data-testid="tab-commissions">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Commissions</span>
                </TabsTrigger>
                <TabsTrigger value="recruit" data-testid="tab-recruit">
                  <Users className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Recruit</span>
                </TabsTrigger>
                <TabsTrigger value="success" data-testid="tab-success">
                  <Star className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Success</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="earnings" className="space-y-6" data-testid="content-earnings">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Your Path to $100K+</h3>
                  <p className="text-muted-foreground">Real projections based on ambassador performance</p>
                </div>

                <div className="grid gap-4">
                  {earningsProjections.map((proj, index) => (
                    <Card 
                      key={proj.level} 
                      className="overflow-visible"
                      data-testid={`projection-${proj.level.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className={`bg-gradient-to-r ${proj.color} p-4 text-white sm:w-48 flex items-center justify-center rounded-t-md sm:rounded-l-md sm:rounded-tr-none`}>
                          <div className="text-center">
                            <div className="font-bold" data-testid={`text-level-${proj.level.toLowerCase().replace(/\s+/g, '-')}`}>{proj.level}</div>
                            <div className="text-sm opacity-90">{proj.salesPerWeek} sales/week</div>
                          </div>
                        </div>
                        <div className="flex-1 p-4 flex items-center justify-around gap-4">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">Monthly</div>
                            <div className="text-xl font-bold text-green-600" data-testid={`text-monthly-${proj.level.toLowerCase().replace(/\s+/g, '-')}`}>{proj.monthly}</div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground hidden sm:block" />
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">Yearly</div>
                            <div className="text-xl font-bold text-emerald-600" data-testid={`text-yearly-${proj.level.toLowerCase().replace(/\s+/g, '-')}`}>{proj.yearly}</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 text-center">
                  <Zap className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
                  <h4 className="font-bold text-lg mb-2">Quick Math</h4>
                  <p className="text-muted-foreground mb-4">
                    Just <span className="font-bold text-foreground">2 roofing sales per week</span> = 
                    <span className="text-green-600 font-bold"> $3,600/month</span> in commissions alone!
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>No caps on earnings</span>
                    <CheckCircle className="w-4 h-4 text-green-500 ml-4" />
                    <span>Weekly payouts</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="commissions" className="space-y-6" data-testid="content-commissions">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Commission Per Sale</h3>
                  <p className="text-muted-foreground">See exactly what you earn on every service</p>
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
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
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

              <TabsContent value="recruit" className="space-y-6" data-testid="content-recruit">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Recruitment Bonuses</h3>
                  <p className="text-muted-foreground">Earn BIG by building your team</p>
                </div>

                <div 
                  className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-6 text-white text-center mb-6"
                  data-testid="section-first-recruit-bonus"
                >
                  <Gift className="w-12 h-12 mx-auto mb-3 text-yellow-300" />
                  <div className="text-4xl font-bold mb-2" data-testid="text-first-recruit-amount">$100</div>
                  <div className="text-emerald-100">For Your FIRST Verified Recruit</div>
                  <div className="text-sm text-emerald-200 mt-2">Paid instantly when they make their first sale</div>
                </div>

                <div className="grid gap-4">
                  {recruitmentBonuses.map((tier) => {
                    const IconComponent = tier.icon;
                    return (
                      <Card 
                        key={tier.milestone} 
                        className="p-4 hover-elevate"
                        data-testid={`recruit-tier-${tier.milestone.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shrink-0">
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold">{tier.milestone}</div>
                            <div className="text-sm text-muted-foreground">{tier.bonus}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">{tier.total}</div>
                            <div className="text-xs text-muted-foreground">total earned</div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl p-5">
                  <div className="flex gap-4 items-start">
                    <Crown className="w-8 h-8 text-purple-500 shrink-0" />
                    <div>
                      <h4 className="font-bold text-purple-900 dark:text-purple-200 mb-1">
                        Team Leader Bonus
                      </h4>
                      <p className="text-sm text-purple-800 dark:text-purple-300 mb-2">
                        Earn <span className="font-bold">5% override</span> on ALL sales made by ambassadors you recruit. 
                        Build a team of 10 active sellers and earn an extra $2,000+/month passively!
                      </p>
                      <div className="flex items-center gap-2 text-xs text-purple-700 dark:text-purple-400">
                        <CheckCircle className="w-3 h-3" />
                        <span>Lifetime override on your recruits</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="success" className="space-y-6" data-testid="content-success">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Real Ambassadors, Real Results</h3>
                  <p className="text-muted-foreground">Join the success stories</p>
                </div>

                <div className="relative rounded-xl overflow-hidden mb-6">
                  <img 
                    src={lifestyleImage} 
                    alt="Success lifestyle" 
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <div className="text-2xl font-bold">Live the Life You Deserve</div>
                      <p className="text-white/80">Financial freedom is closer than you think</p>
                    </div>
                  </div>
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
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              {story.sales} sales
                            </Badge>
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
                      <p className="text-emerald-200 text-sm">Start today, earn this week</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <div className="text-sm text-muted-foreground">Ready to start earning?</div>
                  <div className="font-bold">Join 2,500+ successful ambassadors today</div>
                </div>
                <Button 
                  size="lg" 
                  className="bg-green-600 text-white"
                  data-testid="button-start-earning"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Earning Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
