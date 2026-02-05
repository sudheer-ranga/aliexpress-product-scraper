const PRODUCT_ID_ONLY_REGEX = /^\d+$/;
const PRODUCT_URL_PATTERNS = [
  /\/item\/(\d+)(?:\.html|\/)?/i,
  /\/i\/(\d+)\.html/i,
  /[?&]productId=(\d+)/i,
];

const normalizeProductId = (input) => {
  if (typeof input === "number" && Number.isFinite(input)) {
    return String(Math.trunc(input));
  }

  if (typeof input !== "string") {
    throw new Error("Please provide a valid product id or AliExpress product URL");
  }

  const trimmedInput = input.trim();
  if (!trimmedInput) {
    throw new Error("Please provide a valid product id or AliExpress product URL");
  }

  if (PRODUCT_ID_ONLY_REGEX.test(trimmedInput)) {
    return trimmedInput;
  }

  for (const pattern of PRODUCT_URL_PATTERNS) {
    const match = trimmedInput.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  throw new Error("Please provide a valid product id or AliExpress product URL");
};

export { normalizeProductId };
