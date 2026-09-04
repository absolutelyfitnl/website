#!/usr/bin/env node

import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const BASE_URL = (process.env.BASE_URL ?? process.argv[2] ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const ARTIFACTS_DIR = path.resolve(process.env.QA_ARTIFACTS_DIR ?? ".artifacts/qa");
const NAVIGATION_TIMEOUT = Number(process.env.QA_TIMEOUT_MS ?? 45_000);

const publicRoutes = [
  "/",
  "/sporten",
  "/sporten/krachttraining",
  "/sporten/cardio-conditie",
  "/sporten/powerlifting-gewichtheffen",
  "/sporten/personal-training",
  "/sporten/strength-conditioning",
  "/begeleiding",
  "/abonnementen",
  "/rooster",
  "/over-ons",
  "/blog",
  "/blog/sterker-worden-begint-met-techniek",
  "/blog/waarom-herstel-bij-training-hoort",
  "/blog/zo-bouw-je-een-trainingsschema-op",
  "/contact",
  "/ledenapp",
  "/mijn-eerste-bezoek",
  "/inloggen",
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

const requiredRoutes = [...publicRoutes, ...memberRoutes, ...backofficeRoutes];
const platformRoutes = ["/api/health", "/robots.txt", "/sitemap.xml"];
const notFoundRoutes = ["/sporten/niet-bestaand", "/blog/niet-bestaand", "/dit-bestaat-niet"];

const visualRoutes = [
  "/",
  "/sporten/krachttraining",
  "/rooster",
  "/contact",
  "/ledenportaal",
  "/ledenportaal/rooster",
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
          if (response.status() !== 200) routeFailures.push(`${route}: HTTP ${response.status()}`);
        } catch (error) {
          routeFailures.push(`${route}: ${error instanceof Error ? error.message : String(error)}`);
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
      assert(robots.includes("Disallow: /ledenportaal") && robots.includes("Disallow: /backoffice"), "robots.txt schermt demo-omgevingen niet af voor indexering");
      const sitemap = await (await context.request.get(routeUrl("/sitemap.xml"))).text();
      assert(!/\/(?:ledenportaal|backoffice|inloggen)(?:<|\/)/.test(sitemap), "Private demoroutes staan in sitemap.xml");
      for (const route of ["/inloggen", "/ledenportaal", "/backoffice"]) {
        const html = await (await context.request.get(routeUrl(route))).text();
        assert(/<meta[^>]+name="robots"[^>]+content="[^"]*noindex[^"]*nofollow/i.test(html), `${route} mist noindex,nofollow metadata`);
      }
    });

    await check("404-routes", async () => {
      const routeFailures = [];
      for (const route of notFoundRoutes) {
        const response = await context.request.get(routeUrl(route), { maxRedirects: 0, timeout: NAVIGATION_TIMEOUT });
        if (response.status() !== 404) routeFailures.push(`${route}: verwacht 404, kreeg ${response.status()}`);
      }
      assert(!routeFailures.length, routeFailures.join("; "));
    });

    const page = await context.newPage();
    let currentActivity = "browserstart";
    page.on("console", (message) => {
      if (message.type() !== "error") return;
      const location = message.location();
      browserIssues.push({
        type: "console",
        activity: currentActivity,
        message: message.text(),
        source: location.url ? `${location.url}:${location.lineNumber ?? 0}` : "onbekend",
      });
    });
    page.on("pageerror", (error) => {
      browserIssues.push({ type: "pageerror", activity: currentActivity, message: error.message });
    });
    page.on("requestfailed", (request) => {
      const reason = request.failure()?.errorText ?? "onbekende netwerkfout";
      if (/ERR_ABORTED|NS_BINDING_ABORTED/i.test(reason)) return;
      browserIssues.push({ type: "requestfailed", activity: currentActivity, message: `${request.method()} ${request.url()} — ${reason}` });
    });

    for (const viewport of viewportMatrix) {
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
      { name: "phone-390", width: 390, height: 844, routes: [...memberRoutes, ...backofficeRoutes] },
    ];
    for (const capture of extendedCaptureMatrix) {
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

    await check("Homepage-regiocaptures en mobiel menugedrag", async () => {
      const regions = [
        ["header", [".site-header"]],
        ["hero", [".ao-hero"]],
        ["programmas", [".ao-training"]],
        ["begeleidingsbeeld", [".ao-program-photo", ".ao-training"]],
        ["wizard", [".ao-visit-section"]],
        ["ecosysteem", [".ao-ecosystem"]],
        ["historie", [".ao-heritage"]],
        ["kennisbank", [".ao-journal"]],
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
      for (const label of ["Sporten", "Begeleiding", "Abonnementen", "Rooster", "Over ons", "Blog", "Contact"]) {
        await menu.getByRole("link", { name: label, exact: true }).waitFor({ state: "visible" });
      }
      await menu.getByRole("link", { name: "Mijn eerste bezoek", exact: true }).waitFor({ state: "visible" });
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

    await check("Eerste-bezoekwizard: desktop en mobiel, alle stappen en reset", async () => {
      currentActivity = "eerste-bezoekwizard";
      for (const viewport of [
        { name: "desktop", width: 1280, height: 900 },
        { name: "mobile", width: 390, height: 844 },
      ]) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await goto(page, "/mijn-eerste-bezoek");
        const wizard = page.locator(".visit-wizard");
        assert(await wizard.getByRole("button", { name: /Volgende stap/i }).isDisabled(), "De lege eerste-bezoekwizard liet doorgaan toe");
        for (const choice of ["Sterker worden", "In de avond", "Een persoonlijk startplan"]) {
          await wizard.getByRole("radio", { name: new RegExp(choice, "i") }).click();
          await wizard.screenshot({ path: path.join(ARTIFACTS_DIR, `${viewport.name}--eerste-bezoek--${choice.toLowerCase().replaceAll(" ", "-")}.png`), animations: "disabled" });
          await wizard.getByRole("button", { name: /Volgende stap/i }).click();
        }
        await wizard.getByRole("heading", { name: "Sterk beginnen, slim opbouwen." }).waitFor({ state: "visible" });
        const contactLink = wizard.getByRole("link", { name: /Plan een kennismaking/i });
        const href = await contactLink.getAttribute("href");
        assert(href === "/contact?doel=sterker&moment=avond&begeleiding=startplan", `Onjuiste wizardprefill: ${href}`);
        await wizard.screenshot({ path: path.join(ARTIFACTS_DIR, `${viewport.name}--eerste-bezoek--resultaat.png`), animations: "disabled" });
        await wizard.getByRole("button", { name: "Opnieuw", exact: true }).click();
        await wizard.getByRole("heading", { name: "Waar wil je aan werken?" }).waitFor({ state: "visible" });
        assert(await wizard.getByRole("button", { name: /Volgende stap/i }).isDisabled(), "Reset liet een verborgen wizardantwoord achter");
      }
      await page.setViewportSize({ width: 1280, height: 900 });
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
        page.waitForURL((url) => url.pathname === "/contact" && url.searchParams.get("doel") === "sterker" && url.searchParams.get("begeleiding") === "start"),
        page.locator(".route-result").getByRole("link", { name: "Plan een kennismaking", exact: true }).click(),
      ]);
      await settle(page);

      await textContains(page.locator(".contact-prefill"), "Jouw keuzes uit de wizard zijn ingevuld", "Contactprefill");
      await page.locator(".contact-form").screenshot({ path: path.join(ARTIFACTS_DIR, "desktop--contact--prefill.png"), animations: "disabled" });
      const goalSelect = page.locator("label").filter({ hasText: "Jouw doel" }).getByRole("combobox");
      const guidanceSelect = page.locator("label").filter({ hasText: "Gewenste begeleiding" }).getByRole("combobox");
      await textContains(goalSelect, "Sterker worden", "Vooringevuld doel");
      await textContains(guidanceSelect, "Begeleide start", "Vooringevulde begeleiding");

      await page.getByLabel("Naam").fill("QA Demo");
      await page.getByLabel("E-mailadres").fill("qa@example.com");
      const topicSelect = page.locator("label").filter({ hasText: "Waar kunnen we mee helpen?" }).getByRole("combobox");
      await topicSelect.click();
      await page.getByRole("option", { name: "Kennismaken", exact: true }).click();
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
      await page.getByText("Mijn eerste bezoek", { exact: true }).first().waitFor({ state: "visible" });

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

      const firstVisit = page.locator(".member-schedule article").filter({ hasText: "Mijn eerste bezoek" }).first();
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
        for (const route of ["/", "/mijn-eerste-bezoek", "/ledenportaal", "/backoffice/rooster"]) {
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
