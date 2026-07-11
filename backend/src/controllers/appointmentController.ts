import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { appointmentService } from '../services/appointmentService';
import { generateResponse } from '../utils/helpers';

export const appointmentController = {
  // POST /api/appointments
  create: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // ĐA SỬA: Không truyền cả cái 'req' vào nữa. Chỉ trích xuất data sạch chuyển sang Service.
      const bookingData = {
        ...req.body,
        userId: req.user?._id // Khách vãng lai thì trường này sẽ undefined (Hợp lệ)
      };
      
      const booking = await appointmentService.create(bookingData);
      return res.status(201).json(generateResponse(true, 'Đặt lịch thành công!', booking));
    } catch (error) {
      next(error);
    }
  },

  // GET /api/appointments
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookings = await appointmentService.getAll(req.query);
      return res.json(generateResponse(true, 'Lấy danh sách tất cả lịch đặt thành công.', bookings));
    } catch (error) {
      next(error);
    }
  },

  // GET /api/appointments/my
  getMine: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // ĐA SỬA: Chỉ truyền ID của user đang đăng nhập sang tầng Service
      const userId = req.user._id;
      const bookings = await appointmentService.getMine(userId);
      return res.json(generateResponse(true, 'Lấy lịch sử đặt lịch cá nhân thành công.', bookings));
    } catch (error) {
      next(error);
    }
  },

  // GET /api/appointments/:id
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const booking = await appointmentService.getById(req.params.id);
      return res.json(generateResponse(true, 'Lấy thông tin chi tiết lịch hẹn thành công.', booking));
    } catch (error) {
      next(error);
    }
  },

  // ĐA THÊM: Sửa thông tin lịch hẹn (Khách hàng tự sửa)
  // PATCH /api/appointments/:id
  updateAppointment: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const booking = await appointmentService.updateAppointment(
        req.params.id,
        req.user._id, // Truyền userId để tầng Service check xem khách này có chính chủ không
        req.body
      );
      return res.json(generateResponse(true, 'Cập nhật thông tin lịch hẹn thành công.', booking));
    } catch (error) {
      next(error);
    }
  },

  // ĐA THÊM: Hủy lịch hẹn (Khách hàng tự hủy)
  // PATCH /api/appointments/:id/cancel
  cancelAppointment: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const booking = await appointmentService.cancelAppointment(
        req.params.id,
        req.user._id,
        req.body.reason // Lý do hủy lịch nếu có
      );
      return res.json(generateResponse(true, 'Hủy lịch hẹn thành công.', booking));
    } catch (error) {
      next(error);
    }
  },

  // ĐA THÊM: Đánh giá dịch vụ sau khi hoàn thành
  // POST /api/appointments/:id/review
  reviewAppointment: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const review = await appointmentService.reviewAppointment(
        req.params.id,
        req.user._id,
        req.body
      );
      return res.json(generateResponse(true, 'Gửi đánh giá lịch hẹn thành công.', review));
    } catch (error) {
      next(error);
    }
  },

  // PATCH /api/appointments/:id/status (Dành cho Admin và Staff nhân ca)
  updateStatus: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const booking = await appointmentService.updateStatus(
        req.params.id,
        req.body.status
      );
      return res.json(generateResponse(true, 'Cập nhật trạng thái lịch hẹn thành công.', booking));
    } catch (error) {
      next(error);
    }
  },

  // PATCH /api/appointments/:id/assign-staff (Dành cho Admin điều phối)
  assignStaff: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const booking = await appointmentService.assignStaff(
        req.params.id,
        req.body.staffId
      );
      return res.json(generateResponse(true, 'Phân công nhân viên thành công.', booking));
    } catch (error) {
      next(error);
    }
  },
};