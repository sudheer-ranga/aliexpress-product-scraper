module.exports = {
  getShippingData: function (data) {
    const shippingOptions = data?.originalLayoutResultList?.map(
      (shippingOption) => {
        const {
          deliveryProviderName,
          tracking,
          provider,
          company,
          shipFrom,
          deliveryDayMax,
          deliveryDayMin,
          displayAmount,
          formattedAmount,
        } = shippingOption?.bizData;

        return {
          deliveryProviderName,
          tracking,
          provider,
          company,
          shipFrom,
          deliveryDayMax,
          deliveryDayMin,
          displayAmount,
          formattedAmount,
        };
      }
    );

    return shippingOptions;
  },
};
