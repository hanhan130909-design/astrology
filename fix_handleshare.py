#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix handleShare vs handleCopyLink mismatch in composite/page.tsx
"""

# Read file
with open(r'C:\Users\user\.qclaw\astrology-clean\src\app\composite\page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix: rename handleCopyLink to handleShare
content = content.replace('const handleCopyLink = () => {', 'const handleShare = async () => {')

# Write back
with open(r'C:\Users\user\.qclaw\astrology-clean\src\app\composite\page.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)

print("Fixed: renamed handleCopyLink to handleShare")
