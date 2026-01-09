import { useState } from "react";
import bitforceLogo from "@assets/Bitforce_1767872339442.jpg";
import { services } from "@/data/services";
import { ServiceCard } from "@/components/ServiceCard";
import { AmbassadorPayoutModal } from "@/components/AmbassadorPayoutModal";
import { HowItWorksModal } from "@/components/HowItWorksModal";
import { useAuth } from "@/hooks/use-auth";
import { 
  Loader2, 
  Sparkles, 
  CheckCircle,
  Shield, 
  Globe, 
  Clock, 
  Star,
  ClipboardList,
  DollarSign,
  Brain,
  LogOut,
  LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const { isAuthenticated, isLoading: authLoading, logout, isLoggingOut } = useAuth();

  const handleMembershipClick = () => {
    alert("Premium Membership signup coming soon! We're putting the finishing touches on our exclusive portal.");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={bitforceLogo} 
              alt="Bitforce AI Buddies" 
              className="w-8 h-8 rounded-lg object-cover"
              data-testid="img-logo"
            />
            <span className="font-display font-bold text-xl text-slate-900 tracking-tight">
              Bit Force
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="/portal" className="hover:text-blue-600 transition-colors" data-testid="link-portal">Ambassador Portal</a>
            <a href="/events" className="hover:text-blue-600 transition-colors" data-testid="link-events">Events</a>
            <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
            <a href="#membership" className="hover:text-blue-600 transition-colors">Membership</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPayoutModal(true)}
              className="flex items-center gap-2"
              data-testid="button-open-payout-modal"
            >
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="hidden sm:inline">My Earnings</span>
            </Button>
            {authLoading ? (
              <Button variant="ghost" size="sm" disabled>
                <Loader2 className="w-4 h-4 animate-spin" />
              </Button>
            ) : isAuthenticated ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => logout()}
                disabled={isLoggingOut}
                data-testid="button-logout"
              >
                {isLoggingOut ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4 mr-2" />
                )}
                <span className="hidden sm:inline">Log Out</span>
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-login"
              >
                <LogIn className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Log In</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <AmbassadorPayoutModal 
        open={showPayoutModal} 
        onOpenChange={setShowPayoutModal} 
      />

      <HowItWorksModal
        open={showHowItWorksModal}
        onOpenChange={setShowHowItWorksModal}
      />

      <main>
        {/* Hero Section */}
        <section className="relative py-12 lg:py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/hero-bg.jpg"
              alt="Community event"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-slate-900/60"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              
              {/* Left Column: Content */}
              <div className="text-white space-y-6 pt-6">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 font-medium text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>AI-Powered Lead Analysis</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHowItWorksModal(true)}
                    className="text-blue-300 border border-blue-400/30 bg-blue-500/10"
                    data-testid="button-how-it-works"
                  >
                    <Brain className="w-4 h-4 mr-1" />
                    How It Works
                  </Button>
                </div>
                <h1 className="text-4xl lg:text-6xl font-display font-bold leading-tight text-white">
                  Brand Ambassador <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                    Portal
                  </span>
                </h1>
                <p className="text-lg text-slate-300 max-w-lg leading-relaxed">
                  Enter client details and let our intelligence engine suggest the perfect service packages instantly.
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

              {/* Right Column: Ambassador CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 lg:p-8 shadow-2xl shadow-blue-900/20"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ClipboardList className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Ambassador Portal</h2>
                  <p className="text-slate-500">
                    Access our AI-powered lead intake tools, track customers, and grow your business.
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
                    <span className="text-slate-700">AI-powered service recommendations</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600 shrink-0" />
                    <span className="text-slate-700">Earn commissions on every sale</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Brain className="w-5 h-5 text-purple-600 shrink-0" />
                    <span className="text-slate-700">Free AI training & resources</span>
                  </div>
                </div>

                {isAuthenticated ? (
                  <Button 
                    onClick={() => window.location.href = "/portal"}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-semibold shadow-lg shadow-blue-600/20"
                    data-testid="button-go-to-portal"
                  >
                    Go to Portal
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Button 
                      onClick={() => window.location.href = "/api/login"}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-semibold shadow-lg shadow-blue-600/20"
                      data-testid="button-login-portal"
                    >
                      <LogIn className="w-5 h-5 mr-2" />
                      Log In to Portal
                    </Button>
                    <p className="text-center text-sm text-slate-500">
                      New here? Login to start your ambassador journey
                    </p>
                  </div>
                )}
              </motion.div>
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
              </p>
            </div>

            <motion.div 
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              <AnimatePresence>
                {services.map((service) => (
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
                      isSuggested={false} 
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
            © {new Date().getFullYear()} Bit Force. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
