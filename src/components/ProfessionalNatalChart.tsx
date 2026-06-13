"use client";

type Point = { x: number; y: number };

interface ProfessionalNatalChartProps {
  planets?: Record<string, any>;
  houses?: any[];
  aspects?: any[];
  ascendant?: number | { longitude: number };
  midheaven?: number | { longitude: number };
  size?: number;
  showDegrees?: boolean;
  showAspectLines?: boolean;
}

const SIGN_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
const SIGN_COLORS = ['#ff0000','#9a2020','#0028ff','#0a7a19','#ff0000','#9a2020','#0028ff','#0a7a19','#ff0000','#9a2020','#0028ff','#0a7a19'];
const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
  North_Node: '☊', South_Node: '☋',
};
const PLANET_COLORS: Record<string, string> = {
  Sun: '#d4a017', Moon: '#777777', Mercury: '#b8860b', Venus: '#228b22', Mars: '#cc0000',
  Jupiter: '#d4a017', Saturn: '#556b2f', Uranus: '#4169e1', Neptune: '#7b68ee', Pluto: '#8b4513',
  North_Node: '#666', South_Node: '#999',
};
const ASPECT_STYLES: Record<string, { color: string; width: number; opacity: number; dash?: string }> = {
  Conjunction: { color: '#8b4513', width: 1.2, opacity: 0.7 },
  Sextile: { color: '#228b22', width: 1, opacity: 0.6, dash: '4 3' },
  Square: { color: '#cc0000', width: 1.3, opacity: 0.7 },
  Trine: { color: '#228b22', width: 1.2, opacity: 0.65 },
  Opposition: { color: '#cc0000', width: 1.3, opacity: 0.7, dash: '6 3' },
};
const PLANET_ORDER = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto','North_Node','South_Node'];

function normalize(angle: number) { return ((angle % 360) + 360) % 360; }

function lonToAngle(lon: number, ascLon: number): number {
  const rel = normalize(lon - ascLon + 180);
  return (rel * Math.PI) / 180;
}

function lonToPoint(lon: number, ascLon: number, radius: number, cx: number, cy: number): Point {
  const angle = lonToAngle(lon, ascLon);
  return { x: cx + radius * Math.cos(angle), y: cy - radius * Math.sin(angle) };
}

function PlutoGlyphSvg({ x, y, color, size = 17.6 }: { x: number; y: number; color: string; size?: number }) {
  const scale = size / 24;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9">
      <circle cx="0" cy="-8.2" r="3.2" />
      <path d="M -7 -2.2 Q 0 5 7 -2.2" />
      <path d="M 0 2.8 V 12" />
      <path d="M -5 8 H 5" />
    </g>
  );
}

export default function ProfessionalNatalChart({
  planets,
  houses = [],
  aspects = [],
  ascendant: ascInput,
  midheaven: mcInput,
  size = 520,
  showDegrees = true,
  showAspectLines = true,
}: ProfessionalNatalChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size / 2 - 8;
  const rZodiac = rOuter - 26;
  const rZodiacInner = rZodiac - 28;
  const rHouse = rZodiacInner - 4;
  const rHouseInner = rHouse - 36;
  const rPlanet = rHouseInner - 6;

  const ascLon = typeof ascInput === 'number' ? ascInput : ascInput?.longitude ?? (houses[0]?.longitude ?? 0);
  const mcLon = typeof mcInput === 'number' ? mcInput : mcInput?.longitude ?? 0;

  // Collect planets with positions
  const planetEntries = PLANET_ORDER
    .filter(k => planets?.[k] && !planets[k].error && planets[k].longitude != null)
    .map(k => {
      const p = planets[k];
      return {
        key: k,
        glyph: PLANET_SYMBOLS[k] || p.planetSymbol || k[0],
        color: PLANET_COLORS[k] || '#555',
        longitude: p.longitude,
        degree: p.degree ?? (normalize(p.longitude) % 30),
        formatted: p.formatted ?? `${Math.floor(normalize(p.longitude) % 30)}°${Math.floor(((normalize(p.longitude) % 30) % 1) * 60)}′`,
        signSymbol: p.symbol ?? SIGN_SYMBOLS[Math.floor(normalize(p.longitude) / 30)],
        retrograde: p.retrograde ?? false,
      };
    })
    .sort((a, b) => a.longitude - b.longitude);

  // Planet overlap prevention (cluster detection)
  const CLUSTER_THRESHOLD = 9;
  const OFFSET_STEP = 10;
  const planetOffsets: Record<string, number> = {};

  const clusters: number[][] = [];
  let currentCluster: number[] = [];
  for (let i = 0; i < planetEntries.length; i++) {
    if (currentCluster.length === 0) { currentCluster.push(i); continue; }
    const prev = planetEntries[currentCluster[currentCluster.length - 1]];
    const curr = planetEntries[i];
    const diff = normalize(curr.longitude - prev.longitude);
    if (diff < CLUSTER_THRESHOLD || 360 - diff < CLUSTER_THRESHOLD) {
      currentCluster.push(i);
    } else {
      clusters.push(currentCluster);
      currentCluster = [i];
    }
  }
  if (currentCluster.length > 0) clusters.push(currentCluster);

  clusters.forEach(cluster => {
    if (cluster.length <= 1) { planetOffsets[planetEntries[cluster[0]].key] = 0; return; }
    const midIdx = Math.floor(cluster.length / 2);
    cluster.forEach((idx, rank) => {
      const offsetLevel = Math.abs(rank - midIdx);
      const direction = rank < midIdx ? -1 : 1;
      planetOffsets[planetEntries[idx].key] = direction * offsetLevel * OFFSET_STEP;
    });
  });

  // Planet positions for aspect lines
  const planetPositions: Record<string, Point> = {};
  planetEntries.forEach(p => {
    const offset = planetOffsets[p.key] || 0;
    planetPositions[p.key] = lonToPoint(p.longitude, ascLon, rPlanet + offset, cx, cy);
  });

  // Ring parameters
  const ringOuter = rOuter;
  const ringZodiacOut = rZodiac;
  const ringZodiacIn = rZodiacInner;
  const ringHouseOut = rHouse;
  const ringHouseIn = rHouseInner;
  const ringCenter = rHouseInner - 10;

  const zodiacRingMid = (ringZodiacOut + ringZodiacIn) / 2;
  const houseRingMid = (ringHouseOut + ringHouseIn) / 2;

  return (
    <section className="flex justify-center" style={{ width: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[560px]" role="img" aria-label="本命盘">
        <defs>
          <radialGradient id="proBgG" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#fafafc"/><stop offset="60%" stopColor="#f0f0f5"/><stop offset="100%" stopColor="#e8e8ef"/>
          </radialGradient>
        </defs>

        {/* Background */}
        <circle cx={cx} cy={cy} r={ringOuter} fill="url(#proBgG)" stroke="#999" strokeWidth="1.2"/>

        {/* Zodiac ring segments */}
        {SIGN_SYMBOLS.map((_sym, i) => {
          const sa = lonToAngle(i * 30, ascLon);
          const ea = lonToAngle((i + 1) * 30, ascLon);
          const x1 = cx + ringZodiacOut * Math.cos(sa), y1 = cy - ringZodiacOut * Math.sin(sa);
          const x2 = cx + ringZodiacOut * Math.cos(ea), y2 = cy - ringZodiacOut * Math.sin(ea);
          const x3 = cx + ringZodiacIn * Math.cos(ea), y3 = cy - ringZodiacIn * Math.sin(ea);
          const x4 = cx + ringZodiacIn * Math.cos(sa), y4 = cy - ringZodiacIn * Math.sin(sa);
          const largeArc = (ea - sa + 2 * Math.PI) % (2 * Math.PI) > Math.PI ? 1 : 0;
          return <path key={i} d={`M ${x1} ${y1} A ${ringZodiacOut} ${ringZodiacOut} 0 ${largeArc} 0 ${x2} ${y2} L ${x3} ${y3} A ${ringZodiacIn} ${ringZodiacIn} 0 ${largeArc} 1 ${x4} ${y4} Z`} fill={SIGN_COLORS[i]} opacity={0.08}/>;
        })}

        {/* Ring borders */}
        <circle cx={cx} cy={cy} r={ringZodiacOut} fill="none" stroke="#999" strokeWidth="1"/>
        <circle cx={cx} cy={cy} r={ringZodiacIn} fill="none" stroke="#bbb" strokeWidth="0.6"/>
        <circle cx={cx} cy={cy} r={ringHouseOut} fill="none" stroke="#999" strokeWidth="0.8"/>
        <circle cx={cx} cy={cy} r={ringHouseIn} fill="none" stroke="#bbb" strokeWidth="0.6"/>

        {/* Sign boundary lines */}
        {SIGN_SYMBOLS.map((_, i) => {
          const p1 = lonToPoint(i * 30, ascLon, ringZodiacIn, cx, cy);
          const p2 = lonToPoint(i * 30, ascLon, ringZodiacOut, cx, cy);
          return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#bbb" strokeWidth="0.6"/>;
        })}

        {/* Zodiac symbols */}
        {SIGN_SYMBOLS.map((sym, i) => {
          const pos = lonToPoint(i * 30 + 15, ascLon, zodiacRingMid, cx, cy);
          return <text key={i} x={pos.x} y={pos.y + 5} textAnchor="middle" fontSize="13" fontWeight="bold" fill={SIGN_COLORS[i]} fontFamily="Apple Symbols, DejaVu Sans, STIXGeneral, serif">{sym}</text>;
        })}

        {/* House cusp lines */}
        {houses.map((h, idx) => {
          const isAngular = [1, 4, 7, 10].includes(h.house);
          const p1 = lonToPoint(h.longitude, ascLon, ringHouseIn, cx, cy);
          const pOuter = isAngular ? ringZodiacOut : ringHouseOut;
          const p2 = lonToPoint(h.longitude, ascLon, pOuter, cx, cy);
          return <line key={idx} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={isAngular ? '#444' : '#aaa'} strokeWidth={isAngular ? 1.5 : 0.8} strokeDasharray={isAngular ? 'none' : '3 3'}/>;
        })}

        {/* House numbers */}
        {houses.map((h, idx) => {
          const next = houses[(idx + 1) % houses.length];
          if (!next) return null;
          let midLon = h.longitude < next.longitude
            ? h.longitude + (next.longitude - h.longitude) / 2
            : h.longitude + (next.longitude + 360 - h.longitude) / 2;
          const pos = lonToPoint(midLon % 360, ascLon, houseRingMid, cx, cy);
          const isAngular = [1, 4, 7, 10].includes(h.house);
          return <text key={idx} x={pos.x} y={pos.y + 4} textAnchor="middle" fontSize={isAngular ? '11' : '9'} fontWeight={isAngular ? 'bold' : 'normal'} fill={isAngular ? '#333' : '#777'}>{h.house}</text>;
        })}

        {/* House cusp degrees */}
        {showDegrees && houses.map((h, idx) => {
          const degVal = h.degree != null ? h.degree : (normalize(h.longitude) % 30);
          const pos = lonToPoint(h.longitude, ascLon, ringHouseIn - 12, cx, cy);
          const isAngular = [1, 4, 7, 10].includes(h.house);
          return <text key={'hd'+idx} x={pos.x} y={pos.y + 3} textAnchor="middle" fontSize={isAngular ? '8' : '6'} fill={isAngular ? '#555' : '#999'}>{Math.floor(degVal)}°</text>;
        })}

        {/* Aspect lines */}
        {showAspectLines && aspects.map((asp, i) => {
          if (i > 25) return null;
          const p1Pos = planetPositions[asp.planet1];
          const p2Pos = planetPositions[asp.planet2];
          if (!p1Pos || !p2Pos) return null;
          const style = ASPECT_STYLES[asp.type || asp.aspect];
          if (!style) return null;
          return <line key={i} x1={p1Pos.x} y1={p1Pos.y} x2={p2Pos.x} y2={p2Pos.y} stroke={style.color} strokeWidth={style.width} strokeOpacity={style.opacity} strokeDasharray={style.dash || 'none'}/>;
        })}

        {/* ASC marker */}
        {(() => {
          const p = lonToPoint(ascLon, ascLon, ringHouseOut + 18, cx, cy);
          return (
            <g>
              <polygon points={`${p.x},${p.y - 10} ${p.x - 6},${p.y + 4} ${p.x + 6},${p.y + 4}`} fill="#d4a017" opacity={0.9}/>
              <text x={p.x} y={p.y + 16} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#8b6914">ASC</text>
            </g>
          );
        })()}

        {/* MC marker */}
        {mcLon > 0 && (() => {
          const p = lonToPoint(mcLon, ascLon, ringHouseOut + 18, cx, cy);
          return (
            <g>
              <polygon points={`${p.x},${p.y - 8} ${p.x - 5},${p.y + 3} ${p.x + 5},${p.y + 3}`} fill="#7b68ee" opacity={0.85}/>
              <text x={p.x} y={p.y + 14} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#5b48cc">MC</text>
            </g>
          );
        })()}

        {/* Planets */}
        {planetEntries.map(p => {
          const offset = planetOffsets[p.key] || 0;
          const angle = lonToAngle(p.longitude, ascLon);
          const pos = {
            x: cx + (rPlanet + offset) * Math.cos(angle),
            y: cy - (rPlanet + offset) * Math.sin(angle),
          };
          return (
            <g key={p.key}>
              {/* Planet dot */}
              <circle cx={pos.x} cy={pos.y} r="11" fill="white" stroke={p.color} strokeWidth="1.3" opacity="0.95"/>
              {/* Planet symbol */}
              {p.key === 'Pluto' ? (
                <PlutoGlyphSvg x={pos.x} y={pos.y} color={p.color} size={16}/>
              ) : (
                <text x={pos.x} y={pos.y + 4} textAnchor="middle" fontSize="12" fontWeight="bold" fill={p.color} fontFamily="Apple Symbols, DejaVu Sans, STIXGeneral, serif">
                  {p.glyph}
                </text>
              )}
              {/* Retrograde marker */}
              {p.retrograde && (
                <text x={pos.x + 12} y={pos.y - 8} fontSize="8" fontWeight="bold" fill="#cc0000">R</text>
              )}
            </g>
          );
        })}

        {/* Center */}
        <circle cx={cx} cy={cy} r={ringCenter} fill="white" stroke="#bbb" strokeWidth="1"/>
        <text x={cx} y={cy - 2} textAnchor="middle" fontSize="20" fill="#d4a017">✦</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="7" fill="#999" letterSpacing="2">本命盘</text>
      </svg>
    </section>
  );
}
