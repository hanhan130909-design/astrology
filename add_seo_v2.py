#!/usr/bin/env python3
"""
SEO Enhancement Script v2 - Astrology Clean Project
Adds FAQ sections, description sections to page.tsx files
"""

import os

BASE_PATH = r'C:\Users\user\.qclaw\astrology-clean\src\app'

def read_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def insert_before_main_end(content, insert_html):
    """Insert HTML before </main> tag"""
    pos = content.rfind('</main>')
    if pos == -1:
        return None
    return content[:pos] + insert_html + '\n' + content[pos:]

def get_transits_faq():
    """Get FAQ data for transits page"""
    return {
        'zh': [
            ('什么是推运盘？', '推运盘是观测当前行星位置与你出生本命盘的互动关系。它揭示了当前宇宙能量如何影响你的生活各个领域，是预测时机和趋势的重要工具。'),
            ('推运盘准确吗？', '推运盘基于精确的天文计算，显示行星运行的真实位置。虽然不能决定命运，但能揭示能量趋势和有利时机，准确率很高。'),
            ('如何解读推运相位？', '推运相位是当前行星与你本命行星的角度关系。和谐相位（三分、六分）带来顺利能量，紧张相位（四分、对分）提示挑战和成长机会。'),
            ('推运盘可以预测什么？', '推运盘可以预测情感趋势、事业机会、财务变化、健康周期等。特别适合选择重要决策的最佳时机，如换工作、结婚、投资等。'),
            ('多久查看一次推运盘？', '建议每月或重要决策前查看。也可以针对特定日期（如面试、签约日）生成推运盘，选择最有利的时间行动。'),
        ],
        'en': [
            ('What is a transit chart?', 'A transit chart observes the interaction between current planetary positions and your natal chart. It reveals how current cosmic energies affect various life areas, an important tool for predicting timing and trends.'),
            ('How accurate is transit chart?', 'Transit charts are based on precise astronomical calculations showing real planetary positions. While they cannot determine fate, they reveal energy trends and favorable timing with high accuracy.'),
            ('How to interpret transit aspects?', 'Transit aspects are angular relationships between current planets and your natal planets. Harmonious aspects (trine, sextile) bring smooth energy, challenging aspects (square, opposition) indicate challenges and growth opportunities.'),
            ('What can transit chart predict?', 'Transit charts can predict emotional trends, career opportunities, financial changes, health cycles, etc. Especially suitable for choosing optimal timing for important decisions like job changes, marriage, investments.'),
            ('How often should I check transit chart?', 'It is recommended to check monthly or before important decisions. You can also generate transit charts for specific dates to choose the most favorable timing.'),
        ],
        'id': [
            ('Apa itu bagan transit?', 'Bagan transit mengamati interaksi antara posisi planet saat ini dan bagan natal Anda. Ini mengungkap bagaimana energi kosmik saat ini mempengaruhi berbagai area kehidupan.'),
            ('Seberapa akurat bagan transit?', 'Bagan transit berdasarkan pada perhitungan astronomi yang presisi. Meskipun tidak dapat menentukan takdir, mereka mengungkap tren energi dengan akurasi tinggi.'),
            ('Bagaimana cara membaca aspek transit?', 'Aspek transit adalah hubungan sudut antara planet saat ini dan planet natal Anda. Aspek harmonis membawa energi yang lancar, aspek menantang menunjukkan tantangan.'),
            ('Apa yang dapan diprediksi dengan bagan transit?', 'Bagan transit dapan memprediksi tren emosional, peluang karir, perubahan keuangan. Sangat cocok untuk memilih waktu optimal.'),
            ('Seberapa sering saya harus memeriksa bagan transit?', 'Disarankan untuk memeriksa setiap bulan atau sebelum keputusan penting. Anda dapan membuat bagan transit untuk tanggal tertentu.'),
        ]
    }

def get_composite_faq():
    """Get FAQ data for composite page"""
    return {
        'zh': [
            ('什么是合盘？', '合盘是将两个人的出生星盘合并，创建一个代表这段关系本身的全新星盘。它揭示了关系的核心本质、共同主题和潜在发展方向。'),
            ('合盘与比较盘有什么区别？', '比较盘展示两人星盘之间的互动；合盘则是创建全新的关系星盘，更侧重于关系本身而非个人。'),
            ('如何解读合盘中的行星位置？', '合盘中的行星位置代表关系在不同生活领域的表达方式。例如，金星在某个宫位显示关系如何表达爱意。'),
            ('合盘准吗？需要两个人的准确出生时间吗？', '合盘需要两个人的完整出生信息。出生时间越精确，合盘分析越准确，尤其是上升点和宫位划分。'),
            ('合盘适合分析哪些关系？', '合盘适合分析任何重要关系：情侣、夫妻、商业伙伴、团队成员等。它帮助你理解关系的动力、优势和挑战。'),
        ],
        'en': [
            ('What is a composite chart?', 'A composite chart merges two people\'s birth charts to create a brand new chart representing the relationship itself.'),
            ('What is the difference between composite and synastry?', 'Synastry shows interactions between two charts; composite creates a brand new relationship chart, focusing more on the relationship itself.'),
            ('How to interpret planetary positions in composite chart?', 'Planetary positions in composite chart represent how the relationship expresses itself in different life areas.'),
            ('Is composite chart accurate? Need accurate birth times for both?', 'Composite chart needs complete birth information for both people. The more precise the birth time, the more accurate the analysis.'),
            ('What relationships is composite chart suitable for?', 'Composite chart is suitable for analyzing any important relationship: couples, spouses, business partners, team members, etc.'),
        ],
        'id': [
            ('Apa itu bagan komposit?', 'Bagan komposit menggabungkan dua bagan kelahiran untuk membuat bagan baru yang mewakili hubungan itu sendiri.'),
            ('Apa perbedaan antara komposit dan sinastri?', 'Sinastri menunjukkan interaksi antara dua bagan; komposit membuat bagan hubungan baru.'),
            ('Bagaimana cara membaca posisi planet di bagan komposit?', 'Posisi planet di bagan komposit mewakili bagaimana hubungan mengekspresikan dirinya.'),
            ('Apakah bagan komposit akurat? Perlu waktu kelahiran yang akurat?', 'Bagan komposit membutuhkan informasi kelahiran lengkap untuk kedua orang.'),
            ('Hubungan apa yang cocok untuk dianalisis dengan bagan komposit?', 'Bagan komposit cocok untuk menganalisis hubungan penting apa pun.'),
        ]
    }

def get_horoscope_faq():
    """Get FAQ data for horoscope page"""
    return {
        'zh': [
            ('每日运势是怎么计算的？', '我们的每日运势基于西方占星学的行星位置和星座特征。结合太阳位置、月亮相位、个人星座特质等因素，给出综合性的运势分析。'),
            ('运势预测准确吗？', '运势预测揭示的是能量趋势和潜在可能性，而非绝对命运。它可以作为生活决策的参考，但最终选择仍在你自己手中。'),
            ('为什么不同星座的运势不同？', '每个星座对应不同的元素、守护星和性格特质。当行星运行到不同位置时，对各星座的影响自然不同。'),
            ('运势中的幸运色和幸运数字有什么用？', '幸运色和幸运数字源自占星学中的振动频率理论。在对应的时间使用这些元素，可以帮助你与当天的宇宙能量更好地调和。'),
            ('可以相信每日运势吗？', '每日运势是一种有趣的自我反思工具。它可以启发你关注生活中的特定领域，但不必过于依赖。'),
        ],
        'en': [
            ('How is daily horoscope calculated?', 'Our daily horoscope is based on Western astrology\'s planetary positions and zodiac sign characteristics.'),
            ('Is fortune prediction accurate?', 'Fortune prediction reveals energy trends and potential possibilities, not absolute fate.'),
            ('Why are fortunes different for different signs?', 'Each sign corresponds to different elements, ruling planets, and personality traits.'),
            ('What are lucky colors and numbers for?', 'Lucky colors and numbers originate from vibration frequency theory in astrology.'),
            ('Can I trust daily horoscope?', 'Daily horoscope is an interesting self-reflection tool. Don\'t rely too much on it.'),
        ],
        'id': [
            ('Bagaimana horoskop harian dihitung?', 'Horoskop harian kami berdasarkan pada posisi planet dan karakteristik tanda zodiak.'),
            ('Apakah prediksi fortuna akurat?', 'Prediksi fortuna mengungkap tren energi dan kemungkinan potensial, bukan takdir mutlak.'),
            ('Mengapa fortuna berbeda untuk tanda yang berbeda?', 'Setiap tanda berhubungan dengan elemen yang berbeda dan planet penguasa.'),
            ('Untuk apa warna dan angka keberuntungan?', 'Warna dan angka keberuntungan berasal dari teori frekuensi getaran.'),
            ('Bolehkah saya percaya horoskop harian?', 'Horoskop harian adalah alat refleksi diri yang menarik.'),
        ]
    }

def build_faq_html(faq_data):
    """Build FAQ section HTML/JSX"""
    html = '''        {/* SEO FAQ Section */}
        <div className="mt-12 mb-8 p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold mb-6 text-purple-300">
            {language === 'zh' ? '常见问题' : language === 'id' ? 'Pertanyaan yang Sering Diajukan' : 'Frequently Asked Questions'}
          </h2>
          <div className="space-y-4">
'''
    
    for i in range(5):
        html += f'''            <details key={{i}} className="group p-4 rounded-xl bg-white/5 border border-white/10">
              <summary className="cursor-pointer font-medium text-white list-none flex items-center justify-between">
                <span>{{{{ language === 'zh' ? '{faq_data["zh"][i][0]}' : language === 'id' ? '{faq_data["id"][i][0]}' : '{faq_data["en"][i][0]}' }}}}</span>
                <ChevronDown size={{16}} className="text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-3 text-slate-300 text-sm leading-relaxed">{{{{ language === 'zh' ? '{faq_data["zh"][i][1]}' : language === 'id' ? '{faq_data["id"][i][1]}' : '{faq_data["en"][i][1]}' }}}}</p>
            </details>
'''
    
    html += '''          </div>
        </div>
'''
    return html

def process_transits_page():
    """Process transits/page.tsx"""
    filepath = os.path.join(BASE_PATH, 'transits', 'page.tsx')
    print(f"Processing {filepath}...")
    
    if not os.path.exists(filepath):
        print(f"  ERROR: File not found")
        return False
    
    content = read_file(filepath)
    
    # Add description section after the header
    desc_html = '''
        {/* SEO Description Section */}
        {!chart && (
          <div className="mb-6 p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <p className="text-slate-300 text-sm leading-relaxed">{{{{ language === 'zh' ? '行星推运是占星学中最实用的预测技术之一。通过观测当前行星位置与你出生星盘的互动，可以精准把握人生重要时机。' : language === 'id' ? 'Transit planet adalah teknik prediksi paling praktis dalam astrologi. Dengan mengamati interaksi posisi planet saat ini dengan bagan lahir Anda, Anda dapan memahami waktu penting dalam hidup.' : 'Planetary transit is one of the most practical predictive techniques in astrology. By observing the interaction between current planetary positions and your birth chart, you can precisely grasp important life timings.' }}}}</p>
            <p className="text-slate-300 text-sm leading-relaxed">{{{{ language === 'zh' ? '我们的推运分析工具使用专业天文算法，精确计算行运行星与本命行星的相位关系。无论你是想了解近期运势，还是为重要决策选择最佳时机，推运盘都能给你有价值的指引。' : language === 'id' ? 'Alat analisis transit kami menggunakan algoritma astronomi profesional. Apakah Anda ingin memahami fortuna jangka pendek, atau memilih waktu terbaik untuk keputusan penting, bagan transit dapan memberikan panduan.' : 'Our transit analysis tool uses professional astronomical algorithms. Whether you want to understand recent fortune or choose the best timing for important decisions, transit charts can provide valuable guidance.' }}}}</p>
            <p className="text-slate-400 text-sm leading-relaxed">{{{{ language === 'zh' ? '立即输入你的出生信息，选择推运日期，免费生成专业推运分析。支持多语言，随时随地查看你的宇宙能量趋势。' : language === 'id' ? 'Segera masukkan informasi kelahiran Anda, pilih tanggal transit, dan buat analisis transit profesional secara gratis. Mendukung multi-bahasa.' : 'Enter your birth information now, select transit date, and generate professional transit analysis for free. Supports multiple languages.' }}}}</p>
          </div>
        )}}
'''
    
    # Insert description after the header section
    header_end = content.find('</div>\n      </div>\n\n      <main')
    if header_end == -1:
        print(f"  WARNING: Could not find insertion point for description")
    else:
        # Find position after header
        pos = content.find('<main', header_end)
        if pos != -1:
            # Find end of first section after main
            end_first_section = content.find('</div>\n      {', pos)
            if end_first_section != -1:
                content = content[:end_first_section] + desc_html + '\n' + content[end_first_section:]
    
    # Add FAQ section before </main>
    faq_data = get_transits_faq()
    faq_html = build_faq_html(faq_data)
    
    result = insert_before_main_end(content, faq_html)
    if result is None:
        print(f"  ERROR: Could not find </main> tag")
        return False
    
    write_file(filepath, result)
    print(f"  SUCCESS: Added FAQ and description to transits/page.tsx")
    return True

def process_composite_page():
    """Process composite/page.tsx"""
    filepath = os.path.join(BASE_PATH, 'composite', 'page.tsx')
    print(f"Processing {filepath}...")
    
    if not os.path.exists(filepath):
        print(f"  ERROR: File not found")
        return False
    
    content = read_file(filepath)
    
    # Add description section
    desc_html = '''
        {/* SEO Description Section */}
        <div className="mb-6 p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <p className="text-slate-300 text-sm leading-relaxed">{{{{ language === 'zh' ? '双人合盘分析是关系占星学的核心工具。通过创建代表关系本身的合盘，以及展示两人互动的比较盘，全方位解读你们的关系动力。' : language === 'id' ? 'Analisis bagan ganda adalah alat inti dalam astrologi hubungan. Dengan membuat bagan komposit yang mewakili hubungan itu sendiri, membaca dinamika hubungan Anda.' : 'Dual chart analysis is the core tool in relationship astrology. By creating a composite chart representing the relationship itself, comprehensively interpret your relationship dynamics.' }}}}</p>
          <p className="text-slate-300 text-sm leading-relaxed">{{{{ language === 'zh' ? '无论你是想了解恋爱关系的兼容性、商业伙伴的合作潜力，还是团队成员的协作模式，我们的免费合盘工具都能提供深度洞察。输入双方的出生信息，立即生成专业的合盘分析。' : language === 'id' ? 'Apakah Anda ingin memahami kompatibilitas hubungan, potensi kerjasama, alat komposit gratis kami dapan memberikan wawasan mendalam. Masukkan informasi kelahiran keduanya.' : 'Whether you want to understand romantic relationship compatibility or business partner collaboration potential, our free composite tool can provide deep insights. Enter both parties\' birth information.' }}}}</p>
          <p className="text-slate-400 text-sm leading-relaxed">{{{{ language === 'zh' ? '支持多种分宫制选择，精准计算行星位置和相位。让星辰为你揭示关系的真相与潜力。' : language === 'id' ? 'Mendukung pilihan sistem rumah yang berbagai. Biarkan bintang-bintang mengungkap kebenaran dan potensi hubungan.' : 'Supports multiple house system options. Let the stars reveal the truth and potential of your relationship.' }}}}</p>
        </div>
'''
    
    # Insert after header
    header_end = content.find('</div>\n      </div>\n\n      <main')
    if header_end == -1:
        print(f"  WARNING: Could not find insertion point for description")
    else:
        pos = content.find('<main', header_end)
        if pos != -1:
            end_first_section = content.find('{/*', pos)
            if end_first_section != -1:
                content = content[:end_first_section] + desc_html + '\n' + content[end_first_section:]
    
    # Add FAQ
    faq_data = get_composite_faq()
    faq_html = build_faq_html(faq_data)
    
    result = insert_before_main_end(content, faq_html)
    if result is None:
        print(f"  ERROR: Could not find </main> tag")
        return False
    
    write_file(filepath, result)
    print(f"  SUCCESS: Added FAQ and description to composite/page.tsx")
    return True

def process_horoscope_page():
    """Process horoscope/page.tsx"""
    filepath = os.path.join(BASE_PATH, 'horoscope', 'page.tsx')
    print(f"Processing {filepath}...")
    
    if not os.path.exists(filepath):
        print(f"  ERROR: File not found")
        return False
    
    content = read_file(filepath)
    
    # Add description section after the tab switching section
    desc_html = '''
        {/* SEO Description Section */}
        {!showDropdown && (
          <div className="mb-6 p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <p className="text-slate-300 text-sm leading-relaxed">{{{{ language === 'zh' ? '探索12星座的每日、每周和每月运势。我们的免费运势分析涵盖爱情、事业、财运和健康四大领域，帮助你把握生活节奏，做出更好决策。' : language === 'id' ? 'Jelajahi horoskop harian, mingguan, dan bulanan untuk 12 tanda zodiak. Analisis horoskop gratis kami mencakup empat area: cinta, karir, keuangan, dan kesehatan.' : 'Explore daily, weekly, and monthly horoscope for all 12 zodiac signs. Our free horoscope analysis covers love, career, finance, and health, helping you grasp life rhythm.' }}}}</p>
            <p className="text-slate-300 text-sm leading-relaxed">{{{{ language === 'zh' ? '选择你的星座，获取今日精准运势分析。我们提供详细指数评分、幸运元素、个性化建议等丰富内容。无论你是对爱情好奇，还是想了解事业走向，这里都能找到答案。' : language === 'id' ? 'Pilih tanda zodiak Anda, dapatkan analisis horoskop presisi hari ini. Kami menyediakan skor indeks detail, elemen keberuntungan, saran personalisasi. Apakah Anda penasaran tentang cinta, atau ingin memahami arah karir.' : 'Choose your zodiac sign, get accurate today\'s horoscope analysis. We provide detailed index scores, lucky elements, personalized advice. Whether you\'re curious about love or want to understand career direction.' }}}}</p>
            <p className="text-slate-400 text-sm leading-relaxed">{{{{ language === 'zh' ? '支持中文、英文、印尼文等多语言，随时随地查看你的星座运势。让星辰指引你走向更美好的明天。' : language === 'id' ? 'Mendukung multi-bahasa termasuk Mandarin, Inggris, Indonesia. Lihat horoskop zodiak Anda kapan saja. Biarkan bintang-bintang memandu Anda.' : 'Supports multiple languages including Chinese, English, Indonesian, etc. Check your zodiac horoscope anytime. Let the stars guide you to a better tomorrow.' }}}}</p>
          </div>
        )}}
'''
    
    # Insert after tabs section
    tab_end = content.find('</div>\n      </div>')
    if tab_end != -1:
        # Find next occurrence after the tab section
        next_pos = content.find('{/*', tab_end)
        if next_pos != -1:
            content = content[:next_pos] + desc_html + '\n' + content[next_pos:]
    
    # Add FAQ before </main>
    faq_data = get_horoscope_faq()
    faq_html = build_faq_html(faq_data)
    
    result = insert_before_main_end(content, faq_html)
    if result is None:
        print(f"  ERROR: Could not find </main> tag")
        return False
    
    write_file(filepath, result)
    print(f"  SUCCESS: Added FAQ and description to horoscope/page.tsx")
    return True

def add_json_ld_to_layout(page_type, name, description, url, keywords):
    """Add JSON-LD to layout.tsx files"""
    filepath = os.path.join(BASE_PATH, page_type, 'layout.tsx')
    print(f"Processing layout: {filepath}...")
    
    if not os.path.exists(filepath):
        print(f"  ERROR: Layout file not found")
        return False
    
    content = read_file(filepath)
    
    # Create JSON-LD script
    json_ld = f'''export const jsonLdData = {{
  "@context": "https://schema.org",
  "@type": ["WebPage", "SoftwareApplication"],
  "name": "{name}",
  "description": "{description}",
  "url": "{url}",
  "keywords": "{keywords}",
  "applicationCategory": "AstrologyApplication",
  "operatingSystem": "Any",
  "offers": {{
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }},
  "provider": {{
    "@type": "Organization",
    "name": "Starry Fate",
    "url": "https://astrology-clean.vercel.app"
  }}
}};
'''
    
    # Insert after the metadata object
    # Find the end of metadata export
    metadata_end = content.find('};', content.find('export const metadata'))
    if metadata_end == -1:
        print(f"  WARNING: Could not find metadata export")
        return False
    
    # Insert JSON-LD data after metadata
    insert_pos = metadata_end + 2  # After };
    content = content[:insert_pos] + '\n' + json_ld + '\n' + content[insert_pos:]
    
    # Now modify the default function to include script tag
    # Find the return statement
    return_pattern = 'return children;'
    if return_pattern in content:
        new_return = '''const jsonLdScript = {
    __html: JSON.stringify(jsonLdData),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLdData)}}
      />
      {{children}}
    </>
  );'''
        content = content.replace(return_pattern, new_return)
    
    write_file(filepath, content)
    print(f"  SUCCESS: Added JSON-LD to {page_type}/layout.tsx")
    return True

def main():
    print("=" * 60)
    print("SEO Enhancement Script v2 - Starting...")
    print("=" * 60)
    
    # Process page.tsx files
    print("\n[1/4] Processing transits/page.tsx...")
    if not process_transits_page():
        print("  FAILED")
    
    print("\n[2/4] Processing composite/page.tsx...")
    if not process_composite_page():
        print("  FAILED")
    
    print("\n[3/4] Processing horoscope/page.tsx...")
    if not process_horoscope_page():
        print("  FAILED")
    
    # Process layout.tsx files - Add JSON-LD
    print("\n[4/4] Adding JSON-LD to layout files...")
    
    layouts = [
        ('transits', 'Planetary Transit Chart Analysis', 
         'Free professional transit chart tracking planetary transits affecting your natal chart. AI-powered analysis reveals fortune turning points.',
         'https://astrology-clean.vercel.app/transits',
         'transit chart, planetary transit, transit analysis, astrology timing'),
        ('composite', 'Composite Chart Analysis',
         'Free professional Composite Chart to analyze the shared astrology and dynamic patterns of a relationship. AI deeply interprets relationship qualities.',
         'https://astrology-clean.vercel.app/composite',
         'composite chart, synastry, relationship astrology, compatibility'),
        ('horoscope', 'Daily Horoscope Forecast',
         'Free daily, weekly and monthly horoscope forecasts for all 12 zodiac signs. Accurate astrology predictions.',
         'https://astrology-clean.vercel.app/horoscope',
         'horoscope, daily horoscope, weekly horoscope, monthly horoscope, free horoscope'),
    ]
    
    for page_type, name, desc, url, keywords in layouts:
        if not add_json_ld_to_layout(page_type, name, desc, url, keywords):
            print(f"  FAILED for {page_type}")
    
    print("\n" + "=" * 60)
    print("SEO Enhancement Completed!")
    print("=" * 60)
    print("\n⚠️  IMPORTANT: Please test the build with `npm run build`")
    print("⚠️  Check for any syntax errors in the modified files")

if __name__ == '__main__':
    main()
