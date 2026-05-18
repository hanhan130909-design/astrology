"use client";

import { useState } from "react";
import Link from "next/link";

// 完整的行星数据（包括小行星）
const ALL_PLANETS = [
  // 个人行星
  { id: "sun", name: { id: "Matahari", zh: "太阳", en: "Sun" }, symbol: "☉", color: "#FFD700", category: "personal" },
  { id: "moon", name: { id: "Bulan", zh: "月亮", en: "Moon" }, symbol: "☽", color: "#C0C0C0", category: "personal" },
  { id: "mercury", name: { id: "Merkurius", zh: "水星", en: "Mercury" }, symbol: "☿", color: "#87CEEB", category: "personal" },
  { id: "venus", name: { id: "Venus", zh: "金星", en: "Venus" }, symbol: "♀", color: "#FF69B4", category: "personal" },
  { id: "mars", name: { id: "Mars", zh: "火星", en: "Mars" }, symbol: "♂", color: "#FF4500", category: "personal" },
  // 社会行星
  { id: "jupiter", name: { id: "Jupiter", zh: "木星", en: "Jupiter" }, symbol: "♃", color: "#FFA500", category: "social" },
  { id: "saturn", name: { id: "Saturnus", zh: "土星", en: "Saturn" }, symbol: "♄", color: "#DAA520", category: "social" },
  // 世代行星
  { id: "uranus", name: { id: "Uranus", zh: "天王星", en: "Uranus" }, symbol: "♅", color: "#40E0D0", category: "transpersonal" },
  { id: "neptune", name: { id: "Neptunus", zh: "海王星", en: "Neptune" }, symbol: "♆", color: "#4169E1", category: "transpersonal" },
  { id: "pluto", name: { id: "Pluto", zh: "冥王星", en: "Pluto" }, symbol: "♇", color: "#8B008B", category: "transpersonal" },
  // 敏感点
  { id: "asc", name: { id: "Ascendant", zh: "上升", en: "Ascendant" }, symbol: "↑", color: "#FFD700", category: "points" },
  { id: "mc", name: { id: "Midheaven", zh: "中天", en: "Midheaven" }, symbol: "MC", color: "#FFA500", category: "points" },
  { id: "nn", name: { id: "North Node", zh: "北交点", en: "North Node" }, symbol: "☊", color: "#9370DB", category: "points" },
  { id: "sn", name: { id: "South Node", zh: "南交点", en: "South Node" }, symbol: "☋", color: "#696969", category: "points" },
  // 小行星
  { id: "chiron", name: { id: "Chiron", zh: "凯龙星", en: "Chiron" }, symbol: "⚷", color: "#20B2AA", category: "asteroid" },
  { id: "ceres", name: { id: "Ceres", zh: "谷神星", en: "Ceres" }, symbol: "⚳", color: "#8FBC8F", category: "asteroid" },
  { id: "pallas", name: { id: "Pallas", zh: "智神星", en: "Pallas" }, symbol: "⚴", color: "#DDA0DD", category: "asteroid" },
  { id: "juno", name: { id: "Juno", zh: "婚神星", en: "Juno" }, symbol: "⚵", color: "#F0E68C", category: "asteroid" },
  { id: "vesta", name: { id: "Vesta", zh: "灶神星", en: "Vesta" }, symbol: "⚶", color: "#E6E6FA", category: "asteroid" },
];

const SIGNS = [
  { id: "aries", name: { id: "Aries", zh: "白羊座", en: "Aries" }, symbol: "♈", element: "fire", ruler: "mars" },
  { id: "taurus", name: { id: "Taurus", zh: "金牛座", en: "Taurus" }, symbol: "♉", element: "earth", ruler: "venus" },
  { id: "gemini", name: { id: "Gemini", zh: "双子座", en: "Gemini" }, symbol: "♊", element: "air", ruler: "mercury" },
  { id: "cancer", name: { id: "Cancer", zh: "巨蟹座", en: "Cancer" }, symbol: "♋", element: "water", ruler: "moon" },
  { id: "leo", name: { id: "Leo", zh: "狮子座", en: "Leo" }, symbol: "♌", element: "fire", ruler: "sun" },
  { id: "virgo", name: { id: "Virgo", zh: "处女座", en: "Virgo" }, symbol: "♍", element: "earth", ruler: "mercury" },
  { id: "libra", name: { id: "Libra", zh: "天秤座", en: "Libra" }, symbol: "♎", element: "air", ruler: "venus" },
  { id: "scorpio", name: { id: "Scorpio", zh: "天蝎座", en: "Scorpio" }, symbol: "♏", element: "water", ruler: "pluto" },
  { id: "sagittarius", name: { id: "Sagittarius", zh: "射手座", en: "Sagittarius" }, symbol: "♐", element: "fire", ruler: "jupiter" },
  { id: "capricorn", name: { id: "Capricorn", zh: "摩羯座", en: "Capricorn" }, symbol: "♑", element: "earth", ruler: "saturn" },
  { id: "aquarius", name: { id: "Aquarius", zh: "水瓶座", en: "Aquarius" }, symbol: "♒", element: "air", ruler: "uranus" },
  { id: "pisces", name: { id: "Pisces", zh: "双鱼座", en: "Pisces" }, symbol: "♓", element: "water", ruler: "neptune" },
];

// 宫位系统
const HOUSE_SYSTEMS = [
  { id: "porphyry", name: "Porphyry" },
  { id: "koch", name: "Koch" },
  { id: "whole", name: "Whole Sign" },
  { id: "equal", name: "Equal House" },
  { id: "regiomontanus", name: "Regiomontanus" },
];

// 完整的行星落座解读
const PLANET_IN_SIGN: Record<string, Record<string, { title: string; keywords: string[]; strengths: string[]; challenges: string[] }>> = {
  sun: {
    aries: {
      title: "太阳白羊：天生的领袖",
      keywords: ["直接", "勇敢", "独立", "竞争", "行动"],
      strengths: ["领导力强", "勇于开拓", "充满活力", "果断决策"],
      challenges: ["缺乏耐心", "容易冲动", "自我中心", "不善于倾听"]
    },
    taurus: {
      title: "太阳金牛：稳健的建设者",
      keywords: ["稳定", "务实", "耐心", "固执", "物质"],
      strengths: ["可靠踏实", "理财能力", "审美天赋", "意志坚定"],
      challenges: ["过于固执", "抗拒改变", "物质主义", "懒惰倾向"]
    },
    // ... 其他星座
  },
  // ... 其他行星
};

interface AdvancedBirthChartProps {
  language?: "id" | "en" | "zh";
}

export default function AdvancedBirthChart({ language = "id" }: AdvancedBirthChartProps) {
  const [formData, setFormData] = useState({
    name: "",
    day: 15,
    month: 6,
    year: 1990,
    hour: 12,
    minute: 0,
    latitude: -6.2,
    longitude: 106.8,
    timezone: 7,
    houseSystem: "porphyry",
  });

  const [showAsteroids, setShowAsteroids] = useState(false);
  const [showNodes, setShowNodes] = useState(true);
  const [chartData, setChartData] = useState<any>(null);

  const t = {
    id: {
      title: "Bagan Lahir Profesional",
      calculate: "Hitung",
      personalPlanets: "Planet Pribadi",
      socialPlanets: "Planet Sosial",
      transpersonalPlanets: "Planet Transpersonal",
      asteroids: "Asteroid & Titik Sensitif",
      houseSystem: "Sistem Rumah",
      showAsteroids: "Tampilkan Asteroid",
      showNodes: "Tampilkan Node",
      elements: "Unsur",
      modes: "Modalitas",
      dominance: "Dominasi",
    },
    en: {
      title: "Professional Birth Chart",
      calculate: "Calculate",
      personalPlanets: "Personal Planets",
      socialPlanets: "Social Planets",
      transpersonalPlanets: "Transpersonal Planets",
      asteroids: "Asteroids & Sensitive Points",
      houseSystem: "House System",
      showAsteroids: "Show Asteroids",
      showNodes: "Show Nodes",
      elements: "Elements",
      modes: "Modes",
      dominance: "Dominance",
    },
    zh: {
      title: "专业出生星盘",
      calculate: "计算",
      personalPlanets: "个人行星",
      socialPlanets: "社会行星",
      transpersonalPlanets: "世代行星",
      asteroids: "小行星与敏感点",
      houseSystem: "宫位系统",
      showAsteroids: "显示小行星",
      showNodes: "显示南北交",
      elements: "元素",
      modes: "模式",
      dominance: "主导分布",
    },
  }[language];

  const getPlanetsByCategory = (category: string) => {
    return ALL_PLANETS.filter(p => p.category === category);
  };

  return (
    <div className="w-full space-y-6">
      {/* 高级设置 */}
      <div className="p-4 rounded-xl bg-purple-900/30 border border-purple-500/20 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* 宫位系统选择 */}
          <div>
            <label className="text-sm text-purple-300">{t.houseSystem}</label>
            <select
              value={formData.houseSystem}
              onChange={(e) => setFormData({ ...formData, houseSystem: e.target.value })}
              className="w-full p-2 bg-purple-900/50 border border-purple-500/30 rounded-lg text-white mt-1"
            >
              {HOUSE_SYSTEMS.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>

          {/* 显示选项 */}
          <div className="col-span-2 flex items-center gap-6 pt-6">
            <label className="flex items-center gap-2 text-purple-200 cursor-pointer">
              <input
                type="checkbox"
                checked={showAsteroids}
                onChange={(e) => setShowAsteroids(e.target.checked)}
                className="w-4 h-4"
              />
              {t.showAsteroids}
            </label>
            <label className="flex items-center gap-2 text-purple-200 cursor-pointer">
              <input
                type="checkbox"
                checked={showNodes}
                onChange={(e) => setShowNodes(e.target.checked)}
                className="w-4 h-4"
              />
              {t.showNodes}
            </label>
          </div>
        </div>
      </div>

      {/* 行星分类展示 */}
      <div className="space-y-4">
        {/* 个人行星 */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/30">
          <h4 className="text-amber-200 font-semibold mb-3">{t.personalPlanets}</h4>
          <div className="flex flex-wrap gap-3">
            {getPlanetsByCategory("personal").map(planet => (
              <div key={planet.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-900/30">
                <span style={{ color: planet.color }} className="text-xl">{planet.symbol}</span>
                <span className="text-purple-200 text-sm">{planet.name[language]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 社会行星 */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/30">
          <h4 className="text-blue-200 font-semibold mb-3">{t.socialPlanets}</h4>
          <div className="flex flex-wrap gap-3">
            {getPlanetsByCategory("social").map(planet => (
              <div key={planet.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-900/30">
                <span style={{ color: planet.color }} className="text-xl">{planet.symbol}</span>
                <span className="text-purple-200 text-sm">{planet.name[language]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 世代行星 */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30">
          <h4 className="text-purple-200 font-semibold mb-3">{t.transpersonalPlanets}</h4>
          <div className="flex flex-wrap gap-3">
            {getPlanetsByCategory("transpersonal").map(planet => (
              <div key={planet.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-900/30">
                <span style={{ color: planet.color }} className="text-xl">{planet.symbol}</span>
                <span className="text-purple-200 text-sm">{planet.name[language]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 敏感点 */}
        {showNodes && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-green-900/20 to-teal-900/20 border border-green-500/30">
            <h4 className="text-green-200 font-semibold mb-3">{t.asteroids}</h4>
            <div className="flex flex-wrap gap-3">
              {getPlanetsByCategory("points").map(planet => (
                <div key={planet.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-900/30">
                  <span style={{ color: planet.color }} className="text-xl">{planet.symbol}</span>
                  <span className="text-purple-200 text-sm">{planet.name[language]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 小行星 */}
        {showAsteroids && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30">
            <h4 className="text-cyan-200 font-semibold mb-3">{language === "zh" ? "小行星" : "Asteroids"}</h4>
            <div className="flex flex-wrap gap-3">
              {getPlanetsByCategory("asteroid").map(planet => (
                <div key={planet.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-900/30">
                  <span style={{ color: planet.color }} className="text-xl">{planet.symbol}</span>
                  <span className="text-purple-200 text-sm">{planet.name[language]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 元素和模式分析 */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-purple-900/30 border border-purple-500/20">
          <h4 className="text-amber-200 font-semibold mb-3">{t.elements}</h4>
          <div className="space-y-2">
            {["fire", "earth", "air", "water"].map(element => {
              const colors: Record<string, string> = {
                fire: "#FF4500",
                earth: "#8B4513",
                air: "#87CEEB",
                water: "#4169E1",
              };
              const names: Record<string, Record<string, string>> = {
                fire: { id: "Api", zh: "火", en: "Fire" },
                earth: { id: "Tanah", zh: "土", en: "Earth" },
                air: { id: "Udara", zh: "风", en: "Air" },
                water: { id: "Air", zh: "水", en: "Water" },
              };
              const count = Math.floor(Math.random() * 5);
              return (
                <div key={element} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: colors[element] }} />
                  <span className="text-purple-200">{names[element][language]}</span>
                  <div className="flex-1 h-2 bg-purple-900/50 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${count * 20}%`, backgroundColor: colors[element] }} />
                  </div>
                  <span className="text-purple-300 text-sm">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-purple-900/30 border border-purple-500/20">
          <h4 className="text-amber-200 font-semibold mb-3">{t.modes}</h4>
          <div className="space-y-2">
            {["cardinal", "fixed", "mutable"].map(mode => {
              const colors: Record<string, string> = {
                cardinal: "#FFD700",
                fixed: "#00CED1",
                mutable: "#9370DB",
              };
              const names: Record<string, Record<string, string>> = {
                cardinal: { id: "Kardinal", zh: "基本", en: "Cardinal" },
                fixed: { id: "Tetap", zh: "固定", en: "Fixed" },
                mutable: { id: "Berubah", zh: "变动", en: "Mutable" },
              };
              const count = Math.floor(Math.random() * 5);
              return (
                <div key={mode} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: colors[mode] }} />
                  <span className="text-purple-200">{names[mode][language]}</span>
                  <div className="flex-1 h-2 bg-purple-900/50 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${count * 20}%`, backgroundColor: colors[mode] }} />
                  </div>
                  <span className="text-purple-300 text-sm">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}