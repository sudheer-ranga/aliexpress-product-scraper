import scrape from "./../index.js";

// Using a known working product ID (Wireless Keyboard - verified Jan 2025)
scrape("1005007429636284", {
  reviewsCount: 20,
  filterReviewsBy: 2,
})
  .then((productData) => {
    console.log(JSON.stringify(productData, null, 2));
  })
  .catch((error) => {
    console.error(error);
  });
