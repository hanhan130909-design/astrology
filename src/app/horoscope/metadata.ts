import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "每日/每月运势免费查询 | 星座运势在线预测 | 星缘",
    template: "%s | 星缘运势",
  },
  description: "免费查询每日运势、每月运势。基于真实星盘计算，提供12星座精准运势预测。爱情、事业、财运全方位解读，助你把握每天运势走向。",
  keywords: ["每日运势", "每月运势", "星座运势", "horoscope", "zodiac fortune", "免费运势", "12星座"],
  openGraph: {
    title: "每日/每月运势免费查询 | 星座运势在线预测 | 星缘",
    description: "免费查询每日运势、每月运势。基于真实星盘计算，提供12星座精准运势预测。",
    type: "website",
    locale: "zh_CN",
    siteName: "星缘",
  },
  twitter: {
    card: "summary_large_image",
    title: "每日/每月运势免费查询 | 星座运势在线预测 | 星缘",
    description: "免费查询每日运势、每月运势。基于真实星盘计算，提供12星座精准运势预测。",
  },
};
