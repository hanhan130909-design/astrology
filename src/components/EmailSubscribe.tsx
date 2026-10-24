"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Check, AlertCircle, Loader2 } from "lucide-react";

const ZODIAC_SIGNS: { id: string; symbol: string; name: Record<string, string> }[] = [
  { id: "aries", symbol: "♈", name: { zh: "白羊座", en: "Aries", id: "Aries" } },
  { id: "taurus", symbol: "♉", name: { zh: "金牛座", en: "Taurus", id: "Taurus" } },
  { id: "gemini", symbol: "♊", name: { zh: "双子座", en: "Gemini", id: "Gemini" } },
  { id: "cancer", symbol: "♋", name: { zh: "巨蟹座", en: "Cancer", id: "Cancer" } },
  { id: "leo", symbol: "♌", name: { zh: "狮子座", en: "Leo", id: "Leo" } },
  { id: "virgo", symbol: "♍", name: { zh: "处女座", en: "Virgo", id: "Virgo" } },
  { id: "libra", symbol: "♎", name: { zh: "天秤座", en: "Libra", id: "Libra" } },
  { id: "scorpio", symbol: "♏", name: { zh: "天蝎座", en: "Scorpio", id: "Scorpio" } },
  { id: "sagittarius", symbol: "♐", name: { zh: "射手座", en: "Sagittarius", id: "Sagittarius" } },
  { id: "capricorn", symbol: "♑", name: { zh: "摩羯座", en: "Capricorn", id: "Capricorn" } },
  { id: "aquarius", symbol: "♒", name: { zh: "水瓶座", en: "Aquarius", id: "Aquarius" } },
  { id: "pisces", symbol: "♓", name: { zh: "双鱼座", en: "Pisces", id: "Pisces" } },
];

const TRANSLATIONS: Record<string, Record<string, string>> = {
  zh: {
    title: "别错过你的运势窗口",
    subtitle: "每天早上8点，获取你的专属运势提醒——包括财运、感情、关键日期",
    emailPlaceholder: "输入您的邮箱地址",
    selectZodiac: "选择您的星座",
    subscribe: "立即获取每日提醒",
    subscribing: "订阅中...",
    success: "订阅成功！",
    successMessage: "明天早上8点，你的第一份运势提醒将送达",
    error: "订阅失败",
    alreadySubscribed: "该邮箱已订阅",
    privacy: "加入12000+订阅者。随时可退订。",
  },
  en: {
    title: "Don't Miss Your Luck Window",
    subtitle: "Every morning at 8 AM, get your personalized horoscope — including money, love, and key dates to watch",
    emailPlaceholder: "Enter your email address",
    selectZodiac: "Select your zodiac sign",
    subscribe: "Get My Daily Alert",
    subscribing: "Subscribing...",
    success: "Subscribed Successfully!",
    successMessage: "Your first daily alert arrives tomorrow at 8 AM",
    error: "Subscription Failed",
    alreadySubscribed: "This email is already subscribed",
    privacy: "Join 12,000+ subscribers. Unsubscribe anytime.",
  },
  id: {
    title: "Jangan Lewatkan Jalan Keberuntungan Anda",
    subtitle: "Setiap pagi jam 8, dapatkan horoskop personal Anda — termasuk uang, cinta, dan tanggal penting",
    emailPlaceholder: "Masukkan alamat email Anda",
    selectZodiac: "Pilih zodiak Anda",
    subscribe: "Dapatkan Peringatan Harian",
    subscribing: "Sedang berlangganan...",
    success: "Berlangganan Berhasil!",
    successMessage: "Peringatan harian pertama Anda tiba besok jam 8 pagi",
    error: "Gagal Berlangganan",
    alreadySubscribed: "Email ini sudah berlangganan",
    privacy: "Bergabung dengan 12.000+ pelanggan. Berhenti kapan saja.",
  },
};

export function EmailSubscribe() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  
  const [email, setEmail] = useState("");
  const [selectedZodiac, setSelectedZodiac] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !selectedZodiac) return;
    
    setStatus("loading");
    setErrorMessage("");
    
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get("ref");
      
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          zodiac: selectedZodiac,
          language,
          ...(ref ? { ref } : {}),
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus("success");
        setEmail("");
        setSelectedZodiac("");
      } else {
        setStatus("error");
        setErrorMessage(data.error || t.error);
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(t.error);
    }
  };

  if (status === "success") {
    return (
      <div className="bg-gradient-to-br from-gray-50/20 to-gray-900/20 rounded-2xl p-8 text-center border border-gray-200">
        <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{t.success}</h3>
        <p className="text-gray-400">{t.successMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50/20 to-gray-900/20 rounded-2xl p-8 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center">
          <Mail className="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{t.title}</h3>
          <p className="text-sm text-gray-400">{t.subtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="subscribe-email" className="sr-only">{t.emailPlaceholder}</label>
          <input
            id="subscribe-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            className="w-full px-4 py-3 bg-gray-50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-500/50 transition-colors"
            required
          />
        </div>

        <div>
          <label htmlFor="subscribe-zodiac" className="sr-only">{t.selectZodiac}</label>
          <select
            id="subscribe-zodiac"
            value={selectedZodiac}
            onChange={(e) => setSelectedZodiac(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gray-500/50 transition-colors appearance-none cursor-pointer"
            required
          >
            <option value="" className="bg-white">{t.selectZodiac}</option>
            {ZODIAC_SIGNS.map((sign) => (
              <option key={sign.id} value={sign.id} className="bg-white">
                {sign.symbol} {sign.name[language]}
              </option>
            ))}
          </select>
        </div>

        {status === "error" && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "loading" || !email || !selectedZodiac}
          className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-600 rounded-xl font-semibold text-white hover:from-gray-500 hover:to-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t.subscribing}
            </>
          ) : (
            t.subscribe
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">{t.privacy}</p>
      </form>
    </div>
  );
}
