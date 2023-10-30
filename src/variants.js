module.exports = {
  get: function (priceComponent, skuComponent) {
    const priceLists = priceComponent.skuPriceList || [];
    const optionsLists = skuComponent.productSKUPropertyList || [];

    const options = optionsLists.map((list) => {
      return {
        id: list.skuPropertyId,
        name: list.skuPropertyName,
        values: list.skuPropertyValues.map((val) => {
          return {
            id: val.propertyValueId,
            name: val.propertyValueName,
            displayName: val.propertyValueDisplayName,
            image: val.skuPropertyImagePath,
          };
        }),
      };
    });

    const lists = priceLists.map((list) => {
      return {
        skuId: list.skuId,
        optionValueIds: list.skuPropIds,
        availableQuantity: list.skuVal.availQuantity,
        originalPrice: list.skuVal.skuAmount.value,
        salePrice: list.skuVal.skuActivityAmount
          ? list.skuVal.skuActivityAmount.value
          : list.skuVal.skuAmount.value,
      };
    });

    return {
      options: options,
      prices: lists,
    };
  },
};
