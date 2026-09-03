import type { MetadataRoute } from "next";
import { posts, programs } from "@/lib/site-data";
import { siteUrl } from "@/lib/metadata";

const staticRoutes = ["/", "/sporten", "/begeleiding", "/abonnementen", "/rooster", "/over-ons", "/blog", "/contact", "/ledenapp", "/mijn-eerste-bezoek"];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    ...staticRoutes,
    ...programs.map((program) => `/sporten/${program.slug}`),
    ...posts.map((post) => `/blog/${post.slug}`),
  ];
  return routes.map((path) => ({ url: new URL(path, siteUrl).toString(), changeFrequency: path === "/" ? "weekly" : "monthly", priority: path === "/" ? 1 : .7 }));
}
