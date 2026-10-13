import React, { useState, useEffect } from "react";
import { Globe, ArrowLeft } from "lucide-react";
import SplashScreen from "./components/SplashScreen";
import PlatformSelection from "./components/PlatformSelection";
import { AppleGame } from "./components/AppleGame";
import SettingsView from "./components/SettingsView";
import GameSelection from "./components/GameSelection";
import CrashGame from "./components/CrashGame";
import MinesGame from "./components/MinesGame";
import ParticleBackground from "./components/ParticleBackground";
import { ViewState, Platform, AccessKey, SelectedGame } from "./types";
import { translations, Language } from "./utils/translations";
import { audioManager } from "./utils/audioManager";

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>("splash");
  const [lang, setLang] = useState<Language>("ar");
  const [userId, setUserId] = useState<string>("");
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("bizbet");
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [accessKeyData, setAccessKeyData] = useState<AccessKey | null>(null);

  const rawT = translations[lang];

  const processTranslations = (obj: any): any => {
    const platformName =
      selectedPlatform === "bizbet"
        ? "BIZBET"
        : selectedPlatform === "linebet_v1"
          ? "Greenbet"
          : "Paripulse";
    const newT: any = {};
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        newT[key] = obj[key].replace(
          /1xBet|Linebet|WINWIN|Winwin|GOOBET|Paripulse|Greenbet/gi,
          platformName,
        );
      } else {
        newT[key] = obj[key];
      }
    }
    return newT;
  };

  const t = processTranslations(rawT);
  const isArabic = lang === "ar";

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary-color", "#ff1e38");
    root.style.setProperty("--primary-color-rgb", "255, 30, 56");
    root.style.setProperty("--primary-glow", "rgba(255, 30, 56, 0.45)");
  }, [selectedPlatform]);

  useEffect(() => {
    const initAudio = () => {
      audioManager.resume();
      document.removeEventListener("click", initAudio);
    };
    document.addEventListener("click", initAudio);
    return () => document.removeEventListener("click", initAudio);
  }, []);

  const handleSplashComplete = () => {
    setView("platform_selection");
  };

  const handlePlatformSelect = (p: Platform) => {
    setSelectedPlatform(p);
    setView("settings");
  };

  const handleConditionsSubmit = (id: string) => {
    setUserId(id);
    setAccessKeyData({ key: id, expiresAt: Date.now() + 86400000 });
    setView("game_selection");
  };

  const handleSelectGame = (game: SelectedGame) => {
    audioManager.playClick();
    if (game === "apple") {
      setView("apple_game");
    } else if (game === "mines") {
      setView("mines_game");
    } else {
      setView("crash_game");
    }
  };

  const handleBack = () => {
    audioManager.playClick();
    if (
      view === "apple_game" ||
      view === "crash_game" ||
      view === "mines_game" ||
      view === "info"
    ) {
      setView("game_selection");
    } else if (view === "game_selection") {
      setView("settings");
    } else if (view === "settings") {
      setView("platform_selection");
    }
  };

  const toggleLanguage = (l: Language) => {
    audioManager.playClick();
    setLang(l);
    setIsLangMenuOpen(false);
  };

  const renderContent = () => {
    switch (view) {
      case "platform_selection":
        return <PlatformSelection onSelect={handlePlatformSelect} t={t} />;

      case "settings":
        return (
          <SettingsView
            onComplete={handleConditionsSubmit}
            onBack={handleBack}
            lang={lang}
            t={t}
            platform={selectedPlatform}
          />
        );

      case "game_selection":
        return (
          <GameSelection
            onSelectGame={handleSelectGame}
            onBack={handleBack}
            userId={userId}
            platform={selectedPlatform}
            t={t}
          />
        );

      case "crash_game":
        return <CrashGame onBack={handleBack} userId={userId} platform={selectedPlatform} t={t} />;

      case "mines_game":
        return <MinesGame onBack={handleBack} userId={userId} platform={selectedPlatform} t={t} />;

      case "apple_game":
      case "info":
      default:
        return (
          <AppleGame
            onBack={handleBack}
            userId={userId}
            accessKeyData={accessKeyData}
            language={lang}
            onLanguageChange={toggleLanguage}
            platform={selectedPlatform}
          />
        );
    }
  };

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className={isArabic ? "font-arabic" : "font-sans"}>
      <ParticleBackground />
      {view === "splash" && <SplashScreen onComplete={handleSplashComplete} language={lang} />}

      <div
        className={`fixed inset-0 bg-transparent text-white flex flex-col transition-opacity duration-1000 z-10 ${view === "splash" ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255, 30, 56, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 30, 56, 0.3) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />
          <div className="min-h-full w-full max-w-lg mx-auto relative z-10">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default App;
