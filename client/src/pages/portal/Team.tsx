import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  TrendingUp,
  DollarSign,
  UserPlus,
  Award,
  Crown,
  Star,
  Mail,
  Phone
} from "lucide-react";

const teamStats = {
  totalRecruits: 8,
  activeRecruits: 6,
  teamSalesThisMonth: 42,
  overrideEarnings: "$840"
};

const teamMembers = [
  { 
    id: 1,
    name: "Alex Johnson", 
    initials: "AJ",
    email: "alex.j@email.com",
    phone: "(555) 111-2222",
    joinDate: "3 months ago",
    salesThisMonth: 12,
    totalSales: 45,
    earnings: "$3,200",
    status: "active",
    rank: "rising-star"
  },
  { 
    id: 2,
    name: "Maria Garcia", 
    initials: "MG",
    email: "maria.g@email.com",
    phone: "(555) 222-3333",
    joinDate: "2 months ago",
    salesThisMonth: 8,
    totalSales: 22,
    earnings: "$1,850",
    status: "active",
    rank: "standard"
  },
  { 
    id: 3,
    name: "James Lee", 
    initials: "JL",
    email: "james.l@email.com",
    phone: "(555) 333-4444",
    joinDate: "1 month ago",
    salesThisMonth: 10,
    totalSales: 15,
    earnings: "$2,100",
    status: "active",
    rank: "standard"
  },
  { 
    id: 4,
    name: "Emma Davis", 
    initials: "ED",
    email: "emma.d@email.com",
    phone: "(555) 444-5555",
    joinDate: "3 weeks ago",
    salesThisMonth: 5,
    totalSales: 5,
    earnings: "$750",
    status: "active",
    rank: "new"
  },
  { 
    id: 5,
    name: "Chris Brown", 
    initials: "CB",
    email: "chris.b@email.com",
    phone: "(555) 555-6666",
    joinDate: "2 weeks ago",
    salesThisMonth: 4,
    totalSales: 4,
    earnings: "$520",
    status: "active",
    rank: "new"
  },
  { 
    id: 6,
    name: "Sofia Martinez", 
    initials: "SM",
    email: "sofia.m@email.com",
    phone: "(555) 666-7777",
    joinDate: "1 week ago",
    salesThisMonth: 3,
    totalSales: 3,
    earnings: "$380",
    status: "active",
    rank: "new"
  },
];

const rankConfig: Record<string, { label: string; color: string; icon: typeof Star }> = {
  "rising-star": { label: "Rising Star", color: "bg-amber-100 text-amber-800", icon: Star },
  "standard": { label: "Active", color: "bg-blue-100 text-blue-800", icon: Users },
  "new": { label: "New", color: "bg-green-100 text-green-800", icon: UserPlus },
};

const recruitmentMilestones = [
  { milestone: 10, bonus: "$1,800", current: 8, unlocked: false },
  { milestone: 25, bonus: "$6,000", current: 8, unlocked: false },
];

export default function Team() {
  return (
    <div className="space-y-6" data-testid="page-team">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">My Team</h1>
          <p className="text-muted-foreground">Manage and track your recruited ambassadors</p>
        </div>
        <Button data-testid="button-invite-ambassador">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Ambassador
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card data-testid="stat-total-recruits">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Recruits
            </CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.totalRecruits}</div>
            <div className="text-xs text-muted-foreground">{teamStats.activeRecruits} active</div>
          </CardContent>
        </Card>

        <Card data-testid="stat-team-sales">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Team Sales (Month)
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.teamSalesThisMonth}</div>
            <div className="text-xs text-green-600">Great momentum!</div>
          </CardContent>
        </Card>

        <Card data-testid="stat-override-earnings">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Override Earnings
            </CardTitle>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{teamStats.overrideEarnings}</div>
            <div className="text-xs text-muted-foreground">5% on team sales</div>
          </CardContent>
        </Card>

        <Card data-testid="stat-next-milestone">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Next Milestone
            </CardTitle>
            <Award className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10 Recruits</div>
            <div className="text-xs text-amber-600">2 more to unlock $1,800 bonus</div>
          </CardContent>
        </Card>
      </div>

      <Card data-testid="section-milestones">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            Recruitment Milestones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recruitmentMilestones.map((m) => (
            <div key={m.milestone} className="space-y-2">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="font-medium">{m.milestone} Recruits</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {m.bonus} Bonus
                </Badge>
              </div>
              <Progress value={(m.current / m.milestone) * 100} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {m.current} / {m.milestone} ({m.milestone - m.current} more needed)
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card data-testid="section-team-members">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => {
              const rank = rankConfig[member.rank];
              const RankIcon = rank.icon;
              return (
                <Card key={member.id} className="p-4" data-testid={`member-${member.id}`}>
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{member.name}</h3>
                          <Badge className={rank.color}>
                            <RankIcon className="w-3 h-3 mr-1" />
                            {rank.label}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">Joined {member.joinDate}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center lg:text-right">
                      <div>
                        <div className="text-lg font-bold">{member.salesThisMonth}</div>
                        <div className="text-xs text-muted-foreground">This Month</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{member.totalSales}</div>
                        <div className="text-xs text-muted-foreground">Total Sales</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">{member.earnings}</div>
                        <div className="text-xs text-muted-foreground">Earnings</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" data-testid={`button-call-member-${member.id}`}>
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" data-testid={`button-email-member-${member.id}`}>
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
