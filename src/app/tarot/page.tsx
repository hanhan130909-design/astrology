"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ArrowLeft, Sparkles, Shuffle, RefreshCw, Lock, Share2, CheckCircle, MessageCircle } from "lucide-react";

// Tarot Card Data
const TAROT_CARDS: { id: number; name: Record<string, string>; image: string; meaning: Record<string, string> }[] = [
  { id: 0, name: { zh: "愚者", en: "The Fool", id: "The Fool" }, image: "🃏", meaning: { zh: "新的开始，冒险，纯真", en: "New beginnings, adventure, innocence", id: "Awal baru, petualangan, kepolosan" } },
  { id: 1, name: { zh: "魔术师", en: "The Magician", id: "The Magician" }, image: "🎩", meaning: { zh: "创造力，意志力，显化", en: "Creativity, willpower, manifestation", id: "Kreativitas, tekad, manifestasi" } },
  { id: 2, name: { zh: "女祭司", en: "The High Priestess", id: "The High Priestess" }, image: "🌙", meaning: { zh: "直觉，神秘，内在智慧", en: "Intuition, mystery, inner wisdom", id: "Intuisi, misteri, kebijaksanaan" } },
  { id: 3, name: { zh: "皇后", en: "The Empress", id: "The Empress" }, image: "👑", meaning: { zh: "丰饶，母性，创造力", en: "Abundance, motherhood, creativity", id: "Kelimpahan, keibuan, kreativitas" } },
  { id: 4, name: { zh: "皇帝", en: "The Emperor", id: "The Emperor" }, image: "⚔️", meaning: { zh: "权威，结构，父性", en: "Authority, structure, fatherhood", id: "Otoritas, struktur, kebapakan" } },
  { id: 5, name: { zh: "教皇", en: "The Hierophant", id: "The Hierophant" }, image: "🔔", meaning: { zh: "传统，精神指引，教育", en: "Tradition, spiritual guidance, education", id: "Tradisi, panduan spiritual, pendidikan" } },
  { id: 6, name: { zh: "恋人", en: "The Lovers", id: "The Lovers" }, image: "💕", meaning: { zh: "爱情，选择，和谐", en: "Love, choices, harmony", id: "Cinta, pilihan, harmoni" } },
  { id: 7, name: { zh: "战车", en: "The Chariot", id: "The Chariot" }, image: "🛡️", meaning: { zh: "意志力，胜利，决心", en: "Willpower, victory, determination", id: "Tekad, kemenangan, determinasi" } },
  { id: 8, name: { zh: "力量", en: "Strength", id: "Strength" }, image: "🦁", meaning: { zh: "勇气，耐心，内在力量", en: "Courage, patience, inner strength", id: "Keberanian, kesabaran, kekuatan" } },
  { id: 9, name: { zh: "隐士", en: "The Hermit", id: "The Hermit" }, image: "🕯️", meaning: { zh: "内省，独处，寻求真理", en: "Introspection, solitude, seeking truth", id: "Introspeksi, kesendirian, kebenaran" } },
  { id: 10, name: { zh: "命运之轮", en: "Wheel of Fortune", id: "Wheel of Fortune" }, image: "☸️", meaning: { zh: "变化，命运，周期", en: "Change, destiny, cycles", id: "Perubahan, takdir, siklus" } },
  { id: 11, name: { zh: "正义", en: "Justice", id: "Justice" }, image: "⚖️", meaning: { zh: "公正，平衡，因果", en: "Justice, balance, cause and effect", id: "Keadilan, keseimbangan, sebab-akibat" } },
  { id: 12, name: { zh: "倒吊人", en: "The Hanged Man", id: "The Hanged Man" }, image: "🙃", meaning: { zh: "牺牲，新视角，等待", en: "Sacrifice, new perspective, waiting", id: "Pengorbanan, perspektif baru, menunggu" } },
  { id: 13, name: { zh: "死神", en: "Death", id: "Death" }, image: "💀", meaning: { zh: "转变，结束，新生", en: "Transformation, ending, rebirth", id: "Transformasi, akhir, kelahiran" } },
  { id: 14, name: { zh: "节制", en: "Temperance", id: "Temperance" }, image: "🏺", meaning: { zh: "平衡，调和，耐心", en: "Balance, moderation, patience", id: "Keseimbangan, kesederhanaan, kesabaran" } },
  { id: 15, name: { zh: "恶魔", en: "The Devil", id: "The Devil" }, image: "😈", meaning: { zh: "束缚，欲望，物质主义", en: "Bondage, desire, materialism", id: "Belenggu, keinginan, materialisme" } },
  { id: 16, name: { zh: "塔", en: "The Tower", id: "The Tower" }, image: "🗼", meaning: { zh: "突变，觉醒，破坏", en: "Sudden change, awakening, destruction", id: "Perubahan mendadak, kebangkitan" } },
  { id: 17, name: { zh: "星星", en: "The Star", id: "The Star" }, image: "⭐", meaning: { zh: "希望，灵感，宁静", en: "Hope, inspiration, serenity", id: "Harapan, inspirasi, ketenangan" } },
  { id: 18, name: { zh: "月亮", en: "The Moon", id: "The Moon" }, image: "🌕", meaning: { zh: "幻觉，恐惧，潜意识", en: "Illusion, fear, subconscious", id: "Ilusi, ketakutan, alam bawah sadar" } },
  { id: 19, name: { zh: "太阳", en: "The Sun", id: "The Sun" }, image: "☀️", meaning: { zh: "快乐，成功，活力", en: "Joy, success, vitality", id: "Kegembiraan, sukses, vitalitas" } },
  { id: 20, name: { zh: "审判", en: "Judgement", id: "Judgement" }, image: "📯", meaning: { zh: "重生，觉醒，宽恕", en: "Rebirth, awakening, forgiveness", id: "Kelahiran baru, kebangkitan, pengampunan" } },
  { id: 21, name: { zh: "世界", en: "The World", id: "The World" }, image: "🌍", meaning: { zh: "完成，成就，圆满", en: "Completion, achievement, fulfillment", id: "Penyelesaian, pencapaian, pemenuhan" } },
];

// Tarot Spreads
const SPREADS: { id: string; name: Record<string, string>; desc: Record<string, string>; cards: number }[] = [
  { id: "single", name: { zh: "单张牌", en: "Single Card", id: "Satu Kartu", th: "ไพ่ใบเดียว", vi: "Một Lá", ms: "Satu Kad", ja: "一枚のカード", ko: "한 장의 카드" }, desc: { zh: "快速指引", en: "Quick guidance", id: "Panduan cepat", th: "คำแนะนำ速", vi: "Hướng dẫn nhanh", ms: "Panduan cepat", ja: "素早いガイダンス", ko: "빠른 안내" }, cards: 1 },
  { id: "three", name: { zh: "三张牌", en: "Three Cards", id: "Tiga Kartu", th: "สามใบ", vi: "Ba Lá", ms: "Tiga Kad", ja: "三枚のカード", ko: "세 장의 카드" }, desc: { zh: "过去-现在-未来", en: "Past-Present-Future", id: "Masa Lalu-Kini-Masa Depan", th: "อดีต-ปัจจุบัน-อนาคต", vi: "Quá khứ-Hiện tại-Tương lai", ms: "Lalu-Sekarang-Akan datang", ja: "過去-現在-未来", ko: "과거-현재-미래" }, cards: 3 },
  { id: "celtic", name: { zh: "凯尔特十字", en: "Celtic Cross", id: "Celtic Cross", th: "ครอสเซลติก", vi: "Thánh Giá Celtic", ms: "Salib Celtic", ja: "ケルト十字", ko: "켈트 십자" }, desc: { zh: "深度解读", en: "Deep reading", id: "Bacaan mendalam", th: "การอ่านเชิงลึก", vi: "Đọc sâu", ms: "Bacaan mendalam", ja: "深いリーディング", ko: "깊은 리딩" }, cards: 10 },
  { id: "horseshoe", name: { zh: "马蹄牌阵", en: "Horseshoe Spread", id: "Horseshoe Spread", th: "การ์ดเกือกม้า", vi: "Lá Bài Móng Ngựa", ms: "Spread Horseshoe", ja: "马蹄spread", ko: "발굽 스프레드" }, desc: { zh: "七张牌全面分析", en: "7 cards comprehensive", id: "7 kartu komprehensif", th: "วิเคราะห์ครบถ้วน 7 ใบ", vi: "Phân tích đầy đủ 7 lá", ms: "Analisis komprehensif 7 kad", ja: "7枚の包括的分析", ko: "7장 포괄적 분석" }, cards: 7 },
  { id: "relationship", name: { zh: "关系牌阵", en: "Relationship Spread", id: "Relationship Spread", th: "การ์ดความสัมพันธ์", vi: "Lá Bài Mối Quan Hệ", ms: "Spread Hubungan", ja: "関係spread", ko: "관계 스프레드" }, desc: { zh: "两人关系分析", en: "Two people analysis", id: "Analisis dua orang", th: "วิเคราะห์ความสัมพันธ์สองคน", vi: "Phân tích hai người", ms: "Analisis dua orang", ja: "二人の分析", ko: "두 사람 분석" }, cards: 5 },
  { id: "career", name: { zh: "事业牌阵", en: "Career Spread", id: "Career Spread", th: "การ์ดอาชีพ", vi: "Lá Bài Sự Nghiệp", ms: "Spread Kerjaya", ja: "キャリアspread", ko: "커리어 스프레드" }, desc: { zh: "职业发展指引", en: "Career guidance", id: "Panduan karier", th: "แนะนำอาชีพ", vi: "Hướng dẫn sự nghiệp", ms: "Panduan kerjaya", ja: "キャリアガイダンス", ko: "커리어 안내" }, cards: 5 },
  { id: "decision", name: { zh: "决策牌阵", en: "Decision Spread", id: "Decision Spread", th: "การ์ดตัดสินใจ", vi: "Lá Bài Quyết Định", ms: "Spread Keputusan", ja: "決定spread", ko: "결정 스프레드" }, desc: { zh: "二选一决策", en: "A or B decision", id: "Keputusan A atau B", th: "ตัดสินใจ A หรือ B", vi: "Quyết định A hoặc B", ms: "Keputusan A atau B", ja: "AまたはBの決定", ko: "A 또는 B 결정" }, cards: 6 },
  { id: "year", name: { zh: "年度运势", en: "Year Ahead", id: "Year Ahead", th: "ดวงประจำปี", vi: "Tử Vi Năm", ms: "Ramalan Tahunan", ja: "年間運勢", ko: "올해 운세" }, desc: { zh: "12个月运势", en: "12 month forecast", id: "Ramalan 12 bulan", th: "คำทำนาย 12 เดือน", vi: "Dự đoán 12 tháng", ms: "Ramalan 12 bulan", ja: "12ヶ月予報", ko: "12개월 운세" }, cards: 12 },
];

// AI Reading Data
const TAROT_READINGS: Record<string, Record<string, Record<string, string>>> = {
  zh: {
    love: { "The Lovers": "爱情运势极佳，可能遇到命中注定的人。", "The Star": "保持希望，真爱即将到来。", "Death": "旧的感情结束，新的开始。", "The Sun": "充满快乐和幸福的爱情时光。" },
    career: { "The Magician": "展现你的才能，事业将有突破。", "The Chariot": "通过决心和努力获得职业成功。", "The World": "事业目标即将达成，享受成果。", "The Tower": "职场可能有突变，保持警觉。" },
    general: { "The Fool": "勇敢迈出第一步，新的旅程等待着你。", "The High Priestess": "相信你的直觉，答案在心中。", "Justice": "公正的结果即将到来。", "Wheel of Fortune": "命运之轮转动，好运即将来临。" },
  },
  en: {
    love: { "The Lovers": "Excellent love fortune, you may meet your destined person.", "The Star": "Keep hope, true love is coming.", "Death": "Old relationship ends, new beginning.", "The Sun": "Time of joy and happiness in love." },
    career: { "The Magician": "Show your talents, breakthrough in career.", "The Chariot": "Achieve success through determination.", "The World": "Career goals within reach, enjoy the results.", "The Tower": "Workplace changes ahead, stay alert." },
    general: { "The Fool": "Take the first step bravely, new journey awaits.", "The High Priestess": "Trust your intuition, answers within.", "Justice": "Just outcome coming soon.", "Wheel of Fortune": "Wheel of fortune turns, good luck coming." },
  },
  id: {
    love: { "The Lovers": "Keberuntungan cinta sangat baik, mungkin bertemu jodoh.", "The Star": "Tetap berharap, cinta sejati akan datang.", "Death": "Hubungan lama berakhir, awal baru.", "The Sun": "Waktu kegembiraan dan kebahagiaan dalam cinta." },
    career: { "The Magician": "Tunjukkan bakat Anda, terobosan dalam karir.", "The Chariot": "Capai sukses melalui determinasi.", "The World": "Tujuan karir terjangkau, nikmati hasilnya.", "The Tower": "Perubahan di tempat kerja, tetap waspada." },
    general: { "The Fool": "Ambil langkah pertama dengan berani, perjalanan baru menanti.", "The High Priestess": "Percayai intuisi Anda, jawaban ada di dalam.", "Justice": "Hasil adil segera datang.", "Wheel of Fortune": "Roda keberuntungan berputar, hoki datang." },
  },
};

export default function TarotPage() {
  const { language } = useLanguage();
  const [selectedSpread, setSelectedSpread] = useState(SPREADS[0]);
  const [drawnCards, setDrawnCards] = useState<typeof TAROT_CARDS>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState<"general" | "love" | "career">("general");
  
  // Unlock state
  const [shareCount, setShareCount] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Spread position meanings
const SPREAD_POSITIONS: Record<string, Record<string, string[]>> = {
  zh: {
    single: ["当前指引"],
    three: ["过去影响", "当前状况", "未来趋势"],
    celtic: ["当前状况", "挑战/阻碍", "过去基础", "近期过去", "最好结果", "近期未来", "自我认知", "外部影响", "希望/恐惧", "最终结果"],
    horseshoe: ["过去", "现在", "隐藏影响", "障碍", "环境", "建议", "结果"],
    relationship: ["你的状态", "对方状态", "关系基础", "近期发展", "最终结果"],
    career: ["当前状况", "挑战", "优势", "建议", "结果"],
    decision: ["选择A现状", "选择A发展", "选择A结果", "选择B现状", "选择B发展", "选择B结果"],
    year: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  },
  en: {
    single: ["Current Guidance"],
    three: ["Past Influence", "Present Situation", "Future Trend"],
    celtic: ["Present", "Challenge", "Foundation", "Recent Past", "Best Outcome", "Near Future", "Self", "External", "Hopes/Fears", "Final Result"],
    horseshoe: ["Past", "Present", "Hidden", "Obstacles", "Environment", "Advice", "Outcome"],
    relationship: ["You", "Partner", "Foundation", "Development", "Outcome"],
    career: ["Current", "Challenges", "Strengths", "Advice", "Outcome"],
    decision: ["A Current", "A Development", "A Result", "B Current", "B Development", "B Result"],
    year: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
  id: {
    single: ["Panduan Saat Ini"],
    three: ["Pengaruh Masa Lalu", "Situasi Kini", "Tren Masa Depan"],
    celtic: ["Kini", "Tantangan", "Dasar", "Masa Lalu Dekat", "Hasil Terbaik", "Masa Depan Dekat", "Diri", "Eksternal", "Harapan/Takut", "Hasil Akhir"],
    horseshoe: ["Masa Lalu", "Kini", "Tersembunyi", "Rintangan", "Lingkungan", "Saran", "Hasil"],
    relationship: ["Anda", "Pasangan", "Dasar", "Perkembangan", "Hasil"],
    career: ["Kini", "Tantangan", "Kekuatan", "Saran", "Hasil"],
    decision: ["A Kini", "A Perkembangan", "A Hasil", "B Kini", "B Perkembangan", "B Hasil"],
    year: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
  },
};

const translations: Record<string, Record<string, string>> = {
    zh: { title: "🔮 塔罗占卜", subtitle: "探索命运的神秘指引", question: "你的问题", category: "占卜类别", general: "综合", love: "爱情", career: "事业", spread: "牌阵", shuffle: "洗牌抽牌", shuffling: "洗牌中...", reading: "解读", shareUnlock: "分享给3位好友解锁深度解读", shareProgress: "分享进度", unlocked: "已解锁", free: "免费", position: "位置" },
    en: { title: "🔮 Tarot Reading", subtitle: "Explore mystical guidance", question: "Your Question", category: "Category", general: "General", love: "Love", career: "Career", spread: "Spread", shuffle: "Shuffle & Draw", shuffling: "Shuffling...", reading: "Reading", shareUnlock: "Share with 3 friends to unlock deep reading", shareProgress: "Share Progress", unlocked: "Unlocked", free: "Free", position: "Position" },
    id: { title: "🔮 Bacaan Tarot", subtitle: "Jelajahi panduan mistis", question: "Pertanyaan Anda", category: "Kategori", general: "Umum", love: "Cinta", career: "Karir", spread: "Spread", shuffle: "Kocok & Tarik", shuffling: "Mengocok...", reading: "Bacaan", shareUnlock: "Bagikan ke 3 teman untuk membuka bacaan mendalam", shareProgress: "Progres", unlocked: "Terbuka", free: "Gratis", position: "Posisi" },
    th: { title: "🔮 ไพ่ทาโรต์", subtitle: "สำรวจคำแนะนำลึกลับ", question: "คำถามของคุณ", category: "หมวด", general: "ทั่วไป", love: "ความรัก", career: "การงาน", spread: "การ์ด", shuffle: "สับและจั่ว", shuffling: "กำลังสับ...", reading: "คำทำนาย", shareUnlock: "แชร์ให้เพื่อน 3 คนเพื่อปลดล็อกคำทำนายลึก", shareProgress: "ความคืบหน้า", unlocked: "ปลดล็อกแล้ว", free: "ฟรี", position: "ตำแหน่ง" },
    vi: { title: "🔮 Đọc Bài Tarot", subtitle: "Khám phá hướng dẫn bí ẩn", question: "Câu hỏi của bạn", category: "Danh mục", general: "Tổng quát", love: "Tình yêu", career: "Sự nghiệp", spread: "Bài", shuffle: "Xào & Rút", shuffling: "Đang xào...", reading: "Đọc bói", shareUnlock: "Chia sẻ cho 3 bạn để mở khóa đọc bói sâu", shareProgress: "Tiến độ", unlocked: "Đã mở khóa", free: "Miễn phí", position: "Vị trí" },
    ms: { title: "🔮 Bacaan Tarot", subtitle: "Terokai panduan mistik", question: "Soalan anda", category: "Kategori", general: "Umum", love: "Cinta", career: "Kerjaya", spread: "Kad", shuffle: "Kocak & Tarik", shuffling: "Mengocak...", reading: "Bacaan", shareUnlock: "Kongsi dengan 3 kawan untuk buka bacaan mendalam", shareProgress: "Kemajuan", unlocked: "Dibuka", free: "Percuma", position: "Kedudukan" },
    ja: { title: "🔮 タロットリーディング", subtitle: "神秘的なガイダンスを探索", question: "あなたの質問", category: "カテゴリー", general: "総合", love: "恋愛", career: "仕事", spread: "-spread", shuffle: "シャッフル&ドロー", shuffling: "シャッフル中...", reading: "リーディング", shareUnlock: "3人の友だちにシェアしてディープリーディングをアンロック", shareProgress: "進捗", unlocked: "アンロック済み", free: "無料", position: "位置" },
    ko: { title: "🔮 타로 리딩", subtitle: "신비로운 안내 탐구", question: "당신의 질문", category: "카테고리", general: "일반", love: "사랑", career: "커리어", spread: "스프레드", shuffle: "셔플 & 드로우", shuffling: "셔플 중...", reading: "리딩", shareUnlock: "3명의 친구에게 공유하여 딥 리딩 잠금 해제", shareProgress: "진행률", unlocked: "잠금 해제됨", free: "무료", position: "위치" },
  };
  
  const t = translations[language as keyof typeof translations] || translations.zh;

  // Load unlock state
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tarot_unlock');
      if (saved) {
        const s = JSON.parse(saved);
        if (s.shareCount) setShareCount(s.shareCount);
        if (s.isUnlocked) setIsUnlocked(true);
      }
    } catch {}
  }, []);

  const saveUnlockState = (updates: any) => {
    try {
      const current = JSON.parse(localStorage.getItem('tarot_unlock') || '{}');
      localStorage.setItem('tarot_unlock', JSON.stringify({ ...current, ...updates }));
    } catch {}
  };

  const handleShare = () => {
    const shareText = language === 'zh' 
      ? `我刚刚用星缘进行了塔罗占卜，太准了！快来试试 https://astrology-clean.vercel.app/tarot`
      : language === 'id' 
      ? `Saya baru saja melakukan bacaan tarot di Xingyuan, sangat akurat! Coba juga https://astrology-clean.vercel.app/tarot`
      : `I just did a tarot reading on Starry Fate, so accurate! Try it https://astrology-clean.vercel.app/tarot`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
    
    const newCount = Math.min(shareCount + 1, 3);
    setShareCount(newCount);
    saveUnlockState({ shareCount: newCount });
    
    if (newCount >= 3) {
      setTimeout(() => {
        setIsUnlocked(true);
        saveUnlockState({ isUnlocked: true });
      }, 1500);
    }
  };

  const shuffleCards = () => {
    setIsShuffling(true);
    setDrawnCards([]);
    
    setTimeout(() => {
      const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5);
      setDrawnCards(shuffled.slice(0, selectedSpread.cards));
      setIsShuffling(false);
    }, 1500);
  };

  const getCardReading = (card: typeof TAROT_CARDS[0]) => {
    const readings = TAROT_READINGS[language]?.[category];
    return readings?.[card.name.en] || readings?.["The Fool"] || t.free;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0f0f23] to-[#020617] text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#020617]/90 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-purple-300 hover:text-amber-200 transition-colors">
                <ArrowLeft size={20} />
                <span className="text-sm">{language === "zh" ? "返回首页" : language === "id" ? "Beranda" : "Home"}</span>
              </Link>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-slate-400">{t.subtitle}</p>
        </div>

        {/* Controls */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 mb-8 space-y-4">
          {/* Question Input */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">{t.question}</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={language === 'zh' ? "输入你想问的问题..." : language === 'id' ? "Masukkan pertanyaan Anda..." : "Enter your question..."}
              className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Category & Spread */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">{t.category}</label>
              <div className="flex gap-2">
                {(['general', 'love', 'career'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      category === c 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {t[c]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">{t.spread}</label>
              <select
                value={selectedSpread.id}
                onChange={(e) => setSelectedSpread(SPREADS.find(s => s.id === e.target.value) || SPREADS[0])}
                className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
              >
                {SPREADS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name[language]} - {s.desc[language]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Shuffle Button */}
          <button
            onClick={shuffleCards}
            disabled={isShuffling}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-600 disabled:to-slate-600 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
          >
            {isShuffling ? <RefreshCw size={20} className="animate-spin" /> : <Shuffle size={20} />}
            {isShuffling ? t.shuffling : t.shuffle}
          </button>
        </div>

        {/* Cards Display */}
        {drawnCards.length > 0 && (
          <div className="space-y-6">
            {/* Cards */}
            <div className={`grid gap-4 ${drawnCards.length === 1 ? 'max-w-xs mx-auto' : drawnCards.length === 3 ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-5'}`}>
              {drawnCards.map((card, i) => (
                <div key={i} className="bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-center animate-in fade-in zoom-in duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="text-6xl mb-3">{card.image}</div>
                  <h3 className="font-bold text-white mb-1">{card.name[language]}</h3>
                  <p className="text-xs text-slate-400">{card.meaning[language]}</p>
                </div>
              ))}
            </div>

            {/* Simple Reading - Free */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-amber-400" />
                {t.reading}
                <span className="ml-2 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">{t.free}</span>
              </h3>
              <div className="space-y-3">
                {drawnCards.slice(0, isUnlocked ? drawnCards.length : 1).map((card, i) => (
                  <div key={i} className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{card.image}</span>
                      <span className="font-bold text-purple-400">{card.name[language]}</span>
                    </div>
                    <p className="text-slate-300 text-sm">{getCardReading(card)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Deep Reading - Unlock */}
            {!isUnlocked && drawnCards.length > 1 && (
              <div className="rounded-2xl overflow-hidden border border-slate-700">
                <div className="p-5 bg-gradient-to-r from-purple-900/40 to-pink-900/40 flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2">
                    <Lock size={18} className="text-slate-400" />
                    {t.reading} - {t.unlocked}
                  </h3>
                </div>
                <div className="p-6 space-y-5 bg-slate-900/60">
                  {/* Blurred Preview */}
                  <div className="relative">
                    <div className="space-y-3 blur-sm pointer-events-none select-none opacity-60">
                      <div className="p-4 rounded-xl bg-slate-800"><div className="h-4 bg-slate-700 rounded w-3/4 mb-2" /><div className="h-3 bg-slate-700/50 rounded w-full" /></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock size={32} className="text-slate-400" />
                    </div>
                  </div>
                  
                  {/* WhatsApp Share */}
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <MessageCircle size={20} className="text-green-400" />
                      <div className="font-medium text-white text-sm">{t.shareUnlock}</div>
                    </div>
                    <div className="flex gap-2 mb-3">
                      {[1, 2, 3].map(n => (
                        <div key={n} className={`flex-1 h-2 rounded-full transition-all ${shareCount >= n ? "bg-green-500" : "bg-slate-700"}`} />
                      ))}
                    </div>
                    <div className="text-xs text-slate-400 mb-3">{t.shareProgress}: {shareCount}/3</div>
                    
                    {shareCount < 3 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3].map(n => (
                          <button key={n} onClick={handleShare} disabled={shareCount >= n}
                            className={`py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${shareCount >= n ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-slate-800 hover:bg-green-500/20 text-slate-300 hover:text-green-300 border border-slate-700"}`}>
                            {shareCount >= n ? <CheckCircle size={12} /> : <Share2 size={12} />}
                            {language === 'zh' ? '好友' : language === 'id' ? 'Teman' : 'Friend'} {n}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-green-400 font-medium text-sm flex items-center justify-center gap-2">
                        <CheckCircle size={16} />{language === 'zh' ? '已解锁！' : language === 'id' ? 'Terbuka!' : 'Unlocked!'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
