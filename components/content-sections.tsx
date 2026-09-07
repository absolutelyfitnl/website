import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, CalendarCheck, Check, Clock3, ExternalLink, HandHeart, Newspaper, ShieldCheck, Sparkles } from "lucide-react";
import { memberships } from "@/lib/content/memberships";
import { openingHourGroups } from "@/lib/content/opening-hours";
import { ooievaarspas, xxlAffiliate } from "@/lib/content/partners";
import { callsToAction } from "@/lib/content/site";
import { trustCredential } from "@/lib/content/claims";

export function Breadcrumbs({ items }: { items: readonly { label: string; href: string }[] }) {
  return <nav className="content-breadcrumbs" aria-label="Broodkruimelpad"><ol>{items.map((item, index) => <li key={item.href}>{index < items.length - 1 ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</li>)}</ol></nav>;
}

export function FreeIntakeCTA({ title = "Begin met een gratis persoonlijke intake.", text = "Bespreek je doel, ervaring en planning. Daarna kijken we samen welke trainingsvorm en welk product passen.", compact = false }: { title?: string; text?: string; compact?: boolean }) {
  return <section className={`free-intake-cta${compact ? " free-intake-cta--compact" : ""}`}><div><span><Sparkles aria-hidden="true" /> Gratis persoonlijke intake</span><h2>{title}</h2><p>{text}</p></div><Link className="ao-button ao-button--blue" href="/gratis-persoonlijke-intake">{callsToAction.freeIntake}<ArrowRight aria-hidden="true" /></Link></section>;
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
    <div className="ooievaar-callout__mark"><HandHeart aria-hidden="true" /><strong>50%</strong><span>Ooievaarspas</span></div>
    <div><span>Toegankelijk sporten in Den Haag</span><h2>{ooievaarspas.claim}</h2><p>{ooievaarspas.applicationNote}</p>{detailed && <div className="ooievaar-callout__links"><Link href="/contact?onderwerp=ooievaarspas">Bespreek je Ooievaarspas <ArrowRight aria-hidden="true" /></Link><a href={ooievaarspas.officialApplicationUrl} target="_blank" rel="noopener noreferrer">Aanvragen bij gemeente Den Haag <ExternalLink aria-hidden="true" /></a><a href={ooievaarspas.officialOfferUrl} target="_blank" rel="noopener noreferrer">Officiële aanbiedingspagina <ExternalLink aria-hidden="true" /></a></div>}</div>
    {!detailed && <Link href="/ooievaarspas">Bekijk hoe het werkt <ArrowRight aria-hidden="true" /></Link>}
  </section>;
}

export function OpeningHoursCard({ compact = false }: { compact?: boolean }) {
  return <section className={`opening-hours-card${compact ? " opening-hours-card--compact" : ""}`}><header><Clock3 aria-hidden="true" /><div><span>Clubinformatie</span><h2>Openingstijden</h2></div></header><dl>{openingHourGroups.map((group) => <div key={group.label}><dt>{group.label}</dt><dd>{group.opens}–{group.closes}</dd></div>)}</dl><p>Feestdagopening is niet standaard bevestigd. Neem bij twijfel vooraf contact op.</p>{!compact && <Link href="/contact">Vraag het team <ArrowRight aria-hidden="true" /></Link>}</section>;
}

export function TrustCredentialCard({ compact = false }: { compact?: boolean }) {
  return <section className={`trust-credential${compact ? " trust-credential--compact" : ""}`}><div className="trust-credential__icon"><BadgeCheck aria-hidden="true" /></div><div><span>Techniek · opbouw · prestatie</span><h2>{trustCredential.publicLabel}</h2><p>{compact ? "Principes uit kracht- en prestatiesport, begrijpelijk toegepast op jouw startpunt." : trustCredential.publicExplanation}</p><div className="trust-credential__status"><ShieldCheck aria-hidden="true" /><span><strong>Transparante bewijsstatus</strong> Beschermde NOC*NSF- en Olympische merkelementen worden niet gebruikt zolang exacte status en logorecht niet zijn bevestigd.</span></div></div><Link href="/topsport-en-ntc" aria-label="Lees over topsportkennis en de NTC-bewijsstatus"><ArrowUpRight aria-hidden="true" /></Link></section>;
}

export function StoryTimeline() {
  const moments = [
    ["1998", "Een vaste plek in het Havenkwartier", "Absolutely Fit opent als familiegedreven trainingsplek in Scheveningen."],
    ["De basis", "Kracht en techniek", "Praktijkervaring uit de krachtsport vormt de basis voor heldere uitleg en planmatige opbouw."],
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
  if (!xxlAffiliate.enabled || !xxlAffiliate.affiliateUrl || !xxlAffiliate.allowedPlacements.includes(placement)) return null;
  return <aside className="affiliate-partner-card"><div><span>Externe partnerlink</span><h2>XXL Nutrition</h2><p>Bekijk het aanbod rechtstreeks bij XXL Nutrition. Absolutely Fit verkoopt deze producten niet en geeft via deze kaart geen persoonlijk advies.</p><small>{xxlAffiliate.disclosure} {xxlAffiliate.adviceDisclaimer}</small></div><a href={xxlAffiliate.affiliateUrl} target="_blank" rel="sponsored noopener noreferrer" aria-label="Open XXL Nutrition via de affiliatepartnerlink in een nieuw venster">Naar XXL Nutrition <ExternalLink aria-hidden="true" /></a></aside>;
}

export function IntakeSteps() {
  return <div className="intake-steps">{[[CalendarCheck, "01", "Voorbereiden", "Kies in de wizard je doel, voorkeursmoment en gewenste begeleiding."], [Sparkles, "02", "Persoonlijk bespreken", "Tijdens de gratis intake stelt het team vragen en legt de mogelijkheden uit."], [ArrowRight, "03", "Vervolg kiezen", "Je ontvangt actuele productinformatie en spreekt af wat een logische volgende stap is."]].map(([Icon, number, title, text]) => { const StepIcon = Icon as typeof CalendarCheck; return <article key={String(number)}><StepIcon aria-hidden="true" /><span>{String(number)}</span><h3>{String(title)}</h3><p>{String(text)}</p></article>; })}</div>;
}
