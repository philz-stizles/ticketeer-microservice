import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import Ticket from '../../models/ticket';

const buildTicket = async () => {
  const newTicket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'New Ticket',
    price: 20,
  });
  await newTicket.save();
  return newTicket;
};

describe('List orders route', () => {
  it('has a route handler listening to /api/orders for get requests', async () => {
    const response = await request(app).get('/api/orders').send({});
    expect(response.status).not.toEqual(404);
  });

  it('can only be accessed if the user is authenticated', async () => {
    await request(app).get('/api/orders').send({}).expect(401);
  });

  it('returns a status other than 401 if the user is authenticated', async () => {
    const cookie = global.signin();
    const response = await request(app)
      .get('/api/orders')
      .set('Cookie', cookie)
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it('fetches orders for a particular user', async () => {
    // Create 3 tickets
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    // Create on order as User #1
    const userOne = global.signin();
    await request(app)
      .post('/api/orders')
      .set('Cookie', userOne)
      .send({ ticketId: ticketOne.id })
      .expect(201);

    // Create two orders as User #2
    const userTwo = global.signin();
    const orderResponseOne = await request(app)
      .post('/api/orders')
      .set('Cookie', userTwo)
      .send({ ticketId: ticketTwo.id })
      .expect(201);
    const orderResponseTwo = await request(app)
      .post('/api/orders')
      .set('Cookie', userTwo)
      .send({ ticketId: ticketThree.id })
      .expect(201);

    const response = await request(app)
      .get('/api/orders')
      .set('Cookie', userTwo)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderResponseOne.body.id);
    expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
    expect(response.body[1].id).toEqual(orderResponseTwo.body.id);
    expect(response.body[1].ticket.id).toEqual(ticketThree.id);
  });
});
