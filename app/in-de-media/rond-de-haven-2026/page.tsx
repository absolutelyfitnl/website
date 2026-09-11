import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { Breadcrumbs, FreeIntakeCTA, SourceNote } from "@/components/content-sections";
import { StructuredData } from "@/components/structured-data";
import { clubStory } from "@/lib/content/claims";
import { breadcrumbStructuredData } from "@/lib/structured-data";
import { pageMetadata } from "@/lib/metadata";

const breadcrumbs = [{ label: "Home", href: "/" }, { label: "Over ons", href: "/over-ons" }, { label: "Rond de Haven 2026", href: "/in-de-media/rond-de-haven-2026" }] as const;

export const metadata = pageMetadata("Absolutely Fit in Rond de Haven 2026", "Lees het verhaal over Absolutely Fit in Rond de Haven, zomer 2026, en ontdek de familieclub sinds 2008.", "/in-de-media/rond-de-haven-2026");

export default function MediaArticlePage() {
  return <main className="media-story-page">
    <StructuredData data={breadcrumbStructuredData(breadcrumbs)} />
    <div className="shell"><Breadcrumbs items={breadcrumbs} /></div>
    <article><header className="media-story-page__hero shell"><span className="eyebrow">In de media · clubverhaal</span><h1 className="display">Een vaste trainingsplek in het Havenkwartier sinds 2008.</h1><p>Rond de Haven besteedde in de zomer van 2026 aandacht aan de geschiedenis, persoonlijke sfeer en trainingsfilosofie van Absolutely Fit.</p></header><figure className="media-story-page__cover shell-wide"><Image src="/images/club-exterior.webp" alt="De entree van Absolutely Fit aan de Doctor Lelykade" width={1536} height={1152} sizes="(max-width: 760px) 100vw, 88vw" /><figcaption>Absolutely Fit aan de Doctor Lelykade</figcaption></figure><div className="article-layout shell"><aside><span className="eyebrow">Samengevat</span><a href="#familieclub">01 · Familieclub</a><a href="#trainingsvisie">02 · Trainingsvisie</a><a href="#ontmoetingsplek">03 · Ontmoetingsplek</a></aside><div className="article-body"><section id="familieclub"><span>01</span><h2>Een familiegedreven club</h2><p>{clubStory.publicSummary}</p><p>Het verhaal laat zien hoe dagelijkse betrokkenheid en een gastvrije ontvangst samen kunnen gaan met serieus trainen.</p></section><section id="trainingsvisie"><span>02</span><h2>Kleine stappen en realistische doelen</h2><p>De trainingsfilosofie is nuchter: eerst begrijpen wat bij iemand past, de techniek rustig opbouwen en ontwikkeling de tijd geven.</p><ul><li><Check aria-hidden="true" />Aandacht voor het individuele startpunt</li><li><Check aria-hidden="true" />Plezier en continuïteit in trainen</li><li><Check aria-hidden="true" />Kennis begrijpelijk delen</li></ul></section><section id="ontmoetingsplek"><span>03</span><h2>Sport verbindt verschillende mensen</h2><p>De clubvloer brengt mensen met verschillende achtergronden, beroepen en trainingsniveaus samen. Niet iedereen volgt hetzelfde plan, maar iedereen moet zich welkom kunnen voelen om te beginnen.</p></section><SourceNote>Bron: <cite>Rond de Haven</cite>, zomer 2026, pagina 6.</SourceNote><p><Link className="text-link" href="/over-ons">Lees het volledige clubverhaal <ArrowRight aria-hidden="true" /></Link></p></div></div></article>
    <section className="section shell"><FreeIntakeCTA /></section>
  </main>;
}
