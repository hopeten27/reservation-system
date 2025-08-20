import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Service from '../src/models/Service.js';
import Slot from '../src/models/Slot.js';
import Booking from '../src/models/Booking.js';
import dotenv from 'dotenv';

dotenv.config();

const createSampleData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Create sample user
    let user = await User.findOne({ email: 'john@example.com' });
    if (!user) {
      user = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        role: 'user'
      });
    }

    // Get existing service
    const service = await Service.findOne();
    if (!service) {
      console.log('No services found. Create a service first.');
      process.exit(1);
    }

    // Get existing slot
    const slot = await Slot.findOne({ service: service._id });
    if (!slot) {
      console.log('No slots found. Create a slot first.');
      process.exit(1);
    }

    // Create sample bookings
    const bookings = [
      {
        user: user._id,
        service: service._id,
        slot: slot._id,
        amount: service.price,
        status: 'confirmed',
        notes: 'Looking forward to the session!'
      },
      {
        user: user._id,
        service: service._id,
        slot: slot._id,
        amount: service.price,
        status: 'completed',
        notes: 'Great experience!'
      }
    ];

    for (const bookingData of bookings) {
      const existingBooking = await Booking.findOne({
        user: bookingData.user,
        service: bookingData.service,
        slot: bookingData.slot
      });
      
      if (!existingBooking) {
        await Booking.create(bookingData);
      }
    }

    console.log('Sample data created successfully!');
    console.log(`- User: ${user.email}`);
    console.log(`- Service: ${service.name}`);
    console.log(`- Bookings: ${bookings.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createSampleData();