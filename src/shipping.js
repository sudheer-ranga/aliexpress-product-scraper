const getShippingData = (shippingData) => {
  if (!Array.isArray(shippingData)) {
    return [];
  }

  return shippingData.map((shippingOption) => {
    const bizData = shippingOption?.bizData || {};

    // Handle both old and new API formats
    const {
      // Old format fields
      deliveryProviderName,
      tracking,
      provider,
      company,
      deliveryDayMax,
      deliveryDayMin,
      composeEtaMixDate,
      composeEtaMaxDate,
      shippingFee,
      formattedAmount,
      displayAmount,
      displayCurrency,
      warehouseType,

      // New format fields
      shipFrom,
      shipFromCode,
      shipTo,
      shipToCode,
      freightCommitDay,
      unreachable,
      itemScene,
    } = bizData;

    const hasShippingFee = shippingFee === "charge";

    const parsedFreightCommitDay = Number(freightCommitDay);
    const validFreightCommitDay = Number.isFinite(parsedFreightCommitDay)
      ? parsedFreightCommitDay
      : null;

    const returnData = {
      deliveryProviderName: deliveryProviderName || itemScene || null,
      tracking: tracking || null,
      provider: provider || null,
      company: company || null,

      deliveryInfo: {
        min: deliveryDayMin ?? validFreightCommitDay,
        max: deliveryDayMax ?? validFreightCommitDay,
        displayMin: composeEtaMixDate || null,
        displayMax: composeEtaMaxDate || null,
      },

      shippingInfo: {
        from: shipFrom || null,
        fromCode: shipFromCode || null,
        to: shipTo || null,
        toCode: shipToCode || null,
        fees: hasShippingFee ? formattedAmount : 0,
        unreachable: unreachable || false,
      },

      warehouseType: warehouseType || null,
    };

    if (hasShippingFee) {
      returnData.shippingInfo.displayAmount = displayAmount;
      returnData.shippingInfo.displayCurrency = displayCurrency;
    }

    return returnData;
  });
};

export { getShippingData as get };
