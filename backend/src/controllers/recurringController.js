import RecurringBooking from '../models/RecurringBooking.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Slot from '../models/Slot.js';
import { createPaymentIntent } from '../services/stripeService.js';

// @desc    Create recurring booking
// @route   POST /api/v1/recurring
// @access  Private
export const createRecurringBooking = async (req, res, next) => {
  try {
    const { serviceId, frequency, dayOfWeek, time, startDate, totalSessions } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        error: { message: 'Service not found', code: 'SERVICE_NOT_FOUND' }
      });
    }

    // Calculate total amount with 10% recurring discount
    const originalAmount = service.price * totalSessions;
    const discountedAmount = originalAmount * 0.9; // 10% discount

    // Create payment intent
    const paymentIntent = await createPaymentIntent(discountedAmount, 'usd', {
      type: 'recurring_booking',
      serviceId,
      totalSessions,
      userId: req.user._id.toString()
    });

    // Create recurring booking
    const recurringBooking = await RecurringBooking.create({
      user: req.user._id,
      service: serviceId,
      frequency,
      dayOfWeek,
      time,
      startDate,
      totalSessions,
      amount: discountedAmount
    });

    res.status(201).json({
      success: true,
      data: { 
        recurringBooking,
        paymentIntent: {
          clientSecret: paymentIntent.client_secret,
          amount: discountedAmount
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's recurring bookings
// @route   GET /api/v1/recurring
// @access  Private
export const getRecurringBookings = async (req, res, next) => {
  try {
    const recurringBookings = await RecurringBooking.find({ user: req.user._id })
      .populate('service', 'name description')
      .populate('bookings')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { recurringBookings }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process recurring booking after payment
// @route   POST /api/v1/recurring/:id/process
// @access  Private
export const processRecurringBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentIntentId } = req.body;

    const recurringBooking = await RecurringBooking.findById(id);
    if (!recurringBooking) {
      return res.status(404).json({
        success: false,
        error: { message: 'Recurring booking not found', code: 'RECURRING_BOOKING_NOT_FOUND' }
      });
    }

    // Generate individual bookings
    const bookings = [];
    const startDate = new Date(recurringBooking.startDate);
    
    for (let i = 0; i < recurringBooking.totalSessions; i++) {
      const sessionDate = new Date(startDate);
      
      // Calculate session date based on frequency
      if (recurringBooking.frequency === 'weekly') {
        sessionDate.setDate(startDate.getDate() + (i * 7));
      } else if (recurringBooking.frequency === 'biweekly') {
        sessionDate.setDate(startDate.getDate() + (i * 14));
      } else if (recurringBooking.frequency === 'monthly') {
        sessionDate.setMonth(startDate.getMonth() + i);
      }

      // Set time
      const [hours, minutes] = recurringBooking.time.split(':');
      sessionDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Find or create slot
      let slot = await Slot.findOne({
        service: recurringBooking.service,
        date: sessionDate
      });

      if (!slot) {
        slot = await Slot.create({
          service: recurringBooking.service,
          date: sessionDate,
          capacity: 10,
          bookedCount: 0,
          status: 'open'
        });
      }

      // Create booking
      const booking = await Booking.create({
        user: recurringBooking.user,
        service: recurringBooking.service,
        slot: slot._id,
        amount: recurringBooking.amount / recurringBooking.totalSessions,
        status: 'confirmed',
        paymentIntentId: `${paymentIntentId}_session_${i + 1}`,
        notes: `Recurring booking session ${i + 1}/${recurringBooking.totalSessions}`
      });

      // Update slot
      await Slot.findByIdAndUpdate(slot._id, {
        $inc: { bookedCount: 1 }
      });

      bookings.push(booking._id);
    }

    // Update recurring booking
    recurringBooking.bookings = bookings;
    await recurringBooking.save();

    res.json({
      success: true,
      data: { 
        recurringBooking,
        message: `Created ${bookings.length} recurring bookings successfully`
      }
    });
  } catch (error) {
    next(error);
  }
};