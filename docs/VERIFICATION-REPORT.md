# Verification report

Release candidate: customer-facing interface cleanup, live mobile club status, approved partner presentation and owner-updated club facts, 11 September 2026.

## Automated verification

| Check | Command | Result |
|---|---|---|
| Full quality gate | `npm run check` | Passed |
| ESLint | `npm run lint` | Passed without warnings |
| TypeScript | `npm run typecheck` | Passed |
| Contract/content tests | `npm test` | Passed: 17/17, including Amsterdam calendar, owner-updated facts, content-rights and protected-claim guards |
| Production build | `npm run build` | Passed: 62 generated application routes |
| Dependency audit | `npm audit --omit=dev --audit-level=high` | Passed: 0 vulnerabilities |
| Browser, links, keyboard and responsive regression | `QA_ARTIFACTS_DIR=.artifacts/qa-customer-ready-full npm run qa:browser` | Passed: 217/217 checks, with no console, page or network errors |

The browser suite covers 46 canonical routes, 12 legacy redirects, metadata and structured data, the public site, member portal, backoffice, forms, wizards and dialogs. It also verifies that customer-facing body copy, metadata and accessible labels contain no demo or technical warnings. The custom mobile menu is checked for its live Europe/Amsterdam opening status, removed location/history rows, focus trap, Escape handling, trigger-focus restoration and scroll lock.

## Visual and responsive coverage

The final polish run verifies the requested areas at desktop and narrow-screen widths:

- the homepage product introduction is compact and no longer leaves an excessive empty field;
- all four membership cards share aligned heading, description, feature, note and action rows;
- the Ooievaarspas presentation is smaller, uses the approved mark and keeps its heading, source links and FAQ free of overlap;
- the approved NOC*NSF visual and historical achievements are presented confidently, without a public rights or verification warning;
- the XXL Nutrition creative is presented as a neutral partner/product visual, without a purchase or affiliate action;
- the free-intake callout uses the full content rail on programme pages;
- public, member and backoffice screens use normal customer-facing copy without demo, prototype, fictive-data or technical notices;
- the mobile menu shows only Clubinformatie with the current open/closed status and the next relevant time;
- public, member and backoffice schedules derive the current ISO week, Dutch dates and today marker in Europe/Amsterdam;
- motion is pointer-aware and all added animation is disabled for `prefers-reduced-motion`.

Focused reflow checks passed at 320, 375, 390 and 430 pixels for the homepage, memberships, Ooievaarspas, topsport/NTC, strength training, about and member-app routes. The broader suite also covers 768, 1024, 1280, 1440 and 1920-pixel viewports and fails on document or focused-component horizontal overflow.

The complete responsive screenshot matrix and functional suite passed all 217 checks in `.artifacts/qa-content-update-full-v2`. These QA artifacts are intentionally gitignored.

## Rights and publication boundaries

- The owner's 8 September 2026 publication approval is recorded in `lib/content/publication-approvals.json`.
- The supplied Ooievaarspas and NOC*NSF marks and the selected XXL Nutrition visual are preserved in the source-rights register and deployed from `public/partners`.
- The guard verifies exact approved asset hashes so accidental replacement fails the build.
- Historical strength-sport results and editorial NOC*NSF context are approved for publication.
- The owner confirms that the certification exists and explicitly chooses not to advertise it. The customer interface therefore contains neither a certification claim nor a technical disclaimer about it.
- XXL affiliate rendering stays fail-closed: it requires both an approved HTTPS URL and the explicit environment gate. No URL is configured in this release, so no public affiliate CTA is rendered.
- The owner-supplied starting price of € 24,50 per month is published; product-specific prices, terms and general Ooievaarspas product eligibility continue to be confirmed during the personal intake. The qualified 100% youth reimbursement is published for under-18 visitors whose first sport is Absolutely Fit.

## Production gate

The `production` branch workflow independently repeats linting, type checks, tests, build and artifact smoke checks before switching the release. Deployment is accepted only when the public health endpoint returns the exact committed release SHA; live browser regression is then run against `https://abso.dgwebservices.nl` as the final handoff check.
