import { prisma } from "../../../db.config.js";
import { MissionData } from "../dtos/create-mission.dto.js";

const toBigInt = (value: number) => BigInt(value);
const toNumber = (value: bigint) => Number(value);

export const existsStoreById = async (store_id: number): Promise<boolean> => {
  const store = await prisma.store.findUnique({
    where: { id: toBigInt(store_id) },
    select: { id: true },
  });

  return store !== null;
};

export const addMission = async (data: MissionData): Promise<number> => {
  const mission = await prisma.mission.create({
    data: {
      storeId: toBigInt(data.store_id),
      name: data.name,
      minPay: data.min_pay,
      reward: data.reward,
      missionDue: data.mission_due,
    },
    select: { id: true },
  });

  return toNumber(mission.id);
};

export const getMission = async (missionId: number): Promise<any | null> => {
  const mission = await prisma.mission.findUnique({
    where: { id: toBigInt(missionId) },
    select: {
      id: true,
      storeId: true,
      name: true,
      minPay: true,
      reward: true,
      missionDue: true,
    },
  });

  if (!mission) {
    return null;
  }

  return {
    mission_id: toNumber(mission.id),
    store_id: toNumber(mission.storeId),
    name: mission.name,
    min_pay: mission.minPay,
    reward: mission.reward,
    mission_due: mission.missionDue,
  };
};

export const getMissionsByStore = async (
  storeId: number,
  cursor: number,
) => {
  const missions = await prisma.mission.findMany({
    where: {
      storeId: toBigInt(storeId),
      id: {
        gt: toBigInt(cursor),
      },
    },
    orderBy: { id: "asc" },
    take: 10,
    select: {
      id: true,
      storeId: true,
      name: true,
      minPay: true,
      reward: true,
      missionDue: true,
      createdAt: true,
    },
  });

  return missions.map((m) => ({
    id: toNumber(m.id),
    mission_id: toNumber(m.id),
    store_id: toNumber(m.storeId),
    name: m.name,
    min_pay: m.minPay,
    reward: m.reward,
    mission_due: m.missionDue,
    create_at: m.createdAt,
  }));
};
