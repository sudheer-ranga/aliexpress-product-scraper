import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import * as cheerio from "cheerio";

import { get as GetVariants } from "./variants.js";
import { get as GetReviews } from "./reviews.js";
import { get as GetShippingDetails } from "./shipping.js";

// Use stealth plugin to avoid bot detection
puppeteer.use(StealthPlugin());

/**
 * Parse JSONP response to extract JSON data
 * JSONP format: mtopjsonpX({...}) - may have leading whitespace
 */
const parseJsonp = (jsonpStr) => {
  // Trim whitespace
  const trimmed = jsonpStr.trim();
  
  // Match JSONP pattern: functionName({...})
  const match = trimmed.match(/^[a-zA-Z0-9_]+\(([\s\S]+)\)$/);
  if (match && match[1]) {
    return JSON.parse(match[1]);
  }
  
  // Try parsing as plain JSON
  return JSON.parse(trimmed);
};

/**
 * Extract sale price from targetSkuPriceInfo
 * Price can be in warmUpPrice, salePrice object, or parsed from salePriceString
 */
const getSalePrice = (priceInfo) => {
  if (!priceInfo) {
    return null;
  }
  
  // Check for warmUpPrice object (used during promotions)
  if (priceInfo.warmUpPrice) {
    return priceInfo.warmUpPrice;
  }
  
  // Check for salePrice object
  if (priceInfo.salePrice) {
    return priceInfo.salePrice;
  }
  
  // Parse from salePriceString (format: "Rs.3,224.17")
  if (priceInfo.salePriceString) {
    const match = priceInfo.salePriceString.match(/([^\d]*)([0-9,.]+)/);
    if (match) {
      const value = parseFloat(match[2].replace(/,/g, ''));
      return {
        currency: priceInfo.originalPrice?.currency || 'USD',
        formatedAmount: priceInfo.salePriceString,
        value: value,
      };
    }
  }
  
  return null;
};

/**
 * Build SKU price list from new API format
 * New API uses skuPaths (array) + skuPriceInfoMap (object) instead of skuPriceList
 */
const buildSkuPriceList = (skuPaths, skuPriceInfoMap) => {
  if (!skuPaths || !skuPriceInfoMap) {
    return [];
  }
  
  // skuPaths is an object with numeric keys
  const pathsArray = Object.values(skuPaths);
  
  return pathsArray.map(sku => {
    const priceInfo = skuPriceInfoMap[sku.skuIdStr] || skuPriceInfoMap[sku.skuId];
    return {
      skuId: sku.skuId,
      skuPropIds: sku.path, // e.g., "14:193;200009450:201450908"
      skuVal: {
        availQuantity: sku.skuStock || 0,
        skuAmount: priceInfo?.originalPrice || null,
        skuActivityAmount: priceInfo?.warmUpPrice || priceInfo?.salePrice || null,
      },
    };
  });
};

/**
 * Extract product data from API response
 * The new AliExpress CSR pages load data via mtop.aliexpress.pdp.pc.query API
 * 
 * New API structure (2024+):
 * - PRODUCT_TITLE: title info
 * - HEADER_IMAGE_PC: images
 * - PC_RATING: ratings
 * - QUANTITY_PC: inventory
 * - PRICE: pricing
 * - SKU: variants
 * - SHIPPING: shipping options
 * - PRODUCT_PROP_PC: product properties
 * - SHOP_CARD_PC: store info
 * - DESC: description
 * - GLOBAL_DATA: global/meta data
 */
const extractDataFromApiResponse = (apiData) => {
  const result = apiData?.data?.result;
  if (!result) {
    return null;
  }

  // Extract global data - note it's nested: GLOBAL_DATA.globalData
  const globalData = result.GLOBAL_DATA?.globalData || {};
  
  // Map the new API response format to maintain backwards compatibility
  return {
    productInfoComponent: {
      subject: result.PRODUCT_TITLE?.text || globalData.subject || "",
      categoryId: globalData.categoryId || null,
      id: globalData.productId || null,
    },
    inventoryComponent: {
      totalQuantity: result.QUANTITY_PC?.totalAvailableInventory || 0,
      totalAvailQuantity: result.QUANTITY_PC?.totalAvailableInventory || 0,
    },
    tradeComponent: {
      formatTradeCount: globalData.sales || "0",
    },
    sellerComponent: {
      storeName: result.SHOP_CARD_PC?.storeName || globalData.storeName || "",
      storeLogo: result.SHOP_CARD_PC?.logo || "",
      companyId: globalData.sellerId || null,
      storeNum: globalData.storeId || null,
      topRatedSeller: result.SHOP_CARD_PC?.topRatedSeller || false,
      payPalAccount: false,
    },
    storeFeedbackComponent: {
      sellerPositiveNum: result.SHOP_CARD_PC?.positiveNum || 0,
      sellerPositiveRate: result.SHOP_CARD_PC?.positiveRate || "0",
    },
    feedbackComponent: {
      evarageStar: result.PC_RATING?.rating || "0",
      totalValidNum: result.PC_RATING?.totalValidNum || 0,
      fiveStarNum: 0,
      fourStarNum: 0,
      threeStarNum: 0,
      twoStarNum: 0,
      oneStarNum: 0,
    },
    imageComponent: {
      imagePathList: result.HEADER_IMAGE_PC?.imagePathList || [],
    },
    skuComponent: {
      // New API uses skuProperties instead of productSKUPropertyList
      productSKUPropertyList: result.SKU?.skuProperties || result.SKU?.productSKUPropertyList || [],
    },
    priceComponent: {
      // Build skuPriceList from skuPaths + skuPriceInfoMap (new API format)
      skuPriceList: buildSkuPriceList(result.SKU?.skuPaths, result.PRICE?.skuPriceInfoMap) || 
                    result.SKU?.skuPriceList || result.PRICE?.skuPriceList || [],
      // Price info is in targetSkuPriceInfo for new API
      origPrice: {
        minAmount: result.PRICE?.targetSkuPriceInfo?.originalPrice || result.PRICE?.origPrice?.minAmount || null,
        maxAmount: result.PRICE?.targetSkuPriceInfo?.originalPrice || result.PRICE?.origPrice?.maxAmount || null,
      },
      discountPrice: {
        // Sale price can be in warmUpPrice, salePrice, or parsed from salePriceString
        minActivityAmount: getSalePrice(result.PRICE?.targetSkuPriceInfo) || result.PRICE?.discountPrice?.minActivityAmount || null,
        maxActivityAmount: getSalePrice(result.PRICE?.targetSkuPriceInfo) || result.PRICE?.discountPrice?.maxActivityAmount || null,
      },
    },
    productDescComponent: {
      // New API uses pcDescUrl instead of descUrl
      descriptionUrl: result.DESC?.pcDescUrl || result.DESC?.descUrl || null,
    },
    webGeneralFreightCalculateComponent: {
      // Shipping data is in originalLayoutResultList
      originalLayoutResultList: result.SHIPPING?.originalLayoutResultList || [],
    },
    productPropComponent: {
      // Props are in showedProps for new API
      props: result.PRODUCT_PROP_PC?.showedProps || result.PRODUCT_PROP_PC?.props || [],
    },
    currencyComponent: {
      currencyCode: globalData.currencyCode || "USD",
    },
  };
};

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
      total: data.feedbackComponent?.totalValidNum || 0,
      filterReviewsBy,
    });

    const [descriptionData, reviews] = await Promise.all([
      descriptionDataPromise,
      reviewsPromise,
    ]);

    await browser.close();

    /** Build the JSON response with aliexpress product details */
    const json = {
      title: data.productInfoComponent?.subject,
      categoryId: data.productInfoComponent?.categoryId,
      productId: data.productInfoComponent?.id,
      quantity: {
        total: data.inventoryComponent?.totalQuantity || 0,
        available: data.inventoryComponent?.totalAvailQuantity || 0,
      },
      description: descriptionData,
      orders: data.tradeComponent?.formatTradeCount || "0",
      storeInfo: {
        name: data.sellerComponent?.storeName,
        logo: data.sellerComponent?.storeLogo,
        companyId: data.sellerComponent?.companyId,
        storeNumber: data.sellerComponent?.storeNum,
        isTopRated: data.sellerComponent?.topRatedSeller || false,
        hasPayPalAccount: data.sellerComponent?.payPalAccount || false,
        ratingCount: data.storeFeedbackComponent?.sellerPositiveNum || 0,
        rating: data.storeFeedbackComponent?.sellerPositiveRate || "0",
      },
      ratings: {
        totalStar: 5,
        averageStar: data.feedbackComponent?.evarageStar || "0",
        totalStartCount: data.feedbackComponent?.totalValidNum || 0,
        fiveStarCount: data.feedbackComponent?.fiveStarNum || 0,
        fourStarCount: data.feedbackComponent?.fourStarNum || 0,
        threeStarCount: data.feedbackComponent?.threeStarNum || 0,
        twoStarCount: data.feedbackComponent?.twoStarNum || 0,
        oneStarCount: data.feedbackComponent?.oneStarNum || 0,
      },
      images: data.imageComponent?.imagePathList || [],
      reviews,
      variants: GetVariants({
        optionsLists: data?.skuComponent?.productSKUPropertyList || [],
        priceLists: data?.priceComponent?.skuPriceList || [],
      }),
      specs: data.productPropComponent?.props || [],
      currencyInfo: data.currencyComponent || {},
      originalPrice: {
        min: data.priceComponent?.origPrice?.minAmount,
        max: data.priceComponent?.origPrice?.maxAmount,
      },
      salePrice: {
        min: data.priceComponent?.discountPrice?.minActivityAmount,
        max: data.priceComponent?.discountPrice?.maxActivityAmount,
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
