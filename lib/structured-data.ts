import type { KnowledgeArticle } from "@/lib/content/articles";
import { frequentlyAskedQuestions } from "@/lib/content/faq";
import { memberships } from "@/lib/content/memberships";
import { openingDays, openingHours } from "@/lib/content/opening-hours";
import { contact, site } from "@/lib/content/site";

export const exerciseGymStructuredData = {
  "@context": "https://schema.org",
  "@type": "ExerciseGym",
  "@id": `${site.productionUrl}/#club`,
  name: site.name,
  url: site.productionUrl,
  description: site.description,
  foundingDate: site.foundingDate,
  telephone: contact.phoneHref,
  email: contact.email,
  logo: `${site.productionUrl}/brand/absolutely-fit-lockup.svg`,
  image: `${site.productionUrl}/images/absolutely-fit-hero-cable-coaching.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.streetAddress,
    postalCode: site.address.postalCode,
    addressLocality: site.address.addressLocality,
    addressCountry: site.address.addressCountry,
  },
  openingHoursSpecification: openingDays.flatMap(({ key, schemaDay }) => openingHours[key].map((range) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: schemaDay,
    opens: range.opens,
    closes: range.closes,
  }))),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Trainingsproducten",
    itemListElement: memberships.map((membership) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: membership.name,
        description: membership.summary,
      },
    })),
  },
} as const;

export const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: frequentlyAskedQuestions.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
} as const;

export function breadcrumbStructuredData(items: readonly { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: new URL(item.href, site.productionUrl).toString(),
    })),
  };
}

export function articleStructuredData(article: KnowledgeArticle) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.intro,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: "nl-NL",
    mainEntityOfPage: `${site.productionUrl}/kennisbank/${article.slug}`,
    image: new URL(article.image, site.productionUrl).toString(),
    author: { "@type": "Organization", name: site.name, url: site.productionUrl },
    publisher: { "@type": "Organization", name: site.name, url: site.productionUrl, logo: `${site.productionUrl}/brand/absolutely-fit-lockup.svg` },
  };
}
