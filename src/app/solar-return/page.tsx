"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sun, Search, MapPin, X, Calendar, Star } from 'lucide-react';
import ClassicReturnChart from '@/components/ClassicReturnChart';
import { useChartStorage } from '../natal/useChartStorage';
import { loadLatestBirthProfile, profileToBirthData } from '@/lib/latestBirthProfile';

const ALL_CITIES = [
  {id:"jakarta",name:{zh:"雅加达",en:"Jakarta",id:"Jakarta"},lat:-6.2088,lng:106.8456,tz:7},
  {id:"surabaya",name:{zh:"泗水",en:"Surabaya",id:"Surabaya"},lat:-7.2575,lng:112.7521,tz:7},
  {id:"bandung",name:{zh:"万隆",en:"Bandung",id:"Bandung"},lat:-6.9175,lng:107.6191,tz:7},
  {id:"beijing",name:{zh:"北京",en:"Beijing",id:"Beijing"},lat:39.9042,lng:116.4074,tz:8},
  {id:"shanghai",name:{zh:"上海",en:"Shanghai",id:"Shanghai"},lat:31.2304,lng:121.4737,tz:8},
  {id:"tokyo",name:{zh:"东京",en:"Tokyo",id:"Tokyo"},lat:35.6762,lng:139.6503,tz:9},
  {id:"newyork",name:{zh:"纽约",en:"New York",id:"New York"},lat:40.7128,lng:-74.0060,tz:-5},
  {id:"london",name:{zh:"伦敦",en:"London",id:"London"},lat:51.5074,lng:-0.1278,tz:0},
];

const HOUSE_SYSTEMS = [
  {id:'B',name:{zh:'阿卡比特制',en:'Alcabitius',id:'Alcabitius'}},
  {id:'P',name:{zh:'普拉西德制',en:'Placidus',id:'Placidus'}},
  {id:'W',name:{zh:'整宫制',en:'Whole Sign',id:'Whole Sign'}},
  {id:'E',name:{zh:'等宫制',en:'Equal',id:'Equal'}},
  {id:'K',name:{zh:'科赫制',en:'Koch',id:'Koch'}},
];

function tx(obj: any, lang: string): string {
  if (typeof obj === 'string') return obj;
  return obj?.[lang] || obj?.en || obj?.zh || obj?.id || '';
}

export default function SolarReturnPage() {
  const { language } = useLanguage();
  const { charts } = useChartStorage();
  
  const [bYear, setBYear] = useState(1990);
  const [bMonth, setBMonth] = useState(6);
  const [bDay, setBDay] = useState(15);
  const [bHour, setBHour] = useState(12);
  const [bMinute, setBMinute] = useState(0);
  const [bCityId, setBCityId] = useState('jakarta');
  const [cityName, setCityName] = useState('');
  const [birthLat, setBirthLat] = useState(ALL_CITIES[0].lat);
  const [birthLng, setBirthLng] = useState(ALL_CITIES[0].lng);
  const [birthTz, setBirthTz] = useState(ALL_CITIES[0].tz);
  const [houseSystem, setHouseSystem] = useState('P');
  
  const [srYear, setSrYear] = useState(new Date().getFullYear());
  const [chart, setChart] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  
  const bCity = ALL_CITIES.find((c: any) => c.id === bCityId) || ALL_CITIES[0];

  const calculateSolarReturn = async (profileOverride: any = null, returnYearOverride: number | null = null, houseSystemOverride: string | null = null) => {
    const savedBirth = profileOverride ? profileToBirthData(profileOverride) : null;
    const birthData = savedBirth || { year: bYear, month: bMonth, day: bDay, hour: bHour, minute: bMinute, lat: birthLat, lng: birthLng, tz: birthTz };
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/chart/transit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'solar_return',
          birthData,
          transitDate: { year: returnYearOverride || srYear },
          houseSystem: houseSystemOverride || houseSystem
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

  useEffect(() => {
    const latest = loadLatestBirthProfile();
    if (!latest) return;
    setBYear(latest.year);
    setBMonth(latest.month);
    setBDay(latest.day);
    setBHour(latest.hour);
    setBMinute(latest.minute);
    setBirthLat(latest.lat);
    setBirthLng(latest.lng);
    setBirthTz(latest.tz);
    setCityName(latest.city || latest.name || 'Saved Location');
    setBCityId('latest-profile');
    setHouseSystem(latest.houseSystem || 'B');
    calculateSolarReturn(latest, new Date().getFullYear(), latest.houseSystem || 'B');
  }, []);

  const handleCityChange = (id: string) => {
    setBCityId(id);
    const c = ALL_CITIES.find(x => x.id === id);
    if (!c) return;
    setCityName(tx(c.name, language));
    setBirthLat(c.lat);
    setBirthLng(c.lng);
    setBirthTz(c.tz);
  };

  const loadSavedChart = (c: any) => {
    setBYear(c.birthDate.year);
    setBMonth(c.birthDate.month);
    setBDay(c.birthDate.day);
    setBHour(c.birthDate.hour);
    setBMinute(c.birthDate.minute);
    setBCityId(c.cityId);
    setCityName(c.cityName);
    const city = ALL_CITIES.find((item: any) => item.id === c.cityId);
    if (city) {
      setBirthLat(city.lat);
      setBirthLng(city.lng);
      setBirthTz(city.tz);
    }
    setShowSaved(false);
  };

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      

      {showSaved && charts.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3">{language === 'zh' ? '已保存的星盘':language==='zh'?'已保存的星盘':language==='en'?'Saved Charts':language==='id'?'Bagan Tersimpan':language==='th'?'แผนภูมิที่บันทึก':language==='vi'?'Bản đồ đã lưu':language==='ms'?'Carta Disimpan':language==='ja'?'保存済みチャート':language==='ko'?'저장된 차트':'Saved Charts'}</h3>
            <div className="flex flex-wrap gap-2">
              {charts.map((c: any, i: number) => (
                <button key={i} onClick={() => loadSavedChart(c)} className="px-3 py-1.5 rounded-lg bg-gray-500/20 hover:bg-gray-500/30 text-sm">
                  {c.name} - {c.birthDate.year}/{c.birthDate.month}/{c.birthDate.day}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500/20 rounded-full text-sm text-gray-600 mb-4">
            <Sun size={16} className="fill-gray-300"/>
            {language === 'zh' ? '太阳回归盘':language==='zh'?'太阳回归盘':language==='en'?'Solar Return':language==='id'?'Solar Return':language==='th'?'สุริยคติ':language==='vi'?'Solar Return':language==='ms'?'Solar Return':language==='ja'?'太陽回帰図':language==='ko'?'솔라 리턴':'Solar Return'}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'zh' ? '☀️ 日返盘分析':language==='zh'?'☀️ 日返盘分析':language==='en'?'☀️ Solar Return':language==='id'?'☀️ Solar Return':language==='th'?'☀️ สุริยคติ':language==='vi'?'☀️ Solar Return':language==='ms'?'☀️ Solar Return':language==='ja'?'☀️ 太陽回帰図':language==='ko'?'☀️ 솔라 리턴':'☀️ Solar Return'}
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            {language === 'zh' 
              ? '太阳每年回到出生位置的时刻，揭示你这一年的整体能量主题' 
              : 'When the Sun returns to its birth position, revealing your yearly energy themes'}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-gray-600"/>
              {language === 'zh' ? '出生信息':language==='zh'?'出生信息':language==='en'?'Birth Info':language==='id'?'Info Kelahiran':language==='th'?'ข้อมูลเกิด':language==='vi'?'Thông tin sinh':language==='ms'?'Info Kelahiran':language==='ja'?'出生情報':language==='ko'?'출생 정보':'Birth Info'}
            </h2>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">{language === 'zh' ? '年' : 'Year'}</label>
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
                  {Array.from({length:60},(_,i)=><option key={i} value={i}>{String(i).padStart(2,'0')}</option>)}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs text-gray-500 block mb-1">{language === 'zh' ? '出生地' : 'Birth Location'}</label>
              <select value={bCityId} onChange={e => handleCityChange(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm">
                {bCityId === 'latest-profile' && <option value="latest-profile">{cityName || 'Saved Location'}</option>}
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
              <label className="text-xs text-gray-500 block mb-1">{language === 'zh' ? '日返年份' : 'Solar Return Year'}</label>
              <input type="number" value={srYear} onChange={e => setSrYear(parseInt(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm"/>
            </div>

            <button onClick={calculateSolarReturn} disabled={loading} className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-500 hover:to-gray-500 disabled:opacity-50 rounded-xl font-bold text-gray-900 transition-all flex items-center justify-center gap-2">
              <Sun size={18} />
              {loading ? (language === 'zh' ? '计算中...' : 'Calculating...') : (language === 'zh' ? '计算日返盘' : 'Calculate Solar Return')}
            </button>

            {error && <div className="mt-4 p-3 rounded-lg bg-gray-500/20 text-gray-300 text-sm">{error}</div>}
          </div>

          {/* Results */}
          <div>
            {chart?.solarReturn ? (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-gray-900/20 border border-gray-500/30">
                  <h3 className="font-bold text-gray-600 mb-2 flex items-center gap-2">
                    <Calendar size={16}/>
                    {language === 'zh' ? '日返时刻' : 'Solar Return Time'}
                  </h3>
                  <p className="text-gray-900">
                    {chart.solarReturn.date.year}-{String(chart.solarReturn.date.month).padStart(2,'0')}-{String(chart.solarReturn.date.day).padStart(2,'0')} {' '}
                    {String(chart.solarReturn.date.hour).padStart(2,'0')}:{String(chart.solarReturn.date.minute).padStart(2,'0')}
                  </p>
                  <div className="mt-2 text-sm text-gray-500">
                    ASC: {chart.solarReturn.houses[0]?.sign} {Math.floor(chart.solarReturn.houses[0]?.degree)}° | 
                    MC: {chart.solarReturn.houses[9]?.sign} {Math.floor(chart.solarReturn.houses[9]?.degree)}°
                  </div>
                </div>

                {/* Planet Positions */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3">{language === 'zh' ? '行星位置' : 'Planet Positions'}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(chart.solarReturn.planets).filter(([_,p]:[string,any])=>!p.error).map(([name,p]:[string,any])=>{
                      const house = chart.solarReturn.houses.find((h:any)=>{
                        const nextHouse = chart.solarReturn.houses[(h.house)%12];
                        let hLon = h.longitude, nLon = nextHouse.longitude;
                        if (nLon < hLon) nLon += 360;
                        let pLon = p.longitude;
                        if (pLon < hLon) pLon += 360;
                        return pLon >= hLon && pLon < nLon;
                      });
                      return (
                        <div key={name} className="flex items-center justify-between p-2 rounded bg-gray-100">
                          <span className="text-gray-600">{name}</span>
                          <span className="text-gray-600">{p.sign_cn || p.sign} {Math.floor(p.degree)}° {house ? `(${house.house}宫)` : ''}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-8 rounded-2xl bg-gray-50/30 border border-gray-200 border-dashed">
                <div className="text-center text-gray-400">
                  <Sun size={48} className="mx-auto mb-4 opacity-50"/>
                  <p>{language === 'zh' ? '输入信息后点击计算' : 'Enter info and click calculate'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {chart?.solarReturn && (
          <ClassicReturnChart chart={chart.solarReturn} className="mt-8" />
        )}
      </main>
    </div>
  );
}
