import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AstroSymbol } from "../src/components/AstroSymbol";

const names = [
  "Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "North_Node",
  "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓",
  "☉", "☽", "☿", "♀", "♂", "♃", "♄", "♅", "♆", "☊",
];

let allOk = true;
for (const n of names) {
  const html = renderToStaticMarkup(
    React.createElement(AstroSymbol, { name: n, size: 20, color: "#000" })
  );
  const hasShape = html.includes("<path") || html.includes("<circle");
  const hasViewBox = html.includes('viewBox="0 0 24 24"');
  const ok = hasShape && hasViewBox && html.length > 40;
  if (!ok) allOk = false;
  console.log(
    n.padEnd(12),
    ok ? "OK " : "FAIL",
    "len=" + html.length,
    "path=" + (html.includes("<path") ? "y" : "n"),
    "circle=" + (html.includes("<circle") ? "y" : "n"),
    "viewBox=" + (hasViewBox ? "y" : "n")
  );
}
console.log("\nRESULT:", allOk ? "ALL 22 SYMBOLS RENDER OK" : "SOME FAILED");
