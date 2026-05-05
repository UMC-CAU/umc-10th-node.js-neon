import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { toChallengeMissionData } from "../dtos/challenge-mission.dto.js";
import { challengeMission } from "../services/user-mission.service.js";

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
