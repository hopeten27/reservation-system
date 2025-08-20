import Service from '../models/Service.js';
import { buildQuery, paginate } from '../utils/queryHelpers.js';
import { cloudinary } from '../config/cloudinary.js';

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
    const serviceData = { 
      ...req.body,
      price: Number(req.body.price),
      durationMinutes: Number(req.body.durationMinutes),
      isActive: req.body.isActive === 'true'
    };
    
    if (req.file) {
      // Ensure Cloudinary is configured
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'booking-services',
            transformation: [
              { width: 800, height: 600, crop: 'fill' },
              { quality: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      
      serviceData.image = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id
      };
    }
    
    const service = await Service.create(serviceData);

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
    
    const updateData = { 
      ...req.body,
      price: Number(req.body.price),
      durationMinutes: Number(req.body.durationMinutes),
      isActive: req.body.isActive === 'true'
    };
    
    if (req.file) {
      // Ensure Cloudinary is configured
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      
      if (service.image?.publicId) {
        await cloudinary.uploader.destroy(service.image.publicId);
      }
      
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'booking-services',
            transformation: [
              { width: 800, height: 600, crop: 'fill' },
              { quality: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      
      updateData.image = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id
      };
    }
    
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: { service: updatedService }
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
    
    if (service.image?.publicId) {
      await cloudinary.uploader.destroy(service.image.publicId);
    }
    
    await Service.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: { message: 'Service deleted successfully' }
    });
  } catch (error) {
    next(error);
  }
};