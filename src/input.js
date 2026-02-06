const PRODUCT_ID_ONLY_REGEX = /^\d+$/;
const PRODUCT_URL_PATTERNS = [
  /\/item\/(\d+)(?:\.html|\/)?/i,
  /\/i\/(\d+)\.html/i,
  /[?&]productId=(\d+)/i,
];

const INVALID_INPUT_ERROR =
  "Please provide a valid product id or AliExpress product URL";

const isValidProductId = (value) =>
  PRODUCT_ID_ONLY_REGEX.test(value) && !/^0+$/.test(value);

const normalizeProductId = (input) => {
  if (typeof input === "number" && Number.isFinite(input)) {
    if (!Number.isSafeInteger(input) || input <= 0) {
      throw new Error(INVALID_INPUT_ERROR);
    }

    return String(input);
  }

  if (typeof input !== "string") {
    throw new Error(INVALID_INPUT_ERROR);
  }

  const trimmedInput = input.trim();
  if (!trimmedInput) {
    throw new Error(INVALID_INPUT_ERROR);
  }

  if (isValidProductId(trimmedInput)) {
    return trimmedInput;
  }

  for (const pattern of PRODUCT_URL_PATTERNS) {
    const match = trimmedInput.match(pattern);
    if (match?.[1] && isValidProductId(match[1])) {
      return match[1];
    }
  }

  throw new Error(INVALID_INPUT_ERROR);
};

export { normalizeProductId };
