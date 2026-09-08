import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import ts from "typescript";
import { fileURLToPath, pathToFileURL } from "node:url";
import { findProtectedClaim } from "../scripts/content-safety-rules.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (relativePath) => readFileSync(path.join(root, relativePath), "utf8");

async function importStandaloneTypeScript(relativePath) {
  const source = read(relativePath);
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
    fileName: relativePath,
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}

async function importClientUtility(relativePath) {
  const source = read(relativePath).replace(
    /import \{ useEffect, useMemo, useState \} from "react";/,
    "const useEffect = () => {}; const useMemo = (factory) => factory(); const useState = (value) => [value, () => {}];",
  );
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
    fileName: relativePath,
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}

test("the central membership inventory contains exactly the four confirmed products", async () => {
  const contentModule = await importStandaloneTypeScript("lib/content/memberships.ts");
  assert.deepEqual(contentModule.memberships.map(({ name }) => name), ["1× per week", "Onbeperkt trainen", "10-rittenkaart", "Jeugd"]);
  assert.equal(contentModule.memberships.length, 4);
  for (const membership of contentModule.memberships) {
    assert.equal(membership.price, null);
    assert.equal(membership.contractDetails, null);
    assert.equal(membership.ooievaarspasEligibility, "unknown");
    assert.ok(membership.needsConfirmation.length > 0);
  }
});

test("opening status uses the exact seven-day source around Amsterdam day boundaries", async () => {
  const hoursModule = await importStandaloneTypeScript("lib/content/opening-hours.ts");
  assert.equal(Object.keys(hoursModule.openingHours).length, 7);
  const checks = [
    ["2026-09-07T04:59:00Z", false], // Monday 06:59 CEST
    ["2026-09-07T05:00:00Z", true],  // Monday 07:00 CEST
    ["2026-09-07T19:59:00Z", true],  // Monday 21:59 CEST
    ["2026-09-07T20:00:00Z", false], // Monday 22:00 CEST
    ["2026-09-11T18:59:00Z", true],  // Friday 20:59 CEST
    ["2026-09-11T19:00:00Z", false], // Friday 21:00 CEST
    ["2026-09-12T05:59:00Z", false], // Saturday 07:59 CEST
    ["2026-09-12T06:00:00Z", true],  // Saturday 08:00 CEST
    ["2026-09-12T13:00:00Z", false], // Saturday 15:00 CEST
    ["2026-12-07T06:00:00Z", true],  // Monday 07:00 CET
  ];
  for (const [iso, expected] of checks) assert.equal(hoursModule.getOpeningStatus(new Date(iso)).isOpen, expected, iso);
  assert.equal(hoursModule.formatOpeningRange(hoursModule.openingHours.friday[0]), "07:00–21:00");
  assert.equal(hoursModule.formatCustomerOpeningStatus(hoursModule.getOpeningStatus(new Date("2026-09-07T05:00:00Z"))), "GEOPEND - VANDAAG TOT 22:00 UUR");
  assert.equal(hoursModule.formatCustomerOpeningStatus(hoursModule.getOpeningStatus(new Date("2026-09-07T04:59:00Z"))), "GESLOTEN - GEOPEND VANAF 07:00 UUR");
  assert.equal(hoursModule.formatCustomerOpeningStatus(hoursModule.getOpeningStatus(new Date("2026-09-07T20:00:00Z"))), "GESLOTEN - GEOPEND VANAF 07:00 UUR");
  assert.equal(hoursModule.formatCustomerOpeningStatus(hoursModule.getOpeningStatus(new Date("2026-09-11T19:00:00Z"))), "GESLOTEN - GEOPEND VANAF 08:00 UUR");
});

test("customer schedules derive the current ISO week in Europe/Amsterdam", async () => {
  const weekModule = await importClientUtility("lib/content/current-week.ts");
  const current = weekModule.getAmsterdamWeek(new Date("2026-09-08T12:00:00Z"));
  assert.equal(current.isoWeek, 37);
  assert.equal(current.weekLabel, "Week 37");
  assert.equal(current.rangeLabel, "7 — 13 september 2026");
  assert.equal(current.days[1].date, "08 SEP");
  assert.equal(current.days[1].isToday, true);
  assert.equal(current.days.filter(({ isToday }) => isToday).length, 1);

  const next = weekModule.getAmsterdamWeek(new Date("2026-09-08T12:00:00Z"), 1);
  assert.equal(next.isoWeek, 38);
  assert.equal(next.rangeLabel, "14 — 20 september 2026");

  const amsterdamMidnight = weekModule.getAmsterdamWeek(new Date("2027-01-03T23:30:00Z"));
  assert.equal(amsterdamMidnight.isoWeek, 1);
  assert.equal(amsterdamMidnight.days[0].isoDate, "2027-01-04");
  assert.equal(amsterdamMidnight.days[0].isToday, true);
});

test("Ooievaarspas, NTC and affiliate publication gates are explicit", () => {
  const approvals = JSON.parse(read("lib/content/publication-approvals.json"));
  assert.equal(approvals.ooievaarspasLogoLicenseConfirmed, true);
  assert.equal(approvals.nocNsfLogoLicenseConfirmed, true);
  assert.equal(approvals.nocNsfEditorialContextApproved, true);
  assert.equal(approvals.nocNsfCertificationExistsOwnerConfirmed, true);
  assert.equal(approvals.nocNsfCertificationAdvertisingApproved, false);
  assert.equal(approvals.formalNocNsfCredentialDetailsStored, false);
  assert.equal(approvals.historicPerformanceClaimsApproved, true);
  assert.equal(approvals.xxlCreativeLicenseConfirmed, true);
  const partners = read("lib/content/partners.ts");
  assert.match(partners, /50% korting op een daarvoor in aanmerking komend abonnement/);
  assert.match(partners, /eligibilityByProduct:\s*"unknown"/);
  assert.match(partners, /XXL_AFFILIATE_APPROVED === "true"/);
  assert.match(partners, /approvedHttpsUrl/);
  assert.match(partners, /creativeAsset:\s*"\/partners\/xxl-product-range\.avif"/);
  const claims = read("lib/content/claims.ts");
  assert.match(claims, /logoPermission:\s*approvals\.nocNsfLogoLicenseConfirmed/);
  assert.match(claims, /status:\s*"owner-approved-publication"/);
  assert.match(claims, /exactOfficialName:\s*null/);
  assert.match(claims, /registrationNumber:\s*null/);
  const component = read("components/content-sections.tsx");
  const topsportPage = read("app/topsport-en-ntc/page.tsx");
  assert.doesNotMatch(`${component}\n${topsportPage}`, /geen certificeringsclaim|geen specifieke actuele erkenning|niet als certificeringsclaim gepresenteerd/i);
  assert.match(component, /if \(!xxlAffiliate\.enabled \|\| !xxlAffiliate\.affiliateUrl/);
  assert.match(component, /rel="sponsored noopener noreferrer"/);
  assert.match(partners, /Affiliate link/);
});

test("protected sport-mark claim variants fail closed while transparent fallbacks remain allowed", () => {
  for (const claim of [
    "NOC*NSF-erkend",
    "NOC NSF gecertificeerd",
    "Officieel TeamNL-partner",
    "Erkend door NOC*NSF",
    "Olympisch gecertificeerd",
    "Onze Olympische atleten trainen hier",
  ]) assert.ok(findProtectedClaim(claim), `claim should be blocked: ${claim}`);

  for (const fallback of [
    "De NTC- of NOC*NSF-status is nog niet geverifieerd.",
    "Beschermde NOC*NSF- en Olympische merkelementen worden niet gebruikt.",
    "Geen beschermd logo of specifieke erkenningsclaim zonder bewijs.",
  ]) assert.equal(findProtectedClaim(fallback), null, `safe fallback should remain allowed: ${fallback}`);
});

test("structured data is central, price-free and excludes unverified credentials", () => {
  const schema = read("lib/structured-data.ts");
  assert.match(schema, /"@type": "ExerciseGym"/);
  assert.match(schema, /foundingDate:\s*site\.foundingDate/);
  assert.match(schema, /openingDays\.flatMap/);
  assert.match(schema, /itemListElement:\s*memberships\.map/);
  assert.doesNotMatch(schema, /price|rating|review|affiliation|award|credential/i);
  assert.match(schema, /"@type": "FAQPage"/);
  assert.match(schema, /"@type": "Article"/);
  assert.match(read("components/structured-data.tsx"), /replace\(\/<\/g, "\\\\u003c"\)/);
});

test("required reports, source originals and approved public partner assets are present", () => {
  for (const file of [
    "docs/CONTENT-MIGRATION-MATRIX.md", "docs/FACTS-AND-RIGHTS-REGISTER.md",
    "docs/EXTERNAL-LISTING-CORRECTIONS.md", "docs/SEO-IMPLEMENTATION-REPORT.md",
    "docs/VERIFICATION-REPORT.md", "assets/source/partners/RIGHTS-NOTICE.md",
    "assets/source/xxl/RIGHTS-NOTICE.md", "assets/source/xxl/32535009.avif",
    "lib/content/publication-approvals.json",
  ]) assert.equal(existsSync(path.join(root, file)), true, file);
  const publicFiles = [];
  const visit = (relative) => {
    for (const entry of readdirSync(path.join(root, relative), { withFileTypes: true })) {
      const next = path.join(relative, entry.name);
      if (entry.isDirectory()) visit(next); else publicFiles.push(next);
    }
  };
  visit("public");
  const approvedAssets = new Map([
    ["public/partners/noc-nsf-full-color.svg", "2e30b2ec125c15c13c12c510279d7f234f82fc46e0ef627cf3dc416ddfa6397b"],
    ["public/partners/ooievaarspas.svg", "601c0fbcffea25a9bee9016741a297bde537ffee9f7125ec4e3e7314913e9fd2"],
    ["public/partners/xxl-product-range.avif", "6aa341ccac817ad013a77a33d2eb743d33faedd103a0afddb90c0e0b9d4c0d5e"],
  ]);
  for (const [file, expectedHash] of approvedAssets) {
    assert.equal(publicFiles.includes(file), true, file);
    const hash = createHash("sha256").update(readFileSync(path.join(root, file))).digest("hex");
    assert.equal(hash, expectedHash, `${file} must remain an unmodified approved asset`);
  }
  assert.equal(pathToFileURL(path.join(root, "assets/source/xxl/32535009.avif")).protocol, "file:");
});
