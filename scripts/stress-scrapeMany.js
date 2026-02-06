import { createScrapeMany } from "../src/scrapeMany.js";

const toPositiveInt = (value, fallback) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.trunc(parsed);
};

const toNonNegativeInt = (value, fallback) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback;
  }
  return Math.trunc(parsed);
};

const waitWithAbort = (ms, signal) =>
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

const ITEMS = toPositiveInt(process.env.STRESS_ITEMS, 1000);
const CONCURRENCY = toPositiveInt(process.env.STRESS_CONCURRENCY, 25);
const RETRIES = toNonNegativeInt(process.env.STRESS_RETRIES, 0);
const BASE_DELAY_MS = toPositiveInt(process.env.STRESS_DELAY_MS, 2);
const ITEM_TIMEOUT = toPositiveInt(process.env.STRESS_ITEM_TIMEOUT, 5000);
const FAIL_EVERY = toPositiveInt(process.env.STRESS_FAIL_EVERY, 0);
const EXPECT_MAX_MS = toPositiveInt(process.env.STRESS_EXPECT_MAX_MS, 30000);

const inputs = Array.from({ length: ITEMS }, (_, index) => `item-${index + 1}`);

const scrapeStub = async (input, { signal }) => {
  const index = Number(input.split("-")[1]) || 0;
  const jitter = index % 3;
  await waitWithAbort(BASE_DELAY_MS + jitter, signal);

  if (FAIL_EVERY > 0 && index % FAIL_EVERY === 0) {
    throw new Error(`simulated failure for ${input}`);
  }

  return { id: input, index };
};

const scrapeMany = createScrapeMany(scrapeStub);

console.log("Starting scrapeMany stress test...");
console.log(
  JSON.stringify(
    {
      items: ITEMS,
      concurrency: CONCURRENCY,
      retries: RETRIES,
      itemTimeout: ITEM_TIMEOUT,
      failEvery: FAIL_EVERY,
      expectMaxMs: EXPECT_MAX_MS,
    },
    null,
    2
  )
);

const startedAt = Date.now();
const result = await scrapeMany(inputs, {
  concurrency: CONCURRENCY,
  retries: RETRIES,
  itemTimeout: ITEM_TIMEOUT,
  onProgress: ({ completed, total, failed }) => {
    if (completed % 250 === 0 || completed === total) {
      console.log(`Progress: ${completed}/${total} (failed=${failed})`);
    }
  },
});

const durationMs = Date.now() - startedAt;
const throughput = Number((ITEMS / Math.max(durationMs, 1) * 1000).toFixed(2));

console.log("Stress test summary:");
console.log(
  JSON.stringify(
    {
      ...result.summary,
      throughputPerSecond: throughput,
      measuredDurationMs: durationMs,
    },
    null,
    2
  )
);

if (result.summary.total !== ITEMS) {
  throw new Error(`Expected ${ITEMS} total items but got ${result.summary.total}`);
}

if (EXPECT_MAX_MS > 0 && durationMs > EXPECT_MAX_MS) {
  throw new Error(
    `Stress test exceeded expected max duration (${durationMs}ms > ${EXPECT_MAX_MS}ms)`
  );
}

console.log("scrapeMany stress test passed.");
