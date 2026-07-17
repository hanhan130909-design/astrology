import assert from "node:assert/strict";
import fs from "node:fs";

const cssPath = "src/app/natal/natal-mobile.css";
const pagePath = "src/app/natal/page.tsx";
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

assert.equal(
  packageJson.scripts?.["test:natal-mobile"],
  "node scripts/test-natal-mobile-css.mjs",
);
assert.ok(fs.existsSync(cssPath), "natal-mobile.css must exist");

const css = fs.readFileSync(cssPath, "utf8");
const page = fs.readFileSync(pagePath, "utf8");
assert.match(page, /import\s+["']\.\/natal-mobile\.css["']/);
assert.match(css, /@media\s*\(max-width:\s*767px\)/);
assert.doesNotMatch(css.replace(/\/\*[\s\S]*?\*\//g, "").trim(), /^(?!@media)/);
assert.match(css, /#rightsidebar\s*\{[^}]*order:\s*1/s);
assert.match(css, /#natalmain\s*\{[^}]*order:\s*2/s);
assert.match(css, /#chartwrap\s*\{[^}]*flex-direction:\s*column/s);
assert.match(css, /#chart\s+svg\s*\{[^}]*width:\s*min\(100%,\s*520px\)/s);
assert.match(css, /#aspgrid[^}]*overflow-x:\s*auto/s);
assert.match(css, /\.alm-panel[^}]*overflow-x:\s*auto/s);
assert.match(css, /\.alm-table[^}]*min-width:\s*700px/s);
assert.match(css, /\.natal-page-shell[^}]*overflow-x:\s*(?:clip|hidden)/s);

const mediaBody = css.slice(css.indexOf("@media"));
assert.doesNotMatch(mediaBody, /#rightsidebar\s*\{[^}]*position:\s*fixed/s);
assert.doesNotMatch(css, /@media\s*\(min-width:/);

console.log("Natal mobile CSS tests passed");
