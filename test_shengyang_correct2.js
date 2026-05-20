// 修正：使用正确的 UTC 时间
const Astronomy = require('astronomy-engine');
const sweph = require('sweph');

const year = 1986, month = 11, day = 14, hour = 18, minute = 30;
const lat = 41.8, lng = 123.4, tz = 8;  // 沈阳 UTC+8

const signs = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

function formatLon(lon) {
  const sign = signs[Math.floor(lon / 30) % 12];
  const deg = lon % 30;
  return lon.toFixed(4) + '° = ' + sign + ' ' + Math.floor(deg) + '°' + Math.floor((deg % 1) * 60) + "'";
}

console.log('=== 出生信息 ===');
console.log('出生地: 沈阳 (UTC+8)');
console.log('出生时间: 1986-11-14 18:30 (本地时间)');

// 正确转换为 UTC
const localHour = hour + minute / 60;
const utcHour = ((localHour - tz) % 24 + 24) % 24;
const utcDate = new Date(Date.UTC(year, month - 1, day, Math.floor(utcHour), Math.round((utcHour % 1) * 60)));
console.log('UTC时间:', utcDate.toISOString());

// 计算儒略日
const jd = utcDate.getTime() / 86400000 + 2440587.5;
console.log('JD:', jd);

// 使用 sweph 计算
const houses = sweph.houses(jd, lat, lng, 'P');
if (houses && houses.data && houses.data.points) {
  const ascLon = houses.data.points[0];
  console.log('\n=== Swiss Ephemeris (sweph) 结果 ===');
  console.log('ASC:', formatLon(ascLon));
  console.log('期望 ASC: 双子座 27°43\' = 87.72°');
  console.log('sweph vs 期望差距:', (ascLon - 87.72).toFixed(4) + '°');
}

// 使用 route.ts 的公式计算
const time = Astronomy.MakeTime(utcDate);
const gstHours = Astronomy.SiderealTime(time);
const GST = ((gstHours * 15) % 360 + 360) % 360;
const LST = ((GST + lng) % 360 + 360) % 360;

const obliquity = 23.4393;
const latRad = lat * Math.PI / 180;
const lstRad = LST * Math.PI / 180;
const oblRad = obliquity * Math.PI / 180;

const num = -Math.cos(lstRad);
const den = Math.sin(oblRad) * Math.tan(latRad) + Math.cos(oblRad) * Math.sin(lstRad);
let ascRad = Math.atan2(num, den);
const ascLon2 = ((ascRad * 180 / Math.PI) % 360 + 360) % 360;

console.log('\n=== route.ts 公式结果 ===');
console.log('LST:', LST.toFixed(2) + '°');
console.log('ASC:', formatLon(ascLon2));
console.log('route.ts vs 期望差距:', (ascLon2 - 87.72).toFixed(4) + '°');

// 比对 sweph 和 route.ts 公式
console.log('\n=== 对比 ===');
const swephAsc = houses && houses.data && houses.data.points ? houses.data.points[0] : null;
if (swephAsc) {
  console.log('sweph vs route.ts 差距:', (swephAsc - ascLon2).toFixed(4) + '°');
  console.log('sweph vs 期望 差距:', (swephAsc - 87.72).toFixed(4) + '°');
  console.log('route.ts vs 期望 差距:', (ascLon2 - 87.72).toFixed(4) + '°');
}