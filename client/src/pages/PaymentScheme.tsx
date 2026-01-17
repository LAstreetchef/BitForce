import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";
import { InvestorEcosystemDialog } from "@/components/InvestorEcosystemDialog";

const SIGNUP_FEE = 29;
const MONTHLY_SUB = 19.99;
const REFERRAL_BONUS = 50;
const MONTHLY_OVERRIDE = 4;

const BASIC_PRICE = 29;
const PRO_PRICE = 79;
const PREMIUM_PRICE = 199;

const BFT_REWARDS = {
  AMBASSADOR_SIGNUP: 50,
  DAILY_LOGIN: 0.2,
  CUSTOMER_CONTACT: 1,
  INTEREST_SHOWN: 1.5,
  SALE_CLOSED: 5,
  SEVEN_DAY_STREAK: 2.5,
  THIRTY_DAY_STREAK: 10,
  LESSON_COMPLETED: 5,
  MODULE_COMPLETED: 25,
};

export default function PaymentScheme() {
  const [initialAmbassadors, setInitialAmbassadors] = useState(100);
  const [referralsPerAmbassador, setReferralsPerAmbassador] = useState(2);
  const [months, setMonths] = useState(12);
  
  const [basicSales, setBasicSales] = useState(3);
  const [proSales, setProSales] = useState(2);
  const [premiumSales, setPremiumSales] = useState(1);
  const [avgSubscriptionMonths, setAvgSubscriptionMonths] = useState(6);

  const [buybackPercent, setBuybackPercent] = useState(10);
  const [currentBftPrice, setCurrentBftPrice] = useState(0.0055);
  const [circulatingSupply, setCirculatingSupply] = useState(10_000_000);
  const [priceElasticity, setPriceElasticity] = useState(1.5);

  const [avgLoginsPerMonth, setAvgLoginsPerMonth] = useState(20);
  const [avgContactsPerMonth, setAvgContactsPerMonth] = useState(30);
  const [avgInterestsPerMonth, setAvgInterestsPerMonth] = useState(10);
  const [avgLessonsCompleted, setAvgLessonsCompleted] = useState(8);
  const [avgModulesCompleted, setAvgModulesCompleted] = useState(2);

  const revenuePerAmbassador = SIGNUP_FEE + (MONTHLY_SUB * months);
  const payoutPerReferral = REFERRAL_BONUS + (MONTHLY_OVERRIDE * months);
  
  const totalReferrals = initialAmbassadors * referralsPerAmbassador;
  const totalAmbassadors = initialAmbassadors + totalReferrals;
  
  const ambassadorRevenue = totalAmbassadors * revenuePerAmbassador;
  
  const totalBasicSales = totalAmbassadors * basicSales;
  const totalProSales = totalAmbassadors * proSales;
  const totalPremiumSales = totalAmbassadors * premiumSales;
  
  const basicRevenue = totalBasicSales * BASIC_PRICE * avgSubscriptionMonths;
  const proRevenue = totalProSales * PRO_PRICE * avgSubscriptionMonths;
  const premiumRevenue = totalPremiumSales * PREMIUM_PRICE * avgSubscriptionMonths;
  const productRevenue = basicRevenue + proRevenue + premiumRevenue;
  
  const totalRevenue = ambassadorRevenue + productRevenue;
  const totalPayouts = totalReferrals * payoutPerReferral;
  const netRevenue = totalRevenue - totalPayouts;

  const monthlyProfit = months > 0 ? netRevenue / months : 0;
  const monthlyBuybackAmount = monthlyProfit > 0 ? monthlyProfit * (buybackPercent / 100) : 0;
  const rawMonthlyTokensBurned = currentBftPrice > 0 ? monthlyBuybackAmount / currentBftPrice : 0;
  const rawTotalTokensBurned = rawMonthlyTokensBurned * months;
  const totalTokensBurned = Math.min(rawTotalTokensBurned, circulatingSupply);
  const supplyReductionPercent = circulatingSupply > 0 ? Math.min((totalTokensBurned / circulatingSupply) * 100, 100) : 0;
  const projectedPriceIncrease = supplyReductionPercent * (priceElasticity / 100);
  const projectedBftPrice = currentBftPrice * (1 + projectedPriceIncrease);
  const totalBuybackSpend = monthlyBuybackAmount * months;
  const buybackExceedsSupply = rawTotalTokensBurned > circulatingSupply;

  const signupBft = totalAmbassadors * BFT_REWARDS.AMBASSADOR_SIGNUP;
  const loginBft = totalAmbassadors * avgLoginsPerMonth * months * BFT_REWARDS.DAILY_LOGIN;
  const contactBft = totalAmbassadors * avgContactsPerMonth * months * BFT_REWARDS.CUSTOMER_CONTACT;
  const interestBft = totalAmbassadors * avgInterestsPerMonth * months * BFT_REWARDS.INTEREST_SHOWN;
  const totalSales = totalBasicSales + totalProSales + totalPremiumSales;
  const saleBft = totalSales * BFT_REWARDS.SALE_CLOSED;
  const sevenDayStreaks = Math.floor((months * 30) / 7);
  const thirtyDayStreaks = months;
  const streakBft = totalAmbassadors * (sevenDayStreaks * BFT_REWARDS.SEVEN_DAY_STREAK + thirtyDayStreaks * BFT_REWARDS.THIRTY_DAY_STREAK);
  const lessonBft = totalAmbassadors * avgLessonsCompleted * BFT_REWARDS.LESSON_COMPLETED;
  const moduleBft = totalAmbassadors * avgModulesCompleted * BFT_REWARDS.MODULE_COMPLETED;
  
  const totalBftAwarded = signupBft + loginBft + contactBft + interestBft + saleBft + streakBft + lessonBft + moduleBft;
  const bftAwardedValue = totalBftAwarded * currentBftPrice;
  const netBftFlow = totalBftAwarded - totalTokensBurned;

  const priceProjectionData = Array.from({ length: months + 1 }, (_, i) => {
    const tokensBurnedSoFar = Math.min(rawMonthlyTokensBurned * i, circulatingSupply);
    const supplyReductionSoFar = circulatingSupply > 0 ? Math.min((tokensBurnedSoFar / circulatingSupply) * 100, 100) : 0;
    const priceIncreaseSoFar = supplyReductionSoFar * (priceElasticity / 100);
    return {
      month: i,
      price: currentBftPrice * (1 + priceIncreaseSoFar),
      baseline: currentBftPrice,
    };
  });

  const revenueData = [
    { name: "Ambassador Fees", amount: ambassadorRevenue },
    { name: "Basic ($29/mo)", amount: basicRevenue },
    { name: "Pro ($79/mo)", amount: proRevenue },
    { name: "Premium ($199/mo)", amount: premiumRevenue },
  ];

  const payoutData = [
    { name: "Referral Bonuses", amount: totalReferrals * REFERRAL_BONUS },
    { name: "Overrides", amount: totalReferrals * MONTHLY_OVERRIDE * months },
  ];

  const flowData = [
    { name: "Total Revenue", value: totalRevenue, color: "#22c55e" },
    { name: "Total Payouts", value: totalPayouts, color: "#ef4444" },
  ];

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Ambassador Payment Scheme</h1>
          <p className="text-muted-foreground mt-2">Scenario analysis for revenue and payouts</p>
          <div className="mt-3">
            <InvestorEcosystemDialog />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ambassador Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label htmlFor="ambassadors">Initial Ambassadors</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    id="ambassadors-slider"
                    data-testid="slider-ambassadors"
                    value={[initialAmbassadors]}
                    onValueChange={(v) => setInitialAmbassadors(v[0])}
                    min={10}
                    max={1000}
                    step={10}
                    className="flex-1"
                  />
                  <Input
                    id="ambassadors"
                    data-testid="input-ambassadors"
                    type="number"
                    value={initialAmbassadors}
                    onChange={(e) => setInitialAmbassadors(Math.min(1000, Math.max(10, parseInt(e.target.value) || 10)))}
                    className="w-20"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="referrals">Referrals per Ambassador</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    id="referrals-slider"
                    data-testid="slider-referrals"
                    value={[referralsPerAmbassador]}
                    onValueChange={(v) => setReferralsPerAmbassador(v[0])}
                    min={0}
                    max={20}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    id="referrals"
                    data-testid="input-referrals"
                    type="number"
                    value={referralsPerAmbassador}
                    onChange={(e) => setReferralsPerAmbassador(Math.min(20, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-20"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="months">Time Frame (months)</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    id="months-slider"
                    data-testid="slider-months"
                    value={[months]}
                    onValueChange={(v) => setMonths(v[0])}
                    min={1}
                    max={36}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    id="months"
                    data-testid="input-months"
                    type="number"
                    value={months}
                    onChange={(e) => setMonths(Math.min(36, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-20"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Sales Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <Label htmlFor="basic-sales">Basic Sales/Ambassador ($29/mo)</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    id="basic-sales-slider"
                    data-testid="slider-basic-sales"
                    value={[basicSales]}
                    onValueChange={(v) => setBasicSales(v[0])}
                    min={0}
                    max={20}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    id="basic-sales"
                    data-testid="input-basic-sales"
                    type="number"
                    value={basicSales}
                    onChange={(e) => setBasicSales(Math.min(20, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-16"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="pro-sales">Pro Sales/Ambassador ($79/mo)</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    id="pro-sales-slider"
                    data-testid="slider-pro-sales"
                    value={[proSales]}
                    onValueChange={(v) => setProSales(v[0])}
                    min={0}
                    max={20}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    id="pro-sales"
                    data-testid="input-pro-sales"
                    type="number"
                    value={proSales}
                    onChange={(e) => setProSales(Math.min(20, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-16"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="premium-sales">Premium Sales/Ambassador ($199/mo)</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    id="premium-sales-slider"
                    data-testid="slider-premium-sales"
                    value={[premiumSales]}
                    onValueChange={(v) => setPremiumSales(v[0])}
                    min={0}
                    max={20}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    id="premium-sales"
                    data-testid="input-premium-sales"
                    type="number"
                    value={premiumSales}
                    onChange={(e) => setPremiumSales(Math.min(20, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-16"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="sub-months">Avg Subscription Length (months)</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    id="sub-months-slider"
                    data-testid="slider-sub-months"
                    value={[avgSubscriptionMonths]}
                    onValueChange={(v) => setAvgSubscriptionMonths(v[0])}
                    min={1}
                    max={24}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    id="sub-months"
                    data-testid="input-sub-months"
                    type="number"
                    value={avgSubscriptionMonths}
                    onChange={(e) => setAvgSubscriptionMonths(Math.min(24, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-16"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600" data-testid="text-total-revenue">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-muted-foreground">{totalAmbassadors} ambassadors</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Product Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-500" data-testid="text-product-revenue">{formatCurrency(productRevenue)}</p>
              <p className="text-xs text-muted-foreground">{totalBasicSales + totalProSales + totalPremiumSales} subscriptions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Payouts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-500" data-testid="text-total-payouts">{formatCurrency(totalPayouts)}</p>
              <p className="text-xs text-muted-foreground">{totalReferrals} referrals</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Net Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${netRevenue >= 0 ? 'text-blue-600' : 'text-red-600'}`} data-testid="text-net-revenue">{formatCurrency(netRevenue)}</p>
              <p className="text-xs text-muted-foreground">{months} month period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Margin</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${netRevenue >= 0 ? 'text-blue-600' : 'text-red-600'}`} data-testid="text-margin">
                {totalRevenue > 0 ? ((netRevenue / totalRevenue) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-xs text-muted-foreground">net/revenue</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={formatCurrency} />
                    <YAxis type="category" dataKey="name" width={120} />
                    <Tooltip formatter={(v: number) => [formatCurrency(v), "Amount"]} />
                    <Bar dataKey="amount" fill="#22c55e" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <span>Ambassador Fees</span>
                  <span className="font-medium">{formatCurrency(ambassadorRevenue)}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span>Basic ({totalBasicSales} × ${BASIC_PRICE} × {avgSubscriptionMonths}mo)</span>
                  <span className="font-medium">{formatCurrency(basicRevenue)}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span>Pro ({totalProSales} × ${PRO_PRICE} × {avgSubscriptionMonths}mo)</span>
                  <span className="font-medium">{formatCurrency(proRevenue)}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span>Premium ({totalPremiumSales} × ${PREMIUM_PRICE} × {avgSubscriptionMonths}mo)</span>
                  <span className="font-medium">{formatCurrency(premiumRevenue)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payout Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={payoutData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={formatCurrency} />
                    <YAxis type="category" dataKey="name" width={120} />
                    <Tooltip formatter={(v: number) => [formatCurrency(v), "Amount"]} />
                    <Bar dataKey="amount" fill="#ef4444" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <span>Bonuses ({totalReferrals} × ${REFERRAL_BONUS})</span>
                  <span className="font-medium">{formatCurrency(totalReferrals * REFERRAL_BONUS)}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span>Overrides ({totalReferrals} × ${MONTHLY_OVERRIDE} × {months}mo)</span>
                  <span className="font-medium">{formatCurrency(totalReferrals * MONTHLY_OVERRIDE * months)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={flowData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                  >
                    {flowData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unit Economics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Revenue per Ambassador</p>
                <p className="text-lg font-bold">{formatCurrency(totalRevenue / totalAmbassadors)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Payout per Referral</p>
                <p className="text-lg font-bold">{formatCurrency(payoutPerReferral)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Product Rev/Ambassador</p>
                <p className="text-lg font-bold">{formatCurrency(productRevenue / totalAmbassadors)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Payout Ratio</p>
                <p className="text-lg font-bold">{totalRevenue > 0 ? ((totalPayouts / totalRevenue) * 100).toFixed(1) : 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-purple-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>BFT Buyback Parameters</span>
              <span className="text-xs font-normal text-muted-foreground">(BitForceToken.replit.app)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <Label htmlFor="buyback-percent">Buyback % of Monthly Profit</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    id="buyback-percent-slider"
                    data-testid="slider-buyback-percent"
                    value={[buybackPercent]}
                    onValueChange={(v) => setBuybackPercent(v[0])}
                    min={0}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <Input
                    id="buyback-percent"
                    data-testid="input-buyback-percent"
                    type="number"
                    value={buybackPercent}
                    onChange={(e) => setBuybackPercent(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-16"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="bft-price">Current BFT Price ($)</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    id="bft-price-slider"
                    data-testid="slider-bft-price"
                    value={[currentBftPrice * 1000]}
                    onValueChange={(v) => setCurrentBftPrice(v[0] / 1000)}
                    min={1}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    id="bft-price"
                    data-testid="input-bft-price"
                    type="number"
                    step="0.0001"
                    value={currentBftPrice}
                    onChange={(e) => setCurrentBftPrice(Math.max(0.0001, parseFloat(e.target.value) || 0.0055))}
                    className="w-20"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="circulating-supply">Circulating Supply (M)</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    id="circulating-supply-slider"
                    data-testid="slider-circulating-supply"
                    value={[circulatingSupply / 1_000_000]}
                    onValueChange={(v) => setCirculatingSupply(v[0] * 1_000_000)}
                    min={1}
                    max={500}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    id="circulating-supply"
                    data-testid="input-circulating-supply"
                    type="number"
                    value={circulatingSupply / 1_000_000}
                    onChange={(e) => setCirculatingSupply(Math.min(1000, Math.max(1, parseFloat(e.target.value) || 10)) * 1_000_000)}
                    className="w-16"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="price-elasticity">Price Elasticity (%)</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    id="price-elasticity-slider"
                    data-testid="slider-price-elasticity"
                    value={[priceElasticity]}
                    onValueChange={(v) => setPriceElasticity(v[0])}
                    min={0.5}
                    max={5}
                    step={0.1}
                    className="flex-1"
                  />
                  <Input
                    id="price-elasticity"
                    data-testid="input-price-elasticity"
                    type="number"
                    step="0.1"
                    value={priceElasticity}
                    onChange={(e) => setPriceElasticity(Math.min(10, Math.max(0.1, parseFloat(e.target.value) || 1.5)))}
                    className="w-16"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>BFT Activity Parameters</span>
              <span className="text-xs font-normal text-muted-foreground">(Ambassador Rewards)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div className="space-y-3">
                <Label htmlFor="avg-logins">Avg Logins/Month</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    id="avg-logins-slider"
                    data-testid="slider-avg-logins"
                    value={[avgLoginsPerMonth]}
                    onValueChange={(v) => setAvgLoginsPerMonth(v[0])}
                    min={0}
                    max={30}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    id="avg-logins"
                    data-testid="input-avg-logins"
                    type="number"
                    value={avgLoginsPerMonth}
                    onChange={(e) => setAvgLoginsPerMonth(Math.min(31, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-14"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="avg-contacts">Avg Contacts/Month</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    id="avg-contacts-slider"
                    data-testid="slider-avg-contacts"
                    value={[avgContactsPerMonth]}
                    onValueChange={(v) => setAvgContactsPerMonth(v[0])}
                    min={0}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <Input
                    id="avg-contacts"
                    data-testid="input-avg-contacts"
                    type="number"
                    value={avgContactsPerMonth}
                    onChange={(e) => setAvgContactsPerMonth(Math.min(200, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-14"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="avg-interests">Avg Interests/Month</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    id="avg-interests-slider"
                    data-testid="slider-avg-interests"
                    value={[avgInterestsPerMonth]}
                    onValueChange={(v) => setAvgInterestsPerMonth(v[0])}
                    min={0}
                    max={50}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    id="avg-interests"
                    data-testid="input-avg-interests"
                    type="number"
                    value={avgInterestsPerMonth}
                    onChange={(e) => setAvgInterestsPerMonth(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-14"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="avg-lessons">Lessons Completed</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    id="avg-lessons-slider"
                    data-testid="slider-avg-lessons"
                    value={[avgLessonsCompleted]}
                    onValueChange={(v) => setAvgLessonsCompleted(v[0])}
                    min={0}
                    max={30}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    id="avg-lessons"
                    data-testid="input-avg-lessons"
                    type="number"
                    value={avgLessonsCompleted}
                    onChange={(e) => setAvgLessonsCompleted(Math.min(50, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-14"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="avg-modules">Modules Completed</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    id="avg-modules-slider"
                    data-testid="slider-avg-modules"
                    value={[avgModulesCompleted]}
                    onValueChange={(v) => setAvgModulesCompleted(v[0])}
                    min={0}
                    max={10}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    id="avg-modules"
                    data-testid="input-avg-modules"
                    type="number"
                    value={avgModulesCompleted}
                    onChange={(e) => setAvgModulesCompleted(Math.min(20, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-14"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <p className="font-medium mb-1">BFT Reward Rates:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                <span>Signup: +{BFT_REWARDS.AMBASSADOR_SIGNUP}</span>
                <span>Login: +{BFT_REWARDS.DAILY_LOGIN}</span>
                <span>Contact: +{BFT_REWARDS.CUSTOMER_CONTACT}</span>
                <span>Interest: +{BFT_REWARDS.INTEREST_SHOWN}</span>
                <span>Sale: +{BFT_REWARDS.SALE_CLOSED}</span>
                <span>7-Day Streak: +{BFT_REWARDS.SEVEN_DAY_STREAK}</span>
                <span>30-Day Streak: +{BFT_REWARDS.THIRTY_DAY_STREAK}</span>
                <span>Lesson: +{BFT_REWARDS.LESSON_COMPLETED}</span>
                <span>Module: +{BFT_REWARDS.MODULE_COMPLETED}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-amber-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total BFT Awarded</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-600" data-testid="text-total-bft-awarded">
                {totalBftAwarded >= 1_000_000 ? `${(totalBftAwarded / 1_000_000).toFixed(2)}M` : totalBftAwarded >= 1000 ? `${(totalBftAwarded / 1000).toFixed(1)}K` : totalBftAwarded.toFixed(0)}
              </p>
              <p className="text-xs text-muted-foreground">to {totalAmbassadors} ambassadors</p>
            </CardContent>
          </Card>
          <Card className="border-amber-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">BFT Value Awarded</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-600" data-testid="text-bft-value-awarded">{formatCurrency(bftAwardedValue)}</p>
              <p className="text-xs text-muted-foreground">at ${currentBftPrice}/BFT</p>
            </CardContent>
          </Card>
          <Card className="border-amber-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">BFT per Ambassador</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-600" data-testid="text-bft-per-ambassador">
                {(totalBftAwarded / totalAmbassadors).toFixed(0)}
              </p>
              <p className="text-xs text-muted-foreground">over {months} months</p>
            </CardContent>
          </Card>
          <Card className={netBftFlow > 0 ? "border-red-500/30" : "border-green-500/30"}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Net Token Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${netBftFlow > 0 ? "text-red-600" : "text-green-600"}`} data-testid="text-net-token-flow">
                {netBftFlow >= 0 ? "+" : ""}{netBftFlow >= 1_000_000 ? `${(netBftFlow / 1_000_000).toFixed(2)}M` : netBftFlow >= 1000 || netBftFlow <= -1000 ? `${(netBftFlow / 1000).toFixed(1)}K` : netBftFlow.toFixed(0)}
              </p>
              <p className="text-xs text-muted-foreground">{netBftFlow > 0 ? "inflationary" : "deflationary"}</p>
            </CardContent>
          </Card>
        </div>

        {buybackExceedsSupply && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md text-sm text-yellow-700 dark:text-yellow-400">
            Note: At these settings, buyback would exceed circulating supply. Values are capped at 100% of circulating tokens.
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-purple-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Buyback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600" data-testid="text-total-buyback">{formatCurrency(totalBuybackSpend)}</p>
              <p className="text-xs text-muted-foreground">over {months} months</p>
            </CardContent>
          </Card>
          <Card className="border-purple-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Monthly Buyback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600" data-testid="text-monthly-buyback">{formatCurrency(monthlyBuybackAmount)}</p>
              <p className="text-xs text-muted-foreground">{buybackPercent}% of profit</p>
            </CardContent>
          </Card>
          <Card className="border-purple-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Tokens Burned</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600" data-testid="text-tokens-burned">
                {totalTokensBurned >= 1_000_000 ? `${(totalTokensBurned / 1_000_000).toFixed(2)}M` : totalTokensBurned >= 1000 ? `${(totalTokensBurned / 1000).toFixed(1)}K` : totalTokensBurned.toFixed(0)}
              </p>
              <p className="text-xs text-muted-foreground">{buybackExceedsSupply ? "(capped)" : `over ${months} months`}</p>
            </CardContent>
          </Card>
          <Card className="border-purple-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Supply Reduction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600" data-testid="text-supply-reduction">{supplyReductionPercent.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">{buybackExceedsSupply ? "(max 100%)" : "of circulating"}</p>
            </CardContent>
          </Card>
          <Card className="border-purple-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Projected Price</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600" data-testid="text-projected-price">${projectedBftPrice.toFixed(4)}</p>
              <p className="text-xs text-muted-foreground">+{(projectedPriceIncrease * 100).toFixed(1)}% from buyback</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-purple-500/30">
          <CardHeader>
            <CardTitle>BFT Price Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceProjectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" label={{ value: 'Month', position: 'bottom', offset: -5 }} />
                  <YAxis 
                    domain={['auto', 'auto']} 
                    tickFormatter={(v) => `$${v.toFixed(4)}`}
                  />
                  <Tooltip formatter={(v: number) => [`$${v.toFixed(4)}`, '']} labelFormatter={(l) => `Month ${l}`} />
                  <Legend />
                  <Line type="monotone" dataKey="baseline" name="No Buyback" stroke="#94a3b8" strokeDasharray="5 5" dot={false} />
                  <Line type="monotone" dataKey="price" name="With Buyback" stroke="#a855f7" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 bg-muted/50 rounded-md text-xs text-muted-foreground">
              <p className="font-medium mb-1">Model Assumptions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Price elasticity: {priceElasticity}% price increase per 1% supply reduction</li>
                <li>Total supply: 1B BFT (from BitForceToken tokenomics)</li>
                <li>Linear monthly buyback from net profit allocation</li>
                <li>Tokens are burned (removed from circulation permanently)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Flow Safeguards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold shrink-0">1</div>
                <div>
                  <p className="font-medium">Pending</p>
                  <p className="text-muted-foreground">Referral signs up - bonus created but not yet earned</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shrink-0">2</div>
                <div>
                  <p className="font-medium">Qualified</p>
                  <p className="text-muted-foreground">Referral completes first paid month - bonus earnable</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold shrink-0">3</div>
                <div>
                  <p className="font-medium">Paid</p>
                  <p className="text-muted-foreground">Referrer pays their next invoice - $50 bonus released</p>
                </div>
              </div>
              <div className="border-t pt-3 mt-3">
                <p className="text-muted-foreground">If the referrer cancels before Step 3, all pending/qualified bonuses are forfeited.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
