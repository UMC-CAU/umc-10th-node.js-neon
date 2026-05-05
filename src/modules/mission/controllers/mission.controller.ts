import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  bodyToMission,
  CreateMissionRequest,
} from "../dtos/create-mission.dto.js";
import { createMission } from "../services/mission.service.js";

export const handleCreateMission = async (req: Request, res: Response) => {
  try {
    const storeId = Number(req.params.storeId);
    const body = req.body as CreateMissionRequest;

    if (!Number.isInteger(storeId) || storeId <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        code: "E4001",
        message: "필수 입력값이 누락되었습니다.",
        data: null,
      });
    }

    if (
      !body.name ||
      body.name.trim().length === 0 ||
      body.name.trim().length > 20 ||
      !Number.isInteger(Number(body.min_pay)) ||
      Number(body.min_pay) <= 0 ||
      !Number.isInteger(Number(body.reward)) ||
      Number(body.reward) <= 0 ||
      !Number.isInteger(Number(body.mission_due)) ||
      Number(body.mission_due) <= 0
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        code: "E4001",
        message: "필수 입력값이 누락되었습니다.",
        data: null,
      });
    }

    const mission = await createMission(bodyToMission(storeId, body));

    return res.status(StatusCodes.OK).json({
      success: true,
      code: "S200",
      message: "미션 등록이 완료되었습니다.",
      data: mission,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "존재하지 않는 가게입니다."
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
      message: "서버 내부 오류가 발생했습니다.",
      data: null,
    });
  }
};
