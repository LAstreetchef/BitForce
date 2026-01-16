import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  TrendingUp,
  Users,
  Coins,
  BarChart3,
  PieChart,
  Target,
  Shield,
  Globe,
  ArrowUpRight,
  Layers,
  Award,
} from "lucide-react";
import { Link } from "wouter";

import bftToken from "@assets/generated_images/bitforce_token_cryptocurrency_coin.png";
import backgroundMusic from "@assets/epic_1768585845884.mp3";
import voiceOverAudio from "@assets/BFTanalyst_script_1768585832910.mp3";

interface Scene {
  id: number;
  title: string;
  duration: number;
  bgGradient: string;
}

const scenes: Scene[] = [
  { id: 1, title: "Value Proposition", duration: 12, bgGradient: "from-slate-950 via-slate-900 to-slate-950" },
  { id: 2, title: "Mechanism Design", duration: 16, bgGradient: "from-slate-950 via-blue-950 to-slate-950" },
  { id: 3, title: "Tokenomics", duration: 17, bgGradient: "from-slate-950 via-emerald-950 to-slate-950" },
  { id: 4, title: "Strategic Positioning", duration: 13, bgGradient: "from-slate-950 via-amber-950 to-slate-950" },
];

const TOTAL_DURATION = scenes.reduce((sum, s) => sum + s.duration, 0);

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />
    </div>
  );
}

function AnimatedChart({ progress, type }: { progress: number; type: 'line' | 'bar' | 'pie' }) {
  if (type === 'line') {
    const points = [20, 35, 25, 45, 40, 60, 55, 75, 70, 85, 80, 95];
    const visiblePoints = Math.floor((progress / 100) * points.length);
    
    return (
      <div className="w-full h-32 relative">
        <svg viewBox="0 0 200 80" className="w-full h-full">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {points.slice(0, visiblePoints).map((_, i) => (
            <line
              key={`grid-${i}`}
              x1={i * 18}
              y1="0"
              x2={i * 18}
              y2="80"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.5"
            />
          ))}
          
          <path
            d={`M 0 ${80 - points[0]} ${points.slice(0, visiblePoints).map((p, i) => `L ${i * 18} ${80 - p}`).join(' ')} L ${(visiblePoints - 1) * 18} 80 L 0 80 Z`}
            fill="url(#areaGradient)"
          />
          
          <path
            d={`M 0 ${80 - points[0]} ${points.slice(0, visiblePoints).map((p, i) => `L ${i * 18} ${80 - p}`).join(' ')}`}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2"
          />
          
          {points.slice(0, visiblePoints).map((p, i) => (
            <circle
              key={i}
              cx={i * 18}
              cy={80 - p}
              r="3"
              fill="#10b981"
              className="animate-pulse"
            />
          ))}
        </svg>
      </div>
    );
  }
  
  if (type === 'bar') {
    const bars = [40, 65, 85, 55, 90, 70];
    const visibleBars = Math.floor((progress / 100) * bars.length);
    
    return (
      <div className="w-full h-32 flex items-end justify-around gap-2">
        {bars.map((height, i) => (
          <div
            key={i}
            className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t transition-all duration-500"
            style={{
              height: i < visibleBars ? `${height}%` : '0%',
              opacity: i < visibleBars ? 1 : 0.2,
            }}
          />
        ))}
      </div>
    );
  }
  
  if (type === 'pie') {
    const segments = [
      { value: 40, color: '#3b82f6', label: 'Ambassadors' },
      { value: 30, color: '#10b981', label: 'Liquidity' },
      { value: 20, color: '#f59e0b', label: 'Treasury' },
      { value: 10, color: '#8b5cf6', label: 'Team' },
    ];
    
    let cumulativePercent = 0;
    const visibleSegments = Math.floor((progress / 100) * 4) + 1;
    
    return (
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {segments.slice(0, visibleSegments).map((segment, i) => {
            const startPercent = cumulativePercent;
            cumulativePercent += segment.value;
            const dashArray = `${segment.value} ${100 - segment.value}`;
            const dashOffset = -startPercent;
            
            return (
              <circle
                key={i}
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke={segment.color}
                strokeWidth="20"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                className="transition-all duration-500"
                style={{ opacity: i < visibleSegments ? 1 : 0 }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-lg">1B</span>
        </div>
      </div>
    );
  }
  
  return null;
}

function MetricCard({ icon: Icon, value, label, delay, progress }: { 
  icon: any; 
  value: string; 
  label: string; 
  delay: number;
  progress: number;
}) {
  return (
    <div
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 transition-all duration-700"
      style={{
        opacity: progress > delay ? 1 : 0,
        transform: `translateY(${progress > delay ? 0 : 20}px)`,
      }}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-xs text-white/60">{label}</div>
        </div>
      </div>
    </div>
  );
}

function Scene1({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <GridBackground />
      
      <div className="z-10 w-full max-w-6xl px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div
              className="transition-all duration-1000"
              style={{
                opacity: progress > 5 ? 1 : 0,
                transform: `translateX(${progress > 5 ? 0 : -30}px)`,
              }}
            >
              <div className="text-blue-400 text-sm font-mono mb-2 tracking-wider">VALUE PROPOSITION & STRUCTURAL THESIS</div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                BitForce Token
                <span className="text-blue-400"> (BFT)</span>
              </h2>
            </div>

            <div
              className="transition-all duration-1000"
              style={{
                opacity: progress > 25 ? 1 : 0,
                transform: `translateX(${progress > 25 ? 0 : -30}px)`,
              }}
            >
              <p className="text-lg text-white/80 mb-4">
                A <span className="text-emerald-400 font-semibold">digital incentive mechanism</span> engineered to create a <span className="text-blue-400 font-semibold">high-velocity growth flywheel</span>.
              </p>
              <p className="text-base text-white/70 mb-6">
                Not a speculative asset in search of utility—a <span className="text-amber-400">purpose-built, programmable incentive layer</span> on the <span className="text-purple-400">Solana blockchain</span> designed to systematically align stakeholder actions with ecosystem value accrual.
              </p>
            </div>

            <div
              className="transition-all duration-1000"
              style={{
                opacity: progress > 50 ? 1 : 0,
              }}
            >
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 border border-blue-500/30 rounded-lg px-4 py-3">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">Core Thesis:</span>
                <span className="text-blue-300">Tokenization of Growth KPIs</span>
              </div>
            </div>
          </div>

          <div
            className="flex-shrink-0 transition-all duration-1000"
            style={{
              opacity: progress > 15 ? 1 : 0,
              transform: `scale(${progress > 15 ? 1 : 0.8})`,
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
              <img 
                src={bftToken} 
                alt="BFT Token" 
                className="w-48 h-48 md:w-64 md:h-64 object-contain relative z-10"
              />
            </div>
          </div>
        </div>

        <div
          className="mt-8 grid grid-cols-3 gap-4 transition-all duration-1000"
          style={{ opacity: progress > 70 ? 1 : 0 }}
        >
          <MetricCard icon={TrendingUp} value="High-Velocity" label="Growth Flywheel" delay={70} progress={progress} />
          <MetricCard icon={Layers} value="Solana" label="Blockchain Infrastructure" delay={75} progress={progress} />
          <MetricCard icon={BarChart3} value="KPI-Driven" label="Value Accrual" delay={80} progress={progress} />
        </div>
      </div>
    </div>
  );
}

function Scene2({ progress }: { progress: number }) {
  const growthVectors = [
    { icon: Users, title: "Network Expansion", desc: "Net-new ambassador acquisition bonuses", value: "500 BFT", trigger: "Per Ambassador", color: "from-blue-500 to-blue-600" },
    { icon: TrendingUp, title: "User Acquisition", desc: "Net-new customer onboarding rewards", value: "50 BFT", trigger: "Per Customer", color: "from-emerald-500 to-emerald-600" },
    { icon: Coins, title: "Platform Monetization", desc: "Processed revenue commission in BFT", value: "5%", trigger: "Per Sale", color: "from-amber-500 to-amber-600" },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <GridBackground />
      
      <div className="z-10 w-full max-w-6xl px-6">
        <div
          className="text-center mb-8 transition-all duration-700"
          style={{
            opacity: progress > 5 ? 1 : 0,
            transform: `translateY(${progress > 5 ? 0 : -20}px)`,
          }}
        >
          <div className="text-blue-400 text-sm font-mono mb-2 tracking-wider">MECHANISM DESIGN & ECONOMIC ENGINE</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Three Validated <span className="text-emerald-400">Trigger Conditions</span>
          </h2>
          <p className="text-white/60 mt-2 text-sm">Real-time reward distribution against validated growth vectors</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {growthVectors.map((vector, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 transition-all duration-700"
              style={{
                opacity: progress > 15 + i * 15 ? 1 : 0,
                transform: `translateY(${progress > 15 + i * 15 ? 0 : 30}px)`,
              }}
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${vector.color} mb-4`}>
                <vector.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{vector.title}</h3>
              <p className="text-white/60 text-sm mb-2">{vector.desc}</p>
              <div className="text-xs text-blue-400 font-mono mb-3">TRIGGER: {vector.trigger}</div>
              <div className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                {vector.value}
              </div>
            </div>
          ))}
        </div>

        <div
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 transition-all duration-700"
          style={{
            opacity: progress > 65 ? 1 : 0,
            transform: `translateY(${progress > 65 ? 0 : 20}px)`,
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span className="text-white font-semibold">Growth Trajectory Model</span>
          </div>
          <AnimatedChart progress={Math.max(0, (progress - 65) * 3)} type="line" />
        </div>

        <div
          className="mt-6 text-center transition-all duration-700"
          style={{ opacity: progress > 85 ? 1 : 0 }}
        >
          <p className="text-lg text-white/80">
            Creates <span className="text-emerald-400 font-semibold">immediate, tangible equity-like exposure</span> for the salesforce to top-line growth
          </p>
        </div>
      </div>
    </div>
  );
}

function Scene3({ progress }: { progress: number }) {
  const milestones = [
    { threshold: "10 Ambassadors", multiplier: "1.1x", achieved: progress > 40, desc: "Network milestone" },
    { threshold: "100 Customers", multiplier: "1.25x", achieved: progress > 55, desc: "User acquisition" },
    { threshold: "$100K Volume", multiplier: "1.5x", achieved: progress > 70, desc: "Sales threshold" },
    { threshold: "500 Ambassadors", multiplier: "2.0x", achieved: progress > 85, desc: "Scale milestone" },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <GridBackground />
      
      <div className="z-10 w-full max-w-6xl px-6">
        <div
          className="text-center mb-8 transition-all duration-700"
          style={{
            opacity: progress > 5 ? 1 : 0,
            transform: `translateY(${progress > 5 ? 0 : -20}px)`,
          }}
        >
          <div className="text-emerald-400 text-sm font-mono mb-2 tracking-wider">TOKENOMICS & VALUE ACCRUAL MODEL</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Reflexive <span className="text-amber-400">Value Support</span>
          </h2>
          <p className="text-white/60 mt-2 text-sm">Engineered for structural price support with progressive valuation algorithm</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 transition-all duration-700"
            style={{
              opacity: progress > 15 ? 1 : 0,
              transform: `translateX(${progress > 15 ? 0 : -30}px)`,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <PieChart className="w-5 h-5 text-blue-400" />
              <span className="text-white font-semibold">Token Distribution</span>
            </div>
            <div className="flex items-center justify-center">
              <AnimatedChart progress={Math.max(0, (progress - 15) * 2)} type="pie" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-white/70">Ambassadors 40%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-white/70">Liquidity 30%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-white/70">Treasury 20%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-white/70">Team 10%</span>
              </div>
            </div>
          </div>

          <div
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 transition-all duration-700"
            style={{
              opacity: progress > 25 ? 1 : 0,
              transform: `translateX(${progress > 25 ? 0 : 30}px)`,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-white font-semibold">Milestone Multipliers</span>
            </div>
            <p className="text-white/60 text-sm mb-2">
              Permanent, non-reversing multipliers tied to network milestones
            </p>
            <p className="text-xs text-amber-400 font-mono mb-4">
              PRICE FLOOR AUGMENTED BY GROWTH PREMIUM
            </p>
            <div className="space-y-3">
              {milestones.map((m, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-500 ${
                    m.achieved ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <span className="text-white/80">{m.threshold}</span>
                  <span className={`font-bold ${m.achieved ? 'text-emerald-400' : 'text-white/50'}`}>
                    {m.multiplier}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-6 flex items-center justify-center gap-4 transition-all duration-700"
          style={{ opacity: progress > 50 ? 1 : 0 }}
        >
          <div className="bg-slate-800/50 border border-white/10 rounded-lg px-6 py-4 text-center">
            <div className="text-3xl font-bold text-white">1B</div>
            <div className="text-sm text-white/60">Fixed Supply</div>
          </div>
          <ArrowUpRight className="w-6 h-6 text-emerald-400" />
          <div className="bg-slate-800/50 border border-white/10 rounded-lg px-6 py-4 text-center">
            <div className="text-3xl font-bold text-emerald-400">Scarcity</div>
            <div className="text-sm text-white/60">Drives Value</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Scene4({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <GridBackground />
      
      <div className="z-10 w-full max-w-5xl px-6 text-center">
        <div
          className="transition-all duration-1000"
          style={{
            opacity: progress > 5 ? 1 : 0,
            transform: `translateY(${progress > 5 ? 0 : 30}px)`,
          }}
        >
          <div className="text-amber-400 text-sm font-mono mb-2 tracking-wider">STRATEGIC POSITIONING & CALL TO ACTION</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pre-ICO Testnet <span className="text-amber-400">Phase</span>
          </h2>
        </div>

        <div
          className="grid md:grid-cols-3 gap-6 mb-8 transition-all duration-1000"
          style={{
            opacity: progress > 20 ? 1 : 0,
            transform: `translateY(${progress > 20 ? 0 : 20}px)`,
          }}
        >
          <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-xl p-6">
            <Award className="w-10 h-10 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Foundational Status</h3>
            <p className="text-white/60 text-sm">First 100 participants receive exclusive founding member position in the incentive stack</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl p-6">
            <Coins className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Preferential Pricing</h3>
            <p className="text-white/60 text-sm">Early-stage position in a scaling platform at foundational terms</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
            <Shield className="w-10 h-10 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Governance Rights</h3>
            <p className="text-white/60 text-sm">Exclusive NFT with voting privileges—limited issuance</p>
          </div>
        </div>

        <div
          className="transition-all duration-1000"
          style={{
            opacity: progress > 45 ? 1 : 0,
            transform: `scale(${progress > 45 ? 1 : 0.95})`,
          }}
        >
          <p className="text-xl text-white/80 mb-6">
            The analysis is clear. The mechanics are transparent.
            <br />
            <span className="text-amber-400 font-semibold">The window for foundational terms is now.</span>
          </p>
          <p className="text-base text-white/60 mb-6">
            This isn't merely an investment—it's an early-stage position in the incentive stack of a scaling platform.
          </p>
        </div>

        <div
          className="transition-all duration-700"
          style={{ opacity: progress > 65 ? 1 : 0 }}
        >
          <p className="text-lg text-white/70 mb-4">Full architectural model and live metrics available for your due diligence:</p>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-3">
            <Globe className="w-5 h-5 text-blue-400" />
            <a 
              href="https://BitForceToken.replit.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:text-blue-200 transition-colors text-lg font-semibold"
            >
              BitForceToken.replit.app
            </a>
          </div>
        </div>

        <div
          className="mt-8 transition-all duration-700"
          style={{ opacity: progress > 85 ? 1 : 0 }}
        >
          <p className="text-2xl md:text-3xl font-bold text-white">
            Let's discuss the position.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function WallStreetVideo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const voiceOverRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<number | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);

  const progress = (currentTime / TOTAL_DURATION) * 100;

  const getCurrentScene = () => {
    let accumulated = 0;
    for (const scene of scenes) {
      accumulated += scene.duration;
      if (currentTime < accumulated) {
        return scene;
      }
    }
    return scenes[scenes.length - 1];
  };

  const getSceneProgress = () => {
    let accumulated = 0;
    for (const scene of scenes) {
      if (currentTime < accumulated + scene.duration) {
        return ((currentTime - accumulated) / scene.duration) * 100;
      }
      accumulated += scene.duration;
    }
    return 100;
  };

  const currentScene = getCurrentScene();
  const sceneProgress = getSceneProgress();

  const stopTimer = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startTimer = () => {
    stopTimer();
    intervalRef.current = window.setInterval(() => {
      if (!isPlayingRef.current) {
        return;
      }
      setCurrentTime((prev) => {
        if (prev >= TOTAL_DURATION) {
          isPlayingRef.current = false;
          setIsPlaying(false);
          stopTimer();
          return TOTAL_DURATION;
        }
        return prev + 0.1;
      });
    }, 100);
  };

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    if (isPlaying) {
      startTimer();
    } else {
      stopTimer();
    }

    return () => {
      stopTimer();
    };
  }, [isPlaying]);

  const clearFadeTimers = () => {
    if (fadeTimeoutRef.current !== null) {
      window.clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
    if (fadeIntervalRef.current !== null) {
      window.clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  const fadeBackgroundMusic = (targetVolume: number, duration: number, onComplete?: () => void) => {
    if (!audioRef.current) return;
    clearFadeTimers();
    
    const startVolume = audioRef.current.volume;
    const volumeDiff = targetVolume - startVolume;
    const steps = 20;
    const stepDuration = duration / steps;
    let currentStep = 0;

    fadeIntervalRef.current = window.setInterval(() => {
      currentStep++;
      if (audioRef.current) {
        const newVolume = startVolume + (volumeDiff * (currentStep / steps));
        audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
      }
      
      if (currentStep >= steps) {
        clearFadeTimers();
        if (onComplete) onComplete();
      }
    }, stepDuration);
  };

  const playAudio = async () => {
    if (audioRef.current && voiceOverRef.current) {
      try {
        audioRef.current.volume = 0;
        voiceOverRef.current.volume = 1.0;
        
        audioRef.current.currentTime = currentTime;
        voiceOverRef.current.currentTime = currentTime;
        
        await Promise.all([
          audioRef.current.play(),
          voiceOverRef.current.play()
        ]);
        
        fadeBackgroundMusic(0.05, 1500);
      } catch (err) {
        console.log("Audio playback failed:", err);
      }
    }
  };

  const pauseAudio = () => {
    clearFadeTimers();
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (voiceOverRef.current) {
      voiceOverRef.current.pause();
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio();
      setIsPlaying(false);
    } else {
      if (currentTime >= TOTAL_DURATION) {
        setCurrentTime(0);
        if (audioRef.current) audioRef.current.currentTime = 0;
        if (voiceOverRef.current) voiceOverRef.current.currentTime = 0;
      }
      playAudio();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (audioRef.current && voiceOverRef.current) {
      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      voiceOverRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const restart = () => {
    pauseAudio();
    setCurrentTime(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0;
    }
    if (voiceOverRef.current) {
      voiceOverRef.current.currentTime = 0;
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * TOTAL_DURATION;
    
    setCurrentTime(newTime);
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    if (voiceOverRef.current) {
      voiceOverRef.current.currentTime = newTime;
    }
  };

  useEffect(() => {
    return () => {
      stopTimer();
      clearFadeTimers();
      pauseAudio();
    };
  }, []);

  const renderScene = () => {
    switch (currentScene.id) {
      case 1:
        return <Scene1 progress={sceneProgress} />;
      case 2:
        return <Scene2 progress={sceneProgress} />;
      case 3:
        return <Scene3 progress={sceneProgress} />;
      case 4:
        return <Scene4 progress={sceneProgress} />;
      default:
        return <Scene1 progress={sceneProgress} />;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <audio ref={audioRef} src={backgroundMusic} loop />
      <audio ref={voiceOverRef} src={voiceOverAudio} />

      <div className="flex-1 relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${currentScene.bgGradient} transition-all duration-1000`}
        />

        {renderScene()}

        {!isPlaying && currentTime === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 z-20">
            <div className="text-center">
              <div className="mb-8">
                <div className="text-blue-400 text-sm font-mono mb-4 tracking-widest">INVESTOR BRIEFING</div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                  BitForce Token
                  <span className="text-blue-400"> Analysis</span>
                </h1>
                <p className="text-xl text-white/70">Strategic Investment Opportunity</p>
              </div>
              <Button
                onClick={togglePlay}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 text-xl rounded-lg"
                data-testid="button-play-video"
              >
                <Play className="w-8 h-8 mr-2" />
                Begin Briefing
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-900/90 backdrop-blur-sm border-t border-white/10 p-4">
        <div className="max-w-4xl mx-auto">
          <div 
            className="h-2 bg-white/20 rounded-full mb-4 cursor-pointer"
            onClick={handleProgressClick}
            data-testid="progress-bar"
          >
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                onClick={togglePlay}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                data-testid="button-toggle-play"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>

              <Button
                onClick={restart}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                data-testid="button-restart"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>

              <Button
                onClick={toggleMute}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                data-testid="button-toggle-mute"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>

              <span className="text-white/70 text-sm ml-2 font-mono">
                {formatTime(currentTime)} / {formatTime(TOTAL_DURATION)}
              </span>
            </div>

            <div className="text-white/50 text-sm font-mono">
              {currentScene.id}/{scenes.length}: {currentScene.title}
            </div>

            <Link href="/">
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10" data-testid="button-back-home">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
