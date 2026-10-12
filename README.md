# Absolutely Fit

De volledige geselecteerde Sites-website (concept 20, Absolutely Perspective), rechtstreeks overgenomen uit broncommit `cd1f4e7f78b0e1f3ceea3d9d3d12ab9cf2456ed8`. `site/src/` en `site/dist/assets/` zijn de oorspronkelijke implementatie. Next levert de gegenereerde HTML zonder React-herschrijving uit en behoudt het bestaande standalone/VPS-contract.

## Lokaal

Node 24 en npm 11:

```bash
npm ci
npm run dev
```

`npm ci` installeert ook de exact vastgelegde Sites-builddependencies, expliciet inclusief de nested development-buildtools. De VPS-helper herbouwt na de kwaliteitsgate vanuit een productie-installatie; TypeScript/Next-typedeclaraties blijven daarom in de root productie-dependencies. **Wis `site/dist/assets/` nooit:** deze map bevat de handgeschreven CSS/JavaScript, fonts, SVG's en tien foto's. De historische documenten in `site/` zijn uitsluitend bronreferentie en Tailwind-scaninput; ze zijn geen nieuwe ontwerp- of delegatieopdracht. Behoud ze voor een bytegelijke CSS-build. De gekozen ontwerpafspraak staat in `docs/UI-UX-EN-CONTENT.md`.

## Verificatie

```bash
npm run check
npm run audit
BASE_URL=http://127.0.0.1:3000 npm run qa:http
npx playwright install chromium
REFERENCE_URL=http://127.0.0.1:8000 npm run qa:browser
```

`qa:http` controleert de daadwerkelijk geserveerde DOM/assetbytes, routes, redirects, querybehoud, SEO, sitemap, cache/MIME en releasehealth. Geef `APP_ENVIRONMENT`, `APP_REVISION` en `NEXT_PUBLIC_SITE_URL` dezelfde waarden als tijdens build/start. `qa:browser` vergelijkt zes viewports met een afzonderlijk gestarte, ongewijzigde overdrachtsreferentie en test de oorspronkelijke interacties. `VISUAL_COMPARE=false` controleert een server zonder aparte referentie. Browserbewijzen staan lokaal in `artifacts/sites-migration/`.

De onafhankelijke pakketmanifesten staan ongewijzigd in `tests/reference/`. `body-sha256.json` is rechtstreeks afgeleid van de bevroren referentie. De inhoudsgate controleert 30 body-markups, 56 assets, 10 foto's en 28 fonts op exacte hashes. Latere, expliciet gevraagde assetwijzigingen staan met oorspronkelijke en nieuwe hash in `tests/approved-asset-changes.json`; dezelfde exacte controle geldt lokaal, in standalone en via HTTP. Op 12 oktober 2026 is alleen de gedeelde headerbreedte aangepast aan de inhoudscontainers op desktop, tablet en mobiel. De oorspronkelijke visuele migratiereferentie bevat deze vervolgaanpassing nog niet. Fontlicenties/herkomst staan in `docs/licenses/`; de eerdere rechtenregistratie blijft in `docs/FACTS-AND-RIGHTS-REGISTER.md` en `docs/publication-approvals.json`.

## Productie

Een gewone push naar `production` start de bestaande self-hosted runner en `/usr/local/bin/dg-site-deploy`. Node 24, Next standalone, loopbackbinding, runtime-env-sleutels en `/api/health` blijven behouden. De workflow bouwt de exacte SHA, draait lint/typecheck/inhoudstests/build/audit en controleert het standalone-artefact en de publieke HTTP-responses.

Buildmetadata is omgevingsafhankelijk. `APP_ENVIRONMENT=production` en een HTTPS-origin in `NEXT_PUBLIC_SITE_URL` maken de 29 publieke pagina's indexeerbaar. Alle andere builds blijven noindex. `/ledenapp/` blijft noindex en buiten de sitemap. De 14 oorspronkelijke aliases geven HTTP 308 met querybehoud. Vervallen demo-/backofficeroutes geven 404 met de originele 404-pagina.

Het contactformulier bereidt een e-mail voor; het verzendt niets automatisch. Er is geen leden-, betaal- of boekingsbackend. Zie `MIGRATIERAPPORT.md` voor archiefrefs, vergelijking, release en verificatie.
