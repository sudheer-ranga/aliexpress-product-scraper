import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import * as cheerio from "cheerio";

import { get as GetReviews } from "./reviews.js";
import { parseJsonp, extractDataFromApiResponse } from "./parsers.js";
import { buildProductJson } from "./transform.js";
import { normalizeProductId } from "./input.js";
import { normalizeFields, shouldFetchField, pickFields } from "./fields.js";

// Use stealth plugin to avoid bot detection
puppeteer.use(StealthPlugin());

const FAST_MODE_BLOCKED_RESOURCE_TYPES = new Set([
  "image",
  "media",
  "font",
  "stylesheet",
]);

const createAbortError = () => {
  const error = new Error("Scrape aborted");
  error.name = "AbortError";
  error.code = "ABORT_ERR";
  return error;
};

const throwIfAborted = (signal) => {
  if (signal?.aborted) {
    throw createAbortError();
  }
};

const AliexpressProductScraper = async (
  idOrUrl,
  {
    reviewsCount = 20,
    filterReviewsBy = "all",
    puppeteerOptions = {},
    timeout = 60000,
    fastMode = false,
    fields = null,
    signal = null,
  } = {}
) => {
  if (!idOrUrl) {
    throw new Error("Please provide a valid product id");
  }

  throwIfAborted(signal);

  const id = normalizeProductId(idOrUrl);
  const selectedFields = normalizeFields(fields);
  const shouldFetchDescription = shouldFetchField({
    fields: selectedFields,
    field: "description",
    fastMode,
  });
  const shouldFetchReviews = shouldFetchField({
    fields: selectedFields,
    field: "reviews",
    fastMode,
  });

  let browser;
  let browserClosed = false;
  let abortListener;
  const closeBrowser = async () => {
    if (!browser || browserClosed) {
      return;
    }

    browserClosed = true;
    try {
      await browser.close();
    } catch {
      // Ignore close errors during abort/cleanup paths
    }
  };

  try {
    const REVIEWS_COUNT = reviewsCount || 20;
    browser = await puppeteer.launch({
      headless: true,
      ...(puppeteerOptions || {}),
    });

    if (signal) {
      abortListener = () => {
        void closeBrowser();
      };
      signal.addEventListener("abort", abortListener, { once: true });
    }

    throwIfAborted(signal);
    const page = await browser.newPage();

    if (fastMode) {
      await page.setRequestInterception(true);
      page.on("request", (request) => {
        if (FAST_MODE_BLOCKED_RESOURCE_TYPES.has(request.resourceType())) {
          request.abort();
          return;
        }
        request.continue();
      });
    }

    // Set up response interception to capture the product data API
    // AliExpress uses CSR (Client-Side Rendering) and loads data via mtop API
    let apiData = null;

    page.on("response", async (response) => {
      const url = response.url();
      // Capture the product detail API response
      if (url.includes("mtop.aliexpress") && url.includes("pdp")) {
        try {
          const text = await response.text();
          if (text && text.length > 1000) {
            const parsed = parseJsonp(text);
            if (parsed?.data?.result) {
              apiData = parsed;
            }
          }
        } catch {
          // Ignore parsing errors - some responses may not be valid JSONP
        }
      }
    });

    /** Scrape the aliexpress product page for details */
    await page.goto(`https://www.aliexpress.com/item/${id}.html`, {
      waitUntil: "networkidle2", // Use networkidle2 for CSR pages
      timeout: timeout,
    });

    // Wait for API data to be captured (CSR pages load data asynchronously)
    let data = null;
    const maxWaitTime = 15000; // 15 seconds max
    const startTime = Date.now();

    while (!data && (Date.now() - startTime) < maxWaitTime) {
      throwIfAborted(signal);
      // First try to get data from intercepted API
      if (apiData) {
        data = extractDataFromApiResponse(apiData);
        if (data) {
          break;
        }
      }

      // Also try the traditional runParams approach (for backwards compatibility)
      const runParamsData = await page.evaluate(() => {
        try {
          return window.runParams?.data || null;
        } catch {
          return null;
        }
      });

      if (runParamsData && Object.keys(runParamsData).length > 0) {
        data = runParamsData;
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    if (!data) {
      throw new Error(
        `Failed to extract product data for product ID: ${id}. ` +
        `This may indicate: (1) The product ID is invalid, (2) AliExpress page structure has changed, ` +
        `(3) The page didn't load completely, or (4) Anti-bot measures are blocking access.`
      );
    }

    /** Scrape the description page for the product using the description url */
    const descriptionUrl = data?.productDescComponent?.descriptionUrl;
    let descriptionDataPromise = Promise.resolve(null);
    if (shouldFetchDescription && descriptionUrl) {
      descriptionDataPromise = page.goto(descriptionUrl).then(async () => {
        const descriptionPageHtml = await page.content();
        const $ = cheerio.load(descriptionPageHtml);
        return $("body").html();
      });
    }

    let reviewsPromise = Promise.resolve([]);
    if (shouldFetchReviews) {
      reviewsPromise = GetReviews({
        productId: id,
        limit: REVIEWS_COUNT,
        total: data.feedbackComponent?.totalValidNum || 0,
        filterReviewsBy,
      });
    }

    const [descriptionData, reviews] = await Promise.all([
      descriptionDataPromise,
      reviewsPromise,
    ]);

    await closeBrowser();

    const productJson = buildProductJson({ data, descriptionData, reviews });
    return pickFields(productJson, selectedFields);
  } catch (error) {
    if (!signal?.aborted) {
      console.error(error);
    }

    await closeBrowser();
    if (signal?.aborted && error?.code !== "ABORT_ERR") {
      throw createAbortError();
    }

    throw error;
  } finally {
    if (signal && abortListener) {
      signal.removeEventListener("abort", abortListener);
    }
  }
};

export default AliexpressProductScraper;
