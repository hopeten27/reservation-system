import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Service from '../src/models/Service.js';
import Slot from '../src/models/Slot.js';
import Booking from '../src/models/Booking.js';
import dotenv from 'dotenv';

dotenv.config();

const generateTestData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing test data (keep admin)
    await User.deleteMany({ role: 'user' });
    await Service.deleteMany({});
    await Slot.deleteMany({});
    await Booking.deleteMany({});
    console.log('Cleared existing test data');

    // Create test users
    const users = [];
    const userNames = [
      'Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Emma Brown',
      'Frank Miller', 'Grace Lee', 'Henry Taylor', 'Ivy Chen', 'Jack Anderson',
      'Kate Martinez', 'Liam Garcia', 'Maya Patel', 'Noah Rodriguez', 'Olivia Kim',
      'Paul Thompson', 'Quinn White', 'Ruby Jackson', 'Sam Williams', 'Tina Lopez'
    ];

    for (let i = 0; i < userNames.length; i++) {
      const name = userNames[i];
      const email = `${name.toLowerCase().replace(' ', '.')}@example.com`;
      
      const user = await User.create({
        name,
        email,
        password: 'Password123',
        role: 'user'
      });
      users.push(user);
    }
    console.log(`Created ${users.length} test users`);

    // Create test services
    const services = [];
    const serviceData = [
      {
        name: 'Hatha Yoga Class',
        description: 'Gentle yoga focusing on basic postures and breathing techniques',
        price: 25,
        durationMinutes: 60,
        category: 'Fitness'
      },
      {
        name: 'Deep Tissue Massage',
        description: 'Therapeutic massage targeting muscle tension and knots',
        price: 80,
        durationMinutes: 90,
        category: 'Wellness'
      },
      {
        name: 'Personal Training Session',
        description: 'One-on-one fitness training with certified trainer',
        price: 60,
        durationMinutes: 60,
        category: 'Fitness'
      },
      {
        name: 'Meditation Workshop',
        description: 'Guided meditation and mindfulness practice',
        price: 30,
        durationMinutes: 45,
        category: 'Wellness'
      },
      {
        name: 'Pilates Class',
        description: 'Core strengthening and flexibility workout',
        price: 35,
        durationMinutes: 50,
        category: 'Fitness'
      },
      {
        name: 'Nutrition Consultation',
        description: 'Personalized nutrition planning and dietary advice',
        price: 75,
        durationMinutes: 60,
        category: 'Health'
      },
      {
        name: 'Acupuncture Session',
        description: 'Traditional Chinese medicine treatment',
        price: 90,
        durationMinutes: 75,
        category: 'Health'
      },
      {
        name: 'Aromatherapy Massage',
        description: 'Relaxing massage with essential oils',
        price: 70,
        durationMinutes: 60,
        category: 'Wellness'
      }
    ];

    for (const serviceInfo of serviceData) {
      const service = await Service.create(serviceInfo);
      services.push(service);
    }
    console.log(`Created ${services.length} test services`);

    // Create test slots (next 14 days)
    const slots = [];
    const timeSlots = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00', '18:30'];
    
    for (let day = 0; day < 14; day++) {
      const date = new Date();
      date.setDate(date.getDate() + day);
      
      for (const service of services) {
        // Create 3-5 random time slots per service per day
        const numSlots = Math.floor(Math.random() * 3) + 3;
        const selectedTimes = timeSlots.sort(() => 0.5 - Math.random()).slice(0, numSlots);
        
        for (const timeStr of selectedTimes) {
          const [hours, minutes] = timeStr.split(':');
          const slotDate = new Date(date);
          slotDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          
          const slot = await Slot.create({
            service: service._id,
            date: slotDate,
            capacity: Math.floor(Math.random() * 5) + 3, // 3-7 capacity
            bookedCount: 0,
            status: 'open'
          });
          slots.push(slot);
        }
      }
    }
    console.log(`Created ${slots.length} test slots`);

    // Create test bookings
    const bookings = [];
    const statuses = ['confirmed', 'completed', 'cancelled'];
    const statusWeights = [0.6, 0.3, 0.1]; // 60% confirmed, 30% completed, 10% cancelled
    
    // Book 40-60% of slots randomly
    const slotsToBook = slots.sort(() => 0.5 - Math.random()).slice(0, Math.floor(slots.length * 0.5));
    
    for (const slot of slotsToBook) {
      const user = users[Math.floor(Math.random() * users.length)];
      const service = services.find(s => s._id.toString() === slot.service.toString());
      
      // Determine status based on weights
      let status = 'confirmed';
      const rand = Math.random();
      if (rand < statusWeights[2]) status = 'cancelled';
      else if (rand < statusWeights[2] + statusWeights[1]) status = 'completed';
      
      const notes = [
        'Looking forward to this session!',
        'First time trying this service.',
        'Please prepare for beginner level.',
        'I have some specific requirements.',
        'Excited for this appointment!',
        null, null, null // Some bookings without notes
      ];
      
      try {
        const booking = await Booking.create({
          user: user._id,
          service: service._id,
          slot: slot._id,
          amount: service.price,
          status,
          paymentIntentId: `pi_test_${Math.random().toString(36).substr(2, 9)}`,
          notes: notes[Math.floor(Math.random() * notes.length)]
        });
        
        // Update slot booked count
        if (status !== 'cancelled') {
          await Slot.findByIdAndUpdate(slot._id, {
            $inc: { bookedCount: 1 }
          });
        }
        
        bookings.push(booking);
      } catch (error) {
        // Skip duplicate bookings (same user + slot)
        continue;
      }
    }
    console.log(`Created ${bookings.length} test bookings`);

    // Summary
    console.log('\n=== TEST DATA GENERATION COMPLETE ===');
    console.log(`👥 Users: ${users.length}`);
    console.log(`🎯 Services: ${services.length}`);
    console.log(`📅 Slots: ${slots.length}`);
    console.log(`📋 Bookings: ${bookings.length}`);
    console.log(`💰 Total Revenue: $${bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.amount, 0)}`);
    
    const statusCounts = bookings.reduce((acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {});
    console.log('📊 Booking Status:', statusCounts);
    
    process.exit(0);
  } catch (error) {
    console.error('Error generating test data:', error);
    process.exit(1);
  }
};

generateTestData();