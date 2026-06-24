import User from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { deleteFromCloudinary } from '../services/cloudinary.service.js';

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');

  return res.status(200).json(new ApiResponse(200, { user }, 'Profile fetched'));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'profile'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (req.body.profile) {
    const allowedProfileFields = [
      'college', 'branch', 'graduationYear',
      'skills', 'bio', 'linkedin', 'github', 'leetcode'
    ];
    updates.profile = {};
    allowedProfileFields.forEach((field) => {
      if (req.body.profile[field] !== undefined) {
        updates.profile[field] = req.body.profile[field];
      }
    });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  return res.status(200).json(new ApiResponse(200, { user }, 'Profile updated'));
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded');

  const user = await User.findById(req.user._id);

  // Delete old avatar from Cloudinary if exists
  if (user.avatar?.publicId) {
    await deleteFromCloudinary(user.avatar.publicId);
  }

  user.avatar = {
    url: req.file.path,
    publicId: req.file.filename,
  };
  await user.save();

  return res.status(200).json(new ApiResponse(200, { avatar: user.avatar }, 'Avatar uploaded'));
});

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded');

  const user = await User.findById(req.user._id);

  // Delete old resume from Cloudinary if exists
  if (user.resume?.publicId) {
    await deleteFromCloudinary(user.resume.publicId, 'raw');
  }

  user.resume = {
    url: req.file.path,
    publicId: req.file.filename,
    uploadedAt: new Date(),
  };
  await user.save();

  return res.status(200).json(new ApiResponse(200, { resume: user.resume }, 'Resume uploaded'));
});

export const deleteResume = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user.resume?.publicId) {
    throw new ApiError(404, 'No resume found');
  }

  await deleteFromCloudinary(user.resume.publicId, 'raw');

  user.resume = { url: '', publicId: '', uploadedAt: null };
  await user.save();

  return res.status(200).json(new ApiResponse(200, null, 'Resume deleted'));
});