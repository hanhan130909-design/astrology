# Fix compatibility/metadata.ts and scan ALL metadata.ts for garbled keywords
import os, re

base = r"C:\Users\user\.qclaw\astrology-clean\src\app"

def check_keywords(path):
    """Returns True if keywords line has garbled chars (unquoted strings)."""
    with open(path, "rb") as f:
        data = f.read()
    # Keywords line pattern: keywords: [..., ...]
    # Garbled = strings without proper UTF-8 chars or with Chinese chars displayed as raw bytes
    # The real test: if file is valid UTF-8 but the strings in keywords are not properly quoted
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check for garbled keywords: unquoted Chinese or mixed content
    # Pattern: keywords: [word1, word2] where words are not quoted strings
    kw_match = re.search(r'keywords:\s*\[([^\]]+)\]', content)
    if not kw_match:
        return False
    kw_str = kw_match.group(1)
    # If any item in keywords looks like an unquoted identifier (has Chinese or has no quotes)
    items = [x.strip() for x in kw_str.split(',')]
    for item in items:
        item = item.strip()
        if not item:
            continue
        # Check if it's a properly quoted string
        if item.startswith('"') or item.startswith("'"):
            continue
        # Unquoted = garbled
        return True
    return False

# Fix compatibility first
comp_path = os.path.join(base, "compatibility", "metadata.ts")
content = '''import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Zodiac Compatibility Analysis - Starry Fate | Free Zodiac Match | Compatibility",
    template: "%s | Starry Fate Compatibility",
  },
  description: "Generate a free professional zodiac compatibility analysis to deeply interpret the connection between two people. Enter both birth details, AI-powered analysis of love compatibility, relationship challenges and relationship advice.",
  keywords: ["compatibility", "zodiac match", "love match", "relationship analysis", "compatibility reading", "free astrology", "AI compatibility", "zodiac pairing"],
  openGraph: {
    title: "Zodiac Compatibility Analysis - Starry Fate | Free Zodiac Match",
    description: "Generate a free professional zodiac compatibility analysis to deeply interpret the connection between two people. Enter both birth details, AI-powered analysis of love compatibility, relationship challenges and relationship advice.",
    type: "website",
    locale: "en_US",
    siteName: "Starry Fate Compatibility",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zodiac Compatibility Analysis - Starry Fate | Free Zodiac Match",
    description: "Generate a free professional zodiac compatibility analysis to deeply interpret the connection between two people.",
  },
};
'''
with open(comp_path, "w", encoding="utf-8", newline="\n") as f:
    f.write(content)
print("Fixed: compatibility")

# Scan ALL metadata.ts files
fixed = []
for name in os.listdir(base):
    metadata_path = os.path.join(base, name, "metadata.ts")
    if not os.path.isfile(metadata_path):
        continue
    if check_keywords(metadata_path):
        print(f"GARBLED keywords: {name}")
        fixed.append(name)
    else:
        print(f"OK: {name}")

if fixed:
    print(f"\nFiles needing fix: {fixed}")
else:
    print("\nAll files OK!")