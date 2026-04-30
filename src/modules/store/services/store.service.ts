import { responseFromStore, StoreData } from "../dtos/create-store.dto.js";
import {
  addStore,
  existsAreaById,
  getStore,
} from "../repositories/store.repository.js";

export const createStore = async (data: StoreData) => {
  console.log("createStore service called with data:", data);
  const isAreaExists = await existsAreaById(data.area_id);

  if (!isAreaExists) {
    throw new Error("존재하지 않는 지역입니다.");
  }

  const storeId = await addStore(data);
  const store = await getStore(storeId);

  return responseFromStore({
    storeId,
    store: store ?? {
      area_id: data.area_id,
      category_id: data.category_id,
      name: data.name,
    },
  });
};
