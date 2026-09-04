import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { TrainingRoute } from "@/components/training-route";
import { disciplines, programs } from "@/lib/site-data";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Sporten", "Ontdek fitness, krachttraining, powerlifting, personal training en Strength & Conditioning bij Absolutely Fit in Scheveningen.", "/sporten");

export default function SportenPage() {
  return <main>
    <PageHero eyebrow="Train op jouw manier" title={<>Alles wat je nodig hebt om te trainen.</>} intro="Iedereen komt met een ander doel binnen. Daarom kijken we niet alleen naar oefeningen, maar naar wat jij wilt bereiken, wat je al kunt en welke aanpak bij je leven past." image="/images/community-training.webp" imageAlt="Verschillende sporters trainen bij Absolutely Fit" />
    <Reveal as="section" className="section shell sports-index">
      <div className="sports-index__intro"><span className="eyebrow">Trainingsmogelijkheden</span><h2 className="display">Kies jouw richting.</h2><p>Je hoeft vooraf niet precies te weten welke trainingsvorm bij je past. Gebruik dit overzicht als startpunt; tijdens een kennismaking helpen we je verder.</p></div>
      <div className="sports-index__list">{programs.map((program) => <Link href={`/sporten/${program.slug}`} key={program.slug}><span>{program.number}</span><div><h3>{program.label}</h3><p>{program.intro}</p></div><ArrowRight aria-hidden="true" /></Link>)}</div>
    </Reveal>
    <Reveal as="section" className="sports-mosaic shell-wide"><div className="sports-mosaic__image"><Image src="/images/strength-detail.webp" alt="Vrije gewichten en krachttraining" width={1536} height={1024} sizes="(max-width: 760px) 100vw, 50vw" /></div><div className="sports-mosaic__copy"><span className="eyebrow eyebrow--light">Van basis tot prestatie</span><h2 className="display display--light">Beginnen zonder ervaring.</h2><p>Je hoeft niet fit te zijn om te beginnen. We helpen je vertrouwd te raken met de ruimte, apparatuur en belangrijkste bewegingen.</p><Button asChild className="button-light button-large"><Link href="/begeleiding">Bekijk onze begeleiding</Link></Button></div></Reveal>
    <Reveal as="section" className="section shell all-disciplines"><span className="eyebrow">Volledig aanbod</span><h2 className="display">Wat kun je bij ons doen?</h2><div>{disciplines.map((item,index)=><span key={item}><i>{String(index+1).padStart(2,"0")}</i>{item}</span>)}</div></Reveal>
    <section className="section shell"><TrainingRoute /></section>
  </main>;
}
