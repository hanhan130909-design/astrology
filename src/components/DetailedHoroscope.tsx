"use client";

import { useState } from "react";

// 详细运势数据
const horoscopeData = {
  aries: {
    overall: 85,
    love: 90,
    career: 80,
    health: 75,
    finance: 82,
    quote: "今天适合主动出击，不要犹豫！",
    detail: "火星能量强劲，你的行动力将达到顶峰。在感情方面，单身的白羊有机会遇到心仪对象；有伴侣的则适合安排浪漫约会。工作上，你的创意会得到认可。财务方面有小惊喜。",
    lucky: { number: 7, color: "红色", time: "14:00-16:00" },
    warning: "注意控制脾气，避免冲动消费"
  },
  taurus: {
    overall: 78,
    love: 75,
    career: 85,
    health: 80,
    finance: 70,
    quote: "稳扎稳打是今天的最佳策略。",
    detail: "金星带来和谐的社交能量。今天适合处理财务事宜，投资眼光独到。工作上，你的耐心会得到回报。感情方面需要多沟通，避免冷战。健康方面注意饮食。",
    lucky: { number: 6, color: "绿色", time: "10:00-12:00" },
    warning: "不要过于固执，适当妥协"
  },
  gemini: {
    overall: 88,
    love: 82,
    career: 90,
    health: 78,
    finance: 85,
    quote: "沟通是你的超能力！",
    detail: "水星让你思维敏捷，表达流畅。今天适合谈判、演讲、写作。社交活动会带来新机会。感情上，你的幽默感会让伴侣开心。财务有意外收入。注意休息。",
    lucky: { number: 5, color: "黄色", time: "16:00-18:00" },
    warning: "避免同时做太多事"
  },
  cancer: {
    overall: 75,
    love: 88,
    career: 72,
    health: 80,
    finance: 75,
    quote: "倾听内心的声音。",
    detail: "月亮增强你的直觉。今天适合处理家庭事务，与亲人相处融洽。感情方面，你的温柔会感动伴侣。工作上需要更多耐心。健康方面情绪会影响身体。",
    lucky: { number: 2, color: "银色", time: "20:00-22:00" },
    warning: "不要过度敏感，保持情绪稳定"
  },
  leo: {
    overall: 92,
    love: 85,
    career: 95,
    health: 82,
    finance: 88,
    quote: "今天，你就是主角！",
    detail: "太阳赋予你强大的个人魅力。工作上，领导会注意到你的表现；创业者有机会获得投资。感情上，你的热情会吸引异性。财运亨通，适合重大决策。",
    lucky: { number: 1, color: "金色", time: "12:00-14:00" },
    warning: "保持谦虚，不要过于自大"
  },
  virgo: {
    overall: 80,
    love: 75,
    career: 88,
    health: 85,
    finance: 78,
    quote: "细节决定成败。",
    detail: "水星让你的分析能力达到顶峰。今天适合处理复杂的工作任务，你的细心会发现重要问题。感情方面需要表达，不要只做不说。健康方面适合开始新的锻炼计划。",
    lucky: { number: 3, color: "米色", time: "09:00-11:00" },
    warning: "不要过度追求完美"
  },
  libra: {
    overall: 82,
    love: 92,
    career: 78,
    health: 75,
    finance: 85,
    quote: "和谐是今天的主题。",
    detail: "金星带来美好的社交能量。今天适合约会、参加派对、拓展人脉。感情上，你的魅力无人能挡。工作上需要平衡各方关系。财务有进账机会。",
    lucky: { number: 6, color: "粉色", time: "18:00-20:00" },
    warning: "做决定时不要优柔寡断"
  },
  scorpio: {
    overall: 85,
    love: 80,
    career: 88,
    health: 78,
    finance: 90,
    quote: "洞察力是你的武器。",
    detail: "冥王星增强你的直觉和分析能力。今天适合深入研究、调查、投资决策。工作上，你能看穿问题的本质。感情方面需要坦诚，不要隐藏真实想法。",
    lucky: { number: 8, color: "深红色", time: "22:00-00:00" },
    warning: "不要过于怀疑他人"
  },
  sagittarius: {
    overall: 90,
    love: 85,
    career: 82,
    health: 88,
    finance: 80,
    quote: "冒险会带来惊喜！",
    detail: "木星带来好运和扩展能量。今天适合旅行、学习新技能、拓展视野。工作上，你的乐观会感染同事。感情方面，异地恋有机会发展。健康方面精力充沛。",
    lucky: { number: 9, color: "紫色", time: "06:00-08:00" },
    warning: "注意承诺不要过于乐观"
  },
  capricorn: {
    overall: 78,
    love: 72,
    career: 92,
    health: 75,
    finance: 88,
    quote: "坚持终将成功。",
    detail: "土星带来稳定和责任。今天适合处理重要工作、签约、规划未来。你的努力会得到认可。感情方面需要更多陪伴。财务方面适合长期投资。",
    lucky: { number: 4, color: "深蓝色", time: "08:00-10:00" },
    warning: "不要过于严肃，适当放松"
  },
  aquarius: {
    overall: 85,
    love: 78,
    career: 88,
    health: 82,
    finance: 82,
    quote: "创新思维解决问题。",
    detail: "天王星激发你的创造力。今天适合尝试新事物、提出新想法。工作上，你的创新方案会受到关注。社交活动会带来志同道合的朋友。财务方面有意外收入。",
    lucky: { number: 11, color: "天蓝色", time: "15:00-17:00" },
    warning: "不要过于叛逆"
  },
  pisces: {
    overall: 80,
    love: 90,
    career: 75,
    health: 78,
    finance: 80,
    quote: "相信你的直觉。",
    detail: "海王星增强你的想象力和直觉。今天适合艺术创作、冥想、帮助他人。感情方面，你的温柔会让伴侣感动。工作上需要更多专注。健康方面注意睡眠。",
    lucky: { number: 7, color: "海蓝色", time: "21:00-23:00" },
    warning: "不要过于理想化"
  }
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

interface DetailedHoroscopeProps {
  language?: "id" | "en" | "zh";
}

export default function DetailedHoroscope({ language = "id" }: DetailedHoroscopeProps) {
  const [selectedSign, setSelectedSign] = useState<string>("aries");
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");

  const t = {
    id: {
      title: "Ramalan Lengkap",
      selectSign: "Pilih Zodiak",
      overall: "Keseluruhan",
      love: "Cinta",
      career: "Karir",
      health: "Kesehatan",
      finance: "Keuangan",
      quote: "Kutipan Hari Ini",
      detail: "Detail Lengkap",
      lucky: "Keberuntungan",
      number: "Angka",
      color: "Warna",
      time: "Waktu",
      warning: "Peringatan",
      today: "Hari Ini",
      week: "Minggu Ini",
      month: "Bulan Ini",
    },
    en: {
      title: "Detailed Horoscope",
      selectSign: "Select Sign",
      overall: "Overall",
      love: "Love",
      career: "Career",
      health: "Health",
      finance: "Finance",
      quote: "Daily Quote",
      detail: "Full Details",
      lucky: "Lucky",
      number: "Number",
      color: "Color",
      time: "Time",
      warning: "Warning",
      today: "Today",
      week: "This Week",
      month: "This Month",
    },
    zh: {
      title: "详细运势",
      selectSign: "选择星座",
      overall: "综合运势",
      love: "爱情运势",
      career: "事业运势",
      health: "健康运势",
      finance: "财运",
      quote: "今日金句",
      detail: "详细解读",
      lucky: "幸运指南",
      number: "幸运数字",
      color: "幸运颜色",
      time: "幸运时段",
      warning: "注意事项",
      today: "今日",
      week: "本周",
      month: "本月",
    },
  }[language];

  const currentSign = signs.find(s => s.id === selectedSign);
  const currentData = horoscopeData[selectedSign as keyof typeof horoscopeData];

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <div className="w-full space-y-6">
      {/* 时间选择 */}
      <div className="flex justify-center gap-2">
        {(["today", "week", "month"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              period === p
                ? "bg-gradient-to-r from-amber-500 to-purple-600 text-white"
                : "bg-purple-900/50 text-purple-200 border border-purple-500/30 hover:border-amber-400/50"
            }`}
          >
            {t[p]}
          </button>
        ))}
      </div>

      {/* 星座选择网格 */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {signs.map((sign) => (
          <button
            key={sign.id}
            onClick={() => setSelectedSign(sign.id)}
            className={`p-3 rounded-xl text-center transition-all ${
              selectedSign === sign.id
                ? "bg-gradient-to-br from-amber-500/30 to-purple-600/30 border-2 border-amber-400"
                : "bg-purple-900/30 border border-purple-500/20 hover:border-purple-400/50"
            }`}
          >
            <div className="text-2xl">{sign.symbol}</div>
            <div className="text-xs text-purple-200 mt-1">{sign.name[language]}</div>
          </button>
        ))}
      </div>

      {/* 运势详情 */}
      {currentData && (
        <div className="space-y-4">
          {/* 金句 */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-900/30 to-purple-900/30 border border-amber-500/30 text-center">
            <p className="text-lg text-amber-100 italic">&ldquo;{currentData.quote}&rdquo;</p>
          </div>

          {/* 五维运势 */}
          <div className="grid grid-cols-5 gap-2">
            {[
              { key: "overall", icon: "⭐", value: currentData.overall },
              { key: "love", icon: "❤️", value: currentData.love },
              { key: "career", icon: "💼", value: currentData.career },
              { key: "health", icon: "💪", value: currentData.health },
              { key: "finance", icon: "💰", value: currentData.finance },
            ].map((item) => (
              <div key={item.key} className="text-center p-3 rounded-xl bg-purple-900/30 border border-purple-500/20">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className={`text-xl font-bold ${getScoreColor(item.value)}`}>{item.value}%</div>
                <div className="text-xs text-purple-300">{t[item.key as keyof typeof t]}</div>
              </div>
            ))}
          </div>

          {/* 详细解读 */}
          <div className="p-4 rounded-xl bg-purple-900/30 border border-purple-500/20">
            <h3 className="font-semibold text-amber-100 mb-2">{t.detail}</h3>
            <p className="text-purple-200 leading-relaxed">{currentData.detail}</p>
          </div>

          {/* 幸运指南 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30">
              <div className="text-sm text-green-300 mb-1">{t.number}</div>
              <div className="text-2xl font-bold text-green-400">{currentData.lucky.number}</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-pink-900/30 to-rose-900/30 border border-pink-500/30">
              <div className="text-sm text-pink-300 mb-1">{t.color}</div>
              <div className="text-xl font-bold text-pink-400">{currentData.lucky.color}</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-500/30">
              <div className="text-sm text-blue-300 mb-1">{t.time}</div>
              <div className="text-lg font-bold text-blue-400">{currentData.lucky.time}</div>
            </div>
          </div>

          {/* 注意事项 */}
          <div className="p-4 rounded-xl bg-orange-900/20 border border-orange-500/30">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <h4 className="font-semibold text-orange-300 mb-1">{t.warning}</h4>
                <p className="text-orange-200 text-sm">{currentData.warning}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}