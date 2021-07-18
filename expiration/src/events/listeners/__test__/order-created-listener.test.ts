// import mongoose from 'mongoose';
// import { Message } from 'node-nats-streaming';
// import { OrderCreatedEvent, OrderStatus } from '@devdezyn/common';
// import { OrderCreatedListener } from '../order-created-listener';
// import { natsWrapper } from '../../../nats-wrapper';
// import Ticket from '../../../models/ticket';

// const setup = async () => {
//   // Create an instance of the listener
//   const listener = new OrderCreatedListener(natsWrapper.client);

//   // Create and save a Ticket
//   const newTicket = Ticket.build({
//     title: 'Test Ticket',
//     price: 50,
//     userId: mongoose.Types.ObjectId().toHexString(),
//   });
//   await newTicket.save();

//   // Create a fake data event
//   const data: OrderCreatedEvent['data'] = {
//     id: mongoose.Types.ObjectId().toHexString(),
//     version: 0,
//     status: OrderStatus.Created,
//     userId: mongoose.Types.ObjectId().toHexString(),
//     expiresAt: 'mock expires',
//     ticket: {
//       id: newTicket.id,
//       price: newTicket.price,
//     },
//   };

//   // Create a fake message object
//   // @ts-ignore
//   const msg: Message = {
//     ack: jest.fn(),
//   };

//   return { listener, newTicket, data, msg };
// };

// describe('Order created listener', () => {
//   it('sets the orderId of the ticket', async () => {
//     const { listener, newTicket, data, msg } = await setup();

//     // Call the onMessage function with the data object + message object
//     await listener.onMessage(data, msg);

//     // Write assertions to make sure a ticket was created
//     const updatedTicket = await Ticket.findById(newTicket.id);

//     expect(updatedTicket!.orderId).toEqual(data.id);
//   });

//   it('publishes a ticket updated event', async () => {
//     const { listener, data, msg } = await setup();

//     // Call the onMessage function with the data object + message object
//     await listener.onMessage(data, msg);

//     // Write assertions to make sure a ticket was created
//     expect(natsWrapper.client.publish).toHaveBeenCalled();
//   });

//   it('acknowledges the message', async () => {
//     const { listener, data, msg } = await setup();

//     // Call the onMessage function with the data object + message object
//     await listener.onMessage(data, msg);

//     // Write assertions to make sure a ticket was created
//     expect(msg.ack).toHaveBeenCalled();
//   });
// });
