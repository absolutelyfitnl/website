export const clubStory = {
  since: "1998",
  neighborhood: "Scheveningse Havenkwartier",
  publicSummary: "Sinds 1998 is Absolutely Fit een vaste trainingsplek in het Scheveningse Havenkwartier: persoonlijk, nuchter en toegankelijk voor verschillende niveaus.",
  source: "Rond de Haven, zomer 2026, pagina 6; geparafraseerd",
  publicationStatus: "owner-approved",
} as const;

export const teamProfiles = [
  {
    id: "rik-priester",
    name: "Rik Priester",
    role: "Oprichter en coach",
    summary: "Bouwde Absolutely Fit vanuit de krachtsportpraktijk op als een club waar techniek, aandacht en realistische ontwikkeling centraal staan.",
    specialties: ["Krachttraining", "Powerlifting", "Gewichtheffen", "Persoonlijke begeleiding"],
    publicationStatus: "owner-approved",
  },
  {
    id: "clubteam",
    name: "Het clubteam",
    role: "Begeleiding en ontvangst",
    summary: "Helpt sporters om rustig te beginnen, vragen te stellen en een trainingsritme te vinden dat bij hun niveau past.",
    specialties: ["Gratis persoonlijke intake", "Techniekuitleg", "Trainingsopbouw", "Gastvrije clubvloer"],
    publicationStatus: "generic-safe-copy",
  },
] as const;

export const trustCredential = {
  publicLabel: "Topsportervaring vertaald naar ieder niveau",
  exactOfficialName: null,
  issuingOrganization: null,
  registrationNumber: null,
  scope: null,
  issuedAt: null,
  expiresAt: null,
  evidenceDocument: null,
  logoPermission: false,
  verifiedAt: null,
  status: "needsConfirmation",
  publicExplanation: "De club werkt vanuit ervaring met kracht- en prestatiesport. De precieze actuele NTC- of NOC*NSF-status en het recht op merkgebruik zijn nog niet als publieke certificeringsclaim geverifieerd.",
} as const;
