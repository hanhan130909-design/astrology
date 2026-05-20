# Fix all remaining garbled metadata.ts files
import os

base = r"C:\Users\user\.qclaw\astrology-clean\src\app"

files = {
    "about": {
        "title": "About Starry Fate",
        "template": "Starry Fate",
        "desc": "Starry Fate is a professional astrology platform powered by real astronomical calculations and advanced AI technology. We are dedicated to providing users with precise, in-depth astrological insights to help everyone better understand themselves and plan their lives. Core features include natal chart analysis, AI-powered interpretations, and zodiac compatibility matching.",
        "kws": ["about Starry Fate", "Starry Fate astrology", "AI astrology", "astrology platform", "about us"],
    },
    "chart": {
        "title": "Free Astrology Chart Calculator",
        "template": "Starry Fate Chart",
        "desc": "Free online astrology chart calculator supporting natal chart, transit chart, composite chart, solar return and more. Based on real astronomical calculations, accurately showing planetary positions, zodiac sign distribution and house placements. AI-powered interpretation helps you decode your astrological blueprint.",
        "kws": ["astrology chart", "chart calculator", "natal chart", "transit chart", "free chart", "AI chart", "horoscope calculator"],
    },
    "horoscope": {
        "title": "Daily/Monthly Horoscope 2026",
        "template": "Starry Fate Horoscope",
        "desc": "View your free daily, monthly, and yearly horoscope for all 12 zodiac signs. Covers love, career, finance, health and more. AI-powered analysis based on real astronomical calculations, helping you grasp fortune trends and make better decisions.",
        "kws": ["horoscope", "daily horoscope", "monthly horoscope", "yearly horoscope", "zodiac forecast", "free horoscope", "AI horoscope", "2026 horoscope"],
    },
    "natal": {
        "title": "Free Natal Chart Analysis",
        "template": "Starry Fate Natal Chart",
        "desc": "Generate your free professional natal chart (birth chart) based on real astronomical calculations. Enter your birth data to get accurate planetary positions, zodiac signs, houses and aspects. AI-powered interpretation reveals your core self, emotions, relationships and life purpose.",
        "kws": ["natal chart", "birth chart", "astrology chart", "free natal", "AI natal", "planet positions", "house placement"],
    },
    "progression": {
        "title": "Free Vimshamsha (Progression) Analysis",
        "template": "Starry Fate Progression",
        "desc": "Use Vimshamsha (Secondary Progression) astrology system for free to analyze life stage planetary cycles and fortune themes. Enter birth info to calculate progression positions, AI interprets action themes and inner motivations of each life stage.",
        "kws": ["Vimshamsha", "progression", "secondary progression", "life stages", "planetary cycles", "free astrology", "AI progression"],
    },
    "transits": {
        "title": "Free Transit Chart Analysis",
        "template": "Starry Fate Transit",
        "desc": "Generate a free professional transit chart tracking planetary transits affecting your natal chart. Enter a transit date to get planetary positions and aspects to your birth chart. AI-powered analysis reveals fortune turning points and development opportunities.",
        "kws": ["transit chart", "planetary transit", "transit analysis", "fortune turning point", "free astrology", "AI transit", " horoscope transit"],
    },
}

# Fix only the garbled ones
for name, data in files.items():
    path = os.path.join(base, name, "metadata.ts")
    kws = ", ".join(f'"{k}"' for k in data["kws"])
    content = f'''import type {{ Metadata }} from "next";

export const metadata: Metadata = {{
  title: {{
    default: "{data["title"]} - Starry Fate | Free AI Astrology",
    template: "%s | {data["template"]}",
  }},
  description: "{data["desc"]}",
  keywords: [{kws}],
  openGraph: {{
    title: "{data["title"]} - Starry Fate | Free AI Astrology",
    description: "{data["desc"]}",
    type: "website",
    locale: "en_US",
    siteName: "{data["template"]}",
  }},
  twitter: {{
    card: "summary_large_image",
    title: "{data["title"]} - Starry Fate | Free AI Astrology",
    description: "{data["desc"]}",
  }},
}};
'''
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Fixed: {name}")

# Also fix the horoscope keywords line specifically
horoscope_path = os.path.join(base, "horoscope", "metadata.ts")
with open(horoscope_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace garbled keywords with correct ones
content = content.replace(
    'keywords: ["鍚堢洏", "compatibility", "鏄熷骇閰嶅寚", "鍏崇郴鍒嗘瀽", "姣斿緱鐩?", "缁勫悎鐩?, "鎯呮劅鍚堢洏", "鍏嶈垂鍗犳槦", "AI鍚堢洏瑙ｈ獡"],',
    'keywords: ["compatibility chart", "compatibility", "zodiac match", "relationship analysis", "compatibility reading", "free astrology", "AI compatibility", "love match", "zodiac compatibility"],'
)

# community/metadata.ts has a similar garble check
community_path = os.path.join(base, "community", "metadata.ts")
with open(community_path, "r", encoding="utf-8") as f:
    community_content = f.read()

# Check if community keywords are garbled
if "鍏嶈垂" in community_content:
    content = community_content.replace(
        'keywords: ["鏄熷骇绀惧姟", "鏄熷骇璁哄潃", "鏄熷骇璁哄潃", "鏄熷骇浜ゆ祦", "鏄熷骇鎺ュ叺", "鍏嶈垂绀惧姟"],',
        'keywords: ["zodiac community", "astrology forum", "astrology discussion", "astrology exchange", "free community", "astrology enthusiasts"],'
    )
    with open(community_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed: community")

print("All done!")