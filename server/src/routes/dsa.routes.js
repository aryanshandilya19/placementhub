import { Router } from 'express';
import { getDSA, addProblem, updateProblem, deleteProblem, getDSAStats } from '../controllers/dsa.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { addProblemSchema, updateProblemSchema } from '../validators/dsa.validator.js';

const router = Router();

router.use(protect);

router.get('/', getDSA);
router.get('/stats', getDSAStats);
router.post('/problems', validate(addProblemSchema), addProblem);
router.patch('/problems/:problemId', validate(updateProblemSchema), updateProblem);
router.delete('/problems/:problemId', deleteProblem);

export default router;