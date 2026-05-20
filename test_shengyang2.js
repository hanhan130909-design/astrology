// 测试不同情况
const Astronomy = require('astronomy-engine');

const year = 1986, month = 11, day = 14, hour = 18, minute = 30;

console.log('=== 测试1: 沈阳 (东经123.4° UTC+8) ===');
calcAsc(41.8, 123.4, 8);

console.log('\n=== 测试2: 假设经度是西经-123.4° ===');
calcAsc(41.8, -123.4, 8);

console.log('\n=== 测试3: 经度符号相反(西经121°) ===');
calcAsc(41.8, -121, 8);

console.log('\n=== 测试4: 时区-8 ===');
calcAsc(41.8, 123.4, -8);

function calcAsc(lat, lng, tz) {
  const localHour = hour + minute / 60;
  const utcHour = ((localHour - tz) % 24 + 24) % 24;
  const utcDate = new Date(Date.UTC(year, month - 1, day, Math.floor(utcHour), Math.round((utcHour % 1) * 60)));
  console.log('UTC:', utcDate.toISOString());
  
  const time = Astronomy.MakeTime(utcDate);
  const gstHours = Astronomy.SiderealTime(time);
  const GST = ((gstHours * 15) % 360 + 360) % 360;
  const LST = ((GST + lng) % 360 + 360) % 360;
  
  console.log('GST:', GST.toFixed(2) + '°');
  console.log('LST:', LST.toFixed(2) + '°');
  
  const obl = 23.4393;
  const latR = lat * Math.PI / 180;
  const lstR = LST * Math.PI / 180;
  const oblR = obl * Math.PI / 180;
  
  const num = -Math.cos(lstR);
  const den = Math.sin(oblR) * Math.tan(latR) + Math.cos(oblR) * Math.sin(lstR);
  let ascRad = Math.atan2(num, den);
  const ascLon = ((ascRad * 180 / Math.PI) % 360 + 360) % 360;
  
  const signs = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
  const sign = signs[Math.floor(ascLon / 30) % 12];
  const deg = ascLon % 30;
  const min = Math.floor((deg % 1) * 60);
  console.log('ASC:', ascLon.toFixed(2) + '° = ' + sign + ' ' + Math.floor(deg) + '°' + min + "'");
  console.log('期望: 双子座 27°43\' = 87.72°');
  console.log('差距:', (ascLon - 87.72).toFixed(2) + '°');
}