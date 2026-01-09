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
  { sceneId: 1, progressStart: 0, progressEnd: 30, state: "waving", speechBubble: "Hi there! ♡" },
  { sceneId: 1, progressStart: 30, progressEnd: 70, state: "concerned" },
  { sceneId: 1, progressStart: 70, progressEnd: 100, state: "thinking" },
  
  { sceneId: 2, progressStart: 0, progressEnd: 40, state: "reacting", speechBubble: "Watch this! ✨" },
  { sceneId: 2, progressStart: 40, progressEnd: 100, state: "pointing", pointDirection: "left" },
  
  { sceneId: 3, progressStart: 0, progressEnd: 30, state: "pointing", pointDirection: "up", speechBubble: "So cool! (•̀ᴗ•́)و" },
  { sceneId: 3, progressStart: 30, progressEnd: 70, state: "reacting" },
  { sceneId: 3, progressStart: 70, progressEnd: 100, state: "excited" },
  
  { sceneId: 4, progressStart: 0, progressEnd: 50, state: "pointing", pointDirection: "left", speechBubble: "Amazing tools! ٩(◕‿◕｡)۶" },
  { sceneId: 4, progressStart: 50, progressEnd: 100, state: "reacting" },
  
  { sceneId: 5, progressStart: 0, progressEnd: 40, state: "pointing", pointDirection: "left", speechBubble: "Great deals! ヽ(・∀・)ﾉ" },
  { sceneId: 5, progressStart: 40, progressEnd: 70, state: "reacting" },
  { sceneId: 5, progressStart: 70, progressEnd: 100, state: "excited" },
  
  { sceneId: 6, progressStart: 0, progressEnd: 50, state: "reacting", speechBubble: "Awesome! (ﾉ´ヮ`)ﾉ*:・゚✧" },
  { sceneId: 6, progressStart: 50, progressEnd: 100, state: "thinking" },
  
  { sceneId: 7, progressStart: 0, progressEnd: 60, state: "pointing", pointDirection: "left", speechBubble: "Join us! ♡" },
  { sceneId: 7, progressStart: 60, progressEnd: 100, state: "waving", speechBubble: "See you! (｡◕‿◕｡)" },
];

function SpeechBubble({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      className="absolute -top-14 left-1/2 -translate-x-1/2 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl px-4 py-2 shadow-lg whitespace-nowrap border-2 border-pink-200"
      data-testid="text-buddy-speech-bubble"
    >
      <span className="text-purple-800 text-sm font-medium">{text}</span>
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-pink-200" />
    </motion.div>
  );
}

function SparkleEffect() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${10 + Math.random() * 40}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          <svg viewBox="0 0 20 20" className="w-full h-full">
            <path
              d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z"
              fill="#FFD700"
            />
          </svg>
        </motion.div>
      ))}
    </motion.div>
  );
}

function AnimeCharacter({ state, pointDirection }: { state: AvatarState; pointDirection?: "left" | "right" | "up" }) {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  const bodyVariants = {
    idle: { y: [0, -2, 0], transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" } },
    waving: { y: [0, -4, 0], transition: { duration: 0.6, repeat: Infinity } },
    excited: { y: [0, -8, 0], scale: [1, 1.03, 1], transition: { duration: 0.35, repeat: Infinity } },
    pointing: { y: 0, rotate: pointDirection === "left" ? -3 : pointDirection === "right" ? 3 : 0 },
    thinking: { y: [0, -1, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
    concerned: { y: 0 },
    reacting: { y: [0, -5, 0], scale: [1, 1.05, 1], transition: { duration: 0.4, repeat: Infinity } },
  };

  const hairVariants = {
    idle: { rotate: [0, 1, -1, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
    waving: { rotate: [0, 3, -3, 0], transition: { duration: 0.8, repeat: Infinity } },
    excited: { rotate: [0, 4, -4, 0], transition: { duration: 0.4, repeat: Infinity } },
    pointing: { rotate: 0 },
    thinking: { rotate: [0, 0.5, -0.5, 0], transition: { duration: 4, repeat: Infinity } },
    concerned: { rotate: 0 },
    reacting: { rotate: [0, 3, -3, 0], transition: { duration: 0.5, repeat: Infinity } },
  };

  const armVariants = {
    idle: { rotate: 0 },
    waving: { rotate: [0, 25, -10, 25, 0], transition: { duration: 0.7, repeat: Infinity } },
    pointing: { rotate: pointDirection === "up" ? -60 : pointDirection === "left" ? -35 : 35, x: pointDirection === "left" ? -5 : 5 },
    excited: { rotate: [0, 20, -20, 0], transition: { duration: 0.35, repeat: Infinity } },
    thinking: { rotate: 15, x: 5 },
    concerned: { rotate: 0 },
    reacting: { rotate: [0, 30, -10, 0], transition: { duration: 0.5, repeat: Infinity } },
  };

  const mouthPaths = {
    idle: "M 85 130 Q 100 138 115 130",
    waving: "M 80 128 Q 100 145 120 128",
    excited: "M 78 125 Q 100 150 122 125",
    pointing: "M 88 130 Q 100 136 112 130",
    thinking: "M 92 132 Q 100 132 108 132",
    concerned: "M 85 135 Q 100 125 115 135",
    reacting: "M 80 126 Q 100 148 120 126",
  };

  const eyeScale = isBlinking ? 0.1 : state === "excited" || state === "reacting" ? 1.15 : state === "concerned" ? 0.9 : 1;
  const showBlush = state === "excited" || state === "reacting" || state === "waving";
  const showSparkles = state === "excited" || state === "reacting";

  return (
    <motion.div
      className="relative w-28 h-36 md:w-32 md:h-40"
      variants={bodyVariants}
      animate={state}
    >
      {showSparkles && <SparkleEffect />}
      
      <svg viewBox="0 0 200 260" className="w-full h-full drop-shadow-lg">
        <defs>
          <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8D5FF" />
            <stop offset="50%" stopColor="#C4B5FD" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
          <linearGradient id="hairHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F5F3FF" />
            <stop offset="100%" stopColor="#DDD6FE" />
          </linearGradient>
          <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FEF3E9" />
            <stop offset="100%" stopColor="#FDE7D7" />
          </linearGradient>
          <linearGradient id="outfitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          <linearGradient id="eyeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.g
          className="hair-back"
          style={{ transformOrigin: "100px 60px" }}
          variants={hairVariants}
          animate={state}
        >
          <ellipse cx="100" cy="180" rx="45" ry="70" fill="url(#hairGradient)" />
          <path d="M 55 100 Q 40 150 55 220" stroke="url(#hairHighlight)" strokeWidth="8" fill="none" opacity="0.6" />
          <path d="M 145 100 Q 160 150 145 220" stroke="url(#hairHighlight)" strokeWidth="8" fill="none" opacity="0.6" />
        </motion.g>

        <ellipse cx="100" cy="140" rx="30" ry="25" fill="url(#skinGradient)" />

        <g className="outfit">
          <path
            d="M 70 165 L 100 155 L 130 165 L 135 200 L 65 200 Z"
            fill="url(#outfitGradient)"
          />
          <path
            d="M 75 165 L 100 158 L 125 165"
            fill="none"
            stroke="#F9A8D4"
            strokeWidth="3"
          />
          <circle cx="100" cy="175" r="5" fill="#F472B6" />
          <path
            d="M 65 200 Q 60 220 80 230 L 100 225 L 120 230 Q 140 220 135 200"
            fill="#818CF8"
          />
        </g>

        <ellipse cx="100" cy="115" rx="35" ry="40" fill="url(#skinGradient)" />

        <motion.g
          className="hair-front"
          style={{ transformOrigin: "100px 60px" }}
          variants={hairVariants}
          animate={state}
        >
          <path
            d="M 65 80 Q 70 50 100 45 Q 130 50 135 80 L 130 100 Q 100 95 70 100 Z"
            fill="url(#hairGradient)"
          />
          <path
            d="M 80 75 Q 85 55 100 52 Q 115 55 120 75"
            fill="url(#hairHighlight)"
            opacity="0.7"
          />
          
          <motion.g style={{ transformOrigin: "55px 75px" }} variants={hairVariants} animate={state}>
            <path
              d="M 65 80 Q 50 85 45 120 Q 40 160 55 190"
              stroke="url(#hairGradient)"
              strokeWidth="18"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="55" cy="190" r="6" fill="#F472B6" />
          </motion.g>
          
          <motion.g style={{ transformOrigin: "145px 75px" }} variants={hairVariants} animate={state}>
            <path
              d="M 135 80 Q 150 85 155 120 Q 160 160 145 190"
              stroke="url(#hairGradient)"
              strokeWidth="18"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="145" cy="190" r="6" fill="#F472B6" />
          </motion.g>
          
          <path d="M 85 80 L 82 95" stroke="url(#hairGradient)" strokeWidth="4" fill="none" />
          <path d="M 100 75 L 100 90" stroke="url(#hairGradient)" strokeWidth="4" fill="none" />
          <path d="M 115 80 L 118 95" stroke="url(#hairGradient)" strokeWidth="4" fill="none" />
        </motion.g>

        <g className="face">
          <motion.g
            className="left-eye"
            style={{ transformOrigin: "80px 108px" }}
            animate={{ scaleY: eyeScale }}
            transition={{ duration: 0.1 }}
          >
            <ellipse cx="80" cy="108" rx="12" ry="14" fill="white" />
            <ellipse cx="80" cy="110" rx="9" ry="11" fill="url(#eyeGradient)" />
            <ellipse cx="80" cy="112" rx="5" ry="6" fill="#1E1B4B" />
            <circle cx="76" cy="105" r="3" fill="white" />
            <circle cx="84" cy="108" r="1.5" fill="white" />
            {showSparkles && (
              <motion.path
                d="M 90 100 L 92 104 L 96 106 L 92 108 L 90 112 L 88 108 L 84 106 L 88 104 Z"
                fill="#FFD700"
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </motion.g>

          <motion.g
            className="right-eye"
            style={{ transformOrigin: "120px 108px" }}
            animate={{ scaleY: eyeScale }}
            transition={{ duration: 0.1 }}
          >
            <ellipse cx="120" cy="108" rx="12" ry="14" fill="white" />
            <ellipse cx="120" cy="110" rx="9" ry="11" fill="url(#eyeGradient)" />
            <ellipse cx="120" cy="112" rx="5" ry="6" fill="#1E1B4B" />
            <circle cx="116" cy="105" r="3" fill="white" />
            <circle cx="124" cy="108" r="1.5" fill="white" />
            {showSparkles && (
              <motion.path
                d="M 130 100 L 132 104 L 136 106 L 132 108 L 130 112 L 128 108 L 124 106 L 128 104 Z"
                fill="#FFD700"
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
              />
            )}
          </motion.g>

          <AnimatePresence>
            {showBlush && (
              <>
                <motion.ellipse
                  cx="65"
                  cy="120"
                  rx="8"
                  ry="5"
                  fill="#FCA5A5"
                  opacity="0.6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                />
                <motion.ellipse
                  cx="135"
                  cy="120"
                  rx="8"
                  ry="5"
                  fill="#FCA5A5"
                  opacity="0.6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                />
              </>
            )}
          </AnimatePresence>

          <motion.path
            d={mouthPaths[state]}
            fill="none"
            stroke="#D946EF"
            strokeWidth="3"
            strokeLinecap="round"
            initial={false}
            animate={{ d: mouthPaths[state] }}
            transition={{ duration: 0.2 }}
          />

          <path d="M 97 120 L 100 126 L 103 120" stroke="#FBBF24" strokeWidth="1.5" fill="none" opacity="0.4" />
        </g>

        <g className="accessories">
          <rect x="60" cy="90" y="85" width="80" height="6" rx="3" fill="#818CF8" opacity="0.7" />
          <circle cx="60" cy="88" r="4" fill="#F472B6" filter="url(#softGlow)">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="140" cy="88" r="4" fill="#F472B6" filter="url(#softGlow)">
            <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>

        <motion.g
          className="arm"
          style={{ transformOrigin: "130px 165px" }}
          variants={armVariants}
          animate={state}
        >
          <ellipse cx="145" cy="175" rx="8" ry="12" fill="url(#skinGradient)" />
          <path
            d="M 135 165 Q 155 170 160 185"
            stroke="url(#skinGradient)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="162" cy="188" rx="6" ry="8" fill="url(#skinGradient)" />
        </motion.g>
      </svg>

      {state === "thinking" && (
        <motion.div
          className="absolute -top-2 -right-2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-300 animate-bounce" style={{ animationDelay: "0s" }} />
            <div className="w-2 h-2 rounded-full bg-purple-300 animate-bounce" style={{ animationDelay: "0.1s" }} />
            <div className="w-2 h-2 rounded-full bg-purple-300 animate-bounce" style={{ animationDelay: "0.2s" }} />
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
          className="fixed bottom-20 right-4 md:bottom-24 md:right-8 z-50 pointer-events-none"
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
            
            <AnimeCharacter 
              state={currentAction.state} 
              pointDirection={currentAction.pointDirection}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
