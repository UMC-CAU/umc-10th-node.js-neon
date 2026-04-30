import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToStore, CreateStoreRequest } from "../dtos/create-store.dto.js";
import { createStore } from "../services/store.service.js";

export const handleCreateStore = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const areaId = Number(req.params.areaId);
    const body = req.body as CreateStoreRequest;

    if (!Number.isInteger(areaId) || areaId <= 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "area_id는 1 이상의 정수여야 합니다." });
    }

    if (
      !Number.isInteger(Number(body.category_id)) ||
      Number(body.category_id) <= 0
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "category_id는 1 이상의 정수여야 합니다." });
    }

    if (
      !body.name ||
      body.name.trim().length === 0 ||
      body.name.trim().length > 20
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "name은 1자 이상 20자 이하여야 합니다." });
    }

    const store = await createStore(bodyToStore(areaId, body));

    res.status(StatusCodes.OK).json({ result: store });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "존재하지 않는 지역입니다."
    ) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }

    return next(error);
  }
};
