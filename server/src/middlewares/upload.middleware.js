import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from '../config/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'placementhub/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
  },
});

const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'placementhub/resumes',
    allowed_formats: ['pdf'],
    resource_type: 'raw',
  },
});

const fileFilter = (allowedTypes) => (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, `Invalid file type. Allowed: ${allowedTypes.join(', ')}`), false);
  }
};

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: fileFilter(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
}).single('avatar');

export const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter(['application/pdf']),
}).single('resume');