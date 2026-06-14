"use client";

import Link from "next/link";
import { useLanguage, translations } from "@/contexts/LanguageContext";

const COLORS = {
  midnightBlue: "#0f172a",
  deepNavy: "#1e293b",
  navyBorder: "#334155",
  champagneGold: "#d4a574",
  warmGold: "#f5d89a",
  creamWhite: "#fef3e2",
  softBlue: "#64748b",
};

export default function AboutPage() {
  const { language, setLanguage } = useLanguage();
  const t = (translations as Record<string, any>)[language] || translations.zh;

  return (
    <div className="min-h-screen text-gray-900" style={{ background: `linear-gradient(180deg, ${COLORS.midnightBlue} 0%, ${COLORS.deepNavy} 50%, ${COLORS.midnightBlue} 100%)` }}>
      {/* Navigation */}
      

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-16" style={{ color: COLORS.warmGold }}>{t.about.title}</h1>

        {/* What Is This */}
        <section className="mb-16">
          <div 
            className="p-8 rounded-2xl"
            style={{ 
              background: `linear-gradient(135deg, ${COLORS.deepNavy} 0%, ${COLORS.midnightBlue} 100%)`,
              border: `1px solid ${COLORS.champagneGold}`,
              borderLeft: `4px solid ${COLORS.champagneGold}`
            }}
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">🔬</div>
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.champagneGold }}>{t.about.what}</h2>
                <p className="leading-relaxed whitespace-pre-line" style={{ color: COLORS.creamWhite }}>{t.about.whatDesc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* What Is This NOT */}
        <section className="mb-16">
          <div 
            className="p-8 rounded-2xl"
            style={{ 
              background: `linear-gradient(135deg, ${COLORS.deepNavy} 0%, ${COLORS.midnightBlue} 100%)`,
              border: `1px solid #dc2626`,
              borderLeft: `4px solid #dc2626`
            }}
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">⚠️</div>
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "#fca5a5" }}>{t.about.not}</h2>
                <p className="leading-relaxed whitespace-pre-line" style={{ color: COLORS.creamWhite }}>{t.about.notDesc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <div 
            className="p-8 rounded-2xl"
            style={{ 
              background: `linear-gradient(135deg, ${COLORS.deepNavy} 0%, ${COLORS.midnightBlue} 100%)`,
              border: `1px solid ${COLORS.navyBorder}`,
              borderLeft: `4px solid #22c55e`
            }}
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">⚙️</div>
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "#86efac" }}>{t.about.how}</h2>
                <p className="leading-relaxed whitespace-pre-line" style={{ color: COLORS.creamWhite }}>{t.about.howDesc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section className="mb-16">
          <div 
            className="p-8 rounded-2xl"
            style={{ 
              backgroundColor: COLORS.deepNavy,
              border: `1px solid ${COLORS.navyBorder}`
            }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: COLORS.champagneGold }}>
              {language === "zh" ? "技术说明" : language === "id" ? "Informasi Teknis" : "Technical Details"}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span style={{ color: COLORS.champagneGold }}>📡</span>
                <span style={{ color: COLORS.creamWhite }}>
                  {language === "zh" 
                    ? "算法库: astronomy-engine (专业天文计算库)" 
                    : language === "id" 
                    ? "Library: astronomy-engine (library kalkulasi astronomi profesional)" 
                    : "Algorithm: astronomy-engine (professional astronomy calculation library)"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span style={{ color: COLORS.champagneGold }}>🌍</span>
                <span style={{ color: COLORS.creamWhite }}>
                  {language === "zh" 
                    ? "坐标系统: 黄道坐标 (Ecliptic coordinates)" 
                    : language === "id" 
                    ? "Sistem Koordinat: Koordinat ekliptika" 
                    : "Coordinate System: Ecliptic coordinates"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span style={{ color: COLORS.champagneGold }}>🏠</span>
                <span style={{ color: COLORS.creamWhite }}>
                  {language === "zh" 
                    ? "宫位系统: Placidus (经典宫位划分)" 
                    : language === "id" 
                    ? "Sistem Rumah: Placidus" 
                    : "House System: Placidus"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span style={{ color: COLORS.champagneGold }}>⚖️</span>
                <span style={{ color: COLORS.creamWhite }}>
                  {language === "zh" 
                    ? "相位容许度: 标准占星学设定" 
                    : language === "id" 
                    ? "Orb Aspek: Pengaturan astrologi standar" 
                    : "Aspect Orbs: Standard astrology settings"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link 
            href="/chart" 
            className="inline-block px-8 py-4 rounded-full font-semibold transition-all text-lg"
            style={{ 
              background: `linear-gradient(135deg, ${COLORS.champagneGold} 0%, ${COLORS.warmGold} 100%)`,
              color: COLORS.midnightBlue
            }}
          >
            {language === "zh" ? "开始计算你的星盘" : language === "id" ? "Hitung Bagan Bintang Anda" : "Calculate Your Birth Chart"} ✨
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 text-center" style={{ borderTop: `1px solid ${COLORS.navyBorder}`, backgroundColor: `rgba(15, 23, 42, 0.5)` }}>
        <p className="text-sm" style={{ color: COLORS.softBlue }}>© 2026 {t.siteName}. All rights reserved.</p>
      </footer>
    </div>
  );
}
