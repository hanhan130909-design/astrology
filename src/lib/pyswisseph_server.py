"""
星盘计算后端 - 使用 Swiss Ephemeris
基于 NASA JPL DE431 星历，最高精度

安装依赖:
    pip install pyswisseph flask flask-cors

下载星历文件到 ./ephe 目录:
    seas_18.se1, sefstars.txt, semo_18.se1, sepl_18.se1
    从 https://www.astro.com/ftp/swisseph/ephe/ 下载
"""

import swisseph as swe
import json
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 设置星历文件路径
EPHE_PATH = './ephe'
swe.set_ephe_path(EPHE_PATH)

# 行星常量
PLANETS = {
    swe.SUN: 'Sun',
    swe.MOON: 'Moon',
    swe.MERCURY: 'Mercury',
    swe.VENUS: 'Venus',
    swe.MARS: 'Mars',
    swe.JUPITER: 'Jupiter',
    swe.SATURN: 'Saturn',
    swe.URANUS: 'Uranus',
    swe.NEPTUNE: 'Neptune',
    swe.PLUTO: 'Pluto',
    swe.MEAN_NODE: 'North_Node',
    swe.TRUE_NODE: 'True_Node',
}

# 十二星座
SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
         'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']

# 中文星座
SIGNS_CN = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座',
            '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']

# 印度星座 (Nakshatra) - 简化的 Nirayana 系统
NAKSHATRAS = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva_Phalguni', 'Uttara_Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva_Ashadha', 'Uttara_Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
    'Purva_Bhadrapada', 'Uttara_Bhadrapada', 'Revati'
]

def julian_day(year, month, day, hour=0, minute=0, second=0):
    """将公历日期转换为儒略日"""
    return swe.julday(year, month, day, hour + minute/60 + second/3600)

def get_planet_positions(jd, flags=swe.FLG_SWIEPH):
    """计算所有行星位置"""
    positions = {}
    
    for planet_id, planet_name in PLANETS.items():
        try:
            result, flags_return = swe.calc_ut(jd, planet_id, flags)
            longitude = result[0]
            latitude = result[1]
            distance = result[2]
            speed = result[3]
            
            # 计算所在星座
            sign_index = int(longitude // 30)
            degree_in_sign = longitude % 30
            
            positions[planet_name] = {
                'longitude': round(longitude, 6),
                'latitude': round(latitude, 6),
                'distance': round(distance, 6),
                'speed': round(speed, 6),
                'sign': SIGNS[sign_index],
                'sign_cn': SIGNS_CN[sign_index],
                'degree': round(degree_in_sign, 4),
                'sign_longitude': sign_index * 30 + degree_in_sign
            }
        except Exception as e:
            positions[planet_name] = {'error': str(e)}
    
    return positions

def get_house_positions(jd, lat, lng, houses, ascmc):
    """获取宫位信息"""
    house_list = []
    for i, h in enumerate(houses[:12]):
        sign_index = int(h // 30)
        house_list.append({
            'house': i + 1,
            'longitude': round(h, 6),
            'sign': SIGNS[sign_index],
            'sign_cn': SIGNS_CN[sign_index],
            'degree': round(h % 30, 4)
        })
    
    # ASC, MC, ARMC, Vertex 等点
    points = {
        'ASC': {'longitude': round(ascmc[0], 6), 'sign': SIGNS[int(ascmc[0]//30)], 'sign_cn': SIGNS_CN[int(ascmc[0]//30)]},
        'MC': {'longitude': round(ascmc[1], 6), 'sign': SIGNS[int(ascmc[1]//30)], 'sign_cn': SIGNS_CN[int(ascmc[1]//30)]},
        'ARMC': round(ascmc[2], 6),
        'Vertex': round(ascmc[3], 6) if len(ascmc) > 3 else None,
        'East_Point': round(ascmc[4], 6) if len(ascmc) > 4 else None,
    }
    
    return {'houses': house_list, 'angles': points}

def calculate_aspects(positions):
    """计算相位"""
    aspects = []
    orb = 8  # 容许度
    
    planet_list = [p for p in positions.keys() if 'error' not in positions.get(p, {})]
    
    for i, p1 in enumerate(planet_list):
        for p2 in planet_list[i+1:]:
            lon1 = positions[p1]['longitude']
            lon2 = positions[p2]['longitude']
            
            diff = abs(lon1 - lon2)
            if diff > 180:
                diff = 360 - diff
            
            # 定义相位
            aspect_types = {
                0: ('Conjunction', '合', 0),
                60: ('Sextile', '六分', 1),
                90: ('Square', '刑', -1),
                120: ('Trine', '拱', 0),
                180: ('Opposition', '冲', -1),
            }
            
            for target_angle, (aspect_name, aspect_cn, power) in aspect_types.items():
                if abs(diff - target_angle) <= orb:
                    aspects.append({
                        'planet1': p1,
                        'planet2': p2,
                        'type': aspect_name,
                        'type_cn': aspect_cn,
                        'orb': round(diff - target_angle, 2),
                        'power': power
                    })
                    break
    
    return aspects

def calculate_dignities(planet, sign):
    """计算行星尊贵度"""
    # 入庙位置
    rulerships = {
        'Sun': ['Leo'], 'Moon': ['Cancer'], 'Mercury': ['Gemini', 'Virgo'],
        'Venus': ['Taurus', 'Libra'], 'Mars': ['Aries', 'Scorpio'],
        'Jupiter': ['Sagittarius'], 'Saturn': ['Capricorn', 'Aquarius'],
        'Uranus': ['Aquarius'], 'Neptune': ['Pisces'], 'Pluto': ['Scorpio'],
        'North_Node': [], 'True_Node': []
    }
    
    # 曜升位置
    exaltations = {
        'Sun': 'Aries', 'Moon': 'Taurus', 'Mercury': 'Virgo',
        'Venus': 'Pisces', 'Mars': 'Capricorn', 'Jupiter': 'Cancer',
        'Saturn': 'Libra', 'Uranus': 'Scorpio', 'Neptune': 'Leo', 'Pluto': 'Aries'
    }
    
    dignity = 'neutral'
    if sign in rulerships.get(planet, []):
        dignity = 'rulership'
    elif sign == exaltations.get(planet):
        dignity = 'exaltation'
    elif sign in ['Capricorn', 'Aquarius'] and planet == 'Mars':
        dignity = 'detriment'
    elif sign == 'Cancer' and planet == 'Jupiter':
        dignity = 'detriment'
    
    return dignity

@app.route('/api/natal', methods=['GET', 'POST'])
def natal_chart():
    """本命盘计算"""
    try:
        if request.method == 'POST':
            data = request.json
        else:
            data = request.args
        
        year = int(data.get('year'))
        month = int(data.get('month'))
        day = int(data.get('day'))
        hour = int(data.get('hour', 0))
        minute = int(data.get('minute', 0))
        lat = float(data.get('lat', 0))
        lng = float(data.get('lng', 0))
        timezone = float(data.get('timezone', 8))
        
        # 将本地时间转换为 UT (世界时)
        hour_utc = hour - timezone + minute/60
        jd = julian_day(year, month, day, hour_utc)
        
        # 计算行星位置
        positions = get_planet_positions(jd)
        
        # 计算宫位 (使用 Placidus 宫位系统)
        houses, ascmc = swe.houses(jd, lat, lng, b'P')
        house_info = get_house_positions(jd, lat, lng, houses, ascmc)
        
        # 计算相位
        aspects = calculate_aspects(positions)
        
        # 计算尊贵度
        dignities = {}
        for planet, pos in positions.items():
            if 'error' not in pos:
                dignities[planet] = calculate_dignities(planet, pos['sign'])
        
        # 组装结果
        result = {
            'success': True,
            'birth_data': {
                'year': year, 'month': month, 'day': day,
                'hour': hour, 'minute': minute,
                'latitude': lat, 'longitude': lng,
                'timezone': timezone,
                'julian_day': round(jd, 6)
            },
            'planets': positions,
            'houses': house_info['houses'],
            'angles': house_info['angles'],
            'aspects': aspects,
            'dignities': dignities
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/synastry', methods=['POST'])
def synastry_chart():
    """合盘计算 - 比较两个人的星盘"""
    try:
        data = request.json
        
        # 第一个人
        jd1 = julian_day(
            data['year1'], data['month1'], data['day1'],
            data.get('hour1', 0) - data.get('timezone1', 8) + data.get('minute1', 0)/60
        )
        
        # 第二个人
        jd2 = julian_day(
            data['year2'], data['month2'], data['day2'],
            data.get('hour2', 0) - data.get('timezone2', 8) + data.get('minute2', 0)/60
        )
        
        lat1 = float(data.get('lat1', 0))
        lng1 = float(data.get('lng1', 0))
        lat2 = float(data.get('lat2', lat1))
        lng2 = float(data.get('lng2', lng1))
        
        # 计算两张星盘的行星位置
        pos1 = get_planet_positions(jd1)
        pos2 = get_planet_positions(jd2)
        
        # 计算行星之间的相位 (合盘)
        synastry_aspects = []
        orb = 8
        
        planet_list1 = [p for p in pos1.keys() if 'error' not in pos1.get(p, {})]
        planet_list2 = [p for p in pos2.keys() if 'error' not in pos2.get(p, {})]
        
        for p1 in planet_list1:
            for p2 in planet_list2:
                lon1 = pos1[p1]['longitude']
                lon2 = pos2[p2]['longitude']
                
                diff = abs(lon1 - lon2)
                if diff > 180:
                    diff = 360 - diff
                
                if diff <= orb:
                    aspect_type = 'Conjunction'
                    if 55 <= diff <= 65:
                        aspect_type = 'Sextile'
                    elif 85 <= diff <= 95:
                        aspect_type = 'Square'
                    elif 115 <= diff <= 125:
                        aspect_type = 'Trine'
                    elif 175 <= diff <= 185:
                        aspect_type = 'Opposition'
                    
                    synastry_aspects.append({
                        'planet1': p1,
                        'planet2': p2,
                        'type': aspect_type,
                        'orb': round(diff, 2)
                    })
        
        return jsonify({
            'success': True,
            'chart1': pos1,
            'chart2': pos2,
            'aspects': synastry_aspects
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/transit', methods=['POST'])
def transit_chart():
    """推运盘计算 - 某一天的行星行运"""
    try:
        data = request.json
        
        # 出生时间
        jd_birth = julian_day(
            data['birth_year'], data['birth_month'], data['birth_day'],
            data.get('birth_hour', 12) - data.get('birth_timezone', 8)
        )
        
        # 推运时间
        jd_transit = julian_day(
            data['transit_year'], data['transit_month'], data['transit_day'],
            data.get('transit_hour', 12)
        )
        
        lat = float(data.get('lat', 0))
        lng = float(data.get('lng', 0))
        
        # 计算出生时天王星位置 (用于次限推运)
        natal_pos = get_planet_positions(jd_birth)
        transit_pos = get_planet_positions(jd_transit)
        
        return jsonify({
            'success': True,
            'natal': natal_pos,
            'transit': transit_pos,
            'days_elapsed': round(jd_transit - jd_birth, 2)
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/health', methods=['GET'])
def health():
    """健康检查"""
    return jsonify({
        'status': 'ok',
        'version': '1.0.0',
        'swiss_ephemeris_version': swe.version,
        'ephe_path': EPHE_PATH
    })

if __name__ == '__main__':
    print(f"Swiss Ephemeris 版本: {swe.version}")
    print(f"星历文件路径: {EPHE_PATH}")
    print("启动星盘计算服务...")
    app.run(host='0.0.0.0', port=5000, debug=True)
