export const navItems = [
  { href: "/sporten", label: "Sporten" },
  { href: "/begeleiding", label: "Begeleiding" },
  { href: "/abonnementen", label: "Abonnementen" },
  { href: "/rooster", label: "Rooster" },
  { href: "/over-ons", label: "Over ons" },
  { href: "/kennisbank", label: "Kennisbank" },
  { href: "/contact", label: "Contact" },
];

export const footerItems = [
  { href: "/gratis-persoonlijke-intake", label: "Gratis persoonlijke intake", group: "Starten" },
  { href: "/abonnementen", label: "Abonnementen", group: "Starten" },
  { href: "/ooievaarspas", label: "Ooievaarspas", group: "Starten" },
  { href: "/personal-training", label: "Personal training", group: "Trainen" },
  { href: "/sporten", label: "Trainingsaanbod", group: "Trainen" },
  { href: "/topsport-en-ntc", label: "Topsport & NTC-status", group: "Trainen" },
  { href: "/over-ons", label: "Ons verhaal", group: "De club" },
  { href: "/team", label: "Team", group: "De club" },
  { href: "/in-de-media/rond-de-haven-2026", label: "In de media", group: "De club" },
  { href: "/openingstijden", label: "Openingstijden", group: "Praktisch" },
  { href: "/veelgestelde-vragen", label: "Veelgestelde vragen", group: "Praktisch" },
  { href: "/contact", label: "Contact & route", group: "Praktisch" },
] as const;

export const disciplines = [
  "Cardio- en conditietraining",
  "Spierconditietraining",
  "Gewichtheffen",
  "Powerlifting",
  "Bodybuilding",
  "Krachttraining",
  "Techniektraining",
  "Personal training",
  "Sportspecifieke training",
  "Persoonlijke trainingsprogramma’s",
  "Strength & Conditioning",
];

export const programs = [
  { slug: "krachttraining", label: "Krachttraining", number: "01", intro: "Bouw kracht, spiermassa en belastbaarheid op met vrije gewichten, machines en een doordachte trainingsopbouw.", forWhom: "Voor iedereen die sterker wil worden, van eerste training tot ervaren krachtsporter.", approach: ["Technisch leren bewegen", "Belasting rustig opbouwen", "Voortgang planmatig volgen"] },
  { slug: "cardio-conditie", label: "Cardio & conditie", number: "02", intro: "Werk aan je uithoudingsvermogen, dagelijkse energie en algemene fitheid op een tempo dat bij jou past.", forWhom: "Voor beginnende sporters, herstarters en iedereen die conditie gericht wil verbeteren.", approach: ["Passend startniveau", "Afwisseling in intensiteit", "Combinatie met kracht"] },
  { slug: "powerlifting-gewichtheffen", label: "Powerlifting & gewichtheffen", number: "03", intro: "Ontwikkel techniek, kracht en vertrouwen in de belangrijkste lifts met begeleiding uit de krachtsportpraktijk.", forWhom: "Voor sporters die serieus aan squat, bench press, deadlift of gewichtheftechniek willen werken.", approach: ["Techniekanalyse", "Gerichte programmering", "Wedstrijdcontext waar relevant"] },
  { slug: "personal-training", label: "Personal training", number: "04", intro: "Eén-op-één werken aan jouw doel met volledige aandacht voor uitvoering, trainingsopbouw en voortgang.", forWhom: "Voor wie persoonlijke structuur, extra uitleg of intensieve coaching wil.", approach: ["Persoonlijke intake", "Volledige coachfocus", "Regelmatig evalueren"] },
  { slug: "strength-conditioning", label: "Strength & Conditioning", number: "05", intro: "Verbind kracht, conditie, snelheid en belastbaarheid aan de eisen van jouw sport.", forWhom: "Voor ambitieuze sporters die hun fysieke prestaties sportspecifiek willen ontwikkelen.", approach: ["Sportanalyse", "Periodisering", "Kracht en conditie combineren"] },
];

export { posts } from "@/lib/content/articles";
export { contact } from "@/lib/content/site";
