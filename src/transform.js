import { get as GetVariants } from "./variants.js";
import { get as GetShippingDetails } from "./shipping.js";

const buildProductJson = ({ data, descriptionData = null, reviews = [] }) => {
  const shipping = GetShippingDetails(
    data?.webGeneralFreightCalculateComponent?.originalLayoutResultList || []
  );

  return {
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
};

export { buildProductJson };
