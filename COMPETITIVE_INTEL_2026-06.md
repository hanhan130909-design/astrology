# Competitive Intel — lunaxstar.com
> Last full update: 2026-06-26 | Next: daily cron auto-check
> See bottom for automated monitoring checklist

---

## 🀄 BaZi 赛道

| 竞品 | URL | 威胁 | 用户 | 定价 | 最新 |
|------|-----|------|------|------|------|
| **BaziAI** | bazi-ai.com | 🔴 高 | 50万+ | $14.99/月,年$99 | DeepSeek R1,请符$9.99,小红书裂变,占卜Tab新增 |
| **XuanSeal** | xuanseal.com | 🟡 中 | 未知 | $29.99/次,$99/年 | PH发布,BaZi+塔罗+数字学,英文为主 |
| **ShenShu AI** | shen-shu.com | 🟡 中 | 未知 | 完全免费 | PH发布,纯BaZi AI对话追问,中文 |
| **Cantian AI** | cantian.ai | 🟡 中 | 1M+ | 免费 | 开源,MCP,BaZi+风水+起名+起卦 |
| **Nummi** | App Store | 🟢 低 | 登顶App Store | 内购 | AI Vedic占星,App-only |

## ♈ 西方占星赛道

| 竞品 | 威胁 | 数据 | 定价 | 备注 |
|------|------|------|------|------|
| **Co-Star** | 🟢 低 | 1500万下载 | $2.99/月 | App-only,无BaZi,NASA数据 |
| **The Pattern** | 🟢 低 | ~$300K/月 | $14.99/月 | 人格社交,仅英文 |

## 🛡️ 星缘的护城河

| 优势 | 星缘 | 所有竞品 |
|------|:---:|:---:|
| 8 语言 | ✅ | ❌ |
| BaZi + 西方双轨 | ✅ | ❌ |
| 免费排盘 + AI 对话 | ✅ | 部分 |
| 一次性付款 ($3.99-$39.99) | ✅ | BaziAI/Co-Star仅订阅 |
| 160+ SEO 文章 + Schema | ✅ | 无 |
| Newsletter 自动周运势 | ✅ | 无 |
| Shop 壁纸衍生品 ($9.99) | ✅ | 部分 |
| Product Hunt launch | ❌ | XuanSeal/ShenShu ✅ |
| 小红书/社交裂变 | ❌ | BaziAI ✅ |
| 请符周边 ($9.99) | ❌ | BaziAI ✅ |
| App 端 | ❌ | Co-Star ✅ |

## 🔍 每日监控清单（喂进 cron 脚本）

### 竞品网站（每日 HEAD 检查，异常则告警）
```
https://bazi-ai.com
https://xuanseal.com
https://shen-shu.com
https://cantian.ai
https://www.producthunt.com/products/starry-fate
```

### Google 搜索信号（搜对应关键词，看星缘排名变化）
```
site:lunaxstar.com 新收录 (用 GSC API)
"bazi calculator" 排名
"free natal chart" 排名
"chinese astrology" 排名
"zodiac compatibility" 排名
```

### 竞品动态关键词推送（有新结果说明竞品在动）
```
BaziAI new feature 2026
Cantian AI update 2026
XuanSeal pricing change 2026
new bazi app 2026
free astrology site launched 2026
```

### 星缘自身（每日检查）
```
lunaxstar.com 首页 200
lunaxstar.com/blog listing 200
所有 API 端点正常 (subscribe/newsletter/cron)
GA4 指标 (活跃用户/流量来源)
GSC 展示/点击/收录数
Ads 花费/转化 (如有)
```

### 新竞品发现（每周一次深度搜）
```
"AI bazi" free online
"八字AI" 免费
"free astrology AI" new site
"zodiac AI" app launch
```
