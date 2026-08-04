"use client";

import { useEffect } from "react";

const SW_VERSION = "4"; // Bump this to force SW refresh

export function ServiceWorkerRegister() {

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const registerSW = () => {
      async function initSW() {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          try { await reg.unregister(); } catch {}
        }
        if ("caches" in window) {
          const keys = await caches.keys();
          for (const key of keys) {
            if (key !== "lunaxstar-v4") await caches.delete(key);
          }
        }
        setTimeout(async () => {
          try {
            const reg = await navigator.serviceWorker.register("/sw.js?v=4");
            await reg.update();
          } catch (err) { console.log("SW deferred register:", err); }
        }, 1000);
      }
      initSW();
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(registerSW, { timeout: 3000 });
    } else {
      setTimeout(registerSW, 2000);
    }
  }, []);

  return null;
}
