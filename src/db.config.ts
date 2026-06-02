import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in the environment.");
}

const adapter = new PrismaMariaDb(databaseUrl);

export const prisma = new PrismaClient({
  adapter,
  log: ["query", "info", "error", "warn"], // 쿼리 로그, 에러 로그, 경고 로그를 모두 출력하도록 설정
});
