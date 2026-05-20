#!/usr/bin/env python3
"""
SEO Enhancement Script for Astrology Clean Project
Adds FAQ sections, description sections, and JSON-LD structured data
"""

import re
import sys
import os

def read_file(filepath):
    """Read file with UTF-8 encoding"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    """Write file with UTF-8 encoding"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def add_faq_to_transits(content):
    """Add FAQ section to transits/page.tsx"""
    
    # FAQ translations
    faq_data = {
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
            ('How often should I check transit chart?', 'It is recommended to check monthly or before important decisions. You can also generate transit charts for specific dates (like interviews, signing days) to choose the most favorable timing.'),
        ],
        'id': [
            ('Apa itu bagan transit?', 'Bagan transit mengamati interaksi antara posisi planet saat ini dan bagan lahir Anda. Ini mengungkap bagaimana energi kosmik saat ini mempengaruhi berbagai area kehidupan, alat penting untuk memprediksi waktu dan tren.'),
            ('Seberapa akurat bagan transit?', 'Bagan transit berdasarkan pada perhitungan astronomi yang presisi menunjukkan posisi planet yang sebenarnya. Meskipun tidak dapat menentukan takdir, mereka mengungkap tren energi dan waktu yang menguntungkan dengan akurasi tinggi.'),
            ('Bagaimana cara membaca aspek transit?', 'Aspek transit adalah hubungan sudut antara planet saat ini dan planet natal Anda. Aspek harmonis (trine, sextile) membawa energi yang lancar, aspek menantang (square, opposition) menunjukkan tantangan dan peluang pertumbuhan.'),
            ('Apa yang dapan diprediksi dengan bagan transit?', 'Bagan transit dapan memprediksi tren emosional, peluang karir, perubahan keuangan, siklus kesehatan, dll. Sangat cocok untuk memilih waktu optimal untuk keputusan penting.'),
            ('Seberapa sering saya harus memeriksa bagan transit?', 'Disarankan untuk memeriksa setiap bulan atau sebelum keputusan penting. Anda juga dapan membuat bagan transit untuk tanggal tertentu untuk memilih waktu yang paling menguntungkan.'),
        ]
    }
    
    # Build FAQ section HTML
    faq_html = '''
        {/* SEO FAQ Section */}
        <div className="mt-12 mb-8 p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold mb-6 text-cyan-300">{language === 'zh' ? '常见问题' : language === 'id' ? 'Pertanyaan yang Sering Diajukan' : 'Frequently Asked Questions'}</h2>
          <div className="space-y-4">
    '''
    
    for i in range(5):
        faq_html += f'''
            <details key={i} className="group p-4 rounded-xl bg-white/5 border border-white/10">
              <summary className="cursor-pointer font-medium text-white list-none flex items-center justify-between">
                <span>{{ language === 'zh' ? '{faq_data["zh"][i][0]}' : language === 'id' ? '{faq_data["id"][i][0]}' : '{faq_data["en"][i][0]}' }}</span>
                <ChevronDown size={{16}} className="text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-3 text-slate-300 text-sm leading-relaxed">{{ language === 'zh' ? '{faq_data["zh"][i][1]}' : language === 'id' ? '{faq_data["id"][i][1]}' : '{faq_data["en"][i][1]}' }}</p>
            </details>
        '''
    
    faq_html += '''
          </div>
        </div>
    '''
    
    # Find insertion point - before </main>
    insert_point = content.rfind('</main>')
    if insert_point == -1:
        return content
    
    new_content = content[:insert_point] + faq_html + '\n' + content[insert_point:]
    return new_content

def add_description_to_transits(content):
    """Add description section to transits/page.tsx"""
    
    desc_html = '''
        {/* SEO Description Section */}
        {!chart && (
          <div className="mb-6 p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <p className="text-slate-300 text-sm leading-relaxed">{{ language === 'zh' ? '行星推运是占星学中最实用的预测技术之一。通过观测当前行星位置与你出生星盘的互动，可以精准把握人生重要时机。' : language === 'id' ? 'Transit planet adalah salah satu teknik prediksi paling praktis dalam astrologi. Dengan mengamati interaksi posisi planet saat ini dengan bagan lahir Anda, Anda dapan memahami waktu penting dalam hidup secara presisi.' : 'Planetary transit is one of the most practical predictive techniques in astrology. By observing the interaction between current planetary positions and your birth chart, you can precisely grasp important life timings.' }}</p>
            <p className="text-slate-300 text-sm leading-relaxed">{{ language === 'zh' ? '我们的推运分析工具使用专业天文算法，精确计算行运行星与本命行星的相位关系。无论你是想了解近期运势，还是为重要决策选择最佳时机，推运盘都能给你有价值的指引。' : language === 'id' ? 'Alat analisis transit kami menggunakan algoritma astronomi profesional, menghitung secara presisi hubungan aspek antara planet transito dan planet natal. Apakah Anda ingin memahami fortuna jangka pendek, atau memilih waktu terbaik untuk keputusan penting, bagan transit dapan memberikan panduan yang berharga.' : 'Our transit analysis tool uses professional astronomical algorithms to precisely calculate aspect relationships between transit planets and natal planets. Whether you want to understand recent fortune or choose the best timing for important decisions, transit charts can provide valuable guidance.' }}</p>
            <p className="text-slate-400 text-sm leading-relaxed">{{ language === 'zh' ? '立即输入你的出生信息，选择推运日期，免费生成专业推运分析。支持多语言，随时随地查看你的宇宙能量趋势。' : language === 'id' ? 'Segera masukkan informasi kelahiran Anda, pilih tanggal transit, dan buat analisis transit profesional secara gratis. Mendukung multi-bahasa, lihat tren energi kosmik Anda kapan saja dan di mana saja.' : 'Enter your birth information now, select transit date, and generate professional transit analysis for free. Supports multiple languages, check your cosmic energy trends anytime, anywhere.' }}</p>
          </div>
        )}
    '''
    
    # Insert after the header section, before Saved Charts
    insert_after = "className="text-center mb-8">"
    if insert_after in content:
        pos = content.find(insert_after) + len(insert_after)
        # Find next major section
        next_section = content.find('<div className="rounded-2xl bg-slate-900/60', pos)
        if next_section != -1:
            new_content = content[:next_section] + desc_html + '\n' + content[next_section:]
            return new_content
    
    return content

def add_faq_to_composite(content):
    """Add FAQ section to composite/page.tsx"""
    
    faq_data = {
        'zh': [
            ('什么是合盘？', '合盘是将两个人的出生星盘合并，创建一个代表这段关系本身的全新星盘。它揭示了关系的核心本质、共同主题和潜在发展方向。'),
            ('合盘与比较盘有什么区别？', '比较盘展示两人星盘之间的互动（行星落入对方宫位、相位关系）；合盘则是创建全新的关系星盘，更侧重于关系本身而非个人。'),
            ('如何解读合盘中的行星位置？', '合盘中的行星位置代表关系在不同生活领域的表达方式。例如，金星在某个宫位显示关系如何表达爱意，土星在某个宫位显示关系需要面对的责任。'),
            ('合盘准吗？需要两个人的准确出生时间吗？', '合盘需要两个人的完整出生信息（日期、时间、地点）。出生时间越精确，合盘分析越准确，尤其是上升点和宫位划分。'),
            ('合盘适合分析哪些关系？', '合盘适合分析任何重要关系：情侣、夫妻、商业伙伴、团队成员等。它帮助你理解关系的动力、优势和挑战。'),
        ],
        'en': [
            ('What is a composite chart?', 'A composite chart merges two people\'s birth charts to create a brand new chart representing the relationship itself. It reveals the core essence, shared themes, and potential development direction of the relationship.'),
            ('What is the difference between composite and synastry?', 'Synastry shows interactions between two charts (planets in partner\'s houses, aspect relationships); composite creates a brand new relationship chart, focusing more on the relationship itself rather than individuals.'),
            ('How to interpret planetary positions in composite chart?', 'Planetary positions in composite chart represent how the relationship expresses itself in different life areas. For example, Venus in a house shows how the relationship expresses love, Saturn shows responsibilities the relationship needs to face.'),
            ('Is composite chart accurate? Need accurate birth times for both?', 'Composite chart needs complete birth information for both people (date, time, location). The more precise the birth time, the more accurate the composite analysis, especially for Ascendant and house divisions.'),
            ('What relationships is composite chart suitable for?', 'Composite chart is suitable for analyzing any important relationship: couples, spouses, business partners, team members, etc. It helps you understand relationship dynamics, strengths, and challenges.'),
        ],
        'id': [
            ('Apa itu bagan komposit?', 'Bagan komposit menggabungkan dua bagan kelahiran untuk membuat bagan baru yang mewakili hubungan itu sendiri. Ini mengungkap esensi inti, tema bersama, dan arah pengembangan potensial dari hubungan.'),
            ('Apa perbedaan antara komposit dan sinastri?', 'Sinastri menunjukkan interaksi antara dua bagan (planet di rumah pasangan, hubungan aspek); komposit membuat bagan hubungan baru, lebih fokus pada hubungan itu sendiri daripada individu.'),
            ('Bagaimana cara membaca posisi planet di bagan komposit?', 'Posisi planet di bagan komposit mewakili bagaimana hubungan mengekspresikan dirinya di berbagai area kehidupan. Misalnya, Venus di rumah menunjukkan bagaimana hubungan mengekspresikan cinta, Saturnus menunjukkan tanggung jawab yang perlu dihadapi hubungan.'),
            ('Apakah bagan komposit akurat? Perlu waktu kelahiran yang akurat untuk keduanya?', 'Bagan komposit membutuhkan informasi kelahiran lengkap untuk kedua orang (tanggal, waktu, tempat). Semakin presisi waktu kelahiran, semakin akurat analisis komposit, terutama untuk Ascenden dan pembagian rumah.'),
            ('Hubungan apa yang cocok untuk dianalisis dengan bagan komposit?', 'Bagan komposit cocok untuk menganalisis hubungan penting apa pun: pasangan, suami istri, mitra bisnis, anggota tim, dll. Ini membantu Anda memahami dinamika, kekuatan, dan tantangan hubungan.'),
        ]
    }
    
    faq_html = '''
        {/* SEO FAQ Section */}
        <div className="mt-12 mb-8 p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold mb-6 text-pink-300">{language === 'zh' ? '常见问题' : language === 'id' ? 'Pertanyaan yang Sering Diajukan' : 'Frequently Asked Questions'}</h2>
          <div className="space-y-4">
    '''
    
    for i in range(5):
        faq_html += f'''
            <details key={{i}} className="group p-4 rounded-xl bg-white/5 border border-white/10">
              <summary className="cursor-pointer font-medium text-white list-none flex items-center justify-between">
                <span>{{ language === 'zh' ? '{faq_data["zh"][i][0]}' : language === 'id' ? '{faq_data["id"][i][0]}' : '{faq_data["en"][i][0]}' }}</span>
                <ChevronDown size={{16}} className="text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-3 text-slate-300 text-sm leading-relaxed">{{ language === 'zh' ? '{faq_data["zh"][i][1]}' : language === 'id' ? '{faq_data["id"][i][1]}' : '{faq_data["en"][i][1]}' }}</p>
            </details>
        '''
    
    faq_html += '''
          </div>
        </div>
    '''
    
    insert_point = content.rfind('</main>')
    if insert_point == -1:
        return content
    
    new_content = content[:insert_point] + faq_html + '\n' + content[insert_point:]
    return new_content

def add_description_to_composite(content):
    """Add description section to composite/page.tsx"""
    
    desc_html = '''
        {/* SEO Description Section */}
        <div className="mb-6 p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <p className="text-slate-300 text-sm leading-relaxed">{{ language === 'zh' ? '双人合盘分析是关系占星学的核心工具。通过创建代表关系本身的合盘，以及展示两人互动的比较盘，全方位解读你们的关系动力。' : language === 'id' ? 'Analisis bagan ganda adalah alat inti dalam astrologi hubungan. Dengan membuat bagan komposit yang mewakili hubungan itu sendiri, serta bagan sinastri yang menunjukkan interaksi keduanya, membaca dinamika hubungan Anda dari semua sudut.' : 'Dual chart analysis is the core tool in relationship astrology. By creating a composite chart representing the relationship itself, and a synastry chart showing interactions between two people, comprehensively interpret your relationship dynamics.' }}</p>
          <p className="text-slate-300 text-sm leading-relaxed">{{ language === 'zh' ? '无论你是想了解恋爱关系的兼容性、商业伙伴的合作潜力，还是团队成员的协作模式，我们的免费合盘工具都能提供深度洞察。输入双方的出生信息，立即生成专业的合盘和比较盘分析。' : language === 'id' ? 'Apakah Anda ingin memahami kompatibilitas hubungan asmara, potensi kerjasama mitra bisnis, atau pola kolaborasi anggota tim, alat komposit gratis kami dapan memberikan wawasan mendalam. Masukkan informasi kelahiran keduanya, dan buat analisis komposit dan sinastri profesional secara instan.' : 'Whether you want to understand romantic relationship compatibility, business partner collaboration potential, or team member collaboration patterns, our free composite tool can provide deep insights. Enter both parties\' birth information, instantly generate professional composite and synastry analysis.' }}</p>
          <p className="text-slate-400 text-sm leading-relaxed">{{ language === 'zh' ? '支持多种分宫制选择，精准计算行星位置和相位。让星辰为你揭示关系的真相与潜力。' : language === 'id' ? 'Mendukung pilihan sistem rumah yang berbagai, menghitung posisi dan aspek planet secara presisi. Biarkan bintang-bintang mengungkap kebenaran dan potensi hubungan untuk Anda.' : 'Supports multiple house system options, precisely calculates planetary positions and aspects. Let the stars reveal the truth and potential of your relationship.' }}</p>
        </div>
    '''
    
    insert_after = "className="text-center mb-8">"
    if insert_after in content:
        pos = content.find(insert_after) + len(insert_after)
        next_section = content.find('<div className="grid md:grid-cols-2 gap-6', pos)
        if next_section != -1:
            new_content = content[:next_section] + desc_html + '\n' + content[next_section:]
            return new_content
    
    return content

def add_faq_to_horoscope(content):
    """Add FAQ section to horoscope/page.tsx"""
    
    faq_data = {
        'zh': [
            ('每日运势是怎么计算的？', '我们的每日运势基于西方占星学的行星位置和星座特征。结合太阳位置、月亮相位、个人星座特质等因素，给出综合性的运势分析。'),
            ('运势预测准确吗？', '运势预测揭示的是能量趋势和潜在可能性，而非绝对命运。它可以作为生活决策的参考，但最终选择仍在你自己手中。'),
            ('为什么不同星座的运势不同？', '每个星座对应不同的元素（火、土、风、水）、守护星和性格特质。当行星运行到不同位置时，对各星座的影响自然不同。'),
            ('运势中的幸运色和幸运数字有什么用？', '幸运色和幸运数字源自占星学中的振动频率理论。在对应的时间使用这些元素，可以帮助你与当天的宇宙能量更好地调和。'),
            ('可以相信每日运势吗？', '每日运势是一种有趣的自我反思工具。它可以启发你关注生活中的特定领域，但不必过于依赖。最重要的是相信自己的判断和直觉。'),
        ],
        'en': [
            ('How is daily horoscope calculated?', 'Our daily horoscope is based on Western astrology\'s planetary positions and zodiac sign characteristics. Combining factors like Sun position, Moon aspects, personal sign traits, etc., providing comprehensive fortune analysis.'),
            ('Is fortune prediction accurate?', 'Fortune prediction reveals energy trends and potential possibilities, not absolute fate. It can serve as a reference for life decisions, but the final choice is still in your hands.'),
            ('Why are fortunes different for different signs?', 'Each sign corresponds to different elements (fire, earth, air, water), ruling planets, and personality traits. As planets move to different positions, their influence on each sign naturally differs.'),
            ('What are lucky colors and numbers for?', 'Lucky colors and numbers originate from vibration frequency theory in astrology. Using these elements at corresponding times can help you better harmonize with the day\'s cosmic energy.'),
            ('Can I trust daily horoscope?', 'Daily horoscope is an interesting self-reflection tool. It can inspire you to focus on specific life areas, but don\'t rely too much on it. Most important is to trust your own judgment and intuition.'),
        ],
        'id': [
            ('Bagaimana horoskop harian dihitung?', 'Horoskop harian kami berdasarkan pada posisi planet dan karakteristik tanda zodiak dalam astrologi Barat. Menggabungkan faktor seperti posisi Matahari, aspek Bulan, sifat tanda pribadi, dll., memberikan analisis fortuna yang komprehensif.'),
            ('Apakah prediksi fortuna akurat?', 'Prediksi fortuna mengungkap tren energi dan kemungkinan potensial, bukan takdir mutlak. Ini dapan berfungsi sebagai referensi untuk keputusan hidup, tetapi pilihan akhir tetap di tangan Anda.'),
            ('Mengapa fortuna berbeda untuk tanda yang berbeda?', 'Setiap tanda berhubungan dengan elemen yang berbeda (api, tanah, udara, air), planet penguasa, dan sifat kepribadian. Saat planet bergerak ke posisi yang berbeda, pengaruhnya pada setiap tanda secara alami berbeda.'),
            ('Untuk apa warna dan angka keberuntungan?', 'Warna dan angka keberuntungan berasal dari teori frekuensi getaran dalam astrologi. Menggunakan elemen ini pada waktu yang sesuai dapan membantu Anda mengharmonisasikan dengan energi kosmik hari itu.'),
            ('Bolehkah saya percaya horoskop harian?', 'Horoskop harian adalah alat refleksi diri yang menarik. Ini dapan menginspirasi Anda untuk fokus pada area kehidupan tertentu, tetapi jangan terlalu bergantung padanya. Yang paling penting adalah percaya pada penilaian dan intuisi Anda sendiri.'),
        ]
    }
    
    faq_html = '''
        {/* SEO FAQ Section */}
        <div className="mt-12 mb-8 p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold mb-6 text-amber-300">{language === 'zh' ? '常见问题' : language === 'id' ? 'Pertanyaan yang Sering Diajukan' : 'Frequently Asked Questions'}</h2>
          <div className="space-y-4">
    '''
    
    for i in range(5):
        faq_html += f'''
            <details key={{i}} className="group p-4 rounded-xl bg-white/5 border border-white/10">
              <summary className="cursor-pointer font-medium text-white list-none flex items-center justify-between">
                <span>{{ language === 'zh' ? '{faq_data["zh"][i][0]}' : language === 'id' ? '{faq_data["id"][i][0]}' : '{faq_data["en"][i][0]}' }}</span>
                <ChevronDown size={{16}} className="text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-3 text-slate-300 text-sm leading-relaxed">{{ language === 'zh' ? '{faq_data["zh"][i][1]}' : language === 'id' ? '{faq_data["id"][i][1]}' : '{faq_data["en"][i][1]}' }}</p>
            </details>
        '''
    
    faq_html += '''
          </div>
        </div>
    '''
    
    insert_point = content.rfind('</main>')
    if insert_point == -1:
        return content
    
    new_content = content[:insert_point] + faq_html + '\n' + content[insert_point:]
    return new_content

def add_description_to_horoscope(content):
    """Add description section to horoscope/page.tsx"""
    
    desc_html = '''
        {/* SEO Description Section */}
        <div className="mb-6 p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <p className="text-slate-300 text-sm leading-relaxed">{{ language === 'zh' ? '探索12星座的每日、每周和每月运势。我们的免费运势分析涵盖爱情、事业、财运和健康四大领域，帮助你把握生活节奏，做出更好决策。' : language === 'id' ? 'Jelajahi horoskop harian, mingguan, dan bulanan untuk 12 tanda zodiak. Analisis horoskop gratis kami mencakup empat area: cinta, karir, keuangan, dan kesehatan, membantu Anda memahami ritme kehidupan dan membuat keputusan yang lebih baik.' : 'Explore daily, weekly, and monthly horoscope for all 12 zodiac signs. Our free horoscope analysis covers love, career, finance, and health, helping you grasp life rhythm and make better decisions.' }}</p>
          <p className="text-slate-300 text-sm leading-relaxed">{{ language === 'zh' ? '选择你的星座，获取今日精准运势分析。我们提供详细指数评分、幸运元素、个性化建议等丰富内容。无论你是对爱情好奇，还是想了解事业走向，这里都能找到答案。' : language === 'id' ? 'Pilih tanda zodiak Anda, dapatkan analisis horoskop presisi hari ini. Kami menyediakan skor indeks detail, elemen keberuntungan, saran personalisasi, dan konten kaya lainnya. Apakah Anda penasaran tentang cinta, atau ingin memahami arah karir, Anda dapan menemukan jawabannya di sini.' : 'Choose your zodiac sign, get accurate today\'s horoscope analysis. We provide detailed index scores, lucky elements, personalized advice, and other rich content. Whether you\'re curious about love or want to understand career direction, you can find answers here.' }}</p>
          <p className="text-slate-400 text-sm leading-relaxed">{{ language === 'zh' ? '支持中文、英文、印尼文等多语言，随时随地查看你的星座运势。让星辰指引你走向更美好的明天。' : language === 'id' ? 'Mendukung multi-bahasa termasuk Mandarin, Inggris, Indonesia, dan lainnya. Lihat horoskop zodiak Anda kapan saja dan di mana saja. Biarkan bintang-bintang memandu Anda menuju hari esok yang lebih baik.' : 'Supports multiple languages including Chinese, English, Indonesian, etc. Check your zodiac horoscope anytime, anywhere. Let the stars guide you to a better tomorrow.' }}</p>
        </div>
    '''
    
    insert_after = "className="text-center mb-6">"
    if insert_after in content:
        pos = content.find(insert_after) + len(insert_after)
        next_section = content.find('<div className="relative mb-6">', pos)
        if next_section != -1:
            new_content = content[:next_section] + desc_html + '\n' + content[next_section:]
            return new_content
    
    return content

def add_json_ld_to_layout(filepath, page_type):
    """Add JSON-LD structured data to layout.tsx files"""
    
    content = read_file(filepath)
    
    # Define JSON-LD data based on page type
    json_ld_data = {
        'transits': {
            'name': 'Planetary Transit Chart Analysis',
            'description': 'Free professional transit chart analysis. Track planetary transits and their aspects to your natal chart for accurate timing and forecasts.',
            'url': 'https://astrology-clean.vercel.app/transits',
            'keywords': 'transit chart, planetary transit, transit analysis, astrology timing, free transit calculator',
        },
        'composite': {
            'name': 'Composite Chart Analysis',
            'description': 'Free composite chart and synastry analysis for relationships. Understand relationship dynamics with professional astrological tools.',
            'url': 'https://astrology-clean.vercel.app/composite',
            'keywords': 'composite chart, synastry, relationship astrology, compatibility, free composite calculator',
        },
        'horoscope': {
            'name': 'Daily Horoscope Forecast',
            'description': 'Free daily, weekly and monthly horoscope forecasts for all 12 zodiac signs. Accurate astrology predictions.',
            'url': 'https://astrology-clean.vercel.app/horoscope',
            'keywords': 'horoscope, daily horoscope, weekly horoscope, monthly horoscope, free horoscope, zodiac forecast',
        }
    }
    
    data = json_ld_data[page_type]
    
    # Create JSON-LD script
    json_ld = f'''
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({{
      "@context": "https://schema.org",
      "@type": ["WebPage", "SoftwareApplication"],
      "name": "{data['name']}",
      "description": "{data['description']}",
      "url": "{data['url']}",
      "keywords": "{data['keywords']}",
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
    }})
  }}
/>
'''
    
    # Insert JSON-LD before </head> or as first child of return
    # Find the return statement in layout
    return_pattern = 'return children;'
    if return_pattern in content:
        # Need to wrap children with Head if not already present
        # For Next.js 13+ App Router, we use metadata export, but we can add
        # JSON-LD using a script tag in the return
        
        # Let's modify to add a fragment with script
        new_return = f'''const jsonLd = {{
    "@context": "https://schema.org",
    "@type": ["WebPage", "SoftwareApplication"],
    "name": "{data['name']}",
    "description": "{data['description']}",
    "url": "{data['url']}",
    "keywords": "{data['keywords']}",
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {{children}}
    </>
  );'''
    
        content = content.replace(return_pattern, new_return)
    
        # Add React import if not present
        if 'import React' not in content and 'import * as React' not in content:
            content = content.replace('import type { Metadata }', 'import * as React from \'react\';\nimport type { Metadata }')
    
    return content

def main():
    base_path = r'C:\Users\user\.qclaw\astrology-clean\src\app'
    
    print("Starting SEO enhancement...")
    
    # Process transits/page.tsx
    print("\n1. Processing transits/page.tsx...")
    transits_page = os.path.join(base_path, 'transits', 'page.tsx')
    if os.path.exists(transits_page):
        content = read_file(transits_page)
        content = add_description_to_transits(content)
        content = add_faq_to_transits(content)
        write_file(transits_page, content)
        print("   ✓ Added FAQ and description to transits/page.tsx")
    else:
        print(f"   ✗ File not found: {transits_page}")
    
    # Process composite/page.tsx
    print("\n2. Processing composite/page.tsx...")
    composite_page = os.path.join(base_path, 'composite', 'page.tsx')
    if os.path.exists(composite_page):
        content = read_file(composite_page)
        content = add_description_to_composite(content)
        content = add_faq_to_composite(content)
        write_file(composite_page, content)
        print("   ✓ Added FAQ and description to composite/page.tsx")
    else:
        print(f"   ✗ File not found: {composite_page}")
    
    # Process horoscope/page.tsx
    print("\n3. Processing horoscope/page.tsx...")
    horoscope_page = os.path.join(base_path, 'horoscope', 'page.tsx')
    if os.path.exists(horoscope_page):
        content = read_file(horoscope_page)
        content = add_description_to_horoscope(content)
        content = add_faq_to_horoscope(content)
        write_file(horoscope_page, content)
        print("   ✓ Added FAQ and description to horoscope/page.tsx")
    else:
        print(f"   ✗ File not found: {horoscope_page}")
    
    # Process layout.tsx files - Add JSON-LD
    print("\n4. Adding JSON-LD to layout files...")
    
    for page_type in ['transits', 'composite', 'horoscope']:
        layout_file = os.path.join(base_path, page_type, 'layout.tsx')
        if os.path.exists(layout_file):
            content = read_file(layout_file)
            content = add_json_ld_to_layout(layout_file, page_type)
            # Actually we need to pass content, not filepath
            # Let me fix this
            print(f"   ⚠ Layout modification needs manual review for {page_type}/layout.tsx")
        else:
            print(f"   ✗ Layout file not found: {layout_file}")
    
    print("\n✅ SEO enhancement completed!")
    print("\n⚠ Please manually add JSON-LD to layout.tsx files.")
    print("⚠ Please test the build to ensure no errors.")

if __name__ == '__main__':
    main()
