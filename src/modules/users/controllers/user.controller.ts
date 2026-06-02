import {
  Body,
  Controller,
  Get,
  Middlewares,
  Post,
  Request,
  Route,
  Response,
  Tags,
} from "tsoa";
import { UserSignUpRequest, UserSignUpResponse, UserUpdateRequest, UserUpdateResponse } from "../dtos/user.dto";
import { updateMyUser, userSignUp } from "../services/user.service";
import { ApiResponse, success, ErrorResponse } from "../../../common/responses/response";
import { authorizeUser } from "../../../common/middlewares/auth.middleware";
import { Request as ExpressRequest } from "express";
// express에서 온 Response는 'ExpressResponse'로 부르겠다고 약속!
import { Response as ExpressResponse } from "express";
import { InvalidInputError } from "../../../common/errors/error.js";
import { DuplicateUserEmailData, InvalidSignUpRequestData } from "../../../common/errors/error.examples";
@Route("users") // 라우트 경로
@Tags("Users") // Swagger 태그
export class UserController extends Controller {

  /**
   * 회원가입 API
   * @summary 회원가입을 처리하는 엔드포인트
   */
  @Post("signup")
  @Response<ErrorResponse<DuplicateUserEmailData>>(409, "이미 존재하는 이메일", {
    resultType: "FAILED",
    error: {
      errorCode: "U001",
      statusCode: 409,
      message: "이미 존재하는 이메일입니다.",
      data: { email: "user@example.com" },
    },
    data: null,
  })
  @Response<ErrorResponse<InvalidSignUpRequestData>>(400, "잘못된 입력", {
    resultType: "FAILED",
    error: {
      errorCode: "E4001",
      statusCode: 400,
      message: "잘못된 입력값입니다.",
      data: { field: "email", reason: "올바른 이메일 형식이 아닙니다." },
    },
    data: null,
  })
  public async handleUserSignUp(
    @Body() body: UserSignUpRequest,
  ): Promise<ApiResponse<UserSignUpResponse>> {
    const user = await userSignUp(body);
    return success(user);
  }

  /**
   * 내 정보 수정 API
   * @summary 로그인한 사용자의 정보를 수정합니다.
   */
  @Post("me")
  @Middlewares(authorizeUser())
  public async handleUpdateMyUser(
    @Request() req: ExpressRequest,
    @Body() body: UserUpdateRequest,
  ): Promise<ApiResponse<UserUpdateResponse>> {
    const userId = req.user?.id;

    if (userId === undefined || userId === null) {
      throw new InvalidInputError("로그인이 필요합니다.");
    }

    const updated = await updateMyUser(Number(userId), body);
    return success(updated);
  }





  @Get("guest")
  public async handleGuestPage(): Promise<ApiResponse<string>> {
    return success(`
            <h1>게스트 페이지</h1>
            <p>이 페이지는 로그인이 필요 없습니다.</p>
            <ul>
                <li><a href="/api/v1/users/mypage">마이페이지 (로그인 필요)</a></li>
            </ul>
        `);
  }
  @Get("login")
  public async handleLoginPage(): Promise<ApiResponse<string>> {
    return success("<h1>로그인 페이지</h1><p>로그인이 필요한 페이지에서 튕겨나오면 여기로 옵니다.</p>");
  }
  @Get("mypage")
  @Middlewares(authorizeUser())
  public async handleMypage(@Request() req: ExpressRequest): Promise<ApiResponse<string>> {
    const userName = req.user?.name ?? req.user?.email ?? "사용자";

    return success(`
            <h1>마이페이지</h1>
            <p>환영합니다, ${userName}님!</p>
            <p>이 페이지는 로그인한 사람만 볼 수 있습니다.</p>
        `);
  }
  @Get("set-login")
  @Middlewares(authorizeUser())
  public async handleSetLogin(@Request() req: ExpressRequest): Promise<ApiResponse<string>> {
    const userName = req.user?.name ?? req.user?.email ?? "사용자";

    req.res!.cookie("username", userName, { maxAge: 3600000 });
    return success(`로그인 쿠키(username=${userName}) 생성 완료! <a href="/api/v1/users/mypage">마이페이지로 이동</a>`);
  }
  @Get("set-logout")
  public async handleSetLogout(
    @Request() req: ExpressRequest,
  ): Promise<ApiResponse<string>> {
    req.res!.clearCookie("username");
    return success('로그아웃 완료 (쿠키 삭제). <a href="/api/v1/users/guest">메인으로</a>');
  }
}
