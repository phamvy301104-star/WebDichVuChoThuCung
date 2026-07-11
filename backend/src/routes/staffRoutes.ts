import { Router } from 'express';
import { staffController } from '../controllers/index';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// ==================== PUBLIC / AUTH ROUTES ====================
router.get('/', staffController.getAll);
router.get('/:id', staffController.getById);

// ==================== ADMIN ROUTES ====================
router.post('/', authMiddleware, adminMiddleware, staffController.create);
router.patch('/:id', authMiddleware, adminMiddleware, staffController.update); // Giữ duy nhất PATCH để update một phần
router.delete('/:id', authMiddleware, adminMiddleware, staffController.remove);

export default router;