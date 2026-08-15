"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Check if already installed
function isStandalone(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(display-mode: standalone)").matches ||
         (navigator as any).standalone === true; // iOS
}

const text: Record<string, { title: string; desc: string; btn: string }> = {
  zh: { title: "添加到主屏幕", desc: "快速打开星缘，无需浏览器", btn: "安装" },
  en: { title: "Add to Home Screen", desc: "Open instantly without browser", btn: "Install" },
  id: { title: "Tambah ke Layar Utama", desc: "Buka langsung tanpa browser", btn: "Pasang" },
};

export default function InstallPrompt() {
  const { language } = useLanguage();
  const t = text[language] || text.en;
  const [show, setShow] = useState(false);
  const [deferred, setDeferred] = useState<any>(null);

  useEffect(() => {
    if (isStandalone()) return;

    // Android/Chrome: beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e);
      // Show after 3 seconds
      setTimeout(() => setShow(true), 3000);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS: show after first visit
    const shown = localStorage.getItem("pwa-prompt-shown");
    if (!shown) {
      setTimeout(() => {
        if (!isStandalone()) setShow(true);
      }, 5000);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (deferred) {
      deferred.prompt();
      const result = await deferred.userChoice;
      if (result.outcome === "accepted") setShow(false);
    } else {
      // iOS fallback: show instructions
      alert(
        language === "zh"
          ? "点击 Safari 底部 「分享」→「添加到主屏幕」"
          : "Tap Share → Add to Home Screen in Safari"
      );
      setShow(false);
    }
    setDeferred(null);
    localStorage.setItem("pwa-prompt-shown", "1");
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-gray-900 text-white rounded-2xl px-5 py-4 shadow-2xl flex items-center gap-4">
        <button
          onClick={() => { setShow(false); localStorage.setItem("pwa-prompt-shown", "1"); }}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          <X size={16} />
        </button>
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <Download size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">{t.title}</div>
          <div className="text-xs text-gray-400 mt-0.5">{t.desc}</div>
        </div>
        <button
          onClick={install}
          className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-semibold shrink-0 hover:bg-gray-100 transition"
        >
          {t.btn}
        </button>
      </div>
    </div>
  );
}
