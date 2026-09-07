import Image from "next/image";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { openingHourGroups } from "@/lib/content/opening-hours";
import { contact, officialLinks } from "@/lib/content/site";
import { pageMetadata } from "@/lib/metadata";
import { Reveal } from "@/components/reveal";

export const metadata = pageMetadata("Contact met Absolutely Fit", "Neem contact op met Absolutely Fit in Scheveningen voor een gratis persoonlijke intake, abonnement, Ooievaarspas of begeleiding.", "/contact");

const allowedGoals = new Set(["sterker", "fitter", "afvallen", "spiermassa", "prestatie"]);
const allowedMoments = new Set(["ochtend", "middag", "avond", "wisselend"]);
const allowedGuidance = new Set(["wegwijs", "startplan", "coaching", "weet-nog-niet", "zelf", "start", "intensief"]);
const allowedTopics = new Set(["intake", "abonnement", "personal-training", "begeleiding", "ooievaarspas", "anders"]);
const allowedMemberships = new Set(["weekly", "unlimited", "ten-visit", "youth"]);

function validParam(value: string | string[] | undefined, allowed: Set<string>) {
  return typeof value === "string" && allowed.has(value) ? value : undefined;
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const prefill = {
    topic: validParam(query.onderwerp, allowedTopics),
    membership: validParam(query.abonnement, allowedMemberships),
    goal: validParam(query.doel, allowedGoals),
    moment: validParam(query.moment, allowedMoments),
    guidance: validParam(query.begeleiding, allowedGuidance),
  };
  return (
    <main>
      <section className="contact-hero shell-wide">
        <div className="contact-hero__copy"><span className="eyebrow">Neem contact op</span><h1 className="display">Vertel ons waar je wilt beginnen.</h1><p>Plan je gratis persoonlijke intake of stel een vraag over trainen, een product, personal training of de Ooievaarspas.</p></div>
        <div className="contact-hero__details">
          <a href={`tel:${contact.phoneHref}`}><Phone aria-hidden="true" /><span><small>Bel ons</small><strong>{contact.phoneDisplay}</strong></span></a>
          <a href={`mailto:${contact.email}`}><Mail aria-hidden="true" /><span><small>Mail ons</small><strong>{contact.email}</strong></span></a>
          <div><MapPin aria-hidden="true" /><span><small>De club</small><strong>Doctor Lelykade 240<br />2583 CP Den Haag</strong></span></div>
          <a href="/openingstijden"><Clock3 aria-hidden="true" /><span><small>Openingstijden</small><strong>{openingHourGroups[0].label}: {openingHourGroups[0].opens}–{openingHourGroups[0].closes}<br />Bekijk de hele week</strong></span></a>
        </div>
      </section>

      <section className="section shell contact-workspace">
        <div className="contact-workspace__intro"><span className="eyebrow">Gratis persoonlijke intake</span><h2 className="display">Zet de eerste stap.</h2><p>Vertel kort waar je aan wilt werken. Dit demoformulier verzendt niets; bel of mail de club om werkelijk een gratis intake of antwoord af te spreken.</p><div className="contact-note"><strong>Liever direct overleggen?</strong><p>Bel {contact.phoneDisplay}. Tijdens trainingen kan het team niet altijd meteen opnemen; laat dan gerust een bericht achter.</p></div></div>
        <ContactForm prefill={prefill} />
      </section>

      <Reveal as="section" className="club-route shell-wide">
        <div className="club-route__image"><Image src="/images/club-exterior.webp" alt="Historisch gevelbeeld uit het archief van Absolutely Fit" width={1536} height={1152} sizes="(max-width: 760px) 100vw, 50vw" /><span>Beeld uit het clubarchief</span></div>
        <div className="club-route__copy"><span className="eyebrow eyebrow--light">Absolutely Fit · Scheveningen</span><h2 className="display display--light">Tot snel in de club.</h2><address>Doctor Lelykade 240<br />2583 CP Den Haag</address><p>Neem voor je gratis persoonlijke intake even contact op. Dan weet je wanneer iemand tijd heeft om je rustig te ontvangen.</p><a className="button-light button-large route-button" href={officialLinks.directions} target="_blank" rel="noopener noreferrer">Open routebeschrijving</a></div>
      </Reveal>
    </main>
  );
}
