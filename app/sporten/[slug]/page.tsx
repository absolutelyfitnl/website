import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { programs } from "@/lib/site-data";
import { pageMetadata } from "@/lib/metadata";

export function generateStaticParams() { return programs.map(({ slug }) => ({ slug })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const program = programs.find((item) => item.slug === slug); return program ? pageMetadata(program.label, program.intro, `/sporten/${program.slug}`) : {}; }

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = programs.find((item) => item.slug === slug);
  if (!program) notFound();
  const image = slug === "cardio-conditie" ? "/images/cardio-sunrise.jpg" : slug === "strength-conditioning" ? "/images/community-training.webp" : "/images/strength-detail.webp";
  return <main>
    <PageHero eyebrow={`${program.number} — Training`} title={program.label} intro={program.intro} image={image} imageAlt={program.label} parentHref="/sporten" parentLabel="Alle sporten" variant="reverse" />
    <section className="section shell program-detail"><div><span className="eyebrow">Voor wie?</span><h2 className="display">Train met een duidelijke reden.</h2></div><div><p className="program-lead">{program.forWhom}</p><div className="program-points">{program.approach.map((item,index)=><div key={item}><span>0{index+1}</span><strong>{item}</strong><Check aria-hidden="true" /></div>)}</div></div></section>
    <section className="program-photo shell-wide"><Image src="/images/hero-coaching.webp" alt="Persoonlijke uitleg tijdens een training" width={1672} height={941} sizes="(max-width: 760px) 100vw, 58vw" /><div><span className="eyebrow eyebrow--light">Begeleiding wanneer jij die nodig hebt</span><h2 className="display display--light">Goed trainen begint met goed kijken.</h2><p>We helpen je de techniek te begrijpen, een passend startniveau te kiezen en stap voor stap verder te bouwen.</p></div></section>
    <section className="section shell program-cta"><h2 className="display">Past dit bij jouw doel?</h2><p>Bespreek je doel, ervaring en planning met het team. Dan weet je welke aanpak echt aansluit.</p><Button asChild className="button-primary button-large"><Link href="/contact">Kom kennismaken <ArrowRight aria-hidden="true" /></Link></Button></section>
  </main>;
}
