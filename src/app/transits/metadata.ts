import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "免费推运盘在线查询 | 行运过境分析 | 星缘占星",
    template: "%s | 星缘推运盘",
  },
  description: "免费推运盘在线查询，基于真实天文数据计算行运过境。分析当前星体位置对命盘的影响，把握人生关键转折点，提前预知运势变化。",
  keywords: ["推运盘", "transit chart", "行运过境", "免费推运", "星盘推运", "运势变化", "占星预测"],
  openGraph: {
    title: "免费推运盘在线查询 | 行运过境分析 | 星缘占星",
    description: "免费推运盘在线查询，基于真实天文数据计算行运过境。分析当前星体位置对命盘的影响。",
    type: "website",
    locale: "zh_CN",
    siteName: "星缘",
  },
  twitter: {
    card: "summary_large_image",
    title: "免费推运盘在线查询 | 行运过境分析 | 星缘占星",
    description: "免费推运盘在线查询，基于真实天文数据计算行运过境。",
  },
};
