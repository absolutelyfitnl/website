# Canon voor UI, UX en content — Absolutely Fit

Deze canon beschrijft de bestaande implementatie die ongewijzigd moet worden overgenomen. Het is geen nieuw ontwerpbrief. De gebruiker koos uitsluitend concept 20, **Absolutely Perspective**. De overige concepten en de oude actieve website mogen niet naast deze nieuwe website blijven bestaan. De oude GitHub-versie blijft uitsluitend behouden via de vooraf aangemaakte en gecontroleerde archive-branch en de bestaande Git-geschiedenis.

## Vast referentiepunt

- Broncode: commit `cd1f4e7f78b0e1f3ceea3d9d3d12ab9cf2456ed8` van de huidige Absolutely Fit Sites-implementatie.
- De meegestuurde exacte broncodesnapshot is de maatstaf voor uiterlijk, gedrag, tekst, routes, foto's en overige assets. Kopieer die implementatie; bouw haar niet opnieuw na vanuit een screenshot of beschrijving.
- De openbare sportschoolinhoud is afkomstig uit `https://github.com/absolutelyfitnl/website`, commit `3107027ec2f7a82f908cddd621d53b1563e9bf26`, en reeds verwerkt in de snapshot. Dat oude commitnummer is inhoudsherkomst, **niet** automatisch het te archiveren GitHub-commit: archiveer bij uitvoering de dan actuele remote versie.
- `CONTENT-MIGRATION.md` bevat de inhoudelijke inventaris en bronverwijzingen. Historische ontwerpbriefs en oude conceptinstructies in de snapshot zijn geen opdracht om andere concepten te herstellen.
- Behoud DOM-structuur, volgorde, teksten, koppen, lettertypen, marges, kleuren, afbeeldingskaders, uitsneden, responsive regels, links, toegankelijke labels en alle interactiestaten. Geen nieuw componentenpakket, alternatief lettertype, extra stockbeeld of ongevraagde herformulering.

## Exacte bronlocaties

| Bestand of map | Functie |
|---|---|
| `src/build.mjs` | Statische HTML-generator; gedeelde header, menu, footer, metadata, structured data, ledenvooruitblik, aliases, sitemap en 404 |
| `src/pages/home-base.html` | Gekozen homepagecompositie van concept 20 |
| `src/pages/home.mjs` | Homepageaanvullingen, waaronder NOC*NSF, Ooievaarspas, fotogalerij en kennisbank |
| `src/pages/training.mjs` | Sportaanbod, trainingsdetailpagina's, personal training en begeleiding |
| `src/pages/club.mjs` | Over ons, team, topsport, Ooievaarspas, media en abonnementen |
| `src/pages/knowledge.mjs` | Kennisbank, complete artikelen en FAQ |
| `src/pages/practical.mjs` | Openingstijden, rooster, intake en contact |
| `src/content/articles.json` | Negen volledige artikelen, 28 secties, brondata en gerelateerde inhoud |
| `src/content/page-manifest.json` | Canonieke lijst van 30 inhoudspagina's |
| `dist/assets/site.css`, `home.css` | Werkelijke gedeelde vormgeving en homepagevormgeving |
| `dist/assets/site.js` | Menu, sticky header, openingsstatus, Motion en galerij/lightbox |
| `dist/assets/training.js` | Trainingsroute met drie vragen |
| `dist/assets/practical.js` | Intakewizard, contactvoorbereiding, weeknavigatie en filters |
| `dist/assets/knowledge.js` | Kennisbank- en FAQ-zoekfuncties, filters en artikelinhoudsopgave |
| `dist/assets/photos/` | Precies de tien bijlagefoto's |
| `dist/assets/fonts.css`, `font-*.woff2`, `motion.js` | Lokale lettertypen en Motion-runtime |
| `dist/assets/*.svg` | Bestaande merk- en lintassets, NOC*NSF- en Ooievaarspas-logo's |
| `src/tailwind.css`, `package.json`, `package-lock.json` | Tailwind-invoer en vastgelegde buildafhankelijkheden |

**Cruciaal: `dist/` is hier niet uitsluitend gegenereerde uitvoer.** De bewerkbare CSS, JavaScript, foto's, lettertypen en SVG's staan in `dist/assets/`. De build maakt deze bestanden niet opnieuw uit een andere bronmap. Verwijder `dist/` dus niet voorafgaand aan een build en voeg geen generieke clean-stap toe die deze assets wist. Neem de complete map uit de snapshot over. `npm ci` gevolgd door `npm run build` genereert HTML, metadata en Tailwind-CSS opnieuw; behoud daarbij de overige assets.

De implementatie gebruikt statische HTML met Node als buildstap, Tailwind CSS 4 en lokaal geladen Motion 12. Een React-/Next.js-herschrijving is geen vereiste en mag de exacte overname niet vervangen. Een hostingadapter mag alleen veranderen wat aantoonbaar nodig is om dezelfde bestanden, routes en HTTP-statussen te serveren.

## Vormgeving en beelden

Behoud de lichte ijsblauwe basis, witte panelen, donkerblauwe tekst, blauwe acties, subtiele violette linten, Manrope-koppen en Inter-tekst. Behoud de gekantelde fotokaders en dezelfde homepagehero. De header is licht transparant met blur; de zichtbare menutrigger bestaat alleen uit drie streepjes, met een toegankelijk label. Het mobiel vaste intakeblok hoort bij de bestaande UI.

De actuele CSS is doorslaggevend. Zo gebruikt de uiteindelijke koptekstverfijning `#6089ca`; oudere ontwerpnotities noemen nog `#82aefb`. Neem alle huidige CSS-regels en hun volgorde mee in plaats van kleuren uit de notities opnieuw af te leiden.

Er zijn precies tien originele foto's: `club-01.webp` en `club-02.jpg` tot en met `club-10.jpg`. De gepubliceerde fotobestanden zijn byte-identiek aan de ontvangen bijlagen. Mensen, toestellen, reflecties en gebouwen moeten exact hetzelfde blijven. Voeg geen andere sporters, portretten, gebouwen, sportschoolfoto's of gegenereerde foto's toe. De huidige professionele presentatie gebeurt met CSS-uitsneden en een beperkte CSS-helderheids-/contrastcorrectie. Foto 09 en 10 bevatten telefooninterface in het originele bestand; de bestaande CSS kadert die interface uit. Behoud de originele bestanden én deze presentatie.

Alle tien foto's moeten bereikbaar blijven in de galerij en lightbox. Bestaande Absolutely Fit-SVG's en de ongewijzigde NOC*NSF-/Ooievaarspas-merken zijn grafische assets en blijven behouden. Herteken of vervang het logo niet tijdens deze migratie.

## Inhoud en routes

De aantallen zijn gecontroleerd: **29 publieke informatiepagina's + 1 toekomstige ledenpagina = 30 inhoudspagina's**, plus **14 aliaspagina's + 1 aparte 404 = 45 HTML-bestanden**. De 29 publieke pagina's omvatten negen volledige kennisbankartikelen. De sitemap bevat 29 URL's; `/ledenapp/` hoort daar niet in.

De twaalf aliases uit de oude publieke website blijven bestaan: `/mijn-eerste-bezoek/`, `/sporten/personal-training/`, `/blog/` en de negen oude `/blog/{slug}/`-routes. De huidige implementatie heeft daarnaast `/inloggen/` en `/ledenportaal/` als verwijzing naar de eerlijke ledenvooruitblik. Daarom noemt de broninventaris twaalf legacy routes en de huidige build veertien aliases; dat is geen ontbrekende inhoud.

Behoud alle vier producttypen, elf sportdisciplines, tien FAQ-antwoorden, volledige artikelen inclusief publicatie-/bijwerkdata, de mediasamenvatting en neutrale XXL Nutrition-tekst. Verander bestaande artikeldatums niet naar de migratiedatum. De oude afbeeldingsreferenties in `articles.json` zijn herkomstvelden; ze mogen niet weer als bronfoto's worden weergegeven.

Belangrijke feiten en beperkingen:

- Absolutely Fit is de familieclub in het Scheveningse Havenkwartier sinds 2008. Adres: Doctor Lelykade 240, 2583 CP Den Haag. Telefoon: 070 358 77 81. E-mail: `info@absolutely-fit.nl`.
- Reguliere uren: maandag–donderdag 07:00–22:00, vrijdag 07:00–21:00, zaterdag–zondag 08:00–15:00. Feestdagen of afwijkingen persoonlijk navragen.
- Vanaf € 24,50 per maand is een startprijs. Koppel deze niet zelf aan een product. Producten zijn 1× per week, onbeperkt trainen, 10-rittenkaart en jeugd; individuele prijzen en contractvoorwaarden zijn niet vastgesteld in deze bron.
- De gratis persoonlijke intake is een gesprek; maak er geen gratis proeftraining van.
- NOC*NSF blijft nadrukkelijk aanwezig in historische/redactionele topsportcontext. Voeg geen certificeringsclaim, officiële partnerstatus, endorsement, registratienummer, geldigheid of `award`/`credential`/`affiliation` aan structured data toe. Behoud Rik Priesters in de bron opgenomen kampioenschapsgeschiedenis en de uitleg over toepasbare topsportervaring.
- Ooievaarspas: 50% korting op een **daarvoor in aanmerking komend abonnement**; voor jeugd **onder 18 jaar** een vergoeding van **100% mits dit de eerste sport is**. De toepassing per product is onbekend en wordt persoonlijk besproken. Niet elk product voorzien van een 50%-badge en geen prijzen zelf halveren. Behoud de officiële aanvraag-/aanbiedingslinks en de relevante FAQ.
- XXL Nutrition blijft neutrale informatie op de bestaande drie plaatsen. Voeg geen affiliate-URL, productfoto, onbevestigde winkelverkoop of voedings-/gezondheidsclaim toe.
- Verzin geen reviews, aantallen leden, juridische documenten, extra diensten, teamrollen of namen bij onbekende personen op foto's.

## Interacties die identiek moeten blijven

- Het volledige menu opent als native `dialog`; toetsenbordbediening, Escape, sluiten, focusherstel, `aria-expanded` en het afschermen van de onderliggende pagina blijven werken. Alle publieke routes blijven bereikbaar via echte links.
- Galerij: alle tien beelden; vorige/volgende, pijltjestoetsen, sluiten, focusherstel en correcte bijschriften/alt-teksten.
- Openingsstatus en weeklabels gebruiken **Europe/Amsterdam**. De status vermeldt reguliere uren en wordt bijgewerkt.
- Trainingsroute: doel × ervaring × begeleiding, drie stappen, terug/volgende, resultaat en opnieuw kiezen. Alle 45 antwoordcombinaties blijven werken. Contact ontvangt ook `ervaring`, naast doel en begeleiding.
- Intakevoorbereiding: doel × moment × begeleiding, drie stappen, voortgang, terug/volgende, aanpassen/reset, passend resultaat. Alle 80 combinaties blijven werken. Een vanuit abonnementen meegegeven productkeuze blijft behouden.
- Contact: vaste allowlists voor queryparameters, normale formuliervalidatie, overzicht van context, correct geëncodeerde `mailto:` en kopieerbare berichttekst. Het formulier **bereidt een e-mail voor**; het verstuurt niet automatisch, claimt geen aflevering en slaat geen persoonsgegevens op. Na bewerken wordt een eerder klaargezet bericht ingetrokken totdat het opnieuw is voorbereid.
- Rooster: zeven reguliere dagen, vorige/volgende/deze week, vandaagmarkering en trainingsfilters. Begeleide momenten blijven op aanvraag. Gebruik de oude repo-fixtures niet als echte beschikbaarheid of boekbare plaatsen.
- Kennisbank: zoekveld, categorieknoppen, resultaatcount, lege toestand en reset. Artikelen houden hun volledige inhoud, inhoudsopgave en gerelateerde links. FAQ houdt zoeken, categorieën, reset en native accordions.
- Motion, CSS-view-transitions en subtiele hover-/scroll-effecten blijven behouden met `prefers-reduced-motion`-ondersteuning. Inhoud en basisnavigatie blijven statisch beschikbaar.
- `/ledenapp/` blijft een duidelijk als toekomstig aangeduide informatiepagina. Geen echte accounts, betalingen, facturen, reserveringen, demoleden of open backoffice activeren. Een werkelijk ledensysteem is een later afzonderlijk project.

## Alleen noodzakelijke hosting- en SEO-aanpassing

De snapshot is ingesteld voor een besloten preview: `noindex,follow`, `robots.txt` met `Disallow: /` en canonicals, Open Graph, JSON-LD en sitemap op de huidige Sites-origin. Dat is de juiste exacte referentie, maar niet de definitieve openbare SEO-configuratie.

Maak voor de doelhosting origin en indexeerbaarheid configureerbaar zonder visuele/contentwijzigingen. Gebruik de werkelijk bevestigde doelomgeving en domeinnaam, niet een verondersteld domein. Preview/staging blijft niet-indexeerbaar. Op de expliciet openbare productieomgeving moeten canonical, Open Graph, structured data, sitemap en robots consistent naar dat domein verwijzen en openbare pagina's indexeerbaar zijn. Houd ledenvooruitblik, aliases en 404 buiten de publieke sitemap en indexeer 404/aliases niet als zelfstandige inhoud.

De statische aliases zijn nu meta-refresh/JavaScript-fallbacks, geen echte serverredirects. Configureer bij de doelhost echte permanente HTTP 301/308-redirects met behoud van querystring waar relevant. Niet-bestaande routes moeten een echte 404-status krijgen met de meegeleverde 404-pagina; gebruik geen algemene SPA-fallback die elke onbekende route als 200 serveert.

`.openai/hosting.json` hoort bij de bestaande Sites-identiteit en is referentiemateriaal. Verbind de GitHub-doelomgeving hiermee niet per ongeluk aan de bestaande Sites-publicatie. Hosting- of CI-aanpassingen moeten de bestaande infrastructuur/secrets respecteren en uitsluitend de gekozen migratie bedienen.

## Verificatiegrens

De aanwezige README beschrijft uitgevoerde bouw-, inhouds-, link-, asset- en gerichte interactiecontroles. **Visuele browser-QA en echte apparaat-/prestatiemetingen zijn nog niet uitgevoerd.** Noem de migratie pas visueel geverifieerd nadat de ontvanger de meegeleverde referentie en de gemigreerde versie in een echte browser heeft vergeleken, inclusief mobiele formaten, menu, lightbox, formulieren en beide keuzehulpen. Eventuele noodzakelijke correcties mogen geen redesign of inhoudsverlies veroorzaken; leg iedere afwijking van deze snapshot concreet vast.
