"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Compass, Star, DoorOpen, Clock, Sparkles } from "lucide-react";

const T: Record<string, any> = {
  zh: {
    title: "奇门遁甲",
    subtitle: "时空能量布局 · 帝王之术",
    intro: "奇门遁甲是中国古代最高层次的预测学和运筹学，被誉为「帝王之术」。它以时间、空间、数理三大要素为基础，通过九星、八门、八神的排列组合，揭示特定时空的能量格局。",
    sections: [
      { icon: "clock", title: "时间维度", desc: "以节气定局数，阴阳遁顺逆排布，精准定位每一刻的时空能量。" },
      { icon: "compass", title: "空间维度", desc: "九宫八卦定方位，八门开启不同领域的吉凶能量通道。" },
      { icon: "star", title: "九星能量", desc: "天蓬、天芮、天冲等九星映射自然力量，影响决策与行动。" },
      { icon: "door", title: "八门吉凶", desc: "休、生、伤、杜、景、死、惊、开——八门对应人事八面，选择决定成败。" },
    ],
    cta: "奇门排盘功能开发中——先用八字排盘了解你的命局",
    ctaBtn: "免费八字排盘 →",
    learn: "了解更多奇门知识",
  },
  en: {
    title: "Qi Men Dun Jia",
    subtitle: "The Art of Time-Space Strategy",
    intro: "Qi Men Dun Jia is the highest form of Chinese divination and strategic planning, known as the Art of Kings. It integrates time, space, and numerology through 9 Stars, 8 Gates, and 8 Deities to reveal the energy patterns of any given moment.",
    sections: [
      { icon: "clock", title: "Time Dimension", desc: "Solar terms determine the chart structure. Yin/Yang遁 determines the direction of energy flow." },
      { icon: "compass", title: "Space Dimension", desc: "The 9 Palaces and 8 Trigrams map spatial energy. Each direction holds unique power." },
      { icon: "star", title: "Nine Stars", desc: "Tian Peng, Tian Rui, Tian Chong and more — each star governs a type of natural force." },
      { icon: "door", title: "Eight Gates", desc: "Rest, Life, Injury, Obstruction, View, Death, Fright, Open — the 8 Gates reveal opportunity and risk." },
    ],
    cta: "Qi Men chart calculator coming soon. Start with your free BaZi reading.",
    ctaBtn: "Free BaZi Chart →",
    learn: "Learn More About Qi Men",
  },
  id: {
    title: "Qi Men Dun Jia",
    subtitle: "Seni Strategi Ruang-Waktu",
    intro: "Qi Men Dun Jia adalah bentuk tertinggi ramalan dan perencanaan strategis Tiongkok, dikenal sebagai Seni Para Raja. Mengintegrasikan waktu, ruang, dan numerologi melalui 9 Bintang, 8 Gerbang, dan 8 Dewa.",
    sections: [
      { icon: "clock", title: "Dimensi Waktu", desc: "Istilah matahari menentukan struktur bagan. Yin/Yang遁 menentukan arah aliran energi." },
      { icon: "compass", title: "Dimensi Ruang", desc: "9 Istana dan 8 Trigram memetakan energi spasial. Setiap arah memiliki kekuatan unik." },
      { icon: "star", title: "Sembilan Bintang", desc: "Tian Peng, Tian Rui, Tian Chong dan lainnya — setiap bintang mengatur jenis kekuatan alam." },
      { icon: "door", title: "Delapan Gerbang", desc: "Istirahat, Kehidupan, Cedera, Rintangan, Pandangan, Kematian, Ketakutan, Terbuka." },
    ],
    cta: "Kalkulator Qi Men segera hadir. Mulai dengan bacaan BaZi gratis Anda.",
    ctaBtn: "BaZi Gratis →",
    learn: "Pelajari Lebih Lanjut",
  },
};

const icons: Record<string, any> = { clock: Clock, compass: Compass, star: Star, door: DoorOpen };

export default function QiMenPage() {
  const { language } = useLanguage();
  const t = T[language] || T.en;

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      <main className="max-w-[1100px] mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-14">
          <span className="inline-block text-[11px] font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
            <Sparkles size={12} className="inline mr-1" /> {t.subtitle}
          </span>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-[-1.5px] mb-3">{t.title}</h1>
          <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">{t.intro}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-[800px] mx-auto mb-14">
          {t.sections.map((s: any, i: number) => {
            const Icon = icons[s.icon];
            return (
              <div key={i} className="flex gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-[#171717] flex items-center justify-center">
                  <Icon size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">{t.cta}</p>
          <Link href="/bazi" className="inline-block no-underline text-sm font-medium px-8 py-3 bg-[#171717] text-white rounded-md hover:bg-black transition-colors">
            {t.ctaBtn}
          </Link>
          <p className="mt-6">
            <Link href="/blog/qimen-dun-jia-beginner-guide" className="text-xs text-blue-600 hover:underline">{t.learn} →</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
