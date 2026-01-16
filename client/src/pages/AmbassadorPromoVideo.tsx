import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  BookOpen,
  Users,
  Zap,
  Sparkles,
  Coins,
  Target,
  UserPlus,
  Mail,
  MessageSquare,
  Video,
  Bell,
  Award,
  ChevronRight,
  Rocket,
  Gift,
  TrendingUp,
} from "lucide-react";
import { Link } from "wouter";

import bitforceLogo from "@assets/Bitforce_1767872339442.jpg";
import bftToken from "@assets/generated_images/bitforce_token_cryptocurrency_coin.png";
import backgroundMusic from "@assets/epic_1768573393286.mp3";
import voiceOverAudio from "@assets/femaleaudio2_1768576922084.mp3";

interface Scene {
  id: number;
  title: string;
  duration: number;
  bgGradient: string;
}

const scenes: Scene[] = [
  { id: 1, title: "Welcome Ambassador", duration: 8, bgGradient: "from-slate-900 via-blue-900 to-slate-900" },
  { id: 2, title: "Step 1: Learn Products", duration: 18, bgGradient: "from-blue-900 via-indigo-900 to-purple-900" },
  { id: 3, title: "Step 2: Recruit Ambassadors", duration: 16, bgGradient: "from-purple-900 via-violet-800 to-pink-900" },
  { id: 4, title: "Step 3: Support Your Network", duration: 14, bgGradient: "from-emerald-900 via-teal-800 to-cyan-900" },
];

const TOTAL_DURATION = scenes.reduce((sum, s) => sum + s.duration, 0);

const PARTICLE_POSITIONS = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 100,
  delay: Math.random() * 3,
  duration: 2 + Math.random() * 3,
}));

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLE_POSITIONS.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function Scene1({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
      <FloatingParticles />

      <div
        className="relative z-10 text-center transition-all duration-1000"
        style={{
          opacity: progress > 10 ? 1 : 0,
          transform: `scale(${progress > 10 ? 1 : 0.8})`,
        }}
      >
        <img
          src={bitforceLogo}
          alt="BitForce Logo"
          className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 rounded-2xl shadow-2xl"
        />
      </div>

      <div
        className="relative z-10 text-center transition-all duration-1000"
        style={{
          opacity: progress > 25 ? 1 : 0,
          transform: `translateY(${progress > 25 ? 0 : 30}px)`,
        }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          I am an Ambassador...
        </h1>
        <p className="text-3xl md:text-5xl font-bold text-white/90">
          Now what?!
        </p>
      </div>

      <div
        className="relative z-10 mt-8 transition-all duration-700"
        style={{
          opacity: progress > 50 ? 1 : 0,
        }}
      >
        <p className="text-xl md:text-2xl text-white/80">
          Congratulations! You are on the way to the future!
        </p>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-500"
        style={{
          opacity: progress > 70 ? 1 : 0,
        }}
      >
        <ChevronRight className="w-8 h-8 text-white/50 animate-pulse" />
      </div>
    </div>
  );
}

function Scene2({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
      <FloatingParticles />

      <div
        className="relative z-10 text-center mb-8 transition-all duration-1000"
        style={{
          opacity: progress > 5 ? 1 : 0,
          transform: `translateY(${progress > 5 ? 0 : -30}px)`,
        }}
      >
        <div className="inline-flex items-center gap-3 bg-blue-500/20 border border-blue-500/30 rounded-full px-6 py-2 mb-4">
          <span className="text-blue-300 font-bold text-lg">STEP 1</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
          Learn About BitForce Products
        </h2>
      </div>

      <div
        className="relative z-10 max-w-3xl mx-auto transition-all duration-1000"
        style={{
          opacity: progress > 20 ? 1 : 0,
          transform: `translateX(${progress > 20 ? 0 : -30}px)`,
        }}
      >
        <p className="text-lg md:text-xl text-white/80 text-center mb-6">
          There are a wide array of products to offer customers. Each product is supported by a learning module.
        </p>
      </div>

      <div
        className="relative z-10 flex flex-wrap justify-center gap-4 mb-6 transition-all duration-700"
        style={{
          opacity: progress > 35 ? 1 : 0,
          transform: `scale(${progress > 35 ? 1 : 0.9})`,
        }}
      >
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-lg px-4 py-3">
          <img src={bftToken} alt="BFT Token" className="w-8 h-8" />
          <span className="text-amber-300 font-semibold">Earn BFT for each module!</span>
        </div>
      </div>

      <div
        className="relative z-10 space-y-3 transition-all duration-700"
        style={{
          opacity: progress > 50 ? 1 : 0,
        }}
      >
        <p className="text-white/70 text-center mb-4">
          Be sure to complete as many as possible
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span className="text-white/90">Training Modules</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-white/90">BFT Rewards</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-white/90">Master Products</span>
          </div>
        </div>
      </div>

      <div
        className="relative z-10 mt-8 transition-all duration-700"
        style={{
          opacity: progress > 70 ? 1 : 0,
          transform: `translateY(${progress > 70 ? 0 : 20}px)`,
        }}
      >
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="w-5 h-5 text-green-400" />
            <span className="text-green-300 font-semibold">Find Your Customers</span>
          </div>
          <p className="text-white/70 text-sm">
            Use our powerful lead generation tools to collect leads and turn them into customers
          </p>
        </div>
      </div>

      <div
        className="relative z-10 mt-4 transition-all duration-700"
        style={{
          opacity: progress > 85 ? 1 : 0,
        }}
      >
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-yellow-400" />
          <span className="text-yellow-300 font-semibold">Earn Cash and BFT for each product sale!</span>
        </div>
      </div>
    </div>
  );
}

function Scene3({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
      <FloatingParticles />

      <div
        className="relative z-10 text-center mb-8 transition-all duration-1000"
        style={{
          opacity: progress > 5 ? 1 : 0,
          transform: `translateY(${progress > 5 ? 0 : -30}px)`,
        }}
      >
        <div className="inline-flex items-center gap-3 bg-purple-500/20 border border-purple-500/30 rounded-full px-6 py-2 mb-4">
          <span className="text-purple-300 font-bold text-lg">STEP 2</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
          Recruit Ambassadors
        </h2>
        <p className="text-xl text-white/80">
          Now that you're a BitForce Ambassador...
        </p>
      </div>

      <div
        className="relative z-10 max-w-3xl mx-auto transition-all duration-1000"
        style={{
          opacity: progress > 20 ? 1 : 0,
        }}
      >
        <p className="text-lg text-white/80 text-center mb-6">
          Determine who in your network would make an excellent ambassador:
        </p>
      </div>

      <div
        className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-3 mb-8 transition-all duration-700"
        style={{
          opacity: progress > 35 ? 1 : 0,
          transform: `scale(${progress > 35 ? 1 : 0.9})`,
        }}
      >
        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-white/90 text-sm">Outgoing?</span>
        </div>
        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span className="text-white/90 text-sm">Extrovert?</span>
        </div>
        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-white/90 text-sm">Natural Salesperson?</span>
        </div>
        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
          <Users className="w-4 h-4 text-blue-400" />
          <span className="text-white/90 text-sm">On Social Media?</span>
        </div>
        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 md:col-span-2">
          <Coins className="w-4 h-4 text-amber-400" />
          <span className="text-white/90 text-sm">Want to earn money on their own time?</span>
        </div>
      </div>

      <div
        className="relative z-10 transition-all duration-700"
        style={{
          opacity: progress > 55 ? 1 : 0,
          transform: `translateY(${progress > 55 ? 0 : 20}px)`,
        }}
      >
        <div className="text-center mb-6">
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            They are BitForce material!
          </p>
        </div>
      </div>

      <div
        className="relative z-10 transition-all duration-700"
        style={{
          opacity: progress > 70 ? 1 : 0,
        }}
      >
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <UserPlus className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-semibold">Use BitForce Tools</span>
          </div>
          <p className="text-white/70 text-sm">
            Sign them up as an Ambassador
          </p>
        </div>
      </div>

      <div
        className="relative z-10 mt-4 transition-all duration-700"
        style={{
          opacity: progress > 85 ? 1 : 0,
        }}
      >
        <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg px-4 py-2">
          <Gift className="w-5 h-5 text-green-400" />
          <span className="text-green-300 font-semibold">Get paid for each ambassador you recruit!</span>
        </div>
      </div>
    </div>
  );
}

function Scene4({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
      <FloatingParticles />

      <div
        className="relative z-10 text-center mb-8 transition-all duration-1000"
        style={{
          opacity: progress > 5 ? 1 : 0,
          transform: `translateY(${progress > 5 ? 0 : -30}px)`,
        }}
      >
        <div className="inline-flex items-center gap-3 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-6 py-2 mb-4">
          <span className="text-emerald-300 font-bold text-lg">STEP 3</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
          Support Your Network
        </h2>
      </div>

      <div
        className="relative z-10 max-w-3xl mx-auto transition-all duration-1000"
        style={{
          opacity: progress > 20 ? 1 : 0,
        }}
      >
        <p className="text-lg text-white/80 text-center mb-6">
          Use automation BitForce tools to keep your customer and ambassador network informed and engaged:
        </p>
      </div>

      <div
        className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 transition-all duration-700"
        style={{
          opacity: progress > 40 ? 1 : 0,
          transform: `scale(${progress > 40 ? 1 : 0.9})`,
        }}
      >
        <div className="flex flex-col items-center gap-2 bg-white/10 rounded-xl p-4">
          <Mail className="w-8 h-8 text-blue-400" />
          <span className="text-white/90 text-sm">Emails</span>
        </div>
        <div className="flex flex-col items-center gap-2 bg-white/10 rounded-xl p-4">
          <MessageSquare className="w-8 h-8 text-green-400" />
          <span className="text-white/90 text-sm">Texts</span>
        </div>
        <div className="flex flex-col items-center gap-2 bg-white/10 rounded-xl p-4">
          <BookOpen className="w-8 h-8 text-purple-400" />
          <span className="text-white/90 text-sm">Tutorials</span>
        </div>
        <div className="flex flex-col items-center gap-2 bg-white/10 rounded-xl p-4">
          <Video className="w-8 h-8 text-pink-400" />
          <span className="text-white/90 text-sm">Product Demos</span>
        </div>
        <div className="flex flex-col items-center gap-2 bg-white/10 rounded-xl p-4">
          <Bell className="w-8 h-8 text-amber-400" />
          <span className="text-white/90 text-sm">Updates</span>
        </div>
        <div className="flex flex-col items-center gap-2 bg-white/10 rounded-xl p-4">
          <Sparkles className="w-8 h-8 text-cyan-400" />
          <span className="text-white/90 text-sm">And More!</span>
        </div>
      </div>

      <div
        className="relative z-10 transition-all duration-1000"
        style={{
          opacity: progress > 65 ? 1 : 0,
          transform: `translateY(${progress > 65 ? 0 : 20}px)`,
        }}
      >
        <p className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          Who do you know would make a great BitForce Ambassador?
        </p>
      </div>

      <div
        className="relative z-10 mt-6 transition-all duration-700"
        style={{
          opacity: progress > 80 ? 1 : 0,
        }}
      >
        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl px-6 py-4">
          <Rocket className="w-6 h-6 text-blue-400" />
          <span className="text-white font-semibold">Start Building Your Network Today!</span>
        </div>
      </div>
    </div>
  );
}

export default function AmbassadorPromoVideo() {
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
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-8 rounded-full text-xl gap-3"
              data-testid="button-play-video"
            >
              <Play className="w-8 h-8" />
              Watch Now
            </Button>
          </div>
        )}
      </div>

      <div className="bg-black/90 backdrop-blur-sm border-t border-white/10 p-4">
        <div className="max-w-4xl mx-auto space-y-3">
          <div
            className="relative h-2 bg-white/20 rounded-full cursor-pointer overflow-hidden"
            onClick={handleProgressClick}
            data-testid="progress-bar"
          >
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={handlePlayPause}
                className="text-white hover:bg-white/10"
                data-testid="button-play-pause"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>

              <Button
                size="icon"
                variant="ghost"
                onClick={handleRestart}
                className="text-white hover:bg-white/10"
                data-testid="button-restart"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:bg-white/10"
                data-testid="button-mute"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>

              <span className="text-white/70 text-sm ml-2">
                {formatTime(currentTime)} / {formatTime(TOTAL_DURATION)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-white/50 text-sm hidden md:block">
                {currentScene.title}
              </span>
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                  data-testid="button-back-home"
                >
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
