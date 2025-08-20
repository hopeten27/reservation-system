import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Service from '../src/models/Service.js';

describe('Services API', () => {
  let mongoServer;
  let adminToken;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Create admin user
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
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  describe('GET /api/v1/services', () => {
    test('should get all services with pagination', async () => {
      // Create test services
      await Service.create([
        { name: 'Service 1', description: 'Test service 1', price: 100, durationMinutes: 60 },
        { name: 'Service 2', description: 'Test service 2', price: 200, durationMinutes: 90 }
      ]);

      const response = await request(app)
        .get('/api/v1/services?page=1&limit=10')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.services).toHaveLength(2);
      expect(response.body.data.pagination).toMatchObject({
        page: 1,
        limit: 10,
        totalDocs: 2,
        totalPages: 1
      });
    });

    test('should search services by text', async () => {
      await Service.create([
        { name: 'Yoga Class', description: 'Relaxing yoga session', price: 50, durationMinutes: 60 },
        { name: 'Massage', description: 'Deep tissue massage', price: 100, durationMinutes: 90 }
      ]);

      const response = await request(app)
        .get('/api/v1/services?search=yoga')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.services).toHaveLength(1);
      expect(response.body.data.services[0].name).toBe('Yoga Class');
    });
  });

  describe('POST /api/v1/services', () => {
    test('should create service as admin', async () => {
      const serviceData = {
        name: 'New Service',
        description: 'A new test service',
        price: 150,
        durationMinutes: 120
      };

      const response = await request(app)
        .post('/api/v1/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(serviceData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.service.name).toBe(serviceData.name);
    });

    test('should not create service without admin role', async () => {
      // Create regular user
      const userResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Regular User',
          email: 'user@example.com',
          password: 'Password123'
        });

      const response = await request(app)
        .post('/api/v1/services')
        .set('Authorization', `Bearer ${userResponse.body.data.token}`)
        .send({
          name: 'Unauthorized Service',
          description: 'Should not be created',
          price: 100,
          durationMinutes: 60
        })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INSUFFICIENT_PERMISSIONS');
    });
  });

  describe('PUT /api/v1/services/:id', () => {
    test('should update service as admin', async () => {
      const service = await Service.create({
        name: 'Original Service',
        description: 'Original description',
        price: 100,
        durationMinutes: 60
      });

      const updateData = {
        name: 'Updated Service',
        price: 150
      };

      const response = await request(app)
        .put(`/api/v1/services/${service._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.service.name).toBe(updateData.name);
      expect(response.body.data.service.price).toBe(updateData.price);
    });
  });

  describe('DELETE /api/v1/services/:id', () => {
    test('should delete service as admin', async () => {
      const service = await Service.create({
        name: 'Service to Delete',
        description: 'Will be deleted',
        price: 100,
        durationMinutes: 60
      });

      const response = await request(app)
        .delete(`/api/v1/services/${service._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toContain('deleted');

      // Verify deletion
      const deletedService = await Service.findById(service._id);
      expect(deletedService).toBeNull();
    });
  });
});