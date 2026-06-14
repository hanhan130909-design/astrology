"use client";

import { useState } from "react";

interface PremiumFeaturesProps {
  language?: "id" | "en" | "zh";
}

export default function PremiumFeatures({ language = "id" }: PremiumFeaturesProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");

  const t = {
    id: {
      title: "✨ Fitur Premium",
      subtitle: "Buka semua fitur dan dapatkan analisis lebih mendalam",
      monthly: "Bulanan",
      yearly: "Tahunan",
      yearlyDiscount: "Hemat 20%",
      price: "Rp 29.000",
      priceYearly: "Rp 279.000",
      perMonth: "/bulan",
      perYear: "/tahun",
      features: [
        "Bagan lahir lengkap dengan 10 planet",
        "Analisis aspek terperinci",
        "Ramalan mingguan dan bulanan",
        "Kecocokan pasangan mendalam",
        "Tanpa iklan",
        "Prioritas dukungan",
      ],
      cta: "Mulai Uji Coba Gratis",
      guarantee: "7 hari uji coba gratis, batalkan kapan saja",
    },
    en: {
      title: "✨ Premium Features",
      subtitle: "Unlock all features and get deeper insights",
      monthly: "Monthly",
      yearly: "Yearly",
      yearlyDiscount: "Save 20%",
      price: "$3.99",
      priceYearly: "$38.99",
      perMonth: "/month",
      perYear: "/year",
      features: [
        "Complete birth chart with 10 planets",
        "Detailed aspect analysis",
        "Weekly and monthly forecasts",
        "In-depth compatibility analysis",
        "Ad-free experience",
        "Priority support",
      ],
      cta: "Start Free Trial",
      guarantee: "7-day free trial, cancel anytime",
    },
    zh: {
      title: "✨ 高级功能",
      subtitle: "解锁所有功能，获得更深入的分析",
      monthly: "月付",
      yearly: "年付",
      yearlyDiscount: "节省20%",
      price: "¥9.9",
      priceYearly: "¥95",
      perMonth: "/月",
      perYear: "/年",
      features: [
        "完整星盘含10大行星",
        "详细相位分析",
        "每周每月运势预测",
        "深度配对分析",
        "无广告体验",
        "优先客服支持",
      ],
      cta: "开始免费试用",
      guarantee: "7天免费试用，随时取消",
    },
  }[language];

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-900/30 to-purple-900/40 border border-amber-500/30">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-amber-100 mb-2">{t.title}</h3>
        <p className="text-purple-200/60">{t.subtitle}</p>
      </div>

      {/* 计划选择 */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setSelectedPlan("monthly")}
          className={`px-6 py-2 rounded-full transition-all ${
            selectedPlan === "monthly"
              ? "bg-gradient-to-r from-amber-500 to-purple-600 text-white"
              : "bg-purple-900/50 text-purple-200 border border-purple-200"
          }`}
        >
          {t.monthly}
        </button>
        <button
          onClick={() => setSelectedPlan("yearly")}
          className={`px-6 py-2 rounded-full transition-all relative ${
            selectedPlan === "yearly"
              ? "bg-gradient-to-r from-amber-500 to-purple-600 text-white"
              : "bg-purple-900/50 text-purple-200 border border-purple-200"
          }`}
        >
          {t.yearly}
          <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">
            {t.yearlyDiscount}
          </span>
        </button>
      </div>

      {/* 价格 */}
      <div className="text-center mb-6">
        <span className="text-4xl font-bold text-amber-100">
          {selectedPlan === "monthly" ? t.price : t.priceYearly}
        </span>
        <span className="text-purple-300">
          {selectedPlan === "monthly" ? t.perMonth : t.perYear}
        </span>
      </div>

      {/* 功能列表 */}
      <ul className="space-y-3 mb-6">
        {t.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3 text-purple-200">
            <span className="text-green-400">✓</span>
            {feature}
          </li>
        ))}
      </ul>

      {/* 订阅按钮 */}
      <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-purple-600 rounded-lg font-semibold hover:from-amber-400 hover:to-purple-500 transition-all mb-3">
        {t.cta}
      </button>

      <p className="text-center text-xs text-purple-300/60">{t.guarantee}</p>
    </div>
  );
}