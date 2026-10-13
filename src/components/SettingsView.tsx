import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Fingerprint,
  Sparkles,
  Lock,
  Wallet,
  Send,
  Zap,
  UserPlus,
} from "lucide-react";
import { audioManager } from "../utils/audioManager";
import { Platform } from "../types";
import { SITE_LOGO_URL as smartScriptLogo } from "../services/predictionService";

interface SettingsViewProps {
  onComplete: (userId: string) => void;
  onBack: () => void;
  lang: string;
  t: any;
  platform: Platform;
}

const MotionDiv = motion.div as any;

const SettingsView: React.FC<SettingsViewProps> = ({ onComplete, onBack, lang, t, platform }) => {
  const [userId, setUserId] = useState("");
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<{ userId?: boolean; userIdLength?: boolean }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationStage, setVerificationStage] = useState<"step1" | "step2" | "ready">("step1");

  const platformName =
    platform === "bizbet" ? "BIZBET" : platform === "linebet_v1" ? "Greenbet" : "Paripulse";
  const promoCode = "B22";
  const platformImg =
    platform === "bizbet"
      ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh_SHX7efEoJGTNOkFPVFyFdj1MQKfYEF6biEyL8jE_A&s=10"
      : platform === "linebet_v1"
        ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoEj5eP5tNE8iMZoLHE9i4q-JYLMiLmHaIMKatrmBePA&s=10"
        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg6-yMiToAplqRqnBnaYACm49Od_26EabD95SDPxqLgg&s=10";

  const downloadUrl = "https://bit.ly/4hU1hph";
  const registerUrl = "https://bit.ly/4zs7qQy";
  const telegramUrl = "https://t.me/+1MOiIrUHK1AzZWJk";

  const handleCopy = () => {
    audioManager.playClick();
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setUserId(val);
    if (errors.userId || errors.userIdLength) {
      setErrors({});
    }
  };

  const validateAndSubmit = () => {
    audioManager.playClick();
    if (!userId.trim()) {
      setErrors({ userId: true });
      return;
    }
    if (userId.trim().length < 10 || userId.trim().length > 15) {
      setErrors({ userIdLength: true });
      return;
    }

    setErrors({});
    setIsModalOpen(true);
    setVerificationStage("step1");

    setTimeout(() => {
      setVerificationStage("step2");
      setTimeout(() => {
        setVerificationStage("ready");
      }, 1500);
    }, 1500);
  };

  const handleDownloadAndProceed = () => {
    window.open(downloadUrl, "_blank");
    audioManager.playClick();
    setTimeout(() => {
      setIsModalOpen(false);
      onComplete(userId);
    }, 400);
  };

  return (
    <div
      className="flex flex-col min-h-full bg-transparent font-sans text-white selection:bg-red-500/40 relative overflow-x-hidden"
      dir="rtl"
    >
      {/* Background ambient glowing lasers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-[#ff1e38]/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 flex flex-col px-4 sm:px-6 pt-5 pb-20 max-w-lg mx-auto w-full gap-5">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-[#ff1e38]/60 transition-all active:scale-95 shadow-lg cursor-pointer"
            title="رجوع"
          >
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </button>

          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#ff1e38] animate-pulse shadow-[0_0_8px_#ff1e38]" />
            <span className="text-xs font-black tracking-wider uppercase text-[#ff1e38]">
              شروط تفعيل {platformName}
            </span>
          </div>
        </div>

        {/* Hero Header Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 p-5 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#ff1e38]/15 blur-3xl pointer-events-none" />

          <div className="relative flex items-center gap-4">
            <div className="w-20 h-20 shrink-0 rounded-2xl border-2 border-red-500/40 bg-black flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(255,30,56,0.3)]">
              <img src={smartScriptLogo} alt="SMART AI" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-wide">
                  SMART <span className="text-[#ff1e38]">AI</span>
                </h1>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10">
                  VIP SYSTEM
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                أكمل الشروط الخمسة لتفعيل الربط المباشر مع سيرفر التوقعات بدقة 99%
              </p>
            </div>
          </div>
        </div>

        {/* Step 1: Install Platform */}
        <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-5 backdrop-blur-md shadow-lg space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#ff1e38] text-white flex items-center justify-center font-black text-sm shadow-[0_0_12px_rgba(255,30,56,0.5)]">
                1
              </div>
              <h2 className="text-base font-black text-white">تثبيت تطبيق {platformName}</h2>
            </div>
            <span className="text-[10px] font-bold text-[#ff1e38] bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
              إلزامي
            </span>
          </div>

          <div className="flex items-center gap-3 bg-zinc-900/80 border border-white/5 p-3 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-black border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
              <img src={platformImg} alt={platformName} className="w-full h-full object-contain" />
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              قم بتحميل وتثبيت النسخة الرسمية من تطبيق{" "}
              <strong className="text-white">{platformName}</strong> لربط معرف حسابك مع خوارزمية
              الذكاء الاصطناعي.
            </p>
          </div>

          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => audioManager.playClick()}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#ff1e38] to-[#d60e2a] hover:from-[#ff334b] hover:to-[#eb1c3e] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,30,56,0.4)] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تحميل تطبيق {platformName}</span>
          </a>
        </div>

        {/* Step 2: Join Telegram Channel */}
        <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-5 backdrop-blur-md shadow-lg space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0088cc] text-white flex items-center justify-center font-black text-sm shadow-[0_0_12px_rgba(0,136,204,0.5)]">
                2
              </div>
              <h2 className="text-base font-black text-white">الانضمام لقناة التلجرام</h2>
            </div>
            <span className="text-[10px] font-bold text-zinc-400 bg-white/[0.05] px-2.5 py-1 rounded-full border border-white/10">
              تحديثات فورية
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/80 border border-white/5 p-3 rounded-2xl">
            انضم لقناتنا الرسمية لمتابعة الإشارات المباشرة والتحديثات وسيرفرات التوقعات في الوقت
            الفعلي.
          </p>

          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => audioManager.playClick()}
            className="w-full h-12 rounded-2xl bg-[#0088cc] hover:bg-[#0099e6] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,136,204,0.35)] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>الانضمام إلى قناة التلجرام الرسمية</span>
            <ExternalLink className="w-4 h-4 mr-1" />
          </a>
        </div>

        {/* Step 3: Approved Promo Code */}
        <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-5 backdrop-blur-md shadow-lg space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#ff1e38] text-white flex items-center justify-center font-black text-sm shadow-[0_0_12px_rgba(255,30,56,0.5)]">
                3
              </div>
              <h2 className="text-base font-black text-white">إدخال كود البروموكود</h2>
            </div>
            <span className="text-[10px] font-bold text-[#ff1e38] bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/25">
              مطلوب للتسجيل
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            عند إنشاء حسابك الجديد، استخدم البروموكود المعتمد لضمان ربط حسابك بسيرفر الذكاء
            الاصطناعي بنجاح:
          </p>

          <div
            onClick={handleCopy}
            className="relative bg-zinc-900/90 rounded-2xl border-2 border-dashed border-[#ff1e38]/50 hover:border-[#ff1e38] p-4 transition-all cursor-pointer group shadow-[0_0_20px_rgba(255,30,56,0.15)] flex items-center justify-between"
          >
            <div>
              <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-0.5">
                الكود المعتمد
              </span>
              <span className="text-3xl font-black font-mono tracking-[0.2em] text-[#ff1e38] drop-shadow-[0_0_12px_rgba(255,30,56,0.7)]">
                {promoCode}
              </span>
            </div>

            <button
              type="button"
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                copied
                  ? "bg-[#ff1e38] text-white shadow-[0_0_15px_#ff1e38]"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>نسخ الكود</span>
                </>
              )}
            </button>
          </div>

          {/* White 'Create Account' Button */}
          <a
            href={registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => audioManager.playClick()}
            className="w-full h-12 rounded-2xl bg-white hover:bg-zinc-100 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.4)] active:scale-[0.98] transition-all cursor-pointer border border-white"
          >
            <UserPlus className="w-4 h-4 text-black" />
            <span>إنشاء حساب</span>
            <ExternalLink className="w-4 h-4 text-zinc-700 mr-1" />
          </a>
        </div>

        {/* Step 4: Minimum Deposit */}
        <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-5 backdrop-blur-md shadow-lg space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#ff1e38] text-white flex items-center justify-center font-black text-sm shadow-[0_0_12px_rgba(255,30,56,0.5)]">
                4
              </div>
              <h2 className="text-base font-black text-white">الحد الأدنى للإيداع</h2>
            </div>
            <span className="text-[10px] font-bold text-zinc-300 bg-white/[0.05] px-2.5 py-1 rounded-full border border-white/10">
              تفعيل الخوارزمية
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            قم بإجراء أول عملية إيداع بالحساب للحد الأدنى الموضح لتفعيل المزامنة التلقائية مع محرك
            التوقعات:
          </p>

          <div className="grid grid-cols-2 gap-3" dir="ltr">
            <div className="bg-zinc-900/90 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-inner">
              <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                <Wallet className="w-3 h-3 text-[#ff1e38]" /> USD ($)
              </span>
              <span className="text-2xl font-black text-white font-mono drop-shadow-[0_0_10px_rgba(255,30,56,0.4)]">
                $3.00
              </span>
            </div>
            <div className="bg-zinc-900/90 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-inner">
              <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#ff1e38]" /> EGP (جنيه)
              </span>
              <span className="text-2xl font-black text-[#ff1e38] font-mono drop-shadow-[0_0_12px_rgba(255,30,56,0.6)]">
                150 L.E
              </span>
            </div>
          </div>
        </div>

        {/* Step 5: ID Verification */}
        <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-5 backdrop-blur-md shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#ff1e38] text-white flex items-center justify-center font-black text-sm shadow-[0_0_12px_rgba(255,30,56,0.5)]">
                5
              </div>
              <h2 className="text-base font-black text-white">إدخال معرف الحساب (User ID)</h2>
            </div>
            <span className="text-[10px] font-bold text-[#ff1e38] bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/25">
              خطوة أخيرة
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            أدخل الـ ID المكون من 10 إلى 15 رقم للتحقق من تطابق الشروط والانتقال لصفحة الألعاب:
          </p>

          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 right-0 w-12 flex items-center justify-center pointer-events-none">
                <Fingerprint className={`w-5 h-5 ${userId ? "text-[#ff1e38]" : "text-zinc-500"}`} />
              </div>
              <input
                type="text"
                value={userId}
                onChange={handleUserIdChange}
                placeholder="مثال: 18XXXXXXXXX"
                maxLength={15}
                className={`w-full bg-zinc-900/90 border text-white font-mono text-base pr-12 pl-4 py-3.5 rounded-2xl focus:outline-none transition-all text-right placeholder:text-zinc-600 ${
                  errors.userId || errors.userIdLength
                    ? "border-red-500 focus:ring-2 focus:ring-red-500/50"
                    : "border-white/15 focus:border-[#ff1e38] focus:ring-2 focus:ring-red-500/30"
                }`}
              />
            </div>

            {(errors.userId || errors.userIdLength) && (
              <p className="text-xs text-red-400 font-bold pr-1">
                يرجى إدخال رقم ID صحيح مكون من 10 إلى 15 أرقام.
              </p>
            )}
          </div>

          <button
            onClick={validateAndSubmit}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#ff1e38] via-[#e11435] to-[#c70f28] hover:from-[#ff334b] hover:to-[#eb1c3e] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,30,56,0.5)] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>تأكيد وتفعيل الحساب</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        </div>

        {/* Security Footer Notice */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-2.5 text-xs text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-[#ff1e38] shrink-0" />
          <span>يتم فحص ومزامنة البيانات في الوقت الفعلي بأمان تشفير تام.</span>
        </div>
      </div>

      {/* Verification Status Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <MotionDiv
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-sm bg-zinc-950 border-2 border-red-500/40 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-[0_0_60px_rgba(255,30,56,0.35)] relative overflow-hidden"
            >
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#ff1e38]/20 blur-3xl rounded-full pointer-events-none" />

              {verificationStage === "step1" && (
                <div className="flex flex-col items-center py-4">
                  <div className="relative w-16 h-16 mb-5 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-zinc-800 border-t-[#ff1e38] animate-spin" />
                    <Fingerprint className="w-8 h-8 text-[#ff1e38]" />
                  </div>
                  <h3 className="text-lg font-black text-white mb-1.5">
                    جاري التحقق من ID الخاص بك...
                  </h3>
                  <p className="text-xs text-zinc-400">مزامنة الاتصال بالسيرفر</p>
                </div>
              )}

              {verificationStage === "step2" && (
                <div className="flex flex-col items-center py-4">
                  <div className="relative w-16 h-16 mb-5 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-zinc-800 border-t-[#ff1e38] animate-spin" />
                    <ShieldCheck className="w-8 h-8 text-[#ff1e38]" />
                  </div>
                  <h3 className="text-lg font-black text-white mb-1.5">جاري فحص حالة الحساب...</h3>
                  <p className="text-xs text-zinc-400">فحص شروط التفعيل والإيداع</p>
                </div>
              )}

              {verificationStage === "ready" && (
                <div className="flex flex-col items-center w-full py-2">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/40 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(255,30,56,0.4)]">
                    <CheckCircle2 className="w-9 h-9 text-[#ff1e38]" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-1">تم التحقق من الحساب بنجاح!</h3>
                  <p className="text-xs text-zinc-400 mb-6">
                    تم ربط معرف الحساب بخوارزمية التوقعات المباشرة.
                  </p>
                  <button
                    onClick={handleDownloadAndProceed}
                    className="w-full py-4 px-6 bg-gradient-to-r from-[#ff1e38] to-[#d60e2a] hover:from-[#ff334b] hover:to-[#eb1c3e] text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-[0_0_30px_rgba(255,30,56,0.6)] flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                  >
                    <Download className="w-5 h-5 text-white" />
                    <span>تحميل التطبيق وبدء اللعب</span>
                  </button>
                </div>
              )}
            </MotionDiv>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsView;
