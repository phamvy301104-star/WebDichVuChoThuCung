import { Router } from 'express';
import { orderController } from '../controllers/index';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

router.get('/my-orders', authMiddleware, orderController.getMyOrders);
router.get('/', authMiddleware, adminMiddleware, orderController.getAllOrders);
router.post('/', authMiddleware, orderController.createOrder);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.put('/:id', authMiddleware, orderController.updateOrder);
router.put('/:id/cancel', authMiddleware, orderController.cancelOrder);

export default router;
