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
  applicationNote: "Bespreek tijdens je gratis persoonlijke intake welke actuele abonnementsoptie en voorwaarden van toepassing zijn.",
  eligibilityByProduct: "unknown",
  officialOfferUrl: "https://ooievaarspas.nl/aanbiedingen/fitness-voor-iedereen-voel-je-absolutely-fit/",
  officialApplicationUrl: "https://www.denhaag.nl/nl/geld-en-schulden/ooievaarspas-aanvragen/",
} as const;

export const xxlAffiliate = {
  name: "XXL Nutrition",
  programUrl: "https://xxlnutrition.com/nl/awin-affiliate",
  affiliateUrl: approvedHttpsUrl(rawAffiliateUrl),
  enabled: Boolean(approvedHttpsUrl(rawAffiliateUrl)) && process.env.XXL_AFFILIATE_APPROVED === "true",
  creativeLicenseConfirmed: process.env.XXL_CREATIVE_LICENSE_CONFIRMED === "true",
  disclosure: "Affiliate link — als je via deze link iets koopt, kan Absolutely Fit een commissie ontvangen. Je koopt rechtstreeks bij XXL Nutrition.",
  adviceDisclaimer: "Dit is geen persoonlijk voedings-, medisch of prestatieadvies.",
  allowedPlacements: ["knowledge-article", "strength-training"] as const,
} as const;
