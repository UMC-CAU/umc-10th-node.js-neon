export interface CreateReviewRequest {
  reviewScore: number;
  content: string;
}

export interface ReviewData {
  userId: number;
  storeId: number;
  reviewScore: number;
  content: string;
}

export interface CreateReviewResponse {
  reviewId: number;
  userId: number;
  storeId: number;
  createdAt: string;
}

export interface ReviewListItem {
  reviewId: number;
  content: string;
  userId: number;
  storeId: number;
  createdAt: string;
  store: any;
  user: any;
}

export interface ReviewListResponse {
  reviews: ReviewListItem[];
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
    userId,
    storeId,
    reviewScore: body.reviewScore,
    content: body.content.trim(),
  };
};
