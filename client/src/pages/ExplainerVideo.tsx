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
  Rocket,
  Lock,
  Zap,
  Globe,
  ChevronRight,
  Sparkles,
  Wrench,
  Package,
} from "lucide-react";
import { Link } from "wouter";

import toolAiAssistant from "@assets/Screenshot_2026-01-09_153919_1767991243060.png";
import toolSecurityCheck from "@assets/Screenshot_2026-01-09_153928_1767991243060.png";
import toolFriendFinder from "@assets/Screenshot_2026-01-09_153937_1767991243059.png";
import toolPropertyLookup from "@assets/Screenshot_2026-01-09_153951_1767991243059.png";
import toolIntelligence from "@assets/Screenshot_2026-01-09_154003_1767991243059.png";

import productMonthly from "@assets/Screenshot_2026-01-09_154927_1767992059208.png";
import productOneTime from "@assets/Screenshot_2026-01-09_154933_1767992059208.png";
import productBundle from "@assets/Screenshot_2026-01-09_154943_1767992059208.png";
import productScanner from "@assets/Screenshot_2026-01-09_154954_1767992059208.png";

interface Scene {
  id: number;
  title: string;
  duration: number;
  bgGradient: string;
}

const scenes: Scene[] = [
  { id: 1, title: "The Problem", duration: 4, bgGradient: "from-slate-900 via-slate-800 to-slate-900" },
  { id: 2, title: "BitForce Enters", duration: 4, bgGradient: "from-blue-900 via-indigo-900 to-purple-900" },
  { id: 3, title: "Our Solutions", duration: 6, bgGradient: "from-indigo-900 via-blue-800 to-cyan-900" },
  { id: 4, title: "Ambassador Tools", duration: 8, bgGradient: "from-cyan-900 via-teal-800 to-emerald-900" },
  { id: 5, title: "Join Our Team", duration: 6, bgGradient: "from-teal-900 via-emerald-800 to-green-900" },
  { id: 6, title: "Our Products", duration: 12, bgGradient: "from-emerald-900 via-green-800 to-teal-900" },
  { id: 7, title: "The Opportunity", duration: 4, bgGradient: "from-purple-900 via-violet-800 to-indigo-900" },
  { id: 8, title: "Call to Action", duration: 4, bgGradient: "from-blue-800 via-indigo-700 to-blue-900" },
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

function Scene1({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <ParticleField />
      <FloatingIcon icon={Lock} delay={0} x={10} y={20} />
      <FloatingIcon icon={Shield} delay={0.5} x={80} y={30} />
      <FloatingIcon icon={Brain} delay={1} x={15} y={70} />
      <FloatingIcon icon={Globe} delay={1.5} x={85} y={75} />
      
      <div className="text-center z-10 px-4">
        <div 
          className="transition-all duration-1000"
          style={{ 
            opacity: progress > 10 ? 1 : 0,
            transform: `translateY(${progress > 10 ? 0 : 30}px)` 
          }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            In today's digital world...
          </h2>
        </div>
        
        <div 
          className="transition-all duration-1000 delay-500"
          style={{ 
            opacity: progress > 40 ? 1 : 0,
            transform: `translateY(${progress > 40 ? 0 : 30}px)` 
          }}
        >
          <p className="text-lg md:text-2xl text-white/80 max-w-2xl mx-auto">
            Every day, individuals and businesses face digital challenges - 
            <span className="text-red-400"> security threats</span>, 
            <span className="text-yellow-400"> AI complexity</span>, and 
            <span className="text-orange-400"> technological overwhelm</span>.
          </p>
        </div>
        
        <div className="flex justify-center gap-8 mt-12">
          {[
            { icon: Lock, label: "Security Threats", color: "text-red-400" },
            { icon: Brain, label: "AI Complexity", color: "text-yellow-400" },
            { icon: Zap, label: "Tech Overload", color: "text-orange-400" },
          ].map((item, i) => (
            <div
              key={i}
              className="transition-all duration-700"
              style={{
                opacity: progress > 60 + i * 10 ? 1 : 0,
                transform: `scale(${progress > 60 + i * 10 ? 1 : 0.5})`,
              }}
            >
              <div className={`${item.color} flex flex-col items-center gap-2`}>
                <item.icon className="w-10 h-10 md:w-16 md:h-16" />
                <span className="text-xs md:text-sm">{item.label}</span>
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
            opacity: progress > 30 ? 1 : 0,
            transform: `scale(${progress > 30 ? 1 : 0.5})`,
          }}
        >
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
            <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-6 md:p-8 rounded-2xl">
              <Rocket className="w-16 h-16 md:w-24 md:h-24 text-white" />
            </div>
          </div>
        </div>
        
        <h2
          className="text-4xl md:text-6xl font-bold text-white mb-4 transition-all duration-700"
          style={{
            opacity: progress > 50 ? 1 : 0,
            transform: `translateY(${progress > 50 ? 0 : 30}px)`,
          }}
        >
          Introducing <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">BitForce</span>
        </h2>
        
        <p
          className="text-xl md:text-2xl text-white/80 transition-all duration-700"
          style={{
            opacity: progress > 70 ? 1 : 0,
            transform: `translateY(${progress > 70 ? 0 : 20}px)`,
          }}
        >
          Your Digital Empowerment Partner
        </p>
        
        <div
          className="mt-8 flex items-center justify-center gap-2 text-blue-300 transition-all duration-500"
          style={{ opacity: progress > 85 ? 1 : 0 }}
        >
          <Shield className="w-6 h-6 animate-pulse" />
          <span className="text-lg">Protecting. Empowering. Connecting.</span>
          <Shield className="w-6 h-6 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function Scene3({ progress }: { progress: number }) {
  const solutions = [
    {
      icon: Shield,
      title: "Advanced Digital Security",
      desc: "Shield protecting data streams",
      color: "from-green-500 to-emerald-600",
      showAt: 15,
    },
    {
      icon: Brain,
      title: "Smart AI Companions",
      desc: "AI characters assisting humans",
      color: "from-purple-500 to-violet-600",
      showAt: 40,
    },
    {
      icon: Users,
      title: "Ambassador Opportunity",
      desc: "People gaining digital superpowers",
      color: "from-blue-500 to-cyan-600",
      showAt: 65,
    },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <ParticleField />
      
      <div className="z-10 w-full max-w-5xl px-4">
        <h2
          className="text-3xl md:text-5xl font-bold text-white text-center mb-12 transition-all duration-700"
          style={{
            opacity: progress > 5 ? 1 : 0,
            transform: `translateY(${progress > 5 ? 0 : -30}px)`,
          }}
        >
          Our Solutions
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {solutions.map((solution, i) => (
            <div
              key={i}
              className="transition-all duration-700"
              style={{
                opacity: progress > solution.showAt ? 1 : 0,
                transform: `translateY(${progress > solution.showAt ? 0 : 50}px) scale(${progress > solution.showAt ? 1 : 0.8})`,
              }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:border-white/40 transition-colors">
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${solution.color} mb-4`}>
                  <solution.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{solution.title}</h3>
                <p className="text-white/60 text-sm">{solution.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div
          className="mt-8 flex justify-center gap-4 text-white/60 text-sm transition-all duration-500"
          style={{ opacity: progress > 85 ? 1 : 0 }}
        >
          <span className="flex items-center gap-1"><Lock className="w-4 h-4" /> Secure</span>
          <span className="flex items-center gap-1"><Zap className="w-4 h-4" /> Fast</span>
          <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> Connected</span>
        </div>
      </div>
    </div>
  );
}

const TOOL_SCREENSHOTS = [
  { src: toolAiAssistant, title: "AI Sales Assistant", showAt: 5 },
  { src: toolSecurityCheck, title: "Security Risk Check", showAt: 25 },
  { src: toolFriendFinder, title: "Friend & Family Finder", showAt: 45 },
  { src: toolPropertyLookup, title: "Property Lookup", showAt: 65 },
  { src: toolIntelligence, title: "Intelligence Tools", showAt: 85 },
];

const PRODUCT_SCREENSHOTS = [
  { src: productMonthly, title: "Monthly AI Buddy Subscription", subtitle: "$29/month - Most Popular", showAt: 5 },
  { src: productOneTime, title: "One-Time AI Buddy Session", subtitle: "$79 - 60 Minutes", showAt: 30 },
  { src: productBundle, title: "AI Buddy Bundle Package", subtitle: "$199 - Best Value", showAt: 55 },
  { src: productScanner, title: "Digital Footprint Scanner", subtitle: "Included with Plan", showAt: 80 },
];

function SceneTools({ progress }: { progress: number }) {
  const currentToolIndex = TOOL_SCREENSHOTS.findIndex((tool, i) => {
    const nextTool = TOOL_SCREENSHOTS[i + 1];
    if (!nextTool) return progress >= tool.showAt;
    return progress >= tool.showAt && progress < nextTool.showAt;
  });
  
  const activeIndex = currentToolIndex >= 0 ? currentToolIndex : 0;

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <ParticleField />
      
      <div className="z-10 w-full max-w-5xl px-4">
        <div
          className="text-center mb-6 transition-all duration-500"
          style={{
            opacity: progress > 2 ? 1 : 0,
            transform: `translateY(${progress > 2 ? 0 : -20}px)`,
          }}
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
            <Wrench className="w-5 h-5 text-teal-400" />
            <span className="text-white/80 text-sm">Ambassador Toolkit</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Powerful Tools at Your Fingertips
          </h2>
        </div>

        <div className="relative h-[280px] md:h-[320px] flex items-center justify-center">
          {TOOL_SCREENSHOTS.map((tool, i) => {
            const isActive = i === activeIndex;
            const isPast = i < activeIndex;
            
            return (
              <div
                key={i}
                className="absolute transition-all duration-700 ease-out"
                style={{
                  opacity: isActive ? 1 : isPast ? 0 : 0.3,
                  transform: `translateX(${isActive ? 0 : isPast ? -100 : 100}px) scale(${isActive ? 1 : 0.8})`,
                  zIndex: isActive ? 10 : 1,
                }}
              >
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-white/20">
                  <img
                    src={tool.src}
                    alt={tool.title}
                    className="w-[500px] md:w-[600px] h-auto object-contain"
                  />
                </div>
                <p className="text-center text-white font-medium mt-3 text-lg">
                  {tool.title}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {TOOL_SCREENSHOTS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === activeIndex ? "bg-teal-400 w-6" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SceneMotivational({ progress }: { progress: number }) {
  const lines = [
    { text: "Join our team of AI experts", delay: 10 },
    { text: "Offer valuable AI tools to your community", delay: 35 },
    { text: "Network and connect with hi powered AI tools", delay: 60 },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <ParticleField />
      
      <div
        className="absolute w-[500px] h-[500px] bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl"
        style={{
          transform: `scale(${1 + progress / 150})`,
          opacity: 0.6,
        }}
      />
      
      <div className="text-center z-10 px-4 max-w-3xl">
        <div className="space-y-8">
          {lines.map((line, i) => (
            <div
              key={i}
              className="transition-all duration-1000"
              style={{
                opacity: progress > line.delay ? 1 : 0,
                transform: `translateY(${progress > line.delay ? 0 : 40}px) scale(${progress > line.delay ? 1 : 0.9})`,
              }}
            >
              <h2 className="text-2xl md:text-4xl font-bold text-white leading-relaxed">
                {i === 0 && (
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    {line.text}
                  </span>
                )}
                {i === 1 && (
                  <span className="text-white">
                    {line.text}
                  </span>
                )}
                {i === 2 && (
                  <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                    {line.text}
                  </span>
                )}
              </h2>
            </div>
          ))}
        </div>
        
        <div
          className="mt-12 flex justify-center gap-6 transition-all duration-700"
          style={{ opacity: progress > 80 ? 1 : 0 }}
        >
          <Brain className="w-8 h-8 text-emerald-400 animate-pulse" />
          <Users className="w-8 h-8 text-teal-400 animate-pulse" style={{ animationDelay: "0.2s" }} />
          <Globe className="w-8 h-8 text-cyan-400 animate-pulse" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  );
}

function SceneProducts({ progress }: { progress: number }) {
  const currentProductIndex = PRODUCT_SCREENSHOTS.findIndex((product, i) => {
    const nextProduct = PRODUCT_SCREENSHOTS[i + 1];
    if (!nextProduct) return progress >= product.showAt;
    return progress >= product.showAt && progress < nextProduct.showAt;
  });
  
  const activeIndex = currentProductIndex >= 0 ? currentProductIndex : 0;

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <ParticleField />
      
      <div className="z-10 w-full max-w-5xl px-4">
        <div
          className="text-center mb-6 transition-all duration-500"
          style={{
            opacity: progress > 2 ? 1 : 0,
            transform: `translateY(${progress > 2 ? 0 : -20}px)`,
          }}
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
            <Package className="w-5 h-5 text-emerald-400" />
            <span className="text-white/80 text-sm">AI Buddy Services</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Our Products & Services
          </h2>
        </div>

        <div className="relative h-[350px] md:h-[400px] flex items-center justify-center">
          {PRODUCT_SCREENSHOTS.map((product, i) => {
            const isActive = i === activeIndex;
            const isPast = i < activeIndex;
            
            return (
              <div
                key={i}
                className="absolute transition-all duration-700 ease-out"
                style={{
                  opacity: isActive ? 1 : isPast ? 0 : 0.3,
                  transform: `translateX(${isActive ? 0 : isPast ? -100 : 100}px) scale(${isActive ? 1 : 0.8})`,
                  zIndex: isActive ? 10 : 1,
                }}
              >
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-white/20">
                  <img
                    src={product.src}
                    alt={product.title}
                    className="w-[280px] md:w-[320px] h-auto object-contain"
                  />
                </div>
                <div className="text-center mt-3">
                  <p className="text-white font-medium text-lg">
                    {product.title}
                  </p>
                  <p className="text-emerald-300 text-sm">
                    {product.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {PRODUCT_SCREENSHOTS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === activeIndex ? "bg-emerald-400 w-6" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Scene4({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-4 h-4 bg-purple-400/30 rounded-full transition-all duration-1000"
          style={{
            left: `${20 + (i % 4) * 20}%`,
            top: `${30 + Math.floor(i / 4) * 20}%`,
            transform: `scale(${progress > 20 + i * 5 ? 1 : 0})`,
            opacity: progress > 20 + i * 5 ? 1 : 0,
          }}
        />
      ))}
      
      {[...Array(12)].map((_, i) => (
        <svg key={`line-${i}`} className="absolute inset-0 w-full h-full pointer-events-none">
          <line
            x1={`${20 + (i % 4) * 20}%`}
            y1={`${30 + Math.floor(i / 4) * 20}%`}
            x2={`${20 + ((i + 1) % 4) * 20}%`}
            y2={`${30 + Math.floor((i + 1) / 4) * 20}%`}
            stroke="rgba(168, 85, 247, 0.3)"
            strokeWidth="1"
            className="transition-all duration-500"
            style={{ opacity: progress > 40 + i * 3 ? 1 : 0 }}
          />
        </svg>
      ))}
      
      <div className="text-center z-10 px-4">
        <h2
          className="text-3xl md:text-5xl font-bold text-white mb-6 transition-all duration-700"
          style={{
            opacity: progress > 30 ? 1 : 0,
            transform: `translateY(${progress > 30 ? 0 : 30}px)`,
          }}
        >
          Join the <span className="text-purple-400">BitForce</span> Movement
        </h2>
        
        <p
          className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 transition-all duration-700"
          style={{
            opacity: progress > 50 ? 1 : 0,
          }}
        >
          Whether you need protection, AI assistance, or a new digital career path - 
          BitForce empowers your digital future.
        </p>
        
        <div
          className="flex flex-wrap justify-center gap-4 transition-all duration-700"
          style={{ opacity: progress > 70 ? 1 : 0 }}
        >
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg px-4 py-2">
            <span className="text-green-400 font-semibold">$50</span>
            <span className="text-white/80 text-sm ml-2">Referral Bonus</span>
          </div>
          <div className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-500/30 rounded-lg px-4 py-2">
            <span className="text-purple-400 font-semibold">20%</span>
            <span className="text-white/80 text-sm ml-2">Recurring Override</span>
          </div>
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg px-4 py-2">
            <span className="text-blue-400 font-semibold">$29</span>
            <span className="text-white/80 text-sm ml-2">To Start</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Scene5({ progress }: { progress: number }) {
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
            opacity: progress > 20 ? 1 : 0,
            transform: `scale(${progress > 20 ? 1 : 0.8})`,
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
            opacity: progress > 40 ? 1 : 0,
            transform: `translateY(${progress > 40 ? 0 : 20}px)`,
          }}
        >
          Start Your Journey <span className="text-blue-400">Today</span>
        </h2>
        
        <p
          className="text-xl text-white/80 mb-8 transition-all duration-500"
          style={{ opacity: progress > 60 ? 1 : 0 }}
        >
          Digital Empowerment Partner
        </p>
        
        <div
          className="transition-all duration-500"
          style={{ opacity: progress > 75 ? 1 : 0 }}
        >
          <Link href="/ambassador-signup">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-6 text-lg rounded-xl"
              data-testid="button-join-now"
            >
              Join Now <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
        
        <p
          className="mt-6 text-white/60 text-sm transition-all duration-500"
          style={{ opacity: progress > 85 ? 1 : 0 }}
        >
          bitforceambassadorportal.replit.app
        </p>
      </div>
    </div>
  );
}

export default function ExplainerVideo() {
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
      {currentScene === 3 && <SceneTools progress={sceneProgress} />}
      {currentScene === 4 && <SceneMotivational progress={sceneProgress} />}
      {currentScene === 5 && <SceneProducts progress={sceneProgress} />}
      {currentScene === 6 && <Scene4 progress={sceneProgress} />}
      {currentScene === 7 && <Scene5 progress={sceneProgress} />}

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
