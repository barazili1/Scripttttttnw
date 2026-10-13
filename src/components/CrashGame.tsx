import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Users,
  User,
  History,
  Play,
  RotateCcw,
  Sparkles,
  Plane,
  Flame,
  Radio,
  Gauge,
  Activity,
  ShieldAlert,
} from "lucide-react";
import { Platform } from "../types";
import { audioManager } from "../utils/audioManager";
import {
  fetchFirebaseMultiplier,
  isSpecialFirebaseUser,
  TARGET_FIREBASE_ID,
} from "../services/predictionService";

interface CrashGameProps {
  onBack: () => void;
  userId: string;
  platform: Platform;
  t: any;
}

const MotionDiv = motion.div as any;

export const CrashGame: React.FC<CrashGameProps> = ({ onBack, userId, platform }) => {
  const [currentValue, setCurrentValue] = useState<string>("0.00x");
  const [history, setHistory] = useState<string[]>([
    "2.85x",
    "1.42x",
    "5.15x",
    "1.98x",
    "3.60x",
    "8.40x",
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [onlineCount, setOnlineCount] = useState<number>(3640);
  const [flying, setFlying] = useState<boolean>(false);
  const [flightKey, setFlightKey] = useState<number>(0);
  const [altitude, setAltitude] = useState<number>(100);

  const platformName =
    platform === "bizbet" ? "BIZBET" : platform === "linebet_v1" ? "Greenbet" : "Paripulse";

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.max(3200, Math.min(4100, prev + delta));
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const getRandomMultiplier = (): number => {
    const rand = Math.random();
    if (rand < 0.4) {
      return parseFloat((Math.random() * (2.8 - 1.4) + 1.4).toFixed(2));
    } else if (rand < 0.75) {
      return parseFloat((Math.random() * (6.0 - 2.8) + 2.8).toFixed(2));
    } else {
      return parseFloat((Math.random() * (15.0 - 6.0) + 6.0).toFixed(2));
    }
  };

  const handleStart = async () => {
    if (isAnalyzing) return;
    audioManager.playPredict();
    setIsAnalyzing(true);
    setFlying(true);
    setFlightKey((prev) => prev + 1);

    let target = 2.0;
    const isSpecial = isSpecialFirebaseUser(userId);

    if (isSpecial) {
      const fbVal = await fetchFirebaseMultiplier();
      if (fbVal !== null && fbVal > 1.0) {
        target = parseFloat(fbVal.toFixed(2));
      } else {
        target = getRandomMultiplier();
      }
    } else {
      // Any other ID receives random prediction
      target = getRandomMultiplier();
    }

    let current = 1.0;
    const duration = 2500;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = Math.pow(progress, 2.2);
      current = 1.0 + (target - 1.0) * eased;
      setCurrentValue(current.toFixed(2) + "x");
      setAltitude(Math.floor(current * 120));

      if (progress >= 1) {
        clearInterval(interval);
        const finalVal = target.toFixed(2) + "x";
        setCurrentValue(finalVal);
        setIsAnalyzing(false);
        setFlying(false);
        audioManager.playSuccess();
        setHistory((prev) => [finalVal, ...prev.slice(0, 6)]);
      }
    }, 35);
  };

  const handleRestart = () => {
    audioManager.playClick();
    setCurrentValue("0.00x");
    setIsAnalyzing(false);
    setFlying(false);
    setAltitude(100);
  };

  return (
    <div
      className="flex flex-col min-h-full bg-transparent font-sans text-white selection:bg-red-500/40 relative overflow-x-hidden"
      dir="rtl"
    >
      <div className="relative z-10 flex flex-col px-4 sm:px-6 pt-5 pb-16 max-w-md mx-auto w-full gap-5">
        {/* Luxury Cockpit Top Bar */}
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
              <Plane className="w-5 h-5 text-[#ff1e38] -rotate-45" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-black text-white tracking-wide">CRASH AVIATOR</h1>
                <span className="text-[9px] font-black uppercase text-[#ff1e38] bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/30">
                  {platformName}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-bold flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 text-[#ff1e38] animate-pulse" /> رادار التنبؤ العصبي
                المباشر
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full shadow-[0_0_10px_rgba(255,30,56,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] animate-ping" />
            <span className="text-[10px] font-black uppercase text-[#ff1e38]">VIP LIVE</span>
          </div>
        </div>

        {/* Telemetry Status Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 bg-zinc-950/80 border border-white/10 rounded-3xl flex items-center gap-3 backdrop-blur-2xl shadow-lg">
            <div className="w-9 h-9 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-[#ff1e38]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                المتصلين بالسيرفر
              </span>
              <span className="text-sm font-black font-mono text-white truncate tabular-nums">
                {onlineCount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-zinc-950/80 border border-white/10 rounded-3xl flex items-center gap-3 backdrop-blur-2xl shadow-lg">
            <div className="w-9 h-9 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-[#ff1e38]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1">
                معرّف الحساب (ID)
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

        {/* History Multiplier Chips */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1 text-xs font-black text-zinc-300">
            <div className="flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-[#ff1e38]" />
              <span>آخر إشارات السيرفر:</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">LIVE FEED</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <AnimatePresence>
              {history.map((item, idx) => {
                const val = parseFloat(item);
                const isHigh = val >= 3.0;
                return (
                  <MotionDiv
                    key={idx + "-" + item}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className={`shrink-0 px-3.5 py-1.5 rounded-2xl text-xs font-mono font-black border transition-all ${
                      idx === 0
                        ? "bg-gradient-to-r from-red-600/30 to-[#ff1e38]/20 border-[#ff1e38] text-white shadow-[0_0_20px_rgba(255,30,56,0.5)] scale-105"
                        : isHigh
                          ? "bg-red-500/10 border-red-500/30 text-[#ff1e38]"
                          : "bg-zinc-950/80 border-white/10 text-zinc-300"
                    }`}
                  >
                    {item}
                  </MotionDiv>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Grand Cockpit Radar Arena */}
        <div className="relative">
          {/* Subtle Outer Neon Laser Ring */}
          <div className="absolute -inset-1 bg-gradient-to-b from-[#ff1e38]/40 via-transparent to-[#ff1e38]/30 rounded-[38px] blur-sm pointer-events-none" />

          <div className="relative w-full bg-zinc-950/90 backdrop-blur-3xl border-2 border-[#ff1e38] rounded-[36px] p-7 sm:p-9 flex flex-col items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(255,30,56,0.35)] min-h-[250px]">
            {/* Cybernetic HUD Crosshairs & Grid */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255, 30, 56, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 30, 56, 0.4) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />

            {/* Radar Circular Sweep */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <div className="w-56 h-56 rounded-full border border-[#ff1e38] animate-ping" />
              <div className="w-36 h-36 rounded-full border border-[#ff1e38]" />
            </div>

            {/* Animated Flight Path Line */}
            {flying && (
              <svg
                key={`svg-${flightKey}`}
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 400 240"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="crashLaserGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff1e38" stopOpacity="0.1" />
                    <stop offset="60%" stopColor="#ff1e38" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <path
                  d="M 30 205 Q 160 190 365 45"
                  fill="none"
                  stroke="url(#crashLaserGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_10px_#ff1e38]"
                />
              </svg>
            )}

            {/* Supersonic Jet Indicator with Flame */}
            {flying && (
              <MotionDiv
                key={`jet-${flightKey}`}
                initial={{ left: "8%", top: "85%", scale: 0.8 }}
                animate={{
                  left: ["8%", "35%", "70%", "88%"],
                  top: ["85%", "68%", "38%", "18%"],
                  scale: [0.8, 1, 1.15, 1.25],
                  rotate: [-32, -40, -48, -55],
                }}
                transition={{
                  duration: 2.5,
                  ease: "easeInOut",
                  times: [0, 0.35, 0.7, 1],
                }}
                className="absolute pointer-events-none z-20 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="relative">
                  <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-red-600 to-[#ff1e38] flex items-center justify-center shadow-[0_0_30px_#ff1e38] border border-white">
                    <Plane className="w-6 h-6 text-white stroke-[2.5]" />
                  </div>
                  <span className="absolute -bottom-2 -left-2 w-4 h-4 bg-white rounded-full animate-ping" />
                  <Flame className="w-4 h-4 text-amber-300 absolute -bottom-3 -left-3 rotate-45 animate-pulse" />
                </div>
              </MotionDiv>
            )}

            {/* Top Badge inside Arena */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-red-500/15 border border-red-500/40 rounded-full mb-3 relative z-10 shadow-[0_0_12px_rgba(255,30,56,0.3)]">
              <Sparkles className="w-3.5 h-3.5 text-[#ff1e38]" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">
                {isAnalyzing ? "معايرة نقطة الانفجار..." : "إشارة الطائرة التالية"}
              </span>
            </div>

            {/* Huge Multiplier Metric */}
            <AnimatePresence mode="wait">
              <MotionDiv
                key={currentValue}
                initial={{ scale: 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.12 }}
                className="text-6xl sm:text-7xl font-mono font-black tracking-tighter drop-shadow-[0_0_40px_rgba(255,30,56,0.9)] relative z-10 select-none"
                style={{
                  color: currentValue !== "0.00x" ? "#ff1e38" : "#ffffff",
                }}
              >
                {currentValue}
              </MotionDiv>
            </AnimatePresence>

            {/* Live Telemetry altitude label */}
            <div className="flex items-center gap-4 mt-3 text-[10px] font-mono text-zinc-400 relative z-10">
              <span className="flex items-center gap-1">
                <Gauge className="w-3 h-3 text-[#ff1e38]" /> ALT: {altitude}m
              </span>
              <span className="text-zinc-600">|</span>
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-[#ff1e38]" /> STATUS:{" "}
                {isAnalyzing ? "SCANNING" : "LOCKED"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-3.5">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleStart}
            disabled={isAnalyzing}
            className={`w-full py-4 px-4 bg-gradient-to-r from-[#ff1e38] via-[#e11435] to-[#c70f28] hover:from-[#ff334b] hover:to-[#eb1c3e] text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-[0_0_30px_rgba(255,30,56,0.65)] flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isAnalyzing ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isAnalyzing ? "جاري التحليل..." : "START"}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleRestart}
            disabled={isAnalyzing}
            className="w-full py-4 px-4 bg-zinc-950/80 border border-white/15 hover:border-[#ff1e38] text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer hover:shadow-[0_0_20px_rgba(255,30,56,0.3)] backdrop-blur-xl"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>RESTART</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CrashGame;
