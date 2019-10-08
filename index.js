const fs = require('fs');
const productId = 32958933105;
const AliProductScraper = require('./src/aliProduct');
const product = AliProductScraper(productId);

product.then(res => {
  console.log('The JSON: ', res);

  fs.writeFile(`${productId}.json`, JSON.stringify(res), function(err) {
    if (err) throw err;
    console.log(`JSON reponse saved to ${productId}.json file!`);
  });
});
