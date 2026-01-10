import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Coins, 
  Rocket, 
  Users, 
  TrendingUp, 
  Shield, 
  Clock, 
  Star,
  CheckCircle,
  ArrowRight,
  Zap,
  Crown,
  Target,
  Award
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend
} from "recharts";
import tokenImage from "@assets/generated_images/bitforce_token_cryptocurrency_coin.png";

const tokenValueData = [
  { phase: "Pre-ICO", value: 0.01, label: "You Are Here" },
  { phase: "ICO Launch", value: 0.05, label: "" },
  { phase: "Exchange Listing", value: 0.15, label: "" },
  { phase: "Year 1", value: 0.35, label: "" },
  { phase: "Year 2", value: 0.75, label: "Projected" },
];

const earlyAdopterBonuses = [
  { tier: "Founding\nAmbassador", bonus: 100, color: "#FFD700", description: "First 50 ambassadors" },
  { tier: "Pioneer\nAmbassador", bonus: 50, color: "#C0C0C0", description: "Ambassadors 51-200" },
  { tier: "Early\nAmbassador", bonus: 25, color: "#CD7F32", description: "Ambassadors 201-500" },
  { tier: "Standard\nAmbassador", bonus: 0, color: "#6B7280", description: "After ICO launch" },
];

const tokenDistribution = [
  { name: "Ambassador Rewards", value: 40, color: "#3B82F6" },
  { name: "Customer Rewards", value: 25, color: "#10B981" },
  { name: "Company Reserve", value: 20, color: "#8B5CF6" },
  { name: "Early Investors", value: 10, color: "#F59E0B" },
  { name: "Team & Advisors", value: 5, color: "#EF4444" },
];

const comparisonData = [
  { 
    feature: "Earning Rewards",
    points: "Earn points in our system",
    token: "Earn real cryptocurrency tokens"
  },
  { 
    feature: "Value Over Time",
    points: "Points stay the same value",
    token: "Tokens can increase in value"
  },
  { 
    feature: "Ownership",
    points: "Company controls your points",
    token: "You own your tokens in your wallet"
  },
  { 
    feature: "Transferability",
    points: "Cannot send to others",
    token: "Send tokens to anyone, anytime"
  },
  { 
    feature: "Cash Out",
    points: "Redeem for limited rewards",
    token: "Sell on exchanges for real money"
  },
];

export default function TokenPitch() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white" data-testid="page-token-pitch">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)]" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 mb-4">
                <Rocket className="w-3 h-3 mr-1" />
                Pre-ICO Opportunity
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-amber-200 bg-clip-text text-transparent">
                Introducing BitForce Token
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl">
                The future of ambassador rewards. Earn real cryptocurrency instead of points. 
                <span className="font-semibold text-amber-300"> Early adopters get up to 100% bonus tokens.</span>
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-bold" data-testid="button-join-preico">
                  <Star className="w-5 h-5 mr-2" />
                  Join Pre-ICO Now
                </Button>
                <Button size="lg" variant="outline" className="border-blue-400 text-blue-200" data-testid="button-learn-more">
                  Learn More
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400/20 blur-3xl rounded-full" />
                <img 
                  src={tokenImage} 
                  alt="BitForce Token" 
                  className="w-64 h-64 md:w-80 md:h-80 relative z-10 drop-shadow-2xl"
                  data-testid="img-token-hero"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is BFC Token - Simple Explanation */}
      <section className="py-16 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What is BitForce Token (BFC)?</h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Think of it like airline miles, but way better. Instead of earning points that only work in our system, 
              you earn real digital coins that you actually own.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-800/80 border-blue-500/30">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Earn By Doing</h3>
                <p className="text-slate-300">
                  Every lead you create, every sale you close, every customer you help - you earn BFC tokens automatically.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/80 border-green-500/30">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Watch It Grow</h3>
                <p className="text-slate-300">
                  Unlike points that never change, your tokens can increase in value as BitForce grows and more people use the platform.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/80 border-amber-500/30">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">You Own It</h3>
                <p className="text-slate-300">
                  Your tokens live in your own digital wallet. Send them to friends, save them, or cash them out - it's your choice.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Points vs Tokens Comparison */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Points vs. Tokens: What's the Difference?</h2>
            <p className="text-xl text-blue-200">Here's why tokens are a game-changer for you</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-4 px-4 text-slate-400">Feature</th>
                  <th className="text-center py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 bg-slate-500 rounded-full" />
                      <span className="text-slate-400">Old Points System</span>
                    </div>
                  </th>
                  <th className="text-center py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-full" />
                      <span className="text-amber-400 font-bold">BFC Token</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={index} className="border-b border-slate-800">
                    <td className="py-4 px-4 font-medium text-white">{row.feature}</td>
                    <td className="py-4 px-4 text-center text-slate-400">{row.points}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-green-400 flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {row.token}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pre-ICO Early Adopter Bonuses */}
      <section className="py-16 px-4 bg-gradient-to-r from-amber-900/20 via-amber-800/10 to-amber-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-red-500/20 text-red-300 border-red-500/30 mb-4">
              <Clock className="w-3 h-3 mr-1" />
              Limited Time Opportunity
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Early Bird Gets the Tokens</h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Join during the pre-ICO phase and earn <span className="text-amber-400 font-bold">bonus tokens on everything you do</span>. 
              The earlier you join, the bigger your bonus.
            </p>
          </div>

          {/* Bonus Tiers Visual */}
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            {earlyAdopterBonuses.map((tier, index) => (
              <Card 
                key={index} 
                className={`relative overflow-hidden ${index === 0 ? 'ring-2 ring-amber-400 bg-slate-800' : 'bg-slate-800/60'}`}
              >
                {index === 0 && (
                  <div className="absolute top-0 right-0 bg-amber-500 text-black text-xs font-bold px-2 py-1">
                    YOU ARE HERE
                  </div>
                )}
                <CardContent className="pt-6 text-center">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${tier.color}20` }}
                  >
                    <Crown className="w-8 h-8" style={{ color: tier.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 whitespace-pre-line">{tier.tier}</h3>
                  <p className="text-sm text-slate-400 mb-3">{tier.description}</p>
                  <div 
                    className="text-3xl font-bold"
                    style={{ color: tier.color }}
                  >
                    +{tier.bonus}%
                  </div>
                  <p className="text-xs text-slate-500">Bonus Tokens</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bonus Chart */}
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                Bonus Rate Decreases Over Time - Don't Wait!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={earlyAdopterBonuses} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" domain={[0, 100]} stroke="#9CA3AF" tickFormatter={(v) => `${v}%`} />
                    <YAxis dataKey="tier" type="category" stroke="#9CA3AF" width={100} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#fff' }}
                      formatter={(value: number) => [`${value}% Bonus`, 'Bonus Rate']}
                    />
                    <Bar dataKey="bonus" radius={[0, 4, 4, 0]}>
                      {earlyAdopterBonuses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Projected Token Value */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Potential Token Value Growth</h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Early tokens are priced low. As the platform grows and demand increases, 
              token value has the potential to rise significantly.
            </p>
          </div>

          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Projected BFC Token Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={tokenValueData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="phase" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" tickFormatter={(v) => `$${v}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#fff' }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Token Value']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#F59E0B" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-center text-sm text-slate-400 mt-4">
                * Projections are illustrative and not guaranteed. Cryptocurrency values can go up or down.
              </p>
            </CardContent>
          </Card>

          {/* Value Example */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  Example: Active Ambassador
                </h3>
                <div className="space-y-3 text-slate-300">
                  <p>Let's say you earn <span className="text-amber-400 font-bold">10,000 BFC tokens</span> during pre-ICO...</p>
                  <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>Pre-ICO Value:</span>
                      <span className="text-white">10,000 x $0.01 = <strong>$100</strong></span>
                    </div>
                    <div className="flex justify-between">
                      <span>+ 100% Founding Bonus:</span>
                      <span className="text-amber-400">+10,000 tokens FREE</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-600 pt-2">
                      <span>Your Total:</span>
                      <span className="text-green-400 font-bold">20,000 BFC tokens</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-900/30 to-slate-900 border-amber-500/30">
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Potential Future Value
                </h3>
                <div className="space-y-3 text-slate-300">
                  <p>If token reaches projected Year 2 value...</p>
                  <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>Your 20,000 tokens at $0.75:</span>
                      <span className="text-green-400 text-xl font-bold">$15,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">From your initial effort worth:</span>
                      <span className="text-slate-400">$100</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-600 pt-2">
                      <span>Potential growth:</span>
                      <span className="text-amber-400 font-bold">150x return</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Token Distribution */}
      <section className="py-16 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Where Do the Tokens Go?</h2>
            <p className="text-xl text-blue-200">Fair distribution that rewards the people who make BitForce successful</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <Card className="bg-slate-800/80 border-slate-700">
              <CardContent className="pt-6">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tokenDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {tokenDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                        formatter={(value: number) => [`${value}%`, 'Allocation']}
                      />
                      <Legend 
                        wrapperStyle={{ color: '#fff' }}
                        formatter={(value) => <span style={{ color: '#D1D5DB' }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {tokenDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div 
                    className="w-4 h-4 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white font-medium">{item.name}</span>
                      <span className="text-slate-400">{item.value}%</span>
                    </div>
                    <Progress value={item.value} className="h-2" />
                  </div>
                </div>
              ))}
              <p className="text-sm text-slate-400 mt-4">
                <strong className="text-amber-400">65%</strong> of all tokens go directly to ambassadors and customers - 
                the people who actually build the BitForce community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Roadmap</h2>
            <p className="text-xl text-blue-200">From pre-ICO to trading on exchanges</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-amber-500 via-blue-500 to-green-500 hidden md:block" />
            
            <div className="space-y-12">
              {[
                { 
                  phase: "Phase 1: Pre-ICO", 
                  status: "NOW",
                  icon: Rocket,
                  badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
                  iconClass: "text-amber-400",
                  items: ["Onboard founding ambassadors", "100% bonus tokens for early joiners", "Build token holder community", "Test reward systems"]
                },
                { 
                  phase: "Phase 2: ICO Launch", 
                  status: "Q2 2026",
                  icon: Coins,
                  badgeClass: "bg-blue-500/20 text-blue-300 border-blue-500/30",
                  iconClass: "text-blue-400",
                  items: ["Public token sale", "Bonus rates decrease", "Marketing campaign launch", "Partnership announcements"]
                },
                { 
                  phase: "Phase 3: Exchange Listing", 
                  status: "Q3 2026",
                  icon: TrendingUp,
                  badgeClass: "bg-green-500/20 text-green-300 border-green-500/30",
                  iconClass: "text-green-400",
                  items: ["List on major exchanges", "Enable trading for all holders", "Implement token utility features", "Expand ambassador program"]
                },
                { 
                  phase: "Phase 4: Ecosystem Growth", 
                  status: "2027+",
                  icon: Users,
                  badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/30",
                  iconClass: "text-purple-400",
                  items: ["Merchant acceptance", "Staking rewards", "Governance voting", "Global expansion"]
                },
              ].map((phase, index) => (
                <div key={index} className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <Card className="bg-slate-800/80 border-slate-700 inline-block">
                      <CardContent className="pt-6">
                        <Badge className={`${phase.badgeClass} mb-2`}>
                          {phase.status}
                        </Badge>
                        <h3 className="text-xl font-bold text-white mb-3">{phase.phase}</h3>
                        <ul className="space-y-2">
                          {phase.items.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="hidden md:flex w-16 h-16 bg-slate-800 rounded-full items-center justify-center border-4 border-slate-900 z-10">
                    <phase.icon className={`w-8 h-8 ${phase.iconClass}`} />
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Common Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Do I need to understand cryptocurrency to participate?",
                a: "Not at all! We'll set up everything for you. You just keep doing what you're already doing - earning rewards for your work. We handle all the technical stuff behind the scenes."
              },
              {
                q: "What if I don't want crypto? Can I still earn regular commissions?",
                a: "Absolutely. Your cash commissions remain exactly the same. Token rewards are an additional bonus on top of what you already earn - think of it as extra upside."
              },
              {
                q: "Is this safe? I've heard crypto can be risky.",
                a: "We're using Solana, one of the most established and secure blockchain networks. Your tokens are protected by the same technology that secures billions of dollars in assets. Plus, you never have to invest any of your own money - you just earn."
              },
              {
                q: "When can I actually sell my tokens for cash?",
                a: "Once we complete Phase 3 and list on exchanges (expected Q3 2026), you'll be able to sell your tokens anytime you want. Until then, just keep accumulating!"
              },
              {
                q: "What makes the token valuable?",
                a: "BFC tokens will have real utility - customers can use them for discounts, ambassadors can unlock premium features, and as demand grows, so does value. The more people using BitForce, the more valuable your tokens become."
              },
            ].map((faq, index) => (
              <Card key={index} className="bg-slate-800/80 border-slate-700">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-blue-400 text-sm">{index + 1}</span>
                    </div>
                    {faq.q}
                  </h3>
                  <p className="text-slate-300 ml-8">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-amber-600/20 via-amber-500/10 to-amber-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 px-4 py-2 rounded-full mb-6">
            <Clock className="w-4 h-4" />
            <span className="font-medium">Only 50 Founding Ambassador spots available</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Be a Founding Member?
          </h2>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Join now to lock in your <span className="text-amber-400 font-bold">100% bonus rate</span> before spots fill up. 
            This opportunity won't last forever.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-lg px-8 py-6" data-testid="button-claim-founding-status">
              <Award className="w-6 h-6 mr-2" />
              Claim Founding Ambassador Status
            </Button>
          </div>
          
          <p className="text-sm text-slate-400 mt-6">
            No additional investment required. Just sign up and start earning.
          </p>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <footer className="py-8 px-4 bg-slate-900 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center text-sm text-slate-500">
          <p className="mb-2">
            <strong>Disclaimer:</strong> This document is for informational purposes only and does not constitute financial advice. 
            Cryptocurrency investments carry risk and values can go down as well as up. Past performance is not indicative of future results.
          </p>
          <p>
            BitForce Token (BFC) is a utility token designed for use within the BitForce ecosystem. 
            Please consult with a financial advisor before making any investment decisions.
          </p>
        </div>
      </footer>
    </div>
  );
}
