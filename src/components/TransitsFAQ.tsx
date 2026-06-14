"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
  aEn: string;
  aId: string;
}

const FAQS: FAQItem[] = [
  {
    q: "什么是推运盘？",
    a: "推运盘（Transit Chart）是将当前行星位置覆盖在本命盘上，用来分析当下及未来的运势变化。它是占星预测的核心工具。",
    aEn: "A transit chart overlays current planetary positions onto your natal chart to analyze present and future influences. It is the core tool of astrological prediction.",
    aId: "Transit chart adalah chart yang menimpakan posisi planet saat ini ke atas chart kelahiran untuk menganalisis pengaruh saat ini dan masa depan.",
  },
  {
    q: "推运盘准确吗？",
    a: "准确度取决于出生时间的精确度。出生时间误差在15分钟内，推运分析依然高度可靠。",
    aEn: "Accuracy depends on birth time precision. If birth time is within 15 minutes, transit analysis remains highly reliable.",
    aId: "Akurasi tergantung pada ketepatan waktu kelahiran. Jika selisih kurang dari 15 menit, analisis transit tetap sangat andal.",
  },
  {
    q: "如何解读推运盘？",
    a: "重点关注与个人行星（太阳、月亮、上升）形成合相、对分相、四分相的过境行星，这些影响最为显著。",
    aEn: "Focus on transiting planets forming conjunctions, oppositions and squares to personal planets (Sun, Moon, Ascendant). These are the most significant.",
    aId: "Fokus pada planet transiting yang membentuk konjungsi, oposisi, dan kotak dengan planet pribadi (Matahari, Bulan, Ascendant).",
  },
  {
    q: "推运盘和本命盘有什么区别？",
    a: "本命盘是出生时刻的星空快照，固定不变；推运盘是当前天空状态，持续变化，用来预测运势。",
    aEn: "A natal chart is a snapshot of the sky at birth—it never changes. A transit chart shows the current sky—it changes constantly and is used for prediction.",
    aId: "Chart natal adalah potret langit saat kelahiran—tidak berubah. Transit chart menunjukkan langit saat ini—terus berubah dan digunakan untuk prediksi.",
  },
  {
    q: "为什么要看推运盘？",
    a: "帮你把握重要时机，如换工作、搬家、恋爱等关键节点。行星周期有迹可循，提前了解可做好规划。",
    aEn: "Helps you seize important timing for career changes, moving, relationships and other key life nodes. Planetary cycles are traceable—knowing in advance helps with planning.",
    aId: "Membantu Anda memanfaatkan waktu penting untuk perubahan karier, pindah, hubungan, dan titik kunci lainnya. Siku planet dapat dilacak.",
  },
];

export default function TransitsFAQ() {
  const [open, setOpen] = useState(-1);

  return (
    <section className="max-w-4xl mx-auto mt-16 mb-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        常见问题
      </h2>
      <div className="space-y-3">
        {FAQS.map((item, i) => (
          <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-500/5 transition-colors"
            >
              <span className="text-white font-medium">{item.q}</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${open === i ? "rotate-180" : ""}`}
              />
            </button>
            {open === i && (
              <div className="px-4 pb-4">
                <p className="text-gray-600 text-sm mb-2">{item.a}</p>
                <p className="text-gray-300/70 text-xs mb-1">EN: {item.aEn}</p>
                <p className="text-gray-300/70 text-xs">ID: {item.aId}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
