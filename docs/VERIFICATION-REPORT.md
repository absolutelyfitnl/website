# Verification report

Release candidate: content and SEO expansion, 7 September 2026.

## Automated verification

| Check | Command | Result |
|---|---|---|
| ESLint | `npm run lint` | Passed |
| TypeScript | `npm run typecheck` | Passed |
| Contract/content tests | `npm test` | Passed: 15/15; includes the content-rights guard and negative protected-claim variants |
| Production build | `npm run build` | Passed: 62 generated application routes |
| Dependency audit | `npm audit --omit=dev --audit-level=high` | Passed: 0 vulnerabilities |
| Full browser, links, keyboard and responsive run | `BASE_URL=http://127.0.0.1:3000 QA_ARTIFACTS_DIR=.artifacts/qa-final npm run qa:browser` | Passed: 215/215, including 46 HTTP routes, 12 redirects and 240 screenshots |
| Final targeted regression run | `QA_SKIP_BULK_CAPTURE=1 ... npm run qa:browser` | Passed: 19/19 after visual review fix; zero console, page or network errors |
| Production workflow | GitHub Actions run `34169656846` | Passed: quality gate, artifact smoke, deploy and public verification |
| Production health and exact release SHA | `https://abso.dgwebservices.nl/api/health` | Passed for `654ba85f94d0dc6ef23ddf978bf6801166f305a0` |
| Production browser regression | `BASE_URL=https://abso.dgwebservices.nl QA_SKIP_BULK_CAPTURE=1 ... npm run qa:browser` | Passed: 19/19; zero console, page or network errors |

## Responsive matrix

The browser suite inspected 320, 375, 390, 430, 768, 1024, 1280, 1440 and 1920 pixel widths and failed on document-wide horizontal overflow. It also tested 200% reflow equivalents, a low landscape viewport, coarse pointers and reduced motion. No overflow failure was found.

Screenshots are generated under `.artifacts/qa-final` (full matrix) and `.artifacts/qa-production` (final live interaction/region recaptures). These local QA artifacts are intentionally gitignored. Representative handoff files include:

- `phone-320--home.png`
- `phone-430--gratis-persoonlijke-intake.png`
- `tablet-768--ooievaarspas.png`
- `desktop-1440--home--region-producten.png`
- `desktop-1440--home--region-vertrouwen.png`
- `desktop-1440--backoffice--instellingen.png`

The final visual review found one dark-on-dark heading in the homepage trust card. It was changed to white, protected by a browser contrast assertion and recaptured before release.

## Production release evidence

- Application release: `654ba85f94d0dc6ef23ddf978bf6801166f305a0`.
- GitHub Actions: `https://github.com/absolutelyfitnl/website/actions/runs/34169656846` completed successfully in 1 minute 12 seconds.
- Production health returned `status: ok`, `service: absolutely-fit`, `environment: production` and the exact application release SHA.
- Independent live smoke checks returned HTTP 200 for the homepage, all primary new pages, the knowledge hub/article, member portal and backoffice.
- The four representative legacy paths returned HTTP 308 with their exact canonical `Location`; the automated suite covered all twelve legacy routes.
- Final production interaction screenshots are stored locally under `.artifacts/qa-production` and intentionally remain outside Git.

## Browser and SEO coverage

- All canonical public routes and all nine articles return 200 with their own canonical URL.
- Twelve legacy routes return a real HTTP 308 with an exact `Location` header.
- Sitemap membership/exclusions, robots directives and `noindex,nofollow` on all demo/auth surfaces passed.
- Rendered `ExerciseGym`, `FAQPage`, `Article` and `BreadcrumbList` JSON-LD parses successfully; exact product/hour counts and forbidden claim fields are asserted.
- Mobile menu focus/escape/scroll-lock, wizard validation/reset/product prefill, contact form, accordions, portal dialogs, roster actions and backoffice editor/publish flows passed.

## Rights and feature gates

- Protected NOC*NSF, TeamNL and Olympic assets: not in deployable output.
- NTC/NOC*NSF specific certification: not asserted; proof status is visible and `needsConfirmation`.
- XXL affiliate: no approved URL, so the component renders no public CTA.
- XXL supplied whey creative: retained outside `public`, never imported.
- Missing Windows-path assets: Ooievaarspas, NOC*NSF, XXL logo, shaker, banner and Muscle Grow image were unavailable; safe code-native/text fallbacks are used without recreating marks.
- Original Rond de Haven scan: unavailable; only an attributed original-language summary is published.

## Remaining confirmation items

See `FACTS-AND-RIGHTS-REGISTER.md` for product prices/terms, Ooievaarspas eligibility per product, exact NTC evidence/logo permission, affiliate URL/creative licence, specific people/athlete claims and original media/asset publication rights.
