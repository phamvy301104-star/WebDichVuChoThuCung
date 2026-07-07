import { Router } from 'express';
import { serviceController } from '../controllers/index';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getServiceById);

// Admin CRUD
router.post('/', authMiddleware, adminMiddleware, serviceController.createService);
router.put('/:id', authMiddleware, adminMiddleware, serviceController.updateService);
router.patch('/:id', authMiddleware, adminMiddleware, serviceController.updateService);
router.delete('/:id', authMiddleware, adminMiddleware, serviceController.deleteService);


export default router;


