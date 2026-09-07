import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FreeIntakeCTA } from "@/components/content-sections";
import { StructuredData } from "@/components/structured-data";
import { frequentlyAskedQuestions } from "@/lib/content/faq";
import { faqStructuredData } from "@/lib/structured-data";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Veelgestelde vragen over Absolutely Fit", "Actuele antwoorden over de gratis intake, abonnementen, personal training, openingstijden en Ooievaarspas bij Absolutely Fit.", "/veelgestelde-vragen");

export default function FrequentlyAskedQuestionsPage() {
  const categories = [...new Set(frequentlyAskedQuestions.map((item) => item.category))];
  return <main className="faq-page">
    <StructuredData data={faqStructuredData} />
    <section className="faq-page__hero shell-wide"><div><span className="eyebrow eyebrow--light">Veelgestelde vragen</span><h1 className="display display--light">Duidelijke antwoorden voordat je begint.</h1><p>Over de gratis intake, vier productmogelijkheden, begeleiding, openingstijden en de Ooievaarspas.</p></div><HelpCircle aria-hidden="true" /></section>
    <section className="section shell faq-page__layout"><nav aria-label="FAQ-onderwerpen">{categories.map((category) => <a href={`#${category.toLowerCase().replaceAll(" ", "-")}`} key={category}>{category}</a>)}</nav><div>{categories.map((category) => <section id={category.toLowerCase().replaceAll(" ", "-")} key={category}><span className="eyebrow">{category}</span><Accordion type="single" collapsible>{frequentlyAskedQuestions.filter((item) => item.category === category).map((item, index) => <AccordionItem value={`${category}-${index}`} key={item.question}><AccordionTrigger>{item.question}</AccordionTrigger><AccordionContent><p>{item.answer}</p><Link href={item.href}>Ga naar {item.category.toLowerCase()}informatie <ArrowRight aria-hidden="true" /></Link></AccordionContent></AccordionItem>)}</Accordion></section>)}</div></section>
    <section className="section shell"><FreeIntakeCTA title="Staat je vraag er niet bij?" text="Plan je gratis persoonlijke intake of neem rechtstreeks contact op met de club." /></section>
  </main>;
}
