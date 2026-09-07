export const site = {
  name: "Absolutely Fit",
  foundingDate: "1998",
  description: "Familiegedreven sportschool in het Scheveningse Havenkwartier met persoonlijke begeleiding voor ieder niveau.",
  productionUrl: "https://abso.dgwebservices.nl",
  timeZone: "Europe/Amsterdam",
  address: {
    streetAddress: "Doctor Lelykade 240",
    postalCode: "2583 CP",
    addressLocality: "Den Haag",
    neighborhood: "Scheveningen",
    addressCountry: "NL",
  },
} as const;

export const contact = {
  phoneDisplay: "06 12 59 51 12",
  phoneHref: "+31612595112",
  landlineDisplay: "070 358 77 81",
  landlineHref: "+31703587781",
  email: "info@absolutely-fit.nl",
  location: `${site.address.streetAddress}, ${site.address.postalCode} ${site.address.addressLocality}`,
} as const;

export const callsToAction = {
  freeIntake: "Plan je gratis persoonlijke intake",
  freeIntakeShort: "Gratis persoonlijke intake",
  contact: "Neem contact op",
} as const;

export const officialLinks = {
  directions: "https://www.google.com/maps/search/?api=1&query=Doctor+Lelykade+240+Den+Haag",
} as const;
