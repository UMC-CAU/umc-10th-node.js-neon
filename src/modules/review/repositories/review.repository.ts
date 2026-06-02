import { prisma } from "../../../db.config.js";
import { ReviewData } from "../dtos/review.dto.js";

const toBigInt = (value: number) => BigInt(value);
const toNumber = (value: bigint) => Number(value);

export const existsStoreById = async (storeId: number): Promise<boolean> => {
  const store = await prisma.store.findUnique({
    where: { id: toBigInt(storeId) },
    select: { id: true },
  });

  return store !== null;
};

export const addReview = async (data: ReviewData): Promise<number> => {
  const review = await prisma.review.create({
    data: {
      userId: toBigInt(data.userId),
      storeId: toBigInt(data.storeId),
      reviewScore: data.reviewScore,
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
    reviewId: toNumber(review.id),
    userId: toNumber(review.userId),
    storeId: toNumber(review.storeId),
    createdAt: review.createdAt,
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
    reviewId: toNumber(review.id),
    content: review.description,
    reviewScore: review.reviewScore,
    userId: toNumber(review.userId),
    storeId: toNumber(review.storeId),
    createdAt: review.createdAt,
    store: {
      ...review.store,
      storeId: toNumber(review.store.id),
      categoryId: toNumber(review.store.categoryId),
      areaId: toNumber(review.store.areaId),
    },
    user: {
      ...review.user,
      userId: toNumber(review.user.id),
    },
  }));
};

export const getAllUserReviews = async (
  userId: number,
  cursor: number,
) => {
  const reviews = await prisma.review.findMany({
    where: {
      userId: toBigInt(userId),
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
    reviewId: toNumber(review.id),
    content: review.description,
    reviewScore: review.reviewScore,
    userId: toNumber(review.userId),
    storeId: toNumber(review.storeId),
    createdAt: review.createdAt,
    store: {
      ...review.store,
      storeId: toNumber(review.store.id),
      categoryId: toNumber(review.store.categoryId),
      areaId: toNumber(review.store.areaId),
    },
    user: {
      ...review.user,
      userId: toNumber(review.user.id),
    },
  }));
};