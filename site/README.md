# Absolutely Fit — selected Perspective website

The user selected concept 20, Absolutely Perspective. The previous 20-concept showcase has been removed from the published output and replaced by a complete Dutch gym website in that design: 29 public information pages, nine complete knowledge articles, plus one clearly labelled future-member information page. All previous concept pages and their photography are removed.

## Source and content

Public content was migrated from https://github.com/absolutelyfitnl/website, commit `3107027ec2f7a82f908cddd621d53b1563e9bf26`, checked against remote HEAD on 12 October 2026. `CONTENT-MIGRATION.md` records the complete route/content inventory. `src/content/articles.json` retains all nine original articles (28 sections), dates, takeaways and related links; source image references in that data are provenance only and never used in published output.

All 29 public routes are preserved. NOC*NSF appears in its approved historical/editorial sports context, not as a newly invented certification, official partnership or endorsement. The Ooievaarspas copy retains 50% off eligible memberships, plus 100% for under-18s only when this is their first sport. Exact per-product eligibility, individual prices and contractual terms remain personal enquiries, as in the source. The starting price is €24.50 per month. XXL Nutrition's neutral informational copy remains in the same relevant pages; no affiliate URL or old product photo is added.

Only the ten photographs uploaded in this conversation are published. They are copied byte-for-byte to `dist/assets/photos`; original people, equipment, reflections and buildings are preserved. CSS framing and a very slight homepage brightness/contrast adjustment provide presentation polish. The phone gallery controls in photos 09/10 are clipped out with CSS; original image files are untouched. No other gym images, generated photographs or unverified portraits are used. Original vector brand/ribbon assets and approved NOC*NSF/Ooievaarspas marks are retained.

## Functionality and boundaries

- Transparent, blurred sticky navigation with an icon-only three-line menu and native accessible dialog.
- All public pages, complete navigation/footer, training detail links and useful legacy route aliases.
- Searchable knowledge bank and FAQ; reading navigation, related content and native accordions.
- Training route wizard and free intake preparation wizard with context handoff to contact.
- Contact prepares a `mailto:` message and copyable text. It does not automatically send requests, claim delivery or persist personal details. Sending happens in the visitor's own email application.
- Opening status and week dates use Europe/Amsterdam. The schedule shows confirmed regular opening hours and refers visitors to the club for guided moments. The source repository's demo availability is not presented as real bookings.
- The future member page explains intended functionality. No authentication, booking, membership administration or payment backend is claimed active. Source backoffice/account prototypes were outside the requested gym-information scope and are not exposed as operational services.
- All ten photos are available in a keyboard-operable gallery/lightbox. Reduced motion is respected; the site uses local Motion 12, Tailwind CSS 4, local fonts, CSS view transitions and progressively enhanced static HTML.

## Build and hosting

Run `npm install` if dependencies are missing, then `npm run build`.

`src/build.mjs` renders `src/pages/*.mjs` into `dist/<route>/index.html`. Shared styling and behavior live in `dist/assets/site.css` and `site.js`; focused page scripts are separate. The selected homepage layout is preserved in `src/pages/home-base.html` and `dist/assets/home.css`. `.openai/hosting.json` retains this Site's existing project identity and static output.

The current Sites publication remains owner-private. Page metadata is `noindex,follow`, robots disallows indexing, and canonical/JSON-LD/sitemap URLs use the current Sites origin. When the final public domain is chosen, change the origin and indexing settings together. Structured data includes the verified club details, breadcrumbs and article/FAQ content. No fabricated review scores, credentials or awards are included. Legacy aliases are static refresh/JS fallbacks; configure true HTTP 301/308 redirects at the final hosting layer.

## Verification

Build, JavaScript syntax, all rendered page/asset links and fragments, one H1 per content page, metadata/JSON-LD, image provenance and source-content coverage are checked. Focused interaction checks cover 45 training-route and 80 intake answer combinations, context handoff, contact email preparation, query validation and week navigation. There are no automatic messages or live bookings.

A supported browser was unavailable in this managed environment, so visual browser QA and real-device interaction/performance measurements remain unverified. Before public production launch, review actual mobile/desktop layouts, image crops, keyboard focus, contrast and Core Web Vitals on the final domain.
