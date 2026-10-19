"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// Inline SVG icons (replaces lucide-react to reduce bundle size)
const MailIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const LockIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const SparklesIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
);
const CheckCircleIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
);
const LoaderIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);

const UI: Record<string, Record<string, string>> = {
  en: {
    badge: "FREE UNLOCK",
    title: "Your Full Chart Is Ready",
    desc: "We calculated your complete birth chart. Enter your email to unlock the full interpretation — including your rising sign, moon sign, houses, and what they mean for your love life.",
    placeholder: "Enter your email",
    button: "Unlock My Full Chart — Free",
    privacy: "We'll send your chart + 7-day love guidance. Unsubscribe anytime.",
    success: "Check your inbox!",
    successDesc: "Your full chart is on its way. Also check your spam folder.",
    error: "Please enter a valid email",
  },
  zh: {
    badge: "免费解锁",
    title: "你的完整星盘已生成",
    desc: "我们已经算出了你的完整星盘。输入邮箱解锁完整解读——包括上升星座、月亮星座、宫位，以及它们对你感情的影响。",
    placeholder: "输入你的邮箱",
    button: "免费解锁完整星盘",
    privacy: "我们会发送你的星盘和7天感情指导，随时可退订。",
    success: "请查收邮件！",
    successDesc: "你的完整星盘已发送，也请检查垃圾邮件文件夹。",
    error: "请输入有效的邮箱地址",
  },
  id: {
    badge: "BUKA GRATIS",
    title: "Bagan Lengkap Anda Siap",
    desc: "Kami sudah menghitung bagan kelahiran lengkap Anda. Masukkan email untuk membuka interpretasi lengkap — termasuk rising sign, moon sign, houses, dan artinya untuk cinta Anda.",
    placeholder: "Masukkan email Anda",
    button: "Buka Bagan Lengkap — Gratis",
    privacy: "Kami kirim bagan + panduan cinta 7 hari. Berhenti kapan saja.",
    success: "Cek email Anda!",
    successDesc: "Bagan lengkap sedang dikirim. Cek folder spam juga.",
    error: "Masukkan email yang valid",
  },
};

export interface ChartData {
  moonSign?: string;
  risingSign?: string;
  sunSign?: string;
  venusSign?: string;
  marsSign?: string;
  jupiterSign?: string;
  saturnSign?: string;
}

export default function EmailUnlock({
  sign = "natal",
  chartData,
}: {
  sign?: string;
  chartData?: ChartData;
}) {
  const { language } = useLanguage();
  const lang = language || "en";
  const ui = UI[lang] || UI.en;

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: sign,
          ...(chartData || {}),
        }),
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

  if (status === "success") {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 text-center max-w-md mx-auto">
        <CheckCircleIcon size={40} className="text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-900 mb-1">{ui.success}</h3>
        <p className="text-sm text-gray-600">{ui.successDesc}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md mx-auto shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-bold tracking-wider text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">{ui.badge}</span>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
        <SparklesIcon size={18} className="text-amber-500" />
        {ui.title}
      </h3>
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{ui.desc}</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <MailIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
            placeholder={ui.placeholder}
            aria-label={ui.placeholder}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
        </div>
        {status === "error" && <p className="text-xs text-red-500">{ui.error}</p>}
        <button
          type="submit"
          disabled={status === "loading"}
          aria-label={ui.button}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-sm hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {status === "loading" ? <LoaderIcon size={16} /> : <LockIcon size={16} />}
          {ui.button}
        </button>
      </form>
      <p className="text-[11px] text-gray-400 text-center mt-3">{ui.privacy}</p>
    </div>
  );
}
