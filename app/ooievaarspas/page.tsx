import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ExternalLink, ShieldCheck } from "lucide-react";
import { OoievaarspasCallout } from "@/components/content-sections";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { frequentlyAskedQuestions } from "@/lib/content/faq";
import { ooievaarspas } from "@/lib/content/partners";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Sportschool met Ooievaarspas in Den Haag", "Lees hoe de bevestigde 50% Ooievaarspaskorting bij Absolutely Fit werkt en bespreek de actuele toepassing tijdens een gratis intake.", "/ooievaarspas");

export default function OoievaarspasPage() {
  const faq = frequentlyAskedQuestions.filter((item) => item.category === "Ooievaarspas");
  return <main className="ooievaar-page">
    <section className="ooievaar-page__hero shell-wide"><div><span className="eyebrow">Ooievaarspas · Absolutely Fit</span><h1 className="display">50% korting op een daarvoor in aanmerking komend abonnement.</h1><p>Met een geldige Ooievaarspas kun je bij Absolutely Fit met korting sporten. Welke actuele productoptie en voorwaarden van toepassing zijn, bespreek je rechtstreeks met de club.</p><div className="ao-actions"><Link className="ao-button ao-button--blue" href="/contact?onderwerp=ooievaarspas">Bespreek je Ooievaarspas <ArrowRight aria-hidden="true" /></Link><Link className="ao-button ao-button--line" href="/gratis-persoonlijke-intake">Bereid je gratis intake voor</Link></div></div><div className="ooievaar-page__mark"><Image src="/partners/ooievaarspas.svg" alt="Ooievaarspas" width={71} height={90} sizes="100px" /><div><strong>50%</strong><span>bevestigde korting</span><small>Toepassing per product: actueel navragen</small></div></div></section>
    <section className="section shell ooievaar-process"><div><span className="eyebrow">Zo pak je het aan</span><h2 className="display">Drie duidelijke stappen.</h2></div><div>{[["01", "Controleer je pas", "De gemeente Den Haag bepaalt de actuele toelatingsvoorwaarden en aanvraagprocedure."], ["02", "Neem contact op", "Kies in het formulier alleen het onderwerp Ooievaarspas; stuur geen inkomensbewijs of pasnummer mee."], ["03", "Bespreek de toepassing", "Tijdens de gratis intake hoor je welk in aanmerking komend abonnement en welke voorwaarden actueel gelden."]].map(([number, title, text]) => <article key={number}><span>{number}</span><Check aria-hidden="true" /><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="section shell"><OoievaarspasCallout detailed /></section>
    <section className="section shell ooievaar-sources"><div><ShieldCheck aria-hidden="true" /><span><strong>Gebruik altijd de officiële informatie.</strong><p>Inkomensgrenzen en gemeentelijke voorwaarden kunnen wijzigen en staan daarom niet als vaste bedragen op deze website.</p></span></div><nav aria-label="Officiële Ooievaarspasbronnen"><a href={ooievaarspas.officialApplicationUrl} target="_blank" rel="noopener noreferrer">Gemeente Den Haag: pas aanvragen <ExternalLink aria-hidden="true" /></a><a href={ooievaarspas.officialOfferUrl} target="_blank" rel="noopener noreferrer">Absolutely Fit-aanbieding <ExternalLink aria-hidden="true" /></a></nav></section>
    <section className="section shell faq-preview ooievaar-faq"><div><span className="eyebrow">Veelgestelde vragen</span><h2 className="display">Praktisch &amp; transparant.</h2></div><Accordion type="single" collapsible className="faq-accordion">{faq.map((item, index) => <AccordionItem value={`ooievaar-${index}`} key={item.question}><AccordionTrigger>{item.question}</AccordionTrigger><AccordionContent><p>{item.answer}</p></AccordionContent></AccordionItem>)}</Accordion></section>
  </main>;
}
