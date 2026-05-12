export interface CreateReviewRequest {
  review_score: number;
  content: string;
}

export interface ReviewData {
  user_id: number;
  store_id: number;
  review_score: number;
  content: string;
}

export interface CreateReviewResponse {
  review_id: number;
  user_id: number;
  store_id: number;
  create_at: string;
}

export interface ReviewListResponse {
  reviews:
     {
        review_id: number;
        content: string;
        user_id: number;
        store_id: number;
        create_at: string;
        store: any;
        user: any;
      }[],
  pagination: {
    cursor: number | null;
  };
}

export const bodyToReview = (
  userId: number,
  storeId: number,
  body: CreateReviewRequest,
): ReviewData => {
  return {
    user_id: userId,
    store_id: storeId,
    review_score: body.review_score,
    content: body.content.trim(),
  };
};

export const responseFromReview = (data: {
  reviewId: number;
  review: any;
}): CreateReviewResponse => {
  const createAt =
    data.review.create_at instanceof Date
      ? data.review.create_at.toISOString()
      : String(data.review.create_at);

  return {
    review_id: data.review.review_id ?? data.reviewId,
    user_id: data.review.user_id,
    store_id: data.review.store_id,
    create_at: createAt,
  };
};


export const responseFromReviews = (reviews: any[]): ReviewListResponse => {
  const lastReview = reviews[reviews.length - 1];
  return {
      reviews,
      pagination: {
        cursor: lastReview ? lastReview.id : null,
      },
    };
};
