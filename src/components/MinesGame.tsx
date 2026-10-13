import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Bomb,
  Gem,
  ShieldCheck,
  Radio,
} from "lucide-react";
import { Platform } from "../types";
import { audioManager } from "../utils/audioManager";
import diamondImg from "../assets/diamond.png";
import { fetchFirebaseMultiplier, isSpecialFirebaseUser } from "../services/predictionService";

interface MinesGameProps {
  onBack: () => void;
  userId: string;
  platform: Platform;
  t: any;
}

const TOTAL_CELLS = 25;

export const MinesGame: React.FC<MinesGameProps> = ({ onBack, userId, platform }) => {
  const platformName =
    platform === "bizbet" ? "BIZBET" : platform === "linebet_v1" ? "Greenbet" : "Paripulse";
  const [count, setCount] = useState<number>(3);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [onlineCount, setOnlineCount] = useState<number>(3480);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.max(3100, Math.min(3900, prev + delta));
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    if (isRunning) return;
    audioManager.playPredict();
    setIsRunning(true);
    setRevealed([]);

    const safeSlotsCount = count === 1 ? 5 : count === 3 ? 4 : count === 5 ? 3 : 2;
    const selected: number[] = [];
    const isSpecial = isSpecialFirebaseUser(userId);

    if (isSpecial) {
      const fbVal = await fetchFirebaseMultiplier();
      const seed = fbVal ? Math.floor(fbVal * 100) : 1049;
      // Deterministic calculation from Firebase value
      let step = (seed % 19) + 1;
      let curr = (seed * 7) % TOTAL_CELLS;
      while (selected.length < safeSlotsCount) {
        if (!selected.includes(curr)) selected.push(curr);
        curr = (curr + step) % TOTAL_CELLS;
        step += 2;
      }
    } else {
      // Random generation for other IDs
      while (selected.length < safeSlotsCount) {
        const idx = Math.floor(Math.random() * TOTAL_CELLS);
        if (!selected.includes(idx)) selected.push(idx);
      }
    }

    selected.forEach((cellIdx, i) => {
      setTimeout(
        () => {
          setRevealed((prev) => [...prev, cellIdx]);
          audioManager.playClick();
          if (i === selected.length - 1) {
            setIsRunning(false);
            audioManager.playSuccess();
          }
        },
        (i + 1) * 320,
      );
    });
  };

  const handleRestart = () => {
    audioManager.playClick();
    setRevealed([]);
    setIsRunning(false);
  };

  return (
    <div
      className="flex flex-col min-h-full bg-transparent font-sans text-white selection:bg-red-500/40 relative overflow-x-hidden"
      dir="rtl"
    >
      <div className="relative z-10 flex flex-col px-4 sm:px-6 pt-5 pb-16 max-w-md mx-auto w-full gap-5">
        {/* Luxury Top Bar */}
        <div className="flex items-center justify-between p-3.5 bg-zinc-950/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-[#ff1e38]/60 transition-all active:scale-95 shadow-md cursor-pointer"
            title="رجوع"
          >
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600/30 to-black border border-red-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(255,30,56,0.3)]">
              <Gem className="w-5 h-5 text-[#ff1e38]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-black text-white tracking-wide">GAMS MINES</h1>
                <span className="text-[9px] font-black uppercase text-[#ff1e38] bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/30">
                  {platformName}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-bold flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 text-[#ff1e38] animate-pulse" /> كاشف الألماس الآمن
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full shadow-[0_0_10px_rgba(255,30,56,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] animate-ping" />
            <span className="text-[10px] font-black uppercase text-[#ff1e38]">VIP LIVE</span>
          </div>
        </div>

        {/* Online Count & User ID Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 bg-zinc-950/80 border border-white/10 rounded-3xl flex items-center gap-3 backdrop-blur-2xl shadow-lg">
            <div className="w-9 h-9 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-[#ff1e38]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                المتصلين الآن
              </span>
              <span className="text-sm font-black font-mono text-white tabular-nums">
                {onlineCount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-zinc-950/80 border border-white/10 rounded-3xl flex items-center gap-3 backdrop-blur-2xl shadow-lg">
            <div className="w-9 h-9 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-[#ff1e38]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1">
                معرف الحساب
                {isSpecialFirebaseUser(userId) && (
                  <span className="text-[8px] text-emerald-400 font-black bg-emerald-500/15 px-1 rounded">
                    FIREBASE
                  </span>
                )}
              </span>
              <span
                className={`text-xs font-black font-mono truncate ${
                  isSpecialFirebaseUser(userId)
                    ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                    : "text-[#ff1e38] drop-shadow-[0_0_8px_rgba(255,30,56,0.4)]"
                }`}
              >
                {userId || "1234567890"}
              </span>
            </div>
          </div>
        </div>

        {/* Mine Selector Panel */}
        <div className="p-4 rounded-3xl bg-zinc-950/85 border border-white/10 backdrop-blur-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-zinc-200 font-bold flex items-center gap-1.5">
              <Bomb className="w-4 h-4 text-[#ff1e38]" /> حدد كثافة الألغام:
            </span>
            <span className="text-[#ff1e38] font-black text-sm font-mono bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/30">
              {count} ألغام
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {[1, 3, 5, 7].map((num) => {
              const active = count === num;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    audioManager.playClick();
                    setCount(num);
                    setRevealed([]);
                  }}
                  className={`py-2.5 rounded-2xl text-xs font-black font-mono transition-all duration-300 cursor-pointer ${
                    active
                      ? "bg-gradient-to-r from-[#ff1e38] to-[#d60e2a] text-white shadow-[0_0_18px_rgba(255,30,56,0.7)] scale-105 border border-red-400"
                      : "bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  {num} ألغام
                </button>
              );
            })}
          </div>
        </div>

        {/* 5x5 Mines Vault Grid */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-b from-[#ff1e38]/30 via-transparent to-[#ff1e38]/20 rounded-[38px] blur-sm pointer-events-none" />

          <div className="relative rounded-[36px] bg-zinc-950/90 border-2 border-[#ff1e38] p-5 sm:p-6 backdrop-blur-3xl shadow-[0_0_45px_rgba(255,30,56,0.35)]">
            <div className="grid grid-cols-5 gap-2.5 sm:gap-3" dir="ltr">
              {Array.from({ length: TOTAL_CELLS }).map((_, idx) => {
                const isRevealed = revealed.includes(idx);
                return (
                  <motion.div
                    key={idx}
                    animate={isRevealed ? { scale: [0.9, 1.15, 1], rotate: [0, 4, 0] } : {}}
                    transition={{ duration: 0.35 }}
                    className={`aspect-square rounded-2xl flex items-center justify-center relative overflow-hidden transition-all duration-300 select-none shadow-md ${
                      isRevealed
                        ? "bg-gradient-to-br from-red-950/90 via-black to-zinc-950 border-2 border-[#ff1e38] shadow-[0_0_25px_rgba(255,30,56,0.8)]"
                        : "bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 hover:border-red-500/40"
                    }`}
                  >
                    <AnimatePresence>
                      {isRevealed ? (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0 }}
                          className="w-full h-full p-2 flex items-center justify-center relative"
                        >
                          <img
                            src={diamondImg}
                            alt="Diamond"
                            className="w-full h-full object-contain filter drop-shadow-[0_0_12px_#ff1e38]"
                          />
                          <span className="absolute inset-0 bg-[#ff1e38]/20 animate-pulse pointer-events-none" />
                        </motion.div>
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3.5">
          <button
            onClick={handleStart}
            disabled={isRunning}
            className={`w-full py-4 px-4 bg-gradient-to-r from-[#ff1e38] via-[#e11435] to-[#c70f28] hover:from-[#ff334b] hover:to-[#eb1c3e] text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-[0_0_30px_rgba(255,30,56,0.65)] flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isRunning ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isRunning ? "كشف الألماس..." : "START"}</span>
          </button>

          <button
            onClick={handleRestart}
            disabled={isRunning}
            className="w-full py-4 px-4 bg-zinc-950/80 border border-white/15 hover:border-[#ff1e38] text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer hover:shadow-[0_0_20px_rgba(255,30,56,0.3)] backdrop-blur-xl"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>RESTART</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MinesGame;
