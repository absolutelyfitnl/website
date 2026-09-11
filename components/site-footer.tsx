"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, Clock3, Mail, MapPin, Phone } from "lucide-react";
import { BrandLogo } from "@/components/site-header";
import { openingHourGroups } from "@/lib/content/opening-hours";
import { callsToAction, contact } from "@/lib/content/site";
import { footerItems } from "@/lib/site-data";

const footerGroups = ["Starten", "Trainen", "De club", "Praktisch"] as const;

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/ledenportaal") || pathname.startsWith("/backoffice")) return null;
  return <footer className="site-footer">
    <div className="c90-footer__headline"><span>Een persoonlijk startpunt</span><h2>Klaar om te beginnen?</h2><Link href="/gratis-persoonlijke-intake" aria-label={callsToAction.freeIntake}><ArrowUpRight aria-hidden="true" /></Link></div>
    <div className="c90-footer__body c90-footer__body--expanded">
      <div className="c90-footer__brand"><BrandLogo /><p>Familiegedreven fitness, krachttraining en persoonlijke begeleiding in Scheveningen — sinds 2008.</p><Link href="/gratis-persoonlijke-intake">{callsToAction.freeIntake} <ArrowRight aria-hidden="true" /></Link></div>
      <div className="c90-footer__contact"><span>Contact & club</span><a href={`tel:${contact.phoneHref}`}><Phone aria-hidden="true" />{contact.phoneDisplay}</a><a href={`mailto:${contact.email}`}><Mail aria-hidden="true" />{contact.email}</a><p><MapPin aria-hidden="true" />{contact.location}</p><div className="c90-footer__hours"><Clock3 aria-hidden="true" /><dl>{openingHourGroups.map((group) => <div key={group.label}><dt>{group.label}</dt><dd>{group.opens}–{group.closes}</dd></div>)}</dl></div></div>
      <div className="c90-footer__nav-groups">{footerGroups.map((group) => <nav key={group} aria-label={`${group} links`}><strong>{group}</strong>{footerItems.filter((item) => item.group === group).map((item) => <Link href={item.href} key={item.href}>{item.label}<ArrowUpRight aria-hidden="true" /></Link>)}</nav>)}</div>
    </div>
    <div className="c90-footer__base"><span>© {new Date().getFullYear()} Absolutely Fit · sinds 2008</span><span><Link href="/ledenapp">Mijn Absolutely Fit</Link> · <Link href="/inloggen">Inloggen</Link></span><span>Doctor Lelykade 240 · Scheveningen</span></div>
  </footer>;
}
