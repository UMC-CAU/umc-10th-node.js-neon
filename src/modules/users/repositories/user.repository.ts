import { prisma } from "../../../db.config.js";

// 1. User 데이터 삽입
// User 데이터 삽입
export const addUser = async (data: any) => {
  // 1. 이미 존재하는 이메일인지 확인
  const user = await prisma.user.findFirst({ where: { email: data.email } });

  if (user) {
    return null;
  }

  // 2. 새로운 유저 생성
  const created = await prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      name: data.name,
      gender: data.gender,
      birth: data.birth,
      address: data.address,
      detailAddress: data.detailAddress,
      phoneNumber: data.phoneNumber,
    },
  });

  return created.id;
};

export const getUser = async (userId: number) => {
  return await prisma.user.findFirstOrThrow({ where: { id: userId } });
};

export const updateUser = async (
  userId: number,
  data: {
    name?: string;
    gender?: string;
    birth?: Date;
    address?: string;
    detailAddress?: string;
    phoneNumber?: string;
  },
) => {
  const updateData: Record<string, unknown> = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.gender !== undefined) updateData.gender = data.gender;
  if (data.birth !== undefined) updateData.birth = data.birth;
  if (data.address !== undefined) updateData.address = data.address;
  if (data.detailAddress !== undefined) updateData.detailAddress = data.detailAddress;
  if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber;

  return await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      gender: true,
      birth: true,
      address: true,
      detailAddress: true,
      phoneNumber: true,
    },
  });
};

// 음식 선호 카테고리 매핑
export const setPreference = async (userId: number, foodCategoryId: number) => {
  await prisma.userFavorCategory.create({
    data: {
      userId: userId,
      foodCategoryId: foodCategoryId,
    },
  });
};

export const clearPreferencesByUserId = async (userId: number) => {
  await prisma.userFavorCategory.deleteMany({
    where: { userId },
  });
};

// 사용자 선호 카테고리 반환 (JOIN)
export const getUserPreferencesByUserId = async (userId: number) => {
  return await prisma.userFavorCategory.findMany({
    where: { userId: userId },
    include: {
      foodCategory: true, // 💡 핵심: JOIN 대신 include를 써서 연관 데이터를 가져옵니다!
    },
    orderBy: { foodCategoryId: "asc" },
  });
};
