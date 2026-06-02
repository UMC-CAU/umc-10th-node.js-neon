export interface ChallengeMissionRequest {
  userId: number;
  missionId: number;
}

export interface ChallengeMissionResponse {
  id: number;
  userId: number;
  missionId: number;
  status: boolean;
  dueDate: string | null;
  createdAt: string;
}

export interface ListUserMissionsResponse {
  missions: ChallengeMissionResponse[];
  pagination: {
    cursor: number | null;
  };
}

export interface CompleteMissionResponse {
  id: number;
  userId: number;
  missionId: number;
  status: boolean;
  dueDate: string | null;
  createdAt: string;
}
