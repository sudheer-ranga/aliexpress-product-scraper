import scrape from "../index.js";

if (!process.env.ALIX_SMOKE) {
  console.log("Set ALIX_SMOKE=1 to run the smoke test.");
  process.exit(0);
}

// Default to a known working product (Wireless Keyboard - verified Jan 2025)
const productId = process.env.ALIX_PRODUCT_ID || "1005007429636284";
const productUrl = `https://www.aliexpress.com/item/${productId}.html`;
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

// --- Scrape by ID ---
console.log("1/2 Scrape by product ID...");
const resultById = await scrape(productId, {
  reviewsCount,
  filterReviewsBy,
  timeout,
});
validateResult(resultById);
console.log(`  OK: ${resultById.title} (${resultById.productId})`);

// --- Scrape by URL ---
console.log("2/2 Scrape by product URL...");
const resultByUrl = await scrape(productUrl, {
  reviewsCount,
  filterReviewsBy,
  timeout,
});
validateResult(resultByUrl);

if (resultByUrl.productId !== resultById.productId) {
  throw new Error(
    `URL scrape returned different productId: ${resultByUrl.productId} vs ${resultById.productId}`
  );
}
if (resultByUrl.title !== resultById.title) {
  throw new Error(
    `URL scrape returned different title: "${resultByUrl.title}" vs "${resultById.title}"`
  );
}
console.log(`  OK: ${resultByUrl.title} (via URL)`);

console.log("\nAll smoke tests passed.");
