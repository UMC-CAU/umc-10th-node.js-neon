import { UserSignUpRequest, UserSignUpResponse } from "../dtos/user.dto.js"; //인터페이스 가져오기
import { hash } from "bcryptjs";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
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
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.",data);
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
