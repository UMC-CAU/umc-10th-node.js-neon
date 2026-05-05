import {
  MissionData,
  responseFromMission,
} from "../dtos/create-mission.dto.js";
import {
  addMission,
  existsStoreById,
  getMission,
  getMissionsByStore,
} from "../repositories/mission.repository.js";

export const createMission = async (data: MissionData) => {
  const isStoreExists = await existsStoreById(data.store_id);

  if (!isStoreExists) {
    throw new Error("존재하지 않는 가게입니다.");
  }

  const missionId = await addMission(data);
  const mission = await getMission(missionId);

  return responseFromMission({
    missionId,
    mission: mission ?? {
      mission_id: missionId,
      store_id: data.store_id,
      name: data.name,
      min_pay: data.min_pay,
      reward: data.reward,
      mission_due: data.mission_due,
    },
  });
};

export const listStoreMissions = async (
  storeId: number,
  cursor: number,
) => {
  const missions = await getMissionsByStore(storeId, cursor);

  const last = missions[missions.length - 1];
  return {
    missions,
    pagination: { cursor: last ? last.id : null },
  };
};
