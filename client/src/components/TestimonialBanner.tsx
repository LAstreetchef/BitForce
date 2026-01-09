import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    category: "Impact-Driven",
    quote: "Through Bitforce, I learned practical AI skills and immediately put them to work helping my community. It wasn't just training—it was purpose-driven learning with real impact.",
  },
  {
    category: "Personal & Relatable",
    quote: "Bitforce gave me the opportunity to learn AI while doing something meaningful. I gained real skills, earned income, and helped solve problems in my own community.",
  },
  {
    category: "Professional",
    quote: "Learning AI with Bitforce was a turning point. The hands-on experience allowed me to support community projects while building career-ready AI skills.",
  },
  {
    category: "Short & Powerful",
    quote: "Bitforce helped me learn AI, earn while learning, and give back to my community at the same time.",
  },
  {
    category: "Community-Focused",
    quote: "What I loved about Bitforce is that learning AI wasn't just about technology—it was about using those skills to strengthen and support our community.",
  },
];

export function TestimonialBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-4"
      data-testid="banner-testimonial"
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-3 min-h-[60px]">
          <Quote className="w-5 h-5 text-blue-200 shrink-0 hidden sm:block" />
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <p className="text-sm sm:text-base font-medium leading-relaxed max-w-3xl">
                "{TESTIMONIALS[currentIndex].quote}"
              </p>
            </motion.div>
          </AnimatePresence>
          <Quote className="w-5 h-5 text-blue-200 shrink-0 rotate-180 hidden sm:block" />
        </div>
        <div className="flex justify-center gap-1.5 mt-3">
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? "bg-white w-4" 
                  : "bg-blue-300/50 hover:bg-blue-300"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
              data-testid={`button-dot-${index}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
