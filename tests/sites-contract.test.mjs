import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (file) => readFileSync(file, "utf8");
const pages = JSON.parse(read("site/src/content/page-manifest.json"));

test("public route inventory includes all nine articles and the future member page", () => {
  assert.equal(pages.length, 30);
  assert.equal(pages.filter((page) => page.article).length, 9);
  assert.equal(new Set(pages.map((page) => page.path)).size, 30);
  assert.ok(pages.some((page) => page.path === "/ledenapp"));
  const articles = JSON.parse(read("site/src/content/articles.json"));
  assert.equal(articles.length, 9);
  assert.equal(articles.reduce((sum, article) => sum + article.sections.length, 0), 28);
});

test("the owner publication record remains available without enabling certification claims", () => {
  const approvals = JSON.parse(read("docs/publication-approvals.json"));
  assert.equal(approvals.nocNsfLogoLicenseConfirmed, true);
  assert.equal(approvals.nocNsfEditorialContextApproved, true);
  assert.equal(approvals.historicPerformanceClaimsApproved, true);
  assert.equal(approvals.nocNsfCertificationAdvertisingApproved, false);
});

test("legacy routes retain twelve public aliases and two member references", () => {
  const redirects = JSON.parse(read("tests/reference/redirects.json"));
  assert.equal(redirects.filter((route) => route.type === "public").length, 12);
  assert.equal(redirects.filter((route) => route.type === "members").length, 2);
  for (const redirect of redirects) assert.ok(pages.some((page) => (page.path === "/" ? "/" : page.path + "/") === redirect.to));
});

test("source contact only prepares mail and the member page remains future information", () => {
  const script = read("site/dist/assets/practical.js");
  assert.doesNotMatch(script, /\b(?:fetch|XMLHttpRequest|axios)\s*\(/);
  assert.match(script, /mailto:info@absolutely-fit\.nl/);
  assert.match(read("site/dist/ledenapp/index.html"), /nog geen actieve account- of boekingsfunctie/);
});
