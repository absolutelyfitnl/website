"use client";

import { useEffect, useMemo, useState } from "react";

export const AMSTERDAM_TIME_ZONE = "Europe/Amsterdam";

export type AmsterdamWeekDay = {
  index: number;
  short: string;
  long: string;
  date: string;
  dateLabel: string;
  isoDate: string;
  isToday: boolean;
};

export type AmsterdamWeek = {
  isReady: boolean;
  isoWeek: number | null;
  weekLabel: string;
  rangeLabel: string;
  compactRangeLabel: string;
  monthYearLabel: string;
  days: AmsterdamWeekDay[];
};

type CalendarDate = { year: number; month: number; day: number };

const neutralDays = [
  ["MA", "Maandag"],
  ["DI", "Dinsdag"],
  ["WO", "Woensdag"],
  ["DO", "Donderdag"],
  ["VR", "Vrijdag"],
  ["ZA", "Zaterdag"],
  ["ZO", "Zondag"],
] as const;

const amsterdamDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: AMSTERDAM_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const monthLongFormatter = new Intl.DateTimeFormat("nl-NL", { month: "long", timeZone: "UTC" });
const monthShortFormatter = new Intl.DateTimeFormat("nl-NL", { month: "short", timeZone: "UTC" });
const clockFormatter = new Intl.DateTimeFormat("nl-NL", {
  timeZone: AMSTERDAM_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function calendarDateInAmsterdam(now: Date): CalendarDate {
  const parts = amsterdamDateFormatter.formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
  return { year: value("year"), month: value("month"), day: value("day") };
}

function toUtcDate({ year, month, day }: CalendarDate) {
  return new Date(Date.UTC(year, month - 1, day));
}

function fromUtcDate(date: Date): CalendarDate {
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}

function addDays(date: CalendarDate, amount: number) {
  const shifted = toUtcDate(date);
  shifted.setUTCDate(shifted.getUTCDate() + amount);
  return fromUtcDate(shifted);
}

function isoDate(date: CalendarDate) {
  return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
}

function monthName(date: CalendarDate, style: "long" | "short") {
  const formatter = style === "long" ? monthLongFormatter : monthShortFormatter;
  return formatter.format(toUtcDate(date)).replace(".", "");
}

function isoWeekNumber(date: CalendarDate) {
  const value = toUtcDate(date);
  const weekday = value.getUTCDay() || 7;
  value.setUTCDate(value.getUTCDate() + 4 - weekday);
  const yearStart = new Date(Date.UTC(value.getUTCFullYear(), 0, 1));
  return Math.ceil(((value.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

function formatRange(start: CalendarDate, end: CalendarDate, monthStyle: "long" | "short") {
  const startMonth = monthName(start, monthStyle);
  const endMonth = monthName(end, monthStyle);
  if (start.year === end.year && start.month === end.month) {
    return `${start.day} — ${end.day} ${endMonth} ${end.year}`;
  }
  if (start.year === end.year) {
    return `${start.day} ${startMonth} — ${end.day} ${endMonth} ${end.year}`;
  }
  return `${start.day} ${startMonth} ${start.year} — ${end.day} ${endMonth} ${end.year}`;
}

function neutralWeek(): AmsterdamWeek {
  return {
    isReady: false,
    isoWeek: null,
    weekLabel: "Deze week",
    rangeLabel: "Maandag — zondag",
    compactRangeLabel: "Maandag — zondag",
    monthYearLabel: "Deze maand",
    days: neutralDays.map(([short, long], index) => ({
      index,
      short,
      long,
      date: "",
      dateLabel: long,
      isoDate: "",
      isToday: false,
    })),
  };
}

export function getAmsterdamWeek(now: Date, weekOffset = 0): AmsterdamWeek {
  const today = calendarDateInAmsterdam(now);
  const todayUtc = toUtcDate(today);
  const weekday = todayUtc.getUTCDay() || 7;
  const monday = addDays(today, 1 - weekday + weekOffset * 7);
  const sunday = addDays(monday, 6);
  const todayIso = isoDate(today);
  const isoWeek = isoWeekNumber(monday);

  return {
    isReady: true,
    isoWeek,
    weekLabel: `Week ${isoWeek}`,
    rangeLabel: formatRange(monday, sunday, "long"),
    compactRangeLabel: formatRange(monday, sunday, "short"),
    monthYearLabel: `${monthName(monday, "long")} ${monday.year}`,
    days: neutralDays.map(([short, long], index) => {
      const date = addDays(monday, index);
      return {
        index,
        short,
        long,
        date: `${String(date.day).padStart(2, "0")} ${monthName(date, "short").toUpperCase()}`,
        dateLabel: `${date.day} ${monthName(date, "long")}`,
        isoDate: isoDate(date),
        isToday: isoDate(date) === todayIso,
      };
    }),
  };
}

export function useAmsterdamWeek(weekOffset = 0) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const interval = window.setInterval(update, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  return useMemo(() => now ? getAmsterdamWeek(now, weekOffset) : neutralWeek(), [now, weekOffset]);
}

export function useAmsterdamClock() {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const update = () => setTime(clockFormatter.format(new Date()));
    update();
    const interval = window.setInterval(update, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  return time;
}
