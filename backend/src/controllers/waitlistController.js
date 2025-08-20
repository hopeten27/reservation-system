import Waitlist from '../models/Waitlist.js';
import Service from '../models/Service.js';

// @desc    Join waitlist
// @route   POST /api/v1/waitlist
// @access  Private
export const joinWaitlist = async (req, res, next) => {
  try {
    const { serviceId, email, phone } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        error: { message: 'Service not found', code: 'SERVICE_NOT_FOUND' }
      });
    }

    // Check if user already on waitlist
    const existingEntry = await Waitlist.findOne({
      user: req.user._id,
      service: serviceId,
      status: 'waiting'
    });

    if (existingEntry) {
      return res.status(400).json({
        success: false,
        error: { message: 'Already on waitlist', code: 'ALREADY_ON_WAITLIST' }
      });
    }

    // Get next position
    const lastPosition = await Waitlist.findOne({ service: serviceId })
      .sort({ position: -1 });
    const position = lastPosition ? lastPosition.position + 1 : 1;

    const waitlistEntry = await Waitlist.create({
      user: req.user._id,
      service: serviceId,
      email,
      phone,
      position
    });

    res.status(201).json({
      success: true,
      data: { waitlistEntry }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: { message: 'Already on waitlist for this service', code: 'DUPLICATE_WAITLIST' }
      });
    }
    next(error);
  }
};

// @desc    Get user's waitlist entries
// @route   GET /api/v1/waitlist
// @access  Private
export const getUserWaitlist = async (req, res, next) => {
  try {
    const waitlistEntries = await Waitlist.find({ user: req.user._id })
      .populate('service', 'name description price')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { waitlistEntries }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check waitlist status for service
// @route   GET /api/v1/waitlist/service/:serviceId
// @access  Private
export const getWaitlistStatus = async (req, res, next) => {
  try {
    const { serviceId } = req.params;

    const waitlistEntry = await Waitlist.findOne({
      user: req.user._id,
      service: serviceId,
      status: 'waiting'
    });

    res.json({
      success: true,
      data: { 
        isOnWaitlist: !!waitlistEntry,
        position: waitlistEntry?.position || null,
        waitlistEntry
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove from waitlist
// @route   DELETE /api/v1/waitlist/:id
// @access  Private
export const removeFromWaitlist = async (req, res, next) => {
  try {
    const { id } = req.params;

    const waitlistEntry = await Waitlist.findById(id);
    if (!waitlistEntry) {
      return res.status(404).json({
        success: false,
        error: { message: 'Waitlist entry not found', code: 'WAITLIST_NOT_FOUND' }
      });
    }

    if (waitlistEntry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized', code: 'UNAUTHORIZED' }
      });
    }

    await Waitlist.findByIdAndDelete(id);

    // Update positions for remaining entries
    await Waitlist.updateMany(
      { 
        service: waitlistEntry.service,
        position: { $gt: waitlistEntry.position }
      },
      { $inc: { position: -1 } }
    );

    res.json({
      success: true,
      data: { message: 'Removed from waitlist successfully' }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Notify next in waitlist (called when booking cancelled)
// @route   POST /api/v1/waitlist/notify/:serviceId
// @access  Private (Admin)
export const notifyNextInWaitlist = async (req, res, next) => {
  try {
    const { serviceId } = req.params;

    const nextEntry = await Waitlist.findOne({
      service: serviceId,
      status: 'waiting'
    }).sort({ position: 1 }).populate('user', 'name email');

    if (!nextEntry) {
      return res.json({
        success: true,
        data: { message: 'No one on waitlist' }
      });
    }

    // Update entry status
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30); // 30 minutes to book

    nextEntry.status = 'notified';
    nextEntry.notifiedAt = new Date();
    nextEntry.expiresAt = expiresAt;
    await nextEntry.save();

    // Here you would send email/SMS notification
    console.log(`Notifying ${nextEntry.user.email} about available spot`);

    res.json({
      success: true,
      data: { 
        message: 'Next person notified',
        notifiedUser: nextEntry.user.name
      }
    });
  } catch (error) {
    next(error);
  }
};