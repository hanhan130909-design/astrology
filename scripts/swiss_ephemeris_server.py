#!/usr/bin/env python3
"""
Swiss Ephemeris Python Server
使用 pyswisseph 提供高精度天文计算
"""

import json
import sys
from datetime import datetime

try:
    import swisseph as swe
except ImportError:
    print(json.dumps({"error": "pyswisseph not installed. Run: pip install pyswisseph"}))
    sys.exit(1)

# 行星编号映射
PLANETS = {
    "sun": swe.SUN,
    "moon": swe.MOON,
    "mercury": swe.MERCURY,
    "venus": swe.VENUS,
    "mars": swe.MARS,
    "jupiter": swe.JUPITER,
    "saturn": swe.SATURN,
    "uranus": swe.URANUS,
    "neptune": swe.NEPTUNE,
    "pluto": swe.PLUTO,
    "chiron": swe.CHIRON,
    "north_node": swe.MEAN_NODE,
    "true_node": swe.TRUE_NODE,
    "ceres": swe.CERES,
    "pallas": swe.PALLAS,
    "juno": swe.JUNO,
    "vesta": swe.VESTA
}

# 星座符号
ZODIAC_SIGNS = [
    ("aries", "♈"), ("taurus", "♉"), ("gemini", "♊"),
    ("cancer", "♋"), ("leo", "♌"), ("virgo", "♍"),
    ("libra", "♎"), ("scorpio", "♏"), ("sagittarius", "♐"),
    ("capricorn", "♑"), ("aquarius", "♒"), ("pisces", "♓")
]

def longitude_to_zodiac(longitude):
    """将黄经转换为星座位置"""
    normalized = longitude % 360
    sign_index = int(normalized // 30)
    degree = normalized % 30
    minute = (degree % 1) * 60
    
    return {
        "sign": ZODIAC_SIGNS[sign_index][0],
        "symbol": ZODIAC_SIGNS[sign_index][1],
        "degree": int(degree),
        "minute": int(minute),
        "exact_degree": degree
    }

def calculate_planet_position(jd, planet_id):
    """计算单个行星位置"""
    try:
        # 计算行星位置 (返回: 经度、纬度、距离、经度速度、纬度速度、距离速度)
        result, ret_flag = swe.calc_ut(jd, planet_id)
        
        longitude = result[0]
        latitude = result[1]
        distance = result[2]
        speed = result[3]
        
        zodiac = longitude_to_zodiac(longitude)
        
        return {
            "longitude": longitude,
            "latitude": latitude,
            "distance": distance,
            "speed": speed,
            "retrograde": speed < 0,
            "zodiac": zodiac
        }
    except Exception as e:
        return {"error": str(e)}

def calculate_houses(jd, latitude, longitude, house_system='P'):
    """计算宫位 (默认 Placidus)"""
    try:
        # house_system: P=Placidus, K=Koch, E=Equal, W=Whole Sign
        houses, ascmc = swe.houses_ex(jd, latitude, longitude, bytes(house_system, 'ascii'))
        
        house_list = []
        for i in range(12):
            cusp = houses[i]
            zodiac = longitude_to_zodiac(cusp)
            house_list.append({
                "number": i + 1,
                "cusp": cusp,
                "zodiac": zodiac
            })
        
        return {
            "houses": house_list,
            "ascendant": ascmc[0],
            "mc": ascmc[1],
            "armc": ascmc[2],
            "vertex": ascmc[3]
        }
    except Exception as e:
        return {"error": str(e)}

def calculate_aspects(planets_dict, orb=6):
    """计算行星相位"""
    aspects = []
    planet_names = list(planets_dict.keys())
    
    # 主要相位定义
    ASPECT_ANGLES = {
        "conjunction": 0,
        "sextile": 60,
        "square": 90,
        "trine": 120,
        "opposition": 180,
        "quincunx": 150,
        "semi-sextile": 30,
        "semi-square": 45
    }
    
    for i in range(len(planet_names)):
        for j in range(i + 1, len(planet_names)):
            p1 = planet_names[i]
            p2 = planet_names[j]
            
            if "error" in planets_dict[p1] or "error" in planets_dict[p2]:
                continue
            
            lon1 = planets_dict[p1]["longitude"]
            lon2 = planets_dict[p2]["longitude"]
            
            # 计算角度差
            diff = abs(lon1 - lon2)
            if diff > 180:
                diff = 360 - diff
            
            # 检查各相位
            for aspect_name, aspect_angle in ASPECT_ANGLES.items():
                aspect_diff = abs(diff - aspect_angle)
                if aspect_diff <= orb:
                    aspects.append({
                        "planet1": p1,
                        "planet2": p2,
                        "aspect": aspect_name,
                        "angle": aspect_angle,
                        "exact_angle": diff,
                        "orb": aspect_diff,
                        "applying": (lon1 + planets_dict[p1]["speed"]) > (lon2 + planets_dict[p2]["speed"])
                    })
                    break
    
    return aspects

def generate_natal_chart(year, month, day, hour, minute, latitude, longitude, timezone):
    """生成完整本命盘"""
    try:
        # 转换为 UTC
        ut_hour = hour - timezone
        date_str = f"{year}-{month:02d}-{day:02d}"
        
        # 计算 Julian Day
        jd = swe.julday(year, month, day, ut_hour + minute/60)
        
        # 计算所有行星位置
        planets = {}
        for name, planet_id in PLANETS.items():
            planets[name] = calculate_planet_position(jd, planet_id)
        
        # 计算宫位
        houses_data = calculate_houses(jd, latitude, longitude)
        
        # 计算相位
        aspects = calculate_aspects(planets)
        
        # 上升点星座
        asc_zodiac = longitude_to_zodiac(houses_data.get("ascendant", 0))
        
        return {
            "success": True,
            "julian_day": jd,
            "planets": planets,
            "houses": houses_data.get("houses", []),
            "ascendant": {
                "longitude": houses_data.get("ascendant", 0),
                "zodiac": asc_zodiac
            },
            "mc": {
                "longitude": houses_data.get("mc", 0),
                "zodiac": longitude_to_zodiac(houses_data.get("mc", 0))
            },
            "aspects": aspects,
            "datetime": {
                "local": f"{year}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}",
                "utc": f"{year}-{month:02d}-{day:02d} {int(ut_hour):02d}:{minute:02d}"
            }
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

def main():
    """主函数 - 从命令行参数读取输入"""
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input provided"}))
        return
    
    try:
        # 解析输入参数
        input_data = json.loads(sys.argv[1])
        action = input_data.get("action", "natal_chart")
        
        if action == "natal_chart":
            result = generate_natal_chart(
                year=input_data["year"],
                month=input_data["month"],
                day=input_data["day"],
                hour=input_data.get("hour", 12),
                minute=input_data.get("minute", 0),
                latitude=input_data.get("latitude", 0),
                longitude=input_data.get("longitude", 0),
                timezone=input_data.get("timezone", 0)
            )
        elif action == "planet_position":
            jd = swe.julday(
                input_data["year"],
                input_data["month"],
                input_data["day"],
                input_data.get("hour", 12) + input_data.get("minute", 0) / 60
            )
            planet_name = input_data.get("planet", "sun")
            planet_id = PLANETS.get(planet_name, swe.SUN)
            result = calculate_planet_position(jd, planet_id)
        elif action == "houses":
            jd = swe.julday(
                input_data["year"],
                input_data["month"],
                input_data["day"],
                input_data.get("hour", 12)
            )
            result = calculate_houses(
                jd,
                input_data.get("latitude", 0),
                input_data.get("longitude", 0),
                input_data.get("system", "P")
            )
        else:
            result = {"error": f"Unknown action: {action}"}
        
        print(json.dumps(result, ensure_ascii=False, indent=2))
        
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON input"}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
