import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "免费星座合盘比对 | 双人关系分析 | 星缘占星",
    template: "%s | 星缘合盘",
  },
  description: "免费星座合盘在线比对，分析两人星盘互动关系。爱情配对、友情兼容性、合作关系全方位解读，帮你了解彼此星座匹配度。",
  keywords: ["合盘", "星座配对", "synastry", "双人关系", "爱情合盘", "星座兼容性", "关系占星"],
  openGraph: {
    title: "免费星座合盘比对 | 双人关系分析 | 星缘占星",
    description: "免费星座合盘在线比对，分析两人星盘互动关系。爱情配对、友情兼容性全方位解读。",
    type: "website",
    locale: "zh_CN",
    siteName: "星缘",
  },
  twitter: {
    card: "summary_large_image",
    title: "免费星座合盘比对 | 双人关系分析 | 星缘占星",
    description: "免费星座合盘在线比对，分析两人星盘互动关系。爱情配对、友情兼容性全方位解读。",
  },
};
