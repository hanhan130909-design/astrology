"use client";

import React from "react";

type Point = { x: number; y: number };
type ChartData = {
  planets?: Record<string, any>;
  houses?: any[];
  aspects?: any[];
  ascendant?: number | { longitude?: number };
  midheaven?: number | { longitude?: number };
};

const center = 260;
const symbolFontFamily = "Apple Symbols, DejaVu Sans, STIXGeneral, Times New Roman, serif";
const rings = {
  outer: 248,
  zodiac: 222,
  house: 115,
  inner: 94,
  aspect: 82,
};

const SIGN_SYMBOLS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
const SIGN_COLORS = ["#ff0000", "#9a2020", "#0028ff", "#0a7a19", "#ff0000", "#9a2020", "#0028ff", "#0a7a19", "#ff0000", "#9a2020", "#0028ff", "#0a7a19"];
const PLANET_KEYS = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "North_Node"];
const PLANET_SYMBOLS: Record<string, string> = {
  Sun: "☉",
  Moon: "☽",
  Mercury: "☿",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄",
  Uranus: "♅",
  Neptune: "♆",
  Pluto: "pluto",
  North_Node: "☊",
};
const ASPECT_COLORS: Record<string, string> = {
  Conjunction: "#ff5c6c",
  Square: "#ff5c6c",
  Opposition: "#ff5c6c",
  Trine: "#3ba349",
  Sextile: "#1e43ff",
};

function normalize(value: number) {
  return ((value % 360) + 360) % 360;
}

function longitudeOf(value: any, fallback = 0) {
  if (typeof value === "number") return normalize(value);
  if (typeof value?.longitude === "number") return normalize(value.longitude);
  return normalize(fallback);
}

function signParts(lon: number) {
  const normalized = normalize(lon);
  const signIndex = Math.floor(normalized / 30) % 12;
  const degreeInSign = normalized % 30;
  const degree = Math.floor(degreeInSign);
  const minute = Math.round((degreeInSign - degree) * 60);

  return {
    signIndex,
    glyph: SIGN_SYMBOLS[signIndex],
    color: SIGN_COLORS[signIndex],
    degreeText: `${degree}°`,
    minuteText: `${String(minute).padStart(2, "0")}′`,
  };
}

function planetGlyphSize(glyph: string) {
  if (glyph === "☽" || glyph === "☊") return 21;
  if (glyph === "♆") return 20;
  return 20;
}

function zodiacGlyphSize(glyph: string) {
  if (glyph === "☽" || glyph === "☊") return 16;
  if (glyph === "♈" || glyph === "♆") return 14;
  return 15;
}

function houseCuspGlyphSize(glyph: string) {
  if (glyph === "♈" || glyph === "♆") return 17;
  return 18;
}

function aspectPoint(lon: number, ascLon: number): Point {
  return pointFromLongitude(lon, ascLon, rings.aspect);
}

function pointFromLongitude(lon: number, ascLon: number, radius: number): Point {
  const angle = ((normalize(lon - ascLon) + 180) * Math.PI) / 180;
  return {
    x: center + Math.cos(angle) * radius,
    y: center - Math.sin(angle) * radius,
  };
}

function pointBesideLongitude(lon: number, ascLon: number, radius: number, tangentOffset: number): Point {
  const angle = ((normalize(lon - ascLon) + 180) * Math.PI) / 180;
  const base = pointFromLongitude(lon, ascLon, radius);
  return {
    x: base.x - Math.sin(angle) * tangentOffset,
    y: base.y - Math.cos(angle) * tangentOffset,
  };
}

function linePoint(lon: number, ascLon: number, radius: number): Point {
  return pointFromLongitude(lon, ascLon, radius);
}

function midpointLongitude(from: number, to: number) {
  const span = normalize(to - from) || 30;
  return normalize(from + span / 2);
}

function buildFallbackHouses(ascLon: number) {
  return Array.from({ length: 12 }, (_, index) => {
    const longitude = normalize(ascLon + index * 30);
    return { house: index + 1, longitude };
  });
}

function getDisplayOffsets(planets: { key: string; longitude: number }[]) {
  const offsets: Record<string, { lonOffset: number; radialOffset: number }> = {};
  const sorted = [...planets].sort((a, b) => normalize(a.longitude) - normalize(b.longitude));
  const clusters: { key: string; longitude: number }[][] = [];
  let current: { key: string; longitude: number }[] = [];

  sorted.forEach((planet) => {
    const previous = current[current.length - 1];
    if (!previous || normalize(planet.longitude - previous.longitude) <= 9) {
      current.push(planet);
      return;
    }
    clusters.push(current);
    current = [planet];
  });
  if (current.length) clusters.push(current);

  clusters.forEach((cluster) => {
    const middle = (cluster.length - 1) / 2;
    cluster.forEach((planet, index) => {
      const rank = index - middle;
      offsets[planet.key] = {
        lonOffset: rank * 4.2,
        radialOffset: -Math.abs(rank) * 6,
      };
    });
  });

  return offsets;
}

function PlutoGlyphSvg({ x, y, color, size = 18 }: { x: number; y: number; color: string; size?: number }) {
  const scale = size / 24;

  return (
    <g aria-label="冥王" transform={`translate(${x} ${y}) scale(${scale})`} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9">
      <circle cx="0" cy="-8.2" r="3.2" />
      <path d="M -7 -2.2 Q 0 5 7 -2.2" />
      <path d="M 0 2.8 V 12" />
      <path d="M -5 8 H 5" />
    </g>
  );
}

function PlanetGlyph({ glyph, x, y, color }: { glyph: string; x: number; y: number; color: string }) {
  if (glyph === "pluto") return <PlutoGlyphSvg x={x} y={y} color={color} />;

  return (
    <text x={x} y={y} fill={color} className="font-bold" textAnchor="middle" dominantBaseline="middle" fontSize={planetGlyphSize(glyph)} fontFamily={symbolFontFamily}>
      {glyph}
    </text>
  );
}

export default function NatalChartWheel({ chart }: { chart?: ChartData }) {
  const houses = chart?.houses?.length ? chart.houses.slice(0, 12) : buildFallbackHouses(longitudeOf(chart?.ascendant));
  const ascLon = longitudeOf(chart?.ascendant, longitudeOf(houses[0]));
  const planets = PLANET_KEYS
    .filter((key) => chart?.planets?.[key] && !chart.planets[key].error && typeof chart.planets[key].longitude === "number")
    .map((key) => ({ key, ...chart!.planets![key], longitude: longitudeOf(chart!.planets![key]) }));
  const displayOffsets = getDisplayOffsets(planets);
  const planetPoints: Record<string, Point> = {};

  planets.forEach((planet) => {
    planetPoints[planet.key] = aspectPoint(planet.longitude, ascLon);
  });

  const fingerprint = [
    ascLon.toFixed(2),
    ...houses.map((house) => longitudeOf(house).toFixed(2)),
    ...planets.map((planet) => `${planet.key}:${planet.longitude.toFixed(2)}`),
  ].join("|");

  return (
    <section className="flex w-[520px] justify-center">
      <svg viewBox="0 0 520 520" className="h-[500px] w-[500px]" role="img" aria-label="本命盘" data-chart-fingerprint={fingerprint} data-asc={ascLon.toFixed(4)}>
        <circle cx={center} cy={center} r={rings.outer} fill="white" stroke="#777" strokeWidth="1.6" />
        <circle cx={center} cy={center} r={rings.zodiac} fill="none" stroke="#777" strokeWidth="1.6" />
        <circle cx={center} cy={center} r={rings.house} fill="none" stroke="#777" strokeWidth="1.4" />
        <circle cx={center} cy={center} r={rings.inner} fill="white" stroke="#777" strokeWidth="1.4" />

        {houses.map((house: any) => {
          const lon = longitudeOf(house);
          const isAngular = [1, 4, 7, 10].includes(Number(house.house));
          const start = linePoint(lon, ascLon, rings.inner);
          const end = linePoint(lon, ascLon, rings.zodiac);

          return (
            <line key={`house-line-${house.house}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke={isAngular ? "#111" : "#888"} strokeWidth={isAngular ? 1.5 : 1} />
          );
        })}

        {houses.map((house: any, index: number) => {
          const lon = longitudeOf(house);
          const nextLon = longitudeOf(houses[(index + 1) % houses.length]);
          const label = pointFromLongitude(midpointLongitude(lon, nextLon), ascLon, (rings.house + rings.inner) / 2);

          return (
            <text key={`house-label-${house.house}`} x={label.x} y={label.y} className="fill-[#555] text-[10px]" dominantBaseline="middle" textAnchor="middle">
              {house.house}
            </text>
          );
        })}

        {houses.map((house: any) => {
          const lon = longitudeOf(house);
          const parts = signParts(lon);
          const cuspLabelRadius = (rings.outer + rings.zodiac) / 2;
          const glyphPoint = pointFromLongitude(lon, ascLon, cuspLabelRadius);
          const degreePoint = pointBesideLongitude(lon, ascLon, cuspLabelRadius, -17);
          const minutePoint = pointBesideLongitude(lon, ascLon, cuspLabelRadius, 17);

          return (
            <g key={`house-cusp-${house.house}`}>
              <text x={glyphPoint.x} y={glyphPoint.y} fill={parts.color} className="font-bold" dominantBaseline="middle" fontSize={houseCuspGlyphSize(parts.glyph)} fontFamily={symbolFontFamily} textAnchor="middle">
                {parts.glyph}
              </text>
              <text x={degreePoint.x} y={degreePoint.y} fill="black" className="text-[10px] font-bold" dominantBaseline="middle" fontFamily={symbolFontFamily} textAnchor="middle">
                {parts.degreeText}
              </text>
              <text x={minutePoint.x} y={minutePoint.y} fill="black" className="text-[8px]" dominantBaseline="middle" fontFamily={symbolFontFamily} textAnchor="middle">
                {parts.minuteText}
              </text>
            </g>
          );
        })}

        {(chart?.aspects || []).slice(0, 36).map((aspect: any, index: number) => {
          const start = planetPoints[aspect.planet1];
          const end = planetPoints[aspect.planet2];
          const aspType = aspect.aspect || aspect.type;
          if (aspType === 'Conjunction') return null; // 合相不画线
          const color = ASPECT_COLORS[aspType];
          if (!start || !end || !color) return null;

          return <line key={`${aspect.planet1}-${aspect.planet2}-${index}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke={color} strokeWidth="1" opacity="0.78" />;
        })}

        {planets.map((planet) => {
          const offset = displayOffsets[planet.key] || { lonOffset: 0, radialOffset: 0 };
          const displayLon = normalize(planet.longitude + offset.lonOffset);
          const radius = rings.zodiac - 37 + offset.radialOffset;
          const parts = signParts(planet.longitude);
          const symbolPoint = pointFromLongitude(displayLon, ascLon, radius);
          const degreePoint = pointFromLongitude(displayLon, ascLon, radius - 16);
          const signPoint = pointFromLongitude(displayLon, ascLon, radius - 30);
          const minutePoint = pointFromLongitude(displayLon, ascLon, radius - 43);
          const rxPoint = pointFromLongitude(displayLon, ascLon, radius - 55);
          const glyph = PLANET_SYMBOLS[planet.key] || planet.planetSymbol || planet.key[0];

          return (
            <g key={planet.key}>
              <PlanetGlyph glyph={glyph} x={symbolPoint.x} y={symbolPoint.y} color={parts.color} />
              <text x={degreePoint.x} y={degreePoint.y} fill="black" className="text-[12px] font-bold" textAnchor="middle" dominantBaseline="middle" fontFamily={symbolFontFamily}>
                {parts.degreeText}
              </text>
              <text x={signPoint.x} y={signPoint.y} fill={parts.color} className="font-bold" textAnchor="middle" dominantBaseline="middle" fontSize={zodiacGlyphSize(parts.glyph)} fontFamily={symbolFontFamily}>
                {parts.glyph}
              </text>
              <text x={minutePoint.x} y={minutePoint.y} fill="black" className="text-[10px]" textAnchor="middle" dominantBaseline="middle" fontFamily={symbolFontFamily}>
                {parts.minuteText}
              </text>
              {planet.retrograde ? (
                <text x={rxPoint.x} y={rxPoint.y} fill={parts.color} className="text-[10px] font-bold" textAnchor="middle" dominantBaseline="middle" fontFamily={symbolFontFamily}>
                  R
                </text>
              ) : null}
            </g>
          );
        })}

        <text x="260" y="262" className="fill-[#555] text-[18px]" textAnchor="middle">
          ✶
        </text>
        <text x="260" y="279" className="fill-[#555] text-[11px]" textAnchor="middle">
          本命盘
        </text>
      </svg>
    </section>
  );
}
