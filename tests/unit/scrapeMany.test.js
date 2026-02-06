import { test } from "node:test";
import assert from "node:assert/strict";

import { createScrapeMany } from "../../src/scrapeMany.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const delayWithAbort = (ms, signal) =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason || new Error("aborted"));
      return;
    }

    const timeoutId = setTimeout(resolve, ms);
    if (signal) {
      signal.addEventListener(
        "abort",
        () => {
          clearTimeout(timeoutId);
          reject(signal.reason || new Error("aborted"));
        },
        { once: true }
      );
    }
  });

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

test("scrapeMany ignores progress callback errors and keeps running", async () => {
  const scrapeMany = createScrapeMany(async (input) => ({ value: input }));

  const result = await scrapeMany(["a", "b", "c"], {
    concurrency: 2,
    onProgress: () => {
      throw new Error("progress callback failed");
    },
  });

  assert.equal(result.summary.total, 3);
  assert.equal(result.summary.succeeded, 3);
  assert.equal(result.summary.progressCallbackErrors, 3);
});

test("scrapeMany aborts timed-out attempt via signal", async () => {
  let aborts = 0;
  const scrapeStub = async (_input, { signal }) => {
    try {
      await delayWithAbort(100, signal);
      return { ok: true };
    } catch (error) {
      if (error?.code === "ITEM_TIMEOUT") {
        aborts += 1;
      }
      throw error;
    }
  };

  const scrapeMany = createScrapeMany(scrapeStub);
  const result = await scrapeMany(["slow"], {
    retries: 0,
    itemTimeout: 10,
  });

  assert.equal(result.summary.failed, 1);
  assert.equal(result.items[0].error.code, "ITEM_TIMEOUT");
  assert.equal(aborts, 1);
});

test("scrapeMany handles a large synthetic batch", async () => {
  const inputs = Array.from({ length: 1000 }, (_, index) => `item-${index + 1}`);
  const scrapeMany = createScrapeMany(async (input) => ({ id: input }));

  const result = await scrapeMany(inputs, {
    concurrency: 50,
    retries: 0,
  });

  assert.equal(result.summary.total, 1000);
  assert.equal(result.summary.succeeded, 1000);
  assert.equal(result.summary.failed, 0);
  assert.equal(result.items[0].data.id, "item-1");
  assert.equal(result.items[999].data.id, "item-1000");
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
