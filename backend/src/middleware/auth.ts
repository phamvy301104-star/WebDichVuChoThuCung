import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { UserPayload } from '../types/index';

export interface AuthRequest extends Request {
  user?: UserPayload; // ĐÃ SỬA: Bảo vệ Dev khỏi gõ sai tên thuộc tính của User nhờ Type-Safety
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Quyền truy cập bị từ chối. Không tìm thấy phiên đăng nhập.' });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as UserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.' });
  }
};

/**
 * Middleware tùy chọn: Không chặn khách vãng lai, nhưng nếu có tài khoản thì giải mã để lưu thông tin lịch sử
 */
export const optionalAuthMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return next(); // Khách vãng lai -> Cho qua
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as UserPayload;
    req.user = decoded; // Khách có tài khoản -> Ghi nhận danh tính
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Phiên đăng nhập lỗi, vui lòng đăng nhập lại.' });
  }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Hành động thất bại. Yêu cầu quyền Quản trị viên.' });
  }
  next();
};

export const staffMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'staff' && req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Hành động thất bại. Yêu cầu quyền Nhân viên hoặc Admin.' });
  }
  next();
};