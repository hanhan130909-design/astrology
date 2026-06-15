// 占星初阶课程数据 — 14课
export interface CourseLesson {
  no: number;
  zh: string;
  en: string;
  idn: string;
  desc: { zh: string; en: string; idn: string };
  topics: string[];
}

export const beginnerLessons: CourseLesson[] = [
  {
    id: 1,
    zh: "认识12星座",
    en: "Meet the 12 Zodiac Signs",
    idn: "Mengenal 12 Zodiak",
    desc: {
      zh: "了解十二星座的基本特质、元素属性和守护星。建立占星学的基础认知框架。",
      en: "Learn the basic traits, elements, and ruling planets of the 12 zodiac signs. Build your foundational astrology framework.",
      idn: "Pelajari sifat dasar, elemen, dan planet penguasa 12 zodiak. Bangun kerangka dasar astrologi Anda."
    },
    topics: ["四元素分类", "火土风水特质", "12星座守护星", "星座符号记忆"]
  },
  {
    id: 2,
    zh: "记忆符号",
    en: "Memorizing Symbols",
    idn: "Menghafal Simbol",
    desc: {
      zh: "掌握行星和星座的占星符号，为后续快速识读星盘打下基础。",
      en: "Master astrological glyphs for planets and signs to quickly read charts.",
      idn: "Kuasai simbol astrologi untuk planet dan zodiak agar cepat membaca bagan."
    },
    topics: ["行星符号", "星座符号", "相位符号", "速记技巧"]
  },
  {
    id: 3,
    zh: "三大基础知识串联",
    en: "Connecting the Big Three",
    idn: "Menghubungkan Tiga Dasar",
    desc: {
      zh: "将星座、行星、宫位三大基础串联起来，理解它们之间的互动关系。",
      en: "Connect signs, planets, and houses — understand how they interact.",
      idn: "Hubungkan zodiak, planet, dan rumah — pahami interaksinya."
    },
    topics: ["行星-星座-宫位联动", "守护关系", "能量流动", "综合解读入门"]
  },
  {
    id: 4,
    zh: "三方四正",
    en: "Triplicities & Quadruplicities",
    idn: "Triplisitas & Kuadruplisitas",
    desc: {
      zh: "深入学习星座的三方（元素分组）和四正（模式分类），理解星座间的结构关系。",
      en: "Deep dive into triplicities (element groups) and quadruplicities (modality groups) of the zodiac.",
      idn: "Pelajari triplisitas dan kuadruplisitas zodiak untuk memahami hubungan struktural."
    },
    topics: ["三方分类", "四正分类", "开创-固定-变动", "星座性格模式"]
  },
  {
    id: 5,
    zh: "12宫位（上）",
    en: "12 Houses (Part 1)",
    idn: "12 Rumah (Bagian 1)",
    desc: {
      zh: "学习第1-6宫的含义，涵盖自我、财富、沟通、家庭、创造、健康六大领域。",
      en: "Learn houses 1-6: self, wealth, communication, home, creativity, and health.",
      idn: "Pelajari rumah 1-6: diri, kekayaan, komunikasi, keluarga, kreativitas, kesehatan."
    },
    topics: ["第1宫-命宫", "第2宫-财帛宫", "第3宫-兄弟宫", "第4宫-田宅宫", "第5宫-子女宫", "第6宫-奴仆宫"]
  },
  {
    id: 6,
    zh: "12宫位（下）",
    en: "12 Houses (Part 2)",
    idn: "12 Rumah (Bagian 2)",
    desc: {
      zh: "学习第7-12宫的含义，涵盖伴侣、共享资源、信仰、事业、社交、潜意识六大领域。",
      en: "Learn houses 7-12: partnership, shared resources, philosophy, career, community, and subconscious.",
      idn: "Pelajari rumah 7-12: pasangan, sumber daya bersama, filosofi, karier, komunitas, bawah sadar."
    },
    topics: ["第7宫-夫妻宫", "第8宫-疾厄宫", "第9宫-迁移宫", "第10宫-官禄宫", "第11宫-福德宫", "第12宫-玄秘宫"]
  },
  {
    id: 7,
    zh: "生时矫正",
    en: "Birth Time Rectification",
    idn: "Koreksi Waktu Lahir",
    desc: {
      zh: "学习如何通过人生重大事件反推准确的出生时间，解决出生时间不精确的问题。",
      en: "Learn to rectify birth time using major life events when exact time is unknown.",
      idn: "Pelajari cara mengoreksi waktu lahir menggunakan peristiwa hidup besar."
    },
    topics: ["上升星座推定", "事件反推法", "太阳弧技术", "时间窗口确定"]
  },
  {
    id: 8,
    zh: "月亮",
    en: "The Moon",
    idn: "Bulan",
    desc: {
      zh: "深入解读月亮星座的含义，理解情感需求、内在安全感和潜意识模式。",
      en: "Deep interpretation of Moon signs — emotional needs, inner security, and subconscious patterns.",
      idn: "Interpretasi mendalam tanda Bulan — kebutuhan emosional, keamanan batin, pola bawah sadar."
    },
    topics: ["月亮落12星座", "月亮落12宫位", "月相周期", "情感需求解读"]
  },
  {
    id: 9,
    zh: "水星",
    en: "Mercury",
    idn: "Merkurius",
    desc: {
      zh: "学习水星在占星中的核心作用：思维方式、沟通风格、学习能力和信息处理模式。",
      en: "Mercury's role in astrology: thinking style, communication, learning ability, and information processing.",
      idn: "Peran Merkurius: gaya berpikir, komunikasi, kemampuan belajar, pemrosesan informasi."
    },
    topics: ["水星落12星座", "水星落12宫位", "水星逆行", "思维沟通模式"]
  },
  {
    id: 10,
    zh: "桃花类型——金星火星",
    en: "Love Types — Venus & Mars",
    idn: "Tipe Cinta — Venus & Mars",
    desc: {
      zh: "金星揭示你的爱情审美和吸引力，火星展现你的行动方式和欲望表达。",
      en: "Venus reveals your love aesthetic and attraction style. Mars shows your action and desire expression.",
      idn: "Venus mengungkap estetika cinta dan gaya tarik Anda. Mars menunjukkan aksi dan ekspresi hasrat."
    },
    topics: ["金星落12星座", "火星落12星座", "金火相位", "爱情模式解读"]
  },
  {
    id: 11,
    zh: "木星土星——财富密码",
    en: "Jupiter & Saturn — Wealth Code",
    idn: "Jupiter & Saturnus — Kode Kekayaan",
    desc: {
      zh: "木星代表你的幸运领域和扩张方式，土星揭示你的责任边界和成就路径。丰盛与责任的平衡。",
      en: "Jupiter shows your luck zones and expansion style. Saturn reveals your responsibility boundaries and achievement path.",
      idn: "Jupiter menunjukkan zona keberuntungan dan gaya ekspansi. Saturnus mengungkap batas tanggung jawab dan jalur pencapaian."
    },
    topics: ["木星落12星座", "土星落12星座", "木土相位", "财富格局分析"]
  },
  {
    id: 12,
    zh: "三王星（上）",
    en: "The Outer Planets (Part 1)",
    idn: "Planet Luar (Bagian 1)",
    desc: {
      zh: "学习天王星、海王星、冥王星的含义，理解世代行星对个人和时代的影响。",
      en: "Learn Uranus, Neptune, Pluto — how generational planets influence individuals and eras.",
      idn: "Pelajari Uranus, Neptunus, Pluto — bagaimana planet generasi memengaruhi individu dan zaman."
    },
    topics: ["天王星革命与创新", "海王星梦想与幻灭", "冥王星转化与重生", "世代行星解读"]
  },
  {
    id: 13,
    zh: "三王星（下）·相位博弈",
    en: "Outer Planets (Part 2) — Aspect Games",
    idn: "Planet Luar (Bagian 2) — Permainan Aspek",
    desc: {
      zh: "深入三王星的相位关系，理解星体之间的博弈与互动，掌握高级解读技巧。",
      en: "Deep dive into outer planet aspects and interactions. Master advanced interpretation.",
      idn: "Pendalaman aspek planet luar dan interaksi. Kuasai interpretasi tingkat lanjut."
    },
    topics: ["天海冥相位", "三王星与个人行星", "相位博弈理论", "高级综合解读"]
  },
  {
    id: 14,
    zh: "天王星（上）",
    en: "Uranus (Part 1)",
    idn: "Uranus (Bagian 1)",
    desc: {
      zh: "专题深入天王星：突变、发明、自由和觉醒的力量。理解这颗改变游戏规则的世代行星。",
      en: "In-depth Uranus: sudden change, invention, freedom, and awakening. The game-changing generational planet.",
      idn: "Uranus mendalam: perubahan mendadak, penemuan, kebebasan, kebangkitan. Planet generasi pengubah permainan."
    },
    topics: ["天王星落12星座", "天王星落12宫位", "天王星相位", "觉醒与突变"]
  }
];
