import { test } from "node:test";
import assert from "node:assert/strict";

import scrape, { scrapeMany } from "../../index.js";

test("public API exports default scrape and named scrapeMany", () => {
  assert.equal(typeof scrape, "function");
  assert.equal(typeof scrapeMany, "function");
});
