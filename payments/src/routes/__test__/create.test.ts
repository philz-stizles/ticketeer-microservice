import request from 'supertest';
import app from '../../app';
import mongoose from 'mongoose';
import Order from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import { OrderStatus } from '@devdezyn/common';

describe('Create payment route', () => {
  it('has a route handler listening to /api/payments for post requests', async () => {
    const response = await request(app).post('/api/payments').send({});
    expect(response.status).not.toEqual(404);
  });

  it('can only be accessed if the user is authenticated', async () => {
    await request(app).post('/api/payments').send({}).expect(401);
  });

  it('returns a status other than 401 if the user is authenticated', async () => {
    const cookie = global.signin();
    console.log(cookie);
    const response = await request(app)
      .post('/api/payments')
      .set('Cookie', cookie)
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it('returns an error if an invalid order ID is provided', async () => {
    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin())
      .send({})
      .expect(400);
    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin())
      .send({ ticketId: 'invalid id' })
      .expect(400);
  });

  it('returns a 404 error when trying to purchase an order that does not exist', async () => {
    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin())
      .send({ token: 'mock token', orderId: mongoose.Types.ObjectId().toHexString() })
      .expect(404);
  });

  it('returns a 401 error when trying to purchase an order that does not belong to the user', async () => {
    // Create new order for the Payments service
    const newOrder = Order.build({
      id: mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Created,
      userId: mongoose.Types.ObjectId().toHexString(),,
      price: 30,
      version: 0,
    });
    await newOrder.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin())
      .send({ token: 'mock token', orderId: newOrder.id })
      .expect(401);
  });

  it('returns a 400 error when trying to purchase a cancelled order', async () => {
    // Generate a user id
    const userId = mongoose.Types.ObjectId().toHexString()

    // Create new order for the Payments service
    const newOrder = Order.build({
      id: mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Cancelled,
      userId,
      price: 30,
      version: 0,
    });
    await newOrder.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin(userId))
      .send({ token: 'mock token', orderId: newOrder.id })
      .expect(400);
  });
});
