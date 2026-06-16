"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, Sun, ChevronDown, Heart, Briefcase, Wallet, Activity, Sparkles, TrendingUp, Users, Calendar, Lock, Share2, CheckCircle, MessageCircle, RefreshCw, Shuffle } from "lucide-react";

// Complete zodiac data with full details
const ZODIAC_DATA: Record<string, { symbol: string; names: Record<string, string>; element: string; rulingPlanet: string; dates: string }> = {
  aries: { symbol: "♈", names: { zh: "白羊座", en: "Aries", id: "Aries", th: "แกะ", vi: "Bạch Dương", ms: "Aries", ja: "牡羊座", ko: "양자리" }, element: "fire", rulingPlanet: {'zh': '火星', 'en': 'Mars', 'id': 'Mars', 'th': 'อังคาร', 'vi': 'Sao Hỏa', 'ms': 'Marikh', 'ja': '火星', 'ko': '화성'}, dates: "3.21-4.19" },
  taurus: { symbol: "♉", names: { zh: "金牛座", en: "Taurus", id: "Taurus", th: "พฤกษกร", vi: "Kim Ngưu", ms: "Taurus", ja: "牡牛座", ko: "황소자리" }, element: "earth", rulingPlanet: {'zh': '金星', 'en': 'Venus', 'id': 'Venus', 'th': 'ศุกร์', 'vi': 'Sao Kim', 'ms': 'Zuhrah', 'ja': '金星', 'ko': '금성'}, dates: "4.20-5.20" },
  gemini: { symbol: "♊", names: { zh: "双子座", en: "Gemini", id: "Gemini", th: "มิถุน", vi: "Song Tử", ms: "Gemini", ja: "双子座", ko: "쌍둥이자리" }, element: "air", rulingPlanet: {'zh': '水星', 'en': 'Mercury', 'id': 'Merkurius', 'th': 'พุธ', 'vi': 'Sao Thủy', 'ms': 'Utarid', 'ja': '水星', 'ko': '수성'}, dates: "5.21-6.21" },
  cancer: { symbol: "♋", names: { zh: "巨蟹座", en: "Cancer", id: "Cancer", th: "กรกฎ", vi: "Cự Giải", ms: "Cancer", ja: "蟹座", ko: "게자리" }, element: "water", rulingPlanet: {'zh': '月亮', 'en': 'Moon', 'id': 'Bulan', 'th': 'จันทร์', 'vi': 'Mặt Trăng', 'ms': 'Bulan', 'ja': '月', 'ko': '달'}, dates: "6.22-7.22" },
  leo: { symbol: "♌", names: { zh: "狮子座", en: "Leo", id: "Leo", th: "สิงห์", vi: "Sư Tử", ms: "Leo", ja: "獅子座", ko: "사자자리" }, element: "fire", rulingPlanet: {'zh': '太阳', 'en': 'Sun', 'id': 'Matahari', 'th': 'อาทิตย์', 'vi': 'Mặt Trời', 'ms': 'Matahari', 'ja': '太陽', 'ko': '태양'}, dates: "7.23-8.22" },
  virgo: { symbol: "♍", names: { zh: "处女座", en: "Virgo", id: "Virgo", th: "กันย์", vi: "Xử Nữ", ms: "Virgo", ja: "乙女座", ko: "처녀자리" }, element: "earth", rulingPlanet: {'zh': '水星', 'en': 'Mercury', 'id': 'Merkurius', 'th': 'พุธ', 'vi': 'Sao Thủy', 'ms': 'Utarid', 'ja': '水星', 'ko': '수성'}, dates: "8.23-9.22" },
  libra: { symbol: "♎", names: { zh: "天秤座", en: "Libra", id: "Libra", th: "ตุลย์", vi: "Thiên Bình", ms: "Libra", ja: "天秤座", ko: "천칭자리" }, element: "air", rulingPlanet: {'zh': '金星', 'en': 'Venus', 'id': 'Venus', 'th': 'ศุกร์', 'vi': 'Sao Kim', 'ms': 'Zuhrah', 'ja': '金星', 'ko': '금성'}, dates: "9.23-10.23" },
  scorpio: { symbol: "♏", names: { zh: "天蝎座", en: "Scorpio", id: "Scorpio", th: "พิจิก", vi: "Bọ Cạp", ms: "Scorpio", ja: "蠍座", ko: "전갈자리" }, element: "water", rulingPlanet: {'zh': '冥王星', 'en': 'Pluto', 'id': 'Pluto', 'th': 'ยม', 'vi': 'Sao Diêm Vương', 'ms': 'Pluto', 'ja': '冥王星', 'ko': '명왕성'}, dates: "10.24-11.22" },
  sagittarius: { symbol: "♐", names: { zh: "射手座", en: "Sagittarius", id: "Sagittarius", th: "ธนู", vi: "Nhân Mã", ms: "Sagittarius", ja: "射手座", ko: "人马자리" }, element: "fire", rulingPlanet: {'zh': '木星', 'en': 'Jupiter', 'id': 'Jupiter', 'th': 'พฤหัส', 'vi': 'Sao Mộc', 'ms': 'Musytari', 'ja': '木星', 'ko': '목성'}, dates: "11.23-12.21" },
  capricorn: { symbol: "♑", names: { zh: "摩羯座", en: "Capricorn", id: "Capricorn", th: "มังกร", vi: "Ma Kết", ms: "Capricorn", ja: "山羊座", ko: "염소자리" }, element: "earth", rulingPlanet: {'zh': '土星', 'en': 'Saturn', 'id': 'Saturnus', 'th': 'เสาร์', 'vi': 'Sao Thổ', 'ms': 'Zuhal', 'ja': '土星', 'ko': '토성'}, dates: "12.22-1.19" },
  aquarius: { symbol: "♒", names: { zh: "水瓶座", en: "Aquarius", id: "Aquarius", th: "กุมภ์", vi: "Bảo Bình", ms: "Aquarius", ja: "水瓶座", ko: "물병자리" }, element: "air", rulingPlanet: {'zh': '天王星', 'en': 'Uranus', 'id': 'Uranus', 'th': 'มฤตยู', 'vi': 'Sao Thiên Vương', 'ms': 'Uranus', 'ja': '天王星', 'ko': '천왕성'}, dates: "1.20-2.18" },
  pisces: { symbol: "♓", names: { zh: "双鱼座", en: "Pisces", id: "Pisces", th: "มีน", vi: "Song Ngư", ms: "Pisces", ja: "魚座", ko: "물고기자리" }, element: "water", rulingPlanet: {'zh': '海王星', 'en': 'Neptune', 'id': 'Neptunus', 'th': 'สมุทร', 'vi': 'Sao Hải Vương', 'ms': 'Neptun', 'ja': '海王星', 'ko': '해왕성'}, dates: "2.19-3.20" }};

const ELEMENT_COLORS = {
  fire: { color: "#FF6B6B", gradient: "from-gray-500/20 to-gray-500/20", border: "border-gray-500/30", text: "text-gray-400", icon: "🔥", label: { zh: "火象", en: "Fire", id: "Api" } },
  earth: { color: "#8B7355", gradient: "from-gray-700/20 to-gray-600/20", border: "border-gray-600/30", text: "text-gray-600", icon: "🌍", label: { zh: "土象", en: "Earth", id: "Tanah" } },
  air: { color: "#74B9FF", gradient: "from-gray-400/20 to-gray-400/20", border: "border-gray-400/30", text: "text-gray-400", icon: "💨", label: { zh: "风象", en: "Air", id: "Udara" } },
  water: { color: "#0984E3", gradient: "from-gray-600/20 to-gray-600/20", border: "border-gray-500/30", text: "text-gray-400", icon: "💧", label: { zh: "水象", en: "Water", id: "Air" } }};

// Enhanced comprehensive horoscope data
const HOROSCOPE_DATA: Record<string, Record<string, {
  love: string; career: string; finance: string; health: string; tip: string;
  luckyColor: string; luckyNumber: number; luckyTime: string;
  weekly: string; monthly: string; compatibility: string;
  loveScore: number; careerScore: number; financeScore: number; healthScore: number;
  loveAdvice: string; careerAdvice: string; financeAdvice: string;
  mood: string; energy: string; focus: string;
  bestDay: string; worstDay: string; keyPhrase: string;
}>> = {
  aries: {
    zh: { 
      love: "感情生活活跃，单身者有机会遇到心仪对象。已有伴侣者要多沟通，避免争吵。", 
      career: "事业上有新机会，敢于尝试新领域。团队合作顺利，领导力得到展现。", 
      finance: "财务状况良好，但避免冲动消费。有偏财运，可尝试小额投资。", 
      health: "注意头部和面部健康，保证充足睡眠。适合进行有氧运动。", 
      tip: "今天是行动日，勇敢迈出第一步！",
      luckyColor: "红色", luckyNumber: 9, luckyTime: "上午9-11点",
      weekly: "本周事业运强劲，适合推进重要项目。感情方面有惊喜。",
      monthly: "本月整体运势上升，尤其在事业和财运方面表现突出。感情需多用心经营。",
      compatibility: "狮子座、射手座",
      loveScore: 85, careerScore: 92, financeScore: 78, healthScore: 75,
      loveAdvice: "主动出击，但不要过于急切。真诚的表达最能打动人心。",
      careerAdvice: "把握机遇，展示你的能力和魄力。但也要学会倾听团队意见。",
      financeAdvice: "控制冲动消费，建立储蓄习惯。可以考虑多元化投资。",
      mood: "充满活力", energy: "高涨", focus: "行动力",
      bestDay: "星期二", worstDay: "星期五", keyPhrase: "勇往直前"},
    en: { 
      love: "Active social life, singles may meet someone special. Couples should communicate more.", 
      career: "New opportunities at work, try new areas. Teamwork goes well.", 
      finance: "Good financial situation, avoid impulse buys. Small investments may pay off.", 
      health: "Watch head health, get enough sleep. Good time for cardio.", 
      tip: "Today is an action day! Take the first step!",
      luckyColor: "Red", luckyNumber: 9, luckyTime: "9-11 AM",
      weekly: "Strong career week, good for important projects. Surprises in love.",
      monthly: "Overall luck rises this month, especially in career and finances. Focus on relationships.",
      compatibility: "Leo, Sagittarius",
      loveScore: 85, careerScore: 92, financeScore: 78, healthScore: 75,
      loveAdvice: "Be proactive but not too eager. Genuine expression touches hearts.",
      careerAdvice: "Seize opportunities, show your abilities. Also learn to listen.",
      financeAdvice: "Control impulse spending, build savings. Consider diversification.",
      mood: "Energetic", energy: "High", focus: "Action",
      bestDay: "Tuesday", worstDay: "Friday", keyPhrase: "Move forward boldly"},
    id: { 
      love: "Kehidupan sosial aktif, lajang mungkin bertemu seseorang spesial.", 
      career: "Peluang baru di pekerjaan, coba bidang baru. Kerja tim berjalan baik.", 
      finance: "Situasi keuangan baik, hindari belanja impulsif.", 
      health: "Jaga kesehatan kepala, tidur cukup.", 
      tip: "Hari ini hari aksi! Ambil langkah pertama!",
      luckyColor: "Merah", luckyNumber: 9, luckyTime: "9-11 Pagi",
      weekly: "Minggu karir kuat, bagus untuk proyek penting. Kejutan dalam cinta.",
      monthly: "Kehidupan keseluruhan naik bulan ini, terutama karir dan keuangan.",
      compatibility: "Leo, Sagittarius",
      loveScore: 85, careerScore: 92, financeScore: 78, healthScore: 75,
      loveAdvice: "Proaktif tapi jangan terlalu bersemangat. Ekspresi tulus menyentuh hati.",
      careerAdvice: "Raih peluang, tunjukkan kemampuan. Juga belajar mendengarkan.",
      financeAdvice: "Kendalikan belanja impulsif, tabung. Pertimbangkan diversifikasi.",
      mood: "energik", energy: "Tinggi", focus: "Aksi",
      bestDay: "Selasa", worstDay: "Jumat", keyPhrase: "Majulah dengan berani"}},
  taurus: {
    zh: { 
      love: "感情稳定，已有伴侣者关系更加亲密。适合约会和制造浪漫。", 
      career: "稳扎稳打，工作成果得到认可。适合处理财务相关工作。", 
      finance: "财务状况不错，适合储蓄和投资。理财运气上升。", 
      health: "注意颈部健康，避免久坐。多做拉伸运动。", 
      tip: "今天适合处理财务问题和享受美食。",
      luckyColor: "绿色", luckyNumber: 6, luckyTime: "下午2-4点",
      weekly: "本周财务运势佳，可能有意外收入。感情稳定温馨。",
      monthly: "本月财运表现突出，正财稳定增长。感情生活和谐美满。",
      compatibility: "处女座、摩羯座",
      loveScore: 90, careerScore: 82, financeScore: 95, healthScore: 78,
      loveAdvice: "表达你的爱意不要犹豫。小小的惊喜能大大增进感情。",
      careerAdvice: "发挥你务实可靠的特质。稳扎稳打是制胜法宝。",
      financeAdvice: "建立长期投资计划。房地产和贵金属是不错的选择。",
      mood: "稳定满足", energy: "平稳", focus: "积累",
      bestDay: "星期五", worstDay: "星期三", keyPhrase: "稳中求进"},
    en: { 
      love: "Stable relationships, couples grow closer. Good time for dates.", 
      career: "Steady progress, work recognized. Good for financial work.", 
      finance: "Good finances, good for saving and investing.", 
      health: "Watch neck health, avoid sitting too long.", 
      tip: "Good day for financial matters and enjoying good food.",
      luckyColor: "Green", luckyNumber: 6, luckyTime: "2-4 PM",
      weekly: "Great financial week, possible unexpected income. Stable love.",
      monthly: "Financial performance outstanding this month. Harmonious relationships.",
      compatibility: "Virgo, Capricorn",
      loveScore: 90, careerScore: 82, financeScore: 95, healthScore: 78,
      loveAdvice: "Express your love without hesitation. Small surprises strengthen bonds.",
      careerAdvice: "Use your practical and reliable traits. Steady progress wins.",
      financeAdvice: "Build long-term investment plans. Real estate is a good choice.",
      mood: "Stable", energy: "Balanced", focus: "Accumulation",
      bestDay: "Friday", worstDay: "Wednesday", keyPhrase: "Steady progress"},
    id: { 
      love: "Hubungan stabil, pasangan tumbuh lebih dekat. Saat yang baik untuk kencan.", 
      career: "Kemajuan konsisten, kerja diakui. Baik untuk pekerjaan keuangan.", 
      finance: "Keuangan baik, baik untuk menabung dan investasi.", 
      health: "Jaga kesehatan leher, hindari duduk terlalu lama.", 
      tip: "Hari yang baik untuk masalah keuangan dan menikmati makanan.",
      luckyColor: "Hijau", luckyNumber: 6, luckyTime: "2-4 Sore",
      weekly: "Minggu keuangan bagus, mungkin pendapatan tak terduga. Cinta stabil.",
      monthly: "Kinerja keuangan menonjol bulan ini. Hubungan harmonis.",
      compatibility: "Virgo, Capricorn",
      loveScore: 90, careerScore: 82, financeScore: 95, healthScore: 78,
      loveAdvice: "Ungkapkan cintamu tanpa ragu. Kejutan kecil memperkuat ikatan.",
      careerAdvice: "Gunakan sifat praktis dan dapat diandalkanmu.",
      financeAdvice: "Bangun rencana investasi jangka panjang.",
      mood: "Stabil", energy: "Seimbang", focus: "Akumulasi",
      bestDay: "Jumat", worstDay: "Rabu", keyPhrase: "Kemajuan stabil"}},
  gemini: {
    zh: { 
      love: "社交活跃，沟通带来更多机会。适合参加聚会认识新朋友。", 
      career: "创意无限，适合写作和表达。适合媒体和通信行业。", 
      finance: "有多元化收入机会。短期投资运气不错。", 
      health: "注意手部和呼吸系统健康。多进行户外活动。", 
      tip: "今天是学习新知识的好日子，也是社交的好时机。",
      luckyColor: "黄色", luckyNumber: 5, luckyTime: "上午10-12点",
      weekly: "本周社交运佳，适合拓展人脉。学习新技能的好时机。",
      monthly: "本月思维活跃，适合创意工作。感情上可能会有意外的邂逅。",
      compatibility: "天秤座、水瓶座",
      loveScore: 82, careerScore: 88, financeScore: 75, healthScore: 72,
      loveAdvice: "大胆表达你的想法，但也要学会倾听对方。",
      careerAdvice: "发挥你的多才多艺，但要注意专注度。",
      financeAdvice: "开拓多种收入来源，但避免投机行为。",
      mood: "思维活跃", energy: "充沛", focus: "沟通",
      bestDay: "星期三", worstDay: "星期六", keyPhrase: "多才多艺"},
    en: { 
      love: "Active social life, communication brings opportunities.", 
      career: "Creative energy, great for writing and expression.", 
      finance: "Multiple income opportunities. Good short-term investments.", 
      health: "Watch hands and respiratory health.", 
      tip: "Great day for learning and socializing.",
      luckyColor: "Yellow", luckyNumber: 5, luckyTime: "10-12 AM",
      weekly: "Great social week, good for networking. Perfect time to learn.",
      monthly: "Active mind this month, great for creative work. Possible unexpected encounters.",
      compatibility: "Libra, Aquarius",
      loveScore: 82, careerScore: 88, financeScore: 75, healthScore: 72,
      loveAdvice: "Express yourself boldly but also listen.",
      careerAdvice: "Use your versatility but maintain focus.",
      financeAdvice: "Diversify income sources, avoid speculation.",
      mood: "Mentally active", energy: "Abundant", focus: "Communication",
      bestDay: "Wednesday", worstDay: "Saturday", keyPhrase: "Versatile"},
    id: { 
      love: "Kehidupan sosial aktif, komunikasi membawa peluang.", 
      career: "Energi kreatif, bagus untuk menulis.", 
      finance: "Peluang pendapatan多元化.", 
      health: "Jaga kesehatan tangan dan pernapasan.", 
      tip: "Hari yang bagus untuk belajar dan bersosialisasi.",
      luckyColor: "Kuning", luckyNumber: 5, luckyTime: "10-12 Pagi",
      weekly: "Minggu sosial bagus, baik untuk networking.",
      monthly: "Pikiran aktif bulan ini, bagus untuk pekerjaan kreatif.",
      compatibility: "Libra, Aquarius",
      loveScore: 82, careerScore: 88, financeScore: 75, healthScore: 72,
      loveAdvice: "Ungkapkan dirimu tapi juga dengarkan.",
      careerAdvice: "Gunakan keserbagunaanmu tapi pertahankan fokus.",
      financeAdvice: "Diversifikasi sumber pendapatan, hindari spekulasi.",
      mood: "Aktif secara mental", energy: "Melimpah", focus: "Komunikasi",
      bestDay: "Rabu", worstDay: "Sabtu", keyPhrase: "Serbaguna"}},
  cancer: {
    zh: { 
      love: "家庭氛围温馨，情感需求得到满足。适合和家人共度时光。", 
      career: "适合处理幕后工作，默默积累。适合创业或自由职业。", 
      finance: "财务状况稳定，注意不必要的开支。房产运势佳。", 
      health: "注意胸部和消化系统健康。保持良好的饮食习惯。", 
      tip: "今天适合陪伴家人，处理家庭事务。",
      luckyColor: "银色", luckyNumber: 2, luckyTime: "晚上8-10点",
      weekly: "本周家庭运佳，适合处理家务事。情感上需要安全感。",
      monthly: "本月家庭运上升，适合处理房产相关事宜。财务稳定。",
      compatibility: "天蝎座、双鱼座",
      loveScore: 88, careerScore: 78, financeScore: 82, healthScore: 76,
      loveAdvice: "给伴侣更多的安全感和陪伴。坦诚表达你的感受。",
      careerAdvice: "相信你的直觉，敢于迈出创业第一步。",
      financeAdvice: "稳健理财为主，关注房产和不动产投资。",
      mood: "敏感细腻", energy: "内敛", focus: "家庭",
      bestDay: "星期一", worstDay: "星期四", keyPhrase: "温情守护"},
    en: { 
      love: "Warm family atmosphere, emotional needs met.", 
      career: "Good for behind-the-scenes work.", 
      finance: "Stable finances, watch expenses.", 
      health: "Watch chest and digestive health.", 
      tip: "Good day to spend with family.",
      luckyColor: "Silver", luckyNumber: 2, luckyTime: "8-10 PM",
      weekly: "Great family week. Need emotional security.",
      monthly: "Family luck rises this month. Stable finances.",
      compatibility: "Scorpio, Pisces",
      loveScore: 88, careerScore: 78, financeScore: 82, healthScore: 76,
      loveAdvice: "Give your partner more security and companionship.",
      careerAdvice: "Trust your intuition, dare to take the entrepreneurial step.",
      financeAdvice: "Focus on stable investments, real estate is promising.",
      mood: "Sensitive", energy: "Reserved", focus: "Family",
      bestDay: "Monday", worstDay: "Thursday", keyPhrase: "Tender guardian"},
    id: { 
      love: "Suasana keluarga hangat, kebutuhan emosional terpenuhi.", 
      career: "Baik untuk pekerjaan di belakang layar.", 
      finance: "Keuangan stabil, perhatikan pengeluaran.", 
      health: "Jaga kesehatan dada dan pencernaan.", 
      tip: "Hari yang baik untuk bersama keluarga.",
      luckyColor: "Perak", luckyNumber: 2, luckyTime: "8-10 Malam",
      weekly: "Minggu keluarga bagus. Butuh keamanan emosional.",
      monthly: "Kehidupan keluarga naik bulan ini.",
      compatibility: "Scorpio, Pisces",
      loveScore: 88, careerScore: 78, financeScore: 82, healthScore: 76,
      loveAdvice: "Beri pasangan lebih banyak keamanan.",
      careerAdvice: "Percayai intuisimu.",
      financeAdvice: "Fokus pada investasi stabil.",
      mood: "Sensitif", energy: "Terukur", focus: "Keluarga",
      bestDay: "Senin", worstDay: "Kamis", keyPhrase: "Penjaga penuh kasih"}},
  leo: {
    zh: { 
      love: "魅力四射，感情生活丰富多彩。容易吸引异性的目光。", 
      career: "领导力展现，获得更多关注。事业上有重大突破。", 
      finance: "偏财运不错，可能有意外收获。适合高风险高回报投资。", 
      health: "注意心脏和背部健康。保持运动习惯。", 
      tip: "今天是你闪耀的日子！展现你的才华和魅力！",
      luckyColor: "金色", luckyNumber: 1, luckyTime: "中午12-2点",
      weekly: "本周个人魅力爆棚，适合展示才华。爱情运极佳。",
      monthly: "本月整体运势强势，尤其是事业和感情。自信会为你带来好运。",
      compatibility: "白羊座、射手座",
      loveScore: 95, careerScore: 90, financeScore: 85, healthScore: 80,
      loveAdvice: "大胆追求你喜欢的人，你的自信是最吸引人的特质。",
      careerAdvice: "大胆展示你的领导能力公众演说会带来好运。",
      financeAdvice: "偏财运势佳，但也要留一部分钱储蓄。",
      mood: "自信闪耀", energy: "高涨", focus: "创造力",
      bestDay: "星期日", worstDay: "星期二", keyPhrase: "光芒万丈"},
    en: { 
      love: "Charming day, colorful romantic life.", 
      career: "Leadership shown, get more attention.", 
      finance: "Good luck money, possible windfall.", 
      health: "Watch heart and back health.", 
      tip: "It's your day to shine!",
      luckyColor: "Gold", luckyNumber: 1, luckyTime: "12-2 PM",
      weekly: "Personal charm peaks, great for showing talents. Excellent love luck.",
      monthly: "Strong overall luck this month, especially career and love.",
      compatibility: "Aries, Sagittarius",
      loveScore: 95, careerScore: 90, financeScore: 85, healthScore: 80,
      loveAdvice: "Pursue who you like boldly. Your confidence is attractive.",
      careerAdvice: "Show your leadership abilities. Public speaking brings luck.",
      financeAdvice: "Side income good, but save some too.",
      mood: "Confident", energy: "High", focus: "Creativity",
      bestDay: "Sunday", worstDay: "Tuesday", keyPhrase: "Brilliant radiance"},
    id: { 
      love: "Hari yang mempesona, kehidupan cinta berwarna.", 
      career: "Kepemimpinan ditunjukkan, dapat perhatian.", 
      finance: "Hoki uang, mungkin dapat rezeki.", 
      health: "Jaga kesehatan jantung dan punggung.", 
      tip: "Ini hari kamu untuk bersinar!",
      luckyColor: "Emas", luckyNumber: 1, luckyTime: "12-2 Siang",
      weekly: "Pesona personal puncak, bagus untuk menunjukkan bakat.",
      monthly: "Kehidupan keseluruhan kuat bulan ini.",
      compatibility: "Aries, Sagittarius",
      loveScore: 95, careerScore: 90, financeScore: 85, healthScore: 80,
      loveAdvice: "Panjutkan siapa yang kamu suka dengan berani.",
      careerAdvice: "Tunjukkan kemampuan kepemimpinanmu.",
      financeAdvice: "Hoki samping bagus, tapi tabung juga.",
      mood: "Percaya diri", energy: "Tinggi", focus: "Kreativitas",
      bestDay: "Minggu", worstDay: "Selasa", keyPhrase: "Cemerlang"}},
  virgo: {
    zh: { 
      love: "感情细腻，需要更多关注细节。适合用行动表达爱意。", 
      career: "分析能力突出，适合处理复杂问题。工作运稳定上升。", 
      finance: "财务精打细算，适合理财。数字相关工作运气佳。", 
      health: "注意腹部和肠道健康。避免过度操劳。", 
      tip: "今天适合整理和规划，效率会特别高。",
      luckyColor: "棕色", luckyNumber: 5, luckyTime: "下午3-5点",
      weekly: "本周工作效率极高，适合处理细节任务。健康需要关注。",
      monthly: "本月工作运势突出，适合处理重要项目。感情上需要主动一点。",
      compatibility: "金牛座、摩羯座",
      loveScore: 78, careerScore: 95, financeScore: 88, healthScore: 70,
      loveAdvice: "不要太挑剔，学会接受不完美。用行动而非言语表达爱。",
      careerAdvice: "发挥你追求完美的特质，但不要过度纠结细节。",
      financeAdvice: "理财能力出色，适合长期投资规划。",
      mood: "追求完美", energy: "稳定", focus: "分析",
      bestDay: "星期三", worstDay: "星期六", keyPhrase: "精益求精"},
    en: { 
      love: "Detail-oriented in relationships.", 
      career: "Analytical skills shine.", 
      finance: "Careful finances, good for planning.", 
      health: "Watch abdomen and gut health.", 
      tip: "Good day for organizing and planning.",
      luckyColor: "Brown", luckyNumber: 5, luckyTime: "3-5 PM",
      weekly: "High work efficiency, good for detailed tasks. Health needs attention.",
      monthly: "Work performance outstanding, good for important projects.",
      compatibility: "Taurus, Capricorn",
      loveScore: 78, careerScore: 95, financeScore: 88, healthScore: 70,
      loveAdvice: "Don't be too critical, accept imperfections. Show love through actions.",
      careerAdvice: "Use your perfectionism wisely, don't overdo details.",
      financeAdvice: "Great financial management skills, good for long-term planning.",
      mood: "Perfectionist", energy: "Stable", focus: "Analysis",
      bestDay: "Wednesday", worstDay: "Saturday", keyPhrase: "Excellence"},
    id: { 
      love: "Detail-oriented dalam hubungan.", 
      career: "Keterampilan analitis bersinar.", 
      finance: "Keuangan hati-hati, bagus untuk perencanaan.", 
      health: "Jaga kesehatan perut dan usus.", 
      tip: "Hari yang baik untuk mengatur dan merencanakan.",
      luckyColor: "Coklat", luckyNumber: 5, luckyTime: "3-5 Sore",
      weekly: "Efisiensi kerja tinggi, bagus untuk tugas detail.",
      monthly: "Kinerja kerja menonjol bulan ini.",
      compatibility: "Taurus, Capricorn",
      loveScore: 78, careerScore: 95, financeScore: 88, healthScore: 70,
      loveAdvice: "Jangan terlalu kritis, terima ketidaksempurnaan.",
      careerAdvice: "Gunakan kesempurnaanismu dengan bijak.",
      financeAdvice: "Keterampilan manajemen keuangan bagus.",
      mood: "Sempurna", energy: "Stabil", focus: "Analisis",
      bestDay: "Rabu", worstDay: "Sabtu", keyPhrase: "Keunggulan"}},
  libra: {
    zh: { 
      love: "追求和谐，关系更加平衡。社交活动丰富，容易遇到心仪对象。", 
      career: "合作运佳，适合团队工作。艺术和设计相关工作运气好。", 
      finance: "财务平衡，避免过度消费。合伙生意运势上升。", 
      health: "注意肾脏和皮肤健康。保持均衡饮食。", 
      tip: "今天适合社交和建立联系，也适合处理合作事务。",
      luckyColor: "粉色", luckyNumber: 6, luckyTime: "下午4-6点",
      weekly: "本周人际关系和谐，适合合作洽谈。审美能力提升。",
      monthly: "本月社交运佳，适合拓展人脉。感情上可能会有重要发展。",
      compatibility: "双子座、水瓶座",
      loveScore: 88, careerScore: 85, financeScore: 80, healthScore: 82,
      loveAdvice: "不要犹豫不决，勇敢表达你的心意。公平对待感情关系。",
      careerAdvice: "发挥你的协调能力，团队合作会为你带来好运。",
      financeAdvice: "避免冲动购物，建立合理的消费计划。",
      mood: "追求平衡", energy: "和谐", focus: "关系",
      bestDay: "星期五", worstDay: "星期一", keyPhrase: "和谐之美"},
    en: { 
      love: "Seeking harmony, relationships balanced.", 
      career: "Good cooperation, great for teamwork.", 
      finance: "Balanced finances, avoid overspending.", 
      health: "Watch kidney and skin health.", 
      tip: "Good day for socializing and networking.",
      luckyColor: "Pink", luckyNumber: 6, luckyTime: "4-6 PM",
      weekly: "Harmonious relationships, good for negotiations.",
      monthly: "Great social month, possible important relationship developments.",
      compatibility: "Gemini, Aquarius",
      loveScore: 88, careerScore: 85, financeScore: 80, healthScore: 82,
      loveAdvice: "Don't hesitate, express your feelings boldly.",
      careerAdvice: "Use your coordination skills, teamwork brings luck.",
      financeAdvice: "Avoid impulse shopping, build a reasonable budget.",
      mood: "Balanced", energy: "Harmonious", focus: "Relationships",
      bestDay: "Friday", worstDay: "Monday", keyPhrase: "Harmonious beauty"},
    id: { 
      love: "Mencari keharmonisan, hubungan seimbang.", 
      career: "Kerjasama baik, bagus untuk kerja tim.", 
      finance: "Keuangan seimbang, hindari belanja berlebihan.", 
      health: "Jaga kesehatan ginjal dan kulit.", 
      tip: "Hari yang baik untuk bersosialisasi.",
      luckyColor: "Merah Muda", luckyNumber: 6, luckyTime: "4-6 Sore",
      weekly: "Hubungan harmonis, bagus untuk negosiasi.",
      monthly: "Bulan sosial yang bagus, mungkin perkembangan penting.",
      compatibility: "Gemini, Aquarius",
      loveScore: 88, careerScore: 85, financeScore: 80, healthScore: 82,
      loveAdvice: "Jangan ragu, ungkapkan perasaanmu.",
      careerAdvice: "Gunakan keterampilan koordinasi.",
      financeAdvice: "Hindari belanja impulsif.",
      mood: "Seimbang", energy: "Harmonis", focus: "Hubungan",
      bestDay: "Jumat", worstDay: "Senin", keyPhrase: "Keindahan harmonis"}},
  scorpio: {
    zh: { 
      love: "情感深刻，关系进入新阶段。适合深度的情感交流。", 
      career: "洞察力强，适合研究和调查。神秘学相关领域运气佳。", 
      finance: "财务状况改善，可能有遗产或共同财产带来的好运。", 
      health: "注意生殖系统和代谢健康。适合进行深度冥想。", 
      tip: "今天适合深入交流和分享秘密，也是转型的时机。",
      luckyColor: "深红色", luckyNumber: 8, luckyTime: "晚上9-11点",
      weekly: "本周直觉敏锐，适合做重要决定。情感深度交流。",
      monthly: "本月运势强劲，尤其是感情和财务方面。注意控制情绪。",
      compatibility: "巨蟹座、双鱼座",
      loveScore: 90, careerScore: 88, financeScore: 92, healthScore: 78,
      loveAdvice: "坦诚面对自己的情感，深度的连接比表面的浪漫更重要。",
      careerAdvice: "相信你的直觉，秘密项目或研究工作会有突破。",
      financeAdvice: "财务状况佳，可能有意外的收入来源。",
      mood: "深邃神秘", energy: "强烈", focus: "转化",
      bestDay: "星期二", worstDay: "星期六", keyPhrase: "洞察真相"},
    en: { 
      love: "Deep emotions, relationships enter new phase.", 
      career: "Strong insight, good for research.", 
      finance: "Improved finances, possible inheritance.", 
      health: "Watch reproductive and metabolic health.", 
      tip: "Good day for deep conversations and transformation.",
      luckyColor: "Crimson", luckyNumber: 8, luckyTime: "9-11 PM",
      weekly: "Sharp intuition, good for important decisions.",
      monthly: "Strong luck this month, especially in love and finance.",
      compatibility: "Cancer, Pisces",
      loveScore: 90, careerScore: 88, financeScore: 92, healthScore: 78,
      loveAdvice: "Face your emotions honestly. Deep connection matters more than romance.",
      careerAdvice: "Trust your intuition. Secret projects will have breakthroughs.",
      financeAdvice: "Good finances, possible unexpected income.",
      mood: "Deep", energy: "Intense", focus: "Transformation",
      bestDay: "Tuesday", worstDay: "Saturday", keyPhrase: "Insight into truth"},
    id: { 
      love: "Emosi mendalam, hubungan masuk fase baru.", 
      career: "Wawasan kuat, bagus untuk riset.", 
      finance: "Keuangan membaik, mungkin warisan.", 
      health: "Jaga kesehatan reproduksi dan metabolisme.", 
      tip: "Hari yang baik untuk percakapan mendalam.",
      luckyColor: "Kirmizi", luckyNumber: 8, luckyTime: "9-11 Malam",
      weekly: "Intuisi tajam, bagus untuk keputusan penting.",
      monthly: "Kehidupan kuat bulan ini, terutama cinta dan keuangan.",
      compatibility: "Cancer, Pisces",
      loveScore: 90, careerScore: 88, financeScore: 92, healthScore: 78,
      loveAdvice: "Hadapi emosimu dengan jujur.",
      careerAdvice: "Percayai intuisimu, proyek rahasia akan terobosan.",
      financeAdvice: "Keuangan bagus, mungkin pendapatan tak terduga.",
      mood: "Mendalam", energy: "Intens", focus: "Transformasi",
      bestDay: "Selasa", worstDay: "Sabtu", keyPhrase: "Wawasan kebenaran"}},
  sagittarius: {
    zh: { 
      love: "追求自由，社交圈扩大。旅行中容易遇到浪漫邂逅。", 
      career: "学习运佳，可能获得高等教育或出国旅行的机会。", 
      finance: "海外运不错，可能有跨国收入或外汇投资收益。", 
      health: "注意肝脏和臀部健康。多进行户外运动。", 
      tip: "今天适合计划旅行或学习新事物，视野会大大开阔。",
      luckyColor: "紫色", luckyNumber: 3, luckyTime: "上午11-1点",
      weekly: "本周冒险精神高涨，适合尝试新事物。可能有远行机会。",
      monthly: "本月远方运佳，适合旅行和学习。事业上有重要突破。",
      compatibility: "白羊座、狮子座",
      loveScore: 85, careerScore: 90, financeScore: 82, healthScore: 80,
      loveAdvice: "敞开心扉，不要因为害怕承诺而错过真爱。",
      careerAdvice: "继续深造或出国发展会为你带来好运。",
      financeAdvice: "海外投资或教育投资会有不错的回报。",
      mood: "乐观自由", energy: "充沛", focus: "探索",
      bestDay: "星期四", worstDay: "星期一", keyPhrase: "探索无限"},
    en: { 
      love: "Seeking freedom, social circle expands.", 
      career: "Good learning, possible travel or education.", 
      finance: "Good overseas luck, possible international income.", 
      health: "Watch liver and hip health.", 
      tip: "Good day to plan travel or learn.",
      luckyColor: "Purple", luckyNumber: 3, luckyTime: "11 AM-1 PM",
      weekly: "Adventurous spirit high, good for trying new things.",
      monthly: "Great travel and learning month. Career breakthrough possible.",
      compatibility: "Aries, Leo",
      loveScore: 85, careerScore: 90, financeScore: 82, healthScore: 80,
      loveAdvice: "Open your heart. Don't miss true love due to fear of commitment.",
      careerAdvice: "Further study or overseas development brings luck.",
      financeAdvice: "Overseas or education investments pay off well.",
      mood: "Optimistic", energy: "Abundant", focus: "Exploration",
      bestDay: "Thursday", worstDay: "Monday", keyPhrase: "Explore the infinite"},
    id: { 
      love: "Mencari kebebasan, lingkaran sosial melebar.", 
      career: "Belajar baik, mungkin perjalanan atau pendidikan.", 
      finance: "Hoki luar negeri, mungkin pendapatan internasional.", 
      health: "Jaga kesehatan hati dan pinggul.", 
      tip: "Hari yang baik untuk merencanakan perjalanan.",
      luckyColor: "Ungu", luckyNumber: 3, luckyTime: "11-1 Siang",
      weekly: "Semangat petualang tinggi, bagus untuk mencoba hal baru.",
      monthly: "Bulan perjalanan dan belajar yang bagus. Terobosan karir mungkin.",
      compatibility: "Aries, Leo",
      loveScore: 85, careerScore: 90, financeScore: 82, healthScore: 80,
      loveAdvice: "Terbuka hati, jangan takut komitmen.",
      careerAdvice: "Pendidikan lanjut atau pengembangan luar negeri membawa hoki.",
      financeAdvice: "Investasi luar negeri atau pendidikan memberi hasil bagus.",
      mood: "Optimis", energy: "Melimpah", focus: "Eksplorasi",
      bestDay: "Kamis", worstDay: "Senin", keyPhrase: "Jelajahi tak terbatas"}},
  capricorn: {
    zh: { 
      love: "感情稳定，需要表达更多情感。事业心可能影响感情生活。", 
      career: "事业心强，目标导向明确。职场地位稳步上升。", 
      finance: "财务状况改善，储蓄增加。稳健型投资运气好。", 
      health: "注意膝盖和骨骼健康。适合瑜伽或太极等舒缓运动。", 
      tip: "今天适合制定长期目标和计划，稳扎稳打是成功关键。",
      luckyColor: "黑色", luckyNumber: 4, luckyTime: "下午5-7点",
      weekly: "本周事业运强劲，适合推进长期计划。责任感增强。",
      monthly: "本月事业运突出，有升职或创业的机会。感情需要主动经营。",
      compatibility: "金牛座、处女座",
      loveScore: 75, careerScore: 98, financeScore: 90, healthScore: 75,
      loveAdvice: "不要只顾事业而忽视感情，平衡才是幸福的关键。",
      careerAdvice: "你的努力会被认可，职场晋升在望。",
      financeAdvice: "稳健的投资策略会带来长期收益。",
      mood: "务实上进", energy: "稳定", focus: "成就",
      bestDay: "星期六", worstDay: "星期四", keyPhrase: "步步高升"},
    en: { 
      love: "Stable emotions, need to express more feelings.", 
      career: "Career-minded, clear goals.", 
      finance: "Improved finances, more savings.", 
      health: "Watch knee and bone health.", 
      tip: "Good day to set long-term goals.",
      luckyColor: "Black", luckyNumber: 4, luckyTime: "5-7 PM",
      weekly: "Strong career luck, good for long-term planning.",
      monthly: "Outstanding career month, possible promotion.",
      compatibility: "Taurus, Virgo",
      loveScore: 75, careerScore: 98, financeScore: 90, healthScore: 75,
      loveAdvice: "Don't neglect relationships for work. Balance is key.",
      careerAdvice: "Your efforts will be recognized. Promotion in sight.",
      financeAdvice: "Conservative investment strategy brings long-term gains.",
      mood: "Practical", energy: "Stable", focus: "Achievement",
      bestDay: "Saturday", worstDay: "Thursday", keyPhrase: "Rising step by step"},
    id: { 
      love: "Emosi stabil, perlu ungkapkan lebih banyak perasaan.", 
      career: "Berorientasi karir, tujuan jelas.", 
      finance: "Keuangan membaik, tabungan bertambah.", 
      health: "Jaga kesehatan lutut dan tulang.", 
      tip: "Hari yang baik untuk menetapkan tujuan jangka panjang.",
      luckyColor: "Hitam", luckyNumber: 4, luckyTime: "5-7 Sore",
      weekly: "Keberuntungan karir kuat, bagus untuk perencanaan jangka panjang.",
      monthly: "Bulan karir menonjol, mungkin promosi.",
      compatibility: "Taurus, Virgo",
      loveScore: 75, careerScore: 98, financeScore: 90, healthScore: 75,
      loveAdvice: "Jangan abaikan hubungan karena pekerjaan.",
      careerAdvice: "Usahamu akan diakui. Promosi terlihat.",
      financeAdvice: "Strategi investasi konservatif membawa hasil jangka panjang.",
      mood: "Praktis", energy: "Stabil", focus: "Pencapaian",
      bestDay: "Sabtu", worstDay: "Kamis", keyPhrase: "Naik perlahan"}},
  aquarius: {
    zh: { 
      love: "追求独特，关系中有创新。适合打破常规的相处方式。", 
      career: "创新思维突出，适合科技和人道主义工作。",
      finance: "科技和互联网领域有赚钱机会。电子货币投资运佳。", 
      health: "注意小腿和循环系统健康。多进行伸展运动。", 
      tip: "今天适合参与社群活动和公益，你的独特见解会吸引共鸣。",
      luckyColor: "电光蓝", luckyNumber: 7, luckyTime: "晚上10-12点",
      weekly: "本周创意无限，适合创新项目。社交圈可能扩大。",
      monthly: "本月科技运和社交运俱佳。人道主义活动会带来好运。",
      compatibility: "双子座、天秤座",
      loveScore: 82, careerScore: 88, financeScore: 85, healthScore: 78,
      loveAdvice: "接受与众不同的爱情模式，真正的连接超越常规。",
      careerAdvice: "你的创新想法会被重视，科技领域会有好发展。",
      financeAdvice: "科技股和数字货币可以有少量配置。",
      mood: "创新独特", energy: "活跃", focus: "社群",
      bestDay: "星期日", worstDay: "星期三", keyPhrase: "引领潮流"},
    en: { 
      love: "Seeking uniqueness, innovation in relationships.", 
      career: "Innovative thinking, good for tech and humanitarian work.", 
      finance: "Opportunities in tech and internet.", 
      health: "Watch lower legs and circulation.", 
      tip: "Good day for community and humanitarian activities.",
      luckyColor: "Electric Blue", luckyNumber: 7, luckyTime: "10 PM-12 AM",
      weekly: "Unlimited creativity, good for innovative projects.",
      monthly: "Great tech and social month. Humanitarian activities bring luck.",
      compatibility: "Gemini, Libra",
      loveScore: 82, careerScore: 88, financeScore: 85, healthScore: 78,
      loveAdvice: "Accept unconventional love. True connection transcends norms.",
      careerAdvice: "Your innovative ideas will be valued. Tech has good prospects.",
      financeAdvice: "Tech stocks and crypto can have some allocation.",
      mood: "Innovative", energy: "Active", focus: "Community",
      bestDay: "Sunday", worstDay: "Wednesday", keyPhrase: "Lead the trend"},
    id: { 
      love: "Mencari keunikan, inovasi dalam hubungan.", 
      career: "Berpikir inovatif, bagus untuk teknologi.", 
      finance: "Peluang di teknologi dan internet.", 
      health: "Jaga kesehatan kaki bagian bawah dan sirkulasi.", 
      tip: "Hari yang baik untuk kegiatan komunitas.",
      luckyColor: "Biru Listrik", luckyNumber: 7, luckyTime: "10-12 Malam",
      weekly: "Kreativitas tak terbatas, bagus untuk proyek inovatif.",
      monthly: "Bulan teknologi dan sosial yang bagus.",
      compatibility: "Gemini, Libra",
      loveScore: 82, careerScore: 88, financeScore: 85, healthScore: 78,
      loveAdvice: "Terima cinta yang tidak biasa.",
      careerAdvice: "Ide inovasimu akan dihargai.",
      financeAdvice: "Saham teknologi dan kripto bisa dialokasikan.",
      mood: "Inovatif", energy: "Aktif", focus: "Komunitas",
      bestDay: "Minggu", worstDay: "Rabu", keyPhrase: "Pimpin tren"}},
  pisces: {
    zh: { 
      love: "情感丰富，适合艺术创作和浪漫。直觉力强，容易感受到伴侣的需求。", 
      career: "灵感和直觉强，适合创意、艺术和疗愈工作。", 
      finance: "艺术和疗愈领域有收入机会。避免过度理想化的投资。", 
      health: "注意脚部和免疫系统健康。适合冥想和瑜伽。", 
      tip: "今天适合冥想、艺术创作或疗愈，灵感会源源不断。",
      luckyColor: "海蓝色", luckyNumber: 11, luckyTime: "凌晨12-2点",
      weekly: "本周直觉敏锐，适合灵性探索。艺术创作灵感丰富。",
      monthly: "本月艺术和灵性运极佳，适合创作和自我探索。",
      compatibility: "巨蟹座、天蝎座",
      loveScore: 92, careerScore: 82, financeScore: 78, healthScore: 75,
      loveAdvice: "用艺术的方式表达爱意会特别打动人心。",
      careerAdvice: "创意工作会为你带来好运，艺术疗愈领域有发展。",
      financeAdvice: "艺术相关的副业可以考虑，但避免不切实际的投资。",
      mood: "浪漫梦幻", energy: "柔和", focus: "灵性",
      bestDay: "星期四", worstDay: "星期二", keyPhrase: "灵性觉醒"},
    en: { 
      love: "Rich emotions, great for art and romance.", 
      career: "Strong inspiration, good for creative and healing work.", 
      finance: "Opportunities in art and healing.", 
      health: "Watch feet and immune system.", 
      tip: "Good day for meditation, art, or healing.",
      luckyColor: "Sea Blue", luckyNumber: 11, luckyTime: "12-2 AM",
      weekly: "Sharp intuition, good for spiritual exploration.",
      monthly: "Great art and spiritual month. Perfect for creation.",
      compatibility: "Cancer, Scorpio",
      loveScore: 92, careerScore: 82, financeScore: 78, healthScore: 75,
      loveAdvice: "Expressing love through art touches hearts deeply.",
      careerAdvice: "Creative work brings luck. Art healing has potential.",
      financeAdvice: "Consider art-related side work. Avoid unrealistic investments.",
      mood: "Romantic", energy: "Soft", focus: "Spirituality",
      bestDay: "Thursday", worstDay: "Tuesday", keyPhrase: "Spiritual awakening"},
    id: { 
      love: "Emosi kaya, bagus untuk seni dan romansa.", 
      career: "Inspirasi kuat, bagus untuk pekerjaan kreatif.", 
      finance: "Peluang di seni dan penyembuhan.", 
      health: "Jaga kesehatan kaki dan sistem imun.", 
      tip: "Hari yang baik untuk meditasi, seni, atau penyembuhan.",
      luckyColor: "Biru Laut", luckyNumber: 11, luckyTime: "12-2 Dini Hari",
      weekly: "Intuisi tajam, bagus untuk eksplorasi spiritual.",
      monthly: "Bulan seni dan spiritual yang bagus.",
      compatibility: "Cancer, Scorpio",
      loveScore: 92, careerScore: 82, financeScore: 78, healthScore: 75,
      loveAdvice: "Menyatakan cinta melalui seni menyentuh hati dalam.",
      careerAdvice: "Pekerjaan kreatif membawa hoki. Penyembuhan seni punya potensi.",
      financeAdvice: "Pertimbangkan pekerjaan sampingan seni.",
      mood: "Romantis", energy: "Lembut", focus: "Spiritualitas",
      bestDay: "Kamis", worstDay: "Selasa", keyPhrase: "Kebangkitan spiritual"}}};

// Fill in remaining signs with generated data
const baseData = {
  love: "运势平稳，适合稳步发展。", career: "工作进展顺利。", finance: "财务状况良好。",
  health: "健康状态稳定。", tip: "保持积极心态。", luckyColor: "蓝色", luckyNumber: 7, luckyTime: "下午",
  weekly: "本周运势平稳，各方面表现中等偏上。", monthly: "本月整体运势良好，适合稳扎稳打。",
  compatibility: "巨蟹座、金牛座", loveScore: 80, careerScore: 80, financeScore: 80, healthScore: 80,
  loveAdvice: "保持真诚和耐心。", careerAdvice: "继续努力，会有收获。", financeAdvice: "合理规划收支。",
  mood: "平和", energy: "稳定", focus: "平衡", bestDay: "星期三", worstDay: "星期五", keyPhrase: "平稳发展"};

["taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"].forEach(sign => {
  if (!HOROSCOPE_DATA[sign]) {
    HOROSCOPE_DATA[sign] = {
      zh: baseData, en: baseData, id: baseData, th: baseData, vi: baseData, ms: baseData, ja: baseData, ko: baseData};
  }
});

const LABELS: Record<string, Record<string, string>> = {
  zh: { title: "每日运势", subtitle: "选择你的星座，查看今日详尽运势分析", love: "💕 爱情", career: "💼 事业", finance: "💰 财运", health: "❤️ 健康", tip: "✨ 今日提示", selectSign: "选择星座", viewDetail: "查看详细分析", back: "返回首页", luckyColor: "幸运色", luckyNumber: "幸运数字", luckyTime: "幸运时间", weekly: "📅 本周运势", monthly: "📆 本月运势", compatibility: "💕 速配星座", mood: "😄 今日心情", energy: "⚡ 能量状态", focus: "🎯 专注领域", bestDay: "🗓 最佳日", worstDay: "⚠ 注意日", loveScore: "爱情指数", careerScore: "事业指数", financeScore: "财运指数", healthScore: "健康指数", loveAdvice: "💝 爱情建议", careerAdvice: "💼 事业建议", financeAdvice: "💰 理财建议", keyPhrase: "🔑 今日关键词", rulingPlanet: "守护星", element: "元素", dates: "日期" },
  en: { title: "Daily Horoscope", subtitle: "Choose your sign for detailed daily analysis", love: "💕 Love", career: "💼 Career", finance: "💰 Finance", health: "❤️ Health", tip: "✨ Daily Tip", selectSign: "Select Sign", viewDetail: "View Details", back: "Back to Home", luckyColor: "Lucky Color", luckyNumber: "Lucky Number", luckyTime: "Lucky Time", weekly: "📅 Weekly Forecast", monthly: "📆 Monthly Forecast", compatibility: "💕 Best Match", mood: "😄 Today's Mood", energy: "⚡ Energy", focus: "🎯 Focus Area", bestDay: "🗓 Best Day", worstDay: "⚠ Watch Out", loveScore: "Love Score", careerScore: "Career Score", financeScore: "Finance Score", healthScore: "Health Score", loveAdvice: "💝 Love Advice", careerAdvice: "💼 Career Advice", financeAdvice: "💰 Finance Advice", keyPhrase: "🔑 Key Phrase", rulingPlanet: "Ruling Planet", element: "Element", dates: "Dates" },
  id: { title: "Horoskop Harian", subtitle: "Pilih zodiak untuk analisis harian detail", love: "💕 Cinta", career: "💼 Karier", finance: "💰 Keuangan", health: "❤️ Kesehatan", tip: "✨ Tips Harian", selectSign: "Pilih Zodiak", viewDetail: "Lihat Detail", back: "Kembali", luckyColor: "Warna Keberuntungan", luckyNumber: "Angka Keberuntungan", luckyTime: "Waktu Keberuntungan", weekly: "📅 Ramalan Mingguan", monthly: "📆 Ramalan Bulanan", compatibility: "💕 Kecocokan", mood: "😄 Suasana Hati", energy: "⚡ Energi", focus: "🎯 Area Fokus", bestDay: "🗓 Hari Terbaik", worstDay: "⚠ Perhatikan", loveScore: "Skor Cinta", careerScore: "Skor Karier", financeScore: "Skor Keuangan", healthScore: "Skor Kesehatan", loveAdvice: "💝 Saran Cinta", careerAdvice: "💼 Saran Karier", financeAdvice: "💰 Saran Keuangan", keyPhrase: "🔑 Frasa Kunci", rulingPlanet: "Planet Penguasa", element: "Elemen", dates: "Tanggal" },
  th: { title: "ดวงประจำวัน", subtitle: "เลือกราศีเพื่อดูการวิเคราะห์รายวัน", love: "💕 ความรัก", career: "💼 การงาน", finance: "💰 การเงิน", health: "❤️ สุขภาพ", tip: "✨ เคล็ดลับ", selectSign: "เลือกราศี", viewDetail: "ดูรายละเอียด", back: "กลับหน้าแรก", luckyColor: "สีเสี่ยง", luckyNumber: "เลขเสี่ยง", luckyTime: "เวลาเสี่ยง", weekly: "📅 ดวงประจำสัปดาห์", monthly: "📆 ดวงประจำเดือน", compatibility: "💕 ราศีที่เข้ากัน", mood: "😄 อารมณ์วันนี้", energy: "⚡ พลังงาน", focus: "🎯 สมาธิ", bestDay: "🗓 วันดี", worstDay: "⚠ ระวัง", loveScore: "คะแนนรัก", careerScore: "คะแนนงาน", financeScore: "คะแนนเงิน", healthScore: "คะแนนสุขภาพ", loveAdvice: "💝 คำแนะนำเรื่องรัก", careerAdvice: "💼 คำแนะนำเรื่องงาน", financeAdvice: "💰 คำแนะนำเรื่องเงิน", keyPhrase: "🔑 คำสำคัญ", rulingPlanet: "ดาวพิทักษ์", element: "ธาตุ", dates: "วันที่" },
  vi: { title: "Tử Vi Hàng Ngày", subtitle: "Chọn cung để xem tử vi hôm nay", love: "💕 Tình yêu", career: "💼 Sự nghiệp", finance: "💰 Tài chính", health: "❤️ Sức khỏe", tip: "✨ Mẹo", selectSign: "Chọn cung", viewDetail: "Xem chi tiết", back: "Về trang chủ", luckyColor: "Màu may mắn", luckyNumber: "Số may mắn", luckyTime: "Thời gian may mắn", weekly: "📅 Tử vi tuần này", monthly: "📆 Tử vi tháng này", compatibility: "💕 Cung hợp", mood: "😄 Tâm trạng", energy: "⚡ Năng lượng", focus: "🎯 Tập trung", bestDay: "🗓 Ngày tốt", worstDay: "⚠ Cẩn thận", loveScore: "Điểm tình yêu", careerScore: "Điểm sự nghiệp", financeScore: "Điểm tài chính", healthScore: "Điểm sức khỏe", loveAdvice: "💝 Lời khuyên tình yêu", careerAdvice: "💼 Lời khuyên sự nghiệp", financeAdvice: "💰 Lời khuyên tài chính", keyPhrase: "🔑 Từ khóa", rulingPlanet: "Hành tinh cai quản", element: "Nguyên tố", dates: "Ngày" },
  ms: { title: "Horoskop Harian", subtitle: "Pilih zodiak untuk lihat horoskop hari ini", love: "💕 Cinta", career: "💼 Kerjaya", finance: "💰 Kewangan", health: "❤️ Kesihatan", tip: "✨ Tips", selectSign: "Pilih Zodiak", viewDetail: "Lihat Detail", back: "Kembali", luckyColor: "Warna Bertuah", luckyNumber: "Nombor Bertuah", luckyTime: "Masa Bertuah", weekly: "📅 Ramalan Mingguan", monthly: "📆 Ramalan Bulanan", compatibility: "💕 Keserasian", mood: "😄 Suasana", energy: "⚡ Tenaga", focus: "🎯 Fokus", bestDay: "🗓 Hari Terbaik", worstDay: "⚠ Berhati-hati", loveScore: "Skor Cinta", careerScore: "Skor Kerjaya", financeScore: "Skor Kewangan", healthScore: "Skor Kesihatan", loveAdvice: "💝 Nasihat Cinta", careerAdvice: "💼 Nasihat Kerjaya", financeAdvice: "💰 Nasihat Kewangan", keyPhrase: "🔑 Kata Kunci", rulingPlanet: "Planet Penguasa", element: "Unsur", dates: "Tarikh" },
  ja: { title: "今日の運勢", subtitle: "星座を選んで今日の運勢を見る", love: "💕 恋愛", career: "💼 仕事", finance: "💰 金運", health: "❤️ 健康", tip: "✨ ヒント", selectSign: "星座を選択", viewDetail: "詳細を見る", back: "ホームに戻る", luckyColor: "ラッキーカラー", luckyNumber: "ラッキーナンバー", luckyTime: "ラッキータイム", weekly: "📅 週間運勢", monthly: "📆 月間運勢", compatibility: "💕 相性の良い星座", mood: "😄 今日の気分", energy: "⚡ エネルギー", focus: "🎯 フォーカス", bestDay: "🗓 最佳日", worstDay: "⚠ 注意日", loveScore: "恋愛指数", careerScore: "仕事指数", financeScore: "金運指数", healthScore: "健康指数", loveAdvice: "💝 恋愛のヒント", careerAdvice: "💼 仕事のヒント", financeAdvice: "💰 金運のヒント", keyPhrase: "🔑 キーワード", rulingPlanet: "守護星", element: "元素", dates: "日付" },
  ko: { title: "오늘의 운세", subtitle: "별자리를 선택하여 오늘의 운세를 확인하세요", love: "💕 사랑", career: "💼 직장", finance: "💰 재물", health: "❤️ 건강", tip: "✨ 팁", selectSign: "별자리 선택", viewDetail: "상세 보기", back: "홈으로", luckyColor: "행운의 색", luckyNumber: "행운의 숫자", luckyTime: "행운의 시간", weekly: "📅 이번 주 운세", monthly: "📆 이번 달 운세", compatibility: "💕 궁합이 좋은 별자리", mood: "😄 오늘의 기분", energy: "⚡ 에너지", focus: "🎯 집중 분야", bestDay: "🗓 최적의 날", worstDay: "⚠ 주의할 날", loveScore: "사랑 지수", careerScore: "직장 지수", financeScore: "재물 지수", healthScore: "건강 지수", loveAdvice: "💝 사랑 조언", careerAdvice: "💼 직장 조언", financeAdvice: "💰 재물 조언", keyPhrase: "🔑 핵심 키워드", rulingPlanet: "수호성", element: "원소", dates: "날짜" }};

// Score bar component
function ScoreBar({ score, color, label }: { score: number; color: string; label: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">{label}</span>
        <span className={score >= 80 ? "text-gray-400" : score >= 60 ? "text-gray-600" : "text-gray-400"}>{score}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// Category icon mapping
const CATEGORY_ICONS: Record<string, { icon: typeof Heart; color: string; label: string }> = {
  love: { icon: Heart, color: "#FF6B9D", label: "love" },
  career: { icon: Briefcase, color: "#4ECDC4", label: "career" },
  finance: { icon: Wallet, color: "#FFD93D", label: "finance" },
  health: { icon: Activity, color: "#FF6B6B", label: "health" }};

export default function HoroscopePage() {
  const { language } = useLanguage();
  const lang = language || "zh";
  const labels = LABELS[lang] || LABELS.zh;
  const today = new Date().toLocaleDateString(lang === 'zh' ? 'zh-CN' : lang === 'id' ? 'id-ID' : 'en-US', { weekday: "long", month: "long", day: "numeric" });

  const [selectedSign, setSelectedSign] = useState<string>("aries");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<"today" | "weekly" | "monthly">("today");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number>(-1);

  const signData = ZODIAC_DATA[selectedSign as keyof typeof ZODIAC_DATA];
  const horoscope = HOROSCOPE_DATA[selectedSign]?.[lang as keyof typeof HOROSCOPE_DATA[typeof selectedSign]] || HOROSCOPE_DATA[selectedSign]?.en || HOROSCOPE_DATA[selectedSign]?.zh;
  const elemColor = ELEMENT_COLORS[signData?.element as keyof typeof ELEMENT_COLORS] || ELEMENT_COLORS.fire;

  const getLocalizedText = (obj: Record<string, string> | string | undefined): string => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[lang] || obj.zh || obj.en || "";
  };

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      {/* 导航栏 */}
      

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 标题区 */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500/20 rounded-full text-sm text-gray-600 mb-3">
            <Sun size={16} className="fill-gray-300" />
            <span>{today}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{labels.title}</h1>
          <p className="text-gray-500 text-sm">{labels.subtitle}</p>
        </div>

        {/* 星座选择器 - 优化版 */}
        <div className="relative mb-6">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 text-left flex items-center justify-between hover:bg-gray-100 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl" style={{ color: elemColor.color }}>{signData?.symbol}</span>
              <div>
                <div className="font-bold text-gray-900 text-lg">{signData?.names[lang as keyof typeof signData.names] || signData?.names.zh}</div>
                <div className="text-xs text-gray-500 flex gap-2">
                  <span>{labels.dates}: {signData?.dates}</span>
                  <span>•</span>
                  <span>{labels.rulingPlanet}: {signData?.rulingPlanet?.[lang as keyof typeof signData.rulingPlanet] || (typeof signData?.rulingPlanet === 'string' ? signData.rulingPlanet : signData?.rulingPlanet?.zh)}</span>
                </div>
              </div>
            </div>
            <ChevronDown size={20} className={`text-gray-500 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 p-3 rounded-2xl bg-white border border-gray-200 backdrop-blur-xl z-50 grid grid-cols-4 gap-2 max-h-80 overflow-y-auto">
              {Object.entries(ZODIAC_DATA).map(([id, data]) => (
                <button
                  key={id}
                  onClick={() => { setSelectedSign(id); setShowDropdown(false); }}
                  className={`p-2 rounded-xl text-center transition-all ${
                    selectedSign === id 
                      ? "bg-gray-100 border border-gray-300 text-gray-700" 
                      : "bg-gray-50 hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <div className="text-2xl mb-1">{data.symbol}</div>
                  <div className="text-xs truncate">{data.names[lang as keyof typeof data.names] || data.names.zh}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tab 切换 */}
        <div className="flex gap-2 mb-6 bg-gray-50 p-1 rounded-xl">
          {([["today", labels.title.split(' ')[0]], ["weekly", labels.weekly.split(' ')[0]], ["monthly", labels.monthly.split(' ')[0]]] as const).map(([tab, tabLabel]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab 
                  ? "bg-gradient-to-r from-gray-600 to-gray-600 text-white" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tabLabel}
            </button>
          ))}
        </div>

        {/* 运势内容 */}
        {horoscope && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* 星座信息卡 */}
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50/30 to-gray-900/20 border border-gray-200">
              <div className="text-5xl mb-2" style={{ color: elemColor.color }}>{signData?.symbol}</div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: elemColor.color }}>
                {signData?.names[lang as keyof typeof signData.names] || signData?.names.zh}
              </h2>
              <p className="text-gray-500 text-sm">{signData?.element} • {signData?.dates}</p>
              {/* 关键词 */}
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                <Star size={12} className="text-gray-600 fill-gray-400" />
                <span className="text-xs text-gray-600">{labels.keyPhrase}: {horoscope.keyPhrase}</span>
              </div>
            </div>

            {/* 四维指数条 */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-3">📊 {lang==='zh'?'运势指数':lang==='en'?'Fortune Scores':lang==='id'?'Skor Keberuntungan':lang==='th'?'คะแนนดวง':lang==='vi'?'Điểm Tử Vi':lang==='ms'?'Skor Nasib':lang==='ja'?'運勢スコア':lang==='ko'?'운세 점수':'Fortune Scores'}</h3>
              <div className="grid grid-cols-2 gap-4">
                <ScoreBar score={horoscope.loveScore} color="#FF6B9D" label={labels.loveScore} />
                <ScoreBar score={horoscope.careerScore} color="#4ECDC4" label={labels.careerScore} />
                <ScoreBar score={horoscope.financeScore} color="#FFD93D" label={labels.financeScore} />
                <ScoreBar score={horoscope.healthScore} color="#FF6B6B" label={labels.healthScore} />
              </div>
            </div>

            {/* 今日/本周/本月运势 */}
            {activeTab === "today" && (
              <>
                {/* 四维详细 */}
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(CATEGORY_ICONS).map(([key, { icon: Icon, color, label: catLabel }]) => (
                    <div key={key} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={16} style={{ color }} />
                        <span className="text-xs font-medium" style={{ color }}>{(labels as unknown as Record<string, string>)[catLabel] || catLabel}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{(horoscope as unknown as Record<string, string | number | boolean | null>)[key]}</p>
                    </div>
                  ))}
                </div>

                {/* 幸运元素 */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-gray-500/10 to-gray-500/10 border border-gray-500/20 text-center">
                    <div className="text-xl mb-1">🎨</div>
                    <div className="text-xs text-gray-500">{labels.luckyColor}</div>
                    <div className="text-sm font-bold text-gray-300">{horoscope.luckyColor}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-gray-500/10 to-gray-500/10 border border-gray-500/20 text-center">
                    <div className="text-xl mb-1">🔢</div>
                    <div className="text-xs text-gray-500">{labels.luckyNumber}</div>
                    <div className="text-sm font-bold text-gray-300">{horoscope.luckyNumber}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-gray-500/10 to-gray-500/10 border border-gray-200 text-center">
                    <div className="text-xl mb-1">⏰</div>
                    <div className="text-xs text-gray-500">{labels.luckyTime}</div>
                    <div className="text-xs font-bold text-gray-700">{horoscope.luckyTime}</div>
                  </div>
                </div>

                {/* 心情能量 */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
                    <div className="text-xl mb-1">😄</div>
                    <div className="text-xs text-gray-500">{labels.mood}</div>
                    <div className="text-sm font-bold text-gray-900">{horoscope.mood}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
                    <div className="text-xl mb-1">⚡</div>
                    <div className="text-xs text-gray-500">{labels.energy}</div>
                    <div className="text-sm font-bold text-gray-900">{horoscope.energy}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
                    <div className="text-xl mb-1">🎯</div>
                    <div className="text-xs text-gray-500">{labels.focus}</div>
                    <div className="text-sm font-bold text-gray-900">{horoscope.focus}</div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "weekly" && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-gray-500/10 to-gray-500/10 border border-gray-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={18} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-300">{labels.weekly}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{horoscope.weekly}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-gray-500/10 border border-gray-500/20">
                    <span className="text-gray-400">✓ {labels.bestDay}: </span>
                    <span className="text-gray-900">{horoscope.bestDay}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-500/10 border border-gray-500/20">
                    <span className="text-gray-400">⚠ {labels.worstDay}: </span>
                    <span className="text-gray-900">{horoscope.worstDay}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "monthly" && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-gray-500/10 to-gray-500/10 border border-gray-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={18} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">{labels.monthly}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{horoscope.monthly}</p>
              </div>
            )}

            {/* 三项建议 */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Sparkles size={16} className="text-gray-600" />
                {lang==='zh'?'💡 个性化建议':lang==='en'?'💡 Personal Advice':lang==='id'?'💡 Saran Personal':lang==='th'?'💡 คำแนะนำส่วนตัว':lang==='vi'?'💡 Lời Khuyên Cá Nhân':lang==='ms'?'💡 Nasihat Peribadi':lang==='ja'?'💡 パーソナルアドバイス':lang==='ko'?'💡 개인 조언':'💡 Personal Advice'}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="p-3 rounded-lg bg-gray-500/10 border border-gray-500/20">
                  <span className="text-gray-400 font-medium">{labels.loveAdvice} </span>
                  <span className="text-gray-600">{horoscope.loveAdvice}</span>
                </div>
                <div className="p-3 rounded-lg bg-gray-500/10 border border-gray-500/20">
                  <span className="text-gray-400 font-medium">{labels.careerAdvice} </span>
                  <span className="text-gray-600">{horoscope.careerAdvice}</span>
                </div>
                <div className="p-3 rounded-lg bg-gray-500/10 border border-gray-500/20">
                  <span className="text-gray-600 font-medium">{labels.financeAdvice} </span>
                  <span className="text-gray-600">{horoscope.financeAdvice}</span>
                </div>
              </div>
            </div>

            {/* 今日提示 */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-gray-500/10 to-gray-500/10 border border-gray-500/20">
              <div className="text-xs font-medium mb-2 text-gray-600 flex items-center gap-2">
                <Sparkles size={14} />
                {labels.tip}
              </div>
              <p className="text-sm text-gray-100/80">{horoscope.tip}</p>
            </div>

            {/* 速配星座 */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-gray-500/10 to-gray-500/10 border border-gray-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Users size={18} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-300">{labels.compatibility}</span>
              </div>
              <p className="text-sm text-gray-600">{horoscope.compatibility}</p>
            </div>

            {/* 查看年度运势 */}
            <Link
              href={`/yearly-horoscope?sign=${selectedSign}`}
              className="block w-full p-4 rounded-xl bg-gray-600/20 border border-gray-200 text-center text-gray-700 hover:bg-gray-600/30 transition-all"
            >
              {labels.viewDetail} →
            </Link>
          </div>
        )}

        {/* SEO Description */}
        <section className="max-w-4xl mx-auto mt-12 mb-8 px-4">
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-500 leading-relaxed">
              {lang === 'zh' 
                ? '每日运势基于占星学原理，结合行星运行位置与星座特质，为你提供个性化运势分析。涵盖爱情、事业、财运、健康四大维度。':lang==='id'?'Horoskop harian berdasarkan prinsip astrologi, menggabungkan posisi planet dengan sifat zodiak. Mencakup cinta, karier, keuangan, dan kesehatan.':lang==='th'?'ดูดวงรายวันตามหลักโหราศาสตร์ ผสมผสานตำแหน่งดาวกับลักษณะราศี ครอบคลุมความรัก การงาน การเงิน และสุขภาพ':lang==='vi'?'Tử vi hàng ngày dựa trên nguyên lý chiêm tinh, kết hợp vị trí hành tinh với đặc điểm cung hoàng đạo. Bao gồm tình yêu, sự nghiệp, tài chính và sức khỏe.':lang==='ms'?'Horoskop harian berdasarkan prinsip astrologi, menggabungkan posisi planet dengan sifat zodiak. Meliputi cinta, kerjaya, kewangan dan kesihatan.':lang==='ja'?'占星学の原理に基づくデイリー運勢。惑星の位置と星座の特質を組み合わせ、恋愛・仕事・金運・健康の4次元をカバー。':lang==='ko'?'점성술 원리에 기반한 일일 운세. 행성 위치와 별자리 특성을 결합하여 사랑, 직업, 재정, 건강을 다룹니다.':'Daily horoscope based on astrological principles, combining planetary positions with zodiac traits. Covers love, career, finance, and health dimensions.'}
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto mb-12 px-4">
          <h2 className="text-xl font-semibold text-center mb-6">
            {(() => { const t: Record<string,string> = {zh:'常见问题',en:'FAQ',id:'Pertanyaan Umum',th:'คำถามที่พบบ่อย',vi:'Câu hỏi thường gặp',ms:'Soalan Lazim',ja:'よくある質問',ko:'자주 묻는 질문'}; return t[lang] || 'FAQ'; })()}
          </h2>
          <div className="space-y-3">
            {(() => {
              const faqs = [
                { q: {zh:'每日运势的准确度如何？',en:'How accurate is the daily horoscope?',id:'Seberapa akurat horoskop harian?',th:'ดวงรายวันแม่นยำแค่ไหน?',vi:'Tử vi hàng ngày chính xác đến đâu?',ms:'Seberapa tepat horoskop harian?',ja:'デイリー運勢の正確さは？',ko:'일일 운세의 정확도는?'},
                  a: {zh:'基于传统占星学理论，结合行星运行轨迹与星座特质分析，提供有价值的参考和指引。',en:'Based on traditional astrology, combining planetary movements with zodiac traits for valuable guidance.',id:'Berdasarkan astrologi tradisional, memberikan referensi dan panduan berharga.',th:'ตามหลักโหราศาสตร์ดั้งเดิม ผสมผสานการเคลื่อนที่ของดาวกับลักษณะราศีเพื่อให้คำแนะนำที่มีคุณค่า',vi:'Dựa trên chiêm tinh học truyền thống, kết hợp chuyển động hành tinh với đặc điểm hoàng đạo.',ms:'Berdasarkan astrologi tradisional, menggabungkan pergerakan planet dengan sifat zodiak untuk panduan berharga.',ja:'伝統的な占星学に基づき、惑星の動きと星座の特質を組み合わせた貴重なガイダンス。',ko:'전통 점성술에 기반하여 행성 움직임과 별자리 특성을 결합한 귀중한 지침.'} },
                { q: {zh:'如何根据运势规划一天？',en:'How to plan your day?',id:'Bagaimana merencanakan hari?',th:'วางแผนวันตามดวงอย่างไร?',vi:'Làm sao để lên kế hoạch theo tử vi?',ms:'Bagaimana merancang hari mengikut horoskop?',ja:'運勢に基づいて一日を計画するには？',ko:'운세에 따라 하루를 계획하는 방법?'},
                  a: {zh:'早晨查看运势，了解今日能量趋势，合理安排重要事务的时间节点。',en:'Check your horoscope in the morning to understand energy trends.',id:'Periksa horoskop di pagi hari untuk memahami tren energi.',th:'ตอนเช้าดูดวงเพื่อเข้าใจแนวโน้มพลังงาน',vi:'Xem tử vi buổi sáng để hiểu xu hướng năng lượng',ms:'Periksa horoskop pagi untuk memahami tren tenaga',ja:'朝に運勢をチェックしてエネルギーの流れを理解',ko:'아침에 운세를 확인하여 에너지 흐름을 이해'} },
                { q: {zh:'不同星座之间有什么关联？',en:'How are zodiac signs related?',id:'Apa hubungan antar zodiak?',th:'ราศีต่างๆเกี่ยวข้องกันอย่างไร?',vi:'Các cung hoàng đạo liên quan với nhau thế nào?',ms:'Bagaimana hubungan antara zodiak?',ja:'星座同士の関係は？',ko:'별자리 간의 관계는?'},
                  a: {zh:'星座按元素分为火土风水四象，同元素星座性格相近，对宫星座互补。',en:'Signs are grouped by four elements: fire, earth, air, water.',id:'Zodiak dibagi menjadi empat elemen: api, tanah, udara, air.',th:'ราศีแบ่งเป็น 4 ธาตุ: ไฟ ดิน ลม น้ำ',vi:'Cung hoàng đạo chia 4 nguyên tố: lửa, đất, khí, nước.',ms:'Zodiak dibahagi kepada 4 elemen: api, tanah, udara, air.',ja:'星座は火・土・風・水の4元素に分かれる',ko:'별자리는 불, 흙, 공기, 물 4원소로 나뉜다'} },
                { q: {zh:'运势指数如何计算？',en:'How are scores calculated?',id:'Bagaimana skor dihitung?',th:'คะแนนดวงคำนวณอย่างไร?',vi:'Điểm tử vi được tính thế nào?',ms:'Bagaimana skor dikira?',ja:'運勢スコアの計算方法は？',ko:'운세 점수는 어떻게 계산되나요?'},
                  a: {zh:'综合行星相位、宫位能量和星座特质，通过占星学模型综合评估得出。',en:'Combining planetary aspects and house energies for assessment.',id:'Menggabungkan aspek planet dan energi rumah untuk penilaian.',th:'รวมมุมดาว พลังงานบ้าน และลักษณะราศีผ่านแบบจำลองโหราศาสตร์',vi:'Kết hợp góc chiếu hành tinh, năng lượng nhà và đặc điểm cung',ms:'Menggabungkan aspek planet, tenaga rumah dan sifat zodiak',ja:'惑星アスペクト、ハウスエネルギー、星座特質を占星学モデルで評価',ko:'행성 각도, 하우스 에너지, 별자리 특성을 점성술 모델로 평가'} },
                { q: {zh:'可以同时参考多个时间维度吗？',en:'Can I check multiple periods?',id:'Bisa lihat beberapa periode?',th:'ดูได้หลายช่วงเวลาไหม?',vi:'Có thể xem nhiều khoảng thời gian không?',ms:'Boleh lihat beberapa tempoh masa?',ja:'複数の期間を同時に参考にできますか？',ko:'여러 기간을 동시에 참고할 수 있나요?'},
                  a: {zh:'建议结合日运、周运、月运综合判断，短期看执行，长期看规划。',en:'Combine daily, weekly, and monthly for better insights.',id:'Kami sarankan menggabungkan harian, mingguan, dan bulanan.',th:'แนะนำให้รวมรายวัน รายสัปดาห์ รายเดือน',vi:'Kết hợp hàng ngày, hàng tuần, hàng tháng.',ms:'Gabungkan harian, mingguan, bulanan.',ja:'デイリー・ウィークリー・マンスリーを組み合わせて判断',ko:'일간, 주간, 월간을 결합하여 판단'} },
              ];
              return faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}
                    className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-left">
                    <span className="text-sm font-medium text-gray-900">{faq.q[lang as keyof typeof faq.q] || faq.q.en}</span>
                    <ChevronDown size={18} className={`text-gray-400 transition-transform ${faqOpen === i ? 'rotate-180' : ''}`} />
                  </button>
                  {faqOpen === i && (
                    <div className="p-4 bg-white border-t border-gray-100">
                      <p className="text-sm text-gray-600">{faq.a[lang as keyof typeof faq.a] || faq.a.en}</p>
                    </div>
                  )}
                </div>
              ));
            })()}
          </div>
        </section>
      </main>
    </div>
  );
}