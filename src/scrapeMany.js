import AliexpressProductScraper from "./aliexpressProductScraper.js";

/**
 * Core batch scraping orchestration. Accepts a custom scrapeFn for testability.
 *
 * @param {string[]} ids - Array of product IDs to scrape
 * @param {object} options - Options for batch scraping
 * @param {number} [options.concurrency=2] - Max number of concurrent scrape operations
 * @param {number} [options.retries=1] - Number of retry attempts on failure
 * @param {number} [options.timeout=60000] - Timeout per scrape in ms
 * @param {Function|null} [options.onProgress=null] - Progress callback
 * @param {Function} [scrapeFn=AliexpressProductScraper] - Scraper function to use
 * @returns {Promise<Array<{productId: string, data: object|null, error: Error|null}>>}
 */
const batchScrape = async (ids, options = {}, scrapeFn = AliexpressProductScraper) => {
  const {
    concurrency = 2,
    retries = 1,
    timeout = 60000,
    onProgress = null,
    ...scraperOptions
  } = options;

  if (!ids || ids.length === 0) {
    return [];
  }

  const results = [];
  let completed = 0;
  const total = ids.length;

  const queue = [...ids];

  const processItem = async () => {
    while (queue.length > 0) {
      const productId = queue.shift();
      let lastError = null;
      let data = null;

      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          data = await scrapeFn(productId, {
            ...scraperOptions,
            timeout,
          });
          break;
        } catch (error) {
          lastError = error;
        }
      }

      completed++;
      const result = data
        ? { productId, data, error: null }
        : { productId, data: null, error: lastError };
      results.push(result);

      if (onProgress) {
        onProgress({
          completed,
          total,
          productId,
          success: data !== null,
        });
      }
    }
  };

  // Launch concurrent workers
  const workers = [];
  for (let i = 0; i < Math.min(concurrency, ids.length); i++) {
    workers.push(processItem());
  }

  await Promise.all(workers);
  return results;
};

/**
 * Scrape multiple AliExpress products in batch with concurrency control.
 *
 * @param {string[]} ids - Array of product IDs to scrape
 * @param {object} [options={}] - Options for batch scraping
 * @param {number} [options.concurrency=2] - Max number of concurrent scrape operations
 * @param {number} [options.retries=1] - Number of retry attempts on failure
 * @param {number} [options.timeout=60000] - Timeout per scrape in ms
 * @param {Function|null} [options.onProgress=null] - Progress callback called after each item
 * @param {number} [options.reviewsCount] - Number of reviews to fetch per product
 * @param {string} [options.filterReviewsBy] - Filter reviews by this value
 * @param {object} [options.puppeteerOptions] - Extra puppeteer launch options
 * @returns {Promise<Array<{productId: string, data: object|null, error: Error|null}>>}
 */
const scrapeMany = async (ids, options = {}) => {
  return batchScrape(ids, options);
};

export { scrapeMany, batchScrape };
