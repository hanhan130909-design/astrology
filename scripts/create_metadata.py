# Batch create metadata.ts files for all pages missing them
import os

pages = [
    {
        "name": "transits",
        "title": "推运分析",
        "template": "星缘推运盘",
        "desc": "免费生成专业推运盘分析，追踪行星换座对本命盘的影响。输入推运日期，获取行星行运与本命盘相位关系，AI智能分析运势转折点与发展机遇。支持多语言。",
        "kws": ["推运盘", "行运", "推运分析", "行星换座", "运势转折", "免费占星", "AI占星"],
    },
    {
        "name": "compatibility",
        "title": "星座配对分析",
        "template": "星缘星座配对",
        "desc": "免费生成双人星座配对分析，深入解读两人之间的契合度、互动模式与关系潜力。输入双方出生信息，AI智能分析爱情缘分、关系挑战与相处建议。",
        "kws": ["星座配对", "双人合盘", "配对分析", "星座比对", "关系分析", "免费占星", "AI合盘"],
    },
    {
        "name": "tarot",
        "title": "在线塔罗牌占卜",
        "template": "星缘塔罗牌",
        "desc": "免费在线塔罗牌占卜，AI智能解读塔罗牌阵含义。涵盖爱情、事业、财运、健康等多维度指引。专业塔罗师算法，精准解读你的命运密码。支持多语言，随时随地获取心灵指引。",
        "kws": ["塔罗牌", "塔罗占卜", "在线塔罗", "AI塔罗", "塔罗牌阵", "免费塔罗", "塔罗解读"],
    },
    {
        "name": "horoscope",
        "title": "每日/每月运势",
        "template": "星缘运势",
        "desc": "免费查看每日、每月、每年星座运势。涵盖爱情、事业、财运、健康全方位解读。AI智能分析，基于真实天文计算，助你把握运势走向，做出更好决策。支持12星座，中英文双语。",
        "kws": ["每日运势", "星座运势", "月运势", "年运势", "免费运势", "AI运势", "星座预测"],
    },
    {
        "name": "yearly-horoscope",
        "title": "年度运势预测",
        "template": "星缘年度运势",
        "desc": "免费查看12星座年度运势预测。AI智能分析全年星象运势，预测各领域发展趋势与机遇挑战，助你制定年度计划，做出更好决策。支持多语言。",
        "kws": ["年度运势", "年运势预测", "星座年运", "2026运势", "免费年运", "AI年度预测"],
    },
    {
        "name": "solar-return",
        "title": "太阳返照盘",
        "template": "星缘太阳返照盘",
        "desc": "免费生成太阳返照盘（Solar Return），分析该年生日后的运势走向。输入生日，精准计算太阳返照盘位置，AI解读该年整体运势、事业、爱情与财运发展趋势。",
        "kws": ["太阳返照盘", "Solar Return", "日返盘", "生日运势", "年运势", "AI占星"],
    },
    {
        "name": "lunar-return",
        "title": "月亮返照盘",
        "template": "星缘月亮返照盘",
        "desc": "免费生成月亮返照盘（Lunar Return），分析该月情绪与内在需求。输入出生信息，精准计算月亮返照盘位置，AI解读该月情绪、感情与生活各方面指引。",
        "kws": ["月亮返照盘", "Lunar Return", "月返盘", "情绪运势", "月运势", "AI占星"],
    },
    {
        "name": "progression",
        "title": "法达星限推运",
        "template": "星缘法达星限",
        "desc": "免费使用法达星限（Dasha）推运系统，分析人生各阶段行星周期与运势主题。输入出生信息，计算法达星限序列，AI解读各阶段行动主题与内在驱动力。",
        "kws": ["法达星限", "Dasha", "星限推运", "人生阶段", "行星周期", "免费占星", "AI推运"],
    },
    {
        "name": "composite",
        "title": "组合盘分析",
        "template": "星缘组合盘",
        "desc": "免费生成双人组合盘（Composite Chart），分析两人关系的共同星盘与互动模式。输入双方出生信息，计算组合盘行星落位与相位，AI深度解读关系特质与共同命运。",
        "kws": ["组合盘", "Composite", "双人星盘", "关系星盘", "组合盘分析", "免费占星", "AI合盘"],
    },
    {
        "name": "chart",
        "title": "星盘查询",
        "template": "星缘星盘",
        "desc": "免费在线星盘查询，支持本命盘、推运盘、合盘、日返盘等多种盘类型。基于真实天文计算，精准显示行星落位、星座分布与宫位信息，AI智能解读，助你读懂自己的星盘密码。",
        "kws": ["星盘查询", "在线排盘", "本命盘", "推运盘", "免费排盘", "AI星盘"],
    },
    {
        "name": "about",
        "title": "关于星缘",
        "template": "关于星缘",
        "desc": "星缘是一款基于真实天文计算与先进AI技术的专业占星平台。我们致力于为用户提供精准、深入的占星解读，帮助每个人更好地了解自己、规划人生。核心功能包括本命盘分析、AI智能解读、星座配对等。",
        "kws": ["关于星缘", "星缘占星", "AI占星", "占星平台", "关于我们"],
    },
    {
        "name": "community",
        "title": "星座社区",
        "template": "星缘星座社区",
        "desc": "免费加入星缘星座社区，与占星爱好者交流分享。讨论每日运势、星座配对、占星技巧，分享你的占星体验，探索星座的奥秘与乐趣。",
        "kws": ["星座社区", "占星社区", "星座论坛", "占星交流", "免费社区"],
    },
    {
        "name": "learn",
        "title": "占星学习",
        "template": "星缘占星学习",
        "desc": "免费学习占星知识，从入门到进阶。星缘提供系统的占星教程，涵盖星座基础知识、行星含义、宫位解读、相位分析等，帮助你从零开始成为占星达人。",
        "kws": ["占星学习", "占星教程", "星座知识", "入门占星", "免费学习", "占星课程"],
    },
]

base = r"C:\Users\user\.qclaw\astrology-clean\src\app"

for p in pages:
    path = os.path.join(base, p["name"], "metadata.ts")
    if os.path.exists(path):
        print(f"SKIP {p['name']} (already exists)")
        continue

    kws = ", ".join(p["kws"])
    content = f'''import type {{ Metadata }} from "next";

export const metadata: Metadata = {{
  title: {{
    default: "{p["title"]} - 星缘 | 免费AI占星 | {p["name"].title()}",
    template: "%s | {p["template"]}",
  }},
  description: "{p["desc"]}",
  keywords: [{kws}],
  openGraph: {{
    title: "{p["title"]} - 星缘 | 免费AI占星",
    description: "{p["desc"]}",
    type: "website",
    locale: "zh_CN",
    siteName: "星缘{p["template"]}",
  }},
  twitter: {{
    card: "summary_large_image",
    title: "{p["title"]} - 星缘 | 免费AI占星",
    description: "{p["desc"]}",
  }},
}};
'''
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"CREATED {p['name']}/metadata.ts")

print("Done!")