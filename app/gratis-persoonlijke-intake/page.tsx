import Link from "next/link";
import { ArrowRight, Check, HandHeart } from "lucide-react";
import { FirstVisitWizard } from "@/components/first-visit-wizard";
import { IntakeSteps } from "@/components/content-sections";
import { pageMetadata } from "@/lib/metadata";
import { memberships } from "@/lib/content/memberships";
import { customerFacts } from "@/lib/content/site";

export const metadata = pageMetadata("Gratis persoonlijke fitnessintake in Scheveningen", "Bereid je gratis persoonlijke intake bij Absolutely Fit voor en bespreek je doel, trainingsmoment en gewenste begeleiding.", "/gratis-persoonlijke-intake");

export default async function FreePersonalIntakePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const selectedMembership = memberships.find((membership) => membership.id === query.abonnement);
  return <main className="intake-page">
    <section className="intake-page__hero shell-wide"><div><span className="eyebrow eyebrow--light">Gratis persoonlijke intake · Scheveningen</span><h1 className="display display--light">Een helder startpunt, voordat je kiest.</h1><p>De intake is gratis. We bespreken je doel, ervaring, planning en welke begeleiding je prettig vindt. Het is geen proeftraining en je hoeft vooraf geen product te kiezen.</p><p>{customerFacts.intake}</p>{selectedMembership && <div className="intake-page__selection" role="status"><small>Je bekijkt de intake vanuit</small><strong>{selectedMembership.name}</strong><span>{selectedMembership.summary}</span></div>}<ul><li><Check aria-hidden="true" />Persoonlijk gesprek</li><li><Check aria-hidden="true" />Vier actuele productmogelijkheden</li><li><Check aria-hidden="true" />Geen onnodige gevoelige gegevens</li></ul></div><aside><HandHeart aria-hidden="true" /><strong>Ooievaarspas?</strong><p>Je kunt de actuele toepassing van de 50%-korting of de jeugdvergoeding tijdens de intake bespreken.</p><Link href="/ooievaarspas">Bekijk de informatie <ArrowRight aria-hidden="true" /></Link></aside></section>
    <section className="section shell intake-page__steps"><div><span className="eyebrow">Zo werkt de intake</span><h2 className="display">Van vraag naar een passende eerste stap.</h2></div><IntakeSteps /></section>
    <section className="intake-page__wizard"><div className="ao-shell"><FirstVisitWizard compact product={selectedMembership?.id} /></div></section>
    <section className="section shell intake-page__after"><div><span className="eyebrow">Na je voorbereiding</span><h2 className="display">Plan je persoonlijke intake.</h2></div><div><p>Neem je keuzes mee naar het gesprek. Bel of mail de club om een moment af te spreken waarop het team rustig de tijd voor je heeft.</p><Link className="text-link" href="/contact">Neem contact op <ArrowRight aria-hidden="true" /></Link></div></section>
  </main>;
}
