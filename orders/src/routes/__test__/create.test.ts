import request from 'supertest';
import app from '../../app';
import mongoose from 'mongoose';
import Order, { OrderStatus } from '../../models/order';
import Ticket from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

describe('Create order route', () => {
  it('has a route handler listening to /api/orders for post requests', async () => {
    const response = await request(app).post('/api/orders').send({});
    expect(response.status).not.toEqual(404);
  });

  it('can only be accessed if the user is authenticated', async () => {
    await request(app).post('/api/orders').send({}).expect(401);
  });

  it('returns a status other than 401 if the user is authenticated', async () => {
    const cookie = global.signin();
    console.log(cookie);
    const response = await request(app)
      .post('/api/orders')
      .set('Cookie', cookie)
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it('returns an error if an invalid ticket ID is provided', async () => {
    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({})
      .expect(400);
    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: 'invalid id' })
      .expect(400);
  });

  it('returns an error if the ticket does not exist', async () => {
    const ticketId = mongoose.Types.ObjectId();

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId })
      .expect(404);
  });

  it('returns an error if the ticket is already reserved', async () => {
    const newTicket = Ticket.build({
      title: 'New Ticket',
      price: 20,
    });
    await newTicket.save();

    const newOrder = Order.build({
      status: OrderStatus.Created,
      expiresAt: new Date(),
      userId: 'userId',
      ticket: newTicket,
    });
    await newOrder.save();

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: newTicket.id })
      .expect(400);
  });

  it('creates an order and reserves a ticket', async () => {
    const newTicket = Ticket.build({
      title: 'New Ticket',
      price: 20,
    });
    await newTicket.save();

    const response = await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: newTicket.id })
      .expect(201);

    expect(response.body).toBeDefined();
    expect(typeof response.body.status).toBe('string');
    expect(typeof response.body.expiresAt).toBe('string');
    expect(response.body.ticket).toBeDefined();
    expect(response.body.ticket.id).toEqual(newTicket.id);
  });

  it('publishes an order created event', async () => {
    const newTicket = Ticket.build({
      title: 'New Ticket',
      price: 20,
    });
    await newTicket.save();

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: newTicket.id })
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
