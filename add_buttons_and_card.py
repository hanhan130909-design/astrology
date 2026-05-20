#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Add action buttons and AI interpretation card to composite/page.tsx
Insert before {/* Description Section */}
"""

import re

# Read file
with open(r'C:\Users\user\.qclaw\astrology-clean\src\app\composite\page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the line number of "Description Section"
desc_idx = None
for i, line in enumerate(lines):
    if 'Description Section' in line:
        desc_idx = i
        break

if desc_idx is None:
    print("ERROR: Could not find Description Section")
    exit(1)

# Buttons and AI card to insert
buttons_and_card = '''
        {/* Action Buttons */}
        {chart && (
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {user && (
              <button onClick={handleSave} className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-bold text-white transition-all inline-flex items-center gap-2">
                <Save size={18} />
                {language === 'zh' ? '保存合盘' : 'Save Chart'}
              </button>
            )}
            <button onClick={handleAIInterpretation} disabled={loadingAI} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 rounded-xl font-bold text-white transition-all inline-flex items-center gap-2">
              <Sparkles size={18} />
              {loadingAI ? (language === 'zh' ? 'AI解读中...' : 'AI Reading...') : (language === 'zh' ? 'AI 解读' : 'AI Reading')}
            </button>
            <button onClick={handleDownload} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl font-bold text-white transition-all inline-flex items-center gap-2">
              <Download size={18} />
              {language === 'zh' ? '下载图片' : 'Download'}
            </button>
            <button onClick={handleShare} className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-xl font-bold text-white transition-all inline-flex items-center gap-2">
              <Share2 size={18} />
              {language === 'zh' ? '分享链接' : 'Share Link'}
            </button>
          </div>
        )}

        {/* Save/Share Message */}
        {saveMsg && (
          <div className="text-center mb-4">
            <span className="inline-block px-4 py-2 bg-green-500/20 text-green-300 rounded-lg text-sm">{saveMsg}</span>
          </div>
        )}

        {/* AI Interpretation Card */}
        {aiInterpretation && (
          <div className="max-w-4xl mx-auto mb-8 p-6 rounded-2xl bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-purple-300" />
              {language === 'zh' ? 'AI 解读' : 'AI Interpretation'}
            </h3>
            <div className="text-slate-200 leading-relaxed whitespace-pre-wrap">{aiInterpretation}</div>
          </div>
        )}

'''

# Insert before Description Section
lines.insert(desc_idx, buttons_and_card)

# Also need to add ref={chartRef} to the chart display div
# Find the line with "<div className="flex justify-center">" before <NatalChart>
for i, line in enumerate(lines):
    if 'flex justify-center' in line and 'NatalChart' in lines[i+1] if i+1 < len(lines) else False:
        # Add ref to this div
        lines[i] = line.replace('<div className="flex justify-center">', '<div className="flex justify-center" ref={chartRef}>')
        break

# Write back
with open(r'C:\Users\user\.qclaw\astrology-clean\src\app\composite\page.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.writelines(lines)

print("SUCCESS: Added action buttons and AI interpretation card")
print(f"Inserted before line {desc_idx + 1}")
