import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import * as cheerio from "cheerio";

import { get as GetReviews } from "./reviews.js";
import { parseJsonp, extractDataFromApiResponse } from "./parsers.js";
import { buildProductJson } from "./transform.js";

// Use stealth plugin to avoid bot detection
puppeteer.use(StealthPlugin());


const AliexpressProductScraper = async (
  id,
  { reviewsCount = 20, filterReviewsBy = "all", puppeteerOptions = {}, timeout = 60000 } = {}
) => {
  if (!id) {
    throw new Error("Please provide a valid product id");
  }

  let browser;

  try {
    const REVIEWS_COUNT = reviewsCount || 20;
    browser = await puppeteer.launch({
      headless: true,
      ...(puppeteerOptions || {}),
    });
    const page = await browser.newPage();

    // Set up response interception to capture the product data API
    // AliExpress uses CSR (Client-Side Rendering) and loads data via mtop API
    let apiData = null;
    
    page.on('response', async (response) => {
      const url = response.url();
      // Capture the product detail API response
      if (url.includes('mtop.aliexpress') && url.includes('pdp')) {
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
    let descriptionDataPromise = null;
    if (descriptionUrl) {
      descriptionDataPromise = page.goto(descriptionUrl).then(async () => {
        const descriptionPageHtml = await page.content();
        const $ = cheerio.load(descriptionPageHtml);
        return $("body").html();
      });
    }

    const reviewsPromise = GetReviews({
      productId: id,
      limit: REVIEWS_COUNT,
      total: data.feedbackComponent?.totalValidNum || 0,
      filterReviewsBy,
    });

    const [descriptionData, reviews] = await Promise.all([
      descriptionDataPromise,
      reviewsPromise,
    ]);

    await browser.close();

    return buildProductJson({ data, descriptionData, reviews });
  } catch (error) {
    console.error(error);
    if (browser) {
      await browser.close();
    }
    throw error;
  }
};

export default AliexpressProductScraper;
