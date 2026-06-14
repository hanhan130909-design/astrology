"use client";

import { useState } from "react";
import Link from "next/link";

const signs = [
  { id: "aries", symbol: "♈", name: "Aries" },
  { id: "taurus", symbol: "♉", name: "Taurus" },
  { id: "gemini", symbol: "♊", name: "Gemini" },
  { id: "cancer", symbol: "♋", name: "Cancer" },
  { id: "leo", symbol: "♌", name: "Leo" },
  { id: "virgo", symbol: "♍", name: "Virgo" },
  { id: "libra", symbol: "♎", name: "Libra" },
  { id: "scorpio", symbol: "♏", name: "Scorpio" },
  { id: "sagittarius", symbol: "♐", name: "Sagittarius" },
  { id: "capricorn", symbol: "♑", name: "Capricorn" },
  { id: "aquarius", symbol: "♒", name: "Aquarius" },
  { id: "pisces", symbol: "♓", name: "Pisces" },
];

// 月度运势
const monthlyHoroscope: Record<string, { 
  overview: string; 
  love: string; 
  career: string; 
  health: string; 
  finance: string;
  highlight: string;
  caution: string;
}> = {
  aries: {
    overview: "April brings dynamic energy and new beginnings. Mars fuels your ambitions, making this an excellent month for launching projects.",
    love: "Passion intensifies mid-month. Single Aries may encounter someone exciting at a social event. Couples should plan quality time.",
    career: "Leadership opportunities arise. Your initiative catches the attention of superiors. A promotion or raise is possible.",
    health: "High energy supports fitness goals. Watch for headaches from stress. Practice relaxation techniques.",
    finance: "Unexpected income possible. Good time for investments. Avoid impulse purchases.",
    highlight: "Career breakthrough around the 15th",
    caution: "Avoid conflicts on the 22nd"
  },
  taurus: {
    overview: "Venus enhances your natural charm. Focus on building stability and comfort. Financial matters improve significantly.",
    love: "Romance blooms. Existing relationships deepen. Single Taurus attracts admirers through artistic or social activities.",
    career: "Steady progress in career. Your reliability is noticed. A practical approach solves a long-standing problem.",
    health: "Focus on diet and nutrition. Outdoor activities bring peace. Avoid overindulgence in comfort foods.",
    finance: "Excellent for financial planning. Investments yield returns. Consider long-term savings.",
    highlight: "Financial opportunity near the 10th",
    caution: "Don't be too stubborn in negotiations"
  },
  gemini: {
    overview: "Mercury energizes communication. Networking brings opportunities. Mental pursuits are highly favored.",
    love: "Intellectual connections strengthen bonds. Stimulating conversations lead to deeper intimacy. Avoid surface-level interactions.",
    career: "Communication projects succeed. Writing, speaking, or teaching opportunities arise. Collaborate with others.",
    health: "Mental health needs attention. Balance activity with rest. Breathing exercises help anxiety.",
    finance: "Multiple income streams possible. Quick thinking leads to profits. Track expenses carefully.",
    highlight: "Important conversation around the 18th",
    caution: "Avoid spreading yourself too thin"
  },
  cancer: {
    overview: "The Moon enhances intuition. Home and family take priority. Emotional healing occurs this month.",
    love: "Deep emotional bonds strengthen. Family matters influence relationships. Past loves may resurface for closure.",
    career: "Work from home opportunities. Behind-the-scenes efforts pay off. Trust your instincts in decisions.",
    health: "Focus on emotional wellbeing. Self-care routines help. Water activities bring peace.",
    finance: "Property matters favor you. Family support available. Save for future security.",
    highlight: "Home improvement success near the 25th",
    caution: "Don't let emotions cloud judgment"
  },
  leo: {
    overview: "The Sun illuminates your sign, bringing recognition and joy. Creative projects flourish. Social life sparkles.",
    love: "Romance is dramatic and fulfilling. You attract admirers effortlessly. Express love generously.",
    career: "Public recognition comes naturally. Creative work gets noticed. Leadership roles become available.",
    health: "Vitality is high. Physical activities bring joy. Watch for burnout from overexertion.",
    finance: "Entertainment expenses rise. Generous impulses help others. Plan for long-term goals.",
    highlight: "Creative breakthrough around the 12th",
    caution: "Avoid arrogance in success"
  },
  virgo: {
    overview: "Mercury sharpens analytical abilities. Detail-oriented work succeeds. Health improvements occur.",
    love: "Practical expressions of love appreciated. Service to partner strengthens bonds. Quality over quantity in dating.",
    career: "Organizational skills shine. Efficiency improvements noticed. Health or service sector opportunities.",
    health: "Health regimes show results. Dietary changes benefit. Mental health improves through order.",
    finance: "Budgeting pays off. Small savings accumulate. Practical investments favored.",
    highlight: "Health improvement near the 8th",
    caution: "Don't be overly critical of others"
  },
  libra: {
    overview: "Venus enhances harmony and beauty. Relationships flourish. Artistic pursuits bring joy.",
    love: "Partnerships deepen. Balance in relationships achieved. Marriage or commitment possible for some.",
    career: "Diplomacy skills advance career. Collaborations succeed. Legal matters resolve favorably.",
    health: "Balance is key. Beauty treatments boost confidence. Kidney health needs attention.",
    finance: "Partnership finances improve. Fair deals possible. Art purchases bring value.",
    highlight: "Relationship milestone around the 20th",
    caution: "Don't avoid necessary confrontations"
  },
  scorpio: {
    overview: "Pluto brings transformation. Deep changes occur. Hidden matters come to light.",
    love: "Intense emotions surface. Trust deepens in committed relationships. Secrets may be revealed.",
    career: "Research and investigation succeed. Power increases at work. Transformation in career path.",
    health: "Reproductive health focus. Emotional intensity affects body. Release techniques help.",
    finance: "Shared resources in focus. Inheritance or loans possible. Joint investments benefit.",
    highlight: "Personal transformation near the 15th",
    caution: "Avoid manipulation in relationships"
  },
  sagittarius: {
    overview: "Jupiter expands horizons. Travel and education favored. Optimism returns.",
    love: "Adventure in love. Long-distance connections possible. Freedom and commitment balance needed.",
    career: "International opportunities arise. Teaching or publishing success. Expansion in business.",
    health: "Outdoor activities benefit. Thigh and hip health focus. Maintain exercise routine.",
    finance: "Foreign investments favor. Education expenses worthwhile. Abundance mindset helps.",
    highlight: "Travel opportunity around the 5th",
    caution: "Don't overcommit to plans"
  },
  capricorn: {
    overview: "Saturn brings discipline and achievement. Career peaks. Long-term plans solidify.",
    love: "Serious commitments form. Authority attracts partners. Long-term relationship goals advance.",
    career: "Professional achievements multiply. Authority recognized. Business structures strengthen.",
    health: "Bones and joints need care. Structured exercise helps. Work-life balance essential.",
    finance: "Investments mature. Business income increases. Long-term planning pays off.",
    highlight: "Career achievement near the 28th",
    caution: "Make time for relaxation"
  },
  aquarius: {
    overview: "Uranus brings innovation and change. Technology aids success. Community connections grow.",
    love: "Unconventional connections form. Friendship turns to romance. Independence in relationships valued.",
    career: "Technology projects succeed. Innovation recognized. Group collaborations flourish.",
    health: "Circulation health focus. Unconventional healing helps. Stress affects nervous system.",
    finance: "Technology investments profit. Unexpected income possible. Group financial ventures.",
    highlight: "Innovation success around the 11th",
    caution: "Stay grounded in relationships"
  },
  pisces: {
    overview: "Neptune enhances intuition and creativity. Spiritual growth deepens. Dreams bring messages.",
    love: "Soul connections form. Compassion deepens bonds. Idealistic love possible.",
    career: "Creative work flourishes. Healing professions benefit. Intuition guides decisions.",
    health: "Feet and immune system focus. Water therapies help. Sleep quality important.",
    finance: "Artistic income increases. Intuition guides investments. Generosity brings returns.",
    highlight: "Creative breakthrough near the 19th",
    caution: "Stay practical in money matters"
  },
};

export default function MonthlyHoroscope() {
  const [selectedSign, setSelectedSign] = useState("aries");

  const currentData = monthlyHoroscope[selectedSign];
  const currentSign = signs.find(s => s.id === selectedSign);

  return (
    <div className="w-full space-y-6">
      {/* 星座选择 */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {signs.map((sign) => (
          <button
            key={sign.id}
            onClick={() => setSelectedSign(sign.id)}
            className={`p-3 rounded-xl text-center transition-all ${
              selectedSign === sign.id
                ? "bg-gradient-to-br from-amber-500/30 to-purple-600/30 border-2 border-amber-400"
                : "bg-purple-900/30 border border-purple-200 hover:border-purple-400/50"
            }`}
          >
            <div className="text-2xl">{sign.symbol}</div>
            <div className="text-xs text-purple-200">{sign.name}</div>
          </button>
        ))}
      </div>

      {/* 月度运势展示 */}
      {currentData && (
        <div className="space-y-4">
          {/* 星座标题 */}
          <div className="text-center p-4 rounded-2xl bg-gradient-to-r from-amber-900/30 to-purple-900/30 border border-amber-500/30">
            <h3 className="text-2xl font-bold text-amber-100">{currentSign?.symbol} {currentSign?.name} - April 2026</h3>
          </div>

          {/* 总览 */}
          <div className="p-4 rounded-xl bg-purple-900/30 border border-purple-200">
            <p className="text-purple-200 leading-relaxed">{currentData.overview}</p>
          </div>

          {/* 详细内容 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-pink-900/30 border border-pink-500/20">
              <h4 className="text-pink-100 font-semibold mb-2">💕 Love & Relationships</h4>
              <p className="text-purple-200 text-sm">{currentData.love}</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-900/30 border border-blue-500/20">
              <h4 className="text-blue-100 font-semibold mb-2">💼 Career & Work</h4>
              <p className="text-purple-200 text-sm">{currentData.career}</p>
            </div>
            <div className="p-4 rounded-xl bg-green-900/30 border border-green-500/20">
              <h4 className="text-green-100 font-semibold mb-2">💪 Health & Wellness</h4>
              <p className="text-purple-200 text-sm">{currentData.health}</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-900/30 border border-amber-500/20">
              <h4 className="text-amber-100 font-semibold mb-2">💰 Finance & Money</h4>
              <p className="text-purple-200 text-sm">{currentData.finance}</p>
            </div>
          </div>

          {/* 亮点和注意 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30">
              <h4 className="text-green-300 font-semibold mb-1">⭐ Highlight</h4>
              <p className="text-green-100">{currentData.highlight}</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-500/30">
              <h4 className="text-orange-300 font-semibold mb-1">⚠️ Caution</h4>
              <p className="text-orange-100">{currentData.caution}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}