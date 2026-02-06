import scrape from "./../index.js";

// Using a known working product ID (Wireless Keyboard - verified Jan 2025)
scrape("https://www.aliexpress.com/item/1005007429636284.html", {
  reviewsCount: 20,
  filterReviewsBy: 2,
  fields: ["title", "productId", "salePrice", "shipping", "ratings"],
})
  .then((productData) => {
    console.log(JSON.stringify(productData, null, 2));
  })
  .catch((error) => {
    console.error(error);
  });
