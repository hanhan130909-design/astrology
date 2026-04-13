"use client";

import { useLanguage, translations, type Language } from "@/contexts/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; flag: string; label: string }[] = [
    { code: "zh", flag: "🇨🇳", label: "中文" },
    { code: "en", flag: "🇺🇸", label: "English" },
    { code: "id", flag: "🇮🇩", label: "Bahasa" },
    { code: "th", flag: "🇹🇭", label: "ไทย" },
    { code: "vi", flag: "🇻🇳", label: "Tiếng Việt" },
    { code: "ms", flag: "🇲🇾", label: "Melayu" },
    { code: "ja", flag: "🇯🇵", label: "日本語" },
    { code: "ko", flag: "🇰🇷", label: "한국어" },
  ];

  return (
    <div className="flex items-center gap-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          title={lang.label}
          className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
            language === lang.code
              ? "bg-purple-500/30 text-white border border-purple-500/50"
              : "text-purple-300 hover:bg-purple-500/20 hover:text-white"
          }`}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
}

export function useTranslation() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  return { language, setLanguage, t };
}
