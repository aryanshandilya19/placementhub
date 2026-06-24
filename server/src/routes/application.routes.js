import { Router } from 'express';
import {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
  addRound,
  getStats,
} from '../controllers/application.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createApplicationSchema,
  updateApplicationSchema,
  addRoundSchema,
} from '../validators/application.validator.js';

const router = Router();

router.use(protect);

router.get('/stats', getStats);
router.get('/', getApplications);
router.post('/', validate(createApplicationSchema), createApplication);
router.get('/:id', getApplication);
router.patch('/:id', validate(updateApplicationSchema), updateApplication);
router.delete('/:id', deleteApplication);
router.post('/:id/rounds', validate(addRoundSchema), addRound);

export default router;