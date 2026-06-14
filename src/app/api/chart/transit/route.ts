/**
 * Enhanced Transit API with Dual Chart Support
 * Handles: Natal, Transit, Solar Return, Lunar Return, Composite, Davison
 * 
 * POST /api/chart/transit
 */

import { NextRequest, NextResponse } from 'next/server';
import * as Astronomy from 'astronomy-engine';

const SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const SIGNS_CN = ['白羊','金牛','双子','巨蟹','狮子','处女','天秤','天蝎','射手','摩羯','水瓶','双鱼'];

const PLANET_BODIES: Record<string, Astronomy.Body> = {
  Sun: Astronomy.Body.Sun, Moon: Astronomy.Body.Moon,
  Mercury: Astronomy.Body.Mercury, Venus: Astronomy.Body.Venus, Mars: Astronomy.Body.Mars,
  Jupiter: Astronomy.Body.Jupiter, Saturn: Astronomy.Body.Saturn,
  Uranus: Astronomy.Body.Uranus, Neptune: Astronomy.Body.Neptune, Pluto: Astronomy.Body.Pluto,
};

const ASPECT_ORBS = { Conjunction: 10, Sextile: 6, Square: 8, Trine: 8, Opposition: 10 };

function normalizeAngle(a: number): number { return ((a % 360) + 360) % 360; }

function signFromLon(lon: number) {
  const idx = Math.floor(normalizeAngle(lon) / 30) % 12;
  return { sign: SIGNS[idx], sign_cn: SIGNS_CN[idx], degree: normalizeAngle(lon) % 30, signIndex: idx };
}

function timezoneOf(data: any): number {
  const raw = data?.timezone ?? data?.tz ?? 0;
  if (raw === undefined || raw === null || raw === '') return 0;
  const tz = Number(raw);
  return Number.isFinite(tz) ? tz : 0;
}

function makeUtcDateFromLocal(year: number, month: number, day: number, hour = 12, minute = 0, timezone = 0): Date {
  const totalLocalMinutes = Math.round(Number(hour || 0) * 60 + Number(minute || 0));
  const localDateAsUtc = Date.UTC(year, month - 1, day, 0, totalLocalMinutes);
  return new Date(localDateAsUtc - timezone * 60 * 60 * 1000);
}

function makeBirthUtcDate(birthData: any): Date {
  return makeUtcDateFromLocal(birthData.year, birthData.month, birthData.day, birthData.hour ?? 12, birthData.minute ?? 0, timezoneOf(birthData));
}

function calcPlanet(name: string, time: Astronomy.AstroTime, lat: number, lng: number) {
  try {
    const body = PLANET_BODIES[name];
    if (!body) return { error: 'Unknown body' };
    const observer = new Astronomy.Observer(lat, lng, 0);
    let longitude: number, latitude: number;
    if (name === 'Moon') {
      const ecl = Astronomy.EclipticGeoMoon(time);
      longitude = normalizeAngle(ecl.lon); latitude = ecl.lat;
    } else {
      const vec = Astronomy.GeoVector(body, time, true);
      const ecl = Astronomy.Ecliptic(vec);
      longitude = normalizeAngle(ecl.elon); latitude = ecl.elat;
    }
    const sd = signFromLon(longitude);
    return { longitude, latitude, ...sd };
  } catch (e: unknown) { return { error: e instanceof Error ? e.message : String(e) }; }
}

function calcAllPlanets(time: Astronomy.AstroTime, lat: number, lng: number) {
  const result: Record<string, unknown> = {};
  for (const name of Object.keys(PLANET_BODIES)) result[name] = calcPlanet(name, time, lat, lng);
  try {
    const t = time.tt / 36525;
    const north = normalizeAngle(125.04452 - 1934.136261 * t + 0.0020708 * t * t + (t * t * t) / 450000);
    result['North_Node'] = { longitude: north, latitude: 0, ...signFromLon(north) };
  } catch {}
  return result;
}

function calcLST(time: Astronomy.AstroTime, lng: number): number {
  const jd = time.tt;
  const t = (jd - 2451545.0) / 36525;
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + t * t * (0.000387933 - t / 38710000.0);
  return normalizeAngle(normalizeAngle(gmst) + lng);
}

function calcAscendant(lat: number, lst: number): number {
  const latRad = lat * Math.PI / 180;
  const lstRad = lst * Math.PI / 180;
  return normalizeAngle(Math.atan2(Math.cos(lstRad), -(Math.tan(latRad) * Math.sin(lstRad) + Math.cos(lstRad) * 0.0)) * 180 / Math.PI + 90);
}

function calcMC(lst: number): number { return normalizeAngle(lst); }

function calcHouses(time: Astronomy.AstroTime, lat: number, lng: number, system = 'P') {
  const lst = calcLST(time, lng);
  const ascLon = calcAscendant(lat, lst);
  const mcLon = calcMC(lst);
  const houses = [];
  for (let i = 0; i < 12; i++) {
    let cuspLon: number;
    if (system === 'W') cuspLon = normalizeAngle(ascLon + i * 30);
    else if (system === 'E') cuspLon = normalizeAngle(ascLon + i * 30);
    else if (system === 'K') {
      const ra = Math.atan2(Math.sin(ascLon * Math.PI / 180) * Math.cos(lat * Math.PI / 180), Math.cos(ascLon * Math.PI / 180)) * 180 / Math.PI;
      cuspLon = normalizeAngle(ra + i * 30);
    }
    else cuspLon = normalizeAngle(ascLon + i * 30);
    const sd = signFromLon(cuspLon);
    houses.push({ house: i + 1, house_cn: `${i + 1}宫`, longitude: cuspLon, ...sd });
  }
  return { houses, ascendant: ascLon, midheaven: mcLon };
}

function calcAspects(planets: Record<string, any>) {
  const aspects: any[] = [];
  const keys = Object.keys(planets).filter(k => !planets[k]?.error);
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const p1 = planets[keys[i]], p2 = planets[keys[j]];
      let diff = Math.abs(p1.longitude - p2.longitude);
      if (diff > 180) diff = 360 - diff;
      for (const [type, orb] of Object.entries(ASPECT_ORBS)) {
        const angle = type === 'Conjunction' ? 0 : type === 'Sextile' ? 60 : type === 'Square' ? 90 : type === 'Trine' ? 120 : 180;
        if (Math.abs(diff - angle) <= orb) {
          aspects.push({ planet1: keys[i], planet2: keys[j], type, angle, orb: Math.abs(diff - angle), exactness: 1 - Math.abs(diff - angle) / orb });
        }
      }
    }
  }
  return aspects.sort((a, b) => b.exactness - a.exactness);
}

// Calculate Solar Return date
function findSolarReturn(birthData: any, year: number) {
  const birthSun = calcPlanet('Sun', Astronomy.MakeTime(makeBirthUtcDate(birthData)), birthData.lat, birthData.lng);
  const targetSunLon = (birthSun as any).longitude;
  
  // Search for when Sun returns to birth position in target year
  let bestDate: Date | null = null;
  let minDiff = Infinity;
  
  for (let month = 0; month < 12; month++) {
    for (let day = 1; day <= 31; day++) {
      try {
        const date = new Date(year, month, day, 12, 0);
        if (date.getMonth() !== month) continue;
        const sun = calcPlanet('Sun', Astronomy.MakeTime(date), birthData.lat, birthData.lng);
        const diff = Math.abs(normalizeAngle((sun as any).longitude - targetSunLon));
        const actualDiff = diff > 180 ? 360 - diff : diff;
        if (actualDiff < minDiff) {
          minDiff = actualDiff;
          bestDate = date;
        }
      } catch {}
    }
  }
  
  // Refine with hourly search
  if (bestDate) {
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        const refineDate: Date = new Date(bestDate.getFullYear(), bestDate.getMonth(), bestDate.getDate(), hour, minute);
        const sun = calcPlanet('Sun', Astronomy.MakeTime(refineDate), birthData.lat, birthData.lng);
        const diff = Math.abs(normalizeAngle((sun as any).longitude - targetSunLon));
        const actualDiff = diff > 180 ? 360 - diff : diff;
        if (actualDiff < minDiff) {
          minDiff = actualDiff;
          bestDate = refineDate;
        }
      }
    }
  }
  
  return bestDate;
}

// Calculate Lunar Return
function findLunarReturn(birthData: any, year: number, month: number) {
  const birthMoon = calcPlanet('Moon', Astronomy.MakeTime(makeBirthUtcDate(birthData)), birthData.lat, birthData.lng);
  const targetMoonLon = (birthMoon as any).longitude;
  
  let bestDate: Date | null = null;
  let minDiff = Infinity;
  
  for (let day = 1; day <= 31; day++) {
    try {
      const date = new Date(year, month - 1, day, 12, 0);
      if (date.getMonth() !== month - 1) continue;
      const moon = calcPlanet('Moon', Astronomy.MakeTime(date), birthData.lat, birthData.lng);
      const diff = Math.abs(normalizeAngle((moon as any).longitude - targetMoonLon));
      const actualDiff = diff > 180 ? 360 - diff : diff;
      if (actualDiff < minDiff) {
        minDiff = actualDiff;
        bestDate = date;
      }
    } catch {}
  }
  
  return bestDate;
}

// Calculate Secondary Progression (1 day = 1 year)
function calcProgression(birthData: any, targetYear: number) {
  const birthDate = makeBirthUtcDate(birthData);
  const yearsDiff = targetYear - birthData.year;
  const progressionDate = new Date(birthDate.getTime() + yearsDiff * 24 * 60 * 60 * 1000);
  return progressionDate;
}

// Calculate Firdaria periods
const FIRDARIA_YEARS: Record<string, number> = { Sun: 10, Venus: 8, Mercury: 13, Moon: 9, Saturn: 11, Jupiter: 12, Mars: 7, North_Node: 3, South_Node: 2 };
const FIRDARIA_DAY_ORDER = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'North_Node', 'South_Node'];
const FIRDARIA_NIGHT_ORDER = ['Moon', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'North_Node', 'South_Node'];

function houseForLongitude(lon: number, houses: any[]): number {
  for (let i = 0; i < houses.length; i++) {
    const current = normalizeAngle(houses[i].longitude);
    const next = normalizeAngle(houses[(i + 1) % houses.length].longitude);
    if (current <= next ? lon >= current && lon < next : lon >= current || lon < next) return Number(houses[i].house);
  }
  return 0;
}

function calcFirdaria(birthData: any, natalPlanets: Record<string, any>, natalHouses: any[]) {
  const sunLon = natalPlanets?.Sun?.longitude;
  const sunHouse = typeof sunLon === 'number' ? houseForLongitude(normalizeAngle(sunLon), natalHouses) : 0;
  const isDay = sunHouse >= 7 && sunHouse <= 12;
  const order = isDay ? FIRDARIA_DAY_ORDER : FIRDARIA_NIGHT_ORDER;
  const periods = [];
  let currentYear = birthData.year;

  for (const planet of order) {
    const years = FIRDARIA_YEARS[planet];
    periods.push({
      planet,
      startYear: currentYear,
      endYear: currentYear + years,
      years,
      isDay
    });
    currentYear += years;
  }

  return periods;
}

// Composite chart: midpoints of two charts
function calcComposite(planets1: Record<string, any>, planets2: Record<string, any>) {
  const composite: Record<string, any> = {};
  for (const key of Object.keys(planets1)) {
    if (planets1[key]?.error || planets2[key]?.error) continue;
    let lon1 = planets1[key].longitude;
    let lon2 = planets2[key].longitude;
    // Handle 0/360 wraparound
    if (Math.abs(lon1 - lon2) > 180) {
      if (lon1 < lon2) lon1 += 360; else lon2 += 360;
    }
    const midLon = normalizeAngle((lon1 + lon2) / 2);
    composite[key] = { longitude: midLon, ...signFromLon(midLon) };
  }
  return composite;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, birthData, birthData2, transitDate, houseSystem = 'P' } = body;
    
    if (!birthData) return NextResponse.json({ error: 'Missing birthData' }, { status: 400 });
    
    const birthTime = Astronomy.MakeTime(makeBirthUtcDate(birthData));
    const natalPlanets = calcAllPlanets(birthTime, birthData.lat, birthData.lng);
    const natalHouses = calcHouses(birthTime, birthData.lat, birthData.lng, houseSystem);
    
    let result: any = {
      type,
      natal: {
        planets: natalPlanets,
        houses: natalHouses.houses,
        ascendant: natalHouses.ascendant,
        midheaven: natalHouses.midheaven,
        aspects: calcAspects(natalPlanets)
      }
    };
    
    // Transit calculation
    if (type === 'transit' && transitDate) {
      const transitTime = Astronomy.MakeTime(makeUtcDateFromLocal(transitDate.year, transitDate.month, transitDate.day, transitDate.hour != null ? transitDate.hour : 12, transitDate.minute || 0, timezoneOf(transitDate)));
      const transitPlanets = calcAllPlanets(transitTime, birthData.lat, birthData.lng);
      
      // Calculate transit aspects to natal
      const transitAspects: any[] = [];
      for (const [tPlanet, tData] of Object.entries(transitPlanets)) {
        if ((tData as any).error) continue;
        for (const [nPlanet, nData] of Object.entries(natalPlanets)) {
          if ((nData as any).error) continue;
          let diff = Math.abs((tData as any).longitude - (nData as any).longitude);
          if (diff > 180) diff = 360 - diff;
          for (const [aspectType, orb] of Object.entries(ASPECT_ORBS)) {
            const angle = aspectType === 'Conjunction' ? 0 : aspectType === 'Sextile' ? 60 : aspectType === 'Square' ? 90 : aspectType === 'Trine' ? 120 : 180;
            if (Math.abs(diff - angle) <= orb) {
              transitAspects.push({
                transitPlanet: tPlanet,
                natalPlanet: nPlanet,
                type: aspectType,
                angle,
                orb: Math.abs(diff - angle),
                applying: (tData as any).longitude > (nData as any).longitude
              });
            }
          }
        }
      }
      
      result.transit = {
        planets: transitPlanets,
        date: transitDate,
        aspects: transitAspects.sort((a, b) => a.orb - b.orb)
      };
    }
    
    // Solar Return
    if (type === 'solar_return') {
      const srYear = transitDate?.year || new Date().getFullYear();
      const srDate = findSolarReturn(birthData, srYear);
      if (srDate) {
        const srTime = Astronomy.MakeTime(srDate);
        const srPlanets = calcAllPlanets(srTime, birthData.lat, birthData.lng);
        const srHouses = calcHouses(srTime, birthData.lat, birthData.lng, houseSystem);
        result.solarReturn = {
          date: { year: srDate.getFullYear(), month: srDate.getMonth() + 1, day: srDate.getDate(), hour: srDate.getHours(), minute: srDate.getMinutes() },
          planets: srPlanets,
          houses: srHouses.houses,
          ascendant: srHouses.ascendant,
          midheaven: srHouses.midheaven,
          aspects: calcAspects(srPlanets)
        };
      }
    }
    
    // Lunar Return
    if (type === 'lunar_return') {
      const lrYear = transitDate?.year || new Date().getFullYear();
      const lrMonth = transitDate?.month || new Date().getMonth() + 1;
      const lrDate = findLunarReturn(birthData, lrYear, lrMonth);
      if (lrDate) {
        const lrTime = Astronomy.MakeTime(lrDate);
        const lrPlanets = calcAllPlanets(lrTime, birthData.lat, birthData.lng);
        const lrHouses = calcHouses(lrTime, birthData.lat, birthData.lng, houseSystem);
        result.lunarReturn = {
          date: { year: lrDate.getFullYear(), month: lrDate.getMonth() + 1, day: lrDate.getDate(), hour: lrDate.getHours(), minute: lrDate.getMinutes() },
          planets: lrPlanets,
          houses: lrHouses.houses,
          ascendant: lrHouses.ascendant,
          midheaven: lrHouses.midheaven,
          aspects: calcAspects(lrPlanets)
        };
      }
    }
    
    // Secondary Progression
    if (type === 'progression') {
      const progYear = transitDate?.year || new Date().getFullYear();
      const progDate = calcProgression(birthData, progYear);
      const progTime = Astronomy.MakeTime(progDate);
      const progPlanets = calcAllPlanets(progTime, birthData.lat, birthData.lng);
      const progHouses = calcHouses(progTime, birthData.lat, birthData.lng, houseSystem);
      
      // Calculate Firdaria
      const firdaria = calcFirdaria(birthData, natalPlanets, natalHouses.houses);
      const currentPeriod = firdaria.find(p => progYear >= p.startYear && progYear < p.endYear);
      
      result.progression = {
        date: { year: progDate.getFullYear(), month: progDate.getMonth() + 1, day: progDate.getDate() },
        equivalentAge: progYear - birthData.year,
        planets: progPlanets,
        houses: progHouses.houses,
        ascendant: progHouses.ascendant,
        midheaven: progHouses.midheaven,
        aspects: calcAspects(progPlanets),
        firdaria: { periods: firdaria, currentPeriod }
      };
    }
    
    // Composite Chart
    if (type === 'composite' && birthData2) {
      const time2 = Astronomy.MakeTime(makeBirthUtcDate(birthData2));
      const planets2 = calcAllPlanets(time2, birthData2.lat, birthData2.lng);
      const compositePlanets = calcComposite(natalPlanets, planets2);
      
      // Use midpoint of locations for composite
      const midLat = (birthData.lat + birthData2.lat) / 2;
      const midLng = normalizeAngle((birthData.lng + birthData2.lng) / 2);
      const midTime = new Date((birthTime.date.getTime() + time2.date.getTime()) / 2);
      
      const compositeHouses = calcHouses(Astronomy.MakeTime(midTime), midLat, midLng, houseSystem);
      
      result.composite = {
        person1: { planets: natalPlanets, birthData },
        person2: { planets: planets2, birthData: birthData2 },
        planets: compositePlanets,
        houses: compositeHouses.houses,
        ascendant: compositeHouses.ascendant,
        midheaven: compositeHouses.midheaven,
        aspects: calcAspects(compositePlanets)
      };
    }
    
    // Return in same format as /api/chart for frontend compatibility
    const chartData = result.transit ? {
      planets: result.transit.planets,
      houses: result.natal.houses,
      ascendant: result.natal.ascendant,
      midheaven: result.natal.midheaven,
      aspects: [...(result.natal.aspects || []), ...(result.transit.aspects || [])],
      _transitAspects: result.transit.aspects,
      _natalPlanets: result.natal.planets,
    } : result.solarReturn ? {
      planets: result.solarReturn.planets,
      houses: result.solarReturn.houses,
      ascendant: result.solarReturn.ascendant,
      midheaven: result.solarReturn.midheaven,
      aspects: result.solarReturn.aspects,
    } : result.lunarReturn ? {
      planets: result.lunarReturn.planets,
      houses: result.lunarReturn.houses,
      ascendant: result.lunarReturn.ascendant,
      midheaven: result.lunarReturn.midheaven,
      aspects: result.lunarReturn.aspects,
    } : result.progression ? {
      planets: result.progression.planets,
      houses: result.progression.houses,
      ascendant: result.progression.ascendant,
      midheaven: result.progression.midheaven,
      aspects: result.progression.aspects,
    } : result.composite ? {
      planets: result.composite.planets,
      houses: result.composite.houses,
      ascendant: result.composite.ascendant,
      midheaven: result.composite.midheaven,
      aspects: result.composite.aspects,
    } : {
      planets: result.natal.planets,
      houses: result.natal.houses,
      ascendant: result.natal.ascendant,
      midheaven: result.natal.midheaven,
      aspects: result.natal.aspects,
    };

    return NextResponse.json({ success: true, data: chartData, ...result });
  } catch (error) {
    console.error('Chart calculation error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Calculation error' }, { status: 500 });
  }
}
