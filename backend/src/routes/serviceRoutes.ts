import { Router } from 'express';
import { serviceController } from '../controllers/index';

const router = Router();

router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getServiceById);

export default router;
