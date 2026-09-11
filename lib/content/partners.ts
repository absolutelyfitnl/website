import approvals from "@/lib/content/publication-approvals.json";

const rawAffiliateUrl = process.env.NEXT_PUBLIC_XXL_AFFILIATE_URL?.trim();

function approvedHttpsUrl(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export const ooievaarspas = {
  discount: 50,
  claim: "Met een geldige Ooievaarspas ontvang je bij Absolutely Fit 50% korting op een daarvoor in aanmerking komend abonnement.",
  youthClaim: "Voor jeugd onder de 18 jaar geldt met de Ooievaarspas een vergoeding van 100 procent, mits dit de eerste sport is.",
  applicationNote: "Bespreek tijdens je gratis persoonlijke intake welke actuele abonnementsoptie en voorwaarden van toepassing zijn.",
  eligibilityByProduct: "unknown",
  logoAsset: "/partners/ooievaarspas.svg",
  logoPermission: approvals.ooievaarspasLogoLicenseConfirmed,
  officialOfferUrl: "https://ooievaarspas.nl/aanbiedingen/fitness-voor-iedereen-voel-je-absolutely-fit/",
  officialApplicationUrl: "https://www.denhaag.nl/nl/geld-en-schulden/ooievaarspas-aanvragen/",
} as const;

export const xxlAffiliate = {
  name: "XXL Nutrition",
  programUrl: "https://xxlnutrition.com/nl/awin-affiliate",
  affiliateUrl: approvedHttpsUrl(rawAffiliateUrl),
  enabled: Boolean(approvedHttpsUrl(rawAffiliateUrl)) && process.env.XXL_AFFILIATE_APPROVED === "true",
  creativeAsset: "/partners/xxl-product-range.avif",
  creativeLicenseConfirmed: approvals.xxlCreativeLicenseConfirmed,
  disclosure: "Affiliate link — als je via deze link iets koopt, kan Absolutely Fit een commissie ontvangen. Je koopt rechtstreeks bij XXL Nutrition.",
  adviceDisclaimer: "Dit is geen persoonlijk voedings-, medisch of prestatieadvies.",
  allowedPlacements: ["knowledge-article", "strength-training"] as const,
} as const;
