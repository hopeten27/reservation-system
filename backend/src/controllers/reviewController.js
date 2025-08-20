import Review from '../models/Review.js';
import Service from '../models/Service.js';

// @desc    Get reviews for a service
// @route   GET /api/v1/reviews/service/:serviceId
// @access  Public
export const getServiceReviews = async (req, res, next) => {
  try {
    const { serviceId } = req.params;

    const reviews = await Review.find({ service: serviceId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { reviews }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a review
// @route   POST /api/v1/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const { serviceId, rating, comment } = req.body;

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Service not found',
          code: 'SERVICE_NOT_FOUND'
        }
      });
    }

    // Create review
    const review = await Review.create({
      user: req.user._id,
      service: serviceId,
      rating,
      comment
    });

    // Populate user data
    await review.populate('user', 'name');

    res.status(201).json({
      success: true,
      data: { review }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'You have already reviewed this service',
          code: 'DUPLICATE_REVIEW'
        }
      });
    }
    next(error);
  }
};

// @desc    Update a review
// @route   PUT /api/v1/reviews/:id
// @access  Private
export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Review not found',
          code: 'REVIEW_NOT_FOUND'
        }
      });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Not authorized to update this review',
          code: 'UNAUTHORIZED'
        }
      });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    await review.populate('user', 'name');

    res.json({
      success: true,
      data: { review }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Review not found',
          code: 'REVIEW_NOT_FOUND'
        }
      });
    }

    // Check if user owns this review or is admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Not authorized to delete this review',
          code: 'UNAUTHORIZED'
        }
      });
    }

    await Review.findByIdAndDelete(id);

    res.json({
      success: true,
      data: { message: 'Review deleted successfully' }
    });
  } catch (error) {
    next(error);
  }
};