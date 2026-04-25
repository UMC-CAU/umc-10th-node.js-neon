import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../../db.config.js";
import { ReviewData } from "../dtos/create-review.dto.js";

export const existsStoreById = async (store_id: number): Promise<boolean> => {
  const conn = await pool.getConnection();

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT EXISTS(SELECT 1 FROM store WHERE id = ?) AS isExistStore;`,
      [store_id],
    );
    return !!rows[0]?.isExistStore;
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};

export const addReview = async (data: ReviewData): Promise<number> => {
  const conn = await pool.getConnection();

  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO review
        (user_id, store_id, review_score, description)
      VALUES
        (?, ?, ?, ?);`,
      [data.user_id, data.store_id, data.review_score, data.content],
    );

    return result.insertId;
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};

export const getReview = async (reviewId: number): Promise<any | null> => {
  const conn = await pool.getConnection();

  try {
    const [review] = await pool.query<RowDataPacket[]>(
      `SELECT id, user_id, store_id, create_at FROM review WHERE id = ?;`,
      [reviewId],
    );

    if (review.length === 0) {
      return null;
    }

    return review[0];
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};
