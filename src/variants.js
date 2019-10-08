module.exports = {
  get: function(skuModule) {
    const priceLists = skuModule.skuPriceList || [];
    const optionsLists = skuModule.productSKUPropertyList || [];

    const options = optionsLists.map(list => {
      return {
        id: list.skuPropertyId,
        name: list.skuPropertyName,
        values: list.skuPropertyValues.map(val => {
          return {
            id: val.propertyValueId,
            name: val.propertyValueName,
            displayName: val.propertyValueDisplayName,
            image: val.skuPropertyImagePath
          };
        })
      };
    });

    const lists = priceLists.map(list => {
      return {
        skuId: list.skuId,
        optionValueIds: list.skuPropIds,
        availableQuantity: list.skuVal.availQuantity,
        originalPrice: list.skuVal.skuAmount.value,
        salePrice: list.skuVal.skuActivityAmount.value
      };
    });

    return {
      options: options,
      prices: lists
    };
  }
};
