import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target,
  ArrowUpRight,
  Calendar,
  Award,
  Zap
} from "lucide-react";

const stats = [
  { 
    title: "This Month's Earnings", 
    value: "$4,250", 
    change: "+12%", 
    icon: DollarSign,
    color: "text-green-600"
  },
  { 
    title: "Total Sales", 
    value: "24", 
    change: "+3", 
    icon: Target,
    color: "text-blue-600"
  },
  { 
    title: "Team Members", 
    value: "8", 
    change: "+2", 
    icon: Users,
    color: "text-purple-600"
  },
  { 
    title: "Conversion Rate", 
    value: "68%", 
    change: "+5%", 
    icon: TrendingUp,
    color: "text-amber-600"
  },
];

const recentSales = [
  { service: "Roofing Project", customer: "John M.", amount: "$450", date: "Today", status: "completed" },
  { service: "AI Assistant Setup", customer: "Sarah K.", amount: "$100", date: "Yesterday", status: "completed" },
  { service: "Home Financing", customer: "Mike R.", amount: "$1,250", date: "2 days ago", status: "pending" },
  { service: "Driveway Paving", customer: "Lisa T.", amount: "$375", date: "3 days ago", status: "completed" },
  { service: "Plumbing Services", customer: "David W.", amount: "$120", date: "5 days ago", status: "completed" },
];

const monthlyGoal = {
  target: 30,
  current: 24,
  earnings: "$4,250",
  potential: "$5,500"
};

export default function Dashboard() {
  const goalProgress = (monthlyGoal.current / monthlyGoal.target) * 100;

  return (
    <div className="space-y-6" data-testid="page-dashboard">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your performance overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
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
                <div className="flex items-center text-xs text-green-600">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  {stat.change} from last month
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card data-testid="section-monthly-goal">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Monthly Goal
              </CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {Math.round(goalProgress)}% Complete
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={goalProgress} className="h-3" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Sales</div>
                <div className="font-bold text-lg">{monthlyGoal.current} / {monthlyGoal.target}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Earnings Progress</div>
                <div className="font-bold text-lg text-green-600">{monthlyGoal.earnings}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Hit your goal to unlock <span className="font-bold">bonus rewards!</span></span>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="section-recent-sales">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Recent Sales
              </CardTitle>
              <Badge variant="secondary">{recentSales.length} this week</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSales.map((sale, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between gap-4 py-2 border-b last:border-0"
                  data-testid={`sale-${index}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{sale.service}</div>
                    <div className="text-sm text-muted-foreground">{sale.customer}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{sale.amount}</div>
                    <div className="text-xs text-muted-foreground">{sale.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card data-testid="section-achievements">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              <Award className="w-3 h-3 mr-1" />
              First Sale
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <Users className="w-3 h-3 mr-1" />
              Team Builder
            </Badge>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <DollarSign className="w-3 h-3 mr-1" />
              $1K Month
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              <Target className="w-3 h-3 mr-1" />
              Goal Crusher
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
