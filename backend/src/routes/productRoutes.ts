import { Router } from 'express';
import { productController } from '../controllers/index';

const router = Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

export default router;
