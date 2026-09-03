import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return <main className="not-found"><span className="ao-kicker">404 · Niet gevonden</span><h1>Deze route bestaat niet.</h1><p>Ga terug naar de clubsite, ontdek de trainingsmogelijkheden of stel je vraag rechtstreeks.</p><nav aria-label="Herstelroutes"><Link href="/">Naar home <ArrowRight /></Link><Link href="/sporten">Bekijk sporten <ArrowRight /></Link><Link href="/contact">Neem contact op <ArrowRight /></Link></nav></main>;
}
