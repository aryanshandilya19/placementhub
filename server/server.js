import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { logger } from './src/utils/logger.js';
import { configureCloudinary } from './src/config/cloudinary.js';

const PORT = process.env.PORT || 5000;

configureCloudinary();

connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  });
}).catch((error) => {
  logger.error('Failed to connect to database:', error);
  process.exit(1);
});