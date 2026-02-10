import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { extractDataFromApiResponse } from "../../src/parsers.js";
import { buildProductJson } from "../../src/transform.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturePath = path.join(__dirname, "..", "fixtures", "mtop-api.json");
const expectedPath = path.join(__dirname, "..", "fixtures", "expected-product.json");

const apiFixture = JSON.parse(await fs.readFile(fixturePath, "utf8"));
const expected = JSON.parse(await fs.readFile(expectedPath, "utf8"));

test("buildProductJson matches contract fixture", () => {
  const data = extractDataFromApiResponse(apiFixture);
  const result = buildProductJson({
    data,
    descriptionData: "<p>desc</p>",
    reviews: [],
  });

  assert.deepStrictEqual(result, expected);
});
