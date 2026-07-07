import { Router } from 'express';
import { categoryController } from '../controllers/index';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', categoryController.getCategories);
router.post('/', authMiddleware, adminMiddleware, categoryController.createCategory);
router.put('/:id', authMiddleware, adminMiddleware, categoryController.updateCategory);
router.delete('/:id', authMiddleware, adminMiddleware, categoryController.deleteCategory);

export default router;
