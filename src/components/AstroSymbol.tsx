import React from "react";

export interface SymbolProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

/**
 * 标准 Unicode 占星符号。
 * 用系统标准字体（Apple Symbols / Segoe UI Symbol / Noto Sans Symbols 2）渲染，
 * 保证形状是经过专业设计的标准符号，和 Astro.com 等专业软件一致。
 * 统一字号 + dominantBaseline 垂直居中 + textAnchor 水平居中，避免参差。
 */
const GLYPH: Record<string, string> = {
  Sun: "☉",
  Moon: "☽",
  Mercury: "☿",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄",
  Uranus: "♅",
  Neptune: "♆",
  Pluto: "♇",
  North_Node: "☊",
  Aries: "♈",
  Taurus: "♉",
  Gemini: "♊",
  Cancer: "♋",
  Leo: "♌",
  Virgo: "♍",
  Libra: "♎",
  Scorpio: "♏",
  Sagittarius: "♐",
  Capricorn: "♑",
  Aquarius: "♒",
  Pisces: "♓",
};

const CHAR_SET = new Set(Object.values(GLYPH));

export function AstroSymbol({ name, size = 18, color = "#000", className }: SymbolProps) {
  const char = GLYPH[name] || (CHAR_SET.has(name) ? name : "");
  if (!char) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ color, display: "inline-block", overflow: "visible", verticalAlign: "middle" }}
      aria-hidden
    >
      <text
        x="12"
        y="12"
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        fontFamily="'Apple Symbols','Segoe UI Symbol','Noto Sans Symbols 2','Noto Sans Symbols',sans-serif"
        fontSize={20}
      >
        {char}
      </text>
    </svg>
  );
}
