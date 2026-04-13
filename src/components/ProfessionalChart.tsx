"use client";

import { useState, useMemo } from "react";
import { calculateBirthChart, SIGNS, PLANETS, ELEMENT_COLORS } from "@/lib/astrology";

// 扩展印尼城市列表 - 更专业的覆盖
const cities = [
  // 印尼主要城市
  { name: { id: "Jakarta", zh: "雅加达", en: "Jakarta" }, lat: -6.2088, lng: 106.8456 },
  { name: { id: "Surabaya", zh: "泗水", en: "Surabaya" }, lat: -7.2575, lng: 112.7521 },
  { name: { id: "Bandung", zh: "万隆", en: "Bandung" }, lat: -6.9175, lng: 107.6191 },
  { name: { id: "Medan", zh: "棉兰", en: "Medan" }, lat: 3.5952, lng: 98.6722 },
  { name: { id: "Semarang", zh: "三宝垄", en: "Semarang" }, lat: -6.9666, lng: 110.4196 },
  { name: { id: "Makassar", zh: "望加锡", en: "Makassar" }, lat: -5.1477, lng: 119.4327 },
  { name: { id: "Palembang", zh: "巨港", en: "Palembang" }, lat: -2.9909, lng: 104.7566 },
  { name: { id: "Denpasar (Bali)", zh: "巴厘岛", en: "Bali" }, lat: -8.4095, lng: 115.1889 },
  { name: { id: "Yogyakarta", zh: "日惹", en: "Yogyakarta" }, lat: -7.7956, lng: 110.3695 },
  { name: { id: "Solo", zh: "梭罗", en: "Solo" }, lat: -7.5678, lng: 110.8281 },
  { name: { id: "Malang", zh: "玛琅", en: "Malang" }, lat: -7.9666, lng: 112.6326 },
  { name: { id: "Batam", zh: "巴淡岛", en: "Batam" }, lat: 1.0456, lng: 104.0406 },
  { name: { id: "Pekanbaru", zh: "北干巴鲁", en: "Pekanbaru" }, lat: 0.5071, lng: 101.4458 },
  { name: { id: "Padang", zh: "巴东", en: "Padang" }, lat: -0.9471, lng: 100.4172 },
  { name: { id: "Banjarmasin", zh: "马辰", en: "Banjarmasin" }, lat: -3.3194, lng: 114.5908 },
  { name: { id: "Manado", zh: "万鸦老", en: "Manado" }, lat: 1.4748, lng: 124.8421 },
  { name: { id: "Balikpapan", zh: "巴厘巴板", en: "Balikpapan" }, lat: -1.2654, lng: 116.8312 },
  { name: { id: "Samarinda", zh: "三马林达", en: "Samarinda" }, lat: -0.4948, lng: 117.1436 },
  { name: { id: "Tangerang", zh: "坦格朗", en: "Tangerang" }, lat: -6.1783, lng: 106.6317 },
  { name: { id: "Bekasi", zh: "勿加泗", en: "Bekasi" }, lat: -6.2349, lng: 106.9906 },
  { name: { id: "Depok", zh: "德波", en: "Depok" }, lat: -6.3971, lng: 106.8217 },
  { name: { id: "Bogor", zh: "茂物", en: "Bogor" }, lat: -6.5950, lng: 106.8167 },
  // 东南亚其他城市
  { name: { id: "Singapore", zh: "新加坡", en: "Singapore" }, lat: 1.3521, lng: 103.8198 },
  { name: { id: "Kuala Lumpur", zh: "吉隆坡", en: "Kuala Lumpur" }, lat: 3.1390, lng: 101.6869 },
  { name: { id: "Bangkok", zh: "曼谷", en: "Bangkok" }, lat: 13.7563, lng: 100.5018 },
  { name: { id: "Hong Kong", zh: "香港", en: "Hong Kong" }, lat: 22.3193, lng: 114.1694 },
  { name: { id: "Taipei", zh: "台北", en: "Taipei" }, lat: 25.0330, lng: 121.5654 },
  { name: { id: "Manila", zh: "马尼拉", en: "Manila" }, lat: 14.5995, lng: 120.9842 },
  // 中国主要城市
  { name: { id: "Beijing", zh: "北京", en: "Beijing" }, lat: 39.9042, lng: 116.4074 },
  { name: { id: "Shanghai", zh: "上海", en: "Shanghai" }, lat: 31.2304, lng: 121.4737 },
  { name: { id: "Shenzhen", zh: "深圳", en: "Shenzhen" }, lat: 22.5431, lng: 114.0579 },
  { name: { id: "Guangzhou", zh: "广州", en: "Guangzhou" }, lat: 23.1291, lng: 113.2644 },
  { name: { id: "Chengdu", zh: "成都", en: "Chengdu" }, lat: 30.5728, lng: 104.0668 },
  { name: { id: "Hangzhou", zh: "杭州", en: "Hangzhou" }, lat: 30.2741, lng: 120.1551 },
  // 国际城市
  { name: { id: "Tokyo", zh: "东京", en: "Tokyo" }, lat: 35.6762, lng: 139.6503 },
  { name: { id: "Seoul", zh: "首尔", en: "Seoul" }, lat: 37.5665, lng: 126.9780 },
  { name: { id: "New York", zh: "纽约", en: "New York" }, lat: 40.7128, lng: -74.0060 },
  { name: { id: "Los Angeles", zh: "洛杉矶", en: "Los Angeles" }, lat: 34.0522, lng: -118.2437 },
  { name: { id: "London", zh: "伦敦", en: "London" }, lat: 51.5074, lng: -0.1278 },
  { name: { id: "Sydney", zh: "悉尼", en: "Sydney" }, lat: -33.8688, lng: 151.2093 },
  { name: { id: "Melbourne", zh: "墨尔本", en: "Melbourne" }, lat: -37.8136, lng: 144.9631 },
];

interface Props {
  language: "id" | "en" | "zh";
}

// 新配色方案：深蓝 + 香槟金
const COLORS = {
  midnightBlue: "#0f172a",
  deepNavy: "#1e293b",
  navyBorder: "#334155",
  champagneGold: "#d4a574",
  warmGold: "#f5d89a",
  creamWhite: "#fef3e2",
  softBlue: "#64748b",
  accentBlue: "#3b82f6",
};

export default function ProfessionalChart({ language }: Props) {
  const [form, setForm] = useState({
    year: 1990, month: 1, day: 15, hour: 12, minute: 0, cityIndex: 0
  });
  const [chart, setChart] = useState<ReturnType<typeof calculateBirthChart> | null>(null);

  const t = useMemo(() => ({
    name: { id: "Nama", zh: "姓名", en: "Name" }[language],
    birthDate: { id: "Tanggal Lahir", zh: "出生日期", en: "Birth Date" }[language],
    birthTime: { id: "Waktu Lahir", zh: "出生时间", en: "Birth Time" }[language],
    birthPlace: { id: "Tempat Lahir", zh: "出生地点", en: "Birth Place" }[language],
    calculate: { id: "Hitung Bintang Lahir", zh: "计算星盘", en: "Calculate Chart" }[language],
    sun: { id: "Matahari", zh: "太阳", en: "Sun" }[language],
    moon: { id: "Bulan", zh: "月亮", en: "Moon" }[language],
    rising: { id: "Rising", zh: "上升", en: "Rising" }[language],
    mc: { id: "Midheaven", zh: "中天", en: "MC" }[language],
    planets: { id: "Posisi Planet", zh: "行星位置", en: "Planets" }[language],
    aspects: { id: "Aspek", zh: "相位", en: "Aspects" }[language],
    elements: { id: "Unsur", zh: "元素", en: "Elements" }[language],
    modes: { id: "Mode", zh: "模式", en: "Modes" }[language],
    house: { id: "Rumah", zh: "宫", en: "H" }[language],
    retrograde: { id: "R", zh: "逆", en: "R" }[language],
    poweredBy: { id: "Dihitung dengan astronomy-engine untuk akurasi astronomis 100%", zh: "使用 astronomy-engine 计算，确保100%天文精度", en: "Calculated with astronomy-engine for 100% astronomical accuracy" }[language],
  }), [language]);

  const city = cities[form.cityIndex];

  const handleCalculate = () => {
    const result = calculateBirthChart(
      form.year, form.month, form.day, form.hour, form.minute,
      city.lat, city.lng
    );
    setChart(result);
  };

  // SVG 星盘渲染 - 升级配色
  const renderChartSVG = () => {
    if (!chart) return null;
    const size = 420;
    const cx = size / 2;
    const r1 = 195, r2 = 155, r3 = 115, r4 = 80;
    
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
        {/* 背景圆 */}
        <circle cx={cx} cy={cx} r={r1 + 5} fill="none" stroke={COLORS.champagneGold} strokeWidth="1" opacity="0.3" />
        
        {/* 最外圈 */}
        <circle cx={cx} cy={cx} r={r1} fill="none" stroke={COLORS.champagneGold} strokeWidth="1.5" opacity="0.6" />
        
        {/* 星座分区线和符号 */}
        {SIGNS.map((sign, i) => {
          const angle = (i * 30 - 90) * Math.PI / 180;
          const x1 = cx + r3 * Math.cos(angle);
          const y1 = cx + r3 * Math.sin(angle);
          const x2 = cx + r1 * Math.cos(angle);
          const y2 = cx + r1 * Math.sin(angle);
          const tx = cx + (r1 - 20) * Math.cos((i * 30 + 15 - 90) * Math.PI / 180);
          const ty = cx + (r1 - 20) * Math.sin((i * 30 + 15 - 90) * Math.PI / 180);
          return (
            <g key={sign.id}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLORS.champagneGold} strokeWidth="0.8" opacity="0.4" />
              <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fill={ELEMENT_COLORS[sign.element]} fontSize="16" fontWeight="500">{sign.symbol}</text>
            </g>
          );
        })}
        
        {/* 中圈 */}
        <circle cx={cx} cy={cx} r={r2} fill="none" stroke={COLORS.champagneGold} strokeWidth="0.8" opacity="0.4" />
        
        {/* 内圈 */}
        <circle cx={cx} cy={cx} r={r3} fill="none" stroke={COLORS.champagneGold} strokeWidth="0.6" opacity="0.3" />
        <circle cx={cx} cy={cx} r={r4} fill="none" stroke={COLORS.champagneGold} strokeWidth="0.5" opacity="0.2" />
        
        {/* 行星 */}
        {PLANETS.map(planet => {
          const data = chart.planets[planet.id];
          const signIdx = SIGNS.findIndex(s => s.id === data.sign);
          const angle = ((signIdx * 30 + data.degree) - 90) * Math.PI / 180;
          const x = cx + (r2 + r3) / 2 * Math.cos(angle);
          const y = cx + (r2 + r3) / 2 * Math.sin(angle);
          return (
            <g key={planet.id}>
              <circle cx={x} cy={y} r="13" fill="#0f172a" stroke={planet.color} strokeWidth="1.5" />
              <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill={planet.color} fontSize="13" fontWeight="600">{planet.symbol}</text>
            </g>
          );
        })}
        
        {/* ASC 标记 */}
        <circle cx={cx - r3 + 14} cy={cx} r="11" fill="#0f172a" stroke={COLORS.warmGold} strokeWidth="1.5" />
        <text x={cx - r3 + 14} y={cx} textAnchor="middle" dominantBaseline="middle" fill={COLORS.warmGold} fontSize="9" fontWeight="600">ASC</text>
        
        {/* MC 标记 */}
        <circle cx={cx} cy={cx - r3 + 14} r="11" fill="#0f172a" stroke={COLORS.champagneGold} strokeWidth="1.5" />
        <text x={cx} y={cx - r3 + 14} textAnchor="middle" dominantBaseline="middle" fill={COLORS.champagneGold} fontSize="9" fontWeight="600">MC</text>
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* 表单 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="col-span-2">
          <label className="text-xs" style={{color: COLORS.softBlue}}>{t.birthDate}</label>
          <div className="grid grid-cols-3 gap-1 mt-1">
            <select 
              value={form.year} 
              onChange={e => setForm({...form, year: +e.target.value})} 
              className="p-2.5 rounded-lg text-white text-sm transition-all"
              style={{backgroundColor: COLORS.deepNavy, borderColor: COLORS.navyBorder, border: '1px solid'}}
            >
              {Array.from({length:100}, (_, i) => 2025 - i).map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select 
              value={form.month} 
              onChange={e => setForm({...form, month: +e.target.value})} 
              className="p-2.5 rounded-lg text-white text-sm"
              style={{backgroundColor: COLORS.deepNavy, borderColor: COLORS.navyBorder, border: '1px solid'}}
            >
              {Array.from({length:12}, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select 
              value={form.day} 
              onChange={e => setForm({...form, day: +e.target.value})} 
              className="p-2.5 rounded-lg text-white text-sm"
              style={{backgroundColor: COLORS.deepNavy, borderColor: COLORS.navyBorder, border: '1px solid'}}
            >
              {Array.from({length:31}, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs" style={{color: COLORS.softBlue}}>{t.birthTime}</label>
          <div className="grid grid-cols-2 gap-1 mt-1">
            <select 
              value={form.hour} 
              onChange={e => setForm({...form, hour: +e.target.value})} 
              className="p-2.5 rounded-lg text-white text-sm"
              style={{backgroundColor: COLORS.deepNavy, borderColor: COLORS.navyBorder, border: '1px solid'}}
            >
              {Array.from({length:24}, (_, i) => i).map(h => <option key={h} value={h}>{h.toString().padStart(2,'0')}</option>)}
            </select>
            <select 
              value={form.minute} 
              onChange={e => setForm({...form, minute: +e.target.value})} 
              className="p-2.5 rounded-lg text-white text-sm"
              style={{backgroundColor: COLORS.deepNavy, borderColor: COLORS.navyBorder, border: '1px solid'}}
            >
              {[0,5,10,15,20,25,30,35,40,45,50,55].map(m => <option key={m} value={m}>{m.toString().padStart(2,'0')}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs" style={{color: COLORS.softBlue}}>{t.birthPlace}</label>
          <select 
            value={form.cityIndex} 
            onChange={e => setForm({...form, cityIndex: +e.target.value})} 
            className="w-full p-2.5 rounded-lg text-white text-sm mt-1"
            style={{backgroundColor: COLORS.deepNavy, borderColor: COLORS.navyBorder, border: '1px solid'}}
          >
            {cities.map((c, i) => <option key={i} value={i}>{c.name[language]}</option>)}
          </select>
        </div>
      </div>

      {/* 技术背书 */}
      <div className="text-center py-2">
        <p className="text-xs" style={{color: COLORS.softBlue}}>
          🔬 {t.poweredBy}
        </p>
      </div>

      <button 
        onClick={handleCalculate} 
        className="w-full py-3.5 rounded-xl font-semibold transition-all text-lg"
        style={{
          background: `linear-gradient(135deg, ${COLORS.champagneGold} 0%, ${COLORS.warmGold} 100%)`,
          color: COLORS.midnightBlue
        }}
      >
        ✨ {t.calculate}
      </button>

      {/* 结果 */}
      {chart && (
        <div className="space-y-6">
          {/* SVG 星盘 */}
          <div 
            className="flex justify-center p-4 rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${COLORS.deepNavy} 0%, ${COLORS.midnightBlue} 100%)`,
              border: `1px solid ${COLORS.navyBorder}`
            }}
          >
            {renderChartSVG()}
          </div>

          {/* 三大主星 */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: t.sun, symbol: "☉", data: chart.planets.sun, color: "#FFD700" },
              { label: t.moon, symbol: "☽", data: chart.planets.moon, color: "#C0C0C0" },
              { label: t.rising, symbol: "↑", data: chart.ascendant, color: "#FFA500" },
            ].map(item => (
              <div 
                key={item.label} 
                className="text-center p-4 rounded-xl transition-all"
                style={{
                  backgroundColor: COLORS.deepNavy,
                  border: `1px solid ${COLORS.navyBorder}`
                }}
              >
                <div className="text-2xl mb-1" style={{color: item.color}}>{item.symbol}</div>
                <div className="text-xs mb-1" style={{color: COLORS.softBlue}}>{item.label}</div>
                <div className="font-bold" style={{color: COLORS.warmGold}}>
                  {SIGNS.find(s => s.id === item.data.sign)?.symbol} {SIGNS.find(s => s.id === item.data.sign)?.name[language]}
                </div>
                <div className="text-xs" style={{color: COLORS.champagneGold}}>{item.data.degree.toFixed(1)}°</div>
              </div>
            ))}
          </div>

          {/* 行星表 */}
          <div 
            className="p-4 rounded-xl"
            style={{
              backgroundColor: COLORS.deepNavy,
              border: `1px solid ${COLORS.navyBorder}`
            }}
          >
            <h4 className="font-semibold mb-3" style={{color: COLORS.warmGold}}>{t.planets}</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {PLANETS.map(planet => {
                const data = chart.planets[planet.id];
                const sign = SIGNS.find(s => s.id === data.sign);
                return (
                  <div 
                    key={planet.id} 
                    className="p-2 rounded-lg flex items-center gap-2"
                    style={{backgroundColor: COLORS.midnightBlue}}
                  >
                    <span style={{color: planet.color}} className="text-lg">{planet.symbol}</span>
                    <div>
                      <div className="text-sm" style={{color: COLORS.creamWhite}}>{sign?.symbol} {sign?.name[language]}</div>
                      <div className="text-xs" style={{color: COLORS.champagneGold}}>{data.degree.toFixed(0)}° · {t.house}{data.house}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 元素和模式 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div 
              className="p-4 rounded-xl"
              style={{
                backgroundColor: COLORS.deepNavy,
                border: `1px solid ${COLORS.navyBorder}`
              }}
            >
              <h4 className="font-semibold mb-3" style={{color: COLORS.warmGold}}>{t.elements}</h4>
              <div className="space-y-2">
                {Object.entries(chart.elements).map(([el, count]) => (
                  <div key={el} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{backgroundColor: ELEMENT_COLORS[el]}} />
                    <span className="capitalize" style={{color: COLORS.creamWhite}}>{el}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{backgroundColor: COLORS.midnightBlue}}>
                      <div className="h-full rounded-full" style={{width: `${count * 20}%`, backgroundColor: ELEMENT_COLORS[el]}} />
                    </div>
                    <span className="text-sm" style={{color: COLORS.champagneGold}}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div 
              className="p-4 rounded-xl"
              style={{
                backgroundColor: COLORS.deepNavy,
                border: `1px solid ${COLORS.navyBorder}`
              }}
            >
              <h4 className="font-semibold mb-3" style={{color: COLORS.warmGold}}>{t.modes}</h4>
              <div className="space-y-2">
                {Object.entries(chart.modes).map(([mode, count]) => {
                  const colors: Record<string, string> = { cardinal: "#FFD700", fixed: "#00CED1", mutable: "#9370DB" };
                  const names: Record<string, Record<string, string>> = { 
                    cardinal: { id: "Kardinal", zh: "基本", en: "Cardinal" }, 
                    fixed: { id: "Tetap", zh: "固定", en: "Fixed" }, 
                    mutable: { id: "Berubah", zh: "变动", en: "Mutable" } 
                  };
                  return (
                    <div key={mode} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{backgroundColor: colors[mode]}} />
                      <span style={{color: COLORS.creamWhite}}>{names[mode][language]}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{backgroundColor: COLORS.midnightBlue}}>
                        <div className="h-full rounded-full" style={{width: `${count * 20}%`, backgroundColor: colors[mode]}} />
                      </div>
                      <span className="text-sm" style={{color: COLORS.champagneGold}}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 相位 */}
          {chart.aspects.length > 0 && (
            <div 
              className="p-4 rounded-xl"
              style={{
                backgroundColor: COLORS.deepNavy,
                border: `1px solid ${COLORS.navyBorder}`
              }}
            >
              <h4 className="font-semibold mb-3" style={{color: COLORS.warmGold}}>{t.aspects}</h4>
              <div className="space-y-1">
                {chart.aspects.slice(0, 8).map((asp, i) => {
                  const p1 = PLANETS.find(p => p.id === asp.planet1);
                  const p2 = PLANETS.find(p => p.id === asp.planet2);
                  const color = asp.aspect.nature === "harmonious" ? "#22c55e" : asp.aspect.nature === "challenging" ? "#ef4444" : "#eab308";
                  return (
                    <div 
                      key={i} 
                      className="flex items-center gap-2 p-2 rounded-lg"
                      style={{backgroundColor: COLORS.midnightBlue}}
                    >
                      <span style={{color: p1?.color}}>{p1?.symbol}</span>
                      <span style={{color}}>{asp.aspect.symbol}</span>
                      <span style={{color: p2?.color}}>{p2?.symbol}</span>
                      <span className="text-xs" style={{color: COLORS.softBlue}}>{asp.aspect.name[language]} ({asp.orb.toFixed(1)}°)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
