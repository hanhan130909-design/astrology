#!/usr/bin/env python3
import re

BASE = r"C:\Users\user\.qclaw\astrology-clean\src\app"

# === 1. TRANSITS page.tsx: Replace existing SEO description with new format ===
transits_page = f"{BASE}/transits/page.tsx"
with open(transits_page, 'r', encoding='utf-8') as f:
    content = f.read()

old_desc = '''        {/* SEO Description Section */}
        <section className="max-w-4xl mx-auto mt-12 mb-8 px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-xl p-5">
              <h3 className="text-purple-300 font-bold mb-2">行星推运分析</h3>
              <p className="text-slate-300 text-sm leading-relaxed">行星推运是占星学中预测运势的重要方法。通过分析天空中运行行星与你本命盘的相位关系，揭示人生不同阶段的机遇与挑战，帮助你把握时机、趋吉避凶。</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5">
              <h3 className="text-cyan-300 font-bold mb-2">Planetary Transit Analysis</h3>
              <p className="text-slate-300 text-sm leading-relaxed">Planetary transit is a key astrological method for fortune prediction. By analyzing aspects between moving planets and your natal chart, it reveals opportunities and challenges at different life stages, helping you seize opportunities and navigate wisely.</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5">
              <h3 className="text-amber-300 font-bold mb-2">Analisis Transit Planet</h3>
              <p className="text-slate-300 text-sm leading-relaxed">Transit planet adalah metode astrologi penting untuk prediksi keberuntungan. Dengan menganalisis aspek antara planet yang bergerak dan grafik natal Anda, ini mengungkap peluang dan tantangan di berbagai tahap kehidupan.</p>
            </div>
          </div>
        </section>'''

new_desc = '''        {/* SEO Description Section */}
        <section className="max-w-4xl mx-auto mt-12 mb-8 px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">中文</h3>
              <p className="text-purple-200/80 text-sm leading-relaxed">推运盘（Transit Chart）是占星预测的核心工具。通过将当前行星位置覆盖在本命盘上，了解当下能量影响和未来转折点。AI 结合本命盘解读重要推运时间和影响领域。</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">English</h3>
              <p className="text-purple-200/80 text-sm leading-relaxed">The Transit Chart is a core tool for astrological forecasting. By overlaying current planetary positions onto your natal chart, you can understand present energy influences and future turning points. AI combines natal chart analysis to interpret key transit timings and affected life areas.</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Bahasa Indonesia</h3>
              <p className="text-purple-200/80 text-sm leading-relaxed">Transit Chart adalah alat inti untuk peramalan astrologi. Dengan menumpangkan posisi planet saat ini ke chart natal Anda, Anda dapat memahami pengaruh energi saat ini dan titik balik di masa depan. AI menggabungkan analisis chart natal untuk menafsirkan waktu transit penting dan area kehidupan yang terpengaruh.</p>
            </div>
          </div>
        </section>'''

content = content.replace(old_desc, new_desc)
with open(transits_page, 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)
print("Updated transits/page.tsx")

# === 2. COMPOSITE page.tsx: Insert description before FAQ ===
composite_page = f"{BASE}/composite/page.tsx"
with open(composite_page, 'r', encoding='utf-8') as f:
    content = f.read()

composite_desc = '''        {/* SEO Description Section */}
        <section className="max-w-4xl mx-auto mt-12 mb-8 px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">中文</h3>
              <p className="text-purple-200/80 text-sm leading-relaxed">合盘（Composite Chart）揭示两人关系的灵魂蓝图。计算两人星盘中点，生成代表「关系本身」的星盘。了解深层动力、潜在挑战，AI 提供实用建议。</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">English</h3>
              <p className="text-purple-200/80 text-sm leading-relaxed">The Composite Chart reveals the soul blueprint of a relationship. By calculating midpoints between two natal charts, it generates a chart representing the relationship itself. Understand deep dynamics, potential challenges, and get AI-powered practical advice.</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Bahasa Indonesia</h3>
              <p className="text-purple-200/80 text-sm leading-relaxed">Composite Chart mengungkap cetak biru jiwa sebuah hubungan. Dengan menghitung titik tengah antara dua chart natal, menghasilkan chart yang mewakili hubungan itu sendiri. Pahami dinamika mendalam, tantangan potensial, dan dapatkan saran praktis berbasis AI.</p>
            </div>
          </div>
        </section>

'''

content = content.replace('        {/* FAQ Section */}\n', composite_desc + '        {/* FAQ Section */}\n', 1)
with open(composite_page, 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)
print("Updated composite/page.tsx")

# === 3. HOROSCOPE page.tsx: Insert description before FAQ ===
horoscope_page = f"{BASE}/horoscope/page.tsx"
with open(horoscope_page, 'r', encoding='utf-8') as f:
    content = f.read()

horoscope_desc = '''        {/* SEO Description Section */}
        <section className="max-w-4xl mx-auto mt-12 mb-8 px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">中文</h3>
              <p className="text-purple-200/80 text-sm leading-relaxed">占星运势提供基于真实天文计算的个性化指引。根据完整出生信息（日期、时间、地点）结合当前行星运行，给出真正属于你的能量趋势。支持日运、月运和年度运势（Solar Return）。</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">English</h3>
              <p className="text-purple-200/80 text-sm leading-relaxed">Astrological horoscopes provide personalized guidance based on real astronomical calculations. Using complete birth information (date, time, location) combined with current planetary movements, it delivers energy trends truly yours. Supports daily, monthly, and yearly forecasts (Solar Return).</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Bahasa Indonesia</h3>
              <p className="text-purple-200/80 text-sm leading-relaxed">Horoskop astrologi memberikan panduan personal berdasarkan perhitungan astronomi nyata. Menggunakan informasi kelahiran lengkap (tanggal, waktu, lokasi) dikombinasikan dengan pergerakan planet saat ini, memberikan tren energi yang benar-benar milik Anda. Mendukung ramalan harian, bulanan, dan tahunan (Solar Return).</p>
            </div>
          </div>
        </section>

'''

content = content.replace('        {/* FAQ Section */}\n', horoscope_desc + '        {/* FAQ Section */}\n', 1)
with open(horoscope_page, 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)
print("Updated horoscope/page.tsx")

# === 4. TRANSITS layout.tsx: Add JSON-LD ===
transits_layout = f"{BASE}/transits/layout.tsx"
with open(transits_layout, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "  return children;",
    '''  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Transit Chart Analysis",
            description: "The Transit Chart is a core tool for astrological forecasting. By overlaying current planetary positions onto your natal chart, understand present energy influences and future turning points.",
            provider: { "@type": "Organization", name: "星缘", url: "https://lunaxstar.com" }
          })
        }}
      />
      {children}
    </>
  );'''
)
with open(transits_layout, 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)
print("Updated transits/layout.tsx")

# === 5. COMPOSITE layout.tsx: Replace JSON-LD with WebPage + provider format ===
composite_layout = f"{BASE}/composite/layout.tsx"
with open(composite_layout, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '''const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Composite Chart Analysis",
  "description": "Free professional Composite Chart and Synastry analysis for relationship astrology interpretation.",
  "applicationCategory": "EntertainmentApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};''',
    ''  # remove old jsonLd const
)

content = content.replace(
    '''    <>
      {children}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>''',
    '''    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Composite Chart Analysis",
            description: "The Composite Chart reveals the soul blueprint of a relationship. By calculating midpoints between two natal charts, understand deep dynamics and potential challenges with AI-powered advice.",
            provider: { "@type": "Organization", name: "星缘", url: "https://lunaxstar.com" }
          })
        }}
      />
      {children}
    </>'''
)
with open(composite_layout, 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)
print("Updated composite/layout.tsx")

# === 6. HOROSCOPE layout.tsx: Update JSON-LD to include provider ===
horoscope_layout = f"{BASE}/horoscope/layout.tsx"
with open(horoscope_layout, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '''          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Daily, Monthly & Yearly Horoscope",
            "description": "Free daily, monthly and yearly horoscope forecasts for all 12 zodiac signs. Accurate astrology predictions covering love, career, health and finance.",
            "url": "https://starryfate.app/horoscope",
            "mainEntity": {
              "@type": "Article",
              "headline": "Daily Horoscope - Zodiac Fortune Forecast",
              "description": "Comprehensive daily horoscope analysis for all 12 zodiac signs",
              "author": {
                "@type": "Organization",
                "name": "Starry Fate"
              }
            },
            "speakable": {
              "@type": "SpeakableSpecification",
              "cssSelector": ["h1", "h2", ".horoscope-content"]
            }
          })''',
    '''          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Daily, Monthly & Yearly Horoscope",
            description: "Astrological horoscopes provide personalized guidance based on real astronomical calculations. Using complete birth information combined with current planetary movements, delivers energy trends truly yours. Supports daily, monthly, and yearly forecasts (Solar Return).",
            provider: { "@type": "Organization", name: "星缘", url: "https://lunaxstar.com" }
          })'''
)
with open(horoscope_layout, 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)
print("Updated horoscope/layout.tsx")

print("\nAll files updated!")
