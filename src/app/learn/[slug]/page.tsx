"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { baziLessons, ziweiLessons } from "../course-bazi-ziwei";
import { lessonContent, type LessonContent } from "../lesson-content";
import { astroContents } from "../astro-content";
import { beginnerLessons as astroLessons } from "../course-data";
import type { CourseLesson } from "../course-data";
import { ArrowLeft, ChevronLeft, ChevronRight, Globe } from "lucide-react";

const LANG_NAMES: Record<string, string> = {
  zh: "Chinese", en: "English", id: "Indonesian", th: "Thai",
  vi: "Vietnamese", ms: "Malay", ja: "Japanese", ko: "Korean",
};

export default function LessonPage() {
  const params = useParams();
  const { language } = useLanguage();
  const slug = params.slug as string;
  const lang = language || "zh";

  // Determine course type and lesson index
  const isAstro = slug.startsWith("astro-");
  const isBaZi = slug.startsWith("bazi-");
  const courseType = isAstro ? "astro" : isBaZi ? "bazi" : "ziwei";
  const index = parseInt(slug.split("-")[1] || "1", 10);

  const lessons = isAstro ? astroLessons : isBaZi ? baziLessons : ziweiLessons;
  const courseKey = courseType;
  const lesson = lessons[index - 1] as CourseLesson | undefined;
  const content = (isAstro ? astroContents[slug] : lessonContent[slug]) as LessonContent | undefined;

  const [translatedHtml, setTranslatedHtml] = useState("");
  const [translating, setTranslating] = useState(false);

  // Track recently viewed lessons
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("learn_recent") || "[]");
      const updated = [slug, ...saved.filter((s: string) => s !== slug)].slice(0, 10);
      localStorage.setItem("learn_recent", JSON.stringify(updated));
    } catch {}
  }, [slug]);

  const translateContent = async () => {
    if (translating || !content) return;
    setTranslating(true);
    const text = lang === "en" ? content.en : content.zh;

    // For zh/en, we already have content — no translate needed
    if (lang === "zh" || lang === "en") {
      setTranslating(false);
      return;
    }

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang: lang }),
      });
      const data = await res.json();
      if (data.translated) {
        setTranslatedHtml(data.translated.replace(/\n/g, "<br>"));
      }
    } catch (e) {
      // silently fail
    }
    setTranslating(false);
  };

  if (!lesson || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <Link href="/learn" className="text-gray-500 underline hover:text-gray-700">
            Back to Learn
          </Link>
        </div>
      </div>
    );
  }

  // Resolve title and text — non-zh/en languages default to English for accurate terminology
  const showLang = (lang === "zh" || lang === "en") ? lang : "en";
  const title = lesson[lang] || lesson.en;
  const rawText = showLang === "en" ? content.en : content.zh;
  const displayText = (showLang === lang) ? rawText : (translatedHtml || rawText);
  const needsTranslation = lang !== "zh" && lang !== "en";

  // Navigation
  const prevLesson = index > 1 ? `/${courseKey}-${index - 1}` : null;
  const nextLesson = index < lessons.length ? `/${courseKey}-${index + 1}` : null;

  // Course color
  const courseColor = isAstro ? "gray" : isBaZi ? "purple" : "emerald";
  const colorClasses: Record<string, { bg: string; badge: string; text: string }> = {
    gray: { bg: "bg-gray-50", badge: "bg-gray-100 text-gray-700", text: "text-gray-600" },
    purple: { bg: "bg-purple-50", badge: "bg-purple-100 text-purple-700", text: "text-purple-600" },
    emerald: { bg: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-700", text: "text-emerald-600" },
  };
  const c = colorClasses[courseColor];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/learn" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft size={14} />
            Back to Courses
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${c.badge}`}>
            {isBaZi ? "BaZi" : "Zi Wei Dou Shu"} · Lesson {index}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
          <p className="text-gray-500 text-sm">
            {(lesson.desc[lang] || lesson.desc.en)}
          </p>
        </div>

        {/* Translate UI for non-zh/en languages */}
        {needsTranslation && !translatedHtml && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500 mb-2">
              Showing English version for accurate terminology. 
              Key terms like 天干 (Heavenly Stems), 十神 (Ten Gods), 四化 (Four Transformations) 
              are preserved in their standard international form.
            </p>
            <button
              onClick={translateContent}
              disabled={translating}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Globe size={14} />
              {translating ? "Translating..." : `Translate to ${LANG_NAMES[lang] || lang}`}
            </button>
          </div>
        )}

        {translatedHtml && needsTranslation && (
          <div className="mb-4 text-xs text-gray-400 italic">
            Auto-translated to {LANG_NAMES[lang] || lang} · 
            <button onClick={() => setTranslatedHtml("")} className="underline ml-1 hover:text-gray-600">
              Show English original
            </button>
          </div>
        )}

        {/* Content */}
        <article className="prose prose-gray max-w-none">
          {displayText.split("\n").map((line, i) => {
            // Render headings
            if (line.startsWith("## ")) {
              return <h2 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-4">{line.replace("## ", "")}</h2>;
            }
            if (line.startsWith("### ")) {
              return <h3 key={i} className="text-lg font-semibold text-gray-800 mt-6 mb-3">{line.replace("### ", "")}</h3>;
            }
            // Render table rows (simple pipe-based)
            if (line.startsWith("|")) {
              return <p key={i} className="text-sm text-gray-700 font-mono bg-gray-50 px-3 py-1 rounded">{line}</p>;
            }
            // Render bold items
            if (line.startsWith("- **")) {
              const match = line.match(/^- \*\*(.+?)\*\*[：:]?\s*(.*)/);
              if (match) {
                return (
                  <div key={i} className="flex gap-2 text-sm mb-1 ml-4">
                    <span className="font-semibold text-gray-800 shrink-0">{match[1]}：</span>
                    <span className="text-gray-600">{match[2]}</span>
                  </div>
                );
              }
            }
            // Empty line
            if (!line.trim()) {
              return <div key={i} className="h-3" />;
            }
            // Regular paragraph
            return <p key={i} className="text-gray-700 leading-relaxed mb-3">{line}</p>;
          })}
        </article>

        {/* Lesson Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-between">
          {prevLesson ? (
            <Link
              href={`/learn${prevLesson}`}
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft size={16} />
              Previous Lesson
            </Link>
          ) : (
            <div />
          )}
          {nextLesson ? (
            <Link
              href={`/learn${nextLesson}`}
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Next Lesson
              <ChevronRight size={16} />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
