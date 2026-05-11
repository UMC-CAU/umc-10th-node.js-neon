import { CreateStoreResponse, StoreData } from "../dtos/create-store.dto.js";
import {
  addStore,
  existsAreaById,
} from "../repositories/store.repository.js";
import { InvalidInputError, AreaNotFoundError } from "../../../common/errors/error.js";

export const createStore = async (
  areaId: number,
  data: Omit<StoreData, "areaId">,
): Promise<CreateStoreResponse> => {
  // 유효성 검사
  if (!data.categoryId || data.categoryId <= 0) {
    throw new InvalidInputError("카테고리 ID는 1 이상의 정수여야 합니다.", {
      categoryId: data.categoryId,
    });
  }

  if (!data.name || data.name.trim().length === 0 || data.name.trim().length > 20) {
    throw new InvalidInputError("가게 이름은 1자 이상 20자 이하여야 합니다.", {
      name: data.name,
    });
  }

  // 지역 존재 여부 확인
  const isAreaExists = await existsAreaById(areaId);
  if (!isAreaExists) {
    throw new AreaNotFoundError("존재하지 않는 지역입니다.", { areaId });
  }

  // 저장
  const storeId = await addStore({
    areaId,
    categoryId: data.categoryId,
    name: data.name.trim(),
  });

  return {
    storeId,
    areaId,
    categoryId: data.categoryId,
    name: data.name.trim(),
  };
};
