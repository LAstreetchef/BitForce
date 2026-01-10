import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Star,
  Film,
  Music,
  Home,
  Briefcase,
  TrendingUp,
  Users,
  DollarSign,
  Brain,
  Shield,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Award,
  Zap,
  Target,
  Rocket,
  ArrowRight,
} from "lucide-react";
import { Link } from "wouter";

import pauloFullBody from "@assets/bitforcebuddy_1768034430674.png";
import pauloCloseUp from "@assets/bitboy2_1768034430674.png";
import pauloBlue from "@assets/pb3_1768034430674.png";
import pauloYellow from "@assets/pb4_1768034430671.png";
import pauloAmbassador from "@assets/bitforcebuddy_1768035690553.png";

import toolAiAssistant from "@assets/Screenshot_2026-01-09_153919_1768035729424.png";
import toolSecurityCheck from "@assets/Screenshot_2026-01-09_153928_1768035729423.png";
import toolPropertyLookup from "@assets/Screenshot_2026-01-09_153951_1768035729423.png";

interface Scene {
  id: number;
  title: string;
  duration: number;
  bgGradient: string;
}

const scenes: Scene[] = [
  { id: 1, title: "Meet Paulo Benedeti", duration: 9, bgGradient: "from-slate-900 via-amber-900/30 to-slate-900" },
  { id: 2, title: "Hollywood Star", duration: 9, bgGradient: "from-amber-900 via-orange-900 to-red-900" },
  { id: 3, title: "Renaissance Man", duration: 9, bgGradient: "from-red-900 via-purple-900 to-indigo-900" },
  { id: 4, title: "Why BitForce?", duration: 9, bgGradient: "from-indigo-900 via-blue-900 to-cyan-900" },
  { id: 5, title: "The AI Revolution", duration: 9, bgGradient: "from-cyan-900 via-teal-800 to-emerald-900" },
  { id: 6, title: "Ambassador Tools", duration: 9, bgGradient: "from-emerald-900 via-green-800 to-teal-900" },
  { id: 7, title: "Income Potential", duration: 10, bgGradient: "from-teal-900 via-cyan-800 to-blue-900" },
  { id: 8, title: "Team Building", duration: 9, bgGradient: "from-blue-900 via-indigo-800 to-purple-900" },
  { id: 9, title: "Paulo's Success", duration: 9, bgGradient: "from-purple-900 via-violet-800 to-pink-900" },
  { id: 10, title: "Your Turn", duration: 8, bgGradient: "from-pink-900 via-rose-800 to-amber-900" },
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

function PauloPresenter({ image, message, position = "right" }: { image: string; message: string; position?: "left" | "right" }) {
  return (
    <motion.div
      className={`fixed bottom-24 ${position === "right" ? "right-4 md:right-8" : "left-4 md:left-8"} z-50 pointer-events-none`}
      initial={{ opacity: 0, x: position === "right" ? 150 : -150, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: position === "right" ? 150 : -150, scale: 0.8 }}
      transition={{ type: "spring", damping: 15, stiffness: 200 }}
    >
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`absolute -top-2 ${position === "right" ? "-left-52" : "-right-52"} bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl px-4 py-3 shadow-xl border-2 border-white/30 max-w-[220px]`}
        >
          <span className="text-white text-sm font-bold drop-shadow-sm whitespace-normal">{message}</span>
          <div className={`absolute ${position === "right" ? "-right-2" : "-left-2"} top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 ${position === "right" ? "border-l-8 border-transparent border-l-orange-600" : "border-r-8 border-transparent border-r-orange-600"}`} />
        </motion.div>
        
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full blur-lg opacity-60 animate-pulse" />
          <div className="relative w-24 h-28 md:w-28 md:h-32 overflow-hidden rounded-t-full rounded-b-3xl border-4 border-amber-400/50 shadow-2xl bg-gradient-to-b from-slate-800 to-slate-900">
            <img src={image} alt="Paulo Benedeti" className="w-full h-full object-cover object-top" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function CredentialBadge({ icon: Icon, label, color, delay }: { icon: any; label: string; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay, type: "spring", damping: 12 }}
      className={`${color} px-4 py-2 rounded-full flex items-center gap-2 shadow-lg border border-white/20`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-bold text-sm md:text-base">{label}</span>
    </motion.div>
  );
}

function AnimatedIncomeBar({ stage, amount, delay }: { stage: string; amount: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="flex items-center gap-4"
    >
      <div className="w-32 text-right text-white/80 text-sm">{stage}</div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ delay: delay + 0.3, duration: 0.8 }}
        className="flex-1 h-8 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg flex items-center justify-end px-4"
      >
        <span className="text-white font-bold text-sm">{amount}</span>
      </motion.div>
    </motion.div>
  );
}

function Scene1({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <ParticleField />
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10" />
      
      <div className="text-center z-10 px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: progress > 10 ? 1 : 0, scale: progress > 10 ? 1 : 0.5 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full blur-2xl opacity-60 animate-pulse" />
            <div className="relative w-40 h-48 md:w-56 md:h-64 overflow-hidden rounded-t-full rounded-b-3xl border-4 border-amber-400/60 shadow-2xl mx-auto">
              <img src={pauloCloseUp} alt="Paulo Benedeti" className="w-full h-full object-cover object-top" />
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: progress > 30 ? 1 : 0, y: progress > 30 ? 0 : 30 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Meet <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Paulo Benedeti</span>
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: progress > 50 ? 1 : 0, y: progress > 50 ? 0 : 20 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xl md:text-2xl text-white/80 mb-6">
            Actor. Musician. Real Estate Agent. Entrepreneur.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: progress > 70 ? 1 : 0 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-lg px-4 py-1">
            <Star className="w-4 h-4 mr-2" /> Hollywood Star
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40 text-lg px-4 py-1">
            <Rocket className="w-4 h-4 mr-2" /> BitForce Ambassador
          </Badge>
        </motion.div>
      </div>
    </div>
  );
}

function Scene2({ progress }: { progress: number }) {
  const credits = [
    { title: "The Bold and the Beautiful", role: "Antonio Dominguez", year: "2001-2002", highlight: true },
    { title: "Wild Things", role: "Feature Film", year: "1998", highlight: true },
    { title: "Guiding Light", role: "CBS Soap Opera", year: "Various" },
    { title: "The Etruscan Smile", role: "Drama Film", year: "" },
    { title: "Enemy Within", role: "Max", year: "2016" },
  ];
  
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.15)_0%,transparent_70%)]" />
      
      <div className="text-center z-10 px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: progress > 10 ? 1 : 0, y: progress > 10 ? 0 : -30 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Film className="w-10 h-10 text-amber-400" />
            <h2 className="text-3xl md:text-5xl font-bold text-white">Hollywood Credentials</h2>
            <Film className="w-10 h-10 text-amber-400" />
          </div>
          <p className="text-lg text-amber-300/80">IMDB: imdb.com/name/nm0004745</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {credits.map((credit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: progress > 20 + i * 12 ? 1 : 0, x: progress > 20 + i * 12 ? 0 : (i % 2 === 0 ? -50 : 50) }}
              transition={{ duration: 0.5 }}
              className={`${credit.highlight ? "bg-gradient-to-r from-amber-500/30 to-orange-500/30 border-amber-400/50" : "bg-white/5 border-white/10"} border rounded-xl p-4 text-left`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg">{credit.title}</h3>
                  <p className="text-white/70 text-sm">{credit.role}</p>
                </div>
                {credit.year && <Badge variant="secondary" className="text-xs">{credit.year}</Badge>}
              </div>
              {credit.highlight && (
                <div className="mt-2 flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-amber-400 text-xs ml-1">Featured Role</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Scene3({ progress }: { progress: number }) {
  const talents = [
    { icon: Film, label: "Actor", color: "bg-gradient-to-r from-amber-500 to-orange-500 text-white" },
    { icon: Music, label: "Musician", color: "bg-gradient-to-r from-purple-500 to-pink-500 text-white" },
    { icon: Home, label: "Real Estate Agent", color: "bg-gradient-to-r from-green-500 to-emerald-500 text-white" },
    { icon: Briefcase, label: "Entrepreneur", color: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white" },
  ];
  
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <ParticleField />
      
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 z-10 px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: progress > 10 ? 1 : 0, x: progress > 10 ? 0 : -50 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 rounded-3xl blur-xl opacity-50 animate-pulse" />
          <div className="relative w-48 h-56 md:w-64 md:h-72 overflow-hidden rounded-2xl border-4 border-white/30 shadow-2xl">
            <img src={pauloFullBody} alt="Paulo Benedeti" className="w-full h-full object-cover" />
          </div>
        </motion.div>
        
        <div className="text-center lg:text-left">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: progress > 20 ? 1 : 0, y: progress > 20 ? 0 : 20 }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            A True <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Renaissance Man</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: progress > 35 ? 1 : 0, y: progress > 35 ? 0 : 20 }}
            className="text-lg text-white/80 mb-8 max-w-md"
          >
            From Hollywood sets to real estate deals, Paulo has mastered multiple industries. Now he's leveraging AI to build his biggest success yet.
          </motion.p>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            {talents.map((talent, i) => (
              <CredentialBadge key={i} icon={talent.icon} label={talent.label} color={talent.color} delay={0.4 + i * 0.15} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Scene4({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2)_0%,transparent_60%)]" />
      
      <div className="text-center z-10 px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: progress > 10 ? 1 : 0, scale: progress > 10 ? 1 : 0.8 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-60 animate-pulse" />
            <div className="relative w-32 h-36 md:w-40 md:h-44 overflow-hidden rounded-t-full rounded-b-3xl border-4 border-blue-400/50 shadow-2xl">
              <img src={pauloBlue} alt="Paulo" className="w-full h-full object-cover object-top" />
            </div>
          </div>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: progress > 25 ? 1 : 0, y: progress > 25 ? 0 : 20 }}
          className="text-3xl md:text-5xl font-bold text-white mb-6"
        >
          "Why did I choose <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">BitForce</span>?"
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: progress > 45 ? 1 : 0, y: progress > 45 ? 0 : 20 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto"
        >
          <p className="text-lg md:text-xl text-white/90 italic leading-relaxed">
            "I've been successful in entertainment, music, and real estate. But I recognized early that AI is the next major wave. BitForce lets me leverage cutting-edge AI tools while helping everyday people navigate technology. It's the perfect blend of innovation and impact."
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-amber-400">
            <span className="font-bold">— Paulo Benedeti</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Scene5({ progress }: { progress: number }) {
  const stats = [
    { label: "AI Market by 2030", value: "$1.8 Trillion", icon: TrendingUp },
    { label: "Annual Growth Rate", value: "37%", icon: Rocket },
    { label: "Jobs Transformed", value: "40%", icon: Brain },
  ];
  
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <ParticleField />
      
      <div className="text-center z-10 px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: progress > 10 ? 1 : 0, y: progress > 10 ? 0 : -30 }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            The <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">AI Revolution</span> is Here
          </h2>
          <p className="text-lg text-white/70">And Paulo saw it coming</p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: progress > 25 + i * 15 ? 1 : 0, y: progress > 25 + i * 15 ? 0 : 50 }}
              className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6"
            >
              <stat.icon className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: progress > 75 ? 1 : 0 }}
          className="bg-emerald-500/20 border border-emerald-400/40 rounded-xl p-4 inline-block"
        >
          <p className="text-emerald-300 font-medium">
            <Zap className="w-5 h-5 inline mr-2" />
            BitForce ambassadors are positioned at the forefront of this revolution
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Scene6({ progress }: { progress: number }) {
  const tools = [
    { image: toolAiAssistant, name: "AI Assistant", desc: "Smart customer matching" },
    { image: toolSecurityCheck, name: "Security Scanner", desc: "Digital protection insights" },
    { image: toolPropertyLookup, name: "Property Intel", desc: "Real estate powered by AI" },
  ];
  
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0%,transparent_60%)]" />
      
      <div className="z-10 px-4 max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: progress > 10 ? 1 : 0, y: progress > 10 ? 0 : -20 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            <Brain className="w-10 h-10 inline mr-3 text-emerald-400" />
            Paulo's AI Toolkit
          </h2>
          <p className="text-lg text-white/70">Powerful tools that make selling effortless</p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {tools.map((tool, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: progress > 20 + i * 20 ? 1 : 0, y: progress > 20 + i * 20 ? 0 : 30 }}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover-elevate"
            >
              <img src={tool.image} alt={tool.name} className="w-full h-40 object-cover" />
              <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                <h3 className="text-white font-bold text-lg">{tool.name}</h3>
                <p className="text-white/60 text-sm">{tool.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Scene7({ progress }: { progress: number }) {
  const stages = [
    { stage: "First Week", amount: "$250-500" },
    { stage: "First Month", amount: "$1,000-2,000" },
    { stage: "Month 3", amount: "$3,000-5,000" },
    { stage: "Month 6+", amount: "$8,000-15,000" },
  ];
  
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <ParticleField />
      
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 z-10 px-4 max-w-6xl">
        <div className="text-center lg:text-left lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: progress > 10 ? 1 : 0, x: progress > 10 ? 0 : -30 }}
          >
            <DollarSign className="w-16 h-16 text-green-400 mb-4" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Real <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Income</span> Potential
            </h2>
            <p className="text-lg text-white/70 mb-8">What Paulo's earning trajectory looks like</p>
          </motion.div>
          
          <div className="space-y-4 max-w-md">
            {stages.map((item, i) => (
              <AnimatedIncomeBar key={i} stage={item.stage} amount={item.amount} delay={0.2 + i * 0.3} />
            ))}
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: progress > 50 ? 1 : 0, scale: progress > 50 ? 1 : 0.8 }}
          className="relative lg:w-1/3"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-xl opacity-50 animate-pulse" />
          <div className="relative w-40 h-48 md:w-48 md:h-56 overflow-hidden rounded-t-full rounded-b-3xl border-4 border-green-400/50 shadow-2xl">
            <img src={pauloYellow} alt="Paulo" className="w-full h-full object-cover object-top" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Scene8({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15)_0%,transparent_60%)]" />
      
      <div className="text-center z-10 px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: progress > 10 ? 1 : 0, y: progress > 10 ? 0 : -20 }}
          className="mb-8"
        >
          <Users className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Build Your <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Dream Team</span>
          </h2>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: progress > 25 ? 1 : 0, y: progress > 25 ? 0 : 30 }}
            className="bg-purple-500/20 border border-purple-400/40 rounded-xl p-6"
          >
            <div className="text-3xl font-bold text-purple-300 mb-2">$50</div>
            <div className="text-white/70">Per referral bonus</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: progress > 40 ? 1 : 0, y: progress > 40 ? 0 : 30 }}
            className="bg-pink-500/20 border border-pink-400/40 rounded-xl p-6"
          >
            <div className="text-3xl font-bold text-pink-300 mb-2">20%</div>
            <div className="text-white/70">Override on team sales</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: progress > 55 ? 1 : 0, y: progress > 55 ? 0 : 30 }}
            className="bg-violet-500/20 border border-violet-400/40 rounded-xl p-6"
          >
            <div className="text-3xl font-bold text-violet-300 mb-2">$4/mo</div>
            <div className="text-white/70">Passive per active member</div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: progress > 75 ? 1 : 0 }}
          className="text-white/80 text-lg"
        >
          <Sparkles className="w-5 h-5 inline mr-2 text-yellow-400" />
          10 team members = <span className="text-green-400 font-bold">$540+/month</span> in passive income alone
        </motion.div>
      </div>
    </div>
  );
}

function Scene9({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.15)_0%,transparent_60%)]" />
      
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 z-10 px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: progress > 10 ? 1 : 0, x: progress > 10 ? 0 : -50 }}
          className="relative"
        >
          <div className="absolute -inset-6 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 rounded-3xl blur-2xl opacity-50 animate-pulse" />
          <div className="relative w-48 h-56 md:w-56 md:h-64 overflow-hidden rounded-2xl border-4 border-pink-400/50 shadow-2xl">
            <img src={pauloAmbassador} alt="Paulo Ambassador" className="w-full h-full object-cover" />
          </div>
        </motion.div>
        
        <div className="text-center lg:text-left max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: progress > 25 ? 1 : 0, y: progress > 25 ? 0 : 20 }}
          >
            <Award className="w-12 h-12 text-amber-400 mb-4" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Paulo's <span className="bg-gradient-to-r from-pink-400 to-amber-400 bg-clip-text text-transparent">BitForce Journey</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: progress > 45 ? 1 : 0, y: progress > 45 ? 0 : 20 }}
            className="space-y-4 text-left"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-1">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <p className="text-white/80">Leveraged entertainment industry connections</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-1">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <p className="text-white/80">Used AI tools to enhance his real estate business</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center shrink-0 mt-1">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <p className="text-white/80">Built a team of 15+ ambassadors in 3 months</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shrink-0 mt-1">
                <span className="text-white font-bold text-sm">4</span>
              </div>
              <p className="text-white/80">Now earns $10,000+/month in combined income</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Scene10({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <ParticleField />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.2)_0%,transparent_60%)]" />
      
      <div className="text-center z-10 px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: progress > 10 ? 1 : 0, scale: progress > 10 ? 1 : 0.8 }}
          className="mb-8"
        >
          <Rocket className="w-20 h-20 text-amber-400 mx-auto mb-4" />
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Ready to Follow <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Paulo's Path</span>?
          </h2>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: progress > 30 ? 1 : 0, y: progress > 30 ? 0 : 20 }}
          className="text-xl text-white/80 mb-8"
        >
          Join the BitForce ambassador program and start your own success story
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: progress > 50 ? 1 : 0, y: progress > 50 ? 0 : 30 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/nextstep">
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-lg px-8 py-6" data-testid="button-start-journey">
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/joinbitforce">
            <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 font-bold text-lg px-8 py-6" data-testid="button-learn-more">
              Learn More
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: progress > 70 ? 1 : 0 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <Badge className="bg-green-500/20 text-green-300 border-green-500/40 text-sm px-3 py-1">
            <DollarSign className="w-4 h-4 mr-1" /> $29 Signup + $19.99/mo
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40 text-sm px-3 py-1">
            <Shield className="w-4 h-4 mr-1" /> Full AI Toolkit Access
          </Badge>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-sm px-3 py-1">
            <Users className="w-4 h-4 mr-1" /> Team Building Support
          </Badge>
        </motion.div>
      </div>
    </div>
  );
}

export default function AmbassadorOne() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneProgress, setSceneProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  
  const totalProgress = scenes.slice(0, currentScene).reduce((sum, s) => sum + s.duration, 0) + (sceneProgress / 100) * scenes[currentScene].duration;
  const overallProgress = (totalProgress / TOTAL_DURATION) * 100;
  
  const pauloImages = [pauloCloseUp, pauloFullBody, pauloBlue, pauloYellow, pauloAmbassador];
  const pauloMessages = [
    "I've been where you are - ready for something bigger!",
    "Hollywood taught me to take bold action",
    "AI is the future - and the future is NOW",
    "BitForce gave me the tools to succeed",
    "My team is growing every single week",
    "These AI tools are game-changers!",
    "The income potential is absolutely real",
    "I'm building passive income every day",
    "This is the best decision I ever made",
    "Join me - let's build together!",
  ];
  
  const goToScene = useCallback((index: number) => {
    if (index >= 0 && index < scenes.length) {
      setCurrentScene(index);
      setSceneProgress(0);
    }
  }, []);
  
  const goNext = useCallback(() => {
    if (currentScene < scenes.length - 1) {
      goToScene(currentScene + 1);
    }
  }, [currentScene, goToScene]);
  
  const goPrev = useCallback(() => {
    if (currentScene > 0) {
      goToScene(currentScene - 1);
    }
  }, [currentScene, goToScene]);
  
  const restart = () => {
    setCurrentScene(0);
    setSceneProgress(0);
    setIsPlaying(true);
  };
  
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);
  
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setSceneProgress((prev) => {
          if (prev >= 100) {
            setCurrentScene((s) => {
              if (s < scenes.length - 1) return s + 1;
              setIsPlaying(false);
              return s;
            });
            return 0;
          }
          return prev + (100 / (scenes[currentScene].duration * 10));
        });
      }, 100);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentScene]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        togglePlay();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev, togglePlay]);
  
  const renderScene = () => {
    const sceneComponents = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, Scene8, Scene9, Scene10];
    const SceneComponent = sceneComponents[currentScene];
    return <SceneComponent progress={sceneProgress} />;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-900" data-testid="page-ambassadorone">
      <div className={`fixed inset-0 bg-gradient-to-br ${scenes[currentScene].bgGradient} transition-all duration-1000`} />
      
      <div className="relative min-h-screen flex flex-col">
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScene}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {renderScene()}
            </motion.div>
          </AnimatePresence>
          
          <AnimatePresence>
            <PauloPresenter 
              image={pauloImages[currentScene % pauloImages.length]} 
              message={pauloMessages[currentScene]} 
              position={currentScene % 2 === 0 ? "right" : "left"}
            />
          </AnimatePresence>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-40">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="flex items-center justify-between text-white/80 text-sm">
              <span>{scenes[currentScene].title}</span>
              <span>Scene {currentScene + 1} of {scenes.length}</span>
            </div>
            
            <Progress value={overallProgress} className="h-2 bg-white/20" />
            
            <div className="flex items-center justify-center gap-4">
              <Button variant="ghost" size="icon" onClick={goPrev} disabled={currentScene === 0} className="text-white hover:bg-white/20" data-testid="button-prev">
                <ChevronLeft className="w-6 h-6" />
              </Button>
              
              <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/20" data-testid="button-play-pause">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
              
              <Button variant="ghost" size="icon" onClick={restart} className="text-white hover:bg-white/20" data-testid="button-restart">
                <RotateCcw className="w-5 h-5" />
              </Button>
              
              <Button variant="ghost" size="icon" onClick={goNext} disabled={currentScene === scenes.length - 1} className="text-white hover:bg-white/20" data-testid="button-next">
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
            
            <div className="flex justify-center gap-2">
              {scenes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToScene(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === currentScene ? "bg-amber-400 w-6" : "bg-white/30 hover:bg-white/50"}`}
                  data-testid={`button-scene-${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
