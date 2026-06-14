"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ArrowLeft, Sparkles, Shuffle, RefreshCw, Lock, Share2, CheckCircle, MessageCircle } from "lucide-react";

// Complete Tarot Card Data with full meanings
const TAROT_CARDS = [
  { id: 0, name: { zh: "愚人", en: "The Fool", id: "The Fool", th: "เด็กบ้า", vi: "Kẻ Ngốc", ms: "The Fool", ja: "愚者", ko: "바보" }, image: "0", meaning: { zh: "新的开始，冒险，纯真，自发性", en: "New beginnings, adventure, innocence, spontaneity", id: "Awal baru, petualangan, kepolosan" }, element: "Air", number: 0, keywords: { zh: ["冒险", "自由", "无限可能"], en: ["Adventure", "Freedom", "Infinite possibilities"], id: ["Petualangan", "Kebebasan", "Kemungkinan tak terbatas"] } },
  { id: 1, name: { zh: "魔术师", en: "The Magician", id: "The Magician", th: "นักเวทย์", vi: "Nhà Ảo Thuật", ms: "The Magician", ja: "魔術師", ko: "마법사" }, image: "I", meaning: { zh: "创造力，意志力，显化，技能", en: "Creativity, willpower, manifestation, skill", id: "Kreativitas, tekad, manifestasi" }, element: "Air", number: 1, keywords: { zh: ["实现", "行动", "自信"], en: ["Manifestation", "Action", "Confidence"], id: ["Manifestasi", "Aksi", "Kepercayaan diri"] } },
  { id: 2, name: { zh: "女祭司", en: "The High Priestess", id: "The High Priestess", th: "หญิงสาวเฒ่า", vi: "Nữ Giáo Chủ", ms: "The High Priestess", ja: "女教皇", ko: "여사제" }, image: "II", meaning: { zh: "直觉，神秘，内在智慧，子宫", en: "Intuition, mystery, inner wisdom, the unconscious", id: "Intuisi, misteri, kebijaksanaan" }, element: "Water", number: 2, keywords: { zh: ["秘密", "直觉", "灵性"], en: ["Secret", "Intuition", "Spirituality"], id: ["Rahasia", "Intuisi", "Spiritualitas"] } },
  { id: 3, name: { zh: "皇后", en: "The Empress", id: "The Empress", th: "ราชินี", vi: "Nữ Hoàng", ms: "The Empress", ja: "女帝", ko: "여제" }, image: "III", meaning: { zh: "丰饶，母性，创造力，自然", en: "Abundance, motherhood, creativity, nature", id: "Kelimpahan, keibuan, kreativitas" }, element: "Earth", number: 3, keywords: { zh: ["富足", "魅力", "滋养"], en: ["Fertility", "Charm", "Nurturing"], id: ["Kesuburan", "Daya tarik", "Perawatan"] } },
  { id: 4, name: { zh: "皇帝", en: "The Emperor", id: "The Emperor", th: "จักรพรรดิ", vi: "Nam Hoàng", ms: "The Emperor", ja: "皇帝", ko: "황제" }, image: "IV", meaning: { zh: "权威，结构，父性，领导力", en: "Authority, structure, fatherhood, leadership", id: "Otoritas, struktur, kebapakan" }, element: "Fire", number: 4, keywords: { zh: ["秩序", "控制", "力量"], en: ["Order", "Control", "Strength"], id: ["Ketertiban", "Kontrol", "Kekuatan"] } },
  { id: 5, name: { zh: "教皇", en: "The Hierophant", id: "The Hierophant", th: "สมณะ", vi: "Giáo Hoàng", ms: "The Hierophant", ja: "法王", ko: "교황" }, image: "V", meaning: { zh: "传统，精神指引，教育，信仰", en: "Tradition, spiritual guidance, education, faith", id: "Tradisi, panduan spiritual, pendidikan" }, element: "Earth", number: 5, keywords: { zh: ["信仰", "传统", "智慧"], en: ["Faith", "Tradition", "Wisdom"], id: ["Iman", "Tradisi", "Kebijaksanaan"] } },
  { id: 6, name: { zh: "恋人", en: "The Lovers", id: "The Lovers", th: "คู่รัก", vi: "Người Yêu", ms: "The Lovers", ja: "恋人", ko: "연인" }, image: "VI", meaning: { zh: "爱情，选择，和谐，价值观", en: "Love, choices, harmony, values", id: "Cinta, pilihan, harmoni" }, element: "Air", number: 6, keywords: { zh: ["爱情", "选择", "结合"], en: ["Love", "Choice", "Union"], id: ["Cinta", "Pilihan", "Persatuan"] } },
  { id: 7, name: { zh: "战车", en: "The Chariot", id: "The Chariot", th: "รถรบ", vi: "Chiến Xa", ms: "The Chariot", ja: "戦車", ko: "전차" }, image: "VII", meaning: { zh: "意志力，胜利，决心，竞争", en: "Willpower, victory, determination, competition", id: "Tekad, kemenangan, determinasi" }, element: "Water", number: 7, keywords: { zh: ["胜利", "意志", "控制"], en: ["Victory", "Will", "Control"], id: ["Kemenangan", "Kehendak", "Kontrol"] } },
  { id: 8, name: { zh: "力量", en: "Strength", id: "Strength", th: "ความแข็งแกร่ง", vi: "Sức Mạnh", ms: "Strength", ja: "力", ko: "힘" }, image: "VIII", meaning: { zh: "勇气，耐心，内在力量，怜悯", en: "Courage, patience, inner strength, compassion", id: "Keberanian, kesabaran, kekuatan" }, element: "Fire", number: 8, keywords: { zh: ["勇气", "耐心", "温柔"], en: ["Courage", "Patience", "Gentleness"], id: ["Keberanian", "Kesabaran", "Kelemah lembut"] } },
  { id: 9, name: { zh: "隐士", en: "The Hermit", id: "The Hermit", th: "โยคี", vi: "Ẩn Sĩ", ms: "The Hermit", ja: "隠者", ko: "은자" }, image: "IX", meaning: { zh: "内省，独处，寻求真理，引导", en: "Introspection, solitude, seeking truth, guidance", id: "Introspeksi, kesendirian, kebenaran" }, element: "Earth", number: 9, keywords: { zh: ["探索", "内省", "独处"], en: ["Search", "Introspection", "Solitude"], id: ["Pencarian", "Introspeksi", "Kesendirian"] } },
  { id: 10, name: { zh: "命运之轮", en: "Wheel of Fortune", id: "Wheel of Fortune", th: "ล้อแห่งโชคชะตา", vi: "Bánh Xe May Mắn", ms: "Wheel of Fortune", ja: "運命の輪", ko: "운명의 수레바퀴" }, image: "X", meaning: { zh: "变化，命运，周期，好运坏运", en: "Change, destiny, cycles, good/bad luck", id: "Perubahan, takdir, siklus" }, element: "Fire", number: 10, keywords: { zh: ["转折", "命运", "循环"], en: ["Turn", "Destiny", "Cycle"], id: ["Perputaran", "Takdir", "Siklus"] } },
  { id: 11, name: { zh: "正义", en: "Justice", id: "Justice", th: "นรก", vi: "Công Lý", ms: "Justice", ja: "正義", ko: "정의" }, image: "XI", meaning: { zh: "公正，平衡，因果报应，真相", en: "Justice, balance, cause and effect, truth", id: "Keadilan, keseimbangan, sebab-akibat" }, element: "Air", number: 11, keywords: { zh: ["公正", "真相", "法律"], en: ["Justice", "Truth", "Law"], id: ["Keadilan", "Kebenaran", "Hukum"] } },
  { id: 12, name: { zh: "倒吊人", en: "The Hanged Man", id: "The Hanged Man", th: "คนห้อยหัว", vi: "Người Treo Ngược", ms: "The Hanged Man", ja: "吊られた男", ko: "매달린 사람" }, image: "XII", meaning: { zh: "牺牲，新视角，等待，臣服", en: "Sacrifice, new perspective, waiting, surrender", id: "Pengorbanan, perspektif baru, menunggu" }, element: "Water", number: 12, keywords: { zh: ["暂停", "洞察", "放松"], en: ["Pause", "Insight", "Release"], id: ["Jeda", "Wawasan", "Pelepasan"] } },
  { id: 13, name: { zh: "死神", en: "Death", id: "Death", th: "ความตาย", vi: "Cái Chết", ms: "Death", ja: "死神", ko: "죽음" }, image: "XIII", meaning: { zh: "转变，结束，新生，释放", en: "Transformation, ending, rebirth, release", id: "Transformasi, akhir, kelahiran" }, element: "Water", number: 13, keywords: { zh: ["结束", "转变", "重生"], en: ["Ending", "Transition", "Rebirth"], id: ["Akhir", "Transisi", "Kelahiran kembali"] } },
  { id: 14, name: { zh: "节制", en: "Temperance", id: "Temperance", th: "การประพฤติ", vi: "Tiết Độ", ms: "Temperance", ja: "節制", ko: "절제" }, image: "XIV", meaning: { zh: "平衡，调和，耐心，宽容", en: "Balance, moderation, patience, forgiveness", id: "Keseimbangan, kesederhanaan, kesabaran" }, element: "Fire", number: 14, keywords: { zh: ["平衡", "调和", "耐心"], en: ["Balance", "Harmony", "Patience"], id: ["Keseimbangan", "Harmoni", "Kesabaran"] } },
  { id: 15, name: { zh: "恶魔", en: "The Devil", id: "The Devil", th: "ปีศาจ", vi: "Ác Quỷ", ms: "The Devil", ja: "悪魔", ko: "악마" }, image: "XV", meaning: { zh: "束缚，欲望，物质主义，贪婪", en: "Bondage, desire, materialism, greed", id: "Belenggu, keinginan, materialisme" }, element: "Earth", number: 15, keywords: { zh: ["束缚", "欲望", "阴影"], en: ["Bondage", "Desire", "Shadow"], id: ["Belenggu", "Keinginan", "Bayangan"] } },
  { id: 16, name: { zh: "塔", en: "The Tower", id: "The Tower", th: "หอคอย", vi: "Ngọn Tháp", ms: "The Tower", ja: "塔", ko: "탑" }, image: "XVI", meaning: { zh: "突变，觉醒，破坏，神的介入", en: "Sudden change, awakening, destruction, divine intervention", id: "Perubahan mendadak, kebangkitan" }, element: "Fire", number: 16, keywords: { zh: ["冲击", "觉醒", "解放"], en: ["Shock", "Awakening", "Liberation"], id: ["Kaget", "Kebangkitan", "Pembebasan"] } },
  { id: 17, name: { zh: "星星", en: "The Star", id: "The Star", th: "ดวงดาว", vi: "Ngôi Sao", ms: "The Star", ja: "星", ko: "별" }, image: "XVII", meaning: { zh: "希望，灵感，宁静，和平", en: "Hope, inspiration, serenity, peace", id: "Harapan, inspirasi, ketenangan" }, element: "Air", number: 17, keywords: { zh: ["希望", "疗愈", "灵感"], en: ["Hope", "Healing", "Inspiration"], id: ["Harapan", "Penyembuhan", "Inspirasi"] } },
  { id: 18, name: { zh: "月亮", en: "The Moon", id: "The Moon", th: "ดวงจันทร์", vi: "Mặt Trăng", ms: "The Moon", ja: "月", ko: "달" }, image: "XVIII", meaning: { zh: "幻觉，恐惧，潜意识，欺骗", en: "Illusion, fear, subconscious, deception", id: "Ilusi, ketakutan, alam bawah sadar" }, element: "Water", number: 18, keywords: { zh: ["幻觉", "恐惧", "直觉"], en: ["Illusion", "Fear", "Intuition"], id: ["Ilusi", "Takut", "Intuisi"] } },
  { id: 19, name: { zh: "太阳", en: "The Sun", id: "The Sun", th: "ดวงอาทิตย์", vi: "Mặt Trời", ms: "The Sun", ja: "太陽", ko: "태양" }, image: "XIX", meaning: { zh: "快乐，成功，活力，生命力", en: "Joy, success, vitality, life force", id: "Kegembiraan, sukses, vitalitas" }, element: "Fire", number: 19, keywords: { zh: ["快乐", "成功", "活力"], en: ["Joy", "Success", "Vitality"], id: ["Kegembiraan", "Sukses", "Vitalitas"] } },
  { id: 20, name: { zh: "审判", en: "Judgement", id: "Judgement", th: "การตัดสิน", vi: "Sự Phán Xét", ms: "Judgement", ja: "裁判", ko: "심판" }, image: "XX", meaning: { zh: "重生，觉醒，宽恕，复兴", en: "Rebirth, awakening, forgiveness, renewal", id: "Kelahiran baru, kebangkitan, pengampunan" }, element: "Fire", number: 20, keywords: { zh: ["觉醒", "复活", "判断"], en: ["Awakening", "Resurrection", "Judgement"], id: ["Kebangkitan", "Kebangkitan", "Penilaian"] } },
  { id: 21, name: { zh: "世界", en: "The World", id: "The World", th: "โลก", vi: "Thế Giới", ms: "The World", ja: "世界", ko: "세계" }, image: "XXI", meaning: { zh: "完成，成就，圆满，旅行", en: "Completion, achievement, fulfillment, journey", id: "Penyelesaian, pencapaian, pemenuhan" }, element: "Earth", number: 21, keywords: { zh: ["完成", "成就", "整合"], en: ["Completion", "Achievement", "Integration"], id: ["Penyelesaian", "Pencapaian", "Integrasi"] } },
];

// Enhanced Tarot Spreads with position meanings
const SPREADS = [
  { id: "single", name: { zh: "单张抽牌", en: "Single Card", id: "Satu Kartu", th: "ไพ่ใบเดียว", vi: "Một Lá", ms: "Satu Kad", ja: "一枚のカード", ko: "한 장의 카드" }, desc: { zh: "快速获取今日指引", en: "Quick daily guidance", id: "Panduan cepat harian", th: "คำแนะนำ速", vi: "Hướng dẫn nhanh", ms: "Panduan cepat", ja: "素早いガイダンス", ko: "빠른 안내" }, cards: 1, positions: { zh: ["当前指引"], en: ["Current Guidance"], id: ["Panduan Saat Ini"], th: ["คำแนะนำปัจจุบัน"], vi: ["Hướng dẫn hiện tại"], ms: ["Panduan semasa"], ja: ["現在のガイダンス"], ko: ["현재 안내"] } },
  { id: "three", name: { zh: "三牌占卜", en: "Three Cards", id: "Tiga Kartu", th: "สามใบ", vi: "Ba Lá", ms: "Tiga Kad", ja: "三枚のカード", ko: "세 장의 카드" }, desc: { zh: "过去-现在-未来", en: "Past-Present-Future", id: "Masa Lalu-Kini-Masa Depan", th: "อดีต-ปัจจุบัน-อนาคต", vi: "Quá khứ-Hiện tại-Tương lai", ms: "Lalu-Sekarang-Akan datang", ja: "過去-現在-未来", ko: "과거-현재-미래" }, cards: 3, positions: { zh: ["🕐 过去", "🕐 现在", "🕐 未来"], en: ["🕐 Past", "🕐 Present", "🕐 Future"], id: ["🕐 Masa Lalu", "🕐 Sekarang", "🕐 Masa Depan"], th: ["🕐 อดีต", "🕐 ปัจจุบัน", "🕐 อนาคต"], vi: ["🕐 Quá khứ", "🕐 Hiện tại", "🕐 Tương lai"], ms: ["🕐 Masa lalu", "🕐 Sekarang", "🕐 Akan datang"], ja: ["🕐 過去", "🕐 現在", "🕐 未来"], ko: ["🕐 과거", "🕐 현재", "🕐 미래"] } },
  { id: "yesno", name: { zh: "是/否牌阵", en: "Yes/No Spread", id: "Spread Ya/Tidak", th: "ใช่/ไม่ใช่", vi: "Có/Không", ms: "Ya/Tidak", ja: "はい/いいえ", ko: "예/아니오" }, desc: { zh: "快速解答是非题", en: "Quick yes/no answer", id: "Jawaban ya/tidak cepat", th: "คำตอบใช่/ไม่ใช่速", vi: "Trả lời có/không nhanh", ms: "Jawapan ya/tidak cepat", ja: "素早いはい/いいえ", ko: "빠른 예/아니오" }, cards: 3, positions: { zh: ["🟢 是", "⚫ 否", "🟡 中立"], en: ["🟢 Yes", "⚫ No", "🟡 Neutral"], id: ["🟢 Ya", "⚫ Tidak", "🟡 Netral"], th: ["🟢 ใช่", "⚫ ไม่ใช่", "🟡 กลาง"], vi: ["🟢 Có", "⚫ Không", "🟡 Trung lập"], ms: ["🟢 Ya", "⚫ Tidak", "🟡 Neutral"], ja: ["🟢 はい", "⚫ いいえ", "🟡 中立"], ko: ["🟢 예", "⚫ 아니오", "🟡 중립"] } },
  { id: "horseshoe", name: { zh: "马蹄牌阵", en: "Horseshoe", id: "Horseshoe", th: "เกือกม้า", vi: "Móng Ngựa", ms: "Horseshoe", ja: "马蹄", ko: "발굽" }, desc: { zh: "7张牌深度分析", en: "7 cards deep analysis", id: "Analisis mendalam 7 kartu", th: "วิเคราะห์เชิงลึก 7 ใบ", vi: "Phân tích sâu 7 lá", ms: "Analisis mendalam 7 kad", ja: "7枚の深的分析", ko: "7장 심층 분석" }, cards: 7, positions: { zh: ["🌟 核心问题", "📍 环境/背景", "🔮 障碍", "💪 资源/优势", "🎯 建议行动", "🔮 外部影响", "✨ 结果"], en: ["🌟 Core Issue", "📍 Environment", "🔮 Obstacle", "💪 Resources", "🎯 Action Advice", "🔮 External Influence", "✨ Outcome"], id: ["🌟 Isu Inti", "📍 Lingkungan", "🔮 Hambatan", "💪 Sumber Daya", "🎯 Saran Aksi", "🔮 Pengaruh Eksternal", "✨ Hasil"], th: ["🌟 ประเด็นหลัก", "📍 สภาพแวดล้อม", "🔮 อุปสรรค", "💪 ทรัพยากร", "🎯 คำแนะนำ", "🔮 อิทธิพลภายนอก", "✨ ผลลัพธ์"], vi: ["🌟 Vấn đề cốt lõi", "📍 Bối cảnh", "🔮 Trở ngại", "💪 Nguồn lực", "🎯 Lời khuyên", "🔮 Ảnh hưởng bên ngoài", "✨ Kết quả"], ms: ["🌟 Isu Teras", "📍 Persekitaran", "🔮 Halangan", "💪 Sumber", "🎯 Nasihat Tindakan", "🔮 Pengaruh Luaran", "✨ Keputusan"], ja: ["🌟 核心問題", "📍 環境", "🔮 障害", "💪 資源", "🎯 提案行動", "🔮 外的影響", "✨ 結果"], ko: ["🌟 핵심 문제", "📍 환경", "🔮 장애", "💪 자원", "🎯 조언", "🔮 외부 영향", "✨ 결과"] } },
  { id: "relationship", name: { zh: "关系牌阵", en: "Relationship", id: "Relationship", th: "ความสัมพันธ์", vi: "Mối Quan Hệ", ms: "Hubungan", ja: "関係", ko: "관계" }, desc: { zh: "深入分析两人关系", en: "Deep two-person analysis", id: "Analisis mendalam dua orang", th: "วิเคราะห์สองคนลึก", vi: "Phân tích hai người sâu", ms: "Analisis mendalam dua orang", ja: "二人の深的分析", ko: "두 사람 심층 분석" }, cards: 5, positions: { zh: ["🧑 你", "🧑 对方", "💕 关系基础", "💭 对方想法", "✨ 关系走向"], en: ["🧑 You", "🧑 Them", "💕 Relationship Base", "💭 Their Thoughts", "✨ Relationship Direction"], id: ["🧑 Kamu", "🧑 Mereka", "💕 Dasar Hubungan", "💭 Pikiran Mereka", "✨ Arah Hubungan"], th: ["🧑 คุณ", "🧑 เขา/เธอ", "💕 พื้นฐานความสัมพันธ์", "💭 ความคิดเขา/เธอ", "✨ ทิศทางความสัมพันธ์"], vi: ["🧑 Bạn", "🧑 Đối phương", "💕 Nền tảng quan hệ", "💭 Suy nghĩ đối phương", "✨ Hướng quan hệ"], ms: ["🧑 Anda", "🧑 Mereka", "💕 Asas Hubungan", "💭 Fikiran Mereka", "✨ Arah Hubungan"], ja: ["🧑 あなた", "🧑 相手", "💕 関係の基盤", "💭 相手の考え", "✨ 関係の方向性"], ko: ["🧑 당신", "🧑 상대방", "💕 관계 기반", "💭 상대방 생각", "✨ 관계 방향"] } },
  { id: "career", name: { zh: "事业牌阵", en: "Career Spread", id: "Career Spread", th: "การงาน", vi: "Sự Nghiệp", ms: "Kerjaya", ja: "キャリア", ko: "커리어" }, desc: { zh: "职业发展指引", en: "Career development guidance", id: "Panduan pengembangan karier", th: "แนะนำการพัฒนาอาชีพ", vi: "Hướng dẫn phát triển sự nghiệp", ms: "Panduan pembangunan kerjaya", ja: "キャリア発達ガイダンス", ko: "커리어 개발 안내" }, cards: 5, positions: { zh: ["📍 当前状况", "⚡ 挑战", "💪 优势", "🎯 建议方向", "✨ 可能的成果"], en: ["📍 Current Situation", "⚡ Challenge", "💪 Strengths", "🎯 Advice", "✨ Possible Outcome"], id: ["📍 Situasi Saat Ini", "⚡ Tantangan", "💪 Kekuatan", "🎯 Saran", "✨ Hasil Mungkin"], th: ["📍 สถานการณ์ปัจจุบัน", "⚡ ความท้าทาย", "💪 จุดแข็ง", "🎯 คำแนะนำ", "✨ ผลลัพธ์ที่เป็นไปได้"], vi: ["📍 Tình hình hiện tại", "⚡ Thách thức", "💪 Điểm mạnh", "🎯 Lời khuyên", "✨ Kết quả có thể"], ms: ["📍 Situasi Semasa", "⚡ Cabaran", "💪 Kekuatan", "🎯 Nasihat", "✨ Hasil yang mungkin"], ja: ["📍 現在の状況", "⚡ 挑戦", "💪 強み", "🎯 提案", "✨ 可能な結果"], ko: ["📍 현재 상황", "⚡ 도전", "💪 강점", "🎯 조언", "✨ 가능한 결과"] } },
  { id: "celtic", name: { zh: "凯尔特十字", en: "Celtic Cross", id: "Celtic Cross", th: "ครอสเซลติก", vi: "Thánh Giá Celtic", ms: "Salib Celtic", ja: "ケルト十字", ko: "켈트 십자" }, desc: { zh: "10牌阵最完整解读", en: "10 cards most complete reading", id: "10 kartu bacaan paling lengkap", th: "อ่าน 10 ใบที่สมบูรณ์ที่สุด", vi: "10 lá đọc đầy đủ nhất", ms: "10 kad bacaan paling lengkap", ja: "10枚の最も完全な読み", ko: "10장 가장 완전한 리딩" }, cards: 10, positions: { zh: ["💼 当前问题", "🔮 障碍", "🧬 过去", "👑 近期过去", "🎯 可能结果", "🔮 近期未来", "🧑 自我", "🌍 周围环境", "💭 希望/恐惧", "✨ 最终结果"], en: ["💼 Present Issue", "🔮 Challenge", "🧬 Past", "👑 Recent Past", "🎯 Possible Outcome", "🔮 Near Future", "🧑 Self", "🌍 Surroundings", "💭 Hopes/Fears", "✨ Final Outcome"], id: ["💼 Isu Saat Ini", "🔮 Tantangan", "🧬 Masa Lalu", "👑 Masa Lalu Dekat", "🎯 Hasil Mungkin", "🔮 Masa Depan Dekat", "🧑 Diri", "🌍 Sekitar", "💭 Harapan/Takut", "✨ Hasil Akhir"], th: ["💼 ประเด็นปัจจุบัน", "🔮 ความท้าทาย", "🧬 อดีต", "👑 อดีตใกล้", "🎯 ผลลัพธ์ที่เป็นไปได้", "🔮 อนาคตใกล้", "🧑 ตัวเอง", "🌍 สภาพแวดล้อม", "💭 ความหวัง/ความกลัว", "✨ ผลลัพธ์สุดท้าย"], vi: ["💼 Vấn đề hiện tại", "🔮 Thách thức", "🧬 Quá khứ", "👑 Gần đây", "🎯 Kết quả có thể", "🔮 Tương lai gần", "🧑 Bản thân", "🌍 Xung quanh", "💭 Hy vọng/Sợ hãi", "✨ Kết quả cuối"], ms: ["💼 Isu Semasa", "🔮 Cabaran", "🧬 Masa lalu", "👑 Masa lalu dekat", "🎯 Hasil yang mungkin", "🔮 Akan datang dekat", "🧑 Diri", "🌍 Sekitar", "💭 Harapan/Takut", "✨ Hasil Akhir"], ja: ["💼 現在の問題", "🔮 障害", "🧬 過去", "👑 近い過去", "🎯 可能な結果", "🔮 近い未来", "🧑 自己", "🌍 周囲", "💭 希望/恐れ", "✨ 最終結果"], ko: ["💼 현재 문제", "🔮 장애", "🧬 과거", "👑 최근 과거", "🎯 가능한 결과", "🔮 가까운 미래", "🧑 자아", "🌍 주변", "💭 희망/두려움", "✨ 최종 결과"] } },
  { id: "year", name: { zh: "年度运势", en: "Year Ahead", id: "Year Ahead", th: "ดวงประจำปี", vi: "Tử Vi Năm", ms: "Ramalan Tahunan", ja: "年間運勢", ko: "올해 운세" }, desc: { zh: "12个月月度指引", en: "12 month guidance", id: "Panduan 12 bulan", th: "คำทำนาย 12 เดือน", vi: "Dự đoán 12 tháng", ms: "Ramalan 12 bulan", ja: "12ヶ月予報", ko: "12개월 운세" }, cards: 12, positions: { zh: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], id: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"], th: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."], vi: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"], ms: ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogo", "Sep", "Okt", "Nov", "Dis"], ja: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"], ko: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"] } },
];

// AI Reading Database
const TAROT_READINGS: Record<string, Record<string, Record<string, string>>> = {
  zh: {
    general: {
      "The Fool": "今天的你充满了冒险精神！勇敢尝试新事物吧，这会给你带来意想不到的收获。不过也要注意安全，不要太过冲动。",
      "The Magician": "你拥有实现目标的所有能力！今天适合展现你的才华和能力，积极行动会给你带来好运。",
      "The High Priestess": "相信你的直觉！今天适合内省和冥想，答案就在你心中。",
      "The Empress": "今天运势极佳，适合创作和享受生活。爱情运也很好，单身者有机会遇到心仪对象。",
      "The Emperor": "今天是务实的一天，适合处理工作和财务问题。你的领导能力会得到展现。",
      "The Hierophant": "今天适合学习新知识或参加培训。传统价值观会给你带来帮助。",
      "The Lovers": "感情运极佳的一天！单身者有机会遇到真爱，已有伴侣者关系更加亲密。",
      "The Chariot": "今天运势强劲，适合推进重要项目。通过努力和决心，你一定能取得成功。",
      "Strength": "今天需要你展现耐心和勇气。保持冷静，用智慧解决问题。",
      "The Hermit": "今天适合独处和内省。花时间思考会让你获得新的洞见。",
      "Wheel of Fortune": "命运之轮在转动！好运即将来临。保持开放的心态接受变化。",
      "Justice": "今天做事要公正无私。你会得到应有的回报。",
      "The Hanged Man": "有时候暂停和等待是必要的。今天适合换个角度看问题。",
      "Death": "结束是新的开始。今天可能会有一些结束，但这是为了更好的开始。",
      "Temperance": "今天适合追求平衡和和谐。避免极端，保持中庸之道。",
      "The Devil": "今天要警惕诱惑和束缚。不要被物质欲望控制。",
      "The Tower": "今天可能有突如其来的变化。保持冷静，这是觉醒的时刻。",
      "The Star": "充满希望和灵感的一天！跟随你的内心，你会找到方向。",
      "The Moon": "今天要警惕欺骗和幻觉。不要轻信表象，多听听内心的声音。",
      "The Sun": "今天是最幸运的一天！充满快乐和成功。享受这美好的一天！",
      "Judgement": "今天是觉醒和重生的日子。过去的经历会给你带来新的理解。",
      "The World": "一个阶段的完成！今天适合庆祝成果，规划新的目标。",
    },
    love: {
      "The Fool": "爱情中需要勇气和冒险精神。不要害怕表达你的感受。",
      "The Magician": "用创意和真心来经营感情。你们的爱情充满可能。",
      "The High Priestess": "相信直觉在感情中的指引。真实的连接来自内心。",
      "The Empress": "爱情运势极佳！享受甜蜜的相处时光。",
      "The Emperor": "感情中需要责任和承诺。稳定的关系需要双方努力。",
      "The Lovers": "感情运最旺！可能是命中注定的相遇或关系升华。",
      "The Chariot": "通过努力和沟通，感情中的问题都能解决。",
      "Strength": "用温柔和耐心来爱。这是感情中最珍贵的品质。",
      "The Hermit": "有时候独处能帮助你更清楚地认识感情。",
      "Wheel of Fortune": "感情运势在转变。可能会有意想不到的发展。",
      "Death": "旧的感情模式在结束，新的开始即将到来。",
      "Temperance": "感情中追求平衡很重要。避免极端，保持和谐。",
      "The Devil": "警惕感情中的束缚和不健康的关系。",
      "The Tower": "感情中可能会有突然的觉醒或结束。",
      "The Star": "充满希望的爱情！真愛就在不远处。",
      "The Moon": "感情中可能有误解或欺骗。要看清真相。",
      "The Sun": "最美好的爱情时光！充满快乐和温暖。",
    },
    career: {
      "The Fool": "职场中尝试新方法可能会有惊喜。",
      "The Magician": "展现你的能力！你有成功所需的一切。",
      "The Emperor": "今天适合处理工作事务。稳扎稳打。",
      "The Chariot": "工作运势强劲，适合推进项目。",
      "The Star": "灵感不断，适合创意工作。",
      "The Sun": "职场最幸运的日子！可能有晋升或认可。",
    },
  },
  en: {
    general: {
      "The Fool": "You're filled with adventure spirit today! Be brave and try new things. Just be mindful of safety.",
      "The Magician": "You have all the abilities to achieve your goals! Today is great for showcasing your talents.",
      "The High Priestess": "Trust your intuition! Today is good for reflection and meditation.",
      "The Empress": "Excellent fortune today! Great for creativity and enjoying life.",
      "The Emperor": "A practical day. Great for work and financial matters.",
      "The Hierophant": "Great day for learning or training. Traditional values help.",
      "The Lovers": "Love fortune is excellent! Singles may meet their match.",
      "The Chariot": "Strong fortune today. Through effort and determination, you'll succeed.",
      "Strength": "Today requires patience and courage. Stay calm and use wisdom.",
      "The Hermit": "Great day for solitude and introspection.",
      "Wheel of Fortune": "The wheel of fate is turning! Good luck is coming.",
      "Justice": "Act fairly today. You will receive what you deserve.",
      "Death": "Endings are new beginnings. This is for a better start.",
      "The Star": "A hopeful and inspiring day! Follow your heart.",
      "The Sun": "The luckiest day! Full of joy and success.",
    },
    love: {
      "The Fool": "Love requires courage and adventure. Don't fear expressing your feelings.",
      "The Magician": "Use creativity and sincerity in your relationship.",
      "The Lovers": "The strongest love day! A fateful meeting or relationship deepening.",
      "The Star": "Hopeful love! True love is not far away.",
    },
    career: {
      "The Fool": "Trying new approaches at work may bring surprises.",
      "The Magician": "Show your abilities! You have everything needed for success.",
      "The Chariot": "Strong work fortune. Great for pushing projects forward.",
    },
  },
  id: {
    general: {
      "The Fool": "Hari ini penuh semangat petualang! Coba hal baru dengan berani.",
      "The Magician": "Kamu punya semua kemampuan untuk mencapai tujuanmu!",
      "The High Priestess": "Percayai intuisimu! Hari ini baik untuk refleksi.",
      "The Empress": "Keberuntungan excellent hari ini! Bagus untuk kreativitas.",
      "The Lovers": "Keberuntungan cinta paling tinggi!",
      "The Star": "Hari penuh harapan dan inspirasi!",
      "The Sun": "Hari paling beruntung! Penuh kegembiraan.",
    },
    love: {
      "The Fool": "Cinta membutuhkan keberanian. Jangan takut ungkapkan perasaan.",
      "The Magician": "Gunakan kreativitas dan ketulusan dalam hubungan.",
      "The Lovers": "Hari cinta terkuat! Mungkin pertemuan jodoh.",
    },
  },
};

// Tarot card visual component with actual card design
function TarotCardVisual({ card, isRevealed, index, spreadLength }: { card: typeof TAROT_CARDS[0]; isRevealed: boolean; index: number; spreadLength: number }) {
  const bgColors: Record<number, string> = {
    0: "from-amber-600 to-yellow-500", // Fool
    1: "from-red-600 to-orange-500", // Magician
    2: "from-blue-700 to-indigo-600", // Priestess
    3: "from-green-600 to-emerald-500", // Empress
    4: "from-red-700 to-rose-600", // Emperor
    5: "from-pink-600 to-rose-500", // Hierophant
    6: "from-cyan-500 to-sky-400", // Lovers
    7: "from-amber-700 to-orange-600", // Chariot
    8: "from-orange-600 to-amber-500", // Strength
    9: "from-slate-600 to-gray-500", // Hermit
    10: "from-purple-600 to-violet-500", // Wheel
    11: "from-yellow-500 to-amber-400", // Justice
    12: "from-blue-600 to-cyan-500", // Hanged
    13: "from-slate-800 to-gray-700", // Death
    14: "from-teal-500 to-cyan-400", // Temperance
    15: "from-red-800 to-rose-700", // Devil
    16: "from-red-700 to-orange-600", // Tower
    17: "from-blue-400 to-cyan-300", // Star
    18: "from-indigo-700 to-purple-600", // Moon
    19: "from-yellow-400 to-amber-300", // Sun
    20: "from-pink-500 to-rose-400", // Judgement
    21: "from-emerald-500 to-teal-400", // World
  };
  
  const gradClass = bgColors[card.id] || "from-slate-600 to-gray-500";
  const isLarge = spreadLength <= 3;
  
  return (
    <div 
      className={`relative transition-all duration-500 ${isRevealed ? "animate-in fade-in zoom-in" : ""}`}
      style={{ animationDelay: `${index * 200}ms` }}
    >
      <div className={`
        relative rounded-xl overflow-hidden
        ${isLarge ? "w-32 h-48" : "w-24 h-36"}
        ${isRevealed ? "" : "transform rotate-180"}
        transition-all duration-300 hover:scale-105 cursor-pointer
      `}>
        {!isRevealed ? (
          // Card back design
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-slate-800 to-slate-900 flex items-center justify-center">
            <div className="w-full h-full border-2 border-purple-500/50 m-2 rounded-lg flex items-center justify-center">
              <div className="grid grid-cols-3 gap-1 p-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-purple-500/30 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Card front
          <div className={`absolute inset-0 bg-gradient-to-br ${gradClass} flex flex-col`}>
            {/* Card number */}
            <div className="absolute top-2 left-2 text-gray-900/80 text-xs font-bold">{card.image}</div>
            {/* Card symbol */}
            <div className="flex-1 flex items-center justify-center">
              <span className="text-4xl">{card.number === 0 ? "0" : card.number}</span>
            </div>
            {/* Card name */}
            <div className="bg-black/30 px-2 py-1.5">
              <p className="text-gray-900 text-[10px] font-medium text-center truncate">{card.name.en}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const translations: Record<string, Record<string, string>> = {
  zh: { title: "🔮 塔罗占卜", subtitle: "探索命运的神秘指引", question: "你想问什么", category: "占卜类别", general: "综合", love: "爱情", career: "事业", spread: "选择牌阵", shuffle: "洗牌抽牌", shuffling: "洗牌中...", reading: "塔罗解读", shareUnlock: "分享给3位好友解锁深度解读", shareProgress: "已分享", unlocked: "已解锁", free: "免费解读", position: "位置", elements: "元素", keywords: "关键词", questionPlaceholder: "心中默想你的问题...", tapToReveal: "点击牌面翻开", deepReading: "深度解读", shareText: "我刚刚用星缘进行了塔罗占卜，太准了！快来试试" },
  en: { title: "🔮 Tarot Reading", subtitle: "Explore mystical guidance", question: "What do you want to ask", category: "Category", general: "General", love: "Love", career: "Career", spread: "Choose Spread", shuffle: "Shuffle & Draw", shuffling: "Shuffling...", reading: "Tarot Reading", shareUnlock: "Share with 3 friends to unlock deep reading", shareProgress: "Shared", unlocked: "Unlocked", free: "Free Reading", position: "Position", elements: "Element", keywords: "Keywords", questionPlaceholder: "Focus on your question...", tapToReveal: "Tap card to reveal", deepReading: "Deep Reading", shareText: "I just did a tarot reading on Starry Fate, so accurate! Try it" },
  id: { title: "🔮 Bacaan Tarot", subtitle: "Jelajahi panduan mistis", question: "Apa yang ingin ditanyakan", category: "Kategori", general: "Umum", love: "Cinta", career: "Karir", spread: "Pilih Spread", shuffle: "Kocok & Tarik", shuffling: "Mengocok...", reading: "Bacaan Tarot", shareUnlock: "Bagikan ke 3 teman untuk buka bacaan mendalam", shareProgress: "Dibagi", unlocked: "Terbuka", free: "Bacaan Gratis", position: "Posisi", elements: "Elemen", keywords: "Kata Kunci", questionPlaceholder: "Fokuskan pertanyaanmu...", tapToReveal: "Ketuk kartu untuk buka", deepReading: "Bacaan Mendalam", shareText: "Saya baru saja baca tarot di Starry Fate, akurat sekali! Coba" },
  th: { title: "🔮 ไพ่ทาโรต์", subtitle: "สำรวจคำแนะนำลึกลับ", question: "คุณต้องการถามอะไร", category: "หมวด", general: "ทั่วไป", love: "ความรัก", career: "การงาน", spread: "เลือกไพ่", shuffle: "สับและจั่ว", shuffling: "กำลังสับ...", reading: "คำทำนาย", shareUnlock: "แชร์ให้เพื่อน 3 คนเพื่อปลดล็อก", shareProgress: "แชร์แล้ว", unlocked: "ปลดล็อกแล้ว", free: "อ่านฟรี", position: "ตำแหน่ง", elements: "ธาตุ", keywords: "คำหลัก", questionPlaceholder: "ตั้งจิตถาม...", tapToReveal: "แตะไพ่เพื่อเปิด", deepReading: "อ่านลึก", shareText: "ผมอ่านไพ่ทาโรต์ที่ Starry Fate แม่นมาก! ลองดู" },
  vi: { title: "🔮 Đọc Bài Tarot", subtitle: "Khám phá hướng dẫn bí ẩn", question: "Bạn muốn hỏi gì", category: "Danh mục", general: "Tổng quát", love: "Tình yêu", career: "Sự nghiệp", spread: "Chọn Bài", shuffle: "Xào & Rút", shuffling: "Đang xào...", reading: "Đọc Bói", shareUnlock: "Chia sẻ 3 bạn để mở khóa đọc sâu", shareProgress: "Đã chia sẻ", unlocked: "Đã mở", free: "Đọc Miễn phí", position: "Vị trí", elements: "Nguyên tố", keywords: "Từ khóa", questionPlaceholder: "Tập trung câu hỏi...", tapToReveal: "Chạm để mở", deepReading: "Đọc Sâu", shareText: "Tôi vừa đọc bài tarot ở Starry Fate, chính xác lắm! Thử xem" },
  ms: { title: "🔮 Bacaan Tarot", subtitle: "Terokai panduan mistik", question: "Apa yang anda ingin tanya", category: "Kategori", general: "Umum", love: "Cinta", career: "Kerjaya", spread: "Pilih Spread", shuffle: "Kocak & Tarik", shuffling: "Mengocok...", reading: "Bacaan Tarot", shareUnlock: "Kongsi 3 kawan untuk buka bacaan mendalam", shareProgress: "Dikongsi", unlocked: "Dibuka", free: "Bacaan Percuma", position: "Kedudukan", elements: "Unsur", keywords: "Kata Kunci", questionPlaceholder: "Fokus soalan anda...", tapToReveal: "Tekan untuk buka", deepReading: "Bacaan Mendalam", shareText: "Saya baru baca tarot di Starry Fate, tepat sekali! Cuba" },
  ja: { title: "🔮 タロットリーディング", subtitle: "神秘的なガイダンスを探索", question: "何が知りたいですか", category: "カテゴリー", general: "総合", love: "恋愛", career: "仕事", spread: "spreadを選択", shuffle: "シャッフル&ドロー", shuffling: "シャッフル中...", reading: "リーディング", shareUnlock: "3人にシェアしてディープリーディングをアンロック", shareProgress: "シェア済み", unlocked: "アンロック済み", free: "フリーリーディング", position: "位置", elements: "元素", keywords: "キーワード", questionPlaceholder: "心に問いかけて...", tapToReveal: "タップして開く", deepReading: "ディープリーディング", shareText: "星縁でタロット占いをしたら当たりだった！試して" },
  ko: { title: "🔮 타로 리딩", subtitle: "신비로운 안내 탐구", question: "무엇을 알고 싶으신가요", category: "카테고리", general: "일반", love: "사랑", career: "커리어", spread: "스프레드 선택", shuffle: "셔플 & 드로우", shuffling: "셔플 중...", reading: "리딩", shareUnlock: "3명한테 공유して 딥 리딩 잠금 해제", shareProgress: "공유함", unlocked: "잠금 해제됨", free: "무료 리딩", position: "위치", elements: "원소", keywords: "핵심어", questionPlaceholder: "질문을 생각하세요...", tapToReveal: "탭하여 열기", deepReading: "딥 리딩", shareText: "星縁でタロット占いをしたら当たりだった！試して" },
};

export default function TarotPage() {
  const { language } = useLanguage();
  const [selectedSpread, setSelectedSpread] = useState(SPREADS[0]);
  const [drawnCards, setDrawnCards] = useState<typeof TAROT_CARDS>([]);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState<"general" | "love" | "career">("general");
  const [shareCount, setShareCount] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const t = translations[language as keyof typeof translations] || translations.en;
  const currentPositions = (selectedSpread.positions as Record<string, string[]>)?.[language] || selectedSpread.positions.en;

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tarot_unlock_v2');
      if (saved) {
        const s = JSON.parse(saved);
        if (s.shareCount) setShareCount(s.shareCount);
        if (s.isUnlocked) setIsUnlocked(true);
      }
    } catch {}
  }, []);

  const saveUnlockState = (updates: Record<string, unknown>) => {
    try {
      const current = JSON.parse(localStorage.getItem('tarot_unlock_v2') || '{}');
      localStorage.setItem('tarot_unlock_v2', JSON.stringify({ ...current, ...updates }));
    } catch {}
  };

  const handleShare = () => {
    const shareText = `${t.shareText} https://lunaxstar.com/tarot`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
    
    const newCount = Math.min(shareCount + 1, 3);
    setShareCount(newCount);
    saveUnlockState({ shareCount: newCount });
    
    if (newCount >= 3) {
      setTimeout(() => {
        setIsUnlocked(true);
        saveUnlockState({ isUnlocked: true });
      }, 1500);
    }
  };

  const shuffleCards = () => {
    setIsShuffling(true);
    setDrawnCards([]);
    setRevealedCards([]);
    
    setTimeout(() => {
      const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5);
      setDrawnCards(shuffled.slice(0, selectedSpread.cards));
      setIsShuffling(false);
    }, 1500);
  };

  const revealCard = (index: number) => {
    if (!revealedCards.includes(index)) {
      setRevealedCards([...revealedCards, index]);
    }
  };

  const getCardReading = (card: typeof TAROT_CARDS[0]) => {
    // First try to get reading from TAROT_READINGS
    const readings = TAROT_READINGS[language]?.[category];
    const reading = readings?.[card.name.en];
    if (reading) return reading;
    
    // Fallback to card meaning
    const meaning = card.meaning[language] || card.meaning.en || card.meaning.zh || card.meaning.id;
    if (meaning) return meaning;
    
    // Last resort - return a generic reading based on keywords
    const keywords = card.keywords[language] || card.keywords.en;
    if (keywords && keywords.length > 0) {
      return `${card.name[language] || card.name.en}: ${keywords.join(', ')}`;
    }
    
    return "这张牌代表重要的指引和启示。请仔细思考它在当前情境下的含义。";
  };

  const allRevealed = drawnCards.length > 0 && revealedCards.length === drawnCards.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ffffff] via-white to-[#ffffff] text-gray-900">
      {/* Navigation */}
      

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-gray-500">{t.subtitle}</p>
        </div>

        {/* Controls */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-5 mb-6 space-y-4">
          {/* Question Input */}
          <div>
            <label className="block text-sm text-gray-500 mb-2">{t.question}</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t.questionPlaceholder}
              className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-gray-900 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Category & Spread */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-2">{t.category}</label>
              <div className="flex gap-2">
                {(['general', 'love', 'career'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      category === c 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-gray-900' 
                        : 'bg-slate-800 text-gray-500 hover:bg-slate-700'
                    }`}
                  >
                    {t[c]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">{t.spread}</label>
              <select
                value={selectedSpread.id}
                onChange={(e) => { setSelectedSpread(SPREADS.find(s => s.id === e.target.value) || SPREADS[0]); setDrawnCards([]); setRevealedCards([]); }}
                className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-purple-500"
              >
                {SPREADS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name[language] || s.name.en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Shuffle Button */}
          <button
            onClick={shuffleCards}
            disabled={isShuffling}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-600 disabled:to-slate-600 rounded-xl font-bold text-gray-900 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
          >
            {isShuffling ? <RefreshCw size={20} className="animate-spin" /> : <Shuffle size={20} />}
            {isShuffling ? t.shuffling : t.shuffle}
          </button>
        </div>

        {/* Cards Display */}
        {drawnCards.length > 0 && (
          <div className="space-y-6">
            {/* Cards Grid */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6">
              <div className={`flex flex-wrap justify-center gap-4 ${drawnCards.length > 5 ? 'max-h-96 overflow-y-auto' : ''}`}>
                {drawnCards.map((card, i) => {
                  const isRevealed = revealedCards.includes(i);
                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      {/* Position label */}
                      <div className="text-xs text-gray-500 text-center bg-slate-800/50 px-2 py-1 rounded-lg">
                        {currentPositions[i] || `${t.position} ${i + 1}`}
                      </div>
                      {/* Card */}
                      <div 
                        onClick={() => !isRevealed && revealCard(i)}
                        className="relative"
                      >
                        <TarotCardVisual 
                          card={card} 
                          isRevealed={isRevealed} 
                          index={i} 
                          spreadLength={drawnCards.length}
                        />
                        {!isRevealed && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs text-gray-500 bg-black/50 px-2 py-1 rounded">{t.tapToReveal}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reading Results */}
            {allRevealed && (
              <div className="space-y-4">
                {/* Free Reading */}
                <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-2xl p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Sparkles size={18} className="text-amber-400" />
                    {t.reading}
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">{t.free}</span>
                  </h3>
                  <div className="space-y-4">
                    {drawnCards.map((card, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white/5 border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl font-bold text-purple-400">{card.image}</span>
                          <div>
                            <span className="font-bold text-gray-900">{card.name[language] || card.name.en}</span>
                            <span className="text-gray-500 text-sm ml-2">({card.element})</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{getCardReading(card)}</p>
                        <div className="flex flex-wrap gap-2">
                          {card.keywords[language]?.map((kw: string, j: number) => (
                            <span key={j} className="px-2 py-1 bg-purple-500/20 rounded-full text-xs text-purple-700">{kw}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deep Reading - Unlock */}
                {!isUnlocked && drawnCards.length > 1 && (
                  <div className="rounded-2xl overflow-hidden border border-slate-700">
                    <div className="p-5 bg-gradient-to-r from-amber-900/40 to-orange-900/40 flex items-center justify-between">
                      <h3 className="font-bold flex items-center gap-2">
                        <Lock size={18} className="text-amber-400" />
                        {t.deepReading}
                      </h3>
                    </div>
                    <div className="p-6 space-y-5 bg-slate-900/60">
                      {/* Blurred Preview */}
                      <div className="relative">
                        <div className="space-y-3 blur-sm pointer-events-none select-none opacity-60">
                          <div className="p-4 rounded-xl bg-slate-800"><div className="h-4 bg-slate-700 rounded w-3/4 mb-2" /><div className="h-3 bg-slate-700/50 rounded w-full" /></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Lock size={32} className="text-gray-500" />
                        </div>
                      </div>
                      
                      {/* WhatsApp Share */}
                      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                        <div className="flex items-center gap-3 mb-3">
                          <MessageCircle size={20} className="text-green-400" />
                          <div className="font-medium text-gray-900 text-sm">{t.shareUnlock}</div>
                        </div>
                        <div className="flex gap-2 mb-3">
                          {[1, 2, 3].map(n => (
                            <div key={n} className={`flex-1 h-2 rounded-full transition-all ${shareCount >= n ? "bg-green-500" : "bg-slate-700"}`} />
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 mb-3">{t.shareProgress}: {shareCount}/3</div>
                        
                        {shareCount < 3 ? (
                          <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3].map(n => (
                              <button key={n} onClick={handleShare} disabled={shareCount >= n}
                                className={`py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${shareCount >= n ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-slate-800 hover:bg-green-500/20 text-gray-600 hover:text-green-300 border border-slate-700"}`}>
                                {shareCount >= n ? <CheckCircle size={12} /> : <Share2 size={12} />}
                                {language === 'zh' ? '好友' : language === 'id' ? 'Teman' : language === 'th' ? 'เพื่อน' : language === 'vi' ? 'Bạn' : 'Friend'} {n}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-green-400 font-medium text-sm flex items-center justify-center gap-2">
                            <CheckCircle size={16} />{language === 'zh' ? '已解锁！' : language === 'id' ? 'Terbuka!' : 'Unlocked!'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
