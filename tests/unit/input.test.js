import { test } from "node:test";
import assert from "node:assert/strict";

import { normalizeProductId } from "../../src/input.js";

test("normalizeProductId accepts raw product id", () => {
  assert.equal(normalizeProductId("1005007429636284"), "1005007429636284");
});

test("normalizeProductId accepts numeric product id", () => {
  assert.equal(normalizeProductId(1234567890123), "1234567890123");
});

test("normalizeProductId accepts product URL", () => {
  const url = "https://www.aliexpress.com/item/1005007429636284.html";
  assert.equal(normalizeProductId(url), "1005007429636284");
});

test("normalizeProductId accepts compact /i/ URL", () => {
  const url = "https://www.aliexpress.com/i/1005007429636284.html";
  assert.equal(normalizeProductId(url), "1005007429636284");
});

test("normalizeProductId accepts query param fallback", () => {
  const url = "https://www.aliexpress.com/p/item?foo=bar&productId=1005007429636284";
  assert.equal(normalizeProductId(url), "1005007429636284");
});

test("normalizeProductId rejects invalid input", () => {
  assert.throws(
    () => normalizeProductId("https://www.aliexpress.com/category/200000001.html"),
    /valid product id or AliExpress product URL/
  );
});

test("normalizeProductId rejects zero-like ids", () => {
  assert.throws(
    () => normalizeProductId("0000000"),
    /valid product id or AliExpress product URL/
  );
  assert.throws(
    () => normalizeProductId("https://www.aliexpress.com/item/0.html"),
    /valid product id or AliExpress product URL/
  );
});

test("normalizeProductId rejects invalid numeric ids", () => {
  assert.throws(
    () => normalizeProductId(-10),
    /valid product id or AliExpress product URL/
  );
  assert.throws(
    () => normalizeProductId(12.34),
    /valid product id or AliExpress product URL/
  );
  assert.throws(
    () => normalizeProductId(Number.MAX_SAFE_INTEGER + 1),
    /valid product id or AliExpress product URL/
  );
});
