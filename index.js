const fs = require('fs');
const productId = 32958933105;
const scrape = require('./src/aliexpressProductScraper');
const product = scrape(productId);

product.then(res => {
  console.log('The JSON: ', res);

  fs.writeFile(`${productId}.json`, JSON.stringify(res), function(err) {
    if (err) throw err;
    console.log(`JSON reponse saved to ${productId}.json file!`);
  });
});
