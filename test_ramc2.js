// 使用 sweph 的点来计算正确的 ASC
const Astronomy = require('astronomy-engine');
const sweph = require('sweph');

const year = 1986, month = 11, day = 14, hour = 18, minute = 30;
const lat = 41.8, lng = 123.4, tz = 8;

function normalize(a) {
  return ((a % 360) + 360) % 360;
}

const signs = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

function formatLon(lon) {
  const sign = signs[Math.floor(lon / 30) % 12];
  const deg = lon % 30;
  return lon.toFixed(4) + '° = ' + sign + ' ' + Math.floor(deg) + '°' + Math.floor((deg % 1) * 60) + "'";
}

// UTC time
const localHour = hour + minute / 60;
const utcHour = ((localHour - tz) % 24 + 24) % 24;
const utcDate = new Date(Date.UTC(year, month - 1, day, Math.floor(utcHour), Math.round((utcHour % 1) * 60)));
const jd = utcDate.getTime() / 86400000 + 2440587.5;
const time = Astronomy.MakeTime(utcDate);

// Sweph 结果
const houses = sweph.houses(jd, lat, lng, 'P');
const swephAsc = houses.data.points[0];
const swephMc = houses.data.points[1];
console.log('sweph ASC:', formatLon(swephAsc));
console.log('sweph MC:', formatLon(swephMc));

// 使用 sweph 的 MC 计算 RAMC
// RAMC = atan2(sin(MC), cos(MC) * cos(ε))
const obl = 23.4393;
const oblR = obl * Math.PI / 180;
const mcR = swephMc * Math.PI / 180;
let ramcR = Math.atan2(Math.sin(mcR), Math.cos(mcR) * Math.cos(oblR));
const ramc = normalize(ramcR * 180 / Math.PI);
console.log('\n=== 计算 RAMC ===');
console.log('MC:', swephMc.toFixed(2) + '°');
console.log('RAMC:', ramc.toFixed(2) + '°');

// 使用 RAMC 计算 ASC
// tan(ASC) = -cos(RAMC) / (sin(ε)*tan(φ) + cos(ε)*sin(RAMC))
const latR = lat * Math.PI / 180;
const num = -Math.cos(ramcR);
const den = Math.sin(oblR) * Math.tan(latR) + Math.cos(oblR) * Math.sin(ramcR);
let ascR = Math.atan2(num, den);
const ascCalc = normalize(ascR * 180 / Math.PI);
console.log('\n=== ASC from RAMC ===');
console.log('ASC:', formatLon(ascCalc));
console.log('sweph ASC:', formatLon(swephAsc));
console.log('差距:', (ascCalc - swephAsc).toFixed(4) + '°');

// 验证：MC 和 ASC 的关系
console.log('\n=== MC 和 ASC 的关系 ===');
console.log('MC - ASC (sweph):', normalize(swephMc - swephAsc).toFixed(2) + '°');
console.log('ASC + 90°:', normalize(swephAsc + 90).toFixed(2) + '°');
console.log('MC (sweph):', swephMc.toFixed(2) + '°');