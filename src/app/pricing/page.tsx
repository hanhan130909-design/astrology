"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const T: Record<string, any> = {
  zh: {
    badge:"PRO", hero:"选择适合你的方案", heroSub:"基础功能永久免费。升级PRO解锁AI解读、年度报告、大师咨询等高级功能。",
    basic:"基础版", basicPrice:"免费", basicFeats:["本命星盘分析","每日运势","塔罗占卜","星座配对","行运追踪","基础社区功能"], basicCta:"开始使用",
    monthly:"PRO 月度", monthlyPrice:"¥29/月", monthlyFeats:["✅ 全部基础功能","AI 深度解读（无限次）","年度运势报告","大师咨询（每月1次）","高级合盘分析","优先客服支持"], monthlyCta:"订阅 PRO",
    yearly:"PRO 年度", yearlyPrice:"¥199/年", yearlyFeats:["✅ 全部基础功能","AI 深度解读（无限次）","年度运势报告 ×4","大师咨询（每月2次）","高级合盘分析","优先客服支持","专属占星课程"], yearlyCta:"订阅年度", yearlyBadge:"最超值",
    faq:"常见问题", perMonth:"/月",
    faqs:[{q:"PRO和基础版有什么区别？",a:"基础版包含本命盘、运势、塔罗等核心功能，完全免费。PRO版解锁AI深度解读、年度报告、大师咨询等高级内容。"},{q:"可以随时取消吗？",a:"可以。PRO订阅随时可取消，取消后下个周期不再续费，已付费周期内继续享受PRO权益。"},{q:"支持哪些支付方式？",a:"目前支持信用卡和Google Pay，更多支付方式陆续上线中。"},{q:"AI解读用的是哪个模型？",a:"PRO版AI解读使用先进的大语言模型，结合专业占星学知识库，提供个性化深度分析。"}]
  },
  en: {
    badge:"PRO", hero:"Choose Your Plan", heroSub:"Basic features are free forever. Upgrade to PRO for AI readings, yearly reports, and 1-on-1 consultations.",
    basic:"Basic", basicPrice:"Free", basicFeats:["Natal Chart Analysis","Daily Horoscope","Tarot Reading","Compatibility","Transit Tracking","Basic Community"], basicCta:"Get Started",
    monthly:"PRO Monthly", monthlyPrice:"$5/mo", monthlyFeats:["✅ All Basic Features","AI Deep Reading (Unlimited)","Yearly Horoscope Report","1-on-1 Consultation (1x/month)","Advanced Synastry","Priority Support"], monthlyCta:"Subscribe PRO",
    yearly:"PRO Yearly", yearlyPrice:"$35/yr", yearlyFeats:["✅ All Basic Features","AI Deep Reading (Unlimited)","Yearly Reports ×4","1-on-1 Consultation (2x/month)","Advanced Synastry","Priority Support","Exclusive Astrology Course"], yearlyCta:"Subscribe Yearly", yearlyBadge:"Best Value",
    faq:"FAQ", perMonth:"/mo",
    faqs:[{q:"What's the difference between Basic and PRO?",a:"Basic includes natal chart, horoscope, tarot and other core features — completely free. PRO unlocks AI deep reading, yearly reports, and expert consultations."},{q:"Can I cancel anytime?",a:"Yes. Cancel anytime and you won't be charged next cycle. You keep PRO benefits for the rest of the paid period."},{q:"What payment methods are supported?",a:"Currently credit card and Google Pay. More options coming soon."},{q:"Which AI model is used?",a:"PRO uses advanced LLM combined with professional astrology knowledge base for personalized deep analysis."}]
  },
  id: {
    badge:"PRO", hero:"Pilih Paket Anda", heroSub:"Fitur dasar gratis selamanya. Upgrade ke PRO untuk AI reading, laporan tahunan, dan konsultasi 1-on-1.",
    basic:"Basic", basicPrice:"Gratis", basicFeats:["Analisis Bagan Lahir","Horoskop Harian","Bacaan Tarot","Kompatibilitas","Pelacakan Transit","Komunitas Dasar"], basicCta:"Mulai",
    monthly:"PRO Bulanan", monthlyPrice:"Rp49rb/bln", monthlyFeats:["✅ Semua Fitur Basic","AI Deep Reading (Tak Terbatas)","Laporan Horoskop Tahunan","Konsultasi 1-on-1 (1x/bln)","Synastry Lanjutan","Dukungan Prioritas"], monthlyCta:"Berlangganan PRO",
    yearly:"PRO Tahunan", yearlyPrice:"Rp349rb/thn", yearlyFeats:["✅ Semua Fitur Basic","AI Deep Reading (Tak Terbatas)","Laporan Tahunan ×4","Konsultasi 1-on-1 (2x/bln)","Synastry Lanjutan","Dukungan Prioritas","Kursus Astrologi Eksklusif"], yearlyCta:"Berlangganan Tahunan", yearlyBadge:"Paling Hemat",
    faq:"FAQ", perMonth:"/bln",
    faqs:[{q:"Apa bedanya Basic dan PRO?",a:"Basic mencakup bagan lahir, horoskop, tarot gratis. PRO membuka AI deep reading, laporan tahunan, dan konsultasi ahli."},{q:"Bisa dibatalkan kapan saja?",a:"Ya. Batalkan kapan saja, tidak akan ditagih siklus berikutnya. Manfaat PRO tetap berlaku selama periode berbayar."},{q:"Metode pembayaran apa yang didukung?",a:"Saat ini kartu kredit dan Google Pay. Opsi lainnya segera hadir."},{q:"Model AI apa yang digunakan?",a:"PRO menggunakan LLM canggih yang dikombinasikan dengan basis pengetahuan astrologi profesional."}]
  }
};

export default function PricingPage() {
  const { language } = useLanguage();
  const t = T[language] || T.zh;
  
  const plans = [
    { name:t.basic, price:t.basicPrice, features:t.basicFeats, cta:t.basicCta, href:"/natal", primary:false },
    { name:t.monthly, price:t.monthlyPrice, features:t.monthlyFeats, cta:t.monthlyCta, href:"/login", primary:true },
    { name:t.yearly, price:t.yearlyPrice, features:t.yearlyFeats, cta:t.yearlyCta, href:"/login", primary:true, badge:t.yearlyBadge },
  ];

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      <main className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <span className="inline-block text-[11px] font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full mb-6 tracking-wide uppercase">{t.badge}</span>
          <h1 className="text-4xl font-semibold tracking-[-1.5px] mb-4">{t.hero}</h1>
          <p className="text-gray-500 max-w-lg mx-auto">{t.heroSub}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-[960px] mx-auto mb-20">
          {plans.map((plan, i) => (
            <div key={i} className={`relative rounded-xl p-8 ${plan.primary ? 'bg-[#171717] text-white' : 'bg-white'}`}
              style={!plan.primary ? {boxShadow:"0px 0px 0px 1px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.04)"} : {}}>
              {plan.badge && <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-semibold px-3 py-1 rounded-full bg-white text-[#171717] shadow-sm">{plan.badge}</span>}
              <h3 className={`text-lg font-semibold mb-1 ${plan.primary ? 'text-white' : 'text-[#171717]'}`}>{plan.name}</h3>
              <div className={`text-3xl font-semibold tracking-[-1px] mb-6 ${plan.primary ? 'text-white' : 'text-[#171717]'}`}>
                {plan.price}<span className="text-sm font-normal text-gray-400"> {t.perMonth}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f: string, j: number) => (
                  <li key={j} className={`text-sm flex items-start gap-2 ${plan.primary ? 'text-gray-300' : 'text-gray-600'}`}><span className="shrink-0 mt-0.5">•</span> {f}</li>
                ))}
              </ul>
              <Link href={plan.href} className={`block text-center text-sm font-medium py-2.5 rounded-md transition-colors ${plan.primary ? 'bg-white text-[#171717] hover:bg-gray-100' : 'bg-[#171717] text-white hover:bg-black'}`}>{plan.cta}</Link>
            </div>
          ))}
        </div>
        <div className="max-w-[640px] mx-auto">
          <h2 className="text-2xl font-semibold tracking-[-0.8px] text-center mb-8">{t.faq}</h2>
          <div className="space-y-3">
            {(t.faqs as any[]).map((faq: any, i: number) => (
              <details key={i} className="group border border-gray-200 rounded-lg">
                <summary className="p-4 text-sm font-medium cursor-pointer list-none flex items-center justify-between text-gray-900 hover:bg-gray-50 transition-colors">{faq.q}<span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span></summary>
                <div className="px-4 pb-4 text-sm text-gray-600">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
