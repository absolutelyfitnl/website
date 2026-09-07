import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { OpeningHoursCard } from "@/components/content-sections";
import { PublicSchedule } from "@/components/public-schedule";
import { Reveal } from "@/components/reveal";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Rooster en clubtijden", "Bekijk de reguliere openingstijden van Absolutely Fit en een duidelijk gemarkeerd demonstratierooster voor toekomstige begeleide momenten.", "/rooster");

export default function SchedulePage() {
  return <main className="public-schedule">
    <section className="public-schedule__hero ao-shell"><div><span className="ao-kicker">Plan je bezoek</span><h1>Rooster & clubtijden.</h1></div><div><p>De reguliere openingstijden hieronder zijn actueel. Het begeleide rooster is een interactieve prototypeweergave met uitsluitend fictieve momenten en capaciteit.</p><Link href="/openingstijden">Bekijk alle clubinformatie <ArrowRight aria-hidden="true" /></Link></div></section>
    <Reveal as="section" className="public-hours public-hours--current ao-shell"><OpeningHoursCard compact /><div><CalendarDays aria-hidden="true" /><span><small>Begeleide momenten</small><strong>Demonstratie</strong></span><p>De kaarten hieronder zijn geen actueel boekingssysteem en maken geen echte reservering.</p></div></Reveal>
    <div className="public-schedule__demo-intro ao-shell"><span className="demo-inline">Demorooster · tijden en capaciteit zijn fictief</span><p>Probeer filters en weeknavigatie om het toekomstige concept te bekijken.</p></div>
    <PublicSchedule />
  </main>;
}
