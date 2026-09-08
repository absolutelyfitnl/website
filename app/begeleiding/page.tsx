import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FreeIntakeCTA, TrustCredentialCard } from "@/components/content-sections";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { TrainingRoute } from "@/components/training-route";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Persoonlijke fitnessbegeleiding", "Persoonlijke begeleiding, trainingsschema’s en Strength & Conditioning voor ieder niveau bij Absolutely Fit in Scheveningen.", "/begeleiding");

const steps = [
  ["Gratis persoonlijke intake", "We bespreken waarom je wilt trainen, wat je al hebt gedaan en welke momenten bij je week passen."],
  ["Startpunt bepalen", "We maken je doel concreet en kijken naar ervaring, techniek en gewenste begeleiding."],
  ["Plan opbouwen", "We kiezen oefeningen, trainingsvormen en een opbouw die bij jouw situatie passen."],
  ["Blijven ontwikkelen", "We volgen hoe het gaat en stellen de aanpak bij wanneer dat nodig is."],
] as const;

export default function BegeleidingPage() {
  return <main>
    <PageHero eyebrow="Kennis · aandacht · een duidelijk plan" title={<>Begeleiding die je verder helpt.</>} intro="Goede begeleiding begint met luisteren. We brengen je doel, ervaring en planning in kaart en vertalen dat naar een aanpak die duidelijk en haalbaar is." image="/images/hero-coaching.webp" imageAlt="Een coach geeft persoonlijke uitleg tijdens een training" variant="full" />
    <Reveal as="section" className="section shell guidance-method"><div className="guidance-method__sticky"><span className="eyebrow">Onze aanpak</span><h2 className="display">Zo werken we.</h2><p>Geen standaardroute voor iedereen. Wel een heldere werkwijze waarmee je begrijpt waarom je iets doet.</p></div><div className="numbered-list">{steps.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></Reveal>
    <Reveal as="section" className="coach-profile shell-wide"><div className="coach-profile__image"><Image src="/images/absolutely-fit-coach-portrait.png" alt="Rik Priester naast het squatrek in de trainingsruimte" width={1122} height={1402} sizes="(max-width: 760px) 100vw, 44vw" /></div><div className="coach-profile__copy"><span className="eyebrow eyebrow--light">Oprichter & coach</span><h2 className="display display--light">Rik Priester.</h2><p>Als meervoudig Nederlands kampioen en wereldkampioen powerliften in 1990 brengt Rik wedstrijdervaring terug naar rustige technische uitleg en planmatige trainingsopbouw — van een eerste serieuze training tot nationaal, internationaal en olympisch niveau.</p><div className="specialty-list"><span><Check aria-hidden="true" />Krachttraining</span><span><Check aria-hidden="true" />Powerlifting</span><span><Check aria-hidden="true" />Gewichtheffen</span><span><Check aria-hidden="true" />Strength & Conditioning</span></div><Button asChild className="button-light button-large"><Link href="/team">Bekijk het team <ArrowRight aria-hidden="true" /></Link></Button></div></Reveal>
    <Reveal as="section" className="section shell complete-picture"><div><span className="eyebrow">Het complete plaatje</span><h2 className="display">Meer dan één oefening of één doel.</h2></div><div className="complete-picture__grid"><article><strong>Kracht</strong><p>Een basis om doelgericht te bewegen en belasting op te bouwen.</p></article><article><strong>Conditie</strong><p>Werken aan uithoudingsvermogen in een passend ritme.</p></article><article><strong>Techniek</strong><p>Begrijpen wat je doet en bewegingen beheerst uitvoeren.</p></article><article><strong>Prestatie</strong><p>De onderdelen samenbrengen rond jouw niveau en ambitie.</p></article></div></Reveal>
    <section className="section shell"><TrustCredentialCard compact /></section>
    <section className="section shell"><TrainingRoute /></section>
    <section className="section shell"><FreeIntakeCTA title="Bespreek welke begeleiding bij je past." /></section>
  </main>;
}
