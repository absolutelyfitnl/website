"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { getOpeningStatus } from "@/lib/content/opening-hours";
import { site } from "@/lib/content/site";

type OpeningState = ReturnType<typeof getOpeningStatus> | null;

export function OpenNowCard() {
  const [status, setStatus] = useState<OpeningState>(null);

  useEffect(() => {
    const update = () => setStatus(getOpeningStatus(new Date(), site.timeZone));
    update();
    const interval = window.setInterval(update, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  return <aside className="open-now-card" data-open={status?.isOpen ?? false}>
    <Clock3 aria-hidden="true" />
    <span>Actuele status in Scheveningen</span>
    <strong role="status" aria-live="polite">{status?.label ?? "Status wordt gecontroleerd…"}</strong>
    <small>Gebaseerd op de reguliere uren. Feestdagen en uitzonderingen vooraf navragen.</small>
    <Link href="/contact">Neem contact op <ArrowRight aria-hidden="true" /></Link>
  </aside>;
}
