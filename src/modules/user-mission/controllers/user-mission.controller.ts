import {
  Controller,
  Post,
  Get,
  Path,
  Query,
  Route,
  Tags,
  Body,
  Response,
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
import { ApiResponse, success, ErrorResponse } from "../../../common/responses/response";
import { InvalidInputError } from "../../../common/errors/error.js";
import {
  MissingMissionIdData,
  MissionNotFoundData,
  AlreadyChallengingMissionData,
  MissionNotInProgressData,
  ErrorExamples,
} from "../../../common/errors/error.examples.js";

@Route("users/missions")
@Tags("User Missions")
export class UserMissionController extends Controller {
  /**
   * 미션 도전 시작
   * @summary 사용자가 특정 미션에 도전을 시작
   */
  @Post("{missionId}/challenges")
  @Response<ErrorResponse<MissingMissionIdData>>(400, "필수 입력값 누락", {
    resultType: "FAILED",
    error: {
      errorCode: "E4001",
      statusCode: 400,
      message: "필수 입력값이 누락되었습니다.",
      data: { missionId: 0 },
    },
    data: null,
  })
  @Response<ErrorResponse<MissionNotFoundData>>(404, "미션을 찾을 수 없음", ErrorExamples.MissionNotFound)
  @Response<ErrorResponse<AlreadyChallengingMissionData>>(409, "이미 도전 중인 미션", ErrorExamples.AlreadyChallengingMission)
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
   * @summary 로그인한 사용자의 진행 중 또는 완료된 미션 목록을 조회
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
   * @summary 진행 중인 미션을 완료 처리
   */
  @Post("{missionId}/success")
  @Response<ErrorResponse<MissingMissionIdData>>(400, "필수 입력값 누락", {
    resultType: "FAILED",
    error: {
      errorCode: "E4001",
      statusCode: 400,
      message: "필수 입력값이 누락되었습니다.",
      data: { missionId: 0 },
    },
    data: null,
  })
  @Response<ErrorResponse<MissionNotInProgressData>>(400, "진행 중인 미션 아님", ErrorExamples.MissionNotInProgress)
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
