import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, OrderStatus } from '@devdezyn/common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import Ticket from '../../../models/ticket';

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // Create and save a Ticket
  const orderId = mongoose.Types.ObjectId().toHexString();
  const newTicket = Ticket.build({
    title: 'Test Ticket',
    price: 50,
    userId: mongoose.Types.ObjectId().toHexString(),
  });
  newTicket.set({ orderId });
  await newTicket.save();

  // Create a fake data event
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: newTicket.id,
    },
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, newTicket, orderId, data, msg };
};

describe('Order created listener', () => {
  it('sets the orderId of the ticket', async () => {
    const { listener, newTicket, data, msg } = await setup();

    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // Write assertions to make sure a ticket was created
    const updatedTicket = await Ticket.findById(newTicket.id);

    expect(updatedTicket!.orderId).not.toBeDefined();
  });

  it('publishes a ticket updated event', async () => {
    const { listener, data, msg } = await setup();

    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // Write assertions to make sure a ticket was created
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });

  it('acknowledges the message', async () => {
    const { listener, data, msg } = await setup();

    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // Write assertions to make sure a ticket was created
    expect(msg.ack).toHaveBeenCalled();
  });
});
