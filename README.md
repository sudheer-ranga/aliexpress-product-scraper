# AliExpress Product Scraper

[![Node.js Package](https://github.com/sudheer-ranga/aliexpress-product-scraper/actions/workflows/npm-publish.yml/badge.svg?branch=master)](https://github.com/sudheer-ranga/aliexpress-product-scraper/actions/workflows/npm-publish.yml)

Scrapes AliExpress product information and returns JSON data including:
- Product details (title, images, description)
- Reviews with photos
- Variants and prices
- Shipping info
- Store info and ratings

## Requirements

- **Node.js >= 22.0.0** (required)
- npm or pnpm

## Installation

```bash
npm install aliexpress-product-scraper
```

## Usage

```javascript
import scrape from 'aliexpress-product-scraper';

const data = await scrape('1005007429636284');
console.log(data.title, data.salePrice);
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `reviewsCount` | number | 20 | Number of reviews to fetch |
| `filterReviewsBy` | 'all' \| 1-5 | 'all' | Filter reviews by star rating |
| `puppeteerOptions` | object | {} | Puppeteer launch options |
| `timeout` | number | 60000 | Page navigation timeout (ms) |

---

## Upgrading to v3.0.0

### Breaking Changes

| Change | v2.x | v3.0.0 |
|--------|------|--------|
| Node.js | Any | **>= 22.0.0** |
| AliExpress API | SSR (runParams) | CSR (API interception) |
| Bot detection | Basic | Stealth plugin |

### Upgrade Steps

```bash
# 1. Check Node.js version (must be >= 22)
node --version

# 2. If needed, upgrade Node.js
nvm install 22 && nvm use 22

# 3. Update the package
npm update aliexpress-product-scraper

# 4. Verify it works
node -e "import('aliexpress-product-scraper').then(m => console.log('OK'))"
```

### What's New in v3.0.0

- **Node.js 22+ required** - Uses modern ES features
- **New scraping method** - AliExpress switched to CSR; now intercepts API responses
- **Stealth mode** - Uses puppeteer-extra-plugin-stealth to avoid bot detection
- **Better reliability** - Handles dynamic page loading
- **ESLint + pre-commit hooks** - Code quality enforcement
- **Same API** - No code changes needed in your project

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Use Node.js >= 22.0.0 |
| Puppeteer Chrome not found | Run `npx puppeteer browsers install chrome` |
| Timeout errors | Increase timeout: `{ timeout: 90000 }` |
| Empty data | Product may be unavailable or blocked |

---

## Development

```bash
# Install dependencies
npm install

# Run linter
npm run lint

# Auto-fix lint errors  
npm run lint:fix

# Run smoke test (live scraping test)
ALIX_SMOKE=1 npm run smoke

# Debug test (verbose output + screenshot)
node scripts/debug-test.js
```

### Scripts

| Script | Description |
|--------|-------------|
| `npm run lint` | Check code quality |
| `npm run lint:fix` | Auto-fix lint errors |
| `npm run smoke` | Live scraping test (requires `ALIX_SMOKE=1`) |
| `node scripts/debug-test.js` | Diagnostic tool with verbose output |

A pre-commit hook automatically runs ESLint on staged files.

---

## Sample Response

```json
{
  "title": "Wireless Keyboard and Mouse Combo RGB Backlit...",
  "categoryId": "70802",
  "productId": "1005007429636284",
  "quantity": { "total": 285, "available": 285 },
  "description": "<div>...HTML description...</div>",
  "orders": "0",
  "storeInfo": {
    "name": "JOMAA Computer Office Accessories Store",
    "logo": "https://ae-pic-a1.aliexpress-media.com/kf/.../144x144.png",
    "companyId": 2674539165,
    "storeNumber": 1102703188,
    "isTopRated": false,
    "hasPayPalAccount": false,
    "ratingCount": 0,
    "rating": "0"
  },
  "ratings": {
    "totalStar": 5,
    "averageStar": "4.7",
    "totalStartCount": 360,
    "fiveStarCount": 0,
    "fourStarCount": 0,
    "threeStarCount": 0,
    "twoStarCount": 0,
    "oneStarCount": 0
  },
  "images": [
    "https://ae01.alicdn.com/kf/S9e666c8476db43cb85756879ff330c04z.jpg",
    "https://ae01.alicdn.com/kf/Sd3bdde0ad49c47e9a73748a0f371400e5.jpg"
  ],
  "reviews": [
    {
      "anonymous": false,
      "name": "g***i",
      "displayName": "Mr. Corey Ullrich",
      "gender": "male",
      "country": "IL",
      "rating": 2,
      "info": "Color:Black Axis Body:Hebrew",
      "date": "27 Aug 2025",
      "content": "the item arrived fast but only the keyboard work...",
      "photos": [],
      "thumbnails": []
    }
  ],
  "variants": {
    "options": [
      {
        "id": 14,
        "name": "Color",
        "values": [
          { "id": 29, "name": "WHITE", "displayName": "White", "image": "https://..." },
          { "id": 193, "name": "black", "displayName": "Black", "image": "https://..." }
        ]
      },
      {
        "id": 200009450,
        "name": "Axis Body",
        "values": [
          { "id": 201450903, "name": "BLACK SWITCH", "displayName": "English", "image": "" }
        ]
      }
    ],
    "prices": [
      {
        "skuId": 12000040723791666,
        "optionValueIds": "14:193;200009450:201450908",
        "availableQuantity": 12,
        "originalPrice": { "currency": "INR", "formatedAmount": "Rs.6,354.19", "value": 6354.19 },
        "salePrice": { "currency": "INR", "formatedAmount": "Rs.3,367.66", "value": 3367.66 }
      }
    ]
  },
  "specs": [
    { "attrName": "Brand Name", "attrValue": "JOMAA" },
    { "attrName": "Type", "attrValue": "2.4Ghz Wireless" }
  ],
  "currencyInfo": { "currencyCode": "INR" },
  "originalPrice": {
    "min": { "currency": "INR", "formatedAmount": "Rs.6,077.63", "value": 6077.63 },
    "max": { "currency": "INR", "formatedAmount": "Rs.6,077.63", "value": 6077.63 }
  },
  "salePrice": {
    "min": { "currency": "INR", "formatedAmount": "Rs.3,221.14", "value": 3221.14 },
    "max": { "currency": "INR", "formatedAmount": "Rs.3,221.14", "value": 3221.14 }
  },
  "shipping": [
    {
      "deliveryProviderName": "newGlobal",
      "deliveryInfo": { "min": 75, "max": 75 },
      "shippingInfo": { "from": "China", "to": "India", "fees": 0, "unreachable": true }
    }
  ]
}
```
