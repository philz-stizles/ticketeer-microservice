import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import Ticket from '../../models/ticket';

describe('List orders route', () => {
  const orderId = mongoose.Types.ObjectId();
  it('has a route handler listening to /api/orders for get requests', async () => {
    const response = await request(app).get(`/api/orders/${orderId}`).send({});
    expect(response.status).not.toEqual(404);
  });

  it('can only be accessed if the user is authenticated', async () => {
    await request(app).get(`/api/orders/${orderId}`).send({}).expect(401);
  });

  it('returns a status other than 401 if the user is authenticated', async () => {
    const cookie = global.signin();
    const response = await request(app)
      .get(`/api/orders/${orderId}`)
      .set('Cookie', cookie)
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it("returns an error if a user tries to fetch another user's order", async () => {
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
      .get(`/api/orders/${newOrder.id}`)
      .set('Cookie', anotherUser)
      .expect(401);
  });

  it('fetches an order for a particular user', async () => {
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
    const { body: fetchedOrder } = await request(app)
      .get(`/api/orders/${newOrder.id}`)
      .set('Cookie', user)
      .expect(200);

    expect(fetchedOrder).toBeDefined();
    expect(fetchedOrder.id).toEqual(newOrder.id);
    expect(fetchedOrder.ticket.id).toEqual(newTicket.id);
  });
});
