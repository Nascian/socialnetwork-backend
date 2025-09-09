import request from 'supertest';

import app from '../src/app';

describe('Profile stats: GET /me/stats', () => {
  it('requires auth', async () => {
    await request(app).get('/me/stats').expect(401);
  });

  it('returns posts, likesGiven and likesReceived', async () => {
    const login = await request(app)
      .post('/auth/login')
      .send({ username: 'demo1', password: 'password' })
      .expect(200);
    const token = login.body.token as string;
    const res = await request(app).get('/me/stats').set('Authorization', `Bearer ${token}`).expect(200);
    expect(res.body).toHaveProperty('posts');
    expect(res.body).toHaveProperty('likesGiven');
    expect(res.body).toHaveProperty('likesReceived');
  });
});
