import { prisma } from "../../../db.config.js";
import { ReviewData } from "../dtos/review.dto.js";

const toBigInt = (value: number) => BigInt(value);
const toNumber = (value: bigint) => Number(value);

export const existsStoreById = async (store_id: number): Promise<boolean> => {
  const store = await prisma.store.findUnique({
    where: { id: toBigInt(store_id) },
    select: { id: true },
  });

  return store !== null;
};

export const addReview = async (data: ReviewData): Promise<number> => {
  const review = await prisma.review.create({
    data: {
      userId: toBigInt(data.user_id),
      storeId: toBigInt(data.store_id),
      reviewScore: data.review_score,
      description: data.content,
    },
    select: { id: true },
  });

  return toNumber(review.id);
};

export const getReview = async (reviewId: number): Promise<any | null> => {
  const review = await prisma.review.findUnique({
    where: { id: toBigInt(reviewId) },
    select: {
      id: true,
      userId: true,
      storeId: true,
      createdAt: true,
    },
  });

  if (!review) {
    return null;
  }

  return {
    review_id: toNumber(review.id),
    user_id: toNumber(review.userId),
    store_id: toNumber(review.storeId),
    create_at: review.createdAt,
  };
};

export const getAllStoreReviews = async (
  storeId: number,
  cursor: number,
) => {
  const reviews = await prisma.review.findMany({
    where: {
      storeId: toBigInt(storeId),
      id: {
        gt: toBigInt(cursor),
      },
    },
    orderBy: {
      id: "asc",
    },
    take: 5,
    select: {
      id: true,
      description: true,
      reviewScore: true,
      userId: true,
      storeId: true,
      createdAt: true,
      store: {
        select: {
          id: true,
          categoryId: true,
          areaId: true,
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return reviews.map((review) => ({
    id: toNumber(review.id),
    review_id: toNumber(review.id),
    content: review.description,
    review_score: review.reviewScore,
    user_id: toNumber(review.userId),
    store_id: toNumber(review.storeId),
    create_at: review.createdAt,
    store: {
      ...review.store,
      id: toNumber(review.store.id),
      category_id: toNumber(review.store.categoryId),
      area_id: toNumber(review.store.areaId),
    },
    user: {
      ...review.user,
      id: toNumber(review.user.id),
    },
  }));
};