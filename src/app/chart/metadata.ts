import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "星盘查询 - 星缘 | 免费AI占星 | Chart",
    template: "%s | 星缘星盘",
  },
  description: "免费在线星盘查询，支持本命盘、推运盘、合盘、日返盘等多种盘类型。基于真实天文计算，精准显示行星落位、星座分布与宫位信息，AI智能解读，助你读懂自己的星盘密码。",
  keywords: [星盘查询, 在线排盘, 本命盘, 推运盘, 免费排盘, AI星盘],
  openGraph: {
    title: "星盘查询 - 星缘 | 免费AI占星",
    description: "免费在线星盘查询，支持本命盘、推运盘、合盘、日返盘等多种盘类型。基于真实天文计算，精准显示行星落位、星座分布与宫位信息，AI智能解读，助你读懂自己的星盘密码。",
    type: "website",
    locale: "zh_CN",
    siteName: "星缘星缘星盘",
  },
  twitter: {
    card: "summary_large_image",
    title: "星盘查询 - 星缘 | 免费AI占星",
    description: "免费在线星盘查询，支持本命盘、推运盘、合盘、日返盘等多种盘类型。基于真实天文计算，精准显示行星落位、星座分布与宫位信息，AI智能解读，助你读懂自己的星盘密码。",
  },
};
