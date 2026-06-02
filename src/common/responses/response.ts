export interface ApiResponse<T> {
  resultType: "SUCCESS";
  error: null;
  data: T;
}
export const success = <T>(data: T): ApiResponse<T> => ({
  resultType: "SUCCESS",
  error: null,
  data,
});
export interface ErrorResponse<T> {
    resultType: "FAILED";
    error: {
        errorCode: string;
        statusCode: number;
        message: string;
        data: T;
    };
    data: null;
}
