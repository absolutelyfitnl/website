import assert from "node:assert/strict";
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
});

test("Ooievaarspas, NTC and affiliate publication gates are explicit", () => {
  const partners = read("lib/content/partners.ts");
  assert.match(partners, /50% korting op een daarvoor in aanmerking komend abonnement/);
  assert.match(partners, /eligibilityByProduct:\s*"unknown"/);
  assert.match(partners, /XXL_AFFILIATE_APPROVED === "true"/);
  assert.match(partners, /approvedHttpsUrl/);
  const claims = read("lib/content/claims.ts");
  assert.match(claims, /logoPermission:\s*false/);
  assert.match(claims, /status:\s*"needsConfirmation"/);
  const component = read("components/content-sections.tsx");
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

test("required reports and the non-public source asset are present", () => {
  for (const file of [
    "docs/CONTENT-MIGRATION-MATRIX.md", "docs/FACTS-AND-RIGHTS-REGISTER.md",
    "docs/EXTERNAL-LISTING-CORRECTIONS.md", "docs/SEO-IMPLEMENTATION-REPORT.md",
    "docs/VERIFICATION-REPORT.md", "assets/source/xxl/RIGHTS-NOTICE.md", "assets/source/xxl/32535009.avif",
  ]) assert.equal(existsSync(path.join(root, file)), true, file);
  const publicFiles = [];
  const visit = (relative) => {
    for (const entry of readdirSync(path.join(root, relative), { withFileTypes: true })) {
      const next = path.join(relative, entry.name);
      if (entry.isDirectory()) visit(next); else publicFiles.push(next);
    }
  };
  visit("public");
  assert.equal(publicFiles.some((file) => /32535009|noc[-_. ]?nsf|team[-_. ]?nl|olymp/i.test(file)), false);
  assert.equal(pathToFileURL(path.join(root, "assets/source/xxl/32535009.avif")).protocol, "file:");
});
