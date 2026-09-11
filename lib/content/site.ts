export const site = {
  name: "Absolutely Fit",
  foundingDate: "2008",
  description: "Familiegedreven sportschool in het Scheveningse Havenkwartier sinds 2008, met persoonlijke begeleiding voor ieder niveau.",
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
  phoneDisplay: "070 358 77 81",
  phoneHref: "+31703587781",
  landlineDisplay: "070 358 77 81",
  landlineHref: "+31703587781",
  email: "info@absolutely-fit.nl",
  location: `${site.address.streetAddress}, ${site.address.postalCode} ${site.address.addressLocality}`,
} as const;

export const customerFacts = {
  startingPrice: "€ 24,50 per maand",
  intake: "Een intakegesprek is inbegrepen bij bepaalde abonnementen of bij Personal Training.",
  flexibility: "Kies voor individueel vrij sporten of ga aan de slag onder professionele begeleiding.",
  personalTraining: "Uitgebreide atletenvoorbereiding en coaching voor diverse sporten, waaronder powerliften en gewichtheffen. Ook gespecialiseerd in Strength & Conditioning voor diverse sportdisciplines en gericht op afvaltrajecten. Neem contact op voor meer informatie.",
} as const;

export const callsToAction = {
  freeIntake: "Plan je gratis persoonlijke intake",
  freeIntakeShort: "Gratis persoonlijke intake",
  contact: "Neem contact op",
} as const;

export const officialLinks = {
  directions: "https://www.google.com/maps/search/?api=1&query=Doctor+Lelykade+240+Den+Haag",
} as const;
