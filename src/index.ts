import dotenv from "dotenv";
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { AppError } from "./common/errors/app.error";
import { handleCreateStore } from "./modules/store/controllers/store.controller.js";
import { handleCreateReview, handleListStoreReviews, handleListUserReviews} from "./modules/review/controllers/review.controller.js";
import { handleCreateMission, handleListStoreMissions } from "./modules/mission/controllers/mission.controller.js";
import { RegisterRoutes } from "./generated/routes";

// BigInt를 JSON으로 변환할 때 문자열로 처리하도록 설정
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
// 1. 환경 변수 설정
dotenv.config();

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
  next();
});

// 2. 미들웨어 설정
app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함(JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
app.use(cookieParser()); 
// Express.js에 생성한 엔드 포인트들을 register
const router = express.Router();
RegisterRoutes(router); 
app.use("/api/v1", router);
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
// 3. 기본 라우트
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World! This is TypeScript Server!");
});

// app.post("/api/v1/areas/:areaId/stores", handleCreateStore);
// app.post("/api/v1/stores/:storeId/review/write", handleCreateReview);
// app.post("/api/v1/stores/:storeId/missions/write", handleCreateMission);
// app.post(
//   "/api/v1/users/missions/:missionId/challenges",
//   handleChallengeMission,
// );
// app.post(
//   "/api/v1/users/missions/:missionId/success",
//   handleCompleteMission,
// );

// app.get("/api/v1/stores/:storeId/review", handleListStoreReviews);
// app.get("/api/v1/users/review", handleListUserReviews);
// app.get("/api/v1/stores/:storeId/missions", handleListStoreMissions);
// app.get("/api/v1/users/missions", handleListUserMissions);

// 4. 서버 시작
app.listen(port, () => {
  console.log(`[server]: Server is running at <http://localhost>:${port}`);
});
