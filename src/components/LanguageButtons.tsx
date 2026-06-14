"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageButtons() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setLanguage("id")}
        className={`px-2 py-1 rounded text-xs ${
          language === "id" 
            ? "bg-gray-500/30 text-gray-600 border border-gray-500/50" 
            : "text-gray-300 hover:text-gray-600"
        }`}
      >
        🇮🇩 ID
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`px-2 py-1 rounded text-xs ${
          language === "en" 
            ? "bg-gray-500/30 text-gray-600 border border-gray-500/50" 
            : "text-gray-300 hover:text-gray-600"
        }`}
      >
        🇺🇸 EN
      </button>
      <button
        onClick={() => setLanguage("zh")}
        className={`px-2 py-1 rounded text-xs ${
          language === "zh" 
            ? "bg-gray-500/30 text-gray-600 border border-gray-500/50" 
            : "text-gray-300 hover:text-gray-600"
        }`}
      >
        🇨🇳 中
      </button>
    </div>
  );
}