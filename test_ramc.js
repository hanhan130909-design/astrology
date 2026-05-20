// 测试 LST 和 MC 的关系
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

console.log('=== Sweph 结果 ===');
const houses = sweph.houses(jd, lat, lng, 'P');
const swephAsc = houses.data.points[0];
const swephMc = houses.data.points[1];
console.log('sweph ASC:', formatLon(swephAsc));
console.log('sweph MC:', formatLon(swephMc));

console.log('\n=== 测试 LST 和 MC 的关系 ===');

// 当前 route.ts 的 LST 计算
const gstHours = Astronomy.SiderealTime(time);
const GST = normalize(gstHours * 15);
const LST_current = normalize(GST + lng);
console.log('GST:', GST.toFixed(2) + '°');
console.log('LST (GST + lng):', LST_current.toFixed(2) + '°');
console.log('sweph MC:', swephMc.toFixed(2) + '°');

// 测试：LST - MC = ? (应该是常数?)
const diff = normalize(LST_current - swephMc);
console.log('LST - MC =', diff.toFixed(2) + '°');

// 尝试：RAMC = LST - MC
const RAMC_test = normalize(LST_current - swephMc);
console.log('RAMC_test:', RAMC_test.toFixed(2) + '°');

// 使用 RAMC 计算 ASC
const obl = 23.4393 * Math.PI / 180;
const latR = lat * Math.PI / 180;
const ramcR = RAMC_test * Math.PI / 180;

// 公式: tan(ASC) = -cos(RAMC) / (sin(ε)*tan(φ) + cos(ε)*sin(RAMC))
const num = -Math.cos(ramcR);
const den = Math.sin(obl) * Math.tan(latR) + Math.cos(obl) * Math.sin(ramcR);
const ascFromRamc = normalize(Math.atan2(num, den) * 180 / Math.PI);
console.log('ASC from RAMC:', formatLon(ascFromRamc));
console.log('差距:', (ascFromRamc - swephAsc).toFixed(4) + '°');