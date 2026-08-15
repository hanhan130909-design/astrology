"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { Moon, Star, Sun, Calendar, ChevronDown, Loader2, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import ClassicReturnChart from '@/components/ClassicReturnChart';
import { loadLatestBirthProfile, profileToBirthData } from '@/lib/latestBirthProfile';

const CITIES: { id: string; name: Record<string, string>; lat: number; lng: number; tz: number }[] = [
  { id: 'jakarta', name: { zh: '雅加达', en: 'Jakarta', id: 'Jakarta', th: 'จาการ์ตา', vi: 'Jakarta', ms: 'Jakarta', ja: 'ジャカルタ', ko: '자카르타' }, lat: -6.2088, lng: 106.8456, tz: 7 },
  { id: 'beijing', name: { zh: '北京', en: 'Beijing', id: 'Beijing', th: 'ปักกิ่ง', vi: 'Bắc Kinh', ms: 'Beijing', ja: '北京', ko: '베이징' }, lat: 39.9042, lng: 116.4074, tz: 8 },
  { id: 'shanghai', name: { zh: '上海', en: 'Shanghai', id: 'Shanghai', th: 'เซี่ยงไฮ้', vi: 'Thượng Hải', ms: 'Shanghai', ja: '上海', ko: '상하이' }, lat: 31.2304, lng: 121.4737, tz: 8 },
  { id: 'tokyo', name: { zh: '东京', en: 'Tokyo', id: 'Tokyo', th: 'โตเกียว', vi: 'Tokyo', ms: 'Tokyo', ja: '東京', ko: '도쿄' }, lat: 35.6762, lng: 139.6503, tz: 9 },
  { id: 'newyork', name: { zh: '纽约', en: 'New York', id: 'New York', th: 'นิวยอร์ก', vi: 'New York', ms: 'New York', ja: 'ニューヨーク', ko: '뉴욕' }, lat: 40.7128, lng: -74.006, tz: -5 },
  { id: 'london', name: { zh: '伦敦', en: 'London', id: 'London', th: 'ลอนดอน', vi: 'London', ms: 'London', ja: 'ロンドン', ko: '런던' }, lat: 51.5074, lng: -0.1278, tz: 0 },
  { id: 'singapore', name: { zh: '新加坡', en: 'Singapore', id: 'Singapore', th: 'สิงคโปร์', vi: 'Singapore', ms: 'Singapura', ja: 'シンガポール', ko: '싱가포르' }, lat: 1.3521, lng: 103.8198, tz: 8 },
  { id: 'sydney', name: { zh: '悉尼', en: 'Sydney', id: 'Sydney', th: 'ซิดนีย์', vi: 'Sydney', ms: 'Sydney', ja: 'シドニー', ko: '시드니' }, lat: -33.8688, lng: 151.2093, tz: 10 },
  { id: 'surabaya', name: { zh: '泗水', en: 'Surabaya', id: 'Surabaya', th: 'สุราบายา', vi: 'Surabaya', ms: 'Surabaya', ja: 'スラバヤ', ko: '수라바야' }, lat: -7.2575, lng: 112.7521, tz: 7 },
  { id: 'bandung', name: { zh: '万隆', en: 'Bandung', id: 'Bandung', th: 'บันดุง', vi: 'Bandung', ms: 'Bandung', ja: 'バンドン', ko: '반둥' }, lat: -6.9175, lng: 107.6191, tz: 7 },
];

const LABELS: Record<string, Record<string, string>> = {
  zh: {
    title: '月返盘分析',
    subtitle: '月亮回归 - 每月能量周期解读',
    intro: '月返盘是月亮回到你出生时所在位置的星盘。通常每月发生一次，代表当月的能量主题和情感模式。',
    birthInfo: '出生信息',
    city: '出生城市',
    birthDate: '出生日期',
    year: '年', month: '月', day: '日',
    hour: '时', minute: '分',
    targetMonth: '查看月份',
    calculate: '计算月返盘',
    calculating: '计算中...',
    lunarReturnDate: '月返日期',
    lunarReturnTime: '月返时间',
    natalMoon: '本命月亮',
    currentMoon: '当前月亮',
    natalMoonSign: '本命月亮星座',
    monthlyTheme: '本月能量主题',
    emotional: '情感模式',
    themes: '能量主题',
    reminder: '情绪提醒',
    tip: '本月建议',
    back: '返回',
    selectMonth: '选择月份',
    chart: '星盘',
    planets: '行星',
    aspects: '相位',
    info: '什么是月返盘？'},
  en: {
    title: 'Lunar Return Chart',
    subtitle: 'Moon Return - Monthly Energy Cycle Reading',
    intro: 'A Lunar Return chart is drawn for the moment the Moon returns to its natal position. It occurs roughly monthly and reveals the energy theme and emotional patterns for the month.',
    birthInfo: 'Birth Information',
    city: 'Birth City',
    birthDate: 'Birth Date',
    year: 'Year', month: 'Month', day: 'Day',
    hour: 'Hour', minute: 'Minute',
    targetMonth: 'View Month',
    calculate: 'Calculate Lunar Return',
    calculating: 'Calculating...',
    lunarReturnDate: 'Lunar Return Date',
    lunarReturnTime: 'Lunar Return Time',
    natalMoon: 'Natal Moon',
    currentMoon: 'Current Moon',
    natalMoonSign: 'Natal Moon Sign',
    monthlyTheme: 'Monthly Energy Theme',
    emotional: 'Emotional Pattern',
    themes: 'Energy Themes',
    reminder: 'Emotional Reminder',
    tip: 'Monthly Advice',
    back: 'Back',
    selectMonth: 'Select Month',
    chart: 'Chart',
    planets: 'Planets',
    aspects: 'Aspects',
    info: 'What is Lunar Return?'},
  id: {
    title: 'Bagan Lunar Return',
    subtitle: 'Kembali Bulan - Siklus Energi Bulanan',
    intro: 'Bagan Lunar Return dibuat saat Bulan kembali ke posisi lahirnya. Terjadi setiap bulan dan mengungkapkan tema energi dan pola emosi bulan tersebut.',
    birthInfo: 'Data Lahir',
    city: 'Kota Lahir',
    birthDate: 'Tanggal Lahir',
    year: 'Tahun', month: 'Bulan', day: 'Hari',
    hour: 'Jam', minute: 'Menit',
    targetMonth: 'Lihat Bulan',
    calculate: 'Hitung Lunar Return',
    calculating: 'Menghitung...',
    lunarReturnDate: 'Tanggal Lunar Return',
    lunarReturnTime: 'Waktu Lunar Return',
    natalMoon: 'Bulan Lahir',
    currentMoon: 'Bulan Saat Ini',
    natalMoonSign: 'Tanda Bulan Lahir',
    monthlyTheme: 'Tema Energi Bulanan',
    emotional: 'Pola Emosi',
    themes: 'Tema Energi',
    reminder: 'Pengingat Emosi',
    tip: 'Saran Bulanan',
    back: 'Kembali',
    selectMonth: 'Pilih Bulan',
    chart: 'Bagan',
    planets: 'Planet',
    aspects: 'Aspek',
    info: 'Apa itu Lunar Return?'}};

const MOON_THEMES: Record<string, Record<string, { theme: string; emotional: string; reminder: string; tip: string }>> = {
  Aries: { zh: { theme: '行动与冲动', emotional: '容易急躁，需要耐心', reminder: '避免冲动决定', tip: '多进行体育锻炼，释放能量' }, en: { theme: 'Action & Impulse', emotional: 'Prone to impatience', reminder: 'Avoid hasty decisions', tip: 'Engage in physical activity' }, id: { theme: 'Aksi & Dorongan', emotional: 'Cenderung tidak sabar', reminder: 'Hindari keputusan terburu-buru', tip: 'Lakukan aktivitas fisik' }, th: { theme: 'การกระทำ', emotional: 'ใจร้อนง่าย', reminder: 'หลีกเลี่ยงการตัดสินใจเร่งรีบ', tip: 'ออกกำลังกาย' }, vi: { theme: 'Hành động', emotional: 'Dễ nóng vội', reminder: 'Tránh quyết định vội vàng', tip: 'Tập thể dục' }, ms: { theme: 'Tindakan', emotional: 'Cenderung tidak sabar', reminder: 'Elak keputusan tergesa-gesa', tip: 'Bersenam' }, ja: { theme: '行動', emotional: '短気になりがち', reminder: '焦燥な決断を避ける', tip: '運動する' }, ko: { theme: '행동', emotional: '성급해지기 쉬움', reminder: '성급한 결정 피하기', tip: '울동하기' } },
  Taurus: { zh: { theme: '稳定与享受', emotional: '需要安全感和物质享受', reminder: '避免固执', tip: '接触大自然，享受美食' }, en: { theme: 'Stability & Pleasure', emotional: 'Need security', reminder: 'Avoid stubbornness', tip: 'Connect with nature' }, id: { theme: 'Stabilitas & Kesenangan', emotional: 'Butuh keamanan', reminder: 'Hindari kekerashtebungan', tip: 'Hubungi alam' }, th: { theme: 'ความมั่นคง', emotional: 'ต้องการความปลอดภัย', reminder: 'หลีกเลี่ยงความดื้อรั้น', tip: 'ใกล้ชิดธรรมชาติ' }, vi: { theme: 'Ổn định', emotional: 'Cần an toàn', reminder: 'Tránh cứng đầu', tip: 'Gần gũi thiên nhiên' }, ms: { theme: 'Kestabilan', emotional: 'Perlukan keselamatan', reminder: 'Elak keras kepala', tip: 'Dekat dengan alam' }, ja: { theme: '安定', emotional: '安心感が必要', reminder: '頑固さを避ける', tip: '自然に触れる' }, ko: { theme: '안정', emotional: '안정감 필요', reminder: '완고함 피하기', tip: '자연과 접촉' } },
  Gemini: { zh: { theme: '沟通与交流', emotional: '思维活跃，兴趣广泛', reminder: '避免信息过载', tip: '多与朋友交流，阅读' }, en: { theme: 'Communication', emotional: 'Active mind', reminder: 'Avoid overwhelm', tip: 'Socialize and read' }, id: { theme: 'Komunikasi', emotional: 'Pikiran aktif', reminder: 'Hindari kelelahan informasi', tip: 'Bersosialisasi' }, th: { theme: 'การสื่อสาร', emotional: 'จิตใจกระตือรือร้น', reminder: 'หลีกเลี่ยงข้อมูลมากเกินไป', tip: 'สังคมและอ่านหนังสือ' }, vi: { theme: 'Giao tiếp', emotional: 'Tinh thần năng động', reminder: 'Tránh quá tải thông tin', tip: 'Giao lưu và đọc sách' }, ms: { theme: 'Komunikasi', emotional: 'Minda aktif', reminder: 'Elak maklumat berlebihan', tip: 'Bersosial dan baca' }, ja: { theme: 'コミュニケーション', emotional: '活発な精神', reminder: '情報過多を避ける', tip: '社交と読書' }, ko: { theme: '의사소통', emotional: '활발한 정신', reminder: '정보 과다 피하기', tip: '사교와 독서' } },
  Cancer: { zh: { theme: '家庭与情感', emotional: '情感丰富，需要归属感', reminder: '避免过度依赖', tip: '花时间陪伴家人' }, en: { theme: 'Family & Emotion', emotional: 'Need belonging', reminder: 'Avoid over-attachment', tip: 'Spend time with family' }, id: { theme: 'Keluarga & Emosi', emotional: 'Butuh rasa memiliki', reminder: 'Hindari ketergantungan berlebih', tip: 'Waktu dengan keluarga' }, th: { theme: 'ครอบครัวและอารมณ์', emotional: 'ต้องการความเป็นส่วนหนึ่ง', reminder: 'หลีกเลี่ยงการพึ่งพามากเกินไป', tip: 'ใช้เวลากับครอบครัว' }, vi: { theme: 'Gia đình và cảm xúc', emotional: 'Cần thuộc về', reminder: 'Tránh phụ thuộc quá mức', tip: 'Dành thờii gian cho gia đình' }, ms: { theme: 'Keluarga & Emosi', emotional: 'Perlu rasa memiliki', reminder: 'Elak pergantungan berlebihan', tip: 'Masa dengan keluarga' }, ja: { theme: '家族と感情', emotional: '帰属感が必要', reminder: '過度な依存を避ける', tip: '家族と時間を過ごす' }, ko: { theme: '가족과 감정', emotional: '소속감 필요', reminder: '과도한 의존 피하기', tip: '가족과 시간 복내기' } },
  Leo: { zh: { theme: '自信与创造', emotional: '渴望被关注和欣赏', reminder: '避免自我中心', tip: '展示才华，参与活动' }, en: { theme: 'Confidence & Creativity', emotional: 'Desire recognition', reminder: 'Avoid self-centeredness', tip: 'Show talents' }, id: { theme: 'Kepercayaan & Kreativitas', emotional: 'Ingin pengakuan', reminder: 'Hindari mementingkan diri', tip: 'Tunjukkan bakat' }, th: { theme: 'ความมั่นใจและความคิดสร้างสรรค์', emotional: 'ต้องการการยอมรับ', reminder: 'หลีกเลี่ยงการเห็นแก่ตัว', tip: 'แสดงความสามารถ' }, vi: { theme: 'Tự tin và sáng tạo', emotional: 'Khao khát được công nhận', reminder: 'Tránh ích kỷ', tip: 'Thể hiện tài năng' }, ms: { theme: 'Keyakinan & Kreativiti', emotional: 'Mahukan pengiktirafan', reminder: 'Elak mementingkan diri', tip: 'Tunjukkan bakat' }, ja: { theme: '自信と創造性', emotional: '認められたい', reminder: '自己中心を避ける', tip: '才能を見せる' }, ko: { theme: '자신감과 창의성', emotional: '인정받고 싶음', reminder: '이기적 피하기', tip: '재능 보여주기' } },
  Virgo: { zh: { theme: '分析与服务', emotional: '追求完美，注重细节', reminder: '避免过度批评', tip: '整理环境，帮助他人' }, en: { theme: 'Analysis & Service', emotional: 'Pursuit of perfection', reminder: 'Avoid over-criticism', tip: 'Organize and help others' }, id: { theme: 'Analisis & Pelayanan', emotional: 'Kejar kesempurnaan', reminder: 'Hindari terlalu mengkritik', tip: 'Atur dan bantu orang lain' }, th: { theme: 'การวิเคราะห์และการบริการ', emotional: 'ไล่ตามความสมบูรณ์แบบ', reminder: 'หลีกเลี่ยงการวิจารณ์มากเกินไป', tip: 'จัดระเบียบและช่วยเหลือผู้อื่น' }, vi: { theme: 'Phân tích và phục vụ', emotional: 'Theo đuổi sự hoàn hảo', reminder: 'Tránh chỉ trích quá mức', tip: 'Sắp xếp và giúp đỡ ngườii khác' }, ms: { theme: 'Analisis & Perkhidmatan', emotional: 'Kejar kesempurnaan', reminder: 'Elak kritikan berlebihan', tip: 'Atur dan bantu orang lain' }, ja: { theme: '分析と奉仕', emotional: '完璧を追求', reminder: '過度な批判を避ける', tip: '整理して人を助ける' }, ko: { theme: '분석과 봉사', emotional: '완벽 추구', reminder: '과도한 비판 피하기', tip: '정리하고 타인 돕기' } },
  Libra: { zh: { theme: '和谐与关系', emotional: '追求平衡，注重人际', reminder: '避免犹豫不决', tip: '参加社交活动' }, en: { theme: 'Harmony & Relationships', emotional: 'Seek balance', reminder: 'Avoid indecision', tip: 'Social activities' }, id: { theme: 'Keseimbangan & Hubungan', emotional: 'Cari keseimbangan', reminder: 'Hindari ketidakpastian', tip: 'Aktivitas sosial' }, th: { theme: 'ความสามัคคีและความสัมพันธ์', emotional: 'แสวงหาความสมดุล', reminder: 'หลีกเลี่ยงความลังเล', tip: 'กิจกรรมทางสังคม' }, vi: { theme: 'Hài hòa và quan hệ', emotional: 'Tìm kiếm cân bằng', reminder: 'Tránh do dự', tip: 'Hoạt động xã hội' }, ms: { theme: 'Keharmonian & Hubungan', emotional: 'Cari keseimbangan', reminder: 'Elak keraguan', tip: 'Aktiviti sosial' }, ja: { theme: '調和と関係', emotional: 'バランスを求める', reminder: '優柔不断を避ける', tip: '社交活動' }, ko: { theme: '조화와 관계', emotional: '균형 추구', reminder: '우유부단 피하기', tip: '사회 활동' } },
  Scorpio: { zh: { theme: '深度与转化', emotional: '情感深刻，追求真相', reminder: '避免控制欲', tip: '进行自我反思' }, en: { theme: 'Depth & Transformation', emotional: 'Deep emotions', reminder: 'Avoid control', tip: 'Self-reflection' }, id: { theme: 'Kedalaman & Transformasi', emotional: 'Emosi mendalam', reminder: 'Hindari kontrol', tip: 'Refleksi diri' }, th: { theme: 'ความลึกซึ้งและการเปลี่ยนแปลง', emotional: 'อารมณ์ลึกซึ้ง', reminder: 'หลีกเลี่ยงการควบคุม', tip: 'การไตร่ตรองตนเอง' }, vi: { theme: 'Chiều sâu và chuyển đổi', emotional: 'Cảm xúc sâu sắc', reminder: 'Tránh kiểm soát', tip: 'Tự phản tỉnh' }, ms: { theme: 'Kedalaman & Transformasi', emotional: 'Emosi mendalam', reminder: 'Elak kawalan', tip: 'Refleksi diri' }, ja: { theme: '深さと変容', emotional: '深い感情', reminder: '支配を避ける', tip: '自己反省' }, ko: { theme: '깊이와 변화', emotional: '깊은 감정', reminder: '통제 피하기', tip: '자기 성찰' } },
  Sagittarius: { zh: { theme: '探索与扩张', emotional: '渴望自由，热爱冒险', reminder: '避免过度乐观', tip: '学习新事物，旅行' }, en: { theme: 'Exploration & Expansion', emotional: 'Desire freedom', reminder: 'Avoid over-optimism', tip: 'Learn and travel' }, id: { theme: 'Eksplorasi & Ekspansi', emotional: 'Ingin kebebasan', reminder: 'Hindari terlalu optimistis', tip: 'Belajar dan bepergian' }, th: { theme: 'การสำรวจและการขยายตัว', emotional: 'ปรารถนาอิสรภาพ', reminder: 'หลีกเลี่ยงความคิดบวกมากเกินไป', tip: 'เรียนรู้และเดินทาง' }, vi: { theme: 'Khám phá và mở rộng', emotional: 'Khao khát tự do', reminder: 'Tránh lạc quan quá mức', tip: 'Học hỏi và du lịch' }, ms: { theme: 'Eksplorasi & Pengembangan', emotional: 'Mahukan kebebasan', reminder: 'Elak terlalu optimis', tip: 'Belajar dan melancong' }, ja: { theme: '探究と拡大', emotional: '自由を渇望', reminder: '過度の楽観を避ける', tip: '学びと旅行' }, ko: { theme: '탐구와 확장', emotional: '자유 갈망', reminder: '과도한 낙관 피하기', tip: '학습과 여행' } },
  Capricorn: { zh: { theme: '责任与成就', emotional: '务实进取，追求目标', reminder: '避免过度压力', tip: '制定计划，稳步前进' }, en: { theme: 'Responsibility & Achievement', emotional: 'Ambitious', reminder: 'Avoid over-stress', tip: 'Plan and progress' }, id: { theme: 'Tanggung Jawab & Pencapaian', emotional: 'Ambitius', reminder: 'Hindari tekanan berlebih', tip: 'Rencanakan dan maju' }, th: { theme: 'ความรับผิดชอบและความสำเร็จ', emotional: 'ทะเยอทะยาน', reminder: 'หลีกเลี่ยงความเครียดมากเกินไป', tip: 'วางแผนและก้าวหน้า' }, vi: { theme: 'Trách nhiệm và thành tựu', emotional: 'Tham vọng', reminder: 'Tránh căng thẳng quá mức', tip: 'Lập kế hoạch và tiến bộ' }, ms: { theme: 'Tanggungjawab & Pencapaian', emotional: 'Ambisius', reminder: 'Elak tekanan berlebihan', tip: 'Rancang dan maju' }, ja: { theme: '責任と達成', emotional: '野心的', reminder: '過度のストレスを避ける', tip: '計画して前進' }, ko: { theme: '책임과 성취', emotional: '야심적', reminder: '과도한 스트레스 피하기', tip: '계획하고 전진' } },
  Aquarius: { zh: { theme: '创新与人道', emotional: '追求独特，关注集体', reminder: '避免疏离', tip: '参与公益，创新思维' }, en: { theme: 'Innovation & Humanity', emotional: 'Seek uniqueness', reminder: 'Avoid detachment', tip: 'Social causes' }, id: { theme: 'Inovasi & Kemanusiaan', emotional: 'Cari keunikan', reminder: 'Hindari keterpisahan', tip: 'Kontribusi sosial' }, th: { theme: 'นวัตกรรมและมนุษยธรรม', emotional: 'แสวงหาความเป็นเอกลักษณ์', reminder: 'หลีกเลี่ยงความห่างเหิน', tip: 'กิจกรรมเพื่อสังคม' }, vi: { theme: 'Đổi mới và nhân đạo', emotional: 'Tìm kiếm sự độc đáo', reminder: 'Tránh xa cách', tip: 'Hoạt động xã hội' }, ms: { theme: 'Inovasi & Kemanusiaan', emotional: 'Cari keunikan', reminder: 'Elak keterpisahan', tip: 'Kontribusi sosial' }, ja: { theme: '革新と人道', emotional: '独自性を求める', reminder: '疎外感を避ける', tip: '社会貢献' }, ko: { theme: '혁신과 인도주의', emotional: '독특함 추구', reminder: '소외감 피하기', tip: '사회 공헌' } },
  Pisces: { zh: { theme: '灵性与直觉', emotional: '敏感梦幻，富有同情心', reminder: '避免逃避现实', tip: '冥想，艺术创作' }, en: { theme: 'Spirituality & Intuition', emotional: 'Sensitive & dreamy', reminder: 'Avoid escapism', tip: 'Meditate and create' }, id: { theme: 'Spiritualitas & Intuisi', emotional: 'Sensitif & bermimpi', reminder: 'Hindari melarikan diri', tip: 'Meditasi dan cipta' }, th: { theme: 'จิตวิญญาณและสัญชาตญาณ', emotional: 'อ่อนไหวและฝัน', reminder: 'หลีกเลี่ยงการหนีความจริง', tip: 'ทำสมาธิและสร้างสรรค์' }, vi: { theme: 'Tinh thần và trực giác', emotional: 'Nhạy cảm và mơ mộng', reminder: 'Tránh trốn tránh', tip: 'Thiền và sáng tạo' }, ms: { theme: 'Kerohanian & Intuisi', emotional: 'Sensitif & berangan', reminder: 'Elak melarikan diri', tip: 'Meditasi dan cipta' }, ja: { theme: '霊性と直感', emotional: '敏感で夢見がち', reminder: '逃避を避ける', tip: '瞑想と創造' }, ko: { theme: '영성과 직관', emotional: '민감하고 몽상적', reminder: '도피 피하기', tip: '명상과 창조' } }};

const SIGN_SYMBOLS: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
  Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'};

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇'};

const ASPECT_COLORS: Record<string, string> = {
  Conjunction: '#FFD700', Sextile: '#4CAF50', Square: '#F44336', Trine: '#2196F3', Opposition: '#9C27B0'};

export default function LunarReturnPage() {
  const { language } = useLanguage();
  const lang = language || 'zh';
  const labels = LABELS[lang] || LABELS.en;

  const [form, setForm] = useState({ cityId: 'jakarta', year: 1990, month: 6, day: 15, hour: 12, minute: 0 });
  const [birthLocation, setBirthLocation] = useState({ lat: CITIES[0].lat, lng: CITIES[0].lng, tz: CITIES[0].tz, name: '' });
  const [targetYear, setTargetYear] = useState(new Date().getFullYear());
  const [targetMonth, setTargetMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState('info');

  const city = CITIES.find(c => c.id === form.cityId) || CITIES[0];
  const years = Array.from({ length: 60 }, (_, i) => new Date().getFullYear() - 30 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleCalculate = async (profileOverride: any = null, targetOverride: { year: number; month: number } | null = null) => {
    const savedBirth = profileOverride ? profileToBirthData(profileOverride) : null;
    const birthData = savedBirth || {
      year: form.year,
      month: form.month,
      day: form.day,
      hour: form.hour,
      minute: form.minute,
      lat: birthLocation.lat,
      lng: birthLocation.lng,
      tz: birthLocation.tz};
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chart/transit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lunar_return',
          birthData,
          transitDate: targetOverride || { year: targetYear, month: targetMonth },
          houseSystem: 'E'})});

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      if (!data.lunarReturn) throw new Error('No lunar return data');
      const lrDate = data.lunarReturn.date || {};

      setResult({
        lunarReturn: data.lunarReturn,
        natal: data.natal,
        lunarReturnDate: `${lrDate.year}-${String(lrDate.month).padStart(2, '0')}-${String(lrDate.day).padStart(2, '0')}`,
        lunarReturnHour: lrDate.hour});
      
      setTab('chart');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const latest = loadLatestBirthProfile();
    if (!latest) return;
    setForm({
      cityId: 'latest-profile',
      year: latest.year,
      month: latest.month,
      day: latest.day,
      hour: latest.hour,
      minute: latest.minute});
    setBirthLocation({ lat: latest.lat, lng: latest.lng, tz: latest.tz, name: latest.city || latest.name || '已保存地点' });
    handleCalculate(latest, { year: new Date().getFullYear(), month: new Date().getMonth() + 1 });
  }, []);

  const handleCityChange = (cityId: string) => {
    setForm({ ...form, cityId });
    const next = CITIES.find(c => c.id === cityId);
    if (!next) return;
    setBirthLocation({ lat: next.lat, lng: next.lng, tz: next.tz, name: next.name[lang] || next.name.en });
  };

  // 获取月返时月亮所在的星座主题
  const getMoonTheme = () => {
    if (!result?.lunarReturn?.planets?.Moon) return null;
    const moonSign = result.lunarReturn.planets.Moon.sign as keyof typeof MOON_THEMES;
    const themes = MOON_THEMES[moonSign];
    if (!themes) return null;
    return (themes as any)[lang] || themes.en;
  };

  const moonTheme = getMoonTheme();
  const natalMoonSign = result?.natal?.planets?.Moon?.sign || 'Cancer';
  const currentMoonSign = result?.lunarReturn?.planets?.Moon?.sign || 'Leo';

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      {/* Nav */}
      

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* 标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-400/20 rounded-full text-sm text-gray-600 mb-4">
            <Moon size={16} className="fill-gray-300" />
            {labels.subtitle}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{labels.title}</h1>
          <p className="text-gray-500 max-w-xl mx-auto">{labels.intro}</p>
        </div>

        {/* 输入表单 */}
        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 mb-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Star size={18} className="text-gray-400" />
            {labels.birthInfo}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {/* 城市 */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">{labels.city}</label>
              <select
                value={form.cityId}
                onChange={e => handleCityChange(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-900"
              >
                {form.cityId === 'latest-profile' && <option value="latest-profile">{birthLocation.name || '已保存地点'}</option>}
                {CITIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name[lang as keyof typeof c.name] || c.name.en}</option>
                ))}
              </select>
            </div>

            {/* 日期 */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">{labels.birthDate}</label>
              <div className="grid grid-cols-3 gap-2">
                <select value={form.year} onChange={e => setForm({ ...form, year: +e.target.value })} className="p-2 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 text-sm">
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <select value={form.month} onChange={e => setForm({ ...form, month: +e.target.value })} className="p-2 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 text-sm">
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select value={form.day} onChange={e => setForm({ ...form, day: +e.target.value })} className="p-2 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 text-sm">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* 时间 */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">{labels.hour} / {labels.minute}</label>
              <div className="grid grid-cols-2 gap-2">
                <select value={form.hour} onChange={e => setForm({ ...form, hour: +e.target.value })} className="p-2 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 text-sm">
                  {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{String(i).padStart(2, '0')}</option>)}
                </select>
                <select value={form.minute} onChange={e => setForm({ ...form, minute: +e.target.value })} className="p-2 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 text-sm">
                  {Array.from({ length: 60 }, (_, i) => <option key={i} value={i}>{String(i).padStart(2, '0')}</option>)}
                </select>
              </div>
            </div>

            {/* 目标月份 */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">{labels.targetMonth}</label>
              <div className="grid grid-cols-2 gap-2">
                <select value={targetYear} onChange={e => setTargetYear(+e.target.value)} className="p-2 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 text-sm">
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <select value={targetMonth} onChange={e => setTargetMonth(+e.target.value)} className="p-2 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 text-sm">
                  {months.map(m => <option key={m} value={m}>{m}{lang==='zh'?'月':lang==='en'?'Month':lang==='id'?'Bulan':lang==='th'?'เดือน':lang==='vi'?'Tháng':lang==='ms'?'Bulan':lang==='ja'?'月':lang==='ko'?'월':'Month'}</option>)}
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={loading}
            className="w-full mt-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 disabled:opacity-50 rounded-xl font-bold text-gray-900 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={18} className="animate-spin" />{labels.calculating}</> : <><Moon size={18} className="fill-white" />{labels.calculate}</>}
          </button>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-gray-500/10 border border-gray-500/20 text-gray-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* 结果区域 */}
        {result && (
          <>
            {/* Tab切换 */}
            <div className="flex gap-2 p-1 rounded-xl bg-gray-50 mb-6">
              {['info', 'chart', 'planets', 'aspects'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-gray-600 text-gray-900' : 'text-gray-500'}`}>
                  {labels[t as keyof typeof labels] || t}
                </button>
              ))}
            </div>

            {/* Info Tab */}
            {tab === 'info' && (
              <div className="space-y-4">
                {/* 月返信息卡片 */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-600/30 to-gray-800/30 border border-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-400/30 to-gray-600/30 flex items-center justify-center">
                      <Moon size={32} className="text-gray-600 fill-gray-300" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{labels.lunarReturnDate}</div>
                      <div className="text-xl font-bold">{result.lunarReturnDate}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gray-50">
                      <div className="text-xs text-gray-500 mb-1">{labels.natalMoon}</div>
                      <div className="text-2xl">{SIGN_SYMBOLS[natalMoonSign]}</div>
                      <div className="text-sm text-gray-600">{natalMoonSign}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50">
                      <div className="text-xs text-gray-500 mb-1">{labels.currentMoon}</div>
                      <div className="text-2xl">{SIGN_SYMBOLS[currentMoonSign]}</div>
                      <div className="text-sm text-gray-600">{currentMoonSign}</div>
                    </div>
                  </div>
                </div>

                {/* 月亮主题 */}
                {moonTheme && (
                  <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Star size={18} className="text-gray-600 fill-gray-400" />
                      {labels.monthlyTheme}
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-gray-500/10 border border-gray-500/20">
                        <div className="text-xs text-gray-600 mb-1">{labels.themes}</div>
                        <div className="text-lg font-bold text-gray-600">{moonTheme.theme}</div>
                      </div>
                      <div className="p-4 rounded-xl bg-gray-500/10 border border-gray-500/20">
                        <div className="text-xs text-gray-400 mb-1">{labels.emotional}</div>
                        <div className="text-sm text-gray-200">{moonTheme.emotional}</div>
                      </div>
                      <div className="p-4 rounded-xl bg-gray-500/10 border border-gray-500/20">
                        <div className="text-xs text-gray-400 mb-1">{labels.reminder}</div>
                        <div className="text-sm text-gray-200">{moonTheme.reminder}</div>
                      </div>
                      <div className="p-4 rounded-xl bg-gray-500/10 border border-gray-500/20">
                        <div className="text-xs text-gray-400 mb-1">{labels.tip}</div>
                        <div className="text-sm text-gray-200">{moonTheme.tip}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 什么是月返盘 */}
                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Info size={18} className="text-gray-400" />
                    {labels.info}
                  </h3>
                  <div className="text-sm text-gray-500 leading-relaxed space-y-3">
                    <p>{lang === 'zh' ? '月返盘（Lunar Return）是你出生时月亮黄道位置在宇宙中再次对齐的时刻。这个周期大约每27.3天发生一次。':lang==='id'?'Lunar Return terjadi saat posisi Bulan kembali ke posisi saat lahir. Siklus ini terjadi setiap ~27.3 hari.':lang==='th'?'Lunar Return คือแผนภูมิเมื่อดวงจันทร์กลับสู่ตำแหน่งเกิด ทุก ~27.3 วัน':lang==='vi'?'Lunar Return là biểu đồ khi Mặt Trăng trở về vị trí sinh, khoảng 27.3 ngày/lần':lang==='ms'?'Lunar Return ialah carta apabila Bulan kembali ke posisi lahir, setiap ~27.3 hari':lang==='ja'?'ルナーリターンは月が出生位置に戻る時のチャートで、約27.3日ごとに発生':lang==='ko'?'루나 리턴은 달이 출생 위치로 돌아올 때의 차트로, 약 27.3일마다 발생':'A Lunar Return chart is drawn for when the Moon returns to its natal zodiac position, occurring roughly every 27.3 days.'}</p>
                    <p>{lang === 'zh' ? '月返盘可以帮助你：':lang==='id'?'Bagan Lunar Return membantu Anda:':lang==='th'?'แผนภูมิ Lunar Return ช่วยให้คุณ:':lang==='vi'?'Biểu đồ Lunar Return giúp bạn:':lang==='ms'?'Carta Lunar Return membantu anda:':lang==='ja'?'ルナーリターンチャートの活用法:':lang==='ko'?'루나 리턴 차트의 도움:':'A Lunar Return chart helps you:'}</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>{lang === 'zh' ? '了解本月的情感能量主题':lang==='id'?'Memahami tema energi emosi bulanan':lang==='th'?'เข้าใจธีมพลังงานอารมณ์รายเดือน':lang==='vi'?'Hiểu chủ đề năng lượng cảm xúc hàng tháng':lang==='ms'?'Memahami tema tenaga emosi bulanan':lang==='ja'?'月ごとの感情エネルギーテーマを理解':lang==='ko'?'월별 감정 에너지 테마 이해':'Understand monthly emotional energy themes'}</li>
                      <li>{lang === 'zh' ? '预判何时可能遇到情感高峰':lang==='id'?'Memprediksi kapan puncak emosi':lang==='th'?'คาดการณ์ช่วงอารมณ์สูงสุด':lang==='vi'?'Dự đoán khi nào đỉnh cảm xúc xảy ra':lang==='ms'?'Meramal bila kemuncak emosi mungkin berlaku':lang==='ja'?'感情のピーク時期を予測':lang==='ko'?'감정 피크 시기 예측':'Predict when emotional peaks may occur'}</li>
                      <li>{lang === 'zh' ? '更好地把握每月能量周期':lang==='id'?'Memahami siklus energi bulanan':lang==='th'?'เข้าใจวัฏจักรพลังงานรายเดือนได้ดีขึ้น':lang==='vi'?'Điều hướng chu kỳ năng lượng hàng tháng tốt hơn':lang==='ms'?'Mengemudi kitaran tenaga bulanan dengan lebih baik':lang==='ja'?'月ごとのエネルギーサイクルをより良く把握':lang==='ko'?'월별 에너지 사이클을 더 잘 파악':'Better navigate monthly energy cycles'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Chart Tab */}
            {tab === 'chart' && (
              <ClassicReturnChart chart={result.lunarReturn} />
            )}

            {/* Planets Tab */}
            {tab === 'planets' && (
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
                <h3 className="font-bold mb-4">{labels.planets}</h3>
                <div className="space-y-2">
                  {result.lunarReturn?.planets && Object.entries(result.lunarReturn.planets).map(([key, p]: [string, any]) => {
                    if (!p?.sign) return null;
                    return (
                      <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{PLANET_SYMBOLS[key] || key[0]}</span>
                          <span className="text-gray-600">{(()=>{const names: Record<string,Record<string,string>>={Sun:{zh:"太阳",en:"Sun",id:"Matahari",th:"อาทิตย์",vi:"Mặt Trời",ms:"Matahari",ja:"太陽",ko:"태양"},Moon:{zh:"月亮",en:"Moon",id:"Bulan",th:"จันทร์",vi:"Mặt Trăng",ms:"Bulan",ja:"月",ko:"달"}};return names[key]?.[lang]||names[key]?.en||key;})()}</span>
                        </div>
                        <div className="text-right">
                          <span className="mr-2">{SIGN_SYMBOLS[p.sign]}</span>
                          <span className="text-gray-500">{p.sign_cn || p.sign}</span>
                          <span className="text-gray-400 ml-2">{Math.floor(p.degree)}°</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Aspects Tab */}
            {tab === 'aspects' && (
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
                <h3 className="font-bold mb-4">{labels.aspects}</h3>
                <div className="grid gap-2">
                  {result.lunarReturn?.aspects?.slice(0, 15).map((asp: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{PLANET_SYMBOLS[asp.planet1] || asp.planet1}</span>
                        <span style={{ color: ASPECT_COLORS[asp.aspect || asp.type] || '#888' }}>{asp.aspect || asp.type}</span>
                        <span className="text-gray-600">{PLANET_SYMBOLS[asp.planet2] || asp.planet2}</span>
                      </div>
                      <span className="text-gray-500 text-sm">{Math.abs(asp.orb).toFixed(1)}°</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
