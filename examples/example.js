import scrape from "./../index.js";

scrape("1005005167379524", {
  reviewsCount: 20,
  rating: 2,
})
  .then((productData) => {
    console.log(JSON.stringify(productData, null, 2));
  })
  .catch((error) => {
    console.error(error);
  });
