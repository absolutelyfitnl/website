import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { protectedAthleteClaimPatterns, protectedCredentialClaimPatterns } from "./content-safety-rules.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const approvals = JSON.parse(readFileSync(path.join(root, "lib/content/publication-approvals.json"), "utf8"));
const nocMarkAllowed = approvals.nocNsfLogoLicenseConfirmed === true && approvals.nocNsfEditorialContextApproved === true;
const formalCredentialAllowed = approvals.formalNocNsfCredentialEvidenceConfirmed === true;
const historicClaimsAllowed = approvals.historicPerformanceClaimsApproved === true;
const xxlCreativeAllowed = approvals.xxlCreativeLicenseConfirmed === true;
const deployableTextRoots = ["app", "components", "lib"];
const textExtensions = new Set([".ts", ".tsx", ".js", ".mjs", ".css", ".json"]);
const protectedName = /(?:noc[-_. ]?nsf|team[-_. ]?nl|olympi(?:c|sch)|olympische[-_. ]?ringen)/i;
const protectedReference = /(?:src\s*=|url\s*\(|image\s*:|images\s*:)[^\n]{0,180}(?:noc[-_. ]?nsf|team[-_. ]?nl|olympi(?:c|sch))/i;
const historicPublicClaims = [
  /(?:Nederlandse|Olympische|internationale) (?:kampioenen|atleten) op het hoogste niveau/i,
  /wereldkampioen(?:en)? powerliften/i,
];
const prohibitedPublicClaims = [
  /altijd open op feestdagen/i,
  /lidmaatschap (?:pauzeren|bevriezen) (?:voor|vanwege) vakantie/i,
  /(?:sauna|solarium|zonnebank) (?:inbegrepen|aanwezig|beschikbaar)/i,
];
const nonPublicXxlHash = "6aa341ccac817ad013a77a33d2eb743d33faedd103a0afddb90c0e0b9d4c0d5e";
const approvedXxlPublicPath = "public/partners/xxl-product-range.avif";

function walk(relativeDir) {
  const absoluteDir = path.join(root, relativeDir);
  if (!existsSync(absoluteDir)) return [];
  return readdirSync(absoluteDir, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(relativeDir, entry.name);
    return entry.isDirectory() ? walk(relativePath) : [relativePath];
  });
}

const errors = [];
const textFiles = deployableTextRoots.flatMap(walk).filter((file) => textExtensions.has(path.extname(file)));
for (const file of textFiles) {
  const source = readFileSync(path.join(root, file), "utf8");
  if (!nocMarkAllowed && protectedReference.test(source)) {
    errors.push(`${file}: protected NOC*NSF/TeamNL/Olympic asset reference without licence flag`);
  }
  const credentialClaim = protectedCredentialClaimPatterns.find((pattern) => pattern.test(source));
  if (!formalCredentialAllowed && credentialClaim) {
    errors.push(`${file}: protected accreditation or partnership claim without credential evidence matched ${credentialClaim}`);
  }
  const athleteClaim = protectedAthleteClaimPatterns.find((pattern) => pattern.test(source));
  if (!historicClaimsAllowed && athleteClaim) {
    errors.push(`${file}: protected athlete claim without owner approval matched ${athleteClaim}`);
  }
  if (!historicClaimsAllowed) {
    for (const pattern of historicPublicClaims) {
      if (pattern.test(source)) errors.push(`${file}: historical performance claim without owner approval matched ${pattern}`);
    }
  }
  for (const pattern of prohibitedPublicClaims) {
    if (pattern.test(source)) errors.push(`${file}: prohibited or unverified public claim matched ${pattern}`);
  }
}

for (const file of walk("public")) {
  const absolute = path.join(root, file);
  if (!statSync(absolute).isFile()) continue;
  if (!nocMarkAllowed && protectedName.test(file)) {
    errors.push(`${file}: protected mark is present in public output without licence flag`);
  }
  const hash = createHash("sha256").update(readFileSync(absolute)).digest("hex");
  if (hash === nonPublicXxlHash && (!xxlCreativeAllowed || file !== approvedXxlPublicPath)) {
    errors.push(`${file}: XXL source creative is public without the recorded approval or approved path`);
  }
}

assert.equal(nocMarkAllowed, true, "The checked-in NOC*NSF mark requires owner-confirmed logo and editorial-context rights");
assert.equal(xxlCreativeAllowed, true, "The checked-in XXL creative requires owner-confirmed publication rights");
assert.equal(existsSync(path.join(root, "public/partners/noc-nsf-full-color.svg")), true, "Approved NOC*NSF mark is missing");
assert.equal(existsSync(path.join(root, "public/partners/ooievaarspas.svg")), true, "Approved Ooievaarspas mark is missing");
assert.equal(existsSync(path.join(root, approvedXxlPublicPath)), true, "Approved XXL creative is missing");

const affiliate = `${readFileSync(path.join(root, "components/content-sections.tsx"), "utf8")}\n${readFileSync(path.join(root, "lib/content/partners.ts"), "utf8")}`;
assert.match(affiliate, /!xxlAffiliate\.enabled\s*\|\|\s*!xxlAffiliate\.affiliateUrl/, "Affiliate component must stay hidden without an approved URL and enable flag");
assert.match(affiliate, /rel="sponsored noopener noreferrer"/, "Active affiliate links require sponsored/noopener/noreferrer");
assert.match(affiliate, /Affiliate link/, "Active affiliate placement requires a visible disclosure");

if (errors.length) {
  throw new Error(`Content safety guard failed:\n- ${errors.join("\n- ")}`);
}

console.log(`Content safety guard passed (${textFiles.length} source files and ${walk("public").length} public assets checked).`);
