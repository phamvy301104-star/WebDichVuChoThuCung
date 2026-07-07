import { Router } from 'express';
import { petController } from '../controllers/index';

const router = Router();

router.get('/for-sale', petController.getPetsForSale);
router.get('/for-adoption', petController.getPetsForAdoption);
router.get('/:id', petController.getPetById);

export default router;
