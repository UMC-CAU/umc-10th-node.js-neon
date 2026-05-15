export interface DuplicateUserEmailData { email: string }
export interface InvalidSignUpRequestData { field: string; reason: string }
export interface InvalidStoreIdData { storeId: number }
export interface InvalidMissionNameData { name: string }
export interface InvalidMissionMinPayData { minPay: number }
export interface InvalidMissionRewardData { reward: number }
export interface InvalidMissionDueData { missionDue: number }
export interface InvalidCategoryIdData { categoryId: number }
export interface InvalidStoreNameData { name: string }
export interface InvalidReviewScoreData { reviewScore: number }
export interface InvalidReviewContentData { content: string }
export interface MissingMissionIdData { missionId: number }
export interface AlreadyChallengingMissionData { userId: number; missionId: number }
export interface MissionNotInProgressData { userId: number; missionId: number }
export interface MissionNotFoundData { userId: number; missionId: number }
export interface AreaNotFoundFromStoreCreateData { areaId: number }
export interface AreaNotFoundFromMissionCreateData { storeId: number }
export interface StoreNotFoundData { storeId: number }

export const ErrorExamples = {
  DuplicateUserEmail: {
    resultType: "FAILED",
    error: {
      errorCode: "U001",
      statusCode: 409,
      message: "이미 존재하는 이메일입니다.",
      data: { email: "user@example.com" },
    },
    data: null,
  },
  InvalidSignUpRequest: {
    resultType: "FAILED",
    error: {
      errorCode: "E4001",
      statusCode: 400,
      message: "잘못된 입력값입니다.",
      data: { field: "email", reason: "올바른 이메일 형식이 아닙니다." },
    },
    data: null,
  },
  InvalidStoreId: {
    resultType: "FAILED",
    error: {
      errorCode: "E4001",
      statusCode: 400,
      message: "storeId가 올바르지 않습니다.",
      data: { storeId: 0 },
    },
    data: null,
  },
  InvalidMissionName: {
    resultType: "FAILED",
    error: {
      errorCode: "E4001",
      statusCode: 400,
      message: "미션 이름은 1~20자 사이여야 합니다.",
      data: { name: "" },
    },
    data: null,
  },
  InvalidMissionMinPay: {
    resultType: "FAILED",
    error: {
      errorCode: "E4001",
      statusCode: 400,
      message: "최소 금액은 0보다 커야 합니다.",
      data: { minPay: 0 },
    },
    data: null,
  },
  InvalidMissionReward: {
    resultType: "FAILED",
    error: {
      errorCode: "E4001",
      statusCode: 400,
      message: "보상금은 0보다 커야 합니다.",
      data: { reward: 0 },
    },
    data: null,
  },
  InvalidMissionDue: {
    resultType: "FAILED",
    error: {
      errorCode: "E4001",
      statusCode: 400,
      message: "기한은 0보다 커야 합니다.",
      data: { missionDue: 0 },
    },
    data: null,
  },
  InvalidCategoryId: {
    resultType: "FAILED",
    error: {
      errorCode: "E4001",
      statusCode: 400,
      message: "카테고리 ID는 1 이상의 정수여야 합니다.",
      data: { categoryId: 0 },
    },
    data: null,
  },
  InvalidStoreName: {
    resultType: "FAILED",
    error: {
      errorCode: "E4001",
      statusCode: 400,
      message: "가게 이름은 1자 이상 20자 이하여야 합니다.",
      data: { name: "" },
    },
    data: null,
  },
  InvalidReviewScore: {
    resultType: "FAILED",
    error: {
      errorCode: "E4001",
      statusCode: 400,
      message: "별점은 1~5 사이여야 합니다.",
      data: { reviewScore: 6 },
    },
    data: null,
  },
  InvalidReviewContent: {
    resultType: "FAILED",
    error: {
      errorCode: "E4001",
      statusCode: 400,
      message: "내용을 입력해주세요.",
      data: { content: "" },
    },
    data: null,
  },
  MissingMissionId: {
    resultType: "FAILED",
    error: {
      errorCode: "E4001",
      statusCode: 400,
      message: "필수 입력값이 누락되었습니다.",
      data: { missionId: 0 },
    },
    data: null,
  },
  AlreadyChallengingMission: {
    resultType: "FAILED",
    error: {
      errorCode: "M002",
      statusCode: 409,
      message: "이미 도전 중인 미션입니다.",
      data: { userId: 1, missionId: 1 },
    },
    data: null,
  },
  MissionNotInProgress: {
    resultType: "FAILED",
    error: {
      errorCode: "M003",
      statusCode: 400,
      message: "진행 중의 미션이 아닙니다.",
      data: { userId: 1, missionId: 1 },
    },
    data: null,
  },
  MissionNotFound: {
    resultType: "FAILED",
    error: {
      errorCode: "M004",
      statusCode: 404,
      message: "존재하지 않는 미션입니다.",
      data: { userId: 1, missionId: 1 },
    },
    data: null,
  },
  AreaNotFoundFromStoreCreate: {
    resultType: "FAILED",
    error: {
      errorCode: "S001",
      statusCode: 404,
      message: "존재하지 않는 지역입니다.",
      data: { areaId: 1 },
    },
    data: null,
  },
  AreaNotFoundFromMissionCreate: {
    resultType: "FAILED",
    error: {
      errorCode: "S001",
      statusCode: 404,
      message: "존재하지 않는 가게입니다.",
      data: { storeId: 1 },
    },
    data: null,
  },
  StoreNotFound: {
    resultType: "FAILED",
    error: {
      errorCode: "S002",
      statusCode: 404,
      message: "가게를 찾을 수 없습니다.",
      data: { storeId: 1 },
    },
    data: null,
  },
} as const;
