import request from 'supertest';

import app from '../src/app';

describe('GET /health', () => {
  it('responds with ok and timestamp', async () => {
    const res = await request(app).get('/health').expect(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.timestamp).toBe('string');
  });
});
