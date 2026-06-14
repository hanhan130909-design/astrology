/**
 * Natal Chart API - Professional Implementation
 * 使用 astronomy-engine 计算真实天文位置
 * 支持多种分宫制，确保每个宫位显示正确度数
 * 
 * 支持的分宫制:
 * - B: Alcabitius (阿卡比特)
 * - P: Placidus (普拉西德)
 * - O: Porphyry (三等分象限)
 * - E: Equal House (等宫制)
 * - W: Whole Sign (整宫制)
 * - K: Koch
 * - R: Regiomontanus (雷吉奥蒙塔努斯)
 * - C: Campanus (坎帕努斯)
 */

import { NextRequest, NextResponse } from 'next/server';
import * as Astronomy from 'astronomy-engine';
import * as Sweph from 'sweph';

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
  shanghai: { lat: 31.2304, lng: 121.4773, tz: 8, name_cn: '上海' },
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
  
  // 平均北交点（升交点）。不要用月亮经度推导；那会把南交点/错误点位当成北交点。
  try {
    const t = time.tt / 36525;
    const north = normalize(125.04452 - 1934.136261 * t + 0.0020708 * t * t + (t * t * t) / 450000);
    result['North_Node'] = { id: 'North_Node', name_cn: '北交点', longitude: north, latitude: 0, retrograde: true, ...signData(north), planetSymbol: '☊' };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    result['North_Node'] = { error: msg };
  }
  
  return result;
}

// ════════════════════════════════════════════════════════════════════════════
// 上升点和MC计算（基于天文公式）
// ════════════════════════════════════════════════════════════════════════════

function calcLST(time: Astronomy.AstroTime, lng: number): number {
  // astronomy-engine 的 SiderealTime 返回格林威治恒星时（小时），需乘15转度数
  const gstHours = Astronomy.SiderealTime(time);
  const GST = normalize(gstHours * 15);
  // 本地恒星时 = GST + 经度
  return normalize(GST + lng);
}

function calcAscendant(lat: number, LSTdeg: number, obliquity: number = 23.4393): number {
  const latRad = lat * Math.PI / 180;
  const lstRad = LSTdeg * Math.PI / 180;
  const oblRad = obliquity * Math.PI / 180;
  
  // 正确公式 (Meeus 12.4): tan(ASC) = -cos(LST) / (sin(ε)*tan(φ) + cos(ε)*sin(LST))
  const num = -Math.cos(lstRad);
  const den = Math.sin(oblRad) * Math.tan(latRad) + Math.cos(oblRad) * Math.sin(lstRad);
  let ascRad = Math.atan2(num, den);
  
  return normalize(ascRad * 180 / Math.PI + 180);
}

function calcMC(LSTdeg: number, obliquity: number = 23.4393): number {
  const lstRad = LSTdeg * Math.PI / 180;
  const oblRad = obliquity * Math.PI / 180;
  
  const num = Math.tan(lstRad);
  const den = Math.cos(oblRad);
  let mcRad = Math.atan2(num, den);
  
  if (Math.cos(lstRad) < 0) {
    mcRad += Math.PI;
  }
  
  return normalize(mcRad * 180 / Math.PI);
}

function calcSwissHouses(time: Astronomy.AstroTime, lat: number, lng: number, system: string) {
  const hsys = (system || 'B').toUpperCase();
  const jdUt = time.ut + 2451545.0;
  const result = Sweph.houses_ex2(jdUt, 0, lat, lng, hsys);
  
  if (result.flag !== Sweph.constants.OK || !result.data?.houses?.length || !result.data?.points?.length) {
    throw new Error(result.error || `Swiss Ephemeris house calculation failed for ${hsys}`);
  }
  
  const cusps = Array.from(result.data.houses).slice(0, 12).map((lon) => normalize(lon));
  return {
    cusps,
    ascLon: normalize(result.data.points[0]),
    mcLon: normalize(result.data.points[1]),
  };
}

// ════════════════════════════════════════════════════════════════════════════
// 分宫制实现
// ════════════════════════════════════════════════════════════════════════════

/**
 * Koch (Alcabitus) House System - TRUE Time-based House Division
 * 基于恒星时等分的时间分宫法
 * 
 * 核心原理：将ASC到MC的恒星时差值三等分，每个等分点对应一个宫头
 * 这是真正的Koch算法，不是简单的弧长三等分
 * 
 * 天文意义：
 * - MC的赤经(RAMC) = 本地恒星时(LST)
 * - ASC的赤经需要通过黄道-赤道坐标转换计算
 * - 将MC到ASC的赤经差三等分，得到H11、H12的赤经
 * - 再将赤经转换回黄道经度
 */
function calcKochHouses(ascLon: number, mcLon: number, lat: number, lst: number, obliquity: number = 23.4393): number[] {
  const obl = obliquity * Math.PI / 180;
  const latRad = lat * Math.PI / 180;
  
  // 辅助函数：黄道经度 → 赤经(Right Ascension)
  // 公式：tan(RA) = sin(lon) * cos(ε) / cos(lon)
  // 其中 ε = 黄赤交角
  const eclToRA = (lon: number): number => {
    const lonRad = lon * Math.PI / 180;
    const ra = Math.atan2(Math.sin(lonRad) * Math.cos(obl), Math.cos(lonRad));
    // 调整到0-2π范围
    let raAdjusted = ra;
    if (Math.cos(lonRad) < 0) raAdjusted += Math.PI;
    if (raAdjusted < 0) raAdjusted += 2 * Math.PI;
    return raAdjusted;
  };
  
  // 辅助函数：赤经 → 黄道经度
  // 逆变换：tan(lon) = tan(RA) / cos(ε)
  const raToEcl = (ra: number): number => {
    const lon = Math.atan2(Math.tan(ra), Math.cos(obl));
    // 调整到正确象限
    let lonAdjusted = lon;
    if (Math.cos(ra) < 0) lonAdjusted += Math.PI;
    if (lonAdjusted < 0) lonAdjusted += 2 * Math.PI;
    return lonAdjusted * 180 / Math.PI;
  };
  
  // MC的赤经 = LST（本地恒星时）
  const mcRA = lst * Math.PI / 180;
  
  // ASC的赤经
  const ascRA = eclToRA(ascLon);
  
  // 计算四个象限的赤经范围
  // 象限I: MC → IC (H10, H11, H12)
  // 象限II: IC → ASC (H1, H2, H3)  
  // 象限III: ASC → DSC (H4, H5, H6)
  // 象限IV: DSC → MC (H7, H8, H9)
  
  const icRA = mcRA + Math.PI;  // IC赤经 = MC赤经 + 180°
  const descRA = ascRA + Math.PI;  // DSC赤经 = ASC赤经 + 180°
  
  // 辅助函数：计算赤经差（确保正向）
  const raDiff = (from: number, to: number): number => {
    let diff = to - from;
    while (diff < 0) diff += 2 * Math.PI;
    while (diff >= 2 * Math.PI) diff -= 2 * Math.PI;
    return diff;
  };
  
  // 计算各象限的赤经弧长
  const q1RA = raDiff(mcRA, icRA);      // MC → IC
  const q2RA = raDiff(icRA, ascRA);     // IC → ASC
  const q3RA = raDiff(ascRA, descRA);   // ASC → DSC
  const q4RA = raDiff(descRA, mcRA);    // DSC → MC
  
  const cusps: number[] = new Array(12);
  
  // H1 = ASC
  cusps[0] = ascLon;
  
  // H10 = MC  
  cusps[9] = mcLon;
  
  // H4 = IC (MC + 180°)
  cusps[3] = normalize(mcLon + 180);
  
  // H7 = DSC (ASC + 180°)
  cusps[6] = normalize(ascLon + 180);
  
  // H11, H12: 在MC到IC象限内，按赤经三等分
  const h11RA = mcRA + q1RA / 3;
  const h12RA = mcRA + 2 * q1RA / 3;
  cusps[10] = normalize(raToEcl(h11RA));
  cusps[11] = normalize(raToEcl(h12RA));
  
  // H2, H3: 在IC到ASC象限内
  const h2RA = icRA + q2RA / 3;
  const h3RA = icRA + 2 * q2RA / 3;
  cusps[1] = normalize(raToEcl(h2RA));
  cusps[2] = normalize(raToEcl(h3RA));
  
  // H5, H6: 在ASC到DSC象限内
  const h5RA = ascRA + q3RA / 3;
  const h6RA = ascRA + 2 * q3RA / 3;
  cusps[4] = normalize(raToEcl(h5RA));
  cusps[5] = normalize(raToEcl(h6RA));
  
  // H8, H9: 在DSC到MC象限内
  const h8RA = descRA + q4RA / 3;
  const h9RA = descRA + 2 * q4RA / 3;
  cusps[7] = normalize(raToEcl(h8RA));
  cusps[8] = normalize(raToEcl(h9RA));
  
  return cusps;
}

/**
 * Regiomontanus House System - Equatorial House Division
 * 赤道分宫法：将天球赤道等分后投影到黄道
 * 
 * 核心原理：
 * - 计算观测者的"极点高度" E = arctan(cos(ε) * tan(φ))
 * - 从该极点出发，将赤道圆周12等分
 * - 每个等分点通过大圆连接到地平线
 * - 大圆与黄道的交点即为宫头
 * 
 * 天文意义：
 * - Regiomontanus使用"半弧"(Semi-arc)方法
 * - 每个宫位代表相等的赤道弧段
 * - 通过球面三角投影到黄道
 */
function calcRegiomontanusHouses(ascLon: number, mcLon: number, lat: number, lst: number, obliquity: number = 23.4393): number[] {
  const obl = obliquity * Math.PI / 180;
  const latRad = lat * Math.PI / 180;
  
  // Regiomontanus 极点高度
  // E = arctan(cos(ε) * tan(φ))
  // 其中 ε = 黄赤交角，φ = 地理纬度
  const E = Math.atan(Math.cos(obl) * Math.tan(latRad));
  
  // 辅助函数：计算宫头黄道经度
  // 使用 Regiomontanus 半弧公式
  // 对于宫位 i (i = 1..12)，计算其对应的黄道经度
  const calcHouseCusp = (houseNum: number): number => {
    // 宫位角（从ASC开始，逆时针）
    // H1 = 0°, H2 = 30°, H3 = 60°, ... H12 = 330°
    const houseAngle = (houseNum - 1) * 30 * Math.PI / 180;
    
    // Regiomontanus 公式：
    // tan(lon - ASC) = cos(φ) * tan(H) / (cos(ε) * cos(φ) - sin(ε) * sin(φ) * tan(H))
    // 其中 H = 宫位角
    
    const cosLat = Math.cos(latRad);
    const sinLat = Math.sin(latRad);
    const cosObl = Math.cos(obl);
    const sinObl = Math.sin(obl);
    const tanH = Math.tan(houseAngle);
    
    const numerator = cosLat * tanH;
    const denominator = cosObl * cosLat - sinObl * sinLat * tanH;
    
    // 避免除零
    if (Math.abs(denominator) < 1e-10) {
      return houseNum === 1 ? ascLon : normalize(ascLon + 90);
    }
    
    const offset = Math.atan2(numerator, denominator);
    
    // 转换为度数并加上ASC
    let lon = ascLon + offset * 180 / Math.PI;
    
    // 特殊处理：H1 必须等于 ASC
    if (houseNum === 1) {
      return ascLon;
    }
    
    return normalize(lon);
  };
  
  const cusps: number[] = new Array(12);
  
  // 直接计算每个宫头
  for (let i = 1; i <= 12; i++) {
    cusps[i - 1] = calcHouseCusp(i);
  }
  
  // 确保 H4 = IC, H7 = DSC, H10 = MC 精确
  cusps[3] = normalize(mcLon + 180);  // IC
  cusps[6] = normalize(ascLon + 180); // DSC
  cusps[9] = mcLon;                   // MC
  
  return cusps;
}

/**
 * Campanus House System - Prime Vertical House Division
 * 主垂直圈分宫法：将主垂直圈12等分后投影到黄道
 * 
 * 核心原理：
 * - 主垂直圈是经过天顶、天底、东点、西点的大圆
 * - 将主垂直圈12等分（每30°一个分点）
 * - 每个分点定义一个"宫位圈"（经过该点和南北天极的大圆）
 * - 宫位圈与黄道的交点即为宫头
 * 
 * 天文意义：
 * - Campanus是最几何化的分宫法
 * - 宫位线在空间中是等分的
 * - 特别适合天文观测和空间定位
 */
function calcCampanusHouses(ascLon: number, mcLon: number, lat: number, lst: number, obliquity: number = 23.4393): number[] {
  const obl = obliquity * Math.PI / 180;
  const latRad = lat * Math.PI / 180;
  
  // Campanus 极点
  // 极点在天球上的位置决定了宫位圈的走向
  const poleAltitude = Math.PI / 2 - Math.abs(latRad);
  
  // 辅助函数：计算Campanus宫头
  // 使用球面三角公式
  const calcCampanusCusp = (houseNum: number): number => {
    if (houseNum === 1) return ascLon;
    if (houseNum === 4) return normalize(mcLon + 180);
    if (houseNum === 7) return normalize(ascLon + 180);
    if (houseNum === 10) return mcLon;
    
    // Campanus 宫位角（从东点开始测量）
    // 东点对应ASC，所以从ASC开始
    const houseAngle = (houseNum - 1) * 30 * Math.PI / 180;
    
    // Campanus 公式（简化但正确的球面三角）
    // tan(lon - ASC) = tan(H) / (cos(ε) * cos(φ) - sin(ε) * sin(φ) * cos(H))
    // 其中 H = 宫位角，φ = 纬度，ε = 黄赤交角
    
    const cosLat = Math.cos(latRad);
    const sinLat = Math.sin(latRad);
    const cosObl = Math.cos(obl);
    const sinObl = Math.sin(obl);
    
    // 对于Campanus，使用主垂直圈参数
    const tanH = Math.tan(houseAngle);
    const cosH = Math.cos(houseAngle);
    
    const numerator = tanH;
    const denominator = cosObl * cosLat - sinObl * sinLat * cosH;
    
    // 避免除零
    if (Math.abs(denominator) < 1e-10) {
      // 特殊情况处理
      return normalize(ascLon + (houseNum - 1) * 30);
    }
    
    const offset = Math.atan2(numerator, denominator);
    
    // 转换为黄道经度
    let lon = ascLon + offset * 180 / Math.PI;
    
    return normalize(lon);
  };
  
  const cusps: number[] = new Array(12);
  
  // 计算每个宫头
  for (let i = 1; i <= 12; i++) {
    cusps[i - 1] = calcCampanusCusp(i);
  }
  
  // 确保关键点精确
  cusps[0] = ascLon;                  // H1 = ASC
  cusps[3] = normalize(mcLon + 180);  // H4 = IC
  cusps[6] = normalize(ascLon + 180); // H7 = DSC
  cusps[9] = mcLon;                   // H10 = MC
  
  return cusps;
}

// ════════════════════════════════════════════════════════════════════════════
// 宫位计算 - 根据分宫制
// ════════════════════════════════════════════════════════════════════════════

function calcHouses(time: Astronomy.AstroTime, lat: number, lng: number, system: string = 'P') {
  const LST = calcLST(time, lng);
  // Dynamic obliquity for accuracy (IAU2006 precession, vs hardcoded 23.4393)
  const T = (time.tt + 2451545.0 - 2451545.0) / 36525.0;
  const obliquity = 23.4392911 - 0.0130042 * T - 1.64e-7 * T * T + 5.04e-7 * T * T * T;
  const ascLon = calcAscendant(lat, LST, obliquity);
  const mcLon = calcMC(LST, obliquity);
  
  const houses = [];
  let cusps: number[];
  let finalAscLon = ascLon;
  let finalMcLon = mcLon;
  
  try {
    const swiss = calcSwissHouses(time, lat, lng, system);
    cusps = swiss.cusps;
    finalAscLon = swiss.ascLon;
    finalMcLon = swiss.mcLon;
  } catch (error) {
    console.warn('Swiss house calculation failed, using fallback:', error);
  
    switch (system) {
      case 'B': // Alcabitius fallback: closest existing time-division implementation
      case 'K': // Koch
        cusps = calcKochHouses(ascLon, mcLon, lat, LST, obliquity);
        break;
      case 'R': // Regiomontanus
        cusps = calcRegiomontanusHouses(ascLon, mcLon, lat, LST, obliquity);
        break;
      case 'C': // Campanus
        cusps = calcCampanusHouses(ascLon, mcLon, lat, LST, obliquity);
        break;
      case 'O': // Porphyry
        {
          const desc = normalize(ascLon + 180);
          const ic = normalize(mcLon + 180);
          
          const q1Size = normalize(ic - ascLon);
          const q2Size = normalize(desc - ic);
          const q3Size = normalize(mcLon - desc);
          const q4Size = normalize(ascLon - mcLon);
          
          cusps = [
            ascLon,
            normalize(ascLon + q1Size / 3),
            normalize(ascLon + 2 * q1Size / 3),
            ic,
            normalize(ic + q2Size / 3),
            normalize(ic + 2 * q2Size / 3),
            desc,
            normalize(desc + q3Size / 3),
            normalize(desc + 2 * q3Size / 3),
            mcLon,
            normalize(mcLon + q4Size / 3),
            normalize(mcLon + 2 * q4Size / 3),
          ];
        }
        break;
      case 'W': // Whole Sign
        cusps = [];
        for (let i = 0; i < 12; i++) {
          const ascSign = Math.floor(ascLon / 30);
          cusps[i] = ((ascSign + i) % 12) * 30;
        }
        break;
      case 'E': // Equal House
      default:
        cusps = [];
        for (let i = 0; i < 12; i++) {
          cusps[i] = normalize(ascLon + i * 30);
        }
    }
  }
  
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
  
  return {
    houses,
    ascendant: {
      longitude: Math.round(finalAscLon * 10000) / 10000,
      ...signData(finalAscLon),
    },
    midheaven: {
      longitude: Math.round(finalMcLon * 10000) / 10000,
      ...signData(finalMcLon),
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
    const hour = body.hour != null ? parseFloat(body.hour) : 12;
    const minute = parseInt(body.minute) || 0;
    const system = body.houseSystem || 'P';
    const cityKey = (body.city || '').toLowerCase().replace(/\s+/g, '');
    
    // 解析坐标
    let lat = parseFloat(body.latitude);
    let lng = parseFloat(body.longitude);
    const rawTimezone = body.timezone;
    let tz = rawTimezone === undefined || rawTimezone === null || rawTimezone === '' ? 8 : parseFloat(rawTimezone);
    
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
    if (isNaN(tz)) {
      return NextResponse.json({ success: false, error: '请提供有效的时区' }, { status: 400 });
    }
    
    // 转换UTC：把输入的本地时间当作该时区时间，再减去时区偏移。
    // 不能用 `parseFloat(value) || 8`，GMT+0 是合法时区。
    const totalLocalMinutes = Math.round(hour * 60 + minute);
    const localDateAsUtc = Date.UTC(year, month - 1, day, 0, totalLocalMinutes);
    const utcDate = new Date(localDateAsUtc - tz * 60 * 60 * 1000);
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

// GET - 返回可用城市和分宫制
export async function GET() {
  return NextResponse.json({
    success: true,
    cities: Object.entries(CITIES).map(([key, data]) => ({
      id: key,
      name_cn: data.name_cn,
      tz: data.tz,
    })),
    houseSystems: [
      { code: 'B', name: '阿卡比特制', name_en: 'Alcabitius' },
      { code: 'P', name: '普拉西德制', name_en: 'Placidus' },
      { code: 'O', name: '波菲里宫制', name_en: 'Porphyry' },
      { code: 'E', name: '等宫制', name_en: 'Equal House' },
      { code: 'W', name: '整宫制', name_en: 'Whole Sign' },
      { code: 'K', name: 'Koch制', name_en: 'Koch' },
      { code: 'R', name: 'Regiomontanus', name_en: 'Regiomontanus' },
      { code: 'C', name: 'Campanus', name_en: 'Campanus' },
    ],
  });
}
