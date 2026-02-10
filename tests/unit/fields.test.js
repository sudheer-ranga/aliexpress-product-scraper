import { test } from "node:test";
import assert from "node:assert/strict";

import {
  normalizeFields,
  shouldFetchField,
  pickFields,
} from "../../src/fields.js";

test("normalizeFields returns null when fields is not provided", () => {
  assert.equal(normalizeFields(undefined), null);
});

test("normalizeFields de-duplicates while preserving order", () => {
  assert.deepStrictEqual(
    normalizeFields(["title", "reviews", "title"]),
    ["title", "reviews"]
  );
});

test("normalizeFields rejects unsupported fields", () => {
  assert.throws(
    () => normalizeFields(["title", "unknownField"]),
    /Unsupported field/
  );
});

test("shouldFetchField skips heavy fields in fastMode", () => {
  assert.equal(
    shouldFetchField({ fields: null, field: "description", fastMode: true }),
    false
  );
  assert.equal(
    shouldFetchField({ fields: null, field: "reviews", fastMode: true }),
    false
  );
});

test("pickFields keeps only selected fields", () => {
  const product = {
    title: "Product",
    productId: 123,
    reviews: [],
  };

  assert.deepStrictEqual(pickFields(product, ["title", "reviews"]), {
    title: "Product",
    reviews: [],
  });
});
