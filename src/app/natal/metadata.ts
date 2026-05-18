import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "免费本命盘在线排盘 | 星缘AI占星解读 | Starry Fate",
    template: "%s | 星缘本命盘",
  },
  description: "免费本命盘在线排盘，基于真实天文计算，提供精准的星座分析和AI智能解读。输入出生时间地点，生成专业星盘报告，解读命盘奥秘。",
  keywords: ["本命盘", "natal chart", "在线排盘", "免费占星", "AI占星解读", "星盘分析", "上升星座", "月亮星座"],
  openGraph: {
    title: "免费本命盘在线排盘 | 星缘AI占星解读",
    description: "免费本命盘在线排盘，基于真实天文计算，提供精准的星座分析和AI智能解读。",
    type: "website",
    locale: "zh_CN",
    siteName: "星缘",
  },
  twitter: {
    card: "summary_large_image",
    title: "免费本命盘在线排盘 | 星缘AI占星解读",
    description: "免费本命盘在线排盘，基于真实天文计算，提供精准的星座分析和AI智能解读。",
  },
};
