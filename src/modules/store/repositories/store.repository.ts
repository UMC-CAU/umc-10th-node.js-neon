import { prisma } from "../../../db.config.js";
import { StoreData } from "../dtos/create-store.dto.js";

const toBigInt = (value: number) => BigInt(value);
const toNumber = (value: bigint) => Number(value);

export const existsAreaById = async (areaId: number): Promise<boolean> => {
  const area = await prisma.area.findUnique({
    where: { id: toBigInt(areaId) },
    select: { id: true },
  });

  return area !== null;
};

export const addStore = async (data: StoreData): Promise<number> => {
  const store = await prisma.store.create({
    data: {
      categoryId: toBigInt(data.categoryId),
      areaId: toBigInt(data.areaId),
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
    storeId: toNumber(store.id),
    areaId: toNumber(store.areaId),
    categoryId: toNumber(store.categoryId),
    name: store.name,
  };
};
