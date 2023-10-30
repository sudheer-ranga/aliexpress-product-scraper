const puppeteer = require("puppeteer-extra");
const cheerio = require("cheerio");

const Variants = require("./variants");
const Feedback = require("./feedback");
const Shipping = require("./shipping");

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

async function AliexpressProductScraper(productId, feedbackLimit) {
  const FEEDBACK_LIMIT = feedbackLimit || 10;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  /** Scrape the aliexpress product page for details */
  await page.goto(`https://www.aliexpress.com/item/${productId}.html`);
  const aliExpressData = await page.evaluate(() => runParams);

  const data = aliExpressData.data;
  const shipping = Shipping.getShippingData(
    data.webGeneralFreightCalculateComponent
  );

  /** Scrape the description page for the product using the description url */
  const descriptionUrl = data.productDescComponent.descriptionUrl;
  await page.goto(descriptionUrl);
  const descriptionPageHtml = await page.content();

  /** Build the AST for the description page html content using cheerio */
  const $ = cheerio.load(descriptionPageHtml);
  const descriptionData = $("body").html();

  /** Fetch the adminAccountId required to fetch the feedbacks */
  const adminAccountId = await page.evaluate(() => adminAccountId);
  await browser.close();

  let feedbackData = [];

  if (data.feedbackComponent.totalValidNum > 0) {
    feedbackData = await Feedback.get(
      data.productInfoComponent.id,
      adminAccountId,
      data.feedbackComponent.totalValidNum,
      FEEDBACK_LIMIT
    );
  }

  /** Build the JSON response with aliexpress product details */
  const json = {
    title: data.productInfoComponent.subject,
    categoryId: data.productInfoComponent.categoryId,
    productId: data.productInfoComponent.id,
    totalAvailableQuantity: data.inventoryComponent.totalAvailQuantity,
    description: descriptionData,
    orders: data.tradeComponent.formatTradeCount,
    storeInfo: {
      name: data.sellerComponent.storeName,
      companyId: data.sellerComponent.companyId,
      storeNumber: data.sellerComponent.storeNum,
      followers: NaN,
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
    feedback: feedbackData,
    variants: Variants.get(data.priceComponent, data.skuComponent),
    specs: data.productPropComponent.props,
    currency: data.currencyComponent.currencyCode,
    originalPrice: {
      min: data.priceComponent.origPrice.minAmount.value,
      max: data.priceComponent.origPrice.maxAmount.value,
    },
    salePrice: {
      min: data.priceComponent.discountPrice.minActivityAmount
        ? data.priceComponent.discountPrice.minActivityAmount.value
        : data.priceComponent.origPrice.minAmount.value,
      max: data.priceComponent.discountPrice.maxActivityAmount
        ? data.priceComponent.discountPrice.maxActivityAmount.value
        : data.priceComponent.origPrice.maxAmount.value,
    },
    shipping,
  };

  return json;
}

module.exports = AliexpressProductScraper;
