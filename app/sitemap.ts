import type { MetadataRoute } from "next";
import { articles } from "@/lib/content/articles";
import { programs } from "@/lib/site-data";
import { siteUrl } from "@/lib/metadata";

export const indexableStaticRoutes = [
  "/",
  "/sporten",
  "/begeleiding",
  "/abonnementen",
  "/gratis-persoonlijke-intake",
  "/personal-training",
  "/ooievaarspas",
  "/rooster",
  "/openingstijden",
  "/over-ons",
  "/team",
  "/topsport-en-ntc",
  "/veelgestelde-vragen",
  "/in-de-media/rond-de-haven-2026",
  "/kennisbank",
  "/contact",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    ...indexableStaticRoutes,
    ...programs.filter((program) => program.slug !== "personal-training").map((program) => `/sporten/${program.slug}`),
    ...articles.map((article) => `/kennisbank/${article.slug}`),
  ];
  return routes.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: path === "/" || path === "/kennisbank" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/gratis-persoonlijke-intake" ? .9 : .7,
  }));
}
