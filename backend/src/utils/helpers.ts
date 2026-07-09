import { ApiResponse, AppError } from '../types/index';

/**
 * Tạo cấu trúc Response chuẩn hóa bằng Generic Type
 */
export const generateResponse = <T>(success: boolean, message: string, data?: T): ApiResponse<T> => {
  return {
    success,
    message,
    ...(data !== undefined && { data }),
  };
};

/**
 * Tạo nhanh một Error có gắn kèm HTTP Status Code
 */
export const generateError = (message: string, statusCode: number = 400): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  return error;
};