import {
  Controller,
  Post,
  Path,
  Body,
  Route,
  Tags,
  Response,
} from "tsoa";
import {
  CreateStoreRequest,
  CreateStoreResponse,
} from "../dtos/create-store.dto.js";
import { createStore } from "../services/store.service.js";
import { ApiResponse, success, ErrorResponse } from "../../../common/responses/response";
import {
  InvalidCategoryIdData,
  InvalidStoreNameData,
  AreaNotFoundFromStoreCreateData,
  ErrorExamples,
} from "../../../common/errors/error.examples.js";

@Route("areas")
@Tags("Stores")
export class StoreController extends Controller {
  /**
   * 새로운 가게 생성
   * @summary 특정 지역에 새로운 가게를 생성
   */
  @Post("{areaId}/stores")
  @Response<ErrorResponse<InvalidCategoryIdData>>(400, "유효하지 않은 카테고리 ID", ErrorExamples.InvalidCategoryId)
  @Response<ErrorResponse<InvalidStoreNameData>>(400, "유효하지 않은 가게 이름", ErrorExamples.InvalidStoreName)
  @Response<ErrorResponse<AreaNotFoundFromStoreCreateData>>(404, "지역을 찾을 수 없음", ErrorExamples.AreaNotFoundFromStoreCreate)
  public async handleCreateStore(
    @Path() areaId: number,
    @Body() body: CreateStoreRequest,
  ): Promise<ApiResponse<CreateStoreResponse>> {
    const store = await createStore(areaId, {
      categoryId: body.categoryId,
      name: body.name,
    });
    return success(store);
  }
}
