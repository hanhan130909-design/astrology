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

interface DualChartProps {
  planets1: Record<string, PlanetData>;
  planets2: Record<string, PlanetData>;
  houses1?: Record<string, PlanetData>;
  houses2?: Record<string, PlanetData>;
  size?: number;
}

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: "☉", Moon: "☽", Mercury: "☿", Venus: "♀", Mars: "♂",
  Jupiter: "♃", Saturn: "♄", Uranus: "♅", Neptune: "♆", Pluto: "♇",
  North_Node: "☊", South_Node: "☋"
};

const SIGN_SYMBOLS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

const PLANET_COLORS_1: Record<string, string> = {
  Sun: "#FFD700", Moon: "#C0C0C0", Mercury: "#87CEEB", Venus: "#FFB6C1",
  Mars: "#FF6347", Jupiter: "#FFA500", Saturn: "#87CEFA",
  Uranus: "#40E0D0", Neptune: "#6495ED", Pluto: "#CD5C5C",
  North_Node: "#98FB98", South_Node: "#DDA0DD"
};

const PLANET_COLORS_2: Record<string, string> = {
  Sun: "#FF8C00", Moon: "#A9A9A9", Mercury: "#4682B4", Venus: "#FF69B4",
  Mars: "#DC143C", Jupiter: "#DAA520", Saturn: "#5F9EA0",
  Uranus: "#20B2AA", Neptune: "#4169E1", Pluto: "#8B0000",
  North_Node: "#32CD32", South_Node: "#9370DB"
};

export default function DualChart({ planets1, planets2, size = 500 }: DualChartProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [hoveredPerson, setHoveredPerson] = useState<1 | 2 | null>(null);

  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = size * 0.45;
  const innerRadius = size * 0.28;
  const planetRadius1 = size * 0.22;
  const planetRadius2 = size * 0.32;

  const degToRad = (deg: number) => (deg - 90) * Math.PI / 180;

  const getPlanetPos = (longitude: number, radius: number) => {
    const rad = degToRad(longitude);
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad)
    };
  };

  // Sign ring segments
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

  // Get valid planets
  const validPlanets1 = Object.entries(planets1).filter(([_, p]) => !p.error);
  const validPlanets2 = Object.entries(planets2).filter(([_, p]) => !p.error);

  // Calculate aspect lines between charts
  const aspectLines: any[] = [];
  const ASPECT_ANGLES: Record<string, number> = { Conjunction: 0, Sextile: 60, Square: 90, Trine: 120, Opposition: 180 };
  const ASPECT_COLORS: Record<string, string> = { Conjunction: '#FFD700', Sextile: '#00FF88', Square: '#FF4444', Trine: '#4488FF', Opposition: '#FF8800' };
  
  validPlanets1.forEach(([name1, p1]) => {
    validPlanets2.forEach(([name2, p2]) => {
      let diff = Math.abs(p1.longitude - p2.longitude);
      if (diff > 180) diff = 360 - diff;
      
      for (const [aspect, angle] of Object.entries(ASPECT_ANGLES)) {
        if (Math.abs(diff - angle) <= 8) {
          const pos1 = getPlanetPos(p1.longitude, planetRadius1);
          const pos2 = getPlanetPos(p2.longitude, planetRadius2);
          aspectLines.push({
            x1: pos1.x, y1: pos1.y,
            x2: pos2.x, y2: pos2.y,
            color: ASPECT_COLORS[aspect],
            aspect,
            planet1: name1,
            planet2: name2,
            orb: Math.abs(diff - angle)
          });
        }
      }
    });
  });

  return (
    <div className="relative">
      <svg width={size} height={size} className="max-w-full h-auto">
        {/* Background */}
        <circle cx={cx} cy={cy} r={outerRadius} fill="none" stroke="#1e293b" strokeWidth="1"/>
        <circle cx={cx} cy={cy} r={innerRadius} fill="#0f172a" stroke="#334155" strokeWidth="1"/>
        
        {/* Sign ring */}
        {signSegments.map((seg, i) => {
          const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#84cc16', '#06b6d4'];
          return (
            <g key={i}>
              <path d={seg.path} fill={colors[i]} fillOpacity="0.08" stroke="#334155" strokeWidth="0.5"/>
              <text
                x={cx + (outerRadius - 15) * Math.cos(degToRad(seg.centerAngle))}
                y={cy + (outerRadius - 15) * Math.sin(degToRad(seg.centerAngle))}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#64748b"
                fontSize="14"
              >
                {seg.sign}
              </text>
            </g>
          );
        })}

        {/* Aspect lines between charts */}
        {aspectLines.filter((_, i) => i < 8).map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={line.color}
            strokeWidth="1"
            strokeOpacity="0.6"
            strokeDasharray="3,3"
          />
        ))}

        {/* Person 1 planets (inner ring) */}
        {validPlanets1.map(([name, p]) => {
          const pos = getPlanetPos(p.longitude, planetRadius1);
          const isHovered = hoveredPlanet === name && hoveredPerson === 1;
          
          return (
            <g key={`p1-${name}`}
              onMouseEnter={() => { setHoveredPlanet(name); setHoveredPerson(1); }}
              onMouseLeave={() => { setHoveredPlanet(null); setHoveredPerson(null); }}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isHovered ? 14 : 10}
                fill="#0f172a"
                stroke={PLANET_COLORS_1[name] || '#fff'}
                strokeWidth="2"
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={PLANET_COLORS_1[name] || '#fff'}
                fontSize={isHovered ? 14 : 10}
              >
                {PLANET_SYMBOLS[name] || name[0]}
              </text>
            </g>
          );
        })}

        {/* Person 2 planets (outer ring) */}
        {validPlanets2.map(([name, p]) => {
          const pos = getPlanetPos(p.longitude, planetRadius2);
          const isHovered = hoveredPlanet === name && hoveredPerson === 2;
          
          return (
            <g key={`p2-${name}`}
              onMouseEnter={() => { setHoveredPlanet(name); setHoveredPerson(2); }}
              onMouseLeave={() => { setHoveredPlanet(null); setHoveredPerson(null); }}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isHovered ? 14 : 10}
                fill="#0f172a"
                stroke={PLANET_COLORS_2[name] || '#fff'}
                strokeWidth="2"
                strokeDasharray="2,2"
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={PLANET_COLORS_2[name] || '#fff'}
                fontSize={isHovered ? 14 : 10}
              >
                {PLANET_SYMBOLS[name] || name[0]}
              </text>
            </g>
          );
        })}

        {/* Center label */}
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="#64748b" fontSize="10">
          SYNASTRY
        </text>
      </svg>

      {/* Tooltip */}
      {hoveredPlanet && hoveredPerson && (
        <div className="absolute top-0 right-0 p-3 rounded-lg bg-white border border-gray-300 text-sm shadow-xl">
          <div className="font-bold text-white mb-1">
            {hoveredPerson === 1 ? 'Person 1' : 'Person 2'}: {hoveredPlanet}
          </div>
          {(() => {
            const p = hoveredPerson === 1 ? planets1[hoveredPlanet] : planets2[hoveredPlanet];
            if (!p || p.error) return null;
            return (
              <div className="text-gray-600">
                <div>{p.sign_cn || p.sign} {Math.floor(p.degree)}°</div>
                <div className="text-xs text-gray-400">{p.longitude.toFixed(1)}°</div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
          <span className="text-gray-500">Person 1 (Inner)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border border-gray-400 border-dashed"></div>
          <span className="text-gray-500">Person 2 (Outer)</span>
        </div>
      </div>
    </div>
  );
}
