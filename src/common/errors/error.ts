import { AppError } from "./app.error.js";

export class DuplicateUserEmailError extends AppError {
  constructor(message: string, data?: unknown) {
    super({
      errorCode: "U001",
      statusCode: 409,
      message,
      data,
    });
  }
}

export class InvalidInputError extends AppError {
  constructor(message: string, data?: unknown) {
    super({
      errorCode: "E4001",
      statusCode: 400,
      message,
      data,
    });
  }
}

export class AlreadyChallensingMissionError extends AppError {
  constructor(message: string, data?: unknown) {
    super({
      errorCode: "M002",
      statusCode: 409,
      message,
      data,
    });
  }
}

export class MissionNotInProgressError extends AppError {
  constructor(message: string, data?: unknown) {
    super({
      errorCode: "M003",
      statusCode: 400,
      message,
      data,
    });
  }
}

export class MissionNotFoundError extends AppError {
  constructor(message: string, data?: unknown) {
    super({
      errorCode: "M004",
      statusCode: 404,
      message,
      data,
    });
  }
}

export class AreaNotFoundError extends AppError {
  constructor(message: string, data?: unknown) {
    super({
      errorCode: "S001",
      statusCode: 404,
      message,
      data,
    });
  }
}

export class StoreNotFoundError extends AppError {
  constructor(message: string, data?: unknown) {
    super({
      errorCode: "S002",
      statusCode: 404,
      message,
      data,
    });
  }
}
