import request from 'supertest';
import app from '../../app';
import mongoose from 'mongoose';

describe('Read ticket route', () => {
  it('returns a 404 if the ticket is not found', async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toHexString();

    await request(app).get(`/api/tickets/${nonExistentId}`).send().expect(404);
  });

  it('returns the ticket if the ticket is found', async () => {
    const newTicket = { title: 'Test title', price: 20 };
    const createResponse = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send(newTicket)
      .expect(201);

    const readResponse = await request(app)
      .get(`/api/tickets/${createResponse.body.id}`)
      .send()
      .expect(200);

    expect(readResponse.body.title).toEqual(newTicket.title);
    expect(readResponse.body.price).toEqual(newTicket.price);
  });
});
