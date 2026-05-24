import { Response } from 'express';

declare global {
  namespace Express {
    interface Response {
      error(params: {
        errorCode?: string | number | null;
        message?: string | null;
        data?: any;
      }): this;
    }
  }
}