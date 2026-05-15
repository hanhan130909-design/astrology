"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Star, Sun, Moon, Calendar, TrendingUp, Heart, Loader2, ChevronDown, Check, X, Sparkles, Lock, Share2, CheckCircle, MessageCircle } from 'lucide-react';

// Complete translations
const T = {
  zh: {
    back: '返回首页', title: '本命盘分析',
    birthInfo: '出生信息', person1: '第一人', person2: '第二人',
    year: '年', month: '月', day: '日', hour: '时', minute: '分',
    city: '城市', houseSystem: '分宫制',
    natal: '本命盘', transit: '推运盘', solar: '日返盘', lunar: '月返盘',
    progression: '法达星限', composite: '组合盘',
    transitDate: '推运日期', targetYear: '目标年份',
    chartName: '星盘名称（可选）',
    calculate: '生成星盘', calculating: '计算中...',
    chart: '星盘', planets: '行星', houses: '宫位', aspects: '相位', ai: 'AI解读',
    saveChart: '保存星盘', planetPositions: '行星位置',
    planet: '行星', sign: '星座', degree: '度数', house: '宫位',
    houseInfo: '宫位信息', majorAspects: '主要相位',
    chartSaved: '已保存！', loading: '加载中...',
    dayAfterBirth: '出生后第 {0} 天',
    savedCharts: '已保存的星盘', noSaved: '暂无保存的星盘',
    enterAll: '请填写完整的出生信息',
    ascendant: '上升点', midheaven: '天顶',
    conjunction: '合相', sextile: '六分', square: '四分', trine: '三分', opposition: '对分',
    error: '计算错误', retry: '重试',
    aiReading: 'AI 解读', simpleReading: '简要解读', deepReading: '深度解读',
    freeReading: '免费版', unlockDeep: '解锁深度解读',
    loginToUnlock: '登录解锁完整版', shareToUnlock: '或分享给3位好友解锁',
    shareWA: '分享到WhatsApp', shareProgress: '分享进度',
    shareComplete: '分享完成！已解锁', friend: '好友',
    corePersonality: '核心性格', emotionalWorld: '情感世界',
    loveDestiny: '爱情缘分', actionEnergy: '行动能量',
  },
  en: {
    back: 'Back to Home', title: 'Natal Chart',
    birthInfo: 'Birth Info', person1: 'Person 1', person2: 'Person 2',
    year: 'Year', month: 'Month', day: 'Day', hour: 'Hour', minute: 'Min',
    city: 'City', houseSystem: 'House System',
    natal: 'Natal', transit: 'Transit', solar: 'Solar Return', lunar: 'Lunar Return',
    progression: 'Progression', composite: 'Composite',
    transitDate: 'Transit Date', targetYear: 'Target Year',
    chartName: 'Chart name (optional)',
    calculate: 'Generate Chart', calculating: 'Calculating...',
    chart: 'Chart', planets: 'Planets', houses: 'Houses', aspects: 'Aspects', ai: 'AI Reading',
    saveChart: 'Save Chart', planetPositions: 'Planet Positions',
    planet: 'Planet', sign: 'Sign', degree: 'Degree', house: 'House',
    houseInfo: 'House Info', majorAspects: 'Major Aspects',
    chartSaved: 'Saved!', loading: 'Loading...',
    dayAfterBirth: 'Day {0} after birth',
    savedCharts: 'Saved Charts', noSaved: 'No saved charts',
    enterAll: 'Please enter complete birth information',
    ascendant: 'Ascendant', midheaven: 'Midheaven',
    conjunction: 'Conjunction', sextile: 'Sextile', square: 'Square', trine: 'Trine', opposition: 'Opposition',
    error: 'Calculation Error', retry: 'Retry',
    aiReading: 'AI Reading', simpleReading: 'Summary', deepReading: 'Deep Reading',
    freeReading: 'Free', unlockDeep: 'Unlock Deep Reading',
    loginToUnlock: 'Login to unlock full version', shareToUnlock: 'Or share with 3 friends to unlock',
    shareWA: 'Share to WhatsApp', shareProgress: 'Share Progress',
    shareComplete: 'Sharing complete! Unlocked', friend: 'Friend',
    corePersonality: 'Core Personality', emotionalWorld: 'Emotional World',
    loveDestiny: 'Love Destiny', actionEnergy: 'Action Energy',
  },
  id: {
    back: 'Kembali', title: 'Bagan Lahir',
    birthInfo: 'Data Lahir', person1: 'Orang 1', person2: 'Orang 2',
    year: 'Tahun', month: 'Bulan', day: 'Hari', hour: 'Jam', minute: 'Menit',
    city: 'Kota', houseSystem: 'Sistem Rumah',
    natal: 'Bagan Lahir', transit: 'Transit', solar: 'Solar Return', lunar: 'Lunar Return',
    progression: 'Progresi', composite: 'Komposit',
    transitDate: 'Tanggal Transit', targetYear: 'Tahun Target',
    chartName: 'Nama bagan (opsional)',
    calculate: 'Buat Bagan', calculating: 'Menghitung...',
    chart: 'Bagan', planets: 'Planet', houses: 'Rumah', aspects: 'Aspek', ai: 'AI Bacaan',
    saveChart: 'Simpan Bagan', planetPositions: 'Posisi Planet',
    planet: 'Planet', sign: 'Zodiak', degree: 'Derajat', house: 'Rumah',
    houseInfo: 'Info Rumah', majorAspects: 'Aspek Utama',
    chartSaved: 'Tersimpan!', loading: 'Memuat...',
    dayAfterBirth: 'Hari ke-{0} setelah lahir',
    savedCharts: 'Bagan Tersimpan', noSaved: 'Belum ada bagan',
    enterAll: 'Silakan masukkan informasi lahir lengkap',
    ascendant: 'Ascenden', midheaven: 'Medium Coeli',
    conjunction: 'Konjungsi', sextile: 'Sextil', square: 'Kotak', trine: 'Trine', opposition: 'Oposisi',
    error: 'Kesalahan Kalkulasi', retry: 'Coba lagi',
    aiReading: 'Pembacaan AI', simpleReading: 'Ringkasan', deepReading: 'Mendalam',
    freeReading: 'Gratis', unlockDeep: 'Buka Pembacaan Mendalam',
    loginToUnlock: 'Masuk untuk membuka versi lengkap', shareToUnlock: 'Atau bagikan ke 3 teman untuk membuka',
    shareWA: 'Bagikan ke WhatsApp', shareProgress: 'Progres Berbagi',
    shareComplete: 'Berbagi selesai! Terbuka', friend: 'Teman',
    corePersonality: 'Kepribadian Inti', emotionalWorld: 'Dunia Emosi',
    loveDestiny: 'Takdir Cinta', actionEnergy: 'Energi Aksi',
  },
};

const PLANETS_CN: Record<string, string> = {
  Sun: '太阳', Moon: '月亮', Mercury: '水星', Venus: '金星', Mars: '火星',
  Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Pluto: '冥王星',
  North_Node: '北交点', South_Node: '南交点',
};
const PLANET_KEYS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'North_Node', 'South_Node'];
const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '\u2609', Moon: '\u263D', Mercury: '\u263F', Venus: '\u2640', Mars: '\u2642', Jupiter: '\u2643', Saturn: '\u2644',
  Uranus: '\u2645', Neptune: '\u2646', Pluto: '\u2647', North_Node: '\u260A', South_Node: '\u260B',
};
const SIGN_SYMBOLS = ['\u2648', '\u2649', '\u264A', '\u264B', '\u264C', '\u264D', '\u264E', '\u264F', '\u2650', '\u2651', '\u2652', '\u2653'];
const SIGN_CN: Record<string, string> = {
  Aries: '白羊', Taurus: '金牛', Gemini: '双子', Cancer: '巨蟹', Leo: '狮子', Virgo: '处女',
  Libra: '天秤', Scorpio: '天蝎', Sagittarius: '射手', Capricorn: '摩羯', Aquarius: '水瓶', Pisces: '双鱼',
};
const SIGN_EN: Record<string, string> = {
  Aries: 'Aries', Taurus: 'Taurus', Gemini: 'Gemini', Cancer: 'Cancer', Leo: 'Leo', Virgo: 'Virgo',
  Libra: 'Libra', Scorpio: 'Scorpio', Sagittarius: 'Sagittarius', Capricorn: 'Capricorn', Aquarius: 'Aquarius', Pisces: 'Pisces',
};

const HOUSE_SYSTEMS = [
  { id: 'E', name: { zh: '等宫制', en: 'Equal House', id: 'Equal House' }, abbr: 'E' },
  { id: 'W', name: { zh: '整宫制', en: 'Whole Sign', id: 'Whole Sign' }, abbr: 'W' },
  { id: 'P', name: { zh: 'Porphyry', en: 'Porphyry', id: 'Porphyry' }, abbr: 'P' },
  { id: 'K', name: { zh: 'Koch (阿卡比特)', en: 'Koch', id: 'Koch' }, abbr: 'K' },
  { id: 'R', name: { zh: 'Regiomontanus', en: 'Regiomontanus', id: 'Regiomontanus' }, abbr: 'R' },
  { id: 'C', name: { zh: 'Campanus', en: 'Campanus', id: 'Campanus' }, abbr: 'C' },
];

// Enhanced aspect styling config
const ASPECT_STYLES: Record<string, { color: string; width: number; dash?: string; opacity: number; label: string }> = {
  Conjunction:   { color: '#FFD700', width: 1.0, opacity: 0.55, label: '\u260C' },
  Sextile:       { color: '#22C55E', width: 0.5, dash: '4 2', opacity: 0.4, label: '\u26B9' },
  Square:        { color: '#EF4444', width: 0.7, dash: '3 1', opacity: 0.5, label: '\u25A1' },
  Trine:         { color: '#3B82F6', width: 0.5, opacity: 0.45, label: '\u25B3' },
  Opposition:    { color: '#A855F7', width: 1.0, opacity: 0.55, label: '\u260D' },
};

const ASPECT_NAMES: Record<string, { zh: string, en: string, id: string }> = {
  Conjunction: { zh: '合', en: 'Conj', id: 'Konj' },
  Sextile: { zh: '六', en: 'Sext', id: 'Sext' },
  Square: { zh: '四', en: 'Sq', id: 'Kotak' },
  Trine: { zh: '三', en: 'Tri', id: 'Trine' },
  Opposition: { zh: '冲', en: 'Opp', id: 'Oposisi' },
};

// Planet colors with enhanced vibrancy
const PLANET_COLORS: Record<string, string> = {
  Sun: '#FFD700', Moon: '#E8E8E8', Mercury: '#87CEEB', Venus: '#FFB6C1', Mars: '#FF4500',
  Jupiter: '#FFA500', Saturn: '#B0C4DE', Uranus: '#40E0D0', Neptune: '#4169E1', Pluto: '#CD5C5C',
  North_Node: '#9370DB', South_Node: '#708090',
};

// Sign colors - element-based
const SIGN_COLORS = [
  '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA',
  '#FCBAD3', '#8E44AD', '#E74C3C', '#3498DB', '#1ABC9C', '#9B59B6',
];

const AI_READINGS = {
  Sun: {
    zh: {
      Aries: { summary: "天生的领导者，充满活力和开拓精神。", traits: ["领导力强", "行动果断", "独立自主"], advice: "学会耐心，避免冲动。" },
      Taurus: { summary: "追求稳定和物质安全，意志坚定。", traits: ["务实稳重", "有艺术天赋", "忠诚可靠"], advice: "保持开放心态，拥抱变化。" },
      Gemini: { summary: "思维敏捷，善于沟通和学习。", traits: ["思维敏捷", "善于沟通", "好奇心强"], advice: "培养专注力，深入某个领域。" },
      Cancer: { summary: "情感丰富，重视家庭和情感联系。", traits: ["情感细腻", "直觉力强", "保护欲强"], advice: "建立健康边界，放下过去。" },
      Leo: { summary: "天生具有王者气质，慷慨大方。", traits: ["自信慷慨", "创造力强", "领导魅力"], advice: "保持谦逊，分享舞台。" },
      Virgo: { summary: "注重细节，追求完美。", traits: ["注重细节", "分析能力强", "务实可靠"], advice: "接受不完美，善待自己。" },
      Libra: { summary: "追求和谐与美感，善于社交。", traits: ["追求和谐", "审美能力强", "善于合作"], advice: "学会独自决策，坚持立场。" },
      Scorpio: { summary: "有深刻的情感和强大的意志力。", traits: ["意志坚定", "洞察力强", "神秘魅力"], advice: "学会信任，放下控制。" },
      Sagittarius: { summary: "热爱自由和探索，乐观向上。", traits: ["乐观向上", "求知欲强", "慷慨大方"], advice: "培养耐心，履行承诺。" },
      Capricorn: { summary: "雄心勃勃，有强烈的责任感。", traits: ["雄心壮志", "责任感强", "自律性高"], advice: "学会放松，享受当下。" },
      Aquarius: { summary: "独立创新，关注人类福祉。", traits: ["独立创新", "博爱精神", "思想前卫"], advice: "保持情感连接，不要过度理性。" },
      Pisces: { summary: "敏感富有同情心，有艺术天赋。", traits: ["敏感多情", "艺术天赋", "同理心强"], advice: "建立健康边界，表达创意。" },
    },
    en: {
      Aries: { summary: "A natural leader, full of vitality and pioneering spirit.", traits: ["Strong leadership", "Decisive action", "Independent"], advice: "Learn patience, avoid impulsiveness." },
      Taurus: { summary: "Seeks stability and material security, strong-willed.", traits: ["Practical", "Artistic talent", "Loyal and reliable"], advice: "Stay open-minded, embrace change." },
      Gemini: { summary: "Quick-thinking, skilled at communication and learning.", traits: ["Quick-thinking", "Communicative", "Curious"], advice: "Develop focus, go deep in one area." },
      Cancer: { summary: "Emotionally rich, values family and emotional connections.", traits: ["Emotionally sensitive", "Strong intuition", "Protective"], advice: "Set healthy boundaries, let go of the past." },
      Leo: { summary: "Naturally regal, generous and charismatic.", traits: ["Confident and generous", "Creative", "Leadership charisma"], advice: "Stay humble, share the spotlight." },
      Virgo: { summary: "Detail-oriented, pursues perfection.", traits: ["Detail-oriented", "Strong analytical skills", "Practical"], advice: "Accept imperfection, be kind to yourself." },
      Libra: { summary: "Seeks harmony and beauty, socially skilled.", traits: ["Seeks harmony", "Strong aesthetic sense", "Cooperative"], advice: "Learn to decide alone, hold your ground." },
      Scorpio: { summary: "Deep emotions and powerful willpower.", traits: ["Strong-willed", "Perceptive", "Mysterious charm"], advice: "Learn to trust, let go of control." },
      Sagittarius: { summary: "Loves freedom and exploration, optimistic.", traits: ["Optimistic", "Curious", "Generous"], advice: "Cultivate patience, keep commitments." },
      Capricorn: { summary: "Ambitious with a strong sense of responsibility.", traits: ["Ambitious", "Responsible", "Self-disciplined"], advice: "Learn to relax, enjoy the present." },
      Aquarius: { summary: "Independent and innovative, cares about humanity.", traits: ["Independent", "Humanitarian", "Forward-thinking"], advice: "Maintain emotional connections, don't over-rationalize." },
      Pisces: { summary: "Sensitive and compassionate, artistically gifted.", traits: ["Sensitive", "Artistic talent", "Empathetic"], advice: "Set healthy boundaries, express creativity." },
    },
    id: {
      Aries: { summary: "Pemimpin alami, penuh vitalitas dan semangat pelopor.", traits: ["Kepemimpinan kuat", "Tindakan tegas", "Mandiri"], advice: "Belajar sabar, hindari impulsif." },
      Taurus: { summary: "Mencari stabilitas dan keamanan materi, berkemauan keras.", traits: ["Praktis", "Bakat seni", "Setia dan dapat diandalkan"], advice: "Tetap berpikiran terbuka, terima perubahan." },
      Gemini: { summary: "Berpikir cepat, terampil dalam komunikasi dan belajar.", traits: ["Berpikir cepat", "Komunikatif", "Penasaran"], advice: "Kembangkan fokus, dalami satu bidang." },
      Cancer: { summary: "Kaya emosi, menghargai keluarga dan koneksi emosional.", traits: ["Sensitif secara emosional", "Intuisi kuat", "Protektif"], advice: "Tetapkan batasan sehat, lepaskan masa lalu." },
      Leo: { summary: "Secara alami berwibawa, murah hati dan karismatik.", traits: ["Percaya diri dan murah hati", "Kreatif", "Karisma kepemimpinan"], advice: "Tetap rendah hati, berbagi panggung." },
      Virgo: { summary: "Berorientasi detail, mengejar kesempurnaan.", traits: ["Berorientasi detail", "Analitis kuat", "Praktis"], advice: "Terima ketidaksempurnaan, baik pada diri sendiri." },
      Libra: { summary: "Mencari harmoni dan keindahan, terampil secara sosial.", traits: ["Mencari harmoni", "Estetika kuat", "Kooperatif"], advice: "Belajar memutuskan sendiri, pegang pendirian." },
      Scorpio: { summary: "Emosi mendalam dan kemauan yang kuat.", traits: ["Berkemauan keras", "Perseptif", "Pesona misterius"], advice: "Belajar percaya, lepaskan kontrol." },
      Sagittarius: { summary: "Mencintai kebebasan dan eksplorasi, optimis.", traits: ["Optimis", "Penasaran", "Murah hati"], advice: "Kembangkan kesabaran, tepati janji." },
      Capricorn: { summary: "Ambisius dengan rasa tanggung jawab yang kuat.", traits: ["Ambisius", "Bertanggung jawab", "Disiplin diri"], advice: "Belajar bersantai, nikmati saat ini." },
      Aquarius: { summary: "Mandiri dan inovatif, peduli pada kemanusiaan.", traits: ["Mandiri", "Humanis", "Berpikiran maju"], advice: "Pertahankan koneksi emosional, jangan terlalu rasional." },
      Pisces: { summary: "Sensitif dan penuh kasih, berbakat seni.", traits: ["Sensitif", "Bakat seni", "Empatik"], advice: "Tetapkan batasan sehat, ekspresikan kreativitas." },
    },
  },
  Moon: {
    zh: {
      Aries: { summary: "情感表达直接热烈。", traits: ["情感直接", "独立性强", "情绪波动快"], advice: "学会情感耐心，不要急于反应。" },
      Taurus: { summary: "需要安全和稳定来感到满足。", traits: ["需要安全", "感官敏锐", "情感稳定"], advice: "不要过度依赖物质安全感。" },
      Gemini: { summary: "情绪与思维紧密相连。", traits: ["情感多变", "善于表达", "好奇心强"], advice: "深入探索情感，不要只是分析。" },
      Cancer: { summary: "极其重视家庭和情感。", traits: ["情感深刻", "直觉力强", "保护欲强"], advice: "学会放下过去，建立边界。" },
      Leo: { summary: "需要被欣赏来感到满足。", traits: ["需要关注", "情感慷慨", "创造力强"], advice: "学会自我认可，不完全依赖外界。" },
      Virgo: { summary: "需要感到有用和有秩序。", traits: ["情感内敛", "关怀体贴", "注重细节"], advice: "对自己温柔，学会自我接纳。" },
      Libra: { summary: "需要和谐的关系。", traits: ["追求和谐", "需要伴侣", "审美敏感"], advice: "学会面对冲突，不要过度妥协。" },
      Scorpio: { summary: "有深刻的情感需求。", traits: ["情感深刻", "直觉敏锐", "忠诚专一"], advice: "学会信任和放手。" },
      Sagittarius: { summary: "需要自由和冒险。", traits: ["情感乐观", "热爱自由", "哲学倾向"], advice: "培养情感深度，面对真实情感。" },
      Capricorn: { summary: "需要成就来感到安全。", traits: ["情感内敛", "责任感强", "情感稳定"], advice: "允许自己脆弱，情感是力量。" },
      Aquarius: { summary: "需要个人空间和智力交流。", traits: ["情感独立", "理性处理", "需要空间"], advice: "不要过度理性化情感。" },
      Pisces: { summary: "极度敏感，容易吸收他人情绪。", traits: ["极度敏感", "同理心强", "艺术天赋"], advice: "建立情感边界，保护自己。" },
    },
    en: {
      Aries: { summary: "Direct and passionate emotional expression.", traits: ["Direct emotions", "Strong independence", "Quick mood changes"], advice: "Learn emotional patience." },
      Taurus: { summary: "Needs security and stability to feel satisfied.", traits: ["Needs security", "Sensory awareness", "Emotionally stable"], advice: "Don't over-rely on material security." },
      Gemini: { summary: "Emotions closely tied to thinking.", traits: ["Variable emotions", "Expressive", "Curious"], advice: "Explore emotions deeply." },
      Cancer: { summary: "Highly values family and emotions.", traits: ["Deep emotions", "Strong intuition", "Protective"], advice: "Set boundaries, let go of past." },
      Leo: { summary: "Needs appreciation to feel satisfied.", traits: ["Needs attention", "Emotionally generous", "Creative"], advice: "Learn self-validation." },
      Virgo: { summary: "Needs to feel useful and orderly.", traits: ["Reserved emotions", "Caring", "Detail-oriented"], advice: "Be gentle with yourself." },
      Libra: { summary: "Needs harmonious relationships.", traits: ["Seeks harmony", "Needs partnership", "Aesthetically sensitive"], advice: "Face conflict." },
      Scorpio: { summary: "Has deep emotional needs.", traits: ["Deep emotions", "Sharp intuition", "Loyal"], advice: "Learn to trust." },
      Sagittarius: { summary: "Needs freedom and adventure.", traits: ["Emotionally optimistic", "Loves freedom", "Philosophical"], advice: "Develop emotional depth." },
      Capricorn: { summary: "Needs achievement to feel secure.", traits: ["Reserved emotions", "Responsible", "Emotionally stable"], advice: "Allow vulnerability." },
      Aquarius: { summary: "Needs space and intellectual exchange.", traits: ["Emotionally independent", "Rational", "Needs space"], advice: "Don't over-rationalize." },
      Pisces: { summary: "Extremely sensitive to others' emotions.", traits: ["Extremely sensitive", "Empathetic", "Artistic"], advice: "Set emotional boundaries." },
    },
    id: {
      Aries: { summary: "Ekspresi emosi langsung dan penuh semangat.", traits: ["Emosi langsung", "Kemandirian kuat", "Suasana hati cepat berubah"], advice: "Belajar kesabaran emosional." },
      Taurus: { summary: "Butuh keamanan dan stabilitas untuk merasa puas.", traits: ["Butuh keamanan", "Kesadaran sensorik", "Stabil secara emosional"], advice: "Jangan terlalu bergantung pada keamanan materi." },
      Gemini: { summary: "Emosi terkait erat dengan pemikiran.", traits: ["Emosi bervariasi", "Ekspresif", "Penasaran"], advice: "Jelajahi emosi secara mendalam." },
      Cancer: { summary: "Sangat menghargai keluarga dan emosi.", traits: ["Emosi mendalam", "Intuisi kuat", "Protektif"], advice: "Tetapkan batasan." },
      Leo: { summary: "Butuh apresiasi untuk merasa puas.", traits: ["Butuh perhatian", "Murah hati secara emosional", "Kreatif"], advice: "Belajar validasi diri." },
      Virgo: { summary: "Butuh merasa berguna dan teratur.", traits: ["Emosi tertahan", "Peduli", "Berorientasi detail"], advice: "Bersikap lembut pada diri sendiri." },
      Libra: { summary: "Butuh hubungan harmonis.", traits: ["Mencari harmoni", "Butuh kemitraan", "Sensitif estetika"], advice: "Hadapi konflik." },
      Scorpio: { summary: "Memiliki kebutuhan emosional yang mendalam.", traits: ["Emosi mendalam", "Intuisi tajam", "Setia"], advice: "Belajar percaya." },
      Sagittarius: { summary: "Butuh kebebasan dan petualangan.", traits: ["Optimis secara emosional", "Mencintai kebebasan", "Filosofis"], advice: "Kembangkan kedalaman emosional." },
      Capricorn: { summary: "Butuh pencapaian untuk merasa aman.", traits: ["Emosi tertahan", "Bertanggung jawab", "Stabil secara emosional"], advice: "Izinkan kerentanan." },
      Aquarius: { summary: "Butuh ruang dan pertukaran intelektual.", traits: ["Mandiri secara emosional", "Rasional", "Butuh ruang"], advice: "Jangan terlalu merasionalisasi." },
      Pisces: { summary: "Sangat sensitif terhadap emosi orang lain.", traits: ["Sangat sensitif", "Empatik", "Artistik"], advice: "Tetapkan batasan emosional." },
    },
  },
};

function tx(key: string, lang: 'zh' | 'en' | 'id'): string {
  return (T[lang] as Record<string, string>)?.[key] || (T.zh as Record<string, string>)?.[key] || key;
}

function CustomSelect({ value, onChange, options, label }: {
  value: string; onChange: (v: string) => void; options: { id: string; name: string }[]; label?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const selected = options.find(o => o.id === value);

  return (
    <div className="relative" ref={ref}>
      {label && <label className="block text-xs text-slate-400 mb-1">{label}</label>}
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-left flex items-center justify-between hover:bg-slate-800 transition-colors">
        <span className="text-white text-sm">{selected?.name || 'Select...'}</span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 py-1 rounded-xl bg-slate-800 border border-slate-700 z-50 max-h-60 overflow-y-auto">
          {options.map(opt => (
            <button key={opt.id} onClick={() => { onChange(opt.id); setOpen(false); }}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-700 ${value === opt.id ? 'text-purple-400' : 'text-slate-300'}`}>
              {opt.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== OPTIMIZED NATAL CHART SVG ====================
function NatalChartSVG({ planets, houses, aspects, ascendant, midheaven, size = 420 }: {
  planets: any; houses: any[]; aspects: any[]; ascendant?: number; midheaven?: number; size?: number;
}) {
  const cx = size / 2, cy = size / 2;

  // Ring proportions optimized for readability
  const rOut = cx - 4;
  const rSignOut = rOut;
  const rSignIn = rOut - 32;
  const rHouseOut = rSignIn - 4;
  const rHouseIn = rHouseOut - 36;
  const rPlanet = rHouseIn - 6;
  const rCenter = cy - rPlanet - 10;

  const ascLon = ascendant || (houses?.[0]?.longitude) || 0;
  const mcLon = midheaven || 0;

  // Convert ecliptic longitude to SVG angle (ASC on LEFT, counter-clockwise)
  const lonToAngle = (lon: number) => {
    const rel = ((lon - ascLon + 180) % 360 + 360) % 360;
    return (rel * Math.PI) / 180;
  };
  const lonToXY = (lon: number, radius: number) => ({
    x: cx + radius * Math.cos(lonToAngle(lon)),
    y: cy - radius * Math.sin(lonToAngle(lon)),
  });

  // Multi-level planet overlap prevention
  const sortedPlanets = PLANET_KEYS
    .filter(k => planets?.[k] && !planets[k].error && planets[k].longitude != null)
    .map(k => ({ key: k, ...planets[k] }))
    .sort((a: any, b: any) => a.longitude - b.longitude);

  const CLUSTER_THRESHOLD = 8;
  const OFFSET_STEP = 11;
  const planetOffsets: Record<string, number> = {};

  // Identify clusters
  const clusters: number[][] = [];
  let currentCluster: number[] = [];
  for (let i = 0; i < sortedPlanets.length; i++) {
    if (currentCluster.length === 0) { currentCluster.push(i); }
    else {
      const prev = sortedPlanets[currentCluster[currentCluster.length - 1]];
      const curr = sortedPlanets[i];
      const diff = ((curr.longitude - prev.longitude + 360) % 360 + 360) % 360;
      if (diff < CLUSTER_THRESHOLD) { currentCluster.push(i); }
      else { clusters.push(currentCluster); currentCluster = [i]; }
    }
  }
  if (currentCluster.length > 0) clusters.push(currentCluster);

  // Assign offsets within clusters
  clusters.forEach(cluster => {
    if (cluster.length <= 1) { planetOffsets[sortedPlanets[cluster[0]].key] = 0; return; }
    const midIdx = Math.floor(cluster.length / 2);
    cluster.forEach((idx, rank) => {
      const offsetLevel = Math.abs(rank - midIdx);
      const direction = rank < midIdx ? -1 : 1;
      planetOffsets[sortedPlanets[idx].key] = direction * offsetLevel * OFFSET_STEP;
    });
  });

  // Planet positions for aspect lines
  const planetPositions: Record<string, { x: number; y: number }> = {};
  PLANET_KEYS.forEach(key => {
    const p = planets?.[key];
    if (!p?.error && p?.longitude != null) {
      const off = planetOffsets[key] || 0;
      const angle = lonToAngle(p.longitude);
      planetPositions[key] = { x: cx + (rPlanet + off) * Math.cos(angle), y: cy - (rPlanet + off) * Math.sin(angle) };
    }
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-lg mx-auto drop-shadow-2xl">
      <defs>
        <radialGradient id="bgG" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#12102a"/><stop offset="60%" stopColor="#0a0818"/><stop offset="100%" stopColor="#050410"/>
        </radialGradient>
        <filter id="gl" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glStrong" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="innerShadow">
          <feOffset dx="0" dy="1"/><feGaussianBlur stdDeviation="1" result="ob"/>
          <feComposite operator="out" in="SourceGraphic" in2="ob" result="inv"/>
          <feFlood floodColor="black" floodOpacity="0.35" result="col"/>
          <feComposite operator="in" in="col" in2="inv" result="sh"/>
          <feComposite operator="over" in="sh" in2="SourceGraphic"/>
        </filter>
        <mask id="aspectMask">
          <rect width="100%" height="100%" fill="white"/>
          <circle cx={cx} cy={cy} r={rCenter * 0.35} fill="black"/>
        </mask>
      </defs>

      {/* Background */}
      <circle cx={cx} cy={cy} r={rOut} fill="url(#bgG)" stroke="#2d2a4d" strokeWidth="1.2"/>

      {/* Zodiac ring segments */}
      {SIGN_SYMBOLS.map((sym, i) => {
        const sa = lonToAngle(i * 30), ea = lonToAngle((i + 1) * 30);
        const x1 = cx + rSignOut * Math.cos(sa), y1 = cy - rSignOut * Math.sin(sa);
        const x2 = cx + rSignOut * Math.cos(ea), y2 = cy - rSignOut * Math.sin(ea);
        const x3 = cx + rSignIn * Math.cos(ea), y3 = cy - rSignIn * Math.sin(ea);
        const x4 = cx + rSignIn * Math.cos(sa), y4 = cy - rSignIn * Math.sin(sa);
        const largeArc = (ea - sa + 2 * Math.PI) > Math.PI ? 1 : 0;
        return (<path key={i} d={`M ${x1} ${y1} A ${rSignOut} ${rSignOut} 0 ${largeArc} 0 ${x2} ${y2} L ${x3} ${y3} A ${rSignIn} ${rSignIn} 0 ${largeArc} 1 ${x4} ${y4} Z`} fill={SIGN_COLORS[i]} opacity={0.10}/>);
      })}

      {/* Ring borders */}
      <circle cx={cx} cy={cy} r={rSignOut} fill="none" stroke="#4a4778" strokeWidth="1.2"/>
      <circle cx={cx} cy={cy} r={rSignIn} fill="none" stroke="#2d2a4d" strokeWidth="0.8"/>

      {/* Sign boundary tick marks */}
      {SIGN_SYMBOLS.map((_, i) => {
        const p1 = lonToXY(i * 30, rSignIn), p2 = lonToXY(i * 30, rSignOut);
        return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#4a4778" strokeWidth="0.7"/>;
      })}

      {/* Zodiac symbols with subtle glow */}
      {SIGN_SYMBOLS.map((sym, i) => {
        const pos = lonToXY(i * 30 + 15, (rSignOut + rSignIn) / 2);
        return (<text key={i} x={pos.x} y={pos.y + 5} textAnchor="middle" fontSize="13" fontWeight="bold" fill={SIGN_COLORS[i]} style={{ filter: `drop-shadow(0 0 3px ${SIGN_COLORS[i]}40)` }}>{sym}</text>);
      })}

      {/* House ring borders */}
      <circle cx={cx} cy={cy} r={rHouseOut} fill="none" stroke="#4a4778" strokeWidth="0.8"/>
      <circle cx={cx} cy={cy} r={rHouseIn} fill="none" stroke="#2d2a4d" strokeWidth="0.8"/>

      {/* House cusp lines */}
      {(houses || []).map((h: any, idx: number) => {
        const p1 = lonToXY(h.longitude, rCenter + 2);
        const p2 = lonToXY(h.longitude, rHouseOut);
        const isAngular = [1, 4, 7, 10].includes(h.house);
        const houseLineEnd = isAngular ? rSignOut : rHouseOut;
        const p2Ext = lonToXY(h.longitude, houseLineEnd);
        return (<line key={idx} x1={p1.x} y1={p1.y} x2={p2Ext.x} y2={p2Ext.y} stroke={isAngular ? '#818CF8' : '#3d3a5c'} strokeWidth={isAngular ? 1.8 : 0.7} strokeDasharray={isAngular ? 'none' : '3 3'}/>);
      })}

      {/* House numbers */}
      {(houses || []).map((h: any, idx: number) => {
        const next = houses[(idx + 1) % (houses?.length || 12)];
        if (!next) return null;
        let midLon: number;
        if (h.longitude < next.longitude) { midLon = h.longitude + (next.longitude - h.longitude) / 2; }
        else { midLon = h.longitude + (next.longitude + 360 - h.longitude) / 2; }
        const numPos = lonToXY(midLon % 360, (rHouseOut + rHouseIn) / 2);
        const isAngular = [1, 4, 7, 10].includes(h.house);
        return (<text key={idx} x={numPos.x} y={numPos.y + 4} textAnchor="middle" fontSize={isAngular ? '12' : '9'} fontWeight={isAngular ? 'bold' : 'normal'} fill={isAngular ? '#A78BFA' : '#5a5678'}>{h.house}</text>);
      })}

      {/* ALL house cusp degrees (not just angular) */}
      {(houses || []).map((h: any, idx: number) => {
        const degVal = h.degree != null ? h.degree : (h.longitude % 30);
        const degPos = lonToXY(h.longitude, rHouseIn - 10);
        const isAngular = [1, 4, 7, 10].includes(h.house);
        return (<text key={'deg'+idx} x={degPos.x} y={degPos.y + 3} textAnchor="middle" fontSize={isAngular ? '8' : '6'} fill={isAngular ? '#9CA3AF' : '#4a4670'}>{Math.floor(degVal)}\u00B0</text>);
      })}

            {/* Aspect lines styled by type (center-empty mask) */}
      <g mask="url(#aspectMask)">

      {(aspects || []).slice(0, 25).map((asp: any, i: number) => {
        const p1Pos = planetPositions[asp.planet1];
        const p2Pos = planetPositions[asp.planet2];
        if (!p1Pos || !p2Pos) return null;
        const aspType = asp.aspect || asp.type;
        const style = ASPECT_STYLES[aspType];
        if (!style) return null;
        return (<line key={i} x1={p1Pos.x} y1={p1Pos.y} x2={p2Pos.x} y2={p2Pos.y} stroke={style.color} strokeWidth={style.width} strokeOpacity={style.opacity} strokeDasharray={style.dash || 'none'}/>);
      })}

            </g>
      {/* END aspect lines */}
      {/* ASC marker with triangle indicator */}
      {(() => {
        const p = lonToXY(ascLon, rHouseOut + 18);
        return (<g filter="url(#glStrong)">
          <polygon points={`${p.x},${p.y - 10} ${p.x - 6},${p.y + 4} ${p.x + 6},${p.y + 4}`} fill="#FBBF24" opacity={0.9}/>
          <text x={p.x} y={p.y + 17} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#FBBF24">ASC</text>
        </g>);
      })()}
      {/* MC marker */}
      {mcLon > 0 && (() => {
        const p = lonToXY(mcLon, rHouseOut + 18);
        return (<g filter="url(#glStrong)">
          <polygon points={`${p.x},${p.y - 8} ${p.x - 5},${p.y + 3} ${p.x + 5},${p.y + 3}`} fill="#A78BFA" opacity={0.85}/>
          <text x={p.x} y={p.y + 15} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#A78BFA">MC</text>
        </g>);
      })()}

      {/* Planets with glow and overlap offsets */}
      {sortedPlanets.map((p: any) => {
        const offset = planetOffsets[p.key] || 0;
        const angle = lonToAngle(p.longitude);
        const pos = { x: cx + (rPlanet + offset) * Math.cos(angle), y: cy - (rPlanet + offset) * Math.sin(angle) };
        const color = PLANET_COLORS[p.key] || '#fbbf24';
        return (<g key={p.key} filter="url(#gl)">
          <circle cx={pos.x} cy={pos.y} r="12" fill={`${color}18`} stroke={color} strokeWidth="1.3"/>
          <text x={pos.x} y={pos.y + 4} textAnchor="middle" fontSize="11" fontWeight="bold" fill={color}>{PLANET_SYMBOLS[p.key]}</text>
          {p.retrograde && <text x={pos.x + 10} y={pos.y - 8} fontSize="7" fontWeight="bold" fill="#F87171">R</text>}
        </g>);
      })}

      {/* Center circle */}
      <circle cx={cx} cy={cy} r={rCenter} fill="#08061a" stroke="rgba(124,58,237,0.35)" strokeWidth="1.2" filter="url(#innerShadow)"/>
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="20" fill="#FBBF24" filter="url(#gl)">&#10022;</text>
      <text x={cx} y={cy + 11} textAnchor="middle" fontSize="7" fill="#6366A8" letterSpacing="2">\u661F\u7F18</text>
    </svg>
  );
}

export default function NatalPage() {
  const [lang, setLang] = useState<'zh' | 'en' | 'id'>('zh');
  const [chartType, setChartType] = useState('natal');
  const [form, setForm] = useState({ name: '', year: 1990, month: 6, day: 15, hour: 12, minute: 0, houseSystem: 'P', lat: 39.9042, lng: 116.4074 });
  const [secForm, setSecForm] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() });
  const [p2Form, setP2Form] = useState({ year: 1992, month: 3, day: 20, hour: 10, minute: 0 });
  const [chart, setChart] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState('chart');
  const [saved, setSaved] = useState<any[]>([]);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [shareCount, setShareCount] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    try { const s = localStorage.getItem('natal_ai_unlock'); if (s) { const j = JSON.parse(s); if (j.shareCount) setShareCount(j.shareCount); if (j.isUnlocked) setIsUnlocked(true); } } catch {}
  }, []);

  const saveUnlockState = (updates: any) => { try { localStorage.setItem('natal_ai_unlock', JSON.stringify({ ...JSON.parse(localStorage.getItem('natal_ai_unlock') || '{}'), ...updates })); } catch {} };

  const handleShare = () => {
    const txt = lang === 'zh' ? '\u6211\u521A\u521A\u7528\u661F\u7F18\u751F\u6210\u4E86\u6211\u7684\u672C\u547D\u76D8\uFF0C\u5FEB\u6765\u8BD5\u8BD5\uFF01https://astrology-clean.vercel.app/natal' : lang === 'id' ? `Saya baru saja membuat bagan lahir saya di Xingyuan, coba juga! https://astrology-clean.vercel.app/natal` : `I just generated my natal chart on Starry Fate, come try it! https://astrology-clean.vercel.app/natal`;
    window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`, '_blank');
    const n = Math.min(shareCount + 1, 3); setShareCount(n); saveUnlockState({ shareCount: n });
    if (n >= 3) { setTimeout(() => { setIsUnlocked(true); saveUnlockState({ isUnlocked: true }); }, 1500); }
  };

  const activeLat = form.lat, activeLng = form.lng, activeTz = 8;

  useEffect(() => { try { const s = localStorage.getItem('natal_charts'); if (s) setSaved(JSON.parse(s)); } catch {} }, []);

  const calculate = async () => {
    setLoading(true); setError(null);
    try {
      let body: any = { year: form.year, month: form.month, day: form.day, hour: form.hour, minute: form.minute, latitude: activeLat, longitude: activeLng, timezone: activeTz, houseSystem: form.houseSystem };
      if (['transit', 'solar', 'lunar', 'progression', 'composite'].includes(chartType)) {
        body = { type: chartType === 'solar' ? 'solar_return' : chartType === 'lunar' ? 'lunar_return' : chartType, birthData: { year: form.year, month: form.month, day: form.day, hour: form.hour, minute: form.minute, lat: activeLat, lng: activeLng, tz: activeTz }, houseSystem: form.houseSystem };
        if (['transit', 'solar', 'lunar'].includes(chartType)) body.transitDate = { year: secForm.year, month: secForm.month, day: secForm.day, hour: 12, minute: 0 };
        if (chartType === 'progression') body.transitDate = { year: secForm.year };
        if (chartType === 'composite') body.birthData2 = { year: p2Form.year, month: p2Form.month, day: p2Form.day, hour: p2Form.hour, minute: p2Form.minute, lat: 39.9042, lng: 116.4074, tz: 8 };
      }
      const ep = ['transit', 'solar', 'lunar', 'progression', 'composite'].includes(chartType) ? '/api/chart/transit' : '/api/chart';
      const res = await fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setChart(data.data || data);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  const handleSave = () => {
    if (!chart) return;
    const ns = [{ name: form.name || `${form.year}-${form.month}-${form.day}`, birthData: form, chartData: chart, ts: Date.now() }, ...saved.slice(0, 9)];
    setSaved(ns); localStorage.setItem('natal_charts', JSON.stringify(ns)); setSaveMsg(tx('chartSaved', lang)); setTimeout(() => setSaveMsg(null), 2000);
  };

  const loadChart = (c: any) => { setForm({ ...form, name: c.name, year: c.birthData.year, month: c.birthData.month, day: c.birthData.day, hour: c.birthData.hour, minute: c.birthData.minute }); if (c.chartData) setChart(c.chartData); };

  const years = Array.from({ length: 100 }, (_, i) => 2025 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const houseOptions = HOUSE_SYSTEMS.map(h => ({ id: h.id, name: h.name[lang] || h.name.zh }));
  const yearOptions = years.map(y => ({ id: String(y), name: String(y) }));
  const monthOptions = months.map(m => ({ id: String(m), name: String(m) }));
  const dayOptions = days.map(d => ({ id: String(d), name: String(d) }));
  const hourOptions = hours.map(h => ({ id: String(h), name: String(h).padStart(2, '0') }));
  const minOptions = minutes.filter(m => m % 5 === 0).map(m => ({ id: String(m), name: String(m).padStart(2, '0') }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030014] via-[#0f0f23] to-[#030014] text-white">
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#030014]/90 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/chart" className="flex items-center gap-2 text-purple-300 hover:text-white"><ArrowLeft size={20} /><span className="text-sm">{tx('back', lang)}</span></Link>
          <h1 className="text-lg font-bold text-white">\u661F\u7F18</h1>
          <div className="flex gap-1 bg-white/5 rounded-xl p-1">
            {(['zh', 'en', 'id'] as const).map(l => (<button key={l} onClick={() => setLang(l)} className={`px-3 py-1 rounded-lg text-xs font-medium ${lang === l ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>{l === 'zh' ? '\u4E2D\u6587' : l === 'en' ? 'EN' : 'ID'}</button>))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
          {[{ id: 'natal', icon: Star, label: 'natal' }, { id: 'transit', icon: TrendingUp, label: 'transit' }, { id: 'solar', icon: Sun, label: 'solar' }, { id: 'lunar', icon: Moon, label: 'lunar' }, { id: 'progression', icon: Calendar, label: 'progression' }, { id: 'composite', icon: Heart, label: 'composite' }].map(t => { const Ic = t.icon; return (<button key={t.id} onClick={() => { setChartType(t.id); setChart(null); }} className={`p-3 rounded-xl border transition-all ${chartType === t.id ? 'bg-purple-600/20 border-purple-500 text-purple-300' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}><Ic size={18} className="mx-auto mb-1" /><div className="text-xs">{tx(t.label, lang)}</div></button>); })}
        </div>

        {saved.length > 0 && (<div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10"><h3 className="text-sm text-slate-400 mb-2">{tx('savedCharts', lang)}</h3><div className="flex gap-2 overflow-x-auto pb-2">{saved.map((c, i) => (<button key={i} onClick={() => loadChart(c)} className="flex-shrink-0 px-3 py-2 rounded-lg bg-white/5 text-sm text-slate-300 hover:bg-white/10">{c.name}</button>))}</div></div>)}

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Star size={18} className="text-purple-400" />{tx('birthInfo', lang)}</h3>
            <div className="space-y-4">
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder={tx('chartName', lang)} className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500" />
              <div className="grid grid-cols-2 gap-2"><div><label className="text-xs text-slate-400 mb-1 block">{lang === 'zh' ? '\u7EAC\u5EA6' : lang === 'id' ? 'Lintang' : 'Latitude'}</label><input type="number" value={form.lat} onChange={e => setForm({ ...form, lat: parseFloat(e.target.value) || 0 })} step="any" placeholder="39.9042" className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm" /></div><div><label className="text-xs text-slate-400 mb-1 block">{lang === 'zh' ? '\u7ECF\u5EA6' : lang === 'id' ? 'Bujur' : 'Longitude'}</label><input type="number" value={form.lng} onChange={e => setForm({ ...form, lng: parseFloat(e.target.value) || 0 })} step="any" placeholder="116.4074" className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm" /></div></div>
              <div className="grid grid-cols-3 gap-2"><CustomSelect value={String(form.year)} onChange={v => setForm({ ...form, year: Number(v) })} options={yearOptions} label={tx('year', lang)} /><CustomSelect value={String(form.month)} onChange={v => setForm({ ...form, month: Number(v) })} options={monthOptions} label={tx('month', lang)} /><CustomSelect value={String(form.day)} onChange={v => setForm({ ...form, day: Number(v) })} options={dayOptions} label={tx('day', lang)} /></div>
              <div className="grid grid-cols-2 gap-2"><CustomSelect value={String(form.hour)} onChange={v => setForm({ ...form, hour: Number(v) })} options={hourOptions} label={tx('hour', lang)} /><CustomSelect value={String(form.minute)} onChange={v => setForm({ ...form, minute: Number(v) })} options={minOptions} label={tx('minute', lang)} /></div>
              <CustomSelect value={form.houseSystem} onChange={v => setForm({ ...form, houseSystem: v })} options={houseOptions} label={tx('houseSystem', lang)} />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            {['transit', 'solar', 'lunar'].includes(chartType) && (<><h3 className="font-bold mb-4 flex items-center gap-2"><Calendar size={18} className="text-cyan-400" />{tx('transitDate', lang)}</h3><div className="grid grid-cols-3 gap-2 mb-4"><CustomSelect value={String(secForm.year)} onChange={v => setSecForm({ ...secForm, year: Number(v) })} options={yearOptions} />{chartType !== 'progression' && (<><CustomSelect value={String(secForm.month)} onChange={v => setSecForm({ ...secForm, month: Number(v) })} options={monthOptions} /><CustomSelect value={String(secForm.day)} onChange={v => setSecForm({ ...secForm, day: Number(v) })} options={dayOptions} /></>)}</div></>)}
            {chartType === 'progression' && (<><h3 className="font-bold mb-4 flex items-center gap-2"><Calendar size={18} className="text-emerald-400" />{tx('targetYear', lang)}</h3><CustomSelect value={String(secForm.year)} onChange={v => setSecForm({ ...secForm, year: Number(v) })} options={yearOptions} /><p className="text-xs text-slate-500 mt-2">{tx('dayAfterBirth', lang).replace('{0}', String(secForm.year - form.year))}</p></>)}
            {chartType === 'composite' && (<><h3 className="font-bold mb-4 flex items-center gap-2"><Heart size={18} className="text-pink-400" />{tx('person2', lang)}</h3><div className="space-y-3"><div className="grid grid-cols-3 gap-2"><CustomSelect value={String(p2Form.year)} onChange={v => setP2Form({ ...p2Form, year: Number(v) })} options={yearOptions} /><CustomSelect value={String(p2Form.month)} onChange={v => setP2Form({ ...p2Form, month: Number(v) })} options={monthOptions} /><CustomSelect value={String(p2Form.day)} onChange={v => setP2Form({ ...p2Form, day: Number(v) })} options={dayOptions} /></div><div className="grid grid-cols-2 gap-2"><CustomSelect value={String(p2Form.hour)} onChange={v => setP2Form({ ...p2Form, hour: Number(v) })} options={hourOptions} /><CustomSelect value={String(p2Form.minute)} onChange={v => setP2Form({ ...p2Form, minute: Number(v) })} options={minOptions} /></div></div></>)}
            <button onClick={calculate} disabled={loading} className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2">{loading ? <><Loader2 size={18} className="animate-spin" />{tx('calculating', lang)}</> : <><Star size={18} />{tx('calculate', lang)}</>}</button>
            {error && (<div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2"><X size={16} />{error}<button onClick={calculate} className="ml-auto text-red-300 hover:text-red-200">{tx('retry', lang)}</button></div>)}
          </div>
        </div>

        {chart && (<div className="mt-8 space-y-6">
          <div className="flex gap-2 p-1 rounded-xl bg-white/5 max-w-lg mx-auto flex-wrap">{['chart', 'planets', 'houses', 'aspects', 'ai'].map(t => (<button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors min-w-[60px] ${tab === t ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>{t === 'ai' ? 'AI' : tx(t, lang)}</button>))}</div>

          {tab === 'chart' && (<div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center"><NatalChartSVG planets={chart.planets || {}} houses={chart.houses || []} aspects={chart.aspects || []} ascendant={chart.ascendant?.longitude} midheaven={chart.midheaven?.longitude} size={450} /><button onClick={handleSave} className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm flex items-center gap-2 mx-auto transition-colors"><Save size={16} />{saveMsg || tx('saveChart', lang)}</button></div>)}

          {tab === 'planets' && (<div className="p-6 rounded-2xl bg-white/5 border border-white/10"><h3 className="font-bold mb-4">{tx('planetPositions', lang)}</h3><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-white/10"><th className="text-left py-2 text-slate-400">{tx('planet', lang)}</th><th className="text-left py-2 text-slate-400">{tx('sign', lang)}</th><th className="text-left py-2 text-slate-400">{tx('degree', lang)}</th></tr></thead><tbody>{PLANET_KEYS.map(key => { const p = chart.planets?.[key]; if (!p || p.error) return null; return (<tr key={key} className="border-b border-white/5"><td className="py-2 flex items-center gap-2"><span>{PLANET_SYMBOLS[key]}</span><span className="text-amber-400">{PLANETS_CN[key] || key}</span></td><td className="py-2"><span className="mr-1">{SIGN_SYMBOLS[['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'].indexOf(p.sign)]}</span>{p.sign_cn || p.sign}</td><td className="py-2">{Math.floor(p.degree)}&deg; {Math.floor((p.degree % 1) * 60)}&apos;</td></tr>); })}</tbody></table></div></div>)}

          {tab === 'houses' && (<div className="p-6 rounded-2xl bg-white/5 border border-white/10"><h3 className="font-bold mb-4">{tx('houseInfo', lang)}</h3><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">{(chart.houses || []).map((h: any) => { const isAng = [1, 4, 7, 10].includes(h.house); const isSuc = [2, 5, 8, 11].includes(h.house); return (<div key={h.house} className={`p-3 rounded-xl ${isAng ? 'bg-amber-500/10 border border-amber-500/30' : isSuc ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-white/5'}`}><div className="font-bold text-white">{h.house}{lang === 'zh' ? '\u5BAB' : ' House'}</div><div className="text-sm text-slate-400">{SIGN_SYMBOLS[['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'].indexOf(h.sign)]} {h.sign_cn || h.sign}</div><div className="text-xs text-slate-500">{Math.floor(h.degree)}&deg; {Math.floor((h.degree % 1) * 60)}&apos;</div></div>); })}</div>{chart.ascendant && (<div className="mt-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/30"><span className="text-purple-400">{tx('ascendant', lang)}:</span> {SIGN_SYMBOLS[['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'].indexOf(chart.ascendant.sign)]} {chart.ascendant.sign_cn || chart.ascendant.sign} {Math.floor(chart.ascendant.degree)}&deg;<span className="mx-3 text-slate-500">|</span><span className="text-cyan-400">{tx('midheaven', lang)}:</span> {SIGN_SYMBOLS[['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'].indexOf(chart.midheaven?.sign)]} {chart.midheaven?.sign_cn || chart.midheaven?.sign} {Math.floor(chart.midheaven?.degree || 0)}&deg;</div>)}</div>)}

          {tab === 'aspects' && (<div className="p-6 rounded-2xl bg-white/5 border border-white/10"><h3 className="font-bold mb-4">{tx('majorAspects', lang)}</h3><div className="grid md:grid-cols-2 gap-3">{(chart.aspects || []).filter((a: any) => ['Conjunction', 'Sextile', 'Square', 'Trine', 'Opposition'].includes(a.aspect || a.type)).slice(0, 20).map((a: any, i: number) => { const typ = a.aspect || a.type; const an = ASPECT_NAMES[typ] || { zh: typ, en: typ, id: typ }; const st = ASPECT_STYLES[typ]; return (<div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5"><div className="flex items-center gap-2"><span className="text-amber-400">{PLANET_SYMBOLS[a.planet1] || a.planet1}</span><span className="text-slate-500">-</span><span style={{ color: st?.color || '#888' }}>{st?.label || ''} {an[lang as keyof typeof an] || typ}</span><span className="text-slate-500">-</span><span className="text-amber-400">{PLANET_SYMBOLS[a.planet2] || a.planet2}</span></div><span className="text-slate-400 text-xs">{Math.abs(a.orb || a.orb).toFixed(1)}&deg;</span></div>); })}</div>{(chart.aspects || []).length === 0 && (<p className="text-center text-slate-500 py-8">{lang === 'zh' ? '\u6682\u65E0\u76F8\u4F4D\u6570\u636E' : lang === 'id' ? 'Tidak ada data aspek' : 'No aspect data'}</p>)}</div>)}

          {tab === 'ai' && (<div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10"><h3 className="font-bold mb-4 flex items-center gap-2"><Sparkles size={18} className="text-amber-400" />{tx('simpleReading', lang)}<span className="ml-2 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">{tx('freeReading', lang)}</span></h3><div className="space-y-4">{chart.planets?.Sun?.sign && (AI_READINGS.Sun as any)?.[lang]?.[chart.planets.Sun.sign] && (<div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"><h4 className="font-bold mb-2 flex items-center gap-2 text-amber-400"><span>\u2609</span>{tx('corePersonality', lang)} \u2014 {chart.planets.Sun.sign_cn || chart.planets.Sun.sign}</h4><p className="text-slate-300 text-sm mb-2">{(AI_READINGS.Sun as any)[lang][chart.planets.Sun.sign].summary}</p><div className="flex flex-wrap gap-2 mb-2">{(AI_READINGS.Sun as any)[lang][chart.planets.Sun.sign].traits.map((t: string, i: number) => (<span key={i} className="px-2 py-1 rounded-full text-xs bg-amber-500/20 text-amber-300">{t}</span>))}</div><p className="text-xs text-slate-400 italic">\uD83D\uDCA1 {(AI_READINGS.Sun as any)[lang][chart.planets.Sun.sign].advice}</p></div>)}{chart.planets?.Moon?.sign && (AI_READINGS.Moon as any)?.[lang]?.[chart.planets.Moon.sign] && (<div className="p-4 rounded-xl bg-slate-500/10 border border-slate-500/20"><h4 className="font-bold mb-2 flex items-center gap-2 text-slate-400"><span>\u263D</span>{tx('emotionalWorld', lang)} \u2014 {chart.planets.Moon.sign_cn || chart.planets.Moon.sign}</h4><p className="text-slate-300 text-sm mb-2">{(AI_READINGS.Moon as any)[lang][chart.planets.Moon.sign].summary}</p><div className="flex flex-wrap gap-2 mb-2">{(AI_READINGS.Moon as any)[lang][chart.planets.Moon.sign].traits.map((t: string, i: number) => (<span key={i} className="px-2 py-1 rounded-full text-xs bg-slate-500/20 text-slate-300">{t}</span>))}</div><p className="text-xs text-slate-400 italic">\uD83D\uDCA1 {(AI_READINGS.Moon as any)[lang][chart.planets.Moon.sign].advice}</p></div>)}</div></div>

            <div className="rounded-2xl overflow-hidden border border-white/10"><div className="p-5 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 flex items-center justify-between"><h3 className="font-bold flex items-center gap-2">{isUnlocked ? <Sparkles size={18} className="text-purple-400" /> : <Lock size={18} className="text-slate-400" />}{tx('deepReading', lang)}</h3>{isUnlocked && <span className="text-xs text-green-400 flex items-center gap-1"><CheckCircle size={14} />{tx('shareComplete', lang)}</span>}</div>
            {isUnlocked ? (<div className="p-5 space-y-4">{chart.planets?.Venus?.sign && (<div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20"><h4 className="font-bold mb-2 flex items-center gap-2 text-pink-400"><span>\u2640</span>{tx('loveDestiny', lang)} \u2014 {chart.planets.Venus.sign_cn || chart.planets.Venus.sign}</h4><p className="text-slate-300 text-sm">{lang === 'zh' ? `\u91D1\u661F\u5728${chart.planets.Venus.sign_cn}\uFF0C\u4F60\u7684\u7231\u60C5\u98CE\u683C\u72EC\u7279\u800C\u8FF7\u4EBA\u3002` : lang === 'id' ? `Venus di ${chart.planets.Venus.sign}, gaya cinta Anda unik.` : `Venus in ${chart.planets.Venus.sign}, your love style is unique.`}</p></div>)}{chart.planets?.Mars?.sign && (<div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20"><h4 className="font-bold mb-2 flex items-center gap-2 text-red-400"><span>\u2642</span>{tx('actionEnergy', lang)} \u2014 {chart.planets.Mars.sign_cn || chart.planets.Mars.sign}</h4><p className="text-slate-300 text-sm">{lang === 'zh' ? `\u706B\u661F\u5728${chart.planets.Mars.sign_cn}\uFF0C\u4F60\u7684\u884C\u52A8\u529B\u548C\u9A71\u52A8\u529B\u7279\u5F81\u9C9C\u660E\u3002` : lang === 'id' ? `Mars di ${chart.planets.Mars.sign}, energi aksi Anda sangat khas.` : `Mars in ${chart.planets.Mars.sign}, your action energy is distinctive.`}</p></div>)}{chart.ascendant?.sign && (<div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20"><h4 className="font-bold mb-2 flex items-center gap-2 text-purple-400"><span>\u2191</span>{tx('ascendant', lang)} \u2014 {chart.ascendant.sign_cn || chart.ascendant.sign} {Math.floor(chart.ascendant.degree)}&deg;</h4><p className="text-slate-300 text-sm">{lang === 'zh' ? `\u4E0A\u5347${chart.ascendant.sign_cn}\u662F\u4F60\u7ED9\u4EBA\u7684\u7B2C\u4E00\u5370\u8C61\u3002` : lang === 'id' ? `Ascenden ${chart.ascendant.sign} adalah kesan pertama Anda.` : `Ascendant ${chart.ascendant.sign} is your first impression.`}</p></div>)}<div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20"><h4 className="font-bold mb-2 text-cyan-400">{tx('planetPositions', lang)}</h4><div className="flex flex-wrap gap-2">{PLANET_KEYS.filter(k => chart.planets?.[k]?.sign).map(k => (<span key={k} className="px-2 py-1 rounded-lg text-xs bg-white/5 text-slate-400">{PLANET_SYMBOLS[k]} {chart.planets[k].sign_cn || chart.planets[k].sign}</span>))}</div></div></div>) : (<div className="p-6 space-y-5"><div className="relative"><div className="space-y-3 blur-sm pointer-events-none select-none opacity-60"><div className="p-4 rounded-xl bg-white/5"><div className="h-4 bg-white/10 rounded w-3/4 mb-2" /><div className="h-3 bg-white/5 rounded w-full" /></div><div className="p-4 rounded-xl bg-white/5"><div className="h-4 bg-white/10 rounded w-2/3 mb-2" /><div className="h-3 bg-white/5 rounded w-full" /></div></div><div className="absolute inset-0 flex items-center justify-center"><div className="text-center"><Lock size={32} className="text-slate-400 mx-auto mb-2" /><p className="text-slate-300 font-medium">{tx('unlockDeep', lang)}</p></div></div></div><div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20"><div className="flex items-center gap-3 mb-3"><MessageCircle size={20} className="text-green-400" /><div><div className="font-medium text-white text-sm">{tx('shareToUnlock', lang)}</div></div></div><div className="flex gap-2 mb-3">{[1, 2, 3].map(n => (<div key={n} className={`flex-1 h-2 rounded-full transition-all ${shareCount >= n ? "bg-green-500" : "bg-white/10"}`} />))}</div><div className="text-xs text-slate-400 mb-3">{tx('shareProgress', lang)}: {shareCount}/3</div>{shareCount < 3 ? (<div className="grid grid-cols-3 gap-2">{[1, 2, 3].map(n => (<button key={n} onClick={handleShare} disabled={shareCount >= n} className={`py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${shareCount >= n ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-white/5 hover:bg-green-500/20 text-slate-300 hover:text-green-300 border border-white/10"}`}>{shareCount >= n ? <CheckCircle size={12} /> : <Share2 size={12} />}{tx('friend', lang)} {n}</button>))}</div>) : (<div className="text-center text-green-400 font-medium text-sm flex items-center justify-center gap-2"><CheckCircle size={16} />{tx('shareComplete', lang)}</div>)}</div></div>)}</div></div>)}
        </div>)}
      </main>
    </div>
  );
}
