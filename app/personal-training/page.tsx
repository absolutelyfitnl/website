import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Focus, Gauge, UserRoundCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FreeIntakeCTA } from "@/components/content-sections";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Personal training in Scheveningen", "Persoonlijke één-op-één begeleiding bij Absolutely Fit in Scheveningen, gestart vanuit een gratis persoonlijke intake.", "/personal-training");

export default function PersonalTrainingPage() {
  return <main>
    <PageHero eyebrow="Personal training · Scheveningen" title={<>Volledige aandacht voor jouw training.</>} intro="Werk één-op-één aan techniek, trainingsopbouw en een aanpak die past bij jouw doel en beschikbare tijd." image="/images/hero-coaching.webp" imageAlt="Persoonlijke uitleg tijdens een training bij Absolutely Fit" />
    <Reveal as="section" className="section shell pt-intro"><div><span className="eyebrow">Persoonlijke begeleiding</span><h2 className="display">Een coach kijkt naar het hele vertrekpunt.</h2></div><div><p>Personal training begint niet bij een willekeurige lijst oefeningen. We brengen eerst je ervaring, planning en trainingsvraag in kaart. Daarna wordt de sessie stap voor stap opgebouwd.</p><p>De inhoud en frequentie bespreek je persoonlijk. De site publiceert geen onbevestigde tarieven of contractvoorwaarden.</p></div></Reveal>
    <Reveal as="section" className="section shell pt-pillars"><article><UserRoundCheck aria-hidden="true" /><span>01</span><h3>Jouw startpunt</h3><p>Oefeningen en belasting sluiten aan op wat je nu beheerst.</p></article><article><Focus aria-hidden="true" /><span>02</span><h3>Gerichte feedback</h3><p>Heldere aanwijzingen helpen je begrijpen wat je doet.</p></article><article><Gauge aria-hidden="true" /><span>03</span><h3>Planmatige opbouw</h3><p>We evalueren en passen aan wanneer je ontwikkeling daarom vraagt.</p></article></Reveal>
    <Reveal as="section" className="pt-process shell-wide"><Image src="/images/absolutely-fit-coach-portrait.png" alt="Coach bij een squatrek in de trainingsruimte" width={1122} height={1402} sizes="(max-width: 760px) 100vw, 42vw" /><div><span className="eyebrow eyebrow--light">Zo kan een traject beginnen</span><h2 className="display display--light">Luisteren. Kijken. Uitleggen. Opbouwen.</h2><ol>{["Gratis persoonlijke intake", "Doel en startniveau concretiseren", "Eerste trainingsopbouw afspreken", "Op passende momenten evalueren"].map((step, index) => <li key={step}><span>0{index + 1}</span><strong>{step}</strong><Check aria-hidden="true" /></li>)}</ol><Button asChild className="button-light button-large"><Link href="/team">Maak kennis met het team <ArrowRight aria-hidden="true" /></Link></Button></div></Reveal>
    <section className="section shell"><FreeIntakeCTA title="Bespreek of personal training bij je past." text="De gratis intake geeft ruimte om je doel, planning en gewenste mate van begeleiding zorgvuldig te bespreken." /></section>
  </main>;
}
