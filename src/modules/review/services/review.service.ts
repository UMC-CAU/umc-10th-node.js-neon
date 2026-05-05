import { responseFromReview, ReviewData, 
  responseFromReviews, ReviewListResponse,
 } from "../dtos/review.dto.js";
import {
  addReview,
  existsStoreById,
  getReview,
  getAllStoreReviews,
  getAllUserReviews,
} from "../repositories/review.repository.js";

export const createReview = async (data: ReviewData) => {
  const isStoreExists = await existsStoreById(data.store_id);

  if (!isStoreExists) {
    throw new Error("존재하지 않는 가게입니다.");
  }
  const reviewId = await addReview(data);
  const review = await getReview(reviewId);
  return responseFromReview({
    reviewId,
    review: review ?? {
      review_id: reviewId,
      user_id: data.user_id,
      store_id: data.store_id,
      create_at: new Date().toISOString(),
    },
  });
};
export const listStoreReviews = async (
  storeId: number,
  cursor: number
): Promise<ReviewListResponse> => {
  const reviews = await getAllStoreReviews(storeId, cursor);
  return responseFromReviews(reviews);
};

export const listUserReviews = async (
  userId: number,
  cursor: number,
): Promise<ReviewListResponse> => {
  const targetUserId = 1;
  const reviews = await getAllUserReviews(targetUserId, cursor);
  return responseFromReviews(reviews);
};