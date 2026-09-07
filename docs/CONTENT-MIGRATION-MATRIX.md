# Content migration matrix

Baseline: repository at `e4d5140913541406481bd86969b35666ee5cda10`, audited 7 September 2026. The attached expansion prompt is the primary source for current commercial facts. Unknown details remain `needsConfirmation`.

| Element or claim | Previous location / wording | Action | New source | Final location |
|---|---|---|---|---|
| Products | `/abonnementen`: Vrij trainen, Begeleid trainen, Personal coaching | Remove and replace | Expansion prompt §3/§8 | `lib/content/memberships.ts`, `/abonnementen`, intake, portal, backoffice |
| Product count | Three local cards and a three-column comparison | Replace with exactly four | Expansion prompt | `MembershipComparison` and central `memberships` |
| Opening hours | `/rooster`: weekdays 08:15–22:00, weekend 08:30–15:00 | Remove | Expansion prompt §3/§12 | `lib/content/opening-hours.ts`; site, footer, contact, roster, FAQ, portal and backoffice consume it |
| First conversion | “Mijn eerste bezoek”, “kennismaking”, sometimes “vrijblijvend” | Rewrite | Expansion prompt §7 | `/gratis-persoonlijke-intake`, wizard, header, footer and contextual CTAs |
| Legacy intake URL | `/mijn-eerste-bezoek` | Preserve as redirect | SEO migration decision | Permanent redirect to `/gratis-persoonlijke-intake` |
| Personal training | Thin dynamic programme page | Expand and canonicalise | Confirmed service in prompt | `/personal-training`; old programme route redirects |
| Ooievaarspas | Vague “mogelijkheden” copy | Expand and specify safely | Prompt + official municipality/offer links | Dedicated page, product page, homepage, FAQ, intake and contact subject |
| Ooievaarspas product eligibility | Implied without product mapping | Mark unknown | Prompt | `ooievaarspasEligibility: "unknown"` per product |
| Club age | Missing | Add | Prompt/article direction | “Sinds 1998” on homepage, story, team, metadata and JSON-LD |
| Club story | Short generic copy | Expand and paraphrase | Rond de Haven direction supplied in prompt | Homepage, `/over-ons`, media page and knowledge article |
| Championship/Olympic claims | Homepage, Over ons and Begeleiding contained specific world/Dutch champion and Olympic-athlete claims | Remove from public marketing copy | Rights gate in prompt | General, transparent performance-sport wording; exact claims in facts register only |
| Recognised training-company claim | `/over-ons`: “Erkend leerbedrijf” | Remove pending evidence | Rights gate | Not published |
| Coach tenure and athlete claims | `/begeleiding`: 15 years and national/international athletes | Remove | Rights gate | General team method; owner-approved identity only |
| NTC/NOC*NSF | No previous component | Add a safe textual fallback | Prompt + official context | `TrustCredentialCard`, `/topsport-en-ntc`, no protected mark |
| XXL Nutrition | No previous placement | Build gated component | Prompt + official affiliate programme | Component exists but renders nothing without approved HTTPS URL and approval flag |
| Blog | `/blog` with three articles | Expand and migrate | SEO/content strategy | `/kennisbank` with nine articles; old URLs permanently redirect |
| Public demo indexing | `/ledenapp` was indexable and in sitemap | Correct | Prompt technical SEO rules | `noindex`, robots disallow, excluded from sitemap |
| Member status | Backoffice “Pauze” | Remove | No holiday/freeze programme | Neutral fictive `Inactief` status |
| Demo booking label | “Mijn eerste bezoek” | Rewrite | Intake terminology | “Gratis persoonlijke intake” in fixtures and demo UI |

## Project-wide absence audit

No public sauna, solarium, sunbed, wellness, club supplement sales, managed nutrition service, holiday freeze, confirmed holiday-opening, unverified prices or contract terms are intentionally retained. Generic educational references to recovery do not represent a club service. Affiliate copy explicitly describes an external merchant and is hidden by default.
