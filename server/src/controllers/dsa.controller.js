import DSAProgress from '../models/DSAProgress.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { recalculateStats } from '../utils/dsaStats.js';

const getOrCreateProgress = async (userId) => {
  let progress = await DSAProgress.findOne({ userId });
  if (!progress) {
    progress = await DSAProgress.create({ userId, problems: [], stats: {} });
  }
  return progress;
};

export const getDSA = asyncHandler(async (req, res) => {
  const progress = await getOrCreateProgress(req.user._id);
  return res.status(200).json(new ApiResponse(200, { progress }, 'DSA progress fetched'));
});

export const addProblem = asyncHandler(async (req, res) => {
  const progress = await getOrCreateProgress(req.user._id);

  const problemData = { ...req.body };
  if (problemData.status === 'done' && !problemData.solvedAt) {
    problemData.solvedAt = new Date();
  }

  progress.problems.unshift(problemData);
  progress.stats = recalculateStats(progress.problems);
  await progress.save();

  const newProblem = progress.problems[0];
  return res.status(201).json(new ApiResponse(201, { problem: newProblem, stats: progress.stats }, 'Problem added'));
});

export const updateProblem = asyncHandler(async (req, res) => {
  const progress = await DSAProgress.findOne({ userId: req.user._id });
  if (!progress) throw new ApiError(404, 'DSA progress not found');

  const problem = progress.problems.id(req.params.problemId);
  if (!problem) throw new ApiError(404, 'Problem not found');

  // If status is being changed to 'done' and solvedAt not set, set it now
  if (req.body.status === 'done' && !problem.solvedAt) {
    req.body.solvedAt = new Date();
  }

  Object.assign(problem, req.body);
  progress.stats = recalculateStats(progress.problems);
  await progress.save();

  return res.status(200).json(new ApiResponse(200, { problem, stats: progress.stats }, 'Problem updated'));
});

export const deleteProblem = asyncHandler(async (req, res) => {
  const progress = await DSAProgress.findOne({ userId: req.user._id });
  if (!progress) throw new ApiError(404, 'DSA progress not found');

  const problem = progress.problems.id(req.params.problemId);
  if (!problem) throw new ApiError(404, 'Problem not found');

  problem.deleteOne();
  progress.stats = recalculateStats(progress.problems);
  await progress.save();

  return res.status(200).json(new ApiResponse(200, null, 'Problem deleted'));
});

export const getDSAStats = asyncHandler(async (req, res) => {
  const progress = await getOrCreateProgress(req.user._id);
  return res.status(200).json(new ApiResponse(200, { stats: progress.stats }, 'Stats fetched'));
});