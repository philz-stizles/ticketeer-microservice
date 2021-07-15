import request from 'supertest';
import app from '../../app';

describe('Signup route', () => {
  it('returns a 201 status code on successful signup', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);
  });

  it('returns a 400 status code with missing email or password', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        password: 'password',
      })
      .expect(400);

    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
      })
      .expect(400);
  });

  it('disallows duplicate emails', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);

    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(400);
  });

  it('sets a cookie after successful signup', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
