import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AstroSymbol } from "../src/components/AstroSymbol";
import fs from "fs";
import sharp from "sharp";

const names = [
  "Sun", "Moon", "Mercury", "Venus", "Mars",
  "Jupiter", "Saturn", "Uranus", "Neptune", "North_Node",
  "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓",
];

const cell = 240;
const cols = 4;
const cells = names.map((n, i) => {
  const svg = renderToStaticMarkup(
    React.createElement(AstroSymbol, { name: n, size: 200, color: "#000" })
  );
  const col = i % cols;
  const row = Math.floor(i / cols);
  const x = col * cell;
  const y = row * cell;
  return `<g transform="translate(${x + 25} ${y + 25})">${svg}</g>` +
    `<text x="${x + cell / 2}" y="${y + cell - 15}" font-size="18" text-anchor="middle" font-family="sans-serif" fill="#333">${n}</text>`;
}).join("");

const W = cols * cell;
const H = Math.ceil(names.length / cols) * cell;
const gridSvg =
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
  `<rect width="100%" height="100%" fill="#fff"/>${cells}</svg>`;

fs.writeFileSync("/tmp/symbols.svg", gridSvg);
sharp("/tmp/symbols.svg").png().toFile("/tmp/symbols.png").then(() => {
  console.log("saved /tmp/symbols.png", W + "x" + H);
});
