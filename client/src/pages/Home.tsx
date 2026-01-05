import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLeadSchema } from "@shared/schema";
import { useCreateLead } from "@/hooks/use-leads";
import { services } from "@/data/services";
import { ServiceCard } from "@/components/ServiceCard";
import { 
  Loader2, 
  Sparkles, 
  Send, 
  CheckCircle,
  Shield, 
  Globe, 
  Clock, 
  Star 
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import type { z } from "zod";

type LeadFormValues = z.infer<typeof insertLeadSchema>;

export default function Home() {
  const [suggestedServiceIds, setSuggestedServiceIds] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const createLead = useCreateLead();

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(insertLeadSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      interests: "",
    },
  });

  const handleSuggest = () => {
    const interests = form.getValues("interests").toLowerCase();
    
    if (!interests) {
      setSuggestedServiceIds([]);
      return;
    }

    const matches = services
      .filter((service) => 
        service.keywords.some((keyword) => interests.includes(keyword))
      )
      .map((s) => s.id);

    setSuggestedServiceIds(matches.length > 0 ? matches : ["custom"]);
    setShowSuggestions(true);
  };

  const onSubmit = (data: LeadFormValues) => {
    createLead.mutate(data, {
      onSuccess: () => {
        form.reset();
        setShowSuggestions(false);
        setSuggestedServiceIds([]);
      },
    });
  };

  const handleMembershipClick = () => {
    alert("Premium Membership signup coming soon! We're putting the finishing touches on our exclusive portal.");
  };

  // Sort services to put suggestions first
  const sortedServices = [...services].sort((a, b) => {
    const aSuggested = suggestedServiceIds.includes(a.id);
    const bSuggested = suggestedServiceIds.includes(b.id);
    if (aSuggested && !bSuggested) return -1;
    if (!aSuggested && bSuggested) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              D
            </div>
            <span className="font-display font-bold text-xl text-slate-900 tracking-tight">
              Digital Intelligence Marketing
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-blue-600 transition-colors">Portal</a>
            <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
            <a href="#membership" className="hover:text-blue-600 transition-colors">Membership</a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative py-12 lg:py-20 overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/hero-bg.mp4" type="video/mp4" />
            </video>
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-slate-900/70"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              
              {/* Left Column: Content */}
              <div className="text-white space-y-6 pt-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 font-medium text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>AI-Powered Lead Analysis</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-display font-bold leading-tight">
                  Brand Ambassador <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                    Service Portal
                  </span>
                </h1>
                <p className="text-lg text-slate-300 max-w-lg leading-relaxed">
                  Streamline your intake process. Enter client details and let our intelligence engine suggest the perfect service packages instantly.
                </p>
                
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold">Fast Intake</h4>
                      <p className="text-sm text-slate-400">Sub-minute processing</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                      <Shield className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold">Secure Data</h4>
                      <p className="text-sm text-slate-400">Enterprise encryption</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Form */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-2xl shadow-blue-900/20">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">New Client Intake</h2>
                  <p className="text-slate-500">Fill out the details below to generate service matches.</p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" className="input-field" {...field} />
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
                              <Input placeholder="(555) 123-4567" className="input-field" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" className="input-field" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Home Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St, City, State" className="input-field" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="interests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Interests & Needs</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe what the client is looking for (e.g., 'needs roof repair after storm' or 'wants to digitize old vhs tapes')..." 
                              className="input-field min-h-[100px] resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-3 pt-2">
                      <Button 
                        type="button" 
                        onClick={handleSuggest}
                        variant="secondary"
                        className="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border-blue-200"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Analyze Needs
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createLead.isPending}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                      >
                        {createLead.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Lead
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section id="services" className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 mb-4">
                Available Services
              </h2>
              <p className="text-lg text-slate-600">
                Browse our comprehensive catalog of home and digital services. 
                {showSuggestions && (
                  <span className="block mt-2 font-medium text-blue-600">
                    Showing suggested services based on client interests.
                  </span>
                )}
              </p>
            </div>

            <motion.div 
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              <AnimatePresence>
                {sortedServices.map((service) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={service.id}
                  >
                    <ServiceCard 
                      service={service} 
                      isSuggested={suggestedServiceIds.includes(service.id)} 
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Premium Membership Section */}
        <section id="membership" className="py-20 bg-white border-t border-slate-200">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-sm mb-6">
                    COMING SOON
                  </div>
                  <h2 className="text-3xl lg:text-5xl font-display font-bold mb-6">
                    Premium Membership
                  </h2>
                  <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                    Join our exclusive program designed for top-tier clients. Get priority access to all services, personal consultations, and dedicated support.
                  </p>
                  <Button 
                    onClick={handleMembershipClick}
                    size="lg"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 h-14 rounded-xl text-lg shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
                  >
                    Sign Up for Membership
                  </Button>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    { icon: Star, title: "Priority Access", desc: "Skip the line for all service bookings" },
                    { icon: Globe, title: "AI Webpage", desc: "Personalized digital dashboard" },
                    { icon: CheckCircle, title: "Home Visits", desc: "Quarterly professional inspections" },
                    { icon: Shield, title: "Exclusive Offers", desc: "Member-only discounts and deals" }
                  ].map((benefit, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
                      <benefit.icon className="w-8 h-8 text-emerald-400 mb-4" />
                      <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                      <p className="text-slate-400 text-sm">{benefit.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Digital Intelligence Marketing. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
