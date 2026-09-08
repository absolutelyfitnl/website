"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Clock3, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/site-data";
import { callsToAction, site } from "@/lib/content/site";
import { formatCustomerOpeningStatus, getOpeningStatus } from "@/lib/content/opening-hours";

export function BrandLogo({ priority = false, variant = "lockup" }: { priority?: boolean; variant?: "lockup" | "official" | "symbol" | "wordmark" }) {
  const [width, height] = variant === "official" ? [960, 880] : variant === "symbol" ? [730, 535] : variant === "wordmark" ? [918, 318] : [590, 142];
  return <Image className={`brand-logo brand-logo--${variant}`} src={`/brand/absolutely-fit-${variant}.svg`} alt="Absolutely Fit" width={width} height={height} sizes="(max-width: 480px) 160px, 190px" loading={priority ? "eager" : "lazy"} />;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openingStatus, setOpeningStatus] = useState<ReturnType<typeof getOpeningStatus> | null>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setIsScrolled(window.scrollY > 12));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, []);

  useEffect(() => {
    const update = () => setOpeningStatus(getOpeningStatus(new Date(), site.timeZone));
    update();
    const interval = window.setInterval(update, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const body = document.body;
    const previousOverflow = body.style.overflow;
    const menuTrigger = menuTriggerRef.current;
    const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusFrame = requestAnimationFrame(() => menuRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab" || !menuRef.current) return;
      const focusable = [...menuRef.current.querySelectorAll<HTMLElement>(focusableSelector)].filter((element) => !element.hasAttribute("disabled"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    body.style.overflow = "hidden";
    body.setAttribute("data-scroll-locked", "true");
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      body.style.overflow = previousOverflow;
      body.removeAttribute("data-scroll-locked");
      menuTrigger?.focus();
    };
  }, [menuOpen]);

  if (pathname.startsWith("/ledenportaal") || pathname.startsWith("/backoffice")) return null;
  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  return (
    <>
      <header className={`site-header ao-header${isScrolled ? " is-scrolled" : ""}${menuOpen ? " is-menu-open" : ""}`}>
        <div className="ao-utility"><div><span>Familieclub sinds 1998</span><span>Doctor Lelykade 240</span><span>Voor ieder niveau</span><Link href="/openingstijden"><Clock3 aria-hidden="true" /> Vandaag: bekijk openingstijden <ArrowRight aria-hidden="true" /></Link></div></div>
        <div className="site-header__inner">
          <Link href="/" className="brand-link" aria-label="Absolutely Fit homepage"><BrandLogo priority /></Link>
          <nav className="desktop-nav" aria-label="Hoofdnavigatie">
            {navItems.map((item) => <Link key={item.href} href={item.href} className={isActive(item.href) ? "is-active" : undefined} aria-current={isActive(item.href) ? "page" : undefined}>{item.label}</Link>)}
          </nav>
          <div className="header-actions">
            <Button asChild variant="ghost" className="header-login"><Link href="/inloggen">Inloggen</Link></Button>
            <Button asChild className="button-primary header-join"><Link href="/gratis-persoonlijke-intake">{callsToAction.freeIntakeShort}</Link></Button>
            <Button ref={menuTriggerRef} type="button" variant="ghost" className="mobile-menu-trigger" aria-label={menuOpen ? "Menu sluiten" : "Menu openen"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)}><span>Menu</span><i className="mobile-menu-trigger__glyph" aria-hidden="true"><b /><b /><b /></i></Button>
          </div>
        </div>
      </header>
      {menuOpen && <>
        <button type="button" className="mobile-menu-overlay" data-slot="sheet-overlay" aria-label="Menu sluiten" tabIndex={-1} onClick={() => setMenuOpen(false)} />
        <aside ref={menuRef} id="mobile-navigation" className="mobile-menu" role="dialog" aria-modal="true" aria-labelledby="mobile-navigation-title" aria-describedby="mobile-navigation-description" data-state="open">
          <div className="mobile-menu__header" data-slot="sheet-header">
            <h2 id="mobile-navigation-title" data-slot="sheet-title"><span className="mobile-menu__title-label">Navigatiemenu</span><BrandLogo /></h2>
            <p id="mobile-navigation-description" data-slot="sheet-description">Fitness, begeleiding en clubinformatie.</p>
            <button type="button" className="mobile-menu__close" aria-label="Menu sluiten" onClick={() => setMenuOpen(false)}><span>Sluiten</span><X aria-hidden="true" /></button>
          </div>
          <div className="mobile-menu__intro" data-open={openingStatus ? (openingStatus.isOpen ? "true" : "false") : "pending"}><span><i /> Clubinformatie</span><strong role="status" aria-live="polite">{openingStatus ? formatCustomerOpeningStatus(openingStatus) : "ACTUELE OPENINGSTIJDEN"}</strong></div>
          <nav className="mobile-nav" aria-label="Mobiele navigatie">
            {navItems.map((item, index) => <Link href={item.href} key={item.href} onClick={() => setMenuOpen(false)} className={isActive(item.href) ? "is-active" : undefined} aria-current={isActive(item.href) ? "page" : undefined}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><strong>{item.label}</strong><ArrowUpRight aria-hidden="true" /></Link>)}
          </nav>
          <div className="mobile-menu__actions">
            <Button asChild className="button-primary button-large"><Link href="/gratis-persoonlijke-intake" onClick={() => setMenuOpen(false)}>{callsToAction.freeIntake}</Link></Button>
            <Button asChild variant="outline" className="button-large"><Link href="/inloggen" onClick={() => setMenuOpen(false)}>Inloggen</Link></Button>
          </div>
          <footer className="mobile-menu__footer"><span>Absolutely Fit</span><p>Persoonlijke fitness · kracht · begeleiding</p></footer>
        </aside>
      </>}
    </>
  );
}
