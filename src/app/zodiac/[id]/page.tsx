"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage, translations } from "@/contexts/LanguageContext";

const SIGN_DATA: Record<string, {
  name: Record<string, string>;
  symbol: string;
  element: string;
  mode: string;
  ruler: string;
  dates: string;
  traits: Record<string, string[]>;
  strengths: Record<string, string[]>;
  weaknesses: Record<string, string[]>;
  compatibility: string[];
  lucky: { numbers: number[]; colors: string[]; days: string[] };
  description: Record<string, string>;
}> = {
  aries: {
    name: { id: "Aries", zh: "白羊座", en: "Aries" },
    symbol: "♈", element: "fire", mode: "cardinal", ruler: "Mars", dates: "Mar 21 - Apr 19",
    traits: { id: ["Berani", "Penuh semangat", "Pemimpin alami", "Kompetitif"], zh: ["勇敢", "热情", "天生领袖", "好胜"], en: ["Courageous", "Passionate", "Natural Leader", "Competitive"] },
    strengths: { id: ["Pemimpin yang baik", "Optimis", "Bergegas", "Berani mengambil risiko"], zh: ["优秀的领导者", "乐观", "行动迅速", "敢于冒险"], en: ["Great leaders", "Optimistic", "Quick to act", "Brave risk-takers"] },
    weaknesses: { id: ["Tidak sabar", "Pendek kata", "Impulsif", "Egois"], zh: ["缺乏耐心", "脾气急躁", "冲动", "自我中心"], en: ["Impatient", "Short-tempered", "Impulsive", "Self-centered"] },
    compatibility: ["leo", "sagittarius", "gemini", "aquarius"],
    lucky: { numbers: [1, 9], colors: ["Red", "Orange"], days: ["Tuesday"] },
    description: { id: "Aries adalah zodiak pertama, melambangkan awal baru dan kepemimpinan.", zh: "白羊座是第一个星座，象征着新的开始和领导力。", en: "Aries is the first zodiac sign, symbolizing new beginnings and leadership." },
  },
  taurus: {
    name: { id: "Taurus", zh: "金牛座", en: "Taurus" },
    symbol: "♉", element: "earth", mode: "fixed", ruler: "Venus", dates: "Apr 20 - May 20",
    traits: { id: ["Stabil", "Dapat diandalkan", "Sabar", "Praktis"], zh: ["稳定", "可靠", "耐心", "务实"], en: ["Stable", "Reliable", "Patient", "Practical"] },
    strengths: { id: ["Setia", "Tekun", "Artistik", "Pengelola uang yang baik"], zh: ["忠诚", "坚韧", "艺术天赋", "善于理财"], en: ["Loyal", "Determined", "Artistic", "Good with money"] },
    weaknesses: { id: ["Keras kepala", "Posesif", "Materiilistik", "Suka menunda"], zh: ["固执", "占有欲强", "物质主义", "懒惰"], en: ["Stubborn", "Possessive", "Materialistic", "Lazy"] },
    compatibility: ["virgo", "capricorn", "cancer", "pisces"],
    lucky: { numbers: [2, 6], colors: ["Green", "Pink"], days: ["Friday"] },
    description: { id: "Taurus dikuasai oleh Venus, planet cinta dan keindahan.", zh: "金牛座由金星掌管，象征爱与美。", en: "Taurus is ruled by Venus, planet of love and beauty." },
  },
  gemini: {
    name: { id: "Gemini", zh: "双子座", en: "Gemini" },
    symbol: "♊", element: "air", mode: "mutable", ruler: "Mercury", dates: "May 21 - Jun 20",
    traits: { id: ["Komunikatif", "Penasaran", "Versatile", "Cerdas"], zh: ["善于沟通", "好奇心强", "多才多艺", "聪明"], en: ["Communicative", "Curious", "Versatile", "Intelligent"] },
    strengths: { id: ["Fleksibel", "Pembicara hebat", "Kreatif", "Berwawasan luas"], zh: ["灵活变通", "出色的演说家", "有创意", "见多识广"], en: ["Adaptable", "Great talker", "Creative", "Well-informed"] },
    weaknesses: { id: ["Tidak konsisten", "Superfisial", "Gelisah", "Tidak dapat memutuskan"], zh: ["三心二意", "肤浅", "浮躁", "优柔寡断"], en: ["Inconsistent", "Superficial", "Restless", "Indecisive"] },
    compatibility: ["libra", "aquarius", "aries", "leo"],
    lucky: { numbers: [5, 3], colors: ["Yellow", "Light Blue"], days: ["Wednesday"] },
    description: { id: "Gemini dikuasai oleh Merkurius, planet komunikasi.", zh: "双子座由水星掌管，代表沟通。", en: "Gemini is ruled by Mercury, planet of communication." },
  },
  cancer: {
    name: { id: "Cancer", zh: "巨蟹座", en: "Cancer" },
    symbol: "♋", element: "water", mode: "cardinal", ruler: "Moon", dates: "Jun 21 - Jul 22",
    traits: { id: ["Penuh kasih", "Intuitif", "Pelindung", "Sentimental"], zh: ["充满爱心", "直觉敏锐", "保护欲强", "感性"], en: ["Nurturing", "Intuitive", "Protective", "Sentimental"] },
    strengths: { id: ["Empati tinggi", "Setia", "Imajinatif", "Pendengar yang baik"], zh: ["高度共情", "忠诚", "想象力丰富", "善于倾听"], en: ["Highly empathetic", "Loyal", "Imaginative", "Good listeners"] },
    weaknesses: { id: ["Terlalu sensitif", "Mood swing", "Cengeng", "Tidak mau melepas"], zh: ["过于敏感", "情绪化", "爱哭", "不愿放手"], en: ["Overly sensitive", "Moody", "Clingy", "Unable to let go"] },
    compatibility: ["scorpio", "pisces", "taurus", "virgo"],
    lucky: { numbers: [2, 7], colors: ["White", "Silver"], days: ["Monday"] },
    description: { id: "Cancer dikuasai oleh Bulan, melambangkan emosi dan naluri.", zh: "巨蟹座由月亮掌管，象征情感和直觉。", en: "Cancer is ruled by the Moon, representing emotions and instincts." },
  },
  leo: {
    name: { id: "Leo", zh: "狮子座", en: "Leo" },
    symbol: "♌", element: "fire", mode: "fixed", ruler: "Sun", dates: "Jul 23 - Aug 22",
    traits: { id: ["Karismatik", "Percaya diri", "Dermawan", "Dramatis"], zh: ["有魅力", "自信", "慷慨", "戏剧化"], en: ["Charismatic", "Confident", "Generous", "Dramatic"] },
    strengths: { id: ["Pemimpin alami", "Setia", "Optimis", "Kreatif"], zh: ["天生领袖", "忠诚", "乐观", "有创意"], en: ["Natural leader", "Loyal", "Optimistic", "Creative"] },
    weaknesses: { id: ["Sombong", "Dominan", "Tidak sabar", "Mencari perhatian"], zh: ["傲慢", "强势", "不耐烦", "寻求关注"], en: ["Arrogant", "Dominating", "Impatient", "Attention-seeking"] },
    compatibility: ["aries", "sagittarius", "gemini", "libra"],
    lucky: { numbers: [1, 3], colors: ["Gold", "Orange"], days: ["Sunday"] },
    description: { id: "Leo dikuasai oleh Matahari, sumber energi dan vitalitas.", zh: "狮子座由太阳掌管，是能量和活力的源泉。", en: "Leo is ruled by the Sun, source of energy and vitality." },
  },
  virgo: {
    name: { id: "Virgo", zh: "处女座", en: "Virgo" },
    symbol: "♍", element: "earth", mode: "mutable", ruler: "Mercury", dates: "Aug 23 - Sep 22",
    traits: { id: ["Analitis", "Praktis", "Rapi", "Pekerja keras"], zh: ["善于分析", "务实", "整洁", "勤奋"], en: ["Analytical", "Practical", "Neat", "Hardworking"] },
    strengths: { id: ["Detail-oriented", "Dapat diandalkan", "Membantu", "Cerdas"], zh: ["注重细节", "可靠", "乐于助人", "聪明"], en: ["Detail-oriented", "Reliable", "Helpful", "Intelligent"] },
    weaknesses: { id: ["Perfeksionis", "Kritis", "Khawatir berlebihan", "Pemalu"], zh: ["完美主义", "挑剔", "过度担忧", "害羞"], en: ["Perfectionist", "Critical", "Overthinking", "Shy"] },
    compatibility: ["taurus", "capricorn", "cancer", "scorpio"],
    lucky: { numbers: [5, 6], colors: ["Navy Blue", "Grey"], days: ["Wednesday"] },
    description: { id: "Virgo dikuasai oleh Merkurius, planet pikiran.", zh: "处女座由水星掌管，代表思维。", en: "Virgo is ruled by Mercury, planet of mind." },
  },
  libra: {
    name: { id: "Libra", zh: "天秤座", en: "Libra" },
    symbol: "♎", element: "air", mode: "cardinal", ruler: "Venus", dates: "Sep 23 - Oct 22",
    traits: { id: ["Diplomat", "Adil", "Sosial", "Artistik"], zh: ["外交家", "公正", "社交达人", "有艺术感"], en: ["Diplomatic", "Fair", "Social", "Artistic"] },
    strengths: { id: ["Mediator hebat", "Charming", "Kooperatif", "Berwawasan"], zh: ["出色的调解者", "有魅力", "善于合作", "有远见"], en: ["Great mediator", "Charming", "Cooperative", "Fair-minded"] },
    weaknesses: { id: ["Tidak dapat memutuskan", "Menghindari konflik", "Mudah terpengaruh", "Plasitama"], zh: ["优柔寡断", "回避冲突", "容易受影响", "讨好型人格"], en: ["Indecisive", "Conflict-avoidant", "Easily influenced", "People-pleaser"] },
    compatibility: ["gemini", "aquarius", "leo", "sagittarius"],
    lucky: { numbers: [6, 9], colors: ["Pink", "Blue"], days: ["Friday"] },
    description: { id: "Libra dikuasai oleh Venus, melambangkan cinta dan harmoni.", zh: "天秤座由金星掌管，象征爱与和谐。", en: "Libra is ruled by Venus, representing love and harmony." },
  },
  scorpio: {
    name: { id: "Scorpio", zh: "天蝎座", en: "Scorpio" },
    symbol: "♏", element: "water", mode: "fixed", ruler: "Pluto", dates: "Oct 23 - Nov 21",
    traits: { id: ["Intens", "Misterius", "Setia", "Penuh gairah"], zh: ["强烈", "神秘", "忠诚", "充满激情"], en: ["Intense", "Mysterious", "Loyal", "Passionate"] },
    strengths: { id: ["Tekun", "Berwawasan", "Sumber daya", "Berani"], zh: ["坚韧", "有洞察力", "足智多谋", "勇敢"], en: ["Determined", "Insightful", "Resourceful", "Brave"] },
    weaknesses: { id: ["Cemburu", "Rahasia", "Manipulatif", "Pendendam"], zh: ["嫉妒", "神秘", "控制欲强", "记仇"], en: ["Jealous", "Secretive", "Manipulative", "Vengeful"] },
    compatibility: ["cancer", "pisces", "virgo", "capricorn"],
    lucky: { numbers: [8, 11], colors: ["Black", "Maroon"], days: ["Tuesday"] },
    description: { id: "Scorpio dikuasai oleh Pluto, planet transformasi.", zh: "天蝎座由冥王星掌管，代表转变。", en: "Scorpio is ruled by Pluto, planet of transformation." },
  },
  sagittarius: {
    name: { id: "Sagittarius", zh: "射手座", en: "Sagittarius" },
    symbol: "♐", element: "fire", mode: "mutable", ruler: "Jupiter", dates: "Nov 22 - Dec 21",
    traits: { id: ["Petualang", "Optimis", "Filosofis", "Jujur"], zh: ["冒险家", "乐观", "哲学家", "诚实"], en: ["Adventurous", "Optimistic", "Philosophical", "Honest"] },
    strengths: { id: ["Berwawasan luas", "Murah hati", "Menyenangkan", "Berpikiran terbuka"], zh: ["见多识广", "慷慨", "有趣", "思想开放"], en: ["Well-traveled", "Generous", "Fun-loving", "Open-minded"] },
    weaknesses: { id: ["Tidak sabar", "Tidak konsisten", "Blak-blakan", "Kurang tanggung jawab"], zh: ["不耐烦", "三心二意", "直言不讳", "不够负责"], en: ["Impatient", "Inconsistent", "Tactless", "Irresponsible"] },
    compatibility: ["aries", "leo", "libra", "aquarius"],
    lucky: { numbers: [3, 9], colors: ["Purple", "Turquoise"], days: ["Thursday"] },
    description: { id: "Sagittarius dikuasai oleh Jupiter, planet keberuntungan.", zh: "射手座由木星掌管，代表幸运和扩张。", en: "Sagittarius is ruled by Jupiter, planet of luck and expansion." },
  },
  capricorn: {
    name: { id: "Capricorn", zh: "摩羯座", en: "Capricorn" },
    symbol: "♑", element: "earth", mode: "cardinal", ruler: "Saturn", dates: "Dec 22 - Jan 19",
    traits: { id: ["Ambisius", "Disiplin", "Praktis", "Bertanggung jawab"], zh: ["有野心", "自律", "务实", "有责任感"], en: ["Ambitious", "Disciplined", "Practical", "Responsible"] },
    strengths: { id: ["Pengelola waktu hebat", "Setia", "Tekun", "Matang"], zh: ["时间管理大师", "忠诚", "坚韧", "成熟"], en: ["Great time manager", "Loyal", "Determined", "Mature"] },
    weaknesses: { id: ["Kaku", "Pesimis", "Keras", "Terlalu serius"], zh: ["固执", "悲观", "严厉", "过于严肃"], en: ["Stubborn", "Pessimistic", "Harsh", "Too serious"] },
    compatibility: ["taurus", "virgo", "scorpio", "pisces"],
    lucky: { numbers: [4, 8], colors: ["Brown", "Black"], days: ["Saturday"] },
    description: { id: "Capricorn dikuasai oleh Saturnus, planet struktur dan disiplin.", zh: "摩羯座由土星掌管，代表结构和纪律。", en: "Capricorn is ruled by Saturn, planet of structure and discipline." },
  },
  aquarius: {
    name: { id: "Aquarius", zh: "水瓶座", en: "Aquarius" },
    symbol: "♒", element: "air", mode: "fixed", ruler: "Uranus", dates: "Jan 20 - Feb 18",
    traits: { id: ["Unik", "Mandiri", "Humanitarian", "Pemikir"], zh: ["独特", "独立", "人道主义者", "思想家"], en: ["Unique", "Independent", "Humanitarian", "Thinker"] },
    strengths: { id: ["Visioner", "Orisinal", "Objektif", "Teman yang baik"], zh: ["有远见", "原创", "客观", "好朋友"], en: ["Visionary", "Original", "Objective", "Good friend"] },
    weaknesses: { id: ["Tidak emosional", "Keras kepala", "Tidak dapat diprediksi", "Aloof"], zh: ["缺乏情感", "固执", "不可预测", "疏离"], en: ["Unemotional", "Stubborn", "Unpredictable", "Aloof"] },
    compatibility: ["gemini", "libra", "aries", "sagittarius"],
    lucky: { numbers: [4, 7], colors: ["Electric Blue", "Silver"], days: ["Saturday"] },
    description: { id: "Aquarius dikuasai oleh Uranus, planet inovasi.", zh: "水瓶座由天王星掌管，代表创新。", en: "Aquarius is ruled by Uranus, planet of innovation." },
  },
  pisces: {
    name: { id: "Pisces", zh: "双鱼座", en: "Pisces" },
    symbol: "♓", element: "water", mode: "mutable", ruler: "Neptune", dates: "Feb 19 - Mar 20",
    traits: { id: ["Empati", "Artistik", "Intuitif", "Penuh kasih"], zh: ["有同理心", "有艺术感", "直觉强", "充满爱心"], en: ["Empathetic", "Artistic", "Intuitive", "Compassionate"] },
    strengths: { id: ["Kreatif", "Bijaksana", "Pendengar yang baik", "Romantis"], zh: ["有创意", "智慧", "善于倾听", "浪漫"], en: ["Creative", "Wise", "Good listener", "Romantic"] },
    weaknesses: { id: ["Terlalu sensitif", "Menghindari realitas", "Mudah terpengaruh", "Lemah"], zh: ["过于敏感", "逃避现实", "易受影响", "意志薄弱"], en: ["Overly sensitive", "Escapist", "Easily influenced", "Weak-willed"] },
    compatibility: ["cancer", "scorpio", "taurus", "capricorn"],
    lucky: { numbers: [3, 7], colors: ["Sea Green", "Lavender"], days: ["Thursday"] },
    description: { id: "Pisces dikuasai oleh Neptunus, planet mimpi dan intuisi.", zh: "双鱼座由海王星掌管，代表梦想和直觉。", en: "Pisces is ruled by Neptune, planet of dreams and intuition." },
  },
};

const ELEMENT_COLORS: Record<string, string> = { fire: "#FF4500", earth: "#8B4513", air: "#87CEEB", water: "#4169E1" };
const MODE_NAMES: Record<string, Record<string, string>> = {
  cardinal: { id: "Kardinal", zh: "基本宫", en: "Cardinal" },
  fixed: { id: "Tetap", zh: "固定宫", en: "Fixed" },
  mutable: { id: "Berubah", zh: "变动宫", en: "Mutable" },
};

export default function ZodiacDetailPage() {
  const params = useParams();
  const signId = (params?.id as string || "aries").toLowerCase();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const sign = SIGN_DATA[signId] || SIGN_DATA.aries;

  const labels = {
    element: language === "zh" ? "元素" : language === "id" ? "Unsur" : "Element",
    mode: language === "zh" ? "模式" : language === "id" ? "Mode" : "Mode",
    ruler: language === "zh" ? "守护星" : language === "id" ? "Penguasa" : "Ruler",
    strengths: language === "zh" ? "优点" : language === "id" ? "Kelebihan" : "Strengths",
    weaknesses: language === "zh" ? "弱点" : language === "id" ? "Kelemahan" : "Weaknesses",
    numbers: language === "zh" ? "幸运数字" : language === "id" ? "Angka Beruntung" : "Lucky Numbers",
    colors: language === "zh" ? "幸运颜色" : language === "id" ? "Warna Beruntung" : "Lucky Colors",
    days: language === "zh" ? "幸运日" : language === "id" ? "Hari Beruntung" : "Lucky Days",
    bestMatch: language === "zh" ? "最配星座" : language === "id" ? "Paling Cocok" : "Best Match",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] via-[#1a1a3a] to-[#f8fafc] text-white">
      

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center">
          <div className="text-8xl mb-4" style={{ color: ELEMENT_COLORS[sign.element] }}>{sign.symbol}</div>
          <h1 className="text-4xl font-bold text-amber-100 mb-2">{sign.name[language]}</h1>
          <p className="text-purple-300">{sign.dates}</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-purple-900/30 border border-purple-200">
            <div className="text-sm text-purple-300 mb-1">{labels.element}</div>
            <div className="text-xl font-bold" style={{ color: ELEMENT_COLORS[sign.element] }}>{sign.element.charAt(0).toUpperCase() + sign.element.slice(1)}</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-purple-900/30 border border-purple-200">
            <div className="text-sm text-purple-300 mb-1">{labels.mode}</div>
            <div className="text-xl font-bold text-amber-100">{MODE_NAMES[sign.mode][language]}</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-purple-900/30 border border-purple-200">
            <div className="text-sm text-purple-300 mb-1">{labels.ruler}</div>
            <div className="text-xl font-bold text-amber-100">{sign.ruler}</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-purple-900/30 border border-purple-200">
          <p className="text-purple-200 leading-relaxed text-lg">{sign.description[language]}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-green-900/20 border border-green-500/30">
            <h3 className="text-green-300 font-semibold mb-3">{labels.strengths}</h3>
            <ul className="space-y-2">
              {sign.strengths[language].map((s, i) => (
                <li key={i} className="flex items-center gap-2 text-green-200"><span>✓</span> {s}</li>
              ))}
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-orange-900/20 border border-orange-500/30">
            <h3 className="text-orange-300 font-semibold mb-3">{labels.weaknesses}</h3>
            <ul className="space-y-2">
              {sign.weaknesses[language].map((w, i) => (
                <li key={i} className="flex items-center gap-2 text-orange-200"><span>!</span> {w}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-amber-900/20 border border-amber-500/30">
            <h4 className="text-amber-300 text-sm mb-2">{labels.numbers}</h4>
            <div className="flex gap-2">{sign.lucky.numbers.map(n => <span key={n} className="px-3 py-1 bg-amber-500/20 rounded-full text-amber-100">{n}</span>)}</div>
          </div>
          <div className="p-4 rounded-xl bg-pink-900/20 border border-pink-500/30">
            <h4 className="text-pink-300 text-sm mb-2">{labels.colors}</h4>
            <div className="flex gap-2">{sign.lucky.colors.map(c => <span key={c} className="px-3 py-1 bg-pink-500/20 rounded-full text-pink-100">{c}</span>)}</div>
          </div>
          <div className="p-4 rounded-xl bg-blue-900/20 border border-blue-500/30">
            <h4 className="text-blue-300 text-sm mb-2">{labels.days}</h4>
            <div className="flex gap-2">{sign.lucky.days.map(d => <span key={d} className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-100">{d}</span>)}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-purple-900/30 border border-purple-200">
          <h3 className="text-amber-200 font-semibold mb-3">{labels.bestMatch}</h3>
          <div className="flex gap-3">
            {sign.compatibility.map(c => {
              const matchSign = SIGN_DATA[c];
              return (
                <Link key={c} href={`/zodiac/${c}`} className="p-3 rounded-xl bg-purple-800/30 hover:bg-purple-700/30 transition-colors">
                  <div className="text-2xl" style={{ color: ELEMENT_COLORS[matchSign?.element || "fire"] }}>{matchSign?.symbol}</div>
                  <div className="text-sm text-purple-200 mt-1">{matchSign?.name[language]}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
