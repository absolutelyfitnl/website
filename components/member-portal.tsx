"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, Bell, CalendarDays, Check, ChevronRight, CircleHelp, Clock3, CreditCard, Download, Dumbbell, FileText, Home, MessageSquare, Newspaper, Pause, Play, QrCode, RotateCcw, Send, Settings, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { DemoScheduleEvent, demoSchedule, formatDemoTime } from "@/lib/demo-data";
import { PUBLISHED_STORAGE_KEY, SCHEDULE_PUBLISHED_EVENT, memberSchedule, parseScheduleSnapshot } from "@/lib/schedule-storage";
import { useAmsterdamWeek } from "@/lib/content/current-week";
import { memberships } from "@/lib/content/memberships";
import { openingHourGroups } from "@/lib/content/opening-hours";

export type PortalSection = "overview" | "training" | "rooster" | "lidmaatschap" | "facturen" | "berichten" | "profiel";

const nav = [
  { section: "overview", href: "/ledenportaal", label: "Overzicht", icon: Home },
  { section: "training", href: "/ledenportaal/training", label: "Training", icon: Dumbbell },
  { section: "rooster", href: "/ledenportaal/rooster", label: "Planning", icon: CalendarDays },
  { section: "lidmaatschap", href: "/ledenportaal/lidmaatschap", label: "Lidmaatschap", icon: CreditCard },
  { section: "facturen", href: "/ledenportaal/facturen", label: "Facturen", icon: FileText },
  { section: "berichten", href: "/ledenportaal/berichten", label: "Berichten", icon: MessageSquare },
  { section: "profiel", href: "/ledenportaal/profiel", label: "Profiel", icon: UserRound },
] as const;

const exercises = [
  ["Goblet squat", "3 × 8", "Rustige neerwaartse fase"],
  ["Chest-supported row", "3 × 10", "Schouderbladen controleren"],
  ["Romanian deadlift", "3 × 8", "Spanning houden"],
  ["Dumbbell bench press", "3 × 10", "Neutrale pols"],
  ["Farmer carry", "3 × 30 m", "Rechtop blijven"],
];

const portalHoursSummary = openingHourGroups.map((group) => `${group.label} ${group.opens}–${group.closes}`).join(", ");

const demoMessages = [
  { title: "Je trainingsschema staat klaar", sender: "Rik Priester", when: "nieuw", body: "Hoi Sam, je full-bodytraining staat voor je klaar. Bekijk de oefeningen en laat na afloop weten hoe de training ging." },
  { title: "Praktische clubinformatie", sender: "Absolutely Fit", when: "recent", body: `De reguliere openingstijden zijn ${portalHoursSummary}. Feestdagopening vraag je vooraf na.` },
  { title: "Welkom bij Absolutely Fit", sender: "Absolutely Fit", when: "eerder", body: "Welkom bij jouw persoonlijke ledenomgeving. Hier vind je je trainingen, planning, ledenpas en berichten op één plek." },
];

function DigitalPass() {
  return <Dialog><div className="portal-pass-card"><div className="portal-pass-card__top"><Image src="/brand/absolutely-fit-symbol.svg" alt="Absolutely Fit" width={730} height={535} sizes="46px" /><span>Digitale ledenpas</span></div><div className="portal-pass-card__person"><small>Lid</small><strong>Sam de Vries</strong><span><i /> Lidmaatschap actief</span></div><DialogTrigger asChild><button type="button" aria-label="QR-code vergroten"><QrCode aria-hidden="true" /><span>TOEGANG</span></button></DialogTrigger><div className="portal-pass-card__base"><small>AF-0240</small><ShieldCheck aria-hidden="true" /></div></div><DialogContent className="portal-qr-dialog"><DialogHeader><DialogTitle>Digitale ledenpas</DialogTitle><DialogDescription>Toon deze QR-code bij binnenkomst.</DialogDescription></DialogHeader><div><QrCode aria-hidden="true" /><strong>LEDENPAS</strong><span>Sam de Vries</span></div></DialogContent></Dialog>;
}

function Overview() {
  const week = useAmsterdamWeek();
  return <><div className="portal-page-heading"><div><span>Welkom, Sam</span><h1>Jouw overzicht</h1><p>Je club, planning en voortgang op één rustige plek.</p></div><Button asChild className="ao-button ao-button--blue"><Link href="/ledenportaal/training">Start training <ArrowRight aria-hidden="true" /></Link></Button></div><div className="portal-overview-grid"><article className="portal-next"><div><span>Volgende training</span><em>Gepland</em></div><h2>Upper body strength</h2><p>6 oefeningen · ongeveer 60 minuten</p><div className="portal-next__time"><strong>18:00</strong><span><Clock3 />Trainingsvloer</span></div><Link href="/ledenportaal/training">Bekijk training <ArrowRight /></Link></article><DigitalPass /><article className="portal-progress-card"><span>Deze maand</span><strong>08</strong><small>afgeronde trainingen</small><Progress value={68} aria-label="Maanddoel: 68 procent" /><div><span>Doel</span><b>12 trainingen</b></div></article><article className="portal-week-card"><header><span>Jouw week</span><Link href="/ledenportaal/rooster">Planning <ChevronRight /></Link></header><div>{week.days.map((day, index) => <i key={day.short} className={[index === 0 ? "is-done" : "", day.isToday ? "is-today" : ""].filter(Boolean).join(" ") || undefined}>{day.short}{index === 0 && <Check />}</i>)}</div><p>2 van 3 geplande trainingen afgerond</p></article><article className="portal-message-card"><span><MessageSquare />Nieuw bericht</span><h3>Je trainingsschema staat klaar.</h3><p>Bekijk de oefeningen en noteer hoe de training voelde.</p><Link href="/ledenportaal/berichten">Open berichten <ArrowRight /></Link></article><article className="portal-club-card"><span><Newspaper />Clubinfo</span><h3>{openingHourGroups[0].label}: {openingHourGroups[0].opens}–{openingHourGroups[0].closes}.</h3><p>{openingHourGroups.slice(1).map((group) => `${group.label} ${group.opens}–${group.closes}`).join(" · ")}. Feestdagen vooraf navragen.</p><Link href="/openingstijden">Alle openingstijden <ArrowRight /></Link></article></div></>;
}

function Training() {
  const [done, setDone] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  return <><div className="portal-page-heading"><div><span>Jouw trainingsschema</span><h1>Full body A</h1><p>Volg de oefeningen in je eigen tempo en houd je voortgang bij.</p></div><Button type="button" className="ao-button ao-button--blue" onClick={() => setRunning((value) => !value)}>{running ? <>Pauzeren <Pause aria-hidden="true" /></> : <>Start training <Play aria-hidden="true" /></>}</Button></div><p className="schedule-live" role="status" aria-live="polite">{running ? `Training actief · ${done.length} van 5 oefeningen afgerond.` : done.length ? `Training gepauzeerd · ${done.length} van 5 afgerond.` : "Je training staat klaar."}</p><div className="portal-training-layout"><section className="portal-workout"><header><div><small>Huidige training</small><h2>Full body · basis</h2></div><span>5 oefeningen · ± 55 min</span></header><div className="portal-exercises">{exercises.map(([name, set, note], index) => <label key={name} className={done.includes(index) ? "is-done" : ""}><Checkbox checked={done.includes(index)} aria-label={`${name} afronden`} onCheckedChange={() => setDone((items) => items.includes(index) ? items.filter((item) => item !== index) : [...items, index])} /><i>{String(index + 1).padStart(2, "0")}</i><span><strong>{name}</strong><small>{note}</small></span><b>{set}</b><ChevronRight aria-hidden="true" /></label>)}</div><footer><span>{done.length} van 5 afgerond</span><Progress value={(done.length / 5) * 100} aria-label={`${done.length} van 5 oefeningen afgerond`} /></footer></section><aside className="portal-coach-note"><span>Notitie van je coach</span><h3>Werk rustig en technisch.</h3><p>Stop iedere set met voldoende herhalingen over. Noteer na afloop hoe de oefeningen voelden.</p><div><strong>Rik Priester</strong><small>Oprichter & coach</small></div></aside></div></>;
}

function MemberSchedule() {
  const [events, setEvents] = useState<DemoScheduleEvent[]>(() => memberSchedule(demoSchedule));
  const [reservations, setReservations] = useState<Record<string, "reserved" | "waitlist">>({ "ev-04": "reserved" });
  const [filter, setFilter] = useState("all");
  const [weekOffset, setWeekOffset] = useState(0);
  const [notice, setNotice] = useState("Kies een trainingsmoment om een plek te reserveren.");
  const week = useAmsterdamWeek(weekOffset);
  useEffect(() => {
    const load = () => {
      try {
        const snapshot = parseScheduleSnapshot(window.localStorage.getItem(PUBLISHED_STORAGE_KEY), demoSchedule);
        setEvents(memberSchedule(snapshot.events));
        if (!snapshot.valid) setNotice("Het rooster kon niet volledig worden bijgewerkt. Vernieuw de pagina om het opnieuw te proberen.");
      } catch {
        setEvents(memberSchedule(demoSchedule));
        setNotice("Je reserveringen konden niet worden geladen. Probeer het opnieuw.");
      }
    };
    load();
    window.addEventListener("storage", load);
    window.addEventListener(SCHEDULE_PUBLISHED_EVENT, load);
    return () => { window.removeEventListener("storage", load); window.removeEventListener(SCHEDULE_PUBLISHED_EVENT, load); };
  }, []);
  const visible = useMemo(() => events.filter((event) => filter === "all" || event.type === filter || (filter === "powerlifting" && event.type === "weightlifting")), [events, filter]);
  const toggleReservation = (event: DemoScheduleEvent) => {
    const existing = reservations[event.id];
    if (existing) {
      setReservations((items) => {
        const next = { ...items };
        delete next[event.id];
        return next;
      });
      setNotice(existing === "reserved" ? `${event.title}: je reservering is geannuleerd.` : `${event.title}: je hebt de wachtlijst verlaten.`);
      return;
    }
    const next = event.booked >= event.capacity ? "waitlist" : "reserved";
    setReservations((items) => ({ ...items, [event.id]: next }));
    setNotice(next === "reserved" ? `${event.title}: je plek is gereserveerd.` : `${event.title}: je staat op de wachtlijst.`);
  };
  return <><div className="portal-page-heading"><div><span>{week.weekLabel}</span><h1>Plan je training</h1><p>Reserveer een plek of bekijk een begeleid trainingsmoment.</p></div><div className="portal-week-nav"><button type="button" aria-label="Vorige week" onClick={() => setWeekOffset((value) => value - 1)}>←</button><strong>{week.compactRangeLabel}</strong><button type="button" aria-label="Volgende week" onClick={() => setWeekOffset((value) => value + 1)}>→</button></div></div><p className="schedule-live" role="status" aria-live="polite">{weekOffset === 0 ? notice : "Voor deze week zijn nog geen trainingen ingepland."}</p><div className="member-schedule-filters">{[["all", "Alles"], ["strength", "Kracht"], ["powerlifting", "Techniek"], ["guided", "Begeleiding"], ["first-visit", "Gratis intake"]].map(([value, label]) => <button type="button" key={value} className={filter === value ? "is-active" : ""} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div>{weekOffset !== 0 ? <div className="public-schedule__empty"><h2>Geen trainingen in deze week.</h2><button type="button" onClick={() => setWeekOffset(0)}>Terug naar deze week</button></div> : <div className="member-schedule">{week.days.map((day, dayIndex) => { const dayEvents = visible.filter((event) => event.day === dayIndex); if (!dayEvents.length) return null; return <section key={day.short}><header><span>{day.short}</span><strong>{day.date}</strong><small>{day.long}</small></header><div>{dayEvents.map((event) => { const reservation = reservations[event.id]; const spots = Math.max(0, event.capacity - event.booked - (reservation === "reserved" ? 1 : 0)); const label = reservation === "reserved" ? "Annuleren" : reservation === "waitlist" ? "Verlaat wachtlijst" : spots === 0 ? "Wachtlijst" : "Reserveer plek"; return <article key={event.id}><time>{formatDemoTime(event.start)}</time><div><span>{event.type === "first-visit" ? "Gratis intake" : "Begeleid moment"}</span><h3>{event.title}</h3><p>{event.trainer} · {Math.round(event.duration * 60)} min</p></div><small>{reservation ? reservation === "reserved" ? "Gereserveerd" : "Wachtlijst" : spots === 0 ? "Vol · wachtlijst" : spots === 1 ? "Laatste plek" : `${spots} plekken beschikbaar`}</small><Button type="button" variant={reservation ? "outline" : "default"} className={reservation ? "" : "ao-button ao-button--blue"} onClick={() => toggleReservation(event)}>{label}</Button></article>; })}</div></section>; })}{!visible.length && <div className="public-schedule__empty"><h2>Geen momenten binnen dit filter.</h2><button type="button" onClick={() => setFilter("all")}>Toon alles</button></div>}</div>}</>;
}

function Membership() {
  const [notice, setNotice] = useState("");
  return <><div className="portal-page-heading"><div><span>Jouw lidmaatschap</span><h1>Jouw trainingsproduct</h1><p>Bekijk je status, startdatum en beschikbare trainingsproducten.</p></div></div><div className="portal-membership-layout"><DigitalPass /><section><article><span>Status</span><strong><i /> Actief</strong></article><article><span>Gekozen product</span><strong>{memberships[1].name}</strong></article><article><span>Startdatum</span><strong>01 januari 2026</strong></article><div className="portal-product-types"><span>Beschikbare trainingsproducten</span>{memberships.map((membership) => <strong key={membership.id}>{membership.name}</strong>)}</div><Button type="button" variant="outline" onClick={() => setNotice("Je wijzigingsverzoek is ontvangen.")}>Wijziging aanvragen</Button>{notice && <p className="schedule-live" role="status">{notice}</p>}</section></div></>;
}

function downloadInvoice(id: string, date: string) {
  const content = `Absolutely Fit\nFactuurreferentie: ${id}\nDatum: ${date}\nStatus: Voldaan`;
  const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${id.toLowerCase()}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

function Invoices() {
  const invoices = [["AF-2026-0084", "01 aug 2026", "Voldaan"], ["AF-2026-0072", "01 jul 2026", "Voldaan"], ["AF-2026-0060", "01 jun 2026", "Voldaan"]];
  return <><div className="portal-page-heading"><div><span>Administratie</span><h1>Facturen</h1><p>Bekijk en download je recente facturen.</p></div></div><section className="portal-table"><header><span>Factuurnummer</span><span>Datum</span><span>Status</span><span>Document</span></header>{invoices.map(([id, date, status]) => <div key={id}><strong data-label="Factuur">{id}</strong><span data-label="Datum">{date}</span><em data-label="Status"><Check />{status}</em><button type="button" data-label="Document" onClick={() => downloadInvoice(id, date)}><Download />Download factuur</button></div>)}</section></>;
}

function Messages() {
  const [selected, setSelected] = useState(0);
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("Selecteer een gesprek om je berichten te bekijken.");
  const message = demoMessages[selected];
  const submit = (event: FormEvent) => { event.preventDefault(); if (!draft.trim()) return; setNotice("Je bericht is verzonden."); setDraft(""); };
  return <><div className="portal-page-heading"><div><span>Club & coach</span><h1>Berichten</h1><p>Bekijk berichten van je coach en de club.</p></div><Button type="button" className="ao-button ao-button--blue" onClick={() => { setSelected(0); setDraft(""); setNotice("Schrijf hieronder je bericht aan je coach."); }}>Nieuw bericht</Button></div><p className="schedule-live" role="status" aria-live="polite">{notice}</p><div className="portal-messages"><aside>{demoMessages.map((item, index) => <button type="button" className={selected === index ? "is-active" : ""} aria-pressed={selected === index} onClick={() => setSelected(index)} key={item.title}>{index < 2 && <i />}<span><strong>{item.title}</strong><small>{item.sender} · {item.when}</small></span></button>)}</aside><article><span>{message.sender}</span><h2>{message.title}.</h2><p>{message.body}</p><p>Heb je een vraag over je training? Stuur je coach gerust een bericht.</p><form className="portal-reply" onSubmit={submit}><label htmlFor="portal-reply">Jouw antwoord</label><textarea id="portal-reply" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Typ je bericht…" /><Button type="submit" disabled={!draft.trim()}><Send />Versturen</Button></form></article></div></>;
}

type ProfileState = { name: string; email: string; phone: string; notifications: boolean[] };
const initialProfile: ProfileState = { name: "Sam de Vries", email: "sam@example.com", phone: "06 00 00 00 00", notifications: [true, true, true, false] };

function Profile() {
  const [saved, setSaved] = useState(initialProfile);
  const [profile, setProfile] = useState(initialProfile);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const parsed = JSON.parse(window.localStorage.getItem("af-demo-profile-v1") ?? "null") as ProfileState | null;
        if (parsed && typeof parsed.name === "string" && typeof parsed.email === "string" && typeof parsed.phone === "string" && Array.isArray(parsed.notifications) && parsed.notifications.length === 4) {
          setSaved(parsed);
          setProfile(parsed);
        }
      } catch {
        setNotice("Je opgeslagen profiel kon niet worden geladen. Controleer je gegevens en sla ze opnieuw op.");
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const dirty = JSON.stringify(saved) !== JSON.stringify(profile);
  const save = () => {
    if (!profile.name.trim() || !/^\S+@\S+\.\S+$/.test(profile.email)) { setNotice("Vul een naam en een geldig e-mailadres in."); return; }
    try {
      window.localStorage.setItem("af-demo-profile-v1", JSON.stringify(profile));
    } catch {
      setNotice("Je wijzigingen konden niet worden opgeslagen. Probeer het opnieuw.");
      return;
    }
    setSaved(profile);
    setNotice("Je wijzigingen zijn opgeslagen.");
  };
  const reset = () => { setProfile(saved); setNotice("Niet-opgeslagen wijzigingen hersteld."); };
  const labels = ["Herinnering voor een gereserveerde training", "Een nieuw bericht van de club", "Wijziging in het rooster", "Factuur beschikbaar"];
  return <><div className="portal-page-heading"><div><span>Jouw profiel</span><h1>Profiel & voorkeuren</h1><p>Beheer je persoonlijke gegevens en notificatievoorkeuren.</p></div><div><Button type="button" variant="outline" onClick={reset} disabled={!dirty}><RotateCcw />Herstel</Button><Button type="button" className="ao-button ao-button--blue" onClick={save} disabled={!dirty}>Wijzigingen opslaan</Button></div></div>{notice && <p className="schedule-live" role="status" aria-live="polite">{notice}</p>}<div className="portal-profile"><section><h2>Persoonlijke gegevens</h2><label>Naam<input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></label><div><label>E-mailadres<input type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} /></label><label>Telefoon<input value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} /></label></div></section><section><h2>Notificaties</h2>{labels.map((item, index) => <label className="profile-toggle" key={item}><span><strong>{item}</strong><small>{index < 2 ? "Push en e-mail" : "Alleen e-mail"}</small></span><Switch aria-label={item} checked={profile.notifications[index]} onCheckedChange={(checked) => setProfile({ ...profile, notifications: profile.notifications.map((value, itemIndex) => itemIndex === index ? checked : value) })} /></label>)}</section></div></>;
}

export function MemberPortal({ section }: { section: PortalSection }) {
  const pathname = usePathname();
  const content = section === "overview" ? <Overview /> : section === "training" ? <Training /> : section === "rooster" ? <MemberSchedule /> : section === "lidmaatschap" ? <Membership /> : section === "facturen" ? <Invoices /> : section === "berichten" ? <Messages /> : <Profile />;
  return <main className="portal-app"><aside className="portal-sidebar"><Link href="/" className="portal-brand"><Image className="portal-brand__lockup" src="/brand/absolutely-fit-lockup.svg" alt="Absolutely Fit" width={590} height={142} sizes="160px" /><Image className="portal-brand__symbol" src="/brand/absolutely-fit-symbol.svg" alt="" aria-hidden="true" width={730} height={535} sizes="44px" /><span>Mijn Absolutely Fit</span></Link><nav aria-label="Ledenportaal">{nav.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-label={label} aria-current={pathname === href ? "page" : undefined} className={pathname === href ? "is-active" : ""}><Icon /><span>{label}</span>{label === "Berichten" && <i>1</i>}</Link>)}</nav><div><Link href="/contact" aria-label="Hulp en contact"><CircleHelp /><span>Hulp & contact</span></Link></div></aside><section className="portal-surface"><header className="portal-topbar"><div><span className="portal-topbar__brand">ABSOLUTELY ONE</span><span>Sam de Vries</span></div><div><Link className="portal-topbar__notice" href="/ledenportaal/berichten" aria-label="Open berichten"><Bell /><i /></Link><Link className="portal-topbar__profile" href="/ledenportaal/profiel" aria-label="Open profiel"><span>SD</span><small>Sam de Vries</small><Settings /></Link></div></header><div className="portal-content">{content}</div></section><nav className="portal-mobile-nav" aria-label="Mobiele ledennavigatie">{nav.slice(0, 5).map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={pathname === href ? "is-active" : ""}><Icon /><span>{label}</span></Link>)}</nav></main>;
}
