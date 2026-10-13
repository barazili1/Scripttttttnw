import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Language } from "../utils/translations";
import { ShieldCheck, Zap, Sparkles } from "lucide-react";
import { SITE_LOGO_URL } from "../services/predictionService";

const MotionDiv = motion.div as any;

interface SplashScreenProps {
  onComplete: () => void;
  language?: Language;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, language = "en" }) => {
  const [progress, setProgress] = useState(0);
  const [exit, setExit] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const duration = 4000;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      const calculatedProgress = Math.min((elapsed / duration) * 100, 100);

      setProgress(calculatedProgress);

      if (calculatedProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => setExit(true), 500);
        setTimeout(() => {
          onCompleteRef.current();
        }, 1200);
      }
    }, 30);

    return () => clearInterval(timer);
  }, []);

  const isArabic = language === "ar";
  const logoUrl = SITE_LOGO_URL;

  const loadingSteps = isArabic
    ? ["تأمين الاتصال...", "مزامنة البيانات...", "تحسين الأداء...", "النظام جاهز"]
    : ["SECURING CONNECTION...", "SYNCING DATA...", "OPTIMIZING PERFORMANCE...", "SYSTEM READY"];

  const currentStep = Math.min(
    Math.floor((progress / 100) * loadingSteps.length),
    loadingSteps.length - 1,
  );

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out 
      bg-[#050505] overflow-hidden
      ${exit ? "opacity-0 scale-105" : "opacity-100 scale-100"} 
      ${isArabic ? "font-ar" : ""}`}
    >
      {/* Background Ambient Red Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-red-600/15 blur-[130px] rounded-full animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-[#ff1e38]/20 blur-[130px] rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-[30%] left-[40%] w-[25%] h-[25%] bg-red-500/15 blur-[90px] rounded-full" />
      </div>

      {/* Central Content */}
      <div className="relative z-10 flex flex-col items-center w-full px-6">
        <MotionDiv
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
          className="relative mb-10"
        >
          {/* Logo Red Aura */}
          <div className="absolute -inset-10 bg-gradient-to-tr from-[#ff1e38]/40 to-red-600/25 blur-[60px] rounded-full animate-pulse" />

          {/* Rotating Border */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border border-[#ff1e38]/40 rounded-[3rem]"
          />

          {/* Logo Container */}
          <div className="relative w-52 h-52 sm:w-56 sm:h-56 rounded-[2.5rem] overflow-hidden border-2 border-[#ff1e38] bg-black shadow-[0_0_50px_rgba(255,30,56,0.45)]">
            <img src={logoUrl} className="w-full h-full object-cover" alt="SCRIPT AI Logo" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Shimmer Effect */}
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/25 to-transparent skew-x-12"
            />
          </div>

          {/* Floating Status Icons */}
          <MotionDiv
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-zinc-950/95 backdrop-blur-xl border border-[#ff1e38]/50 flex items-center justify-center shadow-[0_0_20px_rgba(255,30,56,0.4)]"
          >
            <ShieldCheck className="w-6 h-6 text-[#ff1e38]" />
          </MotionDiv>

          <MotionDiv
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-4 -left-4 w-12 h-12 rounded-2xl bg-zinc-950/95 backdrop-blur-xl border border-[#ff1e38]/50 flex items-center justify-center shadow-[0_0_20px_rgba(255,30,56,0.4)]"
          >
            <Zap className="w-6 h-6 text-[#ff1e38]" />
          </MotionDiv>
        </MotionDiv>

        {/* Brand Name */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-1.5"
          >
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-[0.2em] uppercase">
              SCRIPT{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff1e38] to-[#ff4d61] drop-shadow-[0_0_20px_rgba(255,30,56,0.8)]">
                AI
              </span>
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#ff1e38]/60" />
              <Sparkles className="w-3.5 h-3.5 text-[#ff1e38] animate-pulse" />
              <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#ff1e38]/60" />
            </div>
          </motion.div>

          {/* Status Text */}
          <div className="h-6">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentStep}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-[11px] font-black text-[#ff1e38] uppercase tracking-[0.25em]"
              >
                {loadingSteps[currentStep]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="absolute bottom-16 sm:bottom-20 w-full max-w-[280px] space-y-3.5 z-10">
        <div className="flex justify-between items-center px-1 text-[10px] font-black">
          <span className="text-zinc-400 uppercase tracking-widest">
            {isArabic ? "تحميل النظام" : "System Load"}
          </span>
          <span className="text-[#ff1e38] font-mono tabular-nums">{Math.round(progress)}%</span>
        </div>

        <div className="relative h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/10 p-[1px]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#ff1e38] via-[#e11435] to-[#ff4d61] shadow-[0_0_20px_rgba(255,30,56,0.85)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Bottom Decorative Elements */}
        <div className="flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: progress > (i + 1) * 20 ? 1 : 0.2,
                scale: progress > (i + 1) * 20 ? 1.2 : 1,
              }}
              className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] shadow-[0_0_8px_#ff1e38]"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
