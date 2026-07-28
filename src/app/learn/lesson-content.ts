// Full lesson content for BaZi + Zi Wei courses
// key format: "bazi-1" ... "bazi-7", "ziwei-1" ... "ziwei-5"

export interface LessonContent {
  zh: string;
  en: string;
}

export const lessonContent: Record<string, LessonContent> = {
  // ==================== BaZi ====================
  "bazi-1": {
    zh: `## 八字是什么？

八字，又称四柱命理学，是中国传统命理术数中最为精密和完善的一门学问。它的核心思想是——一个人出生的年、月、日、时，可以用天干地支的组合来表示，而这个组合决定了你一生的命运格局。

### 历史渊源

八字的起源可以追溯到唐朝。李虚中被认为是八字命理的奠基人，他提出以出生年月日三柱推算命运。到了宋朝，徐子平在前人基础上加入了"时辰"这一维度，形成了四柱八字的完整体系。因此八字也被称为"子平术"或"子平八字"。

### 四柱结构

你的八字由四根柱子组成：

- **年柱**：代表祖上、童年、家族背景
- **月柱**：代表父母、事业、青年时期
- **日柱**：代表你自己和配偶，是四柱的核心
- **时柱**：代表子女、晚年、最终归宿

每一柱由两个字组成——一个天干和一个地支，总共八个字，所以叫"八字"。

### 八字与五行

八字的基础是阴阳五行理论。十个天干和十二个地支各自对应五行属性（木火土金水），它们之间的生克关系构成了你命盘的能量结构。你的日柱天干就是你自己的"日主"，日主与其他干支的关系通过十神来解读。

### 为什么学八字？

八字能告诉你的是：你的天赋在哪里，你适合什么领域，你的婚姻关系如何，你的事业有多少起伏，你每个时间段的运势走向。它不像星座那样只分 12 种类型——八字的排列组合有 56 万种之多，甚至可以精确到具体的年月日时。`,
    en: `## What is BaZi?

BaZi, also known as the Four Pillars of Destiny, is one of the most precise and sophisticated systems in Chinese metaphysics. Its core idea: the year, month, day, and hour of your birth are expressed as combinations of Heavenly Stems and Earthly Branches, and this combination determines your entire life blueprint.

### Historical Origins

BaZi traces its roots to the Tang Dynasty. Li Xuzhong is considered the founder, using year, month, and day pillars for destiny analysis. In the Song Dynasty, Xu Ziping added the "hour" dimension, creating the complete Four Pillars system. This is why BaZi is also called "Ziping Art" or "Ziping Ba Zi."

### The Four Pillars Structure

Your BaZi consists of four pillars:

- **Year Pillar**: Ancestry, childhood, family background
- **Month Pillar**: Parents, career, young adulthood
- **Day Pillar**: You and your spouse — the core of the chart
- **Hour Pillar**: Children, later years, final destination

Each pillar has two characters — one Stem and one Branch — totaling eight characters, hence "Eight Characters" (BaZi).

### BaZi and the Five Elements

BaZi is built on Yin-Yang and Five Element theory. The 10 Stems and 12 Branches each correspond to one of the five elements (Wood, Fire, Earth, Metal, Water). Their generating and controlling relationships form the energy structure of your chart. Your Day Stem is your "Day Master" — your core self — and its relationships with other stems and branches are interpreted through the Ten Gods.

### Why Learn BaZi?

BaZi reveals: where your talents lie, what fields suit you, how your relationships unfold, how your career rises and falls, and your fortune at each stage of life. Unlike zodiac signs with only 12 types, BaZi has over 560,000 possible combinations, offering precision down to the specific year, month, day, and hour.`
  },

  "bazi-2": {
    zh: `## 天干与地支

天干地支是八字的字母表。如果你想读懂自己的命盘，第一步就是掌握这22个基础符号。

### 十天干

十天干分别是：甲、乙、丙、丁、戊、己、庚、辛、壬、癸。

它们分为阴阳两组，每组五个对应五行：

| 五行 | 阳干 | 阴干 |
|------|------|------|
| 木 | 甲 (Jia) | 乙 (Yi) |
| 火 | 丙 (Bing) | 丁 (Ding) |
| 土 | 戊 (Wu) | 己 (Ji) |
| 金 | 庚 (Geng) | 辛 (Xin) |
| 水 | 壬 (Ren) | 癸 (Gui) |

**记忆口诀**：甲木参天大树，乙木花草藤蔓。丙火太阳烈焰，丁火灯烛星光。戊土城墙大地，己土田园土壤。庚金刀斧利器，辛金珠宝首饰。壬水江河湖海，癸水雨露雾气。

### 十二地支

十二地支是：子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥。

每个地支对应一个生肖和五行，还包含一到三个藏干（隐藏的天干）：

| 地支 | 生肖 | 五行 | 藏干 |
|------|------|------|------|
| 子 | 鼠 | 水 | 癸 |
| 丑 | 牛 | 土 | 己癸辛 |
| 寅 | 虎 | 木 | 甲丙戊 |
| 卯 | 兔 | 木 | 乙 |
| 辰 | 龙 | 土 | 戊乙癸 |
| 巳 | 蛇 | 火 | 丙庚戊 |
| 午 | 马 | 火 | 丁己 |
| 未 | 羊 | 土 | 己丁乙 |
| 申 | 猴 | 金 | 庚壬戊 |
| 酉 | 鸡 | 金 | 辛 |
| 戌 | 狗 | 土 | 戊辛丁 |
| 亥 | 猪 | 水 | 壬甲 |

### 干支纪年（六十甲子）

天干有10个，地支有12个。它们两两配对，从甲子开始，到癸亥结束，形成60个组合，称为"六十甲子"或者"六十花甲子"。这就是中国传统干支纪年的基础——每60年一个循环。

### 八字中的应用

在你的八字命盘中，四柱各有一对干支：
- 年份的第一个字是天干，第二个字是地支
- 月份、日期、时辰也是如此

你的日柱天干就是判断你"日主"（核心人格）的关键——它决定了你的五行属性，以及所有十神关系。`,
    en: `## Heavenly Stems & Earthly Branches

The Heavenly Stems and Earthly Branches are the alphabet of BaZi. If you want to read your own chart, mastering these 22 symbols is step one.

### The 10 Heavenly Stems

The ten stems are: Jia, Yi, Bing, Ding, Wu, Ji, Geng, Xin, Ren, Gui.

They split into Yin-Yang pairs, each pair corresponding to one of the Five Elements:

| Element | Yang Stem | Yin Stem |
|---------|-----------|----------|
| Wood | 甲 (Jia) | 乙 (Yi) |
| Fire | 丙 (Bing) | 丁 (Ding) |
| Earth | 戊 (Wu) | 己 (Ji) |
| Metal | 庚 (Geng) | 辛 (Xin) |
| Water | 壬 (Ren) | 癸 (Gui) |

**Memory aid**: Jia Wood is a towering tree; Yi Wood is a vine or flower. Bing Fire is the blazing sun; Ding Fire is a candle flame. Wu Earth is a mountain; Ji Earth is garden soil. Geng Metal is an axe; Xin Metal is jewelry. Ren Water is the ocean; Gui Water is mist and dew.

### The 12 Earthly Branches

The twelve branches: Zi, Chou, Yin, Mao, Chen, Si, Wu, Wei, Shen, You, Xu, Hai.

Each branch maps to a zodiac animal, an element, and contains hidden stems:

| Branch | Animal | Element | Hidden Stems |
|--------|--------|---------|-------------|
| Zi | Rat | Water | Gui |
| Chou | Ox | Earth | Ji, Gui, Xin |
| Yin | Tiger | Wood | Jia, Bing, Wu |
| Mao | Rabbit | Wood | Yi |
| Chen | Dragon | Earth | Wu, Yi, Gui |
| Si | Snake | Fire | Bing, Geng, Wu |
| Wu | Horse | Fire | Ding, Ji |
| Wei | Goat | Earth | Ji, Ding, Yi |
| Shen | Monkey | Metal | Geng, Ren, Wu |
| You | Rooster | Metal | Xin |
| Xu | Dog | Earth | Wu, Xin, Ding |
| Hai | Pig | Water | Ren, Jia |

### The 60-Year Cycle (Sexagenary Cycle)

With 10 stems and 12 branches, they pair up in a fixed sequence — starting from Jia-Zi and ending with Gui-Hai — forming 60 unique combinations. This is the foundation of the traditional Chinese calendar: a 60-year cycle.

### Application in Your BaZi

In your birth chart, each of the four pillars has a Stem-Branch pair:
- Year's first character is the Stem, second is the Branch
- Same for Month, Day, and Hour

Your Day Stem is the key to identifying your "Day Master" (core personality) — it determines your element type and all Ten God relationships.`
  },

  "bazi-3": {
    zh: `## 日主——你的核心

日主是八字中最重要的概念。简单说，你的日柱天干就是你的"日主"——它代表你这个人本身。

### 如何找到你的日主？

在你的八字命盘中，第三柱（日柱）的第一个字就是日主天干。比如：
- 如果你出生在甲子日 → 日主是**甲木**（阳木）
- 如果你出生在丙午日 → 日主是**丙火**（阳火）
- 如果你出生在癸亥日 → 日主是**癸水**（阴水）

如果你还不知道自己的八字，可以去星缘的免费八字排盘页面输入出生信息，就能看到你的完整八字和日主。

### 十种日主的性格画像

**甲木（阳木）**：参天大树型人格。有领导力，敢担当，视野开阔，但容易固执己见。典型人物：企业家、管理者。

**乙木（阴木）**：藤蔓花草型人格。灵活适应，善于借助他人之力成长，外表柔和内心坚韧。适合做协调者、艺术家。

**丙火（阳火）**：太阳型人格。热情四射，感染力强，有号召力，但容易燃烧过度。天生的激励者、公众人物。

**丁火（阴火）**：烛火型人格。温柔但持久，细腻敏锐，善于洞察人心。适合做心理咨询、策划、研究。

**戊土（阳土）**：城墙型人格。稳重扎实，诚信可靠，有保护欲。优秀的执行者、后勤管理。

**己土（阴土）**：田园型人格。包容滋养，善于培育和耐心经营。天生的教育者、培育者。

**庚金（阳金）**：刀斧型人格。果断犀利，追求正义，行动力强，有时过于直率。适合做律师、军人、外科医生。

**辛金（阴金）**：珠宝型人格。精致优雅，追求完美，注重细节。适合做设计师、鉴定师、艺术家。

**壬水（阳水）**：江海型人格。思维开阔，自由奔放，智慧通达，但可能不太落地。天生的思想家、企业家。

**癸水（阴水）**：雨露型人格。细腻敏感，直觉力强，富有灵性，但容易吸收负面情绪。适合做灵性导师、治疗师。

### 身强与身弱

找到日主后，最重要的是判断"身强"还是"身弱"——也就是你的日主五行在整个命盘中的力量对比。身强的人通常个性独立、有主见、抗压能力强；身弱的人则更需要团队、善于借力、懂得审时度势。两者的喜忌完全不同，这就引入了"八字用神"的概念。`,
    en: `## Day Master — Your Core

The Day Master is the single most important concept in BaZi. Simply put, your Day Pillar's Heavenly Stem is your "Day Master" — it represents you, the person.

### How to Find Your Day Master

In your BaZi chart, the first character of the Day Pillar (third pillar) is your Day Master. For example:
- Born on a Jia-Zi day → Day Master is **Jia Wood** (Yang Wood)
- Born on a Bing-Wu day → Day Master is **Bing Fire** (Yang Fire)
- Born on a Gui-Hai day → Day Master is **Gui Water** (Yin Water)

If you don't know your BaZi yet, use the free BaZi calculator on lunaxstar to input your birth info and see your complete chart and Day Master.

### The 10 Day Master Personalities

**Jia Wood (Yang)** — The Towering Tree: Natural leader, visionary, responsible. Can be stubborn. Typical: entrepreneurs, executives.

**Yi Wood (Yin)** — The Vine: Flexible, adaptive, grows through others. Soft exterior, tough interior. Suited for: coordination, arts.

**Bing Fire (Yang)** — The Sun: Radiant, infectious energy, charismatic. Can burn out. Natural motivators, public figures.

**Ding Fire (Yin)** — The Candle: Gentle but enduring, perceptive, reads people well. Suited for: counseling, strategy, research.

**Wu Earth (Yang)** — The Wall: Steady, reliable, protective. Excellent executors, operations managers.

**Ji Earth (Yin)** — The Garden: Nurturing, patient, cultivates growth. Natural educators, mentors.

**Geng Metal (Yang)** — The Axe: Decisive, sharp, justice-oriented, direct. Suited for: law, military, surgery.

**Xin Metal (Yin)** — The Jewel: Refined, perfectionist, detail-oriented. Suited for: design, appraisal, fine arts.

**Ren Water (Yang)** — The Ocean: Expansive mind, free spirit, wise. May lack grounding. Thinkers, entrepreneurs.

**Gui Water (Yin)** — The Dew: Sensitive, intuitive, spiritual. Can absorb negativity. Suited for: spiritual guidance, healing arts.

### Strong vs Weak Day Master

After identifying your Day Master, the critical question is: is your Day Master "strong" or "weak"? This measures how much elemental support your Day Master has in the chart. Strong Day Masters tend to be independent and resilient. Weak Day Masters excel at collaboration and timing. Their preferences for favorable elements are completely opposite, which introduces the concept of the "Useful God" (Yong Shen).`
  },

  "bazi-4": {
    zh: `## 五行生克

五行——金、木、水、火、土——是八字命理的核心引擎。理解五行之间的相生相克关系，是读懂任何八字命盘的基础。

### 五行相生（生成循环）

五行相生形成一个良性的循环：

**木生火 → 火生土 → 土生金 → 金生水 → 水生木**

- **木生火**：木头燃烧产生火焰。在命理中，木旺的人天然能"生"出火的能量——创造力、热情、表现力。
- **火生土**：火焰燃尽后留下灰烬。火的激情和行动最终转化为土的稳定和积累。
- **土生金**：金属矿物埋藏于大地之中。土的承载和包容孕育出金的锋利和价值。
- **金生水**：金属在寒冷中凝结水珠。金的决断和切割能力生出水的智慧和流通。
- **水生木**：水灌溉树木。水的智慧滋养木的成长和发展。

### 五行相克（控制循环）

相克是一种制约关系，不是单纯的"克制"：

**木克土 → 土克水 → 水克火 → 火克金 → 金克木**

- **木克土**：树木扎根于土地，吸收土的养分。
- **土克水**：堤坝阻挡洪水。
- **水克火**：水能灭火。
- **火克金**：火能熔化金属。
- **金克木**：斧头砍伐树木。

### 实际应用

在解读八字时，生克关系决定了命盘中各元素之间的互动模式。举例：

- 如果你的日主是**甲木**，命盘中多土（木克土），说明你有掌控资源的能力——适合经商或管理。
- 如果日主是**丙火**，命盘中金多（火克金），你的行动力可以转化为财富或成就。
- 但如果你的日主是**甲木**，命盘中金多（金克木），金会"砍伐"你的木，可能代表压力、竞争或健康问题。

### 旺衰与调候

五行不只是生克，还要看**旺衰**——每个季节对应不同的五行旺衰状态。比如春天木旺、夏天火旺、秋天金旺、冬天水旺。出生季节本身就给了你某些天然优势或弱点。

另外，**调候**是八字中一个进阶的概念：有些命盘需要温度的调节（比如冬天出生需要火来暖局），有些需要湿度的平衡。`,
    en: `## Five Element Cycles

The Five Elements — Metal, Wood, Water, Fire, Earth — are the engine of BaZi. Understanding their generating and controlling relationships is the foundation for reading any chart.

### The Generating Cycle (Sheng)

The generating cycle creates a beneficial loop:

**Wood generates Fire → Fire generates Earth → Earth generates Metal → Metal generates Water → Water generates Wood**

- **Wood → Fire**: Wood burns to create flame. In BaZi, strong Wood naturally generates Fire energy — creativity, passion, expression.
- **Fire → Earth**: Fire leaves ash. Passion and action convert into Earth's stability and accumulation.
- **Earth → Metal**: Metals lie buried in the earth. Earth's containment births Metal's sharpness and value.
- **Metal → Water**: Metal condenses water droplets in cold. Metal's decisiveness generates Water's wisdom and flow.
- **Water → Wood**: Water nourishes trees. Water's wisdom feeds Wood's growth and development.

### The Controlling Cycle (Ke)

Control is a restraining relationship, not simply "destroying":

**Wood controls Earth → Earth controls Water → Water controls Fire → Fire controls Metal → Metal controls Wood**

- **Wood controls Earth**: Tree roots grip the soil, absorbing nutrients.
- **Earth controls Water**: Dams block floods.
- **Water controls Fire**: Water extinguishes fire.
- **Fire controls Metal**: Fire melts metal.
- **Metal controls Wood**: An axe fells a tree.

### Practical Application

When reading a BaZi chart, generating and controlling relationships determine how elements interact:

- If your Day Master is **Jia Wood** and the chart has lots of Earth (Wood controls Earth), you have the ability to command resources — suited for business or management.
- If your Day Master is **Bing Fire** and the chart has lots of Metal (Fire controls Metal), your drive translates into wealth and achievement.
- But if your Day Master is **Jia Wood** and the chart has lots of Metal (Metal controls Wood), Metal "chops" your Wood — possibly indicating pressure, competition, or health issues.

### Strength and Climate Adjustment

Beyond generating and controlling, you must consider **strength** — each season corresponds to different elemental strengths. Spring = Wood strong, Summer = Fire strong, Autumn = Metal strong, Winter = Water strong. Your birth season gives you natural advantages or vulnerabilities.

**Climate adjustment** (Tiao Hou) is an advanced BaZi concept: some charts need temperature regulation (winter births often need Fire to warm the chart), while others need moisture balance.`
  },

  "bazi-5": {
    zh: `## 十神入门

十神是八字命理中最实用的分析工具。它以你的日主为中心，将其他七个天干分为十种角色，每一种都代表了你人生中一个特定的领域或人物关系。

### 十神的来源

十神的命名方式很简单：比较每个天干与日主的五行生克关系和阴阳属性，得出十种不同的"神"。

### 正印（Positive Resource）

**生我且同阴阳**。代表母亲、教育、知识、保护。正印旺的人通常聪明好学，喜欢安稳，有贵人运。过旺则可能依赖性强，缺乏主见。

### 偏印（Negative Resource）

**生我且不同阴阳**。代表继母、特殊技能、偏门知识、灵性。偏印旺的人有独特天赋，思维不按常理出牌，适合科研、玄学、艺术创作。

### 正官（Positive Officer）

**克我且不同阴阳**。代表上司、规则、社会地位、丈夫（对女性而言）。正官旺的人纪律性强，尊重权威，追求社会认可。过旺可能变得保守刻板。

### 七杀（Negative Officer / Seven Killings）

**克我且同阴阳**。代表压力、竞争、权威挑战、情人（对女性而言）。七杀旺的人有极强的好胜心和执行力，能在压力下爆发潜力。但需要制化，否则容易惹麻烦。

### 正财（Positive Wealth）

**我克且不同阴阳**。代表工资收入、固定财产、妻子（对男性而言）。正财旺的人务实稳健，理财能力强，适合从事需要长期积累的行业。

### 偏财（Negative Wealth）

**我克且同阴阳**。代表投资收入、意外之财、生意、父亲。偏财旺的人慷慨大方，善于把握商机，风险承受能力强。过旺则可能花钱大手大脚。

### 食神（Food / Output）

**我生且同阴阳**。代表才华、口福、表达、享受。食神旺的人有艺术天赋，性格温和，懂得生活乐趣。适合从事创作、美食、教育等行业。

### 伤官（Hurting Officer / Talent）

**我生且不同阴阳**。代表才华外露、叛逆、创新、口才。伤官旺的人聪明绝顶、不守成规、擅长打破常规。但锋芒太露容易得罪人。

### 比肩（Friend / Peer）

**同我且同阴阳**。代表兄弟姐妹、同事、竞争关系。比肩旺的人独立自主、有竞争意识、朋友多。合作中容易产生竞争关系。

### 劫财（Rival / Rob Wealth）

**同我且不同阴阳**。代表朋友、合作者，也可能代表竞争者或"抢钱"的人。劫财旺的人社交能力强，善于合作，但也容易被朋友拖累。

### 十神的格局判断

一个人的八字中，十神的组合和强弱决定了职业倾向、财富获取方式、人际关系模式。比如正官正印旺的人适合体制内发展，食神生财的人适合自由职业或创业。`,
    en: `## Introduction to the Ten Gods

The Ten Gods are the most practical analytical tool in BaZi. Centered on your Day Master, the other seven stems are classified into ten roles — each representing a specific area of life or relationship.

### Where the Ten Gods Come From

The classification is simple: compare each stem against your Day Master by element relationship (generates, controls, same) and Yin-Yang polarity, yielding ten distinct "Gods."

### Positive Resource (Zheng Yin)

**Generates me, same polarity**. Represents: mother, education, knowledge, protection. Strong Resource people are intelligent, love learning, prefer stability. Excess may lead to dependency.

### Negative Resource (Pian Yin)

**Generates me, opposite polarity**. Represents: stepmother, special skills, esoteric knowledge, spirituality. These people have unique talents and unconventional thinking — suited for research, metaphysics, creative arts.

### Positive Officer (Zheng Guan)

**Controls me, opposite polarity**. Represents: boss, rules, social status, husband (for women). Strong Officer people are disciplined, respect authority, seek social recognition. Excess leads to rigidity.

### Seven Killings (Qi Sha)

**Controls me, same polarity**. Represents: pressure, competition, authority challenges, lover (for women). Strong Seven Killings people have intense drive and thrive under pressure. Needs balancing, or trouble follows.

### Positive Wealth (Zheng Cai)

**I control, opposite polarity**. Represents: salary, fixed assets, wife (for men). Strong Wealth people are practical, steady, good with money — suited for careers requiring long-term accumulation.

### Negative Wealth (Pian Cai)

**I control, same polarity**. Represents: investments, windfalls, business, father. These people are generous, seize opportunities, tolerate risk well. Excess leads to overspending.

### Food God (Shi Shen)

**I generate, same polarity**. Represents: talent, enjoyment, expression, pleasure. These people have artistic gifts, gentle personalities, love life's pleasures. Suited for creative, culinary, or educational work.

### Hurting Officer (Shang Guan)

**I generate, opposite polarity**. Represents: exposed talent, rebellion, innovation, eloquence. Extremely intelligent, rule-breaking, sharp-tongued. Brilliant but may offend others.

### Friend (Bi Jian)

**Same as me, same polarity**. Represents: siblings, colleagues, competition. Independent, competitive, well-connected. Prone to rivalry in collaborations.

### Rob Wealth (Jie Cai)

**Same as me, opposite polarity**. Represents: friends, collaborators — or competitors who "steal wealth." Socially adept but can be dragged down by friends.

### How to Use the Ten Gods

The combination and strength of Ten Gods in your chart determines career direction, wealth acquisition style, and relationship patterns. Someone with strong Officer + Resource suits institutional careers. Someone with Food generating Wealth suits freelancing or entrepreneurship.`
  },

  "bazi-6": {
    zh: `## 四柱解读

四柱八字中的每一柱都代表了你人生的一个维度。理解每一柱的含义，是打开命盘之门的钥匙。

### 年柱：祖业与童年

年柱代表你的家族背景、祖辈、童年环境和早年的运势。它不直接定义你的性格，但给你提供了一个起点。

- **年干**代表祖父、外在的家族形象
- **年支**代表祖母、家族的内在根基

如果年柱被冲克严重，可能代表童年经历动荡，或与家族关系疏离。年柱中带有印星，通常意味着你从小就获得了良好的教育和家庭支持。

### 月柱：事业与父母

月柱是四柱中最重要的一柱（仅次于日柱），因为它决定了你出生季节的五行强弱，也直接关联你的青年时期和事业发展。

- **月干**代表父亲、上司、外界环境
- **月支**代表母亲、你内心的基础支撑

月柱的五行力量往往决定了整盘的格局。比如春天出生（寅卯辰月），木的力量自然旺盛，不管你的日主是什么五行，木都扮演重要角色。

### 日柱：自我与配偶

日柱是四柱的核心——日干是你的日主（你自己），日支是你的配偶宫（婚姻对象）。

- **日干**就是你的日主，你的核心人格
- **日支**代表你的配偶特质和婚姻状况

日支十神对婚姻影响极大。日支是正官（对女性）或正财（对男性）通常代表稳定的婚姻。日支被冲，可能婚姻波折较多。

### 时柱：子女与晚年

时柱代表你的晚年运势、子女关系和最终的人生归宿。它也是你留给世界的"遗产"——不管是物质上的还是精神上的。

- **时干**代表外在的子女表现
- **时支**代表子女的内在本质和你的晚年生活

时柱好的人，往往晚年安稳、子女有成。时柱有食神或正印，通常代表子女缘不错。时柱如果与日柱相冲，可能和子女关系需要更多经营。

### 四柱联动

解读八字的艺术不在于孤立地看每一柱，而在于看四柱之间的互动——生克制化、刑冲合害。这才是八字精髓所在。`,
    en: `## Reading the Four Pillars

Each of the four pillars in your BaZi represents a dimension of your life. Understanding what each pillar means is the key to unlocking your chart.

### Year Pillar: Ancestry & Childhood

The Year Pillar represents your family background, ancestry, childhood environment, and early fortune. It doesn't directly define your personality but provides your starting point.

- **Year Stem**: Grandfather, external family image
- **Year Branch**: Grandmother, family's inner foundation

If the Year Pillar is heavily clashed or controlled, it may indicate a turbulent childhood or distant family ties. Resource stars in the Year Pillar usually mean strong education and family support from an early age.

### Month Pillar: Career & Parents

The Month Pillar is the most influential pillar after the Day Pillar — it determines the seasonal strength of elements and directly relates to your young adulthood and career.

- **Month Stem**: Father, superiors, external environment
- **Month Branch**: Mother, your inner foundation

The Month Pillar's element often defines the chart's structure. Spring births (Yin, Mao, Chen months) naturally have strong Wood energy — regardless of your Day Master, Wood plays a major role.

### Day Pillar: Self & Spouse

The Day Pillar is the core — the Day Stem is your Day Master (you), and the Day Branch is your Spouse Palace (marriage partner).

- **Day Stem**: Your Day Master, core personality
- **Day Branch**: Spouse characteristics and marriage quality

The Ten God in your Day Branch heavily influences marriage. Day Branch as Positive Officer (for women) or Positive Wealth (for men) typically indicates stable marriage. If your Day Branch is clashed, expect more ups and downs in relationships.

### Hour Pillar: Children & Later Years

The Hour Pillar represents your later years, relationship with children, and ultimate destination. It's also your "legacy" — material or spiritual — that you leave behind.

- **Hour Stem**: External expression of children
- **Hour Branch**: Children's inner nature and your retirement life

A good Hour Pillar means a peaceful later life and accomplished children. Food God or Resource in the Hour Pillar usually indicates good relationships with children. Day-Hour clashes may require more effort in parent-child relationships.

### Pillar Interactions

The art of reading BaZi isn't about analyzing pillars in isolation — it's about their interactions: generating, controlling, clashing, combining, harming. That's the essence of BaZi.`
  },

  "bazi-7": {
    zh: `## 大运与流年

如果八字是你的"出厂设置"，那么大运和流年就是你的"使用说明书"——它告诉你人生不同阶段的主题和重点。

### 什么是大运？

大运是十年一个周期的运势单位。每个人的大运从不同的年龄开始（根据出生年份的阴阳和性别来排），每十年切换一次。大运决定了你这十年的主题——是学习期、事业期、还是需要沉淀的时期。

### 大运的起运时间

起运时间是一个精确的计算结果：
- 阳年出生的男性、阴年出生的女性 → 顺排大运
- 阴年出生的男性、阳年出生的女性 → 逆排大运

起运年龄通常在 0 到 10 岁之间。最早的可能刚出生就起运，最晚的可能 9 岁多。

### 大运的解读方法

大运的十神决定了这十年的核心主题：

- **走印运**（正印或偏印）：学习和修炼的十年。适合考证、进修、充电，不适合冒险创业。
- **走官运**（正官或七杀）：事业发展的十年。适合追求晋升、建立社会地位，但七杀运需防压力过大。
- **走财运**（正财或偏财）：赚钱积累的十年。正财运适合储蓄和稳定投资，偏财运适合做生意。
- **走食伤运**（食神或伤官）：创作表达的十年。适合写作、艺术、创业，但伤官运需防口舌是非。
- **走比劫运**（比肩或劫财）：竞争和合作的十年。适合团队作战、开拓人脉，但需防财务流失。

### 流年的作用

流年是每一年的干支组合。流年就像天气——大运是季节（十年），流年是每天的天气变化。某一年可能触发你命盘中的一个关键组合，带来重大转变。

### 岁运并临

当大运和流年的干支相同时，称为"岁运并临"——能量加倍。可能是大喜也可能是大忧，取决于这个组合是喜是忌。

### 实用建议

了解自己的大运周期，可以帮助你：
1. 在合适的时机做合适的事（印运学习、财运投资）
2. 避开不适合的时间点（伤官运慎言、七杀运减压）
3. 提前为下一个十年做准备`,
    en: `## Luck Cycles & Annual Stars

If BaZi is your "factory settings," the Luck Cycle and Annual Stars are your "user manual" — they tell you what each life stage is about.

### What Are Luck Cycles?

A Luck Cycle (Da Yun) is a 10-year fortune period. Everyone's cycles begin at different ages (calculated by birth year's Yin-Yang and your gender). Each 10-year cycle has a theme — learning, career, or consolidation.

### When Your Luck Cycle Begins

The starting age is precisely calculated:
- Yang year males & Yin year females → forward cycles
- Yin year males & Yang year females → reverse cycles

Your first cycle typically begins between 0 and 10 years old. Some start immediately at birth, others as late as age 9+.

### Reading Your Luck Cycle

The Ten God of your current Luck Cycle defines the decade's theme:

- **Resource Cycle** (Positive or Negative): A decade of learning. Ideal for certifications, study, personal growth. Not ideal for risky ventures.
- **Officer Cycle** (Officer or Seven Killings): Career decade. Pursue promotions and status. Seven Killings cycles require stress management.
- **Wealth Cycle** (Positive or Negative): Wealth decade. Positive Wealth suits saving and stable investing. Negative Wealth suits business.
- **Output Cycle** (Food or Hurting Officer): Creative decade. Writing, arts, entrepreneurship. Hurting Officer cycles — watch your words.
- **Companion Cycle** (Friend or Rob Wealth): Competition and collaboration. Build networks and teams. Guard against financial leakage.

### Annual Stars (Liu Nian)

Each year has its own Stem-Branch combination. Annual stars are like daily weather — the Luck Cycle sets the climate (decade), the Annual Star is the day's weather. A particular year may trigger a key combination in your chart, bringing significant change.

### Year-Cycle Overlap (Sui Yun Bing Lin)

When the Luck Cycle and Annual Star share the same Stem-Branch, energy doubles. It can be great joy or great trouble — depends whether the combination is favorable to you.

### Practical Advice

Understanding your Luck Cycles helps you:
1. Do the right thing at the right time (study during Resource cycles, invest during Wealth cycles)
2. Avoid unsuitable timing (mind your words during Hurting Officer cycles, manage stress during Seven Killings)
3. Prepare for the next decade in advance`
  },

  // ==================== Zi Wei Dou Shu ====================
  "ziwei-1": {
    zh: `## 紫微斗数简介

紫微斗数是中国传统命理中与八字并列的另一大体系。如果说八字是"路"——告诉你人生的走向和运势——紫微斗数就是"车"——告诉你你这辆车的性能配置如何。

### 什么是紫微斗数？

紫微斗数以"紫微星"为核心，共 108 颗星曜，分布在 12 个宫位中。每颗星都有自己的含义和特性，组合起来就像一幅精密的人物关系图和人生地图。

### 核心三要素

紫微斗数由三个层次构成：

1. **12宫位**：命宫、兄弟宫、夫妻宫、子女宫、财帛宫、疾厄宫、迁移宫、交友宫、事业宫、田宅宫、福德宫、父母宫
2. **108颗星曜**：分主星（14颗）、辅星、杂曜等
3. **四化飞星**：化禄、化权、化科、化忌——每颗星在不同年份会有不同的四化状态

### 紫微斗数与八字的区别

| 维度 | 八字 | 紫微斗数 |
|------|------|----------|
| 时间精度 | 到时辰 | 到时辰 |
| 分析维度 | 五行生克 | 星曜互动 |
| 特色 | 运势走向 | 性格配置 |
| 可读性 | 较抽象 | 较直观 |
| 周期 | 十年大运 | 十年大限 |

### 为什么两者一起学？

八字告诉你"时机"——什么时候做什么事。紫微斗数告诉你"配置"——你擅长什么、需要补什么。两者结合，你得到的是一个完整的自我认知系统。

就像八字说"你 35 岁到 45 岁走财运"，紫微斗数会补充说"你的财帛宫里有太阴星+天机星——财运来自策划和女性贵人"。`,
    en: `## Introduction to Zi Wei Dou Shu

Zi Wei Dou Shu is one of the two major systems in Chinese metaphysics, alongside BaZi. If BaZi is the "road" — showing your life direction and fortune timing — Zi Wei Dou Shu is the "vehicle" — revealing your vehicle's specifications and capabilities.

### What Is Zi Wei Dou Shu?

Zi Wei Dou Shu is centered on the "Purple Star" (Zi Wei), with 108 stars distributed across 12 Palaces. Each star has its own meaning, and their combinations create a detailed map of personality, relationships, and life domains.

### Three Core Components

Zi Wei Dou Shu consists of three layers:

1. **12 Palaces**: Self, Siblings, Spouse, Children, Wealth, Health, Travel, Friends, Career, Property, Fortune, Parents
2. **108 Stars**: 14 Major Stars plus supporting and miscellaneous stars
3. **Four Transformations**: Prosperity, Authority, Reputation, Obstacle — stars transform differently each year

### BaZi vs Zi Wei Dou Shu

| Dimension | BaZi | Zi Wei Dou Shu |
|-----------|------|----------------|
| Time Precision | To the hour | To the hour |
| Analysis | Five Element cycles | Star interactions |
| Strength | Fortune timing | Personality configuration |
| Readability | More abstract | More intuitive |
| Cycles | 10-year Luck Cycles | 10-year Palace Limits |

### Why Learn Both?

BaZi tells you "when" — the timing of your actions. Zi Wei Dou Shu tells you "what" — your strengths and weaknesses. Together, they form a complete self-awareness system.

BaZi might say "You enter a Wealth cycle from 35 to 45." Zi Wei Dou Shu adds: "You have Tai Yin + Tian Ji in your Wealth Palace — wealth comes through strategy and female mentors."`
  },

  "ziwei-2": {
    zh: `## 十二宫详解

紫微斗数的十二个宫位，构成了你人生完整的版图。每一宫都有其特定的含义和解读方向。

### 命宫（Self Palace）

**最重要的宫位**。命宫代表你的核心人格、天生禀赋和整体运势基调。命宫里的主星决定了你给人的第一印象和你的思维模式。

例如：命宫有紫微星——天生的领导者气质，有威严。命宫有天机星——思维敏捷，聪明善变。

### 兄弟宫（Siblings Palace）

代表兄弟姐妹关系、同辈关系、以及你的母亲。也反映你的早期学习环境和沟通方式。

### 夫妻宫（Spouse Palace）

代表你的婚姻对象特质、婚姻质量，以及你对亲密关系的态度。对于事业型的人，夫妻宫也看合作关系。

### 子女宫（Children Palace）

代表子女缘分、亲子关系，也看你的创作能力、享受生活的方式。子女宫好的人通常也代表休闲生活丰富。

### 财帛宫（Wealth Palace）

代表你的赚钱能力、理财方式和对金钱的态度。注意：财帛宫看的是"赚钱的方式"，不是财富总额。

### 疾厄宫（Health Palace）

代表身体健康状况、疾病倾向和你的抗压能力。也反映你面对困难时的反应模式。

### 迁移宫（Travel Palace）

代表外出运、社会形象和你在外面的表现。迁移宫好的人适合在外地发展，或者在社会上有良好的公众形象。

### 交友宫（Friends / Servants Palace）

代表朋友关系、下属、合作伙伴。也反映你被人利用或得到帮助的倾向。

### 事业宫（Career Palace）

代表职业发展方向、工作态度和事业成就。事业宫的主星往往暗示了你适合的行业类型。

### 田宅宫（Property Palace）

代表家庭环境、不动产运和你的内心安全感。田宅宫好的人通常家庭和睦，置业顺利。

### 福德宫（Fortune / Spirituality Palace）

代表你的精神世界、福气和晚年生活质量。也反映你的兴趣爱好和内在满足感来源。

### 父母宫（Parents Palace）

代表父母关系、长辈缘和你的教育背景。也看你的上司关系和权威互动。

### 宫位之间的互动

每两个对宫（相隔六宫）形成对轴线，如命宫对迁移宫（自我 vs 社会形象），夫妻宫对事业宫（家庭 vs 事业）——这种对轴关系是紫微斗数中非常重要的分析工具。`,
    en: `## The 12 Palaces

The 12 Palaces of Zi Wei Dou Shu form your complete life map. Each palace has specific meanings and interpretation directions.

### Self Palace (Ming Gong)

**The most important palace**. Represents your core personality, innate talents, and overall life tone. The major star here defines your first impression and thinking patterns.

Example: Zi Wei in Self — natural leader, authoritative presence. Tian Ji in Self — quick-witted, intelligent, adaptable.

### Siblings Palace

Represents siblings, peer relationships, and your mother. Also reflects your early learning environment and communication style.

### Spouse Palace

Represents your marriage partner's traits, marriage quality, and your approach to intimacy. For career-oriented people, this palace also covers business partnerships.

### Children Palace

Represents children, parent-child relationships, creative ability, and how you enjoy life. A good Children Palace often indicates a rich leisure life too.

### Wealth Palace

Represents your earning style, money management, and attitude toward finances. Note: this shows *how* you earn, not total wealth.

### Health Palace

Represents physical health, disease tendencies, and stress tolerance. Also reflects your response patterns when facing difficulties.

### Travel Palace

Represents external fortune, social image, and how you appear in public. A strong Travel Palace suits relocating or having a prominent public image.

### Friends Palace

Represents friendships, subordinates, business partners. Also indicates your tendency to be helped or taken advantage of.

### Career Palace

Represents career direction, work attitude, and professional achievement. The major star often hints at your suitable industry.

### Property Palace

Represents home environment, real estate fortune, and inner sense of security. A good Property Palace usually means harmonious family and smooth property acquisition.

### Fortune Palace

Represents your spiritual world, blessings, and quality of later life. Also reflects hobbies and sources of inner fulfillment.

### Parents Palace

Represents relationship with parents, mentor connections, and educational background. Also covers your interactions with authority figures.

### Palace Interactions

Opposing palace pairs (six palaces apart) form axis lines: Self vs Travel (self-identity vs social image), Spouse vs Career (family vs work). These axis relationships are crucial analytical tools in Zi Wei Dou Shu.`
  },

  "ziwei-3": {
    zh: `## 紫微星详解

紫微星是紫微斗数中最尊贵的一颗星，称为"帝星"或"北斗主星"。命宫有紫微的人，天生自带一种不怒自威的气质。

### 紫微星的特质

紫微代表领导力、权威、自尊和掌控欲。它是一颗"帝王星"，需要辅星（左辅右弼）来配合才能发挥最大力量。紫微人在团队中往往是决策者，但也容易过于独断或好面子。

### 紫微在十二宫

- **紫微在命宫**：天生的领导者，有自尊心，喜欢掌控局面
- **紫微在夫妻宫**：配偶有领导气质，或婚姻中权力感较明显
- **紫微在财帛宫**：钱财管理有方，适合做大格局的财务管理
- **紫微在事业宫**：适合管理岗位、政府机构或大企业
- **紫微在子女宫**：子女有主见、有领导力
- **紫微在迁移宫**：在外有威望，容易获得社会地位

### 紫微星的吉凶搭配

紫微星的力量与它同宫的辅星密切相关：

- **紫微+左辅+右弼**：最佳组合，左右手齐全，领导力发挥到极致
- **紫微+文昌+文曲**：文武双全，适合学术研究或文化管理
- **紫微+天相**：稳重有礼，适合从政或公共服务
- **紫微+煞星**（擎羊、陀罗等）：权威受到挑战，容易陷入权力斗争

### 紫微星的四化

紫微星只有"化权"和"化科"，不会"化禄"或"化忌"：
- **紫微化权**：权威感更强，控制欲增加
- **紫微化科**：名声和声望的提升，更注重形象

### 紫微星小结

如果你命宫有紫微星，你不是普通人——你是朋友圈里那个别人遇到问题会第一个想到的人。但记住：帝王需要贤臣，单打独斗的紫微是孤独的。`,
    en: `## The Purple Star (Zi Wei)

Zi Wei is the most prestigious star in Zi Wei Dou Shu, known as the "Emperor Star" or "Northern Dipper's Chief." Those with Zi Wei in their Self Palace carry a natural air of authority.

### Traits of Zi Wei

Zi Wei represents leadership, authority, self-respect, and desire for control. As the "Emperor Star," it works best with supporting ministers (Zuo Fu and You Bi). Zi Wei people tend to be decision-makers in groups, but can also be stubborn or image-conscious.

### Zi Wei Across the 12 Palaces

- **Zi Wei in Self Palace**: Born leader, strong self-esteem, loves control
- **Zi Wei in Spouse Palace**: Partner has leadership qualities, power dynamics in marriage
- **Zi Wei in Wealth Palace**: Strategic with money, suited for large-scale financial management
- **Zi Wei in Career Palace**: Suited for management, government, or large corporations
- **Zi Wei in Children Palace**: Strong-willed children with leadership traits
- **Zi Wei in Travel Palace**: Respected publicly, easily gains social status

### Zi Wei's Combinations

Zi Wei's power depends heavily on accompanying stars:

- **Zi Wei + Zuo Fu + You Bi**: Best configuration — both ministers present, leadership at its peak
- **Zi Wei + Wen Chang + Wen Qu**: Scholar-warrior, suited for academia or cultural management
- **Zi Wei + Tian Xiang**: Dignified and courteous, suited for politics or public service
- **Zi Wei + Negative Stars**: Authority challenged, prone to power struggles

### Zi Wei's Transformations

Zi Wei only transforms to Authority (Hua Quan) and Reputation (Hua Ke), never to Prosperity or Obstacle:
- **Zi Wei Hua Quan**: Intensified authority, more controlling
- **Zi Wei Hua Ke**: Enhanced reputation, more image-conscious

### Summary

If Zi Wei is in your Self Palace, you're not ordinary — you're the person friends call first when they need help. But remember: emperors need ministers. A solitary Zi Wei is a lonely one.`
  },

  "ziwei-4": {
    zh: `## 主星和辅星

紫微斗数有 14 颗主星和数十颗辅星。理解它们的分组和特质，是解读命盘的关键。

### 14 颗主星

主星分为两大星系：

**紫微星系（北斗）**：
- 紫微（帝王）：权威、领导
- 天机（谋士）：智慧、变动
- 太阳（光明）：热情、付出
- 武曲（财富）：执行力、刚毅
- 天同（福气）：温和、享受
- 廉贞（复杂）：多面、极端

**天府星系（南斗）**：
- 天府（库藏）：稳重、包容
- 太阴（月亮）：细腻、财富
- 贪狼（欲望）：多才、桃花
- 巨门（暗口）：口才、是非
- 天相（印信）：服务、协调
- 天梁（荫庇）：成熟、庇佑
- 七杀（将星）：魄力、决断
- 破军（先锋）：破坏、重建

### 六吉星（辅助之星）

- **左辅、右弼**：左膀右臂，增加贵人运和团队支持
- **文昌、文曲**：文才和学习能力，科举之星
- **天魁、天钺**：贵人星，代表不同层级的帮助

### 六煞星（挑战之星）

- **擎羊、陀罗**：突然的冲突和慢性困扰
- **火星、铃星**：急性冲动和突发意外
- **地劫、地空**：精神层面的波折和独特天赋

### 星曜的宫位互动

同一颗星在不同宫位表现完全不同。比如：
- 贪狼在命宫：多才多艺，桃花旺
- 贪狼在财帛宫：赚钱方式灵活，但需防欲望过度
- 贪狼在夫妻宫：感情丰富但需防第三者`,
    en: `## Major & Minor Stars

Zi Wei Dou Shu has 14 Major Stars and dozens of supporting stars. Understanding their groupings and traits is key to chart reading.

### The 14 Major Stars

Major stars divide into two groups:

**Zi Wei Group (Northern Dipper)**:
- Zi Wei (Emperor): Authority, leadership
- Tian Ji (Strategist): Intelligence, adaptability
- Tai Yang (Sun): Enthusiasm, generosity
- Wu Qu (Finance): Execution, determination
- Tian Tong (Blessing): Gentleness, enjoyment
- Lian Zhen (Complexity): Multi-faceted, extreme

**Tian Fu Group (Southern Dipper)**:
- Tian Fu (Treasury): Stability, inclusiveness
- Tai Yin (Moon): Sensitivity, wealth
- Tan Lang (Desire): Versatility, romance
- Ju Men (Dark Gate): Eloquence, disputes
- Tian Xiang (Seal): Service, coordination
- Tian Liang (Shelter): Maturity, protection
- Qi Sha (General): Decisiveness, courage
- Po Jun (Vanguard): Destruction, reconstruction

### Six Lucky Stars

- **Zuo Fu, You Bi**: Hands and feet — boost mentor luck and team support
- **Wen Chang, Wen Qu**: Academic and literary talent
- **Tian Kui, Tian Yue**: Nobleman stars, representing different levels of help

### Six Challenge Stars

- **Qing Yang, Tuo Luo**: Sudden conflicts and chronic troubles
- **Huo Xing, Ling Xing**: Acute impulsiveness and accidents
- **Di Jie, Di Kong**: Spiritual challenges and unique gifts

### Star-Palace Interactions

The same star behaves differently across palaces. For example:
- Tan Lang in Self Palace: Multi-talented, strong romantic appeal
- Tan Lang in Wealth Palace: Flexible earning methods, but watch for excess desire
- Tan Lang in Spouse Palace: Rich emotional life, guard against third parties`
  },

  "ziwei-5": {
    zh: `## 四化飞星

四化飞星是紫微斗数中的动态能量系统。如果说宫位和星曜是命盘的"硬件配置"，四化就是"运行状态"——它告诉你在不同时间点，哪颗星被激活了。

### 四化的含义

四化让星曜的特质发生变形：

- **化禄（Prosperity）**：让星曜的能量变成财富、机会和好处。好事变多，但也可能让人松懈。
- **化权（Authority）**：让星曜的能量变成掌控力、权威和执行力。让你有能力去推动事情。
- **化科（Reputation）**：让星曜的能量变成名声、认可和贵人。提升你的社会形象。
- **化忌（Obstacle）**：让星曜的能量变成阻碍、挑战和需要面对的课题。不是坏事，但从中学到的最多。

### 生年四化

出生年份决定了四颗星分别化禄、化权、化科、化忌——这叫"生年四化"，跟随你一辈子，是你的先天配置。

比如：2026丙午年出生的人，生年四化为：丙干廉贞化忌、文昌化科、天相化禄、天同化权。

### 大限四化与流年四化

除了生年四化，每十年的大限和每年的流年也会产生新的四化。多层四化叠加时，某颗星可能同时化禄又化忌——那就是典型的"福祸相依"格局。

### 四化的实用解读

- **看财**：化禄在哪一宫，财运机会就在哪
- **看权**：化权在哪一宫，掌控力和执行力就在哪
- **看名**：化科在哪一宫，名声和人缘就在哪
- **看坎**：化忌在哪一宫，人生的功课和成长就在哪

### 四化口诀

天干四化口诀是紫微斗数必备技能：
甲廉破武阳、乙机梁紫阴、丙同机昌廉、丁阴同机巨、戊贪阴右机、己武贪梁曲、庚阳武阴同、辛巨阳曲昌、壬梁紫左武、癸破巨阴贪。

每句代表该天干对应的四化星（顺序：禄权科忌）。熟记口诀，你就能自己推算了。`,
    en: `## The Four Transformations

The Four Transformations (Si Hua) are Zi Wei Dou Shu's dynamic energy system. If palaces and stars are the "hardware," the Four Transformations are the "runtime state" — telling you which stars are activated at any given time.

### What the Four Transformations Mean

Transformations modify a star's energy:

- **Hua Lu (Prosperity)**: Turns star energy into wealth, opportunities, and benefits. Good things multiply, but may lead to complacency.
- **Hua Quan (Authority)**: Turns star energy into control, authority, and execution power. Gives you the ability to drive things forward.
- **Hua Ke (Reputation)**: Turns star energy into fame, recognition, and mentors. Elevates your social image.
- **Hua Ji (Obstacle)**: Turns star energy into challenges and life lessons. Not bad — but where you learn the most.

### Birth Year Transformations

Your birth year determines which four stars transform — these "birth transformations" follow you for life as your innate configuration.

Example: 2026 (Bing Wu year) has: Lian Zhen → Obstacle, Wen Chang → Reputation, Tian Xiang → Prosperity, Tian Tong → Authority.

### Decade & Annual Transformations

Beyond birth transformations, each 10-year Palace Limit and each year generates new transformations. When multiple layers stack, a star might simultaneously transform to Prosperity AND Obstacle — classic "blessing and curse intertwined" pattern.

### Practical Reading

- **Wealth**: Where Hua Lu lands — wealth opportunities
- **Power**: Where Hua Quan lands — control and execution
- **Fame**: Where Hua Ke lands — reputation and connections
- **Lessons**: Where Hua Ji lands — life's homework and growth areas

### The Si Hua Formula

Memorize this formula — it's essential Zi Wei Dou Shu knowledge:
Jia: Lian-Po-Wu-Yang | Yi: Ji-Liang-Zi-Yin | Bing: Tong-Ji-Chang-Lian | Ding: Yin-Tong-Ji-Ju | Wu: Tan-Yin-You-Ji | Ji: Wu-Tan-Liang-Qu | Geng: Yang-Wu-Yin-Tong | Xin: Ju-Yang-Qu-Chang | Ren: Liang-Zi-Zuo-Wu | Gui: Po-Ju-Yin-Tan

Each set maps the transforming star for Prosperity, Authority, Reputation, and Obstacle in order. Master this, and you can calculate transformations yourself.`
  },
};
