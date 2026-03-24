import scrape from "../index.js";

if (!process.env.ALIX_SMOKE) {
  console.log("Set ALIX_SMOKE=1 to run the smoke test.");
  process.exit(0);
}

// Default to a known working product (Wireless Keyboard - verified Jan 2025)
const productId = process.env.ALIX_PRODUCT_ID || "1005007429636284";
const reviewsCount = Number(process.env.REVIEWS_COUNT || 5);
const filterReviewsBy = process.env.FILTER_REVIEWS_BY || "all";
const timeout = Number(process.env.PUPPETEER_TIMEOUT || 60000); // Default 60s

const validateResult = (result, { expectDescription = true, expectReviews = true } = {}) => {
  const requiredKeys = [
    "title",
    "productId",
    "images",
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

  if (result.reviews === undefined) {
    throw new Error("Missing required key: reviews (should be array)");
  }

  if (!Array.isArray(result.images) || result.images.length === 0) {
    throw new Error("Expected at least one image");
  }

  if (expectDescription && result.description === null) {
    console.warn("  Warning: description is null (may be expected for some products)");
  }

  if (expectReviews && result.reviews.length === 0) {
    console.warn("  Warning: no reviews returned (may be expected for some products)");
  }
};

// --- Normal scrape ---
console.log("1/2 Normal scrape...");
const result = await scrape(productId, {
  reviewsCount,
  filterReviewsBy,
  timeout,
});
validateResult(result);
console.log(`  OK: ${result.title} (${result.productId})`);
console.log(`  description: ${result.description ? "present" : "null"}`);
console.log(`  reviews: ${result.reviews.length}`);

// --- fastMode scrape ---
console.log("2/2 fastMode scrape...");
const fastResult = await scrape(productId, {
  fastMode: true,
  timeout,
});
validateResult(fastResult, { expectDescription: false, expectReviews: false });

if (fastResult.description !== null) {
  throw new Error("fastMode should return null description");
}
if (fastResult.reviews.length !== 0) {
  throw new Error("fastMode should return empty reviews");
}
if (fastResult.title !== result.title) {
  throw new Error("fastMode should return same title as normal scrape");
}
console.log(`  OK: ${fastResult.title} (fastMode)`);
console.log(`  description: null (expected)`);
console.log(`  reviews: 0 (expected)`);

console.log("\nAll smoke tests passed.");
