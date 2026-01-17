import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const SIGNUP_FEE = 29;
const MONTHLY_SUB = 19.99;
const REFERRAL_BONUS = 50;
const MONTHLY_OVERRIDE = 4;

export default function PaymentScheme() {
  const [ambassadors, setAmbassadors] = useState(100);
  const [referralsPerAmbassador, setReferralsPerAmbassador] = useState(2);
  const [months, setMonths] = useState(12);

  const revenuePerAmbassador = SIGNUP_FEE + (MONTHLY_SUB * months);
  const payoutPerReferral = REFERRAL_BONUS + (MONTHLY_OVERRIDE * months);
  
  const totalReferrals = ambassadors * referralsPerAmbassador;
  const totalRevenue = ambassadors * revenuePerAmbassador;
  const totalPayouts = totalReferrals * payoutPerReferral;
  const netRevenue = totalRevenue - totalPayouts;

  const revenueData = [
    { name: "Signup Fees", amount: ambassadors * SIGNUP_FEE },
    { name: "Subscriptions", amount: ambassadors * MONTHLY_SUB * months },
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
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Scenario Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label htmlFor="ambassadors">Number of Ambassadors</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    id="ambassadors-slider"
                    data-testid="slider-ambassadors"
                    value={[ambassadors]}
                    onValueChange={(v) => setAmbassadors(v[0])}
                    min={10}
                    max={1000}
                    step={10}
                    className="flex-1"
                  />
                  <Input
                    id="ambassadors"
                    data-testid="input-ambassadors"
                    type="number"
                    value={ambassadors}
                    onChange={(e) => setAmbassadors(Math.min(1000, Math.max(10, parseInt(e.target.value) || 10)))}
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600" data-testid="text-total-revenue">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-muted-foreground">{ambassadors} ambassadors</p>
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
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={formatCurrency} />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip formatter={(v: number) => [formatCurrency(v), "Amount"]} />
                    <Bar dataKey="amount" fill="#22c55e" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <span>Signup Fees ({ambassadors} × ${SIGNUP_FEE})</span>
                  <span className="font-medium">{formatCurrency(ambassadors * SIGNUP_FEE)}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span>Subscriptions ({ambassadors} × ${MONTHLY_SUB} × {months}mo)</span>
                  <span className="font-medium">{formatCurrency(ambassadors * MONTHLY_SUB * months)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payout Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={payoutData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={formatCurrency} />
                    <YAxis type="category" dataKey="name" width={100} />
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
                <p className="text-lg font-bold">{formatCurrency(revenuePerAmbassador)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Payout per Referral</p>
                <p className="text-lg font-bold">{formatCurrency(payoutPerReferral)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Break-even Referrals</p>
                <p className="text-lg font-bold">{payoutPerReferral > 0 ? (revenuePerAmbassador / payoutPerReferral).toFixed(2) : '∞'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Current Ratio</p>
                <p className="text-lg font-bold">{referralsPerAmbassador} referrals/amb</p>
              </div>
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
