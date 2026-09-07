import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { FreeIntakeCTA, TrustCredentialCard } from "@/components/content-sections";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { trustCredential } from "@/lib/content/claims";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Topsportkennis en NTC-bewijsstatus", "Lees hoe Absolutely Fit trainingsprincipes uit kracht- en prestatiesport vertaalt, met transparantie over de nog te verifiëren NTC-status.", "/topsport-en-ntc");

export default function TopsportAndNtcPage() {
  return <main>
    <PageHero eyebrow="Topsportkennis · transparante bewijsstatus" title={<>Sterke principes, passend gemaakt voor ieder niveau.</>} intro="Ervaring uit kracht- en prestatiesport krijgt pas waarde wanneer de aanpak begrijpelijk, realistisch en persoonlijk wordt toegepast." image="/images/strength-detail.webp" imageAlt="Halterschijven en een halterstang op de trainingsvloer" />
    <Reveal as="section" className="section shell performance-principles"><div><span className="eyebrow">Van praktijk naar jouw plan</span><h2 className="display">Niet het programma kopiëren, wel de principes begrijpen.</h2></div><div>{[["01", "Doelgericht", "Weten welke aanpassing je wilt bereiken en waarom die relevant is."], ["02", "Doseerbaar", "Belasting kiezen die bij je ervaring, techniek en week past."], ["03", "Meetbaar", "Ontwikkeling volgen met maten die voor jouw doel betekenis hebben."], ["04", "Aanpasbaar", "Evalueren en één keuze tegelijk bijstellen wanneer dat nodig is."]].map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p><Check aria-hidden="true" /></article>)}</div></Reveal>
    <section className="section shell"><TrustCredentialCard /></section>
    <Reveal as="section" className="section shell ntc-proof-status"><div><ShieldCheck aria-hidden="true" /><span><strong>Huidige publicatiestatus</strong><em>{trustCredential.status === "needsConfirmation" ? "Verificatie vereist" : "Geverifieerd"}</em></span></div><h2>Geen beschermd logo of specifieke erkenningsclaim zonder bewijs.</h2><p>De exacte officiële naam, uitgevende instantie, scope, geldigheid en toestemming voor logo-/merkgebruik zijn nog niet volledig geregistreerd. Daarom doet deze pagina geen specifieke NOC*NSF-certificeringsclaim en toont zij geen NOC*NSF- of Olympisch beeldmerk.</p><a href="https://www.nocnsf.nl/en/elite-sports-in-the-netherlands/national-training-centres" target="_blank" rel="noopener noreferrer">Lees de officiële NOC*NSF-context over National Training Centres <ArrowRight aria-hidden="true" /></a></Reveal>
    <Reveal as="section" className="utility-band"><div className="shell two-column"><h2 className="display">Trainingskennis wordt persoonlijk in de toepassing.</h2><div><p>Bekijk hoe krachttraining, powerlifting, gewichtheffen en personal training vanuit dezelfde rustige basis worden opgebouwd.</p><div className="inline-links"><Link href="/sporten/krachttraining">Krachttraining</Link><Link href="/sporten/powerlifting-gewichtheffen">Powerlifting & gewichtheffen</Link><Link href="/personal-training">Personal training</Link></div></div></div></Reveal>
    <section className="section shell"><FreeIntakeCTA /></section>
  </main>;
}
