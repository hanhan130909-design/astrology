# Starry Fate / LunaXStar（lunaxstar.com）网站优化清单

> 审查时间：2026-11-02 · 对象：线上 lunaxstar.com（桌面 + 手机截图实测）+ 本地 ~/astrology 代码
> 用法：按条复制给豆包执行，A 组最先修。

## A. 必须修的 Bug（优先级最高）

1. **/natal 页面线上渲染无样式**——实测截图是裸 HTML：蓝色链接、素色表格、导航散架（Professional Natal Chart 快速制图那套）。检查该页（LegacyAstroTool 一系组件）的 CSS 是否没被打进 bundle，真机再复核一次。
2. **语言切换器撑爆导航**——8 个旗帜按钮平铺在导航栏里，桌面端溢出并盖住 Community，手机端挤在右上角。改成 🌐 图标 + 下拉菜单（LanguageSwitcher.tsx）。
3. **首页 hero 疑似双重渲染**——截图上同一句 headline 出现一淡一实两层。若是入场动画中间态需真机确认，若是隐藏 SEO h1 重复显示则直接修。
4. **品牌名不统一**——导航叫 Starry Fate，title/博客叫 LunaXStar，域名 lunaxstar.com，README 叫星缘占星。定一个，全站统一（含 og:site_name）。

## B. SEO（这个站的生命线）

1. **多语言是假的多语言**：切到 8 语种只是前端换词，路由只有 /en /id 存在，/es /pt /vi /ms /th /ja /ko /zh 全部 404；首页连 hreflang 都没有。两条路二选一：
   - 短期：砍掉没上线的语言选项，避免用户点到 404；
   - 长期：真做路由级 i18n + hreflang + 每语言 sitemap。目标市场是印尼的话 /id 必须是可索引的真实页面。
2. **博客 12 篇全是同一天（June 14, 2026）、同样 4 min read、同一张占位封面**——补真实发布日期和每篇独立封面图（搜引擎和用户都看得出来是模板批量货）。
3. 文章 slug 带 `-20/-30` 数字尾巴没问题，但抽查每篇 canonical 和 og:url 是否指向自身。
4. robots.txt / sitemap.xml 正常（200），canonical 首页正常，og:image 存在——这几项保持。

## C. 转化与移动端 UX

1. **手机端 headline 溢出**："You've Already Missed 2 Soul…" 被截断；邮箱输入框和橙色 CTA 按钮也溢出右边界。移动端是主力流量，必修。
2. **首屏空间浪费**：顶部到 headline 之间一大段空白，核心 CTA 掉到第二屏，往上提。
3. **底部弹层叠罗汉**：Cookie 提示条 + Add to Home Screen 同时弹、互相遮挡。限制同时只出现一个，A2H 冷却期至少 7 天。
4. **导航 12+ 项全平铺**：Horoscope/Chart/BaZi/QiMen/Strategy/Match/AI/Tarot/Transits/Learn/Community… 收敛成 4-5 个主入口 +「更多」下拉。
5. **见证卡片全是西文名字**（Sarah/Maya/Jessica）——主投印尼就换本地化见证和头像。
6. 信任行（12,000+ women…）字号太小，是仅次于 CTA 的转化元素，加大加显眼。

## D. 工程与协作

1. **本地有 4 个文件未提交**（src/app/bazi/page.tsx、src/app/compatibility/page.tsx、src/app/blog/more-seo-articles.ts、scripts/measure-symbols.ts），最后一次提交是 10-25。先让豆包 review + commit，再开新任务，避免改动互相覆盖。
2. 项目自带 `npm run test:acquisition` 自测链（SEO/博客/性能/移动端），每次改完必跑。
3. 部署走 Vercel（git push 或 npx vercel --prod），改完 A 组 bug 后先验证 /natal 再全量发。

## 未覆盖项

登录 / VIP 支付 / AI Reading 需要账号才能实测，未审；Firebase 数据流未审。
