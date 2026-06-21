import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['emailVerification', 'passwordReset'],
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Token = mongoose.model('Token', tokenSchema);

export default Token;