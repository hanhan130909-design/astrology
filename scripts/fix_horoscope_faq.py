#!/usr/bin/env python3
"""修复 horoscope/page.tsx 的 FAQ 中文乱码"""
import re

FILE = r"C:\Users\user\.qclaw\astrology-clean\src\app\horoscope\page.tsx"

with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

# 正确的 FAQ 数据
FAQS_CORRECT = [
    {
        "q": "运势准吗？",
        "a": "运势分析基于行星运行规律，提供趋势性参考。它不是绝对预测，而是帮助你把握时机、做出更好决策的工具。",
        "aEn": "Horoscope analysis is based on planetary cycles and provides trend-based guidance. It is not an absolute prediction, but a tool to help you seize opportunities and make better decisions.",
        "aId": "Analisis horoskop berdasarkan siklus planet dan memberikan panduan berbasis tren. Ini bukan prediksi mutlak, tapi alat untuk membantu Anda memanfaatkan peluang."
    },
    {
        "q": "每日运势和年度运势有什么区别？",
        "a": "每日运势侧重当天能量和短期影响；年度运势（Solar Return）分析整年主题，包括事业、感情、健康等各领域走势。",
        "aEn": "Daily horoscope focuses on the day's energy and short-term influences. Yearly horoscope (Solar Return) analyzes the year's themes across career, love, health, and more.",
        "aId": "Horoskop harian fokus pada energi hari ini dan pengaruh jangka pendek. Horoskop tahunan (Solar Return) menganalisis tema tahun ini di berbagai bidang."
    },
    {
        "q": "为什么运势有时不准？",
        "a": "占星显示的是宇宙能量趋势，但个人自由意志、所处环境、已做选择都会影响结果。运势是地图，不是轨道。",
        "aEn": "Astrology shows cosmic energy trends, but free will, environment, and past choices all influence outcomes. Your horoscope is a map, not a track.",
        "aId": "Astrologi menunjukkan tren energi kosmik, tapi kehendak bebas, lingkungan, dan pilihan masa lalu mempengaruhi hasil. Horoskop adalah peta, bukan rel."
    },
    {
        "q": "2026年运势什么时候更新？",
        "a": "年度运势在每年生日前后更新（Solar Return）。当日运势每天更新，当月运势每月初更新。",
        "aEn": "Yearly horoscope updates around your birthday (Solar Return). Daily horoscope updates every day, monthly horoscope updates at the beginning of each month.",
        "aId": "Horoskop tahunan diperbarui sekitar ulang tahun Anda (Solar Return). Horoskop harian diperbarui setiap hari, horoskop bulanan di awal bulan."
    },
    {
        "q": "哪个星座运势最准？",
        "a": "所有星座的运势分析精度相同。准确度更多取决于出生信息（尤其是出生时间），而非星座本身。",
        "aEn": "All zodiac signs have the same analysis precision. Accuracy depends more on birth information (especially birth time) than the sign itself.",
        "aId": "Semua tanda zodiak memiliki presisi analisis yang sama. Akurasi lebih tergantung pada informasi kelahiran (terutama waktu kelahiran)."
    }
]

# 构建正确的 FAQ JSX
faq_jsx_items = ""
for i, faq in enumerate(FAQS_CORRECT):
    faq_jsx_items += f"""
                <div className="border border-purple-500/20 rounded-lg overflow-hidden">
                  <button
                    onClick={{() => setFaqOpen({i})}}
                    className="w-full p-4 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <span className="text-sm text-white">{faq['q']}</span>
                    <ChevronDown size={{18}} className={{`text-purple-400 transition-transform ${{faqOpen === {i} ? 'rotate-180' : ''}}`}} />
                  </button>
                  {{faqOpen === {i} && (
                    <div className="p-4 bg-white/5 border-t border-purple-500/10">
                      <p className="text-sm text-slate-300 mb-2">{faq['a']}</p>
                      <p className="text-xs text-slate-500 mb-1"><span className="text-purple-300">EN:</span> {faq['aEn']}</p>
                      <p className="text-xs text-slate-500"><span className="text-purple-300">ID:</span> {faq['aId']}</p>
                    </div>
                  )}}
                </div>"""

# 找到 FAQ 区块并替换
# 策略：找到第一个 `鍙互`（乱码特征）或 `faqOpen` 区段，替换整个 FAQ 区块
# 更稳健：找到 `<section className="max-w-4xl"` 包含 `常见问题` 的区块

# 用正则找到 FAQ section 的开始和结束
faq_section_pattern = r'<section className="max-w-4xl[^>]*>\s*<h2[^>]*>\s*常见问题'
match_start = re.search(faq_section_pattern, content)

if match_start:
    # 找到对应的 </section>
    section_start = match_start.start()
    # 从 section_start 开始找下一个 </section>
    section_end = content.find('</section>', section_start + 100)
    if section_end > section_start:
        section_end += len('</section>')
        # 构建新 FAQ 区块
        new_faq_block = f"""            <section className="max-w-4xl mx-auto mt-16 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                常见问题
              </h2>
              <div className="space-y-3">{faq_jsx_items}
              </div>
            </section>"""
        content = content[:section_start] + new_faq_block + content[section_end:]
        print("Replaced FAQ section")
    else:
        print("ERROR: could not find closing </section>")
else:
    print("ERROR: could not find FAQ section start")

# 写回
with open(FILE, "w", encoding="utf-8", newline="\n") as f:
    f.write(content)

print("Done! horoscope/page.tsx updated.")
