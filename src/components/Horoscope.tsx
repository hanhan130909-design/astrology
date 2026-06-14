"use client";

import { useState, useEffect, useCallback } from "react";
import { getAztroHoroscope, getEnhancedHoroscope, ZODIAC_SIGNS, ZODIAC_ZH, ZODIAC_ID } from "@/lib/astrologyApi";

interface Props {
  language: "id" | "en" | "zh";
}

const SIGNS = [
  { id: "aries", symbol: "♈", name: { id: "Aries", zh: "白羊座", en: "Aries" } },
  { id: "taurus", symbol: "♉", name: { id: "Taurus", zh: "金牛座", en: "Taurus" } },
  { id: "gemini", symbol: "♊", name: { id: "Gemini", zh: "双子座", en: "Gemini" } },
  { id: "cancer", symbol: "♋", name: { id: "Cancer", zh: "巨蟹座", en: "Cancer" } },
  { id: "leo", symbol: "♌", name: { id: "Leo", zh: "狮子座", en: "Leo" } },
  { id: "virgo", symbol: "♍", name: { id: "Virgo", zh: "处女座", en: "Virgo" } },
  { id: "libra", symbol: "♎", name: { id: "Libra", zh: "天秤座", en: "Libra" } },
  { id: "scorpio", symbol: "♏", name: { id: "Scorpio", zh: "天蝎座", en: "Scorpio" } },
  { id: "sagittarius", symbol: "♐", name: { id: "Sagittarius", zh: "射手座", en: "Sagittarius" } },
  { id: "capricorn", symbol: "♑", name: { id: "Capricorn", zh: "摩羯座", en: "Capricorn" } },
  { id: "aquarius", symbol: "♒", name: { id: "Aquarius", zh: "水瓶座", en: "Aquarius" } },
  { id: "pisces", symbol: "♓", name: { id: "Pisces", zh: "双鱼座", en: "Pisces" } },
];

const ELEMENTS: Record<string, string[]> = {
  Fire: ["aries", "leo", "sagittarius"],
  Earth: ["taurus", "virgo", "capricorn"],
  Air: ["gemini", "libra", "aquarius"],
  Water: ["cancer", "scorpio", "pisces"]
};

export default function Horoscope({ language }: Props) {
  const [selectedSign, setSelectedSign] = useState<string>("aries");
  const [period, setPeriod] = useState<"today" | "tomorrow" | "yesterday">("today");
  const [isLoading, setIsLoading] = useState(false);
  const [horoscopeData, setHoroscopeData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const t = {
    id: {
      title: "Horoskop Harian",
      selectSign: "Pilih Zodiak",
      periods: { today: "Hari Ini", tomorrow: "Besok", yesterday: "Kemarin" },
      loading: "Memuat...",
      error: "Gagal memuat data. Coba lagi.",
      current: "Tanggal",
      compatibility: "Kecocokan",
      luckyNumber: "Angka Keberuntungan",
      luckyTime: "Waktu Keberuntungan",
      color: "Warna Keberuntungan",
      mood: "Suasana Hati",
      description: "Ramalan"
    },
    en: {
      title: "Daily Horoscope",
      selectSign: "Select Sign",
      periods: { today: "Today", tomorrow: "Tomorrow", yesterday: "Yesterday" },
      loading: "Loading...",
      error: "Failed to load data. Please try again.",
      current: "Date",
      compatibility: "Compatibility",
      luckyNumber: "Lucky Number",
      luckyTime: "Lucky Time",
      color: "Lucky Color",
      mood: "Mood",
      description: "Horoscope"
    },
    zh: {
      title: "每日运势",
      selectSign: "选择星座",
      periods: { today: "今天", tomorrow: "明天", yesterday: "昨天" },
      loading: "加载中...",
      error: "加载失败，请重试。",
      current: "日期",
      compatibility: "配对星座",
      luckyNumber: "幸运数字",
      luckyTime: "幸运时间",
      color: "幸运颜色",
      mood: "心情",
      description: "运势解读"
    }
  }[language];

  const fetchHoroscope = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getAztroHoroscope(selectedSign, period);
      if (data) {
        setHoroscopeData(data);
      } else {
        setError(t.error);
      }
    } catch (err) {
      console.error("Horoscope fetch error:", err);
      setError(t.error);
    }
    
    setIsLoading(false);
  }, [selectedSign, period, t.error]);

  useEffect(() => {
    fetchHoroscope();
  }, [fetchHoroscope]);

  const selectedSignData = SIGNS.find(s => s.id === selectedSign);
  const element = Object.entries(ELEMENTS).find(([_, signs]) => signs.includes(selectedSign))?.[0] || "Fire";
  
  const elementColors: Record<string, string> = {
    Fire: "from-red-500/20 to-orange-500/20 border-red-500/30",
    Earth: "from-green-500/20 to-emerald-500/20 border-green-500/30",
    Air: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
    Water: "from-blue-500/20 to-purple-500/20 border-blue-500/30"
  };

  const elementSymbol: Record<string, string> = {
    Fire: "🔥",
    Earth: "🌍",
    Air: "💨",
    Water: "💧"
  };

  return (
    <div className="space-y-6">
      {/* 星座选择网格 */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
        {SIGNS.map(sign => (
          <button
            key={sign.id}
            onClick={() => setSelectedSign(sign.id)}
            className={`relative p-3 rounded-xl text-center transition-all duration-300 group ${
              selectedSign === sign.id
                ? `bg-gradient-to-br ${elementColors[element]} ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/20`
                : "bg-purple-900/20 hover:bg-purple-800/30"
            }`}
          >
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{sign.symbol}</div>
            <div className="text-xs text-purple-200 truncate">{sign.name[language]}</div>
            {selectedSign === sign.id && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 时间周期选择 */}
      <div className="flex justify-center gap-2">
        {(["today", "tomorrow", "yesterday"] as const).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
              period === p
                ? "bg-gradient-to-r from-amber-500 to-purple-600 text-white shadow-lg shadow-amber-500/25"
                : "bg-purple-900/30 text-purple-300 hover:bg-purple-800/40"
            }`}
          >
            {t.periods[p]}
          </button>
        ))}
      </div>

      {/* 运势卡片 */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${elementColors[element]} border p-6`}>
        {/* 装饰背景 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
        
        <div className="relative">
          {/* 头部 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg">
                {selectedSignData?.symbol}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-amber-100">
                  {selectedSignData?.name[language]}
                </h2>
                <div className="flex items-center gap-2 text-sm text-purple-300">
                  <span>{elementSymbol[element]} {element}</span>
                  <span>•</span>
                  <span>{ZODIAC_SIGNS[selectedSign]?.dateRange}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-purple-400">{t.current}</div>
              <div className="text-lg font-medium text-amber-200">{horoscopeData?.currentDate || "---"}</div>
            </div>
          </div>

          {/* 加载状态 */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-amber-500 rounded-full animate-spin" />
            </div>
          )}

          {/* 错误状态 */}
          {error && !isLoading && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="text-purple-300">{error}</p>
              <button 
                onClick={fetchHoroscope}
                className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-white transition-colors"
              >
                {language === "zh" ? "重试" : language === "id" ? "Coba Lagi" : "Retry"}
              </button>
            </div>
          )}

          {/* 运势内容 */}
          {horoscopeData && !isLoading && (
            <div className="space-y-6">
              {/* 运势描述 */}
              <div className="p-4 rounded-xl bg-purple-900/30 border border-purple-200">
                <p className="text-purple-100 leading-relaxed text-lg">
                  {language === "zh" && horoscopeData.descriptionZh 
                    ? horoscopeData.descriptionZh 
                    : language === "id" && horoscopeData.descriptionId
                    ? horoscopeData.descriptionId
                    : horoscopeData.description}
                </p>
              </div>

              {/* 幸运信息网格 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-purple-900/20 text-center">
                  <div className="text-2xl mb-2">🔢</div>
                  <div className="text-xs text-purple-400 mb-1">{t.luckyNumber}</div>
                  <div className="text-xl font-bold text-amber-200">{horoscopeData.luckyNumber}</div>
                </div>
                <div className="p-4 rounded-xl bg-purple-900/20 text-center">
                  <div className="text-2xl mb-2">⏰</div>
                  <div className="text-xs text-purple-400 mb-1">{t.luckyTime}</div>
                  <div className="text-xl font-bold text-amber-200">{horoscopeData.luckyTime}</div>
                </div>
                <div className="p-4 rounded-xl bg-purple-900/20 text-center">
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="text-xs text-purple-400 mb-1">{t.color}</div>
                  <div className="text-xl font-bold text-amber-200">{horoscopeData.color}</div>
                </div>
                <div className="p-4 rounded-xl bg-purple-900/20 text-center">
                  <div className="text-2xl mb-2">💫</div>
                  <div className="text-xs text-purple-400 mb-1">{t.mood}</div>
                  <div className="text-xl font-bold text-amber-200">{horoscopeData.mood}</div>
                </div>
              </div>

              {/* 配对星座 */}
              <div className="flex items-center justify-center gap-4 p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20">
                <span className="text-purple-300">
                  {language === "zh" ? "最佳配对" : language === "id" ? "Kecocokan Terbaik" : "Best Match"}:
                </span>
                <div className="flex items-center gap-2 px-4 py-2 bg-pink-500/20 rounded-xl">
                  <span className="text-2xl">
                    {SIGNS.find(s => s.name.en.toLowerCase() === horoscopeData.compatibility?.toLowerCase().trim())?.symbol || "❤️"}
                  </span>
                  <span className="font-semibold text-pink-200">{horoscopeData.compatibility}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部提示 */}
      <div className="text-center text-sm text-purple-400">
        <p>✨ {language === "zh" ? "数据来自 Aztro API" : language === "id" ? "Data dari Aztro API" : "Data from Aztro API"}</p>
      </div>
    </div>
  );
}