#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Add Save button and AI interpretation to composite/page.tsx
Step 1: Add imports
"""

import re

# Read file
with open(r'C:\Users\user\.qclaw\astrology-clean\src\app\composite\page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports after line 2 (import Link from 'next/link')
new_imports = """import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Users, Heart, Search, Star, ChevronDown, Save, Share2, Download, Sparkles } from 'lucide-react';
import { saveCompositeChart, getSavedCompositeCharts } from '@/lib/firebase';
import html2canvas from 'html2canvas';"""

# Replace the import section
old_imports = """import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ArrowLeft, Users, Heart, Search, Star, ChevronDown } from 'lucide-react';"""

content = content.replace(old_imports, new_imports)

# Write back
with open(r'C:\Users\user\.qclaw\astrology-clean\src\app\composite\page.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)

print("Step 1: Added imports")
