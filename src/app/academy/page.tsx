"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { 
  ArrowLeft, BookOpen, Play, Clock, Award, ChevronRight,
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
  ko: { beginner: "초급", intermediate: "중급", advanced: "고급" },
};

const LABELS: Record<string, Record<string, string>> = {
  zh: { title: "占星学院", subtitle: "从入门到精通，系统学习占星学", myCourses: "我的课程", allCourses: "全部课程", continueLearning: "继续学习", startCourse: "开始学习", lessons: "节课", students: "学员", hours: "小时", minutes: "分钟", inProgress: "进行中", popular: "热门课程", recommended: "为你推荐", courseContent: "课程目录" },
  en: { title: "Astrology Academy", subtitle: "Learn astrology from beginner to advanced", myCourses: "My Courses", allCourses: "All Courses", continueLearning: "Continue", startCourse: "Start", lessons: "lessons", students: "students", hours: "hours", minutes: "minutes", inProgress: "In Progress", popular: "Popular", recommended: "Recommended", courseContent: "Course Content" },
  id: { title: "Akademi Astrologi", subtitle: "Pelajari astrologi dari pemula hingga mahir", myCourses: "Kursus Saya", allCourses: "Semua Kursus", continueLearning: "Lanjutkan", startCourse: "Mulai", lessons: "pelajaran", students: "siswa", hours: "jam", minutes: "menit", inProgress: "Berlangsung", popular: "Populer", recommended: "Rekomendasi", courseContent: "Daftar Pelajaran" },
  th: { title: "สถาบันดูดวง", subtitle: "เรียนรู้ดวงชะตาจากพื้นฐานสู่ความเชี่ยวชาญ", myCourses: "คอร์สของฉัน", allCourses: "ทุกคอร์ส", continueLearning: "เรียนต่อ", startCourse: "เริ่มเรียน", lessons: "บทเรียน", students: "นักเรียน", hours: "ชั่วโมง", minutes: "นาที", inProgress: "กำลังเรียน", popular: "ยอดนิยม", recommended: "แนะนำ", courseContent: "เนื้อหาคอร์ส" },
  vi: { title: "Học Viện Chiêm Tinh", subtitle: "Học chiêm tinh từ cơ bản đến nâng cao", myCourses: "Khóa của tôi", allCourses: "Tất cả khóa", continueLearning: "Tiếp tục", startCourse: "Bắt đầu", lessons: "bài", students: "học viên", hours: "giờ", minutes: "phút", inProgress: "Đang học", popular: "Phổ biến", recommended: "Đề xuất", courseContent: "Nội dung khóa" },
  ms: { title: "Akademi Astrologi", subtitle: "Pelajari astrologi dari pemula hingga mahir", myCourses: "Kursus Saya", allCourses: "Semua Kursus", continueLearning: "Teruskan", startCourse: "Mula", lessons: "pelajaran", students: "pelajar", hours: "jam", minutes: "minit", inProgress: "Sedang Berlangsung", popular: "Popular", recommended: "Disyorkan", courseContent: "Kandungan Kursus" },
  ja: { title: "占星アカデミー", subtitle: "占星術を基礎から学ぶ", myCourses: "マイコース", allCourses: "全コース", continueLearning: "続ける", startCourse: "始める", lessons: "レッスン", students: "生徒", hours: "時間", minutes: "分", inProgress: "進行中", popular: "人気", recommended: "おすすめ", courseContent: "コース内容" },
  ko: { title: "점성 아카데미", subtitle: "점성술을 기초부터 배워보세요", myCourses: "내 강좌", allCourses: "전체 강좌", continueLearning: "계속하기", startCourse: "시작하기", lessons: "레슨", students: "학생", hours: "시간", minutes: "분", inProgress: "진행 중", popular: "인기", recommended: "추천", courseContent: "강좌 내용" },
};

const COURSES = [
  { id: "1", title: "占星学入门", desc: "从零开始学习占星学基础，了解十二星座、行星和宫位的含义", level: "beginner", duration: "6", lessons: 24, students: 12580, rating: 4.9, progress: 45, thumbnail: "🌟", instructor: "星象大师" },
  { id: "2", title: "本命盘解读精通", desc: "深入学习本命盘解读技巧", level: "intermediate", duration: "12", lessons: 48, students: 8932, rating: 4.8, progress: 0, thumbnail: "📊", instructor: "占星导师" },
  { id: "3", title: "预测占星学", desc: "学习行运、推运和太阳弧等预测技巧", level: "advanced", duration: "18", lessons: 72, students: 5621, rating: 4.9, progress: 0, thumbnail: "🔮", instructor: "预测专家" },
  { id: "4", title: "合盘与关系占星", desc: "探索人际关系的占星密码", level: "intermediate", duration: "10", lessons: 40, students: 7234, rating: 4.7, progress: 20, thumbnail: "💕", instructor: "关系导师" },
  { id: "5", title: "塔罗与占星结合", desc: "将塔罗牌与占星学结合", level: "beginner", duration: "8", lessons: 32, students: 9876, rating: 4.8, progress: 0, thumbnail: "🎴", instructor: "塔罗大师" },
  { id: "6", title: "医疗占星学", desc: "了解占星学与健康的关系", level: "advanced", duration: "15", lessons: 60, students: 3456, rating: 4.9, progress: 0, thumbnail: "🏥", instructor: "健康顾问" },
];

const LESSONS = [
  { id: "1", title: "占星学简介", duration: "15", completed: true, locked: false },
  { id: "2", title: "十二星座概述", duration: "25", completed: true, locked: false },
  { id: "3", title: "火象星座详解", duration: "30", completed: false, locked: false },
  { id: "4", title: "土象星座详解", duration: "30", completed: false, locked: true },
  { id: "5", title: "风象星座详解", duration: "30", completed: false, locked: true },
  { id: "6", title: "水象星座详解", duration: "30", completed: false, locked: true },
];

// Simple localization - all content in Chinese for now, can be expanded later
function getLocalizedCourse(course: typeof COURSES[0], lang: string) {
  return { title: course.title, desc: course.desc };
}

function getLocalizedLesson(lesson: typeof LESSONS[0], lang: string) {
  return lesson.title;
}

function getLevelColor(level: string) {
  switch (level) {
    case "beginner": return "bg-green-500/20 text-green-400";
    case "intermediate": return "bg-amber-500/20 text-amber-400";
    case "advanced": return "bg-red-500/20 text-red-400";
    default: return "bg-gray-500/20 text-gray-400";
  }
}

export default function AcademyPage() {
  const { language } = useLanguage();
  const t = LABELS[language];
  const levelLabels = LEVEL_LABELS[language];
  const [activeTab, setActiveTab] = useState<"my" | "all">("my");
  const [selectedCourse, setSelectedCourse] = useState<typeof COURSES[0] | null>(null);
  const [filterLevel, setFilterLevel] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");

  const filteredCourses = filterLevel === "all" ? COURSES : COURSES.filter(c => c.level === filterLevel);
  const myCourses = COURSES.filter(c => c.progress > 0);

  if (selectedCourse) {
    const courseInfo = getLocalizedCourse(selectedCourse, language);
    return (
      <div className="min-h-screen bg-[#030014]">
        <header className="sticky top-0 z-50 bg-[#030014]/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSelectedCourse(null)} className="flex items-center gap-2 text-gray-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-bold text-white truncate">{courseInfo.title}</h1>
            </div>
            <LanguageSwitcher />
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/20 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center text-4xl">{selectedCourse.thumbnail}</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-2">{courseInfo.title}</h2>
                <p className="text-gray-400 text-sm mb-3">{courseInfo.desc}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className={`px-2 py-1 rounded-full ${getLevelColor(selectedCourse.level)}`}>{levelLabels[selectedCourse.level] || levelLabels['beginner']}</span>
                  <span className="text-gray-400">{selectedCourse.instructor}</span>
                  <span className="flex items-center gap-1 text-amber-400"><Star className="w-4 h-4 fill-current" />{selectedCourse.rating}</span>
                </div>
              </div>
            </div>
          </div>

          {selectedCourse.progress > 0 && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/5 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">{t.inProgress}</span>
                <span className="text-white font-medium">{selectedCourse.progress}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${selectedCourse.progress}%` }} />
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t.courseContent}</h3>
            <div className="space-y-3">
              {LESSONS.map((lesson, idx) => (
                <div key={lesson.id} className={`flex items-center gap-4 p-4 rounded-xl border ${lesson.locked ? "bg-white/5 border-white/5 opacity-60" : "bg-white/5 border-white/10 hover:border-purple-500/30"}`}>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm text-gray-400">
                    {lesson.completed ? <CheckCircle className="w-5 h-5 text-green-400" /> : lesson.locked ? <Lock className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-white">{getLocalizedLesson(lesson, language)}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1"><Play className="w-3 h-3" />{lesson.duration} {t.minutes}</div>
                  </div>
                  {!lesson.locked && !lesson.completed && (
                    <button className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg text-sm hover:bg-purple-500/30">{t.continueLearning}</button>
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
    <div className="min-h-screen bg-[#030014]">
      <header className="sticky top-0 z-50 bg-[#030014]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></Link>
            <h1 className="text-xl font-bold gradient-text">{t.title}</h1>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">{t.title}</h2>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex bg-white/5 rounded-xl p-1">
            <button onClick={() => setActiveTab("my")} className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "my" ? "bg-purple-500/20 text-purple-300" : "text-gray-400 hover:text-white"}`}>{t.myCourses}</button>
            <button onClick={() => setActiveTab("all")} className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "all" ? "bg-purple-500/20 text-purple-300" : "text-gray-400 hover:text-white"}`}>{t.allCourses}</button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button onClick={() => setFilterLevel("all")} className={`px-4 py-2 rounded-full text-sm transition-all ${filterLevel === "all" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10"}`}>{language === "zh" ? "全部" : language === "id" ? "Semua" : "All"}</button>
          <button onClick={() => setFilterLevel("beginner")} className={`px-4 py-2 rounded-full text-sm transition-all ${filterLevel === "beginner" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10"}`}>{levelLabels.beginner}</button>
          <button onClick={() => setFilterLevel("intermediate")} className={`px-4 py-2 rounded-full text-sm transition-all ${filterLevel === "intermediate" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10"}`}>{levelLabels.intermediate}</button>
          <button onClick={() => setFilterLevel("advanced")} className={`px-4 py-2 rounded-full text-sm transition-all ${filterLevel === "advanced" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10"}`}>{levelLabels.advanced}</button>
        </div>

        {activeTab === "my" && myCourses.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Eye className="w-5 h-5 text-purple-400" />{t.myCourses}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myCourses.map((course) => {
                const info = getLocalizedCourse(course, language);
                return (
                  <div key={course.id} onClick={() => setSelectedCourse(course)} className="cursor-pointer bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all">
                    <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center text-6xl">{course.thumbnail}</div>
                    <div className="p-5">
                      <h4 className="text-lg font-semibold text-white mb-2 line-clamp-1">{info.title}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm"><span className="text-gray-400">{t.inProgress}</span><span className="text-white">{course.progress}%</span></div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${course.progress}%` }} /></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">{t.allCourses}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => {
              const info = getLocalizedCourse(course, language);
              return (
                <div key={course.id} onClick={() => setSelectedCourse(course)} className="cursor-pointer bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all">
                  <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center text-6xl">{course.thumbnail}</div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(course.level)}`}>{levelLabels[course.level as keyof typeof levelLabels]}</span>
                      <div className="flex items-center gap-1 text-amber-400 text-sm"><Star className="w-4 h-4 fill-current" />{course.rating}</div>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2 line-clamp-1">{info.title}</h4>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{info.desc}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{course.lessons} {t.lessons}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{course.duration} {t.hours}</span>
                      <span className="flex items-center gap-1"><Users className="w-4 h-4" />{course.students > 1000 ? `${(course.students / 1000).toFixed(1)}k` : course.students}</span>
                    </div>
                    {course.progress > 0 && (
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm"><span className="text-gray-400">{t.inProgress}</span><span className="text-white">{course.progress}%</span></div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${course.progress}%` }} /></div>
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
