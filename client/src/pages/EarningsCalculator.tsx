import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, TrendingUp, Sparkles, Coins, DollarSign, Calendar, Target } from "lucide-react";
import { Link } from "wouter";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const SIGNUP_FEE = 29;
const MONTHLY_SUBSCRIPTION = 19.99;
const REFERRAL_BONUS = 50;
const RECURRING_OVERRIDE = 4;

const REWARDS_BRIEF = [
  { label: "Login", bft: 0.2 },
  { label: "Contact", bft: 1 },
  { label: "Interest", bft: 1.5 },
  { label: "Sale", bft: 5 },
  { label: "7-Day", bft: 2.5 },
  { label: "30-Day", bft: 10 },
];

export default function EarningsCalculator() {
  const [ambassadorReferrals, setAmbassadorReferrals] = useState(3);
  const [months, setMonths] = useState(12);
  const [customersContacted, setCustomersContacted] = useState(25);
  const [customersInterested, setCustomersInterested] = useState(15);
  const [salesClosed, setSalesClosed] = useState(5);
  const [daysActivePerMonth, setDaysActivePerMonth] = useState(20);
  const [servicesPerMonth, setServicesPerMonth] = useState(10);
  const [bftTokenValue, setBftTokenValue] = useState(0.10);

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

    const bftFromLogins = loginDays * 0.2;
    const bftFromContacts = customersContacted * 1;
    const bftFromInterested = customersInterested * 1.5;
    const bftFromSales = salesClosed * 5;
    const bftFromServices = servicesPerMonth * months * 0.5;
    const bftFrom7DayStreaks = streaks7Day * 2.5;
    const bftFrom30DayStreaks = streaks30Day * 10;

    const totalBft = bftFromLogins + bftFromContacts + bftFromInterested + bftFromSales + bftFromServices + bftFrom7DayStreaks + bftFrom30DayStreaks;
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
    <div className="min-h-screen lg:h-screen bg-background flex flex-col lg:overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
        <Link href="/">
          <Button variant="ghost" size="sm" data-testid="button-back-home">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">Ambassador Earnings Calculator</h1>
        <div className="w-20" />
      </div>

      <div className="flex-1 p-4 overflow-y-auto lg:overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
          <Card className="lg:col-span-4 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background flex flex-col">
            <CardContent className="p-4 flex flex-col flex-1 gap-3">
              <div className="text-center py-2">
                <div className={`text-3xl font-bold ${calculations.netProfit >= 0 ? 'text-green-600' : 'text-red-500'}`} data-testid="text-net-profit">
                  {calculations.netProfit >= 0 ? '+' : '-'}${Math.abs(calculations.netProfit).toFixed(0)}
                </div>
                <p className="text-xs text-muted-foreground">Net Profit ({months}mo)</p>
              </div>

              <div className="grid grid-cols-2 gap-2 flex-1">
                <div className="bg-green-500/10 rounded-lg p-3 text-center">
                  <DollarSign className="w-4 h-4 mx-auto text-green-600 mb-1" />
                  <div className="text-lg font-bold text-green-600" data-testid="text-cash-earnings">
                    ${calculations.totalCashEarnings.toFixed(0)}
                  </div>
                  <p className="text-xs text-muted-foreground">Cash</p>
                </div>
                <div className="bg-yellow-500/10 rounded-lg p-3 text-center">
                  <Coins className="w-4 h-4 mx-auto text-yellow-600 mb-1" />
                  <div className="text-lg font-bold text-yellow-600" data-testid="text-bft-tokens">
                    {calculations.totalBft.toFixed(0)} BFT
                  </div>
                  <p className="text-xs text-muted-foreground">≈${calculations.bftDollarValue.toFixed(0)}</p>
                </div>
                <div className="bg-red-500/10 rounded-lg p-3 text-center">
                  <Target className="w-4 h-4 mx-auto text-red-500 mb-1" />
                  <div className="text-lg font-bold text-red-500" data-testid="text-costs">
                    -${calculations.totalCosts.toFixed(0)}
                  </div>
                  <p className="text-xs text-muted-foreground">Costs</p>
                </div>
                <div className="bg-primary/10 rounded-lg p-3 text-center">
                  <TrendingUp className="w-4 h-4 mx-auto text-primary mb-1" />
                  <div className="text-lg font-bold text-primary" data-testid="text-monthly-passive">
                    ${calculations.monthlyOverrides}/mo
                  </div>
                  <p className="text-xs text-muted-foreground">Passive</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 justify-center pt-2 border-t">
                {REWARDS_BRIEF.map((r) => (
                  <Tooltip key={r.label}>
                    <TooltipTrigger>
                      <Badge variant="secondary" className="text-xs cursor-help">
                        {r.label}: {r.bft}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{r.bft} BFT per {r.label.toLowerCase()}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>

              <Link href="/joinbitforce" className="mt-auto">
                <Button className="w-full" data-testid="button-join">
                  Become an Ambassador
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="lg:col-span-8 flex flex-col">
            <CardContent className="p-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 h-full">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Users className="w-4 h-4" />
                    Team Building
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Ambassadors Recruited</span>
                      <Badge variant="outline" data-testid="text-ambassador-count">{ambassadorReferrals}</Badge>
                    </div>
                    <Slider
                      value={[ambassadorReferrals]}
                      onValueChange={(v) => setAmbassadorReferrals(v[0])}
                      min={0}
                      max={20}
                      step={1}
                      data-testid="slider-ambassadors"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Months</span>
                      <Badge variant="outline" data-testid="text-months">{months}</Badge>
                    </div>
                    <Slider
                      value={[months]}
                      onValueChange={(v) => setMonths(v[0])}
                      min={1}
                      max={24}
                      step={1}
                      data-testid="slider-months"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground pt-2">
                    <Sparkles className="w-4 h-4" />
                    Your Activity
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Days Active/Month</span>
                      <Badge variant="outline" data-testid="text-days">{daysActivePerMonth}</Badge>
                    </div>
                    <Slider
                      value={[daysActivePerMonth]}
                      onValueChange={(v) => setDaysActivePerMonth(v[0])}
                      min={0}
                      max={30}
                      step={1}
                      data-testid="slider-days"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Services/Month</span>
                      <Badge variant="outline" data-testid="text-services">{servicesPerMonth}</Badge>
                    </div>
                    <Slider
                      value={[servicesPerMonth]}
                      onValueChange={(v) => setServicesPerMonth(v[0])}
                      min={0}
                      max={50}
                      step={1}
                      data-testid="slider-services"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    Customer Funnel
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Customers Contacted</span>
                      <Badge variant="outline" data-testid="text-contacts">{customersContacted}</Badge>
                    </div>
                    <Slider
                      value={[customersContacted]}
                      onValueChange={(v) => handleContactsChange(v[0])}
                      min={0}
                      max={100}
                      step={1}
                      data-testid="slider-contacts"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Showing Interest</span>
                      <Badge variant="outline" data-testid="text-interested">{customersInterested}</Badge>
                    </div>
                    <Slider
                      value={[customersInterested]}
                      onValueChange={(v) => handleInterestedChange(v[0])}
                      min={0}
                      max={Math.max(customersContacted, 1)}
                      step={1}
                      data-testid="slider-interested"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Sales Closed</span>
                      <Badge variant="outline" data-testid="text-sales">{salesClosed}</Badge>
                    </div>
                    <Slider
                      value={[salesClosed]}
                      onValueChange={(v) => setSalesClosed(v[0])}
                      min={0}
                      max={Math.max(customersInterested, 1)}
                      step={1}
                      data-testid="slider-sales"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground pt-2">
                    <Coins className="w-4 h-4" />
                    Token Value
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>BFT Price ($)</span>
                      <Badge variant="outline" data-testid="text-bft-value">${bftTokenValue.toFixed(2)}</Badge>
                    </div>
                    <Slider
                      value={[bftTokenValue * 100]}
                      onValueChange={(v) => setBftTokenValue(v[0] / 100)}
                      min={1}
                      max={100}
                      step={1}
                      data-testid="slider-bft-value"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
