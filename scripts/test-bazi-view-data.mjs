import assert from "node:assert/strict";
import { buildBaziViewData } from "../src/lib/baziViewData.js";

const chart = buildBaziViewData({
  year: 1986,
  month: 11,
  day: 14,
  hour: 18,
  minute: 45,
  gender: 1,
});

assert.equal(chart.solarText, "1986年11月14日 18:45:00");
assert.equal(chart.pillars.year.value, "丙寅");
assert.equal(chart.pillars.month.value, "己亥");
assert.equal(chart.pillars.day.value, "壬戌");
assert.equal(chart.pillars.time.value, "己酉");
assert.equal(chart.pillars.month.hidden.join(","), "壬,甲");
assert.equal(chart.pillars.time.naYin, "大驿土");
assert.equal(chart.dayMaster.stem, "壬");
assert.equal(chart.luck.startText, "出生后7年8月0天0时起运");
assert.equal(chart.luck.daYun[4].ganZhi, "癸卯");
assert.equal(chart.luck.daYun[4].startYear, 2024);
assert.equal(chart.luck.daYun[4].startAge, 39);
assert.equal(chart.luck.current?.ganZhi, "癸卯");
assert.equal(chart.luck.currentYear?.year, 2026);
assert.equal(chart.luck.currentYear?.ganZhi, "丙午");
assert.equal(chart.detailRows.day.some((item) => item.label === "纳音" && item.value === "大海水"), true);

console.log("bazi view data tests passed");
