"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { 
  ArrowLeft, Users, Plus, X, ChevronRight, Heart, 
  Sparkles, GitCompare, Info
} from "lucide-react";
// ProfessionalNatalChart component available at /natal

interface PersonData {
  id: string;
  name: string;
  birthDate: string;
  birthTime: string;
  location: string;
  chartData?: {
    planets: Record<string, unknown>;
    houses: unknown[];
    aspects: unknown[];
  };
}

interface ComparisonResult {
  compatibility: number;
  elements: {
    fire: number;
    earth: number;
    air: number;
    water: number;
  };
  aspects: Array<{
    planet1: string;
    planet2: string;
    aspect: string;
    orb: number;
    meaning: string;
  }>;
  strengths: string[];
  challenges: string[];
  advice: string;
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
  zh: {
    title: "星盘对比",
    subtitle: "比较两个星盘，探索关系动态",
    addPerson: "添加人物",
    personName: "姓名",
    birthDate: "出生日期",
    birthTime: "出生时间",
    location: "出生地点",
    compare: "开始对比",
    comparing: "对比中...",
    remove: "移除",
    compatibility: "契合度",
    elements: "元素分布",
    aspects: "关键相位",
    strengths: "关系优势",
    challenges: "潜在挑战",
    advice: "相处建议",
    needTwoPeople: "请添加两个人物进行对比",
    fire: "火象",
    earth: "土象",
    air: "风象",
    water: "水象",
    synastry: "合盘分析",
    composite: "组合中点盘",
  },
  en: {
    title: "Chart Comparison",
    subtitle: "Compare two charts, explore relationship dynamics",
    addPerson: "Add Person",
    personName: "Name",
    birthDate: "Birth Date",
    birthTime: "Birth Time",
    location: "Birth Location",
    compare: "Compare",
    comparing: "Comparing...",
    remove: "Remove",
    compatibility: "Compatibility",
    elements: "Element Distribution",
    aspects: "Key Aspects",
    strengths: "Strengths",
    challenges: "Challenges",
    advice: "Advice",
    needTwoPeople: "Please add two people to compare",
    fire: "Fire",
    earth: "Earth",
    air: "Air",
    water: "Water",
    synastry: "Synastry",
    composite: "Composite",
  },
  id: {
    title: "Perbandingan Chart",
    subtitle: "Bandingkan dua chart, jelajahi dinamika hubungan",
    addPerson: "Tambah Orang",
    personName: "Nama",
    birthDate: "Tanggal Lahir",
    birthTime: "Waktu Lahir",
    location: "Lokasi Lahir",
    compare: "Bandingkan",
    comparing: "Membandingkan...",
    remove: "Hapus",
    compatibility: "Kecocokan",
    elements: "Distribusi Elemen",
    aspects: "Aspek Kunci",
    strengths: "Kekuatan",
    challenges: "Tantangan",
    advice: "Saran",
    needTwoPeople: "Silakan tambah dua orang untuk dibandingkan",
    fire: "Api",
    earth: "Tanah",
    air: "Udara",
    water: "Air",
    synastry: "Sinastri",
    composite: "Komposit",
  },
  th: {
    title: "เปรียบเทียบดวง",
    subtitle: "เปรียบเทียบสองดวง สำรวจพลังความสัมพันธ์",
    addPerson: "เพิ่มบุคคล",
    personName: "ชื่อ",
    birthDate: "วันเกิด",
    birthTime: "เวลาเกิด",
    location: "สถานที่เกิด",
    compare: "เปรียบเทียบ",
    comparing: "กำลังเปรียบเทียบ...",
    remove: "ลบ",
    compatibility: "ความเข้ากัน",
    elements: "การกระจายธาตุ",
    aspects: "มุมทรงพลัง",
    strengths: "จุดแข็ง",
    challenges: "ความท้าทาย",
    advice: "คำแนะนำ",
    needTwoPeople: "กรุณาเพิ่มสองบุคคลเพื่อเปรียบเทียบ",
    fire: "ไฟ",
    earth: "ดิน",
    air: "ลม",
    water: "น้ำ",
    synastry: "ความเข้ากัน",
    composite: "แผนภูมิคู่",
  },
  vi: {
    title: "So Sánh Bản Đồ Sao",
    subtitle: "So sánh hai bản đồ, khám phá động lực quan hệ",
    addPerson: "Thêm ngườii",
    personName: "Tên",
    birthDate: "Ngày sinh",
    birthTime: "Giờ sinh",
    location: "Nơi sinh",
    compare: "So sánh",
    comparing: "Đang so sánh...",
    remove: "Xóa",
    compatibility: "Tương hợp",
    elements: "Phân bố nguyên tố",
    aspects: "Góc độ chính",
    strengths: "Điểm mạnh",
    challenges: "Thách thức",
    advice: "Lợi khuyên",
    needTwoPeople: "Vui lòng thêm hai ngườii để so sánh",
    fire: "Hỏa",
    earth: "Thổ",
    air: "Khí",
    water: "Thủy",
    synastry: "Tương hợp",
    composite: "Bản đồ kết hợp",
  },
  ms: {
    title: "Perbandingan Carta",
    subtitle: "Bandingkan dua carta, terokai dinamik hubungan",
    addPerson: "Tambah Orang",
    personName: "Nama",
    birthDate: "Tarikh Lahir",
    birthTime: "Masa Lahir",
    location: "Lokasi Lahir",
    compare: "Bandingkan",
    comparing: "Membandingkan...",
    remove: "Buang",
    compatibility: "Keserasian",
    elements: "Taburan Elemen",
    aspects: "Aspek Utama",
    strengths: "Kekuatan",
    challenges: "Cabaran",
    advice: "Nasihat",
    needTwoPeople: "Sila tambah dua orang untuk dibandingkan",
    fire: "Api",
    earth: "Tanah",
    air: "Udara",
    water: "Air",
    synastry: "Keserasian",
    composite: "Carta Komposit",
  },
  ja: {
    title: "星盤比較",
    subtitle: "二つの星盤を比較し、関係のダイナミクスを探る",
    addPerson: "人物を追加",
    personName: "名前",
    birthDate: "生年月日",
    birthTime: "出生時間",
    location: "出生地",
    compare: "比較",
    comparing: "比較中...",
    remove: "削除",
    compatibility: "相性",
    elements: "エレメント分布",
    aspects: "主要アスペクト",
    strengths: "強み",
    challenges: "課題",
    advice: "アドバイス",
    needTwoPeople: "比較するために2人を追加してください",
    fire: "火",
    earth: "地",
    air: "風",
    water: "水",
    synastry: "シナストリー",
    composite: "コンポジット",
  },
  ko: {
    title: "차트 비교",
    subtitle: "두 차트를 비교하여 관계 역학을 탐구하세요",
    addPerson: "인물 추가",
    personName: "이름",
    birthDate: "생년월일",
    birthTime: "출생 시간",
    location: "출생지",
    compare: "비교",
    comparing: "비교 중...",
    remove: "삭제",
    compatibility: "궁합",
    elements: "원소 분포",
    aspects: "주요 애스펙트",
    strengths: "강점",
    challenges: "도전",
    advice: "조언",
    needTwoPeople: "비교를 위해 두 명을 추가하세요",
    fire: "불",
    earth: "땅",
    air: "바람",
    water: "물",
    synastry: "시나스트리",
    composite: "컴포짓",
  },
};

export default function ComparePage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  
  const [people, setPeople] = useState<PersonData[]>([
    { id: "1", name: "", birthDate: "", birthTime: "", location: "" },
    { id: "2", name: "", birthDate: "", birthTime: "", location: "" },
  ]);
  const [activeTab, setActiveTab] = useState<"synastry" | "composite">("synastry");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  const updatePerson = (id: string, field: keyof PersonData, value: string) => {
    setPeople(people.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removePerson = (id: string) => {
    if (people.length > 2) {
      setPeople(people.filter(p => p.id !== id));
    }
  };

  const addPerson = () => {
    if (people.length < 4) {
      setPeople([...people, { 
        id: Date.now().toString(), 
        name: "", 
        birthDate: "", 
        birthTime: "", 
        location: "" 
      }]);
    }
  };

  const handleCompare = async () => {
    if (people.filter(p => p.name && p.birthDate).length < 2) return;
    
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setResult({
      compatibility: 78,
      elements: { fire: 30, earth: 25, air: 25, water: 20 },
      aspects: [
        { planet1: "Sun", planet2: "Moon", aspect: "Trine", orb: 2.5, meaning: "情感和谐" },
        { planet1: "Venus", planet2: "Mars", aspect: "Conjunction", orb: 1.2, meaning: "强烈的吸引力" },
      ],
      strengths: ["情感理解力强", "价值观相似", "沟通顺畅"],
      challenges: ["偶尔固执", "需要更多独处时间"],
      advice: "尊重彼此的独立性，同时保持开放的沟通。",
    });
    setLoading(false);
  };

  const isValid = people.filter(p => p.name && p.birthDate).length >= 2;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h2>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>

        {/* Tab Switch */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("synastry")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "synastry"
                  ? "bg-purple-500/20 text-purple-700"
                  : "text-gray-400 hover:text-purple-700"
              }`}
            >
              {t.synastry}
            </button>
            <button
              onClick={() => setActiveTab("composite")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "composite"
                  ? "bg-purple-500/20 text-purple-700"
                  : "text-gray-400 hover:text-purple-700"
              }`}
            >
              {t.composite}
            </button>
          </div>
        </div>

        {/* People Forms */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {people.map((person, index) => (
            <div key={person.id} className="bg-white/5 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-900 font-medium">
                    {language === "zh" ? `人物 ${index + 1}` : language === "id" ? `Orang ${index + 1}` : `Person ${index + 1}`}
                  </span>
                </div>
                {people.length > 2 && (
                  <button
                    onClick={() => removePerson(person.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">{t.personName}</label>
                  <input
                    type="text"
                    value={person.name}
                    onChange={(e) => updatePerson(person.id, "name", e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-purple-500/50 focus:outline-none"
                    placeholder={language === "zh" ? "输入姓名" : language === "id" ? "Masukkan nama" : "Enter name"}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">{t.birthDate}</label>
                    <input
                      type="date"
                      value={person.birthDate}
                      onChange={(e) => updatePerson(person.id, "birthDate", e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-gray-200 rounded-xl text-gray-900 focus:border-purple-500/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">{t.birthTime}</label>
                    <input
                      type="time"
                      value={person.birthTime}
                      onChange={(e) => updatePerson(person.id, "birthTime", e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-gray-200 rounded-xl text-gray-900 focus:border-purple-500/50 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">{t.location}</label>
                  <input
                    type="text"
                    value={person.location}
                    onChange={(e) => updatePerson(person.id, "location", e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-purple-500/50 focus:outline-none"
                    placeholder={language === "zh" ? "城市名称" : language === "id" ? "Nama kota" : "City name"}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Person Button */}
        {people.length < 4 && (
          <div className="flex justify-center mb-8">
            <button
              onClick={addPerson}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-gray-200 rounded-xl text-gray-700 hover:bg-white/10 hover:text-purple-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              {t.addPerson}
            </button>
          </div>
        )}

        {/* Compare Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={handleCompare}
            disabled={!isValid || loading}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-gray-900 font-semibold hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t.comparing}
              </>
            ) : (
              <>
                <GitCompare className="w-5 h-5" />
                {t.compare}
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Compatibility Score */}
            <div className="bg-gradient-to-br from-purple-50/30 to-pink-900/30 rounded-2xl p-8 border border-purple-200 text-center">
              <div className="text-gray-400 mb-2">{t.compatibility}</div>
              <div className="text-6xl font-bold gradient-text mb-4">{result.compatibility}%</div>
              <div className="flex justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.floor(result.compatibility / 20)
                        ? "text-pink-500 fill-pink-500"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Elements */}
            <div className="bg-white/5 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                {t.elements}
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {Object.entries(result.elements).map(([element, value]) => (
                  <div key={element} className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{value}%</div>
                    <div className="text-sm text-gray-400">
                      {t[element as keyof typeof t]}
                    </div>
                    <div className="h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aspects */}
            <div className="bg-white/5 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.aspects}</h3>
              <div className="space-y-3">
                {result.aspects.map((aspect, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400 font-medium">{aspect.planet1}</span>
                      <span className="text-gray-500">→</span>
                      <span className="text-pink-400 font-medium">{aspect.planet2}</span>
                    </div>
                    <span className="px-2 py-1 bg-purple-500/20 rounded text-purple-700 text-sm">
                      {aspect.aspect}
                    </span>
                    <span className="text-gray-400 text-sm">±{aspect.orb}°</span>
                    <span className="text-gray-700 text-sm ml-auto">{aspect.meaning}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Challenges */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-500/10 rounded-2xl p-6 border border-green-500/20">
                <h3 className="text-lg font-semibold text-green-400 mb-4">{t.strengths}</h3>
                <ul className="space-y-2">
                  {result.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <span className="text-green-400">✓</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-500/10 rounded-2xl p-6 border border-amber-500/20">
                <h3 className="text-lg font-semibold text-amber-400 mb-4">{t.challenges}</h3>
                <ul className="space-y-2">
                  {result.challenges.map((challenge, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <span className="text-amber-400">!</span>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Advice */}
            <div className="bg-blue-500/10 rounded-2xl p-6 border border-blue-500/20">
              <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center gap-2">
                <Info className="w-5 h-5" />
                {t.advice}
              </h3>
              <p className="text-gray-700">{result.advice}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
