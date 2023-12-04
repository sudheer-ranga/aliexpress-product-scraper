import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

import { get as GetVariants } from "./variants.js";
import { get as GetReviews } from "./reviews.js";
import { get as GetShippingDetails } from "./shipping.js";

const AliexpressProductScraper = async ({ id, reviewsCount, rating }) => {
  const REVIEWS_COUNT = reviewsCount || 20;
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();

  /** Scrape the aliexpress product page for details */
  await page.goto(`https://www.aliexpress.com/item/${id}.html`);
  const aliExpressData = await page.evaluate(() => runParams);

  const data = aliExpressData?.data;
  if (!data) {
    throw new Error("No data found");
  }

  const shipping = GetShippingDetails(
    data?.webGeneralFreightCalculateComponent?.originalLayoutResultList || []
  );

  /** Scrape the description page for the product using the description url */
  const descriptionUrl = data?.productDescComponent?.descriptionUrl;
  let descriptionData = null;
  if (descriptionUrl) {
    await page.goto(descriptionUrl);
    const descriptionPageHtml = await page.content();

    /** Build the AST for the description page html content using cheerio */
    const $ = cheerio.load(descriptionPageHtml);
    descriptionData = $("body").html();
  }

  await browser.close();

  const reviews = await GetReviews({
    productId: id,
    count: REVIEWS_COUNT,
    rating,
  });

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
};

export default AliexpressProductScraper;
