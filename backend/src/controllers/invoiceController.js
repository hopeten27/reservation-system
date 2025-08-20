import { generateInvoicePDF } from '../services/invoiceService.js';
import Booking from '../models/Booking.js';

// @desc    Generate invoice PDF
// @route   GET /api/v1/invoices/:bookingId
// @access  Private
export const generateInvoice = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    // Get booking with populated data
    const booking = await Booking.findById(bookingId)
      .populate('user', 'name email')
      .populate('service', 'name description durationMinutes')
      .populate('slot', 'date');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Booking not found',
          code: 'BOOKING_NOT_FOUND'
        }
      });
    }

    // Check if user owns this booking or is admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Not authorized to access this invoice',
          code: 'UNAUTHORIZED'
        }
      });
    }

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(booking);
    
    if (!pdfBuffer || pdfBuffer.length === 0) {
      return res.status(500).json({
        success: false,
        error: {
          message: 'Failed to generate PDF',
          code: 'PDF_GENERATION_FAILED'
        }
      });
    }
    
    const invoiceNumber = `INV-${booking._id.toString().slice(-8).toUpperCase()}`;

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${invoiceNumber}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'no-cache');

    // Send PDF
    res.end(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

// @desc    Get invoice data (JSON)
// @route   GET /api/v1/invoices/:bookingId/data
// @access  Private
export const getInvoiceData = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate('user', 'name email')
      .populate('service', 'name description durationMinutes')
      .populate('slot', 'date');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Booking not found',
          code: 'BOOKING_NOT_FOUND'
        }
      });
    }

    // Check authorization
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Not authorized to access this invoice',
          code: 'UNAUTHORIZED'
        }
      });
    }

    const invoiceData = {
      invoiceNumber: `INV-${booking._id.toString().slice(-8).toUpperCase()}`,
      invoiceDate: new Date().toISOString(),
      booking: {
        id: booking._id,
        status: booking.status,
        amount: booking.amount,
        notes: booking.notes,
        paymentIntentId: booking.paymentIntentId,
        createdAt: booking.createdAt
      },
      customer: {
        name: booking.user.name,
        email: booking.user.email
      },
      service: {
        name: booking.service.name,
        description: booking.service.description,
        duration: booking.service.durationMinutes
      },
      appointment: {
        date: booking.slot.date,
        formattedDate: new Date(booking.slot.date).toLocaleDateString(),
        formattedTime: new Date(booking.slot.date).toLocaleTimeString()
      }
    };

    res.json({
      success: true,
      data: { invoice: invoiceData }
    });
  } catch (error) {
    next(error);
  }
};