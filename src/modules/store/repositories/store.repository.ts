import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../../db.config.js";
import { StoreData } from "../dtos/create-store.dto.js";

export const existsAreaById = async (area_id: number): Promise<boolean> => {
  const conn = await pool.getConnection();

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT EXISTS(SELECT 1 FROM area WHERE id = ?) AS isExistArea;`,
      [area_id],
    );
    console.log("existsAreaById query result:", rows);
    return !!rows[0]?.isExistArea;
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};

export const addStore = async (data: StoreData): Promise<number> => {
  const conn = await pool.getConnection();

  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO store
        (category_id, area_id, name)
      VALUES
        (?, ?, ?);`,
      [data.category_id, data.area_id, data.name],
    );

    return result.insertId;
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};

export const getStore = async (storeId: number): Promise<any | null> => {
  const conn = await pool.getConnection();

  try {
    const [store] = await pool.query<RowDataPacket[]>(
      `SELECT id, area_id, category_id, name FROM store WHERE id = ?;`,
      [storeId],
    );

    if (store.length === 0) {
      return null;
    }

    return store[0];
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};
