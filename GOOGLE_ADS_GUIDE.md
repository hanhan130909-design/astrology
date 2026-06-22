# Google Ads 设置完整指南 — 星缘 (lunaxstar.com)

本指南将逐步教你如何创建 Google Ads 账户、获取转化跟踪 ID 和再营销 ID、将其配置到星缘网站中，并创建搜索广告系列。

---

## 第一步：创建 Google Ads 账户

1. **访问 ads.google.com**
   - 打开浏览器，前往 [https://ads.google.com](https://ads.google.com)
   - 点击页面中央的「**立即开始**」按钮（或「Start now」）

2. **使用 Google 账号登录**
   - 使用你现有的 Google/Gmail 账号登录（推荐使用管理 lunaxstar.com GA4 的同一个 Google 账号）
   - 如果没有 Google 账号，点击「创建账号」注册一个

3. **选择广告目标**
   - Google 会引导你选择一个广告目标（如「网站流量」、「销售」、「潜在客户」）
   - 初次设置建议选择「**网站流量**」（Website traffic）

4. **填写商家信息**
   - 商家名称：星缘（或 Starry Fate）
   - 网站网址：https://lunaxstar.com

5. **设置首个广告系列（可以先跳过）**
   - Google 会尝试引导你创建第一个广告系列。你可以选择「**跳过**」或「稍后创建」——先完成基础账户设置

6. **确认账户创建**
   - 完成以上步骤后，你的 Google Ads 账户就创建好了
   - 记录你的 **Google Ads 客户 ID**（格式为 XXX-XXX-XXXX，在页面右上角可见）

---

## 第二步：获取转化跟踪 ID（AW-XXXXXXXXX）

转化 ID 用于跟踪用户在你网站上的关键行为（如注册、生成星盘、订阅 newsletter 等）。

1. **进入转化设置页面**
   - 在 Google Ads 后台，点击右上角「**工具与设置**」（Tools & Settings，扳手图标）
   - 在「测量」（Measurement）栏目下，点击「**转化**」（Conversions）

2. **创建新的转化操作**
   - 点击蓝色的「**+ 新建转化操作**」（+ New conversion action）按钮
   - 选择「**网站**」（Website）作为转化来源

3. **配置转化事件**
   - **类别**：选择与你的目标匹配的类别（如「订阅」、「注册」或「购买」）
   - **转化名称**：输入易识别的名称，如「完成排盘」、「Newsletter订阅」、「注册用户」
   - **价值**：可以设置一个估算价值（如 ¥1），或选择「不指定价值」
   - **统计方式**：选择「每次」（Every）——即每次此操作都算一次转化
   - **转化时间范围**：默认 30 天即可
   - **归因模型**：选择「以数据为依据」（Data-driven）或「最终点击」（Last click）

4. **获取全局网站代码（Global Site Tag）**
   - 创建转化操作后，Google 会显示一个代码安装界面
   - **你的转化 ID** 就是代码中的 `AW-XXXXXXXXX` 格式
   - 记录下这个 ID，例如：`AW-1234567890`

5. **你可能已有的转化事件示例：**
   - 用户完成免费排盘 → 转化名「排盘完成」
   - 用户注册账号 → 转化名「用户注册」
   - 用户订阅 newsletter → 转化名「Newsletter订阅」

---

## 第三步：获取再营销标签 ID（G-XXXXXXXXX）

再营销 ID 用于向访问过你网站的用户投放定向广告。

1. **进入受众管理器**
   - 在 Google Ads 后台，点击「**工具与设置**」→「**共享库**」（Shared Library）
   - 点击「**受众管理器**」（Audience Manager）

2. **设置受众来源**
   - 在左侧菜单选择「**受众来源**」（Audience Sources）
   - 找到「Google Ads 代码」（Google Ads tag）部分
   - 点击「**设置代码**」（Set up tag）

3. **获取再营销 ID**
   - 如果你已经安装了 GA4（lunaxstar.com 已安装），Google 会自动关联
   - **再营销 ID** 通常就是你的 Google Analytics 4 衡量 ID，格式为 `G-XXXXXXXXXX`
   - 如：`G-CSE41GD9JL`（这是你已有的 GA4 ID）
   - 你也可以在「Google Ads 代码」中看到专属的再营销标签 ID

4. **如果使用独立的再营销标签：**
   - 在受众来源页面，选择「安装代码自行设置」（Install the tag yourself）
   - Google 会给你一个代码片段，其中包含你的再营销 ID
   - 记录此 ID

---

## 第四步：替换星缘网站中的 ID

打开 `/src/app/layout.tsx` 文件，找到以下位置并替换：

### 当前文件中的占位 ID 位置（第 130-163 行）：

```javascript
/* --- Google Ads Conversion Tracking ---
   Replace AW-XXXXXXXXX with your real Google Ads Conversion ID */
gtag('config', 'AW-XXXXXXXXX');

/* --- Google Ads Remarketing ---
   Replace G-XXXXXXXXX with your real Google Ads Remarketing Tag ID */
gtag('config', 'G-XXXXXXXXX');

/* --- Remarketing event snippet --- */
gtag('event', 'page_view', {
  'send_to': 'AW-XXXXXXXXX',
});
```

### 替换步骤：

1. 打开文件 `/Users/hanhan/astrology/src/app/layout.tsx`
2. 搜索 `AW-XXXXXXXXX`（共 2 处）
3. 将 `AW-XXXXXXXXX` 替换为你的真实 Google Ads 转化 ID（如 `AW-1234567890`）
4. 搜索 `G-XXXXXXXXX`（共 1 处，在第 155 行附近）
5. 将 `G-XXXXXXXXX` 替换为你的真实再营销 ID（如 `G-ABCDEF1234`）

**注意：** 如果还没有获取到这些 ID，保持当前占位符不变即可——网站不会报错，只是不追踪 Google Ads 数据。

---

## 第五步：创建搜索广告系列

针对占星/命理类关键词投放搜索广告。

### 5.1 创建新广告系列

1. 在 Google Ads 后台，点击「**广告系列**」（Campaigns）
2. 点击蓝色的「**+ 新建广告系列**」（+ New campaign）
3. 选择广告目标：
   - 如果想获取网站访问量 → 选择「**网站流量**」（Website traffic）
   - 如果想获取注册/排盘用户 → 选择「**潜在客户**」（Leads）
   - 如果都有 → 选择「**在没有目标导向的情况下创建广告系列**」

4. 选择广告系列类型：选择「**搜索**」（Search）
5. 选择达成目标的方式：选择「**网站访问次数**」（Website visits）

### 5.2 广告系列设置

| 设置项 | 推荐值 | 说明 |
|---------|--------|------|
| 广告系列名称 | 星缘-搜索-免费排盘 | 便于识别的名称 |
| 投放网络 | 仅搜索网络 | 不包括展示网络（Display Network） |
| 地理位置 | 选择目标市场 | 建议：中国香港、台湾、新加坡、马来西亚、美国 |
| 语言 | 中文（简体）+ 中文（繁体）+ 英语 | 根据你的目标用户 |
| 每日预算 | ¥35-70（$5-10/天） | 初期建议设置较低预算测试效果 |
| 出价策略 | 点击次数（Maximize clicks） | 初始阶段积累数据 |
| 出价上限 | ¥3-5/次点击 | 设置合理的最高每次点击费用 |

### 5.3 关键词选择

建议投放以下关键词（使用「词组匹配」或「广泛匹配修饰符」）：

**八字/命理类：**
- 免费八字排盘
- 八字算命
- free bazi reading
- 八字命盘在线生成
- 四柱八字免费
- bazi calculator free
- bazi chart online

**占星类：**
- 免费本命盘
- 在线星盘
- free natal chart
- natal chart free
- astrology compatibility
- 星座配对免费
- 合盘分析

**通用类：**
- 免费占星
- 星座运势
- free horoscope
- 塔罗占卜免费
- AI占星解读

### 5.4 广告文案建议

**标题 1（最多 30 字符）：** 免费八字排盘 | 3秒出盘
**标题 2（最多 30 字符）：** AI解读 | 支持8种语言
**标题 3（最多 30 字符）：** 无需注册 | 完全免费

**描述 1（最多 90 字符）：** 基于真实天文计算的专业八字/占星排盘工具。支持AI智能解读、大运分析、合盘配对。免费使用。

**描述 2（最多 90 字符）：** 8种语言支持（中英日韩泰越印尼马来），全球用户信赖的专业命理平台。即刻免费生成你的专属命盘。

**最终到达网址：** https://lunaxstar.com/bazi（八字广告）/ https://lunaxstar.com/natal（星盘广告）

---

## 第六步：关联 Google Ads 与 GA4

将 Google Ads 与 Google Analytics 4 关联，实现从广告点击到用户行为的全漏斗追踪。

### 6.1 在 GA4 中关联

1. 登录 [Google Analytics](https://analytics.google.com)
2. 选择 lunaxstar.com 对应的 GA4 媒体资源（已绑定 G-CSE41GD9JL）
3. 点击左下角「**管理**」（Admin）
4. 在「媒体资源」列中，点击「**Google Ads 关联**」（Google Ads links）
5. 点击「**+ 关联**」（+ Link）
6. 选择你的 Google Ads 账户，点击「确认」
7. 启用「**启用个性化广告**」（Enable Personalized Advertising）
8. 启用「**启用自动标记**」（Enable Auto-tagging）
9. 点击「提交」

### 6.2 验证关联

- 关联完成后，GA4 中的「获客 → 流量获取」报告将显示 Google Ads 数据
- 你可以在 GA4 中创建「探索」报告，分析：
  - 哪些关键词带来了最多的排盘用户
  - 哪些广告组的转化率最高
  - 用户在完成排盘后的行为路径

---

## 预算与优化建议

### 初期预算（首月）

| 项目 | 建议日预算 | 月预算 |
|------|-----------|--------|
| 搜索广告（免费排盘关键词） | ¥35（$5） | ¥1,050 |
| 搜索广告（星座配对关键词） | ¥35（$5） | ¥1,050 |
| **总计** | **约 ¥70/天** | **约 ¥2,100/月** |

### 优化建议

1. **第 1 周**：收集数据，观察哪些关键词点击率高、成本低
2. **第 2 周**：暂停效果差的关键词（高花费低转化），增加效果好的关键词出价
3. **第 3 周**：添加否定关键词（如「免费 下载 app」「破解」等不相关词汇）
4. **第 4 周**：创建再营销列表，向已访问但未注册的用户投放展示广告

### 效果衡量指标

- **CTR（点击率）**：目标 > 3%
- **CPC（每次点击成本）**：目标 < ¥5
- **转化率**：目标 > 5%（访问→排盘完成）
- **每次转化成本**：目标 < ¥30

---

## 常见问题

### Q: 我的广告为什么没有展示？
A: 可能原因：① 每日预算太低；② 出价低于首页预估出价；③ 关键词搜索量低；④ 广告正在审核中。建议提高出价或预算。

### Q: 如何知道广告是否带来实际用户？
A: 在 GA4 中查看「流量获取 → Google Ads」报告，对比「新用户数」和「排盘完成」事件。

### Q: 需要同时使用 Google Ads 和 GA4 吗？
A: 是的。GA4 追踪用户在你网站上的所有行为（包括自然流量），Google Ads 追踪付费广告效果。两者关联后可以获得最完整的分析视角。

### Q: 如何防止竞争对手点击我的广告？
A: Google 会自动过滤无效点击。你也可以在「设置 → IP 排除」中排除公司 IP 地址。

---

如有任何问题，请查阅 [Google Ads 帮助中心](https://support.google.com/google-ads) 或向星缘开发团队咨询。
