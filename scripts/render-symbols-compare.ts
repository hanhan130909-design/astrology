import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AstroSymbol } from "../src/components/AstroSymbol";
import fs from "fs";
import sharp from "sharp";

const names: Array<[string, string]> = [
  ["Sun", "☉"], ["Moon", "☽"], ["Mercury", "☿"], ["Venus", "♀"],
  ["Mars", "♂"], ["Jupiter", "♃"], ["Saturn", "♄"], ["Uranus", "♅"],
  ["Neptune", "♆"], ["North_Node", "☊"],
  ["Aries", "♈"], ["Taurus", "♉"], ["Gemini", "♊"], ["Cancer", "♋"],
  ["Leo", "♌"], ["Virgo", "♍"], ["Libra", "♎"], ["Scorpio", "♏"],
  ["Sagittarius", "♐"], ["Capricorn", "♑"], ["Aquarius", "♒"], ["Pisces", "♓"],
];

const cell = 250;
const cols = 4;
const cells = names.map(([key, uni], i) => {
  const mine = renderToStaticMarkup(
    React.createElement(AstroSymbol, { name: key, size: 140, color: "#000" })
  );
  const col = i % cols;
  const row = Math.floor(i / cols);
  const x = col * cell;
  const y = row * cell;
  // 左=我的SVG，右=标准Unicode字符（红色）
  return `<g transform="translate(${x + 20} ${y + 25})">${mine}</g>` +
    `<text x="${x + 190}" y="${y + 165}" font-size="150" text-anchor="middle" font-family="Apple Symbols, Arial, sans-serif" fill="#c00">${uni}</text>` +
    `<text x="${x + cell / 2}" y="${y + cell - 18}" font-size="20" text-anchor="middle" font-family="sans-serif" fill="#333">${key}  ${uni}</text>` +
    `<line x1="${x + cell / 2}" y1="${y + 25}" x2="${x + cell / 2}" y2="${y + cell - 55}" stroke="#ddd" stroke-width="1"/>`;
}).join("");

const W = cols * cell;
const H = Math.ceil(names.length / cols) * cell;
const gridSvg =
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
  `<rect width="100%" height="100%" fill="#fff"/>${cells}</svg>`;

fs.writeFileSync("/tmp/symbols_compare.svg", gridSvg);
sharp("/tmp/symbols_compare.svg").png().toFile("/tmp/symbols_compare.png").then(() => {
  console.log("saved /tmp/symbols_compare.png", W + "x" + H);
});
