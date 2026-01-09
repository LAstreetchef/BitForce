import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AvatarState = "idle" | "waving" | "pointing" | "excited" | "thinking" | "concerned" | "reacting";

interface AvatarAction {
  sceneId: number;
  progressStart: number;
  progressEnd: number;
  state: AvatarState;
  speechBubble?: string;
  pointDirection?: "left" | "right" | "up";
}

const AVATAR_TIMELINE: AvatarAction[] = [
  { sceneId: 1, progressStart: 0, progressEnd: 30, state: "waving", speechBubble: "Hey there!" },
  { sceneId: 1, progressStart: 30, progressEnd: 70, state: "concerned" },
  { sceneId: 1, progressStart: 70, progressEnd: 100, state: "thinking" },
  
  { sceneId: 2, progressStart: 0, progressEnd: 40, state: "reacting", speechBubble: "Watch this!" },
  { sceneId: 2, progressStart: 40, progressEnd: 100, state: "pointing", pointDirection: "left" },
  
  { sceneId: 3, progressStart: 0, progressEnd: 30, state: "pointing", pointDirection: "up", speechBubble: "Check it out!" },
  { sceneId: 3, progressStart: 30, progressEnd: 70, state: "reacting" },
  { sceneId: 3, progressStart: 70, progressEnd: 100, state: "excited" },
  
  { sceneId: 4, progressStart: 0, progressEnd: 50, state: "pointing", pointDirection: "left", speechBubble: "So many tools!" },
  { sceneId: 4, progressStart: 50, progressEnd: 100, state: "reacting" },
  
  { sceneId: 5, progressStart: 0, progressEnd: 40, state: "pointing", pointDirection: "left", speechBubble: "Great deals!" },
  { sceneId: 5, progressStart: 40, progressEnd: 70, state: "reacting" },
  { sceneId: 5, progressStart: 70, progressEnd: 100, state: "excited" },
  
  { sceneId: 6, progressStart: 0, progressEnd: 50, state: "reacting", speechBubble: "Awesome, right?" },
  { sceneId: 6, progressStart: 50, progressEnd: 100, state: "thinking" },
  
  { sceneId: 7, progressStart: 0, progressEnd: 60, state: "pointing", pointDirection: "left", speechBubble: "Join us!" },
  { sceneId: 7, progressStart: 60, progressEnd: 100, state: "waving", speechBubble: "See you soon!" },
];

function SpeechBubble({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white rounded-xl px-3 py-2 shadow-lg whitespace-nowrap"
      data-testid="text-buddy-speech-bubble"
    >
      <span className="text-slate-800 text-sm font-medium">{text}</span>
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
    </motion.div>
  );
}

function BuddyCharacter({ state, pointDirection }: { state: AvatarState; pointDirection?: "left" | "right" | "up" }) {
  const eyeVariants = {
    idle: { scaleY: 1 },
    blink: { scaleY: 0.1 },
    excited: { scaleY: 1.2, scaleX: 1.1 },
    concerned: { scaleY: 0.8 },
  };

  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (state === "idle" || state === "thinking") {
      const interval = setInterval(() => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }, 2000 + Math.random() * 2000);
      return () => clearInterval(interval);
    }
  }, [state]);

  const bodyVariants = {
    idle: { y: [0, -3, 0], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } },
    waving: { y: [0, -5, 0], transition: { duration: 0.5, repeat: Infinity } },
    excited: { y: [0, -8, 0], scale: [1, 1.05, 1], transition: { duration: 0.3, repeat: Infinity } },
    pointing: { y: 0 },
    thinking: { y: [0, -2, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
    concerned: { y: 0 },
    reacting: { y: [0, -4, 0], scale: [1, 1.08, 1], transition: { duration: 0.5, repeat: Infinity } },
  };

  const armVariants = {
    idle: { rotate: 0 },
    waving: { rotate: [0, 20, -10, 20, 0], transition: { duration: 0.8, repeat: Infinity } },
    pointing: { rotate: pointDirection === "up" ? -90 : pointDirection === "left" ? -45 : 45 },
    excited: { rotate: [0, 15, -15, 0], transition: { duration: 0.4, repeat: Infinity } },
    thinking: { rotate: 0 },
    concerned: { rotate: 0 },
    reacting: { rotate: [0, 25, -5, 0], transition: { duration: 0.6, repeat: Infinity } },
  };

  const antennaVariants = {
    idle: { rotate: [0, 5, -5, 0], transition: { duration: 2, repeat: Infinity } },
    excited: { rotate: [0, 15, -15, 0], scale: [1, 1.1, 1], transition: { duration: 0.3, repeat: Infinity } },
    waving: { rotate: [0, 10, -10, 0], transition: { duration: 0.5, repeat: Infinity } },
    pointing: { rotate: 0 },
    thinking: { rotate: [0, 3, -3, 0], transition: { duration: 3, repeat: Infinity } },
    concerned: { rotate: 0 },
    reacting: { rotate: [0, 12, -12, 0], scale: [1, 1.15, 1], transition: { duration: 0.4, repeat: Infinity } },
  };

  const mouthPaths = {
    idle: "M 35 70 Q 50 80 65 70",
    waving: "M 30 68 Q 50 85 70 68",
    excited: "M 30 65 Q 50 90 70 65",
    pointing: "M 35 70 Q 50 78 65 70",
    thinking: "M 40 72 Q 50 72 60 72",
    concerned: "M 35 75 Q 50 65 65 75",
    reacting: "M 32 68 Q 50 88 68 68",
  };

  return (
    <motion.div
      className="relative w-24 h-24 md:w-28 md:h-28"
      variants={bodyVariants}
      animate={state}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="faceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.g
          style={{ transformOrigin: "50px 10px" }}
          variants={antennaVariants}
          animate={state}
        >
          <line x1="50" y1="20" x2="50" y2="8" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="5" r="4" fill="#F472B6" filter="url(#glow)">
            <animate
              attributeName="opacity"
              values="1;0.5;1"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        </motion.g>

        <circle cx="50" cy="50" r="32" fill="url(#bodyGradient)" />
        <circle cx="50" cy="50" r="26" fill="url(#faceGradient)" />

        <circle cx="50" cy="48" r="22" fill="#1E293B" opacity="0.9" />

        <motion.g
          animate={isBlinking ? "blink" : state === "excited" ? "excited" : state === "concerned" ? "concerned" : "idle"}
          variants={eyeVariants}
          style={{ transformOrigin: "38px 45px" }}
        >
          <ellipse cx="38" cy="45" rx="6" ry="7" fill="white" />
          <circle cx="39" cy="46" r="3" fill="#1E293B" />
          <circle cx="40" cy="44" r="1.5" fill="white" />
        </motion.g>

        <motion.g
          animate={isBlinking ? "blink" : state === "excited" ? "excited" : state === "concerned" ? "concerned" : "idle"}
          variants={eyeVariants}
          style={{ transformOrigin: "62px 45px" }}
        >
          <ellipse cx="62" cy="45" rx="6" ry="7" fill="white" />
          <circle cx="63" cy="46" r="3" fill="#1E293B" />
          <circle cx="64" cy="44" r="1.5" fill="white" />
        </motion.g>

        <motion.path
          d={mouthPaths[state]}
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          initial={false}
          animate={{ d: mouthPaths[state] }}
          transition={{ duration: 0.3 }}
        />

        {state === "excited" && (
          <>
            <circle cx="30" cy="55" r="4" fill="#F472B6" opacity="0.6" />
            <circle cx="70" cy="55" r="4" fill="#F472B6" opacity="0.6" />
          </>
        )}
      </svg>

      <motion.div
        className="absolute top-1/2 -right-2"
        style={{ transformOrigin: "left center" }}
        variants={armVariants}
        animate={state}
      >
        <svg width="30" height="20" viewBox="0 0 30 20">
          <path
            d="M 0 10 Q 10 8 20 5 L 28 3"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="28" cy="3" r="4" fill="#60A5FA" />
        </svg>
      </motion.div>

      {state === "thinking" && (
        <motion.div
          className="absolute -top-6 -right-4"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "0s" }} />
            <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "0.1s" }} />
            <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "0.2s" }} />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

interface BitForceBuddyProps {
  currentScene: number;
  sceneProgress: number;
  isPlaying: boolean;
}

export default function BitForceBuddy({ currentScene, sceneProgress, isPlaying }: BitForceBuddyProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const sceneId = currentScene + 1;

  const currentAction = AVATAR_TIMELINE.find(
    (action) =>
      action.sceneId === sceneId &&
      sceneProgress >= action.progressStart &&
      sceneProgress < action.progressEnd
  ) || { state: "idle" as AvatarState, speechBubble: undefined, pointDirection: undefined };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 pointer-events-none"
          initial={{ opacity: 0, y: 100, scale: 0.5 }}
          animate={{ 
            opacity: isPlaying ? 1 : 0.5, 
            y: 0, 
            scale: 1,
          }}
          exit={{ opacity: 0, y: 100, scale: 0.5 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          data-testid="bitforce-buddy-avatar"
        >
          <div className="relative">
            <AnimatePresence mode="wait">
              {currentAction.speechBubble && (
                <SpeechBubble key={currentAction.speechBubble} text={currentAction.speechBubble} />
              )}
            </AnimatePresence>
            
            <BuddyCharacter 
              state={currentAction.state} 
              pointDirection={currentAction.pointDirection}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
