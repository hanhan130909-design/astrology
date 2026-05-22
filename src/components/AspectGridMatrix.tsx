/**
 * Aspect Grid Matrix — almuten.net professional style
 * 亮色主题，大单元格，专业布局
 */

"use client";
import React from "react";

const GRID_PLANETS = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'North_Node',
];

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
  North_Node: '☊',
};

const PLANET_NAMES_CN: Record<string, string> = {
  Sun: '太阳', Moon: '月亮', Mercury: '水星', Venus: '金星', Mars: '火星',
  Jupiter: '木星', Saturn: '土星', Uranus: '天王', Neptune: '海王', Pluto: '冥王', North_Node: '北交',
};

const ASPECT_STYLES: Record<string, { symbol: string; color: string; bg: string }> = {
  Conjunction:  { symbol: '☌', color: '#B8860B', bg: '#FFF8E1' },
  Sextile:      { symbol: '✧', color: '#2563EB', bg: '#EFF6FF' },
  Square:       { symbol: '□', color: '#DC2626', bg: '#FEF2F2' },
  Trine:        { symbol: '△', color: '#16A34A', bg: '#F0FDF4' },
  Opposition:   { symbol: '☍', color: '#7C3AED', bg: '#F5F3FF' },
};

interface Props {
  planets: any;
  aspects: any[];
  ascendant?: number;
  midheaven?: number;
  lang?: string;
}

export default function AspectGridMatrix({ planets, aspects, ascendant, midheaven, lang = 'zh' }: Props) {
  // Build aspect lookup
  const aspectMap = new Map<string, string>();
  (aspects || []).forEach((a: any) => {
    const t = a.aspect || a.type;
    if (['Conjunction', 'Sextile', 'Square', 'Trine', 'Opposition'].includes(t)) {
      aspectMap.set(`${a.planet1}-${a.planet2}`, t);
      aspectMap.set(`${a.planet2}-${a.planet1}`, t);
    }
  });

  const SIGN_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

  const getLon = (key: string): number => {
    if (key === 'Ascendant') return ascendant || 0;
    if (key === 'Midheaven') return midheaven || 0;
    return planets?.[key]?.longitude || 0;
  };

  const formatCellDeg = (key: string): string => {
    const lon = getLon(key);
    const signIdx = Math.floor(((lon % 360) + 360) % 360 / 30);
    const deg = ((lon % 360) + 360) % 360 % 30;
    return `${Math.floor(deg)}°${SIGN_SYMBOLS[signIdx]}`;
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[560px]">
        {/* 标题栏 */}
        <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 rounded-t-lg">
          <span className="text-xs font-semibold text-slate-700">
            {lang === 'zh' ? '相位矩阵' : 'Aspect Matrix'} / Aspect Grid
          </span>
        </div>

        <table className="border-collapse text-xs w-full" style={{ background: '#ffffff' }}>
          <thead>
            <tr>
              {/* 左上角空白格 */}
              <th className="p-1 border border-slate-200 bg-slate-50 sticky left-0 z-10 min-w-[48px]">
                <span className="text-[10px] text-slate-500 block">
                  {lang === 'zh' ? '行星' : 'Planet'}
                </span>
              </th>
              {GRID_PLANETS.map(p => (
                <th
                  key={p}
                  className="p-1 border border-slate-200 bg-slate-50 text-center min-w-[44px]"
                >
                  {/* 大符号 */}
                  <span
                    className="block text-lg leading-tight"
                    style={{ fontFamily: "Segoe UI Symbol, Apple Symbols, Noto Sans Symbols 2, serif" }}
                  >
                    {PLANET_SYMBOLS[p] || p[0]}
                  </span>
                  {/* 中文名 */}
                  <span className="text-[9px] text-slate-500 block">{PLANET_NAMES_CN[p] || p}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GRID_PLANETS.map(row => (
              <tr key={row}>
                {/* 第一列 */}
                <td className="p-1 border border-slate-200 bg-slate-50 text-center min-w-[48px] sticky left-0 z-10">
                  <span
                    className="block text-lg leading-tight"
                    style={{ fontFamily: "Segoe UI Symbol, Apple Symbols, Noto Sans Symbols 2, serif" }}
                  >
                    {PLANET_SYMBOLS[row] || row[0]}
                  </span>
                  <span className="text-[9px] text-slate-500 block">{PLANET_NAMES_CN[row] || row}</span>
                </td>

                {GRID_PLANETS.map(col => {
                  // 对角线：显示位置
                  if (row === col) {
                    return (
                      <td
                        key={col}
                        className="p-1 border border-slate-200 bg-amber-50 text-center"
                      >
                        <span
                          className="text-[11px] text-slate-700 block"
                          style={{ fontFamily: "Segoe UI Symbol, Apple Symbols, Noto Sans Symbols 2, serif" }}
                        >
                          {PLANET_SYMBOLS[row]}{' '}{formatCellDeg(col)}
                        </span>
                      </td>
                    );
                  }

                  const asp = aspectMap.get(`${row}-${col}`);
                  if (!asp) {
                    return (
                      <td
                        key={col}
                        className="p-1 border border-slate-100 bg-white hover:bg-slate-50 transition-colors"
                      />
                    );
                  }

                  const style = ASPECT_STYLES[asp];
                  return (
                    <td
                      key={col}
                      className="p-1 border border-slate-200 text-center transition-colors hover:brightness-95 cursor-default"
                      style={{ backgroundColor: style.bg }}
                    >
                      <span
                        className="text-xl font-bold leading-none"
                        style={{ color: style.color }}
                      >
                        {style.symbol}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* 图例 */}
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 rounded-b-lg flex flex-wrap gap-3">
          {Object.entries(ASPECT_STYLES).map(([key, val]) => (
            <span key={key} className="flex items-center gap-1 text-[10px] text-slate-600">
              <span className="text-base font-bold" style={{ color: val.color }}>{val.symbol}</span>
              <span>{key === 'Conjunction' ? '合相' : key === 'Sextile' ? '六分' : key === 'Square' ? '四分' : key === 'Trine' ? '三分' : '对分'}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
