import { prisma } from "../../../db.config.js";

const toBigInt = (value: number) => BigInt(value);
const toNumber = (value: bigint) => Number(value);

export const getMissionById = async (
  mission_id: number,
): Promise<any | null> => {
  const mission = await prisma.mission.findUnique({
    where: { id: toBigInt(mission_id) },
    select: {
      id: true,
      missionDue: true,
    },
  });

  if (!mission) {
    return null;
  }

  return {
    id: toNumber(mission.id),
    mission_due: mission.missionDue,
  };
};

export const existsOngoingChallenge = async (
  user_id: number,
  mission_id: number,
): Promise<boolean> => {
  const ongoingMission = await prisma.userMission.findFirst({
    where: {
      userId: toBigInt(user_id),
      missionId: toBigInt(mission_id),
      status: false,
    },
    select: { id: true },
  });

  return ongoingMission !== null;
};

export const addUserMission = async (
  user_id: number,
  mission_id: number,
  mission_due: number,
): Promise<number> => {
  const today = new Date();
  const dueDate = new Date(
    Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate() + mission_due,
    ),
  );

  const userMission = await prisma.userMission.create({
    data: {
      userId: toBigInt(user_id),
      missionId: toBigInt(mission_id),
      status: false,
      completedAt: null,
      dueDate,
    },
    select: { id: true },
  });

  return toNumber(userMission.id);
};

export const getUserMissionById = async (
  user_mission_id: number,
): Promise<any | null> => {
  const userMission = await prisma.userMission.findUnique({
    where: { id: toBigInt(user_mission_id) },
    select: {
      id: true,
      userId: true,
      missionId: true,
      status: true,
      dueDate: true,
      createdAt: true,
    },
  });

  if (!userMission) {
    return null;
  }

  return {
    id: toNumber(userMission.id),
    user_id: toNumber(userMission.userId),
    mission_id: toNumber(userMission.missionId),
    status: userMission.status,
    due_date: userMission.dueDate,
    create_at: userMission.createdAt,
  };
};

export const getUserMissions = async (
  user_id: number,
  cursor: number,
  status?: boolean | null,
) => {
  const where: any = {
    userId: toBigInt(user_id),
    id: { gt: toBigInt(cursor) },
  };

  if (typeof status === "boolean") {
    where.status = status;
  }

  const rows = await prisma.userMission.findMany({
    where,
    orderBy: { id: "asc" },
    take: 10,
    select: {
      id: true,
      userId: true,
      missionId: true,
      status: true,
      dueDate: true,
      createdAt: true,
      mission: {
        select: { id: true, name: true, minPay: true, reward: true, missionDue: true },
      },
    },
  });

  return rows.map((r) => ({
    id: toNumber(r.id),
    user_id: toNumber(r.userId),
    mission_id: toNumber(r.missionId),
    status: r.status,
    due_date: r.dueDate,
    create_at: r.createdAt,
    mission: r.mission
      ? {
          mission_id: toNumber(r.mission.id),
          name: r.mission.name,
          min_pay: r.mission.minPay,
          reward: r.mission.reward,
          mission_due: r.mission.missionDue,
        }
      : null,
  }));
};

export const getOngoingMission = async (
  user_id: number,
  mission_id: number,
): Promise<any | null> => {
  const userMission = await prisma.userMission.findFirst({
    where: {
      userId: toBigInt(user_id),
      missionId: toBigInt(mission_id),
      status: false,
    },
    select: {
      id: true,
      userId: true,
      missionId: true,
      status: true,
      dueDate: true,
      createdAt: true,
    },
  });

  if (!userMission) {
    return null;
  }

  return {
    id: toNumber(userMission.id),
    user_id: toNumber(userMission.userId),
    mission_id: toNumber(userMission.missionId),
    status: userMission.status,
    due_date: userMission.dueDate,
    create_at: userMission.createdAt,
  };
};

export const completeMission = async (
  user_id: number,
  mission_id: number,
): Promise<any> => {
  const userMission = await prisma.userMission.update({
    where: {
      id: (await prisma.userMission.findFirstOrThrow({
        where: {
          userId: toBigInt(user_id),
          missionId: toBigInt(mission_id),
          status: false,
        },
        select: { id: true },
      })).id,
    },
    data: {
      status: true,
      completedAt: new Date(),
    },
    select: {
      id: true,
      userId: true,
      missionId: true,
      status: true,
      dueDate: true,
      createdAt: true,
    },
  });

  return {
    id: toNumber(userMission.id),
    user_id: toNumber(userMission.userId),
    mission_id: toNumber(userMission.missionId),
    status: userMission.status,
    due_date: userMission.dueDate,
    create_at: userMission.createdAt,
  };
};
