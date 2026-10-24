"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const UI = {
  en: {
    badge: "WAIT — BEFORE YOU GO",
    title: "You're About to Miss Your Soulmate Window.",
    desc: "Your chart shows your next love window opens in 47 days. Most women miss it because they don't see the pattern. Enter your email and I'll send you the exact date — plus how to break the pattern that made you miss the last two.",
    placeholder: "Enter your email",
    button: "Send Me My Window Date — Free",
    privacy: "No spam. Just your chart. Unsubscribe anytime.",
    success: "Check your inbox! Your window date is on its way.",
  },
  zh: {
    badge: "等等 — 先别走",
    title: "你就要错过你的正缘窗口了。",
    desc: "你的星盘显示下一个正缘窗口在47天后打开。大多数女性错过它是因为没看到模式。输入邮箱，我会把确切日期发给你——以及如何打破让你错过前两次的模式。",
    placeholder: "输入你的邮箱",
    button: "免费发送我的窗口日期",
    privacy: "无垃圾邮件。只有你的星盘。随时可退订。",
    success: "请查收邮件！你的窗口日期已发送。",
  },
  id: {
    badge: "TUNGGU — SEBELUM ANDA PERGI",
    title: "Anda Akan Melewatkan Jalan Jodoh Anda.",
    desc: "Bagan Anda menunjukkan jalan cinta berikutnya terbuka dalam 47 hari. Kebanyakan wanita melewatkannya karena tidak melihat polanya. Masukkan email dan saya akan kirim tanggal pastinya — plus cara memutus pola yang membuat Anda melewatkan dua kali terakhir.",
    placeholder: "Masukkan email Anda",
    button: "Kirim Tanggal Jalan Saya — Gratis",
    privacy: "Tidak ada spam. Hanya bagan Anda. Berhenti kapan saja.",
    success: "Cek email Anda! Tanggal jalan Anda sedang dikirim.",
  },
};

export default function ExitIntentPopup() {
  const { language } = useLanguage();
  const lang = language || "en";
  const ui = UI[lang] || UI.en;

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const shownRef = useRef(false);

  useEffect(() => {
    // Don't show if already shown or on mobile (use scroll-based trigger)
    const isMobile = window.innerWidth < 768;

    const handleMouseLeave = (e: MouseEvent) => {
      if (shownRef.current) return;
      if (e.clientY <= 0) {
        shownRef.current = true;
        setShow(true);
      }
    };

    const handleScroll = () => {
      if (shownRef.current || !isMobile) return;
      // On mobile, show when user scrolls to bottom and has been on page 30s
      const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      if (scrollBottom) {
        shownRef.current = true;
        setShow(true);
      }
    };

    // Mobile: show after 45 seconds if not already shown
    const mobileTimer = isMobile
      ? setTimeout(() => {
          if (!shownRef.current) {
            shownRef.current = true;
            setShow(true);
          }
        }, 45000)
      : null;

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      if (mobileTimer) clearTimeout(mobileTimer);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get("ref");
      
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exit-popup", ...(ref ? { ref } : {}) }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-amber-100">
        {/* Close button */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl leading-none"
          aria-label="Close"
        >
          ×
        </button>

        {status === "success" ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{ui.success}</h3>
            <button
              onClick={() => setShow(false)}
              className="mt-4 text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="inline-block text-[10px] font-bold tracking-wider text-red-600 bg-red-50 px-2 py-1 rounded-full mb-3">
              {ui.badge}
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-3 leading-tight">
              {ui.title}
            </h3>
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              {ui.desc}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                placeholder={ui.placeholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
              {status === "error" && (
                <p className="text-xs text-red-500">Please enter a valid email</p>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-sm hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-60"
              >
                {status === "loading" ? "Sending..." : ui.button}
              </button>
            </form>
            <p className="text-[11px] text-gray-400 text-center mt-3">{ui.privacy}</p>
          </>
        )}
      </div>
    </div>
  );
}
