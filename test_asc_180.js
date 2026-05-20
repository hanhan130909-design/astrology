// 测试：ASC + 180° 是否等于 Descendant？
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
const cusp1 = houses.data.houses[0];
console.log('sweph ASC:', formatLon(swephAsc));
console.log('sweph MC:', formatLon(swephMc));
console.log('House 1 cusp:', formatLon(cusp1));

// LST
const gstHours = Astronomy.SiderealTime(time);
const LST = normalize(gstHours * 15 + lng);
console.log('\nLST:', LST.toFixed(2) + '°');

const obl = 23.4393;
const latR = lat * Math.PI / 180;
const lstR = LST * Math.PI / 180;
const oblR = obl * Math.PI / 180;

// 公式: -cos(LST) / (sin(ε)*tan(φ) + cos(ε)*sin(LST))
const num = -Math.cos(lstR);
const den = Math.sin(oblR) * Math.tan(latR) + Math.cos(oblR) * Math.sin(lstR);
const ascRad = Math.atan2(num, den);
const ascCalc = normalize(ascRad * 180 / Math.PI);
console.log('\n=== 直接计算 ===');
console.log('ASC:', formatLon(ascCalc));

// 测试：ASC + 180°
const ascPlus180 = normalize(ascCalc + 180);
console.log('ASC + 180°:', formatLon(ascPlus180));

// 测试：ASC + 180° - sweph
console.log('\n=== 差距 ===');
console.log('直接 ASC vs sweph:', (ascCalc - swephAsc).toFixed(2) + '°');
console.log('ASC+180 vs sweph:', (ascPlus180 - swephAsc).toFixed(2) + '°');

// 验证 House 1 cusp 是否等于 ASC
console.log('\n=== House 1 cusp vs ASC ===');
console.log('House 1 cusp:', formatLon(cusp1));
console.log('ASC:', formatLon(swephAsc));
console.log('差距:', (cusp1 - swephAsc).toFixed(4) + '°');

// 尝试：House 1 cusp 应该是 ASC，但可能需要反转
const ascFromCusp = normalize(cusp1 + 180);
console.log('House 1 cusp + 180°:', formatLon(ascFromCusp));
console.log('差距:', (ascFromCusp - swephAsc).toFixed(2) + '°');

// 用 House 1 cusp 计算 ASC（反转）
const num2 = Math.cos(lstR);
const den2 = -Math.sin(oblR) * Math.tan(latR) - Math.cos(oblR) * Math.sin(lstR);
const ascFromCuspCalc = normalize(Math.atan2(num2, den2) * 180 / Math.PI);
console.log('\n=== 用反转公式 ===');
console.log('ASC (反转公式):', formatLon(ascFromCuspCalc));
console.log('差距:', (ascFromCuspCalc - swephAsc).toFixed(2) + '°');