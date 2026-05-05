import {
  ChallengeMissionData,
  responseFromUserMission,
} from "../dtos/challenge-mission.dto.js";
import {
  addUserMission,
  existsOngoingChallenge,
  getMissionById,
  getUserMissionById,
  getUserMissions,
  getOngoingMission,
  completeMission,
} from "../repositories/user-mission.repository.js";

export const challengeMission = async (data: ChallengeMissionData) => {
  const mission = await getMissionById(data.mission_id);

  if (!mission) {
    throw new Error("존재하지 않는 미션입니다.");
  }

  const isAlreadyChallenging = await existsOngoingChallenge(
    data.user_id,
    data.mission_id,
  );

  if (isAlreadyChallenging) {
    throw new Error("이미 도전 중인 미션입니다.");
  }

  const userMissionId = await addUserMission(
    data.user_id,
    data.mission_id,
    mission.mission_due,
  );

  const userMission = await getUserMissionById(userMissionId);

  return responseFromUserMission(
    userMission ?? {
      id: userMissionId,
      user_id: data.user_id,
      mission_id: data.mission_id,
      status: false,
      due_date: null,
      create_at: new Date().toISOString(),
    },
  );
};

export const listUserMissions = async (
  userId: number,
  cursor: number,
  status?: boolean | null,
) => {
  const missions = await getUserMissions(userId, cursor, status);
  const last = missions[missions.length - 1];
  return {
    missions,
    pagination: { cursor: last ? last.id : null },
  };
};

export const finishMission = async (
  userId: number,
  missionId: number,
) => {
  const ongoingMission = await getOngoingMission(userId, missionId);

  if (!ongoingMission) {
    throw new Error("진행 중인 미션이 아닙니다.");
  }

  const completedMission = await completeMission(userId, missionId);
  return responseFromUserMission(completedMission);
};
