
import { CourseLesson } from "./course-data";

export const baziLessons: CourseLesson[] = [
  { id:1, zh:'八字是什么？', en:'What is BaZi?', idn:'Apa itu BaZi?', th:'BaZi คืออะไร?', vi:'BaZi là gì?', ms:'Apa itu BaZi?', ja:'八字とは？', ko:'사주란?',
    desc: { zh:'了解八字命理的起源、四柱结构和基本概念。', en:'Learn the origins, Four Pillars structure, and basic concepts of BaZi.', idn:'Pelajari asal-usul, struktur Empat Pilar, dan konsep dasar analisis takdir BaZi.' },
    topics: { zh:['天干地支','四柱结构','阴阳五行','六十甲子'], en:['Stems & Branches','Four Pillars','Yin Yang 5 Elements','60-Year Cycle'] } },
  { id:2, zh:'天干与地支', en:'Heavenly Stems & Earthly Branches', idn:'Batang Langit & Cabang Bumi',
    desc: { zh:'掌握十天干和十二地支的基本属性和五行对应关系。', en:'Master the 10 Heavenly Stems and 12 Earthly Branches with their Five Element correspondences.', idn:'Kuasai 10 Batang Langit dan 12 Cabang Bumi.' },
    topics: { zh:['十天干详解','十二地支详解','干支纪年','五行配对'], en:['10 Stems','12 Branches','Calendar','Element Pairs'] } },
  { id:3, zh:'日主——你的核心', en:'Day Master: Your Core', idn:'Day Master: Inti Anda',
    desc: { zh:'学会识别自己的日主，理解十种日主的性格特质和能量模式。', en:'Identify your Day Master and understand the personality traits of all 10 types.', idn:'Identifikasi Day Master dan pahami sifat kepribadian 10 tipe.' },
    topics: { zh:['日主算法','十种日主性格','身强身弱','日主喜忌'], en:['Find Day Master','10 Personality Types','Strong vs Weak','Preferences'] } },
  { id:4, zh:'五行生克', en:'Five Element Cycles', idn:'Siklus Lima Elemen',
    desc: { zh:'理解金木水火土的生成循环和控制循环。', en:'Understand the generating and controlling cycles of Wood, Fire, Earth, Metal, Water.', idn:'Pahami siklus menghasilkan dan mengendalikan Kayu, Api, Tanah, Logam, Air.' },
    topics: { zh:['生成循环','控制循环','五行旺衰','调候原理'], en:['Generating','Controlling','Strength','Balance'] } },
  { id:5, zh:'十神入门', en:'Introduction to Ten Gods', idn:'Pengenalan Sepuluh Dewa',
    desc: { zh:'学习正印、偏印、正官、七杀、正财、偏财、食神、伤官、比肩、劫财的基本含义。', en:'Learn the basic meanings of the Ten Gods in BaZi.', idn:'Pelajari makna dasar Sepuluh Dewa.' },
    topics: { zh:['印星','官星','财星','食伤比劫'], en:['Resource','Officer','Wealth','Output & Peer'] } },
  { id:6, zh:'四柱解读', en:'Reading the Four Pillars', idn:'Membaca Empat Pilar',
    desc: { zh:'逐柱解读年柱、月柱、日柱、时柱代表的人生领域。', en:'Interpret each pillar: Year, Month, Day, Hour.', idn:'Tafsirkan setiap pilar: Tahun, Bulan, Hari, Jam.' },
    topics: { zh:['年柱：祖业童年','月柱：事业父母','日柱：自我配偶','时柱：子女晚年'], en:['Year Pillar','Month Pillar','Day Pillar','Hour Pillar'] } },
  { id:7, zh:'大运与流年', en:'Luck Cycles & Annual Stars', idn:'Siklus Keberuntungan',
    desc: { zh:'掌握十年大运和年度流年的计算方法与解读技巧。', en:'Calculate and interpret 10-year Luck Cycles and annual stars.', idn:'Hitung dan tafsirkan Siklus 10 Tahun dan bintang tahunan.' },
    topics: { zh:['大运起运时间','大运十神','流年干支','岁运并临'], en:['Cycle Start Age','Ten God','Annual Stem','Overlap'] } },
];

export const ziweiLessons: CourseLesson[] = [
  { id:1, zh:'紫微斗数简介', en:'Introduction to Zi Wei Dou Shu', idn:'Pengenalan Zi Wei Dou Shu',
    desc: { zh:'了解紫微斗数的历史、108颗星的基本概念和12宫体系。', en:'Learn the history of Purple Star Astrology, its 108 stars, and the 12-Palace system.', idn:'Pelajari sejarah Astrologi Bintang Ungu, 108 bintang, dan sistem 12 Istana.' },
    topics: { zh:['紫微起源','108颗星','12宫位','与八字区别'], en:['History','108 Stars','12 Palaces','vs BaZi'] } },
  { id:2, zh:'十二宫详解', en:'The 12 Palaces', idn:'12 Istana',
    desc: { zh:'逐一解读命宫、兄弟、夫妻、子女、财帛、疾厄、迁移、交友、事业、田宅、福德、父母十二宫。', en:'Interpret all 12 Palaces: Self, Spouse, Wealth, Career, etc.', idn:'Tafsirkan 12 Istana: Diri, Pasangan, Kekayaan, Karier, dll.' },
    topics: { zh:['命宫','夫妻宫','财帛宫','事业宫'], en:['Self','Spouse','Wealth','Career'] } },
  { id:3, zh:'紫微星详解', en:'The Purple Star (Zi Wei)', idn:'Bintang Ungu (Zi Wei)',
    desc: { zh:'深入理解紫微星——帝王之星——在不同宫位的含义。', en:'Deep dive into the Purple Star — the Emperor of stars — across the 12 Palaces.', idn:'Menyelami Bintang Ungu — Kaisar bintang.' },
    topics: { zh:['紫微特质','紫微在12宫','紫微+辅星','紫微化权化科'], en:['Traits','12 Palaces','+ Stars','Transformation'] } },
  { id:4, zh:'主星和辅星', en:'Major & Minor Stars', idn:'Bintang Utama & Pendukung',
    desc: { zh:'学习14颗主星和辅星的分类、特质和互动关系。', en:'Learn the 14 major stars and supporting stars.', idn:'Pelajari 14 bintang utama dan pendukung.' },
    topics: { zh:['紫微星系','天府星系','六吉星','六煞星'], en:['Zi Wei Group','Tian Fu','6 Lucky','6 Challenging'] } },
  { id:5, zh:'四化飞星', en:'Four Transformations', idn:'Empat Transformasi',
    desc: { zh:'掌握化禄、化权、化科、化忌的含义和应用。', en:'Master the Four Transformations: Prosperity, Authority, Reputation, Obstacle.', idn:'Kuasai Empat Transformasi: Kemakmuran, Otoritas, Reputasi, Hambatan.' },
    topics: { zh:['化禄','化权','化科','化忌'], en:['Prosperity','Authority','Reputation','Obstacle'] } },
];
