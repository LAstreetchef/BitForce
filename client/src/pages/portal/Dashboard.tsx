import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Info
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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

  const bftBalance = stats?.bftBalance || 0;
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
      value: bftPlatformAvailable ? bftBalance.toFixed(2) : "—", 
      change: bftPlatformAvailable ? "Token rewards" : "Connecting...", 
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
                  {tokenPrice && (
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
              ) : tokenPrice ? (
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
          {bftPlatformAvailable && bftBalance > 0 && tokenPrice && (
            <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Your {bftBalance.toFixed(2)} BFT is worth</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                ${(bftBalance * tokenPrice.tokenPrice).toFixed(2)}
              </span>
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
