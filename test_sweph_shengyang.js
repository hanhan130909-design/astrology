// 使用 sweph 计算 ASC
const sweph = require('sweph');

const year = 1986, month = 11, day = 14, hour = 18, minute = 30;
const lat = 41.8, lng = 123.4, tz = 8;

// 计算儒略日
const utcDate = new Date(Date.UTC(year, month - 1, day, Math.floor(hour), minute));
const jd = utcDate.getTime() / 86400000 + 2440587.5;
console.log('JD:', jd);

// 使用 sweph 计算 houses
const houses = sweph.houses(jd, lat, lng, 'P');
console.log('sweph houses result:', JSON.stringify(houses, null, 2));

// 如果 houses 有效，提取 ASC
if (houses && houses.ascendant !== undefined) {
  const ascLon = houses.ascendant;
  const signs = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
  const sign = signs[Math.floor(ascLon / 30) % 12];
  const deg = ascLon % 30;
  console.log('sweph ASC:', ascLon.toFixed(2) + '° = ' + sign + ' ' + Math.floor(deg) + '°' + Math.floor((deg % 1) * 60) + "'");
  console.log('期望: 双子座 27°43\' = 87.72°');
  console.log('差距:', (ascLon - 87.72).toFixed(2) + '°');
} else {
  console.log('sweph.houses() 返回无效结果');
}