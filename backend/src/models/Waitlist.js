import mongoose from 'mongoose';

const waitlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Service is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  phone: {
    type: String
  },
  position: {
    type: Number,
    required: [true, 'Position is required']
  },
  status: {
    type: String,
    enum: ['waiting', 'notified', 'expired', 'booked'],
    default: 'waiting'
  },
  notifiedAt: {
    type: Date
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

waitlistSchema.index({ service: 1, position: 1 });
waitlistSchema.index({ user: 1, service: 1 }, { unique: true });

export default mongoose.model('Waitlist', waitlistSchema);