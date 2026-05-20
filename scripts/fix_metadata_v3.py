# Write all garbled metadata files with explicit UTF-8 encoding
import os

base = r"C:\Users\user\.qclaw\astrology-clean\src\app"

pages = [
    {
        "name": "about",
        "title": "About Starry Fate",
        "tmpl": "Starry Fate",
        "desc": "Starry Fate is a professional astrology platform powered by real astronomical calculations and advanced AI technology. We are dedicated to providing users with precise, in-depth astrological insights to help everyone better understand themselves and plan their lives.",
        "kws": ["about Starry Fate", "Starry Fate astrology", "AI astrology", "astrology platform", "about us"],
    },
    {
        "name": "chart",
        "title": "Free Astrology Chart Calculator",
        "tmpl": "Starry Fate Chart",
        "desc": "Free online astrology chart calculator supporting natal chart, transit chart, composite chart, solar return and more. Based on real astronomical calculations, accurately showing planetary positions, zodiac sign distribution and house placements.",
        "kws": ["astrology chart", "chart calculator", "natal chart", "transit chart", "free chart", "AI chart"],
    },
    {
        "name": "community",
        "title": "Zodiac Community - Starry Fate",
        "tmpl": "Starry Fate Community",
        "desc": "Join the free Starry Fate Zodiac Community and connect with astrology enthusiasts worldwide. Discuss daily horoscopes, zodiac compatibility and astrology techniques, share your astrological experiences, and explore the mysteries and fun of the zodiac.",
        "kws": ["zodiac community", "astrology forum", "astrology discussion", "astrology exchange", "free community", "astrology enthusiasts"],
    },
    {
        "name": "learn",
        "title": "Learn Astrology - Starry Fate",
        "tmpl": "Starry Fate Astrology",
        "desc": "Learn astrology for free from beginner to advanced. Starry Fate provides systematic astrology tutorials covering zodiac basics, planetary meanings, house interpretation, aspect analysis and more.",
        "kws": ["learn astrology", "astrology tutorial", "zodiac knowledge", "beginner astrology", "free learning", "astrology course"],
    },
    {
        "name": "natal",
        "title": "Free Natal Chart Analysis",
        "tmpl": "Starry Fate Natal Chart",
        "desc": "Generate your free professional natal chart (birth chart) based on real astronomical calculations. Enter your birth data to get accurate planetary positions, zodiac signs, houses and aspects. AI-powered interpretation reveals your core self, emotions, relationships and life purpose.",
        "kws": ["natal chart", "birth chart", "astrology chart", "free natal", "AI natal", "planet positions", "house placement"],
    },
    {
        "name": "progression",
        "title": "Free Vimshamsha Progression Analysis",
        "tmpl": "Starry Fate Progression",
        "desc": "Use Vimshamsha (Secondary Progression) astrology system for free to analyze life stage planetary cycles and fortune themes. Enter birth info to calculate progression positions, AI interprets action themes and inner motivations of each life stage.",
        "kws": ["Vimshamsha", "progression", "secondary progression", "life stages", "planetary cycles", "free astrology", "AI progression"],
    },
    {
        "name": "transits",
        "title": "Free Transit Chart Analysis",
        "tmpl": "Starry Fate Transit",
        "desc": "Generate a free professional transit chart tracking planetary transits affecting your natal chart. Enter a transit date to get planetary positions and aspects to your birth chart. AI-powered analysis reveals fortune turning points and development opportunities.",
        "kws": ["transit chart", "planetary transit", "transit analysis", "fortune turning point", "free astrology", "AI transit", "horoscope transit"],
    },
]

for p in pages:
    path = os.path.join(base, p["name"], "metadata.ts")
    kws = ", ".join(f'"{k}"' for k in p["kws"])
    content = f'''import type {{ Metadata }} from "next";

export const metadata: Metadata = {{
  title: {{
    default: "{p["title"]} - Starry Fate | Free AI Astrology",
    template: "%s | {p["tmpl"]}",
  }},
  description: "{p["desc"]}",
  keywords: [{kws}],
  openGraph: {{
    title: "{p["title"]} - Starry Fate | Free AI Astrology",
    description: "{p["desc"]}",
    type: "website",
    locale: "en_US",
    siteName: "{p["tmpl"]}",
  }},
  twitter: {{
    card: "summary_large_image",
    title: "{p["title"]} - Starry Fate | Free AI Astrology",
    description: "{p["desc"]}",
  }},
}};
'''
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)
    # Verify
    with open(path, "r", encoding="utf-8") as f:
        verify = f.read()
    if "\u4e00" in verify or "��" in verify:
        print(f"STILL GARBLED: {p['name']}")
    else:
        print(f"OK: {p['name']}")