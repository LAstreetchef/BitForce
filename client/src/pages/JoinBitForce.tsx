import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Users,
  Rocket,
  Clock,
  DollarSign,
  Brain,
  Globe,
  ChevronRight,
  Sparkles,
  Target,
  Zap,
  Award,
  BarChart3,
  PieChart,
  ArrowRight,
} from "lucide-react";
import { Link } from "wouter";

import buddyFullBody from "@assets/bitforcebuddy_1768034430674.png";
import buddyCloseUp from "@assets/bitboy2_1768034430674.png";
import buddyBlue from "@assets/pb3_1768034430674.png";
import buddyYellow from "@assets/pb4_1768034430671.png";

interface Scene {
  id: number;
  title: string;
  duration: number;
  bgGradient: string;
}

const scenes: Scene[] = [
  { id: 1, title: "The AI Revolution", duration: 8, bgGradient: "from-slate-900 via-blue-900 to-slate-900" },
  { id: 2, title: "The Opportunity", duration: 10, bgGradient: "from-blue-900 via-indigo-900 to-purple-900" },
  { id: 3, title: "Freedom & Flexibility", duration: 10, bgGradient: "from-purple-900 via-violet-900 to-indigo-900" },
  { id: 4, title: "Elite Team", duration: 10, bgGradient: "from-indigo-900 via-blue-800 to-cyan-900" },
  { id: 5, title: "Earning Potential", duration: 12, bgGradient: "from-cyan-900 via-teal-800 to-emerald-900" },
  { id: 6, title: "AI Tools", duration: 10, bgGradient: "from-emerald-900 via-green-800 to-teal-900" },
  { id: 7, title: "Community Impact", duration: 10, bgGradient: "from-teal-900 via-cyan-800 to-blue-900" },
  { id: 8, title: "Join Now", duration: 10, bgGradient: "from-blue-800 via-indigo-700 to-purple-900" },
];

const TOTAL_DURATION = scenes.reduce((sum, s) => sum + s.duration, 0);

const PARTICLE_POSITIONS = Array.from({ length: 40 }, (_, i) => ({
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

function AnimatedBar({ label, value, maxValue, color, delay }: { label: string; value: number; maxValue: number; color: string; delay: number }) {
  const [animated, setAnimated] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const width = animated ? (value / maxValue) * 100 : 0;
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-white/80">{label}</span>
        <span className="text-white font-bold">{value}%</span>
      </div>
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: delay / 1000 }}
        />
      </div>
    </div>
  );
}

function AnimatedPieChart({ progress }: { progress: number }) {
  const segments = [
    { label: "Your Schedule", value: 40, color: "#3b82f6" },
    { label: "AI Support", value: 30, color: "#8b5cf6" },
    { label: "Team Backing", value: 30, color: "#06b6d4" },
  ];
  
  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {segments.map((seg, i) => {
            const offset = segments.slice(0, i).reduce((sum, s) => sum + s.value, 0);
            return (
              <motion.circle
                key={i}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={seg.color}
                strokeWidth="20"
                strokeDasharray={`${seg.value * 2.51} 251`}
                strokeDashoffset={`${-offset * 2.51}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: progress > 20 + i * 15 ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              />
            );
          })}
        </svg>
      </div>
      <div className="space-y-2">
        {segments.map((seg, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-2 text-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: progress > 30 + i * 15 ? 1 : 0, x: progress > 30 + i * 15 ? 0 : 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="text-white/80">{seg.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AnimatedLineGraph({ progress }: { progress: number }) {
  const points = [
    { month: "M1", value: 500 },
    { month: "M3", value: 1500 },
    { month: "M6", value: 3500 },
    { month: "M12", value: 8000 },
  ];
  
  const maxValue = 8000;
  const width = 280;
  const height = 120;
  
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <h4 className="text-white/80 text-sm mb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-green-400" />
        Earning Trajectory
      </h4>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        {points.map((p, i) => {
          const x = (i / (points.length - 1)) * (width - 40) + 20;
          const y = height - 20 - ((p.value / maxValue) * (height - 40));
          const nextPoint = points[i + 1];
          
          return (
            <g key={i}>
              {nextPoint && (
                <motion.line
                  x1={x}
                  y1={y}
                  x2={(i + 1) / (points.length - 1) * (width - 40) + 20}
                  y2={height - 20 - ((nextPoint.value / maxValue) * (height - 40))}
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progress > 20 + i * 20 ? 1 : 0 }}
                  transition={{ duration: 0.8, delay: i * 0.2 }}
                />
              )}
              <motion.circle
                cx={x}
                cy={y}
                r="6"
                fill="#3b82f6"
                initial={{ scale: 0 }}
                animate={{ scale: progress > 15 + i * 20 ? 1 : 0 }}
                transition={{ duration: 0.3, delay: i * 0.2 }}
              />
              <motion.text
                x={x}
                y={height - 5}
                textAnchor="middle"
                className="fill-white/60 text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: progress > 10 ? 1 : 0 }}
              >
                {p.month}
              </motion.text>
              <motion.text
                x={x}
                y={y - 12}
                textAnchor="middle"
                className="fill-green-400 text-xs font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: progress > 30 + i * 20 ? 1 : 0 }}
              >
                ${p.value.toLocaleString()}
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function BuddyCharacter({ image, position, message, visible }: { image: string; position: "left" | "right"; message?: string; visible: boolean }) {
  if (!visible) return null;
  
  return (
    <motion.div
      className={`fixed bottom-20 ${position === "right" ? "right-4 md:right-8" : "left-4 md:left-8"} z-50 pointer-events-none`}
      initial={{ opacity: 0, x: position === "right" ? 150 : -150, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: position === "right" ? 150 : -150, scale: 0.8 }}
      transition={{ type: "spring", damping: 15, stiffness: 200 }}
    >
      <div className="relative">
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute -top-2 ${position === "right" ? "-left-40" : "-right-40"} bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl px-4 py-3 shadow-xl whitespace-nowrap border-2 border-white/30 max-w-[180px]`}
          >
            <span className="text-white text-sm font-bold drop-shadow-sm whitespace-normal">{message}</span>
          </motion.div>
        )}
        
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full blur-lg opacity-60 animate-pulse" />
          <div className="relative w-20 h-24 md:w-24 md:h-28 overflow-hidden rounded-t-full rounded-b-3xl border-4 border-white/50 shadow-2xl bg-gradient-to-b from-slate-800 to-slate-900">
            <img src={image} alt="BitForce Buddy" className="w-full h-full object-cover object-top" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Scene1({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <ParticleField />
      
      <div className="text-center z-10 px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: progress > 10 ? 1 : 0, y: progress > 10 ? 0 : 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">AI Revolution</span> is Here
          </h2>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: progress > 30 ? 1 : 0, y: progress > 30 ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <p className="text-xl md:text-2xl text-white/80">
            The world is changing faster than ever before
          </p>
        </motion.div>
        
        <div className="grid grid-cols-3 gap-4 md:gap-8 mt-8">
          {[
            { icon: Brain, label: "AI Growth", value: "38%", subtext: "yearly" },
            { icon: Globe, label: "Digital Jobs", value: "85M", subtext: "new by 2030" },
            { icon: TrendingUp, label: "AI Market", value: "$1.8T", subtext: "by 2030" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: progress > 50 + i * 10 ? 1 : 0, scale: progress > 50 + i * 10 ? 1 : 0.5 }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            >
              <stat.icon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-white/60">{stat.subtext}</p>
              <p className="text-sm text-cyan-300 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Scene2({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <ParticleField />
      
      <div className="text-center z-10 px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: progress > 10 ? 1 : 0, scale: progress > 10 ? 1 : 0.8 }}
          transition={{ duration: 0.8 }}
        >
          <Rocket className="w-16 h-16 text-purple-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Get on the <span className="text-purple-400">Train to Success</span>
          </h2>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: progress > 30 ? 1 : 0 }}
          className="text-lg md:text-xl text-white/80 mb-8"
        >
          BitForce is your ticket to money, influence, and impact
        </motion.p>
        
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {[
            { icon: DollarSign, label: "Unlimited Earnings", color: "text-green-400" },
            { icon: Users, label: "Elite Network", color: "text-blue-400" },
            { icon: Zap, label: "Cutting-Edge AI", color: "text-yellow-400" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: progress > 40 + i * 15 ? 1 : 0, x: progress > 40 + i * 15 ? 0 : -30 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20"
            >
              <item.icon className={`w-6 h-6 ${item.color}`} />
              <span className="text-white font-medium">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Scene3({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <ParticleField />
      
      <div className="z-10 px-4 max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: progress > 10 ? 1 : 0, y: progress > 10 ? 0 : -20 }}
          className="text-center mb-8"
        >
          <Clock className="w-12 h-12 text-violet-400 mx-auto mb-4" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
            Freedom & Flexibility
          </h2>
          <p className="text-white/70">Be your own boss while having elite support</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: progress > 30 ? 1 : 0, x: progress > 30 ? 0 : -30 }}
          >
            <AnimatedPieChart progress={progress} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: progress > 40 ? 1 : 0, x: progress > 40 ? 0 : 30 }}
            className="space-y-4"
          >
            {[
              { icon: Clock, text: "Set your own hours" },
              { icon: Globe, text: "Work from anywhere" },
              { icon: Target, text: "Choose your clients" },
              { icon: Award, text: "Earn what you deserve" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: progress > 50 + i * 10 ? 1 : 0, x: progress > 50 + i * 10 ? 0 : 20 }}
                className="flex items-center gap-4 bg-white/5 rounded-lg p-3 border border-white/10"
              >
                <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-violet-400" />
                </div>
                <span className="text-white text-lg">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Scene4({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <ParticleField />
      
      <div className="z-10 px-4 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: progress > 10 ? 1 : 0, scale: progress > 10 ? 1 : 0.8 }}
        >
          <Users className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Join an <span className="text-cyan-400">Elite Team</span>
          </h2>
          <p className="text-white/70 text-lg mb-8">of AI Entrepreneurs</p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { value: "500+", label: "Ambassadors", icon: Users },
            { value: "24/7", label: "Support", icon: Clock },
            { value: "$2M+", label: "Paid Out", icon: DollarSign },
            { value: "98%", label: "Satisfaction", icon: Award },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: progress > 30 + i * 15 ? 1 : 0, y: progress > 30 + i * 15 ? 0 : 30 }}
              className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-4 border border-cyan-400/30"
            >
              <stat.icon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-cyan-300">{stat.label}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: progress > 80 ? 1 : 0 }}
          className="mt-8 text-white/80 text-lg"
        >
          You're never alone. We succeed together.
        </motion.p>
      </div>
    </div>
  );
}

function Scene5({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <ParticleField />
      
      <div className="z-10 px-4 max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: progress > 10 ? 1 : 0, y: progress > 10 ? 0 : -20 }}
          className="text-center mb-8"
        >
          <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
            Unlimited <span className="text-green-400">Earning Potential</span>
          </h2>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: progress > 20 ? 1 : 0, x: progress > 20 ? 0 : -30 }}
          >
            <AnimatedLineGraph progress={progress} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: progress > 30 ? 1 : 0, x: progress > 30 ? 0 : 30 }}
            className="bg-white/5 rounded-xl p-4 border border-white/10"
          >
            <h4 className="text-white/80 text-sm mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              Income Breakdown
            </h4>
            <div className="space-y-3">
              <AnimatedBar label="Direct Sales" value={40} maxValue={100} color="bg-blue-500" delay={500} />
              <AnimatedBar label="Referral Bonuses" value={30} maxValue={100} color="bg-purple-500" delay={700} />
              <AnimatedBar label="Team Overrides" value={20} maxValue={100} color="bg-green-500" delay={900} />
              <AnimatedBar label="Passive Income" value={10} maxValue={100} color="bg-cyan-500" delay={1100} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Scene6({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <ParticleField />
      
      <div className="z-10 px-4 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: progress > 10 ? 1 : 0, scale: progress > 10 ? 1 : 0.8 }}
        >
          <Brain className="w-16 h-16 text-teal-400 mx-auto mb-4" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Cutting-Edge <span className="text-teal-400">AI Tools</span>
          </h2>
          <p className="text-white/70 text-lg mb-8">At your fingertips</p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: Brain, label: "AI Assistant", desc: "24/7 sales support" },
            { icon: Target, label: "Lead Finder", desc: "Smart prospecting" },
            { icon: BarChart3, label: "Analytics", desc: "Track performance" },
            { icon: Users, label: "CRM", desc: "Manage contacts" },
            { icon: Zap, label: "Automation", desc: "Save time" },
            { icon: Globe, label: "Marketing", desc: "Reach more people" },
          ].map((tool, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: progress > 25 + i * 12 ? 1 : 0, scale: progress > 25 + i * 12 ? 1 : 0.8 }}
              className="bg-gradient-to-br from-teal-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-4 border border-teal-400/30"
            >
              <tool.icon className="w-8 h-8 text-teal-400 mx-auto mb-2" />
              <p className="text-white font-semibold">{tool.label}</p>
              <p className="text-xs text-teal-300">{tool.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Scene7({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <ParticleField />
      
      <div className="z-10 px-4 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: progress > 10 ? 1 : 0, y: progress > 10 ? 0 : -20 }}
        >
          <Globe className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Help Your <span className="text-cyan-400">Community</span>
          </h2>
          <p className="text-white/70 text-lg mb-8">and beyond</p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Users, title: "Empower Neighbors", desc: "Help people protect their homes and embrace technology" },
            { icon: Sparkles, title: "Bridge the Gap", desc: "Make AI accessible to everyone in your community" },
            { icon: Award, title: "Be a Leader", desc: "Become the go-to tech expert in your area" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: progress > 30 + i * 20 ? 1 : 0, y: progress > 30 + i * 20 ? 0 : 30 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <div className="w-14 h-14 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-white/60 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Scene8({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <ParticleField />
      
      <motion.div
        className="absolute w-[800px] h-[800px] bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      <div className="z-10 px-4 max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: progress > 10 ? 1 : 0, scale: progress > 10 ? 1 : 0.8 }}
        >
          <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Potential</span>
          </h2>
          <p className="text-xl text-white/80 mb-8">with AI</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: progress > 40 ? 1 : 0, y: progress > 40 ? 0 : 30 }}
          className="space-y-4"
        >
          <p className="text-lg text-white/70">
            The future belongs to those who embrace it today.
          </p>
          <p className="text-2xl font-bold text-white">
            Are you ready to join BitForce?
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: progress > 60 ? 1 : 0, scale: progress > 60 ? 1 : 0.8 }}
          className="mt-10"
        >
          <Link href="/">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-lg px-10 py-6 rounded-full shadow-2xl" data-testid="button-join-now">
              <Rocket className="w-5 h-5 mr-2" />
              Start Your Journey
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: progress > 80 ? 1 : 0 }}
          className="mt-6 text-white/50 text-sm"
        >
          Join 500+ ambassadors already building their future
        </motion.p>
      </div>
    </div>
  );
}

const BUDDY_TIMELINE = [
  { sceneId: 1, progressStart: 40, progressEnd: 100, image: "fullBody", position: "right" as const, message: "The future is now!" },
  { sceneId: 2, progressStart: 20, progressEnd: 100, image: "yellow", position: "left" as const, message: "Don't miss out!" },
  { sceneId: 3, progressStart: 30, progressEnd: 100, image: "closeUp", position: "right" as const, message: "Be your own boss!" },
  { sceneId: 4, progressStart: 20, progressEnd: 100, image: "blue", position: "left" as const, message: "Join the team!" },
  { sceneId: 5, progressStart: 30, progressEnd: 100, image: "yellow", position: "right" as const, message: "Earn big!" },
  { sceneId: 6, progressStart: 25, progressEnd: 100, image: "closeUp", position: "left" as const, message: "Amazing tools!" },
  { sceneId: 7, progressStart: 30, progressEnd: 100, image: "blue", position: "right" as const, message: "Make an impact!" },
  { sceneId: 8, progressStart: 20, progressEnd: 100, image: "fullBody", position: "left" as const, message: "Let's go!" },
];

const BUDDY_IMAGES: Record<string, string> = {
  fullBody: buddyFullBody,
  closeUp: buddyCloseUp,
  blue: buddyBlue,
  yellow: buddyYellow,
};

export default function JoinBitForce() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentScene, setCurrentScene] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= TOTAL_DURATION) {
            setIsPlaying(false);
            return TOTAL_DURATION;
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
    for (let i = 0; i < scenes.length; i++) {
      if (currentTime >= elapsed && currentTime < elapsed + scenes[i].duration) {
        setCurrentScene(i);
        break;
      }
      elapsed += scenes[i].duration;
    }
  }, [currentTime]);

  const getSceneProgress = () => {
    const sceneDuration = scenes[currentScene]?.duration || 1;
    let elapsed = 0;
    for (let i = 0; i < currentScene; i++) {
      elapsed += scenes[i].duration;
    }
    const sceneTime = currentTime - elapsed;
    return (sceneTime / sceneDuration) * 100;
  };

  const sceneProgress = getSceneProgress();
  const sceneId = currentScene + 1;

  const currentBuddyAction = BUDDY_TIMELINE.find(
    (action) =>
      action.sceneId === sceneId &&
      sceneProgress >= action.progressStart &&
      sceneProgress < action.progressEnd
  );

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const restart = () => {
    setCurrentTime(0);
    setCurrentScene(0);
    setIsPlaying(true);
  };

  const renderScene = () => {
    const props = { progress: sceneProgress };
    switch (currentScene) {
      case 0: return <Scene1 {...props} />;
      case 1: return <Scene2 {...props} />;
      case 2: return <Scene3 {...props} />;
      case 3: return <Scene4 {...props} />;
      case 4: return <Scene5 {...props} />;
      case 5: return <Scene6 {...props} />;
      case 6: return <Scene7 {...props} />;
      case 7: return <Scene8 {...props} />;
      default: return <Scene1 {...props} />;
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black" data-testid="page-joinbitforce">
      <div className={`absolute inset-0 bg-gradient-to-br ${scenes[currentScene].bgGradient} transition-all duration-1000`} />
      
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
        {currentBuddyAction && (
          <BuddyCharacter
            image={BUDDY_IMAGES[currentBuddyAction.image]}
            position={currentBuddyAction.position}
            message={currentBuddyAction.message}
            visible={true}
          />
        )}
      </AnimatePresence>
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            {scenes.map((scene, i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full transition-all ${
                  i < currentScene
                    ? "bg-white"
                    : i === currentScene
                    ? "bg-white/50"
                    : "bg-white/20"
                }`}
              />
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={togglePlay}
                data-testid="button-play-pause"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={restart}
                data-testid="button-restart"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="text-white/60 text-sm">
              {scenes[currentScene]?.title} • {Math.floor(currentTime)}s / {TOTAL_DURATION}s
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/20" data-testid="button-back-home">
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
