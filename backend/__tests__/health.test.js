import request from 'supertest';
import app from '../src/app.js';

describe('Health Check', () => {
  test('GET /api/v1/health should return 200', async () => {
    const response = await request(app)
      .get('/api/v1/health')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('OK');
    expect(response.body.data.timestamp).toBeDefined();
    expect(response.body.data.uptime).toBeDefined();
  });

  test('GET /api/v1/nonexistent should return 404', async () => {
    const response = await request(app)
      .get('/api/v1/nonexistent')
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toContain('Route /api/v1/nonexistent not found');
    expect(response.body.error.code).toBe('ROUTE_NOT_FOUND');
  });
});