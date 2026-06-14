"use client";

import Link from "next/link";
import AIReading from "@/components/AIReading";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, Brain, Zap, MessageSquare, Shield, Globe } from "lucide-react";

const T: Record<string, Record<string, any>> = {
  zh: {
    title: "AI 星盘解读",
    subtitle: "用人工智能深度解读你的星盘",
    badge: "PRO AI 智能服务",
    intro: "基于大语言模型的星盘解读引擎，结合天文数据和占星学知识，为你提供个性化、深入的星盘分析报告。",
    features: [
      { icon: "🧠", title: "深度解读", desc: "覆盖行星、宫位、相位的多层次分析" },
      { icon: "⚡", title: "实时生成", desc: "AI模型即时分析，无需等待" },
      { icon: "🎯", title: "个性定制", desc: "基于你的出生数据，生成专属解读" },
      { icon: "💬", title: "交互问答", desc: "追问星盘细节，获得更深入的答案" },
      { icon: "🔒", title: "隐私保护", desc: "你的出生数据不会被用于训练模型" },
      { icon: "🌍", title: "多语言支持", desc: "中文、英文、印尼语等多种语言" },
    ],
    cta: "开始AI解读",
    tip: "提示：建议先生成本命盘（/natal），获得完整的出生数据后再使用AI解读",
  },
  en: {
    title: "AI Chart Reading",
    subtitle: "Deep astrological insights powered by AI",
    badge: "PRO AI Service",
    intro: "An AI-powered chart reading engine that combines astronomical data with astrological knowledge for personalized, in-depth analysis.",
    features: [
      { icon: "🧠", title: "Deep Analysis", desc: "Multi-level planet, house, aspect analysis" },
      { icon: "⚡", title: "Real-time", desc: "Instant AI analysis, no waiting" },
      { icon: "🎯", title: "Personalized", desc: "Custom reading based on your birth data" },
      { icon: "💬", title: "Interactive Q&A", desc: "Ask follow-up questions for deeper insights" },
      { icon: "🔒", title: "Privacy", desc: "Your data won't be used for model training" },
      { icon: "🌍", title: "Multi-language", desc: "Chinese, English, Indonesian support" },
    ],
    cta: "Start AI Reading",
    tip: "Tip: Generate your natal chart first (/natal) for complete birth data before AI reading",
  },
  id: {
    title: "AI Pembacaan Bintang",
    subtitle: "Wawasan astrologi mendalam dengan AI",
    badge: "PRO Layanan AI",
    intro: "Mesin pembacaan bagan bertenaga AI yang menggabungkan data astronomi dengan pengetahuan astrologi.",
    features: [
      { icon: "🧠", title: "Analisis Mendalam", desc: "Analisis planet, rumah, aspek multi-level" },
      { icon: "⚡", title: "Real-time", desc: "Analisis AI instan" },
      { icon: "🎯", title: "Personalisasi", desc: "Bacaan khusus berdasarkan data lahir Anda" },
      { icon: "💬", title: "Tanya Jawab", desc: "Ajukan pertanyaan lanjutan" },
      { icon: "🔒", title: "Privasi", desc: "Data Anda tidak digunakan untuk pelatihan" },
      { icon: "🌍", title: "Multi-bahasa", desc: "Dukungan Mandarin, Inggris, Indonesia" },
    ],
    cta: "Mulai AI Reading",
    tip: "Tip: Buat bagan lahir dulu (/natal) untuk data lengkap sebelum AI reading",
  },
};

const labels: Record<string, { back: string }> = {
  id: { back: "← Beranda" },
  en: { back: "← Home" },
  zh: { back: "← 返回首页" },
};

export default function AIPage() {
  const { language } = useLanguage();
  const t = T[language] || T.zh;
  const l = labels[language] || labels.zh;

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-sm text-purple-600 mb-4">
            <Sparkles size={16} />
            {t.badge}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t.title}</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">{t.subtitle}</p>
          <p className="text-gray-400 max-w-xl mx-auto mt-4 text-sm leading-relaxed">{t.intro}</p>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {t.features.map((f, i) => (
            <div key={i} className="p-6 rounded-xl bg-purple-50 border border-purple-100 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* AI Component */}
        <div className="max-w-3xl mx-auto">
          <AIReading language={language} />
        </div>

        {/* Tip */}
        <div className="text-center mt-12 pb-8">
          <div className="inline-flex items-center gap-2 px-5 py-3 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-700">
            <Sparkles size={16} />
            {t.tip}
          </div>
          <div className="mt-4">
            <Link href="/natal" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              → 先生成本命盘
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
