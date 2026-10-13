import React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  UserCheck,
  ShieldCheck,
  Gamepad2,
  ChevronLeft,
  Sparkles,
  Flame,
} from "lucide-react";
import { SelectedGame, Platform } from "../types";
import appleLogo from "../assets/game-apple.png";
import crashLogo from "../assets/game-crash.png";
import diamondLogo from "../assets/diamond.png";
import { audioManager } from "../utils/audioManager";
import { isSpecialFirebaseUser } from "../services/predictionService";

interface GameSelectionProps {
  onSelectGame: (game: SelectedGame) => void;
  onBack: () => void;
  userId: string;
  platform: Platform;
  t: any;
}

const MotionDiv = motion.div as any;

const GameSelection: React.FC<GameSelectionProps> = ({
  onSelectGame,
  onBack,
  userId,
  platform,
}) => {
  const platformName =
    platform === "bizbet" ? "BIZBET" : platform === "linebet_v1" ? "Greenbet" : "Paripulse";

  const games = [
    {
      id: "apple" as SelectedGame,
      title: "Apple of Fortune",
      subtitle: "تفاحة الحظ",
      desc: "توقعات الصفوف الآمنة بدقة خوارزمية 99% ونسب أرباح مضاعفة",
      img: appleLogo,
      badge: "الأكثر ربحاً",
      accuracy: "99%",
      hot: true,
    },
    {
      id: "crash" as SelectedGame,
      title: "Crash Aviator",
      subtitle: "لعبة الطائرة",
      desc: "تحليل نقطة انفجار الطائرة المباشرة والضربات المرتفعة",
      img: crashLogo,
      badge: "إشارات فورية",
      accuracy: "98%",
      hot: true,
    },
    {
      id: "mines" as SelectedGame,
      title: "Gams Mines",
      subtitle: "لعبة الألغام والألماس",
      desc: "كشف خلايا الألماس الصافية بدقة مطلقة مع تجنب القنابل",
      img: diamondLogo,
      badge: "تحديث فوري",
      accuracy: "99%",
      hot: false,
    },
  ];

  return (
    <div
      className="flex flex-col min-h-full bg-transparent font-sans text-white selection:bg-red-500/40 relative overflow-x-hidden"
      dir="rtl"
    >
      {/* Background ambient red glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 left-0 w-80 h-80 bg-[#ff1e38]/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 flex flex-col px-4 sm:px-6 pt-5 pb-16 max-w-md mx-auto w-full gap-5">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-[#ff1e38]/60 transition-all active:scale-95 shadow-md cursor-pointer"
            title="رجوع"
          >
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-white/15">
              <img
                src="https://cdn.phototourl.com/member/2026-09-29-c81bf031-27ef-4421-8822-b37c2fb087d4.jpg"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#ff1e38] animate-pulse shadow-[0_0_8px_#ff1e38]" />
              <span className="text-xs font-black tracking-wider uppercase text-[#ff1e38]">
                {platformName} VIP SERVER
              </span>
            </div>
          </div>
        </div>

        {/* User Status Bar */}
        {userId && (
          <div className="p-3.5 bg-zinc-950/80 border border-white/10 rounded-2xl flex items-center justify-between backdrop-blur-xl shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-[#ff1e38]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  الحساب المعتمد
                </span>
                <span className="text-xs font-mono font-bold text-white tracking-wider">
                  ID: {userId}
                </span>
              </div>
            </div>
            {isSpecialFirebaseUser(userId) ? (
              <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30 shadow-[0_0_12px_rgba(52,211,153,0.3)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>فايربيس متصل مباشر</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[10px] font-black text-[#ff1e38] bg-red-500/10 px-3 py-1 rounded-full border border-red-500/25">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>مفعّل ومضمون</span>
              </div>
            )}
          </div>
        )}

        {/* Main Title Section */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-zinc-300 text-xs font-bold mb-1">
            <Gamepad2 className="w-3.5 h-3.5 text-[#ff1e38]" />
            <span>محركات التنبؤ المباشرة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            اختر اللعبة للبدء
          </h1>
          <p className="text-xs text-zinc-400">
            حدد اللعبة للحصول على إشارات الذكاء الاصطناعي في الوقت الفعلي
          </p>
        </div>

        {/* Game Cards List */}
        <div className="space-y-4">
          {games.map((g) => (
            <MotionDiv
              key={g.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                audioManager.playClick();
                onSelectGame(g.id);
              }}
              className="group relative bg-zinc-950/80 border border-white/10 hover:border-[#ff1e38] rounded-3xl p-5 cursor-pointer transition-all duration-300 backdrop-blur-xl shadow-xl overflow-hidden"
            >
              {/* Glowing Red Aura on hover */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#ff1e38]/10 rounded-full blur-2xl group-hover:bg-[#ff1e38]/20 transition-all pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 group-hover:border-[#ff1e38]/60 flex items-center justify-center shadow-[0_0_20px_rgba(255,30,56,0.15)] group-hover:scale-105 transition-all overflow-hidden p-2">
                    <img
                      src={g.img}
                      alt={g.title}
                      className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h2 className="text-lg font-black text-white group-hover:text-[#ff1e38] transition-colors truncate">
                        {g.title}
                      </h2>
                      {g.hot && (
                        <span className="flex items-center gap-0.5 text-[9px] font-black bg-red-500/20 text-[#ff1e38] px-2 py-0.5 rounded-full border border-red-500/40">
                          <Flame className="w-2.5 h-2.5" /> HOT
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-[#ff1e38] block mb-1">
                      {g.subtitle}
                    </span>
                    <p className="text-[11px] text-zinc-400 line-clamp-1 leading-relaxed">
                      {g.desc}
                    </p>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/10 group-hover:bg-[#ff1e38] group-hover:border-[#ff1e38] flex items-center justify-center text-zinc-400 group-hover:text-white transition-all shrink-0 shadow-sm">
                  <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
                </div>
              </div>

              {/* Bottom Card Strip */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
                <span className="flex items-center gap-1 text-zinc-300">
                  <Sparkles className="w-3 h-3 text-[#ff1e38]" /> {g.badge}
                </span>
                <span className="font-mono font-bold text-[#ff1e38]">
                  دقة الخوارزمية: {g.accuracy}
                </span>
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameSelection;
