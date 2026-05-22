/**
 * Professional Natal Chart SVG Component
 * 参考 hanhan 已客 (almuten.net) 专业占星样式 — 亮色主题
 * 改进：行星图标增加文字标签（Su/Mo/Me...）提升可识别性
 */

"use client";

import React from "react";

// ════════════════════════════════════════════════════════════════════════════
// 常量定义 — 亮色主题
// ════════════════════════════════════════════════════════════════════════════

const SIGN_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const SIGN_NAMES_CN = ['白羊', '金牛', '双子', '巨蟹', '狮子', '处女', '天秤', '天蝎', '射手', '摩羯', '水瓶', '双鱼'];

// 浅色 pastel 星座背景色（极淡）
const SIGN_BG: Record<number, string> = {
  0: '#FFE4E1', 1: '#E8F5E9', 2: '#FFF8E1', 3: '#E3F2FD',
  4: '#FFF3E0', 5: '#F3E5F5', 6: '#FCE4EC', 7: '#EFEBE9',
  8: '#E0F2F1', 9: '#ECEFF1', 10: '#EDE7F6', 11: '#E1F5FE',
};

// 行星符号 Unicode（主图标）
const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
  North_Node: '☊', South_Node: '☋', Chiron: '⚷', Lilith: '⚷',
};

// 行星文字标签（解决符号难识别问题）
const PLANET_LABELS: Record<string, string> = {
  Sun: 'Su', Moon: 'Mo', Mercury: 'Me', Venus: 'Ve', Mars: 'Ma',
  Jupiter: 'Ju', Saturn: 'Sa', Uranus: 'Ur', Neptune: 'Ne', Pluto: 'Pl',
  North_Node: 'NN', South_Node: 'SN', Chiron: 'Ch', Lilith: 'Li',
};

// 行星颜色
const PLANET_COLORS: Record<string, string> = {
  Sun: '#C9851A', Moon: '#8B7355', Mercury: '#5A6E8A', Venus: '#C0392B',
  Mars: '#B22222', Jupiter: '#B8860B', Saturn: '#6B5344', Uranus: '#1E6B7A',
  Neptune: '#2C5080', Pluto: '#6B2D5B', North_Node: '#7B5EA7', South_Node: '#6D6D6D',
  Chiron: '#1A7A6E', Lilith: '#4A4080',
};

const PLANET_KEYS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'North_Node'];

// 相位颜色（浅色背景适配）
const ASPECT_COLORS: Record<string, string> = {
  Conjunction: '#B8860B',
  Sextile: '#3B82F6',
  Square: '#DC2626',
  Trine: '#16A34A',
  Opposition: '#7C3AED',
};

const ASPECT_WIDTH: Record<string, number> = {
  Conjunction: 2.0,
  Sextile: 1.3,
  Square: 1.8,
  Trine: 1.5,
  Opposition: 2.0,
};

// ════════════════════════════════════════════════════════════════════════════
// 工具函数
// ════════════════════════════════════════════════════════════════════════════

function normalize(a: number): number {
  return ((a % 360) + 360) % 360;
}

// ════════════════════════════════════════════════════════════════════════════
// 主组件
// ════════════════════════════════════════════════════════════════════════════

interface ProfessionalNatalChartProps {
  planets: any;
  houses: any[];
  aspects: any[];
  ascendant?: number;
  midheaven?: number;
  size?: number;
  showDegrees?: boolean;
  showAspectLines?: boolean;
}

export default function ProfessionalNatalChart({
  planets,
  houses,
  aspects,
  ascendant = 0,
  midheaven = 0,
  size = 500,
  showDegrees = true,
  showAspectLines = true,
}: ProfessionalNatalChartProps) {
  const cx = size / 2;
  const cy = size / 2;

  // 环形尺寸
  const rOuter = cx - 6;
  const rSignOuter = rOuter;
  const rSignInner = rOuter - 38;
  const rHouseOuter = rSignInner - 2;
  const rHouseInner = rHouseOuter - 40;
  const rPlanet = rHouseInner - 22;
  const rCenter = 42;

  // ASC / MC
  const ascLon = ascendant || houses?.[0]?.longitude || 0;
  const mcLon = midheaven || houses?.[9]?.longitude || 0;

  // 黄道经度 → SVG 角度（ASC 在左侧，逆时针）
  const lonToAngle = (lon: number) => {
    const rel = ((lon - ascLon + 180) % 360 + 360) % 360;
    return (rel * Math.PI) / 180;
  };

  const lonToXY = (lon: number, radius: number) => ({
    x: cx + radius * Math.cos(lonToAngle(lon)),
    y: cy - radius * Math.sin(lonToAngle(lon)),
  });

  // 行星排序 + 防重叠
  const sortedPlanets = PLANET_KEYS
    .filter(k => planets?.[k] && !planets[k].error && planets[k].longitude != null)
    .map(k => ({ key: k, ...planets[k] }))
    .sort((a: any, b: any) => a.longitude - b.longitude);

  const CLUSTER_THRESHOLD = 7;
  const OFFSET_STEP = 13;
  const planetOffsets: Record<string, number> = {};

  const clusters: number[][] = [];
  let currentCluster: number[] = [];
  for (let i = 0; i < sortedPlanets.length; i++) {
    if (currentCluster.length === 0) { currentCluster.push(i); }
    else {
      const prev = sortedPlanets[currentCluster[currentCluster.length - 1]];
      const curr = sortedPlanets[i];
      const diff = ((curr.longitude - prev.longitude + 360) % 360 + 360) % 360;
      if (diff < CLUSTER_THRESHOLD) { currentCluster.push(i); }
      else { clusters.push(currentCluster); currentCluster = [i]; }
    }
  }
  if (currentCluster.length > 0) clusters.push(currentCluster);

  clusters.forEach(cluster => {
    if (cluster.length <= 1) { planetOffsets[sortedPlanets[cluster[0]].key] = 0; return; }
    const midIdx = Math.floor(cluster.length / 2);
    cluster.forEach((idx, rank) => {
      const offsetLevel = Math.abs(rank - midIdx);
      const direction = rank < midIdx ? -1 : 1;
      planetOffsets[sortedPlanets[idx].key] = direction * offsetLevel * OFFSET_STEP;
    });
  });

  // 行星位置（用于相位线）
  const planetPositions: Record<string, { x: number; y: number }> = {};
  PLANET_KEYS.forEach(key => {
    const p = planets?.[key];
    if (!p?.error && p?.longitude != null) {
      const off = planetOffsets[key] || 0;
      planetPositions[key] = lonToXY(p.longitude, rPlanet + off);
    }
  });

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-full max-w-2xl mx-auto"
      style={{ background: '#fafafa' }}
      lang="zh"
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glowStrong" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <mask id="aspectMask">
          <rect width="100%" height="100%" fill="white" />
          <circle cx={cx} cy={cy} r={rCenter * 0.5} fill="black" />
        </mask>

        {/* 行星符号 SVG 路径定义 */}
        <symbol id="sym-sun" viewBox="-14 -14 28 28" width="28" height="28">
          <circle cx="0" cy="0" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="2" fill="currentColor" />
        </symbol>
        <symbol id="sym-moon" viewBox="-14 -14 28 28" width="28" height="28">
          <path d="M0,-8 A8,8 0 1,1 0,8 A8,8 0 0,0 0,-8" fill="currentColor" />
        </symbol>
        <symbol id="sym-mercury" viewBox="-14 -14 28 28" width="28" height="28">
          <circle cx="0" cy="0" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="0" y1="-6" x2="0" y2="6" stroke="currentColor" strokeWidth="1.5" />
          <line x1="-8" y1="-4" x2="8" y2="-4" stroke="currentColor" strokeWidth="1.5" />
          <path d="M-4,-8 L0,-6 L4,-8" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </symbol>
        <symbol id="sym-venus" viewBox="-14 -14 28 28" width="28" height="28">
          <circle cx="0" cy="-2" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="0" y1="3" x2="0" y2="8" stroke="currentColor" strokeWidth="1.5" />
          <line x1="-5" y1="8" x2="5" y2="8" stroke="currentColor" strokeWidth="1.5" />
        </symbol>
        <symbol id="sym-mars" viewBox="-14 -14 28 28" width="28" height="28">
          <circle cx="0" cy="-2" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="0" y1="3" x2="0" y2="8" stroke="currentColor" strokeWidth="1.5" />
          <line x1="0" y1="8" x2="5" y2="8" stroke="currentColor" strokeWidth="1.5" />
        </symbol>
        <symbol id="sym-jupiter" viewBox="-14 -14 28 28" width="28" height="28">
          <path d="M-6,-6 L6,6 M-6,6 L6,-6" stroke="currentColor" strokeWidth="1.8" fill="none" />
          <line x1="-2" y1="-8" x2="-2" y2="8" stroke="currentColor" strokeWidth="1.5" />
        </symbol>
        <symbol id="sym-saturn" viewBox="-14 -14 28 28" width="28" height="28">
          <line x1="-6" y1="-6" x2="6" y2="-6" stroke="currentColor" strokeWidth="1.5" />
          <line x1="0" y1="-6" x2="0" y2="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M-4,6 L4,6" stroke="currentColor" strokeWidth="2" />
        </symbol>
        <symbol id="sym-uranus" viewBox="-14 -14 28 28" width="28" height="28">
          <circle cx="0" cy="0" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="-8" y1="0" x2="8" y2="0" stroke="currentColor" strokeWidth="1.5" />
        </symbol>
        <symbol id="sym-neptune" viewBox="-14 -14 28 28" width="28" height="28">
          <circle cx="0" cy="0" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M-6,4 Q0,8 6,4 M-4,6 Q0,10 4,6" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </symbol>
        <symbol id="sym-pluto" viewBox="-14 -14 28 28" width="28" height="28">
          <circle cx="0" cy="-3" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="0" cy="3" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="0" y1="-7" x2="0" y2="7" stroke="currentColor" strokeWidth="1.5" />
        </symbol>
        <symbol id="sym-north-node" viewBox="-14 -14 28 28" width="28" height="28">
          <path d="M0,-8 L6,0 L0,8 L-6,0 Z" fill="currentColor" />
        </symbol>
        <symbol id="sym-south-node" viewBox="-14 -14 28 28" width="28" height="28">
          <path d="M0,-8 L-6,0 L0,8 L6,0 Z" fill="currentColor" />
        </symbol>
      </defs>

      {/* 背景圆 */}
      <circle cx={cx} cy={cy} r={rOuter} fill="none" stroke="#d0d0d0" strokeWidth="1" />

      {/* 外圈：12 星座分段（pastel 淡色） */}
      {SIGN_SYMBOLS.map((_, i) => {
        const sa = lonToAngle(i * 30);
        const ea = lonToAngle((i + 1) * 30);
        const x1 = cx + rSignOuter * Math.cos(sa), y1 = cy - rSignOuter * Math.sin(sa);
        const x2 = cx + rSignOuter * Math.cos(ea), y2 = cy - rSignOuter * Math.sin(ea);
        const x3 = cx + rSignInner * Math.cos(ea), y3 = cy - rSignInner * Math.sin(ea);
        const x4 = cx + rSignInner * Math.cos(sa), y4 = cy - rSignInner * Math.sin(sa);
        const largeArc = (ea - sa + 2 * Math.PI) > Math.PI ? 1 : 0;
        return (
          <path
            key={`sign-${i}`}
            d={`M ${x1} ${y1} A ${rSignOuter} ${rSignOuter} 0 ${largeArc} 0 ${x2} ${y2} L ${x3} ${y3} A ${rSignInner} ${rSignInner} 0 ${largeArc} 1 ${x4} ${y4} Z`}
            fill={SIGN_BG[i]}
            opacity={0.7}
          />
        );
      })}

      {/* 星座圈边界 */}
      <circle cx={cx} cy={cy} r={rSignOuter} fill="none" stroke="#c0c0c0" strokeWidth="0.8" />
      <circle cx={cx} cy={cy} r={rSignInner} fill="none" stroke="#d8d8d8" strokeWidth="0.5" />

      {/* 360° 精细刻度线 - 专业占星风格 */}
      {Array.from({ length: 360 }, (_, i) => {
        const angle = lonToAngle(ascLon - Math.floor(ascLon / 30) * 30 + i);
        const is30 = i % 30 === 0;
        const is10 = i % 10 === 0;
        const is5 = i % 5 === 0;
        const rEnd = is30 ? rSignOuter - 14 : is10 ? rSignOuter - 10 : is5 ? rSignOuter - 6 : rSignOuter - 3;
        const p1 = { x: cx + rSignOuter * Math.cos(angle), y: cy - rSignOuter * Math.sin(angle) };
        const p2 = { x: cx + rEnd * Math.cos(angle), y: cy - rEnd * Math.sin(angle) };
        return (
          <line
            key={`tick-${i}`}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke={is30 ? '#888' : is10 ? '#bbb' : is5 ? '#ddd' : '#eee'}
            strokeWidth={is30 ? 1.5 : is10 ? 1.0 : is5 ? 0.6 : 0.3}
          />
        );
      })}

      {/* 30° 边界简化 - 只显示星座符号+度数 */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = lonToAngle(Math.floor(ascLon / 30) * 30 + i * 30);
        const signIdx = (i + Math.floor(ascLon / 30)) % 12;
        return (
          <text
            key={`deg-num-${i}`}
            x={cx + (rSignOuter - 28) * Math.cos(angle)}
            y={cy + 3 - (rSignOuter - 28) * Math.sin(angle)}
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
            fill="#555"
          >
            {i * 30}{SIGN_SYMBOLS[signIdx]}
          </text>
        );
      })}

      {/* 星座符号 */}
      {SIGN_SYMBOLS.map((sym, i) => {
        const pos = lonToXY(i * 30 + 15 + ascLon - Math.floor(ascLon / 30) * 30, (rSignOuter + rSignInner) / 2);
        return (
          <text
            key={`symbol-${i}`}
            x={pos.x}
            y={pos.y + 5}
            textAnchor="middle"
            fontSize="15"
            fontWeight="bold"
            fill="#555"
            filter="url(#glow)"
          >
            {sym}
          </text>
        );
      })}

      {/* 星座中文名称 */}
      {SIGN_NAMES_CN.map((name, i) => {
        const pos = lonToXY(i * 30 + 15 + ascLon - Math.floor(ascLon / 30) * 30, rSignInner + 10);
        return (
          <text key={`name-${i}`} x={pos.x} y={pos.y} textAnchor="middle" fontSize="6" fill="#999">
            {name}
          </text>
        );
      })}

      {/* 宫位圈 */}
      <circle cx={cx} cy={cy} r={rHouseOuter} fill="none" stroke="#d0d0d0" strokeWidth="0.5" />
      <circle cx={cx} cy={cy} r={rHouseInner} fill="none" stroke="#e0e0e0" strokeWidth="0.4" />

      {/* 宫位线 */}
      {(houses || []).map((h: any, idx: number) => {
        const isAngular = [1, 4, 7, 10].includes(h.house);
        const isSuccedent = [2, 5, 8, 11].includes(h.house);
        const p1 = lonToXY(h.longitude, rCenter + 4);
        const p2 = lonToXY(h.longitude, isAngular ? rSignOuter : rHouseOuter);
        return (
          <line
            key={`house-${idx}`}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke={isAngular ? '#555' : isSuccedent ? '#aaa' : '#ccc'}
            strokeWidth={isAngular ? 2.0 : 0.7}
            strokeDasharray={isAngular ? 'none' : '4 4'}
          />
        );
      })}

      {/* 宫位数字 */}
      {(houses || []).map((h: any, idx: number) => {
        const next = houses[(idx + 1) % (houses?.length || 12)];
        if (!next) return null;
        let midLon: number;
        if (h.longitude < next.longitude) { midLon = h.longitude + (next.longitude - h.longitude) / 2; }
        else { midLon = h.longitude + (next.longitude + 360 - h.longitude) / 2; }
        const numPos = lonToXY(midLon % 360, (rHouseOuter + rHouseInner) / 2);
        const isAngular = [1, 4, 7, 10].includes(h.house);
        return (
          <text
            key={`num-${idx}`}
            x={numPos.x}
            y={numPos.y + 4}
            textAnchor="middle"
            fontSize={isAngular ? '13' : '10'}
            fontWeight={isAngular ? 'bold' : 'normal'}
            fill={isAngular ? '#333' : '#888'}
          >
            {h.house}
          </text>
        );
      })}

      {/* 宫头度数 */}
      {showDegrees && (houses || []).map((h: any, idx: number) => {
        const degVal = h.degree != null ? h.degree : (h.longitude % 30);
        const signIdx = Math.floor(normalize(h.longitude) / 30);
        const degPos = lonToXY(h.longitude, rHouseInner - 12);
        const isAngular = [1, 4, 7, 10].includes(h.house);
        return (
          <text
            key={`deg-${idx}`}
            x={degPos.x}
            y={degPos.y + 3}
            textAnchor="middle"
            fontSize={isAngular ? '8' : '7'}
            fill={isAngular ? '#666' : '#aaa'}
          >
            {Math.floor(degVal)}°{SIGN_SYMBOLS[signIdx]}
          </text>
        );
      })}

      {/* 相位线 */}
      {showAspectLines && (
        <g mask="url(#aspectMask)">
          {(aspects || []).slice(0, 30).map((asp: any, i: number) => {
            const p1Pos = planetPositions[asp.planet1];
            const p2Pos = planetPositions[asp.planet2];
            if (!p1Pos || !p2Pos) return null;
            const aspType = asp.aspect || asp.type;
            const color = ASPECT_COLORS[aspType];
            const width = ASPECT_WIDTH[aspType] || 1.2;
            if (!color) return null;
            return (
              <line
                key={`asp-${i}`}
                x1={p1Pos.x}
                y1={p1Pos.y}
                x2={p2Pos.x}
                y2={p2Pos.y}
                stroke={color}
                strokeWidth={width}
                strokeOpacity={0.7}
              />
            );
          })}
        </g>
      )}

      {/* ASC 三角形标记 */}
      <g filter="url(#glowStrong)">
        {(() => {
          const p = lonToXY(ascLon, rHouseOuter + 18);
          return (
            <>
              <polygon
                points={`${p.x},${p.y - 11} ${p.x - 7},${p.y + 5} ${p.x + 7},${p.y + 5}`}
                fill="#D97706"
                opacity={0.9}
              />
              <text x={p.x} y={p.y + 17} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#92400E">
                ASC
              </text>
            </>
          );
        })()}
      </g>

      {/* MC 三角形标记 */}
      {mcLon > 0 && (
        <g filter="url(#glowStrong)">
          {(() => {
            const p = lonToXY(mcLon, rHouseOuter + 18);
            return (
              <>
                <polygon
                  points={`${p.x},${p.y - 9} ${p.x - 6},${p.y + 3} ${p.x + 6},${p.y + 3}`}
                  fill="#7C3AED"
                  opacity={0.85}
                />
                <text x={p.x} y={p.y + 14} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#5B21B6">
                  MC
                </text>
              </>
            );
          })()}
        </g>
      )}

      {/*
        ═══════════════════════════════════════════════════════════════════════
        行星符号 + 文字标签（双重标识，提升可识别性）
        
        改进策略：
        1. SVG符号：保留原有符号图标，位于圆圈中心
        2. 文字标签：在符号下方显示 PLANET_LABELS（如 Su/Mo/Me...）
        3. 颜色区分：每颗行星使用独特颜色
        4. 逆行标记：在右上角显示 R
        ═══════════════════════════════════════════════════════════════════════
      */}
      {sortedPlanets.map((p: any) => {
        const offset = planetOffsets[p.key] || 0;
        const pos = lonToXY(p.longitude, rPlanet + offset);
        const color = PLANET_COLORS[p.key] || '#888';
        const label = PLANET_LABELS[p.key] || p.key.slice(0, 2).toUpperCase();
        const lon = normalize(p.longitude);
        const signIdx = Math.floor(lon / 30);
        const degInSign = lon % 30;
        const mins = Math.floor((degInSign % 1) * 60);

        // 文字标签尺寸（确保即使符号不可辨也能识别行星）
        const labelFontSize = 7;
        const symbolSize = 26;

        return (
          <g key={`planet-${p.key}`}>
            {/* 外圈背景 */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r="16"
              fill={`${color}25`}
              stroke={color}
              strokeWidth="1.8"
            />

            {/* SVG符号图标（居中） */}
            <use
              href={`#sym-${p.key.toLowerCase()}`}
              x={pos.x - symbolSize / 2}
              y={pos.y - symbolSize / 2}
              width={symbolSize}
              height={symbolSize}
              fill={color}
              stroke="none"
            />

            {/* 文字标签（符号正下方）：确保每个行星都可识别 */}
            <text
              x={pos.x}
              y={pos.y + 13}
              textAnchor="middle"
              fontSize={labelFontSize}
              fontWeight="bold"
              fill={color}
              fontFamily="Arial, Helvetica, sans-serif"
            >
              {label}
            </text>

            {/* 逆行标记 */}
            {p.retrograde && (
              <text
                x={pos.x + 11}
                y={pos.y - 9}
                fontSize="8"
                fontWeight="bold"
                fill="#DC2626"
              >
                R
              </text>
            )}

            {/* 度数显示（可选） */}
            {showDegrees && (
              <text
                x={pos.x}
                y={pos.y + 22}
                textAnchor="middle"
                fontSize="6"
                fill="#666"
                fontFamily="Arial, Helvetica, sans-serif"
              >
                {Math.floor(degInSign)}°{mins}&apos;
              </text>
            )}
          </g>
        );
      })}

      {/* 中心圆 */}
      <circle cx={cx} cy={cy} r={rCenter} fill="#f0f0f0" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={rCenter - 8} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#bbb" letterSpacing="2">
        星缘
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="7" fill="#ccc">
        ✧ LUNA X STAR ✧
      </text>

      {/* 行星图例（右下角） */}
      {sortedPlanets.length > 0 && (() => {
        const legendX = cx + rOuter - 75;
        const legendY = cy + 20;
        const itemH = 14;
        const maxVisible = Math.min(sortedPlanets.length, 8);
        return (
          <g>
            <rect
              x={legendX - 8}
              y={legendY - 10}
              width={75}
              height={maxVisible * itemH + 14}
              rx="6"
              fill="rgba(250,250,250,0.92)"
              stroke="#d0d0d0"
              strokeWidth="0.8"
            />
            <text
              x={legendX + 28}
              y={legendY}
              textAnchor="middle"
              fontSize="7"
              fontWeight="bold"
              fill="#555"
            >
              行星
            </text>
            {sortedPlanets.slice(0, maxVisible).map((p: any, i: number) => {
              const color = PLANET_COLORS[p.key] || '#888';
              const label = PLANET_LABELS[p.key] || p.key.slice(0, 2);
              return (
                <g key={`leg-${p.key}`}>
                  {/* 颜色圆点 */}
                  <circle
                    cx={legendX}
                    cy={legendY + 10 + i * itemH}
                    r="4"
                    fill={color}
                  />
                  {/* 行星标签 */}
                  <text
                    x={legendX + 8}
                    y={legendY + 13 + i * itemH}
                    fontSize="7"
                    fontWeight="bold"
                    fill={color}
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    {label}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })()}
    </svg>
  );
}
