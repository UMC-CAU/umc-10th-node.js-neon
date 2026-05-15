import {
  MissionData,
  CreateMissionResponse,
  MissionListResponse,
} from "../dtos/create-mission.dto.js";
import {
  addMission,
  existsStoreById,
  getMission,
  getMissionsByStore,
} from "../repositories/mission.repository.js";
import { AreaNotFoundError, InvalidInputError } from "../../../common/errors/error.js";

export const createMission = async (data: MissionData): Promise<CreateMissionResponse> => {
  if (!data.name || data.name.length === 0 || data.name.length > 20) {
    throw new InvalidInputError("미션 이름은 1~20자 사이여야 합니다.", { name: data.name });
  }
  if (!Number.isInteger(data.minPay) || data.minPay <= 0) {
    throw new InvalidInputError("최소 금액은 0보다 커야 합니다.", { minPay: data.minPay });
  }
  if (!Number.isInteger(data.reward) || data.reward <= 0) {
    throw new InvalidInputError("보상금은 0보다 커야 합니다.", { reward: data.reward });
  }
  if (!Number.isInteger(data.missionDue) || data.missionDue <= 0) {
    throw new InvalidInputError("기한은 0보다 커야 합니다.", { missionDue: data.missionDue });
  }

  const isStoreExists = await existsStoreById(data.storeId);

  if (!isStoreExists) {
    throw new AreaNotFoundError("존재하지 않는 가게입니다.", { storeId: data.storeId });
  }

  const missionId = await addMission(data);
  const mission = await getMission(missionId);

  return {
    missionId: mission?.missionId ?? missionId,
    storeId: mission?.storeId ?? data.storeId,
    name: mission?.name ?? data.name,
    minPay: mission?.minPay ?? data.minPay,
    reward: mission?.reward ?? data.reward,
    missionDue: mission?.missionDue ?? data.missionDue,
  };
};

export const listStoreMissions = async (
  storeId: number,
  cursor: number,
): Promise<MissionListResponse> => {
  const missions = await getMissionsByStore(storeId, cursor);
  const last = missions[missions.length - 1];

  return {
    missions,
    pagination: { cursor: last ? last.missionId : null },
  };
};
