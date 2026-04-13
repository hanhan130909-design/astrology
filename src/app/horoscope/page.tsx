"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Star, Sun, ArrowLeft, ChevronDown } from "lucide-react";

const ZODIAC_DATA: Record<string, { symbol: string; names: Record<string, string>; element: string }> = {
  aries: { symbol: "♈", names: { zh: "白羊座", en: "Aries", id: "Aries", th: "แกะ", vi: "Bạch Dương", ms: "Aries", ja: "牡羊座", ko: "양자리" }, element: "fire" },
  taurus: { symbol: "♉", names: { zh: "金牛座", en: "Taurus", id: "Taurus", th: "พฤกษกร", vi: "Kim Ngưu", ms: "Taurus", ja: "牡牛座", ko: "황소자리" }, element: "earth" },
  gemini: { symbol: "♊", names: { zh: "双子座", en: "Gemini", id: "Gemini", th: "มิถุน", vi: "Song Tử", ms: "Gemini", ja: "双子座", ko: "쌍둥이자리" }, element: "air" },
  cancer: { symbol: "♋", names: { zh: "巨蟹座", en: "Cancer", id: "Cancer", th: "กรกฎ", vi: "Cự Giải", ms: "Cancer", ja: "蟹座", ko: "게자리" }, element: "water" },
  leo: { symbol: "♌", names: { zh: "狮子座", en: "Leo", id: "Leo", th: "สิงห์", vi: "Sư Tử", ms: "Leo", ja: "獅子座", ko: "사자자리" }, element: "fire" },
  virgo: { symbol: "♍", names: { zh: "处女座", en: "Virgo", id: "Virgo", th: "กันย์", vi: "Xử Nữ", ms: "Virgo", ja: "乙女座", ko: "처녀자리" }, element: "earth" },
  libra: { symbol: "♎", names: { zh: "天秤座", en: "Libra", id: "Libra", th: "ตุลย์", vi: "Thiên Bình", ms: "Libra", ja: "天秤座", ko: "천칭자리" }, element: "air" },
  scorpio: { symbol: "♏", names: { zh: "天蝎座", en: "Scorpio", id: "Scorpio", th: "พิจิก", vi: "Bọ Cạp", ms: "Scorpio", ja: "蠍座", ko: "전갈자리" }, element: "water" },
  sagittarius: { symbol: "♐", names: { zh: "射手座", en: "Sagittarius", id: "Sagittarius", th: "ธนู", vi: "Nhân Mã", ms: "Sagittarius", ja: "射手座", ko: "人马자리" }, element: "fire" },
  capricorn: { symbol: "♑", names: { zh: "摩羯座", en: "Capricorn", id: "Capricorn", th: "มังกร", vi: "Ma Kết", ms: "Capricorn", ja: "山羊座", ko: "염소자리" }, element: "earth" },
  aquarius: { symbol: "♒", names: { zh: "水瓶座", en: "Aquarius", id: "Aquarius", th: "กุมภ์", vi: "Bảo Bình", ms: "Aquarius", ja: "水瓶座", ko: "물병자리" }, element: "air" },
  pisces: { symbol: "♓", names: { zh: "双鱼座", en: "Pisces", id: "Pisces", th: "มีน", vi: "Song Ngư", ms: "Pisces", ja: "魚座", ko: "물고기자리" }, element: "water" },
};

const ELEMENT_COLORS = {
  fire: "#FF6B6B",
  earth: "#8B7355",
  air: "#74B9FF",
  water: "#0984E3",
};

// Enhanced horoscope data with lucky elements
const HOROSCOPE_DATA: Record<string, Record<string, {
  love: string; career: string; finance: string; health: string; tip: string;
  luckyColor: string; luckyNumber: number; luckyTime: string;
  weekly: string; compatibility: string;
}>> = {
  aries: {
    zh: { love: "感情生活活跃，单身者有机会遇到心仪对象。已有伴侣者要多沟通。", career: "事业上有新机会，敢于尝试新领域。", finance: "财务状况良好，但避免冲动消费。", health: "注意头部和面部健康，保证充足睡眠。", tip: "今天是行动日，勇敢迈出第一步！", luckyColor: "红色", luckyNumber: 9, luckyTime: "上午9-11点", weekly: "本周事业运强劲，适合推进重要项目。感情方面有惊喜。", compatibility: "狮子座、射手座" },
    en: { love: "Active social life, singles may meet someone special.", career: "New opportunities at work, try new areas.", finance: "Good financial situation, avoid impulse buys.", health: "Watch head and face health, get enough sleep.", tip: "Today is an action day! Take the first step!", luckyColor: "Red", luckyNumber: 9, luckyTime: "9-11 AM", weekly: "Strong career week, good for important projects. Surprises in love.", compatibility: "Leo, Sagittarius" },
    id: { love: "Kehidupan sosial aktif, lajang mungkin bertemu seseorang.", career: "Peluang baru di pekerjaan, coba bidang baru.", finance: "Situasi keuangan baik, hindari belanja impulsif.", health: "Jaga kesehatan kepala dan wajah, tidur cukup.", tip: "Hari ini hari aksi! Ambil langkah pertama!", luckyColor: "Merah", luckyNumber: 9, luckyTime: "9-11 Pagi", weekly: "Minggu karir kuat, bagus untuk proyek penting. Kejutan dalam cinta.", compatibility: "Leo, Sagittarius" },
  },
  taurus: {
    zh: { love: "感情稳定，已有伴侣者关系更加亲密。", career: "稳扎稳打，工作成果得到认可。", finance: "财务状况不错，适合储蓄和投资。", health: "注意颈部健康，避免久坐。", tip: "今天适合处理财务问题。", luckyColor: "绿色", luckyNumber: 6, luckyTime: "下午2-4点", weekly: "本周财务运势佳，可能有意外收入。感情稳定温馨。", compatibility: "处女座、摩羯座" },
    en: { love: "Stable relationships, couples grow closer.", career: "Steady progress, work recognized.", finance: "Good finances, good for saving.", health: "Watch neck health, avoid sitting too long.", tip: "Good day for financial matters.", luckyColor: "Green", luckyNumber: 6, luckyTime: "2-4 PM", weekly: "Great financial week, possible unexpected income. Stable love.", compatibility: "Virgo, Capricorn" },
    id: { love: "Hubungan stabil, pasangan tumbuh lebih dekat.", career: "Kemajuan konsisten, kerja diakui.", finance: "Keuangan baik, baik untuk menabung.", health: "Jaga kesehatan leher, hindari duduk terlalu lama.", tip: "Hari yang baik untuk masalah keuangan.", luckyColor: "Hijau", luckyNumber: 6, luckyTime: "2-4 Sore", weekly: "Minggu keuangan bagus, mungkin pendapatan tak terduga. Cinta stabil.", compatibility: "Virgo, Capricorn" },
  },
  gemini: {
    zh: { love: "社交活跃，沟通带来更多机会。", career: "创意无限，适合写作和表达。", finance: "有多元化收入机会。", health: "注意手部和呼吸系统健康。", tip: "今天是学习新知识的好日子。", luckyColor: "黄色", luckyNumber: 5, luckyTime: "上午10-12点", weekly: "本周社交运佳，适合拓展人脉。学习新技能的好时机。", compatibility: "天秤座、水瓶座" },
    en: { love: "Active social life, communication brings opportunities.", career: "Creative energy, great for writing.", finance: "Multiple income opportunities.", health: "Watch hands and respiratory health.", tip: "Great day for learning new things.", luckyColor: "Yellow", luckyNumber: 5, luckyTime: "10-12 AM", weekly: "Great social week, good for networking. Perfect time to learn new skills.", compatibility: "Libra, Aquarius" },
    id: { love: "Kehidupan sosial aktif, komunikasi membawa peluang.", career: "Energi kreatif, bagus untuk menulis.", finance: "Peluang pendapatan多元化.", health: "Jaga kesehatan tangan dan pernapasan.", tip: "Hari yang bagus untuk belajar hal baru.", luckyColor: "Kuning", luckyNumber: 5, luckyTime: "10-12 Pagi", weekly: "Minggu sosial bagus, baik untuk networking. Waktu sempurna belajar skill baru.", compatibility: "Libra, Aquarius" },
  },
  cancer: {
    zh: { love: "家庭氛围温馨，情感需求得到满足。", career: "适合处理幕后工作，默默积累。", finance: "财务状况稳定，注意不必要的开支。", health: "注意胸部和消化系统健康。", tip: "今天适合陪伴家人。", luckyColor: "银色", luckyNumber: 2, luckyTime: "晚上8-10点", weekly: "本周家庭运佳，适合处理家务事。情感上需要安全感。", compatibility: "天蝎座、双鱼座" },
    en: { love: "Warm family atmosphere, emotional needs met.", career: "Good for behind-the-scenes work.", finance: "Stable finances, watch expenses.", health: "Watch chest and digestive health.", tip: "Good day to spend with family.", luckyColor: "Silver", luckyNumber: 2, luckyTime: "8-10 PM", weekly: "Great family week, good for household matters. Need emotional security.", compatibility: "Scorpio, Pisces" },
    id: { love: "Suasana keluarga hangat, kebutuhan emosional terpenuhi.", career: "Baik untuk pekerjaan di belakang layar.", finance: "Keuangan stabil, perhatikan pengeluaran.", health: "Jaga kesehatan dada dan pencernaan.", tip: "Hari yang baik untuk bersama keluarga.", luckyColor: "Perak", luckyNumber: 2, luckyTime: "8-10 Malam", weekly: "Minggu keluarga bagus, baik untuk urusan rumah. Butuh keamanan emosional.", compatibility: "Scorpio, Pisces" },
  },
  leo: {
    zh: { love: "魅力四射，感情生活丰富多彩。", career: "领导力展现，获得更多关注。", finance: "偏财运不错，可能有意外收获。", health: "注意心脏和背部健康。", tip: "今天是你闪耀的日子！", luckyColor: "金色", luckyNumber: 1, luckyTime: "中午12-2点", weekly: "本周个人魅力爆棚，适合展示才华。爱情运极佳。", compatibility: "白羊座、射手座" },
    en: { love: "Charming day, colorful romantic life.", career: "Leadership shown, get more attention.", finance: "Good luck money, possible windfall.", health: "Watch heart and back health.", tip: "It's your day to shine!", luckyColor: "Gold", luckyNumber: 1, luckyTime: "12-2 PM", weekly: "Personal charm peaks this week, great for showing talents. Excellent love luck.", compatibility: "Aries, Sagittarius" },
    id: { love: "Hari yang mempesona, kehidupan cinta berwarna.", career: "Kepemimpinan ditunjukkan, dapat perhatian.", finance: "Hoki uang, mungkin dapat rezeki.", health: "Jaga kesehatan jantung dan punggung.", tip: "Ini hari kamu untuk bersinar!", luckyColor: "Emas", luckyNumber: 1, luckyTime: "12-2 Siang", weekly: "Pesona personal puncak minggu ini, bagus untuk menunjukkan bakat. Keberuntungan cinta luar biasa.", compatibility: "Aries, Sagittarius" },
  },
  virgo: {
    zh: { love: "感情细腻，需要更多关注细节。", career: "分析能力突出，适合处理复杂问题。", finance: "财务精打细算，适合理财。", health: "注意腹部和肠道健康。", tip: "今天适合整理和规划。", luckyColor: "棕色", luckyNumber: 5, luckyTime: "下午3-5点", weekly: "本周工作效率极高，适合处理细节任务。健康需要关注。", compatibility: "金牛座、摩羯座" },
    en: { love: "Detail-oriented in relationships.", career: "Analytical skills shine.", finance: "Careful finances, good for planning.", health: "Watch abdomen and gut health.", tip: "Good day for organizing and planning.", luckyColor: "Brown", luckyNumber: 5, luckyTime: "3-5 PM", weekly: "High work efficiency this week, good for detailed tasks. Health needs attention.", compatibility: "Taurus, Capricorn" },
    id: { love: "Detail-oriented dalam hubungan.", career: "Keterampilan analitis bersinar.", finance: "Keuangan hati-hati, bagus untuk perencanaan.", health: "Jaga kesehatan perut dan usus.", tip: "Hari yang baik untuk mengatur dan merencanakan.", luckyColor: "Coklat", luckyNumber: 5, luckyTime: "3-5 Sore", weekly: "Efisiensi kerja tinggi minggu ini, bagus untuk tugas detail. Kesehatan perlu perhatian.", compatibility: "Taurus, Capricorn" },
  },
  libra: {
    zh: { love: "追求和谐，关系更加平衡。", career: "合作运佳，适合团队工作。", finance: "财务平衡，避免过度消费。", health: "注意肾脏和皮肤健康。", tip: "今天适合社交和建立联系。", luckyColor: "粉色", luckyNumber: 6, luckyTime: "下午4-6点", weekly: "本周人际关系和谐，适合合作洽谈。审美能力提升。", compatibility: "双子座、水瓶座" },
    en: { love: "Seeking harmony, relationships balanced.", career: "Good cooperation, great for teamwork.", finance: "Balanced finances, avoid overspending.", health: "Watch kidney and skin health.", tip: "Good day for socializing and networking.", luckyColor: "Pink", luckyNumber: 6, luckyTime: "4-6 PM", weekly: "Harmonious relationships this week, good for negotiations. Aesthetic sense enhanced.", compatibility: "Gemini, Aquarius" },
    id: { love: "Mencari keharmonisan, hubungan seimbang.", career: "Kerjasama baik, bagus untuk kerja tim.", finance: "Keuangan seimbang, hindari belanja berlebihan.", health: "Jaga kesehatan ginjal dan kulit.", tip: "Hari yang baik untuk bersosialisasi.", luckyColor: "Merah Muda", luckyNumber: 6, luckyTime: "4-6 Sore", weekly: "Hubungan harmonis minggu ini, bagus untuk negosiasi. Rasa estetika meningkat.", compatibility: "Gemini, Aquarius" },
  },
  scorpio: {
    zh: { love: "情感深刻，关系进入新阶段。", career: "洞察力强，适合研究和调查。", finance: "财务状况改善，可能有遗产或共同财产。", health: "注意生殖系统和代谢健康。", tip: "今天适合深入交流和分享秘密。", luckyColor: "深红色", luckyNumber: 8, luckyTime: "晚上9-11点", weekly: "本周直觉敏锐，适合做重要决定。情感深度交流。", compatibility: "巨蟹座、双鱼座" },
    en: { love: "Deep emotions, relationships enter new phase.", career: "Strong insight, good for research.", finance: "Improved finances, possible inheritance.", health: "Watch reproductive and metabolic health.", tip: "Good day for deep conversations.", luckyColor: "Crimson", luckyNumber: 8, luckyTime: "9-11 PM", weekly: "Sharp intuition this week, good for important decisions. Deep emotional exchanges.", compatibility: "Cancer, Pisces" },
    id: { love: "Emosi mendalam, hubungan masuk fase baru.", career: "Wawasan kuat, bagus untuk riset.", finance: "Keuangan membaik, mungkin warisan.", health: "Jaga kesehatan reproduksi dan metabolisme.", tip: "Hari yang baik untuk percakapan mendalam.", luckyColor: "Kirmizi", luckyNumber: 8, luckyTime: "9-11 Malam", weekly: "Intuisi tajam minggu ini, bagus untuk keputusan penting. Pertukaran emosional mendalam.", compatibility: "Cancer, Pisces" },
  },
  sagittarius: {
    zh: { love: "追求自由，社交圈扩大。", career: "学习运佳，可能获得高等教育或旅行机会。", finance: "海外运不错，可能有跨国收入。", health: "注意肝脏和臀部健康。", tip: "今天适合计划旅行或学习新事物。", luckyColor: "紫色", luckyNumber: 3, luckyTime: "上午11-1点", weekly: "本周冒险精神高涨，适合尝试新事物。可能有远行机会。", compatibility: "白羊座、狮子座" },
    en: { love: "Seeking freedom, social circle expands.", career: "Good learning, possible travel or education.", finance: "Good overseas luck, possible international income.", health: "Watch liver and hip health.", tip: "Good day to plan travel or learn.", luckyColor: "Purple", luckyNumber: 3, luckyTime: "11 AM-1 PM", weekly: "Adventurous spirit high this week, good for trying new things. Possible travel opportunities.", compatibility: "Aries, Leo" },
    id: { love: "Mencari kebebasan, lingkaran sosial melebar.", career: "Belajar baik, mungkin perjalanan atau pendidikan.", finance: "Hoki luar negeri, mungkin pendapatan internasional.", health: "Jaga kesehatan hati dan pinggul.", tip: "Hari yang baik untuk merencanakan perjalanan.", luckyColor: "Ungu", luckyNumber: 3, luckyTime: "11-1 Siang", weekly: "Semangat petualang tinggi minggu ini, bagus untuk mencoba hal baru. Mungkin peluang perjalanan.", compatibility: "Aries, Leo" },
  },
  capricorn: {
    zh: { love: "感情稳定，需要表达更多情感。", career: "事业心强，目标导向明确。", finance: "财务状况改善，储蓄增加。", health: "注意膝盖和骨骼健康。", tip: "今天适合制定长期目标和计划。", luckyColor: "黑色", luckyNumber: 4, luckyTime: "下午5-7点", weekly: "本周事业运强劲，适合推进长期计划。责任感增强。", compatibility: "金牛座、处女座" },
    en: { love: "Stable emotions, need to express more feelings.", career: "Career-minded, clear goals.", finance: "Improved finances, more savings.", health: "Watch knee and bone health.", tip: "Good day to set long-term goals.", luckyColor: "Black", luckyNumber: 4, luckyTime: "5-7 PM", weekly: "Strong career luck this week, good for long-term planning. Sense of responsibility enhanced.", compatibility: "Taurus, Virgo" },
    id: { love: "Emosi stabil, perlu ungkapkan lebih banyak perasaan.", career: "Berorientasi karir, tujuan jelas.", finance: "Keuangan membaik, tabungan bertambah.", health: "Jaga kesehatan lutut dan tulang.", tip: "Hari yang baik untuk menetapkan tujuan jangka panjang.", luckyColor: "Hitam", luckyNumber: 4, luckyTime: "5-7 Sore", weekly: "Keberuntungan karir kuat minggu ini, bagus untuk perencanaan jangka panjang. Rasa tanggung jawab meningkat.", compatibility: "Taurus, Virgo" },
  },
  aquarius: {
    zh: { love: "追求独特，关系中有创新。", career: "创新思维突出，适合科技和人道主义工作。", finance: "科技和互联网领域有赚钱机会。", health: "注意小腿和循环系统健康。", tip: "今天适合参与社群活动和公益。", luckyColor: "电光蓝", luckyNumber: 7, luckyTime: "晚上10-12点", weekly: "本周创意无限，适合创新项目。社交圈可能扩大。", compatibility: "双子座、天秤座" },
    en: { love: "Seeking uniqueness, innovation in relationships.", career: "Innovative thinking, good for tech and humanitarian work.", finance: "Opportunities in tech and internet.", health: "Watch lower legs and circulation.", tip: "Good day for community and humanitarian activities.", luckyColor: "Electric Blue", luckyNumber: 7, luckyTime: "10 PM-12 AM", weekly: "Unlimited creativity this week, good for innovative projects. Social circle may expand.", compatibility: "Gemini, Libra" },
    id: { love: "Mencari keunikan, inovasi dalam hubungan.", career: "Berpikir inovatif, bagus untuk teknologi.", finance: "Peluang di teknologi dan internet.", health: "Jaga kesehatan kaki bagian bawah dan sirkulasi.", tip: "Hari yang baik untuk kegiatan komunitas.", luckyColor: "Biru Listrik", luckyNumber: 7, luckyTime: "10-12 Malam", weekly: "Kreativitas tak terbatas minggu ini, bagus untuk proyek inovatif. Lingkaran sosial mungkin melebar.", compatibility: "Gemini, Libra" },
  },
  pisces: {
    zh: { love: "情感丰富，适合艺术创作和浪漫。", career: "灵感和直觉强，适合创意工作。", finance: "艺术和疗愈领域有收入机会。", health: "注意脚部和免疫系统健康。", tip: "今天适合冥想、艺术创作或疗愈。", luckyColor: "海蓝色", luckyNumber: 11, luckyTime: "凌晨12-2点", weekly: "本周直觉敏锐，适合灵性探索。艺术创作灵感丰富。", compatibility: "巨蟹座、天蝎座" },
    en: { love: "Rich emotions, great for art and romance.", career: "Strong inspiration, good for creative work.", finance: "Opportunities in art and healing.", health: "Watch feet and immune system.", tip: "Good day for meditation, art, or healing.", luckyColor: "Sea Blue", luckyNumber: 11, luckyTime: "12-2 AM", weekly: "Sharp intuition this week, good for spiritual exploration. Rich artistic inspiration.", compatibility: "Cancer, Scorpio" },
    id: { love: "Emosi kaya, bagus untuk seni dan romansa.", career: "Inspirasi kuat, bagus untuk pekerjaan kreatif.", finance: "Peluang di seni dan penyembuhan.", health: "Jaga kesehatan kaki dan sistem imun.", tip: "Hari yang baik untuk meditasi, seni, atau penyembuhan.", luckyColor: "Biru Laut", luckyNumber: 11, luckyTime: "12-2 Dini Hari", weekly: "Intuisi tajam minggu ini, bagus untuk eksplorasi spiritual. Inspirasi artistik melimpah.", compatibility: "Cancer, Scorpio" },
  },
};

const LABELS: Record<string, Record<string, string>> = {
  zh: { title: "每日运势", subtitle: "选择你的星座，查看今日运势", love: "💕 爱情", career: "💼 事业", finance: "💰 财运", health: "❤️ 健康", tip: "✨ 今日提示", selectSign: "选择星座", viewDetail: "查看详细分析", back: "返回首页", luckyColor: "幸运色", luckyNumber: "幸运数字", luckyTime: "幸运时间", weekly: "本周运势", compatibility: "速配星座" },
  en: { title: "Daily Horoscope", subtitle: "Choose your sign to view today's horoscope", love: "💕 Love", career: "💼 Career", finance: "💰 Finance", health: "❤️ Health", tip: "✨ Daily Tip", selectSign: "Select Sign", viewDetail: "View Details", back: "Back to Home", luckyColor: "Lucky Color", luckyNumber: "Lucky Number", luckyTime: "Lucky Time", weekly: "Weekly Forecast", compatibility: "Best Match" },
  id: { title: "Horoskop Harian", subtitle: "Pilih zodiak untuk melihat horoskop hari ini", love: "💕 Cinta", career: "💼 Karier", finance: "💰 Keuangan", health: "❤️ Kesehatan", tip: "✨ Tips Harian", selectSign: "Pilih Zodiak", viewDetail: "Lihat Detail", back: "Kembali", luckyColor: "Warna Keberuntungan", luckyNumber: "Angka Keberuntungan", luckyTime: "Waktu Keberuntungan", weekly: "Ramalan Mingguan", compatibility: "Kecocokan Terbaik" },
  th: { title: "ดวงประจำวัน", subtitle: "เลือกราศีเพื่อดูดวงวันนี้", love: "💕 ความรัก", career: "💼 การงาน", finance: "💰 การเงิน", health: "❤️ สุขภาพ", tip: "✨ เคล็ดลับ", selectSign: "เลือกราศี", viewDetail: "ดูรายละเอียด", back: "กลับหน้าแรก", luckyColor: "สีเสี่ยง", luckyNumber: "เลขเสี่ยง", luckyTime: "เวลาเสี่ยง", weekly: "ดวงประจำสัปดาห์", compatibility: "ราศีที่เข้ากัน" },
  vi: { title: "Tử Vi Hàng Ngày", subtitle: "Chọn cung để xem tử vi hôm nay", love: "💕 Tình yêu", career: "💼 Sự nghiệp", finance: "💰 Tài chính", health: "❤️ Sức khỏe", tip: "✨ Mẹo", selectSign: "Chọn cung", viewDetail: "Xem chi tiết", back: "Về trang chủ", luckyColor: "Màu may mắn", luckyNumber: "Số may mắn", luckyTime: "Thời gian may mắn", weekly: "Tử vi tuần này", compatibility: "Cung hợp" },
  ms: { title: "Horoskop Harian", subtitle: "Pilih zodiak untuk melihat horoskop hari ini", love: "💕 Cinta", career: "💼 Kerjaya", finance: "💰 Kewangan", health: "❤️ Kesihatan", tip: "✨ Tips", selectSign: "Pilih Zodiak", viewDetail: "Lihat Detail", back: "Kembali", luckyColor: "Warna Bertuah", luckyNumber: "Nombor Bertuah", luckyTime: "Masa Bertuah", weekly: "Ramalan Mingguan", compatibility: "Keserasian Terbaik" },
  ja: { title: "今日の運勢", subtitle: "星座を選んで今日の運勢を見る", love: "💕 恋愛", career: "💼 仕事", finance: "💰 金運", health: "❤️ 健康", tip: "✨ ヒント", selectSign: "星座を選択", viewDetail: "詳細を見る", back: "ホームに戻る", luckyColor: "ラッキーカラー", luckyNumber: "ラッキーナンバー", luckyTime: "ラッキータイム", weekly: "週間運勢", compatibility: "相性の良い星座" },
  ko: { title: "오늘의 운세", subtitle: "별자리를 선택하여 오늘의 운세를 확인하세요", love: "💕 사랑", career: "💼 직장", finance: "💰 재물", health: "❤️ 건강", tip: "✨ 팁", selectSign: "별자리 선택", viewDetail: "상세 보기", back: "홈으로", luckyColor: "행운의 색", luckyNumber: "행운의 숫자", luckyTime: "행운의 시간", weekly: "이번 주 운세", compatibility: "궁합이 좋은 별자리" },
};

export default function HoroscopePage() {
  const { language } = useLanguage();
  const lang = language || "zh";
  const labels = LABELS[lang] || LABELS.zh;
  const today = new Date().toLocaleDateString("zh-CN", { weekday: "long", month: "long", day: "numeric" });

  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const currentSign = selectedSign || (typeof window !== "undefined" ? 
    new URLSearchParams(window.location.search).get("sign") || "aries" : "aries");

  const signData = ZODIAC_DATA[currentSign as keyof typeof ZODIAC_DATA];
  const horoscope = HOROSCOPE_DATA[currentSign]?.[lang] || HOROSCOPE_DATA[currentSign]?.zh;
  const elemColor = ELEMENT_COLORS[signData?.element as keyof typeof ELEMENT_COLORS] || "#a855f7";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030014] via-[#0f0f23] to-[#030014] text-white">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#030014]/90 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-purple-300 hover:text-white">
            <ArrowLeft size={20} />
            <span className="text-sm">{labels.back}</span>
          </Link>
          <h1 className="text-lg font-bold text-white hidden sm:block">星缘</h1>
          <LanguageSwitcher />
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* 标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full text-sm text-amber-300 mb-4">
            <Sun size={16} className="fill-amber-300" />
            <span>{today}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{labels.title}</h1>
          <p className="text-slate-400">{labels.subtitle}</p>
        </div>

        {/* 星座选择器 */}
        <div className="relative mb-8">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-left flex items-center justify-between hover:bg-white/10 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl" style={{ color: elemColor }}>{signData?.symbol}</span>
              <div>
                <div className="font-bold text-white">{signData?.names[lang as keyof typeof signData.names] || signData?.names.zh}</div>
                <div className="text-xs text-slate-400">{signData?.element}</div>
              </div>
            </div>
            <ChevronDown size={20} className={`text-slate-400 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 p-3 rounded-2xl bg-slate-900/95 border border-white/10 backdrop-blur-xl z-50 grid grid-cols-4 gap-2">
              {Object.entries(ZODIAC_DATA).map(([id, data]) => (
                <button
                  key={id}
                  onClick={() => { setSelectedSign(id); setShowDropdown(false); }}
                  className={`p-3 rounded-xl text-center transition-all ${
                    currentSign === id 
                      ? "bg-purple-600/30 border border-purple-500 text-white" 
                      : "bg-white/5 hover:bg-white/10 text-slate-300"
                  }`}
                >
                  <div className="text-2xl mb-1">{data.symbol}</div>
                  <div className="text-xs">{data.names[lang as keyof typeof data.names] || data.names.zh}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 运势卡片 */}
        {horoscope && (
          <div className="space-y-4">
            {/* 星座信息 */}
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-white/10">
              <div className="text-5xl mb-2" style={{ color: elemColor }}>{signData?.symbol}</div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: elemColor }}>
                {signData?.names[lang as keyof typeof signData.names] || signData?.names.zh}
              </h2>
              <p className="text-slate-400 text-sm">{currentSign} • {signData?.element}</p>
            </div>

            {/* 四维运势 */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "love", color: "#FF6B9D" },
                { key: "career", color: "#4ECDC4" },
                { key: "finance", color: "#FFD93D" },
                { key: "health", color: "#FF6B6B" },
              ].map(({ key, color }) => (
                <div key={key} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xs font-medium mb-2" style={{ color }}>{(labels as any)[key]}</div>
                  <p className="text-sm text-slate-300 leading-relaxed">{(horoscope as any)[key]}</p>
                </div>
              ))}
            </div>

            {/* 幸运元素 */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20 text-center">
                <div className="text-2xl mb-1">🎨</div>
                <div className="text-xs text-slate-400 mb-1">{labels.luckyColor}</div>
                <div className="text-sm font-bold text-red-300">{horoscope.luckyColor}</div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-center">
                <div className="text-2xl mb-1">🔢</div>
                <div className="text-xs text-slate-400 mb-1">{labels.luckyNumber}</div>
                <div className="text-sm font-bold text-blue-300">{horoscope.luckyNumber}</div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/20 text-center">
                <div className="text-2xl mb-1">⏰</div>
                <div className="text-xs text-slate-400 mb-1">{labels.luckyTime}</div>
                <div className="text-sm font-bold text-purple-300">{horoscope.luckyTime}</div>
              </div>
            </div>

            {/* 今日提示 */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
              <div className="text-xs font-medium mb-2 text-amber-300">{labels.tip}</div>
              <p className="text-sm text-amber-100/80">{horoscope.tip}</p>
            </div>

            {/* 本周运势 */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📅</span>
                <span className="text-xs font-medium text-indigo-300">{labels.weekly}</span>
              </div>
              <p className="text-sm text-slate-300">{horoscope.weekly}</p>
            </div>

            {/* 速配星座 */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💕</span>
                <span className="text-xs font-medium text-rose-300">{labels.compatibility}</span>
              </div>
              <p className="text-sm text-slate-300">{horoscope.compatibility}</p>
            </div>

            {/* 查看详细 */}
            <Link
              href={`/yearly-horoscope?sign=${currentSign}`}
              className="block w-full p-4 rounded-xl bg-purple-600/20 border border-purple-500/30 text-center text-purple-300 hover:bg-purple-600/30 transition-all"
            >
              {labels.viewDetail} →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
