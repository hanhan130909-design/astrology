import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "本命盘分析 - 星缘 | 免费AI占星解读 | Natal Chart",
    template: "%s | 星缘本命盘",
  },
  description: "免费生成专业本命盘分析，解读太阳、月亮、上升星座及全星盘行星分布。输入出生时间地点，获取精准的本命盘报告，了解性格特质、天赋潜能与人生轨迹。支持多语言，AI智能解读，助你读懂自己的星盘密码。",
  keywords: ["本命盘", "natal chart", "占星", "星座分析", "太阳星座", "月亮星座", "上升星座", "星盘解读", "免费占星", "AI占星"],
  openGraph: {
    title: "本命盘分析 - 星缘 | 免费AI占星解读",
    description: "免费生成专业本命盘分析，解读太阳、月亮、上升星座及全星盘行星分布。输入出生时间地点，获取精准的本命盘报告，了解性格特质、天赋潜能与人生轨迹。",
    type: "website",
    locale: "zh_CN",
    siteName: "星缘本命盘",
  },
  twitter: {
    card: "summary_large_image",
    title: "本命盘分析 - 星缘 | 免费AI占星解读",
    description: "免费生成专业本命盘分析，解读太阳、月亮、上升星座及全星盘行星分布。",
  },
};
