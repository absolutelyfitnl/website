import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { AffiliatePartnerCard, Breadcrumbs } from "@/components/content-sections";
import { StructuredData } from "@/components/structured-data";
import { articleImageSize, articles } from "@/lib/content/articles";
import { articleStructuredData, breadcrumbStructuredData } from "@/lib/structured-data";
import { pageMetadata } from "@/lib/metadata";

export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  return article ? pageMetadata(article.title, article.intro, `/kennisbank/${article.slug}`, {
    type: "article",
    image: article.image,
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
  }) : {};
}

export default async function KnowledgeArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  const related = articles.filter((item) => item.slug !== slug).slice(0, 2);
  const [coverWidth, coverHeight] = articleImageSize(article.image);
  const breadcrumbs = [{ label: "Home", href: "/" }, { label: "Kennisbank", href: "/kennisbank" }, { label: article.title, href: `/kennisbank/${article.slug}` }] as const;
  return <main>
    <StructuredData data={[articleStructuredData(article), breadcrumbStructuredData(breadcrumbs)]} />
    <article>
      <header className="article-hero shell"><Breadcrumbs items={breadcrumbs} /><Link href="/kennisbank" className="back-link"><ArrowLeft aria-hidden="true" />Alle artikelen</Link><div className="article-hero__meta"><span>{article.category}</span><span>{article.readTime} leestijd</span></div><h1 className="display">{article.title}</h1><p>{article.intro}</p></header>
      <figure className="article-cover shell-wide"><Image src={article.image} alt={article.title} width={coverWidth} height={coverHeight} sizes="(max-width: 760px) 100vw, 90vw" /><figcaption>Praktische kennis vanuit de trainingsvloer van Absolutely Fit.</figcaption></figure>
      <div className="article-layout shell"><aside><span className="eyebrow">In dit artikel</span>{article.sections.map((section, index) => <a href={`#deel-${index + 1}`} key={section.heading}><span>0{index + 1}</span>{section.heading}</a>)}</aside><div className="article-body">{article.sections.map((section, index) => <section id={`deel-${index + 1}`} key={section.heading}><span>0{index + 1}</span><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.points && <ul>{section.points.map((point) => <li key={point}><Check aria-hidden="true" />{point}</li>)}</ul>}</section>)}<blockquote><span>Onthoud dit</span><p>{article.takeaway}</p></blockquote><p className="article-disclaimer">Dit artikel geeft algemene trainingsinformatie en geen medisch of persoonlijk trainingsadvies. Bespreek klachten of twijfels met een passende professional.</p><p><Link className="text-link" href={article.relatedHref}>{article.relatedLabel} <ArrowRight aria-hidden="true" /></Link></p>{article.affiliatePlacement && <AffiliatePartnerCard placement="knowledge-article" />}</div></div>
    </article>
    <section className="section shell related-articles"><span className="eyebrow">Lees verder</span><h2 className="display">Meer uit de kennisbank.</h2><div>{related.map((item) => { const [width, height] = articleImageSize(item.image); return <Link href={`/kennisbank/${item.slug}`} key={item.slug}><Image src={item.image} alt="" width={width} height={height} sizes="(max-width: 760px) 100vw, 42vw" /><small>{item.category} · {item.readTime}</small><h3>{item.title}</h3><span>Lees artikel <ArrowRight aria-hidden="true" /></span></Link>; })}</div></section>
  </main>;
}
