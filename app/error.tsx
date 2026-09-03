"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="route-error"><span className="ao-kicker">Er ging iets mis</span><h1>Deze pagina kon niet worden geladen.</h1><p>Probeer het opnieuw. Blijft het probleem bestaan, ga dan terug naar de homepage.</p><Button type="button" onClick={reset}>Opnieuw proberen</Button></main>;
}
