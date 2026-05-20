#!/usr/bin/env python3
"""创建三个 FAQ 组件文件（使用 utf-8 编码）"""
import os

COMPONENTS = {
    "TransitsFAQ.tsx": r"""\"use client\";

import { useState } from \"react\";
import { ChevronDown } from \"lucide-react\";

interface FAQItem {{
  q: string;
  a: string;
  aEn: string;
  aId: string;
}}

const FAQS: FAQItem[] = [
  {{
    q: \"什么是推运盘？\",
    a: \"推运盘（Transit Chart）是将当前行星位置覆盖在本命盘上，用来分析当下及未来的运势变化。它是占星预测的核心工具。\",
    aEn: \"A transit chart overlays current planetary positions onto your natal chart to analyze present and future influences. It is the core tool of astrological prediction.\",
    aId: \"Transit chart adalah chart yang menimpakan posisi planet saat ini ke atas chart kelahiran untuk menganalisis pengaruh saat ini dan masa depan.\",
  }},
  {{
    q: \"推运盘准确吗？\",
    a: \"准确度取决于出生时间的精确度。出生时间误差在15分钟内，推运分析依然高度可靠。\",
    aEn: \"Accuracy depends on birth time precision. If birth time is within 15 minutes, transit analysis remains highly reliable.\",
    aId: \"Akurasi tergantung pada ketepatan waktu kelahiran. Jika selisih kurang dari 15 menit, analisis transit tetap sangat andal.\",
  }},
  {{
    q: \"如何解读推运盘？\",
    a: \"重点关注与个人行星（太阳、月亮、上升）形成合相、对分相、四分相的过境行星，这些影响最为显著。\",
    aEn: \"Focus on transiting planets forming conjunctions, oppositions and squares to personal planets (Sun, Moon, Ascendant). These are the most significant.\",
    aId: \"Fokus pada planet transiting yang membentuk konjungsi, oposisi, dan kotak dengan planet pribadi (Matahari, Bulan, Ascendant).\",
  }},
  {{
    q: \"推运盘和本命盘有什么区别？\",
    a: \"本命盘是出生时刻的星空快照，固定不变；推运盘是当前天空状态，持续变化，用来预测运势。\",
    aEn: \"A natal chart is a snapshot of the sky at birth—it never changes. A transit chart shows the current sky—it changes constantly and is used for prediction.\",
    aId: \"Chart natal adalah potret langit saat kelahiran—tidak berubah. Transit chart menunjukkan langit saat ini—terus berubah dan digunakan untuk prediksi.\",
  }},
  {{
    q: \"为什么要看推运盘？\",
    a: \"帮你把握重要时机，如换工作、搬家、恋爱等关键节点。行星周期有迹可循，提前了解可做好规划。\",
    aEn: \"Helps you seize important timing for career changes, moving, relationships and other key life nodes. Planetary cycles are traceable—knowing in advance helps with planning.\",
    aId: \"Membantu Anda memanfaatkan waktu penting untuk perubahan karier, pindah, hubungan, dan titik kunci lainnya. Siklus planet dapat dilacak.\",
  }},
];

export default function TransitsFAQ() {{
  const [open, setOpen] = useState(-1);

  return (
    <section className=\"max-w-4xl mx-auto mt-16 mb-8\">
      <h2 className=\"text-2xl font-bold text-white mb-6 text-center\">
        常见问题
      </h2>
      <div className=\"space-y-3\">
        {{FAQS.map((item, i) => (
          <div key={i} className=\"border border-purple-500/20 rounded-lg overflow-hidden\">
            <button
              onClick={{() => setOpen(open === i ? -1 : i)}}
              className=\"w-full flex items-center justify-between p-4 text-left hover:bg-purple-500/5 transition-colors\"
            >
              <span className=\"text-white font-medium\">{{item.q}}</span>
              <ChevronDown
                className={`w-5 h-5 text-purple-400 transition-transform ${{open === i ? \"rotate-180\" : \"\"}}`}
              />
            </button>
            {{open === i && (
              <div className=\"px-4 pb-4\">
                <p className=\"text-purple-200 text-sm mb-2\">{{item.a}}</p>
                <p className=\"text-purple-300/70 text-xs mb-1\">EN: {{item.aEn}}</p>
                <p className=\"text-purple-300/70 text-xs\">ID: {{item.aId}}</p>
              </div>
            )}}
          </div>
        ))}}
      </div>
    </section>
  );
}}
""",
    "CompositeFAQ.tsx": r"""\"use client\";

import { useState } from \"react\";
import { ChevronDown } from \"lucide-react\";

interface FAQItem {{
  q: string;
  a: string;
  aEn: string;
  aId: string;
}}

const FAQS: FAQItem[] = [
  {{
    q: \"什么是合盘（Composite Chart）？\",
    a: \"合盘是将两个人的出生数据合并，计算出一个「关系星盘」，用来分析两人关系的本质、潜力和挑战。\",
    aEn: \"A composite chart merges two people's birth data to calculate a 'relationship chart' that reveals the essence, potential, and challenges of the relationship.\",
    aId: \"Composite chart menggabungkan data kelahiran dua orang untuk menghitung 'chart hubungan' yang mengungkap esensi, potensi, dan tantangan hubungan.\",
  }},
  {{
    q: \"合盘和比较盘有什么区别？\",
    a: \"比较盘（Comparison Chart）并排对比两张星盘；合盘（Composite Chart）是计算两者中点生成一张新盘，更侧重关系本质。\",
    aEn: \"A comparison chart places two charts side by side. A composite chart calculates the midpoint between two charts to create one new chart, focusing on the relationship's essence.\",
    aId: \"Chart komparasi menempatkan dua chart berdampingan. Chart komposit menghitung titik tengah antara dua chart untuk membuat satu chart baru.\",
  }},
  {{
    q: \"合盘准确吗？\",
    a: \"合盘非常准确，尤其对于长期关系。它揭示了两人关系的「灵魂契约」，比单纯比较行星更深刻。\",
    aEn: \"Composite charts are very accurate, especially for long-term relationships. They reveal the 'soul contract' of the relationship, deeper than simple planetary comparison.\",
    aId: \"Chart komposit sangat akurat, terutama untuk hubungan jangka panjang. Ini mengungkap 'kontrak jiwa' hubungan, lebih dalam dari sekadar perbandingan planet.\",
  }},
  {{
    q: \"如何提升合盘分数？\",
    a: \"合盘没有好坏之分，只有不同的能量模式。了解彼此星盘中的挑战相位，可以有意识地调整沟通方式，化解冲突。\",
    aEn: \"There is no 'good' or 'bad' composite chart—only different energy patterns. Understanding challenging aspects helps adjust communication and resolve conflicts.\",
    aId: \"Tidak ada chart komposit yang 'baik' atau 'buruk'—hanya pola energi yang berbeda. Memahami aspek menantang membantu menyesuaikan komunikasi.\",
  }},
  {{
    q: \"合盘能看到分手风险吗？\",
    a: \"合盘可以显示关系中的紧张相位（如土星对分金星），但并非宿命。占星提供觉察，选择权始终在你手中。\",
    aEn: \"A composite chart can show tension aspects (e.g., Saturn opposite Venus), but it is not destiny. Astrology provides awareness—the power of choice is always yours.\",
    aId: \"Composite chart dapat menunjukkan aspek ketegangan (misal Saturnus oposisi Venus), tapi bukan takdir. Astrologi memberikan kesadaran—pilihan tetap di tangan Anda.\",
  }},
];

export default function CompositeFAQ() {{
  const [open, setOpen] = useState(-1);

  return (
    <section className=\"max-w-4xl mx-auto mt-16 mb-8\">
      <h2 className=\"text-2xl font-bold text-white mb-6 text-center\">
        常见问题
      </h2>
      <div className=\"space-y-3\">
        {{FAQS.map((item, i) => (
          <div key={i} className=\"border border-purple-500/20 rounded-lg overflow-hidden\">
            <button
              onClick={{() => setOpen(open === i ? -1 : i)}}
              className=\"w-full flex items-center justify-between p-4 text-left hover:bg-purple-500/5 transition-colors\"
            >
              <span className=\"text-white font-medium\">{{item.q}}</span>
              <ChevronDown
                className={`w-5 h-5 text-purple-400 transition-transform ${{open === i ? \"rotate-180\" : \"\"}}`}
              />
            </button>
            {{open === i && (
              <div className=\"px-4 pb-4\">
                <p className=\"text-purple-200 text-sm mb-2\">{{item.a}}</p>
                <p className=\"text-purple-300/70 text-xs mb-1\">EN: {{item.aEn}}</p>
                <p className=\"text-purple-300/70 text-xs\">ID: {{item.aId}}</p>
              </div>
            )}}
          </div>
        ))}}
      </div>
    </section>
  );
}}
""",
    "HoroscopeFAQ.tsx": r"""\"use client\";

import { useState } from \"react\";
import { ChevronDown } from \"lucide-react\";

interface FAQItem {{
  q: string;
  a: string;
  aEn: string;
  aId: string;
}}

const FAQS: FAQItem[] = [
  {{
    q: \"运势准吗？\",
    a: \"运势分析基于行星运行规律，提供趋势性参考。它不是绝对预测，而是帮助你把握时机、做出更好决策的工具。\",
    aEn: \"Horoscope analysis is based on planetary cycles and provides trend-based guidance. It is not an absolute prediction, but a tool to help you seize opportunities and make better decisions.\",
    aId: \"Analisis horoskop berdasarkan siklus planet dan memberikan panduan berbasis tren. Ini bukan prediksi mutlak, tapi alat untuk membantu Anda memanfaatkan peluang.\",
  }},
  {{
    q: \"每日运势和年度运势有什么区别？\",
    a: \"每日运势侧重当天能量和短期影响；年度运势（Solar Return）分析整年主题，包括事业、感情、健康等各领域走势。\",
    aEn: \"Daily horoscope focuses on the day's energy and short-term influences. Yearly horoscope (Solar Return) analyzes the year's themes across career, love, health, and more.\",
    aId: \"Horoskop harian fokus pada energi hari ini dan pengaruh jangka pendek. Horoskop tahunan (Solar Return) menganalisis tema tahun ini di berbagai bidang.\",
  }},
  {{
    q: \"为什么运势有时不准？\",
    a: \"占星显示的是宇宙能量趋势，但个人自由意志、所处环境、已做选择都会影响结果。运势是地图，不是轨道。\",
    aEn: \"Astrology shows cosmic energy trends, but free will, environment, and past choices all influence outcomes. Your horoscope is a map, not a track.\",
    aId: \"Astrologi menunjukkan tren energi kosmik, tapi kehendak bebas, lingkungan, dan pilihan masa lalu mempengaruhi hasil. Horoskop adalah peta, bukan rel.\",
  }},
  {{
    q: \"2026年运势什么时候更新？\",
    a: \"年度运势在每年生日前后更新（Solar Return）。当日运势每天更新，当月运势每月初更新。\",
    aEn: \"Yearly horoscope updates around your birthday (Solar Return). Daily horoscope updates every day, monthly horoscope updates at the beginning of each month.\",
    aId: \"Horoskop tahunan diperbarui sekitar ulang tahun Anda (Solar Return). Horoskop harian diperbarui setiap hari, horoskop bulanan di awal bulan.\",
  }},
  {{
    q: \"哪个星座运势最准？\",
    a: \"所有星座的运势分析精度相同。准确度更多取决于出生信息（尤其是出生时间），而非星座本身。\",
    aEn: \"All zodiac signs have the same analysis precision. Accuracy depends more on birth information (especially birth time) than the sign itself.\",
    aId: \"Semua tanda zodiak memiliki presisi analisis yang sama. Akurasi lebih tergantung pada informasi kelahiran (terutama waktu kelahiran).\",
  }},
];

export default function HoroscopeFAQ() {{
  const [open, setOpen] = useState(-1);

  return (
    <section className=\"max-w-4xl mx-auto mt-16 mb-8\">
      <h2 className=\"text-2xl font-bold text-white mb-6 text-center\">
        常见问题
      </h2>
      <div className=\"space-y-3\">
        {{FAQS.map((item, i) => (
          <div key={i} className=\"border border-purple-500/20 rounded-lg overflow-hidden\">
            <button
              onClick={{() => setOpen(open === i ? -1 : i)}}
              className=\"w-full flex items-center justify-between p-4 text-left hover:bg-purple-500/5 transition-colors\"
            >
              <span className=\"text-white font-medium\">{{item.q}}</span>
              <ChevronDown
                className={`w-5 h-5 text-purple-400 transition-transform ${{open === i ? \"rotate-180\" : \"\"}}`}
              />
            </button>
            {{open === i && (
              <div className=\"px-4 pb-4\">
                <p className=\"text-purple-200 text-sm mb-2\">{{item.a}}</p>
                <p className=\"text-purple-300/70 text-xs mb-1\">EN: {{item.aEn}}</p>
                <p className=\"text-purple-300/70 text-xs\">ID: {{item.aId}}</p>
              </div>
            )}}
          </div>
        ))}}
      </div>
    </section>
  );
}}
""",
}

BASE = r"C:\Users\user\.qclaw\astrology-clean\src\components"

for fname, content in COMPONENTS.items():
    fpath = os.path.join(BASE, fname)
    with open(fpath, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)
    print(f"Created: {fname}")

print("Done!")
