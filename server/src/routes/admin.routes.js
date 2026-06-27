import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getAdminStats,
} from '../controllers/admin.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { restrictTo } from '../middlewares/role.middleware.js';

const router = Router();

// Both middlewares apply to every admin route
router.use(protect);
router.use(restrictTo('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;