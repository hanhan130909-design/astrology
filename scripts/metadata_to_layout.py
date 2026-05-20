import os

base = r"C:\Users\user\.qclaw\astrology-clean\src\app"

pages = {
    "about": {
        "title": "About Starry Fate - Free AI Astrology Platform",
        "desc": "Starry Fate is a professional astrology platform powered by real astronomical calculations and advanced AI technology. We are dedicated to providing users with precise, in-depth astrological insights.",
        "kws": ["about Starry Fate", "Starry Fate astrology", "AI astrology", "astrology platform", "about us"],
    },
    "chart": {
        "title": "Free Astrology Chart Calculator",
        "desc": "Free online astrology chart calculator supporting natal chart, transit chart, composite chart, solar return and more. Based on real astronomical calculations with AI-powered interpretation.",
        "kws": ["astrology chart", "chart calculator", "natal chart", "transit chart", "free chart", "AI chart"],
    },
    "community": {
        "title": "Zodiac Community - Connect with Astrology Enthusiasts",
        "desc": "Join the free Starry Fate Zodiac Community and connect with astrology enthusiasts worldwide. Discuss horoscopes, zodiac compatibility and astrology techniques.",
        "kws": ["zodiac community", "astrology forum", "astrology discussion", "free community"],
    },
    "compare": {
        "title": "Zodiac Sign Comparison Tool",
        "desc": "Free zodiac sign comparison tool. Compare two zodiac signs to discover personality compatibility, strengths, weaknesses and relationship potential.",
        "kws": ["zodiac comparison", "sign comparison", "astrology compare", "zodiac match"],
    },
    "compatibility": {
        "title": "Zodiac Compatibility Analysis - Free Relationship Astrology",
        "desc": "Generate a free professional zodiac compatibility analysis. AI-powered analysis of love compatibility, relationship challenges and advice.",
        "kws": ["compatibility", "zodiac match", "love match", "relationship analysis", "AI compatibility"],
    },
    "composite": {
        "title": "Composite Chart Analysis - Relationship Astrology",
        "desc": "Generate a free professional Composite Chart to analyze the shared astrology and dynamic patterns of a relationship. AI deeply interprets relationship qualities.",
        "kws": ["composite chart", "composite", "relationship astrology", "shared chart", "AI composite"],
    },
    "horoscope": {
        "title": "Daily, Monthly & Yearly Horoscope - Free Zodiac Forecast",
        "desc": "Free daily, monthly and yearly horoscope forecasts for all 12 zodiac signs. Accurate astrology predictions covering love, career, health and finance.",
        "kws": ["horoscope", "daily horoscope", "monthly horoscope", "yearly horoscope", "free horoscope"],
    },
    "learn": {
        "title": "Learn Astrology - Free Beginner to Advanced Tutorials",
        "desc": "Learn astrology for free from beginner to advanced. Systematic tutorials covering zodiac basics, planetary meanings, house interpretation and aspect analysis.",
        "kws": ["learn astrology", "astrology tutorial", "zodiac knowledge", "beginner astrology"],
    },
    "lunar-return": {
        "title": "Free Lunar Return Chart Analysis",
        "desc": "Generate a free professional Lunar Return chart to analyze astrological themes and influences for the upcoming year. AI interprets fortune themes and opportunities.",
        "kws": ["lunar return", "solar return", "birthday chart", "yearly forecast", "AI lunar return"],
    },
    "natal": {
        "title": "Free Natal Chart Analysis - Birth Chart Calculator",
        "desc": "Generate your free professional natal chart based on real astronomical calculations. AI-powered interpretation reveals your core self, emotions, relationships and life purpose.",
        "kws": ["natal chart", "birth chart", "astrology chart", "free natal", "AI natal"],
    },
    "progression": {
        "title": "Free Vimshamsha Progression Analysis",
        "desc": "Use Vimshamsha astrology system to analyze life stage planetary cycles and fortune themes. AI interprets action themes and inner motivations of each life stage.",
        "kws": ["Vimshamsha", "progression", "secondary progression", "life stages", "AI progression"],
    },
    "solar-return": {
        "title": "Free Solar Return Chart - Birthday Astrology",
        "desc": "Generate a free professional Solar Return chart to analyze astrological themes for your personal new year. AI interprets fortune themes for the year ahead.",
        "kws": ["solar return", "birthday astrology", "yearly chart", "AI solar return"],
    },
    "tarot": {
        "title": "Free AI Tarot Reading - Online Card Draw",
        "desc": "Free online AI-powered tarot card reading. Draw tarot cards with various layouts. AI interprets card meanings providing insightful guidance for love, career and growth.",
        "kws": ["tarot reading", "free tarot", "AI tarot", "tarot cards", "online tarot"],
    },
    "transits": {
        "title": "Free Transit Chart Analysis - Planetary Transit Calculator",
        "desc": "Generate a free professional transit chart tracking planetary transits affecting your natal chart. AI-powered analysis reveals fortune turning points.",
        "kws": ["transit chart", "planetary transit", "transit analysis", "AI transit"],
    },
    "yearly-horoscope": {
        "title": "Yearly Horoscope - 12 Zodiac Signs Annual Forecast",
        "desc": "Free yearly horoscope for all 12 zodiac signs. Comprehensive annual forecast covering love, career, finance and health with AI-powered analysis.",
        "kws": ["yearly horoscope", "annual forecast", "yearly zodiac", "free horoscope"],
    },
}

# Pages that already have layout.tsx - add metadata to them
# Pages without layout.tsx - create layout.tsx with metadata

pages_with_layout = []
for d in os.listdir(base):
    if os.path.isfile(os.path.join(base, d, "layout.tsx")) and d in pages:
        pages_with_layout.append(d)

print("Pages with existing layout.tsx:", pages_with_layout)
print("Pages needing new layout.tsx:", [p for p in pages if p not in pages_with_layout])

for name, p in pages.items():
    layout_path = os.path.join(base, name, "layout.tsx")
    kws = ", ".join(f'"{k}"' for k in p["kws"])

    if name in pages_with_layout:
        # Prepend metadata import and export to existing layout
        with open(layout_path, "r", encoding="utf-8") as f:
            content = f.read()
        # Check if metadata already exported
        if "export const metadata" in content:
            print(f"SKIP {name}: layout already has metadata")
            continue
        # Prepend metadata
        metadata_block = f'''import type {{ Metadata }} from "next";

export const metadata: Metadata = {{
  title: "{p["title"]}",
  description: "{p["desc"]}",
  keywords: [{kws}],
  openGraph: {{
    title: "{p["title"]}",
    description: "{p["desc"]}",
    type: "website",
    siteName: "Starry Fate",
  }},
  twitter: {{
    card: "summary_large_image",
    title: "{p["title"]}",
    description: "{p["desc"]}",
  }},
}};

'''
        content = metadata_block + content
        with open(layout_path, "w", encoding="utf-8", newline="\n") as f:
            f.write(content)
        print(f"UPDATED layout: {name}")
    else:
        # Create new layout.tsx with metadata
        content = f'''import type {{ Metadata }} from "next";

export const metadata: Metadata = {{
  title: "{p["title"]}",
  description: "{p["desc"]}",
  keywords: [{kws}],
  openGraph: {{
    title: "{p["title"]}",
    description: "{p["desc"]}",
    type: "website",
    siteName: "Starry Fate",
  }},
  twitter: {{
    card: "summary_large_image",
    title: "{p["title"]}",
    description: "{p["desc"]}",
  }},
}};

export default function Layout({{ children }}: {{ children: React.ReactNode }}) {{
  return children;
}}
'''
        with open(layout_path, "w", encoding="utf-8", newline="\n") as f:
            f.write(content)
        print(f"CREATED layout: {name}")

print("\nDone!")