import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AstroSymbol } from "../src/components/AstroSymbol";
import fs from "fs";
import sharp from "sharp";

const PLANETS = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "North_Node"];
const ZODIAC = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const NAME: Record<string, string> = {
  Sun: "太阳 Sun", Moon: "月亮 Moon", Mercury: "水星 Mercury", Venus: "金星 Venus",
  Mars: "火星 Mars", Jupiter: "木星 Jupiter", Saturn: "土星 Saturn", Uranus: "天王星 Uranus",
  Neptune: "海王星 Neptune", Pluto: "冥王星 Pluto", North_Node: "北交点 North Node",
  Aries: "白羊 Aries", Taurus: "金牛 Taurus", Gemini: "双子 Gemini", Cancer: "巨蟹 Cancer",
  Leo: "狮子 Leo", Virgo: "处女 Virgo", Libra: "天秤 Libra", Scorpio: "天蝎 Scorpio",
  Sagittarius: "射手 Sagittarius", Capricorn: "摩羯 Capricorn", Aquarius: "水瓶 Aquarius", Pisces: "双鱼 Pisces",
};

const cell = 240, cols = 4;

function section(title: string, items: string[]) {
  const header = `<text x="${(cols * cell) / 2}" y="40" font-size="26" font-weight="bold" text-anchor="middle" font-family="sans-serif" fill="#111">${title}</text>`;
  const cells = items.map((n, i) => {
    const svg = renderToStaticMarkup(React.createElement(AstroSymbol, { name: n, size: 200, color: "#000" }));
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * cell;
    const y = row * cell + 80;
    return `<g transform="translate(${x + 25} ${y + 25})">${svg}</g>` +
      `<text x="${x + cell / 2}" y="${y + cell - 8}" font-size="17" text-anchor="middle" font-family="sans-serif" fill="#333">${NAME[n] || n}</text>`;
  }).join("");
  return header + cells;
}

const rowsP = Math.ceil(PLANETS.length / cols);
const rowsZ = Math.ceil(ZODIAC.length / cols);
const H = 80 + rowsP * cell + 50 + rowsZ * cell;
const W = cols * cell;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
  `<rect width="100%" height="100%" fill="#fff"/>` +
  section("行 星 符 号", PLANETS) +
  section("黄 道 十 二 星 座", ZODIAC) +
  `</svg>`;

fs.writeFileSync("/tmp/symbols_show.svg", svg);
sharp("/tmp/symbols_show.svg").png().toFile("/tmp/symbols_show.png").then(() => {
  console.log("saved /tmp/symbols_show.png", W + "x" + H);
});
