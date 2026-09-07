# SEO implementation report

Implemented on 7 September 2026.

## Information architecture

- Canonical conversion route: `/gratis-persoonlijke-intake`; the old `/mijn-eerste-bezoek` route permanently redirects.
- Canonical personal-training route: `/personal-training`; `/sporten/personal-training` permanently redirects.
- Canonical editorial hub: `/kennisbank`; `/blog` and legacy article URLs permanently redirect.
- Legacy migrations are configured at the Next.js server layer and verified as HTTP 308 responses with exact `Location` headers.
- New intent pages: `/ooievaarspas`, `/openingstijden`, `/team`, `/topsport-en-ntc`, `/veelgestelde-vragen`, `/in-de-media/rond-de-haven-2026`.
- Header remains compact; the grouped footer exposes deeper Starten, Trainen, De club and Praktisch routes.

## Metadata and indexing

- Every indexable route has a distinct title, description and canonical.
- Article metadata uses Open Graph `article`, route-specific imagery and publication/modification dates.
- `/ledenapp`, `/inloggen`, `/ledenportaal/*` and `/backoffice/*` are noindex and absent from the sitemap.
- Redirect-only legacy routes are absent from the sitemap.
- Sitemap is generated from canonical static routes, the programme inventory (excluding the redirect) and central articles.
- Robots explicitly disallows authentication and demo surfaces.

## Structured data

- Homepage: `ExerciseGym` with official business details, `foundingDate: 1998`, all seven central opening-hour specifications and exactly four price-free `Service` offers.
- FAQ page: visible FAQ items and matching `FAQPage` data.
- Knowledge articles: `Article` data with dates, canonical page, image and self-contained organisation publisher.
- Editorial and article routes: `BreadcrumbList` matching visible breadcrumbs where implemented.
- No rating, review, price, geo-coordinate, NOC*NSF affiliation, award or credential has been invented.
- Rendered JSON-LD is parsed in browser QA and its central product/hour counts are asserted.

## Content clusters and internal links

- Local intent: Scheveningen, Havenkwartier and Den Haag are used naturally in page titles, introductions and contextual copy.
- Start cluster connects products, free intake, Ooievaarspas, FAQ and contact.
- Expertise cluster connects personal training, strength disciplines, team, topsport principles and knowledge articles.
- Story cluster connects homepage, since-1998 narrative, media summary and team.
- Links use descriptive labels; protected or unknown facts are not used as keyword bait.

## Editorial safeguards

The knowledge base contains nine substantive Dutch articles and avoids medical, guaranteed-result and unverified endorsement claims. Affiliate placement is restricted to a relevant knowledge context and strength-training content, and produces no output without an approved URL and flag.
