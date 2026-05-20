const Astronomy = require('astronomy-engine');

// 测试用例：1990-06-15 12:00 Beijing time (UTC+8)
const year = 1990, month = 6, day = 15, hour = 12, minute = 0;
const tz = 8;
const lat = 39.9042, lng = 116.4074;  // Beijing

// 转换为UTC
const localHour = hour + minute / 60;
const utcHour = ((localHour - tz) % 24 + 24) % 24;
const utcDate = new Date(Date.UTC(year, month - 1, day, Math.floor(utcHour), Math.round((utcHour % 1) * 60)));
const time = Astronomy.MakeTime(utcDate);

console.log('UTC time:', utcDate.toISOString());

// 计算LST
const gstHours = Astronomy.SiderealTime(time);
const GST = (gstHours * 15) % 360;
const LST = (GST + lng) % 360;
console.log('LST (degrees):', LST);

// 计算ASC (使用route.ts中的公式)
const obliquity = 23.4393;
const latRad = lat * Math.PI / 180;
const lstRad = LST * Math.PI / 180;
const oblRad = obliquity * Math.PI / 180;

const num = -Math.cos(lstRad);
const den = Math.sin(oblRad) * Math.tan(latRad) + Math.cos(oblRad) * Math.sin(lstRad);
let ascRad = Math.atan2(num, den);
let asc = (ascRad * 180 / Math.PI + 360) % 360;

console.log('ASC (route.ts formula):', asc, '=', ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'][Math.floor(asc/30)], (asc % 30).toFixed(2) + '°');

// 使用sweph计算ASC进行对比
try {
  const sweph = require('sweph');
  const jd = time.date.getTime() / 86400000 + 2440587.5;
  const houses = sweph.houses(jd, lat, lng, 'P');
  console.log('ASC (sweph Placidus):', houses.ascendant, '=', ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'][Math.floor(houses.ascendant/30)], (houses.ascendant % 30).toFixed(2) + '°');
  
  // 测试阿卡比特分宫制
  const housesA = sweph.houses(jd, lat, lng, 'A');
  console.log('ASC (sweph Alcabitius):', housesA.ascendant, '=', ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'][Math.floor(housesA.ascendant/30)], (housesA.ascendant % 30).toFixed(2) + '°');
} catch(e) {
  console.log('sweph error:', e.message);
}
