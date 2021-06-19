const scrape = require('./../index.js');

/** without shipping information */
// const product = scrape('32958933105');

/** with shipping information */
const product = scrape('4000636335103', 10, ['United States', 'France']);


product.then(res => {
  console.log('The JSON: ', res);
});