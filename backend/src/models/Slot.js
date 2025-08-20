import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Service is required']
  },
  date: {
    type: Date,
    required: [true, 'Start date is required']
  },
  end: {
    type: Date
  },
  capacity: {
    type: Number,
    default: 1,
    min: [1, 'Capacity must be at least 1']
  },
  bookedCount: {
    type: Number,
    default: 0,
    min: [0, 'Booked count cannot be negative']
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  }
}, {
  timestamps: true
});

// Compound unique index
slotSchema.index({ service: 1, date: 1 }, { unique: true });

// Other indexes
slotSchema.index({ date: 1 });
slotSchema.index({ status: 1 });

// Virtual for availability
slotSchema.virtual('isAvailable').get(function() {
  return this.status === 'open' && this.bookedCount < this.capacity;
});

// Pre-save middleware to calculate end time
slotSchema.pre('save', async function(next) {
  if (this.isModified('date') || this.isModified('service')) {
    const service = await mongoose.model('Service').findById(this.service);
    if (service) {
      this.end = new Date(this.date.getTime() + service.durationMinutes * 60000);
    }
  }
  next();
});

export default mongoose.model('Slot', slotSchema);