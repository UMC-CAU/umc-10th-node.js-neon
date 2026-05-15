import { Controller, Post, Get, Path, Query, Route, Tags, Body } from "tsoa";
import {
  bodyToMission,
  CreateMissionRequest,
  CreateMissionResponse,
  MissionListResponse,
} from "../dtos/create-mission.dto.js";
import { createMission, listStoreMissions } from "../services/mission.service.js";
import { ApiResponse, success } from "../../../common/responses/response.js";
import { InvalidInputError } from "../../../common/errors/error.js";

@Route("stores")
@Tags("Missions")
export class MissionController extends Controller {
  @Post("{storeId}/missions/write")
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
