import { Router } from 'express';
import { productController } from '../controllers/index';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', authMiddleware, adminMiddleware, productController.createProduct);
router.put('/:id', authMiddleware, adminMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct);

export default router;
