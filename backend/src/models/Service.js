import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  durationMinutes: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  imageUrl: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
serviceSchema.index({ name: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ price: 1 });

export default mongoose.model('Service', serviceSchema);