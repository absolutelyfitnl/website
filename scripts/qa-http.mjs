import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const base = process.env.BASE_URL || "http://127.0.0.1:3000";
const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const production = process.env.APP_ENVIRONMENT === "production";
const reference = JSON.parse(await readFile("tests/reference/broncode-sha256.json", "utf8"));
const bodies = JSON.parse(await readFile("tests/reference/body-sha256.json", "utf8"));
const aliases = JSON.parse(await readFile("tests/reference/redirects.json", "utf8"));
const digest = (value) => createHash("sha256").update(value).digest("hex");
const get = (route, options) => fetch(base + route, { redirect: "manual", ...options });
const notFound = reference.files.find((file) => file.path === "dist/404.html");
for (const [route, expected] of Object.entries(bodies.pages)) {
  const canonical = route === "/" ? "/" : route + "/";
  const response = await get(canonical);
  assert.equal(response.status, 200, canonical);
  assert.match(response.headers.get("content-type"), /text\/html/);
  const html = await response.text();
  assert.equal(digest(html.match(/<body\b[^>]*>.*?<\/body\s*>/is)?.[0] || ""), expected, `HTTP DOM changed: ${route}`);
  assert.ok(html.includes(`<link rel="canonical" href="${origin}${canonical}">`), `Canonical: ${route}`);
  const robots = production && route !== "/ledenapp" ? "index,follow" : "noindex,follow";
  assert.ok(html.includes(`<meta name="robots" content="${robots}">`), `Indexing: ${route}`);
  assert.equal(html.includes("chatgpt.site"), false, `Sites origin leaked: ${route}`);
  if (route !== "/") {
    const redirect = await get(route + "?doel=sterker&abonnement=unlimited");
    assert.equal(redirect.status, 308);
    assert.equal(new URL(redirect.headers.get("location"), base).pathname + new URL(redirect.headers.get("location"), base).search, canonical + "?doel=sterker&abonnement=unlimited");
  }
}
const mime = { ".css": "text/css", ".js": "text/javascript", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".webp": "image/webp" };
const assets = reference.files.filter((file) => file.path.startsWith("dist/assets/"));
for (const file of assets) {
  const route = "/" + file.path.slice(5);
  const response = await get(route);
  assert.equal(response.status, 200, route);
  assert.equal(digest(new Uint8Array(await response.arrayBuffer())), file.sha256, `HTTP asset: ${route}`);
  assert.ok(response.headers.get("content-type").startsWith(mime[route.slice(route.lastIndexOf("."))]), route);
  assert.match(response.headers.get("cache-control"), /must-revalidate/);
}
for (const alias of aliases) {
  for (const from of [alias.from, alias.from.replace(/\/$/, "")]) {
    const query = "?onderwerp=intake&abonnement=unlimited&doel=sterker&ervaring=ervaren";
    const response = await get(from + query);
    assert.ok([301, 308].includes(response.status), from);
    const location = new URL(response.headers.get("location"), base);
    assert.equal(location.pathname + location.search, alias.to + query, from);
  }
}
for (const route of ["/ontbrekende-pagina/", "/backoffice", "/backoffice/leden", "/backoffice/rooster", "/backoffice/trainers", "/backoffice/communicatie", "/backoffice/content", "/backoffice/instellingen", "/backoffice/kennismakingen", "/ledenportaal/profiel", "/ledenportaal/facturen", "/ledenportaal/rooster", "/ledenportaal/training", "/ledenportaal/berichten", "/ledenportaal/lidmaatschap", "/assets/missing.jpg", "/blog/unknown/", "/site/src/build.mjs", "/.env", "/api/unknown"]) {
  const response = await get(route);
  assert.equal(response.status, 404, route);
  if (route !== "/.env") assert.equal(digest(await response.text()), notFound.sha256, `Original HTTP 404 body: ${route}`);
}
const sitemap = await get("/sitemap.xml");
assert.equal(sitemap.status, 200);
const locations = [...(await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.deepEqual(locations.sort(), Object.keys(bodies.pages).filter((route) => route !== "/ledenapp").map((route) => origin + (route === "/" ? "/" : route + "/")).sort());
const robots = await (await get("/robots.txt")).text();
if (production) {
  assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
  assert.equal(/^Disallow: \/$/m.test(robots), false);
} else assert.match(robots, /^Disallow: \/$/m);
const asset = await get("/assets/site.css");
assert.equal((await get("/assets/site.css", { headers: { "if-none-match": asset.headers.get("etag") } })).status, 304);
const head = await get("/", { method: "HEAD" });
assert.equal(head.status, 200);
assert.equal(await head.text(), "");
const health = await get("/api/health");
assert.equal(health.status, 200);
assert.equal(health.headers.get("cache-control"), "no-store");
assert.deepEqual(await health.json(), { status: "ok", service: "absolutely-fit", revision: process.env.APP_REVISION || "development", environment: process.env.APP_ENVIRONMENT || "development" });
console.log(`HTTP passed at ${base}: 30 exact pages, ${assets.length} exact assets/MIME, 14 redirects/query preservation, retired routes/404, sitemap/robots/SEO, cache/HEAD and exact health SHA.`);
