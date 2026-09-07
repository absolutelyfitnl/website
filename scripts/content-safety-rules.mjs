const protectedParty = String.raw`(?:NOC\s*\*?\s*NSF|TeamNL|Olympi(?:sch|sche|c))`;
const protectedStatus = String.raw`(?:gecertificeerd|erkend|goedgekeurd|partner|partnership|sponsor|sponsoring|keurmerk|certificaat|certificering|accreditatie)`;

export const protectedClaimPatterns = [
  new RegExp(`${protectedParty}[\\s–—/:_-]{0,8}${protectedStatus}\\b`, "i"),
  new RegExp(`${protectedStatus}\\b[\\s–—/:_-]{0,24}(?:door|van|bij)?\\s*${protectedParty}\\b`, "i"),
  /Olympische?\s+(?:atleet|atleten|sporter|sporters|kampioen|kampioenen)\b/i,
];

export function findProtectedClaim(source) {
  return protectedClaimPatterns.find((pattern) => pattern.test(source)) ?? null;
}
