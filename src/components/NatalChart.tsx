"use client";

import { useState, useEffect } from "react";

interface PlanetData {
  name: string;
  longitude: number;
  latitude?: number;
  sign: string;
  sign_cn: string;
  degree: number;
  error?: string;
}

interface HouseData {
  house: number;
  longitude: number;
  sign: string;
  sign_cn: string;
  degree: number;
}

interface AspectData {
  planet1: string;
  planet2: string;
  type: string;
  orb: number;
}

interface NatalChartProps {
  planets: Record<string, PlanetData>;
  houses: HouseData[];
  aspects: AspectData[];
  size?: number;
  // Optional: overlay planets for transit/composite view
  overlayPlanets?: Record<string, PlanetData>;
  showOverlay?: boolean;
}

// 符号
const PLANET_SYMBOLS: Record<string, string> = {
  Sun: "☉", Moon: "☽", Mercury: "☿", Venus: "♀", Mars: "♂",
  Jupiter: "♃", Saturn: "♄", Uranus: "♅", Neptune: "♆", Pluto: "♇",
  North_Node: "☊", South_Node: "☋"
};

const SIGN_SYMBOLS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

const ASPECT_COLORS: Record<string, string> = {
  Conjunction: "#FFD700",
  Sextile: "#4CAF50",
  Square: "#F44336",
  Trine: "#2196F3",
  Opposition: "#9C27B0"
};

const ASPECT_LINES: Record<string, string> = {
  Conjunction: "0,0",
  Sextile: "3,3",
  Square: "5,5",
  Trine: "0,0",
  Opposition: "8,8"
};

// Planet colors
const PLANET_COLORS: Record<string, string> = {
  Sun: "#FFD700", Moon: "#C0C0C0", Mercury: "#87CEEB", Venus: "#FFB6C1",
  Mars: "#FF6347", Jupiter: "#FFA500", Saturn: "#87CEFA",
  Uranus: "#40E0D0", Neptune: "#6495ED", Pluto: "#CD5C5C",
  North_Node: "#98FB98", South_Node: "#DDA0DD"
};

export default function NatalChart({ 
  planets, 
  houses, 
  aspects, 
  size = 500,
  overlayPlanets,
  showOverlay = false
}: NatalChartProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = size * 0.45;
  const innerRadius = size * 0.35;
  const planetRadius = size * 0.25;
  const overlayRadius = size * 0.32;
  
  // Ring radii
  const signRingOuter = size * 0.50;
  const signRingInner = size * 0.46;
  const houseLineOuter = size * 0.47;
  const houseLineInner = size * 0.20;
  const cuspLabelRadius = size * 0.42;
  const degreeMarkOuter = size * 0.465;
  const degreeMarkInner = size * 0.455;

  // Convert degrees to radians (0° at left, counterclockwise)
  const degToRad = (deg: number) => (deg - 180) * Math.PI / 180;

  // Get position from longitude
  const getPlanetPos = (longitude: number, radius: number = planetRadius) => {
    const rad = degToRad(longitude);
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad)
    };
  };

  // Get outer ring position
  const getOuterPos = (longitude: number, r: number = outerRadius) => {
    const rad = degToRad(longitude);
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  };

  // Draw arc
  const describeArc = (startAngle: number, endAngle: number, r: number) => {
    const start = degToRad(startAngle);
    const end = degToRad(endAngle);
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  // Draw house lines - counterclockwise from 1st house cusp
  const renderHouseLines = () => {
    // Sort houses by house number to ensure counterclockwise order
    const sortedHouses = [...houses].sort((a, b) => a.house - b.house);
    
    return sortedHouses.map((house) => {
      const start = getOuterPos(house.longitude, houseLineOuter);
      const end = getOuterPos(house.longitude, houseLineInner);
      const degree = Math.floor(house.degree || 0);
      const minStart = Math.floor(((house.degree || 0) % 1) * 60);
      const labelPos = getOuterPos(house.longitude, cuspLabelRadius);
      
      // Determine line thickness based on house importance
      const isAngular = house.house === 1 || house.house === 4 || house.house === 7 || house.house === 10;
      
      return (
        <g key={`house-${house.house}`}>
          {/* Main house cusp line */}
          <line
            x1={start.x} y1={start.y}
            x2={end.x} y2={end.y}
            stroke={isAngular ? "#888" : "#555"}
            strokeWidth={isAngular ? "2" : "1.5"}
            opacity={isAngular ? "0.8" : "0.6"}
          />
          {/* Cusp degree label */}
          <text
            x={labelPos.x} y={labelPos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="6"
            fill="#888"
            fontFamily="Arial"
          >
            {degree}°{minStart}&apos;
          </text>
          {/* 5° tick marks */}
          {[5, 10, 15, 20, 25].map(deg => {
            const markAngle = house.longitude + deg;
            const mStart = getOuterPos(markAngle, degreeMarkOuter);
            const mEnd = getOuterPos(markAngle, degreeMarkInner);
            return (
              <line
                key={`deg-${house.house}-${deg}`}
                x1={mStart.x} y1={mStart.y}
                x2={mEnd.x} y2={mEnd.y}
                stroke="#666"
                strokeWidth="0.5"
                opacity="0.3"
              />
            );
          })}
        </g>
      );
    });
  };

  // Draw zodiac signs
  const renderSigns = () => {
    return Array.from({ length: 12 }, (_, i) => {
      // Counterclockwise: Aries at 0° (left), Taurus at 30°, etc.
      const startAngle = i * 30;
      const endAngle = (i + 1) * 30;
      const midAngle = startAngle + 15;
      const pos = getOuterPos(midAngle, signRingInner - 8);

      return (
        <g key={`sign-${i}`}>
          {/* Zodiac arc */}
          <path
            d={describeArc(startAngle, endAngle, signRingOuter)}
            fill="none"
            stroke="#444"
            strokeWidth="1"
            opacity="0.4"
          />
          {/* Sign symbol */}
          <text
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="14"
            fill="#FFD700"
            style={{ userSelect: "none" }}
          >
            {SIGN_SYMBOLS[i]}
          </text>
        </g>
      );
    });
  };

  // Draw house numbers - counterclockwise 1-12
  const renderHouseNumbers = () => {
    const sortedHouses = [...houses].sort((a, b) => a.house - b.house);
    
    return sortedHouses.map((house) => {
      // Position house number in the middle of each house
      const nextHouse = sortedHouses.find(h => h.house === (house.house % 12) + 1);
      let midAngle;
      if (nextHouse) {
        midAngle = (house.longitude + nextHouse.longitude) / 2;
        if (Math.abs(nextHouse.longitude - house.longitude) > 180) {
          midAngle = (house.longitude + nextHouse.longitude + 360) / 2;
        }
      } else {
        midAngle = house.longitude + 15;
      }
      
      const pos = getOuterPos(midAngle, innerRadius * 0.85);
      
      return (
        <text
          key={`house-num-${house.house}`}
          x={pos.x}
          y={pos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="11"
          fill={house.house === 1 || house.house === 10 ? "#FFD700" : "#666"}
          fontWeight={house.house === 1 || house.house === 10 ? "bold" : "normal"}
          style={{ userSelect: "none" }}
        >
          {house.house}
        </text>
      );
    });
  };

  // Draw planets
  const renderPlanets = () => {
    const planetList = Object.entries(planets).filter(([_, p]) => p && !(p as any).error);

    return planetList.map(([name, planet]) => {
      const pos = getPlanetPos(planet.longitude, planetRadius);
      const isHovered = hoveredPlanet === name;
      const color = PLANET_COLORS[name] || "#FFF";

      return (
        <g
          key={`planet-${name}`}
          onMouseEnter={(e) => {
            setHoveredPlanet(name);
            setTooltipPos({ x: e.clientX, y: e.clientY });
          }}
          onMouseLeave={() => setHoveredPlanet(null)}
          style={{ cursor: "pointer" }}
        >
          {/* Planet circle */}
          <circle
            cx={pos.x}
            cy={pos.y}
            r={isHovered ? 16 : 12}
            fill="#0f172a"
            stroke={color}
            strokeWidth={isHovered ? 2 : 1.5}
          />
          {/* Planet symbol */}
          <text
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={isHovered ? "14" : "11"}
            fill={color}
            style={{ userSelect: "none" }}
          >
            {PLANET_SYMBOLS[name] || name.charAt(0)}
          </text>
          {/* Planet degree */}
          <text
            x={pos.x + 14}
            y={pos.y - 14}
            fontSize="7"
            fill="#888"
          >
            {planet.sign_cn}{Math.floor(planet.degree)}°
          </text>
        </g>
      );
    });
  };

  // Draw overlay planets (for transit/composite)
  const renderOverlayPlanets = () => {
    if (!showOverlay || !overlayPlanets) return null;
    
    const planetList = Object.entries(overlayPlanets).filter(([_, p]) => p && !(p as any).error);

    return planetList.map(([name, planet]) => {
      const pos = getPlanetPos(planet.longitude, overlayRadius);
      const color = PLANET_COLORS[name] || "#FF6B35";

      return (
        <g
          key={`overlay-${name}`}
          onMouseEnter={(e) => {
            setHoveredPlanet(`overlay-${name}`);
            setTooltipPos({ x: e.clientX, y: e.clientY });
          }}
          onMouseLeave={() => setHoveredPlanet(null)}
          style={{ cursor: "pointer" }}
        >
          {/* Outer planet circle (dashed for transit) */}
          <circle
            cx={pos.x}
            cy={pos.y}
            r={10}
            fill="#0f172a"
            stroke={color}
            strokeWidth={1.5}
            strokeDasharray="2,1"
          />
          {/* Planet symbol */}
          <text
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fill={color}
            style={{ userSelect: "none" }}
          >
            {PLANET_SYMBOLS[name] || name.charAt(0)}
          </text>
        </g>
      );
    });
  };

  // Draw aspect lines
  const renderAspects = () => {
    const planetList = Object.entries(planets).filter(([_, p]) => p && !(p as any).error);

    return aspects.slice(0, 12).map((aspect, i) => {
      const p1 = planetList.find(([n]) => n === aspect.planet1);
      const p2 = planetList.find(([n]) => n === aspect.planet2);

      if (!p1 || !p2) return null;

      const pos1 = getPlanetPos(p1[1].longitude, planetRadius);
      const pos2 = getPlanetPos(p2[1].longitude, planetRadius);
      const color = ASPECT_COLORS[aspect.type] || "#888";
      const dash = ASPECT_LINES[aspect.type] || "0,0";

      return (
        <line
          key={`aspect-${i}`}
          x1={pos1.x}
          y1={pos1.y}
          x2={pos2.x}
          y2={pos2.y}
          stroke={color}
          strokeWidth={Math.max(1, 2 - Math.abs(aspect.orb) * 0.2)}
          strokeDasharray={dash}
          opacity="0.5"
        />
      );
    });
  };

  // Tooltip
  const renderTooltip = () => {
    if (!hoveredPlanet) return null;
    
    const isOverlay = hoveredPlanet.startsWith('overlay-');
    const planetName = isOverlay ? hoveredPlanet.replace('overlay-', '') : hoveredPlanet;
    const planet = isOverlay ? overlayPlanets?.[planetName] : planets[planetName];
    
    if (!planet) return null;

    return (
      <div
        className="fixed z-50 bg-white text-white px-3 py-2 rounded-lg shadow-xl text-sm pointer-events-none"
        style={{
          left: tooltipPos.x + 15,
          top: tooltipPos.y + 15,
          border: "1px solid rgba(255,215,0,0.3)"
        }}
      >
        <div className="font-bold text-gray-600">
          {PLANET_SYMBOLS[planetName]} {planetName} {isOverlay && "(Transit)"}
        </div>
        <div className="text-gray-700">
          {planet.sign_cn} {planet.degree.toFixed(2)}°
        </div>
        {planet.latitude !== undefined && (
          <div className="text-gray-400 text-xs">
            Lat: {planet.latitude.toFixed(2)}°
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative inline-block">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-2xl"
      >
        {/* Background gradient */}
        <defs>
          <radialGradient id="chartGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a1a3e" />
            <stop offset="100%" stopColor="#0a0a1a" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background circle */}
        <circle
          cx={cx}
          cy={cy}
          r={outerRadius + 10}
          fill="url(#chartGradient)"
          stroke="#333"
          strokeWidth="2"
        />

        {/* Outer ring */}
        <circle
          cx={cx}
          cy={cy}
          r={outerRadius}
          fill="none"
          stroke="#444"
          strokeWidth="1"
        />

        {/* Inner ring */}
        <circle
          cx={cx}
          cy={cy}
          r={innerRadius}
          fill="none"
          stroke="#444"
          strokeWidth="1"
        />

        {/* House lines - counterclockwise */}
        {renderHouseLines()}

        {/* Zodiac signs */}
        {renderSigns()}

        {/* House numbers - counterclockwise 1-12 */}
        {renderHouseNumbers()}

        {/* Aspect lines */}
        <g filter="url(#glow)">
          {renderAspects()}
        </g>

        {/* Planets */}
        {renderPlanets()}
        
        {/* Overlay planets (transit/composite) */}
        {renderOverlayPlanets()}
      </svg>

      {/* Tooltip */}
      {renderTooltip()}
    </div>
  );
}
