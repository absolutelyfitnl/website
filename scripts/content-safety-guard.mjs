import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { protectedCredentialClaimPatterns } from "./content-safety-rules.mjs";

const dist = path.resolve(process.argv[2] || "site/dist");
const reference = JSON.parse(readFileSync("tests/reference/broncode-sha256.json", "utf8"));
const bodies = JSON.parse(readFileSync("tests/reference/body-sha256.json", "utf8"));
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const assets = reference.files.filter((file) => file.path.startsWith("dist/assets/"));
for (const asset of assets) {
  const bytes = readFileSync(path.join(dist, asset.path.slice(5)));
  assert.equal(bytes.length, asset.bytes, `Asset size changed: ${asset.path}`);
  assert.equal(digest(bytes), asset.sha256, `Asset bytes changed: ${asset.path}`);
}
for (const source of reference.files.filter((file) => file.path.startsWith("src/") || ["package.json", "package-lock.json"].includes(file.path))) {
  assert.equal(digest(readFileSync(path.join("site", source.path))), source.sha256, `Sites source changed: ${source.path}`);
}
const walk = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const files = walk(dist);
const notFound = reference.files.find((file) => file.path === "dist/404.html");
assert.equal(digest(readFileSync(path.join(dist, "404.html"))), notFound.sha256, "Original 404 page changed");
assert.equal(files.filter((file) => /\.(png|jpg|jpeg|webp|avif|gif)$/i.test(file)).length, 10);
assert.equal(files.filter((file) => file.endsWith(".woff2")).length, 28);
assert.deepEqual(files.filter((file) => file.includes(`${path.sep}assets${path.sep}`)).map((file) => path.relative(dist, file).split(path.sep).join("/")).sort(), assets.map((file) => file.path.slice(5)).sort());
for (const [route, hash] of Object.entries(bodies.pages)) {
  const html = readFileSync(path.join(dist, route, "index.html"), "utf8");
  const body = html.match(/<body\b[^>]*>.*?<\/body\s*>/is)?.[0];
  assert.ok(body, `Missing body: ${route}`);
  assert.equal(digest(body), hash, `Visible DOM changed: ${route}`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `Expected one H1: ${route}`);
  for (const pattern of protectedCredentialClaimPatterns) assert.equal(pattern.test(body), false, `Unapproved credential claim on ${route}`);
  for (const chunk of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    const data = JSON.parse(chunk[1]);
    assert.doesNotMatch(JSON.stringify(data), /"(?:award|credential|affiliation)"/);
  }
}
for (const retired of ["components", "lib/demo-data.ts", "app/backoffice", "app/ledenportaal", ".openai/hosting.json"]) assert.equal(existsSync(retired), false, `Retired implementation present: ${retired}`);
assert.equal(Object.keys(bodies.pages).length, 30);
console.log(`Sites contract passed: 30 identical bodies, ${assets.length} identical assets, 10 photos, 28 fonts and unchanged generator/modules/dependency lock.`);
