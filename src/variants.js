const get = ({ priceLists = [], optionsLists = [] }) => {
  priceLists = priceLists || [];
  optionsLists = optionsLists || [];

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
      originalPrice: list.skuVal.skuAmount,
      salePrice: list.skuVal.skuActivityAmount,
    };
  });

  // console.log({ options, lists });

  return {
    options: options,
    prices: lists,
  };
};

export { get };
