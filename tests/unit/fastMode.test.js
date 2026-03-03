import { test } from "node:test";
import assert from "node:assert/strict";

const fakeProductData = {
  productInfoComponent: { subject: "Test Product", categoryId: 1, id: 123 },
  inventoryComponent: { totalQuantity: 10, totalAvailQuantity: 5 },
  tradeComponent: { formatTradeCount: "50" },
  sellerComponent: { storeName: "Store", storeLogo: "", companyId: 1, storeNum: 1 },
  storeFeedbackComponent: { sellerPositiveNum: 10, sellerPositiveRate: "95" },
  feedbackComponent: { evarageStar: "4.5", totalValidNum: 100 },
  imageComponent: { imagePathList: ["img.jpg"] },
  skuComponent: { productSKUPropertyList: [] },
  priceComponent: { skuPriceList: [], origPrice: {}, discountPrice: {} },
  productPropComponent: { props: [] },
  currencyComponent: {},
  webGeneralFreightCalculateComponent: { originalLayoutResultList: [] },
  productDescComponent: { descriptionUrl: "https://desc.aliexpress.com/desc.html" },
};

test("fastMode integration", async (t) => {
  let interceptEnabled = false;
  const navigatedUrls = [];
  let fetchCallCount = 0;

  const makePage = () => {
    return {
      on: () => {},
      goto: async (url) => {
        navigatedUrls.push(url);
      },
      evaluate: async () => fakeProductData,
      setRequestInterception: async (val) => {
        interceptEnabled = val;
      },
      content: async () => "<html><body><p>description</p></body></html>",
    };
  };

  t.mock.module("puppeteer-extra", {
    defaultExport: {
      use: () => {},
      launch: async () => ({
        newPage: async () => makePage(),
        close: async () => {},
      }),
    },
  });

  t.mock.module("puppeteer-extra-plugin-stealth", {
    defaultExport: () => ({}),
  });

  t.mock.module("node-fetch", {
    defaultExport: async () => {
      fetchCallCount++;
      return {
        ok: true,
        json: async () => ({ data: { evaViewList: [] } }),
      };
    },
  });

  t.mock.module("cheerio", {
    namedExports: {
      load: () => () => ({ html: () => "<p>mocked description</p>" }),
    },
  });

  const { default: scrape } = await import("../../src/aliexpressProductScraper.js");

  await t.test("fastMode=true: enables request interception", async () => {
    interceptEnabled = false;
    navigatedUrls.length = 0;
    fetchCallCount = 0;

    await scrape("123", { fastMode: true });

    assert.equal(interceptEnabled, true, "should call setRequestInterception(true)");
  });

  await t.test("fastMode=true: only navigates to product page, NOT description", async () => {
    interceptEnabled = false;
    navigatedUrls.length = 0;
    fetchCallCount = 0;

    await scrape("123", { fastMode: true });

    assert.equal(navigatedUrls.length, 1, "should navigate once (product page only)");
    assert.ok(navigatedUrls[0].includes("/item/123.html"));
  });

  await t.test("fastMode=true: does NOT call fetch for reviews", async () => {
    interceptEnabled = false;
    navigatedUrls.length = 0;
    fetchCallCount = 0;

    await scrape("123", { fastMode: true });

    assert.equal(fetchCallCount, 0, "fetch should not be called for reviews");
  });

  await t.test("fastMode=true: returns null description and empty reviews", async () => {
    interceptEnabled = false;
    navigatedUrls.length = 0;
    fetchCallCount = 0;

    const result = await scrape("123", { fastMode: true });

    assert.equal(result.description, null);
    assert.deepStrictEqual(result.reviews, []);
    assert.equal(result.title, "Test Product");
    assert.equal(result.productId, 123);
  });

  await t.test("fastMode=false: does NOT enable request interception", async () => {
    interceptEnabled = false;
    navigatedUrls.length = 0;
    fetchCallCount = 0;

    await scrape("456");

    assert.equal(interceptEnabled, false, "should NOT call setRequestInterception");
  });

  await t.test("fastMode=false: navigates to product AND description pages", async () => {
    interceptEnabled = false;
    navigatedUrls.length = 0;
    fetchCallCount = 0;

    await scrape("456");

    assert.equal(navigatedUrls.length, 2, "should navigate twice (product + description)");
    assert.ok(navigatedUrls[0].includes("/item/456.html"));
    assert.ok(navigatedUrls[1].includes("desc.aliexpress.com"));
  });

  await t.test("fastMode=false: calls fetch for reviews", async () => {
    interceptEnabled = false;
    navigatedUrls.length = 0;
    fetchCallCount = 0;

    await scrape("456");

    assert.ok(fetchCallCount > 0, "fetch should be called for reviews");
  });
});
