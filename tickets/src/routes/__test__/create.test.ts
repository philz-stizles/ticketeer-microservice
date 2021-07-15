import request from 'supertest';
import app from '../../app';
import Ticket from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

describe('Create ticket route', () => {
  it('has a route handler listening to /api/tickets for post requests', async () => {
    const response = await request(app).post('/api/tickets').send({});
    expect(response.status).not.toEqual(404);
  });

  it('can only be accessed if the user is authenticated', async () => {
    await request(app).post('/api/tickets').send({}).expect(401);
  });

  it('returns a status other than 401 if the user is authenticated', async () => {
    const cookie = global.signin();
    console.log(cookie);
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({});
    console.log('response.body', response.body);
    expect(response.status).not.toEqual(401);
  });

  it('returns an error if an invalid title is provided', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ title: '', price: 10 })
      .expect(400);
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ price: 10 })
      .expect(400);
  });

  it('returns an error if an invalid price is provided', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ title: 'Test title', price: -10 })
      .expect(400);
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ title: 'Test title' })
      .expect(400);
  });

  it('creates a new ticket if valid inputs are provided', async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const newTicket = { title: 'Test title', price: 10 };

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send(newTicket)
      .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].title).toEqual(newTicket.title);
    expect(tickets[0].price).toEqual(newTicket.price);
  });

  it('publishes an event', async () => {
    const newTicket = { title: 'Test title', price: 10 };

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send(newTicket)
      .expect(201);

    // console.log(natsWrapper);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
