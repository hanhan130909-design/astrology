# -*- coding: utf-8 -*-
"""Add SEO content to horoscope page.tsx"""

with open('src/app/horoscope/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add translations after the existing LABELS object
translations = '''

// SEO Content Translations
const SEO_T = {
  zh: {
    descTitle: '每日、每周、每月运势详解',
    descText1: '运势分析是占星学最受欢迎的应用之一。通过分析当前行星位置与你星座的关系，预测不同时间段的运势变化。',
    descText2: '每日运势关注月亮的移动和当天的行星相位，每周运势则考量行星的短期周期，每月运势则结合太阳、水星、金星等行星在星座中的运行。',
    descText3: '通过了解自己的运势走向，你可以在好运时期把握机遇，在挑战时期做好准备，让生活更加顺遂。',
    faqTitle: '常见问题',
    faq: [
      { q: '每日运势准吗？', a: '每日运势基于月亮和当天的行星相位，反映当天的能量趋势。虽然不能精确预测具体事件，但可以帮助你调整心态和行动策略。' },
      { q: '为什么有时候运势和实际体验不符？', a: '运势是基于太阳星座的普遍性分析，而个人命盘包含上升、月亮等多种因素。精确的运势需要结合你的完整星盘来看。' },
      { q: '每周运势和每月运势有什么不同？', a: '每周运势关注短期行星周期，更具体到日常事务；每月运势则反映更长期的趋势，适合规划重要事项。' },
      { q: '可以参考上升星座的运势吗？', a: '可以！很多人发现同时看太阳星座和上升星座的运势更准确。太阳星座反映核心能量，上升星座反映外在表现。' },
      { q: '运势不好时该怎么办？', a: '运势低迷时不代表一定会有坏事发生。这是适合反思、调整、储备能量的时期。保持积极心态，做好基础工作，等待好运来临。' },
    ],
  },
  en: {
    descTitle: 'Daily, Weekly & Monthly Horoscope Guide',
    descText1: 'Horoscope analysis is one of the most popular applications of astrology. By analyzing the relationship between current planetary positions and your zodiac sign, we forecast fortune changes across different timeframes.',
    descText2: 'Daily horoscopes focus on the Moon\\'s movement and daily planetary aspects. Weekly horoscopes consider short planetary cycles, while monthly horoscopes track the Sun, Mercury, Venus and other planets.',
    descText3: 'By understanding your fortune trends, you can seize opportunities during favorable periods and prepare during challenging times.',
    faqTitle: 'Frequently Asked Questions',
    faq: [
      { q: 'Are daily horoscopes accurate?', a: 'Daily horoscopes are based on the Moon and daily planetary aspects, reflecting the day\\'s energy trends. While they can\\'t precisely predict specific events, they help you adjust your mindset and action strategies.' },
      { q: 'Why do horoscopes sometimes not match my experience?', a: 'Horoscopes are general analyses based on sun signs, while personal charts include rising signs, moon signs, and more. Accurate predictions require your complete birth chart.' },
      { q: 'What is the difference between weekly and monthly horoscopes?', a: 'Weekly horoscopes focus on short-term planetary cycles, more specific to daily matters. Monthly horoscopes reflect longer trends, suitable for planning important events.' },
      { q: 'Can I check my rising sign\\'s horoscope?', a: 'Yes! Many people find checking both sun and rising sign horoscopes more accurate. Sun signs reflect core energy, rising signs reflect outward expression.' },
      { q: 'What should I do when my horoscope is unfavorable?', a: 'Unfavorable periods don\\'t mean bad events will happen. These are times for reflection, adjustment, and energy conservation. Stay positive, do foundational work, and wait for better times.' },
    ],
  },
  id: {
    descTitle: 'Panduan Horoskop Harian, Mingguan & Bulanan',
    descText1: 'Analisis horoskop adalah salah satu aplikasi astrologi paling populer. Dengan menganalisis hubungan antara posisi planet saat ini dan zodiak Anda, kami meramalkan perubahan nasib.',
    descText2: 'Horoskop harian fokus pada pergerakan Bulan dan aspek planet harian. Horoskop mingguan mempertimbangkan siklus planet pendek, sementara horoskop bulanan melacak planet lainnya.',
    descText3: 'Dengan memahami tren nasib Anda, Anda dapat menangkap peluang selama periode menguntungkan dan bersiap selama masa menantang.',
    faqTitle: 'Pertanyaan yang Sering Diajukan',
    faq: [
      { q: 'Apakah horoskop harian akurat?', a: 'Horoskop harian didasarkan pada Bulan dan aspek planet harian, mencerminkan tren energi hari tersebut. Mereka membantu Anda menyesuaikan pola pikir dan strategi tindakan.' },
      { q: 'Mengapa horoskop terkadang tidak cocok dengan pengalaman saya?', a: 'Horoskop adalah analisis umum berdasarkan zodiak, sementara bagan personal termasuk ascenden dan tanda bulan. Prediksi akurat membutuhkan bagan lahir lengkap Anda.' },
      { q: 'Apa perbedaan horoskop mingguan dan bulanan?', a: 'Horoskop mingguan fokus pada siklus planet jangka pendek, lebih spesifik untuk masalah harian. Horoskop bulanan mencerminkan tren lebih panjang.' },
      { q: 'Apakah saya bisa melihat horoskop zodiak ascenden?', a: 'Ya! Banyak orang menemukan melihat horoskop zodiak dan ascenden lebih akurat.' },
      { q: 'Apa yang harus dilakukan saat horoskop tidak menguntungkan?', a: 'Periode tidak menguntungkan tidak berarti peristiwa buruk akan terjadi. Ini adalah waktu untuk refleksi dan konservasi energi.' },
    ],
  },
};
'''

# Add before the component
content = content.replace(
    'export default function HoroscopePage()',
    translations + '\nexport default function HoroscopePage()'
)

# Add language reference for SEO content
content = content.replace(
    'const labels = LABELS[lang] || LABELS.zh;',
    'const labels = LABELS[lang] || LABELS.zh;\n  const seoT = SEO_T[lang] || SEO_T.zh;'
)

# Add SEO section before </main>
seo_section = '''
        {/* SEO Content Section */}
        <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">
          {/* Description */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-700/50">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-amber-400">🌟</span>
              {seoT.descTitle}
            </h2>
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>{seoT.descText1}</p>
              <p>{seoT.descText2}</p>
              <p>{seoT.descText3}</p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-700/50">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-purple-400">❓</span>
              {seoT.faqTitle}
            </h2>
            <div className="space-y-4">
              {seoT.faq.map((item, i) => (
                <details key={i} className="group p-4 rounded-xl bg-slate-800/50 border border-slate-700/30 hover:border-amber-500/30 transition-all cursor-pointer">
                  <summary className="font-medium text-white flex items-center justify-between list-none">
                    <span>{item.q}</span>
                    <span className="text-amber-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-3 text-sm text-slate-400 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
'''

# Insert before </main>
content = content.replace(
    '      </main>\n    </div>\n  );\n}',
    seo_section + '\n      </main>\n    </div>\n  );\n}'
)

with open('src/app/horoscope/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Horoscope page updated successfully!')
