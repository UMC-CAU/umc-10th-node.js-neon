import { prisma } from "../../../db.config.js";
import { StoreData } from "../dtos/create-store.dto.js";

const toBigInt = (value: number) => BigInt(value);
const toNumber = (value: bigint) => Number(value);

export const existsAreaById = async (area_id: number): Promise<boolean> => {
  const area = await prisma.area.findUnique({
    where: { id: toBigInt(area_id) },
    select: { id: true },
  });

  return area !== null;
};

export const addStore = async (data: StoreData): Promise<number> => {
  const store = await prisma.store.create({
    data: {
      categoryId: toBigInt(data.category_id),
      areaId: toBigInt(data.area_id),
      name: data.name,
    },
    select: { id: true },
  });

  return toNumber(store.id);
};

export const getStore = async (storeId: number): Promise<any | null> => {
  const store = await prisma.store.findUnique({
    where: { id: toBigInt(storeId) },
    select: {
      id: true,
      areaId: true,
      categoryId: true,
      name: true,
    },
  });

  if (!store) {
    return null;
  }

  return {
    id: toNumber(store.id),
    area_id: toNumber(store.areaId),
    category_id: toNumber(store.categoryId),
    name: store.name,
  };
};
