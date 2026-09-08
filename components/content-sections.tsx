import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarCheck, Check, Clock3, ExternalLink, Newspaper, ShieldCheck, Sparkles } from "lucide-react";
import { memberships } from "@/lib/content/memberships";
import { openingHourGroups } from "@/lib/content/opening-hours";
import { ooievaarspas, xxlAffiliate } from "@/lib/content/partners";
import { callsToAction } from "@/lib/content/site";
import { trustCredential } from "@/lib/content/claims";

export function Breadcrumbs({ items }: { items: readonly { label: string; href: string }[] }) {
  return <nav className="content-breadcrumbs" aria-label="Broodkruimelpad"><ol>{items.map((item, index) => <li key={item.href}>{index < items.length - 1 ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</li>)}</ol></nav>;
}

export function FreeIntakeCTA({ title = "Begin met een gratis persoonlijke intake.", text = "Bespreek je doel, ervaring en planning. Daarna kijken we samen welke trainingsvorm en welk product passen.", compact = false }: { title?: string; text?: string; compact?: boolean }) {
  return <section className={`free-intake-cta${compact ? " free-intake-cta--compact" : ""}`}><div className="free-intake-cta__copy"><span><Sparkles aria-hidden="true" /> Gratis persoonlijke intake</span><h2>{title}</h2><p>{text}</p></div><Link className="ao-button ao-button--blue" href="/gratis-persoonlijke-intake">{callsToAction.freeIntake}<ArrowRight aria-hidden="true" /></Link></section>;
}

export function MembershipComparison({ compact = false }: { compact?: boolean }) {
  return <div className={`membership-comparison${compact ? " membership-comparison--compact" : ""}`}>
    {memberships.map((membership, index) => <article key={membership.id} id={`product-${membership.id}`}>
      <header><span>{String(index + 1).padStart(2, "0")}</span><em>{membership.kind === "rittenkaart" ? "Rittenkaart" : "Lidmaatschap"}</em></header>
      <h3>{membership.name}</h3><p>{membership.summary}</p>
      <ul>{membership.confirmedFeatures.map((feature) => <li key={feature}><Check aria-hidden="true" />{feature}</li>)}</ul>
      <small>Prijs en overige voorwaarden worden actueel tijdens de gratis intake toegelicht.</small>
      <Link href={membership.ctaHref}>Bespreek deze mogelijkheid <ArrowRight aria-hidden="true" /></Link>
    </article>)}
  </div>;
}

export function OoievaarspasCallout({ detailed = false }: { detailed?: boolean }) {
  return <section className={`ooievaar-callout${detailed ? " ooievaar-callout--detailed" : ""}`}>
    <div className="ooievaar-callout__mark"><Image src="/partners/ooievaarspas.svg" alt="Ooievaarspas" width={71} height={90} sizes="90px" /><span><strong>50%</strong><small>korting</small></span></div>
    <div className="ooievaar-callout__copy"><span>Toegankelijk sporten in Den Haag</span><h2>{ooievaarspas.claim}</h2><p>{ooievaarspas.applicationNote}</p>{detailed && <div className="ooievaar-callout__links"><Link href="/contact?onderwerp=ooievaarspas">Bespreek je Ooievaarspas <ArrowRight aria-hidden="true" /></Link><a href={ooievaarspas.officialApplicationUrl} target="_blank" rel="noopener noreferrer">Aanvragen bij gemeente Den Haag <ExternalLink aria-hidden="true" /></a><a href={ooievaarspas.officialOfferUrl} target="_blank" rel="noopener noreferrer">Officiële aanbiedingspagina <ExternalLink aria-hidden="true" /></a></div>}</div>
    {!detailed && <Link href="/ooievaarspas">Bekijk hoe het werkt <ArrowRight aria-hidden="true" /></Link>}
  </section>;
}

export function OpeningHoursCard({ compact = false }: { compact?: boolean }) {
  return <section className={`opening-hours-card${compact ? " opening-hours-card--compact" : ""}`}><header><Clock3 aria-hidden="true" /><div><span>Clubinformatie</span><h2>Openingstijden</h2></div></header><dl>{openingHourGroups.map((group) => <div key={group.label}><dt>{group.label}</dt><dd>{group.opens}–{group.closes}</dd></div>)}</dl><p>Feestdagopening is niet standaard bevestigd. Neem bij twijfel vooraf contact op.</p>{!compact && <Link href="/contact">Vraag het team <ArrowRight aria-hidden="true" /></Link>}</section>;
}

export function TrustCredentialCard({ compact = false }: { compact?: boolean }) {
  return <section className={`trust-credential${compact ? " trust-credential--compact" : ""}`}><div className="trust-credential__icon"><Image src="/partners/noc-nsf-full-color.svg" alt="NOC*NSF" width={102} height={90} sizes="102px" /></div><div className="trust-credential__copy"><span>Krachtsportgeschiedenis · techniek · opbouw</span><h2>{trustCredential.publicLabel}</h2><p>{compact ? "Bewezen krachtsportervaring, begrijpelijk toegepast op jouw startpunt." : "Rik Priester senior werd meervoudig Nederlands kampioen en in 1990 wereldkampioen powerliften. Die praktijkervaring vormt een basis voor heldere techniek en trainingsopbouw."}</p><div className="trust-credential__status"><ShieldCheck aria-hidden="true" /><span><strong>Context, geen certificeringsclaim</strong> Het NOC*NSF-logo wordt met toestemming in deze inhoudelijke context getoond. We verbinden daar geen specifieke actuele erkenning, accreditatie of geldigheid aan.</span></div></div><Link href="/topsport-en-ntc" aria-label="Lees over onze topsportgeschiedenis en de NTC-context"><ArrowUpRight aria-hidden="true" /></Link></section>;
}

export function StoryTimeline() {
  const moments = [
    ["1990", "Wereldkampioen powerliften", "Rik Priester senior wordt wereldkampioen powerliften; die praktijkkennis vormt nog altijd een basis voor techniek en opbouw."],
    ["1998", "Een vaste plek in het Havenkwartier", "Absolutely Fit opent als familiegedreven trainingsplek in Scheveningen."],
    ["Vandaag", "Voor ieder niveau", "Beginners, ervaren sporters, locals en nieuwkomers trainen naast elkaar met aandacht voor hun eigen route."],
  ] as const;
  return <div className="story-timeline">{moments.map(([year, title, text], index) => <article key={year}><span>{String(index + 1).padStart(2, "0")}</span><strong>{year}</strong><h3>{title}</h3><p>{text}</p></article>)}</div>;
}

export function MediaMentionCard() {
  return <article className="media-mention-card"><Newspaper aria-hidden="true" /><div><span>In de media</span><h2>Een familieclub met een plek in het Havenkwartier.</h2><p>Rond de Haven sprak in de zomer van 2026 met Absolutely Fit over de geschiedenis, de persoonlijke sfeer en de nuchtere kijk op trainen.</p><small>Bron: Rond de Haven, zomer 2026, pagina 6</small></div><Link href="/in-de-media/rond-de-haven-2026">Lees onze samenvatting <ArrowRight aria-hidden="true" /></Link></article>;
}

export function SourceNote({ children }: { children: React.ReactNode }) {
  return <aside className="source-note"><Newspaper aria-hidden="true" /><p>{children}</p></aside>;
}

export function AffiliatePartnerCard({ placement }: { placement: "knowledge-article" | "strength-training" }) {
  if (!xxlAffiliate.allowedPlacements.includes(placement)) return null;
  let affiliateUrl: string | null = null;
  if (!xxlAffiliate.enabled || !xxlAffiliate.affiliateUrl) {
    affiliateUrl = null;
  } else {
    affiliateUrl = xxlAffiliate.affiliateUrl;
  }

  return <aside className={`affiliate-partner-card${affiliateUrl ? " affiliate-partner-card--linked" : ""}`}>
    <figure><Image src="/partners/xxl-product-range.avif" alt="Een selectie sportvoedingsproducten van XXL Nutrition" width={1080} height={1080} sizes="(max-width: 700px) calc(100vw - 72px), 360px" /></figure>
    <div className="affiliate-partner-card__copy"><span>{affiliateUrl ? "Externe partnerlink" : "Uitgelicht merk"}</span><h2>XXL Nutrition</h2><p>Een herkenbaar assortiment rond training en sportvoeding. Absolutely Fit verkoopt deze producten niet en deze kaart is geen persoonlijk advies.</p><small>{affiliateUrl ? `${xxlAffiliate.disclosure} ${xxlAffiliate.adviceDisclaimer}` : "Productbeeld met toestemming geplaatst. Er is op dit moment geen affiliate-link of koopknop actief."}</small></div>
    {affiliateUrl && <a href={affiliateUrl} target="_blank" rel="sponsored noopener noreferrer" aria-label="Open XXL Nutrition via de affiliatepartnerlink in een nieuw venster">Naar XXL Nutrition <ExternalLink aria-hidden="true" /></a>}
  </aside>;
}

export function IntakeSteps() {
  return <div className="intake-steps">{[[CalendarCheck, "01", "Voorbereiden", "Kies in de wizard je doel, voorkeursmoment en gewenste begeleiding."], [Sparkles, "02", "Persoonlijk bespreken", "Tijdens de gratis intake stelt het team vragen en legt de mogelijkheden uit."], [ArrowRight, "03", "Vervolg kiezen", "Je ontvangt actuele productinformatie en spreekt af wat een logische volgende stap is."]].map(([Icon, number, title, text]) => { const StepIcon = Icon as typeof CalendarCheck; return <article key={String(number)}><StepIcon aria-hidden="true" /><span>{String(number)}</span><h3>{String(title)}</h3><p>{String(text)}</p></article>; })}</div>;
}
