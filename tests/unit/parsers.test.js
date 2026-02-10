import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  parseJsonp,
  getSalePrice,
  buildSkuPriceList,
  extractDataFromApiResponse,
} from "../../src/parsers.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturePath = path.join(__dirname, "..", "fixtures", "mtop-api.json");
const apiFixture = JSON.parse(await fs.readFile(fixturePath, "utf8"));

test("parseJsonp handles JSONP wrapper", () => {
  const jsonp = "mtopjsonp1({\"data\":{\"ok\":true}})";
  const parsed = parseJsonp(jsonp);
  assert.deepStrictEqual(parsed, { data: { ok: true } });
});

test("parseJsonp handles whitespace and raw JSON", () => {
  const raw = "  {\"a\":1}  ";
  const parsed = parseJsonp(raw);
  assert.deepStrictEqual(parsed, { a: 1 });
});

test("getSalePrice prioritizes warmUpPrice", () => {
  const price = {
    warmUpPrice: { currency: "USD", formatedAmount: "$9.00", value: 9 },
    salePrice: { currency: "USD", formatedAmount: "$8.00", value: 8 },
  };
  assert.deepStrictEqual(getSalePrice(price), price.warmUpPrice);
});

test("getSalePrice falls back to salePrice", () => {
  const price = {
    salePrice: { currency: "USD", formatedAmount: "$8.00", value: 8 },
  };
  assert.deepStrictEqual(getSalePrice(price), price.salePrice);
});

test("getSalePrice parses salePriceString", () => {
  const price = {
    originalPrice: { currency: "EUR" },
    salePriceString: "EUR 1,234.50",
  };
  assert.deepStrictEqual(getSalePrice(price), {
    currency: "EUR",
    formatedAmount: "EUR 1,234.50",
    value: 1234.5,
  });
});

test("buildSkuPriceList maps skuPaths + skuPriceInfoMap", () => {
  const skuPaths = {
    "0": { skuId: 1, skuIdStr: "1", path: "14:1", skuStock: 3 },
  };
  const skuPriceInfoMap = {
    "1": { originalPrice: { value: 10 }, salePrice: { value: 8 } },
  };
  const list = buildSkuPriceList(skuPaths, skuPriceInfoMap);
  assert.deepStrictEqual(list, [
    {
      skuId: 1,
      skuPropIds: "14:1",
      skuVal: {
        availQuantity: 3,
        skuAmount: { value: 10 },
        skuActivityAmount: { value: 8 },
      },
    },
  ]);
});

test("extractDataFromApiResponse maps core fields", () => {
  const data = extractDataFromApiResponse(apiFixture);
  assert.equal(data.productInfoComponent.subject, "Test Product");
  assert.equal(data.productInfoComponent.id, 999);
  assert.equal(data.inventoryComponent.totalQuantity, 7);
  assert.equal(data.sellerComponent.storeName, "Test Store");
  assert.equal(data.feedbackComponent.evarageStar, "4.8");
  assert.equal(data.currencyComponent.currencyCode, "USD");
});
