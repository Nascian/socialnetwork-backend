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

  it('handles invalid pagination params gracefully', async () => {
    const login = await request(app)
      .post('/auth/login')
      .send({ username: 'demo1', password: 'password' })
      .expect(200);
    const token = login.body.token as string;
    const res = await request(app)
      .get('/posts?page=abc&pageSize=-10')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.page).toBe(1);
    expect(res.body.pageSize).toBeGreaterThan(0);
  });

  it('returns empty items for out-of-range page with proper metadata', async () => {
    const login = await request(app)
      .post('/auth/login')
      .send({ username: 'demo1', password: 'password' })
      .expect(200);
    const token = login.body.token as string;
    const first = await request(app)
      .get('/posts?page=1&pageSize=1')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const totalPages = first.body.totalPages as number;
    const res = await request(app)
      .get(`/posts?page=${totalPages + 10}&pageSize=1`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBe(0);
    expect(res.body.page).toBe(totalPages + 10);
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

describe('Posts: like/unlike', () => {
  it('likes and unlikes a post idempotently', async () => {
    const login = await request(app)
      .post('/auth/login')
      .send({ username: 'demo1', password: 'password' })
      .expect(200);
    const token = login.body.token as string;

    const list = await request(app)
      .get('/posts')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const id = list.body.items[0]?.id as string | undefined;
    expect(id).toBeTruthy();
    if (!id) return;

    const like1 = await request(app).post(`/posts/${id}/like`).set('Authorization', `Bearer ${token}`).expect(201);
    expect(like1.body.likedByMe).toBe(true);
    const like2 = await request(app).post(`/posts/${id}/like`).set('Authorization', `Bearer ${token}`).expect(200);
    expect(like2.body.likedByMe).toBe(true);

    const unlike1 = await request(app).delete(`/posts/${id}/like`).set('Authorization', `Bearer ${token}`).expect(200);
    expect(unlike1.body.likedByMe).toBe(false);
    const unlike2 = await request(app).delete(`/posts/${id}/like`).set('Authorization', `Bearer ${token}`).expect(200);
    expect(unlike2.body.likedByMe).toBe(false);
  });
});
