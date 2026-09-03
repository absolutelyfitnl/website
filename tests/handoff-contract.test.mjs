import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

function absolute(relativePath) {
  return path.join(root, relativePath);
}

function read(relativePath) {
  return readFileSync(absolute(relativePath), "utf8");
}

function assertFile(relativePath) {
  assert.equal(existsSync(absolute(relativePath)), true, `Missing required file: ${relativePath}`);
  assert.equal(statSync(absolute(relativePath)).isFile(), true, `Expected a file: ${relativePath}`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function slugsFromExport(source, exportName, nextExportName) {
  const end = nextExportName ? `(?=export const ${escapeRegExp(nextExportName)}\\s*=)` : "$";
  const block = source.match(new RegExp(`export const ${escapeRegExp(exportName)}\\s*=\\s*\\[([\\s\\S]*?)\\];\\s*${end}`));
  assert.ok(block, `Could not read ${exportName} from lib/site-data.ts`);
  return [...block[1].matchAll(/\bslug:\s*["']([^"']+)["']/g)].map((match) => match[1]);
}

const publicRoutes = [
  ["/", "app/page.tsx"],
  ["/sporten", "app/sporten/page.tsx"],
  ["/sporten/krachttraining", "app/sporten/[slug]/page.tsx"],
  ["/sporten/cardio-conditie", "app/sporten/[slug]/page.tsx"],
  ["/sporten/powerlifting-gewichtheffen", "app/sporten/[slug]/page.tsx"],
  ["/sporten/personal-training", "app/sporten/[slug]/page.tsx"],
  ["/sporten/strength-conditioning", "app/sporten/[slug]/page.tsx"],
  ["/begeleiding", "app/begeleiding/page.tsx"],
  ["/abonnementen", "app/abonnementen/page.tsx"],
  ["/rooster", "app/rooster/page.tsx"],
  ["/over-ons", "app/over-ons/page.tsx"],
  ["/blog", "app/blog/page.tsx"],
  ["/blog/sterker-worden-begint-met-techniek", "app/blog/[slug]/page.tsx"],
  ["/blog/waarom-herstel-bij-training-hoort", "app/blog/[slug]/page.tsx"],
  ["/blog/zo-bouw-je-een-trainingsschema-op", "app/blog/[slug]/page.tsx"],
  ["/contact", "app/contact/page.tsx"],
  ["/ledenapp", "app/ledenapp/page.tsx"],
  ["/mijn-eerste-bezoek", "app/mijn-eerste-bezoek/page.tsx"],
  ["/inloggen", "app/inloggen/page.tsx"],
];

const memberRoutes = [
  ["/ledenportaal", "app/ledenportaal/page.tsx"],
  ["/ledenportaal/training", "app/ledenportaal/training/page.tsx"],
  ["/ledenportaal/rooster", "app/ledenportaal/rooster/page.tsx"],
  ["/ledenportaal/lidmaatschap", "app/ledenportaal/lidmaatschap/page.tsx"],
  ["/ledenportaal/facturen", "app/ledenportaal/facturen/page.tsx"],
  ["/ledenportaal/berichten", "app/ledenportaal/berichten/page.tsx"],
  ["/ledenportaal/profiel", "app/ledenportaal/profiel/page.tsx"],
];

const backofficeRoutes = [
  ["/backoffice", "app/backoffice/page.tsx"],
  ["/backoffice/rooster", "app/backoffice/rooster/page.tsx"],
  ["/backoffice/leden", "app/backoffice/leden/page.tsx"],
  ["/backoffice/trainers", "app/backoffice/trainers/page.tsx"],
  ["/backoffice/kennismakingen", "app/backoffice/kennismakingen/page.tsx"],
  ["/backoffice/communicatie", "app/backoffice/communicatie/page.tsx"],
  ["/backoffice/content", "app/backoffice/content/page.tsx"],
  ["/backoffice/instellingen", "app/backoffice/instellingen/page.tsx"],
];

test("the complete 19 + 7 + 8 route contract has page entrypoints", () => {
  assert.equal(publicRoutes.length, 19);
  assert.equal(memberRoutes.length, 7);
  assert.equal(backofficeRoutes.length, 8);

  const routes = [...publicRoutes, ...memberRoutes, ...backofficeRoutes];
  assert.equal(routes.length, 34);
  assert.equal(new Set(routes.map(([route]) => route)).size, 34, "Concrete routes must be unique");
  for (const [route, relativePath] of routes) {
    assertFile(relativePath);
    assert.match(read(relativePath), /export default\s+(?:async\s+)?function|export default\s+[A-Za-z_$]/, `${route} lacks a default page export`);
  }
});

test("homepage contains the complete ordered visual narrative", () => {
  const home = read("app/page.tsx");
  const orderedMarkers = [
    "ao-hero\"",
    "ao-benefit-bar",
    "ao-marquee",
    "ao-intro ao-shell",
    "ao-training ao-shell",
    "ao-program-photo",
    "ao-visit-section",
    "ao-community",
    "ao-ecosystem",
    "ao-club-story",
    "ao-heritage",
    "ao-journal",
    "ao-location",
  ];
  let cursor = -1;
  for (const marker of orderedMarkers) {
    const index = home.indexOf(marker);
    assert.ok(index > cursor, `Homepage marker is missing or out of order: ${marker}`);
    cursor = index;
  }
  assert.match(home, /href="\/mijn-eerste-bezoek"/);
  assert.match(home, /<FirstVisitWizard compact/);
  assert.match(home, /<MemberAppDemo/);
});

test("dynamic program and article inventories exactly cover their concrete routes", () => {
  const siteData = read("lib/site-data.ts");
  assert.deepEqual(slugsFromExport(siteData, "programs", "posts"), [
    "krachttraining",
    "cardio-conditie",
    "powerlifting-gewichtheffen",
    "personal-training",
    "strength-conditioning",
  ]);
  assert.deepEqual(slugsFromExport(siteData, "posts", "contact"), [
    "sterker-worden-begint-met-techniek",
    "waarom-herstel-bij-training-hoort",
    "zo-bouw-je-een-trainingsschema-op",
  ]);

  for (const relativePath of ["app/sporten/[slug]/page.tsx", "app/blog/[slug]/page.tsx"]) {
    const source = read(relativePath);
    assert.match(source, /generateStaticParams/);
    assert.match(source, /generateMetadata/);
    assert.match(source, /notFound\(\)/, `${relativePath} must reject unknown slugs`);
  }
});

test("every indexable page declares route-specific canonical metadata", () => {
  const staticMetadata = publicRoutes.filter(([route]) => route !== "/inloggen" && !route.startsWith("/sporten/") && !route.startsWith("/blog/"));
  const titles = [];

  for (const [route, relativePath] of staticMetadata) {
    const source = read(relativePath);
    const call = source.match(/pageMetadata\(\s*["']([^"']+)["']\s*,\s*["']([^"']+)["']\s*,\s*["']([^"']+)["']\s*\)/);
    assert.ok(call, `${route} must use pageMetadata with literal title, description and canonical path`);
    assert.equal(call[3], route, `${route} has the wrong canonical path`);
    assert.ok(call[1].trim().length >= 3, `${route} needs a useful title`);
    assert.ok(call[2].trim().length >= 40, `${route} needs a useful description`);
    titles.push(call[1]);
  }
  assert.equal(new Set(titles).size, titles.length, "Static public page titles must be unique");

  const programPage = read("app/sporten/[slug]/page.tsx");
  const articlePage = read("app/blog/[slug]/page.tsx");
  assert.match(programPage, /pageMetadata\(program\.label,\s*program\.intro,\s*`\/sporten\/\$\{program\.slug\}`\)/);
  assert.match(articlePage, /pageMetadata\(post\.title,\s*post\.intro,\s*`\/blog\/\$\{post\.slug\}`\)/);
});

test("global SEO, recovery states, sitemap and private-route indexing rules are present", () => {
  for (const relativePath of ["app/robots.ts", "app/sitemap.ts", "app/not-found.tsx", "app/loading.tsx", "app/error.tsx", "lib/metadata.ts"]) {
    assertFile(relativePath);
  }

  const layout = read("app/layout.tsx");
  assert.match(layout, /<html\s+lang=["']nl["']/);
  assert.match(layout, /template:\s*["']%s \| Absolutely Fit["']/);
  assert.match(layout, /metadataBase:\s*siteUrl/);
  assert.match(layout, /openGraph:/);
  assert.match(layout, /twitter:/);

  const metadata = read("lib/metadata.ts");
  assert.match(metadata, /alternates:\s*\{\s*canonical:\s*path\s*\}/);
  assert.match(metadata, /index:\s*false/);
  assert.match(metadata, /follow:\s*false/);
  assert.match(metadata, /nocache:\s*true/);

  const robots = read("app/robots.ts");
  for (const route of ["/inloggen", "/ledenportaal", "/backoffice"]) {
    assert.match(robots, new RegExp(`["']${escapeRegExp(route)}["']`), `robots.ts must disallow ${route}`);
  }
  assert.match(robots, /sitemap:/);

  const sitemap = read("app/sitemap.ts");
  const indexableStaticRoutes = ["/", "/sporten", "/begeleiding", "/abonnementen", "/rooster", "/over-ons", "/blog", "/contact", "/ledenapp", "/mijn-eerste-bezoek"];
  for (const route of indexableStaticRoutes) {
    assert.match(sitemap, new RegExp(`["']${escapeRegExp(route)}["']`), `sitemap.ts is missing ${route}`);
  }
  assert.match(sitemap, /programs\.map/);
  assert.match(sitemap, /posts\.map/);
  assert.doesNotMatch(sitemap, /["']\/(?:inloggen|ledenportaal|backoffice)(?:\/[^"']*)?["']/);

  for (const relativePath of ["app/ledenportaal/layout.tsx", "app/backoffice/layout.tsx", "app/inloggen/page.tsx"]) {
    assert.match(read(relativePath), /robots:\s*privateRobots/, `${relativePath} must be noindex,nofollow`);
  }

  assert.match(read("app/not-found.tsx"), /404/);
  assert.match(read("app/not-found.tsx"), /href=["']\/["']/);
  assert.match(read("app/not-found.tsx"), /href=["']\/sporten["']/);
  assert.match(read("app/not-found.tsx"), /href=["']\/contact["']/);
  assert.match(read("app/loading.tsx"), /aria-busy=["']true["']/);
  assert.match(read("app/error.tsx"), /onClick=\{reset\}/);
});

test("wizard and training route start without hidden answers and block incomplete progress", () => {
  const firstVisit = read("components/first-visit-wizard.tsx");
  assert.match(firstVisit, /const emptyAnswers:\s*Answers\s*=\s*\{\s*goal:\s*null,\s*moment:\s*null,\s*guidance:\s*null\s*\}/);
  assert.match(firstVisit, /if\s*\(!answers\[currentKey\]\)\s*return/);
  assert.match(firstVisit, /disabled=\{!answers\[currentKey\]\}/);
  assert.match(firstVisit, /value=\{answers\[currentKey\]\s*\?\?\s*["']["']\}/, "First-visit radios must remain controlled between steps");
  assert.match(firstVisit, /setAnswers\(emptyAnswers\)/, "First-visit reset must clear every answer");
  assert.match(firstVisit, /encodeURIComponent\(answers\.goal\s*\?\?\s*["']["']\)/);
  assert.match(firstVisit, /encodeURIComponent\(answers\.moment\s*\?\?\s*["']["']\)/);
  assert.match(firstVisit, /encodeURIComponent\(answers\.guidance\s*\?\?\s*["']["']\)/);

  const trainingRoute = read("components/training-route.tsx");
  for (const stateName of ["goal", "level", "support"]) {
    assert.match(trainingRoute, new RegExp(`\\[${stateName},\\s*set[A-Z][A-Za-z]+\\]\\s*=\\s*useState<string \\| null>\\(null\\)`), `${stateName} must not have a default answer`);
  }
  assert.match(trainingRoute, /disabled=\{!currentValue\}/);
  assert.match(trainingRoute, /value=\{currentValue\s*\?\?\s*["']["']\}/, "Training-route radios must remain controlled between steps");
  assert.match(trainingRoute, /currentValue\s*&&\s*moveTo/);
  assert.match(trainingRoute, /setGoal\(null\).*setLevel\(null\).*setSupport\(null\).*setStep\(0\)/s);
  assert.match(trainingRoute, /headingRef\.current\?\.focus/);
});

test("contact, portal and backoffice actions make their demo-only consequences explicit", () => {
  const contact = read("components/contact-form.tsx");
  assert.match(contact, /event\.preventDefault\(\)/);
  assert.match(contact, /Demo[^\n]{0,80}niets verzonden/i);
  assert.match(contact, /niet verstuurd of opgeslagen/i);
  assert.doesNotMatch(contact, /\b(?:fetch|XMLHttpRequest|axios)\s*\(/);

  const contactPage = read("app/contact/page.tsx");
  assert.match(contactPage, /allowedGoals\.has|allowed\.has\(value\)/);
  assert.match(contactPage, /allowedMoments/);
  assert.match(contactPage, /allowedGuidance/);
  assert.match(contactPage, /<ContactForm\s+prefill=\{prefill\}/);

  const portal = read("components/member-portal.tsx");
  assert.match(portal, /uitsluitend fictieve gegevens/i);
  assert.match(portal, /antwoord lokaal afgerond; er is niets verzonden/i);
  assert.match(portal, /profielwijzigingen alleen lokaal opgeslagen/i);

  const backoffice = read("components/backoffice-app.tsx");
  assert.match(backoffice, /Er worden geen echte berichten of betalingen verwerkt/i);
  assert.match(backoffice, /live website is niet gewijzigd/i);

  const schedule = read("components/backoffice-schedule.tsx");
  assert.match(schedule, /alleen lokaal gepubliceerd; niemand heeft een bericht ontvangen/i);
  assert.match(schedule, /geen echte notificaties, boekingen of wijzigingen buiten deze demo/i);
  assert.match(schedule, /disabled=\{!changes\.count\}/, "Publishing must be disabled when the schedule is unchanged");
  assert.match(schedule, /Nog niets gewijzigd/i, "Initial dirty state must be visibly zero/clean");
});

test("schedule persistence is versioned, defensive and shared by all three views", () => {
  const storage = read("lib/schedule-storage.ts");
  const version = Number(storage.match(/SCHEDULE_SCHEMA_VERSION\s*=\s*(\d+)/)?.[1]);
  assert.ok(Number.isInteger(version) && version >= 2, "Schedule schema must have an explicit modern version");
  assert.match(storage, new RegExp(`DRAFT_STORAGE_KEY\\s*=\\s*["']af-schedule-draft-v${version}["']`));
  assert.match(storage, new RegExp(`PUBLISHED_STORAGE_KEY\\s*=\\s*["']af-schedule-published-v${version}["']`));
  assert.match(storage, /JSON\.parse/);
  assert.match(storage, /value\.version\s*!==\s*SCHEDULE_SCHEMA_VERSION/);
  assert.match(storage, /value\.events\.every\(isScheduleEvent\)/);
  assert.match(storage, /duplicate schedule id/);
  assert.match(storage, /catch\s*\{/);
  assert.match(storage, /valid:\s*false/);
  assert.match(storage, /changedIds\.has\(event\.id\)/, "Publish must be scoped to changed draft entries");
  assert.match(storage, /visibility\s*===\s*["']public["']/);
  assert.match(storage, /visibility\s*!==\s*["']private["']/);

  const backoffice = read("components/backoffice-schedule.tsx");
  assert.match(backoffice, /localStorage\.getItem\(PUBLISHED_STORAGE_KEY\)/);
  assert.match(backoffice, /localStorage\.getItem\(DRAFT_STORAGE_KEY\)/);
  assert.match(backoffice, /localStorage\.setItem\(PUBLISHED_STORAGE_KEY/);
  assert.match(backoffice, /CustomEvent\(SCHEDULE_PUBLISHED_EVENT\)/);

  const publicView = read("components/public-schedule.tsx");
  assert.match(publicView, /localStorage\.getItem\(PUBLISHED_STORAGE_KEY\)/);
  assert.match(publicView, /SCHEDULE_PUBLISHED_EVENT/);
  assert.match(publicView, /publicSchedule/);

  const memberView = read("components/member-portal.tsx");
  assert.match(memberView, /localStorage\.getItem\(PUBLISHED_STORAGE_KEY\)/);
  assert.match(memberView, /SCHEDULE_PUBLISHED_EVENT/);
  assert.match(memberView, /memberSchedule/);

  const sources = [storage, backoffice, publicView, memberView].join("\n");
  const literalKeys = [...sources.matchAll(/["'](af-schedule-(?:draft|published)[^"']*)["']/g)].map((match) => match[1]);
  assert.deepEqual(
    new Set(literalKeys),
    new Set([`af-schedule-draft-v${version}`, `af-schedule-published-v${version}`, "af-schedule-published"]),
    "Only versioned persistence keys and the stable in-page publish event are allowed",
  );
});

test("proprietary Nimbus font files and source-hosting infrastructure are not shipped", () => {
  const forbiddenRootPaths = [
    ".openai/hosting.json",
    "app/chatgpt-auth.ts",
    "build",
    "db",
    "drizzle.config.ts",
    "vite.config.ts",
    "worker",
    ".sites-runtime",
    ".wrangler",
  ];
  for (const relativePath of forbiddenRootPaths) {
    assert.equal(existsSync(absolute(relativePath)), false, `Source-only infrastructure must not ship: ${relativePath}`);
  }

  const scanRoots = ["app", "components", "lib", "public", "scripts"];
  const sourceFiles = [];
  const visit = (relativePath) => {
    if (!existsSync(absolute(relativePath))) return;
    for (const entry of readdirSync(absolute(relativePath), { withFileTypes: true })) {
      const child = path.join(relativePath, entry.name);
      if (entry.isDirectory()) visit(child);
      else sourceFiles.push(child);
    }
  };
  for (const scanRoot of scanRoots) visit(scanRoot);

  const fontFiles = sourceFiles.filter((file) => /\.(?:eot|otf|ttf|woff2?)$/i.test(file));
  assert.deepEqual(fontFiles, [], `Bundled font files require separate rights proof: ${fontFiles.join(", ")}`);

  const textFiles = sourceFiles.filter((file) => /\.(?:css|js|mjs|ts|tsx|json|svg)$/i.test(file));
  const combined = textFiles.map((file) => read(file)).join("\n");
  assert.doesNotMatch(combined, /nimbus/i);
  assert.doesNotMatch(combined, /@font-face/i);
  assert.doesNotMatch(combined, /codex-preview\s*[=:]\s*["']?development/i);
  assert.doesNotMatch(combined, /(?:from|import\s*)["'][^"']*(?:vinext|wrangler|cloudflare)[^"']*["']/i);
});
