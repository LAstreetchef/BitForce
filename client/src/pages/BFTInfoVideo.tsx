import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Users,
  Sparkles,
  Coins,
  TrendingUp,
  Award,
  Gift,
  Target,
  Globe,
  TreePine,
} from "lucide-react";
import { Link } from "wouter";

import bftToken from "@assets/generated_images/bitforce_token_cryptocurrency_coin.png";
import backgroundMusic from "@assets/epic_1768584507776.mp3";
import voiceOverAudio from "@assets/BFT3_1768584462365.mp3";

interface Scene {
  id: number;
  title: string;
  duration: number;
  bgGradient: string;
}

const scenes: Scene[] = [
  { id: 1, title: "The Hook", duration: 10, bgGradient: "from-slate-900 via-blue-900 to-slate-900" },
  { id: 2, title: "Core Concept", duration: 20, bgGradient: "from-emerald-900 via-green-800 to-teal-900" },
  { id: 3, title: "Earning BFT", duration: 15, bgGradient: "from-amber-900 via-yellow-800 to-orange-900" },
  { id: 4, title: "The Bigger Picture", duration: 10, bgGradient: "from-purple-900 via-indigo-800 to-blue-900" },
  { id: 5, title: "Call to Action", duration: 5, bgGradient: "from-blue-900 via-purple-800 to-pink-900" },
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
      <FloatingIcon icon={Coins} delay={0} x={10} y={20} />
      <FloatingIcon icon={TrendingUp} delay={0.5} x={80} y={30} />
      <FloatingIcon icon={Sparkles} delay={1} x={15} y={70} />
      <FloatingIcon icon={Award} delay={1.5} x={85} y={75} />
      
      <div className="text-center z-10 px-4 max-w-4xl">
        <div 
          className="transition-all duration-1000"
          style={{ 
            opacity: progress > 5 ? 1 : 0,
            transform: `translateY(${progress > 5 ? 0 : 30}px)` 
          }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Want to earn more as a{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">BitForce Ambassador</span>?
          </h2>
        </div>
        
        <div 
          className="transition-all duration-1000 delay-500"
          style={{ 
            opacity: progress > 30 ? 1 : 0,
            transform: `translateY(${progress > 30 ? 0 : 30}px)` 
          }}
        >
          <p className="text-xl md:text-2xl text-white/90 mb-6">
            You're already helping your community access services and earning commissions.
          </p>
        </div>
        
        <div 
          className="transition-all duration-1000"
          style={{ 
            opacity: progress > 55 ? 1 : 0,
            transform: `translateY(${progress > 55 ? 0 : 30}px)` 
          }}
        >
          <p className="text-lg md:text-2xl text-white/80 mb-4">
            But what if your success could also build something{" "}
            <span className="text-amber-400 font-semibold">bigger</span> that grows in value for everyone?
          </p>
        </div>

        <div 
          className="transition-all duration-1000"
          style={{ 
            opacity: progress > 75 ? 1 : 0,
            transform: `scale(${progress > 75 ? 1 : 0.8})` 
          }}
        >
          <p className="text-2xl md:text-3xl font-bold text-white">
            That's where the{" "}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">BitForce Token (BFT)</span>{" "}
            comes in.
          </p>
        </div>
      </div>
    </div>
  );
}

function Scene2({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <ParticleField />
      
      <div
        className="absolute w-[500px] h-[500px] bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl"
        style={{
          transform: `scale(${1 + progress / 100})`,
          opacity: 0.5,
        }}
      />
      
      <div className="z-10 w-full max-w-5xl px-4 flex flex-col md:flex-row items-center gap-8">
        <div
          className="flex-shrink-0 transition-all duration-1000"
          style={{
            opacity: progress > 5 ? 1 : 0,
            transform: `scale(${progress > 5 ? 1 : 0.5})`,
          }}
        >
          <div className="relative">
            <TreePine className="w-32 h-32 md:w-48 md:h-48 text-emerald-400" style={{
              transform: `scale(${0.5 + (progress / 100) * 0.5})`,
            }} />
            <div className="absolute -top-2 -right-2 flex flex-wrap gap-1 max-w-16">
              {Array.from({ length: Math.min(Math.floor(progress / 15), 6) }).map((_, i) => (
                <Users key={i} className="w-4 h-4 text-blue-400" />
              ))}
            </div>
          </div>
        </div>

        <div className="text-center md:text-left flex-1">
          <div
            className="transition-all duration-700"
            style={{
              opacity: progress > 10 ? 1 : 0,
              transform: `translateX(${progress > 10 ? 0 : 30}px)`,
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Think of BFT as a{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">"Growth Token"</span>
            </h2>
          </div>

          <div
            className="transition-all duration-700"
            style={{
              opacity: progress > 25 ? 1 : 0,
              transform: `translateX(${progress > 25 ? 0 : 30}px)`,
            }}
          >
            <p className="text-white/80 text-lg mb-4">
              It's powered by the <span className="text-purple-400 font-semibold">Solana blockchain</span>.
            </p>
          </div>

          <div
            className="transition-all duration-700 space-y-3"
            style={{
              opacity: progress > 40 ? 1 : 0,
              transform: `translateX(${progress > 40 ? 0 : 30}px)`,
            }}
          >
            <p className="text-white/90 text-lg">
              Every time an <span className="text-blue-400">ambassador joins</span>, 
              a <span className="text-green-400">customer signs up</span>, or 
              a <span className="text-amber-400">purchase is made</span>...
            </p>
          </div>

          <div
            className="mt-4 transition-all duration-700"
            style={{
              opacity: progress > 60 ? 1 : 0,
              transform: `translateX(${progress > 60 ? 0 : 30}px)`,
            }}
          >
            <p className="text-xl text-white font-semibold mb-2">
              The entire BitForce ecosystem grows stronger.
            </p>
          </div>

          <div
            className="mt-4 transition-all duration-700"
            style={{
              opacity: progress > 80 ? 1 : 0,
            }}
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg px-4 py-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-300">Just like a healthy tree becomes more valuable, BFT is designed to grow in value as the community grows!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Scene3({ progress }: { progress: number }) {
  const earningMethods = [
    { icon: Gift, amount: "500 BFT", description: "bonus just for signing up", color: "from-pink-500 to-rose-600" },
    { icon: Users, amount: "50 BFT", description: "for every new customer you onboard", color: "from-blue-500 to-cyan-600" },
    { icon: Coins, amount: "5%", description: "of every sale you generate, paid in BFT", color: "from-amber-500 to-orange-600" },
  ];

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
            opacity: progress > 5 ? 1 : 0,
            transform: `scale(${progress > 5 ? 1 : 0.5}) rotate(${progress > 5 ? 0 : -10}deg)`,
          }}
        >
          <img 
            src={bftToken} 
            alt="BFT Token" 
            className="w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-2xl"
          />
        </div>

        <div className="text-center md:text-left flex-1">
          <div
            className="transition-all duration-700"
            style={{
              opacity: progress > 10 ? 1 : 0,
              transform: `translateX(${progress > 10 ? 0 : 30}px)`,
            }}
          >
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
              As an ambassador, you earn BFT in{" "}
              <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">3 key ways</span>:
            </h2>
          </div>

          <div className="space-y-4">
            {earningMethods.map((method, i) => (
              <div
                key={i}
                className="transition-all duration-700"
                style={{
                  opacity: progress > 25 + i * 20 ? 1 : 0,
                  transform: `translateX(${progress > 25 + i * 20 ? 0 : 50}px)`,
                }}
              >
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${method.color}`}>
                    <method.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-2xl md:text-3xl font-bold text-white">{method.amount}</span>
                    <span className="text-white/80 ml-2">{method.description}</span>
                  </div>
                </div>
              </div>
            ))}
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
      
      <div
        className="absolute w-[500px] h-[500px] bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl"
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
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Here's the powerful part...
            </span>
          </h2>
        </div>

        <div
          className="transition-all duration-1000"
          style={{
            opacity: progress > 25 ? 1 : 0,
            transform: `translateY(${progress > 25 ? 0 : 30}px)`,
          }}
        >
          <p className="text-xl md:text-2xl text-white mb-6">
            You're not just earning tokens for your own work.
          </p>
        </div>

        <div
          className="transition-all duration-1000"
          style={{
            opacity: progress > 45 ? 1 : 0,
            transform: `scale(${progress > 45 ? 1 : 0.9})`,
          }}
        >
          <p className="text-lg md:text-xl text-white/80 mb-6">
            When the <span className="text-blue-400 font-semibold">entire community</span> hits goals—like reaching{" "}
            <span className="text-emerald-400">10 ambassadors</span> or{" "}
            <span className="text-amber-400">100 customers</span>...
          </p>
        </div>

        <div
          className="transition-all duration-1000"
          style={{
            opacity: progress > 65 ? 1 : 0,
          }}
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg px-6 py-4">
            <Target className="w-8 h-8 text-purple-400" />
            <span className="text-xl text-white">
              It unlocks permanent <span className="text-amber-400 font-bold">milestone bonuses</span> that increase the value of <span className="text-emerald-400 font-semibold">every</span> BFT token!
            </span>
          </div>
        </div>

        <div
          className="mt-8 transition-all duration-700"
          style={{ opacity: progress > 85 ? 1 : 0 }}
        >
          <p className="text-2xl md:text-3xl font-bold text-white">
            Your effort helps lift <span className="text-purple-400">everyone</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

function Scene5({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-purple-900/50"
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
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Ready to see how it works?
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
            Join the <span className="text-amber-400 font-semibold">pre-ICO opportunity</span>!
          </p>
        </div>

        <div
          className="transition-all duration-700"
          style={{
            opacity: progress > 50 ? 1 : 0,
          }}
        >
          <p className="text-lg text-white/70 mb-3">
            Visit for the live token dashboard:
          </p>
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
          className="mt-6 transition-all duration-700"
          style={{
            opacity: progress > 70 ? 1 : 0,
          }}
        >
          <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Start earning and growing with us today!
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BFTInfoVideo() {
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
      case 5:
        return <Scene5 progress={sceneProgress} />;
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
    <div className="min-h-screen bg-black flex flex-col">
      <audio ref={audioRef} src={backgroundMusic} loop />
      <audio ref={voiceOverRef} src={voiceOverAudio} />

      <div className="flex-1 relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${currentScene.bgGradient} transition-all duration-1000`}
        />

        {renderScene()}

        {!isPlaying && currentTime === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
            <div className="text-center">
              <div className="mb-8">
                <img 
                  src={bftToken} 
                  alt="BFT Token" 
                  className="w-32 h-32 mx-auto mb-4 drop-shadow-2xl"
                />
                <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-white mb-2 px-4">
                  Your Guide to Earning with{" "}
                  <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">BFT</span>
                </h1>
                <p className="text-base md:text-xl text-white/70">BitForce Token Informational Video</p>
              </div>
              <Button
                onClick={togglePlay}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-6 md:px-8 py-4 md:py-6 text-lg md:text-xl rounded-full"
                data-testid="button-play-video"
              >
                <Play className="w-6 h-6 md:w-8 md:h-8 mr-2" />
                Watch Now
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-black/80 backdrop-blur-sm border-t border-white/10 p-3 md:p-4">
        <div className="max-w-4xl mx-auto">
          <div 
            className="h-3 md:h-2 bg-white/20 rounded-full mb-3 md:mb-4 cursor-pointer touch-manipulation"
            onClick={handleProgressClick}
            data-testid="progress-bar"
          >
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 md:gap-2">
              <Button
                onClick={togglePlay}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 h-9 w-9 md:h-10 md:w-10"
                data-testid="button-toggle-play"
              >
                {isPlaying ? <Pause className="w-5 h-5 md:w-6 md:h-6" /> : <Play className="w-5 h-5 md:w-6 md:h-6" />}
              </Button>

              <Button
                onClick={restart}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 h-9 w-9 md:h-10 md:w-10"
                data-testid="button-restart"
              >
                <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
              </Button>

              <Button
                onClick={toggleMute}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 h-9 w-9 md:h-10 md:w-10"
                data-testid="button-toggle-mute"
              >
                {isMuted ? <VolumeX className="w-4 h-4 md:w-5 md:h-5" /> : <Volume2 className="w-4 h-4 md:w-5 md:h-5" />}
              </Button>

              <span className="text-white/70 text-xs md:text-sm ml-1 md:ml-2">
                {formatTime(currentTime)} / {formatTime(TOTAL_DURATION)}
              </span>
            </div>

            <div className="text-white/50 text-xs md:text-sm hidden md:block">
              Scene {currentScene.id}: {currentScene.title}
            </div>

            <Link href="/">
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 text-xs md:text-sm px-2 md:px-3" data-testid="button-back-home">
                <span className="hidden md:inline">Back to Home</span>
                <span className="md:hidden">Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
