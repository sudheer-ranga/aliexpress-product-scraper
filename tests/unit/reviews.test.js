import { test } from "node:test";
import assert from "node:assert/strict";

const reviewFixtures = {
  "male-review": {
    anonymous: false,
    buyerName: "John",
    buyerGender: "M",
    buyerCountry: "US",
    buyerEval: 100,
    skuInfo: "Color: Red",
    evalDate: "2024-01-01",
    buyerFeedback: "Great product",
    images: ["img1.jpg"],
    thumbnails: ["thumb1.jpg"],
  },
  "female-review": {
    anonymous: true,
    buyerGender: "F",
    buyerCountry: "GB",
    buyerEval: 80,
    skuInfo: "Size: M",
    evalDate: "2024-02-01",
    buyerFeedback: "Good quality",
  },
  "no-eval": {
    anonymous: false,
    buyerGender: "M",
    buyerCountry: "DE",
    skuInfo: "",
    evalDate: "2024-03-01",
    buyerFeedback: "OK",
  },
  "no-name": {
    anonymous: false,
    buyerGender: "M",
    buyerCountry: "US",
    buyerEval: 60,
    skuInfo: "",
    evalDate: "2024-04-01",
    buyerFeedback: "Decent",
  },
  "named-buyer": {
    anonymous: false,
    buyerName: "Alice Smith",
    buyerGender: "F",
    buyerCountry: "FR",
    buyerEval: 100,
    skuInfo: "",
    evalDate: "2024-05-01",
    buyerFeedback: "Excellent",
  },
};

// Map productId to which fixture(s) to return
const productIdToFixtures = {
  "1": [reviewFixtures["male-review"]],
  "2": [reviewFixtures["female-review"]],
  "3": [reviewFixtures["no-eval"]],
  "4": [reviewFixtures["no-name"]],
  "5": [reviewFixtures["named-buyer"]],
  "6": [], // empty
};

test("reviews module", async (t) => {
  t.mock.module("node-fetch", {
    defaultExport: async (url) => {
      const match = url.match(/productId=(\d+)/);
      const productId = match ? match[1] : null;
      const fixtures = productIdToFixtures[productId] || [];
      return {
        ok: true,
        json: async () => ({ data: { evaViewList: fixtures } }),
      };
    },
  });

  const { get } = await import("../../src/reviews.js");

  await t.test("male gender mapping and rating calculation", async () => {
    const result = await get({ productId: "1", total: 1, limit: 1 });

    assert.equal(result.length, 1);
    assert.equal(result[0].name, "John");
    assert.equal(result[0].gender, "male");
    assert.equal(result[0].rating, 5); // 100 / 20
    assert.equal(result[0].country, "US");
    assert.equal(result[0].content, "Great product");
    assert.equal(result[0].info, "Color: Red");
    assert.deepStrictEqual(result[0].photos, ["img1.jpg"]);
    assert.deepStrictEqual(result[0].thumbnails, ["thumb1.jpg"]);
  });

  await t.test("female gender, partial rating, empty photos", async () => {
    const result = await get({ productId: "2", total: 1, limit: 1 });

    assert.equal(result[0].gender, "female");
    assert.equal(result[0].rating, 4); // 80 / 20
    assert.equal(result[0].country, "GB");
    assert.deepStrictEqual(result[0].photos, []);
    assert.deepStrictEqual(result[0].thumbnails, []);
  });

  await t.test("default rating 5 when buyerEval missing", async () => {
    const result = await get({ productId: "3", total: 1, limit: 1 });

    assert.equal(result[0].rating, 5);
  });

  await t.test("fallback to faker name when buyerName missing", async () => {
    const result = await get({ productId: "4", total: 1, limit: 1 });

    // name should equal displayName (faker-generated) since buyerName is absent
    assert.equal(result[0].name, result[0].displayName);
    assert.equal(typeof result[0].name, "string");
    assert.ok(result[0].name.length > 0);
  });

  await t.test("uses buyerName when provided", async () => {
    const result = await get({ productId: "5", total: 1, limit: 1 });

    assert.equal(result[0].name, "Alice Smith");
    assert.equal(typeof result[0].displayName, "string");
  });

  await t.test("empty response returns empty array", async () => {
    const result = await get({ productId: "6", total: 20, limit: 20 });

    assert.deepStrictEqual(result, []);
  });
});
