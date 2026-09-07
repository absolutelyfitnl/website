import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findProtectedClaim } from "./content-safety-rules.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const deployableTextRoots = ["app", "components", "lib"];
const textExtensions = new Set([".ts", ".tsx", ".js", ".mjs", ".css", ".json"]);
const protectedName = /(?:noc[-_. ]?nsf|team[-_. ]?nl|olympi(?:c|sch)|olympische[-_. ]?ringen)/i;
const protectedReference = /(?:src\s*=|url\s*\(|image\s*:|images\s*:)[^\n]{0,180}(?:noc[-_. ]?nsf|team[-_. ]?nl|olympi(?:c|sch))/i;
const prohibitedPublicClaims = [
  /(?:Nederlandse|Olympische|internationale) (?:kampioenen|atleten) op het hoogste niveau/i,
  /altijd open op feestdagen/i,
  /lidmaatschap (?:pauzeren|bevriezen) (?:voor|vanwege) vakantie/i,
  /(?:sauna|solarium|zonnebank) (?:inbegrepen|aanwezig|beschikbaar)/i,
];
const nonPublicXxlHash = "6aa341ccac817ad013a77a33d2eb743d33faedd103a0afddb90c0e0b9d4c0d5e";

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
  if (process.env.NOC_NSF_LOGO_LICENSE_CONFIRMED !== "true" && protectedReference.test(source)) {
    errors.push(`${file}: protected NOC*NSF/TeamNL/Olympic asset reference without licence flag`);
  }
  const protectedClaim = findProtectedClaim(source);
  if (process.env.NOC_NSF_LOGO_LICENSE_CONFIRMED !== "true" && protectedClaim) {
    errors.push(`${file}: protected accreditation, partnership or athlete claim without evidence flag matched ${protectedClaim}`);
  }
  for (const pattern of prohibitedPublicClaims) {
    if (pattern.test(source)) errors.push(`${file}: prohibited or unverified public claim matched ${pattern}`);
  }
}

for (const file of walk("public")) {
  const absolute = path.join(root, file);
  if (!statSync(absolute).isFile()) continue;
  if (process.env.NOC_NSF_LOGO_LICENSE_CONFIRMED !== "true" && protectedName.test(file)) {
    errors.push(`${file}: protected mark is present in public output without licence flag`);
  }
  const hash = createHash("sha256").update(readFileSync(absolute)).digest("hex");
  if (hash === nonPublicXxlHash) errors.push(`${file}: non-public XXL source creative was copied into public output`);
}

const affiliate = `${readFileSync(path.join(root, "components/content-sections.tsx"), "utf8")}\n${readFileSync(path.join(root, "lib/content/partners.ts"), "utf8")}`;
assert.match(affiliate, /!xxlAffiliate\.enabled\s*\|\|\s*!xxlAffiliate\.affiliateUrl/, "Affiliate component must stay hidden without an approved URL and enable flag");
assert.match(affiliate, /rel="sponsored noopener noreferrer"/, "Active affiliate links require sponsored/noopener/noreferrer");
assert.match(affiliate, /Affiliate link/, "Active affiliate placement requires a visible disclosure");

if (errors.length) {
  throw new Error(`Content safety guard failed:\n- ${errors.join("\n- ")}`);
}

console.log(`Content safety guard passed (${textFiles.length} source files and ${walk("public").length} public assets checked).`);
