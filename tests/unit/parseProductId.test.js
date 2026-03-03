import { test } from "node:test";
import assert from "node:assert/strict";
import { parseProductId } from "../../src/parseProductId.js";

// --- Numeric inputs ---

test("numeric string passes through as-is", () => {
  assert.equal(parseProductId("1005006543210"), "1005006543210");
});

test("number (integer) is converted to string", () => {
  assert.equal(parseProductId(1005006543210), "1005006543210");
});

// --- URL inputs ---

test("standard aliexpress.com URL extracts product ID", () => {
  assert.equal(
    parseProductId("https://www.aliexpress.com/item/1005006543210.html"),
    "1005006543210"
  );
});

test("aliexpress.us URL extracts product ID", () => {
  assert.equal(
    parseProductId("https://aliexpress.us/item/1005006543210.html"),
    "1005006543210"
  );
});

test("mobile aliexpress URL extracts product ID", () => {
  assert.equal(
    parseProductId("https://m.aliexpress.com/item/1005006543210.html"),
    "1005006543210"
  );
});

test("URL with query params extracts product ID", () => {
  assert.equal(
    parseProductId("https://www.aliexpress.com/item/1005006543210.html?spm=abc&algo=xyz"),
    "1005006543210"
  );
});

// --- Invalid inputs ---

test("non-AliExpress URL throws descriptive error", () => {
  assert.throws(
    () => parseProductId("https://google.com"),
    (err) => {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes("Unrecognized product input"));
      return true;
    }
  );
});

test("empty string throws error", () => {
  assert.throws(
    () => parseProductId(""),
    (err) => {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes("valid product ID or AliExpress URL"));
      return true;
    }
  );
});

test("null throws error", () => {
  assert.throws(
    () => parseProductId(null),
    (err) => {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes("valid product ID or AliExpress URL"));
      return true;
    }
  );
});
