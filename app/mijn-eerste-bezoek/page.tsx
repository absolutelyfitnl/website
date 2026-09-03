import { FirstVisitWizard } from "@/components/first-visit-wizard";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Jouw eerste bezoek", "Vertel ons jouw doel, voorkeursmoment en gewenste begeleiding en ontvang een passende startroute voor Absolutely Fit.", "/mijn-eerste-bezoek");

export default function FirstVisitPage() {
  return <main className="first-visit-page"><section><span>Absolutely Fit · Scheveningen</span><h1>Jouw eerste bezoek.</h1><p>Vertel in drie korte stappen wat je zoekt. Je krijgt direct een passend startvoorstel en kunt daarna vrijblijvend een kennismaking aanvragen.</p><small>Geen definitieve boeking. Het team bevestigt het moment persoonlijk.</small></section><div className="ao-shell"><FirstVisitWizard compact /></div></main>;
}
