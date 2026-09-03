import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Dumbbell, ShieldCheck, UserRound } from "lucide-react";
import { privateRobots } from "@/lib/metadata";

export const metadata: Metadata = { title: "Inloggen — demo", description: "Kies een fictieve rol om het Absolutely Fit prototype te bekijken.", robots: privateRobots };

export default function LoginPage() {
  return <main className="demo-login"><section><div className="demo-login__brand"><Image src="/brand/absolutely-fit-lockup.svg" alt="Absolutely Fit" width={590} height={142} sizes="180px" /><span>Absolutely One</span></div><span className="ao-kicker">Interactief prototype</span><h1>Welkom terug.</h1><p>Kies een demo-omgeving. Er worden geen echte accounts, betalingen of persoonsgegevens gebruikt.</p><div className="demo-login__roles"><Link href="/ledenportaal"><UserRound /><span><small>Lid</small><strong>Open als Sam</strong><p>Training, planning, ledenpas, facturen en berichten.</p></span><ArrowRight /></Link><Link href="/backoffice"><ShieldCheck /><span><small>Beheerder</small><strong>Open clubbeheer</strong><p>Rooster, leden, kennismakingen, communicatie en content.</p></span><ArrowRight /></Link><Link href="/backoffice/rooster"><Dumbbell /><span><small>Trainer</small><strong>Open roosterbeheer</strong><p>Plan en versleep trainingen in het demonstratierooster.</p></span><ArrowRight /></Link></div><Link className="demo-login__back" href="/">← Terug naar de website</Link></section><figure><Image src="/images/absolutely-fit-coach-portrait.png" alt="Strength coach bij het squatrek" width={1122} height={1402} sizes="(max-width: 760px) 100vw, 50vw" /><figcaption><strong>Eén club.</strong><span>Eén herkenbare digitale ervaring.</span></figcaption></figure></main>;
}
