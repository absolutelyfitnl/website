import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Medal } from "lucide-react";
import { FreeIntakeCTA, TrustCredentialCard } from "@/components/content-sections";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Topsportkennis uit eigen krachtsportgeschiedenis", "Lees hoe Absolutely Fit eigen krachtsportprestaties en trainingsprincipes vertaalt naar ieder niveau.", "/topsport-en-ntc");

export default function TopsportAndNtcPage() {
  return <main>
    <PageHero eyebrow="Topsportkennis · eigen krachtsportgeschiedenis" title={<>Sterke principes, passend gemaakt voor ieder niveau.</>} intro="Ervaring uit kracht- en prestatiesport krijgt pas waarde wanneer de aanpak begrijpelijk, realistisch en persoonlijk wordt toegepast." image="/images/strength-detail.webp" imageAlt="Halterschijven en een halterstang op de trainingsvloer" />
    <Reveal as="section" className="section shell performance-principles"><div><span className="eyebrow">Van praktijk naar jouw plan</span><h2 className="display">Niet het programma kopiëren, wel de principes begrijpen.</h2></div><div>{[["01", "Doelgericht", "Weten welke aanpassing je wilt bereiken en waarom die relevant is."], ["02", "Doseerbaar", "Belasting kiezen die bij je ervaring, techniek en week past."], ["03", "Meetbaar", "Ontwikkeling volgen met maten die voor jouw doel betekenis hebben."], ["04", "Aanpasbaar", "Evalueren en één keuze tegelijk bijstellen wanneer dat nodig is."]].map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p><Check aria-hidden="true" /></article>)}</div></Reveal>
    <section className="section shell"><TrustCredentialCard /></section>
    <Reveal as="section" className="section shell ntc-proof-status">
      <header className="ntc-proof-status__header"><div className="ntc-proof-status__logo"><Image src="/partners/noc-nsf-full-color.svg" alt="NOC*NSF" width={102} height={90} sizes="102px" /></div><span><strong>Topsportervaring</strong><em>Van wedstrijdvloer naar clubvloer</em></span><Medal aria-hidden="true" /></header>
      <div className="ntc-proof-status__body"><div><span className="eyebrow">Bevestigde clubgeschiedenis</span><h2>Een sterk sportverleden, helder verteld.</h2><p>Rik Priester senior werd meervoudig Nederlands kampioen en in 1990 wereldkampioen powerliften. Het team begeleidde daarnaast mensen van hun eerste serieuze training tot Nederlandse kampioenen, internationale topsporters en Olympische atleten.</p></div><ul aria-label="Historische prestaties"><li><span>1990</span><strong>Wereldtitel powerliften</strong><small>Rik Priester senior</small></li><li><span>Meervoudig</span><strong>Nederlands kampioen</strong><small>Eigen krachtsportervaring</small></li><li><span>Breed niveau</span><strong>Van starter tot topsporter</strong><small>Persoonlijk toegepast</small></li></ul></div>
      <a href="https://www.nocnsf.nl/en/elite-sports-in-the-netherlands/national-training-centres" target="_blank" rel="noopener noreferrer">Lees meer over topsport bij NOC*NSF <ArrowRight aria-hidden="true" /></a>
    </Reveal>
    <Reveal as="section" className="utility-band"><div className="shell two-column"><h2 className="display">Trainingskennis wordt persoonlijk in de toepassing.</h2><div><p>Bekijk hoe krachttraining, powerlifting, gewichtheffen en personal training vanuit dezelfde rustige basis worden opgebouwd.</p><div className="inline-links"><Link href="/sporten/krachttraining">Krachttraining</Link><Link href="/sporten/powerlifting-gewichtheffen">Powerlifting & gewichtheffen</Link><Link href="/personal-training">Personal training</Link></div></div></div></Reveal>
    <section className="section shell"><FreeIntakeCTA /></section>
  </main>;
}
