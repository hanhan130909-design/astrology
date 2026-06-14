"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { Star, Search, MapPin, X, Sparkles, Lock, Share2, CheckCircle, MessageCircle, ChevronDown } from 'lucide-react';
import ProfessionalNatalChart from '@/components/ProfessionalNatalChart';
import TransitOverlay from '@/components/TransitOverlay';
import { useChartStorage } from '../natal/useChartStorage';

const ALL_CITIES: { id: string; name: Record<string, string>; lat: number; lng: number; tz: number }[] = [
  // Indonesia - Major Cities
  {id:"jakarta",name:{zh:"雅加达",en:"Jakarta",id:"Jakarta"},lat:-6.2088,lng:106.8456,tz:7},
  {id:"surabaya",name:{zh:"泗水",en:"Surabaya",id:"Surabaya"},lat:-7.2575,lng:112.7521,tz:7},
  {id:"bandung",name:{zh:"万隆",en:"Bandung",id:"Bandung"},lat:-6.9175,lng:107.6191,tz:7},
  {id:"medan",name:{zh:"棉兰",en:"Medan",id:"Medan"},lat:3.5952,lng:98.6722,tz:7},
  {id:"semarang",name:{zh:"三宝垄",en:"Semarang",id:"Semarang"},lat:-6.9932,lng:110.4203,tz:7},
  {id:"makassar",name:{zh:"望加锡",en:"Makassar",id:"Makassar"},lat:-5.1477,lng:119.4327,tz:8},
  {id:"palembang",name:{zh:"巨港",en:"Palembang",id:"Palembang"},lat:-2.9761,lng:104.7754,tz:7},
  {id:"tangerang",name:{zh:"唐格朗",en:"Tangerang",id:"Tangerang"},lat:-6.1783,lng:106.6319,tz:7},
  {id:"depok",name:{zh:"德波",en:"Depok",id:"Depok"},lat:-6.4025,lng:106.7942,tz:7},
  {id:"bekasi",name:{zh:"勿加泗",en:"Bekasi",id:"Bekasi"},lat:-6.2349,lng:106.9896,tz:7},
  {id:"yogyakarta",name:{zh:"日惹",en:"Yogyakarta",id:"Yogyakarta"},lat:-7.7956,lng:110.3695,tz:7},
  {id:"malang",name:{zh:"玛琅",en:"Malang",id:"Malang"},lat:-7.9666,lng:112.6326,tz:7},
  {id:"denpasar",name:{zh:"登巴萨",en:"Denpasar",id:"Denpasar"},lat:-8.6705,lng:115.2126,tz:8},
  {id:"manado",name:{zh:"万鸦老",en:"Manado",id:"Manado"},lat:1.4748,lng:124.8421,tz:8},
  {id:"pontianak",name:{zh:"坤甸",en:"Pontianak",id:"Pontianak"},lat:-0.0263,lng:109.3425,tz:7},
  {id:"banjarmasin",name:{zh:"马辰",en:"Banjarmasin",id:"Banjarmasin"},lat:-3.3167,lng:114.5901,tz:8},
  {id:"batam",name:{zh:"巴淡岛",en:"Batam",id:"Batam"},lat:1.1301,lng:104.0533,tz:7},
  {id:"pekanbaru",name:{zh:"北干巴鲁",en:"Pekanbaru",id:"Pekanbaru"},lat:0.5071,lng:101.4478,tz:7},
  {id:"padang",name:{zh:"巴东",en:"Padang",id:"Padang"},lat:-0.9471,lng:100.4172,tz:7},
  // China
  {id:"beijing",name:{zh:"北京",en:"Beijing",id:"Beijing"},lat:39.9042,lng:116.4074,tz:8},
  {id:"shanghai",name:{zh:"上海",en:"Shanghai",id:"Shanghai"},lat:31.2304,lng:121.4737,tz:8},
  {id:"guangzhou",name:{zh:"广州",en:"Guangzhou",id:"Guangzhou"},lat:23.1291,lng:113.2644,tz:8},
  {id:"shenzhen",name:{zh:"深圳",en:"Shenzhen",id:"Shenzhen"},lat:22.5431,lng:114.0579,tz:8},
  {id:"chengdu",name:{zh:"成都",en:"Chengdu",id:"Chengdu"},lat:30.5728,lng:104.0668,tz:8},
  {id:"hangzhou",name:{zh:"杭州",en:"Hangzhou",id:"Hangzhou"},lat:30.2741,lng:120.1551,tz:8},
  {id:"wuhan",name:{zh:"武汉",en:"Wuhan",id:"Wuhan"},lat:30.5928,lng:114.3055,tz:8},
  {id:"xian",name:{zh:"西安",en:"Xi'an",id:"Xi'an"},lat:34.3416,lng:108.9398,tz:8},
  {id:"nanjing",name:{zh:"南京",en:"Nanjing",id:"Nanjing"},lat:32.0603,lng:118.7969,tz:8},
  {id:"chongqing",name:{zh:"重庆",en:"Chongqing",id:"Chongqing"},lat:29.5630,lng:106.5516,tz:8},
  // International
  {id:"tokyo",name:{zh:"东京",en:"Tokyo",id:"Tokyo"},lat:35.6762,lng:139.6503,tz:9},
  {id:"osaka",name:{zh:"大阪",en:"Osaka",id:"Osaka"},lat:34.6937,lng:135.5023,tz:9},
  {id:"seoul",name:{zh:"首尔",en:"Seoul",id:"Seoul"},lat:37.5665,lng:126.9780,tz:9},
  {id:"singapore",name:{zh:"新加坡",en:"Singapore",id:"Singapura"},lat:1.3521,lng:103.8198,tz:8},
  {id:"kualalumpur",name:{zh:"吉隆坡",en:"Kuala Lumpur",id:"Kuala Lumpur"},lat:3.1390,lng:101.6869,tz:8},
  {id:"bangkok",name:{zh:"曼谷",en:"Bangkok",id:"Bangkok"},lat:13.7563,lng:100.5018,tz:7},
  {id:"manila",name:{zh:"马尼拉",en:"Manila",id:"Manila"},lat:14.5995,lng:120.9842,tz:8},
  {id:"hochiminh",name:{zh:"胡志明市",en:"Ho Chi Minh City",id:"Ho Chi Minh City"},lat:10.8231,lng:106.6297,tz:7},
  {id:"newyork",name:{zh:"纽约",en:"New York",id:"New York"},lat:40.7128,lng:-74.0060,tz:-5},
  {id:"losangeles",name:{zh:"洛杉矶",en:"Los Angeles",id:"Los Angeles"},lat:34.0522,lng:-118.2437,tz:-8},
  {id:"london",name:{zh:"伦敦",en:"London",id:"London"},lat:51.5074,lng:-0.1278,tz:0},
  {id:"paris",name:{zh:"巴黎",en:"Paris",id:"Paris"},lat:48.8566,lng:2.3522,tz:1},
  {id:"sydney",name:{zh:"悉尼",en:"Sydney",id:"Sydney"},lat:-33.8688,lng:151.2093,tz:10},
  {id:"melbourne",name:{zh:"墨尔本",en:"Melbourne",id:"Melbourne"},lat:-37.8136,lng:144.9631,tz:10},
  {id:"dubai",name:{zh:"迪拜",en:"Dubai",id:"Dubai"},lat:25.2048,lng:55.2708,tz:4},
  {id:"mumbai",name:{zh:"孟买",en:"Mumbai",id:"Mumbai"},lat:19.0760,lng:72.8777,tz:5.5},
  {id:"delhi",name:{zh:"新德里",en:"New Delhi",id:"New Delhi"},lat:28.6139,lng:77.2090,tz:5.5},
];

const PC: { id: string; sym: string; color: string; name: Record<string, string> }[] = [
  {id:"Sun",sym:"\u2609",color:"#FFD700",name:{zh:"太阳",en:"Sun",id:"Matahari"}},
  {id:"Moon",sym:"\u263D",color:"#C0C0C0",name:{zh:"月亮",en:"Moon",id:"Bulan"}},
  {id:"Mercury",sym:"\u263F",color:"#87CEEB",name:{zh:"水星",en:"Mercury",id:"Merkurius"}},
  {id:"Venus",sym:"\u2640",color:"#FFB6C1",name:{zh:"金星",en:"Venus",id:"Venus"}},
  {id:"Mars",sym:"\u2642",color:"#FF6347",name:{zh:"火星",en:"Mars",id:"Mars"}},
  {id:"Jupiter",sym:"\u2643",color:"#FFA500",name:{zh:"木星",en:"Jupiter",id:"Jupiter"}},
  {id:"Saturn",sym:"\u2644",color:"#87CEFA",name:{zh:"土星",en:"Saturn",id:"Saturnus"}},
  {id:"Uranus",sym:"\u2645",color:"#40E0D0",name:{zh:"天王星",en:"Uranus",id:"Uranus"}},
  {id:"Neptune",sym:"\u2646",color:"#6495ED",name:{zh:"海王星",en:"Neptune",id:"Neptunus"}},
  {id:"Pluto",sym:"\u2647",color:"#CD5C5C",name:{zh:"冥王星",en:"Pluto",id:"Pluto"}},
];

function tx(obj: any, lang: string): string {
  if (typeof obj === 'string') return obj;
  return obj?.[lang] || obj?.zh || obj?.en || obj?.id || '';
}

// Transit AI Reading Data
const TRANSIT_READINGS: Record<string, Record<string, Record<string, { title: string; desc: string; advice: string }>>> = {
  Jupiter: {
    zh: {
      Conjunction: { title: "木星合相", desc: "扩张与成长的能量集中，是开启新项目的好时机。", advice: "把握机会，大胆尝试。" },
      Trine: { title: "木星三分相", desc: "好运与支持流动，事情进展顺利。", advice: "顺势而为，分享好运。" },
      Square: { title: "木星四分相", desc: "过度扩张可能带来挑战，需要节制。", advice: "保持谨慎，避免冒进。" },
      Opposition: { title: "木星对分相", desc: "在自我与他人需求之间寻找平衡。", advice: "合作共赢，分享资源。" }},
    en: {
      Conjunction: { title: "Jupiter Conjunction", desc: "Energy of expansion and growth is concentrated, good time to start new projects.", advice: "Seize opportunities, be bold." },
      Trine: { title: "Jupiter Trine", desc: "Good fortune and support flow smoothly.", advice: "Go with the flow, share your luck." },
      Square: { title: "Jupiter Square", desc: "Over-expansion may bring challenges, need moderation.", advice: "Stay cautious, avoid rushing." },
      Opposition: { title: "Jupiter Opposition", desc: "Find balance between self and others' needs.", advice: "Cooperate and share resources." }},
    id: {
      Conjunction: { title: "Konjungsi Jupiter", desc: "Energi ekspansi dan pertumbuhan terkonsentrasi, waktu baik untuk memulai proyek baru.", advice: "Manfaatkan kesempatan, berani mencoba." },
      Trine: { title: "Trine Jupiter", desc: "Keberuntungan dan dukungan mengalir lancar.", advice: "Ikuti arus, bagikan keberuntungan Anda." },
      Square: { title: "Square Jupiter", desc: "Ekspansi berlebihan mungkin membawa tantangan, perlu moderasi.", advice: "Tetap hati-hati, hindari tergesa-gesa." },
      Opposition: { title: "Oposisi Jupiter", desc: "Temukan keseimbangan antara diri sendiri dan kebutuhan orang lain.", advice: "Bekerja sama dan berbagi sumber daya." }}},
  Saturn: {
    zh: {
      Conjunction: { title: "土星合相", desc: "责任与考验的时期，需要脚踏实地。", advice: "承担责任，稳步前进。" },
      Trine: { title: "土星三分相", desc: "努力得到认可，结构稳固。", advice: "巩固成果，长期规划。" },
      Square: { title: "土星四分相", desc: "面临阻碍与挑战，需要耐心克服。", advice: "坚持不懈，学习功课。" },
      Opposition: { title: "土星对分相", desc: "在责任与自由之间寻找平衡。", advice: "面对现实，成熟应对。" }},
    en: {
      Conjunction: { title: "Saturn Conjunction", desc: "Period of responsibility and testing, need to be grounded.", advice: "Take responsibility, move steadily." },
      Trine: { title: "Saturn Trine", desc: "Efforts recognized, structure is solid.", advice: "Consolidate gains, plan long-term." },
      Square: { title: "Saturn Square", desc: "Facing obstacles and challenges, need patience.", advice: "Persevere, learn the lesson." },
      Opposition: { title: "Saturn Opposition", desc: "Find balance between responsibility and freedom.", advice: "Face reality, respond maturely." }},
    id: {
      Conjunction: { title: "Konjungsi Saturnus", desc: "Periode tanggung jawab dan pengujian, perlu berpijak pada kenyataan.", advice: "Ambil tanggung jawab, maju dengan mantap." },
      Trine: { title: "Trine Saturnus", desc: "Upaya diakui, struktur kokoh.", advice: "Konsolidasikan hasil, rencanakan jangka panjang." },
      Square: { title: "Square Saturnus", desc: "Menghadapi rintangan dan tantangan, perlu kesabaran.", advice: "Bertahan, pelajari pelajarannya." },
      Opposition: { title: "Oposisi Saturnus", desc: "Temukan keseimbangan antara tanggung jawab dan kebebasan.", advice: "Hadapi kenyataan, tanggap dengan dewasa." }}}};

export default function TransitPage() {
  const { language } = useLanguage();
  const { charts, loaded } = useChartStorage();
  
  const [bYear, setBYear] = useState(1990);
  const [bMonth, setBMonth] = useState(6);
  const [bDay, setBDay] = useState(15);
  const [bHour, setBHour] = useState(12);
  const [bMinute, setBMinute] = useState(0);
  const [bCityId, setBCityId] = useState('jakarta');
  const [cityName, setCityName] = useState('');
  
  const [cityQuery, setCityQuery] = useState('');
  const [cityResults, setCityResults] = useState<any[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);
  
  const [tYear, setTYear] = useState(new Date().getFullYear());
  const [tMonth, setTMonth] = useState(new Date().getMonth() + 1);
  const [tDay, setTDay] = useState(new Date().getDate());
  
  const [chart, setChart] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aspectFilter, setAspectFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'overlay' | 'separate'>('overlay');
  const [activeTab, setActiveTab] = useState<'chart' | 'ai'>('chart');
  const [openFaq, setOpenFaq] = useState<number>(-1);
  const [faq, setFaq] = useState(0);
  
  // AI Reading unlock state
  const [shareCount, setShareCount] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  const bCity = ALL_CITIES.find((c: any) => c.id === bCityId) || ALL_CITIES[0];
  
  // Load unlock state
  useEffect(() => {
    try {
      const saved = localStorage.getItem('transit_ai_unlock');
      if (saved) {
        const s = JSON.parse(saved);
        if (s.shareCount) setShareCount(s.shareCount);
        if (s.isUnlocked) setIsUnlocked(true);
      }
    } catch {}
  }, []);
  
  const saveUnlockState = (updates: any) => {
    try {
      const current = JSON.parse(localStorage.getItem('transit_ai_unlock') || '{}');
      localStorage.setItem('transit_ai_unlock', JSON.stringify({ ...current, ...updates }));
    } catch {}
  };
  
  // WhatsApp share handler
  const handleShare = () => {
    const shareText = language === 'zh' 
      ? `我刚刚用星缘查看了我的行星推运，快来试试！https://lunaxstar.com/transits`
      : language === 'id' 
      ? `Saya baru saja melihat transit planet saya di Xingyuan, coba juga! https://lunaxstar.com/transits`
      : `I just checked my planetary transits on Starry Fate, come try it! https://lunaxstar.com/transits`;
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

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const searchCities = useCallback(async (query: string) => {
    if (query.length < 2) { setCityResults(ALL_CITIES.slice(0, 8)); return; }
    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=8`);
      const data = await response.json();
      const results = data.map((item: any) => ({
        id: item.place_id,
        name: item.name || item.display_name?.split(',')[0],
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        tz: Math.round(parseFloat(item.lon) / 15)}));
      setCityResults(results);
    } catch {
      setCityResults(ALL_CITIES.filter(c => tx(c.name, language).toLowerCase().includes(query.toLowerCase())).slice(0, 8));
    } finally {
      setIsSearching(false);
    }
  }, [language]);

  const selectCity = (city: any) => {
    setBCityId(city.id || 'custom');
    setCityName(typeof city.name === 'object' ? (city.name[language] || city.name.zh || city.name.en) : city.name);
    setCityQuery(typeof city.name === 'object' ? (city.name[language] || city.name.zh || city.name.en) : city.name);
    setShowCityDropdown(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => { if (showCityDropdown) searchCities(cityQuery); }, 300);
    return () => clearTimeout(timer);
  }, [cityQuery, showCityDropdown, searchCities]);

  const loadSavedChart = (saved: any) => {
    setBYear(saved.birthData.year);
    setBMonth(saved.birthData.month);
    setBDay(saved.birthData.day);
    setBHour(saved.birthData.hour);
    setBMinute(saved.birthData.minute);
    setCityName(saved.birthData.cityName);
    setCityQuery(saved.birthData.cityName);
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/chart/transit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'transit',
          birthData: { year: bYear, month: bMonth, day: bDay, hour: bHour, minute: bMinute, lat: bCity.lat, lng: bCity.lng, tz: bCity.tz },
          transitDate: { year: tYear, month: tMonth, day: tDay, hour: 12, minute: 0 },
          houseSystem: 'E'})});
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setChart(data);
    } catch (e: any) {
      setError(e.message || 'Calculation failed');
    } finally {
      setLoading(false);
    }
  };

  const filteredAspects = chart?.transit?.aspects?.filter((a: any) => {
    if (aspectFilter === 'major') return ['Conjunction', 'Square', 'Trine', 'Opposition'].includes(a.type);
    if (aspectFilter === 'exact') return a.orb < 3;
    return true;
  }) || [];

  const getSign = (lon: number) => {
    const signsCN = ['白羊','金牛','双子','巨蟹','狮子','处女','天秤','天蝎','射手','摩羯','水瓶','双鱼'];
    const idx = Math.floor((lon % 360) / 30);
    return language === 'zh' ? signsCN[idx] : ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'][idx];
  };

  // FAQ Data
  const faqs = [
    {
      q: { zh: "什么是行星推运？", en: "What is planetary transit?", id: "Apa itu transit planet?" },
      a: {
        zh: "行星推运是指天空中运行的行星与你出生时本命盘中的行星或轴点形成的相位关系。通过分析这些相位，可以预测不同时期运势的变化和重要转折点。",
        en: "Planetary transit refers to the aspects formed between the moving planets in the sky and the planets or points in your natal chart. By analyzing these aspects, you can predict changes in fortune and important turning points during different periods.",
        id: "Transit planet mengacu pada aspek yang terbentuk antara planet yang bergerak di langit dan planet atau titik dalam grafik natal Anda. Dengan menganalisis aspek ini, Anda dapat memprediksi perubahan keberuntungan dan titik balik penting selama periode berbeda."
      }
    },
    {
      q: { zh: "推运分析能告诉我什么？", en: "What can transit analysis tell me?", id: "Apa yang bisa diberitahu oleh analisis transit?" },
      a: {
        zh: "推运分析可以揭示当前和未来一段时间内，哪些领域会受到影响、机遇和挑战何时出现、如何把握好运时机、以及需要注意哪些问题。它帮助你更好地规划人生重大决策。",
        en: "Transit analysis can reveal which areas will be affected in the current and future periods, when opportunities and challenges will appear, how to seize lucky moments, and what issues to watch for. It helps you better plan major life decisions.",
        id: "Analisis transit dapat mengungkap area mana yang akan terpengaruh dalam periode saat ini dan masa depan, kapan peluang dan tantangan akan muncul, bagaimana memanfaatkan momen beruntung, dan masalah apa yang harus diwaspadai."
      }
    },
    {
      q: { zh: "哪些推运相位最重要？", en: "Which transit aspects are most important?", id: "Aspek transit mana yang paling penting?" },
      a: {
        zh: "最重要的推运相位包括：外行星（木星、土星、天王星、海王星、冥王星）与本命太阳、月亮、上升点的相位；精确度高的相位（容许度小于3度）；以及形成主要相位类型（合相、四分相、三分相、对分相）的相位。",
        en: "The most important transit aspects include: outer planets (Jupiter, Saturn, Uranus, Neptune, Pluto) aspecting natal Sun, Moon, or Ascendant; tight aspects (orb less than 3 degrees); and aspects forming major aspect types (conjunction, square, trine, opposition).",
        id: "Aspek transit terpenting termasuk: planet luar (Jupiter, Saturnus, Uranus, Neptunus, Pluto) membentuk aspek dengan Matahari, Bulan, atau Ascendant natal; aspek ketat (orb kurang dari 3 derajat); dan aspek yang membentuk jenis aspek utama."
      }
    },
    {
      q: { zh: "推运的影响持续多久？", en: "How long do transit effects last?", id: "Berapa lama efek transit berlangsung?" },
      a: {
        zh: "不同行星的推运影响时长不同：月亮推运仅持续数小时，水星金星约数天，火星约数周，木星约一年，土星约两年半，而天王星、海王星、冥王星的影响可持续数年甚至十几年。",
        en: "Different planets have different transit durations: Moon transits last only hours, Mercury and Venus about days, Mars about weeks, Jupiter about a year, Saturn about two and a half years, while Uranus, Neptune, and Pluto can affect for years or even decades.",
        id: "Planet berbeda memiliki durasi transit berbeda: transit Bulan hanya berlangsung beberapa jam, Merkurius dan Venus sekitar hari, Mars sekitar minggu, Jupiter sekitar setahun, Saturnus sekitar dua setengah tahun."
      }
    },
    {
      q: { zh: "如何利用推运信息改善生活？", en: "How to use transit information to improve life?", id: "Bagaimana menggunakan informasi transit untuk meningkatkan kehidupan?" },
      a: {
        zh: "建议在木星有利推运时开展新项目、扩展事业；在土星推运期间踏实工作、巩固成果；在火星推运时积极行动但避免冲动；在水星逆行推运时谨慎签约和沟通。顺势而为，事半功倍。",
        en: "It's recommended to start new projects and expand career during favorable Jupiter transits; work steadily and consolidate gains during Saturn transits; act actively but avoid impulsiveness during Mars transits; be cautious with contracts and communication during Mercury retrograde transits.",
        id: "Disarankan untuk memulai proyek baru dan memperluas karir selama transit Jupiter yang menguntungkan; bekerja dengan mantap dan konsolidasikan hasil selama transit Saturnus; bertindak aktif tapi hindari impulsif selama transit Mars."
      }
    }
  ];
  return (
    <div className="min-h-screen bg-white text-[#171717]">
      

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500/20 rounded-full text-sm text-gray-300 mb-4">
            <Search size={16} />
            {language === 'zh' ? '推运分析' : 'Transit Analysis'}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'zh' ? '🔮 行星推运分析' : '🔮 Planetary Transit'}
          </h1>
          <p className="text-gray-500">
            {language === 'zh' ? '查看推运行星与本命盘的相位关系' : 'View transit planets and their aspects to your natal chart'}
          </p>
        </div>

        {/* Saved Charts */}
        {loaded && charts.length > 0 && (
          <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 mb-6">
            <h3 className="text-sm font-bold text-gray-700 mb-3">{language === 'zh' ? '加载已保存的星盘' : 'Load Saved Chart'}</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {charts.map((sc: any) => (
                <button key={sc.id} onClick={() => loadSavedChart(sc)} className="flex-shrink-0 p-3 rounded-xl bg-white/80 border border-gray-200 hover:border-gray-500/50 text-left min-w-[140px]">
                  <div className="text-xs text-gray-900 font-medium truncate">{sc.name}</div>
                  <div className="text-xs text-gray-500">{sc.birthData.year}-{sc.birthData.month}-{sc.birthData.day}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-300 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Birth Data */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star size={16} className="text-gray-400"/>
                {language === 'zh' ? '出生信息' : 'Birth Data'}
              </h3>
              <div className="space-y-3">
                <div ref={cityRef}>
                  <label className="text-xs text-gray-500 mb-1 block">{language === 'zh' ? '出生城市' : 'Birth City'}</label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
                    <input type="text" value={cityQuery} onChange={e => { setCityQuery(e.target.value); setShowCityDropdown(true); }}
                      onFocus={() => setShowCityDropdown(true)} placeholder={language === 'zh' ? '搜索城市...' : 'Search city...'}
                      className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm"/>
                    {cityQuery && <button onClick={() => { setCityQuery(''); setShowCityDropdown(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"><X size={14}/></button>}
                  </div>
                  {showCityDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                      {isSearching && <div className="px-4 py-3 text-gray-500 text-sm">Searching...</div>}
                      {!isSearching && cityResults.map((city, i) => (
                        <button key={i} onClick={() => selectCity(city)} className="w-full px-4 py-2.5 text-left hover:bg-gray-100 border-b border-gray-200 last:border-0">
                          <div className="text-sm text-gray-900">{typeof city.name === 'object' ? (city.name[language] || city.name.zh || city.name.en) : city.name}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">{language === 'zh' ? '年' : 'Year'}</label>
                    <input type="number" value={bYear} onChange={e => setBYear(+e.target.value)} className="w-full p-2 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">{language === 'zh' ? '月' : 'Month'}</label>
                    <select value={bMonth} onChange={e => setBMonth(+e.target.value)} className="w-full p-2 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm">
                      {Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">{language === 'zh' ? '日' : 'Day'}</label>
                    <select value={bDay} onChange={e => setBDay(+e.target.value)} className="w-full p-2 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm">
                      {Array.from({length: 31}, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">{language === 'zh' ? '时' : 'Hour'}</label>
                    <select value={bHour} onChange={e => setBHour(+e.target.value)} className="w-full p-2 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm">
                      {Array.from({length: 24}, (_, i) => i).map(h => <option key={h} value={h}>{String(h).padStart(2,'0')}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">{language === 'zh' ? '分' : 'Min'}</label>
                    <select value={bMinute} onChange={e => setBMinute(+e.target.value)} className="w-full p-2 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm">
                      {Array.from({length: 12}, (_, i) => i * 5).map(m => <option key={m} value={m}>{String(m).padStart(2,'0')}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Transit Date */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Search size={16} className="text-gray-400"/>
                {language === 'zh' ? '推运日期' : 'Transit Date'}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">{language === 'zh' ? '年' : 'Year'}</label>
                  <input type="number" value={tYear} onChange={e => setTYear(+e.target.value)} className="w-full p-2 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">{language === 'zh' ? '月' : 'Month'}</label>
                  <select value={tMonth} onChange={e => setTMonth(+e.target.value)} className="w-full p-2 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm">
                    {Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">{language === 'zh' ? '日' : 'Day'}</label>
                  <select value={tDay} onChange={e => setTDay(+e.target.value)} className="w-full p-2 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm">
                    {Array.from({length: 31}, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <button onClick={handleCalculate} disabled={loading}
            className="w-full mt-6 py-4 bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-500 hover:to-gray-500 disabled:opacity-50 rounded-xl font-bold text-gray-900 transition-all flex items-center justify-center gap-2">
            {loading ? (language === 'zh' ? '计算中...' : 'Calculating...') : (language === 'zh' ? '查询推运相位' : 'Calculate Transit')}
          </button>
          {error && <div className="mt-3 p-3 rounded-xl bg-gray-500/10 text-gray-400 text-sm">{error}</div>}
        </div>

        {/* Results */}
        {chart && (
          <div className="space-y-6">
            {/* View Mode / Tab Toggle */}
            <div className="flex gap-2 p-1 rounded-xl bg-gray-100 max-w-lg mx-auto">
              <button onClick={() => setActiveTab('chart')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'chart' ? 'bg-gray-600 text-gray-900' : 'text-gray-500'}`}>
                {language === 'zh' ? '星盘' : 'Chart'}
              </button>
              <button onClick={() => setActiveTab('ai')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'ai' ? 'bg-gray-600 text-gray-900' : 'text-gray-500'}`}>
                AI {language === 'zh' ? '解读' : language === 'id' ? 'Bacaan' : 'Reading'}
              </button>
            </div>

            {/* Chart Tab */}
            {activeTab === 'chart' && (
              <>
                {/* View Mode Toggle */}
                <div className="flex gap-2 p-1 rounded-xl bg-gray-100 max-w-md mx-auto">
                  <button onClick={() => setViewMode('overlay')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'overlay' ? 'bg-gray-600 text-gray-900' : 'text-gray-500'}`}>
                    {language === 'zh' ? '叠加显示' : 'Overlay'}
                  </button>
                  <button onClick={() => setViewMode('separate')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'separate' ? 'bg-gray-600 text-gray-900' : 'text-gray-500'}`}>
                    {language === 'zh' ? '分开显示' : 'Separate'}
                  </button>
                </div>
                
                {/* Chart Display */}
                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-300">
                  <div className="flex justify-center">
                    {viewMode === 'overlay' && chart.transit ? (
                      <TransitOverlay 
                        natalPlanets={chart.natal.planets} 
                        transitPlanets={chart.transit.planets}
                        natalHouses={chart.natal.houses}
                        aspects={chart.transit.aspects}
                        size={450}
                      />
                    ) : (
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-center text-sm text-gray-500 mb-4">{language === 'zh' ? '本命盘' : 'Natal Chart'}</h4>
                          <ProfessionalNatalChart planets={chart.natal.planets} houses={chart.natal.houses} aspects={chart.natal.aspects} size={350}/>
                        </div>
                        {chart.transit && (
                          <div>
                            <h4 className="text-center text-sm text-gray-500 mb-4">{language === 'zh' ? '推运盘' : 'Transit'} ({tYear}-{tMonth}-{tDay})</h4>
                            <ProfessionalNatalChart planets={chart.transit.planets} houses={chart.natal.houses} aspects={[]} size={350}/>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Transit Aspects - Only show in chart tab */}
            {activeTab === 'chart' && chart.transit?.aspects && (
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">{language === 'zh' ? '推运相位' : 'Transit Aspects'}</h3>
                  <div className="flex gap-2">
                    {['all','major','exact'].map(f => (
                      <button key={f} onClick={() => setAspectFilter(f)} className={`px-3 py-1 rounded-full text-xs ${aspectFilter === f ? 'bg-gray-600 text-gray-900' : 'bg-white text-gray-500'}`}>
                        {f === 'all' ? (language === 'zh' ? '全部' : 'All') : f === 'major' ? (language === 'zh' ? '主要' : 'Major') : (language === 'zh' ? '精确' : 'Exact')}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredAspects.slice(0, 15).map((asp: any, i: number) => {
                    const tCfg = PC.find((c: any) => c.id === asp.transitPlanet);
                    const nCfg = PC.find((c: any) => c.id === asp.natalPlanet);
                    const colors: Record<string,string> = {Conjunction:'#FFD700',Sextile:'#00FF88',Square:'#FF4444',Trine:'#4488FF',Opposition:'#FF8800'};
                    return (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-100">
                        <div className="flex items-center gap-2">
                          <span style={{color:tCfg?.color}}>{tCfg?.sym}</span>
                          <span className="text-gray-500">→</span>
                          <span style={{color:nCfg?.color}}>{nCfg?.sym}</span>
                        </div>
                        <span style={{color:colors[asp.type]}} className="font-bold">{asp.type}</span>
                        <span className="text-gray-500 text-sm">{asp.orb.toFixed(1)}°</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* AI Reading Tab */}
            {activeTab === 'ai' && (
              <div className="space-y-6">
                {/* Free Simple Reading */}
                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-300">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Sparkles size={18} className="text-gray-600" />
                    {language === 'zh' ? '简要推运解读' : language === 'id' ? 'Bacaan Transit Ringkas' : 'Simple Transit Reading'}
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400 text-xs">{language === 'zh' ? '免费' : language === 'id' ? 'Gratis' : 'Free'}</span>
                  </h3>
                  <div className="space-y-4">
                    {filteredAspects.slice(0, 3).map((asp: any, i: number) => {
                      const reading = (TRANSIT_READINGS as any)[asp.transitPlanet]?.[language]?.[asp.type];
                      if (!reading) return null;
                      const tCfg = PC.find((c: any) => c.id === asp.transitPlanet);
                      const nCfg = PC.find((c: any) => c.id === asp.natalPlanet);
                      return (
                        <div key={i} className="p-4 rounded-xl bg-gray-500/10 border border-gray-500/20">
                          <h4 className="font-bold mb-2 flex items-center gap-2 text-gray-400">
                            <span style={{color:tCfg?.color}}>{tCfg?.sym}</span>
                            {reading.title} → <span style={{color:nCfg?.color}}>{nCfg?.sym}</span> {nCfg?.name?.[language] || nCfg?.id}
                          </h4>
                          <p className="text-gray-600 text-sm mb-2">{reading.desc}</p>
                          <p className="text-xs text-gray-500 italic">💡 {reading.advice}</p>
                        </div>
                      );
                    })}
                    {filteredAspects.length === 0 && (
                      <p className="text-center text-gray-400 py-8">{language === 'zh' ? '暂无主要相位' : language === 'id' ? 'Tidak ada aspek utama' : 'No major aspects'}</p>
                    )}
                  </div>
                </div>
                
                {/* Deep Reading with Unlock */}
                <div className="rounded-2xl overflow-hidden border border-gray-300">
                  {/* Header */}
                  <div className="p-5 bg-gradient-to-r from-gray-50/40 to-gray-50/40 flex items-center justify-between">
                    <h3 className="font-bold flex items-center gap-2">
                      {isUnlocked ? <Sparkles size={18} className="text-gray-400" /> : <Lock size={18} className="text-gray-500" />}
                      {language === 'zh' ? '深度推运解读' : language === 'id' ? 'Bacaan Transit Mendalam' : 'Deep Transit Reading'}
                    </h3>
                    {isUnlocked && <span className="text-xs text-gray-400 flex items-center gap-1"><CheckCircle size={14} />{language === 'zh' ? '已解锁' : language === 'id' ? 'Terbuka' : 'Unlocked'}</span>}
                  </div>
                  
                  {/* Unlocked Content */}
                  {isUnlocked ? (
                    <div className="p-5 space-y-4 bg-gray-50">
                      {filteredAspects.slice(3, 8).map((asp: any, i: number) => {
                        const reading = (TRANSIT_READINGS as any)[asp.transitPlanet]?.[language]?.[asp.type];
                        if (!reading) return null;
                        const tCfg = PC.find((c: any) => c.id === asp.transitPlanet);
                        const nCfg = PC.find((c: any) => c.id === asp.natalPlanet);
                        return (
                          <div key={i} className="p-4 rounded-xl bg-gray-500/10 border border-gray-200">
                            <h4 className="font-bold mb-2 flex items-center gap-2 text-gray-400">
                              <span style={{color:tCfg?.color}}>{tCfg?.sym}</span>
                              {reading.title} → <span style={{color:nCfg?.color}}>{nCfg?.sym}</span>
                            </h4>
                            <p className="text-gray-600 text-sm">{reading.desc}</p>
                          </div>
                        );
                      })}
                      <div className="p-4 rounded-xl bg-gray-500/10 border border-gray-500/20">
                        <h4 className="font-bold mb-2 text-gray-400">{language === 'zh' ? '综合建议' : language === 'id' ? 'Saran Komprehensif' : 'Comprehensive Advice'}</h4>
                        <p className="text-gray-600 text-sm">{language === 'zh' ? '当前推运周期是成长与学习的重要时期，把握木星带来的机遇，同时认真对待土星的考验。' : language === 'id' ? 'Periode transit saat ini adalah waktu penting untuk pertumbuhan dan pembelajaran.' : 'Current transit period is an important time for growth and learning.'}</p>
                      </div>
                    </div>
                  ) : (
                    /* Locked - Share to Unlock */
                    <div className="p-6 space-y-5 bg-gray-50">
                      {/* Blurred Preview */}
                      <div className="relative">
                        <div className="space-y-3 blur-sm pointer-events-none select-none opacity-60">
                          <div className="p-4 rounded-xl bg-white"><div className="h-4 bg-gray-100 rounded w-3/4 mb-2" /><div className="h-3 bg-gray-100 rounded w-full" /></div>
                          <div className="p-4 rounded-xl bg-white"><div className="h-4 bg-gray-100 rounded w-2/3 mb-2" /><div className="h-3 bg-gray-100 rounded w-full" /></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <Lock size={32} className="text-gray-500 mx-auto mb-2" />
                            <p className="text-gray-600 font-medium">{language === 'zh' ? '解锁深度解读' : language === 'id' ? 'Buka Bacaan Mendalam' : 'Unlock Deep Reading'}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* WhatsApp Share */}
                      <div className="p-4 rounded-xl bg-gray-500/10 border border-gray-500/20">
                        <div className="flex items-center gap-3 mb-3">
                          <MessageCircle size={20} className="text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{language === 'zh' ? '分享给3位好友解锁' : language === 'id' ? 'Bagikan ke 3 teman untuk membuka' : 'Share with 3 friends to unlock'}</div>
                          </div>
                        </div>
                        {/* Progress */}
                        <div className="flex gap-2 mb-3">
                          {[1, 2, 3].map(n => (
                            <div key={n} className={`flex-1 h-2 rounded-full transition-all ${shareCount >= n ? "bg-gray-500" : "bg-gray-100"}`} />
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 mb-3">{language === 'zh' ? '分享进度' : language === 'id' ? 'Progres' : 'Progress'}: {shareCount}/3</div>
                        
                        {shareCount < 3 ? (
                          <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3].map(n => (
                              <button key={n} onClick={handleShare} disabled={shareCount >= n}
                                className={`py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${shareCount >= n ? "bg-gray-500/20 text-gray-400 border border-gray-500/30" : "bg-white hover:bg-gray-500/20 text-gray-600 hover:text-gray-300 border border-gray-300"}`}>
                                {shareCount >= n ? <CheckCircle size={12} /> : <Share2 size={12} />}
                                {language === 'zh' ? '好友' : language === 'id' ? 'Teman' : 'Friend'} {n}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-gray-400 font-medium text-sm flex items-center justify-center gap-2">
                            <CheckCircle size={16} />{language === 'zh' ? '分享完成！正在解锁...' : language === 'id' ? 'Berbagi selesai! Membuka...' : 'Sharing complete! Unlocking...'}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SEO Description */}
        <section className="max-w-4xl mx-auto mt-12 mb-8 px-4">
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-500 leading-relaxed">
              {language === 'zh' 
                ? '推运盘（Transit Chart）是占星预测的核心工具。通过将当前行星位置覆盖在本命盘上，了解当下能量影响和未来转折点。'
                : language === 'id'
                ? 'Transit Chart adalah alat inti untuk peramalan astrologi. Dengan menumpangkan posisi planet saat ini ke chart natal Anda, Anda dapat memahami pengaruh energi dan titik balik.'
                : 'The Transit Chart is a core tool for astrological forecasting. Overlay current planetary positions onto your natal chart to understand present energy influences and future turning points.'}
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto mt-16 mb-8">
          <h2 className="text-xl font-semibold text-center mb-6">
            {language === 'zh' ? '常见问题' : language === 'id' ? 'Pertanyaan Umum' : 'FAQ'}
          </h2>
          <div className="space-y-3">
            {[{ q: language==='zh'?'什么是推运盘？':language==='id'?'Apa itu transit chart?':'What is a transit chart?', a: language==='zh'?'推运盘将当前行星位置覆盖在本命盘上，分析当下及未来的运势变化。':language==='id'?'Transit chart menimpakan posisi planet saat ini ke chart natal Anda untuk menganalisis tren saat ini dan masa depan.':'A transit chart overlays current planetary positions onto your natal chart to analyze current and future trends.' },
              { q: language==='zh'?'推运盘准确吗？':language==='id'?'Seberapa akurat?':'How accurate is it?', a: language==='zh'?'准确度取决于出生时间精确度，15分钟内误差依然高度可靠。':language==='id'?'Akurasi tergantung ketepatan waktu kelahiran. Dalam 15 menit masih sangat andal.':'Accuracy depends on birth time precision. Within 15 minutes it remains highly reliable.' },
              { q: language==='zh'?'如何解读推运盘？':language==='id'?'Bagaimana menafsirkan?':'How to interpret transit charts?', a: language==='zh'?'重点关注个人行星与流年行星的相位关系，吉相位带来机遇，凶相位带来成长挑战。':language==='id'?'Fokus pada aspek antara planet personal dan planet transit. Aspek menguntungkan membawa peluang.':'Focus on aspects between personal and transiting planets. Beneficial aspects bring opportunities, challenging ones bring growth.' },
              { q: language==='zh'?'推运盘和本命盘有什么区别？':language==='id'?'Beda dengan bagan natal?':'Difference from natal chart?', a: language==='zh'?'本命盘是出生时的静态星图，推运盘是动态的，展示当下天象对你本命盘的影响。':language==='id'?'Bagan natal adalah bagan statis saat lahir. Transit chart dinamis, menunjukkan pengaruh planet saat ini pada bagan natal Anda.':'Natal chart is your static birth chart. Transit chart is dynamic, showing current planetary influences on your natal chart.' },
              { q: language==='zh'?'为什么要看推运盘？':language==='id'?'Mengapa periksa transit?':'Why check transit charts?', a: language==='zh'?'推运盘帮助把握时机，在最佳时间采取行动，提前了解挑战做好准备。':language==='id'?'Transit chart membantu Anda memanfaatkan waktu, bertindak di momen optimal, dan mempersiapkan tantangan.':'Transit charts help you seize timing, act at optimal moments, and prepare for challenges in advance.' }].map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setFaq(faq === i ? -1 : i)}
                  className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-medium text-gray-900">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${faq === i ? 'rotate-180' : ''}`} />
                </button>
                {faq === i && (
                  <div className="px-4 pb-4 pt-3 bg-white border-t border-gray-100">
                    <p className="text-gray-600 text-sm">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}