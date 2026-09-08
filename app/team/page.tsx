import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, HeartHandshake, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FreeIntakeCTA } from "@/components/content-sections";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { teamProfiles } from "@/lib/content/claims";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Team van Absolutely Fit", "Maak kennis met de persoonlijke, nuchtere begeleidingsaanpak van het team van Absolutely Fit in Scheveningen.", "/team");

export default function TeamPage() {
  return <main>
    <PageHero eyebrow="Het team · familieclub sinds 1998" title={<>Kennis delen. Mensen op weg helpen.</>} intro="Bij Absolutely Fit begint begeleiding met luisteren, rustig uitleggen en aansluiten op het niveau van de sporter die voor ons staat." image="/images/absolutely-fit-coach-portrait.png" imageAlt="Coach in de trainingsruimte van Absolutely Fit" variant="reverse" />
    <Reveal as="section" className="section shell team-intro"><div><span className="eyebrow">Persoonlijk clubteam</span><h2 className="display">Serieus over trainen, benaderbaar in contact.</h2></div><div><p>De club combineert bewezen praktijkkennis uit kracht- en prestatiesport met aandacht voor mensen die voor het eerst beginnen of opnieuw een ritme zoeken.</p><p>De ervaring loopt van recreatieve sporters tot nationaal, internationaal en olympisch niveau. Op de clubvloer wordt die kennis steeds vertaald naar jouw eigen startpunt.</p></div></Reveal>
    <section className="section shell team-cards">{teamProfiles.map((profile, index) => <Reveal as="article" key={profile.id} delay={index * 70}><header><span>{String(index + 1).padStart(2, "0")}</span>{index ? <UsersRound aria-hidden="true" /> : <HeartHandshake aria-hidden="true" />}</header><h2>{profile.name}</h2><strong>{profile.role}</strong><p>{profile.summary}</p><ul>{profile.specialties.map((specialty) => <li key={specialty}><Check aria-hidden="true" />{specialty}</li>)}</ul></Reveal>)}</section>
    <Reveal as="section" className="team-method shell-wide"><Image src="/images/hero-coaching.webp" alt="Persoonlijke uitleg op de trainingsvloer" width={1672} height={941} sizes="(max-width: 760px) 100vw, 52vw" /><div><span className="eyebrow eyebrow--light">Onze werkwijze</span><h2 className="display display--light">Aandacht die je zelfstandiger maakt.</h2><p>Een coach helpt je niet alleen een oefening uitvoeren, maar legt uit waarom die keuze bij jouw doel en startpunt past.</p><Button asChild className="button-light button-large"><Link href="/personal-training">Bekijk personal training <ArrowRight aria-hidden="true" /></Link></Button></div></Reveal>
    <section className="section shell"><FreeIntakeCTA title="Maak persoonlijk kennis met de club." /></section>
  </main>;
}
