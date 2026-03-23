import { test } from "node:test";
import assert from "node:assert/strict";
import { buildProductJson } from "../../src/transform.js";

test("buildProductJson maps all fields correctly", () => {
  const data = {
    productInfoComponent: {
      subject: "Test Widget",
      categoryId: 42,
      id: 12345,
    },
    inventoryComponent: {
      totalQuantity: 100,
      totalAvailQuantity: 80,
    },
    tradeComponent: {
      formatTradeCount: "500+",
    },
    sellerComponent: {
      storeName: "Best Store",
      storeLogo: "https://logo.png",
      companyId: 99,
      storeNum: 1001,
      topRatedSeller: true,
      payPalAccount: false,
    },
    storeFeedbackComponent: {
      sellerPositiveNum: 200,
      sellerPositiveRate: "98.5",
    },
    feedbackComponent: {
      evarageStar: "4.7",
      totalValidNum: 150,
      fiveStarNum: 100,
      fourStarNum: 30,
      threeStarNum: 10,
      twoStarNum: 5,
      oneStarNum: 5,
    },
    imageComponent: {
      imagePathList: ["img1.jpg", "img2.jpg"],
    },
    skuComponent: {
      productSKUPropertyList: [],
    },
    priceComponent: {
      skuPriceList: [],
      origPrice: { minAmount: 10, maxAmount: 20 },
      discountPrice: { minActivityAmount: 8, maxActivityAmount: 16 },
    },
    productPropComponent: {
      props: [{ name: "Material", value: "Cotton" }],
    },
    currencyComponent: {
      currencyCode: "USD",
    },
    webGeneralFreightCalculateComponent: {
      originalLayoutResultList: [],
    },
  };

  const result = buildProductJson({
    data,
    descriptionData: "<p>Description</p>",
    reviews: [{ name: "Reviewer" }],
  });

  assert.equal(result.title, "Test Widget");
  assert.equal(result.categoryId, 42);
  assert.equal(result.productId, 12345);
  assert.deepStrictEqual(result.quantity, { total: 100, available: 80 });
  assert.equal(result.description, "<p>Description</p>");
  assert.equal(result.orders, "500+");
  assert.equal(result.storeInfo.name, "Best Store");
  assert.equal(result.storeInfo.isTopRated, true);
  assert.equal(result.storeInfo.ratingCount, 200);
  assert.equal(result.storeInfo.rating, "98.5");
  assert.equal(result.ratings.averageStar, "4.7");
  assert.equal(result.ratings.totalStar, 5);
  assert.equal(result.ratings.fiveStarCount, 100);
  assert.deepStrictEqual(result.images, ["img1.jpg", "img2.jpg"]);
  assert.deepStrictEqual(result.reviews, [{ name: "Reviewer" }]);
  assert.deepStrictEqual(result.originalPrice, { min: 10, max: 20 });
  assert.deepStrictEqual(result.salePrice, { min: 8, max: 16 });
  assert.equal(result.currencyInfo.currencyCode, "USD");
  assert.deepStrictEqual(result.specs, [{ name: "Material", value: "Cotton" }]);
});

test("buildProductJson handles empty/missing data gracefully", () => {
  const result = buildProductJson({ data: {} });

  assert.equal(result.title, undefined);
  assert.equal(result.categoryId, undefined);
  assert.equal(result.productId, undefined);
  assert.deepStrictEqual(result.quantity, { total: 0, available: 0 });
  assert.equal(result.description, null);
  assert.equal(result.orders, "0");
  assert.equal(result.storeInfo.isTopRated, false);
  assert.equal(result.storeInfo.hasPayPalAccount, false);
  assert.equal(result.storeInfo.ratingCount, 0);
  assert.equal(result.storeInfo.rating, "0");
  assert.equal(result.ratings.averageStar, "0");
  assert.equal(result.ratings.totalStartCount, 0);
  assert.deepStrictEqual(result.images, []);
  assert.deepStrictEqual(result.reviews, []);
  assert.deepStrictEqual(result.specs, []);
  assert.deepStrictEqual(result.currencyInfo, {});
  assert.deepStrictEqual(result.shipping, []);
});

test("buildProductJson defaults description to null and reviews to []", () => {
  const result = buildProductJson({ data: {} });

  assert.equal(result.description, null);
  assert.deepStrictEqual(result.reviews, []);
});

test("buildProductJson passes through description and reviews", () => {
  const desc = "<div>Hello</div>";
  const revs = [{ rating: 5 }, { rating: 4 }];

  const result = buildProductJson({
    data: {},
    descriptionData: desc,
    reviews: revs,
  });

  assert.equal(result.description, desc);
  assert.deepStrictEqual(result.reviews, revs);
});
