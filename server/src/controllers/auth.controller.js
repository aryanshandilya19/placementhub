import User from '../models/User.model.js';
import RefreshToken from '../models/RefreshToken.model.js';
import Token from '../models/Token.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';
import { generateRandomToken } from '../utils/generateRandomToken.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email.service.js';
import jwt from 'jsonwebtoken';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const user = await User.create({ name, email, password });

  // Create email verification token, valid 24 hours
  const verificationToken = generateRandomToken();
  await Token.create({
    userId: user._id,
    token: verificationToken,
    type: 'emailVerification',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
  await sendVerificationEmail(user.email, user.name, verificationLink);

  const userResponse = user.toObject();
  delete userResponse.password;

  return res
    .status(201)
    .json(new ApiResponse(201, { user: userResponse }, 'Account created. Please check your email to verify your account.'));
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const tokenDoc = await Token.findOne({ token, type: 'emailVerification' });
  if (!tokenDoc) {
    throw new ApiError(400, 'Invalid or expired verification link');
  }

  await User.findByIdAndUpdate(tokenDoc.userId, { isEmailVerified: true });
  await Token.deleteOne({ _id: tokenDoc._id }); // single-use — delete after success

  return res.status(200).json(new ApiResponse(200, null, 'Email verified successfully'));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Store refresh token in DB so it can be revoked later
  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const userResponse = user.toObject();
  delete userResponse.password;

  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

  return res
    .status(200)
    .json(new ApiResponse(200, { user: userResponse, accessToken }, 'Logged in successfully'));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refreshToken;

  if (!incomingToken) {
    throw new ApiError(401, 'Refresh token missing — please log in again');
  }

  // Verify the token is in our DB (not revoked, not expired by our own record)
  const storedToken = await RefreshToken.findOne({ token: incomingToken });
  if (!storedToken) {
    throw new ApiError(401, 'Invalid refresh token — please log in again');
  }

  // Verify the JWT signature itself
  let decoded;
  try {
    decoded = jwt.verify(incomingToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    await RefreshToken.deleteOne({ token: incomingToken });
    throw new ApiError(401, 'Refresh token expired — please log in again');
  }

  // Rotation: delete the old refresh token, issue a brand new pair
  await RefreshToken.deleteOne({ token: incomingToken });

  const newAccessToken = generateAccessToken(decoded.userId);
  const newRefreshToken = generateRefreshToken(decoded.userId);

  await RefreshToken.create({
    userId: decoded.userId,
    token: newRefreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.cookie('refreshToken', newRefreshToken, REFRESH_COOKIE_OPTIONS);

  return res
    .status(200)
    .json(new ApiResponse(200, { accessToken: newAccessToken }, 'Token refreshed'));
});

export const logoutUser = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refreshToken;

  if (incomingToken) {
    await RefreshToken.deleteOne({ token: incomingToken });
  }

  res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS);

  return res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  // Always return the same success message whether or not the user exists —
  // prevents attackers from using this endpoint to check which emails are registered
  if (!user) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, 'If an account exists with this email, a reset link has been sent.'));
  }

  // Remove any existing reset tokens for this user first
  await Token.deleteMany({ userId: user._id, type: 'passwordReset' });

  const resetToken = generateRandomToken();
  await Token.create({
    userId: user._id,
    token: resetToken,
    type: 'passwordReset',
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  });

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendPasswordResetEmail(user.email, user.name, resetLink);

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'If an account exists with this email, a reset link has been sent.'));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const tokenDoc = await Token.findOne({ token, type: 'passwordReset' });
  if (!tokenDoc) {
    throw new ApiError(400, 'Invalid or expired reset link');
  }

  const user = await User.findById(tokenDoc.userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.password = password; // pre('save') hook will hash this automatically
  await user.save();

  await Token.deleteOne({ _id: tokenDoc._id });

  // Invalidate all existing refresh tokens — force re-login everywhere for security
  await RefreshToken.deleteMany({ userId: user._id });

  return res.status(200).json(new ApiResponse(200, null, 'Password reset successfully. Please log in.'));
});