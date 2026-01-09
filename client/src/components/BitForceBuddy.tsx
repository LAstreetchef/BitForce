import { motion, AnimatePresence } from "framer-motion";
import buddyFullBody from "@assets/bitforcebuddy_1767995159680.png";
import buddyCloseUp from "@assets/bitboy2_1767995536336.png";

interface BuddyAction {
  sceneId: number;
  progressStart: number;
  progressEnd: number;
  visible: boolean;
  speechBubble?: string;
  position?: "right" | "left";
  imageType?: "fullBody" | "closeUp";
}

const BUDDY_TIMELINE: BuddyAction[] = [
  { sceneId: 2, progressStart: 30, progressEnd: 100, visible: true, speechBubble: "Welcome to BitForce!", position: "right", imageType: "fullBody" },
  
  { sceneId: 5, progressStart: 10, progressEnd: 90, visible: true, speechBubble: "Join the team!", position: "right", imageType: "closeUp" },
  
  { sceneId: 6, progressStart: 5, progressEnd: 25, visible: true, speechBubble: "Check these out!", position: "left", imageType: "closeUp" },
  { sceneId: 6, progressStart: 30, progressEnd: 50, visible: true, position: "right", imageType: "fullBody" },
  { sceneId: 6, progressStart: 55, progressEnd: 75, visible: true, position: "left", imageType: "closeUp" },
  { sceneId: 6, progressStart: 80, progressEnd: 95, visible: true, speechBubble: "Great deals!", position: "right", imageType: "fullBody" },
  
  { sceneId: 8, progressStart: 20, progressEnd: 100, visible: true, speechBubble: "Let's go!", position: "right", imageType: "closeUp" },
];

function SpeechBubble({ text, position }: { text: string; position: "left" | "right" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: position === "right" ? 20 : -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: position === "right" ? 20 : -20 }}
      className={`absolute top-4 ${position === "right" ? "-left-36" : "-right-36"} bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl px-4 py-3 shadow-xl whitespace-nowrap border-2 border-white/30`}
      data-testid="text-buddy-speech-bubble"
    >
      <span className="text-white text-sm font-bold drop-shadow-sm">{text}</span>
      <div 
        className={`absolute top-1/2 -translate-y-1/2 ${position === "right" ? "-right-2" : "-left-2"} w-0 h-0 
          ${position === "right" 
            ? "border-l-8 border-t-8 border-b-8 border-l-purple-600 border-t-transparent border-b-transparent" 
            : "border-r-8 border-t-8 border-b-8 border-r-blue-500 border-t-transparent border-b-transparent"
          }`} 
      />
    </motion.div>
  );
}

interface BitForceBuddyProps {
  currentScene: number;
  sceneProgress: number;
  isPlaying: boolean;
}

export default function BitForceBuddy({ currentScene, sceneProgress, isPlaying }: BitForceBuddyProps) {
  const sceneId = currentScene + 1;

  const currentAction = BUDDY_TIMELINE.find(
    (action) =>
      action.sceneId === sceneId &&
      sceneProgress >= action.progressStart &&
      sceneProgress < action.progressEnd
  );

  const isVisible = currentAction?.visible ?? false;
  const position = currentAction?.position ?? "right";
  const imageType = currentAction?.imageType ?? "fullBody";
  const buddyImage = imageType === "closeUp" ? buddyCloseUp : buddyFullBody;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed bottom-24 ${position === "right" ? "right-4 md:right-8" : "left-4 md:left-8"} z-50 pointer-events-none`}
          initial={{ 
            opacity: 0, 
            x: position === "right" ? 150 : -150,
            scale: 0.8,
            rotate: position === "right" ? 10 : -10
          }}
          animate={{ 
            opacity: isPlaying ? 1 : 0.6, 
            x: 0,
            scale: 1,
            rotate: 0,
          }}
          exit={{ 
            opacity: 0, 
            x: position === "right" ? 150 : -150,
            scale: 0.8,
            rotate: position === "right" ? 10 : -10
          }}
          transition={{ 
            type: "spring", 
            damping: 15, 
            stiffness: 200,
            duration: 0.5
          }}
          data-testid="bitforce-buddy-avatar"
        >
          <div className="relative">
            <AnimatePresence mode="wait">
              {currentAction?.speechBubble && (
                <SpeechBubble 
                  key={currentAction.speechBubble} 
                  text={currentAction.speechBubble} 
                  position={position}
                />
              )}
            </AnimatePresence>
            
            <motion.div
              className="relative"
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full blur-lg opacity-60 animate-pulse" />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-40" />
              
              <div className="relative w-24 h-28 md:w-28 md:h-32 overflow-hidden rounded-t-full rounded-b-3xl border-4 border-white/50 shadow-2xl bg-gradient-to-b from-slate-800 to-slate-900">
                <img 
                  src={buddyImage} 
                  alt="BitForce Buddy" 
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent pointer-events-none" />
              </div>
              
              <motion.div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-white/30"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                BitForce
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
