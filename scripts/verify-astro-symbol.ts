import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AstroSymbol } from "../src/components/AstroSymbol";

const names = [
  "Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "North_Node",
  "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓",
  "☉", "☽", "☿", "♀", "♂", "♃", "♄", "♅", "♆", "☊",
];

let allOk = true;
for (const n of names) {
  const html = renderToStaticMarkup(
    React.createElement(AstroSymbol, { name: n, size: 20, color: "#000" })
  );
  const hasText = html.includes("<text") && html.includes("</text>");
  const hasViewBox = html.includes('viewBox="0 0 24 24"');
  const ok = hasText && hasViewBox && html.length > 40;
  if (!ok) allOk = false;
  console.log(
    n.padEnd(12),
    ok ? "OK " : "FAIL",
    "len=" + html.length,
    "text=" + (hasText ? "y" : "n"),
    "viewBox=" + (hasViewBox ? "y" : "n")
  );
}
console.log("\nRESULT:", allOk ? "ALL SYMBOLS RENDER OK (Unicode)" : "SOME FAILED");
