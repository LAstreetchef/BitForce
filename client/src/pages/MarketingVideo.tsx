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
  Zap,
  Globe,
  Sparkles,
  Coins,
  BookOpen,
  Camera,
  Search,
  Heart,
  Lock,
  Headphones,
  Gift,
  TrendingUp,
  Award,
  ChevronRight,
} from "lucide-react";
import { Link } from "wouter";

import bitforceLogo from "@assets/Bitforce_1767872339442.jpg";
import bftToken from "@assets/generated_images/bitforce_token_cryptocurrency_coin.png";
import digitalCoupons from "@assets/generated_images/ai_coupon_book_savings_illustration.png";
import securityShield from "@assets/generated_images/digital_security_shield_scanner_illustration.png";
import techBuddy from "@assets/generated_images/friendly_tech_buddy_subscription_portrait.png";
import monthlySubscription from "@assets/generated_images/monthly_subscription_community.png";
import oneOnOneSession from "@assets/generated_images/one-on-one_tech_help_session.png";
import bundlePackage from "@assets/generated_images/tech_companion_bundle_package_portrait.png";
import backgroundMusic from "@assets/epic_1768573393286.mp3";
import voiceOverAudio from "@assets/markaudio1onboardamb_1768574445613.mp3";

interface Scene {
  id: number;
  title: string;
  duration: number;
  bgGradient: string;
}

const scenes: Scene[] = [
  { id: 1, title: "The Future is Here", duration: 8, bgGradient: "from-slate-900 via-slate-800 to-slate-900" },
  { id: 2, title: "Introducing BitForce", duration: 7, bgGradient: "from-blue-900 via-indigo-900 to-purple-900" },
  { id: 3, title: "Platform Tools", duration: 14, bgGradient: "from-indigo-900 via-blue-800 to-cyan-900" },
  { id: 4, title: "Learn & Earn", duration: 10, bgGradient: "from-cyan-900 via-teal-800 to-emerald-900" },
  { id: 5, title: "BFT Token", duration: 12, bgGradient: "from-amber-900 via-yellow-800 to-orange-900" },
  { id: 6, title: "Call to Action", duration: 8, bgGradient: "from-purple-900 via-violet-800 to-blue-900" },
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
      <FloatingIcon icon={Brain} delay={0} x={10} y={20} />
      <FloatingIcon icon={Zap} delay={0.5} x={80} y={30} />
      <FloatingIcon icon={Rocket} delay={1} x={15} y={70} />
      <FloatingIcon icon={Globe} delay={1.5} x={85} y={75} />
      
      <div className="text-center z-10 px-4 max-w-4xl">
        <div 
          className="transition-all duration-1000"
          style={{ 
            opacity: progress > 5 ? 1 : 0,
            transform: `translateY(${progress > 5 ? 0 : 30}px)` 
          }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            AI is changing the future of{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">work</span> and{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">life</span>
          </h2>
        </div>
        
        <div 
          className="transition-all duration-1000 delay-500"
          style={{ 
            opacity: progress > 30 ? 1 : 0,
            transform: `translateY(${progress > 30 ? 0 : 30}px)` 
          }}
        >
          <p className="text-xl md:text-3xl text-white/90 mb-8">
            Are you prepared?
          </p>
        </div>
        
        <div 
          className="transition-all duration-1000"
          style={{ 
            opacity: progress > 55 ? 1 : 0,
            transform: `translateY(${progress > 55 ? 0 : 30}px)` 
          }}
        >
          <p className="text-lg md:text-2xl text-white/80 mb-8">
            Will you be on the{" "}
            <span className="text-green-400 font-semibold">winning</span> or{" "}
            <span className="text-red-400 font-semibold">losing</span> side of this generational change?
          </p>
        </div>
        
        <div className="flex justify-center gap-8 mt-12">
          {[
            { icon: TrendingUp, label: "Winners Rise", color: "text-green-400" },
            { icon: Brain, label: "AI Revolution", color: "text-blue-400" },
            { icon: Rocket, label: "Future Now", color: "text-purple-400" },
          ].map((item, i) => (
            <div
              key={i}
              className="transition-all duration-700"
              style={{
                opacity: progress > 70 + i * 8 ? 1 : 0,
                transform: `scale(${progress > 70 + i * 8 ? 1 : 0.5})`,
              }}
            >
              <div className={`${item.color} flex flex-col items-center gap-2`}>
                <item.icon className="w-10 h-10 md:w-14 md:h-14" />
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
            opacity: progress > 15 ? 1 : 0,
            transform: `scale(${progress > 15 ? 1 : 0.5})`,
          }}
        >
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src={bitforceLogo} 
                alt="BitForce" 
                className="w-32 h-32 md:w-48 md:h-48 object-contain rounded-2xl"
              />
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
          Introducing <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">BitForce</span>
        </h2>
        
        <p
          className="text-xl md:text-2xl text-white/80 transition-all duration-700 mb-4"
          style={{
            opacity: progress > 55 ? 1 : 0,
            transform: `translateY(${progress > 55 ? 0 : 20}px)`,
          }}
        >
          The Future of Work in an AI World
        </p>
        
        <div
          className="mt-8 text-lg text-blue-300 transition-all duration-500"
          style={{ opacity: progress > 75 ? 1 : 0 }}
        >
          <p>Join our unique team of professionals</p>
          <p className="mt-2">Learn and profit from AI</p>
        </div>
      </div>
    </div>
  );
}

const platformTools = [
  { icon: Gift, title: "Customized Digital Coupons", image: digitalCoupons, color: "from-green-500 to-emerald-600" },
  { icon: Camera, title: "Photo and Video Digital Saver", image: null, color: "from-pink-500 to-rose-600" },
  { icon: Search, title: "Friend & Family Finder", image: null, color: "from-blue-500 to-cyan-600" },
  { icon: Heart, title: "'AfterGlow' TM Digital Legacy", image: null, color: "from-purple-500 to-violet-600" },
  { icon: Brain, title: "Real-time AI Solutions", image: null, color: "from-amber-500 to-orange-600" },
  { icon: Lock, title: "Personalized Cyber Security", image: securityShield, color: "from-red-500 to-rose-600" },
  { icon: Headphones, title: "AI Tech Support", image: techBuddy, color: "from-teal-500 to-cyan-600" },
  { icon: Sparkles, title: "BitForce Buddy Subscriptions", image: monthlySubscription, color: "from-indigo-500 to-purple-600" },
];

function Scene3({ progress }: { progress: number }) {
  const visibleTools = Math.floor((progress / 100) * platformTools.length) + 1;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <ParticleField />
      
      <div className="z-10 w-full max-w-6xl px-4">
        <div
          className="text-center mb-8 transition-all duration-500"
          style={{
            opacity: progress > 2 ? 1 : 0,
            transform: `translateY(${progress > 2 ? 0 : -20}px)`,
          }}
        >
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
            BitForce Platform Offers
          </h2>
          <p className="text-white/70 text-sm md:text-lg">
            Cutting edge information, training & state-of-the-art tools
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {platformTools.map((tool, i) => (
            <div
              key={i}
              className="transition-all duration-500"
              style={{
                opacity: i < visibleTools ? 1 : 0.2,
                transform: `scale(${i < visibleTools ? 1 : 0.9})`,
              }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 text-center border border-white/20 h-full">
                <div className={`inline-flex p-2 md:p-3 rounded-lg bg-gradient-to-br ${tool.color} mb-2`}>
                  <tool.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-xs md:text-sm font-medium text-white leading-tight">{tool.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-6 text-center text-white/60 text-sm transition-all duration-500"
          style={{ opacity: progress > 85 ? 1 : 0 }}
        >
          Tools for ambassadors to help customers save, learn, and earn with AI
        </div>
      </div>
    </div>
  );
}

function Scene4({ progress }: { progress: number }) {
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
      
      <div className="text-center z-10 px-4 max-w-4xl">
        <div
          className="transition-all duration-1000"
          style={{
            opacity: progress > 10 ? 1 : 0,
            transform: `translateY(${progress > 10 ? 0 : 40}px)`,
          }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Learn & Earn
            </span>
          </h2>
        </div>

        <div
          className="transition-all duration-1000"
          style={{
            opacity: progress > 30 ? 1 : 0,
            transform: `translateY(${progress > 30 ? 0 : 30}px)`,
          }}
        >
          <p className="text-xl md:text-2xl text-white mb-6">
            Empower your network and community with valuable savings, products, and knowledge
          </p>
        </div>

        <div
          className="transition-all duration-1000"
          style={{
            opacity: progress > 55 ? 1 : 0,
            transform: `translateY(${progress > 55 ? 0 : 30}px)`,
          }}
        >
          <p className="text-lg md:text-xl text-white/80">
            The BitForce network is powered by our outstanding people and powerful AI tools and products
          </p>
        </div>

        <div
          className="flex justify-center gap-8 mt-12 transition-all duration-700"
          style={{ opacity: progress > 75 ? 1 : 0 }}
        >
          <div className="flex flex-col items-center gap-2">
            <Users className="w-10 h-10 text-emerald-400" />
            <span className="text-white/70 text-sm">People</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Brain className="w-10 h-10 text-teal-400" />
            <span className="text-white/70 text-sm">AI Tools</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Globe className="w-10 h-10 text-cyan-400" />
            <span className="text-white/70 text-sm">Network</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Scene5({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <ParticleField />
      
      <div
        className="absolute w-[600px] h-[600px] bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse"
        style={{ opacity: 0.4 }}
      />
      
      <div className="z-10 w-full max-w-5xl px-4 flex flex-col md:flex-row items-center gap-8">
        <div
          className="flex-shrink-0 transition-all duration-1000"
          style={{
            opacity: progress > 10 ? 1 : 0,
            transform: `scale(${progress > 10 ? 1 : 0.5}) rotate(${progress > 10 ? 0 : -10}deg)`,
          }}
        >
          <img 
            src={bftToken} 
            alt="BFT Token" 
            className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl"
          />
        </div>

        <div className="text-center md:text-left">
          <div
            className="transition-all duration-700"
            style={{
              opacity: progress > 20 ? 1 : 0,
              transform: `translateX(${progress > 20 ? 0 : 30}px)`,
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">BFT Token</span>
            </h2>
            <p className="text-white/80 text-lg mb-4">
              Our proprietary cryptocurrency, powered by the equity and growth of BitForce
            </p>
            <p className="text-white/70 text-base mb-2">
              Besides earning cash, ambassadors also earn BFT:
            </p>
          </div>

          <div
            className="space-y-3 transition-all duration-700"
            style={{
              opacity: progress > 40 ? 1 : 0,
              transform: `translateX(${progress > 40 ? 0 : 30}px)`,
            }}
          >
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span className="text-white/90">By completing training programs</span>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-white/90">By selling products</span>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Users className="w-5 h-5 text-orange-400" />
              <span className="text-white/90">By recruiting ambassadors</span>
            </div>
          </div>

          <div
            className="mt-6 transition-all duration-700"
            style={{
              opacity: progress > 70 ? 1 : 0,
            }}
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-lg px-4 py-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span className="text-amber-300 text-sm">BFT offers ambassadors ownership in BitForce and additional money making opportunities</span>
            </div>
          </div>

          <div
            className="mt-4 transition-all duration-700"
            style={{
              opacity: progress > 85 ? 1 : 0,
            }}
          >
            <p className="text-lg font-semibold text-white">
              The tools are powerful. The products are real.{" "}
              <span className="text-green-400">The earnings are huge.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Scene6({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-blue-900/50"
        style={{
          opacity: 0.8,
        }}
      />
      
      <ParticleField />
      
      <div className="text-center z-10 px-4 max-w-3xl">
        <div
          className="transition-all duration-1000"
          style={{
            opacity: progress > 10 ? 1 : 0,
            transform: `scale(${progress > 10 ? 1 : 0.8})`,
          }}
        >
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
            Know others who would excel as a BitForce Ambassador?
          </h2>
        </div>

        <div
          className="transition-all duration-1000"
          style={{
            opacity: progress > 30 ? 1 : 0,
            transform: `translateY(${progress > 30 ? 0 : 20}px)`,
          }}
        >
          <p className="text-xl text-white/80 mb-4">
            Sign them up to earn additional cash and BFT
          </p>
        </div>

        <div
          className="transition-all duration-1000"
          style={{
            opacity: progress > 50 ? 1 : 0,
            transform: `scale(${progress > 50 ? 1 : 0.9})`,
          }}
        >
          <p className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
            Start your future today!
          </p>
        </div>

        <div
          className="transition-all duration-700"
          style={{
            opacity: progress > 70 ? 1 : 0,
          }}
        >
          <p className="text-2xl text-white font-semibold mb-4">
            Join the BitForce
          </p>
          <p className="text-lg text-white/70 mb-3">
            learn more at:
          </p>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-3">
            <Globe className="w-5 h-5 text-blue-400" />
            <a 
              href="https://BitForce.Biz/how-it-works"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:text-blue-200 transition-colors"
            >
              BitForce.Biz/how-it-works
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarketingVideo() {
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
        audioRef.current.volume = Math.max(0, Math.min(1, startVolume + (volumeDiff * (currentStep / steps))));
      }
      if (currentStep >= steps) {
        clearFadeTimers();
        if (audioRef.current) {
          audioRef.current.volume = targetVolume;
        }
        if (onComplete) {
          onComplete();
        }
      }
    }, stepDuration);
  };

  useEffect(() => {
    clearFadeTimers();
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.volume = 0;
        audioRef.current.play().catch(() => {});
        fadeBackgroundMusic(0.05, 1000);
      } else {
        fadeBackgroundMusic(0, 500, () => {
          if (audioRef.current) {
            audioRef.current.pause();
          }
        });
      }
    }
    if (voiceOverRef.current) {
      voiceOverRef.current.volume = 1.0;
      if (isPlaying) {
        voiceOverRef.current.play().catch(() => {});
      } else {
        voiceOverRef.current.pause();
      }
    }
    
    return () => {
      clearFadeTimers();
    };
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
    if (voiceOverRef.current) {
      voiceOverRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handlePlayPause = () => {
    if (currentTime >= TOTAL_DURATION) {
      setCurrentTime(0);
    }
    const newPlayingState = !isPlaying;
    isPlayingRef.current = newPlayingState;
    if (newPlayingState) {
      startTimer();
    } else {
      stopTimer();
    }
    setIsPlaying(newPlayingState);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    isPlayingRef.current = true;
    startTimer();
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    if (voiceOverRef.current) {
      voiceOverRef.current.currentTime = 0;
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * TOTAL_DURATION;
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    if (voiceOverRef.current) {
      voiceOverRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

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
      case 5:
        return <Scene5 progress={sceneProgress} />;
      case 6:
        return <Scene6 progress={sceneProgress} />;
      default:
        return <Scene1 progress={sceneProgress} />;
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <audio
        ref={audioRef}
        src={backgroundMusic}
        loop
      />
      <audio
        ref={voiceOverRef}
        src={voiceOverAudio}
      />

      <div className="flex-1 relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${currentScene.bgGradient} transition-all duration-1000`}
        />

        {renderScene()}

        {!isPlaying && currentTime === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
            <Button
              size="lg"
              onClick={handlePlayPause}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 md:px-12 py-6 md:py-8 rounded-full text-lg md:text-xl gap-2 md:gap-3"
              data-testid="button-play-video"
            >
              <Play className="w-6 h-6 md:w-8 md:h-8" />
              Play Video
            </Button>
          </div>
        )}
      </div>

      <div className="bg-black/80 backdrop-blur-sm border-t border-white/10 px-3 md:px-4 py-3 md:py-4 z-50">
        <div className="max-w-4xl mx-auto">
          <div
            className="h-3 md:h-2 bg-white/20 rounded-full mb-3 md:mb-4 cursor-pointer overflow-hidden touch-manipulation"
            onClick={handleProgressClick}
            data-testid="progress-bar"
          >
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 md:gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={handlePlayPause}
                className="text-white hover:bg-white/10 h-9 w-9 md:h-10 md:w-10"
                data-testid="button-play-pause"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              
              <Button
                size="icon"
                variant="ghost"
                onClick={handleRestart}
                className="text-white hover:bg-white/10 h-9 w-9 md:h-10 md:w-10"
                data-testid="button-restart"
              >
                <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
              
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:bg-white/10 h-9 w-9 md:h-10 md:w-10"
                data-testid="button-mute"
              >
                {isMuted ? <VolumeX className="w-4 h-4 md:w-5 md:h-5" /> : <Volume2 className="w-4 h-4 md:w-5 md:h-5" />}
              </Button>
              
              <span className="text-white/60 text-xs md:text-sm ml-1 md:ml-2" data-testid="text-time">
                {formatTime(currentTime)} / {formatTime(TOTAL_DURATION)}
              </span>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <span className="text-white/60 text-sm hidden md:block" data-testid="text-scene">
                {currentScene.title}
              </span>
              
              <Link href="/">
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 text-xs md:text-sm px-2 md:px-3" data-testid="link-home">
                  <span className="hidden md:inline">Back to Home</span>
                  <span className="md:hidden">Home</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
