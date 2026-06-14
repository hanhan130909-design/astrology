"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen, Play, Clock, Award, ChevronRight,
  Star, CheckCircle, Lock, Users, Eye
} from "lucide-react";

// Use any type to bypass strict TypeScript checking
const LEVEL_LABELS: Record<string, Record<string, string>> = {
  zh: { beginner: "入门", intermediate: "进阶", advanced: "高级" },
  en: { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
  id: { beginner: "Pemula", intermediate: "Menengah", advanced: "Mahir" },
  th: { beginner: "ผู้เริ่มต้น", intermediate: "ระดับกลาง", advanced: "ขั้นสูง" },
  vi: { beginner: "Người mới", intermediate: "Trung cấp", advanced: "Nâng cao" },
  ms: { beginner: "Pemula", intermediate: "Sederhana", advanced: "Mahir" },
  ja: { beginner: "初心者", intermediate: "中級者", advanced: "上級者" },
  ko: { beginner: "초급", intermediate: "중급", advanced: "고급" }};

const LABELS: Record<string, Record<string, string>> = {
  zh: { title: "占星学院", subtitle: "从入门到精通，系统学习占星学", myCourses: "我的课程", allCourses: "全部课程", continueLearning: "继续学习", startCourse: "开始学习", lessons: "节课", students: "学员", hours: "小时", minutes: "分钟", inProgress: "进行中", popular: "热门课程", recommended: "为你推荐", courseContent: "课程目录" },
  en: { title: "Astrology Academy", subtitle: "Learn astrology from beginner to advanced", myCourses: "My Courses", allCourses: "All Courses", continueLearning: "Continue", startCourse: "Start", lessons: "lessons", students: "students", hours: "hours", minutes: "minutes", inProgress: "In Progress", popular: "Popular", recommended: "Recommended", courseContent: "Course Content" },
  id: { title: "Akademi Astrologi", subtitle: "Pelajari astrologi dari pemula hingga mahir", myCourses: "Kursus Saya", allCourses: "Semua Kursus", continueLearning: "Lanjutkan", startCourse: "Mulai", lessons: "pelajaran", students: "siswa", hours: "jam", minutes: "menit", inProgress: "Berlangsung", popular: "Populer", recommended: "Rekomendasi", courseContent: "Daftar Pelajaran" },
  th: { title: "สถาบันดูดวง", subtitle: "เรียนรู้ดวงชะตาจากพื้นฐานสู่ความเชี่ยวชาญ", myCourses: "คอร์สของฉัน", allCourses: "ทุกคอร์ส", continueLearning: "เรียนต่อ", startCourse: "เริ่มเรียน", lessons: "บทเรียน", students: "นักเรียน", hours: "ชั่วโมง", minutes: "นาที", inProgress: "กำลังเรียน", popular: "ยอดนิยม", recommended: "แนะนำ", courseContent: "เนื้อหาคอร์ส" },
  vi: { title: "Học Viện Chiêm Tinh", subtitle: "Học chiêm tinh từ cơ bản đến nâng cao", myCourses: "Khóa của tôi", allCourses: "Tất cả khóa", continueLearning: "Tiếp tục", startCourse: "Bắt đầu", lessons: "bài", students: "học viên", hours: "giờ", minutes: "phút", inProgress: "Đang học", popular: "Phổ biến", recommended: "Đề xuất", courseContent: "Nội dung khóa" },
  ms: { title: "Akademi Astrologi", subtitle: "Pelajari astrologi dari pemula hingga mahir", myCourses: "Kursus Saya", allCourses: "Semua Kursus", continueLearning: "Teruskan", startCourse: "Mula", lessons: "pelajaran", students: "pelajar", hours: "jam", minutes: "minit", inProgress: "Sedang Berlangsung", popular: "Popular", recommended: "Disyorkan", courseContent: "Kandungan Kursus" },
  ja: { title: "占星アカデミー", subtitle: "占星術を基礎から学ぶ", myCourses: "マイコース", allCourses: "全コース", continueLearning: "続ける", startCourse: "始める", lessons: "レッスン", students: "生徒", hours: "時間", minutes: "分", inProgress: "進行中", popular: "人気", recommended: "おすすめ", courseContent: "コース内容" },
  ko: { title: "점성 아카데미", subtitle: "점성술을 기초부터 배워보세요", myCourses: "내 강좌", allCourses: "전체 강좌", continueLearning: "계속하기", startCourse: "시작하기", lessons: "레슨", students: "학생", hours: "시간", minutes: "분", inProgress: "진행 중", popular: "인기", recommended: "추천", courseContent: "강좌 내용" }};

// Course data with full 8-language support
interface CourseData {
  id: string;
  title: Record<string, string>;
  desc: Record<string, string>;
  level: string;
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  progress: number;
  thumbnail: string;
  instructor: Record<string, string>;
}

const COURSES: CourseData[] = [
  { 
    id: "1", 
    title: { zh: "占星学入门", en: "Astrology Basics", id: "Dasar Astrologi", th: "พื้นฐานโหราศาสตร์", vi: "Cơ Bản Chiêm Tinh", ms: "Asas Astrologi", ja: "占星術の基礎", ko: "점성술 기초" },
    desc: { zh: "从零开始学习占星学基础，了解十二星座、行星和宫位的含义", en: "Learn astrology basics from scratch, understand the meaning of 12 zodiac signs, planets and houses", id: "Pelajari dasar astrologi dari awal, pahami arti 12 zodiak, planet dan rumah", th: "เรียนรู้พื้นฐานโหราศาสตร์ตั้งแต่เริ่มต้น เข้าใจความหมายของ 12 ราศี ดาวเคราะห์ และบ้าน", vi: "Học cơ bản chiêm tinh từ đầu, hiểu ý nghĩa của 12 cung hoàng đạo, hành tinh và cung", ms: "Pelajari asas astrologi dari awal, fahami maksud 12 zodiak, planet dan rumah", ja: "占星術の基礎をゼロから学び、12星座、惑星、星宮の意味を理解する", ko: "점성술의 기초를 처음부터 배우고, 12별자리, 행성,宫的 의미를 이해한다" },
    level: "beginner", duration: "6", lessons: 24, students: 12580, rating: 4.9, progress: 45, thumbnail: "🌟",
    instructor: { zh: "星象大师", en: "Star Master", id: "Guru Bintang", th: "อาจารย์ดวงดาว", vi: "Đại Sư Sao", ms: "Cikgu Bintang", ja: "星の師匠", ko: "별의 스승" }
  },
  { 
    id: "2", 
    title: { zh: "本命盘解读精通", en: "Natal Chart Mastery", id: "Keahlian Bagan Lahir", th: "เชี่ยวชาญแผนภูมิเกิด", vi: "Thành Thạo Bản Đồ Sinh", ms: "Penguasaan Carta Lahir", ja: "出生チャート習得", ko: "생성 차트 마스터" },
    desc: { zh: "深入学习本命盘解读技巧，掌握行星、星座、宫位的综合分析", en: "Deep learning of natal chart interpretation techniques, master comprehensive analysis of planets, signs and houses", id: "Pembelajaran mendalam teknik tafsir bagan natal, kuasai analisis komprehensif planet, tanda dan rumah", th: "การเรียนรู้เชิงลึกเทคนิคการตีความแผนภูมิเกิด เชี่ยวชาญการวิเคราะห์แบบองค์รวมของดาวเคราะห์ ราศี และบ้าน", vi: "Học sâu kỹ thuật giải đoán bản đồ sinh, làm chủ phân tích toàn diện về hành tinh, cung hoàng đạo và cung", ms: "Pembelajaran mendalam teknik tafsiran carta natal, kuasai analisis komprehensif planet, tanda dan rumah", ja: "出生チャート解読テクニックを深く学び、惑星、星座、星宮の包括的分析をマスターする", ko: "생성 차트 해독 기술을 깊이 배우고, 행성, 별자리,宫의 종합 분석을 익힌다" },
    level: "intermediate", duration: "12", lessons: 48, students: 8932, rating: 4.8, progress: 0, thumbnail: "📊",
    instructor: { zh: "占星导师", en: "Astrology Mentor", id: "Pembimbing Astrologi", th: "ที่ปรึกษาโหราศาสตร์", vi: "Giáo Sư Chiêm Tinh", ms: "Mentor Astrologi", ja: "占星術メンター", ko: "점성술 멘토" }
  },
  { 
    id: "3", 
    title: { zh: "预测占星学", en: "Predictive Astrology", id: "Astrologi Prediktif", th: "โหราศาสตร์คาดการณ์", vi: "Chiêm Tinh Dự Đoán", ms: "Astrologi Prediktif", ja: "予測占星術", ko: "예측 점성술" },
    desc: { zh: "学习行运、推运和太阳弧等预测技巧，预知未来运势变化", en: "Learn transit, progression and solar arc prediction techniques to foresee fortune changes", id: "Pelajari teknik ramalan transit, progresi dan busur solar untuk meramalkan perubahan keberuntungan", th: "เรียนรู้เทคนิคการคาดการณ์การเคลื่อนที่ การดำเนินไป และส่วนโค้งอาทิตย์เพื่อคาดการณ์การเปลี่ยนแปลงของโชคชะตา", vi: "Học kỹ thuật dự đoán di chuyển, tiến triển và cung mặt trời để dự đoán những thay đổi vận mệnh", ms: "Pelajari teknik ramalan transit, progresi dan lengkung solar untuk meramalkan perubahan nasib", ja: "運行、推運、太陽弧などの予測技術を学び、運勢の変化を予見する", ko: "이행, 진행, 솔라아크 등의 예측 기술을 배우고, 운세 변화를 예측한다" },
    level: "advanced", duration: "18", lessons: 72, students: 5621, rating: 4.9, progress: 0, thumbnail: "🔮",
    instructor: { zh: "预测专家", en: "Prediction Expert", id: "Pakar Prediksi", th: "ผู้เชี่ยวชาญการคาดการณ์", vi: "Chuyên Gia Dự Đoán", ms: "Pakar Ramalan", ja: "予測の第一人者", ko: "예측 전문가" }
  },
  { 
    id: "4", 
    title: { zh: "合盘与关系占星", en: "Relationship Astrology", id: "Astrologi Hubungan", th: "โหราศาสตร์ความสัมพันธ์", vi: "Chiêm Tinh Mối Quan Hệ", ms: "Astrologi Hubungan", ja: "関係占星術", ko: "관계 점성술" },
    desc: { zh: "探索人际关系的占星密码，分析合盘中的相容性和互动模式", en: "Explore astrological codes of relationships, analyze compatibility and interaction patterns in synastry", id: "Jelajahi kode astrologi hubungan, analisis kecocokan dan pola interaksi dalam sintri", th: "สำรวจรหัสโหราศาสตร์ของความสัมพันธ์ วิเคราะห์ความเข้ากันได้และรูปแบบปฏิสัมพันธ์ในซินแนสตรี", vi: "Khám phá mật mã chiêm tinh của các mối quan hệ, phân tích sự tương thích và mô hình tương tác trong tổng hợp", ms: "Terokai kod astrologi hubungan, analisis keserasian dan corak interaksi dalam sintri", ja: "人間関係の占星的コードを探索し、合盤での相性とインタラクションパターンを分析する", ko: "관계의 점성학적 비밀을 탐색하고, 합반에서의 궁합과 상호작용 패턴을 분석한다" },
    level: "intermediate", duration: "10", lessons: 40, students: 7234, rating: 4.7, progress: 20, thumbnail: "💕",
    instructor: { zh: "关系导师", en: "Relationship Mentor", id: "Pembimbing Hubungan", th: "ที่ปรึกษาความสัมพันธ์", vi: "Giáo Sư Quan Hệ", ms: "Mentor Hubungan", ja: "関係のメンター", ko: "관계 멘토" }
  },
  { 
    id: "5", 
    title: { zh: "塔罗与占星结合", en: "Tarot & Astrology", id: "Tarot & Astrologi", th: "ไพ่ทาโรต์และโหราศาสตร์", vi: "Tarot Và Chiêm Tinh", ms: "Tarot & Astrologi", ja: "タロットと占星術", ko: "타로와 점성술" },
    desc: { zh: "将塔罗牌与占星学结合，通过牌阵解读更深层的宇宙信息", en: "Combine tarot cards with astrology to interpret deeper cosmic information through card spreads", id: "Gabungkan kad tarot dengan astrologi untuk mentafsir maklumat kosmik yang lebih mendalam melalui spread kad", th: "รวมไพ่ทาโรต์กับโหราศาสตร์เพื่อตีความข้อมูลจักรวาลที่ลึกซึ้งยิ่งขึ้นผ่านการจัดวางไพ่", vi: "Kết hợp bài tarot với chiêm tinh học để giải đoán thông tin vũ trụ sâu hơn thông qua các spread bài", ms: "Gabungkan kad tarot dengan astrologi untuk mentafsir maklumat kosmik yang lebih mendalam melalui spread kad", ja: "タロットカードと占星術を組み合わせ、Spreadでより深い宇宙情報を解読する", ko: "타로 카드와 점성술을 결합하여, 스프레드를 통해 더 깊은 우주 정보를 해독한다" },
    level: "beginner", duration: "8", lessons: 32, students: 9876, rating: 4.8, progress: 0, thumbnail: "🎴",
    instructor: { zh: "塔罗大师", en: "Tarot Master", id: "Guru Tarot", th: "อาจารย์ไพ่ทาโรต์", vi: "Đại Sư Tarot", ms: "Cikgu Tarot", ja: "タロットの師匠", ko: "타로의 스승" }
  },
  { 
    id: "6", 
    title: { zh: "医疗占星学", en: "Medical Astrology", id: "Astrologi Medis", th: "โหราศาสตร์ทางการแพทย์", vi: "Chiêm Tinh Y Học", ms: "Astrologi Perubatan", ja: "医療占星術", ko: "의료 점성술" },
    desc: { zh: "了解占星学与健康的关系，通过星盘了解个人体质和养生建议", en: "Understand the relationship between astrology and health, learn personal constitution and health tips from charts", id: "Pahami hubungan antara astrologi dan kesihatan, ketahui kontitusi peribadi dan tips kesihatan dari carta", th: "เข้าใจความสัมพันธ์ระหว่างโหราศาสตร์และสุขภาพ รู้จักระบบร่างกายส่วนบุคคลและเคล็ดลับสุขภาพจากแผนภูมิ", vi: "Hiểu mối quan hệ giữa chiêm tinh và sức khỏe, tìm hiểu thể trạng cá nhân và lời khuyên chăm sóc sức khỏe từ bản đồ", ms: "Fahami hubungan antara astrologi dan kesihatan, ketahui kontitusi peribadi dan tips kesihatan dari carta", ja: "占星術と健康の関係を理解し、チャートから個人の体質と健康管理のヒントを学ぶ", ko: "점성술과 건강의 관계를 이해하고, 차트에서 개인 체질과 건강 관리 조언을 배운다" },
    level: "advanced", duration: "15", lessons: 60, students: 3456, rating: 4.9, progress: 0, thumbnail: "🏥",
    instructor: { zh: "健康顾问", en: "Health Consultant", id: "Konsultan Kesihatan", th: "ที่ปรึกษาสุขภาพ", vi: "Tư Vấn Sức Khỏe", ms: "Penasihat Kesihatan", ja: "健康コンサルタント", ko: "건강 컨설턴트" }
  },
];

// Lesson data with full 8-language support
interface LessonData {
  id: string;
  title: Record<string, string>;
  duration: string;
  completed: boolean;
  locked: boolean;
}

const LESSONS: LessonData[] = [
  { id: "1", title: { zh: "占星学简介", en: "Introduction to Astrology", id: "Pengenalan Astrologi", th: "บทนำโหราศาสตร์", vi: "Giới Thiệu Chiêm Tinh", ms: "Pengenalan Astrologi", ja: "占星術入門", ko: "점성술 소개" }, duration: "15", completed: true, locked: false },
  { id: "2", title: { zh: "十二星座概述", en: "Overview of 12 Zodiac Signs", id: "Gambaran 12 Zodiak", th: "ภาพรวม 12 ราศี", vi: "Tổng Quan 12 Cung Hoàng Đạo", ms: "Gambaran 12 Zodiak", ja: "12星座の概要", ko: "12별자리 개요" }, duration: "25", completed: true, locked: false },
  { id: "3", title: { zh: "火象星座详解", en: "Fire Signs Deep Dive", id: "Zodiak Api", th: "ราศีธาตุไฟ", vi: "Cung Hỏa", ms: "Zodiak Api", ja: "火象星座详解", ko: "화염자리 상세" }, duration: "30", completed: false, locked: false },
  { id: "4", title: { zh: "土象星座详解", en: "Earth Signs Deep Dive", id: "Zodiak Tanah", th: "ราศีธาตุดิน", vi: "Cung Thổ", ms: "Zodiak Tanah", ja: "土象星座详解", ko: "토양자리 상세" }, duration: "30", completed: false, locked: true },
  { id: "5", title: { zh: "风象星座详解", en: "Air Signs Deep Dive", id: "Zodiak Udara", th: "ราศีธาตุลม", vi: "Cung Phong", ms: "Zodiak Udara", ja: "風象星座详解", ko: "공기자리 상세" }, duration: "30", completed: false, locked: true },
  { id: "6", title: { zh: "水象星座详解", en: "Water Signs Deep Dive", id: "Zodiak Air", th: "ราศีธาตุน้ำ", vi: "Cung Thủy", ms: "Zodiak Air", ja: "水象星座详解", ko: "물자리 상세" }, duration: "30", completed: false, locked: true },
  { id: "7", title: { zh: "十大行星含义", en: "Meaning of 10 Planets", id: "Makna 10 Planet", th: "ความหมายของดาวเคราะห์ 10 ดวง", vi: "Ý Nghĩa 10 Hành Tinh", ms: "Makna 10 Planet", ja: "10惑星の意味", ko: "10행성의 의미" }, duration: "35", completed: false, locked: true },
  { id: "8", title: { zh: "十二宫位解析", en: "Analysis of 12 Houses", id: "Analisis 12 Rumah", th: "การวิเคราะห์ 12 บ้าน", vi: "Phân Tích 12 Cung", ms: "Analisis 12 Rumah", ja: "12宫位解析", ko: "12궁 분석" }, duration: "40", completed: false, locked: true },
];

// Localization helpers
function getLocalizedText(obj: Record<string, string>, lang: string, fallback: string = ""): string {
  return obj?.[lang] || obj?.zh || Object.values(obj)?.[0] || fallback;
}

function getLocalizedCourse(course: CourseData, lang: string) {
  return { 
    title: getLocalizedText(course.title, lang, "Untitled Course"), 
    desc: getLocalizedText(course.desc, lang, ""),
    instructor: getLocalizedText(course.instructor, lang, "Instructor")
  };
}

function getLocalizedLesson(lesson: LessonData, lang: string) {
  return getLocalizedText(lesson.title, lang, "Untitled Lesson");
}

function getLevelColor(level: string) {
  switch (level) {
    case "beginner": return "bg-gray-500/20 text-gray-400";
    case "intermediate": return "bg-gray-500/20 text-gray-600";
    case "advanced": return "bg-gray-500/20 text-gray-400";
    default: return "bg-gray-500/20 text-gray-400";
  }
}

export default function AcademyPage() {
  const { language } = useLanguage();
  const t = LABELS[language] || LABELS.zh;
  const levelLabels = LEVEL_LABELS[language] || LEVEL_LABELS.zh;
  const [activeTab, setActiveTab] = useState<"my" | "all">("my");
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [filterLevel, setFilterLevel] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");

  const filteredCourses = filterLevel === "all" ? COURSES : COURSES.filter(c => c.level === filterLevel);
  const myCourses = COURSES.filter(c => c.progress > 0);

  if (selectedCourse) {
    const courseInfo = getLocalizedCourse(selectedCourse, language);
    return (
      <div className="min-h-screen bg-white">
        

        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-gradient-to-br from-gray-50/30 to-gray-900/30 rounded-2xl p-6 border border-gray-200 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-4xl">{selectedCourse.thumbnail}</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{courseInfo.title}</h2>
                <p className="text-gray-400 text-sm mb-3">{courseInfo.desc}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className={`px-2 py-1 rounded-full ${getLevelColor(selectedCourse.level)}`}>{levelLabels[selectedCourse.level as keyof typeof levelLabels] || levelLabels.beginner}</span>
                  <span className="text-gray-400">{courseInfo.instructor}</span>
                  <span className="flex items-center gap-1 text-gray-600"><Star className="w-4 h-4 fill-current" />{selectedCourse.rating}</span>
                </div>
              </div>
            </div>
          </div>

          {selectedCourse.progress > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">{t.inProgress}</span>
                <span className="text-gray-900 font-medium">{selectedCourse.progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gray-500 to-gray-500 rounded-full" style={{ width: `${selectedCourse.progress}%` }} />
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.courseContent}</h3>
            <div className="space-y-3">
              {LESSONS.map((lesson, idx) => (
                <div key={lesson.id} className={`flex items-center gap-4 p-4 rounded-xl border ${lesson.locked ? "bg-gray-50 border-gray-200 opacity-60" : "bg-gray-50 border-gray-200 hover:border-gray-200"}`}>
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-400">
                    {lesson.completed ? <CheckCircle className="w-5 h-5 text-gray-400" /> : lesson.locked ? <Lock className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-900">{getLocalizedLesson(lesson, language)}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1"><Play className="w-3 h-3" />{lesson.duration} {t.minutes}</div>
                  </div>
                  {!lesson.locked && !lesson.completed && (
                    <button className="px-4 py-2 bg-white0/20 text-gray-700 rounded-lg text-sm hover:bg-gray-500/30" style={{boxShadow:"0px 0px 0px 1px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.04)"}}>{t.continueLearning}</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h2>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-50 rounded-xl p-1">
            <button onClick={() => setActiveTab("my")} className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "my" ? "bg-gray-500/20 text-gray-700" : "text-gray-400 hover:text-gray-700"}`}>{t.myCourses}</button>
            <button onClick={() => setActiveTab("all")} className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "all" ? "bg-gray-500/20 text-gray-700" : "text-gray-400 hover:text-gray-700"}`}>{t.allCourses}</button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button onClick={() => setFilterLevel("all")} className={`px-4 py-2 rounded-full text-sm transition-all ${filterLevel === "all" ? "bg-gray-500/20 text-gray-700 border border-gray-200" : "bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100"}`}>{language === "zh" ? "全部" : language === "id" ? "Semua" : "All"}</button>
          <button onClick={() => setFilterLevel("beginner")} className={`px-4 py-2 rounded-full text-sm transition-all ${filterLevel === "beginner" ? "bg-gray-500/20 text-gray-700 border border-gray-200" : "bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100"}`}>{levelLabels.beginner}</button>
          <button onClick={() => setFilterLevel("intermediate")} className={`px-4 py-2 rounded-full text-sm transition-all ${filterLevel === "intermediate" ? "bg-gray-500/20 text-gray-700 border border-gray-200" : "bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100"}`}>{levelLabels.intermediate}</button>
          <button onClick={() => setFilterLevel("advanced")} className={`px-4 py-2 rounded-full text-sm transition-all ${filterLevel === "advanced" ? "bg-gray-500/20 text-gray-700 border border-gray-200" : "bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100"}`}>{levelLabels.advanced}</button>
        </div>

        {activeTab === "my" && myCourses.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Eye className="w-5 h-5 text-gray-400" />{t.myCourses}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myCourses.map((course) => {
                const info = getLocalizedCourse(course, language);
                return (
                  <div key={course.id} onClick={() => setSelectedCourse(course)} className="cursor-pointer bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-200 transition-all">
                    <div className="aspect-video bg-gradient-to-br from-gray-50/50 to-gray-900/50 flex items-center justify-center text-6xl">{course.thumbnail}</div>
                    <div className="p-5">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{info.title}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm"><span className="text-gray-400">{t.inProgress}</span><span className="text-gray-900">{course.progress}%</span></div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-gray-500 to-gray-500 rounded-full" style={{ width: `${course.progress}%` }} /></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.allCourses}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => {
              const info = getLocalizedCourse(course, language);
              return (
                <div key={course.id} onClick={() => setSelectedCourse(course)} className="cursor-pointer bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-200 transition-all">
                  <div className="aspect-video bg-gradient-to-br from-gray-50/50 to-gray-900/50 flex items-center justify-center text-6xl">{course.thumbnail}</div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(course.level)}`}>{levelLabels[course.level as keyof typeof levelLabels]}</span>
                      <div className="flex items-center gap-1 text-gray-600 text-sm"><Star className="w-4 h-4 fill-current" />{course.rating}</div>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{info.title}</h4>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{info.desc}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{course.lessons} {t.lessons}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{course.duration} {t.hours}</span>
                      <span className="flex items-center gap-1"><Users className="w-4 h-4" />{course.students > 1000 ? `${(course.students / 1000).toFixed(1)}k` : course.students}</span>
                    </div>
                    {course.progress > 0 && (
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm"><span className="text-gray-400">{t.inProgress}</span><span className="text-gray-900">{course.progress}%</span></div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-gray-500 to-gray-500 rounded-full" style={{ width: `${course.progress}%` }} /></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
