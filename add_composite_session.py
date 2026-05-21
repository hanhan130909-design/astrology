#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Add sessionStorage loading for saved composite charts in composite/page.tsx
"""

with open(r'C:\Users\user\.qclaw\astrology-clean\src\app\composite\page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add useEffect import check - already has useState, useRef, useEffect should be there
# Check if useEffect is imported
if 'useEffect' not in content:
    old_import = 'import { useState, useRef } from \'react\';'
    new_import = 'import { useState, useRef, useEffect } from \'react\';'
    content = content.replace(old_import, new_import)

# Add useEffect after chartRef declaration
old_marker = '''  const chartRef = useRef<HTMLDivElement>(null);

  const p1City'''
new_marker = '''  const chartRef = useRef<HTMLDivElement>(null);

  // Load pending composite chart from profile page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pending = sessionStorage.getItem('pending_composite');
      if (pending) {
        try {
          const data = JSON.parse(pending);
          setP1Name(data.person1Name || '');
          setP1Year(data.person1Data?.year || 1990);
          setP1Month(data.person1Data?.month || 6);
          setP1Day(data.person1Data?.day || 15);
          setP1Hour(data.person1Data?.hour || 12);
          setP1Minute(data.person1Data?.minute || 0);
          setP2Name(data.person2Name || '');
          setP2Year(data.person2Data?.year || 1992);
          setP2Month(data.person2Data?.month || 3);
          setP2Day(data.person2Data?.day || 20);
          setP2Hour(data.person2Data?.hour || 10);
          setP2Minute(data.person2Data?.minute || 0);
          if (data.houseSystem) setHouseSystem(data.houseSystem);
          if (data.chartData) {
            setChart(data.chartData);
          }
          sessionStorage.removeItem('pending_composite');
        } catch (e) {
          console.error('Failed to load composite chart:', e);
        }
      }
    }
  }, []);

  const p1City'''
content = content.replace(old_marker, new_marker)

with open(r'C:\Users\user\.qclaw\astrology-clean\src\app\composite\page.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)

print("SUCCESS: Added sessionStorage loading for composite charts")
