import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { PNG } from "pngjs";

const base = process.env.BASE_URL || "http://127.0.0.1:3000";
const reference = process.env.REFERENCE_URL || "http://127.0.0.1:8000";
const compare = process.env.VISUAL_COMPARE !== "false";
const output = path.resolve(process.env.QA_OUTPUT || "artifacts/sites-migration");
await mkdir(output, { recursive: true });
const pages = JSON.parse(await readFile("site/src/content/page-manifest.json", "utf8"));
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: "nl-NL", timezoneId: "Europe/Amsterdam", reducedMotion: "reduce", permissions: ["clipboard-read", "clipboard-write"] });
let page = await context.newPage();
let original = compare ? await context.newPage() : null;
const errors = [];
for (const p of [page, original].filter(Boolean)) {
  p.on("pageerror", (error) => errors.push(error.message));
  await p.clock.setFixedTime(new Date("2026-10-12T10:00:00Z"));
}
const prior = process.env.BROWSER_SCOPE === "interactions" ? JSON.parse(await readFile(path.join(output, "browser-results.json"), "utf8")) : null;
if (prior) {
  assert.equal(prior.base, base);
  assert.equal(prior.viewports.length, 6);
  assert.ok(prior.viewports.every((row) => row.routes === 30));
}
const report = { base, reference: compare ? reference : null, viewports: prior?.viewports || [], screenshots: prior?.screenshots || [], interactions: {}, errors };
const routeURL = (origin, route) => origin + (route === "/" ? "/" : route + "/");
async function ready(p, url) {
  const response = await p.goto(url, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200, url);
  await p.evaluate(async () => {
    document.querySelectorAll("img[loading='lazy']").forEach((img) => { img.loading = "eager"; });
    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
    // Chromium can retain fallback glyphs in off-screen native selects until
    // they are painted in the viewport after the webfont finishes loading.
    for (const select of document.querySelectorAll("select")) {
      select.scrollIntoView({ behavior: "instant", block: "center" });
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }
    scrollTo({ top: 0, behavior: "instant" });
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}
const geometry = (p) => p.evaluate(() => ({
  overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
  fonts: [document.fonts.check('400 16px Inter'), document.fonts.check('800 32px Manrope')],
  h1: document.querySelector("h1").textContent,
  images: [...document.querySelectorAll("main img")].map((img) => ({ loaded: img.complete && img.naturalWidth > 0, crop: getComputedStyle(img).objectFit, position: getComputedStyle(img).objectPosition, width: img.getBoundingClientRect().width, height: img.getBoundingClientRect().height })),
}));
async function capture(p, file) {
  // Activate each tab and paint off-screen native form controls before comparing.
  await p.bringToFront();
  await p.screenshot({ fullPage: true, animations: "disabled" });
  return p.screenshot({ path: file, fullPage: true, animations: "disabled" });
}
try {
  for (const width of prior ? [] : [1440, 1024, 768, 390, 375, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    if (original) await original.setViewportSize({ width, height: 1000 });
    const row = { width, routes: 0, pixelComparisons: 0 };
    for (const entry of pages) {
      await page.close();
      if (original) await original.close();
      page = await context.newPage();
      original = compare ? await context.newPage() : null;
      for (const p of [page, original].filter(Boolean)) {
        p.on("pageerror", (error) => errors.push(error.message));
        await p.setViewportSize({ width, height: 1000 });
        await p.clock.setFixedTime(new Date("2026-10-12T10:00:00Z"));
      }
      await Promise.all([ready(page, routeURL(base, entry.path)), ...(original ? [ready(original, routeURL(reference, entry.path))] : [])]);
      const actual = await geometry(page);
      assert.ok(actual.overflow <= 1, `Overflow ${entry.path} at ${width}: ${actual.overflow}`);
      assert.deepEqual(actual.fonts, [true, true], `Fonts ${entry.path}`);
      assert.ok(actual.images.every((img) => img.loaded), `Images ${entry.path}`);
      if (original) assert.deepEqual(actual, await geometry(original), `Browser geometry ${entry.path} at ${width}`);
      row.routes++;
      if (entry.path === "/" || ([1440, 390].includes(width) && ["/sporten", "/contact", "/gratis-persoonlijke-intake", "/rooster", "/kennisbank", "/veelgestelde-vragen", "/ooievaarspas"].includes(entry.path))) {
        const slug = entry.path === "/" ? "home" : entry.path.slice(1).replaceAll("/", "-");
        const actualFile = `${slug}-${width}-migration.png`;
        const actualBuffer = await capture(page, path.join(output, actualFile));
        if (original) {
          const referenceFile = `${slug}-${width}-reference.png`;
          const referenceBuffer = await capture(original, path.join(output, referenceFile));
          const a = PNG.sync.read(actualBuffer), b = PNG.sync.read(referenceBuffer);
          assert.equal(a.width, b.width); assert.equal(a.height, b.height);
          let different = 0, rasterRoundingPixels = 0;
          for (let i = 0; i < a.data.length; i += 4) {
            const delta = Math.max(...[0, 1, 2, 3].map((channel) => Math.abs(a.data[i + channel] - b.data[i + channel])));
            if (delta > 1) different++;
            else if (delta > 0) rasterRoundingPixels++;
          }
          if (different) {
            const controls = (p) => p.locator("select").evaluateAll((els) => els.map((el) => ({ name: el.name, value: el.value, rect: el.getBoundingClientRect().toJSON(), font: getComputedStyle(el).font })));
            console.log(JSON.stringify({ actualControls: await controls(page), referenceControls: await controls(original) }));
          }
          assert.equal(different, 0, `Screenshot ${entry.path} at ${width}: ${different} pixels differ`);
          report.screenshots.push({ route: entry.path, width, referenceFile, actualFile, differentPixels: different, rasterRoundingPixels });
          row.pixelComparisons++;
        } else report.screenshots.push({ route: entry.path, width, actualFile });
      }
    }
    report.viewports.push(row);
    console.log(`Browser viewport ${width}: ${row.routes} routes, no overflow, fonts/images loaded, ${row.pixelComparisons} exact screenshots.`);
  }
  await page.bringToFront();
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page, base + "/");
  await page.locator("#menu-trigger").focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("#site-menu").evaluate((dialog) => dialog.open), true);
  assert.equal(await page.locator("#menu-trigger").getAttribute("aria-expanded"), "true");
  assert.equal(await page.evaluate(() => document.querySelector("#site-menu").contains(document.activeElement)), true);
  for (let i = 0; i < 50; i++) {
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.querySelector("#site-menu").contains(document.activeElement) || document.activeElement === document.body), true, "Menu keeps the underlying page inert; native dialogs may focus browser chrome");
  }
  assert.equal(await page.locator(".header-intake").evaluate((link) => { link.focus(); return document.activeElement === link; }), false, "Underlying page cannot receive focus");
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector("#site-menu").open && document.querySelector("#menu-trigger").getAttribute("aria-expanded") === "false");
  assert.equal(await page.locator("#menu-trigger").getAttribute("aria-expanded"), "false");
  assert.equal(await page.locator("#menu-trigger").evaluate((trigger) => document.activeElement === trigger), true);
  assert.equal(await page.locator("#menu-trigger i").count(), 3);
  await page.evaluate(() => scrollTo(0, 800));
  await page.waitForFunction(() => document.querySelector(".site-header").classList.contains("is-scrolled"));
  report.interactions.menu = "keyboard opening, 50 focus cycles, Escape, aria-expanded, focus restoration, three lines and scrolled header";

  await page.locator("[data-photo]").first().click();
  for (let i = 1; i <= 10; i++) {
    assert.match(await page.locator("#photo-counter").textContent(), new RegExp(`^${String(i).padStart(2, "0")} / 10`));
    assert.equal(await page.locator(".lightbox-photo").evaluate((figure) => figure.classList.contains("phone")), i >= 9);
    assert.ok((await page.locator("#photo-large").getAttribute("alt")).length > 15);
    if (i >= 9) {
      await page.locator("#photo-large").evaluate((img) => img.decode());
      await page.screenshot({ path: path.join(output, `gallery-${i}-390.png`), animations: "disabled" });
    }
    await page.keyboard.press("ArrowRight");
  }
  await page.keyboard.press("ArrowLeft");
  assert.match(await page.locator("#photo-counter").textContent(), /^10 \/ 10/);
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector("#photo-viewer").open && document.activeElement === document.querySelector("[data-photo]"));
  assert.equal(await page.locator("[data-photo]").first().evaluate((button) => document.activeElement === button), true);
  report.interactions.gallery = "all ten images, wrap/arrow navigation, accurate captions/alt, 09/10 crop, Escape and focus restoration";

  await ready(page, base + "/sporten/");
  const training = await page.evaluate(() => {
    const widget = document.querySelector("[data-training-route]");
    const form = widget.querySelector("form");
    const next = widget.querySelector("[data-route-next]");
    const expect = (condition, message) => { if (!condition) throw new Error(message); };
    expect(next.disabled, "Training initially disabled");
    let count = 0;
    for (const doel of ["sterker", "fitter", "afvallen", "spiermassa", "prestatie"]) for (const ervaring of ["start", "regelmatig", "ervaren"]) for (const begeleiding of ["zelf", "start", "intensief"]) {
      for (const [name, value] of Object.entries({ doel, ervaring, begeleiding })) {
        form.querySelector(`input[name="${name}"][value="${value}"]`).click();
        expect(!next.disabled, "Training answer enables next"); next.click();
      }
      const result = widget.querySelector("[data-route-result]");
      expect(!result.hidden, "Training result visible");
      const link = new URL(result.querySelector("a").href);
      for (const [name, value] of Object.entries({ doel, ervaring, begeleiding })) expect(link.searchParams.get(name) === value, `Training query ${name}`);
      expect(document.activeElement === result.querySelector("h3"), "Training result focus");
      result.querySelector("[data-route-reset]").click();
      expect(next.disabled, "Training reset"); count++;
    }
    form.querySelector('input[name="doel"][value="sterker"]').click(); next.click(); widget.querySelector("[data-route-prev]").click();
    expect(form.querySelector('input[name="doel"][value="sterker"]').checked, "Training back preserves selection");
    return count;
  });
  assert.equal(training, 45); report.interactions.trainingCombinations = training;

  await ready(page, base + "/gratis-persoonlijke-intake/?abonnement=unlimited");
  const intake = await page.evaluate(() => {
    const widget = document.querySelector("[data-intake-wizard]");
    const next = widget.querySelector("[data-wizard-next]");
    const expect = (condition, message) => { if (!condition) throw new Error(message); };
    expect(next.disabled, "Intake initially disabled");
    let count = 0;
    for (const doel of ["sterker", "fitter", "afvallen", "spiermassa", "prestatie"]) for (const moment of ["ochtend", "middag", "avond", "wisselend"]) for (const begeleiding of ["wegwijs", "startplan", "coaching", "weet-nog-niet"]) {
      for (const value of [doel, moment, begeleiding]) { widget.querySelector(`[data-wizard-choices] input[value="${value}"]`).click(); expect(!next.disabled, "Intake answer enables next"); next.click(); }
      expect(!widget.querySelector("[data-wizard-result]").hidden, "Intake result visible");
      const link = new URL(widget.querySelector("[data-result-contact]").href);
      for (const [key, value] of Object.entries({ doel, moment, begeleiding, abonnement: "unlimited", onderwerp: "intake" })) expect(link.searchParams.get(key) === value, `Intake query ${key}`);
      expect(widget.querySelector("[data-progress]").value === 3, "Intake progress");
      widget.querySelector("[data-wizard-reset]").click(); expect(next.disabled, "Intake reset");
      expect(widget.querySelector("[data-membership-name]").textContent === "Onbeperkt trainen", "Product preserved"); count++;
    }
    widget.querySelector('[data-wizard-choices] input[value="sterker"]').click(); next.click(); widget.querySelector("[data-wizard-prev]").click();
    expect(widget.querySelector('[data-wizard-choices] input[value="sterker"]').checked, "Intake back preserves selection");
    return count;
  });
  assert.equal(intake, 80); report.interactions.intakeCombinations = intake;

  await ready(page, base + "/contact/?onderwerp=intake&abonnement=youth&doel=fitter&moment=avond&ervaring=ervaren&begeleiding=intensief");
  assert.equal(await page.locator('[name="experience"]').inputValue(), "ervaren");
  assert.equal(await page.locator('[name="membership"]').inputValue(), "youth");
  await page.locator("[data-prepare-message]").click();
  assert.equal(await page.locator("[data-message-ready]").isVisible(), false);
  await page.locator('[name="name"]').fill("Test Gebruiker");
  await page.locator('[name="email"]').fill("test@example.nl");
  await page.locator('[name="message"]').fill("Graag een afspraak & informatie: é, ? +.");
  await page.locator("[data-prepare-message]").click();
  assert.equal(await page.locator("[data-message-ready]").isVisible(), true);
  const mail = new URL(await page.locator("[data-open-email]").getAttribute("href"));
  assert.equal(mail.protocol, "mailto:"); assert.equal(mail.pathname, "info@absolutely-fit.nl");
  assert.ok(mail.searchParams.get("body").includes("Graag een afspraak & informatie: é, ? +."));
  assert.ok(mail.searchParams.get("body").includes("Ervaring:"));
  await page.locator("[data-copy-message]").click();
  await page.waitForFunction(() => document.querySelector("[data-copy-status]").textContent.includes("gekopieerd"));
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), await page.locator("[data-prepared-message]").inputValue());
  await page.locator('[name="message"]').fill("Aangepast bericht");
  assert.equal(await page.locator("[data-message-ready]").isVisible(), false);
  await ready(page, base + "/contact/?onderwerp=evil&abonnement=evil&doel=evil&moment=evil&ervaring=evil&begeleiding=evil");
  for (const name of ["topic", "membership", "goal", "moment", "experience", "guidance"]) assert.equal(await page.locator(`[name="${name}"]`).inputValue(), "");
  report.interactions.contact = "context allowlist, required validation, encoded mailto, clipboard and stale message invalidation";

  await ready(page, base + "/rooster/");
  assert.equal(await page.locator(".pr-day").count(), 7);
  assert.match(await page.locator("[data-week-range]").textContent(), /12 oktober.*18 oktober 2026/);
  const initial = await page.locator("[data-week-range]").textContent();
  await page.locator("[data-week-next]").click(); assert.notEqual(await page.locator("[data-week-range]").textContent(), initial);
  await page.locator("[data-week-prev]").click(); assert.equal(await page.locator("[data-week-range]").textContent(), initial);
  await page.locator("[data-week-prev]").click(); await page.locator("[data-week-current]").click();
  assert.equal(await page.locator("[data-week-range]").textContent(), initial);
  assert.equal(await page.locator(".pr-day.is-today").count(), 1);
  for (const button of await page.locator("[data-training-filter]").all()) { await button.click(); assert.equal(await button.getAttribute("aria-pressed"), "true"); }
  report.interactions.schedule = "Amsterdam week, today, seven regular days, previous/next/reset and all training filters";

  await ready(page, base + "/kennisbank/");
  assert.equal(await page.locator("[data-knowledge-card]").count(), 9);
  await page.locator("[data-knowledge-search]").fill("onvindbarezoekterm");
  assert.equal(await page.locator("[data-knowledge-empty]").isVisible(), true);
  await page.locator("[data-knowledge-reset]").click();
  assert.equal(await page.locator("[data-knowledge-card]:visible").count(), 9);
  for (const button of await page.locator("[data-category-filter]").all()) { await button.click(); assert.equal(await button.getAttribute("aria-pressed"), "true"); assert.ok(await page.locator("[data-knowledge-card]:visible").count() > 0); }
  await ready(page, base + "/veelgestelde-vragen/");
  assert.equal(await page.locator("[data-faq-item]").count(), 10);
  await page.locator("[data-faq-search]").fill("onvindbarezoekterm");
  assert.equal(await page.locator("[data-faq-empty]").isVisible(), true);
  await page.locator("[data-faq-reset]").click();
  const summary = page.locator("[data-faq-item] summary").first(); await summary.focus(); await page.keyboard.press("Enter");
  assert.equal(await page.locator("[data-faq-item]").first().evaluate((item) => item.open), true);
  for (const link of await page.locator(".afk-faq-nav a").all()) { const target = await link.getAttribute("href"); await link.click(); assert.equal(await page.locator(target).count(), 1); }
  for (const article of pages.filter((entry) => entry.article)) {
    await ready(page, routeURL(base, article.path));
    for (const link of await page.locator("[data-article-anchor]").all()) { const target = await link.getAttribute("href"); assert.equal(await page.locator(target).count(), 1); }
  }
  report.interactions.knowledge = "nine articles, search/empty/reset, all categories, ten FAQ accordions, category navigation and all article anchors";

  // Motion uses a live animation clock; the parity clock is fixed only for
  // identical dates/opening labels in the reduced-motion screenshots above.
  const motionContext = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: "nl-NL", timezoneId: "Europe/Amsterdam", reducedMotion: "no-preference" });
  const motionPage = await motionContext.newPage();
  motionPage.on("pageerror", (error) => errors.push(error.message));
  await ready(motionPage, base + "/");
  await motionPage.waitForFunction(() => Number(getComputedStyle(document.querySelector(".p-hero-copy")).opacity) > 0.99 && Number(getComputedStyle(document.querySelector(".p-hero-stage")).opacity) > 0.99);
  await motionPage.screenshot({ path: path.join(output, "home-390-normal-motion.png"), fullPage: false, animations: "disabled" });
  await motionContext.close();
  report.interactions.motion = "all parity checks with reduced motion; normal Motion hero completes and content is visible";
  assert.deepEqual(errors, [], "No browser JavaScript errors");
  report.status = "passed";
  await writeFile(path.join(output, "browser-results.json"), JSON.stringify(report, null, 2) + "\n");
  console.log(`Browser passed: ${report.viewports.reduce((sum, row) => sum + row.routes, 0)} route/viewport checks, ${report.screenshots.length} screenshots, 45 training + 80 intake combinations and menu/gallery/contact/schedule/search/FAQ/motion.`);
} catch (error) {
  report.status = "failed"; report.failure = error.message;
  await page.screenshot({ path: path.join(output, "failure.png"), fullPage: true }).catch(() => {});
  await writeFile(path.join(output, "browser-results.json"), JSON.stringify(report, null, 2) + "\n");
  throw error;
} finally { await browser.close(); }
