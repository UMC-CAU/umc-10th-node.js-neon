export interface UserSignUpRequest {
  email: string;
  password: string;
  name: string;
  gender: string;
  birth: string;
  address?: string; // ?가 붙으면 '없을 수도 있음(선택)'이라는 뜻
  detailAddress?: string;
  phoneNumber: string;
  preferences: number[];
}


export interface UserSignUpResponse {
  userId: number;
  preferences: string[];
}
