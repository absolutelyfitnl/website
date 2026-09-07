#!/usr/bin/env node

import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const BASE_URL = (process.env.BASE_URL ?? process.argv[2] ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const ARTIFACTS_DIR = path.resolve(process.env.QA_ARTIFACTS_DIR ?? ".artifacts/qa");
const NAVIGATION_TIMEOUT = Number(process.env.QA_TIMEOUT_MS ?? 45_000);
const SKIP_BULK_CAPTURE = process.env.QA_SKIP_BULK_CAPTURE === "1";

const knowledgeArticleSlugs = [
  "kleine-stappen-duurzaam-sterker",
  "beginnen-met-krachttraining-scheveningen",
  "topsportkennis-voor-ieder-niveau",
  "wat-gebeurt-er-tijdens-een-gratis-persoonlijke-intake",
  "sporten-met-de-ooievaarspas-bij-absolutely-fit",
  "sportschool-als-ontmoetingsplek-havenkwartier",
  "sterker-worden-begint-met-techniek",
  "waarom-herstel-bij-training-hoort",
  "zo-bouw-je-een-trainingsschema-op",
];

const knowledgeArticleRoutes = knowledgeArticleSlugs.map((slug) => `/kennisbank/${slug}`);

const publicRoutes = [
  "/",
  "/sporten",
  "/sporten/krachttraining",
  "/sporten/cardio-conditie",
  "/sporten/powerlifting-gewichtheffen",
  "/sporten/strength-conditioning",
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
  ...knowledgeArticleRoutes,
  "/contact",
];

const memberRoutes = [
  "/ledenportaal",
  "/ledenportaal/training",
  "/ledenportaal/rooster",
  "/ledenportaal/lidmaatschap",
  "/ledenportaal/facturen",
  "/ledenportaal/berichten",
  "/ledenportaal/profiel",
];

const backofficeRoutes = [
  "/backoffice",
  "/backoffice/rooster",
  "/backoffice/leden",
  "/backoffice/trainers",
  "/backoffice/kennismakingen",
  "/backoffice/communicatie",
  "/backoffice/content",
  "/backoffice/instellingen",
];

const privateDemoRoutes = ["/ledenapp", "/inloggen", ...memberRoutes, ...backofficeRoutes];
const requiredRoutes = [...publicRoutes, ...privateDemoRoutes];
const legacyRedirects = [
  { source: "/mijn-eerste-bezoek", destination: "/gratis-persoonlijke-intake" },
  { source: "/sporten/personal-training", destination: "/personal-training" },
  { source: "/blog", destination: "/kennisbank" },
  ...knowledgeArticleSlugs.map((slug) => ({ source: `/blog/${slug}`, destination: `/kennisbank/${slug}` })),
];
const platformRoutes = ["/api/health", "/robots.txt", "/sitemap.xml"];
const notFoundRoutes = ["/sporten/niet-bestaand", "/kennisbank/niet-bestaand", "/dit-bestaat-niet"];

const visualRoutes = [
  "/",
  "/abonnementen",
  "/gratis-persoonlijke-intake",
  "/personal-training",
  "/ooievaarspas",
  "/openingstijden",
  "/team",
  "/topsport-en-ntc",
  "/veelgestelde-vragen",
  "/kennisbank",
  "/kennisbank/kleine-stappen-duurzaam-sterker",
  "/rooster",
  "/ledenportaal",
  "/backoffice",
  "/backoffice/rooster",
];

const viewportMatrix = [
  { name: "phone-320", width: 320, height: 740 },
  { name: "phone-375", width: 375, height: 812 },
  { name: "phone-390", width: 390, height: 844 },
  { name: "phone-430", width: 430, height: 932 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "laptop-1024", width: 1024, height: 768 },
  { name: "desktop-1280", width: 1280, height: 800 },
  { name: "desktop-1440", width: 1440, height: 1000 },
  { name: "wide-1920", width: 1920, height: 1080 },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function routeUrl(route) {
  return new URL(route, `${BASE_URL}/`).toString();
}

function artifactName(route, viewportName) {
  const routeName = route === "/" ? "home" : route.slice(1).replaceAll("/", "--");
  return path.join(ARTIFACTS_DIR, `${viewportName}--${routeName}.png`);
}

function normalizedPathname(value, base = `${BASE_URL}/`) {
  const pathname = new URL(value, base).pathname;
  return pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
}

function canonicalPathname(html, route) {
  const canonicalTag = (html.match(/<link\b[^>]*>/gi) ?? []).find((tag) => /\brel=["']canonical["']/i.test(tag));
  const href = canonicalTag?.match(/\bhref=["']([^"']+)["']/i)?.[1];
  return href ? normalizedPathname(href, routeUrl(route)) : null;
}

function hasNoIndexNoFollow(html) {
  const robotsTag = (html.match(/<meta\b[^>]*>/gi) ?? []).find((tag) => /\bname=["']robots["']/i.test(tag));
  const content = robotsTag?.match(/\bcontent=["']([^"']+)["']/i)?.[1] ?? "";
  return /(?:^|[,\s])noindex(?:[,\s]|$)/i.test(content) && /(?:^|[,\s])nofollow(?:[,\s]|$)/i.test(content);
}

function structuredDataFromHtml(html) {
  return [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .flatMap((match) => {
      const value = JSON.parse(match[1]);
      return Array.isArray(value) ? value : [value];
    });
}

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle", { timeout: 8_000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
}

async function goto(page, route) {
  const response = await page.goto(routeUrl(route), { waitUntil: "domcontentloaded" });
  assert(response, `${route} leverde geen documentresponse op`);
  assert(response.status() === 200, `${route} gaf HTTP ${response.status()} in de browser`);
  await settle(page);
  await page.locator("h1").first().waitFor({ state: "visible" });
}

async function textContains(locator, expected, description) {
  await locator.waitFor({ state: "visible" });
  const content = (await locator.textContent()) ?? "";
  const matches = expected instanceof RegExp ? expected.test(content) : content.includes(expected);
  assert(matches, `${description}: verwacht ${String(expected)}, kreeg ${JSON.stringify(content.trim())}`);
}

async function checkOverflow(page, route, viewportName) {
  const dimensions = await page.evaluate(() => ({
    body: document.body.scrollWidth,
    document: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  const renderedWidth = Math.max(dimensions.body, dimensions.document);
  assert(
    renderedWidth <= dimensions.viewport + 2,
    `${route} loopt horizontaal over op ${viewportName}: ${renderedWidth}px inhoud bij ${dimensions.viewport}px viewport`,
  );
}

async function activateScrollReveals(page) {
  await page.evaluate(async () => {
    for (const image of document.images) image.loading = "eager";
    const step = Math.max(240, Math.floor(window.innerHeight * 0.72));
    for (let top = 0; top <= document.documentElement.scrollHeight; top += step) {
      window.scrollTo({ top, behavior: "instant" });
      await new Promise((resolve) => window.setTimeout(resolve, 24));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(80);
  await page.waitForFunction(() => [...document.images].every((image) => image.naturalWidth > 0));
}

async function screenshotVisibleState(page, candidates, screenshotPath) {
  const candidateList = Array.isArray(candidates) ? candidates : [candidates];
  let target;

  for (const candidate of candidateList) {
    const locator = typeof candidate === "string" ? page.locator(candidate) : candidate;
    const count = await locator.count();
    for (let index = 0; index < count; index += 1) {
      const item = locator.nth(index);
      if (await item.isVisible()) {
        target = item;
        break;
      }
    }
    if (target) break;
  }

  assert(target, `Geen zichtbare screenshotstatus gevonden voor ${screenshotPath}`);
  await target.scrollIntoViewIfNeeded();
  await target.waitFor({ state: "visible" });
  const box = await target.boundingBox();
  assert(box && box.width > 0 && box.height > 0, `Screenshotstatus heeft geen bruikbaar formaat voor ${screenshotPath}`);
  await target.screenshot({ path: screenshotPath, animations: "disabled" });
}

async function main() {
  await mkdir(ARTIFACTS_DIR, { recursive: true });

  const failures = [];
  const browserIssues = [];
  const completed = [];
  let browser;

  const check = async (name, operation) => {
    try {
      await operation();
      completed.push(name);
      console.log(`PASS  ${name}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push({ name, message });
      console.error(`FAIL  ${name}\n      ${message}`);
    }
  };

  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      baseURL: BASE_URL,
      locale: "nl-NL",
      timezoneId: "Europe/Amsterdam",
      colorScheme: "light",
      deviceScaleFactor: 1,
      reducedMotion: "no-preference",
      viewport: { width: 1440, height: 1000 },
    });
    context.setDefaultTimeout(NAVIGATION_TIMEOUT);
    context.setDefaultNavigationTimeout(NAVIGATION_TIMEOUT);

    await check(`HTTP-routekaart (${requiredRoutes.length} routes)`, async () => {
      const routeFailures = [];
      for (const route of requiredRoutes) {
        try {
          const response = await context.request.get(routeUrl(route), { maxRedirects: 0, timeout: NAVIGATION_TIMEOUT });
          if (response.status() !== 200) {
            routeFailures.push(`${route}: HTTP ${response.status()}`);
            continue;
          }
          const html = await response.text();
          if (publicRoutes.includes(route)) {
            const canonical = canonicalPathname(html, route);
            if (canonical !== normalizedPathname(route)) routeFailures.push(`${route}: canonical is ${canonical ?? "afwezig"}`);
          }
          if (privateDemoRoutes.includes(route) && !hasNoIndexNoFollow(html)) {
            routeFailures.push(`${route}: noindex,nofollow ontbreekt`);
          }
        } catch (error) {
          routeFailures.push(`${route}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      assert(!routeFailures.length, routeFailures.join("; "));
    });

    await check(`Legacy redirects (${legacyRedirects.length} routes)`, async () => {
      const routeFailures = [];
      for (const { source, destination } of legacyRedirects) {
        try {
          const response = await context.request.get(routeUrl(source), { maxRedirects: 0, timeout: NAVIGATION_TIMEOUT });
          const location = response.headers().location;
          const redirectUrl = location ? new URL(location, routeUrl(source)) : null;
          if (![307, 308].includes(response.status())) routeFailures.push(`${source}: verwacht 307/308, kreeg ${response.status()}`);
          if (!redirectUrl || normalizedPathname(redirectUrl.toString()) !== destination || redirectUrl.search || redirectUrl.hash) {
            routeFailures.push(`${source}: Location ${location ?? "ontbreekt"}, verwacht ${destination}`);
          }
        } catch (error) {
          routeFailures.push(`${source}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      assert(!routeFailures.length, routeFailures.join("; "));
    });

    await check("Platformroutes", async () => {
      const routeFailures = [];
      for (const route of platformRoutes) {
        const response = await context.request.get(routeUrl(route), { maxRedirects: 0, timeout: NAVIGATION_TIMEOUT });
        if (response.status() !== 200) routeFailures.push(`${route}: HTTP ${response.status()}`);
      }
      assert(!routeFailures.length, routeFailures.join("; "));
      const health = await (await context.request.get(routeUrl("/api/health"))).json();
      assert(health.status === "ok" && health.service === "absolutely-fit", `Ongeldige healthpayload: ${JSON.stringify(health)}`);
      const robots = await (await context.request.get(routeUrl("/robots.txt"))).text();
      for (const route of ["/inloggen", "/ledenapp", "/ledenportaal", "/backoffice"]) {
        assert(robots.includes(`Disallow: ${route}`), `robots.txt schermt ${route} niet af voor indexering`);
      }
      const sitemap = await (await context.request.get(routeUrl("/sitemap.xml"))).text();
      const sitemapPaths = new Set((sitemap.match(/<loc>[^<]+<\/loc>/g) ?? []).map((entry) => {
        const location = entry.slice(5, -6);
        return normalizedPathname(location);
      }));
      for (const route of publicRoutes) {
        assert(sitemapPaths.has(route), `Canonieke route ${route} ontbreekt in sitemap.xml`);
      }
      for (const route of [...privateDemoRoutes, ...legacyRedirects.map(({ source }) => source)]) {
        assert(!sitemapPaths.has(route), `Niet-indexeerbare route ${route} staat in sitemap.xml`);
      }
    });

    await check("Gestructureerde data", async () => {
      const pageData = async (route) => structuredDataFromHtml(await (await context.request.get(routeUrl(route))).text());
      const homeData = await pageData("/");
      const gym = homeData.find((item) => item["@type"] === "ExerciseGym");
      assert(gym, "Homepage mist geldige ExerciseGym JSON-LD");
      assert(gym.foundingDate === "1998", `ExerciseGym foundingDate klopt niet: ${gym.foundingDate}`);
      assert(gym.openingHoursSpecification?.length === 7, "ExerciseGym bevat niet exact zeven openingsdagregels");
      const offers = gym.hasOfferCatalog?.itemListElement ?? [];
      assert(offers.length === 4, `ExerciseGym bevat ${offers.length} in plaats van vier producten`);
      assert(JSON.stringify(gym).match(/NOC\*NSF|Olympisch|TeamNL|"price"|"award"|"rating"|"review"/i) === null, "ExerciseGym bevat een onbevestigde claim, prijs of waardering");

      const faqData = await pageData("/veelgestelde-vragen");
      const faq = faqData.find((item) => item["@type"] === "FAQPage");
      assert(faq?.mainEntity?.length === 10, `FAQPage bevat niet de tien zichtbare vragen: ${faq?.mainEntity?.length ?? 0}`);

      const articleData = await pageData("/kennisbank/kleine-stappen-duurzaam-sterker");
      assert(articleData.some((item) => item["@type"] === "Article"), "Kennisbankartikel mist Article JSON-LD");
      assert(articleData.some((item) => item["@type"] === "BreadcrumbList"), "Kennisbankartikel mist BreadcrumbList JSON-LD");
    });

    await check("404-routes", async () => {
      const routeFailures = [];
      for (const route of notFoundRoutes) {
        const response = await context.request.get(routeUrl(route), { maxRedirects: 0, timeout: NAVIGATION_TIMEOUT });
        if (response.status() !== 404) routeFailures.push(`${route}: verwacht 404, kreeg ${response.status()}`);
      }
      assert(!routeFailures.length, routeFailures.join("; "));
    });

    let currentActivity = "browserstart";
    const trackPage = (trackedPage) => {
      trackedPage.on("console", (message) => {
        if (message.type() !== "error") return;
        const location = message.location();
        browserIssues.push({
          type: "console",
          activity: currentActivity,
          message: message.text(),
          source: location.url ? `${location.url}:${location.lineNumber ?? 0}` : "onbekend",
        });
      });
      trackedPage.on("pageerror", (error) => {
        browserIssues.push({ type: "pageerror", activity: currentActivity, message: error.message });
      });
      trackedPage.on("requestfailed", (request) => {
        const reason = request.failure()?.errorText ?? "onbekende netwerkfout";
        if (/ERR_ABORTED|NS_BINDING_ABORTED/i.test(reason)) return;
        browserIssues.push({ type: "requestfailed", activity: currentActivity, message: `${request.method()} ${request.url()} — ${reason}` });
      });
    };
    let page = await context.newPage();
    trackPage(page);
    const resetPage = async () => {
      await page.close().catch(() => {});
      page = await context.newPage();
      trackPage(page);
    };

    if (!SKIP_BULK_CAPTURE) {
      for (const viewport of viewportMatrix) {
        await resetPage();
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        for (const route of visualRoutes) {
          await check(`Responsief ${viewport.name} ${route}`, async () => {
            currentActivity = `responsief ${viewport.name} ${route}`;
            await goto(page, route);
            await checkOverflow(page, route, viewport.name);
            await activateScrollReveals(page);
            await page.screenshot({ path: artifactName(route, viewport.name), fullPage: true, animations: "disabled" });
          });
        }
      }

      const extendedCaptureMatrix = [
        { name: "desktop-1440", width: 1440, height: 1000, routes: requiredRoutes },
        { name: "phone-430", width: 430, height: 932, routes: publicRoutes },
        { name: "phone-390", width: 390, height: 844, routes: privateDemoRoutes },
      ];
      for (const capture of extendedCaptureMatrix) {
        await resetPage();
        await page.setViewportSize({ width: capture.width, height: capture.height });
        for (const route of capture.routes) {
          if (visualRoutes.includes(route) && viewportMatrix.some((viewport) => viewport.name === capture.name)) continue;
          await check(`Routecapture ${capture.name} ${route}`, async () => {
            currentActivity = `routecapture ${capture.name} ${route}`;
            await goto(page, route);
            await checkOverflow(page, route, capture.name);
            await activateScrollReveals(page);
            await page.screenshot({ path: artifactName(route, capture.name), fullPage: true, animations: "disabled" });
          });
        }
      }
    }

    await check("Homepage-regiocaptures en mobiel menugedrag", async () => {
      await resetPage();
      const regions = [
        ["header", [".site-header"]],
        ["hero", [".ao-hero"]],
        ["programmas", [".ao-training"]],
        ["begeleidingsbeeld", [".ao-program-photo", ".ao-training"]],
        ["producten", [".home-products"]],
        ["ooievaarspas", [".ooievaar-callout"]],
        ["wizard", [".ao-visit-section"]],
        ["ecosysteem", [".ao-ecosystem"]],
        ["clubverhaal", [".ao-club-story"]],
        ["vertrouwen", [".home-trust-grid"]],
        ["kennisbank", [".ao-journal"]],
        ["praktisch", [".home-practical"]],
        ["locatie", [".ao-location"]],
        ["footer", [".site-footer"]],
      ];
      for (const viewport of [{ name: "desktop-1440", width: 1440, height: 1000 }, { name: "phone-430", width: 430, height: 932 }]) {
        currentActivity = `home-regios ${viewport.name}`;
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await goto(page, "/");
        const headerGeometry = await page.evaluate(() => {
          const header = document.querySelector(".site-header");
          const hero = document.querySelector(".ao-hero");
          const inner = document.querySelector(".site-header__inner");
          if (!(header instanceof HTMLElement) || !(hero instanceof HTMLElement) || !(inner instanceof HTMLElement)) return null;
          const headerRect = header.getBoundingClientRect();
          const heroRect = hero.getBoundingClientRect();
          const innerRect = inner.getBoundingClientRect();
          const styles = getComputedStyle(header);
          return {
            header: { x: headerRect.x, width: headerRect.width },
            hero: { x: heroRect.x, width: heroRect.width },
            innerWidth: innerRect.width,
            background: styles.backgroundColor,
            radius: Number.parseFloat(styles.borderTopLeftRadius),
            shadow: styles.boxShadow,
            position: styles.position,
            top: Number.parseFloat(styles.top),
          };
        });
        assert(headerGeometry, `Headergeometrie ontbreekt op ${viewport.name}`);
        assert(Math.abs(headerGeometry.header.width - headerGeometry.hero.width) <= 2, `Header en hero verschillen in breedte op ${viewport.name}: ${JSON.stringify(headerGeometry)}`);
        assert(Math.abs(headerGeometry.header.x - headerGeometry.hero.x) <= 2, `Header en hero lijnen niet uit op ${viewport.name}: ${JSON.stringify(headerGeometry)}`);
        assert(headerGeometry.innerWidth <= headerGeometry.header.width, `Header-inner overschrijdt buitenframe op ${viewport.name}`);
        assert(/rgba\([^)]*,\s*0?\.8\)/.test(headerGeometry.background), `Header gebruikt niet exact 80% witte achtergrondalpha op ${viewport.name}: ${headerGeometry.background}`);
        assert(headerGeometry.radius >= 12, `Headerradius is te klein op ${viewport.name}: ${headerGeometry.radius}`);
        assert(headerGeometry.shadow !== "none", `Header mist schaduw op ${viewport.name}`);
        assert(headerGeometry.position === "sticky", `Header is niet sticky op ${viewport.name}`);
        assert(Math.abs(headerGeometry.top - (viewport.width <= 760 ? 10 : 12)) <= 1, `Header-top klopt niet op ${viewport.name}: ${headerGeometry.top}`);

        if (viewport.width <= 760) {
          const mobileComposition = await page.evaluate(() => {
            const logo = document.querySelector(".site-header .brand-link");
            const trigger = document.querySelector(".site-header .mobile-menu-trigger");
            const desktopNav = document.querySelector(".site-header .desktop-nav");
            const programGrid = document.querySelector(".ao-program-grid");
            const cards = [...document.querySelectorAll(".ao-program")];
            const promo = document.querySelector(".ao-program-photo");
            const play = document.querySelector(".ao-community > figure > a");
            return {
              logoVisible: logo instanceof HTMLElement && logo.getBoundingClientRect().width > 0,
              triggerVisible: trigger instanceof HTMLElement && trigger.getBoundingClientRect().width >= 44 && trigger.getBoundingClientRect().height >= 44,
              desktopNavHidden: desktopNav instanceof HTMLElement && getComputedStyle(desktopNav).display === "none",
              programGridHeight: programGrid instanceof HTMLElement ? programGrid.getBoundingClientRect().height : null,
              tallestProgram: Math.max(0, ...cards.map((card) => card.getBoundingClientRect().height)),
              promoHeight: promo instanceof HTMLElement ? promo.getBoundingClientRect().height : null,
              playSize: play instanceof HTMLElement ? play.getBoundingClientRect().toJSON() : null,
            };
          });
          assert(mobileComposition.logoVisible && mobileComposition.triggerVisible && mobileComposition.desktopNavHidden, `Mobiele headercompositie klopt niet: ${JSON.stringify(mobileComposition)}`);
          assert(mobileComposition.tallestProgram < 320, `Mobiele programmakaarten rekken nog uit: ${mobileComposition.tallestProgram}px`);
          assert(mobileComposition.programGridHeight < 320 && mobileComposition.promoHeight < 320, `Mobiele programmacarrousel houdt lege hoogte over: ${JSON.stringify(mobileComposition)}`);
          assert(mobileComposition.playSize?.width >= 44 && mobileComposition.playSize?.height >= 44, `Community-CTA is niet zichtbaar of te klein: ${JSON.stringify(mobileComposition.playSize)}`);
        }
        await activateScrollReveals(page);
        for (const [name, selectors] of regions) {
          await screenshotVisibleState(page, selectors, path.join(ARTIFACTS_DIR, `${viewport.name}--home--region-${name}.png`));
        }
      }

      await page.setViewportSize({ width: 430, height: 932 });
      await goto(page, "/");
      const menuTrigger = page.getByRole("button", { name: "Menu openen" });
      await menuTrigger.click();
      const menu = page.locator('[role="dialog"].mobile-menu');
      await menu.waitFor({ state: "visible" });
      for (const label of ["Sporten", "Begeleiding", "Abonnementen", "Rooster", "Over ons", "Kennisbank", "Contact"]) {
        await menu.getByRole("link", { name: label, exact: true }).waitFor({ state: "visible" });
      }
      await menu.getByRole("link", { name: "Plan je gratis persoonlijke intake", exact: true }).waitFor({ state: "visible" });
      await menu.getByRole("link", { name: "Inloggen in demo", exact: true }).waitFor({ state: "visible" });
      const focusInside = await menu.evaluate((element) => element.contains(document.activeElement));
      assert(focusInside, "Focus staat niet in het geopende mobiele menu");
      const scrollLocked = await page.evaluate(() => document.body.hasAttribute("data-scroll-locked") || getComputedStyle(document.body).overflow === "hidden");
      assert(scrollLocked, "Achtergrondscroll is niet vergrendeld bij het mobiele menu");
      await menu.screenshot({ path: path.join(ARTIFACTS_DIR, "phone-430--home--menu-open.png"), animations: "disabled" });
      await page.keyboard.press("Escape");
      await menu.waitFor({ state: "hidden" });
      assert(await menuTrigger.evaluate((element) => element === document.activeElement), "Focus keerde na het mobiele menu niet terug naar de trigger");
    });

    await check("Publieke uitlijning, contrast en mobiele vergelijkbaarheid", async () => {
      currentActivity = "publieke detailaudit";
      await page.setViewportSize({ width: 1440, height: 1000 });
      await goto(page, "/");
      await activateScrollReveals(page);
      const desktopDetails = await page.evaluate(() => {
        const rect = (selector) => {
          const element = document.querySelector(selector);
          if (!(element instanceof HTMLElement)) return null;
          const bounds = element.getBoundingClientRect();
          return { top: bounds.top, bottom: bounds.bottom, width: bounds.width, height: bounds.height };
        };
        const clubHead = document.querySelector(".ao-club-story__head");
        const clubPrinciples = document.querySelector(".ao-club-story__principles");
        const navLink = document.querySelector(".ao-header .desktop-nav a");
        return {
          wizardActions: rect(".visit-wizard--compact .visit-wizard__actions"),
          wizardPreview: rect(".visit-wizard--compact .visit-wizard__preview"),
          wizardQuestion: rect(".visit-wizard--compact .visit-wizard__question"),
          wizardChoices: rect(".visit-wizard--compact .visit-wizard__choices"),
          clubHeadHeight: clubHead instanceof HTMLElement ? clubHead.offsetHeight : null,
          clubPrinciplesHeight: clubPrinciples instanceof HTMLElement ? clubPrinciples.offsetHeight : null,
          navFontSize: navLink instanceof HTMLElement ? Number.parseFloat(getComputedStyle(navLink).fontSize) : null,
        };
      });
      assert(desktopDetails.wizardActions && desktopDetails.wizardPreview && desktopDetails.wizardQuestion && desktopDetails.wizardChoices, `Wizardgeometrie ontbreekt: ${JSON.stringify(desktopDetails)}`);
      assert(Math.abs(desktopDetails.wizardActions.bottom - desktopDetails.wizardPreview.bottom) <= 1, `Wizardacties en startplan eindigen niet gelijk: ${JSON.stringify(desktopDetails)}`);
      assert(Math.abs(desktopDetails.wizardQuestion.top - desktopDetails.wizardChoices.top) <= 1, `Wizardkolommen beginnen niet gelijk: ${JSON.stringify(desktopDetails)}`);
      assert(Math.abs(desktopDetails.clubHeadHeight - desktopDetails.clubPrinciplesHeight) <= 1, `Clubverhaal heeft ongelijke kolomhoogtes: ${JSON.stringify(desktopDetails)}`);
      assert(desktopDetails.navFontSize >= 11, `Desktopmenu blijft te klein: ${desktopDetails.navFontSize}px`);

      await page.setViewportSize({ width: 768, height: 1024 });
      await goto(page, "/");
      await activateScrollReveals(page);
      const tabletClub = await page.evaluate(() => {
        const head = document.querySelector(".ao-club-story__head");
        const principles = document.querySelector(".ao-club-story__principles");
        const cards = [...document.querySelectorAll(".ao-club-story__principle")];
        if (!(head instanceof HTMLElement) || !(principles instanceof HTMLElement)) return null;
        const headBounds = head.getBoundingClientRect();
        const principleBounds = principles.getBoundingClientRect();
        return {
          stacked: principleBounds.top > headBounds.bottom,
          cardWidths: cards.map((card) => card.getBoundingClientRect().width),
        };
      });
      assert(tabletClub?.stacked, `Clubverhaal blijft op tablet in te smalle hoofdkolommen staan: ${JSON.stringify(tabletClub)}`);
      assert(tabletClub.cardWidths.every((width) => width >= 220), `Clubprincipes zijn op tablet te smal: ${JSON.stringify(tabletClub.cardWidths)}`);

      for (const [route, selector] of [["/kennisbank", ".knowledge-principle .display--light"], ["/sporten/krachttraining", ".program-photo .display--light"]]) {
        await goto(page, route);
        const titleColor = await page.locator(selector).evaluate((element) => getComputedStyle(element).color);
        assert(titleColor === "rgb(255, 255, 255)", `${route} toont de lichte fotokop niet wit: ${titleColor}`);
      }
      await goto(page, "/");
      const trustTitleColor = await page.locator(".trust-credential h2").evaluate((element) => getComputedStyle(element).color);
      assert(trustTitleColor === "rgb(255, 255, 255)", `De trusttitel heeft onvoldoende contrast op marine: ${trustTitleColor}`);

      await page.setViewportSize({ width: 430, height: 932 });
      await goto(page, "/abonnementen");
      const comparisonDetails = await page.evaluate(() => {
        const comparison = document.querySelector(".membership-comparison");
        const cards = [...document.querySelectorAll(".membership-comparison > article")];
        const footerContact = document.querySelector(".c90-footer__contact a");
        if (!(comparison instanceof HTMLElement) || !(footerContact instanceof HTMLElement) || cards.some((card) => !(card instanceof HTMLElement))) return null;
        const comparisonRect = comparison.getBoundingClientRect();
        const cardRects = cards.map((card) => card.getBoundingClientRect());
        const actionHeights = cards.map((card) => card.querySelector("a")?.getBoundingClientRect().height ?? 0);
        return {
          cardCount: cards.length,
          contained: comparison.scrollWidth <= comparison.clientWidth + 2 && cardRects.every((rect) => rect.left >= comparisonRect.left - 1 && rect.right <= comparisonRect.right + 1),
          verticallyStacked: cardRects.every((rect, index) => index === 0 || rect.top >= cardRects[index - 1].bottom - 1),
          minActionHeight: Math.min(...actionHeights),
          footerContactHeight: footerContact.getBoundingClientRect().height,
        };
      });
      assert(comparisonDetails?.cardCount === 4, `Mobiele productvergelijking toont niet alle vier mogelijkheden: ${JSON.stringify(comparisonDetails)}`);
      assert(comparisonDetails.contained && comparisonDetails.verticallyStacked, `Mobiele productkaarten lopen uit of overlappen: ${JSON.stringify(comparisonDetails)}`);
      assert(comparisonDetails.minActionHeight >= 44, `Mobiele productacties hebben een te klein raakvlak: ${JSON.stringify(comparisonDetails)}`);
      assert(comparisonDetails.footerContactHeight >= 44, `Mobiele footerlink heeft een te klein raakvlak: ${JSON.stringify(comparisonDetails)}`);
    });

    await page.setViewportSize({ width: 1280, height: 900 });

    await check("Ledenapp: alle vier app-tabs", async () => {
      currentActivity = "ledenapp-tabs";
      await goto(page, "/ledenapp");
      const app = page.locator("#app-concept");
      for (const [tab, heading] of [["Ledenpas", "Jouw ledenpas"], ["Training", "Deze week"], ["Club", "Uit de club"], ["Home", "Vandaag trainen?"]]) {
        await app.getByRole("tab", { name: tab, exact: true }).click();
        await app.getByRole("heading", { name: heading, exact: true }).waitFor({ state: "visible" });
      }
    });

    await check("Ledenpas: dialogfocus en sluitgedrag", async () => {
      currentActivity = "ledenpas-dialog";
      await goto(page, "/ledenportaal");
      const trigger = page.getByRole("button", { name: "Demo QR-code vergroten" });
      await trigger.click();
      const dialog = page.getByRole("dialog", { name: "Digitale ledenpas" });
      await dialog.waitFor({ state: "visible" });
      await textContains(dialog, "geeft geen toegang", "Ledenpaswaarschuwing");
      await dialog.screenshot({ path: path.join(ARTIFACTS_DIR, "desktop--ledenpas--qr-dialog.png"), animations: "disabled" });
      await page.keyboard.press("Escape");
      await dialog.waitFor({ state: "hidden" });
      assert(await trigger.evaluate((element) => element === document.activeElement), "Focus keerde na sluiten niet terug naar de ledenpasknop");
    });

    await check("Gratis-intakewizard: desktop, mobiel, productprefill en reset", async () => {
      currentActivity = "gratis-intakewizard";
      const intakeRoute = "/gratis-persoonlijke-intake?abonnement=weekly";
      const expectedContactHref = "/contact?onderwerp=intake&abonnement=weekly&doel=sterker&moment=avond&begeleiding=startplan";
      for (const viewport of [
        { name: "desktop", width: 1280, height: 900 },
        { name: "mobile", width: 390, height: 844 },
      ]) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await goto(page, intakeRoute);
        await textContains(page.locator(".intake-page__selection"), "1× per week", "Gekozen product op intakepagina");
        const wizard = page.locator(".visit-wizard");
        assert(await wizard.getByRole("button", { name: /Volgende stap/i }).isDisabled(), "De lege gratis-intakewizard liet doorgaan toe");
        for (const choice of ["Sterker worden", "In de avond", "Een persoonlijk startplan"]) {
          await wizard.getByRole("radio", { name: new RegExp(choice, "i") }).click();
          await wizard.screenshot({ path: path.join(ARTIFACTS_DIR, `${viewport.name}--gratis-intake--${choice.toLowerCase().replaceAll(" ", "-")}.png`), animations: "disabled" });
          await wizard.getByRole("button", { name: /Volgende stap/i }).click();
        }
        await wizard.getByRole("heading", { name: "Sterk beginnen, slim opbouwen." }).waitFor({ state: "visible" });
        const contactLink = wizard.getByRole("link", { name: "Vraag je gratis intake aan", exact: true });
        const href = await contactLink.getAttribute("href");
        assert(href === expectedContactHref, `Onjuiste intakeprefill: ${href}`);
        await wizard.screenshot({ path: path.join(ARTIFACTS_DIR, `${viewport.name}--gratis-intake--resultaat.png`), animations: "disabled" });
        await wizard.getByRole("button", { name: "Opnieuw", exact: true }).click();
        await wizard.getByRole("heading", { name: "Waar wil je aan werken?" }).waitFor({ state: "visible" });
        assert(await wizard.getByRole("button", { name: /Volgende stap/i }).isDisabled(), "Reset liet een verborgen wizardantwoord achter");
      }
      await page.setViewportSize({ width: 1280, height: 900 });
      await goto(page, expectedContactHref);
      await textContains(page.locator(".contact-prefill"), "Jouw keuze is alvast ingevuld.", "Contactprefill uit intakewizard");
      for (const [label, expected] of [
        ["Waar kunnen we mee helpen?", "Gratis persoonlijke intake"],
        ["Product dat je wilt bespreken (optioneel)", "1× per week"],
        ["Jouw doel", "Sterker worden"],
        ["Voorkeursmoment", "Avond"],
        ["Gewenste begeleiding", "Persoonlijk startplan"],
      ]) {
        const select = page.locator("label").filter({ hasText: label }).getByRole("combobox");
        await textContains(select, expected, `Vooringevuld veld ${label}`);
      }
    });

    await check("Trainingswizard → contactprefill → eerlijk demoformulier", async () => {
      currentActivity = "trainingswizard en contact";
      await goto(page, "/sporten");

      await page.getByRole("radio", { name: /Sterker worden/i }).click();
      await page.getByRole("button", { name: /Volgende stap/i }).click();
      await page.getByRole("radio", { name: /Ik begin/i }).click();
      await page.getByRole("button", { name: /Volgende stap/i }).click();
      await page.getByRole("radio", { name: /Begeleide start/i }).click();
      await page.getByRole("button", { name: /Volgende stap/i }).click();

      await page.getByRole("heading", { name: "Kracht met een plan" }).waitFor({ state: "visible" });
      await Promise.all([
        page.waitForURL((url) => url.pathname === "/contact" && url.searchParams.get("onderwerp") === "intake" && url.searchParams.get("doel") === "sterker" && url.searchParams.get("begeleiding") === "start"),
        page.locator(".route-result").getByRole("link", { name: "Vraag je gratis intake aan", exact: true }).click(),
      ]);
      await settle(page);

      await textContains(page.locator(".contact-prefill"), "Jouw keuze is alvast ingevuld.", "Contactprefill");
      await page.locator(".contact-form").screenshot({ path: path.join(ARTIFACTS_DIR, "desktop--contact--prefill.png"), animations: "disabled" });
      const goalSelect = page.locator("label").filter({ hasText: "Jouw doel" }).getByRole("combobox");
      const guidanceSelect = page.locator("label").filter({ hasText: "Gewenste begeleiding" }).getByRole("combobox");
      const topicSelect = page.locator("label").filter({ hasText: "Waar kunnen we mee helpen?" }).getByRole("combobox");
      await textContains(topicSelect, "Gratis persoonlijke intake", "Vooringevuld onderwerp");
      await textContains(goalSelect, "Sterker worden", "Vooringevuld doel");
      await textContains(guidanceSelect, "Begeleide start", "Vooringevulde begeleiding");

      await page.getByLabel("Naam").fill("QA Demo");
      await page.getByLabel("E-mailadres").fill("qa@example.com");
      await page.getByLabel("Bericht").fill("Geautomatiseerde browsercontrole van het lokale demoformulier.");
      await page.getByRole("button", { name: /Demoformulier afronden/i }).click();
      const confirmation = page.getByRole("status");
      await textContains(confirmation, "er is niets verzonden", "Formulierbevestiging");
      await screenshotVisibleState(page, [page.locator(".form-success"), confirmation], path.join(ARTIFACTS_DIR, "desktop--contact--demo-success.png"));
    });

    await check("Publiek rooster: filters en weeknavigatie", async () => {
      currentActivity = "publiek rooster";
      await goto(page, "/rooster");

      const technique = page.getByRole("button", { name: "Techniek", exact: true });
      await technique.click();
      assert((await technique.getAttribute("aria-pressed")) === "true", "Techniekfilter werd niet actief");
      await page.getByRole("heading", { name: "Geen momenten binnen dit filter." }).waitFor({ state: "visible" });
      await page.getByRole("button", { name: "Toon alles", exact: true }).click();
      await page.getByText("Gratis persoonlijke intake", { exact: true }).first().waitFor({ state: "visible" });

      await page.getByRole("button", { name: "Volgende demoweek" }).click();
      await page.getByRole("heading", { name: "Geen data in deze demoweek." }).waitFor({ state: "visible" });
      await page.getByRole("button", { name: "Terug naar week 36" }).click();
      await textContains(page.getByRole("status"), "Demoweek 36 geselecteerd", "Weekstatus");
    });

    await check("Ledenportaal: navigatie, training, bericht en profiel", async () => {
      currentActivity = "ledenportaal";
      await goto(page, "/ledenportaal");
      await page.evaluate(() => window.localStorage.removeItem("af-demo-profile-v1"));

      await Promise.all([
        page.waitForURL((url) => url.pathname === "/ledenportaal/training"),
        page.getByRole("link", { name: "Training", exact: true }).first().click(),
      ]);
      await page.getByRole("button", { name: /Start training/i }).click();
      await textContains(page.getByRole("status"), "Demotraining actief", "Trainingstatus");
      await page.getByRole("checkbox", { name: /Goblet squat afronden/i }).click();
      await textContains(page.getByRole("status"), "1 van 5", "Oefeningsvoortgang");
      await page.locator(".portal-content").screenshot({ path: path.join(ARTIFACTS_DIR, "desktop--portal--training-active.png"), animations: "disabled" });
      await page.getByRole("button", { name: /Pauzeer demo/i }).click();

      await Promise.all([
        page.waitForURL((url) => url.pathname === "/ledenportaal/berichten"),
        page.getByRole("link", { name: "Berichten", exact: true }).first().click(),
      ]);
      await page.getByRole("button", { name: /Praktische clubinformatie/i }).click();
      await page.getByLabel("Lokaal conceptantwoord").fill("Dank, dit is alleen een lokale QA-reactie.");
      await page.getByRole("button", { name: /Demo afronden/i }).click();
      await textContains(page.getByRole("status"), "er is niets verzonden", "Berichtstatus");

      await Promise.all([
        page.waitForURL((url) => url.pathname === "/ledenportaal/profiel"),
        page.getByRole("link", { name: "Profiel", exact: true }).first().click(),
      ]);
      await page.getByLabel("E-mailadres").fill("qa-profiel@example.com");
      await page.getByRole("button", { name: /Wijzigingen lokaal opslaan/i }).click();
      await textContains(page.getByRole("status"), "alleen lokaal opgeslagen", "Profielstatus");
      const savedProfile = await page.evaluate(() => window.localStorage.getItem("af-demo-profile-v1"));
      assert(savedProfile?.includes("qa-profiel@example.com"), "Het demoprofiel is niet lokaal opgeslagen");
    });

    await check("Ledenportaal: reserveren, wachtlijst, annuleren en demofactuur", async () => {
      currentActivity = "ledenplanning en factuur";
      await goto(page, "/ledenportaal/rooster");

      const firstVisit = page.locator(".member-schedule article").filter({ hasText: "Gratis persoonlijke intake" }).first();
      await firstVisit.getByRole("button", { name: "Reserveer plek", exact: true }).click();
      await textContains(page.getByRole("status"), "alleen lokaal als gereserveerd", "Reserveringsstatus");
      await firstVisit.getByRole("button", { name: "Annuleren", exact: true }).click();
      await textContains(page.getByRole("status"), "lokaal geannuleerd", "Annuleringsstatus");

      const fullTraining = page.locator(".member-schedule article").filter({ hasText: "Personal training" }).first();
      await fullTraining.getByRole("button", { name: "Wachtlijst", exact: true }).click();
      await textContains(page.getByRole("status"), "alleen lokaal op de wachtlijst", "Wachtlijststatus");

      await goto(page, "/ledenportaal/facturen");
      const downloadPromise = page.waitForEvent("download");
      await page.getByRole("button", { name: /Download demo-tekst/i }).first().click();
      const download = await downloadPromise;
      assert(download.suggestedFilename() === "af-demo-0084.txt", `Onverwachte demofactuurnaam: ${download.suggestedFilename()}`);
    });

    await check("Backoffice-polish: acht schermen, states en responsieve details", async () => {
      currentActivity = "backoffice polish";
      await resetPage();

      await page.setViewportSize({ width: 1440, height: 1000 });
      for (const route of backofficeRoutes) {
        await resetPage();
        await page.setViewportSize({ width: 1440, height: 1000 });
        await goto(page, route);
        await checkOverflow(page, route, "backoffice-desktop");
        const shared = await page.evaluate(() => {
          const sidebar = document.querySelector(".admin-sidebar");
          const brandCopy = document.querySelector(".admin-brand span");
          const navLink = document.querySelector(".admin-sidebar nav a");
          const heading = document.querySelector(".admin-heading, .schedule-heading");
          const bodyText = document.querySelector(".admin-heading p, .schedule-heading p");
          return {
            sidebarWidth: sidebar instanceof HTMLElement ? sidebar.getBoundingClientRect().width : null,
            brandFits: brandCopy instanceof HTMLElement ? brandCopy.scrollWidth <= brandCopy.clientWidth + 1 : null,
            navFontSize: navLink instanceof HTMLElement ? Number.parseFloat(getComputedStyle(navLink).fontSize) : null,
            headingWidth: heading instanceof HTMLElement ? heading.getBoundingClientRect().width : null,
            bodyFontSize: bodyText instanceof HTMLElement ? Number.parseFloat(getComputedStyle(bodyText).fontSize) : null,
          };
        });
        assert(shared.sidebarWidth >= 240 && shared.brandFits, `${route} heeft een geklemde desktoprail: ${JSON.stringify(shared)}`);
        assert(shared.navFontSize >= 13 && shared.bodyFontSize >= 14, `${route} houdt te kleine kerntekst: ${JSON.stringify(shared)}`);
        assert(shared.headingWidth > 700, `${route} gebruikt de desktopwerkruimte niet: ${JSON.stringify(shared)}`);
      }

      await resetPage();
      await page.setViewportSize({ width: 1440, height: 1000 });
      await goto(page, "/backoffice");
      const dashboardAlignment = await page.evaluate(() => {
        const today = document.querySelector(".admin-today");
        const inbox = document.querySelector(".admin-inbox");
        if (!(today instanceof HTMLElement) || !(inbox instanceof HTMLElement)) return null;
        return { today: today.getBoundingClientRect().bottom, inbox: inbox.getBoundingClientRect().bottom };
      });
      assert(dashboardAlignment && Math.abs(dashboardAlignment.today - dashboardAlignment.inbox) <= 1, `Dashboardkaarten eindigen ongelijk: ${JSON.stringify(dashboardAlignment)}`);

      await resetPage();
      await page.setViewportSize({ width: 1440, height: 1000 });
      await goto(page, "/backoffice/trainers");
      assert(await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight + 4), "Korte backofficepagina heeft nog decoratieve lege scrollruimte");
      await page.getByRole("button", { name: "Alleen democoaches", exact: true }).click();
      const filteredTrainerWidths = await page.locator(".admin-trainer-grid > article").evaluateAll((cards) => cards.map((card) => card.getBoundingClientRect().width));
      assert(filteredTrainerWidths.length === 2 && Math.abs(filteredTrainerWidths[0] - filteredTrainerWidths[1]) <= 1, `Gefilterde trainerkaarten verdelen de ruimte niet: ${JSON.stringify(filteredTrainerWidths)}`);

      await resetPage();
      await page.setViewportSize({ width: 1440, height: 1000 });
      await goto(page, "/backoffice/communicatie");
      const communicationGeometry = await page.evaluate(() => {
        const input = document.querySelector(".admin-communication__composer input");
        const button = document.querySelector(".admin-communication__composer button");
        const composer = document.querySelector(".admin-communication__composer");
        if (!(input instanceof HTMLElement) || !(button instanceof HTMLElement) || !(composer instanceof HTMLElement)) return null;
        const inputRect = input.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        const composerRect = composer.getBoundingClientRect();
        return {
          separated: inputRect.right + 8 <= buttonRect.left,
          inside: inputRect.left >= composerRect.left && buttonRect.right <= composerRect.right,
          inputHeight: inputRect.height,
          buttonHeight: buttonRect.height,
        };
      });
      assert(communicationGeometry?.separated && communicationGeometry.inside, `Communicatiecomposer overlapt of loopt uit: ${JSON.stringify(communicationGeometry)}`);
      assert(communicationGeometry.inputHeight >= 44 && communicationGeometry.buttonHeight >= 44, `Communicatiecomposer heeft te kleine controls: ${JSON.stringify(communicationGeometry)}`);

      await resetPage();
      await page.setViewportSize({ width: 1440, height: 1000 });
      await goto(page, "/backoffice/content");
      const contentCards = await page.locator(".admin-content-grid article").evaluateAll((cards) => cards.map((card) => {
        const status = card.querySelector("small");
        const button = card.querySelector("button");
        if (!(status instanceof HTMLElement) || !(button instanceof HTMLElement)) return null;
        const a = status.getBoundingClientRect();
        const b = button.getBoundingClientRect();
        return { statusBottom: a.bottom, actionTop: b.top, actionHeight: b.height };
      }));
      assert(contentCards.every((card) => card && card.statusBottom <= card.actionTop + 1 && card.actionHeight >= 44), `Contentkaartstatus en actie overlappen: ${JSON.stringify(contentCards)}`);

      await page.setViewportSize({ width: 390, height: 844 });
      for (const route of backofficeRoutes) {
        await resetPage();
        await page.setViewportSize({ width: 390, height: 844 });
        await goto(page, route);
        await checkOverflow(page, route, "backoffice-phone");
        const mobileShell = await page.evaluate(() => {
          const sidebar = document.querySelector(".admin-sidebar");
          const nav = document.querySelector(".admin-sidebar nav");
          const active = nav?.querySelector("[aria-current='page']");
          const content = document.querySelector(".admin-content");
          const headingControls = [...document.querySelectorAll(".admin-heading :is(button,a)")]
            .filter((element) => element instanceof HTMLElement && element.getBoundingClientRect().width > 0)
            .map((element) => element.getBoundingClientRect().toJSON());
          const undersized = [...document.querySelectorAll(
            ".admin-heading :is(button,a), .admin-list-toolbar button, .admin-data-table article > button, .admin-trainer-grid footer :is(button,a), .admin-kanban article button, .admin-communication button, .admin-content-grid button, .admin-local-editor button, .schedule-toolbar button, .schedule-status button, .schedule-mobile-agenda__actions button",
          )].filter((element) => {
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
          }).map((element) => ({ text: element.getAttribute("aria-label") || element.textContent?.trim(), rect: element.getBoundingClientRect().toJSON() }));
          if (!(sidebar instanceof HTMLElement) || !(nav instanceof HTMLElement) || !(active instanceof HTMLElement) || !(content instanceof HTMLElement)) return null;
          const navRect = nav.getBoundingClientRect();
          const activeRect = active.getBoundingClientRect();
          const contentRect = content.getBoundingClientRect();
          return {
            sidebarPosition: getComputedStyle(sidebar).position,
            sidebarHeight: sidebar.getBoundingClientRect().height,
            activeVisible: activeRect.left >= navRect.left + 4 && activeRect.right <= navRect.right - 4,
            navNames: [...nav.querySelectorAll("a")].map((link) => link.getAttribute("aria-label")),
            controlsInside: headingControls.every((rect) => rect.left >= contentRect.left - 1 && rect.right <= contentRect.right + 1),
            undersized,
          };
        });
        assert(mobileShell?.sidebarPosition === "relative" && mobileShell.sidebarHeight <= 140, `${route} houdt een te hoge of bedekkende mobiele shell: ${JSON.stringify(mobileShell)}`);
        assert(mobileShell.activeVisible, `${route} toont de actieve mobiele bestemming niet: ${JSON.stringify(mobileShell)}`);
        assert(mobileShell.navNames.every(Boolean), `${route} bevat naamloze compacte navigatielinks: ${JSON.stringify(mobileShell)}`);
        assert(mobileShell.controlsInside, `${route} laat een headingactie buiten de content lopen: ${JSON.stringify(mobileShell)}`);
        assert(!mobileShell.undersized.length, `${route} heeft raakvlakken kleiner dan 44px: ${JSON.stringify(mobileShell.undersized)}`);
      }

      await resetPage();
      await page.setViewportSize({ width: 1440, height: 900 });
      await goto(page, "/backoffice/instellingen");
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForFunction(() => {
        const nav = document.querySelector(".admin-sidebar nav");
        const active = nav?.querySelector("[aria-current='page']");
        if (!(nav instanceof HTMLElement) || !(active instanceof HTMLElement)) return false;
        const navRect = nav.getBoundingClientRect();
        const activeRect = active.getBoundingClientRect();
        return activeRect.left >= navRect.left + 4 && activeRect.right <= navRect.right - 4;
      });

      await resetPage();
      await page.setViewportSize({ width: 390, height: 844 });
      await goto(page, "/backoffice/leden");
      const memberControls = await page.locator(".admin-list-toolbar :is(input,button)").evaluateAll((controls) => controls.map((control) => control.getBoundingClientRect().height));
      assert(memberControls.every((height) => height >= 44), `Ledenfilters hebben te kleine raakvlakken: ${JSON.stringify(memberControls)}`);
      await page.getByLabel("Zoek demoleden").fill("bestaat niet");
      await page.getByText("Geen demoleden gevonden", { exact: true }).waitFor({ state: "visible" });
      await page.getByRole("button", { name: "Wis zoeken en filters", exact: true }).click();
      await page.getByText("Sam de Vries", { exact: true }).waitFor({ state: "visible" });

      await resetPage();
      await page.setViewportSize({ width: 390, height: 844 });
      await goto(page, "/backoffice/communicatie");
      const mobileCommunication = await page.evaluate(() => {
        const section = document.querySelector(".admin-communication > section");
        const input = document.querySelector(".admin-communication__composer input");
        const button = document.querySelector(".admin-communication__composer button");
        if (!(section instanceof HTMLElement) || !(input instanceof HTMLElement) || !(button instanceof HTMLElement)) return null;
        return {
          contained: section.scrollWidth <= section.clientWidth,
          inputHeight: input.getBoundingClientRect().height,
          buttonHeight: button.getBoundingClientRect().height,
          separated: input.getBoundingClientRect().bottom <= button.getBoundingClientRect().top,
        };
      });
      assert(mobileCommunication?.contained && mobileCommunication.separated, `Mobiele communicatie is geclipt of overlapt: ${JSON.stringify(mobileCommunication)}`);
      assert(mobileCommunication.inputHeight >= 44 && mobileCommunication.buttonHeight >= 44, `Mobiele communicatiecontrols zijn te klein: ${JSON.stringify(mobileCommunication)}`);

      await resetPage();
      await page.setViewportSize({ width: 390, height: 844 });
      await goto(page, "/backoffice/content");
      const mobileContentCards = await page.locator(".admin-content-grid article").evaluateAll((cards) => cards.map((card) => {
        const status = card.querySelector("small");
        const button = card.querySelector("button");
        if (!(status instanceof HTMLElement) || !(button instanceof HTMLElement)) return false;
        return status.getBoundingClientRect().bottom <= button.getBoundingClientRect().top + 1 && button.getBoundingClientRect().height >= 44;
      }));
      assert(mobileContentCards.every(Boolean), `Mobiele contentkaarten overlappen nog: ${JSON.stringify(mobileContentCards)}`);

      await resetPage();
      await page.setViewportSize({ width: 390, height: 844 });
      await goto(page, "/backoffice/instellingen");
      const settingsDetails = await page.evaluate(() => ({
        inputHeights: [...document.querySelectorAll(".admin-settings input")].map((input) => input.getBoundingClientRect().height),
        statuses: [...document.querySelectorAll(".admin-settings__status")].map((status) => status.textContent?.trim()),
        controlTitles: [...document.querySelectorAll(".admin-control-register h3")].map((heading) => heading.textContent?.trim()),
      }));
      assert(settingsDetails.inputHeights.every((height) => height >= 48), `Mobiele instellingenvelden zijn te klein: ${JSON.stringify(settingsDetails)}`);
      assert(settingsDetails.statuses.length === 4 && settingsDetails.statuses.every((status) => status === "Niet actief"), `Instellingsstatussen zijn geen rustige badges: ${JSON.stringify(settingsDetails)}`);
      assert(settingsDetails.controlTitles.length === 6 && ["Reguliere openingstijden", "Vier producttypen", "NTC-/NOC*NSF-claim", "Team- en artikelrechten"].every((title) => settingsDetails.controlTitles.includes(title)), `Centraal contentregister is onvolledig: ${JSON.stringify(settingsDetails.controlTitles)}`);
      await page.getByRole("button", { name: "Lokaal opslaan", exact: true }).click();
      const toast = page.locator(".admin-global-notice");
      await toast.waitFor({ state: "visible" });
      assert((await toast.evaluate((element) => getComputedStyle(element).position)) === "fixed", "Backofficestatus verschijnt niet als zichtbare toast");

      await resetPage();
      await page.setViewportSize({ width: 390, height: 844 });
      await goto(page, "/backoffice/rooster");
      const livePosition = await page.locator(".schedule-live").evaluate((element) => getComputedStyle(element).position);
      assert(livePosition === "relative", `Roosterstatus blijft over het werkvlak zweven: ${livePosition}`);
      await page.locator(".schedule-mobile-days button").last().click();
      await page.getByText("Nog niets ingepland", { exact: true }).waitFor({ state: "visible" });

      await page.setViewportSize({ width: 1280, height: 900 });
    });

    await check("Backoffice-rooster: template bewerken en lokaal publiceren", async () => {
      currentActivity = "backoffice rooster";
      await goto(page, "/backoffice/rooster");
      await page.evaluate(() => {
        window.localStorage.removeItem("af-schedule-draft-v2");
        window.localStorage.removeItem("af-schedule-published-v2");
      });
      await page.reload({ waitUntil: "domcontentloaded" });
      await settle(page);
      await page.waitForFunction(() => window.localStorage.getItem("af-schedule-draft-v2") !== null);

      const unchangedButton = page.getByRole("button", { name: "Geen wijzigingen", exact: true });
      assert(await unchangedButton.isDisabled(), "Publiceren hoort zonder wijzigingen uitgeschakeld te zijn");

      const existingEvent = page.getByRole("button", { name: /Strength & Conditioning, 18:30, Rik Priester/i });
      await existingEvent.focus();
      await page.keyboard.press("ArrowDown");
      await textContains(page.getByRole("status"), "verplaatst naar Maandag 19:00", "Keyboardverplaatsing");
      await page.getByRole("button", { name: "Ongedaan", exact: true }).click();
      assert(await page.getByRole("button", { name: "Geen wijzigingen", exact: true }).isDisabled(), "Ongedaan herstelde de schone roosterstatus niet");

      const template = page.getByRole("button", { name: /Strength & Conditioning.*60 min.*03/i });
      const dropSlot = page.getByRole("button", { name: "Plaats geselecteerde regel op Maandag om 10:00", exact: true });
      await template.dragTo(dropSlot);
      const editor = page.getByRole("dialog", { name: "Roosterregel bewerken" });
      await editor.waitFor({ state: "visible" });

      await editor.getByRole("button", { name: "Verwijderen", exact: true }).click();
      const deleteDialog = page.getByRole("dialog", { name: "Roosterregel verwijderen?" });
      await deleteDialog.getByRole("button", { name: "Verwijderen", exact: true }).click();
      await textContains(page.getByRole("status"), "verwijderd", "Verwijderstatus");
      await page.getByRole("button", { name: "Ongedaan", exact: true }).click();
      await textContains(page.getByRole("status"), "ongedaan gemaakt", "Undo-status");

      await page.getByRole("button", { name: /Strength & Conditioning, 10:00, Nog toe te wijzen/i }).click();
      await editor.getByRole("button", { name: "Dupliceren", exact: true }).click();
      await textContains(page.getByRole("status"), "gedupliceerd", "Dupliceerstatus");
      await editor.getByRole("button", { name: "Verwijderen", exact: true }).click();
      await deleteDialog.getByRole("button", { name: "Verwijderen", exact: true }).click();

      await page.getByRole("button", { name: /Strength & Conditioning, 10:00, Nog toe te wijzen/i }).click();
      await editor.getByLabel("Trainer").selectOption({ label: "Rik Priester" });
      await editor.getByLabel("Starttijd").selectOption("8");
      await textContains(editor.getByRole("alert"), "heeft op dit moment al een afspraak", "Conflictvalidatie");
      await editor.getByLabel("Trainer").selectOption({ label: "Nog toe te wijzen" });
      await editor.getByLabel("Titel").fill("QA openbare krachttraining");
      await editor.getByLabel("Zichtbaarheid").selectOption("public");
      await editor.screenshot({ path: path.join(ARTIFACTS_DIR, "desktop--backoffice-rooster--edit-dialog.png"), animations: "disabled" });
      await editor.getByRole("button", { name: "Concept sluiten", exact: true }).click();

      await page.getByRole("button", { name: /1 wijziging publiceren/i }).click();
      const publishDialog = page.getByRole("dialog", { name: "Wijzigingen lokaal publiceren?" });
      await publishDialog.waitFor({ state: "visible" });
      await publishDialog.screenshot({ path: path.join(ARTIFACTS_DIR, "desktop--backoffice-rooster--publish-dialog.png"), animations: "disabled" });
      await publishDialog.getByRole("button", { name: /1 wijziging lokaal publiceren/i }).click();
      await textContains(page.getByRole("status"), "alleen lokaal gepubliceerd", "Publicatiestatus");

      await goto(page, "/rooster");
      await page.getByText("QA openbare krachttraining", { exact: true }).waitFor({ state: "visible" });
    });

    await check("200%-reflowequivalent en lage viewport", async () => {
      currentActivity = "200 procent reflow en lage viewport";
      for (const viewport of [
        { name: "zoom-200-equivalent", width: 640, height: 450 },
        { name: "phone-low-height", width: 390, height: 650 },
        { name: "phone-landscape", width: 844, height: 390 },
      ]) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        for (const route of ["/", "/gratis-persoonlijke-intake", "/ledenportaal", "/backoffice/rooster"]) {
          await goto(page, route);
          await checkOverflow(page, route, viewport.name);
        }
      }
    });

    await check("Pointer-coarse en reduced-motion", async () => {
      currentActivity = "pointer coarse en reduced motion";
      const touchContext = await browser.newContext({
        baseURL: BASE_URL,
        viewport: { width: 390, height: 844 },
        screen: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        reducedMotion: "reduce",
      });
      touchContext.setDefaultTimeout(NAVIGATION_TIMEOUT);
      const touchPage = await touchContext.newPage();
      const touchIssues = [];
      touchPage.on("console", (message) => { if (message.type() === "error") touchIssues.push(`console: ${message.text()}`); });
      touchPage.on("pageerror", (error) => touchIssues.push(`pageerror: ${error.message}`));
      try {
        for (const route of ["/", "/rooster", "/ledenportaal", "/backoffice/rooster"]) {
          await goto(touchPage, route);
          await checkOverflow(touchPage, route, "pointer-coarse");
        }
        await touchPage.getByRole("button", { name: /Personal training dertig minuten later/i }).click();
        await textContains(touchPage.getByRole("status"), "verplaatst naar Maandag 08:30", "Mobiele roosteractie");
        const undersizedTargets = await touchPage.evaluate(() => [...document.querySelectorAll(
          ".schedule-mobile-agenda__actions button, .portal-mobile-nav a, .public-schedule__panel > header button",
        )].filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
        }).map((element) => ({ text: element.getAttribute("aria-label") || element.textContent?.trim(), rect: element.getBoundingClientRect().toJSON() })));
        assert(!undersizedTargets.length, `Touchdoelen kleiner dan 44px: ${JSON.stringify(undersizedTargets)}`);
        const media = await touchPage.evaluate(() => ({
          coarse: window.matchMedia("(pointer: coarse)").matches,
          reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        }));
        assert(media.coarse, "De touchcontext activeerde pointer: coarse niet");
        assert(media.reduced, "De touchcontext activeerde reduced motion niet");
        await goto(touchPage, "/");
        const reducedStyles = await touchPage.evaluate(() => {
          const marquee = document.querySelector(".ao-marquee__track");
          const ribbon = document.querySelector(".ao-hero__ribbon");
          const reveal = document.querySelector(".reveal");
          const programCard = document.querySelector(".ao-program-grid > .ao-program");
          return {
            marqueeAnimation: marquee ? getComputedStyle(marquee).animationName : null,
            ribbonAnimation: ribbon ? getComputedStyle(ribbon).animationName : null,
            revealOpacity: reveal ? getComputedStyle(reveal).opacity : null,
            revealTransform: reveal ? getComputedStyle(reveal).transform : null,
            programCardOpacity: programCard ? getComputedStyle(programCard).opacity : null,
            programCardTransform: programCard ? getComputedStyle(programCard).transform : null,
          };
        });
        assert(reducedStyles.marqueeAnimation === "none", `Marquee beweegt met reduced motion: ${JSON.stringify(reducedStyles)}`);
        assert(reducedStyles.ribbonAnimation === "none", `Ribbon beweegt met reduced motion: ${JSON.stringify(reducedStyles)}`);
        assert(reducedStyles.revealOpacity === "1" && reducedStyles.revealTransform === "none", `Reveal blijft verborgen of verschoven met reduced motion: ${JSON.stringify(reducedStyles)}`);
        assert(reducedStyles.programCardOpacity === "1" && reducedStyles.programCardTransform === "none", `Programmacard blijft verborgen of verschoven met reduced motion: ${JSON.stringify(reducedStyles)}`);
        assert(!touchIssues.length, touchIssues.join("; "));
      } finally {
        await touchContext.close();
      }
    });

    await page.setViewportSize({ width: 1280, height: 900 });

    await check("Geen console-, pagina- of netwerkfouten", async () => {
      const uniqueIssues = [...new Map(browserIssues.map((issue) => [JSON.stringify(issue), issue])).values()];
      assert(
        !uniqueIssues.length,
        uniqueIssues.slice(0, 20).map((issue) => `${issue.type} (${issue.activity}): ${issue.message}${issue.source ? ` [${issue.source}]` : ""}`).join("; "),
      );
    });

    await context.close();

    console.log(`\nBrowser-QA: ${completed.length} controles geslaagd, ${failures.length} mislukt.`);
    console.log(`Screenshots: ${ARTIFACTS_DIR}`);
    if (failures.length) {
      console.error("\nMislukte controles:");
      for (const failure of failures) console.error(`- ${failure.name}: ${failure.message}`);
      process.exitCode = 1;
    }
  } finally {
    await browser?.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
