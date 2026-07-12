import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById, cancelOrder, getAllOrders, updateOrderStatus } from '../controllers/orderController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

// Admin
router.get('/', adminMiddleware, getAllOrders);
router.put('/:id/status', adminMiddleware, updateOrderStatus);

export default router;
