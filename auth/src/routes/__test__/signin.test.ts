import request from 'supertest';
import app from '../../app';

describe('Signin route', () => {
  it('returns a 200 status code on successful signin', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);

    const response = await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
  });

  it('returns a 400 status code with missing email or password', async () => {
    await request(app)
      .post('/api/users/signin')
      .send({
        password: 'password',
      })
      .expect(400);

    await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
      })
      .expect(400);
  });

  it('fails with an email that does not exist', async () => {
    await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(400);
  });

  it('fails when an incorrect password is supplied', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);

    await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'wrong password',
      })
      .expect(400);
  });

  // it('sets a cookie after successful signin', async () => {
  //   await request(app)
  //     .post('/api/users/signup')
  //     .send({
  //       email: 'test@test.com',
  //       password: 'password',
  //     })
  //     .expect(201);

  //   const response = await request(app)
  //     .post('/api/users/signin')
  //     .send({
  //       email: 'test@test.com',
  //       password: 'password',
  //     })
  //     .expect(200);

  // });
});
