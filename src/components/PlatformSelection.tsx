import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Shield, Lock, ChevronLeft, Users, Activity, Zap, Radio } from "lucide-react";
import { Platform } from "../types";
import { audioManager } from "../utils/audioManager";
import WinnersDashboard from "./WinnersDashboard";

interface PlatformSelectionProps {
  onSelect: (p: Platform) => void;
  t: any;
}

const MotionButton = motion.button as any;

const PlatformSelection: React.FC<PlatformSelectionProps> = ({ onSelect }) => {
  const [selected, setSelected] = useState<Platform>("bizbet");
  const [isConnecting, setIsConnecting] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(4120);

  const platforms = [
    {
      id: "bizbet" as Platform,
      name: "BIZBET",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh_SHX7efEoJGTNOkFPVFyFdj1MQKfYEF6biEyL8jE_A&s=10",
      tagline: "السيرفر الرسمي المعتمد · دقة خوارزمية فائقة",
      accuracy: "٩٩٪",
      latency: "10ms",
      geo: "سيرفر VIP حصري",
      recommended: true,
    },
  ];

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary-color", "#ff1e38");
    root.style.setProperty("--primary-color-rgb", "255, 30, 56");
    root.style.setProperty("--primary-glow", "rgba(255, 30, 56, 0.55)");
  }, [selected]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.max(3400, Math.min(4200, prev + delta));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (p: Platform) => {
    audioManager.playClick();
    setSelected(p);
  };

  const handleProceed = () => {
    audioManager.playClick();
    setIsConnecting(true);
    setTimeout(() => {
      onSelect(selected);
    }, 600);
  };

  return (
    <div
      dir="rtl"
      className="relative flex flex-col min-h-full font-sans overflow-x-hidden max-w-full text-white px-4 sm:px-6 pt-5 pb-16"
    >
      {/* Background ambient red neon orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 right-0 w-80 h-80 rounded-full bg-red-600/10 blur-[120px]" />
        <div className="absolute top-64 left-0 w-72 h-72 rounded-full bg-[#ff1e38]/10 blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-md mx-auto w-full flex flex-col gap-6">
        {/* Top Status Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
            <Users className="w-3.5 h-3.5 text-[#ff1e38]" />
            <span className="text-[11px] font-bold text-zinc-400">المتصلين الآن:</span>
            <span className="text-xs font-mono font-black text-white tabular-nums">
              {onlineUsers.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] animate-pulse shadow-[0_0_8px_#ff1e38]" />
            <span className="text-[10px] font-black tracking-wider text-[#ff1e38]">مباشر VIP</span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl p-1 bg-gradient-to-b from-white/20 via-red-500/30 to-black shadow-[0_0_25px_rgba(255,30,56,0.35)] border border-white/10 mb-1">
            <img
              src="https://cdn.phototourl.com/member/2026-09-29-c81bf031-27ef-4421-8822-b37c2fb087d4.jpg"
              alt="SMART AI Logo"
              className="w-full h-full object-cover rounded-[22px]"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[#ff1e38] text-[11px] font-black">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>بوابة التوقعات الرسمية</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            اختر المنصة للبدء
          </h1>
          <p className="text-xs text-zinc-400 font-medium max-w-xs mx-auto">
            حدد منصتك المفضلة لتوصيل إشارات الخوارزمية الفورية بدقة 99%
          </p>
        </div>

        {/* Platform Selection Cards */}
        <div className="space-y-3.5">
          {platforms.map((p) => {
            const active = selected === p.id;
            return (
              <MotionButton
                key={p.id}
                type="button"
                onClick={() => handleSelect(p.id)}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                className={`relative w-full text-right rounded-3xl p-4 border transition-all duration-300 cursor-pointer overflow-hidden ${
                  active
                    ? "bg-zinc-900/90 border-[#ff1e38] shadow-[0_0_30px_rgba(255,30,56,0.3)] ring-1 ring-[#ff1e38]/50"
                    : "bg-zinc-950/60 border-white/10 hover:border-white/20 hover:bg-zinc-900/40"
                }`}
              >
                {/* Active Red Highlight Glow */}
                {active && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff1e38]/15 rounded-full blur-2xl pointer-events-none" />
                )}

                <div className="flex items-center gap-4 relative z-10">
                  <div
                    className={`relative w-[68px] h-[68px] shrink-0 rounded-2xl overflow-hidden border-2 bg-black flex items-center justify-center ${
                      active
                        ? "border-[#ff1e38] shadow-[0_0_15px_rgba(255,30,56,0.4)]"
                        : "border-white/10"
                    }`}
                  >
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-lg font-black tracking-tight ${
                          active ? "text-white" : "text-zinc-200"
                        }`}
                      >
                        {p.name}
                      </h3>
                      {p.recommended && (
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-[#ff1e38] border border-red-500/40">
                          موصى به
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5 truncate">{p.tagline}</p>

                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#ff1e38] bg-red-500/10 border border-red-500/25 rounded-lg px-2 py-0.5">
                        <Activity className="w-3 h-3" /> دقة {p.accuracy}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-zinc-300 bg-white/[0.05] border border-white/10 rounded-lg px-2 py-0.5">
                        <Zap className="w-3 h-3 text-[#ff1e38]" /> {p.latency}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
                      active
                        ? "bg-[#ff1e38] border-[#ff1e38] shadow-[0_0_10px_#ff1e38]"
                        : "bg-transparent border-zinc-700"
                    }`}
                  >
                    {active && <Check className="w-3.5 h-3.5 text-white stroke-[4]" />}
                  </div>
                </div>
              </MotionButton>
            );
          })}
        </div>

        {/* Live Winners Ticker */}
        <div className="w-full">
          <WinnersDashboard />
        </div>

        {/* Connection Action Box */}
        <div className="rounded-3xl bg-zinc-950/80 border border-white/10 p-5 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10">
            <span className="text-zinc-400 font-bold">المنصة المحددة:</span>
            <span className="font-black text-white text-sm">
              {platforms.find((p) => p.id === selected)?.name}
            </span>
          </div>

          <button
            onClick={handleProceed}
            disabled={isConnecting}
            className="mt-4 w-full h-14 rounded-2xl bg-gradient-to-r from-[#ff1e38] via-[#e11435] to-[#c70f28] hover:from-[#ff334b] hover:to-[#eb1c3e] text-white font-black text-base flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,30,56,0.5)] active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
          >
            <span>{isConnecting ? "جاري ربط السيرفر..." : "متابعة الشروط والتفعيل"}</span>
            {!isConnecting && <ChevronLeft className="w-5 h-5" />}
          </button>

          <div className="mt-3 flex items-center justify-center gap-6 text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#ff1e38]" />
              <span className="text-[10px] font-bold">حماية مشفّرة 100%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#ff1e38]" />
              <span className="text-[10px] font-bold">سيرفر معتمد فوري</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformSelection;
