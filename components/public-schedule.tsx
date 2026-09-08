"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DemoScheduleEvent, demoSchedule, formatDemoTime } from "@/lib/demo-data";
import { useAmsterdamWeek } from "@/lib/content/current-week";
import { PUBLISHED_STORAGE_KEY, SCHEDULE_PUBLISHED_EVENT, parseScheduleSnapshot, publicSchedule } from "@/lib/schedule-storage";

const filters = [
  ["all", "Alles"],
  ["strength", "Kracht"],
  ["technique", "Techniek"],
  ["guided", "Begeleiding"],
  ["first-visit", "Gratis intake"],
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
  const [notice, setNotice] = useState("Deze week geselecteerd.");
  const week = useAmsterdamWeek(weekOffset);

  useEffect(() => {
    const load = () => {
      try {
        const snapshot = parseScheduleSnapshot(window.localStorage.getItem(PUBLISHED_STORAGE_KEY), demoSchedule);
        setEvents(publicSchedule(snapshot.events));
        if (!snapshot.valid) setNotice("Deze week geselecteerd.");
      } catch {
        setEvents(publicSchedule(demoSchedule));
        setNotice("Deze week geselecteerd.");
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
    setNotice(offset === 0 ? "Deze week geselecteerd." : "Voor deze week staat geen planning in het overzicht.");
  };

  return (
    <section className="public-schedule__panel ao-shell">
      <header><button type="button" aria-label="Vorige week" onClick={() => chooseWeek(weekOffset - 1)}>←</button><div><small>{week.weekLabel}</small><strong>{week.rangeLabel}</strong></div><button type="button" aria-label="Volgende week" onClick={() => chooseWeek(weekOffset + 1)}>→</button></header>
      <div className="public-schedule__filters" aria-label="Filter het rooster">{filters.map(([value, label]) => <button type="button" key={value} className={filter === value ? "is-active" : ""} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div>
      <p className="schedule-live" role="status" aria-live="polite">{notice}</p>
      {weekOffset !== 0 ? <div className="public-schedule__empty"><h2>Geen planning voor deze week.</h2><p>Neem contact op om de actuele trainingsmomenten te bespreken.</p><button type="button" onClick={() => chooseWeek(0)}>Terug naar deze week</button></div> : visible.length ? <div className="public-schedule__list">{week.days.map((day, index) => { const dayEvents = visible.filter((event) => event.day === index); if (!dayEvents.length) return null; return <article key={day.short}><div><span>{day.short}</span><strong>{day.date}</strong></div><section>{dayEvents.map((event) => <div key={event.id}><time>{formatDemoTime(event.start)}</time><span><small>{Math.round(event.duration * 60)} min · {event.trainer}</small><strong>{event.title}</strong></span><em>{Math.max(0, event.capacity - event.booked)} plekken</em><Link href={`/contact?onderwerp=${event.type === "first-visit" ? "intake" : "begeleiding"}&begeleiding=${event.type === "first-visit" ? "wegwijs" : "coaching"}`}>{event.type === "first-visit" ? "Vraag intake aan" : "Informeer"} <ArrowRight aria-hidden="true" /></Link></div>)}</section></article>; })}</div> : <div className="public-schedule__empty"><h2>Geen momenten binnen dit filter.</h2><p>Kies een ander filter of neem contact op om de mogelijkheden te bespreken.</p><button type="button" onClick={() => setFilter("all")}>Toon alles</button></div>}
    </section>
  );
}
