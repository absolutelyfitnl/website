"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { BrandLogo } from "@/components/site-header";
import { contact, navItems } from "@/lib/site-data";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/ledenportaal") || pathname.startsWith("/backoffice")) return null;
  return (
    <footer className="site-footer">
      <div className="c90-footer__headline"><span>Klaar voor je eerste stap?</span><h2>Tot snel.</h2><Link href="/contact" aria-label="Plan een kennismaking"><ArrowUpRight aria-hidden="true" /></Link></div>
      <div className="c90-footer__body">
        <div className="c90-footer__brand"><BrandLogo /><p>Professionele fitness en persoonlijke begeleiding in Scheveningen.</p></div>
        <div className="c90-footer__contact"><span>Contact</span><a href={`tel:${contact.phoneHref}`}><Phone aria-hidden="true" />{contact.phoneDisplay}</a><a href={`mailto:${contact.email}`}><Mail aria-hidden="true" />{contact.email}</a><p>{contact.location}</p></div>
        <nav className="c90-footer__nav" aria-label="Footernavigatie">{navItems.map((item, index) => <Link href={item.href} key={item.href}><span>{String(index + 1).padStart(2, "0")}</span>{item.label}<ArrowUpRight aria-hidden="true" /></Link>)}</nav>
      </div>
      <div className="c90-footer__base"><span>© {new Date().getFullYear()} Absolutely Fit</span><span><Link href="/mijn-eerste-bezoek">Eerste-bezoekwizard</Link> · <Link href="/ledenapp">Ledenappconcept</Link></span><span><Link href="/inloggen">Leden- en backoffice-demo</Link> · Demo verwerkt geen persoonsgegevens</span></div>
    </footer>
  );
}
