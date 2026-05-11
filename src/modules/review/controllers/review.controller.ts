import { Controller, Post, Get, Path, Query, Route, Tags, Body } from "tsoa";
import { CreateReviewRequest, ReviewListResponse, CreateReviewResponse, bodyToReview } from "../dtos/review.dto.js";
import { createReview, listStoreReviews, listUserReviews } from "../services/review.service.js";
import { ApiResponse, success } from "../../../common/responses/response";
import { InvalidInputError } from "../../../common/errors/error.js";

@Route("stores")
@Tags("Reviews")
export class ReviewController extends Controller {
  @Post("{storeId}/review/write")
  public async handleCreateReview(
    @Path() storeId: number,
    @Body() body: CreateReviewRequest,
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

    const userId = 1;
    const review = await createReview(bodyToReview(userId, storeId, body));
    return success(review);
  }

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
  @Get("me/reviews")
  public async handleListUserReviews(
    @Query() cursor?: number,
  ): Promise<ApiResponse<ReviewListResponse>> {
    const parsedCursor = cursor || 0;
    const userId = 1;
    const result = await listUserReviews(userId, parsedCursor);
    return success(result);
  }
}