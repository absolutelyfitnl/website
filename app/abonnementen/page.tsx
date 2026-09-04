import Link from "next/link";
import { ArrowRight, BadgeCheck, Check, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Abonnementen", "Bekijk welke manier van trainen bij je past en vraag de actuele tarieven en voorwaarden aan bij Absolutely Fit.", "/abonnementen");

const routes = [
  {
    number: "01",
    label: "Vrij trainen",
    descriptor: "Zelfstandig, met de club dichtbij",
    text: "Voor sporters die zelfstandig willen trainen met toegang tot cardio, machines en vrije gewichten binnen de openingstijden.",
    points: ["Volwaardige fitnessvloer", "Vrije gewichten en machines", "Clubteam in de buurt"],
  },
  {
    number: "02",
    label: "Trainen met begeleiding",
    descriptor: "Een duidelijker plan en gerichte uitleg",
    text: "Voor wie zelfstandig wil trainen, maar graag extra structuur, techniekfeedback of een persoonlijk trainingsprogramma bespreekt.",
    points: ["Passend startpunt", "Techniek en trainingsopbouw", "Mogelijkheid tot een persoonlijk schema"],
    featured: true,
  },
  {
    number: "03",
    label: "Personal coaching",
    descriptor: "Volledige aandacht voor jouw doel",
    text: "Voor sporters die intensiever één-op-één willen werken aan kracht, conditie, techniek of sportspecifieke prestaties.",
    points: ["Persoonlijke intake", "Gerichte coachmomenten", "Regelmatig evalueren"],
  },
];

const faqs = [
  ["Kan ik eerst kennismaken?", "Ja. Een kennismaking is juist de beste eerste stap. We bespreken je doel en ervaring en laten zien welke manier van trainen logisch bij je past."],
  ["Wat kost een abonnement?", "De actuele tarieven en voorwaarden ontvang je rechtstreeks van de club. Zo krijg je informatie die klopt bij het abonnement en de begeleiding die je kiest."],
  ["Kan ik als beginner bij jullie terecht?", "Zeker. Je hoeft niet fit of ervaren te zijn om te beginnen. We helpen je vertrouwd te raken met de ruimte, apparatuur en belangrijkste bewegingen."],
  ["Kan ik met de Ooievaarspas sporten?", "Absolutely Fit werkt met de Ooievaarspas. Neem contact op, dan legt het team uit wat op dit moment mogelijk is en welke voorwaarden gelden."],
  ["Bieden jullie ook personal training?", "Ja. Personal training en persoonlijke programma’s maken deel uit van de begeleidingsmogelijkheden. De invulling hangt af van jouw doel en beschikbaarheid."],
];

export default function AbonnementenPage() {
  return (
    <main>
      <PageHero
        eyebrow="Lid worden"
        title={<>Een abonnement dat begint bij jouw doel.</>}
        intro="Geen keuze uit eindeloze pakketten zonder uitleg. We kijken eerst hoe jij wilt trainen en welke mate van begeleiding daarbij past."
        image="/images/cardio-sunrise.jpg"
        imageAlt="Cardioapparatuur in het zachte ochtendlicht"
      />

      <Reveal as="section" className="section shell membership-intro">
        <div>
          <span className="eyebrow">Kies je route</span>
          <h2 className="display">Drie manieren om te beginnen.</h2>
        </div>
        <div>
          <p>Onderstaande routes geven richting. Het team vertelt je graag welke actuele abonnementsvorm, prijs en voorwaarden daarbij horen.</p>
          <a href="tel:+31612595112" className="text-link">Bel voor actuele tarieven <ArrowRight aria-hidden="true" /></a>
        </div>
      </Reveal>

      <Reveal as="section" className="membership-routes shell">
        {routes.map((route) => (
          <article className={route.featured ? "membership-route is-featured" : "membership-route"} key={route.label}>
            <div className="membership-route__top">
              <span>{route.number}</span>
              {route.featured && <em>Meest persoonlijk</em>}
            </div>
            <h2>{route.label}</h2>
            <strong>{route.descriptor}</strong>
            <p>{route.text}</p>
            <ul>{route.points.map((point) => <li key={point}><Check aria-hidden="true" />{point}</li>)}</ul>
            <Button asChild variant={route.featured ? "default" : "outline"} className={route.featured ? "button-primary button-large" : "button-large"}>
              <Link href="/contact">Bespreek deze optie <ArrowRight aria-hidden="true" /></Link>
            </Button>
          </article>
        ))}
      </Reveal>

      <Reveal as="section" className="section shell comparison-section">
        <div className="comparison-section__heading">
          <span className="eyebrow">In één oogopslag</span>
          <h2 className="display">Wat past bij jouw manier van trainen?</h2>
        </div>
        <p className="comparison-scroll-hint" id="comparison-scroll-hint">Veeg om alle opties te vergelijken <ArrowRight aria-hidden="true" /></p>
        <div className="comparison-table" role="table" aria-label="Vergelijking van manieren om te trainen" aria-describedby="comparison-scroll-hint" tabIndex={0}>
          <div className="comparison-table__row comparison-table__head" role="row"><span role="columnheader">Onderdeel</span><span role="columnheader">Vrij</span><span role="columnheader">Begeleid</span><span role="columnheader">Personal</span></div>
          {[
            ["Zelfstandig trainen", true, true, true],
            ["Gerichte techniekfeedback", false, true, true],
            ["Persoonlijke trainingsopbouw", false, true, true],
            ["Eén-op-één coachmomenten", false, false, true],
          ].map(([label, ...values]) => <div className="comparison-table__row" role="row" key={String(label)}><strong role="rowheader">{label}</strong>{values.map((value, index) => <span role="cell" key={index}>{value ? <Check aria-label="Inbegrepen" /> : <i aria-label="Niet standaard inbegrepen">—</i>}</span>)}</div>)}
        </div>
        <p className="comparison-note">De exacte inhoud hangt af van de actuele abonnementsvorm en gemaakte afspraken. Vraag het team om de volledige voorwaarden.</p>
      </Reveal>

      <Reveal as="section" className="ooievaar-band shell-wide">
        <div className="ooievaar-band__mark"><HandHeart aria-hidden="true" /><span>Ooievaarspas</span></div>
        <div><span className="eyebrow eyebrow--light">Sporten moet bereikbaar zijn</span><h2 className="display display--light">Ook welkom met de Ooievaarspas.</h2><p>Absolutely Fit werkt met de Ooievaarspas. Neem even contact op voor de actuele mogelijkheden en voorwaarden; dan helpen we je persoonlijk verder.</p></div>
        <Button asChild className="button-light button-large"><Link href="/contact">Vraag naar de mogelijkheden</Link></Button>
      </Reveal>

      <section className="section shell membership-faq">
        <div><BadgeCheck aria-hidden="true" /><span className="eyebrow">Goed om te weten</span><h2 className="display">Vragen voor je begint.</h2></div>
        <Accordion type="single" collapsible className="faq-accordion">
          {faqs.map(([question, answer], index) => <AccordionItem value={`item-${index}`} key={question}><AccordionTrigger><span>0{index + 1}</span>{question}</AccordionTrigger><AccordionContent>{answer}</AccordionContent></AccordionItem>)}
        </Accordion>
      </section>

      <Reveal as="section" className="utility-band"><div className="shell two-column"><h2 className="display">Eerst de club voelen. Dan pas kiezen.</h2><div><p>Kom langs, vertel wat je wilt bereiken en ontdek welke route prettig voelt. Zonder ingewikkeld verkooppraatje.</p><Button asChild className="button-light button-large"><Link href="/contact">Plan een kennismaking <ArrowRight aria-hidden="true" /></Link></Button></div></div></Reveal>
    </main>
  );
}
