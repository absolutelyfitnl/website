import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import pages from "../../site/src/content/page-manifest.json";
import redirects from "../../tests/reference/redirects.json";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const root = path.join(process.cwd(), "site", "dist");
const routes = new Set(pages.map((page) => page.path));
const aliases = new Map(redirects.map((redirect) => [redirect.from, redirect.to]));
const mime: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

async function serve(request: Request) {
  const url = new URL(request.url);
  let pathname: string;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return new Response(null, { status: 400 });
  }
  const segments = pathname.split("/");
  if (segments.some((part) => part === "." || part === ".." || part.startsWith(".")) || /[\\\0]/.test(pathname)) {
    return new Response(null, { status: 404 });
  }
  const route = pathname.replace(/\/$/, "") || "/";
  const canonical = route === "/" ? "/" : `${route}/`;
  const alias = aliases.get(canonical);
  if (alias || (routes.has(route) && pathname !== canonical)) {
    return new Response(null, {
      status: 308,
      headers: { location: `${alias || canonical}${url.search}`, "cache-control": "no-store" },
    });
  }

  let file = "404.html";
  let status = 404;
  if (routes.has(route)) {
    file = `${route === "/" ? "" : route.slice(1) + "/"}index.html`;
    status = 200;
  } else if (pathname === "/robots.txt" || pathname === "/sitemap.xml") {
    file = pathname.slice(1);
    status = 200;
  } else if (pathname.startsWith("/assets/") && mime[path.extname(pathname)] && !pathname.endsWith("/")) {
    file = pathname.slice(1);
    status = 200;
  }

  let bytes;
  try {
    bytes = await readFile(path.join(root, file));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    bytes = await readFile(path.join(root, "404.html"));
    file = "404.html";
    status = 404;
  }
  const headers: Record<string, string> = {
    "content-type": mime[path.extname(file)],
    "x-content-type-options": "nosniff",
    "cache-control": status === 404 ? "no-store" : "public, max-age=0, must-revalidate",
    etag: `"${createHash("sha256").update(bytes).digest("hex")}"`,
  };
  if (status === 404 || route === "/ledenapp") headers["x-robots-tag"] = "noindex, follow";
  if (status === 200 && request.headers.get("if-none-match") === headers.etag) {
    return new Response(null, { status: 304, headers });
  }
  return new Response(request.method === "HEAD" ? null : new Uint8Array(bytes), { status, headers });
}

export const GET = serve;
export const HEAD = serve;
