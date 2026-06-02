import { Controller, Post, Get, Path, Query, Route, Tags, Body, Response, Middlewares } from "tsoa";
import {
  bodyToMission,
  CreateMissionRequest,
  CreateMissionResponse,
  MissionListResponse,
} from "../dtos/create-mission.dto.js";
import { createMission, listStoreMissions } from "../services/mission.service.js";
import { ApiResponse, success, ErrorResponse } from "../../../common/responses/response.js";
import {
  InvalidStoreIdData,
  InvalidMissionNameData,
  InvalidMissionMinPayData,
  InvalidMissionRewardData,
  InvalidMissionDueData,
  AreaNotFoundFromMissionCreateData,
  ErrorExamples,
} from "../../../common/errors/error.examples.js";
import { InvalidInputError } from "../../../common/errors/error.js";
import { authorizeUser } from "../../../common/middlewares/auth.middleware";

@Route("stores")
@Tags("Missions")
export class MissionController extends Controller {
  /**
   * 새로운 미션 생성
   * @summary 특정 가게에 새로운 미션을 생성
   */
  @Post("{storeId}/missions/write")
  @Middlewares(authorizeUser())
  @Response<ErrorResponse<InvalidStoreIdData>>(400, "유효하지 않은 가게 ID", ErrorExamples.InvalidStoreId)
  @Response<ErrorResponse<InvalidMissionNameData>>(400, "유효하지 않은 미션 이름", ErrorExamples.InvalidMissionName)
  @Response<ErrorResponse<InvalidMissionMinPayData>>(400, "유효하지 않은 최소 금액", ErrorExamples.InvalidMissionMinPay)
  @Response<ErrorResponse<InvalidMissionRewardData>>(400, "유효하지 않은 보상금", ErrorExamples.InvalidMissionReward)
  @Response<ErrorResponse<InvalidMissionDueData>>(400, "유효하지 않은 기한", ErrorExamples.InvalidMissionDue)
  @Response<ErrorResponse<AreaNotFoundFromMissionCreateData>>(404, "존재하지 않는 가게", ErrorExamples.AreaNotFoundFromMissionCreate)
  public async handleCreateMission(
    @Path() storeId: number,
    @Body() body: CreateMissionRequest,
  ): Promise<ApiResponse<CreateMissionResponse>> {
    if (!Number.isInteger(storeId) || storeId <= 0) {
      throw new InvalidInputError("storeId가 올바르지 않습니다.", { storeId });
    }

    const mission = await createMission(bodyToMission(storeId, body));
    return success(mission);
  }

  /**
   * 가게의 미션 목록 조회
   * @summary 특정 가게의 모든 미션을 조회합니다. 커서 기반 페이지네이션을 사용
   */
  @Get("{storeId}/missions")
  public async handleListStoreMissions(
    @Path() storeId: number,
    @Query() cursor?: number,
  ): Promise<ApiResponse<MissionListResponse>> {
    if (!Number.isInteger(storeId) || storeId <= 0) {
      throw new InvalidInputError("storeId가 올바르지 않습니다.", { storeId });
    }

    const parsedCursor = cursor || 0;
    const result = await listStoreMissions(storeId, parsedCursor);
    return success(result);
  }
}
