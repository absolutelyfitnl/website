export type OpeningDayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export type OpeningRange = { opens: string; closes: string };

export const openingHours: Readonly<Record<OpeningDayKey, readonly OpeningRange[]>> = {
  monday: [{ opens: "07:00", closes: "22:00" }],
  tuesday: [{ opens: "07:00", closes: "22:00" }],
  wednesday: [{ opens: "07:00", closes: "22:00" }],
  thursday: [{ opens: "07:00", closes: "22:00" }],
  friday: [{ opens: "07:00", closes: "21:00" }],
  saturday: [{ opens: "08:00", closes: "15:00" }],
  sunday: [{ opens: "08:00", closes: "15:00" }],
} as const;

export const openingDays = [
  { key: "monday", label: "Maandag", schemaDay: "https://schema.org/Monday" },
  { key: "tuesday", label: "Dinsdag", schemaDay: "https://schema.org/Tuesday" },
  { key: "wednesday", label: "Woensdag", schemaDay: "https://schema.org/Wednesday" },
  { key: "thursday", label: "Donderdag", schemaDay: "https://schema.org/Thursday" },
  { key: "friday", label: "Vrijdag", schemaDay: "https://schema.org/Friday" },
  { key: "saturday", label: "Zaterdag", schemaDay: "https://schema.org/Saturday" },
  { key: "sunday", label: "Zondag", schemaDay: "https://schema.org/Sunday" },
] as const satisfies ReadonlyArray<{ key: OpeningDayKey; label: string; schemaDay: string }>;

export const openingHourGroups = [
  { label: "Maandag t/m donderdag", opens: openingHours.monday[0].opens, closes: openingHours.monday[0].closes },
  { label: "Vrijdag", opens: openingHours.friday[0].opens, closes: openingHours.friday[0].closes },
  { label: "Zaterdag en zondag", opens: openingHours.saturday[0].opens, closes: openingHours.saturday[0].closes },
] as const;

export const openingHoursSummary = openingHourGroups
  .map((group) => `${group.label} ${group.opens}–${group.closes}`)
  .join(", ");

export function formatOpeningRange(range: OpeningRange) {
  return `${range.opens}–${range.closes}`;
}

function minutes(value: string) {
  const [hours, minutesPart] = value.split(":").map(Number);
  return hours * 60 + minutesPart;
}

export function getOpeningStatus(at: Date, timeZone = "Europe/Amsterdam") {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(at);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value;
  const day = part("weekday")?.toLowerCase() as OpeningDayKey | undefined;
  const hour = Number(part("hour"));
  const minute = Number(part("minute"));
  const ranges = day ? openingHours[day] : [];
  const current = hour * 60 + minute;
  const active = ranges.find((range) => current >= minutes(range.opens) && current < minutes(range.closes));
  if (active) return { isOpen: true, label: `Open tot ${active.closes}`, day, closes: active.closes, nextOpens: null, nextDayOffset: 0, nextDayLabel: null };

  const laterToday = ranges.find((range) => current < minutes(range.opens));
  if (laterToday) return { isOpen: false, label: `Gesloten · open vanaf ${laterToday.opens}`, day, closes: null, nextOpens: laterToday.opens, nextDayOffset: 0, nextDayLabel: day ? openingDays.find((item) => item.key === day)?.label ?? null : null };

  const dayIndex = openingDays.findIndex((item) => item.key === day);
  if (dayIndex >= 0) {
    for (let offset = 1; offset <= openingDays.length; offset += 1) {
      const nextDay = openingDays[(dayIndex + offset) % openingDays.length];
      const nextRange = openingHours[nextDay.key][0];
      if (nextRange) return { isOpen: false, label: `Gesloten · ${offset === 1 ? "morgen" : nextDay.label.toLowerCase()} vanaf ${nextRange.opens}`, day, closes: null, nextOpens: nextRange.opens, nextDayOffset: offset, nextDayLabel: nextDay.label };
    }
  }

  return { isOpen: false, label: "Gesloten", day, closes: null, nextOpens: null, nextDayOffset: null, nextDayLabel: null };
}

export function formatCustomerOpeningStatus(status: ReturnType<typeof getOpeningStatus>) {
  if (status.isOpen && status.closes) return `GEOPEND - VANDAAG TOT ${status.closes} UUR`;
  if (!status.nextOpens) return "GESLOTEN";
  return `GESLOTEN - GEOPEND VANAF ${status.nextOpens} UUR`;
}
