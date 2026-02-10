/**
 * Parse JSONP response to extract JSON data
 * JSONP format: mtopjsonpX({...}) - may have leading whitespace
 */
const parseJsonp = (jsonpStr) => {
  const trimmed = jsonpStr.trim();

  const match = trimmed.match(/^[a-zA-Z0-9_]+\(([\s\S]+)\)$/);
  if (match && match[1]) {
    return JSON.parse(match[1]);
  }

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

  if (priceInfo.warmUpPrice) {
    return priceInfo.warmUpPrice;
  }

  if (priceInfo.salePrice) {
    return priceInfo.salePrice;
  }

  if (priceInfo.salePriceString) {
    const match = priceInfo.salePriceString.match(/([^\d]*)([0-9,.]+)/);
    if (match) {
      const value = parseFloat(match[2].replace(/,/g, ""));
      return {
        currency: priceInfo.originalPrice?.currency || "USD",
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

  const pathsArray = Object.values(skuPaths);

  return pathsArray.map((sku) => {
    const priceInfo = skuPriceInfoMap[sku.skuIdStr] || skuPriceInfoMap[sku.skuId];
    return {
      skuId: sku.skuId,
      skuPropIds: sku.path,
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
 */
const extractDataFromApiResponse = (apiData) => {
  const result = apiData?.data?.result;
  if (!result) {
    return null;
  }

  const globalData = result.GLOBAL_DATA?.globalData || {};

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
      productSKUPropertyList:
        result.SKU?.skuProperties || result.SKU?.productSKUPropertyList || [],
    },
    priceComponent: {
      skuPriceList:
        buildSkuPriceList(result.SKU?.skuPaths, result.PRICE?.skuPriceInfoMap) ||
        result.SKU?.skuPriceList ||
        result.PRICE?.skuPriceList ||
        [],
      origPrice: {
        minAmount:
          result.PRICE?.targetSkuPriceInfo?.originalPrice ||
          result.PRICE?.origPrice?.minAmount ||
          null,
        maxAmount:
          result.PRICE?.targetSkuPriceInfo?.originalPrice ||
          result.PRICE?.origPrice?.maxAmount ||
          null,
      },
      discountPrice: {
        minActivityAmount:
          getSalePrice(result.PRICE?.targetSkuPriceInfo) ||
          result.PRICE?.discountPrice?.minActivityAmount ||
          null,
        maxActivityAmount:
          getSalePrice(result.PRICE?.targetSkuPriceInfo) ||
          result.PRICE?.discountPrice?.maxActivityAmount ||
          null,
      },
    },
    productDescComponent: {
      descriptionUrl: result.DESC?.pcDescUrl || result.DESC?.descUrl || null,
    },
    webGeneralFreightCalculateComponent: {
      originalLayoutResultList: result.SHIPPING?.originalLayoutResultList || [],
    },
    productPropComponent: {
      props: result.PRODUCT_PROP_PC?.showedProps || result.PRODUCT_PROP_PC?.props || [],
    },
    currencyComponent: {
      currencyCode: globalData.currencyCode || "USD",
    },
  };
};

export { parseJsonp, getSalePrice, buildSkuPriceList, extractDataFromApiResponse };
