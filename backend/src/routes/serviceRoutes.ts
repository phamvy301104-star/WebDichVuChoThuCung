import { Router } from 'express';
import { serviceController } from '../controllers/index';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// ==================== PUBLIC ROUTES ====================
router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getServiceById);

// ==================== ADMIN ROUTES ====================
router.post('/', authMiddleware, adminMiddleware, serviceController.createService);
router.patch('/:id', authMiddleware, adminMiddleware, serviceController.updateService); // Chuẩn hóa dùng PATCH
router.delete('/:id', authMiddleware, adminMiddleware, serviceController.deleteService);

export default router;