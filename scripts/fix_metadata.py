# Fix garbled metadata.ts files and update login page language switch
import os

# Fix compare/metadata.ts
compare_content = '''import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "合盘分析 - 星缘 | 免费星座配对 | Compatibility Chart",
    template: "%s | 星缘合盘",
  },
  description: "免费生成专业合盘分析，解读两人星盘联动关系。支持本命盘比对、比较盘、组合盘三种模式。AI智能解读缘分匹配度、互动模式、合作关系，助你理解彼此。",
  keywords: ["合盘", "compatibility", "星座配对", "关系分析", "比较盘", "组合盘", "缘分合盘", "免费占星", "AI合盘解读"],
  openGraph: {
    title: "合盘分析 - 星缘 | 免费星座配对",
    description: "免费生成专业合盘分析，解读两人星盘联动关系。支持本命盘比对、比较盘、组合盘三种模式。AI智能解读缘分匹配度、互动模式、合作关系，助你理解彼此。",
    type: "website",
    locale: "zh_CN",
    siteName: "星缘合盘",
  },
  twitter: {
    card: "summary_large_image",
    title: "合盘分析 - 星缘 | 免费星座配对",
    description: "免费生成专业合盘分析，解读两人星盘联动关系。支持本命盘比对、比较盘、组合盘三种模式。AI智能解读缘分匹配度。",
  },
};
'''
with open(r"C:\Users\user\.qclaw\astrology-clean\src\app\compare\metadata.ts", "w", encoding="utf-8") as f:
    f.write(compare_content)
print("Fixed compare/metadata.ts")

# Fix horoscope/metadata.ts
horoscope_content = '''import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "每日/每月运势 - 星缘 | 免费星座运势解读 | Horoscope",
    template: "%s | 星缘运势",
  },
  description: "免费查看每日、每月、每年星座运势。涵盖爱情、事业、财运、健康全方位解读。AI智能分析，基于真实天文计算，助你把握运势走向，做出更好决策。支持12星座，中英文双语。",
  keywords: ["星座运势", "horoscope", "每日运势", "每月运势", "每年运势", "星座预测", "免费运势", "AI运势解读"],
  openGraph: {
    title: "每日/每月运势 - 星缘 | 免费星座运势",
    description: "免费查看每日、每月、每年星座运势。涵盖爱情、事业、财运、健康全方位解读。AI智能分析，基于真实天文计算，助你把握运势走向，做出更好决策。支持12星座，中英文双语。",
    type: "website",
    locale: "zh_CN",
    siteName: "星缘运势",
  },
  twitter: {
    card: "summary_large_image",
    title: "每日/每月运势 - 星缘 | 免费星座运势",
    description: "免费查看每日、每月、每年星座运势。涵盖爱情、事业、财运、健康全方位解读。AI智能分析，基于真实天文计算，助你把握运势走向。",
  },
};
'''
with open(r"C:\Users\user\.qclaw\astrology-clean\src\app\horoscope\metadata.ts", "w", encoding="utf-8") as f:
    f.write(horoscope_content)
print("Fixed horoscope/metadata.ts")

# Fix tarot/metadata.ts
tarot_content = '''import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "塔罗牌占卜 - 星缘 | 免费在线塔罗解读 | Tarot Reading",
    template: "%s | 星缘塔罗牌",
  },
  description: "免费在线塔罗牌占卜，AI智能解读塔罗牌阵含义。涵盖爱情、事业、财运、健康等多维度指引。专业塔罗师算法，精准解读你的命运密码。支持多语言，随时随地获取心灵指引。",
  keywords: ["塔罗牌", "tarot", "塔罗占卜", "在线塔罗", "AI塔罗", "塔罗牌阵", "免费塔罗", "塔罗解读"],
  openGraph: {
    title: "塔罗牌占卜 - 星缘 | 免费在线塔罗",
    description: "免费在线塔罗牌占卜，AI智能解读塔罗牌阵含义。涵盖爱情、事业、财运、健康等多维度指引。专业塔罗师算法，精准解读你的命运密码。支持多语言，随时随地获取心灵指引。",
    type: "website",
    locale: "zh_CN",
    siteName: "星缘塔罗牌",
  },
  twitter: {
    card: "summary_large_image",
    title: "塔罗牌占卜 - 星缘 | 免费在线塔罗",
    description: "免费在线塔罗牌占卜，AI智能解读塔罗牌阵含义。涵盖爱情、事业、财运、健康等多维度指引。",
  },
};
'''
with open(r"C:\Users\user\.qclaw\astrology-clean\src\app\tarot\metadata.ts", "w", encoding="utf-8") as f:
    f.write(tarot_content)
print("Fixed tarot/metadata.ts")

print("All garbled metadata fixed!")