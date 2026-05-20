// 测试正确的 LST 计算
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
console.log('SiderealTime (hours):', (siderealDeg / 15).toFixed(4) + 'h');

// LST = GST + longitude
const LST_wrong = normalize(siderealDeg * 15 + lng);  // 错误的：乘了15
const LST_correct = normalize(siderealDeg + lng);      // 正确的：直接加
console.log('\nLST (×15+ lng, wrong):', LST_wrong.toFixed(2) + '°');
console.log('LST (+ lng, correct):', LST_correct.toFixed(2) + '°');

// 测试不同的 ASC 公式
const obliquity = 23.4393;
const latR = lat * Math.PI / 180;
const oblRad = obliquity * Math.PI / 180;

console.log('\n=== ASC with LST (×15+ lng) ===');
const lstR1 = LST_wrong * Math.PI / 180;
const num1 = -Math.cos(lstR1);
const den1 = Math.sin(oblRad) * Math.tan(latR) + Math.cos(oblRad) * Math.sin(lstR1);
const asc1 = normalize(Math.atan2(num1, den1) * 180 / Math.PI + 180);
console.log('ASC:', formatLon(asc1));

console.log('\n=== ASC with LST (+ lng) ===');
const lstR2 = LST_correct * Math.PI / 180;
const num2 = -Math.cos(lstR2);
const den2 = Math.sin(oblRad) * Math.tan(latR) + Math.cos(oblRad) * Math.sin(lstR2);
const asc2 = normalize(Math.atan2(num2, den2) * 180 / Math.PI + 180);
console.log('ASC:', formatLon(asc2));

console.log('\n期望 ASC: 87.72° = Gemini 27°43\'');
console.log('sweph ASC: 87.1646° = Gemini 27°9\'');