"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage, translations } from "@/contexts/LanguageContext";
import type { Language } from "@/contexts/LanguageContext";

// 天象数据
interface TransitEvent {
  date: string;
  type: "planet-enter" | "planet-exit" | "retrograde" | "direct" | "aspect";
  planet: string;
  sign?: string;
  aspect?: string;
  degree?: number;
  impact: "high" | "medium" | "low";
  description: Record<string, string>;
}

const transitEvents: TransitEvent[] = [
  {
    date: "2026-04-04",
    type: "planet-enter",
    planet: "Venus",
    sign: "Pisces",
    impact: "high",
    description: {
      id: "Venus memasuki Pisces membawa energi cinta yang romantis dan spiritual. Waktu yang baik untuk hubungan dan kreativitas.",
      en: "Venus enters Pisces bringing romantic and spiritual love energy. Great time for relationships and creativity.",
      zh: "金星进入双鱼座，带来浪漫和灵性的爱情能量。非常适合发展关系和创意活动。",
    },
  },
  {
    date: "2026-04-07",
    type: "retrograde",
    planet: "Mercury",
    impact: "high",
    description: {
      id: "Merkurius retrograde di Aries. Hati-hati dengan komunikasi, perjalanan, dan teknologi. Review dan revisi lebih baik dari memulai baru.",
      en: "Mercury retrograde in Aries. Be careful with communication, travel, and technology. Better to review and revise than start new.",
      zh: "水星在白羊座逆行。注意沟通、旅行和技术问题。更适合回顾和修改，而非开始新事物。",
    },
  },
  {
    date: "2026-04-10",
    type: "aspect",
    planet: "Jupiter",
    aspect: "trine Saturn",
    impact: "medium",
    description: {
      id: "Jupiter trine Saturn membawa peluang untuk pertumbuhan jangka panjang. Waktu yang baik untuk perencanaan dan investasi.",
      en: "Jupiter trine Saturn brings opportunities for long-term growth. Good time for planning and investment.",
      zh: "木星与土星三分相，带来长期增长的机会。适合规划和投资。",
    },
  },
  {
    date: "2026-04-15",
    type: "planet-enter",
    planet: "Mars",
    sign: "Cancer",
    impact: "medium",
    description: {
      id: "Mars memasuki Cancer meningkatkan energi emosional dan pelindung. Waktu untuk melindungi keluarga dan rumah.",
      en: "Mars enters Cancer increasing emotional and protective energy. Time to protect family and home.",
      zh: "火星进入巨蟹座，增强情感能量和保护欲。保护家庭和家园的时刻。",
    },
  },
  {
    date: "2026-04-20",
    type: "planet-enter",
    planet: "Sun",
    sign: "Taurus",
    impact: "high",
    description: {
      id: "Matahari memasuki Taurus membawa energi stabil dan praktis. Waktu untuk menikmati keindahan dan membangun keamanan.",
      en: "Sun enters Taurus bringing stable and practical energy. Time to enjoy beauty and build security.",
      zh: "太阳进入金牛座，带来稳定和务实的能量。享受美好事物、建立安全感的时刻。",
    },
  },
  {
    date: "2026-04-25",
    type: "direct",
    planet: "Mercury",
    impact: "high",
    description: {
      id: "Merkurius direct! Komunikasi dan perjalanan mulai lancar kembali. Waktu yang baik untuk menandatangani kontrak.",
      en: "Mercury direct! Communication and travel start flowing smoothly again. Good time to sign contracts.",
      zh: "水星顺行！沟通和旅行开始恢复正常。签订合同的好时机。",
    },
  },
  {
    date: "2026-04-28",
    type: "aspect",
    planet: "Venus",
    aspect: "conjunct Neptune",
    impact: "medium",
    description: {
      id: "Venus conjunct Neptune membawa energi romantis dan kreatif yang sangat kuat. Waktu untuk cinta dan seni.",
      en: "Venus conjunct Neptune brings very strong romantic and creative energy. Time for love and art.",
      zh: "金星与海王星合相，带来非常强烈的浪漫和创意能量。爱情和艺术的时刻。",
    },
  },
];

const planetSymbols: Record<string, string> = {
  Sun: "☉",
  Moon: "☽",
  Mercury: "☿",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄",
  Uranus: "♅",
  Neptune: "♆",
  Pluto: "♇",
};

const signSymbols: Record<string, string> = {
  Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋", Leo: "♌", Virgo: "♍",
  Libra: "♎", Scorpio: "♏", Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
};

export default function TransitsCalendar() {
  const { language } = useLanguage();
  const [selectedEvent, setSelectedEvent] = useState<TransitEvent | null>(null);

  const t = {
    id: {
      title: "Kalender Transit Planet",
      subtitle: "Pantau pergerakan planet dan dampaknya",
      high: "Dampak Tinggi",
      medium: "Dampak Sedang",
      low: "Dampak Rendah",
      enters: "memasuki",
      exits: "keluar dari",
      retrograde: "retrograde",
      direct: "direct",
      viewDetails: "Lihat Detail",
    },
    en: {
      title: "Planetary Transits Calendar",
      subtitle: "Track planetary movements and their impacts",
      high: "High Impact",
      medium: "Medium Impact",
      low: "Low Impact",
      enters: "enters",
      exits: "exits",
      retrograde: "retrograde",
      direct: "direct",
      viewDetails: "View Details",
    },
    zh: {
      title: "行星运行日历",
      subtitle: "追踪行星运动及其影响",
      high: "高影响",
      medium: "中影响",
      low: "低影响",
      enters: "进入",
      exits: "离开",
      retrograde: "逆行",
      direct: "顺行",
      viewDetails: "查看详情",
    },
  }[language];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "border-red-500/50 bg-red-900/20";
      case "medium": return "border-yellow-500/50 bg-yellow-900/20";
      default: return "border-blue-500/50 bg-blue-900/20";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === "zh" ? "zh-CN" : language === "id" ? "id-ID" : "en-US", {
      month: "short",
      day: "numeric",
      weekday: "short",
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* 事件列表 */}
      <div className="space-y-3">
        {transitEvents.map((event, index) => (
          <div
            key={index}
            onClick={() => setSelectedEvent(event)}
            className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${getImpactColor(event.impact)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{planetSymbols[event.planet] || "🌟"}</span>
                <div>
                  <div className="font-semibold text-amber-100">
                    {event.planet} {event.type === "planet-enter" && `${t.enters} ${event.sign}`}
                    {event.type === "retrograde" && t.retrograde}
                    {event.type === "direct" && t.direct}
                    {event.type === "aspect" && event.aspect}
                  </div>
                  <div className="text-sm text-purple-300">{formatDate(event.date)}</div>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  event.impact === "high" ? "bg-red-500/30 text-red-300" :
                  event.impact === "medium" ? "bg-yellow-500/30 text-yellow-300" :
                  "bg-blue-500/30 text-blue-300"
                }`}>
                  {t[event.impact as keyof typeof t]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 详情弹窗 */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEvent(null)}>
          <div className="bg-[#1a1a3a] rounded-2xl p-6 max-w-md w-full border border-purple-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{planetSymbols[selectedEvent.planet]}</span>
              {selectedEvent.sign && <span className="text-3xl">{signSymbols[selectedEvent.sign]}</span>}
            </div>
            <div className="text-sm text-purple-300 mb-2">{formatDate(selectedEvent.date)}</div>
            <h3 className="text-xl font-bold text-amber-100 mb-3">
              {selectedEvent.planet} {selectedEvent.type === "planet-enter" && `${t.enters} ${selectedEvent.sign}`}
              {selectedEvent.type === "retrograde" && t.retrograde}
              {selectedEvent.type === "direct" && t.direct}
              {selectedEvent.type === "aspect" && selectedEvent.aspect}
            </h3>
            <p className="text-purple-200 leading-relaxed">{selectedEvent.description[language]}</p>
            <button
              onClick={() => setSelectedEvent(null)}
              className="mt-4 w-full py-2 bg-purple-600/30 rounded-lg text-purple-200 hover:bg-purple-600/50 transition-colors"
            >
              ✕ {language === "zh" ? "关闭" : language === "id" ? "Tutup" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}