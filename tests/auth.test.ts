import request from 'supertest';

import app from '../src/app';

describe('Auth: POST /auth/login', () => {
  it('fails with 400 when missing credentials', async () => {
    await request(app).post('/auth/login').send({}).expect(400);
  });

  it('fails with 401 for wrong credentials', async () => {
    await request(app).post('/auth/login').send({ username: 'demo1', password: 'wrong' }).expect(401);
  });

  it('succeeds with valid credentials and returns token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'demo1', password: 'password' })
      .expect(200);
    expect(typeof res.body.token).toBe('string');
  });
});

describe('Profile: GET /me', () => {
  it('requires auth', async () => {
    await request(app).get('/me').expect(401);
  });

  it('returns profile with valid token', async () => {
    const login = await request(app)
      .post('/auth/login')
      .send({ username: 'demo1', password: 'password' })
      .expect(200);
    const token = login.body.token as string;
    const res = await request(app).get('/me').set('Authorization', `Bearer ${token}`).expect(200);
    expect(res.body).toHaveProperty('firstName');
    expect(res.body).toHaveProperty('lastName');
    expect(res.body).toHaveProperty('alias');
  });
});
