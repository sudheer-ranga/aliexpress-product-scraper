import { test } from "node:test";
import assert from "node:assert/strict";
import { get as getShipping } from "../../src/shipping.js";

test("getShipping maps free shipping option", () => {
  const input = [
    {
      bizData: {
        deliveryProviderName: "UPS",
        tracking: "Y",
        provider: "UPS",
        company: "UPS",
        deliveryDayMax: 10,
        deliveryDayMin: 5,
        composeEtaMixDate: "2026-02-10",
        composeEtaMaxDate: "2026-02-15",
        shippingFee: "free",
        formattedAmount: "$0.00",
        displayAmount: "$0.00",
        displayCurrency: "USD",
        warehouseType: "CN",
      },
    },
  ];

  const result = getShipping(input);

  assert.deepStrictEqual(result, [
    {
      deliveryProviderName: "UPS",
      tracking: "Y",
      provider: "UPS",
      company: "UPS",
      deliveryInfo: {
        min: 5,
        max: 10,
        displayMin: "2026-02-10",
        displayMax: "2026-02-15",
      },
      shippingInfo: {
        from: null,
        fromCode: null,
        to: null,
        toCode: null,
        fees: 0,
        unreachable: false,
      },
      warehouseType: "CN",
    },
  ]);
});

test("getShipping maps paid shipping with display amounts", () => {
  const input = [
    {
      bizData: {
        deliveryProviderName: "DHL",
        shippingFee: "charge",
        formattedAmount: "$5.00",
        displayAmount: "$5.00",
        displayCurrency: "USD",
      },
    },
  ];

  const result = getShipping(input);
  assert.equal(result[0].shippingInfo.fees, "$5.00");
  assert.equal(result[0].shippingInfo.displayAmount, "$5.00");
  assert.equal(result[0].shippingInfo.displayCurrency, "USD");
});
