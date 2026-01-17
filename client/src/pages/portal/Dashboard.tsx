import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Target,
  ArrowUpRight,
  Calendar,
  Award,
  Zap,
  Flame,
  Trophy,
  Star,
  Crown,
  Sparkles,
  Coins,
  Info,
  ExternalLink,
  ShoppingCart,
  Wallet,
  CheckCircle,
  AlertCircle,
  Link2,
  Clock
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { LEVEL_THRESHOLDS, BADGE_DEFINITIONS, type BadgeType } from "@shared/schema";

interface GamificationStats {
  bftBalance: number;
  bftPlatformAvailable: boolean;
  legacyPoints: {
    totalPoints: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
  };
  badges: Array<{
    id: number;
    badgeType: string;
    earnedAt: string;
    definition: { name: string; description: string; icon: string } | null;
  }>;
  recentActions: Array<{
    id: number;
    actionType: string;
    pointsAwarded: number;
    description: string | null;
    createdAt: string;
  }>;
}

interface LeaderboardEntry {
  id: number;
  userId: string;
  totalPoints: number;
  level: number;
  currentStreak: number;
}

interface TokenPriceData {
  tokenPrice: number;
  priceChange24h: number;
  lastUpdated: string;
}

interface WalletBalanceData {
  earnedBft: number;
  purchasedBft: number;
  totalBft: number;
  totalInvested: number;
  purchaseCount: number;
  lastPurchaseDate: string | null;
}

interface WalletStatusData {
  ambassadorId?: string;
  externalId?: string;
  name?: string;
  wallets?: {
    devnet: { address: string; status: string; verified: boolean; linkedAt?: string; verifiedAt?: string } | null;
    mainnet: { address: string; status: string; verified: boolean; linkedAt?: string; verifiedAt?: string } | null;
  };
  hasVerifiedWallet: boolean;
  hasPendingWallet: boolean;
  eligibleForDistribution: boolean;
  tokensEarned: number;
  error?: string;
}

const badgeIcons: Record<string, typeof Star> = {
  star: Star,
  trophy: Trophy,
  flame: Flame,
  zap: Zap,
  crown: Crown,
  sparkles: Sparkles,
  award: Award,
  "trending-up": TrendingUp,
};

export default function Dashboard() {
  const { toast } = useToast();
  
  const { data: stats, isLoading: statsLoading } = useQuery<GamificationStats>({
    queryKey: ["/api/gamification/stats"],
  });

  const { data: leaderboard = [], isLoading: leaderboardLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/gamification/leaderboard"],
  });

  const { data: tokenPrice, isLoading: tokenPriceLoading } = useQuery<TokenPriceData>({
    queryKey: ["/api/bft/token-price"],
    retry: false,
    staleTime: 60000,
  });

  const { data: walletBalance } = useQuery<WalletBalanceData>({
    queryKey: ["/api/ambassador/wallet-balance"],
    staleTime: 30000,
  });

  const { data: walletStatus, isLoading: walletStatusLoading } = useQuery<WalletStatusData>({
    queryKey: ["/api/ambassador/wallet-status"],
    staleTime: 60000,
    retry: false,
  });

  const buyBftMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("GET", "/api/ambassador/sso-token");
      return response.json();
    },
    onSuccess: (data: { redirectUrl: string }) => {
      window.open(data.redirectUrl, "_blank");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to connect to Token Platform",
        variant: "destructive",
      });
    },
  });

  // Daily checkin - awards BFT for daily login
  const dailyCheckinRef = useRef(false);
  const dailyCheckinMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ambassador/daily-checkin");
      return response.json();
    },
    onSuccess: (data: { success: boolean; alreadyClaimed: boolean; bftAwarded: number; currentStreak?: number; streakBonus?: number }) => {
      if (data.success && !data.alreadyClaimed && data.bftAwarded > 0) {
        const streakMsg = data.streakBonus && data.streakBonus > 0 
          ? ` (includes ${data.streakBonus} BFT streak bonus!)` 
          : "";
        toast({
          title: "Daily Login Reward!",
          description: `You earned ${data.bftAwarded.toFixed(2)} BFT${streakMsg}. Streak: ${data.currentStreak || 1} days.`,
        });
      }
    },
    onError: () => {
      // Silently fail - don't disturb user experience
      console.log("[Daily Checkin] Failed to claim daily reward");
    },
  });

  // Auto-trigger daily checkin when dashboard loads
  useEffect(() => {
    if (!dailyCheckinRef.current) {
      dailyCheckinRef.current = true;
      dailyCheckinMutation.mutate();
    }
  }, []);

  // Use walletBalance for total BFT (earned + purchased), fallback to stats for earned only
  const totalBft = walletBalance?.totalBft ?? stats?.bftBalance ?? 0;
  const earnedBft = walletBalance?.earnedBft ?? stats?.bftBalance ?? 0;
  const purchasedBft = walletBalance?.purchasedBft ?? 0;
  const bftPlatformAvailable = stats?.bftPlatformAvailable || false;
  const currentLevel = stats?.legacyPoints?.level || 1;
  const totalPoints = stats?.legacyPoints?.totalPoints || 0;
  const currentStreak = stats?.legacyPoints?.currentStreak || 0;
  
  const currentThreshold = LEVEL_THRESHOLDS[currentLevel - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[currentLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const levelProgress = nextThreshold > currentThreshold 
    ? ((totalPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100
    : 100;

  const summaryStats = [
    { 
      title: "BFT Balance", 
      value: bftPlatformAvailable ? totalBft.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—", 
      change: purchasedBft > 0 ? `${earnedBft.toFixed(2)} earned + ${purchasedBft.toLocaleString()} purchased` : (bftPlatformAvailable ? "Token rewards" : "Connecting..."), 
      icon: Sparkles,
      color: "text-emerald-600"
    },
    { 
      title: "Current Level", 
      value: `Level ${currentLevel}`, 
      change: `${Math.round(levelProgress)}% to next`, 
      icon: TrendingUp,
      color: "text-blue-600"
    },
    { 
      title: "Day Streak", 
      value: currentStreak.toString(), 
      change: currentStreak > 0 ? "Keep it up!" : "Start today", 
      icon: Flame,
      color: "text-orange-600"
    },
    { 
      title: "Badges Earned", 
      value: (stats?.badges?.length || 0).toString(), 
      change: `of ${Object.keys(BADGE_DEFINITIONS).length} total`, 
      icon: Award,
      color: "text-purple-600"
    },
  ];

  if (statsLoading) {
    return (
      <div className="space-y-6" data-testid="page-dashboard">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your performance overview.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="page-dashboard">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your performance overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title} data-testid={`stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <IconComponent className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  {stat.change}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* BFT Token Price Info Card */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800" data-testid="section-bft-token-info">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                <Coins className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  BFT Token
                  {tokenPrice?.tokenPrice != null && tokenPrice?.priceChange24h != null && (
                    <Badge 
                      variant="secondary" 
                      className={tokenPrice.priceChange24h >= 0 
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" 
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }
                    >
                      {tokenPrice.priceChange24h >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {tokenPrice.priceChange24h >= 0 ? "+" : ""}{tokenPrice.priceChange24h.toFixed(2)}%
                    </Badge>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Earn BFT tokens for every action you take. Convert your rewards to real value or hold for future benefits.
                </p>
              </div>
            </div>
            <div className="text-right md:min-w-[140px]">
              {tokenPriceLoading ? (
                <Skeleton className="h-8 w-24 ml-auto" />
              ) : tokenPrice?.tokenPrice != null ? (
                <>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    ${tokenPrice.tokenPrice.toFixed(4)}
                  </div>
                  <div className="text-xs text-muted-foreground">per BFT token</div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                  <Info className="w-4 h-4" />
                  Price unavailable
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {bftPlatformAvailable && totalBft > 0 && tokenPrice?.tokenPrice != null ? (
              <div className="text-sm">
                <span className="text-muted-foreground">Your {totalBft.toLocaleString(undefined, { maximumFractionDigits: 2 })} BFT is worth</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 ml-2">
                  ${(totalBft * tokenPrice.tokenPrice).toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Access your unified BFT wallet on the Token Platform
              </div>
            )}
            <Button
              onClick={() => buyBftMutation.mutate()}
              disabled={buyBftMutation.isPending}
              variant="outline"
              size="sm"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-950 gap-2"
              data-testid="button-view-wallet"
            >
              {buyBftMutation.isPending ? (
                "Connecting..."
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  View Wallet
                  <ExternalLink className="w-3 h-3" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Buy BFT Tokens Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0" data-testid="section-buy-bft">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Buy BFT Tokens</h3>
                <p className="text-sm text-white/80 mt-1">
                  Invest in BFT tokens now at early-stage prices. Build your token portfolio before the public launch.
                </p>
              </div>
            </div>
            <Button
              onClick={() => buyBftMutation.mutate()}
              disabled={buyBftMutation.isPending}
              className="bg-white text-blue-600 hover:bg-white/90 font-semibold gap-2"
              data-testid="button-buy-bft"
            >
              {buyBftMutation.isPending ? (
                "Connecting..."
              ) : (
                <>
                  Buy BFT Tokens
                  <ExternalLink className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
            <span className="text-white/70">Secure SSO login to Token Platform</span>
            <Badge className="bg-white/20 text-white border-0 w-fit">Pre-Launch Price</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Status & Distribution Eligibility Card */}
      <Card 
        className={`border-2 ${
          walletStatus?.hasVerifiedWallet 
            ? "border-green-500/30 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30" 
            : walletStatus?.hasPendingWallet
              ? "border-yellow-500/30 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30"
              : "border-orange-500/30 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30"
        }`}
        data-testid="section-wallet-status"
      >
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${
                walletStatus?.hasVerifiedWallet 
                  ? "bg-green-100 dark:bg-green-900/50" 
                  : walletStatus?.hasPendingWallet
                    ? "bg-yellow-100 dark:bg-yellow-900/50"
                    : "bg-orange-100 dark:bg-orange-900/50"
              }`}>
                {walletStatus?.hasVerifiedWallet ? (
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                ) : walletStatus?.hasPendingWallet ? (
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                ) : (
                  <Link2 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  Wallet Status
                  {walletStatusLoading ? (
                    <Skeleton className="h-5 w-16" />
                  ) : (
                    <Badge 
                      className={
                        walletStatus?.hasVerifiedWallet 
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                          : walletStatus?.hasPendingWallet
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                      }
                    >
                      {walletStatus?.hasVerifiedWallet ? "Verified" : walletStatus?.hasPendingWallet ? "Pending" : "Not Linked"}
                    </Badge>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {walletStatus?.hasVerifiedWallet 
                    ? "Your Solana wallet is verified and ready for BFT token distributions." 
                    : walletStatus?.hasPendingWallet
                      ? "Your wallet is linked but awaiting verification. Complete verification to receive distributions."
                      : "Link your Solana wallet to receive BFT token distributions and airdrops."}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {walletStatus?.eligibleForDistribution ? (
                <Badge className="bg-green-600 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Distribution Eligible
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-muted-foreground">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Not Eligible
                </Badge>
              )}
              {!walletStatus?.hasVerifiedWallet && (
                <Button
                  onClick={() => buyBftMutation.mutate()}
                  disabled={buyBftMutation.isPending}
                  size="sm"
                  className="gap-2"
                  data-testid="button-link-wallet"
                >
                  {buyBftMutation.isPending ? (
                    "Connecting..."
                  ) : (
                    <>
                      <Link2 className="w-4 h-4" />
                      Link Wallet
                      <ExternalLink className="w-3 h-3" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
          {walletStatus?.wallets?.mainnet && (
            <div className="mt-4 pt-4 border-t text-sm">
              <span className="text-muted-foreground">Mainnet Wallet: </span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {walletStatus.wallets.mainnet.address.slice(0, 8)}...{walletStatus.wallets.mainnet.address.slice(-6)}
              </code>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card data-testid="section-level-progress">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Level Progress
              </CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                Level {currentLevel}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={levelProgress} className="h-3" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Current XP</div>
                <div className="font-bold text-lg">{totalPoints.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Next Level At</div>
                <div className="font-bold text-lg text-blue-600">{nextThreshold.toLocaleString()} XP</div>
              </div>
            </div>
            {currentStreak >= 7 && (
              <div className="flex items-center gap-2 text-sm bg-orange-50 dark:bg-orange-950/30 p-3 rounded-md">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>{currentStreak}-day streak! <span className="font-bold">Keep the momentum!</span></span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="section-leaderboard">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Leaderboard
              </CardTitle>
              <Badge variant="secondary">Top {leaderboard.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {leaderboardLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : leaderboard.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Be the first on the leaderboard! Start earning points.
              </p>
            ) : (
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((entry, index) => {
                  const rankColors = ["text-amber-500", "text-gray-400", "text-orange-600"];
                  return (
                    <div 
                      key={entry.id}
                      className="flex items-center justify-between gap-4 py-2 border-b last:border-0"
                      data-testid={`leaderboard-${index}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`font-bold text-lg w-6 ${rankColors[index] || "text-muted-foreground"}`}>
                          #{index + 1}
                        </span>
                        <div>
                          <div className="font-medium">Ambassador</div>
                          <div className="text-xs text-muted-foreground">Level {entry.level}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{entry.totalPoints.toLocaleString()} pts</div>
                        {entry.currentStreak > 0 && (
                          <div className="text-xs text-orange-600 flex items-center justify-end gap-1">
                            <Flame className="w-3 h-3" />
                            {entry.currentStreak} day streak
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card data-testid="section-badges">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-500" />
              Your Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.badges && stats.badges.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {stats.badges.map((badge) => {
                  const iconName = badge.definition?.icon || "award";
                  const IconComponent = badgeIcons[iconName] || Award;
                  return (
                    <Badge 
                      key={badge.id}
                      className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                      data-testid={`badge-${badge.badgeType}`}
                    >
                      <IconComponent className="w-3 h-3 mr-1" />
                      {badge.definition?.name || badge.badgeType}
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No badges yet. Complete actions to earn your first badge!
              </p>
            )}
            
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground mb-2">Available badges to earn:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(BADGE_DEFINITIONS).map(([key, def]) => {
                  const earned = stats?.badges?.some(b => b.badgeType === key);
                  const IconComponent = badgeIcons[def.icon] || Award;
                  return (
                    <Badge 
                      key={key}
                      variant="outline"
                      className={earned ? "opacity-50" : ""}
                      data-testid={`available-badge-${key}`}
                    >
                      <IconComponent className="w-3 h-3 mr-1" />
                      {def.name}
                      {earned && " (Earned)"}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="section-recent-activity">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Recent Activity
              </CardTitle>
              <Badge variant="secondary">{stats?.recentActions?.length || 0} actions</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {stats?.recentActions && stats.recentActions.length > 0 ? (
              <div className="space-y-3">
                {stats.recentActions.slice(0, 5).map((action) => (
                  <div 
                    key={action.id}
                    className="flex items-center justify-between gap-4 py-2 border-b last:border-0"
                    data-testid={`activity-${action.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {action.description || action.actionType.replace(/_/g, " ")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {action.createdAt 
                          ? formatDistanceToNow(new Date(action.createdAt), { addSuffix: true })
                          : "Recently"
                        }
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      +{action.pointsAwarded} pts
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent activity. Start by adding services to your leads!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
