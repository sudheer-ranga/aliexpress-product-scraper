const SUPPORTED_FIELDS = [
  "title",
  "categoryId",
  "productId",
  "quantity",
  "description",
  "orders",
  "storeInfo",
  "ratings",
  "images",
  "reviews",
  "variants",
  "specs",
  "currencyInfo",
  "originalPrice",
  "salePrice",
  "shipping",
];

const normalizeFields = (fields) => {
  if (fields == null) {
    return null;
  }

  if (!Array.isArray(fields)) {
    throw new Error("`fields` must be an array of supported field names");
  }

  const selectedFields = [];
  const seen = new Set();

  for (const field of fields) {
    if (typeof field !== "string" || !field.trim()) {
      throw new Error("`fields` must contain non-empty strings");
    }

    const normalizedField = field.trim();
    if (!SUPPORTED_FIELDS.includes(normalizedField)) {
      throw new Error(
        `Unsupported field "${normalizedField}". Supported fields: ${SUPPORTED_FIELDS.join(", ")}`
      );
    }

    if (!seen.has(normalizedField)) {
      seen.add(normalizedField);
      selectedFields.push(normalizedField);
    }
  }

  return selectedFields;
};

const shouldFetchField = ({ fields, field, fastMode }) => {
  const skipHeavyField = fastMode && (field === "description" || field === "reviews");
  if (skipHeavyField) {
    return false;
  }

  if (!fields) {
    return true;
  }

  return fields.includes(field);
};

const pickFields = (product, fields) => {
  if (!fields) {
    return product;
  }

  return fields.reduce((acc, field) => {
    acc[field] = product[field];
    return acc;
  }, {});
};

export { SUPPORTED_FIELDS, normalizeFields, shouldFetchField, pickFields };
