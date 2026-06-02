export interface CreateMissionRequest {
  name: string;
  minPay: number;
  reward: number;
  missionDue: number;
}

export interface MissionData {
  storeId: number;
  name: string;
  minPay: number;
  reward: number;
  missionDue: number;
}

export interface CreateMissionResponse {
  missionId: number;
  storeId: number;
  name: string;
  minPay: number;
  reward: number;
  missionDue: number;
}

export interface MissionListItem {
  missionId: number;
  storeId: number;
  name: string;
  minPay: number;
  reward: number;
  missionDue: number;
  createdAt: string;
}

export interface MissionListResponse {
  missions: MissionListItem[];
  pagination: { cursor: number | null };
}

export const bodyToMission = (
  storeId: number,
  body: CreateMissionRequest,
): MissionData => {
  return {
    storeId,
    name: body.name.trim(),
    minPay: Number(body.minPay),
    reward: Number(body.reward),
    missionDue: Number(body.missionDue),
  };
};
