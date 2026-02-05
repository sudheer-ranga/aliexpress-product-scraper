# AliExpress Product Scraper

[![Node.js Package](https://github.com/sudheer-ranga/aliexpress-product-scraper/actions/workflows/npm-publish.yml/badge.svg?branch=master)](https://github.com/sudheer-ranga/aliexpress-product-scraper/actions/workflows/npm-publish.yml)

Scrapes AliExpress product information and returns JSON data including:
- Product details (title, images, description)
- Reviews with photos
- Variants and prices
- Shipping info
- Store info and ratings

## Requirements

- **Node.js >= 24.0.0** (required)
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

You can pass either a product ID or a product URL:

```javascript
const fromUrl = await scrape('https://www.aliexpress.com/item/1005007429636284.html');
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `reviewsCount` | number | 20 | Number of reviews to fetch |
| `filterReviewsBy` | 'all' \| 1-5 | 'all' | Filter reviews by star rating |
| `puppeteerOptions` | object | {} | Puppeteer launch options |
| `timeout` | number | 60000 | Page navigation timeout (ms) |
| `fastMode` | boolean | false | Skip heavy fields (`description`, `reviews`) and block heavy resources |
| `fields` | string[] | null | Return only selected top-level fields |

### Fast Mode + Field Selection

```javascript
const slim = await scrape('1005007429636284', {
  fastMode: true,
  fields: ['title', 'productId', 'salePrice', 'shipping', 'ratings'],
});
```

### Batch Scraping

```javascript
import { scrapeMany } from 'aliexpress-product-scraper';

const result = await scrapeMany(
  [
    '1005007429636284',
    'https://www.aliexpress.com/item/1005007429636284.html',
  ],
  {
    concurrency: 3,
    retries: 1,
    itemTimeout: 120000,
    fastMode: true,
    onProgress: ({ completed, total, succeeded, failed }) => {
      console.log(`Progress: ${completed}/${total} | ok=${succeeded} fail=${failed}`);
    },
  }
);

console.log(result.summary);
console.log(result.items[0]);
```

Batch options:
- `concurrency` (default `3`): Max parallel scrapes
- `retries` (default `1`): Retry attempts per item after first failure
- `itemTimeout` (default `120000`): Timeout per batch item in ms
- `onProgress`: Callback invoked after each completed item

---

## Upgrading to v4.0.0

### Breaking Changes

| Change | v3.x | v4.0.0 |
|--------|------|--------|
| Node.js | **>= 22.0.0** | **>= 24.0.0** |
| Package version | `3.x` | `4.x` |
| AliExpress API | SSR (runParams) | CSR (API interception) |
| Bot detection | Basic | Stealth plugin |
| Runtime API | Current | No response shape changes |

### Upgrade Steps

```bash
# 1. Check Node.js version (must be >= 24)
node --version

# 2. If needed, upgrade Node.js
nvm install 24 && nvm use 24

# 3. Use pnpm through corepack (recommended for contributors)
corepack enable

# 4. Update the package
npm install aliexpress-product-scraper@latest

# 5. Verify it works
node -e "import('aliexpress-product-scraper').then(m => console.log('OK'))"
```

### Developer Setup (v4)

```bash
# Use Node 24
nvm install 24 && nvm use 24

# Install dependencies
pnpm install --frozen-lockfile

# Validate
pnpm run lint
pnpm run test
```

Key v4 updates:
- **Node.js 24+ required** - Uses modern ES features
- **New scraping method** - AliExpress switched to CSR; now intercepts API responses
- **Stealth mode** - Uses puppeteer-extra-plugin-stealth to avoid bot detection
- **Better reliability** - Handles dynamic page loading
- **ESLint + pre-commit hooks** - Code quality enforcement
- **Same API** - No code changes needed in your project

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Use Node.js >= 24.0.0 |
| Puppeteer Chrome not found | Run `npx puppeteer browsers install chrome` |
| Timeout errors | Increase timeout: `{ timeout: 90000 }` |
| Empty data | Product may be unavailable or blocked |

---

## Development

```bash
# Install dependencies
pnpm install

# Run linter
pnpm run lint

# Auto-fix lint errors  
pnpm run lint:fix

# Run tests
pnpm run test

# Run smoke test (live scraping test)
ALIX_SMOKE=1 pnpm run smoke

# Debug test (verbose output + screenshot)
node scripts/debug-test.js
```

### Scripts

| Script | Description |
|--------|-------------|
| `pnpm run lint` | Check code quality |
| `pnpm run lint:fix` | Auto-fix lint errors |
| `pnpm run test` | Run unit + integration tests |
| `pnpm run smoke` | Live scraping test (requires `ALIX_SMOKE=1`) |
| `node scripts/debug-test.js` | Diagnostic tool with verbose output |

A pre-commit hook automatically runs ESLint on staged files.

Release process checklist: `docs/RELEASE_CHECKLIST.md`

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
