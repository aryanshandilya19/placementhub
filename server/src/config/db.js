import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw error;
  }
};