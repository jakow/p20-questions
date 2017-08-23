
export default class ApiError extends Error {
  constructor(message: string, public code?: ErrorCode) {
    super(message);
  }
}

export enum ErrorCode {
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  INTERNAL_SERVER_ERROR = 500,
}