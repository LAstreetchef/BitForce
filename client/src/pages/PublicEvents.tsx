import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  Sparkles,
  DollarSign,
  TrendingUp,
  UserPlus,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

import networkingEvent1 from "@assets/stock_images/business_networking__d342869f.jpg";
import networkingEvent2 from "@assets/stock_images/business_networking__276fb736.jpg";
import conferenceImage from "@assets/stock_images/corporate_conference_0ce0648f.jpg";
import celebrationImage from "@assets/stock_images/business_team_celebr_0c4c7fd4.jpg";

const eventSignupSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  experience: z.string().optional(),
  eventId: z.string(),
});

type EventSignupValues = z.infer<typeof eventSignupSchema>;

const featuredEvent = {
  id: 1,
  title: "Bit Force Ambassador Summit 2026",
  subtitle: "Your Path to Financial Freedom Starts Here",
  date: "May 29th, 2026",
  time: "9:00 AM - 5:00 PM",
  location: "Kingwood, TX",
  venue: "Kingwood Conference Center",
  address: "1450 Lake Houston Parkway, Kingwood, TX 77339",
  spotsRemaining: 47,
  totalSpots: 150,
  highlights: [
    "Learn how top ambassadors earn $5,000+ per month",
    "Network with 100+ successful ambassadors",
    "Get certified and start earning immediately",
    "Free lunch and exclusive swag included",
    "Prizes and bonuses for attendees"
  ],
  speakers: [
    { name: "Marcus Johnson", role: "VP of Sales", topic: "Scaling Your Income" },
    { name: "Sarah Chen", role: "Top Ambassador", topic: "From $0 to $10K/Month" },
    { name: "David Miller", role: "Training Director", topic: "Closing Techniques" }
  ]
};

const benefits = [
  { icon: DollarSign, title: "Earn $100-$500 Per Sale", description: "Competitive commissions on every service you sell" },
  { icon: TrendingUp, title: "Unlimited Income Potential", description: "No cap on how much you can earn" },
  { icon: Users, title: "Build Your Team", description: "Earn override commissions on team sales" },
  { icon: Gift, title: "Bonuses & Incentives", description: "Monthly contests, trips, and cash bonuses" }
];

const eventPerks = [
  { icon: Mic, title: "Expert Training", description: "Learn proven sales strategies" },
  { icon: Users, title: "Networking", description: "Connect with successful ambassadors" },
  { icon: Gift, title: "Exclusive Swag", description: "Limited edition merchandise" },
  { icon: Trophy, title: "Prizes", description: "Drawings and contests all day" }
];

export default function PublicEvents() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const spotsFilledPercent = ((featuredEvent.totalSpots - featuredEvent.spotsRemaining) / featuredEvent.totalSpots) * 100;

  const form = useForm<EventSignupValues>({
    resolver: zodResolver(eventSignupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      experience: "",
      eventId: featuredEvent.id.toString(),
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: EventSignupValues) => {
      const response = await apiRequest("POST", "/api/event-registrations", data);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Registration failed" }));
        throw new Error(errorData.message || "Registration failed. Please try again.");
      }
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset();
      toast({
        title: "You're registered!",
        description: "We'll send you event details and updates to your email.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EventSignupValues) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans" data-testid="page-public-events">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" data-testid="link-logo-home">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                B
              </div>
              <span className="font-display font-bold text-xl text-slate-900 tracking-tight">
                Bit Force
              </span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition-colors" data-testid="link-home">Home</Link>
            <a href="#register" className="hover:text-blue-600 transition-colors" data-testid="link-register-anchor">Register</a>
            <Link href="/portal" className="hover:text-blue-600 transition-colors" data-testid="link-portal">Ambassador Portal</Link>
          </nav>
          <Link href="/" data-testid="link-back-home">
            <Button variant="ghost" size="sm" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <img 
            src={networkingEvent1} 
            alt="Ambassador networking event" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-800/90 to-blue-900/80" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl text-white">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <Badge className="bg-yellow-500 text-yellow-950">
                  <Star className="w-3 h-3 mr-1" />
                  Featured Event
                </Badge>
                <Badge variant="outline" className="border-white/30 text-white">
                  In-Person
                </Badge>
                <Badge variant="outline" className="border-green-400/50 text-green-300">
                  Free Registration
                </Badge>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-4" data-testid="text-event-title">
                {featuredEvent.title}
              </h1>
              <p className="text-xl text-blue-200 mb-6">{featuredEvent.subtitle}</p>
              
              <div className="flex flex-wrap gap-6 text-lg mb-8">
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {featuredEvent.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {featuredEvent.time}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {featuredEvent.location}
                </span>
              </div>
              
              <div className="flex items-center gap-4 flex-wrap">
                <a href="#register" data-testid="link-register-hero">
                  <Button size="lg" className="bg-white text-blue-700" data-testid="button-register-hero">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Reserve Your Spot
                  </Button>
                </a>
                <div className="flex items-center gap-2 text-blue-200">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">{featuredEvent.spotsRemaining} spots remaining</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Become an Ambassador */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Become a Bit Force Ambassador?</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Join hundreds of ambassadors who have transformed their income by helping families access essential home services.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <Card key={index} className="text-center p-6" data-testid={`benefit-${index}`}>
                    <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-7 h-7 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Event Details */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">What You'll Learn</h2>
                  <p className="text-slate-600 mb-6">
                    This full-day event is designed to give you everything you need to start earning as a Bit Force Ambassador.
                  </p>
                </div>
                
                <div className="space-y-3">
                  {featuredEvent.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-3" data-testid={`highlight-${index}`}>
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <span className="text-slate-700">{highlight}</span>
                    </div>
                  ))}
                </div>

                <div className="relative rounded-xl overflow-hidden mt-8">
                  <img 
                    src={conferenceImage} 
                    alt="Conference presentation" 
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <div className="font-bold text-lg">Learn From The Best</div>
                      <div className="text-white/80">Interactive sessions and live demonstrations</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <Card data-testid="section-speakers">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mic className="w-5 h-5 text-purple-600" />
                      Featured Speakers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {featuredEvent.speakers.map((speaker, index) => (
                      <div key={index} className="flex items-center gap-4" data-testid={`speaker-${index}`}>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {speaker.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{speaker.name}</div>
                          <div className="text-sm text-muted-foreground">{speaker.role}</div>
                        </div>
                        <Badge variant="secondary">{speaker.topic}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card data-testid="section-perks">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-amber-500" />
                      Event Perks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>
                  </CardContent>
                </Card>

                <div className="relative rounded-xl overflow-hidden">
                  <img 
                    src={celebrationImage} 
                    alt="Team celebration" 
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-transparent flex items-center p-6">
                    <div className="text-white">
                      <div className="font-bold text-lg">Join Our Winning Team</div>
                      <div className="text-emerald-200 text-sm">Awards, recognition, and success</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Registration Form */}
        <section id="register" className="py-16 bg-gradient-to-b from-blue-900 to-blue-950">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-4">Reserve Your Spot Today</h2>
                <p className="text-blue-200 mb-6">
                  Registration is completely free for this event. Secure your spot now and take the first step toward financial freedom.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-800 flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium">{featuredEvent.date}</div>
                      <div className="text-sm text-blue-300">{featuredEvent.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-800 flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium">{featuredEvent.venue}</div>
                      <div className="text-sm text-blue-300">{featuredEvent.address}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-800/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-200">Spots Filled</span>
                    <span className="font-bold">{featuredEvent.totalSpots - featuredEvent.spotsRemaining} / {featuredEvent.totalSpots}</span>
                  </div>
                  <div className="h-2 bg-blue-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all"
                      style={{ width: `${spotsFilledPercent}%` }}
                    />
                  </div>
                  <div className="text-center mt-2 text-green-300 font-medium">
                    {featuredEvent.spotsRemaining} spots remaining
                  </div>
                </div>
              </div>

              <Card className="p-6" data-testid="section-register-form">
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">You're Registered!</h3>
                    <p className="text-muted-foreground mb-6">
                      We'll send event details and updates to your email. See you in Kingwood!
                    </p>
                    <Link href="/" data-testid="link-back-after-register">
                      <Button variant="outline" data-testid="button-back-after-register">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                        Free Registration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your full name" {...field} data-testid="input-name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="your@email.com" {...field} data-testid="input-email" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input type="tel" placeholder="(555) 123-4567" {...field} data-testid="input-phone" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="experience"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sales Experience (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Tell us about any sales or marketing experience you have..." 
                                    className="resize-none"
                                    {...field} 
                                    data-testid="input-experience"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="w-full" 
                            size="lg"
                            disabled={registerMutation.isPending}
                            data-testid="button-submit-register"
                          >
                            {registerMutation.isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Registering...
                              </>
                            ) : (
                              <>
                                Register for Free
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </>
                            )}
                          </Button>
                        </form>
                      </Form>
                      
                      <p className="text-xs text-center text-muted-foreground mt-4">
                        By registering, you agree to receive event updates via email and text.
                      </p>
                    </CardContent>
                  </>
                )}
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 text-center">
            <div className="relative rounded-xl overflow-hidden">
              <img 
                src={networkingEvent2} 
                alt="Networking" 
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-blue-900/90 flex items-center justify-center">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Ready to Change Your Life?</h3>
                  <p className="text-blue-200 mb-4">Join us in Kingwood and start your journey to financial freedom.</p>
                  <a href="#register" data-testid="link-register-cta">
                    <Button className="bg-white text-blue-700" data-testid="button-register-cta">
                      Register Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              B
            </div>
            <span className="font-bold text-white">Bit Force</span>
          </div>
          <p className="text-sm">Empowering ambassadors to build successful businesses.</p>
        </div>
      </footer>
    </div>
  );
}
