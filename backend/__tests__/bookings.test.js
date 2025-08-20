import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Service from '../src/models/Service.js';
import Slot from '../src/models/Slot.js';
import Booking from '../src/models/Booking.js';

describe('Bookings API', () => {
  let mongoServer;
  let userToken, adminToken;
  let service, slot;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Create users
    const userResponse = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test User',
        email: 'user@example.com',
        password: 'Password123'
      });
    userToken = userResponse.body.data.token;

    const adminResponse = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'Password123',
        role: 'admin'
      });
    adminToken = adminResponse.body.data.token;
  });

  beforeEach(async () => {
    await Service.deleteMany({});
    await Slot.deleteMany({});
    await Booking.deleteMany({});

    // Create test service and slot
    service = await Service.create({
      name: 'Test Service',
      description: 'Test service for booking',
      price: 100,
      durationMinutes: 60
    });

    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Tomorrow
    slot = await Slot.create({
      service: service._id,
      date: futureDate,
      capacity: 2
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  describe('POST /api/v1/bookings', () => {
    test('should create booking successfully', async () => {
      const bookingData = {
        service: service._id,
        slot: slot._id,
        notes: 'Test booking'
      };

      const response = await request(app)
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send(bookingData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.booking.amount).toBe(service.price);
      expect(response.body.data.booking.status).toBe('pending');

      // Check slot booked count updated
      const updatedSlot = await Slot.findById(slot._id);
      expect(updatedSlot.bookedCount).toBe(1);
    });

    test('should prevent duplicate booking', async () => {
      // Create first booking
      await request(app)
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          service: service._id,
          slot: slot._id
        });

      // Try to create duplicate
      const response = await request(app)
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          service: service._id,
          slot: slot._id
        })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('DUPLICATE_BOOKING');
    });

    test('should prevent booking when slot is full', async () => {
      // Fill the slot (capacity = 2)
      const user2Response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'User 2',
          email: 'user2@example.com',
          password: 'Password123'
        });

      const user3Response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'User 3',
          email: 'user3@example.com',
          password: 'Password123'
        });

      // First two bookings should succeed
      await request(app)
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ service: service._id, slot: slot._id });

      await request(app)
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${user2Response.body.data.token}`)
        .send({ service: service._id, slot: slot._id });

      // Third booking should fail
      const response = await request(app)
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${user3Response.body.data.token}`)
        .send({ service: service._id, slot: slot._id })
        .expect(409);

      expect(response.body.error.code).toBe('SLOT_NOT_AVAILABLE');
    });

    test('should prevent booking past slots', async () => {
      // Create past slot
      const pastSlot = await Slot.create({
        service: service._id,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        capacity: 1
      });

      const response = await request(app)
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          service: service._id,
          slot: pastSlot._id
        })
        .expect(409);

      expect(response.body.error.code).toBe('SLOT_IN_PAST');
    });
  });

  describe('PATCH /api/v1/bookings/:id/cancel', () => {
    test('should cancel booking successfully', async () => {
      // Create slot far in future (48 hours) to avoid cancellation deadline
      const farFutureSlot = await Slot.create({
        service: service._id,
        date: new Date(Date.now() + 48 * 60 * 60 * 1000),
        capacity: 1
      });

      // Create booking
      const booking = await Booking.create({
        user: (await User.findOne({ email: 'user@example.com' }))._id,
        service: service._id,
        slot: farFutureSlot._id,
        amount: service.price
      });

      // Update slot booked count
      farFutureSlot.bookedCount = 1;
      await farFutureSlot.save();

      const response = await request(app)
        .patch(`/api/v1/bookings/${booking._id}/cancel`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.booking.status).toBe('cancelled');

      // Check slot booked count decremented
      const updatedSlot = await Slot.findById(farFutureSlot._id);
      expect(updatedSlot.bookedCount).toBe(0);
    });

    test('should prevent cancellation after deadline', async () => {
      // Create slot starting in 12 hours (within 24h cancellation window)
      const nearFutureSlot = await Slot.create({
        service: service._id,
        date: new Date(Date.now() + 12 * 60 * 60 * 1000),
        capacity: 1
      });

      const booking = await Booking.create({
        user: (await User.findOne({ email: 'user@example.com' }))._id,
        service: service._id,
        slot: nearFutureSlot._id,
        amount: service.price
      });

      const response = await request(app)
        .patch(`/api/v1/bookings/${booking._id}/cancel`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(409);

      expect(response.body.error.code).toBe('CANCELLATION_DEADLINE_PASSED');
    });
  });

  describe('GET /api/v1/bookings', () => {
    test('should get user bookings with pagination', async () => {
      // Create bookings
      await Booking.create([
        {
          user: (await User.findOne({ email: 'user@example.com' }))._id,
          service: service._id,
          slot: slot._id,
          amount: service.price
        }
      ]);

      const response = await request(app)
        .get('/api/v1/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bookings).toHaveLength(1);
      expect(response.body.data.pagination).toBeDefined();
    });
  });
});