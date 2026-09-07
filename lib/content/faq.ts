import { ooievaarspas } from "@/lib/content/partners";
import { openingHoursSummary } from "@/lib/content/opening-hours";

export const frequentlyAskedQuestions = [
  {
    category: "Starten",
    question: "Wat gebeurt er tijdens de gratis persoonlijke intake?",
    answer: "We bespreken je doel, ervaring, voorkeursmoment en gewenste begeleiding. Daarna bekijken we welke trainingsaanpak en welk product logisch aansluiten. De intake is gratis en is geen proeftraining.",
    href: "/gratis-persoonlijke-intake",
  },
  {
    category: "Lidmaatschap",
    question: "Welke producten biedt Absolutely Fit aan?",
    answer: "Je kunt kiezen uit 1× per week, Onbeperkt trainen, een 10-rittenkaart en Jeugd. Actuele prijzen, looptijden en overige voorwaarden bespreek je rechtstreeks met de club.",
    href: "/abonnementen",
  },
  {
    category: "Begeleiding",
    question: "Kan ik personal training volgen?",
    answer: "Ja. Personal training wordt aangeboden. Tijdens de gratis intake bespreek je je doel, planning en welke vorm van persoonlijke begeleiding past.",
    href: "/personal-training",
  },
  {
    category: "Praktisch",
    question: "Wat zijn de openingstijden?",
    answer: `${openingHoursSummary}. Feestdagopening is niet standaard bevestigd.`,
    href: "/openingstijden",
  },
  {
    category: "Ooievaarspas",
    question: "Hoeveel korting krijg ik met de Ooievaarspas?",
    answer: ooievaarspas.claim,
    href: "/ooievaarspas",
  },
  {
    category: "Ooievaarspas",
    question: "Wat neem ik mee als ik de korting wil bespreken?",
    answer: "Neem je geldige Ooievaarspas mee naar het contactmoment. Stuur geen pasnummer, inkomensbewijs of andere gevoelige documenten via het algemene websiteformulier.",
    href: "/ooievaarspas",
  },
  {
    category: "Ooievaarspas",
    question: "Met wie bespreek ik de actuele toepassing?",
    answer: "Neem rechtstreeks contact op met het team van Absolutely Fit of kies Ooievaarspas als onderwerp in het contactformulier. Het team licht de actuele abonnementsoptie en voorwaarden persoonlijk toe.",
    href: "/contact?onderwerp=ooievaarspas",
  },
  {
    category: "Ooievaarspas",
    question: "Op welk product geldt de Ooievaarspaskorting?",
    answer: "De exacte toepassing per product wordt actueel met je besproken. Neem contact op of plan een gratis intake; we doen hierover geen aannames op de website.",
    href: "/ooievaarspas",
  },
  {
    category: "Ooievaarspas",
    question: "Hoe vraag ik een Ooievaarspas aan?",
    answer: "De gemeente Den Haag bepaalt de actuele toelatingsvoorwaarden en aanvraagprocedure. Gebruik de officiële gemeentepagina voor de meest recente informatie.",
    href: "/ooievaarspas",
  },
  {
    category: "Training",
    question: "Kan ik beginnen zonder fitnesservaring?",
    answer: "Ja. Je hoeft niet fit of ervaren te zijn om te beginnen. Tijdens de intake bepalen we een rustig startpunt en leggen we de belangrijkste bewegingen en afspraken uit.",
    href: "/sporten/krachttraining",
  },
] as const;
