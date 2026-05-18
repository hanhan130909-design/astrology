import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "每日/每月运势 - 星缘 | 免费星座运势解读 | Horoscope",
    template: "%s | 星缘运势",
  },
  description: "免费查看每日、每月、每年星座运势。涵盖爱情、事业、财运、健康全方位解读。基于真实天文计算，AI智能分析，助你把握运势走向，做出更好决策。支持12星座，中英文双语。",
  keywords: ["星座运势", "horoscope", "每日运势", "每月运势", "每年运势", "占星预测", "星座分析", "免费运势", "AI运势解读"],
  openGraph: {
    title: "每日/每月运势 - 星缘 | 免费星座运势解读",
    description: "免费查看每日、每月、每年星座运势。涵盖爱情、事业、财运、健康全方位解读。基于真实天文计算，AI智能分析。",
    type: "website",
    locale: "zh_CN",
    siteName: "星缘运势",
  },
  twitter: {
    card: "summary_large_image",
    title: "每日/每月运势 - 星缘 | 免费星座运势解读",
    description: "免费查看每日、每月、每年星座运势。涵盖爱情、事业、财运、健康全方位解读。",
  },
};
