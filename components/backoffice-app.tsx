"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Activity, ArrowRight, Bell, CalendarDays, Check, ChevronRight, CircleHelp, FileEdit, FileText, LayoutDashboard, LogOut, Mail, MessageSquare, MoreHorizontal, Plus, Search, Settings, ShieldCheck, SlidersHorizontal, UserCheck, UserRoundPlus, Users } from "lucide-react";
import { BackofficeSchedule } from "@/components/backoffice-schedule";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type BackofficeSection = "dashboard" | "rooster" | "leden" | "trainers" | "kennismakingen" | "communicatie" | "content" | "instellingen";
type Notify = (message: string) => void;

const backofficeNav = [
  { href: "/backoffice", label: "Dashboard", icon: LayoutDashboard },
  { href: "/backoffice/rooster", label: "Rooster", icon: CalendarDays },
  { href: "/backoffice/leden", label: "Leden", icon: Users },
  { href: "/backoffice/trainers", label: "Trainers", icon: UserCheck },
  { href: "/backoffice/kennismakingen", label: "Kennismakingen", icon: UserRoundPlus },
  { href: "/backoffice/communicatie", label: "Communicatie", icon: MessageSquare },
  { href: "/backoffice/content", label: "Website & app", icon: FileEdit },
  { href: "/backoffice/instellingen", label: "Instellingen", icon: Settings },
];

const seedMembers = [
  ["Sam de Vries", "sam@example.com", "Actief", "Vandaag", "Demo-lid"],
  ["Nora Jansen", "nora@example.com", "Actief", "Gisteren", "Demo-lid"],
  ["Milan Bakker", "milan@example.com", "Intake", "26 aug", "Demo-lid"],
  ["Fleur de Jong", "fleur@example.com", "Pauze", "21 aug", "Demo-lid"],
  ["Omar Smit", "omar@example.com", "Actief", "18 aug", "Demo-lid"],
];

function AdminDemoBanner() { return <div className="admin-demo-banner"><ShieldCheck aria-hidden="true" /><strong>Demomodus</strong><span>Leden, tijden, capaciteit, statussen en communicatie zijn fictief. Er worden geen echte berichten of betalingen verwerkt.</span></div>; }

function Dashboard({ notify }: { notify: Notify }) {
  return <><div className="admin-heading"><div><span>Gedateerde demoweek · augustus 2026</span><h1>Cluboverzicht.</h1><p>Dit staat klaar in de lokale demo-omgeving.</p></div><div><Button type="button" variant="outline" onClick={() => notify("Nieuwe demo-afspraak gesimuleerd; er is niets opgeslagen of verzonden.")}><Plus />Simuleer afspraak</Button><Button asChild className="ao-button ao-button--blue"><Link href="/backoffice/rooster"><CalendarDays />Rooster bewerken</Link></Button></div></div><div className="admin-action-grid"><Link href="/backoffice/kennismakingen"><span><UserRoundPlus />Opvolgen</span><strong>3</strong><h2>Kennismakingsaanvragen</h2><p>Demo-aanvragen die nog een persoonlijk antwoord nodig hebben.</p><ArrowRight /></Link><Link href="/backoffice/rooster"><span><CalendarDays />Lokaal</span><strong>0</strong><h2>Roosterwijzigingen</h2><p>Het wijzigingenaantal start bewust op nul.</p><ArrowRight /></Link><Link href="/backoffice/communicatie"><span><MessageSquare />Concept</span><strong>2</strong><h2>Berichten klaarzetten</h2><p>Clubnieuws en een roosterupdate wachten op controle.</p><ArrowRight /></Link></div><div className="admin-dashboard-grid"><section className="admin-today"><header><div><span>Vandaag op het demorooster</span><strong>5 fictieve afspraken</strong></div><Link href="/backoffice/rooster">Volledig rooster <ArrowRight /></Link></header>{[["08:00", "Personal training", "Rik Priester", "1 / 1"], ["09:30", "Mijn eerste bezoek", "Demo-coach Noor", "2 / 4"], ["13:00", "Persoonlijke intake", "Rik Priester", "1 / 1"], ["18:30", "Strength & Conditioning", "Rik Priester", "8 / 10"], ["19:45", "Techniek krachttraining", "Demo-coach Daniël", "9 / 12"]].map(([time, title, coach, capacity]) => <article key={time}><time>{time}</time><i /><div><strong>{title}</strong><small>{coach}</small></div><span><Users />{capacity}</span><button type="button" aria-label={`Selecteer ${title} om ${time} in de demo`} onClick={() => notify(`${title} om ${time} geselecteerd in de lokale demo.`)}><MoreHorizontal /></button></article>)}</section><aside className="admin-inbox"><header><span>Recente demovragen</span><button type="button" onClick={() => notify("Alle drie fictieve demovragen worden al getoond.")}>Alles bekijken</button></header>{[["SD", "Sam de Vries", "Vraag over voorbeeldschema", "14 min"], ["NJ", "Nora Jansen", "Kennismaking verplaatsen", "42 min"], ["MB", "Milan Bakker", "Ooievaarspas mogelijkheden", "2 uur"]].map(([initials, name, subject, time]) => <button type="button" key={name} onClick={() => notify(`${subject} van ${name} lokaal geselecteerd.`)}><i>{initials}</i><span><strong>{name}</strong><small>{subject}</small></span><time>{time}</time></button>)}<Button asChild variant="outline"><Link href="/backoffice/communicatie"><Mail />Open demopostvak</Link></Button></aside></div></>;
}

function Members({ notify }: { notify: Notify }) {
  const [members, setMembers] = useState(seedMembers);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Alles");
  const visible = useMemo(() => members.filter(([name, email, memberStatus]) => (status === "Alles" || memberStatus === status) && `${name} ${email}`.toLowerCase().includes(query.toLowerCase())), [members, query, status]);
  const add = () => { const number = members.length + 1; setMembers((items) => [...items, [`Demo-lid ${number}`, `demo${number}@example.com`, "Intake", "Zojuist", "Lokaal"]]); notify("Een fictief lid is alleen lokaal aan de lijst toegevoegd."); };
  const cycleFilter = () => setStatus((value) => value === "Alles" ? "Actief" : value === "Actief" ? "Intake" : value === "Intake" ? "Pauze" : "Alles");
  return <><div className="admin-heading"><div><span>Ledenbeheer · demo</span><h1>Leden</h1><p>Zoek, filter en selecteer een fictief demoprofiel.</p></div><Button type="button" className="ao-button ao-button--blue" onClick={add}><UserRoundPlus />Nieuw demo-lid</Button></div><div className="admin-list-toolbar"><label><Search /><Input aria-label="Zoek demoleden" placeholder="Zoek op naam of e-mail" value={query} onChange={(event) => setQuery(event.target.value)} /></label><Button type="button" variant="outline" onClick={cycleFilter}><SlidersHorizontal />Filter: {status}</Button><span>{visible.length} demoresultaten</span></div><section className="admin-data-table"><header><span>Lid</span><span>Status</span><span>Laatste activiteit</span><span>Type</span><span /></header>{visible.map(([name, email, memberStatus, activity, type]) => <article key={email}><div><i>{name.split(" ").map((item) => item[0]).join("")}</i><span><strong>{name}</strong><small>{email}</small></span></div><em className={`status-${memberStatus.toLowerCase()}`}>{memberStatus}</em><span data-label="Laatste activiteit">{activity}</span><small data-label="Type">{type}</small><button type="button" aria-label={`Selecteer demoprofiel van ${name}`} onClick={() => notify(`Demoprofiel van ${name} lokaal geselecteerd.`)}><MoreHorizontal /></button></article>)}{!visible.length && <div className="admin-empty-state"><Users aria-hidden="true" /><strong>Geen demoleden gevonden</strong><p>Pas de zoekterm of het actieve filter aan.</p><button type="button" onClick={() => { setQuery(""); setStatus("Alles"); }}>Wis zoeken en filters</button></div>}</section><p className="admin-footnote">Alle getoonde namen en contactgegevens zijn fictief.</p></>;
}

function Trainers({ notify }: { notify: Notify }) {
  const [onlyDemo, setOnlyDemo] = useState(false);
  const trainers = [["RP", "Rik Priester", "Gewichtheffen · Powerlifting · S&C", "6 afspraken"], ["DN", "Demo-coach Noor", "Kennismaking · Fitnessbegeleiding", "3 afspraken"], ["DD", "Demo-coach Daniël", "Krachttraining · Techniek", "2 afspraken"]];
  return <><div className="admin-heading"><div><span>Teamplanning · demo</span><h1>Trainers</h1><p>Expertise, beschikbaarheid en roosterbelasting in één overzicht.</p></div><div><Button type="button" variant="outline" onClick={() => setOnlyDemo((value) => !value)}><SlidersHorizontal />{onlyDemo ? "Toon iedereen" : "Alleen democoaches"}</Button><Button type="button" className="ao-button ao-button--blue" onClick={() => notify("Nieuwe fictieve traineractie gesimuleerd; niets opgeslagen.")}><Plus />Simuleer trainer</Button></div></div><div className="admin-trainer-grid">{trainers.filter((_, index) => !onlyDemo || index > 0).map(([initials, name, skills, load]) => <article key={name}><div><i>{initials}</i><span><strong>{name}</strong><small>{name.startsWith("Demo") ? "Fictief demo-profiel" : "Naam en rol nog te bevestigen"}</small></span><em>{name.startsWith("Demo") ? "Demo" : "Concept"}</em></div><p>{skills}</p><section><span>Deze demoweek</span><strong>{load}</strong></section><footer><button type="button" onClick={() => notify(`Beschikbaarheid van ${name} als lokale demostatus getoond.`)}>Toon demostatus</button><Link href="/backoffice/rooster">Bekijk rooster <ArrowRight /></Link></footer></article>)}</div></>;
}

type Visit = { name: string; goal: string; meta: string };
function Visits({ notify }: { notify: Notify }) {
  const [columns, setColumns] = useState<Array<{ title: string; cards: Visit[] }>>([
    { title: "Nieuw", cards: [{ name: "Sam de Vries", goal: "Sterker worden", meta: "Avond · persoonlijk startplan" }, { name: "Nora Jansen", goal: "Fitter worden", meta: "Ochtend · eerst wegwijs" }, { name: "Milan Bakker", goal: "Beter presteren", meta: "Wisselend · coaching" }] },
    { title: "Contact opgenomen", cards: [{ name: "Fleur de Jong", goal: "Afvallen", meta: "Overdag · startplan" }, { name: "Omar Smit", goal: "Spiermassa", meta: "Avond · coaching" }] },
    { title: "Bezoek gepland", cards: [{ name: "Demo-lid Alex", goal: "Sterker worden", meta: "Di 1 sep · 09:30" }, { name: "Demo-lid Bo", goal: "Weer beginnen", meta: "Za 5 sep · 10:00" }] },
  ]);
  const move = (columnIndex: number, cardIndex: number) => {
    if (columnIndex >= columns.length - 1) { notify("Deze demo-aanvraag staat al in de laatste kolom."); return; }
    setColumns((items) => { const next = items.map((column) => ({ ...column, cards: [...column.cards] })); const [card] = next[columnIndex].cards.splice(cardIndex, 1); next[columnIndex + 1].cards.push(card); return next; });
    notify("Demo-aanvraag één kolom vooruit verplaatst; niets extern gewijzigd.");
  };
  return <><div className="admin-heading"><div><span>Wizard & opvolging · demo</span><h1>Kennismakingen</h1><p>Van nieuwe aanvraag tot persoonlijk bevestigd bezoek.</p></div><Button type="button" className="ao-button ao-button--blue" onClick={() => { setColumns((items) => items.map((column, index) => index ? column : { ...column, cards: [...column.cards, { name: "Nieuwe demo-aanvraag", goal: "Nog te kiezen", meta: "Alleen lokaal" }] })); notify("Nieuwe fictieve aanvraag lokaal toegevoegd."); }}><Plus />Aanvraag toevoegen</Button></div><div className="admin-kanban">{columns.map((column, columnIndex) => <section key={column.title}><header><span>{column.title}</span><strong>{column.cards.length}</strong></header>{column.cards.map((card, cardIndex) => <article key={`${card.name}-${cardIndex}`}><span>Demo-aanvraag</span><h3>{card.name}</h3><strong>{card.goal}</strong><p>{card.meta}</p><footer><button type="button" onClick={() => notify(`${card.name} lokaal geselecteerd.`)}>Selecteer</button><button type="button" aria-label={`Verplaats ${card.name} naar de volgende kolom`} onClick={() => move(columnIndex, cardIndex)} disabled={columnIndex === columns.length - 1}><ArrowRight /></button></footer></article>)}{!column.cards.length && <div className="admin-kanban__empty"><UserRoundPlus aria-hidden="true" /><span>Geen aanvragen in deze stap</span></div>}</section>)}</div></>;
}

function Communication({ notify }: { notify: Notify }) {
  const [selected, setSelected] = useState(0);
  const [copy, setCopy] = useState(["Nieuwe begeleide momenten in week 36", "Controleer de actuele openingstijden"]);
  const addConcept = () => { setCopy((items) => [...items, "Nieuw lokaal berichtconcept"]); setSelected(copy.length); notify("Nieuw lokaal berichtconcept toegevoegd; niets verzonden."); };
  return <><div className="admin-heading"><div><span>Clubcommunicatie · demo</span><h1>Communicatie</h1><p>Berichten, notificaties en clubnieuws lokaal voorbereiden.</p></div><Button type="button" className="ao-button ao-button--blue" onClick={addConcept}><Plus />Nieuw lokaal concept</Button></div><div className="admin-communication"><section><header><span>Conceptberichten</span><strong>{copy.length}</strong></header>{copy.map((title, index) => <article key={index} className={selected === index ? "is-selected" : ""}><i>{index ? <Bell /> : <CalendarDays />}</i><div><span>{index ? "Clubnieuws" : "Roosterupdate"}</span><h3>{title}</h3><p>Doelgroep: fictieve demoleden</p></div><em>Concept</em><button type="button" aria-label={`Bewerk ${title}`} aria-pressed={selected === index} onClick={() => setSelected(index)}><ChevronRight /></button></article>)}<div className="admin-communication__composer"><label>Geselecteerd lokaal concept<Input value={copy[selected]} onChange={(event) => setCopy((items) => items.map((item, index) => index === selected ? event.target.value : item))} /></label><Button type="button" variant="outline" onClick={() => notify("Demo — concept lokaal gepland; er is niets verzonden.")}>Lokaal plannen</Button></div></section><aside><span>Notificatievoorbeeld</span><div><Image src="/brand/absolutely-fit-symbol.svg" alt="Absolutely Fit" width={730} height={535} sizes="48px" /><strong>Absolutely Fit</strong><small>nu</small></div><h3>{copy[selected]}</h3><p>Voorbeeld voor fictieve demoleden.</p><button type="button" onClick={() => notify("Lokale planningsstatus getoond; niets verzonden.")}>Toon planningsstatus</button><small>Er wordt in dit prototype niets verzonden.</small></aside></div></>;
}

function Content({ notify }: { notify: Notify }) {
  const initial = [["Clubinformatie", "Openingstijden, contact en route", "Conceptcontrole nodig"], ["Kennisbank", "Training, herstel en clubnieuws", "3 demoartikelen"], ["Ledenapp", "Welkomstbericht en clubfeed", "Concept in ontwikkeling"], ["Lokale SEO", "Scheveningen en Den Haag", "Alleen bevestigde feiten"]];
  const [items, setItems] = useState(initial);
  const [selected, setSelected] = useState(0);
  return <><div className="admin-heading"><div><span>Website & ledenapp · demo</span><h1>Content</h1><p>Bewerk een lokale preview zonder de live site te wijzigen.</p></div><Button type="button" className="ao-button ao-button--blue" onClick={() => { setItems((value) => [...value, ["Nieuw demoartikel", "Lokale concepttekst", "Niet gepubliceerd"]]); setSelected(items.length); notify("Nieuw lokaal contentconcept toegevoegd."); }}><Plus />Nieuw demoartikel</Button></div><div className="admin-content-grid">{items.map(([title, text, status], index) => <article key={`${title}-${index}`} className={selected === index ? "is-selected" : ""}><span>{String(index + 1).padStart(2, "0")}</span><FileText /><h2>{title}</h2><p>{text}</p><small>{status} · demo</small><button type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>Bewerken <ArrowRight /></button></article>)}</div><section className="admin-local-editor"><h2>Lokale preview</h2><label>Titel<Input value={items[selected]?.[0] ?? ""} onChange={(event) => setItems((value) => value.map((item, index) => index === selected ? [event.target.value, item[1], item[2]] : item))} /></label><label>Beschrijving<Input value={items[selected]?.[1] ?? ""} onChange={(event) => setItems((value) => value.map((item, index) => index === selected ? [item[0], event.target.value, item[2]] : item))} /></label><Button type="button" variant="outline" onClick={() => notify("Contentpreview alleen lokaal opgeslagen; de live website is niet gewijzigd.")}>Preview lokaal opslaan</Button></section></>;
}

function SettingsPage({ notify }: { notify: Notify }) {
  const [form, setForm] = useState({ name: "Absolutely Fit", address: "Doctor Lelykade 240, 2583 CP Den Haag", phone: "06 12 59 51 12", email: "info@absolutely-fit.nl" });
  return <><div className="admin-heading"><div><span>Organisatie · demo</span><h1>Instellingen</h1><p>Fictieve lokale invoer en toekomstige koppelingen.</p></div><Button type="button" className="ao-button ao-button--blue" onClick={() => notify("Demo — instellingen alleen lokaal gesimuleerd; niets is live gewijzigd.")}><Check />Lokaal opslaan</Button></div><div className="admin-settings"><section><h2>Clubgegevens <span>Lokale demo</span></h2><label>Clubnaam<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label>Adres<input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} /></label><div><label>Telefoon<input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label><label>E-mail<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label></div><p>Deze waarden zijn niet aan een backend of live website gekoppeld.</p></section><section><h2>Toekomstige koppelingen</h2>{[["Ledenadministratie", "Nog niet gekoppeld"], ["Betalingen & facturen", "Nog niet gekoppeld"], ["QR-toegang", "Conceptfase"], ["Pushnotificaties", "Conceptfase"]].map(([title, status]) => <article key={title}><ShieldCheck /><span><strong>{title}</strong><small>{status}</small></span><em className="admin-settings__status">Niet actief</em></article>)}</section></div></>;
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
  return <main className="admin-app"><aside className="admin-sidebar"><Link href="/" className="admin-brand"><Image src="/brand/absolutely-fit-lockup.svg" alt="Absolutely Fit" width={590} height={142} sizes="160px" /><span><strong>Absolutely One</strong><small>Clubbeheer · demo</small></span></Link><nav ref={navRef} aria-label="Backoffice">{backofficeNav.map(({ href, label, icon: Icon }) => <Link href={href} key={href} title={label} aria-label={label === "Kennismakingen" ? `${label}, 3 open` : label} aria-current={pathname === href ? "page" : undefined} className={pathname === href ? "is-active" : ""}><Icon /><span>{label}</span>{label === "Kennismakingen" && <i aria-hidden="true">3</i>}</Link>)}</nav><div><Link href="/contact" aria-label="Hulp en contact" title="Hulp en contact"><CircleHelp /><span>Hulp & contact</span></Link><Link href="/" aria-label="Demo verlaten" title="Demo verlaten"><LogOut /><span>Demo verlaten</span></Link></div></aside><section className="admin-surface"><header className="admin-topbar"><div className="admin-topbar__context"><Activity /><span>Clubbeheer</span><i /><strong>{currentSection}</strong><small>Lokale demo</small></div><div className="admin-topbar__actions"><button type="button" aria-label="Toon zoekstatus in demo" onClick={() => setNotice("Zoeken is per overzicht lokaal beschikbaar.")}><Search /></button><button type="button" aria-label="Toon demo-meldingen" onClick={() => setNotice("Er zijn twee fictieve meldingen; niets is live.")}><Bell /><i /></button><button type="button" aria-label="Selecteer lokaal profielconcept" onClick={() => setNotice("Lokaal profielconcept van Rik geselecteerd; naam en rol vereisen bevestiging.")}><span>RP</span><small>Rik Priester</small><ChevronRight /></button></div></header><AdminDemoBanner />{section !== "rooster" && notice && <p className="schedule-live admin-global-notice" role="status" aria-live="polite">{notice}</p>}<div className={section === "rooster" ? "admin-content admin-content--schedule" : "admin-content"}>{content}</div></section></main>;
}
