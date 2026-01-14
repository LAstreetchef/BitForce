import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, TrendingUp, Sparkles, Coins, DollarSign, HelpCircle, Zap, Clock, Flame, Info } from "lucide-react";
import { Link } from "wouter";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const SIGNUP_FEE = 29;
const MONTHLY_SUBSCRIPTION = 19.99;
const REFERRAL_BONUS = 50;
const RECURRING_OVERRIDE = 4;

const REWARDS_EXPLAINED = [
  { label: "Ambassador Signup", bft: 50, description: "Earn 50 BFT when you recruit a new ambassador" },
  { label: "Daily Login", bft: 0.2, description: "Earn BFT just for logging in each day" },
  { label: "Customer Contact", bft: 1, description: "Log a conversation with a potential customer" },
  { label: "Interest Shown", bft: 1.5, description: "When a customer expresses interest in services" },
  { label: "Sale Closed", bft: 5, description: "Earn big when you close a deal" },
  { label: "7-Day Streak", bft: 2.5, description: "Bonus for 7 consecutive days active" },
  { label: "30-Day Streak", bft: 10, description: "Major bonus for a full month of activity" },
];

const PRESETS = {
  casual: {
    label: "Casual",
    icon: Clock,
    description: "A few hours per week",
    values: { ambassadors: 1, months: 12, daysActive: 10, services: 3, contacts: 10, interested: 5, sales: 2, bftPrice: 0.10 }
  },
  partTime: {
    label: "Part-Time",
    icon: Zap,
    description: "10-15 hours per week",
    values: { ambassadors: 3, months: 12, daysActive: 20, services: 10, contacts: 25, interested: 15, sales: 5, bftPrice: 0.10 }
  },
  dedicated: {
    label: "Dedicated",
    icon: Flame,
    description: "Full commitment",
    values: { ambassadors: 8, months: 12, daysActive: 28, services: 25, contacts: 50, interested: 30, sales: 12, bftPrice: 0.10 }
  }
};

export default function EarningsCalculator() {
  const [ambassadorReferrals, setAmbassadorReferrals] = useState(3);
  const [months, setMonths] = useState(12);
  const [customersContacted, setCustomersContacted] = useState(25);
  const [customersInterested, setCustomersInterested] = useState(15);
  const [salesClosed, setSalesClosed] = useState(5);
  const [daysActivePerMonth, setDaysActivePerMonth] = useState(20);
  const [servicesPerMonth, setServicesPerMonth] = useState(10);
  const [bftTokenValue, setBftTokenValue] = useState(0.10);
  const [activePreset, setActivePreset] = useState<string | null>("partTime");

  const applyPreset = (presetKey: string) => {
    const preset = PRESETS[presetKey as keyof typeof PRESETS];
    setAmbassadorReferrals(preset.values.ambassadors);
    setMonths(preset.values.months);
    setDaysActivePerMonth(preset.values.daysActive);
    setServicesPerMonth(preset.values.services);
    setCustomersContacted(preset.values.contacts);
    setCustomersInterested(preset.values.interested);
    setSalesClosed(preset.values.sales);
    setBftTokenValue(preset.values.bftPrice);
    setActivePreset(presetKey);
  };

  const clearPreset = () => setActivePreset(null);

  const handleContactsChange = (value: number) => {
    setCustomersContacted(value);
    if (customersInterested > value) setCustomersInterested(value);
    if (salesClosed > value) setSalesClosed(Math.min(salesClosed, value));
  };

  const handleInterestedChange = (value: number) => {
    setCustomersInterested(value);
    if (salesClosed > value) setSalesClosed(value);
  };

  const calculations = useMemo(() => {
    const referralBonuses = ambassadorReferrals * REFERRAL_BONUS;
    const monthlyOverrides = ambassadorReferrals * RECURRING_OVERRIDE;
    const totalOverrides = monthlyOverrides * months;
    const totalCashEarnings = referralBonuses + totalOverrides;
    const totalCosts = SIGNUP_FEE + (MONTHLY_SUBSCRIPTION * months);

    const loginDays = daysActivePerMonth * months;
    const streaks7Day = Math.floor(loginDays / 7);
    const streaks30Day = Math.floor(loginDays / 30);

    const bftFromAmbassadors = ambassadorReferrals * 50;
    const bftFromLogins = loginDays * 0.2;
    const bftFromContacts = customersContacted * 1;
    const bftFromInterested = customersInterested * 1.5;
    const bftFromSales = salesClosed * 5;
    const bftFromServices = servicesPerMonth * months * 0.5;
    const bftFrom7DayStreaks = streaks7Day * 2.5;
    const bftFrom30DayStreaks = streaks30Day * 10;

    const totalBft = bftFromAmbassadors + bftFromLogins + bftFromContacts + bftFromInterested + bftFromSales + bftFromServices + bftFrom7DayStreaks + bftFrom30DayStreaks;
    const bftDollarValue = totalBft * bftTokenValue;
    const totalEarnings = totalCashEarnings + bftDollarValue;
    const netProfit = totalEarnings - totalCosts;

    return {
      referralBonuses,
      monthlyOverrides,
      totalOverrides,
      totalCashEarnings,
      totalCosts,
      totalBft,
      bftDollarValue,
      netProfit,
    };
  }, [ambassadorReferrals, months, customersContacted, customersInterested, salesClosed, daysActivePerMonth, servicesPerMonth, bftTokenValue]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center justify-between gap-2 px-4 py-2 border-b bg-muted/30">
        <Link href="/">
          <Button variant="ghost" size="sm" data-testid="button-back-home">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">Ambassador Earnings Calculator</h1>
        <div className="w-20" />
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          
          <Card className="bg-gradient-to-r from-primary/5 via-background to-primary/5 border-primary/20">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="flex-1">
                  <p className="text-xl md:text-2xl font-bold text-foreground mb-3" data-testid="text-tagline">
                    Can you succeed in the job of the future? Find out now.
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">How to Use This Calculator</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30">
                      <DollarSign className="w-3 h-3 mr-1" />
                      Earn Cash
                    </Badge>
                    <span className="text-muted-foreground">+</span>
                    <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30">
                      <Coins className="w-3 h-3 mr-1" />
                      Earn Crypto BFT
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    As a BitForce Ambassador, you earn <strong>both cash bonuses and BFT crypto tokens</strong>. 
                    Adjust the sliders below to see your projected income from both streams.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-medium">1.</span>
                      <span><strong>Choose a starting point</strong> below, or customize each slider manually</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-medium">2.</span>
                      <span><strong>Adjust the values</strong> to match how much time you plan to invest</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-medium">3.</span>
                      <span><strong>See your results</strong> update instantly on the left panel</span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quick Start</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(PRESETS).map(([key, preset]) => {
                      const Icon = preset.icon;
                      return (
                        <Button
                          key={key}
                          variant={activePreset === key ? "default" : "outline"}
                          size="sm"
                          onClick={() => applyPreset(key)}
                          className="flex items-center gap-1.5"
                          data-testid={`button-preset-${key}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {preset.label}
                        </Button>
                      );
                    })}
                  </div>
                  {activePreset && (
                    <p className="text-xs text-muted-foreground" data-testid="text-preset-description">
                      {PRESETS[activePreset as keyof typeof PRESETS].description}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            
            <Card className="lg:col-span-4 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-base">Your Projected Earnings</CardTitle>
                <CardDescription className="text-center">Based on {months} months of activity</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex flex-col gap-4">
                <div className="text-center py-3 bg-background/50 rounded-lg">
                  <div className={`text-4xl font-bold ${calculations.netProfit >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-500'}`} data-testid="text-net-profit">
                    {calculations.netProfit >= 0 ? '+' : '-'}${Math.abs(calculations.netProfit).toFixed(0)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Net Profit</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-500/10 dark:bg-green-500/20 rounded-lg p-3 text-center">
                    <DollarSign className="w-5 h-5 mx-auto text-green-600 dark:text-green-500 mb-1" />
                    <div className="text-xl font-bold text-green-600 dark:text-green-500" data-testid="text-cash-earnings">
                      ${calculations.totalCashEarnings.toFixed(0)}
                    </div>
                    <p className="text-xs text-muted-foreground">Cash Earnings</p>
                  </div>
                  <div className="bg-yellow-500/10 dark:bg-yellow-500/20 rounded-lg p-3 text-center">
                    <Coins className="w-5 h-5 mx-auto text-yellow-600 dark:text-yellow-500 mb-1" />
                    <div className="text-xl font-bold text-yellow-600 dark:text-yellow-500" data-testid="text-bft-tokens">
                      {calculations.totalBft.toFixed(0)} BFT
                    </div>
                    <p className="text-xs text-muted-foreground">≈${calculations.bftDollarValue.toFixed(0)} value</p>
                  </div>
                  <div className="bg-red-500/10 dark:bg-red-500/20 rounded-lg p-3 text-center">
                    <DollarSign className="w-5 h-5 mx-auto text-red-500 mb-1" />
                    <div className="text-xl font-bold text-red-500" data-testid="text-costs">
                      -${calculations.totalCosts.toFixed(0)}
                    </div>
                    <p className="text-xs text-muted-foreground">Total Costs</p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-3 text-center">
                    <TrendingUp className="w-5 h-5 mx-auto text-primary mb-1" />
                    <div className="text-xl font-bold text-primary" data-testid="text-monthly-passive">
                      ${calculations.monthlyOverrides}/mo
                    </div>
                    <p className="text-xs text-muted-foreground">Passive Income</p>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium">BFT Rewards You Can Earn</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {REWARDS_EXPLAINED.map((r) => (
                      <Tooltip key={r.label}>
                        <TooltipTrigger asChild>
                          <div className="flex items-center justify-between p-2 rounded-md bg-muted/50 cursor-help hover-elevate">
                            <span className="text-xs">{r.label}</span>
                            <Badge variant="secondary" className="text-xs">+{r.bft}</Badge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[200px]">
                          <p className="text-sm">{r.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>

                <Link href="/joinbitforce" className="mt-2">
                  <Button className="w-full" size="lg" data-testid="button-join">
                    Become an Ambassador
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="lg:col-span-8">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Customize Your Projections</CardTitle>
                <CardDescription>
                  Drag the sliders to adjust values. The results panel will update automatically.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold">Team Building</span>
                      </div>
                      <p className="text-xs text-muted-foreground -mt-2">
                        Recruit other ambassadors to earn $50 per signup plus $4/month ongoing
                      </p>
                      <div className="space-y-3 pl-6">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center gap-2 text-sm">
                            <div className="flex items-center gap-1.5">
                              <span>Ambassadors Recruited</span>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[200px]">
                                  <p>How many people you bring into the ambassador program. Most start with 1-3 friends or family.</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <Badge variant="outline" data-testid="text-ambassador-count">{ambassadorReferrals}</Badge>
                          </div>
                          <Slider
                            value={[ambassadorReferrals]}
                            onValueChange={(v) => { setAmbassadorReferrals(v[0]); clearPreset(); }}
                            min={0}
                            max={100}
                            step={1}
                            data-testid="slider-ambassadors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center gap-2 text-sm">
                            <div className="flex items-center gap-1.5">
                              <span>Time Period (Months)</span>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[200px]">
                                  <p>How long you plan to be active. Longer periods mean more passive income from your team.</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <Badge variant="outline" data-testid="text-months">{months}</Badge>
                          </div>
                          <Slider
                            value={[months]}
                            onValueChange={(v) => { setMonths(v[0]); clearPreset(); }}
                            min={1}
                            max={24}
                            step={1}
                            data-testid="slider-months"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold">Your Daily Activity</span>
                      </div>
                      <p className="text-xs text-muted-foreground -mt-2">
                        Earn BFT tokens by staying active in the app
                      </p>
                      <div className="space-y-3 pl-6">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center gap-2 text-sm">
                            <div className="flex items-center gap-1.5">
                              <span>Days Active per Month</span>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[200px]">
                                  <p>How often you log in. Casual users average 10 days, dedicated ambassadors log in 25+ days.</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <Badge variant="outline" data-testid="text-days">{daysActivePerMonth}</Badge>
                          </div>
                          <Slider
                            value={[daysActivePerMonth]}
                            onValueChange={(v) => { setDaysActivePerMonth(v[0]); clearPreset(); }}
                            min={0}
                            max={30}
                            step={1}
                            data-testid="slider-days"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center gap-2 text-sm">
                            <div className="flex items-center gap-1.5">
                              <span>Services Logged per Month</span>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[200px]">
                                  <p>Services you log in the app. You earn 0.5 BFT per service logged.</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <Badge variant="outline" data-testid="text-services">{servicesPerMonth}</Badge>
                          </div>
                          <Slider
                            value={[servicesPerMonth]}
                            onValueChange={(v) => { setServicesPerMonth(v[0]); clearPreset(); }}
                            min={0}
                            max={50}
                            step={1}
                            data-testid="slider-services"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold">Customer Funnel</span>
                      </div>
                      <p className="text-xs text-muted-foreground -mt-2">
                        Track your sales pipeline from first contact to closed deal
                      </p>
                      <div className="space-y-3 pl-6">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center gap-2 text-sm">
                            <div className="flex items-center gap-1.5">
                              <span>Customers Contacted</span>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[200px]">
                                  <p>Total people you reach out to about BitForce services. More contacts = more opportunities.</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <Badge variant="outline" data-testid="text-contacts">{customersContacted}</Badge>
                          </div>
                          <Slider
                            value={[customersContacted]}
                            onValueChange={(v) => { handleContactsChange(v[0]); clearPreset(); }}
                            min={0}
                            max={100}
                            step={1}
                            data-testid="slider-contacts"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center gap-2 text-sm">
                            <div className="flex items-center gap-1.5">
                              <span>Showing Interest</span>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[200px]">
                                  <p>Contacts who want to learn more. Typically 40-60% of people you contact.</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <Badge variant="outline" data-testid="text-interested">{customersInterested}</Badge>
                          </div>
                          <Slider
                            value={[customersInterested]}
                            onValueChange={(v) => { handleInterestedChange(v[0]); clearPreset(); }}
                            min={0}
                            max={100}
                            step={1}
                            data-testid="slider-interested"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center gap-2 text-sm">
                            <div className="flex items-center gap-1.5">
                              <span>Sales Closed</span>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[200px]">
                                  <p>Interested customers who sign up. Average conversion is 20-30% of interested leads.</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <Badge variant="outline" data-testid="text-sales">{salesClosed}</Badge>
                          </div>
                          <Slider
                            value={[salesClosed]}
                            onValueChange={(v) => { setSalesClosed(v[0]); clearPreset(); }}
                            min={0}
                            max={100}
                            step={1}
                            data-testid="slider-sales"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold">Token Value Projection</span>
                      </div>
                      <p className="text-xs text-muted-foreground -mt-2">
                        Adjust the estimated future value of BFT tokens
                      </p>
                      <div className="space-y-3 pl-6">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center gap-2 text-sm">
                            <div className="flex items-center gap-1.5">
                              <span>BFT Token Price ($)</span>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[200px]">
                                  <p>Estimated future value per BFT token. Current price is $0.10. This is speculative.</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <Badge variant="outline" data-testid="text-bft-value">${bftTokenValue.toFixed(2)}</Badge>
                          </div>
                          <Slider
                            value={[bftTokenValue * 100]}
                            onValueChange={(v) => { setBftTokenValue(v[0] / 100); clearPreset(); }}
                            min={1}
                            max={100}
                            step={1}
                            data-testid="slider-bft-value"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
