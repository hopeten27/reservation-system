import mongoose from 'mongoose';
import Slot from '../src/models/Slot.js';
import Service from '../src/models/Service.js';
import dotenv from 'dotenv';

dotenv.config();

const createSlots = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Get first service
    const service = await Service.findOne();
    if (!service) {
      console.log('No services found. Create a service first.');
      process.exit(1);
    }

    // Create slots for next 7 days
    const slots = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      // Morning slot
      const morningSlot = new Date(date);
      morningSlot.setHours(10, 0, 0, 0);
      
      // Afternoon slot
      const afternoonSlot = new Date(date);
      afternoonSlot.setHours(14, 0, 0, 0);
      
      slots.push(
        {
          service: service._id,
          date: morningSlot,
          capacity: 5,
          bookedCount: 0,
          status: 'open'
        },
        {
          service: service._id,
          date: afternoonSlot,
          capacity: 3,
          bookedCount: 0,
          status: 'open'
        }
      );
    }

    await Slot.insertMany(slots);
    console.log(`Created ${slots.length} slots for service: ${service.name}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createSlots();