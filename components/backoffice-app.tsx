"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Activity, ArrowRight, Bell, CalendarDays, Check, ChevronRight, CircleHelp, FileEdit, FileText, LayoutDashboard, Mail, MessageSquare, MoreHorizontal, Plus, Search, Settings, SlidersHorizontal, UserCheck, UserRoundPlus, Users } from "lucide-react";
import { BackofficeSchedule } from "@/components/backoffice-schedule";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { articles } from "@/lib/content/articles";
import { useAmsterdamWeek } from "@/lib/content/current-week";
import { openingHourGroups } from "@/lib/content/opening-hours";
import { contact, site } from "@/lib/content/site";
import { demoSchedule, formatDemoTime } from "@/lib/demo-data";

export type BackofficeSection = "dashboard" | "rooster" | "leden" | "trainers" | "kennismakingen" | "communicatie" | "content" | "instellingen";
type Notify = (message: string) => void;

const backofficeNav = [
  { href: "/backoffice", label: "Dashboard", icon: LayoutDashboard },
  { href: "/backoffice/rooster", label: "Rooster", icon: CalendarDays },
  { href: "/backoffice/leden", label: "Leden", icon: Users },
  { href: "/backoffice/trainers", label: "Trainers", icon: UserCheck },
  { href: "/backoffice/kennismakingen", label: "Gratis intakes", icon: UserRoundPlus },
  { href: "/backoffice/communicatie", label: "Communicatie", icon: MessageSquare },
  { href: "/backoffice/content", label: "Website & app", icon: FileEdit },
  { href: "/backoffice/instellingen", label: "Instellingen", icon: Settings },
];

const seedMembers = [
  ["Sam de Vries", "sam@example.com", "Actief", "Recent", "Lid"],
  ["Nora Jansen", "nora@example.com", "Actief", "Recent", "Lid"],
  ["Milan Bakker", "milan@example.com", "Intake", "Deze week", "Aanvraag"],
  ["Fleur de Jong", "fleur@example.com", "Inactief", "Vorige week", "Lid"],
  ["Omar Smit", "omar@example.com", "Actief", "Eerder", "Lid"],
];

function Dashboard({ notify }: { notify: Notify }) {
  const week = useAmsterdamWeek();
  const todayIndex = week.days.findIndex((day) => day.isToday);
  const todayEvents = demoSchedule.filter((event) => event.day === (todayIndex < 0 ? 0 : todayIndex));
  const appointmentLabel = `${todayEvents.length} afspraak${todayEvents.length === 1 ? "" : "en"}`;
  return <><div className="admin-heading"><div><span>{week.isReady ? `${week.weekLabel} · ${week.monthYearLabel}` : "Weekoverzicht · deze week"}</span><h1>Cluboverzicht.</h1><p>Beheer de planning, intakeaanvragen en ledencommunicatie.</p></div><div><Button asChild variant="outline"><Link href="/backoffice/rooster"><Plus />Nieuwe afspraak</Link></Button><Button asChild className="ao-button ao-button--blue"><Link href="/backoffice/rooster"><CalendarDays />Rooster bewerken</Link></Button></div></div><div className="admin-action-grid"><Link href="/backoffice/kennismakingen"><span><UserRoundPlus />Opvolgen</span><strong>3</strong><h2>Gratis intakeaanvragen</h2><p>Aanvragen die nog een persoonlijk antwoord nodig hebben.</p><ArrowRight /></Link><Link href="/backoffice/rooster"><span><CalendarDays />Planning</span><strong>0</strong><h2>Roosterwijzigingen</h2><p>Er zijn geen openstaande roosterwijzigingen.</p><ArrowRight /></Link><Link href="/backoffice/communicatie"><span><MessageSquare />Concept</span><strong>2</strong><h2>Berichten klaarzetten</h2><p>Clubnieuws en een roosterupdate wachten op controle.</p><ArrowRight /></Link></div><div className="admin-dashboard-grid"><section className="admin-today"><header><div><span>Vandaag op het rooster</span><strong>{appointmentLabel}</strong></div><Link href="/backoffice/rooster">Volledig rooster <ArrowRight /></Link></header>{todayEvents.map((event) => { const time = formatDemoTime(event.start); const coach = event.trainer.replace(/^Demo-coach /, "Coach "); return <article key={event.id}><time>{time}</time><i /><div><strong>{event.title}</strong><small>{coach}</small></div><span><Users />{event.booked} / {event.capacity}</span><button type="button" aria-label={`Selecteer ${event.title} om ${time}`} onClick={() => notify(`${event.title} om ${time} geselecteerd.`)}><MoreHorizontal /></button></article>; })}{!todayEvents.length && <p>Vandaag staan er geen afspraken in het rooster.</p>}</section><aside className="admin-inbox"><header><span>Recente vragen</span><button type="button" onClick={() => notify("Alle recente vragen worden getoond.")}>Alles bekijken</button></header>{[["SD", "Sam de Vries", "Vraag over trainingsschema", "14 min"], ["NJ", "Nora Jansen", "Gratis intake verplaatsen", "42 min"], ["MB", "Milan Bakker", "Ooievaarspas mogelijkheden", "2 uur"]].map(([initials, name, subject, time]) => <button type="button" key={name} onClick={() => notify(`${subject} van ${name} geselecteerd.`)}><i>{initials}</i><span><strong>{name}</strong><small>{subject}</small></span><time>{time}</time></button>)}<Button asChild variant="outline"><Link href="/backoffice/communicatie"><Mail />Open berichten</Link></Button></aside></div></>;
}

function Members({ notify }: { notify: Notify }) {
  const [members, setMembers] = useState(seedMembers);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Alles");
  const visible = useMemo(() => members.filter(([name, email, memberStatus]) => (status === "Alles" || memberStatus === status) && `${name} ${email}`.toLowerCase().includes(query.toLowerCase())), [members, query, status]);
  const add = () => { const number = members.length + 1; setMembers((items) => [...items, [`Nieuw lid ${number}`, `lid${number}@example.com`, "Intake", "Zojuist", "Aanvraag"]]); notify("Nieuw lid toegevoegd."); };
  const cycleFilter = () => setStatus((value) => value === "Alles" ? "Actief" : value === "Actief" ? "Intake" : value === "Intake" ? "Inactief" : "Alles");
  return <><div className="admin-heading"><div><span>Ledenbeheer</span><h1>Leden</h1><p>Zoek, filter en beheer ledenprofielen.</p></div><Button type="button" className="ao-button ao-button--blue" onClick={add}><UserRoundPlus />Nieuw lid</Button></div><div className="admin-list-toolbar"><label><Search /><Input aria-label="Zoek leden" placeholder="Zoek op naam of e-mail" value={query} onChange={(event) => setQuery(event.target.value)} /></label><Button type="button" variant="outline" onClick={cycleFilter}><SlidersHorizontal />Filter: {status}</Button><span>{visible.length} resultaten</span></div><section className="admin-data-table"><header><span>Lid</span><span>Status</span><span>Laatste activiteit</span><span>Type</span><span /></header>{visible.map(([name, email, memberStatus, activity, type]) => <article key={email}><div><i>{name.split(" ").map((item) => item[0]).join("")}</i><span><strong>{name}</strong><small>{email}</small></span></div><em className={`status-${memberStatus.toLowerCase()}`}>{memberStatus}</em><span data-label="Laatste activiteit">{activity}</span><small data-label="Type">{type}</small><button type="button" aria-label={`Selecteer profiel van ${name}`} onClick={() => notify(`Profiel van ${name} geselecteerd.`)}><MoreHorizontal /></button></article>)}{!visible.length && <div className="admin-empty-state"><Users aria-hidden="true" /><strong>Geen leden gevonden</strong><p>Pas de zoekterm of het actieve filter aan.</p><button type="button" onClick={() => { setQuery(""); setStatus("Alles"); }}>Wis zoeken en filters</button></div>}</section></>;
}

function Trainers({ notify }: { notify: Notify }) {
  const [onlyDemo, setOnlyDemo] = useState(false);
  const trainers = [["RP", "Rik Priester", "Gewichtheffen · Powerlifting · S&C", "6 afspraken"], ["DN", "Demo-coach Noor", "Gratis intake · Fitnessbegeleiding", "3 afspraken"], ["DD", "Demo-coach Daniël", "Krachttraining · Techniek", "2 afspraken"]];
  return <><div className="admin-heading"><div><span>Teamplanning</span><h1>Trainers</h1><p>Expertise, beschikbaarheid en roosterbelasting in één overzicht.</p></div><Button type="button" variant="outline" onClick={() => setOnlyDemo((value) => !value)}><SlidersHorizontal />{onlyDemo ? "Toon iedereen" : "Toon overige coaches"}</Button></div><div className="admin-trainer-grid">{trainers.filter((_, index) => !onlyDemo || index > 0).map(([initials, name, skills, load]) => { const displayName = name.replace("Demo-coach ", "Coach "); return <article key={name}><div><i>{initials}</i><span><strong>{displayName}</strong><small>{name.startsWith("Demo") ? "Coach" : "Oprichter & coach"}</small></span><em>Teamprofiel</em></div><p>{skills}</p><section><span>Deze week</span><strong>{load}</strong></section><footer><button type="button" onClick={() => notify(`Beschikbaarheid van ${displayName} getoond.`)}>Beschikbaarheid</button><Link href="/backoffice/rooster">Bekijk rooster <ArrowRight /></Link></footer></article>; })}</div></>;
}

type Visit = { name: string; goal: string; meta: string };
function Visits({ notify }: { notify: Notify }) {
  const [columns, setColumns] = useState<Array<{ title: string; cards: Visit[] }>>([
    { title: "Nieuw", cards: [{ name: "Sam de Vries", goal: "Sterker worden", meta: "Avond · persoonlijk startplan" }, { name: "Nora Jansen", goal: "Fitter worden", meta: "Ochtend · eerst wegwijs" }, { name: "Milan Bakker", goal: "Beter presteren", meta: "Wisselend · coaching" }] },
    { title: "Contact opgenomen", cards: [{ name: "Fleur de Jong", goal: "Afvallen", meta: "Overdag · startplan" }, { name: "Omar Smit", goal: "Spiermassa", meta: "Avond · coaching" }] },
    { title: "Bezoek gepland", cards: [{ name: "Alex", goal: "Sterker worden", meta: "Eerstvolgende dinsdag · 09:30" }, { name: "Bo", goal: "Weer beginnen", meta: "Eerstvolgende zaterdag · 10:00" }] },
  ]);
  const move = (columnIndex: number, cardIndex: number) => {
    if (columnIndex >= columns.length - 1) { notify("Deze aanvraag staat al in de laatste stap."); return; }
    setColumns((items) => { const next = items.map((column) => ({ ...column, cards: [...column.cards] })); const [card] = next[columnIndex].cards.splice(cardIndex, 1); next[columnIndex + 1].cards.push(card); return next; });
    notify("Aanvraag naar de volgende stap verplaatst.");
  };
  return <><div className="admin-heading"><div><span>Intakewizard & opvolging</span><h1>Gratis intakes</h1><p>Van nieuwe aanvraag tot persoonlijk bevestigd intakemoment.</p></div><Button type="button" className="ao-button ao-button--blue" onClick={() => { setColumns((items) => items.map((column, index) => index ? column : { ...column, cards: [...column.cards, { name: "Nieuwe aanvraag", goal: "Nog te kiezen", meta: "Vandaag · opvolging nodig" }] })); notify("Nieuwe intakeaanvraag toegevoegd."); }}><Plus />Aanvraag toevoegen</Button></div><div className="admin-kanban">{columns.map((column, columnIndex) => <section key={column.title}><header><span>{column.title}</span><strong>{column.cards.length}</strong></header>{column.cards.map((card, cardIndex) => <article key={`${card.name}-${cardIndex}`}><span>Intakeaanvraag</span><h3>{card.name}</h3><strong>{card.goal}</strong><p>{card.meta}</p><footer><button type="button" onClick={() => notify(`${card.name} geselecteerd.`)}>Selecteer</button><button type="button" aria-label={`Verplaats ${card.name} naar de volgende kolom`} onClick={() => move(columnIndex, cardIndex)} disabled={columnIndex === columns.length - 1}><ArrowRight /></button></footer></article>)}{!column.cards.length && <div className="admin-kanban__empty"><UserRoundPlus aria-hidden="true" /><span>Geen aanvragen in deze stap</span></div>}</section>)}</div></>;
}

function Communication({ notify }: { notify: Notify }) {
  const week = useAmsterdamWeek();
  const [selected, setSelected] = useState(0);
  const [copy, setCopy] = useState(["Nieuwe begeleide momenten deze week", "Controleer de actuele openingstijden"]);
  const defaultTitleRef = useRef("Nieuwe begeleide momenten deze week");
  useEffect(() => {
    if (!week.isoWeek) return;
    const title = `Nieuwe begeleide momenten in week ${week.isoWeek}`;
    setCopy((items) => items[0] === defaultTitleRef.current ? [title, ...items.slice(1)] : items);
    defaultTitleRef.current = title;
  }, [week.isoWeek]);
  const addConcept = () => { setCopy((items) => [...items, "Nieuw berichtconcept"]); setSelected(copy.length); notify("Nieuw berichtconcept toegevoegd."); };
  return <><div className="admin-heading"><div><span>Clubcommunicatie</span><h1>Communicatie</h1><p>Bereid berichten, notificaties en clubnieuws voor.</p></div><Button type="button" className="ao-button ao-button--blue" onClick={addConcept}><Plus />Nieuw concept</Button></div><div className="admin-communication"><section><header><span>Conceptberichten</span><strong>{copy.length}</strong></header>{copy.map((title, index) => <article key={index} className={selected === index ? "is-selected" : ""}><i>{index ? <Bell /> : <CalendarDays />}</i><div><span>{index ? "Clubnieuws" : "Roosterupdate"}</span><h3>{title}</h3><p>Doelgroep: actieve leden</p></div><em>Concept</em><button type="button" aria-label={`Bewerk ${title}`} aria-pressed={selected === index} onClick={() => setSelected(index)}><ChevronRight /></button></article>)}<div className="admin-communication__composer"><label>Geselecteerd berichtconcept<Input value={copy[selected]} onChange={(event) => setCopy((items) => items.map((item, index) => index === selected ? event.target.value : item))} /></label><Button type="button" variant="outline" onClick={() => notify("Berichtconcept opgeslagen.")}>Concept opslaan</Button></div></section><aside><span>Notificatievoorbeeld</span><div><Image src="/brand/absolutely-fit-symbol.svg" alt="Absolutely Fit" width={730} height={535} sizes="48px" /><strong>Absolutely Fit</strong><small>nu</small></div><h3>{copy[selected]}</h3><p>Bericht voor actieve leden.</p><button type="button" onClick={() => notify("Bericht staat klaar voor controle.")}>Controleren</button><small>Klaar voor controle</small></aside></div></>;
}

function Content({ notify }: { notify: Notify }) {
  const initial = [["Clubinformatie", "Openingstijden, contact en route", "Gepubliceerd"], ["Kennisbank", "Training, herstel en clubnieuws", `${articles.length} artikelen`], ["Ledenapp", "Welkomstbericht en clubfeed", "Concept"], ["Vindbaarheid", "Scheveningen en Den Haag", "Actief"]];
  const [items, setItems] = useState(initial);
  const [selected, setSelected] = useState(0);
  return <><div className="admin-heading"><div><span>Website & ledenapp</span><h1>Content</h1><p>Beheer de inhoud van de website en ledenapp.</p></div><Button type="button" className="ao-button ao-button--blue" onClick={() => { setItems((value) => [...value, ["Nieuw artikel", "Voeg een korte beschrijving toe", "Concept"]]); setSelected(items.length); notify("Nieuw artikel toegevoegd."); }}><Plus />Nieuw artikel</Button></div><div className="admin-content-grid">{items.map(([title, text, status], index) => <article key={`${title}-${index}`} className={selected === index ? "is-selected" : ""}><span>{String(index + 1).padStart(2, "0")}</span><FileText /><h2>{title}</h2><p>{text}</p><small>{status}</small><button type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>Bewerken <ArrowRight /></button></article>)}</div><section className="admin-local-editor"><h2>Content bewerken</h2><label>Titel<Input value={items[selected]?.[0] ?? ""} onChange={(event) => setItems((value) => value.map((item, index) => index === selected ? [event.target.value, item[1], item[2]] : item))} /></label><label>Beschrijving<Input value={items[selected]?.[1] ?? ""} onChange={(event) => setItems((value) => value.map((item, index) => index === selected ? [item[0], event.target.value, item[2]] : item))} /></label><Button type="button" variant="outline" onClick={() => notify("Contentconcept opgeslagen.")}>Concept opslaan</Button></section></>;
}

function SettingsPage({ notify }: { notify: Notify }) {
  const [form, setForm] = useState<{ name: string; address: string; phone: string; email: string }>({ name: site.name, address: contact.location, phone: contact.phoneDisplay, email: contact.email });
  return <><div className="admin-heading"><div><span>Organisatiebeheer</span><h1>Instellingen</h1><p>Beheer de centrale clubgegevens en openingstijden.</p></div><Button type="button" className="ao-button ao-button--blue" onClick={() => notify("Instellingen opgeslagen.")}><Check />Wijzigingen opslaan</Button></div><div className="admin-settings"><section><h2>Clubgegevens</h2><label>Clubnaam<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label>Adres<input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} /></label><div><label>Telefoon<input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label><label>E-mail<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label></div></section><section><h2>Openingstijden</h2>{openingHourGroups.map((group) => <article key={group.label}><CalendarDays aria-hidden="true" /><span><strong>{group.label}</strong><small>{group.opens}–{group.closes}</small></span></article>)}</section></div></>;
}

export function BackofficeApp({ section }: { section: BackofficeSection }) {
  const pathname = usePathname();
  const [notice, setNotice] = useState("");
  const currentSection = backofficeNav.find(({ href }) => href === pathname)?.label ?? "Dashboard";
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const mobileNav = window.matchMedia("(max-width: 700px)");
    const centerActiveLink = () => {
      const nav = navRef.current;
      if (!nav || !pathname.startsWith("/backoffice") || !mobileNav.matches) return;
      window.requestAnimationFrame(() => {
        const activeLink = nav.querySelector<HTMLElement>("[aria-current='page']");
        if (!activeLink) return;
        nav.scrollLeft = Math.max(0, activeLink.offsetLeft - (nav.clientWidth - activeLink.clientWidth) / 2);
      });
    };
    centerActiveLink();
    mobileNav.addEventListener("change", centerActiveLink);
    return () => mobileNav.removeEventListener("change", centerActiveLink);
  }, [pathname]);
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 5200);
    return () => window.clearTimeout(timeout);
  }, [notice]);
  const content = section === "dashboard" ? <Dashboard notify={setNotice} /> : section === "rooster" ? <BackofficeSchedule /> : section === "leden" ? <Members notify={setNotice} /> : section === "trainers" ? <Trainers notify={setNotice} /> : section === "kennismakingen" ? <Visits notify={setNotice} /> : section === "communicatie" ? <Communication notify={setNotice} /> : section === "content" ? <Content notify={setNotice} /> : <SettingsPage notify={setNotice} />;
  return <main className="admin-app"><aside className="admin-sidebar"><Link href="/" className="admin-brand"><Image src="/brand/absolutely-fit-lockup.svg" alt="Absolutely Fit" width={590} height={142} sizes="160px" /><span><strong>Absolutely One</strong><small>Clubbeheer</small></span></Link><nav ref={navRef} aria-label="Backoffice">{backofficeNav.map(({ href, label, icon: Icon }) => <Link href={href} key={href} title={label} aria-label={label === "Gratis intakes" ? `${label}, 3 open` : label} aria-current={pathname === href ? "page" : undefined} className={pathname === href ? "is-active" : ""}><Icon /><span>{label}</span>{label === "Gratis intakes" && <i aria-hidden="true">3</i>}</Link>)}</nav><div><Link href="/contact" aria-label="Hulp en contact" title="Hulp en contact"><CircleHelp /><span>Hulp & contact</span></Link></div></aside><section className="admin-surface"><header className="admin-topbar"><div className="admin-topbar__context"><Activity /><span>Clubbeheer</span><i /><strong>{currentSection}</strong></div><div className="admin-topbar__actions"><button type="button" aria-label="Zoeken" onClick={() => setNotice("Gebruik de zoekfunctie binnen het actieve overzicht.")}><Search /></button><button type="button" aria-label="Meldingen tonen" onClick={() => setNotice("Er zijn twee nieuwe meldingen.")}><Bell /><i /></button><button type="button" aria-label="Profiel van Rik Priester" onClick={() => setNotice("Profiel van Rik Priester geselecteerd.")}><span>RP</span><small>Rik Priester</small><ChevronRight /></button></div></header>{section !== "rooster" && notice && <p className="schedule-live admin-global-notice" role="status" aria-live="polite">{notice}</p>}<div className={section === "rooster" ? "admin-content admin-content--schedule" : "admin-content"}>{content}</div></section></main>;
}
