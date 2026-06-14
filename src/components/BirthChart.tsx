"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// 星座数据
const SIGNS = [
  { id: "aries", name: { id: "Aries", zh: "白羊座", en: "Aries" }, symbol: "♈", element: "fire" },
  { id: "taurus", name: { id: "Taurus", zh: "金牛座", en: "Taurus" }, symbol: "♉", element: "earth" },
  { id: "gemini", name: { id: "Gemini", zh: "双子座", en: "Gemini" }, symbol: "♊", element: "air" },
  { id: "cancer", name: { id: "Cancer", zh: "巨蟹座", en: "Cancer" }, symbol: "♋", element: "water" },
  { id: "leo", name: { id: "Leo", zh: "狮子座", en: "Leo" }, symbol: "♌", element: "fire" },
  { id: "virgo", name: { id: "Virgo", zh: "处女座", en: "Virgo" }, symbol: "♍", element: "earth" },
  { id: "libra", name: { id: "Libra", zh: "天秤座", en: "Libra" }, symbol: "♎", element: "air" },
  { id: "scorpio", name: { id: "Scorpio", zh: "天蝎座", en: "Scorpio" }, symbol: "♏", element: "water" },
  { id: "sagittarius", name: { id: "Sagittarius", zh: "射手座", en: "Sagittarius" }, symbol: "♐", element: "fire" },
  { id: "capricorn", name: { id: "Capricorn", zh: "摩羯座", en: "Capricorn" }, symbol: "♑", element: "earth" },
  { id: "aquarius", name: { id: "Aquarius", zh: "水瓶座", en: "Aquarius" }, symbol: "♒", element: "air" },
  { id: "pisces", name: { id: "Pisces", zh: "双鱼座", en: "Pisces" }, symbol: "♓", element: "water" },
];

// 行星数据
const PLANETS = [
  { id: "sun", name: { id: "Matahari", zh: "太阳", en: "Sun" }, symbol: "☉", color: "#FFD700" },
  { id: "moon", name: { id: "Bulan", zh: "月亮", en: "Moon" }, symbol: "☽", color: "#C0C0C0" },
  { id: "mercury", name: { id: "Merkurius", zh: "水星", en: "Mercury" }, symbol: "☿", color: "#87CEEB" },
  { id: "venus", name: { id: "Venus", zh: "金星", en: "Venus" }, symbol: "♀", color: "#FF69B4" },
  { id: "mars", name: { id: "Mars", zh: "火星", en: "Mars" }, symbol: "♂", color: "#FF4500" },
  { id: "jupiter", name: { id: "Jupiter", zh: "木星", en: "Jupiter" }, symbol: "♃", color: "#FFA500" },
  { id: "saturn", name: { id: "Saturnus", zh: "土星", en: "Saturn" }, symbol: "♄", color: "#DAA520" },
  { id: "uranus", name: { id: "Uranus", zh: "天王星", en: "Uranus" }, symbol: "♅", color: "#40E0D0" },
  { id: "neptune", name: { id: "Neptunus", zh: "海王星", en: "Neptune" }, symbol: "♆", color: "#4169E1" },
  { id: "pluto", name: { id: "Pluto", zh: "冥王星", en: "Pluto" }, symbol: "♇", color: "#8B008B" },
];

// 城市数据
const CITIES = [
  { name: { id: "Jakarta", zh: "雅加达", en: "Jakarta" }, lat: -6.2, lng: 106.8, tz: 7 },
  { name: { id: "Surabaya", zh: "泗水", en: "Surabaya" }, lat: -7.3, lng: 112.8, tz: 7 },
  { name: { id: "Bandung", zh: "万隆", en: "Bandung" }, lat: -6.9, lng: 107.6, tz: 7 },
  { name: { id: "Bali", zh: "巴厘岛", en: "Bali" }, lat: -8.4, lng: 115.2, tz: 8 },
  { name: { id: "Singapore", zh: "新加坡", en: "Singapore" }, lat: 1.4, lng: 103.8, tz: 8 },
  { name: { id: "Kuala Lumpur", zh: "吉隆坡", en: "Kuala Lumpur" }, lat: 3.1, lng: 101.7, tz: 8 },
  { name: { id: "Bangkok", zh: "曼谷", en: "Bangkok" }, lat: 13.8, lng: 100.5, tz: 7 },
  { name: { id: "Hong Kong", zh: "香港", en: "Hong Kong" }, lat: 22.3, lng: 114.2, tz: 8 },
  { name: { id: "Taipei", zh: "台北", en: "Taipei" }, lat: 25.0, lng: 121.5, tz: 8 },
  { name: { id: "Beijing", zh: "北京", en: "Beijing" }, lat: 39.9, lng: 116.4, tz: 8 },
  { name: { id: "Shanghai", zh: "上海", en: "Shanghai" }, lat: 31.2, lng: 121.5, tz: 8 },
  { name: { id: "Shenzhen", zh: "深圳", en: "Shenzhen" }, lat: 22.5, lng: 114.1, tz: 8 },
  { name: { id: "Guangzhou", zh: "广州", en: "Guangzhou" }, lat: 23.1, lng: 113.3, tz: 8 },
  { name: { id: "Tokyo", zh: "东京", en: "Tokyo" }, lat: 35.7, lng: 139.7, tz: 9 },
  { name: { id: "Seoul", zh: "首尔", en: "Seoul" }, lat: 37.6, lng: 127.0, tz: 9 },
  { name: { id: "New York", zh: "纽约", en: "New York" }, lat: 40.7, lng: -74.0, tz: -5 },
  { name: { id: "Los Angeles", zh: "洛杉矶", en: "Los Angeles" }, lat: 34.1, lng: -118.2, tz: -8 },
  { name: { id: "London", zh: "伦敦", en: "London" }, lat: 51.5, lng: -0.1, tz: 0 },
  { name: { id: "Paris", zh: "巴黎", en: "Paris" }, lat: 48.9, lng: 2.4, tz: 1 },
  { name: { id: "Sydney", zh: "悉尼", en: "Sydney" }, lat: -33.9, lng: 151.2, tz: 10 },
];

const ELEMENT_COLORS: Record<string, string> = {
  fire: "#FF4500",
  earth: "#8B4513",
  air: "#87CEEB",
  water: "#4169E1",
};

interface BirthChartProps {
  language?: "id" | "en" | "zh";
  onLanguageChange?: (lang: "id" | "en" | "zh") => void;
}

export default function BirthChart({ language = "id", onLanguageChange }: BirthChartProps) {
  const [formData, setFormData] = useState({
    name: "",
    year: 1990,
    month: 1,
    day: 15,
    hour: 12,
    minute: 0,
    cityIndex: 0,
  });
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 翻译 - 使用传入的 language
  const t = useMemo(() => ({
    title: { id: "Bagan Lahir", zh: "出生星盘", en: "Birth Chart" }[language],
    subtitle: { id: "Masukkan data lahir Anda", zh: "输入您的出生信息", en: "Enter your birth data" }[language],
    name: { id: "Nama", zh: "姓名", en: "Name" }[language],
    birthDate: { id: "Tanggal Lahir", zh: "出生日期", en: "Birth Date" }[language],
    birthTime: { id: "Waktu Lahir", zh: "出生时间", en: "Birth Time" }[language],
    birthPlace: { id: "Tempat Lahir", zh: "出生地点", en: "Birth Place" }[language],
    calculate: { id: "Hitung Bintang", zh: "计算星盘", en: "Calculate Chart" }[language],
    calculating: { id: "Menghitung...", zh: "计算中...", en: "Calculating..." }[language],
    sun: { id: "Matahari", zh: "太阳", en: "Sun" }[language],
    moon: { id: "Bulan", zh: "月亮", en: "Moon" }[language],
    rising: { id: "Rising", zh: "上升", en: "Rising" }[language],
    planets: { id: "Posisi Planet", zh: "行星位置", en: "Planet Positions" }[language],
    aspects: { id: "Aspek Utama", zh: "主要相位", en: "Major Aspects" }[language],
    houses: { id: "Rumah", zh: "宫位", en: "House" }[language],
    retrograde: { id: "Retrograde", zh: "逆行", en: "Retrograde" }[language],
  }), [language]);

  const selectedCity = CITIES[formData.cityIndex];

  // 计算星盘
  const calculateChart = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      // 简化计算 - 基于出生日期生成行星位置
      const jd = formData.year * 365.25 + formData.month * 30.44 + formData.day;
      
      const planets: Record<string, { sign: string; degree: number; house: number }> = {};
      
      PLANETS.forEach((planet, index) => {
        const baseDegree = (jd * (1 + index * 0.1)) % 360;
        const signIndex = Math.floor(baseDegree / 30);
        const degreeInSign = baseDegree % 30;
        const house = Math.floor((baseDegree + formData.hour * 15) / 30) % 12 + 1;
        
        planets[planet.id] = {
          sign: SIGNS[signIndex].id,
          degree: degreeInSign,
          house: house,
        };
      });

      // 上升星座
      const ascDegree = (jd * 0.9856 + formData.hour * 15 + selectedCity.lat / 4) % 360;
      const ascSignIndex = Math.floor(ascDegree / 30);

      setChartData({
        planets,
        ascendant: { sign: SIGNS[ascSignIndex].id, degree: ascDegree % 30 },
        mc: { sign: SIGNS[(ascSignIndex + 9) % 12].id, degree: 15 },
      });
      
      setIsLoading(false);
    }, 1500);
  };

  // 渲染星盘图
  const renderChartSVG = () => {
    if (!chartData) return null;

    const size = 400;
    const center = size / 2;
    const outerRadius = 180;
    const middleRadius = 145;
    const innerRadius = 110;
    const planetRadius = 160;

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
        {/* 背景圆 */}
        <circle cx={center} cy={center} r={outerRadius} fill="rgba(10, 10, 26, 0.8)" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="2" />
        
        {/* 12宫位分隔线 */}
        {SIGNS.map((sign, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x1 = center + innerRadius * Math.cos(angle);
          const y1 = center + innerRadius * Math.sin(angle);
          const x2 = center + outerRadius * Math.cos(angle);
          const y2 = center + outerRadius * Math.sin(angle);
          return (
            <line key={sign.id} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(168, 85, 247, 0.3)" strokeWidth="1" />
          );
        })}
        
        {/* 星座符号 */}
        {SIGNS.map((sign, i) => {
          const angle = ((i * 30 + 15) - 90) * (Math.PI / 180);
          const x = center + (outerRadius - 18) * Math.cos(angle);
          const y = center + (outerRadius - 18) * Math.sin(angle);
          return (
            <text key={sign.id} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill={ELEMENT_COLORS[sign.element]} fontSize="16" fontWeight="bold">
              {sign.symbol}
            </text>
          );
        })}

        {/* 中圈 */}
        <circle cx={center} cy={center} r={middleRadius} fill="none" stroke="rgba(168, 85, 247, 0.3)" strokeWidth="1" />
        
        {/* 内圈 */}
        <circle cx={center} cy={center} r={innerRadius} fill="none" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="1" />
        
        {/* 行星位置 */}
        {Object.entries(chartData.planets).map(([planetId, data]: [string, any]) => {
          const planet = PLANETS.find(p => p.id === planetId);
          if (!planet) return null;
          
          const signIndex = SIGNS.findIndex(s => s.id === data.sign);
          const angle = ((signIndex * 30 + data.degree) - 90) * (Math.PI / 180);
          const x = center + planetRadius * Math.cos(angle);
          const y = center + planetRadius * Math.sin(angle);
          
          return (
            <g key={planetId}>
              <circle cx={x} cy={y} r="14" fill="rgba(10, 10, 26, 0.95)" stroke={planet.color} strokeWidth="2" />
              <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill={planet.color} fontSize="14" fontWeight="bold">
                {planet.symbol}
              </text>
            </g>
          );
        })}

        {/* ASC 标记 */}
        <g>
          <circle cx={center - middleRadius + 15} cy={center} r="12" fill="rgba(255, 215, 0, 0.2)" stroke="#FFD700" strokeWidth="2" />
          <text x={center - middleRadius + 15} y={center} textAnchor="middle" dominantBaseline="middle" fill="#FFD700" fontSize="10" fontWeight="bold">ASC</text>
        </g>

        {/* MC 标记 */}
        <g>
          <circle cx={center} cy={center - middleRadius + 15} r="12" fill="rgba(255, 165, 0, 0.2)" stroke="#FFA500" strokeWidth="2" />
          <text x={center} y={center - middleRadius + 15} textAnchor="middle" dominantBaseline="middle" fill="#FFA500" fontSize="10" fontWeight="bold">MC</text>
        </g>
      </svg>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* 输入表单 */}
      <div className="p-6 rounded-2xl bg-purple-900/30 border border-purple-200 space-y-4">
        {/* 姓名 */}
        <div>
          <label className="text-sm text-purple-300">{t.name}</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 bg-purple-900/50 border border-purple-200 rounded-xl text-white mt-1"
            placeholder={t.name}
          />
        </div>

        {/* 出生日期 */}
        <div>
          <label className="text-sm text-purple-300">{t.birthDate}</label>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="p-3 bg-purple-900/50 border border-purple-200 rounded-xl text-white"
            >
              {Array.from({ length: 100 }, (_, i) => 2025 - i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
              className="p-3 bg-purple-900/50 border border-purple-200 rounded-xl text-white"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: parseInt(e.target.value) })}
              className="p-3 bg-purple-900/50 border border-purple-200 rounded-xl text-white"
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 出生时间 */}
        <div>
          <label className="text-sm text-purple-300">{t.birthTime}</label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <select
              value={formData.hour}
              onChange={(e) => setFormData({ ...formData, hour: parseInt(e.target.value) })}
              className="p-3 bg-purple-900/50 border border-purple-200 rounded-xl text-white"
            >
              {Array.from({ length: 24 }, (_, i) => i).map(h => (
                <option key={h} value={h}>{h.toString().padStart(2, '0')}:00</option>
              ))}
            </select>
            <select
              value={formData.minute}
              onChange={(e) => setFormData({ ...formData, minute: parseInt(e.target.value) })}
              className="p-3 bg-purple-900/50 border border-purple-200 rounded-xl text-white"
            >
              {[0, 15, 30, 45].map(m => (
                <option key={m} value={m}>{m.toString().padStart(2, '0')} min</option>
              ))}
            </select>
          </div>
        </div>

        {/* 出生地点 */}
        <div>
          <label className="text-sm text-purple-300">{t.birthPlace}</label>
          <select
            value={formData.cityIndex}
            onChange={(e) => setFormData({ ...formData, cityIndex: parseInt(e.target.value) })}
            className="w-full p-3 bg-purple-900/50 border border-purple-200 rounded-xl text-white mt-1"
          >
            {CITIES.map((city, i) => (
              <option key={i} value={i}>{city.name[language]}</option>
            ))}
          </select>
        </div>

        {/* 计算按钮 */}
        <button
          onClick={calculateChart}
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-purple-600 rounded-xl font-semibold hover:from-amber-400 hover:to-purple-500 transition-all disabled:opacity-50"
        >
          {isLoading ? t.calculating : `✨ ${t.calculate}`}
        </button>
      </div>

      {/* 结果展示 */}
      {chartData && (
        <div className="space-y-6">
          {/* SVG 星盘图 */}
          <div className="flex justify-center p-4 rounded-2xl bg-gradient-to-br from-purple-50/40 to-purple-950/60 border border-purple-200">
            {renderChartSVG()}
          </div>

          {/* 三要素 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-amber-900/20 border border-amber-500/30">
              <div className="text-3xl mb-2">☉</div>
              <div className="text-sm text-purple-300">{t.sun}</div>
              <div className="font-bold text-amber-100">
                {SIGNS.find(s => s.id === chartData.planets.sun.sign)?.symbol} {SIGNS.find(s => s.id === chartData.planets.sun.sign)?.name[language]}
              </div>
              <div className="text-xs text-purple-300">{chartData.planets.sun.degree.toFixed(1)}°</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gray-900/20 border border-gray-500/30">
              <div className="text-3xl mb-2">☽</div>
              <div className="text-sm text-purple-300">{t.moon}</div>
              <div className="font-bold text-amber-100">
                {SIGNS.find(s => s.id === chartData.planets.moon.sign)?.symbol} {SIGNS.find(s => s.id === chartData.planets.moon.sign)?.name[language]}
              </div>
              <div className="text-xs text-purple-300">{chartData.planets.moon.degree.toFixed(1)}°</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-purple-900/20 border border-purple-200">
              <div className="text-3xl mb-2">↑</div>
              <div className="text-sm text-purple-300">{t.rising}</div>
              <div className="font-bold text-amber-100">
                {SIGNS.find(s => s.id === chartData.ascendant.sign)?.symbol} {SIGNS.find(s => s.id === chartData.ascendant.sign)?.name[language]}
              </div>
              <div className="text-xs text-purple-300">{chartData.ascendant.degree.toFixed(1)}°</div>
            </div>
          </div>

          {/* 行星表格 */}
          <div className="p-4 rounded-xl bg-purple-900/30 border border-purple-200">
            <h4 className="font-semibold text-amber-100 mb-4">{t.planets}</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {Object.entries(chartData.planets).map(([planetId, data]: [string, any]) => {
                const planet = PLANETS.find(p => p.id === planetId);
                const sign = SIGNS.find(s => s.id === data.sign);
                return (
                  <div key={planetId} className="p-2 rounded-lg bg-purple-800/30 flex items-center gap-2">
                    <span style={{ color: planet?.color }} className="text-lg">{planet?.symbol}</span>
                    <div>
                      <div className="text-sm text-purple-200">{sign?.symbol} {sign?.name[language]}</div>
                      <div className="text-xs text-purple-400">{data.degree.toFixed(0)}° · H{data.house}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}