import { Router } from 'express';
import {
  getMe,
  updateProfile,
  uploadAvatar,
  uploadResume,
  deleteResume,
} from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { updateProfileSchema } from '../validators/user.validator.js';
import {
  uploadAvatar as uploadAvatarMiddleware,
  uploadResume as uploadResumeMiddleware,
} from '../middlewares/upload.middleware.js';

const router = Router();

router.use(protect); // all user routes require auth

router.get('/me', getMe);
router.patch('/me', validate(updateProfileSchema), updateProfile);
router.post('/me/avatar', uploadAvatarMiddleware, uploadAvatar);
router.post('/me/resume', uploadResumeMiddleware, uploadResume);
router.delete('/me/resume', deleteResume);

export default router;