import { cloudinary } from '../config/cloudinary.js';
import { logger } from '../utils/logger.js';

export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    logger.error('Failed to delete from Cloudinary:', error);
  }
};