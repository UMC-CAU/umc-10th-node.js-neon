import {
  ChallengeMissionResponse,
  ListUserMissionsResponse,
  CompleteMissionResponse,
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
import {
  MissionNotFoundError,
  AlreadyChallensingMissionError,
  MissionNotInProgressError,
} from "../../../common/errors/error.js";

const formatUserMissionResponse = (data: any): ChallengeMissionResponse => ({
  id: data.id,
  userId: data.user_id,
  missionId: data.mission_id,
  status: data.status,
  dueDate: data.due_date,
  createdAt: data.create_at,
});

export const challengeMission = async (
  userId: number,
  missionId: number,
): Promise<ChallengeMissionResponse> => {
  const mission = await getMissionById(missionId);

  if (!mission) {
    throw new MissionNotFoundError("존재하지 않는 미션입니다.", {
      userId,
      missionId,
    });
  }

  const isAlreadyChallenging = await existsOngoingChallenge(userId, missionId);

  if (isAlreadyChallenging) {
    throw new AlreadyChallensingMissionError("이미 도전 중인 미션입니다.", {
      userId,
      missionId,
    });
  }

  const userMissionId = await addUserMission(userId, missionId, mission.mission_due);
  const userMission = await getUserMissionById(userMissionId);

  return formatUserMissionResponse(
    userMission ?? {
      id: userMissionId,
      user_id: userId,
      mission_id: missionId,
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
): Promise<ListUserMissionsResponse> => {
  const missions = await getUserMissions(userId, cursor, status);
  const last = missions[missions.length - 1];
  
  return {
    missions: missions.map(formatUserMissionResponse),
    pagination: { cursor: last ? last.id : null },
  };
};

export const finishMission = async (
  userId: number,
  missionId: number,
): Promise<CompleteMissionResponse> => {
  const ongoingMission = await getOngoingMission(userId, missionId);

  if (!ongoingMission) {
    throw new MissionNotInProgressError("진행 중의 미션이 아닙니다.", {
      userId,
      missionId,
    });
  }

  const completedMission = await completeMission(userId, missionId);
  return formatUserMissionResponse(completedMission);
};
