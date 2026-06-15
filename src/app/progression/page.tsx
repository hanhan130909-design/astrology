"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { TrendingUp, Calendar, Clock, Star } from 'lucide-react';
import NatalChart from '@/components/NatalChart';
import { useChartStorage } from '../natal/useChartStorage';

const ALL_CITIES = [
  {id:"jakarta",name:{zh:"雅加达",en:"Jakarta",id:"Jakarta"},lat:-6.2088,lng:106.8456,tz:7},
  {id:"surabaya",name:{zh:"泗水",en:"Surabaya",id:"Surabaya"},lat:-7.2575,lng:112.7521,tz:7},
  {id:"beijing",name:{zh:"北京",en:"Beijing",id:"Beijing"},lat:39.9042,lng:116.4074,tz:8},
  {id:"shanghai",name:{zh:"上海",en:"Shanghai",id:"Shanghai"},lat:31.2304,lng:121.4737,tz:8},
  {id:"tokyo",name:{zh:"东京",en:"Tokyo",id:"Tokyo"},lat:35.6762,lng:139.6503,tz:9},
  {id:"newyork",name:{zh:"纽约",en:"New York",id:"New York"},lat:40.7128,lng:-74.0060,tz:-5},
];

const HOUSE_SYSTEMS = [
  {id:'P',name:{zh:'普拉西德制',en:'Placidus',id:'Placidus'}},
  {id:'W',name:{zh:'整宫制',en:'Whole Sign',id:'Whole Sign'}},
  {id:'E',name:{zh:'等宫制',en:'Equal',id:'Equal'}},
];

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
  North_Node: '☊', South_Node: '☋'
};

const PLANET_COLORS: Record<string, string> = {
  Sun: '#FFD700', Moon: '#C0C0C0', Mercury: '#87CEEB', Venus: '#FFB6C1',
  Mars: '#FF6347', Jupiter: '#FFA500', Saturn: '#87CEFA',
  Uranus: '#40E0D0', Neptune: '#6495ED', Pluto: '#CD5C5C',
  North_Node: '#98FB98', South_Node: '#DDA0DD'
};

function tx(obj: any, lang: string): string {
  if (typeof obj === 'string') return obj;
  return obj?.[lang] || obj?.zh || obj?.en || obj?.id || '';
}

export default function ProgressionPage() {
  const { language } = useLanguage();
  const { charts } = useChartStorage();
  
  const [bYear, setBYear] = useState(1990);
  const [bMonth, setBMonth] = useState(6);
  const [bDay, setBDay] = useState(15);
  const [bHour, setBHour] = useState(12);
  const [bMinute, setBMinute] = useState(0);
  const [bCityId, setBCityId] = useState('jakarta');
  const [houseSystem, setHouseSystem] = useState('P');
  
  const [targetYear, setTargetYear] = useState(new Date().getFullYear());
  const [chart, setChart] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chart'|'firdaria'>('chart');
  
  const bCity = ALL_CITIES.find((c: any) => c.id === bCityId) || ALL_CITIES[0];

  const calculateProgression = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/chart/transit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'progression',
          birthData: { year: bYear, month: bMonth, day: bDay, hour: bHour, minute: bMinute, lat: bCity.lat, lng: bCity.lng, tz: bCity.tz },
          transitDate: { year: targetYear },
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
    <div className="min-h-screen bg-white text-[#171717]">
      

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500/20 rounded-full text-sm text-gray-700 mb-4">
            <TrendingUp size={16} />
            {language === 'zh' ? '次限推运 & 法达':language==='zh'?'次限推运 & 法达':language==='en'?'Progression & Firdaria':language==='id'?'Progresi & Firdaria':language==='th'?'โปรเกรสชัน':language==='vi'?'Tiến trình':language==='ms'?'Progresi':language==='ja'?'プログレッション':language==='ko'?'프로그레션':'Progression'}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'zh' ? '📈 大运周期分析':language==='zh'?'📈 大运周期分析':language==='en'?'📈 Life Progression':language==='id'?'📈 Analisis Progresi':language==='th'?'📈 วิเคราะห์ช่วงชีวิต':language==='vi'?'📈 Phân tích tiến trình':language==='ms'?'📈 Analisis Progresi':language==='ja'?'📈 ライフプログレッション':language==='ko'?'📈 라이프 프로그레션':'📈 Life Progression'}
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            {language === 'zh' 
              ? '次限推运(1天=1年)与法达大运周期，洞察人生不同阶段的主题' 
              : 'Secondary progression & Firdaria periods, revealing life stage themes'}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-gray-400"/>
              {language === 'zh' ? '出生信息':language==='zh'?'出生信息':language==='en'?'Birth Info':language==='id'?'Info Kelahiran':language==='th'?'ข้อมูลเกิด':language==='vi'?'Thông tin sinh':language==='ms'?'Info Kelahiran':language==='ja'?'出生情報':language==='ko'?'출생 정보':'Birth Info'}
            </h2>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">{language === 'zh' ? '年':language==='zh'?'年':language==='en'?'Year':language==='id'?'Tahun':language==='th'?'ปี':language==='vi'?'Năm':language==='ms'?'Tahun':language==='ja'?'年':language==='ko'?'년':'Year'}</label>
                <input type="number" value={bYear} onChange={e => setBYear(parseInt(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm"/>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">{language === 'zh' ? '月' : 'Month'}</label>
                <select value={bMonth} onChange={e => setBMonth(parseInt(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm">
                  {Array.from({length:12},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">{language === 'zh' ? '日' : 'Day'}</label>
                <select value={bDay} onChange={e => setBDay(parseInt(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm">
                  {Array.from({length:31},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">{language === 'zh' ? '时' : 'Hour'}</label>
                <select value={bHour} onChange={e => setBHour(parseInt(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm">
                  {Array.from({length:24},(_,i)=><option key={i} value={i}>{i}:00</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">{language === 'zh' ? '分' : 'Min'}</label>
                <select value={bMinute} onChange={e => setBMinute(parseInt(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm">
                  {Array.from({length:12},(_,i)=><option key={i*5} value={i*5}>{i*5}</option>)}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs text-gray-500 block mb-1">{language === 'zh' ? '出生地' : 'Birth Location'}</label>
              <select value={bCityId} onChange={e => setBCityId(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm">
                {ALL_CITIES.map(c => <option key={c.id} value={c.id}>{tx(c.name,language)}</option>)}
              </select>
            </div>

            <div className="mb-4">
              <label className="text-xs text-gray-500 block mb-1">{language === 'zh' ? '分宫制' : 'House System'}</label>
              <select value={houseSystem} onChange={e => setHouseSystem(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm">
                {HOUSE_SYSTEMS.map(h => <option key={h.id} value={h.id}>{tx(h.name,language)}</option>)}
              </select>
            </div>

            <div className="mb-4">
              <label className="text-xs text-gray-500 block mb-1">{language === 'zh' ? '目标年份' : 'Target Year'}</label>
              <input type="number" value={targetYear} onChange={e => setTargetYear(parseInt(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm"/>
              <p className="text-xs text-gray-400 mt-1">{language === 'zh' ? `相当于出生后第${targetYear - bYear}天` : `Equivalent to day ${targetYear - bYear} after birth`}</p>
            </div>

            <button onClick={calculateProgression} disabled={loading} className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-500 hover:to-gray-500 disabled:opacity-50 rounded-xl font-bold text-gray-900 transition-all flex items-center justify-center gap-2">
              <TrendingUp size={18} />
              {loading ? (language === 'zh' ? '计算中...' : 'Calculating...') : (language === 'zh' ? '计算推运盘' : 'Calculate Progression')}
            </button>

            {error && <div className="mt-4 p-3 rounded-lg bg-gray-500/20 text-gray-300 text-sm">{error}</div>}
          </div>

          {/* Results */}
          <div>
            {chart?.progression ? (
              <div className="space-y-6">
                {/* Tabs */}
                <div className="flex gap-2 p-1 rounded-xl bg-gray-100">
                  <button onClick={() => setActiveTab('chart')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'chart' ? 'bg-gray-500 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                    {language === 'zh' ? '推运盘' : 'Progressed Chart'}
                  </button>
                  <button onClick={() => setActiveTab('firdaria')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'firdaria' ? 'bg-gray-500 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                    {language === 'zh' ? '法达大运' : 'Firdaria'}
                  </button>
                </div>

                {activeTab === 'chart' && (
                  <>
                    <div className="p-4 rounded-xl bg-gray-900/20 border border-gray-200">
                      <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <Clock size={16}/>
                        {language === 'zh' ? '次限日期' : 'Progressed Date'}
                      </h3>
                      <p className="text-gray-900">
                        {chart.progression.date.year}-{String(chart.progression.date.month).padStart(2,'0')}-{String(chart.progression.date.day).padStart(2,'0')}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {language === 'zh' ? `相当于出生后第 ${chart.progression.equivalentAge} 天` : `Day ${chart.progression.equivalentAge} after birth`}
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <NatalChart 
                        planets={chart.progression.planets} 
                        houses={chart.progression.houses} 
                        aspects={chart.progression.aspects}
                        size={380}
                      />
                    </div>
                  </>
                )}

                {activeTab === 'firdaria' && chart.progression.firdaria && (
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Star size={16} className="text-gray-600"/>
                      {language === 'zh' ? '法达大运周期' : 'Firdaria Periods'}
                    </h3>
                    
                    {chart.progression.firdaria.currentPeriod && (
                      <div className="mb-4 p-3 rounded-lg bg-gray-500/20 border border-gray-500/30">
                        <div className="text-sm text-gray-600 mb-1">{language === 'zh' ? '当前大运' : 'Current Period'}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{PLANET_SYMBOLS[chart.progression.firdaria.currentPeriod.planet]}</span>
                          <span className="font-bold text-gray-900">{chart.progression.firdaria.currentPeriod.planet}</span>
                          <span className="text-gray-500">
                            {chart.progression.firdaria.currentPeriod.startYear}-{chart.progression.firdaria.currentPeriod.endYear}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {chart.progression.firdaria.periods.map((p: any, i: number) => {
                        const isCurrent = targetYear >= p.startYear && targetYear < p.endYear;
                        return (
                          <div key={i} className={`flex items-center justify-between p-2 rounded ${isCurrent ? 'bg-gray-500/20 border border-gray-200' : 'bg-white/30'}`}>
                            <div className="flex items-center gap-2">
                              <span style={{color: PLANET_COLORS[p.planet] || '#fff'}}>{PLANET_SYMBOLS[p.planet]}</span>
                              <span className={isCurrent ? 'text-gray-900 font-medium' : 'text-gray-500'}>{p.planet}</span>
                            </div>
                            <div className="text-sm text-gray-400">
                              {p.startYear}-{p.endYear} ({p.years}{language === 'zh' ? '年' : 'y'})
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 text-xs text-gray-400">
                      <p>{language === 'zh' ? '法达系统：古典占星大运周期，太阳/月亮主导10年，其他行星8年' : 'Firdaria: Classical astrology period system, Sun/Moon 10 years, others 8 years'}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-8 rounded-2xl bg-gray-50/30 border border-gray-200 border-dashed">
                <div className="text-center text-gray-400">
                  <TrendingUp size={48} className="mx-auto mb-4 opacity-50"/>
                  <p>{language === 'zh' ? '输入信息后点击计算' : 'Enter info and click calculate'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
