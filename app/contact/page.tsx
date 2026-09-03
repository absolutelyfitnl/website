import Image from "next/image";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { contact } from "@/lib/site-data";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Contact", "Neem contact op met Absolutely Fit in Scheveningen voor een kennismaking, abonnement of vraag over begeleiding.", "/contact");

const allowedGoals = new Set(["sterker", "fitter", "afvallen", "spiermassa", "prestatie"]);
const allowedMoments = new Set(["ochtend", "middag", "avond", "wisselend"]);
const allowedGuidance = new Set(["wegwijs", "startplan", "coaching", "weet-nog-niet", "zelf", "start", "intensief"]);

function validParam(value: string | string[] | undefined, allowed: Set<string>) {
  return typeof value === "string" && allowed.has(value) ? value : undefined;
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const prefill = {
    goal: validParam(query.doel, allowedGoals),
    moment: validParam(query.moment, allowedMoments),
    guidance: validParam(query.begeleiding, allowedGuidance),
  };
  return (
    <main>
      <section className="contact-hero shell-wide">
        <div className="contact-hero__copy"><span className="eyebrow">Neem contact op</span><h1 className="display">Vertel ons waar je naartoe wilt.</h1><p>Een vraag over trainen, begeleiding of lid worden? Laat iets van je horen. We denken graag met je mee.</p></div>
        <div className="contact-hero__details">
          <a href={`tel:${contact.phoneHref}`}><Phone aria-hidden="true" /><span><small>Bel ons</small><strong>{contact.phoneDisplay}</strong></span></a>
          <a href={`mailto:${contact.email}`}><Mail aria-hidden="true" /><span><small>Mail ons</small><strong>{contact.email}</strong></span></a>
          <div><MapPin aria-hidden="true" /><span><small>De club</small><strong>Doctor Lelykade 240<br />2583 CP Den Haag</strong></span></div>
          <div><Clock3 aria-hidden="true" /><span><small>Openingstijden</small><strong>Vraag naar de actuele tijden</strong></span></div>
        </div>
      </section>

      <section className="section shell contact-workspace">
        <div className="contact-workspace__intro"><span className="eyebrow">Kennismaken</span><h2 className="display">Zet de eerste stap.</h2><p>Vertel kort wat je wilt bereiken. Het team neemt contact met je op om je vraag te beantwoorden of een kennismaking te bespreken.</p><div className="contact-note"><strong>Liever direct overleggen?</strong><p>Bel {contact.phoneDisplay}. Tijdens trainingen kan het team niet altijd meteen opnemen; laat dan gerust een bericht achter.</p></div></div>
        <ContactForm prefill={prefill} />
      </section>

      <section className="club-route shell-wide">
        <div className="club-route__image"><Image src="/images/club-exterior.webp" alt="Historisch gevelbeeld uit het archief van Absolutely Fit" width={1536} height={1152} sizes="(max-width: 760px) 100vw, 50vw" /><span>Beeld uit het clubarchief</span></div>
        <div className="club-route__copy"><span className="eyebrow eyebrow--light">Absolutely Fit · Scheveningen</span><h2 className="display display--light">Tot snel in de club.</h2><address>Doctor Lelykade 240<br />2583 CP Den Haag</address><p>Neem voor je eerste bezoek even contact op. Dan weet je wanneer iemand tijd heeft om je rustig te ontvangen en rond te leiden.</p><a className="button-light button-large route-button" href="https://www.google.com/maps/search/?api=1&query=Doctor+Lelykade+240+Den+Haag" target="_blank" rel="noreferrer">Open routebeschrijving</a></div>
      </section>
    </main>
  );
}
