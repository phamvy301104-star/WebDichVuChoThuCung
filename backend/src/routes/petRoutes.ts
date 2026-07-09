import { Router } from 'express';
import { petController } from '../controllers/index';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/for-sale', petController.getPetsForSale);
router.get('/for-adoption', petController.getPetsForAdoption);

// Protected routes (static paths first)
router.get('/my-pets', authMiddleware, petController.getMyPets);
router.get('/adoption-requests', authMiddleware, petController.getAllAdoptionRequests);
router.put('/adoption-requests/:id', authMiddleware, petController.updateAdoptionRequestStatus);

// ID-based routes next
router.get('/:id', petController.getPetById);
router.get('/', authMiddleware, petController.getAllPets);
router.post('/', authMiddleware, petController.createPet);
router.put('/:id', authMiddleware, petController.updatePet);
router.delete('/:id', authMiddleware, petController.deletePet);
router.post('/:id/adoption-request', authMiddleware, petController.createAdoptionRequest);

export default router;
