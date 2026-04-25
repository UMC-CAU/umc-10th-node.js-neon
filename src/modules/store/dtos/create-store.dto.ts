export interface CreateStoreRequest {
  category_id: number;
  name: string;
}

export interface StoreData {
  area_id: number;
  category_id: number;
  name: string;
}

export interface CreateStoreResponse {
  storeId: number;
  area_id: number;
  category_id: number;
  name: string;
}

export const bodyToStore = (
  areaId: number,
  body: CreateStoreRequest,
): StoreData => {
  return {
    area_id: areaId,
    category_id: body.category_id,
    name: body.name.trim(),
  };
};

export const responseFromStore = (data: {
  storeId: number;
  store: any;
}): CreateStoreResponse => {
  return {
    storeId: data.storeId,
    area_id: data.store.area_id,
    category_id: data.store.category_id,
    name: data.store.name,
  };
};
