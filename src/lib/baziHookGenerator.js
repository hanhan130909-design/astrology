/**
 * 八字命运钩子生成器
 * 基于排盘数据动态生成焦虑型转化话术
 * 8种场景：冲婚姻宫 / 冲财库 / 犯太岁 / 大运交接 / 十神异动 / 合化机会 / 空亡预警 / 神煞触发
 */

// 财库（墓库）对照表：日主五行 → 财库地支
const WEALTH_TOMB = {
  金: "丑", // 庚辛金，墓在丑
  木: "未", // 甲乙木，墓在未
  水: "辰", // 壬癸水，墓在辰
  火: "戌", // 丙丁火，墓在戌
  土: "辰", // 戊己土，墓在辰
};

// 日主五行
const GAN_ELEMENT = {
  甲: "木", 乙: "木", 丙: "火", 丁: "火", 戊: "土",
  己: "土", 庚: "金", 辛: "金", 壬: "水", 癸: "水",
};

// 天干十神计算（以日主为我）
const TEN_GOD_ORDER = ["比肩", "劫财", "食神", "伤官", "偏财", "正财", "七杀", "正官", "偏印", "正印"];
const GAN_INDEX = { 甲: 0, 乙: 1, 丙: 2, 丁: 3, 戊: 4, 己: 5, 庚: 6, 辛: 7, 壬: 8, 癸: 9 };

function getTenGod(dayGan, otherGan) {
  const dayIdx = GAN_INDEX[dayGan];
  const otherIdx = GAN_INDEX[otherGan];
  if (dayIdx == null || otherIdx == null) return "";
  const diff = (otherIdx - dayIdx + 10) % 10;
  return TEN_GOD_ORDER[diff];
}

// 地支六冲表
const SIX_CLASHES = {
  子: "午", 午: "子",
  丑: "未", 未: "丑",
  寅: "申", 申: "寅",
  卯: "酉", 酉: "卯",
  辰: "戌", 戌: "辰",
  巳: "亥", 亥: "巳",
};

function hasClash(branchList, target) {
  return branchList.some(s => s.includes("冲") && s.includes(target));
}

function hasCombine(branchList, target) {
  return branchList.some(s => s.includes("合") && s.includes(target));
}

function hasHarm(branchList, target) {
  return branchList.some(s => s.includes("害") && s.includes(target));
}

/**
 * 生成命运钩子
 * @param {Object} bazi - buildBaziViewData 返回的排盘数据
 * @param {string} lang - 语言代码 zh/en/id/th/vi/ms/ja/ko
 * @returns {Object} { type, title, hookText, urgency, ctaProduct }
 */
export function generateBaziHook(bazi, lang = "zh") {
  if (!bazi || !bazi.dayMaster || !bazi.luck) {
    return getDefaultHook(lang);
  }

  const dayMaster = bazi.dayMaster.stem; // 辛
  const dayElement = bazi.dayMaster.element; // 金
  const dayBranch = bazi.pillars?.day?.zhi; // 亥（婚姻宫/配偶宫）
  const yearBranch = bazi.pillars?.year?.zhi; // 午（生肖宫）
  const currentYear = bazi.luck.currentYear;
  const currentDaYun = bazi.luck.current;
  const transitBranches = bazi.interactions?.transit?.branches || [];
  const transitStems = bazi.interactions?.transit?.stems || [];
  const natalBranches = bazi.interactions?.natal?.branches || [];
  const yearShenSha = bazi.shenSha?.year || [];
  const currentYearNum = currentYear?.year || new Date().getFullYear();

  // 收集所有命中的场景，按紧急程度排序
  const scenarios = [];

  // ─── 场景1：流年冲婚姻宫 ───
  if (dayBranch && currentYear?.zhi && hasClash(transitBranches, dayBranch)) {
    const clashWith = SIX_CLASHES[dayBranch];
    scenarios.push({
      type: "marriage_clash",
      urgency: 5,
      data: { dayMaster, dayBranch, clashWith, year: currentYearNum, yearZhi: currentYear.zhi },
    });
  }

  // ─── 场景2：流年冲财库 ───
  const wealthTomb = WEALTH_TOMB[dayElement];
  if (wealthTomb && currentYear?.zhi && hasClash(transitBranches, wealthTomb)) {
    scenarios.push({
      type: "wealth_clash",
      urgency: 5,
      data: { dayMaster, dayElement, wealthTomb, year: currentYearNum, yearZhi: currentYear.zhi },
    });
  }

  // ─── 场景3：犯太岁 / 冲太岁 ───
  if (yearBranch && currentYear?.zhi) {
    if (yearBranch === currentYear.zhi) {
      scenarios.push({
        type: "fan_taisui",
        urgency: 4,
        data: { yearBranch, yearZhi: currentYear.zhi, year: currentYearNum },
      });
    } else if (hasClash(transitBranches, yearBranch)) {
      scenarios.push({
        type: "chong_taisui",
        urgency: 4,
        data: { yearBranch, yearZhi: currentYear.zhi, year: currentYearNum },
      });
    }
  }

  // ─── 场景4：大运交接 ───
  if (currentDaYun && (currentDaYun.endYear === currentYearNum || currentDaYun.startYear === currentYearNum)) {
    scenarios.push({
      type: "dayun_transition",
      urgency: 4,
      data: {
        dayMaster,
        fromGan: currentDaYun.gan,
        fromZhi: currentDaYun.zhi,
        year: currentYearNum,
        isEnding: currentDaYun.endYear === currentYearNum,
      },
    });
  }

  // ─── 场景5：十神异动（流年天干是伤官/七杀/枭神）───
  if (currentYear?.gan && dayMaster) {
    const yearTenGod = getTenGod(dayMaster, currentYear.gan);
    if (["伤官", "七杀", "偏印"].includes(yearTenGod)) {
      scenarios.push({
        type: "tengod_alert",
        urgency: 3,
        data: { dayMaster, yearGan: currentYear.gan, yearTenGod, year: currentYearNum },
      });
    }
  }

  // ─── 场景6：合化机会（流年与原局有合）───
  if (currentYear?.zhi && (hasCombine(transitBranches, currentYear.zhi) || transitStems.some(s => s.includes("合")))) {
    scenarios.push({
      type: "combine_opportunity",
      urgency: 2,
      data: { dayMaster, year: currentYearNum, yearZhi: currentYear.zhi },
    });
  }

  // ─── 场景7：空亡预警（日支空亡或流年空亡）───
  const dayXunKong = bazi.pillars?.day?.xunKong;
  if (dayXunKong && dayXunKong !== "-" && dayXunKong !== "") {
    scenarios.push({
      type: "xunkong_alert",
      urgency: 2,
      data: { dayMaster, xunKong: dayXunKong, year: currentYearNum },
    });
  }

  // ─── 场景8：神煞触发（桃花/驿马/华盖）───
  const activeShenSha = yearShenSha.flatMap(row => row.names || []).filter(n =>
    ["桃花", "驿马", "华盖", "天乙贵人"].includes(n)
  );
  if (activeShenSha.length > 0) {
    scenarios.push({
      type: "shensha_trigger",
      urgency: 1,
      data: { dayMaster, shenSha: activeShenSha[0], year: currentYearNum },
    });
  }

  // 按紧急程度排序，取最高的
  scenarios.sort((a, b) => b.urgency - a.urgency);
  const top = scenarios[0];

  if (top) {
    return formatHook(top, lang);
  }

  return getDefaultHook(lang);
}

// ─── 话术模板（8语言）───
const HOOK_TEMPLATES = {
  marriage_clash: {
    zh: (d) => ({
      title: `⚠️ ${d.year}年感情预警`,
      hook: `你的日主${d.dayMaster}，日支${d.dayBranch}是婚姻宫。${d.year}年${d.yearZhi}冲${d.dayBranch}，直接冲了你的婚姻宫。免费版只能看到"冲"，付费版告诉你：这个冲是好是坏？哪3个月最危险？单身的人今年能不能脱单？有伴的人怎么避免吵架分手？`,
    }),
    en: (d) => ({
      title: `⚠️ Relationship Alert ${d.year}`,
      hook: `Your Day Master ${d.dayMaster}, Day Branch ${d.dayBranch} is your Marriage Palace. In ${d.year}, ${d.yearZhi} clashes ${d.dayBranch} — directly hitting your relationship sector. Free chart only shows the clash. Paid report reveals: Is this clash good or bad? Which 3 months are most dangerous? Will singles find love? How to avoid breakup?`,
    }),
    id: (d) => ({
      title: `⚠️ Peringatan Cinta ${d.year}`,
      hook: `Day Master Anda ${d.dayMaster}, Cabang Hari ${d.dayBranch} adalah Istana Pernikahan. Tahun ${d.year}, ${d.yearZhi} menyerang ${d.dayBranch}. Versi gratis hanya menunjukkan serangan. Laporan berbayar menjawab: Apakah ini baik atau buruk? 3 bulan mana yang paling berbahaya?`,
    }),
    th: (d) => ({
      title: `⚠️ เตือนดวงรัก ${d.year}`,
      hook: `เจ้าชะตา ${d.dayMaster}，แขนงวัน ${d.dayBranch} คือพระราชวังสมรส ปี ${d.year} ${d.yearZhi} ชน ${d.dayBranch} โดยตรง เวอร์ชันฟรีเห็นแค่การชน รายงานแบบจ่ายบอก: ดีหรือร้าย? 3 เดือนไหนอันตรายที่สุด?`,
    }),
    vi: (d) => ({
      title: `⚠️ Cảnh báo tình duyên ${d.year}`,
      hook: `Nhật Chủ ${d.dayMaster}，Địa Chi ngày ${d.dayBranch} là Cung Phu Thê. Năm ${d.year}, ${d.yearZhi} xung ${d.dayBranch} trực tiếp. Bản miễn phí chỉ thấy xung. Báo cáo trả lời: Tốt hay xấu? 3 tháng nào nguy hiểm nhất?`,
    }),
    ms: (d) => ({
      title: `⚠️ Amaran Hubungan ${d.year}`,
      hook: `Day Master ${d.dayMaster}，Cabang Hari ${d.dayBranch} ialah Istana Perkahwinan. Tahun ${d.year}, ${d.yearZhi} bertembung ${d.dayBranch}. Versi percuma hanya menunjukkan pertembungan. Laporan berbayar: Baik atau buruk? 3 bulan paling berbahaya?`,
    }),
    ja: (d) => ({
      title: `⚠️ ${d.year}年 恋愛運警告`,
      hook: `日主${d.dayMaster}、日支${d.dayBranch}は結婚宮。${d.year}年${d.yearZhi}が${d.dayBranch}を直接冲撃。無料版は「冲」しか見せません。有料レポート：良いか悪いか？最も危険な3ヶ月は？別れを防ぐには？`,
    }),
    ko: (d) => ({
      title: `⚠️ ${d.year}년 연애운 경고`,
      hook: `일주 ${d.dayMaster}，일지 ${d.dayBranch}는 배우자궁. ${d.year}년 ${d.yearZhi}가 ${d.dayBranch}을 직접 충돌. 무료 버전은 '충'만 보여줌. 유료 리포트: 좋은가 나쁜가? 가장 위험한 3개월은? 이별 방지법은?`,
    }),
  },

  wealth_clash: {
    zh: (d) => ({
      title: `⚠️ ${d.year}年财运波动`,
      hook: `你的日主${d.dayMaster}（${d.dayElement}），财库在${d.wealthTomb}。${d.year}年${d.yearZhi}冲${d.wealthTomb}，财库被冲开——是破财还是发财？免费版看不到答案。付费版告诉你：今年适合投资还是守财？哪几个月有意外收入？哪几个月要防破财？`,
    }),
    en: (d) => ({
      title: `⚠️ Wealth Fluctuation ${d.year}`,
      hook: `Your Day Master ${d.dayMaster} (${d.dayElement}), wealth tomb is ${d.wealthTomb}. In ${d.year}, ${d.yearZhi} clashes ${d.wealthTomb} — your wealth vault is being opened. Is it loss or gain? Free chart has no answer. Paid report: Invest or save? Which months bring windfall? Which months risk losing money?`,
    }),
    id: (d) => ({
      title: `⚠️ Fluktuasi Keuangan ${d.year}`,
      hook: `Day Master ${d.dayMaster} (${d.dayElement})，makam kekayaan di ${d.wealthTomb}. Tahun ${d.year}, ${d.yearZhi} menyerang ${d.wealthTomb}. Rugi atau untung? Laporan berbayar: Investasi atau simpan? Bulan mana dapat rejeki?`,
    }),
    th: (d) => ({
      title: `⚠️ เตือนการเงิน ${d.year}`,
      hook: `เจ้าชะตา ${d.dayMaster} (${d.dayElement})，สุลโกงอยู่ที่ ${d.wealthTomb}. ปี ${d.year} ${d.yearZhi} ชน ${d.wealthTomb}. เสียหรือได้? รายงานแบบจ่าย: ลงทุนหรือเก็บ? เดือนไหนได้เงิน?`,
    }),
    vi: (d) => ({
      title: `⚠️ Biến động tài lộc ${d.year}`,
      hook: `Nhật Chủ ${d.dayMaster} (${d.dayElement})，khố tài lộc ở ${d.wealthTomb}. Năm ${d.year}, ${d.yearZhi} xung ${d.wealthTomb}. Mất hay được? Báo cáo trả lời: Đầu tư hay giữ? Tháng nào có tài?`,
    }),
    ms: (d) => ({
      title: `⚠️ Turun Naik Kewangan ${d.year}`,
      hook: `Day Master ${d.dayMaster} (${d.dayElement})，kubur kekayaan di ${d.wealthTomb}. Tahun ${d.year}, ${d.yearZhi} bertembung ${d.wealthTomb}. Rugi atau untung? Laporan: Labur atau simpan? Bulan mana dapat rezeki?`,
    }),
    ja: (d) => ({
      title: `⚠️ ${d.year}年 金運変動`,
      hook: `日主${d.dayMaster}（${d.dayElement}）、財庫は${d.wealthTomb}。${d.year}年${d.yearZhi}が${d.wealthTomb}を冲撃。損か得か？有料レポート：投資すべきか守るべきか？臨時収入の月は？`,
    }),
    ko: (d) => ({
      title: `⚠️ ${d.year}년 재물운 변동`,
      hook: `일주 ${d.dayMaster} (${d.dayElement})，재물고는 ${d.wealthTomb}. ${d.year}년 ${d.yearZhi}가 ${d.wealthTomb}을 충돌. 손해인가 이득인가? 유료 리포트: 투자 or 보관? 횡재하는 달은?`,
    }),
  },

  fan_taisui: {
    zh: (d) => ({
      title: `⚠️ ${d.year}年犯太岁`,
      hook: `你的生肖地支是${d.yearBranch}，${d.year}年也是${d.yearZhi}——本命年犯太岁。老话说"太岁当头坐，无喜必有祸"。免费版只告诉你犯太岁，付费版告诉你：今年哪些方面要特别小心？怎么化解？哪几个月是关键节点？`,
    }),
    en: (d) => ({
      title: `⚠️ Fan Tai Sui ${d.year}`,
      hook: `Your zodiac branch is ${d.yearBranch}, and ${d.year} is also ${d.yearZhi} — your Ben Ming Nian (zodiac year). The saying goes: "When Tai Sui sits above, either joy or disaster." Free chart only tells you it's your zodiac year. Paid report: Which areas need caution? How to navigate? Which months are critical?`,
    }),
    id: (d) => ({
      title: `⚠️ Fan Tai Sui ${d.year}`,
      hook: `Zodiak Anda ${d.yearBranch}，tahun ${d.year} juga ${d.yearZhi} — tahun zodiak Anda. Versi gratis hanya memberitahu. Laporan berbayar: Apa yang harus diwaspadai? Bagaimana mengatasinya?`,
    }),
    th: (d) => ({
      title: `⚠️ ฟันไท่ส่วย ${d.year}`,
      hook: `ราศีของคุณ ${d.yearBranch}，ปี ${d.year} ก็ ${d.yearZhi} — ปีชองราศี. เวอร์ชันฟรีแค่บอก. รายงานแบบจ่าย: อะไรที่ต้องระวัง? เดือนไหนสำคัญ?`,
    }),
    vi: (d) => ({
      title: `⚠️ Phạm Thái Tuế ${d.year}`,
      hook: `Chiêm tinh của bạn ${d.yearBranch}，năm ${d.year} cũng ${d.yearZhi} — năm bản mệnh. Bản miễn phí chỉ nói. Báo cáo trả lời: Cần cẩn thận gì? Tháng nào then chốt?`,
    }),
    ms: (d) => ({
      title: `⚠️ Fan Tai Sui ${d.year}`,
      hook: `Zodiak Anda ${d.yearBranch}，tahun ${d.year} juga ${d.yearZhi} — tahun zodiak. Versi percuma hanya beritahu. Laporan: Apa yang perlu dijaga? Bulan mana kritikal?`,
    }),
    ja: (d) => ({
      title: `⚠️ ${d.year}年 本命年`,
      hook: `あなたの地支は${d.yearBranch}、${d.year}年も${d.yearZhi}——本命年です。「太岁頭に坐す、喜無きれば必ず禍あり」。無料版は本命年だと告げるだけ。有料レポート：何に注意？どう乗り切る？`,
    }),
    ko: (d) => ({
      title: `⚠️ ${d.year}년 본명년`,
      hook: `당신의 지지 ${d.yearBranch}，${d.year}년도 ${d.yearZhi} — 본명년입니다. 무료 버전은 본명년이라고만 알려줌. 유료 리포트: 무엇을 조심? 어떻게 대비?`,
    }),
  },

  chong_taisui: {
    zh: (d) => ({
      title: `⚠️ ${d.year}年冲太岁`,
      hook: `你的生肖地支是${d.yearBranch}，${d.year}年${d.yearZhi}冲${d.yearBranch}——冲太岁比犯太岁更猛。免费版只看到冲，付费版告诉你：今年变动会落在哪个领域？是主动求变还是被动挨打？怎么把冲变成机会？`,
    }),
    en: (d) => ({
      title: `⚠️ Chong Tai Sui ${d.year}`,
      hook: `Your zodiac branch is ${d.yearBranch}, and ${d.year} ${d.yearZhi} clashes ${d.yearBranch} — Chong Tai Sui is more intense than Fan Tai Sui. Free chart only shows the clash. Paid report: Which area of life will be affected? Initiate change or wait? How to turn clash into opportunity?`,
    }),
    id: (d) => ({
      title: `⚠️ Chong Tai Sui ${d.year}`,
      hook: `Zodiak Anda ${d.yearBranch}，tahun ${d.year} ${d.yearZhi} menyerang ${d.yearBranch}. Lebih kuat dari Fan Tai Sui. Laporan berbayar: Bidang mana yang terpengaruh?`,
    }),
    th: (d) => ({
      title: `⚠️ ชงไท่ส่วย ${d.year}`,
      hook: `ราศี ${d.yearBranch}，ปี ${d.year} ${d.yearZhi} ชน ${d.yearBranch} — ชงไท่ส่วยรุนแรงกว่า. รายงานแบบจ่าย: ด้านไหนได้รับผลกระทบ?`,
    }),
    vi: (d) => ({
      title: `⚠️ Xung Thái Tuế ${d.year}`,
      hook: `Chiêm tinh ${d.yearBranch}，năm ${d.year} ${d.yearZhi} xung ${d.yearBranch} — mạnh hơn phạm thái tuế. Báo cáo: Lĩnh vực nào bị ảnh hưởng?`,
    }),
    ms: (d) => ({
      title: `⚠️ Chong Tai Sui ${d.year}`,
      hook: `Zodiak ${d.yearBranch}，tahun ${d.year} ${d.yearZhi} bertembung ${d.yearBranch}. Lebih kuat. Laporan: Bidang mana terjejas?`,
    }),
    ja: (d) => ({
      title: `⚠️ ${d.year}年 冲太岁`,
      hook: `あなたの地支${d.yearBranch}、${d.year}年${d.yearZhi}が${d.yearBranch}を冲撃——冲太岁は犯太岁より激しい。有料レポート：どの分野に影響？チャンスに変えるには？`,
    }),
    ko: (d) => ({
      title: `⚠️ ${d.year}년 충태세`,
      hook: `지지 ${d.yearBranch}，${d.year}년 ${d.yearZhi}가 ${d.yearBranch}을 충돌 — 범태세보다 강함. 유료 리포트: 어느 분야 영향? 기회로 바꾸는 법?`,
    }),
  },

  dayun_transition: {
    zh: (d) => ({
      title: `🔄 ${d.year}年大运交接`,
      hook: `你现在走${d.fromGan}${d.fromZhi}大运，${d.year}年是大运交接之年。大运一换，人生方向全变——有人换工作、有人搬家、有人结婚、有人离婚。免费版只显示大运时间表，付费版告诉你：下一步大运是上坡还是下坡？哪些方面会剧变？怎么提前布局？`,
    }),
    en: (d) => ({
      title: `🔄 Luck Cycle Transition ${d.year}`,
      hook: `You're in the ${d.fromGan}${d.fromZhi} luck cycle, and ${d.year} is a transition year. When the 10-year luck cycle changes, life direction shifts — jobs, homes, marriages. Free chart only shows the timeline. Paid report: Is the next cycle uphill or downhill? What changes? How to prepare?`,
    }),
    id: (d) => ({
      title: `🔄 Transisi Siklus Keberuntungan ${d.year}`,
      hook: `Anda dalam siklus ${d.fromGan}${d.fromZhi}，${d.year} adalah tahun transisi. Hidup berubah arah. Laporan berbayar: Siklus berikutnya naik atau turun?`,
    }),
    th: (d) => ({
      title: `🔄 เปลี่ยนดวงใหญ่ ${d.year}`,
      hook: `คุณอยู่ในวัฏจักร ${d.fromGan}${d.fromZhi}，${d.year} เป็นปีเปลี่ยนดวง. ชีวิตเปลี่ยนทาง. รายงานแบบจ่าย: รอบต่อไปขึ้นหรือลง?`,
    }),
    vi: (d) => ({
      title: `🔄 Giao tiếp Đại Vận ${d.year}`,
      hook: `Bạn đang ở Đại Vận ${d.fromGan}${d.fromZhi}，${d.year} là năm giao tiếp. Cuộc sống đổi hướng. Báo cáo: Đại vận tiếp theo lên hay xuống?`,
    }),
    ms: (d) => ({
      title: `🔄 Peralihan Kitaran Tuah ${d.year}`,
      hook: `Anda dalam kitaran ${d.fromGan}${d.fromZhi}，${d.year} tahun peralihan. Hidup berubah arah. Laporan: Kitaran seterusnya naik atau turun?`,
    }),
    ja: (d) => ({
      title: `🔄 ${d.year}年 大運交代`,
      hook: `今${d.fromGan}${d.fromZhi}大運、${d.year}年は大運交代の年。10年周期が変われば人生も変わる。有料レポート：次の大運は上り坂か下り坂か？`,
    }),
    ko: (d) => ({
      title: `🔄 ${d.year}년 대운 교체`,
      hook: `현재 ${d.fromGan}${d.fromZhi} 대운, ${d.year}년은 대운 교체기. 인생 방향이 바뀜. 유료 리포트: 다음 대운은 오르막? 내리막?`,
    }),
  },

  tengod_alert: {
    zh: (d) => ({
      title: `⚡ ${d.year}年十神异动`,
      hook: `你的日主${d.dayMaster}，${d.year}年天干${d.yearGan}对你来说是"${d.yearTenGod}"。${d.yearTenGod === "伤官" ? "伤官见官，是非口舌不断" : d.yearTenGod === "七杀" ? "七杀当头，压力与机会并存" : "枭神夺食，小心健康和破财"}。免费版只排十神，付费版告诉你：这个十神会怎么影响你？怎么用它？`,
    }),
    en: (d) => ({
      title: `⚡ Ten God Alert ${d.year}`,
      hook: `Your Day Master ${d.dayMaster}, and ${d.year} stem ${d.yearGan} is "${d.yearTenGod}" for you. ${d.yearTenGod === "伤官" ? "Shang Guan brings conflicts and arguments" : d.yearTenGod === "七杀" ? "Qi Sha brings pressure and opportunity" : "Pian Yin warns about health and money loss"}. Free chart only lists the Ten God. Paid report: How will it affect you? How to use it?`,
    }),
    id: (d) => ({
      title: `⚡ Peringatan Sepuluh Dewa ${d.year}`,
      hook: `Day Master ${d.dayMaster}，tahun ${d.year} batang ${d.yearGan} adalah "${d.yearTenGod}". Laporan berbayar: Bagaimana pengaruhnya?`,
    }),
    th: (d) => ({
      title: `⚡ เตือนสิบเทพ ${d.year}`,
      hook: `เจ้าชะตา ${d.dayMaster}，ปี ${d.year} ก้าน ${d.yearGan} คือ "${d.yearTenGod}". รายงานแบบจ่าย: ผลกระทบอย่างไร?`,
    }),
    vi: (d) => ({
      title: `⚡ Cảnh báo Thập Thần ${d.year}`,
      hook: `Nhật Chủ ${d.dayMaster}，năm ${d.year} can ${d.yearGan} là "${d.yearTenGod}". Báo cáo: Ảnh hưởng ra sao?`,
    }),
    ms: (d) => ({
      title: `⚡ Amaran Sepuluh Dewa ${d.year}`,
      hook: `Day Master ${d.dayMaster}，tahun ${d.year} batang ${d.yearGan} ialah "${d.yearTenGod}". Laporan: Bagaimana kesannya?`,
    }),
    ja: (d) => ({
      title: `⚡ ${d.year}年 十神変動`,
      hook: `日主${d.dayMaster}、${d.year}年天干${d.yearGan}はあなたにとって「${d.yearTenGod}」。有料レポート：どう影響する？`,
    }),
    ko: (d) => ({
      title: `⚡ ${d.year}년 십신 변동`,
      hook: `일주 ${d.dayMaster}，${d.year}년 천간 ${d.yearGan}은 "${d.yearTenGod}". 유료 리포트: 어떤 영향?`,
    }),
  },

  combine_opportunity: {
    zh: (d) => ({
      title: `✨ ${d.year}年有合`,
      hook: `你的日主${d.dayMaster}，${d.year}年${d.yearZhi}与原局有合——合代表缘分、合作、机会。但合也有"合住""合化"之分，合错了反而被捆住。免费版只显示有合，付费版告诉你：这个合是贵人相助还是纠缠不清？哪个月机会最大？怎么抓住？`,
    }),
    en: (d) => ({
      title: `✨ Combination Opportunity ${d.year}`,
      hook: `Your Day Master ${d.dayMaster}, and ${d.year} ${d.yearZhi} combines with your natal chart — combination means connections, partnerships, opportunities. But combinations can also trap you. Free chart only shows it exists. Paid report: Is this a helpful connection or entanglement? Which month is best? How to seize it?`,
    }),
    id: (d) => ({
      title: `✨ Peluang Gabungan ${d.year}`,
      hook: `Day Master ${d.dayMaster}，tahun ${d.year} ${d.yearZhi} bergabung dengan natal. Laporan berbayar: Ini membantu atau menjebak?`,
    }),
    th: (d) => ({
      title: `✨ โอกาสรวม ${d.year}`,
      hook: `เจ้าชะตา ${d.dayMaster}，ปี ${d.year} ${d.yearZhi} รวมกับตารางเกิด. รายงานแบบจ่าย: ช่วยหรือดัก?`,
    }),
    vi: (d) => ({
      title: `✨ Cơ hội hợp ${d.year}`,
      hook: `Nhật Chủ ${d.dayMaster}，năm ${d.year} ${d.yearZhi} hợp với gốc. Báo cáo: Hợp tốt hay hợp rườm rà?`,
    }),
    ms: (d) => ({
      title: `✨ Peluang Gabungan ${d.year}`,
      hook: `Day Master ${d.dayMaster}，tahun ${d.year} ${d.yearZhi} bergabung. Laporan: Membantu atau memerangkap?`,
    }),
    ja: (d) => ({
      title: `✨ ${d.year}年 合の機会`,
      hook: `日主${d.dayMaster}、${d.year}年${d.yearZhi}が原局と合——合は縁とチャンス。でも合にも良し悪し。有料レポート：この合は貴人か絡み合いか？`,
    }),
    ko: (d) => ({
      title: `✨ ${d.year}년 합의 기회`,
      hook: `일주 ${d.dayMaster}，${d.year}년 ${d.yearZhi}가 원국과 합. 합은 인연과 기회. 유료 리포트: 귀인인가 얽힘인가?`,
    }),
  },

  xunkong_alert: {
    zh: (d) => ({
      title: `🕳️ 空亡预警`,
      hook: `你的日柱空亡在${d.xunKong}。空亡代表"落空、虚无、有等于无"——如果关键宫位落空，那方面的事往往竹篮打水。免费版只标空亡，付费版告诉你：空亡落在哪个宫位？影响什么？怎么填实？`,
    }),
    en: (d) => ({
      title: `🕳️ Void (Xun Kong) Alert`,
      hook: `Your Day Pillar void is ${d.xunKong}. Void means "emptiness, things falling through" — if a key palace is void, that area of life often disappoints. Free chart only marks it. Paid report: Which palace is void? What does it affect? How to fill it?`,
    }),
    id: (d) => ({
      title: `🕳️ Peringatan Xun Kong`,
      hook: `Xun Kong Anda di ${d.xunKong}. Berarti kosong, hal gagal. Laporan berbayar: Istana mana yang kosong? Bagaimana mengisi?`,
    }),
    th: (d) => ({
      title: `🕳️ เตือนว่าง (Xun Kong)`,
      hook: `Xun Kong ของคุณ ${d.xunKong}. หมายถึงความว่างเปล่า. รายงานแบบจ่าย: พระราชวังไหนว่าง?`,
    }),
    vi: (d) => ({
      title: `🕳️ Cảnh báo Không Vong`,
      hook: `Không Vong của bạn ${d.xunKong}. Nghĩa là trống rỗng, việc làm cát cước. Báo cáo: Cung nào trống?`,
    }),
    ms: (d) => ({
      title: `🕳️ Amaran Xun Kong`,
      hook: `Xun Kong Anda ${d.xunKong}. Bererti kosong, perkara gagal. Laporan: Istana mana kosong?`,
    }),
    ja: (d) => ({
      title: `🕳️ 空亡警告`,
      hook: `日柱の空亡は${d.xunKong}。空亡は「空しい、水泡に帰す」。有料レポート：どの宮が空亡？どう埋める？`,
    }),
    ko: (d) => ({
      title: `🕳️ 공망 경고`,
      hook: `일주 공망 ${d.xunKong}. 공망은 '허무, 수포로 돌아감'. 유료 리포트: 어느 궁이 공망? 어떻게 채우나?`,
    }),
  },

  shensha_trigger: {
    zh: (d) => ({
      title: `🌟 ${d.year}年神煞触发`,
      hook: `你的日主${d.dayMaster}，${d.year}年流年带"${d.shenSha}"。${d.shenSha === "桃花" ? "桃花动，感情有变化——是正缘还是烂桃花？" : d.shenSha === "驿马" ? "驿马动，有出差、搬家、旅行的机会——动中求财还是动中破财？" : d.shenSha === "华盖" ? "华盖动，适合学习、修行、独处——但也容易孤独" : "天乙贵人动，有人帮你——是谁？什么时候出现？"}。免费版只列神煞，付费版告诉你具体怎么用。`,
    }),
    en: (d) => ({
      title: `🌟 Shen Sha Trigger ${d.year}`,
      hook: `Your Day Master ${d.dayMaster}, and ${d.year} brings "${d.shenSha}". ${d.shenSha === "桃花" ? "Peach Blossom moves — relationship changes. Real love or bad romance?" : d.shenSha === "驿马" ? "Traveling Horse moves — trips, relocations. Gain or loss on the move?" : d.shenSha === "华盖" ? "Canopy moves — good for study and solitude, but can bring loneliness" : "Noble Person moves — someone helps you. Who? When?"}. Free chart only lists it. Paid report tells you how to use it.`,
    }),
    id: (d) => ({
      title: `🌟 Shen Sha Aktif ${d.year}`,
      hook: `Day Master ${d.dayMaster}，tahun ${d.year} membawa "${d.shenSha}". Laporan berbayar: Bagaimana menggunakannya?`,
    }),
    th: (d) => ({
      title: `🌟 เสินซ่าเริ่ม ${d.year}`,
      hook: `เจ้าชะตา ${d.dayMaster}，ปี ${d.year} มี "${d.shenSha}". รายงานแบบจ่าย: ใช้อย่างไร?`,
    }),
    vi: (d) => ({
      title: `🌟 Thần Sát ${d.year}`,
      hook: `Nhật Chủ ${d.dayMaster}，năm ${d.year} có "${d.shenSha}". Báo cáo: Dùng sao?`,
    }),
    ms: (d) => ({
      title: `🌟 Shen Sha Aktif ${d.year}`,
      hook: `Day Master ${d.dayMaster}，tahun ${d.year} ada "${d.shenSha}". Laporan: Bagaimana guna?`,
    }),
    ja: (d) => ({
      title: `🌟 ${d.year}年 神煞発動`,
      hook: `日主${d.dayMaster}、${d.year}年は「${d.shenSha}」が発動。有料レポート：どう使う？`,
    }),
    ko: (d) => ({
      title: `🌟 ${d.year}년 신살 발동`,
      hook: `일주 ${d.dayMaster}，${d.year}년에 "${d.shenSha}" 발동. 유료 리포트: 어떻게 활용?`,
    }),
  },
};

function formatHook(scenario, lang) {
  const template = HOOK_TEMPLATES[scenario.type];
  const langTemplate = template?.[lang] || template?.en || template?.zh;
  if (!langTemplate) return getDefaultHook(lang);

  const { title, hook } = langTemplate(scenario.data);
  return {
    type: scenario.type,
    urgency: scenario.urgency,
    title,
    hookText: hook,
    ctaProduct: scenario.urgency >= 4 ? "fortune" : "single",
  };
}

function getDefaultHook(lang) {
  const defaults = {
    zh: {
      title: "🔮 你的命盘藏着什么？",
      hookText: "免费排盘只显示天干地支和大运流年——但这些符号背后的含义，才是真正决定你今年财运、感情、事业的关键。AI深度解读会用大白话告诉你：你是什么格局？今年该注意什么？怎么做才能顺？",
      ctaProduct: "single",
    },
    en: {
      title: "🔮 What Does Your Chart Reveal?",
      hookText: "Your free chart shows stems, branches and luck cycles — but the meaning behind these symbols is what truly determines your wealth, relationships and career this year. AI Deep Reading explains in plain language: What's your pattern? What to watch for? How to make this year smoother?",
      ctaProduct: "single",
    },
    id: {
      title: "🔮 Apa yang tersembunyi dalam bagan Anda?",
      hookText: "Bagan gratis hanya menunjukkan batang, cabang dan siklus keberuntungan. Tapi makna di balik simbol inilah yang menentukan keuangan, cinta, karier Anda. Bacaan AI menjelaskan dengan bahasa sederhana.",
      ctaProduct: "single",
    },
    th: {
      title: "🔮 ตารางของคุณซ่อนอะไรอยู่?",
      hookText: "ตารางฟรีแสดงก้าน แขนง และวัฏจักรดวง แต่ความหมายเบื้องหลังคือสิ่งที่กำหนดการเงิน ความรัก อาชีพของคุณ. AI อธิบายแบบเข้าใจง่าย.",
      ctaProduct: "single",
    },
    vi: {
      title: "🔮 Bàn cờ của bạn ẩn chứa gì?",
      hookText: "Bàn miễn phí chỉ hiện can, chi và đại vận. Nhưng ý nghĩa đằng mới là thứ quyết định tài lộc, tình duyên, sự nghiệp. AI giải thích bằng ngôn ngữ đơn giản.",
      ctaProduct: "single",
    },
    ms: {
      title: "🔮 Apa yang tersembunyi dalam carta anda?",
      hookText: "Carta percuma hanya menunjukkan batang, cabang dan kitaran. Tapi makna di belakang simbol inilah yang menentukan kewangan, cinta, kerjaya. AI terangkan dengan bahasa mudah.",
      ctaProduct: "single",
    },
    ja: {
      title: "🔮 あなたの命盤が隠しているもの",
      hookText: "無料の排盤は天干地支と大運流年を表示するだけ。でもその記号の奥にある意味こそが、今年の金運・恋愛・仕事を決める。AIが平易な言葉で解説します。",
      ctaProduct: "single",
    },
    ko: {
      title: "🔮 당신의 명판이 숨긴 것",
      hookText: "무료 배판은 천간지지와 대운만 보여줌. 하지만 기호 뒤의 의미가 올해 재물, 연애, 사업을 결정. AI가 쉬운 말로 설명.",
      ctaProduct: "single",
    },
  };
  return { type: "default", urgency: 0, ...(defaults[lang] || defaults.en) };
}
