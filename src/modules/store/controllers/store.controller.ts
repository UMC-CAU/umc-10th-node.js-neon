import {
  Controller,
  Post,
  Path,
  Body,
  Route,
  Tags,
} from "tsoa";
import {
  CreateStoreRequest,
  CreateStoreResponse,
} from "../dtos/create-store.dto.js";
import { createStore } from "../services/store.service.js";
import { ApiResponse, success } from "../../../common/responses/response";

@Route("areas")
@Tags("Stores")
export class StoreController extends Controller {
  /**
   * 새로운 가게 생성
   */
  @Post("{areaId}/stores")
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
