# Absolutely Fit

Conventionele Next.js-website voor Absolutely Fit in Scheveningen, met publieke
clubpagina’s en duidelijk gemarkeerde, uitsluitend lokale prototypes van het
ledenportaal en clubbeheer.

## Lokaal ontwikkelen

Vereist Node.js 22.13 of nieuwer en npm 11.

```bash
npm ci
npm run dev
```

De site staat daarna op `http://localhost:3000`.

## Kwaliteitscontroles

```bash
npm run check
```

De browsercontrole draait tegen een reeds gestarte productie- of ontwikkelserver:

```bash
BASE_URL=http://127.0.0.1:3000 npm run qa:browser
```

Installeer de Chromium-runtime eenmalig met `npx playwright install chromium`.

## Productie

Een push naar `production` start de bestaande, aan de club gebonden self-hosted
GitHub Actions-runner. De workflow bouwt en controleert de exacte commit, draagt
die over aan de bestaande deployhelper en verifieert daarna via `/api/health` dat
dezelfde SHA actief is.

Voor een publieke release moeten de eigenaar en rechthebbenden de teksten,
clubgegevens, logo’s, foto’s/model releases en privacy-impact expliciet hebben
goedgekeurd. Nimbus Sans is bewust niet meegeleverd; de site gebruikt gelicentieerd
onafhankelijke systeemlettertypen.
