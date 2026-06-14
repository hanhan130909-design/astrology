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
    title: "订阅每日运势",
    subtitle: "每天早上8点，获取您的专属星座运势",
    emailPlaceholder: "输入您的邮箱地址",
    selectZodiac: "选择您的星座",
    subscribe: "立即订阅",
    subscribing: "订阅中...",
    success: "订阅成功！",
    successMessage: "请查收确认邮件，明天开始接收每日运势",
    error: "订阅失败",
    alreadySubscribed: "该邮箱已订阅",
    privacy: "我们尊重您的隐私，随时可以取消订阅",
  },
  en: {
    title: "Subscribe to Daily Horoscope",
    subtitle: "Get your personalized horoscope every morning at 8 AM",
    emailPlaceholder: "Enter your email address",
    selectZodiac: "Select your zodiac sign",
    subscribe: "Subscribe Now",
    subscribing: "Subscribing...",
    success: "Subscribed Successfully!",
    successMessage: "Please check your confirmation email. Daily horoscope starts tomorrow",
    error: "Subscription Failed",
    alreadySubscribed: "This email is already subscribed",
    privacy: "We respect your privacy. You can unsubscribe anytime",
  },
  id: {
    title: "Berlangganan Horoskop Harian",
    subtitle: "Dapatkan horoskop personal Anda setiap pagi jam 8",
    emailPlaceholder: "Masukkan alamat email Anda",
    selectZodiac: "Pilih zodiak Anda",
    subscribe: "Berlangganan Sekarang",
    subscribing: "Sedang berlangganan...",
    success: "Berlangganan Berhasil!",
    successMessage: "Silakan cek email konfirmasi. Horoskop harian dimulai besok",
    error: "Gagal Berlangganan",
    alreadySubscribed: "Email ini sudah berlangganan",
    privacy: "Kami menghormati privasi Anda. Bisa berhenti berlangganan kapan saja",
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
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          zodiac: selectedZodiac,
          language,
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
      <div className="bg-gradient-to-br from-purple-50/20 to-pink-900/20 rounded-2xl p-8 text-center border border-purple-200">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{t.success}</h3>
        <p className="text-gray-400">{t.successMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50/20 to-pink-900/20 rounded-2xl p-8 border border-purple-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
          <Mail className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{t.title}</h3>
          <p className="text-sm text-gray-400">{t.subtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
            required
          />
        </div>

        <div>
          <select
            value={selectedZodiac}
            onChange={(e) => setSelectedZodiac(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-colors appearance-none cursor-pointer"
            required
          >
            <option value="" className="bg-gray-900">{t.selectZodiac}</option>
            {ZODIAC_SIGNS.map((sign) => (
              <option key={sign.id} value={sign.id} className="bg-gray-900">
                {sign.symbol} {sign.name[language]}
              </option>
            ))}
          </select>
        </div>

        {status === "error" && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "loading" || !email || !selectedZodiac}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
