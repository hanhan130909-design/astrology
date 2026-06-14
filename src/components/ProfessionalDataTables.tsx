/**
 * Professional Data Tables Component
 * Professional astrology data display (almuten.net style)
 */

'use client';

import React from 'react';

const SIGN_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
const SIGN_COLORS = ['#FF6B6B','#4ECDC4','#FFE66D','#95E1D3','#F38181','#AA96DA','#FCBAD3','#A8D8EA','#FFB6B9','#61C0BF','#BBDED6','#8B9DC3'];
const PLANET_SYMBOLS = { Sun:'☉', Moon:'☽', Mercury:'☿', Venus:'♀', Mars:'♂', Jupiter:'♓', Saturn:'♄', Uranus:'♅', Neptune:'♔', Pluto:'♕' };
const PLANET_COLORS = { Sun:'#FFD700', Moon:'#C0C0C0', Mercury:'#B0B0B0', Venus:'#FFB6C1', Mars:'#FF4500', Jupiter:'#FFA500', Saturn:'#8B4513', Uranus:'#00CED1', Neptune:'#4169E1', Pluto:'#8B0000' };

const ASPECT_TYPES = {
  Conjunction:  { color:"#FFD700", label:"合" },
  Sextile:      { color:"#4169E1", label:"六" },
  Square:       { color:"#FF4500", label:"四" },
  Trine:        { color:"#32CD32", label:"三" },
  Opposition:   { color:"#9370DB", label:"冲" },
};

function normalize(a) { return ((a % 360) + 360) % 360; }
function getSignIndex(lon) { return Math.floor(normalize(lon) / 30); }

function getDignityStatus(planet, lon) {
  const signIdx = getSignIndex(lon);
  const degInSign = normalize(lon) % 30;
  const rulerships: Record<string, number> = { Sun:0, Moon:1, Mercury:2, Venus:3, Mars:4, Jupiter:5, Saturn:6 };
  const exaltations: Record<string, number> = { Sun:19, Moon:3, Mercury:15, Venus:27, Mars:28, Jupiter:3, Saturn:21 };
  if (rulerships[planet] !== undefined && rulerships[planet] === signIdx) return { text:"守", color:"#22C55E" };
  if (exaltations[planet] !== undefined && Math.abs(degInSign - exaltations[planet]) < 3) return { text:"耀", color:"#3B82F6" };
  if (rulerships[planet] !== undefined && (rulerships[planet] + 6) % 12 === signIdx) return { text:"陷", color:"#EF4444" };
  return null;
}

interface PlanetTableProps { planets: any; houses: any[]; lang?: string; }
function PlanetTable({ planets, houses, lang='zh' }: PlanetTableProps) {
  const KEYS = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto'];
  const NAMES: Record<string, string> = { Sun:'太阳', Moon:'月亮', Mercury:'水星', Venus:'金星', Mars:'火星', Jupiter:'木星', Saturn:'土星', Uranus:'天王', Neptune:'海王', Pluto:'冥王' };
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-2 px-3 text-gray-500">行星</th>
            <th className="text-left py-2 px-3 text-gray-500">度数</th>
            <th className="text-left py-2 px-3 text-gray-500">星座</th>
            <th className="text-left py-2 px-3 text-gray-500">状态</th>
            <th className="text-left py-2 px-3 text-gray-500">速度</th>
            <th className="text-left py-2 px-3 text-gray-500">逆</th>
          </tr>
        </thead>
        <tbody>
          {KEYS.map(key => {
            const p = planets?.[key];
            if (!p || p.error || p.longitude == null) return null;
            const signIdx = getSignIndex(p.longitude);
            const deg = normalize(p.longitude) % 30;
            const min = Math.floor((deg % 1) * 60);
            const sec = Math.floor(((deg % 1) * 60 % 1) * 60);
            const dignity = getDignityStatus(key, p.longitude);
            return (
              <tr key={key} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-2 px-3"><div className="flex items-center gap-2"><span style={{fontFamily:'Segoe UI Symbol, Apple Symbols, serif',color:PLANET_COLORS[key]}}>{PLANET_SYMBOLS[key]}</span><span className="text-gray-600">{NAMES[key] || key}</span></div></td>
                <td className="py-2 px-3 text-gray-600 font-mono">{Math.floor(deg)}°{min.toString().padStart(2,'0')}′{sec.toString().padStart(2,'0')}″</td>
                <td className="py-2 px-3"><span style={{color:SIGN_COLORS[signIdx]}}>{SIGN_SYMBOLS[signIdx]}</span></td>
                <td className="py-2 px-3">{dignity ? <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{backgroundColor:dignity.color+'20',color:dignity.color}}>{dignity.text}</span> : <span className="text-gray-600">—</span>}</td>
                <td className="py-2 px-3 text-gray-500 font-mono text-xs">{p.speed != null ? p.speed.toFixed(2)+'°/d' : '—'}</td>
                <td className="py-2 px-3">{p.retrograde ? <span className="text-gray-400 text-xs font-bold">R</span> : <span className="text-gray-600">—</span>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface AspectTableProps { aspects: any[]; lang?: string; }
function AspectTable({ aspects, lang='zh' }: AspectTableProps) {
  const valid = (aspects || []).filter((a: any) => ['Conjunction','Sextile','Square','Trine','Opposition'].includes(a.aspect || a.type));
  if (!valid.length) return <p className="text-center text-gray-400 py-4">暂无相位数据</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-2 px-3 text-gray-500">行星1</th>
            <th className="text-left py-2 px-3 text-gray-500">相位</th>
            <th className="text-left py-2 px-3 text-gray-500">行星2</th>
            <th className="text-left py-2 px-3 text-gray-500">精确度</th>
            <th className="text-left py-2 px-3 text-gray-500">容计度</th>
            <th className="text-left py-2 px-3 text-gray-500">性质</th>
          </tr>
        </thead>
        <tbody>
          {valid.map((a: any, i: number) => {
            const typ = a.aspect || a.type;
            const st = ASPECT_TYPES[typ as keyof typeof ASPECT_TYPES] || ASPECT_TYPES.Conjunction;
            const isPos = typ === 'Trine' || typ === 'Sextile';
            const isNeg = typ === 'Square' || typ === 'Opposition';
            return (
              <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-2 px-3"><span style={{fontFamily:'Segoe UI Symbol, serif',color:PLANET_COLORS[a.planet1 as keyof typeof PLANET_COLORS]}}>{PLANET_SYMBOLS[a.planet1 as keyof typeof PLANET_SYMBOLS] || a.planet1?.[0]}</span></td>
                <td className="py-2 px-3"><span className="px-2 py-0.5 rounded text-xs font-bold" style={{backgroundColor:st.color+'20',color:st.color}}>{st.label} {typ}</span></td>
                <td className="py-2 px-3"><span style={{fontFamily:'Segoe UI Symbol, serif',color:PLANET_COLORS[a.planet2 as keyof typeof PLANET_COLORS]}}>{PLANET_SYMBOLS[a.planet2 as keyof typeof PLANET_SYMBOLS] || a.planet2?.[0]}</span></td>
                <td className="py-2 px-3 text-gray-600 font-mono">{a.exact != null ? a.exact.toFixed(2)+'°' : '—'}</td>
                <td className="py-2 px-3"><span className={a.orb <= 1 ? 'text-gray-400' : a.orb <= 3 ? 'text-gray-400' : 'text-gray-500'}>{a.orb != null ? a.orb.toFixed(1)+'°' : '—'}</span></td>
                <td className="py-2 px-3"><span className={'text-xs px-1.5 py-0.5 rounded ' + (isPos ? 'bg-gray-500/20 text-gray-400' : isNeg ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-500/20 text-gray-400')}>{isPos ? '和谱' : isNeg ? '紧张' : '中性'}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface HouseTableProps { houses: any[]; planets: any; lang?: string; }
function HouseTable({ houses, planets, lang='zh' }: HouseTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-2 px-3 text-gray-500">室位</th>
            <th className="text-left py-2 px-3 text-gray-500">起始度数</th>
            <th className="text-left py-2 px-3 text-gray-500">星座</th>
            <th className="text-left py-2 px-3 text-gray-500">落入</th>
            <th className="text-left py-2 px-3 text-gray-500">类型</th>
          </tr>
        </thead>
        <tbody>
          {(houses || []).map((h: any) => {
            const isAng = [1,4,7,10].includes(h.house);
            const isSuc = [2,5,8,11].includes(h.house);
            const signIdx = getSignIndex(h.longitude);
            const deg = normalize(h.longitude) % 30;
            const min = Math.floor((deg % 1) * 60);
            return (
              <tr key={h.house} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-2 px-3"><span className={isAng ? 'text-gray-600' : isSuc ? 'text-gray-400' : 'text-gray-600'}>{h.house}</span></td>
                <td className="py-2 px-3 text-gray-600 font-mono">{Math.floor(deg)}°{min.toString().padStart(2,'0')}′</td>
                <td className="py-2 px-3"><span style={{color:SIGN_COLORS[signIdx]}}>{SIGN_SYMBOLS[signIdx]}</span></td>
                <td className="py-2 px-3"><span className="text-gray-600">—</span></td>
                <td className="py-2 px-3"><span className="text-gray-400/60 text-xs">{isAng ? '角室' : isSuc ? '续室' : '果室'}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface Props { planets: any; houses: any[]; aspects: any[]; lang?: 'zh'|'en'|'id'; }
export default function ProfessionalDataTables({ planets, houses, aspects, lang='zh' }: Props) {
  const [tab, setTab] = React.useState<'planets'|'aspects'|'houses'>('planets');
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      <div className="flex border-b border-white/10">
        {[['planets','行星位置'],['aspects','相位容计度'],['houses','室位详情']].map(([t, label]) => (
          <button key={t} onClick={() => setTab(t as any)} className={'flex-1 py-3 px-4 text-sm font-medium transition-colors ' + (tab === t ? 'bg-gray-600 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5')}>{label}</button>
        ))}
      </div>
      <div className="p-4">
        {tab === 'planets' && <PlanetTable planets={planets} houses={houses} lang={lang} />}
        {tab === 'aspects' && <AspectTable aspects={aspects} lang={lang} />}
        {tab === 'houses' && <HouseTable houses={houses} planets={planets} lang={lang} />}
      </div>
    </div>
  );
}
