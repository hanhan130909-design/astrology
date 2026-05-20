# -*- coding: utf-8 -*-
"""Add SEO content to composite page.tsx"""

with open('src/app/composite/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add translations at the top after imports
translations = '''

// SEO Content Translations
const SEO_T = {
  zh: {
    descTitle: '什么是组合盘分析？',
    descText1: '组合盘是关系占星学的核心工具，通过计算两个人星盘的行星位置中点来揭示关系的本质特征。',
    descText2: '组合盘不同于比较盘，它展示的是关系本身的能量结构，而不是两个人之间的互动。组合盘中的太阳位置代表关系的核心目的，月亮位置揭示关系的情感需求。',
    descText3: '通过组合盘分析，你可以更深入理解一段关系的优势和挑战，找到改善关系的方法，了解关系的长期发展方向。',
    faqTitle: '常见问题',
    faq: [
      { q: '组合盘和比较盘有什么区别？', a: '比较盘分析两个人的行星如何互动，而组合盘则是创建一个代表关系本身的虚拟星盘。组合盘揭示关系的整体能量，比较盘则展示具体互动。' },
      { q: '组合盘中哪个行星最重要？', a: '组合盘中的太阳、月亮和上升最重要。太阳代表关系目的，月亮揭示情感需求，上升星座反映关系给他人的印象。' },
      { q: '组合盘可以预测关系的结局吗？', a: '组合盘更多揭示关系能量而非结局。它帮助你理解关系的本质特征和发展方向，但关系走向仍取决于双方的选择和努力。' },
      { q: '组合盘中有不良相位就必须分手吗？', a: '并非如此。组合盘中的紧张相位提示需要努力的方向，很多长期关系都有挑战相位。关键是理解并共同成长。' },
      { q: '如何利用组合盘改善关系？', a: '了解组合盘后，可以发挥优势能量，同时在挑战领域多加努力。比如月亮受克就多关注情感表达，土星紧张就建立稳定结构。' },
    ],
  },
  en: {
    descTitle: 'What is Composite Chart Analysis?',
    descText1: 'Composite charts are a core tool in relationship astrology, revealing the essence of a relationship by calculating midpoints between two people\\'s planetary positions.',
    descText2: 'Composite charts differ from synastry charts. They show the energy structure of the relationship itself, not just the interactions between two people. The Sun position reveals the relationship\\'s core purpose.',
    descText3: 'Through composite chart analysis, you can deeply understand a relationship\\'s strengths and challenges, find ways to improve it, and understand its long-term development direction.',
    faqTitle: 'Frequently Asked Questions',
    faq: [
      { q: 'What is the difference between composite and synastry charts?', a: 'Synastry analyzes how two people\\'s planets interact, while composite creates a virtual chart representing the relationship itself. Composite reveals overall energy; synastry shows specific interactions.' },
      { q: 'Which planet is most important in a composite chart?', a: 'The Sun, Moon, and Ascendant are most important. The Sun represents relationship purpose, the Moon reveals emotional needs, and the Ascendant reflects how others perceive the relationship.' },
      { q: 'Can composite charts predict relationship outcomes?', a: 'Composite charts reveal relationship energy rather than outcomes. They help you understand the relationship\\'s essential characteristics and development direction.' },
      { q: 'Do challenging aspects in composite charts mean we must break up?', a: 'Not necessarily. Challenging aspects indicate areas needing effort. Many long-term relationships have difficult aspects. The key is understanding and growing together.' },
      { q: 'How can I use composite charts to improve my relationship?', a: 'After understanding the composite chart, leverage strengths while putting effort into challenging areas. If the Moon is afflicted, focus more on emotional expression.' },
    ],
  },
  id: {
    descTitle: 'Apa itu Analisis Bagan Komposit?',
    descText1: 'Bagan komposit adalah alat utama dalam astrologi hubungan, mengungkapkan esensi hubungan dengan menghitung titik tengah posisi planet dua orang.',
    descText2: 'Bagan komposit berbeda dari bagan sinastri. Mereka menunjukkan struktur energi hubungan itu sendiri, bukan hanya interaksi antara dua orang. Posisi Matahari mengungkapkan tujuan inti hubungan.',
    descText3: 'Melalui analisis bagan komposit, Anda dapat memahami secara mendalam kekuatan dan tantangan hubungan, menemukan cara untuk memperbaikinya.',
    faqTitle: 'Pertanyaan yang Sering Diajukan',
    faq: [
      { q: 'Apa perbedaan antara bagan komposit dan sinastri?', a: 'Sinastri menganalisis bagaimana planet dua orang berinteraksi, sementara komposit membuat bagan virtual yang mewakili hubungan itu sendiri.' },
      { q: 'Planet mana yang paling penting dalam bagan komposit?', a: 'Matahari, Bulan, dan Ascenden paling penting. Matahari mewakili tujuan hubungan, Bulan mengungkapkan kebutuhan emosional.' },
      { q: 'Apakah bagan komposit dapat memprediksi hasil hubungan?', a: 'Bagan komposit mengungkapkan energi hubungan daripada hasil. Mereka membantu Anda memahami karakteristik esensi hubungan.' },
      { q: 'Apakah aspek menantang berarti harus berpisah?', a: 'Tidak harus. Aspek menantang menunjukkan area yang butuh usaha. Banyak hubungan jangka panjang memiliki aspek sulit.' },
      { q: 'Bagaimana cara menggunakan bagan komposit untuk meningkatkan hubungan?', a: 'Setelah memahami bagan komposit, manfaatkan kekuatan sambil berusaha di area yang menantang.' },
    ],
  },
};
'''

# Add translations before the component
content = content.replace(
    'export default function CompositePage()',
    translations + '\nexport default function CompositePage()'
)

# Find the language constant and add SEO_T reference
content = content.replace(
    'const { language } = useLanguage();',
    'const { language } = useLanguage();\n  const seoT = SEO_T[language] || SEO_T.zh;'
)

# Add SEO section before </main>
seo_section = '''
        {/* SEO Content Section */}
        <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">
          {/* Description */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-700/50">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-pink-400">💑</span>
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
              <span className="text-amber-400">❓</span>
              {seoT.faqTitle}
            </h2>
            <div className="space-y-4">
              {seoT.faq.map((item, i) => (
                <details key={i} className="group p-4 rounded-xl bg-slate-800/50 border border-slate-700/30 hover:border-pink-500/30 transition-all cursor-pointer">
                  <summary className="font-medium text-white flex items-center justify-between list-none">
                    <span>{item.q}</span>
                    <span className="text-pink-400 group-open:rotate-180 transition-transform">▼</span>
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

with open('src/app/composite/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Composite page updated successfully!')
