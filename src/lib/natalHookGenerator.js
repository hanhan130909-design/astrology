/**
 * 占星本命盘钩子生成器
 * 基于星盘相位和行星位置动态生成焦虑型转化话术
 * 8种场景：T-square/大十字 / 土星压力 / 冥王星转型 / 天王星突变 / 海王星迷茫 / 逆行 / 8宫重点 / 默认
 */

const PLANET_NAMES = {
  Sun: { zh: "太阳", en: "Sun", id: "Matahari", th: "สุริยะ", vi: "Mặt Trời", ms: "Matahari", ja: "太陽", ko: "태양" },
  Moon: { zh: "月亮", en: "Moon", id: "Bulan", th: "จันทรา", vi: "Mặt Trăng", ms: "Bulan", ja: "月", ko: "달" },
  Mercury: { zh: "水星", en: "Mercury", id: "Merkurius", th: "พุธ", vi: "Sao Thủy", ms: "Merkuri", ja: "水星", ko: "수성" },
  Venus: { zh: "金星", en: "Venus", id: "Venus", th: "ศุกร์", vi: "Sao Kim", ms: "Zuhrah", ja: "金星", ko: "금성" },
  Mars: { zh: "火星", en: "Mars", id: "Mars", th: "อังคาร", vi: "Sao Hỏa", ms: "Marikh", ja: "火星", ko: "화성" },
  Jupiter: { zh: "木星", en: "Jupiter", id: "Jupiter", th: "พฤหัส", vi: "Sao Mộc", ms: "Musytari", ja: "木星", ko: "목성" },
  Saturn: { zh: "土星", en: "Saturn", id: "Saturnus", th: "เสาร์", vi: "Sao Thổ", ms: "Zuhal", ja: "土星", ko: "토성" },
  Uranus: { zh: "天王星", en: "Uranus", id: "Uranus", th: "ยูเรนัส", vi: "Sao Thiên Vương", ms: "Uranus", ja: "天王星", ko: "천왕성" },
  Neptune: { zh: "海王星", en: "Neptune", id: "Neptunus", th: "เนปจูน", vi: "Sao Hải Vương", ms: "Neptun", ja: "海王星", ko: "해왕성" },
  Pluto: { zh: "冥王星", en: "Pluto", id: "Pluto", th: "พลูโต", vi: "Sao Diêm Vương", ms: "Pluto", ja: "冥王星", ko: "명왕성" },
};

const SIGN_NAMES = {
  Aries: { zh: "白羊座", en: "Aries", id: "Aries", th: "เมษ", vi: "Bạch Dương", ms: "Aries", ja: "牡羊座", ko: "양자리" },
  Taurus: { zh: "金牛座", en: "Taurus", id: "Taurus", th: "พฤษภ", vi: "Kim Ngưu", ms: "Taurus", ja: "牡牛座", ko: "황소자리" },
  Gemini: { zh: "双子座", en: "Gemini", id: "Gemini", th: "เมถุน", vi: "Song Tử", ms: "Gemini", ja: "双子座", ko: "쌍둥이자리" },
  Cancer: { zh: "巨蟹座", en: "Cancer", id: "Cancer", th: "กรกฎ", vi: "Cự Giải", ms: "Cancer", ja: "蟹座", ko: "게자리" },
  Leo: { zh: "狮子座", en: "Leo", id: "Leo", th: "สิงห์", vi: "Sư Tử", ms: "Leo", ja: "獅子座", ko: "사자자리" },
  Virgo: { zh: "处女座", en: "Virgo", id: "Virgo", th: "กันย์", vi: "Xử Nữ", ms: "Virgo", ja: "乙女座", ko: "처녀자리" },
  Libra: { zh: "天秤座", en: "Libra", id: "Libra", th: "ตุลย์", vi: "Thiên Bình", ms: "Libra", ja: "天秤座", ko: "천칭자리" },
  Scorpio: { zh: "天蝎座", en: "Scorpio", id: "Scorpio", th: "พิจิก", vi: "Bọ Cạp", ms: "Scorpio", ja: "蠍座", ko: "전갈자리" },
  Sagittarius: { zh: "射手座", en: "Sagittarius", id: "Sagittarius", th: "ธนู", vi: "Nhân Mã", ms: "Sagittarius", ja: "射手座", ko: "사수자리" },
  Capricorn: { zh: "摩羯座", en: "Capricorn", id: "Capricorn", th: "มังกร", vi: "Ma Kết", ms: "Capricorn", ja: "山羊座", ko: "염소자리" },
  Aquarius: { zh: "水瓶座", en: "Aquarius", id: "Aquarius", th: "กุมภ์", vi: "Bảo Bình", ms: "Aquarius", ja: "水瓶座", ko: "물병자리" },
  Pisces: { zh: "双鱼座", en: "Pisces", id: "Pisces", th: "มีน", vi: "Song Ngư", ms: "Pisces", ja: "魚座", ko: "물고기자리" },
};

const PERSONAL_PLANETS = ["Sun", "Moon", "Venus", "Mars"];
const HARD_ASPECTS = ["Square", "Opposition", "Conjunction"];

function pname(planetId, lang) {
  return PLANET_NAMES[planetId]?.[lang] || PLANET_NAMES[planetId]?.en || planetId;
}

function sname(signId, lang) {
  return SIGN_NAMES[signId]?.[lang] || SIGN_NAMES[signId]?.en || signId;
}

function hasAspect(aspects, p1, p2, types) {
  return aspects.find(a =>
    ((a.planet1 === p1 && a.planet2 === p2) || (a.planet1 === p2 && a.planet2 === p1)) &&
    types.includes(a.type)
  );
}

function getHardAspectsToPlanet(aspects, planetId) {
  return aspects.filter(a =>
    (a.planet1 === planetId || a.planet2 === planetId) &&
    HARD_ASPECTS.includes(a.type)
  );
}

/**
 * 生成占星钩子
 * @param {Object} chart - chart.data 对象 { planets, aspects, houses, ascendant }
 * @param {string} lang
 */
export function generateNatalHook(chart, lang = "zh") {
  if (!chart || !chart.planets || !chart.aspects) {
    return getDefaultHook(lang);
  }

  const { planets, aspects } = chart;
  const scenarios = [];

  // ─── 场景1：T-square / 多重紧张相位 ───
  const hardAspectCount = aspects.filter(a => HARD_ASPECTS.includes(a.type)).length;
  if (hardAspectCount >= 5) {
    scenarios.push({
      type: "tension_pattern",
      urgency: 5,
      data: { count: hardAspectCount },
    });
  }

  // ─── 场景2：土星刑冲个人行星 ───
  const saturnHardAspects = PERSONAL_PLANETS
    .map(p => hasAspect(aspects, "Saturn", p, ["Square", "Opposition"]))
    .filter(Boolean);
  if (saturnHardAspects.length >= 1) {
    const targetPlanet = saturnHardAspects[0].planet1 === "Saturn" ? saturnHardAspects[0].planet2 : saturnHardAspects[0].planet1;
    scenarios.push({
      type: "saturn_pressure",
      urgency: 4,
      data: { targetPlanet, aspect: saturnHardAspects[0].type, sign: planets[targetPlanet]?.sign },
    });
  }

  // ─── 场景3：冥王星刑冲个人行星 ───
  const plutoHardAspects = PERSONAL_PLANETS
    .map(p => hasAspect(aspects, "Pluto", p, ["Square", "Opposition", "Conjunction"]))
    .filter(Boolean);
  if (plutoHardAspects.length >= 1) {
    const targetPlanet = plutoHardAspects[0].planet1 === "Pluto" ? plutoHardAspects[0].planet2 : plutoHardAspects[0].planet1;
    scenarios.push({
      type: "pluto_transformation",
      urgency: 4,
      data: { targetPlanet, sign: planets[targetPlanet]?.sign },
    });
  }

  // ─── 场景4：天王星刑冲个人行星 ───
  const uranusHardAspects = PERSONAL_PLANETS
    .map(p => hasAspect(aspects, "Uranus", p, ["Square", "Opposition"]))
    .filter(Boolean);
  if (uranusHardAspects.length >= 1) {
    const targetPlanet = uranusHardAspects[0].planet1 === "Uranus" ? uranusHardAspects[0].planet2 : uranusHardAspects[0].planet1;
    scenarios.push({
      type: "uranus_upheaval",
      urgency: 3,
      data: { targetPlanet, sign: planets[targetPlanet]?.sign },
    });
  }

  // ─── 场景5：海王星刑冲个人行星 ───
  const neptuneHardAspects = PERSONAL_PLANETS
    .map(p => hasAspect(aspects, "Neptune", p, ["Square", "Opposition"]))
    .filter(Boolean);
  if (neptuneHardAspects.length >= 1) {
    const targetPlanet = neptuneHardAspects[0].planet1 === "Neptune" ? neptuneHardAspects[0].planet2 : neptuneHardAspects[0].planet1;
    scenarios.push({
      type: "neptune_confusion",
      urgency: 3,
      data: { targetPlanet, sign: planets[targetPlanet]?.sign },
    });
  }

  // ─── 场景6：个人行星逆行 ───
  const retrogradePersonal = ["Mercury", "Venus", "Mars"].filter(p => planets[p]?.retrograde);
  if (retrogradePersonal.length >= 1) {
    scenarios.push({
      type: "retrograde",
      urgency: 2,
      data: { planet: retrogradePersonal[0], sign: planets[retrogradePersonal[0]]?.sign },
    });
  }

  // ─── 场景7：第8宫行星聚集（需要 houses 数据）───
  if (chart.houses && Array.isArray(chart.houses) && chart.houses.length >= 8) {
    const house8 = chart.houses[7]; // 0-indexed, 第8宫
    const house8Start = house8?.longitude || house8?.cusp || 0;
    const house9Start = chart.houses[8]?.longitude || chart.houses[8]?.cusp || (house8Start + 30);
    const planetsIn8 = Object.values(planets).filter((p) => {
      if (!p?.longitude) return false;
      const lon = p.longitude;
      if (house8Start < house9Start) return lon >= house8Start && lon < house9Start;
      return lon >= house8Start || lon < house9Start; // 跨越0度
    });
    if (planetsIn8.length >= 2) {
      scenarios.push({
        type: "eighth_house",
        urgency: 2,
        data: { count: planetsIn8.length },
      });
    }
  }

  // 按紧急度排序
  scenarios.sort((a, b) => b.urgency - a.urgency);
  const top = scenarios[0];

  if (top) {
    return formatNatalHook(top, lang, planets);
  }

  return getDefaultHook(lang);
}

// ─── 话术模板 ───
const NATAL_TEMPLATES = {
  tension_pattern: {
    zh: (d) => ({
      title: "⚡ 你的星盘有高强度紧张格局",
      hook: `你的本命盘有 ${d.count} 个硬相位（刑/冲/合），这意味着你天生就活在"压力-突破"的循环里。别人觉得你折腾，其实是你的星盘在逼你成长。免费星盘只画出这些线，付费解读会告诉你：这些紧张能量具体卡在哪个领域？怎么把压力变成动力？哪些年份是爆发期？`,
    }),
    en: (d) => ({
      title: "⚡ Your Chart Has Intense T-Square Energy",
      hook: `Your natal chart has ${d.count} hard aspects (squares/oppositions/conjunctions) — you were born into a "pressure-breakthrough" cycle. Others think you're restless, but your chart forces growth. Free chart only draws the lines. Paid reading reveals: Where exactly is this tension stuck? How to channel pressure into power? Which years are breakout periods?`,
    }),
    id: (d) => ({
      title: "⚡ Bintang Anda Punya Pola Tegangan Tinggi",
      hook: `Bagan natal Anda punya ${d.count} aspek keras. Anda lahir dalam siklus "tekanan-terobosan". Versi gratis hanya gambar garis. Laporan berbayar: Di mana tegangan ini terjebak? Bagaimana mengubah tekanan jadi kekuatan?`,
    }),
    th: (d) => ({
      title: "⚡ ตารางดาวของคุณมีแรงตึงสูง",
      hook: `ตารางเกิดของคุณมี ${d.count} แง่ง hard. คุณเกิดมาพร้อมวัฏจักร "ความกดดัน-การพุ่ง". เวอร์ชันฟรีวาดเส้นให้ดู. รายงานแบบจ่าย: ตึงตรงไหน? เปลี่ยนแรงกดดันเป็นพลังได้อย่างไร?`,
    }),
    vi: (d) => ({
      title: "⚡ Sao của bạn có cấu trúc căng thẳng cao",
      hook: `Bản đồ sao của bạn có ${d.count} hard aspect. Bạn sinh ra trong chu kỳ "áp lực-bứt phá". Bản miễn phí chỉ vẽ đường. Báo cáo trả lời: Căng thẳng ở đâu? Làm sao biến áp lực thành sức mạnh?`,
    }),
    ms: (d) => ({
      title: "⚡ Carta Anda Ada Corak Ketegangan Tinggi",
      hook: `Carta natal anda ada ${d.count} aspek keras. Anda lahir dalam kitaran "tekanan-terobosan". Versi percuma lukis garis sahaja. Laporan: Di mana ketegangan ini? Bagaimana tukar tekanan kepada kuasa?`,
    }),
    ja: (d) => ({
      title: "⚡ あなたの星盤は高張力パターン",
      hook: `あなたの出生盤には${d.count}個のハードアスペクトがあります。あなたは「プレッシャー→突破」のサイクルに生まれた。無料版は線を描くだけ。有料リーディング：どの分野に詰まっている？プレッシャーを力に変えるには？`,
    }),
    ko: (d) => ({
      title: "⚡ 당신의 차트는 고강도 긴장 패턴",
      hook: `당신의 출생차트에는 ${d.count}개의 하드 어스펙트가 있습니다. 당신은 '압력-돌파'의 순환 속에 태어났습니다. 무료 버전은 선만 그려줌. 유료 리딩: 어느 분야에 갇혀있나? 압력을 힘으로 바꾸는 법?`,
    }),
  },

  saturn_pressure: {
    zh: (d, planets) => ({
      title: "⏳ 土星正在压制你的" + pname(d.targetPlanet, "zh"),
      hook: `你的${pname(d.targetPlanet, "zh")}（${sname(d.sign, "zh")}）被土星刑冲——这是你星盘里最"沉"的配置。土星代表限制、责任、延迟。免费星盘只标出土星相位，付费解读告诉你：这个压力具体影响什么？什么时候会结束？怎么把土星的考验变成你最硬的资本？`,
    }),
    en: (d, planets) => ({
      title: "⏳ Saturn Is Pressing Your " + pname(d.targetPlanet, "en"),
      hook: `Your ${pname(d.targetPlanet, "en")} (in ${sname(d.sign, "en")}) is squared/opposed by Saturn — the heaviest placement in your chart. Saturn means limits, responsibility, delay. Free chart only marks the aspect. Paid reading: What exactly does this pressure affect? When will it lift? How to turn Saturn's test into your strongest asset?`,
    }),
    id: (d) => ({
      title: "⏳ Saturnus Menekan " + pname(d.targetPlanet, "id"),
      hook: `${pname(d.targetPlanet, "id")} Anda (${sname(d.sign, "id")}) ditekan Saturnus. Ini konfigurasi terberat. Versi gratis hanya tandai aspek. Laporan berbayar: Apa yang dipengaruhi? Kapan berakhir?`,
    }),
    th: (d) => ({
      title: "⏳ เสาร์กดดัน " + pname(d.targetPlanet, "th"),
      hook: `${pname(d.targetPlanet, "th")} ของคุณ (${sname(d.sign, "th")}) ถูกเสาร์กด. นี่คือจุดที่หนักที่สุด. เวอร์ชันฟรีแค่ทำเครื่องหมาย. รายงาน: อะไรได้รับผลกระทบ? เมื่อไหร่จะจบ?`,
    }),
    vi: (d) => ({
      title: "⏳ Thổ tinh đang gây áp lực " + pname(d.targetPlanet, "vi"),
      hook: `${pname(d.targetPlanet, "vi")} của bạn (${sname(d.sign, "vi")}) bị Thổ tinh hình xung/khác. Đây là cấu trúc nặng nhất. Bản miễn phí chỉ đánh dấu. Báo cáo: Ảnh hưởng gì? Khi nào kết thúc?`,
    }),
    ms: (d) => ({
      title: "⏳ Zuhal Menekan " + pname(d.targetPlanet, "ms"),
      hook: `${pname(d.targetPlanet, "ms")} Anda (${sname(d.sign, "ms")}) ditekan Zuhal. Ini penempatan terberat. Versi percuma tandai aspek sahaja. Laporan: Apa yang terjejas? Bila ia berakhir?`,
    }),
    ja: (d) => ({
      title: "⏳ 土星があなたの" + pname(d.targetPlanet, "ja") + "を圧迫",
      hook: `あなたの${pname(d.targetPlanet, "ja")}（${sname(d.sign, "ja")}）は土星からスクエア/オポジションを受けています。これが最も重い配置。無料版はアスペクトを示すだけ。有料リーディング：具体的に何に影響？いつ終わる？`,
    }),
    ko: (d) => ({
      title: "⏳ 토성이 당신의 " + pname(d.targetPlanet, "ko") + "을 압박",
      hook: `당신의 ${pname(d.targetPlanet, "ko")}(${sname(d.sign, "ko")})이 토성과 광대/반대. 이것이 가장 무거운 배치. 무료 버전은 어스펙트만 표시. 유료 리딩: 구체적으로 무엇에 영향? 언제 끝나나?`,
    }),
  },

  pluto_transformation: {
    zh: (d) => ({
      title: "🔥 冥王星在摧毁并重建你的" + pname(d.targetPlanet, "zh"),
      hook: `你的${pname(d.targetPlanet, "zh")}（${sname(d.sign, "zh")}）与冥王星有硬相位——冥王星不做小修小补，它直接摧毁再重建。你人生中一定有过"一切归零、重新开始"的经历。免费星盘只看到相位，付费解读告诉你：下一次重生在什么时候？怎么主动引导而不是被动挨打？`,
    }),
    en: (d) => ({
      title: "🔥 Pluto Is Destroying & Rebuilding Your " + pname(d.targetPlanet, "en"),
      hook: `Your ${pname(d.targetPlanet, "en")} (in ${sname(d.sign, "en")}) has a hard aspect to Pluto — Pluto doesn't do small fixes, it destroys and rebuilds. You've definitely had "back to zero, start over" moments. Free chart only shows the aspect. Paid reading: When is your next rebirth? How to guide it instead of being crushed?`,
    }),
    id: (d) => ({
      title: "🔥 Pluto Menghancurkan & Membangun Ulang " + pname(d.targetPlanet, "id"),
      hook: `${pname(d.targetPlanet, "id")} Anda (${sname(d.sign, "id")}) beraspek keras dengan Pluto. Pluto menghancurkan lalu membangun ulang. Laporan berbayar: Kapan kelahiran kembali berikutnya?`,
    }),
    th: (d) => ({
      title: "🔥 พลูโto่ทำลาย & สร้างใหม่ " + pname(d.targetPlanet, "th"),
      hook: `${pname(d.targetPlanet, "th")} ของคุณ (${sname(d.sign, "th")}) มี hard aspect กับ Pluto. Pluto ทำลายแล้วสร้างใหม่. รายงาน: ครั้งต่อไปเมื่อไหร่?`,
    }),
    vi: (d) => ({
      title: "🔥 Diêm Vương tinh phá hủy & tái tạo " + pname(d.targetPlanet, "vi"),
      hook: `${pname(d.targetPlanet, "vi")} của bạn (${sname(d.sign, "vi")}) có hard aspect với Diêm Vương. Pluto phá hủy rồi xây lại. Báo cáo: Lần tái sinh tới khi nào?`,
    }),
    ms: (d) => ({
      title: "🔥 Pluto Memusnah & Membina Semula " + pname(d.targetPlanet, "ms"),
      hook: `${pname(d.targetPlanet, "ms")} Anda (${sname(d.sign, "ms")}) ada aspek keras dengan Pluto. Pluto musnahkan lalu bina semula. Laporan: Bila kelahiran semula seterusnya?`,
    }),
    ja: (d) => ({
      title: "🔥 冥王星があなたの" + pname(d.targetPlanet, "ja") + "を破壊し再構築",
      hook: `あなたの${pname(d.targetPlanet, "ja")}（${sname(d.sign, "ja")}）は冥王星とハードアスペクト。冥王星は小修復ではなく、破壊と再生。あなたには「ゼロからやり直し」の経験があるはず。有料リーディング：次の再生はいつ？`,
    }),
    ko: (d) => ({
      title: "🔥 명왕성이 당신의 " + pname(d.targetPlanet, "ko") + "을 파괴하고 재건",
      hook: `당신의 ${pname(d.targetPlanet, "ko")}(${sname(d.sign, "ko")})이 명왕성과 하드 어스펙트. 명왕성은 작은 수선이 아니라 파괴 후 재건. 당신에겐 '제로부터 시작'의 경험이 있음. 유료 리딩: 다음 재생은 언제?`,
    }),
  },

  uranus_upheaval: {
    zh: (d) => ({
      title: "⚡ 天王星随时可能颠覆你的" + pname(d.targetPlanet, "zh"),
      hook: `你的${pname(d.targetPlanet, "zh")}（${sname(d.sign, "zh")}）被天王星刑冲——天王星代表突变、断裂、自由。你的人生总是在"以为稳定了"的时候突然变天。免费星盘只画出这条线，付费解读告诉你：突变最可能发生在哪个领域？怎么提前准备而不是被打个措手不及？`,
    }),
    en: (d) => ({
      title: "⚡ Uranus Can Suddenly Disrupt Your " + pname(d.targetPlanet, "en"),
      hook: `Your ${pname(d.targetPlanet, "en")} (in ${sname(d.sign, "en")}) is squared/opposed by Uranus — sudden breaks, freedom, upheaval. Your life always shifts right when you think it's stable. Free chart only draws the line. Paid reading: Which area is most likely to flip? How to prepare instead of being caught off guard?`,
    }),
    id: (d) => ({
      title: "⚡ Uranus Bisa Mengganggu " + pname(d.targetPlanet, "id") + " Secara Tiba-tiba",
      hook: `${pname(d.targetPlanet, "id")} Anda (${sname(d.sign, "id")}) diserang Uranus. Perubahan mendadak. Laporan berbayar: Bidang mana yang paling mungkin berubah? Bagaimana bersiap?`,
    }),
    th: (d) => ({
      title: "⚡ ยูเรนัสอาจทำลาย " + pname(d.targetPlanet, "th") + " อย่างกะทันหัน",
      hook: `${pname(d.targetPlanet, "th")} ของคุณ (${sname(d.sign, "th")}) ถูกยูเรนัสกด. การเปลี่ยนแปลงกะทันหัน. รายงาน: ด้านไหนมีแนวโน้มเปลี่ยน? เตรียมอย่างไร?`,
    }),
    vi: (d) => ({
      title: "⚡ Thiên Vương tinh có thể đảo lộn " + pname(d.targetPlanet, "vi"),
      hook: `${pname(d.targetPlanet, "vi")} của bạn (${sname(d.sign, "vi")}) bị Thiên Vương hình xung. Biến đổi đột ngột. Báo cáo: Lĩnh vực nào dễ thay đổi? Làm sao chuẩn bị?`,
    }),
    ms: (d) => ({
      title: "⚡ Uranus Boleh Ganggu " + pname(d.targetPlanet, "ms") + " Secara Tiba-tiba",
      hook: `${pname(d.targetPlanet, "ms")} Anda (${sname(d.sign, "ms")}) ditekan Uranus. Perubahan mendadak. Laporan: Bidang mana mungkin berubah? Bagaimana bersedia?`,
    }),
    ja: (d) => ({
      title: "⚡ 天王星があなたの" + pname(d.targetPlanet, "ja") + "を突然崩壊させる",
      hook: `あなたの${pname(d.targetPlanet, "ja")}（${sname(d.sign, "ja")}）は天王星とスクエア/オポジション。突然の変化、断絶、自由。「安定した」と思った瞬間に人生が変わる。有料リーディング：どの分野で突変が？備えるには？`,
    }),
    ko: (d) => ({
      title: "⚡ 천왕성이 당신의 " + pname(d.targetPlanet, "ko") + "을 갑자기 뒤흔듦",
      hook: `당신의 ${pname(d.targetPlanet, "ko")}(${sname(d.sign, "ko")})이 천왕성과 광대/반대. 갑작스러운 변화, 단절, 자유. '안정됐다' 싶을 때 인생이 바뀜. 유료 리딩: 어느 분야가 가장 뒤집히나? 어떻게 준비?`,
    }),
  },

  neptune_confusion: {
    zh: (d) => ({
      title: "🌫️ 海王星让你的" + pname(d.targetPlanet, "zh") + "笼罩迷雾",
      hook: `你的${pname(d.targetPlanet, "zh")}（${sname(d.sign, "zh")}）被海王星刑冲——海王星代表迷茫、幻想、欺骗、也代表灵感。你在这个领域总是看不清楚，容易理想化然后失望。免费星盘只标相位，付费解读告诉你：迷雾具体藏着什么？怎么区分直觉和妄想？什么时候会看清？`,
    }),
    en: (d) => ({
      title: "🌫️ Neptune Shrouds Your " + pname(d.targetPlanet, "en") + " in Mist",
      hook: `Your ${pname(d.targetPlanet, "en")} (in ${sname(d.sign, "en")}) is squared/opposed by Neptune — confusion, illusion, deception, but also inspiration. You can never see clearly in this area, often idealizing then getting disappointed. Free chart only marks the aspect. Paid reading: What's hidden in the mist? How to tell intuition from delusion? When will clarity come?`,
    }),
    id: (d) => ({
      title: "🌫️ Neptune Menyelimuti " + pname(d.targetPlanet, "id") + " dengan Kabut",
      hook: `${pname(d.targetPlanet, "id")} Anda (${sname(d.sign, "id")}) diselimuti Neptune. Kebingungan, ilusi. Laporan berbayar: Apa yang disembunyikan? Bagaimana membedakan intuisi dan khayalan?`,
    }),
    th: (d) => ({
      title: "🌫️ เนปจูนคลุม " + pname(d.targetPlanet, "th") + " ด้วยหมอก",
      hook: `${pname(d.targetPlanet, "th")} ของคุณ (${sname(d.sign, "th")}) ถูกเนปจูนกด. ความสับสน, ภาพลวง. รายงาน: อะไรซ่อนอยู่? แยกสัญชาตญาณกับความคิดหลอกได้อย่างไร?`,
    }),
    vi: (d) => ({
      title: "🌫️ Hải Vương tinh che " + pname(d.targetPlanet, "vi") + " trong sương mù",
      hook: `${pname(d.targetPlanet, "vi")} của bạn (${sname(d.sign, "vi")}) bị Hải Vương hình xung. Mơ hồ, ảo tưởng. Báo cáo: Có gì ẩn trong sương? Phân biệt trực giác và ảo tưởng sao?`,
    }),
    ms: (d) => ({
      title: "🌫️ Neptune Selimuti " + pname(d.targetPlanet, "ms") + " dengan Kabus",
      hook: `${pname(d.targetPlanet, "ms")} Anda (${sname(d.sign, "ms")}) diselimuti Neptune. Keliru, ilusi. Laporan: Apa yang tersembunyi? Bezakan intuisi dan khayalan?`,
    }),
    ja: (d) => ({
      title: "🌫️ 海王星があなたの" + pname(d.targetPlanet, "ja") + "を霧に包む",
      hook: `あなたの${pname(d.targetPlanet, "ja")}（${sname(d.sign, "ja")}）は海王星とスクエア/オポジション。迷い、幻想、欺瞞、そしてインスピレーション。この分野ではいつもはっきり見えない。有料リーディング：霧の奥に何が？直感と妄想の見分け方？`,
    }),
    ko: (d) => ({
      title: "🌫️ 해왕성이 당신의 " + pname(d.targetPlanet, "ko") + "을 안개로 감쌈",
      hook: `당신의 ${pname(d.targetPlanet, "ko")}(${sname(d.sign, "ko")})이 해왕성과 광대/반대. 혼란, 환상, 속임수, 그리고 영감. 이 분야에선 늘 잘 안 보임. 유료 리딩: 안개 속에 뭐가 있나? 직감과 망상 구별법?`,
    }),
  },

  retrograde: {
    zh: (d) => ({
      title: "🔄 你的" + pname(d.planet, "zh") + "是逆行的",
      hook: `你出生时${pname(d.planet, "zh")}在${sname(d.sign, "zh")}逆行——这意味着你在这个领域的运作方式和大多数人相反。别人顺流你逆流，不是你错，是你的内置程序不一样。免费星盘只标个R，付费解读告诉你：逆行怎么影响你的思维/感情/行动？怎么把"反向"变成独特优势？`,
    }),
    en: (d) => ({
      title: "🔄 Your " + pname(d.planet, "en") + " Was Retrograde at Birth",
      hook: `At your birth, ${pname(d.planet, "en")} was retrograde in ${sname(d.sign, "en")} — you operate differently from most people in this area. You go against the flow, and it's not wrong, just different wiring. Free chart only marks an "R". Paid reading: How does retrograde affect your thinking/relationships/actions? How to turn "backward" into unique advantage?`,
    }),
    id: (d) => ({
      title: "🔄 " + pname(d.planet, "id") + " Anda Retrograde Saat Lahir",
      hook: `${pname(d.planet, "id")} Anda retrograde di ${sname(d.sign, "id")} saat lahir. Anda bekerja berlawanan dari orang lain. Laporan berbayar: Bagaimana retrograde memengaruhi Anda? Ubah keuntungan unik?`,
    }),
    th: (d) => ({
      title: "🔄 " + pname(d.planet, "th") + " ของคุณ Retrograde ตอนเกิด",
      hook: `${pname(d.planet, "th")} retrograde ใน ${sname(d.sign, "th")} ตอนคุณเกิด. คุณทำตรงข้ามกับคนส่วนใหญ่. รายงาน: ส่งผลอย่างไร? เปลี่ยนเป็นข้อได้เปรียบ?`,
    }),
    vi: (d) => ({
      title: "🔄 " + pname(d.planet, "vi") + " của bạn nghịch hành khi sinh",
      hook: `${pname(d.planet, "vi")} của bạn nghịch hành ở ${sname(d.sign, "vi")} khi sinh. Bạn vận hành ngược lại đa số. Báo cáo: Nghịch hành ảnh hưởng sao? Biến thành lợi thế riêng?`,
    }),
    ms: (d) => ({
      title: "🔄 " + pname(d.planet, "ms") + " Anda Retrograde Ketika Lahir",
      hook: `${pname(d.planet, "ms")} Anda retrograde di ${sname(d.sign, "ms")} ketika lahir. Anda beroperasi berbeza dari orang lain. Laporan: Bagaimana retrograde mempengaruhi? Tukar kepada kelebihan unik?`,
    }),
    ja: (d) => ({
      title: "🔄 あなたの" + pname(d.planet, "ja") + "は出生時逆行",
      hook: `出生時${pname(d.planet, "ja")}は${sname(d.sign, "ja")}で逆行していました。この分野では大多数と逆の動きをする。間違いではなく、配線が違うだけ。無料版は「R」と記すだけ。有料リーディング：逆行がどう影響する？「逆」を個性的強みにするには？`,
    }),
    ko: (d) => ({
      title: "🔄 당신의 " + pname(d.planet, "ko") + "은 출생시 역행",
      hook: `출생시 ${pname(d.planet, "ko")}이 ${sname(d.sign, "ko")}에서 역행했습니다. 이 분야에서 대다수와 반대로 움직임. 틀린 게 아니라 배선이 다를 뿐. 무료 버전은 'R' 표시만. 유료 리딩: 역행이 어떤 영향? '역방향'을 독특한 강점으로?`,
    }),
  },

  eighth_house: {
    zh: (d) => ({
      title: "🌑 你的第8宫聚集了" + d.count + "颗行星",
      hook: `第8宫是"深度转化、共同资源、亲密关系中的权力博弈"之宫。你有${d.count}颗行星落在这里——你的人生注定和"深度、秘密、重生、他人的钱"紧密相关。免费星盘只列出行星位置，付费解读告诉你：这个配置怎么影响你的亲密关系和财务？怎么避免8宫的陷阱？`,
    }),
    en: (d) => ({
      title: "🌑 Your 8th House Has " + d.count + " Planets Clustered",
      hook: `The 8th house is about deep transformation, shared resources, power dynamics in intimacy. You have ${d.count} planets here — your life is deeply tied to intensity, secrets, rebirth, and other people's money. Free chart only lists positions. Paid reading: How does this affect your relationships and finances? How to avoid 8th house pitfalls?`,
    }),
    id: (d) => ({
      title: "🌑 Rumah ke-8 Anda Ada " + d.count + " Planet Berkumpul",
      hook: `Rumah ke-8 tentang transformasi mendalam, sumber daya bersama. Anda punya ${d.count} planet di sini. Laporan berbayar: Bagaimana memengaruhi hubungan dan keuangan?`,
    }),
    th: (d) => ({
      title: "🌑 บ้านที่ 8 ของคุณมี " + d.count + " ดาวรวมกัน",
      hook: `บ้านที่ 8 เกี่ยวกับการเปลี่ยนแปลงลึก, ทรัพย์สินร่วม. คุณมี ${d.count} ดาวที่นี่. รายงาน: ส่งผลความสัมพันธ์และการเงินอย่างไร?`,
    }),
    vi: (d) => ({
      title: "🌑 Nhà thứ 8 của bạn có " + d.count + " hành tinh tập trung",
      hook: `Nhà 8 về biến đổi sâu, nguồn lực chung. Bạn có ${d.count} hành tinh ở đây. Báo cáo: Ảnh hưởng tình cảm và tài chính sao?`,
    }),
    ms: (d) => ({
      title: "🌑 Rumah ke-8 Anda Ada " + d.count + " Planet Berkumpul",
      hook: `Rumah ke-8 tentang transformasi mendalam, sumber daya bersama. Anda ada ${d.count} planet di sini. Laporan: Bagaimana hubungan dan kewangan terjejas?`,
    }),
    ja: (d) => ({
      title: "🌑 あなたの第8ハウスには" + d.count + "個の惑星が集結",
      hook: `第8ハウスは「深い変容、共有資源、親密さの中の権力闘争」の宮。ここに${d.count}個の惑星がある——あなたの人生は「深さ、秘密、再生、他人の金」と深く結びつく。有料リーディング：人間関係と財務への影響は？第8ハウスの罠を避けるには？`,
    }),
    ko: (d) => ({
      title: "🌑 당신의 8궁에 " + d.count + "개의 행성 집중",
      hook: `8궁은 '깊은 변형, 공유 자원, 친밀함 속 권력 게임'의 궁. 여기 ${d.count}개의 행성이 있음 — 당신의 인생은 '깊이, 비밀, 재생, 타인의 돈'과 깊이 연관. 유료 리딩: 관계와 재정에 어떤 영향? 8궁 함정 피하는 법?`,
    }),
  },
};

function formatNatalHook(scenario, lang, planets) {
  const template = NATAL_TEMPLATES[scenario.type];
  const langTemplate = template?.[lang] || template?.en || template?.zh;
  if (!langTemplate) return getDefaultHook(lang);

  const { title, hook } = langTemplate(scenario.data, planets);
  return {
    type: scenario.type,
    urgency: scenario.urgency,
    title,
    hookText: hook,
    ctaProduct: scenario.urgency >= 3 ? "fortune" : "single",
  };
}

function getDefaultHook(lang) {
  const defaults = {
    zh: {
      title: "🔮 你的星盘藏着什么秘密？",
      hookText: "免费星盘只画出行星位置和相位线——但这些符号背后的含义，才是真正决定你性格、感情模式、事业方向的关键。AI深度解读会用大白话告诉你：你的核心格局是什么？最大的优势和卡点在哪？今年该注意什么？",
      ctaProduct: "single",
    },
    en: {
      title: "🔮 What Secrets Does Your Chart Hold?",
      hookText: "Your free chart shows planet positions and aspect lines — but the meaning behind these symbols is what truly determines your personality, relationship patterns, and career direction. AI Deep Reading explains in plain language: What's your core pattern? Your biggest strengths and blocks? What to watch for this year?",
      ctaProduct: "single",
    },
    id: {
      title: "🔮 Rahasia Apa yang Tersembunyi dalam Bintang Anda?",
      hookText: "Bagan gratis hanya menunjukkan posisi planet dan garis aspek. Tapi makna di balik simbol inilah yang menentukan kepribadian, pola hubungan, arah karier. AI menjelaskan dengan bahasa sederhana.",
      ctaProduct: "single",
    },
    th: {
      title: "🔮 ตารางดาวของคุณซ่อนความลับอะไร?",
      hookText: "ตารางฟรีแสดงตำแหน่งดาวและเส้นแง่ง แต่ความหมายเบื้องหลังคือสิ่งที่กำหนดบุคลิก ลักษณะความสัมพันธ์ อาชีพ. AI อธิบายแบบเข้าใจง่าย.",
      ctaProduct: "single",
    },
    vi: {
      title: "🔮 Bàn sao của bạn ẩn bí mật gì?",
      hookText: "Bàn miễn phí chỉ hiện vị trí hành tinh và đường aspect. Nhưng ý nghĩa đằng sau mới quyết định tính cách, mối quan hệ, sự nghiệp. AI giải thích bằng ngôn ngữ đơn giản.",
      ctaProduct: "single",
    },
    ms: {
      title: "🔮 Rahsia Apa yang Tersembunyi dalam Carta Anda?",
      hookText: "Carta percuma hanya menunjukkan kedudukan planet dan garis aspek. Tapi makna di belakang simbol inilah yang tentukan personaliti, pola hubungan, kerjaya. AI terangkan dengan bahasa mudah.",
      ctaProduct: "single",
    },
    ja: {
      title: "🔮 あなたの星盤が隠している秘密",
      hookText: "無料の星盤は惑星の位置とアスペクト線を表示するだけ。でもその記号の奥にある意味こそが、性格・恋愛パターン・仕事の方向性を決める。AIが平易な言葉で解説します。",
      ctaProduct: "single",
    },
    ko: {
      title: "🔮 당신의 차트가 숨긴 비밀",
      hookText: "무료 차트는 행성 위치와 어스펙트 선만 보여줄 뿐. 기호 뒤의 의미가 당신의 성격, 연애 패턴, 진로를 결정. AI가 쉬운 말로 설명.",
      ctaProduct: "single",
    },
  };
  return { type: "default", urgency: 0, ...(defaults[lang] || defaults.en) };
}
