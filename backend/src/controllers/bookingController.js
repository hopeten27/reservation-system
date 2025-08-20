import Booking from '../models/Booking.js';
import Slot from '../models/Slot.js';
import Service from '../models/Service.js';
import { buildQuery, paginate } from '../utils/queryHelpers.js';

// @desc    Get all bookings
// @route   GET /api/v1/bookings
// @access  Private
export const getBookings = async (req, res, next) => {
  try {
    // Users can only see their own bookings, admins see all
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
    
    const { query, page, limit } = buildQuery({ ...req.query, ...filter }, Booking);
    
    // Populate references
    query.populate([
      { path: 'user', select: 'name email' },
      { path: 'service', select: 'name price durationMinutes' },
      { path: 'slot', select: 'date end status capacity bookedCount' }
    ]);
    
    const { docs, pagination } = await paginate(query, page, limit);

    res.json({
      success: true,
      data: {
        bookings: docs,
        pagination
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private
export const getBooking = async (req, res, next) => {
  try {
    let query = { _id: req.params.id };
    
    // Users can only see their own bookings
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }

    const booking = await Booking.findOne(query)
      .populate([
        { path: 'user', select: 'name email' },
        { path: 'service', select: 'name price durationMinutes' },
        { path: 'slot', select: 'date end status capacity bookedCount' }
      ]);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Booking not found',
          code: 'BOOKING_NOT_FOUND'
        }
      });
    }

    res.json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create booking
// @route   POST /api/v1/bookings
// @access  Private
export const createBooking = async (req, res, next) => {
  try {
    const { service: serviceId, slot: slotId, notes } = req.body;
    const userId = req.user._id;

    // Check if slot exists and is available
    const slot = await Slot.findById(slotId).populate('service');
    if (!slot) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Slot not found',
          code: 'SLOT_NOT_FOUND'
        }
      });
    }

    // Check if slot is open
    if (slot.status !== 'open') {
      return res.status(409).json({
        success: false,
        error: {
          message: 'Slot is not available for booking',
          code: 'SLOT_NOT_AVAILABLE'
        }
      });
    }

    // Check if slot is in the future
    if (slot.date <= new Date()) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'Cannot book slots in the past',
          code: 'SLOT_IN_PAST'
        }
      });
    }

    // Check capacity
    if (slot.bookedCount >= slot.capacity) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'Slot is fully booked',
          code: 'SLOT_FULL'
        }
      });
    }

    // Check for existing booking (idempotent)
    const existingBooking = await Booking.findOne({
      user: userId,
      slot: slotId
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'You have already booked this slot',
          code: 'DUPLICATE_BOOKING'
        }
      });
    }

    // Create booking
    const booking = await Booking.create({
      user: userId,
      service: serviceId,
      slot: slotId,
      amount: slot.service.price,
      notes
    });

    // Update slot booked count
    slot.bookedCount += 1;
    if (slot.bookedCount >= slot.capacity) {
      slot.status = 'closed';
    }
    await slot.save();

    // Populate and return
    await booking.populate([
      { path: 'user', select: 'name email' },
      { path: 'service', select: 'name price durationMinutes' },
      { path: 'slot', select: 'date end status capacity bookedCount' }
    ]);

    res.status(201).json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking
// @route   PUT /api/v1/bookings/:id
// @access  Private
export const updateBooking = async (req, res, next) => {
  try {
    let query = { _id: req.params.id };
    
    // Users can only update their own bookings
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }

    const booking = await Booking.findOneAndUpdate(
      query,
      req.body,
      { new: true, runValidators: true }
    ).populate([
      { path: 'user', select: 'name email' },
      { path: 'service', select: 'name price durationMinutes' },
      { path: 'slot', select: 'date end status capacity bookedCount' }
    ]);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Booking not found',
          code: 'BOOKING_NOT_FOUND'
        }
      });
    }

    res.json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PATCH /api/v1/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res, next) => {
  try {
    let query = { _id: req.params.id };
    
    // Users can only cancel their own bookings
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }

    const booking = await Booking.findOne(query).populate('slot');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Booking not found',
          code: 'BOOKING_NOT_FOUND'
        }
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(409).json({
        success: false,
        error: {
          message: 'Booking is already cancelled',
          code: 'ALREADY_CANCELLED'
        }
      });
    }

    // Optional: Check cancellation window (24 hours before slot)
    const cancellationDeadline = new Date(booking.slot.date.getTime() - 24 * 60 * 60 * 1000);
    if (new Date() > cancellationDeadline) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'Cancellation deadline has passed',
          code: 'CANCELLATION_DEADLINE_PASSED'
        }
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Update slot availability
    const slot = booking.slot;
    slot.bookedCount = Math.max(0, slot.bookedCount - 1);
    if (slot.status === 'closed' && slot.bookedCount < slot.capacity) {
      slot.status = 'open';
    }
    await slot.save();

    await booking.populate([
      { path: 'user', select: 'name email' },
      { path: 'service', select: 'name price durationMinutes' },
      { path: 'slot', select: 'date end status capacity bookedCount' }
    ]);

    res.json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    next(error);
  }
};