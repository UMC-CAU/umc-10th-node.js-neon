import { ResultSetHeader, RowDataPacket } from "mysql2";
// import { pool } from "../../../db.config.js";
import { prisma } from "../../../db.config.js";
import { ReviewData } from "../dtos/review.dto.js";
import e from "express";

// export const existsStoreById = async (store_id: number): Promise<boolean> => {
//   const conn = await pool.getConnection();

//   try {
//     const [rows] = await pool.query<RowDataPacket[]>(
//       `SELECT EXISTS(SELECT 1 FROM store WHERE id = ?) AS isExistStore;`,
//       [store_id],
//     );
//     return !!rows[0]?.isExistStore;
//   } catch (err) {
//     throw new Error(`오류가 발생했어요: ${err}`);
//   } finally {
//     conn.release();
//   }
// };

// export const addReview = async (data: ReviewData): Promise<number> => {
//   const conn = await pool.getConnection();

//   try {
//     const [result] = await pool.query<ResultSetHeader>(
//       `INSERT INTO review
//         (user_id, store_id, review_score, description)
//       VALUES
//         (?, ?, ?, ?);`,
//       [data.user_id, data.store_id, data.review_score, data.content],
//     );

//     return result.insertId;
//   } catch (err) {
//     throw new Error(`오류가 발생했어요: ${err}`);
//   } finally {
//     conn.release();
//   }
// };

// export const getReview = async (reviewId: number): Promise<any | null> => {
//   const conn = await pool.getConnection();

//   try {
//     const [review] = await pool.query<RowDataPacket[]>(
//       `SELECT id, user_id, store_id, create_at FROM review WHERE id = ?;`,
//       [reviewId],
//     );

//     if (review.length === 0) {
//       return null;
//     }

//     return review[0];
//   } catch (err) {
//     throw new Error(`오류가 발생했어요: ${err}`);
//   } finally {
//     conn.release();
//   }
// };
export const existsStoreById = async (store_id: number): Promise<boolean> => {
  const store = await prisma.store.findUnique({
    where: {  id: store_id },
    select: { id: true },
  });
  return !!store;
}
export const addReview = async (data: ReviewData): Promise<number> => {
  const review = await prisma.review.create({
    data: { 
      userId: data.user_id,
      storeId: data.store_id,
      reviewScore: data.review_score,
      content: data.content
    }
  });
  return Number(review.id);
};
export const getReview = async (reviewId: number): Promise<any | null> => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: {
      userId: true,
      storeId: true,
      createAt: true,
    },
  });
  return review;
};
export const getAllStoreReviews = async (
    storeId: number,
    cursor: number
  ) => {
    const reviews = await prisma.review.findMany({
      select: {
        id: true,
        content: true,
        store: true,
        user: true,
      },
      where: {
        storeId,
        id: {
          gt: cursor,
        },
      },
      orderBy: {
        id: "asc",
      },
      take: 5,
    });
  
    return reviews;
  };