"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { generateNatalHook } from "@/lib/natalHookGenerator";
import { Lock, Sparkles, ShieldCheck, TrendingUp } from "lucide-react";

// Gumroad 产品链接（和八字页共用）
const GUMLINKS = {
  single: "https://hanhan55.gumroad.com/l/zgbent",
  fortune: "https://hanhan55.gumroad.com/l/zxccdv",
};

const UI = {
  zh: {
    previewTitle: "你的专属星盘解读报告",
    previewItems: ["性格深度剖析", "感情模式解读", "事业方向分析", "2026年行运指南", "大师一句话点评"],
    locked: "🔒 付费解锁",
    singleBtn: "AI 单次解读 · $3.99",
    fortuneBtn: "完整年运报告 · $19.99",
    originalPrice: "$29.99",
    badge: "限时优惠",
    guarantee: "7天无理由退款",
    social: "已有 1,200+ 人解锁",
  },
  en: {
    previewTitle: "Your Personal Chart Reading Report",
    previewItems: ["Personality Deep Dive", "Relationship Pattern", "Career Direction", "2026 Transit Guide", "Master's One-Line Insight"],
    locked: "🔒 Paid Unlock",
    singleBtn: "AI Single Reading · $3.99",
    fortuneBtn: "Full Annual Report · $19.99",
    originalPrice: "$29.99",
    badge: "Limited Offer",
    guarantee: "7-Day Money Back",
    social: "1,200+ unlocked",
  },
  id: {
    previewTitle: "Laporan Bacaan Bintang Pribadi",
    previewItems: ["Analisis Kepribadian", "Pola Hubungan", "Arah Karier", "Panduan Transit 2026", "Kata Bijak Master"],
    locked: "🔒 Terkunci",
    singleBtn: "Bacaan AI · $3.99",
    fortuneBtn: "Laporan Tahunan · $19.99",
    originalPrice: "$29.99",
    badge: "Promo",
    guarantee: "Garansi 7 Hari",
    social: "1,200+ telah buka",
  },
  th: {
    previewTitle: "รายงานการอ่านดาวส่วนตัว",
    previewItems: ["วิเคราะห์บุคลิก", "รูปแบบความสัมพันธ์", "ทิศทางอาชีพ", "คู่มือ Transit 2026", "คำพูดอาจารย์"],
    locked: "🔒 ล็อก",
    singleBtn: "AI อ่านดวง · $3.99",
    fortuneBtn: "รายงานประจำปี · $19.99",
    originalPrice: "$29.99",
    badge: "โปรโมชั่น",
    guarantee: "คืนเงิน 7 วัน",
    social: "1,200+ เปิดแล้ว",
  },
  vi: {
    previewTitle: "Báo cáo đọc sao cá nhân",
    previewItems: ["Phân tích tính cách", "Mối quan hệ", "Phương hướng sự nghiệp", "Hướng dẫn Vận hạn 2026", "Lời nói thầy"],
    locked: "🔒 Đã khóa",
    singleBtn: "AI Đọc · $3.99",
    fortuneBtn: "Báo cáo năm · $19.99",
    originalPrice: "$29.99",
    badge: "Khuyến mãi",
    guarantee: "Hoàn tiền 7 ngày",
    social: "1,200+ đã mở",
  },
  ms: {
    previewTitle: "Laporan Bacaan Carta Peribadi",
    previewItems: ["Analisis Personaliti", "Pola Hubungan", "Arah Kerjaya", "Panduan Transit 2026", "Kata Mutiara"],
    locked: "🔒 Berkunci",
    singleBtn: "Bacaan AI · $3.99",
    fortuneBtn: "Laporan Tahunan · $19.99",
    originalPrice: "$29.99",
    badge: "Promosi",
    guarantee: "Jaminan 7 Hari",
    social: "1,200+ telah buka",
  },
  ja: {
    previewTitle: "あなただけの星盤リーディング",
    previewItems: ["性格深掘り", "恋愛パターン", "仕事の方向性", "2026年運行ガイド", "達人の一言"],
    locked: "🔒 ロック中",
    singleBtn: "AI単回リーディング · $3.99",
    fortuneBtn: "年間レポート · $19.99",
    originalPrice: "$29.99",
    badge: "期間限定",
    guarantee: "7日間返金保証",
    social: "1,200人以上が解除",
  },
  ko: {
    previewTitle: "당신만의 차트 리딩 리포트",
    previewItems: ["성격 심층 분석", "연애 패턴", "진로 방향", "2026년 행운 가이드", "고수의 한마디"],
    locked: "🔒 잠김",
    singleBtn: "AI 단독 리딩 · $3.99",
    fortuneBtn: "연간 리포트 · $19.99",
    originalPrice: "$29.99",
    badge: "한정 할인",
    guarantee: "7일 환불 보장",
    social: "1,200명 이상 해제",
  },
};

export default function NatalPurchaseCTA({ chart }: { chart?: any }) {
  const { language } = useLanguage();
  const lang = language || "zh";
  const ui = UI[lang] || UI.en;

  const hook = chart ? generateNatalHook(chart, lang) : generateNatalHook(null, lang);
  const recommendFortune = hook.urgency >= 3;
  const mainLink = recommendFortune ? GUMLINKS.fortune : GUMLINKS.single;
  const mainBtnText = recommendFortune ? ui.fortuneBtn : ui.singleBtn;

  return (
    <div className="mt-6 mb-4" style={{ maxWidth: 600 }}>
      <div
        className="relative p-5 rounded-2xl border overflow-hidden"
        style={{
          background: hook.urgency >= 4
            ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fef3c7 100%)"
            : hook.urgency >= 2
            ? "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #eff6ff 100%)"
            : "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 50%, #f9fafb 100%)",
          borderColor: hook.urgency >= 4 ? "#f59e0b" : hook.urgency >= 2 ? "#3b82f6" : "#e5e7eb",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{hook.urgency >= 4 ? "⚠️" : hook.urgency >= 2 ? "📡" : "🔮"}</span>
          <h3 className="text-base font-bold text-gray-900">{hook.title}</h3>
          {hook.urgency >= 4 && (
            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 bg-red-500 text-white rounded-full animate-pulse">
              {lang === "zh" ? "紧急" : lang === "ja" ? "緊急" : "URGENT"}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-700 leading-relaxed mb-4">{hook.hookText}</p>

        {/* 模糊预览 */}
        <div className="relative bg-white/70 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1">
              <Sparkles size={12} className="text-amber-500" />
              {ui.previewTitle}
            </h4>
            <span className="text-[10px] text-gray-400">{ui.locked}</span>
          </div>
          <div className="space-y-2" style={{ filter: "blur(3px)", userSelect: "none", pointerEvents: "none" }}>
            {ui.previewItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                <span className="text-xs text-gray-600">{item}</span>
                <span className="ml-auto text-[10px] text-gray-400">••••••</span>
              </div>
            ))}
            <div className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-[11px] text-amber-700 font-medium">
                {lang === "zh" ? "「大师点评」：你星盘的关键在于……" : "Master's insight: The key to your chart is..."}
              </p>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent rounded-xl pointer-events-none" />
        </div>

        {/* 购买按钮 */}
        <div className="space-y-2">
          <a
            href={mainLink}
            target="_blank"
            rel="noopener"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            style={{
              background: recommendFortune
                ? "linear-gradient(135deg, #171717 0%, #374151 100%)"
                : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              boxShadow: recommendFortune
                ? "0 4px 14px rgba(0,0,0,0.25)"
                : "0 4px 14px rgba(245,158,11,0.4)",
            }}
          >
            <Lock size={14} />
            {mainBtnText}
            {recommendFortune && (
              <span className="flex items-center gap-1 ml-1">
                <span className="text-[10px] line-through opacity-60">{ui.originalPrice}</span>
                <span className="text-[10px] bg-red-500 px-1.5 py-0.5 rounded-full">{ui.badge}</span>
              </span>
            )}
          </a>
          <a
            href={recommendFortune ? GUMLINKS.single : GUMLINKS.fortune}
            target="_blank"
            rel="noopener"
            className="flex items-center justify-center gap-1 w-full py-2 rounded-xl text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-white/50 transition-colors"
          >
            {recommendFortune ? ui.singleBtn : ui.fortuneBtn}
            <TrendingUp size={11} />
          </a>
        </div>

        <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-gray-400">
          <span className="flex items-center gap-1">
            <ShieldCheck size={11} />
            {ui.guarantee}
          </span>
          <span className="w-px h-3 bg-gray-300" />
          <span>{ui.social}</span>
        </div>
      </div>
    </div>
  );
}
