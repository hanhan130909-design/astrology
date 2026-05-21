#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix year range and minute selector in natal/page.tsx
1. Year: 1920 to current year (instead of current year to +80)
2. Minute: all 0-59 (instead of only multiples of 5)
"""

# Read file
with open(r'C:\Users\user\.qclaw\astrology-clean\src\app\natal\page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: Year range - from 1920 to current year
old_year_line = "  const years = Array.from({ length: 80 }, (_, i) => currentYear + i);"
new_year_line = "  const years = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => 1920 + i);  // 1920 to current year"
content = content.replace(old_year_line, new_year_line)

# Fix 2: Minute selector - all 0-59, not just multiples of 5
old_min_line = "  const minOptions = minutes.filter(m => m % 5 === 0).map(m => ({ id: String(m), name: String(m).padStart(2, '0') }));"
new_min_line = "  const minOptions = minutes.map(m => ({ id: String(m), name: String(m).padStart(2, '0') }));  // All 0-59"
content = content.replace(old_min_line, new_min_line)

# Write back
with open(r'C:\Users\user\.qclaw\astrology-clean\src\app\natal\page.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)

print("Fixed: Year range (1920-current) + Minute selector (0-59 all)")
