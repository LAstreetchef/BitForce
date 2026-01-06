import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Star,
  Gift,
  Mic,
  Trophy,
  ArrowRight,
  CheckCircle,
  Sparkles
} from "lucide-react";

import networkingEvent1 from "@assets/stock_images/business_networking__d342869f.jpg";
import networkingEvent2 from "@assets/stock_images/business_networking__276fb736.jpg";
import conferenceImage from "@assets/stock_images/corporate_conference_0ce0648f.jpg";
import celebrationImage from "@assets/stock_images/business_team_celebr_0c4c7fd4.jpg";

const featuredEvent = {
  id: 1,
  title: "Bit Force Ambassador Summit 2026",
  subtitle: "Connect, Learn, and Earn More Together",
  date: "May 29th, 2026",
  time: "9:00 AM - 5:00 PM",
  location: "Kingwood, TX",
  venue: "Kingwood Conference Center",
  address: "1450 Lake Houston Parkway, Kingwood, TX 77339",
  spotsRemaining: 47,
  totalSpots: 150,
  highlights: [
    "Exclusive training sessions with top performers",
    "Network with 100+ successful ambassadors",
    "Learn advanced closing techniques",
    "Early access to new service offerings",
    "Prizes and bonuses for attendees"
  ],
  speakers: [
    { name: "Marcus Johnson", role: "VP of Sales", topic: "Scaling Your Team" },
    { name: "Sarah Chen", role: "Top Ambassador", topic: "From $0 to $10K/Month" },
    { name: "David Miller", role: "Training Director", topic: "AI-Powered Selling" }
  ]
};

const upcomingEvents = [
  {
    id: 2,
    title: "Virtual Power Hour",
    type: "Online",
    date: "Feb 15, 2026",
    time: "12:00 PM CST",
    description: "Weekly sales motivation and tips session"
  },
  {
    id: 3,
    title: "New Ambassador Onboarding",
    type: "Online",
    date: "Feb 20, 2026",
    time: "2:00 PM CST",
    description: "Getting started training for new team members"
  },
  {
    id: 4,
    title: "Houston Meetup",
    type: "In-Person",
    date: "March 8, 2026",
    time: "6:00 PM CST",
    description: "Casual networking dinner in downtown Houston"
  },
  {
    id: 5,
    title: "Q2 Kickoff Webinar",
    type: "Online",
    date: "April 1, 2026",
    time: "10:00 AM CST",
    description: "New products, incentives, and goals for Q2"
  }
];

const eventPerks = [
  { icon: Mic, title: "Expert Speakers", description: "Learn from top performers and leadership" },
  { icon: Users, title: "Networking", description: "Connect with successful ambassadors" },
  { icon: Gift, title: "Exclusive Swag", description: "Limited edition merchandise for attendees" },
  { icon: Trophy, title: "Prizes", description: "Drawings and contests throughout the day" }
];

export default function Events() {
  const spotsFilledPercent = ((featuredEvent.totalSpots - featuredEvent.spotsRemaining) / featuredEvent.totalSpots) * 100;

  return (
    <div className="space-y-6" data-testid="page-events">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Events</h1>
        <p className="text-muted-foreground">Upcoming ambassador events and training opportunities</p>
      </div>

      <div className="relative rounded-xl overflow-hidden" data-testid="section-featured-event">
        <img 
          src={networkingEvent1} 
          alt="Ambassador networking event" 
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-800/85 to-transparent" />
        <div className="absolute inset-0 flex items-center p-8">
          <div className="text-white max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-yellow-500 text-yellow-950">
                <Star className="w-3 h-3 mr-1" />
                Featured Event
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white">
                In-Person
              </Badge>
            </div>
            <h2 className="text-3xl font-bold mb-2" data-testid="text-featured-title">{featuredEvent.title}</h2>
            <p className="text-blue-200 mb-4">{featuredEvent.subtitle}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {featuredEvent.date}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {featuredEvent.location}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {featuredEvent.spotsRemaining} spots left
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card data-testid="section-event-details">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">Date & Time</div>
                    <div className="text-sm text-muted-foreground">{featuredEvent.date}</div>
                    <div className="text-sm text-muted-foreground">{featuredEvent.time}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-sm text-muted-foreground">{featuredEvent.venue}</div>
                    <div className="text-sm text-muted-foreground">{featuredEvent.address}</div>
                  </div>
                </div>
              </div>

              <div className="relative rounded-lg overflow-hidden">
                <img 
                  src={conferenceImage} 
                  alt="Conference presentation" 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <div className="font-bold">Learn From The Best</div>
                    <div className="text-sm text-white/80">Interactive sessions and live demonstrations</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">What You'll Experience</h4>
                <div className="space-y-2">
                  {featuredEvent.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm" data-testid={`highlight-${index}`}>
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative rounded-lg overflow-hidden">
                <img 
                  src={celebrationImage} 
                  alt="Team celebration" 
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-transparent flex items-center p-6">
                  <div className="text-white">
                    <div className="font-bold text-lg">Celebrate Your Success</div>
                    <div className="text-emerald-200 text-sm">Awards, recognition, and team building</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="section-speakers">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-purple-600" />
                Featured Speakers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                {featuredEvent.speakers.map((speaker, index) => (
                  <Card key={index} className="p-4 text-center" data-testid={`speaker-${index}`}>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                      {speaker.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="font-medium">{speaker.name}</div>
                    <div className="text-xs text-muted-foreground mb-2">{speaker.role}</div>
                    <Badge variant="secondary" className="text-xs">{speaker.topic}</Badge>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-2 border-blue-200 dark:border-blue-800" data-testid="section-register">
            <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
              <CardTitle className="text-center">Reserve Your Spot</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-1">{featuredEvent.spotsRemaining}</div>
                <div className="text-sm text-muted-foreground">spots remaining</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Capacity</span>
                  <span className="font-medium">{featuredEvent.totalSpots - featuredEvent.spotsRemaining} / {featuredEvent.totalSpots}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                    style={{ width: `${spotsFilledPercent}%` }}
                  />
                </div>
              </div>

              <Button className="w-full" size="lg" data-testid="button-register">
                Register Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Free for active ambassadors. Lunch included.
              </p>
            </CardContent>
          </Card>

          <Card data-testid="section-perks">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-500" />
                Event Perks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {eventPerks.map((perk, index) => {
                const IconComponent = perk.icon;
                return (
                  <div key={index} className="flex items-start gap-3" data-testid={`perk-${index}`}>
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                      <IconComponent className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{perk.title}</div>
                      <div className="text-xs text-muted-foreground">{perk.description}</div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <div className="relative rounded-xl overflow-hidden">
            <img 
              src={networkingEvent2} 
              alt="Networking" 
              className="w-full h-32 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
              <div className="text-white text-sm">
                <div className="font-bold">Build Your Network</div>
                <div className="text-white/80">Meet ambassadors from across the region</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card data-testid="section-upcoming-events">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            More Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="p-4" data-testid={`event-${event.id}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    variant="secondary" 
                    className={event.type === "In-Person" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-blue-100 text-blue-700"
                    }
                  >
                    {event.type}
                  </Badge>
                </div>
                <h4 className="font-medium mb-1">{event.title}</h4>
                <p className="text-xs text-muted-foreground mb-3">{event.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <Clock className="w-3 h-3" />
                  {event.time}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
