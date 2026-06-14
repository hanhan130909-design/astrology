"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const features = [
  { href:"/natal", icon:"🪐", pro:false, zh:"本命星盘分析", zhDesc:"完整行星落位、宫位、相位深度解读", en:"Natal Chart", enDesc:"Complete planet positions, houses, aspects", id:"Bagan Lahir", idDesc:"Posisi planet, rumah, aspek lengkap", th:"แผนภูมิเกิด", thDesc:"ตำแหน่งดาว บ้าน ราศี มุมสัมพันธ์", vi:"Bản đồ sao", viDesc:"Vị trí hành tinh, nhà, góc chiếu", ms:"Carta Lahir", msDesc:"Kedudukan planet, rumah, aspek lengkap", ja:"出生図", jaDesc:"惑星位置、ハウス、アスペクト", ko:"출생 차트", koDesc:"행성 위치, 하우스, 각도 분석" },
  { href:"/ai-reading", icon:"🤖", pro:true, zh:"AI 智能解读", zhDesc:"大模型驱动的深度星盘分析报告", en:"AI Reading", enDesc:"LLM-powered deep chart analysis", id:"AI Reading", idDesc:"Analisis bagan mendalam dengan AI", th:"AI ดูดวง", thDesc:"วิเคราะห์ดวงด้วย AI", vi:"AI Giải mã", viDesc:"Phân tích chuyên sâu bằng AI", ms:"AI Bacaan", msDesc:"Analisis carta mendalam oleh AI", ja:"AI 星読み", jaDesc:"AIによる深層星図分析", ko:"AI 해석", koDesc:"AI 기반 심층 차트 분석" },
  { href:"/compatibility", icon:"💕", pro:false, zh:"星座配对", zhDesc:"深入分析两人关系的契合度", en:"Compatibility", enDesc:"In-depth relationship compatibility", id:"Kecocokan", idDesc:"Analisis kecocokan hubungan", th:"ความเข้ากัน", thDesc:"วิเคราะห์ความเข้ากันของคู่", vi:"Tương hợp", viDesc:"Phân tích độ hợp nhau", ms:"Keserasian", msDesc:"Analisis keserasian hubungan", ja:"相性診断", jaDesc:"二人の相性を深く分析", ko:"궁합 분석", koDesc:"두 사람의 궁합 심층 분석" },
  { href:"/horoscope", icon:"📅", pro:false, zh:"每日运势", zhDesc:"爱情、事业、财运多维度指引", en:"Daily Horoscope", enDesc:"Love, career, finance guidance", id:"Horoskop Harian", idDesc:"Panduan cinta, karier, keuangan", th:"ดูดวงรายวัน", thDesc:"คำแนะนำความรัก งาน การเงิน", vi:"Tử vi hàng ngày", viDesc:"Tình yêu, sự nghiệp, tài chính", ms:"Horoskop Harian", msDesc:"Panduan cinta, kerjaya, kewangan", ja:"デイリー運勢", jaDesc:"恋愛・仕事・金運の指針", ko:"일일 운세", koDesc:"사랑, 직업, 재정 가이드" },
  { href:"/transits", icon:"🔭", pro:false, zh:"行运追踪", zhDesc:"实时追踪行星换座与重要相位", en:"Transits", enDesc:"Real-time planet ingresses and aspects", id:"Transit", idDesc:"Pantau pergerakan planet real-time", th:"ดาวโคจร", thDesc:"ติดตามการเคลื่อนที่ของดาว", vi:"Quá cảnh", viDesc:"Theo dõi hành tinh di chuyển", ms:"Transit", msDesc:"Pantau pergerakan planet masa nyata", ja:"トランジット", jaDesc:"惑星移動と重要アスペクト", ko:"행성 이동", koDesc:"실시간 행성 이동 추적" },
  { href:"/yearly-horoscope", icon:"📊", pro:true, zh:"年度运势报告", zhDesc:"预知全年运势走向", en:"Yearly Report", enDesc:"Full year forecast", id:"Laporan Tahunan", idDesc:"Ramalan setahun penuh", th:"รายงานรายปี", thDesc:"พยากรณ์ตลอดทั้งปี", vi:"Báo cáo năm", viDesc:"Dự báo cả năm", ms:"Laporan Tahunan", msDesc:"Ramalan sepanjang tahun", ja:"年間レポート", jaDesc:"年間の運勢予測", ko:"연간 리포트", koDesc:"1년 운세 예측" },
  { href:"/tarot", icon:"🃏", pro:false, zh:"塔罗占卜", zhDesc:"神秘塔罗牌指引人生方向", en:"Tarot", enDesc:"Mystical tarot guidance", id:"Tarot", idDesc:"Panduan mistis kartu tarot", th:"ไพ่ทาโรต์", thDesc:"ไพ่ทาโรต์นำทางชีวิต", vi:"Tarot", viDesc:"Bài tarot huyền bí", ms:"Tarot", msDesc:"Panduan mistik kad tarot", ja:"タロット", jaDesc:"神秘のタロットが導く", ko:"타로", koDesc:"신비한 타로 카드 안내" },
  { href:"/compare", icon:"⚖️", pro:false, zh:"星盘对比", zhDesc:"对比两个星盘，探索关系动态", en:"Compare Charts", enDesc:"Compare two charts", id:"Bandingkan", idDesc:"Bandingkan dua bagan", th:"เปรียบเทียบ", thDesc:"เปรียบเทียบสองดวง", vi:"So sánh", viDesc:"So sánh hai bản đồ sao", ms:"Banding", msDesc:"Banding dua carta", ja:"比較", jaDesc:"二つの星図を比較", ko:"비교", koDesc:"두 차트 비교 분석" },
  { href:"/community", icon:"💬", pro:false, zh:"占星社区", zhDesc:"与占星爱好者交流讨论", en:"Community", enDesc:"Discuss with enthusiasts", id:"Komunitas", idDesc:"Diskusi dengan penggemar", th:"ชุมชน", thDesc:"พูดคุยกับผู้สนใจ", vi:"Cộng đồng", viDesc:"Thảo luận cùng người yêu thích", ms:"Komuniti", msDesc:"Bincang dengan peminat", ja:"コミュニティ", jaDesc:"占星好きと交流", ko:"커뮤니티", koDesc:"별자리 애호가와 소통" },
  { href:"/academy", icon:"📚", pro:false, zh:"占星学院", zhDesc:"系统学习占星学课程", en:"Academy", enDesc:"Systematic astrology courses", id:"Akademi", idDesc:"Kursus astrologi sistematis", th:"โรงเรียน", thDesc:"เรียนโหราศาสตร์อย่างเป็นระบบ", vi:"Học viện", viDesc:"Khóa học chiêm tinh", ms:"Akademi", msDesc:"Kursus astrologi sistematik", ja:"アカデミー", jaDesc:"占星学を体系的に学ぶ", ko:"아카데미", koDesc:"체계적인 점성술 강좌" },
  { href:"/consultation", icon:"🎓", pro:true, zh:"大师咨询", zhDesc:"预约专业占星师一对一咨询", en:"Consultation", enDesc:"1-on-1 with astrologers", id:"Konsultasi", idDesc:"Konsultasi 1-on-1 dengan ahli", th:"ปรึกษา", thDesc:"ปรึกษาผู้เชี่ยวชาญ", vi:"Tư vấn", viDesc:"Tư vấn 1-1 với chuyên gia", ms:"Konsultasi", msDesc:"Konsultasi 1-on-1 dengan pakar", ja:"相談", jaDesc:"占星師とのマンツーマン相談", ko:"상담", koDesc:"전문가 1:1 상담" },
];

const zodiacs = [
  { emoji:"♈", zh:"白羊", en:"Aries", id:"Aries", th:"แกะ", vi:"Bạch Dương", ms:"Aries", ja:"牡羊", ko:"양", key:"aries" },
  { emoji:"♉", zh:"金牛", en:"Taurus", id:"Taurus", th:"พฤกษ", vi:"Kim Ngưu", ms:"Taurus", ja:"牡牛", ko:"황소", key:"taurus" },
  { emoji:"♊", zh:"双子", en:"Gemini", id:"Gemini", th:"มิถุน", vi:"Song Tử", ms:"Gemini", ja:"双子", ko:"쌍둥이", key:"gemini" },
  { emoji:"♋", zh:"巨蟹", en:"Cancer", id:"Cancer", th:"กรกฎ", vi:"Cự Giải", ms:"Cancer", ja:"蟹", ko:"게", key:"cancer" },
  { emoji:"♌", zh:"狮子", en:"Leo", id:"Leo", th:"สิงห์", vi:"Sư Tử", ms:"Leo", ja:"獅子", ko:"사자", key:"leo" },
  { emoji:"♍", zh:"处女", en:"Virgo", id:"Virgo", th:"กันย์", vi:"Xử Nữ", ms:"Virgo", ja:"乙女", ko:"처녀", key:"virgo" },
  { emoji:"♎", zh:"天秤", en:"Libra", id:"Libra", th:"ตุลย์", vi:"Thiên Bình", ms:"Libra", ja:"天秤", ko:"천칭", key:"libra" },
  { emoji:"♏", zh:"天蝎", en:"Scorpio", id:"Scorpio", th:"พิจิก", vi:"Bọ Cạp", ms:"Scorpio", ja:"蠍", ko:"전갈", key:"scorpio" },
  { emoji:"♐", zh:"射手", en:"Sagittarius", id:"Sagittarius", th:"ธนู", vi:"Nhân Mã", ms:"Sagittarius", ja:"射手", ko:"사수", key:"sagittarius" },
  { emoji:"♑", zh:"摩羯", en:"Capricorn", id:"Capricorn", th:"มังกร", vi:"Ma Kết", ms:"Capricorn", ja:"山羊", ko:"염소", key:"capricorn" },
  { emoji:"♒", zh:"水瓶", en:"Aquarius", id:"Aquarius", th:"กุมภ์", vi:"Bảo Bình", ms:"Aquarius", ja:"水瓶", ko:"물병", key:"aquarius" },
  { emoji:"♓", zh:"双鱼", en:"Pisces", id:"Pisces", th:"มีน", vi:"Song Ngư", ms:"Pisces", ja:"魚", ko:"물고기", key:"pisces" },
];

const T: Record<string, Record<string, string>> = {
  zh: { badge:"专业天文计算 · AI 驱动", hero:"探索你的命运星图", heroSub:"基于真实天文计算与先进AI技术，为你提供专业、精准的占星解读", cta:"免费生成星盘", learn:"了解更多", free:"永久免费", real:"真实天文计算", lang:"支持语言", features:"核心功能", featSub:"专为初学者和专家设计的专业占星工具", try:"立即使用", zodiac:"探索十二星座", zodiacSub:"点击选择查看今日运势", testimonials:"用户好评", testSub:"来自真实用户的反馈", cta2:"准备好探索你的命运了吗？", ctaBtn:"立即开始", privacy:"隐私政策", terms:"服务条款", contact:"联系我们" },
  en: { badge:"Professional Astronomy · AI Powered", hero:"Discover Your Destiny", heroSub:"Professional astrology readings powered by real astronomical calculations and advanced AI", cta:"Generate Chart", learn:"Learn More", free:"Free Forever", real:"Real Astronomy", lang:"Languages", features:"Core Features", featSub:"Professional astrology tools for beginners and experts", try:"Try now", zodiac:"Explore Zodiac Signs", zodiacSub:"Click to view daily horoscope", testimonials:"Testimonials", testSub:"Feedback from real users", cta2:"Ready to explore your destiny?", ctaBtn:"Get Started", privacy:"Privacy", terms:"Terms", contact:"Contact" },
  id: { badge:"Astronomi Profesional · Didukung AI", hero:"Temukan Takdir Anda", heroSub:"Pembacaan astrologi profesional didukung perhitungan astronomi nyata dan AI canggih", cta:"Buat Bagan", learn:"Pelajari", free:"Gratis Selamanya", real:"Astronomi Nyata", lang:"Bahasa", features:"Fitur Utama", featSub:"Alat astrologi profesional untuk pemula dan ahli", try:"Coba sekarang", zodiac:"Jelajahi Zodiak", zodiacSub:"Klik untuk lihat horoskop harian", testimonials:"Testimoni", testSub:"Umpan balik dari pengguna", cta2:"Siap menjelajahi takdir Anda?", ctaBtn:"Mulai", privacy:"Privasi", terms:"Ketentuan", contact:"Kontak" },
  th: { badge:"ดาราศาสตร์มืออาชีพ · ขับเคลื่อนด้วย AI", hero:"ค้นพบโชคชะตาของคุณ", heroSub:"การอ่านดวงแบบมืออาชีพด้วยการคำนวณทางดาราศาสตร์จริงและ AI", cta:"สร้างแผนภูมิ", learn:"เรียนรู้เพิ่มเติม", free:"ฟรีตลอดไป", real:"ดาราศาสตร์จริง", lang:"ภาษา", features:"คุณสมบัติหลัก", featSub:"เครื่องมือโหราศาสตร์สำหรับผู้เริ่มต้นและผู้เชี่ยวชาญ", try:"ลองเลย", zodiac:"สำรวจราศี", zodiacSub:"คลิกเพื่อดูดวงรายวัน", testimonials:"คำนิยม", testSub:"เสียงตอบรับจากผู้ใช้จริง", cta2:"พร้อมที่จะสำรวจโชคชะตา?", ctaBtn:"เริ่มต้น", privacy:"ความเป็นส่วนตัว", terms:"ข้อกำหนด", contact:"ติดต่อ" },
  vi: { badge:"Thiên văn chuyên nghiệp · Hỗ trợ AI", hero:"Khám phá vận mệnh", heroSub:"Phân tích chiêm tinh chuyên nghiệp dựa trên tính toán thiên văn thực và AI", cta:"Tạo bản đồ sao", learn:"Tìm hiểu", free:"Miễn phí mãi mãi", real:"Thiên văn thực", lang:"Ngôn ngữ", features:"Tính năng", featSub:"Công cụ chiêm tinh cho người mới và chuyên gia", try:"Dùng ngay", zodiac:"Khám phá cung", zodiacSub:"Nhấn xem tử vi hàng ngày", testimonials:"Đánh giá", testSub:"Phản hồi từ người dùng", cta2:"Sẵn sàng khám phá?", ctaBtn:"Bắt đầu", privacy:"Riêng tư", terms:"Điều khoản", contact:"Liên hệ" },
  ms: { badge:"Astronomi Profesional · AI", hero:"Terokai Takdir Anda", heroSub:"Bacaan astrologi profesional berasaskan pengiraan astronomi sebenar dan AI", cta:"Jana Carta", learn:"Ketahui", free:"Percuma Selamanya", real:"Astronomi Sebenar", lang:"Bahasa", features:"Ciri Utama", featSub:"Alat astrologi profesional untuk pemula dan pakar", try:"Cuba sekarang", zodiac:"Terokai Zodiak", zodiacSub:"Klik lihat horoskop harian", testimonials:"Testimoni", testSub:"Maklum balas pengguna", cta2:"Sedia terokai takdir?", ctaBtn:"Mula", privacy:"Privasi", terms:"Syarat", contact:"Hubungi" },
  ja: { badge:"プロ天文計算 · AI搭載", hero:"あなたの運命を探る", heroSub:"実際の天文計算と最新AIによる、プロフェッショナルな星読みを提供します", cta:"星図を生成", learn:"詳しく見る", free:"永久無料", real:"リアル天文計算", lang:"対応言語", features:"主な機能", featSub:"初心者から専門家まで使える占星ツール", try:"今すぐ使う", zodiac:"12星座を探る", zodiacSub:"クリックで今日の運勢を見る", testimonials:"ユーザーの声", testSub:"実際のユーザーからのフィードバック", cta2:"運命を探る準備はできましたか？", ctaBtn:"始める", privacy:"プライバシー", terms:"利用規約", contact:"お問い合わせ" },
  ko: { badge:"전문 천문 계산 · AI 기반", hero:"당신의 운명을 탐험하세요", heroSub:"실제 천문 계산과 최신 AI 기술로 제공하는 전문 점성술 분석", cta:"차트 생성", learn:"더 알아보기", free:"영원히 무료", real:"실제 천문 계산", lang:"지원 언어", features:"주요 기능", featSub:"초보자와 전문가를 위한 점성술 도구", try:"바로 사용", zodiac:"별자리 탐험", zodiacSub:"클릭하여 일일 운세 보기", testimonials:"사용자 후기", testSub:"실제 사용자 피드백", cta2:"운명을 탐험할 준비가 되셨나요?", ctaBtn:"시작하기", privacy:"개인정보", terms:"약관", contact:"문의" }};

export default function HomePage() {
  const { language } = useLanguage();
  const t = T[language] || T.zh;

  return (
    <div className="bg-white text-[#171717]">
      {/* Hero */}
      <section className="relative text-center py-12 md:py-20 px-6 max-w-[800px] mx-auto overflow-hidden">
        {/* Subtle zodiac wheel background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
          <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="250" cy="250" r="240" stroke="black" strokeWidth="0.5"/>
            <circle cx="250" cy="250" r="200" stroke="black" strokeWidth="0.5"/>
            <circle cx="250" cy="250" r="160" stroke="black" strokeWidth="0.5"/>
            <circle cx="250" cy="250" r="120" stroke="black" strokeWidth="0.3"/>
            <circle cx="250" cy="250" r="80" stroke="black" strokeWidth="0.3"/>
            <line x1="250" y1="10" x2="250" y2="490" stroke="black" strokeWidth="0.3"/>
            <line x1="10" y1="250" x2="490" y2="250" stroke="black" strokeWidth="0.3"/>
            <line x1="80" y1="80" x2="420" y2="420" stroke="black" strokeWidth="0.3"/>
            <line x1="420" y1="80" x2="80" y2="420" stroke="black" strokeWidth="0.3"/>
            <line x1="250" y1="50" x2="250" y2="120" stroke="black" strokeWidth="0.8"/>
            <line x1="370" y1="130" x2="330" y2="170" stroke="black" strokeWidth="0.5"/>
            <text x="250" y="40" textAnchor="middle" fontSize="10" fontWeight="600" fill="black" opacity="0.3">MC</text>
            <text x="250" y="478" textAnchor="middle" fontSize="8" fill="black" opacity="0.3">IC</text>
            <text x="480" y="254" fontSize="8" fill="black" opacity="0.3">ASC</text>
            <text x="8" y="254" textAnchor="end" fontSize="8" fill="black" opacity="0.3">DSC</text>
          </svg>
        </div>
        <span className="relative inline-block text-[11px] font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
          {t.badge}
        </span>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-[-1px] md:tracking-[-2px] leading-[1.1] mb-4">{t.hero}</h1>
        <p className="text-base md:text-lg text-[#4d4d4d] leading-relaxed max-w-[520px] mx-auto mb-8">{t.heroSub}</p>
        <div className="flex gap-3 justify-center">
          <Link href="/natal" className="no-underline text-sm font-medium px-6 py-2.5 rounded-md bg-[#171717] text-white hover:bg-black transition-colors">{t.cta}</Link>
          <Link href="#features" className="no-underline text-sm font-medium px-6 py-2.5 rounded-md bg-white text-[#171717] hover:bg-gray-50 transition-colors" style={{boxShadow:"0px 0px 0px 1px rgba(0,0,0,0.08)"}}>{t.learn}</Link>
        </div>
      </section>

      {/* Stats */}
      <div className="flex justify-center gap-6 md:gap-12 pb-16">
        <div className="text-center"><div className="text-2xl md:text-[32px] font-semibold tracking-[-1px]">100%</div><div className="text-[13px] text-gray-500 mt-1">{t.free}</div></div>
        <div className="text-center"><div className="text-2xl md:text-[32px] font-semibold tracking-[-1px]">Real</div><div className="text-[13px] text-gray-500 mt-1">{t.real}</div></div>
        <div className="text-center"><div className="text-2xl md:text-[32px] font-semibold tracking-[-1px]">8</div><div className="text-[13px] text-gray-500 mt-1">{t.lang}</div></div>
      </div>

      {/* Features */}
      <section id="features" className="py-12 md:py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-2xl md:text-[32px] font-semibold tracking-[-1px] text-center mb-3">{t.features}</h2>
          <p className="text-base text-gray-500 text-center mb-12">{t.featSub}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <Link key={f.href} href={f.href}
                className="group no-underline text-inherit bg-white rounded-lg p-7 transition-shadow"
                style={{boxShadow:"0px 0px 0px 1px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.04)"}}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0px 0px 0px 1px rgba(0,0,0,0.12), 0px 4px 8px rgba(0,0,0,0.06)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0px 0px 0px 1px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.04)"}
              >
                {f.pro && <span className="inline-block text-[10px] font-semibold tracking-wide px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 mb-2 uppercase">PRO</span>}
                <div className="text-[22px] mb-3">{f.icon}</div>
                <h3 className="text-[17px] font-semibold tracking-[-0.4px] mb-2">{(f as any)[language] || f.zh}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{(f as any)[language+"Desc"] || f.zhDesc}</p>
                <span className="text-xs text-gray-400 group-hover:text-[#171717] transition-colors">{t.try} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Zodiac */}
      <section className="py-12 md:py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-2xl md:text-\[32px\] font-semibold tracking-[-1px] text-center mb-3">{t.zodiac}</h2>
          <p className="text-base text-gray-500 text-center mb-12">{t.zodiacSub}</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-w-[720px] mx-auto">
            {zodiacs.map((z) => (
              <Link key={z.key} href={`/zodiac/${z.key}`}
                className="no-underline text-sm text-gray-600 text-center py-3 px-2 rounded-md hover:text-[#171717] transition-colors"
                style={{boxShadow:"0px 0px 0px 1px rgba(0,0,0,0.08)"}}
              >
                {z.emoji} {(z as any)[language] || z.zh}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-2xl md:text-\[32px\] font-semibold tracking-[-1px] text-center mb-3">{t.testimonials}</h2>
          <p className="text-base text-gray-500 text-center mb-12">{t.testSub}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {zh:"AI解读太准了！完全命中了我最近的事业转折点。",name:"林小姐",role:"产品经理"},
              {zh:"每日运势已经成为我每天必看的习惯。",name:"陈先生",role:"创业者"},
              {zh:"作为专业人士，我也很认可这里的占星内容。",name:"王女士",role:"心理咨询师"},
            ].map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-6">
                <p className="text-sm text-gray-600 leading-relaxed mb-4">&ldquo;{t.zh}&rdquo;</p>
                <div className="text-[13px] font-semibold">{t.name}</div>
                <div className="text-xs text-gray-400">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 md:py-20 px-6">
        <h2 className="text-xl md:text-\[28px\] font-semibold tracking-[-0.8px] mb-6">{t.cta2}</h2>
        <Link href="/natal" className="inline-block no-underline text-sm font-medium px-8 py-3 bg-[#171717] text-white rounded-md hover:bg-black transition-colors">{t.ctaBtn}</Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 text-center">
        <Link href="/about" className="text-xs text-gray-400 no-underline mx-3 hover:text-[#171717]">{t.privacy}</Link>
        <Link href="/about" className="text-xs text-gray-400 no-underline mx-3 hover:text-[#171717]">{t.terms}</Link>
        <Link href="/about" className="text-xs text-gray-400 no-underline mx-3 hover:text-[#171717]">{t.contact}</Link>
      </footer>
    </div>
  );
}
