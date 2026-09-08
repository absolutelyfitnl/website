# Facts and rights register

Last reviewed: 8 September 2026. Official Ooievaarspas, municipality, NOC*NSF and XXL/Awin context pages were rechecked on 7 September. On 8 September the authorised owner explicitly confirmed the club facts and claims, logo/photo rights, portrait/model permissions and public website use. That production-task confirmation is recorded in `lib/content/publication-approvals.json`; it does not fill in facts that were never supplied.

| Fact, claim or asset | Source | Status | Permission / evidence | Public wording or action |
|---|---|---|---|---|
| Absolutely Fit exists since 1998 | Expansion prompt and article direction | Confirmed | Owner-supplied | “Sinds 1998” |
| Address, phone and email | Existing authorised repository | Confirmed for this release | Existing public business data | Central `site` and `contact` data |
| Four products: 1× per week, Onbeperkt trainen, 10-rittenkaart, Jeugd | Expansion prompt | Confirmed | Owner-supplied | Exact names only; no invented price or contract data |
| Personal training | Expansion prompt | Confirmed | Owner-supplied | Full service page; details discussed personally |
| Free personal intake | Expansion prompt | Confirmed | Owner-supplied | Always “gratis persoonlijke intake”; never presented as a free workout |
| Regular seven-day hours | Expansion prompt | Confirmed | Owner-supplied | Exact hours from `lib/content/opening-hours.ts` |
| Ooievaarspas: 50% discount on an eligible membership | Expansion prompt | Confirmed core claim | Owner-supplied; product mapping missing | Exact cautious claim; every product eligibility remains `unknown` |
| Rond de Haven, summer 2026, page 6 | Expansion prompt; original scan unavailable | Editorial source confirmed, source file unavailable | No integral republication right recorded | Own summary and attribution only; no scan or long quotation |
| Rik Priester as founder/coach | Article direction plus owner-authorised brief | Owner-approved identity/role/portrait | Owner confirmation of 8 September; existing repository portrait | Public profile and coach context |
| Henriëtte, Rik jr./Ricardo, René, Luc, recognisable athletes | Article direction | Rights confirmed; current role wording still incomplete | Name/portrait/model permissions confirmed on 8 September; precise current roles were not supplied | Not expanded until each current role can be stated accurately |
| 1983 Dutch championship / 1990 world championship | Article direction and earlier authorised site copy | Owner-approved historical claims | Owner confirmation of 8 September | Concise historical timeline/profile wording |
| National teams, beach volleyball and top-level athletes | Article direction and earlier authorised site copy | Owner-approved at claim/portrait level | Owner confirmation of 8 September | Generic experience-to-olympic-level wording; no endorsement quotation is invented |
| Military, BBE, diver, fire-service or teaching details | Article direction | Rights confirmed but editorially unnecessary | Owner confirmation of 8 September | Deliberately omitted from general marketing copy |
| Current NTC or NOC*NSF certification | Direct owner confirmation on 8 September 2026 | Existence owner-confirmed; deliberately not advertised | Exact credential fields are not stored because the owner explicitly does not want to market the certification | No certification claim, warning or technical rights explanation in the customer interface; the approved mark and club history stand on their own |
| NOC*NSF logo | Official first-party SVG | Owner-approved public contextual use | Owner/rightsholder confirmation of 8 September; provenance and hash in `assets/source/partners/RIGHTS-NOTICE.md` | Unmodified mark in contextual trust section; no new sponsorship or certification claim |
| Ooievaarspas logo | Official first-party SVG | Owner-approved public use | Owner/rightsholder confirmation of 8 September; provenance and hash recorded | Unmodified mark with the confirmed 50% eligible-membership wording |
| XXL logo, shaker, banner and Muscle Grow creative | Windows paths unavailable | Not available in workspace | Rights broadly confirmed, but no source bytes available | Not used or recreated |
| XXL whey image `32535009.avif` | Supplied attachment | Owner-approved public creative | Owner/rightsholder confirmation of 8 September; exact public copy is hash-tested | Neutral non-affiliate partner visual; no product-benefit claim |
| XXL affiliate link | Official affiliate-programme context | Needs account approval | No approved Awin tracking URL supplied | Component disabled; production CTA hidden |

## NTC/NOC*NSF activation checklist

Logo/editorial rights and the existence of a certification are owner-confirmed. The owner explicitly chose not to advertise that certification, so keep `nocNsfCertificationAdvertisingApproved` false and structured data free of `award`, `credential` or `affiliation`. This is an internal publication rule, not customer-facing copy.

## XXL activation checklist

The supplied creative is approved and may appear in neutral partner context. An affiliate CTA still requires an approved HTTPS tracking URL and active account approval: configure `NEXT_PUBLIC_XXL_AFFILIATE_URL` and set `XXL_AFFILIATE_APPROVED=true`. The visible disclosure and `rel="sponsored noopener noreferrer"` may not be removed from an active affiliate link.
