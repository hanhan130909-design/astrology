import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "推运盘分析 - 星缘 | 免费占星推运 | Transit Chart",
    template: "%s | 星缘推运盘",
  },
  description: "免费生成专业推运盘分析，解读当前行星运行对你本命盘的影响。支持选择未来任意日期，查看行运相位、运势走向。AI智能解读，助你把握时机，顺势而为，规划美好未来。",
  keywords: ["推运盘", "transit chart", "行运分析", "占星推运", "行星运行", "运势预测", "免费推运", "AI占星解读"],
  openGraph: {
    title: "推运盘分析 - 星缘 | 免费占星推运",
    description: "免费生成专业推运盘分析，解读当前行星运行对你本命盘的影响。支持选择未来任意日期，查看行运相位、运势走向。",
    type: "website",
    locale: "zh_CN",
    siteName: "星缘推运盘",
  },
  twitter: {
    card: "summary_large_image",
    title: "推运盘分析 - 星缘 | 免费占星推运",
    description: "免费生成专业推运盘分析，解读当前行星运行对你本命盘的影响。",
  },
};
