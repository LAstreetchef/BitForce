import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Users, DollarSign, Coins, TrendingUp, Calculator, Sparkles } from "lucide-react";
import { Link } from "wouter";

const SIGNUP_FEE = 29;
const MONTHLY_SUBSCRIPTION = 19.99;
const REFERRAL_BONUS = 50;
const RECURRING_OVERRIDE = 4;

const REWARDS_TABLE = [
  { activity: "Daily Login", points: 2, bft: 0.2 },
  { activity: "Suggest a Service", points: 5, bft: 0.5 },
  { activity: "Contact a Lead", points: 10, bft: 1 },
  { activity: "Lead Shows Interest", points: 15, bft: 1.5 },
  { activity: "Generate Design", points: 15, bft: 1.5 },
  { activity: "7-Day Streak Bonus", points: 25, bft: 2.5 },
  { activity: "Make a Sale", points: 50, bft: 5 },
  { activity: "30-Day Streak Bonus", points: 100, bft: 10 },
];

export default function EarningsCalculator() {
  const [ambassadorReferrals, setAmbassadorReferrals] = useState(3);
  const [months, setMonths] = useState(12);
  const [customersContacted, setCustomersContacted] = useState(25);
  const [customersInterested, setCustomersInterested] = useState(15);
  const [salesClosed, setSalesClosed] = useState(5);

  const handleContactsChange = (value: number) => {
    setCustomersContacted(value);
    if (customersInterested > value) setCustomersInterested(value);
    if (salesClosed > value) setSalesClosed(Math.min(salesClosed, value));
  };

  const handleInterestedChange = (value: number) => {
    setCustomersInterested(value);
    if (salesClosed > value) setSalesClosed(value);
  };
  const [daysActivePerMonth, setDaysActivePerMonth] = useState(20);
  const [servicesPerMonth, setServicesPerMonth] = useState(10);
  const [bftTokenValue, setBftTokenValue] = useState(0.10);

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
    const monthlyPassiveIncome = monthlyOverrides;

    return {
      referralBonuses,
      monthlyOverrides,
      totalOverrides,
      totalCashEarnings,
      totalCosts,
      totalBft,
      bftDollarValue,
      totalEarnings,
      netProfit,
      monthlyPassiveIncome,
      bftBreakdown: {
        logins: bftFromLogins,
        contacts: bftFromContacts,
        interested: bftFromInterested,
        sales: bftFromSales,
        services: bftFromServices,
        streaks7: bftFrom7DayStreaks,
        streaks30: bftFrom30DayStreaks,
      }
    };
  }, [ambassadorReferrals, months, customersContacted, customersInterested, salesClosed, daysActivePerMonth, servicesPerMonth, bftTokenValue]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calculator className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Ambassador Earnings Calculator</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how much you could earn as a Bit Force ambassador. Adjust the sliders to match your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Building
                </CardTitle>
                <CardDescription>How many ambassadors will you recruit?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Ambassador Referrals</Label>
                    <span className="font-semibold text-primary" data-testid="text-ambassador-count">{ambassadorReferrals}</span>
                  </div>
                  <Slider
                    value={[ambassadorReferrals]}
                    onValueChange={(v) => setAmbassadorReferrals(v[0])}
                    min={0}
                    max={20}
                    step={1}
                    data-testid="slider-ambassadors"
                  />
                  <p className="text-sm text-muted-foreground">
                    ${REFERRAL_BONUS} bonus each + ${RECURRING_OVERRIDE}/month recurring
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Projection Period (Months)</Label>
                    <span className="font-semibold text-primary" data-testid="text-months">{months}</span>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Customer Activity
                </CardTitle>
                <CardDescription>How many customers will you help?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Customers Contacted</Label>
                    <span className="font-semibold text-primary" data-testid="text-contacts">{customersContacted}</span>
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

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Customers Showing Interest</Label>
                    <span className="font-semibold text-primary" data-testid="text-interested">{customersInterested}</span>
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

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Sales Closed</Label>
                    <span className="font-semibold text-primary" data-testid="text-sales">{salesClosed}</span>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Your Activity
                </CardTitle>
                <CardDescription>How active will you be each month?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Days Active per Month</Label>
                    <span className="font-semibold text-primary" data-testid="text-days">{daysActivePerMonth}</span>
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

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Services Suggested per Month</Label>
                    <span className="font-semibold text-primary" data-testid="text-services">{servicesPerMonth}</span>
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

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Assumed BFT Token Value ($)</Label>
                    <span className="font-semibold text-primary" data-testid="text-bft-value">${bftTokenValue.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[bftTokenValue * 100]}
                    onValueChange={(v) => setBftTokenValue(v[0] / 100)}
                    min={1}
                    max={100}
                    step={1}
                    data-testid="slider-bft-value"
                  />
                  <p className="text-sm text-muted-foreground">
                    Adjust to see potential future value
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background sticky top-4">
              <CardHeader>
                <CardTitle className="text-center">Your Projected Earnings</CardTitle>
                <CardDescription className="text-center">{months} month projection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <div className={`text-4xl font-bold ${calculations.netProfit >= 0 ? 'text-green-600' : 'text-red-500'}`} data-testid="text-net-profit">
                    {calculations.netProfit >= 0 ? '+' : '-'}${Math.abs(calculations.netProfit).toFixed(2)}
                  </div>
                  <p className="text-sm text-muted-foreground">Net Profit</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span>Cash Earnings</span>
                    </span>
                    <span className="font-semibold text-green-600" data-testid="text-cash-earnings">
                      ${calculations.totalCashEarnings.toFixed(2)}
                    </span>
                  </div>
                  <div className="pl-6 text-sm text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Referral Bonuses</span>
                      <span>${calculations.referralBonuses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recurring Overrides</span>
                      <span>${calculations.totalOverrides.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-yellow-600" />
                      <span>BFT Tokens</span>
                    </span>
                    <span className="font-semibold text-yellow-600" data-testid="text-bft-tokens">
                      {calculations.totalBft.toFixed(1)} BFT
                    </span>
                  </div>
                  <div className="pl-6 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Est. Value @ ${bftTokenValue.toFixed(2)}</span>
                      <span>${calculations.bftDollarValue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center text-red-500">
                  <span>Total Costs</span>
                  <span className="font-semibold" data-testid="text-costs">
                    -${calculations.totalCosts.toFixed(2)}
                  </span>
                </div>
                <div className="pl-6 text-sm text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Signup Fee</span>
                    <span>-${SIGNUP_FEE}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subscription ({months}mo)</span>
                    <span>-${(MONTHLY_SUBSCRIPTION * months).toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary" data-testid="text-monthly-passive">
                    ${calculations.monthlyPassiveIncome}/mo
                  </div>
                  <p className="text-sm text-muted-foreground">Recurring Passive Income</p>
                </div>

                <Link href="/joinbitforce">
                  <Button className="w-full" size="lg" data-testid="button-join">
                    Become an Ambassador
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">BFT Token Rewards</CardTitle>
                <CardDescription className="text-xs">10 points = 1 BFT</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {REWARDS_TABLE.map((row) => (
                    <div key={row.activity} className="flex justify-between">
                      <span className="text-muted-foreground">{row.activity}</span>
                      <span className="font-medium">{row.bft} BFT</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
