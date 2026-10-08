"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { appendReferral } from "@/components/ReferralTracker";
import { Sparkles, Lock, ShieldCheck, ArrowRight } from "lucide-react";

const GUMLINKS = {
  single: "https://hanhan55.gumroad.com/l/zgbent",
  fortune: "https://hanhan55.gumroad.com/l/zxccdv",
};

// 根据文章分类匹配不同的转化话术
function matchCategory(categoryLabel: string): string {
  const c = (categoryLabel || "").toLowerCase();
  if (c.includes("bazi") || c.includes("八字") || c.includes("four pillar") || c.includes("命理")) return "bazi";
  if (c.includes("compat") || c.includes("配对") || c.includes("合盘") || c.includes("relationship") || c.includes("love")) return "compatibility";
  if (c.includes("tarot") || c.includes("塔罗")) return "tarot";
  if (c.includes("horoscope") || c.includes("运势") || c.includes("zodiac") || c.includes("星座")) return "horoscope";
  if (c.includes("natal") || c.includes("chart") || c.includes("星盘") || c.includes("birth")) return "natal";
  return "general";
}

const CTA_CONTENT: Record<string, Record<string, { title: string; desc: string; primaryBtn: string; primaryHref: string; secondaryBtn: string; secondaryHref: string; }>> = {
  bazi: {
    zh: {
      title: "你的八字藏着什么密码？",
      desc: "这篇文章讲的是理论，但你的命盘才是答案。免费排盘看到的只是天干地支，AI深度解读会告诉你：你是什么格局？今年财运感情事业怎么走？怎么做才能顺？",
      primaryBtn: "免费排盘 + 解锁AI解读",
      primaryHref: "/bazi",
      secondaryBtn: "直接购买年运报告 $19.99",
      secondaryHref: GUMLINKS.fortune,
    },
    en: {
      title: "What Does Your BaZi Chart Reveal?",
      desc: "This article covers theory — but your own chart holds the answers. A free chart shows only stems and branches. AI Deep Reading tells you: What's your pattern? How will wealth, love and career unfold this year? How to make it smoother?",
      primaryBtn: "Free Chart + Unlock AI Reading",
      primaryHref: "/bazi",
      secondaryBtn: "Get Annual Report · $19.99",
      secondaryHref: GUMLINKS.fortune,
    },
    id: {
      title: "Apa yang disembunyikan BaZi Anda?",
      desc: "Artikel ini teori — bagan Anda yang punya jawaban. Bagan gratis hanya menunjukkan batang dan cabang. AI memberitahu: Pola Anda apa? Bagaimana keuangan, cinta, karier tahun ini?",
      primaryBtn: "Bagan Gratis + AI Reading",
      primaryHref: "/bazi",
      secondaryBtn: "Laporan Tahunan · $19.99",
      secondaryHref: GUMLINKS.fortune,
    },
    th: {
      title: "ตารางปาจื่อของคุณซ่อนอะไร?",
      desc: "บทความนี้เป็นทฤษฎี — ตารางของคุณคือคำตอบ. ตารางฟรีแค่ก้านแขนง. AI บอก: รูปแบบของคุณ? การเงิน ความรัก อาชีพปีนี้เป็นอย่างไร?",
      primaryBtn: "ตารางฟรี + AI Reading",
      primaryHref: "/bazi",
      secondaryBtn: "รายงานประจำปี · $19.99",
      secondaryHref: GUMLINKS.fortune,
    },
    vi: {
      title: "Bát tự của bạn ẩn chứa gì?",
      desc: "Bài này là lý thuyết — bản đồ của bạn mới là câu trả lời. Bản miễn phí chỉ có can chi. AI nói: Cách mạng của bạn? Tài lộc, tình duyên, sự nghiệp năm nay ra sao?",
      primaryBtn: "Bản miễn phí + AI Đọc",
      primaryHref: "/bazi",
      secondaryBtn: "Báo cáo năm · $19.99",
      secondaryHref: GUMLINKS.fortune,
    },
    ms: {
      title: "Apa yang disembunyikan BaZi Anda?",
      desc: "Artikel ini teori — carta anda yang ada jawapan. Carta percuma hanya batang dan cabang. AI beritahu: Corak anda? Bagaimana kewangan, cinta, kerjaya tahun ini?",
      primaryBtn: "Carta Percuma + AI Reading",
      primaryHref: "/bazi",
      secondaryBtn: "Laporan Tahunan · $19.99",
      secondaryHref: GUMLINKS.fortune,
    },
    ja: {
      title: "あなたの八字が隠しているもの",
      desc: "この記事は理論——あなたの命盤こそが答えです。無料の排盤は天干地支を示すだけ。AI深層リーディング：あなたの格局は？今年の金運・恋愛・仕事は？",
      primaryBtn: "無料排盤 + AIリーディング",
      primaryHref: "/bazi",
      secondaryBtn: "年間レポート · $19.99",
      secondaryHref: GUMLINKS.fortune,
    },
    ko: {
      title: "당신의 사주가 숨긴 것",
      desc: "이 글은 이론 — 당신의 명판이 답입니다. 무료 배판은 천간지지만 보여줄 뿐. AI 심층 리딩: 당신의 격국은? 올해 재물, 연애, 사업은?",
      primaryBtn: "무료 배판 + AI 리딩",
      primaryHref: "/bazi",
      secondaryBtn: "연간 리포트 · $19.99",
      secondaryHref: GUMLINKS.fortune,
    },
  },
  compatibility: {
    zh: {
      title: "你们到底合不合？",
      desc: "看了这么多配对理论，不如直接算你们的合盘。免费合盘看到五行匹配和评分，AI深度解读会告诉你们：关系的核心矛盾是什么？怎么化解？什么时候结婚/分手最有利？",
      primaryBtn: "免费算合盘",
      primaryHref: "/compatibility/bazi",
      secondaryBtn: "解锁双人深度解读 $19.99",
      secondaryHref: GUMLINKS.fortune,
    },
    en: {
      title: "Are You Actually Compatible?",
      desc: "Enough theory — calculate your actual compatibility chart. Free chart shows element match and score. AI Deep Reading reveals: What's the core conflict? How to resolve it? When is the best time for marriage or breakup?",
      primaryBtn: "Free Compatibility Chart",
      primaryHref: "/compatibility/bazi",
      secondaryBtn: "Unlock Couple's Deep Reading · $19.99",
      secondaryHref: GUMLINKS.fortune,
    },
    id: { title: "Apakah Anda benar-benar cocok?", desc: "Cukup teori — hitung bagan kecocokan Anda. Gratis menunjukkan skor. AI memberitahu: Konflik inti apa? Bagaimana mengatasi?", primaryBtn: "Bagan Kecocokan Gratis", primaryHref: "/compatibility/bazi", secondaryBtn: "Bacaan Pasangan · $19.99", secondaryHref: GUMLINKS.fortune },
    th: { title: "คุณเข้ากันจริงหรือ?", desc: "พอแล้วกับทฤษฎี — คำนวณตารางความเข้ากัน. ฟรีแสดงคะแนน. AI บอก: ความขัดแย้งหลักคืออะไร?", primaryBtn: "ตารางความเข้ากันฟรี", primaryHref: "/compatibility/bazi", secondaryBtn: "ปลดล็อกคู่รัก · $19.99", secondaryHref: GUMLINKS.fortune },
    vi: { title: "Hai bạn thực sự hợp nhau?", desc: "Đủ lý thuyết — tính hợp bản của hai người. Miễn phí cho điểm. AI nói: Mâu thuẫn cốt lõi là gì?", primaryBtn: "Hợp bản miễn phí", primaryHref: "/compatibility/bazi", secondaryBtn: "Mở khóa đọc cặp đôi · $19.99", secondaryHref: GUMLINKS.fortune },
    ms: { title: "Adakah anda benar-benar serasi?", desc: "Cukup teori — kira carta keserasian. Percuma tunjuk skor. AI beritahu: Konflik utama apa?", primaryBtn: "Carta Keserasian Percuma", primaryHref: "/compatibility/bazi", secondaryBtn: "Bacaan Pasangan · $19.99", secondaryHref: GUMLINKS.fortune },
    ja: { title: "本当に相性がいいの？", desc: "理論は十分——実際の合盤を計算しましょう。無料でスコア表示。AIが核心の矛盾と解決法を解説。", primaryBtn: "無料合盤", primaryHref: "/compatibility/bazi", secondaryBtn: "カップル深層リーディング · $19.99", secondaryHref: GUMLINKS.fortune },
    ko: { title: "정말 궁합이 맞나요?", desc: "이론은 충분 — 실제 합판을 계산하세요. 무료로 점수 표시. AI가 핵심 갈등과 해결법을 설명.", primaryBtn: "무료 합판", primaryHref: "/compatibility/bazi", secondaryBtn: "커플 심층 리딩 · $19.99", secondaryHref: GUMLINKS.fortune },
  },
  horoscope: {
    zh: {
      title: "你的2026年到底怎么样？",
      desc: "星座运势是泛泛而谈，你的专属年运才是精准答案。免费排盘看到行星位置，AI年运报告告诉你：12个月逐月运势、财运感情事业专项、关键月份提醒。",
      primaryBtn: "免费排盘看运势",
      primaryHref: "/natal",
      secondaryBtn: "解锁2026完整年运 $19.99",
      secondaryHref: GUMLINKS.fortune,
    },
    en: {
      title: "What Does 2026 Actually Hold for You?",
      desc: "Horoscopes are generic — your personal annual forecast is the real answer. Free chart shows planet positions. AI Annual Report gives you: 12-month monthly forecast, wealth/love/career deep dives, key month alerts.",
      primaryBtn: "Free Chart & Forecast",
      primaryHref: "/natal",
      secondaryBtn: "Unlock Full 2026 Report · $19.99",
      secondaryHref: GUMLINKS.fortune,
    },
    id: { title: "Bagaimana 2026 untuk Anda?", desc: "Horoskop umum — ramalan pribadi Anda jawabannya. Gratis posisi planet. AI: ramalan 12 bulan, keuangan/cinta/karier.", primaryBtn: "Bagan & Ramalan Gratis", primaryHref: "/natal", secondaryBtn: "Laporan 2026 Lengkap · $19.99", secondaryHref: GUMLINKS.fortune },
    th: { title: "ปี 2026 สำหรับคุณเป็นอย่างไร?", desc: "โหราศาสตร์ทั่วไป — ทำนายส่วนตัวคือคำตอบ. ฟรีตำแหน่งดาว. AI: ทำนาย 12 เดือน.", primaryBtn: "ตาราง & ทำนายฟรี", primaryHref: "/natal", secondaryBtn: "รายงาน 2026 เต็ม · $19.99", secondaryHref: GUMLINKS.fortune },
    vi: { title: "Năm 2026 của bạn thế nào?", desc: "Tử vi chung — vận hạn riêng bạn mới là đáp án. Miễn phí vị trí hành tinh. AI: vận 12 tháng.", primaryBtn: "Bàn & Vận hạn miễn phí", primaryHref: "/natal", secondaryBtn: "Báo cáo 2026 đầy đủ · $19.99", secondaryHref: GUMLINKS.fortune },
    ms: { title: "Bagaimana 2026 untuk Anda?", desc: "Horoskop umum — ramalan peribadi jawapannya. Percuma kedudukan planet. AI: ramalan 12 bulan.", primaryBtn: "Carta & Ramalan Percuma", primaryHref: "/natal", secondaryBtn: "Laporan 2026 Penuh · $19.99", secondaryHref: GUMLINKS.fortune },
    ja: { title: "2026年はあなたにとってどんな年？", desc: "星座运势は一般論——あなただけの年運が本当の答え。無料で惑星位置。AI年運レポート：12ヶ月月運、金運/恋愛/仕事。", primaryBtn: "無料排盤＆運勢", primaryHref: "/natal", secondaryBtn: "2026完全年運レポート · $19.99", secondaryHref: GUMLINKS.fortune },
    ko: { title: "2026년 당신에겐 어떤 해?", desc: "별자리 운세는 일반론 — 당신만의 연운이 진짜 답. 무료로 행성 위치. AI 연간 리포트: 12개월 월운, 재물/연애/사업.", primaryBtn: "무료 배판 & 운세", primaryHref: "/natal", secondaryBtn: "2026 완전 연운 리포트 · $19.99", secondaryHref: GUMLINKS.fortune },
  },
  natal: {
    zh: {
      title: "你的星盘到底在说什么？",
      desc: "文章讲的是占星知识，但你的星盘才是你的人生地图。免费星盘画出相位线，AI深度解读会告诉你：你的核心格局是什么？最大的优势和卡点在哪？今年该注意什么？",
      primaryBtn: "免费生成星盘",
      primaryHref: "/natal",
      secondaryBtn: "解锁AI深度解读 $3.99",
      secondaryHref: GUMLINKS.single,
    },
    en: {
      title: "What Is Your Chart Really Saying?",
      desc: "This article teaches astrology — but your chart is your life map. Free chart draws aspect lines. AI Deep Reading tells you: What's your core pattern? Biggest strengths and blocks? What to watch this year?",
      primaryBtn: "Generate Free Chart",
      primaryHref: "/natal",
      secondaryBtn: "Unlock AI Deep Reading · $3.99",
      secondaryHref: GUMLINKS.single,
    },
    id: { title: "Apa yang dikatakan bintang Anda?", desc: "Artikel ajar astrologi — bagan Anda peta hidup Anda. Gratis garis aspek. AI: Pola inti? Kekuatan dan blok?", primaryBtn: "Bagan Gratis", primaryHref: "/natal", secondaryBtn: "AI Reading · $3.99", secondaryHref: GUMLINKS.single },
    th: { title: "ตารางดาวของคุณบอกอะไร?", desc: "บทความสอนโหราศาสตร์ — ตารางคือแผนชีวิต. ฟรีเส้นแง่ง. AI: รูปแบบหลัก? จุดแข็งและขัด?", primaryBtn: "ตารางฟรี", primaryHref: "/natal", secondaryBtn: "AI Reading · $3.99", secondaryHref: GUMLINKS.single },
    vi: { title: "Bàn sao của bạn nói gì?", desc: "Bài dạy chiêm tinh — bàn của bạn là bản đồ cuộc đời. Miễn phí đường aspect. AI: Cốt lõi? Điểm mạnh và khó?", primaryBtn: "Bàn miễn phí", primaryHref: "/natal", secondaryBtn: "AI Đọc · $3.99", secondaryHref: GUMLINKS.single },
    ms: { title: "Apa yang dikatakan carta anda?", desc: "Artikel ajar astrologi — carta anda peta hidup. Percuma garis aspek. AI: Corak teras? Kekuatan dan blok?", primaryBtn: "Carta Percuma", primaryHref: "/natal", secondaryBtn: "AI Reading · $3.99", secondaryHref: GUMLINKS.single },
    ja: { title: "あなたの星盤が語ること", desc: "この記事は占星術の知識——あなたの星盤が人生の地図です。無料でアスペクト線。AI：核心格局は？強みと課題は？", primaryBtn: "無料星盤生成", primaryHref: "/natal", secondaryBtn: "AI深層リーディング · $3.99", secondaryHref: GUMLINKS.single },
    ko: { title: "당신의 차트가 말하는 것", desc: "이 글은 점성술 지식 — 당신의 차트가 인생 지도. 무료로 어스펙트 선. AI: 핵심 패턴? 강점과 블록?", primaryBtn: "무료 차트 생성", primaryHref: "/natal", secondaryBtn: "AI 심층 리딩 · $3.99", secondaryHref: GUMLINKS.single },
  },
  tarot: {
    zh: {
      title: "牌面只是开始，答案在你的命盘里",
      desc: "塔罗给你当下的指引，但八字和星盘才是你人生的底层代码。免费排盘看到格局，AI深度解读会把塔罗的启示和你的命盘结合，给出真正可执行的建议。",
      primaryBtn: "免费排盘",
      primaryHref: "/bazi",
      secondaryBtn: "解锁AI深度解读 $3.99",
      secondaryHref: GUMLINKS.single,
    },
    en: {
      title: "Cards Are Just the Start — Your Chart Holds the Answer",
      desc: "Tarot gives guidance for now — but BaZi and your natal chart are your life's source code. Free chart shows your pattern. AI Deep Reading combines tarot insight with your chart for actionable advice.",
      primaryBtn: "Free Chart",
      primaryHref: "/bazi",
      secondaryBtn: "Unlock AI Reading · $3.99",
      secondaryHref: GUMLINKS.single,
    },
    id: { title: "Kartu hanya awal — bagan Anda jawabannya", desc: "Tarot petunjuk sekarang — BaZi dan natal chart kode hidup Anda. Gratis pola. AI gabungkan untuk saran.", primaryBtn: "Bagan Gratis", primaryHref: "/bazi", secondaryBtn: "AI Reading · $3.99", secondaryHref: GUMLINKS.single },
    th: { title: "ไพ่แค่เริ่ม — ตารางคือคำตอบ", desc: "Tarot แนะนำตอนนี้ — BaZi และ natal chart คือซอร์สโค้ดชีวิต. ฟรีรูปแบบ. AI รวมเพื่อคำแนะนำ.", primaryBtn: "ตารางฟรี", primaryHref: "/bazi", secondaryBtn: "AI Reading · $3.99", secondaryHref: GUMLINKS.single },
    vi: { title: "Bài chỉ là bắt đầu — bàn của bạn là đáp án", desc: "Tarot hướng dẫn hiện tại — Bát tự và bàn sao là mã nguồn cuộc đời. Miễn phí cách mạng. AI kết hợp.", primaryBtn: "Bản miễn phí", primaryHref: "/bazi", secondaryBtn: "AI Đọc · $3.99", secondaryHref: GUMLINKS.single },
    ms: { title: "Kad hanya permulaan — carta anda jawapannya", desc: "Tarot panduan sekarang — BaZi dan natal chart kod hidup anda. Percuma corak. AI gabungkan.", primaryBtn: "Carta Percuma", primaryHref: "/bazi", secondaryBtn: "AI Reading · $3.99", secondaryHref: GUMLINKS.single },
    ja: { title: "カードは始まり——あなたの命盤が答え", desc: "タロットは今の指針——八字と星盤が人生のソースコード。無料で格局。AIがタロットと命盤を統合して実行可能なアドバイス。", primaryBtn: "無料排盤", primaryHref: "/bazi", secondaryBtn: "AIリーディング · $3.99", secondaryHref: GUMLINKS.single },
    ko: { title: "카드는 시작 — 당신의 명판이 답", desc: "타로는 지금의 지침 — 사주와 출생차트가 인생 소스코드. 무료로 격국. AI가 타로와 명판 통합.", primaryBtn: "무료 배판", primaryHref: "/bazi", secondaryBtn: "AI 리딩 · $3.99", secondaryHref: GUMLINKS.single },
  },
  general: {
    zh: {
      title: "知道了理论，不如看看你自己的命盘",
      desc: "占星和八字的知识无穷无尽，但最有价值的是你自己的那张盘。免费排盘看到基础格局，AI深度解读会用大白话告诉你：你是谁？你的人生主题是什么？今年该怎么走？",
      primaryBtn: "免费排盘（八字+星盘）",
      primaryHref: "/bazi",
      secondaryBtn: "解锁AI深度解读 $3.99",
      secondaryHref: GUMLINKS.single,
    },
    en: {
      title: "Theory Is Great — But Your Own Chart Is What Matters",
      desc: "Astrology and BaZi knowledge is endless — but your chart is the most valuable thing. Free chart shows your basic pattern. AI Deep Reading tells you in plain language: Who are you? What's your life theme? How to navigate this year?",
      primaryBtn: "Free Chart (BaZi + Natal)",
      primaryHref: "/bazi",
      secondaryBtn: "Unlock AI Reading · $3.99",
      secondaryHref: GUMLINKS.single,
    },
    id: { title: "Teori bagus — bagan Anda yang berharga", desc: "Pengetahuan astrologi dan BaZi tak terbatas — bagan Anda paling berharga. Gratis pola dasar. AI: Siapa Anda? Tema hidup?", primaryBtn: "Bagan Gratis", primaryHref: "/bazi", secondaryBtn: "AI Reading · $3.99", secondaryHref: GUMLINKS.single },
    th: { title: "ทฤษฎีดี — ตารางคุณสำคัญที่สุด", desc: "ความรู้โหราศาสตร์และ BaZi ไม่มีที่สิ้นสุด — ตารางคุณคือสิ่งมีค่า. ฟรีรูปแบบ. AI: คุณคือใคร?", primaryBtn: "ตารางฟรี", primaryHref: "/bazi", secondaryBtn: "AI Reading · $3.99", secondaryHref: GUMLINKS.single },
    vi: { title: "Lý thuyết hay — bàn của bạn quan trọng nhất", desc: "Kiến thức chiêm tinh và Bát tự vô tận — bàn của bạn giá trị nhất. Miễn phí cơ bản. AI: Bạn là ai?", primaryBtn: "Bản miễn phí", primaryHref: "/bazi", secondaryBtn: "AI Đọc · $3.99", secondaryHref: GUMLINKS.single },
    ms: { title: "Teori bagus — carta anda paling berharga", desc: "Pengetahuan astrologi dan BaZi tak terbatas — carta anda paling berharga. Percuma corak asas. AI: Siapa anda?", primaryBtn: "Carta Percuma", primaryHref: "/bazi", secondaryBtn: "AI Reading · $3.99", secondaryHref: GUMLINKS.single },
    ja: { title: "理論よりあなたの命盤", desc: "占星術と八字の知識は無限——でもあなたの命盤こそが最も価値がある。無料で基本格局。AIが平易な言葉で：あなたは誰？人生のテーマは？", primaryBtn: "無料排盤", primaryHref: "/bazi", secondaryBtn: "AIリーディング · $3.99", secondaryHref: GUMLINKS.single },
    ko: { title: "이론보다 당신의 명판", desc: "점성술과 사주 지식은 무한 — 하지만 당신의 명판이 가장 가치있음. 무료로 기본 격국. AI: 당신은 누구? 인생 테마는?", primaryBtn: "무료 배판", primaryHref: "/bazi", secondaryBtn: "AI 리딩 · $3.99", secondaryHref: GUMLINKS.single },
  },
};

export default function BlogArticleCTA({ categoryLabel }: { categoryLabel?: string }) {
  const { language } = useLanguage();
  const lang = language || "en";
  const cat = matchCategory(categoryLabel || "");
  const content = CTA_CONTENT[cat]?.[lang] || CTA_CONTENT[cat]?.en || CTA_CONTENT.general.en;

  const isExternal = (href: string) => href.startsWith("http");
  const secondaryHref = isExternal(content.secondaryHref) ? appendReferral(content.secondaryHref) : content.secondaryHref;

  return (
    <div className="mt-16 p-6 sm:p-8 rounded-2xl border overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 40%, #fef9c3 100%)",
        borderColor: "#f59e0b",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={18} className="text-amber-600" />
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">{content.title}</h3>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-5 max-w-lg">
        {content.desc}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        {isExternal(content.primaryHref) ? (
          <a
            href={content.primaryHref}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-black transition-colors shadow-lg"
          >
            {content.primaryBtn}
            <ArrowRight size={14} />
          </a>
        ) : (
          <a
            href={content.primaryHref}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-black transition-colors shadow-lg"
          >
            {content.primaryBtn}
            <ArrowRight size={14} />
          </a>
        )}
        <a
          href={secondaryHref}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-800 border border-amber-300 rounded-xl font-semibold text-sm hover:bg-amber-50 transition-colors"
        >
          <Lock size={14} />
          {content.secondaryBtn}
        </a>
      </div>
      <div className="flex items-center gap-3 mt-4 text-[11px] text-gray-500">
        <span className="flex items-center gap-1">
          <ShieldCheck size={12} />
          7-day money back
        </span>
        <span>·</span>
        <span>1,200+ unlocked</span>
        <span>·</span>
        <span>8 languages</span>
      </div>
    </div>
  );
}
