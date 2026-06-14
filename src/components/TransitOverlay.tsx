"use client";

import { useState } from "react";

interface PlanetData {
  name: string;
  longitude: number;
  sign: string;
  sign_cn: string;
  degree: number;
  error?: string;
}

interface TransitOverlayProps {
  natalPlanets: Record<string, PlanetData>;
  transitPlanets: Record<string, PlanetData>;
  natalHouses?: any[];
  aspects?: any[];
  size?: number;
}

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: "☉", Moon: "☽", Mercury: "☿", Venus: "♀", Mars: "♂",
  Jupiter: "♃", Saturn: "♄", Uranus: "♅", Neptune: "♆", Pluto: "♇",
  North_Node: "☊", South_Node: "☋"
};

const SIGN_SYMBOLS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

const NATAL_COLORS: Record<string, string> = {
  Sun: "#FFD700", Moon: "#C0C0C0", Mercury: "#87CEEB", Venus: "#FFB6C1",
  Mars: "#FF6347", Jupiter: "#FFA500", Saturn: "#87CEFA",
  Uranus: "#40E0D0", Neptune: "#6495ED", Pluto: "#CD5C5C",
  North_Node: "#98FB98", South_Node: "#DDA0DD"
};

const TRANSIT_COLORS: Record<string, string> = {
  Sun: "#FF4500", Moon: "#C0C0C0", Mercury: "#00CED1", Venus: "#FF1493",
  Mars: "#DC143C", Jupiter: "#DAA520", Saturn: "#708090",
  Uranus: "#00FA9A", Neptune: "#1E90FF", Pluto: "#8B008B",
  North_Node: "#32CD32", South_Node: "#9370DB"
};

export default function TransitOverlay({ 
  natalPlanets, 
  transitPlanets, 
  natalHouses = [],
  aspects = [],
  size = 500 
}: TransitOverlayProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [hoveredType, setHoveredType] = useState<'natal' | 'transit' | null>(null);
  const [showTransits, setShowTransits] = useState(true);
  const [showAspects, setShowAspects] = useState(true);

  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = size * 0.45;
  const innerRadius = size * 0.35;
  const natalRadius = size * 0.22;
  const transitRadius = size * 0.32;

  const degToRad = (deg: number) => (deg - 90) * Math.PI / 180;

  const getPos = (longitude: number, radius: number) => {
    const rad = degToRad(longitude);
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad)
    };
  };

  // Sign ring
  const signSegments = Array.from({ length: 12 }, (_, i) => {
    const startAngle = i * 30;
    const endAngle = (i + 1) * 30;
    const startRad = degToRad(startAngle);
    const endRad = degToRad(endAngle);
    
    const x1 = cx + outerRadius * Math.cos(startRad);
    const y1 = cy + outerRadius * Math.sin(startRad);
    const x2 = cx + outerRadius * Math.cos(endRad);
    const y2 = cy + outerRadius * Math.sin(endRad);
    const x3 = cx + innerRadius * Math.cos(endRad);
    const y3 = cy + innerRadius * Math.sin(endRad);
    const x4 = cx + innerRadius * Math.cos(startRad);
    const y4 = cy + innerRadius * Math.sin(startRad);
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    
    return {
      path: `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`,
      sign: SIGN_SYMBOLS[i],
      centerAngle: (startAngle + endAngle) / 2
    };
  });

  // House cusps
  const houseLines = natalHouses.map((h) => {
    const rad = degToRad(h.longitude);
    return {
      x1: cx + innerRadius * Math.cos(rad),
      y1: cy + innerRadius * Math.sin(rad),
      x2: cx + outerRadius * Math.cos(rad),
      y2: cy + outerRadius * Math.sin(rad),
      house: h.house
    };
  });

  // Valid planets
  const validNatal = Object.entries(natalPlanets).filter(([_, p]) => !p.error);
  const validTransit = Object.entries(transitPlanets).filter(([_, p]) => !p.error);

  // Transit aspects to natal
  const transitAspectLines: any[] = [];
  if (showAspects) {
    const ASPECT_COLORS: Record<string, string> = { 
      Conjunction: '#FFD700', Sextile: '#00FF88', Square: '#FF4444', 
      Trine: '#4488FF', Opposition: '#FF8800' 
    };
    
    validTransit.forEach(([tName, tData]) => {
      validNatal.forEach(([nName, nData]) => {
        let diff = Math.abs(tData.longitude - nData.longitude);
        if (diff > 180) diff = 360 - diff;
        
        const aspectTypes = [
          { name: 'Conjunction', angle: 0, orb: 10 },
          { name: 'Sextile', angle: 60, orb: 6 },
          { name: 'Square', angle: 90, orb: 8 },
          { name: 'Trine', angle: 120, orb: 8 },
          { name: 'Opposition', angle: 180, orb: 10 }
        ];
        
        for (const asp of aspectTypes) {
          if (Math.abs(diff - asp.angle) <= asp.orb) {
            const tPos = getPos(tData.longitude, transitRadius);
            const nPos = getPos(nData.longitude, natalRadius);
            transitAspectLines.push({
              x1: tPos.x, y1: tPos.y,
              x2: nPos.x, y2: nPos.y,
              color: ASPECT_COLORS[asp.name],
              type: asp.name,
              tPlanet: tName,
              nPlanet: nName,
              orb: Math.abs(diff - asp.angle)
            });
            break;
          }
        }
      });
    });
  }

  return (
    <div className="relative">
      {/* Controls */}
      <div className="absolute top-0 left-0 z-10 flex gap-2">
        <button 
          onClick={() => setShowTransits(!showTransits)}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${showTransits ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}
        >
          Transit
        </button>
        <button 
          onClick={() => setShowAspects(!showAspects)}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${showAspects ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-500'}`}
        >
          Aspects
        </button>
      </div>

      <svg width={size} height={size} className="max-w-full h-auto">
        {/* Background */}
        <circle cx={cx} cy={cy} r={outerRadius} fill="none" stroke="#1e293b" strokeWidth="1"/>
        <circle cx={cx} cy={cy} r={innerRadius} fill="#0f172a" stroke="#334155" strokeWidth="1"/>
        <circle cx={cx} cy={cy} r={natalRadius} fill="none" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2"/>
        
        {/* Sign ring */}
        {signSegments.map((seg, i) => {
          const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#84cc16', '#06b6d4'];
          return (
            <g key={i}>
              <path d={seg.path} fill={colors[i]} fillOpacity="0.06" stroke="#334155" strokeWidth="0.5"/>
              <text
                x={cx + (outerRadius - 15) * Math.cos(degToRad(seg.centerAngle))}
                y={cy + (outerRadius - 15) * Math.sin(degToRad(seg.centerAngle))}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#64748b"
                fontSize="12"
              >
                {seg.sign}
              </text>
            </g>
          );
        })}

        {/* House cusps */}
        {houseLines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#475569"
            strokeWidth={line.house === 1 || line.house === 10 ? "2" : "0.5"}
            strokeOpacity="0.5"
          />
        ))}

        {/* Transit aspect lines */}
        {showAspects && transitAspectLines.slice(0, 10).map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={line.color}
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />
        ))}

        {/* Natal planets (inner ring) */}
        {validNatal.map(([name, p]) => {
          const pos = getPos(p.longitude, natalRadius);
          const isHovered = hoveredPlanet === name && hoveredType === 'natal';
          
          return (
            <g key={`natal-${name}`}
              onMouseEnter={() => { setHoveredPlanet(name); setHoveredType('natal'); }}
              onMouseLeave={() => { setHoveredPlanet(null); setHoveredType(null); }}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isHovered ? 14 : 10}
                fill="#0f172a"
                stroke={NATAL_COLORS[name] || '#fff'}
                strokeWidth="2"
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={NATAL_COLORS[name] || '#fff'}
                fontSize={isHovered ? 14 : 10}
                fontWeight="bold"
              >
                {PLANET_SYMBOLS[name] || name[0]}
              </text>
            </g>
          );
        })}

        {/* Transit planets (outer ring) */}
        {showTransits && validTransit.map(([name, p]) => {
          const pos = getPos(p.longitude, transitRadius);
          const isHovered = hoveredPlanet === name && hoveredType === 'transit';
          
          return (
            <g key={`transit-${name}`}
              onMouseEnter={() => { setHoveredPlanet(name); setHoveredType('transit'); }}
              onMouseLeave={() => { setHoveredPlanet(null); setHoveredType(null); }}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isHovered ? 14 : 10}
                fill="#0f172a"
                stroke={TRANSIT_COLORS[name] || '#ff6b35'}
                strokeWidth="2"
                strokeDasharray="2,1"
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={TRANSIT_COLORS[name] || '#ff6b35'}
                fontSize={isHovered ? 14 : 10}
                fontWeight="bold"
              >
                {PLANET_SYMBOLS[name] || name[0]}
              </text>
            </g>
          );
        })}

        {/* Center */}
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="#64748b" fontSize="9">
          NATAL
        </text>
      </svg>

      {/* Tooltip */}
      {hoveredPlanet && hoveredType && (
        <div className="absolute top-0 right-0 p-3 rounded-lg bg-white border border-gray-300 text-sm shadow-xl max-w-[200px]">
          <div className={`font-bold mb-1 ${hoveredType === 'natal' ? 'text-blue-300' : 'text-orange-300'}`}>
            {hoveredType === 'natal' ? 'Natal' : 'Transit'}: {hoveredPlanet}
          </div>
          {(() => {
            const p = hoveredType === 'natal' ? natalPlanets[hoveredPlanet] : transitPlanets[hoveredPlanet];
            if (!p || p.error) return null;
            return (
              <div className="text-gray-600 text-xs">
                <div>{p.sign_cn || p.sign} {Math.floor(p.degree)}°</div>
                <div className="text-gray-400">{p.longitude.toFixed(1)}°</div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-400"></div>
          <span className="text-gray-500">Natal (Inner)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border border-orange-400 border-dashed"></div>
          <span className="text-gray-500">Transit (Outer)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-yellow-400"></div>
          <span className="text-gray-500">Aspect</span>
        </div>
      </div>
    </div>
  );
}
