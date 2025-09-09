import request from 'supertest';

import app from '../src/app';

describe('Posts: GET /posts', () => {
  it('requires auth', async () => {
    await request(app).get('/posts').expect(401);
  });

  it('returns paginated list with newest first when authorized', async () => {
    const login = await request(app)
      .post('/auth/login')
      .send({ username: 'demo1', password: 'password' })
      .expect(200);
    const token = login.body.token as string;
    const res = await request(app)
      .get('/posts?page=1&pageSize=5')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
    if (res.body.items.length > 0) {
      const first = res.body.items[0];
      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('message');
      expect(first).toHaveProperty('user');
      expect(first).toHaveProperty('likeCount');
      expect(first).toHaveProperty('likedByMe');
    }
    expect(res.body).toMatchObject({ page: 1, pageSize: 5 });
  });
});

describe('Posts: POST /posts', () => {
  it('requires auth', async () => {
    await request(app).post('/posts').send({ message: 'hi' }).expect(401);
  });

  it('validates message presence and length', async () => {
    const login = await request(app)
      .post('/auth/login')
      .send({ username: 'demo1', password: 'password' })
      .expect(200);
    const token = login.body.token as string;
    await request(app).post('/posts').set('Authorization', `Bearer ${token}`).send({ message: '' }).expect(400);
    await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'a'.repeat(281) })
      .expect(400);
  });

  it('creates a post and returns it', async () => {
    const login = await request(app)
      .post('/auth/login')
      .send({ username: 'demo1', password: 'password' })
      .expect(200);
    const token = login.body.token as string;
    const res = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'Nuevo post de prueba' })
      .expect(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.message).toBe('Nuevo post de prueba');
    expect(res.body).toHaveProperty('user');
  });
});
