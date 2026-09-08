# Verification report

Release candidate: site-wide visual polish and approved partner presentation, 8 September 2026.

## Automated verification

| Check | Command | Result |
|---|---|---|
| Full quality gate | `npm run check` | Passed |
| ESLint | `npm run lint` | Passed without warnings |
| TypeScript | `npm run typecheck` | Passed |
| Contract/content tests | `npm test` | Passed: 15/15, including content-rights and protected-claim guards |
| Production build | `npm run build` | Passed: 62 generated application routes |
| Dependency audit | `npm audit --omit=dev --audit-level=high` | Passed: 0 vulnerabilities |
| Browser, links, keyboard and responsive regression | `QA_SKIP_BULK_CAPTURE=1 QA_ARTIFACTS_DIR=.artifacts/qa-polish-release-final npm run qa:browser -- http://127.0.0.1:3000` | Passed: 19/19 control groups, with no console, page or network errors |

The browser suite covers 46 canonical routes, 12 legacy redirects, metadata and structured data, the public site, member portal, backoffice, forms, wizards and dialogs. It also verifies the custom mobile menu's focus trap, Escape handling, trigger-focus restoration and scroll lock.

## Visual and responsive coverage

The final polish run verifies the requested areas at desktop and narrow-screen widths:

- the homepage product introduction is compact and no longer leaves an excessive empty field;
- all four membership cards share aligned heading, description, feature, note and action rows;
- the Ooievaarspas presentation is smaller, uses the approved mark and keeps its heading, source links and FAQ free of overlap;
- the approved NOC*NSF visual appears only with historical/editorial context and an explicit current-credential boundary;
- the XXL Nutrition creative is presented as a neutral partner/product visual, without a purchase or affiliate action;
- the free-intake callout uses the full content rail on programme pages;
- backoffice and member-demo labels, spacing and presentation remain consistent with their local-demo status;
- motion is pointer-aware and all added animation is disabled for `prefers-reduced-motion`.

Focused reflow checks passed at 320 and 390 pixels for the homepage, memberships, Ooievaarspas, topsport/NTC, strength training, about and member-app routes. The broader suite also covers 430, 640, 768, 844-landscape and 1440-pixel viewports and fails on document or focused-component horizontal overflow.

Screenshots are generated under `.artifacts/qa-polish-release-final`. These QA artifacts are intentionally gitignored.

## Rights and publication boundaries

- The owner's 8 September 2026 publication approval is recorded in `lib/content/publication-approvals.json`.
- The supplied Ooievaarspas and NOC*NSF marks and the selected XXL Nutrition visual are preserved in the source-rights register and deployed from `public/partners`.
- The guard verifies exact approved asset hashes so accidental replacement fails the build.
- Historical strength-sport results and editorial NOC*NSF context are approved for publication.
- No current NOC*NSF accreditation, recognition or certification is claimed because formal credential evidence is still not recorded.
- XXL affiliate rendering stays fail-closed: it requires both an approved HTTPS URL and the explicit environment gate. No URL is configured in this release, so no public affiliate CTA is rendered.
- Prices and product-specific Ooievaarspas eligibility continue to be confirmed during the personal intake rather than published as unsupported fixed terms.

## Production gate

The `production` branch workflow independently repeats linting, type checks, tests, build and artifact smoke checks before switching the release. Deployment is accepted only when the public health endpoint returns the exact committed release SHA; live browser regression is then run against `https://abso.dgwebservices.nl` as the final handoff check.
