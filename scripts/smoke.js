import scrape from "../index.js";

if (!process.env.ALIX_SMOKE) {
  console.log("Set ALIX_SMOKE=1 to run the smoke test.");
  process.exit(0);
}

const productId = process.env.ALIX_PRODUCT_ID || "1005005167379524";
const reviewsCount = Number(process.env.REVIEWS_COUNT || 5);
const filterReviewsBy = process.env.FILTER_REVIEWS_BY || "all";
const timeout = Number(process.env.PUPPETEER_TIMEOUT || 60000); // Default 60s

const result = await scrape(productId, {
  reviewsCount,
  filterReviewsBy,
  timeout, // Page navigation timeout
});

const requiredKeys = [
  "title",
  "productId",
  "description",
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

if (!Array.isArray(result.images) || result.images.length === 0) {
  throw new Error("Expected at least one image");
}

console.log(`Smoke OK: ${result.title} (${result.productId})`);
