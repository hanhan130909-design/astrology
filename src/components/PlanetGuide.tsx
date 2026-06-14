"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// 行星数据
const planets: { id: string; name: Record<string, string>; symbol: string; color: string; desc: Record<string, string>; keywords: Record<string, string[]> }[] = [
  { id: "sun", name: { id: "Matahari", zh: "太阳", en: "Sun" }, symbol: "☉", color: "#FFD700", desc: { id: "Inti jiwa dan vitalitas", zh: "核心自我与生命力", en: "Core self and vitality" }, keywords: { id: ["Jiwa", "Vitalitas", "Kreativitas", "Warna"], zh: ["灵魂", "生命力", "创造力", "意志"], en: ["Soul", "Vitality", "Creativity", "Will"] } },
  { id: "moon", name: { id: "Bulan", zh: "月亮", en: "Moon" }, symbol: "☽", color: "#C0C0C0", desc: { id: "Emosi dan alam bawah sadar", zh: "情感与潜意识", en: "Emotions and subconscious" }, keywords: { id: ["Ibu", "Rumah", "Nutrisi", "Pekat"], zh: ["母亲", "家庭", "滋养", "情感"], en: ["Mother", "Home", "Nurturing", "Feelings"] } },
  { id: "mercury", name: { id: "Merkurius", zh: "水星", en: "Mercury" }, symbol: "☿", color: "#87CEEB", desc: { id: "Komunikasi dan logika", zh: "沟通与逻辑", en: "Communication and logic" }, keywords: { id: ["Messaging", "Logika", "Teknologi", "Analisis"], zh: ["信息", "逻辑", "技术", "分析"], en: ["Messaging", "Logic", "Technology", "Analysis"] } },
  { id: "venus", name: { id: "Venus", zh: "金星", en: "Venus" }, symbol: "♀", color: "#FF69B4", desc: { id: "Cinta dan estetika", zh: "爱情与美感", en: "Love and beauty" }, keywords: { id: ["Kecantikan", "Seni", "Harmoni", "Pleasure"], zh: ["美丽", "艺术", "和谐", "享乐"], en: ["Beauty", "Art", "Harmony", "Pleasure"] } },
  { id: "mars", name: { id: "Mars", zh: "火星", en: "Mars" }, symbol: "♂", color: "#FF4500", desc: { id: "Energi dan aksi", zh: "行动力与能量", en: "Energy and action" }, keywords: { id: ["Aksi", "Semangat", "Keberanian", "Konflik"], zh: ["行动", "勇气", "能量", "冲突"], en: ["Action", "Courage", "Energy", "Conflict"] } },
  { id: "jupiter", name: { id: "Jupiter", zh: "木星", en: "Jupiter" }, symbol: "♃", color: "#FFA500", desc: { id: "Kebijaksanaan dan ekspansi", zh: "智慧与扩展", en: "Wisdom and expansion" }, keywords: { id: ["Kebahagiaan", "Optimisme", "Pengalaman", "Keberuntungan"], zh: ["幸福", "乐观", "体验", "幸运"], en: ["Happiness", "Optimism", "Experience", "Luck"] } },
  { id: "saturn", name: { id: "Saturnus", zh: "土星", en: "Saturn" }, symbol: "♄", color: "#DAA520", desc: { id: "Disiplin dan tanggung jawab", zh: "责任与纪律", en: "Responsibility and discipline" }, keywords: { id: ["Struktur", "Waktu", "Batasan", "Maturitas"], zh: ["结构", "时间", "限制", "成熟"], en: ["Structure", "Time", "Limits", "Maturity"] } },
  { id: "uranus", name: { id: "Uranus", zh: "天王星", en: "Uranus" }, symbol: "♅", color: "#40E0D0", desc: { id: "Inovasi dan kebebasan", zh: "创新与自由", en: "Innovation and freedom" }, keywords: { id: ["Perubahan", "Revolusi", "Unik", "Elektris"], zh: ["变革", "革命", "独特", "电性"], en: ["Change", "Revolution", "Unique", "Electric"] } },
  { id: "neptune", name: { id: "Neptunus", zh: "海王星", en: "Neptune" }, symbol: "♆", color: "#4169E1", desc: { id: "Intuisi dan spiritualitas", zh: "直觉与灵性", en: "Intuition and spirituality" }, keywords: { id: ["Misteri", "Imajinasi", "Dreams", "Inspirasi"], zh: ["神秘", "想象", "梦想", "灵感"], en: ["Mystery", "Imagination", "Dreams", "Inspiration"] } },
  { id: "pluto", name: { id: "Pluto", zh: "冥王星", en: "Pluto" }, symbol: "♇", color: "#8B008B", desc: { id: "Transformasi dan regenerasi", zh: "转化与重生", en: "Transformation and rebirth" }, keywords: { id: ["Kekuatan", "Regenerasi", "Underworld", "Daya"], zh: ["权力", "再生", "地下世界", "能量"], en: ["Power", "Regeneration", "Underworld", "Intensity"] } },
];

// 星座数据
const signs: { id: string; symbol: string; name: Record<string, string>; element: Record<string, string> }[] = [
  { id: "aries", symbol: "♈", name: { id: "Aries", zh: "白羊座", en: "Aries" }, element: { id: "Api", zh: "火", en: "Fire" } },
  { id: "taurus", symbol: "♉", name: { id: "Taurus", zh: "金牛座", en: "Taurus" }, element: { id: "Tanah", zh: "土", en: "Earth" } },
  { id: "gemini", symbol: "♊", name: { id: "Gemini", zh: "双子座", en: "Gemini" }, element: { id: "Udara", zh: "风", en: "Air" } },
  { id: "cancer", symbol: "♋", name: { id: "Cancer", zh: "巨蟹座", en: "Cancer" }, element: { id: "Air", zh: "水", en: "Water" } },
  { id: "leo", symbol: "♌", name: { id: "Leo", zh: "狮子座", en: "Leo" }, element: { id: "Api", zh: "火", en: "Fire" } },
  { id: "virgo", symbol: "♍", name: { id: "Virgo", zh: "处女座", en: "Virgo" }, element: { id: "Tanah", zh: "土", en: "Earth" } },
  { id: "libra", symbol: "♎", name: { id: "Libra", zh: "天秤座", en: "Libra" }, element: { id: "Udara", zh: "风", en: "Air" } },
  { id: "scorpio", symbol: "♏", name: { id: "Scorpio", zh: "天蝎座", en: "Scorpio" }, element: { id: "Air", zh: "水", en: "Water" } },
  { id: "sagittarius", symbol: "♐", name: { id: "Sagittarius", zh: "射手座", en: "Sagittarius" }, element: { id: "Api", zh: "火", en: "Fire" } },
  { id: "capricorn", symbol: "♑", name: { id: "Capricorn", zh: "摩羯座", en: "Capricorn" }, element: { id: "Tanah", zh: "土", en: "Earth" } },
  { id: "aquarius", symbol: "♒", name: { id: "Aquarius", zh: "水瓶座", en: "Aquarius" }, element: { id: "Udara", zh: "风", en: "Air" } },
  { id: "pisces", symbol: "♓", name: { id: "Pisces", zh: "双鱼座", en: "Pisces" }, element: { id: "Air", zh: "水", en: "Water" } },
];

// 简化版解读数据（展示用）
const simpleInterpretations: Record<string, Record<string, { traits: string[]; strength: string; weakness: string }>> = {
  sun: {
    aries: { traits: ["领导力", "勇气", "热情"], strength: "天生的领导者", weakness: "冲动" },
    taurus: { traits: ["稳定", "务实", "耐心"], strength: "可靠的伙伴", weakness: "固执" },
    gemini: { traits: ["聪明", "好奇", "多才"], strength: "沟通高手", weakness: "善变" },
    cancer: { traits: ["情感丰富", "直觉强", "忠诚"], strength: "温暖的守护者", weakness: "情绪化" },
    leo: { traits: ["自信", "慷慨", "戏剧化"], strength: "耀眼的明星", weakness: "自我中心" },
    virgo: { traits: ["细心", "分析力", "服务心"], strength: "完美的助手", weakness: "挑剔" },
    libra: { traits: ["优雅", "公正", "和谐"], strength: "出色的外交官", weakness: "犹豫不决" },
    scorpio: { traits: ["深刻", "洞察力", "意志力"], strength: "神秘的探索者", weakness: "占有欲" },
    sagittarius: { traits: ["乐观", "冒险", "自由"], strength: "智慧的导师", weakness: "粗心" },
    capricorn: { traits: ["自律", "野心", "稳重"], strength: "成功的攀登者", weakness: "冷漠" },
    aquarius: { traits: ["创新", "独立", "人道"], strength: "未来的先驱", weakness: "叛逆" },
    pisces: { traits: ["敏感", "艺术", "直觉"], strength: "梦幻的艺术家", weakness: "逃避" },
  },
  moon: {
    aries: { traits: ["直接", "热情", "冲动"], strength: "情感真实", weakness: "脾气急" },
    taurus: { traits: ["稳定", "享受", "固执"], strength: "情感安全", weakness: "固执" },
    gemini: { traits: ["好奇", "多变", "交流"], strength: "情感灵活", weakness: "不深入" },
    cancer: { traits: ["深情", "敏感", "保护"], strength: "充满爱心", weakness: "过度敏感" },
    leo: { traits: ["戏剧化", "骄傲", "忠诚"], strength: "情感热烈", weakness: "需要关注" },
    virgo: { traits: ["实际", "批评", "服务"], strength: "情感细腻", weakness: "焦虑" },
    libra: { traits: ["和谐", "社交", "犹豫"], strength: "情感平衡", weakness: "依赖他人" },
    scorpio: { traits: ["深刻", "强烈", "忠诚"], strength: "情感深厚", weakness: "占有欲" },
    sagittarius: { traits: ["乐观", "自由", "诚实"], strength: "情感开放", weakness: "不细腻" },
    capricorn: { traits: ["克制", "责任", "冷淡"], strength: "情感稳定", weakness: "压抑" },
    aquarius: { traits: ["独立", "理性", "疏离"], strength: "情感自由", weakness: "疏远" },
    pisces: { traits: ["敏感", "同理心", "理想"], strength: "情感丰富", weakness: "脆弱" },
  },
  mercury: {
    aries: { traits: ["直接", "辩论", "快速"], strength: "思维敏捷", weakness: "激进" },
    taurus: { traits: ["务实", "稳定", "耐心"], strength: "思维稳健", weakness: "慢变化" },
    gemini: { traits: ["灵活", "好奇", "多才"], strength: "思维活跃", weakness: "浅薄" },
    cancer: { traits: ["直觉", "情感", "记忆"], strength: "思维敏感", weakness: "情绪化" },
    leo: { traits: ["戏剧", "自信", "创意"], strength: "思维吸引人", weakness: "自我" },
    virgo: { traits: ["分析", "细节", "批评"], strength: "思维精准", weakness: "挑剔" },
    libra: { traits: ["平衡", "外交", "客观"], strength: "思维公正", weakness: "犹豫" },
    scorpio: { traits: ["深刻", "洞察", "集中"], strength: "思维透彻", weakness: "过度" },
    sagittarius: { traits: ["哲学", "乐观", "开阔"], strength: "思维宏观", weakness: "粗心" },
    capricorn: { traits: ["结构", "野心", "实际"], strength: "思维有序", weakness: "严肃" },
    aquarius: { traits: ["创新", "独特", "理性"], strength: "思维前卫", weakness: "非传统" },
    pisces: { traits: ["想象", "直觉", "艺术"], strength: "思维创意", weakness: "理想化" },
  },
  venus: {
    aries: { traits: ["热情", "直接", "勇敢"], strength: "爱得热烈", weakness: "冲动" },
    taurus: { traits: ["稳定", "感官", "忠诚"], strength: "爱得持久", weakness: "占有" },
    gemini: { traits: ["好奇", "多变", "社交"], strength: "爱得有趣", weakness: "不专一" },
    cancer: { traits: ["深情", "照顾", "忠诚"], strength: "爱得温暖", weakness: "依赖" },
    leo: { traits: ["戏剧", "浪漫", "慷慨"], strength: "爱得耀眼", weakness: "需要关注" },
    virgo: { traits: ["服务", "实际", "细腻"], strength: "爱得体贴", weakness: "批评" },
    libra: { traits: ["和谐", "浪漫", "平衡"], strength: "爱得优雅", weakness: "犹豫" },
    scorpio: { traits: ["深刻", "强烈", "忠诚"], strength: "爱得深沉", weakness: "控制" },
    sagittarius: { traits: ["自由", "乐观", "冒险"], strength: "爱得开放", weakness: "承诺" },
    capricorn: { traits: ["承诺", "责任", "稳定"], strength: "爱得可靠", weakness: "严肃" },
    aquarius: { traits: ["独立", "友谊", "自由"], strength: "爱得特别", weakness: "疏远" },
    pisces: { traits: ["浪漫", "理想", "敏感"], strength: "爱得梦幻", weakness: "逃避" },
  },
  mars: {
    aries: { traits: ["勇敢", "直接", "冲动"], strength: "行动力强", weakness: "急躁" },
    taurus: { traits: ["稳定", "坚持", "固执"], strength: "耐力强", weakness: "倔强" },
    gemini: { traits: ["灵活", "好奇", "多才"], strength: "适应力强", weakness: "分心" },
    cancer: { traits: ["保护", "情感", "坚持"], strength: "守护心强", weakness: "被动" },
    leo: { traits: ["自信", "戏剧", "领导"], strength: "领导力强", weakness: "骄傲" },
    virgo: { traits: ["精确", "分析", "服务"], strength: "效率高", weakness: "挑剔" },
    libra: { traits: ["平衡", "和谐", "外交"], strength: "协调力强", weakness: "犹豫" },
    scorpio: { traits: ["意志力", "洞察", "激情"], strength: "行动深沉", weakness: "控制" },
    sagittarius: { traits: ["冒险", "乐观", "自由"], strength: "开拓精神", weakness: "粗心" },
    capricorn: { traits: ["野心", "纪律", "耐心"], strength: "坚持到底", weakness: "悲观" },
    aquarius: { traits: ["创新", "独立", "人道"], strength: "改革精神", weakness: "叛逆" },
    pisces: { traits: ["直觉", "敏感", "牺牲"], strength: "适应力强", weakness: "迷茫" },
  },
  jupiter: {
    aries: { traits: ["乐观", "冒险", "领导"], strength: "充满机遇", weakness: "过度" },
    taurus: { traits: ["慷慨", "享受", "稳定"], strength: "生活丰富", weakness: "放纵" },
    gemini: { traits: ["好奇", "学习", "多才"], strength: "知识渊博", weakness: "浅尝" },
    cancer: { traits: ["照顾", "教育", "传统"], strength: "家庭幸福", weakness: "过度保护" },
    leo: { traits: ["自信", "戏剧", "创造"], strength: "才华横溢", weakness: "炫耀" },
    virgo: { traits: ["服务", "健康", "效率"], strength: "实用智慧", weakness: "批评" },
    libra: { traits: ["平衡", "公正", "社交"], strength: "人际和谐", weakness: "犹豫" },
    scorpio: { traits: ["深刻", "转变", "再生"], strength: "转变力量", weakness: "极端" },
    sagittarius: { traits: ["自由", "探索", "哲学"], strength: "视野开阔", weakness: "过度" },
    capricorn: { traits: ["野心", "纪律", "耐心"], strength: "成功之路", weakness: "严肃" },
    aquarius: { traits: ["创新", "人道", "自由"], strength: "社会进步", weakness: "叛逆" },
    pisces: { traits: ["灵性", "直觉", "艺术"], strength: "智慧深远", weakness: "迷茫" },
  },
  saturn: {
    aries: { traits: ["领导", "责任", "纪律"], strength: "组织能力强", weakness: "固执" },
    taurus: { traits: ["稳定", "耐心", "务实"], strength: "可靠", weakness: "僵化" },
    gemini: { traits: ["沟通", "技术", "分析"], strength: "技术专家", weakness: "焦虑" },
    cancer: { traits: ["照顾", "家庭", "情感"], strength: "家庭支柱", weakness: "过度担忧" },
    leo: { traits: ["创意", "骄傲", "戏剧"], strength: "成就卓越", weakness: "需要认可" },
    virgo: { traits: ["完美", "服务", "分析"], strength: "品质保证", weakness: "过度批评" },
    libra: { traits: ["平衡", "公正", "外交"], strength: "法律专家", weakness: "犹豫" },
    scorpio: { traits: ["深刻", "秘密", "再生"], strength: "转变能力", weakness: "控制" },
    sagittarius: { traits: ["探索", "自由", "哲学"], strength: "智慧导师", weakness: "不耐烦" },
    capricorn: { traits: ["野心", "纪律", "耐心"], strength: "成功人士", weakness: "冷漠" },
    aquarius: { traits: ["创新", "人道", "独立"], strength: "改革者", weakness: "疏远" },
    pisces: { traits: ["灵性", "直觉", "牺牲"], strength: "精神导师", weakness: "迷茫" },
  },
  uranus: {
    aries: { traits: ["创新", "自由", "独立"], strength: "改革先锋", weakness: "冲动" },
    taurus: { traits: ["稳定", "享受", "固执"], strength: "独特品味", weakness: "抗拒变化" },
    gemini: { traits: ["聪明", "好奇", "多变"], strength: "创意天才", weakness: "不稳定" },
    cancer: { traits: ["直觉", "情感", "创意"], strength: "独特的灵感", weakness: "情绪化" },
    leo: { traits: ["戏剧", "创意", "骄傲"], strength: "艺术创新", weakness: "需要关注" },
    virgo: { traits: ["创新", "实用", "效率"], strength: "技术革新", weakness: "挑剔" },
    libra: { traits: ["平衡", "公正", "社交"], strength: "社会改革", weakness: "犹豫" },
    scorpio: { traits: ["深刻", "转变", "洞察"], strength: "灵魂转变", weakness: "极端" },
    sagittarius: { traits: ["冒险", "自由", "乐观"], strength: "视野突破", weakness: "粗心" },
    capricorn: { traits: ["野心", "创新", "实际"], strength: "结构创新", weakness: "严肃" },
    aquarius: { traits: ["独特", "人道", "发明"], strength: "天才思维", weakness: "叛逆" },
    pisces: { traits: ["灵性", "直觉", "想象"], strength: "精神革命", weakness: "迷茫" },
  },
  neptune: {
    aries: { traits: ["理想", "灵感", "直觉"], strength: "精神领袖", weakness: "幻想" },
    taurus: { traits: ["享受", "艺术", "稳定"], strength: "艺术天赋", weakness: "放纵" },
    gemini: { traits: ["想象", "创意", "敏感"], strength: "艺术创造", weakness: "困惑" },
    cancer: { traits: ["直觉", "情感", "灵性"], strength: "精神敏感", weakness: "情绪化" },
    leo: { traits: ["戏剧", "创意", "灵感"], strength: "艺术表演", weakness: "自我欺骗" },
    virgo: { traits: ["完美", "服务", "分析"], strength: "治愈能力", weakness: "批评" },
    libra: { traits: ["平衡", "和谐", "艺术"], strength: "艺术美感", weakness: "犹豫" },
    scorpio: { traits: ["深刻", "秘密", "再生"], strength: "灵魂探索", weakness: "神秘" },
    sagittarius: { traits: ["哲学", "探索", "乐观"], strength: "精神旅程", weakness: "过度理想" },
    capricorn: { traits: ["野心", "实际", "纪律"], strength: "精神目标", weakness: "严肃" },
    aquarius: { traits: ["独特", "人道", "创新"], strength: "精神创新", weakness: "疏远" },
    pisces: { traits: ["敏感", "艺术", "灵性"], strength: "艺术直觉", weakness: "逃避" },
  },
  pluto: {
    aries: { traits: ["力量", "转变", "领导"], strength: "转变力量", weakness: "控制" },
    taurus: { traits: ["稳定", "享受", "转变"], strength: "价值观转变", weakness: "固执" },
    gemini: { traits: ["转变", "好奇", "信息"], strength: "信息转化", weakness: "困惑" },
    cancer: { traits: ["情感", "家庭", "再生"], strength: "情感转变", weakness: "依赖" },
    leo: { traits: ["创意", "骄傲", "转变"], strength: "创造力再生", weakness: "戏剧化" },
    virgo: { traits: ["分析", "完美", "转变"], strength: "净化能力", weakness: "批评" },
    libra: { traits: ["平衡", "转变", "公正"], strength: "关系转变", weakness: "犹豫" },
    scorpio: { traits: ["深刻", "秘密", "再生"], strength: "灵魂转变", weakness: "极端" },
    sagittarius: { traits: ["探索", "自由", "转变"], strength: "精神转变", weakness: "冲动" },
    capricorn: { traits: ["野心", "纪律", "转变"], strength: "成功再生", weakness: "压抑" },
    aquarius: { traits: ["创新", "人道", "转变"], strength: "社会转变", weakness: "叛逆" },
    pisces: { traits: ["灵性", "直觉", "转变"], strength: "精神再生", weakness: "迷茫" },
  },
};

export default function PlanetGuide() {
  const { language } = useLanguage();
  const [selectedPlanet, setSelectedPlanet] = useState("sun");
  const [selectedSign, setSelectedSign] = useState("aries");
  const [showAll, setShowAll] = useState(false);

  const t: Record<string, string> = {
    id: { title: "📚 Panduan Planet Lengkap", subtitle: "Pelajari makna setiap planet dalam 12 zodiak", selectPlanet: "Pilih Planet", selectSign: "Pilih Zodiak", traits: "Sifat Utama", strength: "Kekuatan", weakness: "Kelemahan", planetIn: "Planet di" },
    en: { title: "📚 Complete Planet Guide", subtitle: "Learn the meaning of each planet in 12 zodiac signs", selectPlanet: "Select Planet", selectSign: "Select Sign", traits: "Main Traits", strength: "Strength", weakness: "Weakness", planetIn: "Planet in" },
    zh: { title: "📚 行星完整指南", subtitle: "了解每颗行星在12星座中的意义", selectPlanet: "选择行星", selectSign: "选择星座", traits: "主要特质", strength: "优势", weakness: "劣势", planetIn: "行星在" },
  }[language] || { title: "📚 行星完整指南", subtitle: "了解每颗行星在12星座中的意义", selectPlanet: "选择行星", selectSign: "选择星座", traits: "主要特质", strength: "优势", weakness: "劣势", planetIn: "行星在" };

  const planet = planets.find(p => p.id === selectedPlanet);
  const sign = signs.find(s => s.id === selectedSign);
  const interpretation = simpleInterpretations[selectedPlanet]?.[selectedSign];

  return (
    <div className="w-full space-y-6">
      {/* 行星选择 */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50/80 to-gray-950/80 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-3">{t.selectPlanet}</h3>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {planets.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlanet(p.id)}
              className={`p-3 rounded-xl text-center transition-all ${
                selectedPlanet === p.id
                  ? "bg-gradient-to-br from-gray-600/40 to-gray-600/40 border-2 border-gray-400 shadow-lg shadow-gray-200/30"
                  : "bg-gray-100 border border-gray-300 hover:border-gray-300"
              }`}
            >
              <span style={{ color: p.color }} className="text-2xl block">{p.symbol}</span>
              <span className="text-[10px] text-gray-500 mt-1 block">{language === 'zh' ? p.name.zh : language === 'id' ? p.name.id : p.name.en}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 行星信息卡 */}
      {planet && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50/30 to-gray-50/30 border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <span style={{ color: planet.color }} className="text-5xl">{planet.symbol}</span>
            <div>
              <h3 className="text-2xl font-bold text-white">
                {language === 'zh' ? planet.name.zh : language === 'id' ? planet.name.id : planet.name.en}
              </h3>
              <p className="text-gray-300">{planet.desc[language]}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {planet.keywords[language].map((kw: string, i: number) => (
              <span key={i} className="px-3 py-1.5 bg-gray-500/20 rounded-full text-xs text-gray-300 border border-gray-200">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 星座选择 */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50/80 to-gray-950/80 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-3">{t.selectSign}</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {signs.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSign(s.id)}
              className={`p-2 rounded-xl text-center transition-all ${
                selectedSign === s.id
                  ? "bg-gradient-to-br from-gray-500/30 to-gray-600/30 border-2 border-gray-400"
                  : "bg-gray-100 border border-gray-300 hover:border-gray-300"
              }`}
            >
              <span className="text-xl block">{s.symbol}</span>
              <span className="text-[10px] text-gray-500 mt-1 block">{s.name[language]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 解读结果 */}
      {interpretation && sign && planet && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/40 to-gray-900/40 border border-gray-500/20 space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <span style={{ color: planet.color }} className="text-4xl">{planet.symbol}</span>
            <span className="text-3xl text-gray-600">+</span>
            <span className="text-3xl">{sign.symbol}</span>
            <div className="ml-4">
              <div className="text-sm text-gray-300">{t.planetIn}</div>
              <div className="text-xl font-bold text-white">{planet.name[language]} {t.planetIn} {sign.name[language]}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="text-xs text-gray-400 mb-2">{t.traits}</div>
              <div className="flex flex-wrap gap-2">
                {interpretation.traits.map((trait: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-gray-500/20 rounded-full text-xs text-gray-300">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-900/20 border border-gray-500/20">
              <div className="text-xs text-gray-500 mb-2">{t.strength}</div>
              <div className="text-sm text-gray-300">{interpretation.strength}</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-900/20 border border-gray-500/20">
              <div className="text-xs text-gray-500 mb-2">{t.weakness}</div>
              <div className="text-sm text-gray-300">{interpretation.weakness}</div>
            </div>
          </div>
        </div>
      )}

      {/* 快速参考表 */}
      <div className="mt-8">
        <button onClick={() => setShowAll(!showAll)} className="w-full py-3 bg-white hover:bg-gray-100 rounded-xl text-sm font-medium text-gray-600 transition-colors">
          {showAll ? "收起快速参考" : "显示快速参考表"}
        </button>
        
        {showAll && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left p-2 text-gray-500">行星</th>
                  <th className="text-left p-2 text-gray-500">火象</th>
                  <th className="text-left p-2 text-gray-500">土象</th>
                  <th className="text-left p-2 text-gray-500">风象</th>
                  <th className="text-left p-2 text-gray-500">水象</th>
                </tr>
              </thead>
              <tbody>
                {planets.map((p) => (
                  <tr key={p.id} className="border-b border-gray-200">
                    <td className="p-2">
                      <span style={{ color: p.color }}>{p.symbol}</span> {p.name[language]}
                    </td>
                    {["aries", "leo", "sagittarius"].map(el => {
                      const interp = simpleInterpretations[p.id]?.[el];
                      return <td key={el} className="p-2 text-gray-600">{interp?.strength || '-'}</td>;
                    })}
                    {["taurus", "virgo", "capricorn"].map(el => {
                      const interp = simpleInterpretations[p.id]?.[el];
                      return <td key={el} className="p-2 text-gray-600">{interp?.strength || '-'}</td>;
                    })}
                    {["gemini", "libra", "aquarius"].map(el => {
                      const interp = simpleInterpretations[p.id]?.[el];
                      return <td key={el} className="p-2 text-gray-600">{interp?.strength || '-'}</td>;
                    })}
                    {["cancer", "scorpio", "pisces"].map(el => {
                      const interp = simpleInterpretations[p.id]?.[el];
                      return <td key={el} className="p-2 text-gray-600">{interp?.strength || '-'}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
