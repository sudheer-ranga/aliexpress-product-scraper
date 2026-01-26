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

const get = async ({ productId, total, limit, filterReviewsBy = "all" }) => {
  let allReviews = [];
  const COUNT_PER_PAGE = 20;

  // if reviews limit requested is less than total reviews, then limit it to total reviews
  let count = limit;
  if (limit >= total) {
    count = total;
  }

  let totalPages = Math.ceil(count / COUNT_PER_PAGE);
  if (totalPages >= 5) {
    totalPages = 5;
  }

  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const reviewUrl = `https://feedback.aliexpress.com/pc/searchEvaluation.do?productId=${productId}&page=${currentPage}&pageSize=${COUNT_PER_PAGE}&filter=${filterReviewsBy}`;
    
    try {
      const review = await fetch(reviewUrl);
      
      if (!review.ok) {
        console.warn(
          `Failed to fetch reviews page ${currentPage} for product ${productId}: ` +
          `HTTP ${review.status} ${review.statusText}`
        );
        break; // Stop fetching if we get an error
      }
      
      const reviewJson = await review.json();

      const reviews = reviewJson?.data?.evaViewList || [];

      if (!reviews || reviews.length === 0) {
        // No more reviews available
        break;
      }

      reviews.forEach((_review) => {
        const data = getReview(_review);
        allReviews.push(data);
      });
    } catch (error) {
      console.warn(
        `Error fetching reviews page ${currentPage} for product ${productId}:`,
        error.message
      );
      // Continue to next page or break if it's a critical error
      if (currentPage === 1) {
        // If first page fails, it's likely a critical issue
        throw new Error(
          `Failed to fetch reviews for product ${productId}: ${error.message}`
        );
      }
      break;
    }
  }

  return allReviews;
};

export { get };
