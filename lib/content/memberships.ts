export type Membership = {
  id: "weekly" | "unlimited" | "ten-visit" | "youth";
  name: string;
  kind: "lidmaatschap" | "rittenkaart";
  summary: string;
  confirmedFeatures: readonly string[];
  price: { amount: number; currency: "EUR"; frequency?: "one-off" | "month" | "year" } | null;
  contractDetails: { durationMonths?: number; noticePeriod?: string; paymentFrequency?: string } | null;
  ooievaarspasEligibility: "unknown" | "eligible" | "not-eligible";
  ctaHref: string;
  lastVerifiedAt: string;
  needsConfirmation: readonly string[];
};

export const memberships: readonly Membership[] = [
  {
    id: "weekly",
    name: "1× per week",
    kind: "lidmaatschap",
    summary: "Voor wie één vast trainingsmoment per week wil opbouwen.",
    confirmedFeatures: ["Eén trainingsmoment per week", "Persoonlijk bespreken tijdens de gratis intake"],
    price: null,
    contractDetails: null,
    ooievaarspasEligibility: "unknown",
    ctaHref: "/gratis-persoonlijke-intake?abonnement=weekly",
    lastVerifiedAt: "2026-09-07",
    needsConfirmation: ["prijs", "looptijd", "betaalfrequentie", "opzegvoorwaarden", "Ooievaarspas-toepassing"],
  },
  {
    id: "unlimited",
    name: "Onbeperkt trainen",
    kind: "lidmaatschap",
    summary: "Voor wie vaker wil trainen en het weekritme flexibel wil indelen.",
    confirmedFeatures: ["Onbeperkt trainen binnen de actuele openingstijden", "Persoonlijk bespreken tijdens de gratis intake"],
    price: null,
    contractDetails: null,
    ooievaarspasEligibility: "unknown",
    ctaHref: "/gratis-persoonlijke-intake?abonnement=unlimited",
    lastVerifiedAt: "2026-09-07",
    needsConfirmation: ["prijs", "looptijd", "betaalfrequentie", "opzegvoorwaarden", "Ooievaarspas-toepassing"],
  },
  {
    id: "ten-visit",
    name: "10-rittenkaart",
    kind: "rittenkaart",
    summary: "Een losse reeks van tien trainingsbezoeken, zonder deze automatisch als abonnement te presenteren.",
    confirmedFeatures: ["Tien trainingsbezoeken", "Actuele geldigheid en voorwaarden persoonlijk navragen"],
    price: null,
    contractDetails: null,
    ooievaarspasEligibility: "unknown",
    ctaHref: "/gratis-persoonlijke-intake?abonnement=ten-visit",
    lastVerifiedAt: "2026-09-07",
    needsConfirmation: ["prijs", "geldigheid", "overdraagbaarheid", "Ooievaarspas-toepassing"],
  },
  {
    id: "youth",
    name: "Jeugd",
    kind: "lidmaatschap",
    summary: "De trainingsmogelijkheid voor jeugd, met leeftijd en praktische voorwaarden persoonlijk afgestemd.",
    confirmedFeatures: ["Jeugdproduct", "Leeftijd en begeleiding tijdens de gratis intake bespreken"],
    price: null,
    contractDetails: null,
    ooievaarspasEligibility: "unknown",
    ctaHref: "/gratis-persoonlijke-intake?abonnement=youth",
    lastVerifiedAt: "2026-09-07",
    needsConfirmation: ["leeftijdsgrenzen", "prijs", "looptijd", "begeleidingsvoorwaarden", "Ooievaarspas-toepassing"],
  },
] as const;
