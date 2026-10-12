# Migratierapport — Absolutely Fit

**Status: productie gedeployd op [abso.dgwebservices.nl](https://abso.dgwebservices.nl). Actieve release-SHA: `eb9199c5839ddaa273953267aeee0e4d6f351178`; de bestaande VPS-run is geslaagd en de publieke HTTP-/healthcontrole bevestigt deze exacte SHA.**

Uitvoering: 12 oktober 2026. De gebruiker heeft de exacte overname, push en onmiddellijke productierelease opgedragen. Bron: Sites-commit `cd1f4e7f78b0e1f3ceea3d9d3d12ab9cf2456ed8`, uit het ontvangen bevroren overdrachtspakket. Alle 151 pakketbestanden, 122 bronbestanden en tien foto’s zijn vooraf en na implementatie gecontroleerd met het oorspronkelijke pakketcontrolescript. De externe referentie is ongewijzigd gebleven.

## Veilig archief

De werkboom was schoon. Actuele remote heads zijn vóór vervanging opgehaald en opnieuw vergeleken. De vier unieke archiefrefs zijn atomisch aangemaakt en elk op exact de oorspronkelijke SHA teruggelezen. Geen force push, history rewrite of verwijdering van bestaande branches. Er waren geen open PR’s, branchbeveiliging of repositoryregels die deze integratie blokkeren.

| Oorspronkelijke branch | Gecontroleerde SHA | GitHub-archiefbranch |
| --- | --- | --- |
| `codex/absolutely-fit-club-house` | `e4d5140913541406481bd86969b35666ee5cda10` | `archive/pre-sites-v20-20261012T154344Z-445852db/codex/absolutely-fit-club-house` |
| `codex/content-seo-expansion-2026-09` | `1e41aa90df728b6b73d796b7f0b08a2d496a9dc0` | `archive/pre-sites-v20-20261012T154344Z-445852db/codex/content-seo-expansion-2026-09` |
| `main` | `3107027ec2f7a82f908cddd621d53b1563e9bf26` | `archive/pre-sites-v20-20261012T154344Z-445852db/main` |
| `production` | `3107027ec2f7a82f908cddd621d53b1563e9bf26` | `archive/pre-sites-v20-20261012T154344Z-445852db/production` |

Het machineleesbare archiefmanifest staat in `docs/archive-manifest.json`. De originele remote heads worden opnieuw gecontroleerd vóór integratie en release. De oude ontwikkelbranches blijven bestaan; hun snapshots zijn veiliggesteld.

## Implementatie en infrastructuur

- De oorspronkelijke generator, paginamodules, homepage, artikelen, contentmanifest, buildlockfile en alle assets staan in `site/`. Zij zijn niet herschreven. De historische bron-Markdownbestanden blijven uitsluitend voor herkomst en oorspronkelijke Tailwind-scaninput: weglaten daarvan verandert vijf gegenereerde utilityregels. Zij zijn geen actieve conceptselectie of nieuwe werkopdracht.
- De oude publieke Next-schermen, componentlibrary, vormgevingslagen, fotografie, demoleden, facturen, portalen en backoffice zijn uit de actieve boom verwijderd. De enige publieke website is de gekozen Sites-uitvoer.
- Next blijft uitsluitend een serveradapter (`app/[[...path]]/route.ts`). Die levert de oorspronkelijke HTML/assetbytes, HTTP 308 voor de 14 aliases, trailing slash-normalisatie met querybehoud, juiste MIME/ETag/cacheheaders en de oorspronkelijke 404-pagina. Vervallen demo-subroutes geven 404.
- Node 24, Next standalone, de bestaande runnerlabels/grenscontrole, `/usr/local/bin/dg-site-deploy`, loopbackbinding en de drie runtime-env-sleutels blijven behouden. Er is geen overstap naar een andere VPS-runtime of wijziging van Caddy/systemd/serverdata/secrets. Er was geen directe SSH-ingang in deze sessie; het echte helpergedrag is via de runnerlog gecontroleerd. De helper voert na de kwaliteitsgate een eigen schone productie-installatie en herbouw uit.
- Next is bijgewerkt van 16.3.4 naar 16.3.8; transitive hostingdependencies naar auditveilige versies (`sharp` 0.35.5, `source-map-js` 1.2.2). De documentatie van de werkelijk geïnstalleerde Next-versie is vóór de adapterwijziging gelezen. De oorspronkelijke Sites-builddependencies blijven exact vastgelegd.
- `prepare-site.mjs` past uitsluitend headmetadata/origin/robots/sitemap aan na de originele build en verwijdert alias-HTML uit het releaseartefact. Preview blijft noindex; productie heeft 29 indexeerbare publieke pagina’s. `/ledenapp/` blijft noindex en buiten de sitemap. De bevestigde bestaande productie-origin is `https://abso.dgwebservices.nl`. Er zijn geen Sites-canonicals in de aangepaste uitvoer.
- Standalone tracing omvat `site/dist/**/*`; `prepare-standalone.mjs` kopieert deze map expliciet, naast het bestaande `public`/`.next/static`-contract. De artifactgate controleert de daadwerkelijk gekopieerde bytes. `/api/health` blijft dynamisch met no-store, service `absolutely-fit`, omgeving en echte runtime-SHA.
- De kwaliteitsgate blijft lint, typecheck, inhouds-/interactietests, build, productie-dependencyaudit en standalone smoke. De HTTP-smoke is uitgebreid naar alle routes, alle assets en verwijderde demo-routes, zowel vóór als na deployment.

## Inhoud, assets en browserbewijs

De onafhankelijke bron-/fotomanifesten en het oorspronkelijke praktische testscript zijn ongewijzigd bewaard in `tests/reference/`. De extra bodyhashes zijn rechtstreeks uit de bevroren referentie afgeleid. De oorspronkelijke vergelijker bewijst 30 identieke body-markups, negen volledige artikelen, 56 byte-identieke assets, precies tien foto’s, lokale links/ankers en basismetadata. De negen artikelen bevatten 28 secties. De 28 fontbestanden zijn intact; de zes bijbehorende SIL OFL-licenties en herkomst staan in `docs/licenses/`. De eigenaars-/rechtenregistratie is behouden.

Contact bereidt uitsluitend een mailto-bericht en kopieerbare tekst voor. Er is geen automatische verzending of claim van aflevering. Rooster toont reguliere Amsterdamse clubtijden; er zijn geen live boekbare plaatsen of fictieve ledengegevens. De toekomstige ledenpagina is de oorspronkelijke informatiepagina. NOC*NSF-context, Rik Priester, Ooievaarspasvoorwaarden en neutrale XXL-tekst blijven letterlijk behouden; geen certificerings- of prijsclaim is toegevoegd.

## Uitgevoerde controles

- Schone `npm ci`, lint, Next-route-typegeneratie/TypeScript, inhoudstests, oorspronkelijke 80-combinatie-/contact-/roostertest en standalone build.
- `npm run audit`: geen kwetsbaarheden in beide productie-dependencyinventarissen (`--omit=dev`), overeenkomstig de bestaande gate. De bevroren buildtooling en ESLint hebben wel gemelde development-only advisories; deze zijn niet door een wijziging aan de exacte bronlockfile verborgen of verwijderd.
- Oorspronkelijke `controleer-pakket.py` en `vergelijk-website.py` tegen `site/dist`.
- Preview HTTP: alle 30 bodyhashes, 56 assets/hash/MIME, 14 HTTP-redirects in beide slashvormen inclusief querybehoud, 20 vervallen/onbekende routes met 404, robots/sitemap/canonical/indexering, HEAD/ETag en exacte no-store-health.
- Echte Chromium-vergelijking tegen de ongewijzigde overdrachtsreferentie: alle 30 routes op 1440, 1024, 768, 390, 375 en 320 px; alle 180 controles slagen zonder horizontale overflow. Fonts, geladen beelden, object-fit/positie en afmetingen komen overeen. Twintig screenshotparen van homepage en kernpagina’s slagen; in de definitieve meting zijn ook de apart geregistreerde één-RGB-afrondingsverschillen nul.
- Native dialogmenu: openen met Enter, Tab-navigatie, afschermen van de onderliggende pagina, Escape, aria-expanded, focusherstel en scrollheader. Native browserchrome mag focus ontvangen; de onderliggende pagina blijft inert. Galerij: alle tien beelden, teller/caption/alt, pijltjestoetsen, omloop, sluiten/focusherstel en de 09/10-telefooncrops.
- Alle 45 trainingscombinaties en alle 80 intakecombinaties draaien in de echte browser tegen de oorspronkelijke scripts; resultaat, focus, terug/reset en context-/productquery zijn gecontroleerd. Contact: queryallowlist, vereiste velden, speciale tekens in mailto, echte clipboardactie en intrekken van een verouderd bericht. Rooster: Amsterdam-week, zeven dagen, vandaagmarkering, navigatie/reset en alle filters. Kennisbank/FAQ: zoeken, filters, lege toestand/reset, tien native accordions en alle inhoudslinks van negen complete artikelen.
- Reduced motion is gebruikt voor de gelijkwaardige screenshots; normale Motion-animaties zijn daarnaast met een lopende browserklok getest. Chromium native keuzelijsten zijn in verse tabs na fontladen vergeleken om oude fallback-glyphs uit een eerdere navigatie te vermijden. Er zijn geen JavaScript-fouten.
- Het JSON-bewijs staat in `docs/migration-evidence/browser-results.json`. Relevante referentie-/migratiescreenshots en beide gecontroleerde galerijcrops zijn meegecommit. De overige screenshotparen blijven lokaal in `artifacts/sites-migration/`. Er wordt geen eerdere Sites-browsercontrole of Lighthouse/Core Web Vitals-score geclaimd.

## Integratie en productierelease

Migratiebranch: `codex/sites-v20-exact-migration`. Migratiecommit: `d429e78560d7a5117bc89c41fe59070756e17c24` via [PR #1](https://github.com/absolutelyfitnl/website/pull/1). De productie-installatiecorrectie is commit `1918c85ac71a73fbe2e3bb3bc11c7dba48bfde1f` via [PR #2](https://github.com/absolutelyfitnl/website/pull/2). Beide PR’s zijn met normale merges geïntegreerd; er is geen geschiedenis herschreven.

De productierelease is een normale fast-forward push van de geïntegreerde code naar `production`. De definitieve release-SHA is `eb9199c5839ddaa273953267aeee0e4d6f351178`. [Deployrun 38277435078](https://github.com/absolutelyfitnl/website/actions/runs/38277435078) is geslaagd, inclusief de extra productie-installatie/herbouwgate, standalone-smoke, bestaande deployhelper en publieke eindcontrole. De echte VPS-release is `eb9199c5839d-38277435078-1` in de bestaande releasemap. `/api/health` geeft status `ok`, service `absolutely-fit`, omgeving `production`, deze exacte SHA en `cache-control: no-store`.

## Aanpassing aan de werkelijke VPS-herbouw

De eerste releasepoging (`38276636252`) slaagde voor de volledige runner-kwaliteitsgate en standalone HTTP-smoke, maar de deployhelper bouwde vervolgens opnieuw met uitsluitend productie-dependencies. Daardoor ontbrak de oorspronkelijke Tailwind CLI in de nested Sites-installatie en brak de helper af vóór publicatie. De publieke health bleef aantoonbaar op de oude SHA `3107027ec2f7a82f908cddd621d53b1563e9bf26`.

De hostingcorrectie behoudt de oorspronkelijke Sites-package/lockfile: de nested installatie krijgt expliciet `--include=dev`, zodat de exact vastgelegde buildtooling ook in de helper beschikbaar is. TypeScript en de Next-typedeclaraties staan, net als bij de oorspronkelijke VPS-app, in de root productie-dependencies omdat de helper daaruit herbouwt. De UI/UX/content/assets en het bestaande VPS-script blijven ongewijzigd. Deze installatiemodus wordt lokaal gereproduceerd vóór de volgende gewone releasepush.

## Bewijs op het echte productiedomein

De publieke HTTP-controle slaagt opnieuw vanuit deze sessie: 30 originele bodyhashes, 56 assethashes/MIME-types, alle 14 HTTP-redirects inclusief querybehoud, het oorspronkelijke 404-document voor vervallen/onbekende routes, publieke SEO voor 29 pagina’s, leden-noindex, robots/sitemap, ETag/HEAD en exacte health-SHA. De productie-header zet geen algemene noindex op de publieke website.

De volledige browsercontrole is ook op `https://abso.dgwebservices.nl` uitgevoerd en geslaagd: alle 180 route/viewportcontroles, twintig referentie-/productiescreenshotparen, alle 45 trainings- en 80 intakecombinaties en menu/galerij/contact/rooster/kennisbank/FAQ/animaties. Er zijn geen JavaScript-fouten of horizontale overflow. De productiescreenshotvergelijking telt nul verschillen groter dan één RGB-niveau; 10 pixels hebben uitsluitend een afrondingsverschil van één niveau. Deze rendererafronding is apart gelogd; bronbytes, DOM en browserafmetingen zijn identiek.

Het onafhankelijke live browserbewijs staat in `docs/migration-evidence/production-browser-results.json`; de gekozen live screenshots hebben de prefix `production-`. De volledige overige productiescreenshotparen staan lokaal in `artifacts/sites-production/`.

Drie afzonderlijke homepage-GET-metingen vanaf de uitvoerhost staan in `docs/migration-evidence/production-performance.json`: TTFB 117–170 ms en volledige HTML-response 151–203 ms; alle drie HTTP 200. Dit zijn netwerkmetingen van deze host, geen Lighthouse-, echte-apparaat- of Core Web Vitals-score.

Er zijn geen blokkerende launchpunten voor deze UI/UX-migratie. Een echt leden-, betaal-, boekings- of mailbackendsysteem blijft buiten deze opdracht. Preview/staging blijft niet-indexeerbaar; de publieke productie-indexering is gecontroleerd. De definitieve rapport-/bewijsupdate staat op `main`; de gedeployde `production`-SHA hierboven behoudt exact dezelfde applicatiecode en assets.
