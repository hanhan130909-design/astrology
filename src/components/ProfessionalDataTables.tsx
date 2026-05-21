/**
 * Professional Data Tables Component
 * 参考 almuten.net 专业占星网站的数据展示
 * 
 * 包含：
 * 1. 相位容许度表 - 所有相位的精确度数和容许度
 * 2. 行星位置表 - 经度、落宫、守护宫、尊贵状态
 * 3. 宫位表 - 宫头、落入行星、尾度
 */

'use client';

import React from 'react';

// ════════════════════════════════════════════════════════════════════════════
// 常量定义
// ════════════════════════════════════════════════════════════════════════════

const SIGN_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const SIGN_COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#A8D8EA', '#FFB6B9', '#61C0BF', '#BBDED6', '#8B9DC3'];

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
  North_Node: '☊', South_Node: '☋',
};

const PLANET_COLORS: Record<string, string> = {
  Sun: '#FFD700', Moon: '#C0C0C0', Mercury: '#B0B0B0', Venus: '#FFB6C1', Mars: '#FF4500',
  Jupiter: '#FFA500', Saturn: '#8B4513', Uranus: '#00CED1', Neptune: '#4169E1', Pluto: '#8B0000',
  North_Node: '#9370DB', South_Node: '#696969',
};

// 尊贵系统 (Dignities & Debilities)
const DIGNITIES: Record<string, number> = {
  // Rulership (守护)
  Sun: 0, Moon: 1, Mercury: 2, Venus: 3, Mars: 4, Jupiter: 5, Saturn: 6,
  // Exaltation (耀升)
  Sun_exalt: 10, Moon_exalt: 11, Mercury_exalt: 12, Venus_exalt: 13, Mars_exalt: 14, Jupiter_exalt: 15, Saturn_exalt: 16,
  // Detriment (陷)
  Sun_det: -4, Moon_det: -5, Mercury_det: -6, Venus_det: -7, Mars_det: -8, Jupiter_det: -9, Saturn_det: -10,
  // Fall (落)
  Sun_fall: -14, Moon_fall: -15, Mercury_fall: -16, Venus_fall: -17, Mars_fall: -18, Jupiter_fall: -19, Saturn_fall: -20,
};

// 相位类型定义
const ASPECT_TYPES = {
  Conjunction: { color: '#FFD700', label: '合', cssClass: 'conjunction' },
  Sextile: { color: '#4169E1', label: '六', cssClass: 'sextile' },
  Square: { color: '#FF4500', label: '四', cssClass: 'square' },
  Trine: { color: '#32CD32', label: '三', cssClass: 'trine' },
  Opposition: { color: '#9370DB', label: '冲', cssClass: 'opposition' },
};

// ════════════════════════════════════════════════════════════════════════════
// 工具函数
// ════════════════════════════════════════════════════════════════════════════

function normalize(a: number): number {
  return ((a % 360) + 360) % 360;
}

function getSignIndex(lon: number): number {
  return Math.floor(normalize(lon) / 30);
}

// 获取尊贵状态文本
function getDignityStatus(planet: string, lon: number): { text: string; color: string } | null {
  const signIdx = getSignIndex(lon);
  const degInSign = normalize(lon) % 30;
  
  // 守护星映射
  const rulerships: Record<string, number> = {
    'Sun': 0, 'Moon': 1, 'Mercury': 2, 'Venus': 3, 'Mars': 4,
    'Jupiter': 5, 'Saturn': 6
  };
  
  // 耀升点（度数值）
  const exaltations: Record<string, number> = {
    'Sun': 19, 'Moon': 3, 'Mercury': 15, 'Venus': 27, 'Mars': 28,
    'Jupiter': 3, 'Saturn': 21
  };
  
  // 检查守护
  if (rulerships[planet] !== undefined && rulerships[planet] === signIdx) {
    return { text: '守', color: '#22C55E' };
  }
  
  // 检查耀升
  if (exaltations[planet] !== undefined) {
    const exaltDeg = exaltations[planet];
    if (Math.abs(degInSign - exaltDeg) < 3) {
      return { text: '耀', color: '#3B82F6' };
    }
  }
  
  // 检查陷（对分守护）
  if (rulerships[planet] !== undefined) {
    const oppositeSign = (rulerships[planet] + 6) % 12;
    if (signIdx === oppositeSign) {
      return { text: '陷', color: '#EF4444' };
    }
  }
  
  // 检查落（对分耀升）
  if (exaltations[planet] !== undefined) {
    const oppExalt = (Math.floor(exaltations[planet] / 30) + 6) % 12;
    if (signIdx === oppExalt && Math.abs(degInSign - (exaltations[planet] % 30)) < 3) {
      return { text: '落', color: '#F97316' };
    }
  }
  
  return null;
}

// ════════════════════════════════════════════════════════════════════════════
// 子组件
// ════════════════════════════════════════════════════════════════════════════

interface PlanetTableProps {
  planets: any;
  houses: any[];
  lang?: string;
}

function PlanetTable({ planets, houses, lang = 'zh' }: PlanetTableProps) {
  const PLANET_KEYS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
  
  // 找出每个宫位落入的行星
  const planetHouseMap: Record<string, number> = {};
  (houses || []).forEach((h: any, idx: number) => {
    // 简化：只检查落入情况，实际需要更精确的边界计算
  });
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-2 px-3 text-slate-400 font-medium">{lang === 'zh' ? '行星' : 'Planet'}</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">{lang === 'zh' ? '度数' : 'Degree'}</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">{lang === 'zh' ? '星座' : 'Sign'}</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">{lang === 'zh' ? '宫位' : 'House'}</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">{lang === 'zh' ? '状态' : 'Status'}</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">{lang === 'zh' ? '速度' : 'Speed'}</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">{lang === 'zh' ? '逆行' : 'R'}</th>
          </tr>
        </thead>
        <tbody>
          {PLANET_KEYS.map(key => {
            const p = planets?.[key];
            if (!p || p.error || p.longitude == null) return null;
            
            const signIdx = getSignIndex(p.longitude);
            const deg = normalize(p.longitude) % 30;
            const min = Math.floor((deg % 1) * 60);
            const sec = Math.floor(((deg % 1) * 60 % 1) * 60);
            const dignity = getDignityStatus(key, p.longitude);
            
            return (
              <tr key={key} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-base"
                      style={{ fontFamily: 'Segoe UI Symbol, Apple Symbols, serif', color: PLANET_COLORS[key] }}
                    >
                      {PLANET_SYMBOLS[key] || key[0]}
                    </span>
                    <span className="text-amber-400 font-medium">
                      {key === 'Sun' ? (lang === 'zh' ? '太阳' : key) :
                       key === 'Moon' ? (lang === 'zh' ? '月亮' : key) :
                       key === 'Mercury' ? (lang === 'zh' ? '水星' : key) :
                       key === 'Venus' ? (lang === 'zh' ? '金星' : key) :
                       key === 'Mars' ? (lang === 'zh' ? '火星' : key) :
                       key === 'Jupiter' ? (lang === 'zh' ? '木星' : key) :
                       key === 'Saturn' ? (lang === 'zh' ? '土星' : key) :
                       key === 'Uranus' ? (lang === 'zh' ? '天王' : key) :
                       key === 'Neptune' ? (lang === 'zh' ? '海王' : key) :
                       key === 'Pluto' ? (lang === 'zh' ? '冥王' : key) : key}
                    </span>
                  </div>
                </td>
                <td className="py-2 px-3 text-slate-300 font-mono">
                  {Math.floor(deg)}°{min.toString().padStart(2, '0')}′{sec.toString().padStart(2, '0')}″
                </td>
                <td className="py-2 px-3">
                  <span 
                    className="text-sm mr-1"
                    style={{ color: SIGN_COLORS[signIdx] }}
                  >
                    {SIGN_SYMBOLS[signIdx]}
                  </span>
                  <span className="text-slate-400 text-xs">
                    {p.sign || ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'][signIdx]}
                  </span>
                </td>
                <td className="py-2 px-3 text-slate-300">
                  {/* 简化：实际需要计算宫位边界 */}
                  <span className="text-slate-500 text-xs">—</span>
                </td>
                <td className="py-2 px-3">
                  {dignity ? (
                    <span 
                      className="px-1.5 py-0.5 rounded text-xs font-bold"
                      style={{ backgroundColor: `${dignity.color}20`, color: dignity.color }}
                    >
                      {dignity.text}
                    </span>
                  ) : (
                    <span className="text-slate-600 text-xs">—</span>
                  )}
                </td>
                <td className="py-2 px-3 text-slate-400 font-mono text-xs">
                  {p.speed != null ? `${p.speed > 0 ? '+' : ''}${p.speed.toFixed(2)}°/d` : '—'}
                </td>
                <td className="py-2 px-3">
                  {p.retrograde ? (
                    <span className="text-red-400 text-xs font-bold">R</span>
                  ) : (
                    <span className="text-slate-600 text-xs">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface AspectTableProps {
  aspects: any[];
  lang?: string;
}

function AspectTable({ aspects, lang = 'zh' }: AspectTableProps) {
  const validAspects = (aspects || []).filter((a: any) => {
    const typ = a.aspect || a.type;
    return ['Conjunction', 'Sextile', 'Square', 'Trine', 'Opposition'].includes(typ);
  });
  
  if (validAspects.length === 0) {
    return (
      <p className="text-center text-slate-500 py-4">
        {lang === 'zh' ? '暂无相位数据' : 'No aspect data'}
      </p>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-2 px-3 text-slate-400 font-medium">{lang === 'zh' ? '行星1' : 'Planet 1'}</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">{lang === 'zh' ? '相位' : 'Aspect'}</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">{lang === 'zh' ? '行星2' : 'Planet 2'}</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">{lang === 'zh' ? '精确度数' : 'Exact'}</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">{lang === 'zh' ? '容许度' : 'Orb'}</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">{lang === 'zh' ? '性质' : 'Nature'}</th>
          </tr>
        </thead>
        <tbody>
          {validAspects.map((a: any, i: number) => {
            const typ = a.aspect || a.type;
            const aspStyle = ASPECT_TYPES[typ as keyof typeof ASPECT_TYPES] || ASPECT_TYPES.Conjunction;
            const isPositive = typ === 'Trine' || typ === 'Sextile';
            const isNegative = typ === 'Square' || typ === 'Opposition';
            
            return (
              <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-2 px-3">
                  <div className="flex items-center gap-1">
                    <span 
                      style={{ fontFamily: 'Segoe UI Symbol, Apple Symbols, serif', color: PLANET_COLORS[a.planet1] }}
                    >
                      {PLANET_SYMBOLS[a.planet1] || a.planet1?.[0]}
                    </span>
                    <span className="text-slate-400 text-xs">{a.planet1}</span>
                  </div>
                </td>
                <td className="py-2 px-3">
                  <span 
                    className="px-2 py-0.5 rounded font-bold text-xs"
                    style={{ backgroundColor: `${aspStyle.color}20`, color: aspStyle.color }}
                  >
                    {aspStyle.label} {typ}
                  </span>
                </td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-1">
                    <span 
                      style={{ fontFamily: 'Segoe UI Symbol, Apple Symbols, serif', color: PLANET_COLORS[a.planet2] }}
                    >
                      {PLANET_SYMBOLS[a.planet2] || a.planet2?.[0]}
                    </span>
                    <span className="text-slate-400 text-xs">{a.planet2}</span>
                  </div>
                </td>
                <td className="py-2 px-3 text-slate-300 font-mono">
                  {a.exact != null ? `${a.exact.toFixed(2)}°` : '—'}
                </td>
                <td className="py-2 px-3">
                  <span className={`
                    ${a.orb <= 1 ? 'text-green-400' : a.orb <= 3 ? 'text-yellow-400' : 'text-slate-400'}
                    font-mono
                  `}>
                    {a.orb != null ? `${a.orb.toFixed(1)}°` : '—'}
                  </span>
                </td>
                <td className="py-2 px-3">
                  <span className={`
                    text-xs px-1.5 py-0.5 rounded
                    ${isPositive ? 'bg-green-500/20 text-green-400' : isNegative ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}
                  `}>
                    {isPositive ? (lang === 'zh' ? '和谐' : 'Harm') : isNegative ? (lang === 'zh' ? '紧张' : 'Tense') : (lang === 'zh' ? '中性' : 'Neutral')}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface HouseTableProps {
  houses: any[];
  planets: any;
  lang?: string;
}

function HouseTable({ houses, planets, lang = 'zh' }: HouseTableProps) {
  // 找出每个宫位落入的行星
  const planetInHouse: Record<number, string[]> = {};
  PLANET_SYMBOLS && Object.keys(PLANET_SYMBOLS).forEach(pKey => {
    const p = planets?.[pKey];
    if (!p || p.error || p.house == null) return;
    const h = p.house;
    if (!planetInHouse[h]) planetInHouse[h] = [];
    planetInHouse[h].push(PLANET_SYMBOLS[pKey] || pKey[0]);
  });
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-2 px-3 text-slate-400 font-medium">{lang === 'zh' ? '宫位' : 'House'}</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">{lang === 'zh' ? '起始度数' : 'Cusp'}</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">{lang === 'zh' ? '星座' : 'Sign'}</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">{lang === 'zh' ? '落入' : 'Planets'}</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">{lang === 'zh' ? '类型' : 'Type'}</th>
          </tr>
        </thead>
        <tbody>
          {(houses || []).map((h: any) => {
            const isAngular = [1, 4, 7, 10].includes(h.house);
            const isSuccedent = [2, 5, 8, 11].includes(h.house);
            const signIdx = getSignIndex(h.longitude);
            const deg = normalize(h.longitude) % 30;
            const min = Math.floor((deg % 1) * 60);
            
            return (
              <tr key={h.house} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-2 px-3">
                  <span className={`
                    font-bold
                    ${isAngular ? 'text-amber-400' : isSuccedent ? 'text-cyan-400' : 'text-slate-300'}
                  `}>
                    {h.house}
                  </span>
                </td>
                <td className="py-2 px-3 text-slate-300 font-mono">
                  {Math.floor(deg)}°{min.toString().padStart(2, '0')}′
                </td>
                <td className="py-2 px-3">
                  <span style={{ color: SIGN_COLORS[signIdx] }}>{SIGN_SYMBOLS[signIdx]}</span>
                  <span className="text-slate-400 text-xs ml-1">
                    {h.sign || ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'][signIdx]}
                  </span>
                </td>
                <td className="py-2 px-3">
                  {planetInHouse[h.house]?.length ? (
                    <div className="flex gap-1 flex-wrap">
                      {planetInHouse[h.house].map((sym, i) => (
                        <span 
                          key={i}
                          className="text-amber-400"
                          style={{ fontFamily: 'Segoe UI Symbol, Apple Symbols, serif' }}
                        >
                          {sym}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </td>
                <td className="py-2 px-3">
                  {isAngular ? (
                    <span className="text-amber-500/60 text-xs">{lang === 'zh' ? '角宫' : 'Angular'}</span>
                  ) : isSuccedent ? (
                    <span className="text-cyan-500/60 text-xs">{lang === 'zh' ? '续宫' : 'Succedent'}</span>
                  ) : (
                    <span className="text-slate-500/60 text-xs">{lang === 'zh' ? '果宫' : 'Cadent'}</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 主组件
// ════════════════════════════════════════════════════════════════════════════

interface ProfessionalDataTablesProps {
  planets: any;
  houses: any[];
  aspects: any[];
  lang?: 'zh' | 'en' | 'id';
}

export default function ProfessionalDataTables({
  planets,
  houses,
  aspects,
  lang = 'zh',
}: ProfessionalDataTablesProps) {
  const [activeTab, setActiveTab] = React.useState<'planets' | 'aspects' | 'houses'>('planets');
  
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      {/* Tab 导航 */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('planets')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'planets' 
              ? 'bg-purple-600 text-white' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {lang === 'zh' ? '行星位置' : lang === 'id' ? 'Posisi Planet' : 'Planet Positions'}
        </button>
        <button
          onClick={() => setActiveTab('aspects')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'aspects' 
              ? 'bg-purple-600 text-white' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {lang === 'zh' ? '相位容许度' : lang === 'id' ? 'Aspek Orb' : 'Aspect Orbs'}
        </button>
        <button
          onClick={() => setActiveTab('houses')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'houses' 
              ? 'bg-purple-600 text-white' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {lang === 'zh' ? '宫位详情' : lang === 'id' ? 'Detail Rumah' : 'House Details'}
        </button>
      </div>
      
      {/* 内容 */}
      <div className="p-4">
        {activeTab === 'planets' && (
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <span className="text-amber-400">☉</span>
              {lang === 'zh' ? '行星黄道经度与尊贵状态' : 'Planetary Ecliptic Longitude & Dignities'}
            </h4>
            <PlanetTable planets={planets} houses={houses} lang={lang} />
          </div>
        )}
        
        {activeTab === 'aspects' && (
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <span className="text-purple-400">☌</span>
              {lang === 'zh' ? '相位精确度数与容许度' : 'Exact Aspect Degrees & Orbs'}
            </h4>
            <AspectTable aspects={aspects} lang={lang} />
          </div>
        )}
        
        {activeTab === 'houses' && (
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <span className="text-cyan-400">①</span>
              {lang === 'zh' ? '十二宫位起始度数与落入行星' : '12 House Cusps & Planets in House'}
            </h4>
            <HouseTable houses={houses} planets={planets} lang={lang} />
          </div>
        )}
      </div>
    </div>
  );
}