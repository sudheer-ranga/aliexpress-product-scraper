import { scrapeMany } from "./../index.js";

const inputs = [
  "1005007429636284",
  "https://www.aliexpress.com/item/1005007429636284.html",
];

const result = await scrapeMany(inputs, {
  concurrency: 2,
  retries: 1,
  fastMode: true,
  fields: ["title", "productId", "salePrice"],
  onProgress: ({ completed, total, succeeded, failed }) => {
    console.log(`Progress ${completed}/${total} (ok=${succeeded}, fail=${failed})`);
  },
});

console.log(JSON.stringify(result.summary, null, 2));
console.log(JSON.stringify(result.items, null, 2));
