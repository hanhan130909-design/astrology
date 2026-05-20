#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Add save/AI/share/download features to composite/page.tsx
Appends state variables and handler functions after line 70 (before return statement)
"""

import re

# Read file
with open(r'C:\Users\user\.qclaw\astrology-clean\src\app\composite\page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the line number of "return (" (start of JSX)
return_idx = None
for i, line in enumerate(lines):
    if 'return (' in line and 'const' not in line:
        return_idx = i
        break

if return_idx is None:
    print("ERROR: Could not find return statement")
    exit(1)

# New state variables and functions to insert BEFORE the return statement
new_code = '''  
  // New state variables for features
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [aiInterpretation, setAiInterpretation] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  // Handle save to Firebase
  const handleSave = async () => {
    if (!user) { setError('Please login first'); return; }
    try {
      await saveCompositeChart(
        p1Name || 'Person 1', 
        p2Name || 'Person 2',
        { year: p1Year, month: p1Month, day: p1Day, hour: p1Hour, minute: p1Minute, lat: p1City.lat, lng: p1City.lng, tz: p1City.tz },
        { year: p2Year, month: p2Month, day: p2Day, hour: p2Hour, minute: p2Minute, lat: p2City.lat, lng: p2City.lng, tz: p2City.tz },
        chart,
        houseSystem
      );
      setSaveMsg('Saved!');
      setTimeout(() => setSaveMsg(null), 2000);
    } catch (e: any) {
      setError(e.message);
    }
  };
  
  // Handle AI interpretation
  const handleAIInterpretation = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch('/api/ai-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chartData: chart, language, chartType: 'composite' })
      });
      const data = await res.json();
      setAiInterpretation(data.reading);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingAI(false);
    }
  };
  
  // Handle download as image
  const handleDownload = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement('a');
    link.download = 'composite-chart.png';
    link.href = canvas.toDataURL();
    link.click();
  };
  
  // Handle share link
  const handleShare = async () => {
    const url = window.location.origin + '/composite?' + new URLSearchParams({
      p1name: p1Name,
      p2name: p2Name,
      p1year: String(p1Year),
      p1month: String(p1Month),
      p1day: String(p1Day),
      p1hour: String(p1Hour),
      p1minute: String(p1Minute),
      p1city: p1CityId,
      p2year: String(p2Year),
      p2month: String(p2Month),
      p2day: String(p2Day),
      p2hour: String(p2Hour),
      p2minute: String(p2Minute),
      p2city: p2CityId,
      house: houseSystem
    }).toString();
    
    await navigator.clipboard.writeText(url);
    setSaveMsg('Link copied!');
    setTimeout(() => setSaveMsg(null), 2000);
  };
  
'''

# Insert the new code before the return statement
lines.insert(return_idx, new_code)

# Write back
with open(r'C:\Users\user\.qclaw\astrology-clean\src\app\composite\page.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.writelines(lines)

print("✅ Added state variables and handler functions")
print(f"Inserted before line {return_idx + 1}")
