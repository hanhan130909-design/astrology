"use client";

import { useState } from "react";

// 配对数据
const compatibilityData: Record<string, Record<string, { score: number; love: number; communication: number; trust: number; summary: string; detail: string }>> = {
  aries: {
    aries: { score: 70, love: 75, communication: 65, trust: 60, summary: "激情四射但需要磨合", detail: "两个火象星座在一起，激情与火花并存。你们都充满活力和冒险精神，但也都想要主导权。学会妥协是关键。" },
    taurus: { score: 55, love: 60, communication: 50, trust: 55, summary: "节奏不同需要耐心", detail: "火象的白羊遇上土象的金牛，节奏差异明显。白羊想要快，金牛喜欢慢。需要互相理解和包容。" },
    gemini: { score: 85, love: 90, communication: 95, trust: 70, summary: "完美搭档", detail: "风象的双子能跟上白羊的快节奏，你们在一起永远不缺话题和乐趣。沟通是你们的强项，但需要建立更深的信任。" },
    cancer: { score: 45, love: 55, communication: 40, trust: 50, summary: "需要互相理解", detail: "直接的火象与敏感的水象需要学习彼此的语言。白羊需要更温柔，巨蟹需要更直接。" },
    leo: { score: 95, love: 98, communication: 90, trust: 85, summary: "天作之合", detail: "两个火象星座的完美组合！狮子的戏剧性与白羊的行动力完美互补。你们在一起充满激情和欢乐。" },
    virgo: { score: 50, love: 55, communication: 60, trust: 55, summary: "需要时间磨合", detail: "冲动与谨慎的组合。处女的分析能力能帮助白羊，但白羊需要学会耐心。" },
    libra: { score: 75, love: 85, communication: 80, trust: 65, summary: "互补的组合", detail: "白羊的直接与天秤的优雅形成有趣对比。天秤能教会白羊外交技巧，白羊能让天秤更快做决定。" },
    scorpio: { score: 60, love: 80, communication: 50, trust: 55, summary: "强烈吸引但需要信任", detail: "火与水的组合，激情四射。天蝎的神秘吸引白羊，但占有欲可能让白羊感到窒息。建立信任是关键。" },
    sagittarius: { score: 93, love: 90, communication: 95, trust: 90, summary: "冒险灵魂伴侣", detail: "两个火象星座的最佳组合！你们都热爱自由和冒险，在一起永远充满新鲜感。" },
    capricorn: { score: 50, love: 55, communication: 45, trust: 60, summary: "需要互相妥协", detail: "冲动与稳重的碰撞。摩羯的规划能帮助白羊，但可能让白羊感到被限制。" },
    aquarius: { score: 80, love: 75, communication: 90, trust: 75, summary: "有趣的组合", detail: "两个独立灵魂的碰撞。你们都重视自由，能给彼此空间。创意和冒险是你们的共同语言。" },
    pisces: { score: 55, love: 65, communication: 50, trust: 50, summary: "需要学习理解", detail: "火与水的组合，需要找到平衡。双鱼的梦幻能让白羊感到新奇，但也可能让白羊感到困惑。" },
  },
  taurus: {
    aries: { score: 55, love: 60, communication: 50, trust: 55, summary: "节奏不同需要耐心", detail: "稳重的金牛与冲动的白羊需要互相适应节奏。" },
    taurus: { score: 80, love: 85, communication: 75, trust: 90, summary: "稳定和谐的组合", detail: "两个土象星座，你们都重视稳定和物质安全。关系稳固但可能缺乏变化。" },
    gemini: { score: 45, love: 50, communication: 55, trust: 40, summary: "需要努力理解", detail: "稳重与善变的组合，需要更多沟通和理解。" },
    cancer: { score: 90, love: 95, communication: 85, trust: 90, summary: "温馨的家庭组合", detail: "土象与水象的完美匹配！你们都重视家庭和安全感，在一起温馨稳定。" },
    leo: { score: 65, love: 70, communication: 60, trust: 65, summary: "需要平衡关注", detail: "金牛的稳重与狮子的戏剧性需要找到平衡。" },
    virgo: { score: 95, love: 90, communication: 95, trust: 98, summary: "完美匹配", detail: "土象星座的完美组合！你们都务实、可靠，能建立长久稳定的关系。" },
    libra: { score: 70, love: 75, communication: 70, trust: 65, summary: "和谐的组合", detail: "金星的孩子们！你们都欣赏美好事物，能创造优雅的生活。" },
    scorpio: { score: 85, love: 95, communication: 75, trust: 80, summary: "激情深沉的组合", detail: "土与水的深度连接。你们都很忠诚，一旦承诺就是一生。" },
    sagittarius: { score: 40, love: 45, communication: 50, trust: 35, summary: "需要妥协", detail: "稳定与冒险的冲突。射手会让金牛感到不安。" },
    capricorn: { score: 98, love: 95, communication: 90, trust: 98, summary: "完美搭档", detail: "土象星座的终极组合！你们都重视事业和稳定，能共同建立帝国。" },
    aquarius: { score: 50, love: 55, communication: 55, trust: 45, summary: "需要理解差异", detail: "传统与叛逆的碰撞，需要互相尊重差异。" },
    pisces: { score: 85, love: 90, communication: 80, trust: 85, summary: "浪漫的组合", detail: "土与水的温柔结合。双鱼的浪漫与金牛的温柔完美互补。" },
  },
  // 简化其他星座（实际应该完整）
  gemini: {
    gemini: { score: 75, love: 80, communication: 95, trust: 60, summary: "双倍有趣", detail: "两个双子的组合，永远不缺话题和乐趣。但需要建立更深的连接。" },
    libra: { score: 90, love: 95, communication: 95, trust: 80, summary: "风象完美组合", detail: "风象星座的理想配对！你们都重视沟通和社交。" },
    aquarius: { score: 92, love: 90, communication: 98, trust: 85, summary: "智力完美匹配", detail: "智力的完美结合！你们能用语言征服彼此。" },
  },
  cancer: {
    cancer: { score: 80, love: 90, communication: 75, trust: 85, summary: "情感深度连接", detail: "两个水象星座，情感深度连接，但需要注意不要太敏感。" },
    scorpio: { score: 95, love: 98, communication: 85, trust: 95, summary: "灵魂伴侣", detail: "水象星座的完美组合！你们能理解彼此最深层的情感。" },
    pisces: { score: 90, love: 95, communication: 85, trust: 90, summary: "浪漫童话", detail: "水象星座的温柔组合，充满浪漫和诗意。" },
  },
  leo: {
    leo: { score: 75, love: 85, communication: 70, trust: 70, summary: "戏剧性的组合", detail: "两个狮子需要学习分享聚光灯。" },
    sagittarius: { score: 90, love: 95, communication: 90, trust: 85, summary: "火象完美组合", detail: "火象星座的理想配对！热情与冒险的结合。" },
  },
  virgo: {
    virgo: { score: 85, love: 80, communication: 90, trust: 95, summary: "务实的完美组合", detail: "两个土象星座，完美理解彼此的需求和标准。" },
    capricorn: { score: 95, love: 90, communication: 90, trust: 98, summary: "事业完美搭档", detail: "土象星座的完美组合！能共同建立稳固的未来。" },
  },
  libra: {
    libra: { score: 70, love: 80, communication: 85, trust: 60, summary: "优雅的组合", detail: "两个天秤需要学习做决定。" },
    aquarius: { score: 88, love: 85, communication: 95, trust: 80, summary: "风象理想组合", detail: "风象星座的完美配对！" },
  },
  scorpio: {
    scorpio: { score: 75, love: 90, communication: 70, trust: 85, summary: "强烈激情的组合", detail: "两个天蝎需要学习信任和放手。" },
    pisces: { score: 92, love: 98, communication: 85, trust: 90, summary: "灵魂连接", detail: "水象星座的深度连接！" },
  },
  sagittarius: {
    sagittarius: { score: 85, love: 90, communication: 95, trust: 80, summary: "冒险伙伴", detail: "两个射手，一起环游世界！" },
  },
  capricorn: {
    capricorn: { score: 90, love: 85, communication: 85, trust: 95, summary: "事业帝国组合", detail: "两个摩羯能一起建立成功的人生。" },
  },
  aquarius: {
    aquarius: { score: 80, love: 75, communication: 95, trust: 75, summary: "独特组合", detail: "两个水瓶能创造不一样的世界。" },
  },
  pisces: {
    pisces: { score: 75, love: 90, communication: 80, trust: 70, summary: "浪漫梦幻组合", detail: "两个双鱼一起创造浪漫童话。" },
  },
};

const signs = [
  { id: "aries", symbol: "♈", name: { id: "Aries", zh: "白羊座", en: "Aries" } },
  { id: "taurus", symbol: "♉", name: { id: "Taurus", zh: "金牛座", en: "Taurus" } },
  { id: "gemini", symbol: "♊", name: { id: "Gemini", zh: "双子座", en: "Gemini" } },
  { id: "cancer", symbol: "♋", name: { id: "Cancer", zh: "巨蟹座", en: "Cancer" } },
  { id: "leo", symbol: "♌", name: { id: "Leo", zh: "狮子座", en: "Leo" } },
  { id: "virgo", symbol: "♍", name: { id: "Virgo", zh: "处女座", en: "Virgo" } },
  { id: "libra", symbol: "♎", name: { id: "Libra", zh: "天秤座", en: "Libra" } },
  { id: "scorpio", symbol: "♏", name: { id: "Scorpio", zh: "天蝎座", en: "Scorpio" } },
  { id: "sagittarius", symbol: "♐", name: { id: "Sagittarius", zh: "射手座", en: "Sagittarius" } },
  { id: "capricorn", symbol: "♑", name: { id: "Capricorn", zh: "摩羯座", en: "Capricorn" } },
  { id: "aquarius", symbol: "♒", name: { id: "Aquarius", zh: "水瓶座", en: "Aquarius" } },
  { id: "pisces", symbol: "♓", name: { id: "Pisces", zh: "双鱼座", en: "Pisces" } },
];

interface CompatibilityCalculatorProps {
  language?: "id" | "en" | "zh";
}

export default function CompatibilityCalculator({ language = "id" }: CompatibilityCalculatorProps) {
  const [sign1, setSign1] = useState("aries");
  const [sign2, setSign2] = useState("leo");

  const t = {
    id: {
      title: "Kalkulator Kecocokan",
      select1: "Zodiak Anda",
      select2: "Zodiak Pasangan",
      overall: "Kecocokan",
      love: "Cinta",
      communication: "Komunikasi",
      trust: "Kepercayaan",
      summary: "Ringkasan",
      detail: "Penjelasan Detail",
      calculate: "Cek Kecocokan",
    },
    en: {
      title: "Compatibility Calculator",
      select1: "Your Sign",
      select2: "Partner's Sign",
      overall: "Overall",
      love: "Love",
      communication: "Communication",
      trust: "Trust",
      summary: "Summary",
      detail: "Detailed Explanation",
      calculate: "Check Compatibility",
    },
    zh: {
      title: "配对测试",
      select1: "你的星座",
      select2: "对方星座",
      overall: "综合配对",
      love: "爱情指数",
      communication: "沟通指数",
      trust: "信任指数",
      summary: "简评",
      detail: "详细解读",
      calculate: "测试配对",
    },
  }[language];

  // 获取配对数据
  const getCompatibility = () => {
    let data = compatibilityData[sign1]?.[sign2];
    if (!data) {
      data = compatibilityData[sign2]?.[sign1];
    }
    if (!data) {
      // 默认数据
      data = {
        score: 65,
        love: 70,
        communication: 65,
        trust: 60,
        summary: "需要互相理解",
        detail: "这个组合需要双方的努力和理解才能成功。学会欣赏彼此的差异。"
      };
    }
    return data;
  };

  const result = getCompatibility();

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-gray-400";
    if (score >= 70) return "text-gray-400";
    if (score >= 55) return "text-gray-400";
    return "text-gray-400";
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 85) return "💕";
    if (score >= 70) return "❤️";
    if (score >= 55) return "💛";
    return "💔";
  };

  return (
    <div className="w-full space-y-6">
      {/* 选择器 */}
      <div className="grid grid-cols-2 gap-6">
        {/* 星座1 */}
        <div className="space-y-3">
          <label className="text-sm text-gray-300">{t.select1}</label>
          <select
            value={sign1}
            onChange={(e) => setSign1(e.target.value)}
            className="w-full p-3 bg-gray-900/50 border border-gray-200 rounded-xl text-white"
          >
            {signs.map((s) => (
              <option key={s.id} value={s.id}>
                {s.symbol} {s.name[language]}
              </option>
            ))}
          </select>
        </div>

        {/* 星座2 */}
        <div className="space-y-3">
          <label className="text-sm text-gray-300">{t.select2}</label>
          <select
            value={sign2}
            onChange={(e) => setSign2(e.target.value)}
            className="w-full p-3 bg-gray-900/50 border border-gray-200 rounded-xl text-white"
          >
            {signs.map((s) => (
              <option key={s.id} value={s.id}>
                {s.symbol} {s.name[language]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 配对结果 */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50/40 to-gray-950/60 border border-gray-200 space-y-6">
        {/* 分数展示 */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-4xl">{signs.find(s => s.id === sign1)?.symbol}</span>
            <span className="text-3xl">{getScoreEmoji(result.score)}</span>
            <span className="text-4xl">{signs.find(s => s.id === sign2)?.symbol}</span>
          </div>
          <div className={`text-6xl font-bold ${getScoreColor(result.score)}`}>
            {result.score}%
          </div>
          <div className="text-lg text-gray-600 mt-2">{result.summary}</div>
        </div>

        {/* 详细分数 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-gray-900/30 border border-gray-500/30">
            <div className="text-sm text-gray-300 mb-1">{t.love}</div>
            <div className={`text-2xl font-bold ${getScoreColor(result.love)}`}>{result.love}%</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-gray-900/30 border border-gray-500/30">
            <div className="text-sm text-gray-300 mb-1">{t.communication}</div>
            <div className={`text-2xl font-bold ${getScoreColor(result.communication)}`}>{result.communication}%</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-gray-900/30 border border-gray-500/30">
            <div className="text-sm text-gray-300 mb-1">{t.trust}</div>
            <div className={`text-2xl font-bold ${getScoreColor(result.trust)}`}>{result.trust}%</div>
          </div>
        </div>

        {/* 详细解读 */}
        <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-200">
          <h4 className="font-semibold text-gray-100 mb-2">{t.detail}</h4>
          <p className="text-gray-600 leading-relaxed">{result.detail}</p>
        </div>
      </div>
    </div>
  );
}