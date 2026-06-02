import {
  CreateReviewResponse,
  ReviewData,
  ReviewListResponse,
  ReviewListItem,
} from "../dtos/review.dto.js";
import {
  addReview,
  existsStoreById,
  getReview,
  getAllStoreReviews,
  getAllUserReviews,
} from "../repositories/review.repository.js";
import { StoreNotFoundError } from "../../../common/errors/error.js";

export const createReview = async (data: ReviewData): Promise<CreateReviewResponse> => {
  const isStoreExists = await existsStoreById(data.storeId);

  if (!isStoreExists) {
    throw new StoreNotFoundError("존재하지 않는 가게입니다.", { storeId: data.storeId });
  }

  const reviewId = await addReview(data);
  const review = await getReview(reviewId);

  return {
    reviewId,
    userId: review?.userId ?? data.userId,
    storeId: review?.storeId ?? data.storeId,
    createdAt: review?.createdAt ?? new Date().toISOString(),
  };
};

export const listStoreReviews = async (
  storeId: number,
  cursor: number,
): Promise<ReviewListResponse> => {
  const reviews = await getAllStoreReviews(storeId, cursor);
  const last = reviews[reviews.length - 1];

  const items: ReviewListItem[] = reviews.map((r: any) => ({
    reviewId: r.reviewId,
    content: r.content,
    userId: r.userId,
    storeId: r.storeId,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
    store: r.store,
    user: r.user,
  }));

  return {
    reviews: items,
    pagination: { cursor: last ? last.reviewId : null },
  };
};

export const listUserReviews = async (
  userId: number,
  cursor: number,
): Promise<ReviewListResponse> => {
  const reviews = await getAllUserReviews(userId, cursor);
  const last = reviews[reviews.length - 1];

  const items: ReviewListItem[] = reviews.map((r: any) => ({
    reviewId: r.reviewId,
    content: r.content,
    userId: r.userId,
    storeId: r.storeId,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
    store: r.store,
    user: r.user,
  }));

  return {
    reviews: items,
    pagination: { cursor: last ? last.reviewId : null },
  };
};