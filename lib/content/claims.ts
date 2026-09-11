import approvals from "@/lib/content/publication-approvals.json";

export const clubStory = {
  since: "2008",
  neighborhood: "Scheveningse Havenkwartier",
  publicSummary: "Sinds 2008 is Absolutely Fit een vaste trainingsplek in het Scheveningse Havenkwartier: persoonlijk, nuchter en toegankelijk voor verschillende niveaus.",
  source: "Rond de Haven, zomer 2026, pagina 6; geparafraseerd",
  publicationStatus: "owner-approved",
} as const;

export const teamProfiles = [
  {
    id: "rik-priester",
    name: "Rik Priester",
    role: "Oprichter en coach",
    summary: "Meervoudig Nederlands kampioen en wereldkampioen powerliften in 1990. Hij bouwde Absolutely Fit vanuit de krachtsportpraktijk op rond techniek, aandacht en realistische ontwikkeling.",
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
  logoAsset: "/partners/noc-nsf-full-color.svg",
  logoPermission: approvals.nocNsfLogoLicenseConfirmed,
  editorialContextApproved: approvals.nocNsfEditorialContextApproved,
  certificationExists: approvals.nocNsfCertificationExistsOwnerConfirmed,
  certificationAdvertisingApproved: approvals.nocNsfCertificationAdvertisingApproved,
  verifiedAt: approvals.approvedByOwnerAt,
  status: "owner-approved-publication",
  historicFacts: [
    "Meervoudig Nederlands kampioen powerliften",
    "Wereldkampioen powerliften in 1990",
    "Ervaring met sporters tot nationaal, internationaal en olympisch niveau",
  ],
  publicExplanation: "De ervaring van Absolutely Fit loopt van recreatieve krachttraining tot topsport en wordt op de clubvloer vertaald naar heldere techniek en persoonlijke trainingsopbouw.",
} as const;
