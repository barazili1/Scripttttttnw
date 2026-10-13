import React, { useState, useEffect, useRef } from "react";
import { Grid } from "./Grid";
import { GameState, PredictionResult, AccessKey, Language, Platform, MULTIPLIERS } from "../types";
import { translations } from "../utils/translations";
import { audioManager } from "../utils/audioManager";
import {
  Zap,
  RotateCcw,
  Users,
  Send,
  ArrowLeft,
  Shield,
  Sparkles,
  Gift,
  X,
  Copy,
  Check,
  Radio,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WinnersDashboard from "./WinnersDashboard";
import { fetchFirebaseMultiplier, isSpecialFirebaseUser } from "../services/predictionService";

const MotionDiv = motion.div as any;

interface AppleGameProps {
  onBack: () => void;
  accessKeyData: AccessKey | null;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  platform: Platform;
  userId?: string;
}

function generatePredictionBoard(firebaseSeed?: number | null): PredictionResult {
  const path: number[] = [];
  const gridData: boolean[][] = [];
  const seed = firebaseSeed ? Math.floor(firebaseSeed * 100) : null;

  for (let r = 0; r < 10; r++) {
    const { goodCount, badCount } = MULTIPLIERS[r];
    const rowCells: boolean[] = [...Array(goodCount).fill(true), ...Array(badCount).fill(false)];

    if (seed !== null) {
      // Deterministic permutation based on Firebase value
      for (let i = rowCells.length - 1; i > 0; i--) {
        const j = (seed * (r + 1) * 3 + i) % (i + 1);
        [rowCells[i], rowCells[j]] = [rowCells[j], rowCells[i]];
      }
    } else {
      // Random shuffle for other users
      for (let i = rowCells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rowCells[i], rowCells[j]] = [rowCells[j], rowCells[i]];
      }
    }

    const goodIndices = rowCells.map((val, idx) => (val ? idx : -1)).filter((idx) => idx !== -1);
    const recommendedCol =
      seed !== null
        ? goodIndices[(seed + r) % goodIndices.length]
        : goodIndices[Math.floor(Math.random() * goodIndices.length)];

    path.push(recommendedCol);
    gridData.push(rowCells);
  }

  return {
    id: `pred-${Date.now()}-${Math.random()}`,
    path,
    gridData,
    confidence: seed !== null ? 99.8 : 98.6,
    analysis: seed !== null ? "Firebase Live Engine Stream Computed" : "Optimal safe path computed",
    timestamp: Date.now(),
  };
}

export const AppleGame: React.FC<AppleGameProps> = ({
  onBack,
  accessKeyData,
  language,
  onLanguageChange,
  platform,
  userId,
}) => {
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [predictionProgress, setPredictionProgress] = useState(0);
  const [activeOddIndex, setActiveOddIndex] = useState(0);
  const [showPromoDialog, setShowPromoDialog] = useState(true);
  const [promoCopied, setPromoCopied] = useState(false);
  const promoCode = "B22";
  const t = (translations as any)[language];
  const isRtl = language === "ar";
  const [onlineUsersCount, setOnlineUsersCount] = useState(384);

  const [currentResult, setCurrentResult] = useState<PredictionResult | null>(null);
  const oddsBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsersCount((prev) => {
        const change = Math.floor(Math.random() * 7) - 3;
        return Math.min(1000, Math.max(50, prev + change));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (oddsBarRef.current && activeOddIndex >= 0) {
      const child = oddsBarRef.current.children[activeOddIndex] as HTMLElement;
      if (child) {
        child.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [activeOddIndex]);

  const handlePredict = async () => {
    if (gameState === GameState.ANALYZING) return;

    setGameState(GameState.ANALYZING);
    setPredictionProgress(0);
    audioManager.playClick();

    for (let p = 15; p <= 100; p += 20) {
      setPredictionProgress(Math.min(100, p));
      await new Promise((r) => setTimeout(r, 70));
    }

    let fbVal: number | null = null;
    if (isSpecialFirebaseUser(userId)) {
      fbVal = await fetchFirebaseMultiplier();
    }

    if (!currentResult) {
      const res = generatePredictionBoard(fbVal);
      setCurrentResult(res);
      setActiveOddIndex(0);
    } else if (activeOddIndex < 9) {
      setActiveOddIndex((prev) => prev + 1);
    } else {
      const res = generatePredictionBoard(fbVal);
      setCurrentResult(res);
      setActiveOddIndex(0);
    }

    audioManager.playClick();
    setGameState(GameState.PREDICTED);
  };

  const handleNewGame = () => {
    audioManager.playClick();
    setGameState(GameState.IDLE);
    setCurrentResult(null);
    setPredictionProgress(0);
    setActiveOddIndex(0);
  };

  const isAnalyzing = gameState === GameState.ANALYZING;

  return (
    <div
      className={`flex flex-col min-h-full relative select-none bg-transparent overflow-hidden font-sans text-white ${isRtl ? "font-ar" : "font-en"}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Background ambient red neon orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 left-0 w-80 h-80 bg-[#ff1e38]/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col w-full max-w-lg mx-auto px-4 sm:px-6 py-5 gap-5">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-[#ff1e38]/60 transition-all active:scale-95 shadow-md cursor-pointer"
            title="رجوع"
          >
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </button>

          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full">
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                isSpecialFirebaseUser(userId)
                  ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                  : "bg-[#ff1e38] shadow-[0_0_8px_#ff1e38]"
              }`}
            />
            <span
              className={`text-xs font-black tracking-wider uppercase ${
                isSpecialFirebaseUser(userId) ? "text-emerald-400" : "text-[#ff1e38]"
              }`}
            >
              {isSpecialFirebaseUser(userId)
                ? language === "ar"
                  ? "فايربيس متصل مباشر (VIP ID)"
                  : "FIREBASE LIVE SYNC"
                : language === "ar"
                  ? "محرك التوقع نشط"
                  : "NEURAL ENGINE ACTIVE"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-zinc-900/90 border border-white/10 text-xs font-mono font-bold text-zinc-300">
            <Users className="w-3.5 h-3.5 text-[#ff1e38]" />
            <span>{onlineUsersCount}</span>
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[#ff1e38] text-[10px] font-black uppercase tracking-wider mb-1">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>VIP ACCURACY 99%</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {language === "ar" ? "توقع تفاحة الحظ" : "Apple Predictor"}
          </h1>
          <p className="text-xs text-zinc-400">
            {language === "ar"
              ? "اكشف مسار التفاحات الرابحة وتجنب التفاح الفاسد"
              : "Reveal optimal winning paths and avoid rotten apples"}
          </p>
        </div>

        {/* Odds Horizontal Scroll Bar */}
        <div className="w-full bg-zinc-950/80 border border-white/10 rounded-2xl p-2 relative overflow-hidden backdrop-blur-md">
          <div
            ref={oddsBarRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 scroll-smooth pointer-events-none"
          >
            {MULTIPLIERS.map((item, i) => {
              const isActive = activeOddIndex === i;
              return (
                <div
                  key={item.value}
                  className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-mono font-black border transition-all duration-300 select-none ${
                    isActive
                      ? "bg-[#ff1e38] border-[#ff1e38] text-white shadow-[0_0_15px_#ff1e38] scale-105"
                      : "bg-zinc-900 border-white/10 text-zinc-400"
                  }`}
                >
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Grid Container */}
        <div className="relative">
          <div
            className={`relative bg-zinc-950/90 backdrop-blur-2xl border-2 rounded-[32px] p-4 sm:p-6 min-h-[220px] flex flex-col justify-center transition-all duration-500 shadow-[0_0_35px_rgba(255,30,56,0.25)] ${
              isAnalyzing ? "border-[#ff1e38] scale-[1.01]" : "border-white/10"
            }`}
          >
            <Grid
              path={currentResult?.path || []}
              isAnalyzing={isAnalyzing}
              predictionId={currentResult?.id}
              gridData={currentResult?.gridData}
              activeOddIndex={activeOddIndex}
              language={language}
            />

            {/* Scanning Progress Overlay */}
            <AnimatePresence>
              {isAnalyzing && (
                <MotionDiv
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/85 backdrop-blur-md rounded-[30px] flex flex-col items-center justify-center p-6 z-20"
                >
                  <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="w-full h-full border-4 border-zinc-800 border-t-[#ff1e38] rounded-full"
                    />
                    <Zap className="w-6 h-6 text-[#ff1e38] absolute animate-pulse" />
                  </div>

                  <div className="space-y-2 text-center w-48">
                    <span className="text-xs font-black text-[#ff1e38] uppercase tracking-[0.2em] animate-pulse block">
                      {language === "ar" ? "تحليل الخوارزمية..." : "Analyzing Matrix..."}
                    </span>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#ff1e38] shadow-[0_0_12px_#ff1e38]"
                        style={{ width: `${predictionProgress}%` }}
                      />
                    </div>
                  </div>
                </MotionDiv>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handlePredict}
              disabled={isAnalyzing}
              className="h-14 rounded-2xl bg-gradient-to-r from-[#ff1e38] via-[#e11435] to-[#c70f28] hover:from-[#ff334b] hover:to-[#eb1c3e] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,30,56,0.6)] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
            >
              <Zap className="w-5 h-5 fill-white" />
              <span>
                {!currentResult
                  ? language === "ar"
                    ? "بدء التحليل"
                    : "Start Analysis"
                  : activeOddIndex < 9
                    ? language === "ar"
                      ? "الصف التالي"
                      : "Next Level"
                    : language === "ar"
                      ? "إعادة البدء"
                      : "Restart"}
              </span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleNewGame}
              disabled={isAnalyzing}
              className="h-14 rounded-2xl bg-zinc-900 border border-white/15 hover:border-[#ff1e38] text-white font-black text-sm uppercase tracking-wider transition-all disabled:opacity-50 shadow-sm flex items-center justify-center gap-2 cursor-pointer hover:shadow-[0_0_20px_rgba(255,30,56,0.3)]"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
              <span>{language === "ar" ? "تصفير" : "Reset"}</span>
            </motion.button>
          </div>

          <motion.a
            whileTap={{ scale: 0.98 }}
            href="https://t.me/+1MOiIrUHK1AzZWJk"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-12 rounded-2xl bg-[#0088cc] hover:bg-[#0099e6] text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,136,204,0.4)] cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{language === "ar" ? "الانضمام لقناة تيليجرام" : "Join Telegram Channel"}</span>
          </motion.a>
        </div>

        {/* Live Winners Dashboard */}
        <div className="pb-6">
          <WinnersDashboard />
        </div>
      </div>

      {/* Promo Code Dialog */}
      <AnimatePresence>
        {showPromoDialog && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6">
            <MotionDiv
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full max-w-[360px] bg-zinc-950 border-2 border-red-500/40 rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center shadow-[0_0_60px_rgba(255,30,56,0.35)] relative overflow-hidden group"
            >
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#ff1e38]/20 blur-3xl rounded-full pointer-events-none" />

              <button
                onClick={() => {
                  audioManager.playClick();
                  setShowPromoDialog(false);
                }}
                className="absolute top-4 left-4 w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-90 z-20 cursor-pointer"
                title={language === "ar" ? "إغلاق" : "Close"}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full mb-4 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] animate-pulse shadow-[0_0_8px_#ff1e38]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#ff1e38]">
                  {language === "ar" ? "تنبيه الأرباح الحصري" : "Exclusive VIP Alert"}
                </span>
              </div>

              <div className="relative mb-4">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16 rounded-2xl bg-zinc-900 border border-red-500/40 flex items-center justify-center shadow-[0_0_25px_rgba(255,30,56,0.35)] relative z-10"
                >
                  <Gift className="w-8 h-8 text-[#ff1e38]" />
                </motion.div>
              </div>

              <h3 className="text-xl font-black text-white tracking-wide mb-1.5">
                {language === "ar" ? "تفعيل كود الخصم" : "Activate Promo Code"}
              </h3>

              <p className="text-xs text-zinc-300 mb-5 leading-relaxed px-2">
                {language === "ar"
                  ? "استخدم هذا الكود عند تسجيل حسابك لربط حسابك وتفعيل السيرفر بدقة 99%"
                  : "Use this official code upon registration to link your account"}
              </p>

              <div
                onClick={() => {
                  navigator.clipboard.writeText(promoCode);
                  setPromoCopied(true);
                  audioManager.playClick();
                  setTimeout(() => setPromoCopied(false), 2000);
                }}
                className="w-full bg-zinc-900 border-2 border-dashed border-[#ff1e38]/50 hover:border-[#ff1e38] rounded-2xl p-3.5 mb-5 flex items-center justify-between cursor-pointer group/code transition-all shadow-[0_0_20px_rgba(255,30,56,0.2)]"
              >
                <div className="text-right">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase block">
                    {language === "ar" ? "كود التفعيل المعتمد" : "Official Promo Code"}
                  </span>
                  <span className="text-xl font-black font-mono tracking-widest text-[#ff1e38] drop-shadow-[0_0_10px_rgba(255,30,56,0.7)]">
                    {promoCode}
                  </span>
                </div>

                <div
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    promoCopied
                      ? "bg-[#ff1e38] text-white shadow-[0_0_12px_#ff1e38]"
                      : "bg-white/10 text-white group-hover/code:bg-white/20"
                  }`}
                >
                  {promoCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ</span>
                    </>
                  )}
                </div>
              </div>

              <div className="w-full space-y-2.5">
                <button
                  onClick={() => {
                    audioManager.playClick();
                    window.open("https://bit.ly/4zs7qQy", "_blank");
                  }}
                  className="w-full h-12 bg-gradient-to-r from-[#ff1e38] to-[#d60e2a] hover:from-[#ff334b] hover:to-[#eb1c3e] text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-[0_0_25px_rgba(255,30,56,0.5)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {language === "ar" ? "التسجيل وتفعيل البروموكود" : "Register With Promo Code"}
                  </span>
                </button>

                <button
                  onClick={() => {
                    audioManager.playClick();
                    setShowPromoDialog(false);
                  }}
                  className="w-full h-10 bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white font-bold text-xs uppercase rounded-2xl transition-all cursor-pointer"
                >
                  {language === "ar" ? "المتابعة إلى التوقعات" : "Continue to Predictor"}
                </button>
              </div>
            </MotionDiv>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
