import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const directory = path.resolve("site/dist");
const referenceOrigin = "https://absolutely-fit-design-showcase.dgwebserv.chatgpt.site";
const production = process.env.APP_ENVIRONMENT === "production";
if (production && !process.env.NEXT_PUBLIC_SITE_URL) throw new Error("Production requires NEXT_PUBLIC_SITE_URL");
const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
if (!["http:", "https:"].includes(origin.protocol) || origin.username || origin.password || origin.pathname !== "/" || origin.search || origin.hash) {
  throw new Error("NEXT_PUBLIC_SITE_URL must be a plain HTTP(S) origin");
}
if (production && origin.protocol !== "https:") throw new Error("Production requires HTTPS");
const pages = JSON.parse(await readFile("site/src/content/page-manifest.json", "utf8"));
const aliases = JSON.parse(await readFile("tests/reference/redirects.json", "utf8"));
for (const page of pages) {
  const file = path.join(directory, page.path, "index.html");
  const original = await readFile(file, "utf8");
  const robots = production && page.path !== "/ledenapp" ? "index,follow" : "noindex,follow";
  const updated = original.replace(/<head>([\s\S]*?)<\/head>/, (_, head) => `<head>${head.replaceAll(referenceOrigin, origin.origin).replace('<meta name="robots" content="noindex,follow">', `<meta name="robots" content="${robots}">`)}</head>`);
  await writeFile(file, updated);
}
const sitemap = await readFile(path.join(directory, "sitemap.xml"), "utf8");
await writeFile(path.join(directory, "sitemap.xml"), sitemap.replaceAll(referenceOrigin, origin.origin));
await writeFile(path.join(directory, "robots.txt"), production
  ? `User-agent: *\nDisallow: /ledenapp/\nDisallow: /inloggen/\nDisallow: /ledenportaal/\nDisallow: /backoffice/\nSitemap: ${origin.origin}/sitemap.xml\n`
  : "User-agent: *\nDisallow: /\n");
// Aliases are served as HTTP redirects; their meta-refresh documents never ship.
for (const alias of aliases) {
  const { rm } = await import("node:fs/promises");
  await rm(path.join(directory, alias.from, "index.html"), { force: true });
}
console.log(`Prepared Sites metadata for ${production ? "public production" : "private preview"} at ${origin.origin}`);
