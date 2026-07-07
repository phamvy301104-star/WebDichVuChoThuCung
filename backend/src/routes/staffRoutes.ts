import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import { staffController } from '../controllers/staffController';

const router = Router();

// Danh sách / tìm kiếm
router.get('/', staffController.getAll);
router.get('/:id', staffController.getById);

// Admin CRUD
router.post('/', authMiddleware, adminMiddleware, staffController.create);
router.patch('/:id', authMiddleware, adminMiddleware, staffController.update);
router.put('/:id', authMiddleware, adminMiddleware, staffController.update);
router.delete('/:id', authMiddleware, adminMiddleware, staffController.remove);

export default router;

