export interface ChallengeMissionData {
  user_id: number;
  mission_id: number;
}

export interface ChallengeMissionResponse {
  id: number;
  user_id: number;
  mission_id: number;
  status: boolean;
  due_date: string;
  create_at: string;
}

export const toChallengeMissionData = (
  userId: number,
  missionId: number,
): ChallengeMissionData => {
  return {
    user_id: userId,
    mission_id: missionId,
  };
};

export const responseFromUserMission = (
  data: any,
): ChallengeMissionResponse => {
  const createAt =
    data.create_at instanceof Date
      ? data.create_at.toISOString()
      : String(data.create_at);

  const dueDate =
    data.due_date instanceof Date
      ? data.due_date.toISOString().slice(0, 10)
      : String(data.due_date);

  return {
    id: data.id,
    user_id: data.user_id,
    mission_id: data.mission_id,
    status: Boolean(data.status),
    due_date: dueDate,
    create_at: createAt,
  };
};
