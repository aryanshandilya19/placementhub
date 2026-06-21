import { Router } from 'express';
import {
  registerUser,
  loginUser,
  verifyEmail,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator.js';

const router = Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.get('/verify-email/:token', verifyEmail);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', logoutUser);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword);

export default router;