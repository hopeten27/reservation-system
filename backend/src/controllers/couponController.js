import Coupon from '../models/Coupon.js';

// @desc    Validate coupon
// @route   POST /api/v1/coupons/validate
// @access  Public
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, serviceId, amount } = req.body;

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    });

    if (!coupon) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid or expired coupon code', code: 'INVALID_COUPON' }
      });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        error: { message: 'Coupon usage limit exceeded', code: 'COUPON_LIMIT_EXCEEDED' }
      });
    }

    // Check minimum amount
    if (amount < coupon.minAmount) {
      return res.status(400).json({
        success: false,
        error: { 
          message: `Minimum order amount is $${coupon.minAmount}`, 
          code: 'MIN_AMOUNT_NOT_MET' 
        }
      });
    }

    // Check applicable services
    if (coupon.applicableServices.length > 0 && !coupon.applicableServices.includes(serviceId)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Coupon not applicable to this service', code: 'SERVICE_NOT_APPLICABLE' }
      });
    }

    // Calculate discount
    let discountAmount;
    if (coupon.type === 'percentage') {
      discountAmount = (amount * coupon.value) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.value;
    }

    const finalAmount = Math.max(0, amount - discountAmount);

    res.json({
      success: true,
      data: {
        coupon: {
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          discountAmount,
          finalAmount
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply coupon (increment usage count)
// @route   POST /api/v1/coupons/apply
// @access  Private
export const applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;

    const coupon = await Coupon.findOneAndUpdate(
      { code: code.toUpperCase() },
      { $inc: { usedCount: 1 } },
      { new: true }
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: { message: 'Coupon not found', code: 'COUPON_NOT_FOUND' }
      });
    }

    res.json({
      success: true,
      data: { message: 'Coupon applied successfully' }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all coupons (Admin)
// @route   GET /api/v1/coupons
// @access  Private (Admin)
export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { coupons }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create coupon (Admin)
// @route   POST /api/v1/coupons
// @access  Private (Admin)
export const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);

    res.status(201).json({
      success: true,
      data: { coupon }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: { message: 'Coupon code already exists', code: 'DUPLICATE_COUPON' }
      });
    }
    next(error);
  }
};

// @desc    Delete coupon (Admin)
// @route   DELETE /api/v1/coupons/:id
// @access  Private (Admin)
export const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: { message: 'Coupon not found', code: 'COUPON_NOT_FOUND' }
      });
    }

    res.json({
      success: true,
      data: { message: 'Coupon deleted successfully' }
    });
  } catch (error) {
    next(error);
  }
};