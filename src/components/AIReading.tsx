"use client";

import { useState, useCallback, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, Lock, Share2, CheckCircle, User, X, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";

// ─── 三语言标签 ───────────────────────────────────────────────
const LABELS: Record<string, Record<string, string>> = {
  zh: {
    title: "AI 星盘解读",
    subtitle: "基于行星位置的个性化分析",
    birthDate: "出生日期", birthTime: "出生时间", birthPlace: "出生地点",
    year: "年", month: "月", day: "日", hour: "时", minute: "分",
    generate: "生成 AI 解读 ✨", generating: "AI 解读中...",
    freeTitle: "✨ 免费简要解读",
    deepTitle: "🔮 深度解读（完整版）",
    loginRequired: "深度解读需要登录",
    loginBtn: "登录 / 注册",
    shareUnlock: "或分享给 3 位好友解锁",
    shareDesc: "将解读分享给 3 位 WhatsApp 好友，即可免费解锁完整深度解读",
    shareBtn: "分享给好友",
    shareProgress: "已分享",
    shareComplete: "分享完成！正在解锁...",
    unlocked: "✅ 深度解读已解锁",
    loginTitle: "登录星缘",
    loginSubtitle: "登录后可查看完整深度解读",
    phone: "手机号 / 邮箱",
    password: "密码",
    loginSubmit: "登录",
    register: "还没有账号？注册",
    loginClose: "关闭",
    corePersonality: "核心性格",
    emotionalWorld: "情感世界",
    loveDestiny: "爱情缘分",
    actionEnergy: "行动能量",
    ascendant: "上升星座",
    planetPositions: "行星位置",
    lifeAdvice: "人生建议",
    shareWA: "分享到 WhatsApp",
    friend: "好友",
    shareText: "我刚刚用星缘生成了我的AI星盘解读，快来试试！",
    shareLink: "https://lunaxstar.com/ai-reading",
  },
  en: {
    title: "AI Chart Reading",
    subtitle: "Personalized analysis based on planetary positions",
    birthDate: "Birth Date", birthTime: "Birth Time", birthPlace: "Birth Place",
    year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Min",
    generate: "Generate AI Reading ✨", generating: "AI Reading...",
    freeTitle: "✨ Free Summary Reading",
    deepTitle: "🔮 Deep Reading (Full Version)",
    loginRequired: "Deep reading requires login",
    loginBtn: "Login / Register",
    shareUnlock: "Or share with 3 WhatsApp friends to unlock",
    shareDesc: "Share your reading with 3 WhatsApp friends to unlock the full deep reading for free",
    shareBtn: "Share with Friends",
    shareProgress: "Shared",
    shareComplete: "Sharing complete! Unlocking...",
    unlocked: "✅ Deep Reading Unlocked",
    loginTitle: "Login to Starry Fate",
    loginSubtitle: "Login to view full deep reading",
    phone: "Phone / Email",
    password: "Password",
    loginSubmit: "Login",
    register: "No account? Register",
    loginClose: "Close",
    corePersonality: "Core Personality",
    emotionalWorld: "Emotional World",
    loveDestiny: "Love Destiny",
    actionEnergy: "Action Energy",
    ascendant: "Ascendant",
    planetPositions: "Planet Positions",
    lifeAdvice: "Life Advice",
    shareWA: "Share to WhatsApp",
    friend: "Friend",
    shareText: "I just generated my AI birth chart reading on Starry Fate, come try it!",
    shareLink: "https://lunaxstar.com/ai-reading",
  },
  id: {
    title: "Pembacaan Bagan AI",
    subtitle: "Analisis personal berdasarkan posisi planet",
    birthDate: "Tanggal Lahir", birthTime: "Waktu Lahir", birthPlace: "Tempat Lahir",
    year: "Tahun", month: "Bulan", day: "Hari", hour: "Jam", minute: "Menit",
    generate: "Buat Pembacaan AI ✨", generating: "Membaca AI...",
    freeTitle: "✨ Pembacaan Ringkas Gratis",
    deepTitle: "🔮 Pembacaan Mendalam (Versi Lengkap)",
    loginRequired: "Pembacaan mendalam memerlukan login",
    loginBtn: "Masuk / Daftar",
    shareUnlock: "Atau bagikan ke 3 teman WhatsApp untuk membuka",
    shareDesc: "Bagikan pembacaan Anda ke 3 teman WhatsApp untuk membuka pembacaan mendalam lengkap secara gratis",
    shareBtn: "Bagikan ke Teman",
    shareProgress: "Dibagikan",
    shareComplete: "Berbagi selesai! Membuka...",
    unlocked: "✅ Pembacaan Mendalam Terbuka",
    loginTitle: "Masuk ke Xingyuan",
    loginSubtitle: "Masuk untuk melihat pembacaan mendalam lengkap",
    phone: "Telepon / Email",
    password: "Kata Sandi",
    loginSubmit: "Masuk",
    register: "Belum punya akun? Daftar",
    loginClose: "Tutup",
    corePersonality: "Kepribadian Inti",
    emotionalWorld: "Dunia Emosi",
    loveDestiny: "Takdir Cinta",
    actionEnergy: "Energi Aksi",
    ascendant: "Ascenden",
    planetPositions: "Posisi Planet",
    lifeAdvice: "Saran Hidup",
    shareWA: "Bagikan ke WhatsApp",
    friend: "Teman",
    shareText: "Saya baru saja membuat pembacaan bagan AI saya di Xingyuan, coba juga!",
    shareLink: "https://lunaxstar.com/ai-reading",
  },
};

// ─── 行星解读数据（三语言）────────────────────────────────────
const READINGS: Record<string, Record<string, Record<string, { summary: string; traits: string[]; advice: string }>>> = {
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
      Aries: { summary: "情感表达直接热烈，需要独立空间。", traits: ["情感直接", "独立性强", "情绪波动快"], advice: "学会情感耐心，不要急于反应。" },
      Taurus: { summary: "需要安全和稳定来感到满足。", traits: ["需要安全", "感官敏锐", "情感稳定"], advice: "不要过度依赖物质安全感。" },
      Gemini: { summary: "情绪与思维紧密相连，需要精神刺激。", traits: ["情感多变", "善于表达", "好奇心强"], advice: "深入探索情感，不要只是分析。" },
      Cancer: { summary: "极其重视家庭和情感，直觉力强。", traits: ["情感深刻", "直觉力强", "保护欲强"], advice: "学会放下过去，建立边界。" },
      Leo: { summary: "需要被欣赏和关注来感到满足。", traits: ["需要关注", "情感慷慨", "创造力强"], advice: "学会自我认可，不完全依赖外界。" },
      Virgo: { summary: "需要感到有用和有秩序。", traits: ["情感内敛", "关怀体贴", "注重细节"], advice: "对自己温柔，学会自我接纳。" },
      Libra: { summary: "需要和谐的关系和美好的环境。", traits: ["追求和谐", "需要伴侣", "审美敏感"], advice: "学会面对冲突，不要过度妥协。" },
      Scorpio: { summary: "有深刻的情感需求，情感强烈。", traits: ["情感深刻", "直觉敏锐", "忠诚专一"], advice: "学会信任和放手。" },
      Sagittarius: { summary: "需要自由和冒险，情感乐观。", traits: ["情感乐观", "热爱自由", "哲学倾向"], advice: "培养情感深度，面对真实情感。" },
      Capricorn: { summary: "需要成就来感到安全，情感内敛。", traits: ["情感内敛", "责任感强", "情感稳定"], advice: "允许自己脆弱，情感是力量。" },
      Aquarius: { summary: "需要个人空间和智力交流。", traits: ["情感独立", "理性处理", "需要空间"], advice: "不要过度理性化情感。" },
      Pisces: { summary: "极度敏感，容易吸收他人情绪。", traits: ["极度敏感", "同理心强", "艺术天赋"], advice: "建立情感边界，保护自己。" },
    },
    en: {
      Aries: { summary: "Direct and passionate emotional expression, needs independence.", traits: ["Direct emotions", "Strong independence", "Quick mood changes"], advice: "Learn emotional patience, don't react hastily." },
      Taurus: { summary: "Needs security and stability to feel satisfied.", traits: ["Needs security", "Sensory awareness", "Emotionally stable"], advice: "Don't over-rely on material security." },
      Gemini: { summary: "Emotions closely tied to thinking, needs mental stimulation.", traits: ["Variable emotions", "Expressive", "Curious"], advice: "Explore emotions deeply, don't just analyze." },
      Cancer: { summary: "Highly values family and emotions, strong intuition.", traits: ["Deep emotions", "Strong intuition", "Protective"], advice: "Learn to let go of the past, set boundaries." },
      Leo: { summary: "Needs appreciation and attention to feel satisfied.", traits: ["Needs attention", "Emotionally generous", "Creative"], advice: "Learn self-validation, don't rely entirely on others." },
      Virgo: { summary: "Needs to feel useful and orderly.", traits: ["Reserved emotions", "Caring", "Detail-oriented"], advice: "Be gentle with yourself, practice self-acceptance." },
      Libra: { summary: "Needs harmonious relationships and beautiful environments.", traits: ["Seeks harmony", "Needs partnership", "Aesthetically sensitive"], advice: "Learn to face conflict, don't over-compromise." },
      Scorpio: { summary: "Has deep emotional needs, intense feelings.", traits: ["Deep emotions", "Sharp intuition", "Loyal"], advice: "Learn to trust and let go." },
      Sagittarius: { summary: "Needs freedom and adventure, emotionally optimistic.", traits: ["Emotionally optimistic", "Loves freedom", "Philosophical"], advice: "Develop emotional depth, face real feelings." },
      Capricorn: { summary: "Needs achievement to feel secure, emotionally reserved.", traits: ["Reserved emotions", "Responsible", "Emotionally stable"], advice: "Allow yourself to be vulnerable, emotions are strength." },
      Aquarius: { summary: "Needs personal space and intellectual exchange.", traits: ["Emotionally independent", "Rational", "Needs space"], advice: "Don't over-rationalize emotions." },
      Pisces: { summary: "Extremely sensitive, easily absorbs others' emotions.", traits: ["Extremely sensitive", "Empathetic", "Artistic"], advice: "Set emotional boundaries, protect yourself." },
    },
    id: {
      Aries: { summary: "Ekspresi emosi langsung dan penuh semangat, butuh kemandirian.", traits: ["Emosi langsung", "Kemandirian kuat", "Perubahan suasana hati cepat"], advice: "Belajar kesabaran emosional, jangan bereaksi terburu-buru." },
      Taurus: { summary: "Butuh keamanan dan stabilitas untuk merasa puas.", traits: ["Butuh keamanan", "Kesadaran sensorik", "Stabil secara emosional"], advice: "Jangan terlalu bergantung pada keamanan materi." },
      Gemini: { summary: "Emosi terkait erat dengan pemikiran, butuh stimulasi mental.", traits: ["Emosi bervariasi", "Ekspresif", "Penasaran"], advice: "Jelajahi emosi secara mendalam, jangan hanya menganalisis." },
      Cancer: { summary: "Sangat menghargai keluarga dan emosi, intuisi kuat.", traits: ["Emosi mendalam", "Intuisi kuat", "Protektif"], advice: "Belajar melepaskan masa lalu, tetapkan batasan." },
      Leo: { summary: "Butuh apresiasi dan perhatian untuk merasa puas.", traits: ["Butuh perhatian", "Murah hati secara emosional", "Kreatif"], advice: "Belajar validasi diri, jangan sepenuhnya bergantung pada orang lain." },
      Virgo: { summary: "Butuh merasa berguna dan teratur.", traits: ["Emosi tertahan", "Peduli", "Berorientasi detail"], advice: "Bersikap lembut pada diri sendiri, praktikkan penerimaan diri." },
      Libra: { summary: "Butuh hubungan harmonis dan lingkungan yang indah.", traits: ["Mencari harmoni", "Butuh kemitraan", "Sensitif estetika"], advice: "Belajar menghadapi konflik, jangan terlalu berkompromi." },
      Scorpio: { summary: "Memiliki kebutuhan emosional yang mendalam, perasaan intens.", traits: ["Emosi mendalam", "Intuisi tajam", "Setia"], advice: "Belajar percaya dan melepaskan." },
      Sagittarius: { summary: "Butuh kebebasan dan petualangan, optimis secara emosional.", traits: ["Optimis secara emosional", "Mencintai kebebasan", "Filosofis"], advice: "Kembangkan kedalaman emosional, hadapi perasaan nyata." },
      Capricorn: { summary: "Butuh pencapaian untuk merasa aman, emosi tertahan.", traits: ["Emosi tertahan", "Bertanggung jawab", "Stabil secara emosional"], advice: "Izinkan diri Anda rentan, emosi adalah kekuatan." },
      Aquarius: { summary: "Butuh ruang pribadi dan pertukaran intelektual.", traits: ["Mandiri secara emosional", "Rasional", "Butuh ruang"], advice: "Jangan terlalu merasionalisasi emosi." },
      Pisces: { summary: "Sangat sensitif, mudah menyerap emosi orang lain.", traits: ["Sangat sensitif", "Empatik", "Artistik"], advice: "Tetapkan batasan emosional, lindungi diri Anda." },
    },
  },
};

const CITIES = [
  { id: "jakarta", name: { id: "Jakarta", zh: "雅加达", en: "Jakarta" }, lat: -6.2088, lng: 106.8456, tz: 7 },
  { id: "surabaya", name: { id: "Surabaya", zh: "泗水", en: "Surabaya" }, lat: -7.2575, lng: 112.7521, tz: 7 },
  { id: "bandung", name: { id: "Bandung", zh: "万隆", en: "Bandung" }, lat: -6.9175, lng: 107.6191, tz: 7 },
  { id: "beijing", name: { id: "Beijing", zh: "北京", en: "Beijing" }, lat: 39.9042, lng: 116.4074, tz: 8 },
  { id: "shanghai", name: { id: "Shanghai", zh: "上海", en: "Shanghai" }, lat: 31.2304, lng: 121.4737, tz: 8 },
  { id: "singapore", name: { id: "Singapore", zh: "新加坡", en: "Singapore" }, lat: 1.3521, lng: 103.8198, tz: 8 },
  { id: "tokyo", name: { id: "Tokyo", zh: "东京", en: "Tokyo" }, lat: 35.6762, lng: 139.6503, tz: 9 },
  { id: "london", name: { id: "London", zh: "伦敦", en: "London" }, lat: 51.5074, lng: -0.1278, tz: 0 },
];

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: "☉", Moon: "☽", Mercury: "☿", Venus: "♀", Mars: "♂",
  Jupiter: "♃", Saturn: "♄", Uranus: "♅", Neptune: "♆", Pluto: "♇",
};

const SIGN_SYMBOLS: Record<string, string> = {
  Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋", Leo: "♌", Virgo: "♍",
  Libra: "♎", Scorpio: "♏", Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
};

// ─── 主组件 ───────────────────────────────────────────────────
export default function AIReading({ preloadedChart }: { preloadedChart?: any }) {
  const { language } = useLanguage();
  const lang = language || "zh";
  const L = LABELS[lang] || LABELS.en;

  const [form, setForm] = useState({ year: 1990, month: 6, day: 15, hour: 12, minute: 0, cityId: "jakarta" });
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any>(preloadedChart || null);
  const [sections, setSections] = useState<any[]>([]);
  const [deepSections, setDeepSections] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 登录/解锁状态
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [shareCount, setShareCount] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ phone: "", password: "" });
  const [loginLoading, setLoginLoading] = useState(false);

  const city = CITIES.find(c => c.id === form.cityId) || CITIES[0];

  // 从 localStorage 恢复状态
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ai_reading_state");
      if (saved) {
        const s = JSON.parse(saved);
        if (s.isLoggedIn) setIsLoggedIn(true);
        if (s.shareCount) setShareCount(s.shareCount);
        if (s.isUnlocked) setIsUnlocked(true);
      }
    } catch {}
  }, []);

  const saveState = (updates: any) => {
    try {
      const current = JSON.parse(localStorage.getItem("ai_reading_state") || "{}");
      localStorage.setItem("ai_reading_state", JSON.stringify({ ...current, ...updates }));
    } catch {}
  };

  // 生成解读
  const generateSections = useCallback((data: any) => {
    const planets = data.planets || {};
    const newSections: any[] = [];
    const newDeep: any[] = [];

    // 免费部分：太阳 + 月亮
    const sunSign = planets.Sun?.sign;
    const moonSign = planets.Moon?.sign;

    if (sunSign && READINGS.Sun?.[lang]?.[sunSign]) {
      const r = READINGS.Sun[lang][sunSign];
      newSections.push({
        id: "sun", icon: "☉", color: "#f59e0b",
        title: `${L.corePersonality} — ☉ ${planets.Sun?.sign_cn || sunSign}`,
        summary: r.summary,
        traits: r.traits,
        advice: r.advice,
      });
    }

    if (moonSign && READINGS.Moon?.[lang]?.[moonSign]) {
      const r = READINGS.Moon[lang][moonSign];
      newSections.push({
        id: "moon", icon: "☽", color: "#94a3b8",
        title: `${L.emotionalWorld} — ☽ ${planets.Moon?.sign_cn || moonSign}`,
        summary: r.summary,
        traits: r.traits,
        advice: r.advice,
      });
    }

    // 深度部分：金星、火星、上升、行星列表、人生建议
    const venusSign = planets.Venus?.sign;
    if (venusSign) {
      const r = READINGS.Sun?.[lang]?.[venusSign]; // 用Sun数据作为示例
      newDeep.push({
        id: "venus", icon: "♀", color: "#ec4899",
        title: `${L.loveDestiny} — ♀ ${planets.Venus?.sign_cn || venusSign}`,
        summary: lang === "zh" ? `金星在${planets.Venus?.sign_cn}，你的爱情风格独特而迷人。` : lang === "id" ? `Venus di ${venusSign}, gaya cinta Anda unik dan memikat.` : `Venus in ${venusSign}, your love style is unique and captivating.`,
        traits: r?.traits || [],
        advice: r?.advice || "",
      });
    }

    const marsSign = planets.Mars?.sign;
    if (marsSign) {
      newDeep.push({
        id: "mars", icon: "♂", color: "#ef4444",
        title: `${L.actionEnergy} — ♂ ${planets.Mars?.sign_cn || marsSign}`,
        summary: lang === "zh" ? `火星在${planets.Mars?.sign_cn}，你的行动力和驱动力特征鲜明。` : lang === "id" ? `Mars di ${marsSign}, energi aksi dan dorongan Anda sangat khas.` : `Mars in ${marsSign}, your action energy and drive are distinctive.`,
        traits: [],
        advice: "",
      });
    }

    if (data.ascendant?.sign) {
      const asc = data.ascendant;
      newDeep.push({
        id: "asc", icon: "↑", color: "#8b5cf6",
        title: `${L.ascendant} — ${asc.sign_cn || asc.sign} ${Math.floor(asc.degree)}°`,
        summary: lang === "zh" ? `上升${asc.sign_cn}是你给人的第一印象，展示你的外在表现方式。` : lang === "id" ? `Ascenden ${asc.sign} adalah kesan pertama Anda, menunjukkan cara ekspresi luar Anda.` : `Ascendant ${asc.sign} is your first impression, showing your outward expression.`,
        traits: [],
        advice: "",
      });
    }

    // 完整行星列表
    const planetList = Object.entries(planets)
      .filter(([_, p]: [string, any]) => !p?.error && p?.sign)
      .map(([id, p]: [string, any]) => `${PLANET_SYMBOLS[id] || "☆"} ${p.sign_cn || p.sign} ${Math.floor(p.degree)}°`);

    newDeep.push({
      id: "positions", icon: "✧", color: "#06b6d4",
      title: L.planetPositions,
      summary: "",
      traits: planetList,
      advice: "",
    });

    // 人生建议
    newDeep.push({
      id: "advice", icon: "🌟", color: "#10b981",
      title: L.lifeAdvice,
      summary: lang === "zh" ? "你是一个独特而完整的个体，星盘揭示的是潜能而非宿命。" : lang === "id" ? "Anda adalah individu yang unik dan lengkap. Bagan mengungkapkan potensi, bukan takdir." : "You are a unique and complete individual. The chart reveals potential, not destiny.",
      traits: lang === "zh" ? ["发挥优势，转化挑战", "保持开放心态，拥抱成长", "相信你的直觉，它来自宇宙的智慧"] : lang === "id" ? ["Manfaatkan kelebihan, transformasi tantangan", "Tetap berpikiran terbuka, terima pertumbuhan", "Percaya intuisi Anda, itu dari kebijaksanaan kosmik"] : ["Leverage strengths, transform challenges", "Stay open-minded, embrace growth", "Trust your intuition, it comes from cosmic wisdom"],
      advice: "",
    });

    setSections(newSections);
    setDeepSections(newDeep);
  }, [lang, L]);

  const handleCalculate = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSections([]);
    setDeepSections([]);

    try {
      const res = await fetch("/api/chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: form.year, month: form.month, day: form.day,
          hour: form.hour, minute: form.minute,
          latitude: city.lat, longitude: city.lng, timezone: city.tz,
        }),
      });

      const data = await res.json();
      if (!data.success && !data.planets) throw new Error(data.error || "Calculation failed");

      const chart = data.data || data;
      setChartData(chart);
      generateSections(chart);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [form, city, generateSections]);

  // 当语言变化时重新生成解读
  useEffect(() => {
    if (chartData) generateSections(chartData);
  }, [lang, chartData, generateSections]);

  // 模拟登录
  const handleLogin = async () => {
    setLoginLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsLoggedIn(true);
    setIsUnlocked(true);
    setShowLoginModal(false);
    setLoginLoading(false);
    saveState({ isLoggedIn: true, isUnlocked: true });
  };

  // WhatsApp 分享
  const handleShare = (friendNum: number) => {
    const text = encodeURIComponent(`${L.shareText}\n${L.shareLink}`);
    const waUrl = `https://wa.me/?text=${text}`;
    window.open(waUrl, "_blank");

    const newCount = Math.min(shareCount + 1, 3);
    setShareCount(newCount);
    saveState({ shareCount: newCount });

    if (newCount >= 3) {
      setTimeout(() => {
        setIsUnlocked(true);
        saveState({ isUnlocked: true });
      }, 1500);
    }
  };

  const canViewDeep = isLoggedIn || isUnlocked;

  return (
    <div className="space-y-6">
      {/* 输入表单 */}
      {!preloadedChart && (
        <div className="p-6 rounded-2xl bg-gray-50 border border-white/10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-gray-400" />
            {L.title}
          </h2>
          <p className="text-gray-500 text-sm mb-4">{L.subtitle}</p>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {/* 出生日期 */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">{L.birthDate}</label>
              <div className="grid grid-cols-3 gap-1">
                <select value={form.year} onChange={e => setForm({ ...form, year: +e.target.value })} className="p-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm">
                  {Array.from({ length: 80 }, (_, i) => 2010 - i).map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <select value={form.month} onChange={e => setForm({ ...form, month: +e.target.value })} className="p-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select value={form.day} onChange={e => setForm({ ...form, day: +e.target.value })} className="p-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* 出生时间 */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">{L.birthTime}</label>
              <div className="grid grid-cols-2 gap-1">
                <select value={form.hour} onChange={e => setForm({ ...form, hour: +e.target.value })} className="p-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm">
                  {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{String(i).padStart(2, "0")}</option>)}
                </select>
                <select value={form.minute} onChange={e => setForm({ ...form, minute: +e.target.value })} className="p-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm">
                  {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(m => <option key={m} value={m}>{String(m).padStart(2, "0")}</option>)}
                </select>
              </div>
            </div>

            {/* 出生地点 */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">{L.birthPlace}</label>
              <select value={form.cityId} onChange={e => setForm({ ...form, cityId: e.target.value })} className="w-full p-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm">
                {CITIES.map(c => <option key={c.id} value={c.id}>{c.name[lang as keyof typeof c.name] || c.name.en}</option>)}
              </select>
            </div>
          </div>

          {/* Email capture for lead generation */}
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-1">
              {lang === 'zh' ? '邮箱（接收解读结果）' : lang === 'id' ? 'Email (menerima hasil)' : 'Email (receive results)'}
            </label>
            <input
              type="email"
              placeholder={lang === 'zh' ? 'your@email.com' : 'your@email.com'}
              onChange={(e) => {
                const email = e.target.value;
                if (email) localStorage.setItem('lunaxstar_email', email);
              }}
              defaultValue={typeof window !== 'undefined' ? localStorage.getItem('lunaxstar_email') || '' : ''}
              className="w-full p-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm"
            />
          </div>

          <button onClick={handleCalculate} disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-500 hover:to-gray-500 disabled:opacity-50 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin">✨</span>{L.generating}</> : L.generate}
          </button>

          {error && <div className="mt-3 p-3 rounded-xl bg-gray-500/10 border border-gray-500/20 text-gray-400 text-sm">{error}</div>}
        </div>
      )}

      {/* 免费解读 */}
      {sections.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Sparkles size={18} className="text-gray-600" />
            {L.freeTitle}
          </h3>

          {sections.map(s => (
            <div key={s.id} className="p-5 rounded-2xl bg-gray-50 border border-white/10">
              <h4 className="font-bold mb-2 flex items-center gap-2" style={{ color: s.color }}>
                <span className="text-xl">{s.icon}</span>{s.title}
              </h4>
              <p className="text-gray-600 text-sm mb-3">{s.summary}</p>
              {s.traits.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {s.traits.map((t: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs border" style={{ borderColor: s.color + "40", color: s.color, backgroundColor: s.color + "15" }}>{t}</span>
                  ))}
                </div>
              )}
              {s.advice && <p className="text-xs text-gray-500 italic">💡 {s.advice}</p>}
            </div>
          ))}
        </div>
      )}

      {/* 深度解读区域 */}
      {sections.length > 0 && (
        <div className="rounded-2xl overflow-hidden border border-white/10">
          {/* 标题 */}
          <div className="p-5 bg-gradient-to-r from-gray-50/40 to-gray-50/40 flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2">
              {canViewDeep ? <Sparkles size={18} className="text-gray-400" /> : <Lock size={18} className="text-gray-500" />}
              {L.deepTitle}
            </h3>
            {canViewDeep && <span className="text-xs text-gray-400 flex items-center gap-1"><CheckCircle size={14} />{L.unlocked}</span>}
          </div>

          {/* 已解锁：显示深度内容 */}
          {canViewDeep && deepSections.length > 0 && (
            <div className="p-5 space-y-4">
              {deepSections.map(s => (
                <div key={s.id} className="p-4 rounded-xl bg-gray-50">
                  <h4 className="font-bold mb-2 flex items-center gap-2 text-sm" style={{ color: s.color }}>
                    <span>{s.icon}</span>{s.title}
                  </h4>
                  {s.summary && <p className="text-gray-600 text-sm mb-2">{s.summary}</p>}
                  {s.traits.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {s.traits.map((t: string, i: number) => (
                        <span key={i} className="px-2 py-1 rounded-lg text-xs bg-gray-50 text-gray-500">{t}</span>
                      ))}
                    </div>
                  )}
                  {s.advice && <p className="text-xs text-gray-400 italic mt-2">💡 {s.advice}</p>}
                </div>
              ))}
            </div>
          )}

          {/* 未解锁：显示解锁选项 */}
          {!canViewDeep && (
            <div className="p-6 space-y-5">
              {/* 模糊预览 */}
              <div className="relative">
                <div className="space-y-3 blur-sm pointer-events-none select-none opacity-60">
                  {deepSections.slice(0, 2).map(s => (
                    <div key={s.id} className="p-4 rounded-xl bg-gray-50">
                      <div className="h-4 bg-gray-100 rounded mb-2 w-3/4" />
                      <div className="h-3 bg-gray-50 rounded mb-1 w-full" />
                      <div className="h-3 bg-gray-50 rounded w-2/3" />
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Lock size={32} className="text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">{L.loginRequired}</p>
                  </div>
                </div>
              </div>

              {/* 解锁方式1：登录 */}
              <div className="p-4 rounded-xl bg-gray-500/10 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User size={20} className="text-gray-400" />
                    <div>
                      <div className="font-medium text-white text-sm">{L.loginRequired}</div>
                      <div className="text-xs text-gray-500">{L.loginBtn}</div>
                    </div>
                  </div>
                  <button onClick={() => setShowLoginModal(true)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm font-medium text-white transition-colors">
                    {L.loginBtn}
                  </button>
                </div>
              </div>

              {/* 分隔线 */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* 解锁方式2：WhatsApp 分享 */}
              <div className="p-4 rounded-xl bg-gray-500/10 border border-gray-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle size={20} className="text-gray-400" />
                  <div>
                    <div className="font-medium text-white text-sm">{L.shareUnlock}</div>
                    <div className="text-xs text-gray-500">{L.shareDesc}</div>
                  </div>
                </div>

                {/* 进度条 */}
                <div className="flex gap-2 mb-3">
                  {[1, 2, 3].map(n => (
                    <div key={n} className={`flex-1 h-2 rounded-full transition-all ${shareCount >= n ? "bg-gray-500" : "bg-gray-100"}`} />
                  ))}
                </div>
                <div className="text-xs text-gray-500 mb-3">{L.shareProgress}: {shareCount}/3</div>

                {shareCount < 3 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map(n => (
                      <button key={n} onClick={() => handleShare(n)} disabled={shareCount >= n}
                        className={`py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${shareCount >= n ? "bg-gray-500/20 text-gray-400 border border-gray-500/30" : "bg-gray-50 hover:bg-gray-500/20 text-gray-600 hover:text-gray-300 border border-white/10"}`}>
                        {shareCount >= n ? <CheckCircle size={12} /> : <Share2 size={12} />}
                        {L.friend} {n}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 font-medium text-sm flex items-center justify-center gap-2">
                    <CheckCircle size={16} />{L.shareComplete}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 登录弹窗 */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm mx-4 p-6 rounded-2xl bg-gray-50 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">{L.loginTitle}</h3>
              <button onClick={() => setShowLoginModal(false)} className="text-gray-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-500 text-sm mb-4">{L.loginSubtitle}</p>

            <div className="space-y-3 mb-4">
              <input type="text" placeholder={L.phone} value={loginForm.phone} onChange={e => setLoginForm({ ...loginForm, phone: e.target.value })}
                className="w-full p-3 rounded-xl bg-white border border-gray-300 text-white placeholder-gray-500 text-sm" />
              <input type="password" placeholder={L.password} value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full p-3 rounded-xl bg-white border border-gray-300 text-white placeholder-gray-500 text-sm" />
            </div>

            <button onClick={handleLogin} disabled={loginLoading}
              className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-500 hover:to-gray-500 disabled:opacity-50 rounded-xl font-bold text-white transition-all">
              {loginLoading ? "..." : L.loginSubmit}
            </button>

            <button className="w-full mt-2 py-2 text-sm text-gray-500 hover:text-white">{L.register}</button>
          </div>
        </div>
      )}
    </div>
  );
}
