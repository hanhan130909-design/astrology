"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage, zodiacNames } from '@/contexts/LanguageContext';
import { 
  Sparkles, Moon, Sun, Star, Compass, MessageSquare, 
  User, ChevronRight, Zap, BrainCircuit, Loader2, Waves, Heart, 
  Search, Bell, BookOpen, Award, X, LogOut, Calendar, HeartHandshake,
  TrendingUp, Eye, Share2, Bookmark, Settings, Crown, Sparkle, Wand2, 
  Gem, Globe, Telescope, Orbit, ChevronDown, Play, ArrowRight,
  Clock, Shield, Zap as Lightning, Users, Star as StarIcon, Quote,
  Home
} from 'lucide-react';

// Complete zodiac data with full 8-language translations
const ZODIAC_DATA = {
  aries: { 
    element: 'fire', dates: '3.21-4.19', icon: '♈', 
    traits: { 
      zh: ['勇敢', '冲动', '领导力'], 
      en: ['Brave', 'Impulsive', 'Leader'], 
      id: ['Berani', 'Impulsif', 'Pemimpin'],
      th: ['กล้าหาญ', 'หุนหันพลันแล่น', 'ผู้นำ'],
      vi: ['Dũng cảm', 'Bộp chộp', 'Lãnh đạo'],
      ms: ['Berani', 'Tiba-tiba', 'Pemimpin'],
      ja: ['勇敢', '冲动', 'リーダー'],
      ko: ['용감', '충동적', '리더']
    },
    color: '#FF6B6B', gradient: 'from-red-500 to-orange-500'
  },
  taurus: { 
    element: 'earth', dates: '4.20-5.20', icon: '♉', 
    traits: { 
      zh: ['稳定', '务实', '固执'], 
      en: ['Stable', 'Practical', 'Stubborn'], 
      id: ['Stabil', 'Praktis', 'Keras Kepala'],
      th: ['มั่นคง', 'ปฏิบัติ', 'ดื้อ'],
      vi: ['Ổn định', 'Thực tế', 'Bướng bỉnh'],
      ms: ['Stabil', 'Praktis', 'Degil'],
      ja: ['安定', '実用的', '頑固'],
      ko: ['안정', '실용적', '고집']
    },
    color: '#4ECDC4', gradient: 'from-green-500 to-emerald-500'
  },
  gemini: { 
    element: 'air', dates: '5.21-6.21', icon: '♊', 
    traits: { 
      zh: ['多变', '聪明', '好奇'], 
      en: ['Versatile', 'Smart', 'Curious'], 
      id: ['Serbaguna', 'Cerdas', 'Ringan'],
      th: ['เปลี่ยนแปลง', 'ฉลาด', 'อยากรู้'],
      vi: ['Đa biến', 'Thông minh', 'Tò mò'],
      ms: ['Serbaguna', 'Cerdik', 'Ingin tahu'],
      ja: ['多才', '賢い', '好奇心'],
      ko: ['다재다능', '똑똑', '호기심']
    },
    color: '#FFE66D', gradient: 'from-yellow-400 to-amber-400'
  },
  cancer: { 
    element: 'water', dates: '6.22-7.22', icon: '♋', 
    traits: { 
      zh: ['敏感', '家庭', '情感'], 
      en: ['Sensitive', 'Home-loving', 'Emotional'], 
      id: ['Perasa', 'Keluarga', 'Emosional'],
      th: ['อ่อนไหว', 'รักบ้าน', 'อารมณ์'],
      vi: ['Nhạy cảm', 'Yêu gia đình', 'Cảm xúc'],
      ms: ['Perasa', 'Cinta rumah', 'Emosi'],
      ja: ['敏感', '家庭志向', '感情的'],
      ko: ['민감', '가정적', '감정적']
    },
    color: '#95E1D3', gradient: 'from-teal-400 to-cyan-400'
  },
  leo: { 
    element: 'fire', dates: '7.23-8.22', icon: '♌', 
    traits: { 
      zh: ['自信', '戏剧', '慷慨'], 
      en: ['Confident', 'Dramatic', 'Generous'], 
      id: ['Percaya Diri', 'Dramatis', 'Dermawan'],
      th: ['มั่นใจ', 'เร้าอารมณ์', 'ใจบุญ'],
      vi: ['Tự tin', 'Kịch tính', 'Hào phóng'],
      ms: ['Yakin', 'Dramatis', 'Dermawan'],
      ja: ['自信', 'ドラマチック', '寛大'],
      ko: ['자신감', '극적', '관대']
    },
    color: '#F38181', gradient: 'from-orange-500 to-pink-500'
  },
  virgo: { 
    element: 'earth', dates: '8.23-9.22', icon: '♍', 
    traits: { 
      zh: ['分析', '完美', '服务'], 
      en: ['Analytical', 'Perfectionist', 'Helpful'], 
      id: ['Analitis', 'Sempurna', 'Pelayanan'],
      th: ['วิเคราะห์', 'สมบูรณ์แบบ', 'บริการ'],
      vi: ['Phân tích', 'Hoàn hảo', 'Phục vụ'],
      ms: ['Analitis', 'Sempurna', 'Melayani'],
      ja: ['分析的', '完璧主義', '奉仕'],
      ko: ['분석적', '완벽주의', '봉사']
    },
    color: '#AA96DA', gradient: 'from-purple-400 to-violet-500'
  },
  libra: { 
    element: 'air', dates: '9.23-10.23', icon: '♎', 
    traits: { 
      zh: ['平衡', '和谐', '美感'], 
      en: ['Balanced', 'Harmonious', 'Artistic'], 
      id: ['Seimbang', 'Harmonis', 'Seni'],
      th: ['สมดุล', 'กลมเกลียว', 'ศิลปะ'],
      vi: ['Cân bằng', 'Hài hòa', 'Nghệ thuật'],
      ms: ['Seimbang', 'Harmonis', 'Seni'],
      ja: ['平衡', '調和', '芸術性'],
      ko: ['균형', '조화', '예술적']
    },
    color: '#FCBAD3', gradient: 'from-pink-400 to-rose-500'
  },
  scorpio: { 
    element: 'water', dates: '10.24-11.22', icon: '♏', 
    traits: { 
      zh: ['神秘', '深刻', '洞察'], 
      en: ['Mysterious', 'Deep', 'Perceptive'], 
      id: ['Misterius', 'Mendalam', 'Intuitif'],
      th: ['ลึกลับ', 'ลึกซึ้ง', 'มีสัญชาตญาณ'],
      vi: ['Bí ẩn', 'Sâu sắc', 'Nhạy bén'],
      ms: ['Misterius', 'Mendalam', 'Intuitif'],
      ja: ['神秘的', '深い', '洞察力'],
      ko: ['신비로움', '깊이', '통찰력']
    },
    color: '#6C5CE7', gradient: 'from-indigo-600 to-purple-600'
  },
  sagittarius: { 
    element: 'fire', dates: '11.23-12.21', icon: '♐', 
    traits: { 
      zh: ['自由', '哲学', '冒险'], 
      en: ['Free-spirited', 'Philosophical', 'Adventurous'], 
      id: ['Bebas', 'Filosofis', 'Petualang'],
      th: ['อิสระ', 'ปรัชญา', 'ชอบผจญภัย'],
      vi: ['Tự do', 'Triết học', 'Phiêu lưu'],
      ms: ['Bebas', 'Filosofis', 'Petualang'],
      ja: ['自由', '哲学的', '冒険的'],
      ko: ['자유', '철학적', '모험적']
    },
    color: '#FDA7DF', gradient: 'from-fuchsia-500 to-purple-500'
  },
  capricorn: { 
    element: 'earth', dates: '12.22-1.19', icon: '♑', 
    traits: { 
      zh: ['责任', '目标', '纪律'], 
      en: ['Responsible', 'Ambitious', 'Disciplined'], 
      id: ['Bertanggung', 'Berambisi', 'Disiplin'],
      th: ['รับผิดชอบ', 'ทะเยอทะยาน', 'มีระเบียบ'],
      vi: ['Trách nhiệm', 'Ambitious', 'Kỷ luật'],
      ms: ['Bertanggungjawab', 'Berambisi', 'Berdisiplin'],
      ja: ['責任感', '野心', '規律正しい'],
      ko: ['책임감', '야심', '규律']
    },
    color: '#A8D8EA', gradient: 'from-slate-500 to-blue-500'
  },
  aquarius: { 
    element: 'air', dates: '1.20-2.18', icon: '♒', 
    traits: { 
      zh: ['创新', '人道', '独立'], 
      en: ['Innovative', 'Humanitarian', 'Independent'], 
      id: ['Inovatif', 'Kemanusiaan', 'Mandiri'],
      th: ['สร้างสรรค์', 'เอื้อเฟื้อ', 'เป็นตัวของตัวเอง'],
      vi: ['Đổi mới', 'Nhân đạo', 'Độc lập'],
      ms: ['Inovatif', 'Kemanusiaan', 'Bebas'],
      ja: ['革新的', '人道主義', '独立的'],
      ko: ['혁신적', '인도주의', '독립적']
    },
    color: '#7C3AED', gradient: 'from-violet-600 to-indigo-600'
  },
  pisces: { 
    element: 'water', dates: '2.19-3.20', icon: '♓', 
    traits: { 
      zh: ['直觉', '梦幻', '艺术'], 
      en: ['Intuitive', 'Dreamy', 'Artistic'], 
      id: ['Intuitif', 'Mimpi', 'Artistik'],
      th: ['สัญชาตญาณ', 'ฝัน', 'ศิลปะ'],
      vi: ['Trực giác', 'Mơ mộng', 'Nghệ thuật'],
      ms: ['Intuitif', 'Mimpi', 'Seni'],
      ja: ['直感', '夢想的', '芸術的'],
      ko: ['직관', '몽환적', '예술적']
    },
    color: '#0EA5E9', gradient: 'from-sky-500 to-cyan-500'
  },
};

const ELEMENT_COLORS = {
  fire: { bg: 'from-red-600/20 to-orange-600/20', border: 'border-red-500/30', text: 'text-red-400', icon: '🔥', label: { zh: '火象', en: 'Fire', id: 'Api', th: 'ธาตุไฟ', vi: 'Hỏa', ms: 'Api', ja: '火象', ko: '화염' } },
  earth: { bg: 'from-green-600/20 to-emerald-600/20', border: 'border-green-500/30', text: 'text-green-400', icon: '🌍', label: { zh: '土象', en: 'Earth', id: 'Tanah', th: 'ธาตุดิน', vi: 'Thổ', ms: 'Tanah', ja: '土象', ko: '토양' } },
  air: { bg: 'from-blue-600/20 to-cyan-600/20', border: 'border-blue-500/30', text: 'text-blue-400', icon: '💨', label: { zh: '风象', en: 'Air', id: 'Udara', th: 'ธาตุลม', vi: 'Phong', ms: 'Udara', ja: '風象', ko: '공기' } },
  water: { bg: 'from-purple-600/20 to-indigo-600/20', border: 'border-purple-500/30', text: 'text-purple-400', icon: '💧', label: { zh: '水象', en: 'Water', id: 'Air', th: 'ธาตุน้ำ', vi: 'Thủy', ms: 'Air', ja: '水象', ko: '물' } },
};

// Premium features for commercial platform
const PREMIUM_FEATURES = [
  { 
    id: 'natal', 
    title: { zh: '本命星盘分析', en: 'Natal Chart Analysis', id: 'Analisis Bagan Lahir', th: 'วิเคราะห์ดวงชะตา', vi: 'Phân tích Biểu đồ Sinh', ms: 'Analisis Carta Lahir', ja: 'ネイタルチャート分析', ko: '태어난 차트 분석' },
    desc: { zh: '完整行星落位、宫位、相位深度解读', en: 'Complete planetary positions, houses & aspects', id: 'Posisi planet, rumah & aspek lengkap', th: 'วิเคราะห์ตำแหน่งดาวเคราะห์ ราศี และด้านอย่างลึกซึ้ง', vi: 'Phân tích toàn diện vị trí hành tinh, cung & góc độ', ms: 'Analisis mendalam kedudukan planet, rumah & aspek', ja: '惑星の配置・ハウス・アスペクトを深く解読', ko: '행성 위치, 하우스 및 측면 심층 분석' },
    icon: Orbit, 
    color: 'purple',
    href: '/natal',
    premium: false
  },
  { 
    id: 'ai', 
    title: { zh: 'AI智能解读', en: 'AI-Powered Insights', id: 'Wawasan AI', th: 'อ่านผล AI', vi: 'Đọc AI', ms: 'Bacaan AI', ja: 'AI解読', ko: 'AI 해석' },
    desc: { zh: 'Free AI-Powered Deep Analysis by LLaMA 3.3', en: 'Free AI-Powered Deep Analysis by LLaMA 3.3', id: 'Analisis AI mendalam oleh LLaMA 3.3', th: 'การวิเคราะห์เชิงลึกด้วย AI ฟรีโดย LLaMA 3.3', vi: 'Phân tích chuyên sâu bằng AI miễn phí từ LLaMA 3.3', ms: 'Analisis mendalam AI percuma oleh LLaMA 3.3', ja: 'LLaMA 3.3による無料AI詳細分析', ko: 'LLaMA 3.3 기반 무료 AI 심층 분석' },
    icon: BrainCircuit, 
    color: 'cyan',
    href: '/ai-reading',
    premium: true
  },
  { 
    id: 'compat', 
    title: { zh: '星座配对', en: 'Compatibility Match', id: 'Kecocokan Zodiak', th: 'วิเคราะห์คู่รัก', vi: 'Song hợp', ms: 'Padanan Zodiak', ja: '相性診断', ko: '궁합 매치' },
    desc: { zh: '深入分析两人关系的契合度', en: 'Deep analysis of relationship compatibility', id: 'Analisis mendalam kecocokan hubungan', th: 'วิเคราะห์ความเข้ากันได้ของความสัมพันธ์อย่างลึกซึ้ง', vi: 'Phân tích sâu mức độ phù hợp trong mối quan hệ', ms: 'Analisis mendalam keserasian hubungan', ja: '二人の関係性の相性を深く分析', ko: '관계 궁합 심층 분석' },
    icon: HeartHandshake, 
    color: 'rose',
    href: '/compatibility',
    premium: false
  },
  { 
    id: 'horoscope', 
    title: { zh: '每日运势', en: 'Daily Horoscope', id: 'Horoskop Harian', th: 'ดวงชะตารายวัน', vi: 'Tử vi hàng ngày', ms: 'Horoskop Harian', ja: '毎日の運勢', ko: '일일 운세' },
    desc: { zh: '包含爱情、事业、财运多维度指引', en: 'Love, career & finance guidance', id: 'Panduan cinta, karir & keuangan', th: 'คำแนะนำด้านความรัก อาชีพ และการเงิน', vi: 'Hướng dẫn về tình yêu, sự nghiệp & tài chính', ms: 'Panduan cinta, kerjaya & kewangan', ja: '恋愛・仕事・財運の多角的ガイド', ko: '사랑, 커리어, 재물운 가이드' },
    icon: Sun, 
    color: 'amber',
    href: '/horoscope',
    premium: false
  },
  { 
    id: 'transits', 
    title: { zh: '行运追踪', en: 'Transit Tracker', id: 'Pelacak Transit', th: 'ติดตามทรานซิต', vi: 'Theo dõi Transit', ms: 'Penjejakan Transit', ja: 'トランジット追跡', ko: '트랜짓 추적' },
    desc: { zh: '实时追踪行星换座与重要相位', en: 'Track planetary transits & key aspects', id: 'Lacak transit planet & aspek penting', th: 'ติดตามการเปลี่ยนราศีของดาวเคราะห์และด้านสำคัญ', vi: 'Theo dõi chuyển cung hành tinh & góc độ chính', ms: 'Jejak transit planet & aspek penting', ja: '惑星の星座移動と重要アスペクトをリアルタイム追跡', ko: '행성 이동 및 주요 측면 실시간 추적' },
    icon: Telescope, 
    color: 'indigo',
    href: '/transits',
    premium: false
  },
  { 
    id: 'yearly', 
    title: { zh: '年度运势报告', en: 'Yearly Forecast', id: 'Ramalan Tahunan', th: 'รายงานดวงชะตาประจำปี', vi: 'Báo cáo tử vi hàng năm', ms: 'Ramalan Tahunan', ja: '年間運勢レポート', ko: '연간 운세 보고서' },
    desc: { zh: `预知${new Date().getFullYear()}全年运势走向`, en: `Discover your ${new Date().getFullYear()} journey`, id: `Temukan perjalanan ${new Date().getFullYear()} Anda`, th: `ค้นพบเส้นทางชะตาชีวิตปี ${new Date().getFullYear()}`, vi: `Khám phá hành trình ${new Date().getFullYear()} của bạn`, ms: `Temui perjalanan ${new Date().getFullYear()} anda`, ja: `${new Date().getFullYear()}年の運勢の流れを予知`, ko: `${new Date().getFullYear()}년 운세 흐름을 알아보세요` },
    icon: Calendar, 
    color: 'emerald',
    href: '/yearly-horoscope',
    premium: true
  },
  { 
    id: 'tarot', 
    title: { zh: '塔罗占卜', en: 'Tarot Reading', id: 'Bacaan Tarot', th: 'การดูไพ่ทาโรต์', vi: 'Xem bài Tarot', ms: 'Pembacaan Tarot', ja: 'タロット占い', ko: '타로 리딩' },
    desc: { zh: '神秘塔罗牌指引人生方向', en: 'Mystical tarot guidance', id: 'Panduan tarot mistis', th: 'คำแนะนำทางชีวิตจากไพ่ทาโรต์ลึกลับ', vi: 'Hướng dẫn định hướng cuộc sống từ bài Tarot bí ẩn', ms: 'Panduan hidup mistik dari kad Tarot', ja: '神秘のタロットカードが人生の方向性を導く', ko: '신비로운 타로 카드가 인생의 방향을 안내' },
    icon: Sparkles, 
    color: 'violet',
    href: '/tarot',
    premium: false
  },
  { 
    id: 'compare', 
    title: { zh: '星盘对比', en: 'Chart Compare', id: 'Bandingkan Chart', th: 'เปรียบเทียบแผนภูมิ', vi: 'So sánh Biểu đồ', ms: 'Banding Carta', ja: 'チャート比較', ko: '차트 비교' },
    desc: { zh: '对比两个星盘，探索关系动态', en: 'Compare two charts, explore relationship dynamics', id: 'Bandingkan dua chart, jelajahi dinamika hubungan', th: 'เปรียบเทียบสองแผนภูมิ สำรวจพลวัตความสัมพันธ์', vi: 'So sánh hai biểu đồ, khám phá động thái quan hệ', ms: 'Bandingkan dua carta, terokai dinamik hubungan', ja: '2つのチャートを比較し、関係のダイナミクスを探る', ko: '두 차트를 비교하고 관계의 역학을 탐구' },
    icon: Users, 
    color: 'pink',
    href: '/compare',
    premium: false
  },
  { 
    id: 'community', 
    title: { zh: '占星社区', en: 'Community', id: 'Komunitas', th: 'ชุมชนโหราศาสตร์', vi: 'Cộng đồng Chiêm tinh', ms: 'Komuniti Astrologi', ja: '占星コミュニティ', ko: '점성술 커뮤니티' },
    desc: { zh: '与占星爱好者交流讨论', en: 'Connect with astrology enthusiasts', id: 'Terhubung dengan penggemar astrologi', th: 'แลกเปลี่ยนและอภิปรายกับผู้ที่รักโหราศาสตร์', vi: 'Trao đổi và thảo luận với những người yêu chiêm tinh', ms: 'Berinteraksi dan berbincang dengan peminat astrologi', ja: '占星愛好家と交流・議論', ko: '점성술 애호가들과 소통하고 토론' },
    icon: MessageSquare, 
    color: 'teal',
    href: '/community',
    premium: false
  },
  { 
    id: 'academy', 
    title: { zh: '占星学院', en: 'Academy', id: 'Akademi', th: 'สถาบันโหราศาสตร์', vi: 'Học viện Chiêm tinh', ms: 'Akademi Astrologi', ja: '占星アカデミー', ko: '점성술 아카데미' },
    desc: { zh: '系统学习占星学课程', en: 'Learn astrology systematically', id: 'Pelajari astrologi secara sistematis', th: 'เรียนรู้หลักสูตรโหราศาสตร์อย่างเป็นระบบ', vi: 'Học hệ thống các khóa học chiêm tinh', ms: 'Belajar astrologi secara sistematik', ja: '体系的に占星学を学ぶコース', ko: '점성술을 체계적으로 학습' },
    icon: BookOpen, 
    color: 'orange',
    href: '/academy',
    premium: false
  },
  { 
    id: 'consultation', 
    title: { zh: '大师咨询', en: 'Consultation', id: 'Konsultasi', th: 'ปรึกษาโหร', vi: 'Tư vấn Chuyên gia', ms: 'Perundingan', ja: '専門家相談', ko: '전문가 상담' },
    desc: { zh: '预约专业占星师一对一咨询', en: 'Book professional astrologer sessions', id: 'Pesan sesi dengan astrolog profesional', th: 'นัดหมายปรึกษาโหราศาสตร์แบบตัวต่อตัว', vi: 'Đặt lịch tư vấn chiêm tinh 1-1 với chuyên gia', ms: 'Tempah sesi perundingan astrologi profesional', ja: 'プロ占星師による1対1相談を予約', ko: '전문 점성술사 1:1 상담 예약' },
    icon: Star, 
    color: 'gold',
    href: '/consultation',
    premium: true
  },
];

const TESTIMONIALS = [
  {
    name: { zh: '林小姐', en: 'Sarah L.', id: 'Sarah L.', th: 'คุณลิน', vi: 'Chị Linh', ms: 'Cik Lin', ja: 'リンさん', ko: '린 씨' },
    role: { zh: '产品经理', en: 'Product Manager', id: 'Manajer Produk', th: 'ผู้จัดการผลิตภัณฑ์', vi: 'Quản lý sản phẩm', ms: 'Pengurus Produk', ja: 'プロダクトマネージャー', ko: '제품 관리자' },
    avatar: 'SL',
    content: { 
      zh: 'AI解读太准了！完全命中了我最近的事业转折点，强烈推荐给每个想了解自己的人。',
      en: 'The AI reading was incredibly accurate! It perfectly predicted my career transition. Highly recommend!',
      id: 'Bacaan AI sangat akurat! Ini memprediksi transisi karir saya dengan sempurna.',
      th: 'การอ่าน AI แม่นยำมาก! ทำนายการเปลี่ยนแปลงอาชีพของฉันได้อย่างสมบูรณ์แบบ',
      vi: 'Đọc AI cực kỳ chính xác! Nó đã dự đoán hoàn hảo sự chuyển đổi sự nghiệp của tôi.',
      ms: 'Bacaan AI sangat tepat! Ia meramalkan peralihan kerjaya saya dengan sempurna.',
      ja: 'AIの読み取りが非常に正確です！キャリアの転身を完璧に予測してくれました。',
      ko: 'AI 판독이 정말 정확합니다! 제 커리어 전환을 완벽하게 예측했어요.'
    },
    rating: 5
  },
  {
    name: { zh: '陈先生', en: 'Michael C.', id: 'Michael C.', th: 'คุณเฉิน', vi: 'Anh Trần', ms: 'Encik Chen', ja: 'チンさん', ko: '천 씨' },
    role: { zh: '创业者', en: 'Entrepreneur', id: 'Pengusaha', th: 'ผู้ประกอบการ', vi: 'Doanh nhân', ms: 'Usahawan', ja: '起業家', ko: '기업가' },
    avatar: 'MC',
    content: { 
      zh: '每日运势已经成为我每天必看的习惯，帮助我在重要决策前更有信心。',
      en: 'Daily horoscope has become my daily ritual. It helps me make better decisions.',
      id: 'Horoskop harian已经成为 ritual harian saya. Membantu saya membuat keputusan lebih baik.',
      th: 'ดวงชะตารายวันได้กลายเป็นพิธีกรรมประจำวันของฉัน ช่วยให้ฉันตัดสินใจได้ดีขึ้น',
      vi: 'Tử vi hàng ngày đã trở thành thói quen hàng ngày của tôi. Nó giúp tôi đưa ra quyết định tốt hơn.',
      ms: 'Horoskop harian telah menjadi ritual harian saya. Ia membantu saya membuat keputusan yang lebih baik.',
      ja: '毎日の運勢は私の日常の習慣になりました。より良い意思決定ができるようになりました。',
      ko: '일일 운세는 제 일상적인 의식이 되었습니다. 더 나은 결정을 내리는 데 도움이 됩니다.'
    },
    rating: 5
  },
  {
    name: { zh: '王女士', en: 'Emma W.', id: 'Emma W.', th: 'คุณหวาง', vi: 'Chị Vương', ms: 'Cik Wang', ja: 'ワンさん', ko: '왕 씨' },
    role: { zh: '心理咨询师', en: 'Psychologist', id: 'Psikolog', th: 'นักจิตวิทยา', vi: 'Nhà tâm lý trị liệu', ms: 'Psikologi', ja: '心理カウンセラー', ko: '심리 상담사' },
    avatar: 'EW',
    content: { 
      zh: '作为专业人士，我也很认可这里的占星内容，专业且不失深度。',
      en: 'As a professional, I appreciate the depth and accuracy of the astrology content here.',
      id: 'Sebagai profesional, saya menghargai kedalaman dan keakuratan konten astrologi di sini.',
      th: 'ในฐานะมืออาชีพ ฉันเห็นคุณค่าของเนื้อหาโหราศาสตร์ที่นี่ ทั้งเชี่ยวชาญและลึกซึ้ง',
      vi: 'Là một chuyên gia, tôi đánh giá cao độ sâu và độ chính xác của nội dung chiêm tinh ở đây.',
      ms: 'Sebagai profesional, saya menghargai kedalaman dan ketepatan kandungan astrologi di sini.',
      ja: '専門家として、ここ占星術コンテンツの奥深さと正確さを高く評価しています。',
      ko: '전문가로서 이곳의 점성술 콘텐츠의 깊이와 정확성을 높이評価합니다.'
    },
    rating: 5
  },
];

const STATS = [
  { value: '100% Free', label: { zh: '永远免费', en: '100% Free', id: 'Pengguna Percaya', th: 'ผู้ใช้ไว้วางใจ', vi: 'Người Dùng Tin Tưởng', ms: 'Pengguna Percaya', ja: 'ユーザーが信頼', ko: '사용자 신뢰' } },
  { value: 'Real', label: { zh: '真实天文计算', en: 'Real Astronomy', id: 'Tingkat Akurasi', th: 'อัตราความแม่นยำ', vi: 'Tỷ Lệ Chính Xác', ms: 'Kadar Ketepatan', ja: '正確率', ko: '정확도' } },
  { value: '8', label: { zh: '支持8种语言', en: '8 Languages', id: 'Selalu Tersedia', th: 'บริการตลอด 24/7', vi: 'Dịch Vụ 24/7', ms: 'Perkhidmatan 24/7', ja: '24時間対応', ko: '24/7 서비스' } },
];

// Translations helper - Full 8 language support
const T = {
  nav: {
    zh: { home: '首页', features: '功能', about: '关于', login: '登录', start: '开始使用' },
    en: { home: 'Home', features: 'Features', about: 'About', login: 'Login', start: 'Get Started' },
    id: { home: 'Beranda', features: 'Fitur', about: 'Tentang', login: 'Masuk', start: 'Mulai' },
    th: { home: 'หน้าแรก', features: 'ฟีเจอร์', about: 'เกี่ยวกับ', login: 'เข้าสู่ระบบ', start: 'เริ่มต้น' },
    vi: { home: 'Trang chủ', features: 'Tính năng', about: 'Giới thiệu', login: 'Đăng nhập', start: 'Bắt đầu' },
    ms: { home: 'Laman', features: 'Ciri', about: 'Mengenai', login: 'Masuk', start: 'Mula' },
    ja: { home: 'ホーム', features: '機能', about: '概要', login: 'ログイン', start: '始める' },
    ko: { home: '홈', features: '기능', about: '소개', login: '로그인', start: '시작' },
  },
  hero: {
    zh: { badge: '✨ AI 驱动的占星新时代', title: '探索你的命运星图', subtitle: '基于真实天文计算与先进AI技术，为你提供专业、精准的占星解读，指引人生方向', cta: '免费生成星盘', ctaSecondary: '了解更多', free: '永久免费基础功能' },
    en: { badge: '✨ AI-Powered Astrology Era', title: 'Discover Your Celestial Map', subtitle: 'Professional astrology insights powered by real astronomy calculations and advanced AI technology', cta: 'Generate Free Chart', ctaSecondary: 'Learn More', free: 'Free basic features forever' },
    id: { badge: '✨ Era Astrologi Berbasis AI', title: 'Temukan Peta Bintangmu', subtitle: 'Wawasan astrologi profesional yang didukung oleh perhitungan astronomi nyata dan AI canggih', cta: 'Buat Bagan Gratis', ctaSecondary: 'Pelajari Lebih', free: 'Fitur dasar gratis selamanya' },
    th: { badge: '✨ ยุคโหราศาสตร์ AI', title: 'ค้นพบแผนที่ดวงดาวของคุณ', subtitle: 'ข้อมูลโหราศาสตร์มืออาชีพที่ขับเคลื่อนด้วยการคำนวณดาราศาสตร์จริงและ AI ขั้นสูง', cta: 'สร้างแผนภูมิฟรี', ctaSecondary: 'เรียนรู้เพิ่มเติม', free: 'ฟีเจอร์พื้นฐานฟรีตลอดไป' },
    vi: { badge: '✨ Kỷ Nguyên Chiêm Tinh AI', title: 'Khám Phá Bản Đồ Sao Của Bạn', subtitle: 'Thông tin chiêm tinh chuyên nghiệp được hỗ trợ bởi tính toán thiên văn thực và AI tiên tiến', cta: 'Tạo Bản Đồ Miễn Phí', ctaSecondary: 'Tìm Hiểu Thêm', free: 'Tính năng cơ bản miễn phí vĩnh viễn' },
    ms: { badge: '✨ Era Astrologi AI', title: 'Temui Peta Bintang Anda', subtitle: 'Wawasan astrologi profesional yang dikuasakan oleh pengiraan astronomi sebenar dan AI canggih', cta: 'Jana Carta Percuma', ctaSecondary: 'Ketahui Lebih', free: 'Ciri asas percuma selama-lamanya' },
    ja: { badge: '✨ AI驅動の占星術新时代', title: 'あなたの星座マップをを発見', subtitle: '実際の天文計算と高度なAI技術に支えられたプロフェッショナルな占星インサイト', cta: '無料でチャートを作成', ctaSecondary: '詳しく見る', free: '永久無料の基本機能' },
    ko: { badge: '✨ AI 기반 점성술 시대', title: '당신의 천체 지도를 발견하세요', subtitle: '실제 천문학적 계산과 첨단 AI 기술로 구동되는 전문 점성술 인사이트', cta: '무료 차트 생성', ctaSecondary: '자세히 보기', free: '영구 무료 기본 기능' },
  },
  features: {
    zh: { title: '为什么选择我们', subtitle: '专业、全面、精准的占星服务' },
    en: { title: 'Why Choose Us', subtitle: 'Professional, comprehensive & accurate astrology' },
    id: { title: 'Mengapa Memilih Kami', subtitle: 'Astrologi profesional, komprehensif & akurat' },
    th: { title: 'ทำไมต้องเลือกเรา', subtitle: 'บริการโหราศาสตร์มืออาชีพ ครอบคลุม & แม่นยำ' },
    vi: { title: 'Tại Sao Chọn Chúng Tôi', subtitle: 'Dịch vụ chiêm tinh chuyên nghiệp, toàn diện & chính xác' },
    ms: { title: 'Mengapa Memilih Kami', subtitle: 'Perkhidmatan astrologi profesional, komprehensif & tepat' },
    ja: { title: 'なぜ私たちを選ぶのですか', subtitle: '専門的、包括的、かつ正確な占星術サービス' },
    ko: { title: '왜 우리를 선택해야 할까요', subtitle: '전문적이고 포괄적이며 정확한 점성술 서비스' },
  },
  stats: {
    zh: { users: '用户信赖', accuracy: '解读准确率', support: '全天候服务' },
    en: { users: 'Users Trust', accuracy: 'Accuracy Rate', support: 'Always Available' },
    id: { users: 'Pengguna Percaya', accuracy: 'Tingkat Akurasi', support: 'Selalu Tersedia' },
    th: { users: 'ผู้ใช้ไว้วางใจ', accuracy: 'อัตราความแม่นยำ', support: 'บริการตลอด 24/7' },
    vi: { users: 'Người Dùng Tin Tưởng', accuracy: 'Tỷ Lệ Chính Xác', support: 'Dịch Vụ 24/7' },
    ms: { users: 'Pengguna Percaya', accuracy: 'Kadar Ketepatan', support: 'Perkhidmatan 24/7' },
    ja: { users: 'ユーザーが信頼', accuracy: '正確率', support: '24時間サービス' },
    ko: { users: '사용자 신뢰', accuracy: '정확도', support: '24/7 서비스' },
  },
  zodiac: {
    zh: { title: '探索十二星座', subtitle: '点击选择查看今日运势' },
    en: { title: 'Explore Zodiac Signs', subtitle: 'Click to view today\'s horoscope' },
    id: { title: 'Jelajahi 12 Zodiak', subtitle: 'Klik untuk melihat horoskop hari ini' },
    th: { title: 'สำรวจ 12 ราศี', subtitle: 'คลิกเพื่อดูดวงชะตาวันนี้' },
    vi: { title: 'Khám Phá 12 Cung Hoàng Đạo', subtitle: 'Nhấn để xem horoscope hôm nay' },
    ms: { title: 'Terokai 12 Zodiak', subtitle: 'Klik untuk lihat horoskop hari ini' },
    ja: { title: '12星座を探索', subtitle: 'クリックして今日の運勢を見る' },
    ko: { title: '12별자리 탐색', subtitle: '클릭하여 오늘의 운세를 확인하세요' },
  },
  testimonials: {
    zh: { title: '用户好评', subtitle: '来自真实用户的反馈' },
    en: { title: 'User Reviews', subtitle: 'Feedback from real users' },
    id: { title: 'Ulasan Pengguna', subtitle: 'Masukan dari pengguna nyata' },
    th: { title: 'รีวิวจากผู้ใช้', subtitle: 'ความคิดเห็นจากผู้ใช้จริง' },
    vi: { title: 'Đánh Giá Người Dùng', subtitle: 'Phản hồi từ người dùng thực' },
    ms: { title: 'Ulasan Pengguna', subtitle: 'Maklum balas daripada pengguna sebenar' },
    ja: { title: 'ユーザーレビュー', subtitle: '実際のユーザーからのフィードバック' },
    ko: { title: '사용자 리뷰', subtitle: '실제 사용자의 피드백' },
  },
  cta: {
    zh: { title: '准备好探索你的命运了吗？', subtitle: '立即开始，免费获取你的专属星盘分析', button: '立即开始' },
    en: { title: 'Ready to Explore Your Destiny?', subtitle: 'Start now and get your personalized chart analysis for free', button: 'Start Now' },
    id: { title: 'Siap Menjelajahi Takdirmu?', subtitle: 'Mulai sekarang dan dapatkan analisis bagan personal gratis', button: 'Mulai Sekarang' },
    th: { title: 'พร้อมที่จะสำรวจโชคชะตาของคุณหรือยัง?', subtitle: 'เริ่มต้นทันทีและรับการวิเคราะห์แผนภูมิส่วนตัวฟรี', button: 'เริ่มต้นทันที' },
    vi: { title: 'Sẵn Sàng Khám Phá Vận Mệnh Của Bạn?', subtitle: 'Bắt đầu ngay và nhận bản phân tích bản đồ cá nhân miễn phí', button: 'Bắt Đầu Ngay' },
    ms: { title: 'Bersedia untuk Meneroka Takdir Anda?', subtitle: 'Mula sekarang dan dapat analisis carta peribadi secara percuma', button: 'Mula Sekarang' },
    ja: { title: '運命を探索する準備ができましたか?', subtitle: '今すぐ始めて、パーソナルのチャート分析を無料で入手', button: '今すぐ始める' },
    ko: { title: '당신의 운명을 탐험할 준비가 되셨나요?', subtitle: '지금 시작하고 개인화된 차트 분석을 무료로 받으세요', button: '지금 시작' },
  },
  elements: {
    zh: { fire: '火象', earth: '土象', air: '风象', water: '水象' },
    en: { fire: 'Fire', earth: 'Earth', air: 'Air', water: 'Water' },
    id: { fire: 'Api', earth: 'Tanah', air: 'Udara', water: 'Air' },
    th: { fire: 'ธาตุไฟ', earth: 'ธาตุดิน', air: 'ธาตุลม', water: 'ธาตุน้ำ' },
    vi: { fire: 'Hỏa', earth: 'Thổ', air: 'Phong', water: 'Thủy' },
    ms: { fire: 'Api', earth: 'Tanah', air: 'Udara', water: 'Air' },
    ja: { fire: '火象', earth: '土象', air: '風象', water: '水象' },
    ko: { fire: '화염', earth: '토양', air: '공기', water: '물' },
  },
};

function getText(obj: any, lang: string): string {
  if (typeof obj === 'string') return obj;
  return obj?.[lang] || obj?.zh || obj?.en || '';
}

export default function HomePage() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [selectedZodiac, setSelectedZodiac] = useState('aries');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiType, setAiType] = useState<'divination' | 'natal'>('natal'); 
  const [userInput, setUserInput] = useState('');
  const [birthData, setBirthData] = useState({ name: '', date: '', time: '', location: '' });
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedSigns, setSavedSigns] = useState<string[]>([]);
  const [showZodiacDropdown, setShowZodiacDropdown] = useState(false);
  
  const lang = language || 'zh';
  const supportedLangs = ['zh', 'en', 'id', 'th', 'vi', 'ms', 'ja', 'ko'];
  const validLang = supportedLangs.includes(lang) ? lang : 'zh';
  const t_nav = T.nav[validLang as keyof typeof T.nav] || T.nav.zh;
  const t_hero = T.hero[validLang as keyof typeof T.hero] || T.hero.zh;
  const t_features = T.features[validLang as keyof typeof T.features] || T.features.zh;
  const t_zodiac = T.zodiac[validLang as keyof typeof T.zodiac] || T.zodiac.zh;
  const t_testimonials = T.testimonials[validLang as keyof typeof T.testimonials] || T.testimonials.zh;
  const t_cta = T.cta[validLang as keyof typeof T.cta] || T.cta.zh;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    const saved = localStorage.getItem('saved_zodiacs');
    if (saved) setSavedSigns(JSON.parse(saved));
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSaveSign = (signId: string) => {
    const newSaved = savedSigns.includes(signId) ? savedSigns.filter(id => id !== signId) : [...savedSigns, signId];
    setSavedSigns(newSaved);
    localStorage.setItem('saved_zodiacs', JSON.stringify(newSaved));
  };

  const currentZodiac = ZODIAC_DATA[selectedZodiac as keyof typeof ZODIAC_DATA];

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans antialiased">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      

      <main className="relative">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-gray-200 mb-6">
                <Sparkle size={14} className="text-amber-400 fill-amber-400" />
                <span className="text-sm text-gray-600">{t_hero.badge}</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  {t_hero.title.split(' ')[0]}
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                  {t_hero.title.split(' ').slice(1).join(' ')}
                </span>
              </h1>
              
              <p className="text-lg text-gray-500 mb-8 max-w-lg leading-relaxed">
                {t_hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/natal" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-2xl font-bold text-gray-900 transition-all shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105">
                  {t_hero.cta}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#features" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-gray-200 rounded-2xl font-medium text-gray-900 transition-all">
                  <Play size={18} />
                  {t_hero.ctaSecondary}
                </a>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-400">
                <Shield size={16} className="text-emerald-500" />
                <span>{t_hero.free}</span>
              </div>
            </div>

            {/* Animated Zodiac Wheel */}
            <div className="relative hidden lg:flex justify-center items-center">
              <div className="relative w-[450px] h-[450px]">
                {/* Outer glow rings */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20 rounded-full blur-3xl" />
                
                {/* Main wheel SVG */}
                {/* Performance: SVG with GPU-accelerated transform only */}
                <svg viewBox="0 0 400 400" className="w-full h-full" style={{ animation: "spin_60s_linear_infinite", transformOrigin: "center center", willChange: "transform" }}>
                  <defs>
                    <linearGradient id="wheelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="50%" stopColor="#db2777" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Outer ring */}
                  <circle cx="200" cy="200" r="190" fill="none" stroke="url(#wheelGrad)" strokeWidth="1" opacity="0.3" />
                  <circle cx="200" cy="200" r="170" fill="none" stroke="url(#wheelGrad)" strokeWidth="0.5" opacity="0.2" />
                  
                  {/* Zodiac signs */}
                  {Object.entries(ZODIAC_DATA).map(([id, data], i) => {
                    const angle = ((i * 30) - 90) * Math.PI / 180;
                    const x = 200 + 150 * Math.cos(angle);
                    const y = 200 + 150 * Math.sin(angle);
                    const isSelected = selectedZodiac === id;
                    return (
                      <g key={id} className="cursor-pointer" onClick={() => setSelectedZodiac(id)}>
                        <circle cx={x} cy={y} r={isSelected ? 28 : 22} fill={isSelected ? `${data.color}40` : '#1e1b4b'} stroke={data.color} strokeWidth={isSelected ? 2 : 1} filter={isSelected ? 'url(#glow)' : ''} />
                        <text x={x} y={y + 5} textAnchor="middle" fontSize={isSelected ? 20 : 16} fill={isSelected ? data.color : '#94a3b8'}>{data.icon}</text>
                      </g>
                    );
                  })}
                  
                  {/* Center */}
                  <circle cx="200" cy="200" r="60" fill="#0f0a1e" stroke="#7c3aed" strokeWidth="2" />
                  <circle cx="200" cy="200" r="50" fill="url(#wheelGrad)" opacity="0.2" />
                  <text x="200" y="195" textAnchor="middle" fontSize="28" fill={currentZodiac?.color || '#a855f7'}>{currentZodiac?.icon}</text>
                  <text x="200" y="215" textAnchor="middle" fontSize="10" fill="#94a3b8" style={{ textTransform: 'uppercase' }}>{currentZodiac?.dates}</text>
                </svg>

                {/* Floating particles */}
                <div className="absolute top-10 left-20 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDuration: '2s' }} />
                <div className="absolute top-32 right-10 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
                <div className="absolute bottom-20 left-32 w-1 h-1 bg-amber-400 rounded-full animate-bounce" style={{ animationDuration: '3s', animationDelay: '1s' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y border-gray-200 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-3 gap-8">
              {STATS.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{getText(stat.label, lang)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-purple-400 text-sm font-medium tracking-wider uppercase">{t_features.subtitle}</span>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mt-3 mb-4">{t_features.title}</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">{lang === 'zh' ? '专为初学者和专家设计的专业占星工具' : lang === 'en' ? 'Discover professional astrology tools designed for both beginners and experts' : lang === 'id' ? 'Temukan alat astrologi profesional untuk pemula dan ahli' : lang === 'th' ? 'ค้นพบเครื่องมือโหราศาสตร์มืออาชีพสำหรับทั้งผู้เริ่มต้นและผู้เชี่ยวชาญ' : lang === 'vi' ? 'Khám phá các công cụ chiêm tinh chuyên nghiệp dành cho cả người mới và chuyên gia' : lang === 'ms' ? 'Temui alat astrologi profesional untuk pemula dan pakar' : lang === 'ja' ? '初心者から専門家まで、プロフェッショナルな占星ツール' : lang === 'ko' ? '초보자와 전문가 모두를 위한 전문 점성술 도구' : 'Discover professional astrology tools designed for both beginners and experts'}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PREMIUM_FEATURES.map((feature) => {
                const Icon = feature.icon;
                const isSelected = selectedZodiac === feature.id;
                return (
                  <Link
                    key={feature.id}
                    href={feature.href}
                    className={`group relative p-6 rounded-2xl border transition-all duration-500 hover:scale-[1.02] ${
                      feature.color === 'purple' ? 'bg-purple-950/30 border-purple-500/20 hover:border-purple-400/50 hover:bg-purple-950/50' :
                      feature.color === 'cyan' ? 'bg-cyan-950/30 border-cyan-500/20 hover:border-cyan-400/50 hover:bg-cyan-950/50' :
                      feature.color === 'rose' ? 'bg-rose-950/30 border-rose-500/20 hover:border-rose-400/50 hover:bg-rose-950/50' :
                      feature.color === 'amber' ? 'bg-amber-950/30 border-amber-500/20 hover:border-amber-400/50 hover:bg-amber-950/50' :
                      feature.color === 'indigo' ? 'bg-indigo-950/30 border-indigo-500/20 hover:border-indigo-400/50 hover:bg-indigo-950/50' :
                      'bg-emerald-950/30 border-emerald-500/20 hover:border-emerald-400/50 hover:bg-emerald-950/50'
                    }`}
                  >
                    {feature.premium && (
                      <div className="absolute top-4 right-4 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-[10px] font-bold text-gray-900">
                        PRO
                      </div>
                    )}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                      feature.color === 'purple' ? 'bg-purple-600/20 text-purple-400' :
                      feature.color === 'cyan' ? 'bg-cyan-600/20 text-cyan-400' :
                      feature.color === 'rose' ? 'bg-rose-600/20 text-rose-400' :
                      feature.color === 'amber' ? 'bg-amber-600/20 text-amber-400' :
                      feature.color === 'indigo' ? 'bg-indigo-600/20 text-indigo-400' :
                      'bg-emerald-600/20 text-emerald-400'
                    }`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{getText(feature.title, lang)}</h3>
                    <p className="text-sm text-gray-500 mb-4">{getText(feature.desc, lang)}</p>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      feature.color === 'purple' ? 'text-purple-400' :
                      feature.color === 'cyan' ? 'text-cyan-400' :
                      feature.color === 'rose' ? 'text-rose-400' :
                      feature.color === 'amber' ? 'text-amber-400' :
                      feature.color === 'indigo' ? 'text-indigo-400' :
                      'text-emerald-400'
                    } group-hover:gap-2 transition-all`}>
                      {lang === 'zh' ? '立即使用' : lang === 'en' ? 'Use now' : lang === 'id' ? 'Gunakan' : lang === 'th' ? 'ใช้เลย' : lang === 'vi' ? 'Sử dụng ngay' : lang === 'ms' ? 'Guna sekarang' : lang === 'ja' ? '今すぐ使う' : '지금 사용'}
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Zodiac Section */}
        <section id="zodiac" className="py-24 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-purple-400 text-sm font-medium tracking-wider uppercase">✨ {t_zodiac.title.split(' ')[0]}</span>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mt-3 mb-4">{t_zodiac.title}</h2>
              <p className="text-gray-500">{t_zodiac.subtitle}</p>
            </div>

            <div className="relative">
              {/* Zodiac Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Object.entries(ZODIAC_DATA).map(([id, data]) => (
                  <Link
                    key={id}
                    href={`/horoscope?sign=${id}`}
                    className={`group relative p-4 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                      selectedZodiac === id 
                        ? 'bg-white/10 border-white/20' 
                        : 'bg-white/[0.02] border-gray-200 hover:border-gray-200'
                    }`}
                    onMouseEnter={() => setSelectedZodiac(id)}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2 transition-transform group-hover:scale-110">{data.icon}</div>
                      <div className="text-sm font-medium text-gray-900 capitalize">{id}</div>
                      <div className="text-xs text-gray-400 mt-1">{data.dates}</div>
                    </div>
                    {selectedZodiac === id && (
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${data.gradient} opacity-10 -z-10`} />
                    )}
                  </Link>
                ))}
              </div>

              {/* Selected Zodiac Detail */}
              <div className={`mt-8 p-6 rounded-2xl bg-gradient-to-r ${currentZodiac?.gradient || 'from-purple-600 to-pink-600'} opacity-10`} />
              <div className="-mt-24 relative z-10 p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-gray-200">
                <div className="flex items-start gap-6">
                  <div className="text-6xl">{currentZodiac?.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1 capitalize">{selectedZodiac}</h3>
                    <p className="text-sm text-gray-500 mb-4">{currentZodiac?.dates} · {getText({...ELEMENT_COLORS[currentZodiac?.element as keyof typeof ELEMENT_COLORS]?.label}, lang)}</p>
                    <div className="flex flex-wrap gap-2">
                      {(currentZodiac?.traits[validLang as keyof typeof currentZodiac.traits] || currentZodiac?.traits.zh || [])?.map((trait, i) => (
                        <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-900/80">{trait}</span>
                      ))}
                    </div>
                  </div>
                  <Link href={`/horoscope?sign=${selectedZodiac}`} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium text-gray-900 transition-all">
                    {lang === 'zh' ? '查看运势' : lang === 'en' ? 'View Horoscope' : lang === 'id' ? 'Lihat Horoskop' : lang === 'th' ? 'ดูดวงชะตา' : lang === 'vi' ? 'Xem Tử vi' : lang === 'ms' ? 'Lihat Horoskop' : lang === 'ja' ? '運勢を見る' : '운세 보기'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="reviews" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-purple-400 text-sm font-medium tracking-wider uppercase">💬 {t_testimonials.subtitle}</span>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mt-3 mb-4">{t_testimonials.title}</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((testimonial, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-gray-200 hover:border-gray-200 transition-all">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <StarIcon key={j} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote size={24} className="text-purple-500/50 mb-3" />
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">&ldquo;{getText(testimonial.content, lang)}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-gray-900 font-bold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{getText(testimonial.name, lang)}</div>
                      <div className="text-xs text-gray-400">{getText(testimonial.role, lang)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6">
            <div className="relative p-12 rounded-3xl overflow-hidden text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-amber-600/20" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')]" />
              
              <div className="relative z-10">
                <Sparkles size={40} className="mx-auto text-amber-400 mb-6" />
                <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">{t_cta.title}</h2>
                <p className="text-gray-500 mb-8 max-w-xl mx-auto">{t_cta.subtitle}</p>
                <Link href="/natal" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-2xl font-bold text-gray-900 transition-all shadow-2xl shadow-purple-500/30">
                  {t_cta.button}
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-gray-900 fill-white" />
                </div>
                <span className="font-bold text-gray-900">{t('siteName')}</span>
              </div>
              <div className="flex gap-6 text-sm text-gray-500">
                <a href="#" className="hover:text-purple-700 transition-colors">{lang === 'zh' ? '隐私政策' : lang === 'en' ? 'Privacy' : lang === 'id' ? 'Kebijakan Privasi' : lang === 'th' ? 'นโยบายความเป็นส่วนตัว' : lang === 'vi' ? 'Chính sách bảo mật' : lang === 'ms' ? 'Dasar Privasi' : lang === 'ja' ? 'プライバシーポリシー' : '개인정보 처리방침'}</a>
                <a href="#" className="hover:text-purple-700 transition-colors">{lang === 'zh' ? '服务条款' : lang === 'en' ? 'Terms' : lang === 'id' ? 'Syarat Layanan' : lang === 'th' ? 'ข้อกำหนดการใช้งาน' : lang === 'vi' ? 'Điều khoản dịch vụ' : lang === 'ms' ? 'Terma Perkhidmatan' : lang === 'ja' ? '利用規約' : '서비스 약관'}</a>
                <a href="#" className="hover:text-purple-700 transition-colors">{lang === 'zh' ? '联系我们' : lang === 'en' ? 'Contact' : lang === 'id' ? 'Hubungi Kami' : lang === 'th' ? 'ติดต่อเรา' : lang === 'vi' ? 'Liên hệ' : lang === 'ms' ? 'Hubungi Kami' : lang === 'ja' ? 'お問い合わせ' : '문의하기'}</a>
              </div>
              <div className="text-sm text-gray-400">© 2024 {t('siteName')}. {lang === 'zh' ? '版权所有' : lang === 'en' ? 'All rights reserved' : lang === 'id' ? 'Hak cipta' : lang === 'th' ? 'สงวนลิขสิทธิ์' : lang === 'vi' ? 'Bảo lưu mọi quyền' : lang === 'ms' ? 'Hak cipta terpelihara' : lang === 'ja' ? '全著作権所有' : '모든 권리 보유'}.</div>
            </div>
          </div>
        </footer>
      </main>

      {/* Bottom Navigation for Mobile */}
      
    </div>
  );
}

