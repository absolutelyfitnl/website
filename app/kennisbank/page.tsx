import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { FreeIntakeCTA } from "@/components/content-sections";
import { Reveal } from "@/components/reveal";
import { articleImageSize, posts } from "@/lib/content/articles";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Kennisbank over fitness en krachttraining", "Praktische artikelen over beginnen met krachttraining, trainingsritme, begeleiding, Ooievaarspas en de club in Scheveningen.", "/kennisbank");

export default function KnowledgeBasePage() {
  const lead = posts[0];
  const [leadWidth, leadHeight] = articleImageSize(lead.image);
  return <main className="knowledge-page">
    <section className="blog-hero shell-wide"><div className="blog-hero__copy"><span className="eyebrow">Kennisbank · Absolutely Fit</span><h1 className="display">Train met meer begrip.</h1><p>Heldere informatie over beginnen, kracht opbouwen, begeleiding en de praktische kant van sporten in Scheveningen.</p></div><Link href={`/kennisbank/${lead.slug}`} className="blog-feature"><div className="blog-feature__image"><Image src={lead.image} alt="Sporters bouwen samen aan een trainingsritme" width={leadWidth} height={leadHeight} sizes="(max-width: 760px) 100vw, 48vw" /></div><div><span>{lead.category} · {lead.readTime}</span><h2>{lead.title}</h2><p>{lead.intro}</p><strong>Lees het hoofdartikel <ArrowRight aria-hidden="true" /></strong></div></Link></section>
    <nav className="topic-rail" aria-label="Onderwerpen in de kennisbank"><div className="shell">{posts.slice(0, 6).map((post, index) => <Link href={`#artikel-${post.slug}`} key={post.slug}><span><i>{String(index + 1).padStart(2, "0")}</i>{post.category}</span></Link>)}</div></nav>
    <Reveal as="section" className="section shell article-index"><div className="article-index__heading"><span className="eyebrow">Praktisch en nuchter</span><h2 className="display">Lees. Begrijp. Bouw verder.</h2></div><div className="article-lines">{posts.map((post, index) => { const [width, height] = articleImageSize(post.image); return <article id={`artikel-${post.slug}`} key={post.slug}><Link href={`/kennisbank/${post.slug}`}><span className="article-lines__number">{String(index + 1).padStart(2, "0")}</span><div className="article-lines__image"><Image src={post.image} alt="" width={width} height={height} sizes="(max-width: 760px) 34vw, 18vw" /></div><div className="article-lines__copy"><small>{post.category} · {post.readTime}</small><h3>{post.title}</h3><p>{post.intro}</p></div><ArrowRight aria-hidden="true" /></Link></article>; })}</div></Reveal>
    <Reveal as="section" className="knowledge-principle shell-wide"><Image src="/images/hero-coaching.webp" alt="Een coach geeft uitleg tijdens een training" width={1672} height={941} sizes="(max-width: 760px) 100vw, 52vw" /><div><span className="eyebrow eyebrow--light">Onze visie op kennis</span><h2 className="display display--light">Informatie wordt bruikbaar wanneer ze past bij jouw startpunt.</h2><p>Algemene artikelen geven richting. Tijdens een gratis persoonlijke intake vertalen we vragen naar jouw ervaring, planning en gewenste begeleiding.</p><Link href="/gratis-persoonlijke-intake" className="text-link text-link--light">Bereid je gratis intake voor <ArrowRight aria-hidden="true" /></Link></div></Reveal>
    <section className="section shell"><FreeIntakeCTA compact /></section>
  </main>;
}
