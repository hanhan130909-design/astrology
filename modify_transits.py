# -*- coding: utf-8 -*-
import re

# Read the original file
with open('src/app/transits/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add translations to T object - find the T object and add new translations
# First, let's add the FAQ and description translations
# We need to find where to add them in the translation section

# Add translations after the existing translation code
translations_to_add = '''

// Translations for SEO content
const SEO_T = {
  zh: {
    descTitle: '什么是行星推运？',
    descText1: '行星推运是占星学中预测命运趋势的重要方法。通过对比当前行星位置与出生星盘的相位关系，可以预测未来一段时间内的运势变化。',
    descText2: '推运分析能帮助你了解当前行星能量如何影响你的生活。当木星推运与本命行星形成吉相位时，往往带来好运与机遇；而土星推运则提醒你面对挑战、承担责任。',
    descText3: '通过定期查看推运星盘，你可以把握重要时机，做出更明智的人生决策。每颗行星的推运周期不同，从月亮的月周期到冥王星的长达数年的周期。',
    faqTitle: '常见问题',
    faq: [
      { q: '行星推运多久看一次比较合适？', a: '建议每月查看一次主要行星推运，每年进行一次全面的推运分析。重大决定前查看推运可以帮助你选择最佳时机。' },
      { q: '哪些行星的推运影响最大？', a: '土星和木星的推运影响最为显著。土星约29年完成一个周期，木星约12年，它们的相位变化标志着人生重要转折点。' },
      { q: '推运相位中的合相、四分相、三分相分别代表什么？', a: '合相表示能量融合，是开启新周期的时机；四分相带来挑战与成长机会；三分相则是顺遂的支持能量。' },
      { q: '推运分析可以预测具体事件吗？', a: '推运更多揭示能量趋势而非具体事件。它告诉你何时适合行动、何时需要谨慎，但具体事件还取决于个人选择。' },
      { q: '如何利用推运改善生活？', a: '了解当前推运能量后，可以在有利时期积极行动，在挑战时期储备能量。比如木星推运时扩大发展，土星推运时稳扎稳打。' },
    ],
  },
  en: {
    descTitle: 'What are Planetary Transits?',
    descText1: 'Planetary transits are a key astrological method for predicting life trends. By comparing current planetary positions with your natal chart, you can forecast upcoming fortune changes.',
    descText2: 'Transit analysis helps you understand how current planetary energies affect your life. When transiting Jupiter forms harmonious aspects to natal planets, it often brings luck and opportunities.',
    descText3: 'Regular transit chart reviews help you seize important timing and make wiser life decisions. Each planet has different transit cycles, from the Moon\\'s monthly cycle to Pluto\\'s multi-year cycles.',
    faqTitle: 'Frequently Asked Questions',
    faq: [
      { q: 'How often should I check my transits?', a: 'We recommend checking major planetary transits monthly and doing a comprehensive transit analysis yearly. Checking transits before big decisions helps you choose optimal timing.' },
      { q: 'Which planetary transits have the greatest impact?', a: 'Saturn and Jupiter transits are most significant. Saturn completes a cycle in about 29 years, Jupiter in about 12 years - their aspect changes mark important life turning points.' },
      { q: 'What do conjunction, square, and trine aspects mean in transits?', a: 'Conjunctions represent energy fusion and new cycle beginnings; squares bring challenges and growth opportunities; trines provide smooth supportive energy.' },
      { q: 'Can transit analysis predict specific events?', a: 'Transits reveal energy trends rather than specific events. They tell you when to act and when to be cautious, but specific outcomes depend on personal choices.' },
      { q: 'How can I use transits to improve my life?', a: 'After understanding current transit energies, act during favorable periods and conserve energy during challenging times. Expand during Jupiter transits, build steadily during Saturn transits.' },
    ],
  },
  id: {
    descTitle: 'Apa itu Transit Planet?',
    descText1: 'Transit planet adalah metode astrologi utama untuk memprediksi tren kehidupan. Dengan membandingkan posisi planet saat ini dengan bagan lahir, Anda dapat meramalkan perubahan nasib mendatang.',
    descText2: 'Analisis transit membantu Anda memahami bagaimana energi planet saat ini memengaruhi hidup Anda. Ketika transit Jupiter membentuk aspek harmonis dengan planet natal, sering membawa keberuntungan dan peluang.',
    descText3: 'Tinjauan bagan transit teratur membantu Anda menangkap waktu penting dan membuat keputusan hidup yang lebih bijak. Setiap planet memiliki siklus transit berbeda.',
    faqTitle: 'Pertanyaan yang Sering Diajukan',
    faq: [
      { q: 'Seberapa sering saya harus memeriksa transit?', a: 'Kami sarankan memeriksa transit planet utama bulanan dan melakukan analisis transit komprehensif tahunan.' },
      { q: 'Transit planet mana yang berdampak terbesar?', a: 'Transit Saturnus dan Jupiter paling signifikan. Saturnus menyelesaikan siklus sekitar 29 tahun, Jupiter sekitar 12 tahun.' },
      { q: 'Apa arti konjungsi, kotak, dan trine dalam transit?', a: 'Konjungsi mewakili fusi energi dan awal siklus baru; kotak membawa tantangan dan peluang pertumbuhan; trine memberikan energi dukungan yang lancar.' },
      { q: 'Apakah analisis transit dapat memprediksi peristiwa spesifik?', a: 'Transit mengungkapkan tren energi daripada peristiwa spesifik. Mereka memberi tahu kapan harus bertindak dan kapan harus berhati-hati.' },
      { q: 'Bagaimana saya bisa menggunakan transit untuk meningkatkan hidup?', a: 'Setelah memahami energi transit saat ini, bertindak selama periode menguntungkan dan hemat energi selama masa menantang.' },
    ],
  },
};
'''

# Find the last const declaration before the component and add translations
content = content.replace(
    'export default function TransitPage()',
    translations_to_add + '\nexport default function TransitPage()'
)

# Now find the end of the component to add the SEO section
# Add before the closing </main> tag in the return statement

seo_section = '''
        {/* SEO Content Section */}
        <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">
          {/* Description */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-700/50">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">🔭</span>
              {SEO_T[language].descTitle}
            </h2>
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>{SEO_T[language].descText1}</p>
              <p>{SEO_T[language].descText2}</p>
              <p>{SEO_T[language].descText3}</p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-700/50">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-amber-400">❓</span>
              {SEO_T[language].faqTitle}
            </h2>
            <div className="space-y-4">
              {SEO_T[language].faq.map((item, i) => (
                <details key={i} className="group p-4 rounded-xl bg-slate-800/50 border border-slate-700/30 hover:border-purple-500/30 transition-all cursor-pointer">
                  <summary className="font-medium text-white flex items-center justify-between list-none">
                    <span>{item.q}</span>
                    <span className="text-purple-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-3 text-sm text-slate-400 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
'''

# Insert before </main> tag
content = content.replace(
    '      </main>\n    </div>\n  );\n}',
    seo_section + '\n      </main>\n    </div>\n  );\n}'
)

# Write the modified content
with open('src/app/transits/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Transits page updated successfully!')
