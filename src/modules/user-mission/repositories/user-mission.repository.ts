import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../../db.config.js";

export const getMissionById = async (
  mission_id: number,
): Promise<any | null> => {
  const conn = await pool.getConnection();

  try {
    const [mission] = await pool.query<RowDataPacket[]>(
      `SELECT id, mission_due FROM mission WHERE id = ?;`,
      [mission_id],
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

export const existsOngoingChallenge = async (
  user_id: number,
  mission_id: number,
): Promise<boolean> => {
  const conn = await pool.getConnection();

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT EXISTS(
        SELECT 1
        FROM user_mission
        WHERE user_id = ? AND mission_id = ? AND status = false
      ) AS isChallenging;`,
      [user_id, mission_id],
    );

    return !!rows[0]?.isChallenging;
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};

export const addUserMission = async (
  user_id: number,
  mission_id: number,
  mission_due: number,
): Promise<number> => {
  const conn = await pool.getConnection();

  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO user_mission
        (user_id, mission_id, status, completed_at, due_date)
      VALUES
        (?, ?, false, NULL, DATE_ADD(CURDATE(), INTERVAL ? DAY));`,
      [user_id, mission_id, mission_due],
    );

    return result.insertId;
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};

export const getUserMissionById = async (
  user_mission_id: number,
): Promise<any | null> => {
  const conn = await pool.getConnection();

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT
        id,
        user_id,
        mission_id,
        status,
        due_date,
        create_at
      FROM user_mission
      WHERE id = ?;`,
      [user_mission_id],
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (err) {
    throw new Error(`오류가 발생했어요: ${err}`);
  } finally {
    conn.release();
  }
};
