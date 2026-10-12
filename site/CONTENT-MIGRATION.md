# Absolutely Fit — volledige publieke inhoudsaudit

Gecontroleerd op 12 oktober 2026. Bron: `https://github.com/absolutelyfitnl/website`.
Lokale repository: `/workspace/scratch/77576398392d/research/absolutely-fit-repo`.
Lokale HEAD én remote HEAD zijn identiek: `3107027ec2f7a82f908cddd621d53b1563e9bf26` (via `git rev-parse HEAD` en `git ls-remote origin HEAD`). De bronrepository is ongewijzigd.

## Volledigheid in één overzicht

De repository heeft **29 canonieke publieke informatiepagina's**: 16 vaste routes, 4 trainingsdetailpagina's en 9 volledige kennisbankartikelen. Daarnaast zijn er **12 permanente legacy redirects**. Er zijn geen privacyverklaring-, cookieverklaring-, algemene-voorwaarden- of contractpagina's in deze bron. Er zijn wel 17 app/login/leden/beheerroutes; die bevatten lokale prototypes en horen niet als reeds werkende ledendienst gepresenteerd te worden. De eerdere conceptpagina's waren selecties; voor deze opdracht moet alle onderstaande inhoud bereikbaar terugkomen.

## Publieke sitemap en exacte bronlocaties

| Route | Inhoud die moet worden overgenomen | Primaire bron |
|---|---|---|
| `/` | Familieclub sinds 2008; slogan Fitness zoals het bedoeld is; zelfstandig/persoonlijk trainen; complete trainingsvloer; 11 disciplines; 5 hoofdrichtingen; 4 producten; startprijs; Ooievaarspas; intakevoorbereiding; familieclub; topsport/NOC*NSF; Rond de Haven; kennisbank; openingstijden; adres/contact | `app/page.tsx`, central data hieronder |
| `/sporten` | 5 richtingen + 11 volledige disciplines; beginners welkom; zelfstandig of begeleid; interactieve trainingsroute | `app/sporten/page.tsx`, `lib/site-data.ts`, `components/training-route.tsx` |
| `/sporten/krachttraining` | Kracht, spiermassa, belastbaarheid; vrije gewichten/machines; voor starters en ervaren sporters; techniek, rustige belasting, planmatige voortgang; XXL Nutrition-context | `app/sporten/[slug]/page.tsx`, `lib/site-data.ts`, `components/content-sections.tsx` |
| `/sporten/cardio-conditie` | Uithoudingsvermogen, energie, algemene fitheid; starters/herstarters; passend niveau, afwisseling intensiteit, combinatie kracht | idem |
| `/sporten/powerlifting-gewichtheffen` | Techniek/kracht/vertrouwen; squat, bench press, deadlift, gewichtheffen; techniekanalyse, programmering, wedstrijdcontext waar relevant | idem |
| `/sporten/strength-conditioning` | Kracht, conditie, snelheid, belastbaarheid voor eigen sport; sportanalyse, periodisering, combineren kracht/conditie | idem |
| `/begeleiding` | 4 stappen (intake, startpunt, plan, ontwikkelen); Rik; kracht/conditie/techniek/prestatie; specialistische coaching; topsportcontext; trainingsroute | `app/begeleiding/page.tsx` |
| `/personal-training` | Één-op-één; techniek, opbouw, doel/tijd; atletenvoorbereiding, powerlifting, gewichtheffen, Strength & Conditioning en afvaltrajecten; intake; feedback, evaluatie | `app/personal-training/page.tsx`, `lib/content/site.ts` |
| `/abonnementen` | Exact 4 producten; vanaf € 24,50/maand; vrije training of professionele begeleiding; intake inbegrepen bij bepaalde abonnementen/PT; vergelijking/keuzehulp; Ooievaarspas; relevante FAQ | `app/abonnementen/page.tsx`, `lib/content/memberships.ts` |
| `/gratis-persoonlijke-intake` | Gratis persoonlijk gesprek, geen proeftraining; doel/ervaring/planning/begeleiding; wizard; productprefill; Ooievaarspas; afronden met telefoon/mail | `app/gratis-persoonlijke-intake/page.tsx`, `components/first-visit-wizard.tsx` |
| `/ooievaarspas` | Exacte 50%-claim, jeugdvergoeding met beide voorwaarden; 3 stappen; contactonderwerp; officiële gemeentelijke aanvraag en aanbieding; 5 gerelateerde FAQ | `app/ooievaarspas/page.tsx`, `lib/content/partners.ts`, `lib/content/faq.ts` |
| `/rooster` | Reguliere cluburen + pagina voor begeleide trainingsmomenten met filters; huidige bronroosterdata zijn lokale fixtures (zie caveat) | `app/rooster/page.tsx`, `components/public-schedule.tsx`, `lib/demo-data.ts`, `lib/schedule-storage.ts` |
| `/openingstijden` | Alle 7 dagen; Europe/Amsterdam openingstatus; feestdagen/uitzonderingen navragen; route, telefoon, mail | `app/openingstijden/page.tsx`, `lib/content/opening-hours.ts` |
| `/over-ons` | Familieclub Havenkwartier sinds 2008; oprichter/krachtsportverleden; tijdlijn 1990/2008/vandaag; waarden welkom/helder/betrokken/ontwikkeling; NOC*NSF-context; media | `app/over-ons/page.tsx`, `lib/content/claims.ts`, `components/content-sections.tsx` |
| `/team` | Rik Priester oprichter/coach, 1990 wereldkampioen/meervoudig NL kampioen; clubteam ontvangst/begeleiding; persoonlijke techniek/trainingsopbouw; recreatief tot olympisch niveau | `app/team/page.tsx`, `lib/content/claims.ts` |
| `/topsport-en-ntc` | Topsportkennis; doelgericht/doseerbaar/meetbaar/aanpasbaar; NOC*NSF-markering; Rik sportgeschiedenis; begeleiding t/m olympisch; officiële NOC*NSF-link | `app/topsport-en-ntc/page.tsx`, `lib/content/claims.ts` |
| `/veelgestelde-vragen` | Alle 10 vragen, 6 categorieën | `app/veelgestelde-vragen/page.tsx`, `lib/content/faq.ts` |
| `/in-de-media/rond-de-haven-2026` | Eigen samenvatting familieclub/trainingsvisie/ontmoetingsplek, bronvermelding Rond de Haven zomer 2026 pagina 6 | `app/in-de-media/rond-de-haven-2026/page.tsx` |
| `/kennisbank` | Overzicht van alle 9 artikelen, categorie, intro, leestijd, links | `app/kennisbank/page.tsx`, `lib/content/articles.ts` |
| `/contact` | Adres, telefoon, mail, route, uren; formulier met onderwerp/product/doel/moment/begeleiding/bericht; vooringevulde wizardkeuzes; persoonlijk afronden | `app/contact/page.tsx`, `components/contact-form.tsx` |

### Alle 9 kennisbankartikelen

Neem alle secties, alinea's, opsommingen, afsluitende takeaways en gerelateerde links uit `lib/content/articles.ts` over; geen korte samenvatting ter vervanging van artikelinhoud. Bronrenderer: `app/kennisbank/[slug]/page.tsx`.

| Route achter `/kennisbank/` | Titel | Categorie/leestijd | Secties |
|---|---|---|---|
| `kleine-stappen-duurzaam-sterker` | Kleine stappen, duurzaam sterker: zo bouw je een trainingsritme op | Trainingsritme / 7 min | Begin bij wat werkelijk past; Maak de eerste stap klein genoeg; Evalueer zonder haast |
| `beginnen-met-krachttraining-scheveningen` | Beginnen met krachttraining in Scheveningen: wat kun je verwachten? | Krachttraining / 6 min | Eerst begrijpen waar je begint; Techniek vóór haast; Van begeleiding naar zelfstandigheid |
| `topsportkennis-voor-ieder-niveau` | Topsportkennis voor ieder niveau: wat betekent dat in de praktijk? | Begeleiding / 7 min | Ervaring als stevig vertrekpunt; Het principe blijft, de uitvoering verandert; Meten wat voor jou betekenis heeft; Coaching is ook uitleg |
| `wat-gebeurt-er-tijdens-een-gratis-persoonlijke-intake` | Wat gebeurt er tijdens een gratis persoonlijke intake? | Gratis intake / 5 min | Jouw vraag staat centraal; Je bekijkt de mogelijkheden; Een concrete vervolgstap |
| `sporten-met-de-ooievaarspas-bij-absolutely-fit` | Sporten met de Ooievaarspas bij Absolutely Fit | Ooievaarspas / 5 min | Wat de korting betekent; Wat je zelf regelt; Privacy bij je eerste contact |
| `sportschool-als-ontmoetingsplek-havenkwartier` | Een sportschool als ontmoetingsplek in het Havenkwartier | Clubverhaal / 6 min | Een vertrouwde plek aan de haven; Verschillende doelen, dezelfde aandacht; Familieclub als dagelijkse praktijk |
| `sterker-worden-begint-met-techniek` | Sterker worden begint met techniek | Training / 6 min | Techniek is een middel; Eerst controle, dan gewicht; Feedback ondersteunt het leren |
| `waarom-herstel-bij-training-hoort` | Waarom herstel bij training hoort | Herstel / 5 min | Vooruitgang vraagt ruimte; Let op patronen; Rust hoeft niet ingewikkeld te zijn |
| `zo-bouw-je-een-trainingsschema-op` | Zo bouw je een trainingsschema op | Kennis / 8 min | Begin bij je week; Kies de hoofdzaken; Maak ontwikkeling zichtbaar |

De eerste 6 zijn gepubliceerd 2026-09-07; de laatste 3 op 2026-08-20, 2026-08-12, 2026-08-04. Alle bijgewerkt 2026-09-07 behalve topsportkennis 2026-09-08. Behoud deze brondata; publicatie van een nieuw ontwerp is geen nieuwe artikeldatum.

### 12 legacy routes

- `/mijn-eerste-bezoek` → `/gratis-persoonlijke-intake`
- `/sporten/personal-training` → `/personal-training`
- `/blog` → `/kennisbank`
- Alle 9 `/blog/{artikel-slug}` → `/kennisbank/{zelfde-slug}`

De oorspronkelijke Next-site gebruikt `permanentRedirect`. Bij statische Sites kunnen link/canonical/meta-refresh fallbackpagina's bestaan, maar claim dat niet als echte server-301; regel echte 301/308 bij uiteindelijke productieoverdracht.

## Centrale bedrijfsfeiten en tekst

Bronnen: `lib/content/site.ts`, `opening-hours.ts`, `memberships.ts`, `claims.ts`.

- **Absolutely Fit**, familiegedreven sportschool, sinds **2008**, **Scheveningse Havenkwartier**.
- **Doctor Lelykade 240, 2583 CP Den Haag**, land NL. Geen andere/historische adresgegevens toevoegen.
- Telefoon **070 358 77 81**, tel-link `+31703587781`; e-mail `info@absolutely-fit.nl`.
- Route: `https://www.google.com/maps/search/?api=1&query=Doctor+Lelykade+240+Den+Haag`.
- Regulier ma–do **07:00–22:00**, vr **07:00–21:00**, za–zo **08:00–15:00**. Geen bevestigde feestdaguren; vooraf contact bij uitzonderingen. Openingstatus berekenen in **Europe/Amsterdam**.
- Startprijs: **Sporten vanaf € 24,50 per maand**. Geen individueel product aan deze prijs koppelen zonder bevestiging.
- Intakezin: **Een intakegesprek is inbegrepen bij bepaalde abonnementen of bij Personal Training.** Bron noemt daarnaast steeds gratis persoonlijke intake; houd beide claims naast elkaar waar passend, geen gratis training suggereren.
- Flexibiliteit: **Kies voor individueel vrij sporten of ga aan de slag onder professionele begeleiding.**
- Specialistische coaching: **Uitgebreide atletenvoorbereiding en coaching voor diverse sporten, waaronder powerliften en gewichtheffen. Ook gespecialiseerd in Strength & Conditioning voor diverse sportdisciplines en gericht op afvaltrajecten. Neem contact op voor meer informatie.**
- Conversie: **Plan je gratis persoonlijke intake** / **Gratis persoonlijke intake**. Persoonlijk gesprek over doel, ervaring, moment en begeleiding, **geen proeftraining**.

### Exacte 4 producten

| Naam / interne ID | Kern | Niet in bron bevestigd |
|---|---|---|
| 1× per week / `weekly` | Eén trainingsmoment per week; persoonlijk bespreken tijdens intake | Eigen prijs, looptijd, betaalfrequentie, opzegvoorwaarden, Ooievaarspas-toepassing |
| Onbeperkt trainen / `unlimited` | Onbeperkt binnen actuele openingstijden; flexibel weekritme | Eigen prijs, looptijd, betaalfrequentie, opzegvoorwaarden, Ooievaarspas-toepassing |
| 10-rittenkaart / `ten-visit` | Tien trainingsbezoeken; een rittenkaart, geen automatisch abonnement | Prijs, geldigheid, overdraagbaarheid, Ooievaarspas-toepassing |
| Jeugd / `youth` | Jeugdproduct; leeftijd en praktische begeleiding bespreken | Productleeftijdsgrenzen, prijs, looptijd, begeleiding, Ooievaarspas-toepassing |

### Volledig aanbod: 11 disciplines

Cardio- en conditietraining; Spierconditietraining; Gewichtheffen; Powerlifting; Bodybuilding; Krachttraining; Techniektraining; Personal training; Sportspecifieke training; Persoonlijke trainingsprogramma’s; Strength & Conditioning.

### Team, clubgeschiedenis en prestaties

- Rik Priester: **oprichter en coach**; in topsportcopy ook **Rik Priester senior**.
- **Meervoudig Nederlands kampioen** en **wereldkampioen powerliften in 1990**.
- Club begeleidde van eerste serieuze training tot Nederlandse kampioenen, internationale topsporters en olympische atleten; geen sporternamen, endorsements of fictieve quotes nodig.
- Specialiteiten Rik: krachttraining, powerlifting, gewichtheffen, persoonlijke begeleiding.
- Tweede profiel is generiek **Het clubteam — Begeleiding en ontvangst**; intake, techniekuitleg, trainingsopbouw, gastvrije clubvloer.
- `FACTS-AND-RIGHTS-REGISTER.md` noemt 1983 Nederlands kampioenschap als historische goedgekeurde claim, maar daadwerkelijke publieke tijdlijn gebruikt **1990, 2008, Vandaag**. Preserve published approach, no need to add 1983.
- Henriëtte, Rik jr./Ricardo, René en Luc worden in interne rechtenregistratie genoemd, maar precieze huidige rollen ontbreken. Niet ongevraagd nieuwe teamrollen invullen of gezichten identificeren op nieuwe foto's.
- Oudere militaire/BBE/duiker/brandweer/onderwijsdetails zijn bewust redactioneel weggelaten. Niet terugplaatsen als clubdiensten.

## Ooievaarspas: niet weglaten, exact kwalificeren

Bron: `lib/content/partners.ts`; dedicated page + homepage + abonnementen + intake + FAQ + kennisbank + contactonderwerp.

**Volwassen/basisclaim:** “Met een geldige Ooievaarspas ontvang je bij Absolutely Fit 50% korting op een daarvoor in aanmerking komend abonnement.”

**Jeugdclaim:** “Voor jeugd onder de 18 jaar geldt met de Ooievaarspas een vergoeding van 100 procent, mits dit de eerste sport is.”

Actuele productoptie en voorwaarden persoonlijk afstemmen. `eligibilityByProduct` is `unknown` voor alle 4 producten: geen badge “50% korting” op elk product, geen prijs halveren.

Drie stappen: controleer/regel geldige pas via gemeentelijke procedure → neem contact op, onderwerp Ooievaarspas → bespreek toepassing tijdens gratis intake. Neem geldige pas mee; stuur geen pasnummer, inkomensbewijs of andere gevoelige documenten via algemeen formulier.

Officiële links die bron gebruikt:
- Aanvraag: `https://www.denhaag.nl/nl/geld-en-schulden/ooievaarspas-aanvragen/`
- Aanbod: `https://ooievaarspas.nl/aanbiedingen/fitness-voor-iedereen-voel-je-absolutely-fit/`

## Topsport, NTC en NOC*NSF

Belangrijk verschil: **de pagina en het NOC*NSF-logo moeten terugkomen**, maar de bron publiceert bewust **geen certificeringsclaim**. `publication-approvals.json` heeft `nocNsfCertificationExistsOwnerConfirmed: true` en `nocNsfCertificationAdvertisingApproved: false`; specifieke registratie/scope/geldigheid ontbreekt.

Goedgekeurd openbaar:
- Origineel ongewijzigd NOC*NSF-logo, context topsportgeschiedenis.
- “Topsportervaring vertaald naar ieder niveau”.
- Rik's kampioenschapsgeschiedenis en begeleiding tot olympisch niveau.
- Principes: doelgericht, doseerbaar, meetbaar, aanpasbaar.
- Link `https://www.nocnsf.nl/en/elite-sports-in-the-netherlands/national-training-centres`.

Niet toevoegen: gecertificeerd/erkend/official partner/NOC*NSF-endorsement, credential-ID, scope of geldigheid, of structured-data `award`, `credential`, `affiliation`. Interne rechtenregels en ontbrekende bewijsvelden niet als onrustige waarschuwing in marketinginterface plaatsen. Bron footer label “Topsport & NTC-status” is minder zuiver dan het daadwerkelijke paginaonderwerp; nieuw label **Topsport & NOC*NSF** of **Topsportkennis** is passend mits route behouden.

Partnermerken zijn opgeslagen in `public/partners/noc-nsf-full-color.svg` en `public/partners/ooievaarspas.svg`; het zijn merken, geen fotografie. Hergebruik ongewijzigd passend binnen context; user beperkt foto's tot bijlagen, niet de benodigde bronlogo's.

## XXL Nutrition: ook broninformatie

- Bron biedt op **krachttraining** en **2 artikelen** (`beginnen-met-krachttraining-scheveningen`, `sterker-worden-begint-met-techniek`) een neutrale partner/productsectie XXL Nutrition.
- Kop “Sportvoeding”, naam “XXL Nutrition”, tekst “Een herkenbaar assortiment rond training, herstel en sportvoeding.” en “Vraag het team welke praktische keuzes bij jouw trainingsdoel passen.”
- Geen werkende affiliate-CTA: `NEXT_PUBLIC_XXL_AFFILIATE_URL` + `XXL_AFFILIATE_APPROVED=true` zijn beide nodig; er is geen goedgekeurde trackinglink in release.
- Bronproductbeeld `/partners/xxl-product-range.avif` is toegestaan volgens rechtenregister, **maar nieuwe userinstructie is alleen bijlagefoto's**, dus gebruik voor deze iteratie een fraaie tekstsectie/merknaam in plaats van het oude productbeeld, behoud relevante broninhoud.
- Niet suggereren dat supplementen in de club verkocht worden of dat persoonlijk voedingsadvies als clubdienst is bevestigd. Geen nieuwe gezondheids-/prestatieclaims.

## FAQ: alle 10 vragen behouden

1. Starten — Wat gebeurt er tijdens de gratis persoonlijke intake?
2. Lidmaatschap — Welke producten biedt Absolutely Fit aan?
3. Begeleiding — Kan ik personal training volgen?
4. Praktisch — Wat zijn de openingstijden?
5. Ooievaarspas — Hoeveel korting krijg ik met de Ooievaarspas?
6. Ooievaarspas — Wat neem ik mee als ik de korting wil bespreken?
7. Ooievaarspas — Met wie bespreek ik de actuele toepassing?
8. Ooievaarspas — Op welk product geldt de Ooievaarspaskorting?
9. Ooievaarspas — Hoe vraag ik een Ooievaarspas aan?
10. Training — Kan ik beginnen zonder fitnesservaring?

Exacte antwoorden staan centraal in `lib/content/faq.ts` en worden deels afgeleid van facts hierboven.

## Rooster, contact en ledenomgeving: onderscheid inhoud/functionele waarheid

### Rooster

De bron gebruikt `demoSchedule`, lokale opslag en weeklabels die naar de huidige week verschuiven. Alleen `published` + `visibility: public` worden publiek getoond: dinsdag 09:30 gratis intake (45 min, team, 4 capaciteit/2 geboekt), zaterdag 10:00 gratis intake (45 min, Rik, 4/3). **Dit zijn geen geverifieerde actuele beschikbaarheidsgegevens.** Behoud de roosterpagina en uitleg/filters waar nuttig, maar presenteer deze fixtures niet als echte boekbare vrije plekken. Verwijs voor begeleide momenten naar contact zolang er geen echt roostersysteem is aangesloten. De gewone 7-daagse openingstijden zijn wel bevestigd.

### Contact en intake

Het bronformulier verstuurt nergens een bericht: submit toont telefoon en e-mail. Daardoor is veilige complete UX: wizardkeuzes/bericht lokaal voorbereiden, passende mailto opstellen en belmogelijkheid, zonder “verzonden” te claimen. Keuzes in querystrings mogen alleen uit vaste lijsten komen, geen medische gegevens of pas-/inkomensgegevens.

Intakewizard 3 stappen:
- Doel: sterker / fitter / afvallen / spiermassa / prestatie.
- Moment: ochtend / middag / avond / wisselend.
- Begeleiding: wegwijs / startplan / coaching / weet-nog-niet.
- Resultaat vertaalt keuzes naar startvoorstel, met link naar contact en productkeuze indien afkomstig van abonnement.

Aanvullende trainingsroute (`/sporten`, `/begeleiding`) heeft doel + ervaring (begin/opnieuw, regelmatig, op niveau) + begeleiding (zelfstandig, begeleide start, intensief), resultaat met passende trainingsmix.

### Uitsluitend lokale account/app/beheerprototypes (17 routes)

- `/ledenapp`: demonstratiepresentatie ledenomgeving met digitale pas, training, voortgang, lidmaatschap/facturen, clubnieuws, profiel.
- `/inloggen`: rolkiezer, geen echte authenticatie.
- `/ledenportaal` + `/training`, `/rooster`, `/lidmaatschap`, `/facturen`, `/berichten`, `/profiel` (7 routes).
- `/backoffice` + `/rooster`, `/leden`, `/kennismakingen`, `/trainers`, `/communicatie`, `/content`, `/instellingen` (8 routes).

Deze staan in bron op noindex, buiten sitemap. User vroeg eerder ledenfunctie **later**. Aanbevolen nu een nette toekomstige ledeningang/dedicated informatiesectie, inhoud niet als actieve dienst afbeelden. Neem nooit demoleden, facturen, actuele boekingen of beheerdata over als bedrijfsinformatie. Indien exacte alle-bronroutes gewenst zijn, behoud alleen duidelijk van publieke bedrijfspagina's onderscheiden preview, niet een open werkend-beheer-claim.

## Wat bewust niet bestaat / niet toevoegen

Geen sauna, solarium/zonnebank/wellness, bevestigde clubsupplementverkoop, managed voedingsdienst, vakantiepauze/bevriezen, vaste feestdagopening, individuele producttarieven/contractcondities, erkend-leerbedrijfclaim, fake reviews of aantallen leden. Geen juridische documenten uitvinden; bron bevat geen inhoud voor privacy/AV/cookies.

## Aanbevolen menustructuur voor de gekozen stijl

Klein transparant menu met alleen drie lijnen als zichtbare trigger (wel toegankelijk label) kan alle pagina's logisch openen in ruime navigatielaag:

- **Trainen**: Sporten (4 subpagina's), Personal training, Begeleiding, Topsport & NOC*NSF.
- **Lid worden**: Abonnementen, Gratis persoonlijke intake, Ooievaarspas.
- **De club**: Over ons, Team, In de media, Kennisbank (9 artikelen).
- **Praktisch**: Openingstijden, Rooster, Veelgestelde vragen, Contact & route.

Primary CTA Gratis persoonlijke intake. Ledeningang secundair en eerlijk over toekomst. Footer legt al deze groepen bloot voor vindbaarheid. Homepage benoemt NOC*NSF-context én Ooievaarspas nadrukkelijk, maar hoeft de 9 artikelen niet integraal te herhalen.

## Assets en beelduitvoering

Alle oude sportschoolfoto's vervangen door precies de 10 nieuwe userbijlagen. Geen foto gebruiken die niet ontvangen kan worden, geen foto/portret een naam geven zonder bekende identiteit. Uitsnijden, compressie en getrouwe kleur-/belichtingscorrectie kunnen professioneel helpen, geen inhoud weg-/bijgenereren. Volgens taak geen behoefte aan nieuwe stock/generatie. Bronlogo Absolutely Fit, bronlint en ongewijzigde NOC*NSF/Ooievaarspas SVG's kunnen behouden blijven als grafische merkelementen.

## Controlelijst volledigheid

- 29 publieke canonieke routes en 9 complete artikelen terugvindbaar.
- 12 oude routes correct gemigreerd.
- 4 producttypen, 11 disciplines, 5 hoofdrichtingen.
- Alle 10 FAQ's, volledige openingstijden en contact centraal.
- Ooievaarspas zichtbaar inclusief jeugdvoorwaarden, 5 FAQ, officiële links, geen productkortingen verzonnen.
- NOC*NSF-context terug, geen nieuwe certificeringsclaim.
- Rond de Haven eigen samenvatting met bron, geen bronpublicatie overnemen.
- XXL tekstinhoud behouden, oude foto/affiliate-CTA niet gebruiken.
- Feitelijke inhoud behouden; fictieve roosterplaatsen/accountgegevens niet als actief presenteren.
