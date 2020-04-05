const scrape = require('./../index.js');
const product = scrape('32958933105');

product.then(res => {
  console.log('The JSON: ', res);
});