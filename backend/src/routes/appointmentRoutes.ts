import { Router } from 'express';
import { appointmentController } from '../controllers/index';
import { authMiddleware, adminMiddleware, staffMiddleware, optionalAuthMiddleware } from '../middleware/auth';

const router = Router();

// ==================== CUSTOMER / GUEST ROUTES ====================
// Khách hàng đặt lịch (Áp dụng optional auth: có tài khoản thì ghi nhận, không có thì lưu dạng vãng lai)
router.post('/', optionalAuthMiddleware, appointmentController.create);

// Khách hàng xem lịch sử đặt lịch của chính mình
router.get('/my', authMiddleware, appointmentController.getMine);

// Khách hàng tự sửa hoặc hủy lịch của mình
router.patch('/:id', authMiddleware, appointmentController.updateAppointment);
router.patch('/:id/cancel', authMiddleware, appointmentController.cancelAppointment);
router.post('/:id/review', authMiddleware, appointmentController.reviewAppointment);


// ==================== STAFF ROUTES (NHÂN VIÊN) ====================
// ĐÃ THÊM: Cho phép cả Staff và Admin cập nhật trạng thái lịch (Ví dụ: Staff chuyển sang 'in_progress' khi làm việc)
router.patch('/:id/status', authMiddleware, staffMiddleware, appointmentController.updateStatus);


// ==================== ADMIN ONLY ROUTES ====================
// Admin lấy tất cả lịch hẹn toàn hệ thống
router.get('/', authMiddleware, adminMiddleware, appointmentController.getAll);

// Admin lấy chi tiết 1 lịch hẹn bất kỳ
router.get('/:id', authMiddleware, adminMiddleware, appointmentController.getById);

// Admin điều phối, phân công nhân viên cho lịch hẹn
router.patch('/:id/assign-staff', authMiddleware, adminMiddleware, appointmentController.assignStaff);

export default router;