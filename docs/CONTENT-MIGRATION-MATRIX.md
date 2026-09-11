# Content migration matrix

Baseline: repository at `e4d5140913541406481bd86969b35666ee5cda10`, audited 7 September 2026 and rights-updated 8 September 2026. The attached expansion prompt is the primary source for current commercial facts; the later owner confirmation authorises the named facts and visual assets. Details that were never supplied remain `needsConfirmation`.

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
| Club age | Missing | Add | Owner update | “Sinds 2008” on homepage, story, team, metadata and JSON-LD |
| Starting price | Missing | Add | Owner update | “Sporten vanaf € 24,50 per maand” in membership and start content |
| Intake policy | Generic free-intake copy | Clarify | Owner update | Included with certain memberships or Personal Training |
| Flexibility | Generic training copy | Clarify | Owner update | Individual free training or professional guidance across start and membership pages |
| Youth Ooievaarspas reimbursement | General 50% copy only | Add qualified youth condition | Owner update | 100% reimbursement under 18 when it is the first sport |
| Club story | Short generic copy | Expand and paraphrase | Rond de Haven direction supplied in prompt | Homepage, `/over-ons`, media page and knowledge article |
| Championship/top-level claims | Earlier pages contained specific world/Dutch champion and top-level-athlete claims | Restore after explicit approval | Owner confirmation of 8 September + earlier authorised copy | Central claims data, team/story and NTC context; no invented athlete endorsement |
| Recognised training-company claim | `/over-ons`: “Erkend leerbedrijf” | Remove pending evidence | Rights gate | Not published |
| Coach tenure and athlete claims | `/begeleiding`: 15 years and national/international athletes | Remove | Rights gate | General team method; owner-approved identity only |
| NTC/NOC*NSF | Text-only fallback with stale permission warning | Add the approved visual and remove public rights/certification caveats | Owner confirmation + official asset + explicit request not to advertise the certification | `TrustCredentialCard`, `/topsport-en-ntc`; approved mark and sport history in normal customer copy; credential advertising remains disabled internally |
| XXL Nutrition | Fully hidden gated component | Show approved neutral creative; keep affiliate action gated | Owner confirmation + supplied creative + official affiliate programme | Visual can render; tracked CTA still requires approved HTTPS URL and approval flag |
| Blog | `/blog` with three articles | Expand and migrate | SEO/content strategy | `/kennisbank` with nine articles; old URLs permanently redirect |
| Public demo indexing | `/ledenapp` was indexable and in sitemap | Correct | Prompt technical SEO rules | `noindex`, robots disallow, excluded from sitemap |
| Member status | Backoffice “Pauze” | Remove | No holiday/freeze programme | Neutral fictive `Inactief` status |
| Demo booking label | “Mijn eerste bezoek” | Rewrite | Intake terminology | “Gratis persoonlijke intake” in fixtures and demo UI |

## Project-wide absence audit

No public sauna, solarium, sunbed, wellness, club supplement sales, managed nutrition service, holiday freeze, confirmed holiday-opening, unverified prices or contract terms are intentionally retained. Generic educational references to recovery do not represent a club service. Affiliate copy explicitly describes an external merchant and is hidden by default.
