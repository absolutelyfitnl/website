import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { PublicSchedule } from "@/components/public-schedule";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Rooster", "Bekijk een demonstratie van het toekomstige Absolutely Fit rooster voor begeleide trainingen en kennismakingsmomenten.", "/rooster");

export default function SchedulePage() {
  return <main className="public-schedule"><section className="public-schedule__hero ao-shell"><div><span className="ao-kicker">Vind jouw moment</span><h1>Rooster & clubtijden.</h1></div><div><p>Bekijk begeleide momenten en kennismakingen. Het rooster hieronder toont uitsluitend hoe de toekomstige koppeling werkt.</p><span className="demo-inline">Demorooster · tijden en capaciteit zijn fictief</span></div></section><PublicSchedule /><section className="public-hours ao-shell"><div><Clock3 /><span><small>Maandag t/m vrijdag</small><strong>08:15 — 22:00</strong></span></div><div><CalendarDays /><span><small>Zaterdag en zondag</small><strong>08:30 — 15:00</strong></span></div><p>Gedateerde prototypesnapshot van 29 augustus 2026 — niet gegarandeerd actueel. Controleer voor vertrek de actuele clubinformatie.</p><Link className="ao-button ao-button--blue" href="/contact">Vraag het team <ArrowRight /></Link></section></main>;
}
