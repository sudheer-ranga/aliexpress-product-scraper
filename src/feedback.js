const fetch = require('node-fetch');
const cheerio = require('cheerio');
const faker = require('faker');

const getFeedbackData = feedbackHtml => {
  const $ = cheerio.load(feedbackHtml);
  const feedbackData = [];

  $('.feedback-list-wrap .feedback-item').each((index, element) => {
    const $elm = $(element);
    let name = $elm
      .find('.user-name')
      .text()
      .trim();

    let country = $elm
      .find('.user-country')
      .text()
      .trim();

    let ratingStyle = $elm.find('.star-view > span').attr('style');

    let rating = ratingStyle.split('width:')[1];
    rating = parseInt(rating) / 20;

    let info = {};

    $elm.find('.user-order-info > span').each((index, infoKey) => {
      const key = $(infoKey)
        .find('strong')
        .text()
        .trim();

      $(infoKey)
        .find('strong')
        .remove();

      info[key] = $(infoKey)
        .text()
        .trim();
    });

    const feedbackContent = $elm
      .find('.buyer-feedback span:first-child')
      .text()
      .trim();

    let feedbackTime = $elm
      .find('.buyer-feedback span:last-child')
      .text()
      .trim();

    feedbackTime = new Date(feedbackTime);

    let photos = [];

    $elm.find('.r-photo-list > ul > li').each((index, photo) => {
      const url = $(photo)
        .find('img')
        .attr('src');
      photos.push(url);
    });

    const data = {
      name: name,
      displayName: faker.name.findName(),
      country: country,
      rating: rating,
      info: info,
      date: feedbackTime,
      content: feedbackContent,
      photos: photos
    };

    feedbackData.push(data);
  });

  return feedbackData;
};

module.exports = {
  get: async function(productId, ownerMemberId, count, limit) {
    let allFeedbacks = [];
    let totalPages = Math.ceil(count / limit);

    /** If totalPages are greater than 10, i.e. if reviews are > 100, limit it to 100 or 10 pages */
    if (totalPages > 10) {
      totalPages = 10;
    }

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      const feedbackUrl = `https://feedback.aliexpress.com/display/productEvaluation.htm?v=2&page=${currentPage}&currentPage=${currentPage}&productId=${productId}&ownerMemberId=${ownerMemberId}`;
      const feedbackResponse = await fetch(feedbackUrl);
      const feedbackHtml = await feedbackResponse.text();

      const data = getFeedbackData(feedbackHtml);
      allFeedbacks = [...allFeedbacks, ...data];
    }

    return allFeedbacks;
  }
};
