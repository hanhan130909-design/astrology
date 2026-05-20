// 测试正确的 ASC 公式
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

// LST
const gstHours = Astronomy.SiderealTime(time);
const LST = normalize(gstHours * 15 + lng);
console.log('\nLST:', LST.toFixed(2) + '°');

const obl = 23.4393;
const latR = lat * Math.PI / 180;
const lstR = LST * Math.PI / 180;
const oblR = obl * Math.PI / 180;

// 公式1: tan(ASC) = -cos(LST) / (sin(ε)*tan(φ) + cos(ε)*sin(LST))  [当前使用]
const num1 = -Math.cos(lstR);
const den1 = Math.sin(oblR) * Math.tan(latR) + Math.cos(oblR) * Math.sin(lstR);
const asc1 = normalize(Math.atan2(num1, den1) * 180 / Math.PI);
console.log('\n=== 公式1: -cos(LST) / (sin*tan + cos*sin) ===');
console.log('ASC:', formatLon(asc1));

// 公式2: ASC = atan2(sin(LST), cos(LST)*cos(ε) - sin(ε)*tan(φ))  [来自其他来源]
const num2 = Math.sin(lstR);
const den2 = Math.cos(lstR) * Math.cos(oblR) - Math.sin(oblR) * Math.tan(latR);
const asc2 = normalize(Math.atan2(num2, den2) * 180 / Math.PI);
console.log('\n=== 公式2: atan2(sin(LST), cos*cos - sin*tan) ===');
console.log('ASC:', formatLon(asc2));

// 公式3: ASC = atan2(-cos(LST), sin(LST)*cos(ε) + tan(φ)*sin(ε))
const num3 = -Math.cos(lstR);
const den3 = Math.sin(lstR) * Math.cos(oblR) + Math.tan(latR) * Math.sin(oblR);
const asc3 = normalize(Math.atan2(num3, den3) * 180 / Math.PI);
console.log('\n=== 公式3: atan2(-cos, sin*cos + tan*sin) ===');
console.log('ASC:', formatLon(asc3));

// 公式4: ASC = atan2(sin(LST), -cos(LST)*cos(ε) + sin(ε)*tan(φ))
const num4 = Math.sin(lstR);
const den4 = -Math.cos(lstR) * Math.cos(oblR) + Math.sin(oblR) * Math.tan(latR);
const asc4 = normalize(Math.atan2(num4, den4) * 180 / Math.PI);
console.log('\n=== 公式4: atan2(sin, -cos*cos + sin*tan) ===');
console.log('ASC:', formatLon(asc4));

console.log('\n=== 差距 ===');
console.log('公式1 vs sweph:', (asc1 - swephAsc).toFixed(2) + '°');
console.log('公式2 vs sweph:', (asc2 - swephAsc).toFixed(2) + '°');
console.log('公式3 vs sweph:', (asc3 - swephAsc).toFixed(2) + '°');
console.log('公式4 vs sweph:', (asc4 - swephAsc).toFixed(2) + '°');