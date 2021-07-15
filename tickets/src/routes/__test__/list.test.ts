import request from 'supertest';
import app from '../../app';

const createTicket = (title: string) =>
  request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title, price: 20 })
    .expect(201);

describe('List tickets route', () => {
  it('can fetch a list of tickets', async () => {
    await createTicket('Test title 1');
    await createTicket('Test title 2');
    await createTicket('Test title 3');
    const response = await request(app).get(`/api/tickets`).send().expect(200);
    expect(response.body.length).toEqual(3);
  });
});
