# -*- coding: utf-8 -*-
import sys
import re

page_path = r'C:\Users\user\.qclaw\astrology-clean\src\app\composite\page.tsx'
layout_path = r'C:\Users\user\.qclaw\astrology-clean\src\app\composite\layout.tsx'

with open(page_path, 'r', encoding='utf-8', newline='\n') as f:
    page_content = f.read()

with open(layout_path, 'r', encoding='utf-8', newline='\n') as f:
    layout_content = f.read()

# 1. Add ChevronDown import to page.tsx
old_import = "import { ArrowLeft, Users, Heart, Search, Star } from 'lucide-react';"
new_import = "import { ArrowLeft, Users, Heart, Search, Star, ChevronDown } from 'lucide-react';"
page_content = page_content.replace(old_import, new_import)

# 2. Add useState<number> for FAQ state after existing useState declarations  
old_state = "const [activeTab, setActiveTab] = useState<'composite'|'synastry'>('composite');"
new_state = """const [activeTab, setActiveTab] = useState<'composite'|'synastry'>('composite');
  const [openFaq, setOpenFaq] = useState<number>(0);"""

page_content = page_content.replace(old_state, new_state)

# 3. Find position before </main> to insert FAQ section
# Insert description and FAQ before </main> closing

description_section = '''
        {/* Description Section */}
        <section className="max-w-4xl mx-auto mt-12 mb-8 px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-xl p-5">
              合盘分析通过比较两人出生星盘，揭示关系的深层动力与潜在挑战。组合盘展现共同能量，比较盘呈现相互影响。
            </div>
            <div className="bg-white/5 rounded-xl p-5">
              Composite chart analysis compares two natal charts to reveal deep dynamics and potential challenges. Composite shows shared energy, Synastry shows mutual influences.
            </div>
            <div className="bg-white/5 rounded-xl p-5">
              Analisis bagan komposit membandingkan dua bagan lahir untuk menunjukkan dinamika mendalam dan potensi tantangan. Komposit menunjukkan energi bersama, Sinastri menunjukkan pengaruh mutual.
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto mb-12 px-4">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {language === 'zh' ? '常见问题' : 'FAQ'}
          </h2>
          <div className="space-y-3">
            {[
              { q: '什么是组合盘？', q_en: 'What is a Composite Chart?', q_id: 'Apa itu Bagan Komposit?',
                a: '组合盘是两人星盘的中点星盘，代表关系的独立实体。它揭示这段关系的核心特质、共同主题和潜在发展路径。', 
                a_en: 'The Composite Chart is the mid-point chart of both natal charts, representing the relationship as an independent entity. It reveals the core nature, shared themes, and potential development path.',
                a_id: 'Bagan Komposit adalah bagan titik tengah dari kedua bagan lahir, mereasikan hubungan sebagai entitas independen. Ini menunjukkan sifat inti, tema bersama, dan jalur pengembangan potensial.' },
              { q: '组合盘和比较盘有什么区别？', q_en: 'What is the difference between Composite and Synastry?', q_id: 'Apa perbedaan antara Komposit dan Sinastri?',
                a: '组合盘是两人星盘的中点，代表关系本身；比较盘是两人的行星直接比较，展示行星间的互动和相互影响。', 
                a_en: 'Composite is the mid-point chart representing the relationship itself; Synastry compares planets between the two charts, showing planetary interactions and mutual influences.',
                a_id: 'Komposit adalah bagan titik tengah yang mereasikan hubungan itu sendiri; Sinastri membandingkan planet antara dua bagan, menunjukkan interaksi planet dan pengaruh timbal balik.' },
              { q: '如何解读相位盘？', q_en: 'How to read the Synastry chart?', q_id: 'Bagaimana membaca bagan Sinastri?',
                a: '关注行星之间的相位：和谐相位（六合、三分相）表示顺利互动；挑战相位（四分相、对分相）表示需要克服的张力。', 
                a_en: 'Focus on aspects between planets: harmonious aspects (Sextile, Trine) indicate smooth interactions; challenging aspects (Square, Opposition) indicate tension to work through.',
                a_id: 'Fokus pada aspek antar planet: aspek harmonis (Sextile, Trine) menunjukkan interaksi yang halus; aspek menantang (Square, Opposition) menunjukkan ketegangan yang harus diatasi.' },
              { q: '行星落入宫位代表什么？', q_en: 'What do planets in houses mean?', q_id: 'Apa arti planet di rumah?',
                a: '行星落入的宫位表示关系中该领域的主题。例如金星落入第七宫代表公开关系和婚姻承诺。', 
                a_en: 'The house where a planet falls indicates the area of life this relationship influences. For example, Venus in the 7th house indicates a public relationship and marriage commitment.',
                a_id: 'Rumah tempat planet berada menunjukkan area kehidupan yang dipengaruhi hubungan ini. Misalnya, Venus di rumah ke-7 menunjukkan hubungan publik dan komitmen pernikahan.' },
              { q: '为什么需要准确的出生时间？', q_en: 'Why do we need accurate birth time?', q_id: 'Mengapa kita membutuhkan waktu lahir yang akurat?',
                a: '出生时间影响上升星座和宫位的计算，直接关系到行星落入的宫位。几分钟的误差可能导致行星进入不同宫位。', 
                a_en: 'Birth time affects the calculation of Ascendant and houses, directly affecting which house planets fall in. A few minutes difference can cause planets to fall in different houses.',
                a_id: 'Waktu lahir mempengaruhi perhitungan Ascendant dan rumah, langsung mempengaruhi planet mana yang jatuh di rumah tertentu. Selisih beberapa menit dapat menyebabkan planet jatuh di rumah yang berbeda.' },
            ].map((item, i) => (
              <div key={i} className="border border-purple-500/20 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full px-4 py-3 flex items-center justify-between bg-purple-900/20 hover:bg-purple-900/30 transition-colors text-left"
                >
                  <span className="text-white text-sm">{language === 'zh' ? item.q : (language === 'en' ? item.q_en : item.q_id)}</span>
                  <ChevronDown size={18} className={`text-purple-300 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}/>
                </button>
                {openFaq === i && (
                  <div className="px-4 py-3 bg-purple-950/30 border-t border-purple-500/10">
                    <p className="text-slate-200 text-sm mb-2">{language === 'zh' ? item.a : (language === 'en' ? item.a_en : item.a_id)}</p>
                    <p className="text-slate-400 text-xs">{language === 'zh' ? item.a_en : item.a_id}</p>
                    <p className="text-slate-500 text-xs">{language === 'zh' ? item.a_id : item.a_en}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>'''

# Find where to insert - before </main> closing tag
insert_marker = '      </main>\n    </div>\n  );'
replacement = description_section + '\n      </main>\n    </div>\n  );'
page_content = page_content.replace(insert_marker, replacement)

# Write modified page.tsx
with open(page_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(page_content)

# 4. Add JSON-LD to layout.tsx
json_ld = '''
const jsonLd = {
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
};'''

# Insert jsonLd constant before layout function
old_layout_start = 'export default function Layout({ children }: { children: React.ReactNode }) {'
new_layout_start = json_ld + '\n\nexport default function Layout({ children }: { children: React.ReactNode }) {'
layout_content = layout_content.replace(old_layout_start, new_layout_start)

# Add script tag in the return
old_layout_return = '''export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}'''

new_layout_return = '''export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}'''

layout_content = layout_content.replace(old_layout_return, new_layout_return)

with open(layout_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(layout_content)

print('MODIFICATIONS_COMPLETE')