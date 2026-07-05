import { Router } from 'express';
import { brandController } from '../controllers/index';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', brandController.getBrands);
router.post('/', authMiddleware, adminMiddleware, brandController.createBrand);
router.put('/:id', authMiddleware, adminMiddleware, brandController.updateBrand);
router.delete('/:id', authMiddleware, adminMiddleware, brandController.deleteBrand);

export default router;
