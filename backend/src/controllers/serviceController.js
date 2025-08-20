import Service from '../models/Service.js';
import { buildQuery, paginate } from '../utils/queryHelpers.js';

// @desc    Get all services
// @route   GET /api/v1/services
// @access  Public
export const getServices = async (req, res, next) => {
  try {
    const { query, page, limit } = buildQuery(req.query, Service);
    
    // Populate minimal refs if needed
    const { docs, pagination } = await paginate(query, page, limit);

    res.json({
      success: true,
      data: {
        services: docs,
        pagination
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service
// @route   GET /api/v1/services/:id
// @access  Public
export const getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Service not found',
          code: 'SERVICE_NOT_FOUND'
        }
      });
    }

    res.json({
      success: true,
      data: { service }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create service
// @route   POST /api/v1/services
// @access  Private/Admin
export const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      data: { service }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service
// @route   PUT /api/v1/services/:id
// @access  Private/Admin
export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Service not found',
          code: 'SERVICE_NOT_FOUND'
        }
      });
    }

    res.json({
      success: true,
      data: { service }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service
// @route   DELETE /api/v1/services/:id
// @access  Private/Admin
export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Service not found',
          code: 'SERVICE_NOT_FOUND'
        }
      });
    }

    res.json({
      success: true,
      data: { message: 'Service deleted successfully' }
    });
  } catch (error) {
    next(error);
  }
};