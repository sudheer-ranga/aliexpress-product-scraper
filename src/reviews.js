import fetch from "node-fetch";
import { faker } from "@faker-js/faker";

const getReview = (review) => {
  const gender = review.buyerGender === "M" ? "male" : "female";
  const displayName = faker.person.fullName({
    sex: gender,
  });

  const data = {
    anonymous: review.anonymous,
    name: review.buyerName || displayName,
    displayName,
    gender,
    country: review.buyerCountry || faker.location.countryCode("alpha-2"),
    rating: review?.buyerEval ? review.buyerEval / 20 : 5,
    info: review.skuInfo,
    date: review.evalDate,
    content: review.buyerFeedback,
    photos: review.images || [],
    thumbnails: review.thumbnails || [],
  };

  return data;
};

const get = async ({ productId, count, rating = "all" }) => {
  let allReviews = [];
  const COUNT_PER_PAGE = 20;
  let totalPages = Math.ceil(count / COUNT_PER_PAGE);

  /** If totalPages are greater than 10, i.e. if reviews are > 100, limit it to 100 or 10 pages */
  if (totalPages >= 5) {
    totalPages = 5;
  }

  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const reviewUrl = `https://feedback.aliexpress.com/pc/searchEvaluation.do?productId=${productId}&page=${currentPage}&pageSize=${COUNT_PER_PAGE}&filter=${rating}`;
    const review = await fetch(reviewUrl);
    const reviewJson = await review.json();

    const reviews = reviewJson?.data?.evaViewList || [];

    if (!reviews) {
      return allReviews;
    }

    reviews.forEach((_review) => {
      const data = getReview(_review);
      allReviews.push(data);
    });
  }

  return allReviews;
};

export { get };
