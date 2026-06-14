"use client";

import PageNav from "@/components/PageNav";
import SwissEphemerisDemo from "@/components/SwissEphemerisDemo";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SwissEphemerisPage() {
  const { language } = useLanguage();

  const titles: Record<string, Record<string, string>> = {
    zh: { title: "瑞士星历表", subtitle: "专业级天文计算引擎" },
    en: { title: "Swiss Ephemeris", subtitle: "Professional astronomical calculation engine" },
    id: { title: "Swiss Ephemeris", subtitle: "Mesin kalkulasi astronomi profesional" },
    th: { title: "ตารางดาว Swiss", subtitle: "เครื่องมือคำนวณดาราศาสตร์ระดับมืออาชีพ" },
    vi: { title: "Bảng Thiên Văn Thụy Sĩ", subtitle: "Công cụ tính thiên văn chuyên nghiệp" },
    ms: { title: "Jadual Swiss", subtitle: "Enjin pengiraan astronomi profesional" },
    ja: { title: "スイス・エフェメリス", subtitle: "プロフェッショナル天文学計算エンジン" },
    ko: { title: "스위스 천문학력", subtitle: "전문 천문학 계산 엔진" }};

  const t = titles[language] || titles.zh;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] via-[#1a1a3a] to-[#f8fafc] text-white">
      <PageNav title={t.title} subtitle={t.subtitle} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <SwissEphemerisDemo language={language} />
      </div>
    </div>
  );
}
