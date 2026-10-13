import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Apple, X } from "lucide-react";
import { translations } from "../translations";
import { Language } from "../types";

const MotionDiv = motion.div as any;

export const MULTIPLIERS = [
  { value: "1.23", label: "x1.23", goodCount: 4, badCount: 1 },
  { value: "1.54", label: "x1.54", goodCount: 4, badCount: 1 },
  { value: "1.94", label: "x1.94", goodCount: 4, badCount: 1 },
  { value: "2.41", label: "x2.41", goodCount: 4, badCount: 1 },
  { value: "4.02", label: "x4.02", goodCount: 3, badCount: 2 },
  { value: "6.71", label: "x6.71", goodCount: 3, badCount: 2 },
  { value: "11.18", label: "x11.18", goodCount: 3, badCount: 2 },
  { value: "27.97", label: "x27.97", goodCount: 2, badCount: 3 },
  { value: "69.93", label: "x69.93", goodCount: 2, badCount: 3 },
  { value: "349.68", label: "x349.68", goodCount: 1, badCount: 4 },
];

interface GridProps {
  path: number[];
  isAnalyzing: boolean;
  predictionId?: string;
  gridData?: boolean[][];
  activeOddIndex: number;
  language: Language;
}

const COLS = 5;

const GoodAppleIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <Apple
      className="w-full h-full fill-current transition-all"
      style={{
        color: "var(--primary-color)",
        filter: "drop-shadow(0 0 10px var(--primary-glow))",
      }}
    />
  </div>
);

const BadAppleIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <Apple className="w-full h-full text-red-500/80 fill-red-950/80 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)] opacity-80" />
    <X className="w-4 h-4 text-red-400 stroke-[3.5] absolute" />
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
  const t = (translations as any)[language];

  const isHasPrediction = !isAnalyzing && Boolean(predictionId) && path.length > 0;
  const rowIndex = activeOddIndex >= 0 && activeOddIndex < 10 ? activeOddIndex : 0;
  const multiplier = MULTIPLIERS[rowIndex];
  const recommendedCol = path[rowIndex] !== undefined ? path[rowIndex] : -1;
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
        className={`w-full max-w-md flex flex-col items-center gap-3 p-2 relative z-10 transition-all duration-500 ${showSuccessFlash ? "brightness-125 scale-[1.02]" : ""}`}
      >
        {/* Selected Multiplier Header Indicator */}
        <div className="flex items-center justify-between w-full max-w-[300px] px-3 py-1.5 bg-transparent border border-zinc-300 rounded-xl backdrop-blur-md">
          <span className="text-xs text-zinc-600 font-bold">
            {language === "ar" ? "المستوى المحدّد:" : "Current Multiplier:"}
          </span>
          <span
            className="text-sm font-black px-3 py-0.5 rounded-lg bg-transparent border"
            style={{
              color: "var(--primary-color)",
              borderColor: "rgba(var(--primary-color-rgb), 0.5)",
            }}
          >
            {multiplier.label}
          </span>
        </div>

        {/* SINGLE ROW DISPLAY OF 5 ROUND 50x50 CELLS */}
        <motion.div
          key={`single-row-${rowIndex}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center gap-3 w-full max-w-[300px] my-2"
        >
          {Array.from({ length: COLS }).map((_, colIndex) => {
            const isGoodApple = isHasPrediction && rowGrid ? rowGrid[colIndex] : false;
            const isBadApple = isHasPrediction && rowGrid ? !rowGrid[colIndex] : false;

            return (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                style={
                  isGoodApple
                    ? {
                        borderColor: "rgba(var(--primary-color-rgb), 0.5)",
                      }
                    : {}
                }
                className={`w-[50px] h-[50px] rounded-full flex items-center justify-center relative transition-all duration-500 border overflow-hidden shrink-0 ${
                  isGoodApple
                    ? "bg-transparent"
                    : isBadApple
                      ? "bg-transparent border-red-500/50"
                      : "bg-transparent border-zinc-300"
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
                      /* Good Apple */
                      <GoodAppleIcon className="w-7 h-7" />
                    ) : (
                      /* Bad Apple (Rotten icon) */
                      <BadAppleIcon className="w-7 h-7" />
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
                                "rgba(15,23,42,0.08)",
                                "var(--primary-color)",
                                "rgba(15,23,42,0.08)",
                              ],
                            }
                          : {}
                      }
                      transition={{ duration: 1, repeat: Infinity, delay: colIndex * 0.15 }}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        isAnalyzing ? "shadow-[0_0_10px_var(--primary-glow)]" : "bg-zinc-300"
                      }`}
                      style={isAnalyzing ? { backgroundColor: "var(--primary-color)" } : {}}
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
