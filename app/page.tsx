import Link from "next/link";
import Image from "next/image";
import { Activity, ArrowDown, ArrowRight, ArrowUpRight, Award, CalendarDays, Check, ChevronRight, CirclePlay, Clock3, Dumbbell, Gauge, HeartHandshake, MapPin, QrCode, ShieldCheck, Smartphone, UserRoundCheck } from "lucide-react";
import { FirstVisitWizard } from "@/components/first-visit-wizard";
import { MemberAppDemo } from "@/components/member-app-demo";
import { Reveal } from "@/components/reveal";
import { FreeIntakeCTA, MediaMentionCard, MembershipComparison, OoievaarspasCallout, OpeningHoursCard, TrustCredentialCard } from "@/components/content-sections";
import { callsToAction, contact } from "@/lib/content/site";
import { disciplines, posts, programs } from "@/lib/site-data";
import { pageMetadata } from "@/lib/metadata";
import { StructuredData } from "@/components/structured-data";
import { exerciseGymStructuredData } from "@/lib/structured-data";
import { articleImageSize } from "@/lib/content/articles";

export const metadata = pageMetadata("Fitness en persoonlijke begeleiding in Scheveningen", "Welkom bij Absolutely Fit: een professionele sportschool in Scheveningen voor fitness, krachttraining, personal training en Strength & Conditioning.", "/");

const principles = [
  ["01", "Voor ieder niveau", "Je hoeft niet fit te zijn om te beginnen. We bouwen verder vanaf jouw startpunt."],
  ["02", "Persoonlijke aandacht", "Geen nummer, maar uitleg, een duidelijk plan en begeleiding wanneer je die nodig hebt."],
  ["03", "Kennis uit de topsport", "Ervaring uit kracht- en topsport, praktisch vertaald naar jouw training."],
];

const heroBenefits = [
  [Dumbbell, "Complete trainingsvloer", "Vrije gewichten, machines en cardio"],
  [HeartHandshake, "Persoonlijke begeleiding", "Uitleg en aandacht op jouw niveau"],
  [CalendarDays, "Train in jouw ritme", "Zelfstandig of met een duidelijk plan"],
  [MapPin, "In Scheveningen", "Een vertrouwde familieclub aan de haven"],
] as const;

const programIcons = [Dumbbell, Activity, Award, UserRoundCheck, Gauge] as const;

const clubPromises = [
  ["01", "Aandacht die past", "Een heldere start, ruimte voor vragen en begeleiding die aansluit op wat je nodig hebt."],
  ["02", "Techniek als basis", "Eerst begrijpen en beheersen, daarna stap voor stap belasting en uitdaging toevoegen."],
  ["03", "Zelfstandig groeien", "Het doel is dat jij met vertrouwen kunt trainen en weet waarom je iets doet."],
] as const;

export default function Home() {
  return (
    <main className="ao-home">
      <StructuredData data={exerciseGymStructuredData} />
      <section className="ao-hero">
        <Image className="ao-hero__ribbon" src="/brand/absolutely-fit-ribbon-wide.svg" alt="" aria-hidden="true" width={1600} height={900} sizes="100vw" />
        <div className="ao-hero__copy">
          <div className="ao-hero__meta"><span><i /> Familieclub in Scheveningen · sinds 1998</span><span>Doctor Lelykade 240</span></div>
          <p className="ao-overline">Persoonlijke fitness · kracht · begeleiding</p>
          <h1><span>Fitness</span><span>zoals het</span><span><em>bedoeld is.</em></span></h1>
          <p className="ao-hero__intro">Een professionele sportschool waar iedereen zich welkom voelt. Train zelfstandig of met persoonlijke begeleiding — altijd op jouw niveau.</p>
          <div className="ao-actions"><Link className="ao-button ao-button--blue" href="/gratis-persoonlijke-intake">{callsToAction.freeIntake} <ArrowRight aria-hidden="true" /></Link><Link className="ao-button ao-button--line" href="/sporten">Ontdek de club <ArrowDown aria-hidden="true" /></Link></div>
          <div className="ao-hero__proof"><span><Check />Sinds 1998</span><span><Check />Ooievaarspas: 50% op passend abonnement</span><span><Check />Voor ieder niveau</span></div>
        </div>
        <figure className="ao-hero__media"><Image src="/images/absolutely-fit-hero-cable-coaching.png" alt="Een coach begeleidt een sporter tijdens een gecontroleerde kabeltraining" width={1672} height={941} sizes="(max-width: 760px) 100vw, 58vw" preload /><figcaption><span>Persoonlijke begeleiding</span><strong>Jouw doel. Ons plan.</strong></figcaption><Link href="/begeleiding" aria-label="Bekijk persoonlijke begeleiding"><ArrowUpRight aria-hidden="true" /></Link></figure>
        <aside className="ao-hero__side-note"><span>Absolutely Fit</span><small>Scheveningen · een vertrouwde familieclub</small></aside>
      </section>

      <section className="ao-benefit-bar" aria-label="Waarom Absolutely Fit">{heroBenefits.map(([Icon, title, text], index) => <article key={title}><span>0{index + 1}</span><Icon aria-hidden="true" /><div><strong>{title}</strong><small>{text}</small></div></article>)}</section>
      <section className="ao-marquee" aria-label="Trainingsdisciplines"><div className="ao-marquee__track"><div>{disciplines.map((item) => <span key={item}>{item}<i aria-hidden="true" /></span>)}</div><div aria-hidden="true">{disciplines.map((item) => <span key={item}>{item}<i /></span>)}</div></div></section>
      <Image className="ao-home__vertical-ribbon" src="/brand/absolutely-fit-ribbon.svg" alt="" aria-hidden="true" width={420} height={1600} sizes="420px" />

      <section className="ao-intro ao-shell">
        <Reveal className="ao-intro__heading"><span className="ao-kicker">De club</span><h2>Een sportschool waar je geen nummer bent.</h2></Reveal>
        <Reveal className="ao-intro__copy"><p>Sinds 1998 staat bij Absolutely Fit centraal dat iedereen zich welkom voelt, plezier heeft in sporten en zich op het eigen niveau kan ontwikkelen.</p><Link href="/over-ons">Lees ons verhaal sinds 1998 <ArrowUpRight aria-hidden="true" /></Link></Reveal>
        <div className="ao-principles">{principles.map(([number,title,text], index) => <Reveal key={number} className="ao-principle" delay={index * 65}><span>{number}</span><h3>{title}</h3><p>{text}</p></Reveal>)}</div>
      </section>

      <section className="ao-training ao-shell">
        <Reveal className="ao-training__head"><div><span className="ao-kicker">Alles onder één dak</span><h2>Alles van <em>Absolutely Fit.</em></h2></div><p>Van een sterke basis tot sportprestaties op hoog niveau. Kies een richting of laat het team met je meedenken.</p></Reveal>
        <Reveal className="ao-program-grid" delay={90} distance={30}>
          {programs.map((program, index) => { const Icon = programIcons[index]; const href = program.slug === "personal-training" ? "/personal-training" : `/sporten/${program.slug}`; return <Link className={`ao-program ao-program--${index + 1}`} href={href} key={program.slug}><span>{program.number}</span><Icon aria-hidden="true" /><h3>{program.label}</h3><p>{program.intro}</p><ArrowUpRight aria-hidden="true" /></Link>; })}
          <figure className="ao-program-photo">
            <Image src="/images/hero-coaching.webp" alt="Persoonlijke uitleg tijdens een training" width={1672} height={941} sizes="(max-width: 760px) 100vw, 34vw" />
            <div className="ao-program-offer"><span>Begeleiding wanneer het helpt</span><strong>Zelf trainen. Samen verder.</strong><p>Begin met een rondleiding, vraag om techniekfeedback of kies voor een persoonlijk plan.</p><Link className="ao-button ao-button--white" href="/begeleiding">Bekijk begeleiding <ArrowRight aria-hidden="true" /></Link></div>
            <figcaption>Uitleg op jouw niveau</figcaption>
          </figure>
        </Reveal>
        <p className="ao-program-scroll-hint">Veeg door alle trainingsvormen <ArrowRight aria-hidden="true" /></p>
      </section>

      <section className="section ao-shell home-products"><Reveal><span className="ao-kicker">Vier actuele producten</span><h2>Van één keer per week tot flexibel trainen.</h2><p>Kies nog niets op basis van aannames. Vergelijk de vier bevestigde mogelijkheden en bespreek actuele prijzen en voorwaarden tijdens je gratis intake.</p></Reveal><MembershipComparison compact /><Link className="text-link" href="/abonnementen">Vergelijk alle mogelijkheden <ArrowRight aria-hidden="true" /></Link></section>

      <section className="section ao-shell"><OoievaarspasCallout /></section>

      <section className="ao-visit-section" id="eerste-bezoek"><div className="ao-shell"><FirstVisitWizard compact /></div></section>

      <section className="ao-community">
        <figure><Image src="/images/absolutely-fit-community-strength.png" alt="Verschillende leden trainen samen in de vrije-gewichtenruimte" width={1536} height={1024} sizes="(max-width: 760px) 100vw, 55vw" /><Link href="/over-ons" aria-label="Bekijk het clubverhaal"><CirclePlay aria-hidden="true" /></Link></figure>
        <Reveal className="ao-community__copy"><span className="ao-kicker ao-kicker--light">Welkom bij Absolutely Fit</span><h2>Serieus trainen.<br />Prettig binnenkomen.</h2><p>Een gezellige, professionele sportschool en een echt familiebedrijf. Je vindt hier ruimte om zelfstandig te trainen én expertise wanneer je verder wilt.</p><ul><li><Check />Vrije gewichten en machines</li><li><Check />Persoonlijke trainingsprogramma’s</li><li><Check />Techniek- en prestatiebegeleiding</li></ul><Link className="ao-button ao-button--white" href="/sporten">Bekijk alle mogelijkheden <ArrowRight /></Link></Reveal>
      </section>

      <section className="ao-ecosystem">
        <Reveal className="ao-ecosystem__intro ao-shell"><div><span className="ao-kicker">Absolutely One</span><h2>Alles van Absolutely Fit.</h2></div><p>De fysieke club blijft het hart. Een toekomstige ledenomgeving maakt je training, planning en administratie eenvoudiger — in dezelfde herkenbare stijl.</p></Reveal>
        <div className="ao-ecosystem__stage ao-shell">
          <div className="ao-portal-teaser"><header><div><Image src="/brand/absolutely-fit-lockup.svg" alt="Absolutely Fit" width={590} height={142} sizes="150px" /><span>Mijn Absolutely Fit</span></div><small>Demo ledenomgeving</small></header><div className="ao-portal-teaser__body"><aside><span className="is-active">Overzicht</span><span>Training</span><span>Planning</span><span>Lidmaatschap</span></aside><div><p>Goedemorgen</p><h3>Jouw overzicht</h3><section><span>Volgende training</span><strong>Upper body strength</strong><small>Vandaag · 18:00</small><i style={{ width: "72%" }} /></section><div className="ao-teaser-grid"><article><QrCode /><strong>Ledenpas</strong><span>Actief</span></article><article><Clock3 /><strong>Clubinfo</strong><span>Bekijk actuele tijden</span></article></div></div></div></div>
          <div className="ao-phone-stage"><MemberAppDemo /></div>
          <div className="ao-ecosystem__features"><span><Smartphone />Eén herkenbare ervaring</span><span><QrCode />Digitale ledenpas</span><span><ShieldCheck />Rustig en overzichtelijk</span><Link href="/ledenportaal">Open het ledenportaal <ArrowRight /></Link></div>
        </div>
      </section>

      <section className="ao-club-story ao-shell">
        <Reveal className="ao-club-story__head"><span className="ao-kicker">Zo willen we club zijn</span><h2>Een plek om binnen te komen én verder te bouwen.</h2><p>Goede training begint voor ons met aandacht, duidelijke uitleg en een omgeving waarin je op je eigen niveau kunt werken.</p><Link href="/gratis-persoonlijke-intake">Bereid je gratis intake voor <ArrowUpRight aria-hidden="true" /></Link></Reveal>
        <div className="ao-club-story__principles">{clubPromises.map(([number, title, text], index) => <Reveal className="ao-club-story__principle" delay={index * 65} key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></Reveal>)}</div>
      </section>

      <section className="section ao-shell home-trust-grid"><TrustCredentialCard /><MediaMentionCard /></section>

      <section className="ao-journal ao-shell">
        <Reveal className="ao-journal__head"><div><span className="ao-kicker">Kennisbank</span><h2>Train met meer begrip.</h2></div><Link href="/kennisbank">Alle artikelen <ArrowRight /></Link></Reveal>
        <div className="ao-journal__grid">{posts.slice(0, 3).map((post,index) => { const [width, height] = articleImageSize(post.image); return <Link href={`/kennisbank/${post.slug}`} className={index === 0 ? "is-feature" : ""} key={post.slug}><figure><Image src={post.image} alt="" width={width} height={height} sizes="(max-width: 760px) 100vw, 33vw" /><span>{post.category}</span></figure><small>{post.readTime} leestijd</small><h3>{post.title}</h3><p>{post.intro}</p><ChevronRight aria-hidden="true" /></Link>; })}</div>
      </section>

      <section className="section ao-shell home-practical"><OpeningHoursCard /><FreeIntakeCTA compact title="Persoonlijk beginnen in het Havenkwartier." /></section>

      <section className="ao-location">
        <div className="ao-location__image"><Image src="/images/club-exterior.webp" alt="Absolutely Fit aan de Doctor Lelykade in Scheveningen" width={1536} height={1152} sizes="(max-width: 760px) 100vw, 50vw" /></div>
        <Reveal className="ao-location__copy"><span className="ao-kicker">Tot snel in de club</span><h2>Kom eens binnen.</h2><p>Wil je meer weten over onze begeleiding, trainingen of mogelijkheden? Begin met een gratis persoonlijke intake.</p><address><MapPin aria-hidden="true" />Doctor Lelykade 240<br />2583 CP Den Haag</address><a href={`tel:${contact.phoneHref}`}>{contact.phoneDisplay}</a><a href={`mailto:${contact.email}`}>{contact.email}</a><Link className="ao-button ao-button--blue" href="/gratis-persoonlijke-intake">{callsToAction.freeIntake} <ArrowRight /></Link></Reveal>
      </section>
    </main>
  );
}
