"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import ProfessionalNatalChart from '@/components/ProfessionalNatalChart';
import AlmutenChartLayout from '@/components/AlmutenChartLayout';
import { ArrowLeft, Save, Star, Sun, Moon, Calendar, TrendingUp, Heart, Loader2, ChevronDown, Check, X, Sparkles, Lock, Share2, CheckCircle, MessageCircle, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { saveChartToCloud, loadChartsFromCloud, deleteChartFromCloud, syncLocalChartsToCloud } from '@/lib/chartSync';

// Complete translations
const T = {
  zh: {
    back: '返回首页', title: '本命盘分析', myCharts: '我的',
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
    descP1: '本命盘（出生星盘）是根据你出生时的精确时间、地点绘制的天文星图。它记录了太阳、月亮及各行星在黄道十二宫中的位置，是你独一无二的宇宙身份证。',
    descP2: '通过本命盘分析，你可以深入了解自己的核心性格、情感模式、人际关系和人生使命。每一颗行星的位置和相位都揭示着你生命中的不同面向。',
    descP3: '无论你是占星初学者还是资深爱好者，本命盘都是探索自我最基础也最重要的工具。立即生成你的免费本命盘，开启宇宙之旅。',
    faq1Q: '什么是本命盘？', faq1A: '本命盘是根据你出生的精确时间、日期和地点绘制的天文星图，展示了那一刻天空中所有行星和宫位的位置。它就像你生命的宇宙地图，揭示你的性格特质和人生方向。',
    faq2Q: '本命盘准确吗？', faq2A: '本命盘基于真实天文数据计算，使用瑞士星历表等专业数据源。出生时间越精确，分析结果越准确，尤其是上升点和宫位划分对时间非常敏感。',
    faq3Q: '上升星座和太阳星座有什么区别？', faq3A: '太阳星座是你出生时太阳所在的星座，代表核心自我；上升星座是出生时东方地平线升起的星座，代表你给外界的第一印象和外在表现方式。两者共同塑造你的完整人格。',
    faq4Q: '如何看本命盘中的相位？', faq4A: '相位是行星之间的角度关系，主要包括合相、六分、四分、三分和对分。和谐相位（三分、六分）带来天赋和顺畅能量，紧张相位（四分、对分）带来挑战和成长动力。',
    faq5Q: '宫位在本命盘中代表什么？', faq5A: '本命盘的十二宫位代表生活的不同领域：第一宫代表自我形象，第七宫代表伴侣关系，第十宫代表事业。行星落入不同宫位，会影响该领域的生活体验。',
    faq6Q: '出生时间不准确怎么办？', faq6A: '如果不确定出生时间，可以使用中午12点作为默认时间。但上升点和宫位可能不准确，建议尽量获取准确的出生时间以获得更完整的分析。',
    faq7Q: '本命盘可以预测未来吗？', faq7A: '本命盘本身不直接预测未来，它揭示你的天赋、挑战和生命模式。结合推运盘（行运行星与本命盘的互动），可以了解当前的能量趋势和潜在机遇。',
    faqTitle: '常见问题',
  },
  en: {
    back: 'Back to Home', title: 'Natal Chart', myCharts: 'My',
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
    descP1: 'A natal chart (birth chart) is an astronomical map created from the exact time and place of your birth. It records the positions of the Sun, Moon, and all planets across the zodiac — your unique cosmic fingerprint.',
    descP2: 'Through natal chart analysis, you can gain deep insights into your core personality, emotional patterns, relationships, and life purpose. Each planet\'s position and aspect reveals a different dimension of your life.',
    descP3: 'Whether you\'re a beginner or experienced astrology enthusiast, the natal chart is the most fundamental and important tool for self-discovery. Generate your free natal chart now and begin your cosmic journey.',
    faq1Q: 'What is a natal chart?', faq1A: 'A natal chart is an astronomical map calculated from your exact birth time, date, and location, showing the positions of all planets and houses at that moment. It serves as your cosmic blueprint, revealing personality traits and life directions.',
    faq2Q: 'How accurate is a natal chart?', faq2A: 'Natal charts are calculated using real astronomical data, including the Swiss Ephemeris. The more precise your birth time, the more accurate the analysis — especially for the Ascendant and house divisions which are very time-sensitive.',
    faq3Q: 'What is the difference between Rising sign and Sun sign?', faq3A: 'Your Sun sign is where the Sun was at birth, representing your core self. Your Rising sign (Ascendant) is the zodiac sign rising on the eastern horizon at birth, representing your outward persona and first impressions. Both shape your complete personality.',
    faq4Q: 'How do I read aspects in a natal chart?', faq4A: 'Aspects are angular relationships between planets, mainly including conjunction, sextile, square, trine, and opposition. Harmonious aspects (trine, sextile) bring talents and flowing energy, while challenging aspects (square, opposition) bring growth through tension.',
    faq5Q: 'What do houses represent in a natal chart?', faq5A: 'The twelve houses represent different life areas: the 1st house is self-image, the 7th is partnerships, the 10th is career. Planet positions in different houses influence how you experience those life domains.',
    faq6Q: 'What if I don\'t know my exact birth time?', faq6A: 'If unsure, use noon as default. However, the Ascendant and house placements may be inaccurate. For the most complete analysis, try to obtain your accurate birth time from birth records.',
    faq7Q: 'Can a natal chart predict the future?', faq7A: 'A natal chart itself doesn\'t predict the future directly — it reveals your innate gifts, challenges, and life patterns. Combined with transit charts (current planetary positions interacting with your natal chart), you can understand current energy trends and potential opportunities.',
    faqTitle: 'Frequently Asked Questions',
  },
  id: {
    back: 'Kembali', title: 'Bagan Lahir', myCharts: 'Saya',
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
    descP1: 'Bagan lahir (natal chart) adalah peta astronomi yang dibuat dari waktu dan tempat kelahiran Anda yang tepat. Ini mencatat posisi Matahari, Bulan, dan semua planet di zodiak — sidik jari kosmik unik Anda.',
    descP2: 'Melalui analisis bagan lahir, Anda dapat memperoleh wawasan mendalam tentang kepribadian inti, pola emosional, hubungan, dan tujuan hidup. Setiap posisi dan aspek planet mengungkap dimensi kehidupan Anda.',
    descP3: 'Baik Anda pemula atau penggemar astrologi berpengalaman, bagan lahir adalah alat paling fundamental untuk penemuan diri. Buat bagan lahir gratis Anda sekarang dan mulai perjalanan kosmik Anda.',
    faq1Q: 'Apa itu bagan lahir?', faq1A: 'Bagan lahir adalah peta astronomi yang dihitung dari waktu, tanggal, dan tempat kelahiran Anda yang tepat, menunjukkan posisi semua planet dan rumah pada saat itu. Ini menjadi cetak biru kosmik Anda, mengungkap sifat kepribadian dan arah hidup.',
    faq2Q: 'Seberapa akurat bagan lahir?', faq2A: 'Bagan lahir dihitung menggunakan data astronomi nyata, termasuk Swiss Ephemeris. Semakin tepat waktu kelahiran Anda, semakin akurat analisisnya — terutama untuk Ascenden dan pembagian rumah yang sangat sensitif terhadap waktu.',
    faq3Q: 'Apa perbedaan tanda naik dan tanda matahari?', faq3A: 'Tanda matahari adalah posisi Matahari saat lahir, mewakili diri inti Anda. Tanda naik (Ascenden) adalah zodiak yang terbit di cakrawala timur saat lahir, mewakili penampilan luar dan kesan pertama. Keduanya membentuk kepribadian lengkap Anda.',
    faq4Q: 'Bagaimana cara membaca aspek dalam bagan lahir?', faq4A: 'Aspek adalah hubungan sudut antar planet, terutama konjungsi, sextil, kotak, trine, dan oposisi. Aspek harmonis (trine, sextil) membawa bakat dan energi mengalir, sedangkan aspek menantang (kotak, oposisi) membawa pertumbuhan melalui ketegangan.',
    faq5Q: 'Apa yang diwakili rumah dalam bagan lahir?', faq5A: 'Dua belas rumah mewakili area kehidupan berbeda: rumah 1 adalah citra diri, rumah 7 adalah kemitraan, rumah 10 adalah karir. Planet di rumah berbeda mempengaruhi bagaimana Anda mengalami domain kehidupan tersebut.',
    faq6Q: 'Bagaimana jika saya tidak tahu waktu kelahiran yang tepat?', faq6A: 'Jika tidak yakin, gunakan siang hari sebagai default. Namun, Ascenden dan penempatan rumah mungkin tidak akurat. Untuk analisis terlengkap, cobalah mendapatkan waktu kelahiran akurat dari catatan kelahiran.',
    faq7Q: 'Apakah bagan lahir bisa memprediksi masa depan?', faq7A: 'Bagan lahir sendiri tidak memprediksi masa depan secara langsung — ini mengungkap bakat bawaan, tantangan, dan pola hidup Anda. Dikombinasikan dengan bagan transit, Anda dapat memahami tren energi saat ini dan peluang potensial.',
    faqTitle: 'Pertanyaan yang Sering Diajukan',
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
  Chiron: '\u2A51', Lilith: '\u2601', PartOfFortune: '\u2295', Vertex: 'Vx',
};
const PLANET_TEXT: Record<string, string> = {
  Sun: 'Su', Moon: 'Mo', Mercury: 'Me', Venus: 'Ve', Mars: 'Ma', Jupiter: 'Ju', Saturn: 'Sa',
  Uranus: 'Ur', Neptune: 'Ne', Pluto: 'Pl', North_Node: 'NN', South_Node: 'SN',
  Chiron: 'Ch', Lilith: 'Li', PartOfFortune: 'PF', Vertex: 'Vx',
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
  { id: 'P', name: { zh: 'Porphyry (推荐)', en: 'Porphyry (Recommended)', id: 'Porphyry' }, abbr: 'P' },
  { id: 'E', name: { zh: '等宫制', en: 'Equal House', id: 'Equal House' }, abbr: 'E' },
  { id: 'W', name: { zh: '整宫制', en: 'Whole Sign', id: 'Whole Sign' }, abbr: 'W' },
  { id: 'K', name: { zh: 'Koch (开发中)', en: 'Koch (In Dev)', id: 'Koch' }, abbr: 'K' },
  { id: 'R', name: { zh: 'Regiomontanus (开发中)', en: 'Regiomontanus (In Dev)', id: 'Regiomontanus' }, abbr: 'R' },
  { id: 'C', name: { zh: 'Campanus (开发中)', en: 'Campanus (In Dev)', id: 'Campanus' }, abbr: 'C' },
];

// Enhanced aspect styling config
const ASPECT_STYLES: Record<string, { color: string; width: number; dash?: string; opacity: number; label: string }> = {
  Conjunction:   { color: '#FFD700', width: 0.8, opacity: 0.5, label: '\u260C' },
  Sextile:       { color: '#22C55E', width: 0.5, dash: '4 2', opacity: 0.35, label: '\u26B9' },
  Square:        { color: '#EF4444', width: 0.6, dash: '3 1', opacity: 0.4, label: '\u25A1' },
  Trine:         { color: '#3B82F6', width: 0.5, opacity: 0.4, label: '\u25B3' },
  Opposition:    { color: '#A855F7', width: 0.7, opacity: 0.45, label: '\u260D' },
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
      Aquarius: { summary: "Independent and innovative, cares about humanity.", traits: ["Independent", "Humanitarian", "Forward-thinking"], advice: "Maintain emotional connections, don\'t over-rationalize." },
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
          <circle cx={cx} cy={cy} r={rCenter * 0.42} fill="black"/>
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
          <text x={pos.x} y={pos.y + 4} textAnchor="middle" fontSize="12" fontWeight="bold" fill={color} fontFamily="Segoe UI Symbol, Apple Symbols, Noto Sans Symbols 2, serif">{PLANET_SYMBOLS[p.key] || PLANET_TEXT[p.key] || p.key[0]}</text>
          {p.retrograde && <text x={pos.x + 10} y={pos.y - 8} fontSize="7" fontWeight="bold" fill="#F87171">R</text>}
        </g>);
      })}

      {/* Center circle */}
      <circle cx={cx} cy={cy} r={rCenter} fill="#08061a" stroke="rgba(124,58,237,0.35)" strokeWidth="1.2" filter="url(#innerShadow)"/>
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="20" fill="#FBBF24" filter="url(#gl)">&#10022;</text>
      <text x={cx} y={cy + 11} textAnchor="middle" fontSize="7" fill="#6366A8" letterSpacing="2">星缘</text>
    </svg>
  );
}

export default function NatalPage() {
  const [lang, setLang] = useState<'zh' | 'en' | 'id'>('zh');
  const [chartType, setChartType] = useState('natal');
  const browserTz = typeof window !== 'undefined' ? -(new Date().getTimezoneOffset() / 60) : 8;
  const [form, setForm] = useState({ name: 'han', year: 1986, month: 11, day: 14, hour: 18, minute: 33, houseSystem: 'P', lat: 41.66, lng: 123.34, tz: 8 });
  const [cityName, setCityName] = useState('中国辽宁省沈阳市苏家屯区');
  const [secForm, setSecForm] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() });
  const [p2Form, setP2Form] = useState({ year: 1992, month: 3, day: 20, hour: 10, minute: 0 });
  const [chart, setChart] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState('chart');
  const [saved, setSaved] = useState<any[]>([]);
  // 地理编码状态
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoadingTz, setGeoLoadingTz] = useState(false);

  // ─── 自动时区功能 ───
  // 根据经纬度估算 IANA 时区名称（浏览器原生 Intl API，无需 API Key）
  // 根据经纬度自动计算时区（纯数学，不依赖 Intl API，兼容所有浏览器）
  const getTimezoneFromLatLng = (lat: number, lng: number): number => {
    // 每15°经度 = 1小时时差
    // 特殊地区修正：
    const specialZones: [number, number, number, number, number][] = [
      // [latMin, latMax, lngMin, lngMax, tz]
      [20, 54, 73.5, 135, 8],    // 中国大部分地区 UTC+8（含沈阳）
      [18, 55, 42, 87, 6],       // 哈萨克斯坦等 UTC+6
      [6, 36, 68, 97.5, 5.5],    // 印度 UTC+5:30
      [23, 39, 61, 77, 5],       // 巴基斯坦 UTC+5
      [25, 45, 44, 63, 3.5],     // 伊朗 UTC+3:30
      [33, 40, 44, 60, 4.5],     // 阿富汗 UTC+4:30
      [20, 29, 88, 97.5, 6.5],   // 缅甸 UTC+6:30
      [-8, 5, 95, 141, 7],       // 印尼 UTC+7（大部分）
      [-8, -1, 115, 120, 8],     // 印尼部分 UTC+8
      [-35, -11, 112, 154, 9.5], // 澳大利亚中部 UTC+9:30
      [30, 45, 126, 146, 9],     // 日本/韩国 UTC+9
      [24, 46, 129, 146, 9],     // 韩国 UTC+9
      [-47, -34, 166, 179, 12],  // 新西兰 UTC+12
      [-10, 5, 120, 128, 8],     // 菲律宾 UTC+8
      [1, 23, 100, 109, 7],      // 泰国 UTC+7
      [8, 24, 98, 109, 7],       // 越南/老挝/柬埔寨 UTC+7
      [22, 26, 120, 122, 8],     // 台湾 UTC+8
      [22, 42, 114, 123, 8],     // 中国华南/华东 UTC+8
      [-15, 5, -82, -34, -3],    // 巴西 UTC-3
      [-56, -20, -76, -48, -3],  // 阿根廷 UTC-3
      [-18, 0, -82, -68, -5],    // 秘鲁/哥伦比亚 UTC-5
      [14, 33, -118, -86, -6],   // 墨西哥大部分 UTC-6
      [25, 49, -125, -67, -5],   // 美国东部 UTC-5
      [32, 49, -125, -104, -7],  // 美国山地 UTC-7
      [32, 49, -125, -115, -8],  // 美国太平洋 UTC-8
    ];

    for (const [latMin, latMax, lngMin, lngMax, tz] of specialZones) {
      if (lat >= latMin && lat <= latMax && lng >= lngMin && lng <= lngMax) {
        return tz;
      }
    }

    return Math.round(lng / 15);
  };
  
  // 地理编码函数 - 使用 Nominatim (OpenStreetMap) 免费 API
  // 城市搜索成功后，自动查询时区并更新时区选择器
  const geocodeAddress = async (address: string) => {
    if (!address.trim()) {
      setGeoError(lang === 'zh' ? '请输入地址' : lang === 'id' ? 'Masukkan alamat' : 'Please enter an address');
      return;
    }
    
    setGeoLoading(true);
    setGeoError(null);
    // 同步计算时区，无需loading
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        
        // 同时更新经纬度和时区
        const tzOffset = getTimezoneFromLatLng(lat, lng);
        
        setForm(prev => ({ ...prev, lat, lng, tz: tzOffset }));
        setCityName(data[0].display_name?.split(',')[0] || address);
        setGeoError(null);
      } else {
        setGeoError(lang === 'zh' ? '未找到该地址，请尝试其他关键词' : lang === 'id' ? 'Alamat tidak ditemukan' : 'Address not found');
        // 即使地址没找到，也保留经纬度让用户手动调整
      }
    } catch (err) {
      setGeoError(lang === 'zh' ? '地理编码失败，请手动输入经纬度' : lang === 'id' ? 'Gagal mendapatkan koordinat' : 'Geocoding failed');
    } finally {
      setGeoLoading(false);
    // 时区已同步计算完成
    }
  };

  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [shareCount, setShareCount] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { user, isFirebaseReady } = useAuth();

  useEffect(() => {
    try { const s = localStorage.getItem('natal_ai_unlock'); if (s) { const j = JSON.parse(s); if (j.shareCount) setShareCount(j.shareCount); if (j.isUnlocked) setIsUnlocked(true); } } catch {}
  }, []);

  const saveUnlockState = (updates: any) => { try { localStorage.setItem('natal_ai_unlock', JSON.stringify({ ...JSON.parse(localStorage.getItem('natal_ai_unlock') || '{}'), ...updates })); } catch {} };

  const handleShare = () => {
    const txt = lang === 'zh' ? '\u6211\u521A\u521A\u7528\u661F\u7F18\u751F\u6210\u4E86\u6211\u7684\u672C\u547D\u76D8\uFF0C\u5FEB\u6765\u8BD5\u8BD5\uFF01https://lunaxstar.com/natal' : lang === 'id' ? `Saya baru saja membuat bagan lahir saya di Xingyuan, coba juga! https://lunaxstar.com/natal` : `I just generated my natal chart on Starry Fate, come try it! https://lunaxstar.com/natal`;
    window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`, '_blank');
    const n = Math.min(shareCount + 1, 3); setShareCount(n); saveUnlockState({ shareCount: n });
    if (n >= 3) { setTimeout(() => { setIsUnlocked(true); saveUnlockState({ isUnlocked: true }); }, 1500); }
  };

  const activeLat = form.lat, activeLng = form.lng;

  // Load charts from Firestore if logged in, otherwise from localStorage
  useEffect(() => {
    if (user && isFirebaseReady) {
      // Logged in: load from Firestore
      loadChartsFromCloud(user.uid).then(cloudCharts => {
        setSaved(cloudCharts);
      }).catch(err => console.error('Failed to load from cloud:', err));
    } else {
      // Not logged in: load from localStorage
      try {
        const s = localStorage.getItem('natal_charts');
        if (s) setSaved(JSON.parse(s));
      } catch (e) {}
    }
  }, [user, isFirebaseReady]);

  // Sync localStorage to cloud on login
  useEffect(() => {
    if (user && isFirebaseReady) {
      syncLocalChartsToCloud(user.uid).then(() => {
        // Reload from cloud after sync
        return loadChartsFromCloud(user.uid);
      }).then(cloudCharts => {
        setSaved(cloudCharts);
      }).catch(err => console.error('Sync failed:', err));
    }
  }, [user, isFirebaseReady]);

  const calculate = async () => {
    if (form.lat === 0 || form.lng === 0) {
      setError(lang === 'zh' ? '请输入经纬度' : lang === 'id' ? 'Silakan masukkan lintang dan bujur' : 'Please enter latitude and longitude');
      return;
    }
    setLoading(true); setError(null);
    try {
      let body: any = { year: form.year, month: form.month, day: form.day, hour: form.hour, minute: form.minute, latitude: activeLat, longitude: activeLng, timezone: form.tz, houseSystem: form.houseSystem };
      if (['transit', 'solar', 'lunar', 'progression', 'composite'].includes(chartType)) {
        body = { type: chartType === 'solar' ? 'solar_return' : chartType === 'lunar' ? 'lunar_return' : chartType, birthData: { year: form.year, month: form.month, day: form.day, hour: form.hour, minute: form.minute, lat: activeLat, lng: activeLng, tz: form.tz }, houseSystem: form.houseSystem };
        if (['transit', 'solar', 'lunar'].includes(chartType)) body.transitDate = { year: secForm.year, month: secForm.month, day: secForm.day, hour: 12, minute: 0 };
        if (chartType === 'progression') body.transitDate = { year: secForm.year };
        if (chartType === 'composite') body.birthData2 = { year: p2Form.year, month: p2Form.month, day: p2Form.day, hour: p2Form.hour, minute: p2Form.minute, lat: 39.9042, lng: 116.4074, tz: form.tz };
      }
      const ep = ['transit', 'solar', 'lunar', 'progression', 'composite'].includes(chartType) ? '/api/chart/transit' : '/api/chart';
      const res = await fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setChart(data.data || data);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!chart) return;
    const newChart = { 
      name: form.name || `${form.year}-${form.month}-${form.day}`, 
      birthData: form, 
      chartData: chart, 
      ts: Date.now() 
    };
    
    if (user && isFirebaseReady) {
      // Logged in: save to Firestore
      try {
        await saveChartToCloud(newChart, user.uid);
        const cloudCharts = await loadChartsFromCloud(user.uid);
        setSaved(cloudCharts);
      } catch (err) {
        console.error('Failed to save to cloud:', err);
        // Fallback to localStorage
        const ns = [newChart, ...saved.slice(0, 9)];
        setSaved(ns);
        localStorage.setItem('natal_charts', JSON.stringify(ns));
      }
    } else {
      // Not logged in: save to localStorage
      const ns = [newChart, ...saved.slice(0, 9)];
      setSaved(ns);
      localStorage.setItem('natal_charts', JSON.stringify(ns));
    }
    setSaveMsg(tx('chartSaved', lang));
    setTimeout(() => setSaveMsg(null), 3000);
  };

  const handleDelete = async (ts: number) => {
    if (user && isFirebaseReady) {
      try {
        await deleteChartFromCloud(String(ts), user.uid);
        const cloudCharts = await loadChartsFromCloud(user.uid);
        setSaved(cloudCharts);
      } catch (err) {
        console.error('Failed to delete from cloud:', err);
      }
    }
    const ns = saved.filter(c => c.ts !== ts);
    setSaved(ns);
    localStorage.setItem('natal_charts', JSON.stringify(ns));
  };

  const handleLoad = (c: any) => {
    const d = c.birthData;
    setForm({ name: c.name, year: d.year, month: d.month, day: d.day, hour: d.hour, minute: d.minute, houseSystem: d.houseSystem, lat: d.lat, lng: d.lng, tz: d.tz });
    setChart(c.chartData);
    setTab('chart');
    setSaveMsg(tx('loading', lang));
    setTimeout(() => setSaveMsg(null), 2000);
  };

  const signOf = (lon: number) => SIGN_SYMBOLS[Math.floor(((lon % 360) + 360) % 360 / 30)];
  const degInSign = (lon: number) => ((lon % 360) + 360) % 360 % 30;
  const pData = chart?.planets;
  const hData = chart?.houses;
  const aData = chart?.aspects;
  const asc = chart?.ascendant || 0;
  const mc = chart?.midheaven || 0;
  const dayOffset = chart?.daysSinceBirth;

  const isAlmutenResult = false; // 不再跳转到独立白底页面

  return (
    <div className={isAlmutenResult ? "min-h-screen bg-white text-[#222]" : "min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white"}>
      {/* Header */}
      {!isAlmutenResult && <div className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={18}/><span className="text-sm">{tx('back', lang)}</span>
            </Link>
            <div className="w-px h-5 bg-slate-700"/>
            <h1 className="text-lg font-bold text-white">{tx('title', lang)}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-xl bg-slate-800/60 p-1">
              {(['zh', 'en', 'id'] as const).map(l => (
                <button key={l} onClick={() => setLang(l)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${lang === l ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button onClick={() => setTab(tab === 'saved' ? 'chart' : 'saved')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 text-slate-300 hover:text-white transition-colors text-xs">
              <Star size={13}/>{tx('myCharts', lang)}({saved.length})
            </button>
          </div>
        </div>
      </div>}

      {isAlmutenResult ? (
        <AlmutenChartLayout chart={chart} form={form} chartType={chartType} cityName={cityName} saveMsg={saveMsg} onBack={() => { setChart(null); setTab('chart'); }} onSave={handleSave} />
      ) : (
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Panel: Form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Saved Charts Drawer */}
          {tab === 'saved' && (
            <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-5">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">{tx('savedCharts', lang)}</h3>
              {saved.length === 0 ? (
                <p className="text-slate-500 text-xs">{tx('noSaved', lang)}</p>
              ) : (
                <div className="space-y-2">
                  {saved.map(c => (
                    <div key={c.ts} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/60 transition-colors">
                      <button onClick={() => handleLoad(c)} className="text-left flex-1">
                        <div className="text-sm text-white font-medium">{c.name}</div>
                        <div className="text-xs text-slate-400">{new Date(c.ts).toLocaleDateString()}</div>
                      </button>
                      <button onClick={() => handleDelete(c.ts)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-900/20 transition-colors ml-2">
                        <X size={13}/>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Chart Type */}
          {tab !== 'saved' && (
            <>
              <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-5">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'natal', icon: Star, label: 'natal' },
                    { id: 'transit', icon: TrendingUp, label: 'transit' },
                    { id: 'solar', icon: Sun, label: 'solar' },
                    { id: 'lunar', icon: Moon, label: 'lunar' },
                    { id: 'progression', icon: Calendar, label: 'progression' },
                    { id: 'composite', icon: Heart, label: 'composite' },
                  ].map(({ id, icon: Icon, label }) => (
                    <button key={id} onClick={() => setChartType(id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${chartType === id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                      <Icon size={13}/>{tx(label, lang)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Birth Info Form */}
              <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-5">
                <h3 className="text-sm font-semibold text-slate-300 mb-4">{tx('birthInfo', lang)}</h3>
                <div className="space-y-3">
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder={tx('chartName', lang)} className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"/>

                  {/* City Search */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">{tx('city', lang)}</label>
                    <div className="flex gap-2">
                      <input id="cityInput" type="text" placeholder={lang === 'zh' ? '输入城市名称搜索...' : lang === 'id' ? 'Ketik nama kota...' : 'Enter city name...'}
                        className="flex-1 p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"/>
                      <button onClick={() => {
                          const input = document.getElementById('cityInput') as HTMLInputElement;
                          if (input) geocodeAddress(input.value);
                        }}
                        disabled={geoLoading}
                        className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap">
                        {geoLoading ? <><Loader2 size={14} className="animate-spin"/>...</> : (lang === 'zh' ? '搜索' : 'Cari')}
                      </button>
                    </div>
                    {geoError && <p className="text-xs text-red-400">{geoError}</p>}
                    {geoLoadingTz && !geoError && (
                      <p className="text-xs text-indigo-400 flex items-center gap-1">
                        <Loader2 size={11} className="animate-spin"/>{lang === 'zh' ? '正在根据经纬度查询时区...' : 'Getting timezone from coordinates...'}
                      </p>
                    )}
                    {form.lat !== 0 && form.lng !== 0 && (
                      <p className="text-xs text-green-400">
                        ✓ {lang === 'zh' ? '位置已设定' : 'Location set'}: {form.lat.toFixed(4)}, {form.lng.toFixed(4)} | TZ: UTC{form.tz >= 0 ? '+' : ''}{form.tz}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">{tx('year', lang)}</label>
                      <input type="number" value={form.year} min={1900} max={2100} onChange={e => setForm(f => ({ ...f, year: parseInt(e.target.value) || 1990 }))}
                        className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"/>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">{tx('month', lang)}</label>
                      <input type="number" value={form.month} min={1} max={12} onChange={e => setForm(f => ({ ...f, month: parseInt(e.target.value) || 1 }))}
                        className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"/>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">{tx('day', lang)}</label>
                      <input type="number" value={form.day} min={1} max={31} onChange={e => setForm(f => ({ ...f, day: parseInt(e.target.value) || 1 }))}
                        className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"/>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">{tx('hour', lang)}</label>
                      <input type="number" value={form.hour} min={0} max={23} onChange={e => setForm(f => ({ ...f, hour: parseInt(e.target.value) || 0 }))}
                        className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"/>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">{tx('minute', lang)}</label>
                      <input type="number" value={form.minute} min={0} max={59} onChange={e => setForm(f => ({ ...f, minute: parseInt(e.target.value) || 0 }))}
                        className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"/>
                    </div>
                  </div>

                  {/* Coordinates + Timezone */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">LAT</label>
                      <input type="number" step="0.0001" value={form.lat || ''} onChange={e => setForm(f => ({ ...f, lat: parseFloat(e.target.value) || 0 }))}
                        placeholder="0.0000" className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"/>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">LNG</label>
                      <input type="number" step="0.0001" value={form.lng || ''} onChange={e => setForm(f => ({ ...f, lng: parseFloat(e.target.value) || 0 }))}
                        placeholder="0.0000" className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"/>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">UTC TZ</label>
                      <input type="number" step="0.5" value={form.tz} onChange={e => setForm(f => ({ ...f, tz: parseFloat(e.target.value) || 0 }))}
                        placeholder="+8" className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"/>
                    </div>
                  </div>

                  <CustomSelect
                    label={tx('houseSystem', lang)}
                    value={form.houseSystem}
                    onChange={v => setForm(f => ({ ...f, houseSystem: v }))}
                    options={HOUSE_SYSTEMS.map(h => ({ id: h.id, name: h.name[lang] || h.name.zh }))}
                  />

                  {/* Secondary form for transit/composite */}
                  {['transit', 'solar', 'lunar', 'progression', 'composite'].includes(chartType) && (
                    <div className="border-t border-slate-700/50 pt-3 space-y-3">
                      <h4 className="text-xs font-semibold text-slate-400">{chartType === 'composite' ? tx('person2', lang) : tx('transitDate', lang)}</h4>
                      {chartType === 'progression' ? (
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">{tx('targetYear', lang)}</label>
                          <input type="number" value={secForm.year} onChange={e => setSecForm(f => ({ ...f, year: parseInt(e.target.value) }))}
                            className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"/>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-xs text-slate-400 block mb-1">{tx('year', lang)}</label>
                            <input type="number" value={secForm.year} onChange={e => setSecForm(f => ({ ...f, year: parseInt(e.target.value) }))}
                              className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"/>
                          </div>
                          <div>
                            <label className="text-xs text-slate-400 block mb-1">{tx('month', lang)}</label>
                            <input type="number" value={secForm.month} min={1} max={12} onChange={e => setSecForm(f => ({ ...f, month: parseInt(e.target.value) }))}
                              className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"/>
                          </div>
                          <div>
                            <label className="text-xs text-slate-400 block mb-1">{tx('day', lang)}</label>
                            <input type="number" value={secForm.day} min={1} max={31} onChange={e => setSecForm(f => ({ ...f, day: parseInt(e.target.value) }))}
                              className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"/>
                          </div>
                        </div>
                      )}
                      {chartType === 'composite' && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-slate-400 block mb-1">{tx('hour', lang)}</label>
                            <input type="number" value={p2Form.hour} onChange={e => setP2Form(f => ({ ...f, hour: parseInt(e.target.value) }))}
                              className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"/>
                          </div>
                          <div>
                            <label className="text-xs text-slate-400 block mb-1">{tx('minute', lang)}</label>
                            <input type="number" value={p2Form.minute} onChange={e => setP2Form(f => ({ ...f, minute: parseInt(e.target.value) }))}
                              className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"/>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <button onClick={calculate} disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2">
                    {loading ? <><Loader2 size={15} className="animate-spin"/>{tx('calculating', lang)}</> : <><Sparkles size={15}/>{tx('calculate', lang)}</>}
                  </button>

                  {error && (
                    <div className="p-3 rounded-xl bg-red-900/20 border border-red-800/40 text-red-300 text-xs flex items-center gap-2">
                      <X size={13}/>{error}
                    </div>
                  )}

                  {saveMsg && (
                    <div className="p-3 rounded-xl bg-green-900/20 border border-green-800/40 text-green-300 text-xs flex items-center gap-2">
                      <Check size={13}/>{saveMsg}
                    </div>
                  )}

                  {chart && (
                    <div className="flex gap-2">
                      <button onClick={handleSave}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5">
                        <Save size={13}/>{tx('saveChart', lang)}
                      </button>
                      <button onClick={handleShare}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/50 border border-emerald-700/40 text-emerald-300 text-xs font-medium transition-colors flex items-center justify-center gap-1.5">
                        <Share2 size={13}/>{tx('shareWA', lang)}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Cards */}
              <div className="bg-slate-800/20 rounded-2xl border border-slate-700/30 p-5 space-y-3">
                <p className="text-slate-400 text-xs leading-relaxed">{tx('descP1', lang)}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{tx('descP2', lang)}</p>
                <div className="border-t border-slate-700/30 pt-3">
                  <h4 className="text-xs font-semibold text-slate-400 mb-2">{tx('faqTitle', lang)}</h4>
                  {[
                    { q: 'faq1Q', a: 'faq1A' },
                    { q: 'faq2Q', a: 'faq2A' },
                    { q: 'faq3Q', a: 'faq3A' },
                    { q: 'faq4Q', a: 'faq4A' },
                    { q: 'faq5Q', a: 'faq5A' },
                  ].map(({ q, a }, i) => (
                    <details key={i} className="mb-1.5">
                      <summary className="cursor-pointer text-xs text-slate-300 hover:text-white transition-colors">{tx(q, lang)}</summary>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed pl-2 border-l border-slate-700">{tx(a, lang)}</p>
                    </details>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Panel: Chart */}
        <div className="lg:col-span-3 space-y-5">
          {/* Tabs */}
          {chart && (
            <div className="flex gap-2">
              {[
                { id: 'chart', label: 'chart', icon: Star },
                { id: 'planets', label: 'planets', icon: Sun },
                { id: 'houses', label: 'houses', icon: Calendar },
                { id: 'aspects', label: 'aspects', icon: TrendingUp },
                { id: 'ai', label: 'ai', icon: Sparkles },
              ].map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all ${tab === id ? 'bg-indigo-600 text-white' : 'bg-slate-800/50 text-slate-400 hover:text-white'}`}>
                  <Icon size={13}/>{tx(label, lang)}
                </button>
              ))}
            </div>
          )}

          {/* Chart Tab */}
          {tab === 'chart' && (
            <div className="space-y-5">
              <div className="overflow-x-auto rounded border border-[#b8b8b8] bg-white p-4 shadow-sm">
                <ProfessionalNatalChart
                  planets={pData}
                  houses={hData || []}
                  aspects={aData || []}
                  ascendant={asc}
                  midheaven={mc}
                  size={560}
                  showDegrees={true}
                  showAspectLines={true}
                />
              </div>
            </div>
          )}

          {/* Planet Data */}
          {tab === 'planets' && (
            <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="p-5 pb-3">
                <h3 className="text-sm font-semibold text-slate-300">{tx('planetPositions', lang)}</h3>
                {dayOffset != null && (
                  <p className="text-xs text-slate-500 mt-1">{tx('dayAfterBirth', lang).replace('{0}', dayOffset.toLocaleString())}</p>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-t border-slate-700/50">
                      <th className="text-left px-5 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wider">{tx('planet', lang)}</th>
                      <th className="text-left px-3 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wider">{tx('sign', lang)}</th>
                      <th className="text-left px-3 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wider">{tx('degree', lang)}</th>
                      <th className="text-left px-3 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wider">{tx('house', lang)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PLANET_KEYS.filter(k => pData?.[k] && !pData[k].error).map(k => {
                      const p = pData[k];
                      const lon = p.longitude;
                      const signIdx = Math.floor(((lon % 360) + 360) % 360 / 30);
                      const deg = ((lon % 360) + 360) % 360 % 30;
                      return (
                        <tr key={k} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
                          <td className="px-5 py-2.5">
                            <div className="flex items-center gap-2">
                              <span className="text-base" style={{ color: PLANET_COLORS[k] }}>{PLANET_SYMBOLS[k]}</span>
                              <span className="text-slate-300 text-xs">{PLANETS_CN[k] || k}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-1.5">
                              <span style={{ color: SIGN_COLORS[signIdx] }}>{SIGN_SYMBOLS[signIdx]}</span>
                              <span className="text-slate-300 text-xs">{SIGN_CN[Object.keys(SIGN_CN)[signIdx]]}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-slate-300 text-xs">{Math.floor(deg).toString().padStart(2, '0') + "'" + Math.floor((deg % 1) * 60).toString().padStart(2, '0') + "''"}{p.retrograde ? <sup className="text-red-400 ml-0.5">R</sup> : ''}</td>
                          <td className="px-3 py-2.5 text-slate-400 text-xs">{p.house || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Houses */}
          {tab === 'houses' && (
            <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="p-5 pb-3">
                <h3 className="text-sm font-semibold text-slate-300">{tx('houseInfo', lang)}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-t border-slate-700/50">
                      <th className="text-left px-5 py-2.5 text-xs font-medium text-slate-500 uppercase">#</th>
                      <th className="text-left px-3 py-2.5 text-xs font-medium text-slate-500 uppercase">{tx('sign', lang)}</th>
                      <th className="text-left px-3 py-2.5 text-xs font-medium text-slate-500 uppercase">{tx('degree', lang)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(hData || []).map((h: any) => {
                      const lon = h.longitude;
                      const signIdx = Math.floor(((lon % 360) + 360) % 360 / 30);
                      const deg = ((lon % 360) + 360) % 360 % 30;
                      const isAngular = [1, 4, 7, 10].includes(h.house);
                      return (
                        <tr key={h.house} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
                          <td className={`px-5 py-2.5 font-medium ${isAngular ? 'text-indigo-300' : 'text-slate-300'} text-xs`}>
                            {h.house}{isAngular ? ' ⭐' : ''}
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-1.5">
                              <span style={{ color: SIGN_COLORS[signIdx] }}>{SIGN_SYMBOLS[signIdx]}</span>
                              <span className="text-slate-300 text-xs">{SIGN_CN[Object.keys(SIGN_CN)[signIdx]]}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-slate-300 text-xs">{Math.floor(deg).toString().padStart(2, '0') + "'" + Math.floor((deg % 1) * 60).toString().padStart(2, '0') + "''"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Aspects */}
          {tab === 'aspects' && (
            <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="p-5 pb-3">
                <h3 className="text-sm font-semibold text-slate-300">{tx('majorAspects', lang)}</h3>
                <div className="flex gap-3 mt-2 flex-wrap">
                  {Object.entries(ASPECT_NAMES).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-1 text-xs text-slate-400">
                      <span style={{ color: ASPECT_STYLES[k]?.color }}>{ASPECT_STYLES[k]?.label}</span>
                      <span>{v[lang] || v.zh}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-t border-slate-700/50">
                      <th className="text-left px-5 py-2.5 text-xs font-medium text-slate-500 uppercase">Planet 1</th>
                      <th className="text-left px-3 py-2.5 text-xs font-medium text-slate-500 uppercase">Aspect</th>
                      <th className="text-left px-3 py-2.5 text-xs font-medium text-slate-500 uppercase">Planet 2</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(aData || []).slice(0, 30).map((a: any, i: number) => {
                      const aspType = a.aspect || a.type;
                      return (
                        <tr key={i} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
                          <td className="px-5 py-2.5">
                            <div className="flex items-center gap-1.5">
                              <span style={{ color: PLANET_COLORS[a.planet1] }}>{PLANET_SYMBOLS[a.planet1]}</span>
                              <span className="text-slate-300 text-xs">{PLANETS_CN[a.planet1] || a.planet1}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="text-xs font-medium" style={{ color: ASPECT_STYLES[aspType]?.color }}>
                              {ASPECT_NAMES[aspType]?.[lang] || ASPECT_NAMES[aspType]?.zh || aspType}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-1.5">
                              <span style={{ color: PLANET_COLORS[a.planet2] }}>{PLANET_SYMBOLS[a.planet2]}</span>
                              <span className="text-slate-300 text-xs">{PLANETS_CN[a.planet2] || a.planet2}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AI Reading */}
          {tab === 'ai' && chart && (
            <div className="space-y-4">
              {PLANET_KEYS.filter(k => pData?.[k] && AI_READINGS[k]?.[lang]).slice(0, 4).map(k => {
                const p = pData[k];
                const lon = p.longitude;
                const signIdx = Math.floor(((lon % 360) + 360) % 360 / 30);
                const signKey = Object.keys(SIGN_CN)[signIdx];
                const reading = AI_READINGS[k]?.[lang]?.[signKey];
                if (!reading) return null;
                return (
                  <div key={k} className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl" style={{ color: PLANET_COLORS[k] }}>{PLANET_SYMBOLS[k]}</span>
                      <div>
                        <div className="text-sm font-semibold text-white">{PLANETS_CN[k] || k}</div>
                        <div className="text-xs" style={{ color: SIGN_COLORS[signIdx] }}>{SIGN_SYMBOLS[signIdx]} {SIGN_CN[signKey]}</div>
                      </div>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed mb-3">{reading.summary}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {reading.traits.map((t: string, i: number) => (
                        <span key={i} className="px-2 py-1 rounded-full bg-indigo-900/30 text-indigo-300 text-xs border border-indigo-800/40">{t}</span>
                      ))}
                    </div>
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-900/10 border border-amber-800/20">
                      <span className="text-amber-400 mt-0.5">💡</span>
                      <p className="text-amber-200/80 text-xs leading-relaxed">{reading.advice}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
