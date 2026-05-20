// 测试修正后的 calcLST 公式
const Astronomy = require('astronomy-engine');

const year = 1986, month = 11, day = 14, hour = 18, minute = 30;
const lat = 41.8, lng = 123.4, tz = 8;

function normalize(a) { return ((a % 360) + 360) % 360; }
const signs = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
function formatLon(lon) {
  const sign = signs[Math.floor(lon / 30) % 12];
  const deg = lon % 30;
  const min = Math.floor((deg % 1) * 60);
  return `${lon.toFixed(4)}° = ${sign} ${Math.floor(deg)}°${min}'`;
}

// UTC time
const localHour = hour + minute / 60;
const utcHour = ((localHour - tz) % 24 + 24) % 24;
const utcDate = new Date(Date.UTC(year, month - 1, day, Math.floor(utcHour), Math.round((utcHour % 1) * 60)));
const time = Astronomy.MakeTime(utcDate);

// SiderealTime in astronomy-engine returns degrees (0-360)
const siderealDeg = Astronomy.SiderealTime(time);
console.log('SiderealTime (degrees):', siderealDeg.toFixed(4) + '°');

// 修正后的 calcLST：SiderealTime 直接加经度
const LST = normalize(siderealDeg + lng);
console.log('LST (SiderealTime + lng):', LST.toFixed(2) + '°');
console.log('期望 LST: 137.45°');

// 计算 ASC
const obliquity = 23.4393;
const latR = lat * Math.PI / 180;
const lstRad = LST * Math.PI / 180;
const oblRad = obliquity * Math.PI / 180;

const num = -Math.cos(lstRad);
const den = Math.sin(oblRad) * Math.tan(latR) + Math.cos(oblRad) * Math.sin(lstRad);
const asc = normalize(Math.atan2(num, den) * 180 / Math.PI + 180);

console.log('\n=== ASC with corrected LST ===');
console.log('ASC:', formatLon(asc));
console.log('sweph ASC: 87.1646° = Gemini 27°9\'');
console.log('用户期望: 87.72° = Gemini 27°43\'');
console.log('差距:', (asc - 87.72).toFixed(4) + '°');
console.log('差距(分):', ((asc - 87.72) * 60).toFixed(2) + "'");