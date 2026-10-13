import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Apple, X, Sparkles, Trophy } from "lucide-react";
import { Language, MULTIPLIERS } from "../types";

const MotionDiv = motion.div as any;

interface GridProps {
  path: number[];
  isAnalyzing: boolean;
  predictionId?: string;
  gridData?: boolean[][];
  activeOddIndex: number;
  language: Language;
}

const COLS = 5;

const GoodAppleIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <Apple className="w-full h-full fill-emerald-400 text-emerald-300 filter drop-shadow-[0_0_15px_rgba(52,211,153,0.95)]" />
    <span className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping pointer-events-none" />
  </div>
);

const BadAppleIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <Apple className="w-full h-full text-zinc-600 fill-zinc-900 drop-shadow-[0_0_8px_rgba(255,30,56,0.6)] opacity-75" />
    <X className="w-5 h-5 text-[#ff1e38] stroke-[4] absolute drop-shadow-[0_0_8px_#ff1e38]" />
  </div>
);

export const Grid: React.FC<GridProps> = ({
  path,
  isAnalyzing,
  predictionId,
  gridData,
  activeOddIndex,
  language,
}) => {
  const [showSuccessFlash, setShowSuccessFlash] = useState(false);
  const isHasPrediction = !isAnalyzing && Boolean(predictionId) && path.length > 0;
  const rowIndex = activeOddIndex >= 0 && activeOddIndex < 10 ? activeOddIndex : 0;
  const multiplier = MULTIPLIERS[rowIndex];
  const rowGrid = gridData ? gridData[rowIndex] : null;

  useEffect(() => {
    if (isHasPrediction) {
      setShowSuccessFlash(true);
      const timer = setTimeout(() => setShowSuccessFlash(false), 800);
      return () => clearTimeout(timer);
    }
  }, [predictionId, isHasPrediction]);

  return (
    <div className="relative w-full mx-auto select-none flex flex-col items-center bg-transparent">
      <div
        className={`w-full max-w-md flex flex-col items-center gap-4 p-2 relative z-10 transition-all duration-500 ${
          showSuccessFlash ? "brightness-125 scale-[1.02]" : ""
        }`}
      >
        {/* Selected Multiplier Header Indicator */}
        <div className="flex items-center justify-between w-full max-w-[340px] px-4 py-2.5 bg-zinc-950/80 border border-white/10 rounded-2xl backdrop-blur-xl shadow-lg">
          <span className="text-xs text-zinc-300 font-bold flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#ff1e38]" />
            {language === "ar" ? "مستوى الرهان والمضاعف:" : "Multiplier Level:"}
          </span>
          <span className="text-sm font-black font-mono px-3.5 py-1 rounded-xl bg-gradient-to-r from-red-600/30 to-[#ff1e38]/30 border border-[#ff1e38] text-white shadow-[0_0_15px_rgba(255,30,56,0.4)]">
            {multiplier.label}
          </span>
        </div>

        {/* 5 LUXURY CYBER CELLS */}
        <motion.div
          key={`single-row-${rowIndex}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center gap-3 w-full max-w-[340px] my-3"
        >
          {Array.from({ length: COLS }).map((_, colIndex) => {
            const isGoodApple = isHasPrediction && rowGrid ? rowGrid[colIndex] : false;
            const isBadApple = isHasPrediction && rowGrid ? !rowGrid[colIndex] : false;

            return (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className={`w-[54px] h-[54px] rounded-2xl flex items-center justify-center relative transition-all duration-500 border overflow-hidden shrink-0 shadow-lg ${
                  isGoodApple
                    ? "bg-gradient-to-b from-emerald-950/80 via-black to-zinc-950 border-2 border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.6)]"
                    : isBadApple
                      ? "bg-gradient-to-b from-red-950/80 via-black to-zinc-950 border border-[#ff1e38]/70 shadow-[0_0_18px_rgba(255,30,56,0.3)]"
                      : "bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 hover:border-red-500/40"
                }`}
              >
                {/* Cell Content */}
                {isHasPrediction ? (
                  <MotionDiv
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      damping: 12,
                      stiffness: 180,
                      delay: colIndex * 0.05,
                    }}
                    className="w-full h-full flex items-center justify-center relative p-1"
                  >
                    {isGoodApple ? (
                      <GoodAppleIcon className="w-8 h-8" />
                    ) : (
                      <BadAppleIcon className="w-8 h-8" />
                    )}
                  </MotionDiv>
                ) : (
                  /* Empty or Analyzing Dot */
                  <div className="relative flex items-center justify-center w-full h-full">
                    <motion.div
                      animate={
                        isAnalyzing
                          ? {
                              scale: [1, 1.8, 1],
                              opacity: [0.2, 1, 0.2],
                              backgroundColor: [
                                "rgba(255,30,56,0.2)",
                                "rgba(255,30,56,1)",
                                "rgba(255,30,56,0.2)",
                              ],
                            }
                          : {}
                      }
                      transition={{ duration: 0.9, repeat: Infinity, delay: colIndex * 0.15 }}
                      className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                        isAnalyzing ? "shadow-[0_0_14px_#ff1e38] bg-[#ff1e38]" : "bg-zinc-700"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
