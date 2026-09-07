import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart, Target, Users, Waypoints } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaMentionCard, StoryTimeline, TrustCredentialCard } from "@/components/content-sections";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { clubStory } from "@/lib/content/claims";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Over Absolutely Fit — sinds 1998", "Ontdek het verhaal van familieclub Absolutely Fit, sinds 1998 een persoonlijke trainingsplek in het Scheveningse Havenkwartier.", "/over-ons");

export default function OverOnsPage() {
  return <main className="story-page">
    <PageHero eyebrow="Familieclub in Scheveningen · sinds 1998" title={<>Serieus trainen. Prettig binnenkomen.</>} intro="Absolutely Fit is een familiegedreven club in het Havenkwartier. Persoonlijke aandacht, nuchtere trainingskennis en ruimte voor ieder startpunt vormen hier de basis." image="/images/lotus-window.jpg" imageAlt="De herkenbare lotusbloem van Absolutely Fit" variant="reverse" />

    <Reveal as="section" className="section shell page-intro">
      <h2 className="display">Een vaste plek aan de haven.</h2>
      <div className="page-intro__copy"><p>{clubStory.publicSummary}</p><p>Wat begon vanuit liefde voor krachttraining, groeide uit tot een ontmoetingsplek waar buurtgenoten, nieuwkomers en ervaren sporters naast elkaar trainen.</p><p>De trainingsvloer is professioneel ingericht. De omgang blijft persoonlijk: vragen mogen gesteld worden en ontwikkeling krijgt de tijd.</p></div>
    </Reveal>

    <Reveal as="section" className="section shell story-timeline-section">
      <div><span className="eyebrow">Ons verhaal</span><h2 className="display">Sinds 1998, stap voor stap opgebouwd.</h2></div>
      <StoryTimeline />
    </Reveal>

    <Reveal as="section" className="section shell values-section">
      <div className="section-heading section-heading--row"><div><span className="eyebrow">Waar we voor staan</span><h2 className="display">Onze manier van club zijn.</h2></div></div>
      <div className="values-lines"><article><Users aria-hidden="true" /><span>01</span><h3>Welkom</h3><p>Iedereen moet zich op zijn gemak kunnen voelen om te beginnen.</p></article><article><Target aria-hidden="true" /><span>02</span><h3>Helder</h3><p>We maken trainingsprincipes begrijpelijk en praktisch toepasbaar.</p></article><article><Heart aria-hidden="true" /><span>03</span><h3>Betrokken</h3><p>Aandacht voor mensen hoort net zo bij de club als goed materiaal.</p></article><article><Waypoints aria-hidden="true" /><span>04</span><h3>Ontwikkeling</h3><p>Jouw startpunt bepaalt de route; vooruitgang ziet er voor iedereen anders uit.</p></article></div>
    </Reveal>

    <Reveal as="section" className="mission-split shell-wide"><div><Image src="/images/community-training.webp" alt="Verschillende leden trainen samen" width={1919} height={820} sizes="(max-width: 760px) 100vw, 50vw" /></div><div><span className="eyebrow">Familieclub als dagelijkse praktijk</span><h2 className="display">Verschillende doelen. Dezelfde aandacht.</h2><p>De één zoekt een haalbaar weekritme, de ander werkt doelgericht aan kracht of sportprestaties. Goede begeleiding sluit aan op die verschillen, zonder iemand tot een nummer te maken.</p><Button asChild className="button-primary button-large"><Link href="/team">Maak kennis met het team <ArrowRight aria-hidden="true" /></Link></Button></div></Reveal>

    <section className="section shell"><TrustCredentialCard /></section>
    <section className="section shell"><MediaMentionCard /></section>
  </main>;
}
