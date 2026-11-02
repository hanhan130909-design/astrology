import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AstroSymbol } from "../src/components/AstroSymbol";
import fs from "fs";
import sharp from "sharp";

const names = [
  "Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "North_Node",
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const SIZE = 120;
const results: Array<{ n: string; w: number; h: number; cx: number; cy: number }> = [];

async function main() {
for (const n of names) {
  const inner = renderToStaticMarkup(React.createElement(AstroSymbol, { name: n, size: SIZE, color: "#000" }));
  // 给AstroSymbol的svg加xmlns，作为独立SVG渲染
  const svg = inner.replace("<svg", `<svg xmlns="http://www.w3.org/2000/svg"`);
  const file = `/tmp/sym_${n.replace(/\s/g, "_")}.png`;
  await sharp(Buffer.from(svg)).png().toFile(file);
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  let minX = w, minY = h, maxX = -1, maxY = -1, sumX = 0, sumY = 0, cnt = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * info.channels;
      // 用alpha判断：透明背景alpha=0，符号线条alpha高
      const a = data[i + 3];
      if (a > 128) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        sumX += x; sumY += y; cnt++;
      }
    }
  }
  const bw = maxX - minX + 1;
  const bh = maxY - minY + 1;
  results.push({
    n,
    w: +(bw / SIZE).toFixed(3),
    h: +(bh / SIZE).toFixed(3),
    cx: cnt ? +((sumX / cnt - SIZE / 2) / SIZE).toFixed(3) : 0,
    cy: cnt ? +((sumY / cnt - SIZE / 2) / SIZE).toFixed(3) : 0,
  });
}

console.log("name".padEnd(14), "W%", "H%", "cX", "cY");
for (const r of results) {
  console.log(r.n.padEnd(14), r.w.toFixed(3), r.h.toFixed(3), r.cx.toFixed(3), r.cy.toFixed(3));
}
}
main();
