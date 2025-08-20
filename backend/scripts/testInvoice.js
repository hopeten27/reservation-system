import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Service from '../src/models/Service.js';
import Slot from '../src/models/Slot.js';
import Booking from '../src/models/Booking.js';
import { generateInvoicePDF } from '../src/services/invoiceService.js';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

const testInvoice = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get a test booking
    const booking = await Booking.findOne({ status: 'confirmed' })
      .populate('user', 'name email')
      .populate('service', 'name description durationMinutes')
      .populate('slot', 'date');

    if (!booking) {
      console.log('No confirmed booking found');
      process.exit(1);
    }

    console.log('Found booking:', booking._id);
    console.log('Generating PDF...');

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(booking);
    
    console.log('PDF generated, size:', pdfBuffer.length, 'bytes');

    // Save to file for testing
    const filename = `test-invoice-${booking._id}.pdf`;
    await fs.writeFile(filename, pdfBuffer);
    
    console.log(`PDF saved as: ${filename}`);
    console.log('Try opening this file to verify it works');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testInvoice();