"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Heart, Star, ChevronDown, Save, Share2, Download, Sparkles, Loader2 } from 'lucide-react';
import { saveCompositeChart } from '@/lib/firebase';

import ProfessionalNatalChart from '@/components/ProfessionalNatalChart';
import DualChart from '@/components/DualChart';

const ALL_CITIES = [
  {id:"jakarta",name:{zh:"雅加达",en:"Jakarta",id:"Jakarta"},lat:-6.2088,lng:106.8456,tz:7},
  {id:"surabaya",name:{zh:"泗水",en:"Surabaya",id:"Surabaya"},lat:-7.2575,lng:112.7521,tz:7},
  {id:"bandung",name:{zh:"万隆",en:"Bandung",id:"Bandung"},lat:-6.9175,lng:107.6191,tz:7},
  {id:"beijing",name:{zh:"北京",en:"Beijing",id:"Beijing"},lat:39.9042,lng:116.4074,tz:8},
  {id:"shanghai",name:{zh:"上海",en:"Shanghai",id:"Shanghai"},lat:31.2304,lng:121.4737,tz:8},
  {id:"tokyo",name:{zh:"东京",en:"Tokyo",id:"Tokyo"},lat:35.6762,lng:139.6503,tz:9},
  {id:"newyork",name:{zh:"纽约",en:"New York",id:"New York"},lat:40.7128,lng:-74.0060,tz:-5},
  {id:"london",name:{zh:"伦敦",en:"London",id:"London"},lat:51.5074,lng:-0.1278,tz:0},
  {id:"singapore",name:{zh:"新加坡",en:"Singapore",id:"Singapore"},lat:1.3521,lng:103.8198,tz:8},
  {id:"sydney",name:{zh:"悉尼",en:"Sydney",id:"Sydney"},lat:-33.8688,lng:151.2093,tz:10},
];

const HOUSE_SYSTEMS = [
  {id:'P',name:{zh:'普拉西德制',en:'Placidus',id:'Placidus'}},
  {id:'W',name:{zh:'整宫制',en:'Whole Sign',id:'Whole Sign'}},
  {id:'E',name:{zh:'等宫制',en:'Equal',id:'Equal'}},
];

function tx(obj: any, lang: string): string {
  if (typeof obj === 'string') return obj;
  return obj?.[lang] || obj?.en || obj?.zh || obj?.id || '';
}

const LABELS: Record<string, Record<string, string>> = {
  back: { zh: '返回星盘中心', en: 'Back', id: 'Kembali' },
  title: { zh: '💑 双人星盘合盘分析', en: '💑 Dual Natal Chart Analysis', id: '💑 Analisis Bagan Ganda' },
  subtitle: { zh: '组合盘揭示两人关系的核心本质，相位盘展示行星间的互动', en: 'Composite shows relationship essence, Synastry shows planetary interactions', id: 'Komposit menunjukkan esensi hubungan, Sinastri menunjukkan interaksi planet' },
  compositeTab: { zh: '组合盘', en: 'Composite', id: 'Komposit' },
  synastryTab: { zh: '比较盘', en: 'Synastry', id: 'Sinastri' },
  person1: { zh: '第一人', en: 'Person 1', id: 'Orang 1' },
  person2: { zh: '第二人', en: 'Person 2', id: 'Orang 2' },
  namePlaceholder: { zh: '名字（选填）', en: 'Name (optional)', id: 'Nama (opsional)' },
  year: { zh: '年', en: 'Y', id: 'T' },
  month: { zh: '月', en: 'M', id: 'B' },
  day: { zh: '日', en: 'D', id: 'H' },
  hour: { zh: '时', en: 'H', id: 'J' },
  minute: { zh: '分', en: 'M', id: 'M' },
  city: { zh: '出生地', en: 'City', id: 'Kota' },
  houseSystem: { zh: '分宫制', en: 'House System', id: 'Sistem Rumah' },
  calculate: { zh: '计算合盘', en: 'Calculate Synastry', id: 'Hitung Sinastri' },
  compositeTitle: { zh: '组合盘', en: 'Composite Chart', id: 'Bagan Komposit' },
  compositeDesc: { zh: '两人关系的核心星盘，揭示关系的本质与共同主题', en: 'The essential chart of the relationship, revealing its core nature', id: 'Bagan esensial hubungan, mengungkap sifat intinya' },
  synastryTitle: { zh: '比较盘', en: 'Synastry Chart', id: 'Bagan Sinastri' },
  synastryDesc: { zh: '两人行星之间的互动关系，行星落入对方宫位的影响', en: 'Planetary interactions between two charts', id: 'Interaksi planet antara dua bagan' },
  majorAspects: { zh: '主要相位', en: 'Major Aspects', id: 'Aspek Utama' },
  planetaryAspects: { zh: '行星相位', en: 'Planetary Aspects', id: 'Aspek Planet' },
  orb: { zh: '相位容许度', en: 'orb', id: 'orb' },
  faq: { zh: '常见问题', en: 'FAQ', id: 'FAQ' },
  save: { zh: '保存', en: 'Save', id: 'Simpan' },
  saved: { zh: '已保存！', en: 'Saved!', id: 'Tersimpan!' },
  loginFirst: { zh: '请先登录', en: 'Please login first', id: 'Silakan login dulu' },
  aiInterpret: { zh: 'AI 解读', en: 'AI Reading', id: 'AI Bacaan' },
  copyLink: { zh: '复制链接', en: 'Copy Link', id: 'Salin Tautan' },
  linkCopied: { zh: '链接已复制！', en: 'Link copied!', id: 'Tautan disalin!' },
  download: { zh: '下载图片', en: 'Download', id: 'Unduh' },
  badge: { zh: '合盘分析', en: 'Synastry & Composite', id: 'Sinastri & Komposit' }};

function t(key: string, lang: string): string {
  return LABELS[key]?.[lang] || LABELS[key]?.en || key;
}

export default function CompositePage() {
  const { language } = useLanguage();
  const lang = language || "zh";
  const { user } = useAuth();

  // Person 1
  const [p1Name, setP1Name] = useState('');
  const [p1Year, setP1Year] = useState(1990);
  const [p1Month, setP1Month] = useState(6);
  const [p1Day, setP1Day] = useState(15);
  const [p1Hour, setP1Hour] = useState(12);
  const [p1Minute, setP1Minute] = useState(0);
  const [p1CityId, setP1CityId] = useState('jakarta');

  // Person 2
  const [p2Name, setP2Name] = useState('');
  const [p2Year, setP2Year] = useState(1992);
  const [p2Month, setP2Month] = useState(3);
  const [p2Day, setP2Day] = useState(20);
  const [p2Hour, setP2Hour] = useState(10);
  const [p2Minute, setP2Minute] = useState(0);
  const [p2CityId, setP2CityId] = useState('shanghai');

  const [houseSystem, setHouseSystem] = useState('P');
  const [chart, setChart] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'composite' | 'synastry'>('composite');
  const [openFaq, setOpenFaq] = useState<number>(0);

  // New features
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [aiInterpretation, setAiInterpretation] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const chartRef = useRef<HTMLDivElement>(null);

  // Load pending composite chart from profile page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pending = sessionStorage.getItem('pending_composite');
      if (pending) {
        try {
          const data = JSON.parse(pending);
          setP1Name(data.person1Name || '');
          setP1Year(data.person1Data?.year || 1990);
          setP1Month(data.person1Data?.month || 6);
          setP1Day(data.person1Data?.day || 15);
          setP1Hour(data.person1Data?.hour || 12);
          setP1Minute(data.person1Data?.minute || 0);
          setP2Name(data.person2Name || '');
          setP2Year(data.person2Data?.year || 1992);
          setP2Month(data.person2Data?.month || 3);
          setP2Day(data.person2Data?.day || 20);
          setP2Hour(data.person2Data?.hour || 10);
          setP2Minute(data.person2Data?.minute || 0);
          if (data.houseSystem) setHouseSystem(data.houseSystem);
          if (data.chartData) {
            setChart(data.chartData);
          }
          sessionStorage.removeItem('pending_composite');
        } catch (e) {
          console.error('Failed to load composite chart:', e);
        }
      }
    }
  }, []);

  const p1City = ALL_CITIES.find((c: any) => c.id === p1CityId) || ALL_CITIES[0];
  const p2City = ALL_CITIES.find((c: any) => c.id === p2CityId) || ALL_CITIES[0];

  const calculateComposite = async () => {
    setLoading(true);
    setError(null);
    setAiInterpretation(null);
    try {
      const res = await fetch('/api/chart/transit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'composite',
          birthData: { year: p1Year, month: p1Month, day: p1Day, hour: p1Hour, minute: p1Minute, lat: p1City.lat, lng: p1City.lng, tz: p1City.tz },
          birthData2: { year: p2Year, month: p2Month, day: p2Day, hour: p2Hour, minute: p2Minute, lat: p2City.lat, lng: p2City.lng, tz: p2City.tz },
          houseSystem
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setChart(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) { setError(t('loginFirst', language)); return; }
    try {
      await saveCompositeChart(p1Name || 'Person 1', p2Name || 'Person 2',
        { year: p1Year, month: p1Month, day: p1Day, hour: p1Hour, minute: p1Minute, lat: p1City.lat, lng: p1City.lng, tz: p1City.tz },
        { year: p2Year, month: p2Month, day: p2Day, hour: p2Hour, minute: p2Minute, lat: p2City.lat, lng: p2City.lng, tz: p2City.tz },
        chart, houseSystem);
      setSaveMsg(t('saved', language));
      setTimeout(() => setSaveMsg(null), 2000);
    } catch (e: any) { setError(e.message); }
  };

  const handleAIInterpretation = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch('/api/ai-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chartData: chart, language, chartType: 'composite' })
      });
      const data = await res.json();
      setAiInterpretation(data.reading);
    } catch (e: any) { setError(e.message); }
    finally { setLoadingAI(false); }
  };

  const handleShare = async () => {
    const params = new URLSearchParams({
      p1n: p1Name, p1y: String(p1Year), p1m: String(p1Month), p1d: String(p1Day), p1h: String(p1Hour), p1mi: String(p1Minute), p1c: p1CityId,
      p2n: p2Name, p2y: String(p2Year), p2m: String(p2Month), p2d: String(p2Day), p2h: String(p2Hour), p2mi: String(p2Minute), p2c: p2CityId,
      hs: houseSystem
    });
    navigator.clipboard.writeText(`${window.location.origin}/composite?${params.toString()}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!chartRef.current) return;
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(chartRef.current, { backgroundColor: '#f9fafb' });
    const link = document.createElement('a');
    link.download = 'composite-chart.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const FAQ_DATA = [
    { q: '什么是组合盘？', q_en: 'What is a Composite Chart?', q_id: 'Apa itu Bagan Komposit?',
      a: '组合盘是两人星盘的中点星盘，代表关系的独立实体。它揭示这段关系的核心特质、共同主题和潜在发展路径。',
      a_en: 'The Composite Chart is the mid-point chart of both natal charts, representing the relationship as an independent entity. It reveals the core nature, shared themes, and potential development path.',
      a_id: 'Bagan Komposit adalah bagan titik tengah dari kedua bagan lahir, mereasikan hubungan sebagai entitas independen.' },
    { q: '组合盘和比较盘有什么区别？', q_en: 'What is the difference between Composite and Synastry?', q_id: 'Apa perbedaan antara Komposit dan Sinastri?',
      a: '组合盘是两人星盘的中点，代表关系本身；比较盘是两人的行星直接比较，展示行星间的互动和相互影响。',
      a_en: 'Composite is the mid-point chart representing the relationship itself; Synastry compares planets between the two charts, showing planetary interactions.',
      a_id: 'Komposit adalah bagan titik tengah yang mereasikan hubungan itu sendiri; Sinastri membandingkan planet antara dua bagan.' },
    { q: '如何解读相位盘？', q_en: 'How to read the Synastry chart?', q_id: 'Bagaimana membaca bagan Sinastri?',
      a: '关注行星之间的相位：和谐相位（六合、三分相）表示顺利互动；挑战相位（四分相、对分相）表示需要克服的张力。',
      a_en: 'Focus on aspects: harmonious aspects (Sextile, Trine) indicate smooth interactions; challenging aspects (Square, Opposition) indicate tension to work through.',
      a_id: 'Fokus pada aspek: aspek harmonis (Sextile, Trine) menunjukkan interaksi yang halus; aspek menantang (Square, Opposition) menunjukkan ketegangan.' },
    { q: '行星落入宫位代表什么？', q_en: 'What do planets in houses mean?', q_id: 'Apa arti planet di rumah?',
      a: '行星落入的宫位表示关系中该领域的主题。例如金星落入第七宫代表公开关系和婚姻承诺。',
      a_en: 'The house where a planet falls indicates the area of life this relationship influences. For example, Venus in the 7th house indicates a public relationship and marriage commitment.',
      a_id: 'Rumah tempat planet berada menunjukkan area kehidupan yang dipengaruhi hubungan ini.' },
    { q: '为什么需要准确的出生时间？', q_en: 'Why do we need accurate birth time?', q_id: 'Mengapa kita membutuhkan waktu lahir yang akurat?',
      a: '出生时间影响上升星座和宫位的计算，直接关系到行星落入的宫位。几分钟的误差可能导致行星进入不同宫位。',
      a_en: 'Birth time affects the calculation of Ascendant and houses, directly affecting which house planets fall in. A few minutes difference can cause planets to fall in different houses.',
      a_id: 'Waktu lahir mempengaruhi perhitungan Ascendant dan rumah, langsung mempengaruhi planet mana yang jatuh di rumah tertentu.' },
  ];

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500/20 rounded-full text-sm text-gray-300 mb-4">
            <Heart size={16} />
            {t('badge', language)}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title', language)}</h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">{t('subtitle', language)}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 rounded-xl bg-gray-100 max-w-md mx-auto mb-8">
          <button onClick={() => setActiveTab('composite')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'composite' ? 'bg-gray-500 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            {t('compositeTab', language)}
          </button>
          <button onClick={() => setActiveTab('synastry')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'synastry' ? 'bg-gray-500 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            {t('synastryTab', language)}
          </button>
        </div>

        {/* Two Person Input */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Person 1 */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-900/30 to-gray-50/50 border border-gray-500/30">
            <h2 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2">
              <Users size={18} />
              {t('person1', language)} {p1Name && `- ${p1Name}`}
            </h2>
            <div className="mb-3">
              <input type="text" value={p1Name} onChange={e => setP1Name(e.target.value)} placeholder={t('namePlaceholder', language)} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm placeholder:text-gray-400"/>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">{t('year', language)}</label>
                <input type="number" value={p1Year} onChange={e => setP1Year(parseInt(e.target.value))} className="w-full px-2 py-1.5 rounded bg-white border border-gray-300 text-gray-900 text-sm"/>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">{t('month', language)}</label>
                <select value={p1Month} onChange={e => setP1Month(parseInt(e.target.value))} className="w-full px-2 py-1.5 rounded bg-white border border-gray-300 text-gray-900 text-sm">
                  {Array.from({length:12},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">{t('day', language)}</label>
                <select value={p1Day} onChange={e => setP1Day(parseInt(e.target.value))} className="w-full px-2 py-1.5 rounded bg-white border border-gray-300 text-gray-900 text-sm">
                  {Array.from({length:31},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">{t('hour', language)}</label>
                <select value={p1Hour} onChange={e => setP1Hour(parseInt(e.target.value))} className="w-full px-2 py-1.5 rounded bg-white border border-gray-300 text-gray-900 text-sm">
                  {Array.from({length:24},(_,i)=><option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">{t('minute', language)}</label>
                <select value={p1Minute} onChange={e => setP1Minute(parseInt(e.target.value))} className="w-full px-2 py-1.5 rounded bg-white border border-gray-300 text-gray-900 text-sm">
                  {Array.from({length:12},(_,i)=><option key={i*5} value={i*5}>{i*5}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">{t('city', language)}</label>
              <select value={p1CityId} onChange={e => setP1CityId(e.target.value)} className="w-full px-2 py-1.5 rounded bg-white border border-gray-300 text-gray-900 text-sm">
                {ALL_CITIES.map(c => <option key={c.id} value={c.id}>{tx(c.name,language)}</option>)}
              </select>
            </div>
          </div>

          {/* Person 2 */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-900/30 to-gray-50/50 border border-gray-500/30">
            <h2 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2">
              <Users size={18} />
              {t('person2', language)} {p2Name && `- ${p2Name}`}
            </h2>
            <div className="mb-3">
              <input type="text" value={p2Name} onChange={e => setP2Name(e.target.value)} placeholder={t('namePlaceholder', language)} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm placeholder:text-gray-400"/>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">{t('year', language)}</label>
                <input type="number" value={p2Year} onChange={e => setP2Year(parseInt(e.target.value))} className="w-full px-2 py-1.5 rounded bg-white border border-gray-300 text-gray-900 text-sm"/>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">{t('month', language)}</label>
                <select value={p2Month} onChange={e => setP2Month(parseInt(e.target.value))} className="w-full px-2 py-1.5 rounded bg-white border border-gray-300 text-gray-900 text-sm">
                  {Array.from({length:12},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">{t('day', language)}</label>
                <select value={p2Day} onChange={e => setP2Day(parseInt(e.target.value))} className="w-full px-2 py-1.5 rounded bg-white border border-gray-300 text-gray-900 text-sm">
                  {Array.from({length:31},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">{t('hour', language)}</label>
                <select value={p2Hour} onChange={e => setP2Hour(parseInt(e.target.value))} className="w-full px-2 py-1.5 rounded bg-white border border-gray-300 text-gray-900 text-sm">
                  {Array.from({length:24},(_,i)=><option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">{t('minute', language)}</label>
                <select value={p2Minute} onChange={e => setP2Minute(parseInt(e.target.value))} className="w-full px-2 py-1.5 rounded bg-white border border-gray-300 text-gray-900 text-sm">
                  {Array.from({length:12},(_,i)=><option key={i*5} value={i*5}>{i*5}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">{t('city', language)}</label>
              <select value={p2CityId} onChange={e => setP2CityId(e.target.value)} className="w-full px-2 py-1.5 rounded bg-white border border-gray-300 text-gray-900 text-sm">
                {ALL_CITIES.map(c => <option key={c.id} value={c.id}>{tx(c.name,language)}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="flex justify-center gap-4 mb-6">
          <div>
            <label className="text-xs text-gray-500 block mb-1">{t('houseSystem', language)}</label>
            <select value={houseSystem} onChange={e => setHouseSystem(e.target.value)} className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm">
              {HOUSE_SYSTEMS.map(h => <option key={h.id} value={h.id}>{tx(h.name,language)}</option>)}
            </select>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="text-center mb-8">
          <button onClick={calculateComposite} disabled={loading} className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-500 hover:to-gray-500 disabled:opacity-50 rounded-xl font-bold text-gray-900 transition-all inline-flex items-center gap-2">
            {loading ? <><Loader2 size={18} className="animate-spin" />{t('calculate', language)}...</> : <><Heart size={18} />{t('calculate', language)}</>}
          </button>
          {error && <div className="mt-4 p-3 rounded-lg bg-gray-500/20 text-gray-300 text-sm max-w-md mx-auto">{error}</div>}
        </div>

        {/* Results */}
        {chart && (
          <div className="space-y-8">
            {activeTab === 'composite' && chart.composite && (
              <>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                    <Star size={24} className="text-gray-600"/>
                    {t('compositeTitle', language)}
                  </h2>
                  <p className="text-gray-500 text-sm">{t('compositeDesc', language)}</p>
                </div>

                <div ref={chartRef} className="flex justify-center max-w-4xl mx-auto">
                  <ProfessionalNatalChart
                    planets={chart.composite.planets}
                    houses={chart.composite.houses}
                    aspects={chart.composite.aspects}
                    size={450}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-3">
                  {user && (
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-gray-600/80 hover:bg-gray-500 text-gray-900 text-sm inline-flex items-center gap-2 transition-colors">
                      <Save size={16} />{saveMsg || t('save', language)}
                    </button>
                  )}
                  <button onClick={handleAIInterpretation} disabled={loadingAI} className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-500 hover:to-gray-500 text-gray-900 text-sm inline-flex items-center gap-2 transition-colors disabled:opacity-50">
                    {loadingAI ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}{t('aiInterpret', language)}
                  </button>
                  <button onClick={handleShare} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-600 text-gray-900 text-sm inline-flex items-center gap-2 transition-colors">
                    <Share2 size={16} />{linkCopied ? t('linkCopied', language) : t('copyLink', language)}
                  </button>
                  <button onClick={handleDownload} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-600 text-gray-900 text-sm inline-flex items-center gap-2 transition-colors">
                    <Download size={16} />{t('download', language)}
                  </button>
                </div>

                {/* AI Interpretation Card */}
                {aiInterpretation && (
                  <div className="max-w-4xl mx-auto p-6 rounded-2xl bg-gradient-to-br from-gray-900/40 to-gray-900/30 border border-gray-500/30">
                    <h3 className="font-bold text-gray-300 mb-3 flex items-center gap-2">
                      <Sparkles size={18} />{t('aiInterpret', language)}
                    </h3>
                    <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{aiInterpretation}</div>
                  </div>
                )}

                {/* Composite Aspects */}
                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4">{t('majorAspects', language)}</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {chart.composite.aspects.filter((a: any) => ['Conjunction','Trine','Square','Opposition'].includes(a.type)).slice(0,8).map((a: any, i: number) => {
                      const colors: Record<string,string> = {Conjunction:'#FFD700',Trine:'#4488FF',Square:'#FF4444',Opposition:'#FF8800'};
                      return (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-100 border border-gray-200">
                          <span className="text-gray-900">{a.planet1} <span style={{color:colors[a.type]}}>{a.type}</span> {a.planet2}</span>
                          <span className="text-gray-500 text-sm">{a.orb.toFixed(1)}°</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'synastry' && (
              <>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                    <Heart size={24} className="text-gray-400"/>
                    {t('synastryTitle', language)}
                  </h2>
                  <p className="text-gray-500 text-sm">{t('synastryDesc', language)}</p>
                </div>

                <div className="flex justify-center max-w-4xl mx-auto">
                  <DualChart
                    planets1={chart.composite.person1.planets}
                    planets2={chart.composite.person2.planets}
                    houses1={chart.composite.person1.planets}
                    houses2={chart.composite.person2.planets}
                    size={450}
                  />
                </div>

                {/* Synastry Aspects */}
                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4">{t('planetaryAspects', language)}</h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {chart.composite.aspects.slice(0,15).map((a: any, i: number) => {
                      const colors: Record<string,string> = {Conjunction:'#FFD700',Trine:'#4488FF',Square:'#FF4444',Opposition:'#FF8800',Sextile:'#00FF88'};
                      const isGood = ['Trine','Sextile'].includes(a.type);
                      return (
                        <div key={i} className={`p-3 rounded-lg ${isGood ? 'bg-gray-50 border border-gray-500/20' : 'bg-gray-100 border border-gray-200'}`}>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-900">
                              <span className="text-gray-300">{a.planet1}</span>
                              <span className="text-gray-500 mx-2">→</span>
                              <span className="text-gray-300">{a.planet2}</span>
                            </span>
                            <span className="font-bold" style={{color: colors[a.type]}}>{a.type}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {a.orb.toFixed(1)}° {t('orb', language)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}


        {/* Action Buttons */}
        {chart && (
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {user && (
              <button onClick={handleSave} className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-500 hover:to-gray-500 rounded-xl font-bold text-gray-900 transition-all inline-flex items-center gap-2">
                <Save size={18} />
                {language === 'zh' ? '保存合盘':lang==='zh'?'保存合盘':lang==='en'?'Save Chart':lang==='id'?'Simpan Bagan':lang==='th'?'บันทึกแผนภูมิ':lang==='vi'?'Lưu bản đồ':lang==='ms'?'Simpan Carta':lang==='ja'?'チャート保存':lang==='ko'?'차트 저장':'Save Chart'}
              </button>
            )}
            <button onClick={handleAIInterpretation} disabled={loadingAI} className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-500 hover:to-gray-500 disabled:opacity-50 rounded-xl font-bold text-gray-900 transition-all inline-flex items-center gap-2">
              <Sparkles size={18} />
              {loadingAI ? (language === 'zh' ? 'AI解读中...':lang==='zh'?'AI解读中...':lang==='en'?'AI Reading...':lang==='id'?'AI Membaca...':lang==='th'?'กำลังอ่าน...':lang==='vi'?'Đang đọc...':lang==='ms'?'AI Membaca...':lang==='ja'?'AIリーディング中...':lang==='ko'?'AI 읽는 중...':'AI Reading...') : (language === 'zh' ? 'AI 解读':lang==='zh'?'AI 解读':lang==='en'?'AI Reading':lang==='id'?'AI Reading':lang==='th'?'AI อ่าน':lang==='vi'?'AI Đọc':lang==='ms'?'AI Bacaan':lang==='ja'?'AIリーディング':lang==='ko'?'AI 리딩':'AI Reading')}
            </button>
            <button onClick={handleDownload} className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-500 hover:to-gray-500 rounded-xl font-bold text-gray-900 transition-all inline-flex items-center gap-2">
              <Download size={18} />
              {language === 'zh' ? '下载图片':lang==='zh'?'下载图片':lang==='en'?'Download':lang==='id'?'Unduh':lang==='th'?'ดาวน์โหลด':lang==='vi'?'Tải xuống':lang==='ms'?'Muat turun':lang==='ja'?'ダウンロード':lang==='ko'?'다운로드':'Download'}
            </button>
            <button onClick={handleShare} className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-500 hover:to-gray-500 rounded-xl font-bold text-gray-900 transition-all inline-flex items-center gap-2">
              <Share2 size={18} />
              {language === 'zh' ? '分享链接':lang==='zh'?'分享链接':lang==='en'?'Share Link':lang==='id'?'Bagikan Tautan':lang==='th'?'แชร์ลิงก์':lang==='vi'?'Chia sẻ':lang==='ms'?'Kongsi Pautan':lang==='ja'?'リンクを共有':lang==='ko'?'링크 공유':'Share Link'}
            </button>
          </div>
        )}

        {/* Save/Share Message */}
        {saveMsg && (
          <div className="text-center mb-4">
            <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">{saveMsg}</span>
          </div>
        )}

        {/* AI Interpretation Card */}
        {aiInterpretation && (
          <div className="max-w-4xl mx-auto mb-8 p-6 rounded-2xl bg-gradient-to-br from-gray-50/30 to-gray-50/30 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-gray-700" />
              {language === 'zh' ? 'AI 解读' : 'AI Interpretation'}
            </h3>
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">{aiInterpretation}</div>
          </div>
        )}

        {/* Description Section */}
        <section className="max-w-4xl mx-auto mt-12 mb-8 px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-5">
              合盘分析通过比较两人出生星盘，揭示关系的深层动力与潜在挑战。组合盘展现共同能量，比较盘呈现相互影响。
            </div>
            <div className="bg-gray-50 rounded-xl p-5">
              Composite chart analysis compares two natal charts to reveal deep dynamics and potential challenges. Composite shows shared energy, Synastry shows mutual influences.
            </div>
            <div className="bg-gray-50 rounded-xl p-5">
              Analisis bagan komposit membandingkan dua bagan lahir untuk menunjukkan dinamika mendalam dan potensi tantangan. Komposit menunjukkan energi bersama, Sinastri menunjukkan pengaruh mutual.
            </div>
          </div>
        </section>

        {/* SEO Description */}
        <section className="max-w-4xl mx-auto mt-12 mb-8 px-4">
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-500 leading-relaxed">
              {language === 'zh' 
                ? '合盘（Composite Chart）揭示两人关系的灵魂蓝图。计算两人星盘中点，生成代表「关系本身」的星盘，了解深层动力与潜在挑战。'
                : language === 'id'
                ? 'Composite Chart mengungkap cetak biru jiwa sebuah hubungan. Dengan menghitung titik tengah antara dua chart natal, menghasilkan chart yang mewakili hubungan itu sendiri.'
                : 'The Composite Chart reveals the soul blueprint of a relationship by calculating midpoints between two natal charts.'}
            </p>
          </div>
        </section>

{/* FAQ Section */}
        <section className="max-w-4xl mx-auto mb-12 px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('faq', language)}</h2>
          <div className="space-y-3">
            {FAQ_DATA.map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <span className="text-gray-900 text-sm">{language === 'zh' ? item.q : (language === 'en' ? item.q_en : item.q_id)}</span>
                  <ChevronDown size={18} className={`text-gray-700 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}/>
                </button>
                {openFaq === i && (
                  <div className="px-4 py-3 bg-gray-950/30 border-t border-gray-500/10">
                    <p className="text-gray-800 text-sm mb-2">{language === 'zh' ? item.a : (language === 'en' ? item.a_en : item.a_id)}</p>
                    <p className="text-gray-500 text-xs">{language === 'zh' ? item.a_en : item.a_id}</p>
                    <p className="text-gray-400 text-xs">{language === 'zh' ? item.a_id : item.a_en}</p>
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
