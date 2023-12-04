const getShippingData = (shippingData) => {
  const shippingOptions = shippingData?.map((shippingOption) => {
    const {
      deliveryProviderName,
      tracking,
      provider,
      company,
      shipFrom,
      shipFromCode,
      shipTo,
      shipToCode,
      deliveryDayMax,
      deliveryDayMin,
      composeEtaMixDate,
      composeEtaMaxDate,
      shippingFee,
      formattedAmount,
      displayAmount,
      displayCurrency,
      warehouseType,
    } = shippingOption?.bizData || {};

    const hasShippingFee = shippingFee === "charge";

    const returnData = {
      deliveryProviderName,
      tracking,
      provider,
      company,
      deliveryInfo: {
        min: deliveryDayMin,
        max: deliveryDayMax,
        displayMin: composeEtaMixDate,
        displayMan: composeEtaMaxDate,
      },
      shippingInfo: {
        from: shipFrom,
        fromCode: shipFromCode,
        to: shipTo,
        toCode: shipToCode,
        fees: hasShippingFee ? formattedAmount : 0,
      },
      warehouseType,
    };

    if (hasShippingFee) {
      returnData.shippingInfo.displayAmount = displayAmount;
      returnData.shippingInfo.displayCurrency = displayCurrency;
    }

    return returnData;
  });

  return shippingOptions;
};

export { getShippingData as get };
