import dotenv from "dotenv";
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import morgan from "morgan";
import { AppError } from "./common/errors/app.error";
import { RegisterRoutes } from "./generated/routes";
import swaggerUi from "swagger-ui-express";
import path from "path";
import fs from "fs";
import passport from "passport";
import { googleStrategy, jwtStrategy  } from "./auth.config.js";
import { prisma } from "./db.config.js";
import { success as apiSuccess } from "./common/responses/response";

// BigInt를 JSON으로 변환할 때 문자열로 처리하도록 설정
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
// 1. 환경 변수 설정
dotenv.config();
passport.use(googleStrategy);
passport.use(jwtStrategy); 

const app: Express = express();
const port = process.env.PORT || 3000;
app.use((req: Request, res: Response, next: NextFunction) => {
  res.error = function ({ errorCode = null, message = null, data = null }) {
    return this.json({
      resultType: "FAILED",
      error: { errorCode, statusCode: this.statusCode, message, data },
      data: null,
    });
  };
  res.success = function ({ message = null, data = null }) {
    return this.json({
      resultType: "SUCCESS",
      error: null,
      data: { message, data },
    });
  };
  next();
});

// 2. 미들웨어 설정
app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함(JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
app.use(cookieParser()); 
app.use(morgan("dev")); // HTTP 요청 로깅 미들웨어
app.use(passport.initialize());


// Express.js에 생성한 엔드 포인트들을 register
const router = express.Router();
RegisterRoutes(router); 
app.use("/api/v1", router);

app.get("/oauth2/login/google", passport.authenticate("google", { session: false }));
app.get("/oauth2/callback/google", 
  passport.authenticate("google", { session: false, failureRedirect: "/login-failed" }),
  (req, res) => {
    return res.status(200).json(apiSuccess(req.user));
  }
);

const isLogin = passport.authenticate('jwt', { session: false });

app.get('/mypage', isLogin, (req, res) => {
  const user = req.user as any;
  res.status(200).success({
    message: `인증 성공! ${user.name}님의 마이페이지입니다.`,
    data: user,
  });
});

// TSOA가 생성한 swagger.json 읽어오기
const swaggerFile = JSON.parse(
  fs.readFileSync(path.resolve("dist/swagger.json"), "utf8")
);

// Swagger UI 연결
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    message: err.message || null,
    data: err.data || null,
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at <http://localhost>:${port}`);
});

