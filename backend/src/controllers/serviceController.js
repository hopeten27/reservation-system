import Service from '../models/Service.js';
import { buildQuery, paginate } from '../utils/queryHelpers.js';
import { cloudinary } from '../config/cloudinary.js';

// @desc    Get all services
// @route   GET /api/v1/services
// @access  Public
export const getServices = async (req, res, next) => {
  try {
    const { query, page, limit } = buildQuery(req.query, Service);
    
    // Use lean for better performance
    query.lean();
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
    const service = await Service.findById(req.params.id).lean();

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
    
    // Ensure Cloudinary is configured
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    
    // Handle main image
    if (req.files?.image?.[0]) {
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
        stream.end(req.files.image[0].buffer);
      });
      
      serviceData.image = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id
      };
    }
    
    // Handle additional images
    if (req.files?.additionalImages) {
      const additionalImages = [];
      for (const file of req.files.additionalImages) {
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
          stream.end(file.buffer);
        });
        
        additionalImages.push({
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id
        });
      }
      serviceData.additionalImages = additionalImages;
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
    
    // Ensure Cloudinary is configured
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    
    // Handle main image update
    if (req.files?.image?.[0]) {
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
        stream.end(req.files.image[0].buffer);
      });
      
      updateData.image = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id
      };
    }
    
    // Handle additional images update
    if (req.files?.additionalImages) {
      // Delete existing additional images
      if (service.additionalImages?.length > 0) {
        for (const img of service.additionalImages) {
          if (img.publicId) {
            await cloudinary.uploader.destroy(img.publicId);
          }
        }
      }
      
      const additionalImages = [];
      for (const file of req.files.additionalImages) {
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
          stream.end(file.buffer);
        });
        
        additionalImages.push({
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id
        });
      }
      updateData.additionalImages = additionalImages;
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
    
    // Delete main image
    if (service.image?.publicId) {
      await cloudinary.uploader.destroy(service.image.publicId);
    }
    
    // Delete additional images
    if (service.additionalImages?.length > 0) {
      for (const img of service.additionalImages) {
        if (img.publicId) {
          await cloudinary.uploader.destroy(img.publicId);
        }
      }
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