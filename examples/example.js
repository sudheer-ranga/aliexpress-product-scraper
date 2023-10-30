const scrape = require("./../index.js");
const product = scrape("2255800692211273");

product.then((res) => {
  console.log("The JSON: ", res);
});
