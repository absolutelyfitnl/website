import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const absolute = (relativePath) => path.join(root, relativePath);
const read = (relativePath) => readFileSync(absolute(relativePath), "utf8");
const assertFile = (relativePath) => {
  assert.equal(existsSync(absolute(relativePath)), true, `Missing required file: ${relativePath}`);
  assert.equal(statSync(absolute(relativePath)).isFile(), true, `Expected a file: ${relativePath}`);
};
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const indexableStaticRoutes = [
  ["/", "app/page.tsx"],
  ["/sporten", "app/sporten/page.tsx"],
  ["/begeleiding", "app/begeleiding/page.tsx"],
  ["/abonnementen", "app/abonnementen/page.tsx"],
  ["/gratis-persoonlijke-intake", "app/gratis-persoonlijke-intake/page.tsx"],
  ["/personal-training", "app/personal-training/page.tsx"],
  ["/ooievaarspas", "app/ooievaarspas/page.tsx"],
  ["/rooster", "app/rooster/page.tsx"],
  ["/openingstijden", "app/openingstijden/page.tsx"],
  ["/over-ons", "app/over-ons/page.tsx"],
  ["/team", "app/team/page.tsx"],
  ["/topsport-en-ntc", "app/topsport-en-ntc/page.tsx"],
  ["/veelgestelde-vragen", "app/veelgestelde-vragen/page.tsx"],
  ["/in-de-media/rond-de-haven-2026", "app/in-de-media/rond-de-haven-2026/page.tsx"],
  ["/kennisbank", "app/kennisbank/page.tsx"],
  ["/contact", "app/contact/page.tsx"],
];

const memberRoutes = [
  "/ledenportaal", "/ledenportaal/training", "/ledenportaal/rooster", "/ledenportaal/lidmaatschap",
  "/ledenportaal/facturen", "/ledenportaal/berichten", "/ledenportaal/profiel",
];
const backofficeRoutes = [
  "/backoffice", "/backoffice/rooster", "/backoffice/leden", "/backoffice/trainers",
  "/backoffice/kennismakingen", "/backoffice/communicatie", "/backoffice/content", "/backoffice/instellingen",
];

test("canonical public, demo and application routes have page entrypoints", () => {
  assert.equal(indexableStaticRoutes.length, 16);
  for (const [route, file] of indexableStaticRoutes) {
    assertFile(file);
    assert.match(read(file), /export default\s+(?:async\s+)?function|export default\s+[A-Za-z_$]/, `${route} lacks a default page export`);
  }
  for (const [route, file] of [
    ["/sporten/[slug]", "app/sporten/[slug]/page.tsx"],
    ["/kennisbank/[slug]", "app/kennisbank/[slug]/page.tsx"],
    ["/blog", "app/blog/page.tsx"],
    ["/blog/[slug]", "app/blog/[slug]/page.tsx"],
    ["/mijn-eerste-bezoek", "app/mijn-eerste-bezoek/page.tsx"],
    ["/ledenapp", "app/ledenapp/page.tsx"],
    ["/inloggen", "app/inloggen/page.tsx"],
  ]) {
    assertFile(file);
    assert.match(read(file), /export default/, `${route} lacks a default page export`);
  }
  for (const route of memberRoutes) assertFile(`${route === "/ledenportaal" ? "app/ledenportaal" : `app${route}`}/page.tsx`);
  for (const route of backofficeRoutes) assertFile(`${route === "/backoffice" ? "app/backoffice" : `app${route}`}/page.tsx`);
});

test("homepage preserves its premium narrative and adds the confirmed content pillars", () => {
  const home = read("app/page.tsx");
  const orderedMarkers = [
    "ao-hero\"", "ao-benefit-bar", "ao-marquee", "ao-intro ao-shell", "ao-training ao-shell",
    "home-products", "<OoievaarspasCallout", "ao-visit-section", "ao-community", "ao-ecosystem",
    "ao-club-story", "home-trust-grid", "ao-journal", "home-practical", "ao-location",
  ];
  let cursor = -1;
  for (const marker of orderedMarkers) {
    const index = home.indexOf(marker);
    assert.ok(index > cursor, `Homepage marker is missing or out of order: ${marker}`);
    cursor = index;
  }
  assert.match(home, /href="\/gratis-persoonlijke-intake"/);
  assert.match(home, /<FirstVisitWizard compact/);
  assert.match(home, /<MemberAppDemo/);
  assert.match(home, /exerciseGymStructuredData/);
});

test("dynamic inventories, canonical redirects and metadata are coherent", () => {
  const programs = [...read("lib/site-data.ts").matchAll(/\{ slug: "([^"]+)", label:/g)].map((match) => match[1]);
  assert.deepEqual(programs, ["krachttraining", "cardio-conditie", "powerlifting-gewichtheffen", "personal-training", "strength-conditioning"]);
  const articleSlugs = [...read("lib/content/articles.ts").matchAll(/\n\s+slug: "([^"]+)",/g)].map((match) => match[1]);
  assert.equal(articleSlugs.length, 9);
  assert.equal(new Set(articleSlugs).size, articleSlugs.length);

  const programPage = read("app/sporten/[slug]/page.tsx");
  assert.match(programPage, /permanentRedirect\("\/personal-training"\)/);
  assert.match(programPage, /generateStaticParams/);
  assert.match(programPage, /notFound\(\)/);
  const articlePage = read("app/kennisbank/[slug]/page.tsx");
  assert.match(articlePage, /type:\s*"article"/);
  assert.match(articlePage, /publishedTime:\s*article\.publishedAt/);
  assert.match(articlePage, /notFound\(\)/);
  assert.match(read("app/blog/page.tsx"), /permanentRedirect\("\/kennisbank"\)/);
  assert.match(read("app/blog/[slug]/page.tsx"), /permanentRedirect\(`\/kennisbank\/\$\{slug\}`\)/);
  assert.match(read("app/mijn-eerste-bezoek/page.tsx"), /permanentRedirect\("\/gratis-persoonlijke-intake"\)/);
  const nextConfig = read("next.config.ts");
  for (const [source, destination] of [
    ["/mijn-eerste-bezoek", "/gratis-persoonlijke-intake"],
    ["/sporten/personal-training", "/personal-training"],
    ["/blog", "/kennisbank"],
    ["/blog/:slug", "/kennisbank/:slug"],
  ]) {
    assert.match(nextConfig, new RegExp(`source: ["']${escapeRegExp(source)}["'], destination: ["']${escapeRegExp(destination)}["'], permanent: true`));
  }
});

test("every indexable static page declares its own canonical metadata", () => {
  const titles = [];
  for (const [route, file] of indexableStaticRoutes) {
    const source = read(file);
    const call = source.match(/pageMetadata\(\s*["']([^"']+)["']\s*,\s*["']([^"']+)["']\s*,\s*["']([^"']+)["']/s);
    assert.ok(call, `${route} must use pageMetadata with literal title, description and canonical path`);
    assert.equal(call[3], route, `${route} has the wrong canonical path`);
    assert.ok(call[2].length >= 40, `${route} needs a useful description`);
    titles.push(call[1]);
  }
  assert.equal(new Set(titles).size, titles.length, "Indexable static page titles must be unique");
});

test("global SEO, sitemap and private-route indexing rules are present", () => {
  for (const file of ["app/robots.ts", "app/sitemap.ts", "app/not-found.tsx", "app/loading.tsx", "app/error.tsx", "lib/metadata.ts"]) assertFile(file);
  const layout = read("app/layout.tsx");
  assert.match(layout, /<html\s+lang=["']nl["']/);
  assert.match(layout, /metadataBase:\s*siteUrl/);
  const sitemap = read("app/sitemap.ts");
  for (const [route] of indexableStaticRoutes) assert.match(sitemap, new RegExp(`["']${escapeRegExp(route)}["']`), `sitemap.ts is missing ${route}`);
  assert.match(sitemap, /programs\.filter/);
  assert.match(sitemap, /articles\.map/);
  for (const excluded of ["/inloggen", "/ledenapp", "/ledenportaal", "/backoffice", "/blog", "/mijn-eerste-bezoek"]) {
    assert.doesNotMatch(sitemap, new RegExp(`["']${escapeRegExp(excluded)}["']`), `sitemap must exclude ${excluded}`);
  }
  const robots = read("app/robots.ts");
  for (const route of ["/inloggen", "/ledenapp", "/ledenportaal", "/backoffice"]) assert.match(robots, new RegExp(`["']${escapeRegExp(route)}["']`));
  for (const file of ["app/ledenportaal/layout.tsx", "app/backoffice/layout.tsx", "app/inloggen/page.tsx", "app/ledenapp/page.tsx"]) {
    assert.match(read(file), /privateRobots/, `${file} must be noindex,nofollow`);
  }
});

test("wizard and contact prefill remain customer-facing and keyboard-safe", () => {
  const wizard = read("components/first-visit-wizard.tsx");
  assert.match(wizard, /const emptyAnswers:\s*Answers\s*=\s*\{\s*goal:\s*null,\s*moment:\s*null,\s*guidance:\s*null\s*\}/);
  assert.match(wizard, /if \(!answers\[currentKey\]\) return/);
  assert.match(wizard, /disabled=\{!answers\[currentKey\]\}/);
  assert.match(wizard, /onderwerp=intake/);
  assert.match(wizard, /abonnement=/);
  assert.match(wizard, /Vraag je gratis intake aan/);
  assert.doesNotMatch(wizard, /je zit nergens aan vast/i);
  const form = read("components/contact-form.tsx");
  assert.match(form, /Bekijk contactmogelijkheden/);
  assert.match(form, /contact\.phoneHref/);
  assert.match(form, /contact\.email/);
  assert.match(form, /memberships\.map/);
  assert.match(form, /value="ooievaarspas"/);
  assert.doesNotMatch(form, /demo|demonstrati|prototype|fictie|alleen lokaal|niets verzonden|geen echte/i);
  assert.doesNotMatch(form, /\b(?:fetch|XMLHttpRequest|axios)\s*\(/);
});

test("portal and backoffice present customer-facing management copy", () => {
  const portal = read("components/member-portal.tsx");
  assert.match(portal, /Je bericht is verzonden/);
  assert.match(portal, /Je wijzigingen zijn opgeslagen/);
  assert.match(portal, /aria-label="QR-code vergroten"/);
  assert.doesNotMatch(portal, /uitsluitend fictieve gegevens|antwoord lokaal afgerond|profielwijzigingen alleen lokaal opgeslagen|Demo verlaten|Demo-profiel/i);
  const backoffice = read("components/backoffice-app.tsx");
  const schedule = read("components/backoffice-schedule.tsx");
  assert.match(backoffice, /Beheer de planning, intakeaanvragen en ledencommunicatie/);
  assert.match(schedule, /Wijzigingen publiceren/);
  assert.doesNotMatch(backoffice + "\n" + schedule, /Er worden geen echte berichten of betalingen verwerkt|live website is niet gewijzigd|Demo verlaten|admin-demo-banner/i);
  assert.doesNotMatch(backoffice, /"Pauze"/);
});

test("schedule persistence is defensive and time bounds come from central club data", () => {
  const storage = read("lib/schedule-storage.ts");
  const version = Number(storage.match(/SCHEDULE_SCHEMA_VERSION\s*=\s*(\d+)/)?.[1]);
  assert.ok(Number.isInteger(version) && version >= 2);
  assert.match(storage, /openingDays, openingHours/);
  assert.match(storage, /value\.events\.every\(isScheduleEvent\)/);
  assert.match(storage, /duplicate schedule id/);
  assert.match(storage, /changedIds\.has\(event\.id\)/);
  assert.match(storage, /visibility\s*===\s*["']public["']/);
  const backoffice = read("components/backoffice-schedule.tsx");
  assert.match(backoffice, /startsForDay/);
  assert.match(backoffice, /clampStart/);
  assert.match(backoffice, /calendarStart = 7/);
  assert.match(backoffice, /localStorage\.setItem\(PUBLISHED_STORAGE_KEY/);
  assert.match(backoffice, /disabled=\{!changes\.count\}/);
  for (const file of ["components/public-schedule.tsx", "components/member-portal.tsx"]) {
    assert.match(read(file), /localStorage\.getItem\(PUBLISHED_STORAGE_KEY\)/);
    assert.match(read(file), /SCHEDULE_PUBLISHED_EVENT/);
  }
});

test("proprietary fonts and source-hosting infrastructure are not shipped", () => {
  for (const file of [".openai/hosting.json", "app/chatgpt-auth.ts", "drizzle.config.ts", "vite.config.ts", ".sites-runtime", ".wrangler"]) {
    assert.equal(existsSync(absolute(file)), false, `Source-only infrastructure must not ship: ${file}`);
  }
  const files = [];
  const visit = (relativePath) => {
    if (!existsSync(absolute(relativePath))) return;
    for (const entry of readdirSync(absolute(relativePath), { withFileTypes: true })) {
      const child = path.join(relativePath, entry.name);
      if (entry.isDirectory()) visit(child); else files.push(child);
    }
  };
  for (const scanRoot of ["app", "components", "lib", "public", "scripts"]) visit(scanRoot);
  assert.deepEqual(files.filter((file) => /\.(?:eot|otf|ttf|woff2?)$/i.test(file)), []);
  const combined = files.filter((file) => /\.(?:css|js|mjs|ts|tsx|json|svg)$/i.test(file)).map(read).join("\n");
  assert.doesNotMatch(combined, /nimbus/i);
  assert.doesNotMatch(combined, /@font-face/i);
});
