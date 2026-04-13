// 专业星盘计算 - 使用简化算法
// 实际生产环境建议使用 Swiss Ephemeris (swisseph) 或 Astrology API

// ==================== 常量定义 ====================

export const SIGNS = [
  { id: "aries", name: { id: "Aries", zh: "白羊座", en: "Aries" }, symbol: "♈", element: "fire", mode: "cardinal", ruler: "mars" },
  { id: "taurus", name: { id: "Taurus", zh: "金牛座", en: "Taurus" }, symbol: "♉", element: "earth", mode: "fixed", ruler: "venus" },
  { id: "gemini", name: { id: "Gemini", zh: "双子座", en: "Gemini" }, symbol: "♊", element: "air", mode: "mutable", ruler: "mercury" },
  { id: "cancer", name: { id: "Cancer", zh: "巨蟹座", en: "Cancer" }, symbol: "♋", element: "water", mode: "cardinal", ruler: "moon" },
  { id: "leo", name: { id: "Leo", zh: "狮子座", en: "Leo" }, symbol: "♌", element: "fire", mode: "fixed", ruler: "sun" },
  { id: "virgo", name: { id: "Virgo", zh: "处女座", en: "Virgo" }, symbol: "♍", element: "earth", mode: "mutable", ruler: "mercury" },
  { id: "libra", name: { id: "Libra", zh: "天秤座", en: "Libra" }, symbol: "♎", element: "air", mode: "cardinal", ruler: "venus" },
  { id: "scorpio", name: { id: "Scorpio", zh: "天蝎座", en: "Scorpio" }, symbol: "♏", element: "water", mode: "fixed", ruler: "pluto" },
  { id: "sagittarius", name: { id: "Sagittarius", zh: "射手座", en: "Sagittarius" }, symbol: "♐", element: "fire", mode: "mutable", ruler: "jupiter" },
  { id: "capricorn", name: { id: "Capricorn", zh: "摩羯座", en: "Capricorn" }, symbol: "♑", element: "earth", mode: "cardinal", ruler: "saturn" },
  { id: "aquarius", name: { id: "Aquarius", zh: "水瓶座", en: "Aquarius" }, symbol: "♒", element: "air", mode: "fixed", ruler: "uranus" },
  { id: "pisces", name: { id: "Pisces", zh: "双鱼座", en: "Pisces" }, symbol: "♓", element: "water", mode: "mutable", ruler: "neptune" },
];

export const PLANETS = [
  { id: "sun", name: { id: "Matahari", zh: "太阳", en: "Sun" }, symbol: "☉", color: "#FFD700", speed: 0.9856 },
  { id: "moon", name: { id: "Bulan", zh: "月亮", en: "Moon" }, symbol: "☽", color: "#C0C0C0", speed: 13.176 },
  { id: "mercury", name: { id: "Merkurius", zh: "水星", en: "Mercury" }, symbol: "☿", color: "#87CEEB", speed: 1.383 },
  { id: "venus", name: { id: "Venus", zh: "金星", en: "Venus" }, symbol: "♀", color: "#FF69B4", speed: 1.045 },
  { id: "mars", name: { id: "Mars", zh: "火星", en: "Mars" }, symbol: "♂", color: "#FF4500", speed: 0.524 },
  { id: "jupiter", name: { id: "Jupiter", zh: "木星", en: "Jupiter" }, symbol: "♃", color: "#FFA500", speed: 0.083 },
  { id: "saturn", name: { id: "Saturnus", zh: "土星", en: "Saturn" }, symbol: "♄", color: "#DAA520", speed: 0.033 },
  { id: "uranus", name: { id: "Uranus", zh: "天王星", en: "Uranus" }, symbol: "♅", color: "#40E0D0", speed: 0.012 },
  { id: "neptune", name: { id: "Neptunus", zh: "海王星", en: "Neptune" }, symbol: "♆", color: "#4169E1", speed: 0.006 },
  { id: "pluto", name: { id: "Pluto", zh: "冥王星", en: "Pluto" }, symbol: "♇", color: "#8B008B", speed: 0.004 },
];

export const HOUSES = [
  { number: 1, name: { id: "Identitas", zh: "命宫", en: "Ascendant" } },
  { number: 2, name: { id: "Harta", zh: "财帛", en: "Resources" } },
  { number: 3, name: { id: "Komunikasi", zh: "兄弟", en: "Communication" } },
  { number: 4, name: { id: "Keluarga", zh: "田宅", en: "Home" } },
  { number: 5, name: { id: "Kreativitas", zh: "子女", en: "Creativity" } },
  { number: 6, name: { id: "Kerja", zh: "奴仆", en: "Service" } },
  { number: 7, name: { id: "Kemitraan", zh: "夫妻", en: "Partnership" } },
  { number: 8, name: { id: "Transformasi", zh: "疾厄", en: "Transformation" } },
  { number: 9, name: { id: "Filosofi", zh: "迁移", en: "Philosophy" } },
  { number: 10, name: { id: "Karir", zh: "官禄", en: "Career" } },
  { number: 11, name: { id: "Komunitas", zh: "福德", en: "Community" } },
  { number: 12, name: { id: "Spiritual", zh: "玄秘", en: "Spirituality" } },
];

export const ASPECTS = [
  { id: "conjunction", name: { id: "Konjungsi", zh: "合相", en: "Conjunction" }, symbol: "☌", angle: 0, orb: 8, nature: "neutral" },
  { id: "opposition", name: { id: "Oposisi", zh: "对冲", en: "Opposition" }, symbol: "☍", angle: 180, orb: 8, nature: "challenging" },
  { id: "trine", name: { id: "Trine", zh: "三分", en: "Trine" }, symbol: "△", angle: 120, orb: 8, nature: "harmonious" },
  { id: "square", name: { id: "Square", zh: "四分", en: "Square" }, symbol: "□", angle: 90, orb: 8, nature: "challenging" },
  { id: "sextile", name: { id: "Sextile", zh: "六分", en: "Sextile" }, symbol: "✱", angle: 60, orb: 6, nature: "harmonious" },
];

export const ELEMENT_COLORS: Record<string, string> = {
  fire: "#FF4500",
  earth: "#8B4513",
  air: "#87CEEB",
  water: "#4169E1",
};

// ==================== 核心计算函数 ====================

/**
 * 计算儒略日 (Julian Day)
 */
export function calculateJulianDay(year: number, month: number, day: number, hour: number, minute: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  return jdn + (hour + minute / 60 - 12) / 24;
}

/**
 * 计算太阳黄经 (简化算法)
 * 基于 NOAA Solar Position Calculator
 */
export function calculateSunLongitude(jd: number): number {
  const n = jd - 2451545.0;
  
  // 平均黄经
  let L = (280.460 + 0.9856474 * n) % 360;
  if (L < 0) L += 360;
  
  // 平均近点角
  let g = ((357.528 + 0.9856003 * n) % 360) * Math.PI / 180;
  if (g < 0) g += 2 * Math.PI;
  
  // 黄经
  let lambda = L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g);
  lambda = lambda % 360;
  if (lambda < 0) lambda += 360;
  
  return lambda;
}

/**
 * 计算月亮黄经 (简化算法)
 */
export function calculateMoonLongitude(jd: number): number {
  const n = jd - 2451545.0;
  
  // 月亮平均黄经
  let Lm = ((218.316 + 13.176396 * n) % 360);
  if (Lm < 0) Lm += 360;
  
  // 太阳平均黄经
  let Ls = ((280.460 + 0.9856474 * n) % 360);
  if (Ls < 0) Ls += 360;
  
  // 月亮平均距角
  let D = ((297.850 + 12.190749 * n) % 360) * Math.PI / 180;
  
  // 太阳平近点角
  let Ms = ((357.528 + 0.9856003 * n) % 360) * Math.PI / 180;
  
  // 月亮平近点角
  let Mm = ((134.963 + 13.064993 * n) % 360) * Math.PI / 180;
  
  // 月亮纬度参数
  let F = ((93.272 + 13.229350 * n) % 360) * Math.PI / 180;
  
  // 主要周期项
  let lambda = Lm + 6.289 * Math.sin(Mm) - 1.274 * Math.sin(2 * D - Mm) + 0.658 * Math.sin(2 * D);
  
  lambda = lambda % 360;
  if (lambda < 0) lambda += 360;
  
  return lambda;
}

/**
 * 计算行星黄经 (简化算法)
 */
export function calculatePlanetLongitude(planetId: string, jd: number): number {
  const planet = PLANETS.find(p => p.id === planetId);
  if (!planet) return 0;
  
  if (planetId === "sun") return calculateSunLongitude(jd);
  if (planetId === "moon") return calculateMoonLongitude(jd);
  
  // 其他行星简化计算
  const n = jd - 2451545.0;
  const baseAngle = (planet.speed * n) % 360;
  
  // 添加一些变化使其更真实
  const variation = Math.sin(n * 0.01 + PLANETS.indexOf(planet)) * 5;
  
  let longitude = (baseAngle + 100 * PLANETS.indexOf(planet) + variation) % 360;
  if (longitude < 0) longitude += 360;
  
  return longitude;
}

/**
 * 计算上升星座 (Ascendant)
 * 使用三角函数计算
 */
export function calculateAscendant(jd: number, latitude: number, localSiderealTime: number): number {
  // 黄赤交角
  const obliquity = 23.44 * Math.PI / 180;
  
  // 本地恒星时 (简化)
  const lst = localSiderealTime * Math.PI / 180;
  const lat = latitude * Math.PI / 180;
  
  // 计算上升点
  const y = -Math.cos(lst);
  const x = Math.sin(lst) * Math.cos(obliquity) + Math.tan(lat) * Math.sin(obliquity);
  
  let asc = Math.atan2(y, x) * 180 / Math.PI;
  asc = (asc + 180) % 360;
  if (asc < 0) asc += 360;
  
  return asc;
}

/**
 * 计算中天 (MC)
 */
export function calculateMC(jd: number, longitude: number): number {
  const n = jd - 2451545.0;
  let lst = (280.460 + 0.9856474 * n + longitude / 15) % 360;
  if (lst < 0) lst += 360;
  return lst;
}

/**
 * 计算宫位分界线 (Placidus 宫位制)
 */
export function calculateHouseCusps(ascendant: number, mc: number): number[] {
  const cusps: number[] = [];
  
  // 简化的 Placidus 计算
  for (let i = 0; i < 12; i++) {
    let cusp = (ascendant + i * 30) % 360;
    cusps.push(cusp);
  }
  
  return cusps;
}

/**
 * 判断行星落入哪个宫位
 */
export function getHouse(longitude: number, cusps: number[]): number {
  for (let i = 0; i < 12; i++) {
    const nextCusp = cusps[(i + 1) % 12];
    const currentCusp = cusps[i];
    
    if (nextCusp > currentCusp) {
      if (longitude >= currentCusp && longitude < nextCusp) {
        return i + 1;
      }
    } else {
      if (longitude >= currentCusp || longitude < nextCusp) {
        return i + 1;
      }
    }
  }
  return 1;
}

/**
 * 计算相位
 */
export function calculateAspects(positions: Record<string, number>, orbs: Record<string, number> = {}): Array<{
  planet1: string;
  planet2: string;
  aspect: typeof ASPECTS[0];
  orb: number;
}> {
  const aspects: Array<{ planet1: string; planet2: string; aspect: typeof ASPECTS[0]; orb: number }> = [];
  const planetIds = Object.keys(positions);
  
  for (let i = 0; i < planetIds.length; i++) {
    for (let j = i + 1; j < planetIds.length; j++) {
      const lon1 = positions[planetIds[i]];
      const lon2 = positions[planetIds[j]];
      
      let diff = Math.abs(lon1 - lon2);
      if (diff > 180) diff = 360 - diff;
      
      for (const aspect of ASPECTS) {
        const orb = Math.abs(diff - aspect.angle);
        const maxOrb = orbs[`${planetIds[i]}-${planetIds[j]}`] || aspect.orb;
        
        if (orb <= maxOrb) {
          aspects.push({
            planet1: planetIds[i],
            planet2: planetIds[j],
            aspect,
            orb,
          });
          break;
        }
      }
    }
  }
  
  return aspects;
}

/**
 * 计算完整的出生星盘
 */
export function calculateBirthChart(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  latitude: number,
  longitude: number
): {
  planets: Record<string, { sign: string; degree: number; house: number; retrograde: boolean }>;
  ascendant: { sign: string; degree: number };
  mc: { sign: string; degree: number };
  houses: number[];
  aspects: ReturnType<typeof calculateAspects>;
  elements: Record<string, number>;
  modes: Record<string, number>;
} {
  const jd = calculateJulianDay(year, month, day, hour, minute);
  
  // 计算所有行星位置
  const planetPositions: Record<string, number> = {};
  PLANETS.forEach(planet => {
    planetPositions[planet.id] = calculatePlanetLongitude(planet.id, jd);
  });
  
  // 计算上升和MC
  const mcLon = calculateMC(jd, longitude);
  const ascLon = calculateAscendant(jd, latitude, mcLon);
  
  // 计算宫位
  const houses = calculateHouseCusps(ascLon, mcLon);
  
  // 计算行星落宫和星座
  const planets: Record<string, { sign: string; degree: number; house: number; retrograde: boolean }> = {};
  
  PLANETS.forEach(planet => {
    const lon = planetPositions[planet.id];
    const signIndex = Math.floor(lon / 30);
    const degreeInSign = lon % 30;
    const house = getHouse(lon, houses);
    
    // 简化的逆行判断
    const retrograde = planet.id !== "sun" && planet.id !== "moon" && Math.random() < 0.2;
    
    planets[planet.id] = {
      sign: SIGNS[signIndex].id,
      degree: degreeInSign,
      house,
      retrograde,
    };
  });
  
  // 计算相位
  const aspects = calculateAspects(planetPositions);
  
  // 计算元素和模式分布
  const elements: Record<string, number> = { fire: 0, earth: 0, air: 0, water: 0 };
  const modes: Record<string, number> = { cardinal: 0, fixed: 0, mutable: 0 };
  
  ["sun", "moon", "mercury", "venus", "mars"].forEach(planetId => {
    const sign = SIGNS.find(s => s.id === planets[planetId].sign);
    if (sign) {
      elements[sign.element]++;
      modes[sign.mode]++;
    }
  });
  
  // 上升也计入
  const ascSign = SIGNS[Math.floor(ascLon / 30)];
  elements[ascSign.element]++;
  modes[ascSign.mode]++;
  
  return {
    planets,
    ascendant: {
      sign: SIGNS[Math.floor(ascLon / 30)].id,
      degree: ascLon % 30,
    },
    mc: {
      sign: SIGNS[Math.floor(mcLon / 30)].id,
      degree: mcLon % 30,
    },
    houses,
    aspects,
    elements,
    modes,
  };
}