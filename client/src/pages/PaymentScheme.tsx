import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const revenueData = [
  { name: "Signup Fee", amount: 29, type: "One-time" },
  { name: "Monthly Sub", amount: 19.99, type: "Recurring" },
];

const payoutData = [
  { name: "Referral Bonus", amount: 50, type: "One-time" },
  { name: "Monthly Override", amount: 4, type: "Recurring" },
];

const flowData = [
  { name: "Revenue per Ambassador", value: 29 + (19.99 * 12), color: "#22c55e" },
  { name: "Max Payout per Referral", value: 50 + (4 * 12), color: "#ef4444" },
];

const COLORS = ["#22c55e", "#ef4444"];

export default function PaymentScheme() {
  const yearlyRevenue = 29 + (19.99 * 12);
  const yearlyPayout = 50 + (4 * 12);
  const netPerReferral = yearlyRevenue - yearlyPayout;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Ambassador Payment Scheme</h1>
          <p className="text-muted-foreground mt-2">Revenue and payout structure overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Year 1 Revenue/Ambassador</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600" data-testid="text-yearly-revenue">${yearlyRevenue.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Max Payout/Referral</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-500" data-testid="text-yearly-payout">${yearlyPayout.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Net per Self-Referral</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600" data-testid="text-net-revenue">${netPerReferral.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(v) => `$${v}`} />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip formatter={(v: number) => [`$${v}`, "Amount"]} />
                    <Bar dataKey="amount" fill="#22c55e" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Signup Fee (one-time)</span>
                  <span className="font-medium">$29.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Subscription</span>
                  <span className="font-medium">$19.99/mo</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payout Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={payoutData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(v) => `$${v}`} />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip formatter={(v: number) => [`$${v}`, "Amount"]} />
                    <Bar dataKey="amount" fill="#ef4444" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Referral Bonus (one-time)</span>
                  <span className="font-medium">$50.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Override (20%)</span>
                  <span className="font-medium">$4.00/mo</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Annual Cash Flow Comparison</CardTitle>
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
                    label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                  >
                    {flowData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `$${v.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
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
