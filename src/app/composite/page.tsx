"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ArrowLeft, Users, Heart, Search, Star, ChevronDown } from 'lucide-react';
import NatalChart from '@/components/NatalChart';
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
  return obj?.[lang] || obj?.zh || obj?.en || obj?.id || '';
}

export default function CompositePage() {
  const { language } = useLanguage();
  
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
  const [activeTab, setActiveTab] = useState<'composite'|'synastry'>('composite');
  const [openFaq, setOpenFaq] = useState<number>(0);
  
  const p1City = ALL_CITIES.find((c: any) => c.id === p1CityId) || ALL_CITIES[0];
  const p2City = ALL_CITIES.find((c: any) => c.id === p2CityId) || ALL_CITIES[0];

  const calculateComposite = async () => {
    setLoading(true);
    setError(null);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0f0f23] to-[#020617] text-white">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#020617]/90 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/chart" className="flex items-center gap-2 text-purple-300 hover:text-pink-200 transition-colors">
              <ArrowLeft size={20} />
              <span className="text-sm">{language === 'zh' ? '返回星盘中心' : 'Back'}</span>
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/20 rounded-full text-sm text-pink-300 mb-4">
            <Heart size={16} />
            {language === 'zh' ? '合盘分析' : 'Synastry & Composite'}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {language === 'zh' ? '💑 双人星盘合盘分析' : '💑 Dual Natal Chart Analysis'}
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            {language === 'zh' 
              ? '组合盘揭示两人关系的核心本质，相位盘展示行星间的互动' 
              : 'Composite shows relationship essence, Synastry shows planetary interactions'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 rounded-xl bg-slate-800/50 max-w-md mx-auto mb-8">
          <button onClick={() => setActiveTab('composite')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'composite' ? 'bg-pink-500 text-white' : 'text-slate-400 hover:text-white'}`}>
            {language === 'zh' ? '组合盘' : 'Composite'}
          </button>
          <button onClick={() => setActiveTab('synastry')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'synastry' ? 'bg-pink-500 text-white' : 'text-slate-400 hover:text-white'}`}>
            {language === 'zh' ? '比较盘' : 'Synastry'}
          </button>
        </div>

        {/* Two Person Input */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Person 1 */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-900/30 to-slate-900/50 border border-blue-500/30">
            <h2 className="text-lg font-bold text-blue-300 mb-4 flex items-center gap-2">
              <Users size={18} />
              {language === 'zh' ? '第一人' : 'Person 1'} {p1Name && `- ${p1Name}`}
            </h2>
            
            <div className="mb-3">
              <input type="text" value={p1Name} onChange={e => setP1Name(e.target.value)} placeholder={language === 'zh' ? '名字（选填）' : 'Name (optional)'} className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder:text-slate-500"/>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">{language === 'zh' ? '年' : 'Y'}</label>
                <input type="number" value={p1Year} onChange={e => setP1Year(parseInt(e.target.value))} className="w-full px-2 py-1.5 rounded bg-slate-800 border border-slate-700 text-white text-sm"/>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">{language === 'zh' ? '月' : 'M'}</label>
                <select value={p1Month} onChange={e => setP1Month(parseInt(e.target.value))} className="w-full px-2 py-1.5 rounded bg-slate-800 border border-slate-700 text-white text-sm">
                  {Array.from({length:12},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">{language === 'zh' ? '日' : 'D'}</label>
                <select value={p1Day} onChange={e => setP1Day(parseInt(e.target.value))} className="w-full px-2 py-1.5 rounded bg-slate-800 border border-slate-700 text-white text-sm">
                  {Array.from({length:31},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">{language === 'zh' ? '时' : 'H'}</label>
                <select value={p1Hour} onChange={e => setP1Hour(parseInt(e.target.value))} className="w-full px-2 py-1.5 rounded bg-slate-800 border border-slate-700 text-white text-sm">
                  {Array.from({length:24},(_,i)=><option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">{language === 'zh' ? '分' : 'M'}</label>
                <select value={p1Minute} onChange={e => setP1Minute(parseInt(e.target.value))} className="w-full px-2 py-1.5 rounded bg-slate-800 border border-slate-700 text-white text-sm">
                  {Array.from({length:12},(_,i)=><option key={i*5} value={i*5}>{i*5}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">{language === 'zh' ? '出生地' : 'City'}</label>
              <select value={p1CityId} onChange={e => setP1CityId(e.target.value)} className="w-full px-2 py-1.5 rounded bg-slate-800 border border-slate-700 text-white text-sm">
                {ALL_CITIES.map(c => <option key={c.id} value={c.id}>{tx(c.name,language)}</option>)}
              </select>
            </div>
          </div>

          {/* Person 2 */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-900/30 to-slate-900/50 border border-pink-500/30">
            <h2 className="text-lg font-bold text-pink-300 mb-4 flex items-center gap-2">
              <Users size={18} />
              {language === 'zh' ? '第二人' : 'Person 2'} {p2Name && `- ${p2Name}`}
            </h2>
            
            <div className="mb-3">
              <input type="text" value={p2Name} onChange={e => setP2Name(e.target.value)} placeholder={language === 'zh' ? '名字（选填）' : 'Name (optional)'} className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder:text-slate-500"/>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">{language === 'zh' ? '年' : 'Y'}</label>
                <input type="number" value={p2Year} onChange={e => setP2Year(parseInt(e.target.value))} className="w-full px-2 py-1.5 rounded bg-slate-800 border border-slate-700 text-white text-sm"/>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">{language === 'zh' ? '月' : 'M'}</label>
                <select value={p2Month} onChange={e => setP2Month(parseInt(e.target.value))} className="w-full px-2 py-1.5 rounded bg-slate-800 border border-slate-700 text-white text-sm">
                  {Array.from({length:12},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">{language === 'zh' ? '日' : 'D'}</label>
                <select value={p2Day} onChange={e => setP2Day(parseInt(e.target.value))} className="w-full px-2 py-1.5 rounded bg-slate-800 border border-slate-700 text-white text-sm">
                  {Array.from({length:31},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">{language === 'zh' ? '时' : 'H'}</label>
                <select value={p2Hour} onChange={e => setP2Hour(parseInt(e.target.value))} className="w-full px-2 py-1.5 rounded bg-slate-800 border border-slate-700 text-white text-sm">
                  {Array.from({length:24},(_,i)=><option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">{language === 'zh' ? '分' : 'M'}</label>
                <select value={p2Minute} onChange={e => setP2Minute(parseInt(e.target.value))} className="w-full px-2 py-1.5 rounded bg-slate-800 border border-slate-700 text-white text-sm">
                  {Array.from({length:12},(_,i)=><option key={i*5} value={i*5}>{i*5}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">{language === 'zh' ? '出生地' : 'City'}</label>
              <select value={p2CityId} onChange={e => setP2CityId(e.target.value)} className="w-full px-2 py-1.5 rounded bg-slate-800 border border-slate-700 text-white text-sm">
                {ALL_CITIES.map(c => <option key={c.id} value={c.id}>{tx(c.name,language)}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="flex justify-center gap-4 mb-6">
          <div>
            <label className="text-xs text-slate-400 block mb-1">{language === 'zh' ? '分宫制' : 'House System'}</label>
            <select value={houseSystem} onChange={e => setHouseSystem(e.target.value)} className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm">
              {HOUSE_SYSTEMS.map(h => <option key={h.id} value={h.id}>{tx(h.name,language)}</option>)}
            </select>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="text-center mb-8">
          <button onClick={calculateComposite} disabled={loading} className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:opacity-50 rounded-xl font-bold text-white transition-all inline-flex items-center gap-2">
            <Heart size={18} />
            {loading ? (language === 'zh' ? '计算中...' : 'Calculating...') : (language === 'zh' ? '计算合盘' : 'Calculate Synastry')}
          </button>
          {error && <div className="mt-4 p-3 rounded-lg bg-red-500/20 text-red-300 text-sm max-w-md mx-auto">{error}</div>}
        </div>

        {/* Results */}
        {chart && (
          <div className="space-y-8">
            {activeTab === 'composite' && chart.composite && (
              <>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                    <Star size={24} className="text-amber-400"/>
                    {language === 'zh' ? '组合盘' : 'Composite Chart'}
                  </h2>
                  <p className="text-slate-400 text-sm">{language === 'zh' ? '两人关系的核心星盘，揭示关系的本质与共同主题' : 'The essential chart of the relationship, revealing its core nature'}</p>
                </div>

                <div className="flex justify-center">
                  <NatalChart 
                    planets={chart.composite.planets} 
                    houses={chart.composite.houses} 
                    aspects={chart.composite.aspects}
                    size={450}
                  />
                </div>

                {/* Composite Aspects */}
                <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-700/50">
                  <h3 className="font-bold text-white mb-4">{language === 'zh' ? '主要相位' : 'Major Aspects'}</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {chart.composite.aspects.filter((a: any) => ['Conjunction','Trine','Square','Opposition'].includes(a.type)).slice(0,8).map((a: any, i: number) => {
                      const colors: Record<string,string> = {Conjunction:'#FFD700',Trine:'#4488FF',Square:'#FF4444',Opposition:'#FF8800'};
                      return (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                          <span className="text-white">{a.planet1} <span style={{color:colors[a.type]}}>{a.type}</span> {a.planet2}</span>
                          <span className="text-slate-400 text-sm">{a.orb.toFixed(1)}°</span>
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
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                    <Heart size={24} className="text-pink-400"/>
                    {language === 'zh' ? '比较盘' : 'Synastry Chart'}
                  </h2>
                  <p className="text-slate-400 text-sm">{language === 'zh' ? '两人行星之间的互动关系，行星落入对方宫位的影响' : 'Planetary interactions between two charts'}</p>
                </div>

                <div className="flex justify-center">
                  <DualChart 
                    planets1={chart.composite.person1.planets} 
                    planets2={chart.composite.person2.planets}
                    houses1={chart.composite.person1.planets}
                    houses2={chart.composite.person2.planets}
                    size={450}
                  />
                </div>

                {/* Synastry Aspects */}
                <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-700/50">
                  <h3 className="font-bold text-white mb-4">{language === 'zh' ? '行星相位' : 'Planetary Aspects'}</h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {chart.composite.aspects.slice(0,15).map((a: any, i: number) => {
                      const colors: Record<string,string> = {Conjunction:'#FFD700',Trine:'#4488FF',Square:'#FF4444',Opposition:'#FF8800',Sextile:'#00FF88'};
                      const isGood = ['Trine','Sextile'].includes(a.type);
                      return (
                        <div key={i} className={`p-3 rounded-lg ${isGood ? 'bg-green-900/20 border border-green-500/20' : 'bg-slate-800/50 border border-slate-700/30'}`}>
                          <div className="flex items-center justify-between">
                            <span className="text-white">
                              <span className="text-blue-300">{a.planet1}</span>
                              <span className="text-slate-400 mx-2">→</span>
                              <span className="text-pink-300">{a.planet2}</span>
                            </span>
                            <span className="font-bold" style={{color: colors[a.type]}}>{a.type}</span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {a.orb.toFixed(1)}° {language === 'zh' ? '相位容许度' : 'orb'}
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

        {/* Description Section */}
        <section className="max-w-4xl mx-auto mt-12 mb-8 px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-xl p-5">
              合盘分析通过比较两人出生星盘，揭示关系的深层动力与潜在挑战。组合盘展现共同能量，比较盘呈现相互影响。
            </div>
            <div className="bg-white/5 rounded-xl p-5">
              Composite chart analysis compares two natal charts to reveal deep dynamics and potential challenges. Composite shows shared energy, Synastry shows mutual influences.
            </div>
            <div className="bg-white/5 rounded-xl p-5">
              Analisis bagan komposit membandingkan dua bagan lahir untuk menunjukkan dinamika mendalam dan potensi tantangan. Komposit menunjukkan energi bersama, Sinastri menunjukkan pengaruh mutual.
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto mb-12 px-4">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {language === 'zh' ? '常见问题' : 'FAQ'}
          </h2>
          <div className="space-y-3">
            {[
              { q: '什么是组合盘？', q_en: 'What is a Composite Chart?', q_id: 'Apa itu Bagan Komposit?',
                a: '组合盘是两人星盘的中点星盘，代表关系的独立实体。它揭示这段关系的核心特质、共同主题和潜在发展路径。', 
                a_en: 'The Composite Chart is the mid-point chart of both natal charts, representing the relationship as an independent entity. It reveals the core nature, shared themes, and potential development path.',
                a_id: 'Bagan Komposit adalah bagan titik tengah dari kedua bagan lahir, mereasikan hubungan sebagai entitas independen. Ini menunjukkan sifat inti, tema bersama, dan jalur pengembangan potensial.' },
              { q: '组合盘和比较盘有什么区别？', q_en: 'What is the difference between Composite and Synastry?', q_id: 'Apa perbedaan antara Komposit dan Sinastri?',
                a: '组合盘是两人星盘的中点，代表关系本身；比较盘是两人的行星直接比较，展示行星间的互动和相互影响。', 
                a_en: 'Composite is the mid-point chart representing the relationship itself; Synastry compares planets between the two charts, showing planetary interactions and mutual influences.',
                a_id: 'Komposit adalah bagan titik tengah yang mereasikan hubungan itu sendiri; Sinastri membandingkan planet antara dua bagan, menunjukkan interaksi planet dan pengaruh timbal balik.' },
              { q: '如何解读相位盘？', q_en: 'How to read the Synastry chart?', q_id: 'Bagaimana membaca bagan Sinastri?',
                a: '关注行星之间的相位：和谐相位（六合、三分相）表示顺利互动；挑战相位（四分相、对分相）表示需要克服的张力。', 
                a_en: 'Focus on aspects between planets: harmonious aspects (Sextile, Trine) indicate smooth interactions; challenging aspects (Square, Opposition) indicate tension to work through.',
                a_id: 'Fokus pada aspek antar planet: aspek harmonis (Sextile, Trine) menunjukkan interaksi yang halus; aspek menantang (Square, Opposition) menunjukkan ketegangan yang harus diatasi.' },
              { q: '行星落入宫位代表什么？', q_en: 'What do planets in houses mean?', q_id: 'Apa arti planet di rumah?',
                a: '行星落入的宫位表示关系中该领域的主题。例如金星落入第七宫代表公开关系和婚姻承诺。', 
                a_en: 'The house where a planet falls indicates the area of life this relationship influences. For example, Venus in the 7th house indicates a public relationship and marriage commitment.',
                a_id: 'Rumah tempat planet berada menunjukkan area kehidupan yang dipengaruhi hubungan ini. Misalnya, Venus di rumah ke-7 menunjukkan hubungan publik dan komitmen pernikahan.' },
              { q: '为什么需要准确的出生时间？', q_en: 'Why do we need accurate birth time?', q_id: 'Mengapa kita membutuhkan waktu lahir yang akurat?',
                a: '出生时间影响上升星座和宫位的计算，直接关系到行星落入的宫位。几分钟的误差可能导致行星进入不同宫位。', 
                a_en: 'Birth time affects the calculation of Ascendant and houses, directly affecting which house planets fall in. A few minutes difference can cause planets to fall in different houses.',
                a_id: 'Waktu lahir mempengaruhi perhitungan Ascendant dan rumah, langsung mempengaruhi planet mana yang jatuh di rumah tertentu. Selisih beberapa menit dapat menyebabkan planet jatuh di rumah yang berbeda.' },
            ].map((item, i) => (
              <div key={i} className="border border-purple-500/20 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full px-4 py-3 flex items-center justify-between bg-purple-900/20 hover:bg-purple-900/30 transition-colors text-left"
                >
                  <span className="text-white text-sm">{language === 'zh' ? item.q : (language === 'en' ? item.q_en : item.q_id)}</span>
                  <ChevronDown size={18} className={`text-purple-300 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}/>
                </button>
                {openFaq === i && (
                  <div className="px-4 py-3 bg-purple-950/30 border-t border-purple-500/10">
                    <p className="text-slate-200 text-sm mb-2">{language === 'zh' ? item.a : (language === 'en' ? item.a_en : item.a_id)}</p>
                    <p className="text-slate-400 text-xs">{language === 'zh' ? item.a_en : item.a_id}</p>
                    <p className="text-slate-500 text-xs">{language === 'zh' ? item.a_id : item.a_en}</p>
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
