import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "合盘分析 - 星缘 | 免费星座配对 | Compatibility Chart",
    template: "%s | 星缘合盘",
  },
  description: "免费生成专业合盘分析，解读两人星盘互动关系。支持本命盘比对、比较盘、组合盘三种模式。AI智能解读情感缘分、合作潜力、沟通模式，助你了解彼此缘分。",
  keywords: ["合盘", "compatibility", "星座配对", "关系分析", "比较盘", "组合盘", "情感合盘", "免费占星", "AI合盘解读"],
  openGraph: {
    title: "合盘分析 - 星缘 | 免费星座配对",
    description: "免费生成专业合盘分析，解读两人星盘互动关系。支持本命盘比对、比较盘、组合盘三种模式。AI智能解读情感缘分、合作潜力。",
    type: "website",
    locale: "zh_CN",
    siteName: "星缘合盘",
  },
  twitter: {
    card: "summary_large_image",
    title: "合盘分析 - 星缘 | 免费星座配对",
    description: "免费生成专业合盘分析，解读两人星盘互动关系。支持本命盘比对、比较盘、组合盘三种模式。",
  },
};
