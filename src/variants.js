const get = ({ priceLists = [], optionsLists = [] }) => {
  priceLists = priceLists || [];
  optionsLists = optionsLists || [];

  const options = optionsLists.map((list) => {
    const values = (list.skuPropertyValues || []).map((val) => {
      return {
        // Handle both old (propertyValueId) and new (propertyValueIdLong) field names
        id: val.propertyValueIdLong || val.propertyValueId,
        name: val.propertyValueName,
        displayName: val.propertyValueDisplayName,
        image: val.skuPropertyImagePath,
      };
    });

    return {
      id: list.skuPropertyId,
      name: list.skuPropertyName,
      values,
    };
  });

  const lists = priceLists.map((list) => {
    const skuVal = list.skuVal || {};
    return {
      skuId: list.skuId,
      optionValueIds: list.skuPropIds,
      availableQuantity: skuVal.availQuantity || 0,
      originalPrice: skuVal.skuAmount || null,
      salePrice: skuVal.skuActivityAmount || null,
    };
  });

  return {
    options: options,
    prices: lists,
  };
};

export { get };
