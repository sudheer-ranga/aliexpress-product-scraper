/**
 * Debug test script to diagnose scraping issues.
 * Run with: node scripts/debug-test.js
 * 
 * Note: AliExpress now uses CSR (Client-Side Rendering).
 * Data is loaded via API, not embedded in window.runParams.
 * The main scraper intercepts the API response to get product data.
 */
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

// Default to a known working product (Wireless Keyboard - verified Jan 2025)
const productId = process.env.ALIX_PRODUCT_ID || "1005007429636284";
const headless = process.env.HEADLESS !== "false";

console.log("=== AliExpress Scraper Debug Test ===");
console.log(`Product ID: ${productId}`);
console.log(`Headless: ${headless}`);
console.log(`Node version: ${process.version}`);
console.log("");

/**
 * Parse JSONP response to extract JSON data
 */
const parseJsonp = (jsonpStr) => {
  const trimmed = jsonpStr.trim();
  const match = trimmed.match(/^[a-zA-Z0-9_]+\(([\s\S]+)\)$/);
  if (match && match[1]) {
    return JSON.parse(match[1]);
  }
  return JSON.parse(trimmed);
};

async function debugTest() {
  let browser;
  
  try {
    console.log("1. Launching browser...");
    browser = await puppeteer.launch({
      headless: headless,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
      ],
    });
    console.log("   ✅ Browser launched");

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    console.log("   ✅ Page created with stealth mode");

    // Set up API response interception (this is how the main scraper works)
    let apiData = null;
    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('mtop.aliexpress') && url.includes('pdp')) {
        try {
          const text = await response.text();
          if (text && text.length > 1000) {
            const parsed = parseJsonp(text);
            if (parsed?.data?.result) {
              apiData = parsed;
              console.log(`   ✅ API response captured (${text.length} bytes)`);
            }
          }
        } catch {
          // Ignore parsing errors
        }
      }
    });

    const url = `https://www.aliexpress.com/item/${productId}.html`;
    console.log(`2. Navigating to: ${url}`);
    
    const startTime = Date.now();
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });
    const loadTime = Date.now() - startTime;
    console.log(`   ✅ Page loaded in ${loadTime}ms`);

    // Wait for API data
    console.log("3. Waiting for API data...");
    const maxWait = 10000;
    const waitStart = Date.now();
    while (!apiData && (Date.now() - waitStart) < maxWait) {
      await new Promise(r => setTimeout(r, 500));
    }

    if (apiData) {
      const result = apiData.data.result;
      const globalData = result.GLOBAL_DATA?.globalData || {};
      
      console.log("4. ✅ Product data extracted successfully!");
      console.log(`   Title: ${result.PRODUCT_TITLE?.text || globalData.subject}`);
      console.log(`   Product ID: ${globalData.productId}`);
      console.log(`   Images: ${result.HEADER_IMAGE_PC?.imagePathList?.length || 0}`);
      console.log(`   Rating: ${result.PC_RATING?.rating || 'N/A'}`);
      console.log(`   Store: ${globalData.storeName}`);
      
      console.log("\n🎉 SUCCESS! The scraper should work with this product.");
    } else {
      console.log("4. ❌ API data not captured");
      console.log("   This may indicate:");
      console.log("   - Network issues");
      console.log("   - AliExpress blocking automated access");
      console.log("   - Rate limiting");
      
      // Check page state
      const pageTitle = await page.title();
      console.log(`\n   Page title: "${pageTitle}"`);
      
      const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 200));
      console.log(`   Body preview: ${bodyText.replace(/\n/g, ' ')}...`);
    }

    // Take screenshot
    await page.screenshot({ path: "./debug-screenshot.png", fullPage: false });
    console.log("\n📸 Screenshot saved to: ./debug-screenshot.png");

    await browser.close();
    console.log("✅ Browser closed");
    
    return !!apiData;
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    if (browser) {
      await browser.close();
    }
    return false;
  }
}

const success = await debugTest();
process.exit(success ? 0 : 1);
