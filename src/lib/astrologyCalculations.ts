// 完整的星盘计算库

// 星座数据
export const SIGNS = [
  { id: "aries", name: { id: "Aries", zh: "白羊座", en: "Aries" }, symbol: "♈", element: "fire", mode: "cardinal" },
  { id: "taurus", name: { id: "Taurus", zh: "金牛座", en: "Taurus" }, symbol: "♉", element: "earth", mode: "fixed" },
  { id: "gemini", name: { id: "Gemini", zh: "双子座", en: "Gemini" }, symbol: "♊", element: "air", mode: "mutable" },
  { id: "cancer", name: { id: "Cancer", zh: "巨蟹座", en: "Cancer" }, symbol: "♋", element: "water", mode: "cardinal" },
  { id: "leo", name: { id: "Leo", zh: "狮子座", en: "Leo" }, symbol: "♌", element: "fire", mode: "fixed" },
  { id: "virgo", name: { id: "Virgo", zh: "处女座", en: "Virgo" }, symbol: "♍", element: "earth", mode: "mutable" },
  { id: "libra", name: { id: "Libra", zh: "天秤座", en: "Libra" }, symbol: "♎", element: "air", mode: "cardinal" },
  { id: "scorpio", name: { id: "Scorpio", zh: "天蝎座", en: "Scorpio" }, symbol: "♏", element: "water", mode: "fixed" },
  { id: "sagittarius", name: { id: "Sagittarius", zh: "射手座", en: "Sagittarius" }, symbol: "♐", element: "fire", mode: "mutable" },
  { id: "capricorn", name: { id: "Capricorn", zh: "摩羯座", en: "Capricorn" }, symbol: "♑", element: "earth", mode: "cardinal" },
  { id: "aquarius", name: { id: "Aquarius", zh: "水瓶座", en: "Aquarius" }, symbol: "♒", element: "air", mode: "fixed" },
  { id: "pisces", name: { id: "Pisces", zh: "双鱼座", en: "Pisces" }, symbol: "♓", element: "water", mode: "mutable" },
];

// 行星数据
export const PLANETS = [
  { id: "sun", name: { id: "Matahari", zh: "太阳", en: "Sun" }, symbol: "☉", color: "#FFD700", speed: 1, isPersonal: true },
  { id: "moon", name: { id: "Bulan", zh: "月亮", en: "Moon" }, symbol: "☽", color: "#C0C0C0", speed: 13.2, isPersonal: true },
  { id: "mercury", name: { id: "Merkurius", zh: "水星", en: "Mercury" }, symbol: "☿", color: "#87CEEB", speed: 1.2, isPersonal: true },
  { id: "venus", name: { id: "Venus", zh: "金星", en: "Venus" }, symbol: "♀", color: "#FF69B4", speed: 1.0, isPersonal: true },
  { id: "mars", name: { id: "Mars", zh: "火星", en: "Mars" }, symbol: "♂", color: "#FF4500", speed: 0.5, isPersonal: true },
  { id: "jupiter", name: { id: "Jupiter", zh: "木星", en: "Jupiter" }, symbol: "♃", color: "#FFA500", speed: 0.08, isPersonal: false },
  { id: "saturn", name: { id: "Saturnus", zh: "土星", en: "Saturn" }, symbol: "♄", color: "#DAA520", speed: 0.03, isPersonal: false },
  { id: "uranus", name: { id: "Uranus", zh: "天王星", en: "Uranus" }, symbol: "♅", color: "#40E0D0", speed: 0.01, isPersonal: false },
  { id: "neptune", name: { id: "Neptunus", zh: "海王星", en: "Neptune" }, symbol: "♆", color: "#4169E1", speed: 0.006, isPersonal: false },
  { id: "pluto", name: { id: "Pluto", zh: "冥王星", en: "Pluto" }, symbol: "♇", color: "#8B008B", speed: 0.004, isPersonal: false },
];

// 宫位数据
export const HOUSES = [
  { number: 1, name: { id: "Identitas", zh: "自我", en: "Self" }, theme: { id: "Penampilan dan pendekatan", zh: "外表和态度", en: "Appearance and approach" } },
  { number: 2, name: { id: "Sumber Daya", zh: "财富", en: "Resources" }, theme: { id: "Uang dan nilai", zh: "金钱和价值观", en: "Money and values" } },
  { number: 3, name: { id: "Komunikasi", zh: "沟通", en: "Communication" }, theme: { id: "Pikiran dan saudara", zh: "思维和兄弟姐妹", en: "Mind and siblings" } },
  { number: 4, name: { id: "Rumah", zh: "家庭", en: "Home" }, theme: { id: "Keluarga dan akar", zh: "家庭和根源", en: "Family and roots" } },
  { number: 5, name: { id: "Kreativitas", zh: "创造", en: "Creativity" }, theme: { id: "Anak dan cinta", zh: "孩子和爱情", en: "Children and romance" } },
  { number: 6, name: { id: "Pelayanan", zh: "服务", en: "Service" }, theme: { id: "Kerja dan kesehatan", zh: "工作和健康", en: "Work and health" } },
  { number: 7, name: { id: "Kemitraan", zh: "伴侣", en: "Partnership" }, theme: { id: "Hubungan dan pernikahan", zh: "关系和婚姻", en: "Relationships and marriage" } },
  { number: 8, name: { id: "Transformasi", zh: "转变", en: "Transformation" }, theme: { id: "Kematian dan regenerasi", zh: "死亡和重生", en: "Death and rebirth" } },
  { number: 9, name: { id: "Filosofi", zh: "哲学", en: "Philosophy" }, theme: { id: "Perjalanan dan kepercayaan", zh: "旅行和信仰", en: "Travel and beliefs" } },
  { number: 10, name: { id: "Karir", zh: "事业", en: "Career" }, theme: { id: "Reputasi dan tujuan", zh: "名声和目标", en: "Reputation and purpose" } },
  { number: 11, name: { id: "Komunitas", zh: "社群", en: "Community" }, theme: { id: "Teman dan harapan", zh: "朋友和希望", en: "Friends and hopes" } },
  { number: 12, name: { id: "Spiritual", zh: "灵性", en: "Spirituality" }, theme: { id: "Tidak sadar dan karma", zh: "潜意识和业力", en: "Unconscious and karma" } },
];

// 相位数据
export const ASPECTS = [
  { id: "conjunction", name: { id: "Konjungsi", zh: "合相", en: "Conjunction" }, symbol: "☌", angle: 0, orb: 8, nature: "neutral" },
  { id: "opposition", name: { id: "Oposisi", zh: "对冲", en: "Opposition" }, symbol: "☍", angle: 180, orb: 8, nature: "challenging" },
  { id: "trine", name: { id: "Trine", zh: "三分", en: "Trine" }, symbol: "△", angle: 120, orb: 8, nature: "harmonious" },
  { id: "square", name: { id: "Square", zh: "四分", en: "Square" }, symbol: "□", angle: 90, orb: 8, nature: "challenging" },
  { id: "sextile", name: { id: "Sextile", zh: "六分", en: "Sextile" }, symbol: "✱", angle: 60, orb: 6, nature: "harmonious" },
];

// 元素和模式颜色
export const ELEMENT_COLORS: Record<string, string> = {
  fire: "#FF4500",
  earth: "#8B4513",
  air: "#87CEEB",
  water: "#4169E1",
};

export const MODE_COLORS: Record<string, string> = {
  cardinal: "#FFD700",
  fixed: "#00CED1",
  mutable: "#9370DB",
};

// 计算 Julian Day
export function calculateJulianDay(year: number, month: number, day: number, hour: number, minute: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  return jdn + (hour + minute / 60 - 12) / 24;
}

// 计算 Sun 位置（简化版）
export function calculateSunPosition(jd: number): { sign: string; degree: number } {
  // 简化的太阳位置计算
  const n = jd - 2451545.0;
  let L = (280.460 + 0.9856474 * n) % 360;
  if (L < 0) L += 360;
  
  const g = ((357.528 + 0.9856003 * n) % 360) * Math.PI / 180;
  const lambda = L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g);
  
  let longitude = lambda % 360;
  if (longitude < 0) longitude += 360;
  
  const signIndex = Math.floor(longitude / 30);
  const degreeInSign = longitude % 30;
  
  return {
    sign: SIGNS[signIndex].id,
    degree: degreeInSign,
  };
}

// 计算所有行星位置（简化版）
export function calculatePlanetPositions(jd: number): Record<string, { sign: string; degree: number; retrograde: boolean }> {
  const positions: Record<string, { sign: string; degree: number; retrograde: boolean }> = {};
  
  PLANETS.forEach((planet) => {
    // 简化计算 - 实际应用应使用 Swiss Ephemeris
    const baseAngle = (jd * planet.speed * 10) % 360;
    const longitude = (baseAngle + PLANETS.indexOf(planet) * 30) % 360;
    const signIndex = Math.floor(longitude / 30);
    const degreeInSign = longitude % 30;
    
    positions[planet.id] = {
      sign: SIGNS[signIndex].id,
      degree: degreeInSign,
      retrograde: Math.random() > 0.8, // 简化
    };
  });
  
  // Sun 使用更准确的计算
  positions.sun = { ...calculateSunPosition(jd), retrograde: false };
  
  return positions;
}

// 计算 Ascendant（上升星座）
export function calculateAscendant(jd: number, latitude: number, geoLongitude: number): { sign: string; degree: number } {
  // 简化的上升计算
  const lst = (jd * 360.985647) % 360; // 本地恒星时
  const obliquity = 23.44; // 黄赤交角
  
  const ascAngle = Math.atan2(
    Math.cos(lst * Math.PI / 180),
    Math.sin(lst * Math.PI / 180) * Math.cos(obliquity * Math.PI / 180) + 
    Math.tan(latitude * Math.PI / 180) * Math.sin(obliquity * Math.PI / 180)
  ) * 180 / Math.PI;
  
  let eclipticLongitude = (ascAngle + 180) % 360;
  if (eclipticLongitude < 0) eclipticLongitude += 360;
  
  const signIndex = Math.floor(eclipticLongitude / 30);
  const degreeInSign = eclipticLongitude % 30;
  
  return {
    sign: SIGNS[signIndex].id,
    degree: degreeInSign,
  };
}

// 计算 MC（中天）
export function calculateMC(jd: number, latitude: number, geoLongitude: number): { sign: string; degree: number } {
  const lst = (jd * 360.985647) % 360;
  
  let mcAngle = (lst + geoLongitude) % 360;
  if (mcAngle < 0) mcAngle += 360;
  
  const signIndex = Math.floor(mcAngle / 30);
  const degreeInSign = mcAngle % 30;
  
  return {
    sign: SIGNS[signIndex].id,
    degree: degreeInSign,
  };
}

// 计算宫位分界
export function calculateHouseCusps(ascendant: { sign: string; degree: number }, mc: { sign: string; degree: number }): number[] {
  const ascDegree = SIGNS.findIndex(s => s.id === ascendant.sign) * 30 + ascendant.degree;
  const mcDegree = SIGNS.findIndex(s => s.id === mc.sign) * 30 + mc.degree;
  
  // Placidus 宫位系统简化
  const cusps: number[] = [];
  for (let i = 0; i < 12; i++) {
    cusps.push((ascDegree + i * 30) % 360);
  }
  
  return cusps;
}

// 行星落入宫位
export function getPlanetHouse(planetLongitude: number, cusps: number[]): number {
  for (let i = 0; i < 12; i++) {
    const nextCusp = cusps[(i + 1) % 12];
    const currentCusp = cusps[i];
    
    if (nextCusp > currentCusp) {
      if (planetLongitude >= currentCusp && planetLongitude < nextCusp) {
        return i + 1;
      }
    } else {
      if (planetLongitude >= currentCusp || planetLongitude < nextCusp) {
        return i + 1;
      }
    }
  }
  return 1;
}

// 计算相位
export function calculateAspects(positions: Record<string, { sign: string; degree: number; retrograde: boolean }>): Array<{ planet1: string; planet2: string; aspect: string; orb: number }> {
  const aspects: Array<{ planet1: string; planet2: string; aspect: string; orb: number }> = [];
  
  const planetIds = Object.keys(positions);
  
  for (let i = 0; i < planetIds.length; i++) {
    for (let j = i + 1; j < planetIds.length; j++) {
      const p1 = positions[planetIds[i]];
      const p2 = positions[planetIds[j]];
      
      const lon1 = SIGNS.findIndex(s => s.id === p1.sign) * 30 + p1.degree;
      const lon2 = SIGNS.findIndex(s => s.id === p2.sign) * 30 + p2.degree;
      
      let diff = Math.abs(lon1 - lon2);
      if (diff > 180) diff = 360 - diff;
      
      ASPECTS.forEach(aspect => {
        const orb = Math.abs(diff - aspect.angle);
        if (orb <= aspect.orb) {
          aspects.push({
            planet1: planetIds[i],
            planet2: planetIds[j],
            aspect: aspect.id,
            orb: orb,
          });
        }
      });
    }
  }
  
  return aspects;
}