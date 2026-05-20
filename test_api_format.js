// Test API response format
const Astronomy = require('astronomy-engine');

function normalize(a) { return ((a % 360) + 360) % 360; }
const SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const SIGNS_CN = ['白羊','金牛','双子','巨蟹','狮子','处女','天秤','天蝎','射手','摩羯','水瓶','双鱼'];

function signFromLon(lon) {
  const idx = Math.floor(normalize(lon) / 30) % 12;
  return { sign: SIGNS[idx], sign_cn: SIGNS_CN[idx], degree: normalize(lon) % 30 };
}

const PLANET_BODIES = {
  Sun: Astronomy.Body.Sun, Moon: Astronomy.Body.Moon,
  Mercury: Astronomy.Body.Mercury, Venus: Astronomy.Body.Venus,
  Mars: Astronomy.Body.Mars, Jupiter: Astronomy.Body.Jupiter,
  Saturn: Astronomy.Body.Saturn, Uranus: Astronomy.Body.Uranus,
  Neptune: Astronomy.Body.Neptune, Pluto: Astronomy.Body.Pluto,
};

// Simulate what the API does
const year=1986,month=11,day=14,hour=18,minute=30,lat=41.8,lng=123.4,tz=8;
const utcHour=((hour+minute/60-tz)%24+24)%24;
const utcDate=new Date(Date.UTC(year,month-1,day,Math.floor(utcHour),Math.round((utcHour%1)*60)));
const time=Astronomy.MakeTime(utcDate);

const planets = {};
for (const [name,body] of Object.entries(PLANET_BODIES)) {
  let lon, lat;
  if (name === 'Moon') {
    const ecl = Astronomy.EclipticGeoMoon(time);
    lon = normalize(ecl.lon); lat = ecl.lat;
  } else {
    const vec = Astronomy.GeoVector(body, time, true);
    const ecl = Astronomy.Ecliptic(vec);
    lon = normalize(ecl.elon); lat = ecl.elat;
  }
  planets[name] = { longitude: lon, latitude: lat, ...signFromLon(lon) };
}

console.log('=== API Response Structure ===');
console.log('planets keys:', Object.keys(planets));
console.log('Sun sample:', JSON.stringify(planets.Sun));
console.log('Moon sample:', JSON.stringify(planets.Moon));
console.log('\nEach planet has: longitude, latitude, sign, sign_cn, degree');
console.log('Frontend expects: planets[k].longitude for SVG rendering');