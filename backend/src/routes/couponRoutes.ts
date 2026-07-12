import { Router } from 'express';
import { validateCoupon, getAvailableCoupons, getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from '../controllers/couponController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

router.get('/available', authMiddleware, getAvailableCoupons);
router.post('/validate', authMiddleware, validateCoupon);

// Admin
router.get('/', authMiddleware, adminMiddleware, getAllCoupons);
router.post('/', authMiddleware, adminMiddleware, createCoupon);
router.put('/:id', authMiddleware, adminMiddleware, updateCoupon);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCoupon);

export default router;
