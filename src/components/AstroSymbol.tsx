"use client";

import React from "react";

/**
 * 统一的天文/占星符号渲染组件。
 * 全部符号用 SVG path 绘制（而非系统字体 <text>），
 * 统一 viewBox(0 0 24 24)、统一 strokeWidth、居中于(12,12)。
 */

type SymbolProps = {
  /** 符号标识：行星 key（Sun/Moon/…/Pluto/North_Node）或符号字符（♈…♓） */
  name: string;
  /** 输出尺寸（正方形边长） */
  size?: number;
  color?: string;
  className?: string;
};

const STROKE = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/**
 * 每个符号的视觉缩放权重：把符号最长边统一归一化到一致，
 * 消除"太阳圆大、处女细长"造成的视觉大小参差。
 * 取值 = 目标视觉尺寸 / 该符号最长边实测占比（基于 viewBox 24）。
 * 同时用 strokeWidth 补偿，保证缩放后线条粗细视觉一致。
 */
const SYMBOL_SCALE: Record<string, number> = {
  Sun: 1.44, Moon: 0.95, Mercury: 0.87, Venus: 0.89, Mars: 0.76,
  Jupiter: 1.53, Saturn: 1.05, Uranus: 0.89, Neptune: 0.84, Pluto: 0.88, North_Node: 0.93,
  Aries: 0.88, Taurus: 0.94, Gemini: 0.91, Cancer: 1.03, Leo: 0.84,
  Virgo: 0.84, Libra: 1.03, Scorpio: 0.86, Sagittarius: 0.76, Capricorn: 0.94,
  Aquarius: 1.15, Pisces: 1.05,
};

// ---- 行星符号（10 个），标准绘制：圆 + 特征 ----
const PLANET_GLYPHS: Record<string, React.ReactNode> = {
  Sun: (
    <>
      <circle cx="12" cy="12" r="4.5" {...STROKE} />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  Moon: (
    <path d="M14.6 4.6 A7.4 7.4 0 1 0 14.6 19.4 A6 6 0 0 1 14.6 4.6 Z" {...STROKE} />
  ),
  Mercury: (
    <>
      <circle cx="12" cy="7.4" r="3.4" {...STROKE} />
      <path d="M12 10.8 V20" {...STROKE} />
      <path d="M8.8 16.2 H15.2" {...STROKE} />
      <path d="M12 20 A4.6 4.6 0 0 0 18.2 16.6" {...STROKE} />
    </>
  ),
  Venus: (
    <>
      <circle cx="12" cy="7.4" r="3.4" {...STROKE} />
      <path d="M12 10.8 V20" {...STROKE} />
      <path d="M9 16.5 H15" {...STROKE} />
    </>
  ),
  Mars: (
    <>
      <circle cx="12" cy="9.2" r="3.4" {...STROKE} />
      <path d="M12 12.6 V20" {...STROKE} />
      <path d="M12 5.8 L18.5 1" {...STROKE} />
      <path d="M15.2 1 H18.5 V4.3" {...STROKE} />
    </>
  ),
  Jupiter: (
    <>
      <circle cx="12" cy="12" r="3.8" {...STROKE} />
      <path d="M15.6 8.6 A5.6 5.6 0 0 1 15.6 15.4" {...STROKE} />
    </>
  ),
  Saturn: (
    <>
      <circle cx="12" cy="8.2" r="3.4" {...STROKE} />
      <path d="M8.6 16 H15.4" {...STROKE} />
      <path d="M8.6 16 C6.5 18.6 17.5 18.6 15.4 16" {...STROKE} />
    </>
  ),
  Uranus: (
    <>
      <circle cx="12" cy="7.4" r="3.4" {...STROKE} />
      <path d="M12 10.8 V20" {...STROKE} />
      <path d="M9 14.5 H15" {...STROKE} />
      <path d="M9.6 20 H14.4" {...STROKE} />
    </>
  ),
  Neptune: (
    <>
      <circle cx="12" cy="7.4" r="3.4" {...STROKE} />
      <path d="M9.4 13.4 L14.6 20" {...STROKE} />
      <path d="M12 13.4 V21" {...STROKE} />
      <path d="M14.6 13.4 L9.4 20" {...STROKE} />
    </>
  ),
  Pluto: (
    <>
      <circle cx="12" cy="7.2" r="3.4" {...STROKE} />
      <path d="M12 10.6 V19.5" {...STROKE} />
      <path d="M6.6 15.4 L12 20 L17.4 15.4" {...STROKE} />
    </>
  ),
  North_Node: (
    <path d="M4.5 12 A7.5 7.5 0 0 1 19.5 12 A7.5 7.5 0 0 1 4.5 12 Z" {...STROKE} />
  ),
};

// ---- 黄道符号（12 个），标准绘制 ----
const ZODIAC_GLYPHS: Record<string, React.ReactNode> = {
  Aries: (
    <>
      <path d="M12 3.5 V15" {...STROKE} />
      <path d="M12 3.5 C8 4 8 7.5 11.5 9.5" {...STROKE} />
      <path d="M12 3.5 C16 4 16 7.5 12.5 9.5" {...STROKE} />
      <path d="M12 15 V19.5" {...STROKE} />
    </>
  ),
  Taurus: (
    <>
      <circle cx="12" cy="9" r="4.3" {...STROKE} />
      <path d="M9.3 15.5 C9.3 18 10 19.5 12 19.5" {...STROKE} />
      <path d="M14.7 15.5 C14.7 18 14 19.5 12 19.5" {...STROKE} />
    </>
  ),
  Gemini: (
    <>
      <path d="M7.5 4.5 V20" {...STROKE} />
      <path d="M16.5 4.5 V20" {...STROKE} />
      <path d="M7.5 4.5 C10.5 8 13.5 8 16.5 4.5" {...STROKE} />
    </>
  ),
  Cancer: (
    <>
      <path d="M8 6.5 A3.6 3.6 0 0 1 11.6 5.5" {...STROKE} />
      <path d="M16 6.5 A3.6 3.6 0 0 0 12.4 5.5" {...STROKE} />
      <path d="M8.4 9.5 V19" {...STROKE} />
      <path d="M15.6 9.5 V19" {...STROKE} />
      <path d="M8.4 13 H15.6" {...STROKE} />
    </>
  ),
  Leo: (
    <path d="M8.5 3 C13.5 3 15 5.5 12.5 7.5 C10 9.5 9.5 11.5 12 12.8 C14 13.9 14.5 16.5 11.5 18.5 V20" {...STROKE} />
  ),
  Virgo: (
    <>
      <path d="M12 3 V20" {...STROKE} />
      <path d="M12 6 Q15 4.5 15.5 8" {...STROKE} />
      <path d="M12 14.5 Q9 13 9 10.5" {...STROKE} />
      <path d="M9 12.5 Q8.2 14.5 9.5 16" {...STROKE} />
    </>
  ),
  Libra: (
    <>
      <path d="M12 12 V20" {...STROKE} />
      <path d="M6 12 H18" {...STROKE} />
      <path d="M6 6.5 C9.5 9.5 14.5 9.5 18 6.5" {...STROKE} />
    </>
  ),
  Scorpio: (
    <>
      <path d="M8 3.5 C10.5 6 13 6.5 12.5 9" {...STROKE} />
      <path d="M12.5 9 V20" {...STROKE} />
      <path d="M12.5 20 L9 16.5" {...STROKE} />
      <path d="M12.5 20 L16 16.5" {...STROKE} />
      <path d="M8 5.5 L6 4" {...STROKE} />
    </>
  ),
  Sagittarius: (
    <>
      <path d="M9 19.5 L16 12.5" {...STROKE} />
      <path d="M16 12.5 V19" {...STROKE} />
      <path d="M12.5 3 L18.5 0.5 L18.5 6" {...STROKE} />
    </>
  ),
  Capricorn: (
    <>
      <path d="M7 5 C10 12 13 9 14 14 C14.5 16.5 13 18.5 11.5 20" {...STROKE} />
      <path d="M14 14 L17 10.5" {...STROKE} />
    </>
  ),
  Aquarius: (
    <>
      <path d="M5 7 Q 8 5 11 7 T 17 7" {...STROKE} />
      <path d="M5 13 Q 8 11 11 13 T 17 13" {...STROKE} />
    </>
  ),
  Pisces: (
    <>
      <path d="M5.5 12 A6.5 6.5 0 0 1 12 5.5 M5.5 12 A6.5 6.5 0 0 0 12 18.5" {...STROKE} />
      <path d="M18.5 12 A6.5 6.5 0 0 1 12 5.5 M18.5 12 A6.5 6.5 0 0 0 12 18.5" {...STROKE} />
      <path d="M12 5.5 V18.5" {...STROKE} />
    </>
  ),
};

const PLANET_NAME_MAP: Record<string, string> = {
  "☉": "Sun",
  "☽": "Moon",
  "☿": "Mercury",
  "♀": "Venus",
  "♂": "Mars",
  "♃": "Jupiter",
  "♄": "Saturn",
  "♅": "Uranus",
  "♆": "Neptune",
  "☊": "North_Node",
};

const ZODIAC_NAME_MAP: Record<string, string> = {
  "♈": "Aries",
  "♉": "Taurus",
  "♊": "Gemini",
  "♋": "Cancer",
  "♌": "Leo",
  "♍": "Virgo",
  "♎": "Libra",
  "♏": "Scorpio",
  "♐": "Sagittarius",
  "♑": "Capricorn",
  "♒": "Aquarius",
  "♓": "Pisces",
};

export function AstroSymbol({ name, size = 18, color, className }: SymbolProps) {
  const key =
    name in PLANET_GLYPHS
      ? name
      : PLANET_NAME_MAP[name] || (name in ZODIAC_GLYPHS ? name : ZODIAC_NAME_MAP[name]);
  const glyph = (PLANET_GLYPHS as Record<string, React.ReactNode>)[key] ||
    (ZODIAC_GLYPHS as Record<string, React.ReactNode>)[key];
  if (!glyph) return null;

  const scale = SYMBOL_SCALE[key] || 1;
  // 统一视觉大小（绕中心缩放）+ strokeWidth 补偿，保证粗细一致
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ color, display: "inline-block", overflow: "visible", verticalAlign: "middle" }}
      aria-hidden
    >
      <g
        stroke="currentColor"
        strokeWidth={1.7 / scale}
        transform={`translate(12 12) scale(${scale}) translate(-12 -12)`}
      >
        {glyph}
      </g>
    </svg>
  );
}
