"use client";

import { useState } from "react";
import { 
  SIGNS, PLANETS, HOUSES, ASPECTS, ELEMENT_COLORS,
  calculateJulianDay, calculatePlanetPositions, calculateAscendant, calculateMC,
  calculateHouseCusps, getPlanetHouse, calculateAspects
} from "@/lib/astrologyCalculations";

interface ChartData {
  planets: Record<string, { sign: string; degree: number; retrograde: boolean; house: number }>;
  ascendant: { sign: string; degree: number };
  mc: { sign: string; degree: number };
  cusps: number[];
  aspects: Array<{ planet1: string; planet2: string; aspect: string; orb: number }>;
}

interface ProfessionalBirthChartProps {
  language?: "id" | "en" | "zh";
}

export default function ProfessionalBirthChart({ language = "id" }: ProfessionalBirthChartProps) {
  const [formData, setFormData] = useState({
    name: "",
    day: 15,
    month: 6,
    year: 1990,
    hour: 12,
    minute: 0,
    latitude: -6.2,
    longitude: 106.8,
  });
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const t = {
    id: {
      title: "Bagan Lahir Profesional",
      subtitle: "Masukkan data Lahir Anda",
      calculate: "Hitung Bintang Lahir",
      name: "Nama",
      date: "Tanggal",
      month: "Bulan",
      year: "Tahun",
      hour: "Jam Lahir",
      minute: "Menit",
      latitude: "Garis Lintang",
      longitude: "Garis Bujur",
      result: "Hasil Analisis",
      sun: "Matahari",
      moon: "Bulan",
      rising: "Rising",
      planets: "Posisi Planet",
      houses: "Planet dalam Rumah",
      aspects: "Aspek",
      retrograde: "Retrograde",
    },
    en: {
      title: "Professional Birth Chart",
      subtitle: "Enter Your Birth Data",
      calculate: "Calculate Birth Chart",
      name: "Name",
      date: "Day",
      month: "Month",
      year: "Year",
      hour: "Birth Hour",
      minute: "Birth Minute",
      latitude: "Latitude",
      longitude: "Longitude",
      result: "Analysis Results",
      sun: "Sun",
      moon: "Moon",
      rising: "Rising",
      planets: "Planet Positions",
      houses: "Planets in Houses",
      aspects: "Aspects",
      retrograde: "Retrograde",
    },
    zh: {
      title: "专业出生星盘",
      subtitle: "输入您的出生信息",
      calculate: "计算星盘",
      name: "姓名",
      date: "日期",
      month: "月份",
      year: "年份",
      hour: "出生小时",
      minute: "出生分钟",
      latitude: "纬度",
      longitude: "经度",
      result: "分析结果",
      sun: "太阳",
      moon: "月亮",
      rising: "上升",
      planets: "行星位置",
      houses: "行星落宫",
      aspects: "相位",
      retrograde: "逆行",
    },
  }[language];

  const calculate = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const jd = calculateJulianDay(
        formData.year,
        formData.month,
        formData.day,
        formData.hour,
        formData.minute
      );
      
      const positions = calculatePlanetPositions(jd);
      const ascendant = calculateAscendant(jd, formData.latitude, formData.longitude);
      const mc = calculateMC(jd, formData.latitude, formData.longitude);
      const cusps = calculateHouseCusps(ascendant, mc);
      
      // 计算行星落入宫位
      const planetsWithHouses: Record<string, { sign: string; degree: number; retrograde: boolean; house: number }> = {};
      Object.entries(positions).forEach(([planetId, pos]) => {
        const lon = SIGNS.findIndex(s => s.id === pos.sign) * 30 + pos.degree;
        planetsWithHouses[planetId] = {
          ...pos,
          house: getPlanetHouse(lon, cusps),
        };
      });
      
      const aspects = calculateAspects(positions);
      
      setChartData({
        planets: planetsWithHouses,
        ascendant,
        mc,
        cusps,
        aspects,
      });
      
      setIsLoading(false);
    }, 1500);
  };

  // SVG 星盘图
  const renderChartSVG = () => {
    if (!chartData) return null;

    const size = 400;
    const center = size / 2;
    const outerRadius = 180;
    const middleRadius = 140;
    const innerRadius = 100;
    const planetRadius = 155;

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* 外圈 - 星座 */}
        <circle cx={center} cy={center} r={outerRadius} fill="none" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="2" />
        
        {/* 星座分隔线 */}
        {SIGNS.map((sign, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x1 = center + middleRadius * Math.cos(angle);
          const y1 = center + middleRadius * Math.sin(angle);
          const x2 = center + outerRadius * Math.cos(angle);
          const y2 = center + outerRadius * Math.sin(angle);
          return (
            <line key={sign.id} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(168, 85, 247, 0.3)" strokeWidth="1" />
          );
        })}
        
        {/* 星座符号 */}
        {SIGNS.map((sign, i) => {
          const angle = ((i * 30 + 15) - 90) * (Math.PI / 180);
          const x = center + (outerRadius - 20) * Math.cos(angle);
          const y = center + (outerRadius - 20) * Math.sin(angle);
          const elementColor = ELEMENT_COLORS[sign.element];
          return (
            <text key={sign.id} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill={elementColor} fontSize="16" fontWeight="bold">
              {sign.symbol}
            </text>
          );
        })}

        {/* 中圈 - 宫位线 */}
        <circle cx={center} cy={center} r={middleRadius} fill="none" stroke="rgba(168, 85, 247, 0.3)" strokeWidth="1" />
        
        {/* 宫位分隔线 */}
        {chartData.cusps.map((cusp, i) => {
          const angle = (cusp - 90) * (Math.PI / 180);
          const x1 = center + innerRadius * Math.cos(angle);
          const y1 = center + innerRadius * Math.sin(angle);
          const x2 = center + middleRadius * Math.cos(angle);
          const y2 = center + middleRadius * Math.sin(angle);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255, 215, 0, 0.3)" strokeWidth="1" />
          );
        })}

        {/* 内圈 */}
        <circle cx={center} cy={center} r={innerRadius} fill="none" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="1" />
        
        {/* 行星位置 */}
        {Object.entries(chartData.planets).map(([planetId, data]) => {
          const planet = PLANETS.find(p => p.id === planetId);
          if (!planet) return null;
          
          const signIndex = SIGNS.findIndex(s => s.id === data.sign);
          const angle = ((signIndex * 30 + data.degree) - 90) * (Math.PI / 180);
          const x = center + planetRadius * Math.cos(angle);
          const y = center + planetRadius * Math.sin(angle);
          
          return (
            <g key={planetId}>
              <circle cx={x} cy={y} r="14" fill="rgba(10, 10, 26, 0.9)" stroke={planet.color} strokeWidth="2" />
              <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill={planet.color} fontSize="14" fontWeight="bold">
                {planet.symbol}
              </text>
              {data.retrograde && (
                <text x={x} y={y + 18} textAnchor="middle" fill="#FF4444" fontSize="8">R</text>
              )}
            </g>
          );
        })}

        {/* ASC 点 */}
        <g>
          <circle cx={center - middleRadius + 10} cy={center} r="12" fill="rgba(255, 215, 0, 0.2)" stroke="#FFD700" strokeWidth="2" />
          <text x={center - middleRadius + 10} y={center} textAnchor="middle" dominantBaseline="middle" fill="#FFD700" fontSize="10" fontWeight="bold">ASC</text>
        </g>

        {/* MC 点 */}
        <g>
          <circle cx={center} cy={center - middleRadius + 10} r="12" fill="rgba(255, 165, 0, 0.2)" stroke="#FFA500" strokeWidth="2" />
          <text x={center} y={center - middleRadius + 10} textAnchor="middle" dominantBaseline="middle" fill="#FFA500" fontSize="10" fontWeight="bold">MC</text>
        </g>
      </svg>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* 表单 */}
      <div className="p-6 rounded-2xl bg-gray-900/30 border border-gray-200 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="col-span-2">
            <label className="text-sm text-gray-300">{t.name}</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 bg-gray-900/50 border border-gray-200 rounded-xl text-white mt-1"
              placeholder={t.name}
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">{t.date}</label>
            <input
              type="number"
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: parseInt(e.target.value) || 1 })}
              className="w-full p-3 bg-gray-900/50 border border-gray-200 rounded-xl text-white mt-1"
              min="1" max="31"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">{t.month}</label>
            <select
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
              className="w-full p-3 bg-gray-900/50 border border-gray-200 rounded-xl text-white mt-1"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-300">{t.year}</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 1990 })}
              className="w-full p-3 bg-gray-900/50 border border-gray-200 rounded-xl text-white mt-1"
              min="1900" max="2100"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">{t.hour}</label>
            <input
              type="number"
              value={formData.hour}
              onChange={(e) => setFormData({ ...formData, hour: parseInt(e.target.value) || 0 })}
              className="w-full p-3 bg-gray-900/50 border border-gray-200 rounded-xl text-white mt-1"
              min="0" max="23"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">{t.minute}</label>
            <input
              type="number"
              value={formData.minute}
              onChange={(e) => setFormData({ ...formData, minute: parseInt(e.target.value) || 0 })}
              className="w-full p-3 bg-gray-900/50 border border-gray-200 rounded-xl text-white mt-1"
              min="0" max="59"
            />
          </div>
        </div>
        
        <button
          onClick={calculate}
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl font-semibold hover:from-gray-400 hover:to-gray-500 transition-all disabled:opacity-50"
        >
          {isLoading ? "Calculating..." : `✨ ${t.calculate}`}
        </button>
      </div>

      {/* 结果 */}
      {chartData && (
        <div className="space-y-6">
          {/* SVG 星盘 */}
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50/40 to-gray-950/60 border border-gray-200">
              {renderChartSVG()}
            </div>
          </div>

          {/* 三要素 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-gray-900/20 border border-gray-500/30">
              <div className="text-3xl mb-2">☉</div>
              <div className="text-sm text-gray-300">{t.sun}</div>
              <div className="font-bold text-gray-100">
                {SIGNS.find(s => s.id === chartData.planets.sun.sign)?.symbol} {SIGNS.find(s => s.id === chartData.planets.sun.sign)?.name[language]}
              </div>
              <div className="text-xs text-gray-300">{chartData.planets.sun.degree.toFixed(1)}°</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/20 border border-gray-500/30">
              <div className="text-3xl mb-2">☽</div>
              <div className="text-sm text-gray-300">{t.moon}</div>
              <div className="font-bold text-gray-100">
                {SIGNS.find(s => s.id === chartData.planets.moon.sign)?.symbol} {SIGNS.find(s => s.id === chartData.planets.moon.sign)?.name[language]}
              </div>
              <div className="text-xs text-gray-300">{chartData.planets.moon.degree.toFixed(1)}°</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gray-900/20 border border-gray-200">
              <div className="text-3xl mb-2">↑</div>
              <div className="text-sm text-gray-300">{t.rising}</div>
              <div className="font-bold text-gray-100">
                {SIGNS.find(s => s.id === chartData.ascendant.sign)?.symbol} {SIGNS.find(s => s.id === chartData.ascendant.sign)?.name[language]}
              </div>
              <div className="text-xs text-gray-300">{chartData.ascendant.degree.toFixed(1)}°</div>
            </div>
          </div>

          {/* 行星表格 */}
          <div className="p-4 rounded-xl bg-gray-900/30 border border-gray-200">
            <h4 className="font-semibold text-gray-100 mb-4">{t.planets}</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {Object.entries(chartData.planets).map(([planetId, data]) => {
                const planet = PLANETS.find(p => p.id === planetId);
                const sign = SIGNS.find(s => s.id === data.sign);
                return (
                  <div key={planetId} className={`p-2 rounded-lg ${data.retrograde ? "bg-gray-900/20 border border-gray-500/30" : "bg-gray-800/30"}`}>
                    <div className="flex items-center gap-2">
                      <span style={{ color: planet?.color }} className="text-lg">{planet?.symbol}</span>
                      <div>
                        <div className="text-sm text-gray-600">{sign?.symbol} {sign?.name[language]}</div>
                        <div className="text-xs text-gray-400">{data.degree.toFixed(0)}° H{data.house}</div>
                      </div>
                      {data.retrograde && <span className="text-gray-400 text-xs">R</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 主要相位 */}
          {chartData.aspects.length > 0 && (
            <div className="p-4 rounded-xl bg-gray-900/30 border border-gray-200">
              <h4 className="font-semibold text-gray-100 mb-4">{t.aspects}</h4>
              <div className="space-y-2">
                {chartData.aspects.slice(0, 10).map((aspect, i) => {
                  const p1 = PLANETS.find(p => p.id === aspect.planet1);
                  const p2 = PLANETS.find(p => p.id === aspect.planet2);
                  const asp = ASPECTS.find(a => a.id === aspect.aspect);
                  const isHarmonious = asp?.nature === "harmonious";
                  const isChallenging = asp?.nature === "challenging";
                  
                  return (
                    <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${isHarmonious ? "bg-gray-900/20" : isChallenging ? "bg-gray-900/20" : "bg-gray-800/20"}`}>
                      <span style={{ color: p1?.color }}>{p1?.symbol}</span>
                      <span className={isHarmonious ? "text-gray-400" : isChallenging ? "text-gray-400" : "text-gray-400"}>{asp?.symbol}</span>
                      <span style={{ color: p2?.color }}>{p2?.symbol}</span>
                      <span className="text-xs text-gray-300 ml-2">{asp?.name[language]} ({aspect.orb.toFixed(1)}°)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}