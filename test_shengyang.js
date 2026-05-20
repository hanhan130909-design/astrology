const Astronomy = require('astronomy-engine');

const year = 1986, month = 11, day = 14, hour = 18, minute = 30;
const lat = 41.8, lng = 123.4, tz = 8;

// 转换为UTC
const localHour = hour + minute / 60;
const utcHour = ((localHour - tz) % 24 + 24) % 24;
const utcDate = new Date(Date.UTC(year, month - 1, day, Math.floor(utcHour), Math.round((utcHour % 1) * 60)));
console.log('UTC时间:', utcDate.toISOString());

const time = Astronomy.MakeTime(utcDate);

// 计算LST
const gstHours = Astronomy.SiderealTime(time);
const GST = ((gstHours * 15) % 360 + 360) % 360;
const LST = ((GST + lng) % 360 + 360) % 360;
console.log('GST (度):', GST);
console.log('LST (度):', LST);

// 计算ASC
const obliquity = 23.4393;
const latRad = lat * Math.PI / 180;
const lstRad = LST * Math.PI / 180;
const oblRad = obliquity * Math.PI / 180;

const num = -Math.cos(lstRad);
const den = Math.sin(oblRad) * Math.tan(latRad) + Math.cos(oblRad) * Math.sin(lstRad);
let ascRad = Math.atan2(num, den);
const ascLon = ((ascRad * 180 / Math.PI) % 360 + 360) % 360;

console.log('ASC (度):', ascLon);
const signs = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
console.log('ASC 星座:', signs[Math.floor(ascLon / 30) % 12]);
const deg = ascLon % 30;
console.log('ASC 度数:', Math.floor(deg) + '°' + Math.floor((deg % 1) * 60) + "'");
console.log('用户期望: 双子座 27°43\' = 87.72°');
console.log('差距:', (ascLon - 87.72).toFixed(2) + '°');