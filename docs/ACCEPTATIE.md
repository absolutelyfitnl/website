# Acceptatie van de overdracht en migratie

## Pakketcontrole

`controle/controleer-pakket.py` controleert de SHA-256 en bestandsgrootte van elk meegeleverd bestand, het afzonderlijke bronmanifest en de 10 originele foto's tegenover de gebruikte websitefoto's. Voer deze controle uit voordat je gaat bouwen of bestanden wijzigt. De referentie is commit `cd1f4e7f78b0e1f3ceea3d9d3d12ab9cf2456ed8`; alle 122 tracked bestanden zijn aanwezig. `.git`, dependencies, secrets en serverconfiguratie van buiten de bronrepo zijn niet meegeleverd.

## Websitevergelijking

```bash
# Standaard controleert dit de meegeleverde website op zichzelf.
python3 controle/vergelijk-website.py

# Controleer de statische uitvoer vóór de hostingadapter:
python3 controle/vergelijk-website.py /absoluut/pad/naar/nieuwe/dist

# Praktische interacties tegen het werkelijk gebruikte bestand:
node controle/test-practical.cjs /absoluut/pad/naar/nieuwe/dist/assets/practical.js
```

De vergelijking vereist alle 30 contentpagina's en identieke zichtbare body-markup, CSS/JS/fonts/logo's/foto's. Deploymentmetadata in `<head>`, `robots.txt`, sitemap-origin en de vervanging van aliasbestanden door HTTP-redirects mogen bewust veranderen. Er wordt ook gecontroleerd op lokale links/assets/fragments, H1, metadata en parsebare JSON-LD. Wanneer de adapter een andere interne mapindeling gebruikt, wijs naar zijn statische invoer/uitvoer met dezelfde route-indeling. Controleer daarna ook de daadwerkelijke HTTP-responses; een vergelijking op schijf alleen bewijst niet dat de server deze juist serveert.

Een afwijking is geen uitnodiging om de referentiechecks of hashes aan te passen. Onderzoek en herstel de migratie. Een bewuste extra wijziging buiten deployment vereist een nieuwe gebruikersopdracht en hoort afzonderlijk van deze exacte migratie.

`test-practical.cjs` gebruikt een beperkte DOM-testomgeving voor 80 intakecombinaties, contextoverdracht, reset, query-allowlists, e-mailvoorbereiding en weeknavigatie. Dit is geen volledige browsertest. De oorspronkelijke bouw heeft ook 45 combinaties van de trainingskeuze gecontroleerd; het zelfstandige trainings-testscript is niet in dit pakket aanwezig. Neem deze trainingsflow daarom op in de echte browsercontrole.

## Verplichte browsercontrole door de uitvoerende Codex

Vergelijk de meegeleverde bronpreview en de gemigreerde website onder dezelfde browser, viewport, klok/locale, fontstatus en animatiestatus. Laat fonts/afbeeldingen laden en vergelijk na animatie, naast een controle met reduced motion.

| Controle | Verwacht |
|---|---|
| Viewports | 1440, 1024, 768, 390, 375 en 320 px breed; geen onbedoelde horizontale scroll |
| Homepage | Exacte hero, positie foto 07, logo, sectievolgorde, NOC*NSF, Ooievaarspas, fotogalerij, footer |
| Header/menu | Transparantie en blur, uitsluitend drie zichtbare lijnen, focus bij openen/sluiten, Escape, aria-expanded, bruikbaar bij scroll |
| Galerij | Alle 10 beelden, correcte teller/bijschrift/alt, vorige/volgende en toetsenbord; 09/10 correct ingekaderd |
| Training | Doel/ervaring/begeleiding, vorige/herstart, zinvol resultaat, alle 45 combinaties en correcte contact-query |
| Intake | Alle 80 combinaties, voortgang, terug/herstart, productcontext, querybehoud richting contact |
| Contact | Query-allowlist, ervaring/product mee, validatie, mailto correct geëncodeerd, kopieeractie, verouderd voorbeeld wordt gewist |
| Rooster | Weeknavigatie/reset/filters, Amsterdam-datum, zeven dagen reguliere tijden; geen fictieve beschikbaarheid |
| Kennisbank/FAQ | Zoeken, filters, lege resultaten, accordions, inhoudslinks en negen complete artikelen |
| Toegankelijkheid | Native bediening, toetsenbord, focus, leesbare tekst/contrast, reduced motion, bruikbare mobiele CTA |
| Performance | Meten op het echte domein; geen Lighthouse-/Core Web Vitals-score claimen zonder meting |

## Inhoud en fotografie

- 29 publieke canonieke pagina's plus de toekomstige ledenpagina, 9 artikelen met 28 secties, 10 FAQ's, 4 producttypen en 11 disciplines.
- NOC*NSF en Ooievaarspas blijven op homepage én hun eigen pagina's staan; de volledige voorwaarden blijven gelijk.
- Alleen de 10 bijlagefoto's renderen, geen oude repo-foto, stockfoto of nieuw gegenereerd beeld. Officiële logo's/grafische SVG's blijven behouden.
- Contact, tarieven, reguliere uren en jeugdvoorwaarden blijven gelijk aan de gekozen bron; geen nieuwe claims of fake reviews.
- Geen operationele leden-/betaal-/boekingsomgeving of open demo-backoffice. Geen echte mailverzending claimen.

## Git en deployment

- Actuele oude remote heads staan op geverifieerde, unieke archive-refs voordat de actieve app wordt vervangen.
- Geen force push/history rewrite; normale migratiecommit/PR en behoud van branchbescherming.
- 12 publieke legacyroutes krijgen echte 301/308 met querybehoud. De 2 ledenaliases verwijzen naar de toekomstige ledenpagina; oude subroutes hebben expliciet 404/410 of een passende verwijzing, geen oude demo.
- Alle assets met juiste MIME-types, diepe routes direct bereikbaar, ontbrekende route geeft echte 404.
- Preview blijft noindex; bedoelde publieke productie heeft correcte origin, canonicals, sitemap, OG, JSON-LD en robots.
- Kwaliteitsgate en standalone-smoke werken met nieuwe verwachtingen. `/api/health` gebruikt de actuele release-SHA en `no-store`.
- Geen productiepush tijdens alleen voorbereiding/PR. Bij opgedragen release bestaande runner gebruiken en eindresultaat op exacte SHA controleren.

## Reeds gedaan versus nog te doen

De bron is gebouwd en inhoudelijk gecontroleerd tijdens het maken van de website; 29 bronroutes en 9 volledige artikelen waren aanwezig. Tijdens het maken van dit pakket zijn snapshot-, foto-, checksum-, ZIP- en meegeleverde scriptcontroles uitgevoerd; zie `VERIFICATIE.md` voor de concrete resultaten. Dit bewijst geen GitHub-migratie, actuele productie-SEO, echte browserpariteit of gemeten performance. Die controles zijn onderdeel van de uitvoering door het ontvangende Codex.
