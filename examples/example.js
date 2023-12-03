import scrape from "./../src/aliexpressProductScraper.js";

scrape({
  productId: "1005005167379524",
  reviewsCount: 10,
  rating: 2,
})
  .then((productData) => {
    console.log(productData);
  })
  .catch((error) => {
    console.error(error);
  });
