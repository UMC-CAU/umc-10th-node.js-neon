export interface CreateMissionRequest {
  name: string;
  min_pay: number;
  reward: number;
  mission_due: number;
}

export interface MissionData {
  store_id: number;
  name: string;
  min_pay: number;
  reward: number;
  mission_due: number;
}

export interface CreateMissionResponse {
  id: number;
  store_id: number;
  name: string;
  min_pay: number;
  reward: number;
  mission_due: number;
}

export const bodyToMission = (
  storeId: number,
  body: CreateMissionRequest,
): MissionData => {
  return {
    store_id: storeId,
    name: body.name.trim(),
    min_pay: Number(body.min_pay),
    reward: Number(body.reward),
    mission_due: Number(body.mission_due),
  };
};

export const responseFromMission = (data: {
  missionId: number;
  mission: any;
}): CreateMissionResponse => {
  return {
    id: data.mission.mission_id ?? data.missionId,
    store_id: data.mission.store_id,
    name: data.mission.name,
    min_pay: data.mission.min_pay,
    reward: data.mission.reward,
    mission_due: data.mission.mission_due,
  };
};
