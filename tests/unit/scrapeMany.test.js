import { test } from "node:test";
import assert from "node:assert/strict";

import { batchScrape } from "../../src/scrapeMany.js";

test("batchScrape returns empty array for empty input", async () => {
  const results = await batchScrape([], {});
  assert.deepStrictEqual(results, []);
});

test("batchScrape scrapes all items", async () => {
  const mockScrape = async (id) => ({ title: `Product ${id}` });

  const results = await batchScrape(["1", "2", "3"], {}, mockScrape);
  assert.equal(results.length, 3);

  const ids = results.map((r) => r.productId).sort();
  assert.deepStrictEqual(ids, ["1", "2", "3"]);
});

test("batchScrape respects concurrency limit", async () => {
  let concurrent = 0;
  let maxConcurrent = 0;

  const mockScrape = async (id) => {
    concurrent++;
    maxConcurrent = Math.max(maxConcurrent, concurrent);
    await new Promise((r) => setTimeout(r, 50));
    concurrent--;
    return { title: `Product ${id}` };
  };

  const results = await batchScrape(
    ["1", "2", "3", "4"],
    { concurrency: 2 },
    mockScrape
  );

  assert.equal(results.length, 4);
  assert.ok(
    maxConcurrent <= 2,
    `Max concurrent was ${maxConcurrent}, expected <= 2`
  );
});

test("batchScrape sets data=null and error on failed items", async () => {
  const mockScrape = async (_id) => {
    throw new Error("scrape failed");
  };

  const results = await batchScrape(["42"], { retries: 0 }, mockScrape);
  assert.equal(results.length, 1);
  assert.equal(results[0].productId, "42");
  assert.equal(results[0].data, null);
  assert.ok(results[0].error instanceof Error);
  assert.equal(results[0].error.message, "scrape failed");
});

test("batchScrape sets data and error=null on successful items", async () => {
  const mockScrape = async (id) => ({ title: `Product ${id}` });

  const results = await batchScrape(["7"], {}, mockScrape);
  assert.equal(results.length, 1);
  assert.equal(results[0].productId, "7");
  assert.deepStrictEqual(results[0].data, { title: "Product 7" });
  assert.equal(results[0].error, null);
});

test("batchScrape retries on failure and succeeds", async () => {
  let callCount = 0;

  const mockScrape = async (id) => {
    callCount++;
    if (callCount === 1) {
      throw new Error("first attempt fails");
    }
    return { title: `Product ${id}` };
  };

  const results = await batchScrape(["99"], { retries: 1 }, mockScrape);
  assert.equal(results.length, 1);
  assert.equal(results[0].productId, "99");
  assert.deepStrictEqual(results[0].data, { title: "Product 99" });
  assert.equal(results[0].error, null);
  assert.equal(callCount, 2, "Should have been called twice (1 fail + 1 success)");
});

test("batchScrape exhausts all retries and returns error", async () => {
  let callCount = 0;

  const mockScrape = async (_id) => {
    callCount++;
    throw new Error(`attempt ${callCount} failed`);
  };

  const results = await batchScrape(["55"], { retries: 2 }, mockScrape);
  assert.equal(results.length, 1);
  assert.equal(results[0].data, null);
  assert.ok(results[0].error instanceof Error);
  // retries=2 means up to 3 total attempts (attempt 0, 1, 2)
  assert.equal(callCount, 3, "Should have tried 3 times (initial + 2 retries)");
});

test("batchScrape calls onProgress for each item", async () => {
  const progressEvents = [];

  const mockScrape = async (id) => ({ title: `Product ${id}` });

  await batchScrape(
    ["a", "b", "c"],
    {
      concurrency: 1,
      onProgress: (event) => progressEvents.push(event),
    },
    mockScrape
  );

  assert.equal(progressEvents.length, 3);

  // With concurrency=1 and sequential processing, completed counts should be 1, 2, 3
  const completedCounts = progressEvents.map((e) => e.completed).sort((a, b) => a - b);
  assert.deepStrictEqual(completedCounts, [1, 2, 3]);

  progressEvents.forEach((event) => {
    assert.equal(event.total, 3);
    assert.equal(event.success, true);
    assert.ok(["a", "b", "c"].includes(event.productId));
  });
});

test("batchScrape onProgress reports failure correctly", async () => {
  const progressEvents = [];

  const mockScrape = async (_id) => {
    throw new Error("fail");
  };

  await batchScrape(
    ["x"],
    {
      retries: 0,
      onProgress: (event) => progressEvents.push(event),
    },
    mockScrape
  );

  assert.equal(progressEvents.length, 1);
  assert.equal(progressEvents[0].success, false);
  assert.equal(progressEvents[0].productId, "x");
});

test("batchScrape includes correct productId for each result", async () => {
  const ids = ["100", "200", "300"];
  const mockScrape = async (id) => ({ title: `Product ${id}` });

  const results = await batchScrape(ids, {}, mockScrape);

  // Each result's productId should match the id we passed
  results.forEach((result) => {
    assert.ok(ids.includes(result.productId));
    assert.deepStrictEqual(result.data, { title: `Product ${result.productId}` });
  });
});
