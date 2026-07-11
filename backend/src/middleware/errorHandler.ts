import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/index';

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('💥 [HỆ THỐNG GHI NHẬN LỖI]:', err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Lỗi hệ thống nội bộ, vui lòng thử lại sau.';

  // ========================================================
  // BẮT CÁC LỖI ĐẶC THÙ TỪ TẦNG CƠ SỞ DỮ LIỆU (MONGOOSE ERRORS)
  // ========================================================

  // 1. Lỗi truyền sai cấu trúc ObjectId (Khách hàng truyền ID không đúng format của Mongo)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Dữ liệu ID định dạng sai tại trường dữ liệu: [${err.path}]`;
  }

  // 2. Lỗi vi phạm dữ liệu Schema (Ví dụ: Thiếu trường bắt buộc, sai định dạng Regex)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errorsList = Object.values(err.errors || {}).map((e: any) => e.message);
    message = errorsList.join(' | ') || 'Dữ liệu đầu vào vi phạm cấu trúc hệ thống.';
  }

  // 3. Lỗi trùng lặp thuộc tính Unique (Ví dụ: Tạo trùng Email nhân viên)
  if (err.code === 11000) {
    statusCode = 400;
    const duplicatedField = Object.keys(err.keyValue || {})[0];
    message = `Trường thông tin [${duplicatedField}] đã tồn tại trên hệ thống, không được tạo trùng lặp.`;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Đường dẫn API không tồn tại trên hệ thống - ${req.originalUrl}`);
  res.status(404);
  next(error);
};