import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { posts } from "@/lib/site-data";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Kennisbank", "Praktische artikelen over krachttraining, herstel en trainingsopbouw van Absolutely Fit.", "/blog");

function postImageSize(src: string): [number, number] {
  return src.endsWith("community-training.webp") ? [1919, 820] : [1536, 1024];
}

export default function BlogPage() {
  const lead = posts[0];
  return (
    <main>
      <section className="blog-hero shell-wide">
        <div className="blog-hero__copy"><span className="eyebrow">Blog & kennisbank</span><h1 className="display">Kennis voor op de trainingsvloer.</h1><p>Heldere uitleg over trainen, herstellen en vooruitgang boeken. Praktisch, nuchter en toepasbaar op jouw niveau.</p></div>
        <Link href={`/blog/${lead.slug}`} className="blog-feature">
          <div className="blog-feature__image"><Image src={lead.image} alt="Detail van krachttraining met een halter" width={1536} height={1024} sizes="(max-width: 760px) 100vw, 48vw" /></div>
          <div><span>{lead.category} · {lead.readTime}</span><h2>{lead.title}</h2><p>{lead.intro}</p><strong>Lees het hoofdartikel <ArrowRight aria-hidden="true" /></strong></div>
        </Link>
      </section>

      <nav className="topic-rail" aria-label="Onderwerpen in de kennisbank"><div className="shell">{posts.map((post, index) => <Link href={`#artikel-${post.slug}`} key={post.slug}><span><i>0{index + 1}</i>{post.category}</span></Link>)}</div></nav>

      <section className="section shell article-index">
        <div className="article-index__heading"><span className="eyebrow">Nieuw uit de club</span><h2 className="display">Lees. Leer. Train verder.</h2></div>
        <div className="article-lines">
          {posts.map((post, index) => { const [width, height] = postImageSize(post.image); return <article id={`artikel-${post.slug}`} key={post.slug}>
            <Link href={`/blog/${post.slug}`}>
              <span className="article-lines__number">0{index + 1}</span>
              <div className="article-lines__image"><Image src={post.image} alt="" width={width} height={height} sizes="(max-width: 760px) 34vw, 18vw" /></div>
              <div className="article-lines__copy"><small>{post.category} · {post.readTime}</small><h3>{post.title}</h3><p>{post.intro}</p></div>
              <ArrowRight aria-hidden="true" />
            </Link>
          </article>; })}
        </div>
      </section>

      <section className="knowledge-principle shell-wide">
        <Image src="/images/community-training.webp" alt="Leden trainen samen op de fitnessvloer" width={1919} height={820} sizes="(max-width: 760px) 100vw, 52vw" />
        <div><span className="eyebrow eyebrow--light">Onze visie op kennis</span><h2 className="display display--light">Begrijpen wat je doet maakt trainen beter.</h2><p>Goede informatie geeft je geen snelle oplossing, maar helpt je betere keuzes maken. In de club vertalen we theorie altijd naar wat jij vandaag kunt doen.</p><Link href="/begeleiding" className="text-link text-link--light">Ontdek onze begeleiding <ArrowRight aria-hidden="true" /></Link></div>
      </section>
    </main>
  );
}
