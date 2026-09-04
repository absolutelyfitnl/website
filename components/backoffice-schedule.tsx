"use client";

import { DragEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ArrowDown, ArrowUp, CalendarPlus, Check, ChevronLeft, ChevronRight, Copy, GripVertical, Plus, RotateCcw, Save, Send, SlidersHorizontal, Trash2, Undo2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DemoScheduleEvent, demoSchedule, demoWeek, formatDemoTime } from "@/lib/demo-data";
import { DRAFT_STORAGE_KEY, PUBLISHED_STORAGE_KEY, SCHEDULE_PUBLISHED_EVENT, cloneSchedule, parseScheduleSnapshot, publishSchedule, scheduleChanges, serializeSchedule, validateScheduleMutation } from "@/lib/schedule-storage";

const templates = [
  { title: "Mijn eerste bezoek", duration: .75, type: "first-visit" as const },
  { title: "Personal training", duration: 1, type: "personal" as const },
  { title: "Strength & Conditioning", duration: 1, type: "strength" as const },
  { title: "Powerlifting techniek", duration: 1.25, type: "powerlifting" as const },
  { title: "Gewichthef-techniek", duration: 1.25, type: "weightlifting" as const },
  { title: "Begeleide krachttraining", duration: 1, type: "guided" as const },
];

const hours = Array.from({ length: 15 }, (_, index) => 8 + index);
const halfHours = Array.from({ length: 28 }, (_, index) => 8 + index * .5);
type Template = (typeof templates)[number];
type DragPayload = { kind: "event"; id: string } | { kind: "template"; title: string; duration: number; type: DemoScheduleEvent["type"] };

function eventColor(type: DemoScheduleEvent["type"]) {
  if (type === "first-visit") return "violet";
  if (type === "powerlifting" || type === "weightlifting") return "navy";
  if (type === "personal") return "green";
  return "blue";
}

function newEventId() {
  return `ev-demo-${typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Date.now().toString(36)}`;
}

export function BackofficeSchedule() {
  const [events, setEvents] = useState<DemoScheduleEvent[]>(() => cloneSchedule(demoSchedule));
  const [baseline, setBaseline] = useState<DemoScheduleEvent[]>(() => cloneSchedule(demoSchedule));
  const [history, setHistory] = useState<DemoScheduleEvent[][]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("Demorooster geladen. Nog niets gewijzigd.");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [publishOpen, setPublishOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const liveRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const published = parseScheduleSnapshot(window.localStorage.getItem(PUBLISHED_STORAGE_KEY), demoSchedule);
        const draft = parseScheduleSnapshot(window.localStorage.getItem(DRAFT_STORAGE_KEY), published.events);
        setBaseline(published.events);
        setEvents(draft.events);
        if (!published.valid || !draft.valid) setStatusMessage("Ongeldige lokale roosterdata is veilig vervangen door de demobasis.");
      } catch {
        setBaseline(cloneSchedule(demoSchedule));
        setEvents(cloneSchedule(demoSchedule));
        setStatusMessage("Lokale browseropslag is niet beschikbaar; wijzigingen blijven alleen in dit venster.");
      } finally {
        setHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(DRAFT_STORAGE_KEY, serializeSchedule(events));
    } catch {
      const timer = window.setTimeout(() => {
        setStatusMessage("Lokale browseropslag is niet beschikbaar; wijzigingen blijven alleen in dit venster.");
        setErrorMessage("Lokale browseropslag is niet beschikbaar; wijzigingen blijven alleen in dit venster.");
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [events, hydrated]);

  const changes = useMemo(() => scheduleChanges(baseline, events), [baseline, events]);
  const changedIds = useMemo(() => new Set([...changes.added, ...changes.changed]), [changes]);
  const visibleEvents = useMemo(() => events.filter((event) => filter === "all" || event.status === filter || event.type === filter), [events, filter]);
  const selectedEvent = events.find((event) => event.id === selected) ?? null;

  const announce = (message: string, error = false) => {
    setStatusMessage(message);
    setErrorMessage(error ? message : null);
  };

  const commit = (next: DemoScheduleEvent[], message: string) => {
    setHistory((items) => [...items.slice(-19), cloneSchedule(events)]);
    setEvents(cloneSchedule(next));
    announce(message);
  };

  const applyCandidate = (candidate: DemoScheduleEvent, message: string) => {
    const error = validateScheduleMutation(candidate, events);
    if (error) { announce(`Kan niet wijzigen: ${error}`, true); return false; }
    commit(events.map((event) => event.id === candidate.id ? candidate : event), message);
    return true;
  };

  const moveEvent = (id: string, day: number, start: number) => {
    const original = events.find((event) => event.id === id);
    if (!original) return;
    const candidate = { ...original, day, start, status: "draft" as const };
    applyCandidate(candidate, `${original.title} verplaatst naar ${demoWeek[day].long} ${formatDemoTime(start)}.`);
  };

  const addTemplate = (template: Template | Extract<DragPayload, { kind: "template" }>, day: number, start: number) => {
    const candidate: DemoScheduleEvent = {
      id: newEventId(), day, start, duration: template.duration, title: template.title,
      trainer: "Nog toe te wijzen", capacity: template.type === "personal" ? 1 : 8,
      booked: 0, status: "draft", type: template.type,
      visibility: template.type === "first-visit" ? "public" : "members",
    };
    const error = validateScheduleMutation(candidate, events);
    if (error) { announce(`Kan niet toevoegen: ${error}`, true); return; }
    commit([...events, candidate], `${template.title} toegevoegd op ${demoWeek[day].long} om ${formatDemoTime(start)}.`);
    setSelected(candidate.id);
    setEditorOpen(true);
  };

  const handleDrop = (event: DragEvent, day: number, start: number) => {
    event.preventDefault();
    try {
      const payload = JSON.parse(event.dataTransfer.getData("application/json")) as DragPayload;
      if (payload.kind === "event") moveEvent(payload.id, day, start);
      else addTemplate(payload, day, start);
    } catch {
      announce("Dit roosteritem kon niet worden geplaatst.", true);
    }
  };

  const startDrag = (event: DragEvent, payload: DragPayload) => {
    event.dataTransfer.effectAllowed = payload.kind === "template" ? "copy" : "move";
    event.dataTransfer.setData("application/json", JSON.stringify(payload));
  };

  const keyboardMove = (keyboardEvent: KeyboardEvent<HTMLButtonElement>, eventItem: DemoScheduleEvent) => {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(keyboardEvent.key)) return;
    keyboardEvent.preventDefault();
    const jump = keyboardEvent.shiftKey ? 1 : .5;
    const day = keyboardEvent.key === "ArrowLeft" ? Math.max(0, eventItem.day - 1) : keyboardEvent.key === "ArrowRight" ? Math.min(6, eventItem.day + 1) : eventItem.day;
    const start = keyboardEvent.key === "ArrowUp" ? Math.max(8, eventItem.start - jump) : keyboardEvent.key === "ArrowDown" ? Math.min(22 - eventItem.duration, eventItem.start + jump) : eventItem.start;
    moveEvent(eventItem.id, day, start);
  };

  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setEvents(cloneSchedule(previous));
    setHistory((items) => items.slice(0, -1));
    announce("Laatste roosterwijziging ongedaan gemaakt.");
  };

  const reset = () => {
    if (JSON.stringify(events) === JSON.stringify(demoSchedule)) { announce("De demobasis stond al ingesteld."); return; }
    commit(cloneSchedule(demoSchedule), "Demorooster teruggezet naar de oorspronkelijke basis.");
    setSelected(null);
  };

  const publish = () => {
    const published = publishSchedule(events, changedIds);
    let previousPublished: string | null = null;
    let previousDraft: string | null = null;
    try {
      previousPublished = window.localStorage.getItem(PUBLISHED_STORAGE_KEY);
      previousDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      const snapshot = serializeSchedule(published);
      window.localStorage.setItem(PUBLISHED_STORAGE_KEY, snapshot);
      window.localStorage.setItem(DRAFT_STORAGE_KEY, snapshot);
    } catch {
      try {
        if (previousPublished === null) window.localStorage.removeItem(PUBLISHED_STORAGE_KEY);
        else window.localStorage.setItem(PUBLISHED_STORAGE_KEY, previousPublished);
        if (previousDraft === null) window.localStorage.removeItem(DRAFT_STORAGE_KEY);
        else window.localStorage.setItem(DRAFT_STORAGE_KEY, previousDraft);
      } catch {
        // Browser storage offers no transactions; the UI remains on the uncommitted in-memory draft.
      }
      announce("Publiceren is niet gelukt: lokale browseropslag is niet beschikbaar.", true);
      return;
    }
    window.dispatchEvent(new CustomEvent(SCHEDULE_PUBLISHED_EVENT));
    setHistory((items) => [...items.slice(-19), cloneSchedule(events)]);
    setEvents(published);
    setBaseline(cloneSchedule(published));
    setPublishOpen(false);
    announce(`Demo: ${changes.count} wijziging${changes.count === 1 ? "" : "en"} alleen lokaal gepubliceerd; niemand heeft een bericht ontvangen.`);
  };

  const duplicate = (eventItem: DemoScheduleEvent) => {
    const starts = halfHours.filter((start) => start + eventItem.duration <= 22).sort((a, b) => Math.abs(a - (eventItem.start + .5)) - Math.abs(b - (eventItem.start + .5)));
    const candidate = starts.map((start) => ({ ...eventItem, id: newEventId(), start, title: `${eventItem.title} · kopie`, status: "draft" as const, booked: 0 }))
      .find((copy) => !validateScheduleMutation(copy, events));
    if (!candidate) { announce("Geen vrij tijdstip gevonden om deze regel veilig te dupliceren.", true); return; }
    commit([...events, candidate], `Roosterregel gedupliceerd naar ${formatDemoTime(candidate.start)}.`);
    setSelected(candidate.id);
  };

  const updateSelected = (patch: Partial<DemoScheduleEvent>) => {
    if (!selectedEvent) return;
    const candidate = { ...selectedEvent, ...patch, status: "draft" as const };
    applyCandidate(candidate, "Roosterregel bijgewerkt en lokaal als concept opgeslagen.");
  };

  const removeSelected = () => {
    if (!selectedEvent) return;
    commit(events.filter((event) => event.id !== selectedEvent.id), `${selectedEvent.title} verwijderd. Gebruik ‘Ongedaan’ om dit te herstellen.`);
    setDeleteOpen(false);
    setEditorOpen(false);
    setSelected(null);
  };

  return (
    <div className="schedule-workspace">
      <header className="schedule-heading">
        <div><span>Clubplanning · interactieve demo</span><h1>Weekrooster</h1><p>Sleep een training naar het bord, verplaats een afspraak of open een roosterregel om hem te bewerken.</p></div>
        <dl><div><dt>Roosterregels</dt><dd>{visibleEvents.length}</dd></div><div><dt>Concept</dt><dd>{events.filter((event) => event.status === "draft").length}</dd></div><div><dt>Deze week</dt><dd>36</dd></div></dl>
      </header>

      <div className="schedule-toolbar">
        <div className="schedule-week-controls"><button type="button" aria-label="Vorige demoweek" onClick={() => announce("Demo: alleen week 36 bevat roosterdata.")}><ChevronLeft /></button><Button type="button" variant="outline" onClick={() => { setSelectedDay(0); announce("Maandag van demoweek 36 geselecteerd."); }}>Vandaag</Button><button type="button" aria-label="Volgende demoweek" onClick={() => announce("Demo: alleen week 36 bevat roosterdata.")}><ChevronRight /></button><div><small>Week 36</small><strong>31 aug — 6 sep 2026</strong></div></div>
        <div className="schedule-toolbar__actions"><label><SlidersHorizontal /> <select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter rooster"><option value="all">Alle roosterregels</option><option value="draft">Alleen concept</option><option value="published">Gepubliceerd</option><option value="first-visit">Mijn eerste bezoek</option><option value="strength">Strength & Conditioning</option><option value="powerlifting">Powerliftingtechniek</option><option value="weightlifting">Gewichtheftechniek</option><option value="guided">Begeleide krachttraining</option></select></label><button type="button" onClick={undo} disabled={!history.length}><Undo2 />Ongedaan</button><Button type="button" variant="outline" onClick={() => addTemplate(templates[0], selectedDay, 9)}><Plus />Nieuwe regel</Button><Button type="button" className="ao-button ao-button--blue" onClick={() => setPublishOpen(true)} disabled={!changes.count}><Send />{changes.count ? `${changes.count} wijziging${changes.count === 1 ? "" : "en"} publiceren` : "Geen wijzigingen"}</Button></div>
      </div>

      <div className="schedule-status"><span><i /> Conceptrooster · lokaal opgeslagen</span><span>Alleen lokaal gepubliceerde regels zijn zichtbaar in de demo-overzichten.</span><button type="button" onClick={reset}><RotateCcw />Demo herstellen</button></div>
      <div className="schedule-layout">
        <aside className="schedule-templates"><header><span>Nog in te plannen</span><strong>{templates.length}</strong></header><p>Sleep een template naar een dag en tijd, of voeg hem met het toetsenbord toe.</p>{templates.map((template, index) => <button type="button" draggable onDragStart={(event) => startDrag(event, { kind: "template", ...template })} onClick={() => addTemplate(template, selectedDay, 9 + index * .5)} key={template.title}><GripVertical /><span><strong>{template.title}</strong><small>{Math.round(template.duration * 60)} min · demo</small></span><i>{String(index + 1).padStart(2, "0")}</i></button>)}<small><AlertTriangle /> Alle tijden, trainers en capaciteiten zijn fictieve demo-inhoud.</small></aside>
        <section className="schedule-calendar" aria-label="Drag-and-drop weekrooster">
          <div className="schedule-grid-head"><span>Tijd</span>{demoWeek.map((day, index) => <button type="button" key={day.short} className={index === selectedDay ? "is-selected" : ""} onClick={() => setSelectedDay(index)}><strong>{day.short}</strong><small>{day.date}</small></button>)}</div>
          <div className="schedule-grid-body">
            <div className="schedule-time-axis">{hours.map((hour) => <time key={hour} style={{ top: `${((hour - 8) / 14) * 100}%` }}>{formatDemoTime(hour)}</time>)}</div>
            {demoWeek.map((day, dayIndex) => <div className={`schedule-day ${dayIndex === 2 ? "is-today" : ""}`} key={day.short}>{halfHours.map((hour) => <button type="button" tabIndex={-1} key={hour} className="schedule-drop-slot" style={{ top: `${((hour - 8) / 14) * 100}%`, height: `${(0.5 / 14) * 100}%` }} onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, dayIndex, hour)} onClick={() => selected && moveEvent(selected, dayIndex, hour)} aria-label={`Plaats geselecteerde regel op ${day.long} om ${formatDemoTime(hour)}`} />)}{visibleEvents.filter((item) => item.day === dayIndex).map((item) => <button type="button" key={item.id} draggable onDragStart={(event) => startDrag(event, { kind: "event", id: item.id })} onKeyDown={(event) => keyboardMove(event, item)} onClick={() => { setSelected(item.id); setEditorOpen(true); }} className={`schedule-event schedule-event--${eventColor(item.type)} ${selected === item.id ? "is-selected" : ""}`} style={{ top: `${((item.start - 8) / 14) * 100}%`, height: `${Math.max(5, (item.duration / 14) * 100)}%` }} aria-label={`${item.title}, ${formatDemoTime(item.start)}, ${item.trainer}, ${item.status === "draft" ? "concept" : "gepubliceerd"}. Gebruik pijltjestoetsen om te verplaatsen.`}><span>{formatDemoTime(item.start)}–{formatDemoTime(item.start + item.duration)}</span><strong>{item.title}</strong><small>{item.trainer}</small><em><Users />{item.booked}/{item.capacity}</em><i>{item.status === "draft" ? "Concept" : "Live"}</i></button>)}</div>)}
            <div className="schedule-now-line" style={{ top: "73%" }}><span>Nu · demo</span></div>
          </div>
        </section>
      </div>

      <div className="schedule-mobile-days" aria-label="Kies een dag">{demoWeek.map((day, dayIndex) => <button type="button" key={day.short} className={dayIndex === selectedDay ? "is-active" : ""} onClick={() => setSelectedDay(dayIndex)}><strong>{day.short}</strong><small>{day.date}</small></button>)}</div>
      <div className="schedule-mobile-agenda">{demoWeek.map((day, dayIndex) => {
        if (dayIndex !== selectedDay) return null;
        const dayEvents = visibleEvents.filter((event) => event.day === dayIndex);
        return <section key={day.short}><header><span>{day.long}</span><strong>{day.date}</strong></header>{dayEvents.map((item) => <article key={item.id}><time>{formatDemoTime(item.start)}</time><div><strong>{item.title}</strong><small>{item.trainer} · {Math.round(item.duration * 60)} min</small></div><i>{item.status}</i><div className="schedule-mobile-agenda__actions"><button type="button" onClick={() => moveEvent(item.id, item.day, Math.max(8, item.start - .5))} aria-label={`${item.title} dertig minuten eerder`}><ArrowUp /></button><button type="button" onClick={() => moveEvent(item.id, item.day, Math.min(22 - item.duration, item.start + .5))} aria-label={`${item.title} dertig minuten later`}><ArrowDown /></button><button type="button" onClick={() => { setSelected(item.id); setEditorOpen(true); }}>Bewerk</button></div></article>)}{!dayEvents.length && <div className="schedule-mobile-agenda__empty"><CalendarPlus aria-hidden="true" /><strong>Nog niets ingepland</strong><p>Voeg een nieuwe roosterregel toe voor deze dag.</p></div>}</section>;
      })}</div>
      <p ref={liveRef} className="schedule-live" role={errorMessage ? "alert" : "status"} aria-live="polite">{statusMessage}</p>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="schedule-editor"><DialogHeader><DialogTitle>{selectedEvent ? "Roosterregel bewerken" : "Nieuwe roosterregel"}</DialogTitle><DialogDescription>Wijzigingen blijven concept tot je ze lokaal publiceert. Alle waarden zijn demo-inhoud.</DialogDescription></DialogHeader>{selectedEvent ? <div className="schedule-editor__fields"><label>Titel<input value={selectedEvent.title} onChange={(event) => updateSelected({ title: event.target.value })} /></label><div><label>Dag<select value={selectedEvent.day} onChange={(event) => updateSelected({ day: Number(event.target.value) })}>{demoWeek.map((day, index) => <option value={index} key={day.short}>{day.long}</option>)}</select></label><label>Starttijd<select value={selectedEvent.start} onChange={(event) => updateSelected({ start: Number(event.target.value) })}>{halfHours.filter((hour) => hour + selectedEvent.duration <= 22).map((hour) => <option value={hour} key={hour}>{formatDemoTime(hour)}</option>)}</select></label></div><div><label>Trainer<select value={selectedEvent.trainer} onChange={(event) => updateSelected({ trainer: event.target.value })}><option>Rik Priester</option><option>Demo-coach Noor</option><option>Demo-coach Daniël</option><option>Nog toe te wijzen</option></select></label><label>Capaciteit<input type="number" min="1" value={selectedEvent.capacity} onChange={(event) => updateSelected({ capacity: Number(event.target.value) })} /></label></div><div><label>Zichtbaarheid<select value={selectedEvent.visibility} onChange={(event) => updateSelected({ visibility: event.target.value as DemoScheduleEvent["visibility"] })}><option value="members">Ledenportaal</option><option value="public">Publiek + leden</option><option value="private">Alleen backoffice</option></select></label><label>Duur<select value={selectedEvent.duration} onChange={(event) => updateSelected({ duration: Number(event.target.value) })}><option value="0.5">30 minuten</option><option value="0.75">45 minuten</option><option value="1">60 minuten</option><option value="1.25">75 minuten</option><option value="1.5">90 minuten</option></select></label></div>{errorMessage && <p className="schedule-editor__error" role="alert">{errorMessage}</p>}</div> : <div className="schedule-editor__empty"><CalendarPlus /><p>Kies ‘Nieuwe regel’ of een template om een roosterregel toe te voegen.</p></div>}<DialogFooter>{selectedEvent && <><Button type="button" variant="outline" onClick={() => duplicate(selectedEvent)}><Copy />Dupliceren</Button><Button type="button" variant="outline" onClick={() => setDeleteOpen(true)}><Trash2 />Verwijderen</Button></>}<DialogClose asChild><Button type="button" className="ao-button ao-button--blue"><Save />Concept sluiten</Button></DialogClose></DialogFooter></DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}><DialogContent><DialogHeader><DialogTitle>Roosterregel verwijderen?</DialogTitle><DialogDescription>{selectedEvent?.title ?? "Deze roosterregel"} verdwijnt uit het lokale concept. Je kunt de actie daarna ongedaan maken.</DialogDescription></DialogHeader><DialogFooter><DialogClose asChild><Button type="button" variant="outline">Annuleren</Button></DialogClose><Button type="button" onClick={removeSelected}>Verwijderen</Button></DialogFooter></DialogContent></Dialog>

      <Dialog open={publishOpen} onOpenChange={setPublishOpen}><DialogContent className="publish-dialog"><DialogHeader><DialogTitle>Wijzigingen lokaal publiceren?</DialogTitle><DialogDescription>Dit werkt alleen in deze browser. Er worden geen echte notificaties, boekingen of wijzigingen buiten deze demo uitgevoerd.</DialogDescription></DialogHeader><div><strong>{changes.count} wijziging{changes.count === 1 ? "" : "en"}</strong><span>{changes.added.length} toegevoegd · {changes.changed.length} aangepast · {changes.removed.length} verwijderd</span><p><Check /> Alleen gewijzigde conceptregels worden gepubliceerd<br /><Check /> Publiek en ledenportaal respecteren zichtbaarheid<br /><Check /> Niemand ontvangt een bericht</p></div><DialogFooter><DialogClose asChild><Button type="button" variant="outline">Annuleren</Button></DialogClose><Button type="button" className="ao-button ao-button--blue" onClick={publish} disabled={!changes.count}>{changes.count} wijziging{changes.count === 1 ? "" : "en"} lokaal publiceren</Button></DialogFooter></DialogContent></Dialog>
    </div>
  );
}
