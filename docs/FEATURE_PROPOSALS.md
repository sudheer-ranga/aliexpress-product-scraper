# Feature Proposals

Detailed specs for the top 3 features on the roadmap. See [PLAN.md](./PLAN.md) for the full milestone overview.

---

## 1. Accept Product URL (not just ID)

**Phase:** 2 (codex/ux-perf)
**Effort:** Low | **Impact:** High

### Problem
Users typically copy a full AliExpress URL from their browser. Requiring them to manually extract the numeric product ID is friction-heavy and error-prone.

### Proposed API

```js
import scrape from "aliexpress-product-scraper";

// Existing — still works
const product = await scrape("1005006543210");

// New — pass a full URL
const product = await scrape("https://www.aliexpress.com/item/1005006543210.html");
```

### Supported URL formats

| Pattern | Example |
|---|---|
| `aliexpress.com/item/<id>.html` | `https://www.aliexpress.com/item/1005006543210.html` |
| `aliexpress.us/item/<id>.html` | `https://aliexpress.us/item/1005006543210.html` |
| Mobile | `https://m.aliexpress.com/item/1005006543210.html` |
| With query params | `https://www.aliexpress.com/item/1005006543210.html?spm=abc` |

### Implementation notes
- Parse the input: if it contains `/item/`, extract the numeric ID via regex.
- If the input is already numeric (or numeric string), use it directly.
- Throw a clear error for unrecognized formats.

### Acceptance criteria
- [ ] `scrape(url)` produces identical output to `scrape(id)` for the same product
- [ ] All supported URL formats resolve correctly
- [ ] Invalid URLs throw a descriptive error
- [ ] Existing numeric ID usage is unaffected (backward compatible)
- [ ] Unit tests cover URL parsing logic

---

## 2. `fastMode` Option

**Phase:** 2 (codex/ux-perf)
**Effort:** Medium | **Impact:** High

### Problem
Many users (especially dropshippers doing quick lookups) only need basic product info — title, price, variants, images. Fetching the full description page and reviews API adds significant time.

### Proposed API

```js
import scrape from "aliexpress-product-scraper";

const product = await scrape("1005006543210", { fastMode: true });

// product.description === null
// product.reviews === []
```

### What changes in fastMode

| Field | Normal | fastMode |
|---|---|---|
| `title`, `productId`, `categoryId` | Populated | Populated |
| `quantity`, `orders` | Populated | Populated |
| `storeInfo`, `ratings` | Populated | Populated |
| `images`, `variants`, `specs` | Populated | Populated |
| `originalPrice`, `salePrice` | Populated | Populated |
| `currencyInfo`, `shipping` | Populated | Populated |
| `description` | HTML string | `null` |
| `reviews` | Array of reviews | `[]` |

### Performance optimizations
- Skip navigation to description iframe/page
- Skip review API calls (all pagination)
- Block heavy resources in Puppeteer (images, fonts, stylesheets) via `page.setRequestInterception`
- Expected speedup: 50–70%

### Acceptance criteria
- [ ] `fastMode: true` skips description and review fetching
- [ ] Output shape is identical (description is `null`, reviews is `[]`)
- [ ] Resource blocking reduces page load time measurably
- [ ] Default behavior (`fastMode` unset or `false`) is unchanged
- [ ] Unit tests verify field presence/absence in fastMode

---

## 3. Batch Scraping with `scrapeMany()`

**Phase:** 3 (codex/feature/batch)
**Effort:** High | **Impact:** High

### Problem
Dropshipping users need to scrape dozens or hundreds of products. Calling `scrape()` sequentially is slow, and naively parallelizing it crashes the browser or triggers rate limiting.

### Proposed API

#### Callback style

```js
import { scrapeMany } from "aliexpress-product-scraper";

const results = await scrapeMany(
  ["1005006543210", "1005006543211", "1005006543212"],
  {
    concurrency: 3,        // max parallel browser tabs (default: 2)
    retries: 2,            // retries per item on failure (default: 1)
    timeout: 30000,        // per-item timeout in ms (default: 60000)
    fastMode: false,       // applies to all items
    onProgress: ({ completed, total, productId, success }) => {
      console.log(`${completed}/${total} done`);
    },
  }
);

// results: Array<{ productId, data, error }>
```

#### Async iterator style

```js
import { scrapeMany } from "aliexpress-product-scraper";

for await (const result of scrapeMany(ids, { concurrency: 3 })) {
  if (result.error) {
    console.error(`Failed: ${result.productId}`, result.error);
  } else {
    console.log(`Got: ${result.data.title}`);
  }
}
```

### Design decisions
- **Browser reuse:** open one browser, use multiple tabs (pages) for concurrency
- **Concurrency control:** limit active tabs to `concurrency` value
- **Retries:** per-item retry with exponential backoff
- **Timeout:** per-item timeout; does not affect other items
- **Error isolation:** one item's failure does not abort the batch
- **Return format:** each result includes `{ productId, data, error }` so callers can handle partial failures

### Acceptance criteria
- [ ] `scrapeMany()` scrapes multiple products concurrently
- [ ] Concurrency is respected (never exceeds `concurrency` tabs)
- [ ] Failed items are retried up to `retries` times
- [ ] Per-item timeout terminates slow scrapes without affecting others
- [ ] `onProgress` callback fires after each item completes
- [ ] Async iterator yields results as they complete
- [ ] Browser is reused across all items and closed after completion
- [ ] Existing `scrape()` API is unchanged
- [ ] Integration test with fixtures verifies batch orchestration logic
