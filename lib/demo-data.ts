export type DemoScheduleEvent = {
  id: string;
  day: number;
  start: number;
  duration: number;
  title: string;
  trainer: string;
  capacity: number;
  booked: number;
  status: "published" | "draft";
  type: "first-visit" | "personal" | "strength" | "powerlifting" | "weightlifting" | "guided" | "cardio";
  visibility: "members" | "public" | "private";
};

export const demoWeek = [
  { short: "MA", date: "31 AUG", long: "Maandag" },
  { short: "DI", date: "01 SEP", long: "Dinsdag" },
  { short: "WO", date: "02 SEP", long: "Woensdag" },
  { short: "DO", date: "03 SEP", long: "Donderdag" },
  { short: "VR", date: "04 SEP", long: "Vrijdag" },
  { short: "ZA", date: "05 SEP", long: "Zaterdag" },
  { short: "ZO", date: "06 SEP", long: "Zondag" },
];

export const demoSchedule: DemoScheduleEvent[] = [
  { id: "ev-01", day: 0, start: 8, duration: 1, title: "Personal training", trainer: "Rik Priester", capacity: 1, booked: 1, status: "published", type: "personal", visibility: "members" },
  { id: "ev-02", day: 0, start: 18.5, duration: 1, title: "Strength & Conditioning", trainer: "Rik Priester", capacity: 10, booked: 8, status: "published", type: "strength", visibility: "members" },
  { id: "ev-03", day: 1, start: 9.5, duration: .75, title: "Gratis persoonlijke intake", trainer: "Demo-coach Noor", capacity: 4, booked: 2, status: "published", type: "first-visit", visibility: "public" },
  { id: "ev-04", day: 1, start: 19, duration: 1.25, title: "Powerlifting techniek", trainer: "Rik Priester", capacity: 8, booked: 6, status: "published", type: "powerlifting", visibility: "members" },
  { id: "ev-05", day: 2, start: 18, duration: 1, title: "Begeleide krachttraining", trainer: "Demo-coach Daniël", capacity: 12, booked: 9, status: "published", type: "guided", visibility: "members" },
  { id: "ev-06", day: 3, start: 19, duration: 1.25, title: "Gewichthef-techniek", trainer: "Rik Priester", capacity: 8, booked: 7, status: "published", type: "weightlifting", visibility: "members" },
  { id: "ev-07", day: 4, start: 10, duration: 1, title: "Personal training", trainer: "Demo-coach Noor", capacity: 1, booked: 1, status: "published", type: "personal", visibility: "private" },
  { id: "ev-08", day: 5, start: 10, duration: .75, title: "Gratis persoonlijke intake", trainer: "Rik Priester", capacity: 4, booked: 3, status: "published", type: "first-visit", visibility: "public" },
  { id: "ev-09", day: 5, start: 11.5, duration: 1, title: "Cardio & conditie", trainer: "Demo-coach Noor", capacity: 10, booked: 4, status: "draft", type: "cardio", visibility: "members" },
];

export const formatDemoTime = (hour: number) => {
  const fullHour = Math.floor(hour);
  const minutes = Math.round((hour - fullHour) * 60);
  return `${String(fullHour).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};
