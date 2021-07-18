import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from '@devdezyn/common';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import Ticket from '../../../models/ticket';

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create and save a ticket
  const newTicket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'New Ticket',
    price: 20,
  });
  await newTicket.save();

  // Create a fake data event
  const data: TicketUpdatedEvent['data'] = {
    version: newTicket.version + 1,
    id: newTicket.id,
    title: 'Concert',
    price: 100,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, newTicket };
};

describe('Ticket Updated listener', () => {
  it('finds, updates and saves a ticket', async () => {
    const { listener, data, msg, newTicket } = await setup();
    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // Write assertions to make sure a ticket was updated
    const updatedTicket = await Ticket.findById(newTicket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
  });

  it('acknowledges the message', async () => {
    const { listener, data, msg } = await setup();
    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // Write assertions to make sure a ticket was updated
    expect(msg.ack).toHaveBeenCalled();
  });

  it('does not call ack() if the event is out of order', async () => {
    const { listener, data, msg } = await setup();

    // Set the version to a high version
    data.version = 10;

    // Call the onMessage function with the data object + message object
    try {
      await listener.onMessage(data, msg);
    } catch (error) {}

    // Write assertions to make sure a ticket was updated
    expect(msg.ack).not.toHaveBeenCalled();
  });
});
