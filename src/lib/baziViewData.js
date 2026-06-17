import lunarJavascript from "lunar-javascript";

const { Solar } = lunarJavascript;

const PILLAR_KEYS = ["year", "month", "day", "time"];
const PILLAR_LABELS = { year: "年柱", month: "月柱", day: "日柱", time: "时柱" };
const GAN_ELEMENT = {
  甲: "木", 乙: "木", 丙: "火", 丁: "火", 戊: "土",
  己: "土", 庚: "金", 辛: "金", 壬: "水", 癸: "水",
};
const GAN_COLORS = {
  木: "#4a9b58",
  火: "#b82e2e",
  土: "#9a7a43",
  金: "#c08b2d",
  水: "#2f66c9",
};
const ZHI_HIDE_LABELS = {
  子: ["癸"], 丑: ["己", "癸", "辛"], 寅: ["甲", "丙", "戊"], 卯: ["乙"],
  辰: ["戊", "乙", "癸"], 巳: ["丙", "戊", "庚"], 午: ["丁", "己"], 未: ["己", "丁", "乙"],
  申: ["庚", "壬", "戊"], 酉: ["辛"], 戌: ["戊", "辛", "丁"], 亥: ["壬", "甲"],
};
const COMBINE_STEMS = {
  甲己: "甲己合化土", 乙庚: "乙庚合化金", 丙辛: "丙辛合化水", 丁壬: "丁壬合化木", 戊癸: "戊癸合化火",
};
const CLASH_STEMS = {
  甲庚: "甲庚相冲", 乙辛: "乙辛相冲", 丙壬: "丙壬相冲", 丁癸: "丁癸相冲",
};
const COMBINE_BRANCHES = {
  子丑: "子丑合土", 寅亥: "寅亥合木", 卯戌: "卯戌合火", 辰酉: "辰酉合金", 巳申: "巳申合水", 午未: "午未合土",
};
const CLASH_BRANCHES = {
  子午: "子午相冲", 丑未: "丑未相冲", 寅申: "寅申相冲", 卯酉: "卯酉相冲", 辰戌: "辰戌相冲", 巳亥: "巳亥相冲",
};
const HARM_BRANCHES = {
  子未: "子未相害", 丑午: "丑午相害", 寅巳: "寅巳相害", 卯辰: "卯辰相害", 申亥: "申亥相害", 酉戌: "酉戌相害",
};
const SHEN_SHA_RULES = [
  { name: "天乙贵人", test: (dayGan, zhi) => ({ 甲: "丑未", 戊: "丑未", 庚: "丑未", 乙: "子申", 己: "子申", 丙: "亥酉", 丁: "亥酉", 壬: "卯巳", 癸: "卯巳", 辛: "寅午" }[dayGan] || "").includes(zhi) },
  { name: "文昌贵人", test: (dayGan, zhi) => ({ 甲: "巳", 乙: "午", 丙: "申", 丁: "酉", 戊: "申", 己: "酉", 庚: "亥", 辛: "子", 壬: "寅", 癸: "卯" }[dayGan] || "") === zhi },
  { name: "桃花", test: (_dayGan, zhi, dayZhi) => groupRule(dayZhi, { "申子辰": "酉", "寅午戌": "卯", "亥卯未": "子", "巳酉丑": "午" }) === zhi },
  { name: "驿马", test: (_dayGan, zhi, dayZhi) => groupRule(dayZhi, { "申子辰": "寅", "寅午戌": "申", "亥卯未": "巳", "巳酉丑": "亥" }) === zhi },
  { name: "华盖", test: (_dayGan, zhi, dayZhi) => groupRule(dayZhi, { "申子辰": "辰", "寅午戌": "戌", "亥卯未": "未", "巳酉丑": "丑" }) === zhi },
  { name: "将星", test: (_dayGan, zhi, dayZhi) => groupRule(dayZhi, { "申子辰": "子", "寅午戌": "午", "亥卯未": "卯", "巳酉丑": "酉" }) === zhi },
];

function call(obj, method, fallback = "") {
  try {
    const value = obj?.[method]?.();
    return value == null ? fallback : value;
  } catch {
    return fallback;
  }
}

function fmt2(value) {
  return String(Math.trunc(Number(value) || 0)).padStart(2, "0");
}

function pairLookup(a, b, table) {
  return table[a + b] || table[b + a] || "";
}

function groupRule(zhi, table) {
  return Object.entries(table).find(([group]) => group.includes(zhi))?.[1] || "";
}

function splitGanZhi(value) {
  return { gan: value?.[0] || "", zhi: value?.[1] || "" };
}

function pillarFromEightChar(eightChar, key) {
  const cap = key === "time" ? "Time" : key[0].toUpperCase() + key.slice(1);
  const value = call(eightChar, `get${cap}`);
  const { gan, zhi } = splitGanZhi(value);
  const hidden = call(eightChar, `get${cap}HideGan`, ZHI_HIDE_LABELS[zhi] || []);
  const hiddenList = Array.isArray(hidden) ? hidden : String(hidden || "").split(",").filter(Boolean);
  const hiddenTenGods = call(eightChar, `get${cap}ShiShenZhi`, []);
  return {
    key,
    label: PILLAR_LABELS[key],
    value,
    gan,
    zhi,
    element: GAN_ELEMENT[gan] || "",
    color: GAN_COLORS[GAN_ELEMENT[gan]] || "#555",
    tenGod: call(eightChar, `get${cap}ShiShenGan`),
    hidden: hiddenList,
    hiddenTenGods: Array.isArray(hiddenTenGods) ? hiddenTenGods : String(hiddenTenGods || "").split(",").filter(Boolean),
    diShi: call(eightChar, `get${cap}DiShi`),
    naYin: call(eightChar, `get${cap}NaYin`),
    xunKong: call(eightChar, `get${cap}XunKong`),
    ganZhi: value,
  };
}

function buildInteractions(items) {
  const stemHits = [];
  const branchHits = [];
  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) {
      const a = items[i];
      const b = items[j];
      const stemCombine = pairLookup(a.gan, b.gan, COMBINE_STEMS);
      const stemClash = pairLookup(a.gan, b.gan, CLASH_STEMS);
      const branchCombine = pairLookup(a.zhi, b.zhi, COMBINE_BRANCHES);
      const branchClash = pairLookup(a.zhi, b.zhi, CLASH_BRANCHES);
      const branchHarm = pairLookup(a.zhi, b.zhi, HARM_BRANCHES);
      if (stemCombine) stemHits.push(stemCombine);
      if (stemClash) stemHits.push(stemClash);
      if (branchCombine) branchHits.push(branchCombine);
      if (branchClash) branchHits.push(branchClash);
      if (branchHarm) branchHits.push(branchHarm);
    }
  }
  return {
    stems: [...new Set(stemHits)],
    branches: [...new Set(branchHits)],
    whole: stemHits.length && branchHits.length ? [`${stemHits[0].slice(0, 2)}${branchHits[0].slice(0, 2)}并见`] : [],
  };
}

function buildShenShaRows(pillars, activeZhi = "") {
  const dayGan = pillars.day.gan;
  const dayZhi = pillars.day.zhi;
  return PILLAR_KEYS.map((key) => {
    const p = pillars[key];
    const names = SHEN_SHA_RULES.filter(rule => rule.test(dayGan, p.zhi, dayZhi)).map(rule => rule.name);
    if (p.zhi === activeZhi) names.unshift("当前");
    return { key, label: p.value, active: p.zhi === activeZhi, names: [...new Set(names)] };
  });
}

function buildLiuRi(year, month, activeDay = 0) {
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const lunar = Solar.fromYmdHms(year, month, day, 12, 0, 0).getLunar();
    const ganZhi = call(lunar, "getDayInGanZhi");
    const split = splitGanZhi(ganZhi);
    return {
      day,
      label: `${day}日`,
      lunarDay: call(lunar, "getDayInChinese"),
      ganZhi,
      gan: split.gan,
      zhi: split.zhi,
      xunKong: call(lunar, "getDayXunKong"),
      active: day === activeDay,
    };
  });
}

function safeDaYun(yun, currentYear) {
  const list = call(yun, "getDaYun", []);
  if (!Array.isArray(list)) return [];
  return list.map((item, index) => {
    const ganZhi = call(item, "getGanZhi");
    const split = splitGanZhi(ganZhi);
    const liuNian = call(item, "getLiuNian", []);
    return {
      index,
      startYear: call(item, "getStartYear", 0),
      endYear: call(item, "getEndYear", 0),
      startAge: call(item, "getStartAge", 0),
      endAge: call(item, "getEndAge", 0),
      ganZhi,
      gan: split.gan,
      zhi: split.zhi,
      tenGod: "",
      xunKong: call(item, "getXunKong", ""),
      active: currentYear >= call(item, "getStartYear", 0) && currentYear <= call(item, "getEndYear", 0),
      liuNian: Array.isArray(liuNian) ? liuNian.map((yearItem) => {
        const yGanZhi = call(yearItem, "getGanZhi");
        const ySplit = splitGanZhi(yGanZhi);
        return {
          year: call(yearItem, "getYear", 0),
          age: call(yearItem, "getAge", 0),
          ganZhi: yGanZhi,
          gan: ySplit.gan,
          zhi: ySplit.zhi,
          xunKong: call(yearItem, "getXunKong", ""),
          active: call(yearItem, "getYear", 0) === currentYear,
          liuYue: Array.isArray(call(yearItem, "getLiuYue", [])) ? call(yearItem, "getLiuYue", []).map((monthItem) => {
            const monthIndex = Number(call(monthItem, "getIndex", 0));
            const month = monthIndex + 1;
            const mGanZhi = call(monthItem, "getGanZhi");
            return {
              index: monthIndex,
              month: call(monthItem, "getMonthInChinese", ""),
              ganZhi: mGanZhi,
              xunKong: call(monthItem, "getXunKong", ""),
              active: call(yearItem, "getYear", 0) === currentYear && month === new Date().getMonth() + 1,
              liuRi: buildLiuRi(call(yearItem, "getYear", currentYear), month, call(yearItem, "getYear", 0) === currentYear ? new Date().getDate() : 0),
              ...splitGanZhi(mGanZhi),
            };
          }) : [],
        };
      }) : [],
    };
  });
}

export function buildBaziViewData(input) {
  const year = Number(input.year);
  const month = Number(input.month);
  const day = Number(input.day);
  const hour = Number(input.hour);
  const minute = Number(input.minute);
  const gender = Number(input.gender ?? 1);
  const currentYear = Number(input.currentYear || new Date().getFullYear());
  const currentMonth = Number(input.currentMonth || new Date().getMonth() + 1);
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();
  const pillars = Object.fromEntries(PILLAR_KEYS.map(key => [key, pillarFromEightChar(eightChar, key)]));
  const yun = eightChar.getYun(gender);
  const daYun = safeDaYun(yun, currentYear);
  const current = daYun.find(item => item.active) || null;
  const currentYearItem = current?.liuNian?.find(item => item.active) || null;
  const relationItems = [
    ...PILLAR_KEYS.map(key => pillars[key]),
    current ? { gan: current.gan, zhi: current.zhi } : null,
    currentYearItem ? { gan: currentYearItem.gan, zhi: currentYearItem.zhi } : null,
  ].filter(Boolean);

  return {
    name: input.name || "韩韩",
    solarText: `${year}年${month}月${day}日 ${fmt2(hour)}:${fmt2(minute)}:00`,
    lunarText: lunar.toString(),
    pillars,
    pillarList: PILLAR_KEYS.map(key => pillars[key]),
    dayMaster: {
      stem: pillars.day.gan,
      branch: pillars.day.zhi,
      element: GAN_ELEMENT[pillars.day.gan] || "",
      color: GAN_COLORS[GAN_ELEMENT[pillars.day.gan]] || "#555",
    },
    extraPillars: [
      { label: "胎元", value: call(eightChar, "getTaiYuan"), naYin: call(eightChar, "getTaiYuanNaYin") },
      { label: "命宫", value: call(eightChar, "getMingGong"), naYin: call(eightChar, "getMingGongNaYin") },
      { label: "身宫", value: call(eightChar, "getShenGong"), naYin: call(eightChar, "getShenGongNaYin") },
      { label: "胎息", value: call(eightChar, "getTaiXi"), naYin: call(eightChar, "getTaiXiNaYin") },
    ],
    detailRows: Object.fromEntries(PILLAR_KEYS.map(key => [key, [
      { label: "藏干", value: pillars[key].hidden.join(" ") || "-" },
      { label: "星运", value: pillars[key].diShi || "-" },
      { label: "纳音", value: pillars[key].naYin || "-" },
      { label: "十神", value: pillars[key].tenGod || "-" },
    ]])),
    luck: {
      startText: `出生后${call(yun, "getStartYear", 0)}年${call(yun, "getStartMonth", 0)}月${call(yun, "getStartDay", 0)}天${call(yun, "getStartHour", 0)}时起运`,
      daYun,
      current,
      currentYear: currentYearItem,
      currentMonths: currentYearItem?.liuYue || [],
      currentDays: currentYearItem?.liuYue?.[currentMonth - 1]?.liuRi || [],
    },
    interactions: {
      natal: buildInteractions(PILLAR_KEYS.map(key => pillars[key])),
      transit: buildInteractions(relationItems),
    },
    shenSha: {
      natal: buildShenShaRows(pillars),
      luck: current ? buildShenShaRows(pillars, current.zhi) : [],
      year: currentYearItem ? buildShenShaRows(pillars, currentYearItem.zhi) : [],
    },
    meta: {
      jieQi: lunar.getJieQi() || "-",
      prevJieQi: `${lunar.getPrevJieQi().getName()} ${lunar.getPrevJieQi().getSolar().toYmdHms()}`,
      nextJieQi: `${lunar.getNextJieQi().getName()} ${lunar.getNextJieQi().getSolar().toYmdHms()}`,
      basis: "年柱、月柱使用精确节气边界；日期时间按表单输入的当地钟表时间计算。",
    },
  };
}
