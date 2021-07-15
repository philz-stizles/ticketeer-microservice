import request from 'supertest';
import app from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

describe('Update ticket route', () => {
  it('returns a 401 if the user is not authenticated', async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put(`/api/tickets/${nonExistentId}`)
      .send({ title: 'Test title', price: 20 })
      .expect(401);
  });

  it('returns a 404 if the provided id does not exist', async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put(`/api/tickets/${nonExistentId}`)
      .set('Cookie', global.signin())
      .send({ title: 'Test title', price: 20 })
      .expect(404);
  });

  it('returns a 401 if the user does not own the ticket', async () => {
    const newTicket = { title: 'Test title', price: 10 };

    const createResponse = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send(newTicket)
      .expect(201);

    // Try to update as a different user
    await request(app)
      .put(`/api/tickets/${createResponse.body.id}`)
      .set('Cookie', global.signin())
      .send({ title: 'Updated title', price: 50 })
      .expect(401);
  });

  it('returns a 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signin();

    const createResponse = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({ title: 'Test title', price: 50 });

    await request(app)
      .put(`/api/tickets/${createResponse.body.id}`)
      .set('Cookie', cookie)
      .send({ title: '', price: 50 })
      .expect(400);

    await request(app)
      .put(`/api/tickets/${createResponse.body.id}`)
      .set('Cookie', cookie)
      .send({ title: 'Updated title', price: -50 })
      .expect(400);
  });

  it('updates the ticket if valid inputs are provided', async () => {
    const cookie = global.signin();

    const createResponse = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({ title: 'Test title', price: 50 });

    const updatedTicket = { title: 'Updated test title', price: 100 };
    await request(app)
      .put(`/api/tickets/${createResponse.body.id}`)
      .set('Cookie', cookie)
      .send(updatedTicket)
      .expect(200);

    const readResponse = await request(app)
      .get(`/api/tickets/${createResponse.body.id}`)
      .send();
    expect(readResponse.body.title).toEqual(updatedTicket.title);
    expect(readResponse.body.price).toEqual(updatedTicket.price);
  });

  it('publishes an event', async () => {
    const cookie = global.signin();

    const createResponse = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({ title: 'Test title', price: 50 });

    const updatedTicket = { title: 'Updated test title', price: 100 };
    await request(app)
      .put(`/api/tickets/${createResponse.body.id}`)
      .set('Cookie', cookie)
      .send(updatedTicket)
      .expect(200);

    // console.log(natsWrapper);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
