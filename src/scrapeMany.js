import scrape from "./aliexpressProductScraper.js";

const makeTimeoutError = (input, itemTimeout, attempt) => {
  const error = new Error(
    `scrapeMany timeout for input "${input}" after ${itemTimeout}ms (attempt ${attempt})`
  );
  error.code = "ITEM_TIMEOUT";
  return error;
};

const runAttemptWithTimeout = async ({
  scrapeFn,
  input,
  scrapeOptions,
  itemTimeout,
  attempt,
}) => {
  const controller = new AbortController();
  const attemptOptions = {
    ...scrapeOptions,
    signal: controller.signal,
  };

  const scrapePromise = Promise.resolve().then(() =>
    scrapeFn(input, attemptOptions)
  );

  if (!itemTimeout) {
    return scrapePromise;
  }

  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      const timeoutError = makeTimeoutError(input, itemTimeout, attempt);
      controller.abort(timeoutError);
      reject(timeoutError);
    }, itemTimeout);
  });

  try {
    return await Promise.race([scrapePromise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
};

const serializeError = (error) => {
  const normalized = error instanceof Error ? error : new Error(String(error));
  return {
    name: normalized.name,
    message: normalized.message,
    code: normalized.code || null,
  };
};

const validateBatchOptions = ({ concurrency, retries, itemTimeout, onProgress }) => {
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new Error("`concurrency` must be an integer >= 1");
  }

  if (!Number.isInteger(retries) || retries < 0) {
    throw new Error("`retries` must be an integer >= 0");
  }

  if (
    itemTimeout != null &&
    (!Number.isFinite(itemTimeout) || itemTimeout <= 0)
  ) {
    throw new Error("`itemTimeout` must be a positive number when provided");
  }

  if (onProgress != null && typeof onProgress !== "function") {
    throw new Error("`onProgress` must be a function when provided");
  }
};

const normalizeBatchInputs = (idsOrUrls) => {
  if (!Array.isArray(idsOrUrls) || idsOrUrls.length === 0) {
    throw new Error("Please provide a non-empty array of product ids or URLs");
  }

  return idsOrUrls;
};

const createScrapeMany = (scrapeFn = scrape) => {
  return async (idsOrUrls, options = {}) => {
    const {
      concurrency = 3,
      retries = 1,
      itemTimeout = 120000,
      onProgress,
      ...scrapeOptions
    } = options;

    validateBatchOptions({ concurrency, retries, itemTimeout, onProgress });
    const inputs = normalizeBatchInputs(idsOrUrls);

    const startedAt = Date.now();
    const total = inputs.length;
    const results = new Array(total);

    let nextIndex = 0;
    let completed = 0;
    let succeeded = 0;
    let failed = 0;
    let progressCallbackErrors = 0;

    const runSingle = async (input, index) => {
      const itemStartedAt = Date.now();
      let lastError = null;

      for (let attempt = 1; attempt <= retries + 1; attempt++) {
        try {
          const data = await runAttemptWithTimeout({
            scrapeFn,
            input,
            scrapeOptions,
            itemTimeout,
            attempt,
          });

          return {
            index,
            input,
            success: true,
            attempts: attempt,
            durationMs: Date.now() - itemStartedAt,
            data,
          };
        } catch (error) {
          lastError = error;
        }
      }

      return {
        index,
        input,
        success: false,
        attempts: retries + 1,
        durationMs: Date.now() - itemStartedAt,
        error: serializeError(lastError),
      };
    };

    const runWorker = async () => {
      while (true) {
        const currentIndex = nextIndex;
        if (currentIndex >= total) {
          return;
        }
        nextIndex += 1;

        const input = inputs[currentIndex];
        const result = await runSingle(input, currentIndex);
        results[currentIndex] = result;

        completed += 1;
        if (result.success) {
          succeeded += 1;
        } else {
          failed += 1;
        }

        if (onProgress) {
          try {
            onProgress({
              completed,
              total,
              succeeded,
              failed,
              current: {
                index: currentIndex,
                input,
                success: result.success,
              },
            });
          } catch {
            progressCallbackErrors += 1;
          }
        }
      }
    };

    const workerCount = Math.min(concurrency, total);
    await Promise.all(Array.from({ length: workerCount }, runWorker));

    return {
      items: results,
      summary: {
        total,
        succeeded,
        failed,
        progressCallbackErrors,
        durationMs: Date.now() - startedAt,
      },
    };
  };
};

const scrapeMany = createScrapeMany(scrape);

export { createScrapeMany, scrapeMany };
