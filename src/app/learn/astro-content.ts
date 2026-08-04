// Beginner Astrology Course — Lesson Content
// key format: "astro-1" through "astro-14"

export interface LessonContent {
  zh: string;
  en: string;
}

export const astroContents: Record<string, LessonContent> = {
  "astro-1": {
    zh: `## 认识12星座

十二星座是占星学最基础的概念。每个人的太阳星座由出生日期决定，代表你的核心性格。

### 星座日期对照
| 星座 | 日期 | 元素 | 守护星 |
|------|------|------|--------|
| 白羊♈ | 3.21-4.19 | 火 | 火星 |
| 金牛♉ | 4.20-5.20 | 土 | 金星 |
| 双子♊ | 5.21-6.21 | 风 | 水星 |
| 巨蟹♋ | 6.22-7.22 | 水 | 月亮 |
| 狮子♌ | 7.23-8.22 | 火 | 太阳 |
| 处女♍ | 8.23-9.22 | 土 | 水星 |
| 天秤♎ | 9.23-10.23 | 风 | 金星 |
| 天蝎♏ | 10.24-11.22 | 水 | 冥王星 |
| 射手♐ | 11.23-12.21 | 火 | 木星 |
| 摩羯♑ | 12.22-1.19 | 土 | 土星 |
| 水瓶♒ | 1.20-2.18 | 风 | 天王星 |
| 双鱼♓ | 2.19-3.20 | 水 | 海王星 |

### 三种模式
- **开创星座**：白羊、巨蟹、天秤、摩羯 — 发起者，行动力强
- **固定星座**：金牛、狮子、天蝎、水瓶 — 稳定者，有毅力
- **变动星座**：双子、处女、射手、双鱼 — 适应者，灵活多变`,
    en: `## Meet the 12 Zodiac Signs

The twelve zodiac signs are the foundation of astrology. Your Sun sign, determined by your birth date, represents your core personality.

### Sign Dates
| Sign | Dates | Element | Ruler |
|------|-------|---------|-------|
| Aries♈ | 3.21-4.19 | Fire | Mars |
| Taurus♉ | 4.20-5.20 | Earth | Venus |
| Gemini♊ | 5.21-6.21 | Air | Mercury |
| Cancer♋ | 6.22-7.22 | Water | Moon |
| Leo♌ | 7.23-8.22 | Fire | Sun |
| Virgo♍ | 8.23-9.22 | Earth | Mercury |
| Libra♎ | 9.23-10.23 | Air | Venus |
| Scorpio♏ | 10.24-11.22 | Water | Pluto |
| Sagittarius♐ | 11.23-12.21 | Fire | Jupiter |
| Capricorn♑ | 12.22-1.19 | Earth | Saturn |
| Aquarius♒ | 1.20-2.18 | Air | Uranus |
| Pisces♓ | 2.19-3.20 | Water | Neptune |

### Three Modalities
- **Cardinal**: Aries, Cancer, Libra, Capricorn — initiators, action-oriented
- **Fixed**: Taurus, Leo, Scorpio, Aquarius — stable, persistent
- **Mutable**: Gemini, Virgo, Sagittarius, Pisces — adaptable, flexible`
  },
  "astro-2": {
    zh: `## 记忆符号

占星符号是快速读盘的基础。每个行星和星座都有独特的符号。

### 行星符号
- **☉** 太阳 — 自我、生命力、核心意志
- **☽** 月亮 — 情绪、直觉、潜意识
- **☿** 水星 — 思维、沟通、学习
- **♀** 金星 — 爱情、美、价值观
- **♂** 火星 — 行动、欲望、勇气
- **♃** 木星 — 扩张、幸运、信仰
- **♄** 土星 — 责任、限制、成熟
- **♅** 天王星 — 变革、创新、自由
- **♆** 海王星 — 梦想、直觉、超越
- **♇** 冥王星 — 转化、深层力量

### 星座符号记忆
把符号和星座特质联想起来：
- ♈ 白羊 — 公羊角，冲劲
- ♉ 金牛 — 牛头，稳重
- ♊ 双子 — 罗马数字Ⅱ，双重性
- ♋ 巨蟹 — 蟹螯，保护壳
- ♌ 狮子 — 狮鬃，王者气
- ♍ 处女 — M字形，务实
- ♎ 天秤 — 天平，平衡
- ♏ 天蝎 — M+尾刺，深沉
- ♐ 射手 — 弓箭，目标
- ♑ 摩羯 — 山羊鱼尾，攀登
- ♒ 水瓶 — 波浪，流动
- ♓ 双鱼 — 双鱼，感性`,
    en: `## Memorizing Symbols

Astrology glyphs are the key to reading charts quickly. Each planet and sign has a unique symbol.

### Planet Glyphs
- **☉** Sun — self, vitality, core will
- **☽** Moon — emotions, intuition, subconscious
- **☿** Mercury — mind, communication, learning
- **♀** Venus — love, beauty, values
- **♂** Mars — action, desire, courage
- **♃** Jupiter — expansion, luck, faith
- **♄** Saturn — responsibility, limits, maturity
- **♅** Uranus — change, innovation, freedom
- **♆** Neptune — dreams, intuition, transcendence
- **♇** Pluto — transformation, deep power

### Sign Glyphs — Memory Tricks
Associate each glyph with the sign's trait:
- ♈ Aries — ram's horns, initiative
- ♉ Taurus — bull's head, steadiness
- ♊ Gemini — Roman numeral II, duality
- ♋ Cancer — crab claws, protective shell
- ♌ Leo — lion's mane, royalty
- ♍ Virgo — M-shape, practicality
- ♎ Libra — scales, balance
- ♏ Scorpio — M + stinger, depth
- ♐ Sagittarius — arrow, targeting
- ♑ Capricorn — goat-fish, climbing
- ♒ Aquarius — waves, flow
- ♓ Pisces — two fish, sensitivity`
  },
  "astro-3": {
    zh: `## 四元素

火、土、风、水四元素是理解星座性格的第一把钥匙。

### 火象星座（白羊、狮子、射手）
**关键词**：热情、行动、直觉
火象人天生有感染力。他们凭直觉行动，追求刺激和挑战。缺点可能是冲动、缺乏耐心、容易耗尽自己。

### 土象星座（金牛、处女、摩羯）
**关键词**：务实、稳定、耐心
土象人脚踏实地。他们重视实际成果，有强大的执行力。缺点可能是过于保守、缺乏想象力。

### 风象星座（双子、天秤、水瓶）
**关键词**：思维、沟通、社交
风象人活在头脑中。他们善于交流、学习新事物、建立人脉。缺点可能是过于理性、不够落地。

### 水象星座（巨蟹、天蝎、双鱼）
**关键词**：情感、直觉、同理心
水象人情感丰富。他们有很强的直觉，能深刻感知他人的情绪。缺点可能是情绪化、边界不清。`,
    en: `## The Four Elements

Fire, Earth, Air, and Water are the first key to understanding zodiac personalities.

### Fire Signs (Aries, Leo, Sagittarius)
**Keywords**: Passion, Action, Intuition
Fire signs are naturally magnetic. They act on instinct, seeking excitement and challenge. Downsides: impulsiveness, impatience, burnout.

### Earth Signs (Taurus, Virgo, Capricorn)
**Keywords**: Practicality, Stability, Patience
Earth signs are grounded. They value tangible results and excel at execution. Downsides: stubbornness, lack of imagination.

### Air Signs (Gemini, Libra, Aquarius)
**Keywords**: Intellect, Communication, Social
Air signs live in their minds. They communicate well, learn fast, and build connections. Downsides: overthinking, detachment.

### Water Signs (Cancer, Scorpio, Pisces)
**Keywords**: Emotion, Intuition, Empathy
Water signs feel deeply. They have powerful intuition and strong empathy. Downsides: moodiness, poor boundaries.`
  },
  "astro-4": {
    zh: `## 守护星与曜升

每颗行星管理一到两个星座——这就是守护星系统。

### 守护关系
| 行星 | 守护星座 | 曜升星座 |
|------|----------|----------|
| 太阳 | 狮子 | 白羊 |
| 月亮 | 巨蟹 | 金牛 |
| 水星 | 双子/处女 | 处女 |
| 金星 | 金牛/天秤 | 双鱼 |
| 火星 | 白羊 | 摩羯 |
| 木星 | 射手 | 巨蟹 |
| 土星 | 摩羯 | 天秤 |
| 天王星 | 水瓶 | 天蝎 |
| 海王星 | 双鱼 | 狮子 |
| 冥王星 | 天蝎 | 水瓶 |

### 为什么重要
当行星落在自己守护的星座里，它的能量表达最自然、最有力。当行星落在曜升星座中，它像"被提拔"了一样——能量升级。

例如：月亮在巨蟹 = 情感最自然顺畅地表达。金星在双鱼 = 爱的能量达到最高境界。`,
    en: `## Ruling Planets & Exaltation

Each planet rules one or two signs — this is the rulership system.

### Rulership Table
| Planet | Rules | Exalted |
|--------|-------|---------|
| Sun | Leo | Aries |
| Moon | Cancer | Taurus |
| Mercury | Gemini/Virgo | Virgo |
| Venus | Taurus/Libra | Pisces |
| Mars | Aries | Capricorn |
| Jupiter | Sagittarius | Cancer |
| Saturn | Capricorn | Libra |
| Uranus | Aquarius | Scorpio |
| Neptune | Pisces | Leo |
| Pluto | Scorpio | Aquarius |

### Why It Matters
When a planet is in its ruling sign, its energy flows most naturally and powerfully. When it's exalted, it's "promoted" — its energy is elevated.

Example: Moon in Cancer = most natural emotional expression. Venus in Pisces = love energy at its highest.`
  },
  "astro-5": {
    zh: `## 黄道十二宫

十二宫位将星盘划分为十二个生活领域。每个宫位代表人生的一个特定面向。

### 宫位含义
| 宫位 | 名称 | 核心领域 |
|------|------|----------|
| 1宫 | 命宫 | 自我形象、外貌、第一印象 |
| 2宫 | 财帛宫 | 金钱、价值观、资源 |
| 3宫 | 兄弟宫 | 沟通、学习、短途旅行 |
| 4宫 | 田宅宫 | 家庭、根基、内在安全感 |
| 5宫 | 子女宫 | 创意、恋爱、娱乐 |
| 6宫 | 奴仆宫 | 工作、健康、日常习惯 |
| 7宫 | 夫妻宫 | 伴侣、合作、一对一关系 |
| 8宫 | 疾厄宫 | 深度转化、共享资源、心理 |
| 9宫 | 迁移宫 | 高等教育、远行、信仰 |
| 10宫 | 官禄宫 | 事业、公众形象、成就 |
| 11宫 | 福德宫 | 朋友、社群、理想 |
| 12宫 | 相貌宫 | 潜意识、灵性、隐藏之事 |

### 角宫、续宫、果宫
- **角宫**(1/4/7/10)：最有力，类似开创星座
- **续宫**(2/5/8/11)：稳固持久，类似固定星座
- **果宫**(3/6/9/12)：灵活流动，类似变动星座`,
    en: `## The Twelve Houses

The twelve houses divide your chart into twelve life domains. Each represents a specific area of life.

### House Meanings
| House | Name | Core Domain |
|-------|------|-------------|
| 1st | Ascendant | Self-image, appearance, first impression |
| 2nd | Wealth | Money, values, resources |
| 3rd | Siblings | Communication, learning, short trips |
| 4th | Home | Family, roots, inner security |
| 5th | Children | Creativity, romance, pleasure |
| 6th | Service | Work, health, daily routines |
| 7th | Partnership | Spouse, cooperation, 1-on-1 relations |
| 8th | Transformation | Depth, shared resources, psychology |
| 9th | Travel | Higher education, long journeys, beliefs |
| 10th | Career | Career, public image, achievement |
| 11th | Community | Friends, groups, ideals |
| 12th | Subconscious | Unconscious, spirituality, hidden matters |

### Angular, Succedent, Cadent
- **Angular** (1/4/7/10): Most powerful, like cardinal signs
- **Succedent** (2/5/8/11): Stable, like fixed signs
- **Cadent** (3/6/9/12): Flexible, like mutable signs`
  },
  "astro-6": {
    zh: `## 主要相位

相位是两颗行星之间的角度关系，代表它们之间的能量互动方式。

### 五大主要相位
| 相位 | 角度 | 含义 |
|------|------|------|
| 合相 | 0° | 融合、加强、一体 |
| 六合 | 60° | 机会、支持、才能 |
| 刑克 | 90° | 张力、挑战、成长 |
| 三合 | 120° | 和谐、顺畅、天赋 |
| 冲相 | 180° | 对立、投射、意识化 |

### 相位解读要点
- **合相**：两颗星的能量融为一体。日月合相的人，意志和情感高度一致。
- **六合**：温和的支持——需要主动利用才不会浪费。
- **刑克**：内在冲突——但也是最大的成长驱动力。
- **三合**：天然流畅——但可能让人不思进取。
- **冲相**：你能在他人身上看到自己的另一面——关系中的镜子。`,
    en: `## Major Aspects

Aspects are angular relationships between planets — representing how their energies interact.

### The Five Major Aspects
| Aspect | Angle | Meaning |
|--------|-------|---------|
| Conjunction | 0° | Fusion, amplification, unity |
| Sextile | 60° | Opportunity, support, talent |
| Square | 90° | Tension, challenge, growth |
| Trine | 120° | Harmony, flow, natural gift |
| Opposition | 180° | Polarity, projection, awareness |

### Reading Aspects
- **Conjunction**: Two planetary energies merge. Sun-Moon conjunct = will and emotion are unified.
- **Sextile**: Gentle support — must be actively used or it's wasted.
- **Square**: Inner conflict — but also the greatest growth driver.
- **Trine**: Natural ease — but may lead to complacency.
- **Opposition**: You see your other half in others — the mirror in relationships.`
  },
  "astro-7": {
    zh: `## 太阳详解

太阳是你星盘中最核心的行星。它代表你的自我意识、生命力和人生目标。

### 太阳的特质
太阳所在的星座决定了你的核心性格——你怎么表达自己、你的基本价值观、以及你如何"发光"。太阳也对应父亲或生命中的权威形象。

### 太阳在十二宫
- **第1宫**：自我表达强烈，天生的领导者气质
- **第5宫**：充满创造力和表现欲，热爱生活
- **第10宫**：事业心强，公众形象突出

### 太阳的相位
- **太阳-月亮**：意识与潜意识的和谐或冲突
- **太阳-火星**：行动力爆棚，竞争意识强
- **太阳-木星**：乐观开朗，好运常伴`,
    en: `## The Sun in Depth

The Sun is the core planet in your chart. It represents your self-awareness, vitality, and life purpose.

### Sun's Nature
Your Sun sign determines your core personality — how you express yourself, your fundamental values, and how you "shine." The Sun also corresponds to the father figure or authority in your life.

### Sun in the 12 Houses
- **1st House**: Strong self-expression, natural leadership
- **5th House**: Full of creativity and expressiveness, loves life
- **10th House**: Career-driven, prominent public image

### Sun Aspects
- **Sun-Moon**: Harmony or conflict between conscious and unconscious
- **Sun-Mars**: Powerful drive, competitive spirit
- **Sun-Jupiter**: Optimistic, naturally lucky`
  },
  "astro-8": {
    zh: `## 月亮详解

月亮代表你的情感世界、潜意识和内心需求。如果说太阳是你"想成为的人"，月亮就是"你本来就有的样子"。

### 月亮的特质
月亮所在的星座决定你的情绪反应模式、安全感来源、以及你如何照顾自己和他人。月亮也对应母亲形象。

### 月亮在十二星座
- **月亮在巨蟹**：最敏感的位置，情感丰富，家庭至上
- **月亮在天蝎**：情感深沉，直觉极强，占有欲重
- **月亮在射手**：情绪乐观，需要自由，不喜欢束缚

### 月相的解读
- **新月**出生的人：开创型，总是开始新事物
- **满月**出生的人：关系型，通过他人认识自己`,
    en: `## The Moon in Depth

The Moon represents your emotional world, subconscious, and inner needs. If the Sun is who you "want to be," the Moon is "who you already are."

### Moon's Nature
Your Moon sign determines your emotional response patterns, source of security, and how you nurture yourself and others. The Moon corresponds to the mother figure.

### Moon in the 12 Signs
- **Moon in Cancer**: Most sensitive position, deeply emotional, family-first
- **Moon in Scorpio**: Deep emotions, powerful intuition, possessive
- **Moon in Sagittarius**: Optimistic mood, needs freedom, dislikes restriction

### Moon Phases
- **New Moon** births: Initiators, always starting something new
- **Full Moon** births: Relational, learn about self through others`
  },
  "astro-9": {
    zh: `## 水星详解

水星掌管你的思维方式、沟通风格和学习过程。

### 水星的特质
水星落在哪个星座，决定了你的"语言"——怎么说话、怎么写、怎么想。水星从不远离太阳超过28°，所以你的水星要么和太阳同星座，要么在相邻星座。

### 水星与学习风格
- **水星在双子**：多线程学习者，什么都知道一点。适合快速浏览、广撒网。
- **水星在处女**：系统性学习者，注重细节和准确性。适合深度学习、笔记整理。
- **水星在射手**：宏观学习者，先看大图再看细节。适合概念学习、哲学探索。

### 水星逆行
每年三次的水星逆行会让思维转向内心——适合反思、复盘、修正，但不是开启新项目的理想时机。`,
    en: `## Mercury in Depth

Mercury rules your thinking style, communication patterns, and learning process.

### Mercury's Nature
Your Mercury sign determines your "language" — how you speak, write, and think. Mercury never strays more than 28° from the Sun, so it's always in the same or adjacent sign.

### Mercury & Learning Styles
- **Mercury in Gemini**: Multi-threaded learner, knows a bit of everything. Suits rapid browsing and broad exploration.
- **Mercury in Virgo**: Systematic learner, detail-oriented and precise. Suits deep study and organized notes.
- **Mercury in Sagittarius**: Big-picture learner, sees the forest before trees. Suits conceptual learning and philosophy.

### Mercury Retrograde
Three times a year, Mercury retrograde turns the mind inward — ideal for reflection, review, and revision, but not the best time to launch new projects.`
  },
  "astro-10": {
    zh: `## 金星与火星

金星和火星是一对——一个掌管吸引，一个掌管追求。

### 金星：你如何爱
金星落在哪个星座，决定了你的爱情语言、审美偏好、以及对"价值"的定义。
- **金星在金牛**：通过物质和身体表达爱，重视稳定
- **金星在天秤**：通过陪伴和智慧表达爱，重视和谐
- **金星在射手**：通过自由和冒险表达爱，重视成长

### 火星：你如何追求
火星落在哪个星座，决定了你的行动方式、竞争本能、以及性能量表达。
- **火星在白羊**：主动出击，直接表达欲望
- **火星在天蝎**：深沉持久，暗中布局
- **火星在双鱼**：被动吸引，以退为进

### 金火相位
金星和火星的相位揭示了你的爱情模式——合相的人魅力四射，刑克的人在关系中不断磨合成长。`,
    en: `## Venus & Mars

Venus and Mars are a pair — one governs attraction, the other pursuit.

### Venus: How You Love
Your Venus sign determines your love language, aesthetic preferences, and definition of "value."
- **Venus in Taurus**: Expresses love through physical touch and material stability
- **Venus in Libra**: Expresses love through companionship and intellectual harmony
- **Venus in Sagittarius**: Expresses love through freedom and shared adventure

### Mars: How You Pursue
Your Mars sign determines your action style, competitive instinct, and expression of desire.
- **Mars in Aries**: Direct pursuit, straightforward desire
- **Mars in Scorpio**: Deep and persistent, strategic
- **Mars in Pisces**: Passive attraction, advances by retreating

### Venus-Mars Aspects
The Venus-Mars aspect reveals your romantic patterns — conjunction people are magnetic, square people grow through relationship friction.`
  },
  "astro-11": {
    zh: `## 木星与土星

木星和土星是社会行星——一个扩张，一个收缩。两者共同决定了你与社会的关系。

### 木星：你的幸运
木星在哪，你的好运和发展机会就在哪。木星约一年换一个星座。
- **木星在1宫**：天生乐观，自带好运光环
- **木星在10宫**：事业运气好，容易获得上级赏识
- **木星在7宫**：通过伴侣和合作关系获得成长

### 土星：你的功课
土星在哪，你的人生课题就在哪。土星约2.5年换一个星座。
- **土星在4宫**：家庭和责任是终身课题
- **土星在10宫**：事业需要长期积累和耐心
- **土星在7宫**：晚婚或在关系中学习边界

### 木土周期
木星和土星每20年合相一次——这标志着社会结构的大调整。`,
    en: `## Jupiter & Saturn

Jupiter and Saturn are the social planets — one expands, one contracts. Together they define your relationship with society.

### Jupiter: Your Luck
Where Jupiter sits is where your luck and growth opportunities lie. Jupiter changes signs roughly once a year.
- **Jupiter in 1st**: Naturally optimistic, blessed with good fortune
- **Jupiter in 10th**: Career luck, easily gains recognition from superiors
- **Jupiter in 7th**: Grows through partnerships and collaborations

### Saturn: Your Lesson
Where Saturn sits is where your life's homework lies. Saturn changes signs roughly every 2.5 years.
- **Saturn in 4th**: Family and responsibility are lifelong themes
- **Saturn in 10th**: Career requires long-term accumulation and patience
- **Saturn in 7th**: Late marriage, or learning boundaries through relationships

### Jupiter-Saturn Cycle
Jupiter and Saturn conjunct every 20 years — marking major social restructuring.`
  },
  "astro-12": {
    zh: `## 三王星

天王星、海王星、冥王星是世代行星——它们在每个星座停留7到20年，影响的是一整代人。

### 天王星：觉醒与突变
天王星约7年换一个星座。它代表突然的改变、创新、和对自由的渴望。天王星落在哪，你就在哪"不走寻常路"。

### 海王星：梦想与超越
海王星约14年换一个星座。它代表理想、幻象、以及灵性追求。海王星落在哪，你就在哪寻找"超越现实"的体验。

### 冥王星：转化与重生
冥王星约20-30年换一个星座。它代表深层的力量、转化、以及必须面对的阴影。冥王星落在哪，你就在哪经历"死亡与重生"。

### 三王星的个人影响
虽然三王星是世代行星，但它们落在你星盘中的宫位和与个人行星的相位，决定了你个人如何体验这些世代能量。`,
    en: `## The Outer Planets

Uranus, Neptune, and Pluto are generational planets — they stay in each sign for 7-20 years, affecting entire generations.

### Uranus: Awakening & Disruption
Uranus stays ~7 years per sign. It represents sudden change, innovation, and the desire for freedom. Where Uranus sits is where you "take the road less traveled."

### Neptune: Dreams & Transcendence
Neptune stays ~14 years per sign. It represents ideals, illusion, and spiritual pursuit. Where Neptune sits is where you seek "beyond reality" experiences.

### Pluto: Transformation & Rebirth
Pluto stays ~20-30 years per sign. It represents deep power, transformation, and the shadow you must face. Where Pluto sits is where you experience "death and rebirth."

### Personal Impact
Although the outer planets are generational, their house placement and aspects to personal planets determine how you individually experience these generational energies.`
  },
  "astro-13": {
    zh: `## 上升星座

上升星座（ASC）是你出生时东方地平线上升起的星座。它比太阳星座更影响你的第一印象和外在表现。

### 为什么上升星座很重要
太阳星座是你的核心，但上升星座是你与世界互动的方式。很多人第一次见到你时感受到的是你的上升星座，而不是太阳星座。
- **太阳是你是谁，上升是你看起来像谁**

### 上升星座与宫位系统
上升星座决定了你整个星盘的宫位排列。不同的宫位制（Placidus、Koch、Whole Sign等）会改变宫头的位置，但上升星座永远是第一宫的起点。

### 上升星座的长相
上升星座会影响一个人的外貌气质：
- **上升白羊**：轮廓分明，行动敏捷
- **上升天秤**：面容和谐，举止优雅
- **上升天蝎**：眼神深邃，气质神秘`,
    en: `## The Ascendant (Rising Sign)

The Ascendant (ASC) is the sign rising on the eastern horizon at your birth. It influences your first impression and outward appearance more than your Sun sign.

### Why the Ascendant Matters
Your Sun sign is your core, but your Ascendant is how you interact with the world. What people first notice about you is often your Rising sign, not your Sun.
- **Sun = who you are. Rising = who you appear to be**

### Ascendant & House Systems
The Ascendant determines your entire chart's house arrangement. Different house systems (Placidus, Koch, Whole Sign, etc.) shift house cusps, but the Ascendant is always the 1st house cusp.

### Physical Appearance
The Ascendant influences appearance:
- **Aries Rising**: Sharp features, quick movements
- **Libra Rising**: Harmonious face, graceful demeanor
- **Scorpio Rising**: Deep gaze, mysterious aura`
  },
  "astro-14": {
    zh: `## 综合解盘

学完了所有基础知识，现在把它们拼在一起——如何解读一张完整的星盘。

### 解盘三步法
1. **找重点**：太阳、月亮、上升的星座和宫位 → 核心人格画像
2. **看互动**：行星之间的相位 → 内在动力和冲突
3. **定主题**：哪几个宫位被强调 → 人生的主要关注领域

### 解盘案例
假设一张星盘：太阳狮子10宫 + 月亮巨蟹4宫 + 上升天秤1宫
- 核心人格：狮子座的自信和表演欲，通过事业和公众形象表达
- 情感模式：巨蟹座的敏感和家庭导向，在私密空间最有安全感
- 外在表现：天秤座的优雅和社交能力，给人第一印象是温和有礼的
- 相位：如果太阳刑克月亮 → 事业和家庭之间的拉扯是核心课题

### 解盘忠告
- 不要把单个配置当作定论——星盘是一个整体
- 同样的配置可以有无数种表达方式——取决于个人的选择和环境
- 占星是工具，不是命运——它给你看见自己的镜子，不是画好的牢笼`,
    en: `## Chart Synthesis

Now that you've learned all the basics, let's put them together — how to read a complete birth chart.

### Three-Step Method
1. **Find the core**: Sun, Moon, Rising signs and houses → core personality portrait
2. **Check interactions**: Aspects between planets → inner dynamics and conflicts
3. **Identify themes**: Which houses are emphasized → main life focus areas

### Example Reading
A chart with: Sun Leo 10H + Moon Cancer 4H + Libra Rising 1H
- Core: Leo confidence and showmanship expressed through career and public image
- Emotion: Cancer sensitivity and family-orientation — safest in private spaces
- Appearance: Libra grace and social ease — first impression is warm and diplomatic
- Aspects: If Sun squares Moon → the career vs. family tension is a core theme

### Reading Advice
- Don't treat single placements as absolute — the chart is a whole
- The same configuration can manifest in countless ways — depending on individual choice and environment
- Astrology is a tool, not fate — it gives you a mirror to see yourself, not a cage to trap you`
  },
};

// Also export the beginnerLessons with slugs for linking
export const astroSlugs = Array.from({length:14}, (_,i) => `astro-${i+1}`);
