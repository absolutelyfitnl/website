import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { OpenNowCard } from "@/components/open-now-card";
import { openingDays, openingHours, formatOpeningRange } from "@/lib/content/opening-hours";
import { contact, officialLinks, site } from "@/lib/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Openingstijden sportschool Absolutely Fit", "Bekijk de actuele reguliere openingstijden, locatie en contactgegevens van Absolutely Fit in het Scheveningse Havenkwartier.", "/openingstijden");

export default function OpeningHoursPage() {
  return <main className="hours-page">
    <section className="hours-page__hero shell-wide"><div><span className="eyebrow eyebrow--light">Clubinformatie · Havenkwartier</span><h1 className="display display--light">Ruimte om te trainen, zeven dagen per week.</h1><p>Bekijk de reguliere openingstijden en neem voor feestdagen of uitzonderingen vooraf contact op met het team.</p></div><OpenNowCard /></section>
    <section className="section shell hours-page__layout"><div className="hours-week"><header><span>Reguliere week</span><h2>Openingstijden</h2></header><dl>{openingDays.map((day) => <div key={day.key}><dt>{day.label}</dt><dd>{openingHours[day.key].map(formatOpeningRange).join(", ")}</dd></div>)}</dl><p>Openingstijden kunnen tijdens feestdagen of bij tijdelijke uitzonderingen afwijken. Neem bij twijfel vooraf contact op.</p></div><aside><span className="eyebrow">Contact & route</span><h2>{site.address.streetAddress}</h2><p>{site.address.postalCode} {site.address.addressLocality}<br />{site.address.neighborhood}</p><a href={`tel:${contact.phoneHref}`}><Phone aria-hidden="true" />{contact.phoneDisplay}</a><a href={`mailto:${contact.email}`}><Mail aria-hidden="true" />{contact.email}</a><a href={officialLinks.directions} target="_blank" rel="noopener noreferrer"><MapPin aria-hidden="true" />Open routebeschrijving</a><Link className="ao-button ao-button--blue" href="/gratis-persoonlijke-intake">Plan een gratis intake <ArrowRight aria-hidden="true" /></Link></aside></section>
    <section className="section shell hours-page__next"><div><span className="eyebrow">Voor je eerste training</span><h2 className="display">Kies een rustig startpunt.</h2></div><div><p>Een gratis persoonlijke intake helpt je om je doel, gewenste moment en begeleiding vooraf te bespreken.</p><div className="inline-links"><Link href="/gratis-persoonlijke-intake">Plan je gratis persoonlijke intake</Link><Link href="/veelgestelde-vragen">Bekijk veelgestelde vragen</Link></div></div></section>
  </main>;
}
