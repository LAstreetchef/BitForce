import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Shield,
  Brain,
  Users,
  DollarSign,
  Clock,
  Heart,
  Zap,
  ChevronRight,
  Sparkles,
  Tag,
  PiggyBank,
  TrendingDown,
  Headphones,
  Home,
  Gift,
  Star,
  CheckCircle,
  BarChart3,
} from "lucide-react";
import { Link } from "wouter";

import couponScreenshot from "@assets/Screenshot_2026-01-12_205429_1768297244243.png";
import analyticsScreenshot from "@assets/Screenshot_2026-01-12_172008_1768297256914.png";
import friendFinderScreenshot from "@assets/{A4A53F14-8B56-4C68-B658-E8EAAB14D4A9}_1768297282791.png";
import monthlySubscription from "@assets/{FB81D370-6D3E-4238-B4DA-3C1F3E5C28D2}_1768297162284.png";
import afterglowApp from "@assets/{83D0B58E-E09A-46A1-9A2D-7867F2ABF0E5}_1768297185928.png";
import secretMessageApp from "@assets/Screenshot_2026-01-10_052350_1768299587093.png";
import ambassadorSummit from "@assets/Screenshot_2026-01-13_044008_1768299602592.png";
import digitalFootprintScanner from "@assets/Screenshot_2026-01-09_154954_1768299637178.png";

interface Scene {
  id: number;
  title: string;
  duration: number;
  bgGradient: string;
}

const scenes: Scene[] = [
  { id: 1, title: "The Challenge", duration: 7, bgGradient: "from-slate-900 via-slate-800 to-slate-900" },
  { id: 2, title: "Meet Your AI Buddy", duration: 8, bgGradient: "from-blue-900 via-indigo-900 to-purple-900" },
  { id: 3, title: "Save Money", duration: 12, bgGradient: "from-emerald-900 via-green-800 to-teal-900" },
  { id: 4, title: "Save Time", duration: 10, bgGradient: "from-cyan-900 via-blue-800 to-indigo-900" },
  { id: 5, title: "Keep in Touch", duration: 10, bgGradient: "from-purple-900 via-pink-800 to-rose-900" },
  { id: 6, title: "Our Products", duration: 12, bgGradient: "from-indigo-900 via-violet-800 to-purple-900" },
  { id: 7, title: "Get Started", duration: 8, bgGradient: "from-blue-800 via-indigo-700 to-blue-900" },
];

const TOTAL_DURATION = scenes.reduce((sum, s) => sum + s.duration, 0);

const PARTICLE_POSITIONS = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 100,
  delay: Math.random() * 3,
  duration: 2 + Math.random() * 3,
}));

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLE_POSITIONS.map((p) => (
        <div
          key={p.id}
          className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function FloatingIcon({ icon: Icon, delay, x, y }: { icon: any; delay: number; x: number; y: number }) {
  return (
    <div
      className="absolute text-white/10 animate-bounce"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
        animationDuration: "3s",
      }}
    >
      <Icon className="w-8 h-8 md:w-12 md:h-12" />
    </div>
  );
}

function AnimatedCounter({ value, prefix = "", suffix = "", duration = 2000 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) {
      setHasStarted(true);
      let start = 0;
      const increment = value / (duration / 50);
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 50);
      return () => clearInterval(timer);
    }
  }, [hasStarted, value, duration]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

function Scene1({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <ParticleField />
      <FloatingIcon icon={DollarSign} delay={0} x={10} y={20} />
      <FloatingIcon icon={Clock} delay={0.5} x={80} y={30} />
      <FloatingIcon icon={Brain} delay={1} x={15} y={70} />
      <FloatingIcon icon={Zap} delay={1.5} x={85} y={75} />
      
      <div className="text-center z-10 px-4">
        <div 
          className="transition-all duration-1000"
          style={{ 
            opacity: progress > 10 ? 1 : 0,
            transform: `translateY(${progress > 10 ? 0 : 30}px)` 
          }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Life is getting more <span className="text-red-400">complicated</span>...
          </h2>
        </div>
        
        <div 
          className="transition-all duration-1000 delay-500"
          style={{ 
            opacity: progress > 35 ? 1 : 0,
            transform: `translateY(${progress > 35 ? 0 : 30}px)` 
          }}
        >
          <p className="text-lg md:text-2xl text-white/80 max-w-2xl mx-auto mb-8">
            Hidden fees, confusing tech, missed savings opportunities...
          </p>
        </div>
        
        <div className="flex justify-center gap-6 md:gap-8 mt-8 flex-wrap">
          {[
            { icon: TrendingDown, label: "Wasted Money", value: "$2,400/year", color: "text-red-400" },
            { icon: Clock, label: "Lost Time", value: "100+ hours", color: "text-yellow-400" },
            { icon: Zap, label: "Tech Stress", value: "Daily", color: "text-orange-400" },
          ].map((item, i) => (
            <div
              key={i}
              className="transition-all duration-700"
              style={{
                opacity: progress > 55 + i * 10 ? 1 : 0,
                transform: `scale(${progress > 55 + i * 10 ? 1 : 0.5})`,
              }}
            >
              <div className={`flex flex-col items-center gap-2 bg-white/5 rounded-xl p-4 border border-white/10`}>
                <item.icon className={`w-10 h-10 md:w-12 md:h-12 ${item.color}`} />
                <span className="text-white font-bold text-lg">{item.value}</span>
                <span className="text-white/60 text-sm">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Scene2({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div
        className="absolute w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl transition-all duration-1000"
        style={{
          transform: `scale(${progress > 20 ? 2 : 0})`,
          opacity: progress > 10 ? 0.5 : 0,
        }}
      />
      
      <div className="text-center z-10 px-4">
        <div
          className="transition-all duration-1000"
          style={{
            opacity: progress > 15 ? 1 : 0,
            transform: `scale(${progress > 15 ? 1 : 0.5})`,
          }}
        >
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
            <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-6 md:p-8 rounded-2xl">
              <Headphones className="w-16 h-16 md:w-24 md:h-24 text-white" />
            </div>
          </div>
        </div>
        
        <h2
          className="text-4xl md:text-6xl font-bold text-white mb-4 transition-all duration-700"
          style={{
            opacity: progress > 35 ? 1 : 0,
            transform: `translateY(${progress > 35 ? 0 : 30}px)`,
          }}
        >
          Meet Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI Buddy</span>
        </h2>
        
        <p
          className="text-xl md:text-2xl text-white/80 mb-6 transition-all duration-700 max-w-2xl mx-auto"
          style={{
            opacity: progress > 50 ? 1 : 0,
            transform: `translateY(${progress > 50 ? 0 : 20}px)`,
          }}
        >
          A real person, trained in AI, dedicated to helping <span className="text-blue-400">YOU</span>
        </p>
        
        <div
          className="flex flex-wrap justify-center gap-4 mt-8 transition-all duration-700"
          style={{ opacity: progress > 70 ? 1 : 0 }}
        >
          {["Personal Support", "Tech Guidance", "Money Savings", "Time Saver"].map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-white">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Scene3({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <ParticleField />
      
      <div className="z-10 w-full max-w-6xl px-4">
        <h2
          className="text-3xl md:text-5xl font-bold text-white text-center mb-4 transition-all duration-700"
          style={{
            opacity: progress > 5 ? 1 : 0,
            transform: `translateY(${progress > 5 ? 0 : -30}px)`,
          }}
        >
          <PiggyBank className="inline w-10 h-10 md:w-14 md:h-14 mr-3 text-green-400" />
          Save <span className="text-green-400">Real Money</span>
        </h2>
        
        <p
          className="text-center text-white/70 mb-8 transition-all duration-500"
          style={{ opacity: progress > 15 ? 1 : 0 }}
        >
          Our ambassadors help you find deals you never knew existed
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 items-start">
          <div
            className="transition-all duration-700"
            style={{
              opacity: progress > 25 ? 1 : 0,
              transform: `translateX(${progress > 25 ? 0 : -50}px)`,
            }}
          >
            <img 
              src={couponScreenshot} 
              alt="Exclusive Coupons" 
              className="rounded-xl shadow-2xl border border-white/20"
            />
            <p className="text-center text-white/60 text-sm mt-2">Exclusive Coupons</p>
          </div>
          
          <div
            className="transition-all duration-700"
            style={{
              opacity: progress > 40 ? 1 : 0,
              transform: `translateY(${progress > 40 ? 0 : 30}px)`,
            }}
          >
            <img 
              src={analyticsScreenshot} 
              alt="Track Your Savings" 
              className="rounded-xl shadow-2xl border border-white/20"
            />
            <p className="text-center text-white/60 text-sm mt-2">Track Your Savings</p>
          </div>
          
          <div className="space-y-3">
            {[
              { icon: Tag, label: "Exclusive Coupons", value: "Hundreds of deals", showAt: 35 },
              { icon: BarChart3, label: "Track Savings", value: "See your progress", showAt: 50 },
              { icon: Gift, label: "Member Perks", value: "Free with subscription", showAt: 65 },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/10 rounded-xl p-3 border border-white/20 transition-all duration-500"
                style={{
                  opacity: progress > item.showAt ? 1 : 0,
                  transform: `translateX(${progress > item.showAt ? 0 : 30}px)`,
                }}
              >
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <item.icon className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{item.label}</p>
                  <p className="text-green-400 font-bold text-sm">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div
          className="mt-8 flex justify-center transition-all duration-500"
          style={{ opacity: progress > 80 ? 1 : 0 }}
        >
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl px-8 py-4 text-center">
            <p className="text-green-400 text-3xl md:text-4xl font-bold">
              {progress > 80 && "$100's /year"}
            </p>
            <p className="text-white/80">Average Customer Savings</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Scene4({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <ParticleField />
      
      <div className="z-10 w-full max-w-5xl px-4">
        <h2
          className="text-3xl md:text-5xl font-bold text-white text-center mb-4 transition-all duration-700"
          style={{
            opacity: progress > 5 ? 1 : 0,
            transform: `translateY(${progress > 5 ? 0 : -30}px)`,
          }}
        >
          <Clock className="inline w-10 h-10 md:w-14 md:h-14 mr-3 text-cyan-400" />
          Save Precious <span className="text-cyan-400">Time</span>
        </h2>
        
        <p
          className="text-center text-white/70 mb-10 transition-all duration-500"
          style={{ opacity: progress > 15 ? 1 : 0 }}
        >
          Let your AI Buddy handle the tedious tech stuff
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Brain, title: "AI Assistant", desc: "Get instant answers to any tech question", color: "from-purple-500 to-violet-600", showAt: 25 },
            { icon: Shield, title: "Security Check", desc: "We scan for threats so you don't have to", color: "from-green-500 to-emerald-600", showAt: 40 },
            { icon: Home, title: "Property Lookup", desc: "Understand your home's value and needs", color: "from-blue-500 to-cyan-600", showAt: 55 },
          ].map((item, i) => (
            <div
              key={i}
              className="transition-all duration-700"
              style={{
                opacity: progress > item.showAt ? 1 : 0,
                transform: `translateY(${progress > item.showAt ? 0 : 50}px) scale(${progress > item.showAt ? 1 : 0.8})`,
              }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 h-full">
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${item.color} mb-4`}>
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div
          className="mt-10 text-center transition-all duration-500"
          style={{ opacity: progress > 75 ? 1 : 0 }}
        >
          <div className="inline-flex items-center gap-3 bg-cyan-500/20 border border-cyan-500/30 rounded-full px-6 py-3">
            <Clock className="w-6 h-6 text-cyan-400" />
            <span className="text-white text-lg">
              Save <span className="text-cyan-400 font-bold">10+ hours</span> every month
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Scene5({ progress }: { progress: number }) {
  const products = [
    { img: friendFinderScreenshot, title: "Friend & Family Finder", desc: "Reconnect with people from your past", showAt: 15 },
    { img: afterglowApp, title: "AfterGlow Memory App", desc: "Preserve precious memories - FREE", showAt: 25 },
    { img: secretMessageApp, title: "Secret Message", desc: "Pay-to-open messages & files", showAt: 35 },
    { img: ambassadorSummit, title: "Ambassador Summit 2026", desc: "In-person events & networking", showAt: 45 },
    { img: digitalFootprintScanner, title: "Digital Footprint Scanner", desc: "Security check - included with plan", showAt: 55 },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <ParticleField />
      
      <div className="z-10 w-full max-w-6xl px-4">
        <h2
          className="text-3xl md:text-5xl font-bold text-white text-center mb-6 transition-all duration-700"
          style={{
            opacity: progress > 5 ? 1 : 0,
            transform: `translateY(${progress > 5 ? 0 : -30}px)`,
          }}
        >
          <Heart className="inline w-10 h-10 md:w-14 md:h-14 mr-3 text-pink-400" />
          Keep in <span className="text-pink-400">Touch</span>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {products.map((product, i) => (
            <div
              key={i}
              className="transition-all duration-500"
              style={{
                opacity: progress > product.showAt ? 1 : 0,
                transform: `translateY(${progress > product.showAt ? 0 : 20}px)`,
              }}
            >
              <div className="bg-white/10 rounded-xl p-2 border border-white/20 h-full">
                <img 
                  src={product.img} 
                  alt={product.title} 
                  className="rounded-lg w-full h-28 object-cover object-top mb-2"
                />
                <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{product.title}</h3>
                <p className="text-white/60 text-xs line-clamp-2">{product.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div
          className="mt-6 flex justify-center transition-all duration-500"
          style={{ opacity: progress > 75 ? 1 : 0 }}
        >
          <div className="flex items-center gap-2 bg-pink-500/20 border border-pink-500/30 rounded-full px-6 py-3">
            <Heart className="w-5 h-5 text-pink-400" />
            <span className="text-white">Stay Connected with What Matters</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Scene6({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <ParticleField />
      
      <div className="z-10 w-full max-w-6xl px-4">
        <h2
          className="text-3xl md:text-5xl font-bold text-white text-center mb-6 transition-all duration-700"
          style={{
            opacity: progress > 5 ? 1 : 0,
            transform: `translateY(${progress > 5 ? 0 : -30}px)`,
          }}
        >
          Simple, Affordable <span className="text-purple-400">Pricing</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div
            className="transition-all duration-700"
            style={{
              opacity: progress > 20 ? 1 : 0,
              transform: `translateY(${progress > 20 ? 0 : 30}px)`,
            }}
          >
            <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-xl p-5 h-full">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white text-lg font-bold">Monthly AI Buddy</span>
                <span className="bg-yellow-500 text-black px-2 py-0.5 rounded-full text-xs font-bold">Most Popular</span>
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-bold text-white">$29</span>
                <span className="text-white/60 text-sm">/month</span>
              </div>
              <p className="text-white/60 text-sm mb-3">Ongoing support, lasting confidence</p>
              <ul className="space-y-1.5">
                {["Personal AI-trained ambassador", "Unlimited tech support", "Exclusive coupon access", "AfterGlow app included", "Friend & Family finder"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-white/80 text-sm">
                    <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-3 border-t border-white/10">
                <p className="text-green-400 text-xs font-medium">Less than $1/day for peace of mind</p>
              </div>
            </div>
          </div>
          
          <div
            className="transition-all duration-700"
            style={{
              opacity: progress > 35 ? 1 : 0,
              transform: `translateY(${progress > 35 ? 0 : 30}px)`,
            }}
          >
            <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-xl p-5 h-full">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white text-lg font-bold">One-Time Session</span>
                <span className="text-teal-400 text-sm font-medium">60 min</span>
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-bold text-white">$79</span>
              </div>
              <p className="text-white/60 text-sm mb-3">Quick wins, lasting confidence</p>
              <ul className="space-y-1.5">
                {["60 min dedicated one-on-one", "Plain language explanations", "Custom AI-generated guide", "Help with photos, devices, apps"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-white/80 text-sm">
                    <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-3 border-t border-white/10">
                <p className="text-teal-400 text-xs font-medium">Perfect for specific tech challenges</p>
              </div>
            </div>
          </div>
          
          <div
            className="transition-all duration-700"
            style={{
              opacity: progress > 50 ? 1 : 0,
              transform: `translateY(${progress > 50 ? 0 : 30}px)`,
            }}
          >
            <div className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 border-2 border-orange-500/50 rounded-xl p-5 h-full relative">
              <div className="absolute -top-3 right-4">
                <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">Best Value</span>
              </div>
              <div className="flex items-center justify-between mb-3 mt-1">
                <span className="text-white text-lg font-bold">Bundle Package</span>
                <span className="text-orange-400 text-sm font-medium">3 sessions</span>
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-bold text-white">$199</span>
                <span className="text-white/40 text-sm line-through ml-2">$237</span>
              </div>
              <p className="text-white/60 text-sm mb-3">Steady progress, lasting peace of mind</p>
              <ul className="space-y-1.5">
                {["3 full 60-minute sessions", "Same trusted buddy throughout", "Save $38 vs. individual", "Personalized digital folder"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-white/80 text-sm">
                    <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-3 border-t border-white/10">
                <p className="text-orange-400 text-xs font-medium">For truly comfortable technology use</p>
              </div>
            </div>
          </div>
        </div>
        
        <div
          className="mt-6 grid grid-cols-3 gap-4 max-w-md mx-auto transition-all duration-500"
          style={{ opacity: progress > 75 ? 1 : 0 }}
        >
          {[
            { icon: Shield, label: "Secure" },
            { icon: Star, label: "5-Star Service" },
            { icon: Users, label: "1000+ Happy Customers" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1 text-white/60">
              <item.icon className="w-5 h-5" />
              <span className="text-xs text-center">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Scene7({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="absolute w-[800px] h-[800px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
        style={{ transform: `scale(${1 + progress / 100})` }}
      />
      
      <div className="text-center z-10 px-4">
        <div
          className="transition-all duration-1000"
          style={{
            opacity: progress > 15 ? 1 : 0,
            transform: `scale(${progress > 15 ? 1 : 0.8})`,
          }}
        >
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-60 animate-pulse" />
            <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-12 rounded-3xl">
              <Sparkles className="w-20 h-20 md:w-28 md:h-28 text-white" />
            </div>
          </div>
        </div>
        
        <h2
          className="text-4xl md:text-6xl font-bold text-white mb-4 transition-all duration-700"
          style={{
            opacity: progress > 30 ? 1 : 0,
            transform: `translateY(${progress > 30 ? 0 : 20}px)`,
          }}
        >
          Ready to <span className="text-blue-400">Save</span>?
        </h2>
        
        <p
          className="text-xl text-white/80 mb-8 max-w-xl mx-auto transition-all duration-500"
          style={{ opacity: progress > 45 ? 1 : 0 }}
        >
          Join thousands of customers who save money, time, and stress with their personal AI Buddy
        </p>
        
        <div
          className="flex flex-wrap justify-center gap-4 mb-8 transition-all duration-500"
          style={{ opacity: progress > 60 ? 1 : 0 }}
        >
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2">
            <span className="text-green-400 font-bold">$2,400+</span>
            <span className="text-white/80 text-sm ml-2">Yearly Savings</span>
          </div>
          <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-lg px-4 py-2">
            <span className="text-cyan-400 font-bold">10+ hours</span>
            <span className="text-white/80 text-sm ml-2">Monthly Time Saved</span>
          </div>
        </div>
        
        <div
          className="transition-all duration-500"
          style={{ opacity: progress > 70 ? 1 : 0 }}
        >
          <Link href="/products">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-6 text-lg rounded-xl"
              data-testid="button-get-started"
            >
              Get Your AI Buddy <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
        
        <p
          className="mt-6 text-white/60 text-sm transition-all duration-500"
          style={{ opacity: progress > 85 ? 1 : 0 }}
        >
          Only $29/month - Cancel anytime
        </p>
      </div>
    </div>
  );
}

export default function WhyBitForce() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentScene, setCurrentScene] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= TOTAL_DURATION) {
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    let elapsed = 0;
    let foundScene = false;
    for (let i = 0; i < scenes.length; i++) {
      if (currentTime >= elapsed && currentTime < elapsed + scenes[i].duration) {
        setCurrentScene(i);
        foundScene = true;
        break;
      }
      elapsed += scenes[i].duration;
    }
    if (!foundScene && currentTime >= TOTAL_DURATION) {
      setCurrentScene(scenes.length - 1);
    }
  }, [currentTime]);

  const getSceneProgress = () => {
    const sceneDuration = scenes[currentScene]?.duration || 1;
    let elapsed = 0;
    for (let i = 0; i < currentScene; i++) {
      elapsed += scenes[i].duration;
    }
    const sceneTime = Math.max(0, currentTime - elapsed);
    return Math.min(100, (sceneTime / sceneDuration) * 100);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const progressPercent = (currentTime / TOTAL_DURATION) * 100;
  const sceneProgress = getSceneProgress();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${scenes[currentScene].bgGradient} transition-all duration-1000`}
      />

      {currentScene === 0 && <Scene1 progress={sceneProgress} />}
      {currentScene === 1 && <Scene2 progress={sceneProgress} />}
      {currentScene === 2 && <Scene3 progress={sceneProgress} />}
      {currentScene === 3 && <Scene4 progress={sceneProgress} />}
      {currentScene === 4 && <Scene5 progress={sceneProgress} />}
      {currentScene === 5 && <Scene6 progress={sceneProgress} />}
      {currentScene === 6 && <Scene7 progress={sceneProgress} />}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-3">
          <Progress value={progressPercent} className="h-1 bg-white/20" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => setIsPlaying(!isPlaying)}
                data-testid="button-play-pause"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => setIsMuted(!isMuted)}
                data-testid="button-mute"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={handleRestart}
                data-testid="button-restart"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="text-white/80 text-sm hidden sm:block">
              {scenes[currentScene].title}
            </div>
            
            <div className="text-white/60 text-sm">
              {Math.floor(currentTime)}s / {TOTAL_DURATION}s
            </div>
          </div>
          
          <div className="flex gap-1">
            {scenes.map((scene, i) => (
              <div
                key={scene.id}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i < currentScene
                    ? "bg-blue-500"
                    : i === currentScene
                    ? "bg-blue-400"
                    : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4">
        <Link href="/">
          <Button
            variant="ghost"
            className="text-white/60 hover:text-white hover:bg-white/10"
            data-testid="button-exit"
          >
            Exit
          </Button>
        </Link>
      </div>
    </div>
  );
}
