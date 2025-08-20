import Slot from '../models/Slot.js';
import Service from '../models/Service.js';
import { buildQuery, paginate } from '../utils/queryHelpers.js';

// @desc    Get all slots
// @route   GET /api/v1/slots
// @access  Public
export const getSlots = async (req, res, next) => {
  try {
    const { query, page, limit } = buildQuery(req.query, Slot);
    
    // Populate service details
    query.populate('service', 'name price durationMinutes');
    
    const { docs, pagination } = await paginate(query, page, limit);

    res.json({
      success: true,
      data: {
        slots: docs,
        pagination
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single slot
// @route   GET /api/v1/slots/:id
// @access  Public
export const getSlot = async (req, res, next) => {
  try {
    const slot = await Slot.findById(req.params.id)
      .populate('service', 'name price durationMinutes');

    if (!slot) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Slot not found',
          code: 'SLOT_NOT_FOUND'
        }
      });
    }

    res.json({
      success: true,
      data: { slot }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create slot
// @route   POST /api/v1/slots
// @access  Private/Admin
export const createSlot = async (req, res, next) => {
  try {
    const { service: serviceId, date } = req.body;

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

    // Check for overlapping slots
    const startTime = new Date(date);
    const endTime = new Date(startTime.getTime() + service.durationMinutes * 60000);

    const overlappingSlot = await Slot.findOne({
      service: serviceId,
      $or: [
        {
          date: { $lt: endTime },
          end: { $gt: startTime }
        }
      ]
    });

    if (overlappingSlot) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'Slot overlaps with existing slot',
          code: 'SLOT_OVERLAP'
        }
      });
    }

    const slot = await Slot.create(req.body);
    await slot.populate('service', 'name price durationMinutes');

    res.status(201).json({
      success: true,
      data: { slot }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update slot
// @route   PUT /api/v1/slots/:id
// @access  Private/Admin
export const updateSlot = async (req, res, next) => {
  try {
    const slot = await Slot.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('service', 'name price durationMinutes');

    if (!slot) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Slot not found',
          code: 'SLOT_NOT_FOUND'
        }
      });
    }

    res.json({
      success: true,
      data: { slot }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete slot
// @route   DELETE /api/v1/slots/:id
// @access  Private/Admin
export const deleteSlot = async (req, res, next) => {
  try {
    const slot = await Slot.findByIdAndDelete(req.params.id);

    if (!slot) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Slot not found',
          code: 'SLOT_NOT_FOUND'
        }
      });
    }

    res.json({
      success: true,
      data: { message: 'Slot deleted successfully' }
    });
  } catch (error) {
    next(error);
  }
};