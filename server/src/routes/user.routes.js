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
  handleUploadError,
} from '../middlewares/upload.middleware.js';
import { uploadLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = Router();

router.use(protect);

router.get('/me', getMe);
router.patch('/me', validate(updateProfileSchema), updateProfile);
router.post('/me/avatar', uploadLimiter, handleUploadError(uploadAvatarMiddleware), uploadAvatar);
router.post('/me/resume', uploadLimiter, handleUploadError(uploadResumeMiddleware), uploadResume);
router.delete('/me/resume', deleteResume);

export default router;