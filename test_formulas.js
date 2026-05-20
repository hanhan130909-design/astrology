// 测试修正后的 route.ts 公式
const Astronomy = require('astronomy-engine');

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

// 转换为 UTC
const localHour = hour + minute / 60;
const utcHour = ((localHour - tz) % 24 + 24) % 24;
const utcDate = new Date(Date.UTC(year, month - 1, day, Math.floor(utcHour), Math.round((utcHour % 1) * 60)));
console.log('UTC:', utcDate.toISOString());

const time = Astronomy.MakeTime(utcDate);

// 计算 LST（测试不同的公式）
const gstHours = Astronomy.SiderealTime(time);
console.log('SiderealTime (hours):', gstHours);
console.log('SiderealTime * 15 (degrees):', gstHours * 15);

// 测试1：GST * 15 + lng
const LST1 = normalize(gstHours * 15 + lng);
console.log('\n=== LST formula 1: GST*15 + lng ===');
console.log('LST1:', LST1.toFixed(2) + '°');

// 测试2：GST * 15 - lng
const LST2 = normalize(gstHours * 15 - lng);
console.log('\n=== LST formula 2: GST*15 - lng ===');
console.log('LST2:', LST2.toFixed(2) + '°');

// 计算 ASC（测试不同公式）
function calcAsc(lat, LST) {
  const obl = 23.4393;
  const latR = lat * Math.PI / 180;
  const lstR = LST * Math.PI / 180;
  const oblR = obl * Math.PI / 180;
  
  // 公式A：-cos(LST) / (sin(ε)*tan(φ) + cos(ε)*sin(LST))
  const numA = -Math.cos(lstR);
  const denA = Math.sin(oblR) * Math.tan(latR) + Math.cos(oblR) * Math.sin(lstR);
  const ascA = normalize(Math.atan2(numA, denA) * 180 / Math.PI);
  
  // 公式B：-sin(LST) / (sin(ε)*tan(φ) + cos(ε)*cos(LST))
  const numB = -Math.sin(lstR);
  const denB = Math.sin(oblR) * Math.tan(latR) + Math.cos(oblR) * Math.cos(lstR);
  const ascB = normalize(Math.atan2(numB, denB) * 180 / Math.PI);
  
  return { ascA, ascB };
}

console.log('\n=== ASC with LST1 (GST*15 + lng) ===');
const result1 = calcAsc(lat, LST1);
console.log('ASC (formula A, -cos/sin):', formatLon(result1.ascA));
console.log('ASC (formula B, -sin/cos):', formatLon(result1.ascB));

console.log('\n=== ASC with LST2 (GST*15 - lng) ===');
const result2 = calcAsc(lat, LST2);
console.log('ASC (formula A, -cos/sin):', formatLon(result2.ascA));
console.log('ASC (formula B, -sin/cos):', formatLon(result2.ascB));

// 期望值
console.log('\n=== 期望 ASC ===');
console.log('sweph: 87.1646° = Gemini 27°9\'');
console.log('用户期望: 87.72° = Gemini 27°43\'');