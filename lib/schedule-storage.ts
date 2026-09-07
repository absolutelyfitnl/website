import { DemoScheduleEvent, demoSchedule } from "@/lib/demo-data";
import { openingDays, openingHours } from "@/lib/content/opening-hours";

export const SCHEDULE_SCHEMA_VERSION = 2 as const;
export const DRAFT_STORAGE_KEY = "af-schedule-draft-v2";
export const PUBLISHED_STORAGE_KEY = "af-schedule-published-v2";
export const SCHEDULE_PUBLISHED_EVENT = "af-schedule-published";

export type ScheduleSnapshot = {
  version: typeof SCHEDULE_SCHEMA_VERSION;
  events: DemoScheduleEvent[];
};

const statuses = new Set<DemoScheduleEvent["status"]>(["published", "draft"]);
const types = new Set<DemoScheduleEvent["type"]>(["first-visit", "personal", "strength", "powerlifting", "weightlifting", "guided", "cardio"]);
const visibilities = new Set<DemoScheduleEvent["visibility"]>(["members", "public", "private"]);

function decimalTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours + minutes / 60;
}

function clubBounds(dayIndex: number) {
  const day = openingDays[dayIndex];
  const range = day ? openingHours[day.key][0] : undefined;
  return range ? { opens: decimalTime(range.opens), closes: decimalTime(range.closes), label: day.label } : null;
}

export function isScheduleEvent(value: unknown): value is DemoScheduleEvent {
  if (!value || typeof value !== "object") return false;
  const event = value as Record<string, unknown>;
  const bounds = typeof event.day === "number" ? clubBounds(event.day) : null;
  return typeof event.id === "string" && event.id.length > 0
    && typeof event.title === "string" && event.title.trim().length > 0
    && typeof event.trainer === "string" && event.trainer.trim().length > 0
    && Number.isInteger(event.day) && Number(event.day) >= 0 && Number(event.day) <= 6
    && typeof event.start === "number" && Number.isFinite(event.start) && Boolean(bounds) && event.start >= (bounds?.opens ?? 0)
    && typeof event.duration === "number" && Number.isFinite(event.duration) && event.duration > 0
    && event.start + event.duration <= (bounds?.closes ?? 0)
    && Number.isInteger(event.capacity) && Number(event.capacity) >= 1
    && Number.isInteger(event.booked) && Number(event.booked) >= 0 && Number(event.booked) <= Number(event.capacity)
    && statuses.has(event.status as DemoScheduleEvent["status"])
    && types.has(event.type as DemoScheduleEvent["type"])
    && visibilities.has(event.visibility as DemoScheduleEvent["visibility"]);
}

export function cloneSchedule(events: DemoScheduleEvent[]) {
  return events.map((event) => ({ ...event }));
}

export function parseScheduleSnapshot(serialized: string | null, fallback = demoSchedule): { events: DemoScheduleEvent[]; valid: boolean } {
  if (!serialized) return { events: cloneSchedule(fallback), valid: true };
  try {
    const value = JSON.parse(serialized) as { version?: unknown; events?: unknown };
    if (value.version !== SCHEDULE_SCHEMA_VERSION || !Array.isArray(value.events) || !value.events.every(isScheduleEvent)) throw new Error("invalid schedule snapshot");
    const ids = new Set(value.events.map((event) => event.id));
    if (ids.size !== value.events.length) throw new Error("duplicate schedule id");
    return { events: cloneSchedule(value.events), valid: true };
  } catch {
    return { events: cloneSchedule(fallback), valid: false };
  }
}

export function serializeSchedule(events: DemoScheduleEvent[]) {
  return JSON.stringify({ version: SCHEDULE_SCHEMA_VERSION, events } satisfies ScheduleSnapshot);
}

export function scheduleChanges(baseline: DemoScheduleEvent[], current: DemoScheduleEvent[]) {
  const before = new Map(baseline.map((event) => [event.id, JSON.stringify(event)]));
  const after = new Map(current.map((event) => [event.id, JSON.stringify(event)]));
  const added = current.filter((event) => !before.has(event.id)).map((event) => event.id);
  const removed = baseline.filter((event) => !after.has(event.id)).map((event) => event.id);
  const changed = current.filter((event) => before.has(event.id) && before.get(event.id) !== JSON.stringify(event)).map((event) => event.id);
  return { added, removed, changed, count: added.length + removed.length + changed.length };
}

export function validateScheduleMutation(candidate: DemoScheduleEvent, events: DemoScheduleEvent[]) {
  const bounds = clubBounds(candidate.day);
  if (!Number.isFinite(candidate.start) || !Number.isFinite(candidate.duration)
    || !bounds || candidate.start < bounds.opens || candidate.start + candidate.duration > bounds.closes) {
    return bounds
      ? `Een roosterregel op ${bounds.label.toLowerCase()} moet volledig binnen de reguliere cluburen vallen.`
      : "Kies een geldige dag en tijd binnen de reguliere cluburen.";
  }
  if (!Number.isInteger(candidate.capacity) || candidate.capacity < 1) return "Capaciteit moet minimaal één zijn.";
  if (!Number.isInteger(candidate.booked) || candidate.booked < 0 || candidate.booked > candidate.capacity) {
    return "Capaciteit kan niet lager zijn dan het aantal reserveringen.";
  }
  if (!isScheduleEvent(candidate)) return "Controleer alle waarden van deze roosterregel.";
  if (candidate.trainer !== "Nog toe te wijzen" && events.some((event) => event.id !== candidate.id
    && event.day === candidate.day
    && event.trainer === candidate.trainer
    && candidate.start < event.start + event.duration
    && candidate.start + candidate.duration > event.start)) {
    return `${candidate.trainer} heeft op dit moment al een afspraak.`;
  }
  return null;
}

export function publishSchedule(events: DemoScheduleEvent[], changedIds = new Set(events.filter((event) => event.status === "draft").map((event) => event.id))) {
  return events.map((event) => event.status === "draft" && changedIds.has(event.id) ? { ...event, status: "published" as const } : { ...event });
}

export function publicSchedule(events: DemoScheduleEvent[]) {
  return events.filter((event) => event.status === "published" && event.visibility === "public");
}

export function memberSchedule(events: DemoScheduleEvent[]) {
  return events.filter((event) => event.status === "published" && event.visibility !== "private");
}
