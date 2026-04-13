"""Test PyEphem Star Chart Calculation"""
from pse_server import calculate_all_planets, calculate_aspects

print("=" * 50)
print("[TEST] Star Chart Calculation")
print("=" * 50)

# Test natal chart
pos = calculate_all_planets('1990/06/15', '12:00:00', 39.9, 116.4)

print("\n[Planet Positions]")
for planet in ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']:
    if planet in pos:
        p = pos[planet]
        print(f"  {planet:8s}: {p['sign_cn']} {p['degree']:.2f} ({p['sign']})")

print("\n[Aspects]")
aspects = calculate_aspects(pos)
for a in aspects[:5]:
    print(f"  {a['planet1']} {a['type']} {a['planet2']} (orb: {a['orb']})")

print("\n[OK] Test passed!")
