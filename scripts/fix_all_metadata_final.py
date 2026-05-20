import os, re

base = r"C:\Users\user\.qclaw\astrology-clean\src\app"

pages = {
    "about": {
        "title": "About Starry Fate - Free AI Astrology Platform",
        "desc": "Starry Fate is a professional astrology platform powered by real astronomical calculations and advanced AI technology. We are dedicated to providing users with precise, in-depth astrological insights to help everyone better understand themselves and plan their lives.",
        "kws": ["about Starry Fate", "Starry Fate astrology", "AI astrology", "astrology platform", "about us"],
    },
    "chart": {
        "title": "Free Astrology Chart Calculator",
        "desc": "Free online astrology chart calculator supporting natal chart, transit chart, composite chart, solar return and more. Based on real astronomical calculations, accurately showing planetary positions, zodiac sign distribution and house placements. AI-powered interpretation helps you decode your astrological blueprint.",
        "kws": ["astrology chart", "chart calculator", "natal chart", "transit chart", "free chart", "AI chart", "horoscope calculator"],
    },
    "community": {
        "title": "Zodiac Community - Connect with Astrology Enthusiasts",
        "desc": "Join the free Starry Fate Zodiac Community and connect with astrology enthusiasts worldwide. Discuss daily horoscopes, zodiac compatibility and astrology techniques, share your astrological experiences, and explore the mysteries and fun of the zodiac.",
        "kws": ["zodiac community", "astrology forum", "astrology discussion", "astrology exchange", "free community", "astrology enthusiasts"],
    },
    "compare": {
        "title": "Zodiac Sign Comparison Tool - Starry Fate",
        "desc": "Free zodiac sign comparison tool. Compare two zodiac signs to discover personality compatibility, strengths, weaknesses and relationship potential. Professional astrology analysis helps you understand the dynamics between any two signs.",
        "kws": ["zodiac comparison", "sign comparison", "astrology compare", "zodiac match", "free comparison", "sign compatibility"],
    },
    "compatibility": {
        "title": "Zodiac Compatibility Analysis - Free Relationship Astrology",
        "desc": "Generate a free professional zodiac compatibility analysis to deeply interpret the connection between two people. Enter both birth details, AI-powered analysis of love compatibility, relationship challenges and relationship advice.",
        "kws": ["compatibility", "zodiac match", "love match", "relationship analysis", "compatibility reading", "free astrology", "AI compatibility", "zodiac pairing"],
    },
    "composite": {
        "title": "Composite Chart Analysis - Relationship Astrology",
        "desc": "Generate a free professional Composite Chart to analyze the shared astrology and dynamic patterns of a relationship. Enter both birth details, calculate Composite planetary positions and house placements, AI deeply interprets relationship qualities and shared destiny.",
        "kws": ["composite chart", "composite", "relationship astrology", "shared chart", "free astrology", "AI composite", "compatibility astrology"],
    },
    "horoscope": {
        "title": "Daily, Monthly & Yearly Horoscope - Free Zodiac Forecast",
        "desc": "Free daily, monthly and yearly horoscope forecasts for all 12 zodiac signs. Accurate astrology predictions covering love, career, health and finance. Powered by real astronomical calculations and AI analysis for reliable guidance.",
        "kws": ["horoscope", "daily horoscope", "monthly horoscope", "yearly horoscope", "zodiac forecast", "free horoscope", "astrology prediction"],
    },
    "learn": {
        "title": "Learn Astrology - Free Beginner to Advanced Tutorials",
        "desc": "Learn astrology for free from beginner to advanced. Starry Fate provides systematic astrology tutorials covering zodiac basics, planetary meanings, house interpretation, aspect analysis and more. Help you become an astrology master from scratch.",
        "kws": ["learn astrology", "astrology tutorial", "zodiac knowledge", "beginner astrology", "free learning", "astrology course"],
    },
    "lunar-return": {
        "title": "Free Lunar Return Chart Analysis - Starry Fate",
        "desc": "Generate a free professional Lunar Return chart to analyze the astrological themes and influences for the upcoming year. Enter your birth information and current location to calculate Lunar Return planetary positions. AI interprets fortune themes, opportunities and challenges for the next 12 months.",
        "kws": ["lunar return", "solar return", "birthday chart", "yearly forecast", "free astrology", "AI lunar return", "return chart"],
    },
    "natal": {
        "title": "Free Natal Chart Analysis - Birth Chart Calculator",
        "desc": "Generate your free professional natal chart (birth chart) based on real astronomical calculations. Enter your birth data to get accurate planetary positions, zodiac signs, houses and aspects. AI-powered interpretation reveals your core self, emotions, relationships and life purpose.",
        "kws": ["natal chart", "birth chart", "astrology chart", "free natal", "AI natal", "planet positions", "house placement"],
    },
    "progression": {
        "title": "Free Vimshamsha Progression Analysis",
        "desc": "Use Vimshamsha (Secondary Progression) astrology system for free to analyze life stage planetary cycles and fortune themes. Enter birth info to calculate progression positions, AI interprets action themes and inner motivations of each life stage.",
        "kws": ["Vimshamsha", "progression", "secondary progression", "life stages", "planetary cycles", "free astrology", "AI progression"],
    },
    "solar-return": {
        "title": "Free Solar Return Chart Analysis - Birthday Astrology",
        "desc": "Generate a free professional Solar Return chart to analyze the astrological themes and influences for your personal new year. Enter your birth information and current location to calculate Solar Return planetary positions and house placements. AI interprets fortune themes for the year ahead.",
        "kws": ["solar return", "birthday astrology", "yearly chart", "return chart", "free astrology", "AI solar return", "yearly forecast"],
    },
    "tarot": {
        "title": "Free AI Tarot Reading - Online Card Draw",
        "desc": "Free online AI-powered tarot card reading. Draw tarot cards with single card, three card spread and Celtic Cross layouts. AI interprets card meanings in the context of your question, providing insightful guidance for love, career and personal growth.",
        "kws": ["tarot reading", "free tarot", "AI tarot", "tarot cards", "online tarot", "card reading", "tarot spread"],
    },
    "transits": {
        "title": "Free Transit Chart Analysis - Planetary Transit Calculator",
        "desc": "Generate a free professional transit chart tracking planetary transits affecting your natal chart. Enter a transit date to get planetary positions and aspects to your birth chart. AI-powered analysis reveals fortune turning points and development opportunities.",
        "kws": ["transit chart", "planetary transit", "transit analysis", "fortune turning point", "free astrology", "AI transit", "horoscope transit"],
    },
    "yearly-horoscope": {
        "title": "2025 Yearly Horoscope - 12 Zodiac Signs Annual Forecast",
        "desc": "Free 2025 yearly horoscope for all 12 zodiac signs. Comprehensive annual forecast covering love, career, finance and health. Powered by real astronomical calculations and AI analysis, providing reliable yearly guidance for planning your year ahead.",
        "kws": ["yearly horoscope", "2025 horoscope", "annual forecast", "yearly zodiac", "free horoscope", "AI yearly forecast"],
    },
}

for name, p in pages.items():
    path = os.path.join(base, name, "metadata.ts")
    if not os.path.exists(os.path.join(base, name)):
        continue
    kws = ", ".join(f'"{k}"' for k in p["kws"])
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
'''
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)
    print(f"OK: {name}")

print(f"\nTotal: {len(pages)} files updated")