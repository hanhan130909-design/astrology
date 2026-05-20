// 使用 sweph 计算 ASC - 修正版
const sweph = require('sweph');

const year = 1986, month = 11, day = 14, hour = 18, minute = 30;
const lat = 41.8, lng = 123.4, tz = 8;

// 计算儒略日
const utcDate = new Date(Date.UTC(year, month - 1, day, Math.floor(hour), minute));
const jd = utcDate.getTime() / 86400000 + 2440587.5;
console.log('JD:', jd);
console.log('UTC:', utcDate.toISOString());

// 使用 sweph 计算 houses
const houses = sweph.houses(jd, lat, lng, 'P');

// sweph 返回格式：houses.data.points[0] = ASC, houses.data.points[1] = MC
// houses.data.houses[0] = House 1 cusp, houses.data.houses[1] = House 2 cusp, etc.

if (houses && houses.data && houses.data.points) {
  const ascLon = houses.data.points[0];
  const mcLon = houses.data.points[1];
  const cusp1 = houses.data.houses[0];
  
  console.log('sweph ASC:', ascLon);
  console.log('sweph MC:', mcLon);
  console.log('House 1 cusp:', cusp1);
  
  const signs = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
  
  function fmtLon(lon) {
    const sign = signs[Math.floor(lon / 30) % 12];
    const deg = lon % 30;
    return lon.toFixed(2) + '° = ' + sign + ' ' + Math.floor(deg) + '°' + Math.floor((deg % 1) * 60) + "'";
  }
  
  console.log('sweph ASC (格式化):', fmtLon(ascLon));
  console.log('sweph MC (格式化):', fmtLon(mcLon));
  console.log('期望 ASC: 双子座 27°43\' = 87.72°');
  console.log('差距:', (ascLon - 87.72).toFixed(2) + '°');
  
  // 检查是否使用不同的 house system
  console.log('\n=== 测试不同分宫制 ===');
  const systems = ['P', 'K', 'R', 'C', 'E', 'W', 'A', 'B'];
  for (const sys of systems) {
    try {
      const h = sweph.houses(jd, lat, lng, sys);
      if (h && h.data && h.data.points) {
        console.log(sys + ': ASC=' + h.data.points[0].toFixed(2) + '° = ' + signs[Math.floor(h.data.points[0] / 30) % 12]);
      }
    } catch(e) {
      console.log(sys + ': 错误 - ' + e.message);
    }
  }
} else {
  console.log('sweph.houses() 返回无效结果:', JSON.stringify(houses));
}