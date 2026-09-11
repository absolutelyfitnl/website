import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FreeIntakeCTA, MembershipComparison, OoievaarspasCallout } from "@/components/content-sections";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { frequentlyAskedQuestions } from "@/lib/content/faq";
import { memberships } from "@/lib/content/memberships";
import { customerFacts } from "@/lib/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Abonnementen en 10-rittenkaart",
  "Sporten vanaf € 24,50 per maand. Vergelijk de vier actuele trainingsproducten van Absolutely Fit: 1× per week, onbeperkt trainen, 10-rittenkaart en jeugd.",
  "/abonnementen",
);

export default function AbonnementenPage() {
  const faq = frequentlyAskedQuestions.filter((item) => item.category === "Lidmaatschap" || item.category === "Ooievaarspas");
  return <main className="memberships-page">
    <PageHero eyebrow="Vier actuele mogelijkheden" title={<>Kies een trainingsritme dat bij je week past.</>} intro={`Sporten vanaf ${customerFacts.startingPrice}. Absolutely Fit heeft precies vier producttypen. Tijdens een gratis persoonlijke intake bespreek je welke mogelijkheid, actuele prijs en voorwaarden bij jouw situatie passen.`} image="/images/cardio-sunrise.jpg" imageAlt="Cardioapparatuur in het zachte ochtendlicht" />

    <Reveal as="section" className="section shell membership-intro">
      <div><span className="eyebrow">Jouw trainingsritme</span><h2 className="display">Vier heldere mogelijkheden.</h2></div>
      <div><p>{customerFacts.flexibility}</p><p>{customerFacts.intake}</p><p>Sporten vanaf {customerFacts.startingPrice}; de actuele productprijs en voorwaarden bespreek je tijdens je intake.</p><Link href="/gratis-persoonlijke-intake" className="text-link">Bespreek wat bij je past <ArrowRight aria-hidden="true" /></Link></div>
    </Reveal>

    <Reveal as="section" className="shell membership-products" aria-label="Vergelijk de vier trainingsproducten">
      <MembershipComparison />
    </Reveal>

    <Reveal as="section" className="section shell membership-choice-help">
      <div><span className="eyebrow">Korte keuzehulp</span><h2 className="display">Frequentie is het begin van het gesprek.</h2><p>Hoe vaak je realistisch kunt trainen, hoeveel flexibiliteit je nodig hebt en welke begeleiding prettig voelt, bepalen samen een logisch startpunt.</p></div>
      <ol>{memberships.map((membership, index) => <li key={membership.id}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{membership.name}</strong><p>{membership.summary}</p></div><Link href={membership.ctaHref} aria-label={`Bespreek ${membership.name} tijdens de gratis intake`}><ArrowRight aria-hidden="true" /></Link></li>)}</ol>
    </Reveal>

    <section className="section shell"><OoievaarspasCallout detailed /></section>

    <section className="section shell membership-faq">
      <div><BadgeCheck aria-hidden="true" /><span className="eyebrow">Goed om te weten</span><h2 className="display">Transparant voor je kiest.</h2></div>
      <Accordion type="single" collapsible className="faq-accordion">
        {faq.map((item, index) => <AccordionItem value={`product-${index}`} key={item.question}><AccordionTrigger><span>{String(index + 1).padStart(2, "0")}</span>{item.question}</AccordionTrigger><AccordionContent><p>{item.answer}</p><Link href={item.href}>Ga naar {item.category.toLowerCase()}informatie <ArrowRight aria-hidden="true" /></Link></AccordionContent></AccordionItem>)}
      </Accordion>
    </section>

    <section className="section shell"><FreeIntakeCTA title="Eerst bespreken. Daarna pas een product kiezen." text={`${customerFacts.intake} Je krijgt actuele informatie over prijs, looptijd en voorwaarden rechtstreeks van de club.`} /></section>
  </main>;
}
