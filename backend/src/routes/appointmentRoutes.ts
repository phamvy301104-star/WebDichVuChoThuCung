import { Router } from 'express';
import { appointmentController } from '../controllers/index';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Khach hang dat lich (co the co hoac khong co token)
router.post('/', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    authMiddleware(req as any, res, next);
  } else {
    next();
  }
}, appointmentController.create);

// Khach hang xem lich cua minh
router.get('/my', authMiddleware, appointmentController.getMine);

// Admin lay tat ca lich hen
router.get('/', authMiddleware, adminMiddleware, appointmentController.getAll);

// Admin lay chi tiet
router.get('/:id', authMiddleware, adminMiddleware, appointmentController.getById);

// Admin cap nhat trang thai
router.patch('/:id/status', authMiddleware, adminMiddleware, appointmentController.updateStatus);

// Admin phan cong nhan vien
router.patch('/:id/assign-staff', authMiddleware, adminMiddleware, appointmentController.assignStaff);

export default router;
