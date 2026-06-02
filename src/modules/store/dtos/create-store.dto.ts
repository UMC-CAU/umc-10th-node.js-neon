export interface CreateStoreRequest {
  categoryId: number;
  name: string;
}

export interface CreateStoreResponse {
  storeId: number;
  areaId: number;
  categoryId: number;
  name: string;
}

export interface StoreData {
  areaId: number;
  categoryId: number;
  name: string;
}
