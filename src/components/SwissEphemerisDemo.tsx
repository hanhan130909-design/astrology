"use client";

import { useState, useEffect, useMemo } from "react";
import { generateNatalChart, PLANET_DATA, ZODIAC_BOUNDARIES } from "@/lib/swissEphemeris";
import type { Language } from "@/contexts/LanguageContext";

interface Props {
  language: Language;
}

const PLANETS_ORDER: Array<"sun" | "moon" | "mercury" | "venus" | "mars" | "jupiter" | "saturn" | "uranus" | "neptune" | "pluto"> = [
  "sun", "moon", "mercury", "venus", "mars", 
  "jupiter", "saturn", "uranus", "neptune", "pluto"
];

export default function SwissEphemerisDemo({ language }: Props) {
  const [birthDate, setBirthDate] = useState("1990-06-15");
  const [birthTime, setBirthTime] = useState("12:00");
  const [birthPlace, setBirthPlace] = useState("Beijing");
  const [lat, setLat] = useState(39.9042);
  const [lng, setLng] = useState(116.4074);
  const [timezone, setTimezone] = useState(8);
  const [chart, setChart] = useState<ReturnType<typeof generateNatalChart> | null>(null);

  const t: Record<string, string> = {
    id: {
      title: "Kalkulator Natal Profesional",
      subtitle: "Dengan Swiss Ephemeris",
      birthDate: "Tanggal Lahir",
      birthTime: "Waktu Lahir",
      birthPlace: "Tempat Lahir",
      latitude: "Garis Lintang",
      longitude: "Garis Bujur",
      timezone: "Zona Waktu",
      calculate: "Hitung Chart",
      calculating: "Menghitung...",
      planets: "Planet",
      houses: "Rumah",
      aspects: "Aspek",
      sign: "Tanda",
      house: "Rumah",
      degree: "Derajat",
      retrograde: "Retrograde",
      yes: "Ya",
      no: "Tidak",
      noData: "Masukkan data kelahiran dan klik Hitung"
    },
    en: {
      title: "Professional Natal Calculator",
      subtitle: "Powered by Swiss Ephemeris",
      birthDate: "Birth Date",
      birthTime: "Birth Time",
      birthPlace: "Birth Place",
      latitude: "Latitude",
      longitude: "Longitude",
      timezone: "Timezone",
      calculate: "Calculate Chart",
      calculating: "Calculating...",
      planets: "Planets",
      houses: "Houses",
      aspects: "Aspects",
      sign: "Sign",
      house: "House",
      degree: "Degrees",
      retrograde: "Retrograde",
      yes: "Yes",
      no: "No",
      noData: "Enter birth data and click Calculate"
    },
    zh: {
      title: "专业本命盘计算器",
      subtitle: "基于 Swiss Ephemeris 天文引擎",
      birthDate: "出生日期",
      birthTime: "出生时间",
      birthTimeNote: "北京时间",
      birthPlace: "出生地点",
      latitude: "纬度",
      longitude: "经度",
      timezone: "时区",
      calculate: "计算星盘",
      calculating: "计算中...",
      planets: "行星",
      houses: "宫位",
      aspects: "相位",
      sign: "星座",
      house: "宫位",
      degree: "度数",
      retrograde: "逆行",
      yes: "是",
      no: "否",
      noData: "输入出生信息，点击计算星盘"
    }
  }[language] || {};

  const handleCalculate = () => {
    const [year, month, day] = birthDate.split("-").map(Number);
    const [hour, minute] = birthTime.split(":").map(Number);
    
    const result = generateNatalChart(year, month, day, hour, minute, lat, lng, timezone);
    setChart(result);
  };

  const getSignSymbol = (sign: string) => {
    const signData = ZODIAC_BOUNDARIES.find(s => s.sign === sign);
    return signData?.symbol || "";
  };

  const getElementColor = (element: string) => {
    const colors: Record<string, string> = {
      Fire: "text-gray-400",
      Earth: "text-gray-400",
      Air: "text-gray-400",
      Water: "text-gray-400"
    };
    return colors[element] || "text-white";
  };

  const getAspectSymbol = (aspect: string) => {
    const symbols: Record<string, string> = {
      conjunction: "☌",
      opposition: "☍",
      trine: "△",
      square: "□",
      sextile: "⚹"
    };
    return symbols[aspect] || "";
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500/20 rounded-full mb-4">
          <span className="text-gray-600">✦</span>
          <span className="text-gray-600 text-sm">Swiss Ephemeris</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">{t.title}</h2>
        <p className="text-gray-300">{t.subtitle}</p>
      </div>

      {/* 输入表单 */}
      <div className="grid md:grid-cols-2 gap-6 p-6 rounded-2xl bg-gray-900/30 border border-gray-200">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">{t.birthDate}</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-200 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gray-500/50"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-300 mb-2">{t.birthTime}</label>
            <input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-200 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gray-500/50"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-300 mb-2">{t.birthPlace}</label>
            <input
              type="text"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-200 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gray-500/50"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">{t.latitude}</label>
            <input
              type="number"
              value={lat}
              onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
              step="0.0001"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-200 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gray-500/50"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-300 mb-2">{t.longitude}</label>
            <input
              type="number"
              value={lng}
              onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
              step="0.0001"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-200 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gray-500/50"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-300 mb-2">{t.timezone}</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(parseFloat(e.target.value))}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-200 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gray-500/50"
            >
              <option value={8}>GMT+8 (北京/新加坡/香港)</option>
              <option value={7}>GMT+7 (曼谷/雅加达)</option>
              <option value={9}>GMT+9 (东京/首尔)</option>
              <option value={0}>GMT+0 (伦敦)</option>
              <option value={-5}>GMT-5 (纽约)</option>
              <option value={-8}>GMT-8 (洛杉矶)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 计算按钮 */}
      <button
        onClick={handleCalculate}
        className="w-full py-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 rounded-xl text-white font-bold text-lg shadow-lg shadow-gray-500/25 transition-all duration-300 transform hover:scale-[1.02]"
      >
        {t.calculate}
      </button>

      {/* 计算结果 */}
      {chart && (
        <div className="space-y-6">
          {/* Julian Day */}
          <div className="text-center text-sm text-gray-400">
            JD: {chart.julianDay.toFixed(4)}
          </div>

          {/* 行星位置 */}
          <div className="rounded-2xl bg-gray-900/30 border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-600 mb-4 flex items-center gap-2">
              <span className="text-2xl">🪐</span> {t.planets}
            </h3>
            <div className="grid gap-2">
              {PLANETS_ORDER.map((planet) => {
                const data = chart.planets[planet];
                if (!data) return null;
                const planetInfo = PLANET_DATA[planet];
                
                return (
                  <div
                    key={planet}
                    className="flex items-center justify-between p-3 bg-gray-900/30 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{planetInfo?.symbol}</span>
                      <div>
                        <div className="font-medium text-white">
                          {language === "zh" ? planetInfo?.zh : language === "id" ? planetInfo?.id : planetInfo?.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {language === "zh" ? "黄经" : language === "id" ? "Bujur" : "Longitude"}: {data.longitude.toFixed(2)}°
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getElementColor(data.zodiac.element)}`}>
                        {getSignSymbol(data.zodiac.sign)} {data.zodiac.sign.charAt(0).toUpperCase() + data.zodiac.sign.slice(1)}
                      </div>
                      <div className="text-sm text-gray-300">
                        {data.zodiac.degree}°{data.zodiac.minute}&apos;
                        {data.retrograde && (
                          <span className="ml-2 text-gray-400">℞</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 宫位 */}
          <div className="rounded-2xl bg-gray-900/30 border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-600 mb-4 flex items-center gap-2">
              <span className="text-2xl">🏠</span> {t.houses}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {chart.houses.map((house) => (
                <div
                  key={house.number}
                  className="p-3 bg-gray-900/30 rounded-xl text-center"
                >
                  <div className="text-lg font-bold text-gray-600">
                    {house.number}
                  </div>
                  <div className={`text-sm ${getElementColor(house.element)}`}>
                    {getSignSymbol(house.sign)} {house.sign.charAt(0).toUpperCase() + house.sign.slice(1)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {house.cusp.toFixed(1)}°
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 上升点 */}
          <div className="rounded-2xl bg-gradient-to-r from-gray-500/20 to-gray-500/20 border border-gray-500/30 p-6 text-center">
            <div className="text-sm text-gray-300 mb-2">
              {language === "zh" ? "上升点 (ASC)" : language === "id" ? "Ascendant" : "Ascendant"}
            </div>
            <div className="text-3xl font-bold text-gray-600">
              {getSignSymbol(chart.ascendant.sign)} {chart.ascendant.sign.charAt(0).toUpperCase() + chart.ascendant.sign.slice(1)} {chart.ascendant.degree.toFixed(1)}°
            </div>
          </div>

          {/* 主要相位 */}
          {chart.aspects.length > 0 && (
            <div className="rounded-2xl bg-gray-900/30 border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-600 mb-4 flex items-center gap-2">
                <span className="text-2xl">✨</span> {t.aspects}
              </h3>
              <div className="grid gap-2">
                {chart.aspects.map((aspect: any, i: number) => {
                  const p1 = PLANET_DATA[aspect.planet1 as keyof typeof PLANET_DATA];
                  const p2 = PLANET_DATA[aspect.planet2 as keyof typeof PLANET_DATA];
                  
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-900/30 rounded-xl"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{p1?.symbol}</span>
                        <span className="text-gray-300">{getAspectSymbol(aspect.aspect)}</span>
                        <span className="text-2xl">{p2?.symbol}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white capitalize">{aspect.aspect}</div>
                        <div className="text-xs text-gray-400">
                          Orb: {aspect.orb.toFixed(1)}°
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 无数据提示 */}
      {!chart && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-4">🌟</div>
          <p>{t.noData}</p>
        </div>
      )}
    </div>
  );
}