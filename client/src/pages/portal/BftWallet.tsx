import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Coins, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Calendar,
  Users,
  Phone,
  Star,
  Flame,
  ShoppingCart,
  FileText,
  Gift,
  Settings,
  DollarSign,
  Wallet,
  Award
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow, format } from "date-fns";

interface BftTransaction {
  id: number;
  ambassadorId: number;
  transactionType: string;
  amount: string;
  balanceAfter: string;
  description: string | null;
  referenceId: string | null;
  referenceType: string | null;
  createdAt: string;
}

interface BftBalanceData {
  balance: string;
  lastUpdated: string | null;
  transactions: BftTransaction[];
}

interface WalletBalanceData {
  earnedBft: number;
  purchasedBft: number;
  totalBft: number;
  totalInvested: number;
  purchaseCount: number;
  lastPurchaseDate: string | null;
}

const transactionTypeConfig: Record<string, { label: string; icon: typeof Coins; color: string }> = {
  daily_login: { label: "Daily Login", icon: Calendar, color: "text-blue-600" },
  ambassador_signup: { label: "Ambassador Signup", icon: Users, color: "text-green-600" },
  customer_contact: { label: "Customer Contact", icon: Phone, color: "text-purple-600" },
  interest_shown: { label: "Interest Shown", icon: Star, color: "text-yellow-600" },
  sale_closed: { label: "Sale Closed", icon: ShoppingCart, color: "text-emerald-600" },
  streak_7day: { label: "7-Day Streak", icon: Flame, color: "text-orange-600" },
  streak_30day: { label: "30-Day Streak", icon: Flame, color: "text-red-600" },
  service_logged: { label: "Service Logged", icon: FileText, color: "text-cyan-600" },
  referral_bonus: { label: "Referral Bonus", icon: Gift, color: "text-pink-600" },
  admin_adjustment: { label: "Admin Adjustment", icon: Settings, color: "text-gray-600" },
  GENERATE_DESIGN: { label: "Design Generated", icon: Star, color: "text-indigo-600" },
  SUGGEST_SERVICE: { label: "Service Suggested", icon: FileText, color: "text-teal-600" },
  COMPLETE_LESSON: { label: "Lesson Completed", icon: Award, color: "text-blue-600" },
  COMPLETE_MODULE: { label: "Module Completed", icon: Award, color: "text-amber-600" },
};

export default function BftWallet() {
  const { data: bftData, isLoading } = useQuery<BftBalanceData>({
    queryKey: ["/api/ambassador/bft/balance"],
  });

  const { data: walletBalance, isLoading: walletLoading } = useQuery<WalletBalanceData>({
    queryKey: ["/api/ambassador/wallet-balance"],
    staleTime: 30000,
  });

  const { data: allTransactions, isLoading: transactionsLoading } = useQuery<BftTransaction[]>({
    queryKey: ["/api/ambassador/bft/transactions"],
  });

  // Combined balance from both earned (local) and purchased (BitForceToken platform)
  const earnedBft = walletBalance?.earnedBft ?? parseFloat(bftData?.balance || "0");
  const purchasedBft = walletBalance?.purchasedBft ?? 0;
  const totalBft = walletBalance?.totalBft ?? earnedBft;
  const totalInvested = walletBalance?.totalInvested ?? 0;
  const purchaseCount = walletBalance?.purchaseCount ?? 0;
  
  const estimatedValue = totalBft * 0.02;
  const transactions = allTransactions || bftData?.transactions || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">BFT Wallet</h1>
        <p className="text-muted-foreground">
          Track your Bit Force Token earnings and transaction history
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card data-testid="card-bft-balance">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total BFT Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="text-bft-balance">{totalBft.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Sparkles className="inline h-3 w-3 mr-1" />
              Earned + Purchased tokens
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-earned-bft">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earned BFT</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600" data-testid="text-earned-bft">{earnedBft.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From ambassador activities
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-purchased-bft">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Purchased BFT</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600" data-testid="text-purchased-bft">{purchasedBft.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {purchaseCount > 0 ? `${purchaseCount} purchase${purchaseCount !== 1 ? 's' : ''} ($${totalInvested.toLocaleString()})` : "From Token Platform"}
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-estimated-value">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="text-estimated-value">${estimatedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground mt-1">
              @ $0.02 per BFT
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20" data-testid="card-launch-status">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Launch Status
          </CardTitle>
          <Badge variant="outline" data-testid="badge-launch-countdown">
            30 Days to On-Chain
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your tokens will be available on-chain after the official launch. Both earned and purchased BFT will be combined in your wallet.
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5" data-testid="card-earning-opportunities">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Earning Opportunities
          </CardTitle>
          <CardDescription>
            Ways to earn BFT tokens before the on-chain launch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3" data-testid="earning-ambassador-signup">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-2">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Ambassador Signup</p>
                <p className="text-sm text-muted-foreground">+50 BFT per referral</p>
              </div>
            </div>
            <div className="flex items-start gap-3" data-testid="earning-daily-login">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Daily Login</p>
                <p className="text-sm text-muted-foreground">+0.2 BFT per day</p>
              </div>
            </div>
            <div className="flex items-start gap-3" data-testid="earning-sale-closed">
              <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-2">
                <ShoppingCart className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium">Sale Closed</p>
                <p className="text-sm text-muted-foreground">+5 BFT per sale</p>
              </div>
            </div>
            <div className="flex items-start gap-3" data-testid="earning-streak">
              <div className="rounded-full bg-orange-100 dark:bg-orange-900/30 p-2">
                <Flame className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium">30-Day Streak</p>
                <p className="text-sm text-muted-foreground">+10 BFT bonus</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Your recent BFT earnings and activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12" data-testid="empty-transactions">
              <Coins className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground" data-testid="text-no-transactions">No transactions yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Start earning BFT by logging in daily, contacting customers, and closing sales!
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {transactions.map((tx, index) => {
                  const config = transactionTypeConfig[tx.transactionType] || {
                    label: tx.transactionType,
                    icon: Coins,
                    color: "text-gray-600"
                  };
                  const Icon = config.icon;
                  const amount = parseFloat(tx.amount);
                  const isPositive = amount > 0;

                  return (
                    <div key={tx.id}>
                      <div className="flex items-center gap-4" data-testid={`transaction-row-${tx.id}`}>
                        <div className={`rounded-full bg-muted p-2 ${config.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{config.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {tx.description || formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            {isPositive ? '+' : ''}{amount.toFixed(2)} BFT
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(tx.createdAt), 'MMM d, h:mm a')}
                          </p>
                        </div>
                      </div>
                      {index < transactions.length - 1 && <Separator className="mt-4" />}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
