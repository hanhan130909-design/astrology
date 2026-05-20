// 测试精确的 obliquity
const Astronomy = require('astronomy-engine');

const year = 1986, month = 11, day = 14, hour = 18, minute = 30;
const lat = 41.8, lng = 123.4, tz = 8;

function normalize(a) { return ((a % 360) + 360) % 360; }
const signs = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
function formatLon(lon) {
  const sign = signs[Math.floor(lon / 30) % 12];
  const deg = lon % 30;
  const min = Math.floor((deg % 1) * 60);
  const sec = Math.floor(((deg % 1) * 60 - min) * 60);
  return `${lon.toFixed(4)}° = ${sign} ${Math.floor(deg)}°${min}'${sec}"`;
}

const utcDate = new Date(Date.UTC(year, month - 1, day, Math.floor(((hour + minute/60 - tz) % 24 + 24) % 24)), Math.round(((hour + minute/60 - tz) % 1) * 60));
const localHour = hour + minute / 60;
const utcHour = ((localHour - tz) % 24 + 24) % 24;
const utcDate2 = new Date(Date.UTC(year, month - 1, day, Math.floor(utcHour), Math.round((utcHour % 1) * 60)));
const time = Astronomy.MakeTime(utcDate2);

// 使用 astronomy-engine 的精确 obliquity
const oblObj = Astronomy.e_tilt(time);
const obliquity = oblObj.tobl;
console.log('精确 obliquity (tobl):', obliquity);
console.log('Mean obliquity (mobli):', oblObj.mobli);

const gstHours = Astronomy.SiderealTime(time);
const LST = normalize(gstHours * 15 + lng);
console.log('LST:', LST.toFixed(2) + '°');

const latR = lat * Math.PI / 180;
const lstRad = LST * Math.PI / 180;
const oblRad = obliquity * Math.PI / 180;

// 使用精确 obliquity 计算 ASC
const num = -Math.cos(lstRad);
const den = Math.sin(oblRad) * Math.tan(latR) + Math.cos(oblRad) * Math.sin(lstRad);
const ascRad = Math.atan2(num, den);
const asc = normalize(ascRad * 180 / Math.PI + 180);

console.log('ASC (精确 obliquity +180):', formatLon(asc));
console.log('sweph ASC: 87.1646° = Gemini 27°9\'');
console.log('用户期望: 87.72° = Gemini 27°43\'');
console.log('差距:', (asc - 87.72).toFixed(4) + '°');
console.log('差距(分):', ((asc - 87.72) * 60).toFixed(2) + "'");