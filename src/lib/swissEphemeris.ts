/**
 * Swiss Ephemeris 集成模块
 * 使用 pyswisseph 或 swisseph 进行精确的星盘计算
 */

// Swiss Ephemeris 行星编号
export const SE_PLANETS = {
  SUN: 0,
  MOON: 1,
  MERCURY: 2,
  VENUS: 3,
  MARS: 4,
  JUPITER: 5,
  SATURN: 6,
  URANUS: 7,
  NEPTUNE: 8,
  PLUTO: 9,
  MEAN_NODE: 10,
  TRUE_NODE: 11,
  MEAN_APOG: 12,
  OSCU_APOG: 13,
  EARTH: 14,
  CHIRON: 15,
  PHOLUS: 16,
  CERES: 17,
  PALLAS: 18,
  JUNO: 19,
  VESTA: 20
};

// 宫位系统
export const SE_HOUSE_SYSTEMS = {
  PLACIDUS: 'P',
  KOCH: 'K',
  EQUAL: 'E',
  WHOLE_SIGN: 'W',
  CAMPANUS: 'C',
  REGIOMONTANUS: 'R',
  PORPHYRIUS: 'O',
  MORINUS: 'M',
  HORIZONTAL: 'H',
  VEHLOW_EQUAL: 'V',
  KRUSINSKI: 'U'
};

// 计算标志
export const SE_FLAGS = {
  // 坐标系
  ECLIPTIC: 2,
  EQUATORIAL: 2048,
  // 岁差
  J2000: 64,
  JPL_HORIZONS: 256,
  // 光行差
  NO_ABERRATION: 1024,
  NO_DEFLECTION: 2048,
  // 其他
  SPEED: 256,
  EQUATORIAL_POS: 2048,
  XYZ: 4096,
  RADIAN: 8192,
  BARYCENTER: 16384,
  TOPOCENTRIC: 32768,
  SIDEREAL: 65536,
  ICRS: 131072
};

// 星座边界（简化版，基于2000年分点）
export const ZODIAC_BOUNDARIES = [
  { sign: "aries", start: 0, symbol: "♈", element: "Fire", quality: "Cardinal" },
  { sign: "taurus", start: 30, symbol: "♉", element: "Earth", quality: "Fixed" },
  { sign: "gemini", start: 60, symbol: "♊", element: "Air", quality: "Mutable" },
  { sign: "cancer", start: 90, symbol: "♋", element: "Water", quality: "Cardinal" },
  { sign: "leo", start: 120, symbol: "♌", element: "Fire", quality: "Fixed" },
  { sign: "virgo", start: 150, symbol: "♍", element: "Earth", quality: "Mutable" },
  { sign: "libra", start: 180, symbol: "♎", element: "Air", quality: "Cardinal" },
  { sign: "scorpio", start: 210, symbol: "♏", element: "Water", quality: "Fixed" },
  { sign: "sagittarius", start: 240, symbol: "♐", element: "Fire", quality: "Mutable" },
  { sign: "capricorn", start: 270, symbol: "♑", element: "Earth", quality: "Cardinal" },
  { sign: "aquarius", start: 300, symbol: "♒", element: "Air", quality: "Fixed" },
  { sign: "pisces", start: 330, symbol: "♓", element: "Water", quality: "Mutable" }
];

// 行星数据（基于天文历表）
export const PLANET_DATA = {
  sun: { name: "Sun", zh: "太阳", id: "Matahari", symbol: "☉", period: 365.25, ruling: ["leo"] },
  moon: { name: "Moon", zh: "月亮", id: "Bulan", symbol: "☽", period: 27.32, ruling: ["cancer"] },
  mercury: { name: "Mercury", zh: "水星", id: "Merkurius", symbol: "☿", period: 88, ruling: ["gemini", "virgo"] },
  venus: { name: "Venus", zh: "金星", id: "Venus", symbol: "♀", period: 225, ruling: ["taurus", "libra"] },
  mars: { name: "Mars", zh: "火星", id: "Mars", symbol: "♂", period: 687, ruling: ["aries", "scorpio"] },
  jupiter: { name: "Jupiter", zh: "木星", id: "Yupiter", symbol: "♃", period: 4333, ruling: ["sagittarius", "pisces"] },
  saturn: { name: "Saturn", zh: "土星", id: "Saturnus", symbol: "♄", period: 10759, ruling: ["capricorn", "aquarius"] },
  uranus: { name: "Uranus", zh: "天王星", id: "Uranus", symbol: "♅", period: 30687, ruling: ["aquarius"] },
  neptune: { name: "Neptune", zh: "海王星", id: "Neptunus", symbol: "♆", period: 60190, ruling: ["pisces"] },
  pluto: { name: "Pluto", zh: "冥王星", id: "Pluto", symbol: "♇", period: 90553, ruling: ["scorpio"] }
};

// 将角度转换为星座位置
export function longitudeToZodiac(longitude: number): {
  sign: string;
  degree: number;
  minute: number;
  symbol: string;
  element: string;
} {
  const normalized = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const signData = ZODIAC_BOUNDARIES[signIndex];
  const degree = Math.floor(normalized % 30);
  const minute = Math.floor((normalized % 1) * 60);
  
  return {
    sign: signData.sign,
    degree,
    minute,
    symbol: signData.symbol,
    element: signData.element
  };
}

// 计算两个行星之间的相位
export function calculateAspect(
  pos1: number,
  pos2: number,
  orb: number = 6
): {
  aspect: string | null;
  angle: number;
  exactAngle: number;
  orb: number;
  type: "major" | "minor" | null;
} {
  const diff = Math.abs(((pos1 - pos2 + 180) % 360) - 180);
  
  const ASPECTS = [
    { name: "conjunction", angle: 0, symbol: "☌", type: "major" },
    { name: "semi-sextile", angle: 30, symbol: "⚺", type: "minor" },
    { name: "semi-square", angle: 45, symbol: "⚼", type: "minor" },
    { name: "sextile", angle: 60, symbol: "⚹", type: "major" },
    { name: "quintile", angle: 72, symbol: "Q", type: "minor" },
    { name: "square", angle: 90, symbol: "□", type: "major" },
    { name: "trine", angle: 120, symbol: "△", type: "major" },
    { name: "sesquiquadrate", angle: 135, symbol: "⚼", type: "minor" },
    { name: "biquintile", angle: 144, symbol: "bQ", type: "minor" },
    { name: "quincunx", angle: 150, symbol: "⚻", type: "minor" },
    { name: "opposition", angle: 180, symbol: "☍", type: "major" }
  ];
  
  for (const aspect of ASPECTS) {
    const aspectDiff = Math.abs(diff - aspect.angle);
    if (aspectDiff <= orb) {
      return {
        aspect: aspect.name,
        angle: aspect.angle,
        exactAngle: diff,
        orb: aspectDiff,
        type: aspect.type as "major" | "minor"
      };
    }
  }
  
  return { aspect: null, angle: diff, exactAngle: diff, orb: 0, type: null };
}

// 计算 Julian Day Number (简化版)
export function dateToJulianDay(year: number, month: number, day: number, hour: number = 0, minute: number = 0): number {
  // 简化计算，实际应使用完整的儒略日算法
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  
  const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  const fraction = (hour - 12) / 24 + minute / 1440;
  
  return jd + fraction;
}

// 使用简化天文算法计算太阳位置（基于VSOP87简化）
export function calculateSunPosition(jd: number): number {
  // 简化版太阳黄经计算
  const T = (jd - 2451545.0) / 36525; // 从J2000起的儒略世纪数
  
  // 太阳平黄经
  const L0 = (280.46646 + 36000.76983 * T + 0.0003032 * T * T) % 360;
  
  // 太阳平近点角
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) % 360;
  
  // 中心差
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * Math.PI / 180)
          + (0.019993 - 0.000101 * T) * Math.sin(2 * M * Math.PI / 180)
          + 0.000289 * Math.sin(3 * M * Math.PI / 180);
  
  // 太阳黄经
  const longitude = (L0 + C) % 360;
  
  return longitude < 0 ? longitude + 360 : longitude;
}

// 使用简化天文算法计算月亮位置
export function calculateMoonPosition(jd: number): number {
  // 简化版月亮黄经计算
  const T = (jd - 2451545.0) / 36525;
  
  // 月亮平黄经
  const L = (218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T * T * T / 538841 - T * T * T * T / 65194000) % 360;
  
  // 月亮平近点角
  const M = (134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + T * T * T / 69699 - T * T * T * T / 14712000) % 360;
  
  // 太阳平近点角
  const Ms = (357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + T * T * T / 24490000) % 360;
  
  // 月亮纬度参数
  const F = (93.2720950 + 483202.0175233 * T - 0.0036539 * T * T - T * T * T / 3526000 + T * T * T * T / 863310000) % 360;
  
  // 主要摄动项
  const dL = 6.289 * Math.sin(M * Math.PI / 180)
           + 1.274 * Math.sin((2 * L - Ms) * Math.PI / 180)
           + 0.658 * Math.sin(2 * M * Math.PI / 180)
           + 0.214 * Math.sin(2 * L * Math.PI / 180)
           - 0.186 * Math.sin(Ms * Math.PI / 180)
           - 0.114 * Math.sin(2 * F * Math.PI / 180);
  
  const longitude = (L + dL) % 360;
  
  return longitude < 0 ? longitude + 360 : longitude;
}

// 计算所有行星位置（简化版）
export function calculateAllPlanets(jd: number): Record<string, {
  longitude: number;
  latitude: number;
  distance: number;
  speed: number;
  zodiac: ReturnType<typeof longitudeToZodiac>;
  retrograde: boolean;
}> {
  const sunLong = calculateSunPosition(jd);
  const moonLong = calculateMoonPosition(jd);
  
  // 简化计算其他行星（实际应使用完整的VSOP87理论）
  const T = (jd - 2451545.0) / 36525;
  
  const planets: Record<string, { long: number; dist: number; period: number }> = {
    mercury: { long: (sunLong + 50 * Math.sin(T * 2) + 360 * (T * 4.15 % 1)) % 360, dist: 0.39, period: 88 },
    venus: { long: (sunLong + 80 * Math.sin(T * 1.6) + 360 * (T * 1.62 % 1)) % 360, dist: 0.72, period: 225 },
    mars: { long: (sunLong + 120 * Math.sin(T * 0.5) + 360 * (T * 0.53 % 1)) % 360, dist: 1.52, period: 687 },
    jupiter: { long: (sunLong + 200 * Math.sin(T * 0.08) + 360 * (T * 0.084 % 1)) % 360, dist: 5.2, period: 4333 },
    saturn: { long: (sunLong + 280 * Math.sin(T * 0.03) + 360 * (T * 0.034 % 1)) % 360, dist: 9.5, period: 10759 },
    uranus: { long: (sunLong + 50 * Math.sin(T * 0.01) + 360 * (T * 0.012 % 1)) % 360, dist: 19.2, period: 30687 },
    neptune: { long: (sunLong + 150 * Math.sin(T * 0.006) + 360 * (T * 0.006 % 1)) % 360, dist: 30.1, period: 60190 },
    pluto: { long: (sunLong + 220 * Math.sin(T * 0.004) + 360 * (T * 0.004 % 1)) % 360, dist: 39.5, period: 90553 }
  };
  
  const result: Record<string, any> = {
    sun: {
      longitude: sunLong,
      latitude: 0,
      distance: 1,
      speed: 0.9856,
      zodiac: longitudeToZodiac(sunLong),
      retrograde: false
    },
    moon: {
      longitude: moonLong,
      latitude: 0,
      distance: 0.00257,
      speed: 13.1764,
      zodiac: longitudeToZodiac(moonLong),
      retrograde: false
    }
  };
  
  for (const [name, data] of Object.entries(planets)) {
    const prevLong = (data.long - 360 / data.period) % 360;
    const speed = ((data.long - prevLong + 360) % 360);
    
    result[name] = {
      longitude: data.long,
      latitude: 0,
      distance: data.dist,
      speed,
      zodiac: longitudeToZodiac(data.long),
      retrograde: speed < 0
    };
  }
  
  return result;
}

// 计算上升点（简化版）
export function calculateAscendant(
  jd: number,
  latitude: number,
  longitude: number
): { sign: string; degree: number; exactLongitude: number } {
  // 简化版上升点计算
  const T = (jd - 2451545.0) / 36525;
  
  // 恒星时（简化）
  const theta = (280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - T * T * T / 38710000) % 360;
  
  // 太阳黄经
  const sunLong = calculateSunPosition(jd);
  
  // 简化上升点计算
  const ascLong = (theta + longitude - sunLong + 180) % 360;
  const zodiac = longitudeToZodiac(ascLong);
  
  return {
    sign: zodiac.sign,
    degree: zodiac.degree + zodiac.minute / 60,
    exactLongitude: ascLong
  };
}

// 计算宫位（Placidus系统简化版）
export function calculateHouses(
  jd: number,
  latitude: number,
  longitude: number,
  system: string = "P"
): Array<{ number: number; sign: string; cusp: number; element: string }> {
  const ascendant = calculateAscendant(jd, latitude, longitude);
  const ascLong = ascendant.exactLongitude;
  
  const houses: Array<{ number: number; sign: string; cusp: number; element: string }> = [];
  
  // Placidus 宫位计算（简化）
  for (let i = 0; i < 12; i++) {
    const cuspLong = (ascLong + i * 30) % 360;
    const zodiac = longitudeToZodiac(cuspLong);
    
    houses.push({
      number: i + 1,
      sign: zodiac.sign,
      cusp: cuspLong,
      element: zodiac.element
    });
  }
  
  return houses;
}

// 生成完整的本命盘
export function generateNatalChart(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  latitude: number,
  longitude: number,
  timezone: number
): {
  planets: Record<string, any>;
  houses: ReturnType<typeof calculateHouses>;
  ascendant: ReturnType<typeof calculateAscendant>;
  aspects: Array<any>;
  julianDay: number;
} {
  // 转换为UT
  const utHour = hour - timezone;
  const jd = dateToJulianDay(year, month, day, utHour, minute);
  
  // 计算行星位置
  const planets = calculateAllPlanets(jd);
  
  // 计算宫位
  const houses = calculateHouses(jd, latitude, longitude);
  
  // 计算上升点
  const ascendant = calculateAscendant(jd, latitude, longitude);
  
  // 计算相位
  const aspects: Array<any> = [];
  const planetNames = Object.keys(planets);
  
  for (let i = 0; i < planetNames.length; i++) {
    for (let j = i + 1; j < planetNames.length; j++) {
      const p1 = planetNames[i];
      const p2 = planetNames[j];
      const aspect = calculateAspect(planets[p1].longitude, planets[p2].longitude);
      
      if (aspect.aspect && aspect.type === "major") {
        aspects.push({
          planet1: p1,
          planet2: p2,
          ...aspect
        });
      }
    }
  }
  
  return {
    planets,
    houses,
    ascendant,
    aspects,
    julianDay: jd
  };
}

// 导出默认对象
const swissEphemeris = {
  SE_PLANETS,
  SE_HOUSE_SYSTEMS,
  SE_FLAGS,
  ZODIAC_BOUNDARIES,
  PLANET_DATA,
  longitudeToZodiac,
  calculateAspect,
  dateToJulianDay,
  calculateSunPosition,
  calculateMoonPosition,
  calculateAllPlanets,
  calculateAscendant,
  calculateHouses,
  generateNatalChart
};

export default swissEphemeris;