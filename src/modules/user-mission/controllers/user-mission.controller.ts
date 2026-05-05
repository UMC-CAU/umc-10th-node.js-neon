import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { toChallengeMissionData } from "../dtos/challenge-mission.dto.js";
import { challengeMission } from "../services/user-mission.service.js";
import { listUserMissions } from "../services/user-mission.service.js";
import { finishMission } from "../services/user-mission.service.js";

const isValidBearerHeader = (authorization: string | undefined): boolean => {
  if (!authorization) {
    return false;
  }

  const [scheme, accessToken] = authorization.split(" ");
  return scheme === "Bearer" && !!accessToken;
};

export const handleChallengeMission = async (req: Request, res: Response) => {
  try {
    const missionId = Number(req.params.missionId);
    const userId = 1;

    if (!Number.isInteger(missionId) || missionId <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        code: "E4001",
        message: "필수 입력값이 누락되었습니다.",
        data: null,
      });
    }

    const challenged = await challengeMission(
      toChallengeMissionData(userId, missionId),
    );

    return res.status(StatusCodes.CREATED).json({
      success: true,
      code: "S201",
      message: "미션 도전을 시작했습니다.",
      data: challenged,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "이미 도전 중인 미션입니다."
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        code: "E4002",
        message: "이미 도전 중인 미션입니다.",
        data: null,
      });
    }

    if (
      error instanceof Error &&
      error.message === "존재하지 않는 미션입니다."
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        code: "E4001",
        message: "필수 입력값이 누락되었습니다.",
        data: null,
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      code: "E5000",
      message: `서버 내부 오류: ${error}`,
      data: null,
    });
  }
};

export const handleListUserMissions = async (req: Request, res: Response) => {
  try {
    const userId = 1; 
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor, 10) : 0;
    const statusQuery = typeof req.query.status === "string" ? req.query.status : undefined;

    let status: boolean | null | undefined = undefined;
    if (statusQuery === "ongoing") status = false;
    else if (statusQuery === "completed") status = true;
    else if (statusQuery === "true") status = true;
    else if (statusQuery === "false") status = false;

    const result = await listUserMissions(userId, cursor, status === undefined ? undefined : status);

    return res.status(StatusCodes.OK).json({
      success: true,
      code: "S200",
      message: "사용자 미션 목록 조회를 완료하였습니다.",
      data: result,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      code: "E5000",
      message: `서버 내부 오류: ${err}`,
      data: null,
    });
  }
};

export const handleCompleteMission = async (req: Request, res: Response) => {
  try {
    const missionId = Number(req.params.missionId);
    const userId = 1;

    if (!Number.isInteger(missionId) || missionId <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        code: "E4001",
        message: "아 단짧한 구간의 복잡한 속돕질 중 맘칭을 보쇀.",
        data: null,
      });
    }

    const completed = await finishMission(userId, missionId);

    return res.status(StatusCodes.OK).json({
      success: true,
      code: "S200",
      message: "미션 완료 처리를 완료했습니다.",
      data: completed,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "진행 중의 미션이 아닙니다."
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        code: "E4003",
        message: "진행 중의 미션이 아닙니다.",
        data: null,
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      code: "E5000",
      message: `서버 내부 오류: ${error}`,
      data: null,
    });
  }
};
