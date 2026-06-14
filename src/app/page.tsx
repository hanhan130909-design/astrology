"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const features = [
  { href:"/natal", icon:"🪐", pro:false, zh:"本命星盘分析", zhDesc:"完整行星落位、宫位、相位深度解读", en:"Natal Chart", enDesc:"Complete planet positions, houses, aspects" },
  { href:"/ai-reading", icon:"🤖", pro:true, zh:"AI 智能解读", zhDesc:"大模型驱动的深度星盘分析报告", en:"AI Reading", enDesc:"LLM-powered deep chart analysis" },
  { href:"/compatibility", icon:"💕", pro:false, zh:"星座配对", zhDesc:"深入分析两人关系的契合度", en:"Compatibility", enDesc:"In-depth relationship compatibility analysis" },
  { href:"/horoscope", icon:"📅", pro:false, zh:"每日运势", zhDesc:"爱情、事业、财运多维度指引", en:"Daily Horoscope", enDesc:"Love, career, finance multi-dimensional guidance" },
  { href:"/transits", icon:"🔭", pro:false, zh:"行运追踪", zhDesc:"实时追踪行星换座与重要相位", en:"Transits", enDesc:"Real-time planet ingresses and major aspects" },
  { href:"/yearly-horoscope", icon:"📊", pro:true, zh:"年度运势报告", zhDesc:"预知全年运势走向", en:"Yearly Report", enDesc:"Full year forecast" },
  { href:"/tarot", icon:"🃏", pro:false, zh:"塔罗占卜", zhDesc:"神秘塔罗牌指引人生方向", en:"Tarot", enDesc:"Mystical tarot guidance" },
  { href:"/compare", icon:"⚖️", pro:false, zh:"星盘对比", zhDesc:"对比两个星盘，探索关系动态", en:"Compare Charts", enDesc:"Compare two charts, explore dynamics" },
  { href:"/community", icon:"💬", pro:false, zh:"占星社区", zhDesc:"与占星爱好者交流讨论", en:"Community", enDesc:"Discuss with astrology enthusiasts" },
  { href:"/academy", icon:"📚", pro:false, zh:"占星学院", zhDesc:"系统学习占星学课程", en:"Academy", enDesc:"Systematic astrology courses" },
  { href:"/consultation", icon:"🎓", pro:true, zh:"大师咨询", zhDesc:"预约专业占星师一对一咨询", en:"Consultation", enDesc:"1-on-1 with professional astrologers" },
];

const zodiacs = [
  { emoji:"♈", name:"白羊", en:"Aries", key:"aries" },
  { emoji:"♉", name:"金牛", en:"Taurus", key:"taurus" },
  { emoji:"♊", name:"双子", en:"Gemini", key:"gemini" },
  { emoji:"♋", name:"巨蟹", en:"Cancer", key:"cancer" },
  { emoji:"♌", name:"狮子", en:"Leo", key:"leo" },
  { emoji:"♍", name:"处女", en:"Virgo", key:"virgo" },
  { emoji:"♎", name:"天秤", en:"Libra", key:"libra" },
  { emoji:"♏", name:"天蝎", en:"Scorpio", key:"scorpio" },
  { emoji:"♐", name:"射手", en:"Sagittarius", key:"sagittarius" },
  { emoji:"♑", name:"摩羯", en:"Capricorn", key:"capricorn" },
  { emoji:"♒", name:"水瓶", en:"Aquarius", key:"aquarius" },
  { emoji:"♓", name:"双鱼", en:"Pisces", key:"pisces" },
];

const testimonials = [
  { zh:"AI解读太准了！完全命中了我最近的事业转折点，强烈推荐给每个想了解自己的人。", name:"林小姐", role:"产品经理" },
  { zh:"每日运势已经成为我每天必看的习惯，帮助我在重要决策前更有信心。", name:"陈先生", role:"创业者" },
  { zh:"作为专业人士，我也很认可这里的占星内容，专业且不失深度。", name:"王女士", role:"心理咨询师" },
];

export default function HomePage() {
  const { language } = useLanguage();
  const isZh = language === "zh";

  return (
    <div className="bg-white text-[#171717]">
      {/* ─── Hero ─── */}
      <section className="text-center py-20 px-6 max-w-[800px] mx-auto">
        <span className="inline-block text-[11px] font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
          {isZh ? "专业天文计算 · AI 驱动" : "Professional Astronomy · AI Powered"}
        </span>
        <h1 className="text-5xl font-semibold tracking-[-2px] leading-[1.1] mb-4">
          {isZh ? "探索你的命运星图" : "Discover Your Destiny"}
        </h1>
        <p className="text-lg text-[#4d4d4d] leading-relaxed max-w-[520px] mx-auto mb-8">
          {isZh 
            ? "基于真实天文计算与先进AI技术，为你提供专业、精准的占星解读"
            : "Professional astrology readings powered by real astronomical calculations and advanced AI"}
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/natal" className="no-underline text-sm font-medium px-6 py-2.5 rounded-md bg-[#171717] text-white hover:bg-black transition-colors">
            {isZh ? "免费生成星盘" : "Generate Chart"}
          </Link>
          <Link href="#features" className="no-underline text-sm font-medium px-6 py-2.5 rounded-md bg-white text-[#171717] hover:bg-gray-50 transition-colors" style={{boxShadow:"0px 0px 0px 1px rgba(0,0,0,0.08)"}}>
            {isZh ? "了解更多" : "Learn More"}
          </Link>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <div className="flex justify-center gap-12 pb-16">
        <div className="text-center">
          <div className="text-[32px] font-semibold tracking-[-1px]">100%</div>
          <div className="text-[13px] text-gray-500 mt-1">{isZh ? "永久免费" : "Free Forever"}</div>
        </div>
        <div className="text-center">
          <div className="text-[32px] font-semibold tracking-[-1px]">Real</div>
          <div className="text-[13px] text-gray-500 mt-1">{isZh ? "真实天文计算" : "Real Astronomy"}</div>
        </div>
        <div className="text-center">
          <div className="text-[32px] font-semibold tracking-[-1px]">8</div>
          <div className="text-[13px] text-gray-500 mt-1">{isZh ? "支持语言" : "Languages"}</div>
        </div>
      </div>

      {/* ─── Features ─── */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[32px] font-semibold tracking-[-1px] text-center mb-3">
            {isZh ? "核心功能" : "Core Features"}
          </h2>
          <p className="text-base text-gray-500 text-center mb-12">
            {isZh ? "专为初学者和专家设计的专业占星工具" : "Professional astrology tools for beginners and experts"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <Link key={f.href} href={f.href}
                className="group no-underline text-inherit bg-white rounded-lg p-7 transition-shadow"
                style={{boxShadow:"0px 0px 0px 1px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.04)"}}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0px 0px 0px 1px rgba(0,0,0,0.12), 0px 4px 8px rgba(0,0,0,0.06)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0px 0px 0px 1px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.04)"}
              >
                {f.pro && (
                  <span className="inline-block text-[10px] font-semibold tracking-wide px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 mb-2 uppercase">PRO</span>
                )}
                <div className="text-[22px] mb-3">{f.icon}</div>
                <h3 className="text-[17px] font-semibold tracking-[-0.4px] mb-2">{isZh ? f.zh : f.en}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{isZh ? f.zhDesc : f.enDesc}</p>
                <span className="text-xs text-gray-400 group-hover:text-[#171717] transition-colors">
                  {isZh ? "立即使用" : "Try now"} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Zodiac ─── */}
      <section className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[32px] font-semibold tracking-[-1px] text-center mb-3">
            {isZh ? "探索十二星座" : "Explore Zodiac Signs"}
          </h2>
          <p className="text-base text-gray-500 text-center mb-12">
            {isZh ? "点击选择查看今日运势" : "Click to view daily horoscope"}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-w-[720px] mx-auto">
            {zodiacs.map((z) => (
              <Link key={z.key} href={`/zodiac/${z.key}`}
                className="no-underline text-sm text-gray-600 text-center py-3 px-2 rounded-md hover:text-[#171717] transition-colors"
                style={{boxShadow:"0px 0px 0px 1px rgba(0,0,0,0.08)"}}
              >
                {z.emoji} {isZh ? z.name : z.en}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[32px] font-semibold tracking-[-1px] text-center mb-3">
            {isZh ? "用户好评" : "Testimonials"}
          </h2>
          <p className="text-base text-gray-500 text-center mb-12">
            {isZh ? "来自真实用户的反馈" : "Feedback from real users"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-6">
                <p className="text-sm text-gray-600 leading-relaxed mb-4">&ldquo;{t.zh}&rdquo;</p>
                <div className="text-[13px] font-semibold">{t.name}</div>
                <div className="text-xs text-gray-400">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="text-center py-20 px-6">
        <h2 className="text-[28px] font-semibold tracking-[-0.8px] mb-6">
          {isZh ? "准备好探索你的命运了吗？" : "Ready to explore your destiny?"}
        </h2>
        <Link href="/natal" className="inline-block no-underline text-sm font-medium px-8 py-3 bg-[#171717] text-white rounded-md hover:bg-black transition-colors">
          {isZh ? "立即开始" : "Get Started"}
        </Link>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-gray-200 py-6 text-center">
        <Link href="#" className="text-xs text-gray-400 no-underline mx-3 hover:text-[#171717]">{isZh ? "隐私政策" : "Privacy"}</Link>
        <Link href="#" className="text-xs text-gray-400 no-underline mx-3 hover:text-[#171717]">{isZh ? "服务条款" : "Terms"}</Link>
        <Link href="#" className="text-xs text-gray-400 no-underline mx-3 hover:text-[#171717]">{isZh ? "联系我们" : "Contact"}</Link>
      </footer>
    </div>
  );
}
