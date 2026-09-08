import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bell, CalendarDays, Check, CreditCard, Dumbbell, LockKeyhole, Newspaper, QrCode, Smartphone, TrendingUp, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MemberAppDemo } from "@/components/member-app-demo";
import { Reveal } from "@/components/reveal";
import { pageMetadata, privateRobots } from "@/lib/metadata";
import { memberships } from "@/lib/content/memberships";
import { openingHourGroups } from "@/lib/content/opening-hours";

export const metadata = pageMetadata("Mijn Absolutely Fit", "Bekijk de Absolutely Fit ledenapp en ledenomgeving voor training, planning, lidmaatschap en clubinformatie.", "/ledenapp", { robots: privateRobots });

const features: Array<[LucideIcon, string, string]> = [
  [QrCode, "Digitale ledenpas", "Je lidmaatschap en ledenpas overzichtelijk bij elkaar."],
  [Dumbbell, "Training", "Een rustig overzicht van schema’s, oefeningen en geplande trainingen."],
  [TrendingUp, "Voortgang", "Trainingshistorie en persoonlijke ontwikkeling op één herkenbare plek."],
  [CreditCard, "Lidmaatschap", "Status, betalingen en facturen zonder zoeken in losse berichten."],
  [Newspaper, "Club", "Nieuws, praktische informatie en updates vanuit Absolutely Fit."],
  [UserRound, "Profiel", "Persoonlijke gegevens en voorkeuren veilig beheren."],
];

export default function LedenappPage() {
  return (
    <main>
      <section className="app-page-hero shell-wide">
        <div className="app-page-hero__copy"><span className="development-label"><i />Mijn Absolutely Fit</span><span className="eyebrow">Jouw ledenomgeving</span><h1 className="display">Alles van Absolutely Fit. Ook in je broekzak.</h1><p>De fysieke club blijft het hart. De app brengt praktische zaken, je training en contact met de club overzichtelijk samen.</p><Button asChild className="button-primary button-large"><Link href="#app-concept">Bekijk de ledenomgeving</Link></Button></div>
        <div className="app-page-hero__visual"><div className="app-photo"><Image src="/images/hero-coaching.webp" alt="Persoonlijke coaching in de fysieke sportschool" width={1672} height={941} sizes="(max-width: 760px) 100vw, 50vw" /></div><MemberAppDemo /></div>
      </section>

      <Reveal as="section" className="section shell ecosystem-intro">
        <div><span className="eyebrow">Eén herkenbare club</span><h2 className="display">Digitaal waar het helpt. Persoonlijk waar het telt.</h2></div>
        <div><p>De ledenomgeving ondersteunt het contact tussen lid, coach en club en houdt praktische informatie overzichtelijk bij elkaar.</p><div className="ecosystem-principles"><span><Check />Eenvoudig in gebruik</span><span><Check />Herkenbaar Absolutely Fit</span><span><Check />Gebouwd rond leden</span></div></div>
      </Reveal>

      <section className="interactive-app section shell-wide" id="app-concept">
        <div className="interactive-app__intro"><span className="eyebrow eyebrow--light">Mijn Absolutely Fit</span><h2 className="display display--light">Alles binnen handbereik.</h2><p>Wissel tussen Home, Ledenpas, Training en Club om de belangrijkste onderdelen te bekijken.</p></div>
        <MemberAppDemo />
      </section>

      <Reveal as="section" className="section shell app-features">
        <div className="app-features__heading"><span className="eyebrow">Alles overzichtelijk</span><h2 className="display">Eén omgeving. Zes duidelijke taken.</h2></div>
        <div className="app-feature-lines">{features.map(([FeatureIcon, title, text], index) => <article key={title}><span>0{index + 1}</span><FeatureIcon aria-hidden="true" /><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
      </Reveal>

      <Reveal as="section" className="portal-preview shell-wide">
        <div className="portal-preview__heading"><span className="eyebrow">Ook op desktop</span><h2 className="display">Jouw ledenportaal.</h2><p>Dezelfde informatie, ruimer uitgewerkt voor administratie, planning en voortgang.</p></div>
        <div className="portal-window">
          <aside><Image src="/brand/absolutely-fit-lockup.svg" alt="Absolutely Fit" width={590} height={142} sizes="150px" /><nav><span className="is-active"><Smartphone />Overzicht</span><span><Dumbbell />Training</span><span><CalendarDays />Planning</span><span><CreditCard />Lidmaatschap</span><span><UserRound />Profiel</span></nav><div><LockKeyhole />Veilige ledenomgeving</div></aside>
          <div className="portal-main"><header><div><small>Welkom</small><h3>Jouw overzicht</h3></div><span><Bell /><i /></span></header><div className="portal-grid"><section className="portal-today"><span>Gepland</span><h4>Upper body strength</h4><p>6 oefeningen · ongeveer 60 minuten</p><div><strong>18:00</strong><span>Volgende training</span></div></section><section className="portal-pass"><QrCode /><strong>{memberships[1].name}</strong><span>Digitale ledenpas</span></section><section className="portal-progress"><span>Trainingen deze maand</span><strong>08</strong><div><i style={{width:"68%"}} /></div><small>Persoonlijke voortgang</small></section><section className="portal-news"><span>Openingstijden</span><h4>{openingHourGroups[0].label} {openingHourGroups[0].opens}–{openingHourGroups[0].closes}</h4><small>{openingHourGroups.slice(1).map((group) => `${group.label} ${group.opens}–${group.closes}`).join(" · ")}</small></section></div></div>
        </div>
      </Reveal>

      <section className="app-security section shell"><div><LockKeyhole aria-hidden="true" /><span className="eyebrow">Rustig en overzichtelijk</span><h2 className="display">Persoonlijk contact blijft dichtbij.</h2></div><div><p>Digitale informatie ondersteunt het contact met je coach en de club. Voor vragen of persoonlijke begeleiding kun je altijd rechtstreeks contact opnemen.</p><Button asChild variant="outline" className="button-large"><Link href="/contact">Stel een vraag <ArrowRight aria-hidden="true" /></Link></Button></div></section>
    </main>
  );
}
