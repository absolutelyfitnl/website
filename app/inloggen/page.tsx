import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Dumbbell, ShieldCheck, UserRound } from "lucide-react";
import { privateRobots } from "@/lib/metadata";

export const metadata: Metadata = { title: "Inloggen — Absolutely Fit", description: "Ga naar de ledenomgeving, het clubbeheer of het rooster van Absolutely Fit.", robots: privateRobots };

export default function LoginPage() {
  return <main className="demo-login"><section><div className="demo-login__brand"><Image src="/brand/absolutely-fit-lockup.svg" alt="Absolutely Fit" width={590} height={142} sizes="180px" /><span>Absolutely One</span></div><span className="ao-kicker">Mijn Absolutely Fit</span><h1>Welkom terug.</h1><p>Kies de omgeving die bij jouw rol past.</p><div className="demo-login__roles"><Link href="/ledenportaal"><UserRound /><span><small>Lid</small><strong>Open ledenomgeving</strong><p>Training, planning, ledenpas, facturen en berichten.</p></span><ArrowRight /></Link><Link href="/backoffice"><ShieldCheck /><span><small>Beheerder</small><strong>Open clubbeheer</strong><p>Rooster, leden, gratis intakes, communicatie en content.</p></span><ArrowRight /></Link><Link href="/backoffice/rooster"><Dumbbell /><span><small>Trainer</small><strong>Open roosterbeheer</strong><p>Plan en beheer trainingen in het weekrooster.</p></span><ArrowRight /></Link></div><Link className="demo-login__back" href="/">← Terug naar de website</Link></section><figure><Image src="/images/absolutely-fit-coach-portrait.png" alt="Strength coach bij het squatrek" width={1122} height={1402} sizes="(max-width: 760px) 100vw, 50vw" /><figcaption><strong>Eén club.</strong><span>Eén herkenbare digitale ervaring.</span></figcaption></figure></main>;
}
