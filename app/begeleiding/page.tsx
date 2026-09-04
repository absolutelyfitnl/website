import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { TrainingRoute } from "@/components/training-route";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Persoonlijke begeleiding", "Persoonlijke begeleiding, trainingsschema’s en Strength & Conditioning voor ieder niveau bij Absolutely Fit.", "/begeleiding");

const steps = [
  ["Kennismaken", "We bespreken waarom je wilt trainen, wat je al hebt gedaan en waar je naartoe wilt."],
  ["Doel bepalen", "We maken jouw doel concreet en kijken naar ervaring, belastbaarheid en beschikbare tijd."],
  ["Plan maken", "We kiezen oefeningen, trainingsvormen en een opbouw die bij jouw situatie passen."],
  ["Blijven ontwikkelen", "We volgen hoe het gaat en stellen de aanpak bij wanneer dat nodig is."],
];

export default function BegeleidingPage() {
  return <main>
    <PageHero eyebrow="Kennis. Aandacht. Een duidelijk plan." title={<>Begeleiding die bij jou past.</>} intro="Goede begeleiding begint met luisteren. We brengen je doel, ervaring en belastbaarheid in kaart en vertalen dat naar een aanpak die duidelijk, haalbaar en gericht is." image="/images/hero-coaching.webp" imageAlt="Een coach geeft persoonlijke uitleg tijdens een training" variant="full" />
    <Reveal as="section" className="section shell guidance-method"><div className="guidance-method__sticky"><span className="eyebrow">Onze aanpak</span><h2 className="display">Zo werken we.</h2><p>Geen standaardroute voor iedereen. Wel een heldere werkwijze waarmee je weet waarom je iets doet.</p></div><div className="numbered-list">{steps.map(([title,text],index)=><article key={title}><span>0{index+1}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></Reveal>
    <Reveal as="section" className="coach-profile shell-wide"><div className="coach-profile__image"><Image src="/images/absolutely-fit-coach-portrait.png" alt="Een strength coach naast het squatrek" width={1122} height={1402} sizes="(max-width: 760px) 100vw, 44vw" /></div><div className="coach-profile__copy"><span className="eyebrow eyebrow--light">Eigenaar & coach</span><h2 className="display display--light">Rik Priester.</h2><p>Rik heeft vijftien jaar ervaring als coach en begeleidde sporters van uiteenlopende niveaus: van mensen die voor het eerst serieus gaan trainen tot Nederlandse kampioenen en internationale topsporters.</p><div className="specialty-list"><span><Check />Gewichtheffen</span><span><Check />Powerlifting</span><span><Check />Strength & Conditioning</span><span><Check />Trainingsprogramma’s</span></div><blockquote>“Sport is voor iedereen.”</blockquote></div></Reveal>
    <Reveal as="section" className="section shell complete-picture"><div><span className="eyebrow">Het complete plaatje</span><h2 className="display">Meer dan één oefening of één doel.</h2></div><div className="complete-picture__grid"><article><strong>Kracht</strong><p>De basis om te bewegen, presteren en belastbaar te blijven.</p></article><article><strong>Conditie</strong><p>Gericht werken aan uithoudingsvermogen en herstelvermogen.</p></article><article><strong>Techniek</strong><p>Begrijpen wat je doet en bewegingen beheerst uitvoeren.</p></article><article><strong>Prestatie</strong><p>De onderdelen samenbrengen rond jouw niveau en ambitie.</p></article></div></Reveal>
    <section className="section shell"><TrainingRoute /></section>
    <Reveal as="section" className="utility-band"><div className="shell two-column"><h2 className="display">Jouw doel. Ons plan. Samen aan de slag.</h2><div><p>Een recreatieve sporter en een topsporter hebben niet hetzelfde programma nodig. Ze verdienen wél allebei een serieuze aanpak.</p><Button asChild className="button-light button-large"><Link href="/contact">Bespreek jouw doel <ArrowRight /></Link></Button></div></div></Reveal>
  </main>;
}
