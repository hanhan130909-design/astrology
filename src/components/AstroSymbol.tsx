"use client";

import React from "react";

/**
 * 统一的天文/占星符号渲染组件。
 * 全部符号用 SVG path 绘制（而非系统字体 <text>），
 * 统一 viewBox(0 0 24 24)、统一 strokeWidth、居中于(12,12)，
 * 彻底消除字体渲染导致的大小/粗细/基线高低不一致。
 */

type SymbolProps = {
  /** 符号标识：行星 key（Sun/Moon/…/Pluto/North_Node）或符号字符（♈…♓） */
  name: string;
  /** 输出尺寸（正方形边长），行星符号约 18-20，黄道符号约 12-14 */
  size?: number;
  color?: string;
  className?: string;
};

const STROKE = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// ---- 行星符号（10 个）----
const PLANET_GLYPHS: Record<string, React.ReactNode> = {
  Sun: (
    <>
      <circle cx="12" cy="12" r="5" {...STROKE} />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  Moon: (
    <path
      d="M5.4 12 A6.6 6.6 0 0 0 18.6 12 A5.3 5.3 0 0 1 5.4 12 Z"
      {...STROKE}
    />
  ),
  Mercury: (
    <>
      <circle cx="12" cy="7.7" r="3.4" {...STROKE} />
      <path d="M12 11.1 V19.4" {...STROKE} />
      <path d="M8.6 16.8 H15.4" {...STROKE} />
      <path d="M12 19.4 A4.3 4.3 0 0 0 17.6 16.6" {...STROKE} />
    </>
  ),
  Venus: (
    <>
      <circle cx="12" cy="7.9" r="3.4" {...STROKE} />
      <path d="M12 11.3 V20" {...STROKE} />
      <path d="M9.2 17 H14.8" {...STROKE} />
    </>
  ),
  Mars: (
    <>
      <circle cx="12" cy="9" r="3.4" {...STROKE} />
      <path d="M12 12.4 V20" {...STROKE} />
      <path d="M12 5.6 L18.4 1" {...STROKE} />
      <path d="M14.8 1 H18.4 V4.6" {...STROKE} />
    </>
  ),
  Jupiter: (
    <>
      <circle cx="12" cy="12" r="4" {...STROKE} />
      <path d="M15.6 8.4 A6.2 6.2 0 0 1 15.6 15.6" {...STROKE} />
    </>
  ),
  Saturn: (
    <>
      <circle cx="12" cy="8.7" r="3.4" {...STROKE} />
      <path d="M8.6 16.4 H15.4" {...STROKE} />
      <path d="M8.6 16.4 C7 18.7 17 18.7 15.4 16.4" {...STROKE} />
    </>
  ),
  Uranus: (
    <>
      <circle cx="12" cy="7.9" r="3.4" {...STROKE} />
      <path d="M12 11.3 V19.4" {...STROKE} />
      <path d="M9.2 14.5 H14.8" {...STROKE} />
      <path d="M12 19.4 A4.3 4.3 0 0 0 17.6 16.6" {...STROKE} />
    </>
  ),
  Neptune: (
    <>
      <circle cx="12" cy="7.7" r="3.4" {...STROKE} />
      <path d="M9.7 13.4 L14.3 20" {...STROKE} />
      <path d="M12 14.4 V21" {...STROKE} />
      <path d="M14.3 13.4 L9.7 20" {...STROKE} />
    </>
  ),
  North_Node: (
    <path
      d="M4.5 12 A7.5 7.5 0 0 1 19.5 12 A7.5 7.5 0 0 1 4.5 12 Z"
      {...STROKE}
    />
  ),
};

// ---- 黄道符号（12 个）----
const ZODIAC_GLYPHS: Record<string, React.ReactNode> = {
  Aries: (
    <>
      <path d="M12 4 V14" {...STROKE} />
      <path d="M12 14 C9 16.5 8 15.5 8 12.5" {...STROKE} />
      <path d="M12 14 C15 16.5 16 15.5 16 12.5" {...STROKE} />
      <path d="M12 14 V19" {...STROKE} />
    </>
  ),
  Taurus: (
    <>
      <circle cx="12" cy="9" r="4.6" {...STROKE} />
      <path d="M8.6 16 H15.4" {...STROKE} />
      <path d="M8.6 16 C8.6 18.5 9 20 12 20" {...STROKE} />
      <path d="M15.4 16 C15.4 18.5 15 20 12 20" {...STROKE} />
    </>
  ),
  Gemini: (
    <>
      <path d="M6.5 5.5 C10 8.5 14 3 17.5 5.5" {...STROKE} />
      <path d="M6.5 10.5 C10 13.5 14 8 17.5 10.5" {...STROKE} />
      <path d="M6.5 15 V19.5" {...STROKE} />
      <path d="M17.5 15 V19.5" {...STROKE} />
    </>
  ),
  Cancer: (
    <>
      <path d="M8.3 8 A3.6 3.6 0 0 1 11.9 7.6" {...STROKE} />
      <path d="M15.7 8 A3.6 3.6 0 0 0 12.1 7.6" {...STROKE} />
      <path d="M8.4 10.8 V20" {...STROKE} />
      <path d="M15.6 10.8 V20" {...STROKE} />
      <path d="M8.4 13 H15.6" {...STROKE} />
    </>
  ),
  Leo: (
    <>
      <path d="M9 4.5 Q 15.5 3 13.2 7.5 Q 19 5.5 14.2 10.5" {...STROKE} />
      <path d="M9 7.5 Q 13 8 13 10.5" {...STROKE} />
      <path d="M12 10.5 V19" {...STROKE} />
      <path d="M12 13.5 C9.5 13.5 8.5 11.8 8.5 10" {...STROKE} />
    </>
  ),
  Virgo: (
    <>
      <path d="M12 3.5 V20" {...STROKE} />
      <path d="M12 6.5 Q 15 4.5 15 8" {...STROKE} />
      <path d="M12 11 H15.5" {...STROKE} />
      <path d="M12 13.5 Q 9 14 9 12" {...STROKE} />
      <path d="M12 16 Q 9 16.5 9 14.5" {...STROKE} />
    </>
  ),
  Libra: (
    <>
      <path d="M4.5 6.5 C 8.5 11 15.5 11 19.5 6.5" {...STROKE} />
      <path d="M8.5 13.5 H15.5" {...STROKE} />
      <path d="M12 13.5 V20" {...STROKE} />
    </>
  ),
  Scorpio: (
    <>
      <path d="M7.5 4.5 C 10.5 7.5 13 7.5 12.5 10.5" {...STROKE} />
      <path d="M12.5 10.5 V20" {...STROKE} />
      <path d="M12.5 20 L9.5 17" {...STROKE} />
      <path d="M12.5 20 L15.5 17" {...STROKE} />
      <path d="M7.5 7.5 L5.5 5.5" {...STROKE} />
    </>
  ),
  Sagittarius: (
    <>
      <path d="M9 19.5 L16 12" {...STROKE} />
      <path d="M12 19.5 H19" {...STROKE} />
      <path d="M13.5 4 L18.5 0.5 L18.5 8" {...STROKE} />
    </>
  ),
  Capricorn: (
    <>
      <path d="M7.5 7 C 9.5 12.5 14 8.5 16 13.5" {...STROKE} />
      <path d="M16 13.5 C 16 16.5 15 17.5 14 18.5" {...STROKE} />
      <path d="M7.5 7 C 5.5 8.5 6 11 8 12.5" {...STROKE} />
      <path d="M12 16.5 V20" {...STROKE} />
    </>
  ),
  Aquarius: (
    <>
      <path d="M6 7 H18" {...STROKE} />
      <path d="M5 11 H19" {...STROKE} />
      <path d="M6 15 H18" {...STROKE} />
    </>
  ),
  Pisces: (
    <>
      <path d="M5.5 12 A 6.5 6.5 0 0 1 12 5.5 M5.5 12 A 6.5 6.5 0 0 0 12 18.5" {...STROKE} />
      <path d="M18.5 12 A 6.5 6.5 0 0 1 12 5.5 M18.5 12 A 6.5 6.5 0 0 0 12 18.5" {...STROKE} />
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

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ color, display: "inline-block", overflow: "visible", verticalAlign: "middle" }}
      aria-hidden
    >
      <g stroke="currentColor">{glyph}</g>
    </svg>
  );
}
