/**
 * Professional Natal Chart SVG Component
 * 参考 almuten.net 专业占星网站样式
 * 
 * 设计元素：
 * - 外圈：12星座符号 + 360°刻度线（每5°大刻度，每1°小刻度）
 * - 中圈：宫位线 + 宫头精确度数（如 17°♈ 27'）
 * - 内圈：行星符号 + 精确度数 + 逆行标记
 * - 相位线：颜色区分（三分绿、四分红、六分蓝、对分紫）
 * - ASC/MC 三角形标记
 */

'use client';

// ════════════════════════════════════════════════════════════════════════════
// 常量定义
// ════════════════════════════════════════════════════════════════════════════

const SIGN_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const SIGN_COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#A8D8EA', '#FFB6B9', '#61C0BF', '#BBDED6', '#8B9DC3'];

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
  North_Node: '☊', South_Node: '☋', Chiron: '⚷', Lilith: '⚷',
};

const PLANET_COLORS: Record<string, string> = {
  Sun: '#FFD700', Moon: '#C0C0C0', Mercury: '#B0B0B0', Venus: '#FFB6C1', Mars: '#FF4500',
  Jupiter: '#FFA500', Saturn: '#8B4513', Uranus: '#00CED1', Neptune: '#4169E1', Pluto: '#8B0000',
  North_Node: '#9370DB', South_Node: '#696969', Chiron: '#20B2AA', Lilith: '#483D8B',
};

const PLANET_KEYS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'North_Node'];

// 相位颜色（参考 almuten.net）
const ASPECT_COLORS: Record<string, string> = {
  Conjunction: '#FFD700',  // 金色
  Sextile: '#4169E1',      // 蓝色
  Square: '#FF4500',       // 红色
  Trine: '#32CD32',       // 绿色
  Opposition: '#9370DB',   // 紫色
};

const ASPECT_WIDTH: Record<string, number> = {
  Conjunction: 2.0,
  Sextile: 1.2,
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

function formatDMS(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  return `${d}°${m.toString().padStart(2, '0')}'`;
}

function formatSignDegree(lon: number): string {
  const signIdx = Math.floor(normalize(lon) / 30);
  const deg = normalize(lon) % 30;
  return `${Math.floor(deg)}°${SIGN_SYMBOLS[signIdx]} ${Math.floor((deg % 1) * 60).toString().padStart(2, '0')}'`;
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

  // 环形尺寸（参考 almuten.net 比例）
  const rOuter = cx - 8;           // 最外圈边界
  const rSignOuter = rOuter;       // 星座圈外边
  const rSignInner = rOuter - 36;  // 星座圈内边
  const rHouseOuter = rSignInner - 2;  // 宫位圈外边
  const rHouseInner = rHouseOuter - 40; // 宫位圈内边
  const rPlanet = rHouseInner - 20;     // 行星圈
  const rCenter = 45;                   // 中心圆

  // ASC 上升点（左侧）
  const ascLon = ascendant || houses?.[0]?.longitude || 0;
  const mcLon = midheaven || houses?.[9]?.longitude || 0;

  // 黄道经度转换为 SVG 角度（ASC 在左侧，逆时针）
  const lonToAngle = (lon: number) => {
    const rel = ((lon - ascLon + 180) % 360 + 360) % 360;
    return (rel * Math.PI) / 180;
  };

  const lonToXY = (lon: number, radius: number) => ({
    x: cx + radius * Math.cos(lonToAngle(lon)),
    y: cy - radius * Math.sin(lonToAngle(lon)),
  });

  // 行星防重叠处理
  const sortedPlanets = PLANET_KEYS
    .filter(k => planets?.[k] && !planets[k].error && planets[k].longitude != null)
    .map(k => ({ key: k, ...planets[k] }))
    .sort((a: any, b: any) => a.longitude - b.longitude);

  const CLUSTER_THRESHOLD = 6;
  const OFFSET_STEP = 14;
  const planetOffsets: Record<string, number> = {};

  // 识别集群
  const clusters: number[][] = [];
  let currentCluster: number[] = [];
  for (let i = 0; i < sortedPlanets.length; i++) {
    if (currentCluster.length === 0) {
      currentCluster.push(i);
    } else {
      const prev = sortedPlanets[currentCluster[currentCluster.length - 1]];
      const curr = sortedPlanets[i];
      const diff = ((curr.longitude - prev.longitude + 360) % 360 + 360) % 360;
      if (diff < CLUSTER_THRESHOLD) {
        currentCluster.push(i);
      } else {
        clusters.push(currentCluster);
        currentCluster = [i];
      }
    }
  }
  if (currentCluster.length > 0) clusters.push(currentCluster);

  // 分配偏移
  clusters.forEach(cluster => {
    if (cluster.length <= 1) {
      planetOffsets[sortedPlanets[cluster[0]].key] = 0;
      return;
    }
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
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-2xl mx-auto" style={{ background: 'radial-gradient(circle, #1a1a2e 0%, #0f0f1a 100%)' }}>
      <defs>
        {/* 发光滤镜 */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* 强发光滤镜（用于 ASC/MC） */}
        <filter id="glowStrong" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* 相位线中心遮罩 */}
        <mask id="aspectMask">
          <rect width="100%" height="100%" fill="white" />
          <circle cx={cx} cy={cy} r={rCenter * 0.3} fill="black" />
        </mask>
      </defs>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* 背景圆 */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <circle cx={cx} cy={cy} r={rOuter} fill="none" stroke="#2d2a4d" strokeWidth="1.5" />

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* 外圈：12星座分段 + 360°刻度 */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      
      {/* 星座分段背景色 */}
      {SIGN_SYMBOLS.map((sym, i) => {
        const startAngle = lonToAngle(i * 30 + ascLon - Math.floor(ascLon / 30) * 30);
        const endAngle = lonToAngle((i + 1) * 30 + ascLon - Math.floor(ascLon / 30) * 30);
        
        // 计算弧形路径
        const x1 = cx + rSignOuter * Math.cos(startAngle);
        const y1 = cy - rSignOuter * Math.sin(startAngle);
        const x2 = cx + rSignOuter * Math.cos(endAngle);
        const y2 = cy - rSignOuter * Math.sin(endAngle);
        const x3 = cx + rSignInner * Math.cos(endAngle);
        const y3 = cy - rSignInner * Math.sin(endAngle);
        const x4 = cx + rSignInner * Math.cos(startAngle);
        const y4 = cy - rSignInner * Math.sin(startAngle);
        
        const largeArc = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
        
        return (
          <path
            key={`sign-${i}`}
            d={`M ${x1} ${y1} A ${rSignOuter} ${rSignOuter} 0 ${largeArc} 0 ${x2} ${y2} L ${x3} ${y3} A ${rSignInner} ${rSignInner} 0 ${largeArc} 1 ${x4} ${y4} Z`}
            fill={SIGN_COLORS[i]}
            opacity={0.15}
          />
        );
      })}

      {/* 星座圈边界 */}
      <circle cx={cx} cy={cy} r={rSignOuter} fill="none" stroke="#4a4778" strokeWidth="1.2" />
      <circle cx={cx} cy={cy} r={rSignInner} fill="none" stroke="#2d2a4d" strokeWidth="0.8" />

      {/* 360°刻度线（参考 almuten.net） */}
      {Array.from({ length: 360 }, (_, i) => {
        const angle = lonToAngle(ascLon - Math.floor(ascLon / 30) * 30 + i);
        const is5 = i % 5 === 0;
        const is15 = i % 30 === 0;
        const rStart = rSignOuter;
        const rEnd = is15 ? rSignOuter - 12 : is5 ? rSignOuter - 8 : rSignOuter - 4;
        
        const p1 = { x: cx + rStart * Math.cos(angle), y: cy - rStart * Math.sin(angle) };
        const p2 = { x: cx + rEnd * Math.cos(angle), y: cy - rEnd * Math.sin(angle) };
        
        return (
          <line
            key={`tick-${i}`}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke={is15 ? '#818CF8' : is5 ? '#6366F1' : '#3d3a5c'}
            strokeWidth={is15 ? 1.5 : is5 ? 1.0 : 0.5}
          />
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
            fontSize="16"
            fontWeight="bold"
            fill={SIGN_COLORS[i]}
            filter="url(#glow)"
          >
            {sym}
          </text>
        );
      })}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* 中圈：宫位线 + 宫头度数 */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      
      {/* 宫位圈边界 */}
      <circle cx={cx} cy={cy} r={rHouseOuter} fill="none" stroke="#4a4778" strokeWidth="0.8" />
      <circle cx={cx} cy={cy} r={rHouseInner} fill="none" stroke="#2d2a4d" strokeWidth="0.8" />

      {/* 宫位线 */}
      {(houses || []).map((h: any, idx: number) => {
        const isAngular = [1, 4, 7, 10].includes(h.house);
        const p1 = lonToXY(h.longitude, rCenter + 5);
        const p2 = lonToXY(h.longitude, isAngular ? rSignOuter : rHouseOuter);
        
        return (
          <line
            key={`house-${idx}`}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke={isAngular ? '#A78BFA' : '#3d3a5c'}
            strokeWidth={isAngular ? 2.0 : 0.8}
            strokeDasharray={isAngular ? 'none' : '4 4'}
          />
        );
      })}

      {/* 宫位数字 */}
      {(houses || []).map((h: any, idx: number) => {
        const next = houses[(idx + 1) % (houses?.length || 12)];
        if (!next) return null;
        
        let midLon: number;
        if (h.longitude < next.longitude) {
          midLon = h.longitude + (next.longitude - h.longitude) / 2;
        } else {
          midLon = h.longitude + (next.longitude + 360 - h.longitude) / 2;
        }
        
        const numPos = lonToXY(midLon % 360, (rHouseOuter + rHouseInner) / 2);
        const isAngular = [1, 4, 7, 10].includes(h.house);
        
        return (
          <text
            key={`num-${idx}`}
            x={numPos.x}
            y={numPos.y + 4}
            textAnchor="middle"
            fontSize={isAngular ? '14' : '11'}
            fontWeight={isAngular ? 'bold' : 'normal'}
            fill={isAngular ? '#A78BFA' : '#6b6b8d'}
          >
            {h.house}
          </text>
        );
      })}

      {/* 宫头度数（almuten.net 风格） */}
      {showDegrees && (houses || []).map((h: any, idx: number) => {
        const degVal = h.degree != null ? h.degree : (h.longitude % 30);
        const signIdx = Math.floor(normalize(h.longitude) / 30);
        const degPos = lonToXY(h.longitude, rHouseInner - 14);
        const isAngular = [1, 4, 7, 10].includes(h.house);
        
        return (
          <text
            key={`deg-${idx}`}
            x={degPos.x}
            y={degPos.y + 3}
            textAnchor="middle"
            fontSize={isAngular ? '9' : '7'}
            fill={isAngular ? '#9CA3AF' : '#4a4670'}
          >
            {Math.floor(degVal)}°{SIGN_SYMBOLS[signIdx]}
          </text>
        );
      })}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* 相位线（中心遮罩） */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      
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
                key={`aspect-${i}`}
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

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ASC 标记（三角形） */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <g filter="url(#glowStrong)">
        {(() => {
          const p = lonToXY(ascLon, rHouseOuter + 20);
          return (
            <>
              <polygon
                points={`${p.x},${p.y - 12} ${p.x - 7},${p.y + 5} ${p.x + 7},${p.y + 5}`}
                fill="#FBBF24"
                opacity={0.95}
              />
              <text
                x={p.x}
                y={p.y + 18}
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#FBBF24"
              >
                ASC
              </text>
            </>
          );
        })()}
      </g>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* MC 标记（三角形） */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {mcLon > 0 && (
        <g filter="url(#glowStrong)">
          {(() => {
            const p = lonToXY(mcLon, rHouseOuter + 20);
            return (
              <>
                <polygon
                  points={`${p.x},${p.y - 10} ${p.x - 6},${p.y + 4} ${p.x + 6},${p.y + 4}`}
                  fill="#A78BFA"
                  opacity={0.85}
                />
                <text
                  x={p.x}
                  y={p.y + 15}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="#A78BFA"
                >
                  MC
                </text>
              </>
            );
          })()}
        </g>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* 行星符号 + 度数 */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      
      {sortedPlanets.map((p: any) => {
        const offset = planetOffsets[p.key] || 0;
        const pos = lonToXY(p.longitude, rPlanet + offset);
        const color = PLANET_COLORS[p.key] || '#fbbf24';
        const symbol = PLANET_SYMBOLS[p.key] || p.key[0];
        
        // 计算精确度数
        const deg = normalize(p.longitude) % 30;
        
        return (
          <g key={`planet-${p.key}`} filter="url(#glow)">
            {/* 行星背景圆 */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r="14"
              fill={`${color}15`}
              stroke={color}
              strokeWidth="1.5"
            />
            
            {/* 行星符号 */}
            <text
              x={pos.x}
              y={pos.y + 5}
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fill={color}
              fontFamily="Segoe UI Symbol, Apple Symbols, Noto Sans Symbols 2, serif"
            >
              {symbol}
            </text>
            
            {/* 逆行标记 */}
            {p.retrograde && (
              <text
                x={pos.x + 12}
                y={pos.y - 10}
                fontSize="9"
                fontWeight="bold"
                fill="#F87171"
              >
                R
              </text>
            )}
            
            {/* 度数显示（行星旁） */}
            {showDegrees && (
              <text
                x={pos.x}
                y={pos.y + 24}
                textAnchor="middle"
                fontSize="8"
                fill="#9CA3AF"
              >
                {Math.floor(deg)}°
              </text>
            )}
          </g>
        );
      })}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* 中心圆 */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <circle cx={cx} cy={cy} r={rCenter} fill="#0a0818" stroke="rgba(124,58,237,0.25)" strokeWidth="1.2" />
      
      {/* 中心装饰 */}
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="24" fill="#FBBF24" filter="url(#glow)">
        ✧
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="#6366A8" letterSpacing="2">
        星缘
      </text>
      <text x={cx} y={cy + 24} textAnchor="middle" fontSize="7" fill="#4a4a6a">
        LUNAXSTAR
      </text>
    </svg>
  );
}
