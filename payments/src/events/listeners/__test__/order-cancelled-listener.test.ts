import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, OrderStatus } from '@devdezyn/common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import Order from '../../../models/order';

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // Build the order and save it to the database
  const newOrder = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: 'mock user id',
    version: 0,
  });
  await newOrder.save();

  // Create a fake data event
  const data: OrderCancelledEvent['data'] = {
    id: newOrder.id,
    version: 1,
    ticket: {
      id: 'mock ticket id',
    },
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, newOrder, data, msg };
};

describe('Order created listener', () => {
  it('updates the status of the order', async () => {
    const { listener, newOrder, data, msg } = await setup();

    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // Write assertions to make sure a ticket was created
    const updatedOrder = await Order.findById(newOrder.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  });

  it('acknowledges the message', async () => {
    const { listener, data, msg } = await setup();

    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // Write assertions to make sure a ticket was created
    expect(msg.ack).toHaveBeenCalled();
  });
});
