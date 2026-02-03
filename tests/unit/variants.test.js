import { test } from "node:test";
import assert from "node:assert/strict";
import { get as getVariants } from "../../src/variants.js";

test("getVariants builds options and prices", () => {
  const optionsLists = [
    {
      skuPropertyId: 14,
      skuPropertyName: "Color",
      skuPropertyValues: [
        {
          propertyValueIdLong: 1,
          propertyValueName: "Red",
          propertyValueDisplayName: "Red",
          skuPropertyImagePath: "img.png",
        },
      ],
    },
  ];
  const priceLists = [
    {
      skuId: 100,
      skuPropIds: "14:1",
      skuVal: { availQuantity: 5, skuAmount: { value: 10 }, skuActivityAmount: { value: 8 } },
    },
  ];

  const result = getVariants({ optionsLists, priceLists });

  assert.deepStrictEqual(result.options, [
    {
      id: 14,
      name: "Color",
      values: [
        {
          id: 1,
          name: "Red",
          displayName: "Red",
          image: "img.png",
        },
      ],
    },
  ]);

  assert.deepStrictEqual(result.prices, [
    {
      skuId: 100,
      optionValueIds: "14:1",
      availableQuantity: 5,
      originalPrice: { value: 10 },
      salePrice: { value: 8 },
    },
  ]);
});
