/**
 * Parses a product ID or AliExpress product URL and returns the numeric product ID as a string.
 *
 * Accepts:
 *  - A numeric string or number (returned as-is, as a string)
 *  - A full AliExpress URL containing /item/<id>.html
 *    Supported hosts: aliexpress.com, aliexpress.us, m.aliexpress.com
 *
 * Throws a descriptive error for unrecognized inputs.
 */
const parseProductId = (input) => {
  if (input === null || input === undefined || input === "") {
    throw new Error("Please provide a valid product ID or AliExpress URL");
  }

  const str = String(input).trim();

  // If the input is purely numeric, return it directly as a string
  if (/^\d+$/.test(str)) {
    return str;
  }

  // Try to extract the product ID from an AliExpress URL
  // Matches paths like /item/1005006543210.html (with optional query params / hash)
  const match = str.match(/\/item\/(\d+)\.html/);
  if (match) {
    return match[1];
  }

  throw new Error(
    `Unrecognized product input: "${str}". ` +
    "Please provide a numeric product ID or a valid AliExpress product URL " +
    "(e.g. https://www.aliexpress.com/item/1005006543210.html)"
  );
};

export { parseProductId };
