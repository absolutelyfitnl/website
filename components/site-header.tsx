"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Clock3, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { navItems } from "@/lib/site-data";

export function BrandLogo({ priority = false, variant = "lockup" }: { priority?: boolean; variant?: "lockup" | "official" | "symbol" | "wordmark" }) {
  const [width, height] = variant === "official" ? [960, 880] : variant === "symbol" ? [730, 535] : variant === "wordmark" ? [918, 318] : [590, 142];
  return <Image className={`brand-logo brand-logo--${variant}`} src={`/brand/absolutely-fit-${variant}.svg`} alt="Absolutely Fit" width={width} height={height} sizes="(max-width: 480px) 160px, 190px" loading={priority ? "eager" : "lazy"} />;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  if (pathname.startsWith("/ledenportaal") || pathname.startsWith("/backoffice")) return null;
  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  return (
    <header className="site-header ao-header">
      <div className="ao-utility"><div><span>Fitnessclub in Scheveningen</span><span>Persoonlijke begeleiding</span><span>Voor ieder niveau</span><Link href="/contact"><Clock3 aria-hidden="true" /> Actuele clubinformatie opvragen <ArrowRight aria-hidden="true" /></Link></div></div>
      <div className="site-header__inner">
        <Link href="/" className="brand-link" aria-label="Absolutely Fit homepage"><BrandLogo priority /></Link>
        <nav className="desktop-nav" aria-label="Hoofdnavigatie">
          {navItems.map((item) => <Link key={item.href} href={item.href} className={isActive(item.href) ? "is-active" : undefined}>{item.label}</Link>)}
        </nav>
        <div className="header-actions">
          <Button asChild variant="ghost" className="header-login"><Link href="/inloggen">Inloggen</Link></Button>
          <Button asChild className="button-primary header-join"><Link href="/#eerste-bezoek">Mijn eerste bezoek</Link></Button>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild><Button variant="ghost" className="mobile-menu-trigger" aria-label={menuOpen ? "Menu sluiten" : "Menu openen"} aria-expanded={menuOpen}><span>Menu</span><i className="mobile-menu-trigger__glyph" aria-hidden="true"><b /><b /></i></Button></SheetTrigger>
            <SheetContent className="mobile-menu" side="right" showCloseButton={false}>
              <SheetHeader className="mobile-menu__header">
                <SheetTitle><BrandLogo /></SheetTitle>
                <SheetDescription>Fitness, begeleiding en clubinformatie.</SheetDescription>
                <SheetClose className="mobile-menu__close" aria-label="Menu sluiten"><span>Sluiten</span><X aria-hidden="true" /></SheetClose>
              </SheetHeader>
              <div className="mobile-menu__intro"><span><i /> Clubinformatie</span><p><MapPin aria-hidden="true" /> Scheveningen · controleer gegevens voor je bezoek</p></div>
              <nav className="mobile-nav" aria-label="Mobiele navigatie">
                {navItems.map((item, index) => <SheetClose asChild key={item.href}><Link href={item.href} className={isActive(item.href) ? "is-active" : undefined} aria-current={isActive(item.href) ? "page" : undefined}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.label}</strong><ArrowUpRight aria-hidden="true" /></Link></SheetClose>)}
              </nav>
              <div className="mobile-menu__actions">
                <SheetClose asChild><Button asChild className="button-primary button-large"><Link href="/#eerste-bezoek">Mijn eerste bezoek</Link></Button></SheetClose>
                <SheetClose asChild><Button asChild variant="outline" className="button-large"><Link href="/inloggen">Inloggen in demo</Link></Button></SheetClose>
              </div>
              <footer className="mobile-menu__footer"><span>Absolutely Fit</span><p>Persoonlijke fitness · kracht · begeleiding</p></footer>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
