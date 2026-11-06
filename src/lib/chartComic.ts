/**
 * AI 人生小传漫画 · 分镜引擎（服务端）
 *
 * 数据源是站点现有的排盘引擎 baziViewData.js —— 不做新的命理计算，
 * 只把真实四柱 / 十神 / 纳音 / 冲合 / 神煞 / 大运插值成 12 格漫画脚本。
 * 换一个生日，字幕与旁白随之重写；免费版只对外吐前 3 格。
 *
 * 美术规范沿用《占星漫剧_月亮十二星座 / 生产SOP.md》：固定角色「小月」+
 * 固定风格串 + seed，屏幕文案 ≤12 字，右下常驻水印，全片娱乐属性声明。
 */
import { buildBaziViewData } from "./baziViewData";

export const FREE_PANEL_COUNT = 3;
export const TOTAL_PANEL_COUNT = 12;
export const WATERMARK = "人生布局参考 · 文化娱乐研究";
export const DISCLAIMER = "仅作文化娱乐参考";

// 全片不得出现的词（沿用 SOP 合规清单）
export const FORBIDDEN_WORDS = [
  "转运", "改运", "化解", "命盘", "大师", "看盘收费", "包月",
] as const;

export const CHAR_ANCHOR =
  "22-year-old East Asian girl, short black bob hair, round face, light freckles, cream knit sweater, minimal makeup";
export const STYLE_ANCHOR =
  "soft cinematic illustration, warm amber rim light, shallow depth of field, 9:16 vertical, film grain, muted palette";

export interface LifeComicInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: 0 | 1;
  currentYear?: number;
}

export interface ComicPanel {
  id: string;
  title: string;
  caption: string;
  narration: string;
  scene: string;
  imagePrompt: string;
  chartSource: string[];
  shot: string;
  seconds: number;
  /** 免费版展示的示例画面，按格固定；正式版换成实时出图 */
  sampleImage: string;
}

export interface LifeComic {
  meta: {
    solarText: string;
    lunarText: string;
    animal: string;
    jieQi: string;
    pillars: Array<{ label: string; ganZhi: string; tenGod: string; naYin: string }>;
    dayMaster: string;
    element: string;
    interactions: { stems: string[]; branches: string[]; whole: string[] };
    shenSha: string[];
    daYun: string;
    liuNian: string;
    runtimeSeconds: number;
  };
  style: {
    char: string;
    style: string;
    seed: number;
    aspect: string;
    watermark: string;
  };
  compliance: {
    violations: string[];
    captionsOver12: string[];
    disclaimer: string;
    aiGeneratedLabel: boolean;
  };
  panels: ComicPanel[];
}

const ELEMENT_TRAIT: Record<string, { hook: string; short: string; core: string; scene: string }> = {
  木: { hook: "你不是急，是先往外长", short: "先往外长", core: "先长出去，再想为什么", scene: "清晨的窗边，一株新枝贴着玻璃往外伸" },
  火: { hook: "你亮得快，也烫得快", short: "亮得快也烫得快", core: "亮得快，也烫得快", scene: "逆光里抬手挡光，指尖有一小簇暖光" },
  土: { hook: "你不是慢，是在等土沉下去", short: "等土沉下去", core: "不急着给答案，先把事托住", scene: "赤脚站在田埂上，脚边的土被压实" },
  金: { hook: "你不是冷，是先划清线", short: "先把线划清楚", core: "先划清边界，再决定要不要靠近", scene: "桌面上用指尖划出一条干净的直线" },
  水: { hook: "你不是没想法，是还在装", short: "还在慢慢看清", core: "什么都先装进来，慢慢才看清", scene: "捧着一只盛满水的碗，水面晃动" },
};

const TEN_GOD_TRAIT: Record<string, { caption: string; line: string; scene: string }> = {
  正官: { caption: "被期待的规矩", line: "从小到大，总有一套「应该」摆在那儿。", scene: "校门口的挂钟与一排整齐的课桌" },
  七杀: { caption: "被推着上场", line: "越是被推着上场，你反而越清醒。", scene: "站在起跑线前，身后是模糊的人群" },
  伤官: { caption: "心里那句不一定", line: "只是心里还留了一小句没说出口的反对。", scene: "逆光下偏过头，嘴角压着一句没说的话" },
  食神: { caption: "把日子过出滋味", line: "你擅长把普通的一天过出滋味。", scene: "小桌上一碗热汤，慢慢冒起白气" },
  正财: { caption: "做成看得见的", line: "比起说得漂亮，更想把它做出来。", scene: "把最后一枚硬币放进透明罐子" },
  偏财: { caption: "机会来了接住", line: "机会路过的时候，你手比脑子快。", scene: "伸手接住一片被风吹来的纸" },
  正印: { caption: "有人替你留灯", line: "身后一直有人替你留着一盏灯。", scene: "走廊尽头亮着的一扇窗" },
  偏印: { caption: "脑内的小房间", line: "你有一个别人进不去的脑内小房间。", scene: "戴耳机靠在墙角，身边浮着几页草稿" },
  比肩: { caption: "同类才懂你", line: "同类的人一出现，你立刻就松下来。", scene: "两个人并肩坐在台阶上，不说话" },
  劫财: { caption: "较劲也护着", line: "一边较劲，一边又最护着对方。", scene: "两只手同时去够同一本书" },
};

const SHEN_SHA_TRAIT: Record<string, { caption: string; line: string; scene: string }> = {
  天乙贵人: { caption: "关键时刻有人递手", line: "真到卡住的时候，总有一只手递过来。", scene: "画面边缘伸来一只手，递上一把钥匙" },
  文昌贵人: { caption: "写下来才踏实", line: "想法只有写下来，你才真的踏实。", scene: "摊开的笔记本，笔尖停在一行字上" },
  华盖: { caption: "热闹散了才充电", line: "热闹散场之后，你才慢慢充上电。", scene: "独自坐在关了灯的房间地板上，窗外的光" },
  桃花: { caption: "容易被记住", line: "你很容易被陌生人记住。", scene: "人群里被回头看了一眼" },
  驿马: { caption: "待不住，得动", line: "待久了会闷，你总得动一动。", scene: "拎起包站在门口，门外是路" },
  将星: { caption: "关键场面反而稳", line: "越是关键场面，你反而越稳。", scene: "众人围着桌子，只有她站得笔直" },
};

const ZHI_ANIMAL: Record<string, string> = {
  子: "鼠", 丑: "牛", 寅: "虎", 卯: "兔", 辰: "龙", 巳: "蛇",
  午: "马", 未: "羊", 申: "猴", 酉: "鸡", 戌: "狗", 亥: "猪",
};

const SAMPLE_IMAGES = [
  "/life-comic/p01.webp",
  "/life-comic/p02.webp",
  "/life-comic/p03.webp",
];

function firstMatch(list: string[], token: string): string {
  return list.find((item) => item.includes(token)) || "";
}

function traitOf<T>(map: Record<string, T>, key: string, fallback: T): T {
  return map[key] || fallback;
}

export function buildLifeComic(input: LifeComicInput): LifeComic {
  const v = buildBaziViewData({
    year: input.year,
    month: input.month,
    day: input.day,
    hour: input.hour,
    minute: input.minute,
    gender: input.gender,
    currentYear: input.currentYear || new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
  });

  const pillars = Object.fromEntries(v.pillarList.map((p: any) => [p.key, p])) as Record<string, any>;
  const element = v.dayMaster.element as string;
  const trait = traitOf(ELEMENT_TRAIT, element, ELEMENT_TRAIT.土);
  const yearT = traitOf(TEN_GOD_TRAIT, pillars.year.tenGod, TEN_GOD_TRAIT.正官);
  const monthT = traitOf(TEN_GOD_TRAIT, pillars.month.tenGod, TEN_GOD_TRAIT.伤官);
  const timeT = traitOf(TEN_GOD_TRAIT, pillars.time.tenGod, TEN_GOD_TRAIT.正财);

  const interactions = v.interactions.natal as { stems: string[]; branches: string[]; whole: string[] };
  const clash = firstMatch(interactions.stems, "冲");
  const combine = firstMatch(interactions.stems, "合");
  const branchCombine = firstMatch(interactions.branches, "合");

  const shaRows = v.shenSha.natal as Array<{ key: string; label: string; names: string[] }>;
  const shaRow = ["day", "year", "month", "time"]
    .map((key) => shaRows.find((row) => row.key === key))
    .find((row) => row && row.names.length > 0);
  const shaName = shaRow?.names[0] || "";
  const shaTrait = traitOf(SHEN_SHA_TRAIT, shaName, SHEN_SHA_TRAIT.华盖);
  const nobleCount = shaRows.filter((row) => row.names.includes("天乙贵人")).length;

  const daYun = v.luck.current;
  const liuNian = v.luck.currentYear;
  const animal = ZHI_ANIMAL[pillars.year.zhi] || "";

  type PanelOpts = Omit<ComicPanel, "id" | "imagePrompt" | "sampleImage"> & { subject: string };
  const mk = (id: string, index: number, o: PanelOpts): ComicPanel => ({
    id,
    title: o.title,
    caption: o.caption,
    narration: o.narration,
    scene: o.scene,
    chartSource: o.chartSource,
    shot: o.shot,
    seconds: o.seconds,
    imagePrompt: `${CHAR_ANCHOR}, ${STYLE_ANCHOR}, ${o.subject}`,
    sampleImage: SAMPLE_IMAGES[index] || SAMPLE_IMAGES[0],
  });

  const panels: ComicPanel[] = [
    mk("P01", 0, {
      title: "钩子", caption: trait.short, narration: `${trait.hook}。`, scene: trait.scene,
      chartSource: ["dayMaster.element"], shot: "特写", seconds: 3,
      subject: "close-up portrait, looking straight at camera, a faint glowing birth-element symbol floating above her forehead, dark warm background",
    }),
    mk("P02", 1, {
      title: "底色 · 日主", caption: `${v.dayMaster.stem}${element}：${trait.short}`,
      narration: `你的底色是${v.dayMaster.stem}${element}——${trait.core}。`, scene: trait.scene,
      chartSource: ["dayMaster.stem", "dayMaster.element"], shot: "全景", seconds: 5,
      subject: "wide full-body shot, wearing long loose beige linen trousers and fully clothed, standing barefoot on a packed earth ridge at golden hour, hands relaxed at her sides, calm grounded posture",
    }),
    mk("P03", 2, {
      title: `年柱 ${pillars.year.ganZhi} · ${pillars.year.tenGod}`,
      caption: `${pillars.year.ganZhi} · ${yearT.caption}`,
      narration: `${pillars.year.ganZhi} 写的是「${yearT.caption}」——${yearT.line}`, scene: yearT.scene,
      chartSource: ["pillars.year.ganZhi", "pillars.year.tenGod"], shot: "中景", seconds: 5,
      subject: "mid shot, standing in front of a row of neat old school desks and a wall clock, straight posture, soft dust floating in warm light",
    }),
    mk("P04", 0, {
      title: `月柱 ${pillars.month.ganZhi} · ${pillars.month.tenGod}`,
      caption: `${pillars.month.ganZhi} · ${monthT.caption}`,
      narration: `可 ${pillars.month.ganZhi} 又添了另一句：${monthT.line}`, scene: monthT.scene,
      chartSource: ["pillars.month.ganZhi", "pillars.month.tenGod"], shot: "中景", seconds: 5,
      subject: "mid shot, turning her head away from the light with a small unspoken objection on her face, backlit hair edge",
    }),
    mk("P05", 1, {
      title: clash ? `天干 ${clash}` : "内在的两股力",
      caption: clash ? `${clash}，同时拉` : "两股力，同时拉",
      narration: clash ? `${clash}——一边要守规矩，一边想自己说了算。` : "一边想稳住，一边又想推开门。",
      scene: "画面左右两侧的风往中间吹，衣角和头发被带起",
      chartSource: ["interactions.natal.stems"], shot: "中景 · 硬切", seconds: 5,
      subject: "mid shot, split lighting, wind lifting her bob hair and sweater hem from both sides, she stands still in the middle",
    }),
    mk("P06", 2, {
      title: combine ? `天干 ${combine}` : "回到自己",
      caption: combine ? `${combine} · 回到自己` : "拉完，还是回到自己",
      narration: combine ? `好在${combine}：拉扯完，你还是会被拉回自己。` : "好在拉扯完，你还是会被拉回自己。",
      scene: "风停，低头把手按在土上，呼吸慢下来",
      chartSource: ["interactions.natal.stems"], shot: "特写", seconds: 5,
      subject: "close-up of her hand pressing flat on warm earth, wind settling, dust falling back down, gentle amber light",
    }),
    mk("P07", 0, {
      title: branchCombine ? `地支 ${branchCombine}` : "熟悉的人",
      caption: branchCombine ? `${branchCombine} · 有人兜底` : "熟的人给你兜底",
      narration: branchCombine ? `${branchCombine}，让你在熟的人面前不用撑着。` : "在熟的人面前，你不用一直撑着。",
      scene: "小饭桌，对面有人推来一碗热的",
      chartSource: ["interactions.natal.branches"], shot: "中景", seconds: 5,
      subject: "warm mid shot, sitting at a small dinner table, someone off-frame slides a steaming bowl toward her, she finally relaxes her shoulders",
    }),
    mk("P08", 1, {
      title: shaName ? `${shaName} · ${pillars[shaRow?.key || "day"].ganZhi}` : "独处",
      caption: shaTrait.caption, narration: shaTrait.line, scene: shaTrait.scene,
      chartSource: ["shenSha.natal"], shot: "全景", seconds: 5,
      subject: "quiet wide shot, sitting alone on the floor of a dim room, window light making a soft rectangle on the wall, headphones around her neck",
    }),
    mk("P09", 2, {
      title: nobleCount > 1 ? `天乙贵人 ×${nobleCount}` : "递过来的手",
      caption: nobleCount > 1 ? `${nobleCount} 次有人递手` : "卡住时有人递手",
      narration: nobleCount > 1
        ? `你这张图里，${nobleCount} 处都写着「有人会来帮你」——只是你通常先自己扛完。`
        : "真卡住的时候，会有人递一只手过来——只是你通常先自己扛完。",
      scene: "画面边缘伸来一只手，递上一把钥匙",
      chartSource: ["shenSha.natal"], shot: "近景", seconds: 5,
      subject: "medium close-up, a hand entering from the frame edge offering a small brass key, she looks at it with surprise, warm rim light",
    }),
    mk("P10", 0, {
      title: `时柱 ${pillars.time.ganZhi} · ${pillars.time.tenGod}`,
      caption: `${pillars.time.ganZhi} · ${timeT.caption}`,
      narration: `${pillars.time.ganZhi} 落在结果上：${timeT.line}`, scene: timeT.scene,
      chartSource: ["pillars.time.ganZhi", "pillars.time.tenGod"], shot: "特写", seconds: 5,
      subject: "close-up, placing the last coin into a clear glass jar on a wooden desk, small satisfied smile, soft daylight",
    }),
    mk("P11", 1, {
      title: daYun ? `${daYun.ganZhi} · ${daYun.startYear} 起` : "新的节奏",
      caption: daYun ? `${daYun.startAge} 岁，换自己定节奏` : "换自己定节奏",
      narration: daYun
        ? `${daYun.startYear} 年起，走进${daYun.ganZhi}这一段；${liuNian?.year || ""} 年是${liuNian?.ganZhi || ""}。节奏开始由你自己定。`
        : "节奏，开始由你自己定。",
      scene: "推开一扇门，门外是清晨的空路",
      chartSource: ["luck.current", "luck.currentYear"], shot: "全景 · 背影", seconds: 6,
      subject: "wide shot from behind, pushing open a door onto an empty morning road, one hand still on the doorframe, long soft shadow",
    }),
    mk("P12", 2, {
      title: "收尾引导", caption: "你的一张图，留言生日",
      narration: `想看属于你的那一张？把生日留在评论区。${DISCLAIMER}。`,
      scene: "回望镜头，画面下缘渐隐，右下角常驻水印",
      chartSource: ["meta.disclaimer"], shot: "近景", seconds: 3,
      subject: "medium close-up, turning back to camera with a small smile, faint birth-element symbol rising, fading to dark at the lower edge",
    }),
  ];

  const screenText = panels.flatMap((p) => [p.caption, p.narration, p.title]).join("\n");
  const violations = FORBIDDEN_WORDS.filter((word) => screenText.includes(word));
  const captionsOver12 = panels
    .filter((p) => Array.from(p.caption).length > 12)
    .map((p) => `${p.id}:${p.caption}`);

  return {
    meta: {
      solarText: v.solarText,
      lunarText: v.lunarText,
      animal: `${animal}年`,
      jieQi: v.meta.prevJieQi,
      pillars: v.pillarList.map((p: any) => ({
        label: p.label, ganZhi: p.ganZhi, tenGod: p.tenGod, naYin: p.naYin,
      })),
      dayMaster: `${v.dayMaster.stem}${v.dayMaster.branch}`,
      element,
      interactions,
      shenSha: shaRows.filter((row) => row.names.length).map((row) => `${row.label}: ${row.names.join("、")}`),
      daYun: daYun ? `${daYun.ganZhi} ${daYun.startYear}-${daYun.endYear}` : "",
      liuNian: liuNian ? `${liuNian.year} ${liuNian.ganZhi}` : "",
      runtimeSeconds: panels.reduce((sum, p) => sum + p.seconds, 0),
    },
    style: {
      char: CHAR_ANCHOR, style: STYLE_ANCHOR, seed: 12345,
      aspect: "9:16", watermark: WATERMARK,
    },
    compliance: {
      violations, captionsOver12, disclaimer: DISCLAIMER, aiGeneratedLabel: true,
    },
    panels,
  };
}
