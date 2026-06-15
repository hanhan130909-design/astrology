"use client";

import { useEffect, useState } from "react";

const SW_VERSION = "3"; // Bump this to force SW refresh

export function ServiceWorkerRegister() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    // Force clean old SW versions, then register latest
    async function initSW() {
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      // Unregister any SW that isn't our current version
      for (const reg of registrations) {
        const sw = reg.active || reg.waiting || reg.installing;
        if (sw) {
          try {
            // Check if it's the old version by fetching its script URL
            await reg.unregister();
            console.log("Unregistered old SW");
          } catch {}
        }
      }
      
      // Clear all caches
      if ("caches" in window) {
        const keys = await caches.keys();
        for (const key of keys) {
          if (key !== `lunaxstar-v${SW_VERSION}`) {
            await caches.delete(key);
          }
        }
      }
      
      // Wait a beat then register fresh
      setTimeout(async () => {
        try {
          const reg = await navigator.serviceWorker.register(`/sw.js?v=${SW_VERSION}`);
          console.log("SW registered v" + SW_VERSION, reg.scope);
          // Force update check
          await reg.update();
        } catch (err) {
          console.log("SW registration failed:", err);
        }
      }, 500);
    }
    
    initSW();

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      const visits = parseInt(sessionStorage.getItem("pwa_visits") || "0") + 1;
      sessionStorage.setItem("pwa_visits", String(visits));
      if (visits >= 2) setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

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
            <button onClick={() => setShowInstall(false)} className="text-xs text-gray-400 px-3 py-1.5">以后</button>
            <button onClick={handleInstall} className="text-xs font-medium bg-white text-[#171717] px-4 py-1.5 rounded-md">安装</button>
          </div>
        </div>
      )}
    </>
  );
}
