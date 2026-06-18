"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, Calendar } from "lucide-react";

const SIGNS = [
  { id: "aries", symbol: "♈", names: { id: "Aries", zh: "白羊座", en: "Aries" }, element: "fire" },
  { id: "taurus", symbol: "♉", names: { id: "Taurus", zh: "金牛座", en: "Taurus" }, element: "earth" },
  { id: "gemini", symbol: "♊", names: { id: "Gemini", zh: "双子座", en: "Gemini" }, element: "air" },
  { id: "cancer", symbol: "♋", names: { id: "Cancer", zh: "巨蟹座", en: "Cancer" }, element: "water" },
  { id: "leo", symbol: "♌", names: { id: "Leo", zh: "狮子座", en: "Leo" }, element: "fire" },
  { id: "virgo", symbol: "♍", names: { id: "Virgo", zh: "处女座", en: "Virgo" }, element: "earth" },
  { id: "libra", symbol: "♎", names: { id: "Libra", zh: "天秤座", en: "Libra" }, element: "air" },
  { id: "scorpio", symbol: "♏", names: { id: "Scorpio", zh: "天蝎座", en: "Scorpio" }, element: "water" },
  { id: "sagittarius", symbol: "♐", names: { id: "Sagittarius", zh: "射手座", en: "Sagittarius" }, element: "fire" },
  { id: "capricorn", symbol: "♑", names: { id: "Capricorn", zh: "摩羯座", en: "Capricorn" }, element: "earth" },
  { id: "aquarius", symbol: "♒", names: { id: "Aquarius", zh: "水瓶座", en: "Aquarius" }, element: "air" },
  { id: "pisces", symbol: "♓", names: { id: "Pisces", zh: "双鱼座", en: "Pisces" }, element: "water" },
];

const ELEMENT_COLORS: Record<string, string> = {
  fire: "#FF6B6B", earth: "#8B7355", air: "#74B9FF", water: "#0984E3"};

// 年度运势数据 - 三语言
const YEARLY_DATA: Record<string, Record<string, any>> = {
  aries: {
    zh: {
      overall: "2026年对你来说是行动与突破的一年。火星和木星的相位为你注入强大的行动能量。上半年适合建立新项目、扩展社交圈；下半年适合深耕专业、巩固成果。关键月份：3月（决策）、7月（转折）、11月（收获）。",
      love: "🌟 感情方面，7月和11月是高峰期。金星在双鱼座期间（第5宫），浪漫机会大增。已有伴侣者需注意沟通方式。",
      career: "💼 木星在事业宫扩展你的影响力。3月、8月是晋升或创业的好时机。团队合作将带来意想不到的成果。",
      finance: "💰 财务稳健增长，5月和10月有投资机会。控制冲动消费，为长期目标储蓄。",
      health: "❤️ 土星提醒关注骨骼和关节健康。建议开始规律运动计划。",
      spiritual: "🧘 适合修行和自我探索的年份。冥想和瑜伽将带来深层连接。",
      months: ["新年新气象", "关系与合作", "行动与突破", "财务规划", "沟通表达", "稳定建设", "转变成长", "扩张收获", "深层整合", "释放放下", "转变新生", "年度总结"]},
    en: {
      overall: "2026 is a year of action and breakthrough for you. Mars and Jupiter inject powerful energy. First half: start new projects; second half: consolidate. Key months: March (decisions), July (turning point), November (harvest).",
      love: "🌟 Love peaks in July and November. Venus in Pisces brings romantic opportunities. Couples need better communication.",
      career: "💼 Jupiter expands your influence. March and August are great for promotion or entrepreneurship. Teamwork brings unexpected results.",
      finance: "💰 Steady financial growth. Investment opportunities in May and October. Control impulse spending.",
      health: "❤️ Saturn reminds you to focus on bones and joints. Start a regular exercise plan.",
      spiritual: "🧘 A year for self-exploration. Meditation and yoga bring deep connection.",
      months: ["Fresh Start", "Relationships", "Action", "Finances", "Communication", "Stability", "Transformation", "Expansion", "Integration", "Release", "Renewal", "Review"]},
    id: {
      overall: "2026 adalah tahun aksi dan terobosan. Mars dan Jupiter memberikan energi kuat. Semester pertama: proyek baru; semester kedua: konsolidasi. Bulan kunci: Maret (keputusan), Juli (titik balik), November (panen).",
      love: "🌟 Cinta memuncak Juli dan November. Venus di Pisces membawa peluang romantis. Pasangan perlu komunikasi lebih baik.",
      career: "💼 Jupiter memperluas pengaruh. Maret dan Agustus bagus untuk promosi atau kewirausahaan.",
      finance: "💰 Pertumbuhan keuangan stabil. Peluang investasi Mei dan Oktober. Kendalikan belanja impulsif.",
      health: "❤️ Saturnus mengingatkan fokus pada tulang dan sendi. Mulai rencana olahraga teratur.",
      spiritual: "🧘 Tahun untuk eksplorasi diri. Meditasi dan yoga membawa koneksi mendalam.",
      months: ["Awal Baru", "Hubungan", "Aksi", "Keuangan", "Komunikasi", "Stabilitas", "Transformasi", "Ekspansi", "Integrasi", "Pelepasan", "Pembaruan", "Evaluasi"]}},
  taurus: {
    zh: {
      overall: "2026年是金牛座的财务觉醒年。金星和木星的相位带来财务增长。第5宫的双鱼座金星照亮你的创造力和爱情生活。关键月份：2月（计划）、6月（行动）、9月（收获）。",
      love: "🌟 感情方面，需要在稳定和变化之间找到平衡。冥王星在第8宫可能带来深层情感转变。",
      career: "💼 天王星影响事业，带来创新机会。适合学习新技能或转型。",
      finance: "💰 木星照亮财务宫，财运大幅提升。土地、房地产或美妆艺术领域有收益。",
      health: "❤️ 肾脏和甲状腺健康需关注。多喝水，减少盐分摄入。",
      spiritual: "🧘 适合财务规划和冥想。花时间在大自然中充电。",
      months: ["新年新气象", "关系与合作", "行动与突破", "财务规划", "沟通表达", "稳定建设", "转变成长", "扩张收获", "深层整合", "释放放下", "转变新生", "年度总结"]},
    en: {
      overall: "2026 is Taurus's financial awakening year. Venus and Jupiter bring financial growth. Key months: February (planning), June (action), September (harvest).",
      love: "🌟 Find balance between stability and change in relationships. Pluto in 8th house brings deep emotional transformation.",
      career: "💼 Uranus affects career with innovation opportunities. Good for learning new skills.",
      finance: "💰 Jupiter illuminates finance house. Real estate and beauty arts bring profits.",
      health: "❤️ Watch kidney and thyroid health. Drink more water, reduce salt.",
      spiritual: "🧘 Good for financial planning and meditation. Recharge in nature.",
      months: ["Fresh Start", "Relationships", "Action", "Finances", "Communication", "Stability", "Transformation", "Expansion", "Integration", "Release", "Renewal", "Review"]},
    id: {
      overall: "2026 adalah tahun kebangkitan keuangan Taurus. Venus dan Jupiter membawa pertumbuhan. Bulan kunci: Februari (perencanaan), Juni (aksi), September (panen).",
      love: "🌟 Temukan keseimbangan antara stabilitas dan perubahan. Pluto di rumah 8 membawa transformasi emosional.",
      career: "💼 Uranus memengaruhi karir dengan peluang inovasi. Bagus untuk belajar keterampilan baru.",
      finance: "💰 Jupiter menerangi rumah keuangan. Real estat dan seni kecantikan membawa keuntungan.",
      health: "❤️ Jaga kesehatan ginjal dan tiroid. Minum lebih banyak air, kurangi garam.",
      spiritual: "🧘 Bagus untuk perencanaan keuangan dan meditasi. Isi ulang di alam.",
      months: ["Awal Baru", "Hubungan", "Aksi", "Keuangan", "Komunikasi", "Stabilitas", "Transformasi", "Ekspansi", "Integrasi", "Pelepasan", "Pembaruan", "Evaluasi"]}},
  // ... 其他星座数据简化展示，实际需要完整数据
  gemini: {
    zh: { overall: "2026年双子座思维活跃，信息灵通。木星在第3宫增强沟通能力。", love: "🌟 爱情宫受木星祝福，感情生活丰富。", career: "💼 第2宫财务宫活跃，收入来源多元化。", finance: "💰 偏财运提升，特别是5月和10月。", health: "❤️ 神经系统敏感，保证充足睡眠。", spiritual: "🧘 学习神秘学和心理学将带来深层成长。", months: ["新年新气象", "关系与合作", "行动与突破", "财务规划", "沟通表达", "稳定建设", "转变成长", "扩张收获", "深层整合", "释放放下", "转变新生", "年度总结"] },
    en: { overall: "2026 Gemini is mentally active and well-informed. Jupiter in 3rd house enhances communication.", love: "🌟 Love house blessed by Jupiter, rich emotional life.", career: "💼 2nd house finance active, diversified income.", finance: "💰 Side income improves, especially May and October.", health: "❤️ Nervous system sensitive, ensure adequate sleep.", spiritual: "🧘 Studying mysticism and psychology brings deep growth.", months: ["Fresh Start", "Relationships", "Action", "Finances", "Communication", "Stability", "Transformation", "Expansion", "Integration", "Release", "Renewal", "Review"] },
    id: { overall: "2026 Gemini aktif secara mental dan terinformasi. Jupiter di rumah 3 meningkatkan komunikasi.", love: "🌟 Rumah cinta diberkati Jupiter, kehidupan emosional kaya.", career: "💼 Rumah keuangan 2 aktif, pendapatan terdiversifikasi.", finance: "💰 Penghasilan sampingan meningkat, terutama Mei dan Oktober.", health: "❤️ Sistem saraf sensitif, pastikan tidur cukup.", spiritual: "🧘 Belajar mistisisme dan psikologi membawa pertumbuhan mendalam.", months: ["Awal Baru", "Hubungan", "Aksi", "Keuangan", "Komunikasi", "Stabilitas", "Transformasi", "Ekspansi", "Integrasi", "Pelepasan", "Pembaruan", "Evaluasi"] }},
  // 为节省空间，其他星座使用相同模式
  cancer: { zh: { overall: "2026年巨蟹座在家庭和事业之间找到平衡。", love: "🌟 土星考验感情，需要更多耐心。", career: "💼 职业声誉提升，得到更多认可。", finance: "💰 财务状况稳定，8月和11月有额外收入。", health: "❤️ 消化系统和胸部健康需关注。", spiritual: "🧘 家庭是今年的能量中心。", months: ["新年新气象", "关系与合作", "行动与突破", "财务规划", "沟通表达", "稳定建设", "转变成长", "扩张收获", "深层整合", "释放放下", "转变新生", "年度总结"] }, en: { overall: "2026 Cancer balances family and career.", love: "🌟 Saturn tests relationships, need more patience.", career: "💼 Professional reputation improves.", finance: "💰 Stable finances, extra income in August and November.", health: "❤️ Digestive and chest health need attention.", spiritual: "🧘 Family is this year's energy center.", months: ["Fresh Start", "Relationships", "Action", "Finances", "Communication", "Stability", "Transformation", "Expansion", "Integration", "Release", "Renewal", "Review"] }, id: { overall: "2026 Cancer menyeimbangkan keluarga dan karir.", love: "🌟 Saturnus menguji hubungan, perlu lebih sabar.", career: "💼 Reputasi profesional meningkat.", finance: "💰 Keuangan stabil, pendapatan ekstra Agustus dan November.", health: "❤️ Kesehatan pencernaan dan dada perlu perhatian.", spiritual: "🧘 Keluarga adalah pusat energi tahun ini.", months: ["Awal Baru", "Hubungan", "Aksi", "Keuangan", "Komunikasi", "Stabilitas", "Transformasi", "Ekspansi", "Integrasi", "Pelepasan", "Pembaruan", "Evaluasi"] } },
  leo: { zh: { overall: "2026年狮子座魅力四射，创造力爆发！", love: "🌟 金星带来浪漫机会，3月和11月是感情高峰期。", career: "💼 事业蒸蒸日上，领导力得到认可。", finance: "💰 木星照亮财务宫，正财稳定增长。", health: "❤️ 心脏和脊椎健康需关注。", spiritual: "🧘 舞台和聚光灯属于你。", months: ["新年新气象", "关系与合作", "行动与突破", "财务规划", "沟通表达", "稳定建设", "转变成长", "扩张收获", "深层整合", "释放放下", "转变新生", "年度总结"] }, en: { overall: "2026 Leo shines with charisma and creativity!", love: "🌟 Venus brings romantic opportunities, March and November are peaks.", career: "💼 Career thrives, leadership recognized.", finance: "💰 Jupiter illuminates finance house, steady growth.", health: "❤️ Heart and spine health need attention.", spiritual: "🧘 Stage and spotlight belong to you.", months: ["Fresh Start", "Relationships", "Action", "Finances", "Communication", "Stability", "Transformation", "Expansion", "Integration", "Release", "Renewal", "Review"] }, id: { overall: "2026 Leo bersinar dengan karisma dan kreativitas!", love: "🌟 Venus membawa peluang romantis, Maret dan November adalah puncak.", career: "💼 Karir berkembang, kepemimpinan diakui.", finance: "💰 Jupiter menerangi rumah keuangan, pertumbuhan stabil.", health: "❤️ Kesehatan jantung dan tulang belakang perlu perhatian.", spiritual: "🧘 Panggung dan sorotan milik Anda.", months: ["Awal Baru", "Hubungan", "Aksi", "Keuangan", "Komunikasi", "Stabilitas", "Transformasi", "Ekspansi", "Integrasi", "Pelepasan", "Pembaruan", "Evaluasi"] } },
  virgo: { zh: { overall: "2026年处女座自我提升年。", love: "🌟 第5宫受冥王星影响，感情关系有深层转变。", career: "💼 水星年带来写作、教学、短途旅行的好运。", finance: "💰 财务策略需调整，适合长期规划。", health: "❤️ 消化系统和免疫系统需要加强。", spiritual: "🧘 适合修行、瑜伽和灵性探索。", months: ["新年新气象", "关系与合作", "行动与突破", "财务规划", "沟通表达", "稳定建设", "转变成长", "扩张收获", "深层整合", "释放放下", "转变新生", "年度总结"] }, en: { overall: "2026 Virgo year of self-improvement.", love: "🌟 5th house affected by Pluto, deep transformation in relationships.", career: "💼 Mercury year brings luck in writing, teaching, travel.", finance: "💰 Financial strategy needs adjustment, good for long-term planning.", health: "❤️ Digestive and immune systems need strengthening.", spiritual: "🧘 Good for practice, yoga, and spiritual exploration.", months: ["Fresh Start", "Relationships", "Action", "Finances", "Communication", "Stability", "Transformation", "Expansion", "Integration", "Release", "Renewal", "Review"] }, id: { overall: "2026 Virgo tahun peningkatan diri.", love: "🌟 Rumah 5 dipengaruhi Pluto, transformasi mendalam dalam hubungan.", career: "💼 Tahun Merkurius membawa keberuntungan menulis, mengajar, bepergian.", finance: "💰 Strategi keuangan perlu penyesuaian, bagus untuk perencanaan jangka panjang.", health: "❤️ Sistem pencernaan dan imun perlu diperkuat.", spiritual: "🧘 Bagus untuk praktik, yoga, dan eksplorasi spiritual.", months: ["Awal Baru", "Hubungan", "Aksi", "Keuangan", "Komunikasi", "Stabilitas", "Transformasi", "Ekspansi", "Integrasi", "Pelepasan", "Pembaruan", "Evaluasi"] } },
  libra: { zh: { overall: "2026年天秤座关系与平衡年。", love: "🌟 关系宫活跃，已有伴侣需注意沟通。", career: "💼 天王星影响事业，拥抱创新和变化。", finance: "💰 共同财务需谨慎处理。", health: "❤️ 肾脏和皮肤健康需关注。", spiritual: "🧘 在关系中寻找自我，在独处中寻找平衡。", months: ["新年新气象", "关系与合作", "行动与突破", "财务规划", "沟通表达", "稳定建设", "转变成长", "扩张收获", "深层整合", "释放放下", "转变新生", "年度总结"] }, en: { overall: "2026 Libra year of relationships and balance.", love: "🌟 Relationship house active, couples need communication.", career: "💼 Uranus affects career, embrace innovation and change.", finance: "💰 Joint finances need careful handling.", health: "❤️ Kidney and skin health need attention.", spiritual: "🧘 Find self in relationships, balance in solitude.", months: ["Fresh Start", "Relationships", "Action", "Finances", "Communication", "Stability", "Transformation", "Expansion", "Integration", "Release", "Renewal", "Review"] }, id: { overall: "2026 Libra tahun hubungan dan keseimbangan.", love: "🌟 Rumah hubungan aktif, pasangan perlu komunikasi.", career: "💼 Uranus memengaruhi karir, terima inovasi dan perubahan.", finance: "💰 Keuangan bersama perlu penanganan hati-hati.", health: "❤️ Kesehatan ginjal dan kulit perlu perhatian.", spiritual: "🧘 Temukan diri dalam hubungan, keseimbangan dalam kesendirian.", months: ["Awal Baru", "Hubungan", "Aksi", "Keuangan", "Komunikasi", "Stabilitas", "Transformasi", "Ekspansi", "Integrasi", "Pelepasan", "Pembaruan", "Evaluasi"] } },
  scorpio: { zh: { overall: "2026年天蝎座的重生之年！", love: "🌟 木星在第5宫，感情生活充满可能。", career: "💼 冥王星影响事业，带来深刻转变。", finance: "💰 4月和8月是财运高峰期。", health: "❤️ 生殖系统和代谢需要关注。", spiritual: "🧘 2026是 Scorpio 的转化年。", months: ["新年新气象", "关系与合作", "行动与突破", "财务规划", "沟通表达", "稳定建设", "转变成长", "扩张收获", "深层整合", "释放放下", "转变新生", "年度总结"] }, en: { overall: "2026 Scorpio's year of rebirth!", love: "🌟 Jupiter in 5th house, love life full of possibilities.", career: "💼 Pluto affects career, bringing deep transformation.", finance: "💰 April and August are financial peaks.", health: "❤️ Reproductive and metabolic systems need attention.", spiritual: "🧘 2026 is Scorpio's transformation year.", months: ["Fresh Start", "Relationships", "Action", "Finances", "Communication", "Stability", "Transformation", "Expansion", "Integration", "Release", "Renewal", "Review"] }, id: { overall: "2026 Tahun kelahiran kembali Scorpio!", love: "🌟 Jupiter di rumah 5, kehidupan cinta penuh kemungkinan.", career: "💼 Pluto memengaruhi karir, membawa transformasi mendalam.", finance: "💰 April dan Agustus adalah puncak keuangan.", health: "❤️ Sistem reproduksi dan metabolisme perlu perhatian.", spiritual: "🧘 2026 adalah tahun transformasi Scorpio.", months: ["Awal Baru", "Hubungan", "Aksi", "Keuangan", "Komunikasi", "Stabilitas", "Transformasi", "Ekspansi", "Integrasi", "Pelepasan", "Pembaruan", "Evaluasi"] } },
  sagittarius: { zh: { overall: "2026年射手座智慧扩张年。", love: "🌟 土星考验感情关系，需要承诺和耐心。", career: "💼 高等教育、海外业务、哲学领域有利。", finance: "💰 海外投资可能带来收益。", health: "❤️ 肝脏和臀部健康需注意。", spiritual: "🧘 读万卷书行万里路。", months: ["新年新气象", "关系与合作", "行动与突破", "财务规划", "沟通表达", "稳定建设", "转变成长", "扩张收获", "深层整合", "释放放下", "转变新生", "年度总结"] }, en: { overall: "2026 Sagittarius year of wisdom expansion.", love: "🌟 Saturn tests relationships, need commitment and patience.", career: "💼 Higher education, overseas business, philosophy favorable.", finance: "💰 Overseas investments may bring returns.", health: "❤️ Liver and hip health need attention.", spiritual: "🧘 Read thousands of books, travel thousands of miles.", months: ["Fresh Start", "Relationships", "Action", "Finances", "Communication", "Stability", "Transformation", "Expansion", "Integration", "Release", "Renewal", "Review"] }, id: { overall: "2026 Sagitarius tahun ekspansi kebijaksanaan.", love: "🌟 Saturnus menguji hubungan, perlu komitmen dan kesabaran.", career: "💼 Pendidikan tinggi, bisnis luar negeri, filsafat menguntungkan.", finance: "💰 Investasi luar negeri mungkin membawa hasil.", health: "❤️ Kesehatan hati dan pinggul perlu perhatian.", spiritual: "🧘 Baca ribuan buku, jalani ribuan mil.", months: ["Awal Baru", "Hubungan", "Aksi", "Keuangan", "Komunikasi", "Stabilitas", "Transformasi", "Ekspansi", "Integrasi", "Pelepasan", "Pembaruan", "Evaluasi"] } },
  capricorn: { zh: { overall: "2026年摩羯座厚积薄发。", love: "🌟 金星照亮关系宫，合作与伴侣关系加强。", career: "💼 土星在事业宫，稳扎稳打走向成功。", finance: "💰 8月和11月是财运高峰期。", health: "❤️ 骨骼、膝盖和关节需加强保护。", spiritual: "🧘 上半年积累，下半年收获。", months: ["新年新气象", "关系与合作", "行动与突破", "财务规划", "沟通表达", "稳定建设", "转变成长", "扩张收获", "深层整合", "释放放下", "转变新生", "年度总结"] }, en: { overall: "2026 Capricorn accumulates and flourishes.", love: "🌟 Venus illuminates relationship house, partnerships strengthen.", career: "💼 Saturn in career house, steady progress to success.", finance: "💰 August and November are financial peaks.", health: "❤️ Bones, knees, and joints need protection.", spiritual: "🧘 First half accumulation, second half harvest.", months: ["Fresh Start", "Relationships", "Action", "Finances", "Communication", "Stability", "Transformation", "Expansion", "Integration", "Release", "Renewal", "Review"] }, id: { overall: "2026 Capricorn mengakumulasi dan berkembang.", love: "🌟 Venus menerangi rumah hubungan, kemitraan diperkuat.", career: "💼 Saturnus di rumah karir, kemajuan stabil menuju sukses.", finance: "💰 Agustus dan November adalah puncak keuangan.", health: "❤️ Tulang, lutut, dan sendi perlu perlindungan.", spiritual: "🧘 Akumulasi semester pertama, panen semester kedua.", months: ["Awal Baru", "Hubungan", "Aksi", "Keuangan", "Komunikasi", "Stabilitas", "Transformasi", "Ekspansi", "Integrasi", "Pelepasan", "Pembaruan", "Evaluasi"] } },
  aquarius: { zh: { overall: "2026年水瓶座解放创新年。", love: "🌟 天王星带来关系中的突然变化，需要灵活应对。", career: "💼 土星压力减轻，自主性和自由度提升。", finance: "💰 科技和互联网领域有赚钱机会。", health: "❤️ 小腿和循环系统需关注。", spiritual: "🧘 2026是解放个性和创新之年。", months: ["新年新气象", "关系与合作", "行动与突破", "财务规划", "沟通表达", "稳定建设", "转变成长", "扩张收获", "深层整合", "释放放下", "转变新生", "年度总结"] }, en: { overall: "2026 Aquarius year of liberation and innovation.", love: "🌟 Uranus brings sudden changes in relationships, need flexibility.", career: "💼 Saturn pressure eases, autonomy and freedom increase.", finance: "💰 Tech and internet fields have money-making opportunities.", health: "❤️ Lower legs and circulation need attention.", spiritual: "🧘 2026 is the year of personality liberation and innovation.", months: ["Fresh Start", "Relationships", "Action", "Finances", "Communication", "Stability", "Transformation", "Expansion", "Integration", "Release", "Renewal", "Review"] }, id: { overall: "2026 Aquarius tahun pembebasan dan inovasi.", love: "🌟 Uranus membawa perubahan mendadak dalam hubungan, perlu fleksibilitas.", career: "💼 Tekanan Saturnus mereda, otonomi dan kebebasan meningkat.", finance: "💰 Bidang teknologi dan internet punya peluang menghasilkan uang.", health: "❤️ Kaki bagian bawah dan sirkulasi perlu perhatian.", spiritual: "🧘 2026 adalah tahun pembebasan kepribadian dan inovasi.", months: ["Awal Baru", "Hubungan", "Aksi", "Keuangan", "Komunikasi", "Stabilitas", "Transformasi", "Ekspansi", "Integrasi", "Pelepasan", "Pembaruan", "Evaluasi"] } },
  pisces: { zh: { overall: "2026年双鱼座灵性觉醒年。", love: "🌟 海王星影响感情，需要清晰的界限和自我保护。", career: "💼 木星带来精神和灵性方面的发展。", finance: "💰 艺术、创意和疗愈领域带来收入。", health: "❤️ 脚部和免疫系统需要关注。", spiritual: "🧘 灵性成长的关键年，冥想、艺术创作和自然连接带来深度疗愈。", months: ["新年新气象", "关系与合作", "行动与突破", "财务规划", "沟通表达", "稳定建设", "转变成长", "扩张收获", "深层整合", "释放放下", "转变新生", "年度总结"] }, en: { overall: "2026 Pisces year of spiritual awakening.", love: "🌟 Neptune affects relationships, need clear boundaries and self-protection.", career: "💼 Jupiter brings spiritual and mental development.", finance: "💰 Art, creativity, and healing fields bring income.", health: "❤️ Feet and immune system need attention.", spiritual: "🧘 Key year for spiritual growth, meditation, art, and nature bring deep healing.", months: ["Fresh Start", "Relationships", "Action", "Finances", "Communication", "Stability", "Transformation", "Expansion", "Integration", "Release", "Renewal", "Review"] }, id: { overall: "2026 Pisces tahun kebangkitan spiritual.", love: "🌟 Neptunus memengaruhi hubungan, perlu batasan jelas dan perlindungan diri.", career: "💼 Jupiter membawa perkembangan spiritual dan mental.", finance: "💰 Bidang seni, kreativitas, dan penyembuhan membawa pendapatan.", health: "❤️ Kaki dan sistem imun perlu perhatian.", spiritual: "🧘 Tahun kunci untuk pertumbuhan spiritual, meditasi, seni, dan alam membawa penyembuhan mendalam.", months: ["Awal Baru", "Hubungan", "Aksi", "Keuangan", "Komunikasi", "Stabilitas", "Transformasi", "Ekspansi", "Integrasi", "Pelepasan", "Pembaruan", "Evaluasi"] } }};

const LABELS: Record<string, Record<string, string>> = {
  zh: { title: "2026年度运势", subtitle: "深入解读全年12星座运势", select: "选择星座", overall: "年度总览", love: "爱情运势", career: "事业运势", finance: "财务运势", health: "健康运势", spiritual: "灵性成长", highlight: "年度重点", months: "每月主题", back: "返回首页" },
  en: { title: "2026 Yearly Horoscope", subtitle: "In-depth yearly horoscope for all 12 signs", select: "Select Sign", overall: "Yearly Overview", love: "Love", career: "Career", finance: "Finance", health: "Health", spiritual: "Spiritual", highlight: "Year Highlights", months: "Monthly Themes", back: "Back to Home" },
  id: { title: "Ramalan Tahunan 2026", subtitle: "Ramalan tahunan mendalam untuk 12 zodiak", select: "Pilih Zodiak", overall: "Ikhtisar Tahunan", love: "Cinta", career: "Karier", finance: "Keuangan", health: "Kesehatan", spiritual: "Spiritual", highlight: "Sorotan Tahun", months: "Tema Bulanan", back: "Kembali" }};

export default function YearlyHoroscopePage() {
  const { language } = useLanguage();
  const lang = language || "en";
  const labels = LABELS[lang] || LABELS.en || LABELS.zh;

  const [selectedSign, setSelectedSign] = useState<string>("aries");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    const sign = params.get("sign");
    if (sign && SIGNS.find(s => s.id === sign)) {
      setSelectedSign(sign);
    }
  }, []);

  const signData = SIGNS.find(s => s.id === selectedSign)!;
  const yearlyData = YEARLY_DATA[selectedSign]?.[lang] || YEARLY_DATA[selectedSign]?.en || YEARLY_DATA[selectedSign]?.zh || YEARLY_DATA.aries.en;
  const elemColor = ELEMENT_COLORS[signData?.element] || "#a855f7";
  const currentMonth = new Date().getMonth() + 1;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      {/* 导航 */}
      

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* 标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500/20 rounded-full text-sm text-gray-600 mb-4">
            <Calendar size={16} className="fill-gray-300" />
            <span>2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{labels.title}</h1>
          <p className="text-gray-500">{labels.subtitle}</p>
        </div>

        {/* 星座选择 */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-3 text-center">{labels.select}</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
            {SIGNS.map(sign => {
              const isActive = selectedSign === sign.id;
              return (
                <button
                  key={sign.id}
                  onClick={() => setSelectedSign(sign.id)}
                  className={`relative p-3 rounded-xl text-center transition-all ${
                    isActive
                      ? "bg-gray-100 border border-gray-300 text-gray-700"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-600 border border-transparent"
                  }`}
                >
                  <div className="text-2xl mb-1">{sign.symbol}</div>
                  <div className="text-xs truncate">{sign.names[lang as keyof typeof sign.names] || sign.names.en || sign.names.zh}</div>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ELEMENT_COLORS[sign.element] }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 星座标题 */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-2" style={{ color: elemColor }}>{signData.symbol}</div>
          <h2 className="text-2xl font-bold" style={{ color: elemColor }}>
            {signData.names[lang as keyof typeof signData.names] || signData.names.en || signData.names.zh}
          </h2>
          <p className="text-gray-500 text-sm mt-1">2026 {labels.highlight}</p>
        </div>

        {/* 年度总览 */}
        <div className="bg-gradient-to-br from-gray-50/30 to-gray-900/20 border border-gray-200 rounded-2xl p-6 mb-6">
          <h3 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
            <Star size={16} className="fill-gray-300" /> {labels.overall}
          </h3>
          <p className="text-gray-600 leading-relaxed text-sm">{yearlyData.overall}</p>
        </div>

        {/* 五维度 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[
            { key: "love", color: "#FF6B9D", icon: "💕" },
            { key: "career", color: "#4ECDC4", icon: "💼" },
            { key: "finance", color: "#FFD93D", icon: "💰" },
            { key: "health", color: "#FF6B6B", icon: "❤️" },
            { key: "spiritual", color: "#A78BFA", icon: "🧘" },
          ].map(({ key, color, icon }) => (
            <div key={key} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{icon}</span>
                <span className="text-sm font-medium" style={{ color }}>{(labels as any)[key]}</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{(yearlyData as any)[key]}</p>
            </div>
          ))}
        </div>

        {/* 每月主题 */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
            <Calendar size={16} /> {labels.months}
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {(yearlyData.months || []).map((theme: string, idx: number) => {
              const month = idx + 1;
              const isNow = month === currentMonth;
              return (
                <div key={month}
                  className={`text-center p-2 rounded-lg text-xs ${
                    isNow
                      ? "bg-gray-500/20 border border-gray-500/40 text-gray-600"
                      : "bg-gray-50 text-gray-500"
                  }`}
                >
                  <div className={`font-bold text-base mb-0.5 ${isNow ? "text-gray-600" : "text-gray-600"}`}>
                    {month}{lang==='zh'?'月':lang==='ja'?'月':lang==='ko'?'월':''}
                  </div>
                  <div className="truncate">{theme}</div>
                  {isNow && <div className="text-[8px] text-gray-600 mt-0.5">NOW</div>}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
