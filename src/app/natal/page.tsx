"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Star, Sun, Moon, Calendar, TrendingUp, Heart, Loader2, ChevronDown, Check, X, Sparkles, Lock, Share2, CheckCircle, MessageCircle } from 'lucide-react';

// Complete translations
const T = {
  zh: {
    back: '返回首页', title: '本命盘分析',
    birthInfo: '出生信息', person1: '第一人', person2: '第二人',
    year: '年', month: '月', day: '日', hour: '时', minute: '分',
    city: '城市', houseSystem: '分宫制',
    natal: '本命盘', transit: '推运盘', solar: '日返盘', lunar: '月返盘',
    progression: '法达星限', composite: '组合盘',
    transitDate: '推运日期', targetYear: '目标年份',
    chartName: '星盘名称（可选）',
    calculate: '生成星盘', calculating: '计算中...',
    chart: '星盘', planets: '行星', houses: '宫位', aspects: '相位', ai: 'AI解读',
    saveChart: '保存星盘', planetPositions: '行星位置',
    planet: '行星', sign: '星座', degree: '度数', house: '宫位',
    houseInfo: '宫位信息', majorAspects: '主要相位',
    chartSaved: '已保存！', loading: '加载中...',
    dayAfterBirth: '出生后第 {0} 天',
    savedCharts: '已保存的星盘', noSaved: '暂无保存的星盘',
    enterAll: '请填写完整的出生信息',
    ascendant: '上升点', midheaven: '天顶',
    conjunction: '合相', sextile: '六分', square: '四分', trine: '三分', opposition: '对分',
    error: '计算错误', retry: '重试',
    aiReading: 'AI 解读', simpleReading: '简要解读', deepReading: '深度解读',
    freeReading: '免费版', unlockDeep: '解锁深度解读',
    loginToUnlock: '登录解锁完整版', shareToUnlock: '或分享给3位好友解锁',
    shareWA: '分享到WhatsApp', shareProgress: '分享进度',
    shareComplete: '分享完成！已解锁', friend: '好友',
    corePersonality: '核心性格', emotionalWorld: '情感世界',
    loveDestiny: '爱情缘分', actionEnergy: '行动能量',
  },
  en: {
    back: 'Back to Home', title: 'Natal Chart',
    birthInfo: 'Birth Info', person1: 'Person 1', person2: 'Person 2',
    year: 'Year', month: 'Month', day: 'Day', hour: 'Hour', minute: 'Min',
    city: 'City', houseSystem: 'House System',
    natal: 'Natal', transit: 'Transit', solar: 'Solar Return', lunar: 'Lunar Return',
    progression: 'Progression', composite: 'Composite',
    transitDate: 'Transit Date', targetYear: 'Target Year',
    chartName: 'Chart name (optional)',
    calculate: 'Generate Chart', calculating: 'Calculating...',
    chart: 'Chart', planets: 'Planets', houses: 'Houses', aspects: 'Aspects', ai: 'AI Reading',
    saveChart: 'Save Chart', planetPositions: 'Planet Positions',
    planet: 'Planet', sign: 'Sign', degree: 'Degree', house: 'House',
    houseInfo: 'House Info', majorAspects: 'Major Aspects',
    chartSaved: 'Saved!', loading: 'Loading...',
    dayAfterBirth: 'Day {0} after birth',
    savedCharts: 'Saved Charts', noSaved: 'No saved charts',
    enterAll: 'Please enter complete birth information',
    ascendant: 'Ascendant', midheaven: 'Midheaven',
    conjunction: 'Conjunction', sextile: 'Sextile', square: 'Square', trine: 'Trine', opposition: 'Opposition',
    error: 'Calculation Error', retry: 'Retry',
    aiReading: 'AI Reading', simpleReading: 'Summary', deepReading: 'Deep Reading',
    freeReading: 'Free', unlockDeep: 'Unlock Deep Reading',
    loginToUnlock: 'Login to unlock full version', shareToUnlock: 'Or share with 3 friends to unlock',
    shareWA: 'Share to WhatsApp', shareProgress: 'Share Progress',
    shareComplete: 'Sharing complete! Unlocked', friend: 'Friend',
    corePersonality: 'Core Personality', emotionalWorld: 'Emotional World',
    loveDestiny: 'Love Destiny', actionEnergy: 'Action Energy',
  },
  id: {
    back: 'Kembali', title: 'Bagan Lahir',
    birthInfo: 'Data Lahir', person1: 'Orang 1', person2: 'Orang 2',
    year: 'Tahun', month: 'Bulan', day: 'Hari', hour: 'Jam', minute: 'Menit',
    city: 'Kota', houseSystem: 'Sistem Rumah',
    natal: 'Bagan Lahir', transit: 'Transit', solar: 'Solar Return', lunar: 'Lunar Return',
    progression: 'Progresi', composite: 'Komposit',
    transitDate: 'Tanggal Transit', targetYear: 'Tahun Target',
    chartName: 'Nama bagan (opsional)',
    calculate: 'Buat Bagan', calculating: 'Menghitung...',
    chart: 'Bagan', planets: 'Planet', houses: 'Rumah', aspects: 'Aspek', ai: 'AI Bacaan',
    saveChart: 'Simpan Bagan', planetPositions: 'Posisi Planet',
    planet: 'Planet', sign: 'Zodiak', degree: 'Derajat', house: 'Rumah',
    houseInfo: 'Info Rumah', majorAspects: 'Aspek Utama',
    chartSaved: 'Tersimpan!', loading: 'Memuat...',
    dayAfterBirth: 'Hari ke-{0} setelah lahir',
    savedCharts: 'Bagan Tersimpan', noSaved: 'Belum ada bagan',
    enterAll: 'Silakan masukkan informasi lahir lengkap',
    ascendant: 'Ascenden', midheaven: 'Medium Coeli',
    conjunction: 'Konjungsi', sextile: 'Sextile', square: 'Kotak', trine: 'Trine', opposition: 'Oposisi',
    error: 'Kesalahan Kalkulasi', retry: 'Coba lagi',
    aiReading: 'Pembacaan AI', simpleReading: 'Ringkasan', deepReading: 'Mendalam',
    freeReading: 'Gratis', unlockDeep: 'Buka Pembacaan Mendalam',
    loginToUnlock: 'Masuk untuk membuka versi lengkap', shareToUnlock: 'Atau bagikan ke 3 teman untuk membuka',
    shareWA: 'Bagikan ke WhatsApp', shareProgress: 'Progres Berbagi',
    shareComplete: 'Berbagi selesai! Terbuka', friend: 'Teman',
    corePersonality: 'Kepribadian Inti', emotionalWorld: 'Dunia Emosi',
    loveDestiny: 'Takdir Cinta', actionEnergy: 'Energi Aksi',
  },
};

const PLANETS_CN: Record<string, string> = {
  Sun: '太阳', Moon: '月亮', Mercury: '水星', Venus: '金星', Mars: '火星',
  Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Pluto: '冥王星',
  North_Node: '北交点', South_Node: '南交点',
};
const PLANET_KEYS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'North_Node', 'South_Node'];
const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂', Jupiter: '♃', Saturn: '♄',
  Uranus: '♅', Neptune: '♆', Pluto: '♇', North_Node: '☊', South_Node: '☋',
};
const SIGN_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const SIGN_CN: Record<string, string> = {
  Aries: '白羊', Taurus: '金牛', Gemini: '双子', Cancer: '巨蟹', Leo: '狮子', Virgo: '处女',
  Libra: '天秤', Scorpio: '天蝎', Sagittarius: '射手', Capricorn: '摩羯', Aquarius: '水瓶', Pisces: '双鱼',
};
const SIGN_EN: Record<string, string> = {
  Aries: 'Aries', Taurus: 'Taurus', Gemini: 'Gemini', Cancer: 'Cancer', Leo: 'Leo', Virgo: 'Virgo',
  Libra: 'Libra', Scorpio: 'Scorpio', Sagittarius: 'Sagittarius', Capricorn: 'Capricorn', Aquarius: 'Aquarius', Pisces: 'Pisces',
};

// 全球城市数据库 - 包含精确的经纬度和时区数据
const CITIES = [
  // Indonesia - Major Cities (19 cities)
  { id: 'jakarta', name: { zh: '雅加达', en: 'Jakarta', id: 'Jakarta', th: 'จาการ์ตา', vi: 'Jakarta', ms: 'Jakarta', ja: 'ジャカルタ', ko: '자카르타' }, lat: -6.2088, lng: 106.8456, tz: 7, region: 'indonesia' },
  { id: 'surabaya', name: { zh: '泗水', en: 'Surabaya', id: 'Surabaya', th: 'สุราบายา', vi: 'Surabaya', ms: 'Surabaya', ja: 'スラバヤ', ko: '수라바야' }, lat: -7.2575, lng: 112.7521, tz: 7, region: 'indonesia' },
  { id: 'bandung', name: { zh: '万隆', en: 'Bandung', id: 'Bandung', th: 'บันดุง', vi: 'Bandung', ms: 'Bandung', ja: 'バンドン', ko: '반둥' }, lat: -6.9175, lng: 107.6191, tz: 7, region: 'indonesia' },
  { id: 'medan', name: { zh: '棉兰', en: 'Medan', id: 'Medan', th: 'เมดาน', vi: 'Medan', ms: 'Medan', ja: 'メダン', ko: '메단' }, lat: 3.5952, lng: 98.6722, tz: 7, region: 'indonesia' },
  { id: 'semarang', name: { zh: '三宝垄', en: 'Semarang', id: 'Semarang', th: 'เซมารัง', vi: 'Semarang', ms: 'Semarang', ja: 'スマラン', ko: '스마랑' }, lat: -6.9932, lng: 110.4203, tz: 7, region: 'indonesia' },
  { id: 'makassar', name: { zh: '望加锡', en: 'Makassar', id: 'Makassar', th: 'มากัสซาร์', vi: 'Makassar', ms: 'Makassar', ja: 'マカッサル', ko: '마카사르' }, lat: -5.1477, lng: 119.4327, tz: 8, region: 'indonesia' },
  { id: 'palembang', name: { zh: '巨港', en: 'Palembang', id: 'Palembang', th: 'ปาเลมบัง', vi: 'Palembang', ms: 'Palembang', ja: 'パレンバン', ko: '팔렘방' }, lat: -2.9761, lng: 104.7754, tz: 7, region: 'indonesia' },
  { id: 'tangerang', name: { zh: '唐格朗', en: 'Tangerang', id: 'Tangerang', th: 'ตังเกอรัง', vi: 'Tangerang', ms: 'Tangerang', ja: 'タンゲラン', ko: '탕게랑' }, lat: -6.1783, lng: 106.6319, tz: 7, region: 'indonesia' },
  { id: 'depok', name: { zh: '德波', en: 'Depok', id: 'Depok', th: 'เดปก', vi: 'Depok', ms: 'Depok', ja: 'デポック', ko: '데포크' }, lat: -6.4025, lng: 106.7942, tz: 7, region: 'indonesia' },
  { id: 'bekasi', name: { zh: '勿加泗', en: 'Bekasi', id: 'Bekasi', th: 'เบกาซี', vi: 'Bekasi', ms: 'Bekasi', ja: 'ベカシ', ko: '베카시' }, lat: -6.2349, lng: 106.9896, tz: 7, region: 'indonesia' },
  { id: 'yogyakarta', name: { zh: '日惹', en: 'Yogyakarta', id: 'Yogyakarta', th: 'โยกยาการ์ตา', vi: 'Yogyakarta', ms: 'Yogyakarta', ja: 'ジョグジャカルタ', ko: '요ogyakarta' }, lat: -7.7956, lng: 110.3695, tz: 7, region: 'indonesia' },
  { id: 'malang', name: { zh: '玛琅', en: 'Malang', id: 'Malang', th: 'มาลัง', vi: 'Malang', ms: 'Malang', ja: 'マラン', ko: '말랑' }, lat: -7.9666, lng: 112.6326, tz: 7, region: 'indonesia' },
  { id: 'denpasar', name: { zh: '登巴萨', en: 'Denpasar', id: 'Denpasar', th: 'เดนปาซาร์', vi: 'Denpasar', ms: 'Denpasar', ja: 'デンパサール', ko: '덴파사르' }, lat: -8.6705, lng: 115.2126, tz: 8, region: 'indonesia' },
  { id: 'manado', name: { zh: '万鸦老', en: 'Manado', id: 'Manado', th: 'มานาโด', vi: 'Manado', ms: 'Manado', ja: 'マナド', ko: '마나도' }, lat: 1.4748, lng: 124.8421, tz: 8, region: 'indonesia' },
  { id: 'pontianak', name: { zh: '坤甸', en: 'Pontianak', id: 'Pontianak', th: 'ปอนติอานัก', vi: 'Pontianak', ms: 'Pontianak', ja: 'ポンティアナック', ko: '폰티아낙' }, lat: -0.0263, lng: 109.3425, tz: 7, region: 'indonesia' },
  { id: 'banjarmasin', name: { zh: '马辰', en: 'Banjarmasin', id: 'Banjarmasin', th: 'บันจาร์มาซิน', vi: 'Banjarmasin', ms: 'Banjarmasin', ja: 'バンジャルマシン', ko: '반자륧마신' }, lat: -3.3167, lng: 114.5901, tz: 8, region: 'indonesia' },
  { id: 'batam', name: { zh: '巴淡岛', en: 'Batam', id: 'Batam', th: 'บาตัม', vi: 'Batam', ms: 'Batam', ja: 'バタム', ko: '바탐' }, lat: 1.1301, lng: 104.0533, tz: 7, region: 'indonesia' },
  { id: 'pekanbaru', name: { zh: '北干巴鲁', en: 'Pekanbaru', id: 'Pekanbaru', th: 'เปอร์กันรู', vi: 'Pekanbaru', ms: 'Pekanbaru', ja: 'ペカンバル', ko: '페칸바루' }, lat: 0.5071, lng: 101.4478, tz: 7, region: 'indonesia' },
  { id: 'padang', name: { zh: '巴东', en: 'Padang', id: 'Padang', th: 'ปาดัง', vi: 'Padang', ms: 'Padang', ja: 'パダン', ko: '파당' }, lat: -0.9471, lng: 100.4172, tz: 7, region: 'indonesia' },
  
  // China (15 cities)
  { id: 'beijing', name: { zh: '北京', en: 'Beijing', id: 'Beijing', th: 'ปักกิ่ง', vi: 'Bắc Kinh', ms: 'Beijing', ja: '北京', ko: '베이징' }, lat: 39.9042, lng: 116.4074, tz: 8, region: 'china' },
  { id: 'shanghai', name: { zh: '上海', en: 'Shanghai', id: 'Shanghai', th: 'เซี่ยงไฮ้', vi: 'Thượng Hải', ms: 'Shanghai', ja: '上海', ko: '상하이' }, lat: 31.2304, lng: 121.4737, tz: 8, region: 'china' },
  { id: 'guangzhou', name: { zh: '广州', en: 'Guangzhou', id: 'Guangzhou', th: 'กวางโจว', vi: 'Quảng Châu', ms: 'Guangzhou', ja: '広州', ko: '광저우' }, lat: 23.1291, lng: 113.2644, tz: 8, region: 'china' },
  { id: 'shenzhen', name: { zh: '深圳', en: 'Shenzhen', id: 'Shenzhen', th: 'เซินเจิ้น', vi: 'Thâm Quyến', ms: 'Shenzhen', ja: '深セン', ko: '선전' }, lat: 22.5431, lng: 114.0579, tz: 8, region: 'china' },
  { id: 'chengdu', name: { zh: '成都', en: 'Chengdu', id: 'Chengdu', th: 'เฉิงตู', vi: 'Thành Đô', ms: 'Chengdu', ja: '成都', ko: '청두' }, lat: 30.5728, lng: 104.0668, tz: 8, region: 'china' },
  { id: 'hangzhou', name: { zh: '杭州', en: 'Hangzhou', id: 'Hangzhou', th: 'หางโจว', vi: 'Hàng Châu', ms: 'Hangzhou', ja: '杭州', ko: '항저우' }, lat: 30.2741, lng: 120.1551, tz: 8, region: 'china' },
  { id: 'wuhan', name: { zh: '武汉', en: 'Wuhan', id: 'Wuhan', th: 'อู่ฮั่น', vi: 'Vũ Hán', ms: 'Wuhan', ja: '武漢', ko: '우한' }, lat: 30.5928, lng: 114.3055, tz: 8, region: 'china' },
  { id: 'xian', name: { zh: '西安', en: "Xi'an", id: "Xi'an", th: 'ซีอาน', vi: 'Tây An', ms: "Xi'an", ja: '西安', ko: '시안' }, lat: 34.3416, lng: 108.9398, tz: 8, region: 'china' },
  { id: 'nanjing', name: { zh: '南京', en: 'Nanjing', id: 'Nanjing', th: 'นานกิง', vi: 'Nam Kinh', ms: 'Nanjing', ja: '南京', ko: '난징' }, lat: 32.0603, lng: 118.7969, tz: 8, region: 'china' },
  { id: 'chongqing', name: { zh: '重庆', en: 'Chongqing', id: 'Chongqing', th: 'ฉงชิ่ง', vi: 'Trùng Khánh', ms: 'Chongqing', ja: '重慶', ko: '충칭' }, lat: 29.5630, lng: 106.5516, tz: 8, region: 'china' },
  { id: 'tianjin', name: { zh: '天津', en: 'Tianjin', id: 'Tianjin', th: 'เทียนจิน', vi: 'Thiên Tân', ms: 'Tianjin', ja: '天津', ko: '톈진' }, lat: 39.0842, lng: 117.2009, tz: 8, region: 'china' },
  { id: 'suzhou', name: { zh: '苏州', en: 'Suzhou', id: 'Suzhou', th: 'ซูโจว', vi: 'Tô Châu', ms: 'Suzhou', ja: '蘇州', ko: '쑤저우' }, lat: 31.2989, lng: 120.5853, tz: 8, region: 'china' },
  { id: 'qingdao', name: { zh: '青岛', en: 'Qingdao', id: 'Qingdao', th: 'ชิงเต่า', vi: 'Thanh Đảo', ms: 'Qingdao', ja: '青島', ko: '칭다오' }, lat: 36.0671, lng: 120.3826, tz: 8, region: 'china' },
  { id: 'harbin', name: { zh: '哈尔滨', en: 'Harbin', id: 'Harbin', th: 'ฮาร์บิน', vi: 'Cáp Nhĩ Tân', ms: 'Harbin', ja: '哈爾浜', ko: '하얼빈' }, lat: 45.8038, lng: 126.5350, tz: 8, region: 'china' },
  { id: 'kunming', name: { zh: '昆明', en: 'Kunming', id: 'Kunming', th: 'คุนหมิง', vi: 'Côn Minh', ms: 'Kunming', ja: '昆明', ko: '쿤밍' }, lat: 25.0360, lng: 102.7146, tz: 8, region: 'china' },
  
  // Thailand (6 cities)
  { id: 'bangkok', name: { zh: '曼谷', en: 'Bangkok', id: 'Bangkok', th: 'กรุงเทพฯ', vi: 'Bangkok', ms: 'Bangkok', ja: 'バンコク', ko: '방콕' }, lat: 13.7563, lng: 100.5018, tz: 7, region: 'thailand' },
  { id: 'chiangmai', name: { zh: '清迈', en: 'Chiang Mai', id: 'Chiang Mai', th: 'เชียงใหม่', vi: 'Chiang Mai', ms: 'Chiang Mai', ja: 'チェンマイ', ko: '치앙마이' }, lat: 18.7883, lng: 98.9853, tz: 7, region: 'thailand' },
  { id: 'phuket', name: { zh: '普吉岛', en: 'Phuket', id: 'Phuket', th: 'ภูเก็ต', vi: 'Phuket', ms: 'Phuket', ja: 'プーケット', ko: '푸켓' }, lat: 7.8804, lng: 98.3923, tz: 7, region: 'thailand' },
  { id: 'pattaya', name: { zh: '芭堤雅', en: 'Pattaya', id: 'Pattaya', th: 'พัทยา', vi: 'Pattaya', ms: 'Pattaya', ja: 'パタヤ', ko: '파타야' }, lat: 12.9236, lng: 100.8825, tz: 7, region: 'thailand' },
  { id: 'krabi', name: { zh: '甲米', en: 'Krabi', id: 'Krabi', th: 'กระบี่', vi: 'Krabi', ms: 'Krabi', ja: 'クラビ', ko: '끄라비' }, lat: 8.0863, lng: 98.9063, tz: 7, region: 'thailand' },
  { id: 'hatyai', name: { zh: '合艾', en: 'Hat Yai', id: 'Hat Yai', th: 'หาดใหญ่', vi: 'Hat Yai', ms: 'Hat Yai', ja: 'ハジャイ', ko: '하따이' }, lat: 7.0086, lng: 100.4747, tz: 7, region: 'thailand' },
  
  // Vietnam (5 cities)
  { id: 'hochiminh', name: { zh: '胡志明市', en: 'Ho Chi Minh City', id: 'Ho Chi Minh City', th: 'โฮจิมินห์ซิตี้', vi: 'TP. Hồ Chí Minh', ms: 'Ho Chi Minh City', ja: 'ホーチミン市', ko: '호찌민시' }, lat: 10.8231, lng: 106.6297, tz: 7, region: 'vietnam' },
  { id: 'hanoi', name: { zh: '河内', en: 'Hanoi', id: 'Hanoi', th: 'ฮานอย', vi: 'Hà Nội', ms: 'Hanoi', ja: 'ハノイ', ko: '하노이' }, lat: 21.0278, lng: 105.8342, tz: 7, region: 'vietnam' },
  { id: 'danang', name: { zh: '岘港', en: 'Da Nang', id: 'Da Nang', th: 'ดานัง', vi: 'Đà Nẵng', ms: 'Da Nang', ja: 'ダナン', ko: '다낭' }, lat: 16.0544, lng: 108.2022, tz: 7, region: 'vietnam' },
  { id: 'nhatrang', name: { zh: '芽庄', en: 'Nha Trang', id: 'Nha Trang', th: 'ญาจาง', vi: 'Nha Trang', ms: 'Nha Trang', ja: 'ニャチャン', ko: '냐짱' }, lat: 12.2388, lng: 109.1967, tz: 7, region: 'vietnam' },
  { id: 'haiphong', name: { zh: '海防', en: 'Haiphong', id: 'Haiphong', th: 'ไฮฟอง', vi: 'Hải Phòng', ms: 'Haiphong', ja: 'ハイフォン', ko: '하이퐁' }, lat: 20.8449, lng: 106.6881, tz: 7, region: 'vietnam' },
  
  // Malaysia (6 cities)
  { id: 'kualalumpur', name: { zh: '吉隆坡', en: 'Kuala Lumpur', id: 'Kuala Lumpur', th: 'กัวลาลัมเปอร์', vi: 'Kuala Lumpur', ms: 'Kuala Lumpur', ja: 'クアラルンプール', ko: '쿠알라룸푸르' }, lat: 3.1390, lng: 101.6869, tz: 8, region: 'malaysia' },
  { id: 'georgetown', name: { zh: '槟城', en: 'George Town', id: 'George Town', th: 'จอร์จทาวน์', vi: 'George Town', ms: 'George Town', ja: 'ジョージタウン', ko: '조지타운' }, lat: 5.4141, lng: 100.3288, tz: 8, region: 'malaysia' },
  { id: 'johorbahru', name: { zh: '新山', en: 'Johor Bahru', id: 'Johor Bahru', th: 'โจฮอร์บาห์รู', vi: 'Johor Bahru', ms: 'Johor Bahru', ja: 'ジョホールバル', ko: '조호률바루' }, lat: 1.4927, lng: 103.7414, tz: 8, region: 'malaysia' },
  { id: 'kotakinabalu', name: { zh: '亚庇', en: 'Kota Kinabalu', id: 'Kota Kinabalu', th: 'โกตาคินาบาลู', vi: 'Kota Kinabalu', ms: 'Kota Kinabalu', ja: 'コタキナバル', ko: '코타키나발루' }, lat: 5.9804, lng: 116.0735, tz: 8, region: 'malaysia' },
  { id: 'malacca', name: { zh: '马六甲', en: 'Malacca', id: 'Malaka', th: 'มะละกา', vi: 'Malacca', ms: 'Melaka', ja: 'マラッカ', ko: '말라카' }, lat: 2.2008, lng: 102.2437, tz: 8, region: 'malaysia' },
  { id: 'ipoh', name: { zh: '怡保', en: 'Ipoh', id: 'Ipoh', th: 'อีโปห์', vi: 'Ipoh', ms: 'Ipoh', ja: 'イポー', ko: '이포' }, lat: 4.5975, lng: 101.0901, tz: 8, region: 'malaysia' },
  
  // Singapore
  { id: 'singapore', name: { zh: '新加坡', en: 'Singapore', id: 'Singapura', th: 'สิงคโปร์', vi: 'Singapore', ms: 'Singapura', ja: 'シンガポール', ko: '싱가포르' }, lat: 1.3521, lng: 103.8198, tz: 8, region: 'singapore' },
  
  // Japan
  { id: 'tokyo', name: { zh: '东京', en: 'Tokyo', id: 'Tokyo', th: 'โตเกียว', vi: 'Tokyo', ms: 'Tokyo', ja: '東京', ko: '도쿄' }, lat: 35.6762, lng: 139.6503, tz: 9, region: 'japan' },
  { id: 'osaka', name: { zh: '大阪', en: 'Osaka', id: 'Osaka', th: 'โอซาก้า', vi: 'Osaka', ms: 'Osaka', ja: '大阪', ko: '오사카' }, lat: 34.6937, lng: 135.5023, tz: 9, region: 'japan' },
  { id: 'kyoto', name: { zh: '京都', en: 'Kyoto', id: 'Kyoto', th: 'เกียวโต', vi: 'Kyoto', ms: 'Kyoto', ja: '京都', ko: '교토' }, lat: 35.0116, lng: 135.7681, tz: 9, region: 'japan' },
  { id: 'yokohama', name: { zh: '横滨', en: 'Yokohama', id: 'Yokohama', th: 'โยโกฮาม่า', vi: 'Yokohama', ms: 'Yokohama', ja: '横浜', ko: '요코하마' }, lat: 35.4437, lng: 139.6380, tz: 9, region: 'japan' },
  { id: 'sapporo', name: { zh: '札幌', en: 'Sapporo', id: 'Sapporo', th: 'ซัปโปโร', vi: 'Sapporo', ms: 'Sapporo', ja: '札幌', ko: '삿포로' }, lat: 43.0618, lng: 141.3545, tz: 9, region: 'japan' },
  { id: 'fukuoka', name: { zh: '福冈', en: 'Fukuoka', id: 'Fukuoka', th: 'ฟูกูโอกะ', vi: 'Fukuoka', ms: 'Fukuoka', ja: '福岡', ko: '후쿠오카' }, lat: 33.5902, lng: 130.4017, tz: 9, region: 'japan' },
  
  // South Korea
  { id: 'seoul', name: { zh: '首尔', en: 'Seoul', id: 'Seoul', th: 'โซล', vi: 'Seoul', ms: 'Seoul', ja: 'ソウル', ko: '서울' }, lat: 37.5665, lng: 126.9780, tz: 9, region: 'korea' },
  { id: 'busan', name: { zh: '釜山', en: 'Busan', id: 'Busan', th: 'ปูซาน', vi: 'Busan', ms: 'Busan', ja: '釜山', ko: '부산' }, lat: 35.1796, lng: 129.0756, tz: 9, region: 'korea' },
  { id: 'incheon', name: { zh: '仁川', en: 'Incheon', id: 'Incheon', th: 'อินชอน', vi: 'Incheon', ms: 'Incheon', ja: '仁川', ko: '인천' }, lat: 37.4563, lng: 126.7052, tz: 9, region: 'korea' },
  { id: 'daegu', name: { zh: '大邱', en: 'Daegu', id: 'Daegu', th: 'แทกู', vi: 'Daegu', ms: 'Daegu', ja: '大邱', ko: '대구' }, lat: 35.8714, lng: 128.6014, tz: 9, region: 'korea' },
  
  // USA
  { id: 'newyork', name: { zh: '纽约', en: 'New York', id: 'New York', th: 'นิวยอร์ก', vi: 'New York', ms: 'New York', ja: 'ニューヨーク', ko: '뉴욕' }, lat: 40.7128, lng: -74.006, tz: -5, region: 'usa' },
  { id: 'losangeles', name: { zh: '洛杉矶', en: 'Los Angeles', id: 'Los Angeles', th: 'ลอสแองเจลิส', vi: 'Los Angeles', ms: 'Los Angeles', ja: 'ロサンゼルス', ko: '로스앤젤레스' }, lat: 34.0522, lng: -118.2437, tz: -8, region: 'usa' },
  { id: 'chicago', name: { zh: '芝加哥', en: 'Chicago', id: 'Chicago', th: 'ชิคาโก', vi: 'Chicago', ms: 'Chicago', ja: 'シカゴ', ko: '시카고' }, lat: 41.8781, lng: -87.6298, tz: -6, region: 'usa' },
  { id: 'houston', name: { zh: '休斯顿', en: 'Houston', id: 'Houston', th: 'ฮูสตัน', vi: 'Houston', ms: 'Houston', ja: 'ヒューストン', ko: '휴스턴' }, lat: 29.7604, lng: -95.3698, tz: -6, region: 'usa' },
  { id: 'sanfrancisco', name: { zh: '旧金山', en: 'San Francisco', id: 'San Francisco', th: 'ซานฟรานซิสโก', vi: 'San Francisco', ms: 'San Francisco', ja: 'サンフランシスコ', ko: '샌프란시스코' }, lat: 37.7749, lng: -122.4194, tz: -8, region: 'usa' },
  { id: 'miami', name: { zh: '迈阿密', en: 'Miami', id: 'Miami', th: 'ไมอามี่', vi: 'Miami', ms: 'Miami', ja: 'マイアミ', ko: '마이애미' }, lat: 25.7617, lng: -80.1918, tz: -5, region: 'usa' },
  
  // Europe
  { id: 'london', name: { zh: '伦敦', en: 'London', id: 'London', th: 'ลอนดอน', vi: 'London', ms: 'London', ja: 'ロンドン', ko: '런던' }, lat: 51.5074, lng: -0.1278, tz: 0, region: 'europe' },
  { id: 'paris', name: { zh: '巴黎', en: 'Paris', id: 'Paris', th: 'ปารีส', vi: 'Paris', ms: 'Paris', ja: 'パリ', ko: '파리' }, lat: 48.8566, lng: 2.3522, tz: 1, region: 'europe' },
  { id: 'berlin', name: { zh: '柏林', en: 'Berlin', id: 'Berlin', th: 'เบอร์ลิน', vi: 'Berlin', ms: 'Berlin', ja: 'ベルリン', ko: '베를린' }, lat: 52.5200, lng: 13.4050, tz: 1, region: 'europe' },
  { id: 'madrid', name: { zh: '马德里', en: 'Madrid', id: 'Madrid', th: 'มาดริด', vi: 'Madrid', ms: 'Madrid', ja: 'マドリード', ko: '마드리드' }, lat: 40.4168, lng: -3.7038, tz: 1, region: 'europe' },
  { id: 'rome', name: { zh: '罗马', en: 'Rome', id: 'Rome', th: 'โรม', vi: 'Rome', ms: 'Rome', ja: 'ローマ', ko: '로마' }, lat: 41.9028, lng: 12.4964, tz: 1, region: 'europe' },
  { id: 'amsterdam', name: { zh: '阿姆斯特丹', en: 'Amsterdam', id: 'Amsterdam', th: 'อัมสเตอร์ดัม', vi: 'Amsterdam', ms: 'Amsterdam', ja: 'アムステルダム', ko: '암스테르담' }, lat: 52.3676, lng: 4.9041, tz: 1, region: 'europe' },
  
  // Australia
  { id: 'sydney', name: { zh: '悉尼', en: 'Sydney', id: 'Sydney', th: 'ซิดนีย์', vi: 'Sydney', ms: 'Sydney', ja: 'シドニー', ko: '시드니' }, lat: -33.8688, lng: 151.2093, tz: 10, region: 'australia' },
  { id: 'melbourne', name: { zh: '墨尔本', en: 'Melbourne', id: 'Melbourne', th: 'เมลเบิร์น', vi: 'Melbourne', ms: 'Melbourne', ja: 'メルボルン', ko: '멜버른' }, lat: -37.8136, lng: 144.9631, tz: 10, region: 'australia' },
  { id: 'brisbane', name: { zh: '布里斯班', en: 'Brisbane', id: 'Brisbane', th: 'บริสเบน', vi: 'Brisbane', ms: 'Brisbane', ja: 'ブリスベン', ko: '브리즈번' }, lat: -27.4698, lng: 153.0251, tz: 10, region: 'australia' },
  { id: 'perth', name: { zh: '珀斯', en: 'Perth', id: 'Perth', th: 'เพิร์ท', vi: 'Perth', ms: 'Perth', ja: 'パース', ko: '퍼스' }, lat: -31.9505, lng: 115.8605, tz: 8, region: 'australia' },
  
  // Middle East
  { id: 'dubai', name: { zh: '迪拜', en: 'Dubai', id: 'Dubai', th: 'ดูไบ', vi: 'Dubai', ms: 'Dubai', ja: 'ドバイ', ko: '두바이' }, lat: 25.2048, lng: 55.2708, tz: 4, region: 'middleeast' },
  { id: 'abudhabi', name: { zh: '阿布扎比', en: 'Abu Dhabi', id: 'Abu Dhabi', th: 'อาบูดาบี', vi: 'Abu Dhabi', ms: 'Abu Dhabi', ja: 'アブダビ', ko: '아부다비' }, lat: 24.4539, lng: 54.3773, tz: 4, region: 'middleeast' },
  
  // India
  { id: 'mumbai', name: { zh: '孟买', en: 'Mumbai', id: 'Mumbai', th: 'มุมไบ', vi: 'Mumbai', ms: 'Mumbai', ja: 'ムンバイ', ko: '뭄바이' }, lat: 19.0760, lng: 72.8777, tz: 5.5, region: 'india' },
  { id: 'delhi', name: { zh: '新德里', en: 'New Delhi', id: 'New Delhi', th: 'นิวเดลี', vi: 'New Delhi', ms: 'New Delhi', ja: 'ニューデリー', ko: '뉴델리' }, lat: 28.6139, lng: 77.2090, tz: 5.5, region: 'india' },
  { id: 'bangalore', name: { zh: '班加罗尔', en: 'Bangalore', id: 'Bangalore', th: 'บังกาลอร์', vi: 'Bangalore', ms: 'Bangalore', ja: 'バンガロール', ko: '방갈로르' }, lat: 12.9716, lng: 77.5946, tz: 5.5, region: 'india' },
  { id: 'chennai', name: { zh: '金奈', en: 'Chennai', id: 'Chennai', th: 'เชนไน', vi: 'Chennai', ms: 'Chennai', ja: 'チェンナイ', ko: '첸나이' }, lat: 13.0827, lng: 80.2707, tz: 5.5, region: 'india' },
];

// 地区分组标签
const REGION_LABELS: Record<string, Record<string, string>> = {
  indonesia: { zh: '🇮🇩 印度尼西亚', en: '🇮🇩 Indonesia', id: '🇮🇩 Indonesia', th: '🇮🇩 อินโดนีเซีย', vi: '🇮🇩 Indonesia', ms: '🇮🇩 Indonesia', ja: '🇮🇩 インドネシア', ko: '🇮🇩 인도네시아' },
  china: { zh: '🇨🇳 中国', en: '🇨🇳 China', id: '🇨🇳 China', th: '🇨🇳 จีน', vi: '🇨🇳 Trung Quốc', ms: '🇨🇳 China', ja: '🇨🇳 中国', ko: '🇨🇳 중국' },
  thailand: { zh: '🇹🇭 泰国', en: '🇹🇭 Thailand', id: '🇹🇭 Thailand', th: '🇹🇭 ไทย', vi: '🇹🇭 Thái Lan', ms: '🇹🇭 Thailand', ja: '🇹🇭 タイ', ko: '🇹🇭 태국' },
  vietnam: { zh: '🇻🇳 越南', en: '🇻🇳 Vietnam', id: '🇻🇳 Vietnam', th: '🇻🇳 เวียดนาม', vi: '🇻🇳 Việt Nam', ms: '🇻🇳 Vietnam', ja: '🇻🇳 ベトナム', ko: '🇻🇳 베트남' },
  malaysia: { zh: '🇲🇾 马来西亚', en: '🇲🇾 Malaysia', id: '🇲🇾 Malaysia', th: '🇲🇾 มาเลเซีย', vi: '🇲🇾 Malaysia', ms: '🇲🇾 Malaysia', ja: '🇲🇾 マレーシア', ko: '🇲🇾 말레이시아' },
  singapore: { zh: '🇸🇬 新加坡', en: '🇸🇬 Singapore', id: '🇸🇬 Singapura', th: '🇸🇬 สิงคโปร์', vi: '🇸🇬 Singapore', ms: '🇸🇬 Singapura', ja: '🇸🇬 シンガポール', ko: '🇸🇬 싱가포르' },
  japan: { zh: '🇯🇵 日本', en: '🇯🇵 Japan', id: '🇯🇵 Jepang', th: '🇯🇵 ญี่ปุ่น', vi: '🇯🇵 Nhật Bản', ms: '🇯🇵 Jepun', ja: '🇯🇵 日本', ko: '🇯🇵 일본' },
  korea: { zh: '🇰🇷 韩国', en: '🇰🇷 South Korea', id: '🇰🇷 Korea Selatan', th: '🇰🇷 เกาหลีใต้', vi: '🇰🇷 Hàn Quốc', ms: '🇰🇷 Korea Selatan', ja: '🇰🇷 韓国', ko: '🇰🇷 한국' },
  usa: { zh: '🇺🇸 美国', en: '🇺🇸 USA', id: '🇺🇸 Amerika Serikat', th: '🇺🇸 สหรัฐอเมริกา', vi: '🇺🇸 Mỹ', ms: '🇺🇸 Amerika Syarikat', ja: '🇺🇸 アメリカ', ko: '🇺🇸 미국' },
  europe: { zh: '🇪🇺 欧洲', en: '🇪🇺 Europe', id: '🇪🇺 Eropa', th: '🇪🇺 ยุโรป', vi: '🇪🇺 Châu Âu', ms: '🇪🇺 Eropah', ja: '🇪🇺 ヨーロッパ', ko: '🇪🇺 유럽' },
  australia: { zh: '🇦🇺 澳大利亚', en: '🇦🇺 Australia', id: '🇦🇺 Australia', th: '🇦🇺 ออสเตรเลีย', vi: '🇦🇺 Úc', ms: '🇦🇺 Australia', ja: '🇦🇺 オーストラリア', ko: '🇦🇺 호주' },
  middleeast: { zh: '🕌 中东', en: '🕌 Middle East', id: '🕌 Timur Tengah', th: '🕌 ตะวันออกกลาง', vi: '🕌 Trung Đông', ms: '🕌 Timur Tengah', ja: '🕌 中東', ko: '🕌 중동' },
  india: { zh: '🇮🇳 印度', en: '🇮🇳 India', id: '🇮🇳 India', th: '🇮🇳 อินเดีย', vi: '🇮🇳 Ấn Độ', ms: '🇮🇳 India', ja: '🇮🇳 インド', ko: '🇮🇳 인도' },
};

// 更多分宫制：E=等宫, W=整宫, P=Placidus, K=Koch(阿卡比特), R=Regiomontanus, C=Campanus
const HOUSE_SYSTEMS = [
  { id: 'E', name: { zh: '等宫制', en: 'Equal House', id: 'Equal House' }, abbr: 'E' },
  { id: 'W', name: { zh: '整宫制', en: 'Whole Sign', id: 'Whole Sign' }, abbr: 'W' },
  { id: 'P', name: { zh: 'Placidus', en: 'Placidus', id: 'Placidus' }, abbr: 'Pl' },
  { id: 'K', name: { zh: 'Koch (阿卡比特)', en: 'Koch', id: 'Koch' }, abbr: 'K' },
  { id: 'R', name: { zh: 'Regiomontanus', en: 'Regiomontanus', id: 'Regiomontanus' }, abbr: 'R' },
  { id: 'C', name: { zh: 'Campanus', en: 'Campanus', id: 'Campanus' }, abbr: 'C' },
];

const ASPECT_COLORS: Record<string, string> = {
  Conjunction: '#FFD700', Sextile: '#4CAF50', Square: '#F44336', Trine: '#2196F3', Opposition: '#9C27B0',
};

const ASPECT_NAMES: Record<string, { zh: string, en: string, id: string }> = {
  Conjunction: { zh: '合', en: 'Conj', id: 'Konj' },
  Sextile: { zh: '六', en: 'Sext', id: 'Sext' },
  Square: { zh: '四', en: 'Sq', id: 'Kotak' },
  Trine: { zh: '三', en: 'Trine', id: 'Trine' },
  Opposition: { zh: '冲', en: 'Opp', id: 'Oposisi' },
};

// AI Reading Data (三语言)
const AI_READINGS = {
  Sun: {
    zh: {
      Aries: { summary: "天生的领导者，充满活力和开拓精神。", traits: ["领导力强", "行动果断", "独立自主"], advice: "学会耐心，避免冲动。" },
      Taurus: { summary: "追求稳定和物质安全，意志坚定。", traits: ["务实稳重", "有艺术天赋", "忠诚可靠"], advice: "保持开放心态，拥抱变化。" },
      Gemini: { summary: "思维敏捷，善于沟通和学习。", traits: ["思维敏捷", "善于沟通", "好奇心强"], advice: "培养专注力，深入某个领域。" },
      Cancer: { summary: "情感丰富，重视家庭和情感联系。", traits: ["情感细腻", "直觉力强", "保护欲强"], advice: "建立健康边界，放下过去。" },
      Leo: { summary: "天生具有王者气质，慷慨大方。", traits: ["自信慷慨", "创造力强", "领导魅力"], advice: "保持谦逊，分享舞台。" },
      Virgo: { summary: "注重细节，追求完美。", traits: ["注重细节", "分析能力强", "务实可靠"], advice: "接受不完美，善待自己。" },
      Libra: { summary: "追求和谐与美感，善于社交。", traits: ["追求和谐", "审美能力强", "善于合作"], advice: "学会独自决策，坚持立场。" },
      Scorpio: { summary: "有深刻的情感和强大的意志力。", traits: ["意志坚定", "洞察力强", "神秘魅力"], advice: "学会信任，放下控制。" },
      Sagittarius: { summary: "热爱自由和探索，乐观向上。", traits: ["乐观向上", "求知欲强", "慷慨大方"], advice: "培养耐心，履行承诺。" },
      Capricorn: { summary: "雄心勃勃，有强烈的责任感。", traits: ["雄心壮志", "责任感强", "自律性高"], advice: "学会放松，享受当下。" },
      Aquarius: { summary: "独立创新，关注人类福祉。", traits: ["独立创新", "博爱精神", "思想前卫"], advice: "保持情感连接，不要过度理性。" },
      Pisces: { summary: "敏感富有同情心，有艺术天赋。", traits: ["敏感多情", "艺术天赋", "同理心强"], advice: "建立健康边界，表达创意。" },
    },
    en: {
      Aries: { summary: "A natural leader, full of vitality and pioneering spirit.", traits: ["Strong leadership", "Decisive action", "Independent"], advice: "Learn patience, avoid impulsiveness." },
      Taurus: { summary: "Seeks stability and material security, strong-willed.", traits: ["Practical", "Artistic talent", "Loyal and reliable"], advice: "Stay open-minded, embrace change." },
      Gemini: { summary: "Quick-thinking, skilled at communication and learning.", traits: ["Quick-thinking", "Communicative", "Curious"], advice: "Develop focus, go deep in one area." },
      Cancer: { summary: "Emotionally rich, values family and emotional connections.", traits: ["Emotionally sensitive", "Strong intuition", "Protective"], advice: "Set healthy boundaries, let go of the past." },
      Leo: { summary: "Naturally regal, generous and charismatic.", traits: ["Confident and generous", "Creative", "Leadership charisma"], advice: "Stay humble, share the spotlight." },
      Virgo: { summary: "Detail-oriented, pursues perfection.", traits: ["Detail-oriented", "Strong analytical skills", "Practical"], advice: "Accept imperfection, be kind to yourself." },
      Libra: { summary: "Seeks harmony and beauty, socially skilled.", traits: ["Seeks harmony", "Strong aesthetic sense", "Cooperative"], advice: "Learn to decide alone, hold your ground." },
      Scorpio: { summary: "Deep emotions and powerful willpower.", traits: ["Strong-willed", "Perceptive", "Mysterious charm"], advice: "Learn to trust, let go of control." },
      Sagittarius: { summary: "Loves freedom and exploration, optimistic.", traits: ["Optimistic", "Curious", "Generous"], advice: "Cultivate patience, keep commitments." },
      Capricorn: { summary: "Ambitious with a strong sense of responsibility.", traits: ["Ambitious", "Responsible", "Self-disciplined"], advice: "Learn to relax, enjoy the present." },
      Aquarius: { summary: "Independent and innovative, cares about humanity.", traits: ["Independent", "Humanitarian", "Forward-thinking"], advice: "Maintain emotional connections, don't over-rationalize." },
      Pisces: { summary: "Sensitive and compassionate, artistically gifted.", traits: ["Sensitive", "Artistic talent", "Empathetic"], advice: "Set healthy boundaries, express creativity." },
    },
    id: {
      Aries: { summary: "Pemimpin alami, penuh vitalitas dan semangat pelopor.", traits: ["Kepemimpinan kuat", "Tindakan tegas", "Mandiri"], advice: "Belajar sabar, hindari impulsif." },
      Taurus: { summary: "Mencari stabilitas dan keamanan materi, berkemauan keras.", traits: ["Praktis", "Bakat seni", "Setia dan dapat diandalkan"], advice: "Tetap berpikiran terbuka, terima perubahan." },
      Gemini: { summary: "Berpikir cepat, terampil dalam komunikasi dan belajar.", traits: ["Berpikir cepat", "Komunikatif", "Penasaran"], advice: "Kembangkan fokus, dalami satu bidang." },
      Cancer: { summary: "Kaya emosi, menghargai keluarga dan koneksi emosional.", traits: ["Sensitif secara emosional", "Intuisi kuat", "Protektif"], advice: "Tetapkan batasan sehat, lepaskan masa lalu." },
      Leo: { summary: "Secara alami berwibawa, murah hati dan karismatik.", traits: ["Percaya diri dan murah hati", "Kreatif", "Karisma kepemimpinan"], advice: "Tetap rendah hati, berbagi panggung." },
      Virgo: { summary: "Berorientasi detail, mengejar kesempurnaan.", traits: ["Berorientasi detail", "Analitis kuat", "Praktis"], advice: "Terima ketidaksempurnaan, baik pada diri sendiri." },
      Libra: { summary: "Mencari harmoni dan keindahan, terampil secara sosial.", traits: ["Mencari harmoni", "Estetika kuat", "Kooperatif"], advice: "Belajar memutuskan sendiri, pegang pendirian." },
      Scorpio: { summary: "Emosi mendalam dan kemauan yang kuat.", traits: ["Berkemauan keras", "Perseptif", "Pesona misterius"], advice: "Belajar percaya, lepaskan kontrol." },
      Sagittarius: { summary: "Mencintai kebebasan dan eksplorasi, optimis.", traits: ["Optimis", "Penasaran", "Murah hati"], advice: "Kembangkan kesabaran, tepati janji." },
      Capricorn: { summary: "Ambisius dengan rasa tanggung jawab yang kuat.", traits: ["Ambisius", "Bertanggung jawab", "Disiplin diri"], advice: "Belajar bersantai, nikmati saat ini." },
      Aquarius: { summary: "Mandiri dan inovatif, peduli pada kemanusiaan.", traits: ["Mandiri", "Humanis", "Berpikiran maju"], advice: "Pertahankan koneksi emosional, jangan terlalu rasional." },
      Pisces: { summary: "Sensitif dan penuh kasih, berbakat seni.", traits: ["Sensitif", "Bakat seni", "Empatik"], advice: "Tetapkan batasan sehat, ekspresikan kreativitas." },
    },
  },
  Moon: {
    zh: {
      Aries: { summary: "情感表达直接热烈。", traits: ["情感直接", "独立性强", "情绪波动快"], advice: "学会情感耐心，不要急于反应。" },
      Taurus: { summary: "需要安全和稳定来感到满足。", traits: ["需要安全", "感官敏锐", "情感稳定"], advice: "不要过度依赖物质安全感。" },
      Gemini: { summary: "情绪与思维紧密相连。", traits: ["情感多变", "善于表达", "好奇心强"], advice: "深入探索情感，不要只是分析。" },
      Cancer: { summary: "极其重视家庭和情感。", traits: ["情感深刻", "直觉力强", "保护欲强"], advice: "学会放下过去，建立边界。" },
      Leo: { summary: "需要被欣赏来感到满足。", traits: ["需要关注", "情感慷慨", "创造力强"], advice: "学会自我认可，不完全依赖外界。" },
      Virgo: { summary: "需要感到有用和有秩序。", traits: ["情感内敛", "关怀体贴", "注重细节"], advice: "对自己温柔，学会自我接纳。" },
      Libra: { summary: "需要和谐的关系。", traits: ["追求和谐", "需要伴侣", "审美敏感"], advice: "学会面对冲突，不要过度妥协。" },
      Scorpio: { summary: "有深刻的情感需求。", traits: ["情感深刻", "直觉敏锐", "忠诚专一"], advice: "学会信任和放手。" },
      Sagittarius: { summary: "需要自由和冒险。", traits: ["情感乐观", "热爱自由", "哲学倾向"], advice: "培养情感深度，面对真实情感。" },
      Capricorn: { summary: "需要成就来感到安全。", traits: ["情感内敛", "责任感强", "情感稳定"], advice: "允许自己脆弱，情感是力量。" },
      Aquarius: { summary: "需要个人空间和智力交流。", traits: ["情感独立", "理性处理", "需要空间"], advice: "不要过度理性化情感。" },
      Pisces: { summary: "极度敏感，容易吸收他人情绪。", traits: ["极度敏感", "同理心强", "艺术天赋"], advice: "建立情感边界，保护自己。" },
    },
    en: {
      Aries: { summary: "Direct and passionate emotional expression.", traits: ["Direct emotions", "Strong independence", "Quick mood changes"], advice: "Learn emotional patience." },
      Taurus: { summary: "Needs security and stability to feel satisfied.", traits: ["Needs security", "Sensory awareness", "Emotionally stable"], advice: "Don't over-rely on material security." },
      Gemini: { summary: "Emotions closely tied to thinking.", traits: ["Variable emotions", "Expressive", "Curious"], advice: "Explore emotions deeply." },
      Cancer: { summary: "Highly values family and emotions.", traits: ["Deep emotions", "Strong intuition", "Protective"], advice: "Set boundaries, let go of past." },
      Leo: { summary: "Needs appreciation to feel satisfied.", traits: ["Needs attention", "Emotionally generous", "Creative"], advice: "Learn self-validation." },
      Virgo: { summary: "Needs to feel useful and orderly.", traits: ["Reserved emotions", "Caring", "Detail-oriented"], advice: "Be gentle with yourself." },
      Libra: { summary: "Needs harmonious relationships.", traits: ["Seeks harmony", "Needs partnership", "Aesthetically sensitive"], advice: "Face conflict." },
      Scorpio: { summary: "Has deep emotional needs.", traits: ["Deep emotions", "Sharp intuition", "Loyal"], advice: "Learn to trust." },
      Sagittarius: { summary: "Needs freedom and adventure.", traits: ["Emotionally optimistic", "Loves freedom", "Philosophical"], advice: "Develop emotional depth." },
      Capricorn: { summary: "Needs achievement to feel secure.", traits: ["Reserved emotions", "Responsible", "Emotionally stable"], advice: "Allow vulnerability." },
      Aquarius: { summary: "Needs space and intellectual exchange.", traits: ["Emotionally independent", "Rational", "Needs space"], advice: "Don't over-rationalize." },
      Pisces: { summary: "Extremely sensitive to others' emotions.", traits: ["Extremely sensitive", "Empathetic", "Artistic"], advice: "Set emotional boundaries." },
    },
    id: {
      Aries: { summary: "Ekspresi emosi langsung dan penuh semangat.", traits: ["Emosi langsung", "Kemandirian kuat", "Suasana hati cepat berubah"], advice: "Belajar kesabaran emosional." },
      Taurus: { summary: "Butuh keamanan dan stabilitas untuk merasa puas.", traits: ["Butuh keamanan", "Kesadaran sensorik", "Stabil secara emosional"], advice: "Jangan terlalu bergantung pada keamanan materi." },
      Gemini: { summary: "Emosi terkait erat dengan pemikiran.", traits: ["Emosi bervariasi", "Ekspresif", "Penasaran"], advice: "Jelajahi emosi secara mendalam." },
      Cancer: { summary: "Sangat menghargai keluarga dan emosi.", traits: ["Emosi mendalam", "Intuisi kuat", "Protektif"], advice: "Tetapkan batasan." },
      Leo: { summary: "Butuh apresiasi untuk merasa puas.", traits: ["Butuh perhatian", "Murah hati secara emosional", "Kreatif"], advice: "Belajar validasi diri." },
      Virgo: { summary: "Butuh merasa berguna dan teratur.", traits: ["Emosi tertahan", "Peduli", "Berorientasi detail"], advice: "Bersikap lembut pada diri sendiri." },
      Libra: { summary: "Butuh hubungan harmonis.", traits: ["Mencari harmoni", "Butuh kemitraan", "Sensitif estetika"], advice: "Hadapi konflik." },
      Scorpio: { summary: "Memiliki kebutuhan emosional yang mendalam.", traits: ["Emosi mendalam", "Intuisi tajam", "Setia"], advice: "Belajar percaya." },
      Sagittarius: { summary: "Butuh kebebasan dan petualangan.", traits: ["Optimis secara emosional", "Mencintai kebebasan", "Filosofis"], advice: "Kembangkan kedalaman emosional." },
      Capricorn: { summary: "Butuh pencapaian untuk merasa aman.", traits: ["Emosi tertahan", "Bertanggung jawab", "Stabil secara emosional"], advice: "Izinkan kerentanan." },
      Aquarius: { summary: "Butuh ruang dan pertukaran intelektual.", traits: ["Mandiri secara emosional", "Rasional", "Butuh ruang"], advice: "Jangan terlalu merasionalisasi." },
      Pisces: { summary: "Sangat sensitif terhadap emosi orang lain.", traits: ["Sangat sensitif", "Empatik", "Artistik"], advice: "Tetapkan batasan emosional." },
    },
  },
};

function tx(key: string, lang: 'zh' | 'en' | 'id'): string {
  return (T[lang] as Record<string, string>)?.[key] || (T.zh as Record<string, string>)?.[key] || key;
}

// Custom Select Component
function CustomSelect({ value, onChange, options, label }: {
  value: string; onChange: (v: string) => void; options: { id: string; name: string }[]; label?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const selected = options.find(o => o.id === value);

  return (
    <div className="relative" ref={ref}>
      {label && <label className="block text-xs text-slate-400 mb-1">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-left flex items-center justify-between hover:bg-slate-800 transition-colors"
      >
        <span className="text-white text-sm">{selected?.name || 'Select...'}</span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 py-1 rounded-xl bg-slate-800 border border-slate-700 z-50 max-h-60 overflow-y-auto">
          {options.map(opt => (
            <button
              key={opt.id}
              onClick={() => { onChange(opt.id); setOpen(false); }}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-700 ${value === opt.id ? 'text-purple-400' : 'text-slate-300'}`}
            >
              {opt.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// 增强版城市选择器 - 支持搜索和分组
function CitySelect({ value, onChange, cities, lang, label }: {
  value: string; onChange: (v: string) => void; cities: typeof CITIES; lang: string; label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  // 按地区分组城市
  const groupedCities = useMemo(() => {
    const groups: Record<string, typeof CITIES> = {};
    cities.forEach(city => {
      const region = city.region || 'other';
      if (!groups[region]) groups[region] = [];
      groups[region].push(city);
    });
    return groups;
  }, [cities]);

  // 搜索过滤
  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groupedCities;
    const filtered: Record<string, typeof CITIES> = {};
    Object.entries(groupedCities).forEach(([region, regionCities]) => {
      const matched = regionCities.filter(c => 
        c.name[lang]?.toLowerCase().includes(search.toLowerCase()) ||
        c.name.en?.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase())
      );
      if (matched.length) filtered[region] = matched;
    });
    return filtered;
  }, [groupedCities, search, lang]);

  const selected = cities.find(c => c.id === value);

  // 地区排序优先级
  const regionOrder = ['indonesia', 'china', 'thailand', 'vietnam', 'malaysia', 'singapore', 'japan', 'korea', 'usa', 'europe', 'australia', 'middleeast', 'india', 'other'];
  const sortedRegions = Object.keys(filteredGroups).sort((a, b) => {
    const idxA = regionOrder.indexOf(a);
    const idxB = regionOrder.indexOf(b);
    if (idxA === -1 && idxB === -1) return a.localeCompare(b);
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  return (
    <div className="relative" ref={ref}>
      {label && <label className="block text-xs text-slate-400 mb-1">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-left flex items-center justify-between hover:bg-slate-800 transition-colors"
      >
        <span className="text-white text-sm">{selected?.name?.[lang] || selected?.name?.zh || 'Select city...'}</span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-slate-800 border border-slate-700 z-50 max-h-80 overflow-hidden flex flex-col">
          {/* 搜索框 */}
          <div className="p-2 border-b border-slate-700">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city..."
                className="w-full p-2 pl-8 rounded-lg bg-slate-900 border border-slate-600 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500"
                onClick={(e) => e.stopPropagation()}
              />
              <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* 城市列表 */}
          <div className="overflow-y-auto flex-1">
            {sortedRegions.map(region => (
              <div key={region}>
                <div className="px-3 py-1.5 bg-slate-900/50 text-xs font-medium text-slate-400 sticky top-0">
                  {REGION_LABELS[region]?.[lang] || REGION_LABELS[region]?.en || region}
                </div>
                {filteredGroups[region].map(city => (
                  <button
                    key={city.id}
                    onClick={() => { onChange(city.id); setOpen(false); setSearch(''); }}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-700 flex items-center justify-between ${value === city.id ? 'text-purple-400 bg-purple-500/10' : 'text-slate-300'}`}
                  >
                    <span>{city.name[lang] || city.name.zh}</span>
                    {value === city.id && <Check size={14} />}
                  </button>
                ))}
              </div>
            ))}
            {sortedRegions.length === 0 && (
              <div className="px-3 py-4 text-center text-slate-500 text-sm">No cities found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Nominatim 地图搜索组件（OpenStreetMap，免费无需 API Key）
function LocationSearch({ onSelect, lang, label }: {
  onSelect: (result: { name: string; lat: number; lng: number; tz: number }) => void;
  lang: string;
  label?: string;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const searchLocation = async (q: string) => {
    if (!q.trim() || q.length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      // 使用 Nominatim OpenStreetMap API（免费）
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=8&addressdetails=1&accept-language=${lang === 'zh' ? 'zh-CN' : lang === 'id' ? 'id' : 'en'}`;
      const res = await fetch(url, {
        headers: { 'Accept-Language': lang === 'zh' ? 'zh-CN,zh' : lang === 'id' ? 'id,en' : 'en' }
      });
      const data = await res.json();
      setResults(data);
      setOpen(data.length > 0);
    } catch (e) {
      console.error('Nominatim search error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchLocation(val), 500);
  };

  // 根据经度估算时区（粗略）
  const estimateTimezone = (lng: number): number => {
    return Math.round(lng / 15);
  };

  const handleSelect = (item: any) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    const tz = estimateTimezone(lng);
    const name = item.display_name?.split(',').slice(0, 2).join(', ') || item.name || query;
    setSelected(name);
    setQuery(name);
    setOpen(false);
    onSelect({ name, lat, lng, tz });
  };

  const placeholders: Record<string, string> = {
    zh: '搜索城市或地点...',
    en: 'Search city or location...',
    id: 'Cari kota atau lokasi...',
    th: 'ค้นหาเมืองหรือสถานที่...',
    vi: 'Tìm kiếm thành phố...',
    ms: 'Cari bandar atau lokasi...',
    ja: '都市や場所を検索...',
    ko: '도시 또는 위치 검색...',
  };

  return (
    <div className="relative" ref={ref}>
      {label && <label className="block text-xs text-slate-400 mb-1">{label}</label>}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholders[lang] || placeholders.en}
          className="w-full p-3 pl-10 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
        />
        <div className="absolute left-3 top-3.5">
          {loading ? (
            <svg className="w-4 h-4 text-purple-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          )}
        </div>
        {selected && (
          <button
            onClick={() => { setQuery(''); setSelected(''); setResults([]); }}
            className="absolute right-3 top-3.5 text-slate-500 hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-slate-800 border border-slate-700 z-50 max-h-64 overflow-y-auto shadow-xl">
          {results.map((item, i) => {
            const parts = item.display_name?.split(',') || [];
            const mainName = parts[0] || item.name;
            const subName = parts.slice(1, 3).join(',').trim();
            const lat = parseFloat(item.lat).toFixed(2);
            const lng = parseFloat(item.lon).toFixed(2);
            return (
              <button
                key={i}
                onClick={() => handleSelect(item)}
                className="w-full px-3 py-2.5 text-left hover:bg-slate-700 border-b border-slate-700/50 last:border-0 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-medium truncate">{mainName}</div>
                    <div className="text-xs text-slate-400 truncate">{subName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{lat}°, {lng}°</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Natal Chart SVG with Aspect Lines
function NatalChartSVG({ planets, houses, aspects, size = 420 }: { planets: any, houses: any[], aspects: any[], size?: number }) {
  const cx = size / 2, cy = size / 2, r = size * 0.46;
  const degToRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  
  const getPoint = (deg: number, radius: number) => ({
    x: cx + radius * Math.cos(degToRad(deg)),
    y: cy + radius * Math.sin(degToRad(deg)),
  });

  // Get planet positions for aspect lines
  const planetPositions: Record<string, { x: number; y: number }> = {};
  Object.entries(planets).forEach(([key, p]: [string, any]) => {
    if (!p?.error && p?.longitude != null) {
      planetPositions[key] = getPoint(p.longitude, r * 0.62);
    }
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-lg mx-auto">
      <defs>
        <linearGradient id="chartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#db2777" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="softGlow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      
      {/* Background glow */}
      <circle cx={cx} cy={cy} r={r * 1.1} fill="url(#chartGrad)" opacity="0.05" filter="url(#softGlow)" />
      
      {/* Outer ring with gradient */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#chartGrad)" strokeWidth="2" opacity="0.4" />
      <circle cx={cx} cy={cy} r={r * 0.95} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      <circle cx={cx} cy={cy} r={r * 0.85} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" strokeDasharray="4 4" />
      <circle cx={cx} cy={cy} r={r * 0.65} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      
      {/* Aspect Lines - drawn first so they're behind planets */}
      {(aspects || []).slice(0, 15).map((asp: any, i: number) => {
        const p1Pos = planetPositions[asp.planet1];
        const p2Pos = planetPositions[asp.planet2];
        if (!p1Pos || !p2Pos) return null;
        const color = ASPECT_COLORS[asp.aspect || asp.type] || '#888';
        const isMajor = ['Conjunction', 'Square', 'Trine', 'Opposition'].includes(asp.aspect || asp.type);
        return (
          <line key={i} x1={p1Pos.x} y1={p1Pos.y} x2={p2Pos.x} y2={p2Pos.y}
            stroke={color} strokeWidth={isMajor ? 1.5 : 1} opacity={isMajor ? 0.7 : 0.4} />
        );
      })}
      
      {/* Zodiac signs - outer ring */}
      {SIGN_SYMBOLS.map((sym, i) => {
        const angle = i * 30;
        const outerP = getPoint(angle, r * 0.97);
        const signColor = ['fire', 'earth', 'air', 'water'][Math.floor(i / 3) % 4];
        const colors: Record<string, string> = { fire: '#FF6B6B', earth: '#8B7355', air: '#74B9FF', water: '#0984E3' };
        return (
          <g key={i}>
            <circle cx={outerP.x} cy={outerP.y} r="14" fill={`${colors[signColor]}20`} />
            <text x={outerP.x} y={outerP.y + 5} textAnchor="middle" fontSize="14" fill={colors[signColor]}>
              {sym}
            </text>
          </g>
        );
      })}
      
      {/* House lines and labels */}
      {(houses || []).map((h: any, idx: number) => {
        const p1 = getPoint(h.longitude, r * 0.25);
        const p2 = getPoint(h.longitude, r * 0.85);
        const midP = getPoint(h.longitude, r * 0.55);
        const isAngular = [1, 4, 7, 10].includes(h.house);
        return (
          <g key={idx}>
            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke={isAngular ? '#a855f7' : 'rgba(255,255,255,0.15)'} strokeWidth={isAngular ? 1 : 0.5} />
            <circle cx={midP.x} cy={midP.y} r={isAngular ? 10 : 7} fill="#0f0a1e" stroke={isAngular ? '#a855f7' : 'rgba(255,255,255,0.2)'} strokeWidth="1" />
            <text x={midP.x} y={midP.y + 4} textAnchor="middle" fontSize={isAngular ? '10' : '8'} fill={isAngular ? '#a855f7' : 'rgba(255,255,255,0.6)'}>
              {h.house}
            </text>
          </g>
        );
      })}
      
      {/* Center info */}
      <circle cx={cx} cy={cy} r={r * 0.22} fill="#0f0a1e" stroke="rgba(124,58,237,0.5)" strokeWidth="1" />
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="20" fill="#f59e0b">☉</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fill="#94a3b8">星缘</text>
      
      {/* Planets */}
      {PLANET_KEYS.map(key => {
        const p = planets?.[key];
        if (!p || p.error || p.longitude == null) return null;
        const pos = getPoint(p.longitude, r * 0.62);
        return (
          <g key={key} className="cursor-pointer" filter="url(#glow)">
            <circle cx={pos.x} cy={pos.y} r="12" fill="#0f0a1e" stroke="#fbbf24" strokeWidth="1.5" />
            <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontSize="11" fill="#fbbf24" fontWeight="bold">
              {PLANET_SYMBOLS[key]}
            </text>
            {/* Retrograde indicator */}
            {p.retrograde && (
              <text x={pos.x + 8} y={pos.y - 6} fontSize="7" fill="#f43f5e">℞</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function NatalPage() {
  const [lang, setLang] = useState<'zh' | 'en' | 'id'>('zh');
  const [chartType, setChartType] = useState('natal');
  const [form, setForm] = useState({
    name: '', year: 1990, month: 6, day: 15, hour: 12, minute: 0,
    cityId: 'jakarta', houseSystem: 'K',
    // 自定义坐标（地图选点）
    customLat: null as number | null,
    customLng: null as number | null,
    customTz: null as number | null,
    customCityName: '' as string,
  });
  const [secForm, setSecForm] = useState({
    year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate(),
  });
  const [p2Form, setP2Form] = useState({
    year: 1992, month: 3, day: 20, hour: 10, minute: 0, cityId: 'beijing',
  });
  const [chart, setChart] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState('chart');
  const [saved, setSaved] = useState<any[]>([]);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // AI Reading unlock state
  const [shareCount, setShareCount] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Load unlock state from localStorage
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('natal_ai_unlock');
      if (savedState) {
        const s = JSON.parse(savedState);
        if (s.shareCount) setShareCount(s.shareCount);
        if (s.isUnlocked) setIsUnlocked(true);
      }
    } catch {}
  }, []);

  const saveUnlockState = (updates: any) => {
    try {
      const current = JSON.parse(localStorage.getItem('natal_ai_unlock') || '{}');
      localStorage.setItem('natal_ai_unlock', JSON.stringify({ ...current, ...updates }));
    } catch {}
  };

  // WhatsApp share handler
  const handleShare = () => {
    const shareText = lang === 'zh' 
      ? `我刚刚用星缘生成了我的本命盘，快来试试！https://astrology-clean.vercel.app/natal`
      : lang === 'id' 
      ? `Saya baru saja membuat bagan lahir saya di Xingyuan, coba juga! https://astrology-clean.vercel.app/natal`
      : `I just generated my natal chart on Starry Fate, come try it! https://astrology-clean.vercel.app/natal`;
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

  const city = CITIES.find(c => c.id === form.cityId) || CITIES[0];
  const city2 = CITIES.find(c => c.id === p2Form.cityId) || CITIES[1];

  // 获取实际使用的坐标（优先使用自定义坐标）
  const activeLat = form.customLat ?? city.lat;
  const activeLng = form.customLng ?? city.lng;
  const activeTz = form.customTz ?? city.tz;
  const activeCityName = form.customCityName || city.name[lang] || city.name.zh;

  useEffect(() => {
    try {
      const s = localStorage.getItem('natal_charts');
      if (s) setSaved(JSON.parse(s));
    } catch {}
  }, []);

  const calculate = async () => {
    setLoading(true);
    setError(null);
    try {
      let body: any = {
        year: form.year, month: form.month, day: form.day,
        hour: form.hour, minute: form.minute,
        latitude: activeLat, longitude: activeLng, timezone: activeTz,
        houseSystem: form.houseSystem,
      };

      if (['transit', 'solar', 'lunar', 'progression', 'composite'].includes(chartType)) {
        body = {
          type: chartType === 'solar' ? 'solar_return' : chartType === 'lunar' ? 'lunar_return' : chartType,
          birthData: { year: form.year, month: form.month, day: form.day, hour: form.hour, minute: form.minute, lat: activeLat, lng: activeLng, tz: activeTz },
          houseSystem: form.houseSystem,
        };
        if (['transit', 'solar', 'lunar'].includes(chartType)) {
          body.transitDate = { year: secForm.year, month: secForm.month, day: secForm.day, hour: 12, minute: 0 };
        }
        if (chartType === 'progression') {
          body.transitDate = { year: secForm.year };
        }
        if (chartType === 'composite') {
          body.birthData2 = { year: p2Form.year, month: p2Form.month, day: p2Form.day, hour: p2Form.hour, minute: p2Form.minute, lat: city2.lat, lng: city2.lng, tz: city2.tz };
        }
      }

      const endpoint = ['transit', 'solar', 'lunar', 'progression', 'composite'].includes(chartType) ? '/api/chart/transit' : '/api/chart';
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      const chartData = data.data || data;
      setChart(chartData);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!chart) return;
    const newSaved = [{ name: form.name || `${form.year}-${form.month}-${form.day}`, birthData: form, chartData: chart, ts: Date.now() }, ...saved.slice(0, 9)];
    setSaved(newSaved);
    localStorage.setItem('natal_charts', JSON.stringify(newSaved));
    setSaveMsg(tx('chartSaved', lang));
    setTimeout(() => setSaveMsg(null), 2000);
  };

  const loadChart = (c: any) => {
    setForm({ ...form, name: c.name, year: c.birthData.year, month: c.birthData.month, day: c.birthData.day, hour: c.birthData.hour, minute: c.birthData.minute, cityId: c.birthData.cityId || form.cityId });
    if (c.chartData) setChart(c.chartData);
  };

  const years = Array.from({ length: 100 }, (_, i) => 2025 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const cityOptions = CITIES.map(c => ({ id: c.id, name: c.name[lang] || c.name.zh }));
  const houseOptions = HOUSE_SYSTEMS.map(h => ({ id: h.id, name: h.name[lang] || h.name.zh }));
  const yearOptions = years.map(y => ({ id: String(y), name: String(y) }));
  const monthOptions = months.map(m => ({ id: String(m), name: String(m) }));
  const dayOptions = days.map(d => ({ id: String(d), name: String(d) }));
  const hourOptions = hours.map(h => ({ id: String(h), name: String(h).padStart(2, '0') }));
  const minOptions = minutes.filter(m => m % 5 === 0).map(m => ({ id: String(m), name: String(m).padStart(2, '0') }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030014] via-[#0f0f23] to-[#030014] text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#030014]/90 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/chart" className="flex items-center gap-2 text-purple-300 hover:text-white">
            <ArrowLeft size={20} /><span className="text-sm">{tx('back', lang)}</span>
          </Link>
          <h1 className="text-lg font-bold text-white">星缘</h1>
          <div className="flex gap-1 bg-white/5 rounded-xl p-1">
            {(['zh', 'en', 'id'] as const).map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${lang === l ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                {l === 'zh' ? '中文' : l === 'en' ? 'EN' : 'ID'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Chart Type Selector */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
          {[
            { id: 'natal', icon: Star, label: 'natal' },
            { id: 'transit', icon: TrendingUp, label: 'transit' },
            { id: 'solar', icon: Sun, label: 'solar' },
            { id: 'lunar', icon: Moon, label: 'lunar' },
            { id: 'progression', icon: Calendar, label: 'progression' },
            { id: 'composite', icon: Heart, label: 'composite' },
          ].map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => { setChartType(t.id); setChart(null); }}
                className={`p-3 rounded-xl border transition-all ${chartType === t.id ? 'bg-purple-600/20 border-purple-500 text-purple-300' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}>
                <Icon size={18} className="mx-auto mb-1" />
                <div className="text-xs">{tx(t.label, lang)}</div>
              </button>
            );
          })}
        </div>

        {/* Saved Charts */}
        {saved.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-sm text-slate-400 mb-2">{tx('savedCharts', lang)}</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {saved.map((c, i) => (
                <button key={i} onClick={() => loadChart(c)}
                  className="flex-shrink-0 px-3 py-2 rounded-lg bg-white/5 text-sm text-slate-300 hover:bg-white/10">
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Main Form */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Star size={18} className="text-purple-400" />{tx('birthInfo', lang)}
            </h3>
            
            <div className="space-y-4">
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder={tx('chartName', lang)}
                className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500" />
              
              <CitySelect value={form.cityId} onChange={v => setForm({ ...form, cityId: v, customLat: null, customLng: null, customTz: null, customCityName: '' })} cities={CITIES} lang={lang} label={tx('city', lang)} />
              
              {/* 地图搜索 - 精确定位 */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                  </svg>
                  <span>{lang === 'zh' ? '或精确搜索地点（更准确）' : lang === 'id' ? 'Atau cari lokasi tepat (lebih akurat)' : 'Or search exact location (more accurate)'}</span>
                </div>
                <LocationSearch
                  lang={lang}
                  onSelect={(result) => {
                    setForm(prev => ({
                      ...prev,
                      customLat: result.lat,
                      customLng: result.lng,
                      customTz: result.tz,
                      customCityName: result.name,
                    }));
                  }}
                />
                {form.customLat !== null && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <div className="text-xs text-purple-300">
                      <span className="font-medium">{form.customCityName}</span>
                      <span className="text-slate-400 ml-2">{form.customLat?.toFixed(4)}°, {form.customLng?.toFixed(4)}°</span>
                      <span className="text-slate-400 ml-2">UTC{form.customTz !== null && form.customTz >= 0 ? '+' : ''}{form.customTz}</span>
                    </div>
                    <button
                      onClick={() => setForm(prev => ({ ...prev, customLat: null, customLng: null, customTz: null, customCityName: '' }))}
                      className="text-slate-500 hover:text-white ml-2"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <CustomSelect value={String(form.year)} onChange={v => setForm({ ...form, year: Number(v) })} options={yearOptions} label={tx('year', lang)} />
                <CustomSelect value={String(form.month)} onChange={v => setForm({ ...form, month: Number(v) })} options={monthOptions} label={tx('month', lang)} />
                <CustomSelect value={String(form.day)} onChange={v => setForm({ ...form, day: Number(v) })} options={dayOptions} label={tx('day', lang)} />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <CustomSelect value={String(form.hour)} onChange={v => setForm({ ...form, hour: Number(v) })} options={hourOptions} label={tx('hour', lang)} />
                <CustomSelect value={String(form.minute)} onChange={v => setForm({ ...form, minute: Number(v) })} options={minOptions} label={tx('minute', lang)} />
              </div>
              
              <CustomSelect value={form.houseSystem} onChange={v => setForm({ ...form, houseSystem: v })} options={houseOptions} label={tx('houseSystem', lang)} />
            </div>
          </div>

          {/* Secondary Form */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            {['transit', 'solar', 'lunar'].includes(chartType) && (
              <>
                <h3 className="font-bold mb-4 flex items-center gap-2"><Calendar size={18} className="text-cyan-400" />{tx('transitDate', lang)}</h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <CustomSelect value={String(secForm.year)} onChange={v => setSecForm({ ...secForm, year: Number(v) })} options={yearOptions} />
                  {chartType !== 'progression' && (
                    <>
                      <CustomSelect value={String(secForm.month)} onChange={v => setSecForm({ ...secForm, month: Number(v) })} options={monthOptions} />
                      <CustomSelect value={String(secForm.day)} onChange={v => setSecForm({ ...secForm, day: Number(v) })} options={dayOptions} />
                    </>
                  )}
                </div>
              </>
            )}
            
            {chartType === 'progression' && (
              <>
                <h3 className="font-bold mb-4 flex items-center gap-2"><Calendar size={18} className="text-emerald-400" />{tx('targetYear', lang)}</h3>
                <CustomSelect value={String(secForm.year)} onChange={v => setSecForm({ ...secForm, year: Number(v) })} options={yearOptions} />
                <p className="text-xs text-slate-500 mt-2">{tx('dayAfterBirth', lang).replace('{0}', String(secForm.year - form.year))}</p>
              </>
            )}
            
            {chartType === 'composite' && (
              <>
                <h3 className="font-bold mb-4 flex items-center gap-2"><Heart size={18} className="text-pink-400" />{tx('person2', lang)}</h3>
                <div className="space-y-3">
                  <CustomSelect value={p2Form.cityId} onChange={v => setP2Form({ ...p2Form, cityId: v })} options={cityOptions} />
                  <div className="grid grid-cols-3 gap-2">
                    <CustomSelect value={String(p2Form.year)} onChange={v => setP2Form({ ...p2Form, year: Number(v) })} options={yearOptions} />
                    <CustomSelect value={String(p2Form.month)} onChange={v => setP2Form({ ...p2Form, month: Number(v) })} options={monthOptions} />
                    <CustomSelect value={String(p2Form.day)} onChange={v => setP2Form({ ...p2Form, day: Number(v) })} options={dayOptions} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <CustomSelect value={String(p2Form.hour)} onChange={v => setP2Form({ ...p2Form, hour: Number(v) })} options={hourOptions} />
                    <CustomSelect value={String(p2Form.minute)} onChange={v => setP2Form({ ...p2Form, minute: Number(v) })} options={minOptions} />
                  </div>
                </div>
              </>
            )}
            
            <button onClick={calculate} disabled={loading}
              className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={18} className="animate-spin" />{tx('calculating', lang)}</> : <><Star size={18} />{tx('calculate', lang)}</>}
            </button>
            
            {error && (
              <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                <X size={16} />{error}
                <button onClick={calculate} className="ml-auto text-red-300 hover:text-red-200">{tx('retry', lang)}</button>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {chart && (
          <div className="mt-8 space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 p-1 rounded-xl bg-white/5 max-w-lg mx-auto flex-wrap">
              {['chart', 'planets', 'houses', 'aspects', 'ai'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors min-w-[60px] ${tab === t ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                  {t === 'ai' ? 'AI' : tx(t, lang)}
                </button>
              ))}
            </div>

            {/* Chart Tab */}
            {tab === 'chart' && (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                <NatalChartSVG planets={chart.planets || {}} houses={chart.houses || []} aspects={chart.aspects || []} size={450} />
                <button onClick={handleSave}
                  className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm flex items-center gap-2 mx-auto transition-colors">
                  <Save size={16} />{saveMsg || tx('saveChart', lang)}
                </button>
              </div>
            )}

            {/* Planets Tab */}
            {tab === 'planets' && (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-bold mb-4">{tx('planetPositions', lang)}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 text-slate-400">{tx('planet', lang)}</th>
                        <th className="text-left py-2 text-slate-400">{tx('sign', lang)}</th>
                        <th className="text-left py-2 text-slate-400">{tx('degree', lang)}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PLANET_KEYS.map(key => {
                        const p = chart.planets?.[key];
                        if (!p || p.error) return null;
                        return (
                          <tr key={key} className="border-b border-white/5">
                            <td className="py-2 flex items-center gap-2">
                              <span>{PLANET_SYMBOLS[key]}</span>
                              <span className="text-amber-400">{PLANETS_CN[key] || key}</span>
                            </td>
                            <td className="py-2">
                              <span className="mr-1">{SIGN_SYMBOLS[['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'].indexOf(p.sign)]}</span>
                              {p.sign_cn || p.sign}
                            </td>
                            <td className="py-2">{Math.floor(p.degree)}&deg; {Math.floor((p.degree % 1) * 60)}&apos;</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Houses Tab */}
            {tab === 'houses' && (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-bold mb-4">{tx('houseInfo', lang)}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {(chart.houses || []).map((h: any) => {
                    const isAngular = [1, 4, 7, 10].includes(h.house);
                    const isSuccedent = [2, 5, 8, 11].includes(h.house);
                    return (
                      <div key={h.house} className={`p-3 rounded-xl ${isAngular ? 'bg-amber-500/10 border border-amber-500/30' : isSuccedent ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-white/5'}`}>
                        <div className="font-bold text-white">{h.house}{lang === 'zh' ? '宫' : ' House'}</div>
                        <div className="text-sm text-slate-400">{SIGN_SYMBOLS[['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'].indexOf(h.sign)]} {h.sign_cn || h.sign}</div>
                        <div className="text-xs text-slate-500">{Math.floor(h.degree)}° {Math.floor((h.degree % 1) * 60)}&apos;</div>
                      </div>
                    );
                  })}
                </div>
                {chart.ascendant && (
                  <div className="mt-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
                    <span className="text-purple-400">{tx('ascendant', lang)}:</span> {SIGN_SYMBOLS[['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'].indexOf(chart.ascendant.sign)]} {chart.ascendant.sign_cn || chart.ascendant.sign} {Math.floor(chart.ascendant.degree)}&deg;
                    <span className="mx-3 text-slate-500">|</span>
                    <span className="text-cyan-400">{tx('midheaven', lang)}:</span> {SIGN_SYMBOLS[['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'].indexOf(chart.midheaven?.sign)]} {chart.midheaven?.sign_cn || chart.midheaven?.sign} {Math.floor(chart.midheaven?.degree || 0)}&deg;
                  </div>
                )}
              </div>
            )}

            {/* Aspects Tab */}
            {tab === 'aspects' && (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-bold mb-4">{tx('majorAspects', lang)}</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {(chart.aspects || [])
                    .filter((a: any) => ['Conjunction', 'Sextile', 'Square', 'Trine', 'Opposition'].includes(a.aspect || a.type))
                    .slice(0, 20)
                    .map((a: any, i: number) => {
                      const type = a.aspect || a.type;
                      const aspName = ASPECT_NAMES[type] || { zh: type, en: type, id: type };
                      return (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                          <div className="flex items-center gap-2">
                            <span className="text-amber-400">{PLANET_SYMBOLS[a.planet1] || a.planet1}</span>
                            <span className="text-slate-500">-</span>
                            <span style={{ color: ASPECT_COLORS[type] }}>{aspName[lang as keyof typeof aspName] || type}</span>
                            <span className="text-slate-500">-</span>
                            <span className="text-amber-400">{PLANET_SYMBOLS[a.planet2] || a.planet2}</span>
                          </div>
                          <span className="text-slate-400 text-xs">{Math.abs(a.orb || a.orb).toFixed(1)}°</span>
                        </div>
                      );
                    })}
                </div>
                {(chart.aspects || []).length === 0 && (
                  <p className="text-center text-slate-500 py-8">{lang === 'zh' ? '暂无相位数据' : lang === 'id' ? 'Tidak ada data aspek' : 'No aspect data'}</p>
                )}
              </div>
            )}

            {/* AI Reading Tab */}
            {tab === 'ai' && (
              <div className="space-y-6">
                {/* Free Simple Reading */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Sparkles size={18} className="text-amber-400" />
                    {tx('simpleReading', lang)}
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">{tx('freeReading', lang)}</span>
                  </h3>
                  <div className="space-y-4">
                    {/* Sun Reading */}
                    {chart.planets?.Sun?.sign && (AI_READINGS.Sun as any)?.[lang]?.[chart.planets.Sun.sign] && (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <h4 className="font-bold mb-2 flex items-center gap-2 text-amber-400">
                          <span>☉</span>{tx('corePersonality', lang)} — {chart.planets.Sun.sign_cn || chart.planets.Sun.sign}
                        </h4>
                        <p className="text-slate-300 text-sm mb-2">{(AI_READINGS.Sun as any)[lang][chart.planets.Sun.sign].summary}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {(AI_READINGS.Sun as any)[lang][chart.planets.Sun.sign].traits.map((t: string, i: number) => (
                            <span key={i} className="px-2 py-1 rounded-full text-xs bg-amber-500/20 text-amber-300">{t}</span>
                          ))}
                        </div>
                        <p className="text-xs text-slate-400 italic">💡 {(AI_READINGS.Sun as any)[lang][chart.planets.Sun.sign].advice}</p>
                      </div>
                    )}
                    {/* Moon Reading */}
                    {chart.planets?.Moon?.sign && (AI_READINGS.Moon as any)?.[lang]?.[chart.planets.Moon.sign] && (
                      <div className="p-4 rounded-xl bg-slate-500/10 border border-slate-500/20">
                        <h4 className="font-bold mb-2 flex items-center gap-2 text-slate-400">
                          <span>☽</span>{tx('emotionalWorld', lang)} — {chart.planets.Moon.sign_cn || chart.planets.Moon.sign}
                        </h4>
                        <p className="text-slate-300 text-sm mb-2">{(AI_READINGS.Moon as any)[lang][chart.planets.Moon.sign].summary}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {(AI_READINGS.Moon as any)[lang][chart.planets.Moon.sign].traits.map((t: string, i: number) => (
                            <span key={i} className="px-2 py-1 rounded-full text-xs bg-slate-500/20 text-slate-300">{t}</span>
                          ))}
                        </div>
                        <p className="text-xs text-slate-400 italic">💡 {(AI_READINGS.Moon as any)[lang][chart.planets.Moon.sign].advice}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Deep Reading with Unlock */}
                <div className="rounded-2xl overflow-hidden border border-white/10">
                  {/* Header */}
                  <div className="p-5 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 flex items-center justify-between">
                    <h3 className="font-bold flex items-center gap-2">
                      {isUnlocked ? <Sparkles size={18} className="text-purple-400" /> : <Lock size={18} className="text-slate-400" />}
                      {tx('deepReading', lang)}
                    </h3>
                    {isUnlocked && <span className="text-xs text-green-400 flex items-center gap-1"><CheckCircle size={14} />{tx('shareComplete', lang)}</span>}
                  </div>

                  {/* Unlocked Content */}
                  {isUnlocked ? (
                    <div className="p-5 space-y-4">
                      {/* Venus */}
                      {chart.planets?.Venus?.sign && (
                        <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20">
                          <h4 className="font-bold mb-2 flex items-center gap-2 text-pink-400">
                            <span>♀</span>{tx('loveDestiny', lang)} — {chart.planets.Venus.sign_cn || chart.planets.Venus.sign}
                          </h4>
                          <p className="text-slate-300 text-sm">{lang === 'zh' ? `金星在${chart.planets.Venus.sign_cn}，你的爱情风格独特而迷人。` : lang === 'id' ? `Venus di ${chart.planets.Venus.sign}, gaya cinta Anda unik.` : `Venus in ${chart.planets.Venus.sign}, your love style is unique.`}</p>
                        </div>
                      )}
                      {/* Mars */}
                      {chart.planets?.Mars?.sign && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                          <h4 className="font-bold mb-2 flex items-center gap-2 text-red-400">
                            <span>♂</span>{tx('actionEnergy', lang)} — {chart.planets.Mars.sign_cn || chart.planets.Mars.sign}
                          </h4>
                          <p className="text-slate-300 text-sm">{lang === 'zh' ? `火星在${chart.planets.Mars.sign_cn}，你的行动力和驱动力特征鲜明。` : lang === 'id' ? `Mars di ${chart.planets.Mars.sign}, energi aksi Anda sangat khas.` : `Mars in ${chart.planets.Mars.sign}, your action energy is distinctive.`}</p>
                        </div>
                      )}
                      {/* Ascendant */}
                      {chart.ascendant?.sign && (
                        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                          <h4 className="font-bold mb-2 flex items-center gap-2 text-purple-400">
                            <span>↑</span>{tx('ascendant', lang)} — {chart.ascendant.sign_cn || chart.ascendant.sign} {Math.floor(chart.ascendant.degree)}°
                          </h4>
                          <p className="text-slate-300 text-sm">{lang === 'zh' ? `上升${chart.ascendant.sign_cn}是你给人的第一印象。` : lang === 'id' ? `Ascenden ${chart.ascendant.sign} adalah kesan pertama Anda.` : `Ascendant ${chart.ascendant.sign} is your first impression.`}</p>
                        </div>
                      )}
                      {/* Planet List */}
                      <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                        <h4 className="font-bold mb-2 text-cyan-400">{tx('planetPositions', lang)}</h4>
                        <div className="flex flex-wrap gap-2">
                          {PLANET_KEYS.filter(k => chart.planets?.[k]?.sign).map(k => (
                            <span key={k} className="px-2 py-1 rounded-lg text-xs bg-white/5 text-slate-400">
                              {PLANET_SYMBOLS[k]} {chart.planets[k].sign_cn || chart.planets[k].sign}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Locked - Share to Unlock */
                    <div className="p-6 space-y-5">
                      {/* Blurred Preview */}
                      <div className="relative">
                        <div className="space-y-3 blur-sm pointer-events-none select-none opacity-60">
                          <div className="p-4 rounded-xl bg-white/5"><div className="h-4 bg-white/10 rounded w-3/4 mb-2" /><div className="h-3 bg-white/5 rounded w-full" /></div>
                          <div className="p-4 rounded-xl bg-white/5"><div className="h-4 bg-white/10 rounded w-2/3 mb-2" /><div className="h-3 bg-white/5 rounded w-full" /></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <Lock size={32} className="text-slate-400 mx-auto mb-2" />
                            <p className="text-slate-300 font-medium">{tx('unlockDeep', lang)}</p>
                          </div>
                        </div>
                      </div>

                      {/* WhatsApp Share */}
                      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                        <div className="flex items-center gap-3 mb-3">
                          <MessageCircle size={20} className="text-green-400" />
                          <div>
                            <div className="font-medium text-white text-sm">{tx('shareToUnlock', lang)}</div>
                          </div>
                        </div>
                        {/* Progress */}
                        <div className="flex gap-2 mb-3">
                          {[1, 2, 3].map(n => (
                            <div key={n} className={`flex-1 h-2 rounded-full transition-all ${shareCount >= n ? "bg-green-500" : "bg-white/10"}`} />
                          ))}
                        </div>
                        <div className="text-xs text-slate-400 mb-3">{tx('shareProgress', lang)}: {shareCount}/3</div>

                        {shareCount < 3 ? (
                          <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3].map(n => (
                              <button key={n} onClick={handleShare} disabled={shareCount >= n}
                                className={`py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${shareCount >= n ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-white/5 hover:bg-green-500/20 text-slate-300 hover:text-green-300 border border-white/10"}`}>
                                {shareCount >= n ? <CheckCircle size={12} /> : <Share2 size={12} />}
                                {tx('friend', lang)} {n}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-green-400 font-medium text-sm flex items-center justify-center gap-2">
                            <CheckCircle size={16} />{tx('shareComplete', lang)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
