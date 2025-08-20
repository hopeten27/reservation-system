import mongoose from 'mongoose';

const recurringBookingSchema = new mongoose.Schema({
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
  frequency: {
    type: String,
    enum: ['weekly', 'biweekly', 'monthly'],
    required: [true, 'Frequency is required']
  },
  dayOfWeek: {
    type: Number,
    min: 0,
    max: 6,
    required: [true, 'Day of week is required']
  },
  time: {
    type: String,
    required: [true, 'Time is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  totalSessions: {
    type: Number,
    required: [true, 'Total sessions is required']
  },
  completedSessions: {
    type: Number,
    default: 0
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required']
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'cancelled'],
    default: 'active'
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }]
}, {
  timestamps: true
});

export default mongoose.model('RecurringBooking', recurringBookingSchema);