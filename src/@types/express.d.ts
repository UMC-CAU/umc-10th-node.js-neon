import { Response } from 'express';

declare global {
  namespace Express {
    interface User {
      id: bigint | number;
      email?: string;
      name?: string;
      accessToken?: string;
      refreshToken?: string;
    }

    interface Response {
      error(params: {
        errorCode?: string | number | null;
        message?: string | null;
        data?: any;
      }): this;
      success(params: {
        message?: string | null;
        data?: any;
      }): this;
    }
  }
}