"use client";

import Link from "next/link";
import { useLanguage, translations } from "@/contexts/LanguageContext";

export default function AboutPage() {
  const { language } = useLanguage();
  const t = (translations as Record<string, any>)[language] || translations.en;

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-700">{t.about?.title || "关于星缘"}</h1>
        <p className="text-center text-gray-500 mb-16 max-w-xl mx-auto">
          {t.about?.subtitle || "A professional astrology platform based on real astronomical calculations"}
        </p>

        {/* 品牌故事 */}
        <section className="mb-12 p-8 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="text-3xl">✨</div>
            <div>
              <h2 className="text-xl font-bold mb-3 text-gray-700">{t.about?.what || "星缘是什么"}</h2>
              <p className="leading-relaxed text-gray-600">
                {t.about?.whatDesc || "星缘是一个基于专业天文计算引擎的在线占星平台。我们使用 astronomy-engine 算法库，精确计算行星位置、宫位系统和相位关系，为你提供专业级的星盘分析。"}
              </p>
            </div>
          </div>
        </section>

        {/* 定位说明 */}
        <section className="mb-12 p-8 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🎯</div>
            <div>
              <h2 className="text-xl font-bold mb-3 text-gray-600">{t.about?.not || "星缘不是什么"}</h2>
              <p className="leading-relaxed text-gray-600">
                {t.about?.notDesc || "星缘不是迷信算命工具，不是娱乐性格测试。我们提供基于天文学数据的专业占星解读，帮助你理解星盘中的能量模式与人生趋势。"}
              </p>
            </div>
          </div>
        </section>

        {/* 工作原理 */}
        <section className="mb-12 p-8 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="text-3xl">⚙️</div>
            <div>
              <h2 className="text-xl font-bold mb-3 text-gray-700">{t.about?.how || "如何工作"}</h2>
              <p className="leading-relaxed text-gray-600">
                {t.about?.howDesc || "输入你的出生日期、时间和地点，系统调用 astronomy-engine 计算精确的行星黄道位置，结合宫位系统和相位算法，生成完整的星盘报告。"}
              </p>
            </div>
          </div>
        </section>

        {/* 功能概览 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">{t.about?.features?.title || "Core Features"}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {(t.about?.featureCards || [
              { emoji:"🪐", title:"Natal Chart", desc:"Complete planetary positions, houses, and aspects in-depth analysis" },
              { emoji:"🔮", title:"Transit Chart", desc:"Transit tracking, solar return, lunar return" },
              { emoji:"💫", title:"Compatibility", desc:"Composite chart, synastry, relationship aspects" },
              { emoji:"🤖", title:"AI Reading", desc:"LLM-powered intelligent chart interpretation" },
              { emoji:"📅", title:"Fortune Calendar", desc:"Daily, monthly, and yearly horoscope reports" },
              { emoji:"🃏", title:"Tarot Reading", desc:"78 classic tarot card spreads" },
            ] as Array<{emoji:string;title:string;desc:string}>).map((f, i) => (
              <div key={i} className="p-6 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-2xl mb-3">{f.emoji}</div>
                <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 技术说明 */}
        <section className="mb-16 p-8 rounded-2xl bg-gray-50 border border-gray-200">
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            {language === "zh" ? "技术说明" : language === "id" ? "Informasi Teknis" : "Technical Details"}
          </h2>
          <div className="space-y-3">
            {[
              { icon:"📡", zh:"算法库: astronomy-engine (专业天文计算库)", en:"Algorithm: astronomy-engine", id:"Library: astronomy-engine" },
              { icon:"🌍", zh:"坐标系统: 黄道坐标 (Ecliptic coordinates)", en:"Coordinate: Ecliptic coordinates", id:"Koordinat: Ekliptika" },
              { icon:"🏠", zh:"宫位系统: Placidus / Porphyry / 等宫制 / 整宫制", en:"House: Placidus/Porphyry/Equal/Whole", id:"Rumah: Placidus/Porphyry" },
              { icon:"⚖️", zh:"相位容许度: 标准占星学设定", en:"Orbs: Standard astrology", id:"Orb: Standar astrologi" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span>{item.icon}</span>
                <span className="text-gray-600">
                  {language === "zh" ? item.zh : language === "id" ? item.id : item.en}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/natal"
            className="inline-block px-8 py-4 rounded-full font-semibold text-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors shadow-lg shadow-gray-200"
          >
            {language === "zh" ? "立即生成你的星盘" : language === "id" ? "Hitung Bagan Anda" : "Generate Your Chart"} ✨
          </Link>
        </div>
      </main>

      <footer className="py-8 px-4 text-center border-t border-gray-100 bg-gray-50">
        <p className="text-sm text-gray-400">© 2026 {t.siteName || "Starry Fate"}. All rights reserved.</p>
      </footer>
    </div>
  );
}
