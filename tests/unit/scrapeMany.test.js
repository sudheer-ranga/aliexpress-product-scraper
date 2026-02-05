import { test } from "node:test";
import assert from "node:assert/strict";

import { createScrapeMany } from "../../src/scrapeMany.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test("scrapeMany runs a batch and preserves input order in output", async () => {
  const scrapeStub = async (input) => {
    await delay(input === "slow" ? 20 : 5);
    return { value: input };
  };

  const scrapeMany = createScrapeMany(scrapeStub);
  const result = await scrapeMany(["slow", "fast"], {
    concurrency: 2,
    retries: 0,
  });

  assert.equal(result.summary.total, 2);
  assert.equal(result.summary.succeeded, 2);
  assert.equal(result.summary.failed, 0);
  assert.equal(result.items[0].data.value, "slow");
  assert.equal(result.items[1].data.value, "fast");
});

test("scrapeMany retries failed items", async () => {
  const attempts = new Map();
  const scrapeStub = async (input) => {
    const current = (attempts.get(input) || 0) + 1;
    attempts.set(input, current);
    if (input === "retry-once" && current === 1) {
      throw new Error("temporary failure");
    }
    return { value: input };
  };

  const scrapeMany = createScrapeMany(scrapeStub);
  const result = await scrapeMany(["retry-once"], {
    retries: 1,
    concurrency: 1,
  });

  assert.equal(result.summary.succeeded, 1);
  assert.equal(result.items[0].attempts, 2);
});

test("scrapeMany reports timeout failures per item", async () => {
  const scrapeStub = async () => {
    await delay(50);
    return { ok: true };
  };

  const scrapeMany = createScrapeMany(scrapeStub);
  const result = await scrapeMany(["slow-item"], {
    retries: 0,
    itemTimeout: 10,
  });

  assert.equal(result.summary.failed, 1);
  assert.equal(result.items[0].success, false);
  assert.equal(result.items[0].error.code, "ITEM_TIMEOUT");
});

test("scrapeMany emits progress events", async () => {
  const scrapeStub = async (input) => ({ value: input });
  const scrapeMany = createScrapeMany(scrapeStub);
  const progress = [];

  const result = await scrapeMany(["a", "b", "c"], {
    concurrency: 2,
    onProgress: (event) => progress.push(event),
  });

  assert.equal(result.summary.total, 3);
  assert.equal(progress.length, 3);
  assert.equal(progress[2].completed, 3);
});

test("scrapeMany validates options", async () => {
  const scrapeMany = createScrapeMany(async () => ({}));

  await assert.rejects(
    () => scrapeMany([], {}),
    /non-empty array/
  );
  await assert.rejects(
    () => scrapeMany(["x"], { concurrency: 0 }),
    /concurrency/
  );
  await assert.rejects(
    () => scrapeMany(["x"], { retries: -1 }),
    /retries/
  );
  await assert.rejects(
    () => scrapeMany(["x"], { itemTimeout: 0 }),
    /itemTimeout/
  );
});
