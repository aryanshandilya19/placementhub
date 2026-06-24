import Application from '../models/Application.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createApplication = asyncHandler(async (req, res) => {
  const application = await Application.create({
    ...req.body,
    userId: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { application }, 'Application added'));
});

export const getApplications = asyncHandler(async (req, res) => {
  const { status, search, sort = '-createdAt' } = req.query;

  const filter = { userId: req.user._id };
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { company: { $regex: search, $options: 'i' } },
      { role: { $regex: search, $options: 'i' } },
    ];
  }

  const applications = await Application.find(filter).sort(sort);

  return res
    .status(200)
    .json(new ApiResponse(200, { applications, total: applications.length }, 'Applications fetched'));
});

export const getApplication = asyncHandler(async (req, res) => {
  const application = await Application.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!application) throw new ApiError(404, 'Application not found');

  return res.status(200).json(new ApiResponse(200, { application }, 'Application fetched'));
});

export const updateApplication = asyncHandler(async (req, res) => {
  const application = await Application.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!application) throw new ApiError(404, 'Application not found');

  return res.status(200).json(new ApiResponse(200, { application }, 'Application updated'));
});

export const deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!application) throw new ApiError(404, 'Application not found');

  return res.status(200).json(new ApiResponse(200, null, 'Application deleted'));
});

export const addRound = asyncHandler(async (req, res) => {
  const application = await Application.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!application) throw new ApiError(404, 'Application not found');

  application.rounds.push(req.body);
  await application.save();

  return res.status(201).json(new ApiResponse(201, { application }, 'Round added'));
});

export const getStats = asyncHandler(async (req, res) => {
  const stats = await Application.aggregate([
    { $match: { userId: req.user._id } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const total = await Application.countDocuments({ userId: req.user._id });

  const formatted = {
    total,
    applied: 0, oa: 0, interview: 0,
    offer: 0, rejected: 0, ghosted: 0,
  };

  stats.forEach(({ _id, count }) => {
    formatted[_id] = count;
  });

  return res.status(200).json(new ApiResponse(200, { stats: formatted }, 'Stats fetched'));
});