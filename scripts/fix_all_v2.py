import os, re

base = r"C:\Users\user\.qclaw\astrology-clean\src\app"

def has_garbled(c):
    # Check if file contains CJK characters in strings (means it was read as wrong encoding)
    try:
        c.encode('gbk')
        return False
    except:
        pass
    # Check for common garbled patterns (looks like UTF-8 being read as GBK or similar)
    return bool(re.search(r'[\u4e00-\u9fff]', c))

def fix_file(name):
    path = os.path.join(base, name, "metadata.ts")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    if not has_garbled(content):
        print(f"SKIP {name}: already clean")
        return
    
    templates = {
        "about": ("About Starry Fate", "Starry Fate", "Starry Fate is a professional astrology platform powered by real astronomical calculations and advanced AI technology. We are dedicated to providing users with precise, in-depth astrological insights to help everyone better understand themselves and plan their lives. Core features include natal chart analysis, AI-powered interpretations, and zodiac compatibility matching.", ["about Starry Fate", "Starry Fate astrology", "AI astrology", "astrology platform", "about us"]),
        "chart": ("Free Astrology Chart Calculator", "Starry Fate Chart", "Free online astrology chart calculator supporting natal chart, transit chart, composite chart, solar return and more. Based on real astronomical calculations, accurately showing planetary positions, zodiac sign distribution and house placements. AI-powered interpretation helps you decode your astrological blueprint.", ["astrology chart", "chart calculator", "natal chart", "transit chart", "free chart", "AI chart", "horoscope calculator"]),
        "community": ("Zodiac Community - Starry Fate", "Starry Fate Community", "Join the free Starry Fate Zodiac Community and connect with astrology enthusiasts worldwide. Discuss daily horoscopes, zodiac compatibility and astrology techniques, share your astrological experiences, and explore the mysteries and fun of the zodiac.", ["zodiac community", "astrology forum", "astrology discussion", "astrology exchange", "free community", "astrology enthusiasts"]),
        "learn": ("Learn Astrology - Starry Fate", "Starry Fate Astrology", "Learn astrology for free from beginner to advanced. Starry Fate provides systematic astrology tutorials covering zodiac basics, planetary meanings, house interpretation, aspect analysis and more. Help you become an astrology master from scratch.", ["learn astrology", "astrology tutorial", "zodiac knowledge", "beginner astrology", "free learning", "astrology course"]),
        "natal": ("Free Natal Chart Analysis", "Starry Fate Natal Chart", "Generate your free professional natal chart (birth chart) based on real astronomical calculations. Enter your birth data to get accurate planetary positions, zodiac signs, houses and aspects. AI-powered interpretation reveals your core self, emotions, relationships and life purpose.", ["natal chart", "birth chart", "astrology chart", "free natal", "AI natal", "planet positions", "house placement"]),
        "progression": ("Free Vimshamsha Progression Analysis", "Starry Fate Progression", "Use Vimshamsha (Secondary Progression) astrology system for free to analyze life stage planetary cycles and fortune themes. Enter birth info to calculate progression positions, AI interprets action themes and inner motivations of each life stage.", ["Vimshamsha", "progression", "secondary progression", "life stages", "planetary cycles", "free astrology", "AI progression"]),
        "transits": ("Free Transit Chart Analysis", "Starry Fate Transit", "Generate a free professional transit chart tracking planetary transits affecting your natal chart. Enter a transit date to get planetary positions and aspects to your birth chart. AI-powered analysis reveals fortune turning points and development opportunities.", ["transit chart", "planetary transit", "transit analysis", "fortune turning point", "free astrology", "AI transit", "horoscope transit"]),
    }
    
    if name not in templates:
        print(f"SKIP {name}: no template")
        return
    
    title, tmpl, desc, kws = templates[name]
    kws_str = ", ".join(f'"{k}"' for k in kws)
    
    new_content = f'''import type {{ Metadata }} from "next";

export const metadata: Metadata = {{
  title: {{
    default: "{title} - Starry Fate | Free AI Astrology",
    template: "%s | {tmpl}",
  }},
  description: "{desc}",
  keywords: [{kws_str}],
  openGraph: {{
    title: "{title} - Starry Fate | Free AI Astrology",
    description: "{desc}",
    type: "website",
    locale: "en_US",
    siteName: "{tmpl}",
  }},
  twitter: {{
    card: "summary_large_image",
    title: "{title} - Starry Fate | Free AI Astrology",
    description: "{desc}",
  }},
}};
'''
    with open(path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Fixed: {name}")

for name in ["about", "chart", "community", "learn", "natal", "progression", "transits"]:
    fix_file(name)

print("Done!")