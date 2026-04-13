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

// Complete zodiac data with full translations
const ZODIAC_DATA = {
  aries: { 
    element: 'fire', dates: '3.21-4.19', icon: '♈', 
    traits: { zh: ['勇敢', '冲动', '领导力'], en: ['Brave', 'Impulsive', 'Leader'], id: ['Berani', 'Impulsif', 'Pemimpin'] },
    color: '#FF6B6B', gradient: 'from-red-500 to-orange-500'
  },
  taurus: { 
    element: 'earth', dates: '4.20-5.20', icon: '♉', 
    traits: { zh: ['稳定', '务实', '固执'], en: ['Stable', 'Practical', 'Stubborn'], id: ['Stabil', 'Praktis', 'Keras Kepala'] },
    color: '#4ECDC4', gradient: 'from-green-500 to-emerald-500'
  },
  gemini: { 
    element: 'air', dates: '5.21-6.21', icon: '♊', 
    traits: { zh: ['多变', '聪明', '好奇'], en: ['Versatile', 'Smart', 'Curious'], id: ['Serbaguna', 'Cerdas', 'Ringan'] },
    color: '#FFE66D', gradient: 'from-yellow-400 to-amber-400'
  },
  cancer: { 
    element: 'water', dates: '6.22-7.22', icon: '♋', 
    traits: { zh: ['敏感', '家庭', '情感'], en: ['Sensitive', 'Home-loving', 'Emotional'], id: ['Perasa', 'Keluarga', 'Emosional'] },
    color: '#95E1D3', gradient: 'from-teal-400 to-cyan-400'
  },
  leo: { 
    element: 'fire', dates: '7.23-8.22', icon: '♌', 
    traits: { zh: ['自信', '戏剧', '慷慨'], en: ['Confident', 'Dramatic', 'Generous'], id: ['Percaya Diri', 'Dramatis', 'Dermawan'] },
    color: '#F38181', gradient: 'from-orange-500 to-pink-500'
  },
  virgo: { 
    element: 'earth', dates: '8.23-9.22', icon: '♍', 
    traits: { zh: ['分析', '完美', '服务'], en: ['Analytical', 'Perfectionist', 'Helpful'], id: ['Analitis', 'Sempurna', 'Pelayanan'] },
    color: '#AA96DA', gradient: 'from-purple-400 to-violet-500'
  },
  libra: { 
    element: 'air', dates: '9.23-10.23', icon: '♎', 
    traits: { zh: ['平衡', '和谐', '美感'], en: ['Balanced', 'Harmonious', 'Artistic'], id: ['Seimbang', 'Harmonis', 'Seni'] },
    color: '#FCBAD3', gradient: 'from-pink-400 to-rose-500'
  },
  scorpio: { 
    element: 'water', dates: '10.24-11.22', icon: '♏', 
    traits: { zh: ['神秘', '深刻', '洞察'], en: ['Mysterious', 'Deep', 'Perceptive'], id: ['Misterius', 'Mendalam', 'Intuitif'] },
    color: '#6C5CE7', gradient: 'from-indigo-600 to-purple-600'
  },
  sagittarius: { 
    element: 'fire', dates: '11.23-12.21', icon: '♐', 
    traits: { zh: ['自由', '哲学', '冒险'], en: ['Free-spirited', 'Philosophical', 'Adventurous'], id: ['Bebas', 'Filosofis', 'Petualang'] },
    color: '#FDA7DF', gradient: 'from-fuchsia-500 to-purple-500'
  },
  capricorn: { 
    element: 'earth', dates: '12.22-1.19', icon: '♑', 
    traits: { zh: ['责任', '目标', '纪律'], en: ['Responsible', 'Ambitious', 'Disciplined'], id: ['Bertanggung', 'Berambisi', 'Disiplin'] },
    color: '#A8D8EA', gradient: 'from-slate-500 to-blue-500'
  },
  aquarius: { 
    element: 'air', dates: '1.20-2.18', icon: '♒', 
    traits: { zh: ['创新', '人道', '独立'], en: ['Innovative', 'Humanitarian', 'Independent'], id: ['Inovatif', 'Kemanusiaan', 'Mandiri'] },
    color: '#7C3AED', gradient: 'from-violet-600 to-indigo-600'
  },
  pisces: { 
    element: 'water', dates: '2.19-3.20', icon: '♓', 
    traits: { zh: ['直觉', '梦幻', '艺术'], en: ['Intuitive', 'Dreamy', 'Artistic'], id: ['Intuitif', 'Mimpi', 'Artistik'] },
    color: '#0EA5E9', gradient: 'from-sky-500 to-cyan-500'
  },
};

const ELEMENT_COLORS = {
  fire: { bg: 'from-red-600/20 to-orange-600/20', border: 'border-red-500/30', text: 'text-red-400', icon: '🔥', label: { zh: '火象', en: 'Fire', id: 'Api' } },
  earth: { bg: 'from-green-600/20 to-emerald-600/20', border: 'border-green-500/30', text: 'text-green-400', icon: '🌍', label: { zh: '土象', en: 'Earth', id: 'Tanah' } },
  air: { bg: 'from-blue-600/20 to-cyan-600/20', border: 'border-blue-500/30', text: 'text-blue-400', icon: '💨', label: { zh: '风象', en: 'Air', id: 'Udara' } },
  water: { bg: 'from-purple-600/20 to-indigo-600/20', border: 'border-purple-500/30', text: 'text-purple-400', icon: '💧', label: { zh: '水象', en: 'Water', id: 'Air' } },
};

// Premium features for commercial platform
const PREMIUM_FEATURES = [
  { 
    id: 'natal', 
    title: { zh: '本命星盘分析', en: 'Natal Chart Analysis', id: 'Analisis Bagan Lahir' },
    desc: { zh: '完整行星落位、宫位、相位深度解读', en: 'Complete planetary positions, houses & aspects', id: 'Posisi planet, rumah & aspek lengkap' },
    icon: Orbit, 
    color: 'purple',
    href: '/natal',
    premium: false
  },
  { 
    id: 'ai', 
    title: { zh: 'AI智能解读', en: 'AI-Powered Insights', id: 'Wawasan AI' },
    desc: { zh: '基于GPT-4的个性化深度分析', en: 'Personalized analysis powered by GPT-4', id: 'Analisis personal dengan GPT-4' },
    icon: BrainCircuit, 
    color: 'cyan',
    href: '/ai-reading',
    premium: true
  },
  { 
    id: 'compat', 
    title: { zh: '星座配对', en: 'Compatibility Match', id: 'Kecocokan Zodiak' },
    desc: { zh: '深入分析两人关系的契合度', en: 'Deep analysis of relationship compatibility', id: 'Analisis mendalam kecocokan hubungan' },
    icon: HeartHandshake, 
    color: 'rose',
    href: '/compatibility',
    premium: false
  },
  { 
    id: 'horoscope', 
    title: { zh: '每日运势', en: 'Daily Horoscope', id: 'Horoskop Harian' },
    desc: { zh: '包含爱情、事业、财运多维度指引', en: 'Love, career & finance guidance', id: 'Panduan cinta, karir & keuangan' },
    icon: Sun, 
    color: 'amber',
    href: '/horoscope',
    premium: false
  },
  { 
    id: 'transits', 
    title: { zh: '行运追踪', en: 'Transit Tracker', id: 'Pelacak Transit' },
    desc: { zh: '实时追踪行星换座与重要相位', en: 'Track planetary transits & key aspects', id: 'Lacak transit planet & aspek penting' },
    icon: Telescope, 
    color: 'indigo',
    href: '/transits',
    premium: false
  },
  { 
    id: 'yearly', 
    title: { zh: '年度运势报告', en: 'Yearly Forecast', id: 'Ramalan Tahunan' },
    desc: { zh: '预知2026全年运势走向', en: 'Discover your 2026 journey', id: 'Temukan perjalanan 2026 Anda' },
    icon: Calendar, 
    color: 'emerald',
    href: '/yearly-horoscope',
    premium: true
  },
  { 
    id: 'tarot', 
    title: { zh: '塔罗占卜', en: 'Tarot Reading', id: 'Bacaan Tarot' },
    desc: { zh: '神秘塔罗牌指引人生方向', en: 'Mystical tarot guidance', id: 'Panduan tarot mistis' },
    icon: Sparkles, 
    color: 'violet',
    href: '/tarot',
    premium: false
  },
  { 
    id: 'compare', 
    title: { zh: '星盘对比', en: 'Chart Compare', id: 'Bandingkan Chart' },
    desc: { zh: '对比两个星盘，探索关系动态', en: 'Compare two charts, explore relationship dynamics', id: 'Bandingkan dua chart, jelajahi dinamika hubungan' },
    icon: Users, 
    color: 'pink',
    href: '/compare',
    premium: false
  },
  { 
    id: 'community', 
    title: { zh: '占星社区', en: 'Community', id: 'Komunitas' },
    desc: { zh: '与占星爱好者交流讨论', en: 'Connect with astrology enthusiasts', id: 'Terhubung dengan penggemar astrologi' },
    icon: MessageSquare, 
    color: 'teal',
    href: '/community',
    premium: false
  },
  { 
    id: 'academy', 
    title: { zh: '占星学院', en: 'Academy', id: 'Akademi' },
    desc: { zh: '系统学习占星学课程', en: 'Learn astrology systematically', id: 'Pelajari astrologi secara sistematis' },
    icon: BookOpen, 
    color: 'orange',
    href: '/academy',
    premium: false
  },
  { 
    id: 'consultation', 
    title: { zh: '大师咨询', en: 'Consultation', id: 'Konsultasi' },
    desc: { zh: '预约专业占星师一对一咨询', en: 'Book professional astrologer sessions', id: 'Pesan sesi dengan astrolog profesional' },
    icon: Star, 
    color: 'gold',
    href: '/consultation',
    premium: true
  },
];

const TESTIMONIALS = [
  {
    name: { zh: '林小姐', en: 'Sarah L.', id: 'Sarah L.' },
    role: { zh: '产品经理', en: 'Product Manager', id: 'Manajer Produk' },
    avatar: 'SL',
    content: { 
      zh: 'AI解读太准了！完全命中了我最近的事业转折点，强烈推荐给每个想了解自己的人。',
      en: 'The AI reading was incredibly accurate! It perfectly predicted my career transition. Highly recommend!',
      id: 'Bacaan AI sangat akurat! Ini memprediksi transisi karir saya dengan sempurna.'
    },
    rating: 5
  },
  {
    name: { zh: '陈先生', en: 'Michael C.', id: 'Michael C.' },
    role: { zh: '创业者', en: 'Entrepreneur', id: 'Pengusaha' },
    avatar: 'MC',
    content: { 
      zh: '每日运势已经成为我每天必看的习惯，帮助我在重要决策前更有信心。',
      en: 'Daily horoscope has become my daily ritual. It helps me make better decisions.',
      id: 'Horoskop harian已经成为 ritual harian saya. Membantu saya membuat keputusan lebih baik.'
    },
    rating: 5
  },
  {
    name: { zh: '王女士', en: 'Emma W.', id: 'Emma W.' },
    role: { zh: '心理咨询师', en: 'Psychologist', id: 'Psikolog' },
    avatar: 'EW',
    content: { 
      zh: '作为专业人士，我也很认可这里的占星内容，专业且不失深度。',
      en: 'As a professional, I appreciate the depth and accuracy of the astrology content here.',
      id: 'Sebagai profesional, saya menghargai kedalaman dan keakuratan konten astrologi di sini.'
    },
    rating: 5
  },
];

const STATS = [
  { value: '1M+', label: { zh: '用户信赖', en: 'Users Trust', id: 'Pengguna Percaya' } },
  { value: '99%', label: { zh: '解读准确率', en: 'Accuracy Rate', id: 'Tingkat Akurasi' } },
  { value: '24/7', label: { zh: '全天候服务', en: 'Always Available', id: 'Selalu Tersedia' } },
];

// Translations helper
const T = {
  nav: {
    zh: { home: '首页', features: '功能', about: '关于', login: '登录', start: '开始使用' },
    en: { home: 'Home', features: 'Features', about: 'About', login: 'Login', start: 'Get Started' },
    id: { home: 'Beranda', features: 'Fitur', about: 'Tentang', login: 'Masuk', start: 'Mulai' },
  },
  hero: {
    zh: {
      badge: '✨ AI 驱动的占星新时代',
      title: '探索你的命运星图',
      subtitle: '基于真实天文计算与先进AI技术，为你提供专业、精准的占星解读，指引人生方向',
      cta: '免费生成星盘',
      ctaSecondary: '了解更多',
      free: '永久免费基础功能'
    },
    en: {
      badge: '✨ AI-Powered Astrology Era',
      title: 'Discover Your Celestial Map',
      subtitle: 'Professional astrology insights powered by real astronomy calculations and advanced AI technology',
      cta: 'Generate Free Chart',
      ctaSecondary: 'Learn More',
      free: 'Free basic features forever'
    },
    id: {
      badge: '✨ Era Astrologi Berbasis AI',
      title: 'Temukan Peta Bintangmu',
      subtitle: 'Wawasan astrologi profesional yang didukung oleh perhitungan astronomi nyata dan AI canggih',
      cta: 'Buat Bagan Gratis',
      ctaSecondary: 'Pelajari Lebih',
      free: 'Fitur dasar gratis selamanya'
    },
  },
  features: {
    zh: { title: '为什么选择我们', subtitle: '专业、全面、精准的占星服务' },
    en: { title: 'Why Choose Us', subtitle: 'Professional, comprehensive & accurate astrology' },
    id: { title: 'Mengapa Memilih Kami', subtitle: 'Astrologi profesional, komprehensif & akurat' },
  },
  stats: {
    zh: { users: '用户信赖', accuracy: '解读准确率', support: '全天候服务' },
    en: { users: 'Users Trust', accuracy: 'Accuracy Rate', support: 'Always Available' },
    id: { users: 'Pengguna Percaya', accuracy: 'Tingkat Akurasi', support: 'Selalu Tersedia' },
  },
  zodiac: {
    zh: { title: '探索十二星座', subtitle: '点击选择查看今日运势' },
    en: { title: 'Explore Zodiac Signs', subtitle: 'Click to view today\'s horoscope' },
    id: { title: 'Jelajahi 12 Zodiak', subtitle: 'Klik untuk melihat horoskop hari ini' },
  },
  testimonials: {
    zh: { title: '用户好评', subtitle: '来自真实用户的反馈' },
    en: { title: 'User Reviews', subtitle: 'Feedback from real users' },
    id: { title: 'Ulasan Pengguna', subtitle: 'Masukan dari pengguna nyata' },
  },
  cta: {
    zh: { title: '准备好探索你的命运了吗？', subtitle: '立即开始，免费获取你的专属星盘分析', button: '立即开始' },
    en: { title: 'Ready to Explore Your Destiny?', subtitle: 'Start now and get your personalized chart analysis for free', button: 'Start Now' },
    id: { title: 'Siap Menjelajahi Takdirmu?', subtitle: 'Mulai sekarang dan dapatkan analisis bagan personal gratis', button: 'Mulai Sekarang' },
  },
  elements: {
    zh: { fire: '火象', earth: '土象', air: '风象', water: '水象' },
    en: { fire: 'Fire', earth: 'Earth', air: 'Air', water: 'Water' },
    id: { fire: 'Api', earth: 'Tanah', air: 'Udara', water: 'Air' },
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
  const t_nav = T.nav[lang as keyof typeof T.nav] || T.nav.zh;
  const t_hero = T.hero[lang as keyof typeof T.hero] || T.hero.zh;
  const t_features = T.features[lang as keyof typeof T.features] || T.features.zh;
  const t_zodiac = T.zodiac[lang as keyof typeof T.zodiac] || T.zodiac.zh;
  const t_testimonials = T.testimonials[lang as keyof typeof T.testimonials] || T.testimonials.zh;
  const t_cta = T.cta[lang as keyof typeof T.cta] || T.cta.zh;

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
    <div className="min-h-screen bg-[#030014] text-slate-200 font-sans antialiased">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#030014]/95 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-shadow">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                {t('siteName')}
              </h1>
              <p className="text-[9px] text-slate-500 tracking-[0.2em] uppercase">Astrology</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">{t_nav.features}</a>
            <a href="#zodiac" className="text-sm text-slate-400 hover:text-white transition-colors">{t_zodiac.title.split(' ')[0]}</a>
            <a href="#reviews" className="text-sm text-slate-400 hover:text-white transition-colors">{t_testimonials.title}</a>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/5">
              {(['zh', 'en', 'id'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    language === l ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {l === 'zh' ? '中文' : l === 'en' ? 'EN' : 'ID'}
                </button>
              ))}
            </div>
            
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/user" className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/20">
                  {user.displayName?.[0] || user.email?.[0] || 'U'}
                </Link>
                <button onClick={logout} className="p-2 text-slate-400 hover:text-white transition-colors"><LogOut size={16} /></button>
              </div>
            ) : (
              <Link href="/login" className="hidden sm:flex px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-all">
                {t_nav.login}
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="relative">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-6">
                <Sparkle size={14} className="text-amber-400 fill-amber-400" />
                <span className="text-sm text-slate-300">{t_hero.badge}</span>
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
              
              <p className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed">
                {t_hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/natal" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-2xl font-bold text-white transition-all shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105">
                  {t_hero.cta}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#features" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-medium text-white transition-all">
                  <Play size={18} />
                  {t_hero.ctaSecondary}
                </a>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500">
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
                <svg viewBox="0 0 400 400" className="w-full h-full animate-[spin_60s_linear_infinite]">
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
        <section className="py-16 border-y border-white/5 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-3 gap-8">
              {STATS.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400">{getText(stat.label, lang)}</div>
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
              <h2 className="text-4xl lg:text-5xl font-black text-white mt-3 mb-4">{t_features.title}</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Discover professional astrology tools designed for both beginners and experts</p>
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
                      <div className="absolute top-4 right-4 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-[10px] font-bold text-white">
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
                    <h3 className="text-xl font-bold text-white mb-2">{getText(feature.title, lang)}</h3>
                    <p className="text-sm text-slate-400 mb-4">{getText(feature.desc, lang)}</p>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      feature.color === 'purple' ? 'text-purple-400' :
                      feature.color === 'cyan' ? 'text-cyan-400' :
                      feature.color === 'rose' ? 'text-rose-400' :
                      feature.color === 'amber' ? 'text-amber-400' :
                      feature.color === 'indigo' ? 'text-indigo-400' :
                      'text-emerald-400'
                    } group-hover:gap-2 transition-all`}>
                      {lang === 'zh' ? '立即使用' : lang === 'id' ? 'Gunakan' : 'Use now'}
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
              <h2 className="text-4xl lg:text-5xl font-black text-white mt-3 mb-4">{t_zodiac.title}</h2>
              <p className="text-slate-400">{t_zodiac.subtitle}</p>
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
                        : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                    }`}
                    onMouseEnter={() => setSelectedZodiac(id)}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2 transition-transform group-hover:scale-110">{data.icon}</div>
                      <div className="text-sm font-medium text-white capitalize">{id}</div>
                      <div className="text-xs text-slate-500 mt-1">{data.dates}</div>
                    </div>
                    {selectedZodiac === id && (
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${data.gradient} opacity-10 -z-10`} />
                    )}
                  </Link>
                ))}
              </div>

              {/* Selected Zodiac Detail */}
              <div className={`mt-8 p-6 rounded-2xl bg-gradient-to-r ${currentZodiac?.gradient || 'from-purple-600 to-pink-600'} opacity-10`} />
              <div className="-mt-24 relative z-10 p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                <div className="flex items-start gap-6">
                  <div className="text-6xl">{currentZodiac?.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-1 capitalize">{selectedZodiac}</h3>
                    <p className="text-sm text-slate-400 mb-4">{currentZodiac?.dates} · {getText({...ELEMENT_COLORS[currentZodiac?.element as keyof typeof ELEMENT_COLORS]?.label}, lang)}</p>
                    <div className="flex flex-wrap gap-2">
                      {currentZodiac?.traits[lang as keyof typeof currentZodiac.traits]?.map((trait, i) => (
                        <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80">{trait}</span>
                      ))}
                    </div>
                  </div>
                  <Link href={`/horoscope?sign=${selectedZodiac}`} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium text-white transition-all">
                    {lang === 'zh' ? '查看运势' : lang === 'id' ? 'Lihat Horoskop' : 'View Horoscope'}
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
              <h2 className="text-4xl lg:text-5xl font-black text-white mt-3 mb-4">{t_testimonials.title}</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((testimonial, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <StarIcon key={j} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote size={24} className="text-purple-500/50 mb-3" />
                  <p className="text-sm text-slate-300 mb-6 leading-relaxed">&ldquo;{getText(testimonial.content, lang)}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">{getText(testimonial.name, lang)}</div>
                      <div className="text-xs text-slate-500">{getText(testimonial.role, lang)}</div>
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
                <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">{t_cta.title}</h2>
                <p className="text-slate-400 mb-8 max-w-xl mx-auto">{t_cta.subtitle}</p>
                <Link href="/natal" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-2xl font-bold text-white transition-all shadow-2xl shadow-purple-500/30">
                  {t_cta.button}
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-white fill-white" />
                </div>
                <span className="font-bold text-white">{t('siteName')}</span>
              </div>
              <div className="flex gap-6 text-sm text-slate-400">
                <a href="#" className="hover:text-white transition-colors">{lang === 'zh' ? '隐私政策' : lang === 'id' ? 'Kebijakan Privasi' : 'Privacy'}</a>
                <a href="#" className="hover:text-white transition-colors">{lang === 'zh' ? '服务条款' : lang === 'id' ? 'Syarat Layanan' : 'Terms'}</a>
                <a href="#" className="hover:text-white transition-colors">{lang === 'zh' ? '联系我们' : lang === 'id' ? 'Hubungi Kami' : 'Contact'}</a>
              </div>
              <div className="text-sm text-slate-500">© 2024 {t('siteName')}. {lang === 'zh' ? '版权所有' : lang === 'id' ? 'Hak cipta' : 'All rights reserved'}.</div>
            </div>
          </div>
        </footer>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#030014]/95 backdrop-blur-xl border-t border-white/5 md:hidden">
        <div className="flex justify-around py-3">
          <Link href="/" className="flex flex-col items-center gap-1 text-purple-400">
            <Home size={20} />
            <span className="text-[10px]">{t_nav.home}</span>
          </Link>
          <Link href="/natal" className="flex flex-col items-center gap-1 text-slate-400">
            <Orbit size={20} />
            <span className="text-[10px]">{lang === 'zh' ? '星盘' : lang === 'id' ? 'Bagan' : 'Chart'}</span>
          </Link>
          <Link href="/horoscope" className="flex flex-col items-center gap-1 text-slate-400">
            <Sun size={20} />
            <span className="text-[10px]">{lang === 'zh' ? '运势' : lang === 'id' ? 'Horoskop' : 'Horoscope'}</span>
          </Link>
          <Link href="/ai-reading" className="flex flex-col items-center gap-1 text-slate-400">
            <BrainCircuit size={20} />
            <span className="text-[10px]">AI</span>
          </Link>
          {user ? (
            <Link href="/user" className="flex flex-col items-center gap-1 text-slate-400">
              <User size={20} />
              <span className="text-[10px]">{lang === 'zh' ? '我的' : lang === 'id' ? 'Saya' : 'Me'}</span>
            </Link>
          ) : (
            <Link href="/login" className="flex flex-col items-center gap-1 text-slate-400">
              <User size={20} />
              <span className="text-[10px]">{t_nav.login}</span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
