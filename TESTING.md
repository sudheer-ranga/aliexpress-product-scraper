# Testing & Validation Guide

This guide helps you verify that the AliExpress product scraper is working correctly after the upgrade.

## Prerequisites

1. **Node.js Version**: Ensure you're using Node.js >= 22.0.0
   ```bash
   node --version  # Should show v22.x.x or higher
   ```

2. **Dependencies**: Install all dependencies
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Puppeteer**: Puppeteer will download Chromium automatically. If you encounter issues:
   - Set `PUPPETEER_SKIP_DOWNLOAD=1` if you want to use a system Chrome
   - Set `PUPPETEER_EXECUTABLE_PATH=/path/to/chrome` to use a specific Chrome

## Quick Syntax Check

Verify all files have valid syntax:
```bash
node --check src/aliexpressProductScraper.js
node --check src/reviews.js
node --check src/variants.js
node --check src/shipping.js
node --check index.js
```

## Manual Testing Options

### Option 1: Run the Example Script

Test with the example script:
```bash
node examples/example.js
```

This will scrape product ID `1005005167379524` with 20 reviews filtered by rating 2.

### Option 2: Run the Smoke Test

The smoke test is more comprehensive and validates the response structure:
```bash
ALIX_SMOKE=1 npm run smoke
```

You can customize the smoke test:
```bash
# Test with a different product
ALIX_SMOKE=1 ALIX_PRODUCT_ID=1005001234567890 npm run smoke

# Test with different review settings
ALIX_SMOKE=1 REVIEWS_COUNT=10 FILTER_REVIEWS_BY=5 npm run smoke
```

### Option 3: Quick Integration Test

Create a simple test file:
```javascript
import scrape from './index.js';

const productId = '1005005167379524';

try {
  console.log(`Testing scraper with product ID: ${productId}`);
  const result = await scrape(productId, {
    reviewsCount: 5,
    filterReviewsBy: 'all',
  });
  
  console.log('✅ Scraper works!');
  console.log(`Product: ${result.title}`);
  console.log(`Product ID: ${result.productId}`);
  console.log(`Images: ${result.images.length}`);
  console.log(`Reviews: ${result.reviews.length}`);
  console.log(`Variants: ${result.variants.options.length} options`);
} catch (error) {
  console.error('❌ Scraper failed:', error.message);
  process.exit(1);
}
```

## What to Check

When testing, verify:

1. **Basic Data Extraction**:
   - ✅ Product title is present
   - ✅ Product ID matches input
   - ✅ At least one image is returned
   - ✅ Description is extracted

2. **Reviews**:
   - ✅ Reviews are fetched (may be empty for new products)
   - ✅ Review structure is correct (name, rating, content, etc.)
   - ✅ Filtering by rating works (if tested)

3. **Variants**:
   - ✅ Variant options are extracted
   - ✅ Prices are present
   - ✅ SKU information is available

4. **Shipping**:
   - ✅ Shipping options are returned (may be empty)

5. **Error Handling**:
   - ✅ Invalid product IDs show clear error messages
   - ✅ Network errors are handled gracefully

## Common Issues & Solutions

### Issue: "Failed to extract runParams"
- **Cause**: AliExpress page structure changed or page didn't load
- **Solution**: 
  - Verify the product ID is valid
  - Check if you're being blocked (try with headless: false to see)
  - Increase timeout in puppeteerOptions

### Issue: "No data found"
- **Cause**: runParams.data is missing
- **Solution**: Product may be unavailable or page structure changed

### Issue: Puppeteer Chromium download fails
- **Cause**: Network issues or firewall
- **Solution**: 
  - Use `PUPPETEER_SKIP_DOWNLOAD=1` and set `PUPPETEER_EXECUTABLE_PATH`
  - Or download Chromium manually

### Issue: Reviews fetch fails
- **Cause**: API endpoint changed or rate limiting
- **Solution**: Check network connectivity, may need to add delays

## Performance Notes

- First run may be slow due to Chromium download
- Scraping takes 10-30 seconds depending on network
- Reviews fetching adds additional time (1-5 seconds per page)

## Continuous Validation

For ongoing validation, consider:
1. Running smoke tests periodically
2. Monitoring for error patterns
3. Testing with different product IDs
4. Checking for AliExpress page structure changes
