import scrape from "../index.js";
import { scrapeMany } from "../index.js";

if (!process.env.ALIX_SMOKE) {
  console.log("Set ALIX_SMOKE=1 to run the smoke test.");
  process.exit(0);
}

// Default to a known working product (Wireless Keyboard - verified Jan 2025)
const productId = process.env.ALIX_PRODUCT_ID || "1005007429636284";
const reviewsCount = Number(process.env.REVIEWS_COUNT || 5);
const filterReviewsBy = process.env.FILTER_REVIEWS_BY || "all";
const timeout = Number(process.env.PUPPETEER_TIMEOUT || 60000); // Default 60s

const validateResult = (result) => {
  const requiredKeys = [
    "title",
    "productId",
    "images",
    "reviews",
    "variants",
    "shipping",
  ];

  for (const key of requiredKeys) {
    if (result?.[key] == null) {
      throw new Error(`Missing required key: ${key}`);
    }
  }

  if (result.description === undefined) {
    throw new Error("Missing required key: description (should be null or string)");
  }

  if (!Array.isArray(result.images) || result.images.length === 0) {
    throw new Error("Expected at least one image");
  }
};

// --- Single scrape ---
console.log("1/2 Single scrape...");
const result = await scrape(productId, {
  reviewsCount,
  filterReviewsBy,
  timeout,
});
validateResult(result);
console.log(`  OK: ${result.title} (${result.productId})`);

// --- Batch scrape with scrapeMany ---
console.log("2/2 scrapeMany with 1 product...");
const progressEvents = [];
const batchResults = await scrapeMany([productId], {
  concurrency: 1,
  retries: 1,
  timeout,
  reviewsCount,
  filterReviewsBy,
  onProgress: (event) => progressEvents.push(event),
});

if (batchResults.length !== 1) {
  throw new Error(`Expected 1 result, got ${batchResults.length}`);
}

const batchItem = batchResults[0];
if (batchItem.error) {
  throw new Error(`scrapeMany failed: ${batchItem.error.message}`);
}
if (batchItem.productId !== productId) {
  throw new Error(`Wrong productId: ${batchItem.productId}`);
}
validateResult(batchItem.data);

if (progressEvents.length !== 1) {
  throw new Error(`Expected 1 progress event, got ${progressEvents.length}`);
}
if (progressEvents[0].completed !== 1 || progressEvents[0].total !== 1) {
  throw new Error("Progress event has wrong counts");
}

console.log(`  OK: ${batchItem.data.title} (via scrapeMany)`);
console.log(`  onProgress fired: ${progressEvents.length} event(s)`);

console.log("\nAll smoke tests passed.");
