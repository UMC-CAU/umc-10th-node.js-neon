import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../../db.config.js";
import { MissionData } from "../dtos/create-mission.dto.js";

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

export const addMission = async (data: MissionData): Promise<number> => {
  const conn = await pool.getConnection();

  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO mission
        (store_id, name, min_pay, reward, mission_due)
      VALUES
        (?, ?, ?, ?, ?);`,
      [data.store_id, data.name, data.min_pay, data.reward, data.mission_due],
    );

    return result.insertId;
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};

export const getMission = async (missionId: number): Promise<any | null> => {
  const conn = await pool.getConnection();

  try {
    const [mission] = await pool.query<RowDataPacket[]>(
      `SELECT id, store_id, name, min_pay, reward, mission_due
       FROM mission
       WHERE id = ?;`,
      [missionId],
    );

    if (mission.length === 0) {
      return null;
    }

    return mission[0];
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};
