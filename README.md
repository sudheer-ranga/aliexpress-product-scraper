# Aliexpress Product Scraper

[![Node.js Package](https://github.com/sudheer-ranga/aliexpress-product-scraper/actions/workflows/npm-publish.yml/badge.svg?branch=master)](https://github.com/sudheer-ranga/aliexpress-product-scraper/actions/workflows/npm-publish.yml)
Aliexpress Product Scraper scrapes product information and returns the response in json format including:

- Description
- Reviews
- Variants and Prices
- Shipping Info

## Requirements
- Node.js >= 22
- pnpm (recommended) or npm

## Installation

```bash
# Using pnpm (recommended)
pnpm i aliexpress-product-scraper

# Or using npm
npm i aliexpress-product-scraper
```

**Note:** 
- This project uses `pnpm` as the package manager (see `pnpm-lock.yaml`). While `npm` will work, `pnpm` is recommended for consistency.
- Puppeteer build scripts are intentionally ignored (see `pnpm-workspace.yaml`) to avoid downloading Chromium during installation. Chromium will be downloaded automatically on first use when running the scraper.

## Upgrading from Older Versions

### Breaking Changes in v2.0.2+

**Node.js Version Requirement**
- **Minimum Node.js version: 22.0.0** (previously supported older versions)
- This is a breaking change. If you're using Node.js < 22, you'll need to upgrade Node.js first.

### Upgrade Steps

1. **Check your Node.js version:**
   ```bash
   node --version
   ```
   If it's below v22.0.0, upgrade Node.js first:
   ```bash
   # Using nvm (recommended)
   nvm install 22
   nvm use 22
   
   # Or download from https://nodejs.org/
   ```

2. **Update the package:**
   ```bash
   # Using pnpm
   pnpm update aliexpress-product-scraper
   
   # Or using npm
   npm update aliexpress-product-scraper
   
   # Or reinstall to get latest
   pnpm remove aliexpress-product-scraper
   pnpm add aliexpress-product-scraper
   ```

3. **Install Puppeteer's Chromium (if needed):**
   ```bash
   # Puppeteer will download Chromium automatically on first use
   # Or manually install it:
   pnpm exec puppeteer browsers install chrome
   ```

4. **Verify the upgrade:**
   ```bash
   # Test with the smoke test
   ALIX_SMOKE=1 pnpm run smoke
   ```

### What Changed?

- ✅ **Dependencies upgraded** to latest compatible versions:
  - `puppeteer`: Updated to v24.34.0
  - `cheerio`: Updated to v1.1.2
  - `node-fetch`: Updated to v3.3.2
  - `@faker-js/faker`: Updated to v10.2.0
- ✅ **Improved error handling** with better error messages
- ✅ **Enhanced reliability** with retry logic for page loading
- ✅ **API remains the same** - no code changes needed in your project

### Troubleshooting

**Issue: "Cannot find module" or import errors**
- Make sure you're using Node.js >= 22.0.0
- Clear `node_modules` and reinstall: `rm -rf node_modules && pnpm install`

**Issue: Puppeteer Chrome not found**
- Run: `pnpm exec puppeteer browsers install chrome`
- Or set `PUPPETEER_EXECUTABLE_PATH` to use system Chrome

**Issue: Timeout errors**
- This is **normal and expected** for web scraping - AliExpress may block automated requests or pages may load slowly
- The default timeout is now 60 seconds (increased from 30s)
- You can increase it further in `puppeteerOptions`: `{ timeout: 90000 }` (90 seconds)
- For smoke tests, set `PUPPETEER_TIMEOUT=90000` environment variable
- Try with a different product ID if one consistently times out
- Note: Timeouts don't mean the code is broken - it's a network/anti-bot issue

**Issue: "runParams not found" errors**
- The improved error handling will now provide clearer messages
- This usually means the page structure changed or the product is unavailable

### Need Help?

If you encounter issues after upgrading:
1. Check that Node.js version is >= 22.0.0
2. Clear cache and reinstall dependencies
3. Open an issue on GitHub with error details

# How to use?

```javascript
import scrape from 'aliexpress-product-scraper';

scrape('1005007429636284', options).then(res => {
  console.log('Product JSON: ', res);
});
```

**Parameters:**

- `id` (string, required) - AliExpress Product ID
- `options` (object, optional):

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `reviewsCount` | number | 20 | Number of reviews to fetch |
| `filterReviewsBy` | 'all' \| 1-5 | 'all' | Filter reviews by star rating |
| `puppeteerOptions` | object | {} | Puppeteer launch options |
| `timeout` | number | 60000 | Page navigation timeout (ms) |

# Development

## Linting

This project uses ESLint to enforce code quality. The following rules are enforced:
- `curly`: All control statements must use curly braces
- `indent`: 2-space indentation
- `brace-style`: Consistent 1TBS brace style

```bash
# Check for linting errors
pnpm run lint

# Auto-fix linting errors
pnpm run lint:fix
```

A pre-commit hook automatically runs ESLint on staged files.

# Smoke test (optional)
Run this only when you want to verify live scraping:
```bash
# Using pnpm
ALIX_SMOKE=1 pnpm run smoke

# Or using npm
ALIX_SMOKE=1 npm run smoke

# With custom timeout (if you get timeout errors)
ALIX_SMOKE=1 PUPPETEER_TIMEOUT=90000 pnpm run smoke

# With custom product ID
ALIX_SMOKE=1 ALIX_PRODUCT_ID=1005001234567890 pnpm run smoke
```

**Note:** Timeout errors during smoke tests are normal - AliExpress may block automated requests. This doesn't mean the code is broken.

# Sample JSON Response

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
