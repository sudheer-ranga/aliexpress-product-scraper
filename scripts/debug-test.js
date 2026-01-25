/**
 * Debug test script to diagnose scraping issues.
 * Run with: node scripts/debug-test.js
 */
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

// Use stealth plugin to avoid bot detection
puppeteer.use(StealthPlugin());

// Try multiple product IDs - some may be unavailable
const productId = process.env.ALIX_PRODUCT_ID || "1005007294905498";
const headless = process.env.HEADLESS !== "false"; // Default to headless, set HEADLESS=false to see browser

console.log("=== AliExpress Scraper Debug Test ===");
console.log(`Product ID: ${productId}`);
console.log(`Headless: ${headless}`);
console.log(`Node version: ${process.version}`);
console.log("");

async function debugTest() {
  let browser;
  
  try {
    console.log("1. Launching browser...");
    browser = await puppeteer.launch({
      headless: headless,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--window-size=1920,1080",
        "--disable-blink-features=AutomationControlled",
      ],
    });
    console.log("   ✅ Browser launched");

    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Set a user agent to avoid bot detection
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    
    // Remove webdriver detection
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", {
        get: () => undefined,
      });
    });
    
    // Set extra headers
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    });
    
    console.log("   ✅ Page created with anti-detection measures");

    const url = `https://www.aliexpress.com/item/${productId}.html`;
    console.log(`2. Navigating to: ${url}`);
    
    const startTime = Date.now();
    
    try {
      // Try with networkidle2 (allows 2 connections) - better for dynamic pages
      await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      const loadTime = Date.now() - startTime;
      console.log(`   ✅ Page loaded in ${loadTime}ms`);
    } catch (navError) {
      console.log(`   ⚠️ Initial navigation: ${navError.message}`);
      console.log(`   Continuing anyway to check page state...`);
    }

    // Wait longer for JavaScript to execute and populate runParams
    console.log("3. Waiting for JavaScript to execute (5 seconds)...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    
    // Also try waiting for runParams specifically
    console.log("   Checking for runParams.data periodically...");
    for (let i = 0; i < 10; i++) {
      const hasData = await page.evaluate(() => !!window.runParams?.data);
      if (hasData) {
        console.log(`   ✅ runParams.data found after ${i + 1} checks`);
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (i === 9) {
        console.log(`   ⚠️ runParams.data still not found after 10 checks`);
      }
    }

    // Check for runParams
    console.log("4. Checking for runParams...");
    const runParamsCheck = await page.evaluate(() => {
      return {
        hasRunParams: typeof window.runParams !== "undefined",
        hasData: typeof window.runParams?.data !== "undefined",
        keys: window.runParams ? Object.keys(window.runParams) : [],
        dataKeys: window.runParams?.data ? Object.keys(window.runParams.data) : [],
      };
    });
    
    console.log(`   runParams exists: ${runParamsCheck.hasRunParams}`);
    console.log(`   runParams.data exists: ${runParamsCheck.hasData}`);
    
    if (runParamsCheck.hasRunParams) {
      console.log(`   runParams keys: ${runParamsCheck.keys.join(", ")}`);
    }
    if (runParamsCheck.hasData) {
      console.log(`   runParams.data keys: ${runParamsCheck.dataKeys.slice(0, 10).join(", ")}...`);
    }

    // Get page title to verify we're on the right page
    const pageTitle = await page.title();
    console.log(`5. Page title: "${pageTitle}"`);

    // Check for any error messages on the page
    const pageContent = await page.evaluate(() => {
      // Check for common error indicators
      const body = document.body.innerText.toLowerCase();
      const html = document.documentElement.outerHTML;
      return {
        hasError: body.includes("error") || body.includes("not found") || body.includes("404"),
        hasCaptcha: body.includes("captcha") || body.includes("verify"),
        hasProduct: body.includes("add to cart") || body.includes("buy now"),
        bodyLength: body.length,
        bodyPreview: document.body.innerText.substring(0, 500),
        htmlPreview: html.substring(0, 1000),
        scripts: Array.from(document.scripts).map(s => s.src || "(inline)").slice(0, 5),
      };
    });
    
    console.log(`6. Page analysis:`);
    console.log(`   Has error text: ${pageContent.hasError}`);
    console.log(`   Has CAPTCHA: ${pageContent.hasCaptcha}`);
    console.log(`   Has product elements: ${pageContent.hasProduct}`);
    console.log(`   Body text length: ${pageContent.bodyLength} chars`);
    console.log(`   Body preview: ${pageContent.bodyPreview.replace(/\n/g, " ").substring(0, 200)}...`);
    console.log(`   Scripts loaded: ${pageContent.scripts.length}`);
    if (pageContent.scripts.length > 0) {
      pageContent.scripts.forEach(s => console.log(`     - ${s}`));
    }

    // If runParams exists, try to extract some data
    if (runParamsCheck.hasData) {
      console.log("\n7. Extracting sample data...");
      const sampleData = await page.evaluate(() => {
        const data = window.runParams?.data;
        if (!data) return null;
        
        return {
          title: data.productInfoComponent?.subject,
          productId: data.productInfoComponent?.id,
          hasImages: !!data.imageComponent?.imagePathList?.length,
          imageCount: data.imageComponent?.imagePathList?.length || 0,
          hasVariants: !!data.skuComponent?.productSKUPropertyList?.length,
          hasPrice: !!data.priceComponent,
          hasFeedback: !!data.feedbackComponent,
        };
      });
      
      if (sampleData) {
        console.log(`   ✅ Product title: ${sampleData.title}`);
        console.log(`   ✅ Product ID: ${sampleData.productId}`);
        console.log(`   ✅ Images: ${sampleData.imageCount}`);
        console.log(`   ✅ Has variants: ${sampleData.hasVariants}`);
        console.log(`   ✅ Has price: ${sampleData.hasPrice}`);
        console.log(`   ✅ Has feedback: ${sampleData.hasFeedback}`);
        console.log("\n🎉 SUCCESS! The scraper should work with this product.");
      }
    } else {
      console.log("\n❌ Could not find runParams.data");
      console.log("   This could mean:");
      console.log("   - The product doesn't exist");
      console.log("   - AliExpress is blocking automated access");
      console.log("   - The page structure has changed");
      console.log("\n   Try running with HEADLESS=false to see the browser:");
      console.log("   HEADLESS=false node scripts/debug-test.js");
    }

    // Take a screenshot for debugging
    const screenshotPath = "./debug-screenshot.png";
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`\n📸 Screenshot saved to: ${screenshotPath}`);

    await browser.close();
    console.log("\n✅ Browser closed");
    
    // Return success/failure
    return runParamsCheck.hasData;
    
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
