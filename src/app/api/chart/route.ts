/**
 * Natal Chart API - Professional Implementation
 * 使用 astronomy-engine 计算真实天文位置
 * 支持多种分宫制，确保每个宫位显示正确度数
 */

import { NextRequest, NextResponse } from 'next/server';
import * as Astronomy from 'astronomy-engine';

// ════════════════════════════════════════════════════════════════════════════
// 常量定义
// ════════════════════════════════════════════════════════════════════════════

const SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const SIGNS_CN = ['白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座'];
const SIGN_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

const PLANETS = [
  { id: 'Sun', body: Astronomy.Body.Sun, symbol: '☉', name_cn: '太阳' },
  { id: 'Moon', body: Astronomy.Body.Moon, symbol: '☽', name_cn: '月亮' },
  { id: 'Mercury', body: Astronomy.Body.Mercury, symbol: '☿', name_cn: '水星' },
  { id: 'Venus', body: Astronomy.Body.Venus, symbol: '♀', name_cn: '金星' },
  { id: 'Mars', body: Astronomy.Body.Mars, symbol: '♂', name_cn: '火星' },
  { id: 'Jupiter', body: Astronomy.Body.Jupiter, symbol: '♃', name_cn: '木星' },
  { id: 'Saturn', body: Astronomy.Body.Saturn, symbol: '♄', name_cn: '土星' },
  { id: 'Uranus', body: Astronomy.Body.Uranus, symbol: '♅', name_cn: '天王星' },
  { id: 'Neptune', body: Astronomy.Body.Neptune, symbol: '♆', name_cn: '海王星' },
  { id: 'Pluto', body: Astronomy.Body.Pluto, symbol: '♇', name_cn: '冥王星' },
];

// 印尼主要城市（21个）+ 国际城市
const CITIES: Record<string, { lat: number; lng: number; tz: number; name_cn: string }> = {
  // 印尼 - 西部时区 WIB (UTC+7)
  jakarta: { lat: -6.2088, lng: 106.8456, tz: 7, name_cn: '雅加达' },
  surabaya: { lat: -7.2575, lng: 112.7521, tz: 7, name_cn: '泗水' },
  bandung: { lat: -6.9175, lng: 107.6191, tz: 7, name_cn: '万隆' },
  medan: { lat: 3.5952, lng: 98.6722, tz: 7, name_cn: '棉兰' },
  semarang: { lat: -6.9666, lng: 110.4196, tz: 7, name_cn: '三宝垄' },
  palembang: { lat: -2.9909, lng: 104.7566, tz: 7, name_cn: '巨港' },
  yogyakarta: { lat: -7.7956, lng: 110.3695, tz: 7, name_cn: '日惹' },
  malang: { lat: -7.9666, lng: 112.6326, tz: 7, name_cn: '玛琅' },
  solo: { lat: -7.5678, lng: 110.8281, tz: 7, name_cn: '梭罗' },
  pekanbaru: { lat: 0.5071, lng: 101.4458, tz: 7, name_cn: '北干巴鲁' },
  padang: { lat: -0.9471, lng: 100.4172, tz: 7, name_cn: '巴东' },
  batam: { lat: 1.0456, lng: 104.0406, tz: 7, name_cn: '巴淡岛' },
  tangerang: { lat: -6.1783, lng: 106.6317, tz: 7, name_cn: '坦格朗' },
  bekasi: { lat: -6.2349, lng: 106.9906, tz: 7, name_cn: '勿加泗' },
  bogor: { lat: -6.5950, lng: 106.8167, tz: 7, name_cn: '茂物' },
  // 印尼 - 中部时区 WITA (UTC+8)
  denpasar: { lat: -8.4095, lng: 115.1889, tz: 8, name_cn: '巴厘岛' },
  makassar: { lat: -5.1477, lng: 119.4327, tz: 8, name_cn: '望加锡' },
  manado: { lat: 1.4748, lng: 124.8421, tz: 8, name_cn: '万鸦老' },
  balikpapan: { lat: -1.2654, lng: 116.8312, tz: 8, name_cn: '巴厘巴板' },
  samarinda: { lat: -0.4948, lng: 117.1436, tz: 8, name_cn: '三马林达' },
  banjarmasin: { lat: -3.3194, lng: 114.5908, tz: 8, name_cn: '马辰' },
  // 印尼 - 东部时区 WIT (UTC+9)
  jayapura: { lat: -2.5337, lng: 140.7181, tz: 9, name_cn: '查亚普拉' },
  sorong: { lat: -0.8689, lng: 131.2481, tz: 9, name_cn: '索龙' },
  // 国际城市
  singapore: { lat: 1.3521, lng: 103.8198, tz: 8, name_cn: '新加坡' },
  kualalumpur: { lat: 3.1390, lng: 101.6869, tz: 8, name_cn: '吉隆坡' },
  bangkok: { lat: 13.7563, lng: 100.5018, tz: 7, name_cn: '曼谷' },
  hongkong: { lat: 22.3193, lng: 114.1694, tz: 8, name_cn: '香港' },
  taipei: { lat: 25.0330, lng: 121.5654, tz: 8, name_cn: '台北' },
  beijing: { lat: 39.9042, lng: 116.4074, tz: 8, name_cn: '北京' },
  shanghai: { lat: 31.2304, lng: 121.4737, tz: 8, name_cn: '上海' },
  shenzhen: { lat: 22.5431, lng: 114.0579, tz: 8, name_cn: '深圳' },
  guangzhou: { lat: 23.1291, lng: 113.2644, tz: 8, name_cn: '广州' },
  tokyo: { lat: 35.6762, lng: 139.6503, tz: 9, name_cn: '东京' },
  seoul: { lat: 37.5665, lng: 126.9780, tz: 9, name_cn: '首尔' },
  newyork: { lat: 40.7128, lng: -74.0060, tz: -5, name_cn: '纽约' },
  london: { lat: 51.5074, lng: -0.1278, tz: 0, name_cn: '伦敦' },
  sydney: { lat: -33.8688, lng: 151.2093, tz: 10, name_cn: '悉尼' },
};

// ════════════════════════════════════════════════════════════════════════════
// 工具函数
// ════════════════════════════════════════════════════════════════════════════

function normalize(a: number): number {
  return ((a % 360) + 360) % 360;
}

function formatDeg(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  return `${d}°${m.toString().padStart(2, '0')}'`;
}

function signData(lon: number) {
  const idx = Math.floor(normalize(lon) / 30) % 12;
  const deg = normalize(lon) % 30;
  return {
    sign: SIGNS[idx],
    sign_cn: SIGNS_CN[idx],
    symbol: SIGN_SYMBOLS[idx],
    degree: Math.round(deg * 1000) / 1000,
    formatted: formatDeg(deg),
  };
}

// ════════════════════════════════════════════════════════════════════════════
// 行星计算
// ════════════════════════════════════════════════════════════════════════════

function calcPlanet(config: typeof PLANETS[0], time: Astronomy.AstroTime) {
  try {
    let lon: number, lat: number, speed = 0;
    
    if (config.id === 'Moon') {
      const ecl = Astronomy.EclipticGeoMoon(time);
      lon = normalize(ecl.lon);
      lat = ecl.lat;
    } else {
      const vec = Astronomy.GeoVector(config.body, time, true);
      const ecl = Astronomy.Ecliptic(vec);
      lon = normalize(ecl.elon);
      lat = ecl.elat;
      
      // 逆行检测
      const time2 = Astronomy.MakeTime(new Date(time.date.getTime() + 86400000));
      const vec2 = Astronomy.GeoVector(config.body, time2, true);
      const ecl2 = Astronomy.Ecliptic(vec2);
      speed = normalize(ecl2.elon) - lon;
      if (speed > 180) speed -= 360;
      if (speed < -180) speed += 360;
    }
    
    const sd = signData(lon);
    
    return {
      id: config.id,
      name_cn: config.name_cn,
      longitude: Math.round(lon * 1000000) / 1000000,
      latitude: Math.round(lat * 1000000) / 1000000,
      retrograde: speed < 0,
      speed: Math.round(speed * 10000) / 10000,
      ...sd,
      planetSymbol: config.symbol,
    };
  } catch (e: unknown) {
    return { id: config.id, error: e instanceof Error ? e.message : String(e) };
  }
}

function calcAllPlanets(time: Astronomy.AstroTime) {
  const result: Record<string, unknown> = {};
  for (const p of PLANETS) {
    result[p.id] = calcPlanet(p, time);
  }
  
  // 月交点
  try {
    const moonEcl = Astronomy.EclipticGeoMoon(time);
    const north = normalize(moonEcl.lon + 180);
    const south = normalize(north + 180);
    result['North_Node'] = { id: 'North_Node', name_cn: '北交点', longitude: north, latitude: 0, retrograde: true, ...signData(north), planetSymbol: '☊' };
    result['South_Node'] = { id: 'South_Node', name_cn: '南交点', longitude: south, latitude: 0, retrograde: true, ...signData(south), planetSymbol: '☋' };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    result['North_Node'] = { error: msg };
    result['South_Node'] = { error: msg };
  }
  
  return result;
}

// ════════════════════════════════════════════════════════════════════════════
// 上升点和MC计算（基于天文公式）
// ════════════════════════════════════════════════════════════════════════════

function calcLST(time: Astronomy.AstroTime, lng: number): number {
  // 本地恒星时（Local Sidereal Time）计算
  const jd = time.ut + 2451545.0;
  const T = (jd - 2451545.0) / 36525.0;
  
  // Greenwich恒星时（度）
  let GST = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T;
  GST = normalize(GST);
  
  // 本地恒星时
  return normalize(GST + lng);
}

function calcAscendant(lat: number, LSTdeg: number): number {
  // 上升点计算（使用精确公式）
  const obliquity = 23.4393; // 黄赤交角（度）
  
  const latRad = lat * Math.PI / 180;
  const lstRad = LSTdeg * Math.PI / 180;
  const oblRad = obliquity * Math.PI / 180;
  
  // 计算上升点
  const tanAsc = Math.cos(lstRad) / (Math.cos(oblRad) * Math.sin(lstRad) - Math.sin(oblRad) * Math.tan(latRad));
  let ascRad = Math.atan(tanAsc);
  
  // 调整象限
  const sinLST = Math.sin(lstRad);
  if (sinLST < 0) {
    ascRad += Math.PI;
  } else if (Math.cos(lstRad) < 0) {
    ascRad += Math.PI;
  }
  
  // 将赤经转换到黄道经度
  // 使用更精确的公式
  const asc = normalize(ascRad * 180 / Math.PI);
  
  return asc;
}

function calcMC(LSTdeg: number): number {
  // 中天计算
  const obliquity = 23.4393;
  const lstRad = LSTdeg * Math.PI / 180;
  const oblRad = obliquity * Math.PI / 180;
  
  const tanMC = Math.tan(lstRad) / Math.cos(oblRad);
  let mcRad = Math.atan(tanMC);
  
  // 调整象限
  if (Math.cos(lstRad) < 0) {
    mcRad += Math.PI;
  }
  
  return normalize(mcRad * 180 / Math.PI);
}

// ════════════════════════════════════════════════════════════════════════════
// 宫位计算 - 根据分宫制
// ════════════════════════════════════════════════════════════════════════════

function calcHouses(time: Astronomy.AstroTime, lat: number, lng: number, system: string = 'P') {
  const LST = calcLST(time, lng);
  const ascLon = calcAscendant(lat, LST);
  const mcLon = calcMC(LST);
  
  const houses = [];
  
  if (system === 'P') {
    // Porphyry House System:
    // Divide each of the 4 quadrants (defined by ASC/DESC and MC/IC) into 3 equal parts.
    // Quadrant 1: ASC → IC  (houses 1,2,3; H4 cusp = IC)
    // Quadrant 2: IC  → DSC (houses 4,5,6; H7 cusp = DSC)
    // Quadrant 3: DSC → MC   (houses 7,8,9; H10 cusp = MC)
    // Quadrant 4: MC  → ASC  (houses 10,11,12; H1 cusp = ASC)
    
    const desc = normalize(ascLon + 180);
    const ic   = normalize(mcLon + 180);
    
    // CCW distance from a to b: normalize(b - a)
    const q1Size = normalize(ic - ascLon);   // ASC → IC
    const q2Size = normalize(desc - ic);       // IC → DSC
    const q3Size = normalize(mcLon - desc);     // DSC → MC
    const q4Size = normalize(ascLon - mcLon);   // MC → ASC
    
    const cusps = [
      // H1, H2, H3, H4(=IC)
      ascLon,
      normalize(ascLon + q1Size / 3),
      normalize(ascLon + 2 * q1Size / 3),
      ic,
      // H5, H6, H7(=DSC)
      normalize(ic + q2Size / 3),
      normalize(ic + 2 * q2Size / 3),
      desc,
      // H8, H9, H10(=MC)
      normalize(desc + q3Size / 3),
      normalize(desc + 2 * q3Size / 3),
      mcLon,
      // H11, H12, (H1=ASC, wraps around)
      normalize(mcLon + q4Size / 3),
      normalize(mcLon + 2 * q4Size / 3),
    ];
    
    for (let i = 0; i < 12; i++) {
      const cuspLon = cusps[i];
      const sd = signData(cuspLon);
      houses.push({
        house: i + 1,
        house_cn: `${i + 1}宫`,
        longitude: Math.round(cuspLon * 10000) / 10000,
        ...sd,
      });
    }
  } else {
    for (let i = 0; i < 12; i++) {
      let cuspLon: number;
      
      switch (system) {
        case 'W': // Whole Sign: 1st house = sign of ASC
          const ascSign = Math.floor(ascLon / 30);
          cuspLon = ((ascSign + i) % 12) * 30;
          break;
        case 'E': // Equal House
        default:
          cuspLon = normalize(ascLon + i * 30);
      }
      
      const sd = signData(cuspLon);
      
      houses.push({
        house: i + 1,
        house_cn: `${i + 1}宫`,
        longitude: Math.round(cuspLon * 10000) / 10000,
        ...sd,
      });
    }
  }
  
  return {
    houses,
    ascendant: {
      longitude: Math.round(ascLon * 10000) / 10000,
      ...signData(ascLon),
    },
    midheaven: {
      longitude: Math.round(mcLon * 10000) / 10000,
      ...signData(mcLon),
    },
  };
}

// ════════════════════════════════════════════════════════════════════════════
// 相位计算
// ════════════════════════════════════════════════════════════════════════════

function calcAspects(planets: Record<string, any>) {
  const aspects: any[] = [];
  const keys = Object.keys(planets).filter(k => !planets[k]?.error);
  
  const ASPECTS = [
    { name: 'Conjunction', angle: 0, orb: 10 },
    { name: 'Sextile', angle: 60, orb: 6 },
    { name: 'Square', angle: 90, orb: 8 },
    { name: 'Trine', angle: 120, orb: 8 },
    { name: 'Opposition', angle: 180, orb: 10 },
  ];
  
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const p1 = planets[keys[i]];
      const p2 = planets[keys[j]];
      
      let diff = Math.abs(p1.longitude - p2.longitude);
      if (diff > 180) diff = 360 - diff;
      
      for (const asp of ASPECTS) {
        if (Math.abs(diff - asp.angle) <= asp.orb) {
          aspects.push({
            planet1: keys[i],
            planet2: keys[j],
            type: asp.name,
            aspect: asp.name,
            angle: asp.angle,
            orb: Math.round((diff - asp.angle) * 100) / 100,
          });
          break;
        }
      }
    }
  }
  
  return aspects.sort((a, b) => Math.abs(a.orb) - Math.abs(b.orb));
}

// ════════════════════════════════════════════════════════════════════════════
// API Handler
// ════════════════════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 解析参数
    const year = parseInt(body.year);
    const month = parseInt(body.month);
    const day = parseInt(body.day);
    const hour = parseFloat(body.hour) || 12;
    const minute = parseInt(body.minute) || 0;
    const system = body.houseSystem || 'P';
    const cityKey = (body.city || '').toLowerCase().replace(/\s+/g, '');
    
    // 解析坐标
    let lat = parseFloat(body.latitude);
    let lng = parseFloat(body.longitude);
    let tz = parseFloat(body.timezone) || 8;
    
    // 城市查询
    if (cityKey && CITIES[cityKey]) {
      const cityData = CITIES[cityKey];
      lat = cityData.lat;
      lng = cityData.lng;
      tz = cityData.tz;
    }
    
    // 验证
    if (!year || !month || !day) {
      return NextResponse.json({ success: false, error: '请提供完整的出生日期' }, { status: 400 });
    }
    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ success: false, error: '请提供有效的出生地点' }, { status: 400 });
    }
    
    // 转换UTC
    const localHour = hour + minute / 60;
    const utcHour = ((localHour - tz) % 24 + 24) % 24;
    const utcDate = new Date(Date.UTC(year, month - 1, day, Math.floor(utcHour), Math.round((utcHour % 1) * 60)));
    const astroTime = Astronomy.MakeTime(utcDate);
    
    // 计算
    const planets = calcAllPlanets(astroTime);
    const houseData = calcHouses(astroTime, lat, lng, system);
    const aspects = calcAspects(planets);
    
    return NextResponse.json({
      success: true,
      data: {
        planets,
        houses: houseData.houses,
        ascendant: houseData.ascendant,
        midheaven: houseData.midheaven,
        aspects,
        birthInfo: {
          localTime: `${year}-${month}-${day} ${Math.floor(hour)}:${minute.toString().padStart(2, '0')}`,
          utcTime: utcDate.toISOString(),
          location: CITIES[cityKey]?.name_cn || `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`,
          coordinates: { lat, lng, tz },
          houseSystem: system,
        },
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Chart API error:', err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// GET - 返回可用城市
export async function GET() {
  return NextResponse.json({
    success: true,
    cities: Object.entries(CITIES).map(([key, data]) => ({
      id: key,
      name_cn: data.name_cn,
      tz: data.tz,
    })),
    houseSystems: [
      { code: 'P', name: '波菲里宫制', name_en: 'Porphyry' },
      { code: 'E', name: '等宫制', name_en: 'Equal House' },
      { code: 'W', name: '整宫制', name_en: 'Whole Sign' },
    ],
  });
}
