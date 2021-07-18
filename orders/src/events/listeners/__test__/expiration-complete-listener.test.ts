import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ExpirationCompleteEvent, OrderStatus } from '@devdezyn/common';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { natsWrapper } from '../../../nats-wrapper';
import Ticket from '../../../models/ticket';
import Order from '../../../models/order';

const setup = async () => {
  // Create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  // Create and save a ticket
  const newTicket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'New Ticket',
    price: 20,
  });
  await newTicket.save();

  // Create and save an order
  const newOrder = Order.build({
    status: OrderStatus.Created,
    expiresAt: new Date(),
    userId: mongoose.Types.ObjectId().toHexString(),
    ticket: newTicket,
  });
  await newOrder.save();

  // Create a fake data event
  const data: ExpirationCompleteEvent['data'] = {
    orderId: newOrder.id,
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, newOrder };
};

describe('Expiration complete listener', () => {
  it('finds, updates and saves an order', async () => {
    const { listener, data, msg, newOrder } = await setup();

    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // Find the updated Order
    const updatedOrder = await Order.findById(newOrder.id);

    // Write assertions to make sure a Order was updated
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  });

  it('emits an OrderCancelled event', async () => {
    const { listener, data, msg, newOrder } = await setup();

    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    // Write assertions to make sure the event was published
    const eventData = JSON.parse(
      (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );
    expect(eventData.id).toEqual(newOrder.id);
  });

  it('acknowledges the message', async () => {
    const { listener, data, msg } = await setup();
    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
