import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

import { get as GetVariants } from "./variants.js";
import { get as GetReviews } from "./reviews.js";
import { get as GetShippingDetails } from "./shipping.js";

const AliexpressProductScraper = async (
  id,
  { reviewsCount = 20, filterReviewsBy = "all", puppeteerOptions = {} } = {}
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

    /** Scrape the aliexpress product page for details */
    await page.goto(`https://www.aliexpress.com/item/${id}.html`, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Wait for runParams to be available with retries
    let aliExpressData = null;
    const maxRetries = 5;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      aliExpressData = await page.evaluate(() => {
        try {
          return window.runParams || null;
        } catch (error) {
          return null;
        }
      });

      if (aliExpressData) {
        break;
      }

      // Wait a bit before retrying (using setTimeout in page context)
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (!aliExpressData) {
      throw new Error(
        `Failed to extract runParams from AliExpress page for product ID: ${id}. ` +
        `This may indicate: (1) The product ID is invalid, (2) AliExpress page structure has changed, ` +
        `(3) The page didn't load completely, or (4) Anti-bot measures are blocking access.`
      );
    }

    const data = aliExpressData?.data;
    if (!data) {
      throw new Error(
        `runParams.data is missing for product ID: ${id}. ` +
        `The page loaded but product data structure is incomplete. ` +
        `This may indicate the product page structure has changed or the product is unavailable.`
      );
    }

    const shipping = GetShippingDetails(
      data?.webGeneralFreightCalculateComponent?.originalLayoutResultList || []
    );

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
      total: data.feedbackComponent.totalValidNum,
      filterReviewsBy,
    });

    const [descriptionData, reviews] = await Promise.all([
      descriptionDataPromise,
      reviewsPromise,
    ]);

    await browser.close();

    /** Build the JSON response with aliexpress product details */
    const json = {
      title: data.productInfoComponent.subject,
      categoryId: data.productInfoComponent.categoryId,
      productId: data.productInfoComponent.id,
      quantity: {
        total: data.inventoryComponent.totalQuantity,
        available: data.inventoryComponent.totalAvailQuantity,
      },
      description: descriptionData,
      orders: data.tradeComponent.formatTradeCount,
      storeInfo: {
        name: data.sellerComponent.storeName,
        logo: data.sellerComponent.storeLogo,
        companyId: data.sellerComponent.companyId,
        storeNumber: data.sellerComponent.storeNum,
        isTopRated: data.sellerComponent.topRatedSeller,
        hasPayPalAccount: data.sellerComponent.payPalAccount,
        ratingCount: data.storeFeedbackComponent.sellerPositiveNum,
        rating: data.storeFeedbackComponent.sellerPositiveRate,
      },
      ratings: {
        totalStar: 5,
        averageStar: data.feedbackComponent.evarageStar,
        totalStartCount: data.feedbackComponent.totalValidNum,
        fiveStarCount: data.feedbackComponent.fiveStarNum,
        fourStarCount: data.feedbackComponent.fourStarNum,
        threeStarCount: data.feedbackComponent.threeStarNum,
        twoStarCount: data.feedbackComponent.twoStarNum,
        oneStarCount: data.feedbackComponent.oneStarNum,
      },
      images: (data.imageComponent && data.imageComponent.imagePathList) || [],
      reviews,
      variants: GetVariants({
        optionsLists: data?.skuComponent?.productSKUPropertyList || [],
        priceLists: data?.priceComponent?.skuPriceList || [],
      }),
      specs: data.productPropComponent.props,
      currencyInfo: data.currencyComponent,
      originalPrice: {
        min: data.priceComponent.origPrice.minAmount,
        max: data.priceComponent.origPrice.maxAmount,
      },
      salePrice: {
        min: data.priceComponent.discountPrice.minActivityAmount,
        max: data.priceComponent.discountPrice.maxActivityAmount,
      },
      shipping,
    };

    return json;
  } catch (error) {
    console.error(error);
    if (browser) {
      await browser.close();
    }
    throw error;
  }
};

export default AliexpressProductScraper;
