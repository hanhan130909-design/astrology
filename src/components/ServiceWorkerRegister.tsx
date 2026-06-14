"use client";

import { useEffect, useState } from "react";

export function ServiceWorkerRegister() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    // Register service worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(
        (reg) => console.log("SW registered:", reg.scope),
        (err) => console.log("SW registration failed:", err)
      );
    }

    // Capture beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      // Show after 3 visits (tracked via sessionStorage)
      const visits = parseInt(sessionStorage.getItem("pwa_visits") || "0") + 1;
      sessionStorage.setItem("pwa_visits", String(visits));
      if (visits >= 2) setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Increment visit count
    const visits = parseInt(sessionStorage.getItem("pwa_visits") || "0") + 1;
    sessionStorage.setItem("pwa_visits", String(visits));
    if (visits >= 3 && installPrompt) setShowInstall(true);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [installPrompt]);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === "accepted") {
      setShowInstall(false);
      setInstallPrompt(null);
    }
  };

  return (
    <>
      {showInstall && (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-[#171717] text-white rounded-xl p-4 shadow-lg flex items-center justify-between gap-3 md:hidden">
          <div className="text-sm">
            <div className="font-semibold">添加到主屏幕</div>
            <div className="text-gray-300 text-xs mt-0.5">获得更好的体验</div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setShowInstall(false)}
              className="text-xs text-gray-400 px-3 py-1.5"
            >
              以后
            </button>
            <button
              onClick={handleInstall}
              className="text-xs font-medium bg-white text-[#171717] px-4 py-1.5 rounded-md"
            >
              安装
            </button>
          </div>
        </div>
      )}
    </>
  );
}
