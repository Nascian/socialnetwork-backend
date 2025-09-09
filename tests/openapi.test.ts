import request from 'supertest';

import app from '../src/app';

describe('OpenAPI exposure', () => {
  it('serves /openapi.json', async () => {
    const res = await request(app).get('/openapi.json').expect(200);
    expect(res.body).toHaveProperty('openapi');
    expect(res.body).toHaveProperty('paths');
  });
});
