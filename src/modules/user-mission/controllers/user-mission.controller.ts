import {
  Controller,
  Post,
  Get,
  Path,
  Query,
  Route,
  Tags,
  Body,
} from "tsoa";
import {
  ChallengeMissionRequest,
  ChallengeMissionResponse,
  ListUserMissionsResponse,
  CompleteMissionResponse,
} from "../dtos/challenge-mission.dto.js";
import {
  challengeMission,
  listUserMissions,
  finishMission,
} from "../services/user-mission.service.js";
import { ApiResponse, success } from "../../../common/responses/response";
import { InvalidInputError } from "../../../common/errors/error.js";

@Route("users/missions")
@Tags("User Missions")
export class UserMissionController extends Controller {
  /**
   * 미션 도전 시작
   */
  @Post("{missionId}/challenges")
  public async handleChallengeMission(
    @Path() missionId: number,
  ): Promise<ApiResponse<ChallengeMissionResponse>> {
    if (!Number.isInteger(missionId) || missionId <= 0) {
      throw new InvalidInputError("필수 입력값이 누락되었습니다.", { missionId });
    }

    const userId = 1;
    const challenged = await challengeMission(userId, missionId);
    return success(challenged);
  }

  /**
   * 사용자 미션 목록 조회
   */
  @Get()
  public async handleListUserMissions(
    @Query() cursor?: number,
    @Query() status?: string,
  ): Promise<ApiResponse<ListUserMissionsResponse>> {
    const userId = 1;
    const parsedCursor = cursor || 0;

    let parsedStatus: boolean | null | undefined = undefined;
    if (status === "ongoing") parsedStatus = false;
    else if (status === "completed") parsedStatus = true;
    else if (status === "true") parsedStatus = true;
    else if (status === "false") parsedStatus = false;

    const result = await listUserMissions(userId, parsedCursor, parsedStatus);
    return success(result);
  }

  /**
   * 미션 완료 처리
   */
  @Post("{missionId}/success")
  public async handleCompleteMission(
    @Path() missionId: number,
  ): Promise<ApiResponse<CompleteMissionResponse>> {
    if (!Number.isInteger(missionId) || missionId <= 0) {
      throw new InvalidInputError("필수 입력값이 누락되었습니다.", { missionId });
    }

    const userId = 1;
    const completed = await finishMission(userId, missionId);
    return success(completed);
  }
}
