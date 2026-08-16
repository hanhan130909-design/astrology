/**
 * 奇门遁甲排盘核心算法（转盘奇门 · 拆补法 · 天禽寄坤宫）
 *
 * 历法（四柱/节气/农历）由 lunar-javascript 精确计算；
 * 五层盘局（地盘/天盘/八门/九星/八神）参照权威开源实现 arc119226/qimen_dunjia 复刻。
 *
 * 数组 index 0-8 对应洛书九宫布局（按阅读顺序）：
 *   巽(0) 离(1) 坤(2)
 *   震(3) 中(4) 兑(5)
 *   艮(6) 坎(7) 乾(8)
 */
import { Solar } from "lunar-javascript";

// ============================================================
// 九宫常量（index 0-8）
// ============================================================
const GUA = ["巽", "离", "坤", "震", "中", "兑", "艮", "坎", "乾"];
const LUOSHU = [4, 9, 2, 3, 5, 7, 8, 1, 6]; // 洛书数
const TRIGRAM = ["☴", "☲", "☷", "☳", "◎", "☱", "☶", "☵", "☰"];
const ELEMENT = ["木", "火", "土", "木", "土", "金", "土", "水", "金"];
const DIRECTION = ["东南", "南", "西南", "东", "中", "西", "东北", "北", "西北"];
// 各宫主地支（用于长生/入墓定位；双支宫取「库支」）
const PRIMARY_BRANCH = ["辰", "午", "未", "卯", "", "酉", "丑", "子", "戌"];

const ZHONG = 4; // 中宫 index
const ZHONG_SUB = 2; // 中宫寄坤宫(index 2)

// ============================================================
// 二十四节气局数表（拆补法）—— 简体名
// ju = [上元, 中元, 下元]
// ============================================================
const JIEQI_JUSHU: Record<string, { yang: boolean; ju: number[] }> = {
  冬至: { yang: true, ju: [1, 7, 4] }, 小寒: { yang: true, ju: [2, 8, 5] }, 大寒: { yang: true, ju: [3, 9, 6] },
  立春: { yang: true, ju: [8, 5, 2] }, 雨水: { yang: true, ju: [9, 6, 3] }, 惊蛰: { yang: true, ju: [1, 7, 4] },
  春分: { yang: true, ju: [3, 9, 6] }, 清明: { yang: true, ju: [4, 1, 7] }, 谷雨: { yang: true, ju: [5, 2, 8] },
  立夏: { yang: true, ju: [4, 1, 7] }, 小满: { yang: true, ju: [5, 2, 8] }, 芒种: { yang: true, ju: [6, 3, 9] },
  夏至: { yang: false, ju: [9, 3, 6] }, 小暑: { yang: false, ju: [8, 2, 5] }, 大暑: { yang: false, ju: [7, 1, 4] },
  立秋: { yang: false, ju: [2, 5, 8] }, 处暑: { yang: false, ju: [1, 4, 7] }, 白露: { yang: false, ju: [9, 3, 6] },
  秋分: { yang: false, ju: [7, 1, 4] }, 寒露: { yang: false, ju: [6, 9, 3] }, 霜降: { yang: false, ju: [5, 8, 2] },
  立冬: { yang: false, ju: [6, 9, 3] }, 小雪: { yang: false, ju: [5, 8, 2] }, 大雪: { yang: false, ju: [4, 7, 1] },
};

// ============================================================
// 地盘三奇六仪（阳/阴遁 × 局数 1-9，index 0-8）
// ============================================================
const DIPAN_YANG: Record<number, string[]> = {
  1: ["辛", "乙", "己", "庚", "壬", "丁", "丙", "戊", "癸"],
  2: ["庚", "丙", "戊", "己", "辛", "癸", "丁", "乙", "壬"],
  3: ["己", "丁", "乙", "戊", "庚", "壬", "癸", "丙", "辛"],
  4: ["戊", "癸", "丙", "乙", "己", "辛", "壬", "丁", "庚"],
  5: ["乙", "壬", "丁", "丙", "戊", "庚", "辛", "癸", "己"],
  6: ["丙", "辛", "癸", "丁", "乙", "己", "庚", "壬", "戊"],
  7: ["丁", "庚", "壬", "癸", "丙", "戊", "己", "辛", "乙"],
  8: ["癸", "己", "辛", "壬", "丁", "乙", "戊", "庚", "丙"],
  9: ["壬", "戊", "庚", "辛", "癸", "丙", "乙", "己", "丁"],
};
const DIPAN_YIN: Record<number, string[]> = {
  1: ["丁", "己", "乙", "丙", "癸", "辛", "庚", "戊", "壬"],
  2: ["丙", "庚", "戊", "乙", "丁", "壬", "辛", "己", "癸"],
  3: ["乙", "辛", "己", "戊", "丙", "癸", "壬", "庚", "丁"],
  4: ["戊", "壬", "庚", "己", "乙", "丁", "癸", "辛", "丙"],
  5: ["己", "癸", "辛", "庚", "戊", "丙", "丁", "壬", "乙"],
  6: ["庚", "丁", "壬", "辛", "己", "乙", "丙", "癸", "戊"],
  7: ["辛", "丙", "癸", "壬", "庚", "戊", "乙", "丁", "己"],
  8: ["壬", "乙", "丁", "癸", "辛", "己", "戊", "丙", "庚"],
  9: ["癸", "戊", "丙", "丁", "壬", "庚", "己", "乙", "辛"],
};

// 九星本位 / 八门本位 / 八门顺序 / 八神（简体）
const QIMEN_STARS = ["天辅", "天英", "天芮", "天冲", "天禽", "天柱", "天任", "天蓬", "天心"];
const EIGHT_DOORS_ORIGINAL = ["杜门", "景门", "死门", "伤门", "", "惊门", "生门", "休门", "开门"];
const EIGHT_DOORS_SEQUENCE = ["休门", "生门", "伤门", "杜门", "景门", "死门", "惊门", "开门"];
const EIGHT_GODS_YANG = ["值符", "螣蛇", "太阴", "六合", "勾陈", "朱雀", "九地", "九天"];
const EIGHT_GODS_YIN = ["值符", "螣蛇", "太阴", "六合", "白虎", "玄武", "九地", "九天"];

// 六旬首 → 符首
const XUN_TO_HEAD: Record<string, string> = {
  甲子: "戊", 甲戌: "己", 甲申: "庚", 甲午: "辛", 甲辰: "壬", 甲寅: "癸",
};
const SIX_XUNS: Record<string, string[]> = {
  甲子: ["甲子", "乙丑", "丙寅", "丁卯", "戊辰", "己巳", "庚午", "辛未", "壬申", "癸酉"],
  甲戌: ["甲戌", "乙亥", "丙子", "丁丑", "戊寅", "己卯", "庚辰", "辛巳", "壬午", "癸未"],
  甲申: ["甲申", "乙酉", "丙戌", "丁亥", "戊子", "己丑", "庚寅", "辛卯", "壬辰", "癸巳"],
  甲午: ["甲午", "乙未", "丙申", "丁酉", "戊戌", "己亥", "庚子", "辛丑", "壬寅", "癸卯"],
  甲辰: ["甲辰", "乙巳", "丙午", "丁未", "戊申", "己酉", "庚戌", "辛亥", "壬子", "癸丑"],
  甲寅: ["甲寅", "乙卯", "丙辰", "丁巳", "戊午", "己未", "庚申", "辛酉", "壬戌", "癸亥"],
};
// 六旬空亡（每旬所缺的两个地支）
const XUN_KONGWANG: Record<string, string[]> = {
  甲子: ["戌", "亥"], 甲戌: ["申", "酉"], 甲申: ["午", "未"],
  甲午: ["辰", "巳"], 甲辰: ["寅", "卯"], 甲寅: ["子", "丑"],
};

// 飞布轨迹
const CLOCKWISE = [0, 1, 2, 5, 8, 7, 6, 3]; // 顺飞（不含中宫）
const COUNTER_CLOCKWISE = [0, 3, 6, 7, 8, 5, 2, 1]; // 逆飞
const DOOR_YANG = [7, 2, 3, 0, 4, 8, 5, 6, 1]; // 八门阳遁飞布
const DOOR_YIN = [7, 1, 6, 5, 8, 4, 0, 3, 2]; // 八门阴遁飞布

// 长生 / 入墓 / 驿马 / 门迫五行
const CHANGSHENG_ORDER = ["长生", "沐浴", "冠带", "临官", "帝旺", "衰", "病", "死", "墓", "绝", "胎", "养"];
const CS_BRANCH: Record<string, string[]> = {
  甲: ["亥", "子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌"],
  乙: ["午", "巳", "辰", "卯", "寅", "丑", "子", "亥", "戌", "酉", "申", "未"],
  丙: ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"],
  丁: ["酉", "申", "未", "午", "巳", "辰", "卯", "寅", "丑", "子", "亥", "戌"],
  戊: ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"],
  己: ["酉", "申", "未", "午", "巳", "辰", "卯", "寅", "丑", "子", "亥", "戌"],
  庚: ["巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑", "寅", "卯", "辰"],
  辛: ["子", "亥", "戌", "酉", "申", "未", "午", "巳", "辰", "卯", "寅", "丑"],
  壬: ["申", "酉", "戌", "亥", "子", "丑", "寅", "卯", "辰", "巳", "午", "未"],
  癸: ["卯", "寅", "丑", "子", "亥", "戌", "酉", "申", "未", "午", "巳", "辰"],
};
const GRAVE: Record<string, string> = {
  甲: "未", 乙: "戌", 丙: "戌", 丁: "丑", 戊: "戌", 己: "丑", 庚: "丑", 辛: "辰", 壬: "辰", 癸: "未",
};
const MA_STAR: Record<string, string> = { 申子辰: "寅", 寅午戌: "申", 巳酉丑: "亥", 亥卯未: "巳" };
const GATE_ELEMENT: Record<string, string> = { 休: "水", 生: "土", 伤: "木", 杜: "木", 景: "火", 死: "土", 惊: "金", 开: "金" };

// 对宫映射（冲）
const OPPOSITE = [8, 7, 6, 5, 4, 3, 2, 1, 0];
// 地支 → 宫位 index（用于空亡/马星定位）
const BRANCH_TO_PALACE: Record<string, number> = {
  子: 7, 丑: 6, 寅: 6, 卯: 3, 辰: 0, 巳: 0, 午: 1, 未: 2, 申: 2, 酉: 5, 戌: 8, 亥: 8,
};
// 六仪击刑（地盘干落刑宫）
const JI_XING: Record<string, number[]> = {
  戊: [3], 己: [2], 庚: [6], 辛: [1], 壬: [0], 癸: [0],
};
// 九星吉凶 / 八门吉凶
const STAR_JIXIONG: Record<string, string> = {
  天辅: "吉", 天英: "凶", 天芮: "凶", 天冲: "小吉", 天禽: "大吉",
  天柱: "小凶", 天任: "吉", 天蓬: "凶", 天心: "吉",
};
const DOOR_JIXIONG: Record<string, string> = {
  休门: "吉", 生门: "吉", 伤门: "凶", 杜门: "平", 景门: "平", 死门: "凶", 惊门: "凶", 开门: "吉",
};

// ============================================================
// 工具函数
// ============================================================
function rotateFromIndex(arr: string[], idx: number): string[] {
  const i = idx % arr.length;
  return [...arr.slice(i), ...arr.slice(0, i)];
}
function generatePutSequence(flyPath: number[], start: number): number[] {
  const pi = flyPath.indexOf(start);
  const use = pi === -1 ? flyPath.indexOf(ZHONG_SUB) : pi;
  return rotateFromIndex(flyPath.map(String) as unknown as string[], use).map(Number);
}
function normalizeZhong(i: number): number {
  return i === ZHONG ? ZHONG_SUB : i;
}
// 旋转映射：source 从 sourceStart 取值，沿轨迹放入 targetStart 起点的宫位
function rotateMapping(source: string[], flyPath: number[], sourceStart: number, targetStart: number): string[] {
  const ss = sourceStart === ZHONG ? ZHONG_SUB : sourceStart;
  const ts = targetStart === ZHONG ? ZHONG_SUB : targetStart;
  const getSeq = generatePutSequence(flyPath, ss);
  const putSeq = generatePutSequence(flyPath, ts);
  const result = new Array(9).fill("");
  for (let i = 0; i < getSeq.length; i++) {
    result[putSeq[i]] = source[getSeq[i]];
  }
  result[ZHONG] = source[ZHONG]; // 中宫保持原值
  return result;
}

function getXunHead(ganzhi: string): string {
  for (const [head, arr] of Object.entries(SIX_XUNS)) {
    if (arr.includes(ganzhi)) return head;
  }
  return "甲子";
}

// ============================================================
// 主计算函数
// ============================================================
export interface QiMenResult {
  year: number; month: number; day: number; hour: number;
  lunarText: string; // 农历
  yearPillar: string; monthPillar: string; dayPillar: string; timePillar: string;
  jieQi: string; yuan: string; yinYang: "阳" | "阴"; ju: number;
  prevJqText: string; nextJqText: string;
  xunShou: string; fuShou: string;
  zhiFuStar: string; zhiShiDoor: string; zhiFuPalace: number; zhiShiPalace: number;
  maStar: string;
  kongWang: string[]; // 四柱空亡
  diPan: string[]; tianPan: string[]; stars: string[]; doors: string[]; gods: string[];
  changSheng: string[]; conds: Record<number, string[]>;
  // 天禽寄宫方向
  tianQinDir: string;
  // 全局格局
  fuYin: boolean; fanYin: boolean;
  // 空亡/马星宫位
  kongWangPalaces: number[]; maStarPalace: number;
  // 吉凶
  starJixiong: string[]; doorJixiong: string[];
}

export function calcQiMen(year: number, month: number, day: number, hour: number): QiMenResult {
  const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
  const lunar = solar.getLunar();

  // 四柱（精确干支历）
  const yearPillar = lunar.getYearInGanZhi();
  const monthPillar = lunar.getMonthInGanZhi();
  const dayPillar = lunar.getDayInGanZhi();
  const timePillar = lunar.getTimeInGanZhi();

  // 节气 + 三元 + 局数（拆补法）
  const jieQiObj = lunar.getPrevJieQi();
  const jieQi = jieQiObj.getName();
  const jieQiSolar = jieQiObj.getSolar();
  // 前后节气精确时刻（用于头部显示，如「小满 2026.05.21 08:36」）
  const nextJq = lunar.getNextJieQi();
  const fmtJq = (jq: any) => {
    if (!jq) return "";
    const s = jq.getSolar();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${jq.getName()} ${s.getYear()}.${pad(s.getMonth())}.${pad(s.getDay())} ${pad(s.getHour())}:${pad(s.getMinute())}`;
  };
  const prevJqText = fmtJq(jieQiObj);
  const nextJqText = fmtJq(nextJq);
  const daysDiff = Math.floor(solar.getJulianDay() - jieQiSolar.getJulianDay());
  const yuanIdx = daysDiff < 5 ? 0 : daysDiff < 10 ? 1 : 2;
  const yuan = ["上元", "中元", "下元"][yuanIdx];
  const cfg = JIEQI_JUSHU[jieQi];
  const isYang = cfg ? cfg.yang : true;
  const ju = cfg ? cfg.ju[yuanIdx] : 1;

  // 旬首 + 符首
  const xunShou = getXunHead(timePillar);
  const fuShou = XUN_TO_HEAD[xunShou];
  const timeGan = timePillar[0];
  const effTimeGan = timeGan === "甲" ? fuShou : timeGan;

  // 地盘
  const diPan = (isYang ? DIPAN_YANG : DIPAN_YIN)[ju].slice();

  // 天盘：符首位置取值 → 时干位置放置
  const tianPan = rotateMapping(diPan, CLOCKWISE, diPan.indexOf(fuShou), diPan.indexOf(effTimeGan));

  // 九星：值符星随时干
  const zhiFuPalace = normalizeZhong(diPan.indexOf(fuShou));
  const zhiFuStar = QIMEN_STARS[diPan.indexOf(fuShou)];
  const stars = rotateMapping(QIMEN_STARS, CLOCKWISE, QIMEN_STARS.indexOf(zhiFuStar), diPan.indexOf(effTimeGan));

  // 八门：值使门 + 飞步
  const zhiShiDoor = EIGHT_DOORS_ORIGINAL[zhiFuPalace];
  const flyStep = SIX_XUNS[xunShou].indexOf(timePillar);
  const doorFly = isYang ? DOOR_YANG : DOOR_YIN;
  const doorPutSeq = generatePutSequence(doorFly, diPan.indexOf(fuShou));
  const zhiShiTarget = normalizeZhong(doorPutSeq[flyStep % doorPutSeq.length]);
  const doorOrder = rotateFromIndex(EIGHT_DOORS_SEQUENCE, EIGHT_DOORS_SEQUENCE.indexOf(zhiShiDoor));
  const doors = new Array(9).fill("");
  const doorPlaceSeq = generatePutSequence(CLOCKWISE, zhiShiTarget);
  for (let i = 0; i < doorPlaceSeq.length; i++) {
    doors[doorPlaceSeq[i]] = doorOrder[i];
  }
  const zhiShiPalace = doors.indexOf(zhiShiDoor);

  // 八神：时干位置起，阳顺阴逆（热卜/主流转盘奇门 阳阴皆用白虎玄武）
  const godsArr = EIGHT_GODS_YIN;
  const godFly = isYang ? CLOCKWISE : COUNTER_CLOCKWISE;
  const headIdx = normalizeZhong(diPan.indexOf(effTimeGan));
  const godPutSeq = generatePutSequence(godFly, headIdx);
  const gods = new Array(9).fill("");
  for (let i = 0; i < godPutSeq.length; i++) {
    gods[godPutSeq[i]] = godsArr[i];
  }

  // 长生 / 入墓 / 门迫
  const changSheng = new Array(9).fill("");
  const conds: Record<number, string[]> = {};
  for (let p = 0; p < 9; p++) {
    conds[p] = [];
    const stem = diPan[p];
    const pb = PRIMARY_BRANCH[p];
    // 长生
    if (stem && CS_BRANCH[stem] && pb) {
      const idx = CS_BRANCH[stem].indexOf(pb);
      if (idx >= 0) changSheng[p] = CHANGSHENG_ORDER[idx];
    }
    // 入墓
    if (stem && GRAVE[stem] && GRAVE[stem] === pb) conds[p].push("入墓");
    // 击刑（六仪落刑宫）
    if (stem && JI_XING[stem] && JI_XING[stem].includes(p)) conds[p].push("击刑");
    // 门迫
    const gate = doors[p];
    const ge = GATE_ELEMENT[gate];
    const pe = ELEMENT[p];
    if (ge && ((ge === "木" && pe === "土") || (ge === "土" && pe === "水") || (ge === "水" && pe === "火") || (ge === "火" && pe === "金") || (ge === "金" && pe === "木"))) {
      conds[p].push("门迫");
    }
  }

  // 驿马（奇门以时支定）
  const timeBranch = timePillar[1];
  let maStar = "";
  for (const [k, v] of Object.entries(MA_STAR)) {
    if (k.includes(timeBranch)) { maStar = v; break; }
  }

  // 四柱空亡（各柱独立空亡）
  const kongWang: string[] = [];
  for (const pillar of [yearPillar, monthPillar, dayPillar, timePillar]) {
    const head = getXunHead(pillar);
    kongWang.push((XUN_KONGWANG[head] || []).join(""));
  }

  // 天禽寄宫方向
  const tianQinIdx = stars.indexOf("天禽");
  const tianQinDir = DIRECTION[tianQinIdx] || "中";

  // 反吟/伏吟
  const fuShouPos = diPan.indexOf(fuShou);
  const effTimePos = diPan.indexOf(effTimeGan);
  const fuYin = effTimePos === fuShouPos; // 值符星落本位
  const fanYin = OPPOSITE[effTimePos] === fuShouPos; // 值符星落对宫

  // 空亡宫位（日柱空亡） + 马星宫位
  const kongWangPalaces = (kongWang[2] || "").split("").map((b) => BRANCH_TO_PALACE[b]).filter((p) => p !== undefined);
  const maStarPalace = BRANCH_TO_PALACE[maStar] ?? -1;

  // 吉凶
  const starJixiong = stars.map((s) => STAR_JIXIONG[s] || "");
  const doorJixiong = doors.map((d) => DOOR_JIXIONG[d] || "");

  return {
    year, month, day, hour,
    lunarText: lunar.toString(),
    yearPillar, monthPillar, dayPillar, timePillar,
    jieQi, yuan, yinYang: isYang ? "阳" : "阴", ju,
    prevJqText, nextJqText,
    xunShou, fuShou, zhiFuStar, zhiShiDoor, zhiFuPalace, zhiShiPalace,
    maStar, kongWang,
    diPan, tianPan, stars, doors, gods,
    changSheng, conds, tianQinDir,
    fuYin, fanYin, kongWangPalaces, maStarPalace, starJixiong, doorJixiong,
  };
}

// 供 UI 使用的九宫元信息
export const PALACE_META = GUA.map((gua, i) => ({
  gua,
  luoshu: LUOSHU[i],
  trigram: TRIGRAM[i],
  element: ELEMENT[i],
  direction: DIRECTION[i],
  branch: PRIMARY_BRANCH[i],
}));

// 本位（原始位置）供「地盘/天盘/人盘/神盘」分盘视图使用
export const STAR_ORIGINAL = QIMEN_STARS; // 九星本位
export const DOOR_ORIGINAL = EIGHT_DOORS_ORIGINAL; // 八门本位
export const DOOR_SEQUENCE = EIGHT_DOORS_SEQUENCE;

// ============================================================
// 后天八卦卦象（点击宫位详情用）
// ============================================================
const GUA_INFO: Record<string, Record<string, string>> = {
  巽: { xiang: "风", family: "长女", body: "股", animal: "鸡", season: "春夏之交", meaning: "入、柔、顺" },
  离: { xiang: "火", family: "中女", body: "目", animal: "雉", season: "夏", meaning: "丽、明、光" },
  坤: { xiang: "地", family: "母", body: "腹", animal: "牛", season: "夏秋之交", meaning: "顺、柔、承载" },
  震: { xiang: "雷", family: "长男", body: "足", animal: "龙", season: "春", meaning: "动、奋、起" },
  兑: { xiang: "泽", family: "少女", body: "口", animal: "羊", season: "秋", meaning: "悦、说、缺" },
  艮: { xiang: "山", family: "少男", body: "手", animal: "狗", season: "冬春之交", meaning: "止、静、阻" },
  坎: { xiang: "水", family: "中男", body: "耳", animal: "豕", season: "冬", meaning: "陷、险、隐" },
  乾: { xiang: "天", family: "父", body: "首", animal: "马", season: "秋冬之交", meaning: "健、刚、君" },
};

export function getGuaInfo(gua: string): Record<string, string> {
  return GUA_INFO[gua] || {};
}

// ============================================================
// 十干克应格局（天盘干 + 地盘干 → 格局名/吉凶/断语）
// ============================================================
const SHIGAN_KEYING: Record<string, { name: string; ji: string; desc: string }> = {
  戊丙: { name: "青龙返首", ji: "大吉", desc: "谋为皆吉，百事顺遂" },
  丙戊: { name: "飞鸟跌穴", ji: "大吉", desc: "百事可为，谋事易成" },
  戊乙: { name: "青龙合灵", ji: "吉", desc: "阴阳和合，谋事可成" },
  乙戊: { name: "阴害阳门", ji: "凶", desc: "阴害阳，宜守不宜攻" },
  庚丙: { name: "太白入荧", ji: "凶", desc: "防盗贼，不宜远行" },
  丙庚: { name: "荧入太白", ji: "凶", desc: "防盗，谋事不利" },
  丁癸: { name: "朱雀投江", ji: "凶", desc: "文书口舌，防是非" },
  癸丁: { name: "螣蛇夭矫", ji: "凶", desc: "虚惊怪异，防口舌" },
  辛乙: { name: "白虎猖狂", ji: "凶", desc: "出行不利，防意外" },
  乙辛: { name: "青龙逃走", ji: "凶", desc: "防走失，奴仆拐带" },
  庚癸: { name: "大格", ji: "凶", desc: "谋事不成，宜静不宜动" },
  庚壬: { name: "小格", ji: "凶", desc: "谋事不利，有阻隔" },
  乙庚: { name: "日奇被刑", ji: "凶", desc: "争讼财产，防刑伤" },
  丙辛: { name: "月奇相合", ji: "吉", desc: "谋事可成，合作有利" },
  戊辛: { name: "青龙折足", ji: "凶", desc: "防破财损失" },
  戊壬: { name: "青龙入狱", ji: "凶", desc: "凡谋不利，有阻" },
  丁戊: { name: "青龙转光", ji: "吉", desc: "贵人相助，谋事可成" },
  戊丁: { name: "青龙耀明", ji: "吉", desc: "谒贵求名，谋事可成" },
};

export function getGeJu(tianGan: string, diGan: string): { name: string; ji: string; desc: string } | null {
  if (!tianGan || !diGan) return null;
  return SHIGAN_KEYING[tianGan + diGan] || null;
}
