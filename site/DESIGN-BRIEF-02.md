# Collection 02 — closer to the current Absolutely Fit design

User rejected the degree of brand divergence of collection01 and asks for ten new concepts closer to the CURRENT design but prettier. Keep01–10 unchanged. New pages are dist/concept-11.html through20. The repository's current design, not our collection01, is now the visual reference.

## Mandatory recognizable DNA
- Icy blue canvas #f2f6fb, white panels, navy #071a36/#172746, strong blue #075cf6, soft blue #8eb6ff, violet #6542c8 as secondary gradient accent.
- Broad, heavy uppercase sans headings. Use local Manrope 800 or Inter 800/900. No serif, condensed athletic letters, yellow, cream, green palettes, brutalist sharp poster style.
- Floating sticky glass header, subtle border, 16px radius, horizontal lotus+wordmark. Main sections rounded14–24px, buttons8px, cool light shadows, 20–28px separation. Navy only small contrast blocks, mostly very LIGHT.
- High-quality bright gym photography, familiar blue/violet ribbon (now allowed to reuse source brand shapes), lots of white space, purposeful motion. Existing source hero is copyleft/photo right ~48/52, 520px high, wide heavy uppercase Fitness / zoals het / bedoeld is., lastline softblue, broad sweeping ribbon. Newvariants should visibly derive from this.
- Refine consistency, crops, spacious type, hierarchy. Body16px minimum in fullsize except nav/footer labels; no microscopic 10px paragraphs. Hero controls reachable mobile.
- User wants ten distinct compositions WITHIN this same brand family; different hero layout and page rhythm, not ten recolors.

## Facts
Use same factual brief DESIGN-BRIEF.md: familyclub since2008 Scheveningen; strength, cardio, PT, powerlifting/weightlifting, S&C; Rik Priester founder coach worldchamp1990. Startingprice€24,50/month (no perplanprices). Four plans 1×perweek, Onbeperkt trainen,10-rittenkaart,Jeugd. DoctorLelykade240,2583CPDenHaag;0703587781;info@absolutely-fit.nl. Hours ma-do07-22,vr07-21,za-zo08-15. Primary Gratis persoonlijke intake; no freeworkout. No fake ratings/testimonials. Member system later: only labelled conceptdemo.

## Implementation and shared contract
Full HTML langnl, viewport,title,description,noindex;1H1;real anchors;responsive375/768/1440.
Styles order assets/tailwind.css, assets/base.css, assets/evolution.css, then own inline style.
Scripts bottom assets/motion.js,assets/base.js,assets/evolution.js then ownJS ifneeded. Root supplies common styles. Head early: if(new URLSearchParams(location.search).has('preview'))document.documentElement.classList.add('is-preview').
Body class includes `ev` + your concept class. .ev-wrap common max1440,widthcalc100%-64px.
Assets existing photos hero-coaching.webp/community-training.webp/strength-detail.webp/cardio-sunrise.jpg/club-exterior.webp/lotus-window.jpg. Brand assets NOW available: assets/logo-horizontal.svg (root made from exactuserlogo), ribbon-wide.svg (landscape), ribbon.svg (portrait), lotus.svg. Prefer horizontalbrand at180x44px rather than huge stackedlogo.
Header sample: `<header class="ev-header"><a class="ev-brand" href="#main"><img src="assets/logo-horizontal.svg" alt="Absolutely Fit" width="442" height="104"></a><nav class="nav-links" aria-label="Hoofdnavigatie"><a href="#training">Training</a><a href="#club">Onze club</a><a href="#contact">Contact</a><button data-member>Mijn Absolutely Fit</button></nav><button class="ev-join" data-intake>Gratis intake <span>↗</span></button><button class="menu-toggle" aria-expanded="false">Menu ☰</button></header>`.
Root evolution.css makes header responsive at1000px, dropdown correctlypositioned, hidesexternaljoin atmax600. Do not redefine menutoggle display breakpoints conflictingwithcommon.
Shared classes ev-kicker (uppercase10pxblue), ev-button (blueCTA),ev-button-secondary(outline),ev-title(heavyuppercase),ev-pill,ev-panel,ev-wrap,ev-footer(optionalstyles). You still own hero and pagecomposition. Define strong ownstyles.
Use data-intake and data-member on real buttons. Goalchoices should set CTA.dataset.intakeGoal to shared labels Sterker worden / Conditie opbouwen / Weer beginnen / Gericht trainen. DO NOT use data-goal on intakeCTA if yourscriptsqueryall[data-goal].
Motion data-reveal, data-parallax(smalloptional) root. Add data-ribbon todecorativeribbon if gentlefloatneeded, root handles nativeanimate below. Preview disablesmotion. Decorativeimgalt="" aria-hidden=true; nevercoverreadabletext or people withgiantband.
Minimumhero+3–5meaningfulsections showing trainings,club,pricing/contact. Ifshowing futurememberUI label it as futurepreview with button data-member. No custombackend.
No new dependencies, no browser/previewserver (Sitesbrowser unavailable), no nativeSitescalls. Root handles buildpublication.
Do not edit sharedroot files, collection01pages or others' pages. You own only assignedHTML files, plus ownassetsifneeded.

## Allocation
AgentA11 Absolutely Signature: MOST directly faithful source splitwhite/photo panel; polishoriginalblue ribbon, stronger human photography and confident broadheadline.12 Blue Horizon: fullviewport brightcoachingphoto, whitegradientleft,glassheader,blue ribbon alongloweredge.13 Floating Welcome: fullwidthlargephotopanel with white roundedcopycard floatinglowerleft; compactheightresponsive.
AgentB14 Lotus Flow: asymmetrical generouslycurved photo, whitecopyleft, signature ribbonconnectingherofirstsection.15 The Club Grid: refinedlightbluebentohero withbigcopytile,largecoachphoto,communitystrip,smallfoundedchip; easy visualscanning.16 Absolutely Panorama: widephotoatop with overlapped longwhiteintro panel; generouspale whitespace andfourbenefits.
AgentC17 Personal First: currentDNAhero including workinggoalchoiceinwhitecard andbigphoto, notdashboard.18 Bright Statement: centralnavy/softblueheavyuppercaseheadline onwhite,widephotodirectlybelowandflowingribbonbehind; symmetricalconfident.19 Club Stories: two large unequal photos+bigbroadheadingbetween/asym butallbluewhite, humanaesthetic notserifeditorial.
AgentD20 Absolutely Perspective: dramaticdiagonalwhite/icebluetransition withphotoonright,glassinformationcard,subtleperspectivewithout3Dgimmicks. Elegantblue ribboncomplement.

Root owns showcasecollectionswitcher andcommonCSSJS. Source preview assets are existing approvedrepositoryassets. Need not retrieveimagesexternally.
