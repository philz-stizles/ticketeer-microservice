import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import Ticket from '../../models/ticket';
import Order, { OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

describe('Cancel order route', () => {
  const orderId = mongoose.Types.ObjectId();
  it('has a route handler listening to /api/orders/orderId for delete requests', async () => {
    const response = await request(app)
      .delete(`/api/orders/${orderId}`)
      .send({});
    expect(response.status).not.toEqual(404);
  });

  it('can only be accessed if the user is authenticated', async () => {
    await request(app).delete(`/api/orders/${orderId}`).send({}).expect(401);
  });

  it('returns a status other than 401 if the user is authenticated', async () => {
    const cookie = global.signin();
    const response = await request(app)
      .delete(`/api/orders/${orderId}`)
      .set('Cookie', cookie)
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it("returns an error if a user tries to cancel another user's order", async () => {
    // Create a ticket
    const newTicket = Ticket.build({
      title: 'New Ticket',
      price: 20,
    });
    await newTicket.save();

    // Make a request to build an order from this ticket
    const user = global.signin();
    const { body: newOrder } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: newTicket.id })
      .expect(201);

    // Make request to fetch the order
    const anotherUser = global.signin();
    await request(app)
      .delete(`/api/orders/${newOrder.id}`)
      .set('Cookie', anotherUser)
      .expect(401);
  });

  it('marks an order as cancelled for a particular user', async () => {
    // Create a ticket
    const newTicket = Ticket.build({
      title: 'New Ticket',
      price: 20,
    });
    await newTicket.save();

    // Make a request to build an order from this ticket
    const user = global.signin();
    const { body: newOrder } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: newTicket.id })
      .expect(201);

    // Make request to cancel the order
    await request(app)
      .delete(`/api/orders/${newOrder.id}`)
      .set('Cookie', user)
      .expect(204);

    const updatedOrder = await Order.findById(newOrder.id);

    if (updatedOrder) {
      expect(updatedOrder.status).toEqual(OrderStatus.Cancelled);
    }
  });

  it('publishes an order cancelled event', async () => {
    // Create a ticket
    const newTicket = Ticket.build({
      title: 'New Ticket',
      price: 20,
    });
    await newTicket.save();

    // Make a request to build an order from this ticket
    const user = global.signin();
    const { body: newOrder } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: newTicket.id })
      .expect(201);

    // Make request to cancel the order
    await request(app)
      .delete(`/api/orders/${newOrder.id}`)
      .set('Cookie', user)
      .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
