import { test } from "node:test";
import assert from "node:assert/strict";
import { buildProductJson } from "../../src/transform.js";

const minimalData = {
  productInfoComponent: { subject: "Test Product", categoryId: 1, id: 42 },
  inventoryComponent: { totalQuantity: 10, totalAvailQuantity: 5 },
  tradeComponent: { formatTradeCount: "100" },
  sellerComponent: { storeName: "Test Store", storeLogo: null, companyId: 1, storeNum: 2, topRatedSeller: false, payPalAccount: false },
  storeFeedbackComponent: { sellerPositiveNum: 50, sellerPositiveRate: "96" },
  feedbackComponent: { evarageStar: "4.5", totalValidNum: 20, fiveStarNum: 10, fourStarNum: 5, threeStarNum: 3, twoStarNum: 1, oneStarNum: 1 },
  imageComponent: { imagePathList: [] },
  skuComponent: { productSKUPropertyList: [] },
  priceComponent: { skuPriceList: [], origPrice: {}, discountPrice: {} },
  productPropComponent: { props: [] },
  currencyComponent: {},
  webGeneralFreightCalculateComponent: { originalLayoutResultList: [] },
};

test("fastMode contract: null description and empty reviews produce valid output", () => {
  const result = buildProductJson({
    data: minimalData,
    descriptionData: null,
    reviews: [],
  });

  assert.equal(result.description, null);
  assert.deepStrictEqual(result.reviews, []);
  assert.equal(typeof result.quantity, "object");
  assert.equal(typeof result.storeInfo, "object");
});

test("fastMode contract: description is null when skipped", () => {
  const result = buildProductJson({
    data: minimalData,
    descriptionData: null,
    reviews: [],
  });

  assert.equal(result.description, null);
});

test("fastMode contract: reviews are empty array when skipped", () => {
  const result = buildProductJson({
    data: minimalData,
    descriptionData: null,
    reviews: [],
  });

  assert.ok(Array.isArray(result.reviews));
  assert.equal(result.reviews.length, 0);
});

test("fastMode contract: all other product fields still populated", () => {
  const result = buildProductJson({
    data: minimalData,
    descriptionData: null,
    reviews: [],
  });

  assert.equal(result.title, "Test Product");
  assert.equal(result.productId, 42);
  assert.equal(typeof result.quantity, "object");
  assert.ok("total" in result.quantity);
  assert.ok("available" in result.quantity);
  assert.equal(typeof result.storeInfo, "object");
  assert.ok("name" in result.storeInfo);
  assert.equal(typeof result.ratings, "object");
  assert.ok(Array.isArray(result.images));
  assert.ok(Array.isArray(result.specs));
});
