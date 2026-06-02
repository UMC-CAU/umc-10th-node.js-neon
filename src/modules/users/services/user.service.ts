import { UserSignUpRequest, UserSignUpResponse, UserUpdateRequest, UserUpdateResponse } from "../dtos/user.dto.js"; //인터페이스 가져오기
import { hash } from "bcryptjs";
import {
  addUser,
  clearPreferencesByUserId,
  getUser,
  getUserPreferencesByUserId,
  updateUser,
  setPreference,
} from "../repositories/user.repository.js";
import { DuplicateUserEmailError } from "../../../common/errors/error.js";

export const userSignUp = async (data: UserSignUpRequest): Promise<UserSignUpResponse> => {
  const hashedPassword = await hash(data.password, 10);

  const joinUserId = await addUser({
    email: data.email,
    password: hashedPassword,
    name: data.name,
    gender: data.gender,
    birth: new Date(data.birth), // 문자열을 Date 객체로 변환해서 넘겨줍니다.
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
  });

  if (joinUserId === null) {
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", { email: data.email });
  }

  for (const preference of data.preferences) {
    await setPreference(Number(joinUserId), preference);
  }

  const user = await getUser(Number(joinUserId));
  const userId = user!.id;
  const preferences = (await getUserPreferencesByUserId(Number(joinUserId))).map(
    (preference) => preference.foodCategory.name,
  );

  return {
    userId: Number(userId),
    preferences,
  };
};

export const updateMyUser = async (
  userId: number,
  data: UserUpdateRequest,
): Promise<UserUpdateResponse> => {
  await getUser(userId);

  const updatedUser = await updateUser(userId, {
    name: data.name,
    gender: data.gender,
    birth: data.birth ? new Date(data.birth) : undefined,
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
  });

  if (data.preferences !== undefined) {
    await clearPreferencesByUserId(userId);

    for (const preference of data.preferences) {
      await setPreference(userId, preference);
    }
  }

  const preferences = (await getUserPreferencesByUserId(userId)).map(
    (preference) => preference.foodCategory.name,
  );

  return {
    userId: Number(updatedUser.id),
    email: updatedUser.email,
    name: updatedUser.name,
    gender: updatedUser.gender,
    birth: updatedUser.birth.toISOString(),
    address: updatedUser.address,
    detailAddress: updatedUser.detailAddress,
    phoneNumber: updatedUser.phoneNumber,
    preferences,
  };
};
