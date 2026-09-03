import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { posts } from "@/lib/site-data";
import { pageMetadata } from "@/lib/metadata";

type Article = {
  title: string;
  intro: string;
  sections: Array<{ heading: string; paragraphs: string[]; points?: string[] }>;
  takeaway: string;
};

function postImageSize(src: string): [number, number] {
  return src.endsWith("community-training.webp") ? [1919, 820] : [1536, 1024];
}

const articles: Record<string, Article> = {
  "sterker-worden-begint-met-techniek": {
    title: "Sterker worden begint met techniek",
    intro: "Een goede uitvoering is geen keurmerk voor een perfecte herhaling. Het is een manier om kracht doelgericht op te bouwen en te begrijpen wat jouw lichaam tijdens een oefening nodig heeft.",
    sections: [
      { heading: "Techniek is een middel", paragraphs: ["Bij krachttraining is techniek er om de beweging herhaalbaar en passend te maken. De beste uitvoering is daarom niet voor iedereen exact hetzelfde. Lichaamsbouw, ervaring, mobiliteit en doel spelen allemaal mee.", "Een bruikbare techniek geeft je controle over het gewicht, houdt de belasting op de bedoelde plekken en laat ruimte om geleidelijk zwaarder te trainen."] },
      { heading: "Eerst controle, dan gewicht", paragraphs: ["Meer gewicht toevoegen is pas waardevol wanneer je de beweging onder controle houdt. Begin met een belasting waarbij je de startpositie, het tempo en de eindpositie bewust kunt uitvoeren."], points: ["Kies een stabiele startpositie", "Houd het tempo beheerst", "Stop wanneer de uitvoering duidelijk verandert"] },
      { heading: "Feedback versnelt het leren", paragraphs: ["Een spiegel of video kan helpen, maar gerichte feedback van een coach maakt vaak sneller duidelijk wat je voelt en wat er werkelijk gebeurt. Eén concrete aanwijzing per set werkt meestal beter dan vijf correcties tegelijk.", "Goed bewegen is een vaardigheid. Die ontwikkel je door aandachtige herhaling, niet door te wachten tot elke herhaling perfect voelt."] },
    ],
    takeaway: "Bouw je oefeningen op vanuit controle. Een gewicht dat je goed kunt sturen is de snelste route naar kracht die blijft.",
  },
  "waarom-herstel-bij-training-hoort": {
    title: "Waarom herstel bij training hoort",
    intro: "Training geeft je lichaam een prikkel. Tijdens herstel verwerkt het die prikkel. Beide horen bij hetzelfde plan als je sterker, fitter en belastbaarder wilt worden.",
    sections: [
      { heading: "Vooruitgang gebeurt tussen trainingen", paragraphs: ["Een zware training voelt productief, maar meer is niet automatisch beter. Je lichaam heeft tijd nodig om energie aan te vullen, weefsel te herstellen en zich aan de belasting aan te passen.", "Hoeveel herstel je nodig hebt, hangt onder meer af van trainingsniveau, slaap, werkstress, voeding en de zwaarte van je programma."] },
      { heading: "Let op patronen", paragraphs: ["Een mindere training is normaal. Wanneer vermoeidheid, slechter slapen en teruglopende prestaties zich opstapelen, is dat informatie. Je programma kan dan tijdelijk minder volume of intensiteit nodig hebben."], points: ["Slaap zo regelmatig mogelijk", "Plan rustige dagen bewust", "Eet voldoende voor je trainingsbelasting"] },
      { heading: "Rust is niet hetzelfde als niets doen", paragraphs: ["Wandelen, rustig fietsen of lichte mobiliteit kan prettig zijn op een hersteldag. Het doel is niet om alsnog een zware sessie te creëren, maar om bewegen makkelijk te laten voelen.", "Een goed schema houdt rekening met herstel voordat vermoeidheid een probleem wordt."] },
    ],
    takeaway: "Plan herstel net zo bewust als je trainingen. Consistent trainen wordt makkelijker wanneer je niet elke sessie maximaal hoeft te maken.",
  },
  "zo-bouw-je-een-trainingsschema-op": {
    title: "Zo bouw je een trainingsschema op",
    intro: "Een bruikbaar trainingsschema begint niet bij een lijst oefeningen, maar bij een helder doel, een realistische week en een opbouw die je kunt volhouden.",
    sections: [
      { heading: "Begin bij je week", paragraphs: ["Bepaal hoeveel momenten je meestal echt beschikbaar hebt. Twee consistente trainingen leveren meer op dan een vijfdaags schema dat na twee weken niet meer past.", "Kijk vervolgens hoeveel herstelruimte er tussen de belangrijkste sessies zit en welke dagen praktisch het meest betrouwbaar zijn."] },
      { heading: "Kies de hoofdzaken", paragraphs: ["Selecteer bewegingen die passen bij je doel en die je technisch goed kunt uitvoeren. Zorg dat het programma als geheel de belangrijkste bewegingspatronen en spiergroepen voldoende aandacht geeft."], points: ["Koppel oefeningen aan je doel", "Beperk onnodige variatie", "Noteer sets, herhalingen en belasting"] },
      { heading: "Maak vooruitgang meetbaar", paragraphs: ["Progressie kan meer gewicht zijn, maar ook een extra herhaling, een betere uitvoering of dezelfde training met minder vermoeidheid. Kies vooraf wat je wilt volgen.", "Evalueer na enkele weken. Wat goed werkt hoeft niet veranderd te worden; wat structureel niet lukt vraagt om een kleinere stap of een andere keuze."] },
    ],
    takeaway: "Het beste schema is duidelijk genoeg om richting te geven en flexibel genoeg om in je echte leven te blijven werken.",
  },
};

export function generateStaticParams() { return posts.map(({ slug }) => ({ slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  return post ? pageMetadata(post.title, post.intro, `/blog/${post.slug}`) : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  const article = articles[slug];
  if (!post || !article) notFound();
  const related = posts.filter((item) => item.slug !== slug).slice(0, 2);
  const [coverWidth, coverHeight] = postImageSize(post.image);

  return (
    <main>
      <article>
        <header className="article-hero shell">
          <Link href="/blog" className="back-link"><ArrowLeft aria-hidden="true" />Alle artikelen</Link>
          <div className="article-hero__meta"><span>{post.category}</span><span>{post.readTime} leestijd</span></div>
          <h1 className="display">{article.title}</h1>
          <p>{article.intro}</p>
        </header>
        <figure className="article-cover shell-wide"><Image src={post.image} alt={post.title} width={coverWidth} height={coverHeight} sizes="(max-width: 760px) 100vw, 90vw" /><figcaption>Praktische kennis uit de trainingsvloer van Absolutely Fit.</figcaption></figure>
        <div className="article-layout shell">
          <aside><span className="eyebrow">In dit artikel</span>{article.sections.map((section, index) => <a href={`#deel-${index + 1}`} key={section.heading}><span>0{index + 1}</span>{section.heading}</a>)}</aside>
          <div className="article-body">
            {article.sections.map((section, index) => <section id={`deel-${index + 1}`} key={section.heading}><span>0{index + 1}</span><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.points && <ul>{section.points.map((point) => <li key={point}><Check aria-hidden="true" />{point}</li>)}</ul>}</section>)}
            <blockquote><span>Onthoud dit</span><p>{article.takeaway}</p></blockquote>
            <p className="article-disclaimer">Dit artikel geeft algemene trainingsinformatie. Persoonlijke omstandigheden kunnen om een andere aanpak vragen. Bespreek twijfels of klachten met een passende professional.</p>
          </div>
        </div>
      </article>

      <section className="section shell related-articles"><span className="eyebrow">Lees verder</span><h2 className="display">Meer uit de kennisbank.</h2><div>{related.map((item) => { const [width, height] = postImageSize(item.image); return <Link href={`/blog/${item.slug}`} key={item.slug}><Image src={item.image} alt="" width={width} height={height} sizes="(max-width: 760px) 100vw, 42vw" /><small>{item.category} · {item.readTime}</small><h3>{item.title}</h3><span>Lees artikel <ArrowRight aria-hidden="true" /></span></Link>; })}</div></section>
    </main>
  );
}
