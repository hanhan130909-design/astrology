"""
Star Chart API Server - PyEphem Engine
Pure Python implementation

Run: python pse_server.py
"""

import ephem
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Zodiac signs
SIGNS_EN = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
            'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']

SIGNS_CN = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座',
            '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']

# Exaltations
EXALTATIONS = {
    'Sun': 'Aries', 'Moon': 'Taurus', 'Mercury': 'Virgo',
    'Venus': 'Pisces', 'Mars': 'Capricorn', 'Jupiter': 'Cancer',
    'Saturn': 'Libra'
}

# Rulerships
RULERSHIPS = {
    'Sun': 'Leo', 'Moon': 'Cancer', 
    'Mercury': ['Gemini', 'Virgo'],
    'Venus': ['Taurus', 'Libra'], 'Mars': ['Aries', 'Scorpio'],
    'Jupiter': 'Sagittarius', 'Saturn': ['Capricorn', 'Aquarius']
}

# Aspect orbs
ASPECT_ORBS = {
    'Conjunction': 10,
    'Sextile': 6,
    'Square': 8,
    'Trine': 8,
    'Opposition': 10
}

def normalize_angle(angle):
    while angle < 0:
        angle += 360
    while angle >= 360:
        angle -= 360
    return angle

def calculate_planet_position(planet_name, date_str, time_str, lat, lng):
    try:
        observer = ephem.Observer()
        observer.lat = str(lat)
        observer.lon = str(lng)
        observer.date = f"{date_str} {time_str}"
        
        planets = {
            'Sun': ephem.Sun, 'Moon': ephem.Moon,
            'Mercury': ephem.Mercury, 'Venus': ephem.Venus,
            'Mars': ephem.Mars, 'Jupiter': ephem.Jupiter,
            'Saturn': ephem.Saturn, 'Uranus': ephem.Uranus,
            'Neptune': ephem.Neptune, 'Pluto': ephem.Pluto
        }
        
        if planet_name not in planets:
            return None
            
        body = planets[planet_name](observer)
        
        # Calculate geocentric ecliptic coordinates from RA/Dec
        import math
        ra = float(body.ra)
        dec = float(body.dec)
        obl = math.radians(23.4393)  # Earth's obliquity
        
        # Ecliptic longitude
        lon_rad = math.atan2(
            math.sin(ra) * math.cos(obl) + math.tan(dec) * math.sin(obl),
            math.cos(ra)
        )
        longitude = normalize_angle(math.degrees(lon_rad))
        
        # Ecliptic latitude
        lat_rad = math.asin(
            math.sin(dec) * math.cos(obl) - math.cos(ra) * math.tan(dec) * math.sin(obl)
        )
        latitude = math.degrees(lat_rad)
        
        sign_index = int(longitude // 30)
        degree_in_sign = longitude % 30
        
        return {
            'longitude': round(longitude, 6),
            'latitude': round(latitude, 6),
            'sign': SIGNS_EN[sign_index],
            'sign_cn': SIGNS_CN[sign_index],
            'degree': round(degree_in_sign, 4)
        }
    except Exception as e:
        return {'error': str(e)}

def calculate_all_planets(date_str, time_str, lat, lng):
    result = {}
    planet_list = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 
                   'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
    
    for planet in planet_list:
        pos = calculate_planet_position(planet, date_str, time_str, lat, lng)
        if pos:
            result[planet] = pos
    
    # North/South Node - calculate from Moon's geocentric ecliptic longitude
    try:
        import math
        observer = ephem.Observer()
        observer.lat = str(lat)
        observer.lon = str(lng)
        observer.date = f"{date_str} {time_str}"
        moon = ephem.Moon(observer)
        # Calculate Moon's geocentric ecliptic longitude
        ra = float(moon.ra)
        dec = float(moon.dec)
        obl = math.radians(23.4393)
        moon_lon_rad = math.atan2(
            math.sin(ra) * math.cos(obl) + math.tan(dec) * math.sin(obl),
            math.cos(ra)
        )
        moon_longitude = normalize_angle(math.degrees(moon_lon_rad))
        # North Node is opposite to Moon's position
        north_long = normalize_angle(moon_longitude + 180)
        sign_idx = int(north_long // 30)
        result['North_Node'] = {
            'longitude': round(north_long, 6),
            'latitude': 0,
            'sign': SIGNS_EN[sign_idx],
            'sign_cn': SIGNS_CN[sign_idx],
            'degree': round(north_long % 30, 4)
        }
        south_long = normalize_angle(north_long + 180)
        sign_idx2 = int(south_long // 30)
        result['South_Node'] = {
            'longitude': round(south_long, 6),
            'latitude': 0,
            'sign': SIGNS_EN[sign_idx2],
            'sign_cn': SIGNS_CN[sign_idx2],
            'degree': round(south_long % 30, 4)
        }
    except Exception as e:
        result['North_Node'] = {'error': str(e)}
        result['South_Node'] = {'error': str(e)}
    
    return result

def calculate_aspects(positions):
    aspects = []
    planet_names = [p for p in positions.keys() if 'error' not in positions.get(p, {})]
    
    for i, p1 in enumerate(planet_names):
        for p2 in planet_names[i+1:]:
            lon1 = positions[p1]['longitude']
            lon2 = positions[p2]['longitude']
            diff = abs(lon1 - lon2)
            if diff > 180:
                diff = 360 - diff
            
            targets = {'Conjunction': 0, 'Sextile': 60, 'Square': 90, 'Trine': 120, 'Opposition': 180}
            for asp_name, target in targets.items():
                if abs(diff - target) <= ASPECT_ORBS.get(asp_name, 8):
                    aspects.append({
                        'planet1': p1, 'planet2': p2, 'type': asp_name,
                        'orb': round(diff - target, 2)
                    })
                    break
    return aspects

def get_dignity(planet, sign):
    if planet in RULERSHIPS:
        r = RULERSHIPS[planet]
        if isinstance(r, list):
            if sign in r: return 'rulership'
        elif sign == r: return 'rulership'
    if planet in EXALTATIONS and EXALTATIONS[planet] == sign:
        return 'exaltation'
    return 'neutral'

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'engine': 'PyEphem', 'version': ephem.__version__})

@app.route('/api/natal', methods=['GET', 'POST'])
def natal_chart():
    try:
        if request.method == 'POST':
            data = request.json
        else:
            data = dict(request.args)
        
        year = int(float(data.get('year', 1990)))
        month = int(float(data.get('month', 1)))
        day = int(float(data.get('day', 1)))
        hour = int(float(data.get('hour', 12)))
        minute = int(float(data.get('minute', 0)))
        lat = float(data.get('lat', 0))
        lng = float(data.get('lng', 0))
        timezone = float(data.get('timezone', 8))
        
        date_str = f"{year}/{month:02d}/{day:02d}"
        
        # Convert to UTC
        utc_hour = hour + minute / 60.0 - timezone
        if utc_hour < 0:
            utc_hour += 24
        utc_hour = utc_hour % 24
        
        utc_h = int(utc_hour)
        utc_m = int((utc_hour - utc_h) * 60)
        time_str = f"{utc_h:02d}:{utc_m:02d}:00"
        
        positions = calculate_all_planets(date_str, time_str, lat, lng)
        aspects = calculate_aspects(positions)
        
        dignities = {}
        for planet, pos in positions.items():
            if 'error' not in pos:
                dignities[planet] = get_dignity(planet, pos['sign'])
        
        # ASC calculation (simplified - using Moon's position as approximation)
        asc_long = positions.get('Moon', positions.get('Sun', {})).get('longitude', 0)
        houses = []
        for i in range(12):
            h_long = (asc_long + i * 30) % 360
            sign_idx = int(h_long // 30)
            houses.append({
                'house': i + 1,
                'sign': SIGNS_EN[sign_idx],
                'sign_cn': SIGNS_CN[sign_idx],
                'degree': round(h_long % 30, 2),
                'longitude': round(h_long, 4)
            })
        
        return jsonify({
            'success': True,
            'birth_data': {
                'year': year, 'month': month, 'day': day,
                'hour': hour, 'minute': minute,
                'latitude': lat, 'longitude': lng,
                'timezone': timezone,
                'date': date_str,
                'time_ut': time_str
            },
            'planets': positions,
            'houses': houses,
            'aspects': aspects,
            'dignities': dignities,
            'ascendant': SIGNS_EN[int(asc_long // 30)],
            'midheaven': SIGNS_EN[int((asc_long + 270) % 360 // 30)]
        })
    except Exception as e:
        import traceback
        return jsonify({'success': False, 'error': str(e), 'trace': traceback.format_exc()[:500]})

@app.route('/api/synastry', methods=['POST'])
def synastry_chart():
    try:
        data = request.json
        
        def parse_date(d, prefix):
            y = int(float(d.get(f'year{prefix}', 1990)))
            m = int(float(d.get(f'month{prefix}', 1)))
            da = int(float(d.get(f'day{prefix}', 1)))
            h = int(float(d.get(f'hour{prefix}', 12)))
            mi = int(float(d.get(f'minute{prefix}', 0)))
            tz = float(d.get(f'timezone{prefix}', 8))
            date_str = f"{y}/{m:02d}/{da:02d}"
            utc_h = h + mi / 60.0 - tz
            if utc_h < 0: utc_h += 24
            utc_h = utc_h % 24
            time_str = f"{int(utc_h):02d}:{int((utc_h % 1) * 60):02d}:00"
            return date_str, time_str
        
        lat1 = float(data.get('lat1', 0))
        lng1 = float(data.get('lng1', 0))
        
        date1, time1 = parse_date(data, '1')
        date2, time2 = parse_date(data, '2')
        
        lat2 = float(data.get('lat2', lat1))
        lng2 = float(data.get('lng2', lng1))
        
        pos1 = calculate_all_planets(date1, time1, lat1, lng1)
        pos2 = calculate_all_planets(date2, time2, lat2, lng2)
        
        # Synastry aspects
        syn_aspects = []
        planets1 = [p for p in pos1.keys() if 'error' not in pos1.get(p, {})]
        planets2 = [p for p in pos2.keys() if 'error' not in pos2.get(p, {})]
        
        for p1 in planets1:
            for p2 in planets2:
                diff = abs(pos1[p1]['longitude'] - pos2[p2]['longitude'])
                if diff > 180: diff = 360 - diff
                targets = {'Conjunction': 0, 'Sextile': 60, 'Square': 90, 'Trine': 120, 'Opposition': 180}
                for asp, target in targets.items():
                    if abs(diff - target) <= ASPECT_ORBS.get(asp, 8):
                        syn_aspects.append({'planet1': p1, 'planet2': p2, 'type': asp, 'orb': round(diff - target, 2)})
                        break
        
        return jsonify({'success': True, 'chart1': pos1, 'chart2': pos2, 'aspects': syn_aspects})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/transit', methods=['POST'])
def transit_chart():
    try:
        data = request.json
        
        birth_date = f"{int(float(data['birth_year']))}/{int(float(data['birth_month'])):02d}/{int(float(data['birth_day'])):02d}"
        birth_hour = int(float(data.get('birth_hour', 12)))
        birth_min = int(float(data.get('birth_minute', 0)))
        tz = float(data.get('birth_timezone', 8))
        utc_h = birth_hour + birth_min / 60.0 - tz
        if utc_h < 0: utc_h += 24
        utc_h = utc_h % 24
        birth_time = f"{int(utc_h):02d}:{int((utc_h % 1) * 60):02d}:00"
        
        transit_date = f"{int(float(data['transit_year']))}/{int(float(data['transit_month'])):02d}/{int(float(data['transit_day'])):02d}"
        transit_time = f"{int(float(data.get('transit_hour', 12))):02d}:00:00"
        
        lat = float(data.get('lat', 0))
        lng = float(data.get('lng', 0))
        
        natal = calculate_all_planets(birth_date, birth_time, lat, lng)
        transit = calculate_all_planets(transit_date, transit_time, lat, lng)
        
        return jsonify({'success': True, 'natal': natal, 'transit': transit})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/')
def index():
    return jsonify({
        'name': 'Star Chart API',
        'version': '1.0.0',
        'endpoints': ['GET/POST /api/natal', 'POST /api/synastry', 'POST /api/transit', 'GET /api/health']
    })

if __name__ == '__main__':
    print("=" * 50)
    print("[*] Star Chart API Server - PyEphem Engine")
    print(f"    Version: {ephem.__version__}")
    print("=" * 50)
    app.run(host='0.0.0.0', port=5000, debug=True)
