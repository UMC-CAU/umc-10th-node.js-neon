import dotenv from "dotenv";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import jwt from "jsonwebtoken";
import { prisma } from "./db.config.js"; // Prisma 설정 파일 경로 확인 필요

dotenv.config();

// 1. JWT 토큰 생성 함수 (타입 지정)
export const generateAccessToken = (user: { id: bigint; email: string }) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
};

export const generateRefreshToken = (user: { id: bigint }) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "14d" }
  );
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!) as { id: bigint | number };
};

export const reissueAccessToken = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);
  const user = await prisma.user.findFirst({
    where: { id: BigInt(payload.id) },
    select: { id: true, email: true },
  });

  if (!user) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  return generateAccessToken(user);
};

// 2. Google Verify 로직 
const googleVerify = async (profile: Profile) => {
  const email = profile.emails?.[0]?.value;
  if (!email) throw new Error("Google 프로필에 이메일이 없습니다.");

  let user = await prisma.user.findFirst({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: profile.displayName,
        gender: "none", // Google 프로필에서 성별 정보가 없는 경우 기본값 설정
        birth: new Date(1970, 0, 1),
        address: "추후 수정",
        detailAddress: "추후 수정",
        phoneNumber: "추후 수정",
        password: "google_oauth_user", // Google OAuth 사용자에게는 임의의 패스워드 설정
      },
    });
  }

  return { id: user.id, email: user.email, name: user.name };
};

// 3. Google Strategy
export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID!,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET!,
    callbackURL: "/oauth2/callback/google",
    scope: ["email", "profile"],
  },
  async (_accessToken, _refreshToken, profile, cb) => {
    try {
      const user = await googleVerify(profile);
      const tokens = {
        ...user,
        accessToken: generateAccessToken(user),
        refreshToken: generateRefreshToken(user),
      };
      return cb(null, tokens);
    } catch (err) {
      return cb(err as Error);
    }
  }
);
export const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET!,
  },
  async (payload, done) => {
    try {
      const user = await prisma.user.findFirst({ where: { id: payload.id } });
      return user ? done(null, user) : done(null, false);
    } catch (err) {
      return done(err, false);
    }
  }
);