import mongoose from 'mongoose';

const roundSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['oa', 'technical', 'hr', 'managerial', 'group_discussion'],
    required: true,
  },
  date: { type: Date },
  outcome: {
    type: String,
    enum: ['passed', 'failed', 'pending'],
    default: 'pending',
  },
  notes: { type: String, default: '', maxlength: 500 },
});

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: 100,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['applied', 'oa', 'interview', 'offer', 'rejected', 'ghosted'],
      default: 'applied',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    ctc: { type: Number, min: 0 },
    location: { type: String, trim: true, maxlength: 100 },
    jobLink: { type: String, trim: true },
    notes: { type: String, default: '', maxlength: 1000 },
    rounds: [roundSchema],
  },
  { timestamps: true }
);

const Application = mongoose.model('Application', applicationSchema);
export default Application;