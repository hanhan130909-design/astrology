"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen, Star, ChevronDown, ArrowLeft, Circle } from "lucide-react";

const PLANET_ICONS: Record<string, any> = {
  Sun: Circle, Moon: Circle, Mercury: Circle, Venus: Circle, Mars: Circle, 
  Jupiter: Circle, Saturn: Circle, Uranus: Circle, Neptune: Circle, Pluto: Circle,
};

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
    Pluto: { name: "冥王星", symbol: "♇", meaning: "冥王星代表转化、死亡和重生。它影响你面对深刻变化的能力和心理深层。", traits: ["转化", "力量", "深层", "神秘"], ruling: "天蝎座", day: "星期二", stone: "苏打石", color: "深紫", element: "水" },
  },
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
    Pluto: { name: "Pluto", symbol: "♇", meaning: "Pluto represents transformation, death, and rebirth. It influences your ability to face profound changes and psychological depths.", traits: ["Transformation", "Power", "Depth", "Mystery"], ruling: "Scorpio", day: "Tuesday", stone: "Sodalite", color: "Deep Purple", element: "Water" },
  },
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
    Pluto: { name: "Pluto", symbol: "♇", meaning: "Pluto mewakili transformasi, kematian, dan kelahiran kembali. Ini memengaruhi kemampuan Anda menghadapi perubahan mendalam dan kedalaman psikologis.", traits: ["Transformasi", "Kekuatan", "Kedalaman", "Misteri"], ruling: "Scorpio", day: "Selasa", stone: "Sodalit", color: "Ungu tua", element: "Air" },
  },
};

const LABELS: Record<string, Record<string, string>> = {
  zh: { title: "📚 占星学习", subtitle: "了解10大行星的奥秘", selectPlanet: "选择行星", meaning: "核心含义", traits: "核心特质", ruling: "守护星座", day: "对应星期", stone: "幸运宝石", color: "幸运颜色", element: "元素", back: "返回首页" },
  en: { title: "📚 Learn Astrology", subtitle: "Discover the secrets of 10 planets", selectPlanet: "Select Planet", meaning: "Core Meaning", traits: "Core Traits", ruling: "Ruling Sign", day: "Day", stone: "Lucky Stone", color: "Lucky Color", element: "Element", back: "Back to Home" },
  id: { title: "📚 Belajar Astrologi", subtitle: "Temukan rahasia 10 planet", selectPlanet: "Pilih Planet", meaning: "Makna Inti", traits: "Sifat Inti", ruling: "Zodiak Penguasa", day: "Hari", stone: "Batu Keberuntungan", color: "Warna Keberuntungan", element: "Elemen", back: "Kembali" },
  th: { title: "📚 เรียนดูดวง", subtitle: "ค้นพบความลับของ 10 ดาว", selectPlanet: "เลือกดาว", meaning: "ความหมายหลัก", traits: "ลักษณะ", ruling: "ราศีปกครอง", day: "วัน", stone: "อัญมณี", color: "สี", element: "ธาตุ", back: "กลับหน้าแรก" },
  vi: { title: "📚 Học Chiêm Tinh", subtitle: "Khám phá bí mật 10 hành tinh", selectPlanet: "Chọn hành tinh", meaning: "Ý nghĩa", traits: "Đặc điểm", ruling: "Cung cai quản", day: "Ngày", stone: "Đá may mắn", color: "Màu may mắn", element: "Nguyên tố", back: "Về trang chủ" },
  ms: { title: "📚 Belajar Astrologi", subtitle: "Terokai rahsia 10 planet", selectPlanet: "Pilih Planet", meaning: "Makna", traits: "Sifat", ruling: "Zodiak Penguasa", day: "Hari", stone: "Batu Bertuah", color: "Warna Bertuah", element: "Elemen", back: "Kembali" },
  ja: { title: "📚 占星術を学ぶ", subtitle: "10惑星の秘密を発見", selectPlanet: "惑星を選択", meaning: "核心意味", traits: "特徴", ruling: "支配星座", day: "曜日", stone: "幸運の石", color: "幸運の色", element: "エレメント", back: "ホームに戻る" },
  ko: { title: "📚 점성술 배우기", subtitle: "10행성의 비밀 발견", selectPlanet: "행성 선택", meaning: "핵심 의미", traits: "특성", ruling: "지배 별자리", day: "요일", stone: "행운의 돌", color: "행운의 색", element: "원소", back: "홈으로" },
};

export default function LearnPage() {
  const { language } = useLanguage();
  const lang = language || "zh";
  const labels = LABELS[lang] || LABELS.zh;

  const [selectedPlanet, setSelectedPlanet] = useState<string>("Sun");
  const [showList, setShowList] = useState(false);

  const planetInfo = PLANET_DATA[lang as keyof typeof PLANET_DATA]?.[selectedPlanet as keyof typeof PLANET_DATA.zh] || PLANET_DATA.zh[selectedPlanet as keyof typeof PLANET_DATA.zh];
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
            <span>{lang === 'zh' ? '知识库' : lang === 'id' ? 'Pustaka' : 'Knowledge Base'}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{labels.title}</h1>
          <p className="text-gray-500">{labels.subtitle}</p>
        </div>

        {/* 行星选择器 */}
        <div className="relative mb-8">
          <button
            onClick={() => setShowList(!showList)}
            className="w-full p-4 rounded-2xl bg-white/5 border border-gray-200 text-left flex items-center justify-between hover:bg-white/10 transition-all"
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
                const info = PLANET_DATA.zh[p as keyof typeof PLANET_DATA.zh];
                const Icon = PLANET_ICONS[p] || Star;
                const isActive = selectedPlanet === p;
                return (
                  <button
                    key={p}
                    onClick={() => { setSelectedPlanet(p); setShowList(false); }}
                    className={`p-3 rounded-xl text-center transition-all ${
                      isActive 
                        ? "bg-gray-100 border border-gray-300 text-gray-700" 
                        : "bg-white/5 hover:bg-white/10 text-gray-600"
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
          <div className="p-6 rounded-2xl bg-white/5 border border-gray-200">
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
            <div className="p-4 rounded-xl bg-white/5 border border-gray-200 text-center">
              <div className="text-xs text-gray-500 mb-1">{labels.ruling}</div>
              <div className="font-bold text-gray-900">{planetInfo.ruling}</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-gray-200 text-center">
              <div className="text-xs text-gray-500 mb-1">{labels.day}</div>
              <div className="font-bold text-gray-900">{planetInfo.day}</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-gray-200 text-center">
              <div className="text-xs text-gray-500 mb-1">{labels.stone}</div>
              <div className="font-bold text-gray-900 text-sm">{planetInfo.stone}</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-gray-200 text-center">
              <div className="text-xs text-gray-500 mb-1">{labels.color}</div>
              <div className="font-bold text-gray-900">{planetInfo.color}</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-gray-200 text-center">
              <div className="text-xs text-gray-500 mb-1">{labels.element}</div>
              <div className="font-bold text-gray-900">{planetInfo.element}</div>
            </div>
          </div>
        </div>

        {/* 底部导航 */}
        <div className="mt-12 text-center">
          <Link href="/horoscope" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-500 hover:to-gray-500 rounded-xl font-bold text-gray-900 transition-all">
            <Star size={18} className="fill-white" />
            {lang === 'zh' ? '查看星座运势' : lang === 'id' ? 'Lihat Horoskop' : 'View Horoscopes'}
          </Link>
        </div>
      </main>
    </div>
  );
}
