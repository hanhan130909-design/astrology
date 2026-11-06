/**
 * /life-comic — 免费 3 格预览入口
 *
 * 验证目标：用户填生日 → 看到专属文案的三格漫画 → 是否愿意保存/转发。
 * 服务端只做 metadata 与结构化数据，交互与出图卡片交给 LifeComicClient。
 */
import type { Metadata } from "next";
import { createPageMetadata, siteUrl } from "@/lib/seoMetadata";
import LifeComicClient from "./LifeComicClient";

export const metadata: Metadata = createPageMetadata({
  path: "/life-comic",
  title: "把你的人生写成一部漫画 · 免费看前 3 格",
  description:
    "输入生日，用真实八字排盘生成 12 格人生小传漫画，先看免费的前 3 格。固定角色「小月」演绎，字幕与旁白由你的出生信息实时生成。仅作文化娱乐参考。",
  keywords: [
    "AI 漫画",
    "八字漫画",
    "人生小传",
    "birth chart comic",
    "AI bazi comic",
    "personalized comic",
  ],
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "人生小传漫画 · 免费 3 格预览",
      url: siteUrl("/life-comic"),
      applicationCategory: "EntertainmentApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: "Enter your birth details to generate a personalized 12-panel illustrated life story. First 3 panels are free.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "画面是每个人都不一样的吗？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "目前免费预览使用固定角色「小月」的示例画面，字幕、旁白、配色与命盘字段都按你的出生信息实时生成。完整版会按你的命盘实时出图。",
          },
        },
        {
          "@type": "Question",
          name: "这个结果有预测作用吗？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "没有。内容由 AI 生成，以文化娱乐与自我表达为出发点，不构成任何人生、健康、财务或感情建议。",
          },
        },
      ],
    },
  ],
};

export default function LifeComicPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LifeComicClient />
    </>
  );
}
