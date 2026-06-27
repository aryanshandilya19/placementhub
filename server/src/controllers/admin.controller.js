import User from '../models/User.model.js';
import Application from '../models/Application.model.js';
import DSAProgress from '../models/DSAProgress.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllUsers = asyncHandler(async (req, res) => {
  const { search, role, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      users,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    }, 'Users fetched')
  );
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) throw new ApiError(404, 'User not found');

  const [appCount, dsaProgress] = await Promise.all([
    Application.countDocuments({ userId: user._id }),
    DSAProgress.findOne({ userId: user._id }),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      user,
      stats: {
        totalApplications: appCount,
        totalSolved: dsaProgress?.stats?.totalSolved || 0,
      },
    }, 'User fetched')
  );
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!['student', 'admin'].includes(role)) {
    throw new ApiError(400, 'Invalid role');
  }

  if (req.params.id === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot change your own role');
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select('-password');

  if (!user) throw new ApiError(404, 'User not found');

  return res.status(200).json(new ApiResponse(200, { user }, 'Role updated'));
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot delete your own account from admin panel');
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  // Clean up user data
  await Promise.all([
    Application.deleteMany({ userId: req.params.id }),
    DSAProgress.deleteOne({ userId: req.params.id }),
  ]);

  return res.status(200).json(new ApiResponse(200, null, 'User deleted'));
});

export const getAdminStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalStudents,
    totalAdmins,
    totalApplications,
    verifiedUsers,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'admin' }),
    Application.countDocuments(),
    User.countDocuments({ isEmailVerified: true }),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      stats: {
        totalUsers,
        totalStudents,
        totalAdmins,
        totalApplications,
        verifiedUsers,
        unverifiedUsers: totalUsers - verifiedUsers,
      },
    }, 'Admin stats fetched')
  );
});