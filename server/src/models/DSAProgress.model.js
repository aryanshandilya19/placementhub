import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Problem title is required'],
    trim: true,
    maxlength: 200,
  },
  platform: {
    type: String,
    enum: ['leetcode', 'gfg', 'codeforces', 'codechef', 'other'],
    default: 'leetcode',
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  tags: [{ type: String, trim: true }],
  status: {
    type: String,
    enum: ['todo', 'solving', 'done'],
    default: 'todo',
  },
  link: { type: String, trim: true },
  notes: { type: String, default: '', maxlength: 500 },
  solvedAt: { type: Date },
}, { timestamps: true });

const dsaProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // one document per user
    index: true,
  },
  problems: [problemSchema],
  stats: {
    totalSolved: { type: Number, default: 0 },
    easySolved: { type: Number, default: 0 },
    mediumSolved: { type: Number, default: 0 },
    hardSolved: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastSolvedAt: { type: Date },
  },
}, { timestamps: true });

const DSAProgress = mongoose.model('DSAProgress', dsaProgressSchema);
export default DSAProgress;