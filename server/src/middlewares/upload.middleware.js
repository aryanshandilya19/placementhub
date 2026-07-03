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
  params: (req, file) => ({
    folder: 'placementhub/resumes',
    allowed_formats: ['pdf'],
    resource_type: 'raw',
    public_id: `resume_${req.user._id}_${Date.now()}`,
  }),
});

const fileFilter = (allowedMimetypes) => (req, file, cb) => {
  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(400, `Invalid file type. Allowed types: ${allowedMimetypes.join(', ')}`),
      false
    );
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

// Wraps multer errors into our ApiError format
export const handleUploadError = (uploadMiddleware) => (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ApiError(400, 'File too large'));
      }
      return next(new ApiError(400, err.message));
    }
    next(err);
  });
};