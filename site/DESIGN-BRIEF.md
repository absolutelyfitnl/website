# Absolutely Fit design showcase

Ten deliberately different light website directions; separate complete static HTML concept pages. This is design exploration, not the final live gym website or member backend. Do not copy the source repository layout, CSS or application. Reuse only factual club content and supplied imagery.

## Verified source facts
- Absolutely Fit, family gym in Scheveningen Havenkwartier, founded 2008.
- Personal, down-to-earth, welcoming to beginners and advanced athletes.
- Strength training, cardio, personal training, powerlifting/weightlifting, Strength & Conditioning.
- Owner/coach Rik Priester; world champion powerlifting 1990. No invented testimonials or ratings.
- Starting price €24,50/month. Do not invent specific package prices or terms. Memberships: 1× per week, Onbeperkt trainen, 10-rittenkaart, Jeugd.
- Primary CTA Gratis persoonlijke intake. Do NOT promise free workout/trial or 24/7 opening.
- Doctor Lelykade 240, 2583 CP Den Haag; 070 358 77 81; info@absolutely-fit.nl.
- Opening hours Mon–Thu 07:00–22:00; Fri 07:00–21:00; Sat–Sun 08:00–15:00.
- Avoid clinical claims, partner logos, membership discount details: unnecessary for concept choice.

## Shared asset/API contract
- All pages /dist/concept-01.html ... /dist/concept-10.html; full HTML lang=nl.
- Each page links assets/tailwind.css THEN assets/base.css then own inline CSS. Root compiles Tailwind v4 and bundles Motion.
- At end `<script src="assets/motion.js"></script><script src="assets/base.js"></script>`.
- Fonts locally hosted by root: font-family 'Inter', 'Manrope', 'DM Sans', 'Space Grotesk', 'DM Serif Display', 'Barlow Condensed'. Use matching sensible fallbacks.
- Available assets: assets/logo.svg (EXACT reconstructed stacked blue/purple lotus logo; viewBox crop via assets/logo-tight.svg supplied by root); assets/lotus.svg (lotus only); assets/wordmark.svg (wordmark only); hero-coaching.webp, community-training.webp, strength-detail.webp, cardio-sunrise.jpg, club-exterior.webp, lotus-window.jpg.
- Logo is not to be replaced by generic text. Display logo-tight.svg around 75–95px wide (or compose icon/wordmark as horizontal brand from supplied assets).
- Header menu button class=menu-toggle aria-expanded=false controls `.nav-links`, root toggles .is-open and correct aria.
- Intake CTA `<button data-intake>Gratis persoonlijke intake ...</button>` root opens an attractive functional demonstration dialog (not real submission).
- Member CTA `<button data-member>Mijn Absolutely Fit</button>` root opens clearly labelled future member system preview.
- Use `<a href="#training">` etc only real IDs in your page.
- Motion: add data-reveal to below-fold sections/cards; root Motion inView handles. Optional data-parallax on hero img; reduced-motion respected, preview mode static. Do not hide any content by default.
- Root uses ?preview=1 in thumbnail iframes; `.is-preview` added early by script (you may add own script to head for immediate class); disable motion in that mode.
- Each page must have 1 H1, title and description, viewport, noindex metadata (design showcase, not competing indexed duplicates).
- Common base CSS provides basic reset, shared buttons `.btn`, `.btn-outline`, `.eyebrow`, `.af-brand`, accessibility, modal layout and basic footer. Define your own styles for meaningful identity; names scopeable to unique body class.
- Use real semantic sections, legible contrast, responsive 375px/768px/1440px, no horizontal document overflow, mobile menu. No fake carousel arrows, dead buttons, claims of sent forms.
- Each concept ~3–5 meaningful sections beyond hero, enough to show system direction (training, personality, memberships/contact). Do not just recolour the same template.
- Include contact footer. Header and CTAs must work. Full viewport concepts use min-height: calc(100svh - header height) and responsive fallback. Avoid arbitrary 1000px heights on mobile.
- UI content Dutch. Concept title is in showcase, not ugly admin labels in actual site hero.

## Division
Root: gallery/viewer, shared styles/scripts, concept 10, source packaging/publication.
Agent A: 01 Havenlicht (full viewport bright photo), 02 De Editie (refined serif editorial magazine), 03 Kracht in Typografie (oversized condensed athletic Swiss layout).
Agent B: 04 Lotus Atelier (organic masks, soft violet, calm spacious boutique), 05 Jouw Ritme (clean playful interactive modular schedule/goal choices), 06 De Buurtclub (warm creamy community collage, handwritten-like emphasis).
Agent C: 07 Krachtstudio (very minimal ivory/brutalist precise black & violet accents), 08 Panorama (panoramic photo cinema full viewport with navigation concept), 09 Persoonlijk Plan (guided welcoming onboarding hero with real local goal choices).
Root 10: Club Canvas (poster-like playful blue typographic shapes, asymmetrical composition, large image strip).

Do not edit other agent files or common root files. No Sites native calls from agents. Send completed paths and any recommended metadata, notes.
