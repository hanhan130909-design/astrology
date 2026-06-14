import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "定价 - 解锁PRO功能 | 星缘",
  description: "星缘PRO会员 — 解锁AI深度解读、年度运势报告、大师一对一咨询等高级功能。"};

const plans = [
  {
    name: "基础版", enName: "Basic", price: "免费", enPrice: "Free", 
    features: ["本命星盘分析", "每日运势", "塔罗占卜", "星座配对", "行运追踪", "基础社区功能"],
    cta: "开始使用", href: "/natal", primary: false},
  {
    name: "PRO 月度", enName: "PRO Monthly", price: "¥29/月", enPrice: "$5/mo",
    features: ["✅ 全部基础功能", "AI 深度解读（无限次）", "年度运势报告", "大师咨询（每月1次）", "高级合盘分析", "优先客服支持"],
    cta: "订阅 PRO", href: "/login", primary: true},
  {
    name: "PRO 年度", enName: "PRO Yearly", price: "¥199/年", enPrice: "$35/yr",
    features: ["✅ 全部基础功能", "AI 深度解读（无限次）", "年度运势报告 ×4", "大师咨询（每月2次）", "高级合盘分析", "优先客服支持", "专属占星课程"],
    cta: "订阅年度", href: "/login", primary: true, badge: "最超值"},
];

const faqs = [
  { q:"PRO和基础版有什么区别？", a:"基础版包含本命盘、运势、塔罗等核心功能，完全免费。PRO版解锁AI深度解读、年度报告、大师咨询等高级内容。" },
  { q:"可以随时取消吗？", a:"可以。PRO订阅随时可取消，取消后下个周期不再续费，已付费周期内继续享受PRO权益。" },
  { q:"支持哪些支付方式？", a:"目前支持信用卡和Google Pay，更多支付方式陆续上线中。" },
  { q:"AI解读用的是哪个模型？", a:"PRO版AI解读使用先进的大语言模型，结合专业占星学知识库，提供个性化深度分析。" },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white text-[#171717]">
      <main className="max-w-[1200px] mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[11px] font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full mb-6 tracking-wide uppercase">PRO</span>
          <h1 className="text-4xl font-semibold tracking-[-1.5px] mb-4">选择适合你的方案</h1>
          <p className="text-gray-500 max-w-lg mx-auto">基础功能永久免费。升级PRO解锁AI解读、年度报告、大师咨询等高级功能。</p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 max-w-[960px] mx-auto mb-20">
          {plans.map((plan, i) => (
            <div key={i} className={`relative rounded-xl p-8 ${plan.primary ? 'bg-[#171717] text-white' : 'bg-white'}`}
              style={!plan.primary ? {boxShadow:"0px 0px 0px 1px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.04)"} : {}}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-semibold px-3 py-1 rounded-full bg-white text-[#171717] shadow-sm">{plan.badge}</span>
              )}
              <h3 className={`text-lg font-semibold mb-1 ${plan.primary ? 'text-white' : 'text-[#171717]'}`}>{plan.name}</h3>
              <div className={`text-3xl font-semibold tracking-[-1px] mb-6 ${plan.primary ? 'text-white' : 'text-[#171717]'}`}>
                {plan.price}<span className="text-sm font-normal text-gray-400"> /月</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className={`text-sm flex items-start gap-2 ${plan.primary ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span className="shrink-0 mt-0.5">•</span> {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href}
                className={`block text-center text-sm font-medium py-2.5 rounded-md transition-colors ${
                  plan.primary 
                    ? 'bg-white text-[#171717] hover:bg-gray-100' 
                    : 'bg-[#171717] text-white hover:bg-black'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-[640px] mx-auto">
          <h2 className="text-2xl font-semibold tracking-[-0.8px] text-center mb-8">常见问题</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="group border border-gray-200 rounded-lg">
                <summary className="p-4 text-sm font-medium cursor-pointer list-none flex items-center justify-between text-gray-900 hover:bg-gray-50 transition-colors">
                  {faq.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
