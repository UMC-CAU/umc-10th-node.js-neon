import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  bodyToReview,
  CreateReviewRequest,
} from "../dtos/review.dto.js";
import { 
  createReview, 
  listStoreReviews } from "../services/review.service.js";

export const handleCreateReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = Number(req.params.storeId);
    const body = req.body as CreateReviewRequest;
    const userId = 1;

    if (!Number.isInteger(storeId) || storeId <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        code: "E4000",
        message: "인증 ID가 올바르지 않습니다.",
        data: null,
      });
    }
    if (
      !Number.isInteger(Number(body.review_score)) ||
      Number(body.review_score) < 1 ||
      Number(body.review_score) > 5
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        code: "E4001",
        message:
          "필수 입력값이 누락되었습니다. (별점을 1~5 사이를 입력해주세요.)",
        data: null,
      });
    }

    if (!body.content || body.content.trim().length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        code: "E4001",
        message:
          "필수 입력값이 누락되었습니다. (별점을 1~5 사이를 입력해주세요.)",
        data: null,
      });
    }

    const review = await createReview(bodyToReview(userId, storeId, body));

    return res.status(StatusCodes.OK).json({
      success: true,
      code: "S200",
      message: "리뷰 등록을 완료하였습니다.",
      data: review,
    });
  } catch (error) {
    console.error("Review Creation Error:", error);

    if (error instanceof Error) {
      // 특정 비즈니스 로직 에러 처리
      if (error.message === "존재하지 않는 가게입니다.") {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          code: "E4000",
          message: error.message,
          data: null,
        });
      }

      // 개발 단계에서만 에러 메시지를 응답에 포함
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        code: "E5000",
        message: `서버 내부 오류: ${error.message}`,
        data: null,
      });
    }
  }
};
export const handleListStoreReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const storeId = parseInt(req.params.storeId as string, 10);
    const cursor =
    typeof req.query.cursor === "string"
      ? parseInt(req.query.cursor, 10)
      : 0;

    const reviews = await listStoreReviews(storeId, cursor);

    res.status(StatusCodes.OK).json(reviews);
  } catch (err) {
    next(err);
  }
};