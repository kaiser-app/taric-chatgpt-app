# TARIC ChatGPT Netlify App

GitHub-ra közvetlenül feltölthető Netlify projekt a TARIC ügynök első, API-kulcs nélküli változatához.

## Mire való?

Ez a verzió nem hív OpenAI/Anthropic API-t. A cél:

```text
ChatGPT / Apps SDK / MCP
        ↓
Netlify endpointok
        ↓
TARIC/NAV adatlekérő és számítási réteg
```

A jelenlegi csomag működő **alapréteg**:

- React webes előnézet
- Netlify Functions
- `/api/taric` REST endpoint
- `/mcp` MCP/App SDK irányú facade endpoint
- seed-alapú TARIC besorolási minta
- 3 EUR átalányvám és ÁFA kalkulációs mag
- tesztek

A NAV/EU TARIC HTML scraper a következő modul, mert azt külön kell a tényleges oldalstruktúrához igazítani.

## GitHub feltöltés

A repository gyökerébe a csomag **tartalmát** töltsd fel, ne a külső mappát.

Helyes struktúra:

```text
repo/
├── package.json
├── netlify.toml
├── index.html
├── src/
├── shared/
├── netlify/
├── tests/
└── README.md
```

## Netlify beállítás

Build command:

```bash
npm run build
```

Publish directory:

```bash
dist
```

Functions directory:

```bash
netlify/functions
```

A `netlify.toml` ezt már tartalmazza.

## Helyi futtatás

```bash
npm install
npm run dev
```

A Netlify dev szerver általában itt fut:

```text
http://localhost:8888
```

## Endpointok

### REST

```http
POST /api/taric
Content-Type: application/json

{
  "productName": "Samsung Galaxy Watch4 SM-R875",
  "description": "LTE/eSIM okosóra",
  "valueHuf": 100000,
  "currencyRateHufPerEur": 400,
  "declarationLines": 1,
  "flow": "b2c",
  "vatScheme": "ioss"
}
```

### MCP/App facade

```http
GET /mcp
```

Eszközlista-jellegű JSON-t ad.

```http
POST /mcp
Content-Type: application/json

{
  "name": "classify_taric_product",
  "arguments": {
    "productName": "naposcsibe",
    "valueHuf": 20000
  }
}
```

## Fontos korlátok

- Ez nem hivatalos eKTF.
- A seed-katalógus nem helyettesíti az élő NAV/EU TARIC ellenőrzést.
- A ChatGPT Apps SDK pontos manifest/regisztrációs formátumát az aktuális OpenAI dokumentációhoz kell igazítani.
- Élesítés előtt kell: NAV TARIC parser, EU TARIC parser, cache, naplózás, validáció, audit trail.
