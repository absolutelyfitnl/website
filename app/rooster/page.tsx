import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { OpeningHoursCard } from "@/components/content-sections";
import { PublicSchedule } from "@/components/public-schedule";
import { Reveal } from "@/components/reveal";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Rooster en clubtijden", "Bekijk de openingstijden en begeleide trainingsmomenten van Absolutely Fit in Scheveningen.", "/rooster");

export default function SchedulePage() {
  return <main className="public-schedule">
    <section className="public-schedule__hero ao-shell"><div><span className="ao-kicker">Plan je bezoek</span><h1>Rooster & clubtijden.</h1></div><div><p>Bekijk wanneer de club open is en welke begeleide trainingen er in het weekrooster staan.</p><Link href="/openingstijden">Bekijk alle clubinformatie <ArrowRight aria-hidden="true" /></Link></div></section>
    <Reveal as="section" className="public-hours public-hours--current ao-shell"><OpeningHoursCard compact /><div><CalendarDays aria-hidden="true" /><span><small>Begeleide momenten</small><strong>Weekplanning</strong></span><p>Kies een trainingsvorm en neem contact op om jouw plek te bespreken.</p></div></Reveal>
    <div className="public-schedule__demo-intro ao-shell"><span className="demo-inline">Begeleide trainingen</span><p>Filter het rooster op de trainingsvorm die bij je past.</p></div>
    <PublicSchedule />
  </main>;
}
