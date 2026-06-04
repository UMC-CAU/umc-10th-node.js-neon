import { Controller, Post, Get, Path, Query, Route, Tags, Body, Response, Middlewares, Request } from "tsoa";
import { CreateReviewRequest, ReviewListResponse, CreateReviewResponse, bodyToReview } from "../dtos/review.dto.js";
import { createReview, listStoreReviews, listUserReviews } from "../services/review.service.js";
import { ApiResponse, success, ErrorResponse } from "../../../common/responses/response.js";
import {
  InvalidStoreIdData,
  InvalidReviewScoreData,
  InvalidReviewContentData,
  StoreNotFoundData,
  ErrorExamples,
} from "../../../common/errors/error.examples.js";
import { InvalidInputError } from "../../../common/errors/error.js";
import { authorizeUser } from "../../../common/middlewares/auth.middleware.js";
import { Request as ExpressRequest } from "express";

const getAuthenticatedUserId = (req: ExpressRequest): number => {
  const userId = req.user?.id;

  if (userId === undefined || userId === null) {
    throw new InvalidInputError("로그인이 필요합니다.");
  }

  return typeof userId === "bigint" ? Number(userId) : userId;
};

@Route("stores")
@Tags("Reviews")
export class ReviewController extends Controller {
  /**
   * 새로운 리뷰 생성
   * @summary 가게에 대한 리뷰를 작성
   */
  @Post("{storeId}/review/write")
  @Middlewares(authorizeUser())
  @Response<ErrorResponse<InvalidStoreIdData>>(400, "유효하지 않은 가게 ID", ErrorExamples.InvalidStoreId)
  @Response<ErrorResponse<InvalidReviewScoreData>>(400, "유효하지 않은 별점", ErrorExamples.InvalidReviewScore)
  @Response<ErrorResponse<InvalidReviewContentData>>(400, "내용을 입력해주세요", ErrorExamples.InvalidReviewContent)
  @Response<ErrorResponse<StoreNotFoundData>>(404, "가게를 찾을 수 없음", ErrorExamples.StoreNotFound)
  public async handleCreateReview(
    @Path() storeId: number,
    @Body() body: CreateReviewRequest,
    @Request() req: ExpressRequest,
  ): Promise<ApiResponse<CreateReviewResponse>> {
    if (!Number.isInteger(storeId) || storeId <= 0) {
      throw new InvalidInputError("storeId가 올바르지 않습니다.", { storeId });
    }
    if (!Number.isInteger(Number(body.reviewScore)) || Number(body.reviewScore) < 1 || Number(body.reviewScore) > 5) {
      throw new InvalidInputError("별점은 1~5 사이여야 합니다.", { reviewScore: body.reviewScore });
    }
    if (!body.content || body.content.trim().length === 0) {
      throw new InvalidInputError("내용을 입력해주세요.", { content: body.content });
    }

    const userId = getAuthenticatedUserId(req);
    const review = await createReview(bodyToReview(userId, storeId, body));
    return success(review);
  }

  /**
   * 가게리뷰 목록 조회
   * @summary 단일 가게에 대한 모든 리뷰를 조회
   */
  @Get("{storeId}/reviews")
  public async handleListStoreReviews(
    @Path() storeId: number,
    @Query() cursor?: number,
  ): Promise<ApiResponse<ReviewListResponse>> {
    const parsedCursor = cursor || 0;
    const result = await listStoreReviews(storeId, parsedCursor);
    return success(result);
  }
}

@Route("users")
@Tags("Reviews")
export class UserReviewController extends Controller {
  /**
   * 사용자 리뷰 목록 조회
   * @summary 나의 모든 리뷰를 조회
   */
  @Get("me/reviews")
  @Middlewares(authorizeUser())
  public async handleListUserReviews(
    @Request() req: ExpressRequest,
    @Query() cursor?: number,
  ): Promise<ApiResponse<ReviewListResponse>> {
    const parsedCursor = cursor || 0;
    const userId = getAuthenticatedUserId(req);
    const result = await listUserReviews(userId, parsedCursor);
    return success(result);
  }
}