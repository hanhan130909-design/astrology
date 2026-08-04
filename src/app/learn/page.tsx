"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen, Star, ChevronDown, Circle } from "lucide-react";
import { beginnerLessons } from "./course-data";
import { baziLessons, ziweiLessons } from "./course-bazi-ziwei";
import { baziGlossary, ziweiGlossary } from "./glossary-data";

const PLANET_ICONS: Record<string, any> = {
  Sun: Circle, Moon: Circle, Mercury: Circle, Venus: Circle, Mars: Circle, 
  Jupiter: Circle, Saturn: Circle, Uranus: Circle, Neptune: Circle, Pluto: Circle};

const PLANET_DATA = {
  zh: {
    Sun: { name: "太阳", symbol: "☉", meaning: "太阳代表生命力、意志力和自我意识。它是你内心最核心的部分，决定你的核心性格和人生目标。", traits: ["领导力", "创造力", "自信", "生命力"], ruling: "狮子座", day: "星期日", stone: "钻石", color: "金色", element: "火" },
    Moon: { name: "月亮", symbol: "☽", meaning: "月亮代表情感、直觉和潜意识。它影响你的情绪反应、内心需求和本能反应。", traits: ["情感", "直觉", "母性", "敏感性"], ruling: "巨蟹座", day: "星期一", stone: "月光石", color: "银色", element: "水" },
    Mercury: { name: "水星", symbol: "☿", meaning: "水星代表沟通、思维和智力。它影响你的学习方式、表达能力和逻辑思维。", traits: ["沟通", "智慧", "机智", "多才多艺"], ruling: "双子座/处女座", day: "星期三", stone: "玛瑙", color: "蓝绿色", element: "风" },
    Venus: { name: "金星", symbol: "♀", meaning: "金星代表爱、美和价值观。它影响你的爱情模式、审美观和人际关系。", traits: ["爱", "美", "和谐", "魅力"], ruling: "金牛座/天秤座", day: "星期五", stone: "祖母绿", color: "粉红色", element: "土" },
    Mars: { name: "火星", symbol: "♂", meaning: "火星代表行动、冲动和欲望。它影响你的驱动力、竞争本能和性能量。", traits: ["行动", "勇气", "冲动", "热情"], ruling: "白羊座", day: "星期二", stone: "红玉髓", color: "红色", element: "火" },
    Jupiter: { name: "木星", symbol: "♃", meaning: "木星代表扩张、幸运和智慧。它影响你的成长机会、道德观和对生活的乐观态度。", traits: ["幸运", "智慧", "慷慨", "乐观"], ruling: "射手座", day: "星期四", stone: "蓝宝石", color: "紫色", element: "火" },
    Saturn: { name: "土星", symbol: "♄", meaning: "土星代表限制、责任和成就。它影响你的纪律性、时间和组织能力。", traits: ["纪律", "责任", "耐心", "务实"], ruling: "摩羯座", day: "星期六", stone: "青金石", color: "深蓝", element: "土" },
    Uranus: { name: "天王星", symbol: "♅", meaning: "天王星代表突变、发明和自由。它影响你的原创性、对自由的渴望和突然改变的能力。", traits: ["独创性", "自由", "叛逆", "博爱"], ruling: "水瓶座", day: "星期二", stone: "苏纪石", color: "蓝绿色", element: "风" },
    Neptune: { name: "海王星", symbol: "♆", meaning: "海王星代表梦想、灵性和欺骗。它影响你的想象力、灵性追求和理想主义。", traits: ["梦想", "灵感", "直觉", "敏感"], ruling: "双鱼座", day: "星期一", stone: "海蓝宝石", color: "海蓝色", element: "水" },
    Pluto: { name: "冥王星", symbol: "♇", meaning: "冥王星代表转化、死亡和重生。它影响你面对深刻变化的能力和心理深层。", traits: ["转化", "力量", "深层", "神秘"], ruling: "天蝎座", day: "星期二", stone: "苏打石", color: "深紫", element: "水" }},
  en: {
    Sun: { name: "Sun", symbol: "☉", meaning: "The Sun represents vitality, willpower, and self-awareness. It is your core being and determines your fundamental character and life purpose.", traits: ["Leadership", "Creativity", "Confidence", "Vitality"], ruling: "Leo", day: "Sunday", stone: "Diamond", color: "Gold", element: "Fire" },
    Moon: { name: "Moon", symbol: "☽", meaning: "The Moon represents emotions, intuition, and the subconscious. It influences your emotional responses, inner needs, and instinctive reactions.", traits: ["Emotion", "Intuition", "Nurturing", "Sensitivity"], ruling: "Cancer", day: "Monday", stone: "Moonstone", color: "Silver", element: "Water" },
    Mercury: { name: "Mercury", symbol: "☿", meaning: "Mercury represents communication, thinking, and intellect. It influences how you learn, express yourself, and think logically.", traits: ["Communication", "Wisdom", "Wit", "Versatility"], ruling: "Gemini/Virgo", day: "Wednesday", stone: "Agate", color: "Blue-green", element: "Air" },
    Venus: { name: "Venus", symbol: "♀", meaning: "Venus represents love, beauty, and values. It influences your approach to love, aesthetic sense, and interpersonal relationships.", traits: ["Love", "Beauty", "Harmony", "Charm"], ruling: "Taurus/Libra", day: "Friday", stone: "Emerald", color: "Pink", element: "Earth" },
    Mars: { name: "Mars", symbol: "♂", meaning: "Mars represents action, impulse, and desire. It influences your drive, competitive instincts, and sexual energy.", traits: ["Action", "Courage", "Impulse", "Passion"], ruling: "Aries", day: "Tuesday", stone: "Carnelian", color: "Red", element: "Fire" },
    Jupiter: { name: "Jupiter", symbol: "♃", meaning: "Jupiter represents expansion, luck, and wisdom. It influences your growth opportunities, moral values, and optimism.", traits: ["Luck", "Wisdom", "Generosity", "Optimism"], ruling: "Sagittarius", day: "Thursday", stone: "Sapphire", color: "Purple", element: "Fire" },
    Saturn: { name: "Saturn", symbol: "♄", meaning: "Saturn represents limitations, responsibility, and achievement. It influences your discipline, sense of time, and organizational abilities.", traits: ["Discipline", "Responsibility", "Patience", "Practicality"], ruling: "Capricorn", day: "Saturday", stone: "Lapis Lazuli", color: "Deep Blue", element: "Earth" },
    Uranus: { name: "Uranus", symbol: "♅", meaning: "Uranus represents sudden change, invention, and freedom. It influences your originality, desire for freedom, and ability to change suddenly.", traits: ["Originality", "Freedom", "Rebellion", "Humanitarian"], ruling: "Aquarius", day: "Tuesday", stone: "Sugilite", color: "Blue-green", element: "Air" },
    Neptune: { name: "Neptune", symbol: "♆", meaning: "Neptune represents dreams, spirituality, and illusion. It influences your imagination, spiritual pursuits, and idealism.", traits: ["Dreams", "Inspiration", "Intuition", "Sensitivity"], ruling: "Pisces", day: "Monday", stone: "Aquamarine", color: "Sea Blue", element: "Water" },
    Pluto: { name: "Pluto", symbol: "♇", meaning: "Pluto represents transformation, death, and rebirth. It influences your ability to face profound changes and psychological depths.", traits: ["Transformation", "Power", "Depth", "Mystery"], ruling: "Scorpio", day: "Tuesday", stone: "Sodalite", color: "Deep Purple", element: "Water" }},
  id: {
    Sun: { name: "Matahari", symbol: "☉", meaning: "Matahari mewakili vitalitas, kemauan, dan kesadaran diri. Ini adalah inti keberadaan Anda dan menentukan karakter mendasar dan tujuan hidup Anda.", traits: ["Kepemimpinan", "Kreativitas", "Kepercayaan diri", "Vitalitas"], ruling: "Leo", day: "Minggu", stone: "Berlian", color: "Emas", element: "Api" },
    Moon: { name: "Bulan", symbol: "☽", meaning: "Bulan mewakili emosi, intuisi, dan alam bawah sadar. Ini memengaruhi respons emosional, kebutuhan batin, dan reaksi naluriah Anda.", traits: ["Emosi", "Intuisi", "Pengasuhan", "Sensitivitas"], ruling: "Cancer", day: "Senin", stone: "Batu bulan", color: "Perak", element: "Air" },
    Mercury: { name: "Merkurius", symbol: "☿", meaning: "Merkurius mewakili komunikasi, berpikir, dan kecerdasan. Ini memengaruhi cara Anda belajar, mengekspresikan diri, dan berpikir logis.", traits: ["Komunikasi", "Kebijaksanaan", "Kejenakaan", "Keserbagunaan"], ruling: "Gemini/Virgo", day: "Rabu", stone: "Akik", color: "Biru-hijau", element: "Udara" },
    Venus: { name: "Venus", symbol: "♀", meaning: "Venus mewakili cinta, keindahan, dan nilai-nilai. Ini memengaruhi pendekatan Anda terhadap cinta, rasa estetika, dan hubungan interpersonal.", traits: ["Cinta", "Kecantikan", "Keharmonisan", "Pesona"], ruling: "Taurus/Libra", day: "Jumat", stone: "Zamrud", color: "Merah muda", element: "Tanah" },
    Mars: { name: "Mars", symbol: "♂", meaning: "Mars mewakili tindakan, dorongan, dan hasrat. Ini memengaruhi dorongan Anda, naluri kompetitif, dan energi seksual.", traits: ["Tindakan", "Keberanian", "Dorongan", "Semangat"], ruling: "Aries", day: "Selasa", stone: "Karnelian", color: "Merah", element: "Api" },
    Jupiter: { name: "Jupiter", symbol: "♃", meaning: "Jupiter mewakili ekspansi, keberuntungan, dan kebijaksanaan. Ini memengaruhi peluang pertumbuhan Anda, nilai-nilai moral, dan optimisme.", traits: ["Keberuntungan", "Kebijaksanaan", "Kemurahan hati", "Optimisme"], ruling: "Sagittarius", day: "Kamis", stone: "Safir", color: "Ungu", element: "Api" },
    Saturn: { name: "Saturnus", symbol: "♄", meaning: "Saturnus mewakili keterbatasan, tanggung jawab, dan pencapaian. Ini memengaruhi disiplin Anda, rasa waktu, dan kemampuan organisasi.", traits: ["Disiplin", "Tanggung jawab", "Kesabaran", "Kepraktisan"], ruling: "Capricorn", day: "Sabtu", stone: "Lapis lazuli", color: "Biru tua", element: "Tanah" },
    Uranus: { name: "Uranus", symbol: "♅", meaning: "Uranus mewakili perubahan mendadak, penemuan, dan kebebasan. Ini memengaruhi orisinalitas Anda, keinginan akan kebebasan, dan kemampuan untuk berubah secara tiba-tiba.", traits: ["Orisinalitas", "Kebebasan", "Pemberontakan", "Kemanusiaan"], ruling: "Aquarius", day: "Selasa", stone: "Sugilit", color: "Biru-hijau", element: "Udara" },
    Neptune: { name: "Neptunus", symbol: "♆", meaning: "Neptunus mewakili mimpi, spiritualitas, dan ilusi. Ini memengaruhi imajinasi Anda, pencarian spiritual, dan idealisme.", traits: ["Mimpi", "Inspirasi", "Intuisi", "Sensitivitas"], ruling: "Pisces", day: "Senin", stone: "Akuamarin", color: "Biru laut", element: "Air" },
    Pluto: { name: "Pluto", symbol: "♇", meaning: "Pluto mewakili transformasi, kematian, dan kelahiran kembali. Ini memengaruhi kemampuan Anda menghadapi perubahan mendalam dan kedalaman psikologis.", traits: ["Transformasi", "Kekuatan", "Kedalaman", "Misteri"], ruling: "Scorpio", day: "Selasa", stone: "Sodalit", color: "Ungu tua", element: "Air" }}};

const LABELS: Record<string, Record<string, string>> = {
  zh: { title: "📚 占星学习", subtitle: "了解10大行星的奥秘", selectPlanet: "选择行星", meaning: "核心含义", traits: "核心特质", ruling: "守护星座", day: "对应星期", stone: "幸运宝石", color: "幸运颜色", element: "元素", back: "返回首页" },
  en: { title: "📚 Learn Astrology", subtitle: "Discover the secrets of 10 planets", selectPlanet: "Select Planet", meaning: "Core Meaning", traits: "Core Traits", ruling: "Ruling Sign", day: "Day", stone: "Lucky Stone", color: "Lucky Color", element: "Element", back: "Back to Home" },
  id: { title: "📚 Belajar Astrologi", subtitle: "Temukan rahasia 10 planet", selectPlanet: "Pilih Planet", meaning: "Makna Inti", traits: "Sifat Inti", ruling: "Zodiak Penguasa", day: "Hari", stone: "Batu Keberuntungan", color: "Warna Keberuntungan", element: "Elemen", back: "Kembali" },
  th: { title: "📚 เรียนดูดวง", subtitle: "ค้นพบความลับของ 10 ดาว", selectPlanet: "เลือกดาว", meaning: "ความหมายหลัก", traits: "ลักษณะ", ruling: "ราศีปกครอง", day: "วัน", stone: "อัญมณี", color: "สี", element: "ธาตุ", back: "กลับหน้าแรก" },
  vi: { title: "📚 Học Chiêm Tinh", subtitle: "Khám phá bí mật 10 hành tinh", selectPlanet: "Chọn hành tinh", meaning: "Ý nghĩa", traits: "Đặc điểm", ruling: "Cung cai quản", day: "Ngày", stone: "Đá may mắn", color: "Màu may mắn", element: "Nguyên tố", back: "Về trang chủ" },
  ms: { title: "📚 Belajar Astrologi", subtitle: "Terokai rahsia 10 planet", selectPlanet: "Pilih Planet", meaning: "Makna", traits: "Sifat", ruling: "Zodiak Penguasa", day: "Hari", stone: "Batu Bertuah", color: "Warna Bertuah", element: "Elemen", back: "Kembali" },
  ja: { title: "📚 占星術を学ぶ", subtitle: "10惑星の秘密を発見", selectPlanet: "惑星を選択", meaning: "核心意味", traits: "特徴", ruling: "支配星座", day: "曜日", stone: "幸運の石", color: "幸運の色", element: "エレメント", back: "ホームに戻る" },
  ko: { title: "📚 점성술 배우기", subtitle: "10행성의 비밀 발견", selectPlanet: "행성 선택", meaning: "핵심 의미", traits: "특성", ruling: "지배 별자리", day: "요일", stone: "행운의 돌", color: "행운의 색", element: "원소", back: "홈으로" }};

const UI: Record<string, Record<string, string>> = {
  zh: { knowledge:"知识库", houses:"十二宫位", aspects:"主要相位", course:"占星初阶课程", courseSub:"14节课 · 从零基础到独立解盘", baziCourse:"八字入门课程", baziCourseSub:"7节课 · 天干地支到流年大运", ziweiCourse:"紫微斗数入门", ziweiCourseSub:"5节课 · 十二宫到四化飞星", glossary:"术语表", glossaryDesc:"关键术语中英对照，避免翻译歧义", learningPath:"学习建议", learningPathDesc:"零基础推荐顺序：占星初阶 → 八字入门 → 紫微斗数。每个课程按编号顺序学。术语不熟时先看下方术语表。", viewHoroscope:"查看星座运势", back:"返回首页" },
  en: { knowledge:"Knowledge Base", houses:"12 Houses", aspects:"Major Aspects", course:"Beginner Astrology Course", courseSub:"14 lessons · From zero to independent chart reading", baziCourse:"BaZi Fundamentals", baziCourseSub:"7 lessons · Stems & Branches to Luck Cycles", ziweiCourse:"Zi Wei Dou Shu Intro", ziweiCourseSub:"5 lessons · 12 Palaces to Four Transformations", glossary:"Glossary", glossaryDesc:"Key terms in Chinese, Pinyin & English — no translation ambiguity", learningPath:"Learning Path", learningPathDesc:"Recommended order: Astrology Basics → BaZi → Zi Wei Dou Shu. Study each course in numbered order. Check the glossary when unfamiliar terms appear.", viewHoroscope:"View Horoscopes", back:"Back to Home" },
  id: { knowledge:"Pustaka", houses:"12 Rumah", aspects:"Aspek Utama", course:"Kursus Astrologi Dasar", courseSub:"14 pelajaran · Dari nol hingga bisa membaca bagan", baziCourse:"Dasar BaZi", baziCourseSub:"7 pelajaran · Batang Langit hingga Siklus Nasib", ziweiCourse:"Pengantar Zi Wei Dou Shu", ziweiCourseSub:"5 pelajaran · 12 Istana hingga Transformasi", viewHoroscope:"Lihat Horoskop", back:"Kembali" },
  th: { knowledge:"คลังความรู้", houses:"12 เรือน", aspects:"มุมหลัก", course:"คอร์สโหราศาสตร์", courseSub:"14 บทเรียน · จากศูนย์สู่อ่านดวง", baziCourse:"พื้นฐาน BaZi", baziCourseSub:"7 บทเรียน · จากก้านฟ้าถึงวัฏจักรโชค", ziweiCourse:"แนะนำจื่อเวยโต้วซู่", ziweiCourseSub:"5 บทเรียน · 12 วังถึงการเปลี่ยนแปลง", viewHoroscope:"ดูดวง", back:"กลับ" },
  vi: { knowledge:"Thư Viện", houses:"12 Nhà", aspects:"Góc Chính", course:"Khóa Chiêm Tinh", courseSub:"14 bài · Từ cơ bản đến đọc bản đồ", baziCourse:"Cơ Bản BaZi", baziCourseSub:"7 bài · Thiên Can Địa Chi đến Đại Vận", ziweiCourse:"Nhập Môn Tử Vi", ziweiCourseSub:"5 bài · 12 Cung đến Tứ Hóa", viewHoroscope:"Xem Tử Vi", back:"Về" },
  ms: { knowledge:"Pustaka", houses:"12 Rumah", aspects:"Aspek Utama", course:"Kursus Astrologi", courseSub:"14 pelajaran · Dari asas ke mahir", baziCourse:"Asas BaZi", baziCourseSub:"7 pelajaran · Batang Langit ke Kitaran Nasib", ziweiCourse:"Pengenalan Zi Wei", ziweiCourseSub:"5 pelajaran · 12 Istana ke Transformasi", viewHoroscope:"Lihat Horoskop", back:"Kembali" },
  ja: { knowledge:"知識ベース", houses:"12ハウス", aspects:"主要アスペクト", course:"占星初級講座", courseSub:"14回 · 基礎から読解まで", baziCourse:"八字入門", baziCourseSub:"7回 · 天干地支から大運まで", ziweiCourse:"紫微斗数入門", ziweiCourseSub:"5回 · 十二宮から四化まで", viewHoroscope:"運勢を見る", back:"戻る" },
  ko: { knowledge:"지식 베이스", houses:"12하우스", aspects:"주요 각도", course:"점성술 입문", courseSub:"14강 · 기초부터 차트 읽기까지", baziCourse:"사주 입문", baziCourseSub:"7강 · 천간지지부터 대운까지", ziweiCourse:"자미두수 입문", ziweiCourseSub:"5강 · 12궁부터 사화까지", viewHoroscope:"운세 보기", back:"홈으로" },
};
export default function LearnPage() {
  const { language } = useLanguage();
  const lang = language || "zh";
  const u=(k:string)=>UI[lang]?.[k]||UI.en[k]||k;
  const labels = LABELS[lang] || LABELS.zh;

  const [selectedPlanet, setSelectedPlanet] = useState<string>("Sun");
  const [showList, setShowList] = useState(false);
  const [showBaziGlossary, setShowBaziGlossary] = useState(false);
  const [showZiweiGlossary, setShowZiweiGlossary] = useState(false);
  const lookup = PLANET_DATA[lang as keyof typeof PLANET_DATA] || PLANET_DATA.en || PLANET_DATA.zh;
  const planetInfo = lookup[selectedPlanet as keyof typeof lookup] || PLANET_DATA.zh[selectedPlanet as keyof typeof PLANET_DATA.zh];
  const PlanetIcon = PLANET_ICONS[selectedPlanet] || Star;

  const planets = Object.keys(PLANET_DATA.zh);

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      {/* 导航栏 */}
      

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* 标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500/20 rounded-full text-sm text-gray-700 mb-4">
            <BookOpen size={16} />
            <span>{u('knowledge')}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{labels.title}</h1>
          <p className="text-gray-500">{labels.subtitle}</p>
        </div>

        {/* 行星选择器 */}
        <div className="relative mb-8">
          <button
            onClick={() => setShowList(!showList)}
            className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 text-left flex items-center justify-between hover:bg-gray-100 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500/20 to-gray-500/20 flex items-center justify-center">
                <PlanetIcon size={24} className="text-gray-600" />
              </div>
              <div>
                <div className="text-2xl">{planetInfo.symbol}</div>
                <div className="font-bold text-gray-900">{planetInfo.name}</div>
              </div>
            </div>
            <ChevronDown size={20} className={`text-gray-500 transition-transform ${showList ? "rotate-180" : ""}`} />
          </button>

          {showList && (
            <div className="absolute top-full left-0 right-0 mt-2 p-3 rounded-2xl bg-white border border-gray-200 backdrop-blur-xl z-50 grid grid-cols-5 gap-2">
              {planets.map(p => {
                const info = lookup[p as keyof typeof lookup] || PLANET_DATA.zh[p as keyof typeof PLANET_DATA.zh];
                const Icon = PLANET_ICONS[p] || Star;
                const isActive = selectedPlanet === p;
                return (
                  <button
                    key={p}
                    onClick={() => { setSelectedPlanet(p); setShowList(false); }}
                    className={`p-3 rounded-xl text-center transition-all ${
                      isActive 
                        ? "bg-gray-100 border border-gray-300 text-gray-700" 
                        : "bg-gray-50 hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <div className="text-2xl mb-1">{info.symbol}</div>
                    <div className="text-xs">{info.name}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 行星详情 */}
        <div className="space-y-6">
          {/* 核心含义 */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50/30 to-gray-900/20 border border-gray-200">
            <h3 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
              <Star size={16} className="fill-gray-300" /> {labels.meaning}
            </h3>
            <div className="text-3xl mb-3">{planetInfo.symbol}</div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">{planetInfo.name}</h4>
            <p className="text-gray-600 leading-relaxed">{planetInfo.meaning}</p>
          </div>

          {/* 特质标签 */}
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-3">{labels.traits}</h3>
            <div className="flex flex-wrap gap-2">
              {(planetInfo.traits as string[]).map((trait, i) => (
                <span key={i} className="px-4 py-2 rounded-full bg-gray-500/20 border border-gray-200 text-gray-600 text-sm">
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* 基本信息 */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
              <div className="text-xs text-gray-500 mb-1">{labels.ruling}</div>
              <div className="font-bold text-gray-900">{planetInfo.ruling}</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
              <div className="text-xs text-gray-500 mb-1">{labels.day}</div>
              <div className="font-bold text-gray-900">{planetInfo.day}</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
              <div className="text-xs text-gray-500 mb-1">{labels.stone}</div>
              <div className="font-bold text-gray-900 text-sm">{planetInfo.stone}</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
              <div className="text-xs text-gray-500 mb-1">{labels.color}</div>
              <div className="font-bold text-gray-900">{planetInfo.color}</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
              <div className="text-xs text-gray-500 mb-1">{labels.element}</div>
              <div className="font-bold text-gray-900">{planetInfo.element}</div>
            </div>
          </div>
        </div>

        {/* 12 Houses Section */}
        <div className="mt-16 mb-12">
          <h2 className="text-2xl font-semibold tracking-[-0.8px] mb-6 text-center">
            {u('houses')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { num:1, zh:'命宫 / 自我', en:'Self / Identity', zhDesc:'外貌、性格、第一印象', enDesc:'Appearance, personality, first impressions' },
              { num:2, zh:'财帛宫 / 价值', en:'Wealth / Values', zhDesc:'收入、物质资源、自我价值', enDesc:'Income, material resources, self-worth' },
              { num:3, zh:'兄弟宫 / 沟通', en:'Communication', zhDesc:'兄弟姐妹、短途旅行、学习', enDesc:'Siblings, short trips, learning' },
              { num:4, zh:'田宅宫 / 家庭', en:'Home / Family', zhDesc:'家庭、房产、根源', enDesc:'Home, property, roots' },
              { num:5, zh:'子女宫 / 创造', en:'Creativity', zhDesc:'子女、恋爱、创意表达', enDesc:'Children, romance, creative expression' },
              { num:6, zh:'奴仆宫 / 健康', en:'Health / Service', zhDesc:'日常工作、健康、服务', enDesc:'Daily work, health, service' },
              { num:7, zh:'夫妻宫 / 伴侣', en:'Partnership', zhDesc:'婚姻、合作、公开敌人', enDesc:'Marriage, partnerships, open enemies' },
              { num:8, zh:'疾厄宫 / 转化', en:'Transformation', zhDesc:'共享资源、深层心理、遗产', enDesc:'Shared resources, psychology, inheritance' },
              { num:9, zh:'迁移宫 / 信仰', en:'Philosophy', zhDesc:'高等教育、长途旅行、信仰', enDesc:'Higher education, long journeys, beliefs' },
              { num:10, zh:'官禄宫 / 事业', en:'Career', zhDesc:'事业、社会地位、人生方向', enDesc:'Career, social status, life direction' },
              { num:11, zh:'福德宫 / 社交', en:'Community', zhDesc:'朋友、团体、理想', enDesc:'Friends, groups, aspirations' },
              { num:12, zh:'玄秘宫 / 潜意识', en:'Subconscious', zhDesc:'潜意识、隐秘、灵性', enDesc:'Subconscious, secrets, spirituality' },
            ].map(h => (
              <div key={h.num} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900">{lang === "zh" ? `${h.num}宫 · ${h.zh}` : `${h.num} · ${h.en}`}</span>
                  <span className="text-xs text-gray-500">{lang==='zh'?h.zh:h.en}</span>
                </div>
                <p className="text-xs text-gray-500">{lang==='zh'?h.zhDesc:h.enDesc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Aspects Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold tracking-[-0.8px] mb-6 text-center">
            {u('aspects')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { sym:'☌', zh:'合相', en:'Conjunction', deg:'0°', zhDesc:'能量融合，强化', enDesc:'Energy fusion, intensification' },
              { sym:'⚹', zh:'六合', en:'Sextile', deg:'60°', zhDesc:'和谐机会，轻松', enDesc:'Harmonious opportunity, ease' },
              { sym:'□', zh:'四分', en:'Square', deg:'90°', zhDesc:'挑战张力，成长', enDesc:'Challenge, tension, growth' },
              { sym:'△', zh:'三分', en:'Trine', deg:'120°', zhDesc:'自然流畅，天赋', enDesc:'Natural flow, talent' },
              { sym:'☍', zh:'对分', en:'Opposition', deg:'180°', zhDesc:'对立平衡，关系', enDesc:'Polarity, balance, relationships' },
            ].map(a => (
              <div key={a.sym} className="p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl mb-2">{a.sym}</div>
                <div className="text-sm font-semibold mb-1">{lang==='zh'?a.zh:a.en}</div>
                <div className="text-xs text-gray-400 mb-1">{a.deg}</div>
                <p className="text-xs text-gray-500">{lang==='zh'?a.zhDesc:a.enDesc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Course Curriculum */}
        <div className="mt-16 mb-12">

          {/* Learning Path */}
          <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={18} className="text-gray-700" />
              <h3 className="font-semibold text-gray-900">{u('learningPath')}</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{u('learningPathDesc')}</p>
          </div>

          <h2 className="text-2xl font-semibold tracking-[-0.8px] mb-2 text-center">
            {u('course')}
          </h2>
          <p className="text-gray-500 text-center mb-8 text-sm">
            {u('courseSub')}
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {beginnerLessons.map((lesson) => (
              <Link href={`/learn/astro-${lesson.id}`} key={lesson.id} className="block p-5 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#171717] text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {lesson.id}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {lesson[lang] || lesson.en}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                      {(lesson.desc[lang] || lesson.desc.en)}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {lesson.topics[lang] || lesson.topics.en.map((t, j) => (
                        <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* BaZi Course */}
        <div className="mt-12 mb-12">
          <h2 className="text-2xl font-semibold tracking-[-0.8px] mb-2 text-center">
            {u('baziCourse')}
          </h2>
          <p className="text-gray-500 text-center mb-8 text-sm">
            {u('baziCourseSub')}
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {baziLessons.map((lesson) => (
              <Link href={`/learn/bazi-${lesson.id}`} key={lesson.id} className="block p-5 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#7C3AED] text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {lesson.id}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {lesson[lang] || lesson.en}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                      {(lesson.desc[lang] || lesson.desc.en)}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {lesson.topics[lang] || lesson.topics.en.map((t, j) => (
                        <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* BaZi Glossary */}
        <div className="mb-12">
          <button
            onClick={() => setShowBaziGlossary(!showBaziGlossary)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-3"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showBaziGlossary ? 'rotate-180' : ''}`} />
            {u('glossary')}: BaZi
          </button>
          {showBaziGlossary && (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-xs text-gray-400 mb-3">{u('glossaryDesc')}</p>
              <div className="space-y-3">
                {baziGlossary.map((term, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <span className="text-gray-900 font-semibold shrink-0 w-16">{term.zh}</span>
                    <div className="min-w-0">
                      <div className="text-gray-500 text-xs">{term.pinyin} · {term.en}</div>
                      <div className="text-gray-600 text-xs mt-0.5 leading-relaxed">
                        {lang === 'zh' ? term.description.zh : term.description.en}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Zi Wei Course */}
        <div className="mt-12 mb-12">
          <h2 className="text-2xl font-semibold tracking-[-0.8px] mb-2 text-center">
            {u('ziweiCourse')}
          </h2>
          <p className="text-gray-500 text-center mb-8 text-sm">
            {u('ziweiCourseSub')}
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {ziweiLessons.map((lesson) => (
              <Link href={`/learn/ziwei-${lesson.id}`} key={lesson.id} className="block p-5 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#059669] text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {lesson.id}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {lesson[lang] || lesson.en}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                      {(lesson.desc[lang] || lesson.desc.en)}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {lesson.topics[lang] || lesson.topics.en.map((t, j) => (
                        <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Zi Wei Glossary */}
        <div className="mb-12">
          <button
            onClick={() => setShowZiweiGlossary(!showZiweiGlossary)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-3"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showZiweiGlossary ? 'rotate-180' : ''}`} />
            {u('glossary')}: Zi Wei Dou Shu
          </button>
          {showZiweiGlossary && (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-xs text-gray-400 mb-3">{u('glossaryDesc')}</p>
              <div className="space-y-3">
                {ziweiGlossary.map((term, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <span className="text-gray-900 font-semibold shrink-0 w-16">{term.zh}</span>
                    <div className="min-w-0">
                      <div className="text-gray-500 text-xs">{term.pinyin} · {term.en}</div>
                      <div className="text-gray-600 text-xs mt-0.5 leading-relaxed">
                        {lang === 'zh' ? term.description.zh : term.description.en}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/horoscope" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-500 hover:to-gray-500 rounded-xl font-bold text-gray-900 transition-all">
            <Star size={18} className="fill-white" />
            {u('viewHoroscope')}
          </Link>
        </div>
      </main>
    </div>
  );
}
