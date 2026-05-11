import { Body, Controller, Post, Route, Tags } from "tsoa";
import { UserSignUpRequest, UserSignUpResponse } from "../dtos/user.dto";
import { userSignUp } from "../services/user.service";

@Route("users") // 라우트 경로
@Tags("Users") // Swagger 태그
export class UserController extends Controller {
  @Post("signup") // 엔드포인드 정의
  public async handleUserSignUp(
    @Body() body: UserSignUpRequest,
  ): Promise<UserSignUpResponse> {
    console.log("회원가입을 요청했습니다!");
    console.log("body:", body);
    const user = await userSignUp(body); //서비스 로직 호출
    return user; //성공 응답 보내기
  }
}
