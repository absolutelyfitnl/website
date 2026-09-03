"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DemoScheduleEvent, demoSchedule, demoWeek, formatDemoTime } from "@/lib/demo-data";
import { PUBLISHED_STORAGE_KEY, SCHEDULE_PUBLISHED_EVENT, parseScheduleSnapshot, publicSchedule } from "@/lib/schedule-storage";

const filters = [
  ["all", "Alles"],
  ["strength", "Kracht"],
  ["technique", "Techniek"],
  ["guided", "Begeleiding"],
  ["first-visit", "Mijn eerste bezoek"],
] as const;

function matchesFilter(event: DemoScheduleEvent, filter: string) {
  if (filter === "all") return true;
  if (filter === "technique") return event.type === "powerlifting" || event.type === "weightlifting";
  if (filter === "strength") return event.type === "strength" || event.type === "personal";
  return event.type === filter;
}

export function PublicSchedule() {
  const [events, setEvents] = useState(() => publicSchedule(demoSchedule));
  const [filter, setFilter] = useState("all");
  const [weekOffset, setWeekOffset] = useState(0);
  const [notice, setNotice] = useState("Demoweek 36 geselecteerd.");

  useEffect(() => {
    const load = () => {
      try {
        const snapshot = parseScheduleSnapshot(window.localStorage.getItem(PUBLISHED_STORAGE_KEY), demoSchedule);
        setEvents(publicSchedule(snapshot.events));
        if (!snapshot.valid) setNotice("Ongeldige lokale planning genegeerd; de vaste demoweek wordt getoond.");
      } catch {
        setEvents(publicSchedule(demoSchedule));
        setNotice("Lokale browseropslag is niet beschikbaar; de vaste demoweek wordt getoond.");
      }
    };
    load();
    window.addEventListener("storage", load);
    window.addEventListener(SCHEDULE_PUBLISHED_EVENT, load);
    return () => { window.removeEventListener("storage", load); window.removeEventListener(SCHEDULE_PUBLISHED_EVENT, load); };
  }, []);

  const visible = useMemo(() => events.filter((event) => matchesFilter(event, filter)), [events, filter]);
  const chooseWeek = (offset: number) => {
    setWeekOffset(offset);
    setNotice(offset === 0 ? "Demoweek 36 geselecteerd." : "Deze prototypeweek bevat geen gekoppelde roosterdata.");
  };

  return (
    <section className="public-schedule__panel ao-shell">
      <header><button type="button" aria-label="Vorige demoweek" onClick={() => chooseWeek(weekOffset - 1)}>←</button><div><small>{weekOffset === 0 ? "Week 36" : "Andere demoweek"}</small><strong>{weekOffset === 0 ? "31 augustus — 6 september 2026" : "Geen roosterdata beschikbaar"}</strong></div><button type="button" aria-label="Volgende demoweek" onClick={() => chooseWeek(weekOffset + 1)}>→</button></header>
      <div className="public-schedule__filters" aria-label="Filter het demorooster">{filters.map(([value, label]) => <button type="button" key={value} className={filter === value ? "is-active" : ""} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div>
      <p className="schedule-live" role="status" aria-live="polite">{notice}</p>
      {weekOffset !== 0 ? <div className="public-schedule__empty"><h2>Geen data in deze demoweek.</h2><p>De prototypeplanning bevat alleen vaste voorbeeldmomenten in week 36.</p><button type="button" onClick={() => chooseWeek(0)}>Terug naar week 36</button></div> : visible.length ? <div className="public-schedule__list">{demoWeek.map((day, index) => { const dayEvents = visible.filter((event) => event.day === index); if (!dayEvents.length) return null; return <article key={day.short}><div><span>{day.short}</span><strong>{day.date}</strong></div><section>{dayEvents.map((event) => <div key={event.id}><time>{formatDemoTime(event.start)}</time><span><small>{Math.round(event.duration * 60)} min · {event.trainer}</small><strong>{event.title}</strong></span><em>{Math.max(0, event.capacity - event.booked)} plekken · demo</em><Link href={`/contact?begeleiding=${event.type === "first-visit" ? "wegwijs" : "coaching"}`}>Informeer <ArrowRight aria-hidden="true" /></Link></div>)}</section></article>; })}</div> : <div className="public-schedule__empty"><h2>Geen momenten binnen dit filter.</h2><p>Kies een ander filter of neem contact op om de mogelijkheden te bespreken.</p><button type="button" onClick={() => setFilter("all")}>Toon alles</button></div>}
    </section>
  );
}
